import { saveAnswerToCloud } from '../services/answers';

const STORAGE_KEY = 'journey_offline_queue';

export function getQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToQueue(item) {
  const current = getQueue();
  // Filter out any older pending save for the exact same question to keep queue small
  const filtered = current.filter((q) => q.questionId !== item.questionId);
  filtered.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearItemFromQueue(questionId) {
  const current = getQueue();
  const filtered = current.filter((q) => q.questionId !== questionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Flushes all pending queued answers to Supabase
 */
export async function flushOfflineQueue() {
  const queue = getQueue();
  if (queue.length === 0) return { flushed: 0 };

  let successCount = 0;

  for (const item of queue) {
    try {
      await saveAnswerToCloud(item);
      clearItemFromQueue(item.questionId);
      successCount++;
    } catch (err) {
      console.warn(`Could not sync question ${item.questionId} yet:`, err);
      // Stop and wait for next connection cycle
      break;
    }
  }

  return { flushed: successCount, remaining: getQueue().length };
}