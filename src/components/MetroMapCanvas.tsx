import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CityMetroNetwork, MetroStation, UserStationSelection } from '../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Navigation,
  Info,
  X,
  MapPin,
  Train,
} from 'lucide-react';

interface MetroMapCanvasProps {
  city: CityMetroNetwork;
  userSelection?: UserStationSelection;
  onSelectStation: (station: MetroStation) => void;
  onBackToIndia: () => void;
}

export const MetroMapCanvas: React.FC<MetroMapCanvasProps> = ({
  city,
  userSelection,
  onSelectStation,
  onBackToIndia,
}) => {
  // Pan and Zoom Transform State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filtering & Searching
  const [activeLineFilter, setActiveLineFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredStation, setHoveredStation] = useState<MetroStation | null>(null);
  const [selectedPreviewStation, setSelectedPreviewStation] = useState<MetroStation | null>(null);
  const [showLineFilterDrawer, setShowLineFilterDrawer] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number | null>(null);

  // Container live dimensions via ResizeObserver
  const [containerDim, setContainerDim] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight - 64 : 800,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerDim({ width, height });
        }
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute dynamic responsive viewBox matching the container's exact aspect ratio
  const dynamicViewBox = useMemo(() => {
    if (!city.stations || city.stations.length === 0) {
      return { minX: 0, minY: 0, width: 1000, height: 800, string: '0 0 1000 800' };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    city.stations.forEach((st) => {
      if (st.coordinates.x < minX) minX = st.coordinates.x;
      if (st.coordinates.x > maxX) maxX = st.coordinates.x;
      if (st.coordinates.y < minY) minY = st.coordinates.y;
      if (st.coordinates.y > maxY) maxY = st.coordinates.y;
    });

    const contentW = Math.max(maxX - minX, 100);
    const contentH = Math.max(maxY - minY, 100);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const isMobile = containerDim.width < 768;
    // Padding: generous side padding, and extra top padding on mobile so floating search doesn't cover top stations
    const padX = isMobile ? 45 : 70;
    const padTop = isMobile ? 120 : 80;
    const padBottom = isMobile ? 65 : 70;

    const paddedW = contentW + padX * 2;
    const paddedH = contentH + padTop + padBottom;
    // Center point adjusted for top floating controls offset
    const paddedCy = cy + (padTop - padBottom) / 2;

    const containerAspect = containerDim.width / Math.max(containerDim.height, 1);
    const contentAspect = paddedW / Math.max(paddedH, 1);

    let vbWidth = paddedW;
    let vbHeight = paddedH;

    if (containerAspect > contentAspect) {
      // Screen is wider than content (desktop / landscape)
      vbHeight = paddedH;
      vbWidth = paddedH * containerAspect;
    } else {
      // Screen is taller than content (mobile portrait)
      vbWidth = paddedW;
      vbHeight = paddedW / containerAspect;
    }

    const vbMinX = Math.round(cx - vbWidth / 2);
    const vbMinY = Math.round(paddedCy - vbHeight / 2);
    const vbW = Math.round(vbWidth);
    const vbH = Math.round(vbHeight);

    return {
      minX: vbMinX,
      minY: vbMinY,
      width: vbW,
      height: vbH,
      string: `${vbMinX} ${vbMinY} ${vbW} ${vbH}`,
    };
  }, [city.stations, containerDim]);

  // Reset zoom & pan on city change
  useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setActiveLineFilter(null);
    setSearchQuery('');
    setHoveredStation(null);
    setSelectedPreviewStation(null);
  }, [city.id]);

  // Center on station helper
  const centerOnStation = useCallback(
    (station: MetroStation) => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const targetScale = 1.5;

      const vb = dynamicViewBox;
      const centerX = container.width / 2;
      const centerY = container.height / 2;

      const stationSvgX = ((station.coordinates.x - vb.minX) / vb.width) * container.width;
      const stationSvgY = ((station.coordinates.y - vb.minY) / vb.height) * container.height;

      setPan({
        x: centerX - stationSvgX * targetScale,
        y: centerY - stationSvgY * targetScale,
      });
      setScale(targetScale);
      setSelectedPreviewStation(station);
    },
    [dynamicViewBox]
  );

  // Handle Zoom controls
  const handleZoom = (delta: number) => {
    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.5), 3.5);
      return Number(next.toFixed(2));
    });
  };

  const handleResetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setSelectedPreviewStation(null);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = -e.deltaY * 0.0012;
    setScale((prev) => Math.min(Math.max(prev + zoomFactor, 0.5), 3.5));
  };

  // Touch Handlers for Mobile Pan & Pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartDistRef.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const scaleMultiplier = currentDist / touchStartDistRef.current;
      setScale((prev) => Math.min(Math.max(prev * scaleMultiplier, 0.5), 3.5));
      touchStartDistRef.current = currentDist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistRef.current = null;
  };

  // Search Results
  const filteredSearchStations = searchQuery.trim()
    ? city.stations.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.hindiName && s.hindiName.includes(searchQuery)) ||
          (s.landmark && s.landmark.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Filtered Lines
  const visibleLines = activeLineFilter
    ? city.lines.filter((l) => l.id === activeLineFilter)
    : city.lines;

  return (
    <div
      id="metro-map-viewport"
      className="relative w-full h-full flex flex-col bg-[#050811] bg-cyber-grid overflow-hidden text-slate-100 select-none"
    >
      {/* Top Floating Control Bar (Back to India, Search, Line Filter, Station Status) */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Back button & Search Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto flex-1 max-w-lg">
          <button
            id="back-to-india-map-btn"
            onClick={onBackToIndia}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#070B14]/90 backdrop-blur-xl border border-slate-800 text-slate-200 text-xs font-semibold font-mono uppercase tracking-wider shadow-xl hover:border-cyan-500 hover:text-cyan-300 transition shrink-0"
            title="Return to National Map"
          >
            <Navigation className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="hidden sm:inline">All India</span>
          </button>

          {/* City & System indicator pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#070B14]/90 backdrop-blur-xl border border-slate-800 text-xs font-mono shrink-0">
            <Train className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="font-bold text-white">{city.name}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{city.totalStations} Stns</span>
          </div>

          {/* Station Search Input */}
          <div className="relative flex-1 min-w-[140px]">
            <div className="flex items-center bg-[#070B14]/90 backdrop-blur-xl border border-slate-800 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-xl focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition">
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-1.5 sm:mr-2" />
              <input
                id="metro-station-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${city.name} station...`}
                className="w-full text-xs text-white placeholder:text-slate-500 bg-transparent outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 hover:text-white text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            <AnimatePresence>
              {searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 top-full mt-1.5 bg-[#0B1120] rounded-2xl shadow-2xl border border-slate-700 max-h-60 overflow-y-auto z-40 p-1.5 backdrop-blur-2xl"
                >
                  {filteredSearchStations.length > 0 ? (
                    filteredSearchStations.map((station) => (
                      <div
                        key={station.id}
                        onClick={() => {
                          centerOnStation(station);
                          setSearchQuery('');
                        }}
                        className="p-2.5 hover:bg-slate-800/80 rounded-xl cursor-pointer transition flex items-center justify-between text-xs group"
                      >
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5 group-hover:text-cyan-400 transition">
                            <span>{station.name}</span>
                            {station.hindiName && (
                              <span className="text-[10px] text-slate-500 font-serif-indian">
                                {station.hindiName}
                              </span>
                            )}
                          </div>
                          {station.landmark && (
                            <div className="text-[10px] text-slate-400 font-mono">{station.landmark}</div>
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-2 py-0.5 rounded-lg">
                          LOCATE
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500">
                      No station matching "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Line Filters & Station Connected Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto ml-auto">
          <button
            id="toggle-line-filters-btn"
            onClick={() => setShowLineFilterDrawer(!showLineFilterDrawer)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl backdrop-blur-xl border text-xs font-semibold font-mono uppercase tracking-wider shadow-xl transition ${
              activeLineFilter
                ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.4)]'
                : 'bg-[#070B14]/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {activeLineFilter
                ? city.lines.find((l) => l.id === activeLineFilter)?.name
                : 'Lines'}
            </span>
          </button>

          {userSelection && (
            <div
              id="active-city-connected-badge"
              onClick={() => {
                const st = city.stations.find((s) => s.id === userSelection.stationId);
                if (st) centerOnStation(st);
              }}
              className="cursor-pointer flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-400 transition"
              title="Click to center your nearest station on map"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono truncate max-w-[90px] sm:max-w-none">
                ✓ {userSelection.stationName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Line Filter Drawer */}
      <AnimatePresence>
        {showLineFilterDrawer && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 sm:top-16 right-2.5 sm:right-4 z-30 bg-[#0B1120]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700 p-3.5 max-w-xs w-full"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                Filter by Metro Line
              </span>
              <button
                onClick={() => setShowLineFilterDrawer(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  setActiveLineFilter(null);
                  setShowLineFilterDrawer(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold font-mono uppercase transition flex items-center justify-between ${
                  activeLineFilter === null
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>All Lines ({city.lines.length})</span>
                <span className="text-[10px] opacity-75">{city.stations.length} stns</span>
              </button>

              {city.lines.map((line) => (
                <button
                  key={line.id}
                  onClick={() => {
                    setActiveLineFilter(line.id === activeLineFilter ? null : line.id);
                    setShowLineFilterDrawer(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    activeLineFilter === line.id
                      ? 'bg-slate-800 text-white border border-[#FF6B00]'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: line.color, boxShadow: `0 0 8px ${line.color}` }}
                    />
                    <span className="font-semibold">{line.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-serif-indian">
                    {line.hindiName}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Fullscreen Interactive SVG Canvas Container */}
      <div
        ref={containerRef}
        id="metro-map-canvas-container"
        className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center origin-center"
          animate={{
            x: pan.x,
            y: pan.y,
            scale: scale,
          }}
          transition={{ type: 'tween', duration: isDragging ? 0 : 0.15 }}
          style={{ willChange: 'transform' }}
        >
          <svg
            viewBox={dynamicViewBox.string}
            className="w-full h-full select-none overflow-visible"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="metroLineGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="stationDropShadowDarkCanvas" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
              </filter>

              <pattern id="cityCanvasGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="0.5"
                  strokeDasharray="2 6"
                  opacity="0.4"
                />
              </pattern>
            </defs>

            {/* Background Grid covering the entire dynamic viewBox */}
            <rect
              x={dynamicViewBox.minX - 500}
              y={dynamicViewBox.minY - 500}
              width={dynamicViewBox.width + 1000}
              height={dynamicViewBox.height + 1000}
              fill="url(#cityCanvasGrid)"
            />

            {/* Line Routes Layer */}
            <g id="metro-routes-layer">
              {visibleLines.map((line) => {
                return (
                  <g key={line.id} id={`line-${line.id}`}>
                    <path
                      d={line.pathD}
                      fill="none"
                      stroke={line.color}
                      strokeWidth={(line.strokeWidth || 6) + 6}
                      strokeOpacity="0.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#metroLineGlow)"
                    />
                    <path
                      d={line.pathD}
                      fill="none"
                      stroke={line.color}
                      strokeWidth={line.strokeWidth || 6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300"
                    />
                    <path
                      d={line.pathD}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeOpacity="0.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}
            </g>

            {/* Station Nodes Layer with Minimum 44px Touch Targets */}
            <g id="metro-stations-layer">
              {city.stations.map((station) => {
                const isLineVisible =
                  !activeLineFilter || station.lineIds.includes(activeLineFilter);
                if (!isLineVisible) return null;

                const isConfirmed = userSelection?.stationId === station.id;
                const isHovered = hoveredStation?.id === station.id;
                const isSelectedForPreview = selectedPreviewStation?.id === station.id;
                const primaryLine = city.lines.find((l) => l.id === station.lineIds[0]);
                const stationColor = primaryLine ? primaryLine.color : '#FF6B00';

                const nodeRadius = station.isInterchange ? 9.5 : station.isTerminal ? 8 : 6.5;

                return (
                  <g
                    key={station.id}
                    id={`station-node-${station.id}`}
                    transform={`translate(${station.coordinates.x}, ${station.coordinates.y})`}
                    className="station-node cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStation(station);
                    }}
                    onMouseEnter={() => setHoveredStation(station)}
                    onMouseLeave={() => setHoveredStation(null)}
                  >
                    {/* Minimum 44px × 44px (radius 22px) touch target for mobile */}
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* User's Confirmed Nearest Station Animated Ring */}
                    {isConfirmed && (
                      <g className="pointer-events-none">
                        <circle
                          cx="0"
                          cy="0"
                          r={nodeRadius + 14}
                          fill="#10B981"
                          fillOpacity="0.25"
                          className="animate-ping origin-center"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r={nodeRadius + 8}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          className="animate-spin origin-center"
                          style={{ animationDuration: '8s' }}
                        />
                      </g>
                    )}

                    {/* Selected Highlight Halo */}
                    {(isHovered || isSelectedForPreview) && !isConfirmed && (
                      <circle
                        cx="0"
                        cy="0"
                        r={nodeRadius + 7}
                        fill="#00F0FF"
                        fillOpacity="0.25"
                        className="animate-pulse origin-center pointer-events-none"
                      />
                    )}

                    {/* Interchange Double-Ring or Normal Station Node */}
                    {station.isInterchange ? (
                      <g className="pointer-events-none">
                        <circle
                          cx="0"
                          cy="0"
                          r={nodeRadius}
                          fill="#070B14"
                          stroke={isConfirmed ? '#10B981' : isHovered ? '#00F0FF' : '#FFFFFF'}
                          strokeWidth="2.5"
                          filter="url(#stationDropShadowDarkCanvas)"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r={nodeRadius - 4}
                          fill={isConfirmed ? '#10B981' : isHovered ? '#FF6B00' : stationColor}
                        />
                      </g>
                    ) : (
                      <circle
                        cx="0"
                        cy="0"
                        r={nodeRadius}
                        fill={isConfirmed ? '#10B981' : isHovered ? '#00F0FF' : '#070B14'}
                        stroke={isConfirmed ? '#10B981' : isHovered ? '#FFFFFF' : stationColor}
                        strokeWidth="2.5"
                        filter="url(#stationDropShadowDarkCanvas)"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Station Name Typography Label */}
                    <g
                      className="pointer-events-none"
                      transform={`translate(0, ${
                        station.coordinates.y > dynamicViewBox.minY + dynamicViewBox.height * 0.8
                          ? -(nodeRadius + 11)
                          : nodeRadius + 14
                      })`}
                    >
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        className="text-[10px] sm:text-[11px] font-bold fill-slate-100 font-mono tracking-wide select-none"
                        style={{
                          paintOrder: 'stroke',
                          stroke: '#050811',
                          strokeWidth: '4px',
                          strokeLinejoin: 'round',
                          fontWeight: isConfirmed || isHovered ? '900' : '700',
                          fill: isConfirmed ? '#34D399' : isHovered ? '#38BDF8' : '#F1F5F9',
                        }}
                      >
                        {station.name}
                      </text>

                      {station.hindiName && (
                        <text
                          x="0"
                          y="11"
                          textAnchor="middle"
                          className="text-[8px] sm:text-[9px] fill-slate-400 font-serif-indian select-none"
                          style={{
                            paintOrder: 'stroke',
                            stroke: '#050811',
                            strokeWidth: '3px',
                            strokeLinejoin: 'round',
                          }}
                        >
                          {station.hindiName}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </motion.div>

        {/* Hover / Tap Station Quick Detail Overlay Card */}
        <AnimatePresence>
          {hoveredStation && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-30 bg-[#070B14]/95 backdrop-blur-2xl text-white rounded-2xl p-4 shadow-2xl border border-cyan-500/40 pointer-events-auto"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-white">
                      {hoveredStation.name}
                    </h4>
                    {hoveredStation.isInterchange && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[9px] font-mono font-bold uppercase">
                        Interchange
                      </span>
                    )}
                  </div>
                  {hoveredStation.hindiName && (
                    <p className="text-xs text-slate-400 font-serif-indian">
                      {hoveredStation.hindiName}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onSelectStation(hoveredStation)}
                  className="px-3 py-1.5 rounded-xl bg-[#FF6B00] text-black font-bold text-xs font-mono shadow-md"
                >
                  CONNECT
                </button>
              </div>

              {hoveredStation.landmark && (
                <p className="text-xs text-slate-300 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                  <span>{hoveredStation.landmark}</span>
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                {hoveredStation.lineIds.map((lid) => {
                  const line = city.lines.find((l) => l.id === lid);
                  return (
                    <span
                      key={lid}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold"
                      style={{
                        backgroundColor: line ? `${line.color}25` : '#FF6B0025',
                        color: line ? line.color : '#FF6B00',
                        border: `1px solid ${line ? line.color : '#FF6B00'}50`,
                      }}
                    >
                      {line ? line.name : lid}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Canvas Controls (+, −, ↻) */}
      <div
        id="metro-canvas-zoom-controls"
        className="absolute bottom-3 sm:bottom-4 right-3 sm:left-4 sm:right-auto z-20 flex sm:flex-row items-center gap-1 bg-[#070B14]/90 backdrop-blur-xl rounded-2xl p-1 sm:p-1.5 border border-slate-800 shadow-2xl"
      >
        <button
          id="zoom-in-btn"
          onClick={() => handleZoom(0.25)}
          className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-200 hover:text-cyan-400 transition"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="zoom-out-btn"
          onClick={() => handleZoom(-0.25)}
          className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-200 hover:text-cyan-400 transition"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="reset-view-btn"
          onClick={handleResetView}
          className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-200 hover:text-cyan-400 transition"
          title="Reset View"
          aria-label="Reset view"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Desktop Legend & Instructions Hint */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:flex items-center gap-3 bg-[#070B14]/80 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-white bg-[#070B14]"></span>
          <span>Interchange</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]"></span>
          <span>Your Station</span>
        </div>
        <div className="text-slate-600">|</div>
        <div className="text-slate-300">Tap station to connect</div>
      </div>
    </div>
  );
};
