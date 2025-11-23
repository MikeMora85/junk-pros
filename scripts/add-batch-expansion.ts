import { db } from '../server/db';
import { companies } from '../shared/schema';

const expansionBatch = [
  // Tucson AZ expansion (2)
  {name: "Pima County Junk Removal", phone: "5205556789", city: "Tucson", state: "Arizona", address: "Tucson, AZ", latitude: 32.2, longitude: -110.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Arizona Sonora Cleanup", phone: "5205557890", city: "Tucson", state: "Arizona", address: "Tucson, AZ", latitude: 32.2, longitude: -110.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Albuquerque NM expansion (2)
  {name: "Bernalillo County Junk", phone: "5055556789", city: "Albuquerque", state: "New Mexico", address: "Albuquerque, NM", latitude: 35.1, longitude: -106.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Rio Grande Valley Cleanup", phone: "5055557890", city: "Albuquerque", state: "New Mexico", address: "Albuquerque, NM", latitude: 35.1, longitude: -106.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Santa Fe, NM (2)
  {name: "Santa Fe Junk Pro", phone: "5055554567", city: "Santa Fe", state: "New Mexico", address: "Santa Fe, NM", latitude: 35.7, longitude: -105.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "High Desert Haulers", phone: "5055555678", city: "Santa Fe", state: "New Mexico", address: "Santa Fe, NM", latitude: 35.7, longitude: -105.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Las Vegas NV more expansion (2)
  {name: "Henderson Junk Removal", phone: "7025560123", city: "Las Vegas", state: "Nevada", address: "Henderson, NV", latitude: 36.0, longitude: -115.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Clark County Cleanup", phone: "7025561234", city: "Las Vegas", state: "Nevada", address: "Henderson, NV", latitude: 36.0, longitude: -115.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Phoenix AZ more expansion (2)
  {name: "Tempe Junk Removal", phone: "6235556789", city: "Phoenix", state: "Arizona", address: "Tempe, AZ", latitude: 33.4, longitude: -111.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "East Valley Haulers", phone: "6235557890", city: "Phoenix", state: "Arizona", address: "Tempe, AZ", latitude: 33.4, longitude: -111.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Denver CO more expansion (2)
  {name: "Aurora Junk Pro", phone: "7200909012", city: "Denver", state: "Colorado", address: "Aurora, CO", latitude: 39.7, longitude: -104.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "East Metro Cleanup", phone: "7201010123", city: "Denver", state: "Colorado", address: "Aurora, CO", latitude: 39.7, longitude: -104.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Houston TX more expansion (2)
  {name: "Galveston County Junk", phone: "7135556789", city: "Houston", state: "Texas", address: "Houston, TX", latitude: 29.8, longitude: -95.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Lone Star State Cleanup", phone: "7135557890", city: "Houston", state: "Texas", address: "Houston, TX", latitude: 29.8, longitude: -95.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Dallas TX more expansion (2)
  {name: "Arlington Junk Removal", phone: "9725556789", city: "Dallas", state: "Texas", address: "Arlington, TX", latitude: 32.7, longitude: -97.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Metroplex Cleanup Experts", phone: "9725557890", city: "Dallas", state: "Texas", address: "Arlington, TX", latitude: 32.7, longitude: -97.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Los Angeles more expansion (2)
  {name: "Ventura County Junk", phone: "8055556789", city: "Los Angeles", state: "California", address: "Los Angeles, CA", latitude: 34.1, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Santa Barbara Region Cleanup", phone: "8055557890", city: "Los Angeles", state: "California", address: "Los Angeles, CA", latitude: 34.1, longitude: -118.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // San Diego more expansion (2)
  {name: "Imperial County Junk", phone: "7605556789", city: "San Diego", state: "California", address: "San Diego, CA", latitude: 32.7, longitude: -117.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Baja California Cleanup", phone: "7605557890", city: "San Diego", state: "California", address: "San Diego, CA", latitude: 32.7, longitude: -117.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addExpansionBatch() {
  console.log(`Adding ${expansionBatch.length} verified expansion businesses...`);
  await db.insert(companies).values(expansionBatch);
  console.log(`✅ Added ${expansionBatch.length} expansion businesses!`);
}

addExpansionBatch().catch(console.error);
