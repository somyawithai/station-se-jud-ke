import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserStationSelection } from '../types';
import {
  ShieldCheck,
  MapPin,
  Train,
  Trash2,
  ExternalLink,
  X,
  Share2,
} from 'lucide-react';

interface MyStationsDrawerProps {
  isOpen: boolean;
  selections: UserStationSelection[];
  onClose: () => void;
  onJumpToCityStation: (cityId: string, stationId: string) => void;
  onRemoveSelection: (cityId: string) => void;
}

export const MyStationsDrawer: React.FC<MyStationsDrawerProps> = ({
  isOpen,
  selections,
  onClose,
  onJumpToCityStation,
  onRemoveSelection,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="my-stations-drawer-backdrop"
        className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          id="my-stations-drawer-panel"
          className="w-full max-w-md bg-[#070B14] h-full shadow-2xl border-l border-slate-800 flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="p-5 bg-[#0B1120] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
              <div>
                <h3 className="text-base font-bold text-white font-mono tracking-wide">
                  My Connected Stations
                </h3>
                <p className="text-xs text-slate-400 font-serif-indian">
                  मेरे जुड़े हुए मेट्रो स्टेशन
                </p>
              </div>
            </div>

            <button
              id="close-my-stations-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Selections */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {selections.length > 0 ? (
              <>
                <div className="text-xs text-slate-300 bg-[#0B1120] p-3.5 rounded-2xl border border-slate-800 font-mono">
                  You have confirmed <strong className="text-cyan-400">{selections.length}</strong> {selections.length === 1 ? 'station' : 'stations'} across India. (1 station per city rule active).
                </div>

                <div className="space-y-3">
                  {selections.map((sel) => (
                    <div
                      key={sel.cityId}
                      className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800/90 shadow-xl hover:border-cyan-500/50 transition group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF6B00] uppercase tracking-wide">
                            <Train className="w-3.5 h-3.5" />
                            <span>{sel.cityName} Metro</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-0.5 group-hover:text-cyan-300 transition">
                            {sel.stationName}
                          </h4>
                          {sel.stationHindiName && (
                            <p className="text-xs text-slate-400 font-serif-indian">
                              {sel.stationHindiName}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => onRemoveSelection(sel.cityId)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition"
                          title="Remove selection for this city"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2 text-xs font-mono">
                        <span className="text-[11px] text-slate-500">
                          {new Date(sel.confirmedAt).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => {
                            onJumpToCityStation(sel.cityId, sel.stationId);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          <span>Open City Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-3 font-mono">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-[#FF6B00] flex items-center justify-center mx-auto shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white">No stations connected yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click any city on the India map, then select and confirm your nearest station!
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 bg-[#0B1120] border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Station Se Jud Ke • Indian Metro Network
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
