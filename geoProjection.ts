import { geoMercator, geoPath, geoGraticule, GeoPath, GeoProjection } from 'd3-geo';
import { INDIA_GEO_DATA, INDIA_STATES_GEO_DATA } from '../data/indiaGeoData';

export interface SvgPoint {
  x: number;
  y: number;
}

export interface StatePathItem {
  id: string;
  name: string;
  code?: string;
  path: string;
}

// Canonical viewBox dimensions for India geographic map (tightly fitted to maximize map scale and reduce empty margins)
export const DEFAULT_MAP_DIMENSIONS = {
  width: 990,
  height: 1060,
  padding: 12,
};

/**
 * Creates an authentic D3 Mercator projection fitted strictly to India's GeoJSON bounding box.
 */
export function createIndiaProjection(
  width = DEFAULT_MAP_DIMENSIONS.width,
  height = DEFAULT_MAP_DIMENSIONS.height,
  padding = DEFAULT_MAP_DIMENSIONS.padding
): GeoProjection {
  const projection = geoMercator();

  projection.fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    INDIA_GEO_DATA
  );

  return projection;
}

/**
 * Creates a D3 GeoPath generator with the specified projection.
 */
export function createPathGenerator(projection: GeoProjection): GeoPath<any, any> {
  return geoPath().projection(projection);
}

/**
 * Generates subtle cartographic graticule (latitude / longitude grid lines) for India map
 */
export function generateGraticulesPath(
  pathGenerator: GeoPath<any, any>,
  step: [number, number] = [4, 4]
): string {
  const graticule = geoGraticule()
    .step(step)
    .extentMajor([
      [66, 6],
      [99, 38],
    ])
    .extentMinor([
      [66, 6],
      [99, 38],
    ]);

  return pathGenerator(graticule()) || '';
}

/**
 * Projects real geographic coordinates [longitude, latitude] to SVG coordinates [x, y]
 * using the provided or default D3 projection.
 */
export function projectLatLng(
  lat: number,
  lng: number,
  projection?: GeoProjection
): SvgPoint {
  const proj = projection || defaultProjection;
  const projected = proj([lng, lat]);

  if (!projected) {
    return { x: 480, y: 540 };
  }

  return {
    x: Math.round(projected[0] * 10) / 10,
    y: Math.round(projected[1] * 10) / 10,
  };
}

// Global default instance for fast lookup
export const defaultProjection = createIndiaProjection();
export const defaultPathGenerator = createPathGenerator(defaultProjection);

/**
 * Computes SVG paths for all individual Indian states from the real GeoJSON dataset
 */
export function getIndiaStatePaths(pathGenerator = defaultPathGenerator): StatePathItem[] {
  return INDIA_STATES_GEO_DATA.features.map((feature: any, idx: number) => ({
    id: feature.id || `state-${idx}`,
    name: feature.properties?.name || `State ${idx}`,
    code: feature.properties?.code,
    path: pathGenerator(feature) || '',
  }));
}

// Helper to extract boundary topologies from GeoJSON polygons
function buildBoundaryGeometries() {
  const segmentMap = new Map<string, { count: number; p1: [number, number]; p2: [number, number] }>();

  function normPt(p: [number, number]) {
    return `${p[0].toFixed(4)},${p[1].toFixed(4)}`;
  }

  function makeKey(p1: [number, number], p2: [number, number]) {
    const k1 = normPt(p1);
    const k2 = normPt(p2);
    return k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
  }

  INDIA_STATES_GEO_DATA.features.forEach((f: any) => {
    const geom = f.geometry;
    const polys: [number, number][][][] =
      geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

    polys.forEach((poly) => {
      poly.forEach((ring) => {
        for (let i = 0; i < ring.length - 1; i++) {
          const p1 = ring[i] as [number, number];
          const p2 = ring[i + 1] as [number, number];
          const key = makeKey(p1, p2);

          if (!segmentMap.has(key)) {
            segmentMap.set(key, { count: 0, p1, p2 });
          }
          segmentMap.get(key)!.count++;
        }
      });
    });
  });

  // Chain adjacent segments into continuous linestrings for smooth SVG rendering
  function chainSegments(rawSegments: [number, number][][]) {
    const adj = new Map<string, string[]>();
    const ptMap = new Map<string, [number, number]>();

    function addEdge(u: string, v: string) {
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u)!.push(v);
    }

    rawSegments.forEach(([p1, p2]) => {
      const k1 = normPt(p1);
      const k2 = normPt(p2);
      ptMap.set(k1, p1);
      ptMap.set(k2, p2);
      addEdge(k1, k2);
      addEdge(k2, k1);
    });

    const visitedEdges = new Set<string>();
    function edgeKey(k1: string, k2: string) {
      return k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
    }

    const lines: [number, number][][] = [];

    for (const startNode of adj.keys()) {
      const neighbors = adj.get(startNode) || [];
      for (const nextNode of neighbors) {
        const eKey = edgeKey(startNode, nextNode);
        if (visitedEdges.has(eKey)) continue;
        visitedEdges.add(eKey);

        const path: [number, number][] = [ptMap.get(startNode)!, ptMap.get(nextNode)!];
        let curr = nextNode;
        let prev = startNode;

        while (true) {
          const currNeighbors = adj.get(curr) || [];
          let next: string | null = null;
          for (const n of currNeighbors) {
            if (n !== prev && !visitedEdges.has(edgeKey(curr, n))) {
              next = n;
              break;
            }
          }
          if (!next) break;
          visitedEdges.add(edgeKey(curr, next));
          path.push(ptMap.get(next)!);
          prev = curr;
          curr = next;
        }
        lines.push(path);
      }
    }
    return lines;
  }

  const outerSegments: [number, number][][] = [];
  const innerSegments: [number, number][][] = [];

  for (const { count, p1, p2 } of segmentMap.values()) {
    if (count === 1) {
      outerSegments.push([p1, p2]);
    } else {
      innerSegments.push([p1, p2]);
    }
  }

  return {
    outerMultiLine: {
      type: 'MultiLineString' as const,
      coordinates: chainSegments(outerSegments),
    },
    innerMultiLine: {
      type: 'MultiLineString' as const,
      coordinates: chainSegments(innerSegments),
    },
  };
}

const precomputedBoundaries = buildBoundaryGeometries();

/**
 * Returns the SVG path data for the outer national silhouette boundary of India.
 */
export function getIndiaOuterBoundaryPath(pathGenerator = defaultPathGenerator): string {
  return pathGenerator(INDIA_GEO_DATA) || '';
}

/**
 * Returns the SVG path data for internal state-to-state dividing boundaries.
 */
export function getIndiaInternalBoundariesPath(pathGenerator = defaultPathGenerator): string {
  return pathGenerator(precomputedBoundaries.innerMultiLine) || '';
}
