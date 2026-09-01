import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES_METRO_DATA } from './data/metroData';
import { MetroStation, UserStationSelection, NationalAnalytics } from './types';
import { StationStorageService } from './services/stationStorage';
import { CityHeader } from './components/CityHeader';
import { IndiaLandingMap } from './components/IndiaLandingMap';
import { MetroMapCanvas } from './components/MetroMapCanvas';
import { StationConfirmationModal } from './components/StationConfirmationModal';
import { NationalAnalyticsModal } from './components/NationalAnalyticsModal';
import { MyStationsDrawer } from './components/MyStationsDrawer';
import { CinematicIntro } from './components/CinematicIntro';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<UserStationSelection[]>([]);
  const [activeStationModal, setActiveStationModal] = useState<MetroStation | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isMyStationsOpen, setIsMyStationsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<NationalAnalytics | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cinematic Intro state: plays on first visit/session or when replayed
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('stationSeJudKeIntroSeen');
    } catch {
      return false;
    }
  });

  // Show quick toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load initial selections & analytics
  useEffect(() => {
    const initData = async () => {
      const selections = await StationStorageService.fetchUserSelections();
      setUserSelections(selections);

      const analytics = await StationStorageService.fetchAnalytics();
      setAnalyticsData(analytics);
    };
    initData();
  }, []);

  // Track city exploration & station selection
  const handleSelectCity = useCallback(async (cityId: string | null, targetStation?: MetroStation) => {
    setSelectedCityId(cityId);
    if (cityId) {
      if (targetStation) {
        setActiveStationModal(targetStation);
      }
      await StationStorageService.trackCityExploration(cityId);
      // Refresh analytics in background
      const updatedAnalytics = await StationStorageService.fetchAnalytics();
      setAnalyticsData(updatedAnalytics);
    }
  }, []);

  // When a station node is clicked
  const handleStationClick = useCallback((station: MetroStation) => {
    setActiveStationModal(station);
  }, []);

  // Handle station confirmation: enforces 1 station per city & supports multiple cities
  const handleConfirmStation = async (stationId: string, userName?: string) => {
    if (!selectedCityId || !activeStationModal) return;

    const result = await StationStorageService.confirmStation(
      selectedCityId,
      stationId,
      userName
    );

    if (result.success) {
      // Update local state
      const updatedSelections = await StationStorageService.fetchUserSelections();
      setUserSelections(updatedSelections);

      // Refresh analytics
      const updatedAnalytics = await StationStorageService.fetchAnalytics();
      setAnalyticsData(updatedAnalytics);

      showToast(result.message);
    }
  };

  // Handle removing a station selection for a city
  const handleRemoveSelection = async (cityId: string) => {
    const success = await StationStorageService.removeSelection(cityId);
    if (success) {
      const updatedSelections = await StationStorageService.fetchUserSelections();
      setUserSelections(updatedSelections);

      const updatedAnalytics = await StationStorageService.fetchAnalytics();
      setAnalyticsData(updatedAnalytics);

      showToast('Station connection removed');
    }
  };

  // Jump from drawer to specific city station
  const handleJumpToCityStation = (cityId: string, _stationId: string) => {
    setSelectedCityId(cityId);
  };

  // Active City Data
  const currentCity = CITIES_METRO_DATA.find((c) => c.id === selectedCityId);
  const currentCitySelection = userSelections.find((s) => s.cityId === selectedCityId);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050811] text-slate-100 font-sans antialiased overflow-hidden selection:bg-[#FF6B00] selection:text-black">
      {/* Top Main Navigation Header */}
      <CityHeader
        selectedCityId={selectedCityId}
        userSelections={userSelections}
        onSelectCity={handleSelectCity}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenMyStations={() => setIsMyStationsOpen(true)}
        onReplayIntro={() => {
          setSelectedCityId(null);
          setShowIntro(true);
        }}
      />

      {/* Main Map Viewport Area: Fills 100% of remaining screen */}
      <main
        id="map-viewport"
        className="flex-1 w-full h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] relative overflow-hidden flex flex-col"
      >
        {selectedCityId === null || !currentCity ? (
          /* Step 1: India Landing View with National Metro Network */
          <IndiaLandingMap
            onSelectCity={handleSelectCity}
            userSelections={userSelections}
            onOpenAnalytics={() => setIsAnalyticsOpen(true)}
            onOpenMyStations={() => setIsMyStationsOpen(true)}
          />
        ) : (
          /* Step 2 & 3: City Interactive Vector SVG Metro Map Canvas */
          <MetroMapCanvas
            key={currentCity.id}
            city={currentCity}
            userSelection={currentCitySelection}
            onSelectStation={handleStationClick}
            onBackToIndia={() => handleSelectCity(null)}
          />
        )}
      </main>

      {/* Cinematic Space-to-India Intro Overlay (Smooth Fade-Out to Interactive Map) */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="cinematic-intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 pointer-events-auto"
          >
            <CinematicIntro onComplete={() => setShowIntro(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal / Bottom Sheet */}
      {currentCity && (
        <StationConfirmationModal
          station={activeStationModal}
          city={currentCity}
          currentCitySelection={currentCitySelection}
          initialUserName={StationStorageService.getUserName()}
          isOpen={!!activeStationModal}
          onClose={() => setActiveStationModal(null)}
          onConfirm={handleConfirmStation}
        />
      )}

      {/* National Analytics Pulse Modal */}
      <NationalAnalyticsModal
        analytics={analyticsData}
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* My Connected Stations Drawer */}
      <MyStationsDrawer
        isOpen={isMyStationsOpen}
        selections={userSelections}
        onClose={() => setIsMyStationsOpen(false)}
        onJumpToCityStation={handleJumpToCityStation}
        onRemoveSelection={handleRemoveSelection}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-feedback-toast"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0B1120] text-white px-4 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-cyan-500/50 text-xs font-mono font-semibold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
