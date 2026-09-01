import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NationalAnalytics } from '../types';
import {
  Activity,
  Users,
  CheckCircle2,
  MapPin,
  TrendingUp,
  X,
  Compass,
  Repeat,
  Sparkles,
} from 'lucide-react';

interface NationalAnalyticsModalProps {
  analytics: NationalAnalytics | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NationalAnalyticsModal: React.FC<NationalAnalyticsModalProps> = ({
  analytics,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !analytics) return null;

  return (
    <AnimatePresence>
      <div
        id="analytics-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          id="national-analytics-modal"
          className="w-full max-w-2xl bg-[#070B14] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden max-h-[90vh] flex flex-col text-slate-100"
        >
          {/* Header */}
          <div className="p-6 bg-[#0B1120] text-white relative border-b border-slate-800">
            <button
              id="close-analytics-modal-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Transit Analytics</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight font-display">
              National Pulse • Station Se Jud Ke
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-serif-indian">
              भारतीय मेट्रो नेटवर्क का जीवंत विश्लेषण
            </p>
          </div>

          {/* Stats Metrics Grid */}
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Total Visitors */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-mono">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Total Visitors</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {analytics.totalVisitors.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Sessions across India</div>
              </div>

              {/* Station Confirmations */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#FF6B00]/40">
                <div className="flex items-center gap-1.5 text-xs text-[#FF6B00] mb-1 font-mono font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Confirmations</span>
                </div>
                <div className="text-2xl font-black text-[#FF6B00] font-mono">
                  {analytics.totalConfirmations.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Stations claimed</div>
              </div>

              {/* Active Cities */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Cities</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {analytics.activeCitiesCount}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">With confirmed stations</div>
              </div>

              {/* Returning Users */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-mono">
                  <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Returning Users</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {analytics.returningUsersCount}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Frequent commuters</div>
              </div>

              {/* Cities Explored */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800 col-span-2 sm:col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-mono">
                  <Compass className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Cities Explored</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {analytics.citiesExploredTotal.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Map views across 20 Indian operational metro networks</div>
              </div>
            </div>

            {/* Most-Selected Stations Leaderboard */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
                <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                  Top Connected Metro Stations
                </h4>
              </div>

              <div className="bg-[#0B1120] rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                {analytics.mostSelectedStations && analytics.mostSelectedStations.length > 0 ? (
                  analytics.mostSelectedStations.map((st, idx) => (
                    <div
                      key={st.stationId}
                      className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-800/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] ${
                            idx === 0
                              ? 'bg-[#FF6B00] text-black shadow-[0_0_8px_#FF6B00]'
                              : idx === 1
                              ? 'bg-cyan-400 text-black shadow-[0_0_8px_#22D3EE]'
                              : idx === 2
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm font-sans">
                            {st.stationName}
                          </div>
                          <div className="text-slate-400 text-[11px] font-mono">{st.cityName} Metro</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono font-semibold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-2 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                        <span>{st.count} commuters</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 font-mono">
                    No confirmations recorded yet. Be the first to claim a station!
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
