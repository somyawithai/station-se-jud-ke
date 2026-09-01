import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const GURGAON_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "gur-rm-sector-55-56",
    "name": "Sector 55 56",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.41707,
    "longitude": 76.98417,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "gur-rm-sector-54-chowk",
    "name": "Sector 54 Chowk",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.42556,
    "longitude": 76.99266,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-sector-53-54",
    "name": "Sector 53 54",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.43404,
    "longitude": 77.00114,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-sector-42-43",
    "name": "Sector 42 43",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.44253,
    "longitude": 77.00963,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-phase-1",
    "name": "Phase 1",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.45101,
    "longitude": 77.01811,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-sikandarpur",
    "name": "Sikandarpur",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.4595,
    "longitude": 77.0266,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-phase-2",
    "name": "Phase 2",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.46799,
    "longitude": 77.03509,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-belvedere-towers",
    "name": "Belvedere Towers",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.47647,
    "longitude": 77.04357,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-cyber-city",
    "name": "Cyber City",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.48496,
    "longitude": 77.05206,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-moulsari-avenue",
    "name": "Moulsari Avenue",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.49344,
    "longitude": 77.06054,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "gur-rm-phase-3",
    "name": "Phase 3",
    "cityId": "gurgaon",
    "lineIds": [
      "gur-rapid"
    ],
    "latitude": 28.50193,
    "longitude": 77.06903,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  }
];

export const GURGAON_LINES_CONFIG: MetroLine[] = [
  {
    "id": "gur-rapid",
    "name": "Rapid Line",
    "hindiName": "रैपिड लाइन",
    "code": "RM",
    "color": "#0284C7",
    "textColor": "#FFFFFF",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "gur-rm-sector-55-56",
      "gur-rm-sector-54-chowk",
      "gur-rm-sector-53-54",
      "gur-rm-sector-42-43",
      "gur-rm-phase-1",
      "gur-rm-sikandarpur",
      "gur-rm-phase-2",
      "gur-rm-belvedere-towers",
      "gur-rm-cyber-city",
      "gur-rm-moulsari-avenue",
      "gur-rm-phase-3"
    ]
  }
];
