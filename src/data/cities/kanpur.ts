import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const KANPUR_RAW_STATIONS: RawStationGeoData[] = [
  // Orange Line (IIT Kanpur to Kanpur Central Railway Station)
  { id: 'kan-org-iitk', name: 'IIT Kanpur', hindiName: 'आईआईटी कानपुर', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.5123, longitude: 80.2329, isTerminal: true, zone: 'Kalyanpur West', landmark: 'Indian Institute of Technology Kanpur (Main Gate)', elevation: 'elevated' },
  { id: 'kan-org-kalyanpur', name: 'Kalyanpur', hindiName: 'कल्याणपुर', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4952, longitude: 80.2584, zone: 'Kalyanpur', landmark: 'Kalyanpur Railway Station & GT Road', elevation: 'elevated' },
  { id: 'kan-org-spm-hospital', name: 'SPM Hospital', hindiName: 'एसपीएम अस्पताल', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4889, longitude: 80.2715, zone: 'Kalyanpur East', landmark: 'Shyam Bihari & SPM Hospital', elevation: 'elevated' },
  { id: 'kan-org-csjmu', name: 'CSJM University (Kanpur University)', hindiName: 'सीएसजेएम यूनिवर्सिटी', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4784, longitude: 80.2825, zone: 'Education Corridor', landmark: 'Chhatrapati Shahu Ji Maharaj University Main Gate', elevation: 'elevated' },
  { id: 'kan-org-gurudev', name: 'Gurudev Chauraha', hindiName: 'गुरुदेव चौराहा', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4712, longitude: 80.2941, zone: 'Sharda Nagar', landmark: 'Gurudev Palace Cinema & GT Road Crossing', elevation: 'elevated' },
  { id: 'kan-org-geeta-nagar', name: 'Geeta Nagar', hindiName: 'गीता नगर', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4682, longitude: 80.3015, zone: 'Kakadeo Area', landmark: 'Coaching Hub of Kanpur & Rawatpur link', elevation: 'elevated' },
  { id: 'kan-org-rawatpur', name: 'Rawatpur', hindiName: 'रावतपुर', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4725, longitude: 80.3098, zone: 'Rawatpur', landmark: 'Rawatpur Railway Station & Moti Jheel entry', elevation: 'elevated' },
  { id: 'kan-org-lala-lajpat', name: 'Lala Lajpat Rai Hospital (Hallet)', hindiName: 'एलएलआर अस्पताल (हैलट)', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4754, longitude: 80.3168, zone: 'Medical College Zone', landmark: 'GSVM Medical College & Hallet Hospital', elevation: 'elevated' },
  { id: 'kan-org-motijheel', name: 'Moti Jheel', hindiName: 'मोती झील', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4795, longitude: 80.3242, zone: 'City Center', landmark: 'Kanpur Municipal Corporation (KMC) & Moti Jheel Park', elevation: 'elevated' },
  { id: 'kan-org-chunniganj', name: 'Chunniganj', hindiName: 'चुन्नीगंज', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4762, longitude: 80.3385, zone: 'Commercial Hub', landmark: 'Bada Chauraha Link & City Bus Terminal', elevation: 'underground' },
  { id: 'kan-org-naveen-market', name: 'Naveen Market', hindiName: 'नवीन मार्केट', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4712, longitude: 80.3475, zone: 'CBD', landmark: 'Naveen Market & Som Dutt Plaza', elevation: 'underground' },
  { id: 'kan-org-bada-chauraha', name: 'Bada Chauraha', hindiName: 'बड़ा चौराहा', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4665, longitude: 80.3542, zone: 'Heart of Kanpur', landmark: 'Z-Square Mall & Phool Bagh', elevation: 'underground' },
  { id: 'kan-org-nayaganj', name: 'Nayaganj', hindiName: 'नयागंज', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4612, longitude: 80.3585, zone: 'Wholesale Market', landmark: 'Historic Wholesale Grain & Metal Markets', elevation: 'underground' },
  { id: 'kan-org-kanpur-central', name: 'Kanpur Central Railway Station', hindiName: 'कानपुर सेंट्रल रेलवे स्टेशन', cityId: 'kanpur', lineIds: ['kan-orange'], latitude: 26.4538, longitude: 80.3524, isTerminal: true, isInterchange: true, interchangeLines: ['Orange Line', 'Indian Railways North Central (CNB)'], zone: 'Major Rail Gateway', landmark: 'Kanpur Central Railway Station & Cantt Entrance', elevation: 'underground' },
];

export const KANPUR_LINES_CONFIG: MetroLine[] = [
  {
    id: 'kan-orange',
    name: 'Orange Line (IIT Kanpur - Kanpur Central)',
    hindiName: 'ऑरेंज लाइन (प्राथमिकता कॉरिडोर)',
    code: 'L1',
    color: '#EA580C',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'kan-org-iitk',
      'kan-org-kalyanpur',
      'kan-org-spm-hospital',
      'kan-org-csjmu',
      'kan-org-gurudev',
      'kan-org-geeta-nagar',
      'kan-org-rawatpur',
      'kan-org-lala-lajpat',
      'kan-org-motijheel',
      'kan-org-chunniganj',
      'kan-org-naveen-market',
      'kan-org-bada-chauraha',
      'kan-org-nayaganj',
      'kan-org-kanpur-central',
    ],
  },
];
