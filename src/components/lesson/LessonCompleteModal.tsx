import React, { useEffect } from 'react';
import { fireSuccessConfetti } from '../../utils/confetti';
import { sound } from '../../utils/audio';
import { Zap, Target, Flame, Trophy } from 'lucide-react';

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
  useEffect(() => {
    sound.playFanfare();
    fireSuccessConfetti();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-md bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center gap-6">
        {/* Animated Trophy Banner */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold ring-8 ring-brand-gold/10 animate-bounceShort">
            <Trophy className="w-12 h-12 fill-current" />
          </div>
          <div className="absolute -top-1 -right-1 bg-brand-green text-white text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
            PASSED!
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
            Lesson Complete!
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            You just leveled up your programming intuition.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-3">
          {/* Total XP */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30">
            <Zap className="w-6 h-6 text-brand-gold fill-brand-gold mb-1" />
            <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
              Total XP
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">
              +{totalXp}
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30">
            <Target className="w-6 h-6 text-brand-green mb-1" />
            <span className="text-xs font-black uppercase text-brand-green dark:text-emerald-400">
              Accuracy
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">
              {accuracy}%
            </span>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-500/10 border-2 border-orange-500/30">
            <Flame className="w-6 h-6 text-brand-orange fill-brand-orange mb-1" />
            <span className="text-xs font-black uppercase text-orange-600 dark:text-orange-400">
              Streak
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">
              {streak} Days
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onFinish}
          className="btn-3d btn-3d-green w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};
