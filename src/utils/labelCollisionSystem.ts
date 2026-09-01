import { NationalMetroSummary } from '../data/metroData';

export interface LabelPlacement {
  cityId: string;
  cityName: string;
  shortName: string;
  totalStations: number;
  // Exact Geographic node coordinates (Fixed real WGS84 projection, NEVER altered)
  nodeX: number;
  nodeY: number;
  // Label text anchor position and dimensions
  labelX: number;
  labelY: number;
  labelWidth: number;
  labelHeight: number;
  // Leader line anchor points
  attachX: number;
  attachY: number;
  leaderPath: string;
  hasLeaderLine: boolean;
  distance: number;
  angleDeg: number;
  directionName: string;
  textAnchor: 'start' | 'middle' | 'end';
}

export interface LabelCandidate {
  x: number;
  y: number;
  w: number;
  h: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  attachX: number;
  attachY: number;
  nodeX: number;
  nodeY: number;
  angle: number;
  dist: number;
  dirName: string;
  textAnchor: 'start' | 'middle' | 'end';
  score: number;
}

// Clean short names for minimal clutter-free rendering
export const CITY_SHORT_NAMES: Record<string, string> = {
  delhi: 'Delhi',
  mumbai: 'Mumbai',
  bengaluru: 'Bengaluru',
  hyderabad: 'Hyderabad',
  kolkata: 'Kolkata',
  chennai: 'Chennai',
  ahmedabad: 'Ahmedabad',
  pune: 'Pune',
  nagpur: 'Nagpur',
  kochi: 'Kochi',
  lucknow: 'Lucknow',
  kanpur: 'Kanpur',
  jaipur: 'Jaipur',
  agra: 'Agra',
  noida: 'Noida',
  gurugram: 'Gurugram',
  'navi-mumbai': 'Navi Mumbai',
  bhopal: 'Bhopal',
  indore: 'Indore',
  meerut: 'Meerut',
};

// 12 Cardinal, Ordinal, and Radial Search Vectors
export const RADIAL_DIRECTIONS: { name: string; angle: number; preferenceWeight: number }[] = [
  { name: 'top-right', angle: -35, preferenceWeight: 0.9 },
  { name: 'right', angle: 0, preferenceWeight: 0.95 },
  { name: 'north-northeast', angle: -65, preferenceWeight: 0.95 },
  { name: 'top', angle: -90, preferenceWeight: 1.0 },
  { name: 'bottom-right', angle: 35, preferenceWeight: 1.0 },
  { name: 'top-left', angle: -145, preferenceWeight: 1.05 },
  { name: 'left', angle: 180, preferenceWeight: 1.1 },
  { name: 'bottom-left', angle: 145, preferenceWeight: 1.15 },
  { name: 'bottom', angle: 90, preferenceWeight: 1.2 },
  { name: 'east-southeast', angle: 22, preferenceWeight: 1.0 },
  { name: 'west-northwest', angle: -160, preferenceWeight: 1.1 },
  { name: 'south-southwest', angle: 120, preferenceWeight: 1.2 },
];

// Distance tiers from immediate compact radius to extended radial callout
export const DISTANCE_TIERS = [14, 22, 32, 46, 62, 80, 100];

/**
 * Computes exact label bounding box for a given candidate direction and distance.
 */
export function computeCandidateBox(
  nodeX: number,
  nodeY: number,
  boxWidth: number,
  boxHeight: number,
  angleDeg: number,
  dist: number,
  dirName: string
): LabelCandidate {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const targetX = nodeX + dist * cos;
  const targetY = nodeY + dist * sin;

  let boxX: number;
  let boxY: number;
  let attachX: number;
  let attachY: number;
  let textAnchor: 'start' | 'middle' | 'end' = 'start';

  if (Math.abs(cos) >= 0.38) {
    if (cos > 0) {
      // Pointing Right: anchor is on the left
      boxX = targetX;
      boxY = targetY - boxHeight / 2;
      attachX = boxX;
      attachY = targetY;
      textAnchor = 'start';
    } else {
      // Pointing Left: anchor is on the right
      boxX = targetX - boxWidth;
      boxY = targetY - boxHeight / 2;
      attachX = boxX + boxWidth;
      attachY = targetY;
      textAnchor = 'end';
    }
  } else {
    if (sin > 0) {
      // Pointing Bottom
      boxX = targetX - boxWidth / 2;
      boxY = targetY;
      attachX = targetX;
      attachY = boxY;
      textAnchor = 'middle';
    } else {
      // Pointing Top
      boxX = targetX - boxWidth / 2;
      boxY = targetY - boxHeight;
      attachX = targetX;
      attachY = boxY + boxHeight;
      textAnchor = 'middle';
    }
  }

  return {
    x: boxX,
    y: boxY,
    w: boxWidth,
    h: boxHeight,
    x1: boxX,
    y1: boxY,
    x2: boxX + boxWidth,
    y2: boxY + boxHeight,
    attachX,
    attachY,
    nodeX,
    nodeY,
    angle: angleDeg,
    dist,
    dirName,
    textAnchor,
    score: 0,
  };
}

/**
 * Checks whether two bounding boxes overlap with an optional buffer margin.
 */
export function doBoxesOverlap(
  b1: { x1: number; y1: number; x2: number; y2: number },
  b2: { x1: number; y1: number; x2: number; y2: number },
  padding = 4
): boolean {
  return !(
    b1.x2 + padding < b2.x1 ||
    b1.x1 - padding > b2.x2 ||
    b1.y2 + padding < b2.y1 ||
    b1.y1 - padding > b2.y2
  );
}

/**
 * Checks if a candidate label box obscures other city nodes on the map.
 */
export function boxOverlapsNodes(
  box: { x1: number; y1: number; x2: number; y2: number; dist: number },
  allNodes: { id: string; x: number; y: number }[],
  ownNodeId: string,
  nodeRadius = 10
): boolean {
  for (const node of allNodes) {
    if (node.id === ownNodeId && box.dist < 18) continue;

    const closestX = Math.max(box.x1, Math.min(node.x, box.x2));
    const closestY = Math.max(box.y1, Math.min(node.y, box.y2));
    const dx = node.x - closestX;
    const dy = node.y - closestY;

    if (dx * dx + dy * dy < (nodeRadius + 2) * (nodeRadius + 2)) {
      return true;
    }
  }
  return false;
}

/**
 * Generates an aesthetic, crisp leader line SVG path connecting the geographic node to the label edge.
 */
export function generateLeaderLinePath(
  nodeX: number,
  nodeY: number,
  attachX: number,
  attachY: number
): string {
  const dx = attachX - nodeX;
  const dy = attachY - nodeY;
  const dist = Math.hypot(dx, dy);

  if (dist < 16) {
    return `M ${nodeX.toFixed(1)} ${nodeY.toFixed(1)} L ${attachX.toFixed(1)} ${attachY.toFixed(1)}`;
  }

  // Smooth curved leader line for clean visual aesthetic
  const midX = nodeX + dx * 0.45;
  const midY = nodeY + dy * 0.45;

  return `M ${nodeX.toFixed(1)} ${nodeY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${attachX.toFixed(1)} ${attachY.toFixed(1)}`;
}

/**
 * Global automatic label collision avoidance solver.
 * Finds optimal non-overlapping positions for all 20 metro cities while preserving exact node locations.
 */
export function computeGlobalCityLabelPlacements(
  hubs: NationalMetroSummary[],
  mapWidth = 760,
  mapHeight = 860,
  userSelectedCityIds: string[] = []
): Map<string, LabelPlacement> {
  // Compute clean dimensions for minimal text labels
  const hubMetadata = hubs.map((h) => {
    const isSelected = userSelectedCityIds.includes(h.id);
    const shortName = CITY_SHORT_NAMES[h.id] || h.name.split(' ')[0];
    const nameLen = shortName.length;
    // Compact minimal label width: approx 48px - 82px
    const boxWidth = isSelected
      ? Math.max(68, nameLen * 7.5 + 24)
      : Math.max(50, nameLen * 7.2 + 14);
    const boxHeight = 18;

    return {
      hub: h,
      shortName,
      w: boxWidth,
      h: boxHeight,
    };
  });

  // Calculate local density (number of other cities within 65px radius)
  const densityMap = new Map<string, number>();
  hubs.forEach((h1) => {
    let count = 0;
    hubs.forEach((h2) => {
      if (h1.id !== h2.id && Math.hypot(h1.x - h2.x, h1.y - h2.y) < 65) {
        count++;
      }
    });
    densityMap.set(h1.id, count);
  });

  // Specific high-priority directional seed preferences for dense clusters
  const directionalPriorities: Record<string, { preferredAngles: number[]; minDistance?: number }> = {
    // Delhi NCR cluster fan-out
    meerut: { preferredAngles: [-35, -45, -20], minDistance: 24 },
    delhi: { preferredAngles: [-135, -145, 180, -90], minDistance: 16 },
    gurugram: { preferredAngles: [-160, 145, 180, 135], minDistance: 20 },
    noida: { preferredAngles: [0, 22, 35, -20], minDistance: 18 },
    agra: { preferredAngles: [35, 45, 20, 0], minDistance: 16 },
    jaipur: { preferredAngles: [-145, -135, 180], minDistance: 16 },
    // UP cluster
    kanpur: { preferredAngles: [135, 145, 160], minDistance: 16 },
    lucknow: { preferredAngles: [-35, -20, 0], minDistance: 16 },
    // Western cluster
    mumbai: { preferredAngles: [-135, -90, -115], minDistance: 16 },
    'navi-mumbai': { preferredAngles: [180, 145, -160], minDistance: 18 },
    pune: { preferredAngles: [0, 35, -35], minDistance: 16 },
    ahmedabad: { preferredAngles: [-135, -90, -145], minDistance: 16 },
    indore: { preferredAngles: [35, 0, 45], minDistance: 16 },
    bhopal: { preferredAngles: [-35, -20, 0], minDistance: 16 },
  };

  // Sort hubs so denser regions are placed first
  const sortedHubs = [...hubMetadata].sort((a, b) => {
    const dDiff = (densityMap.get(b.hub.id) || 0) - (densityMap.get(a.hub.id) || 0);
    if (dDiff !== 0) return dDiff;
    return b.hub.totalStations - a.hub.totalStations;
  });

  // Build candidate pools for each hub
  const candidatePools = new Map<string, LabelCandidate[]>();

  sortedHubs.forEach(({ hub, w, h }) => {
    const candidates: LabelCandidate[] = [];
    const priority = directionalPriorities[hub.id];

    DISTANCE_TIERS.forEach((dist) => {
      if (priority?.minDistance && dist < priority.minDistance) return;

      RADIAL_DIRECTIONS.forEach((dir) => {
        const cand = computeCandidateBox(hub.x, hub.y, w, h, dir.angle, dist, dir.name);

        // Keep strictly inside canvas bounds
        if (
          cand.x1 >= 6 &&
          cand.x2 <= mapWidth - 6 &&
          cand.y1 >= 10 &&
          cand.y2 <= mapHeight - 10
        ) {
          let score = dist * 1.2 * dir.preferenceWeight;

          // Bonus if matching cluster priority direction
          if (priority?.preferredAngles?.includes(dir.angle)) {
            score -= 18;
          }

          cand.score = score;
          candidates.push(cand);
        }
      });
    });

    candidates.sort((a, b) => a.score - b.score);
    candidatePools.set(hub.id, candidates);
  });

  // Conflict-free assignment
  const placedCandidates = new Map<string, LabelCandidate>();
  const nodesSummary = hubs.map((h) => ({ id: h.id, x: h.x, y: h.y }));

  for (const { hub } of sortedHubs) {
    const candidates = candidatePools.get(hub.id) || [];
    let bestCand: LabelCandidate | null = null;
    let lowestCost = Infinity;

    for (const cand of candidates) {
      let conflicts = 0;

      // Check overlap with already placed labels
      for (const [, placedBox] of placedCandidates.entries()) {
        if (doBoxesOverlap(cand, placedBox, 4)) {
          conflicts += 2000;
        }
      }

      // Check overlap with other city nodes
      if (boxOverlapsNodes(cand, nodesSummary, hub.id, 9)) {
        conflicts += 1000;
      }

      const totalCost = conflicts + cand.score;
      if (totalCost < lowestCost) {
        lowestCost = totalCost;
        bestCand = cand;
        if (conflicts === 0 && cand.dist <= 26) {
          break;
        }
      }
    }

    placedCandidates.set(hub.id, bestCand || candidates[0]);
  }

  // Convert placed candidates into complete LabelPlacement map
  const resultMap = new Map<string, LabelPlacement>();

  hubMetadata.forEach(({ hub, shortName }) => {
    const placed = placedCandidates.get(hub.id);
    if (!placed) return;

    const hasLeader = placed.dist >= 16;
    const leaderPath = hasLeader
      ? generateLeaderLinePath(hub.x, hub.y, placed.attachX, placed.attachY)
      : '';

    resultMap.set(hub.id, {
      cityId: hub.id,
      cityName: hub.name,
      shortName,
      totalStations: hub.totalStations,
      nodeX: hub.x,
      nodeY: hub.y,
      labelX: placed.x,
      labelY: placed.y,
      labelWidth: placed.w,
      labelHeight: placed.h,
      attachX: placed.attachX,
      attachY: placed.attachY,
      leaderPath,
      hasLeaderLine: hasLeader,
      distance: placed.dist,
      angleDeg: placed.angle,
      directionName: placed.dirName,
      textAnchor: placed.textAnchor,
    });
  });

  return resultMap;
}
