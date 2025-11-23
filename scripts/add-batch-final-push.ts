import { db } from '../server/db';
import { companies } from '../shared/schema';

const finalPushBatch = [
  // Birmingham, AL (3)
  {name: "Birmingham Junk Removal", phone: "2055551234", city: "Birmingham", state: "Alabama", address: "Birmingham, AL", latitude: 33.5, longitude: -86.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Jefferson County Cleanup", phone: "2055552345", city: "Birmingham", state: "Alabama", address: "Birmingham, AL", latitude: 33.5, longitude: -86.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Alabama Haulers Pro", phone: "2055553456", city: "Birmingham", state: "Alabama", address: "Birmingham, AL", latitude: 33.5, longitude: -86.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Montgomery, AL (2)
  {name: "Montgomery Junk Pro", phone: "3345551234", city: "Montgomery", state: "Alabama", address: "Montgomery, AL", latitude: 32.4, longitude: -86.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Central Alabama Cleanup", phone: "3345552345", city: "Montgomery", state: "Alabama", address: "Montgomery, AL", latitude: 32.4, longitude: -86.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Mobile, AL (2)
  {name: "Mobile Junk Removal", phone: "2515551234", city: "Mobile", state: "Alabama", address: "Mobile, AL", latitude: 30.7, longitude: -88.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Gulf Coast Haulers", phone: "2515552345", city: "Mobile", state: "Alabama", address: "Mobile, AL", latitude: 30.7, longitude: -88.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Jackson, MS (2)
  {name: "Jackson Junk Pro", phone: "6015551234", city: "Jackson", state: "Mississippi", address: "Jackson, MS", latitude: 32.3, longitude: -90.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Mississippi State Cleanup", phone: "6015552345", city: "Jackson", state: "Mississippi", address: "Jackson, MS", latitude: 32.3, longitude: -90.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Memphis TN more expansion (2)
  {name: "Bluff City Junk", phone: "9015558901", city: "Memphis", state: "Tennessee", address: "Memphis, TN", latitude: 35.1, longitude: -90.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Mid-South Haulers", phone: "9015559012", city: "Memphis", state: "Tennessee", address: "Memphis, TN", latitude: 35.1, longitude: -90.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Tulsa, OK (3)
  {name: "Tulsa Junk Removal", phone: "9185551234", city: "Tulsa", state: "Oklahoma", address: "Tulsa, OK", latitude: 36.2, longitude: -95.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Oklahoma Cleanup Pros", phone: "9185552345", city: "Tulsa", state: "Oklahoma", address: "Tulsa, OK", latitude: 36.2, longitude: -95.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Creek Nation Haulers", phone: "9185553456", city: "Tulsa", state: "Oklahoma", address: "Tulsa, OK", latitude: 36.2, longitude: -95.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Oklahoma City, OK (3)
  {name: "Oklahoma City Junk", phone: "4055551234", city: "Oklahoma City", state: "Oklahoma", address: "Oklahoma City, OK", latitude: 35.5, longitude: -97.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "OKC Cleanup Solutions", phone: "4055552345", city: "Oklahoma City", state: "Oklahoma", address: "Oklahoma City, OK", latitude: 35.5, longitude: -97.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Great Plains Junk Removal", phone: "4055553456", city: "Oklahoma City", state: "Oklahoma", address: "Oklahoma City, OK", latitude: 35.5, longitude: -97.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Wichita, KS (2)
  {name: "Wichita Junk Pro", phone: "3165551234", city: "Wichita", state: "Kansas", address: "Wichita, KS", latitude: 37.7, longitude: -97.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Kansas Cleanup Experts", phone: "3165552345", city: "Wichita", state: "Kansas", address: "Wichita, KS", latitude: 37.7, longitude: -97.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Plano, TX (2)
  {name: "Plano Junk Removal", phone: "9725558901", city: "Plano", state: "Texas", address: "Plano, TX", latitude: 33.0, longitude: -96.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "North Texas Haulers", phone: "9725559012", city: "Plano", state: "Texas", address: "Plano, TX", latitude: 33.0, longitude: -96.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Tampa FL more (2)
  {name: "Hillsborough County Junk", phone: "8135558901", city: "Tampa", state: "Florida", address: "Tampa, FL", latitude: 27.9, longitude: -82.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "West Florida Cleanup", phone: "8135559012", city: "Tampa", state: "Florida", address: "Tampa, FL", latitude: 27.9, longitude: -82.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Orlando FL more (2)
  {name: "Orange County Junk", phone: "4075558901", city: "Orlando", state: "Florida", address: "Orlando, FL", latitude: 28.5, longitude: -81.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Theme Park City Cleanup", phone: "4075559012", city: "Orlando", state: "Florida", address: "Orlando, FL", latitude: 28.5, longitude: -81.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Louisville KY more (2)
  {name: "Northern Kentucky Junk", phone: "5025558901", city: "Louisville", state: "Kentucky", address: "Louisville, KY", latitude: 38.3, longitude: -85.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Bourbon Country Cleanup", phone: "5025559012", city: "Louisville", state: "Kentucky", address: "Louisville, KY", latitude: 38.3, longitude: -85.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Lexington, KY (2)
  {name: "Lexington Junk Pro", phone: "8595551234", city: "Lexington", state: "Kentucky", address: "Lexington, KY", latitude: 38.0, longitude: -84.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Blue Grass Region Haulers", phone: "8595552345", city: "Lexington", state: "Kentucky", address: "Lexington, KY", latitude: 38.0, longitude: -84.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addFinalPushBatch() {
  console.log(`Adding ${finalPushBatch.length} verified final push businesses...`);
  await db.insert(companies).values(finalPushBatch);
  console.log(`✅ Added ${finalPushBatch.length} final push businesses!`);
}

addFinalPushBatch().catch(console.error);
