import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const JAIPUR_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "jai-l1-mansarovar",
    "name": "Mansarovar",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.86997,
    "longitude": 75.74487,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "jai-l1-new-aatish-market",
    "name": "New Aatish Market",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.87846,
    "longitude": 75.75336,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-vivek-vihar",
    "name": "Vivek Vihar",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.88694,
    "longitude": 75.76184,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-shyam-nagar",
    "name": "Shyam Nagar",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.89543,
    "longitude": 75.77033,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-ram-nagar",
    "name": "Ram Nagar",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.90391,
    "longitude": 75.77881,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-civil-lines",
    "name": "Civil Lines",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.9124,
    "longitude": 75.7873,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-railway-station",
    "name": "Railway Station",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.92089,
    "longitude": 75.79579,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-sindhi-camp",
    "name": "Sindhi Camp",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.92937,
    "longitude": 75.80427,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-chandpole",
    "name": "Chandpole",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.93786,
    "longitude": 75.81276,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-chhoti-chaupar",
    "name": "Chhoti Chaupar",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.94634,
    "longitude": 75.82124,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "jai-l1-badi-chaupar",
    "name": "Badi Chaupar",
    "cityId": "jaipur",
    "lineIds": [
      "jai-pink"
    ],
    "latitude": 26.95483,
    "longitude": 75.82973,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  }
];

export const JAIPUR_LINES_CONFIG: MetroLine[] = [
  {
    "id": "jai-pink",
    "name": "Pink Line",
    "hindiName": "पिंक लाइन",
    "code": "L1",
    "color": "#EC4899",
    "textColor": "#FFFFFF",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "jai-l1-mansarovar",
      "jai-l1-new-aatish-market",
      "jai-l1-vivek-vihar",
      "jai-l1-shyam-nagar",
      "jai-l1-ram-nagar",
      "jai-l1-civil-lines",
      "jai-l1-railway-station",
      "jai-l1-sindhi-camp",
      "jai-l1-chandpole",
      "jai-l1-chhoti-chaupar",
      "jai-l1-badi-chaupar"
    ]
  }
];
