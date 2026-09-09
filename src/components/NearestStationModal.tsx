import React from 'react';
import { MetroLine } from '../types/metro';
import { StationConnectionResult } from '../services/metroDbService';

export interface StationSelectionPayload {
  name: string;
  cityName: string;
  cityId: string;
  line: MetroLine;
  index: number;
  isInterchange: boolean;
  connectedLines: { id: string; name: string; color: string }[];
}

interface NearestStationModalProps {
  isOpen: boolean;
  station: StationSelectionPayload | null;
  onConfirm: (station: StationSelectionPayload, result?: StationConnectionResult) => void;
  onClose: () => void;
}

export const NearestStationModal: React.FC<NearestStationModalProps> = ({
  isOpen,
  station,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        className="fixed inset-0 bg-stone-950/90"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900 p-5 shadow-2xl">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
          Connect to this station
        </p>
        <h3 className="mt-2 font-display text-xl font-black text-stone-100">{station.name}</h3>
        <p className="mt-1 text-sm text-stone-400">
          {station.cityName} Metro • {station.line.name}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-700 py-2.5 text-sm font-semibold text-stone-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(station)}
            className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-stone-950"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};
