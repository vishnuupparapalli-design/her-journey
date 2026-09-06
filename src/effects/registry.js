/**
 * Master Registry of All 17 Visual Effects
 * Each effect has a duration (in seconds) and a color personality.
 */
export const EFFECT_REGISTRY = {
  particle_burst: {
    id: 'particle_burst',
    duration: 1.2,
    color: '#E8A857',
    description: 'A soft stardust burst radiating outward',
  },
  light_shift: {
    id: 'light_shift',
    duration: 1.4,
    color: '#D4AF6A',
    description: 'Ambient lighting warms and pulses',
  },
  stars_appear: {
    id: 'stars_appear',
    duration: 1.5,
    color: '#EDEAE0',
    description: 'Fresh glittering stars fade in nearby',
  },
  flowers_grow: {
    id: 'flowers_grow',
    duration: 1.4,
    color: '#8FB39B',
    description: 'Botanical light buds scale up gracefully',
  },
  choice_react: {
    id: 'choice_react',
    duration: 1.3,
    color: '#7C6A9C',
    description: 'Dual light ribbons pulse outward',
  },
  object_float_in: {
    id: 'object_float_in',
    duration: 1.6,
    color: '#E8A857',
    description: 'A glowing celestial keepsake floats into orbit',
  },
  cinematic_beat: {
    id: 'cinematic_beat',
    duration: 2.2,
    color: '#E8A857',
    description: 'Camera push-in with expanding shockwave of starlight',
  },
  cloud_shift: {
    id: 'cloud_shift',
    duration: 1.4,
    color: '#B77B4A',
    description: 'Cosmic nebula clouds drift and shift tone',
  },
  brighten: {
    id: 'brighten',
    duration: 1.5,
    color: '#EDEAE0',
    description: 'The exposure of the entire world warms up',
  },
  camera_drift: {
    id: 'camera_drift',
    duration: 1.8,
    color: '#D4AF6A',
    description: 'Smooth panoramic camera glide',
  },
  galaxy_expand: {
    id: 'galaxy_expand',
    duration: 1.6,
    color: '#7FA7C4',
    description: 'The surrounding galaxy expands gently outward',
  },
  path_unlock: {
    id: 'path_unlock',
    duration: 1.5,
    color: '#7C6A9C',
    description: 'A luminous path ribbon unrolls ahead',
  },
  portal_open: {
    id: 'portal_open',
    duration: 1.8,
    color: '#EDEAE0',
    description: 'A luminous portal ring expands with light',
  },
  text_materialize: {
    id: 'text_materialize',
    duration: 1.5,
    color: '#D4AF6A',
    description: 'Her thoughts ripple into a halo of light',
  },
  environment_transform: {
    id: 'environment_transform',
    duration: 2.5,
    color: '#E8A857',
    description: 'The world begins its grand cinematic transition',
  },
};