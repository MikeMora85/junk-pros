import type { Company, InsertCompany } from "@shared/schema";

export interface IStorage {
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | null>;
  getCompaniesByLocal(local: boolean): Promise<Company[]>;
  getCompaniesByCity(city: string, state: string): Promise<Company[]>;
  createCompany(data: Omit<InsertCompany, 'id'>): Promise<Company>;
}

export class MemStorage implements IStorage {
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
    },
  ];

  async getCompanies(): Promise<Company[]> {
    return this.companies;
  }

  async getCompanyById(id: number): Promise<Company | null> {
    return this.companies.find((c) => c.id === id) || null;
  }

  async getCompaniesByLocal(local: boolean): Promise<Company[]> {
    return this.companies.filter((c) => c.local === local);
  }

  async getCompaniesByCity(city: string, state: string): Promise<Company[]> {
    return this.companies.filter((c) => 
      c.city.toLowerCase() === city.toLowerCase() && 
      c.state.toLowerCase() === state.toLowerCase()
    );
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
    };
    this.companies.push(newCompany);
    return newCompany;
  }
}
