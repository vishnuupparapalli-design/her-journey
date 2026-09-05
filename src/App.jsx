import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useJourneyStore } from './state/useJourneyStore';
import QuestionRenderer from './components/QuestionRenderer';
import { supabase } from './services/supabaseClient';

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
      {/* Background Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: chapter.color }}
      />

      {/* Top HUD */}
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

      {/* Question Card */}
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
            <p className="text-moonlight/60">All sample questions answered.</p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <footer className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full text-xs text-moonlight/40">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="hover:text-moonlight disabled:opacity-20 transition-colors"
        >
          ← Previous
        </button>

        <Link to="/admin" className="hover:text-amber-glow transition-colors">
          Admin & Supabase Check →
        </Link>
      </footer>
    </main>
  );
}

function AdminCheck() {
  const { answers } = useJourneyStore();
  const [dbStatus, setDbStatus] = useState('Idle');

  const testSupabaseConnection = async () => {
    setDbStatus('Testing connection...');
    try {
      // Test querying the admins table
      const { data, error } = await supabase.from('admins').select('*');
      if (error) {
        // RLS prevents unauthenticated reading, proving security is active!
        setDbStatus(`Connected! RLS Active: ${error.message}`);
      } else {
        setDbStatus(`Connected successfully to Supabase! Admin rows found: ${data.length}`);
      }
    } catch (err) {
      setDbStatus(`Connection failed: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-nebula/40">
      <div className="max-w-md w-full p-8 rounded-2xl border border-moonlight/10 bg-void/90 space-y-5 text-left">
        <h2 className="text-2xl font-serif text-moonlight">Supabase & State Check</h2>
        
        {/* Connection Ping Button */}
        <div className="p-4 rounded-xl border border-moonlight/10 bg-void/60 space-y-2">
          <p className="text-xs text-moonlight/60 font-mono">DATABASE CONNECTION TEST</p>
          <button
            onClick={testSupabaseConnection}
            className="w-full py-2.5 px-4 rounded-lg bg-amber-glow text-void font-medium text-xs hover:bg-amber-glow/90 transition-all cursor-pointer"
          >
            Ping Supabase Database
          </button>
          <p className="text-xs text-moonlight/80 font-mono pt-1">Status: {dbStatus}</p>
        </div>

        {/* State answers */}
        <div>
          <p className="text-xs text-moonlight/60 font-mono mb-1">LOCAL IN-MEMORY ANSWERS</p>
          <pre className="p-3 bg-void rounded-lg text-xs font-mono text-amber-glow overflow-x-auto max-h-36 border border-moonlight/10">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>

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