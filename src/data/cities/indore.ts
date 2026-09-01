import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const INDORE_RAW_STATIONS: RawStationGeoData[] = [
  {
    "id": "ind-l3-devi-ahilya-bai-holkar-terminal",
    "name": "Devi Ahilya Bai Holkar Terminal",
    "cityId": "indore",
    "lineIds": [
      "ind-yellow"
    ],
    "latitude": 22.67717,
    "longitude": 75.81527,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  },
  {
    "id": "ind-l3-maharani-lakshmi-bai",
    "name": "Maharani Lakshmi Bai",
    "cityId": "indore",
    "lineIds": [
      "ind-yellow"
    ],
    "latitude": 22.69839,
    "longitude": 75.83649,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "ind-l3-rani-avanti-bai-lodhi",
    "name": "Rani Avanti Bai Lodhi",
    "cityId": "indore",
    "lineIds": [
      "ind-yellow"
    ],
    "latitude": 22.7196,
    "longitude": 75.8577,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "ind-l3-rani-durgavati",
    "name": "Rani Durgavati",
    "cityId": "indore",
    "lineIds": [
      "ind-yellow"
    ],
    "latitude": 22.74081,
    "longitude": 75.87891,
    "isInterchange": false,
    "isTerminal": false,
    "status": "operational"
  },
  {
    "id": "ind-l3-veerangana-jhalkari-bai",
    "name": "Veerangana Jhalkari Bai",
    "cityId": "indore",
    "lineIds": [
      "ind-yellow"
    ],
    "latitude": 22.76203,
    "longitude": 75.90013,
    "isInterchange": false,
    "isTerminal": true,
    "status": "operational"
  }
];

export const INDORE_LINES_CONFIG: MetroLine[] = [
  {
    "id": "ind-yellow",
    "name": "Yellow Line",
    "hindiName": "येलो लाइन",
    "code": "L3",
    "color": "#EAB308",
    "textColor": "#1C1917",
    "strokeWidth": 6,
    "status": "operational",
    "stationIds": [
      "ind-l3-devi-ahilya-bai-holkar-terminal",
      "ind-l3-maharani-lakshmi-bai",
      "ind-l3-rani-avanti-bai-lodhi",
      "ind-l3-rani-durgavati",
      "ind-l3-veerangana-jhalkari-bai"
    ]
  }
];
