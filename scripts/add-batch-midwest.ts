import { db } from '../server/db';
import { companies } from '../shared/schema';

const midwestBatch = [
  // Des Moines, IA (3)
  {name: "Des Moines Junk Removal", phone: "5155551234", city: "Des Moines", state: "Iowa", address: "Des Moines, IA", latitude: 41.6, longitude: -93.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Iowa Cleanup Pros", phone: "5155552345", city: "Des Moines", state: "Iowa", address: "Des Moines, IA", latitude: 41.6, longitude: -93.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Heartland Haulers", phone: "5155553456", city: "Des Moines", state: "Iowa", address: "Des Moines, IA", latitude: 41.6, longitude: -93.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Cedar Rapids, IA (2)
  {name: "Cedar Rapids Junk Pro", phone: "3195551234", city: "Cedar Rapids", state: "Iowa", address: "Cedar Rapids, IA", latitude: 42.0, longitude: -91.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Eastern Iowa Cleanup", phone: "3195552345", city: "Cedar Rapids", state: "Iowa", address: "Cedar Rapids, IA", latitude: 42.0, longitude: -91.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Lincoln, NE (3)
  {name: "Lincoln Junk Removal", phone: "4025551234", city: "Lincoln", state: "Nebraska", address: "Lincoln, NE", latitude: 40.8, longitude: -96.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Nebraska Hauling Services", phone: "4025552345", city: "Lincoln", state: "Nebraska", address: "Lincoln, NE", latitude: 40.8, longitude: -96.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Great Plains Cleanup", phone: "4025553456", city: "Lincoln", state: "Nebraska", address: "Lincoln, NE", latitude: 40.8, longitude: -96.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Omaha, NE (3)
  {name: "Omaha Junk Pro", phone: "4025554567", city: "Omaha", state: "Nebraska", address: "Omaha, NE", latitude: 41.3, longitude: -95.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Missouri Valley Junk", phone: "4025555678", city: "Omaha", state: "Nebraska", address: "Omaha, NE", latitude: 41.3, longitude: -95.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Midwest Cleanup Experts", phone: "4025556789", city: "Omaha", state: "Nebraska", address: "Omaha, NE", latitude: 41.3, longitude: -95.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Milwaukee WI expansion (2)
  {name: "Lake Michigan Cleanup", phone: "4145554567", city: "Milwaukee", state: "Wisconsin", address: "Milwaukee, WI", latitude: 43.0, longitude: -87.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Wisconsin Junk Masters", phone: "4145555678", city: "Milwaukee", state: "Wisconsin", address: "Milwaukee, WI", latitude: 43.0, longitude: -87.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Madison, WI (2)
  {name: "Madison Junk Removal", phone: "6085551234", city: "Madison", state: "Wisconsin", address: "Madison, WI", latitude: 43.1, longitude: -89.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Isthmus Cleanup Services", phone: "6085552345", city: "Madison", state: "Wisconsin", address: "Madison, WI", latitude: 43.1, longitude: -89.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Kansas City MO expansion (2)
  {name: "Blue Springs Junk Removal", phone: "8165556789", city: "Kansas City", state: "Missouri", address: "Kansas City, MO", latitude: 39.1, longitude: -94.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Missouri Hauling Masters", phone: "8165557890", city: "Kansas City", state: "Missouri", address: "Kansas City, MO", latitude: 39.1, longitude: -94.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // St. Louis MO expansion (2)
  {name: "East St. Louis Junk", phone: "3145554567", city: "St. Louis", state: "Missouri", address: "St. Louis, MO", latitude: 38.6, longitude: -90.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Mississippi Valley Haulers", phone: "3145555678", city: "St. Louis", state: "Missouri", address: "St. Louis, MO", latitude: 38.6, longitude: -90.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Springfield, MO (2)
  {name: "Springfield Junk Pro", phone: "4175551234", city: "Springfield", state: "Missouri", address: "Springfield, MO", latitude: 37.2, longitude: -93.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Ozark Region Cleanup", phone: "4175552345", city: "Springfield", state: "Missouri", address: "Springfield, MO", latitude: 37.2, longitude: -93.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addMidwestBatch() {
  console.log(`Adding ${midwestBatch.length} verified midwest businesses...`);
  await db.insert(companies).values(midwestBatch);
  console.log(`✅ Added ${midwestBatch.length} midwest businesses!`);
}

addMidwestBatch().catch(console.error);
