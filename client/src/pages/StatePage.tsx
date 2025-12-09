import { useState } from "react";
import { Link } from "wouter";
import { Menu, Search, Truck, Recycle, Dumbbell, DollarSign, UserCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSEO, buildStatePageSEO } from "../lib/seo";
import { HamburgerMenu } from "../components/SharedComponents";

import arizonaHero from "@assets/stock_images/grand_canyon_arizona_c5218ef2.jpg";
import californiaHero from "@assets/stock_images/golden_gate_bridge_s_7e39867c.jpg";
import texasHero from "@assets/stock_images/texas_state_capitol__62bb1fcf.jpg";
import floridaHero from "@assets/stock_images/miami_beach_south_be_3f10b0ca.jpg";
import newYorkHero from "@assets/stock_images/statue_of_liberty_ne_70f49b5f.jpg";
import washingtonHero from "@assets/stock_images/space_needle_seattle_e0d9ac78.jpg";
import coloradoHero from "@assets/stock_images/rocky_mountains_colo_f5782bd2.jpg";
import illinoisHero from "@assets/stock_images/willis_tower_chicago_08709be4.jpg";
import massachusettsHero from "@assets/stock_images/boston_massachusetts_495b1661.jpg";
import pennsylvaniaHero from "@assets/stock_images/liberty_bell_philade_94af1290.jpg";
import nevadaHero from "@assets/stock_images/las_vegas_strip_neva_9810840d.jpg";
import tennesseeHero from "@assets/stock_images/great_smoky_mountain_04319b2a.jpg";
import georgiaHero from "@assets/stock_images/atlanta_georgia_skyl_42af1e19.jpg";
import louisianaHero from "@assets/stock_images/french_quarter_new_o_97be723e.jpg";
import oregonHero from "@assets/stock_images/crater_lake_oregon_s_dbd956cd.jpg";
import wyomingHero from "@assets/stock_images/old_faithful_geyser__6269315a.jpg";
import montanaHero from "@assets/stock_images/glacier_national_par_ca533513.jpg";
import utahHero from "@assets/stock_images/arches_national_park_c92ce949.jpg";
import indianaHero from "@assets/stock_images/indianapolis_motor_s_076178bf.jpg";
import michiganHero from "@assets/stock_images/mackinac_bridge_mich_70f90f84.jpg";
import kentuckyHero from "@assets/stock_images/churchill_downs_kent_993eabc9.jpg";
import northCarolinaHero from "@assets/stock_images/blue_ridge_parkway_n_536d613b.jpg";
import southCarolinaHero from "@assets/stock_images/fort_sumter_charlest_156df300.jpg";
import alabamaHero from "@assets/stock_images/uss_alabama_battlesh_57cdea2a.jpg";
import arkansasHero from "@assets/stock_images/hot_springs_national_148b5220.jpg";
import mississippiHero from "@assets/stock_images/mississippi_river_de_f2f97e59.jpg";
import oklahomaHero from "@assets/stock_images/oklahoma_city_nation_f762f0dd.jpg";
import missouriHero from "@assets/stock_images/gateway_arch_st_loui_fd4c11b6.jpg";
import southDakotaHero from "@assets/stock_images/mount_rushmore_south_6dd9fb61.jpg";
import minnesotaHero from "@assets/stock_images/mall_of_america_minn_c6b98b05.jpg";
import iowaHero from "@assets/stock_images/iowa_state_capitol_d_03687da2.jpg";
import wisconsinHero from "@assets/stock_images/wisconsin_state_capi_f9c6451e.jpg";
import idahoHero from "@assets/stock_images/boise_idaho_state_ca_f5997fd7.jpg";
import alaskaHero from "@assets/stock_images/denali_national_park_280a8832.jpg";
import hawaiiHero from "@assets/stock_images/diamond_head_waikiki_2fdf0db0.jpg";
import newMexicoHero from "@assets/stock_images/carlsbad_caverns_new_5adf76a1.jpg";
import northDakotaHero from "@assets/stock_images/fargo_north_dakota_d_760e03a9.jpg";
import nebraskaHero from "@assets/stock_images/omaha_nebraska_old_m_16e3ae04.jpg";
import rhodeIslandHero from "@assets/stock_images/providence_rhode_isl_fd73a38e.jpg";
import connecticutHero from "@assets/stock_images/mystic_seaport_conne_0a29993f.jpg";
import delawareHero from "@assets/stock_images/dover_delaware_state_8f01671f.jpg";
import marylandHero from "@assets/stock_images/annapolis_maryland_s_2fc6a27b.jpg";
import westVirginiaHero from "@assets/stock_images/charleston_west_virg_ddca95e8.jpg";
import vermontHero from "@assets/stock_images/burlington_vermont_l_4c114d59.jpg";
import newHampshireHero from "@assets/stock_images/portsmouth_new_hamps_6e40cb8c.jpg";

function StatePage({ stateName, stateSlug }: { stateName: string; stateSlug: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  useSEO(buildStatePageSEO(stateName, stateSlug));

  const stateData: Record<string, { 
    cities: string[];
    heroImage: string;
    landmark: string;
    population: string;
    fact: string;
    climate: string;
  }> = {
    'arizona': {
      cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise', 'Flagstaff', 'Yuma', 'Avondale', 'Goodyear', 'Lake Havasu City'],
      heroImage: arizonaHero,
      landmark: 'Grand Canyon',
      population: '7.3 million',
      fact: 'Arizona has one of the highest rates of junk removal due to frequent home renovations in the growing Phoenix metro area.',
      climate: 'Hot desert climate with mild winters - ideal for year-round junk removal services',
    },
    'california': {
      cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Irvine', 'Stockton', 'Chula Vista'],
      heroImage: californiaHero,
      landmark: 'Golden Gate Bridge',
      population: '39.5 million',
      fact: 'California leads the nation in eco-friendly junk removal with over 75% of waste diverted from landfills.',
      climate: 'Mediterranean climate with year-round service availability',
    },
    'texas': {
      cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Amarillo', 'Grand Prairie'],
      heroImage: texasHero,
      landmark: 'State Capitol',
      population: '30.3 million',
      fact: 'Texas has the second-largest junk removal market in the US, driven by rapid population growth.',
      climate: 'Varied climate from humid subtropical to semi-arid - services available year-round',
    },
    'florida': {
      cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Port St. Lucie', 'Cape Coral', 'Tallahassee', 'Fort Lauderdale', 'Pembroke Pines', 'Hollywood', 'Gainesville', 'Coral Springs', 'Clearwater'],
      heroImage: floridaHero,
      landmark: 'Miami Beach',
      population: '22.6 million',
      fact: 'Florida\'s hurricane preparedness drives high demand for debris removal and storm cleanup services.',
      climate: 'Tropical and subtropical climate with peak service season after hurricane season',
    },
    'new-york': {
      cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Hempstead', 'Troy', 'Niagara Falls', 'Binghamton'],
      heroImage: newYorkHero,
      landmark: 'Statue of Liberty',
      population: '19.8 million',
      fact: 'NYC alone generates over 12,000 tons of residential waste daily, making junk removal essential.',
      climate: 'Four-season climate with peak demand during spring cleaning and fall preparation',
    },
    'washington': {
      cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Spokane Valley', 'Federal Way', 'Yakima', 'Bellingham', 'Kennewick', 'Auburn', 'Pasco'],
      heroImage: washingtonHero,
      landmark: 'Space Needle',
      population: '7.7 million',
      fact: 'Washington leads in eco-conscious junk removal with strict recycling and composting requirements.',
      climate: 'Temperate oceanic climate - year-round services available',
    },
    'colorado': {
      cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial', 'Boulder', 'Greeley', 'Longmont', 'Loveland', 'Grand Junction'],
      heroImage: coloradoHero,
      landmark: 'Rocky Mountains',
      population: '5.8 million',
      fact: 'Colorado\'s outdoor lifestyle creates high demand for estate and garage cleanout services.',
      climate: 'Semi-arid climate with four distinct seasons',
    },
    'illinois': {
      cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Champaign', 'Waukegan', 'Cicero', 'Bloomington', 'Decatur', 'Evanston', 'Des Plaines'],
      heroImage: illinoisHero,
      landmark: 'Willis Tower',
      population: '12.6 million',
      fact: 'Chicago is the third-largest junk removal market in the US after NYC and LA.',
      climate: 'Humid continental climate with peak demand in spring and fall',
    },
    'massachusetts': {
      cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'New Bedford', 'Quincy', 'Lynn', 'Fall River', 'Newton', 'Lawrence', 'Somerville', 'Framingham', 'Haverhill'],
      heroImage: massachusettsHero,
      landmark: 'Freedom Trail',
      population: '7 million',
      fact: 'Massachusetts has some of the strictest waste disposal regulations in the nation.',
      climate: 'Humid continental with distinct four seasons',
    },
    'pennsylvania': {
      cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Reading', 'Erie', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona', 'York', 'State College', 'Wilkes-Barre', 'Chester', 'Williamsport'],
      heroImage: pennsylvaniaHero,
      landmark: 'Liberty Bell',
      population: '12.9 million',
      fact: 'Pennsylvania\'s renovation boom has increased junk removal demand by 40% in recent years.',
      climate: 'Humid continental with moderate seasonal changes',
    },
    'nevada': {
      cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko', 'Mesquite', 'Boulder City', 'Fallon', 'Winnemucca', 'West Wendover', 'Ely', 'Yerington'],
      heroImage: nevadaHero,
      landmark: 'Las Vegas Strip',
      population: '3.1 million',
      fact: 'Las Vegas generates massive commercial junk removal needs from hotels and casinos.',
      climate: 'Desert climate - services available year-round',
    },
    'tennessee': {
      cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson', 'Johnson City', 'Bartlett', 'Hendersonville', 'Kingsport', 'Collierville', 'Cleveland', 'Smyrna'],
      heroImage: tennesseeHero,
      landmark: 'Great Smoky Mountains',
      population: '7 million',
      fact: 'Tennessee\'s growing population drives consistent demand for residential junk removal.',
      climate: 'Humid subtropical with mild winters',
    },
    'georgia': {
      cities: ['Atlanta', 'Columbus', 'Augusta', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Albany', 'Johns Creek', 'Warner Robins', 'Alpharetta', 'Marietta', 'Valdosta', 'Smyrna'],
      heroImage: georgiaHero,
      landmark: 'Atlanta Skyline',
      population: '10.9 million',
      fact: 'Atlanta\'s booming construction industry creates high demand for debris removal services.',
      climate: 'Humid subtropical - services peak in spring and summer',
    },
    'louisiana': {
      cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Kenner', 'Bossier City', 'Monroe', 'Alexandria', 'Houma', 'New Iberia', 'Slidell', 'Prairieville', 'Central', 'Ruston'],
      heroImage: louisianaHero,
      landmark: 'French Quarter',
      population: '4.6 million',
      fact: 'Storm cleanup and hurricane debris removal are essential services in Louisiana.',
      climate: 'Humid subtropical with hurricane season considerations',
    },
    'oregon': {
      cities: ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis', 'Albany', 'Tigard', 'Lake Oswego', 'Keizer', 'Grants Pass'],
      heroImage: oregonHero,
      landmark: 'Crater Lake',
      population: '4.2 million',
      fact: 'Oregon requires eco-friendly disposal practices with emphasis on recycling and donation.',
      climate: 'Marine west coast climate - services available year-round',
    },
    'wyoming': {
      cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Sheridan', 'Green River', 'Evanston', 'Riverton', 'Jackson', 'Cody', 'Rawlins', 'Lander', 'Torrington', 'Powell'],
      heroImage: wyomingHero,
      landmark: 'Yellowstone',
      population: '580,000',
      fact: 'Wyoming\'s rural landscape requires specialized long-distance junk removal services.',
      climate: 'Semi-arid and continental - services year-round',
    },
    'montana': {
      cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Havre', 'Anaconda', 'Miles City', 'Belgrade', 'Livingston', 'Laurel', 'Whitefish', 'Lewistown'],
      heroImage: montanaHero,
      landmark: 'Glacier National Park',
      population: '1.1 million',
      fact: 'Montana\'s outdoor recreation economy creates unique junk removal needs for lodges and resorts.',
      climate: 'Continental climate with cold winters',
    },
    'utah': {
      cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George', 'Layton', 'Taylorsville', 'South Jordan', 'Lehi', 'Logan', 'Murray', 'Draper'],
      heroImage: utahHero,
      landmark: 'Arches National Park',
      population: '3.3 million',
      fact: 'Utah\'s rapid growth makes it one of the fastest-growing junk removal markets.',
      climate: 'Semi-arid climate - services available year-round',
    },
    'indiana': {
      cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers', 'Bloomington', 'Hammond', 'Gary', 'Muncie', 'Lafayette', 'Terre Haute', 'Kokomo', 'Anderson', 'Noblesville'],
      heroImage: indianaHero,
      landmark: 'Indianapolis Motor Speedway',
      population: '6.8 million',
      fact: 'Indiana\'s manufacturing sector creates high demand for commercial cleanout services.',
      climate: 'Humid continental with four distinct seasons',
    },
    'michigan': {
      cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Troy', 'Westland', 'Farmington Hills', 'Kalamazoo', 'Wyoming', 'Southfield'],
      heroImage: michiganHero,
      landmark: 'Mackinac Bridge',
      population: '10 million',
      fact: 'Michigan\'s renovation boom drives strong demand for construction debris removal.',
      climate: 'Humid continental - services peak in spring through fall',
    },
    'kentucky': {
      cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Richmond', 'Georgetown', 'Florence', 'Elizabethtown', 'Nicholasville', 'Henderson', 'Jeffersontown', 'Frankfort', 'Paducah', 'Hopkinsville'],
      heroImage: kentuckyHero,
      landmark: 'Churchill Downs',
      population: '4.5 million',
      fact: 'Kentucky\'s horse country estates require specialized large-property cleanout services.',
      climate: 'Humid subtropical with mild winters',
    },
    'north-carolina': {
      cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Concord', 'Asheville', 'Gastonia', 'Greenville', 'Jacksonville', 'Chapel Hill'],
      heroImage: northCarolinaHero,
      landmark: 'Blue Ridge Parkway',
      population: '10.6 million',
      fact: 'The Research Triangle drives high demand for office and commercial cleanouts.',
      climate: 'Humid subtropical with mountain and coastal variations',
    },
    'south-carolina': {
      cities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Summerville', 'Goose Creek', 'Hilton Head Island', 'Florence', 'Spartanburg', 'Myrtle Beach', 'Sumter', 'Anderson', 'Greer'],
      heroImage: southCarolinaHero,
      landmark: 'Fort Sumter',
      population: '5.2 million',
      fact: 'Coastal hurricane preparedness makes storm debris removal essential in South Carolina.',
      climate: 'Humid subtropical - services peak after storm season',
    },
    'alabama': {
      cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Hoover', 'Dothan', 'Auburn', 'Decatur', 'Madison', 'Florence', 'Gadsden', 'Vestavia Hills', 'Prattville', 'Phenix City'],
      heroImage: alabamaHero,
      landmark: 'USS Alabama',
      population: '5 million',
      fact: 'Alabama\'s growing economy increases demand for residential and commercial junk removal.',
      climate: 'Humid subtropical - services available year-round',
    },
    'arkansas': {
      cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'North Little Rock', 'Conway', 'Rogers', 'Pine Bluff', 'Bentonville', 'Hot Springs', 'Benton', 'Texarkana', 'Sherwood', 'Jacksonville'],
      heroImage: arkansasHero,
      landmark: 'Hot Springs National Park',
      population: '3 million',
      fact: 'Arkansas\'s expanding retail sector drives commercial cleanout demand.',
      climate: 'Humid subtropical with hot summers',
    },
    'mississippi': {
      cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi', 'Meridian', 'Tupelo', 'Olive Branch', 'Greenville', 'Horn Lake', 'Clinton', 'Pearl', 'Madison', 'Ridgeland', 'Starkville'],
      heroImage: mississippiHero,
      landmark: 'Mississippi River Delta',
      population: '2.9 million',
      fact: 'Coastal properties require specialized hurricane debris removal services.',
      climate: 'Humid subtropical - services peak post-hurricane season',
    },
    'oklahoma': {
      cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Moore', 'Midwest City', 'Enid', 'Stillwater', 'Muskogee', 'Bartlesville', 'Owasso', 'Shawnee', 'Ponca City'],
      heroImage: oklahomaHero,
      landmark: 'Oklahoma City National Memorial',
      population: '4 million',
      fact: 'Oklahoma\'s energy sector creates demand for commercial and industrial cleanouts.',
      climate: 'Humid subtropical to semi-arid',
    },
    'missouri': {
      cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence', 'Lee\'s Summit', 'O\'Fallon', 'St. Joseph', 'St. Charles', 'St. Peters', 'Blue Springs', 'Florissant', 'Joplin', 'Chesterfield', 'Jefferson City'],
      heroImage: missouriHero,
      landmark: 'Gateway Arch',
      population: '6.2 million',
      fact: 'Missouri\'s two major metros drive strong commercial junk removal demand.',
      climate: 'Humid continental - services peak in spring and fall',
    },
    'south-dakota': {
      cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Yankton', 'Pierre', 'Huron', 'Vermillion', 'Spearfish', 'Box Elder', 'Brandon', 'Harrisburg', 'Sturgis'],
      heroImage: southDakotaHero,
      landmark: 'Mount Rushmore',
      population: '900,000',
      fact: 'Tourism-driven economy creates seasonal junk removal needs around national parks.',
      climate: 'Continental - services peak spring through fall',
    },
    'minnesota': {
      cities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park', 'Plymouth', 'Woodbury', 'Maple Grove', 'St. Cloud', 'Eagan', 'Eden Prairie', 'Coon Rapids', 'Burnsville', 'Blaine'],
      heroImage: minnesotaHero,
      landmark: 'Mall of America',
      population: '5.7 million',
      fact: 'Minnesota\'s harsh winters create spring cleanout surges for junk removal services.',
      climate: 'Continental with cold winters - peak demand in spring',
    },
    'iowa': {
      cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City', 'Waterloo', 'Council Bluffs', 'Ames', 'West Des Moines', 'Dubuque', 'Ankeny', 'Urbandale', 'Cedar Falls', 'Marion', 'Bettendorf'],
      heroImage: iowaHero,
      landmark: 'Iowa State Capitol',
      population: '3.2 million',
      fact: 'Iowa\'s agricultural sector creates unique farm and estate cleanout needs.',
      climate: 'Humid continental - services peak in spring and fall',
    },
    'wisconsin': {
      cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire', 'Oshkosh', 'Janesville', 'West Allis', 'La Crosse', 'Sheboygan', 'Wauwatosa', 'Fond du Lac'],
      heroImage: wisconsinHero,
      landmark: 'Wisconsin State Capitol',
      population: '5.9 million',
      fact: 'Wisconsin\'s manufacturing heritage creates demand for industrial cleanout services.',
      climate: 'Humid continental - services peak in spring',
    },
    'idaho': {
      cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello', 'Caldwell', 'Coeur d\'Alene', 'Twin Falls', 'Post Falls', 'Lewiston', 'Rexburg', 'Eagle', 'Kuna', 'Ammon', 'Chubbuck'],
      heroImage: idahoHero,
      landmark: 'Boise State Capitol',
      population: '1.9 million',
      fact: 'Idaho\'s rapid growth makes it one of America\'s fastest-growing junk removal markets.',
      climate: 'Continental - services available year-round',
    },
    'alaska': {
      cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Kenai', 'Kodiak', 'Bethel', 'Palmer', 'Homer', 'Soldotna', 'Barrow', 'Nome', 'Valdez'],
      heroImage: alaskaHero,
      landmark: 'Denali',
      population: '730,000',
      fact: 'Alaska\'s remote locations require specialized logistics for junk removal services.',
      climate: 'Subarctic - services peak in short summer months',
    },
    'hawaii': {
      cities: ['Honolulu', 'East Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu', 'Kaneohe', 'Mililani Town', 'Kahului', 'Ewa Gentry', 'Mililani Mauka', 'Kihei', 'Makakilo', 'Wahiawa', 'Schofield Barracks'],
      heroImage: hawaiiHero,
      landmark: 'Diamond Head',
      population: '1.4 million',
      fact: 'Island logistics make eco-friendly waste disposal especially important in Hawaii.',
      climate: 'Tropical - services available year-round',
    },
    'new-mexico': {
      cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'South Valley', 'Clovis', 'Hobbs', 'Alamogordo', 'Carlsbad', 'Gallup', 'Deming', 'Los Lunas', 'Chaparral'],
      heroImage: newMexicoHero,
      landmark: 'Carlsbad Caverns',
      population: '2.1 million',
      fact: 'New Mexico\'s desert climate requires specialized handling of certain materials.',
      climate: 'Semi-arid and arid - services available year-round',
    },
    'north-dakota': {
      cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Williston', 'Dickinson', 'Mandan', 'Jamestown', 'Wahpeton', 'Devils Lake', 'Valley City', 'Grafton', 'Watford City', 'Lincoln'],
      heroImage: northDakotaHero,
      landmark: 'Fargo Downtown',
      population: '780,000',
      fact: 'North Dakota\'s energy boom creates commercial junk removal opportunities.',
      climate: 'Continental with harsh winters - services peak in warmer months',
    },
    'nebraska': {
      cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'Norfolk', 'Columbus', 'Papillion', 'North Platte', 'La Vista', 'Scottsbluff', 'South Sioux City', 'Beatrice'],
      heroImage: nebraskaHero,
      landmark: 'Old Market Omaha',
      population: '2 million',
      fact: 'Nebraska\'s agricultural economy creates unique rural junk removal needs.',
      climate: 'Humid continental - services peak in spring and fall',
    },
    'rhode-island': {
      cities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence', 'Woonsocket', 'Coventry', 'Cumberland', 'North Providence', 'South Kingstown', 'West Warwick', 'Johnston', 'North Kingstown', 'Newport', 'Bristol'],
      heroImage: rhodeIslandHero,
      landmark: 'WaterFire Providence',
      population: '1.1 million',
      fact: 'Rhode Island\'s dense population creates high demand for residential cleanouts.',
      climate: 'Humid continental - services available year-round',
    },
    'connecticut': {
      cities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury', 'Norwalk', 'Danbury', 'New Britain', 'Bristol', 'Meriden', 'Milford', 'West Haven', 'Middletown', 'Norwich', 'Shelton'],
      heroImage: connecticutHero,
      landmark: 'Mystic Seaport',
      population: '3.6 million',
      fact: 'Connecticut\'s affluent communities drive demand for estate cleanout services.',
      climate: 'Humid continental with four seasons',
    },
    'delaware': {
      cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'Milford', 'Seaford', 'Georgetown', 'Elsmere', 'New Castle', 'Millsboro', 'Bear', 'Pike Creek', 'Brookside', 'Hockessin'],
      heroImage: delawareHero,
      landmark: 'Delaware State Capitol',
      population: '1 million',
      fact: 'Delaware\'s small size enables efficient statewide junk removal services.',
      climate: 'Humid subtropical - services available year-round',
    },
    'maryland': {
      cities: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Annapolis', 'College Park', 'Salisbury', 'Laurel', 'Greenbelt', 'Cumberland', 'Westminster', 'Hyattsville', 'Takoma Park'],
      heroImage: marylandHero,
      landmark: 'Annapolis State House',
      population: '6.2 million',
      fact: 'Maryland\'s proximity to DC creates high demand for government facility cleanouts.',
      climate: 'Humid subtropical - services available year-round',
    },
    'west-virginia': {
      cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling', 'Weirton', 'Fairmont', 'Beckley', 'Martinsburg', 'Clarksburg', 'South Charleston', 'St. Albans', 'Vienna', 'Bluefield', 'Moundsville'],
      heroImage: westVirginiaHero,
      landmark: 'West Virginia State Capitol',
      population: '1.8 million',
      fact: 'West Virginia\'s mountainous terrain requires specialized hauling equipment.',
      climate: 'Humid subtropical to humid continental',
    },
    'vermont': {
      cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier', 'Winooski', 'St. Albans', 'Newport', 'Vergennes', 'Brattleboro', 'Hartford', 'Springfield', 'Bennington', 'Colchester', 'Essex'],
      heroImage: vermontHero,
      landmark: 'Lake Champlain',
      population: '645,000',
      fact: 'Vermont\'s environmental focus requires eco-friendly junk removal practices.',
      climate: 'Humid continental with cold winters',
    },
    'new-hampshire': {
      cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester', 'Salem', 'Dover', 'Merrimack', 'Londonderry', 'Hudson', 'Keene', 'Bedford', 'Portsmouth', 'Goffstown', 'Laconia'],
      heroImage: newHampshireHero,
      landmark: 'Portsmouth Harbor',
      population: '1.4 million',
      fact: 'New Hampshire\'s "Live Free or Die" spirit extends to flexible junk removal options.',
      climate: 'Humid continental - services peak in spring and fall',
    },
  };

  const currentState = stateData[stateSlug] || {
    cities: [],
    heroImage: '',
    landmark: stateName,
    population: 'N/A',
    fact: 'Professional junk removal services available throughout the state.',
    climate: 'Services available year-round',
  };

  const cities = currentState.cities;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${stateSlug}/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
    }}>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '10px 16px',
          display: 'flex',
          gap: '12px',
        }}>
          <button
          onClick={() => setMenuOpen(true)}
          style={{
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          data-testid="button-menu-state"
        >
          <Menu size={18} color="#000" />
        </button>
        
        {isAuthenticated && !!user && (
          <button
            onClick={() => {
              if ((user as any)?.isAdmin) {
                window.location.href = '/admin';
              } else {
                window.location.href = '/profile/edit';
              }
            }}
            style={{
              backgroundColor: 'transparent',
              color: '#000',
              padding: '0',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-testid="button-profile-state"
          >
            <UserCircle size={28} />
          </button>
        )}
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 16px 40px 16px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '16px',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Find Junk Removal Services in {stateName}
          </h2>
          <form onSubmit={handleSearch} style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            gap: '6px',
            backgroundColor: '#f9fafb',
            padding: '5px',
            borderRadius: '10px',
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your city"
              style={{
                flex: 1,
                minWidth: '0',
                padding: '10px 12px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
              data-testid="input-state-search"
            />
            <button
              type="submit"
              style={{
                padding: '10px 14px',
                background: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              data-testid="button-state-search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid #cccccc',
          overflowX: 'auto',
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'cities', label: 'Cities' },
            { id: 'tips', label: 'Tips & Advice' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab.id ? '#e5e7eb' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #fbbf24' : '3px solid transparent',
                color: activeTab === tab.id ? '#1a1a1a' : '#6b7280',
                fontSize: '15px',
                fontWeight: activeTab === tab.id ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                borderRadius: '8px 8px 0 0',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                About Junk Removal Services in {stateName}
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#000',
                lineHeight: '1.8',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                {stateName} residents and businesses rely on professional junk removal services for efficient, eco-friendly disposal. Whether you're doing a home cleanout, office renovation, or construction project, local junk removal companies provide same-day service with upfront pricing.
              </p>
              <p style={{
                fontSize: '16px',
                color: '#000',
                lineHeight: '1.8',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Most {stateName} junk removal companies recycle or donate 60-80% of collected items, helping reduce landfill waste while giving back to local communities.
              </p>
              <div style={{
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '10px',
                marginTop: '16px',
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '8px',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {stateName} Junk Removal Facts
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#000',
                  margin: '0 0 8px 0',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  <strong>Population:</strong> {currentState.population}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#000',
                  margin: '0 0 8px 0',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  <strong>Climate:</strong> {currentState.climate}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#000',
                  margin: '0',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  <strong>Local Insight:</strong> {currentState.fact}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}>
              {[
                {
                  title: 'Same-Day Service',
                  description: 'Most companies offer same-day or next-day pickup throughout ' + stateName,
                  Icon: Truck,
                },
                {
                  title: 'Eco-Friendly',
                  description: 'Items are sorted for recycling, donation, or proper disposal',
                  Icon: Recycle,
                },
                {
                  title: 'Full-Service',
                  description: 'Teams handle all loading and hauling - you don\'t lift a finger',
                  Icon: Dumbbell,
                },
                {
                  title: 'Upfront Pricing',
                  description: 'Get free estimates with transparent, volume-based pricing',
                  Icon: DollarSign,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <item.Icon size={32} style={{ color: '#fbbf24', marginBottom: '12px' }} />
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '8px',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    lineHeight: '1.6',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Common Junk Removal Services in {stateName}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '12px',
              }}>
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/furniture" style={{ textDecoration: 'none' }} data-testid="link-furniture-removal">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Furniture Removal
                    </h4>
                  </Link>
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/appliances" style={{ textDecoration: 'none' }} data-testid="link-appliance-disposal">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Appliance Disposal
                    </h4>
                  </Link>
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/electronics" style={{ textDecoration: 'none' }} data-testid="link-electronics-recycling">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Electronics Recycling
                    </h4>
                  </Link>
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/yard-waste" style={{ textDecoration: 'none' }} data-testid="link-yard-waste">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Yard Waste Removal
                    </h4>
                  </Link>
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/garage-cleanouts" style={{ textDecoration: 'none' }} data-testid="link-garage-cleanouts">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Garage Cleanouts
                    </h4>
                  </Link>
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/estate-cleanouts" style={{ textDecoration: 'none' }} data-testid="link-estate-cleanouts">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Estate Cleanouts
                    </h4>
                  </Link>
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/office-cleanouts" style={{ textDecoration: 'none' }} data-testid="link-office-cleanouts">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Office Cleanouts
                    </h4>
                  </Link>
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/construction-debris" style={{ textDecoration: 'none' }} data-testid="link-construction-debris">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Construction Debris
                    </h4>
                  </Link>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Common Items Junk Haulers Remove
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '12px',
              }}>
                {[
                  { name: 'Sofa', href: '/items/sofa' },
                  { name: 'Bed', href: '/items/bed' },
                  { name: 'Dresser', href: '/items/dresser' },
                  { name: 'Table', href: '/items/table' },
                  { name: 'Desk', href: '/items/desk' },
                  { name: 'Recliner', href: '/items/recliner' },
                  { name: 'Refrigerator', href: '/items/refrigerator' },
                  { name: 'Washer', href: '/items/washer' },
                  { name: 'Dryer', href: '/items/dryer' },
                  { name: 'Stove', href: '/items/stove' },
                  { name: 'Dishwasher', href: '/items/dishwasher' },
                  { name: 'Freezer', href: '/items/freezer' },
                  { name: 'TV', href: '/items/tv' },
                  { name: 'Computer', href: '/items/computer' },
                  { name: 'Laptop', href: '/items/laptop' },
                  { name: 'Monitor', href: '/items/monitor' },
                  { name: 'Printer', href: '/items/printer' },
                  { name: 'Phone', href: '/items/phone' },
                  { name: 'Branches', href: '/items/branches' },
                  { name: 'Leaves', href: '/items/leaves' },
                  { name: 'Grass', href: '/items/grass' },
                  { name: 'Tree Stumps', href: '/items/tree-stumps' },
                  { name: 'Bushes', href: '/items/bushes' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{ textDecoration: 'none' }}
                    data-testid={`link-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#000',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Environmental Impact & Sustainability
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#000',
                lineHeight: '1.8',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Professional junk removal companies in {stateName} are committed to reducing landfill waste through recycling and donation programs. Here's how they make a difference:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#000',
                    marginBottom: '8px',
                  }}>
                    60-80%
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    fontWeight: '600',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    Items Recycled or Donated
                  </p>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#000',
                    marginBottom: '8px',
                  }}>
                    100+
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    fontWeight: '600',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    Local Charities Supported
                  </p>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#000',
                    marginBottom: '8px',
                  }}>
                    90%
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    fontWeight: '600',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    Customer Satisfaction
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'cities' && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '20px',
            }}>
              Popular Cities in {stateName}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {cities.map((city) => (
                <a
                  key={city}
                  href={`/${stateSlug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    padding: '16px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontWeight: '600',
                    fontSize: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  data-testid={`link-city-${city.toLowerCase()}`}
                >
                  {city}
                </a>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'tips' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Expert Tips for Hiring Junk Removal in {stateName}
              </h3>
              <div style={{
                display: 'grid',
                gap: '20px',
              }}>
                {[
                  {
                    title: '1. Sort Before They Arrive',
                    description: 'Separate items you want removed from keepers. This speeds up the process and may reduce costs.',
                  },
                  {
                    title: '2. Get Multiple Quotes',
                    description: 'Contact 2-3 companies for estimates. Most offer free quotes and same-day service in ' + stateName + '.',
                  },
                  {
                    title: '3. Ask About Recycling',
                    description: 'Choose companies that donate usable items and recycle materials rather than sending everything to landfills.',
                  },
                  {
                    title: '4. Check Insurance & Licensing',
                    description: 'Verify the company is licensed and insured to protect yourself from liability.',
                  },
                  {
                    title: '5. Read Reviews',
                    description: 'Check online reviews from other ' + stateName + ' customers to gauge reliability and service quality.',
                  },
                  {
                    title: '6. Understand Pricing',
                    description: 'Most companies charge by volume (truck space), not weight. Get clarity on final costs before work begins.',
                  },
                  {
                    title: '7. Schedule Smart',
                    description: 'Book early morning or weekday appointments for potentially better rates and availability.',
                  },
                  {
                    title: '8. Know What They Won\'t Take',
                    description: 'Most companies can\'t accept hazardous materials like paint, chemicals, or asbestos. Ask beforehand.',
                  },
                ].map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: '4px solid #fbbf24',
                    }}
                  >
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}>
                      {tip.title}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#000',
                      margin: '0',
                      lineHeight: '1.6',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}>
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  {
                    q: 'How much does junk removal cost in ' + stateName + '?',
                    a: 'Prices typically range from $100-$800 depending on the volume of junk. Most companies charge by how much space your items take up in their truck. A single item costs $100-$200, while a full truck load runs $550-$800.',
                  },
                  {
                    q: 'Do I need to be home during junk removal?',
                    a: 'Not necessarily. As long as the items are accessible and you\'ve provided clear instructions, many companies can complete the job without you present. However, it\'s recommended to be available for any questions.',
                  },
                  {
                    q: 'What items cannot be removed?',
                    a: 'Most companies cannot accept hazardous materials including paint, chemicals, asbestos, medical waste, or anything considered toxic. Check with your local provider for their specific restrictions.',
                  },
                  {
                    q: 'How quickly can junk be removed?',
                    a: 'Many ' + stateName + ' junk removal companies offer same-day or next-day service. During busy seasons, you may need to book 2-3 days in advance.',
                  },
                  {
                    q: 'Is junk removal eco-friendly?',
                    a: 'Most professional companies recycle 60-80% of collected items and donate usable goods to local charities. Only non-recyclable waste goes to landfills.',
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      style={{
                        width: '100%',
                        padding: '20px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        textAlign: 'left',
                      }}
                      data-testid={`button-faq-${i}`}
                    >
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#374151',
                        margin: '0',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        {faq.q}
                      </h4>
                      <ChevronDown
                        size={20}
                        color="#fbbf24"
                        style={{
                          flexShrink: 0,
                          transform: expandedFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </button>
                    {expandedFaq === i && (
                      <div style={{
                        padding: '0 20px 20px 20px',
                      }}>
                        <p style={{
                          fontSize: '14px',
                          color: '#000',
                          margin: '0',
                          lineHeight: '1.6',
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default StatePage;
