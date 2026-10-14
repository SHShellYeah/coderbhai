import React, { useState } from 'react';
import { TeachingIntro } from '../../types';
import { CHARACTERS } from '../../data/characters';
import { sound } from '../../utils/audio';
import { Sparkles, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';

interface Props {
  intro: TeachingIntro;
  onFinishIntro: () => void;
  onSkipIntro?: () => void;
}

export const CharacterIntroModal: React.FC<Props> = ({
  intro,
  onFinishIntro,
  onSkipIntro,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactiveTokens, setInteractiveTokens] = useState<string[]>([]);

  const step = intro.steps[currentStepIndex];
  const character = CHARACTERS[step.characterId] || CHARACTERS.byte;
  const isLastStep = currentStepIndex === intro.steps.length - 1;

  const handleNextStep = () => {
    sound.playClick();
    if (isLastStep) {
      sound.playSuccess();
      onFinishIntro();
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setInteractiveTokens([]);
    }
  };

  const handleTokenTap = (token: string) => {
    sound.playClick();
    if (interactiveTokens.includes(token)) {
      setInteractiveTokens(prev => prev.filter(t => t !== token));
    } else {
      setInteractiveTokens(prev => [...prev, token]);
    }
  };

  const isInteractiveComplete =
    step.interactiveTry &&
    step.interactiveTry.targetOrder.every(
      (expected, idx) => interactiveTokens[idx] === expected
    ) &&
    interactiveTokens.length === step.interactiveTry.targetOrder.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-pop">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-green/15 text-brand-green text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Lesson Intro & Concept Guide
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-400">
              Step {currentStepIndex + 1} of {intro.steps.length}
            </span>
            {onSkipIntro && (
              <button
                type="button"
                onClick={onSkipIntro}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase"
              >
                Skip Intro
              </button>
            )}
          </div>
        </div>

        {/* Character Dialogue Presentation */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Animated Mascot */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-brand-green/20 dark:bg-brand-green/30 border-4 border-brand-green flex items-center justify-center text-5xl shadow-lg animate-bounceShort select-none">
              {character.avatar}
            </div>
            <span className="mt-2 text-sm font-black text-slate-800 dark:text-slate-200">
              {character.name}
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {character.title}
            </span>
          </div>

          {/* Comic Speech Bubble */}
          <div className="flex-1 w-full relative bg-slate-100 dark:bg-[#202F36] border-2 border-slate-200 dark:border-slate-700/80 rounded-3xl p-4 md:p-5 text-left shadow-sm">
            {/* Arrow pointing to character on desktop */}
            <div className="hidden sm:block absolute -left-2.5 top-6 w-5 h-5 bg-slate-100 dark:bg-[#202F36] border-l-2 border-b-2 border-slate-200 dark:border-slate-700/80 rotate-45" />

            <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 mb-2">
              {intro.title}
            </h3>

            <p className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {step.speech}
            </p>
          </div>
        </div>

        {/* Code Snippet Box (if step has code) */}
        {step.codeSnippet && (
          <div className="rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-inner overflow-hidden text-left">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-400">example_code.cpp</span>
              <div className="w-10" />
            </div>
            <pre className="p-4 font-mono text-sm md:text-base text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre">
              {step.codeSnippet}
            </pre>
          </div>
        )}

        {/* Code Anatomy Breakdown */}
        {step.anatomy && step.anatomy.length > 0 && (
          <div className="flex flex-col gap-2.5 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Breakdown: How Each Token Works
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {step.anatomy.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex flex-col gap-1"
                >
                  <span className="font-mono text-sm font-black text-brand-blue">
                    {item.token}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.explanation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Try Sandbox (if step has hands-on try) */}
        {step.interactiveTry && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border-2 border-blue-500/20 text-left flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-brand-blue flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                Try it: {step.interactiveTry.prompt}
              </span>
              {isInteractiveComplete && (
                <span className="text-xs font-black text-brand-green flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Perfect!
                </span>
              )}
            </div>

            {/* Assembled Line */}
            <div className="min-h-[46px] p-2.5 rounded-xl bg-slate-900 font-mono text-sm md:text-base text-emerald-400 flex items-center gap-2 overflow-x-auto">
              {interactiveTokens.length === 0 ? (
                <span className="text-slate-500 italic text-xs">
                  Tap tokens below in order to build your first line...
                </span>
              ) : (
                interactiveTokens.map((tok, i) => (
                  <span
                    key={i}
                    onClick={() => handleTokenTap(tok)}
                    className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-pointer hover:bg-rose-500/20 hover:text-rose-300"
                    title="Tap to remove"
                  >
                    {tok}
                  </span>
                ))
              )}
            </div>

            {/* Token Bank */}
            <div className="flex flex-wrap gap-2">
              {step.interactiveTry.tokens.map((token, i) => {
                const isPlaced = interactiveTokens.includes(token);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isPlaced}
                    onClick={() => handleTokenTap(token)}
                    className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isPlaced
                        ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800'
                        : 'bg-white text-slate-800 border-b-2 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-950 cursor-pointer'
                    }`}
                  >
                    {token}
                  </button>
                );
              })}
            </div>

            {/* Live Terminal Output Simulator */}
            {isInteractiveComplete && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center gap-2 text-xs font-mono text-emerald-300 animate-pop">
                <span className="text-slate-500">&gt; Output:</span>
                <span className="font-bold text-white">
                  {step.interactiveTry.previewOutput}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step Dots & Next Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {intro.steps.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'w-7 bg-brand-green'
                    : i < currentStepIndex
                    ? 'bg-brand-green/40'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleNextStep}
            className="btn-3d btn-3d-green py-3.5 px-6 rounded-2xl text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2"
          >
            <span>{isLastStep ? "Let's Practice! (+XP)" : 'Next Concept'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
