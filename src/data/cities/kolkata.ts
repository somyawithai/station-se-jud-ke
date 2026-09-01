import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const KOLKATA_RAW_STATIONS: RawStationGeoData[] = [
  // Blue Line 1 (Dakshineswar to Kavi Subhash)
  { id: 'kol-blu-dakshineswar', name: 'Dakshineswar', hindiName: 'दक्षिणेश्वर', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.6534, longitude: 88.3582, isTerminal: true, zone: 'North 24 Parganas', landmark: 'Dakshineswar Kali Temple & Vivekananda Setu', elevation: 'elevated' },
  { id: 'kol-blu-baranagar', name: 'Baranagar', hindiName: 'बरानगर', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.6455, longitude: 88.3712, zone: 'North Kolkata', landmark: 'BT Road Junction & Dunlop', elevation: 'elevated' },
  { id: 'kol-blu-noapara', name: 'Noapara', hindiName: 'नोआपाड़ा', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.6398, longitude: 88.3912, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Line 4 (Yellow)'], zone: 'North Central Depot', landmark: 'Noapara Metro Car Shed', elevation: 'elevated' },
  { id: 'kol-blu-dum-dum', name: 'Dum Dum', hindiName: 'दमदम', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.6214, longitude: 88.3965, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Eastern Railway Suburban'], zone: 'North Transport Hub', landmark: 'Dum Dum Railway Junction', elevation: 'elevated' },
  { id: 'kol-blu-shyambazar', name: 'Shyambazar', hindiName: 'श्यामबाजार', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.6025, longitude: 88.3712, zone: 'Heritage North Kolkata', landmark: 'Netaji Subhash Chandra Bose Statue 5-point crossing', elevation: 'underground' },
  { id: 'kol-blu-shobhabazar', name: 'Shobhabazar Sutanuti', hindiName: 'शोभाबाजार सुतानुती', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5978, longitude: 88.3685, zone: 'Old Aristocratic Kolkata', landmark: 'Kumartuli Idol Artists & Sovabazar Rajbari', elevation: 'underground' },
  { id: 'kol-blu-girish-park', name: 'Girish Park', hindiName: 'गिरीश पार्क', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5855, longitude: 88.3615, zone: 'Central North', landmark: 'CR Avenue & Vivekananda Road', elevation: 'underground' },
  { id: 'kol-blu-mahatma-gandhi', name: 'Mahatma Gandhi Road (MG Road)', hindiName: 'महात्मा गांधी रोड', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5798, longitude: 88.3612, zone: 'Commercial Core', landmark: 'Burrabazar Wholesale Hub & College Street Boi Para', elevation: 'underground' },
  { id: 'kol-blu-central', name: 'Central', hindiName: 'सेंट्रल', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5714, longitude: 88.3601, zone: 'Central Kolkata', landmark: 'Calcutta Medical College & Bowbazar', elevation: 'underground' },
  { id: 'kol-blu-chandni-chowk', name: 'Chandni Chowk (Kolkata)', hindiName: 'चांदनी चौक', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5658, longitude: 88.3582, zone: 'Electronics Hub', landmark: 'E-Mall & Lenin Sarani', elevation: 'underground' },
  { id: 'kol-blu-esplanade', name: 'Esplanade', hindiName: 'एस्प्लेनेड', cityId: 'kolkata', lineIds: ['kol-blue', 'kol-green', 'kol-purple'], latitude: 22.5624, longitude: 88.3512, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Line 2 (Green Underwater)', 'Line 3 (Purple)'], zone: 'Heart of Kolkata', landmark: 'Curzon Park, Raj Bhavan, Shahid Minar & New Market', elevation: 'underground' },
  { id: 'kol-blu-park-street', name: 'Park Street (Mother Teresa)', hindiName: 'पार्क स्ट्रीट', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5512, longitude: 88.3515, zone: 'Entertainment Core', landmark: 'Park Street Food Mile, St. Xavier College & Indian Museum', elevation: 'underground' },
  { id: 'kol-blu-maidan', name: 'Maidan', hindiName: 'मैदान', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5458, longitude: 88.3498, zone: 'Brigade Ground', landmark: 'Victoria Memorial Hall & Kolkata Race Course', elevation: 'underground' },
  { id: 'kol-blu-rabindra-sadan', name: 'Rabindra Sadan', hindiName: 'रवीन्द्र सदन', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5385, longitude: 88.3475, zone: 'Cultural Precinct', landmark: 'Nandan Film Centre, Academy of Fine Arts & SSKM Hospital', elevation: 'underground' },
  { id: 'kol-blu-kalighat', name: 'Kalighat', hindiName: 'कालीघाट', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.5185, longitude: 88.3462, zone: 'South Kolkata Heritage', landmark: 'Historic Kalighat Kali Temple & Deshapriya Park', elevation: 'underground' },
  { id: 'kol-blu-tollygunge', name: 'Mahanayak Uttam Kumar (Tollygunge)', hindiName: 'महानायक उत्तम कुमार', cityId: 'kolkata', lineIds: ['kol-blue'], latitude: 22.4985, longitude: 88.3468, zone: 'Cinema & Golf District', landmark: 'Tollywood Film Studios & Royal Calcutta Golf Club', elevation: 'elevated' },
  { id: 'kol-blu-kavi-subhash', name: 'Kavi Subhash (New Garia)', hindiName: 'कवि सुभाष (न्यू गरिया)', cityId: 'kolkata', lineIds: ['kol-blue', 'kol-orange'], latitude: 22.4645, longitude: 88.3985, isTerminal: true, isInterchange: true, interchangeLines: ['Line 1 (Blue)', 'Line 6 (Orange Ruby line)'], zone: 'South East Gateway', landmark: 'New Garia Railway Terminal & EM Bypass', elevation: 'at-grade' },

  // Green Line 2 East-West (Howrah Maidan to Esplanade Underwater & Sealdah to Sector V)
  { id: 'kol-grn-howrah-maidan', name: 'Howrah Maidan', hindiName: 'हावड़ा मैदान', cityId: 'kolkata', lineIds: ['kol-green'], latitude: 22.5925, longitude: 88.3245, isTerminal: true, zone: 'Howrah City', landmark: 'Howrah Court, District Stadium & Grand Trunk Road', elevation: 'underground' },
  { id: 'kol-grn-howrah-stn', name: 'Howrah Railway Station', hindiName: 'हावड़ा रेलवे स्टेशन', cityId: 'kolkata', lineIds: ['kol-green'], latitude: 22.5852, longitude: 88.3412, isInterchange: true, interchangeLines: ['Line 2 (Green)', 'Eastern & South Eastern Railway (HWH)'], zone: 'Deepest Metro Station in India (33m deep)', landmark: 'Historic Howrah Terminus & Hooghly Ferry Ghat', elevation: 'underground' },
  { id: 'kol-grn-mahavaran', name: 'Mahakaran (BBD Bagh)', hindiName: 'महाकरण (बीबीडी बाग)', cityId: 'kolkata', lineIds: ['kol-green'], latitude: 22.5745, longitude: 88.3475, zone: 'Writers Building / Heritage Core', landmark: 'First station after underwater tunnel crossing Hooghly River', elevation: 'underground' },
  { id: 'kol-grn-esplanade', name: 'Esplanade (Green Line)', hindiName: 'एस्प्लेनेड ग्रीन लाइन', cityId: 'kolkata', lineIds: ['kol-green', 'kol-blue'], latitude: 22.5626, longitude: 88.3514, isInterchange: true, interchangeLines: ['Line 2 Green', 'Line 1 Blue'], zone: 'Central Interchange', landmark: 'Underground interchange hub', elevation: 'underground' },
  { id: 'kol-grn-sealdah', name: 'Sealdah Metro Station', hindiName: 'सियालदह', cityId: 'kolkata', lineIds: ['kol-green'], latitude: 22.5684, longitude: 88.3712, isInterchange: true, interchangeLines: ['Line 2 Green', 'Sealdah Railway Station (SDAH)'], zone: 'Busiest Railway Gateway', landmark: 'Sealdah Main & South Sections Railway Terminal', elevation: 'underground' },
  { id: 'kol-grn-saltlake-sec5', name: 'Salt Lake Sector V', hindiName: 'साल्ट लेक सेक्टर 5', cityId: 'kolkata', lineIds: ['kol-green', 'kol-orange'], latitude: 22.5768, longitude: 88.4325, isTerminal: true, isInterchange: true, interchangeLines: ['Line 2 Green', 'Line 6 Orange'], zone: 'IT & Silicon Hub of Bengal', landmark: 'TCS Gitanjali Park, Wipro & Infospace', elevation: 'elevated' },

  // Orange Line 6 (Kavi Subhash to Hemanta Mukhopadhyay / Ruby More)
  { id: 'kol-org-hemanta', name: 'Hemanta Mukhopadhyay (Ruby More)', hindiName: 'हेमंत मुखोपाध्याय (रूबी मोड़)', cityId: 'kolkata', lineIds: ['kol-orange'], latitude: 22.5125, longitude: 88.4012, isTerminal: true, zone: 'EM Bypass South', landmark: 'Ruby General Hospital & Rashbehari Connector', elevation: 'elevated' },
  { id: 'kol-org-kavi-sukanta', name: 'Kavi Sukanta (Kalikapur)', hindiName: 'कवि सुकांत', cityId: 'kolkata', lineIds: ['kol-orange'], latitude: 22.4925, longitude: 88.4005, zone: 'EM Bypass', landmark: 'Santoshpur Connector & Metro Cash and Carry', elevation: 'elevated' },

  // Purple Line 3 (Joka to Majerhat)
  { id: 'kol-pur-joka', name: 'Joka', hindiName: 'जोका', cityId: 'kolkata', lineIds: ['kol-purple'], latitude: 22.4562, longitude: 88.3045, isTerminal: true, zone: 'South West Kolkata', landmark: 'IIM Calcutta & ESI Hospital Joka', elevation: 'elevated' },
  { id: 'kol-pur-behala-chowrasta', name: 'Behala Chowrasta', hindiName: 'बेहाला चौरस्ता', cityId: 'kolkata', lineIds: ['kol-purple'], latitude: 22.4965, longitude: 88.3185, zone: 'Behala Heart', landmark: 'Diamond Harbour Road & Sourav Ganguly Residence', elevation: 'elevated' },
  { id: 'kol-pur-majerhat', name: 'Majerhat', hindiName: 'माझेरहाट', cityId: 'kolkata', lineIds: ['kol-purple'], latitude: 22.5185, longitude: 88.3245, isTerminal: true, isInterchange: true, interchangeLines: ['Line 3 Purple', 'Majerhat Railway Station'], zone: 'South West Rail Interchange', landmark: 'Majerhat Cable Stayed Bridge & Alipore Mint', elevation: 'elevated' },
];

export const KOLKATA_LINES_CONFIG: MetroLine[] = [
  {
    id: 'kol-blue',
    name: 'Line 1 Blue Line (Dakshineswar - Kavi Subhash)',
    hindiName: 'लाइन 1 ब्लू लाइन (दक्षिणेश्वर - कवि सुभाष)',
    code: 'L1',
    color: '#0284C7',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'kol-blu-dakshineswar',
      'kol-blu-baranagar',
      'kol-blu-noapara',
      'kol-blu-dum-dum',
      'kol-blu-shyambazar',
      'kol-blu-shobhabazar',
      'kol-blu-girish-park',
      'kol-blu-mahatma-gandhi',
      'kol-blu-central',
      'kol-blu-chandni-chowk',
      'kol-blu-esplanade',
      'kol-blu-park-street',
      'kol-blu-maidan',
      'kol-blu-rabindra-sadan',
      'kol-blu-kalighat',
      'kol-blu-tollygunge',
      'kol-blu-kavi-subhash',
    ],
  },
  {
    id: 'kol-green',
    name: 'Line 2 Green Line (Underwater East-West)',
    hindiName: 'लाइन 2 ग्रीन लाइन (हुगली नदी के नीचे - ईस्ट-वेस्ट)',
    code: 'L2',
    color: '#16A34A',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'kol-grn-howrah-maidan',
      'kol-grn-howrah-stn',
      'kol-grn-mahavaran',
      'kol-grn-esplanade',
      'kol-grn-sealdah',
      'kol-grn-saltlake-sec5',
    ],
  },
  {
    id: 'kol-orange',
    name: 'Line 6 Orange Line (Kavi Subhash - Ruby More)',
    hindiName: 'लाइन 6 ऑरेंज लाइन (ईएम बाईपास)',
    code: 'L6',
    color: '#EA580C',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'kol-blu-kavi-subhash',
      'kol-org-kavi-sukanta',
      'kol-org-hemanta',
    ],
  },
  {
    id: 'kol-purple',
    name: 'Line 3 Purple Line (Joka - Majerhat)',
    hindiName: 'लाइन 3 पर्पल लाइन (जोका - माझेरहाट)',
    code: 'L3',
    color: '#9333EA',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'kol-pur-joka',
      'kol-pur-behala-chowrasta',
      'kol-pur-majerhat',
    ],
  },
];
