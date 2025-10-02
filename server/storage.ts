import type { Company, InsertCompany } from "@shared/schema";

export interface IStorage {
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | null>;
  getCompaniesByLocal(local: boolean): Promise<Company[]>;
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
}
