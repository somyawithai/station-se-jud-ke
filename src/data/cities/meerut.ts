import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const MEERUT_RAW_STATIONS: RawStationGeoData[] = [
  // Meerut Metro Local Section (operated by NCRTC on dedicated local transit infrastructure)
  { id: 'mee-met-meerut-south', name: 'Meerut South (Partapur)', hindiName: 'मेरठ साउथ (परतापुर)', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 28.9102, longitude: 77.6405, isTerminal: true, isInterchange: true, interchangeLines: ['Meerut Metro Line 1', 'Namo Bharat RRTS Rapid Rail'], zone: 'South Meerut Gateway', landmark: 'Partapur Interchange & Delhi-Meerut Expressway', elevation: 'elevated' },
  { id: 'mee-met-ri-nagar', name: 'Rithani', hindiName: 'रिठानी', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 28.9285, longitude: 77.6525, zone: 'Industrial Corridor', landmark: 'Rithani Industrial Belt', elevation: 'elevated' },
  { id: 'mee-met-shatabdi-nagar', name: 'Shatabdi Nagar', hindiName: 'शताब्दी नगर', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 28.9412, longitude: 77.6625, isInterchange: true, interchangeLines: ['Meerut Metro', 'Namo Bharat RRTS'], zone: 'Industrial & Housing', landmark: 'Shatabdi Nagar Sector 4', elevation: 'elevated' },
  { id: 'mee-met-brahmpuri', name: 'Brahmpuri', hindiName: 'ब्रह्मपुरी', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 28.9612, longitude: 77.6812, zone: 'South Central Meerut', landmark: 'Brahmpuri Commercial Road', elevation: 'elevated' },
  { id: 'mee-met-meerut-central', name: 'Meerut Central (Football Chowk)', hindiName: 'मेरठ सेंट्रल (फुटबॉल चौक)', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 28.9745, longitude: 77.6925, zone: 'Sports Goods Manufacturing Hub', landmark: 'Meerut Sports Goods Cluster & Cantt Road', elevation: 'underground' },
  { id: 'mee-met-bhainsali', name: 'Bhainsali Bus Terminal', hindiName: 'भैंसाली बस अड्डा', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 28.9812, longitude: 77.6985, isInterchange: true, interchangeLines: ['Meerut Metro', 'Bhainsali UPSRTC Central Bus Stand'], zone: 'Central Bus Transit', landmark: 'Bhainsali Bus Stand & Town Hall', elevation: 'underground' },
  { id: 'mee-met-begumpul', name: 'Begumpul', hindiName: 'बेगमपुल', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 28.9885, longitude: 77.7042, isInterchange: true, interchangeLines: ['Meerut Metro', 'Namo Bharat RRTS'], zone: 'Commercial Heart of Meerut', landmark: 'Abu Lane Market, Sadar Bazaar & Cantt', elevation: 'underground' },
  { id: 'mee-met-modipuram', name: 'Modipuram (Depot)', hindiName: 'मोदीपुरम डिपो', cityId: 'meerut', lineIds: ['mee-metro-1'], latitude: 29.0682, longitude: 77.7125, isTerminal: true, isInterchange: true, interchangeLines: ['Meerut Metro', 'Namo Bharat RRTS'], zone: 'North Gateway & Metro Depot', landmark: 'Modipuram Metro Depot & SVP University of Agriculture', elevation: 'elevated' },
];

export const MEERUT_LINES_CONFIG: MetroLine[] = [
  {
    id: 'mee-metro-1',
    name: 'Meerut Metro Line 1 (Meerut South - Modipuram)',
    hindiName: 'मेरठ मेट्रो लाइन 1',
    code: 'MM1',
    color: '#E11D48',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'mee-met-meerut-south',
      'mee-met-ri-nagar',
      'mee-met-shatabdi-nagar',
      'mee-met-brahmpuri',
      'mee-met-meerut-central',
      'mee-met-bhainsali',
      'mee-met-begumpul',
      'mee-met-modipuram',
    ],
  },
];
