import React from 'react';
import { useGame } from '../../context/GameContext';
import { HeartCrack, Heart, Sparkles, X } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onClose: () => void;
  onStartPractice: () => void;
}

export const OutOfHeartsModal: React.FC<Props> = ({ onClose, onStartPractice }) => {
  const { state, refillHearts } = useGame();

  const handleRefillWithGems = () => {
    sound.playClick();
    const success = refillHearts('gems');
    if (success) {
      onClose();
    }
  };

  const handlePractice = () => {
    sound.playClick();
    onStartPractice();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-md bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center relative flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Broken Heart Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-brand-rose ring-8 ring-rose-500/10 animate-wiggle">
          <HeartCrack className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Out of Hearts!
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Don't worry, every senior engineer learns by making mistakes. Refill your hearts to continue coding.
          </p>
        </div>

        {/* Action Options */}
        <div className="w-full flex flex-col gap-3">
          {/* Practice Refill */}
          <button
            type="button"
            onClick={handlePractice}
            className="btn-3d btn-3d-green w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm md:text-base font-black uppercase"
          >
            <Sparkles className="w-5 h-5" />
            Practice to Refill (Free)
          </button>

          {/* Gems Refill */}
          <button
            type="button"
            disabled={state.gems < 50}
            onClick={handleRefillWithGems}
            className={`btn-3d w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm md:text-base font-black uppercase ${
              state.gems >= 50
                ? 'btn-3d-blue'
                : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-900 cursor-not-allowed'
            }`}
          >
            <Heart className="w-5 h-5 fill-current text-brand-rose" />
            Refill 5 Hearts (50 Gems)
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Your current gems: <span className="text-brand-blue font-bold">💎 {state.gems}</span>
        </div>
      </div>
    </div>
  );
};
