import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const GURUGRAM_RAW_STATIONS: RawStationGeoData[] = [
  // Rapid Metro Loop (Sector 55-56 to DLF Phase 3 / Cyber City)
  { id: 'gur-rap-sec-55-56', name: 'Sector 55-56 (Golf Course Road)', hindiName: 'सेक्टर 55-56', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4285, longitude: 77.1085, isTerminal: true, zone: 'Golf Course Extension', landmark: 'Golf Course Extension Road & Grand Arch', elevation: 'elevated' },
  { id: 'gur-rap-sec-54-chowk', name: 'Sector 54 Chowk', hindiName: 'सेक्टर 54 चौक', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4412, longitude: 77.1012, zone: 'Luxury Golf Course Road', landmark: 'DLF The Aralias & The Magnolias', elevation: 'elevated' },
  { id: 'gur-rap-sec-53-54', name: 'Sector 53-54', hindiName: 'सेक्टर 53-54', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4525, longitude: 77.0985, zone: 'Golf Course Road', landmark: 'One Horizon Center & South Point Mall', elevation: 'elevated' },
  { id: 'gur-rap-sec-42-43', name: 'Sector 42-43', hindiName: 'सेक्टर 42-43', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4612, longitude: 77.0954, zone: 'Golf Course Road North', landmark: 'DLF Golf and Country Club & Global Foyer', elevation: 'elevated' },
  { id: 'gur-rap-sikanderpur', name: 'Sikanderpur Rapid Metro', hindiName: 'सिकंदरपुर रैपिड मेट्रो', cityId: 'gurugram', lineIds: ['gur-rapid', 'delhi-yellow'], latitude: 28.4821, longitude: 77.0929, isInterchange: true, interchangeLines: ['Gurugram Rapid Metro', 'Delhi Metro Yellow Line (DMRC)'], zone: 'Major Transit Interchange', landmark: 'Direct elevated walkway to DMRC Yellow Line', elevation: 'elevated' },
  { id: 'gur-rap-dlf-phase-2', name: 'DLF Phase 2', hindiName: 'डीएलएफ फेज 2', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4912, longitude: 77.0905, zone: 'Cyber City South', landmark: 'DLF Phase 2 Residential & Cyber Hub Entry', elevation: 'elevated' },
  { id: 'gur-rap-belvedere-towers', name: 'Belvedere Towers', hindiName: 'बेलवेडियर टावर्स', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4965, longitude: 77.0875, zone: 'Cyber City Core', landmark: 'Cyber City Building 9 & Belvedere Park', elevation: 'elevated' },
  { id: 'gur-rap-cyber-city', name: 'Cyber City (DLF CyberHub)', hindiName: 'साइबर सिटी (डीएलएफ साइबर हब)', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4985, longitude: 77.0898, zone: 'Fortune 500 Tech Hub', landmark: 'DLF CyberHub Food Lounge & Infinity Towers', elevation: 'elevated' },
  { id: 'gur-rap-moulsari-ave', name: 'Moulsari Avenue', hindiName: 'मौलसरी एवेन्यू', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.5025, longitude: 77.0954, zone: 'Ambience Island', landmark: 'Ambience Mall Gurugram & Leela Hotel', elevation: 'elevated' },
  { id: 'gur-rap-dlf-phase-3', name: 'DLF Phase 3', hindiName: 'डीएलएफ फेज 3', cityId: 'gurugram', lineIds: ['gur-rapid'], latitude: 28.4952, longitude: 77.0975, isTerminal: true, zone: 'Cyber City North Loop', landmark: 'Udyog Vihar Link & RBS Office', elevation: 'elevated' },
];

export const GURUGRAM_LINES_CONFIG: MetroLine[] = [
  {
    id: 'gur-rapid',
    name: 'Rapid Metro Gurugram Loop',
    hindiName: 'रैपिड मेट्रो गुरुग्राम लूप',
    code: 'RM',
    color: '#0D9488',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'gur-rap-sec-55-56',
      'gur-rap-sec-54-chowk',
      'gur-rap-sec-53-54',
      'gur-rap-sec-42-43',
      'gur-rap-sikanderpur',
      'gur-rap-dlf-phase-2',
      'gur-rap-belvedere-towers',
      'gur-rap-cyber-city',
      'gur-rap-moulsari-ave',
      'gur-rap-dlf-phase-3',
    ],
  },
];
