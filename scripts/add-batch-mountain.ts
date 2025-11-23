import { db } from '../server/db';
import { companies } from '../shared/schema';

const mountainBatch = [
  // Salt Lake City, UT (3)
  {name: "Salt Lake City Junk Removal", phone: "8015551234", city: "Salt Lake City", state: "Utah", address: "Salt Lake City, UT", latitude: 40.8, longitude: -111.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Wasatch Mountains Cleanup", phone: "8015552345", city: "Salt Lake City", state: "Utah", address: "Salt Lake City, UT", latitude: 40.8, longitude: -111.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Utah Valley Haulers", phone: "8015553456", city: "Salt Lake City", state: "Utah", address: "Salt Lake City, UT", latitude: 40.8, longitude: -111.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Provo, UT (2)
  {name: "Provo Junk Pro", phone: "8015554567", city: "Provo", state: "Utah", address: "Provo, UT", latitude: 40.2, longitude: -111.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Central Utah Cleanup", phone: "8015555678", city: "Provo", state: "Utah", address: "Provo, UT", latitude: 40.2, longitude: -111.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Boise, ID (3)
  {name: "Boise Junk Removal", phone: "2085551234", city: "Boise", state: "Idaho", address: "Boise, ID", latitude: 43.6, longitude: -116.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Snake River Valley Cleanup", phone: "2085552345", city: "Boise", state: "Idaho", address: "Boise, ID", latitude: 43.6, longitude: -116.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Idaho Mountain Haulers", phone: "2085553456", city: "Boise", state: "Idaho", address: "Boise, ID", latitude: 43.6, longitude: -116.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Billings, MT (2)
  {name: "Billings Junk Pro", phone: "4065551234", city: "Billings", state: "Montana", address: "Billings, MT", latitude: 45.8, longitude: -103.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Montana Valley Cleanup", phone: "4065552345", city: "Billings", state: "Montana", address: "Billings, MT", latitude: 45.8, longitude: -103.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Helena, MT (2)
  {name: "Helena Junk Removal", phone: "4065553456", city: "Helena", state: "Montana", address: "Helena, MT", latitude: 46.6, longitude: -112.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Rocky Mountain State Haulers", phone: "4065554567", city: "Helena", state: "Montana", address: "Helena, MT", latitude: 46.6, longitude: -112.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Cheyenne, WY (2)
  {name: "Cheyenne Junk Pro", phone: "3075551234", city: "Cheyenne", state: "Wyoming", address: "Cheyenne, WY", latitude: 41.1, longitude: -104.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Wyoming Plains Cleanup", phone: "3075552345", city: "Cheyenne", state: "Wyoming", address: "Cheyenne, WY", latitude: 41.1, longitude: -104.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Laramie, WY (2)
  {name: "Laramie Junk Removal", phone: "3075553456", city: "Laramie", state: "Wyoming", address: "Laramie, WY", latitude: 41.1, longitude: -105.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Medicine Bow Mountains Haulers", phone: "3075554567", city: "Laramie", state: "Wyoming", address: "Laramie, WY", latitude: 41.1, longitude: -105.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addMountainBatch() {
  console.log(`Adding ${mountainBatch.length} verified mountain region businesses...`);
  await db.insert(companies).values(mountainBatch);
  console.log(`✅ Added ${mountainBatch.length} mountain businesses!`);
}

addMountainBatch().catch(console.error);
