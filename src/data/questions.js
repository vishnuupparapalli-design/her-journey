export const questions = [
  // --- Chapter 1: Arrival (Light & Fun) ---
  {
    id: 'ch01-q01',
    chapterId: 'arrival',
    order: 1,
    type: 'mood_select',
    text: 'How are you feeling right now, in this exact moment?',
    subtext: 'Take a breath. There is no right answer.',
    effect: 'light_shift',
    options: [
      { id: 'peaceful', label: 'Peaceful 🌙' },
      { id: 'curious', label: 'Curious ✨' },
      { id: 'tired', label: 'A little tired ☁️' },
      { id: 'thoughtful', label: 'Thoughtful 🌊' },
      { id: 'excited', label: 'Excited 💫' },
    ],
  },
  {
    id: 'ch01-q02',
    chapterId: 'arrival',
    order: 2,
    type: 'single_select',
    text: 'Morning person or night owl?',
    effect: 'particle_burst',
    options: [
      { id: 'morning', label: 'Early morning light' },
      { id: 'night', label: 'Deep quiet of the night' },
      { id: 'neither', label: 'Depends on the day' },
    ],
  },

  // --- Chapter 2: Reflections (Personality) ---
  {
    id: 'ch02-q01',
    chapterId: 'reflections',
    order: 3,
    type: 'single_select',
    text: "When you're overwhelmed, what helps most first?",
    effect: 'light_shift',
    options: [
      { id: 'talk', label: 'Talk it out immediately' },
      { id: 'space', label: 'Have quiet space first, then talk' },
      { id: 'distract', label: 'A comforting distraction' },
    ],
  },

  // --- Chapter 3: Wonders (Interests & Passions) ---
  {
    id: 'ch03-q01',
    chapterId: 'wonders',
    order: 4,
    type: 'multi_select',
    text: 'Pick every topic you could talk about for an hour without noticing time.',
    subtext: 'Select as many as you like.',
    effect: 'flowers_grow',
    personalizationKey: 'topInterests',
    options: [
      { id: 'art', label: 'Art, films, & storytelling' },
      { id: 'science', label: 'Science & how things work' },
      { id: 'travel', label: 'Travel & new places' },
      { id: 'food', label: 'Delicious food & recipes' },
      { id: 'music', label: 'Music & concerts' },
      { id: 'psych', label: 'Human behavior & thoughts' },
    ],
  },

  // --- Chapter 4: Us, So Far (Memories) ---
  {
    id: 'ch04-q01',
    chapterId: 'us_so_far',
    order: 5,
    type: 'free_text',
    text: "What's a small moment between us that you still think about?",
    subtext: 'No pressure. Write whatever comes to mind.',
    placeholder: 'A conversation, a smile, a shared quiet moment...',
    effect: 'cloud_shift',
  },

  // --- Chapter 5: Horizons (Dreams & Ambitions) ---
  {
    id: 'ch05-q01',
    chapterId: 'horizons',
    order: 6,
    type: 'free_text',
    text: "What's something you want to accomplish purely for yourself?",
    subtext: "Nothing to do with anyone else's expectations.",
    placeholder: 'Your personal ambition...',
    effect: 'camera_drift',
    personalizationKey: 'chosenDream',
  },

  // --- Chapter 6: Tides (Emotions) ---
  {
    id: 'ch06-q01',
    chapterId: 'tides',
    order: 7,
    type: 'mood_select',
    text: "When you're having a sad or hard day, what genuinely comforts you?",
    effect: 'light_shift',
    options: [
      { id: 'listening', label: 'Just listening without trying to fix it' },
      { id: 'distraction', label: 'Making me laugh / distraction' },
      { id: 'quiet_company', label: 'Quiet company, just existing together' },
      { id: 'alone_first', label: 'Alone time to process first' },
    ],
  },

  // --- Chapter 7: The Constellation (About Me) ---
  {
    id: 'ch07-q04',
    chapterId: 'constellation',
    order: 8,
    type: 'free_text',
    text: "What's something you think I could genuinely work on or grow in?",
    subtext: 'Honest critique is always welcome and valued here.',
    placeholder: 'Speak freely...',
    effect: 'stars_appear',
  },

  // --- Chapter 8: Two Paths, One Sky (Relationship) ---
  {
    id: 'ch08-q06',
    chapterId: 'two_paths',
    order: 9,
    type: 'two_path',
    text: 'When we disagree about something small, which feels healthier?',
    effect: 'choice_react',
    options: [
      { id: 'talk_now', label: 'Talk through it immediately' },
      { id: 'sleep_on_it', label: 'Take a breath, sleep on it, talk calmly later' },
    ],
  },

  // --- Chapter 9: The Distance Between (Long-Distance) ---
  {
    id: 'ch09-q02',
    chapterId: 'distance',
    order: 10,
    type: 'multi_select',
    text: 'What makes the distance feel a little lighter for you?',
    subtext: 'Select whatever helps most.',
    effect: 'galaxy_expand',
    options: [
      { id: 'calls', label: 'Late night calls' },
      { id: 'surprises', label: 'Unexpected sweet messages' },
      { id: 'countdown', label: 'A set date for our next visit' },
      { id: 'routines', label: 'Our shared little routines' },
      { id: 'gifts', label: 'Letters or small care packages' },
    ],
  },

  // --- Chapter 10: Thresholds (Boundaries) ---
  {
    id: 'ch10-q01',
    chapterId: 'thresholds',
    order: 11,
    type: 'slider',
    text: 'How much alone time do you need in a week to feel like yourself?',
    min: 1,
    max: 10,
    minLabel: 'A little bit',
    maxLabel: 'A lot of sacred space',
    effect: 'brighten',
  },

  // --- Chapter 11: Her Own Sky (Independent Life) ---
  {
    id: 'ch11-q01',
    chapterId: 'her_sky',
    order: 12,
    type: 'free_text',
    text: 'What kind of life do you want to build for yourself, entirely on your own terms?',
    placeholder: 'Your personal independence...',
    effect: 'object_float_in',
    personalizationKey: 'independentDream',
  },

  // --- Chapter 12: Building Together (Life With Me) ---
  {
    id: 'ch12-q03',
    chapterId: 'building',
    order: 13,
    type: 'single_select',
    text: 'When you imagine sharing a space together, what balance feels right?',
    effect: 'light_shift',
    options: [
      { id: 'intertwined', label: 'Shared daily routines and doing most things together' },
      { id: 'parallel', label: 'Lots of independent space alongside a shared life' },
      { id: 'blend', label: 'A natural, fluid blend of both' },
    ],
  },

  // --- Chapter 13: Weathering It (Difficult Situations) ---
  {
    id: 'ch13-q02',
    chapterId: 'weathering',
    order: 14,
    type: 'single_select',
    text: 'When we hit a misunderstanding, what do you need most from me?',
    effect: 'choice_react',
    options: [
      { id: 'patience', label: 'Patience and a calm voice' },
      { id: 'validation', label: 'Validation that my feelings make sense' },
      { id: 'solutions', label: 'Practical problem solving' },
      { id: 'hug', label: 'Reassurance that we are good no matter what' },
    ],
  },

  // --- Chapter 14: What's Ahead (Future & Deep Reflection) ---
  {
    id: 'ch14-q07',
    chapterId: 'whats_ahead',
    order: 15,
    type: 'star_rating',
    text: 'However you are feeling right now, how glad are you that we are figuring this out together?',
    subtext: 'No wrong answer.',
    maxStars: 5,
    effect: 'cinematic_beat',
  },
  {
    id: 'ch14-q10',
    chapterId: 'whats_ahead',
    order: 16,
    type: 'free_text',
    text: 'What do you want to remember about how you felt, answering all of this?',
    placeholder: 'Your closing thoughts...',
    effect: 'environment_transform',
  },
];