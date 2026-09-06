/**
 * Master Audio Manager for "A Universe For Her"
 * Optimized with smooth attack/decay curves to eliminate mobile speaker popping.
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
      console.warn('Web Audio not initialized:', e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem(STORAGE_MUTE_KEY, String(this.isMuted));

    if (this.ambientGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.02;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2);
    }

    return this.isMuted;
  }

  // Pure, silky celestial wind chime (Engineered specifically for phone speakers)
  playAnswerChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      // Warm, crystalline harmonic frequencies
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Soft lowpass filter to remove harsh phone distortion
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.8);

      // SILKY ATTACK CURVE: Starts at 0.0001, fades up smoothly in 35ms (No clicks/cracks!)
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.035);
      // Soft exponential decay
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
      gain.gain.linearRampToValueAtTime(0, now + 1.0);

      // Connect nodes: Oscillator -> Filter -> Gain -> Speakers
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.05);
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  // Soft Chapter Swell
  playChapterSwell() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 1.2);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) {
      console.warn('Swell error:', e);
    }
  }

  // Gentle, warm ambient tone (softened for mobile)
  startAmbientDrone() {
    if (!this.ctx || this.ambientOscillator) return;
    try {
      this.ambientOscillator = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOscillator.type = 'sine';
      this.ambientOscillator.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3 warm tone

      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.02, this.ctx.currentTime);

      this.ambientOscillator.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOscillator.start();
    } catch (e) {
      console.warn('Ambient drone error:', e);
    }
  }
}

export const audioManager = new AudioManager();