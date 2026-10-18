import React, { useState } from 'react';
import { CourseId, Question, TapToFillQuestion, SpotTheBugQuestion, PredictOutputQuestion, ConceptMatchQuestion } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti, stopConfetti } from '../../utils/confetti';
import { CatFace } from '../common/CatFace';
import { Sparkles, Compass, CheckCircle, ArrowRight, X } from 'lucide-react';
import { TapToFill } from '../lesson/TapToFill';
import { SpotTheBug } from '../lesson/SpotTheBug';
import { PredictOutput } from '../lesson/PredictOutput';
import { ConceptMatch } from '../lesson/ConceptMatch';
import { FeedbackBanner } from '../lesson/FeedbackBanner';

interface Props {
  courseId: CourseId;
  onClose: () => void;
}

export const PlacementModal: React.FC<Props> = ({ courseId, onClose }) => {
  const { completePlacementTest, startScratch } = useGame();
  const course = COURSES[courseId] || COURSES.cpp;

  // Flow State: 'prompt' | 'quiz' | 'result'
  const [stage, setStage] = useState<'prompt' | 'quiz' | 'result'>('prompt');

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);

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

  const questions = course.placementQuestions;
  const currentQuestion: Question | undefined = questions[currentQIndex];

  const handleStartScratch = () => {
    sound.playClick();
    startScratch(courseId);
    onClose();
  };

  const handleStartPlacement = () => {
    sound.playClick();
    setStage('quiz');
  };

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

    let ansCorrect = false;
    let exp = currentQuestion.explanation;

    switch (currentQuestion.type) {
      case 'tap-to-fill': {
        const q = currentQuestion as TapToFillQuestion;
        ansCorrect = q.blanks.every(b => tapAnswers[b.id] === b.correctValue);
        break;
      }
      case 'spot-the-bug': {
        const q = currentQuestion as SpotTheBugQuestion;
        ansCorrect = selectedBugLine === q.bugLineIndex;
        if (!ansCorrect) exp = q.bugExplanation;
        break;
      }
      case 'predict-output': {
        const q = currentQuestion as PredictOutputQuestion;
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
      setScore(prev => prev + 1);
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

    const nextIndex = currentQIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQIndex(nextIndex);
    } else {
      // Finished all placement questions
      sound.playFanfare();
      fireSuccessConfetti();
      completePlacementTest(courseId, score + (isCorrect ? 1 : 0));
      setStage('result');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      {/* Choice Prompt Screen */}
      {stage === 'prompt' && (
        <div className="w-full max-w-lg bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center relative flex flex-col items-center gap-6 animate-pop">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-3 rounded-3xl bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center shadow-lg animate-bounceShort">
            <CatFace mood="happy" size="lg" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-brand-blue">
              Welcome to {course.title}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
              Choose your starting point
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
              Are you learning {course.title} for the first time, or do you already know some coding?
            </p>
          </div>

          {/* Two Distinct Choices */}
          <div className="w-full flex flex-col gap-3.5">
            {/* Choice 1: Start from Scratch */}
            <button
              type="button"
              onClick={handleStartScratch}
              className="btn-3d w-full p-4 rounded-2xl flex items-center justify-between text-left bg-white text-slate-800 border-b-4 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-950 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-black">Start from Scratch</div>
                  <div className="text-xs font-semibold text-slate-400">
                    Begin at Unit 1, Lesson 1 with gentle basics
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-green transition-colors" />
            </button>

            {/* Choice 2: Adaptive Placement Test */}
            <button
              type="button"
              onClick={handleStartPlacement}
              className="btn-3d btn-3d-green w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-black text-white">
                    Adaptive Placement Test
                  </div>
                  <div className="text-xs font-semibold text-white/90">
                    5-question quick quiz to test out and jump ahead
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Adaptive Quiz Screen */}
      {stage === 'quiz' && currentQuestion && (
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
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 mb-1">
                <span>Adaptive Placement</span>
                <span>Question {currentQIndex + 1} of {questions.length}</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-blue rounded-full transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <span className="text-xs font-black uppercase text-brand-blue px-2.5 py-1 rounded-full bg-brand-blue/10">
              {currentQuestion.difficulty || 'adaptive'}
            </span>
          </header>

          {/* Question Component */}
          <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center items-center pb-32">
            <div className="w-full animate-pop">
              {currentQuestion.type === 'tap-to-fill' && (
                <TapToFill
                  question={currentQuestion as TapToFillQuestion}
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

              {currentQuestion.type === 'spot-the-bug' && (
                <SpotTheBug
                  question={currentQuestion as SpotTheBugQuestion}
                  selectedLineIndex={selectedBugLine}
                  onSelectLine={setSelectedBugLine}
                  isAnswerSubmitted={isAnswerSubmitted}
                  isCorrect={isCorrect}
                />
              )}

              {currentQuestion.type === 'predict-output' && (
                <PredictOutput
                  question={currentQuestion as PredictOutputQuestion}
                  selectedOptionId={selectedOutputOption}
                  onSelectOption={setSelectedOutputOption}
                  isAnswerSubmitted={isAnswerSubmitted}
                  isCorrect={isCorrect}
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
          </main>

          {/* Action Footer */}
          {!isAnswerSubmitted && (
            <footer className="sticky bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131F24]/95 backdrop-blur">
              <div className="max-w-3xl mx-auto flex items-center justify-end">
                <button
                  type="button"
                  disabled={!canCheckAnswer()}
                  onClick={handleCheckAnswer}
                  className={`btn-3d w-full sm:w-auto min-w-[160px] py-3.5 px-8 rounded-2xl text-base font-black uppercase tracking-wider ${
                    canCheckAnswer()
                      ? 'btn-3d-blue'
                      : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-900 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              </div>
            </footer>
          )}

          {/* Feedback Banner */}
          {isAnswerSubmitted && (
            <FeedbackBanner
              isCorrect={isCorrect}
              explanation={explanation}
              xpEarned={currentQuestion.xpReward}
              onContinue={handleContinue}
            />
          )}
        </div>
      )}

      {/* Result Screen */}
      {stage === 'result' && (
        <div className="w-full max-w-md bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center gap-6 animate-pop">
          <div className="w-20 h-20 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
              Placement Completed!
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
              You scored <span className="text-brand-green font-bold">{score} / {questions.length}</span>!
              {score >= 4
                ? ' Incredible work! You demonstrated advanced fluency. Units 1 and 2 are unlocked.'
                : score >= 2
                ? ' Great job! Early nodes have been completed and your path is prepared.'
                : ' Great start! We have unlocked Unit 1, Lesson 1 for you to build solid foundations.'}
            </p>
          </div>

          <div className="w-full p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-around">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">Bonus XP</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">+40 XP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase text-brand-blue">Gems</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">+25 💎</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-3d btn-3d-green w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider"
          >
            Start Path
          </button>
        </div>
      )}
    </div>
  );
};
