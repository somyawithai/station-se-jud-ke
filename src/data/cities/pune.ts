import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const PUNE_RAW_STATIONS: RawStationGeoData[] = [
  // Purple Line 1 (PCMC Bhavan to Swargate)
  { id: 'pun-pur-pcmc', name: 'PCMC Bhavan (Pimpri)', hindiName: 'पीसीएमसी भवन (पिंपरी)', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.6285, longitude: 73.8012, isTerminal: true, zone: 'Pimpri Chinchwad Industrial Twin City', landmark: 'PCMC Municipal Corporation HQ & Mumbai-Pune Old Highway', elevation: 'elevated' },
  { id: 'pun-pur-sant-tukaram', name: 'Sant Tukaram Nagar', hindiName: 'संत तुकाराम नगर', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.6185, longitude: 73.8185, zone: 'Vallabh Nagar', landmark: 'Dr. D.Y. Patil Medical College & Vallabh Nagar Bus Stand', elevation: 'elevated' },
  { id: 'pun-pur-bhosari', name: 'Bhosari (Nashik Phata)', hindiName: 'भोसरी (नाशिक फाटा)', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.6085, longitude: 73.8295, zone: 'Nashik Phata Junction', landmark: 'Kasarwadi Railway Station & Multi-level Flyover', elevation: 'elevated' },
  { id: 'pun-pur-kasarwadi', name: 'Kasarwadi', hindiName: 'कासारवाडी', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.5985, longitude: 73.8342, zone: 'Industrial Corridor', landmark: 'Century Enka & Forbes Marshall', elevation: 'elevated' },
  { id: 'pun-pur-dapodi', name: 'Dapodi', hindiName: 'दापोडी', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.5852, longitude: 73.8398, zone: 'Military & Engineering', landmark: 'College of Military Engineering (CME) & Pavana River', elevation: 'elevated' },
  { id: 'pun-pur-bopodi', name: 'Bopodi', hindiName: 'बोपोडी', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.5712, longitude: 73.8425, zone: 'Pune City Entry', landmark: 'Harris Bridge & Aundh Road link', elevation: 'elevated' },
  { id: 'pun-pur-shivajinagar', name: 'Shivajinagar Metro', hindiName: 'शिवाजीनगर', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.5312, longitude: 73.8505, isInterchange: true, interchangeLines: ['Purple Line', 'Shivajinagar Railway Station', 'MSRTC Shivajinagar Bus Stand'], zone: 'Central Pune Transit Hub', landmark: 'Shivajinagar Court, College of Agriculture & Sancheti Hospital', elevation: 'underground' },
  { id: 'pun-pur-civil-court', name: 'Civil Court Interchange', hindiName: 'सिविल कोर्ट (मल्टी-लेवल इंटरचेंज)', cityId: 'pune', lineIds: ['pun-purple', 'pun-aqua'], latitude: 18.5275, longitude: 73.8582, isInterchange: true, interchangeLines: ['Purple Line (North-South)', 'Aqua Line (East-West)'], zone: 'Flagship Interchange Hub of Pune', landmark: 'Pune District Court, COEP Technological University & Sangam Bridge', elevation: 'underground' },
  { id: 'pun-pur-budhwar-peth', name: 'Budhwar Peth (Kasba Peth)', hindiName: 'बुधवार पेठ (कसबा पेठ)', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.5185, longitude: 73.8562, zone: 'Historic Heritage Old Pune', landmark: 'Shrimant Dagdusheth Halwai Ganpati Temple & Shaniwar Wada', elevation: 'underground' },
  { id: 'pun-pur-mandai', name: 'Mandai', hindiName: 'मंडई', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.5112, longitude: 73.8558, zone: 'Core Heritage Market', landmark: 'Mahatma Phule Mandai Market & Tulshibaug', elevation: 'underground' },
  { id: 'pun-pur-swargate', name: 'Swargate', hindiName: 'स्वारगेट', cityId: 'pune', lineIds: ['pun-purple'], latitude: 18.5012, longitude: 73.8585, isTerminal: true, isInterchange: true, interchangeLines: ['Purple Line', 'Swargate MSRTC Central Bus Station'], zone: 'South Gateway Hub', landmark: 'Swargate Multi-modal Transport Hub & Sarasbaug', elevation: 'underground' },

  // Aqua Line 2 (Vanaz to Ramwadi)
  { id: 'pun-aqu-vanaz', name: 'Vanaz (Kothrud)', hindiName: 'वनाझ (कोथरुड)', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5045, longitude: 73.7985, isTerminal: true, zone: 'Kothrud West', landmark: 'Vanaz Engineers, Paud Road & Chandani Chowk link', elevation: 'elevated' },
  { id: 'pun-aqu-ideal-colony', name: 'Ideal Colony', hindiName: 'आइडियल कॉलोनी', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5078, longitude: 73.8112, zone: 'Kothrud', landmark: 'MIT World Peace University vicinity', elevation: 'elevated' },
  { id: 'pun-aqu-nal-stop', name: 'Nal Stop', hindiName: 'नल स्टॉप', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5098, longitude: 73.8265, zone: 'Erandwane', landmark: 'Karve Road Double Decker Flyover & SNDT Women University', elevation: 'elevated' },
  { id: 'pun-aqu-garware', name: 'Garware College', hindiName: 'गरवारे कॉलेज', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5142, longitude: 73.8375, zone: 'Deccan Gymkhana West', landmark: 'MES Abasaheb Garware College & Karve Road', elevation: 'elevated' },
  { id: 'pun-aqu-deccan', name: 'Deccan Gymkhana', hindiName: 'डेक्कन जिमखाना', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5185, longitude: 73.8445, zone: 'Cultural Precinct', landmark: 'Fergusson College Road, Sambhaji Park & FC Road Cafes', elevation: 'elevated' },
  { id: 'pun-aqu-mangalaver', name: 'Pune Railway Station (Mangalwar Peth)', hindiName: 'पुणे रेलवे स्टेशन', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5285, longitude: 73.8712, isInterchange: true, interchangeLines: ['Aqua Line', 'Pune Junction Railway Station (PUNE)'], zone: 'Major Rail Gateway', landmark: 'Pune Central Railway Station & Sassoon General Hospital', elevation: 'elevated' },
  { id: 'pun-aqu-ruby-hall', name: 'Ruby Hall Clinic', hindiName: 'रूबी हॉल क्लिनिक', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5312, longitude: 73.8798, zone: 'Medical Hub', landmark: 'Ruby Hall Hospital & Jehangir Hospital', elevation: 'elevated' },
  { id: 'pun-aqu-bund-garden', name: 'Bund Garden', hindiName: 'बंड गार्डन', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5375, longitude: 73.8865, zone: 'Mula-Mutha Riverfront', landmark: 'Bund Garden & Fitzgerald Bridge', elevation: 'elevated' },
  { id: 'pun-aqu-yerwada', name: 'Yerwada', hindiName: 'येरवडा', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5465, longitude: 73.8925, zone: 'Yerwada Bridge', landmark: 'Yerwada Central Jail & Deccan College', elevation: 'elevated' },
  { id: 'pun-aqu-kalyani-nagar', name: 'Kalyani Nagar', hindiName: 'कल्याणी नगर', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5512, longitude: 73.9056, zone: 'Upscale & Tech Hub', landmark: 'Marigold Complex & Trump Towers Pune', elevation: 'elevated' },
  { id: 'pun-aqu-ramwadi', name: 'Ramwadi (Viman Nagar)', hindiName: 'रामवाडी (विमान नगर)', cityId: 'pune', lineIds: ['pun-aqua'], latitude: 18.5562, longitude: 73.9185, isTerminal: true, zone: 'East IT & Airport Gateway', landmark: 'Phoenix Marketcity, Viman Nagar & Pune Airport road', elevation: 'elevated' },
];

export const PUNE_LINES_CONFIG: MetroLine[] = [
  {
    id: 'pun-purple',
    name: 'Purple Line (PCMC Bhavan - Swargate)',
    hindiName: 'पर्पल लाइन (पिंपरी - स्वारगेट)',
    code: 'L1',
    color: '#9333EA',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'pun-pur-pcmc',
      'pun-pur-sant-tukaram',
      'pun-pur-bhosari',
      'pun-pur-kasarwadi',
      'pun-pur-dapodi',
      'pun-pur-bopodi',
      'pun-pur-shivajinagar',
      'pun-pur-civil-court',
      'pun-pur-budhwar-peth',
      'pun-pur-mandai',
      'pun-pur-swargate',
    ],
  },
  {
    id: 'pun-aqua',
    name: 'Aqua Line (Vanaz - Ramwadi)',
    hindiName: 'एक्वा लाइन (वनाझ - रामवाडी)',
    code: 'L2',
    color: '#06B6D4',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'pun-aqu-vanaz',
      'pun-aqu-ideal-colony',
      'pun-aqu-nal-stop',
      'pun-aqu-garware',
      'pun-aqu-deccan',
      'pun-pur-civil-court',
      'pun-aqu-mangalaver',
      'pun-aqu-ruby-hall',
      'pun-aqu-bund-garden',
      'pun-aqu-yerwada',
      'pun-aqu-kalyani-nagar',
      'pun-aqu-ramwadi',
    ],
  },
];
