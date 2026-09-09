import { MetroCity, MetroLine } from '../types/metro';
import { getStationIdentity, stationNamesMatch } from './stationIdentity';

export interface StationLayoutNode {
  id: string;
  name: string;
  lineId: string;
  lineName: string;
  lineColor: string;
  stationNumber: number;
  isInterchange: boolean;
  isFirst: boolean;
  isLast: boolean;
  connectedLines: { id: string; name: string; color: string }[];
  x: number;
  y: number;
  labelPosition: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  labelAngle: number;
  labelOffsetX: number;
  labelOffsetY: number;
}

export interface LineLayoutPath {
  lineId: string;
  lineName: string;
  lineColor: string;
  textColor?: string;
  stationCount: number;
  pathD: string; // SVG path string
  points: { x: number; y: number }[];
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  firstStation: string;
  lastStation: string;
}

export interface CitySchematicLayout {
  width: number;
  height: number;
  lines: LineLayoutPath[];
  stations: StationLayoutNode[];
  interchanges: {
    name: string;
    x: number;
    y: number;
    lines: { id: string; name: string; color: string }[];
  }[];
}

/**
 * Helper to build smooth SVG path with rounded 45-degree and 90-degree corners
 */
function buildSvgPath(points: { x: number; y: number }[], cornerRadius = 14): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const r = Math.min(cornerRadius, len1 / 2, len2 / 2);

    if (r > 0) {
      const p1x = curr.x - (dx1 / len1) * r;
      const p1y = curr.y - (dy1 / len1) * r;
      const p2x = curr.x + (dx2 / len2) * r;
      const p2y = curr.y + (dy2 / len2) * r;

      d += ` L ${p1x} ${p1y} Q ${curr.x} ${curr.y} ${p2x} ${p2y}`;
    } else {
      d += ` L ${curr.x} ${curr.y}`;
    }
  }

  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
}

type LabelPosition = StationLayoutNode['labelPosition'];

interface LabelPlacement {
  position: LabelPosition;
  offsetX: number;
  offsetY: number;
  angle: number;
}

interface LabelBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const LABEL_DIRECTIONS: {
  position: LabelPosition;
  x: number;
  y: number;
  angle: number;
}[] = [
  { position: 'top-right', x: 14, y: -14, angle: 0 },
  { position: 'top-left', x: -14, y: -14, angle: 0 },
  { position: 'bottom-right', x: 14, y: 14, angle: 0 },
  { position: 'bottom-left', x: -14, y: 14, angle: 0 },
  { position: 'top', x: 0, y: -18, angle: 0 },
  { position: 'bottom', x: 0, y: 18, angle: 0 },
  { position: 'right', x: 18, y: 0, angle: 0 },
  { position: 'left', x: -18, y: 0, angle: 0 },
  // A vertical fallback is useful at dense interchange hubs. It keeps the
  // marker at the exact route coordinate while giving the name a narrow lane.
  { position: 'right', x: 22, y: 0, angle: 90 },
  { position: 'left', x: -22, y: 0, angle: 90 },
];

function defaultLabelOffset(position: LabelPosition): { x: number; y: number } {
  switch (position) {
    case 'top':
      return { x: 0, y: -16 };
    case 'bottom':
      return { x: 0, y: 16 };
    case 'left':
      return { x: -16, y: 0 };
    case 'right':
      return { x: 16, y: 0 };
    case 'top-left':
      return { x: -14, y: -14 };
    case 'bottom-left':
      return { x: -14, y: 14 };
    case 'top-right':
      return { x: 14, y: -14 };
    case 'bottom-right':
    default:
      return { x: 14, y: 14 };
  }
}

function labelBox(
  station: Pick<StationLayoutNode, 'name' | 'x' | 'y'>,
  placement: Pick<LabelPlacement, 'position' | 'offsetX' | 'offsetY' | 'angle'>,
): LabelBox {
  const width = Math.max(42, station.name.length * 6.5 + 12);
  const height = 18;
  const isVertical = Math.abs(placement.angle) === 90;
  const renderedWidth = isVertical ? height : width;
  const renderedHeight = isVertical ? width : height;
  const labelX = station.x + placement.offsetX;
  const labelY = station.y + placement.offsetY;
  const isLeft = placement.position.includes('left') || placement.position === 'left';
  const isCentered =
    placement.position === 'top' || placement.position === 'bottom';

  return {
    left: labelX + (isLeft ? -renderedWidth : isCentered ? -renderedWidth / 2 : 0) - 3,
    top: labelY - renderedHeight / 2 - 3,
    right: labelX + (isLeft ? 0 : isCentered ? renderedWidth / 2 : renderedWidth) + 3,
    bottom: labelY + renderedHeight / 2 + 3,
  };
}

function boxesOverlap(a: LabelBox, b: LabelBox): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/**
 * Keep station markers geographically accurate while giving nearby labels
 * their own readable lanes. This is intentionally layout-only: the station
 * coordinates and metro paths are never changed.
 */
function assignReadableLabelPlacements(
  stations: StationLayoutNode[],
  width: number,
  height: number,
): StationLayoutNode[] {
  const placedBoxes: LabelBox[] = [];

  return stations.map((station) => {
    const preferred = defaultLabelOffset(station.labelPosition);
    const candidates: LabelPlacement[] = [];

    // Try the station's original side first, then progressively farther
    // positions around the marker. The extra distance is only for the label.
    const orderedDirections = [
      {
        position: station.labelPosition,
        x: preferred.x,
        y: preferred.y,
        angle: 0,
      },
      ...LABEL_DIRECTIONS.filter(
        (direction) => direction.position !== station.labelPosition,
      ),
    ];

    orderedDirections.forEach((direction) => {
      [1, 1.45, 1.9].forEach((scale) => {
        candidates.push({
          position: direction.position,
          offsetX: direction.x * scale,
          offsetY: direction.y * scale,
          angle: direction.angle,
        });
      });
    });

    let best = candidates[0];
    let bestScore = Number.POSITIVE_INFINITY;

    candidates.forEach((candidate, candidateIndex) => {
      const box = labelBox(station, candidate);
      const collisionCount = placedBoxes.reduce(
        (count, placed) => count + (boxesOverlap(box, placed) ? 1 : 0),
        0,
      );
      const outOfBounds =
        Math.max(0, 10 - box.left) +
        Math.max(0, 10 - box.top) +
        Math.max(0, box.right - (width - 10)) +
        Math.max(0, box.bottom - (height - 10));
      const score = collisionCount * 10000 + outOfBounds * 100 + candidateIndex;

      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
    });

    placedBoxes.push(labelBox(station, best));
    const baseOffset = defaultLabelOffset(best.position);

    return {
      ...station,
      labelPosition: best.position,
      labelAngle: best.angle,
      labelOffsetX: Math.round(best.offsetX - baseOffset.x),
      labelOffsetY: Math.round(best.offsetY - baseOffset.y),
    };
  });
}

/**
 * Generates an optimized, highly readable schematic layout for any Indian Metro City network.
 * Accurately represents multi-line hubs (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Pune, Nagpur)
 * as well as linear and radial networks.
 */
export function generateCitySchematicLayout(city: MetroCity): CitySchematicLayout {
  const width = 1600;
  const height = 1100;
  const centerX = width / 2;
  const centerY = height / 2;

  const layoutLines: LineLayoutPath[] = [];
  const layoutStations: StationLayoutNode[] = [];

  // Track station positions by stable identity to align stations across
  // differently formatted display names.
  const interchangeCoords: Map<string, { x: number; y: number }> = new Map();

  // Find all interchange station identities across lines
  const interchangeMap: Map<string, { id: string; name: string; color: string }[]> = new Map();
  city.lines.forEach(line => {
    line.stations.forEach(stn => {
      const stationIdentity = getStationIdentity(city.id, stn);
      const isInter = line.interchangeStations.some((interchangeName) =>
        stationNamesMatch(city.id, interchangeName, stn),
      );
      if (isInter) {
        const existing = interchangeMap.get(stationIdentity) || [];
        if (!existing.some(l => l.id === line.id)) {
          existing.push({ id: line.id, name: line.name, color: line.colorHex });
        }
        interchangeMap.set(stationIdentity, existing);
      }
    });
  });

  // Assign schematic track routes based on city profile
  const lineCount = city.lines.length;

  if (city.id === 'delhi') {
    // Delhi Metro: Radial & Ring network schematic
    // Major anchor hubs with fixed iconic coordinates:
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Rajiv Chowk': { x: centerX, y: centerY },
      'Kashmere Gate': { x: centerX, y: centerY - 220 },
      'Central Secretariat': { x: centerX, y: centerY + 130 },
      'New Delhi': { x: centerX, y: centerY - 90 },
      'Mandi House': { x: centerX + 120, y: centerY },
      'Dilli Haat INA': { x: centerX, y: centerY + 260 },
      'Hauz Khas': { x: centerX, y: centerY + 380 },
      'Botanical Garden': { x: centerX + 520, y: centerY + 340 },
      'Janakpuri West': { x: centerX - 380, y: centerY + 140 },
      'Dwarka Sector 21': { x: centerX - 560, y: centerY + 290 },
      'Netaji Subhash Place': { x: centerX - 260, y: centerY - 180 },
      'Azadpur': { x: centerX - 150, y: centerY - 270 },
      'Welcome': { x: centerX + 340, y: centerY - 200 },
      'Anand Vihar ISBT': { x: centerX + 460, y: centerY - 30 },
      'Mayur Vihar I': { x: centerX + 320, y: centerY + 170 },
      'Lajpat Nagar': { x: centerX + 180, y: centerY + 280 },
      'Kalkaji Mandir': { x: centerX + 300, y: centerY + 380 },
      'Sikandarpur': { x: centerX - 80, y: centerY + 460 },
      'Inderlok': { x: centerX - 220, y: centerY - 100 },
      'Punjabi Bagh West': { x: centerX - 340, y: centerY - 70 },
      'Kirti Nagar': { x: centerX - 280, y: centerY + 40 },
      'Rajouri Garden': { x: centerX - 350, y: centerY + 40 },
      'Dwarka': { x: centerX - 480, y: centerY + 220 },
      'Majlis Park': { x: centerX - 120, y: centerY - 340 },
      'Samaypur Badli': { x: centerX, y: centerY - 460 },
      'Millennium City Centre Gurugram': { x: centerX - 90, y: centerY + 530 },
      'Rithala': { x: centerX - 480, y: centerY - 200 },
      'Shaheed Sthal (New Bus Adda)': { x: centerX + 540, y: centerY - 200 },
      'Noida Electronic City': { x: centerX + 580, y: centerY + 380 },
      'Vaishali': { x: centerX + 530, y: centerY - 30 },
      'Raja Nahar Singh (Ballabhgarh)': { x: centerX + 340, y: centerY + 530 },
      'Shiv Vihar': { x: centerX + 420, y: centerY - 340 },
      'Brigadier Hoshiar Singh': { x: centerX - 560, y: centerY - 70 },
      'Yashobhoomi Dwarka Sector 25': { x: centerX - 600, y: centerY + 320 },
      'Dhansa Bus Stand': { x: centerX - 560, y: centerY + 220 },
    };

    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'mumbai') {
    // Mumbai: North-South Coastal Corridors with East-West Crossings
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Ghatkopar': { x: centerX + 200, y: centerY + 50 },
      'Andheri': { x: centerX - 160, y: centerY + 50 },
      'Marol Naka': { x: centerX + 40, y: centerY + 50 },
      'DN Nagar': { x: centerX - 300, y: centerY + 50 },
      'Gundavali': { x: centerX - 120, y: centerY + 30 },
      'Aarey JVLR': { x: centerX - 40, y: centerY - 140 },
      'Dahisar East': { x: centerX - 100, y: centerY - 420 },
      'BKC': { x: centerX - 60, y: centerY + 240 },
      'Cuffe Parade': { x: centerX - 180, y: centerY + 480 },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'bengaluru') {
    // Bengaluru: East-West Purple, North-South Green, South-East Yellow
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Nadaprabhu Kempegowda Station Majestic': { x: centerX, y: centerY },
      'Jayaprakash Nagar': { x: centerX - 60, y: centerY + 260 },
      'Mahatma Gandhi Road': { x: centerX + 180, y: centerY },
      'Rashtreeya Vidyalaya Road': { x: centerX, y: centerY + 300 },
      'Silk Board': { x: centerX + 240, y: centerY + 340 },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'kolkata') {
    // Kolkata: North-South Blue, East-West Green, South-East Orange/Purple
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Esplanade': { x: centerX, y: centerY },
      'Howrah': { x: centerX - 240, y: centerY - 20 },
      'Salt Lake Sector V': { x: centerX + 340, y: centerY },
      'Kavi Subhash (New Garia)': { x: centerX + 40, y: centerY + 380 },
      'Dum Dum': { x: centerX + 30, y: centerY - 320 },
      'Noapara': { x: centerX, y: centerY - 380 },
      'Sealdah': { x: centerX + 120, y: centerY - 20 },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'hyderabad') {
    // Hyderabad: Triangle/Cross Interchanges (Ameerpet, Parade Ground, MGBS)
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Ameerpet': { x: centerX - 100, y: centerY - 60 },
      'Parade Ground': { x: centerX + 150, y: centerY - 160 },
      'MGBS (Mahatma Gandhi Bus Station)': { x: centerX + 80, y: centerY + 180 },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'ahmedabad') {
    // Ahmedabad: Cross at Old High Court + Ring
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Old High Court': { x: centerX, y: centerY },
      'Sabarmati': { x: centerX + 40, y: centerY - 220 },
      'Motera Stadium': { x: centerX + 40, y: centerY - 340 },
      'APMC': { x: centerX - 60, y: centerY + 340 },
      'Thaltej Gam': { x: centerX - 420, y: centerY },
      'Vastral Gam': { x: centerX + 420, y: centerY },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'pune') {
    // Pune: Cross at District Court / Civil Court
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Civil Court': { x: centerX, y: centerY },
      'District Court': { x: centerX, y: centerY },
      'Pune Railway Station': { x: centerX + 140, y: centerY - 40 },
      'Swargate': { x: centerX, y: centerY + 260 },
      'PCMC': { x: centerX, y: centerY - 360 },
      'Vanaz': { x: centerX - 360, y: centerY + 80 },
      'Ramwadi': { x: centerX + 360, y: centerY - 80 },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'nagpur') {
    // Nagpur: Cross at Sitabuldi
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Sitabuldi': { x: centerX, y: centerY },
      'Automotive Square': { x: centerX, y: centerY - 380 },
      'Khapri': { x: centerX, y: centerY + 380 },
      'Lokmanya Nagar': { x: centerX - 420, y: centerY },
      'Prajapati Nagar': { x: centerX + 420, y: centerY },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  } else if (city.id === 'chennai') {
    // Chennai: Blue Line Coastal & Green Line Loop meeting at Chennai Central & Alandur
    const fixedHubs: Record<string, { x: number; y: number }> = {
      'Puratchi Thalaivar Dr. M.G. Ramachandran Central': { x: centerX + 180, y: centerY - 280 },
      'Chennai Central': { x: centerX + 180, y: centerY - 280 },
      'Alandur': { x: centerX - 40, y: centerY + 180 },
      'Wimco Nagar Depot': { x: centerX + 180, y: centerY - 460 },
      'Chennai Airport': { x: centerX - 80, y: centerY + 380 },
      'St. Thomas Mount': { x: centerX + 20, y: centerY + 260 },
    };
    Object.entries(fixedHubs).forEach(([name, coords]) => {
      interchangeCoords.set(getStationIdentity(city.id, name), coords);
    });
  }

  // Iterate each line to compute its path and station coordinates
  city.lines.forEach((line, lineIndex) => {
    const stationCount = line.stations.length;
    const points: { x: number; y: number }[] = [];

    // Direction vector or corridor layout for this line
    let startX: number, startY: number, endX: number, endY: number;

    // Line orientation patterns
    if (lineCount === 1) {
      // Single line network (e.g. Agra, Jaipur, Noida, Lucknow, Kochi, Gurgaon, Kanpur, Navi Mumbai, Indore, Patna)
      // Diagonal / S-curve layout spanning across canvas with generous space
      const padding = 160;
      const effectiveW = width - padding * 2;
      const effectiveH = height - padding * 2;

      // Create a clean curved or snake track
      line.stations.forEach((stn, idx) => {
        const t = stationCount > 1 ? idx / (stationCount - 1) : 0.5;
        let px: number, py: number;

        if (stationCount <= 12) {
          // Linear diagonal or horizontal with gentle wave
          px = padding + t * effectiveW;
          py = centerY + Math.sin(t * Math.PI) * 120 * (idx % 2 === 0 ? 1 : 0.8) - 40;
        } else if (stationCount <= 25) {
          // Diagonal with S-curve
          px = padding + t * effectiveW;
          py = padding + t * effectiveH + Math.sin(t * Math.PI * 2) * 60;
        } else {
          // Serpentine multi-segment layout
          const rowCount = 3;
          const stationsPerRow = Math.ceil(stationCount / rowCount);
          const row = Math.floor(idx / stationsPerRow);
          const col = idx % stationsPerRow;
          const isReverse = row % 2 === 1;
          const colFrac = isReverse ? (stationsPerRow - 1 - col) / (stationsPerRow - 1 || 1) : col / (stationsPerRow - 1 || 1);

          px = padding + colFrac * effectiveW;
          py = padding + (row + 0.5) * (effectiveH / rowCount);
        }

        points.push({ x: Math.round(px), y: Math.round(py) });
      });
    } else {
      // Multi-line networks (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Pune, Nagpur)
      // Determine line trajectory angles based on line index or cardinal axes
      const angle = (lineIndex / lineCount) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(width, height) * 0.44;

      // Base endpoints if no fixed hubs found
      startX = centerX - Math.cos(angle) * radius;
      startY = centerY - Math.sin(angle) * radius;
      endX = centerX + Math.cos(angle) * radius;
      endY = centerY + Math.sin(angle) * radius;

      // Find all anchor stations (interchanges or terminals with fixed coordinates)
      const anchors: { idx: number; x: number; y: number }[] = [];

      line.stations.forEach((stn, idx) => {
        const fixed = interchangeCoords.get(getStationIdentity(city.id, stn));
        if (fixed) {
          anchors.push({ idx, x: fixed.x, y: fixed.y });
        }
      });

      // Ensure start (index 0) and end (index stationCount - 1) are anchored
      if (!anchors.some((a) => a.idx === 0)) {
        const lineOffset = (lineIndex - (lineCount - 1) / 2) * 24;
        const perpX = -Math.sin(angle) * lineOffset;
        const perpY = Math.cos(angle) * lineOffset;
        anchors.unshift({ idx: 0, x: Math.round(startX + perpX), y: Math.round(startY + perpY) });
      }

      if (!anchors.some((a) => a.idx === stationCount - 1)) {
        const lineOffset = (lineIndex - (lineCount - 1) / 2) * 24;
        const perpX = -Math.sin(angle) * lineOffset;
        const perpY = Math.cos(angle) * lineOffset;
        anchors.push({ idx: stationCount - 1, x: Math.round(endX + perpX), y: Math.round(endY + perpY) });
      }

      // Sort anchors strictly by station index
      anchors.sort((a, b) => a.idx - b.idx);

      // Piecewise interpolation between consecutive anchors
      for (let s = 0; s < anchors.length - 1; s++) {
        const a1 = anchors[s];
        const a2 = anchors[s + 1];
        const countBetween = a2.idx - a1.idx;

        for (let i = a1.idx; i < a2.idx; i++) {
          const frac = countBetween > 0 ? (i - a1.idx) / countBetween : 0;
          const px = a1.x + (a2.x - a1.x) * frac;
          const py = a1.y + (a2.y - a1.y) * frac;
          points[i] = { x: Math.round(px), y: Math.round(py) };
        }
      }

      // Add the final anchor point
      const lastAnchor = anchors[anchors.length - 1];
      points[lastAnchor.idx] = { x: lastAnchor.x, y: lastAnchor.y };
    }

    // Generate smooth SVG path
    const pathD = buildSvgPath(points, 18);

    const linePath: LineLayoutPath = {
      lineId: line.id,
      lineName: line.name,
      lineColor: line.colorHex,
      textColor: line.textColorHex,
      stationCount: line.stationCount,
      pathD,
      points,
      startPoint: points[0] || { x: centerX, y: centerY },
      endPoint: points[points.length - 1] || { x: centerX, y: centerY },
      firstStation: line.firstStation,
      lastStation: line.lastStation,
    };

    layoutLines.push(linePath);

    // Map stations to layout
    line.stations.forEach((stnName, idx) => {
      const pt = points[idx] || { x: centerX, y: centerY };
      const stationIdentity = getStationIdentity(city.id, stnName);
      const isInter = line.interchangeStations.some((interchangeName) =>
        stationNamesMatch(city.id, interchangeName, stnName),
      ) || (interchangeMap.get(stationIdentity)?.length || 0) > 1;
      const isFirst = idx === 0;
      const isLast = idx === line.stations.length - 1;

      // Smart label positioning and angle to prevent collisions
      const isTopHalf = pt.y < centerY;
      const isRightHalf = pt.x > centerX;

      let labelPosition: StationLayoutNode['labelPosition'] = 'bottom-right';
      let labelAngle = 0;

      if (lineCount === 1) {
        labelPosition = idx % 2 === 0 ? 'top' : 'bottom';
        labelAngle = -28;
      } else {
        if (isTopHalf && isRightHalf) {
          labelPosition = 'top-right';
          labelAngle = -25;
        } else if (isTopHalf && !isRightHalf) {
          labelPosition = 'top-left';
          labelAngle = 25;
        } else if (!isTopHalf && isRightHalf) {
          labelPosition = 'bottom-right';
          labelAngle = 25;
        } else {
          labelPosition = 'bottom-left';
          labelAngle = -25;
        }
      }

      const connected = interchangeMap.get(stationIdentity) || [];

      layoutStations.push({
        id: `${line.id}-${stnName}-${idx}`,
        name: stnName,
        lineId: line.id,
        lineName: line.name,
        lineColor: line.colorHex,
        stationNumber: idx + 1,
        isInterchange: isInter,
        isFirst,
        isLast,
        connectedLines: connected,
        x: pt.x,
        y: pt.y,
        labelPosition,
        labelAngle,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    });
  });

  // Extract unique interchanges for transfer hubs
  const interchangesList: CitySchematicLayout['interchanges'] = [];
  interchangeMap.forEach((lines, stationIdentity) => {
    // Find average coordinates of this interchange
    const matchingStations = layoutStations.filter((station) =>
      getStationIdentity(city.id, station.name) === stationIdentity,
    );
    if (matchingStations.length > 0) {
      const avgX = matchingStations.reduce((sum, s) => sum + s.x, 0) / matchingStations.length;
      const avgY = matchingStations.reduce((sum, s) => sum + s.y, 0) / matchingStations.length;
      interchangesList.push({
        name: matchingStations[0].name,
        x: Math.round(avgX),
        y: Math.round(avgY),
        lines,
      });
    }
  });

  const readableStations = assignReadableLabelPlacements(
    layoutStations,
    width,
    height,
  );

  return {
    width,
    height,
    lines: layoutLines,
    stations: readableStations,
    interchanges: interchangesList,
  };
}
