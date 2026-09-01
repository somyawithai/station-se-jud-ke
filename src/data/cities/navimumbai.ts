import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const NAVI_MUMBAI_RAW_STATIONS: RawStationGeoData[] = [
  // Line 1 (CBD Belapur to Pendhar)
  { id: 'nvm-l1-belapur', name: 'CBD Belapur', hindiName: 'सीबीडी बेलापुर', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0185, longitude: 73.0412, isTerminal: true, isInterchange: true, interchangeLines: ['Line 1 (CIDCO)', 'Harbour Line Suburban Railway'], zone: 'Navi Mumbai CBD', landmark: 'CBD Belapur Railway Station, CIDCO Bhavan & RBI Belapur', elevation: 'elevated' },
  { id: 'nvm-l1-sec-7-belapur', name: 'Sector 7 Belapur', hindiName: 'सेक्टर 7 बेलापुर', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0265, longitude: 73.0465, zone: 'Belapur East', landmark: 'Kharghar Creek Bridge Approach', elevation: 'elevated' },
  { id: 'nvm-l1-cidco-sci-park', name: 'CIDCO Science Park (Kharghar)', hindiName: 'सिडको साइंस पार्क (खारघर)', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0345, longitude: 73.0612, zone: 'Kharghar Node Entry', landmark: 'CIDCO Science Park & Utsav Chowk entrance', elevation: 'elevated' },
  { id: 'nvm-l1-utsav-chowk', name: 'Utsav Chowk', hindiName: 'उत्सव चौक', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0412, longitude: 73.0685, zone: 'Kharghar Monumental Core', landmark: 'Iconic Roman Architecture Utsav Chowk & Little World Mall', elevation: 'elevated' },
  { id: 'nvm-l1-sec-11-kharghar', name: 'Sector 11 Kharghar', hindiName: 'सेक्टर 11 खारघर', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0485, longitude: 73.0725, zone: 'Residential Heart', landmark: 'NIFT National Institute of Fashion Technology & Bharati Vidyapeeth', elevation: 'elevated' },
  { id: 'nvm-l1-sec-14-kharghar', name: 'Sector 14 Kharghar', hindiName: 'सेक्टर 14 खारघर', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0552, longitude: 73.0745, zone: 'Central Park North', landmark: 'Kharghar Valley Golf Course & Central Park (Asia Largest)', elevation: 'elevated' },
  { id: 'nvm-l1-central-park', name: 'Central Park (Kharghar)', hindiName: 'सेंट्रल पार्क (खारघर)', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0625, longitude: 73.0724, zone: 'Recreation & Culture', landmark: 'ISKCON Temple Kharghar & CIDCO Central Park Gate', elevation: 'elevated' },
  { id: 'nvm-l1-pethapada', name: 'Pethapada (Sector 34)', hindiName: 'पेठपाड़ा (सेक्टर 34)', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0712, longitude: 73.0705, zone: 'North Kharghar', landmark: 'Sector 34 High-rises & Pandavkada Waterfalls backdrop', elevation: 'elevated' },
  { id: 'nvm-l1-sec-34', name: 'Sector 34 Kharghar', hindiName: 'सेक्टर 34', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0798, longitude: 73.0745, zone: 'Taloja Connector', landmark: 'Taloja River Bridge', elevation: 'elevated' },
  { id: 'nvm-l1-panchanand', name: 'Panchanand (Taloja)', hindiName: 'पंचानंद (तलोजा)', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0885, longitude: 73.0825, zone: 'Taloja Node', landmark: 'Taloja Phase 1 Housing', elevation: 'elevated' },
  { id: 'nvm-l1-pendhar', name: 'Pendhar (Taloja MIDC)', hindiName: 'पेणधर (तलोजा)', cityId: 'navi-mumbai', lineIds: ['nvm-line-1'], latitude: 19.0985, longitude: 73.0912, isTerminal: true, zone: 'Industrial & Depot End', landmark: 'Pendhar Metro Car Depot & Taloja MIDC Industrial Hub', elevation: 'elevated' },
];

export const NAVI_MUMBAI_LINES_CONFIG: MetroLine[] = [
  {
    id: 'nvm-line-1',
    name: 'Line 1 (CBD Belapur - Pendhar)',
    hindiName: 'लाइन 1 (सीबीडी बेलापुर - पेणधर)',
    code: 'L1',
    color: '#0284C7',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'nvm-l1-belapur',
      'nvm-l1-sec-7-belapur',
      'nvm-l1-cidco-sci-park',
      'nvm-l1-utsav-chowk',
      'nvm-l1-sec-11-kharghar',
      'nvm-l1-sec-14-kharghar',
      'nvm-l1-central-park',
      'nvm-l1-pethapada',
      'nvm-l1-sec-34',
      'nvm-l1-panchanand',
      'nvm-l1-pendhar',
    ],
  },
];
