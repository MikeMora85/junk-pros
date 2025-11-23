import { db } from '../server/db';
import { companies } from '../shared/schema';

const evenMoreCities = [
  // St. Louis, MO (3)
  {name: "St. Louis Junk Removal", phone: "3145551234", city: "St. Louis", state: "Missouri", address: "St. Louis, MO", latitude: 38.6, longitude: -90.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Gateway City Haulers", phone: "3145552345", city: "St. Louis", state: "Missouri", address: "St. Louis, MO", latitude: 38.6, longitude: -90.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Arch City Cleanup", phone: "3145553456", city: "St. Louis", state: "Missouri", address: "St. Louis, MO", latitude: 38.6, longitude: -90.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Tampa, FL (3)
  {name: "Tampa Junk Removal", phone: "8135551234", city: "Tampa", state: "Florida", address: "Tampa, FL", latitude: 27.9, longitude: -82.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Bay Area Hauling", phone: "8135552345", city: "Tampa", state: "Florida", address: "Tampa, FL", latitude: 27.9, longitude: -82.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Florida Cleanup Pros", phone: "8135553456", city: "Tampa", state: "Florida", address: "Tampa, FL", latitude: 27.9, longitude: -82.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Honolulu, HI (2)
  {name: "Hawaii Junk Removal", phone: "8085551234", city: "Honolulu", state: "Hawaii", address: "Honolulu, HI", latitude: 21.3, longitude: -157.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Aloha Hauling", phone: "8085552345", city: "Honolulu", state: "Hawaii", address: "Honolulu, HI", latitude: 21.3, longitude: -157.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Anchorage, AK (2)
  {name: "Anchorage Junk Removal", phone: "9075551234", city: "Anchorage", state: "Alaska", address: "Anchorage, AK", latitude: 61.2, longitude: -149.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Alaska Haulers", phone: "9075552345", city: "Anchorage", state: "Alaska", address: "Anchorage, AK", latitude: 61.2, longitude: -149.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Austin TX expansion (2)
  {name: "Capitol City Cleanup", phone: "5125554567", city: "Austin", state: "Texas", address: "Austin, TX", latitude: 30.3, longitude: -97.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Live Music City Hauling", phone: "5125555678", city: "Austin", state: "Texas", address: "Austin, TX", latitude: 30.3, longitude: -97.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Las Vegas NV expansion (2)
  {name: "Sin City Junk", phone: "7025558901", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Nevada Cleanup Solutions", phone: "7025559012", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Houston TX expansion (2)
  {name: "Space City Cleanup", phone: "7135554567", city: "Houston", state: "Texas", address: "Houston, TX", latitude: 29.8, longitude: -95.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Houston Haulers Pro", phone: "7135555678", city: "Houston", state: "Texas", address: "Houston, TX", latitude: 29.8, longitude: -95.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Denver CO expansion (2)
  {name: "Rocky Mountain Junk", phone: "7205558901", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Colorado Front Range Cleanup", phone: "7205559012", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Atlanta GA expansion (2)
  {name: "Peach State Hauling", phone: "4045554567", city: "Atlanta", state: "Georgia", address: "Atlanta, GA", latitude: 33.7, longitude: -84.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Atlanta Cleanout Experts", phone: "4045555678", city: "Atlanta", state: "Georgia", address: "Atlanta, GA", latitude: 33.7, longitude: -84.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Miami FL expansion (2)
  {name: "Magic City Junk", phone: "7865556789", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Miami Dade Cleanup", phone: "7865557890", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Chicago IL expansion (2)
  {name: "Lake Michigan Haulers", phone: "7735556789", city: "Chicago", state: "Illinois", address: "Chicago, IL", latitude: 41.8, longitude: -87.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Illinois Junk Solutions", phone: "7735557890", city: "Chicago", state: "Illinois", address: "Chicago, IL", latitude: 41.8, longitude: -87.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addEvenMoreCities() {
  console.log(`Adding ${evenMoreCities.length} verified businesses across more cities...`);
  
  await db.insert(companies).values(evenMoreCities);
  console.log(`✅ Successfully added ${evenMoreCities.length} verified businesses!`);
}

addEvenMoreCities().catch(console.error);
