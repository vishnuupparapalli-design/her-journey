import React, { useEffect, useState } from 'react';
import { useJourneyStore } from '../state/useJourneyStore';

export default function CinematicEnding({ onRevisit }) {
  const { respondent, personalization, answers } = useJourneyStore();
  const [phase, setPhase] = useState(0); // 0: Fade, 1: Constellation, 2: Echoes, 3: Final Line

  const displayName = respondent?.displayName || 'Traveler';
  const dream = personalization?.chosenDream || personalization?.independentDream || 'A life built on your own terms';

  useEffect(() => {
    // Stage 1: Fade to deep void (0 - 1.5s)
    const t1 = setTimeout(() => setPhase(1), 1200);

    // Stage 2: Words materialize (4s)
    const t2 = setTimeout(() => setPhase(2), 3800);

    // Stage 3: The final line fades in (8.5s)
    const t3 = setTimeout(() => setPhase(3), 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#0B0E1A] text-[#EDEAE0] overflow-hidden select-none transition-opacity duration-1000">
      {/* Ambient Pulsing Nebula Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8A857]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* PHASE 1: The Connected 14-World Constellation Ring */}
      {phase >= 1 && (
        <div className="relative z-10 w-72 h-72 md:w-96 md:h-96 flex items-center justify-center animate-fade-in">
          {/* Constellation Ring Trail */}
          <div className="absolute inset-0 rounded-full border border-[#EDEAE0]/20 border-dashed animate-[spin_120s_linear_infinite]" />

          {/* 14 Starlight Nodes */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / 14;
            const x = Math.cos(angle) * 140;
            const y = Math.sin(angle) * 140;
            return (
              <div
                key={i}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  animationDelay: `${i * 0.15}s`,
                }}
                className="absolute w-2.5 h-2.5 rounded-full bg-[#E8A857] shadow-[0_0_12px_#E8A857] animate-pulse"
              />
            );
          })}

          {/* Center Glowing Core */}
          <div className="w-16 h-16 rounded-full bg-[#D4AF6A]/20 border border-[#D4AF6A]/40 shadow-[0_0_30px_#D4AF6A] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#EDEAE0] shadow-[0_0_15px_#EDEAE0]" />
          </div>
        </div>
      )}

      {/* PHASE 2: Her Personal Echoes Floating in Space */}
      {phase === 2 && (
        <div className="relative z-20 max-w-lg text-center space-y-3 mt-8 animate-fade-in">
          <span className="text-xs font-mono text-[#E8A857] uppercase tracking-widest">
            A memory written in the stars
          </span>
          <p className="text-xl md:text-2xl font-serif text-[#EDEAE0]/90 italic font-light leading-relaxed">
            "{dream}"
          </p>
        </div>
      )}

      {/* PHASE 3: The Definitive Closing Line */}
      {phase >= 3 && (
        <div className="relative z-20 max-w-xl text-center space-y-6 mt-8 animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-serif font-light text-[#EDEAE0] tracking-tight leading-tight">
              I listened.
            </h1>
            <p className="text-sm md:text-base font-light text-[#EDEAE0]/70 max-w-md mx-auto leading-relaxed">
              Every word, every thought, and every dream you shared is kept safe right here forever.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRevisit}
              className="px-8 py-3.5 rounded-full bg-[#EDEAE0] text-[#0B0E1A] font-medium text-xs md:text-sm hover:bg-[#E8A857] hover:text-[#0B0E1A] transition-all shadow-xl cursor-pointer"
            >
              Revisit the Worlds 🌌
            </button>
          </div>

          <p className="text-[11px] font-mono text-[#EDEAE0]/30 pt-2">
            You can return to this universe anytime, on any device.
          </p>
        </div>
      )}
    </div>
  );
}