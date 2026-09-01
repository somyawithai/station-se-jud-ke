import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const BHOPAL_RAW_STATIONS: RawStationGeoData[] = [
  // Orange Line Priority Corridor (Subhash Nagar to AIIMS Bhopal)
  { id: 'bho-org-subhash-nagar', name: 'Subhash Nagar Underpass', hindiName: 'सुभाष नगर', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.2512, longitude: 77.4325, isTerminal: true, zone: 'Central Bhopal Depot Entry', landmark: 'Subhash Nagar Metro Maintenance Depot & Railway Colony', elevation: 'elevated' },
  { id: 'bho-org-kendriya-vidyalaya', name: 'Kendriya Vidyalaya (No. 1)', hindiName: 'केंद्रीय विद्यालय', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.2425, longitude: 77.4375, zone: 'Zone 1', landmark: 'KV No 1 & Board Office Link Road', elevation: 'elevated' },
  { id: 'bho-org-db-city', name: 'DB City Mall (MP Nagar)', hindiName: 'डीबी सिटी मॉल (एमपी नगर)', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.2345, longitude: 77.4398, zone: 'Commercial Heart of Bhopal', landmark: 'DB City Mall, MP Nagar Zone 1 & Press Complex', elevation: 'elevated' },
  { id: 'bho-org-mp-nagar', name: 'MP Nagar (Sargam Cinema)', hindiName: 'एमपी नगर (सरगम)', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.2268, longitude: 77.4412, zone: 'MP Nagar Zone 2', landmark: 'Sargam Cinema Crossing & Jyoti Talkies', elevation: 'elevated' },
  { id: 'bho-org-rani-kamalapati', name: 'Rani Kamalapati Railway Station', hindiName: 'रानी कमलापति रेलवे स्टेशन', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.2185, longitude: 77.4465, isInterchange: true, interchangeLines: ['Orange Line', 'World-Class Rani Kamalapati Railway Station (RKMP)'], zone: 'Flagship World-Class Rail Hub', landmark: 'India First Airport-Style World Class Railway Station', elevation: 'elevated' },
  { id: 'bho-org-bsp-habibganj', name: 'Barkatullah University (Habibganj Naka)', hindiName: 'बरकतउल्ला विश्वविद्यालय', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.2085, longitude: 77.4524, zone: 'Academic Corridor', landmark: 'Barkatullah University Main Campus', elevation: 'elevated' },
  { id: 'bho-org-saket-nagar', name: 'Saket Nagar', hindiName: 'साकेत नगर', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.2012, longitude: 77.4585, zone: 'Saket Nagar', landmark: 'AIIMS Road & Residential Colony', elevation: 'elevated' },
  { id: 'bho-org-aiims-bhopal', name: 'AIIMS Bhopal', hindiName: 'एम्स भोपाल', cityId: 'bhopal', lineIds: ['bho-orange'], latitude: 23.1952, longitude: 77.4645, isTerminal: true, zone: 'Premier Healthcare Hub', landmark: 'All India Institute of Medical Sciences (AIIMS) Bhopal Campus', elevation: 'elevated' },
];

export const BHOPAL_LINES_CONFIG: MetroLine[] = [
  {
    id: 'bho-orange',
    name: 'Orange Line Priority Corridor (Subhash Nagar - AIIMS)',
    hindiName: 'ऑरेंज लाइन (सुभाष नगर - एम्स भोपाल)',
    code: 'L1',
    color: '#EA580C',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'bho-org-subhash-nagar',
      'bho-org-kendriya-vidyalaya',
      'bho-org-db-city',
      'bho-org-mp-nagar',
      'bho-org-rani-kamalapati',
      'bho-org-bsp-habibganj',
      'bho-org-saket-nagar',
      'bho-org-aiims-bhopal',
    ],
  },
];
