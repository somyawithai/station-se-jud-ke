import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES_METRO_DATA } from '../data/metroData';
import { UserStationSelection } from '../types';
import {
  Train,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Search,
  Check,
  X,
  Menu,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface CityHeaderProps {
  selectedCityId: string | null;
  userSelections: UserStationSelection[];
  onSelectCity: (cityId: string | null) => void;
  onOpenAnalytics: () => void;
  onOpenMyStations: () => void;
  onReplayIntro?: () => void;
}

export const CityHeader: React.FC<CityHeaderProps> = ({
  selectedCityId,
  userSelections,
  onSelectCity,
  onOpenAnalytics,
  onOpenMyStations,
  onReplayIntro,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCity = CITIES_METRO_DATA.find((c) => c.id === selectedCityId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = CITIES_METRO_DATA.filter((city) => {
    const q = searchQuery.toLowerCase();
    return (
      city.name.toLowerCase().includes(q) ||
      city.hindiName.includes(q) ||
      city.state.toLowerCase().includes(q) ||
      city.systemName.toLowerCase().includes(q)
    );
  });

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full bg-[#070B14]/95 backdrop-blur-xl border-b border-slate-800/80 text-slate-100"
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* LEFT: Compact Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => {
            onSelectCity(null);
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
          className="cursor-pointer flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#EA580C] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.4)] group-hover:shadow-[0_0_20px_rgba(255,107,0,0.7)] transition-all shrink-0">
            <Train className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-100 text-xs sm:text-base tracking-tight font-heading truncate">
                STATION SE JUD KE
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 text-[9px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                21 METROS
              </span>
            </div>
            <p className="hidden sm:block text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider truncate">
              INDIA DIGITAL TRANSIT NETWORK
            </p>
          </div>
        </div>

        {/* DESKTOP ONLY CENTER: City selector & quick hub pills */}
        <div className="hidden md:flex items-center gap-2 relative" ref={dropdownRef}>
          <button
            id="nav-all-india-btn"
            onClick={() => {
              onSelectCity(null);
              setIsDropdownOpen(false);
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold font-mono uppercase tracking-wider transition flex items-center gap-1.5 ${
              selectedCityId === null
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Navigation className="w-3 h-3 text-[#FF6B00]" />
            <span>All India</span>
          </button>

          {/* Quick Metro Hub Pills on wide screen */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {['delhi', 'mumbai', 'bengaluru', 'hyderabad', 'kolkata', 'chennai'].map((cid) => {
              const city = CITIES_METRO_DATA.find((c) => c.id === cid);
              if (!city) return null;
              const hasSelection = userSelections.some((s) => s.cityId === city.id);
              const isCurrent = selectedCityId === city.id;

              return (
                <button
                  key={city.id}
                  id={`nav-city-quick-${city.id}`}
                  onClick={() => {
                    onSelectCity(city.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-[#FF6B00] text-white font-bold shadow-[0_0_10px_rgba(255,107,0,0.5)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{city.name.split(' ')[0]}</span>
                  {hasSelection && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCurrent ? 'bg-white' : 'bg-emerald-400 animate-pulse'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 20 Cities Dropdown Trigger */}
          <button
            id="header-city-dropdown-trigger"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
              selectedCity
                ? 'bg-[#FF6B00]/15 border-[#FF6B00]/60 text-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.25)]'
                : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="max-w-[90px] sm:max-w-[130px] md:max-w-[170px] truncate font-medium">
              {selectedCity ? selectedCity.name : 'Search City...'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </button>

          {/* Futuristic Desktop Dropdown Menu */}
          {isDropdownOpen && (
            <div
              id="header-city-dropdown-panel"
              className="absolute top-full right-0 sm:left-auto mt-2 w-72 sm:w-80 max-h-96 bg-[#0B1120] border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="p-2.5 border-b border-slate-800 bg-slate-900/80">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city across India..."
                    className="w-full pl-8 pr-7 py-1.5 bg-[#070B14] border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-slate-800/50 p-1">
                {filteredCities.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No metro cities matching "{searchQuery}"
                  </div>
                ) : (
                  filteredCities.map((city) => {
                    const isSelected = selectedCityId === city.id;
                    const connectedStation = userSelections.find((s) => s.cityId === city.id);

                    return (
                      <button
                        key={city.id}
                        id={`city-dropdown-item-${city.id}`}
                        onClick={() => {
                          onSelectCity(city.id);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between group ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#FF6B00]/20 to-transparent border-l-2 border-[#FF6B00] text-white'
                            : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold group-hover:text-cyan-400 transition">
                              {city.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-serif-indian">
                              {city.hindiName}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                            <span>{city.systemName}</span>
                            <span>•</span>
                            <span className="text-cyan-400">{city.stations.length} stns</span>
                          </div>
                          {connectedStation && (
                            <div className="mt-0.5 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Nearest: {connectedStation.stationName}</span>
                            </div>
                          )}
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-[#FF6B00] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP ONLY RIGHT: Telemetry & My Stations */}
        <div className="hidden md:flex items-center gap-2">
          {onReplayIntro && (
            <button
              id="header-replay-intro-btn"
              onClick={onReplayIntro}
              className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-[#FF6B00]/60 hover:bg-slate-800 text-slate-400 hover:text-white transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title="Replay Cinematic Intro"
            >
              <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="font-mono uppercase text-[11px]">Intro</span>
            </button>
          )}

          <button
            id="header-national-stats-btn"
            onClick={onOpenAnalytics}
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            title="View Live Transit Analytics"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono uppercase text-[11px]">Telemetry</span>
          </button>

          <button
            id="header-my-stations-btn"
            onClick={onOpenMyStations}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border shadow-sm ${
              userSelections.length > 0
                ? 'bg-[#FF6B00] text-black border-[#FF6B00] font-bold shadow-[0_0_15px_rgba(255,107,0,0.4)]'
                : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-mono uppercase text-[11px]">My Stations</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                userSelections.length > 0 ? 'bg-black text-[#FF6B00]' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {userSelections.length}
            </span>
          </button>
        </div>

        {/* MOBILE ONLY RIGHT: Compact Search & Menu Icons (Strict Mobile Breakpoint) */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Quick My Stations Icon if selections exist */}
          {userSelections.length > 0 && (
            <button
              onClick={onOpenMyStations}
              className="p-2 rounded-xl bg-[#FF6B00] text-black font-bold flex items-center gap-1 shadow-md"
              title="My Stations"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-mono">{userSelections.length}</span>
            </button>
          )}

          {/* Menu / Controls Toggle Button */}
          <button
            id="mobile-header-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* MOBILE FULL-SCREEN NAVIGATION & CITY CONTROLS DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-drawer-backdrop"
            className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs bg-[#070B14] h-full shadow-2xl border-l border-slate-800 flex flex-col overflow-hidden text-slate-100"
            >
              {/* Drawer Header */}
              <div className="p-4 bg-[#0B1120] flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#EA580C] text-white flex items-center justify-center">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono tracking-wider text-white">
                      STATION SE JUD KE
                    </h3>
                    <p className="text-[9px] text-slate-400 font-mono">20 METRO SYSTEMS</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="p-3 grid grid-cols-2 gap-2 border-b border-slate-800/80 bg-slate-950/40">
                <button
                  onClick={() => {
                    onSelectCity(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                    selectedCityId === null
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <Navigation className="w-4 h-4 text-[#FF6B00]" />
                  <span>All India Map</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenMyStations();
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                    userSelections.length > 0
                      ? 'bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/60'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>My Stations ({userSelections.length})</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAnalytics();
                  }}
                  className="col-span-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Live Transit Telemetry</span>
                </button>

                {onReplayIntro && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onReplayIntro();
                    }}
                    className="col-span-2 p-2.5 rounded-xl border border-[#FF6B00]/40 bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-mono font-bold flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-[#FF6B00]" />
                    <span>Replay Cinematic Intro</span>
                  </button>
                )}
              </div>

              {/* City Search in Drawer */}
              <div className="p-3 border-b border-slate-800 bg-slate-900/50">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter cities..."
                    className="w-full pl-8 pr-7 py-2 bg-[#070B14] border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Metro Cities List */}
              <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
                <div className="text-[10px] font-mono text-slate-500 uppercase px-2 py-1 font-bold">
                  All 20 Operational Metro Cities
                </div>
                {filteredCities.map((city) => {
                  const isSelected = selectedCityId === city.id;
                  const connected = userSelections.find((s) => s.cityId === city.id);

                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelectCity(city.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#FF6B00]/15 text-white border-l-2 border-[#FF6B00]'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-400">
                            {city.name}
                          </span>
                          <span className="text-[10px] text-slate-500">({city.state})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {city.stations.length} stations • {city.lines.length} lines
                        </div>
                        {connected && (
                          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{connected.stationName}</span>
                          </div>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 -rotate-90 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
