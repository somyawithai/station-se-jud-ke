import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const INDORE_RAW_STATIONS: RawStationGeoData[] = [
  // Yellow Line Priority Ring Corridor (Gandhi Nagar to Super Corridor 03)
  { id: 'ind-yel-gandhi-nagar', name: 'Gandhi Nagar 10D (Depot)', hindiName: 'गांधी नगर 10D', cityId: 'indore', lineIds: ['ind-yellow'], latitude: 22.7585, longitude: 75.7985, isTerminal: true, zone: 'Airport North Corridor', landmark: 'Gandhi Nagar Metro Depot & Airport Road', elevation: 'elevated' },
  { id: 'ind-yel-super-corr-06', name: 'Super Corridor 06', hindiName: 'सुपर कॉरिडोर 06', cityId: 'indore', lineIds: ['ind-yellow'], latitude: 22.7685, longitude: 75.8112, zone: 'IT Corridor', landmark: 'TCS Indore Campus & Super Corridor Entry', elevation: 'elevated' },
  { id: 'ind-yel-super-corr-05', name: 'Super Corridor 05', hindiName: 'सुपर कॉरिडोर 05', cityId: 'indore', lineIds: ['ind-yellow'], latitude: 22.7745, longitude: 75.8245, zone: 'Tech Hub', landmark: 'Infosys Indore SEZ Campus & Symbiosis University', elevation: 'elevated' },
  { id: 'ind-yel-super-corr-04', name: 'Super Corridor 04', hindiName: 'सुपर कॉरिडोर 04', cityId: 'indore', lineIds: ['ind-yellow'], latitude: 22.7812, longitude: 75.8365, zone: 'Commercial Development', landmark: 'Narsee Monjee Institute (NMIMS) & Financial Hub', elevation: 'elevated' },
  { id: 'ind-yel-super-corr-03', name: 'Super Corridor 03', hindiName: 'सुपर कॉरिडोर 03', cityId: 'indore', lineIds: ['ind-yellow'], latitude: 22.7885, longitude: 75.8495, isTerminal: true, zone: 'Ujjain Road Gateway', landmark: 'Indore-Ujjain Highway Crossing & Aurobindo Hospital link', elevation: 'elevated' },
];

export const INDORE_LINES_CONFIG: MetroLine[] = [
  {
    id: 'ind-yellow',
    name: 'Yellow Line Priority Corridor (Gandhi Nagar - Super Corridor)',
    hindiName: 'येलो लाइन (गांधी नगर - सुपर कॉरिडोर)',
    code: 'L3',
    color: '#EAB308',
    textColor: '#1C1917',
    strokeWidth: 6,
    stationIds: [
      'ind-yel-gandhi-nagar',
      'ind-yel-super-corr-06',
      'ind-yel-super-corr-05',
      'ind-yel-super-corr-04',
      'ind-yel-super-corr-03',
    ],
  },
];
