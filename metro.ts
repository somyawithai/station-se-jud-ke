export type Region = 'North' | 'West' | 'South' | 'East' | 'Central';

export interface MetroStation {
  id: string;
  name: string;
  stationNumber: number;
  lineId: string;
  lineName: string;
  cityName: string;
  isInterchange: boolean;
  interchangeWith?: string[];
  interchangeNote?: string;
  sourceUrl?: string;
  status: 'Active' | 'Operational' | 'Under Construction' | 'Depot';
}

export interface MetroLine {
  id: string;
  name: string;
  colorName: string; // e.g. "Blue Line", "Aqua Line"
  colorHex: string;
  textColorHex?: string;
  status: string;
  stationCount: number;
  firstStation: string;
  lastStation: string;
  stations: string[]; // Ordered list of station names
  interchangeStations: string[];
  sourceUrl?: string;
  mapPage?: number | string;
}

export interface MetroCity {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  region: Region;
  // Geographical coordinates for India SVG Map projection
  coordinates: {
    x: number; // Percentage or SVG coordinate in viewBox 0 0 1000 1100
    y: number;
    lat: number;
    lng: number;
  };
  activeLinesCount: number;
  totalStationsCount: number;
  interchangeCount: number;
  status: 'Operational' | 'Partially Operational' | 'Regional Transit';
  description: string;
  pdfPage: number | string;
  mapType: string;
  notes?: string;
  lines: MetroLine[];
}

export interface InterchangeRecord {
  city: string;
  stationName: string;
  connectedLines: string;
  detectionNotes: string;
}

export interface ExcelDatasetAudit {
  citiesDetected: number;
  metroLinesDetected: number;
  totalStationRecords: number;
  columnsFound: {
    sheetName: string;
    columns: string[];
  }[];
  missingDataNotes: string[];
  duplicateDataNotes: string[];
}
