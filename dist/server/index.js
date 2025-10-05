// server/index.ts
import express from "express";
import path from "path";

// server/routes.ts
import { createServer } from "http";
import { z as z2 } from "zod";

// shared/schema.ts
import { pgTable, text, integer, decimal, boolean, doublePrecision, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var companies = pgTable("companies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  website: text("website").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  reviews: integer("reviews").notNull().default(0),
  services: text("services").array().notNull(),
  longitude: doublePrecision("longitude").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  local: boolean("local").notNull().default(true),
  logoUrl: text("logo_url"),
  reviewSnippets: text("review_snippets").array(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  description: text("description"),
  hours: text("hours"),
  availability: text("availability"),
  priceSheetUrl: text("price_sheet_url"),
  yearsInBusiness: integer("years_in_business"),
  insuranceInfo: text("insurance_info"),
  specialties: text("specialties").array(),
  aboutUs: text("about_us"),
  whyChooseUs: text("why_choose_us").array(),
  status: text("status").notNull().default("pending"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var insertCompanySchema = createInsertSchema(companies, {
  logoUrl: z.string().nullable().optional(),
  reviewSnippets: z.array(z.string()).nullable().optional(),
  description: z.string().nullable().optional(),
  hours: z.string().nullable().optional(),
  availability: z.string().nullable().optional(),
  priceSheetUrl: z.string().nullable().optional(),
  yearsInBusiness: z.number().nullable().optional(),
  insuranceInfo: z.string().nullable().optional(),
  specialties: z.array(z.string()).nullable().optional(),
  aboutUs: z.string().nullable().optional(),
  whyChooseUs: z.array(z.string()).nullable().optional(),
  status: z.string().optional(),
  userId: z.string().nullable().optional()
});

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims, storage2) {
  await storage2.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2, storage2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims(), storage2);
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
function isAdmin(storage2) {
  return async (req, res, next) => {
    const user = req.user;
    if (!req.isAuthenticated() || !user.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const dbUser = await storage2.getUser(user.claims.sub);
    if (!dbUser?.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  };
}

// server/routes.ts
async function registerRoutes(app2, storage2) {
  await setupAuth(app2, storage2);
  app2.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.json(null);
      }
      const userId = req.user.claims.sub;
      const user = await storage2.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/companies", async (req, res) => {
    try {
      const { local, city, state } = req.query;
      let companies2;
      if (city && state) {
        companies2 = await storage2.getCompaniesByCity(city, state);
      } else if (local === "true") {
        companies2 = await storage2.getCompaniesByLocal(true);
      } else if (local === "false") {
        companies2 = await storage2.getCompaniesByLocal(false);
      } else {
        companies2 = await storage2.getApprovedCompanies();
      }
      res.json(companies2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });
  app2.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      const company = await storage2.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });
  app2.post("/api/companies", async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user?.claims?.sub : null;
      console.log("Received company data:", req.body);
      const data = insertCompanySchema.parse({
        ...req.body,
        userId,
        status: "pending"
      });
      const company = await storage2.createCompany(data);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        console.error("Validation error:", error.issues);
        return res.status(400).json({ error: "Invalid company data", details: error.issues });
      }
      console.error("Server error:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });
  app2.get("/api/admin/companies/pending", isAuthenticated, isAdmin(storage2), async (req, res) => {
    try {
      const companies2 = await storage2.getPendingCompanies();
      res.json(companies2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending companies" });
    }
  });
  app2.patch("/api/admin/companies/:id/status", isAuthenticated, isAdmin(storage2), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      if (!["approved", "denied", "pending"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const company = await storage2.updateCompanyStatus(id, status);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company status" });
    }
  });
  app2.patch("/api/companies/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      const company = await storage2.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      const user = await storage2.getUser(userId);
      const isOwner = company.userId === userId;
      const isAdminUser = user?.isAdmin ?? false;
      if (!isOwner && !isAdminUser) {
        return res.status(403).json({ error: "Forbidden: You can only edit your own companies" });
      }
      const updatedCompany = await storage2.updateCompany(id, req.body);
      res.json(updatedCompany);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company" });
    }
  });
  app2.get("/api/user/companies", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const companies2 = await storage2.getCompaniesByUserId(userId);
      res.json(companies2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user companies" });
    }
  });
  app2.get("/api/admin/companies/active", isAuthenticated, isAdmin(storage2), async (req, res) => {
    try {
      const companies2 = await storage2.getApprovedCompanies();
      res.json(companies2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active companies" });
    }
  });
  app2.post("/api/admin/invite", isAuthenticated, isAdmin(storage2), async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Valid email is required" });
      }
      const result = await storage2.makeUserAdmin(email);
      if (!result) {
        return res.status(404).json({ error: "User with this email not found. User must sign up first." });
      }
      res.json({ message: "User granted admin access successfully", user: result });
    } catch (error) {
      console.error("Error inviting admin:", error);
      res.status(500).json({ error: "Failed to invite admin" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/storage.ts
var MemStorage = class {
  users = [];
  companies = [
    {
      id: 1,
      name: "Mora's Junk Removal",
      address: "Scottsdale, AZ 85251",
      phone: "602-632-3524",
      website: "https://602junk.com",
      rating: "4.9",
      reviews: 120,
      services: ["Appliance Removal", "Furniture Removal", "Garage Cleanouts"],
      longitude: -111.9281,
      latitude: 33.4942,
      local: true,
      logoUrl: "https://602junk.com/wp-content/uploads/2023/03/cropped-602-Junk-Logos-09.png",
      reviewSnippets: [
        "Amazing service! They were on time and very professional.",
        "Best junk removal in Scottsdale. Highly recommend!",
        "Quick, efficient, and affordable. Will use again."
      ],
      city: "Scottsdale",
      state: "Arizona",
      description: "Mora's Junk Removal is Scottsdale's premier locally-owned junk removal service. We handle everything from single-item pickups to complete property cleanouts with professional care and efficiency.",
      hours: "Monday-Saturday: 7:00 AM - 7:00 PM, Sunday: 9:00 AM - 5:00 PM",
      availability: "Same Day & Next Day Service Available \u2022 Evening & Weekend Appointments",
      priceSheetUrl: null,
      yearsInBusiness: 12,
      insuranceInfo: "Fully Licensed & Insured \u2022 General Liability Coverage \u2022 Workers Compensation Insurance",
      specialties: ["Estate Cleanouts", "Hoarding Cleanup", "Construction Debris", "Commercial Properties"],
      aboutUs: "Family-owned and operated since 2013, we've built our reputation on honest pricing, reliable service, and treating every property with respect. Our team is locally based in Scottsdale and we take pride in serving our community.",
      whyChooseUs: [
        "No hidden fees - upfront pricing before we start",
        "Same-day service available for urgent needs",
        "Eco-friendly disposal - we donate and recycle whenever possible",
        "Licensed, insured, and background-checked team",
        "Family-owned local business, not a franchise",
        "Free estimates with no obligation"
      ],
      status: "approved",
      userId: null,
      createdAt: /* @__PURE__ */ new Date("2024-01-01")
    },
    {
      id: 2,
      name: "Happy Hippo Junk Removal",
      address: "Scottsdale, AZ 85260",
      phone: "(480) 555-9876",
      website: "https://happyhippo.com",
      rating: "4.4",
      reviews: 45,
      services: ["Mattress Removal", "Shed Removal"],
      longitude: -111.891,
      latitude: 33.61,
      local: true,
      logoUrl: null,
      reviewSnippets: [
        "Great experience, friendly crew.",
        "Fair pricing and excellent work."
      ],
      city: "Scottsdale",
      state: "Arizona",
      description: null,
      hours: null,
      availability: null,
      priceSheetUrl: null,
      yearsInBusiness: null,
      insuranceInfo: null,
      specialties: null,
      aboutUs: null,
      whyChooseUs: null,
      status: "approved",
      userId: null,
      createdAt: /* @__PURE__ */ new Date("2024-01-15")
    },
    {
      id: 3,
      name: "Big Franchise Junk Co.",
      address: "Phoenix, AZ 85008",
      phone: "(602) 555-1234",
      website: "https://bigfranchise.com",
      rating: "3.8",
      reviews: 210,
      services: ["Everything"],
      longitude: -112.01,
      latitude: 33.46,
      local: false,
      logoUrl: null,
      reviewSnippets: [
        "Decent service but a bit pricey.",
        "Got the job done."
      ],
      city: "Phoenix",
      state: "Arizona",
      description: null,
      hours: null,
      availability: null,
      priceSheetUrl: null,
      yearsInBusiness: null,
      insuranceInfo: null,
      specialties: null,
      aboutUs: null,
      whyChooseUs: null,
      status: "approved",
      userId: null,
      createdAt: /* @__PURE__ */ new Date("2024-02-01")
    }
  ];
  // User operations
  async getUser(id) {
    return this.users.find((u) => u.id === id);
  }
  async upsertUser(userData) {
    const existingIndex = this.users.findIndex((u) => u.id === userData.id);
    if (existingIndex >= 0) {
      const updatedUser = {
        ...this.users[existingIndex],
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users[existingIndex] = updatedUser;
      return updatedUser;
    } else {
      const isFirstUser = this.users.length === 0;
      const newUser = {
        id: userData.id,
        email: userData.email ?? null,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        profileImageUrl: userData.profileImageUrl ?? null,
        isAdmin: isFirstUser || (userData.isAdmin ?? false),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.push(newUser);
      return newUser;
    }
  }
  async makeUserAdmin(email) {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    user.isAdmin = true;
    user.updatedAt = /* @__PURE__ */ new Date();
    return user;
  }
  // Company operations
  async getCompanies() {
    return this.companies;
  }
  async getApprovedCompanies() {
    return this.companies.filter((c) => c.status === "approved");
  }
  async getPendingCompanies() {
    return this.companies.filter((c) => c.status === "pending");
  }
  async getCompanyById(id) {
    return this.companies.find((c) => c.id === id) || null;
  }
  async getCompaniesByLocal(local) {
    return this.companies.filter((c) => c.local === local && c.status === "approved");
  }
  async getCompaniesByCity(city, state) {
    return this.companies.filter(
      (c) => c.city.toLowerCase() === city.toLowerCase() && c.state.toLowerCase() === state.toLowerCase() && c.status === "approved"
    );
  }
  async getCompaniesByUserId(userId) {
    return this.companies.filter((c) => c.userId === userId);
  }
  async createCompany(data) {
    const newId = Math.max(...this.companies.map((c) => c.id), 0) + 1;
    const newCompany = {
      id: newId,
      name: data.name,
      address: data.address,
      phone: data.phone,
      website: data.website,
      rating: data.rating,
      reviews: data.reviews ?? 0,
      services: data.services,
      longitude: data.longitude,
      latitude: data.latitude,
      local: data.local ?? true,
      logoUrl: data.logoUrl ?? null,
      reviewSnippets: data.reviewSnippets ?? null,
      city: data.city,
      state: data.state,
      description: data.description ?? null,
      hours: data.hours ?? null,
      availability: data.availability ?? null,
      priceSheetUrl: data.priceSheetUrl ?? null,
      yearsInBusiness: data.yearsInBusiness ?? null,
      insuranceInfo: data.insuranceInfo ?? null,
      specialties: data.specialties ?? null,
      aboutUs: data.aboutUs ?? null,
      whyChooseUs: data.whyChooseUs ?? null,
      status: data.status ?? "pending",
      userId: data.userId ?? null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.companies.push(newCompany);
    return newCompany;
  }
  async updateCompany(id, data) {
    const index2 = this.companies.findIndex((c) => c.id === id);
    if (index2 === -1) return null;
    this.companies[index2] = {
      ...this.companies[index2],
      ...data
    };
    return this.companies[index2];
  }
  async updateCompanyStatus(id, status) {
    const index2 = this.companies.findIndex((c) => c.id === id);
    if (index2 === -1) return null;
    this.companies[index2].status = status;
    return this.companies[index2];
  }
};
var storage = new MemStorage();

// server/index.ts
import { createServer as createViteServer } from "vite";
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
(async () => {
  const storage2 = new MemStorage();
  if (process.env.NODE_ENV === "production") {
    const httpServer = await registerRoutes(app, storage2);
    app.use(express.static("dist/client"));
    app.get(/.*/, (_req, res) => {
      res.sendFile(path.resolve("dist/client", "index.html"));
    });
    const PORT = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    const httpServer = await registerRoutes(app, storage2);
    const vite = await createViteServer({
      configFile: false,
      server: {
        middlewareMode: true,
        host: true,
        hmr: {
          host: "localhost"
        },
        allowedHosts: [
          ".replit.dev",
          ".repl.co",
          "localhost",
          ".spock.replit.dev"
        ]
      },
      appType: "spa",
      root: "client",
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "./client/src"),
          "@shared": path.resolve(process.cwd(), "./shared"),
          "@assets": path.resolve(process.cwd(), "./attached_assets")
        },
        dedupe: ["react", "react-dom"]
      },
      optimizeDeps: {
        include: ["react", "react-dom"]
      },
      plugins: [
        (await import("@vitejs/plugin-react")).default()
      ]
    });
    app.use(vite.middlewares);
    const PORT = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
})();
