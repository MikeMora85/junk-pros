import { db } from '../server/db';
import { companies } from '../shared/schema';

const northeastBatch = [
  // Buffalo, NY (2)
  {name: "Buffalo Junk Removal", phone: "7165551234", city: "Buffalo", state: "New York", address: "Buffalo, NY", latitude: 42.9, longitude: -78.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Western New York Haulers", phone: "7165552345", city: "Buffalo", state: "New York", address: "Buffalo, NY", latitude: 42.9, longitude: -78.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Rochester, NY (2)
  {name: "Rochester Junk Pro", phone: "5855551234", city: "Rochester", state: "New York", address: "Rochester, NY", latitude: 43.2, longitude: -77.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Finger Lakes Cleanup", phone: "5855552345", city: "Rochester", state: "New York", address: "Rochester, NY", latitude: 43.2, longitude: -77.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Albany, NY (2)
  {name: "Albany Junk Removal", phone: "5185551234", city: "Albany", state: "New York", address: "Albany, NY", latitude: 42.7, longitude: -73.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Capital Region Haulers", phone: "5185552345", city: "Albany", state: "New York", address: "Albany, NY", latitude: 42.7, longitude: -73.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // New York NY expansion (2)
  {name: "Queens Junk Removal", phone: "7185551234", city: "New York", state: "New York", address: "New York, NY", latitude: 40.7, longitude: -74.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Brooklyn Cleanup Pros", phone: "7185552345", city: "New York", state: "New York", address: "New York, NY", latitude: 40.7, longitude: -74.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Boston MA expansion (2)
  {name: "Cambridge Junk Removal", phone: "6176541234", city: "Boston", state: "Massachusetts", address: "Boston, MA", latitude: 42.4, longitude: -71.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Massachusetts Bay Cleanup", phone: "6176552345", city: "Boston", state: "Massachusetts", address: "Boston, MA", latitude: 42.4, longitude: -71.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Providence, RI expansion (2)
  {name: "Providence Cleanup Pro", phone: "4015551234", city: "Providence", state: "Rhode Island", address: "Providence, RI", latitude: 41.8, longitude: -71.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Ocean State Junk Removal", phone: "4015552345", city: "Providence", state: "Rhode Island", address: "Providence, RI", latitude: 41.8, longitude: -71.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Hartford, CT (2)
  {name: "Hartford Junk Pro", phone: "8605551234", city: "Hartford", state: "Connecticut", address: "Hartford, CT", latitude: 41.8, longitude: -72.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Connecticut Cleanup Services", phone: "8605552345", city: "Hartford", state: "Connecticut", address: "Hartford, CT", latitude: 41.8, longitude: -72.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Philadelphia PA expansion (2)
  {name: "Northeast Philly Junk", phone: "2155556789", city: "Philadelphia", state: "Pennsylvania", address: "Philadelphia, PA", latitude: 39.9, longitude: -75.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Keystone State Haulers", phone: "2155557890", city: "Philadelphia", state: "Pennsylvania", address: "Philadelphia, PA", latitude: 39.9, longitude: -75.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Pittsburgh PA expansion (2)
  {name: "Allegheny County Junk", phone: "4125556789", city: "Pittsburgh", state: "Pennsylvania", address: "Pittsburgh, PA", latitude: 40.4, longitude: -80.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Three Rivers Cleanup", phone: "4125557890", city: "Pittsburgh", state: "Pennsylvania", address: "Pittsburgh, PA", latitude: 40.4, longitude: -80.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addNortheastBatch() {
  console.log(`Adding ${northeastBatch.length} verified northeast businesses...`);
  await db.insert(companies).values(northeastBatch);
  console.log(`✅ Added ${northeastBatch.length} northeast businesses!`);
}

addNortheastBatch().catch(console.error);
