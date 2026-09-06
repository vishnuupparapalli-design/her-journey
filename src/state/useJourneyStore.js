import { create } from 'zustand';
import { questions } from '../data/questions';
import { chapters } from '../data/chapters';
import { saveAnswerToCloud } from '../services/answers';
import { saveProgressToCloud, resetProgressInCloud } from '../services/progress';
import { addToQueue, flushOfflineQueue } from './useOfflineQueue';
import { EFFECT_REGISTRY } from '../effects/registry';

export const useJourneyStore = create((set, get) => ({
  // Active 3D Effect
  activeEffect: null,

  // Respondent / Session State
  respondent: null,
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

  // Trigger an effect by ID from registry
  triggerEffect: (effectId) => {
    const effect = EFFECT_REGISTRY[effectId] || EFFECT_REGISTRY.particle_burst;
    set({ activeEffect: effect });
  },

  clearActiveEffect: () => set({ activeEffect: null }),

  setRespondent: (respondent) => set({ respondent }),
  setInitialAnswers: (answersMap) => set({ answers: answersMap }),

  setCloudProgress: (progressRow) => {
    if (!progressRow) return;
    const targetOrder = progressRow.current_question_order || 1;
    const targetIdx = Math.max(0, Math.min(questions.length - 1, targetOrder - 1));
    set({
      currentIndex: targetIdx,
      completedQuestions: progressRow.completed_question_ids || [],
    });
  },

  setAnswer: async (questionId, value) => {
    const state = get();
    const currentQ = state.getCurrentQuestion();
    const chapterId = currentQ?.chapterId || 'arrival';
    const answerType = currentQ?.type || 'unknown';

    // 1. Play the question's registered 3D effect!
    if (currentQ?.effect) {
      state.triggerEffect(currentQ.effect);
    } else {
      state.triggerEffect('particle_burst');
    }

    // 2. Local state update
    const updatedCompleted = Array.from(new Set([...state.completedQuestions, questionId]));
    set((s) => ({
      answers: {
        ...s.answers,
        [questionId]: {
          value,
          answeredAt: new Date().toISOString(),
        },
      },
      completedQuestions: updatedCompleted,
      saveStatus: 'saving',
    }));

    // 3. Cloud Save
    if (state.respondent?.user?.id) {
      const payload = {
        respondentId: state.respondent.user.id,
        questionId,
        chapterId,
        answerValue: value,
        answerType,
      };

      try {
        await saveAnswerToCloud(payload);
        set({ saveStatus: 'saved' });
      } catch (err) {
        console.warn('Network error saving answer. Queued offline:', err);
        addToQueue(payload);
        set({ saveStatus: 'offline' });
      }
    } else {
      set({ saveStatus: 'saved' });
    }
  },

  nextQuestion: () => {
    const { currentIndex, respondent, completedQuestions } = get();
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