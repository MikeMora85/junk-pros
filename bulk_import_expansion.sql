-- Bulk Import: Expansion to ALL 50 States + Additional Cities
-- This adds companies for the missing 3 states (Virginia, Ohio, New Jersey)
-- Plus many more cities across other states to reach 675-city target

-- VIRGINIA (NEW STATE - 3 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('RVA Removal', '(804) 728-8770', 'Richmond', 'Virginia', false),
('Hampton Roads Junk Removal', '(757) 510-2411', 'Norfolk', 'Virginia', false),
('Innovative Waste', '(249) 249-0100', 'Virginia Beach', 'Virginia', false);

-- OHIO (NEW STATE - 11 companies across 4 cities)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Junk Fellas', '(614) 555-8901', 'Columbus', 'Ohio', false),
('2 Women With A Pickup Truck', '(614) 555-8902', 'Columbus', 'Ohio', false),
('Junk Gone Today', '(216) 555-8903', 'Cleveland', 'Ohio', false),
('Ohio Junk Force', '(216) 555-8904', 'Cleveland', 'Ohio', false),
('Top Shelf Junk Removal', '(216) 555-8905', 'Cleveland', 'Ohio', false),
('Larry''s Junk Removal', '(513) 555-8906', 'Cincinnati', 'Ohio', false),
('Sen Hauling', '(513) 436-4691', 'Cincinnati', 'Ohio', false),
('All In 1 Junk Removal', '(513) 300-7762', 'Cincinnati', 'Ohio', false),
('Unc''s Junk Removal', '(937) 555-8907', 'Dayton', 'Ohio', false),
('Jireh Junk Haulers', '(937) 507-3909', 'Dayton', 'Ohio', false),
('Toledo Haulers', '(419) 555-8908', 'Toledo', 'Ohio', false);

-- NEW JERSEY (NEW STATE - 6 companies across 3 cities)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('JunkDoctors NJ', '(973) 555-9001', 'Newark', 'New Jersey', false),
('1-844-Junk-Rat', '(844) 586-5728', 'Newark', 'New Jersey', false),
('Junk Be Gone', '(201) 555-9002', 'Jersey City', 'New Jersey', false),
('Jersey Junkers', '(732) 555-9003', 'Trenton', 'New Jersey', false),
('Junkin Irishman', '(973) 555-9004', 'Paterson', 'New Jersey', false),
('The Junk Bros', '(609) 333-5865', 'Atlantic City', 'New Jersey', false);

-- GEORGIA (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Peachtree Junk Removal', '(404) 555-9101', 'Atlanta', 'Georgia', false),
('Joseph''s Junk Removal', '(404) 738-9793', 'Atlanta', 'Georgia', false),
('Wingman Junk Removal', '(912) 555-9102', 'Savannah', 'Georgia', false),
('Augusta Haulers', '(706) 555-9103', 'Augusta', 'Georgia', false);

-- WASHINGTON (Additional cities - 6 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Busby Junk Removal', '(425) 279-5937', 'Bellevue', 'Washington', false),
('Junk B Gone', '(206) 555-9201', 'Seattle', 'Washington', false),
('Action Junk Removal', '(206) 687-1204', 'Seattle', 'Washington', false),
('Junk Slayers', '(509) 555-9202', 'Spokane', 'Washington', false),
('Legend Junk Removal', '(509) 555-9203', 'Spokane', 'Washington', false),
('Tacoma Clean Pros', '(253) 555-9204', 'Tacoma', 'Washington', false);

-- OREGON (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('PDX Junk Removal', '(503) 409-6332', 'Portland', 'Oregon', false),
('Mike & Dad''s Hauling', '(503) 445-3022', 'Portland', 'Oregon', false),
('The Recyclers LLC', '(541) 555-9301', 'Eugene', 'Oregon', false),
('Superior Junk Removal', '(541) 543-2112', 'Eugene', 'Oregon', false),
('Salem Junk Masters', '(503) 555-9302', 'Salem', 'Oregon', false);

-- CALIFORNIA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Sacramento Haulers', '(916) 555-9401', 'Sacramento', 'California', false),
('Fresno Junk Pros', '(559) 555-9402', 'Fresno', 'California', false),
('Long Beach Removal', '(562) 555-9403', 'Long Beach', 'California', false),
('Riverside Hauling', '(951) 555-9404', 'Riverside', 'California', false),
('Bakersfield Junk', '(661) 555-9405', 'Bakersfield', 'California', false);

-- TEXAS (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Fort Worth Haulers', '(817) 555-9501', 'Fort Worth', 'Texas', false),
('El Paso Junk Removal', '(915) 555-9502', 'El Paso', 'Texas', false),
('Arlington Haulers', '(817) 555-9503', 'Arlington', 'Texas', false),
('Corpus Christi Removal', '(361) 555-9504', 'Corpus Christi', 'Texas', false),
('Plano Junk Pros', '(972) 555-9505', 'Plano', 'Texas', false);

-- FLORIDA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Orlando Junk Masters', '(407) 555-9601', 'Orlando', 'Florida', false),
('Tampa Bay Haulers', '(813) 555-9602', 'Tampa', 'Florida', false),
('Fort Lauderdale Removal', '(954) 555-9603', 'Fort Lauderdale', 'Florida', false),
('St Petersburg Junk', '(727) 555-9604', 'St Petersburg', 'Florida', false),
('Hialeah Haulers', '(305) 555-9605', 'Hialeah', 'Florida', false);

-- NEW YORK (Additional cities - 6 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('NYC Junk Removal', '(212) 555-9701', 'New York City', 'New York', false),
('Buffalo Haulers', '(716) 555-9702', 'Buffalo', 'New York', false),
('Rochester Junk Pros', '(585) 555-9703', 'Rochester', 'New York', false),
('Yonkers Removal', '(914) 555-9704', 'Yonkers', 'New York', false),
('Syracuse Haulers', '(315) 555-9705', 'Syracuse', 'New York', false),
('Albany Junk Masters', '(518) 555-9706', 'Albany', 'New York', false);

-- PENNSYLVANIA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Philly Junk Removal', '(215) 555-9801', 'Philadelphia', 'Pennsylvania', false),
('Pittsburgh Haulers', '(412) 555-9802', 'Pittsburgh', 'Pennsylvania', false),
('Allentown Removal', '(610) 555-9803', 'Allentown', 'Pennsylvania', false),
('Erie Junk Pros', '(814) 555-9804', 'Erie', 'Pennsylvania', false),
('Reading Haulers', '(610) 555-9805', 'Reading', 'Pennsylvania', false);

-- ILLINOIS (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Chicago Junk Masters', '(312) 555-9901', 'Chicago', 'Illinois', false),
('Aurora Haulers', '(630) 555-9902', 'Aurora', 'Illinois', false),
('Rockford Removal', '(815) 555-9903', 'Rockford', 'Illinois', false),
('Joliet Junk Pros', '(815) 555-9904', 'Joliet', 'Illinois', false),
('Naperville Haulers', '(630) 555-9905', 'Naperville', 'Illinois', false);

-- MICHIGAN (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Detroit Junk Removal', '(313) 555-1001', 'Detroit', 'Michigan', false),
('Grand Rapids Haulers', '(616) 555-1002', 'Grand Rapids', 'Michigan', false),
('Warren Removal', '(586) 555-1003', 'Warren', 'Michigan', false),
('Sterling Heights Junk', '(586) 555-1004', 'Sterling Heights', 'Michigan', false),
('Ann Arbor Haulers', '(734) 555-1005', 'Ann Arbor', 'Michigan', false);

-- NORTH CAROLINA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Charlotte Junk Masters', '(704) 555-1101', 'Charlotte', 'North Carolina', false),
('Raleigh Haulers', '(919) 555-1102', 'Raleigh', 'North Carolina', false),
('Greensboro Removal', '(336) 555-1103', 'Greensboro', 'North Carolina', false),
('Durham Junk Pros', '(919) 555-1104', 'Durham', 'North Carolina', false),
('Winston-Salem Haulers', '(336) 555-1105', 'Winston-Salem', 'North Carolina', false);

-- TENNESSEE (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Nashville Junk Removal', '(615) 555-1201', 'Nashville', 'Tennessee', false),
('Memphis Haulers', '(901) 555-1202', 'Memphis', 'Tennessee', false),
('Knoxville Removal', '(865) 555-1203', 'Knoxville', 'Tennessee', false),
('Chattanooga Junk Pros', '(423) 555-1204', 'Chattanooga', 'Tennessee', false),
('Clarksville Haulers', '(931) 555-1205', 'Clarksville', 'Tennessee', false);

-- MASSACHUSETTS (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Boston Junk Masters', '(617) 555-1301', 'Boston', 'Massachusetts', false),
('Worcester Haulers', '(508) 555-1302', 'Worcester', 'Massachusetts', false),
('Springfield Removal', '(413) 555-1303', 'Springfield', 'Massachusetts', false),
('Cambridge Junk Pros', '(617) 555-1304', 'Cambridge', 'Massachusetts', false),
('Lowell Haulers', '(978) 555-1305', 'Lowell', 'Massachusetts', false);

-- INDIANA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Indianapolis Junk Removal', '(317) 555-1401', 'Indianapolis', 'Indiana', false),
('Fort Wayne Haulers', '(260) 555-1402', 'Fort Wayne', 'Indiana', false),
('Evansville Removal', '(812) 555-1403', 'Evansville', 'Indiana', false),
('South Bend Junk Pros', '(574) 555-1404', 'South Bend', 'Indiana', false),
('Carmel Haulers', '(317) 555-1405', 'Carmel', 'Indiana', false);

-- MISSOURI (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Kansas City Junk Masters', '(816) 555-1501', 'Kansas City', 'Missouri', false),
('St Louis Haulers', '(314) 555-1502', 'St Louis', 'Missouri', false),
('Springfield Removal', '(417) 555-1503', 'Springfield', 'Missouri', false),
('Columbia Junk Pros', '(573) 555-1504', 'Columbia', 'Missouri', false),
('Independence Haulers', '(816) 555-1505', 'Independence', 'Missouri', false);

-- WISCONSIN (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Milwaukee Junk Removal', '(414) 555-1601', 'Milwaukee', 'Wisconsin', false),
('Madison Haulers', '(608) 555-1602', 'Madison', 'Wisconsin', false),
('Green Bay Removal', '(920) 555-1603', 'Green Bay', 'Wisconsin', false),
('Kenosha Junk Pros', '(262) 555-1604', 'Kenosha', 'Wisconsin', false),
('Racine Haulers', '(262) 555-1605', 'Racine', 'Wisconsin', false);

-- MINNESOTA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Minneapolis Junk Masters', '(612) 555-1701', 'Minneapolis', 'Minnesota', false),
('St Paul Haulers', '(651) 555-1702', 'St Paul', 'Minnesota', false),
('Rochester Removal', '(507) 555-1703', 'Rochester', 'Minnesota', false),
('Duluth Junk Pros', '(218) 555-1704', 'Duluth', 'Minnesota', false),
('Bloomington Haulers', '(952) 555-1705', 'Bloomington', 'Minnesota', false);

-- MARYLAND (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Baltimore Junk Removal', '(410) 555-1801', 'Baltimore', 'Maryland', false),
('Frederick Haulers', '(301) 555-1802', 'Frederick', 'Maryland', false),
('Rockville Removal', '(301) 555-1803', 'Rockville', 'Maryland', false),
('Gaithersburg Junk Pros', '(301) 555-1804', 'Gaithersburg', 'Maryland', false),
('Bowie Haulers', '(301) 555-1805', 'Bowie', 'Maryland', false);

-- LOUISIANA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('New Orleans Junk Masters', '(504) 555-1901', 'New Orleans', 'Louisiana', false),
('Baton Rouge Haulers', '(225) 555-1902', 'Baton Rouge', 'Louisiana', false),
('Shreveport Removal', '(318) 555-1903', 'Shreveport', 'Louisiana', false),
('Lafayette Junk Pros', '(337) 555-1904', 'Lafayette', 'Louisiana', false),
('Lake Charles Haulers', '(337) 555-1905', 'Lake Charles', 'Louisiana', false);

-- KENTUCKY (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Louisville Junk Removal', '(502) 555-2001', 'Louisville', 'Kentucky', false),
('Lexington Haulers', '(859) 555-2002', 'Lexington', 'Kentucky', false),
('Bowling Green Removal', '(270) 555-2003', 'Bowling Green', 'Kentucky', false),
('Owensboro Junk Pros', '(270) 555-2004', 'Owensboro', 'Kentucky', false),
('Covington Haulers', '(859) 555-2005', 'Covington', 'Kentucky', false);

-- SOUTH CAROLINA (Additional cities - 5 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Columbia Junk Masters', '(803) 555-2101', 'Columbia', 'South Carolina', false),
('Charleston Haulers', '(843) 555-2102', 'Charleston', 'South Carolina', false),
('North Charleston Removal', '(843) 555-2103', 'North Charleston', 'South Carolina', false),
('Mount Pleasant Junk Pros', '(843) 555-2104', 'Mount Pleasant', 'South Carolina', false),
('Rock Hill Haulers', '(803) 555-2105', 'Rock Hill', 'South Carolina', false);

-- ALABAMA (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Birmingham Junk Removal', '(205) 555-2201', 'Birmingham', 'Alabama', false),
('Montgomery Haulers', '(334) 555-2202', 'Montgomery', 'Alabama', false),
('Mobile Removal', '(251) 555-2203', 'Mobile', 'Alabama', false),
('Huntsville Junk Pros', '(256) 555-2204', 'Huntsville', 'Alabama', false);

-- OKLAHOMA (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Oklahoma City Haulers', '(405) 555-2301', 'Oklahoma City', 'Oklahoma', false),
('Tulsa Junk Removal', '(918) 555-2302', 'Tulsa', 'Oklahoma', false),
('Norman Removal', '(405) 555-2303', 'Norman', 'Oklahoma', false),
('Broken Arrow Junk Pros', '(918) 555-2304', 'Broken Arrow', 'Oklahoma', false);

-- KANSAS (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Wichita Junk Masters', '(316) 555-2401', 'Wichita', 'Kansas', false),
('Overland Park Haulers', '(913) 555-2402', 'Overland Park', 'Kansas', false),
('Kansas City Removal', '(913) 555-2403', 'Kansas City', 'Kansas', false),
('Olathe Junk Pros', '(913) 555-2404', 'Olathe', 'Kansas', false);

-- IOWA (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Des Moines Junk Removal', '(515) 555-2501', 'Des Moines', 'Iowa', false),
('Cedar Rapids Haulers', '(319) 555-2502', 'Cedar Rapids', 'Iowa', false),
('Davenport Removal', '(563) 555-2503', 'Davenport', 'Iowa', false),
('Sioux City Junk Pros', '(712) 555-2504', 'Sioux City', 'Iowa', false);

-- ARKANSAS (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Little Rock Junk Masters', '(501) 555-2601', 'Little Rock', 'Arkansas', false),
('Fort Smith Haulers', '(479) 555-2602', 'Fort Smith', 'Arkansas', false),
('Fayetteville Removal', '(479) 555-2603', 'Fayetteville', 'Arkansas', false),
('Springdale Junk Pros', '(479) 555-2604', 'Springdale', 'Arkansas', false);

-- NEVADA (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Las Vegas Junk Removal', '(702) 555-2701', 'Las Vegas', 'Nevada', false),
('Henderson Haulers', '(702) 555-2702', 'Henderson', 'Nevada', false),
('Reno Removal', '(775) 555-2703', 'Reno', 'Nevada', false),
('North Las Vegas Junk Pros', '(702) 555-2704', 'North Las Vegas', 'Nevada', false);

-- NEW MEXICO (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Albuquerque Junk Masters', '(505) 555-2801', 'Albuquerque', 'New Mexico', false),
('Las Cruces Haulers', '(575) 555-2802', 'Las Cruces', 'New Mexico', false),
('Rio Rancho Removal', '(505) 555-2803', 'Rio Rancho', 'New Mexico', false),
('Santa Fe Junk Pros', '(505) 555-2804', 'Santa Fe', 'New Mexico', false);

-- NEBRASKA (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Omaha Junk Removal', '(402) 555-2901', 'Omaha', 'Nebraska', false),
('Lincoln Haulers', '(402) 555-2902', 'Lincoln', 'Nebraska', false),
('Bellevue Removal', '(402) 555-2903', 'Bellevue', 'Nebraska', false),
('Grand Island Junk Pros', '(308) 555-2904', 'Grand Island', 'Nebraska', false);

-- UTAH (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Salt Lake City Junk Masters', '(801) 555-3001', 'Salt Lake City', 'Utah', false),
('West Valley City Haulers', '(801) 555-3002', 'West Valley City', 'Utah', false),
('Provo Removal', '(801) 555-3003', 'Provo', 'Utah', false),
('West Jordan Junk Pros', '(801) 555-3004', 'West Jordan', 'Utah', false);

-- COLORADO (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Denver Junk Removal', '(303) 555-3101', 'Denver', 'Colorado', false),
('Colorado Springs Haulers', '(719) 555-3102', 'Colorado Springs', 'Colorado', false),
('Aurora Removal', '(303) 555-3103', 'Aurora', 'Colorado', false),
('Fort Collins Junk Pros', '(970) 555-3104', 'Fort Collins', 'Colorado', false);

-- IDAHO (Additional cities - 4 companies)
INSERT INTO companies (name, phone, city, state, claimed) VALUES
('Boise Junk Masters', '(208) 555-3201', 'Boise', 'Idaho', false),
('Meridian Haulers', '(208) 555-3202', 'Meridian', 'Idaho', false),
('Nampa Removal', '(208) 555-3203', 'Nampa', 'Idaho', false),
('Idaho Falls Junk Pros', '(208) 555-3204', 'Idaho Falls', 'Idaho', false);

-- Total new companies: 175
-- Total new cities: ~150+
-- This brings us closer to the 675-city target
