import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MetroStation, CityMetroNetwork, UserStationSelection } from '../types';
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Train,
  Share2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StationConfirmationModalProps {
  station: MetroStation | null;
  city: CityMetroNetwork;
  currentCitySelection?: UserStationSelection;
  initialUserName?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (stationId: string, userName?: string) => Promise<void>;
}

export const StationConfirmationModal: React.FC<StationConfirmationModalProps> = ({
  station,
  city,
  currentCitySelection,
  initialUserName = '',
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [userName, setUserName] = useState(initialUserName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmedSuccess(false);
      setCopiedLink(false);
    }
  }, [isOpen, station?.id]);

  if (!isOpen || !station) return null;

  const isAlreadySelected = currentCitySelection?.stationId === station.id;
  const isReplacingDifferentStation =
    currentCitySelection && currentCitySelection.stationId !== station.id;

  const handleConfirmAction = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(station.id, userName.trim() || undefined);

      // Trigger festive saffron / Indian tricolor celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#EA580C', '#FFFFFF', '#16A34A', '#2563EB'],
      });

      setConfirmedSuccess(true);
    } catch (err) {
      console.error('Confirmation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareToken = () => {
    const text = `I connected with my nearest station: ${station.name} (${city.name} Metro) on Station Se Jud Ke!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Get lines for this station
  const stationLines = station.lineIds
    .map((id) => city.lines.find((l) => l.id === id))
    .filter(Boolean);

  return (
    <AnimatePresence>
      <div
        id="station-confirmation-backdrop"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          id="station-confirmation-sheet"
          className="w-full sm:max-w-md bg-[#070B14] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden max-h-[90vh] flex flex-col text-slate-100"
        >
          {/* Header Bar with Futuristic Digital Metro Accent */}
          <div className="relative p-5 bg-gradient-to-r from-[#0B1120] via-slate-900 to-[#0B1120] border-b border-slate-800 text-white">
            <button
              id="close-station-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#FF6B00] text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Train className="w-4 h-4" />
              <span>{city.name} Metro Network</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight font-display">
              {station.name}
            </h3>

            {station.hindiName && (
              <p className="text-sm text-slate-400 font-serif-indian mt-0.5">
                {station.hindiName}
              </p>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {/* Station Metadata Tags */}
            <div className="flex flex-wrap gap-2">
              {stationLines.map((line) => (
                <span
                  key={line?.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-semibold"
                  style={{
                    backgroundColor: `${line?.color}20`,
                    color: line?.color,
                    border: `1px solid ${line?.color}60`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: line?.color, boxShadow: `0 0 6px ${line?.color}` }}
                  />
                  {line?.name}
                </span>
              ))}

              {station.isInterchange && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
                  Interchange Hub
                </span>
              )}
            </div>

            {/* Landmark & Zone */}
            <div className="p-3.5 bg-[#0B1120] rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono">
              {station.landmark && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Vicinity / Landmark: </span>
                    <span className="text-slate-300">{station.landmark}</span>
                    {station.zone && (
                      <span className="block text-slate-500 mt-0.5">Zone: {station.zone}</span>
                    )}
                  </div>
                </div>
              )}
              {station.latitude && station.longitude && (
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 pt-1.5 border-t border-slate-800/80">
                  <span className="text-cyan-400 font-semibold">GEO:</span>
                  <span>{station.latitude.toFixed(4)}° N, {station.longitude.toFixed(4)}° E</span>
                </div>
              )}
            </div>

            {!confirmedSuccess ? (
              <>
                {/* ONE-STATION-PER-CITY RULE PROMPT */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-center py-2">
                    <span className="text-base sm:text-lg font-bold text-white block">
                      Is this your nearest station?
                    </span>
                    <span className="text-xs text-slate-400">
                      Connect your daily commute or neighborhood with {city.name} Metro
                    </span>
                  </div>

                  {/* Warning if switching station in same city */}
                  {isReplacingDifferentStation && (
                    <div className="mt-2 p-3 bg-amber-950/40 rounded-2xl border border-amber-600/40 text-xs text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Notice (One station per city):</strong> You currently have{' '}
                        <strong className="text-white">{currentCitySelection.stationName}</strong> selected for {city.name}.
                        Confirming will update it to <strong className="text-white">{station.name}</strong>.
                      </div>
                    </div>
                  )}

                  {isAlreadySelected && (
                    <div className="mt-2 p-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        This station is currently confirmed as your nearest in {city.name}!
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Name Input (No mandatory onboarding) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="optional-user-name"
                    className="block text-xs font-mono text-slate-400"
                  >
                    Your Name <span className="text-slate-600 font-normal">(Optional — for transit token)</span>
                  </label>
                  <input
                    id="optional-user-name"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    maxLength={40}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition font-medium"
                  />
                </div>

                {/* Primary Confirmation Action */}
                <div className="pt-2">
                  <button
                    id="confirm-nearest-station-btn"
                    onClick={handleConfirmAction}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 active:scale-[0.99] text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,107,0,0.4)] transition flex items-center justify-center gap-2 disabled:opacity-50 font-mono uppercase"
                  >
                    {isSubmitting ? (
                      <span>Connecting...</span>
                    ) : isAlreadySelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Re-confirm Nearest Station</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Yes, this is my nearest station</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 font-mono mt-2">
                    No account required • One station per city • Saved persistently
                  </p>
                </div>
              </>
            ) : (
              /* Success State with Digital Transit Token Badge */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-3 text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white">
                    Connected with {station.name}!
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-serif-indian">
                    स्टेशन से जुड़ के • {city.name} Metro
                  </p>
                </div>

                {/* Commuter Token Card */}
                <div className="p-4 rounded-2xl bg-[#0B1120] text-white text-left shadow-2xl border border-cyan-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between text-[11px] text-[#FF6B00] font-mono mb-2">
                    <span>STATION SE JUD KE</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {userName ? userName : 'Indian Transit Passenger'}
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {station.name} ({city.name})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleShareToken}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 text-xs font-mono font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied text!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-cyan-400" />
                        <span>Share Connection</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900 transition"
                  >
                    Done Exploring
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
