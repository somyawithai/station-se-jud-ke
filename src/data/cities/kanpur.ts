import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const KANPUR_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "kan-l1-iit-kanpur",
    "name": "IIT Kanpur",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.40747,
    "longitude": 80.28947,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "kan-l1-kalyanpur",
    "name": "Kalyanpur",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.414,
    "longitude": 80.296,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-spm-hospital",
    "name": "SPM Hospital",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.42053,
    "longitude": 80.30253,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-vishwavidyalaya",
    "name": "Vishwavidyalaya",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.42706,
    "longitude": 80.30906,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-gurudev-chauraha",
    "name": "Gurudev Chauraha",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.43358,
    "longitude": 80.31558,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-geeta-nagar",
    "name": "Geeta Nagar",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.44011,
    "longitude": 80.32211,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-rawatpur",
    "name": "Rawatpur",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.44664,
    "longitude": 80.32864,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-llr-hospital",
    "name": "LLR Hospital",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.45316,
    "longitude": 80.33516,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-motijheel",
    "name": "Motijheel",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.45969,
    "longitude": 80.34169,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-chunniganj",
    "name": "Chunniganj",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.46622,
    "longitude": 80.34822,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-naveen-market",
    "name": "Naveen Market",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.47274,
    "longitude": 80.35474,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-bada-chauraha",
    "name": "Bada Chauraha",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.47927,
    "longitude": 80.36127,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-nayaganj",
    "name": "Nayaganj",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.4858,
    "longitude": 80.3678,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "kan-l1-kanpur-central",
    "name": "Kanpur Central",
    "cityId": "kanpur",
    "lineIds": [
      "kan-orange"
    ],
    "latitude": 26.49233,
    "longitude": 80.37433,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  }
];

export const KANPUR_LINES_CONFIG: MetroLine[] = [
  {
    "id": "kan-orange",
    "name": "Orange Line",
    "hindiName": "ऑरेंज लाइन",
    "code": "L1",
    "color": "#F97316",
    "textColor": "#FFFFFF",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "kan-l1-iit-kanpur",
      "kan-l1-kalyanpur",
      "kan-l1-spm-hospital",
      "kan-l1-vishwavidyalaya",
      "kan-l1-gurudev-chauraha",
      "kan-l1-geeta-nagar",
      "kan-l1-rawatpur",
      "kan-l1-llr-hospital",
      "kan-l1-motijheel",
      "kan-l1-chunniganj",
      "kan-l1-naveen-market",
      "kan-l1-bada-chauraha",
      "kan-l1-nayaganj",
      "kan-l1-kanpur-central"
    ]
  }
];
