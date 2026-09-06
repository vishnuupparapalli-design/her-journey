import { create } from 'zustand';
import { questions } from '../data/questions';
import { chapters } from '../data/chapters';
import { saveAnswerToCloud } from '../services/answers';
import { addToQueue, flushOfflineQueue } from './useOfflineQueue';

export const useJourneyStore = create((set, get) => ({
  // Respondent / Session State
  respondent: null, // { user, displayName }
  saveStatus: 'saved', // 'idle' | 'saving' | 'saved' | 'offline'

  // Navigation State
  currentIndex: 0,
  answers: {},

  // Getters
  getCurrentQuestion: () => questions[get().currentIndex],
  getTotalQuestions: () => questions.length,
  getCurrentChapter: () => {
    const q = questions[get().currentIndex];
    return chapters.find((c) => c.id === q?.chapterId) || chapters[0];
  },

  // Set respondent after authentication
  setRespondent: (respondent) => set({ respondent }),

  // Set answers initially fetched from cloud
  setInitialAnswers: (answersMap) => set({ answers: answersMap }),

  // Save answer to local state + Cloud + Offline Queue
  setAnswer: async (questionId, value) => {
    const state = get();
    const currentQ = state.getCurrentQuestion();
    const chapterId = currentQ?.chapterId || 'arrival';
    const answerType = currentQ?.type || 'unknown';

    // 1. Optimistic instant local update
    set((s) => ({
      answers: {
        ...s.answers,
        [questionId]: {
          value,
          answeredAt: new Date().toISOString(),
        },
      },
      saveStatus: 'saving',
    }));

    // 2. Cloud Save (if signed in)
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
        console.warn('Network error saving to cloud. Queueing offline:', err);
        addToQueue(payload);
        set({ saveStatus: 'offline' });
      }
    } else {
      set({ saveStatus: 'saved' });
    }
  },

  nextQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
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

  syncOfflineAnswers: async () => {
    const res = await flushOfflineQueue();
    if (res.flushed > 0) {
      set({ saveStatus: 'saved' });
    }
  },
}));