import { feature } from 'topojson-client';
import worldAtlasData from './worldAtlas110m.json';
import { INDIA_GEOJSON, INDIA_STATES_GEOJSON } from './indiaGeoData';

const worldAtlas = worldAtlasData as any;

// 1. Extracted World Land Feature (All Continents)
export const WORLD_LAND_GEOJSON = feature(worldAtlas, worldAtlas.objects.land) as any;
export const WORLD_LAND_FEATURE = WORLD_LAND_GEOJSON;

// 2. Extracted Individual Country Features across the globe
export const WORLD_COUNTRIES_GEOJSON = feature(worldAtlas, worldAtlas.objects.countries) as any;
export const WORLD_COUNTRIES_FEATURE = WORLD_COUNTRIES_GEOJSON;

// 3. Earth Sphere definition for ocean rendering
export const EARTH_SPHERE_GEOJSON = { type: 'Sphere' as const };
export const EARTH_SPHERE_FEATURE = EARTH_SPHERE_GEOJSON;

// 4. Surrounding countries around South Asia
export const SOUTH_ASIA_SURROUNDING_COUNTRIES = WORLD_COUNTRIES_GEOJSON.features.filter(
  (f: any) => f.id !== '356' && f.id !== 356
);

export { INDIA_GEOJSON, INDIA_STATES_GEOJSON };
