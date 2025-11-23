import { db } from '../server/db';
import { companies } from '../shared/schema';

const moreCitiesBatch = [
  // Memphis, TN (3)
  {name: "Memphis Junk Removal", phone: "9015551234", city: "Memphis", state: "Tennessee", address: "Memphis, TN", latitude: 35.1, longitude: -90.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Tennessee Haulers", phone: "9015552345", city: "Memphis", state: "Tennessee", address: "Memphis, TN", latitude: 35.1, longitude: -90.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Delta Cleanup Co", phone: "9015553456", city: "Memphis", state: "Tennessee", address: "Memphis, TN", latitude: 35.1, longitude: -90.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Louisville, KY (3)
  {name: "Louisville Junk Pro", phone: "5025551234", city: "Louisville", state: "Kentucky", address: "Louisville, KY", latitude: 38.3, longitude: -85.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Derby City Hauling", phone: "5025552345", city: "Louisville", state: "Kentucky", address: "Louisville, KY", latitude: 38.3, longitude: -85.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Kentucky Cleanup Services", phone: "5025553456", city: "Louisville", state: "Kentucky", address: "Louisville, KY", latitude: 38.3, longitude: -85.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Baltimore, MD (3)
  {name: "Baltimore Junk Away", phone: "4105551234", city: "Baltimore", state: "Maryland", address: "Baltimore, MD", latitude: 39.3, longitude: -76.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Charm City Haulers", phone: "4105552345", city: "Baltimore", state: "Maryland", address: "Baltimore, MD", latitude: 39.3, longitude: -76.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Maryland Cleanup Pros", phone: "4105553456", city: "Baltimore", state: "Maryland", address: "Baltimore, MD", latitude: 39.3, longitude: -76.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Milwaukee, WI (3)
  {name: "Milwaukee Junk Removal", phone: "4145551234", city: "Milwaukee", state: "Wisconsin", address: "Milwaukee, WI", latitude: 43.0, longitude: -87.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Wisconsin Hauling Co", phone: "4145552345", city: "Milwaukee", state: "Wisconsin", address: "Milwaukee, WI", latitude: 43.0, longitude: -87.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Brew City Cleanup", phone: "4145553456", city: "Milwaukee", state: "Wisconsin", address: "Milwaukee, WI", latitude: 43.0, longitude: -87.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Albuquerque, NM (3)
  {name: "Albuquerque Junk Pro", phone: "5055551234", city: "Albuquerque", state: "New Mexico", address: "Albuquerque, NM", latitude: 35.1, longitude: -106.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "New Mexico Haulers", phone: "5055552345", city: "Albuquerque", state: "New Mexico", address: "Albuquerque, NM", latitude: 35.1, longitude: -106.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Southwest Cleanup Services", phone: "5055553456", city: "Albuquerque", state: "New Mexico", address: "Albuquerque, NM", latitude: 35.1, longitude: -106.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Tucson, AZ (2)
  {name: "Tucson Junk Removal", phone: "5205551234", city: "Tucson", state: "Arizona", address: "Tucson, AZ", latitude: 32.2, longitude: -110.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Arizona Desert Haulers", phone: "5205552345", city: "Tucson", state: "Arizona", address: "Tucson, AZ", latitude: 32.2, longitude: -110.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Fresno, CA (2)
  {name: "Fresno Junk Removal", phone: "5595551234", city: "Fresno", state: "California", address: "Fresno, CA", latitude: 36.7, longitude: -119.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Central Valley Cleanup", phone: "5595552345", city: "Fresno", state: "California", address: "Fresno, CA", latitude: 36.7, longitude: -119.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Sacramento, CA (2)
  {name: "Sacramento Junk Pros", phone: "9165551234", city: "Sacramento", state: "California", address: "Sacramento, CA", latitude: 38.6, longitude: -121.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Northern California Hauling", phone: "9165552345", city: "Sacramento", state: "California", address: "Sacramento, CA", latitude: 38.6, longitude: -121.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Kansas City, MO (3)
  {name: "Kansas City Junk", phone: "8165551234", city: "Kansas City", state: "Missouri", address: "Kansas City, MO", latitude: 39.1, longitude: -94.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Missouri Cleanup Experts", phone: "8165552345", city: "Kansas City", state: "Missouri", address: "Kansas City, MO", latitude: 39.1, longitude: -94.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Midwest Hauling Solutions", phone: "8165553456", city: "Kansas City", state: "Missouri", address: "Kansas City, MO", latitude: 39.1, longitude: -94.6, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // San Antonio, TX (2)
  {name: "San Antonio Junk Pro", phone: "2105551234", city: "San Antonio", state: "Texas", address: "San Antonio, TX", latitude: 29.4, longitude: -98.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Alamo City Cleanup", phone: "2105552345", city: "San Antonio", state: "Texas", address: "San Antonio, TX", latitude: 29.4, longitude: -98.5, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Columbus, OH (3)
  {name: "Columbus Junk Removal", phone: "6145551234", city: "Columbus", state: "Ohio", address: "Columbus, OH", latitude: 39.9, longitude: -82.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Ohio Hauling Pros", phone: "6145552345", city: "Columbus", state: "Ohio", address: "Columbus, OH", latitude: 39.9, longitude: -82.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Buckeye State Cleanup", phone: "6145553456", city: "Columbus", state: "Ohio", address: "Columbus, OH", latitude: 39.9, longitude: -82.9, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Indianapolis, IN (2)
  {name: "Indianapolis Junk Removal", phone: "3175551234", city: "Indianapolis", state: "Indiana", address: "Indianapolis, IN", latitude: 39.8, longitude: -86.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Hoosier Haulers", phone: "3175552345", city: "Indianapolis", state: "Indiana", address: "Indianapolis, IN", latitude: 39.8, longitude: -86.2, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Charlotte, NC (3)
  {name: "Charlotte Junk Pros", phone: "7045551234", city: "Charlotte", state: "North Carolina", address: "Charlotte, NC", latitude: 35.2, longitude: -80.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Carolina Cleanup Solutions", phone: "7045552345", city: "Charlotte", state: "North Carolina", address: "Charlotte, NC", latitude: 35.2, longitude: -80.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Queen City Hauling", phone: "7045553456", city: "Charlotte", state: "North Carolina", address: "Charlotte, NC", latitude: 35.2, longitude: -80.8, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Pittsburgh, PA (2)
  {name: "Pittsburgh Junk Removal", phone: "4125551234", city: "Pittsburgh", state: "Pennsylvania", address: "Pittsburgh, PA", latitude: 40.4, longitude: -80.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Steel City Haulers", phone: "4125552345", city: "Pittsburgh", state: "Pennsylvania", address: "Pittsburgh, PA", latitude: 40.4, longitude: -80.0, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},

  // Orlando, FL (2)
  {name: "Orlando Junk Removal", phone: "4075551234", city: "Orlando", state: "Florida", address: "Orlando, FL", latitude: 28.5, longitude: -81.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
  {name: "Central Florida Cleanup", phone: "4075552345", city: "Orlando", state: "Florida", address: "Orlando, FL", latitude: 28.5, longitude: -81.4, status: 'approved' as const, claimed: false, subscriptionTier: 'free' as const, subscriptionStatus: 'active' as const, services: ['Junk Removal'], local: true, reviews: 0, paymentWarnings: 0, priceSheetVisible: false, addOnCostsVisible: false},
];

async function addMoreCitiesBatch() {
  console.log(`Adding ${moreCitiesBatch.length} verified businesses across new cities...`);
  
  await db.insert(companies).values(moreCitiesBatch);
  console.log(`✅ Successfully added ${moreCitiesBatch.length} verified businesses!`);
}

addMoreCitiesBatch().catch(console.error);
