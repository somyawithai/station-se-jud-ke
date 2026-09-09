import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { METRO_CITIES } from './data/metroData';
import { MetroCity, MetroLine } from './types/metro';
import { Navbar } from './components/Navbar';
import { HeroCinematicAtmosphere } from './components/HeroCinematicAtmosphere';
import { IndiaMap } from './components/IndiaMap';
import { CityMetroNetworkView, FocusStationRequest } from './components/CityMetroNetworkView';
import { DatasetAuditModal } from './components/DatasetAuditModal';
import { QuickStationSearch } from './components/QuickStationSearch';
import { StationSelectionPayload } from './components/NearestStationModal';
import { 
  getVisitorActiveSelections, 
  getTotalConnectedCount,
  getCommunityConnectedCityIds,
  getCommunityConnectedStationKeys,
  StationSelectionRecord 
} from './services/metroDbService';
import { StationConnectionResult } from './services/metroDbService';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<MetroCity | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeSelections, setActiveSelections] = useState<Record<string, StationSelectionRecord>>({});
  const [totalConnected, setTotalConnected] = useState<number>(0);
  const [communityConnectedCityIds, setCommunityConnectedCityIds] = useState<Set<string>>(new Set());
  const [communityConnectedStationKeys, setCommunityConnectedStationKeys] = useState<Set<string>>(new Set());
  // Station picked from the global search, pending a hand-off to that city's
  // view so it can open the exact same Station Info/Community modal a
  // manual click would.
  const [focusStationRequest, setFocusStationRequest] = useState<FocusStationRequest | null>(null);

  const refreshConnectionState = useCallback(async () => {
    const [selections, total, cityIds, stationKeys] = await Promise.all([
      getVisitorActiveSelections(),
      getTotalConnectedCount(),
      getCommunityConnectedCityIds(),
      getCommunityConnectedStationKeys(),
    ]);
    setActiveSelections(selections);
    setTotalConnected(total);
    setCommunityConnectedCityIds(cityIds);
    setCommunityConnectedStationKeys(stationKeys);
  }, []);

  // Load both the current visitor's persisted selections and community-wide
  // presence on mount. The same source-of-truth refresh is reused after save
  // and delete so every surface stays consistent.
  useEffect(() => {
    void refreshConnectionState();
  }, [refreshConnectionState]);

  const handleSelectStationFromSearch = (
    city: MetroCity,
    line: MetroLine,
    stationName: string,
    stationNumber: number,
    isInterchange: boolean,
  ) => {
    setSelectedCity(city);
    setFocusStationRequest({ stationName, line, index: stationNumber, isInterchange });
  };

  // Called by Navbar only after its scoped Supabase delete succeeds.
  const handleRemoveStation = (_cityId: string) => {
    void refreshConnectionState();
  };

  const handlePinStation = (_station: StationSelectionPayload, result?: StationConnectionResult) => {
    // Never invent a local connection when the persistence layer reports a
    // failed save. Refreshing also preserves an older valid selection when an
    // edit attempt fails.
    if (result?.savedToSupabase === false) {
      void refreshConnectionState();
      return;
    }
    void refreshConnectionState();
  };

  // Find the pinned station for the currently active city
  const currentCityPinnedStationName = selectedCity && activeSelections[selectedCity.id]
    ? activeSelections[selectedCity.id].station_name
    : null;

  return (
    <div className="app-shell-viewport flex flex-col overflow-hidden bg-stone-950 text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar — fixed height (h-16); everything below fits into
          whatever viewport space remains, so the app never needs page
          scroll (see .app-shell-viewport in index.css). */}
      <Navbar
        cities={METRO_CITIES}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSelections={activeSelections}
        onRemoveStation={handleRemoveStation}
      />

      {/* Main View Area with Smooth Transitions. The India map remains a
          fixed viewport canvas, while city pages use this single scroll
          container when their content is taller than the viewport. */}
      <main className={`relative min-h-0 flex-1 ${
        selectedCity ? 'overflow-x-hidden overflow-y-auto' : 'overflow-hidden'
      }`}>
        {/* Single shared background photo + overlay for every page (the
            India map AND the city metro views) — rendered once here so
            there's exactly one background layer app-wide. */}
        <HeroCinematicAtmosphere />

        <AnimatePresence>
          {selectedCity ? (
            <motion.div
              key={selectedCity.id}
              className="relative min-h-full"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04, y: -10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <CityMetroNetworkView
                city={selectedCity}
                onBack={() => setSelectedCity(null)}
                pinnedStationName={currentCityPinnedStationName}
                onPinStation={handlePinStation}
                communityConnectedStationKeys={communityConnectedStationKeys}
                focusStationRequest={focusStationRequest}
                onFocusStationHandled={() => setFocusStationRequest(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="india-map-view"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <IndiaMap
                cities={METRO_CITIES}
                selectedCity={selectedCity}
                onSelectCity={(city) => setSelectedCity(city)}
                activeSelections={activeSelections}
                totalConnectedCount={totalConnected}
                communityConnectedCityIds={communityConnectedCityIds}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Excel Dataset Audit Modal */}
      <DatasetAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Global Station / City Quick Search Drawer */}
      <QuickStationSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        cities={METRO_CITIES}
        onSelectStation={handleSelectStationFromSearch}
      />
    </div>
  );
}
