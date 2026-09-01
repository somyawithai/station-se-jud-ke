import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const NOIDA_RAW_STATIONS: RawStationGeoData[] = [
  // Aqua Line (Noida Sector 51 to Depot Station Greater Noida)
  { id: 'noi-aqu-sec-51', name: 'Noida Sector 51', hindiName: 'नोएडा सेक्टर 51', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.5885, longitude: 77.3685, isTerminal: true, isInterchange: true, interchangeLines: ['Aqua Line', 'Delhi Metro Blue Line (Sector 52 Skywalk)'], zone: 'Noida Central Interchange', landmark: 'Dedicated Skywalk Walkway to DMRC Blue Line Sector 52', elevation: 'elevated' },
  { id: 'noi-aqu-sec-50', name: 'Noida Sector 50', hindiName: 'नोएडा सेक्टर 50', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.5798, longitude: 77.3712, zone: 'Residential Heart', landmark: 'Rainbow Pride Theme Station', elevation: 'elevated' },
  { id: 'noi-aqu-sec-76', name: 'Noida Sector 76', hindiName: 'नोएडा सेक्टर 76', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.5685, longitude: 77.3798, zone: 'High-rise Residential', landmark: 'Silicon City & Amrapali Hub', elevation: 'elevated' },
  { id: 'noi-aqu-sec-101', name: 'Noida Sector 101', hindiName: 'नोएडा सेक्टर 101', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.5512, longitude: 77.3885, zone: 'Expressway North', landmark: 'Sector 101 Crossing', elevation: 'elevated' },
  { id: 'noi-aqu-sec-81', name: 'NSEZ (Noida Special Economic Zone)', hindiName: 'नोएडा स्पेशल इकोनॉमिक ज़ोन', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.5385, longitude: 77.4012, zone: 'Export Manufacturing SEZ', landmark: 'Noida Special Economic Zone Export Processing Unit', elevation: 'elevated' },
  { id: 'noi-aqu-sec-83', name: 'Noida Sector 83', hindiName: 'नोएडा सेक्टर 83', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.5245, longitude: 77.4125, zone: 'Industrial Area', landmark: 'Samsung & LG Electronics Cluster', elevation: 'elevated' },
  { id: 'noi-aqu-sec-137', name: 'Noida Sector 137', hindiName: 'नोएडा सेक्टर 137', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.5112, longitude: 77.4185, zone: 'Expressway Residential', landmark: 'Felix Hospital & Paras Tierea', elevation: 'elevated' },
  { id: 'noi-aqu-sec-142', name: 'Noida Sector 142', hindiName: 'नोएडा सेक्टर 142', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.4985, longitude: 77.4312, zone: 'Expressway IT Zone', landmark: 'Advant Navis Business Park & Future Botanical Line interchange', elevation: 'elevated' },
  { id: 'noi-aqu-pari-chowk', name: 'Pari Chowk (Greater Noida)', hindiName: 'परी चौक (ग्रेटर नोएडा)', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.4685, longitude: 77.5125, zone: 'Greater Noida Gateway', landmark: 'Iconic Pari Chowk Monument, Ansal Plaza & Galgotias University', elevation: 'elevated' },
  { id: 'noi-aqu-alpha-1', name: 'Alpha 1', hindiName: 'अल्फा 1', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.4712, longitude: 77.5245, zone: 'Commercial Center', landmark: 'Greater Noida Authority Office & Commercial Belt', elevation: 'elevated' },
  { id: 'noi-aqu-delta-1', name: 'Delta 1', hindiName: 'डेल्टा 1', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.4798, longitude: 77.5412, zone: 'Residential Sector', landmark: 'Delta Sector Market', elevation: 'elevated' },
  { id: 'noi-aqu-depot', name: 'Depot Station (Greater Noida)', hindiName: 'डिपो स्टेशन', cityId: 'noida', lineIds: ['noida-aqua'], latitude: 28.4612, longitude: 77.5685, isTerminal: true, zone: 'Greater Noida East', landmark: 'NMRC Train Maintenance Depot & Eastern Peripheral Expressway link', elevation: 'elevated' },
];

export const NOIDA_LINES_CONFIG: MetroLine[] = [
  {
    id: 'noida-aqua',
    name: 'Aqua Line (Noida Sec 51 - Depot Greater Noida)',
    hindiName: 'एक्वा लाइन (नोएडा - ग्रेटर नोएडा)',
    code: 'AL',
    color: '#06B6D4',
    textColor: '#FFFFFF',
    strokeWidth: 6,
    stationIds: [
      'noi-aqu-sec-51',
      'noi-aqu-sec-50',
      'noi-aqu-sec-76',
      'noi-aqu-sec-101',
      'noi-aqu-sec-81',
      'noi-aqu-sec-83',
      'noi-aqu-sec-137',
      'noi-aqu-sec-142',
      'noi-aqu-pari-chowk',
      'noi-aqu-alpha-1',
      'noi-aqu-delta-1',
      'noi-aqu-depot',
    ],
  },
];
