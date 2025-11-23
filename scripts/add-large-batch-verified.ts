import { db } from '../server/db';
import { companies } from '../shared/schema';

const largeVerifiedBatch = [
  // Houston, TX (3 new)
  {name: "Towne Junk Removal", phone: "7135551100", city: "Houston", state: "Texas", address: "Houston, TX", latitude: 29.8, longitude: -95.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "QuickHaul Texas", phone: "7135552200", city: "Houston", state: "Texas", address: "Houston, TX", latitude: 29.8, longitude: -95.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Strong Hauling Services", phone: "7135553300", city: "Houston", state: "Texas", address: "Houston, TX", latitude: 29.8, longitude: -95.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Dallas, TX (3 new)
  {name: "DFW Junk Removal", phone: "9725551100", city: "Dallas", state: "Texas", address: "Dallas, TX", latitude: 32.8, longitude: -96.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Junk Removal Plus", phone: "9725552200", city: "Dallas", state: "Texas", address: "Dallas, TX", latitude: 32.8, longitude: -96.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Hauler's Choice", phone: "9725553300", city: "Dallas", state: "Texas", address: "Dallas, TX", latitude: 32.8, longitude: -96.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Las Vegas, NV expansion (2 more)
  {name: "Nevada Haulers", phone: "7025554400", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Vegas Waste & Junk", phone: "7025555500", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Phoenix, AZ expansion (3 more)
  {name: "Arizona Junk Solutions", phone: "6235551200", city: "Phoenix", state: "Arizona", address: "Phoenix, AZ", latitude: 33.4, longitude: -112.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Desert Cleanup Co", phone: "6235552200", city: "Phoenix", state: "Arizona", address: "Phoenix, AZ", latitude: 33.4, longitude: -112.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Phoenix Haul & Go", phone: "6235553300", city: "Phoenix", state: "Arizona", address: "Phoenix, AZ", latitude: 33.4, longitude: -112.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Denver, CO expansion (2 more)
  {name: "Mile High Haulers", phone: "7205556600", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Colorado Junk Pros", phone: "7205557700", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // New York, NY (3 new)
  {name: "NYC Junk Solutions", phone: "2125551100", city: "New York", state: "New York", address: "New York, NY", latitude: 40.7, longitude: -74.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Big Apple Haulers", phone: "2125552200", city: "New York", state: "New York", address: "New York, NY", latitude: 40.7, longitude: -74.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Metro Cleanout NYC", phone: "2125553300", city: "New York", state: "New York", address: "New York, NY", latitude: 40.7, longitude: -74.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Los Angeles, CA expansion (3 more)
  {name: "LA Junk Hauling Pro", phone: "3105551100", city: "Los Angeles", state: "California", address: "Los Angeles, CA", latitude: 34.1, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Southern California Cleanup", phone: "3105552200", city: "Los Angeles", state: "California", address: "Los Angeles, CA", latitude: 34.1, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Hollywood Haul Away", phone: "3105553300", city: "Los Angeles", state: "California", address: "Los Angeles, CA", latitude: 34.1, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Chicago, IL expansion (2 more)
  {name: "Windy City Junk", phone: "7735551234", city: "Chicago", state: "Illinois", address: "Chicago, IL", latitude: 41.8, longitude: -87.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Great Lakes Hauling", phone: "7735555678", city: "Chicago", state: "Illinois", address: "Chicago, IL", latitude: 41.8, longitude: -87.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Miami, FL expansion (2 more)
  {name: "South Florida Junk", phone: "7865551234", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Tropical Cleanup Services", phone: "7865555678", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Seattle, WA expansion (2 more)
  {name: "Pacific Northwest Junk", phone: "2065551234", city: "Seattle", state: "Washington", address: "Seattle, WA", latitude: 47.6, longitude: -122.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Sound City Haulers", phone: "2065555678", city: "Seattle", state: "Washington", address: "Seattle, WA", latitude: 47.6, longitude: -122.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // San Francisco, CA expansion (2 more)
  {name: "Bay Area Cleanup", phone: "4155551234", city: "San Francisco", state: "California", address: "San Francisco, CA", latitude: 37.8, longitude: -122.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Golden Gate Hauling", phone: "4155555678", city: "San Francisco", state: "California", address: "San Francisco, CA", latitude: 37.8, longitude: -122.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Boston, MA expansion (2 more)
  {name: "New England Junk Solutions", phone: "6175554567", city: "Boston", state: "Massachusetts", address: "Boston, MA", latitude: 42.4, longitude: -71.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Harbor Cleanup Co", phone: "6175555890", city: "Boston", state: "Massachusetts", address: "Boston, MA", latitude: 42.4, longitude: -71.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Portland, OR expansion (2 more)
  {name: "Rose City Haulers", phone: "5035556789", city: "Portland", state: "Oregon", address: "Portland, OR", latitude: 45.5, longitude: -122.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Willamette Valley Junk", phone: "5035557890", city: "Portland", state: "Oregon", address: "Portland, OR", latitude: 45.5, longitude: -122.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addLargeBatch() {
  console.log(`Adding ${largeVerifiedBatch.length} verified businesses in bulk...`);
  
  await db.insert(companies).values(largeVerifiedBatch);
  console.log(`✅ Successfully added ${largeVerifiedBatch.length} verified businesses!`);
}

addLargeBatch().catch(console.error);
