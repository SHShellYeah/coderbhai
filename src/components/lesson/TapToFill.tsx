import React, { useState, useRef, useEffect } from 'react';
import { TapToFillQuestion } from '../../types';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../data/translations';
import { sound } from '../../utils/audio';
import { Keyboard, MousePointerClick } from 'lucide-react';

interface Props {
  question: TapToFillQuestion;
  userAnswers: Record<string, string>;
  onSelectAnswer: (blankId: string, value: string) => void;
  onClearBlank: (blankId: string) => void;
  activeBlankId: string;
  setActiveBlankId: (blankId: string) => void;
  isAnswerSubmitted: boolean;
  isCorrect?: boolean;
}

export const TapToFill: React.FC<Props> = ({
  question,
  userAnswers,
  onSelectAnswer,
  onClearBlank,
  activeBlankId,
  setActiveBlankId,
  isAnswerSubmitted,
  isCorrect,
}) => {
  const { state } = useGame();
  const isBn = state.language === 'bn';

  // Mode: 'type' (direct keyboard typing) vs 'tap' (word bank pills)
  const [inputMode, setInputMode] = useState<'type' | 'tap'>('type');
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Auto-focus active input when switching to type mode or changing active blank
  useEffect(() => {
    if (inputMode === 'type' && activeBlankId && inputRefs.current[activeBlankId]) {
      inputRefs.current[activeBlankId]?.focus();
    }
  }, [activeBlankId, inputMode]);

  // Determine available options for word bank
  const placedValues = Object.values(userAnswers);
  const availableOptions = question.options.filter(opt => {
    const countInOptions = question.options.filter(o => o === opt).length;
    const countInPlaced = placedValues.filter(v => v.trim() === opt).length;
    return countInPlaced < countInOptions;
  });

  const handlePillClick = (option: string) => {
    if (isAnswerSubmitted) return;
    sound.playClick();

    if (activeBlankId && !userAnswers[activeBlankId]) {
      onSelectAnswer(activeBlankId, option);
      const nextEmpty = question.blanks.find(b => b.id !== activeBlankId && !userAnswers[b.id]);
      if (nextEmpty) {
        setActiveBlankId(nextEmpty.id);
      }
    } else {
      const firstEmpty = question.blanks.find(b => !userAnswers[b.id]);
      if (firstEmpty) {
        onSelectAnswer(firstEmpty.id, option);
        const nextEmpty = question.blanks.find(b => b.id !== firstEmpty.id && !userAnswers[b.id]);
        if (nextEmpty) {
          setActiveBlankId(nextEmpty.id);
        }
      }
    }
  };

  const handleInputChange = (blankId: string, text: string) => {
    if (isAnswerSubmitted) return;
    onSelectAnswer(blankId, text);
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    blankId: string,
    blankIndex: number
  ) => {
    if (isAnswerSubmitted) return;

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const nextBlank = question.blanks[blankIndex + 1];
      if (nextBlank) {
        setActiveBlankId(nextBlank.id);
        inputRefs.current[nextBlank.id]?.focus();
      }
    } else if (e.key === 'Backspace' && !userAnswers[blankId]) {
      const prevBlank = question.blanks[blankIndex - 1];
      if (prevBlank) {
        setActiveBlankId(prevBlank.id);
        inputRefs.current[prevBlank.id]?.focus();
      }
    }
  };

  // Render the code snippet with blanks
  const renderCodeWithBlanks = () => {
    const parts = question.codeTemplate.split(/(\{\{blank\d+\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/\{\{(blank\d+)\}\}/);
      if (match) {
        const blankId = match[1];
        const blankIndex = question.blanks.findIndex(b => b.id === blankId);
        const val = userAnswers[blankId] || '';
        const isActive = activeBlankId === blankId;

        let borderState = 'border-dashed border-slate-500 bg-slate-800 text-slate-100';
        if (isActive) {
          borderState = 'border-solid border-brand-blue bg-slate-900 ring-2 ring-brand-blue/40 text-brand-blue';
        }
        if (val) {
          borderState = 'border-solid border-brand-blue bg-slate-900 text-sky-300 font-bold';
        }
        if (isAnswerSubmitted) {
          if (isCorrect) {
            borderState = 'border-brand-green bg-emerald-950/40 text-brand-green font-bold';
          } else {
            borderState = 'border-brand-rose bg-rose-950/40 text-brand-rose font-bold';
          }
        }

        const widthPx = Math.max(76, Math.min(260, val.length * 11 + 32));

        return (
          <span key={index} className="inline-flex items-center align-middle mx-1 my-0.5">
            {inputMode === 'type' ? (
              <input
                ref={el => { inputRefs.current[blankId] = el; }}
                type="text"
                disabled={isAnswerSubmitted}
                value={val}
                placeholder={isActive ? '' : (isBn ? '[টাইপ]' : '[type]')}
                onChange={e => handleInputChange(blankId, e.target.value)}
                onFocus={() => setActiveBlankId(blankId)}
                onKeyDown={e => handleInputKeyDown(e, blankId, blankIndex)}
                style={{ width: `${widthPx}px` }}
                className={`h-9 px-2.5 rounded-xl border-2 text-sm md:text-base font-mono transition-all outline-none text-center ${borderState}`}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (val) onClearBlank(blankId);
                  setActiveBlankId(blankId);
                }}
                className={`inline-flex items-center justify-center min-w-[70px] h-9 px-3 py-1 rounded-xl border-2 text-sm md:text-base font-mono transition-all cursor-pointer ${borderState}`}
              >
                {val ? (
                  <span className="flex items-center gap-1 font-bold">
                    {val}
                    {!isAnswerSubmitted && <span className="text-xs text-slate-400">✕</span>}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-sans tracking-wide">
                    {isActive ? '...' : '[ ? ]'}
                  </span>
                )}
              </button>
            )}
          </span>
        );
      }

      return (
        <span key={index} className="text-slate-300 whitespace-pre">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
            {question.prompt}
          </h3>
          <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {inputMode === 'type'
              ? (isBn ? 'আপনার কীবোর্ড দিয়ে সরাসরি ফাঁকা স্থানে কোড টাইপ করুন:' : 'Type the missing code directly into the blanks with your keyboard:')
              : (isBn ? 'নিচের শব্দভাণ্ডার থেকে ট্যাপ করে কোডটি সম্পন্ন করুন:' : 'Tap tokens from the word bank below to complete the code:')}
          </p>
        </div>

        {/* Input Mode Toggle (Keyboard Type vs Tap Pill) */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setInputMode('type');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              inputMode === 'type'
                ? 'bg-white dark:bg-[#111827] text-brand-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            {isBn ? 'টাইপ' : 'Type'}
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setInputMode('tap');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              inputMode === 'tap'
                ? 'bg-white dark:bg-[#111827] text-brand-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            {isBn ? 'ট্যাপ ব্যাংক' : 'Tap Bank'}
          </button>
        </div>
      </div>

      {/* Terminal / Code Editor Container */}
      <div className="relative rounded-2xl bg-slate-900 border-2 border-slate-700/60 shadow-xl overflow-hidden text-left">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold tracking-wider">
            source_editor.c
          </span>
          <div className="text-[11px] font-bold text-slate-400 font-mono">
            {inputMode === 'type'
              ? (isBn ? '⌨️ কীবোর্ড মোড' : '⌨️ Keyboard Mode')
              : (isBn ? '👆 ওয়ার্ড ব্যাংক' : '👆 Word Bank')}
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 md:p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {renderCodeWithBlanks()}
        </div>
      </div>

      {/* Word Bank or Reference Bank */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">
            {inputMode === 'type' ? 'Helpful Tokens (Reference)' : 'Word Bank (Tap to fill)'}
          </span>
          <span className="text-xs text-slate-400">
            {inputMode === 'type' ? 'You can also tap any token to insert' : 'Tap tokens in sequence'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 min-h-[56px] p-3 rounded-2xl bg-slate-100 dark:bg-[#18252C] border-2 border-slate-200 dark:border-slate-800 items-center">
          {availableOptions.map((option, idx) => (
            <button
              key={`${option}-${idx}`}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => handlePillClick(option)}
              className="btn-3d px-4 py-2.5 rounded-xl text-sm md:text-base font-mono font-bold bg-white text-slate-800 border-b-4 border-slate-300 shadow-sm hover:bg-slate-50 active:border-b-0 active:translate-y-1 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-950 transition-all cursor-pointer"
            >
              {option}
            </button>
          ))}
          {availableOptions.length === 0 && (
            <p className="text-xs font-semibold text-slate-400 italic py-2">
              All tokens placed! You can backspace or tap placed tokens above to edit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
