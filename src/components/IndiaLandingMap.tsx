import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CITIES_METRO_DATA,
  NATIONAL_METRO_HUBS,
  NationalMetroSummary,
} from '../data/metroData';
import { UserStationSelection, MetroStation } from '../types';
import {
  getIndiaBoundarySvgPaths,
  getIndiaStateBoundarySvgPaths,
  INDIA_MAP_WIDTH,
  INDIA_MAP_HEIGHT,
  geoToSvgCoordinates,
} from '../utils/geoProjection';
import { computeGlobalCityLabelPlacements, CITY_SHORT_NAMES } from '../utils/labelCollisionSystem';
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Activity,
  CheckCircle2,
  ArrowRight,
  X,
  Navigation,
} from 'lucide-react';

interface IndiaLandingMapProps {
  onSelectCity: (cityId: string, station?: MetroStation) => void;
  userSelections: UserStationSelection[];
  onOpenAnalytics: () => void;
  onOpenMyStations: () => void;
}

type ViewLevel = 1 | 2 | 3; // 1: India View, 2: Regional View, 3: City View
type RegionFilter = 'all' | 'north' | 'west' | 'south' | 'central_east';

export const IndiaLandingMap: React.FC<IndiaLandingMapProps> = ({
  onSelectCity,
  userSelections,
  onOpenAnalytics,
  onOpenMyStations,
}) => {
  const [activeHubHover, setActiveHubHover] = useState<NationalMetroSummary | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isCitySearchFocused, setIsCitySearchFocused] = useState(false);
  const [showNetworkFilaments, setShowNetworkFilaments] = useState(true);

  // Map Pan & Zoom Transform State
  const [mapScale, setMapScale] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Pinch-to-zoom and touch support
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchMoveDetectedRef = useRef(false);

  // Determine current effective zoom level (Level 1: India, Level 2: Regional)
  const currentZoomLevel: ViewLevel = mapScale >= 1.45 || activeRegion !== 'all' ? 2 : 1;

  // Geographic SVG outline paths generated via D3 projection from GeoJSON
  const indiaSvgBoundaryPaths = useMemo(() => getIndiaBoundarySvgPaths(), []);
  const indiaStateBoundaryPaths = useMemo(() => getIndiaStateBoundarySvgPaths(), []);

  // Map of hubs for quick lookup
  const hubMap = useMemo(() => new Map(NATIONAL_METRO_HUBS.map((h) => [h.id, h])), []);

  // Simplified subtle national network connection filaments
  const simplifiedCorridors = useMemo(() => {
    const connections = [
      { from: 'delhi', to: 'noida' },
      { from: 'delhi', to: 'gurugram' },
      { from: 'delhi', to: 'meerut' },
      { from: 'delhi', to: 'agra' },
      { from: 'delhi', to: 'jaipur' },
      { from: 'delhi', to: 'kanpur' },
      { from: 'delhi', to: 'lucknow' },
      { from: 'delhi', to: 'bhopal' },
      { from: 'delhi', to: 'ahmedabad' },
      { from: 'delhi', to: 'mumbai' },
      { from: 'delhi', to: 'hyderabad' },
      { from: 'delhi', to: 'kolkata' },
      { from: 'agra', to: 'kanpur' },
      { from: 'kanpur', to: 'lucknow' },
      { from: 'jaipur', to: 'ahmedabad' },
      { from: 'ahmedabad', to: 'indore' },
      { from: 'ahmedabad', to: 'mumbai' },
      { from: 'mumbai', to: 'navi-mumbai' },
      { from: 'mumbai', to: 'pune' },
      { from: 'mumbai', to: 'nagpur' },
      { from: 'bhopal', to: 'indore' },
      { from: 'bhopal', to: 'nagpur' },
      { from: 'pune', to: 'hyderabad' },
      { from: 'nagpur', to: 'hyderabad' },
      { from: 'hyderabad', to: 'bengaluru' },
      { from: 'hyderabad', to: 'chennai' },
      { from: 'bengaluru', to: 'chennai' },
      { from: 'bengaluru', to: 'kochi' },
      { from: 'chennai', to: 'kochi' },
      { from: 'kolkata', to: 'chennai' },
    ];

    return connections
      .map(({ from, to }) => {
        const h1 = hubMap.get(from);
        const h2 = hubMap.get(to);
        if (!h1 || !h2) return null;

        const midX = (h1.x + h2.x) / 2 + (h2.y - h1.y) * 0.03;
        const midY = (h1.y + h2.y) / 2 - (h2.x - h1.x) * 0.03;
        return {
          id: `${from}-${to}`,
          d: `M ${h1.x} ${h1.y} Q ${midX} ${midY} ${h2.x} ${h2.y}`,
        };
      })
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [hubMap]);

  // Compute global non-overlapping city label placements with intelligent radial collision avoidance
  const userSelectedCityIds = useMemo(() => userSelections.map((s) => s.cityId), [userSelections]);
  const cityLabelPlacements = useMemo(() => {
    return computeGlobalCityLabelPlacements(
      NATIONAL_METRO_HUBS,
      INDIA_MAP_WIDTH,
      INDIA_MAP_HEIGHT,
      userSelectedCityIds
    );
  }, [userSelectedCityIds]);

  // Search Results across all 20 Cities
  const searchResults = useMemo(() => {
    if (!citySearchQuery.trim()) return [];
    const q = citySearchQuery.toLowerCase().trim();

    return CITIES_METRO_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.hindiName.includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.systemName.toLowerCase().includes(q) ||
        (CITY_SHORT_NAMES[c.id] && CITY_SHORT_NAMES[c.id].toLowerCase().includes(q))
    );
  }, [citySearchQuery]);

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setMapScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.75), 3.5);
      return Number(next.toFixed(2));
    });
  };

  const handleResetMap = () => {
    setMapScale(1);
    setMapPan({ x: 0, y: 0 });
    setActiveRegion('all');
    setActiveHubHover(null);
  };

  // Region View Focus Presets (Level 2 Regional Views)
  const handleSelectRegion = (region: RegionFilter) => {
    setActiveRegion(region);
    if (region === 'all') {
      setMapScale(1);
      setMapPan({ x: 0, y: 0 });
    } else if (region === 'north') {
      setMapScale(1.85);
      setMapPan({ x: 60, y: 160 });
    } else if (region === 'west') {
      setMapScale(1.85);
      setMapPan({ x: 260, y: -40 });
    } else if (region === 'south') {
      setMapScale(1.95);
      setMapPan({ x: 80, y: -300 });
    } else if (region === 'central_east') {
      setMapScale(1.75);
      setMapPan({ x: -100, y: 0 });
    }
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = -e.deltaY * 0.001;
    setMapScale((prev) => Math.min(Math.max(prev + factor, 0.7), 3.5));
  };

  // Touch Handlers for Mobile (Pan & Pinch)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchMoveDetectedRef.current = false;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - mapPan.x,
        y: e.touches[0].clientY - mapPan.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      touchStartDistRef.current = dist;
      touchStartPanRef.current = { ...mapPan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchMoveDetectedRef.current = true;
    if (e.touches.length === 1 && isDragging) {
      setMapPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartDistRef.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const scaleMultiplier = currentDist / touchStartDistRef.current;
      setMapScale((prev) => Math.min(Math.max(prev * scaleMultiplier, 0.7), 3.5));
      touchStartDistRef.current = currentDist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistRef.current = null;
  };

  return (
    <div
      id="india-landing-view"
      className="relative w-full h-full flex flex-col bg-[#050811] bg-cyber-grid overflow-hidden text-slate-100 select-none"
    >
      {/* 1. TOP OVERLAY: Mobile & Desktop Hero + Search */}
      <div className="absolute top-2.5 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-30 pointer-events-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
        {/* COMPACT HERO BADGE */}
        <div className="pointer-events-auto bg-[#070B14]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2.5 shadow-2xl flex items-center justify-between md:block shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-base font-extrabold tracking-wider font-heading text-white">
                STATION SE JUD KE
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                {currentZoomLevel === 1 ? 'LEVEL 1 : INDIA VIEW' : 'LEVEL 2 : REGIONAL VIEW'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-wide">
              Find your nearest metro station.
            </p>
          </div>

          {/* Mobile indicator pill */}
          <span className="inline-block sm:hidden text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
            20 CITIES
          </span>
        </div>

        {/* COMPACT MOBILE & DESKTOP SEARCH BAR */}
        <div className="pointer-events-auto flex items-center gap-2 w-full md:w-auto md:max-w-sm">
          <div className="relative flex-1">
            <div className="flex items-center bg-[#0B1120]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl px-3 py-2 sm:py-2 shadow-2xl focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition">
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-2" />
              <input
                id="floating-city-search-input"
                type="text"
                value={citySearchQuery}
                onFocus={() => setIsCitySearchFocused(true)}
                onChange={(e) => {
                  setCitySearchQuery(e.target.value);
                  setIsCitySearchFocused(true);
                }}
                placeholder="Search metro city... (Delhi, Mumbai, Meerut)"
                className="w-full text-xs text-white placeholder:text-slate-500 bg-transparent outline-none font-medium"
              />
              {citySearchQuery && (
                <button
                  onClick={() => setCitySearchQuery('')}
                  className="p-1 hover:text-white text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Floating Search Dropdown */}
            <AnimatePresence>
              {isCitySearchFocused && citySearchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute left-0 right-0 top-full mt-1.5 bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-700 max-h-64 overflow-y-auto z-40 p-1 backdrop-blur-2xl"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((city) => {
                      const isSelected = userSelections.some((s) => s.cityId === city.id);
                      return (
                        <button
                          key={city.id}
                          onClick={() => {
                            setIsCitySearchFocused(false);
                            setCitySearchQuery('');
                            onSelectCity(city.id);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800/80 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00F0FF] group-hover:scale-125 transition"></span>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-cyan-400 flex items-center gap-1.5">
                                <span>{city.name}</span>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  ({city.state})
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {city.stations.length} stations • {city.lines.length} lines
                              </div>
                            </div>
                          </div>
                          {isSelected ? (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Connected
                            </span>
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400 font-mono">
                      No matching operational metro city found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. REGIONAL PRESET PILLS (Visible on Desktop / Compact on Mobile) */}
      <div className="hidden sm:flex absolute top-20 left-4 z-20 items-center gap-1 bg-[#070B14]/85 backdrop-blur-xl p-1 rounded-2xl border border-slate-800/90 shadow-xl">
        <span className="text-[10px] font-mono text-slate-400 px-2 font-semibold">VIEW:</span>
        <button
          onClick={() => handleSelectRegion('all')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium transition ${
            activeRegion === 'all'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All India (20)
        </button>
        <button
          onClick={() => handleSelectRegion('north')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium transition ${
            activeRegion === 'north'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          North Hubs
        </button>
        <button
          onClick={() => handleSelectRegion('west')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium transition ${
            activeRegion === 'west'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          West & Central
        </button>
        <button
          onClick={() => handleSelectRegion('south')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium transition ${
            activeRegion === 'south'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          South Hubs
        </button>
      </div>

      {/* 3. MAIN FULL-VIEWPORT INTERACTIVE VECTOR MAP CANVAS */}
      <div
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full h-full flex items-center justify-center relative overflow-hidden touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <motion.div
          animate={{
            scale: mapScale,
            x: mapPan.x,
            y: mapPan.y,
          }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="w-full h-full flex items-center justify-center pt-16 sm:pt-0"
        >
          <svg
            viewBox={`0 0 ${INDIA_MAP_WIDTH} ${INDIA_MAP_HEIGHT}`}
            className="w-full h-full max-w-[96vh] max-h-[96vh] transition-all duration-150 drop-shadow-[0_0_35px_rgba(0,240,255,0.06)] overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Refined Glowing Filters */}
              <filter id="cityGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="cityGlowSaffron" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="cityHubHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0284C7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#050811" stopOpacity="0" />
              </radialGradient>

              <pattern id="cyberMapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="0.5"
                  strokeDasharray="2 6"
                  opacity="0.35"
                />
              </pattern>
            </defs>

            <rect width={INDIA_MAP_WIDTH} height={INDIA_MAP_HEIGHT} fill="url(#cyberMapGrid)" />

            {/* LAYER 1: ACCURATE INDIA GEOGRAPHIC BOUNDARY */}
            <g id="layer-1-india-geographic-boundary">
              {/* Internal State Boundaries */}
              <g id="sub-layer-state-boundaries" opacity="0.4">
                {indiaStateBoundaryPaths.map((state, sIdx) => (
                  <path
                    key={`state-${state.name}-${sIdx}`}
                    d={state.path}
                    fill="none"
                    stroke="#162238"
                    strokeWidth="0.75"
                    strokeDasharray="2 3"
                  />
                ))}
              </g>

              {/* Official Country Boundary MultiPolygon */}
              <g id="sub-layer-country-boundary">
                {indiaSvgBoundaryPaths.map((pathD, idx) => (
                  <path
                    key={`india-path-${idx}`}
                    d={pathD}
                    fill="#090F1C"
                    stroke="#1E2E4A"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="transition-colors duration-300 hover:stroke-cyan-500/40"
                  />
                ))}
              </g>

              {/* Island Territory Identifiers */}
              <g id="sub-layer-island-annotations" className="text-[8px] font-mono fill-slate-600 select-none">
                <text x="615" y="745" textAnchor="middle" fill="#334155" fontSize="7.5" letterSpacing="0.08em">
                  ANDAMAN & NICOBAR
                </text>
                <text x="125" y="770" textAnchor="middle" fill="#334155" fontSize="7.5" letterSpacing="0.08em">
                  LAKSHADWEEP
                </text>
              </g>
            </g>

            {/* LAYER 2: SIMPLIFIED SUBTLE METRO NETWORK CONNECTIONS */}
            {showNetworkFilaments && (
              <g id="layer-2-simplified-network-connections" opacity="0.45">
                {simplifiedCorridors.map((c) => (
                  <path
                    key={`corridor-${c.id}`}
                    d={c.d}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="0.9"
                    strokeDasharray="3 5"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            )}

            {/* LAYER 3: DYNAMIC LEADER LINES FOR DENSE CALLOUTS */}
            <g id="layer-3-radial-leader-lines">
              {NATIONAL_METRO_HUBS.map((hub) => {
                const placement = cityLabelPlacements.get(hub.id);
                if (!placement || !placement.hasLeaderLine) return null;

                const isSelectedByUser = userSelections.some((s) => s.cityId === hub.id);
                const isHovered = activeHubHover?.id === hub.id;

                const strokeColor = isSelectedByUser
                  ? '#10B981'
                  : isHovered
                  ? '#00F0FF'
                  : '#0284C7';

                return (
                  <g
                    key={`leader-line-${hub.id}`}
                    id={`leader-line-${hub.id}`}
                    className="pointer-events-none transition-all duration-200"
                    opacity={isHovered ? 1 : 0.75}
                  >
                    <path
                      d={placement.leaderPath}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 1.4 : 0.9}
                      strokeDasharray={isHovered ? 'none' : '2 2'}
                      strokeLinecap="round"
                    />
                    <circle
                      cx={placement.nodeX}
                      cy={placement.nodeY}
                      r={isHovered ? 2.5 : 1.5}
                      fill={strokeColor}
                    />
                    <circle
                      cx={placement.attachX}
                      cy={placement.attachY}
                      r={isHovered ? 2 : 1.2}
                      fill={strokeColor}
                    />
                  </g>
                );
              })}
            </g>

            {/* LAYER 4: EXACT GEOGRAPHIC GLOWING CITY NODES + ≥44px TOUCH HITBOX */}
            <g id="layer-4-metro-city-nodes">
              {NATIONAL_METRO_HUBS.map((hub) => {
                const isSelectedByUser = userSelections.some((s) => s.cityId === hub.id);
                const isHovered = activeHubHover?.id === hub.id;

                return (
                  <g
                    key={`city-node-${hub.id}`}
                    id={`city-node-${hub.id}`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCity(hub.id);
                    }}
                    onMouseEnter={() => setActiveHubHover(hub)}
                    onMouseLeave={() => setActiveHubHover(null)}
                  >
                    {/* Minimum 44px × 44px (radius 22px) transparent touch target for mobile */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="22"
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Subtle Pulsing Halo */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isHovered ? 16 : 10}
                      fill="url(#cityHubHalo)"
                      className="transition-all duration-300 pointer-events-none"
                    />

                    {/* Outer Ring */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isHovered ? 5.5 : 4}
                      fill="#070B14"
                      stroke={isSelectedByUser ? '#10B981' : isHovered ? '#00F0FF' : '#FF6B00'}
                      strokeWidth="1.6"
                      className="transition-all duration-200 pointer-events-none"
                      filter={isHovered ? 'url(#cityGlowCyan)' : undefined}
                    />

                    {/* Inner Core Point */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isHovered ? 2.5 : 1.8}
                      fill={isSelectedByUser ? '#10B981' : '#FFFFFF'}
                      className="pointer-events-none"
                    />
                  </g>
                );
              })}
            </g>

            {/* LAYER 5: CLEAN MINIMAL CITY TEXT LABELS (Short Names, Zero Clutter) */}
            <g id="layer-5-minimal-city-labels">
              {NATIONAL_METRO_HUBS.map((hub) => {
                const placement = cityLabelPlacements.get(hub.id);
                if (!placement) return null;

                const isSelectedByUser = userSelections.some((s) => s.cityId === hub.id);
                const isHovered = activeHubHover?.id === hub.id;
                const shortName = placement.shortName;

                return (
                  <g
                    key={`city-label-${hub.id}`}
                    id={`city-label-${hub.id}`}
                    transform={`translate(${placement.labelX}, ${placement.labelY})`}
                    className="cursor-pointer group select-none transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCity(hub.id);
                    }}
                    onMouseEnter={() => setActiveHubHover(hub)}
                    onMouseLeave={() => setActiveHubHover(null)}
                  >
                    {/* Generous touch hitbox for label */}
                    <rect
                      x="-4"
                      y="-4"
                      width={placement.labelWidth + 8}
                      height={placement.labelHeight + 8}
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Minimalist Backdrop Pill */}
                    <rect
                      x="0"
                      y="0"
                      width={placement.labelWidth}
                      height={placement.labelHeight}
                      rx="4"
                      fill="#070B14"
                      fillOpacity={isHovered ? 0.95 : 0.88}
                      stroke={isSelectedByUser ? '#10B981' : isHovered ? '#00F0FF' : '#1E293B'}
                      strokeWidth={isHovered ? '1.2' : '0.75'}
                      className="transition-all duration-150 group-hover:fill-[#0B132B]"
                    />

                    {/* Status Indicator Dot */}
                    <circle
                      cx="6"
                      cy="9"
                      r={isSelectedByUser ? 2.5 : 1.8}
                      fill={isSelectedByUser ? '#10B981' : isHovered ? '#00F0FF' : '#FF6B00'}
                    />

                    {/* Clean Short City Name Text */}
                    <text
                      x="12"
                      y="12.5"
                      className={`text-[10px] font-bold font-mono tracking-tight transition-colors duration-150 ${
                        isSelectedByUser
                          ? 'fill-emerald-300'
                          : isHovered
                          ? 'fill-cyan-300 font-extrabold'
                          : 'fill-slate-200'
                      }`}
                    >
                      {shortName}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* LAYER 6: COMMUTER'S CONFIRMED STATION BEACONS */}
            <g id="layer-6-user-selected-stations">
              {userSelections.map((selection) => {
                const city = CITIES_METRO_DATA.find((c) => c.id === selection.cityId);
                const station = city?.stations.find((s) => s.id === selection.stationId);
                if (!station) return null;

                const [svgX, svgY] = geoToSvgCoordinates(station.latitude, station.longitude);

                return (
                  <g key={`user-beacon-${selection.cityId}-${selection.stationId}`} className="pointer-events-none">
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r="9"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.4"
                      className="animate-ping origin-center opacity-75"
                    />
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r="12"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                      className="animate-spin origin-center"
                      style={{ animationDuration: '8s' }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </motion.div>

        {/* Hover / Tap Quick City Card */}
        <AnimatePresence>
          {activeHubHover && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-6 bg-[#070B14]/95 backdrop-blur-2xl text-white p-3.5 rounded-2xl shadow-2xl border border-cyan-500/40 z-30 sm:max-w-xs pointer-events-auto"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1 text-cyan-400 font-mono font-bold uppercase text-[10px] tracking-wider">
                  <Activity className="w-3 h-3 text-[#FF6B00]" />
                  <span>{activeHubHover.name}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">{activeHubHover.state}</span>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <span className="text-slate-400">{activeHubHover.totalStations} Stations</span>
                <button
                  onClick={() => onSelectCity(activeHubHover.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-black font-bold text-xs font-mono transition flex items-center gap-1 shadow-md"
                >
                  EXPLORE METRO &rarr;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. COMPACT FLOATING MAP CONTROLS (+, −, ↻) */}
      <div
        id="compact-map-zoom-controls"
        className="absolute bottom-3 sm:bottom-4 right-3 sm:left-4 sm:right-auto z-20 flex sm:flex-row items-center gap-1 bg-[#070B14]/90 backdrop-blur-xl rounded-2xl p-1 sm:p-1.5 border border-slate-800 shadow-2xl"
      >
        <button
          id="zoom-in-map-btn"
          onClick={() => handleZoom(0.25)}
          className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-200 hover:text-cyan-400 transition"
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="zoom-out-map-btn"
          onClick={() => handleZoom(-0.25)}
          className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-200 hover:text-cyan-400 transition"
          title="Zoom Out (−)"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="reset-map-view-btn"
          onClick={handleResetMap}
          className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-200 hover:text-cyan-400 transition"
          title="Reset View (↻)"
          aria-label="Reset map"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Network Toggle Button on wider screens */}
        <button
          id="toggle-filaments-btn"
          onClick={() => setShowNetworkFilaments(!showNetworkFilaments)}
          className={`hidden sm:flex px-2 py-1 rounded-xl text-[10px] font-mono font-bold transition items-center gap-1 border ${
            showNetworkFilaments
              ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80'
              : 'text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title="Toggle network connections"
        >
          <Layers className="w-3 h-3" />
          <span>NETWORK</span>
        </button>
      </div>

      {/* 5. MINIMAL DESKTOP LEGEND HUD */}
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 hidden md:flex items-center gap-3 bg-[#070B14]/80 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-slate-800 text-[10px] text-slate-400 font-mono shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] shadow-[0_0_6px_#FF6B00]"></span>
          <span>Metro City</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
          <span>Connected</span>
        </div>
        <div className="text-slate-700">|</div>
        <span className="text-slate-300">Tap city to view network</span>
      </div>
    </div>
  );
};
