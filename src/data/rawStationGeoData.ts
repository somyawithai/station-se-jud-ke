import { MetroStation, MetroLine, CityMetroNetwork } from '../types';

export interface RawStationGeoData {
  id: string;
  name: string;
  hindiName?: string;
  cityId: string;
  lineIds: string[];
  latitude: number;
  longitude: number;
  isInterchange?: boolean;
  interchangeLines?: string[];
  isTerminal?: boolean;
  zone?: string;
  landmark?: string;
  elevation?: 'underground' | 'elevated' | 'at-grade';
}

// 1. DELHI NCR REAL GEO STATIONS
export const DELHI_GEO_STATIONS: RawStationGeoData[] = [
  // Red Line (Rithala to Shaheed Sthal Ghaziabad - NW to East)
  { id: 'del-red-rithala', name: 'Rithala', hindiName: 'रिठाला', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.7208, longitude: 77.1072, isTerminal: true, zone: 'North West Delhi', landmark: 'Sector 5 Rohini' },
  { id: 'del-red-rohini-w', name: 'Rohini West', hindiName: 'रोहिणी पश्चिम', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.7148, longitude: 77.1147, zone: 'North West Delhi', landmark: 'Swarn Jayanti Park' },
  { id: 'del-red-pitampura', name: 'Pitampura', hindiName: 'पीतमपुरा', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.6983, longitude: 77.1408, zone: 'North Delhi', landmark: 'TV Tower & Dilli Haat' },
  { id: 'del-red-nsp', name: 'Netaji Subhash Place', hindiName: 'नेताजी सुभाष प्लेस', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.6958, longitude: 77.1524, isInterchange: true, interchangeLines: ['Red Line', 'Pink Line'], zone: 'North Delhi', landmark: 'Max Hospital & NSP Hub' },
  { id: 'del-red-kashmere-gate', name: 'Kashmere Gate', hindiName: 'कश्मीरी गेट', cityId: 'delhi', lineIds: ['delhi-red', 'delhi-yellow', 'delhi-violet'], latitude: 28.6675, longitude: 77.2285, isInterchange: true, interchangeLines: ['Red Line', 'Yellow Line', 'Violet Line'], zone: 'Central Delhi', landmark: 'ISBT & Historic St. James Church' },
  { id: 'del-red-shastri-park', name: 'Shastri Park', hindiName: 'शास्त्री पार्क', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.6698, longitude: 77.2505, zone: 'North East Delhi', landmark: 'DMRC IT Park' },
  { id: 'del-red-seelampur', name: 'Seelampur', hindiName: 'सीलमपुर', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.6696, longitude: 77.2667, zone: 'East Delhi', landmark: 'Grand Trunk Road' },
  { id: 'del-red-dilshad-garden', name: 'Dilshad Garden', hindiName: 'दिलशाद गार्डन', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.6759, longitude: 77.3214, isTerminal: true, zone: 'East Delhi Border', landmark: 'GTB Hospital' },
  { id: 'del-red-shaheed-sthal', name: 'Shaheed Sthal (Ghaziabad)', hindiName: 'शहीद स्थल (गाजियाबाद)', cityId: 'delhi', lineIds: ['delhi-red'], latitude: 28.6712, longitude: 77.4172, isTerminal: true, zone: 'Ghaziabad NCR', landmark: 'New Bus Adda' },

  // Yellow Line (Samaypur Badli to Millennium City Centre Gurugram - North to South)
  { id: 'del-yel-samaypur', name: 'Samaypur Badli', hindiName: 'समयपुर बादली', cityId: 'delhi', lineIds: ['delhi-yellow'], latitude: 28.7456, longitude: 77.1384, isTerminal: true, zone: 'North Delhi', landmark: 'Sanjay Gandhi Transport Nagar' },
  { id: 'del-yel-azadpur', name: 'Azadpur', hindiName: 'आजादपुर', cityId: 'delhi', lineIds: ['delhi-yellow'], latitude: 28.7072, longitude: 77.1775, isInterchange: true, interchangeLines: ['Yellow Line', 'Pink Line'], zone: 'North Delhi', landmark: 'Azadpur Mandi' },
  { id: 'del-yel-chandni-chowk', name: 'Chandni Chowk', hindiName: 'चांदनी चौक', cityId: 'delhi', lineIds: ['delhi-yellow'], latitude: 28.6578, longitude: 77.2301, zone: 'Old Delhi', landmark: 'Red Fort & Old Delhi Railway Station' },
  { id: 'del-yel-new-delhi', name: 'New Delhi', hindiName: 'नई दिल्ली', cityId: 'delhi', lineIds: ['delhi-yellow', 'delhi-airport'], latitude: 28.6432, longitude: 77.2223, isInterchange: true, interchangeLines: ['Yellow Line', 'Airport Express'], zone: 'Central Delhi', landmark: 'NDLS Railway Station & Ajmeri Gate' },
  { id: 'del-yel-rajiv-chowk', name: 'Rajiv Chowk (Connaught Place)', hindiName: 'राजीव चौक', cityId: 'delhi', lineIds: ['delhi-yellow', 'delhi-blue'], latitude: 28.6328, longitude: 77.2197, isInterchange: true, interchangeLines: ['Yellow Line', 'Blue Line'], zone: 'Central Delhi CP', landmark: 'Connaught Place Central Park' },
  { id: 'del-yel-central-sec', name: 'Central Secretariat', hindiName: 'केंद्रीय सचिवालय', cityId: 'delhi', lineIds: ['delhi-yellow', 'delhi-violet'], latitude: 28.6148, longitude: 77.2119, isInterchange: true, interchangeLines: ['Yellow Line', 'Violet Line'], zone: 'Lutyens Delhi', landmark: 'Kartavya Path, North & South Blocks' },
  { id: 'del-yel-ina', name: 'Dilli Haat - INA', hindiName: 'दिल्ली हाट - आईएनए', cityId: 'delhi', lineIds: ['delhi-yellow'], latitude: 28.5746, longitude: 77.2096, isInterchange: true, interchangeLines: ['Yellow Line', 'Pink Line'], zone: 'South Delhi', landmark: 'Dilli Haat & AIIMS New Delhi' },
  { id: 'del-yel-hauz-khas', name: 'Hauz Khas', hindiName: 'हौज खास', cityId: 'delhi', lineIds: ['delhi-yellow', 'delhi-magenta'], latitude: 28.5434, longitude: 77.2065, isInterchange: true, interchangeLines: ['Yellow Line', 'Magenta Line'], zone: 'South Delhi', landmark: 'IIT Delhi & Hauz Khas Village' },
  { id: 'del-yel-saket', name: 'Saket', hindiName: 'साकेत', cityId: 'delhi', lineIds: ['delhi-yellow'], latitude: 28.5204, longitude: 77.2017, zone: 'South Delhi', landmark: 'Select Citywalk & Garden of Five Senses' },
  { id: 'del-yel-mg-road', name: 'MG Road (Gurugram)', hindiName: 'एम जी रोड', cityId: 'delhi', lineIds: ['delhi-yellow'], latitude: 28.4797, longitude: 77.0802, zone: 'Gurugram NCR', landmark: 'DT City Centre & MGF Mall' },
  { id: 'del-yel-millennium-city', name: 'Millennium City Centre Gurugram', hindiName: 'मिलेनियम सिटी सेंटर', cityId: 'delhi', lineIds: ['delhi-yellow'], latitude: 28.4593, longitude: 77.0725, isTerminal: true, zone: 'Gurugram NCR', landmark: 'HUDA City Centre & Fortis Hospital' },

  // Blue Line (Dwarka Sec 21 to Noida Electronic City - West to East)
  { id: 'del-blu-dwarka-21', name: 'Dwarka Sector 21', hindiName: 'द्वारका सेक्टर 21', cityId: 'delhi', lineIds: ['delhi-blue', 'delhi-airport'], latitude: 28.5524, longitude: 77.0583, isInterchange: true, isTerminal: true, interchangeLines: ['Blue Line', 'Airport Express'], zone: 'Dwarka Sub-city', landmark: 'Pacific D21 Mall' },
  { id: 'del-blu-janakpuri-w', name: 'Janakpuri West', hindiName: 'जनकपुरी पश्चिम', cityId: 'delhi', lineIds: ['delhi-blue', 'delhi-magenta'], latitude: 28.6294, longitude: 77.0778, isInterchange: true, interchangeLines: ['Blue Line', 'Magenta Line'], zone: 'West Delhi', landmark: 'District Centre Janakpuri' },
  { id: 'del-blu-rajouri-gdn', name: 'Rajouri Garden', hindiName: 'राजौरी गार्डन', cityId: 'delhi', lineIds: ['delhi-blue'], latitude: 28.6493, longitude: 77.1226, isInterchange: true, interchangeLines: ['Blue Line', 'Pink Line'], zone: 'West Delhi', landmark: 'TDI Mall & Main Market' },
  { id: 'del-blu-kirti-nagar', name: 'Kirti Nagar', hindiName: 'कीर्ति नगर', cityId: 'delhi', lineIds: ['delhi-blue'], latitude: 28.6558, longitude: 77.1472, isInterchange: true, interchangeLines: ['Blue Line', 'Green Line'], zone: 'West Delhi', landmark: 'Asia Furniture Market' },
  { id: 'del-blu-karol-bagh', name: 'Karol Bagh', hindiName: 'करोल बाग', cityId: 'delhi', lineIds: ['delhi-blue'], latitude: 28.6441, longitude: 77.1904, zone: 'Central West Delhi', landmark: 'Gaffar Market & Hanuman Temple' },
  { id: 'del-blu-mandi-house', name: 'Mandi House', hindiName: 'मंडी हाउस', cityId: 'delhi', lineIds: ['delhi-blue', 'delhi-violet'], latitude: 28.6258, longitude: 77.2343, isInterchange: true, interchangeLines: ['Blue Line', 'Violet Line'], zone: 'Cultural Hub Delhi', landmark: 'National School of Drama & Kamani Auditorium' },
  { id: 'del-blu-yamuna-bank', name: 'Yamuna Bank', hindiName: 'यमुना बैंक', cityId: 'delhi', lineIds: ['delhi-blue'], latitude: 28.6234, longitude: 77.2625, isInterchange: true, interchangeLines: ['Blue Line Main', 'Vaishali Branch'], zone: 'Yamuna Floodplain', landmark: 'Akshardham vicinity' },
  { id: 'del-blu-mayur-vihar', name: 'Mayur Vihar Phase-1', hindiName: 'मयूर विहार फेज-1', cityId: 'delhi', lineIds: ['delhi-blue'], latitude: 28.6047, longitude: 77.2942, isInterchange: true, interchangeLines: ['Blue Line', 'Pink Line'], zone: 'East Delhi', landmark: 'Mayur Vihar Pocket 1' },
  { id: 'del-blu-botanical-gdn', name: 'Botanical Garden (Noida)', hindiName: 'बॉटेनिकल गार्डन', cityId: 'delhi', lineIds: ['delhi-blue', 'delhi-magenta'], latitude: 28.5641, longitude: 77.3341, isInterchange: true, interchangeLines: ['Blue Line', 'Magenta Line'], zone: 'Noida NCR', landmark: 'Indian Botanic Garden & Sector 38' },
  { id: 'del-blu-noida-sec-18', name: 'Noida Sector 18', hindiName: 'नोएडा सेक्टर 18', cityId: 'delhi', lineIds: ['delhi-blue'], latitude: 28.5708, longitude: 77.3262, zone: 'Noida Commercial Hub', landmark: 'Mall of India & Atta Market' },
  { id: 'del-blu-noida-elec-city', name: 'Noida Electronic City', hindiName: 'नोएडा इलेक्ट्रॉनिक सिटी', cityId: 'delhi', lineIds: ['delhi-blue'], latitude: 28.6277, longitude: 77.3734, isTerminal: true, zone: 'Noida Sector 62', landmark: 'IT Parks & NH-24 Bypass' },

  // Magenta Line Stations (Janakpuri W to Botanical Garden via Airport & South Delhi)
  { id: 'del-mag-palam', name: 'Palam', hindiName: 'पालम', cityId: 'delhi', lineIds: ['delhi-magenta'], latitude: 28.5901, longitude: 77.0862, zone: 'South West Delhi', landmark: 'Air Force Museum' },
  { id: 'del-mag-aerocity', name: 'Delhi Aerocity', hindiName: 'दिल्ली एरोसिटी', cityId: 'delhi', lineIds: ['delhi-magenta', 'delhi-airport'], latitude: 28.5492, longitude: 77.1215, isInterchange: true, interchangeLines: ['Magenta Line', 'Airport Express'], zone: 'Aerocity Hospitality District', landmark: 'Worldmark & Luxury Hotels' },
  { id: 'del-mag-munirka', name: 'Munirka', hindiName: 'मुनीरका', cityId: 'delhi', lineIds: ['delhi-magenta'], latitude: 28.5583, longitude: 77.1724, zone: 'South Delhi', landmark: 'JNU Gate & Vasant Vihar' },
  { id: 'del-mag-kalkaji-mandir', name: 'Kalkaji Mandir', hindiName: 'कालकाजी मंदिर', cityId: 'delhi', lineIds: ['delhi-magenta', 'delhi-violet'], latitude: 28.5501, longitude: 77.2602, isInterchange: true, interchangeLines: ['Magenta Line', 'Violet Line'], zone: 'South East Delhi', landmark: 'Lotus Temple & Kalkaji Temple' },

  // Violet Line Stations (Kashmere Gate to Raja Nahar Singh Ballabhgarh)
  { id: 'del-vio-jln-stadium', name: 'JLN Stadium', hindiName: 'जेएलएन स्टेडियम', cityId: 'delhi', lineIds: ['delhi-violet'], latitude: 28.5872, longitude: 77.2348, zone: 'South Delhi', landmark: 'Jawaharlal Nehru Stadium' },
  { id: 'del-vio-lajpat-nagar', name: 'Lajpat Nagar', hindiName: 'लाजपत नगर', cityId: 'delhi', lineIds: ['delhi-violet'], latitude: 28.5701, longitude: 77.2378, isInterchange: true, interchangeLines: ['Violet Line', 'Pink Line'], zone: 'South Delhi', landmark: 'Central Market Lajpat Nagar' },
  { id: 'del-vio-badarpur', name: 'Badarpur Border', hindiName: 'बदरपुर बॉर्डर', cityId: 'delhi', lineIds: ['delhi-violet'], latitude: 28.4975, longitude: 77.3012, zone: 'Faridabad Border', landmark: 'Delhi-Haryana Border' },
  { id: 'del-vio-raja-nahar-singh', name: 'Raja Nahar Singh (Ballabhgarh)', hindiName: 'राजा नाहर सिंह (बल्लभगढ़)', cityId: 'delhi', lineIds: ['delhi-violet'], latitude: 28.3392, longitude: 77.3204, isTerminal: true, zone: 'Faridabad', landmark: 'Ballabhgarh Bus Station' },

  // Airport Express Stations
  { id: 'del-air-shivaji-stadium', name: 'Shivaji Stadium', hindiName: 'शिवाजी स्टेडियम', cityId: 'delhi', lineIds: ['delhi-airport'], latitude: 28.6291, longitude: 77.2114, zone: 'Connaught Place South', landmark: 'Hanuman Mandir & State Emporiums' },
  { id: 'del-air-dhaula-kuan', name: 'Dhaula Kuan', hindiName: 'धौला कुआँ', cityId: 'delhi', lineIds: ['delhi-airport'], latitude: 28.5928, longitude: 77.1612, isInterchange: true, interchangeLines: ['Airport Express', 'Durgabai Deshmukh South Campus (Pink)'], zone: 'Delhi Cantonment', landmark: 'South Campus University & Army Public School' },
  { id: 'del-air-igi-t3', name: 'IGI Airport Terminal 3', hindiName: 'आईजीआई एयरपोर्ट टी3', cityId: 'delhi', lineIds: ['delhi-airport'], latitude: 28.5562, longitude: 77.0865, zone: 'Indira Gandhi International Airport', landmark: 'International & Domestic Flight Terminal' },
  { id: 'del-air-yashobhoomi', name: 'Yashobhoomi Dwarka Sector 25', hindiName: 'यशोभूमि द्वारका सेक्टर 25', cityId: 'delhi', lineIds: ['delhi-airport'], latitude: 28.5448, longitude: 77.0422, isTerminal: true, zone: 'Dwarka Sector 25', landmark: 'India International Convention & Expo Centre' },
];

// 2. HYDERABAD REAL GEO STATIONS
export const HYDERABAD_GEO_STATIONS: RawStationGeoData[] = [
  // Red Line (Miyapur to LB Nagar - NW to SE)
  { id: 'hyd-red-miyapur', name: 'Miyapur', hindiName: 'मियापुर', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4968, longitude: 78.3614, isTerminal: true, zone: 'North West Hyderabad', landmark: 'Miyapur Bus Depot & NH 65' },
  { id: 'hyd-red-jntu', name: 'JNTU College', hindiName: 'जेएनटीयू कॉलेज', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4983, longitude: 78.3912, zone: 'Kukatpally', landmark: 'Jawaharlal Nehru Technological University' },
  { id: 'hyd-red-kphb', name: 'KPHB Colony', hindiName: 'केपीएचबी कॉलोनी', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4932, longitude: 78.4018, zone: 'Kukatpally', landmark: 'Forum Sujana Mall & KPHB Market' },
  { id: 'hyd-red-kukatpally', name: 'Kukatpally', hindiName: 'कुकटपल्ली', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4842, longitude: 78.4132, zone: 'Kukatpally', landmark: 'Y Junction & Balanagar Flyover' },
  { id: 'hyd-red-bharat-nagar', name: 'Bharat Nagar', hindiName: 'भारत नगर', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4641, longitude: 78.4308, zone: 'Industrial Area', landmark: 'Sanath Nagar Industrial Estate' },
  { id: 'hyd-red-sr-nagar', name: 'SR Nagar', hindiName: 'एस आर नगर', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4429, longitude: 78.4418, zone: 'Central West', landmark: 'Sanjeeva Reddy Nagar Educational Hub' },
  { id: 'hyd-red-ameerpet', name: 'Ameerpet', hindiName: 'अमीरपेट', cityId: 'hyderabad', lineIds: ['hyd-red', 'hyd-blue'], latitude: 17.4375, longitude: 78.4483, isInterchange: true, interchangeLines: ['Red Line (L1)', 'Blue Line (L3)'], zone: 'Central Tech & Commercial Hub', landmark: 'Largest Multi-Level Metro Interchange in India' },
  { id: 'hyd-red-punjagutta', name: 'Punjagutta', hindiName: 'पंजगुट्टा', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4265, longitude: 78.4528, zone: 'Somajiguda', landmark: 'Hyderabad Central Mall & NIMS Hospital' },
  { id: 'hyd-red-khairatabad', name: 'Khairatabad', hindiName: 'खैराताबाद', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.4124, longitude: 78.4592, zone: 'Hussain Sagar Vicinity', landmark: 'Hussain Sagar Lake & Famous Khairatabad Ganesha' },
  { id: 'hyd-red-assembly', name: 'Assembly', hindiName: 'असेंबली', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.3998, longitude: 78.4682, zone: 'Public Gardens', landmark: 'Telangana Legislative Assembly & Public Gardens' },
  { id: 'hyd-red-nampally', name: 'Nampally', hindiName: 'नामपल्ली', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.3912, longitude: 78.4715, zone: 'Old Hyderabad', landmark: 'Hyderabad Deccan Railway Station' },
  { id: 'hyd-red-mgbs', name: 'MGBS (Mahatma Gandhi Bus Station)', hindiName: 'एमजीबीएस', cityId: 'hyderabad', lineIds: ['hyd-red', 'hyd-green'], latitude: 17.3789, longitude: 78.4808, isInterchange: true, interchangeLines: ['Red Line (L1)', 'Green Line (L2)'], zone: 'Old City North', landmark: 'Imlibun Central Bus Station & Musi River' },
  { id: 'hyd-red-malakpet', name: 'Malakpet', hindiName: 'मलकपेट', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.3721, longitude: 78.4982, zone: 'South East', landmark: 'Hyderabad Race Club & Yashoda Hospital' },
  { id: 'hyd-red-dilsukhnagar', name: 'Dilsukhnagar', hindiName: 'दिलसुखनगर', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.3688, longitude: 78.5245, zone: 'East Commercial Hub', landmark: 'Dilsukhnagar Shopping District & Sai Baba Temple' },
  { id: 'hyd-red-lb-nagar', name: 'LB Nagar', hindiName: 'एल बी नगर', cityId: 'hyderabad', lineIds: ['hyd-red'], latitude: 17.3458, longitude: 78.5521, isTerminal: true, zone: 'South East Gateway', landmark: 'Vijayawada Highway Junction' },

  // Blue Line (Nagole to Raidurg - East to West IT Corridor)
  { id: 'hyd-blu-nagole', name: 'Nagole', hindiName: 'नागोल', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.3821, longitude: 78.5612, isTerminal: true, zone: 'East Hyderabad', landmark: 'Outer Ring Road East & Uppal Depot' },
  { id: 'hyd-blu-uppal', name: 'Uppal', hindiName: 'उप्पल', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4024, longitude: 78.5598, zone: 'East Hyderabad', landmark: 'Rajiv Gandhi International Cricket Stadium' },
  { id: 'hyd-blu-ngri', name: 'NGRI', hindiName: 'एनजीआरआई', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4142, longitude: 78.5482, zone: 'Habsiguda', landmark: 'National Geophysical Research Institute' },
  { id: 'hyd-blu-habsiguda', name: 'Habsiguda', hindiName: 'हबसिगुड़ा', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4215, longitude: 78.5392, zone: 'East Hyderabad', landmark: 'IICT & CCMB Research Institutes' },
  { id: 'hyd-blu-tarnaka', name: 'Tarnaka', hindiName: 'तारनाका', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4285, longitude: 78.5284, zone: 'Secunderabad East', landmark: 'Osmania University Distance Education' },
  { id: 'hyd-blu-sec-east', name: 'Secunderabad East', hindiName: 'सिकंदराबाद ईस्ट', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4348, longitude: 78.5028, zone: 'Secunderabad Core', landmark: 'Secunderabad Junction Railway Station' },
  { id: 'hyd-blu-paradise', name: 'Paradise', hindiName: 'पैराडाइज', cityId: 'hyderabad', lineIds: ['hyd-blue', 'hyd-green'], latitude: 17.4418, longitude: 78.4872, isInterchange: true, interchangeLines: ['Blue Line (L3)', 'Green Line (L2)'], zone: 'Secunderabad West', landmark: 'Famous Paradise Biryani & Club' },
  { id: 'hyd-blu-rasoolpura', name: 'Rasoolpura', hindiName: 'रसूलपुरा', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4435, longitude: 78.4721, zone: 'Begumpet', landmark: 'US Consulate / Paigah Palace' },
  { id: 'hyd-blu-begumpet', name: 'Begumpet', hindiName: 'बेगमपेट', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4398, longitude: 78.4602, zone: 'Begumpet', landmark: 'Begumpet Airport & Lifestyle Mall' },
  { id: 'hyd-blu-madhura-nagar', name: 'Madhura Nagar', hindiName: 'मधुरा नगर', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4352, longitude: 78.4382, zone: 'Yousufguda', landmark: 'Kalyan Nagar & Vengal Rao Nagar' },
  { id: 'hyd-blu-jubilee-hills', name: 'Jubilee Hills Check Post', hindiName: 'जुबली हिल्स चेक पोस्ट', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4298, longitude: 78.4112, zone: 'Jubilee Hills', landmark: 'Film Nagar, KBR National Park' },
  { id: 'hyd-blu-peddamma-gudi', name: 'Peddamma Gudi', hindiName: 'पेद्दम्मा गुड़ी', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4325, longitude: 78.3995, zone: 'Jubilee Hills Road 36', landmark: 'Historic Sri Peddamma Temple' },
  { id: 'hyd-blu-madhapur', name: 'Madhapur', hindiName: 'माधापुर', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4392, longitude: 78.3882, zone: 'HITEC City Entrance', landmark: 'Durgam Cheruvu Cable Bridge & Mindspace' },
  { id: 'hyd-blu-durgam-cheruvu', name: 'Durgam Cheruvu', hindiName: 'दुर्गम चेरुवू', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4438, longitude: 78.3812, zone: 'Cyberabad', landmark: 'Secret Lake Park & Inorbit Mall' },
  { id: 'hyd-blu-hitec-city', name: 'HITEC City', hindiName: 'हाईटेक सिटी', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4485, longitude: 78.3768, zone: 'Cyberabad IT Corridor', landmark: 'Cyber Towers, L&T Infocity, Tech Hub' },
  { id: 'hyd-blu-raidurg', name: 'Raidurg', hindiName: 'रायदुर्ग', cityId: 'hyderabad', lineIds: ['hyd-blue'], latitude: 17.4421, longitude: 78.3685, isTerminal: true, zone: 'Knowledge City', landmark: 'Mindspace IT Park, IKEA & Financial District' },

  // Green Line (JBS Parade Ground to MGBS - North to South Old City)
  { id: 'hyd-grn-jbs', name: 'JBS Parade Ground', hindiName: 'जेबीएस परेड ग्राउंड', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.4475, longitude: 78.4988, isTerminal: true, isInterchange: true, interchangeLines: ['Green Line', 'Blue Line at Secunderabad West'], zone: 'Secunderabad', landmark: 'Jubilee Bus Station (JBS) & Gymkhana Grounds' },
  { id: 'hyd-grn-sec-west', name: 'Secunderabad West', hindiName: 'सिकंदराबाद वेस्ट', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.4412, longitude: 78.4975, zone: 'Secunderabad', landmark: 'Parade Grounds & Railway Divisional Office' },
  { id: 'hyd-grn-gandhi-hospital', name: 'Gandhi Hospital', hindiName: 'गांधी हॉस्पिटल', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.4282, longitude: 78.4998, zone: 'Musheerabad', landmark: 'Gandhi Medical College & Hospital' },
  { id: 'hyd-grn-musheerabad', name: 'Musheerabad', hindiName: 'मुशीराबाद', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.4198, longitude: 78.5002, zone: 'Musheerabad', landmark: 'Musheerabad Market' },
  { id: 'hyd-grn-rtc-x-roads', name: 'RTC X Roads', hindiName: 'आरटीसी क्रॉस रोड्स', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.4095, longitude: 78.4985, zone: 'Chikkadpally', landmark: 'Famous Sandhya & Sudharshan Theatres hub' },
  { id: 'hyd-grn-chikkadpally', name: 'Chikkadpally', hindiName: 'चिक्कड़पल्ली', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.4012, longitude: 78.4942, zone: 'City Central', landmark: 'City Central Library & Tyagaraya Gana Sabha' },
  { id: 'hyd-grn-narayanaguda', name: 'Narayanaguda', hindiName: 'नारायणगुड़ा', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.3942, longitude: 78.4912, zone: 'Narayanaguda', landmark: 'YMCA & Educational Institutes' },
  { id: 'hyd-grn-sultan-bazaar', name: 'Sultan Bazaar', hindiName: 'सुल्तान बाज़ार', cityId: 'hyderabad', lineIds: ['hyd-green'], latitude: 17.3862, longitude: 78.4862, zone: 'Koti Commercial Area', landmark: 'Koti Women’s College & Historic Bazaar' },
];

// 3. KANPUR REAL GEO STATIONS
export const KANPUR_GEO_STATIONS: RawStationGeoData[] = [
  // Orange Line (IIT Kanpur to Motijheel & Central Railway Station Corridor)
  { id: 'kan-org-iitk', name: 'IIT Kanpur', hindiName: 'आईआईटी कानपुर', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.5123, longitude: 80.2329, isTerminal: true, zone: 'Kalyanpur West', landmark: 'Indian Institute of Technology Kanpur Main Gate' },
  { id: 'kan-org-kalyanpur', name: 'Kalyanpur', hindiName: 'कल्याणपुर', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4952, longitude: 80.2575, zone: 'Kalyanpur', landmark: 'Kalyanpur Railway Station & GT Road' },
  { id: 'kan-org-spm-hospital', name: 'SPM Hospital', hindiName: 'एसपीएम हॉस्पिटल', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4908, longitude: 80.2708, zone: 'Vikas Nagar', landmark: 'Shyama Prasad Mukherjee Hospital' },
  { id: 'kan-org-csjmu', name: 'CSJM University', hindiName: 'सीएसजेएम यूनिवर्सिटी', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4862, longitude: 80.2821, zone: 'University Campus', landmark: 'Chhatrapati Shahu Ji Maharaj University Gate' },
  { id: 'kan-org-gurudev-palace', name: 'Gurudev Palace', hindiName: 'गुरुदेव पैलेस', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4815, longitude: 80.2928, zone: 'Sharda Nagar', landmark: 'Gurudev Cinema & Commercial Center' },
  { id: 'kan-org-geeta-nagar', name: 'Geeta Nagar', hindiName: 'गीता नगर', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4782, longitude: 80.3015, zone: 'Kakadeo Area', landmark: 'Kakadeo Coaching Hub' },
  { id: 'kan-org-rawatpur', name: 'Rawatpur', hindiName: 'रावतपुर', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4751, longitude: 80.3112, isInterchange: true, interchangeLines: ['Orange Line (L1)', 'Future Blue Line (L2)'], zone: 'Rawatpur Junction', landmark: 'Rawatpur Railway Station & GSVM Medical College' },
  { id: 'kan-org-lala-lajpat-rai', name: 'LLR Hospital (Hallet)', hindiName: 'एलएलआर हॉस्पिटल (हैलट)', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4768, longitude: 80.3204, zone: 'Swaroop Nagar', landmark: 'Lala Lajpat Rai Hospital & Medical College' },
  { id: 'kan-org-motijheel', name: 'Moti Jheel', hindiName: 'मोती झील', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4778, longitude: 80.3298, isTerminal: true, zone: 'Civil Lines West', landmark: 'Kanpur Municipal Corporation & Moti Jheel Park' },
  { id: 'kan-org-chunniganj', name: 'Chunniganj', hindiName: 'चुन्नीगंज', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4735, longitude: 80.3398, zone: 'Central Kanpur (Underground)', landmark: 'Chunniganj Bus Station & Bada Chauraha vicinity' },
  { id: 'kan-org-naveen-market', name: 'Naveen Market', hindiName: 'नवीन मार्केट', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4682, longitude: 80.3475, zone: 'City Shopping Heart (Underground)', landmark: 'Naveen Market & Som Dutt Plaza' },
  { id: 'kan-org-bada-chauraha', name: 'Bada Chauraha', hindiName: 'बड़ा चौराहा', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4641, longitude: 80.3542, zone: 'Commercial Core (Underground)', landmark: 'Z Square Mall & Head Post Office' },
  { id: 'kan-org-nayaganj', name: 'Nayaganj', hindiName: 'नयागंज', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4592, longitude: 80.3598, zone: 'Wholesale Market (Underground)', landmark: 'Nayaganj Sarafa Market & Birhana Road' },
  { id: 'kan-org-kanpur-central', name: 'Kanpur Central Railway Station', hindiName: 'कानपुर सेंट्रल रेलवे स्टेशन', cityId: 'kanpur', lineIds: ['kanpur-orange'], latitude: 26.4538, longitude: 80.3512, isInterchange: true, isTerminal: true, interchangeLines: ['Orange Line', 'Indian Railways Northern/NCR Core'], zone: 'Cantonment / Rail Junction', landmark: 'Kanpur Central Station (Platform 1 side)' },
];

// Helper to convert Raw Station Geo Data to CityMetroNetwork format using City Viewbox
export const convertStationsToCityNetwork = (
  rawStations: RawStationGeoData[],
  viewBox: { minX: number; minY: number; width: number; height: number; padding?: number }
): MetroStation[] => {
  if (rawStations.length === 0) return [];

  // Calculate latitude & longitude bounds
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  rawStations.forEach((s) => {
    if (s.latitude < minLat) minLat = s.latitude;
    if (s.latitude > maxLat) maxLat = s.latitude;
    if (s.longitude < minLng) minLng = s.longitude;
    if (s.longitude > maxLng) maxLng = s.longitude;
  });

  const latSpan = maxLat - minLat || 0.01;
  const lngSpan = maxLng - minLng || 0.01;

  const pad = viewBox.padding || 80;
  const usableWidth = viewBox.width - pad * 2;
  const usableHeight = viewBox.height - pad * 2;

  return rawStations.map((st) => {
    // Map longitude -> X (left to right)
    // Map latitude -> Y (top to bottom, inverted since higher latitude is North)
    const normX = (st.longitude - minLng) / lngSpan;
    const normY = (maxLat - st.latitude) / latSpan;

    const x = Math.round(viewBox.minX + pad + normX * usableWidth);
    const y = Math.round(viewBox.minY + pad + normY * usableHeight);

    return {
      id: st.id,
      name: st.name,
      hindiName: st.hindiName,
      cityId: st.cityId,
      city: st.cityId,
      lineIds: st.lineIds,
      line: st.lineIds[0],
      latitude: st.latitude,
      longitude: st.longitude,
      coordinates: { x, y },
      isInterchange: st.isInterchange,
      interchangeLines: st.interchangeLines,
      isTerminal: st.isTerminal,
      zone: st.zone,
      landmark: st.landmark,
      elevation: st.elevation,
    };
  });
};
