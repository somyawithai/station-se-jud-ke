import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Train, MapPin, GitCommit, Search, 
  ExternalLink, Layers, Sparkles, Share2, Compass, CheckCircle2, Info, Users,
  ListOrdered, LayoutGrid, Check, X
} from 'lucide-react';
import { MetroCity, MetroLine } from '../types/metro';
import { SchematicMetroMap } from './SchematicMetroMap';
import { NearestStationModal, StationSelectionPayload } from './NearestStationModal';
import { StationLayoutNode } from '../utils/metroSchematicLayout';
import { AnimatedCounter } from './AnimatedCounter';
import { getStationConnectionKey, StationConnectionResult } from '../services/metroDbService';
import { stationNamesMatch } from '../utils/stationIdentity';

// A station to jump straight to (e.g. from the global search) once this
// city's view is showing — reuses the same click handler a manual station
// click already goes through.
export interface FocusStationRequest {
  stationName: string;
  line: MetroLine;
  index: number;
  isInterchange: boolean;
}

interface CityMetroNetworkViewProps {
  city: MetroCity;
  onBack: () => void;
  pinnedStationName?: string | null;
  onPinStation?: (station: StationSelectionPayload, result?: StationConnectionResult) => void;
  communityConnectedStationKeys?: ReadonlySet<string>;
  focusStationRequest?: FocusStationRequest | null;
  onFocusStationHandled?: () => void;
}

export const CityMetroNetworkView: React.FC<CityMetroNetworkViewProps> = ({
  city,
  onBack,
  pinnedStationName,
  onPinStation,
  communityConnectedStationKeys,
  focusStationRequest,
  onFocusStationHandled,
}) => {
  const [selectedLineId, setSelectedLineId] = useState<string>('all');
  const [stationQuery, setStationQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'schematic' | 'diagram' | 'grid' | 'interchanges'>('schematic');
  
  // Station selected for the modal
  const [modalStation, setModalStation] = useState<StationSelectionPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStationNode, setSelectedStationNode] = useState<StationLayoutNode | null>(null);
  const [confirmedToast, setConfirmedToast] = useState<string | null>(null);

  // Filter lines
  const activeLines = city.lines;
  const currentLine = activeLines.find(l => l.id === selectedLineId) || null;

  // Interchanges in this city
  const cityInterchanges = city.lines.flatMap(line => 
    line.interchangeStations.map(stn => ({
      stationName: stn,
      lineName: line.name,
      lineColor: line.colorHex,
    }))
  );

  // Group unique interchanges
  const uniqueInterchanges: { name: string; connectedLines: MetroLine[] }[] = Array.from(
    new Set<string>(cityInterchanges.map((i) => i.stationName))
  ).map((name: string) => {
    const connected = city.lines.filter(
      (l) => l.interchangeStations.includes(name) || l.stations.includes(name)
    );
    return {
      name,
      connectedLines: connected,
    };
  });

  // Handler when clicking any station on the Schematic SVG Map
  const handleStationClickFromMap = (stnNode: StationLayoutNode) => {
    setSelectedStationNode(stnNode);
    const lineObj = city.lines.find(l => l.id === stnNode.lineId) || city.lines[0];
    
    setModalStation({
      name: stnNode.name,
      cityName: city.name,
      cityId: city.id,
      line: lineObj,
      index: stnNode.stationNumber,
      isInterchange: stnNode.isInterchange,
      connectedLines: stnNode.connectedLines,
    });
    setIsModalOpen(true);
  };

  // Handler when clicking station from Route Diagram / Grid
  const handleStationClickFromList = (stationName: string, line: MetroLine, index: number, isInterchange: boolean) => {
    const connected = uniqueInterchanges.find(u => u.name === stationName)?.connectedLines.map(l => ({
      id: l.id,
      name: l.name,
      color: l.colorHex,
    })) || [{ id: line.id, name: line.name, color: line.colorHex }];

    setModalStation({
      name: stationName,
      cityName: city.name,
      cityId: city.id,
      line,
      index,
      isInterchange,
      connectedLines: connected,
    });
    setIsModalOpen(true);
  };

  // Jump straight to a station's existing Info/Community modal when the app
  // asked this city view to focus one (e.g. after a global search selection).
  // Reuses the exact same handler a manual station click already uses.
  useEffect(() => {
    if (!focusStationRequest) return;
    // Global search should land on the visual map as well as opening the
    // existing station connection modal.
    setViewMode('schematic');
    setSelectedLineId('all');
    setStationQuery(focusStationRequest.stationName);
    handleStationClickFromList(
      focusStationRequest.stationName,
      focusStationRequest.line,
      focusStationRequest.index,
      focusStationRequest.isInterchange,
    );
    onFocusStationHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusStationRequest]);

  // Confirm nearest station selection
  const handleConfirmNearestStation = (
    station: StationSelectionPayload,
    result?: StationConnectionResult,
  ) => {
    if (onPinStation) {
      onPinStation(station, result);
    }
    if (result?.savedToSupabase !== false) {
      setConfirmedToast(`Connected to ${station.name} (${city.name} Metro)!`);
      setTimeout(() => {
        setConfirmedToast(null);
      }, 4000);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col">
        {/* Navigation Breadcrumb & Back to India Action */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {/* LAG FIX: blur from md up only — solid fill on phones. */}
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs font-bold text-stone-100 shadow-md md:bg-stone-900/90 md:backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-stone-800 hover:text-amber-300 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-amber-400" />
            <span> Back to India Map</span>
          </button>

          {/* Breadcrumbs: City → Metro Lines → Stations */}
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <button onClick={onBack} className="hover:text-stone-200">India</button>
            <span>/</span>
            <span className="font-semibold text-stone-300">{city.name} Metro</span>
            <span>/</span>
            <span className="font-semibold text-amber-400">
              {selectedLineId === 'all' ? `${city.lines.length} Metro Lines` : currentLine?.name}
            </span>
            <span>/</span>
            <span className="text-stone-400">{city.totalStationsCount} Stations</span>
          </div>
        </div>

        {/* Confirmation Toast notification */}
        <AnimatePresence>
          {confirmedToast && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{confirmedToast}</span>
              </div>
              <button
                onClick={() => setConfirmedToast(null)}
                className="text-emerald-400 hover:text-emerald-200"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* City Network Header Banner */}
        <div className="order-3 relative mb-6 overflow-hidden rounded-3xl border border-stone-800 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 p-6 shadow-2xl sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-3xl font-black tracking-tight text-stone-100 sm:text-4xl">
                  {city.name} Metro Network
                </h1>
                <span className="font-hindi text-2xl font-bold text-amber-400">
                  {city.hindiName}
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                  {city.status}
                </span>
              </div>
              <p className="max-w-2xl text-sm text-stone-300">
                {city.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-stone-400">
                <span><strong>State:</strong> {city.state}</span>
                <span>•</span>
                <span><strong>Region:</strong> {city.region} India</span>
              </div>
            </div>

            {/* Quick City Stats Cards */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950/80 px-4 py-3 shadow-inner">
                <div className="text-[11px] font-medium text-stone-400">Metro Lines</div>
                <div className="font-display text-2xl font-black text-amber-400">
                  <AnimatedCounter value={city.activeLinesCount} />
                </div>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-950/80 px-4 py-3 shadow-inner">
                <div className="text-[11px] font-medium text-stone-400">Stations</div>
                <div className="font-display text-2xl font-black text-stone-100">
                  <AnimatedCounter value={city.totalStationsCount} />
                </div>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-950/80 px-4 py-3 shadow-inner">
                <div className="text-[11px] font-medium text-stone-400">Interchanges</div>
                <div className="font-display text-2xl font-black text-emerald-400">
                  <AnimatedCounter value={city.interchangeCount} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Controls & Filter Strip */}
        <div className="order-2 mb-6 flex flex-col gap-4 rounded-2xl border border-stone-800 bg-stone-900 p-4 md:bg-stone-900/60 md:backdrop-blur-md">
          {/* LAG FIX: city-view panels use solid backgrounds on phones (no backdrop-blur). */}
          {/* Top Line Selector Header & Horizontal Scroll Rail */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">
                Filter by line
              </span>
              {selectedLineId !== 'all' && (
                <button
                  onClick={() => setSelectedLineId('all')}
                  className="cursor-pointer text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  ↺ Reset to All Lines
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              <button
                id="filter-all-lines"
                onClick={() => setSelectedLineId('all')}
                className={`flex-shrink-0 cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedLineId === 'all'
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400'
                    : 'border border-stone-800 bg-stone-950/70 text-stone-300 hover:border-stone-700 hover:bg-stone-800 hover:text-stone-100'
                }`}
              >
                All Lines ({city.lines.length})
              </button>

              {city.lines.map((line) => {
                const isSelected = selectedLineId === line.id;
                return (
                  <button
                    key={line.id}
                    id={`filter-line-${line.id}`}
                    onClick={() => setSelectedLineId(line.id)}
                    className={`inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'shadow-lg scale-102 ring-2 ring-white/40'
                        : 'opacity-85 hover:opacity-100 hover:scale-101 border border-stone-800/80 bg-stone-950/60'
                    }`}
                    style={{
                      backgroundColor: isSelected ? line.colorHex : undefined,
                      color: isSelected ? '#ffffff' : (line.textColorHex || '#f5f5f4'),
                      borderColor: isSelected ? undefined : `${line.colorHex}55`,
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isSelected ? '#ffffff' : line.colorHex }}
                    />
                    <span className="whitespace-nowrap">{line.name}</span>
                    <span
                      className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {line.stationCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Line Corridor Focus Banner */}
          {currentLine && selectedLineId !== 'all' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-800 bg-stone-950/80 p-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: currentLine.colorHex }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold text-stone-100 sm:text-sm">
                      {currentLine.name} Corridor
                    </span>
                    <span className="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
                      Active Filter
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Route: <span className="text-stone-200">{currentLine.firstStation}</span> ↔ <span className="text-stone-200">{currentLine.lastStation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-[11px] text-stone-400 hidden sm:block">
                  <div><strong>{currentLine.stationCount}</strong> Stations along track</div>
                  <div><strong>{currentLine.interchangeStations?.length || 0}</strong> Interchange Hubs</div>
                </div>
                <button
                  onClick={() => setSelectedLineId('all')}
                  className="cursor-pointer rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
                >
                  ↺ Show All Lines
                </button>
              </div>
            </motion.div>
          )}

          {/* Search & View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
            {/* Search Input */}
            <div className="relative min-w-[230px]">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={stationQuery}
                onChange={(e) => setStationQuery(e.target.value)}
                placeholder={`Search station in ${city.name}...`}
                className="w-full rounded-xl border border-stone-800 bg-stone-950/90 py-2 pl-9 pr-8 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
              {stationQuery && (
                <button
                  onClick={() => setStationQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
                >
                  ×
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-stone-800 bg-stone-950 p-1">
              <button
                onClick={() => setViewMode('schematic')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'schematic'
                    ? 'bg-stone-800 text-amber-400 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Schematic Map (SVG)
              </button>
              <button
                onClick={() => setViewMode('diagram')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'diagram'
                    ? 'bg-stone-800 text-amber-400 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Route Diagram
              </button>
              <button
                onClick={() => setViewMode('interchanges')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'interchanges'
                    ? 'bg-stone-800 text-amber-400 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Interchanges ({uniqueInterchanges.length})
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-stone-800 text-amber-400 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Directory
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Main View Area */}
        <div className="order-1 space-y-6">
          {/* PRIMARY VIEW MODE 1: VISUAL SCHEMATIC METRO MAP (SVG) */}
          {viewMode === 'schematic' && (
            <div className="space-y-4">
              {/* Keep a deliberate touch-safe gutter around the draggable map
                  on phones and tablets. The map still uses most of the
                  viewport, but page-scroll gestures can start outside it. */}
              <div className="mx-3 sm:mx-4 lg:mx-0">
                <SchematicMetroMap
                  city={city}
                  selectedLineId={selectedLineId}
                  stationSearchQuery={stationQuery}
                  onSelectStation={handleStationClickFromMap}
                  onLineChange={(lineId) => setSelectedLineId(lineId)}
                  selectedStationNode={selectedStationNode}
                  pinnedStationName={pinnedStationName}
                  communityConnectedStationKeys={communityConnectedStationKeys}
                />
              </div>

              {/* Schematic Map Hint Footer */}
              <div className="flex items-center gap-2 rounded-2xl border border-stone-800/80 bg-stone-900/40 px-5 py-3 text-xs text-stone-400">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Hover a station to highlight its track, or click it to connect.</span>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: ROUTE DIAGRAM STRIP (Ordered Line Sequence) */}
          {viewMode === 'diagram' && (
            <div className="space-y-6">
              {(selectedLineId === 'all' ? city.lines : [currentLine!]).map((line) => {
                if (!line) return null;
                const matchingStations = line.stations.filter(s =>
                  s.toLowerCase().includes(stationQuery.toLowerCase())
                );

                if (stationQuery && matchingStations.length === 0) return null;

                return (
                  <div
                    key={line.id}
                    className="rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-xl md:bg-stone-900/60 md:backdrop-blur-md"
                  >
                    {/* LAG FIX: line cards are opaque on phones (backdrop-blur from md up). */}
                    {/* Line Title & Terminus info */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: line.colorHex }}
                        />
                        <div>
                          <h2 className="font-display text-lg font-bold text-stone-100">
                            {line.name}
                          </h2>
                          <div className="text-xs text-stone-400">
                            Terminus: <span className="text-stone-200 font-medium">{line.firstStation}</span> ↔ <span className="text-stone-200 font-medium">{line.lastStation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-stone-800/80 px-2.5 py-1 text-xs font-bold text-stone-300">
                          {line.stationCount} Stations
                        </span>
                        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                          {line.status}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Route Track / Station Chain */}
                    <div className="relative pl-6 sm:pl-8">
                      {/* Connecting colored line backbone */}
                      <div
                        className="absolute bottom-4 left-4 top-4 w-1.5 -translate-x-1/2 rounded-full sm:left-5"
                        style={{ backgroundColor: line.colorHex }}
                      />

                      {/* Station nodes */}
                      <div className="space-y-3">
                        {line.stations.map((stationName, idx) => {
                          const isMatch = !stationQuery || stationName.toLowerCase().includes(stationQuery.toLowerCase());
                          if (!isMatch) return null;

                          const isInterchange = line.interchangeStations.includes(stationName) || 
                            uniqueInterchanges.some(u => u.name === stationName);
                          const isFirst = idx === 0;
                          const isLast = idx === line.stations.length - 1;
                           const isPinned = Boolean(
                             pinnedStationName &&
                             stationNamesMatch(city.id, pinnedStationName, stationName),
                           );
                           const isCommunityConnected =
                             communityConnectedStationKeys?.has(
                               getStationConnectionKey(city.id, stationName),
                             ) ?? false;
                           const isConnected = isPinned || isCommunityConnected;

                          return (
                            <div
                              key={`${line.id}-${stationName}-${idx}`}
                              onClick={() => handleStationClickFromList(stationName, line, idx + 1, isInterchange)}
                              className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition-all duration-200 ${
                                 isConnected
                                  ? 'border-emerald-500 bg-stone-900 shadow-md shadow-emerald-950/40'
                                  : 'border-stone-800/70 bg-stone-950/60 hover:border-amber-500/50 hover:bg-stone-900/80'
                              }`}
                            >
                              {/* Station Node dot on the line */}
                              <div
                                className={`absolute -left-6 sm:-left-8 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-stone-950 transition-all ${
                                   isConnected
                                    ? 'border-emerald-400 ring-4 ring-emerald-400/20'
                                    : isInterchange
                                    ? 'border-amber-400 ring-4 ring-amber-400/20'
                                    : 'border-white'
                                }`}
                                 style={{ borderColor: isConnected ? '#10b981' : isInterchange ? '#fbbf24' : line.colorHex }}
                              >
                                <div
                                  className="h-2 w-2 rounded-full"
                                   style={{ backgroundColor: isConnected ? '#10b981' : isInterchange ? '#fbbf24' : line.colorHex }}
                                />
                              </div>

                              {/* Station Info */}
                              <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-900 text-[11px] font-bold text-stone-400 ring-1 ring-stone-800">
                                  {idx + 1}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-display text-sm font-bold text-stone-100 group-hover:text-amber-400">
                                      {stationName}
                                    </span>
                                    {isFirst && (
                                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 ring-1 ring-amber-500/20">
                                        Origin
                                      </span>
                                    )}
                                    {isLast && (
                                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 ring-1 ring-amber-500/20">
                                        Terminal
                                      </span>
                                    )}
                                    {isPinned && (
                                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                                        My Station
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-stone-400">
                                    {line.name} • Station #{idx + 1}
                                  </div>
                                </div>
                              </div>

                              {/* Action Tag */}
                              <div className="flex items-center gap-2">
                                {isInterchange && (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                                    <GitCommit className="h-3 w-3" />
                                    Interchange Hub
                                  </span>
                                )}
                                <span className="text-xs font-semibold text-stone-400 group-hover:text-amber-400">
                                  Select Station →
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 3: INTERCHANGES ONLY */}
          {viewMode === 'interchanges' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-4 text-xs text-stone-300">
                <p>
                  <strong className="text-amber-400">Interchange Hubs in {city.name}:</strong> Multi-line transfer junctions connecting {city.name} metro routes. Click any hub station to inspect or set as your nearest station.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {uniqueInterchanges.map((hub) => (
                  <div
                    key={hub.name}
                    onClick={() => handleStationClickFromList(hub.name, hub.connectedLines[0] || city.lines[0], 1, true)}
                    className="group cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/70 p-5 shadow-lg transition-all hover:border-amber-500/40 hover:bg-stone-800/80"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <GitCommit className="h-5 w-5 text-emerald-400" />
                          <h3 className="font-display text-base font-bold text-stone-100 group-hover:text-amber-400">
                            {hub.name}
                          </h3>
                        </div>
                        <p className="mt-1 text-xs text-stone-400">
                          Transfer station connecting {hub.connectedLines.length} routes
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/20">
                        {hub.connectedLines.length} Lines Meet
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 border-t border-stone-800/80 pt-3">
                      {hub.connectedLines.map((line) => (
                        <span
                          key={line.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: `${line.colorHex}22`,
                            color: line.textColorHex || line.colorHex,
                            border: `1px solid ${line.colorHex}55`,
                          }}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: line.colorHex }}
                          />
                          {line.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {uniqueInterchanges.length === 0 && (
                <div className="rounded-2xl border border-stone-800 p-8 text-center text-xs text-stone-400">
                  No multi-line interchange hubs currently operational in this single-corridor network.
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 4: DIRECTORY GRID */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {(selectedLineId === 'all' ? city.lines : [currentLine!]).flatMap(line => 
                line ? line.stations.map((stn, i) => ({ stn, line, i: i + 1 })) : []
              )
              .filter(({ stn }) => !stationQuery || stn.toLowerCase().includes(stationQuery.toLowerCase()))
              .map(({ stn, line, i }) => {
                const isInterchange = line.interchangeStations.includes(stn) || 
                  uniqueInterchanges.some(u => u.name === stn);
                 const isPinned = Boolean(
                   pinnedStationName &&
                   stationNamesMatch(city.id, pinnedStationName, stn),
                 );
                 const isCommunityConnected =
                   communityConnectedStationKeys?.has(
                     getStationConnectionKey(city.id, stn),
                   ) ?? false;
                 const isConnected = isPinned || isCommunityConnected;

                return (
                  <div
                    key={`${line.id}-${stn}-${i}`}
                    onClick={() => handleStationClickFromList(stn, line, i, isInterchange)}
                    className={`group cursor-pointer rounded-2xl border p-4 transition-all hover:border-amber-500/40 hover:bg-stone-800/80 ${
                       isConnected
                        ? 'border-emerald-500 bg-stone-900 shadow-md'
                        : 'border-stone-800/80 bg-stone-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: line.colorHex }}
                        />
                        <span className="font-display text-sm font-bold text-stone-100 group-hover:text-amber-400">
                          {stn}
                        </span>
                      </div>
                      <span className="rounded bg-stone-950 px-1.5 py-0.5 text-[10px] font-mono text-stone-400">
                        #{i}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                      <span>{line.name}</span>
                      {isPinned ? (
                        <span className="font-semibold text-emerald-400">Pinned</span>
                      ) : isInterchange ? (
                        <span className="font-semibold text-amber-400">Interchange</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clean Bottom Sheet / Modal: "Is this your nearest station?" */}
        <NearestStationModal
          isOpen={isModalOpen}
          station={modalStation}
          onConfirm={handleConfirmNearestStation}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
