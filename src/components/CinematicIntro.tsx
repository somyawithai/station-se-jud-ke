import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  getIndiaBoundarySvgPaths,
  getIndiaStateBoundarySvgPaths,
  INDIA_MAP_WIDTH,
  INDIA_MAP_HEIGHT,
} from '../utils/geoProjection';
import { NATIONAL_METRO_HUBS } from '../data/metroData';
import { CITY_SHORT_NAMES } from '../utils/labelCollisionSystem';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Phase state: 0: Space/Earth, 1: Zooming in, 2: India Reveals, 3: Metro Network Lights Up, 4: Transition to App
  const [phase, setPhase] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // SVG Geo Boundary Paths (Exact application paths)
  const indiaSvgBoundaryPaths = useMemo(() => getIndiaBoundarySvgPaths(), []);
  const indiaStateBoundaryPaths = useMemo(() => getIndiaStateBoundarySvgPaths(), []);

  // Hub map for network lines
  const hubMap = useMemo(() => new Map(NATIONAL_METRO_HUBS.map((h) => [h.id, h])), []);

  // Corridors that animate outward
  const networkCorridors = useMemo(() => {
    const connections = [
      { from: 'delhi', to: 'noida', delay: 0 },
      { from: 'delhi', to: 'gurugram', delay: 0.05 },
      { from: 'delhi', to: 'jaipur', delay: 0.1 },
      { from: 'delhi', to: 'lucknow', delay: 0.12 },
      { from: 'delhi', to: 'ahmedabad', delay: 0.18 },
      { from: 'delhi', to: 'mumbai', delay: 0.22 },
      { from: 'delhi', to: 'kolkata', delay: 0.25 },
      { from: 'mumbai', to: 'pune', delay: 0.15 },
      { from: 'mumbai', to: 'nagpur', delay: 0.2 },
      { from: 'mumbai', to: 'hyderabad', delay: 0.28 },
      { from: 'bengaluru', to: 'chennai', delay: 0.2 },
      { from: 'bengaluru', to: 'hyderabad', delay: 0.24 },
      { from: 'bengaluru', to: 'kochi', delay: 0.3 },
      { from: 'kolkata', to: 'chennai', delay: 0.32 },
      { from: 'hyderabad', to: 'chennai', delay: 0.28 },
    ];

    return connections
      .map(({ from, to, delay }) => {
        const h1 = hubMap.get(from);
        const h2 = hubMap.get(to);
        if (!h1 || !h2) return null;
        const midX = (h1.x + h2.x) / 2 + (h2.y - h1.y) * 0.04;
        const midY = (h1.y + h2.y) / 2 - (h2.x - h1.x) * 0.04;
        return {
          id: `${from}-${to}`,
          d: `M ${h1.x} ${h1.y} Q ${midX} ${midY} ${h2.x} ${h2.y}`,
          delay,
        };
      })
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [hubMap]);

  // Handle completion and cleanup
  const handleFinish = () => {
    if (hasCompleted) return;
    setHasCompleted(true);
    try {
      localStorage.setItem('stationSeJudKeIntroSeen', 'true');
    } catch {
      // Ignore storage errors
    }
    onComplete();
  };

  useEffect(() => {
    // Timeline sequence:
    // 0.0s - 1.1s: Scene 1 Earth in Space
    // 1.1s - 2.6s: Scene 2 Zoom toward Indian Subcontinent
    // 2.6s - 3.5s: Scene 3 Geographic India Resolves
    // 3.5s - 4.4s: Scene 4 Metro Network Ignites
    // 4.4s - 4.8s: Scene 5 Smooth Handoff to App

    const t1 = setTimeout(() => setPhase(1), 1100);
    const t2 = setTimeout(() => setPhase(2), 2600);
    const t3 = setTimeout(() => setPhase(3), 3500);
    const t4 = setTimeout(() => setPhase(4), 4400);
    const t5 = setTimeout(() => handleFinish(), 4850);

    timeoutRefs.current = [t1, t2, t3, t4, t5];

    return () => {
      timeoutRefs.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div
      id="cinematic-intro-viewport"
      className="fixed inset-0 z-50 bg-[#050811] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Deep Space Background Stars & Nebula Glow */}
      <div className="absolute inset-0 bg-radial from-[#0d1829] via-[#050811] to-[#020408] pointer-events-none" />

      {/* Subtle Starfield */}
      <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
        <circle cx="15%" cy="20%" r="1" fill="#FFFFFF" opacity="0.8" />
        <circle cx="28%" cy="12%" r="1.5" fill="#38BDF8" opacity="0.9" />
        <circle cx="45%" cy="8%" r="0.8" fill="#FFFFFF" opacity="0.5" />
        <circle cx="68%" cy="18%" r="1.2" fill="#FFFFFF" opacity="0.7" />
        <circle cx="82%" cy="14%" r="1" fill="#38BDF8" opacity="0.6" />
        <circle cx="90%" cy="32%" r="1.5" fill="#FFFFFF" opacity="0.8" />
        <circle cx="12%" cy="65%" r="1" fill="#FFFFFF" opacity="0.7" />
        <circle cx="22%" cy="85%" r="1.2" fill="#38BDF8" opacity="0.7" />
        <circle cx="75%" cy="78%" r="1" fill="#FFFFFF" opacity="0.6" />
        <circle cx="88%" cy="88%" r="1.5" fill="#FFFFFF" opacity="0.8" />
      </svg>

      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          id="skip-intro-btn"
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#070B14]/80 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono tracking-wider backdrop-blur-md shadow-xl transition active:scale-95"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00]" />
        </button>
      </div>

      {/* Cinematic Stage with Smooth Dynamic Zoom Transform */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* ========================================================= */}
        {/* SCENE 1 & 2: 3D DIGITAL EARTH GLOBE                       */}
        {/* ========================================================= */}
        <motion.div
          className="absolute flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.65 }}
          animate={{
            opacity: phase >= 3 ? 0 : 1,
            scale: phase === 0 ? 1 : phase === 1 ? 2.8 : 4.5,
            x: phase === 0 ? 0 : phase === 1 ? '-12%' : '-24%',
            y: phase === 0 ? 0 : phase === 1 ? '10%' : '18%',
          }}
          transition={{
            duration: phase === 0 ? 0.9 : phase === 1 ? 1.5 : 1.0,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full flex items-center justify-center">
            {/* Atmospheric Rim Glow */}
            <div className="absolute -inset-4 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
            <div className="absolute -inset-1 rounded-full border border-cyan-400/30 shadow-[0_0_50px_rgba(6,182,212,0.4)]" />

            {/* Earth Body SVG Sphere with Shading and Continents */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full rounded-full overflow-hidden shadow-2xl"
            >
              <defs>
                {/* Space Lighting Gradient */}
                <radialGradient id="earthLighting" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="1" />
                  <stop offset="50%" stopColor="#0B132B" stopOpacity="1" />
                  <stop offset="85%" stopColor="#050811" stopOpacity="1" />
                  <stop offset="100%" stopColor="#020408" stopOpacity="1" />
                </radialGradient>

                {/* Atmosphere Limb Glow */}
                <radialGradient id="atmoLimb" cx="50%" cy="50%" r="50%">
                  <stop offset="80%" stopColor="#00F0FF" stopOpacity="0" />
                  <stop offset="96%" stopColor="#00F0FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
                </radialGradient>

                {/* Digital Grid Pattern */}
                <pattern id="earthGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.15" />
                </pattern>
              </defs>

              {/* Sphere Base */}
              <circle cx="200" cy="200" r="196" fill="url(#earthLighting)" />
              <circle cx="200" cy="200" r="196" fill="url(#earthGrid)" />

              {/* Digital Latitude & Longitude Rings */}
              <ellipse cx="200" cy="200" rx="196" ry="60" fill="none" stroke="#00F0FF" strokeWidth="0.75" strokeOpacity="0.25" />
              <ellipse cx="200" cy="200" rx="196" ry="120" fill="none" stroke="#00F0FF" strokeWidth="0.75" strokeOpacity="0.2" />
              <ellipse cx="200" cy="200" rx="60" ry="196" fill="none" stroke="#00F0FF" strokeWidth="0.75" strokeOpacity="0.25" />
              <ellipse cx="200" cy="200" rx="120" ry="196" fill="none" stroke="#00F0FF" strokeWidth="0.75" strokeOpacity="0.2" />

              {/* Stylized Afro-Eurasian Continents with Indian Subcontinent Prominently Centered */}
              <g fill="#1E293B" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.6" opacity="0.85">
                {/* Indian Subcontinent Silhouette on the Globe */}
                <path
                  d="M 215 155 Q 230 150 245 155 Q 255 175 250 200 Q 240 225 228 245 Q 220 255 218 260 Q 212 245 205 220 Q 198 190 205 170 Z"
                  fill="#0F172A"
                  stroke="#FF6B00"
                  strokeWidth="1.5"
                  strokeOpacity="0.9"
                />

                {/* Surrounding Asia & Middle East Landmasses */}
                <path
                  d="M 160 140 Q 180 130 210 140 Q 230 135 270 140 Q 300 150 330 180 Q 310 210 270 200 Q 250 170 215 155 Z"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
                {/* Southeast Asia */}
                <path
                  d="M 260 210 Q 280 215 300 235 Q 290 260 270 250 Z"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />
                {/* Horn of Africa & Arabia */}
                <path
                  d="M 140 160 Q 170 165 185 190 Q 175 210 150 220 Q 130 200 140 160 Z"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                />
              </g>

              {/* Glowing Target Beacon over India */}
              <circle cx="225" cy="205" r="4" fill="#FF6B00" className="animate-ping" />
              <circle cx="225" cy="205" r="2.5" fill="#FFFFFF" />

              {/* Atmospheric Edge Glow Rim */}
              <circle cx="200" cy="200" r="196" fill="url(#atmoLimb)" />
            </svg>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* SCENE 3, 4 & 5: EXACT ACCURATE GEOGRAPHIC INDIA VECTOR MAP */}
        {/* ========================================================= */}
        <motion.div
          id="cinematic-india-map-container"
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.35, y: 30 }}
          animate={{
            opacity: phase >= 2 ? 1 : 0,
            scale: phase >= 2 ? 1 : 0.35,
            y: phase >= 2 ? 0 : 30,
          }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <svg
            viewBox={`0 0 ${INDIA_MAP_WIDTH} ${INDIA_MAP_HEIGHT}`}
            className="w-full h-full select-none overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="introMapGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="introCityPulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* India Boundary Base Fill */}
            <g id="intro-india-base">
              {/* Internal State Boundaries */}
              {indiaStateBoundaryPaths.map((state, index) => (
                <path
                  key={`intro-state-${index}`}
                  d={state.path}
                  fill="none"
                  stroke="#162238"
                  strokeWidth="0.75"
                  strokeOpacity={phase >= 2 ? 0.7 : 0}
                  className="transition-opacity duration-700"
                />
              ))}

              {/* Official Country Boundary MultiPolygon */}
              {indiaSvgBoundaryPaths.map((d, index) => (
                <path
                  key={`intro-base-${index}`}
                  d={d}
                  fill="#090F1C"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeOpacity={phase >= 2 ? 0.9 : 0.3}
                  filter="url(#introMapGlow)"
                  className="transition-all duration-700"
                />
              ))}
            </g>

            {/* Animated Metro Corridors Filaments (Scene 4) */}
            {phase >= 3 && (
              <g id="intro-metro-corridors">
                {networkCorridors.map((corridor) => (
                  <motion.path
                    key={corridor.id}
                    d={corridor.d}
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    filter="url(#introMapGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{
                      duration: 0.8,
                      delay: corridor.delay,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </g>
            )}

            {/* Glowing Metro Hubs (Scene 4) */}
            {phase >= 3 && (
              <g id="intro-metro-hubs">
                {NATIONAL_METRO_HUBS.map((hub, idx) => {
                  const shortName = CITY_SHORT_NAMES[hub.id] || hub.name;
                  return (
                    <motion.g
                      key={hub.id}
                      transform={`translate(${hub.x}, ${hub.y})`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + (idx % 8) * 0.04,
                        ease: 'backOut',
                      }}
                    >
                      {/* Pulse Wave */}
                      <circle
                        cx="0"
                        cy="0"
                        r="14"
                        fill="#FF6B00"
                        fillOpacity="0.2"
                        className="animate-ping"
                        style={{ animationDuration: '3s' }}
                      />
                      {/* Hub Beacon Outer */}
                      <circle
                        cx="0"
                        cy="0"
                        r="6"
                        fill="#070B14"
                        stroke="#FF6B00"
                        strokeWidth="2"
                        filter="url(#introCityPulseGlow)"
                      />
                      {/* Hub Beacon Center */}
                      <circle cx="0" cy="0" r="3" fill="#00F0FF" />

                      {/* City Label */}
                      <text
                        x="0"
                        y="14"
                        textAnchor="middle"
                        className="text-[9px] font-mono font-bold fill-slate-200"
                        style={{
                          paintOrder: 'stroke',
                          stroke: '#050811',
                          strokeWidth: '3px',
                        }}
                      >
                        {shortName}
                      </text>
                    </motion.g>
                  );
                })}
              </g>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Bottom Subtitle / Tagline */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: phase >= 2 ? 1 : 0.6,
            y: 0,
          }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#070B14]/90 border border-slate-800 backdrop-blur-xl text-xs font-mono text-slate-300 shadow-2xl"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="font-semibold text-white tracking-wide">
            {phase < 2
              ? 'LOCATING INDIA DIGITAL TRANSIT NETWORK...'
              : phase === 2
              ? 'INITIALIZING NATIONAL GEOGRAPHIC MATRIX...'
              : 'STATION SE JUD KE • 20 METRO SYSTEMS ONLINE'}
          </span>
        </motion.div>
      </div>
    </div>
  );
};
