import React from 'react';
import { PredictOutputQuestion } from '../../types';
import { sound } from '../../utils/audio';
import { Terminal, Check, X } from 'lucide-react';

interface Props {
  question: PredictOutputQuestion;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  isAnswerSubmitted: boolean;
  isCorrect?: boolean;
}

export const PredictOutput: React.FC<Props> = ({
  question,
  selectedOptionId,
  onSelectOption,
  isAnswerSubmitted,
}) => {
  const handleOptionClick = (optionId: string) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    onSelectOption(optionId);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 text-xs font-black uppercase tracking-wider mb-2">
          <Terminal className="w-4 h-4" />
          Predict Output
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
          {question.prompt}
        </h3>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Analyze the code and choose the exact stdout console output:
        </p>
      </div>

      {/* Code Snippet Box */}
      <div className="rounded-2xl bg-slate-900 border-2 border-slate-700/60 shadow-xl overflow-hidden text-left">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400">program.out</span>
          <div className="w-12" />
        </div>
        <pre className="p-4 md:p-5 font-mono text-sm md:text-base text-sky-300 leading-relaxed overflow-x-auto whitespace-pre">
          {question.codeSnippet}
        </pre>
      </div>

      {/* Option Cards (3D Chunky Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt.id;

          let btnClass = 'bg-white text-slate-800 border-b-4 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-950 dark:hover:bg-slate-700/80';
          if (isSelected) {
            btnClass = 'bg-brand-blue/10 text-brand-blue border-b-4 border-brand-blue ring-2 ring-brand-blue/30 dark:bg-brand-blue/20 dark:text-brand-blue dark:border-brand-blue';
          }
          if (isAnswerSubmitted) {
            if (opt.isCorrect) {
              btnClass = 'bg-emerald-500/10 text-emerald-700 border-b-4 border-emerald-600 ring-2 ring-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600';
            } else if (isSelected && !opt.isCorrect) {
              btnClass = 'bg-rose-500/10 text-rose-700 border-b-4 border-rose-600 ring-2 ring-rose-500 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-600';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => handleOptionClick(opt.id)}
              className={`btn-3d w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer font-bold ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black uppercase bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {optionLetters[idx] || (idx + 1)}
                </span>
                <span className="font-mono text-sm md:text-base">
                  {opt.text}
                </span>
              </div>

              {isAnswerSubmitted && opt.isCorrect && (
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
