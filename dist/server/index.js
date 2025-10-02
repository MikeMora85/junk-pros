// server/index.ts
import express from "express";
import path from "path";

// server/routes.ts
function registerRoutes(app2, storage) {
  app2.get("/api/companies", async (req, res) => {
    try {
      const { local } = req.query;
      let companies;
      if (local === "true") {
        companies = await storage.getCompaniesByLocal(true);
      } else if (local === "false") {
        companies = await storage.getCompaniesByLocal(false);
      } else {
        companies = await storage.getCompanies();
      }
      res.json(companies);
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
      const company = await storage.getCompanyById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });
}

// server/storage.ts
var MemStorage = class {
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
      ]
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
      ]
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
      ]
    }
  ];
  async getCompanies() {
    return this.companies;
  }
  async getCompanyById(id) {
    return this.companies.find((c) => c.id === id) || null;
  }
  async getCompaniesByLocal(local) {
    return this.companies.filter((c) => c.local === local);
  }
};

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
  const storage = new MemStorage();
  registerRoutes(app, storage);
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("dist/client"));
    app.get(/.*/, (_req, res) => {
      res.sendFile(path.resolve("dist/client", "index.html"));
    });
  } else {
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
          "localhost"
        ]
      },
      appType: "spa",
      root: "client",
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "./client/src"),
          "@shared": path.resolve(process.cwd(), "./shared"),
          "@assets": path.resolve(process.cwd(), "./attached_assets")
        }
      },
      plugins: [
        (await import("@vitejs/plugin-react")).default()
      ]
    });
    app.use(vite.middlewares);
  }
  const PORT = process.env.PORT || 5e3;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
