import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Search, 
  Plus, 
  Minus, 
  RotateCcw, 
  Network as NetworkIcon,
  X,
  Users,
  Train,
  MapPin
} from 'lucide-react';
import { MetroCity } from '../types/metro';
import { StationSelectionRecord } from '../services/metroDbService';
import { AnimatedCounter } from './AnimatedCounter';
import { useIsMobile } from '../hooks/use-mobile';
import { 
  createIndiaProjection, 
  createPathGenerator, 
  generateGraticulesPath, 
  getIndiaStatePaths,
  getIndiaOuterBoundaryPath,
  getIndiaInternalBoundariesPath,
  DEFAULT_MAP_DIMENSIONS 
} from '../utils/geoProjection';

interface IndiaMapProps {
  cities: MetroCity[];
  selectedCity: MetroCity | null;
  onSelectCity: (city: MetroCity) => void;
  activeSelections?: Record<string, StationSelectionRecord>;
  totalConnectedCount?: number;
  // City ids with at least one community-wide connection (from ANY user,
  // not just this browser) — sourced from Supabase so every visitor sees
  // the same "Connected" cities, not only their own picks.
  communityConnectedCityIds?: Set<string>;
}

// Fine-tuned, high-clarity label offsets per city to prevent overlapping in dense clusters
const CITY_LABEL_CONFIG: Record<string, { anchor: 'start' | 'end'; dx: number; dy: number }> = {
  delhi: { anchor: 'end', dx: -14, dy: -6 },
  gurgaon: { anchor: 'end', dx: -14, dy: 14 },
  gurugram: { anchor: 'end', dx: -14, dy: 14 },
  noida: { anchor: 'start', dx: 14, dy: 6 },
  meerut: { anchor: 'start', dx: 14, dy: -10 },
  agra: { anchor: 'start', dx: 13, dy: 9 },
  jaipur: { anchor: 'end', dx: -13, dy: 3 },
  kanpur: { anchor: 'start', dx: 13, dy: 11 },
  lucknow: { anchor: 'start', dx: 13, dy: -6 },
  patna: { anchor: 'start', dx: 13, dy: 3 },
  kolkata: { anchor: 'start', dx: 13, dy: 3 },
  bhopal: { anchor: 'start', dx: 13, dy: -6 },
  indore: { anchor: 'end', dx: -13, dy: 7 },
  ahmedabad: { anchor: 'end', dx: -13, dy: 2 },
  nagpur: { anchor: 'start', dx: 13, dy: 3 },
  mumbai: { anchor: 'end', dx: -14, dy: -6 },
  'navi-mumbai': { anchor: 'start', dx: 14, dy: 13 },
  pune: { anchor: 'start', dx: 14, dy: 4 },
  hyderabad: { anchor: 'start', dx: 13, dy: 3 },
  bengaluru: { anchor: 'end', dx: -13, dy: 3 },
  chennai: { anchor: 'start', dx: 13, dy: 3 },
  kochi: { anchor: 'start', dx: 13, dy: 3 },
};

export const IndiaMap: React.FC<IndiaMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  activeSelections = {},
  totalConnectedCount = 0,
  communityConnectedCityIds,
}) => {
  const [hoveredCity, setHoveredCity] = useState<MetroCity | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const totalStationsCount = useMemo(
    () => cities.reduce((sum, c) => sum + c.totalStationsCount, 0),
    [cities]
  );
  const [networkModeActive, setNetworkModeActive] = useState<boolean>(true);
  const [hoveredStateName, setHoveredStateName] = useState<string | null>(null);
  // LAG FIX: branch the India map — phones skip GeoJSON states, SVG blur, and glow.
  const isMobile = useIsMobile();

  // Transition state when entering a city via geographic zoom
  const [transitioningCity, setTransitioningCity] = useState<MetroCity | null>(null);

  // Cinematic zoom-to-city duration (500–800ms spec). Normal drag/wheel interactions use a
  // much snappier duration (see the transform div below) — only the click-to-city fly-in uses this.
  const CITY_ZOOM_TRANSITION_MS = 650;

  const containerRef = useRef<HTMLDivElement>(null);

  // Ref to the actual rendered <svg> element. Its viewBox maps `mapWidth` x `mapHeight`
  // (D3 projection units) onto whatever pixel box the responsive CSS/layout gives it —
  // those two are NOT the same number of pixels. clientWidth/clientHeight reflect the
  // real, untransformed layout box (unlike getBoundingClientRect, which would already
  // include the current zoom/pan CSS transform), so they're what we need to convert a
  // projected map coordinate into the real CSS-pixel offset the pan/zoom transform uses.
  const svgRef = useRef<SVGSVGElement>(null);

  // Drag pan states for mouse and touch interactions
  const isDragging = useRef<boolean>(false);
  const isPinching = useRef<boolean>(false);
  const suppressMapClick = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistance = useRef<number>(0);
  const mapLayerRef = useRef<HTMLDivElement>(null);
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<number>(1);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchStartDistance = useRef<number>(0);
  const pinchStartZoom = useRef<number>(1);
  const pinchStartPan = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchStartMidpoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const transformCommitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MIN_ZOOM = 0.75;
  const MAX_ZOOM = 2.8;

  // LAG FIX: pan/pinch writes CSS vars directly (no React re-render per frame).
  // will-change is applied only while the gesture is active, then cleared.
  const writeMapTransform = (nextZoom: number, nextPan: { x: number; y: number }) => {
    const layer = mapLayerRef.current;
    if (!layer) return;
    layer.style.setProperty('--map-pan-x', `${nextPan.x}px`);
    layer.style.setProperty('--map-pan-y', `${nextPan.y}px`);
    layer.style.setProperty('--map-zoom', String(nextZoom));
  };

  const queueMapTransform = (nextZoom: number, nextPan: { x: number; y: number }) => {
    zoomRef.current = nextZoom;
    panRef.current = nextPan;
    writeMapTransform(nextZoom, nextPan);
  };

  const commitMapTransform = () => {
    if (transformCommitTimeoutRef.current !== null) {
      clearTimeout(transformCommitTimeoutRef.current);
      transformCommitTimeoutRef.current = null;
    }
    setZoomLevel(zoomRef.current);
    setPanOffset({ ...panRef.current });
  };

  const queueMapTransformCommit = () => {
    if (transformCommitTimeoutRef.current !== null) {
      clearTimeout(transformCommitTimeoutRef.current);
    }
    transformCommitTimeoutRef.current = setTimeout(() => {
      transformCommitTimeoutRef.current = null;
      commitMapTransform();
    }, 80);
  };

  const beginMapGesture = () => {
    const layer = mapLayerRef.current;
    if (!layer) return;
    layer.style.setProperty('transition', 'none');
    // LAG FIX: promote the map layer only during drag/pinch, not while idle.
    layer.style.setProperty('will-change', 'transform');
  };

  const endMapGesture = () => {
    const layer = mapLayerRef.current;
    if (layer) {
      layer.style.removeProperty('transition');
      // LAG FIX: drop will-change after the gesture so the layer is not kept as a huge texture.
      layer.style.removeProperty('will-change');
    }
    commitMapTransform();
  };

  useEffect(() => {
    return () => {
      if (transformCommitTimeoutRef.current !== null) {
        clearTimeout(transformCommitTimeoutRef.current);
      }
    };
  }, []);

  // D3 Projection & Path Generators calibrated with fitExtent()
  const mapWidth = DEFAULT_MAP_DIMENSIONS.width;
  const mapHeight = DEFAULT_MAP_DIMENSIONS.height;

  const projection = useMemo(() => {
    return createIndiaProjection(mapWidth, mapHeight, DEFAULT_MAP_DIMENSIONS.padding);
  }, [mapWidth, mapHeight]);

  const pathGenerator = useMemo(() => {
    return createPathGenerator(projection);
  }, [projection]);

  // LAG FIX: phones skip per-state polygons, internal borders, and the graticule.
  // Those extra SVG paths plus hover handlers were a major paint cost on mobile.
  const statePaths = useMemo(() => {
    if (isMobile) return [];
    return getIndiaStatePaths(pathGenerator);
  }, [pathGenerator, isMobile]);

  // Distinct Outer National Silhouette Boundary Path
  const outerBoundaryPath = useMemo(() => {
    return getIndiaOuterBoundaryPath(pathGenerator);
  }, [pathGenerator]);

  // Distinct Internal State Dividing Boundaries Path
  // LAG FIX: skip internal state borders on phones (same paint cost as per-state polygons).
  const internalBoundariesPath = useMemo(() => {
    if (isMobile) return '';
    return getIndiaInternalBoundariesPath(pathGenerator);
  }, [pathGenerator, isMobile]);

  // Real cartographic graticule path (latitude / longitude grid)
  // LAG FIX: skip the lat/lng grid on phones.
  const graticulePath = useMemo(() => {
    if (isMobile) return '';
    return generateGraticulesPath(pathGenerator, [4, 4]);
  }, [pathGenerator, isMobile]);

  // Project all metro cities strictly via D3 Mercator projection: [x, y] = projection([lng, lat])
  const projectedCities = useMemo(() => {
    return cities.map((city) => {
      const point = projection([city.coordinates.lng, city.coordinates.lat]);
      const x = point ? Math.round(point[0] * 10) / 10 : 0;
      const y = point ? Math.round(point[1] * 10) / 10 : 0;
      return {
        ...city,
        svgCoords: { x, y },
      };
    });
  }, [cities, projection]);

  // =========================================================================
  // GEOGRAPHIC DISTANCE & CITY ENTRY DETECTION LOGIC
  // =========================================================================
  // Configurable thresholds for city entry transition
  const CITY_ENTRY_ZOOM = 2.15;
  const CITY_ENTRY_RADIUS_KM = 95; // Radius in real kilometers

  // Great-circle distance in kilometers using the Haversine formula
  const computeGeoDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Computes the current geographic center (lat, lng) of the map viewport
  const getMapGeoCenter = (currentZoom: number, currentPan: { x: number; y: number }): { lat: number; lng: number } | null => {
    const centerX = mapWidth / 2 - currentPan.x;
    const centerY = mapHeight / 2 - currentPan.y;
    const geoCoords = projection.invert ? projection.invert([centerX, centerY]) : null;
    if (!geoCoords) return null;
    return { lng: geoCoords[0], lat: geoCoords[1] };
  };

  // Detect if current map center & zoom level qualify to enter a metro city
  const findEligibleTransitionCity = (currentZoom: number, currentPan: { x: number; y: number }): { city: MetroCity; distanceKm: number } | null => {
    if (currentZoom < CITY_ENTRY_ZOOM) return null;

    const geoCenter = getMapGeoCenter(currentZoom, currentPan);
    if (!geoCenter) return null;

    let closestCity: MetroCity | null = null;
    let minDistance = Infinity;

    for (const city of cities) {
      const d = computeGeoDistanceKm(
        geoCenter.lat,
        geoCenter.lng,
        city.coordinates.lat,
        city.coordinates.lng
      );
      if (d < minDistance) {
        minDistance = d;
        closestCity = city;
      }
    }

    if (closestCity && minDistance <= CITY_ENTRY_RADIUS_KM) {
      return { city: closestCity, distanceKm: minDistance };
    }

    return null;
  };

  // Perform continuous check on zoom or pan changes
  const checkAndTriggerCityTransition = (targetZoom: number, targetPan: { x: number; y: number }) => {
    if (transitioningCity) return; // already transitioning

    const match = findEligibleTransitionCity(targetZoom, targetPan);
    if (match) {
      triggerCityTransition(match.city);
    }
  };

  // Shared helper: converts a city's D3-projected point (SVG viewBox units, fixed) into the
  // CSS-pixel pan offset needed to center it under the current `scale(...) translate(...)`
  // transform. The SVG-unit-to-CSS-px ratio is recomputed from the SVG's *live* rendered
  // box every time this runs, so the same formula automatically adapts to whatever the
  // container actually measures at that instant — desktop, laptop, tablet, mobile, portrait
  // or landscape — with no breakpoint- or device-specific branching.
  const computeCityTargetPan = (city: MetroCity): { x: number; y: number } | null => {
    const citySvgPoint = projection([city.coordinates.lng, city.coordinates.lat]);
    if (!citySvgPoint) return null;

    const svgEl = svgRef.current;
    const renderedWidth = svgEl?.clientWidth || mapWidth;
    const renderedHeight = svgEl?.clientHeight || mapHeight;
    // `preserveAspectRatio="xMidYMin meet"` scales uniformly by the smaller of the two
    // width/height ratios, keeps the artwork horizontally centered, and anchors it to the
    // TOP of the box (rather than vertically centering it) — mirror that exact placement
    // here so the pan target matches however the current container happens to be shaped.
    const svgUnitToPx = Math.min(renderedWidth / mapWidth, renderedHeight / mapHeight) || 1;

    return {
      // X is still mid-anchored, so this stays relative to the viewBox's horizontal center.
      x: (mapWidth / 2 - citySvgPoint[0]) * svgUnitToPx,
      // Y is now top-anchored (offset 0 at the box's top edge instead of vertically
      // centered), so the target is measured against the box's actual rendered center
      // in pixels rather than the viewBox's vertical center.
      y: renderedHeight / 2 - citySvgPoint[1] * svgUnitToPx,
    };
  };

  // Smooth transition animation: highlight marker, cinematically zoom/pan the existing D3-projected
  // map toward the clicked city's real coordinates, then — once that zoom animation has ACTUALLY
  // finished (see handleMapTransformTransitionEnd below) — open the city's metro view.
  const triggerCityTransition = (city: MetroCity) => {
    if (transitioningCity) return;

    const targetPan = computeCityTargetPan(city);
    if (!targetPan) {
      // No valid projected point for this city (shouldn't happen) — open it directly.
      onSelectCity(city);
      return;
    }

    const targetZoom = 2.6;

    // If the map is already sitting at this exact zoom/pan (e.g. the city was just entered and
    // clicked again), the transform won't change, so no `transitionend` event will ever fire.
    // Skip straight to the city view rather than waiting indefinitely on an animation that can't happen.
    const alreadyThere =
      Math.abs(zoomRef.current - targetZoom) < 0.01 &&
      Math.abs(panRef.current.x - targetPan.x) < 0.5 &&
      Math.abs(panRef.current.y - targetPan.y) < 0.5;

    if (alreadyThere) {
      onSelectCity(city);
      return;
    }

    setTransitioningCity(city);
    queueMapTransform(targetZoom, targetPan);
    commitMapTransform();
  };

  // Keep the in-flight city-entry animation locked onto the actual clicked city if the
  // viewport itself changes size mid-flight — a container resize (e.g. rotating a phone,
  // resizing a browser window, a tablet split-view change) moves the SVG's rendered box,
  // so the pan target must be recomputed against the new size rather than left stale.
  useEffect(() => {
    if (!transitioningCity) return;

    const recomputeTarget = () => {
      const targetPan = computeCityTargetPan(transitioningCity);
      if (targetPan) {
        queueMapTransform(zoomRef.current, targetPan);
        commitMapTransform();
      }
    };

    window.addEventListener('resize', recomputeTarget);
    window.addEventListener('orientationchange', recomputeTarget);
    return () => {
      window.removeEventListener('resize', recomputeTarget);
      window.removeEventListener('orientationchange', recomputeTarget);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitioningCity]);

  // Fires when the map's real pan/zoom CSS transition finishes. This — not a guessed timeout —
  // is what opens the city's metro view, so the page switch always matches however long the
  // actual on-screen zoom animation took.
  const handleMapTransformTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
    if (!transitioningCity) return;

    const city = transitioningCity;
    setTransitioningCity(null);
    onSelectCity(city);
  };

  // Filter cities by search query
  const filteredCities = useMemo(() => {
    return projectedCities.filter((city) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.hindiName.includes(searchQuery);

      return matchesSearch;
    });
  }, [projectedCities, searchQuery]);

  // Sort cities for optimal SVG stacking order (Hovered/Selected/Transitioning at top)
  const renderSortedCities = useMemo(() => {
    return [...filteredCities].sort((a, b) => {
      if (transitioningCity?.id === a.id) return 1;
      if (transitioningCity?.id === b.id) return -1;
      if (hoveredCity?.id === a.id) return 1;
      if (hoveredCity?.id === b.id) return -1;
      if (selectedCity?.id === a.id) return 1;
      if (selectedCity?.id === b.id) return -1;
      if (a.id === 'delhi') return 1;
      if (b.id === 'delhi') return -1;
      return 0;
    });
  }, [filteredCities, hoveredCity, selectedCity, transitioningCity]);

  // Active nearby city indicator (visual feedback when user is approaching entry threshold)
  const nearbyEntryCandidate = useMemo(() => {
    if (zoomLevel < 1.6) return null;
    const center = getMapGeoCenter(zoomLevel, panOffset);
    if (!center) return null;

    let closest: MetroCity | null = null;
    let minD = Infinity;

    for (const c of cities) {
      const d = computeGeoDistanceKm(center.lat, center.lng, c.coordinates.lat, c.coordinates.lng);
      if (d < minD) {
        minD = d;
        closest = c;
      }
    }

    if (closest && minD <= 180) {
      return { city: closest, distanceKm: Math.round(minD) };
    }
    return null;
  }, [zoomLevel, panOffset, cities]);

  const clampZoom = (value: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

  const getViewportCenter = () => {
    const rect = mapViewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const getTouchDistance = (a: React.Touch, b: React.Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const getTouchMidpoint = (a: React.Touch, b: React.Touch) => ({
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  });

  const beginPinch = (a: React.Touch, b: React.Touch) => {
    isDragging.current = false;
    isPinching.current = true;
    suppressMapClick.current = true;
    beginMapGesture();
    pinchStartDistance.current = Math.max(getTouchDistance(a, b), 1);
    pinchStartZoom.current = zoomRef.current;
    pinchStartPan.current = { ...panRef.current };
    const mid = getTouchMidpoint(a, b);
    const center = getViewportCenter();
    pinchStartMidpoint.current = { x: mid.x - center.x, y: mid.y - center.y };
  };

  const applyPinch = (a: React.Touch, b: React.Touch) => {
    const dist = getTouchDistance(a, b);
    const nextZoom = clampZoom(pinchStartZoom.current * (dist / pinchStartDistance.current));
    const mid = getTouchMidpoint(a, b);
    const center = getViewportCenter();
    const liveOffsetX = mid.x - center.x;
    const liveOffsetY = mid.y - center.y;
    const startZoom = pinchStartZoom.current;
    const nextPan = {
      x:
        pinchStartMidpoint.current.x * (1 / nextZoom - 1 / startZoom) +
        pinchStartPan.current.x +
        (liveOffsetX - pinchStartMidpoint.current.x),
      y:
        pinchStartMidpoint.current.y * (1 / nextZoom - 1 / startZoom) +
        pinchStartPan.current.y +
        (liveOffsetY - pinchStartMidpoint.current.y),
    };
    queueMapTransform(nextZoom, nextPan);
  };

  // Zoom and Pan Handlers with city threshold triggers
  const handleZoomIn = () => {
    const nextZoom = clampZoom(zoomRef.current + 0.35);
    queueMapTransform(nextZoom, panRef.current);
    commitMapTransform();
    checkAndTriggerCityTransition(nextZoom, panRef.current);
  };

  const handleZoomOut = () => {
    queueMapTransform(clampZoom(zoomRef.current - 0.25), panRef.current);
    commitMapTransform();
  };

  const handleResetZoom = () => {
    queueMapTransform(1, { x: 0, y: 0 });
    commitMapTransform();
    setSearchQuery('');
  };

  // Wheel zoom handler — smooth, multiplicative zoom centered on the cursor position.
  // Transform on the map layer is `scale(zoomLevel) translate(panOffset.x, panOffset.y)`,
  // so a screen point maps to local space as: screenOffset = zoom * (local + pan).
  // Solving for pan that keeps the same local point under the cursor after a zoom change:
  // pan' = screenOffset * (1/zoom' - 1/zoom) + pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (transitioningCity) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const screenOffsetX = e.clientX - centerX;
    const screenOffsetY = e.clientY - centerY;

    // Smooth, continuous zoom factor derived from wheel delta (scroll up = zoom in)
    const zoomFactor = Math.exp(-e.deltaY * 0.0015);
    const currentZoom = zoomRef.current;
    const currentPan = panRef.current;
    const nextZoom = clampZoom(currentZoom * zoomFactor);

    if (nextZoom !== currentZoom) {
      const nextPan = {
        x: screenOffsetX * (1 / nextZoom - 1 / currentZoom) + currentPan.x,
        y: screenOffsetY * (1 / nextZoom - 1 / currentZoom) + currentPan.y,
      };
      queueMapTransform(nextZoom, nextPan);
      queueMapTransformCommit();

      // If zooming in, check if user is entering a city's geographic boundaries
      if (nextZoom > currentZoom) {
        checkAndTriggerCityTransition(nextZoom, nextPan);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || transitioningCity) return;
    beginMapGesture();
    isDragging.current = true;
    dragDistance.current = 0;
    dragStart.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || transitioningCity) return;
    dragDistance.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    const newPan = {
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    };
    queueMapTransform(zoomRef.current, newPan);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    endMapGesture();

    // On drag release, check if map was centered near a city at entry zoom level
    if (zoomRef.current >= CITY_ENTRY_ZOOM) {
      checkAndTriggerCityTransition(zoomRef.current, panRef.current);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (transitioningCity) return;
    if (e.touches.length >= 2) {
      beginPinch(e.touches[0], e.touches[1]);
      return;
    }
    if (e.touches.length === 1) {
      suppressMapClick.current = false;
      isDragging.current = true;
      beginMapGesture();
      dragDistance.current = 0;
      dragStart.current = {
        x: e.touches[0].clientX - panRef.current.x,
        y: e.touches[0].clientY - panRef.current.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (transitioningCity) return;
    if (e.touches.length >= 2) {
      if (!isPinching.current) beginPinch(e.touches[0], e.touches[1]);
      applyPinch(e.touches[0], e.touches[1]);
      return;
    }
    if (!isDragging.current || isPinching.current) return;
    dragDistance.current += 1;
    const newPan = {
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y,
    };
    queueMapTransform(zoomRef.current, newPan);
  };

  const finishMapGesture = () => {
    const wasPinching = isPinching.current;
    const wasDragging = isDragging.current;
    isPinching.current = false;
    isDragging.current = false;
    if (!wasPinching && !wasDragging) return;
    endMapGesture();
    if (zoomRef.current >= CITY_ENTRY_ZOOM) {
      checkAndTriggerCityTransition(zoomRef.current, panRef.current);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isPinching.current) {
      if (e.touches.length >= 2) {
        beginPinch(e.touches[0], e.touches[1]);
        return;
      }
      if (e.touches.length === 1) {
        isPinching.current = false;
        isDragging.current = true;
        dragStart.current = {
          x: e.touches[0].clientX - panRef.current.x,
          y: e.touches[0].clientY - panRef.current.y,
        };
        commitMapTransform();
        return;
      }
      finishMapGesture();
      return;
    }
    if (e.touches.length === 0) finishMapGesture();
  };

  const handleCityClick = (city: MetroCity) => {
    if (suppressMapClick.current || dragDistance.current > 8) return;
    triggerCityTransition(city);
  };

  const hoveredStatePath = useMemo(() => {
    if (!hoveredStateName) return null;
    return statePaths.find((s) => s.name === hoveredStateName)?.path || null;
  }, [hoveredStateName, statePaths]);

  return (
    <div 
      ref={containerRef}
      // LAG FIX: touch-none so the browser does not fight pan/pinch.
      className="relative isolate h-full w-full overflow-hidden bg-transparent select-none flex flex-col justify-between touch-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Shared page backdrop (photo + overlay) now lives once in App.tsx so
          it's visible behind every page, not just this one — this section
          stays transparent and lets it show through. */}

      {/* Floating Top-Right Search Input Bar */}
      <div className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 hidden lg:block w-64 xl:w-72 pointer-events-auto">
        <div className="relative rounded-2xl border border-amber-500/25 bg-[#1a120e] p-1 shadow-2xl md:bg-[#1a120e]/85 md:backdrop-blur-xl ring-1 ring-white/5">
          {/* LAG FIX: glass blur on map chrome is md+ only */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search metro city..."
            className="w-full rounded-xl bg-transparent pl-8.5 pr-7 py-1.5 text-xs text-stone-100 placeholder-amber-200/30 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Geographic D3 India Map Canvas */}
      {/* LAG FIX: touch-none so the browser does not fight custom pan/pinch. */}
      <div 
        ref={mapViewportRef}
        className="relative mx-auto flex h-full w-full max-w-full items-center justify-center px-2 pt-25 pb-2 sm:px-4 sm:pt-4 md:pt-5 cursor-grab active:cursor-grabbing overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div 
          ref={mapLayerRef}
          className="relative h-full w-full flex items-center justify-center transition-transform"
          style={{
            transform: 'scale(var(--map-zoom, 1) ) translate(var(--map-pan-x, 0px), var(--map-pan-y, 0px))',
            transformOrigin: '50% 50%',
            // Cinematic duration when flying into a clicked city; snappy for ordinary drag/wheel zoom.
            transitionDuration: transitioningCity ? `${CITY_ZOOM_TRANSITION_MS}ms` : '150ms',
            transitionTimingFunction: transitioningCity ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'ease-out',
          }}
          onTransitionEnd={handleMapTransformTransitionEnd}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            // LAG FIX: CSS drop-shadow on the whole SVG is desktop-only (md:filter).
            className="india-map-canvas h-full w-full lg:w-auto lg:min-w-[980px] xl:min-w-[1100px] 2xl:min-w-[1220px] select-none md:filter md:drop-shadow-[0_0_40px_rgba(232,160,91,0.16)]"
            preserveAspectRatio="xMidYMin meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* LAG FIX: SVG feGaussianBlur filters are desktop-only. They
                  rasterize a padded region per marker/outline every frame. */}
              {!isMobile && (
                <>
                  {/* Distinct Outer Boundary Glow */}
                  <filter id="outerBoundaryGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* City Marker High-Intensity Halo Glow */}
                  <filter id="markerGlow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="3.6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Transition Entry City Hyper-Glow */}
                  <filter id="transitionGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </>
              )}

              {/* India Landmass Base Gradient — deep teal-to-amber, more colourful & premium than flat brown */}
              <linearGradient id="indiaLandmassFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2d2415" stopOpacity="0.97" />
                <stop offset="45%" stopColor="#211a29" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#12141f" stopOpacity="1" />
              </linearGradient>

              {/* Hovered State Highlight Fill Gradient */}
              <linearGradient id="stateHoveredFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7a4a24" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#3d2a4a" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* ================================================================= */}
            {/* LAYER 0: Background Map Grid (Behind landmass, extremely subtle)   */}
            {/* ================================================================= */}
            {graticulePath && (
              <path
                d={graticulePath}
                fill="none"
                stroke="#e8a05b"
                strokeWidth="0.4"
                strokeDasharray="2 8"
                opacity="0.06"
                className="pointer-events-none"
              />
            )}

            {/* ================================================================= */}
            {/* LAYER 1: India Landmass Fill & State Interactive Polygons         */}
            {/* ================================================================= */}
            <g className="india-landmass-layer">
              {/* LAG FIX: one silhouette fill on phones instead of 35 hoverable state paths. */}
              {isMobile ? (
                outerBoundaryPath ? (
                  <path
                    d={outerBoundaryPath}
                    fill="url(#indiaLandmassFill)"
                    opacity={0.95}
                    className="pointer-events-none"
                  />
                ) : null
              ) : (
                statePaths.map((state) => {
                  const isHovered = hoveredStateName === state.name;

                  return (
                    <path
                      key={state.id}
                      id={`state-${state.id}`}
                      d={state.path}
                      fill={isHovered ? 'url(#stateHoveredFill)' : 'url(#indiaLandmassFill)'}
                      opacity={isHovered ? 1 : 0.95}
                      className="transition-colors duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredStateName(state.name)}
                      onMouseLeave={() => setHoveredStateName(null)}
                    />
                  );
                })
              )}
            </g>

            {/* ================================================================= */}
            {/* LAYER 2: State Boundaries (Subtle background geographic context)  */}
            {/* ================================================================= */}
            {internalBoundariesPath && (
              <path
                d={internalBoundariesPath}
                fill="none"
                stroke="#8a5a38"
                strokeWidth="0.38"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.28"
                className="pointer-events-none"
              />
            )}

            {/* Subtle Interactive State Hover Highlight */}
            {hoveredStatePath && (
              <path
                d={hoveredStatePath}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="0.9"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.7"
                className="pointer-events-none transition-all duration-150"
              />
            )}

            {/* ================================================================= */}
            {/* LAYER 3: India Outer Boundary (Brighter, thicker silhouette)      */}
            {/* ================================================================= */}
            {/* LAG FIX: gold halo uses SVG blur — skip it on phones. */}
            {!isMobile && outerBoundaryPath && (
              <path
                d={outerBoundaryPath}
                fill="none"
                stroke="#e8a05b"
                strokeWidth="3.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.28"
                filter="url(#outerBoundaryGlow)"
                className="pointer-events-none"
              />
            )}

            {/* 3b. High-Clarity Outer National Silhouette Border */}
            {outerBoundaryPath && (
              <path
                d={outerBoundaryPath}
                fill="none"
                stroke="#f7c68b"
                strokeWidth="1.55"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.95"
                className="pointer-events-none"
              />
            )}

            {/* ================================================================= */}
            {/* LAYER 4: Metro City Markers (Prominent transit hubs over geography) */}
            {/* ================================================================= */}
            <g className="metro-cities-layer">
              {renderSortedCities.map((city) => {
                const isHovered = hoveredCity?.id === city.id;
                const isSelected = selectedCity?.id === city.id;
                const isTransitioning = transitioningCity?.id === city.id;
                const isConnected = !!activeSelections[city.id] || !!communityConnectedCityIds?.has(city.id);

                const cx = city.svgCoords.x;
                const cy = city.svgCoords.y;
                const labelCfg = CITY_LABEL_CONFIG[city.id] || { 
                  anchor: cx < mapWidth / 2 ? 'start' : 'end', 
                  dx: cx < mapWidth / 2 ? 12 : -12, 
                  dy: 3 
                };
                const hitRadius = 20;

                return (
                  <g
                    key={city.id}
                    id={`map-city-${city.id}`}
                    className="cursor-pointer group select-none transition-transform"
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCityClick(city);
                    }}
                  >
                    {/* Generous interactive hit target */}
                    <circle cx={cx} cy={cy} r={hitRadius} fill="transparent" className="cursor-pointer" />

                    {/* Transitioning Ripple Animation */}
                    {isTransitioning && (
                      <>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={32}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth={2.5}
                          className="animate-ping"
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={24}
                          fill="#f59e0b"
                          opacity={0.35}
                          filter={!isMobile ? 'url(#transitionGlow)' : undefined}
                        />
                      </>
                    )}

                    {/* Outer Pulse Radar on Hover or Connected City */}
                    {/* LAG FIX: looping ping animation is desktop-hover only. */}
                    {(isHovered || isSelected || isConnected) && !isTransitioning && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 20 : 13.5}
                        fill="none"
                        stroke={isConnected ? '#34d399' : '#fb923c'}
                        strokeWidth={isConnected ? 1.4 : 1.6}
                        opacity={isHovered ? 0.95 : isConnected ? 0.55 : 0.45}
                        className={isHovered && !isMobile ? 'animate-map-ping' : ''}
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                      />
                    )}

                    {/* High-Intensity Ambient Marker Glow */}
                    {/* LAG FIX: no per-marker SVG blur on phones. */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isTransitioning ? 18 : isHovered ? 12 : 8}
                      fill={isTransitioning ? '#fbbf24' : isConnected ? '#10b981' : '#f97316'}
                      opacity={isTransitioning ? 1 : isHovered ? 0.9 : isConnected ? 0.6 : 0.5}
                      filter={!isMobile ? (isTransitioning ? 'url(#transitionGlow)' : 'url(#markerGlow)') : undefined}
                    />

                    {/* High-Contrast Metro Marker Core (Prominent over state lines) */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isTransitioning ? 9 : isHovered ? 7.2 : isConnected ? 5.8 : 5.2}
                      fill={isTransitioning ? '#fbbf24' : isConnected ? '#10b981' : isHovered ? '#fb923c' : '#f97316'}
                      stroke={isTransitioning ? '#ffffff' : '#020617'}
                      strokeWidth={isTransitioning ? 3 : 2.4}
                      className="transition-all duration-150"
                    />

                    {/* Specular Center Pip */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isTransitioning ? 3.2 : isHovered ? 2.4 : 1.6}
                      fill="#ffffff"
                      opacity={0.95}
                      className="pointer-events-none"
                    />

                    {/* High-Contrast Metro City Name */}
                    {/* 1. Backdrop Shadow / Outline Casing Layer for Razor-Sharp Readability */}
                    <text
                      x={cx + labelCfg.dx}
                      y={cy + labelCfg.dy}
                      textAnchor={labelCfg.anchor}
                      fill="#020617"
                      stroke="#020617"
                      strokeWidth={isTransitioning ? 5.5 : 4.5}
                      strokeLinejoin="round"
                      fontSize={isTransitioning ? '16' : isHovered ? '14' : '12.5'}
                      fontWeight="800"
                      letterSpacing="0.015em"
                      fontFamily="'Outfit', sans-serif"
                      className="cursor-pointer select-none"
                    >
                      {city.name}
                    </text>

                    {/* 2. Forefront High-Contrast Crisp Text */}
                    {/* LAG FIX: CSS drop-shadow on city labels is desktop-only. */}
                    <text
                      x={cx + labelCfg.dx}
                      y={cy + labelCfg.dy}
                      textAnchor={labelCfg.anchor}
                      fill={isTransitioning ? '#fde047' : isConnected ? '#6ee7b7' : isHovered ? '#ffffff' : isSelected ? '#fde047' : '#f8fafc'}
                      fontSize={isTransitioning ? '16' : isHovered ? '14' : '12.5'}
                      fontWeight={isTransitioning || isHovered || isConnected || isSelected ? '800' : '700'}
                      letterSpacing="0.015em"
                      fontFamily="'Outfit', sans-serif"
                      className="cursor-pointer md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] select-none transition-all hover:fill-amber-300"
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* City-entry transition confirmation — shown while zoom-transitioning into a city, not on hover */}
      {/* LAG FIX: city-entry toast skips backdrop-blur-2xl on phones. */}
      <AnimatePresence>
        {transitioningCity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border border-amber-500/60 bg-[#1a120e] px-5 py-3 shadow-2xl shadow-amber-500/20 md:bg-[#1a120e]/95 md:backdrop-blur-2xl"
          >
            <div className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                Entering Metro Network
              </div>
              <div className="font-display text-sm font-black tracking-wide text-stone-100 uppercase">
                {transitioningCity.name} Metro ({transitioningCity.hindiName})
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation Controls Bar — overlays the map (like the
          top search bar already does) instead of reserving its own flex row,
          so the map canvas gets the full container height to render into. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 p-2.5 sm:p-4 pointer-events-none">
        {/* Stat Cards — live snapshot of the community & network */}
        {/* LAG FIX: map chrome uses opaque fills on phones; glass blur is md+. */}
        <div className="pointer-events-auto flex flex-wrap items-stretch gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 rounded-2xl border border-stone-900/80 bg-[#1a120e] px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl md:bg-[#1a120e]/90 md:backdrop-blur-xl ring-1 ring-white/5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div>
              <div className="font-display text-sm sm:text-base font-black leading-none text-stone-100">
                {totalConnectedCount > 0 ? (
                  <AnimatedCounter value={totalConnectedCount} suffix="+" />
                ) : (
                  <span className="text-xs sm:text-sm">Be the first</span>
                )}
              </div>
              <div className="mt-0.5 text-[9.5px] sm:text-[10.5px] font-medium text-stone-400 whitespace-nowrap">People Connected</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-stone-900/80 bg-[#1a120e] px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl md:bg-[#1a120e]/90 md:backdrop-blur-xl ring-1 ring-white/5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <Train className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div>
              <div className="font-display text-sm sm:text-base font-black leading-none text-stone-100">
                <AnimatedCounter value={cities.length} />
              </div>
              <div className="mt-0.5 text-[9.5px] sm:text-[10.5px] font-medium text-stone-400 whitespace-nowrap">Metro Cities</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-stone-900/80 bg-[#1a120e] px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl md:bg-[#1a120e]/90 md:backdrop-blur-xl ring-1 ring-white/5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div>
              <div className="font-display text-sm sm:text-base font-black leading-none text-stone-100">
                <AnimatedCounter value={totalStationsCount} suffix="+" />
              </div>
              <div className="mt-0.5 text-[9.5px] sm:text-[10.5px] font-medium text-stone-400 whitespace-nowrap">Stations</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
        {/* Floating Bottom-Left Map Controls */}
        {/* LAG FIX: solid fills on phones — backdrop-blur over a moving map is too costly. */}
        <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-stone-900/80 bg-[#1a120e] p-1 sm:p-1.5 shadow-2xl md:bg-[#1a120e]/90 md:backdrop-blur-xl ring-1 ring-white/5">
          <button
            onClick={handleZoomIn}
            className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-xl text-stone-300 hover:bg-stone-900/60 hover:text-amber-300 transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-xl text-stone-300 hover:bg-stone-900/60 hover:text-amber-300 transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>

          <button
            onClick={handleResetZoom}
            className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-xl text-stone-300 hover:bg-stone-900/60 hover:text-amber-300 transition-colors cursor-pointer"
            title="Reset Map Position"
            aria-label="Reset map"
          >
            <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>

          <div className="h-4 w-px bg-stone-900/80 mx-0.5" />

          <button
            onClick={() => setNetworkModeActive(!networkModeActive)}
            className={`flex items-center gap-1 rounded-xl px-2 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              networkModeActive
                ? 'border border-amber-500/40 bg-stone-900/80 text-amber-300'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <NetworkIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" />
            <span className="hidden xs:inline">Network</span>
          </button>
        </div>

        {/* Floating Bottom-Right Legend */}
        <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-stone-900/80 bg-[#1a120e] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-stone-300 shadow-2xl md:bg-[#1a120e]/90 md:backdrop-blur-xl ring-1 ring-white/5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-[10px] sm:text-[11px] font-bold text-stone-200">Metro City</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-300">Connected</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
