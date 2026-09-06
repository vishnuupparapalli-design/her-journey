import { supabase } from './supabaseClient';

/**
 * Saves her current checkpoint to Supabase
 */
export async function saveProgressToCloud({
  respondentId,
  currentChapterId,
  currentQuestionOrder,
  completedQuestionIds = [],
}) {
  if (!respondentId) return null;

  const payload = {
    respondent_id: respondentId,
    current_chapter_id: currentChapterId,
    current_question_order: currentQuestionOrder,
    completed_question_ids: completedQuestionIds,
    last_activity_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('progress')
    .upsert(payload, { onConflict: 'respondent_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving progress checkpoint:', error);
    return null;
  }

  return data;
}

/**
 * Fetches her last saved checkpoint when she returns
 */
export async function fetchProgressFromCloud(respondentId) {
  if (!respondentId) return null;

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('respondent_id', respondentId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = brand new user, no checkpoint yet
    console.error('Error fetching progress:', error);
  }

  return data || null;
}

/**
 * Resets her progress back to Chapter 1.
 * If clearAnswers is true, also deletes her answers table rows.
 */
export async function resetProgressInCloud(respondentId, clearAnswers = false) {
  if (!respondentId) return;

  // 1. Reset progress row to question 1
  await supabase
    .from('progress')
    .upsert({
      respondent_id: respondentId,
      current_chapter_id: 'arrival',
      current_question_order: 1,
      completed_question_ids: [],
      last_activity_at: new Date().toISOString(),
    }, { onConflict: 'respondent_id' });

  // 2. If she explicitly asked to clear previous answers, delete them
  if (clearAnswers) {
    await supabase
      .from('answers')
      .delete()
      .eq('respondent_id', respondentId);
  }
}