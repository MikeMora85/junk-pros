import { pgTable, text, integer, decimal, boolean, doublePrecision, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  status: text("status").notNull().default("pending"),
  userId: varchar("user_id").references(() => users.id),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  subscriptionStatus: text("subscription_status").notNull().default("active"),
  lastPaymentDate: timestamp("last_payment_date"),
  nextPaymentDate: timestamp("next_payment_date"),
  paymentWarnings: integer("payment_warnings").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
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
  status: z.string().optional(),
  userId: z.string().nullable().optional(),
  subscriptionTier: z.string().optional(),
  subscriptionStatus: z.string().optional(),
  lastPaymentDate: z.date().nullable().optional(),
  nextPaymentDate: z.date().nullable().optional(),
  paymentWarnings: z.number().optional(),
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
