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
  {
    id: 'ch02-q04',
    chapterId: 'reflections',
    order: 4,
    type: 'ranking',
    text: 'Rank how you recharge, from most helpful to least:',
    subtext: 'Use the arrows to put them in your true order.',
    effect: 'object_float_in',
    personalizationKey: 'rechargeStyle',
    options: [
      { id: 'alone', label: 'Quiet alone time' },
      { id: 'friends', label: 'Laughing with close people' },
      { id: 'nature', label: 'Being outside in nature' },
      { id: 'creative', label: 'Making something / creative projects' },
      { id: 'sleep', label: 'Deep, uninterrupted sleep' },
    ],
  },

  // --- Chapter 3: Wonders (Interests & Passions) ---
  {
    id: 'ch03-q01',
    chapterId: 'wonders',
    order: 5,
    type: 'multi_select',
    text: 'Pick every topic you could talk about for an hour without noticing the time.',
    subtext: 'Select as many as you like.',
    effect: 'flowers_grow',
    personalizationKey: 'topInterests',
    options: [
      { id: 'art', label: 'Art, films, & storytelling' },
      { id: 'science', label: 'Science & how the world works' },
      { id: 'travel', label: 'Travel & cultures' },
      { id: 'food', label: 'Cooking & delicious food' },
      { id: 'music', label: 'Music & playlists' },
      { id: 'psych', label: 'Human psychology & behavior' },
    ],
  },

  // --- Chapter 4: Us, So Far (Memories) ---
  {
    id: 'ch04-q01',
    chapterId: 'us_so_far',
    order: 6,
    type: 'free_text',
    text: "What's a small moment between us that you still think about?",
    subtext: 'No pressure at all. Write whatever comes to mind.',
    placeholder: 'A conversation, a joke, a quiet moment...',
    effect: 'cloud_shift',
  },

  // --- Chapter 5: Horizons (Dreams & Ambitions) ---
  {
    id: 'ch05-q01',
    chapterId: 'horizons',
    order: 7,
    type: 'free_text',
    text: "What's something you want to accomplish that has nothing to do with anyone else's expectations?",
    subtext: 'Purely for you.',
    placeholder: 'Your personal dream...',
    effect: 'camera_drift',
    personalizationKey: 'chosenDream',
  },

  // --- Chapter 6: Tides (Emotions) ---
  {
    id: 'ch06-q01',
    chapterId: 'tides',
    order: 8,
    type: 'mood_select',
    text: "When you're having a sad or hard day, what feels most comforting?",
    effect: 'light_shift',
    options: [
      { id: 'listening', label: 'Just listening without fixing' },
      { id: 'distraction', label: 'Making me laugh / distraction' },
      { id: 'quiet_company', label: 'Quiet company, just existing together' },
      { id: 'alone_first', label: 'Alone time to process first' },
    ],
  },

  // --- Chapter 7: The Constellation (About Me) ---
  {
    id: 'ch07-q01',
    chapterId: 'constellation',
    order: 9,
    type: 'free_text',
    text: "What's something about me you think I don't fully realize?",
    placeholder: 'Honest thought...',
    effect: 'stars_appear',
  },
  {
    id: 'ch07-q04',
    chapterId: 'constellation',
    order: 10,
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
    order: 11,
    type: 'two_path',
    text: 'When we disagree about something small, which feels healthier to you?',
    effect: 'choice_react',
    options: [
      { id: 'talk_now', label: 'Talk through it immediately' },
      { id: 'sleep_on_it', label: 'Take a breath, sleep on it, talk calmly later' },
    ],
  },
];