import React, { useState, useEffect } from 'react';

export default function QuestionRenderer({ question, currentAnswer, onSave, onSkip }) {
  const [val, setVal] = useState(currentAnswer?.value ?? null);

  useEffect(() => {
    setVal(currentAnswer?.value ?? null);
  }, [question.id, currentAnswer]);

  const handleConfirm = () => {
    if (val !== null && val !== undefined && val !== '') {
      onSave(question.id, val);
    } else {
      onSkip();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (question.type === 'free_text' && document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      } else if (question.options && ['single_select', 'mood_select', 'two_path', 'image_select', 'object_select'].includes(question.type)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= question.options.length) {
          setVal(question.options[num - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [val, question]);

  return (
    <div
      role="region"
      aria-label={`Question: ${question.text}`}
      className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-nebula/60 backdrop-blur-xl border border-moonlight/10 shadow-2xl text-left space-y-6 animate-fade-in"
    >
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-serif font-normal text-moonlight leading-snug">
          {question.text}
        </h2>
        {question.subtext && (
          <p className="text-moonlight/60 text-sm md:text-base font-light">
            {question.subtext}
          </p>
        )}
      </div>

      <div className="py-2">
        {/* 1. SINGLE SELECT / IMAGE SELECT / OBJECT SELECT */}
        {['single_select', 'image_select', 'object_select'].includes(question.type) && question.options && (
          <div className="space-y-2.5">
            {question.options.map((opt, i) => {
              const selected = val === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setVal(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm md:text-base flex items-center justify-between cursor-pointer ${
                    selected
                      ? 'border-amber-glow bg-amber-glow/15 text-moonlight shadow-md'
                      : 'border-moonlight/15 bg-void/40 text-moonlight/80 hover:border-moonlight/30 hover:bg-void/60'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] font-mono text-moonlight/30 border border-moonlight/15 px-2 py-0.5 rounded">
                    {i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. MOOD SELECT */}
        {question.type === 'mood_select' && question.options && (
          <div className="flex flex-wrap gap-2.5">
            {question.options.map((opt, i) => {
              const selected = val === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setVal(opt.id)}
                  className={`px-4 py-3 rounded-full border transition-all text-sm md:text-base flex items-center gap-2 cursor-pointer ${
                    selected
                      ? 'border-amber-glow bg-amber-glow/20 text-moonlight scale-105 shadow-md'
                      : 'border-moonlight/15 bg-void/40 text-moonlight/80 hover:border-moonlight/30'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] font-mono opacity-40">{i + 1}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. MULTI SELECT / IDEAL DAY BUILDER */}
        {['multi_select', 'ideal_day_builder'].includes(question.type) && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {question.options.map((opt) => {
              const list = Array.isArray(val) ? val : [];
              const selected = list.includes(opt.id);
              const toggle = () => {
                if (selected) {
                  setVal(list.filter((x) => x !== opt.id));
                } else {
                  setVal([...list, opt.id]);
                }
              };
              return (
                <button
                  key={opt.id}
                  onClick={toggle}
                  className={`p-3.5 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                    selected
                      ? 'border-sage-mist bg-sage-mist/20 text-moonlight shadow-sm'
                      : 'border-moonlight/15 bg-void/40 text-moonlight/70 hover:border-moonlight/30'
                  }`}
                >
                  <span className="mr-2">{selected ? '✓' : '○'}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 4. SLIDER / TIMELINE */}
        {['slider', 'timeline'].includes(question.type) && (
          <div className="space-y-4 pt-2">
            <input
              type="range"
              min={question.min ?? 1}
              max={question.max ?? 10}
              value={val ?? Math.round(((question.max ?? 10) + (question.min ?? 1)) / 2)}
              onChange={(e) => setVal(Number(e.target.value))}
              aria-label={question.text}
              className="w-full accent-amber-glow h-2 bg-void/80 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-moonlight/50 font-light">
              <span>{question.minLabel ?? (question.type === 'timeline' ? 'Early on' : 'Low')}</span>
              <span className="text-amber-glow font-mono text-sm">{val ?? '-'}</span>
              <span>{question.maxLabel ?? (question.type === 'timeline' ? 'Right now' : 'High')}</span>
            </div>
          </div>
        )}

        {/* 5. FREE TEXT */}
        {question.type === 'free_text' && (
          <div className="space-y-2">
            <textarea
              rows={4}
              value={val ?? ''}
              onChange={(e) => setVal(e.target.value)}
              placeholder={question.placeholder || 'Write whatever is in your heart...'}
              aria-label={question.text}
              className="w-full p-4 rounded-2xl bg-void/60 border border-moonlight/20 text-moonlight placeholder-moonlight/30 text-sm md:text-base focus:outline-none focus:border-amber-glow focus:ring-1 focus:ring-amber-glow transition-all"
            />
          </div>
        )}

        {/* 6. TWO PATH */}
        {question.type === 'two_path' && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((opt) => {
              const selected = val === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setVal(opt.id)}
                  className={`p-6 rounded-2xl border text-center transition-all duration-300 cursor-pointer ${
                    selected
                      ? 'border-warm-gold bg-warm-gold/20 text-moonlight scale-105 shadow-xl'
                      : 'border-moonlight/15 bg-void/40 text-moonlight/70 hover:border-moonlight/30'
                  }`}
                >
                  <p className="font-serif text-lg text-moonlight">{opt.label}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* 7. STAR RATING */}
        {question.type === 'star_rating' && (
          <div className="flex items-center justify-center gap-3 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setVal(star)}
                aria-label={`${star} stars`}
                className="text-3xl md:text-4xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
              >
                <span className={star <= (val ?? 0) ? 'text-amber-glow' : 'text-moonlight/20'}>
                  ★
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 8. RANKING / VALUE PRIORITY */}
        {['ranking', 'value_priority'].includes(question.type) && question.options && (
          <div className="space-y-2">
            {(() => {
              const currentOrder = Array.isArray(val)
                ? val
                : question.options.map((o) => o.id);

              const move = (fromIdx, toIdx) => {
                if (toIdx < 0 || toIdx >= currentOrder.length) return;
                const updated = [...currentOrder];
                const [moved] = updated.splice(fromIdx, 1);
                updated.splice(toIdx, 0, moved);
                setVal(updated);
              };

              return currentOrder.map((optId, idx) => {
                const option = question.options.find((o) => o.id === optId);
                return (
                  <div
                    key={optId}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-moonlight/15 bg-void/40 text-moonlight text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-amber-glow/70">{idx + 1}</span>
                      <span>{option?.label ?? optId}</span>
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(idx, idx - 1)}
                        disabled={idx === 0}
                        className="px-2.5 py-1 bg-nebula rounded hover:bg-void disabled:opacity-20 text-xs cursor-pointer"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => move(idx, idx + 1)}
                        disabled={idx === currentOrder.length - 1}
                        className="px-2.5 py-1 bg-nebula rounded hover:bg-void disabled:opacity-20 text-xs cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-moonlight/10">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs md:text-sm text-moonlight/40 hover:text-moonlight/80 transition-colors cursor-pointer"
        >
          Skip for now <span className="hidden sm:inline font-mono text-[10px] opacity-40">(Esc)</span>
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="px-6 py-2.5 rounded-full bg-moonlight text-void font-medium text-sm hover:bg-amber-glow hover:text-void transition-all duration-200 shadow-lg cursor-pointer"
        >
          {val !== null && val !== undefined && val !== '' ? 'Continue →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}