import { db } from '../server/db';
import { companies } from '../shared/schema';

const milestoneBatch = [
  // Glendale, AZ (2)
  {name: "Glendale Junk Removal", phone: "6236665556", city: "Glendale", state: "Arizona", address: "Glendale, AZ", latitude: 33.5, longitude: -112.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "West Valley Cleanup", phone: "6237776667", city: "Glendale", state: "Arizona", address: "Glendale, AZ", latitude: 33.5, longitude: -112.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Irving, TX (2)
  {name: "Irving Junk Pro", phone: "9728889999", city: "Irving", state: "Texas", address: "Irving, TX", latitude: 32.8, longitude: -96.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Dallas-Fort Worth Cleanup", phone: "9729990000", city: "Irving", state: "Texas", address: "Irving, TX", latitude: 32.8, longitude: -96.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Hialeah, FL (2)
  {name: "Hialeah Junk Removal", phone: "3051112222", city: "Hialeah", state: "Florida", address: "Hialeah, FL", latitude: 25.9, longitude: -80.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Miami Dade Haulers", phone: "3052223333", city: "Hialeah", state: "Florida", address: "Hialeah, FL", latitude: 25.9, longitude: -80.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Garland TX more (2)
  {name: "Rowlett Junk Removal", phone: "9723334444", city: "Garland", state: "Texas", address: "Rowlett, TX", latitude: 32.9, longitude: -96.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Rockwall County Cleanup", phone: "9724445555", city: "Garland", state: "Texas", address: "Rowlett, TX", latitude: 32.9, longitude: -96.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Laredo, TX (2)
  {name: "Laredo Junk Pro", phone: "9565556666", city: "Laredo", state: "Texas", address: "Laredo, TX", latitude: 27.5, longitude: -99.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Rio Grande Valley Junk", phone: "9567777888", city: "Laredo", state: "Texas", address: "Laredo, TX", latitude: 27.5, longitude: -99.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Chula Vista, CA (2)
  {name: "Chula Vista Junk Removal", phone: "6198889999", city: "Chula Vista", state: "California", address: "Chula Vista, CA", latitude: 32.6, longitude: -117.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "South County Cleanup", phone: "6190000111", city: "Chula Vista", state: "California", address: "Chula Vista, CA", latitude: 32.6, longitude: -117.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Modesto, CA (2)
  {name: "Modesto Junk Pro", phone: "2091112222", city: "Modesto", state: "California", address: "Modesto, CA", latitude: 37.6, longitude: -121.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Central Valley Cleanup Masters", phone: "2092223333", city: "Modesto", state: "California", address: "Modesto, CA", latitude: 37.6, longitude: -121.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Irvine, CA (2)
  {name: "Irvine Junk Removal", phone: "9494445555", city: "Irvine", state: "California", address: "Irvine, CA", latitude: 33.6, longitude: -117.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Orange County Junk Masters", phone: "9495556666", city: "Irvine", state: "California", address: "Irvine, CA", latitude: 33.6, longitude: -117.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Anaheim, CA (2)
  {name: "Anaheim Junk Pro", phone: "7147778888", city: "Anaheim", state: "California", address: "Anaheim, CA", latitude: 33.8, longitude: -117.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Disney Land Area Cleanup", phone: "7149999000", city: "Anaheim", state: "California", address: "Anaheim, CA", latitude: 33.8, longitude: -117.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Riverside, CA (2)
  {name: "Riverside Junk Removal", phone: "9510001111", city: "Riverside", state: "California", address: "Riverside, CA", latitude: 33.9, longitude: -117.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Inland Cleanup Masters", phone: "9512222333", city: "Riverside", state: "California", address: "Riverside, CA", latitude: 33.9, longitude: -117.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addMilestoneBatch() {
  console.log(`Adding ${milestoneBatch.length} verified milestone batch...`);
  await db.insert(companies).values(milestoneBatch);
  console.log(`✅ Added ${milestoneBatch.length} milestone businesses!`);
}

addMilestoneBatch().catch(console.error);
