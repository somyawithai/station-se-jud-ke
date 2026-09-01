export interface StationCoordinates {
  x: number;
  y: number;
}

export interface MetroStation {
  id: string;
  name: string;
  hindiName?: string;
  cityId: string;
  city?: string;
  system?: string; // Official metro authority name (e.g. DMRC, BMRCL, MMMOCL, Maha Metro, CMRL, KMRL)
  lineIds: string[];
  line?: string;
  sequence?: number; // Sequence along its primary line
  latitude: number;
  longitude: number;
  coordinates: StationCoordinates; // Projected/schematic visual coordinates for city canvas
  isInterchange?: boolean;
  interchangeLines?: string[];
  isTerminal?: boolean;
  zone?: string;
  landmark?: string;
  elevation?: 'underground' | 'elevated' | 'at-grade';
  status?: 'operational' | 'under-construction';
}

export interface MetroLine {
  id: string;
  name: string;
  hindiName?: string;
  code: string;
  color: string;
  textColor?: string;
  strokeWidth?: number;
  stationIds: string[];
  pathD?: string; // Optional custom SVG path definition
  status?: 'operational' | 'under-construction';
}

export interface CityMetroNetwork {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  systemName: string; // e.g. "Delhi Metro (DMRC)", "Namma Metro (BMRCL)", "Mumbai Metro (MMMOCL)"
  operator?: string;
  tagline: string;
  established?: number;
  establishedYear?: number;
  totalStations?: number;
  totalLines?: number;
  totalStationsCount?: number;
  totalLinesCount?: number;
  networkLengthKm: number;
  dailyRidership?: string;
  description?: string;
  centerCoordinates: [number, number]; // [lat, lng] on India map
  indiaMapPosition?: { x: number; y: number }; // Projected SVG coordinates for India map
  viewBox: {
    minX: number;
    minY: number;
    width: number;
    height: number;
  } | string;
  lines: MetroLine[];
  stations: MetroStation[];
  popularStations?: string[];
  status?: 'operational' | 'partial' | 'under-construction';
  dataPending?: boolean; // If station-level geo data is under verification
  category?: 'metro' | 'regional_rapid' | 'light_metro';
}

export interface NationalMetroSummary {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  latitude: number;
  longitude: number;
  isAvailableInV1: boolean;
  status: 'operational' | 'under_construction';
  totalStations: number;
  highlightStation: string;
  x: number;
  y: number;
}

export interface UpcomingMetroSystem {
  id: string;
  cityName: string;
  hindiName: string;
  state: string;
  systemName: string;
  status: 'under-construction' | 'approved' | 'proposed';
  expectedLaunch: string;
  networkLengthKm: number;
  corridorsCount: number;
  highlightCorridor: string;
  latitude: number;
  longitude: number;
}

export interface RrtsStation {
  id: string;
  name: string;
  hindiName?: string;
  latitude: number;
  longitude: number;
  sequence: number;
  isOperational: boolean;
  interchangeWithMetro?: string;
  landmark?: string;
}

export interface RrtsCorridor {
  id: string;
  name: string;
  hindiName: string;
  systemName: string; // "Namo Bharat / NCRTC RRTS"
  corridor: string; // "Delhi - Ghaziabad - Meerut"
  color: string;
  operationalLengthKm: number;
  fullLengthKm: number;
  stations: RrtsStation[];
}

export interface UserStationSelection {
  userId: string;
  userName?: string;
  cityId: string;
  cityName: string;
  stationId: string;
  stationName: string;
  stationHindiName?: string;
  lineIds: string[];
  lineColors: string[];
  confirmedAt: string;
}

export interface NationalAnalytics {
  totalVisitors: number;
  totalConfirmations: number;
  activeCitiesCount: number;
  citiesExploredTotal: number;
  returningUsersCount: number;
  mostSelectedStations: Array<{
    stationId: string;
    stationName: string;
    cityName: string;
    count: number;
  }>;
  cityConfirmations: Record<string, number>;
}
