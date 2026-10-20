// Web Audio API Synthesizer with Sound Pack Support
import { SoundPack } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentPack: SoundPack = 'duolingo';

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setSoundPack(pack: SoundPack) {
    this.currentPack = pack;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.currentPack === 'retro-8bit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.03); // E6
      } else if (this.currentPack === 'arcade-synth') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.06);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      }

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // ignore
    }
  }

  /**
   * Crisp, bubbly click/pop sound for notification popups and messages
   */
  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Quick pitch swoop upwards gives the classic high-clarity bubble/pop effect
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1250, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const isRetro = this.currentPack === 'retro-8bit';
      const isSynth = this.currentPack === 'arcade-synth';

      const notes = isRetro
        ? [440, 554.37, 659.25, 880] // A4, C#5, E5, A5 8-bit fanfare
        : [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const duration = isRetro ? 0.08 : 0.12;

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + index * (isRetro ? 0.06 : 0.08);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isRetro ? 'square' : isSynth ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      });
    } catch {
      // ignore
    }
  }

  public playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const isRetro = this.currentPack === 'retro-8bit';
      const notes = isRetro ? [220, 164.81] : [349.23, 277.18]; // Low buzz
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + index * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isRetro ? 'square' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.18);
      });
    } catch {
      // ignore
    }
  }

  public playMatch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [880, 1174.66];
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + index * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = this.currentPack === 'retro-8bit' ? 'square' : 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.16, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch {
      // ignore
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chords = [
        { freqs: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },
        { freqs: [587.33, 739.99, 880.0], time: 0.22, dur: 0.2 },
        { freqs: [659.25, 830.61, 987.77], time: 0.44, dur: 0.2 },
        { freqs: [1046.5, 1318.51, 1567.98], time: 0.68, dur: 0.5 },
      ];

      chords.forEach(({ freqs, time, dur }) => {
        if (!this.ctx) return;
        const chordStartTime = this.ctx.currentTime + time;
        freqs.forEach(freq => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = this.currentPack === 'retro-8bit' ? 'square' : 'triangle';
          osc.frequency.setValueAtTime(freq, chordStartTime);

          gain.gain.setValueAtTime(0.1, chordStartTime);
          gain.gain.exponentialRampToValueAtTime(0.001, chordStartTime + dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(chordStartTime);
          osc.stop(chordStartTime + dur);
        });
      });
    } catch {
      // ignore
    }
  }

  /**
   * Synthesize a cute playful Black Cat "Meow"
   */
  public playMeow() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch glide: start low (~520Hz) -> swell up (~880Hz) -> sweet tail (~660Hz)
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.32);

      // Volume envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // ignore
    }
  }

  /**
   * Synthesize a warm purring vibration
   */
  public playPurr() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      osc.frequency.linearRampToValueAtTime(85, now + 0.4);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // ignore
    }
  }

  /**
   * High-dopamine combo streak sound: ascending pitch chime
   */
  public playCombo(comboCount: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const baseFreq = 440; // A4
      const scaleSteps = [0, 2, 4, 7, 9, 12, 14, 16]; // Major pentatonic steps
      const step = scaleSteps[Math.min(comboCount - 1, scaleSteps.length - 1)];
      const freq = baseFreq * Math.pow(2, step / 12);

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.currentPack === 'retro-8bit' ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
