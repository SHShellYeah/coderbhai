import React, { useState, useEffect } from 'react';
import { CatFace, CatMood } from '../common/CatFace';
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
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 shadow-md hover:border-brand-primary transition-all cursor-pointer ${className}`}
        title={t.tapBhai}
      >
        <div className={`transform transition-transform ${isBouncing ? 'scale-125' : 'group-hover:scale-110'}`}>
          <CatFace mood={mood} size="sm" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black uppercase text-brand-primary tracking-wider leading-none">
            Bhai 🐾
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1 max-w-[140px]">
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
          isBouncing ? 'animate-bounce' : 'hover:-translate-y-1'
        }`}
        title={t.tapBhai}
      >
        <div className="relative p-2 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 shadow-lg group-hover:border-brand-primary group-hover:shadow-brand-primary/20 transition-all">
          <CatFace mood={mood} size="lg" />

          {/* Little Online/Active Status Badge */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 ring-2 ring-emerald-500/20 animate-pulse" />
        </div>

        <span className="mt-1 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
          Bhai
          <span className="text-[10px] text-brand-primary font-bold">{t.mentor}</span>
        </span>
      </div>

      {/* Comic Speech Bubble */}
      {showBubble && (
        <div className="relative flex-1 bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 shadow-lg text-left animate-pop min-w-0">
          {/* Bubble Pointer Arrow */}
          <div className="absolute -left-2 bottom-5 w-3.5 h-3.5 bg-white dark:bg-[#1A282F] border-l-2 border-b-2 border-slate-200 dark:border-slate-700/80 rotate-45" />

          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase text-brand-primary flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t.bhaiCodeWisdom}
            </span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleInteract();
              }}
              className="text-slate-400 hover:text-brand-primary transition-colors p-0.5"
              title="Next quote"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
            "{currentQuote}"
          </p>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>{t.tracking}: {activeCourseTitle}</span>
            <span className="text-amber-500">🔥 {streak} {t.streakDays}</span>
          </div>
        </div>
      )}
    </div>
  );
};
