import React, { useState, useEffect, useRef, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti, stopConfetti } from '../../utils/confetti';
import {
  ArenaChallenge,
  CodeLanguage,
  PersonalBestRecord,
  ProblemSheet,
  TrainingStats
} from '../../types';
import {
  getAllTrainingProblems,
  getAllPersonalBests,
  getPersonalBest,
  recordProblemTime,
  getTrainingStats,
  RecordTimeResult
} from '../../services/trainingService';
import {
  executeCodeSandbox,
  evaluateTestCases,
  EvaluationSummary,
  RunResult
} from '../../utils/codeRunner';
import {
  Zap,
  Timer,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Code2,
  Terminal,
  Send,
  X,
  Flame,
  Award,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Clock,
  Compass,
  Check,
  ChevronDown
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialProblemId?: string;
  onOpenArena?: () => void;
}

export const TrainingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialProblemId,
  onOpenArena
}) => {
  const { addXp } = useGame();

  // Screen View: 'catalog' | 'training' | 'victory'
  const [view, setView] = useState<'catalog' | 'training' | 'victory'>('catalog');

  // Problems and Personal Bests
  const [allProblems, setAllProblems] = useState<ArenaChallenge[]>([]);
  const [personalBests, setPersonalBests] = useState<Record<string, PersonalBestRecord>>({});
  const [trainingStats, setTrainingStats] = useState<TrainingStats>({
    totalSolved: 0,
    recordsBeaten: 0,
    totalTrainingTimeSeconds: 0
  });
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedSheet, setSelectedSheet] = useState<ProblemSheet>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Training Problem
  const [activeProblem, setActiveProblem] = useState<ArenaChallenge | null>(null);

  // Live Timer (Elapsed Time in seconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live Code Environment
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('python');
  const [code, setCode] = useState<string>('');
  const [customStdin, setCustomStdin] = useState<string>('');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'tests' | 'custom_input'>('output');

  // Execution & Test State
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationSummary | null>(null);

  // Victory Record Result
  const [solveRecordResult, setSolveRecordResult] = useState<RecordTimeResult | null>(null);

  // Textarea & Syntax highlight sync
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Load problems and personal bests on open
  const loadData = async () => {
    setLoading(true);
    try {
      const problems = await getAllTrainingProblems();
      setAllProblems(problems);
      setPersonalBests(getAllPersonalBests());
      setTrainingStats(getTrainingStats());

      if (initialProblemId) {
        const found = problems.find(p => p.id === initialProblemId);
        if (found) {
          startTrainingOnProblem(found);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      stopTimer();
      stopConfetti();
    }
  }, [isOpen, initialProblemId]);

  // Clean timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  };

  // Launch training session on a selected problem
  const startTrainingOnProblem = (problem: ArenaChallenge) => {
    sound.playClick();
    setActiveProblem(problem);
    const template =
      problem.starterTemplates?.[selectedLanguage] ||
      (selectedLanguage === 'python'
        ? `# Write solution\nline = input()\nprint(line)\n`
        : `#include <iostream>\n\nint main() {\n    return 0;\n}\n`);
    setCode(template);
    setRunResult(null);
    setEvaluationResult(null);
    setSolveRecordResult(null);
    setView('training');
    startTimer();
  };

  // Update starter code when language or active problem changes
  useEffect(() => {
    if (activeProblem && view === 'training') {
      const template =
        activeProblem.starterTemplates?.[selectedLanguage] ||
        (selectedLanguage === 'python'
          ? `# Write solution\nline = input()\nprint(line)\n`
          : `#include <iostream>\n\nint main() {\n    return 0;\n}\n`);
      setCode(template);
      setRunResult(null);
      setEvaluationResult(null);
    }
  }, [selectedLanguage, activeProblem?.id]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allProblems.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [allProblems]);

  // Filtered problems based on sheet, category, and search query
  const filteredProblems = useMemo(() => {
    return allProblems.filter(p => {
      let sheetMatch = true;
      if (selectedSheet === 'neetcode75') {
        sheetMatch = !!p.sheets?.includes('neetcode75');
      } else if (selectedSheet === 'neetcode150') {
        sheetMatch = !!p.sheets?.includes('neetcode150');
      } else if (selectedSheet === 'questionbank') {
        sheetMatch = !!p.sheets?.includes('questionbank') || !!p.isCommunity;
      }

      const catMatch =
        selectedCategory === 'all' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const searchMatch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return sheetMatch && catMatch && searchMatch;
    });
  }, [allProblems, selectedSheet, selectedCategory, searchQuery]);

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Active problem personal best
  const activePB = activeProblem ? personalBests[activeProblem.id] : null;

  // Pace indicator compared to PB
  const paceDiff = activePB ? elapsedSeconds - activePB.bestTimeSeconds : 0;
  const isAheadOfPace = activePB ? paceDiff < 0 : true;

  // Syntax highlighting scroll sync
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Tab key indent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const next = val.substring(0, start) + '  ' + val.substring(end);
      setCode(next);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    }
  };

  // 1. RUN ACTION: Executes against sample input
  const handleRun = async () => {
    if (!activeProblem) return;
    sound.playClick();
    setIsRunning(true);
    setRunResult(null);
    setActiveConsoleTab('output');

    try {
      const sampleInput = customStdin || activeProblem.sampleCases[0]?.input || '';
      const result = await executeCodeSandbox(code, selectedLanguage, sampleInput);
      setRunResult(result);
      if (result.hasError) {
        sound.playError();
      } else {
        sound.playClick();
      }
    } finally {
      setIsRunning(false);
    }
  };

  // 2. TEST ACTION: Evaluates against visible sample cases
  const handleTest = async () => {
    if (!activeProblem) return;
    sound.playClick();
    setIsTesting(true);
    setEvaluationResult(null);
    setActiveConsoleTab('tests');

    try {
      const summary = await evaluateTestCases(code, selectedLanguage, activeProblem.sampleCases);
      setEvaluationResult(summary);
      if (summary.allPassed) {
        sound.playSuccess();
      } else {
        sound.playError();
      }
    } finally {
      setIsTesting(false);
    }
  };

  // 3. SUBMIT ACTION: Evaluates against ALL test cases (visible + hidden)
  const handleSubmit = async () => {
    if (!activeProblem) return;
    sound.playClick();
    setIsSubmitting(true);
    setActiveConsoleTab('tests');

    try {
      const allCases = [...activeProblem.sampleCases, ...activeProblem.hiddenCases];
      const summary = await evaluateTestCases(code, selectedLanguage, allCases);
      setEvaluationResult(summary);

      if (summary.allPassed) {
        stopTimer();
        const recordRes = recordProblemTime(activeProblem.id, elapsedSeconds, selectedLanguage);
        setSolveRecordResult(recordRes);

        // Update local personal bests state
        setPersonalBests(getAllPersonalBests());
        setTrainingStats(getTrainingStats());

        sound.playSuccess();
        fireSuccessConfetti();

        if (recordRes.isNewBest) {
          addXp(50); // +30 completion + 20 PB bonus
        } else {
          addXp(25);
        }

        setView('victory');
      } else {
        sound.playError();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next problem in active filtered sheet
  const handleNextProblem = () => {
    if (!activeProblem) return;
    const currentIdx = filteredProblems.findIndex(p => p.id === activeProblem.id);
    const next = filteredProblems[currentIdx + 1] || filteredProblems[0];
    if (next) {
      startTrainingOnProblem(next);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[95vh] flex flex-col rounded-3xl bg-white dark:bg-[#0B0F19] border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left">

        {/* ----------------- SCREEN 1: CATALOG & ROADMAP EXPLORER ----------------- */}
        {view === 'catalog' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-2xl">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                      Speed Training Segment
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
                      SOLO GHOST TIME-TRIAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    Compete against your own lowest solve time across NeetCode 75, NeetCode 150, and Question Bank roadmaps
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenArena && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenArena();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-black text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Arena Duels</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Overall Training Stats Banner */}
            <div className="px-4 sm:px-6 py-3 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto text-xs font-bold">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span>Unique Problems Solved: <strong className="text-amber-500 font-black">{trainingStats.totalSolved}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Personal Bests Beaten: <strong className="text-emerald-500 font-black">{trainingStats.recordsBeaten}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-sky-500" />
                  <span>Total Training Time: <strong className="text-sky-500 font-black">{Math.round(trainingStats.totalTrainingTimeSeconds / 60)} mins</strong></span>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                Your fastest code runs become your ghost target for future practices!
              </span>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Sheet Roadmaps Selector */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Select Training Roadmap Sheet
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'all', title: '⭐ All Problems', desc: 'Full unified problem vault', badge: `${allProblems.length}` },
                    { id: 'neetcode75', title: '🔥 NeetCode 75', desc: 'Must-know technical interview essentials', badge: 'Blind 75' },
                    { id: 'neetcode150', title: '💎 NeetCode 150', desc: 'Comprehensive DSA interview sheet', badge: '150 Sheet' },
                    { id: 'questionbank', title: '📚 Question Bank', desc: 'ByteSized & Community authored', badge: 'Bank' }
                  ].map(sheet => {
                    const isSelected = selectedSheet === sheet.id;
                    return (
                      <div
                        key={sheet.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedSheet(sheet.id as ProblemSheet);
                        }}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                            {sheet.title}
                          </h4>
                          <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-500">
                            {sheet.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {sheet.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search NeetCode & Bank challenges by title or keyword..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-primary shrink-0"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'All Topics' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Problems Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProblems.map(prob => {
                  const pb = personalBests[prob.id];
                  const hasPB = !!pb;

                  return (
                    <div
                      key={prob.id}
                      onClick={() => startTrainingOnProblem(prob)}
                      className="p-4 rounded-3xl bg-white dark:bg-slate-900/80 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-amber-500/60 transition-all flex flex-col justify-between gap-3 group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 text-left"
                    >
                      <div>
                        {/* Tags */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              prob.difficulty === 'easy'
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : prob.difficulty === 'medium'
                                ? 'bg-amber-500/15 text-amber-500'
                                : 'bg-rose-500/15 text-rose-500'
                            }`}
                          >
                            {prob.difficulty}
                          </span>

                          <div className="flex items-center gap-1">
                            {prob.sheets?.includes('neetcode75') && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                NC 75
                              </span>
                            )}
                            {prob.sheets?.includes('neetcode150') && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                NC 150
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 group-hover:text-amber-500 transition-colors line-clamp-1">
                          {prob.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {prob.description}
                        </p>
                      </div>

                      {/* Personal Best Gauge / Footer */}
                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        {hasPB ? (
                          <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-black">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>PB: {formatTime(pb.bestTimeSeconds)}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({pb.attemptsCount} {pb.attemptsCount === 1 ? 'try' : 'tries'})
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                            <Timer className="w-3.5 h-3.5" />
                            <span>No PB set</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-xs font-black text-amber-500 group-hover:translate-x-0.5 transition-transform">
                          <span>Train</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProblems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    <p className="text-sm font-bold">No training problems match your filter selection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCREEN 2: LIVE SPEED TRAINING (SELF-DUEL) ----------------- */}
        {view === 'training' && activeProblem && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Training HUD Bar */}
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-between gap-3 shrink-0">
              {/* Left: Problem & Sheet Info */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    stopTimer();
                    setView('catalog');
                  }}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Roadmap</span>
                </button>

                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-none">
                    {activeProblem.title}
                  </h3>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${
                      activeProblem.difficulty === 'easy'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : activeProblem.difficulty === 'medium'
                        ? 'bg-amber-500/15 text-amber-500'
                        : 'bg-rose-500/15 text-rose-500'
                    }`}
                  >
                    {activeProblem.difficulty}
                  </span>
                </div>
              </div>

              {/* Middle: Live Elapsed Stopwatch & Pace vs PB */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-sm font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Timer className="w-4 h-4 animate-spin-slow" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>

                {activePB ? (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-black ${
                      isAheadOfPace
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Target PB: {formatTime(activePB.bestTimeSeconds)}</span>
                    <span className="text-[10px]">
                      ({isAheadOfPace ? `-${formatTime(Math.abs(paceDiff))} ahead` : `+${formatTime(paceDiff)} behind`})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold">
                    <span>First attempt • Setting baseline PB</span>
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    startTimer();
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 cursor-pointer"
                  title="Restart session timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    stopTimer();
                    onClose();
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Workspace (Top: Question, Bottom: Code Editor) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Question Statement Panel */}
              <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden bg-slate-50/60 dark:bg-slate-900/30">
                <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Topic: {activeProblem.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeProblem.sheets?.map(s => (
                      <span key={s} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 text-left">
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeProblem.description}
                  </div>

                  {activeProblem.constraints && activeProblem.constraints.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Constraints:
                      </h4>
                      <ul className="list-disc pl-4 text-xs font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
                        {activeProblem.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sample Cases */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Sample Test Cases:
                    </h4>
                    {activeProblem.sampleCases.map((tc, idx) => (
                      <div
                        key={tc.id || idx}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Input:</span>
                            <pre className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">
                              {tc.input}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Expected Output:</span>
                            <pre className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">
                              {tc.output}
                            </pre>
                          </div>
                        </div>
                        {tc.explanation && (
                          <p className="text-[11px] font-sans text-slate-500 font-medium">
                            Explanation: {tc.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Editor Panel */}
              <div className="w-full md:w-7/12 flex flex-col overflow-hidden bg-[#0D1117] text-slate-100">
                {/* Language Switcher */}
                <div className="px-4 py-2 border-b border-slate-800 bg-[#161B22] flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    {(['python', 'javascript', 'cpp', 'c'] as CodeLanguage[]).map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedLanguage(lang);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedLanguage === lang
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      const template = activeProblem.starterTemplates?.[selectedLanguage] || '';
                      setCode(template);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Reset to starter template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Code Area */}
                <div className="relative flex-1 min-h-[160px] overflow-hidden bg-[#0D1117]">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full p-4 font-mono text-xs sm:text-sm bg-transparent text-slate-100 caret-amber-400 resize-none outline-none z-10 leading-relaxed"
                  />
                  <pre
                    ref={preRef}
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full p-4 font-mono text-xs sm:text-sm pointer-events-none overflow-hidden text-transparent select-none leading-relaxed"
                  >
                    <code
                      dangerouslySetInnerHTML={{
                        __html: Prism.highlight(
                          code,
                          selectedLanguage === 'python'
                            ? Prism.languages.python
                            : selectedLanguage === 'cpp'
                            ? Prism.languages.cpp
                            : selectedLanguage === 'c'
                            ? Prism.languages.c
                            : Prism.languages.javascript,
                          selectedLanguage
                        )
                      }}
                    />
                  </pre>
                </div>

                {/* Console Drawer */}
                <div className="h-44 sm:h-48 border-t border-slate-800 bg-[#161B22] flex flex-col shrink-0">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveConsoleTab('output')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          activeConsoleTab === 'output' ? 'bg-slate-800 text-white' : 'text-slate-400'
                        }`}
                      >
                        Terminal Output
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveConsoleTab('tests')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          activeConsoleTab === 'tests' ? 'bg-slate-800 text-white' : 'text-slate-400'
                        }`}
                      >
                        <span>Test Results</span>
                        {evaluationResult && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              evaluationResult.allPassed ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveConsoleTab('custom_input')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          activeConsoleTab === 'custom_input' ? 'bg-slate-800 text-white' : 'text-slate-400'
                        }`}
                      >
                        Custom Stdin
                      </button>
                    </div>

                    {runResult && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Run: {runResult.executionTimeMs}ms
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
                    {activeConsoleTab === 'output' && (
                      <div>
                        {isRunning ? (
                          <div className="text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            <span>Executing code sandbox...</span>
                          </div>
                        ) : runResult ? (
                          <div className="space-y-1">
                            {runResult.hasError ? (
                              <div className="text-rose-400 whitespace-pre-wrap">
                                {runResult.errorMessage || runResult.stderr}
                              </div>
                            ) : (
                              <div className="text-emerald-400 whitespace-pre-wrap">
                                {runResult.stdout || '// Program finished with 0 exit code.'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-slate-500">
                            Press <strong>Run</strong> for sample output or <strong>Submit</strong> to validate your time against your Personal Best!
                          </div>
                        )}
                      </div>
                    )}

                    {activeConsoleTab === 'tests' && (
                      <div>
                        {isTesting || isSubmitting ? (
                          <div className="text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                            <span>Evaluating test cases...</span>
                          </div>
                        ) : evaluationResult ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-black text-xs">
                              {evaluationResult.allPassed ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  All {evaluationResult.totalCount} Test Cases Passed!
                                </span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-1">
                                  <XCircle className="w-4 h-4" />
                                  Failed {evaluationResult.totalCount - evaluationResult.passedCount} / {evaluationResult.totalCount} Cases
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              {evaluationResult.results.map((res, i) => (
                                <div
                                  key={res.testCaseId || i}
                                  className={`p-2 rounded-xl border ${
                                    res.passed
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span>Case #{i + 1} {res.isHidden ? '(Hidden)' : ''}</span>
                                    <span>{res.passed ? 'PASSED ✅' : 'FAILED ❌'}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500">Press Test or Submit to run tests.</div>
                        )}
                      </div>
                    )}

                    {activeConsoleTab === 'custom_input' && (
                      <textarea
                        value={customStdin}
                        onChange={e => setCustomStdin(e.target.value)}
                        placeholder="Provide custom input to pass to standard input..."
                        className="w-full h-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono resize-none outline-none focus:border-amber-400"
                      />
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="p-2.5 border-t border-slate-800 bg-[#161B22] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                      Timer: <strong className="text-amber-400 font-mono">{formatTime(elapsedSeconds)}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRun}
                        disabled={isRunning || isTesting || isSubmitting}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                        <span>Run</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTest}
                        disabled={isRunning || isTesting || isSubmitting}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Test</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isRunning || isTesting || isSubmitting}
                        className="btn-3d btn-3d-yellow px-5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md text-slate-950 font-extrabold"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for Time</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCREEN 3: VICTORY & PERSONAL BEST SUMMARY ----------------- */}
        {view === 'victory' && activeProblem && solveRecordResult && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-pop">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl animate-bounce ${
              solveRecordResult.isNewBest
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/30 ring-4 ring-amber-400/40'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-emerald-500/30'
            }`}>
              {solveRecordResult.isNewBest ? '🏆' : '⏱️'}
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-500 block mb-1">
                {solveRecordResult.isNewBest ? '🔥 NEW PERSONAL BEST!' : 'Session Complete!'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                {solveRecordResult.isNewBest
                  ? `Record Smashed in ${formatTime(solveRecordResult.newBestSeconds)}!`
                  : `Solved in ${formatTime(elapsedSeconds)}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                {solveRecordResult.isNewBest && solveRecordResult.previousBestSeconds
                  ? `Phenomenal speed! You improved upon your previous best (${formatTime(solveRecordResult.previousBestSeconds)}) by ${solveRecordResult.previousBestSeconds - solveRecordResult.newBestSeconds} seconds!`
                  : solveRecordResult.isNewBest
                  ? 'Baseline Personal Best established! Your record is saved for future training sessions.'
                  : `Good run! Your standing Personal Best remains ${formatTime(solveRecordResult.newBestSeconds)}.`}
              </p>
            </div>

            {/* Comparison Stats Card */}
            <div className="w-full max-w-md p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                  This Session Time
                </span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                  Saved Personal Best
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {formatTime(solveRecordResult.newBestSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  stopConfetti();
                  startTrainingOnProblem(activeProblem);
                }}
                className="btn-3d btn-3d-yellow px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer text-slate-950"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Train Again to Beat Time</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  stopConfetti();
                  handleNextProblem();
                }}
                className="btn-3d btn-3d-primary px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Next Problem</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  stopConfetti();
                  setView('catalog');
                }}
                className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Roadmap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
