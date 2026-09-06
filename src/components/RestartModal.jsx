import React, { useState } from 'react';

export default function RestartModal({ isOpen, onClose, onConfirm }) {
  const [clearAnswers, setClearAnswers] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-void/80 backdrop-blur-xl animate-fade-in">
      <div className="max-w-md w-full p-8 rounded-3xl bg-nebula/95 border border-moonlight/15 shadow-2xl space-y-6 text-left">
        <div className="space-y-2">
          <h3 className="text-2xl font-serif text-moonlight font-light">
            Start over from Chapter 1?
          </h3>
          <p className="text-moonlight/60 text-xs md:text-sm font-light leading-relaxed">
            This will take you back to the beginning of the journey. By default, all the thoughts and answers you previously entered remain safe.
          </p>
        </div>

        {/* Optional clean slate */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-moonlight/10 bg-void/50 cursor-pointer text-xs text-moonlight/70 hover:text-moonlight transition-colors">
          <input
            type="checkbox"
            checked={clearAnswers}
            onChange={(e) => setClearAnswers(e.target.checked)}
            className="mt-0.5 accent-amber-glow rounded cursor-pointer"
          />
          <span>Also erase my previously saved answers (Complete clean slate)</span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs text-moonlight/60 hover:text-moonlight transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(clearAnswers)}
            className="px-5 py-2 rounded-full bg-amber-glow text-void text-xs font-medium hover:bg-amber-glow/90 transition-all cursor-pointer shadow-md"
          >
            Confirm & Restart
          </button>
        </div>
      </div>
    </div>
  );
}