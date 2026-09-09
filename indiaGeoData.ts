import { FeatureCollection, Geometry } from 'geojson';
import indiaBoundaryData from './indiaOfficialGeoJSON.json';
import indiaStatesData from './indiaStatesOfficialGeoJSON.json';

export interface IndiaGeoFeature {
  type: 'Feature';
  id: string;
  properties: {
    name: string;
    code?: string;
    type?: 'national_boundary' | 'state_boundary' | 'island_group' | 'territory';
  };
  geometry: Geometry;
}

// These two reference assets are deliberately separate.  The official national
// geometry provides the one authoritative outer silhouette; the states dataset
// is used only for low-contrast internal context lines.
export const INDIA_GEO_DATA: FeatureCollection = indiaBoundaryData as unknown as FeatureCollection;
export const INDIA_STATES_GEO_DATA: FeatureCollection = indiaStatesData as unknown as FeatureCollection;
