import type { Company, InsertCompany, User, UpsertUser, BusinessEvent, InsertBusinessEvent, BusinessOwner, InsertBusinessOwner } from "@shared/schema";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  makeUserAdmin(email: string): Promise<User | null>;
  
  // Company operations
  getCompanies(): Promise<Company[]>;
  getApprovedCompanies(): Promise<Company[]>;
  getPendingCompanies(): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | null>;
  getCompaniesByLocal(local: boolean): Promise<Company[]>;
  getCompaniesByCity(city: string, state: string): Promise<Company[]>;
  getCitiesForState(state: string): Promise<string[]>;
  findStateForCity(city: string): Promise<{ state: string | null; city: string }>;
  getCompaniesByUserId(userId: string): Promise<Company[]>;
  createCompany(data: Omit<InsertCompany, 'id'>): Promise<Company>;
  updateCompany(id: number, data: Partial<InsertCompany>): Promise<Company | null>;
  updateCompanyStatus(id: number, status: string): Promise<Company | null>;
  deleteCompany(id: number): Promise<boolean>;
  
  // Business owner operations
  createBusinessOwner(data: Omit<InsertBusinessOwner, 'id' | 'createdAt'>): Promise<BusinessOwner>;
  getBusinessOwnerByEmail(email: string): Promise<BusinessOwner | null>;
  getBusinessOwnerById(id: number): Promise<BusinessOwner | null>;
  getBusinessOwnerByCompanyId(companyId: number): Promise<BusinessOwner | null>;
  updateBusinessOwnerCompany(id: number, companyId: number): Promise<BusinessOwner | null>;
  
  // Business event tracking
  trackEvent(data: Omit<InsertBusinessEvent, 'id'>): Promise<BusinessEvent>;
  getEventsByCompany(companyId: number, startDate?: Date, endDate?: Date): Promise<BusinessEvent[]>;
  getMonthlyReportData(companyId: number, year: number, month: number): Promise<{
    clicks: number;
    calls: number;
    bookQuotes: number;
    photoQuotes: number;
    totalEvents: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private businessEvents: BusinessEvent[] = [];
  private businessOwners: BusinessOwner[] = [];
  private companies: Company[] = [
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
      claimed: true,
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
      availability: "Same Day & Next Day Service Available • Evening & Weekend Appointments",
      priceSheetUrl: null,
      yearsInBusiness: 12,
      insuranceInfo: "Fully Licensed & Insured • General Liability Coverage • Workers Compensation Insurance",
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
      subscriptionTier: "featured",
      subscriptionStatus: "active",
      lastPaymentDate: new Date('2024-10-01'),
      nextPaymentDate: new Date('2024-11-01'),
      paymentWarnings: 0,
      priceSheetVisible: true,
      addOnCostsVisible: true,
      priceSheetData: null,
      addOnCosts: null,
      platformReviews: null,
      featuredReviewIds: null,
      galleryImages: null,
      serviceAreaCities: null,
      trailerSize: null,
      paymentMethods: null,
      faqs: null,
      singleItemMinimum: null,
      minimumPrice: null,
      quarterLoadPrice: null,
      halfLoadPrice: null,
      threeQuarterLoadPrice: null,
      fullLoadPrice: null,
      facebookUrl: null,
      instagramUrl: null,
      gmbUrl: null,
      youtubeUrl: null,
      teamMembers: null,
      agreedToPlatformStandards: null,
      agreedToRequirements: null,
      contactEmail: null,
      displayOrder: null,
      badge: null,
      businessHours: null,
      googleRanking: null,
      googleReviewCount: null,
      googleFeaturedReviews: null,
      offersInPersonEstimates: true,
      videoUrl: null,
      createdAt: new Date('2024-01-01'),
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
      claimed: true,
      logoUrl: null,
      reviewSnippets: [
        "Great experience, friendly crew.",
        "Fair pricing and excellent work.",
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
      subscriptionTier: "free",
      subscriptionStatus: "active",
      lastPaymentDate: null,
      nextPaymentDate: null,
      paymentWarnings: 0,
      priceSheetVisible: true,
      addOnCostsVisible: true,
      priceSheetData: null,
      addOnCosts: null,
      platformReviews: null,
      featuredReviewIds: null,
      galleryImages: null,
      serviceAreaCities: null,
      trailerSize: null,
      paymentMethods: null,
      faqs: null,
      singleItemMinimum: null,
      minimumPrice: null,
      quarterLoadPrice: null,
      halfLoadPrice: null,
      threeQuarterLoadPrice: null,
      fullLoadPrice: null,
      facebookUrl: null,
      instagramUrl: null,
      gmbUrl: null,
      youtubeUrl: null,
      teamMembers: null,
      agreedToPlatformStandards: null,
      agreedToRequirements: null,
      contactEmail: null,
      displayOrder: null,
      badge: null,
      businessHours: null,
      googleRanking: null,
      googleReviewCount: null,
      googleFeaturedReviews: null,
      offersInPersonEstimates: true,
      videoUrl: null,
      createdAt: new Date('2024-01-15'),
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
      claimed: true,
      logoUrl: null,
      reviewSnippets: [
        "Decent service but a bit pricey.",
        "Got the job done.",
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
      subscriptionTier: "featured",
      subscriptionStatus: "past_due",
      lastPaymentDate: new Date('2024-09-01'),
      nextPaymentDate: new Date('2024-10-01'),
      paymentWarnings: 2,
      priceSheetVisible: true,
      addOnCostsVisible: true,
      priceSheetData: null,
      addOnCosts: null,
      platformReviews: null,
      featuredReviewIds: null,
      galleryImages: null,
      serviceAreaCities: null,
      trailerSize: null,
      paymentMethods: null,
      faqs: null,
      singleItemMinimum: null,
      minimumPrice: null,
      quarterLoadPrice: null,
      halfLoadPrice: null,
      threeQuarterLoadPrice: null,
      fullLoadPrice: null,
      facebookUrl: null,
      instagramUrl: null,
      gmbUrl: null,
      youtubeUrl: null,
      teamMembers: null,
      agreedToPlatformStandards: null,
      agreedToRequirements: null,
      contactEmail: null,
      displayOrder: null,
      badge: null,
      businessHours: null,
      googleRanking: null,
      googleReviewCount: null,
      googleFeaturedReviews: null,
      offersInPersonEstimates: true,
      videoUrl: null,
      createdAt: new Date('2024-02-01'),
    },
  ];

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingIndex = this.users.findIndex(u => u.id === userData.id);
    
    if (existingIndex >= 0) {
      const updatedUser: User = {
        ...this.users[existingIndex],
        ...userData,
        updatedAt: new Date(),
      };
      this.users[existingIndex] = updatedUser;
      return updatedUser;
    } else {
      // Make the first user an admin automatically
      const isFirstUser = this.users.length === 0;
      const newUser: User = {
        id: userData.id!,
        email: userData.email ?? null,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        profileImageUrl: userData.profileImageUrl ?? null,
        isAdmin: isFirstUser || (userData.isAdmin ?? false),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
    }
  }

  async makeUserAdmin(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;

    user.isAdmin = true;
    user.updatedAt = new Date();
    return user;
  }

  // Company operations
  async getCompanies(): Promise<Company[]> {
    return this.companies;
  }

  async getApprovedCompanies(): Promise<Company[]> {
    return this.companies.filter(c => c.status === 'approved');
  }

  async getPendingCompanies(): Promise<Company[]> {
    return this.companies.filter(c => c.status === 'pending');
  }

  async getCompanyById(id: number): Promise<Company | null> {
    return this.companies.find((c) => c.id === id) || null;
  }

  async getCompaniesByLocal(local: boolean): Promise<Company[]> {
    return this.companies.filter((c) => c.local === local && c.status === 'approved');
  }

  async getCompaniesByCity(city: string, state: string): Promise<Company[]> {
    return this.companies.filter((c) => 
      c.city.toLowerCase() === city.toLowerCase() && 
      c.state.toLowerCase() === state.toLowerCase() &&
      c.status === 'approved'
    );
  }

  async getCitiesForState(state: string): Promise<string[]> {
    const approvedCompanies = this.companies.filter((c) => 
      c.state.toLowerCase() === state.toLowerCase() &&
      c.status === 'approved'
    );
    const citySet = new Set<string>();
    approvedCompanies.forEach(c => citySet.add(c.city));
    const cities = Array.from(citySet);
    return cities.sort();
  }

  async findStateForCity(city: string): Promise<{ state: string | null; city: string }> {
    const company = this.companies.find((c) => 
      c.city.toLowerCase() === city.toLowerCase() && c.status === 'approved'
    );
    return {
      state: company ? company.state.toLowerCase().replace(/\s+/g, '-') : null,
      city: city
    };
  }

  async getCompaniesByUserId(userId: string): Promise<Company[]> {
    return this.companies.filter(c => c.userId === userId);
  }

  async createCompany(data: Omit<InsertCompany, 'id'>): Promise<Company> {
    const newId = Math.max(...this.companies.map(c => c.id), 0) + 1;
    const newCompany: Company = {
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
      claimed: data.claimed ?? false,
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
      status: data.status ?? 'approved',
      userId: data.userId ?? null,
      subscriptionTier: "free",
      subscriptionStatus: "active",
      lastPaymentDate: null,
      nextPaymentDate: null,
      paymentWarnings: 0,
      priceSheetVisible: data.priceSheetVisible ?? true,
      addOnCostsVisible: data.addOnCostsVisible ?? true,
      priceSheetData: data.priceSheetData ?? null,
      addOnCosts: data.addOnCosts ?? null,
      platformReviews: data.platformReviews ?? null,
      featuredReviewIds: data.featuredReviewIds ?? null,
      galleryImages: data.galleryImages ?? null,
      serviceAreaCities: data.serviceAreaCities ?? null,
      trailerSize: data.trailerSize ?? null,
      paymentMethods: data.paymentMethods ?? null,
      faqs: data.faqs ?? null,
      singleItemMinimum: data.singleItemMinimum ?? null,
      minimumPrice: data.minimumPrice ?? null,
      quarterLoadPrice: data.quarterLoadPrice ?? null,
      halfLoadPrice: data.halfLoadPrice ?? null,
      threeQuarterLoadPrice: data.threeQuarterLoadPrice ?? null,
      fullLoadPrice: data.fullLoadPrice ?? null,
      facebookUrl: data.facebookUrl ?? null,
      instagramUrl: data.instagramUrl ?? null,
      gmbUrl: data.gmbUrl ?? null,
      youtubeUrl: data.youtubeUrl ?? null,
      teamMembers: data.teamMembers ?? null,
      agreedToPlatformStandards: data.agreedToPlatformStandards ?? null,
      agreedToRequirements: data.agreedToRequirements ?? null,
      contactEmail: data.contactEmail ?? null,
      displayOrder: data.displayOrder ?? null,
      badge: data.badge ?? null,
      businessHours: data.businessHours ?? null,
      googleRanking: data.googleRanking ?? null,
      googleReviewCount: data.googleReviewCount ?? null,
      googleFeaturedReviews: data.googleFeaturedReviews ?? null,
      offersInPersonEstimates: data.offersInPersonEstimates ?? true,
      videoUrl: data.videoUrl ?? null,
      createdAt: new Date(),
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async updateCompany(id: number, data: Partial<InsertCompany>): Promise<Company | null> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.companies[index] = {
      ...this.companies[index],
      ...data,
    };
    return this.companies[index];
  }

  async updateCompanyStatus(id: number, status: string): Promise<Company | null> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.companies[index].status = status;
    return this.companies[index];
  }

  async deleteCompany(id: number): Promise<boolean> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.companies.splice(index, 1);
    return true;
  }

  async trackEvent(data: Omit<InsertBusinessEvent, 'id'>): Promise<BusinessEvent> {
    const newId = Math.max(...this.businessEvents.map(e => e.id), 0) + 1;
    const newEvent: BusinessEvent = {
      id: newId,
      companyId: data.companyId,
      eventType: data.eventType,
      eventDate: data.eventDate || new Date(),
      metadata: data.metadata || null,
    };
    this.businessEvents.push(newEvent);
    return newEvent;
  }

  async getEventsByCompany(companyId: number, startDate?: Date, endDate?: Date): Promise<BusinessEvent[]> {
    let events = this.businessEvents.filter(e => e.companyId === companyId);
    
    if (startDate) {
      events = events.filter(e => e.eventDate >= startDate);
    }
    if (endDate) {
      events = events.filter(e => e.eventDate <= endDate);
    }
    
    return events;
  }

  async getMonthlyReportData(companyId: number, year: number, month: number): Promise<{
    clicks: number;
    calls: number;
    bookQuotes: number;
    photoQuotes: number;
    totalEvents: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const events = await this.getEventsByCompany(companyId, startDate, endDate);
    
    return {
      clicks: events.filter(e => e.eventType === 'click').length,
      calls: events.filter(e => e.eventType === 'call').length,
      bookQuotes: events.filter(e => e.eventType === 'book_quote').length,
      photoQuotes: events.filter(e => e.eventType === 'photo_quote').length,
      totalEvents: events.length,
    };
  }

  async createBusinessOwner(data: Omit<InsertBusinessOwner, 'id' | 'createdAt'>): Promise<BusinessOwner> {
    const newId = Math.max(...this.businessOwners.map(o => o.id), 0) + 1;
    const newOwner: BusinessOwner = {
      id: newId,
      email: data.email,
      passwordHash: data.passwordHash,
      companyId: data.companyId || null,
      createdAt: new Date(),
    };
    this.businessOwners.push(newOwner);
    return newOwner;
  }

  async getBusinessOwnerByEmail(email: string): Promise<BusinessOwner | null> {
    return this.businessOwners.find(o => o.email === email) || null;
  }

  async getBusinessOwnerById(id: number): Promise<BusinessOwner | null> {
    return this.businessOwners.find(o => o.id === id) || null;
  }

  async getBusinessOwnerByCompanyId(companyId: number): Promise<BusinessOwner | null> {
    return this.businessOwners.find(o => o.companyId === companyId) || null;
  }

  async updateBusinessOwnerCompany(id: number, companyId: number): Promise<BusinessOwner | null> {
    const index = this.businessOwners.findIndex(o => o.id === id);
    if (index === -1) return null;

    this.businessOwners[index].companyId = companyId;
    return this.businessOwners[index];
  }
}

import { db } from './db';
import { eq, and, gte, lte, sql, asc } from 'drizzle-orm';
import { companies, users, businessOwners, businessEvents } from '@shared/schema';

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = await this.getUser(userData.id!);
    
    if (existing) {
      const [updated] = await db
        .update(users)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(users.id, userData.id!))
        .returning();
      return updated;
    } else {
      // Make the first user an admin automatically
      const allUsers = await db.select().from(users);
      const isFirstUser = allUsers.length === 0;
      
      const [newUser] = await db
        .insert(users)
        .values({
          id: userData.id!,
          email: userData.email ?? null,
          firstName: userData.firstName ?? null,
          lastName: userData.lastName ?? null,
          profileImageUrl: userData.profileImageUrl ?? null,
          isAdmin: isFirstUser || (userData.isAdmin ?? false),
        })
        .returning();
      return newUser;
    }
  }

  async makeUserAdmin(email: string): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ isAdmin: true, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();
    return user || null;
  }

  // Company operations
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async getApprovedCompanies(): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.status, 'approved'));
  }

  async getPendingCompanies(): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.status, 'pending'));
  }

  async getCompanyById(id: number): Promise<Company | null> {
    const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
    return result[0] || null;
  }

  async getCompaniesByLocal(local: boolean): Promise<Company[]> {
    return await db.select().from(companies).where(
      and(eq(companies.local, local), eq(companies.status, 'approved'))
    );
  }

  async getCompaniesByCity(city: string, state: string): Promise<Company[]> {
    return await db.select().from(companies).where(
      and(
        sql`LOWER(TRIM(${companies.city})) = LOWER(${city})`,
        sql`LOWER(TRIM(${companies.state})) = LOWER(${state})`,
        eq(companies.status, 'approved')
      )
    ).orderBy(asc(companies.displayOrder));
  }

  async getCitiesForState(state: string): Promise<string[]> {
    const results = await db
      .selectDistinct({ city: companies.city })
      .from(companies)
      .where(
        and(
          sql`LOWER(TRIM(${companies.state})) = LOWER(${state})`,
          eq(companies.status, 'approved')
        )
      );
    // Trim city names and remove duplicates
    const citySet = new Set<string>();
    results.forEach(r => {
      const trimmedCity = r.city.trim();
      if (trimmedCity) {
        citySet.add(trimmedCity);
      }
    });
    return Array.from(citySet).sort();
  }

  async findStateForCity(city: string): Promise<{ state: string | null; city: string }> {
    const result = await db
      .select({ state: companies.state })
      .from(companies)
      .where(
        and(
          sql`LOWER(TRIM(${companies.city})) = LOWER(${city})`,
          eq(companies.status, 'approved')
        )
      )
      .limit(1);
    
    return {
      state: result[0] ? result[0].state.toLowerCase().replace(/\s+/g, '-') : null,
      city: city
    };
  }

  async getCompaniesByUserId(userId: string): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.userId, userId));
  }

  async createCompany(data: Omit<InsertCompany, 'id'>): Promise<Company> {
    const [newCompany] = await db
      .insert(companies)
      .values({
        name: data.name,
        address: data.address,
        phone: data.phone,
        website: data.website ?? '',
        rating: data.rating,
        reviews: data.reviews ?? 0,
        services: data.services,
        longitude: data.longitude,
        latitude: data.latitude,
        local: data.local ?? true,
        city: data.city,
        state: data.state,
        logoUrl: data.logoUrl ?? null,
        reviewSnippets: data.reviewSnippets ?? null,
        description: data.description ?? null,
        hours: data.hours ?? null,
        availability: data.availability ?? null,
        priceSheetUrl: data.priceSheetUrl ?? null,
        yearsInBusiness: data.yearsInBusiness ?? null,
        insuranceInfo: data.insuranceInfo ?? null,
        specialties: data.specialties ?? null,
        aboutUs: data.aboutUs ?? null,
        whyChooseUs: data.whyChooseUs ?? null,
        status: data.status ?? 'approved',
        userId: data.userId ?? null,
        subscriptionTier: data.subscriptionTier ?? 'free',
        subscriptionStatus: data.subscriptionStatus ?? 'active',
        lastPaymentDate: data.lastPaymentDate ?? null,
        nextPaymentDate: data.nextPaymentDate ?? null,
        paymentWarnings: data.paymentWarnings ?? 0,
        priceSheetVisible: data.priceSheetVisible ?? true,
        addOnCostsVisible: data.addOnCostsVisible ?? true,
        priceSheetData: data.priceSheetData ?? null,
        addOnCosts: data.addOnCosts ?? null,
        platformReviews: data.platformReviews ?? null,
        featuredReviewIds: data.featuredReviewIds ?? null,
        galleryImages: data.galleryImages ?? null,
        serviceAreaCities: data.serviceAreaCities ?? null,
      })
      .returning();
    return newCompany;
  }

  async updateCompany(id: number, data: Partial<InsertCompany>): Promise<Company | null> {
    // Build update object with only defined values, converting empty strings to null
    const updateData: Partial<typeof companies.$inferInsert> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        (updateData as any)[key] = value === '' ? null : value;
      }
    }
    
    // Sync googleReviewCount -> reviews and googleRanking -> rating
    if (updateData.googleReviewCount !== undefined) {
      updateData.reviews = updateData.googleReviewCount || 0;
    }
    if (updateData.googleRanking !== undefined) {
      updateData.rating = updateData.googleRanking;
    }
    
    console.log('🔧 Updating company', id);
    console.log('Keys:', Object.keys(updateData).join(', '));
    console.log('Data types:', Object.entries(updateData).map(([k, v]) => `${k}:${typeof v}`).join(', '));
    
    // Log specific problematic fields
    if (updateData.galleryImages !== undefined) {
      console.log('galleryImages:', typeof updateData.galleryImages, Array.isArray(updateData.galleryImages), updateData.galleryImages);
    }
    if (updateData.teamMembers !== undefined) {
      console.log('teamMembers:', typeof updateData.teamMembers, Array.isArray(updateData.teamMembers), updateData.teamMembers);
    }
    if (updateData.googleFeaturedReviews !== undefined) {
      console.log('googleFeaturedReviews:', typeof updateData.googleFeaturedReviews, Array.isArray(updateData.googleFeaturedReviews), updateData.googleFeaturedReviews);
    }
    
    try {
      const [updated] = await db
        .update(companies)
        .set(updateData)
        .where(eq(companies.id, id))
        .returning();
      console.log('✅ Update successful for company', id);
      return updated || null;
    } catch (error: any) {
      console.error('❌ Update error for company', id);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        hint: error.hint,
        position: error.position
      });
      console.error('Data being sent:', JSON.stringify(updateData, null, 2));
      throw error;
    }
  }

  async updateCompanyStatus(id: number, status: string): Promise<Company | null> {
    const [updated] = await db
      .update(companies)
      .set({ status })
      .where(eq(companies.id, id))
      .returning();
    return updated || null;
  }

  async deleteCompany(id: number): Promise<boolean> {
    // Delete related records first due to foreign key constraints
    // 1. Delete business events
    await db.delete(businessEvents).where(eq(businessEvents.companyId, id));
    
    // 2. Update business owners to remove company reference
    await db
      .update(businessOwners)
      .set({ companyId: null })
      .where(eq(businessOwners.companyId, id));
    
    // 3. Delete the company
    await db
      .delete(companies)
      .where(eq(companies.id, id));
    
    return true;
  }

  // Business owner operations
  async createBusinessOwner(data: Omit<InsertBusinessOwner, 'id' | 'createdAt'>): Promise<BusinessOwner> {
    const [newOwner] = await db
      .insert(businessOwners)
      .values({
        email: data.email,
        passwordHash: data.passwordHash,
        companyId: data.companyId ?? null,
      })
      .returning();
    return newOwner;
  }

  async getBusinessOwnerByEmail(email: string): Promise<BusinessOwner | null> {
    const result = await db.select().from(businessOwners).where(eq(businessOwners.email, email)).limit(1);
    return result[0] || null;
  }

  async getBusinessOwnerById(id: number): Promise<BusinessOwner | null> {
    const result = await db.select().from(businessOwners).where(eq(businessOwners.id, id)).limit(1);
    return result[0] || null;
  }

  async getBusinessOwnerByCompanyId(companyId: number): Promise<BusinessOwner | null> {
    const result = await db.select().from(businessOwners).where(eq(businessOwners.companyId, companyId)).limit(1);
    return result[0] || null;
  }

  async updateBusinessOwnerCompany(id: number, companyId: number): Promise<BusinessOwner | null> {
    const [updated] = await db
      .update(businessOwners)
      .set({ companyId })
      .where(eq(businessOwners.id, id))
      .returning();
    return updated || null;
  }

  // Business event tracking
  async trackEvent(data: Omit<InsertBusinessEvent, 'id'>): Promise<BusinessEvent> {
    const [newEvent] = await db
      .insert(businessEvents)
      .values({
        companyId: data.companyId,
        eventType: data.eventType,
        metadata: data.metadata ?? null,
      })
      .returning();
    return newEvent;
  }

  async getEventsByCompany(companyId: number, startDate?: Date, endDate?: Date): Promise<BusinessEvent[]> {
    const conditions = [eq(businessEvents.companyId, companyId)];
    
    if (startDate) {
      conditions.push(gte(businessEvents.eventDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(businessEvents.eventDate, endDate));
    }
    
    return await db.select().from(businessEvents).where(and(...conditions));
  }

  async getMonthlyReportData(companyId: number, year: number, month: number): Promise<{
    clicks: number;
    calls: number;
    bookQuotes: number;
    photoQuotes: number;
    totalEvents: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const events = await this.getEventsByCompany(companyId, startDate, endDate);
    
    return {
      clicks: events.filter(e => e.eventType === 'click').length,
      calls: events.filter(e => e.eventType === 'call').length,
      bookQuotes: events.filter(e => e.eventType === 'book_quote').length,
      photoQuotes: events.filter(e => e.eventType === 'photo_quote').length,
      totalEvents: events.length,
    };
  }
}

export const storage = new DbStorage();
