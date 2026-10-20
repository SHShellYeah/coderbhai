import React, { useState, useEffect } from 'react';
import { CatFace, CatMood } from '../common/CatFace';
import { TTSButton } from '../common/TTSButton';
import { sound } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { BHAI_QUOTES_BY_LANG, useTranslation } from '../../data/translations';
import { Sparkles, MessageCircle, RefreshCw } from 'lucide-react';

interface Props {
  streak: number;
  xp: number;
  activeCourseTitle: string;
  className?: string;
  compact?: boolean;
}

export const BhaiCompanion: React.FC<Props> = ({
  streak,
  xp,
  activeCourseTitle,
  className = '',
  compact = false,
}) => {
  const { state } = useGame();
  const t = useTranslation(state.language);
  const quotes = BHAI_QUOTES_BY_LANG[state.language] || BHAI_QUOTES_BY_LANG.en;

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [mood, setMood] = useState<CatMood>('idle');
  const [isBouncing, setIsBouncing] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  // Reset quote index if out of bounds on language switch
  useEffect(() => {
    setQuoteIndex(prev => prev % quotes.length);
  }, [state.language, quotes.length]);

  // Rotate mood occasionally
  useEffect(() => {
    const moods: CatMood[] = ['idle', 'happy', 'wink', 'thinking'];
    const timer = setInterval(() => {
      setMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleInteract = () => {
    sound.playMeow();
    setIsBouncing(true);
    setMood('cheering');
    setQuoteIndex(prev => (prev + 1) % quotes.length);
    setShowBubble(true);

    setTimeout(() => {
      setIsBouncing(false);
      setMood('happy');
    }, 1200);
  };

  const currentQuote = quotes[quoteIndex] || quotes[0];

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleInteract}
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/50 transition-colors cursor-pointer ${className}`}
        title={t.tapBhai}
      >
        <div className={`transform transition-transform ${isBouncing ? 'scale-110' : 'group-hover:scale-105'}`}>
          <CatFace mood={mood} size="sm" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-semibold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider leading-none">
            Byte 🐾
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 line-clamp-1 max-w-[140px]">
            {currentQuote}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className={`relative flex items-end gap-3.5 select-none ${className}`}>
      {/* Animated Cat Mascot */}
      <div
        onClick={handleInteract}
        className={`cursor-pointer group flex flex-col items-center shrink-0 transition-transform duration-300 ${
          isBouncing ? 'scale-105' : 'hover:-translate-y-0.5'
        }`}
        title={t.tapBhai}
      >
        <div className="relative p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs group-hover:border-indigo-500/40 transition-colors">
          <CatFace mood={mood} size="lg" />

          {/* Online/Active Status Badge */}
          <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
        </div>

        <span className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          Byte
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">{t.mentor}</span>
        </span>
      </div>

      {/* Comic Speech Bubble */}
      {showBubble && (
        <div className="relative flex-1 bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-left animate-pop min-w-0">
          {/* Bubble Pointer Arrow */}
          <div className="absolute -left-1.5 bottom-5 w-3 h-3 bg-white dark:bg-[#111622] border-l border-b border-slate-200 dark:border-slate-800 rotate-45" />

          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t.bhaiCodeWisdom}
            </span>
            <div className="flex items-center gap-1">
              <TTSButton text={currentQuote} size="icon-only" />
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleInteract();
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Next quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
            "{currentQuote}"
          </p>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>{t.tracking}: {activeCourseTitle}</span>
            <span className="text-amber-500 font-semibold">🔥 {streak} {t.streakDays}</span>
          </div>
        </div>
      )}
    </div>
  );
};
