import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const NAGPUR_RAW_STATIONS: RawStationGeoData[] = [
  // Orange Line (Automotive Square to Khapri / Metro City)
  { id: 'nag-org-auto-sq', name: 'Automotive Square', hindiName: 'ऑटोमोटिव चौक', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.2045, longitude: 79.0885, isTerminal: true, zone: 'North Nagpur', landmark: 'Kamptee Road & Industrial Area', elevation: 'elevated' },
  { id: 'nag-org-nari-rd', name: 'Nari Road', hindiName: 'नारी रोड', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.1925, longitude: 79.0875, zone: 'North Nagpur', landmark: 'Uppalwadi Industrial Area', elevation: 'elevated' },
  { id: 'nag-org-kadbi-sq', name: 'Kadbi Chowk', hindiName: 'कड़बी चौक', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.1712, longitude: 79.0862, zone: 'Central North', landmark: 'Dr. Babasaheb Ambedkar Hospital', elevation: 'elevated' },
  { id: 'nag-org-gaddi-godam', name: 'Gaddi Godam Square', hindiName: 'गड्डी गोदाम चौक', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.1612, longitude: 79.0825, zone: 'Central North', landmark: 'Multi-layer Flyover & Railway Overbridge', elevation: 'elevated' },
  { id: 'nag-org-sitabuldi', name: 'Sitabuldi Interchange', hindiName: 'सीताबर्डी (इंटरचेंज)', cityId: 'nagpur', lineIds: ['nag-orange', 'nag-aqua'], latitude: 21.1458, longitude: 79.0824, isInterchange: true, interchangeLines: ['Orange Line (North-South)', 'Aqua Line (East-West)'], zone: 'Heart of Nagpur', landmark: 'Sitabuldi Fort, Zero Mile Stone & Main Commercial Market', elevation: 'elevated' },
  { id: 'nag-org-zero-mile', name: 'Zero Mile Freedom Park', hindiName: 'ज़ीरो माइल फ्रीडम पार्क', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.1492, longitude: 79.0798, zone: 'Geographic Center of India', landmark: 'Historic Zero Mile Stone (Center of India) & Freedom Park 20-story building', elevation: 'elevated' },
  { id: 'nag-org-rahate-colony', name: 'Rahate Colony', hindiName: 'रहाटे कॉलोनी', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 19.98 > 10 ? 21.1285 : 21.1285, longitude: 79.0765, zone: 'Wardha Road', landmark: 'Ajni Railway Station Link & Cripps Mission Rd', elevation: 'elevated' },
  { id: 'nag-org-chhatrapati-sq', name: 'Chhatrapati Square', hindiName: 'छत्रपति चौक', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.1125, longitude: 79.0685, zone: 'Wardha Road Corridor', landmark: 'Ring Road Junction', elevation: 'elevated' },
  { id: 'nag-org-airport', name: 'Airport Metro Station (Dr. Babasaheb Ambedkar)', hindiName: 'नागपुर एयरपोर्ट', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.0925, longitude: 79.0612, zone: 'Aviation Precinct', landmark: 'Dr. Babasaheb Ambedkar International Airport (NAG)', elevation: 'elevated' },
  { id: 'nag-org-airport-south', name: 'Airport South (MIHAN Gateway)', hindiName: 'एयरपोर्ट साउथ', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.0805, longitude: 79.0578, zone: 'MIHAN SEZ North', landmark: 'MIHAN Multi-modal International Cargo Hub', elevation: 'at-grade' },
  { id: 'nag-org-khapri', name: 'Khapri (Metro City)', hindiName: 'खापरी', cityId: 'nagpur', lineIds: ['nag-orange'], latitude: 21.0565, longitude: 79.0498, isTerminal: true, zone: 'MIHAN SEZ South', landmark: 'AIIMS Nagpur, IIM Nagpur & TCS MIHAN Campus', elevation: 'at-grade' },

  // Aqua Line (Prajapati Nagar to Lokmanya Nagar)
  { id: 'nag-aqu-prajapati-nagar', name: 'Prajapati Nagar', hindiName: 'प्रजापति नगर', cityId: 'nagpur', lineIds: ['nag-aqua'], latitude: 21.1565, longitude: 79.1485, isTerminal: true, zone: 'East Nagpur', landmark: 'Old Pardi Naka & Bhandara Road', elevation: 'elevated' },
  { id: 'nag-aqu-itwari', name: 'Netaji Market (Itwari)', hindiName: 'नेताजी मार्केट (इतवारी)', cityId: 'nagpur', lineIds: ['nag-aqua'], latitude: 21.1524, longitude: 79.1245, zone: 'Traditional Trading Hub', landmark: 'Itwari Wholesale Cloth & Spice Market', elevation: 'elevated' },
  { id: 'nag-aqu-agrasen-sq', name: 'Agrasen Chowk', hindiName: 'अग्रसेन चौक', cityId: 'nagpur', lineIds: ['nag-aqua'], latitude: 21.1512, longitude: 79.1085, zone: 'Gandhibagh', landmark: 'Gandhibagh Garden & Empress City', elevation: 'elevated' },
  { id: 'nag-aqu-jhansi-rani-sq', name: 'Jhansi Rani Square', hindiName: 'झांसी रानी चौक', cityId: 'nagpur', lineIds: ['nag-aqua'], latitude: 21.1412, longitude: 79.0712, zone: 'Dharampeth', landmark: 'Dharampeth Main Shopping Street', elevation: 'elevated' },
  { id: 'nag-aqu-institution-eng', name: 'Institution of Engineers', hindiName: 'इंस्टीट्यूशन ऑफ इंजीनियर्स', cityId: 'nagpur', lineIds: ['nag-aqua'], latitude: 21.1375, longitude: 79.0612, zone: 'North Ambazari', landmark: 'VNIT Nagpur Campus & LAD College', elevation: 'elevated' },
  { id: 'nag-aqu-subhash-nagar', name: 'Subhash Nagar (Ambazari)', hindiName: 'सुभाष नगर', cityId: 'nagpur', lineIds: ['nag-aqua'], latitude: 21.1312, longitude: 79.0485, zone: 'Ambazari Lake Precinct', landmark: 'Ambazari Lake & Garden', elevation: 'elevated' },
  { id: 'nag-aqu-lokmanya-nagar', name: 'Lokmanya Nagar (Hingna)', hindiName: 'लोकमान्य नगर (हिंगणा)', cityId: 'nagpur', lineIds: ['nag-aqua'], latitude: 21.1215, longitude: 79.0098, isTerminal: true, zone: 'West Gateway', landmark: 'MIDC Hingna Industrial Area & Priyadarshini Campus', elevation: 'elevated' },
];

export const NAGPUR_LINES_CONFIG: MetroLine[] = [
  {
    id: 'nag-orange',
    name: 'Orange Line (Automotive Square - Khapri)',
    hindiName: 'ऑरेंज लाइन (उत्तर-दक्षिण कॉरिडोर)',
    code: 'NS',
    color: '#EA580C',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'nag-org-auto-sq',
      'nag-org-nari-rd',
      'nag-org-kadbi-sq',
      'nag-org-gaddi-godam',
      'nag-org-sitabuldi',
      'nag-org-zero-mile',
      'nag-org-rahate-colony',
      'nag-org-chhatrapati-sq',
      'nag-org-airport',
      'nag-org-airport-south',
      'nag-org-khapri',
    ],
  },
  {
    id: 'nag-aqua',
    name: 'Aqua Line (Prajapati Nagar - Lokmanya Nagar)',
    hindiName: 'एक्वा लाइन (पूर्व-पश्चिम कॉरिडोर)',
    code: 'EW',
    color: '#06B6D4',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'nag-aqu-prajapati-nagar',
      'nag-aqu-itwari',
      'nag-aqu-agrasen-sq',
      'nag-org-sitabuldi',
      'nag-aqu-jhansi-rani-sq',
      'nag-aqu-institution-eng',
      'nag-aqu-subhash-nagar',
      'nag-aqu-lokmanya-nagar',
    ],
  },
];
