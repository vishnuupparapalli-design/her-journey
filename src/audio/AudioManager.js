/**
 * Master Audio Manager for "A Universe For Her"
 * Uses pre-rendered high-definition crystal chime buffers for crystal-clear, loud, crack-free mobile audio.
 */

const STORAGE_MUTE_KEY = 'journey_audio_muted';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem(STORAGE_MUTE_KEY) === 'true';
    this.unlocked = false;
    this.chimeBuffers = [];
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
        // Pre-bake our studio crystal bell chimes into memory
        this.generateStudioChimes();
      }
    } catch (e) {
      console.warn('Audio init error:', e);
    }
  }

  // Pre-bakes 3 rich, crystal-clear, harmonic bell chime buffers
  generateStudioChimes() {
    if (!this.ctx || this.chimeBuffers.length > 0) return;

    const sampleRate = this.ctx.sampleRate;
    const duration = 1.8; // 1.8 seconds of natural harmonic ring
    const frequencies = [659.25, 880.0, 1046.5]; // E5, A5, C6 (Celestial Chord)

    frequencies.forEach((baseFreq) => {
      const frameCount = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;

        // Rich harmonic overtones (Fundamental + 2nd Octave + Shimmering 3rd)
        const fundamental = Math.sin(2 * Math.PI * baseFreq * t) * 0.55;
        const secondHarmonic = Math.sin(2 * Math.PI * baseFreq * 2.01 * t) * 0.25;
        const shimmer = Math.sin(2 * Math.PI * baseFreq * 3.02 * t) * 0.15;

        // Pure organic bell decay (exponential fade to silence)
        const decay = Math.exp(-3.2 * t);

        // Smooth 15ms zero-crossing attack (Guarantees 0 clicks or cracks on mobile!)
        const attack = Math.min(1, t / 0.015);

        // Full, rich, clear volume (0.75 amplitude)
        data[i] = (fundamental + secondHarmonic + shimmer) * decay * attack * 0.75;
      }

      this.chimeBuffers.push(buffer);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem(STORAGE_MUTE_KEY, String(this.isMuted));
    return this.isMuted;
  }

  // Plays a loud, crystal-clear celestial starlight chime with ZERO lag or popping
  playAnswerChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // If buffers haven't generated yet, generate now
      if (this.chimeBuffers.length === 0) {
        this.generateStudioChimes();
      }

      if (this.chimeBuffers.length === 0) return;

      // Pick one of the harmonic chimes
      const buffer = this.chimeBuffers[Math.floor(Math.random() * this.chimeBuffers.length)];
      const source = this.ctx.createBufferSource();
      const gainNode = this.ctx.createGain();

      source.buffer = buffer;

      // Full, satisfying, clear volume
      gainNode.gain.setValueAtTime(0.85, this.ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      source.start(0);
    } catch (e) {
      console.warn('Chime playback error:', e);
    }
  }
}

export const audioManager = new AudioManager();