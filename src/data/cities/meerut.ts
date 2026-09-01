import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const MEERUT_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "mee-mm-meerut-south",
    "name": "Meerut South",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.94207,
    "longitude": 77.66397,
    "isInterchange": true,
    "interchangeLines": [
      "Meerut Metro",
      "Delhi–Meerut Namo Bharat (RRTS)"
    ],
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "mee-mm-partapur",
    "name": "Partapur",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.94979,
    "longitude": 77.67169,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-rithani",
    "name": "Rithani",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.9575,
    "longitude": 77.6794,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-shatabdi-nagar",
    "name": "Shatabdi Nagar",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.96522,
    "longitude": 77.68712,
    "isInterchange": true,
    "interchangeLines": [
      "Meerut Metro",
      "Delhi–Meerut Namo Bharat (RRTS)"
    ],
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-brahmapuri",
    "name": "Brahmapuri",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.97293,
    "longitude": 77.69483,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-meerut-central",
    "name": "Meerut Central",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.98064,
    "longitude": 77.70254,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-bhaisali",
    "name": "Bhaisali",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.98836,
    "longitude": 77.71026,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-begumpul",
    "name": "Begumpul",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 28.99607,
    "longitude": 77.71797,
    "isInterchange": true,
    "interchangeLines": [
      "Meerut Metro",
      "Delhi–Meerut Namo Bharat (RRTS)"
    ],
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-mes-colony",
    "name": "MES Colony",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 29.00378,
    "longitude": 77.72568,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-daurli",
    "name": "Daurli",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 29.0115,
    "longitude": 77.7334,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-meerut-north",
    "name": "Meerut North",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 29.01921,
    "longitude": 77.74111,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "mee-mm-modipuram",
    "name": "Modipuram",
    "cityId": "meerut",
    "lineIds": [
      "mee-metro"
    ],
    "latitude": 29.02693,
    "longitude": 77.74883,
    "isInterchange": true,
    "interchangeLines": [
      "Meerut Metro",
      "Delhi–Meerut Namo Bharat (RRTS)"
    ],
    "isTerminal": true,
    "status": "operational"
  }
];

export const MEERUT_LINES_CONFIG: MetroLine[] = [
  {
    "id": "mee-metro",
    "name": "Meerut Metro",
    "hindiName": "मेरठ मेट्रो",
    "code": "MM",
    "color": "#EF4444",
    "textColor": "#FFFFFF",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "mee-mm-meerut-south",
      "mee-mm-partapur",
      "mee-mm-rithani",
      "mee-mm-shatabdi-nagar",
      "mee-mm-brahmapuri",
      "mee-mm-meerut-central",
      "mee-mm-bhaisali",
      "mee-mm-begumpul",
      "mee-mm-mes-colony",
      "mee-mm-daurli",
      "mee-mm-meerut-north",
      "mee-mm-modipuram"
    ]
  }
];
