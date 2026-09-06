import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useJourneyStore } from './state/useJourneyStore';
import QuestionRenderer from './components/QuestionRenderer';
import IdentityGate from './components/IdentityGate';
import { authenticateWithPassphrase, getCurrentRespondent, signOutRespondent } from './services/auth';
import { fetchRespondentAnswers } from './services/answers';

function JourneyExperience() {
  const {
    respondent,
    setRespondent,
    setInitialAnswers,
    currentIndex,
    getCurrentQuestion,
    getTotalQuestions,
    getCurrentChapter,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    skipQuestion,
    saveStatus,
    syncOfflineAnswers,
  } = useJourneyStore();

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState('');

  // Check if already signed in on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const active = await getCurrentRespondent();
        if (active) {
          setRespondent(active);
          const cloudAnswers = await fetchRespondentAnswers(active.user.id);
          setInitialAnswers(cloudAnswers);
        }
      } catch (e) {
        console.error('Session restore error:', e);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    checkAuth();

    // Listen for online event to flush offline queue
    const handleOnline = () => {
      syncOfflineAnswers();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const handleEnterUniverse = async (name, passphrase) => {
    setIsLoadingAuth(true);
    setAuthError('');
    try {
      const authenticated = await authenticateWithPassphrase(name, passphrase);
      setRespondent(authenticated);
      const cloudAnswers = await fetchRespondentAnswers(authenticated.user.id);
      setInitialAnswers(cloudAnswers);
    } catch (err) {
      setAuthError(err.message || 'Could not enter. Please check your credentials.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await signOutRespondent();
    setRespondent(null);
  };

  // If not signed in, show the Identity Gate
  if (!respondent) {
    return (
      <IdentityGate
        onEnter={handleEnterUniverse}
        isLoading={isLoadingAuth}
        errorMessage={authError}
      />
    );
  }

  const currentQ = getCurrentQuestion();
  const total = getTotalQuestions();
  const chapter = getCurrentChapter();
  const existingAnswer = currentQ ? answers[currentQ.id] : null;

  const handleSave = async (questionId, value) => {
    await setAnswer(questionId, value);
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

        <div className="flex items-center gap-4 text-right">
          {/* Cloud Save Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-moonlight/40">
            <span
              className={`w-2 h-2 rounded-full ${
                saveStatus === 'saving'
                  ? 'bg-amber-glow animate-ping'
                  : saveStatus === 'offline'
                  ? 'bg-amber-glow/60'
                  : 'bg-sage-mist'
              }`}
            />
            <span className="hidden sm:inline">
              {saveStatus === 'saving' ? 'Saving to cloud…' : saveStatus === 'offline' ? 'Offline (Queued)' : 'Saved'}
            </span>
          </div>

          <div>
            <span className="text-xs font-mono text-moonlight/40">
              {currentIndex + 1} of {total}
            </span>
            <div className="w-20 md:w-32 h-1 bg-moonlight/10 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-amber-glow transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Question Surface */}
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
            <p className="text-moonlight/60">All questions answered and permanently saved in Supabase!</p>
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

        <div className="flex items-center gap-4">
          <span className="text-moonlight/50 font-sans">
            Welcome, {respondent.displayName}
          </span>
          <button
            onClick={handleSignOut}
            className="hover:text-amber-glow transition-colors"
          >
            Change Passphrase
          </button>
          <Link to="/admin" className="hover:text-amber-glow transition-colors">
            Admin View →
          </Link>
        </div>
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
          Stage 4 verification: Answers currently synced in local memory:
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