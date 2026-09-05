import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useJourneyStore } from './state/useJourneyStore';
import QuestionRenderer from './components/QuestionRenderer';

function JourneyExperience() {
  const {
    currentIndex,
    getCurrentQuestion,
    getTotalQuestions,
    getCurrentChapter,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    skipQuestion,
  } = useJourneyStore();

  const currentQ = getCurrentQuestion();
  const total = getTotalQuestions();
  const chapter = getCurrentChapter();
  const existingAnswer = currentQ ? answers[currentQ.id] : null;

  const handleSave = (questionId, value) => {
    setAnswer(questionId, value);
    nextQuestion();
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-6 md:p-10 relative overflow-hidden bg-void">
      {/* Atmospheric Background Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: chapter.color }}
      />

      {/* Top HUD: Chapter Title & Progress */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div>
          <span
            className="text-xs tracking-widest uppercase font-mono transition-colors duration-500"
            style={{ color: chapter.color }}
          >
            Chapter {chapter.order} · {chapter.subtitle}
          </span>
          <h1 className="text-xl md:text-2xl font-serif font-light text-moonlight">
            {chapter.title}
          </h1>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-moonlight/40">
            {currentIndex + 1} of {total}
          </span>
          <div className="w-24 md:w-36 h-1 bg-moonlight/10 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-glow transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Question Card Surface */}
      <div className="relative z-10 my-auto py-8">
        {currentQ ? (
          <QuestionRenderer
            question={currentQ}
            currentAnswer={existingAnswer}
            onSave={handleSave}
            onSkip={skipQuestion}
          />
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-serif text-moonlight">End of Preview</h2>
            <p className="text-moonlight/60">You have completed all questions in this preview.</p>
          </div>
        )}
      </div>

      {/* Bottom Controls & Previous button */}
      <footer className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full text-xs text-moonlight/40">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="hover:text-moonlight disabled:opacity-20 transition-colors"
        >
          ← Previous
        </button>

        <Link to="/admin" className="hover:text-amber-glow transition-colors">
          Admin Preview →
        </Link>
      </footer>
    </main>
  );
}

function AdminCheck() {
  const { answers } = useJourneyStore();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-nebula/40">
      <div className="max-w-md w-full p-8 rounded-2xl border border-moonlight/10 bg-void/90 space-y-4 text-left">
        <h2 className="text-2xl font-serif text-moonlight">Admin Route Preview</h2>
        <p className="text-moonlight/60 text-xs">
          Stage 2 verification: Below are the answers currently captured in Zustand memory:
        </p>
        <pre className="p-3 bg-void rounded-lg text-xs font-mono text-amber-glow overflow-x-auto max-h-48 border border-moonlight/10">
          {JSON.stringify(answers, null, 2)}
        </pre>
        <Link
          to="/"
          className="inline-block text-amber-glow hover:underline text-sm pt-2"
        >
          ← Return to Journey
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-void text-moonlight">
      <Routes>
        <Route path="/" element={<JourneyExperience />} />
        <Route path="/admin" element={<AdminCheck />} />
      </Routes>
    </div>
  );
}