import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import type { IStorage } from "./storage";
import { insertCompanySchema, insertQuoteSchema } from "@shared/schema";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import bcrypt from "bcryptjs";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import multer from "multer";
import path from "path";
import { Resend } from 'resend';

export async function registerRoutes(app: Express, storage: IStorage): Promise<Server> {
  // Setup auth but don't force it globally
  await setupAuth(app, storage);

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
      files: 5, // Max 5 files
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
      }
    },
  });

  // Diagnostic endpoint to check auth state
  app.get('/api/auth/debug', async (req: any, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      hasUser: !!req.user,
      hasClaims: !!req.user?.claims,
      sessionID: req.sessionID,
      hostname: req.hostname,
      protocol: req.protocol,
    });
  });

  // Simple login endpoint
  app.post('/api/auth/simple-login', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      // Check admin credentials
      if (role === 'admin') {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          // Generate a simple auth token (just base64 encoded for now)
          const token = Buffer.from(`admin:${email}:${Date.now()}`).toString('base64');
          
          return res.json({ 
            success: true, 
            token,
            user: { email, isAdmin: true, role: 'admin' }
          });
        }
      }
      
      // For business owners, check if they exist in the system
      if (role === 'business') {
        const owner = await storage.getBusinessOwnerByEmail(email);
        
        if (!owner) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, owner.passwordHash);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate auth token
        const token = Buffer.from(`business:${email}:${owner.id}:${Date.now()}`).toString('base64');
        
        return res.json({ 
          success: true, 
          token,
          user: { email, isAdmin: false, role: 'business', ownerId: owner.id, companyId: owner.companyId }
        });
      }
      
      res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Check if user is logged in
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check for Bearer token in Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const decoded = Buffer.from(token, 'base64').toString();
          const parts = decoded.split(':');
          const type = parts[0];
          const email = parts[1];
          
          if (type === 'admin' && email === process.env.ADMIN_EMAIL) {
            return res.json({ email, isAdmin: true, role: 'admin' });
          }
          
          if (type === 'business') {
            const ownerId = parseInt(parts[2]);
            const owner = await storage.getBusinessOwnerByEmail(email);
            if (owner && owner.id === ownerId) {
              return res.json({ 
                email, 
                isAdmin: false, 
                role: 'business', 
                ownerId: owner.id, 
                companyId: owner.companyId 
              });
            }
          }
        } catch (e) {
          // Invalid token, continue
        }
      }
      
      // Check simple auth session (legacy)
      if (req.session?.user) {
        return res.json(req.session.user);
      }
      
      // Check if user is authenticated via Replit OAuth (legacy)
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        return res.json(user);
      }
      
      // Return null for unauthenticated users (no error)
      res.json(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.json(null);
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', async (req: any, res) => {
    try {
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        res.json({ success: true });
      });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // Config endpoint - exposes referer-restricted API key to frontend
  app.get('/api/config', (req, res) => {
    res.json({
      googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    });
  });

  // Simple auth middleware
  const requireSimpleAuth = (req: any, res: any, next: any) => {
    // Check Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [type] = decoded.split(':');
        if (type === 'admin' || type === 'business') {
          return next();
        }
      } catch (e) {}
    }
    
    // Check session (legacy)
    if (req.session?.user) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  };

  const requireSimpleAdmin = (req: any, res: any, next: any) => {
    // Check Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [type, email] = decoded.split(':');
        if (type === 'admin' && email === process.env.ADMIN_EMAIL) {
          return next();
        }
      } catch (e) {}
    }
    
    // Check session (legacy)
    if (req.session?.user?.isAdmin) {
      return next();
    }
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  };

  const requireBusinessAuth = (req: any, res: any, next: any) => {
    // Check Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        const parts = decoded.split(':');
        if (parts[0] === 'business' && parts.length >= 3) {
          req.businessOwnerEmail = parts[1];
          req.businessOwnerId = parseInt(parts[2]);
          return next();
        }
      } catch (e) {}
    }
    res.status(401).json({ error: 'Unauthorized - Business owner access required' });
  };

  // Get cities with companies for a state
  app.get("/api/cities", async (req, res) => {
    try {
      const { state } = req.query;
      
      if (!state) {
        return res.status(400).json({ error: "State parameter required" });
      }
      
      const cities = await storage.getCitiesForState(state as string);
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  // Search for which state has a specific city
  app.get("/api/search-city", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city) {
        return res.status(400).json({ error: "City parameter required" });
      }
      
      const result = await storage.findStateForCity(city as string);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to search city" });
    }
  });

  // Public company routes
  app.get("/api/companies", async (req, res) => {
    try {
      const { local, city, state } = req.query;
      
      let companies;
      if (city && state) {
        companies = await storage.getCompaniesByCity(city as string, state as string);
      } else if (local === "true") {
        companies = await storage.getCompaniesByLocal(true);
      } else if (local === "false") {
        companies = await storage.getCompaniesByLocal(false);
      } else {
        companies = await storage.getApprovedCompanies();
      }
      
      // Temporarily disabled image URL conversion - serving via server proxy for now
      // const objectStorageService = new ObjectStorageService();
      // const companiesWithSignedURLs = await Promise.all(companies.map(async (company) => {
      //   const [logoUrl, galleryUrls] = await Promise.all([
      //     company.logoUrl ? objectStorageService.getPublicObjectURL(company.logoUrl) : null,
      //     objectStorageService.convertObjectPathsToPublicURLs(company.galleryImages)
      //   ]);
      //   
      //   return {
      //     ...company,
      //     logoUrl,
      //     galleryImages: galleryUrls
      //   };
      // }));
      
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  // Get current user's companies (must be before /:id route)
  app.get("/api/companies/my", requireSimpleAuth, async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      console.log('GET /api/companies/my - Auth header:', authHeader);
      let userId = null;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = Buffer.from(token, 'base64').toString();
        console.log('Decoded token:', decoded);
        const parts = decoded.split(':');
        const type = parts[0];
        
        // For admin, return empty array
        if (type === 'admin') {
          console.log('Admin user - returning empty array');
          return res.json([]);
        }
        
        // For business owner, get their company
        if (type === 'business') {
          const email = parts[1];
          console.log('Business owner email:', email);
          const owner = await storage.getBusinessOwnerByEmail(email);
          console.log('Found owner:', owner);
          if (owner && owner.companyId) {
            const company = await storage.getCompanyById(owner.companyId);
            console.log('Found company:', company);
            return res.json(company ? [company] : []);
          }
          console.log('No owner or companyId found');
          return res.json([]);
        }
      }
      
      if (req.isAuthenticated && req.isAuthenticated()) {
        userId = req.user?.claims?.sub;
      }
      
      if (!userId) {
        return res.json([]);
      }
      
      const companies = await storage.getCompaniesByUserId(userId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch your companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  // Create company (authenticated users)
  app.post("/api/companies", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user?.claims?.sub : null;
      console.log("Received company data:", req.body);
      
      const { email, password, ...companyData } = req.body;
      
      // Check if business owner email already exists
      if (email) {
        const existingOwner = await storage.getBusinessOwnerByEmail(email);
        if (existingOwner) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }
      
      const data = insertCompanySchema.parse({
        ...companyData,
        userId,
      });
      
      const company = await storage.createCompany(data);
      
      // If email and password provided, create business owner
      if (email && password) {
        const passwordHash = await bcrypt.hash(password, 10);
        const ownerData = {
          email: email as string,
          passwordHash: passwordHash,
          companyId: company.id as number,
        };
        const owner = await storage.createBusinessOwner(ownerData);
        
        // Return with auth token
        const token = Buffer.from(`business:${email}:${owner.id}:${Date.now()}`).toString('base64');
        return res.status(201).json({ 
          company, 
          token,
          user: { email, isAdmin: false, role: 'business', ownerId: owner.id, companyId: company.id }
        });
      }
      
      res.status(201).json({ company });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.issues);
        return res.status(400).json({ error: "Invalid company data", details: error.issues });
      }
      console.error("Server error:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  // Quote submission route
  app.post("/api/quotes", upload.array('photos', 5), async (req, res) => {
    try {
      const { companyId, customerName, customerEmail, customerPhone, message } = req.body;
      
      // Validate required fields
      if (!companyId || !customerName || !customerEmail || !customerPhone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate company exists
      const company = await storage.getCompanyById(parseInt(companyId));
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Upload photos to object storage
      const photoUrls: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        const objectStorage = new ObjectStorageService();
        
        for (const file of req.files) {
          const filename = `quote-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
          const objectPath = `/.private/quotes/${filename}`;
          
          // Upload to object storage
          await objectStorage.uploadObject(objectPath, file.buffer);
          photoUrls.push(objectPath);
        }
      }

      // Create quote in database
      const quoteData = insertQuoteSchema.parse({
        companyId: parseInt(companyId),
        customerName,
        customerEmail,
        customerPhone,
        message: message || null,
        photoUrls: photoUrls.length > 0 ? photoUrls : null,
      });

      const quote = await storage.createQuote(quoteData);

      // Send email to business
      if (process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          
          // Get business email (use contactEmail or default)
          const businessEmail = company.contactEmail || 'noreply@example.com';
          
          // Build email content
          let emailHtml = `
            <h2>New Quote Request</h2>
            <p>You have received a new quote request from a customer!</p>
            
            <h3>Customer Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${customerName}</li>
              <li><strong>Email:</strong> ${customerEmail}</li>
              <li><strong>Phone:</strong> ${customerPhone}</li>
            </ul>
          `;
          
          if (message) {
            emailHtml += `
              <h3>Customer Message:</h3>
              <p>${message}</p>
            `;
          }
          
          if (photoUrls.length > 0) {
            emailHtml += `
              <h3>Photos:</h3>
              <p>The customer included ${photoUrls.length} photo(s) with their request.</p>
              <p><em>Photos are stored securely and can be viewed in your business dashboard.</em></p>
            `;
          }
          
          emailHtml += `
            <hr>
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review the customer's request</li>
              <li>Contact them at ${customerPhone} or ${customerEmail}</li>
              <li>Provide them with a detailed quote</li>
            </ol>
            
            <p>Thank you for using our platform!</p>
          `;
          
          await resend.emails.send({
            from: 'Junk Removal Directory <onboarding@resend.dev>',
            to: businessEmail,
            subject: `New Quote Request from ${customerName}`,
            html: emailHtml,
          });
          
          console.log(`Quote request email sent to ${businessEmail}`);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.status(201).json({ 
        success: true,
        quote,
        message: "Quote request submitted successfully" 
      });
    } catch (error) {
      console.error("Quote submission error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid quote data", details: error.issues });
      }
      res.status(500).json({ error: "Failed to submit quote request" });
    }
  });

  // Admin routes
  app.get("/api/admin/companies/pending", requireSimpleAdmin, async (req, res) => {
    try {
      const companies = await storage.getPendingCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending companies" });
    }
  });

  app.patch("/api/admin/companies/:id/status", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      if (!['approved', 'denied', 'pending'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const company = await storage.updateCompanyStatus(id, status);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company status" });
    }
  });

  // Update company (owner or admin)
  app.patch("/api/companies/:id", requireSimpleAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Check Bearer token auth
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const decoded = Buffer.from(token, 'base64').toString();
          const parts = decoded.split(':');
          const type = parts[0];
          const email = parts[1];
          
          console.log('PATCH Auth - Decoded token:', { type, email, companyId: id });
          
          // Admin can edit anything
          if (type === 'admin' && email === process.env.ADMIN_EMAIL) {
            const updatedCompany = await storage.updateCompany(id, req.body);
            return res.json(updatedCompany);
          }
          
          // Business owner can only edit their own company
          if (type === 'business') {
            const owner = await storage.getBusinessOwnerByEmail(email);
            console.log('PATCH Auth - Owner found:', { ownerEmail: owner?.email, ownerCompanyId: owner?.companyId, requestedId: id });
            if (owner && owner.companyId === id) {
              const updatedCompany = await storage.updateCompany(id, req.body);
              return res.json(updatedCompany);
            }
            return res.status(403).json({ error: `You can only edit your own company. Your company ID: ${owner?.companyId}, Requested: ${id}` });
          }
        } catch (e) {
          console.error('Token decode error:', e);
          return res.status(401).json({ error: "Invalid token" });
        }
      }

      // Check session auth (legacy)
      if (req.session?.user) {
        if (req.session.user.isAdmin) {
          const updatedCompany = await storage.updateCompany(id, req.body);
          return res.json(updatedCompany);
        }
      }

      return res.status(403).json({ error: "Forbidden: You can only edit your own companies" });
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Delete company (admin only)
  app.delete("/api/companies/:id", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log('DELETE request for company:', id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const success = await storage.deleteCompany(id);
      console.log('Delete operation result:', success);
      
      if (!success) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json({ success: true, message: "Company deleted successfully" });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ error: "Failed to delete company", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get user's companies
  app.get("/api/user/companies", requireSimpleAuth, async (req: any, res) => {
    try {
      // TODO: Implement user-company relationship
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user companies" });
    }
  });

  // Get active companies (admin only)
  app.get("/api/admin/companies/active", requireSimpleAdmin, async (req, res) => {
    try {
      const companies = await storage.getApprovedCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active companies" });
    }
  });

  // Invite admin (admin only)
  app.post("/api/admin/invite", requireSimpleAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Valid email is required" });
      }

      const result = await storage.makeUserAdmin(email);
      
      if (!result) {
        return res.status(404).json({ error: "User with this email not found. User must sign up first." });
      }

      res.json({ message: "User granted admin access successfully", user: result });
    } catch (error) {
      console.error("Error inviting admin:", error);
      res.status(500).json({ error: "Failed to invite admin" });
    }
  });

  // Payment Management Routes
  app.post("/api/admin/companies/:id/send-reminder", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // TODO: Implement actual email sending
      console.log(`Sending payment reminder to ${company.name} at ${company.phone}`);
      
      res.json({ 
        success: true, 
        message: `Payment reminder sent to ${company.name}` 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to send payment reminder" });
    }
  });

  app.post("/api/admin/companies/:id/send-warning", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { message: customMessage } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Increment warning count
      const warnings = (company.paymentWarnings || 0) + 1;
      await storage.updateCompany(id, { 
        paymentWarnings: warnings,
        subscriptionStatus: 'past_due' as any
      } as any);

      // Create notification for business owner
      const warningMessage = customMessage || `This is warning #${warnings} regarding your account status. Please address the issues to avoid service interruption.`;
      await storage.createNotification({
        companyId: id,
        type: 'warning',
        title: `Warning #${warnings}`,
        message: warningMessage,
        isRead: false,
        metadata: { warningCount: warnings },
      });

      console.log(`Warning #${warnings} sent to ${company.name}`);
      
      res.json({ 
        success: true, 
        message: `Warning sent to ${company.name} (Warning #${warnings})`,
        warnings
      });
    } catch (error) {
      console.error("Error sending warning:", error);
      res.status(500).json({ error: "Failed to send warning" });
    }
  });

  app.post("/api/admin/companies/:id/confirm-review-count", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Create notification for business owner
      await storage.createNotification({
        companyId: id,
        type: 'review_confirmation',
        title: 'Review Count Confirmed',
        message: `Your review count has been verified and confirmed at ${company.reviews} reviews with a ${company.rating} rating. Keep up the great work!`,
        isRead: false,
        metadata: { 
          reviewCount: company.reviews,
          rating: company.rating,
          confirmedAt: new Date().toISOString(),
        },
      });

      console.log(`Review count confirmed for ${company.name}: ${company.reviews} reviews`);
      
      res.json({ 
        success: true, 
        message: `Review count confirmed for ${company.name}`,
        company
      });
    } catch (error) {
      console.error("Error confirming review count:", error);
      res.status(500).json({ error: "Failed to confirm review count" });
    }
  });

  app.post("/api/admin/companies/:id/cancel-subscription", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.updateCompany(id, { 
        subscriptionStatus: 'cancelled',
        subscriptionTier: 'free',
        status: 'denied'
      } as any);

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json({ 
        success: true, 
        message: `Subscription cancelled for ${company.name}`,
        company
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  app.post("/api/admin/companies/:id/reactivate", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.updateCompany(id, { 
        subscriptionStatus: 'active',
        paymentWarnings: 0,
        status: 'approved'
      } as any);

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json({ 
        success: true, 
        message: `Subscription reactivated for ${company.name}`,
        company
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to reactivate subscription" });
    }
  });

  app.patch("/api/admin/companies/:id/display-order", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const { displayOrder } = req.body;
      if (typeof displayOrder !== 'number') {
        return res.status(400).json({ error: "Display order must be a number" });
      }

      const company = await storage.updateCompany(id, { displayOrder } as any);

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json({ 
        success: true, 
        message: `Display order updated for ${company.name}`,
        company
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update display order" });
    }
  });

  app.patch("/api/admin/companies/:id/badge", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const { badge } = req.body;

      const company = await storage.updateCompany(id, { badge } as any);

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json({ 
        success: true, 
        message: badge ? `Badge "${badge}" added to ${company.name}` : `Badge removed from ${company.name}`,
        company
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update badge" });
    }
  });

  // Business owner profile endpoints
  app.get("/api/business/profile", async (req: any, res) => {
    const startTime = Date.now();
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.substring(7);
      const decoded = Buffer.from(token, 'base64').toString();
      const parts = decoded.split(':');
      const type = parts[0];

      if (type !== 'business') {
        return res.status(403).json({ error: "Only business owners can access this" });
      }

      const ownerId = parseInt(parts[2]);
      const ownerStart = Date.now();
      const owner = await storage.getBusinessOwnerById(ownerId);
      console.log(`[PERF] getBusinessOwnerById took ${Date.now() - ownerStart}ms`);
      
      if (!owner || !owner.companyId) {
        return res.status(404).json({ error: "No company associated with this account" });
      }

      const companyStart = Date.now();
      const company = await storage.getCompanyById(owner.companyId);
      console.log(`[PERF] getCompanyById took ${Date.now() - companyStart}ms`);
      console.log(`[PERF] Total GET profile fetch took ${Date.now() - startTime}ms`);
      res.json(company);
    } catch (error) {
      console.error("Error fetching business profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/business/notifications", async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.substring(7);
      const decoded = Buffer.from(token, 'base64').toString();
      const parts = decoded.split(':');
      const type = parts[0];

      if (type !== 'business') {
        return res.status(403).json({ error: "Only business owners can access this" });
      }

      const ownerId = parseInt(parts[2]);
      const owner = await storage.getBusinessOwnerById(ownerId);
      
      if (!owner || !owner.companyId) {
        return res.status(404).json({ error: "No company associated with this account" });
      }

      const notifications = await storage.getNotificationsByCompany(owner.companyId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/business/profile", async (req: any, res) => {
    const startTime = Date.now();
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.substring(7);
      const decoded = Buffer.from(token, 'base64').toString();
      const parts = decoded.split(':');
      const type = parts[0];

      if (type !== 'business') {
        return res.status(403).json({ error: "Only business owners can access this" });
      }

      const ownerId = parseInt(parts[2]);
      const ownerStart = Date.now();
      const owner = await storage.getBusinessOwnerById(ownerId);
      console.log(`[PERF] getBusinessOwnerById (PATCH) took ${Date.now() - ownerStart}ms`);
      
      if (!owner || !owner.companyId) {
        return res.status(404).json({ error: "No company associated with this account" });
      }

      console.log("Updating company:", owner.companyId, "with keys:", Object.keys(req.body).join(', '));
      if (req.body.galleryImages) console.log("✓ galleryImages:", req.body.galleryImages.length, "items");
      if (req.body.googleFeaturedReviews) console.log("✓ googleFeaturedReviews:", req.body.googleFeaturedReviews.length, "items");
      if (req.body.businessHours) console.log("✓ businessHours:", JSON.stringify(req.body.businessHours));
      
      const updatedCompany = await storage.updateCompany(owner.companyId, req.body as any);
      console.log(`[PERF] Total PATCH took ${Date.now() - startTime}ms`);
      res.json(updatedCompany);
    } catch (error) {
      console.error("Error updating business profile:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ error: "Failed to update profile", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Business event tracking endpoints
  app.post("/api/track/event", async (req, res) => {
    try {
      const { companyId, eventType, metadata } = req.body;
      
      if (!companyId || !eventType) {
        return res.status(400).json({ error: "Company ID and event type are required" });
      }

      const event = await storage.trackEvent({
        companyId,
        eventType,
        eventDate: new Date(),
        metadata: metadata || null,
      } as any);

      res.json({ success: true, event });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  // Get monthly report for a company
  app.get("/api/admin/companies/:id/report/:year/:month", requireSimpleAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);

      if (isNaN(id) || isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: "Invalid parameters" });
      }

      const report = await storage.getMonthlyReportData(id, year, month);
      const company = await storage.getCompanyById(id);

      res.json({ 
        success: true, 
        company,
        report,
        period: { year, month }
      });
    } catch (error) {
      console.error("Error getting report:", error);
      res.status(500).json({ error: "Failed to get report" });
    }
  });

  // Get all monthly reports for all companies (admin only)
  app.get("/api/admin/reports/:year/:month", requireSimpleAdmin, async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);

      if (isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: "Invalid parameters" });
      }

      const companies = await storage.getApprovedCompanies();
      const reports = await Promise.all(
        companies.map(async (company) => {
          const report = await storage.getMonthlyReportData(company.id, year, month);
          return {
            company,
            report
          };
        })
      );

      res.json({ 
        success: true, 
        reports,
        period: { year, month }
      });
    } catch (error) {
      console.error("Error getting reports:", error);
      res.status(500).json({ error: "Failed to get reports" });
    }
  });

  // Bulk add unclaimed businesses (admin only)
  app.post("/api/admin/companies/bulk-unclaimed", requireSimpleAdmin, async (req, res) => {
    try {
      const { businesses } = req.body;
      
      if (!Array.isArray(businesses) || businesses.length === 0) {
        return res.status(400).json({ error: "Businesses array is required" });
      }

      const results = [];
      for (const biz of businesses) {
        if (!biz.name || !biz.phone || !biz.city || !biz.state) {
          results.push({ 
            success: false, 
            name: biz.name || "Unknown", 
            error: "Name, phone, city, and state are required" 
          });
          continue;
        }

        try {
          const company = await storage.createCompany({
            name: biz.name,
            phone: biz.phone,
            city: biz.city,
            state: biz.state,
            address: biz.zip ? `${biz.city}, ${biz.state} ${biz.zip}` : `${biz.city}, ${biz.state}`,
            claimed: false,
            status: "approved", // Unclaimed businesses are approved but not featured
            subscriptionTier: "free",
            subscriptionStatus: "active",
            reviews: 0,
            paymentWarnings: 0,
            priceSheetVisible: false,
            addOnCostsVisible: false,
          } as any);

          results.push({ 
            success: true, 
            name: biz.name,
            city: biz.city,
            id: company.id 
          });
        } catch (error) {
          results.push({ 
            success: false, 
            name: biz.name, 
            error: error instanceof Error ? error.message : "Failed to create" 
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      res.json({ 
        success: true, 
        message: `Added ${successCount} of ${businesses.length} businesses`,
        results 
      });
    } catch (error) {
      console.error("Error bulk adding businesses:", error);
      res.status(500).json({ error: "Failed to bulk add businesses" });
    }
  });

  // Object Storage Routes for Logo Upload
  // Get presigned URL for logo upload (business owners only)
  app.post("/api/objects/upload", requireBusinessAuth, async (req, res) => {
    try {
      const { path } = req.body;
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL(path);
      res.json({ method: 'PUT', url: uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve uploaded logo images (public access)
  app.get(/^\/objects\/(.*)$/, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectPath = `/objects/${req.params[0]}`;
      const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Save logo URL after upload (business owners only)
  app.put("/api/companies/:id/logo", requireBusinessAuth, async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      const { logoURL } = req.body;
      
      if (!logoURL) {
        return res.status(400).json({ error: "logoURL is required" });
      }

      // Verify company ownership
      const company = await storage.getCompanyById(companyId);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const businessOwnerId = (req as any).businessOwnerId;
      const owner = await storage.getBusinessOwnerById(businessOwnerId);
      if (!owner || owner.companyId !== companyId) {
        return res.status(403).json({ error: "Not authorized to update this company" });
      }

      // Set ACL policy and normalize path
      const objectStorageService = new ObjectStorageService();
      const logoPath = await objectStorageService.trySetObjectEntityAclPolicy(
        logoURL,
        {
          owner: businessOwnerId.toString(),
          visibility: "public", // Logos are public so everyone can see them
        }
      );

      // Update company logo
      const updatedCompany = await storage.updateCompany(companyId, { logoUrl: logoPath } as any);
      
      res.json({ success: true, logoPath, company: updatedCompany });
    } catch (error) {
      console.error("Error saving logo:", error);
      res.status(500).json({ error: "Failed to save logo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
