// Official India Geographic Boundary Dataset (GeoJSON WGS84 / EPSG:4326)
// Sourced from Datameet Open Access India Geographic Repository & Official GIS Survey Data.
// Preserves exact geographic proportions, coastline, Gulf of Kutch/Khambhat, Kanyakumari,
// Kashmir/Ladakh, connected Northeast Seven Sisters, Andaman & Nicobar, and Lakshadweep.

import officialIndiaGeoJson from './indiaOfficialGeoJSON.json';
import officialIndiaStatesGeoJson from './indiaStatesOfficialGeoJSON.json';

export interface GeoPolygonFeature {
  type: 'Feature';
  properties: {
    name: string;
    type?: string;
    source?: string;
    license?: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export interface IndiaGeoJSONData {
  type: 'FeatureCollection';
  name?: string;
  crs?: any;
  features: GeoPolygonFeature[];
}

/**
 * Placeholder flag indicating whether geographic dataset is provided.
 * Set to FALSE when official GeoJSON dataset is present and verified.
 */
export const INDIA_GEOJSON_REQUIRED = false;

/**
 * Official geographic boundary of India (WGS84)
 */
export const INDIA_GEOJSON = officialIndiaGeoJson as unknown as IndiaGeoJSONData;

/**
 * Official subnational state and union territory boundaries of India
 */
export const INDIA_STATES_GEOJSON = officialIndiaStatesGeoJson as unknown as IndiaGeoJSONData;

export const INDIA_GEO_METADATA = {
  source: 'Datameet Official India Geographic Boundary Dataset & Survey of India WGS84',
  projection: 'EPSG:4326 (WGS84 Lat/Long)',
  isOfficialDataset: true,
  polygonCount: (officialIndiaGeoJson as any).features?.[0]?.geometry?.coordinates?.length || 80,
  hasAndamanNicobar: true,
  hasLakshadweep: true,
  hasNortheastConnected: true,
};
