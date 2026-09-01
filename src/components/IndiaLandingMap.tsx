import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Compass,
  Zap,
} from 'lucide-react';

interface IndiaLandingMapProps {
  onSelectCity: (cityId: string, station?: MetroStation) => void;
  userSelections: UserStationSelection[];
  onOpenAnalytics: () => void;
  onOpenMyStations: () => void;
}

export const IndiaLandingMap: React.FC<IndiaLandingMapProps> = ({
  onSelectCity,
  userSelections,
  onOpenAnalytics,
  onOpenMyStations,
}) => {
  const [activeHubHover, setActiveHubHover] = useState<NationalMetroSummary | null>(null);
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

  // Geographic SVG outline paths generated via D3 projection from GeoJSON
  const indiaSvgBoundaryPaths = useMemo(() => getIndiaBoundarySvgPaths(), []);
  const indiaStateBoundaryPaths = useMemo(() => getIndiaStateBoundarySvgPaths(), []);

  // Map of hubs for quick lookup
  const hubMap = useMemo(() => new Map(NATIONAL_METRO_HUBS.map((h) => [h.id, h])), []);

  // Simplified subtle national network connection filaments
  const nationalCorridors = useMemo(() => {
    const connections = [
      { from: 'delhi', to: 'noida', speed: 3.2, delay: 0 },
      { from: 'delhi', to: 'gurgaon', speed: 3.0, delay: 0.5 },
      { from: 'delhi', to: 'meerut', speed: 3.4, delay: 1.0 },
      { from: 'delhi', to: 'agra', speed: 4.2, delay: 0.2 },
      { from: 'delhi', to: 'jaipur', speed: 4.5, delay: 0.8 },
      { from: 'delhi', to: 'kanpur', speed: 4.8, delay: 1.4 },
      { from: 'delhi', to: 'lucknow', speed: 5.0, delay: 0.6 },
      { from: 'delhi', to: 'bhopal', speed: 5.4, delay: 1.2 },
      { from: 'delhi', to: 'ahmedabad', speed: 5.8, delay: 1.8 },
      { from: 'delhi', to: 'mumbai', speed: 6.2, delay: 0.4 },
      { from: 'delhi', to: 'hyderabad', speed: 6.5, delay: 2.0 },
      { from: 'delhi', to: 'kolkata', speed: 6.8, delay: 1.5 },
      { from: 'agra', to: 'kanpur', speed: 3.6, delay: 0.3 },
      { from: 'kanpur', to: 'lucknow', speed: 3.0, delay: 0.9 },
      { from: 'lucknow', to: 'patna', speed: 4.6, delay: 1.1 },
      { from: 'patna', to: 'kolkata', speed: 5.0, delay: 1.6 },
      { from: 'jaipur', to: 'ahmedabad', speed: 4.8, delay: 1.1 },
      { from: 'ahmedabad', to: 'indore', speed: 4.0, delay: 0.7 },
      { from: 'ahmedabad', to: 'mumbai', speed: 4.6, delay: 1.3 },
      { from: 'mumbai', to: 'navi-mumbai', speed: 2.8, delay: 0.1 },
      { from: 'mumbai', to: 'pune', speed: 3.2, delay: 0.5 },
      { from: 'mumbai', to: 'nagpur', speed: 5.2, delay: 1.7 },
      { from: 'bhopal', to: 'indore', speed: 3.4, delay: 0.4 },
      { from: 'bhopal', to: 'nagpur', speed: 4.2, delay: 1.0 },
      { from: 'pune', to: 'hyderabad', speed: 4.8, delay: 1.6 },
      { from: 'nagpur', to: 'hyderabad', speed: 4.4, delay: 0.8 },
      { from: 'hyderabad', to: 'bengaluru', speed: 5.0, delay: 1.2 },
      { from: 'hyderabad', to: 'chennai', speed: 5.2, delay: 0.3 },
      { from: 'bengaluru', to: 'chennai', speed: 3.8, delay: 0.7 },
      { from: 'bengaluru', to: 'kochi', speed: 4.4, delay: 1.5 },
      { from: 'chennai', to: 'kochi', speed: 4.6, delay: 0.9 },
      { from: 'kolkata', to: 'chennai', speed: 6.6, delay: 2.2 },
    ];

    return connections
      .map(({ from, to, speed, delay }) => {
        const h1 = hubMap.get(from);
        const h2 = hubMap.get(to);
        if (!h1 || !h2) return null;

        const midX = (h1.x + h2.x) / 2 + (h2.y - h1.y) * 0.025;
        const midY = (h1.y + h2.y) / 2 - (h2.x - h1.x) * 0.025;
        return {
          id: `${from}-${to}`,
          from,
          to,
          speed,
          delay,
          d: `M ${h1.x} ${h1.y} Q ${midX} ${midY} ${h2.x} ${h2.y}`,
        };
      })
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [hubMap]);

  // Compute global non-overlapping city label placements
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
    setActiveHubHover(null);
  };

  // Mouse Handlers for Pan
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
    setMapScale((prev) => Math.min(Math.max(prev + factor, 0.75), 3.5));
  };

  // Touch Handlers for Mobile (Pan & Pinch)
  const handleTouchStart = (e: React.TouchEvent) => {
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
      setMapScale((prev) => Math.min(Math.max(prev * scaleMultiplier, 0.75), 3.5));
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
      className="relative w-full h-full flex flex-col bg-[#060813] overflow-hidden text-slate-100 select-none"
    >
      {/* Subtle Atmospheric Vignette & Radial Depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(14,24,46,0.5)_0%,rgba(6,8,19,0.95)_75%)]" />

      {/* ========================================================= */}
      {/* 1. EDITORIAL HERO: MINIMAL, SPACIOUS, ZERO RECTANGULAR CARD */}
      {/* ========================================================= */}
      <div className="absolute top-4 sm:top-7 left-4 sm:left-8 z-30 pointer-events-none max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-1.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse shadow-[0_0_8px_#FF6B00]" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.28em] text-[#FF6B00] uppercase font-bold">
              India In Motion
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FAF7F2] font-heading leading-tight drop-shadow-md">
            STATION SE JUD KE
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-normal text-[#94A3B8] tracking-wide max-w-md">
            Find your nearest metro station.
          </p>
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* 2. REFINED FLOATING SEARCH: MINIMALIST, NON-OBTRUSIVE      */}
      {/* ========================================================= */}
      <div className="absolute top-4 sm:top-7 right-4 sm:right-8 z-30 pointer-events-auto w-auto max-w-[280px] sm:max-w-xs md:max-w-sm">
        <div className="relative">
          <div className="flex items-center bg-[#0B1021]/80 backdrop-blur-2xl border border-slate-800 hover:border-slate-700 rounded-full px-3.5 py-2 shadow-2xl focus-within:border-[#FF6B00]/70 focus-within:ring-1 focus-within:ring-[#FF6B00]/30 transition-all duration-200">
            <Search className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mr-2" />
            <input
              id="floating-city-search-input"
              type="text"
              value={citySearchQuery}
              onFocus={() => setIsCitySearchFocused(true)}
              onChange={(e) => {
                setCitySearchQuery(e.target.value);
                setIsCitySearchFocused(true);
              }}
              placeholder="Search 21 metro cities..."
              className="w-full text-xs text-white placeholder:text-slate-500 bg-transparent outline-none font-medium"
            />
            {citySearchQuery && (
              <button
                onClick={() => setCitySearchQuery('')}
                className="p-0.5 hover:text-white text-slate-400"
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
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0B1021]/95 rounded-2xl shadow-2xl border border-slate-800 max-h-64 overflow-y-auto z-40 p-1.5 backdrop-blur-2xl"
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
                          <span className="w-2 h-2 rounded-full bg-[#FF6B00] group-hover:scale-125 transition"></span>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-[#FF6B00] flex items-center gap-1.5">
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
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#FF6B00] transition" />
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

      {/* ========================================================= */}
      {/* 3. HERO INTERACTIVE VECTOR MAP: ACCURATE INDIA DOMINATES   */}
      {/* ========================================================= */}
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
          className="w-full h-full flex items-center justify-center pt-16 sm:pt-4"
        >
          <svg
            viewBox={`0 0 ${INDIA_MAP_WIDTH} ${INDIA_MAP_HEIGHT}`}
            className="w-full h-full max-w-[95vh] max-h-[95vh] transition-all duration-150 overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Refined Subtle Glow Filter */}
              <filter id="heroWarmGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="cityNodeHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#FF6B00" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#060813" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* LAYER 1: ACCURATE INDIA GEOGRAPHIC BOUNDARY */}
            <g id="layer-1-india-geographic-boundary">
              {/* Internal State Boundaries (Subtle & Restrained) */}
              <g id="sub-layer-state-boundaries" opacity="0.35">
                {indiaStateBoundaryPaths.map((state, sIdx) => (
                  <path
                    key={`state-${state.name}-${sIdx}`}
                    d={state.path}
                    fill="none"
                    stroke="#18233C"
                    strokeWidth="0.7"
                  />
                ))}
              </g>

              {/* Official Country Boundary MultiPolygon (Warm Ivory / Soft Off-White Contour) */}
              <g id="sub-layer-country-boundary">
                {indiaSvgBoundaryPaths.map((pathD, idx) => (
                  <path
                    key={`india-path-${idx}`}
                    d={pathD}
                    fill="#0A1020"
                    stroke="#EAE5DB"
                    strokeWidth="1.65"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeOpacity="0.85"
                    filter="url(#heroWarmGlow)"
                    className="transition-colors duration-300"
                  />
                ))}
              </g>

              {/* Island Territory Identifiers (Quiet & Editorial) */}
              <g id="sub-layer-island-annotations" className="text-[7.5px] font-mono fill-slate-600 select-none">
                <text x="615" y="745" textAnchor="middle" fill="#3B4861" fontSize="7.5" letterSpacing="0.1em">
                  ANDAMAN & NICOBAR
                </text>
                <text x="125" y="770" textAnchor="middle" fill="#3B4861" fontSize="7.5" letterSpacing="0.1em">
                  LAKSHADWEEP
                </text>
              </g>
            </g>

            {/* LAYER 2: "INDIA IN MOTION" SUBTLE TRANSIT CORRIDORS & PARTICLES */}
            {showNetworkFilaments && (
              <g id="layer-2-transit-corridors">
                {/* Base connection lines */}
                {nationalCorridors.map((c) => (
                  <path
                    key={`corridor-line-${c.id}`}
                    d={c.d}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="0.85"
                    strokeOpacity="0.28"
                    strokeDasharray="3 4"
                    strokeLinecap="round"
                  />
                ))}

                {/* Animated light pulses traveling along transit arteries */}
                {nationalCorridors.map((c) => (
                  <circle
                    key={`pulse-${c.id}`}
                    r="1.75"
                    fill="#FF6B00"
                    opacity="0.85"
                    className="pointer-events-none"
                  >
                    <animateMotion
                      dur={`${c.speed}s`}
                      repeatCount="indefinite"
                      path={c.d}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      begin={`${c.delay}s`}
                    />
                  </circle>
                ))}
              </g>
            )}

            {/* LAYER 3: CLEAN HAIR-LINE RADIAL LEADER LINES FOR DENSE CALLOUTS */}
            <g id="layer-3-radial-leader-lines">
              {NATIONAL_METRO_HUBS.map((hub) => {
                const placement = cityLabelPlacements.get(hub.id);
                if (!placement || !placement.hasLeaderLine) return null;

                const isSelectedByUser = userSelections.some((s) => s.cityId === hub.id);
                const isHovered = activeHubHover?.id === hub.id;

                const strokeColor = isSelectedByUser
                  ? '#10B981'
                  : isHovered
                  ? '#FF6B00'
                  : '#38BDF8';

                return (
                  <g
                    key={`leader-line-${hub.id}`}
                    id={`leader-line-${hub.id}`}
                    className="pointer-events-none transition-all duration-200"
                    opacity={isHovered ? 1 : 0.55}
                  >
                    <path
                      d={placement.leaderPath}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 1.2 : 0.75}
                      strokeDasharray={isHovered ? 'none' : '1.5 2'}
                      strokeLinecap="round"
                    />
                    <circle
                      cx={placement.nodeX}
                      cy={placement.nodeY}
                      r={isHovered ? 2.2 : 1.4}
                      fill={strokeColor}
                    />
                  </g>
                );
              })}
            </g>

            {/* LAYER 4: EXACT GEOGRAPHIC NODES (● Node with ≥44px Touch Target) */}
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
                    {/* Minimum 44px × 44px (radius 22px) touch hitbox */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="22"
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Subtle Pulsing Halo on Hover */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isHovered ? 14 : 7}
                      fill="url(#cityNodeHalo)"
                      className="transition-all duration-300 pointer-events-none"
                    />

                    {/* Outer Ring */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isHovered ? 5.5 : 3.8}
                      fill="#060813"
                      stroke={isSelectedByUser ? '#10B981' : isHovered ? '#FFFFFF' : '#FF6B00'}
                      strokeWidth="1.6"
                      className="transition-all duration-200 pointer-events-none"
                    />

                    {/* Inner Core Point */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isHovered ? 2.6 : 1.8}
                      fill={isSelectedByUser ? '#10B981' : isHovered ? '#FF6B00' : '#FAF7F2'}
                      className="pointer-events-none"
                    />
                  </g>
                );
              })}
            </g>

            {/* LAYER 5: EDITORIAL CITY LABELS (● CityName, Clean Typography, Zero Clutter) */}
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
                    {/* Generous touch hitbox */}
                    <rect
                      x="-4"
                      y="-4"
                      width={placement.labelWidth + 8}
                      height={placement.labelHeight + 8}
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Editorial Text with Crisp Stroke Halo for Flawless Readability */}
                    <text
                      x="0"
                      y="13"
                      style={{
                        paintOrder: 'stroke fill',
                        stroke: '#060813',
                        strokeWidth: 3,
                        strokeLinejoin: 'round',
                      }}
                      className={`text-[11px] font-semibold tracking-wide transition-colors duration-150 font-heading ${
                        isSelectedByUser
                          ? 'fill-emerald-400 font-bold'
                          : isHovered
                          ? 'fill-[#FF6B00] font-bold'
                          : 'fill-[#FAF7F2]'
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
                      r="10"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      className="animate-ping origin-center opacity-75"
                    />
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r="14"
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

        {/* Hover / Tap Quick City Modal Card */}
        <AnimatePresence>
          {activeHubHover && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-16 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 bg-[#0B1021]/95 backdrop-blur-2xl text-white p-4 rounded-2xl shadow-2xl border border-slate-800 z-30 sm:max-w-xs pointer-events-auto"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-white font-bold text-sm tracking-tight font-heading">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  <span>{activeHubHover.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{activeHubHover.state}</span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 font-mono">{activeHubHover.totalStations} Stations</span>
                <button
                  onClick={() => onSelectCity(activeHubHover.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7700] text-slate-950 font-bold text-xs tracking-wide transition flex items-center gap-1 shadow-md"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================= */}
      {/* 4. DISCREET FLOATING MAP CONTROLS (+, −, ↻, Filaments)    */}
      {/* ========================================================= */}
      <div
        id="compact-map-zoom-controls"
        className="absolute bottom-4 left-4 sm:left-8 z-20 flex items-center gap-1.5 bg-[#0B1021]/85 backdrop-blur-xl rounded-full p-1 border border-slate-800/90 shadow-2xl"
      >
        <button
          id="zoom-in-map-btn"
          onClick={() => handleZoom(0.25)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="zoom-out-map-btn"
          onClick={() => handleZoom(-0.25)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
          title="Zoom Out (−)"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="reset-map-view-btn"
          onClick={handleResetMap}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
          title="Reset View (↻)"
          aria-label="Reset map"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Network Filaments Toggle */}
        <button
          id="toggle-filaments-btn"
          onClick={() => setShowNetworkFilaments(!showNetworkFilaments)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition flex items-center gap-1 border ${
            showNetworkFilaments
              ? 'bg-[#FF6B00]/15 text-[#FF6B00] border-[#FF6B00]/40'
              : 'text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title="Toggle Network Corridors"
        >
          <Layers className="w-3 h-3" />
          <span className="hidden sm:inline">MOTION</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 5. QUIET BOTTOM-RIGHT EDITORIAL LEGEND                    */}
      {/* ========================================================= */}
      <div className="absolute bottom-4 right-4 sm:right-8 z-10 hidden md:flex items-center gap-3 bg-[#0B1021]/80 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-slate-800 text-[11px] text-slate-400 font-mono shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
          <span>Metro City</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Connected</span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">Tap city to view network</span>
      </div>
    </div>
  );
};
