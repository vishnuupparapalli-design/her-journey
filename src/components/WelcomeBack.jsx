import React from 'react';

export default function WelcomeBack({ displayName, chapterTitle, questionNumber, onResume, onStartOver }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-void/80 backdrop-blur-xl animate-fade-in">
      <div className="max-w-md w-full p-8 rounded-3xl bg-nebula/90 border border-moonlight/15 shadow-2xl space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-amber-glow text-xs tracking-widest uppercase font-mono">
            Checkpoint Found
          </span>
          <h2 className="text-3xl font-serif text-moonlight font-light">
            Welcome back, {displayName}
          </h2>
          <p className="text-moonlight/60 text-sm font-light leading-relaxed">
            You were exploring <span className="text-moonlight font-medium">{chapterTitle}</span> (Question {questionNumber}).
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3.5 px-6 rounded-full bg-moonlight text-void font-medium text-sm hover:bg-amber-glow hover:text-void transition-all duration-200 shadow-lg cursor-pointer"
          >
            Resume Journey →
          </button>

          <button
            type="button"
            onClick={onStartOver}
            className="text-xs text-moonlight/40 hover:text-moonlight/80 transition-colors cursor-pointer"
          >
            Start over from Chapter 1
          </button>
        </div>
      </div>
    </div>
  );
}