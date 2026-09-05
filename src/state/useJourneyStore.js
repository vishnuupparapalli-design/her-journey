import { create } from 'zustand';
import { questions } from '../data/questions';
import { chapters } from '../data/chapters';

export const useJourneyStore = create((set, get) => ({
  // Navigation state
  currentIndex: 0,
  answers: {}, // Keyed by questionId: { value, answeredAt }
  
  // Getters
  getCurrentQuestion: () => questions[get().currentIndex],
  getTotalQuestions: () => questions.length,
  getCurrentChapter: () => {
    const q = questions[get().currentIndex];
    return chapters.find((c) => c.id === q?.chapterId) || chapters[0];
  },

  // Actions
  setAnswer: (questionId, value) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          value,
          answeredAt: new Date().toISOString(),
        },
      },
    }));
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
    // She can skip any question with zero penalty
    get().nextQuestion();
  },

  goToQuestion: (index) => {
    if (index >= 0 && index < questions.length) {
      set({ currentIndex: index });
    }
  },

  resetJourney: () => {
    set({ currentIndex: 0, answers: {} });
  },
}));