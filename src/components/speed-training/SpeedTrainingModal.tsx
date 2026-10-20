import React, { useState, useEffect, useMemo } from 'react';
import { useDsaProgress } from '../../context/DsaProgressContext';
import { DsaRoadmapId, DsaProblem } from '../../types/dsa';
import { BLIND_75_ROADMAP, NEETCODE_150_ROADMAP } from '../../data/dsaRoadmaps';
import { ArenaChallenge, TrainingStats } from '../../types';
import { getApprovedChallenges } from '../../services/arenaService';
import { getTrainingStats } from '../../services/trainingService';
import { TimedTrainingSection } from '../training/TimedTrainingSection';
import { sound } from '../../utils/audio';
import {
  Zap,
  Brain,
  BookOpen,
  X,
  Terminal,
  AlertCircle,
  Target,
  ChevronRight,
  Flame,
  Trophy,
  Clock,
  Timer
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenBankPractice: () => void;
  onOpenDsaRoadmap: (roadmapId: DsaRoadmapId) => void;
  onOpenInCodeZone: (problem: DsaProblem, roadmapId: DsaRoadmapId) => void;
  initialTab?: 'hub' | 'timed-training';
  initialProblemId?: string;
  onOpenArena?: () => void;
}

export const SpeedTrainingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenBankPractice,
  onOpenDsaRoadmap,
  onOpenInCodeZone,
  initialTab = 'hub',
  initialProblemId,
  onOpenArena
}) => {
  const { progress, getRoadmapProgress } = useDsaProgress();

  // Active view inside Speed Training: 'hub' overview or 'timed-training' full suite
  const [activeTab, setActiveTab] = useState<'hub' | 'timed-training'>('hub');

  const [bankChallenges, setBankChallenges] = useState<ArenaChallenge[]>([]);
  const [bankLoading, setBankLoading] = useState<boolean>(true);
  const [bankError, setBankError] = useState<string | null>(null);

  const [trainingStats, setTrainingStats] = useState<TrainingStats>({
    totalSolved: 0,
    recordsBeaten: 0,
    totalTrainingTimeSeconds: 0
  });

  // Synchronize view tab when modal opens or initialProblemId changes
  useEffect(() => {
    if (isOpen) {
      if (initialProblemId) {
        setActiveTab('timed-training');
      } else if (initialTab) {
        setActiveTab(initialTab);
      }
      setTrainingStats(getTrainingStats());
    }
  }, [isOpen, initialProblemId, initialTab]);

  // Keep statistics fresh whenever user views the hub tab
  useEffect(() => {
    if (isOpen && activeTab === 'hub') {
      setTrainingStats(getTrainingStats());
    }
  }, [isOpen, activeTab]);

  // Load question bank challenges for real metrics
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setBankLoading(true);
    setBankError(null);

    getApprovedChallenges()
      .then((challenges) => {
        if (isMounted) {
          setBankChallenges(challenges);
          setBankLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Failed to load bank challenges in Speed Training Hub:', err);
          setBankError('Could not load community bank challenges.');
          setBankLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Genuine progress metrics
  const b75Progress = useMemo(() => getRoadmapProgress('blind75'), [getRoadmapProgress, progress]);
  const nc150Progress = useMemo(() => getRoadmapProgress('neetcode150'), [getRoadmapProgress, progress]);

  // Calculate unique DSA problems solved across both roadmaps
  const totalDsaSolved = useMemo(() => {
    return Object.values(progress).filter((s) => s === 'solved').length;
  }, [progress]);

  // Find next action item (attempted problem, or first unstarted problem in Blind 75)
  const nextUpProblem = useMemo((): { problem: DsaProblem; roadmapId: DsaRoadmapId } | null => {
    // 1. Check for any currently attempted problem in Blind 75
    const attemptedB75 = BLIND_75_ROADMAP.problems.find((p) => progress[p.id] === 'attempted');
    if (attemptedB75) {
      return { problem: attemptedB75, roadmapId: 'blind75' };
    }

    // 2. Check for any currently attempted problem in NeetCode 150
    const attemptedNc150 = NEETCODE_150_ROADMAP.problems.find((p) => progress[p.id] === 'attempted');
    if (attemptedNc150) {
      return { problem: attemptedNc150, roadmapId: 'neetcode150' };
    }

    // 3. Fallback: First unstarted problem in Blind 75
    const nextUnstartedB75 = BLIND_75_ROADMAP.problems.find((p) => !progress[p.id] || progress[p.id] === 'not-started');
    if (nextUnstartedB75) {
      return { problem: nextUnstartedB75, roadmapId: 'blind75' };
    }

    // 4. Fallback: First unstarted in NeetCode 150
    const nextUnstartedNc150 = NEETCODE_150_ROADMAP.problems.find((p) => !progress[p.id] || progress[p.id] === 'not-started');
    if (nextUnstartedNc150) {
      return { problem: nextUnstartedNc150, roadmapId: 'neetcode150' };
    }

    return null;
  }, [progress]);

  // Bank metrics breakdown
  const bankMetrics = useMemo(() => {
    const easy = bankChallenges.filter((c) => c.difficulty === 'easy').length;
    const medium = bankChallenges.filter((c) => c.difficulty === 'medium').length;
    const hard = bankChallenges.filter((c) => c.difficulty === 'hard').length;
    const categories = Array.from(new Set(bankChallenges.map((c) => c.category))).filter(Boolean);
    return { easy, medium, hard, categoriesCount: categories.length };
  }, [bankChallenges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn text-left">
      <div
        className={`relative w-full ${
          activeTab === 'timed-training'
            ? 'max-w-7xl h-[100dvh] sm:h-[95vh] max-h-[100dvh] sm:max-h-[95vh]'
            : 'max-w-5xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92vh]'
        } flex flex-col rounded-none sm:rounded-3xl bg-white dark:bg-[#0B0F19] border-0 sm:border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 animate-pop pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:pt-0 sm:pb-0`}
      >
        {/* Render Timed Training Section (kept mounted to preserve active in-progress code, timer pause state, and prevent resets) */}
        <div className={activeTab === 'timed-training' ? 'flex-1 flex flex-col overflow-hidden' : 'hidden'}>
          <TimedTrainingSection
            isActive={isOpen && activeTab === 'timed-training'}
            initialProblemId={initialProblemId}
            onBackToHub={() => {
              setActiveTab('hub');
              setTrainingStats(getTrainingStats());
            }}
            onCloseHub={onClose}
            onOpenArena={onOpenArena}
            onStatsUpdated={() => {
              setTrainingStats(getTrainingStats());
            }}
          />
        </div>

        {activeTab === 'hub' && (
          <>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                  <Zap className="w-6 h-6 fill-current animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                      Speed Training Hub
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      TRAINING ZONE
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Unified algorithmic preparation: Timed Personal Bests, curated NeetCode roadmaps &amp; community question bank.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Overview Stats Bar: 5 Integrated Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Solved
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                      {totalDsaSolved}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/ 150</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    Blind 75
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                      {b75Progress.percentage}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">({b75Progress.solved}/75)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    NeetCode 150
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {nc150Progress.percentage}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">({nc150Progress.solved}/150)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                    Personal Bests
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                      {trainingStats.totalSolved}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">({trainingStats.recordsBeaten} PBs)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                    Bank Questions
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">
                      {bankLoading ? '...' : bankChallenges.length}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">pool</span>
                  </div>
                </div>
              </div>

              {/* Next Up Resume Banner */}
              {nextUpProblem && (
                <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                          {progress[nextUpProblem.problem.id] === 'attempted' ? 'In Progress' : 'Recommended Next Problem'}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                            nextUpProblem.problem.difficulty === 'Easy'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : nextUpProblem.problem.difficulty === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {nextUpProblem.problem.difficulty}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                        {nextUpProblem.problem.title}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {nextUpProblem.problem.category} • {nextUpProblem.roadmapId === 'blind75' ? 'Blind 75' : 'NeetCode 150'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenInCodeZone(nextUpProblem.problem, nextUpProblem.roadmapId);
                      onClose();
                    }}
                    className="btn-3d btn-3d-primary py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 shadow-md"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Resume in CodeZone</span>
                  </button>
                </div>
              )}

              {/* The Three Core Pillars of Speed Training */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* PILLAR 1: Timed Training & Personal Bests */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border-2 border-amber-500/30 flex flex-col justify-between gap-5 shadow-sm relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0 font-black">
                          ⚡
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                            Timed Training
                          </h3>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Personal Bests &amp; Ghost Trials
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                        TIME TRIAL
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Race against your own lowest solve time. Live stopwatch, test-suite verification, ghost pacing, and personal best persistence across NeetCode and Bank roadmaps.
                    </p>

                    {/* Personal Best Metrics Summary Card */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span>Record Highlights</span>
                        </span>
                        <span className="font-mono text-amber-500 font-black">
                          {trainingStats.recordsBeaten} PBs Beaten
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Timer className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{trainingStats.totalSolved} Solved</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-500" />
                          <span>{Math.round(trainingStats.totalTrainingTimeSeconds / 60)}m Logged</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('timed-training');
                      }}
                      className="btn-3d btn-3d-yellow w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md bg-amber-400 hover:bg-amber-300 text-slate-950 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 dark:border-amber-600 transition-all"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Launch Timed Training</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PILLAR 2: DSA Practice Roadmaps */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-5 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 shrink-0">
                          <Brain className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                            DSA Roadmaps
                          </h3>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Blind 75 &amp; NeetCode 150
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        CANONICAL
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Master patterns for technical interviews. Work through problems in strict pedagogical sequence, run test cases in CodeZone, and track verified topic mastery.
                    </p>

                    {/* Sub-Track 1: Blind 75 */}
                    <div
                      onClick={() => {
                        sound.playClick();
                        onOpenDsaRoadmap('blind75');
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">🧠</span>
                          <span className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-500 transition-colors">
                            Blind 75
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                          {b75Progress.solved} / {b75Progress.total} ({b75Progress.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, b75Progress.percentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Sub-Track 2: NeetCode 150 */}
                    <div
                      onClick={() => {
                        sound.playClick();
                        onOpenDsaRoadmap('neetcode150');
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">🚀</span>
                          <span className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
                            NeetCode 150
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {nc150Progress.solved} / {nc150Progress.total} ({nc150Progress.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, nc150Progress.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onOpenDsaRoadmap('blind75');
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Explore Roadmaps</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PILLAR 3: Bank Practice */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-5 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                            Bank Practice
                          </h3>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Community &amp; Curated Challenges
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        EXPLORE &amp; AUTHOR
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Practice individual algorithmic challenges with sample test suites. Inspect test constraints, solve in CodeZone, or author your own community challenges.
                    </p>

                    {/* Bank Live Metrics */}
                    {bankLoading ? (
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2 animate-pulse">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                      </div>
                    ) : bankError ? (
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-500">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{bankError}</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>Available Bank Pool</span>
                          <span className="font-mono text-sky-500">{bankChallenges.length} Challenges</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] font-semibold flex-wrap">
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {bankMetrics.easy} Easy
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {bankMetrics.medium} Med
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            {bankMetrics.hard} Hard
                          </span>
                          <span className="text-slate-400 text-[10px] ml-auto">
                            {bankMetrics.categoriesCount} Topics
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                          <Flame className="w-3 h-3 text-amber-500" />
                          <span>Authoring unlocks after 10-day streak</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onOpenBankPractice();
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Launch Bank Practice</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Progress and personal bests automatically synced locally</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
