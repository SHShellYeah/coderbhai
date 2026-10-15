// Web Speech API Text-to-Speech Engine with Native Bengali and Anime-dub English Voice Support
import { Language } from '../types';

type TTSListener = (isPlaying: boolean, activeText: string | null) => void;

/**
 * Comprehensive Emoji & Symbol Sanitizer
 * Strips all Unicode emojis, geometric shapes, miscellaneous symbols, variation selectors,
 * zero-width joiners, and specifically \u2B1B ("Black Large Square" in compound emojis like 🐈‍⬛)
 * so speech synthesizers never announce character names aloud.
 */
const EMOJI_AND_SYMBOLS_REGEX = /(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]|[\u{1F000}-\u{1FAFF}]|[\u{2B00}-\u{2BFF}]|[\u{25A0}-\u{25FF}]|[\u{2300}-\u{23FF}]|[\u{2190}-\u{21FF}]|[\u{2900}-\u{297F}]|[\u{FE00}-\u{FE0F}]|[\u{200B}-\u{200D}\uFEFF]|[\u{2022}\u{2023}\u{25E6}\u{2043}\u{2219}])/gu;

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
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
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    this.isCurrentlyPlaying = false;
    this.activeText = null;
    this.notify();
  }

  /**
   * Pre-cleans text for natural, authentic BENGALI speech synthesis.
   * Keeps pure Bengali script intact so native Bengali voice engines pronounce words recognizably.
   * Removes emojis and specifically eliminates \u2B1B so "black large square" is never spoken.
   */
  private cleanBengaliText(rawText: string): string {
    let clean = rawText
      // Remove multi-line code blocks
      .replace(/```[\s\S]*?```/g, ' কোড অংশ দেখে নাও ')
      // Remove repeated parenthetical English name like "নিয়ান (Nyan)" -> "নিয়ান"
      .replace(/নিয়ান\s*\([^\)]*Nyan[^\)]*\)/gi, 'নিয়ান')
      .replace(/\([^\)]*Nyan[^\)]*\)/gi, '')
      // Transcribe English/C++ terms into natural Bengali phonetics
      .replace(/\bC\+\+/g, 'সি প্লাস প্লাস')
      .replace(/\bC#/g, 'সি শার্প')
      .replace(/\bstd::cout\b/g, 'স্ট্যান্ডার্ড সি আউট')
      .replace(/\bstd::cin\b/g, 'স্ট্যান্ডার্ড সি ইন')
      .replace(/\bstd::endl\b/g, 'স্ট্যান্ডার্ড এন্ড লাইন')
      .replace(/\bcout\b/g, 'সি আউট')
      .replace(/\bcin\b/g, 'সি ইন')
      .replace(/\bendl\b/g, 'এন্ড লাইন')
      .replace(/\bstd::\b/g, 'স্ট্যান্ডার্ড ')
      .replace(/\bint\b/g, 'ইন্ট')
      .replace(/\bmain\(\)/g, 'মেইন ফাংশন')
      .replace(/\bNyan\b/g, 'নিয়ান')
      // Inline code quotes `xyz` -> xyz
      .replace(/`([^`]+)`/g, '$1')
      // Markdown formatting: bold, italic, headings
      .replace(/[#*_~>]/g, ' ')
      // Bengali sentence terminators -> comma or pause
      .replace(/[\u0964\u0965]/g, '। ')
      // Eliminate emojis, shapes, bullets, zero-width joiners and \u2B1B (Black Large Square)
      .replace(EMOJI_AND_SYMBOLS_REGEX, '')
      // Stream operators and code punctuation
      .replace(/<<|>>|->/g, ' ')
      .replace(/\/\/[^\n]*/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[{}[\];]/g, ' ')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  /**
   * Pre-cleans text for natural ENGLISH speech synthesis.
   */
  private cleanEnglishText(rawText: string): string {
    let clean = rawText
      // Remove multi-line code blocks
      .replace(/```[\s\S]*?```/g, ' check the code snippet ')
      // Technical syntax enhancements
      .replace(/\bC\+\+/g, 'C plus plus')
      .replace(/\bC#/g, 'C sharp')
      .replace(/\bstd::cout\b/g, 'standard C out')
      .replace(/\bstd::cin\b/g, 'standard C in')
      .replace(/\bstd::endl\b/g, 'standard end line')
      .replace(/\bcout\b/g, 'C out')
      .replace(/\bcin\b/g, 'C in')
      .replace(/\bendl\b/g, 'end line')
      .replace(/\bstd::\b/g, 'standard ')
      // Inline code quotes `xyz` -> xyz
      .replace(/`([^`]+)`/g, '$1')
      // Markdown formatting: bold, italic, headings
      .replace(/[#*_~>]/g, ' ')
      // Comprehensive emoji & symbol removal (includes \u2B1B "Black Large Square", bullets, etc.)
      .replace(EMOJI_AND_SYMBOLS_REGEX, '')
      // Stream operators and code punctuation
      .replace(/<<|>>|->/g, ' ')
      .replace(/\/\/[^\n]*/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[{}[\];]/g, ' ')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  /**
   * Discovers a native Bengali voice if installed in the browser/OS.
   * Returns null if no genuine Bengali voice is found.
   * NEVER returns an English voice for Bengali!
   */
  private findBengaliVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const bnVoices = this.voices.filter(
      v =>
        v.lang.toLowerCase().startsWith('bn') ||
        v.name.toLowerCase().includes('bangla') ||
        v.name.toLowerCase().includes('bengali')
    );

    if (bnVoices.length === 0) return null;

    const MALE_NAMES_REGEX = /\b(david|mark|george|guy|ryan|ravi|stefan|richard|james|john|paul|michael|brian|pradeep)\b/i;

    // Prefer female or high quality online voice (e.g. Google বাংলা, Microsoft Tanisha)
    const bnFemale = bnVoices.find(
      v =>
        !MALE_NAMES_REGEX.test(v.name) &&
        (v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('tanisha') ||
         v.name.toLowerCase().includes('google') ||
         v.name.toLowerCase().includes('online'))
    );

    return bnFemale || bnVoices[0];
  }

  /**
   * Discovers the sweetest, soft-spoken female anime-style voice available for English.
   * Strictly filters out deep male voices.
   */
  private findSoftAnimeFemaleVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const MALE_NAMES_REGEX = /\b(david|mark|george|guy|ryan|ravi|stefan|richard|james|john|paul|michael|brian|bashkar|pradeep)\b/i;

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

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const isBn = lang === 'bn';
    const clean = isBn ? this.cleanBengaliText(text) : this.cleanEnglishText(text);
    if (!clean) return;

    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      this.currentUtterance = utterance;
      this.activeText = text;
      this.isCurrentlyPlaying = true;
      this.notify();

      if (isBn) {
        // Native Bengali Voice Configuration
        const nativeBengaliVoice = this.findBengaliVoice();
        if (nativeBengaliVoice) {
          utterance.voice = nativeBengaliVoice;
          utterance.lang = nativeBengaliVoice.lang || 'bn-BD';
        } else {
          // Do NOT assign an English voice!
          // Leaving utterance.voice unset allows Chrome and Edge to route 'bn-BD'
          // to their built-in native Bengali cloud speech service.
          utterance.lang = 'bn-BD';
        }
        utterance.rate = 0.92;
        utterance.pitch = 1.08;
      } else {
        // English Anime Dub Soft Female Voice
        const femaleVoice = this.findSoftAnimeFemaleVoice();
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        utterance.lang = 'en-US';
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
        this.isCurrentlyPlaying = false;
        this.activeText = null;
        this.notify();
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          // If bn-BD failed, retry once with bn-IN (widely supported on some Android & Windows setups)
          if (isBn && utterance.lang === 'bn-BD') {
            try {
              const retryUtterance = new SpeechSynthesisUtterance(clean);
              retryUtterance.lang = 'bn-IN';
              retryUtterance.rate = 0.92;
              retryUtterance.pitch = 1.08;
              retryUtterance.onend = () => {
                this.isCurrentlyPlaying = false;
                this.activeText = null;
                this.notify();
                onEnd?.();
              };
              retryUtterance.onerror = () => {
                this.isCurrentlyPlaying = false;
                this.activeText = null;
                this.notify();
                onError?.();
              };
              this.currentUtterance = retryUtterance;
              this.isCurrentlyPlaying = true;
              this.activeText = text;
              this.notify();
              this.synth?.speak(retryUtterance);
              return;
            } catch {
              // ignore
            }
          }
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
