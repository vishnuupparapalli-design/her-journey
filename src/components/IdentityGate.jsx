import React, { useState } from 'react';

export default function IdentityGate({ onEnter, isLoading }) {
  const [name, setName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (passphrase.length < 6) {
      setErrorMsg('Your secret passphrase must be at least 6 characters.');
      return;
    }

    onEnter(name.trim(), passphrase);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-void relative overflow-hidden text-center">
      {/* Soft warm atmospheric background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-glow/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full p-8 md:p-10 rounded-3xl bg-nebula/60 backdrop-blur-2xl border border-moonlight/10 shadow-2xl relative z-10 space-y-6 animate-fade-in text-left">
        <div className="text-center space-y-2">
          <span className="text-amber-glow text-xs tracking-widest uppercase font-mono">
            A Universe For Her
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-moonlight leading-tight">
            Before we begin
          </h1>
          <p className="text-moonlight/60 text-xs md:text-sm font-light leading-relaxed">
            Enter your name and a memorable secret passphrase. This ensures your journey and thoughts stay safe, forever yours on any device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono text-moonlight/60 mb-1.5 uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chau"
              className="w-full p-3.5 rounded-xl bg-void/60 border border-moonlight/15 text-moonlight placeholder-moonlight/25 text-sm focus:outline-none focus:border-amber-glow transition-all"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-moonlight/60 mb-1.5 uppercase tracking-wider">
              Memorable Passphrase
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="A word or phrase only you remember"
              className="w-full p-3.5 rounded-xl bg-void/60 border border-moonlight/15 text-moonlight placeholder-moonlight/25 text-sm focus:outline-none focus:border-amber-glow transition-all"
              disabled={isLoading}
            />
            <p className="text-[11px] text-moonlight/40 mt-1">
              Minimum 6 characters. Remember this to return anytime.
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs text-amber-glow bg-amber-glow/10 border border-amber-glow/20 rounded-lg p-2.5">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full bg-moonlight text-void font-medium text-sm hover:bg-amber-glow hover:text-void transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Opening Universe...' : 'Enter the Universe →'}
          </button>
        </form>
      </div>
    </main>
  );
}