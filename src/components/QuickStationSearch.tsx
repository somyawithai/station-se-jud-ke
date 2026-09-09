import React from 'react';
import { MetroCity, MetroLine } from '../types/metro';

interface QuickStationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  cities: MetroCity[];
  onSelectStation: (
    city: MetroCity,
    line: MetroLine,
    stationName: string,
    stationNumber: number,
    isInterchange: boolean,
  ) => void;
}

export const QuickStationSearch: React.FC<QuickStationSearchProps> = ({
  isOpen,
  onClose,
  cities,
  onSelectStation,
}) => {
  const [query, setQuery] = React.useState('');

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches: {
      city: MetroCity;
      line: MetroLine;
      stationName: string;
      stationNumber: number;
      isInterchange: boolean;
    }[] = [];
    for (const city of cities) {
      for (const line of city.lines) {
        line.stations.forEach((stationName, index) => {
          if (
            stationName.toLowerCase().includes(q) ||
            city.name.toLowerCase().includes(q) ||
            line.name.toLowerCase().includes(q)
          ) {
            matches.push({
              city,
              line,
              stationName,
              stationNumber: index + 1,
              isInterchange: line.interchangeStations.includes(stationName),
            });
          }
        });
        if (matches.length >= 20) break;
      }
      if (matches.length >= 20) break;
    }
    return matches;
  }, [cities, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-16 sm:p-6 sm:pt-20">
      <button
        type="button"
        className="fixed inset-0 bg-stone-950/90"
        onClick={onClose}
        aria-label="Close search"
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl">
        <div className="border-b border-stone-800 p-4">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a station, line, or city..."
            className="w-full bg-transparent text-sm text-stone-100 placeholder-stone-500 focus:outline-none"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === '' ? (
            <p className="p-6 text-center text-sm text-stone-400">
              Type a station name, metro line, or city.
            </p>
          ) : results.length === 0 ? (
            <p className="p-6 text-center text-sm text-stone-500">No stations found.</p>
          ) : (
            <div className="space-y-1.5">
              {results.map((result) => (
                <button
                  key={`${result.city.id}-${result.line.id}-${result.stationName}-${result.stationNumber}`}
                  type="button"
                  onClick={() => {
                    onSelectStation(
                      result.city,
                      result.line,
                      result.stationName,
                      result.stationNumber,
                      result.isInterchange,
                    );
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-stone-800 bg-stone-950 p-3 text-left"
                >
                  <div>
                    <div className="font-display text-sm font-bold text-stone-100">
                      {result.stationName}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {result.city.name} Metro • {result.line.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
