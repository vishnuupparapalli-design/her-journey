import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useJourneyStore } from './state/useJourneyStore';
import QuestionRenderer from './components/QuestionRenderer';
import IdentityGate from './components/IdentityGate';
import WelcomeBack from './components/WelcomeBack';
import RestartModal from './components/RestartModal';
import SceneManager from './scenes/SceneManager';
import CinematicEnding from './components/CinematicEnding';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import { authenticateWithPassphrase, getCurrentRespondent, signOutRespondent } from './services/auth';
import { fetchRespondentAnswers } from './services/answers';
import { fetchProgressFromCloud } from './services/progress';
import { audioManager } from './audio/AudioManager';
import { supabase } from './services/supabaseClient';

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
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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

          if (progress?.completed_at) {
            setIsCompleted(true);
          } else if (progress && progress.current_question_order > 1) {
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
    audioManager.init();
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

      if (progress?.completed_at) {
        setIsCompleted(true);
      } else if (progress && progress.current_question_order > 1) {
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
    audioManager.init();
    if (welcomeCheckpoint) {
      setCloudProgress(welcomeCheckpoint);
      setWelcomeCheckpoint(null);
    }
  };

  const handleStartOverFromWelcome = async () => {
    audioManager.init();
    setWelcomeCheckpoint(null);
    setIsCompleted(false);
    await restartJourney(false);
  };

  const handleConfirmRestart = async (clearAnswers) => {
    setShowRestartModal(false);
    setIsCompleted(false);
    await restartJourney(clearAnswers);
  };

  const handleSignOut = async () => {
    await signOutRespondent();
    setRespondent(null);
    setIsCompleted(false);
  };

  const toggleSound = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
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

  // On answer: Play chime, trigger effect, advance or complete
  const handleSave = async (questionId, value) => {
    audioManager.playAnswerChime();
    setIsTransitioning(true);
    await setAnswer(questionId, value);
    
    setTimeout(async () => {
      if (currentIndex >= total - 1) {
        // Grand finale triggered!
        setIsCompleted(true);
        if (respondent?.user?.id) {
          await supabase
            .from('progress')
            .update({ completed_at: new Date().toISOString() })
            .eq('respondent_id', respondent.user.id);
        }
      } else {
        nextQuestion();
      }
      setIsTransitioning(false);
    }, 700);
  };

  // If completed, render the Final Cinematic Ending!
  if (isCompleted) {
    return <CinematicEnding onRevisit={() => setIsCompleted(false)} />;
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-void text-moonlight select-none">
      <SceneManager
        chapterId={chapter.id}
        chapterOrder={chapter.order}
        reducedMotion={reducedMotion}
      />

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

          <div className="flex items-center gap-3 md:gap-4 text-right">
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute chimes' : 'Mute chimes'}
              className="p-2 rounded-full bg-void/50 backdrop-blur-md border border-moonlight/10 text-moonlight/70 hover:text-amber-glow hover:border-amber-glow/40 transition-all cursor-pointer text-xs"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

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
          {currentQ && (
            <QuestionRenderer
              question={currentQ}
              currentAnswer={existingAnswer}
              onSave={handleSave}
              onSkip={skipQuestion}
            />
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

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className="hover:text-amber-glow transition-colors cursor-pointer text-[11px] font-mono"
            >
              {reducedMotion ? 'Motion: Still' : 'Motion: Fluid'}
            </button>

            <span className="text-moonlight/20">·</span>

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

// Protected Admin Container
function AdminPortal() {
  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkCurrentAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('admins')
            .select('user_id')
            .eq('user_id', session.user.id);

          if (data && data.length > 0) {
            setAdminUser(session.user);
          }
        }
      } catch (e) {
        console.error('Admin check error:', e);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkCurrentAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E1A] text-xs font-mono text-[#EDEAE0]/40">
        Verifying security clearance...
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={setAdminUser} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0E1A] text-[#EDEAE0]">
      <Routes>
        <Route path="/" element={<JourneyExperience />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </div>
  );
}