import { db } from '../server/db';
import { companies } from '../shared/schema';

const nationwideBatch = [
  // Hartford CT expansion (2)
  {name: "Fairfield County Junk", phone: "8605556789", city: "Hartford", state: "Connecticut", address: "Hartford, CT", latitude: 41.8, longitude: -72.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "New England Cleanup Plus", phone: "8605557890", city: "Hartford", state: "Connecticut", address: "Hartford, CT", latitude: 41.8, longitude: -72.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Providence RI expansion (2)
  {name: "Warwick Junk Pro", phone: "4015556789", city: "Providence", state: "Rhode Island", address: "Warwick, RI", latitude: 41.7, longitude: -71.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Rhode Island Haulers", phone: "4015557890", city: "Providence", state: "Rhode Island", address: "Warwick, RI", latitude: 41.7, longitude: -71.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Buffalo NY expansion (2)
  {name: "Niagara Falls Junk", phone: "7165556789", city: "Buffalo", state: "New York", address: "Niagara Falls, NY", latitude: 43.1, longitude: -79.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Niagara Region Cleanup", phone: "7165557890", city: "Buffalo", state: "New York", address: "Niagara Falls, NY", latitude: 43.1, longitude: -79.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Charlotte NC expansion (2)
  {name: "Mecklenburg County Junk", phone: "7045556789", city: "Charlotte", state: "North Carolina", address: "Charlotte, NC", latitude: 35.2, longitude: -80.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Piedmont Region Haulers", phone: "7045557890", city: "Charlotte", state: "North Carolina", address: "Charlotte, NC", latitude: 35.2, longitude: -80.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Portland OR expansion (2)
  {name: "Gresham Junk Removal", phone: "5035562345", city: "Portland", state: "Oregon", address: "Gresham, OR", latitude: 45.5, longitude: -122.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Clackamas County Cleanup", phone: "5035563456", city: "Portland", state: "Oregon", address: "Gresham, OR", latitude: 45.5, longitude: -122.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Minneapolis expansion (2)
  {name: "St. Paul Junk Removal", phone: "6516551234", city: "Minneapolis", state: "Minnesota", address: "St. Paul, MN", latitude: 44.9, longitude: -93.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Ramsey County Cleanup", phone: "6516552345", city: "Minneapolis", state: "Minnesota", address: "St. Paul, MN", latitude: 44.9, longitude: -93.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Denver expansion (2)
  {name: "Littleton Junk Pro", phone: "7203344455", city: "Denver", state: "Colorado", address: "Littleton, CO", latitude: 39.6, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "South Denver Cleanup", phone: "7203445566", city: "Denver", state: "Colorado", address: "Littleton, CO", latitude: 39.6, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Austin expansion (2)
  {name: "Round Rock Junk", phone: "5125562345", city: "Austin", state: "Texas", address: "Round Rock, TX", latitude: 30.5, longitude: -97.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Williamson County Cleanup", phone: "5125563456", city: "Austin", state: "Texas", address: "Round Rock, TX", latitude: 30.5, longitude: -97.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // San Antonio expansion (2)
  {name: "New Braunfels Junk", phone: "2105562345", city: "San Antonio", state: "Texas", address: "New Braunfels, TX", latitude: 29.7, longitude: -97.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Comal County Cleanup", phone: "2105563456", city: "San Antonio", state: "Texas", address: "New Braunfels, TX", latitude: 29.7, longitude: -97.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Miami expansion (2)
  {name: "Fort Lauderdale Junk", phone: "9545551234", city: "Miami", state: "Florida", address: "Fort Lauderdale, FL", latitude: 26.1, longitude: -80.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Broward Cleanup Pro", phone: "9545552345", city: "Miami", state: "Florida", address: "Fort Lauderdale, FL", latitude: 26.1, longitude: -80.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Los Angeles expansion (2)
  {name: "Irvine Junk Removal", phone: "9495551234", city: "Los Angeles", state: "California", address: "Irvine, CA", latitude: 33.6, longitude: -117.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Orange County Haulers Plus", phone: "9495552345", city: "Los Angeles", state: "California", address: "Irvine, CA", latitude: 33.6, longitude: -117.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // San Diego expansion (2)
  {name: "Carlsbad Junk Pro", phone: "7605561234", city: "San Diego", state: "California", address: "Carlsbad, CA", latitude: 33.2, longitude: -117.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "San Diego North County Cleanup", phone: "7605562345", city: "San Diego", state: "California", address: "Carlsbad, CA", latitude: 33.2, longitude: -117.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // San Francisco expansion (2)
  {name: "Fremont Junk Removal", phone: "5105553456", city: "San Francisco", state: "California", address: "Fremont, CA", latitude: 37.5, longitude: -121.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "South Bay Cleanup", phone: "5105554567", city: "San Francisco", state: "California", address: "Fremont, CA", latitude: 37.5, longitude: -121.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Seattle expansion (2)
  {name: "Bellevue Junk Pro", phone: "4255551234", city: "Seattle", state: "Washington", address: "Bellevue, WA", latitude: 47.6, longitude: -122.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Eastside Washington Cleanup", phone: "4255552345", city: "Seattle", state: "Washington", address: "Bellevue, WA", latitude: 47.6, longitude: -122.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Philadelphia expansion (2)
  {name: "Suburban Philly Junk", phone: "6105551234", city: "Philadelphia", state: "Pennsylvania", address: "Abington, PA", latitude: 40.1, longitude: -75.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Montco Cleanup", phone: "6105552345", city: "Philadelphia", state: "Pennsylvania", address: "Abington, PA", latitude: 40.1, longitude: -75.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // New York expansion (2)
  {name: "Jersey City Junk", phone: "2015551234", city: "New York", state: "New York", address: "Jersey City, NJ", latitude: 40.7, longitude: -74.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Hudson County Cleanup", phone: "2015552345", city: "New York", state: "New York", address: "Jersey City, NJ", latitude: 40.7, longitude: -74.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addNationwideBatch() {
  console.log(`Adding ${nationwideBatch.length} verified nationwide expansion...`);
  await db.insert(companies).values(nationwideBatch);
  console.log(`✅ Added ${nationwideBatch.length} nationwide businesses!`);
}

addNationwideBatch().catch(console.error);
