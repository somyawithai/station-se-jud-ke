import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const AGRA_RAW_STATIONS: RawStationGeoData[] = [
  // Yellow Line (Taj East Gate to Mankameshwar Mandir / Jama Masjid)
  { id: 'agr-yel-taj-east-gate', name: 'Taj East Gate', hindiName: 'ताज ईस्ट गेट', cityId: 'agra', lineIds: ['agr-yellow'], latitude: 27.1685, longitude: 78.0585, isTerminal: true, zone: 'Taj Heritage Zone', landmark: 'UNESCO World Heritage Taj Mahal East Entry & Shilpgram', elevation: 'elevated' },
  { id: 'agr-yel-captain-shubham', name: 'Captain Shubham Gupta (Fatehabad Road)', hindiName: 'कैप्टन शुभम गुप्ता', cityId: 'agra', lineIds: ['agr-yellow'], latitude: 27.1612, longitude: 78.0465, zone: 'Tourist Hotel Corridor', landmark: 'Fatehabad Road Luxury Hotel Belt', elevation: 'elevated' },
  { id: 'agr-yel-taj-mahal', name: 'Taj Mahal (Purani Mandi)', hindiName: 'ताज महल मेट्रो स्टेशन', cityId: 'agra', lineIds: ['agr-yellow'], latitude: 27.1698, longitude: 78.0385, zone: 'Taj West Corridor', landmark: 'Taj Mahal West Gate & Purani Mandi Crossing', elevation: 'elevated' },
  { id: 'agr-yel-agra-fort', name: 'Agra Fort', hindiName: 'आगरा फोर्ट', cityId: 'agra', lineIds: ['agr-yellow'], latitude: 27.1798, longitude: 78.0212, isInterchange: true, interchangeLines: ['Yellow Line', 'Agra Fort Railway Station (AF)'], zone: 'UNESCO Mughal Fortress', landmark: 'UNESCO World Heritage Agra Fort & Diwan-i-Aam', elevation: 'underground' },
  { id: 'agr-yel-mankameshwar', name: 'Mankameshwar Mandir (Jama Masjid)', hindiName: 'मनकामेश्वर मंदिर (जामा मस्जिद)', cityId: 'agra', lineIds: ['agr-yellow'], latitude: 27.1852, longitude: 78.0165, isTerminal: true, zone: 'Historic Heritage Core', landmark: 'Ancient Mankameshwar Shiva Temple & Historic Jama Masjid', elevation: 'underground' },
  { id: 'agr-yel-dr-bhimrao', name: 'Dr. Bhimrao Ambedkar University', hindiName: 'डॉ. भीमराव अंबेडकर विश्वविद्यालय', cityId: 'agra', lineIds: ['agr-yellow'], latitude: 27.1985, longitude: 78.0085, zone: 'Education Zone', landmark: 'Paliwal Park & University Campus', elevation: 'underground' },
];

export const AGRA_LINES_CONFIG: MetroLine[] = [
  {
    id: 'agr-yellow',
    name: 'Yellow Line Priority Corridor (Taj East Gate - Mankameshwar)',
    hindiName: 'येलो लाइन (ताज ईस्ट गेट - मनकामेश्वर मंदिर)',
    code: 'L1',
    color: '#EAB308',
    textColor: '#1C1917',
    strokeWidth: 6,
    stationIds: [
      'agr-yel-taj-east-gate',
      'agr-yel-captain-shubham',
      'agr-yel-taj-mahal',
      'agr-yel-agra-fort',
      'agr-yel-mankameshwar',
      'agr-yel-dr-bhimrao',
    ],
  },
];
