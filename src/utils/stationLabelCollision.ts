import { MetroStation, MetroLine } from '../types';

export interface StationLabelPlacement {
  stationId: string;
  station: MetroStation;
  // Exact screen-space / canvas-space coordinates for the node
  nodeX: number;
  nodeY: number;
  // Label box position and dimensions
  labelX: number;
  labelY: number;
  labelWidth: number;
  labelHeight: number;
  // Text alignment & anchor
  textAnchor: 'start' | 'middle' | 'end';
  // Leader line info if moved away from dense cluster
  hasLeaderLine: boolean;
  leaderPath?: string;
  // Visual priority
  priority: number;
  isInterchange: boolean;
  isSelected: boolean;
  isHovered: boolean;
  // Visibility status determined by collision and zoom rules
  isVisible: boolean;
  opacity: number;
  // Reason / LOD category
  lodLevel: 'major' | 'normal' | 'detailed';
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface StationCandidatePlacement {
  labelX: number;
  labelY: number;
  labelWidth: number;
  labelHeight: number;
  attachX: number;
  attachY: number;
  textAnchor: 'start' | 'middle' | 'end';
  dist: number;
  angleDeg: number;
  box: BoundingBox;
  hasLeaderLine: boolean;
  penalty: number;
}

// 8 cardinal and ordinal positions
const STATION_DIRECTIONS: { name: string; angle: number; preference: number }[] = [
  { name: 'bottom', angle: 90, preference: 1.0 },
  { name: 'top', angle: -90, preference: 1.05 },
  { name: 'right', angle: 0, preference: 1.1 },
  { name: 'left', angle: 180, preference: 1.15 },
  { name: 'bottom-right', angle: 45, preference: 1.2 },
  { name: 'top-right', angle: -45, preference: 1.2 },
  { name: 'bottom-left', angle: 135, preference: 1.25 },
  { name: 'top-left', angle: -135, preference: 1.25 },
];

// Distance offsets in SVG canvas coordinates
const DISTANCE_OFFSETS = [14, 22, 32, 45, 60];

function checkBoxesIntersect(b1: BoundingBox, b2: BoundingBox, margin: number = 3): boolean {
  return !(
    b1.x2 + margin < b2.x1 ||
    b1.x1 - margin > b2.x2 ||
    b1.y2 + margin < b2.y1 ||
    b1.y1 - margin > b2.y2
  );
}

function checkPointInBox(x: number, y: number, box: BoundingBox, margin: number = 4): boolean {
  return (
    x >= box.x1 - margin &&
    x <= box.x2 + margin &&
    y >= box.y1 - margin &&
    y <= box.y2 + margin
  );
}

/**
 * Calculates priority score for a station:
 * Higher score = higher priority to keep visible.
 */
export function calculateStationPriority(
  station: MetroStation,
  selectedStationId?: string | null,
  hoveredStationId?: string | null,
  popularStationIds: string[] = []
): number {
  if (selectedStationId && station.id === selectedStationId) {
    return 10000;
  }
  if (hoveredStationId && station.id === hoveredStationId) {
    return 8000;
  }
  if (station.isInterchange) {
    const lineCount = (station.interchangeLines?.length || 1) + (station.lineIds.length > 1 ? station.lineIds.length : 1);
    return 4000 + lineCount * 200;
  }
  if (station.isTerminal) {
    return 3000;
  }
  if (popularStationIds.includes(station.id)) {
    return 2500;
  }
  // Normal stations
  return 1000 + (station.sequence || 0) % 10;
}

/**
 * Approximate text width for clean sans-serif/mono station typography
 */
function estimateStationLabelDimensions(
  name: string,
  hasHindi: boolean = false,
  scaleFactor: number = 1
): { width: number; height: number } {
  // Base font size in SVG units is ~11px for English name
  const charWidth = 6.4;
  const englishWidth = Math.max(name.length * charWidth + 12, 42);
  const height = hasHindi ? 24 : 15;
  return {
    width: englishWidth,
    height: height,
  };
}

/**
 * Computes progressive disclosure zoom levels:
 * - LOD 1 (Far zoom < 0.9): Only Major/Interchange stations, or ~15-25%
 * - LOD 2 (Medium zoom 0.9 - 1.4): Major + high-priority normal stations, ~40-60%
 * - LOD 3 (Close zoom 1.4 - 2.2): Most stations, ~75-90%
 * - LOD 4 (Very close zoom >= 2.2): All visible non-colliding stations, ~100%
 */
export function computeStationLabelPlacements(
  stations: MetroStation[],
  lines: MetroLine[],
  currentScale: number,
  viewBox: { minX: number; minY: number; width: number; height: number },
  viewportWidth: number,
  selectedStationId?: string | null,
  hoveredStationId?: string | null,
  popularStations: string[] = []
): Map<string, StationLabelPlacement> {
  const resultMap = new Map<string, StationLabelPlacement>();
  if (!stations || stations.length === 0) return resultMap;

  const isMobile = viewportWidth < 768;

  // Zoom LOD thresholds adapted for screen size
  const lod = {
    isFar: currentScale < (isMobile ? 0.95 : 0.85),
    isMedium: currentScale >= (isMobile ? 0.95 : 0.85) && currentScale < (isMobile ? 1.45 : 1.35),
    isClose: currentScale >= (isMobile ? 1.45 : 1.35) && currentScale < (isMobile ? 2.1 : 1.9),
    isVeryClose: currentScale >= (isMobile ? 2.1 : 1.9),
  };

  // 1. Sort stations by priority descending (Selected > Hovered > Interchange > Terminal > Major > Normal)
  const prioritizedStations = [...stations].map((st) => ({
    station: st,
    priority: calculateStationPriority(st, selectedStationId, hoveredStationId, popularStations),
  }));

  prioritizedStations.sort((a, b) => b.priority - a.priority);

  // Store placed bounding boxes and all station node locations
  const placedBoxes: BoundingBox[] = [];
  const allNodeLocations = stations.map((s) => ({
    id: s.id,
    x: s.coordinates.x,
    y: s.coordinates.y,
    radius: s.isInterchange ? 9 : 6.5,
  }));

  // Track station density in local spatial clusters (to prevent cluster over-saturation at low zooms)
  const placedLocations: { x: number; y: number; id: string }[] = [];

  for (const item of prioritizedStations) {
    const st = item.station;
    const isSelected = selectedStationId === st.id;
    const isHovered = hoveredStationId === st.id;
    const isInterchange = Boolean(st.isInterchange);
    const isTerminal = Boolean(st.isTerminal);

    const { width: boxWidth, height: boxHeight } = estimateStationLabelDimensions(
      st.name,
      Boolean(st.hindiName),
      1
    );

    // Zoom level gate: Filter low priority stations if far zoomed out
    let shouldAttemptPlacement = false;

    if (isSelected || isHovered) {
      shouldAttemptPlacement = true;
    } else if (lod.isFar) {
      // Far zoom: ONLY major interchanges and terminals
      shouldAttemptPlacement = isInterchange || isTerminal;
    } else if (lod.isMedium) {
      // Medium zoom: Interchanges, terminals, popular, or spaced normals
      if (isInterchange || isTerminal || popularStations.includes(st.id)) {
        shouldAttemptPlacement = true;
      } else {
        // Enforce minimum spatial distance to other placed labels at medium zoom
        const minDistanceThreshold = isMobile ? 65 : 48;
        const tooCloseToAnother = placedLocations.some(
          (p) => Math.hypot(p.x - st.coordinates.x, p.y - st.coordinates.y) < minDistanceThreshold
        );
        shouldAttemptPlacement = !tooCloseToAnother;
      }
    } else if (lod.isClose) {
      // Close zoom: show almost all stations unless heavily cramped
      const minDistanceThreshold = isMobile ? 32 : 22;
      const tooCloseToAnother = placedLocations.some(
        (p) => Math.hypot(p.x - st.coordinates.x, p.y - st.coordinates.y) < minDistanceThreshold
      );
      shouldAttemptPlacement = isInterchange || !tooCloseToAnother;
    } else {
      // Very close zoom: attempt placement for every single station
      shouldAttemptPlacement = true;
    }

    if (!shouldAttemptPlacement) {
      // Station node is rendered, but label is hidden at this zoom level
      resultMap.set(st.id, {
        stationId: st.id,
        station: st,
        nodeX: st.coordinates.x,
        nodeY: st.coordinates.y,
        labelX: st.coordinates.x,
        labelY: st.coordinates.y + 14,
        labelWidth: boxWidth,
        labelHeight: boxHeight,
        textAnchor: 'middle',
        hasLeaderLine: false,
        priority: item.priority,
        isInterchange,
        isSelected,
        isHovered,
        isVisible: false,
        opacity: 0,
        lodLevel: isInterchange ? 'major' : 'normal',
      });
      continue;
    }

    // 2. Candidate Position Search for Non-Overlapping Placement
    let bestCandidate: StationCandidatePlacement | null = null;
    let minPenalty = Infinity;

    // Evaluate 8 candidate directions across distance tiers
    for (const dir of STATION_DIRECTIONS) {
      for (const dist of DISTANCE_OFFSETS) {
        // At close zooms, prefer immediate compact offset (14 or 22)
        if (dist > 32 && !isInterchange && !isSelected && !lod.isFar) {
          continue;
        }

        const rad = (dir.angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const targetX = st.coordinates.x + dist * cos;
        const targetY = st.coordinates.y + dist * sin;

        let labelX: number;
        let labelY: number;
        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        let attachX = targetX;
        let attachY = targetY;

        if (Math.abs(cos) >= 0.4) {
          if (cos > 0) {
            // Right aligned
            labelX = targetX + 4;
            labelY = targetY - boxHeight / 2;
            textAnchor = 'start';
            attachX = labelX;
            attachY = targetY;
          } else {
            // Left aligned
            labelX = targetX - 4;
            labelY = targetY - boxHeight / 2;
            textAnchor = 'end';
            attachX = labelX;
            attachY = targetY;
          }
        } else {
          // Top or Bottom
          labelX = targetX;
          labelY = sin > 0 ? targetY + 2 : targetY - boxHeight - 2;
          textAnchor = 'middle';
          attachX = targetX;
          attachY = sin > 0 ? labelY : labelY + boxHeight;
        }

        // Bounding box with safety margin
        const bX1 = textAnchor === 'start' ? labelX : textAnchor === 'end' ? labelX - boxWidth : labelX - boxWidth / 2;
        const bY1 = labelY;
        const bX2 = bX1 + boxWidth;
        const bY2 = bY1 + boxHeight;

        const candidateBox: BoundingBox = { x1: bX1, y1: bY1, x2: bX2, y2: bY2 };

        // Check A: Overlap with already placed station labels
        let labelOverlapCount = 0;
        for (const pBox of placedBoxes) {
          if (checkBoxesIntersect(candidateBox, pBox, 4)) {
            labelOverlapCount++;
          }
        }

        // Check B: Overlap with other station nodes (do not cover subway dots)
        let nodeOverlapCount = 0;
        for (const otherNode of allNodeLocations) {
          if (otherNode.id !== st.id) {
            if (checkPointInBox(otherNode.x, otherNode.y, candidateBox, 6)) {
              nodeOverlapCount++;
            }
          }
        }

        // Score penalty
        let penalty = 0;
        if (labelOverlapCount > 0) {
          penalty += labelOverlapCount * 2000;
        }
        if (nodeOverlapCount > 0) {
          penalty += nodeOverlapCount * 1200;
        }

        // Penalty for distance and direction preference
        penalty += (dist - 14) * 5;
        penalty *= dir.preference;

        // Leader line needed if moved far from base node
        const hasLeaderLine = dist >= 22;

        if (penalty < minPenalty) {
          minPenalty = penalty;
          const leaderPath = hasLeaderLine
            ? `M ${st.coordinates.x} ${st.coordinates.y} L ${attachX} ${attachY}`
            : undefined;

          bestCandidate = {
            labelX,
            labelY,
            labelWidth: boxWidth,
            labelHeight: boxHeight,
            attachX,
            attachY,
            textAnchor,
            dist,
            angleDeg: dir.angle,
            box: candidateBox,
            hasLeaderLine,
            penalty,
          };

          // If perfect zero-collision fit found at close distance, take it immediately
          if (penalty === 0 && dist === 14) {
            break;
          }
        }
      }

      if (minPenalty === 0 && bestCandidate?.dist === 14) {
        break;
      }
    }

    // Final decision: if selected or hovered, ALWAYS place even if forced
    const canPlace = isSelected || isHovered || (bestCandidate && bestCandidate.penalty < 1500);

    if (canPlace && bestCandidate) {
      placedBoxes.push(bestCandidate.box);
      placedLocations.push({ x: st.coordinates.x, y: st.coordinates.y, id: st.id });

      resultMap.set(st.id, {
        stationId: st.id,
        station: st,
        nodeX: st.coordinates.x,
        nodeY: st.coordinates.y,
        labelX: bestCandidate.labelX,
        labelY: bestCandidate.labelY,
        labelWidth: bestCandidate.labelWidth,
        labelHeight: bestCandidate.labelHeight,
        textAnchor: bestCandidate.textAnchor,
        hasLeaderLine: bestCandidate.hasLeaderLine,
        leaderPath: bestCandidate.hasLeaderLine
          ? `M ${st.coordinates.x} ${st.coordinates.y} L ${bestCandidate.attachX} ${bestCandidate.attachY}`
          : undefined,
        priority: item.priority,
        isInterchange,
        isSelected,
        isHovered,
        isVisible: true,
        opacity: 1,
        lodLevel: isInterchange ? 'major' : 'normal',
      });
    } else {
      // Hidden label to preserve pristine readability
      resultMap.set(st.id, {
        stationId: st.id,
        station: st,
        nodeX: st.coordinates.x,
        nodeY: st.coordinates.y,
        labelX: st.coordinates.x,
        labelY: st.coordinates.y + 14,
        labelWidth: boxWidth,
        labelHeight: boxHeight,
        textAnchor: 'middle',
        hasLeaderLine: false,
        priority: item.priority,
        isInterchange,
        isSelected,
        isHovered,
        isVisible: false,
        opacity: 0,
        lodLevel: isInterchange ? 'major' : 'normal',
      });
    }
  }

  return resultMap;
}
