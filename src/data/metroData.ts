import { CityMetroNetwork, MetroLine, NationalMetroSummary } from '../types';
export type { NationalMetroSummary };
import { convertStationsToCityNetwork } from './rawStationGeoData';
import { geoToSvgCoordinates } from '../utils/geoProjection';

// Import City Data Modules from the Authoritative Dataset (21 Metro Cities)
import { AGRA_RAW_STATIONS, AGRA_LINES_CONFIG } from './cities/agra';
import { AHMEDABAD_RAW_STATIONS, AHMEDABAD_LINES_CONFIG } from './cities/ahmedabad';
import { PUNE_RAW_STATIONS, PUNE_LINES_CONFIG } from './cities/pune';
import { PATNA_RAW_STATIONS, PATNA_LINES_CONFIG } from './cities/patna';
import { NOIDA_RAW_STATIONS, NOIDA_LINES_CONFIG } from './cities/noida';
import { NAVI_MUMBAI_RAW_STATIONS, NAVI_MUMBAI_LINES_CONFIG } from './cities/navimumbai';
import { NAGPUR_RAW_STATIONS, NAGPUR_LINES_CONFIG } from './cities/nagpur';
import { MUMBAI_RAW_STATIONS, MUMBAI_LINES_CONFIG } from './cities/mumbai';
import { LUCKNOW_RAW_STATIONS, LUCKNOW_LINES_CONFIG } from './cities/lucknow';
import { KOLKATA_RAW_STATIONS, KOLKATA_LINES_CONFIG } from './cities/kolkata';
import { KOCHI_RAW_STATIONS, KOCHI_LINES_CONFIG } from './cities/kochi';
import { KANPUR_RAW_STATIONS, KANPUR_LINES_CONFIG } from './cities/kanpur';
import { JAIPUR_RAW_STATIONS, JAIPUR_LINES_CONFIG } from './cities/jaipur';
import { INDORE_RAW_STATIONS, INDORE_LINES_CONFIG } from './cities/indore';
import { HYDERABAD_RAW_STATIONS, HYDERABAD_LINES_CONFIG } from './cities/hyderabad';
import { GURGAON_RAW_STATIONS, GURGAON_LINES_CONFIG } from './cities/gurgaon';
import { CHENNAI_RAW_STATIONS, CHENNAI_LINES_CONFIG } from './cities/chennai';
import { BENGALURU_RAW_STATIONS, BENGALURU_LINES_CONFIG } from './cities/bengaluru';
import { DELHI_RAW_STATIONS, DELHI_LINES_CONFIG } from './cities/delhi';
import { BHOPAL_RAW_STATIONS, BHOPAL_LINES_CONFIG } from './cities/bhopal';
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

// 1. AGRA (1 line, 6 stations, 0 interchanges)
const agraStations = convertStationsToCityNetwork(AGRA_RAW_STATIONS, STD_VIEW_BOX);
const agraLines = buildMetroLinesWithPaths(AGRA_LINES_CONFIG, agraStations);
export const AGRA_METRO_NETWORK: CityMetroNetwork = {
  id: 'agra',
  name: 'Agra',
  hindiName: 'आगरा',
  systemName: 'Agra Metro (UPMRC)',
  operator: 'Uttar Pradesh Metro Rail Corporation',
  status: 'operational',
  tagline: 'Rapid transit serving the UNESCO Heritage corridor and historic city of Agra',
  state: 'Uttar Pradesh',
  description: 'Operational Yellow Line Priority section spanning Taj East Gate to Mankameshwar.',
  totalStations: agraStations.length,
  totalLines: agraLines.length,
  networkLengthKm: 5.2,
  dailyRidership: '15,000+',
  establishedYear: 2024,
  centerCoordinates: [27.1767, 78.0081],
  viewBox: '0 0 1000 800',
  lines: agraLines,
  stations: agraStations,
  popularStations: ['agr-yel-taj-east-gate', 'agr-yel-taj-mahal', 'agr-yel-agra-fort', 'agr-yel-mankameshwar'],
};

// 2. AHMEDABAD (4 lines, 57 stations, 3 interchanges)
const ahmedabadStations = convertStationsToCityNetwork(AHMEDABAD_RAW_STATIONS, STD_VIEW_BOX);
const ahmedabadLines = buildMetroLinesWithPaths(AHMEDABAD_LINES_CONFIG, ahmedabadStations);
export const AHMEDABAD_METRO_NETWORK: CityMetroNetwork = {
  id: 'ahmedabad',
  name: 'Ahmedabad',
  hindiName: 'अहमदाबाद',
  systemName: 'Ahmedabad Metro (GMRC)',
  operator: 'Gujarat Metro Rail Corporation',
  status: 'operational',
  tagline: 'Connecting Ahmedabad and Gandhinagar twin cities across 4 active metro corridors',
  state: 'Gujarat',
  description: '4 active lines spanning East-West, North-South, GNLU-Gift City and Mahatma Mandir corridors with 3 interchanges.',
  totalStations: ahmedabadStations.length,
  totalLines: ahmedabadLines.length,
  networkLengthKm: 40.03,
  dailyRidership: '130,000+',
  establishedYear: 2019,
  centerCoordinates: [23.0225, 72.5714],
  viewBox: '0 0 1000 800',
  lines: ahmedabadLines,
  stations: ahmedabadStations,
  popularStations: ['ahm-blu-old-high-court', 'ahm-red-motera-stadium', 'ahm-vio-gnlu', 'ahm-blu-kalupur'],
};

// 3. PUNE (2 lines, 30 stations, 1 interchange)
const puneStations = convertStationsToCityNetwork(PUNE_RAW_STATIONS, STD_VIEW_BOX);
const puneLines = buildMetroLinesWithPaths(PUNE_LINES_CONFIG, puneStations);
export const PUNE_METRO_NETWORK: CityMetroNetwork = {
  id: 'pune',
  name: 'Pune',
  hindiName: 'पुणे',
  systemName: 'Pune Metro (Maha Metro)',
  operator: 'Maharashtra Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Connecting PCMC to Swargate and Vanaz to Ramwadi through the iconic Civil Court underground interchange',
  state: 'Maharashtra',
  description: 'Spanning Aqua Line (Line 2) and Purple Line (Line 1) intersecting at Civil Court interchange.',
  totalStations: puneStations.length,
  totalLines: puneLines.length,
  networkLengthKm: 33.2,
  dailyRidership: '140,000+',
  establishedYear: 2022,
  centerCoordinates: [18.5204, 73.8567],
  viewBox: '0 0 1000 800',
  lines: puneLines,
  stations: puneStations,
  popularStations: ['pun-aqu-civil-court', 'pun-pur-swargate', 'pun-aqu-pune-railway-station', 'pun-pur-pcmc-bhavan'],
};

// 4. PATNA (1 line, 3 stations, 0 interchanges)
const patnaStations = convertStationsToCityNetwork(PATNA_RAW_STATIONS, STD_VIEW_BOX);
const patnaLines = buildMetroLinesWithPaths(PATNA_LINES_CONFIG, patnaStations);
export const PATNA_METRO_NETWORK: CityMetroNetwork = {
  id: 'patna',
  name: 'Patna',
  hindiName: 'पटना',
  systemName: 'Patna Metro (PMRC)',
  operator: 'Patna Metro Rail Corporation',
  status: 'operational',
  tagline: 'Priority metro corridor serving Patna Bhootnath to New ISBT terminal',
  state: 'Bihar',
  description: 'Operational Blue Line Priority section connecting Bhootnath, Zero Mile and New ISBT.',
  totalStations: patnaStations.length,
  totalLines: patnaLines.length,
  networkLengthKm: 3.5,
  dailyRidership: '10,000+',
  establishedYear: 2025,
  centerCoordinates: [25.5941, 85.1376],
  viewBox: '0 0 1000 800',
  lines: patnaLines,
  stations: patnaStations,
  popularStations: ['pat-blu-new-isbt', 'pat-blu-zero-mile', 'pat-blu-bhootnath'],
};

// 5. NOIDA (1 line, 22 stations, 0 interchanges)
const noidaStations = convertStationsToCityNetwork(NOIDA_RAW_STATIONS, STD_VIEW_BOX);
const noidaLines = buildMetroLinesWithPaths(NOIDA_LINES_CONFIG, noidaStations);
export const NOIDA_METRO_NETWORK: CityMetroNetwork = {
  id: 'noida',
  name: 'Noida',
  hindiName: 'नोएडा',
  systemName: 'Noida Metro (NMRC)',
  operator: 'Noida Metro Rail Corporation',
  status: 'operational',
  tagline: 'Aqua Line connecting Sector 51 Noida to Greater Noida Depot',
  state: 'Uttar Pradesh',
  description: '29.7 km elevated corridor with 22 stations serving key tech parks, residential sectors and Greater Noida.',
  totalStations: noidaStations.length,
  totalLines: noidaLines.length,
  networkLengthKm: 29.7,
  dailyRidership: '60,000+',
  establishedYear: 2019,
  centerCoordinates: [28.5355, 77.391],
  viewBox: '0 0 1000 800',
  lines: noidaLines,
  stations: noidaStations,
  popularStations: ['noi-aqu-noida-sec-52', 'noi-aqu-pari-chowk', 'noi-aqu-noida-sec-137', 'noi-aqu-depot'],
};

// 6. NAVI MUMBAI (1 line, 11 stations, 0 interchanges)
const naviMumbaiStations = convertStationsToCityNetwork(NAVI_MUMBAI_RAW_STATIONS, STD_VIEW_BOX);
const naviMumbaiLines = buildMetroLinesWithPaths(NAVI_MUMBAI_LINES_CONFIG, naviMumbaiStations);
export const NAVI_MUMBAI_METRO_NETWORK: CityMetroNetwork = {
  id: 'navi-mumbai',
  name: 'Navi Mumbai',
  hindiName: 'नवी मुंबई',
  systemName: 'Navi Mumbai Metro (CIDCO / Maha Metro)',
  operator: 'City and Industrial Development Corporation (CIDCO)',
  status: 'operational',
  tagline: 'Line 1 connecting CBD Belapur through Kharghar nodes to Pendhar Taloja',
  state: 'Maharashtra',
  description: '11.1 km elevated line serving 11 stations from Belapur Terminal to Pendhar.',
  totalStations: naviMumbaiStations.length,
  totalLines: naviMumbaiLines.length,
  networkLengthKm: 11.1,
  dailyRidership: '30,000+',
  establishedYear: 2023,
  centerCoordinates: [19.033, 73.0297],
  viewBox: '0 0 1000 800',
  lines: naviMumbaiLines,
  stations: naviMumbaiStations,
  popularStations: ['nvm-l1-belapur-terminal', 'nvm-l1-utsav-chowk', 'nvm-l1-central-park', 'nvm-l1-pendhar'],
};

// 7. NAGPUR (2 lines, 38 stations, 1 interchange)
const nagpurStations = convertStationsToCityNetwork(NAGPUR_RAW_STATIONS, STD_VIEW_BOX);
const nagpurLines = buildMetroLinesWithPaths(NAGPUR_LINES_CONFIG, nagpurStations);
export const NAGPUR_METRO_NETWORK: CityMetroNetwork = {
  id: 'nagpur',
  name: 'Nagpur',
  hindiName: 'नागपुर',
  systemName: 'Nagpur Metro (Maha Metro)',
  operator: 'Maharashtra Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Connecting Orange and Aqua corridors with a 4-level interchange at Sitabuldi',
  state: 'Maharashtra',
  description: '38 stations across Aqua Line (East-West) and Orange Line (North-South) intersecting at Sitabuldi.',
  totalStations: nagpurStations.length,
  totalLines: nagpurLines.length,
  networkLengthKm: 38.2,
  dailyRidership: '95,000+',
  establishedYear: 2019,
  centerCoordinates: [21.1458, 79.0882],
  viewBox: '0 0 1000 800',
  lines: nagpurLines,
  stations: nagpurStations,
  popularStations: ['nag-aqu-sitabuldi', 'nag-ora-airport', 'nag-aqu-nagpur-railway-station', 'nag-ora-zero-mile'],
};

// 8. MUMBAI (4 lines, 74 stations, 2 interchanges)
const mumbaiStations = convertStationsToCityNetwork(MUMBAI_RAW_STATIONS, STD_VIEW_BOX);
const mumbaiLines = buildMetroLinesWithPaths(MUMBAI_LINES_CONFIG, mumbaiStations);
export const MUMBAI_METRO_NETWORK: CityMetroNetwork = {
  id: 'mumbai',
  name: 'Mumbai',
  hindiName: 'मुंबई',
  systemName: 'Mumbai Metro (MMRDA / MMMOCL)',
  operator: 'Maha Mumbai Metro Operations Corporation',
  status: 'operational',
  tagline: 'Connecting Mumbai across Blue, Yellow, Red and underground Aqua corridors',
  state: 'Maharashtra',
  description: '74 stations across 4 operational lines with key interchanges at Dahisar East and Marol Naka.',
  totalStations: mumbaiStations.length,
  totalLines: mumbaiLines.length,
  networkLengthKm: 59.1,
  dailyRidership: '1.2+ Million',
  establishedYear: 2014,
  centerCoordinates: [19.076, 72.8777],
  viewBox: '0 0 1000 800',
  lines: mumbaiLines,
  stations: mumbaiStations,
  popularStations: ['mum-blu-marol-naka', 'mum-yel-dahisar-east', 'mum-aqu-bandra-kurla-complex', 'mum-aqu-csmi-airport-t2', 'mum-blu-andheri', 'mum-blu-ghatkopar'],
};

// 9. LUCKNOW (1 line, 21 stations, 0 interchanges)
const lucknowStations = convertStationsToCityNetwork(LUCKNOW_RAW_STATIONS, STD_VIEW_BOX);
const lucknowLines = buildMetroLinesWithPaths(LUCKNOW_LINES_CONFIG, lucknowStations);
export const LUCKNOW_METRO_NETWORK: CityMetroNetwork = {
  id: 'lucknow',
  name: 'Lucknow',
  hindiName: 'लखनऊ',
  systemName: 'Lucknow Metro (UPMRC)',
  operator: 'Uttar Pradesh Metro Rail Corporation',
  status: 'operational',
  tagline: 'North-South Corridor linking CCS Airport to Munshipulia',
  state: 'Uttar Pradesh',
  description: '22.87 km corridor with 21 stations serving Charbagh, Hazratganj, KD Singh Babu Stadium, and Indira Nagar.',
  totalStations: lucknowStations.length,
  totalLines: lucknowLines.length,
  networkLengthKm: 22.87,
  dailyRidership: '85,000+',
  establishedYear: 2017,
  centerCoordinates: [26.8467, 80.9462],
  viewBox: '0 0 1000 800',
  lines: lucknowLines,
  stations: lucknowStations,
  popularStations: ['luc-red-ccs-airport', 'luc-red-charbagh', 'luc-red-hazratganj', 'luc-red-munshipulia'],
};

// 10. KOLKATA (5 lines, 58 stations, 3 interchanges)
const kolkataStations = convertStationsToCityNetwork(KOLKATA_RAW_STATIONS, STD_VIEW_BOX);
const kolkataLines = buildMetroLinesWithPaths(KOLKATA_LINES_CONFIG, kolkataStations);
export const KOLKATA_METRO_NETWORK: CityMetroNetwork = {
  id: 'kolkata',
  name: 'Kolkata',
  hindiName: 'कोलकाता',
  systemName: 'Kolkata Metro (Metro Railway / KMRCL)',
  operator: 'Ministry of Railways (Metro Railway Kolkata)',
  status: 'operational',
  tagline: 'India first metro system featuring the historic Blue Line and the underwater Green Line under the Hooghly River',
  state: 'West Bengal',
  description: '58 stations across 5 active lines with 3 interchanges at Esplanade, Kavi Subhash, and Noapara.',
  totalStations: kolkataStations.length,
  totalLines: kolkataLines.length,
  networkLengthKm: 59.4,
  dailyRidership: '750,000+',
  establishedYear: 1984,
  centerCoordinates: [22.5726, 88.3639],
  viewBox: '0 0 1000 800',
  lines: kolkataLines,
  stations: kolkataStations,
  popularStations: ['kol-blu-esplanade', 'kol-gre-howrah', 'kol-blu-kavi-subhash-new-garia', 'kol-blu-noapara', 'kol-blu-dum-dum'],
};

// 11. KOCHI (1 line, 25 stations, 0 interchanges)
const kochiStations = convertStationsToCityNetwork(KOCHI_RAW_STATIONS, STD_VIEW_BOX);
const kochiLines = buildMetroLinesWithPaths(KOCHI_LINES_CONFIG, kochiStations);
export const KOCHI_METRO_NETWORK: CityMetroNetwork = {
  id: 'kochi',
  name: 'Kochi',
  hindiName: 'कोच्चि',
  systemName: 'Kochi Metro (KMRL)',
  operator: 'Kochi Metro Rail Limited',
  status: 'operational',
  tagline: 'Line 1 connecting Aluva to Tripunithura Terminal via MG Road and Vyttila mobility hub',
  state: 'Kerala',
  description: '25 stations along the major transport spine of Greater Kochi.',
  totalStations: kochiStations.length,
  totalLines: kochiLines.length,
  networkLengthKm: 28.1,
  dailyRidership: '100,000+',
  establishedYear: 2017,
  centerCoordinates: [9.9312, 76.2673],
  viewBox: '0 0 1000 800',
  lines: kochiLines,
  stations: kochiStations,
  popularStations: ['koc-l1-aluva', 'koc-l1-mg-road', 'koc-l1-vyttila', 'koc-l1-tripunithura-terminal'],
};

// 12. KANPUR (1 line, 14 stations, 0 interchanges)
const kanpurStations = convertStationsToCityNetwork(KANPUR_RAW_STATIONS, STD_VIEW_BOX);
const kanpurLines = buildMetroLinesWithPaths(KANPUR_LINES_CONFIG, kanpurStations);
export const KANPUR_METRO_NETWORK: CityMetroNetwork = {
  id: 'kanpur',
  name: 'Kanpur',
  hindiName: 'कानपुर',
  systemName: 'Kanpur Metro (UPMRC)',
  operator: 'Uttar Pradesh Metro Rail Corporation',
  status: 'operational',
  tagline: 'Orange Line connecting IIT Kanpur to Kanpur Central Railway Station',
  state: 'Uttar Pradesh',
  description: '14 operational stations connecting IIT Kanpur, Motijheel, and Kanpur Central.',
  totalStations: kanpurStations.length,
  totalLines: kanpurLines.length,
  networkLengthKm: 16.0,
  dailyRidership: '35,000+',
  establishedYear: 2021,
  centerCoordinates: [26.4499, 80.3319],
  viewBox: '0 0 1000 800',
  lines: kanpurLines,
  stations: kanpurStations,
  popularStations: ['kan-ora-iit-kanpur', 'kan-ora-kanpur-central', 'kan-ora-motijheel', 'kan-ora-rawatpur'],
};

// 13. JAIPUR (1 line, 11 stations, 0 interchanges)
const jaipurStations = convertStationsToCityNetwork(JAIPUR_RAW_STATIONS, STD_VIEW_BOX);
const jaipurLines = buildMetroLinesWithPaths(JAIPUR_LINES_CONFIG, jaipurStations);
export const JAIPUR_METRO_NETWORK: CityMetroNetwork = {
  id: 'jaipur',
  name: 'Jaipur',
  hindiName: 'जयपुर',
  systemName: 'Jaipur Metro (JMRC)',
  operator: 'Jaipur Metro Rail Corporation',
  status: 'operational',
  tagline: 'Pink Line connecting Mansarovar to Badi Chaupar in the historic Pink City',
  state: 'Rajasthan',
  description: '11 stations serving Mansarovar, Railway Station, Sindhi Camp, Chandpole and Badi Chaupar.',
  totalStations: jaipurStations.length,
  totalLines: jaipurLines.length,
  networkLengthKm: 12.0,
  dailyRidership: '60,000+',
  establishedYear: 2015,
  centerCoordinates: [26.9124, 75.7873],
  viewBox: '0 0 1000 800',
  lines: jaipurLines,
  stations: jaipurStations,
  popularStations: ['jai-pnk-badi-chaupar', 'jai-pnk-sindhi-camp', 'jai-pnk-railway-station', 'jai-pnk-mansarovar'],
};

// 14. INDORE (1 line, 5 stations, 0 interchanges)
const indoreStations = convertStationsToCityNetwork(INDORE_RAW_STATIONS, STD_VIEW_BOX);
const indoreLines = buildMetroLinesWithPaths(INDORE_LINES_CONFIG, indoreStations);
export const INDORE_METRO_NETWORK: CityMetroNetwork = {
  id: 'indore',
  name: 'Indore',
  hindiName: 'इंदौर',
  systemName: 'Indore Metro (MPMRCL)',
  operator: 'Madhya Pradesh Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Yellow Line Priority Corridor connecting Airport Terminal and Super Corridor',
  state: 'Madhya Pradesh',
  description: '5 stations from Devi Ahilya Bai Holkar Terminal to Veerangana Jhalkari Bai.',
  totalStations: indoreStations.length,
  totalLines: indoreLines.length,
  networkLengthKm: 5.9,
  dailyRidership: '20,000+',
  establishedYear: 2024,
  centerCoordinates: [22.7196, 75.8577],
  viewBox: '0 0 1000 800',
  lines: indoreLines,
  stations: indoreStations,
  popularStations: ['ind-yel-devi-ahilya-bai-holkar-terminal', 'ind-yel-veerangana-jhalkari-bai', 'ind-yel-maharani-lakshmi-bai'],
};

// 15. HYDERABAD (3 lines, 59 stations, 3 interchanges)
const hyderabadStations = convertStationsToCityNetwork(HYDERABAD_RAW_STATIONS, STD_VIEW_BOX);
const hyderabadLines = buildMetroLinesWithPaths(HYDERABAD_LINES_CONFIG, hyderabadStations);
export const HYDERABAD_METRO_NETWORK: CityMetroNetwork = {
  id: 'hyderabad',
  name: 'Hyderabad',
  hindiName: 'हैदराबाद',
  systemName: 'Hyderabad Metro (HMRL / L&T)',
  operator: 'L&T Metro Rail (Hyderabad) Limited',
  status: 'operational',
  tagline: 'Elevated metro network across Red, Blue, and Green Corridors with major interchanges at Ameerpet, JBS, and MGBS',
  state: 'Telangana',
  description: '59 stations across 3 lines with 3 interchanges connecting IT corridors, Secunderabad and Old City.',
  totalStations: hyderabadStations.length,
  totalLines: hyderabadLines.length,
  networkLengthKm: 69.2,
  dailyRidership: '520,000+',
  establishedYear: 2017,
  centerCoordinates: [17.385, 78.4867],
  viewBox: '0 0 1000 800',
  lines: hyderabadLines,
  stations: hyderabadStations,
  popularStations: ['hyd-blu-ameerpet', 'hyd-blu-hitec-city', 'hyd-blu-raidurg', 'hyd-red-mg-bus-station', 'hyd-blu-jbs-parade-ground'],
};

// 16. GURGAON (1 line, 11 stations, 0 interchanges)
const gurgaonStations = convertStationsToCityNetwork(GURGAON_RAW_STATIONS, STD_VIEW_BOX);
const gurgaonLines = buildMetroLinesWithPaths(GURGAON_LINES_CONFIG, gurgaonStations);
export const GURGAON_METRO_NETWORK: CityMetroNetwork = {
  id: 'gurgaon',
  name: 'Gurgaon',
  hindiName: 'गुड़गांव',
  systemName: 'Gurgaon Rapid Metro (DMRC / RMGL)',
  operator: 'Delhi Metro Rail Corporation',
  status: 'operational',
  tagline: 'Rapid Line loop connecting Cyber City, DLF phases, and Sector 55-56',
  state: 'Haryana',
  description: '11 stations along CyberHub, Golf Course Road and Sikandarpur.',
  totalStations: gurgaonStations.length,
  totalLines: gurgaonLines.length,
  networkLengthKm: 12.15,
  dailyRidership: '75,000+',
  establishedYear: 2013,
  centerCoordinates: [28.4595, 77.0266],
  viewBox: '0 0 1000 800',
  lines: gurgaonLines,
  stations: gurgaonStations,
  popularStations: ['gur-rap-cyber-city', 'gur-rap-sikandarpur', 'gur-rap-sector-55-56', 'gur-rap-phase-3'],
};

// 17. CHENNAI (2 lines, 43 stations, 2 interchanges)
const chennaiStations = convertStationsToCityNetwork(CHENNAI_RAW_STATIONS, STD_VIEW_BOX);
const chennaiLines = buildMetroLinesWithPaths(CHENNAI_LINES_CONFIG, chennaiStations);
export const CHENNAI_METRO_NETWORK: CityMetroNetwork = {
  id: 'chennai',
  name: 'Chennai',
  hindiName: 'चेन्नई',
  systemName: 'Chennai Metro (CMRL)',
  operator: 'Chennai Metro Rail Limited',
  status: 'operational',
  tagline: 'Connecting Chennai Airport to Wimco Nagar Depot and St Thomas Mount with interchanges at Alandur & Chennai Central',
  state: 'Tamil Nadu',
  description: '43 stations across Blue and Green Lines with interchanges at Arignar Anna Alandur and MGR Central.',
  totalStations: chennaiStations.length,
  totalLines: chennaiLines.length,
  networkLengthKm: 54.1,
  dailyRidership: '310,000+',
  establishedYear: 2015,
  centerCoordinates: [13.0827, 80.2707],
  viewBox: '0 0 1000 800',
  lines: chennaiLines,
  stations: chennaiStations,
  popularStations: ['che-blu-mgr-central-chennai-central', 'che-blu-arignar-anna-alandur', 'che-blu-chennai-international-airport', 'che-gre-koyambedu'],
};

// 18. BENGALURU (3 lines, 85 stations, 2 interchanges)
const bengaluruStations = convertStationsToCityNetwork(BENGALURU_RAW_STATIONS, STD_VIEW_BOX);
const bengaluruLines = buildMetroLinesWithPaths(BENGALURU_LINES_CONFIG, bengaluruStations);
export const BENGALURU_METRO_NETWORK: CityMetroNetwork = {
  id: 'bengaluru',
  name: 'Bengaluru',
  hindiName: 'बेंगलुरु',
  systemName: 'Namma Metro (BMRCL)',
  operator: 'Bangalore Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Connecting India Silicon Valley across Green, Purple, and Yellow Lines intersecting at Majestic and RV Road',
  state: 'Karnataka',
  description: '85 stations across Green, Purple and Yellow Lines with interchanges at Majestic and Rashtreeya Vidyalaya Road.',
  totalStations: bengaluruStations.length,
  totalLines: bengaluruLines.length,
  networkLengthKm: 73.8,
  dailyRidership: '850,000+',
  establishedYear: 2011,
  centerCoordinates: [12.9716, 77.5946],
  viewBox: '0 0 1000 800',
  lines: bengaluruLines,
  stations: bengaluruStations,
  popularStations: ['blr-pur-nadaprabhu-kempegowda-station-majestic', 'blr-grn-rashtreeya-vidyalaya-road', 'blr-pur-mg-road', 'blr-pur-whitefield-kadugodi', 'blr-yel-electronic-city'],
};

// 19. DELHI (12 lines, 327 stations, 23 interchanges)
const delhiStations = convertStationsToCityNetwork(DELHI_RAW_STATIONS, STD_VIEW_BOX);
const delhiLines = buildMetroLinesWithPaths(DELHI_LINES_CONFIG, delhiStations);
export const DELHI_METRO_NETWORK: CityMetroNetwork = {
  id: 'delhi',
  name: 'Delhi',
  hindiName: 'दिल्ली',
  systemName: 'Delhi Metro (DMRC)',
  operator: 'Delhi Metro Rail Corporation',
  status: 'operational',
  tagline: 'Lifeline of the National Capital Region across 12 active lines with 23 major interchange hubs',
  state: 'Delhi / Haryana / Uttar Pradesh',
  description: '327 stations listed in the authoritative workbook spanning Red, Yellow, Blue, Green, Violet, Pink, Magenta, Grey, and Orange corridors.',
  totalStations: delhiStations.length,
  totalLines: delhiLines.length,
  networkLengthKm: 393.1,
  dailyRidership: '6.0+ Million',
  establishedYear: 2002,
  centerCoordinates: [28.6139, 77.209],
  viewBox: '0 0 1000 800',
  lines: delhiLines,
  stations: delhiStations,
  popularStations: ['del-blu-rajiv-chowk', 'del-red-kashmere-gate', 'del-yel-hauz-khas', 'del-blu-botanical-garden', 'del-yel-central-secretariat', 'del-pnk-lajpat-nagar'],
};

// 20. BHOPAL (2 lines, 29 stations, 1 interchange)
const bhopalStations = convertStationsToCityNetwork(BHOPAL_RAW_STATIONS, STD_VIEW_BOX);
const bhopalLines = buildMetroLinesWithPaths(BHOPAL_LINES_CONFIG, bhopalStations);
export const BHOPAL_METRO_NETWORK: CityMetroNetwork = {
  id: 'bhopal',
  name: 'Bhopal',
  hindiName: 'भोपाल',
  systemName: 'Bhopal Metro (Bhoj Metro / MPMRCL)',
  operator: 'Madhya Pradesh Metro Rail Corporation Limited',
  status: 'operational',
  tagline: 'Orange Line priority corridor and Blue Line alignment intersecting at Pul Bogda',
  state: 'Madhya Pradesh',
  description: 'Orange Line (priority section operational) and Blue Line project (under construction) with central interchange at Pul Bogda.',
  totalStations: bhopalStations.length,
  totalLines: bhopalLines.length,
  networkLengthKm: 27.87,
  dailyRidership: '25,000+',
  establishedYear: 2024,
  centerCoordinates: [23.2599, 77.4126],
  viewBox: '0 0 1000 800',
  lines: bhopalLines,
  stations: bhopalStations,
  popularStations: ['bho-org-pul-bogda', 'bho-org-subhash-nagar', 'bho-org-rani-kamalapati-railway-station', 'bho-org-aiims', 'bho-blu-jawahar-chowk'],
};

// 21. MEERUT (1 line, 12 stations, 4 interchanges)
const meerutStations = convertStationsToCityNetwork(MEERUT_RAW_STATIONS, STD_VIEW_BOX);
const meerutLines = buildMetroLinesWithPaths(MEERUT_LINES_CONFIG, meerutStations);
export const MEERUT_METRO_NETWORK: CityMetroNetwork = {
  id: 'meerut',
  name: 'Meerut',
  hindiName: 'मेरठ',
  systemName: 'Meerut Metro (NCRTC)',
  operator: 'National Capital Region Transport Corporation (NCRTC)',
  status: 'operational',
  tagline: 'High-speed urban metro line operating on dedicated RRTS infrastructure with 4 Namo Bharat interchanges',
  state: 'Uttar Pradesh',
  description: '12 operational stations from Meerut South to Modipuram with 4 integrated interchanges connecting to Delhi–Meerut Namo Bharat.',
  totalStations: meerutStations.length,
  totalLines: meerutLines.length,
  networkLengthKm: 23.6,
  dailyRidership: '40,000+',
  establishedYear: 2024,
  centerCoordinates: [28.9845, 77.7064],
  viewBox: '0 0 1000 800',
  lines: meerutLines,
  stations: meerutStations,
  popularStations: ['mee-met-begumpul', 'mee-met-meerut-south', 'mee-met-shatabdi-nagar', 'mee-met-modipuram', 'mee-met-bhaisali'],
};

// Complete National List of all 21 Operational Metro Networks in India (Summary Order)
export const CITIES_METRO_DATA: CityMetroNetwork[] = [
  AGRA_METRO_NETWORK,
  AHMEDABAD_METRO_NETWORK,
  PUNE_METRO_NETWORK,
  PATNA_METRO_NETWORK,
  NOIDA_METRO_NETWORK,
  NAVI_MUMBAI_METRO_NETWORK,
  NAGPUR_METRO_NETWORK,
  MUMBAI_METRO_NETWORK,
  LUCKNOW_METRO_NETWORK,
  KOLKATA_METRO_NETWORK,
  KOCHI_METRO_NETWORK,
  KANPUR_METRO_NETWORK,
  JAIPUR_METRO_NETWORK,
  INDORE_METRO_NETWORK,
  HYDERABAD_METRO_NETWORK,
  GURGAON_METRO_NETWORK,
  CHENNAI_METRO_NETWORK,
  BENGALURU_METRO_NETWORK,
  DELHI_METRO_NETWORK,
  BHOPAL_METRO_NETWORK,
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
  totalStations: city.totalStations || city.stations.length,
  highlightStation: city.popularStations && city.popularStations[0]
    ? city.stations.find((s) => s.id === city.popularStations?.[0])?.name || city.name
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
