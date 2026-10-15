import React, { useEffect, useState } from 'react';
import { fireSuccessConfetti } from '../../utils/confetti';
import { sound } from '../../utils/audio';
import { CatFace } from '../common/CatFace';
import { Zap, Target, Flame, Sparkles } from 'lucide-react';

interface Props {
  totalXp: number;
  accuracy: number;
  streak: number;
  onFinish: () => void;
}

export const LessonCompleteModal: React.FC<Props> = ({
  totalXp,
  accuracy,
  streak,
  onFinish,
}) => {
  const [displayedXp, setDisplayedXp] = useState(0);

  useEffect(() => {
    sound.playFanfare();
    sound.playMeow();
    fireSuccessConfetti();

    // Animated dopamine counter for XP
    let current = 0;
    const step = Math.max(1, Math.floor(totalXp / 25));
    const interval = setInterval(() => {
      current += step;
      if (current >= totalXp) {
        setDisplayedXp(totalXp);
        clearInterval(interval);
      } else {
        setDisplayedXp(current);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [totalXp]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Shimmer sweep effect */}
        <div className="shimmer-sweep absolute inset-0 pointer-events-none opacity-40" />

        {/* Mascot Celebration Banner */}
        <div className="relative flex flex-col items-center">
          <div className="p-3 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 shadow-xl ring-8 ring-brand-primary/10 animate-bounceShort">
            <CatFace mood="cheering" size="xl" />
          </div>

          <div className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-xs font-black px-3 py-1 rounded-full border-2 border-white dark:border-slate-900 shadow-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            PURRFECT!
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
            Lesson Mastered!
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Bhai is cheering! You leveled up your programming intuition.
          </p>
        </div>

        {/* Dopamine Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3">
          {/* Total XP Count-up */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 shadow-sm">
            <Zap className="w-6 h-6 text-brand-gold fill-brand-gold mb-1 animate-wiggle" />
            <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400">
              XP Earned
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
              +{displayedXp}
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 shadow-sm">
            <Target className="w-6 h-6 text-brand-primary mb-1" />
            <span className="text-[11px] font-black uppercase text-brand-primary">
              Accuracy
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
              {accuracy}%
            </span>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-500/10 border-2 border-orange-500/30 shadow-sm">
            <Flame className="w-6 h-6 text-brand-orange fill-brand-orange mb-1 animate-wiggle" />
            <span className="text-[11px] font-black uppercase text-orange-600 dark:text-orange-400">
              Streak
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
              {streak} Days
            </span>
          </div>
        </div>

        {/* Bonus Reward Badge */}
        <div className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
          <span className="flex items-center gap-2">
            <span className="text-lg">💎</span>
            <span>Bonus Gem Reward</span>
          </span>
          <span className="text-brand-accent font-black font-mono">+15 Gems</span>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onFinish();
          }}
          className="btn-3d btn-3d-primary w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider cursor-pointer"
        >
          Keep Learning
        </button>
      </div>
    </div>
  );
};
