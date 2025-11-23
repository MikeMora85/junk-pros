// Script to add 1000 unclaimed businesses to underrepresented cities
import { db } from '../server/db';
import { companies } from '../shared/schema';

const businessNames = [
  "Junk King", "Haulers", "Removal Pros", "Junk Runners", "Trash Masters",
  "Clean Sweep", "Debris Busters", "Haul Away", "Junk Monkeys", "Eco Haulers",
  "Quick Haul", "Budget Removal", "Premier Junk", "Elite Hauling", "Fast Track",
  "Green Haulers", "City Cleanup", "Metro Junk", "Express Removal", "All Clear"
];

const prefixes = [
  "A+ ", "AAA ", "Ace ", "All ", "Best ", "Big ", "City ", "Elite ", "Express ",
  "Fast ", "Five Star ", "Good ", "Green ", "Happy ", "Hero ", "Honest ",
  "Local ", "Metro ", "Prime ", "Pro ", "Quick ", "Rapid ", "Reliable ",
  "Same Day ", "Smart ", "Speedy ", "Super ", "Top ", "Total ", "Trust ",
  "United ", "Value ", "Veteran ", "We Haul ", "Your "
];

// States with fewer businesses and their major cities
const statesCities: Record<string, string[]> = {
  "Virginia": ["Richmond", "Virginia Beach", "Norfolk", "Chesapeake", "Arlington", "Newport News", "Alexandria", "Hampton", "Roanoke", "Portsmouth"],
  "Maine": ["Portland", "Lewiston", "Bangor", "Auburn", "South Portland", "Augusta", "Biddeford", "Brunswick", "Sanford", "Scarborough"],
  "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton", "Clifton", "Camden", "Passaic", "Union City", "Bayonne"],
  "Kansas": ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence", "Shawnee", "Lenexa", "Manhattan", "Salina"],
  "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain"],
  "Wyoming": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan", "Green River", "Evanston", "Riverton", "Jackson"],
  "Vermont": ["Burlington", "South Burlington", "Rutland", "Essex", "Montpelier", "Barre", "Colchester", "Bennington", "Brattleboro", "Milton"],
  "Montana": ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena", "Kalispell", "Havre", "Anaconda", "Miles City"],
  "Delaware": ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna", "Milford", "Seaford", "Georgetown", "Elsmere", "New Castle"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling", "Weirton", "Fairmont", "Beckley", "Martinsburg", "Clarksburg"],
  "Connecticut": ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury", "Norwalk", "Danbury", "New Britain", "Bristol", "Meriden"],
  "Hawaii": ["Honolulu", "Hilo", "Kailua", "Kapolei", "Kaneohe", "Waipahu", "Pearl City", "Waimalu", "Mililani", "Ewa Beach"],
  "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan", "Wasilla", "Kenai", "Kodiak", "Bethel", "Palmer"],
  "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence", "Woonsocket", "Coventry", "Cumberland", "North Providence", "South Kingstown"],
  "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Rochester", "Salem", "Dover", "Merrimack", "Londonderry", "Hudson"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown", "Mitchell", "Yankton", "Pierre", "Huron", "Spearfish"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Williston", "Dickinson", "Mandan", "Jamestown", "Wahpeton"],
  "Nevada": ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City", "Fernley", "Elko", "Mesquite", "Boulder City"],
  "Mississippi": ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian", "Tupelo", "Greenville", "Olive Branch", "Horn Lake"],
  "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Kenner", "Bossier City", "Monroe", "Alexandria", "Houma"],
  "Massachusetts": ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford", "Brockton", "Quincy", "Lynn", "Fall River"],
  "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster", "Harrisburg", "Altoona"],
  "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Centennial"],
  "Nebraska": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont", "Hastings", "Norfolk", "Columbus", "Papillion"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington", "Clovis", "Hobbs", "Alamogordo", "Carlsbad"],
  "Idaho": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Caldwell", "Coeur d'Alene", "Twin Falls", "Post Falls", "Lewiston"],
  "Utah": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton", "Taylorsville"],
  "Iowa": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City", "Waterloo", "Council Bluffs", "Ames", "West Des Moines", "Dubuque"],
  "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "North Little Rock", "Conway", "Rogers", "Pine Bluff", "Bentonville"],
  "Oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton", "Moore", "Midwest City", "Enid", "Stillwater"]
};

// Generate phone numbers
function generatePhone(): string {
  const area = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const line = Math.floor(Math.random() * 9000) + 1000;
  return `${area}${prefix}${line}`;
}

// Generate random coordinates within reasonable US bounds
function generateCoords(state: string): { lat: number; lon: number } {
  const stateCoords: Record<string, { lat: [number, number], lon: [number, number] }> = {
    "Virginia": { lat: [36.5, 39.5], lon: [-83.7, -75.2] },
    "Maine": { lat: [43.0, 47.5], lon: [-71.1, -66.9] },
    "New Jersey": { lat: [38.9, 41.4], lon: [-75.6, -73.9] },
    "Kansas": { lat: [37.0, 40.0], lon: [-102.1, -94.6] },
    "Ohio": { lat: [38.4, 42.0], lon: [-84.8, -80.5] },
    "Wyoming": { lat: [41.0, 45.0], lon: [-111.1, -104.1] },
    "Vermont": { lat: [42.7, 45.0], lon: [-73.4, -71.5] },
    "Montana": { lat: [45.0, 49.0], lon: [-116.1, -104.0] },
    "Delaware": { lat: [38.5, 39.8], lon: [-75.8, -75.0] },
    "West Virginia": { lat: [37.2, 40.6], lon: [-82.7, -77.7] },
  };
  
  const coords = stateCoords[state] || { lat: [35, 45], lon: [-120, -80] };
  const lat = coords.lat[0] + Math.random() * (coords.lat[1] - coords.lat[0]);
  const lon = coords.lon[0] + Math.random() * (coords.lon[1] - coords.lon[0]);
  
  return { lat: Math.round(lat * 10) / 10, lon: Math.round(lon * 10) / 10 };
}

async function addBusinesses() {
  console.log('Starting to add 1,000 unclaimed businesses...');
  
  const businessesToAdd = [];
  let count = 0;
  
  // Get all state-city combinations
  const stateCityPairs: Array<{ state: string; city: string }> = [];
  for (const [state, cities] of Object.entries(statesCities)) {
    for (const city of cities) {
      stateCityPairs.push({ state, city });
    }
  }
  
  // Generate 1000 businesses
  while (count < 1000) {
    const pair = stateCityPairs[count % stateCityPairs.length];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const baseName = businessNames[Math.floor(Math.random() * businessNames.length)];
    const name = `${prefix}${baseName}`;
    const phone = generatePhone();
    const coords = generateCoords(pair.state);
    
    businessesToAdd.push({
      name,
      phone,
      city: pair.city,
      state: pair.state,
      address: `${pair.city}, ${pair.state}`,
      latitude: coords.lat,
      longitude: coords.lon,
      status: 'approved',
      claimed: false,
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      services: ['Junk Removal'],
      local: true,
      reviews: 0,
      paymentWarnings: 0,
      priceSheetVisible: false,
      addOnCostsVisible: false,
    });
    
    count++;
  }
  
  console.log(`Generated ${businessesToAdd.length} businesses. Inserting into database...`);
  
  // Insert in batches of 100
  for (let i = 0; i < businessesToAdd.length; i += 100) {
    const batch = businessesToAdd.slice(i, i + 100);
    await db.insert(companies).values(batch);
    console.log(`Inserted batch ${Math.floor(i / 100) + 1}/${Math.ceil(businessesToAdd.length / 100)}`);
  }
  
  console.log('✅ Successfully added 1,000 unclaimed businesses!');
}

addBusinesses().catch(console.error);
