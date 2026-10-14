import React, { useState } from 'react';
import { LessonNode, Question, TapToFillQuestion, SpotTheBugQuestion, PredictOutputQuestion, ConceptMatchQuestion } from '../../types';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { X, Heart, AlertTriangle, Lightbulb } from 'lucide-react';
import { TapToFill } from './TapToFill';
import { SpotTheBug } from './SpotTheBug';
import { PredictOutput } from './PredictOutput';
import { ConceptMatch } from './ConceptMatch';
import { FeedbackBanner } from './FeedbackBanner';
import { LessonCompleteModal } from './LessonCompleteModal';
import { OutOfHeartsModal } from './OutOfHeartsModal';
import { CharacterIntroModal } from './CharacterIntroModal';
import { CHARACTERS } from '../../data/characters';

interface Props {
  node: LessonNode;
  onClose: () => void;
  onOpenPractice: () => void;
}

export const LessonModal: React.FC<Props> = ({
  node,
  onClose,
  onOpenPractice,
}) => {
  const { state, completeNodeLesson, deductHeart, addMistake } = useGame();

  // Character Teaching Intro Modal state
  const [showIntro, setShowIntro] = useState<boolean>(!!node.teachingIntro);
  const [showMentorTip, setShowMentorTip] = useState<boolean>(false);

  // Adaptive Question Queue
  const [questionQueue, setQuestionQueue] = useState<Question[]>([...node.questions]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  // Tracking initial total and unique completions for progress bar
  const totalUniqueQuestions = node.questions.length;
  const [completedUniqueIds, setCompletedUniqueIds] = useState<Set<string>>(new Set());
  const [firstAttemptMistakes, setFirstAttemptMistakes] = useState<Set<string>>(new Set());

  // Input states for different question types
  const [tapAnswers, setTapAnswers] = useState<Record<string, string>>({});
  const [activeBlankId, setActiveBlankId] = useState<string>('blank1');

  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null);
  const [selectedOutputOption, setSelectedOutputOption] = useState<string | null>(null);
  const [isConceptAllMatched, setIsConceptAllMatched] = useState<boolean>(false);

  // Evaluation & Feedback State
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState<boolean>(false);
  const [currentExplanation, setCurrentExplanation] = useState<string>('');
  const [earnedXpTotal, setEarnedXpTotal] = useState<number>(0);

  // Modal States
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState<boolean>(false);

  const currentQuestion = questionQueue[currentQueueIndex];

  // Determine if user has made an active input to enable the "Check" button
  const canCheckAnswer = (): boolean => {
    if (!currentQuestion || isAnswerSubmitted) return false;

    switch (currentQuestion.type) {
      case 'tap-to-fill': {
        const q = currentQuestion as TapToFillQuestion;
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
    if (!currentQuestion || isAnswerSubmitted) return;

    let correct = false;
    let explanation = currentQuestion.explanation;

    switch (currentQuestion.type) {
      case 'tap-to-fill': {
        const q = currentQuestion as TapToFillQuestion;
        correct = q.blanks.every(b => tapAnswers[b.id] === b.correctValue);
        break;
      }
      case 'spot-the-bug': {
        const q = currentQuestion as SpotTheBugQuestion;
        correct = selectedBugLine === q.bugLineIndex;
        if (!correct) {
          explanation = q.bugExplanation || q.explanation;
        }
        break;
      }
      case 'predict-output': {
        const q = currentQuestion as PredictOutputQuestion;
        const selectedOpt = q.options.find(o => o.id === selectedOutputOption);
        correct = !!selectedOpt?.isCorrect;
        break;
      }
      case 'concept-match': {
        correct = isConceptAllMatched;
        break;
      }
    }

    setIsCurrentAnswerCorrect(correct);
    setCurrentExplanation(explanation);
    setIsAnswerSubmitted(true);

    if (correct) {
      sound.playSuccess();
      setEarnedXpTotal(prev => prev + currentQuestion.xpReward);
      setCompletedUniqueIds(prev => new Set(prev).add(currentQuestion.id));
    } else {
      sound.playError();
      const stillAlive = deductHeart();
      addMistake(currentQuestion);

      setFirstAttemptMistakes(prev => new Set(prev).add(currentQuestion.id));

      // Adaptive Mistake Loop: Append question to end of queue so user masters it!
      setQuestionQueue(prev => [...prev, currentQuestion]);

      if (!stillAlive) {
        setShowOutOfHearts(true);
      }
    }
  };

  const handleContinueAfterFeedback = () => {
    setIsAnswerSubmitted(false);

    // Reset input states for next question
    setTapAnswers({});
    setActiveBlankId('blank1');
    setSelectedBugLine(null);
    setSelectedOutputOption(null);
    setIsConceptAllMatched(false);

    const nextIndex = currentQueueIndex + 1;
    if (nextIndex < questionQueue.length) {
      setCurrentQueueIndex(nextIndex);
    } else {
      // Completed all questions in the queue!
      const totalFirstAttempts = totalUniqueQuestions;
      const mistakesCount = firstAttemptMistakes.size;
      const accuracy = Math.round(
        Math.max(0, ((totalFirstAttempts - mistakesCount) / totalFirstAttempts) * 100)
      );

      completeNodeLesson(node.id, earnedXpTotal, 15, accuracy);
      setIsFinished(true);
    }
  };

  // Progress Bar Percentage
  const progressPercent = Math.min(
    100,
    Math.round((completedUniqueIds.size / totalUniqueQuestions) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#131F24] flex flex-col justify-between overflow-y-auto">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#131F24]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Exit Button */}
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Exit lesson"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Animated Progress Bar */}
        <div className="flex-1 max-w-xl mx-2 md:mx-6">
          <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
            <div
              className="h-full bg-brand-green rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${Math.max(6, progressPercent)}%` }}
            >
              {/* Highlight shine */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full" />
            </div>
          </div>
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-brand-rose font-black text-sm md:text-base">
          <Heart className="w-5 h-5 fill-brand-rose stroke-brand-rose animate-pulse" />
          <span>{state.hearts}</span>
        </div>
      </header>

      {/* Character Teaching Intro Modal */}
      {showIntro && node.teachingIntro && (
        <CharacterIntroModal
          intro={node.teachingIntro}
          onFinishIntro={() => setShowIntro(false)}
          onSkipIntro={() => setShowIntro(false)}
        />
      )}

      {/* Main Question Body */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center items-center pb-32">
        {/* Mentor Hint Bar */}
        {currentQuestion && (
          <div className="w-full flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowMentorTip(!showMentorTip);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-amber-500/20"
            >
              <Lightbulb className="w-4 h-4 fill-current" />
              <span>{showMentorTip ? 'Hide Hint' : 'Mentor Tip 💡'}</span>
            </button>

            {node.teachingIntro && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowIntro(true);
                }}
                className="text-xs font-extrabold text-brand-blue hover:underline cursor-pointer"
              >
                Review Intro 📖
              </button>
            )}
          </div>
        )}

        {/* Floating Mentor Tip Speech Bubble */}
        {showMentorTip && currentQuestion && (
          <div className="w-full p-4 mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 flex items-start gap-3.5 text-left animate-pop shadow-md">
            <span className="text-3xl select-none">🐈‍⬛</span>
            <div className="flex-1">
              <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 block mb-0.5">
                Bhai's Pro Tip:
              </span>
              <p className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                {currentQuestion.mentorTip || currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}

        {currentQuestion && (
          <div className="w-full animate-pop">
            {currentQuestion.type === 'tap-to-fill' && (
              <TapToFill
                question={currentQuestion as TapToFillQuestion}
                userAnswers={tapAnswers}
                onSelectAnswer={(blankId, val) =>
                  setTapAnswers(prev => ({ ...prev, [blankId]: val }))
                }
                onClearBlank={blankId =>
                  setTapAnswers(prev => {
                    const copy = { ...prev };
                    delete copy[blankId];
                    return copy;
                  })
                }
                activeBlankId={activeBlankId}
                setActiveBlankId={setActiveBlankId}
                isAnswerSubmitted={isAnswerSubmitted}
                isCorrect={isCurrentAnswerCorrect}
              />
            )}

            {currentQuestion.type === 'spot-the-bug' && (
              <SpotTheBug
                question={currentQuestion as SpotTheBugQuestion}
                selectedLineIndex={selectedBugLine}
                onSelectLine={setSelectedBugLine}
                isAnswerSubmitted={isAnswerSubmitted}
                isCorrect={isCurrentAnswerCorrect}
              />
            )}

            {currentQuestion.type === 'predict-output' && (
              <PredictOutput
                question={currentQuestion as PredictOutputQuestion}
                selectedOptionId={selectedOutputOption}
                onSelectOption={setSelectedOutputOption}
                isAnswerSubmitted={isAnswerSubmitted}
                isCorrect={isCurrentAnswerCorrect}
              />
            )}

            {currentQuestion.type === 'concept-match' && (
              <ConceptMatch
                question={currentQuestion as ConceptMatchQuestion}
                onAllMatched={() => setIsConceptAllMatched(true)}
                isAnswerSubmitted={isAnswerSubmitted}
              />
            )}
          </div>
        )}
      </main>

      {/* Bottom Sticky Action Footer (when feedback banner is not yet shown) */}
      {!isAnswerSubmitted && (
        <footer className="sticky bottom-0 left-0 right-0 p-4 md:py-5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131F24]/95 backdrop-blur">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="text-xs font-semibold text-slate-400 hidden sm:block">
              {currentQuestion?.type === 'concept-match'
                ? 'Match all pairs to proceed'
                : 'Select your answer and press Check'}
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
              Check Answer
            </button>
          </div>
        </footer>
      )}

      {/* Slide-up Feedback Banner */}
      {isAnswerSubmitted && (
        <FeedbackBanner
          isCorrect={isCurrentAnswerCorrect}
          explanation={currentExplanation}
          xpEarned={currentQuestion.xpReward}
          onContinue={handleContinueAfterFeedback}
        />
      )}

      {/* Lesson Complete Screen */}
      {isFinished && (
        <LessonCompleteModal
          totalXp={earnedXpTotal}
          accuracy={Math.round(
            Math.max(
              0,
              ((totalUniqueQuestions - firstAttemptMistakes.size) /
                totalUniqueQuestions) *
                100
            )
          )}
          streak={state.streak}
          onFinish={onClose}
        />
      )}

      {/* Out of Hearts Modal */}
      {showOutOfHearts && (
        <OutOfHeartsModal
          onClose={() => {
            setShowOutOfHearts(false);
            onClose();
          }}
          onStartPractice={() => {
            setShowOutOfHearts(false);
            onClose();
            onOpenPractice();
          }}
        />
      )}

      {/* Quit Lesson Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
          <div className="w-full max-w-sm bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-brand-gold flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
              Quit lesson?
            </h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              All progress in this session will be lost. Are you sure you want to leave?
            </p>
            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="btn-3d btn-3d-green w-full py-3 rounded-2xl text-sm font-black uppercase"
              >
                Keep Learning
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
                className="btn-3d btn-3d-gray w-full py-3 rounded-2xl text-sm font-black uppercase text-rose-500"
              >
                Quit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
