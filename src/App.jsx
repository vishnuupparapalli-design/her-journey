import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useJourneyStore } from './state/useJourneyStore';
import QuestionRenderer from './components/QuestionRenderer';
import IdentityGate from './components/IdentityGate';
import WelcomeBack from './components/WelcomeBack';
import RestartModal from './components/RestartModal';
import SceneManager from './scenes/SceneManager';
import { authenticateWithPassphrase, getCurrentRespondent, signOutRespondent } from './services/auth';
import { fetchRespondentAnswers } from './services/answers';
import { fetchProgressFromCloud } from './services/progress';

function JourneyExperience() {
  const {
    respondent,
    setRespondent,
    setInitialAnswers,
    setCloudProgress,
    currentIndex,
    getCurrentQuestion,
    getTotalQuestions,
    getCurrentChapter,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    skipQuestion,
    restartJourney,
    saveStatus,
    syncOfflineAnswers,
  } = useJourneyStore();

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const [welcomeCheckpoint, setWelcomeCheckpoint] = useState(null);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const active = await getCurrentRespondent();
        if (active) {
          setRespondent(active);
          const [cloudAnswers, progress] = await Promise.all([
            fetchRespondentAnswers(active.user.id),
            fetchProgressFromCloud(active.user.id),
          ]);
          setInitialAnswers(cloudAnswers);

          if (progress && progress.current_question_order > 1) {
            setWelcomeCheckpoint(progress);
          } else if (progress) {
            setCloudProgress(progress);
          }
        }
      } catch (e) {
        console.error('Session restore error:', e);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    restoreSession();

    const handleOnline = () => syncOfflineAnswers();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const handleEnterUniverse = async (name, passphrase) => {
    setIsLoadingAuth(true);
    setAuthError('');
    try {
      const authenticated = await authenticateWithPassphrase(name, passphrase);
      setRespondent(authenticated);
      const [cloudAnswers, progress] = await Promise.all([
        fetchRespondentAnswers(authenticated.user.id),
        fetchProgressFromCloud(authenticated.user.id),
      ]);
      setInitialAnswers(cloudAnswers);

      if (progress && progress.current_question_order > 1) {
        setWelcomeCheckpoint(progress);
      } else if (progress) {
        setCloudProgress(progress);
      }
    } catch (err) {
      setAuthError(err.message || 'Could not enter. Please check your credentials.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleResumeCheckpoint = () => {
    if (welcomeCheckpoint) {
      setCloudProgress(welcomeCheckpoint);
      setWelcomeCheckpoint(null);
    }
  };

  const handleStartOverFromWelcome = async () => {
    setWelcomeCheckpoint(null);
    await restartJourney(false);
  };

  const handleConfirmRestart = async (clearAnswers) => {
    setShowRestartModal(false);
    await restartJourney(clearAnswers);
  };

  const handleSignOut = async () => {
    await signOutRespondent();
    setRespondent(null);
  };

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

  // Answers trigger the 3D effect, pause briefly to enjoy the reaction, then advance!
  const handleSave = async (questionId, value) => {
    setIsTransitioning(true);
    await setAnswer(questionId, value);
    
    setTimeout(() => {
      nextQuestion();
      setIsTransitioning(false);
    }, 700);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-void text-moonlight select-none">
      {/* 1. THE 3D BACKGROUND WORLD WITH EFFECT MANAGER */}
      <SceneManager
        chapterId={chapter.id}
        chapterOrder={chapter.order}
      />

      {/* 2. THE UI OVERLAY */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6 md:p-10 pointer-events-none">
        {welcomeCheckpoint && (
          <div className="pointer-events-auto">
            <WelcomeBack
              displayName={respondent.displayName}
              chapterTitle={chapter.title}
              questionNumber={welcomeCheckpoint.current_question_order}
              onResume={handleResumeCheckpoint}
              onStartOver={handleStartOverFromWelcome}
            />
          </div>
        )}

        <div className="pointer-events-auto">
          <RestartModal
            isOpen={showRestartModal}
            onClose={() => setShowRestartModal(false)}
            onConfirm={handleConfirmRestart}
          />
        </div>

        {/* Top HUD */}
        <header className="flex items-center justify-between max-w-4xl mx-auto w-full pointer-events-auto">
          <div>
            <span
              className="text-xs tracking-widest uppercase font-mono transition-colors duration-500"
              style={{ color: chapter.color }}
            >
              Chapter {chapter.order} · {chapter.subtitle}
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-light text-moonlight drop-shadow-md">
              {chapter.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-moonlight/60 bg-void/40 backdrop-blur-md px-3 py-1 rounded-full border border-moonlight/10">
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
                {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'offline' ? 'Offline' : 'Saved'}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono text-moonlight/50">
                {currentIndex + 1} of {total}
              </span>
              <div className="w-20 md:w-32 h-1 bg-moonlight/15 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-amber-glow transition-all duration-300 rounded-full shadow-[0_0_8px_#E8A857]"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Question Surface */}
        <div className={`my-auto py-8 pointer-events-auto transition-opacity duration-300 ${isTransitioning ? 'opacity-70 scale-[0.99]' : 'opacity-100 scale-100'}`}>
          {currentQ ? (
            <QuestionRenderer
              question={currentQ}
              currentAnswer={existingAnswer}
              onSave={handleSave}
              onSkip={skipQuestion}
            />
          ) : (
            <div className="text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-nebula/60 backdrop-blur-xl border border-moonlight/10">
              <h2 className="text-3xl font-serif text-moonlight">End of Journey Preview</h2>
              <p className="text-moonlight/60 text-sm">All questions answered.</p>
            </div>
          )}
        </div>

        {/* Bottom Footer Controls */}
        <footer className="flex items-center justify-between max-w-4xl mx-auto w-full text-xs text-moonlight/50 pointer-events-auto bg-void/30 backdrop-blur-sm px-4 py-2 rounded-full border border-moonlight/5">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="hover:text-moonlight disabled:opacity-20 transition-colors cursor-pointer"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRestartModal(true)}
              className="hover:text-amber-glow transition-colors cursor-pointer"
            >
              Start over
            </button>

            <span className="text-moonlight/20">·</span>

            <button
              onClick={handleSignOut}
              className="hover:text-amber-glow transition-colors cursor-pointer"
            >
              Switch traveler
            </button>

            <span className="text-moonlight/20">·</span>

            <Link to="/admin" className="hover:text-amber-glow transition-colors">
              Admin →
            </Link>
          </div>
        </footer>
      </div>
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
          Stage 8 verification: Answers in memory:
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