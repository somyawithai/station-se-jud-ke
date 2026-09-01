import { geoMercator, geoPath, GeoProjection } from 'd3-geo';
import {
  INDIA_GEOJSON,
  INDIA_STATES_GEOJSON,
  INDIA_GEOJSON_REQUIRED,
  IndiaGeoJSONData,
} from '../data/indiaGeoData';

// Standard SVG canvas dimensions for India map viewport
export const INDIA_MAP_WIDTH = 760;
export const INDIA_MAP_HEIGHT = 860;

/**
 * Creates a calibrated D3 Mercator Projection fitted to the official India GeoJSON dataset.
 * Uses exact geographic bounding coordinates to ensure no manual approximations.
 */
export const createIndiaProjection = (
  width = INDIA_MAP_WIDTH,
  height = INDIA_MAP_HEIGHT,
  padding = 24
): GeoProjection => {
  return geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    INDIA_GEOJSON as any
  );
};

// Singleton projection instance for the national base map
export const defaultIndiaProjection = createIndiaProjection();

/**
 * Converts real geographic coordinates (latitude, longitude) into projected SVG (x, y) pixels.
 */
export const geoToSvgCoordinates = (
  latitude: number,
  longitude: number,
  projection = defaultIndiaProjection
): [number, number] => {
  const projected = projection([longitude, latitude]);
  if (!projected) return [0, 0];
  return [Number(projected[0].toFixed(2)), Number(projected[1].toFixed(2))];
};

/**
 * Generates the SVG path string for India's official geographic boundary (Layer 1 Base Map).
 */
export const getIndiaBoundarySvgPaths = (projection = defaultIndiaProjection): string[] => {
  const pathGenerator = geoPath().projection(projection);
  if (!INDIA_GEOJSON || !INDIA_GEOJSON.features) return [];
  return INDIA_GEOJSON.features
    .map((feature) => pathGenerator(feature as any) || '')
    .filter(Boolean);
};

/**
 * Generates SVG path strings for all internal state boundaries of India.
 */
export const getIndiaStateBoundarySvgPaths = (projection = defaultIndiaProjection): { name: string; path: string }[] => {
  const pathGenerator = geoPath().projection(projection);
  if (!INDIA_STATES_GEOJSON || !INDIA_STATES_GEOJSON.features) return [];
  return INDIA_STATES_GEOJSON.features.map((feature) => ({
    name: feature.properties?.name || 'State',
    path: pathGenerator(feature as any) || '',
  })).filter((s) => Boolean(s.path));
};

/**
 * Creates a zoomed projection for a specific city's geographic bounding area,
 * preserving the exact same geographic coordinate system.
 */
export const createCityGeographicProjection = (
  centerLat: number,
  centerLng: number,
  radiusDegrees = 0.45,
  width = 1000,
  height = 800
): GeoProjection => {
  const minLng = centerLng - radiusDegrees;
  const maxLng = centerLng + radiusDegrees;
  const minLat = centerLat - radiusDegrees * 0.8;
  const maxLat = centerLat + radiusDegrees * 0.8;

  const bboxPolygon = {
    type: 'Polygon',
    coordinates: [
      [
        [minLng, minLat],
        [maxLng, minLat],
        [maxLng, maxLat],
        [minLng, maxLat],
        [minLng, minLat],
      ],
    ],
  };

  return geoMercator().fitExtent(
    [
      [80, 80],
      [width - 80, height - 80],
    ],
    bboxPolygon as any
  );
};
