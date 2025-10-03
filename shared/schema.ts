import { pgTable, text, integer, decimal, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
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
});

export const insertCompanySchema = createInsertSchema(companies, {
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
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
