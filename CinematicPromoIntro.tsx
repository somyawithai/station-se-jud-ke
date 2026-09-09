import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CinematicPromoIntroProps {
  onComplete: () => void;
  durationMs?: number;
}

export const CinematicPromoIntro: React.FC<CinematicPromoIntroProps> = ({
  onComplete,
  durationMs = 2400,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // At ~1.5s (1500ms), start the subtle darkening/fade transition
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(900, durationMs - 800));

    // At ~2.4s, complete the intro and transition to the India Map
    const completeTimer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [durationMs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-stone-950 select-none cursor-pointer"
      onClick={onComplete}
      title="Click anywhere to skip intro"
    >
      {/* Fullscreen Cinematic Container with Subtle Slow-Zoom / Push-In */}
      <motion.div
        initial={{ scale: 1, filter: 'brightness(1)' }}
        animate={{
          scale: 1.035,
          filter: isFadingOut ? 'brightness(0.45)' : 'brightness(1)',
        }}
        transition={{
          scale: { duration: 2.6, ease: 'easeOut' },
          filter: { duration: 0.8, ease: 'easeInOut' },
        }}
        className="relative h-full w-full overflow-hidden bg-stone-950"
      >
        {/* Deep Night Atmospheric Sky & Skyline Backdrop */}
        <div className="absolute inset-0 bg-[#090b10]">
          {/* City Skyline Silhouette & Twilight Lights */}
          <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-[#0d0f14] via-[#090b10] to-[#050608]" />

          {/* Distant City Skyline with illuminated window grids */}
          <svg className="absolute bottom-28 left-0 right-0 w-full h-80 opacity-70" viewBox="0 0 1600 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bldgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#151922" />
                <stop offset="100%" stopColor="#0a0c10" />
              </linearGradient>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#121824" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#2c1e18" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1a120e" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Twilight Sky Glow */}
            <rect x="0" y="0" width="1600" height="400" fill="url(#skyGrad)" />

            {/* City Towers */}
            <g fill="url(#bldgGrad)">
              <rect x="80" y="140" width="70" height="260" />
              <rect x="180" y="100" width="85" height="300" />
              <rect x="290" y="180" width="60" height="220" />
              <rect x="370" y="120" width="90" height="280" />
              <rect x="480" y="210" width="55" height="190" />
              <rect x="560" y="150" width="80" height="250" />
              <rect x="660" y="90" width="100" height="310" />
              <rect x="780" y="170" width="70" height="230" />
              <rect x="870" y="110" width="95" height="290" />
              <rect x="990" y="130" width="85" height="270" />
              <rect x="1100" y="190" width="75" height="210" />
              <rect x="1200" y="80" width="110" height="320" />
              <rect x="1330" y="140" width="90" height="260" />
            </g>

            {/* Twinkling Amber & White Window Matrix */}
            <g fill="#f59e0b" opacity="0.65">
              <circle cx="110" cy="180" r="1.5" /><circle cx="130" cy="220" r="1.5" /><circle cx="210" cy="140" r="1.5" /><circle cx="230" cy="170" r="1.5" />
              <circle cx="390" cy="160" r="1.5" /><circle cx="420" cy="200" r="1.5" /><circle cx="690" cy="130" r="1.5" /><circle cx="720" cy="180" r="1.5" />
              <circle cx="900" cy="150" r="1.5" /><circle cx="930" cy="210" r="1.5" /><circle cx="1230" cy="120" r="1.5" /><circle cx="1270" cy="160" r="1.5" />
            </g>
            <g fill="#e0e7ff" opacity="0.5">
              <circle cx="120" cy="200" r="1.2" /><circle cx="200" cy="180" r="1.2" /><circle cx="400" cy="240" r="1.2" /><circle cx="710" cy="220" r="1.2" />
              <circle cx="890" cy="180" r="1.2" /><circle cx="1250" cy="200" r="1.2" /><circle cx="1350" cy="180" r="1.2" />
            </g>
          </svg>
        </div>

        {/* Elevated Concrete Viaduct & Tracks */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#06070a] via-[#101218] to-transparent">
          {/* Track Bed & Steel Rail Perspective */}
          <svg className="absolute bottom-0 left-0 w-3/5 h-56" viewBox="0 0 800 300" preserveAspectRatio="none">
            {/* Concrete Parapet Wall */}
            <path d="M 0,180 L 800,230 L 800,250 L 0,210 Z" fill="#181a20" />
            <path d="M 0,210 L 800,250 L 800,300 L 0,300 Z" fill="#0f1116" />

            {/* Steel Running Rails with warm light reflection */}
            <line x1="280" y1="210" x2="380" y2="300" stroke="#f59e0b" strokeWidth="4" strokeOpacity="0.8" />
            <line x1="380" y1="210" x2="520" y2="300" stroke="#f59e0b" strokeWidth="4" strokeOpacity="0.8" />

            {/* Third Rail & Power Conductor line */}
            <line x1="240" y1="215" x2="310" y2="300" stroke="#ea580c" strokeWidth="3" strokeOpacity="0.6" />
          </svg>
        </div>

        {/* Station Platform with Curved Roof Canopy & Amber Lighting (Right Half) */}
        <div className="absolute top-0 right-0 bottom-0 w-3/5 sm:w-1/2 overflow-hidden pointer-events-none">
          {/* Station Roof Structure & Ribbed Arches */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a1d24" />
                <stop offset="50%" stopColor="#252a34" />
                <stop offset="100%" stopColor="#12141a" />
              </linearGradient>
              <linearGradient id="platformGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1a1d24" />
                <stop offset="100%" stopColor="#2a2f3a" />
              </linearGradient>
            </defs>

            {/* Arched Station Roof Canopy */}
            <path d="M 120,0 C 220,120 380,180 600,200 L 600,0 Z" fill="url(#roofGrad)" />
            <path d="M 80,0 C 180,140 340,210 600,240 L 600,200 C 380,180 220,120 120,0 Z" fill="#2d3340" />

            {/* Structural Roof Beams */}
            <line x1="160" y1="50" x2="220" y2="280" stroke="#3d4455" strokeWidth="6" />
            <line x1="260" y1="100" x2="320" y2="340" stroke="#3d4455" strokeWidth="6" />
            <line x1="380" y1="140" x2="440" y2="400" stroke="#3d4455" strokeWidth="6" />
            <line x1="500" y1="170" x2="560" y2="460" stroke="#3d4455" strokeWidth="6" />

            {/* Platform Floor Floor Slab */}
            <polygon points="120,520 600,440 600,800 120,800" fill="url(#platformGrad)" />

            {/* Yellow Tactile Safety Warning Line along Platform Edge */}
            <polygon points="120,520 145,528 600,452 600,440" fill="#f59e0b" opacity="0.95" />
            <polygon points="145,528 175,538 600,466 600,452" fill="#d97706" opacity="0.6" />

            {/* Warm platform floor reflection pools */}
            <ellipse cx="380" cy="620" rx="180" ry="40" fill="#f59e0b" opacity="0.12" />
            <ellipse cx="480" cy="540" rx="120" ry="30" fill="#fbbf24" opacity="0.18" />
          </svg>

          {/* Overhead Metro Signboard (Exact Match to Uploaded Entry/Exit Sign) */}
          <div className="absolute top-12 right-12 z-20 flex items-center gap-3 rounded-lg border border-amber-500/50 bg-[#0d0f14]/95 px-5 py-2.5 shadow-2xl shadow-black/80 backdrop-blur-md">
            {/* Round Metro Logo */}
            <div className="h-8 w-8 rounded-full border-2 border-amber-400 flex items-center justify-center bg-amber-500/15">
              <div className="h-3 w-5 border-y-2 border-amber-300" />
            </div>
            <div className="text-right">
              <div className="font-hindi text-sm font-bold text-amber-300">प्रवेश / निकास</div>
              <div className="text-xs font-extrabold tracking-wider text-amber-100 flex items-center justify-end gap-1">
                <span>Entry/Exit</span>
                <span className="text-amber-400 text-sm">↑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metro Train (Arriving at Platform, Exact Match to Vaishali 225) */}
        <div className="absolute bottom-16 right-1/4 sm:right-[18%] w-[320px] sm:w-[460px] h-[360px] sm:h-[480px] pointer-events-none z-20">
          <svg className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]" viewBox="0 0 500 520">
            <defs>
              <linearGradient id="trainBodyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="25%" stopColor="#94a3b8" />
                <stop offset="60%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="trainWindshield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* Train Carriages Extrusion along platform */}
            <path d="M 330,120 L 500,80 L 500,420 L 330,460 Z" fill="#334155" />
            {/* Carriage Windows glowing with warm passenger light */}
            <rect x="360" y="160" width="50" height="90" rx="6" fill="#fef3c7" opacity="0.85" />
            <rect x="430" y="145" width="50" height="85" rx="6" fill="#fef3c7" opacity="0.85" />

            {/* Front Nose Structure (Smooth Rounded Aerodynamic Cab) */}
            <path
              d="M 120,440 C 90,430 80,380 80,300 C 80,180 120,120 220,110 C 310,100 350,140 350,300 C 350,390 330,430 300,440 Z"
              fill="url(#trainBodyGrad)"
              stroke="#1e293b"
              strokeWidth="3"
            />

            {/* Front Large Windshield Glass */}
            <path
              d="M 115,280 C 110,210 135,145 220,140 C 300,135 320,200 315,280 Z"
              fill="url(#trainWindshield)"
              stroke="#334155"
              strokeWidth="4"
            />

            {/* Destination LED Screen / Upper Cab Glass */}
            <rect x="150" y="165" width="135" height="38" rx="4" fill="#090a0f" stroke="#334155" strokeWidth="1.5" />
            <rect x="154" y="169" width="127" height="30" rx="2" fill="#0f172a" opacity="0.7" />

            {/* Round Red & White Illuminated Metro Logo on Train Nose */}
            <circle cx="217" cy="355" r="22" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />
            <rect x="202" y="352" width="30" height="6" fill="#ffffff" rx="1" />

            {/* Two Lower Twin Amber Headlights */}
            <circle cx="140" cy="360" r="14" fill="#fef3c7" stroke="#ea580c" strokeWidth="2.5" className="filter drop-shadow-[0_0_12px_#f59e0b]" />
            <circle cx="140" cy="360" r="8" fill="#ffffff" />

            <circle cx="295" cy="360" r="14" fill="#fef3c7" stroke="#ea580c" strokeWidth="2.5" className="filter drop-shadow-[0_0_12px_#f59e0b]" />
            <circle cx="295" cy="360" r="8" fill="#ffffff" />

            {/* Cowcatcher / Lower Bogie Skirt */}
            <path d="M 120,440 L 300,440 L 280,480 L 140,480 Z" fill="#0f172a" />
          </svg>
        </div>

        {/* Left Side: Cinematic Branding & Text (Identical to Uploaded Layout) */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 lg:p-20 z-30 pointer-events-none">
          {/* Top Skip Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center justify-between pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-stone-950/80 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>India Rapid Transit Network</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="flex items-center gap-1.5 rounded-full border border-stone-700/80 bg-stone-900/90 px-4 py-1.5 text-xs font-semibold text-stone-200 backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-stone-800 hover:text-white cursor-pointer"
            >
              <span>Skip to Map</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>

          {/* Core Branding Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className="max-w-xl my-auto"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-tight">
              Station <span className="text-[#f59e0b]">Se Jud</span> Ke
            </h1>

            <p className="mt-3 font-sans text-xl sm:text-2xl font-semibold text-stone-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Find your station. Find your people.
            </p>

            <div className="mt-3 flex items-center gap-2 text-base sm:text-lg font-hindi font-medium text-stone-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              <span>स्टेशन से जुड़ के</span>
              <span className="text-[#f59e0b] font-bold">•</span>
              <span>अपने लोगों से मिल के</span>
            </div>

            {/* Amber Accent Bar */}
            <div className="mt-5 h-1 w-20 rounded-full bg-[#f59e0b] shadow-lg shadow-amber-500/50" />
          </motion.div>

          {/* Bottom Story Flow Pills & 2-Second Progress Line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="hidden md:flex items-center gap-2 text-[11px] font-semibold text-stone-400 drop-shadow">
              <span className="text-[#f59e0b] font-bold">CINEMATIC METRO OPENING</span>
              <span>→</span>
              <span className="text-stone-300">INDIA MAP</span>
              <span>→</span>
              <span>METRO CITIES</span>
              <span>→</span>
              <span>CITY NETWORK</span>
              <span>→</span>
              <span>STATIONS</span>
              <span>→</span>
              <span>PEOPLE</span>
            </div>

            {/* 2-second automatic loading progress line */}
            <div className="relative h-1.5 w-full sm:w-56 overflow-hidden rounded-full bg-stone-900 border border-stone-800">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: durationMs / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle Darkening / Fade Overlay at ~1.5s to 2s */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFadingOut ? 0.9 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 bg-stone-950"
      />
    </motion.div>
  );
};
