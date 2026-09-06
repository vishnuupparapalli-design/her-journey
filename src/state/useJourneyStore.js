import { create } from 'zustand';
import { questions } from '../data/questions';
import { chapters } from '../data/chapters';
import { saveAnswerToCloud } from '../services/answers';
import { saveProgressToCloud, resetProgressInCloud } from '../services/progress';
import { addToQueue, flushOfflineQueue } from './useOfflineQueue';
import { EFFECT_REGISTRY } from '../effects/registry';
import { extractPersonalization } from './usePersonalization';

export const useJourneyStore = create((set, get) => ({
  // Active 3D Effect
  activeEffect: null,

  // Respondent & Personalization Profile
  respondent: null,
  personalization: {},
  saveStatus: 'saved',

  // Navigation State
  currentIndex: 0,
  completedQuestions: [],
  answers: {},

  // Getters
  getCurrentQuestion: () => questions[get().currentIndex],
  getTotalQuestions: () => questions.length,
  getCurrentChapter: () => {
    const q = questions[get().currentIndex];
    return chapters.find((c) => c.id === q?.chapterId) || chapters[0];
  },

  triggerEffect: (effectId) => {
    const effect = EFFECT_REGISTRY[effectId] || EFFECT_REGISTRY.particle_burst;
    set({ activeEffect: effect });
  },

  clearActiveEffect: () => set({ activeEffect: null }),

  setRespondent: (respondent) => set({ respondent }),
  
  setInitialAnswers: (answersMap) => {
    const profile = extractPersonalization(answersMap);
    set({ answers: answersMap, personalization: profile });
  },

  setCloudProgress: (progressRow) => {
    if (!progressRow) return;
    const targetOrder = progressRow.current_question_order || 1;
    const targetIdx = Math.max(0, Math.min(questions.length - 1, targetOrder - 1));
    set({
      currentIndex: targetIdx,
      completedQuestions: progressRow.completed_question_ids || [],
      personalization: progressRow.personalization || {},
    });
  },

  // Save answer, update personalization, and save to Supabase
  setAnswer: async (questionId, value) => {
    const state = get();
    const currentQ = state.getCurrentQuestion();
    const chapterId = currentQ?.chapterId || 'arrival';
    const answerType = currentQ?.type || 'unknown';

    // 1. Play 3D effect
    state.triggerEffect(currentQ?.effect || 'particle_burst');

    // 2. Update local state & re-extract personalization
    const updatedAnswers = {
      ...state.answers,
      [questionId]: {
        value,
        answeredAt: new Date().toISOString(),
      },
    };
    const updatedCompleted = Array.from(new Set([...state.completedQuestions, questionId]));
    const updatedPersonalization = extractPersonalization(updatedAnswers);

    set({
      answers: updatedAnswers,
      completedQuestions: updatedCompleted,
      personalization: updatedPersonalization,
      saveStatus: 'saving',
    });

    // 3. Save Answer & Progress checkpoint to Supabase
    if (state.respondent?.user?.id) {
      const answerPayload = {
        respondentId: state.respondent.user.id,
        questionId,
        chapterId,
        answerValue: value,
        answerType,
      };

      try {
        await saveAnswerToCloud(answerPayload);
        set({ saveStatus: 'saved' });
      } catch (err) {
        console.warn('Network error. Queued offline:', err);
        addToQueue(answerPayload);
        set({ saveStatus: 'offline' });
      }
    } else {
      set({ saveStatus: 'saved' });
    }
  },

  nextQuestion: () => {
    const { currentIndex, respondent, completedQuestions, personalization } = get();
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      set({ currentIndex: nextIdx });

      if (respondent?.user?.id) {
        const nextQ = questions[nextIdx];
        saveProgressToCloud({
          respondentId: respondent.user.id,
          currentChapterId: nextQ?.chapterId || 'arrival',
          currentQuestionOrder: nextIdx + 1,
          completedQuestionIds: completedQuestions,
          personalization,
        });
      }
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  skipQuestion: () => {
    get().nextQuestion();
  },

  restartJourney: async (clearAnswers = false) => {
    const { respondent } = get();
    set({
      currentIndex: 0,
      completedQuestions: [],
      personalization: {},
      ...(clearAnswers ? { answers: {} } : {}),
    });

    if (respondent?.user?.id) {
      await resetProgressInCloud(respondent.user.id, clearAnswers);
    }
  },

  syncOfflineAnswers: async () => {
    const res = await flushOfflineQueue();
    if (res.flushed > 0) {
      set({ saveStatus: 'saved' });
    }
  },
}));