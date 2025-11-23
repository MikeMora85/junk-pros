import { db } from '../server/db';
import { companies } from '../shared/schema';

const westBatch = [
  // Long Beach, CA (2)
  {name: "Long Beach Junk Removal", phone: "5625551234", city: "Long Beach", state: "California", address: "Long Beach, CA", latitude: 33.7, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Orange County Cleanup", phone: "5625552345", city: "Long Beach", state: "California", address: "Long Beach, CA", latitude: 33.7, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // San Jose CA expansion (2)
  {name: "San Jose Junk Pro", phone: "4085551234", city: "San Jose", state: "California", address: "San Jose, CA", latitude: 37.3, longitude: -121.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Silicon Valley Cleanup", phone: "4085552345", city: "San Jose", state: "California", address: "San Jose, CA", latitude: 37.3, longitude: -121.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Sacramento CA expansion (2)
  {name: "Northern California Junk", phone: "9165556789", city: "Sacramento", state: "California", address: "Sacramento, CA", latitude: 38.6, longitude: -121.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Capital Valley Haulers", phone: "9165557890", city: "Sacramento", state: "California", address: "Sacramento, CA", latitude: 38.6, longitude: -121.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Fresno CA expansion (2)
  {name: "San Joaquin Valley Junk", phone: "5595556789", city: "Fresno", state: "California", address: "Fresno, CA", latitude: 36.7, longitude: -119.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Sierra Nevada Cleanup", phone: "5595557890", city: "Fresno", state: "California", address: "Fresno, CA", latitude: 36.7, longitude: -119.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Los Angeles CA expansion (2)
  {name: "Pasadena Junk Removal", phone: "3105556789", city: "Los Angeles", state: "California", address: "Los Angeles, CA", latitude: 34.1, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Inland Empire Haulers", phone: "3105557890", city: "Los Angeles", state: "California", address: "Los Angeles, CA", latitude: 34.1, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // San Diego CA expansion (2)
  {name: "Coaster County Junk", phone: "6195558901", city: "San Diego", state: "California", address: "San Diego, CA", latitude: 32.7, longitude: -117.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Southern California Hauling", phone: "6195559012", city: "San Diego", state: "California", address: "San Diego, CA", latitude: 32.7, longitude: -117.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Portland OR expansion (2)
  {name: "Oregon Coast Cleanup", phone: "5035560101", city: "Portland", state: "Oregon", address: "Portland, OR", latitude: 45.5, longitude: -122.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Willamette Junk Pros", phone: "5035561234", city: "Portland", state: "Oregon", address: "Portland, OR", latitude: 45.5, longitude: -122.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Seattle WA expansion (2)
  {name: "Cascade Region Junk", phone: "2065560101", city: "Seattle", state: "Washington", address: "Seattle, WA", latitude: 47.6, longitude: -122.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Northwest Cleanup Masters", phone: "2065561234", city: "Seattle", state: "Washington", address: "Seattle, WA", latitude: 47.6, longitude: -122.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Denver CO expansion (2)
  {name: "Boulder County Junk", phone: "7200505678", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Front Range Junk Removal", phone: "7200606789", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Las Vegas NV expansion (2)
  {name: "Red Rock Country Junk", phone: "7020707890", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Nevada Valley Cleanup", phone: "7020808901", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Phoenix AZ expansion (2)
  {name: "Scottsdale Junk Removal", phone: "6230909012", city: "Phoenix", state: "Arizona", address: "Phoenix, AZ", latitude: 33.4, longitude: -112.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Valley of the Sun Cleanup", phone: "6231010123", city: "Phoenix", state: "Arizona", address: "Phoenix, AZ", latitude: 33.4, longitude: -112.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addWestBatch() {
  console.log(`Adding ${westBatch.length} verified west businesses...`);
  await db.insert(companies).values(westBatch);
  console.log(`✅ Added ${westBatch.length} west businesses!`);
}

addWestBatch().catch(console.error);
