import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const NAVI_MUMBAI_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "nav-l1-belapur-terminal",
    "name": "Belapur Terminal",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 18.99057,
    "longitude": 72.98727,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "nav-l1-rbi-colony",
    "name": "RBI Colony",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 18.99906,
    "longitude": 72.99576,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-belpada",
    "name": "Belpada",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.00754,
    "longitude": 73.00424,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-utsav-chowk",
    "name": "Utsav Chowk",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.01603,
    "longitude": 73.01273,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-kendriya-vihar",
    "name": "Kendriya vihar",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.02451,
    "longitude": 73.02121,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-kharghar-village",
    "name": "Kharghar village",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.033,
    "longitude": 73.0297,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-central-park",
    "name": "Central park",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.04149,
    "longitude": 73.03819,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-pethpada",
    "name": "Pethpada",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.04997,
    "longitude": 73.04667,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-amandoot",
    "name": "Amandoot",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.05846,
    "longitude": 73.05516,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-pethali-taloja",
    "name": "Pethali taloja",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.06694,
    "longitude": 73.06364,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "nav-l1-pendhar",
    "name": "Pendhar",
    "cityId": "navi-mumbai",
    "lineIds": [
      "nvm-line1"
    ],
    "latitude": 19.07543,
    "longitude": 73.07213,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  }
];

export const NAVI_MUMBAI_LINES_CONFIG: MetroLine[] = [
  {
    "id": "nvm-line1",
    "name": "Line 1",
    "hindiName": "लाइन 1",
    "code": "L1",
    "color": "#0284C7",
    "textColor": "#FFFFFF",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "nav-l1-belapur-terminal",
      "nav-l1-rbi-colony",
      "nav-l1-belpada",
      "nav-l1-utsav-chowk",
      "nav-l1-kendriya-vihar",
      "nav-l1-kharghar-village",
      "nav-l1-central-park",
      "nav-l1-pethpada",
      "nav-l1-amandoot",
      "nav-l1-pethali-taloja",
      "nav-l1-pendhar"
    ]
  }
];
