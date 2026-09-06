import { questions } from '../data/questions';

/**
 * Extracts a structured Personalization Profile from all her answers
 */
export function extractPersonalization(answersMap = {}) {
  const profile = {};

  questions.forEach((q) => {
    if (q.personalizationKey && answersMap[q.id]) {
      profile[q.personalizationKey] = answersMap[q.id].value;
    }
  });

  return profile;
}

/**
 * Returns custom colors or labels based on her personalization choices
 */
export function getPersonalizedAesthetic(profile = {}) {
  let primaryTone = '#E8A857'; // Default Amber

  if (profile.topInterests && Array.isArray(profile.topInterests)) {
    if (profile.topInterests.includes('art')) primaryTone = '#7C6A9C';
    else if (profile.topInterests.includes('science')) primaryTone = '#4C8C86';
    else if (profile.topInterests.includes('travel')) primaryTone = '#7FA7C4';
  }

  return {
    primaryTone,
    hasChosenDream: Boolean(profile.chosenDream),
    dreamText: profile.chosenDream || '',
    rechargeStyle: profile.rechargeStyle || 'alone',
  };
}