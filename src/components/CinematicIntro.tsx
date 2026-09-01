import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import {
  WORLD_LAND_FEATURE,
  EARTH_SPHERE_FEATURE,
  SOUTH_ASIA_SURROUNDING_COUNTRIES,
  INDIA_GEOJSON,
  INDIA_STATES_GEOJSON,
} from '../data/worldGeoData';
import { NATIONAL_METRO_HUBS, CITIES_METRO_DATA } from '../data/metroData';
import { CITY_SHORT_NAMES } from '../utils/labelCollisionSystem';
import { ArrowRight, Radio, Compass, Sparkles } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

// Smooth cubic bezier easing function: easeInOutCubic
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Smooth cubic easing: easeInOutSine
const easeInOutSine = (t: number): number => {
  return -(Math.cos(Math.PI * t) - 1) / 2;
};

// Target geographic coordinates for Central India
const INDIA_CENTER_LNG = 78.9629;
const INDIA_CENTER_LAT = 22.5937;

// Initial space starting orientation (showing Africa / Europe / Atlantic edge rotating eastward)
const INITIAL_START_LNG = 18.0;
const INITIAL_START_LAT = 10.0;

// Total Intro Duration in ms (~6.0s for smooth cinematic pacing)
const TOTAL_DURATION_MS = 6000;

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [hudPhase, setHudPhase] = useState<number>(0);
  const hudPhaseRef = useRef<number>(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Generate fixed starfield for deep cosmic background
  const stars = useMemo(() => {
    const starCount = 180;
    const items = [];
    for (let i = 0; i < starCount; i++) {
      items.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 2 + 1,
        color: i % 7 === 0 ? '#38BDF8' : i % 11 === 0 ? '#FF6B00' : '#FFFFFF',
      });
    }
    return items;
  }, []);

  // Precompute static graticule feature
  const graticule = useMemo(() => geoGraticule10(), []);

  // Finish intro handler
  const handleFinish = useCallback(() => {
    if (hasCompleted) return;
    setHasCompleted(true);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    try {
      localStorage.setItem('stationSeJudKeIntroSeen', 'true');
    } catch {
      // Ignore storage errors
    }
    onComplete();
  }, [hasCompleted, onComplete]);

  // Keyboard shortcut listener for Space or Escape to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let isRunning = true;

    // Handle high-DPI retina rendering
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const renderFrame = (timestamp: number) => {
      if (!isRunning) return;
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(elapsed / TOTAL_DURATION_MS, 1);

      // Phase calculation for HUD updates (Throttled to avoid unnecessary React re-renders)
      let newPhase = 0;
      if (rawProgress < 0.22) {
        newPhase = 0; // Stage 1: Deep Space
      } else if (rawProgress < 0.50) {
        newPhase = 1; // Stage 2: Approaching Earth & Continents
      } else if (rawProgress < 0.74) {
        newPhase = 2; // Stage 3: South Asia & India Highlight
      } else {
        newPhase = 3; // Stage 4: Metro Network Ignition
      }

      if (hudPhaseRef.current !== newPhase) {
        hudPhaseRef.current = newPhase;
        setHudPhase(newPhase);
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Clear background & draw deep cosmic space
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Cosmic gradient nebulae
      const spaceGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      spaceGrad.addColorStop(0, '#091326');
      spaceGrad.addColorStop(0.5, '#040914');
      spaceGrad.addColorStop(1, '#020408');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw starry backdrop with subtle twinkling
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const twinkle = 0.6 + 0.4 * Math.sin((elapsed / 1000) * star.twinkleSpeed + i);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 2. Camera & Projection Interpolation
      const minDim = Math.min(width, height);
      const isMobile = width < 640;

      // Initial Earth scale in space -> Final scale zoomed into India
      const startScale = isMobile ? minDim * 0.28 : minDim * 0.24;
      const midScale = isMobile ? minDim * 0.65 : minDim * 0.60;
      const zoomScale = isMobile ? minDim * 1.55 : minDim * 1.45;
      const finalScale = isMobile ? minDim * 2.45 : minDim * 2.2;

      let currentScale: number;
      let currentLng: number;
      let currentLat: number;
      let targetTranslateX = width / 2;
      let targetTranslateY = height / 2;

      if (rawProgress < 0.25) {
        // Stage 1: Deep space view -> starting natural rotation
        const t = easeInOutSine(rawProgress / 0.25);
        currentScale = startScale + (midScale - startScale) * t * 0.35;
        currentLng = INITIAL_START_LNG + (INDIA_CENTER_LNG - INITIAL_START_LNG) * t * 0.4;
        currentLat = INITIAL_START_LAT + (INDIA_CENTER_LAT - INITIAL_START_LAT) * t * 0.4;
      } else if (rawProgress < 0.55) {
        // Stage 2: Approaching Earth & Continents coming into view
        const t = easeInOutCubic((rawProgress - 0.25) / 0.30);
        const s1 = startScale + (midScale - startScale) * 0.35;
        currentScale = s1 + (zoomScale - s1) * t;
        currentLng = INITIAL_START_LNG + (INDIA_CENTER_LNG - INITIAL_START_LNG) * (0.4 + 0.6 * t);
        currentLat = INITIAL_START_LAT + (INDIA_CENTER_LAT - INITIAL_START_LAT) * (0.4 + 0.6 * t);
      } else {
        // Stage 3 & 4: Deep zoom into South Asia & India Metro Network
        const t = easeInOutCubic((rawProgress - 0.55) / 0.45);
        currentScale = zoomScale + (finalScale - zoomScale) * t;
        currentLng = INDIA_CENTER_LNG;
        currentLat = INDIA_CENTER_LAT;
        // Subtle optical vertical centering
        targetTranslateY = height / 2 + (isMobile ? 12 : 18) * t;
      }

      // 3. Setup D3 Orthographic Projection (Globe)
      const projection = geoOrthographic()
        .scale(currentScale)
        .translate([targetTranslateX, targetTranslateY])
        .rotate([-currentLng, -currentLat, 0])
        .clipAngle(90);

      const pathGenerator = geoPath(projection, ctx);

      // Globe center and screen radius
      const globeCenter = projection([currentLng, currentLat]) || [targetTranslateX, targetTranslateY];
      const globeRadius = currentScale;

      // 4. Draw Atmospheric Outer Glow & Rim (Space Lighting)
      if (rawProgress < 0.85) {
        const atmoFade = rawProgress < 0.65 ? 1 : (0.85 - rawProgress) / 0.2;
        ctx.save();
        ctx.globalAlpha = atmoFade;

        // Outer atmospheric corona
        const coronaGrad = ctx.createRadialGradient(
          globeCenter[0],
          globeCenter[1],
          globeRadius * 0.95,
          globeCenter[0],
          globeCenter[1],
          globeRadius * 1.25
        );
        coronaGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
        coronaGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.25)');
        coronaGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.08)');
        coronaGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');

        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(globeCenter[0], globeCenter[1], globeRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw Earth Ocean Base Sphere with Space Shading
      ctx.save();
      // Base Ocean fill (Deep Navy Indigo with sphere shading)
      const oceanGrad = ctx.createRadialGradient(
        globeCenter[0] - globeRadius * 0.35,
        globeCenter[1] - globeRadius * 0.35,
        globeRadius * 0.1,
        globeCenter[0],
        globeCenter[1],
        globeRadius
      );
      oceanGrad.addColorStop(0, '#0F203C');
      oceanGrad.addColorStop(0.5, '#091529');
      oceanGrad.addColorStop(0.85, '#050D1A');
      oceanGrad.addColorStop(1, '#02060D');

      ctx.beginPath();
      pathGenerator(EARTH_SPHERE_FEATURE as any);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Atmospheric limb edge line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 6. Draw Graticules (Latitude & Longitude Grid)
      ctx.beginPath();
      pathGenerator(graticule);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // 7. Draw World Continents / Landmasses (Africa, Europe, Asia, Americas, Australia, etc.)
      ctx.beginPath();
      pathGenerator(WORLD_LAND_FEATURE);
      ctx.fillStyle = '#111C33'; // Refined dark tactical landmass
      ctx.fill();

      // Coastlines contour
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 8. Draw Surrounding World / Neighboring Country Borders (Middle East, Asia, China, Pakistan, Bangladesh, etc.)
      if (rawProgress > 0.2) {
        const countryBorderAlpha = Math.min((rawProgress - 0.2) / 0.3, 1) * 0.45;
        ctx.beginPath();
        pathGenerator(SOUTH_ASIA_SURROUNDING_COUNTRIES as any);
        ctx.strokeStyle = `rgba(100, 116, 139, ${countryBorderAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // 9. STAGE 3 & 4: Highlight India Geographic Outline & States
      if (rawProgress > 0.4) {
        const indiaHighlightProgress = Math.min((rawProgress - 0.4) / 0.3, 1);
        const glowPulse = 0.85 + 0.15 * Math.sin(elapsed * 0.008);

        // Internal State Boundaries
        ctx.beginPath();
        pathGenerator(INDIA_STATES_GEOJSON as any);
        ctx.strokeStyle = `rgba(30, 41, 59, ${0.8 * indiaHighlightProgress})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Official India Country Boundary Fill & Glow Contour
        ctx.save();
        ctx.beginPath();
        pathGenerator(INDIA_GEOJSON as any);
        ctx.fillStyle = `rgba(15, 23, 42, ${0.8 * indiaHighlightProgress})`;
        ctx.fill();

        // Multi-layer glowing laser perimeter outline for India
        // Layer 1: Wide Amber Corona Glow
        ctx.shadowColor = '#FF6B00';
        ctx.shadowBlur = 16 * indiaHighlightProgress * glowPulse;
        ctx.strokeStyle = `rgba(255, 107, 0, ${0.9 * indiaHighlightProgress})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Layer 2: Inner Cyan Core Line
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 8 * indiaHighlightProgress;
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.8 * indiaHighlightProgress})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
        ctx.restore();

        // Digital HUD Scanner Sweep & Radar Ring over India
        const indiaCenterProjected = projection([INDIA_CENTER_LNG, INDIA_CENTER_LAT]);
        if (indiaCenterProjected && indiaHighlightProgress > 0.2) {
          const [ix, iy] = indiaCenterProjected;
          const radarRadius = (minDim * 0.35) * (0.3 + 0.7 * indiaHighlightProgress);

          ctx.save();
          // Tactical Reticle Target Box
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.6 * indiaHighlightProgress * glowPulse})`;
          ctx.lineWidth = 1.2;

          // Corner reticles
          const bSize = 18;
          ctx.beginPath();
          // Top Left
          ctx.moveTo(ix - bSize, iy - bSize + 6);
          ctx.lineTo(ix - bSize, iy - bSize);
          ctx.lineTo(ix - bSize + 6, iy - bSize);
          // Top Right
          ctx.moveTo(ix + bSize - 6, iy - bSize);
          ctx.lineTo(ix + bSize, iy - bSize);
          ctx.lineTo(ix + bSize, iy - bSize + 6);
          // Bottom Left
          ctx.moveTo(ix - bSize, iy + bSize - 6);
          ctx.lineTo(ix - bSize, iy + bSize);
          ctx.lineTo(ix - bSize + 6, iy + bSize);
          // Bottom Right
          ctx.moveTo(ix + bSize - 6, iy + bSize);
          ctx.lineTo(ix + bSize, iy + bSize);
          ctx.lineTo(ix + bSize, iy + bSize - 6);
          ctx.stroke();

          // Radar circle
          ctx.beginPath();
          ctx.arc(ix, iy, radarRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 107, 0, ${0.35 * indiaHighlightProgress})`;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Radar pulse beacon
          ctx.beginPath();
          ctx.arc(ix, iy, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#00F0FF';
          ctx.fill();
          ctx.restore();
        }
      }

      // 10. STAGE 4: Ignite National Metro Networks & 21 Hubs
      if (rawProgress > 0.65) {
        const networkProgress = Math.min((rawProgress - 0.65) / 0.25, 1);
        const hubCoords = new Map<string, [number, number]>();

        // Project Metro Cities onto current camera projection
        for (const city of CITIES_METRO_DATA) {
          const pt = projection([city.centerCoordinates[1], city.centerCoordinates[0]]);
          if (pt) {
            hubCoords.set(city.id, pt);
          }
        }

        // Draw animated national transit corridor filaments
        const corridors = [
          ['delhi', 'noida'],
          ['delhi', 'gurgaon'],
          ['delhi', 'meerut'],
          ['delhi', 'agra'],
          ['delhi', 'jaipur'],
          ['delhi', 'kanpur'],
          ['delhi', 'lucknow'],
          ['delhi', 'ahmedabad'],
          ['delhi', 'mumbai'],
          ['delhi', 'kolkata'],
          ['agra', 'kanpur'],
          ['kanpur', 'lucknow'],
          ['lucknow', 'patna'],
          ['patna', 'kolkata'],
          ['jaipur', 'ahmedabad'],
          ['ahmedabad', 'mumbai'],
          ['mumbai', 'pune'],
          ['mumbai', 'nagpur'],
          ['mumbai', 'hyderabad'],
          ['bhopal', 'indore'],
          ['bhopal', 'nagpur'],
          ['hyderabad', 'bengaluru'],
          ['hyderabad', 'chennai'],
          ['bengaluru', 'chennai'],
          ['bengaluru', 'kochi'],
          ['chennai', 'kochi'],
          ['kolkata', 'chennai'],
        ];

        ctx.save();
        for (const [from, to] of corridors) {
          const p1 = hubCoords.get(from);
          const p2 = hubCoords.get(to);
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            const midX = (p1[0] + p2[0]) / 2 + (p2[1] - p1[1]) * 0.03;
            const midY = (p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * 0.03;
            ctx.quadraticCurveTo(midX, midY, p2[0], p2[1]);

            ctx.strokeStyle = `rgba(0, 240, 255, ${0.75 * networkProgress})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 6;
            ctx.stroke();
          }
        }
        ctx.restore();

        // Draw 21 Metro City Beacons & Labels
        ctx.save();
        NATIONAL_METRO_HUBS.forEach((hub, idx) => {
          const pt = hubCoords.get(hub.id);
          if (!pt) return;
          const [hx, hy] = pt;
          const delayT = Math.max(0, Math.min((networkProgress - idx * 0.02) / 0.3, 1));
          if (delayT <= 0) return;

          // Outer beacon ring
          ctx.beginPath();
          ctx.arc(hx, hy, 9 * delayT, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 107, 0, 0.25)';
          ctx.fill();

          // Hub Node Core
          ctx.beginPath();
          ctx.arc(hx, hy, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#070B14';
          ctx.strokeStyle = '#FF6B00';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#FF6B00';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.stroke();

          // Center Cyan Dot
          ctx.beginPath();
          ctx.arc(hx, hy, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#00F0FF';
          ctx.fill();

          // City Label on higher zoom
          if (rawProgress > 0.72) {
            const shortName = CITY_SHORT_NAMES[hub.id] || hub.name;
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            // Text background stroke for legibility
            ctx.strokeStyle = '#050811';
            ctx.lineWidth = 3;
            ctx.strokeText(shortName, hx, hy + 7);

            ctx.fillStyle = '#F8FAFC';
            ctx.fillText(shortName, hx, hy + 7);
          }
        });
        ctx.restore();
      }

      ctx.restore(); // restore dpr scale

      // Finish when complete
      if (rawProgress >= 1.0) {
        handleFinish();
      } else {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [graticule, handleFinish, stars]);

  return (
    <div
      id="cinematic-intro-viewport"
      className="fixed inset-0 z-50 bg-[#030712] flex items-center justify-center overflow-hidden select-none"
    >
      {/* 60FPS High-Precision Geographic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Top Header HUD: Skip Button & Orbital Telemetry */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Left Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#070B14]/85 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 font-bold uppercase tracking-wider">
            {hudPhase === 0
              ? 'DEEP SPACE LINK'
              : hudPhase === 1
              ? 'ORBITAL DESCENT'
              : hudPhase === 2
              ? 'SOUTH ASIA TARGET LOCK'
              : 'NATIONAL TRANSIT MATRIX'}
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400 font-medium">
            {hudPhase === 0
              ? 'ALT: 36,000 KM'
              : hudPhase === 1
              ? 'ALT: 2,400 KM'
              : hudPhase === 2
              ? 'ALT: 420 KM • 22.59° N, 78.96° E'
              : '21 METRO SYSTEMS ONLINE'}
          </span>
        </div>

        {/* Skip Button */}
        <div className="pointer-events-auto">
          <button
            id="skip-intro-btn"
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#070B14]/85 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono tracking-wider backdrop-blur-md shadow-xl transition active:scale-95 group cursor-pointer"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Subtitle / Cinematic Tagline HUD */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center pointer-events-none text-center px-4 z-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={`hud-phase-${hudPhase}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#070B14]/90 border border-slate-800/90 backdrop-blur-xl text-xs font-mono text-slate-200 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
            <span className="font-semibold text-white tracking-wide">
              {hudPhase === 0 && 'SCANNING PLANET EARTH FROM DEEP ORBIT...'}
              {hudPhase === 1 && 'APPROACHING AFRO-EURASIA & SOUTH ASIA...'}
              {hudPhase === 2 && 'GEO-LOCKING INDIA NATIONAL BOUNDARIES...'}
              {hudPhase === 3 && 'STATION SE JUD KE • CONNECTING 21 METRO CITIES'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
