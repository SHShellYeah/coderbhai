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

      if (lang === 'bn') {
        utterance.lang = 'bn-BD';
        // Try finding a Bengali voice
        const bnVoice = this.voices.find(
          v =>
            v.lang.toLowerCase().startsWith('bn') ||
            v.lang.toLowerCase().includes('bengali') ||
            v.name.toLowerCase().includes('bangla') ||
            v.name.toLowerCase().includes('bengali')
        );
        if (bnVoice) {
          utterance.voice = bnVoice;
        }
        utterance.rate = 0.92;
        utterance.pitch = 1.05;
      } else {
        utterance.lang = 'en-US';
        const enVoice =
          this.voices.find(
            v =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha') ||
                v.name.includes('Jenny'))
          ) || this.voices.find(v => v.lang.startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
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
