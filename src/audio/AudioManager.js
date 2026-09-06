/**
 * Master Audio Manager for "A Universe For Her"
 * Plays crystalline celestial chimes on answer confirms. 
 * Continuous background drone is removed for pure, crack-free silence between answers.
 */

const STORAGE_MUTE_KEY = 'journey_audio_muted';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem(STORAGE_MUTE_KEY) === 'true';
    this.unlocked = false;
  }

  init() {
    if (this.unlocked && this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.unlocked = true;
      }
    } catch (e) {
      console.warn('Audio init error:', e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem(STORAGE_MUTE_KEY, String(this.isMuted));
    return this.isMuted;
  }

  // The beloved Celestial Starlight Chime when she answers!
  playAnswerChime() {
    if (this.isMuted) return;
    this.init();

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      // Warm, crystalline harmonic frequencies (Pentatonic starlight)
      const notes = [523.25, 659.25, 783.99, 880.0, 1046.5]; // C5, E5, G5, A5, C6
      const freq = notes[Math.floor(Math.random() * notes.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Smooth attack and natural chime decay (Clean & audible!)
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.025); // Clear, pleasant volume
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      gain.gain.linearRampToValueAtTime(0, now + 1.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  playChapterSwell() {
    this.playAnswerChime();
  }
}

export const audioManager = new AudioManager();