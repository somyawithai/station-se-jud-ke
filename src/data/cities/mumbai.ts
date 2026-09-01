import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const MUMBAI_RAW_STATIONS: RawStationGeoData[] = [
  // Line 1 Blue Line (Versova to Ghatkopar)
  { id: 'mum-l1-versova', name: 'Versova', hindiName: 'वर्सोवा', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.1312, longitude: 72.8174, isTerminal: true, zone: 'Western Suburbs', landmark: 'Versova Beach & Fishermans Wharf', elevation: 'elevated' },
  { id: 'mum-l1-dn-nagar', name: 'D.N. Nagar', hindiName: 'डी.एन. नगर', cityId: 'mumbai', lineIds: ['mum-line-1', 'mum-line-2a'], latitude: 19.1254, longitude: 72.8362, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Line 2A (Yellow)'], zone: 'Andheri West', landmark: 'Andheri Sports Complex & Link Road', elevation: 'elevated' },
  { id: 'mum-l1-azad-nagar', name: 'Azad Nagar', hindiName: 'आजाद नगर', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.1235, longitude: 72.8465, zone: 'Andheri West', landmark: 'Veera Desai Road', elevation: 'elevated' },
  { id: 'mum-l1-andheri', name: 'Andheri (Metro)', hindiName: 'अंधेरी', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.1205, longitude: 72.8532, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Western Railway Suburban'], zone: 'Andheri Central', landmark: 'Andheri Western & Harbour Railway Junction', elevation: 'elevated' },
  { id: 'mum-l1-weexpress', name: 'Western Express Highway', hindiName: 'वेस्टर्न एक्सप्रेस हाईवे', cityId: 'mumbai', lineIds: ['mum-line-1', 'mum-line-7'], latitude: 19.1172, longitude: 72.8596, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Line 7 (Gundavali interchange)'], zone: 'Andheri East', landmark: 'WEH Junction & Gundavali connector', elevation: 'elevated' },
  { id: 'mum-l1-jb-nagar', name: 'JB Nagar (Chakala)', hindiName: 'जे.बी. नगर', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.1118, longitude: 72.8685, zone: 'Andheri East', landmark: 'Chakala Commercial District', elevation: 'elevated' },
  { id: 'mum-l1-airport-rd', name: 'Airport Road', hindiName: 'एयरपोर्ट रोड', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.1098, longitude: 72.8762, zone: 'Andheri East', landmark: 'CSMIA International Hotel Corridor', elevation: 'elevated' },
  { id: 'mum-l1-marol-naka', name: 'Marol Naka', hindiName: 'मरोल नाका', cityId: 'mumbai', lineIds: ['mum-line-1', 'mum-line-3'], latitude: 19.1082, longitude: 72.8835, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Line 3 (Aqua Underground)'], zone: 'Andheri East', landmark: 'Marol Commercial Business Zone', elevation: 'elevated' },
  { id: 'mum-l1-saki-naka', name: 'Saki Naka', hindiName: 'साकी नाका', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.1042, longitude: 72.8885, zone: 'Saki Naka', landmark: 'Andheri-Kurla Link Road', elevation: 'elevated' },
  { id: 'mum-l1-asalpha', name: 'Asalpha', hindiName: 'असलफा', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.0984, longitude: 72.8988, zone: 'Ghatkopar West', landmark: 'Subhash Nagar', elevation: 'elevated' },
  { id: 'mum-l1-jagruti-nagar', name: 'Jagruti Nagar', hindiName: 'जागृति नगर', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.0921, longitude: 72.9056, zone: 'Ghatkopar West', landmark: 'Jagruti High School', elevation: 'elevated' },
  { id: 'mum-l1-ghatkopar', name: 'Ghatkopar', hindiName: 'घाटकोपर', cityId: 'mumbai', lineIds: ['mum-line-1'], latitude: 19.0864, longitude: 72.9082, isTerminal: true, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Central Railway Main Line'], zone: 'Eastern Suburbs', landmark: 'Ghatkopar Central Railway Station', elevation: 'elevated' },

  // Line 2A Yellow Line (Dahisar East to Andheri West)
  { id: 'mum-l2a-dahisar-e', name: 'Dahisar East', hindiName: 'दहिसर पूर्व', cityId: 'mumbai', lineIds: ['mum-line-2a', 'mum-line-7'], latitude: 19.2575, longitude: 72.8624, isTerminal: true, isInterchange: true, interchangeLines: ['Line 2A', 'Line 7'], zone: 'Northern Suburbs', landmark: 'Dahisar Toll & Western Express Highway', elevation: 'elevated' },
  { id: 'mum-l2a-borivali-w', name: 'Borivali West', hindiName: 'बोरीवली पश्चिम', cityId: 'mumbai', lineIds: ['mum-line-2a'], latitude: 19.2312, longitude: 72.8421, zone: 'Borivali', landmark: 'Link Road Borivali', elevation: 'elevated' },
  { id: 'mum-l2a-kandivali-w', name: 'Kandivali West', hindiName: 'कांदिवली पश्चिम', cityId: 'mumbai', lineIds: ['mum-line-2a'], latitude: 19.2085, longitude: 72.8365, zone: 'Kandivali', landmark: 'Dahanukarwadi & Mahavir Nagar', elevation: 'elevated' },
  { id: 'mum-l2a-malad-w', name: 'Malad West', hindiName: 'मालाड पश्चिम', cityId: 'mumbai', lineIds: ['mum-line-2a'], latitude: 19.1865, longitude: 72.8354, zone: 'Malad', landmark: 'Inorbit Mall & Mindspace IT Park', elevation: 'elevated' },
  { id: 'mum-l2a-andheri-w', name: 'Andheri West (D.N. Nagar)', hindiName: 'अंधेरी पश्चिम', cityId: 'mumbai', lineIds: ['mum-line-2a', 'mum-line-1'], latitude: 19.1262, longitude: 72.8364, isTerminal: true, isInterchange: true, interchangeLines: ['Line 2A', 'Line 1 Blue'], zone: 'Andheri West', landmark: 'Metro 1 Link Interchange', elevation: 'elevated' },

  // Line 7 Red Line (Dahisar East to Gundavali)
  { id: 'mum-l7-magathane', name: 'Magathane', hindiName: 'मागाठाणे', cityId: 'mumbai', lineIds: ['mum-line-7'], latitude: 19.2274, longitude: 72.8641, zone: 'Borivali East', landmark: 'Borivali National Park Entrance', elevation: 'elevated' },
  { id: 'mum-l7-poisar', name: 'Poisar', hindiName: 'पोईसर', cityId: 'mumbai', lineIds: ['mum-line-7'], latitude: 19.2135, longitude: 72.8652, zone: 'Kandivali East', landmark: '101 Mall & Thakur Complex', elevation: 'elevated' },
  { id: 'mum-l7-goregaon-e', name: 'Goregaon East (Aarey)', hindiName: 'गोरेगांव पूर्व', cityId: 'mumbai', lineIds: ['mum-line-7'], latitude: 19.1645, longitude: 72.8612, zone: 'Goregaon East', landmark: 'Nirlon Knowledge Park & Hub Mall', elevation: 'elevated' },
  { id: 'mum-l7-gundavali', name: 'Gundavali (Andheri East)', hindiName: 'गुंदवली', cityId: 'mumbai', lineIds: ['mum-line-7', 'mum-line-1'], latitude: 19.1185, longitude: 72.8601, isTerminal: true, isInterchange: true, interchangeLines: ['Line 7 Red', 'Line 1 Blue'], zone: 'Andheri East', landmark: 'Western Express Highway Interchange Skywalk', elevation: 'elevated' },

  // Line 3 Aqua Line Phase 1 (Underground: Aarey JVLR to BKC)
  { id: 'mum-l3-aarey-jvlr', name: 'Aarey JVLR', hindiName: 'आरे जेवीएलआर', cityId: 'mumbai', lineIds: ['mum-line-3'], latitude: 19.1352, longitude: 72.8785, isTerminal: true, zone: 'Aarey Milk Colony', landmark: 'JVLR Junction & Aarey Eco Area', elevation: 'at-grade' },
  { id: 'mum-l3-seepz', name: 'SEEPZ', hindiName: 'सीप्ज़', cityId: 'mumbai', lineIds: ['mum-line-3'], latitude: 19.1245, longitude: 72.8798, zone: 'MIDC', landmark: 'SEEPZ Special Economic Zone & Jewellery Hub', elevation: 'underground' },
  { id: 'mum-l3-midc', name: 'MIDC Andheri', hindiName: 'एमआईडीसी अंधेरी', cityId: 'mumbai', lineIds: ['mum-line-3'], latitude: 19.1172, longitude: 72.8741, zone: 'MIDC', landmark: 'MIDC Industrial Estate', elevation: 'underground' },
  { id: 'mum-l3-marol-under', name: 'Marol Naka (L3)', hindiName: 'मरोल नाका भूमिगत', cityId: 'mumbai', lineIds: ['mum-line-3', 'mum-line-1'], latitude: 19.1084, longitude: 72.8837, isInterchange: true, interchangeLines: ['Line 3 Aqua', 'Line 1 Blue'], zone: 'Andheri East', landmark: 'Underground Interchange Station', elevation: 'underground' },
  { id: 'mum-l3-csmia-t2', name: 'CSMIA Terminal 2 (International)', hindiName: 'छत्रपति शिवाजी महाराज अंतरराष्ट्रीय एयरपोर्ट T2', cityId: 'mumbai', lineIds: ['mum-line-3'], latitude: 19.0965, longitude: 72.8742, zone: 'International Airport', landmark: 'Mumbai International Airport T2 Terminal', elevation: 'underground' },
  { id: 'mum-l3-csmia-t1', name: 'CSMIA Terminal 1 (Domestic)', hindiName: 'छत्रपति शिवाजी महाराज डोमेस्टिक एयरपोर्ट T1', cityId: 'mumbai', lineIds: ['mum-line-3'], latitude: 19.0882, longitude: 72.8535, zone: 'Domestic Airport', landmark: 'Domestic Airport Santacruz Departure', elevation: 'underground' },
  { id: 'mum-l3-bkc', name: 'BKC (Bandra Kurla Complex)', hindiName: 'बीकेसी (बांद्रा कुर्ला कॉम्प्लेक्स)', cityId: 'mumbai', lineIds: ['mum-line-3'], latitude: 19.0655, longitude: 72.8685, isTerminal: true, zone: 'BKC Financial Center', landmark: 'Jio World Convention Centre, US Consulate & NSE', elevation: 'underground' },
];

export const MUMBAI_LINES_CONFIG: MetroLine[] = [
  {
    id: 'mum-line-1',
    name: 'Line 1 (Versova - Ghatkopar)',
    hindiName: 'लाइन 1 (नीली रेखा)',
    code: 'L1',
    color: '#0284C7',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'mum-l1-versova',
      'mum-l1-dn-nagar',
      'mum-l1-azad-nagar',
      'mum-l1-andheri',
      'mum-l1-weexpress',
      'mum-l1-jb-nagar',
      'mum-l1-airport-rd',
      'mum-l1-marol-naka',
      'mum-l1-saki-naka',
      'mum-l1-asalpha',
      'mum-l1-jagruti-nagar',
      'mum-l1-ghatkopar',
    ],
  },
  {
    id: 'mum-line-2a',
    name: 'Line 2A (Dahisar E - Andheri W)',
    hindiName: 'लाइन 2A (पीली रेखा)',
    code: 'L2A',
    color: '#EAB308',
    textColor: '#1C1917',
    strokeWidth: 6,
    stationIds: [
      'mum-l2a-dahisar-e',
      'mum-l2a-borivali-w',
      'mum-l2a-kandivali-w',
      'mum-l2a-malad-w',
      'mum-l2a-andheri-w',
    ],
  },
  {
    id: 'mum-line-7',
    name: 'Line 7 (Dahisar E - Gundavali)',
    hindiName: 'लाइन 7 (लाल रेखा)',
    code: 'L7',
    color: '#EF4444',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'mum-l2a-dahisar-e',
      'mum-l7-magathane',
      'mum-l7-poisar',
      'mum-l7-goregaon-e',
      'mum-l7-gundavali',
    ],
  },
  {
    id: 'mum-line-3',
    name: 'Line 3 Aqua Line (Aarey JVLR - BKC)',
    hindiName: 'लाइन 3 एक्वा लाइन (आरे - बीकेसी भूमिगत)',
    code: 'L3',
    color: '#06B6D4',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'mum-l3-aarey-jvlr',
      'mum-l3-seepz',
      'mum-l3-midc',
      'mum-l3-marol-under',
      'mum-l3-csmia-t2',
      'mum-l3-csmia-t1',
      'mum-l3-bkc',
    ],
  },
];
