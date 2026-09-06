import { supabase } from './supabaseClient';

/**
 * Permanently saves an answer to Supabase.
 * Uses upsert so retrying the same question overwrites the existing answer without duplicating rows.
 */
export async function saveAnswerToCloud({
  respondentId,
  questionId,
  chapterId,
  answerValue,
  answerType,
}) {
  if (!respondentId || !questionId) {
    throw new Error('Missing respondentId or questionId');
  }

  const row = {
    respondent_id: respondentId,
    question_id: questionId,
    chapter_id: chapterId,
    answer_value: answerValue,
    answer_type: answerType,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('answers')
    .upsert(row, { onConflict: 'respondent_id,question_id' })
    .select();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Fetches all answers she has answered so far (useful when resuming).
 */
export async function fetchRespondentAnswers(respondentId) {
  if (!respondentId) return {};

  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('respondent_id', respondentId);

  if (error) {
    console.error('Error fetching answers:', error);
    return {};
  }

  const map = {};
  data.forEach((row) => {
    map[row.question_id] = {
      value: row.answer_value,
      answeredAt: row.updated_at,
    };
  });

  return map;
}