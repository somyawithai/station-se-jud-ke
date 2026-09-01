import { CityMetroNetwork, MetroLine, NationalMetroSummary } from '../types';
export type { NationalMetroSummary };
import { convertStationsToCityNetwork } from './rawStationGeoData';
import { geoToSvgCoordinates } from '../utils/geoProjection';

// Import City Data Modules
import { DELHI_NCR_RAW_STATIONS, DELHI_NCR_LINES_CONFIG } from './cities/delhiNcr';
import { MUMBAI_RAW_STATIONS, MUMBAI_LINES_CONFIG } from './cities/mumbai';
import { BENGALURU_RAW_STATIONS, BENGALURU_LINES_CONFIG } from './cities/bengaluru';
import { HYDERABAD_RAW_STATIONS, HYDERABAD_LINES_CONFIG } from './cities/hyderabad';
import { KOLKATA_RAW_STATIONS, KOLKATA_LINES_CONFIG } from './cities/kolkata';
import { CHENNAI_RAW_STATIONS, CHENNAI_LINES_CONFIG } from './cities/chennai';
import { AHMEDABAD_RAW_STATIONS, AHMEDABAD_LINES_CONFIG } from './cities/ahmedabad';
import { PUNE_RAW_STATIONS, PUNE_LINES_CONFIG } from './cities/pune';
import { NAGPUR_RAW_STATIONS, NAGPUR_LINES_CONFIG } from './cities/nagpur';
import { KOCHI_RAW_STATIONS, KOCHI_LINES_CONFIG } from './cities/kochi';
import { LUCKNOW_RAW_STATIONS, LUCKNOW_LINES_CONFIG } from './cities/lucknow';
import { KANPUR_RAW_STATIONS, KANPUR_LINES_CONFIG } from './cities/kanpur';
import { JAIPUR_RAW_STATIONS, JAIPUR_LINES_CONFIG } from './cities/jaipur';
import { AGRA_RAW_STATIONS, AGRA_LINES_CONFIG } from './cities/agra';
import { NOIDA_RAW_STATIONS, NOIDA_LINES_CONFIG } from './cities/noida';
import { GURUGRAM_RAW_STATIONS, GURUGRAM_LINES_CONFIG } from './cities/gurugram';
import { NAVI_MUMBAI_RAW_STATIONS, NAVI_MUMBAI_LINES_CONFIG } from './cities/navimumbai';
import { BHOPAL_RAW_STATIONS, BHOPAL_LINES_CONFIG } from './cities/bhopal';
import { INDORE_RAW_STATIONS, INDORE_LINES_CONFIG } from './cities/indore';
import { MEERUT_RAW_STATIONS, MEERUT_LINES_CONFIG } from './cities/meerut';

// Helper function to dynamically calculate SVG path strings based on station coordinates
export const buildMetroLinesWithPaths = (
  lines: MetroLine[],
  stations: ReturnType<typeof convertStationsToCityNetwork>
): MetroLine[] => {
  const stationMap = new Map(stations.map((s) => [s.id, s]));

  return lines.map((line) => {
    const pts = line.stationIds
      .map((id) => stationMap.get(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => `${s.coordinates.x} ${s.coordinates.y}`);

    const pathD = pts.length > 1 ? `M ${pts.join(' L ')}` : line.pathD || '';
    return { ...line, pathD };
  });
};

// Standard city viewBox for 1000x800 SVG canvas space
const STD_VIEW_BOX = { minX: 0, minY: 0, width: 1000, height: 800, padding: 80 };

// 1. DELHI NCR
const delhiStations = convertStationsToCityNetwork(DELHI_NCR_RAW_STATIONS, STD_VIEW_BOX);
const delhiLines = buildMetroLinesWithPaths(DELHI_NCR_LINES_CONFIG, delhiStations);
export const DELHI_METRO_NETWORK: CityMetroNetwork = {
  id: 'delhi',
  name: 'Delhi NCR',
  hindiName: 'दिल्ली एनसीआर',
  systemName: 'Delhi Metro (DMRC)',
  operator: 'Delhi Metro Rail Corporation',
  status: 'operational',
  tagline: 'Lifeline of the National Capital Region & World Class Mass Transit',
  state: 'Delhi / Haryana / Uttar Pradesh',
  description:
    'The 393+ km network spans Delhi, Noida, Greater Noida, Ghaziabad, Gurugram, Faridabad, Bahadurgarh, and Ballabhgarh across 12 lines with 288 stations.',
  totalStations: delhiStations.length,
  totalLines: delhiLines.length,
  networkLengthKm: 393.1,
  dailyRidership: '6.0+ Million',
  establishedYear: 2002,
  centerCoordinates: [28.6139, 77.209],
  viewBox: '0 0 1000 800',
  lines: delhiLines,
  stations: delhiStations,
  popularStations: ['del-yel-rajiv-chowk', 'del-red-kashmere-gate', 'del-yel-hauz-khas', 'del-blu-botanical-gdn'],
};

// 2. MUMBAI
const mumbaiStations = convertStationsToCityNetwork(MUMBAI_RAW_STATIONS, STD_VIEW_BOX);
const mumbaiLines = buildMetroLinesWithPaths(MUMBAI_LINES_CONFIG, mumbaiStations);
export const MUMBAI_METRO_NETWORK: CityMetroNetwork = {
  id: 'mumbai',
  name: 'Mumbai',
  hindiName: 'मुंबई',
  systemName: 'Mumbai Metro (MMRDA / MMMOCL)',
  operator: 'Maha Mumbai Metro Operations Corporation',
  status: 'operational',
  tagline: 'Connecting the Financial Capital from Coastal Undersea to Link Road Elevated Arcs',
  state: 'Maharashtra',
  description:
    'Spanning Line 1 (Versova-Ghatkopar), Line 2A (Yellow), Line 7 (Red), and the state-of-the-art underground Line 3 Aqua Line serving Mumbai Airport and BKC.',
  totalStations: mumbaiStations.length,
  totalLines: mumbaiLines.length,
  networkLengthKm: 59.1,
  dailyRidership: '1.2+ Million',
  establishedYear: 2014,
  centerCoordinates: [19.076, 72.8777],
  viewBox: '0 0 1000 800',
  lines: mumbaiLines,
  stations: mumbaiStations,
  popularStations: ['mum-l1-ghatkopar', 'mum-l1-andheri', 'mum-l3-bkc', 'mum-l3-csia-t2'],
};

// 3. BENGALURU
const bengaluruStations = convertStationsToCityNetwork(BENGALURU_RAW_STATIONS, STD_VIEW_BOX);
const bengaluruLines = buildMetroLinesWithPaths(BENGALURU_LINES_CONFIG, bengaluruStations);
export const BENGALURU_METRO_NETWORK: CityMetroNetwork = {
  id: 'bengaluru',
  name: 'Bengaluru',
  hindiName: 'बेंगलुरु',
  systemName: 'Namma Metro (BMRCL)',
  operator: 'Bangalore Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Connecting India Silicon Valley across East-West & North-South Corridors',
  state: 'Karnataka',
  description:
    '73.8+ km network across Purple Line (Whitefield to Challaghatta) and Green Line (Madavara to Silk Institute) intersecting at the grand Nadaprabhu Kempegowda Majestic Station.',
  totalStations: bengaluruStations.length,
  totalLines: bengaluruLines.length,
  networkLengthKm: 73.8,
  dailyRidership: '850,000+',
  establishedYear: 2011,
  centerCoordinates: [12.9716, 77.5946],
  viewBox: '0 0 1000 800',
  lines: bengaluruLines,
  stations: bengaluruStations,
  popularStations: ['blr-pur-majestic', 'blr-pur-mg-road', 'blr-pur-indiranagar', 'blr-pur-whitefield'],
};

// 4. HYDERABAD
const hyderabadStations = convertStationsToCityNetwork(HYDERABAD_RAW_STATIONS, STD_VIEW_BOX);
const hyderabadLines = buildMetroLinesWithPaths(HYDERABAD_LINES_CONFIG, hyderabadStations);
export const HYDERABAD_METRO_NETWORK: CityMetroNetwork = {
  id: 'hyderabad',
  name: 'Hyderabad',
  hindiName: 'हैदराबाद',
  systemName: 'Hyderabad Metro (HMRL / L&T)',
  operator: 'L&T Metro Rail (Hyderabad) Limited',
  status: 'operational',
  tagline: 'World Largest Public-Private Partnership Elevated Metro Network',
  state: 'Telangana',
  description:
    '69.2 km network spanning Red Line (Miyapur - LB Nagar), Blue Line (Nagole - HITEC City / Raidurg), and Green Line (JBS - MGBS) intersecting at Ameerpet & MGBS.',
  totalStations: hyderabadStations.length,
  totalLines: hyderabadLines.length,
  networkLengthKm: 69.2,
  dailyRidership: '520,000+',
  establishedYear: 2017,
  centerCoordinates: [17.385, 78.4867],
  viewBox: '0 0 1000 800',
  lines: hyderabadLines,
  stations: hyderabadStations,
  popularStations: ['hyd-red-ameerpet', 'hyd-blu-hitec-city', 'hyd-blu-raidurg', 'hyd-red-mgbs'],
};

// 5. KOLKATA
const kolkataStations = convertStationsToCityNetwork(KOLKATA_RAW_STATIONS, STD_VIEW_BOX);
const kolkataLines = buildMetroLinesWithPaths(KOLKATA_LINES_CONFIG, kolkataStations);
export const KOLKATA_METRO_NETWORK: CityMetroNetwork = {
  id: 'kolkata',
  name: 'Kolkata',
  hindiName: 'कोलकाता',
  systemName: 'Kolkata Metro (KMRCL / Metro Railway)',
  operator: 'Metro Railway Kolkata & KMRCL',
  status: 'operational',
  tagline: 'India First Pioneer Metro & First Underwater Riverine Metro under the Hooghly',
  state: 'West Bengal',
  description:
    'Featuring India oldest metro line (Dakshineswar - Kavi Subhash), the engineering marvel Green Line running under the Hooghly River to Howrah, Purple Line, and Orange Line.',
  totalStations: kolkataStations.length,
  totalLines: kolkataLines.length,
  networkLengthKm: 59.0,
  dailyRidership: '700,000+',
  establishedYear: 1984,
  centerCoordinates: [22.5726, 88.3639],
  viewBox: '0 0 1000 800',
  lines: kolkataLines,
  stations: kolkataStations,
  popularStations: ['kol-grn-howrah-stn', 'kol-blu-esplanade', 'kol-blu-park-street', 'kol-grn-saltlake-sec5'],
};

// 6. CHENNAI
const chennaiStations = convertStationsToCityNetwork(CHENNAI_RAW_STATIONS, STD_VIEW_BOX);
const chennaiLines = buildMetroLinesWithPaths(CHENNAI_LINES_CONFIG, chennaiStations);
export const CHENNAI_METRO_NETWORK: CityMetroNetwork = {
  id: 'chennai',
  name: 'Chennai',
  hindiName: 'चेन्नई',
  systemName: 'Chennai Metro (CMRL)',
  operator: 'Chennai Metro Rail Limited',
  status: 'operational',
  tagline: 'Seamlessly linking North Chennai, Central Heritage Core, and Airport',
  state: 'Tamil Nadu',
  description:
    '54.1 km network with Blue Line (Wimco Nagar to Airport) and Green Line (Chennai Central to St. Thomas Mount) meeting at Central and Alandur.',
  totalStations: chennaiStations.length,
  totalLines: chennaiLines.length,
  networkLengthKm: 54.1,
  dailyRidership: '310,000+',
  establishedYear: 2015,
  centerCoordinates: [13.0827, 80.2707],
  viewBox: '0 0 1000 800',
  lines: chennaiLines,
  stations: chennaiStations,
  popularStations: ['chn-blu-central', 'chn-blu-airport', 'chn-grn-alandur', 'chn-grn-koyambedu'],
};

// 7. AHMEDABAD & GANDHINAGAR
const ahmedabadStations = convertStationsToCityNetwork(AHMEDABAD_RAW_STATIONS, STD_VIEW_BOX);
const ahmedabadLines = buildMetroLinesWithPaths(AHMEDABAD_LINES_CONFIG, ahmedabadStations);
export const AHMEDABAD_METRO_NETWORK: CityMetroNetwork = {
  id: 'ahmedabad',
  name: 'Ahmedabad & Gandhinagar',
  hindiName: 'अहमदाबाद एवं गांधीनगर',
  systemName: 'Ahmedabad Metro (GMRC)',
  operator: 'Gujarat Metro Rail Corporation',
  status: 'operational',
  tagline: 'Connecting Heritage Walled City, Sabarmati Riverfront, and State Capital Gandhinagar',
  state: 'Gujarat',
  description:
    '68+ km twin-city network across Blue Line (Thaltej Gam to Vastral Gam) and Red Line (APMC to Motera Stadium & Gandhinagar Sector 1).',
  totalStations: ahmedabadStations.length,
  totalLines: ahmedabadLines.length,
  networkLengthKm: 68.3,
  dailyRidership: '140,000+',
  establishedYear: 2019,
  centerCoordinates: [23.0225, 72.5714],
  viewBox: '0 0 1000 800',
  lines: ahmedabadLines,
  stations: ahmedabadStations,
  popularStations: ['ahm-blu-old-high-court', 'ahm-red-motera-stadium', 'ahm-blu-kalupur-rail', 'ahm-red-gandhinagar-sec1'],
};

// 8. PUNE
const puneStations = convertStationsToCityNetwork(PUNE_RAW_STATIONS, STD_VIEW_BOX);
const puneLines = buildMetroLinesWithPaths(PUNE_LINES_CONFIG, puneStations);
export const PUNE_METRO_NETWORK: CityMetroNetwork = {
  id: 'pune',
  name: 'Pune',
  hindiName: 'पुणे',
  systemName: 'Pune Metro (Maha Metro)',
  operator: 'Maharashtra Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Connecting Cultural Capital Pune & Industrial Twin-City Pimpri-Chinchwad',
  state: 'Maharashtra',
  description:
    '33.2 km operational network with Purple Line (PCMC Bhavan to Swargate underground) and Aqua Line (Vanaz to Ramwadi) crossing at Civil Court multi-level interchange.',
  totalStations: puneStations.length,
  totalLines: puneLines.length,
  networkLengthKm: 33.2,
  dailyRidership: '180,000+',
  establishedYear: 2022,
  centerCoordinates: [18.5204, 73.8567],
  viewBox: '0 0 1000 800',
  lines: puneLines,
  stations: puneStations,
  popularStations: ['pun-pur-civil-court', 'pun-pur-swargate', 'pun-pur-shivajinagar', 'pun-aqu-ramwadi'],
};

// 9. NAGPUR
const nagpurStations = convertStationsToCityNetwork(NAGPUR_RAW_STATIONS, STD_VIEW_BOX);
const nagpurLines = buildMetroLinesWithPaths(NAGPUR_LINES_CONFIG, nagpurStations);
export const NAGPUR_METRO_NETWORK: CityMetroNetwork = {
  id: 'nagpur',
  name: 'Nagpur',
  hindiName: 'नागपुर',
  systemName: 'Nagpur Metro (Maha Metro)',
  operator: 'Maharashtra Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Greener, Solar-Powered Transit at the Zero Mile Geographic Center of India',
  state: 'Maharashtra',
  description:
    '40.0 km operational network with Orange Line (Automotive Square to Khapri MIHAN) and Aqua Line (Prajapati Nagar to Lokmanya Nagar) intersecting at Sitabuldi.',
  totalStations: nagpurStations.length,
  totalLines: nagpurLines.length,
  networkLengthKm: 40.0,
  dailyRidership: '120,000+',
  establishedYear: 2019,
  centerCoordinates: [21.1458, 79.0882],
  viewBox: '0 0 1000 800',
  lines: nagpurLines,
  stations: nagpurStations,
  popularStations: ['nag-org-sitabuldi', 'nag-org-zero-mile', 'nag-org-airport', 'nag-org-khapri'],
};

// 10. KOCHI
const kochiStations = convertStationsToCityNetwork(KOCHI_RAW_STATIONS, STD_VIEW_BOX);
const kochiLines = buildMetroLinesWithPaths(KOCHI_LINES_CONFIG, kochiStations);
export const KOCHI_METRO_NETWORK: CityMetroNetwork = {
  id: 'kochi',
  name: 'Kochi',
  hindiName: 'कोच्चि',
  systemName: 'Kochi Metro (KMRL)',
  operator: 'Kochi Metro Rail Limited',
  status: 'operational',
  tagline: 'India First Integrated Multi-Modal Rail & Water Transit System',
  state: 'Kerala',
  description:
    '28.1 km elevated line connecting Aluva, Edapally (LuLu Mall), M.G. Road, Vyttila Mobility Hub, and Thripunithura with Kochi Water Metro ferries.',
  totalStations: kochiStations.length,
  totalLines: kochiLines.length,
  networkLengthKm: 28.1,
  dailyRidership: '105,000+',
  establishedYear: 2017,
  centerCoordinates: [9.9312, 76.2673],
  viewBox: '0 0 1000 800',
  lines: kochiLines,
  stations: kochiStations,
  popularStations: ['koc-blu-edapally', 'koc-blu-vytilla', 'koc-blu-mg-road', 'koc-blu-aluva'],
};

// 11. LUCKNOW
const lucknowStations = convertStationsToCityNetwork(LUCKNOW_RAW_STATIONS, STD_VIEW_BOX);
const lucknowLines = buildMetroLinesWithPaths(LUCKNOW_LINES_CONFIG, lucknowStations);
export const LUCKNOW_METRO_NETWORK: CityMetroNetwork = {
  id: 'lucknow',
  name: 'Lucknow',
  hindiName: 'लखनऊ',
  systemName: 'Lucknow Metro (UPMRC)',
  operator: 'Uttar Pradesh Metro Rail Corporation',
  status: 'operational',
  tagline: 'Express North-South Corridor across the City of Nawabs & Gomti River',
  state: 'Uttar Pradesh',
  description:
    '22.8 km Red Line from Chaudhary Charan Singh International Airport to Munshi Pulia via Charbagh Railway Terminus and Hazratganj.',
  totalStations: lucknowStations.length,
  totalLines: lucknowLines.length,
  networkLengthKm: 22.87,
  dailyRidership: '95,000+',
  establishedYear: 2017,
  centerCoordinates: [26.8467, 80.9462],
  viewBox: '0 0 1000 800',
  lines: lucknowLines,
  stations: lucknowStations,
  popularStations: ['luc-red-charbagh', 'luc-red-hazratganj', 'luc-red-airport', 'luc-red-munshi-pulia'],
};

// 12. KANPUR
const kanpurStations = convertStationsToCityNetwork(KANPUR_RAW_STATIONS, STD_VIEW_BOX);
const kanpurLines = buildMetroLinesWithPaths(KANPUR_LINES_CONFIG, kanpurStations);
export const KANPUR_METRO_NETWORK: CityMetroNetwork = {
  id: 'kanpur',
  name: 'Kanpur',
  hindiName: 'कानपुर',
  systemName: 'Kanpur Metro (UPMRC)',
  operator: 'Uttar Pradesh Metro Rail Corporation',
  status: 'operational',
  tagline: 'Modern Rapid Transit through Industrial Hub & Historic City Center',
  state: 'Uttar Pradesh',
  description:
    '15.5 km Orange Line corridor linking IIT Kanpur, Kalyanpur, Rawatpur, Moti Jheel, Naveen Market, and Kanpur Central Railway Station.',
  totalStations: kanpurStations.length,
  totalLines: kanpurLines.length,
  networkLengthKm: 15.5,
  dailyRidership: '45,000+',
  establishedYear: 2021,
  centerCoordinates: [26.4499, 80.3319],
  viewBox: '0 0 1000 800',
  lines: kanpurLines,
  stations: kanpurStations,
  popularStations: ['kan-org-iitk', 'kan-org-kanpur-central', 'kan-org-motijheel', 'kan-org-bada-chauraha'],
};

// 13. JAIPUR
const jaipurStations = convertStationsToCityNetwork(JAIPUR_RAW_STATIONS, STD_VIEW_BOX);
const jaipurLines = buildMetroLinesWithPaths(JAIPUR_LINES_CONFIG, jaipurStations);
export const JAIPUR_METRO_NETWORK: CityMetroNetwork = {
  id: 'jaipur',
  name: 'Jaipur',
  hindiName: 'जयपुर',
  systemName: 'Jaipur Metro (JMRC)',
  operator: 'Jaipur Metro Rail Corporation',
  status: 'operational',
  tagline: 'Underground & Elevated Transit into the Heart of the Pink City UNESCO World Heritage Core',
  state: 'Rajasthan',
  description:
    '12.0 km Pink Line connecting Mansarovar, Jaipur Junction Railway Station, Sindhi Camp ISBT, Chandpole, and Badi Chaupar at Hawa Mahal.',
  totalStations: jaipurStations.length,
  totalLines: jaipurLines.length,
  networkLengthKm: 12.0,
  dailyRidership: '55,000+',
  establishedYear: 2015,
  centerCoordinates: [26.9124, 75.7873],
  viewBox: '0 0 1000 800',
  lines: jaipurLines,
  stations: jaipurStations,
  popularStations: ['jai-pnk-badi-chaupar', 'jai-pnk-railway-stn', 'jai-pnk-sindhi-camp', 'jai-pnk-mansarovar'],
};

// 14. AGRA
const agraStations = convertStationsToCityNetwork(AGRA_RAW_STATIONS, STD_VIEW_BOX);
const agraLines = buildMetroLinesWithPaths(AGRA_LINES_CONFIG, agraStations);
export const AGRA_METRO_NETWORK: CityMetroNetwork = {
  id: 'agra',
  name: 'Agra',
  hindiName: 'आगरा',
  systemName: 'Agra Metro (UPMRC)',
  operator: 'Uttar Pradesh Metro Rail Corporation',
  status: 'operational',
  tagline: 'Eco-friendly World Heritage Corridor Serving the Taj Mahal & Agra Fort',
  state: 'Uttar Pradesh',
  description:
    '6.0 km Priority Corridor directly connecting Taj East Gate, Fatehabad Road luxury hotel zone, Taj Mahal, Agra Fort, and Mankameshwar Mandir.',
  totalStations: agraStations.length,
  totalLines: agraLines.length,
  networkLengthKm: 6.0,
  dailyRidership: '35,000+',
  establishedYear: 2024,
  centerCoordinates: [27.1767, 78.0081],
  viewBox: '0 0 1000 800',
  lines: agraLines,
  stations: agraStations,
  popularStations: ['agr-yel-taj-east-gate', 'agr-yel-taj-mahal', 'agr-yel-agra-fort', 'agr-yel-mankameshwar'],
};

// 15. NOIDA & GREATER NOIDA
const noidaStations = convertStationsToCityNetwork(NOIDA_RAW_STATIONS, STD_VIEW_BOX);
const noidaLines = buildMetroLinesWithPaths(NOIDA_LINES_CONFIG, noidaStations);
export const NOIDA_METRO_NETWORK: CityMetroNetwork = {
  id: 'noida',
  name: 'Noida & Greater Noida',
  hindiName: 'नोएडा एवं ग्रेटर नोएडा',
  systemName: 'Noida Metro Aqua Line (NMRC)',
  operator: 'Noida Metro Rail Corporation',
  status: 'operational',
  tagline: 'Dedicated High-Speed Suburban Transit along Noida-Greater Noida Expressway',
  state: 'Uttar Pradesh',
  description:
    '29.7 km Aqua Line corridor connecting Sector 51 (interchange with Delhi Metro Blue Line) to Pari Chowk and Depot Station Greater Noida across 21 stations.',
  totalStations: noidaStations.length,
  totalLines: noidaLines.length,
  networkLengthKm: 29.7,
  dailyRidership: '60,000+',
  establishedYear: 2019,
  centerCoordinates: [28.5355, 77.391],
  viewBox: '0 0 1000 800',
  lines: noidaLines,
  stations: noidaStations,
  popularStations: ['noi-aqu-sec-51', 'noi-aqu-pari-chowk', 'noi-aqu-sec-137', 'noi-aqu-sec-142'],
};

// 16. GURUGRAM RAPID METRO
const gurugramStations = convertStationsToCityNetwork(GURUGRAM_RAW_STATIONS, STD_VIEW_BOX);
const gurugramLines = buildMetroLinesWithPaths(GURUGRAM_LINES_CONFIG, gurugramStations);
export const GURUGRAM_METRO_NETWORK: CityMetroNetwork = {
  id: 'gurugram',
  name: 'Gurugram (Rapid Metro)',
  hindiName: 'गुरुग्राम रैपिड मेट्रो',
  systemName: 'Rapid Metro Gurugram',
  operator: 'Delhi Metro Rail Corporation (DMRC)',
  status: 'operational',
  tagline: 'Private Feeder Loop Connecting DLF Cyber City & Golf Course Road',
  state: 'Haryana',
  description:
    '12.1 km loop system connecting CyberHub, DLF Phase 2/3, Sikanderpur (direct interchange with DMRC Yellow Line), and Sector 55-56 on Golf Course Road.',
  totalStations: gurugramStations.length,
  totalLines: gurugramLines.length,
  networkLengthKm: 12.15,
  dailyRidership: '75,000+',
  establishedYear: 2013,
  centerCoordinates: [28.4595, 77.0266],
  viewBox: '0 0 1000 800',
  lines: gurugramLines,
  stations: gurugramStations,
  popularStations: ['gur-rap-cyber-city', 'gur-rap-sikanderpur', 'gur-rap-sec-55-56', 'gur-rap-moulsari-ave'],
};

// 17. NAVI MUMBAI
const naviMumbaiStations = convertStationsToCityNetwork(NAVI_MUMBAI_RAW_STATIONS, STD_VIEW_BOX);
const naviMumbaiLines = buildMetroLinesWithPaths(NAVI_MUMBAI_LINES_CONFIG, naviMumbaiStations);
export const NAVI_MUMBAI_METRO_NETWORK: CityMetroNetwork = {
  id: 'navi-mumbai',
  name: 'Navi Mumbai',
  hindiName: 'नवी मुंबई',
  systemName: 'Navi Mumbai Metro (CIDCO / Maha Metro)',
  operator: 'City and Industrial Development Corporation (CIDCO)',
  status: 'operational',
  tagline: 'Connecting Central Business District Belapur, Kharghar Nodes, and Taloja MIDC',
  state: 'Maharashtra',
  description:
    '11.1 km elevated Line 1 serving 11 stations from CBD Belapur station through Utsav Chowk, Central Park Kharghar, and Pendhar Taloja.',
  totalStations: naviMumbaiStations.length,
  totalLines: naviMumbaiLines.length,
  networkLengthKm: 11.1,
  dailyRidership: '30,000+',
  establishedYear: 2023,
  centerCoordinates: [19.033, 73.0297],
  viewBox: '0 0 1000 800',
  lines: naviMumbaiLines,
  stations: naviMumbaiStations,
  popularStations: ['nvm-l1-belapur', 'nvm-l1-utsav-chowk', 'nvm-l1-central-park', 'nvm-l1-pendhar'],
};

// 18. BHOPAL
const bhopalStations = convertStationsToCityNetwork(BHOPAL_RAW_STATIONS, STD_VIEW_BOX);
const bhopalLines = buildMetroLinesWithPaths(BHOPAL_LINES_CONFIG, bhopalStations);
export const BHOPAL_METRO_NETWORK: CityMetroNetwork = {
  id: 'bhopal',
  name: 'Bhopal',
  hindiName: 'भोपाल',
  systemName: 'Bhopal Metro (Bhoj Metro / MPMRCL)',
  operator: 'Madhya Pradesh Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Rapid Transit linking MP Nagar Commercial Core, Rani Kamalapati Station, and AIIMS',
  state: 'Madhya Pradesh',
  description:
    '6.2 km Orange Line Priority Corridor connecting Subhash Nagar Depot, DB City Mall, MP Nagar, Rani Kamalapati World-Class Station, and AIIMS Bhopal.',
  totalStations: bhopalStations.length,
  totalLines: bhopalLines.length,
  networkLengthKm: 6.22,
  dailyRidership: '25,000+',
  establishedYear: 2024,
  centerCoordinates: [23.2599, 77.4126],
  viewBox: '0 0 1000 800',
  lines: bhopalLines,
  stations: bhopalStations,
  popularStations: ['bho-org-rani-kamalapati', 'bho-org-db-city', 'bho-org-aiims-bhopal', 'bho-org-subhash-nagar'],
};

// 19. INDORE
const indoreStations = convertStationsToCityNetwork(INDORE_RAW_STATIONS, STD_VIEW_BOX);
const indoreLines = buildMetroLinesWithPaths(INDORE_LINES_CONFIG, indoreStations);
export const INDORE_METRO_NETWORK: CityMetroNetwork = {
  id: 'indore',
  name: 'Indore',
  hindiName: 'इंदौर',
  systemName: 'Indore Metro (MPMRCL)',
  operator: 'Madhya Pradesh Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Ring Metro Corridor connecting India Cleanest City & Super Corridor IT Hub',
  state: 'Madhya Pradesh',
  description:
    '5.9 km Yellow Line Priority Corridor along the Super Corridor connecting Gandhi Nagar Depot, TCS & Infosys SEZ campus tech parks, and NMIMS.',
  totalStations: indoreStations.length,
  totalLines: indoreLines.length,
  networkLengthKm: 5.9,
  dailyRidership: '20,000+',
  establishedYear: 2024,
  centerCoordinates: [22.7196, 75.8577],
  viewBox: '0 0 1000 800',
  lines: indoreLines,
  stations: indoreStations,
  popularStations: ['ind-yel-gandhi-nagar', 'ind-yel-super-corr-06', 'ind-yel-super-corr-05', 'ind-yel-super-corr-03'],
};

// 20. MEERUT
const meerutStations = convertStationsToCityNetwork(MEERUT_RAW_STATIONS, STD_VIEW_BOX);
const meerutLines = buildMetroLinesWithPaths(MEERUT_LINES_CONFIG, meerutStations);
export const MEERUT_METRO_NETWORK: CityMetroNetwork = {
  id: 'meerut',
  name: 'Meerut',
  hindiName: 'मेरठ',
  systemName: 'Meerut Metro (NCRTC)',
  operator: 'National Capital Region Transport Corporation (NCRTC)',
  status: 'operational',
  tagline: 'First High-Speed Urban Metro Operating on Dedicated National RRTS Infrastructure',
  state: 'Uttar Pradesh',
  description:
    '23.6 km urban metro line serving Meerut South, Rithani, Shatabdi Nagar, Brahmpuri, Meerut Central, Bhainsali Bus Terminal, Begumpul, and Modipuram.',
  totalStations: meerutStations.length,
  totalLines: meerutLines.length,
  networkLengthKm: 23.6,
  dailyRidership: '40,000+',
  establishedYear: 2024,
  centerCoordinates: [28.9845, 77.7064],
  viewBox: '0 0 1000 800',
  lines: meerutLines,
  stations: meerutStations,
  popularStations: ['mee-met-begumpul', 'mee-met-meerut-south', 'mee-met-bhainsali', 'mee-met-modipuram'],
};

// Complete National List of all 20 Operational Metro Networks in India
export const CITIES_METRO_DATA: CityMetroNetwork[] = [
  DELHI_METRO_NETWORK,
  MUMBAI_METRO_NETWORK,
  BENGALURU_METRO_NETWORK,
  HYDERABAD_METRO_NETWORK,
  KOLKATA_METRO_NETWORK,
  CHENNAI_METRO_NETWORK,
  AHMEDABAD_METRO_NETWORK,
  PUNE_METRO_NETWORK,
  NAGPUR_METRO_NETWORK,
  KOCHI_METRO_NETWORK,
  LUCKNOW_METRO_NETWORK,
  KANPUR_METRO_NETWORK,
  JAIPUR_METRO_NETWORK,
  AGRA_METRO_NETWORK,
  NOIDA_METRO_NETWORK,
  GURUGRAM_METRO_NETWORK,
  NAVI_MUMBAI_METRO_NETWORK,
  BHOPAL_METRO_NETWORK,
  INDORE_METRO_NETWORK,
  MEERUT_METRO_NETWORK,
];

// National Metro Hubs mapped for India Geographic Canvas Overlay
export interface RawNationalHub {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  latitude: number;
  longitude: number;
  isAvailableInV1: boolean;
  status: 'operational' | 'under_construction';
  totalStations: number;
  highlightStation: string;
}

export const rawNationalHubs: RawNationalHub[] = CITIES_METRO_DATA.map((city) => ({
  id: city.id,
  name: city.name,
  hindiName: city.hindiName,
  state: city.state,
  latitude: city.centerCoordinates[0],
  longitude: city.centerCoordinates[1],
  isAvailableInV1: true,
  status: 'operational',
  totalStations: city.totalStations,
  highlightStation: city.popularStations[0]
    ? city.stations.find((s) => s.id === city.popularStations[0])?.name || city.name
    : city.name,
}));

// Map national hubs using real geographic projection (lat, lng -> svg x, y)
export const NATIONAL_METRO_HUBS: NationalMetroSummary[] = rawNationalHubs.map((hub) => {
  const [x, y] = geoToSvgCoordinates(hub.latitude, hub.longitude);
  return { ...hub, x, y };
});

export const getCityMetroById = (cityId: string): CityMetroNetwork | undefined => {
  return CITIES_METRO_DATA.find((c) => c.id.toLowerCase() === cityId.toLowerCase());
};
