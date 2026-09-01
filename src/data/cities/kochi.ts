import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const KOCHI_RAW_STATIONS: RawStationGeoData[] = [
  // Blue Line (Aluva to Thripunithura)
  { id: 'koc-blu-aluva', name: 'Aluva', hindiName: 'अलुवा', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 10.1098, longitude: 76.3542, isTerminal: true, zone: 'North Gateway', landmark: 'Periyar River & Aluva Manappuram Mahadeva Temple', elevation: 'elevated' },
  { id: 'koc-blu-pulinchodu', name: 'Pulinchodu', hindiName: 'पुलिंचोडु', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 10.0982, longitude: 76.3485, zone: 'Aluva South', landmark: 'NH-544 Kochi Bypass', elevation: 'elevated' },
  { id: 'koc-blu-companypady', name: 'Companypady', hindiName: 'कम्पनीपडी', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 10.0865, longitude: 76.3412, zone: 'Industrial Corridor', landmark: 'Premier Tyres & FACT Industrial Belt', elevation: 'elevated' },
  { id: 'koc-blu-ambattukavu', name: 'Ambattukavu', hindiName: 'अम्बट्टुकावु', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 10.0765, longitude: 76.3365, zone: 'Residential Corridor', landmark: 'Muttom Metro Yard Link', elevation: 'elevated' },
  { id: 'koc-blu-kalamassery', name: 'Kalamassery', hindiName: 'कलमश्शेरी', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 10.0542, longitude: 76.3215, zone: 'Education & Industry', landmark: 'CUSAT Cochin University of Science and Technology', elevation: 'elevated' },
  { id: 'koc-blu-edapally', name: 'Edapally', hindiName: 'इडपल्ली', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 10.0245, longitude: 76.3085, zone: 'Major Commercial Junction', landmark: 'LuLu Mall Kochi (Largest Mall in Kerala) & St. George Forane Church', elevation: 'elevated' },
  { id: 'koc-blu-palarivattom', name: 'Palarivattom (JLN Stadium)', hindiName: 'पलरिवट्टम (जेएलएन स्टेडियम)', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 10.0035, longitude: 76.3005, zone: 'Sports Precinct', landmark: 'Jawaharlal Nehru International Stadium (ISL Football Hub)', elevation: 'elevated' },
  { id: 'koc-blu-mg-road', name: 'M.G. Road (Kochi)', hindiName: 'एम.जी. रोड (कोच्चि)', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9725, longitude: 76.2845, zone: 'Commercial CBD', landmark: 'Centre Square Mall & Shenoys Junction', elevation: 'elevated' },
  { id: 'koc-blu-maharajas', name: 'Maharajas College', hindiName: 'महाराजा कॉलेज', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9685, longitude: 76.2852, zone: 'Heritage Education', landmark: 'Maharajas College Ground, Ernakulam Shiva Temple & Subhash Park', elevation: 'elevated' },
  { id: 'koc-blu-ernakulam-south', name: 'Ernakulam South (Railway)', hindiName: 'एर्नाकुलम साउथ', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9642, longitude: 76.2912, isInterchange: true, interchangeLines: ['Blue Line', 'Ernakulam Junction Railway Station (ERS)'], zone: 'Central Rail Gateway', landmark: 'Ernakulam Junction Railway Station & KSRTC Bus Stand', elevation: 'elevated' },
  { id: 'koc-blu-kadavanthra', name: 'Kadavanthra', hindiName: 'कडवन्त्रा', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9658, longitude: 76.3012, zone: 'Central Residential', landmark: 'Rajiv Gandhi Indoor Stadium & GCDA Complex', elevation: 'elevated' },
  { id: 'koc-blu-elamkulam', name: 'Elamkulam', hindiName: 'इलमकुलम', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9678, longitude: 76.3125, zone: 'SA Road Corridor', landmark: 'Giri Nagar & Chilavannoor Lake', elevation: 'elevated' },
  { id: 'koc-blu-vytilla', name: 'Vyttila Mobility Hub', hindiName: 'वाइटिला मोबिलिटी हब', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9665, longitude: 76.3218, isInterchange: true, interchangeLines: ['Blue Line', 'Kochi Water Metro Boat Terminal', 'KSRTC / Inter-state Bus Terminal'], zone: 'India Largest Multi-modal Transport Hub', landmark: 'Vyttila Mobility Hub, Kochi Water Metro ferry jetty & Kaniampuzha River', elevation: 'elevated' },
  { id: 'koc-blu-pettah', name: 'Pettah', hindiName: 'पेट्टा', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9542, longitude: 76.3395, zone: 'East Gateway', landmark: 'Pettah Bridge & Thripunithura Entry', elevation: 'elevated' },
  { id: 'koc-blu-thripunithura', name: 'Thripunithura (Terminal)', hindiName: 'त्रिपुनिथुरा', cityId: 'kochi', lineIds: ['koc-blue'], latitude: 9.9472, longitude: 76.3485, isTerminal: true, isInterchange: true, interchangeLines: ['Blue Line', 'Thripunithura Railway Station (TRTR)'], zone: 'Royal Heritage Town', landmark: 'Hill Palace Museum, Sree Poornathrayeesa Temple & Thripunithura Station', elevation: 'elevated' },
];

export const KOCHI_LINES_CONFIG: MetroLine[] = [
  {
    id: 'koc-blue',
    name: 'Blue Line (Aluva - Thripunithura)',
    hindiName: 'ब्लू लाइन (अलुवा - त्रिपुनिथुरा)',
    code: 'L1',
    color: '#0284C7',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'koc-blu-aluva',
      'koc-blu-pulinchodu',
      'koc-blu-companypady',
      'koc-blu-ambattukavu',
      'koc-blu-kalamassery',
      'koc-blu-edapally',
      'koc-blu-palarivattom',
      'koc-blu-mg-road',
      'koc-blu-maharajas',
      'koc-blu-ernakulam-south',
      'koc-blu-kadavanthra',
      'koc-blu-elamkulam',
      'koc-blu-vytilla',
      'koc-blu-pettah',
      'koc-blu-thripunithura',
    ],
  },
];
