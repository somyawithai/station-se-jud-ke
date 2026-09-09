import React from 'react';

export const HeroCinematicAtmosphere: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-[#0a0e1c]">
      {/* LAG FIX: full-bleed photo is desktop-only. Phones keep a solid fill so
          the map is not compositing a second full-screen image on every frame. */}
      <div className="hero-cinematic-photo absolute inset-0 bg-cover bg-center" />

      {/* Slight overall darkening so labels, glass panels, and the D3 map stay legible */}
      <div className="absolute inset-0 bg-[#0a0e1c]/22" />

      {/* Gentle vignette toward the top/bottom edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1c]/50 via-transparent to-[#0a0e1c]/20" />
    </div>
  );
};
