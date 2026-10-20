import React, { useState, useEffect, useMemo } from 'react';
import { CourseId } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti, stopConfetti } from '../../utils/confetti';
import { CatFace } from '../common/CatFace';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  BookOpen,
  Terminal,
  Zap,
  Code2,
  Shield,
  Clock,
  Gem,
  X,
  Compass
} from 'lucide-react';

interface Props {
  initialCourseId?: CourseId;
  onClose: () => void;
}

type KnowledgeLevel = 'beginner' | 'basics' | 'intermediate' | 'advanced';

interface KnowledgeOption {
  id: KnowledgeLevel;
  badge: string;
  title: string;
  description: string;
  startingPlacementText: string;
  unitOffset: number;
}

const KNOWLEDGE_OPTIONS: KnowledgeOption[] = [
  {
    id: 'beginner',
    badge: '🌱',
    title: 'Complete Beginner',
    description: "I've never written a line of code in this language. Guide me from the very start!",
    startingPlacementText: 'Unit 1: Foundations & Hello World',
    unitOffset: 1,
  },
  {
    id: 'basics',
    badge: '⚡',
    title: 'Know the Syntax Basics',
    description: 'I understand variables, basic data types, print statements, and simple if/else logic.',
    startingPlacementText: 'Unit 1 (Mid): Conditionals, Loops & Control Flow',
    unitOffset: 1,
  },
  {
    id: 'intermediate',
    badge: '🚀',
    title: 'Intermediate / Comfortable',
    description: 'I am comfortable with loops, functions, arrays, and standard problem-solving concepts.',
    startingPlacementText: 'Unit 2: Modular Programming & Structures',
    unitOffset: 2,
  },
  {
    id: 'advanced',
    badge: '👑',
    title: 'Experienced / Fast-Tracker',
    description: 'I know this language well. Jump straight to advanced algorithms, pointers & interview prep!',
    startingPlacementText: 'Unit 3: Advanced Optimization & Algorithms',
    unitOffset: 3,
  },
];

interface CommitmentOption {
  days: number;
  badge: string;
  title: string;
  paceTag: string;
  description: string;
  minsPerDay: string;
}

const COMMITMENT_OPTIONS: CommitmentOption[] = [
  {
    days: 3,
    badge: '☕',
    title: '3 Days / Week',
    paceTag: 'Casual Pace',
    description: 'Relaxed, steady learning that fits effortlessly into any busy calendar.',
    minsPerDay: '5–10 mins / day',
  },
  {
    days: 5,
    badge: '🎯',
    title: '5 Days / Week',
    paceTag: 'Recommended',
    description: 'Fast skill acquisition during the weekdays with weekends free to relax.',
    minsPerDay: '15–20 mins / day',
  },
  {
    days: 7,
    badge: '🔥',
    title: '7 Days / Week',
    paceTag: 'Streak Champion',
    description: 'Daily consistency master! Build an unbreakable streak and climb the rankings.',
    minsPerDay: '20–30 mins / day',
  },
];

export const ByteOnboardingModal: React.FC<Props> = ({ initialCourseId, onClose }) => {
  const { state, applyCustomCoursePlan } = useGame();

  // Current onboarding stage: 1 = Course, 2 = Knowledge, 3 = Commitment, 4 = Brewing, 5 = Plan Ready
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(initialCourseId || state.activeCourseId || 'cpp');
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>('beginner');
  const [commitmentDays, setCommitmentDays] = useState<number>(5);
  const [catMood, setCatMood] = useState<'happy' | 'cheering' | 'thinking' | 'idle'>('happy');
  const [brewingProgress, setBrewingProgress] = useState(0);

  const selectedCourse = COURSES[selectedCourseId] || COURSES.cpp;

  // Cleanup confetti when closing
  useEffect(() => {
    return () => {
      stopConfetti();
    };
  }, []);

  // Update cat mood on step transition
  useEffect(() => {
    if (step === 1) setCatMood('happy');
    else if (step === 2) setCatMood('thinking');
    else if (step === 3) setCatMood('cheering');
    else if (step === 4) setCatMood('thinking');
    else if (step === 5) setCatMood('cheering');
  }, [step]);

  // Handle plan brewing animation
  useEffect(() => {
    if (step === 4) {
      setBrewingProgress(0);
      const interval = setInterval(() => {
        setBrewingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep(5);
            sound.playFanfare();
            fireSuccessConfetti();
            return 100;
          }
          return prev + 20;
        });
      }, 180);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleCatPet = () => {
    sound.playMeow();
    setCatMood('cheering');
    setTimeout(() => {
      if (step === 2 || step === 4) setCatMood('thinking');
      else setCatMood('happy');
    }, 1500);
  };

  // Compute customized starting node details
  const startingPlacementInfo = useMemo(() => {
    const course = selectedCourse;
    if (!course || !course.units || course.units.length === 0) {
      return { unitTitle: 'Unit 1', unitIndex: 1, nodeTitle: 'First Lesson', nodeId: '' };
    }

    if (knowledgeLevel === 'advanced') {
      const unitIdx = Math.min(2, course.units.length - 1);
      const unit = course.units[unitIdx];
      const node = unit.nodes[0] || course.units[0].nodes[0];
      return {
        unitTitle: unit.title,
        unitIndex: unitIdx + 1,
        nodeTitle: node?.title || 'Advanced Master Lesson',
        nodeId: node?.id || '',
      };
    }

    if (knowledgeLevel === 'intermediate') {
      const unitIdx = Math.min(1, course.units.length - 1);
      const unit = course.units[unitIdx];
      const node = unit.nodes[0] || course.units[0].nodes[0];
      return {
        unitTitle: unit.title,
        unitIndex: unitIdx + 1,
        nodeTitle: node?.title || 'Core Data Structures',
        nodeId: node?.id || '',
      };
    }

    if (knowledgeLevel === 'basics') {
      const unit = course.units[0];
      const node = unit.nodes[2] || unit.nodes[0];
      return {
        unitTitle: unit.title,
        unitIndex: 1,
        nodeTitle: node?.title || 'Control Flow & Logic',
        nodeId: node?.id || '',
      };
    }

    // Beginner
    const unit = course.units[0];
    const node = unit.nodes[0];
    return {
      unitTitle: unit.title,
      unitIndex: 1,
      nodeTitle: node?.title || 'Hello World & First Steps',
      nodeId: node?.id || '',
    };
  }, [selectedCourse, knowledgeLevel]);

  const handleFinalStart = () => {
    sound.playSuccess();
    applyCustomCoursePlan(selectedCourseId, knowledgeLevel, commitmentDays);
    onClose();
  };

  // Available courses list
  const coursesList = Object.values(COURSES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scaleUp">
        {/* Subtle Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-primary via-purple-500 to-amber-400" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer z-10"
          title="Close onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Byte the Cat */}
        <div className="p-5 sm:p-6 pb-3 flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
          <div
            onClick={handleCatPet}
            className="cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
            title="Click Byte for encouragement!"
          >
            <CatFace mood={catMood} size="md" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-brand-primary">
                Byte&apos;s Guided Onboarding
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                {step <= 3 ? `Step ${step} of 3` : step === 4 ? 'Brewing...' : 'Plan Ready!'}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
              {step === 1 && 'What do you want to learn?'}
              {step === 2 && `How much ${selectedCourse.shortTitle || selectedCourse.title} do you know?`}
              {step === 3 && 'What is your weekly commitment?'}
              {step === 4 && 'Byte is crafting your custom path...'}
              {step === 5 && 'Your Personalized Course Plan!'}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* STEP 1: SELECT COURSE */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-brand-primary/10 dark:bg-brand-primary/15 border border-brand-primary/30 rounded-2xl p-3 text-xs text-brand-primary font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-brand-primary" />
                <span>Choose any programming track. Byte will tailor your starting spot and pace!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {coursesList.map(c => {
                  const isSelected = selectedCourseId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedCourseId(c.id);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 text-left ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 shadow-md ring-2 ring-brand-primary/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {c.id === 'cpp' ? '⚡' : c.id === 'c' ? '⚙️' : c.id === 'python' ? '🐍' : c.id === 'oop' ? '🧩' : c.id === 'dsa' ? '🌲' : '🚀'}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                              {c.title}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {c.units.length} Units • {c.units.reduce((acc, u) => acc + u.nodes.length, 0)} Lessons
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {c.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setStep(2);
                }}
                className="btn-3d btn-3d-primary w-full py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
              >
                <span>Continue: Prior Knowledge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PRIOR KNOWLEDGE */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  Track: <strong className="text-slate-900 dark:text-white">{selectedCourse.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStep(1);
                  }}
                  className="text-xs font-black text-brand-primary hover:underline cursor-pointer"
                >
                  Change Track
                </button>
              </div>

              <div className="space-y-2.5">
                {KNOWLEDGE_OPTIONS.map(opt => {
                  const isSelected = knowledgeLevel === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        sound.playClick();
                        setKnowledgeLevel(opt.id);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 text-left ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 shadow-md ring-2 ring-brand-primary/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {opt.badge}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            {opt.title}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {opt.description}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300">
                          <Compass className="w-3 h-3 text-brand-primary" />
                          <span>Starts at: {opt.startingPlacementText}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStep(1);
                  }}
                  className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-black uppercase text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStep(3);
                  }}
                  className="btn-3d btn-3d-primary flex-1 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Continue: Weekly Commitment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COMMITMENT */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2.5">
                <Flame className="w-4 h-4 shrink-0 text-amber-500 animate-wiggle" />
                <span>Coding is a muscle memory skill! Setting a realistic daily habit creates high retention.</span>
              </div>

              <div className="space-y-2.5">
                {COMMITMENT_OPTIONS.map(opt => {
                  const isSelected = commitmentDays === opt.days;
                  return (
                    <div
                      key={opt.days}
                      onClick={() => {
                        sound.playClick();
                        setCommitmentDays(opt.days);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 text-left ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 shadow-md ring-2 ring-amber-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {opt.badge}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                              {opt.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {opt.paceTag}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {opt.description}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400">
                          <Clock className="w-3 h-3" />
                          <span>Pace target: {opt.minsPerDay}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStep(2);
                  }}
                  className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-black uppercase text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStep(4);
                  }}
                  className="btn-3d btn-3d-primary flex-1 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-gradient-to-r from-amber-500 to-brand-primary"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Brew My Custom Course Plan 🪄</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BREWING ANIMATION */}
          {step === 4 && (
            <div className="py-10 text-center space-y-6 animate-fadeIn">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
                <CatFace mood="thinking" size="lg" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Byte is calibrating your course roadmap...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Analyzing {selectedCourse.title} units, locking in your {commitmentDays}-day streak goal, and unlocking your customized starting milestone!
                </p>
              </div>

              <div className="w-64 max-w-full mx-auto space-y-1.5">
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary via-purple-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${brewingProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {brewingProgress}%
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: CUSTOMIZED PLAN READY */}
          {step === 5 && (
            <div className="space-y-4 animate-scaleUp">
              {/* Plan Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 border-2 border-brand-primary/40 shadow-inner space-y-4 text-left">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-purple-600 text-white flex items-center justify-center font-black shadow-md text-xl">
                      {selectedCourseId === 'cpp' ? '⚡' : selectedCourseId === 'c' ? '⚙️' : selectedCourseId === 'python' ? '🐍' : '🚀'}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-brand-primary tracking-wider">
                        Tailored Roadmap
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {selectedCourse.title}
                      </h4>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Calibrated</span>
                  </span>
                </div>

                {/* Customized Starting Point */}
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-brand-primary/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-black text-brand-primary">
                    <Compass className="w-4 h-4 text-brand-primary" />
                    <span>Your Starting Place on the Winding Path:</span>
                  </div>

                  <div className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-brand-primary text-white text-xs font-black">
                      Unit {startingPlacementInfo.unitIndex}
                    </span>
                    <span className="truncate">{startingPlacementInfo.nodeTitle}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    {knowledgeLevel === 'beginner'
                      ? "Starting at the very foundation: we will guide you from zero syntax to confidence!"
                      : `Fast-tracked past early basics based on your ${knowledgeLevel} experience so you never waste time.`}
                  </p>
                </div>

                {/* Milestone & Rewards Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 fill-current text-amber-500" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Commitment Goal</span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {commitmentDays} Days / Week
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Gem className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Welcome Pouch</span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        +50 XP & +30 💎
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  onClick={handleFinalStart}
                  className="btn-3d btn-3d-primary w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl bg-gradient-to-r from-brand-primary via-indigo-600 to-emerald-500 hover:brightness-110"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Start Learning: {startingPlacementInfo.nodeTitle} 🚀</span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setStep(1);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-200 hover:underline cursor-pointer"
                  >
                    Adjust Course or Pace Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
