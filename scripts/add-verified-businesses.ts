import { db } from '../server/db';
import { companies } from '../shared/schema';

const verifiedBusinesses = [
  // Austin, TX (3 verified with real phone)
  {name: "Jack Rabbit Junk Removal", phone: "5122655865", city: "Austin", state: "Texas", address: "Austin, TX", latitude: 30.3, longitude: -97.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Smiley's Junk Removal", phone: "5127871319", city: "Austin", state: "Texas", address: "Austin, TX", latitude: 30.3, longitude: -97.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Rise Junk Removal", phone: "7378022523", city: "Austin", state: "Texas", address: "Austin, TX", latitude: 30.3, longitude: -97.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // San Diego, CA (1 verified)
  {name: "Crisan Junk Removal", phone: "6195009920", city: "San Diego", state: "California", address: "San Diego, CA", latitude: 32.7, longitude: -117.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Las Vegas, NV (3 verified)
  {name: "Gone Junkin' Vegas", phone: "7029035137", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "We-Haul Junk Removal", phone: "7024650657", city: "Las Vegas", state: "Nevada", address: "Las Vegas, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Vegas JunkMan", phone: "7025275865", city: "Las Vegas", state: "Nevada", address: "Henderson, NV", latitude: 36.2, longitude: -115.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Denver, CO (2 verified)
  {name: "Mountain Men Junk Removal", phone: "3036885865", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Rockies Cleanouts", phone: "3034841191", city: "Denver", state: "Colorado", address: "Denver, CO", latitude: 39.7, longitude: -104.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Atlanta, GA (2 verified)
  {name: "Joseph's Junk Removal", phone: "4047389793", city: "Atlanta", state: "Georgia", address: "Atlanta, GA", latitude: 33.7, longitude: -84.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Up Up and Away Junk Hauling", phone: "4049094183", city: "Atlanta", state: "Georgia", address: "Atlanta, GA", latitude: 33.7, longitude: -84.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Chicago, IL (3 verified)
  {name: "Martinez Chicago Junk Removal", phone: "7739684146", city: "Chicago", state: "Illinois", address: "Chicago, IL", latitude: 41.8, longitude: -87.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "606 Junk", phone: "7734124902", city: "Chicago", state: "Illinois", address: "Chicago, IL", latitude: 41.8, longitude: -87.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Jurassic Junk Removal", phone: "8889445865", city: "Chicago", state: "Illinois", address: "Chicago, IL", latitude: 41.8, longitude: -87.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Seattle, WA (1 verified - Busby has 2 numbers, using main one)
  {name: "Busby Junk Removal", phone: "4252795937", city: "Seattle", state: "Washington", address: "Seattle, WA", latitude: 47.6, longitude: -122.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Boston, MA (2 verified)
  {name: "Hunks of Junk", phone: "8574654285", city: "Boston", state: "Massachusetts", address: "Boston, MA", latitude: 42.4, longitude: -71.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Junk Pro, Inc.", phone: "6174802285", city: "Boston", state: "Massachusetts", address: "Boston, MA", latitude: 42.4, longitude: -71.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Miami, FL (3 verified)
  {name: "ROMO Junk Removal", phone: "7862244093", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Mark Anthony Hauling", phone: "3057070125", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Junk Trash Removal Miami", phone: "7868376115", city: "Miami", state: "Florida", address: "Miami, FL", latitude: 25.8, longitude: -80.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Portland, OR (3 verified)
  {name: "All Oregon Junk Removal", phone: "5034557920", city: "Portland", state: "Oregon", address: "Portland, OR", latitude: 45.5, longitude: -122.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "PDX Junk Removal", phone: "5034096332", city: "Portland", state: "Oregon", address: "Portland, OR", latitude: 45.5, longitude: -122.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Metro Junk Solutions", phone: "5035216019", city: "Portland", state: "Oregon", address: "Portland, OR", latitude: 45.5, longitude: -122.7, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // San Francisco, CA (1 verified)
  {name: "Fast Haul", phone: "4156650800", city: "San Francisco", state: "California", address: "San Francisco, CA", latitude: 37.8, longitude: -122.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Philadelphia, PA (2 verified)
  {name: "We Love Junk", phone: "2674853338", city: "Philadelphia", state: "Pennsylvania", address: "Philadelphia, PA", latitude: 39.9, longitude: -75.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Junk Be Gone Philadelphia", phone: "8009163458", city: "Philadelphia", state: "Pennsylvania", address: "Philadelphia, PA", latitude: 39.9, longitude: -75.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Washington DC (1 verified)
  {name: "Beeline Junk & Hauling", phone: "2026300449", city: "Washington", state: "District of Columbia", address: "Washington, DC", latitude: 38.9, longitude: -77.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Detroit, MI (1 verified)
  {name: "U.S. Trash Junk Removal", phone: "8553873874", city: "Detroit", state: "Michigan", address: "Detroit, MI", latitude: 42.3, longitude: -83.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Minneapolis, MN (2 verified)
  {name: "Big Boy's Junk Removal LLC", phone: "6127206431", city: "Minneapolis", state: "Minnesota", address: "Minneapolis, MN", latitude: 44.9, longitude: -93.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Junk Happens", phone: "6123335865", city: "Minneapolis", state: "Minnesota", address: "Minneapolis, MN", latitude: 44.9, longitude: -93.3, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  
  // Providence/Boston area (1 verified)
  {name: "Trash Can Willys", phone: "6174205695", city: "Boston", state: "Massachusetts", address: "Boston, MA", latitude: 42.4, longitude: -71.1, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addVerifiedBusinesses() {
  console.log(`Adding ${verifiedBusinesses.length} VERIFIED local independent junk removal businesses with REAL phone numbers...`);
  
  await db.insert(companies).values(verifiedBusinesses);
  console.log(`✅ Successfully added ${verifiedBusinesses.length} verified businesses!`);
}

addVerifiedBusinesses().catch(console.error);
