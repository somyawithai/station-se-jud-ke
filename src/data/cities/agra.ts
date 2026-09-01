import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const AGRA_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "agr-l1-taj-east-gate",
    "name": "Taj East Gate",
    "cityId": "agra",
    "lineIds": [
      "agr-yellow"
    ],
    "latitude": 27.13427,
    "longitude": 77.96567,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "agr-l1-shahid-captain-shubham-gupta-basai",
    "name": "Shahid Captain Shubham Gupta (Basai)",
    "cityId": "agra",
    "lineIds": [
      "agr-yellow"
    ],
    "latitude": 27.15124,
    "longitude": 77.98264,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "agr-l1-fatehabad-road",
    "name": "Fatehabad Road",
    "cityId": "agra",
    "lineIds": [
      "agr-yellow"
    ],
    "latitude": 27.16821,
    "longitude": 77.99961,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "agr-l1-taj-mahal",
    "name": "Taj Mahal",
    "cityId": "agra",
    "lineIds": [
      "agr-yellow"
    ],
    "latitude": 27.18519,
    "longitude": 78.01659,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "agr-l1-agra-fort",
    "name": "Agra Fort",
    "cityId": "agra",
    "lineIds": [
      "agr-yellow"
    ],
    "latitude": 27.20216,
    "longitude": 78.03356,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "agr-l1-mankameshwar",
    "name": "Mankameshwar",
    "cityId": "agra",
    "lineIds": [
      "agr-yellow"
    ],
    "latitude": 27.21913,
    "longitude": 78.05053,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  }
];

export const AGRA_LINES_CONFIG: MetroLine[] = [
  {
    "id": "agr-yellow",
    "name": "Yellow Line",
    "hindiName": "येलो लाइन",
    "code": "L1",
    "color": "#EAB308",
    "textColor": "#1C1917",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "agr-l1-taj-east-gate",
      "agr-l1-shahid-captain-shubham-gupta-basai",
      "agr-l1-fatehabad-road",
      "agr-l1-taj-mahal",
      "agr-l1-agra-fort",
      "agr-l1-mankameshwar"
    ]
  }
];
