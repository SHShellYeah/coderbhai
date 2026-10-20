import React, { useState } from 'react';
import { Question, TapToFillQuestion, SpotTheBugQuestion, PredictOutputQuestion, ConceptMatchQuestion } from '../../types';
import { useGame } from '../../context/GameContext';
import { COURSES } from '../../data/courses';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti, stopConfetti } from '../../utils/confetti';
import { Heart, X, CheckCircle, RotateCcw, Zap } from 'lucide-react';
import { TapToFill } from '../lesson/TapToFill';
import { SpotTheBug } from '../lesson/SpotTheBug';
import { PredictOutput } from '../lesson/PredictOutput';
import { ConceptMatch } from '../lesson/ConceptMatch';
import { FeedbackBanner } from '../lesson/FeedbackBanner';

interface Props {
  onClose: () => void;
  onOpenSpeedTraining?: () => void;
}

export const PracticeModal: React.FC<Props> = ({ onClose, onOpenSpeedTraining }) => {
  const { state, resolveMistake, refillHearts } = useGame();
  const activeCourse = COURSES[state.activeCourseId] || COURSES.cpp;

  // Pool questions from user's mistakes or from course nodes
  const [practicePool] = useState<Question[]>(() => {
    if (state.mistakes.length > 0) {
      return state.mistakes.slice(0, 5);
    }
    // Fallback: pick 3 questions from course
    const allQs = activeCourse.units.flatMap(u => u.nodes.flatMap(n => n.questions));
    return allQs.slice(0, 3);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [heartsRestored, setHeartsRestored] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Clean up any confetti when modal unmounts
  React.useEffect(() => {
    return () => {
      stopConfetti();
    };
  }, []);

  // Question Inputs
  const [tapAnswers, setTapAnswers] = useState<Record<string, string>>({});
  const [activeBlankId, setActiveBlankId] = useState<string>('blank1');
  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null);
  const [selectedOutputOption, setSelectedOutputOption] = useState<string | null>(null);
  const [isConceptAllMatched, setIsConceptAllMatched] = useState<boolean>(false);

  // Feedback
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');

  const currentQ: Question | undefined = practicePool[currentIdx];

  const canCheckAnswer = (): boolean => {
    if (!currentQ || isAnswerSubmitted) return false;
    switch (currentQ.type) {
      case 'tap-to-fill': {
        const q = currentQ as TapToFillQuestion;
        return q.blanks.every(b => !!tapAnswers[b.id]);
      }
      case 'spot-the-bug':
        return selectedBugLine !== null;
      case 'predict-output':
        return selectedOutputOption !== null;
      case 'concept-match':
        return isConceptAllMatched;
      default:
        return false;
    }
  };

  const handleCheckAnswer = () => {
    if (!currentQ || isAnswerSubmitted) return;

    let ansCorrect = false;
    let exp = currentQ.explanation;

    switch (currentQ.type) {
      case 'tap-to-fill': {
        const q = currentQ as TapToFillQuestion;
        ansCorrect = q.blanks.every(b => tapAnswers[b.id] === b.correctValue);
        break;
      }
      case 'spot-the-bug': {
        const q = currentQ as SpotTheBugQuestion;
        ansCorrect = selectedBugLine === q.bugLineIndex;
        if (!ansCorrect) exp = q.bugExplanation;
        break;
      }
      case 'predict-output': {
        const q = currentQ as PredictOutputQuestion;
        const opt = q.options.find(o => o.id === selectedOutputOption);
        ansCorrect = !!opt?.isCorrect;
        break;
      }
      case 'concept-match': {
        ansCorrect = isConceptAllMatched;
        break;
      }
    }

    setIsCorrect(ansCorrect);
    setExplanation(exp);
    setIsAnswerSubmitted(true);

    if (ansCorrect) {
      sound.playSuccess();
      resolveMistake(currentQ.id);
      setHeartsRestored(prev => prev + 1);
    } else {
      sound.playError();
    }
  };

  const handleContinue = () => {
    setIsAnswerSubmitted(false);
    setTapAnswers({});
    setActiveBlankId('blank1');
    setSelectedBugLine(null);
    setSelectedOutputOption(null);
    setIsConceptAllMatched(false);

    const nextIndex = currentIdx + 1;
    if (nextIndex < practicePool.length) {
      setCurrentIdx(nextIndex);
    } else {
      refillHearts('free');
      sound.playFanfare();
      fireSuccessConfetti();
      setIsFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#131F24] flex flex-col justify-between overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#131F24]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-xl mx-4">
          <div className="flex items-center justify-between text-xs font-black uppercase text-brand-green mb-1">
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Practice & Refill Hearts
            </span>
            <span>{currentIdx + 1} / {practicePool.length}</span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-green rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / practicePool.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSpeedTraining && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenSpeedTraining();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
              title="Launch Speed Training & DSA Roadmaps"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span className="hidden xs:inline">Speed Training</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-brand-rose font-black text-sm">
            <Heart className="w-5 h-5 fill-current" />
            <span>+{heartsRestored}</span>
          </div>
        </div>
      </header>

      {/* Question Engine */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center items-center pb-32">
        {currentQ && !isFinished && (
          <div className="w-full animate-pop">
            {currentQ.type === 'tap-to-fill' && (
              <TapToFill
                question={currentQ as TapToFillQuestion}
                userAnswers={tapAnswers}
                onSelectAnswer={(id, val) => setTapAnswers(p => ({ ...p, [id]: val }))}
                onClearBlank={id =>
                  setTapAnswers(p => {
                    const c = { ...p };
                    delete c[id];
                    return c;
                  })
                }
                activeBlankId={activeBlankId}
                setActiveBlankId={setActiveBlankId}
                isAnswerSubmitted={isAnswerSubmitted}
                isCorrect={isCorrect}
              />
            )}

            {currentQ.type === 'spot-the-bug' && (
              <SpotTheBug
                question={currentQ as SpotTheBugQuestion}
                selectedLineIndex={selectedBugLine}
                onSelectLine={setSelectedBugLine}
                isAnswerSubmitted={isAnswerSubmitted}
                isCorrect={isCorrect}
              />
            )}

            {currentQ.type === 'predict-output' && (
              <PredictOutput
                question={currentQ as PredictOutputQuestion}
                selectedOptionId={selectedOutputOption}
                onSelectOption={setSelectedOutputOption}
                isAnswerSubmitted={isAnswerSubmitted}
                isCorrect={isCorrect}
              />
            )}

            {currentQ.type === 'concept-match' && (
              <ConceptMatch
                question={currentQ as ConceptMatchQuestion}
                onAllMatched={() => setIsConceptAllMatched(true)}
                isAnswerSubmitted={isAnswerSubmitted}
              />
            )}
          </div>
        )}

        {isFinished && (
          <div className="w-full max-w-md bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center gap-6 animate-pop">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-brand-green flex items-center justify-center">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
                Hearts Restored!
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
                You successfully reviewed your weak areas. All 5 hearts are refilled and ready for your next lesson!
              </p>
            </div>

            <div className="flex items-center gap-2 text-2xl font-black text-brand-rose">
              <Heart className="w-7 h-7 fill-current animate-bounce" />
              <span>Full 5 / 5 Hearts</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-3d btn-3d-green w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider"
            >
              Back to Dashboard
            </button>

            {onOpenSpeedTraining && (
              <button
                type="button"
                onClick={onOpenSpeedTraining}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Zap className="w-4 h-4 fill-current text-amber-400" />
                <span>Jump into Speed Training & PBs</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* Action Footer */}
      {!isAnswerSubmitted && !isFinished && (
        <footer className="sticky bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131F24]/95 backdrop-blur">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400">
              Practice mistakes to heal hearts and strengthen memory
            </div>
            <button
              type="button"
              disabled={!canCheckAnswer()}
              onClick={handleCheckAnswer}
              className={`btn-3d w-full sm:w-auto min-w-[160px] py-3.5 px-8 rounded-2xl text-base font-black uppercase tracking-wider ${
                canCheckAnswer()
                  ? 'btn-3d-green'
                  : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-900 cursor-not-allowed'
              }`}
            >
              Verify Answer
            </button>
          </div>
        </footer>
      )}

      {/* Feedback Banner */}
      {isAnswerSubmitted && (
        <FeedbackBanner
          isCorrect={isCorrect}
          explanation={explanation}
          xpEarned={currentQ?.xpReward || 10}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};
