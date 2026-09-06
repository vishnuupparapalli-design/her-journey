/**
 * Master Audio Manager for "A Universe For Her"
 * Handles ambient sound, answer chimes, mute persistence, and autoplay unlock.
 */

const STORAGE_MUTE_KEY = 'journey_audio_muted';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem(STORAGE_MUTE_KEY) === 'true';
    this.unlocked = false;
    this.ambientGain = null;
    this.ambientOscillator = null;
  }

  // Initialize Web Audio context on her first interaction
  init() {
    if (this.unlocked) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.unlocked = true;
        this.startAmbientDrone();
      }
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  // Toggle Mute & save preference
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem(STORAGE_MUTE_KEY, String(this.isMuted));

    if (this.ambientGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.04;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2);
    }

    return this.isMuted;
  }

  // Soft celestial wind chime when answering a question
  playAnswerChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // Pentatonic cosmic frequencies (gentle, warm, and comforting)
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const randomFreq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(randomFreq * 1.5, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  // Chapter Transition Swell
  playChapterSwell() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.9);
    } catch (e) {
      console.warn('Swell error:', e);
    }
  }

  // Continuous quiet cosmic ambient drone
  startAmbientDrone() {
    if (!this.ctx || this.ambientOscillator) return;
    try {
      this.ambientOscillator = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOscillator.type = 'sine';
      this.ambientOscillator.frequency.setValueAtTime(110, this.ctx.currentTime); // Deep warm A2

      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);

      this.ambientOscillator.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOscillator.start();
    } catch (e) {
      console.warn('Ambient error:', e);
    }
  }
}

export const audioManager = new AudioManager();