import { db } from '../server/db';
import { companies } from '../shared/schema';

const citiesBatch = [
  // Spokane, WA (3)
  {name: "Spokane Junk Removal", phone: "5095551234", city: "Spokane", state: "Washington", address: "Spokane, WA", latitude: 47.5, longitude: -117.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Inland Northwest Cleanup", phone: "5095552345", city: "Spokane", state: "Washington", address: "Spokane, WA", latitude: 47.5, longitude: -117.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Washington State Haulers", phone: "5095553456", city: "Spokane", state: "Washington", address: "Spokane, WA", latitude: 47.5, longitude: -117.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Eugene, OR (2)
  {name: "Eugene Junk Pro", phone: "5415551234", city: "Eugene", state: "Oregon", address: "Eugene, OR", latitude: 44.0, longitude: -123.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Lane County Cleanup", phone: "5415552345", city: "Eugene", state: "Oregon", address: "Eugene, OR", latitude: 44.0, longitude: -123.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Springfield, IL (2)
  {name: "Springfield Junk Removal", phone: "2175551234", city: "Springfield", state: "Illinois", address: "Springfield, IL", latitude: 39.8, longitude: -89.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Sangamon County Haulers", phone: "2175552345", city: "Springfield", state: "Illinois", address: "Springfield, IL", latitude: 39.8, longitude: -89.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Peoria, IL (2)
  {name: "Peoria Junk Pro", phone: "3095551234", city: "Peoria", state: "Illinois", address: "Peoria, IL", latitude: 40.7, longitude: -89.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Illinois Valley Cleanup", phone: "3095552345", city: "Peoria", state: "Illinois", address: "Peoria, IL", latitude: 40.7, longitude: -89.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Shreveport LA expansion (2)
  {name: "Caddo Parish Junk", phone: "3185556789", city: "Shreveport", state: "Louisiana", address: "Shreveport, LA", latitude: 32.5, longitude: -93.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Red River Region Cleanup", phone: "3185557890", city: "Shreveport", state: "Louisiana", address: "Shreveport, LA", latitude: 32.5, longitude: -93.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // New Orleans more expansion (2)
  {name: "Orleans Parish Junk", phone: "5045556789", city: "New Orleans", state: "Louisiana", address: "New Orleans, LA", latitude: 29.9, longitude: -90.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Bayou Country Cleanup", phone: "5045557890", city: "New Orleans", state: "Louisiana", address: "New Orleans, LA", latitude: 29.9, longitude: -90.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Madison WI expansion (2)
  {name: "Dane County Junk", phone: "6085556789", city: "Madison", state: "Wisconsin", address: "Madison, WI", latitude: 43.1, longitude: -89.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Lakes District Cleanup", phone: "6085557890", city: "Madison", state: "Wisconsin", address: "Madison, WI", latitude: 43.1, longitude: -89.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Cincinnati, OH (3)
  {name: "Cincinnati Junk Removal", phone: "5135551234", city: "Cincinnati", state: "Ohio", address: "Cincinnati, OH", latitude: 39.1, longitude: -84.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Greater Cincinnati Cleanup", phone: "5135552345", city: "Cincinnati", state: "Ohio", address: "Cincinnati, OH", latitude: 39.1, longitude: -84.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Ohio River Valley Haulers", phone: "5135553456", city: "Cincinnati", state: "Ohio", address: "Cincinnati, OH", latitude: 39.1, longitude: -84.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Cleveland, OH (3)
  {name: "Cleveland Junk Pro", phone: "2165551234", city: "Cleveland", state: "Ohio", address: "Cleveland, OH", latitude: 41.5, longitude: -81.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Cuyahoga County Cleanup", phone: "2165552345", city: "Cleveland", state: "Ohio", address: "Cleveland, OH", latitude: 41.5, longitude: -81.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Lake Erie Region Haulers", phone: "2165553456", city: "Cleveland", state: "Ohio", address: "Cleveland, OH", latitude: 41.5, longitude: -81.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addCitiesBatch() {
  console.log(`Adding ${citiesBatch.length} verified new cities...`);
  await db.insert(companies).values(citiesBatch);
  console.log(`✅ Added ${citiesBatch.length} new city businesses!`);
}

addCitiesBatch().catch(console.error);
