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
          // Store admin session
          (req as any).session.user = {
            email: process.env.ADMIN_EMAIL,
            isAdmin: true,
            role: 'admin'
          };
          return res.json({ success: true, user: { email, isAdmin: true } });
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
      // Check simple auth session first
      if (req.session?.user) {
        return res.json(req.session.user);
      }
      
      // Check if user is authenticated via Replit OAuth
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        return res.json(user);
      }
      
      // Return null for unauthenticated users (no error)
      res.json(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      // Don't fail, just return null
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
  app.get("/api/admin/companies/pending", isAuthenticated, isAdmin(storage), async (req, res) => {
    try {
      const companies = await storage.getPendingCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending companies" });
    }
  });

  app.patch("/api/admin/companies/:id/status", isAuthenticated, isAdmin(storage), async (req, res) => {
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
  app.patch("/api/companies/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const user = await storage.getUser(userId);
      const isOwner = company.userId === userId;
      const isAdminUser = user?.isAdmin ?? false;

      if (!isOwner && !isAdminUser) {
        return res.status(403).json({ error: "Forbidden: You can only edit your own companies" });
      }

      const updatedCompany = await storage.updateCompany(id, req.body);
      res.json(updatedCompany);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Get user's companies
  app.get("/api/user/companies", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companies = await storage.getCompaniesByUserId(userId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user companies" });
    }
  });

  // Get active companies (admin only)
  app.get("/api/admin/companies/active", isAuthenticated, isAdmin(storage), async (req, res) => {
    try {
      const companies = await storage.getApprovedCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active companies" });
    }
  });

  // Invite admin (admin only)
  app.post("/api/admin/invite", isAuthenticated, isAdmin(storage), async (req, res) => {
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
