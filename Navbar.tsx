import React, { useState } from 'react';
import { Train, Search, Activity, CheckCircle2, Menu, X, UserPlus, Trash2 } from 'lucide-react';
import { MetroCity } from '../types/metro';
import { StationSelectionRecord, removeStationSelection } from '../services/metroDbService';

interface NavbarProps {
  cities: MetroCity[];
  selectedCity: MetroCity | null;
  onSelectCity: (city: MetroCity | null) => void;
  onOpenAudit: () => void;
  onOpenSearch: () => void;
  activeSelections?: Record<string, StationSelectionRecord>;
  onRemoveStation?: (cityId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  onOpenAudit,
  onOpenSearch,
  activeSelections = {},
  onRemoveStation,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmingCityId, setConfirmingCityId] = useState<string | null>(null);
  const [removingCityId, setRemovingCityId] = useState<string | null>(null);
  const selectionList: StationSelectionRecord[] = Object.values(activeSelections);

  const handleMyStations = () => {
    // Any saved station(s) open the "Your stations" list — this is where the
    // Remove connection action lives, so a single saved station no longer
    // auto-navigates away without a chance to see/remove it.
    if (selectionList.length > 0) {
      setIsDropdownOpen((v) => !v);
    } else {
      onOpenSearch();
    }
  };

  const handleConfirmRemove = async (sel: StationSelectionRecord) => {
    setRemovingCityId(sel.city_id);
    const ok = await removeStationSelection(sel);
    setRemovingCityId(null);
    setConfirmingCityId(null);
    if (ok) {
      onRemoveStation?.(sel.city_id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3a2117]/60 bg-[#0f0b09]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          onClick={() => onSelectCity(null)}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90 select-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8a05b] shadow-md shadow-orange-950/30 ring-1 ring-[#f7d5ae]/50 shrink-0">
            <Train className="h-5 w-5 text-[#20120c]" />
          </div>
          <span className="font-display text-sm sm:text-base font-black leading-tight tracking-wide text-stone-100 whitespace-nowrap">
            Station Se<br className="hidden sm:block" /> <span className="text-amber-400">Jud Ke</span>
          </span>
        </div>

        {/* Center nav — minimal, spacious (desktop only) */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => onSelectCity(null)}
            className={`cursor-pointer text-sm font-medium transition-colors ${
              !selectedCity ? 'text-amber-300' : 'text-stone-300 hover:text-stone-100'
            }`}
          >
            Explore
          </button>
          <button
            onClick={handleMyStations}
            className="cursor-pointer text-sm font-medium text-stone-300 transition-colors hover:text-stone-100"
          >
            My Stations{selectionList.length > 0 ? ` (${selectionList.length})` : ''}
          </button>
          <a
            href="#about"
            className="cursor-pointer text-sm font-medium text-stone-300 transition-colors hover:text-stone-100"
          >
            About
          </a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Join Community — primary pill CTA, opens the same search & join flow */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-stone-700 px-4 py-2 text-xs font-bold text-stone-200 transition-all hover:border-amber-400/60 hover:text-amber-300"
          >
            <span>Join Community</span>
            <UserPlus className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-300 transition-colors hover:bg-[#1a120e] hover:text-amber-300 cursor-pointer sm:hidden"
            title="Search a city or station"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Dataset audit is deliberately hidden from the public product surface. */}
          <button onClick={onOpenAudit} className="hidden" title="Inspect full dataset telemetry">
            <Activity className="h-3.5 w-3.5" />
          </button>

          {/* My Stations (mobile: icon only) */}
          <div className="relative lg:hidden">
            <button
              onClick={handleMyStations}
              className="flex h-9 items-center gap-1.5 rounded-full px-3 text-stone-300 transition-colors hover:bg-[#1a120e] hover:text-emerald-300 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {selectionList.length > 0 && (
                <span className="text-xs font-semibold text-emerald-300">{selectionList.length}</span>
              )}
            </button>
          </div>

          {/* Shared dropdown for saved station selections */}
          {isDropdownOpen && selectionList.length > 0 && (
            <div
              className="absolute right-4 top-full mt-2 w-64 rounded-2xl border border-stone-800 bg-stone-900/95 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 z-50"
              onMouseLeave={() => {
                if (!confirmingCityId) setIsDropdownOpen(false);
              }}
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 border-b border-stone-800">
                Your stations ({selectionList.length})
              </div>
              <div className="mt-1 space-y-1 max-h-60 overflow-y-auto">
                {selectionList.map((sel) => {
                  const isConfirming = confirmingCityId === sel.city_id;
                  const isRemoving = removingCityId === sel.city_id;

                  if (isConfirming) {
                    return (
                      <div key={sel.city_id} className="rounded-xl px-3 py-2 bg-stone-800/60">
                        <p className="text-[11px] leading-snug text-stone-200">
                          Remove your connection to this station?
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => setConfirmingCityId(null)}
                            disabled={isRemoving}
                            className="flex-1 rounded-lg border border-stone-700 py-1.5 text-[11px] font-semibold text-stone-300 transition-colors hover:bg-stone-800 disabled:opacity-60 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleConfirmRemove(sel)}
                            disabled={isRemoving}
                            className="flex-1 rounded-lg bg-red-500/90 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60 cursor-pointer"
                          >
                            {isRemoving ? 'Removing…' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={sel.city_id}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-stone-200 hover:bg-stone-800 transition-colors"
                    >
                      <button
                        onClick={() => {
                          const c = cities.find(
                            (city) => city.id === sel.city_id || city.name === sel.city_name
                          );
                          if (c) onSelectCity(c);
                          setIsDropdownOpen(false);
                        }}
                        className="min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <div className="truncate font-bold text-stone-100">{sel.station_name}</div>
                        <div className="truncate text-[11px] text-stone-400">{sel.city_name} • {sel.line_name}</div>
                      </button>
                      <div className="flex shrink-0 items-center gap-1.5 pl-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sel.line_color }} />
                        <button
                          onClick={() => setConfirmingCityId(sel.city_id)}
                          title="Remove connection"
                          aria-label={`Remove connection to ${sel.station_name}`}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-900 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full text-stone-300 hover:bg-[#1a120e] hover:text-stone-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#3a2117]/60 bg-[#0f0b09]/98 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => {
              onSelectCity(null);
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2.5 text-base font-medium ${
              !selectedCity ? 'text-amber-300' : 'text-stone-200'
            }`}
          >
            Explore the map
          </button>
          <button
            onClick={() => {
              handleMyStations();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2.5 text-base font-medium text-stone-200"
          >
            My Stations{selectionList.length > 0 ? ` (${selectionList.length})` : ''}
          </button>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full py-2.5 text-base font-medium text-stone-200"
          >
            About
          </a>
          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-full border border-stone-700 py-2.5 text-sm font-bold text-amber-300"
          >
            <span>Join Community</span>
            <UserPlus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
