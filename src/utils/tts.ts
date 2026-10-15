// Web Speech API Text-to-Speech Engine with Bengali and English Voice Support
import { Language } from '../types';

type TTSListener = (isPlaying: boolean, activeText: string | null) => void;

/**
 * Comprehensive Emoji & Symbol Sanitizer
 * Strips all Unicode emojis, geometric shapes, miscellaneous symbols, variation selectors,
 * zero-width joiners, and specifically \u2B1B ("Black Large Square" in compound emojis like 🐈‍⬛)
 * so speech synthesizers never announce character names aloud.
 */
const EMOJI_AND_SYMBOLS_REGEX = /(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]|[\u{1F000}-\u{1FAFF}]|[\u{2B00}-\u{2BFF}]|[\u{25A0}-\u{25FF}]|[\u{2300}-\u{23FF}]|[\u{2190}-\u{21FF}]|[\u{2900}-\u{297F}]|[\u{FE00}-\u{FE0F}]|[\u{200B}-\u{200D}\uFEFF]|[\u{2022}\u{2023}\u{25E6}\u{2043}\u{2219}])/gu;

// Bengali numeral conversion
const BENGALI_NUMERALS: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

// Vowels & Matras
const BENGALI_VOWELS: Record<string, string> = {
  '\u0985': 'o',   // অ
  '\u0986': 'aa',  // আ
  '\u0987': 'i',   // ই
  '\u0988': 'ee',  // ঈ
  '\u0989': 'u',   // উ
  '\u098A': 'oo',  // ঊ
  '\u098B': 'ri',  // ঋ
  '\u098F': 'e',   // এ
  '\u0990': 'oi',  // ঐ
  '\u0993': 'o',   // ও
  '\u0994': 'ou'   // ঔ
};

const BENGALI_MATRAS: Record<string, string> = {
  '\u09BE': 'aa',  // া
  '\u09BF': 'i',   // ি
  '\u09C0': 'ee',  // ী
  '\u09C1': 'u',   // ু
  '\u09C2': 'oo',  // ূ
  '\u09C3': 'ri',  // ৃ
  '\u09C7': 'e',   // ে
  '\u09C8': 'oi',  // ৈ
  '\u09CB': 'o',   // ো
  '\u09CC': 'ou'   // ৌ
};

const BENGALI_CONSONANTS: Record<string, string> = {
  '\u0995': 'k',   // ক
  '\u0996': 'kh',  // খ
  '\u0997': 'g',   // গ
  '\u0998': 'gh',  // ঘ
  '\u0999': 'ng',  // ঙ
  '\u099A': 'ch',  // চ
  '\u099B': 'chh', // ছ
  '\u099C': 'j',   // জ
  '\u099D': 'jh',  // ঝ
  '\u099E': 'n',   // ঞ
  '\u099F': 't',   // ট
  '\u09A0': 'th',  // ঠ
  '\u09A1': 'd',   // ড
  '\u09A2': 'dh',  // ঢ
  '\u09A3': 'n',   // ণ
  '\u09A4': 't',   // ত
  '\u09A5': 'th',  // থ
  '\u09A6': 'd',   // দ
  '\u09A7': 'dh',  // ধ
  '\u09A8': 'n',   // ন
  '\u09AA': 'p',   // প
  '\u09AB': 'ph',  // ফ
  '\u09AC': 'b',   // ব
  '\u09AD': 'bh',  // ভ
  '\u09AE': 'm',   // ম
  '\u09AF': 'j',   // য
  '\u09B0': 'r',   // র
  '\u09B2': 'l',   // ল
  '\u09B6': 'sh',  // শ
  '\u09B7': 'sh',  // ষ
  '\u09B8': 's',   // স
  '\u09B9': 'h',   // হ
  '\u09DC': 'r',   // ড়
  '\u09DD': 'rh',  // ঢ়
  '\u09DF': 'y',   // য়
  '\u09CE': 't'    // ৎ
};

// High frequency educational vocabulary mapped to natural phonetic speech
const COMMON_BENGALI_WORDS: [string, string][] = [
  ['হ্যালো', 'Hello'],
  ['নিয়ান', 'Nyan'],
  ['কোডার', 'Coder'],
  ['ভাই', 'Bhai'],
  ['আমি', 'aami'],
  ['তুমি', 'tumi'],
  ['তোমার', 'tomar'],
  ['তোমরা', 'tomra'],
  ['আমরা', 'aamra'],
  ['খুব', 'khub'],
  ['সুন্দর', 'shundor'],
  ['চমৎকার', 'chomotkar'],
  ['দারুন', 'daarun'],
  ['দারুণ', 'daarun'],
  ['সঠিক', 'sothik'],
  ['উত্তর', 'uttor'],
  ['দিয়েছ', 'diyechho'],
  ['দিয়েছ', 'diyechho'],
  ['দিয়েছে', 'diyechhe'],
  ['দিয়েছে', 'diyechhe'],
  ['ভুল', 'bhul'],
  ['হয়েছে', 'hoyechhe'],
  ['হয়েছে', 'hoyechhe'],
  ['আবার', 'aabar'],
  ['চেষ্টা', 'cheshta'],
  ['করো', 'koro'],
  ['করছ', 'korchho'],
  ['করছো', 'korchho'],
  ['করুন', 'korun'],
  ['করতে', 'korte'],
  ['করার', 'korar'],
  ['করে', 'kore'],
  ['করেছে', 'korechhe'],
  ['স্বাগতম', 'swagotom'],
  ['চলো', 'cholo'],
  ['শুরু', 'shuru'],
  ['করি', 'kori'],
  ['ভাষা', 'bhasha'],
  ['একটি', 'ekti'],
  ['হলো', 'holo'],
  ['হবে', 'hobe'],
  ['হয়', 'hoy'],
  ['হয়', 'hoy'],
  ['শক্তিশালী', 'shoktishali'],
  ['দেখো', 'dekho'],
  ['দেখে', 'dekhe'],
  ['ভালো', 'bhalo'],
  ['কি', 'ki'],
  ['কী', 'ki'],
  ['না', 'na'],
  ['হ্যাঁ', 'haa'],
  ['হ্যা', 'haa'],
  ['কোড', 'code'],
  ['রান', 'run'],
  ['বোঝা', 'bojha'],
  ['গেছে', 'gechhe'],
  ['গেল', 'gelo'],
  ['জন্য', 'jonno'],
  ['সাথে', 'sathe'],
  ['মধ্যে', 'moddhe'],
  ['সব', 'sob'],
  ['এবং', 'ebong'],
  ['বা', 'baa'],
  ['কিন্তু', 'kintu'],
  ['এখানে', 'ekhane'],
  ['সেখানে', 'sekhane'],
  ['এখন', 'ekhon'],
  ['মনে', 'mone'],
  ['রাখো', 'rakho'],
  ['রাখবে', 'rakhbe'],
  ['সহজ', 'sohoj'],
  ['কঠিন', 'kothin'],
  ['প্রশ্ন', 'proshno'],
  ['অধ্যায়', 'oddhay'],
  ['লেসন', 'lesson'],
  ['কোর্স', 'course'],
  ['ক্লিক', 'click'],
  ['বাটন', 'button'],
  ['স্কোর', 'score'],
  ['পয়েন্ট', 'point'],
  ['প্যাটার্ন', 'pattern'],
  ['কনসোল', 'console'],
  ['কম্পাইলার', 'compiler'],
  ['কম্পিউটার', 'computer'],
  ['প্রোগ্রাম', 'program'],
  ['প্রোগ্রামিং', 'programming'],
  ['ভেরিয়েবল', 'variable'],
  ['ভেরিয়েবল', 'variable'],
  ['ফাংশন', 'function'],
  ['আউটপুট', 'output'],
  ['ইনপুট', 'input'],
  ['লাইন', 'line'],
  ['স্টেটমেন্ট', 'statement'],
  ['প্রিন্ট', 'print'],
  ['পয়েন্টার', 'pointer'],
  ['পয়েন্টার', 'pointer'],
  ['অ্যারে', 'array'],
  ['স্ট্রিং', 'string'],
  ['নাম্বার', 'number'],
  ['ব্যবহার', 'byabohar'],
  ['ব্যবহৃত', 'byabohrito'],
  ['নয়ন', 'Nyan'],
  ['নয়ন', 'Nyan']
];

/**
 * Transliterates Bengali Unicode to phonetic Latin words.
 * Used when no native Bengali speech engine is installed, so English voices
 * can read Bengali aloud smoothly without skipping a single word.
 */
function transliterateBengaliToPhonetic(text: string): string {
  let processed = text;
  for (const [bnWord, enWord] of COMMON_BENGALI_WORDS) {
    processed = processed.split(bnWord).join(enWord);
  }

  let result = '';
  const len = processed.length;
  for (let i = 0; i < len; i++) {
    const ch = processed[i];
    const code = ch.charCodeAt(0);

    if (code < 0x0980 || code > 0x09FF) {
      result += ch;
      continue;
    }

    if (BENGALI_NUMERALS[ch]) {
      result += BENGALI_NUMERALS[ch];
      continue;
    }

    if (BENGALI_VOWELS[ch]) {
      result += BENGALI_VOWELS[ch];
      continue;
    }

    if (BENGALI_MATRAS[ch]) {
      result += BENGALI_MATRAS[ch];
      continue;
    }

    if (ch === '\u0982') { // ং
      result += 'ng';
      continue;
    }
    if (ch === '\u0983') { // ঃ
      result += 'h';
      continue;
    }
    if (ch === '\u0981' || ch === '\u09CD') { // ঁ or hasanta
      continue;
    }

    if (BENGALI_CONSONANTS[ch]) {
      const c = BENGALI_CONSONANTS[ch];
      const nextChar = i + 1 < len ? processed[i + 1] : '';
      const nextNext = i + 2 < len ? processed[i + 2] : '';

      // Conjunct with ya-fola (্ + য)
      if (nextChar === '\u09CD' && nextNext === '\u09AF') {
        result += c + 'y';
        i += 2;
        const afterYa = i + 1 < len ? processed[i + 1] : '';
        if (!BENGALI_MATRAS[afterYa] && afterYa !== '\u09CD') {
          result += 'a';
        }
        continue;
      }

      // Conjunct with ra-fola (্ + র)
      if (nextChar === '\u09CD' && nextNext === '\u09B0') {
        result += c + 'r';
        i += 2;
        const afterRa = i + 1 < len ? processed[i + 1] : '';
        if (!BENGALI_MATRAS[afterRa] && afterRa !== '\u09CD') {
          result += 'o';
        }
        continue;
      }

      // General conjunct with hasanta: c + next consonant
      if (nextChar === '\u09CD' && i + 2 < len && BENGALI_CONSONANTS[processed[i + 2]]) {
        result += c;
        i++; // skip hasanta
        continue;
      }

      result += c;

      // Inherent vowel logic
      if (!BENGALI_MATRAS[nextChar] && nextChar !== '\u09CD') {
        const isEndOfWord = !nextChar || /\s|[.,!?;:()"'<>]/.test(nextChar);
        if (!isEndOfWord) {
          result += 'o';
        }
      }
    }
  }
  return result;
}

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
   * Completely eliminates \u2B1B and other symbols so "black large square" is never spoken.
   */
  private cleanTextForSpeech(rawText: string, lang: Language, hasNativeVoice: boolean): string {
    let clean = rawText
      // Remove multi-line code blocks
      .replace(/```[\s\S]*?```/g, lang === 'bn' ? ' কোড অংশ দেখে নাও ' : ' check the code snippet ')
      // Technical syntax enhancements for natural pronunciation
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
      // Replace Bengali sentence terminators with pause
      .replace(/[\u0964\u0965]/g, '. ')
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

    // If Bangla is requested but no native Bengali speech voice is installed,
    // transliterate to phonetic Latin so the English anime voice pronounces it aloud rather than skipping!
    if (lang === 'bn' && !hasNativeVoice && /[\u0980-\u09FF]/.test(clean)) {
      clean = transliterateBengaliToPhonetic(clean);
    }

    return clean;
  }

  /**
   * Discovers a native Bengali voice if installed in the browser/OS.
   * Returns null if no genuine Bengali voice is found (never falls back to English here).
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
   * Discovers the sweetest, soft-spoken female anime-style voice available.
   * Strictly filters out deep male voices (David, Mark, Guy, Ryan, George, etc.)
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

  /**
   * Phonetic fallback execution for systems without native Bengali speech engine.
   */
  private speakPhoneticFallback(
    phoneticText: string,
    originalText: string,
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (!this.synth) return;
    try {
      const utterance = new SpeechSynthesisUtterance(phoneticText);
      this.currentUtterance = utterance;
      this.activeText = originalText;
      this.isCurrentlyPlaying = true;
      this.notify();

      const femaleVoice = this.findSoftAnimeFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.22;

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

    const nativeBengaliVoice = lang === 'bn' ? this.findBengaliVoice() : null;
    const hasNativeVoice = !!nativeBengaliVoice;

    const clean = this.cleanTextForSpeech(text, lang, hasNativeVoice);
    if (!clean) return;

    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      this.currentUtterance = utterance;
      this.activeText = text;
      this.isCurrentlyPlaying = true;
      this.notify();

      if (lang === 'bn' && nativeBengaliVoice) {
        // Native Bengali voice is available
        utterance.voice = nativeBengaliVoice;
        utterance.lang = nativeBengaliVoice.lang || 'bn-BD';
        utterance.rate = 0.94;
        utterance.pitch = 1.18;
      } else {
        // English voice or Soft anime female voice reading phonetic transliteration
        const femaleVoice = this.findSoftAnimeFemaleVoice();
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        utterance.lang = 'en-US';
        utterance.rate = 0.95;
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
          // If native Bengali speech failed, seamlessly try phonetic fallback
          if (lang === 'bn' && nativeBengaliVoice && /[\u0980-\u09FF]/.test(text)) {
            const phonetic = this.cleanTextForSpeech(text, 'bn', false);
            if (phonetic) {
              this.speakPhoneticFallback(phonetic, text, onEnd, onError);
              return;
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
