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

export const businessOwners = pgTable("business_owners", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  companyId: integer("company_id").references(() => companies.id),
  createdAt: timestamp("created_at").defaultNow(),
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
  status: text("status").notNull().default("approved"),
  userId: varchar("user_id").references(() => users.id),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  subscriptionStatus: text("subscription_status").notNull().default("active"),
  lastPaymentDate: timestamp("last_payment_date"),
  nextPaymentDate: timestamp("next_payment_date"),
  paymentWarnings: integer("payment_warnings").notNull().default(0),
  priceSheetVisible: boolean("price_sheet_visible").notNull().default(true),
  addOnCostsVisible: boolean("add_on_costs_visible").notNull().default(true),
  priceSheetData: jsonb("price_sheet_data"),
  addOnCosts: jsonb("add_on_costs"),
  platformReviews: jsonb("platform_reviews"),
  featuredReviewIds: text("featured_review_ids").array(),
  galleryImages: text("gallery_images").array(),
  serviceAreaCities: text("service_area_cities").array(),
  trailerSize: text("trailer_size"),
  paymentMethods: text("payment_methods").array(),
  singleItemMinimum: decimal("single_item_minimum", { precision: 10, scale: 2 }),
  minimumPrice: decimal("minimum_price", { precision: 10, scale: 2 }),
  quarterLoadPrice: decimal("quarter_load_price", { precision: 10, scale: 2 }),
  halfLoadPrice: decimal("half_load_price", { precision: 10, scale: 2 }),
  threeQuarterLoadPrice: decimal("three_quarter_load_price", { precision: 10, scale: 2 }),
  fullLoadPrice: decimal("full_load_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies, {
  website: z.string().optional().default(""),
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
  priceSheetVisible: z.boolean().optional(),
  addOnCostsVisible: z.boolean().optional(),
  priceSheetData: z.any().nullable().optional(),
  addOnCosts: z.any().nullable().optional(),
  platformReviews: z.any().nullable().optional(),
  featuredReviewIds: z.array(z.string()).nullable().optional(),
  galleryImages: z.array(z.string()).nullable().optional(),
  serviceAreaCities: z.array(z.string()).nullable().optional(),
  trailerSize: z.string().nullable().optional(),
  paymentMethods: z.array(z.string()).nullable().optional(),
  singleItemMinimum: z.string().nullable().optional(),
  minimumPrice: z.string().nullable().optional(),
  quarterLoadPrice: z.string().nullable().optional(),
  halfLoadPrice: z.string().nullable().optional(),
  threeQuarterLoadPrice: z.string().nullable().optional(),
  fullLoadPrice: z.string().nullable().optional(),
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertBusinessOwnerSchema = createInsertSchema(businessOwners, {
  email: z.string().email(),
  passwordHash: z.string(),
  companyId: z.number().nullable().optional(),
});

export type InsertBusinessOwner = z.infer<typeof insertBusinessOwnerSchema>;
export type BusinessOwner = typeof businessOwners.$inferSelect;

export const businessEvents = pgTable("business_events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  eventType: text("event_type").notNull(), // 'click', 'call', 'book_quote', 'photo_quote'
  eventDate: timestamp("event_date").notNull().defaultNow(),
  metadata: jsonb("metadata"), // Additional data like source, device, etc.
});

export const insertBusinessEventSchema = createInsertSchema(businessEvents, {
  metadata: z.any().nullable().optional(),
});

export type InsertBusinessEvent = z.infer<typeof insertBusinessEventSchema>;
export type BusinessEvent = typeof businessEvents.$inferSelect;
