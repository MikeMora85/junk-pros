import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import type { IStorage } from "./storage";
import { insertCompanySchema } from "@shared/schema";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";

export async function registerRoutes(app: Express, storage: IStorage): Promise<Server> {
  // Setup auth but don't force it globally
  await setupAuth(app, storage);

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
        // TODO: Implement business owner login
        return res.status(401).json({ error: 'Business owner login not yet implemented' });
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
          const [type, email] = decoded.split(':');
          
          if (type === 'admin' && email === process.env.ADMIN_EMAIL) {
            return res.json({ email, isAdmin: true, role: 'admin' });
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

  // Simple auth middleware
  const requireSimpleAuth = (req: any, res: any, next: any) => {
    // Check Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [type] = decoded.split(':');
        if (type === 'admin') {
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
      
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
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
      
      const data = insertCompanySchema.parse({
        ...req.body,
        userId,
        status: 'pending',
      });
      
      const company = await storage.createCompany(data);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.issues);
        return res.status(400).json({ error: "Invalid company data", details: error.issues });
      }
      console.error("Server error:", error);
      res.status(500).json({ error: "Failed to create company" });
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
      const userEmail = req.session.user.email;

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Admin can edit anything
      if (req.session.user.isAdmin) {
        const updatedCompany = await storage.updateCompany(id, req.body);
        return res.json(updatedCompany);
      }

      // Business owners can only edit their own companies
      // TODO: Add user-company relationship check
      return res.status(403).json({ error: "Forbidden: You can only edit your own companies" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update company" });
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

  const httpServer = createServer(app);
  return httpServer;
}
