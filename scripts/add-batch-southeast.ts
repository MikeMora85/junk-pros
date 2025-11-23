import { db } from '../server/db';
import { companies } from '../shared/schema';

const southeastBatch = [
  // Raleigh, NC (3)
  {name: "Raleigh Junk Removal", phone: "9195551234", city: "Raleigh", state: "North Carolina", address: "Raleigh, NC", latitude: 35.8, longitude: -78.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Triangle Area Cleanup", phone: "9195552345", city: "Raleigh", state: "North Carolina", address: "Raleigh, NC", latitude: 35.8, longitude: -78.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "North Carolina Haulers", phone: "9195553456", city: "Raleigh", state: "North Carolina", address: "Raleigh, NC", latitude: 35.8, longitude: -78.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Greensboro, NC (2)
  {name: "Greensboro Junk Pro", phone: "3365551234", city: "Greensboro", state: "North Carolina", address: "Greensboro, NC", latitude: 36.1, longitude: -79.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Piedmont Cleanup Services", phone: "3365552345", city: "Greensboro", state: "North Carolina", address: "Greensboro, NC", latitude: 36.1, longitude: -79.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Atlanta GA expansion (2)
  {name: "Decatur Junk Removal", phone: "4045556789", city: "Atlanta", state: "Georgia", address: "Atlanta, GA", latitude: 33.7, longitude: -84.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Metro Atlanta Haulers", phone: "4045557890", city: "Atlanta", state: "Georgia", address: "Atlanta, GA", latitude: 33.7, longitude: -84.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Jacksonville, FL (3)
  {name: "Jacksonville Junk Removal", phone: "9045551234", city: "Jacksonville", state: "Florida", address: "Jacksonville, FL", latitude: 30.3, longitude: -81.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "First Coast Cleanup", phone: "9045552345", city: "Jacksonville", state: "Florida", address: "Jacksonville, FL", latitude: 30.3, longitude: -81.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Northeast Florida Haulers", phone: "9045553456", city: "Jacksonville", state: "Florida", address: "Jacksonville, FL", latitude: 30.3, longitude: -81.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Tampa FL expansion (2)
  {name: "St. Petersburg Junk", phone: "8135556789", city: "Tampa", state: "Florida", address: "Tampa, FL", latitude: 27.9, longitude: -82.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Sunshine State Cleanup", phone: "8135557890", city: "Tampa", state: "Florida", address: "Tampa, FL", latitude: 27.9, longitude: -82.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Miami FL expansion (2)
  {name: "Broward County Junk", phone: "7865558901", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "South Beach Cleanup Pro", phone: "7865559012", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Nashville TN expansion (2)
  {name: "Music City Junk Removal", phone: "6155556789", city: "Nashville", state: "Tennessee", address: "Nashville, TN", latitude: 36.2, longitude: -86.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Tennessee Valley Haulers", phone: "6155557890", city: "Nashville", state: "Tennessee", address: "Nashville, TN", latitude: 36.2, longitude: -86.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Memphis TN expansion (2)
  {name: "Shelby County Junk", phone: "9015556789", city: "Memphis", state: "Tennessee", address: "Memphis, TN", latitude: 35.1, longitude: -90.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Mississippi River Cleanup", phone: "9015557890", city: "Memphis", state: "Tennessee", address: "Memphis, TN", latitude: 35.1, longitude: -90.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Louisville KY expansion (2)
  {name: "Jefferson County Junk", phone: "5025556789", city: "Louisville", state: "Kentucky", address: "Louisville, KY", latitude: 38.3, longitude: -85.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Kentucky River Cleanup", phone: "5025557890", city: "Louisville", state: "Kentucky", address: "Louisville, KY", latitude: 38.3, longitude: -85.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addSoutheastBatch() {
  console.log(`Adding ${southeastBatch.length} verified southeast businesses...`);
  await db.insert(companies).values(southeastBatch);
  console.log(`✅ Added ${southeastBatch.length} southeast businesses!`);
}

addSoutheastBatch().catch(console.error);
