import React from 'react';
import { SpotTheBugQuestion } from '../../types';
import { sound } from '../../utils/audio';
import { Bug, AlertCircle } from 'lucide-react';

interface Props {
  question: SpotTheBugQuestion;
  selectedLineIndex: number | null;
  onSelectLine: (index: number) => void;
  isAnswerSubmitted: boolean;
  isCorrect?: boolean;
}

export const SpotTheBug: React.FC<Props> = ({
  question,
  selectedLineIndex,
  onSelectLine,
  isAnswerSubmitted,
  isCorrect,
}) => {
  const handleLineClick = (idx: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    onSelectLine(idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-brand-rose dark:bg-rose-500/20 text-xs font-black uppercase tracking-wider mb-2">
          <Bug className="w-4 h-4" />
          Spot the Bug Challenge
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
          {question.prompt}
        </h3>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Click directly on the line of code that introduces a bug or crash:
        </p>
      </div>

      {/* Code Editor Mockup */}
      <div className="rounded-2xl bg-slate-900 border-2 border-slate-700/60 shadow-xl overflow-hidden text-left">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold tracking-wider">
            debugger_session.src
          </span>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            1 Bug Found
          </div>
        </div>

        {/* Clickable Code Lines */}
        <div className="p-3 md:p-4 font-mono text-sm md:text-base flex flex-col gap-1.5">
          {question.codeLines.map((line, idx) => {
            const isSelected = selectedLineIndex === idx;
            const isBugLine = idx === question.bugLineIndex;

            let lineStyles = 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border-transparent';
            if (isSelected) {
              lineStyles = 'bg-brand-rose/20 text-brand-rose border-brand-rose ring-2 ring-brand-rose/30 font-bold';
            }
            if (isAnswerSubmitted) {
              if (isBugLine) {
                lineStyles = 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold';
              } else if (isSelected && !isCorrect) {
                lineStyles = 'bg-rose-500/30 text-rose-300 border-rose-500 font-bold line-through';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => handleLineClick(idx)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl border-2 transition-all cursor-pointer text-left group ${lineStyles}`}
              >
                {/* Line number */}
                <span className="w-6 text-right text-xs font-semibold text-slate-500 select-none">
                  {idx + 1}
                </span>

                {/* Bug indicator icon */}
                <span className="w-5 flex items-center justify-center">
                  {isSelected ? (
                    <Bug className="w-4 h-4 text-brand-rose animate-bounce" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-slate-400" />
                  )}
                </span>

                {/* Code line content */}
                <span className="flex-1 whitespace-pre overflow-x-auto">
                  {line}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
