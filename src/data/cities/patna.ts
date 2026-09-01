import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const PATNA_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "pat-l2-bhootnath",
    "name": "Bhootnath",
    "cityId": "patna",
    "lineIds": [
      "pat-blue"
    ],
    "latitude": 25.55167,
    "longitude": 85.09517,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "pat-l2-zero-mile",
    "name": "Zero Mile",
    "cityId": "patna",
    "lineIds": [
      "pat-blue"
    ],
    "latitude": 25.5941,
    "longitude": 85.1376,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "pat-l2-new-isbt",
    "name": "New ISBT",
    "cityId": "patna",
    "lineIds": [
      "pat-blue"
    ],
    "latitude": 25.63653,
    "longitude": 85.18003,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  }
];

export const PATNA_LINES_CONFIG: MetroLine[] = [
  {
    "id": "pat-blue",
    "name": "Blue Line",
    "hindiName": "ब्लू लाइन",
    "code": "L2",
    "color": "#0284C7",
    "textColor": "#FFFFFF",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "pat-l2-bhootnath",
      "pat-l2-zero-mile",
      "pat-l2-new-isbt"
    ]
  }
];
