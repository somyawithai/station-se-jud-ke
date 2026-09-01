import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const LUCKNOW_RAW_STATIONS: RawStationGeoData[] = [
  // Red Line (CCS Airport to Munshi Pulia)
  { id: 'luc-red-airport', name: 'Chaudhary Charan Singh International Airport', hindiName: 'चौधरी चरण सिंह इंटरनेशनल एयरपोर्ट', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.7608, longitude: 80.8835, isTerminal: true, zone: 'Amausi Aviation Core', landmark: 'Lucknow Airport Terminal 2 & 3 (LKO)', elevation: 'underground' },
  { id: 'luc-red-amausi', name: 'Amausi', hindiName: 'अमौसी', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.7725, longitude: 80.8912, zone: 'South Industrial', landmark: 'Amausi Railway Station & Industrial Area', elevation: 'elevated' },
  { id: 'luc-red-transport-nagar', name: 'Transport Nagar', hindiName: 'ट्रांसपोर्ट नगर', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.7865, longitude: 80.9025, zone: 'Logistics Hub', landmark: 'RTO Office & Lucknow Metro Depot Yard', elevation: 'elevated' },
  { id: 'luc-red-krishna-nagar', name: 'Krishna Nagar', hindiName: 'कृष्णा नगर', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.7998, longitude: 80.9085, zone: 'Kanpur Road Residential', landmark: 'Phoenix United Mall & Piccadily Hotel', elevation: 'elevated' },
  { id: 'luc-red-singar-nagar', name: 'Singar Nagar (Alambagh)', hindiName: 'सिंगार नगर', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8095, longitude: 80.9125, zone: 'Alambagh Suburbs', landmark: 'Alambagh Main Market', elevation: 'elevated' },
  { id: 'luc-red-alambagh-bus', name: 'Alambagh Bus Stand', hindiName: 'आलमबाग बस स्टैंड', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8185, longitude: 80.9185, isInterchange: true, interchangeLines: ['Red Line', 'Alambagh Inter-state Bus Terminal (ISBT)'], zone: 'Central Bus Terminal', landmark: 'Alambagh ISBT Bus Port', elevation: 'elevated' },
  { id: 'luc-red-charbagh', name: 'Charbagh Railway Station', hindiName: 'चारबाग रेलवे स्टेशन', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8325, longitude: 80.9235, isInterchange: true, interchangeLines: ['Red Line', 'Northern Railway / North Eastern Railway (LKO / LJN)'], zone: 'Historic Grand Rail Hub', landmark: 'Architectural Charbagh Railway Terminus & Ravindralaya', elevation: 'elevated' },
  { id: 'luc-red-hussainganj', name: 'Hussainganj', hindiName: 'हुसैनगंज', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8412, longitude: 80.9312, zone: 'Central City', landmark: 'Chitwapur & State Bank Local HQ', elevation: 'underground' },
  { id: 'luc-red-sachivalaya', name: 'Sachivalaya (UP Vidhan Sabha)', hindiName: 'सचिवालय (विधान सभा)', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8465, longitude: 80.9412, zone: 'Government Seat', landmark: 'Uttar Pradesh Vidhan Bhavan & Bapu Bhawan Secretariat', elevation: 'underground' },
  { id: 'luc-red-hazratganj', name: 'Hazratganj', hindiName: 'हज़रतगंज', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8524, longitude: 80.9465, zone: 'Victorian Heart of Lucknow', landmark: 'Ganj Market, Mayfair, Janpath & General Post Office', elevation: 'underground' },
  { id: 'luc-red-kdn-stadium', name: 'KD Singh Babu Stadium', hindiName: 'केडी सिंह बाबू स्टेडियम', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8585, longitude: 80.9425, zone: 'Riverfront & Sports', landmark: 'Gomti Riverfront Promenade & Historic Sports Arena', elevation: 'elevated' },
  { id: 'luc-red-vishwavidyalaya', name: 'Lucknow University (Badshahnagar)', hindiName: 'विश्वविद्यालय (बादशाहनगर)', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8712, longitude: 80.9412, zone: 'Academic North', landmark: 'University of Lucknow Main Campus & IT Crossing', elevation: 'elevated' },
  { id: 'luc-red-indira-nagar', name: 'Indira Nagar', hindiName: 'इंदिरा नगर', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8845, longitude: 80.9812, zone: 'Trans-Gomti Residential', landmark: 'Bhootnath Market & Aravalli Marg', elevation: 'elevated' },
  { id: 'luc-red-munshi-pulia', name: 'Munshi Pulia', hindiName: 'मुंशी पुलिया', cityId: 'lucknow', lineIds: ['luc-red'], latitude: 26.8925, longitude: 80.9985, isTerminal: true, zone: 'North East Gateway', landmark: 'Munshi Pulia Crossing & Ring Road Faizabad Highway', elevation: 'elevated' },
];

export const LUCKNOW_LINES_CONFIG: MetroLine[] = [
  {
    id: 'luc-red',
    name: 'Red Line (CCS Airport - Munshi Pulia)',
    hindiName: 'रेड लाइन (नॉर्थ-साउथ कॉरिडोर)',
    code: 'L1',
    color: '#EF4444',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'luc-red-airport',
      'luc-red-amausi',
      'luc-red-transport-nagar',
      'luc-red-krishna-nagar',
      'luc-red-singar-nagar',
      'luc-red-alambagh-bus',
      'luc-red-charbagh',
      'luc-red-hussainganj',
      'luc-red-sachivalaya',
      'luc-red-hazratganj',
      'luc-red-kdn-stadium',
      'luc-red-vishwavidyalaya',
      'luc-red-indira-nagar',
      'luc-red-munshi-pulia',
    ],
  },
];
