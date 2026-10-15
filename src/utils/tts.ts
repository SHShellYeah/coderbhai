// Web Speech API Text-to-Speech Engine with Bengali and English Voice Support
import { Language } from '../types';

type TTSListener = (isPlaying: boolean, activeText: string | null) => void;

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isCurrentlyPlaying: boolean = false;
  private activeText: string | null = null;
  private listeners: Set<TTSListener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices();
    } catch {
      this.voices = [];
    }
  }

  public subscribe(listener: TTSListener): () => void {
    this.listeners.add(listener);
    listener(this.isCurrentlyPlaying, this.activeText);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isCurrentlyPlaying, this.activeText));
  }

  public isSpeaking(): boolean {
    return this.isCurrentlyPlaying;
  }

  public getActiveText(): string | null {
    return this.activeText;
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }
    this.isCurrentlyPlaying = false;
    this.activeText = null;
    this.notify();
  }

  /**
   * Pre-cleans text for natural speech synthesis:
   * Strips markdown fences, code syntax, symbols, and emojis so it sounds conversational.
   */
  private cleanTextForSpeech(rawText: string, lang: Language): string {
    let clean = rawText
      // Remove multi-line code blocks
      .replace(/```[\s\S]*?```/g, lang === 'bn' ? ' [কোড দেখে নিন] ' : ' [code snippet] ')
      // Inline code quotes `xyz` -> xyz
      .replace(/`([^`]+)`/g, '$1')
      // Markdown formatting: bold, italic, headings
      .replace(/[#*_~>]/g, ' ')
      // Common emojis
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      // HTML tags if any
      .replace(/<[^>]+>/g, ' ')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  /**
   * Discovers the sweetest, soft-spoken female anime-style voice available.
   * Strictly filters out deep male voices (David, Mark, Guy, Ryan, George, etc.)
   */
  private findSoftAnimeFemaleVoice(lang: Language): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const MALE_NAMES_REGEX = /\b(david|mark|george|guy|ryan|ravi|stefan|richard|james|john|paul|michael|brian|bashkar|pradeep)\b/i;

    if (lang === 'bn') {
      const bnVoices = this.voices.filter(
        v =>
          v.lang.toLowerCase().startsWith('bn') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
      );

      // Prefer non-male Bengali voice (e.g. Google বাংলা)
      const bnFemale = bnVoices.find(
        v =>
          !MALE_NAMES_REGEX.test(v.name) &&
          (v.name.toLowerCase().includes('female') ||
           v.name.toLowerCase().includes('tanisha') ||
           v.name.toLowerCase().includes('google') ||
           v.name.toLowerCase().includes('online'))
      );
      if (bnFemale) return bnFemale;

      if (bnVoices.length > 0) return bnVoices[0];
    }

    // English / Anime dub female voice selection:
    // Ranked list of preferred female voices known for sweet, gentle, anime-like dub tones:
    const PREFERRED_FEMALE_VOICES = [
      'jenny',      // Microsoft Jenny (Natural) - very sweet, soft anime dub tone
      'aria',       // Microsoft Aria (Natural) - cheerful, pleasant heroine feel
      'zira',       // Microsoft Zira Desktop - classic gentle female voice on Windows
      'ava',        // Microsoft Ava (Natural)
      'ana',        // Microsoft Ana (Natural)
      'samantha',   // Apple Samantha - clean, gentle female
      'victoria',   // Apple Victoria
      'karen',      // Apple Karen
      'hazel',      // Microsoft Hazel
      'sonia',      // Microsoft Sonia
      'neerja',     // Microsoft Neerja
      'google us english female',
      'google uk english female',
      'google us english',
      'female'
    ];

    const enVoices = this.voices.filter(v => v.lang.toLowerCase().startsWith('en'));

    // 1. Try to find one of the preferred sweet female voices
    for (const name of PREFERRED_FEMALE_VOICES) {
      const match = enVoices.find(
        v => v.name.toLowerCase().includes(name) && !MALE_NAMES_REGEX.test(v.name)
      );
      if (match) return match;
    }

    // 2. Fallback: Any English voice that is NOT male
    const nonMaleVoices = enVoices.filter(v => !MALE_NAMES_REGEX.test(v.name));
    if (nonMaleVoices.length > 0) {
      return nonMaleVoices[0];
    }

    // 3. Fallback: Any voice that is not male
    const anyNonMale = this.voices.filter(v => !MALE_NAMES_REGEX.test(v.name));
    if (anyNonMale.length > 0) {
      return anyNonMale[0];
    }

    return this.voices[0] || null;
  }

  public speak(
    text: string,
    lang: Language = 'en',
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (!this.synth || !text.trim()) return;

    // Toggle off if currently reading this same text
    if (this.isCurrentlyPlaying && this.activeText === text) {
      this.stop();
      return;
    }

    this.stop();

    const clean = this.cleanTextForSpeech(text, lang);
    if (!clean) return;

    try {
      // Ensure voices are loaded
      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      this.currentUtterance = utterance;
      this.activeText = text;
      this.isCurrentlyPlaying = true;
      this.notify();

      const femaleVoice = this.findSoftAnimeFemaleVoice(lang);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      if (lang === 'bn') {
        utterance.lang = 'bn-BD';
        // Sweet, gentle anime companion pitch & pace for Bengali
        utterance.rate = 0.94;
        utterance.pitch = 1.20;
      } else {
        utterance.lang = 'en-US';
        // Sweet, soft-spoken anime English dub register:
        // pitch ~1.22 gives a youthful, friendly, cute anime heroine warmth
        // rate ~0.96 provides gentle, soft-spoken clarity
        utterance.rate = 0.96;
        utterance.pitch = 1.22;
      }

      utterance.onend = () => {
        this.isCurrentlyPlaying = false;
        this.activeText = null;
        this.notify();
        onEnd?.();
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are normal when user clicks stop
        this.isCurrentlyPlaying = false;
        this.activeText = null;
        this.notify();
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          onError?.();
        }
      };

      this.synth.speak(utterance);
    } catch {
      this.isCurrentlyPlaying = false;
      this.activeText = null;
      this.notify();
    }
  }
}

export const tts = new TextToSpeechService();
