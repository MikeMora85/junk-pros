import type { Express } from "express";
import { z } from "zod";
import type { IStorage } from "./storage";

export function registerRoutes(app: Express, storage: IStorage) {
  app.get("/api/companies", async (req, res) => {
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
}
