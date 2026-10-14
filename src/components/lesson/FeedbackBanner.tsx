import React from 'react';
import { CheckCircle2, XCircle, Zap, HeartCrack } from 'lucide-react';

interface Props {
  isCorrect: boolean;
  explanation: string;
  xpEarned: number;
  onContinue: () => void;
}

export const FeedbackBanner: React.FC<Props> = ({
  isCorrect,
  explanation,
  xpEarned,
  onContinue,
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 md:py-6 md:px-8 border-t-2 shadow-2xl transition-all duration-300 transform translate-y-0 ${
        isCorrect
          ? 'bg-emerald-100 border-emerald-300 dark:bg-[#183120] dark:border-emerald-800'
          : 'bg-rose-100 border-rose-300 dark:bg-[#34181A] dark:border-rose-900'
      }`}
    >
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Feedback Message & Explanation */}
        <div className="flex items-start gap-4 text-left w-full sm:w-auto flex-1">
          <div className="shrink-0 mt-0.5">
            {isCorrect ? (
              <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center text-white shadow-lg animate-pop">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-brand-rose flex items-center justify-center text-white shadow-lg animate-wiggle">
                <XCircle className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xl md:text-2xl font-black ${
                  isCorrect
                    ? 'text-brand-green dark:text-emerald-400'
                    : 'text-brand-rose dark:text-rose-400'
                }`}
              >
                {isCorrect ? 'Nicely done!' : 'Correct Solution:'}
              </span>
              {isCorrect && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-green/20 text-brand-green dark:bg-emerald-500/30">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  +{xpEarned} XP
                </span>
              )}
              {!isCorrect && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-rose/20 text-brand-rose dark:bg-rose-500/30">
                  <HeartCrack className="w-3.5 h-3.5" />
                  -1 Heart
                </span>
              )}
            </div>

            <p className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-300 leading-snug">
              {explanation}
            </p>
          </div>
        </div>

        {/* Chunky Continue Button */}
        <button
          type="button"
          onClick={onContinue}
          className={`btn-3d w-full sm:w-auto min-w-[160px] py-3.5 px-8 rounded-2xl text-base font-black uppercase tracking-wider ${
            isCorrect ? 'btn-3d-green' : 'btn-3d-rose'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
