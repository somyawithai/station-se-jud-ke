import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const JAIPUR_RAW_STATIONS: RawStationGeoData[] = [
  // Pink Line (Mansarovar to Badi Chaupar)
  { id: 'jai-pnk-mansarovar', name: 'Mansarovar', hindiName: 'मानसरोवर', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.8645, longitude: 75.7612, isTerminal: true, zone: 'South West', landmark: 'Mansarovar Metro Depot & Housing Board', elevation: 'elevated' },
  { id: 'jai-pnk-new-atish-mkt', name: 'New Aatish Market', hindiName: 'न्यू आतिश मार्केट', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.8785, longitude: 75.7725, zone: 'Commercial West', landmark: 'New Aatish Market & Gopalpura Bypass link', elevation: 'elevated' },
  { id: 'jai-pnk-vivek-vihar', name: 'Vivek Vihar', hindiName: 'विवेक विहार', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.8875, longitude: 75.7785, zone: 'Residential', landmark: 'Vivek Vihar Colony', elevation: 'elevated' },
  { id: 'jai-pnk-shyam-nagar', name: 'Shyam Nagar', hindiName: 'श्याम नगर', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.8942, longitude: 75.7825, zone: 'Ajmer Road', landmark: 'Ajmer Road Elevated Viaduct', elevation: 'elevated' },
  { id: 'jai-pnk-ram-nagar', name: 'Ram Nagar', hindiName: 'राम नगर', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.9012, longitude: 75.7885, zone: 'Sodala', landmark: 'Sodala Elevated Road', elevation: 'elevated' },
  { id: 'jai-pnk-civil-lines', name: 'Civil Lines (Jaipur)', hindiName: 'सिविल लाइंस', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.9085, longitude: 75.7942, zone: 'VIP Area', landmark: 'Chief Minister Residence & Raj Bhavan Vicinity', elevation: 'elevated' },
  { id: 'jai-pnk-railway-stn', name: 'Railway Station (Jaipur Junction)', hindiName: 'रेलवे स्टेशन (जयपुर जंक्शन)', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.9185, longitude: 75.7885, isInterchange: true, interchangeLines: ['Pink Line', 'North Western Railway (JP)'], zone: 'Major Rail Gateway', landmark: 'Jaipur Central Railway Junction', elevation: 'elevated' },
  { id: 'jai-pnk-sindhi-camp', name: 'Sindhi Camp (ISBT)', hindiName: 'सिंधी कैंप बस स्टैंड', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.9245, longitude: 75.7998, isInterchange: true, interchangeLines: ['Pink Line', 'Sindhi Camp Central Bus Stand'], zone: 'Central Bus Terminal', landmark: 'RSRTC Inter-state Bus Terminal Sindhi Camp', elevation: 'elevated' },
  { id: 'jai-pnk-chandpole', name: 'Chandpole Gate', hindiName: 'चांदपोल गेट', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.9285, longitude: 75.8112, zone: 'Walled Pink City Entry', landmark: 'Historic Chandpole Heritage Darwaza', elevation: 'underground' },
  { id: 'jai-pnk-chhoti-chaupar', name: 'Chhoti Chaupar', hindiName: 'छोटी चौपड़', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.9242, longitude: 75.8215, zone: 'Heritage Pink City Core', landmark: 'Tripolia Bazaar, Kishanpole & City Palace link', elevation: 'underground' },
  { id: 'jai-pnk-badi-chaupar', name: 'Badi Chaupar (Hawa Mahal)', hindiName: 'बड़ी चौपड़ (हवा महल)', cityId: 'jaipur', lineIds: ['jai-pink'], latitude: 26.9235, longitude: 75.8275, isTerminal: true, zone: 'UNESCO World Heritage Core', landmark: 'World Heritage Hawa Mahal, Jantar Mantar & Johari Bazaar', elevation: 'underground' },
];

export const JAIPUR_LINES_CONFIG: MetroLine[] = [
  {
    id: 'jai-pink',
    name: 'Pink Line (Mansarovar - Badi Chaupar)',
    hindiName: 'पिंक लाइन (मानसरोवर - बड़ी चौपड़)',
    code: 'PL',
    color: '#EC4899',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'jai-pnk-mansarovar',
      'jai-pnk-new-atish-mkt',
      'jai-pnk-vivek-vihar',
      'jai-pnk-shyam-nagar',
      'jai-pnk-ram-nagar',
      'jai-pnk-civil-lines',
      'jai-pnk-railway-stn',
      'jai-pnk-sindhi-camp',
      'jai-pnk-chandpole',
      'jai-pnk-chhoti-chaupar',
      'jai-pnk-badi-chaupar',
    ],
  },
];
