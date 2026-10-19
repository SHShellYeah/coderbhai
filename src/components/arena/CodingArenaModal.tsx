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
  ArenaMatch,
  ArenaMode,
  ArenaPlayer,
  CodeLanguage,
  TestCase
} from '../../types';
import {
  getApprovedChallenges,
  createArenaMatch,
  generateStrangerOpponent
} from '../../services/arenaService';
import {
  executeCodeSandbox,
  evaluateTestCases,
  EvaluationSummary,
  RunResult
} from '../../utils/codeRunner';
import {
  Swords,
  Timer,
  Trophy,
  Users,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Shuffle,
  Layers,
  ArrowRight,
  Code2,
  Terminal,
  ChevronRight,
  X,
  Copy,
  Check,
  Flame,
  AlertTriangle,
  Award,
  Zap,
  HelpCircle,
  FileCode,
  ShieldAlert,
  Send
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialChallenge?: ArenaChallenge | null;
  onOpenQuestionBank?: () => void;
}

export const CodingArenaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialChallenge,
  onOpenQuestionBank
}) => {
  const { state, addXp } = useGame();

  // All available challenges from bank
  const [availableChallenges, setAvailableChallenges] = useState<ArenaChallenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  // Screen State: 'lobby' | 'battle' | 'result'
  const [screen, setScreen] = useState<'lobby' | 'battle' | 'result'>('lobby');

  // Mode & Room Setup
  const [selectedMode, setSelectedMode] = useState<ArenaMode>('stopwatch');
  const [stopwatchMinutes, setStopwatchMinutes] = useState<number>(3); // 2, 3, 5, 10
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [matchType, setMatchType] = useState<'bot' | 'room'>('bot');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Active Match State
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(180);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live Coding Environment State
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
  const [battleNotice, setBattleNotice] = useState<string | null>(null);

  // Editor Ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Load question bank on open
  useEffect(() => {
    if (isOpen) {
      setLoadingChallenges(true);
      getApprovedChallenges().then(qs => {
        setAvailableChallenges(qs);
        setLoadingChallenges(false);

        // Pre-select 3 random questions for Takedown by default
        if (qs.length > 0 && selectedQuestionIds.length === 0) {
          const shuffled = [...qs].sort(() => 0.5 - Math.random());
          setSelectedQuestionIds(shuffled.slice(0, 3).map(q => q.id));
        }
      });
    }
  }, [isOpen]);

  // When initialChallenge prop is passed, select it
  useEffect(() => {
    if (initialChallenge) {
      setSelectedQuestionIds([initialChallenge.id]);
    }
  }, [initialChallenge]);

  // Current problem being solved
  const activeProblems: ArenaChallenge[] = useMemo(() => {
    if (selectedMode === 'stopwatch') {
      // In stopwatch, provide all available challenges in sequence
      return availableChallenges;
    } else {
      // In takedown, provide the selected question paper
      return availableChallenges.filter(q => selectedQuestionIds.includes(q.id));
    }
  }, [selectedMode, availableChallenges, selectedQuestionIds]);

  const currentProblem: ArenaChallenge | undefined = activeProblems[currentProblemIndex] || activeProblems[0];

  // Set starter code when currentProblem or language changes
  useEffect(() => {
    if (currentProblem) {
      const template =
        currentProblem.starterTemplates?.[selectedLanguage] ||
        (selectedLanguage === 'python'
          ? `# Write solution\nline = input()\nprint(line)\n`
          : selectedLanguage === 'javascript'
          ? `// Write solution\nfunction solve(input) {\n  console.log(input);\n}\nsolve(stdin);\n`
          : `#include <iostream>\n\nint main() {\n    // Write solution\n    return 0;\n}\n`);
      setCode(template);
      setRunResult(null);
      setEvaluationResult(null);
    }
  }, [currentProblem?.id, selectedLanguage]);

  // Sync syntax highlight scroll
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Keyboard auto-pairing
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

  // Start Battle
  const handleStartMatch = () => {
    sound.playClick();
    if (activeProblems.length === 0) return;

    const hostPlayer: ArenaPlayer = {
      id: state.authUser?.id || 'host-user',
      name: state.authUser?.username || state.authUser?.displayName || 'You',
      avatar: state.authUser?.avatarUrl,
      score: 0,
      currentQuestionIndex: 0,
      solvedQuestionIds: []
    };

    const opponentPlayer: ArenaPlayer = generateStrangerOpponent();

    const initialTime = selectedMode === 'stopwatch' ? stopwatchMinutes * 60 : 600; // 10m for takedown
    const match = createArenaMatch(
      selectedMode,
      initialTime,
      activeProblems.map(p => p.id),
      hostPlayer
    );
    match.opponent = opponentPlayer;
    match.status = 'in_progress';
    match.startedAt = Date.now();
    match.expiresAt = Date.now() + initialTime * 1000;

    setCurrentMatch(match);
    setCurrentProblemIndex(0);
    setTimeLeftSeconds(initialTime);
    setScreen('battle');
    setBattleNotice(`⚔️ Match started against ${opponentPlayer.name}! First to conquer wins!`);

    // Launch countdown timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Launch simulated rival solving progress
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    botIntervalRef.current = setInterval(() => {
      setCurrentMatch(prev => {
        if (!prev || prev.status !== 'in_progress' || !prev.opponent) return prev;

        // Realistic solve chance every 15-25 seconds
        const willSolve = Math.random() < 0.28;
        if (willSolve) {
          const oppSolved = [...prev.opponent.solvedQuestionIds];
          const nextIdx = prev.opponent.currentQuestionIndex;
          const probToSolve = activeProblems[nextIdx];

          if (probToSolve && !oppSolved.includes(probToSolve.id)) {
            oppSolved.push(probToSolve.id);
            const newScore = prev.opponent.score + 100;
            const newIdx = nextIdx + 1;

            sound.playError(); // subtle alert that opponent scored
            setBattleNotice(`🚨 Opponent ${prev.opponent.name} just solved ${probToSolve.title}!`);

            // If takedown mode and opponent solved all questions -> Defeat!
            if (prev.mode === 'takedown' && oppSolved.length >= activeProblems.length) {
              handleFinishMatch('opponent');
            }

            return {
              ...prev,
              opponent: {
                ...prev.opponent,
                score: newScore,
                currentQuestionIndex: newIdx,
                solvedQuestionIds: oppSolved
              }
            };
          }
        }
        return prev;
      });
    }, 7000);
  };

  // Timer expiration
  const handleTimeExpire = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);

    setCurrentMatch(prev => {
      if (!prev) return null;
      let winner: 'host' | 'opponent' | 'tie' = 'tie';
      if (prev.host.score > (prev.opponent?.score || 0)) {
        winner = 'host';
      } else if ((prev.opponent?.score || 0) > prev.host.score) {
        winner = 'opponent';
      }
      handleFinishMatch(winner);
      return { ...prev, status: 'finished', winnerId: winner };
    });
  };

  // Finish Match
  const handleFinishMatch = (winner: 'host' | 'opponent' | 'tie') => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);

    if (winner === 'host') {
      sound.playSuccess();
      fireSuccessConfetti();
      addXp(60);
    } else if (winner === 'tie') {
      sound.playClick();
      addXp(25);
    } else {
      sound.playError();
      addXp(15);
    }

    setCurrentMatch(prev => (prev ? { ...prev, status: 'finished', winnerId: winner } : null));
    setScreen('result');
  };

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
      stopConfetti();
    };
  }, []);

  // 1. RUN ACTION: Executes against Sample Input
  const handleRun = async () => {
    if (!currentProblem) return;
    sound.playClick();
    setIsRunning(true);
    setRunResult(null);
    setActiveConsoleTab('output');

    try {
      const sampleInput = customStdin || currentProblem.sampleCases[0]?.input || '';
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
    if (!currentProblem) return;
    sound.playClick();
    setIsTesting(true);
    setEvaluationResult(null);
    setActiveConsoleTab('tests');

    try {
      const summary = await evaluateTestCases(code, selectedLanguage, currentProblem.sampleCases);
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
    if (!currentProblem || !currentMatch) return;
    sound.playClick();
    setIsSubmitting(true);
    setActiveConsoleTab('tests');

    try {
      const allCases = [...currentProblem.sampleCases, ...currentProblem.hiddenCases];
      const summary = await evaluateTestCases(code, selectedLanguage, allCases);
      setEvaluationResult(summary);

      if (summary.allPassed) {
        sound.playSuccess();
        fireSuccessConfetti();

        // Update Host Score and Solved Problems
        const newSolved = [...currentMatch.host.solvedQuestionIds];
        let newScore = currentMatch.host.score;

        if (!newSolved.includes(currentProblem.id)) {
          newSolved.push(currentProblem.id);
          newScore += 100;
        }

        setBattleNotice(`🔥 SOLVED! +100 Points for ${currentProblem.title}!`);

        const updatedMatch: ArenaMatch = {
          ...currentMatch,
          host: {
            ...currentMatch.host,
            score: newScore,
            solvedQuestionIds: newSolved,
            currentQuestionIndex: currentProblemIndex + 1
          }
        };
        setCurrentMatch(updatedMatch);

        // Mode Check:
        if (currentMatch.mode === 'takedown') {
          // If all questions on paper solved -> TAKEDOWN VICTORY!
          if (newSolved.length >= activeProblems.length) {
            handleFinishMatch('host');
            return;
          } else {
            // Move to next unsolved question on the paper
            const nextIdx = activeProblems.findIndex(p => !newSolved.includes(p.id));
            if (nextIdx !== -1) {
              setCurrentProblemIndex(nextIdx);
            }
          }
        } else {
          // Stopwatch mode: Advance to next problem in sequence
          if (currentProblemIndex + 1 < activeProblems.length) {
            setCurrentProblemIndex(prev => prev + 1);
          }
        }
      } else {
        sound.playError();
        setBattleNotice(`❌ Solution failed test cases (${summary.passedCount}/${summary.totalCount} passed). Check diff below.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Select Random Questions for Takedown Paper
  const handleRandomSelectPaper = (count = 3) => {
    sound.playClick();
    if (availableChallenges.length === 0) return;
    const shuffled = [...availableChallenges].sort(() => 0.5 - Math.random());
    setSelectedQuestionIds(shuffled.slice(0, count).map(q => q.id));
  };

  // Toggle question selection
  const handleToggleQuestion = (id: string) => {
    sound.playClick();
    setSelectedQuestionIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Copy room code
  const handleCopyRoomCode = () => {
    if (currentMatch?.roomCode) {
      navigator.clipboard.writeText(currentMatch.roomCode);
      setCopiedCode(true);
      sound.playClick();
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[95vh] flex flex-col rounded-3xl bg-white dark:bg-[#0B0F19] border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left">

        {/* ----------------- SCREEN 1: LOBBY & ROOM CONFIG ----------------- */}
        {screen === 'lobby' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Swords className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>Coding Arena</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      LIVE DUELS
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Compete in real-time coding battles with friends or online challengers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenQuestionBank && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenQuestionBank();
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-brand-primary" />
                    <span>Question Bank</span>
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

            {/* Lobby Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Step 1: Select Arena Mode */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Select Battle Mode
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mode 1: Stopwatch */}
                  <div
                    onClick={() => {
                      sound.playClick();
                      setSelectedMode('stopwatch');
                    }}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selectedMode === 'stopwatch'
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md">
                          <Timer className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                            1. Stopwatch Mode
                          </h4>
                          <span className="text-[11px] text-purple-500 font-bold">
                            Time-Attack Problem Race
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'stopwatch' ? 'border-purple-500 bg-purple-500 text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                        {selectedMode === 'stopwatch' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Custom room host sets the countdown clock. Whoever solves the most coding problems before the timer expires wins the match!
                    </p>

                    {selectedMode === 'stopwatch' && (
                      <div className="pt-2 border-t border-purple-500/20 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Timer Limit:</span>
                        {[2, 3, 5, 10].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              sound.playClick();
                              setStopwatchMinutes(m);
                            }}
                            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                              stopwatchMinutes === m
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {m} Min
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mode 2: Takedown */}
                  <div
                    onClick={() => {
                      sound.playClick();
                      setSelectedMode('takedown');
                    }}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selectedMode === 'takedown'
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
                          <Swords className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                            2. Takedown Mode
                          </h4>
                          <span className="text-[11px] text-indigo-500 font-bold">
                            Question Paper Knockout
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'takedown' ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                        {selectedMode === 'takedown' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Select questions from the Question Bank segment or hit <strong>Random</strong> to generate a challenge set. Whoever solves all problems first knocks out the opponent!
                    </p>

                    {selectedMode === 'takedown' && (
                      <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500">
                          {selectedQuestionIds.length} Problems Selected
                        </span>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleRandomSelectPaper(3);
                          }}
                          className="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-600 text-white flex items-center gap-1 hover:bg-indigo-500 cursor-pointer shadow-sm"
                        >
                          <Shuffle className="w-3.5 h-3.5" />
                          <span>🎲 Pick Random 3</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Question Paper Selector (Especially for Takedown) */}
              {selectedMode === 'takedown' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Configure Question Paper ({selectedQuestionIds.length} Selected)
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRandomSelectPaper(3)}
                        className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Random 3</span>
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={() => handleRandomSelectPaper(5)}
                        className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Random 5</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                    {availableChallenges.map(q => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => handleToggleQuestion(q.id)}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase text-indigo-400 block">
                              {q.difficulty}
                            </span>
                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                              {q.title}
                            </h4>
                          </div>
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Matchmaking / Opponent Type */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                      Matchmaking Mode
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Instantly pair with an active online coder or bot simulation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartMatch}
                    disabled={selectedMode === 'takedown' && selectedQuestionIds.length === 0}
                    className="btn-3d btn-3d-primary px-6 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Enter Battle Arena Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCREEN 2: BATTLE & REAL CODING ENVIRONMENT ----------------- */}
        {screen === 'battle' && currentProblem && currentMatch && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Battle HUD Bar */}
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-between gap-3 shrink-0">
              {/* Left: Mode Badge & Problem Navigator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-black">
                  {currentMatch.mode === 'stopwatch' ? <Timer className="w-4 h-4" /> : <Swords className="w-4 h-4" />}
                  <span className="uppercase">{currentMatch.mode} Battle</span>
                </div>

                {/* Problem selector tabs for Takedown */}
                {currentMatch.mode === 'takedown' && (
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {activeProblems.map((prob, idx) => {
                      const isSolved = currentMatch.host.solvedQuestionIds.includes(prob.id);
                      const isCurrent = idx === currentProblemIndex;
                      return (
                        <button
                          key={prob.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setCurrentProblemIndex(idx);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                            isCurrent
                              ? 'bg-brand-primary text-white shadow-sm'
                              : isSolved
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isSolved ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                          <span>Q{idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Middle: Countdown Timer */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-2xl font-mono text-sm font-black tracking-wider ${
                    timeLeftSeconds <= 30
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor(timeLeftSeconds / 60)}:
                    {(timeLeftSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Right: Scores & Opponent Progress */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="text-emerald-500">You: {currentMatch.host.score} pts</span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-rose-400">
                    {currentMatch.opponent?.name}: {currentMatch.opponent?.score} pts
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    handleFinishMatch('tie');
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  title="Resign / Forfeit match"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Battle Live Notification Banner */}
            {battleNotice && (
              <div className="px-4 py-1.5 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-transparent border-b border-purple-500/30 text-xs font-bold text-purple-300 flex items-center justify-between">
                <span>{battleNotice}</span>
                <button
                  type="button"
                  onClick={() => setBattleNotice(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Main Battle Arena Workspace (Split Screen: Question Top, Live Coding Bottom) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* LEFT / TOP PANEL: QUESTION DETAILS (NOT GAMIFIED) */}
              <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden bg-slate-50/60 dark:bg-slate-900/30">
                {/* Problem Header */}
                <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          currentProblem.difficulty === 'easy'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : currentProblem.difficulty === 'medium'
                            ? 'bg-amber-500/15 text-amber-500'
                            : 'bg-rose-500/15 text-rose-500'
                        }`}
                      >
                        {currentProblem.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {currentProblem.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                      {currentProblem.title}
                    </h3>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold">
                    By {currentProblem.authorName}
                  </span>
                </div>

                {/* Problem Statement & Sample Cases */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 text-left">
                  {/* Problem Description */}
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {currentProblem.description}
                  </div>

                  {/* Constraints */}
                  {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Constraints:
                      </h4>
                      <ul className="list-disc pl-4 text-xs font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
                        {currentProblem.constraints.map((c, i) => (
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
                    {currentProblem.sampleCases.map((tc, idx) => (
                      <div
                        key={tc.id || idx}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2 shadow-xs"
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

              {/* RIGHT / BOTTOM PANEL: LIVE CODING ENVIRONMENT */}
              <div className="w-full md:w-7/12 flex flex-col overflow-hidden bg-[#0D1117] text-slate-100">
                {/* Editor Top Bar: Language Selector & Controls */}
                <div className="px-4 py-2 border-b border-slate-800 bg-[#161B22] flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
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
                            ? 'bg-brand-primary text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        const template = currentProblem.starterTemplates?.[selectedLanguage] || '';
                        setCode(template);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Reset code to starter template"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Live Code Area with Syntax Highlighting */}
                <div className="relative flex-1 min-h-[160px] overflow-hidden bg-[#0D1117]">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    className="absolute inset-0 w-full h-full p-4 font-mono text-xs sm:text-sm bg-transparent text-slate-100 caret-brand-primary resize-none outline-none z-10 leading-relaxed"
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

                {/* Console / Test Results Drawer */}
                <div className="h-44 sm:h-48 border-t border-slate-800 bg-[#161B22] flex flex-col shrink-0">
                  {/* Console Tabs */}
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveConsoleTab('output')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          activeConsoleTab === 'output'
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Terminal Output
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveConsoleTab('tests')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          activeConsoleTab === 'tests'
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:text-slate-200'
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
                          activeConsoleTab === 'custom_input'
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Custom Stdin
                      </button>
                    </div>

                    {runResult && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Execution: {runResult.executionTimeMs}ms
                      </span>
                    )}
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
                    {/* Tab 1: Terminal Output */}
                    {activeConsoleTab === 'output' && (
                      <div>
                        {isRunning ? (
                          <div className="text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
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
                                {runResult.stdout || '// Program returned 0 exit code (no stdout).'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-slate-500">
                            Press <strong>Run</strong> to test against Sample Input, or <strong>Submit</strong> to evaluate all test cases.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 2: Test Suite Results */}
                    {activeConsoleTab === 'tests' && (
                      <div>
                        {isTesting || isSubmitting ? (
                          <div className="text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                            <span>Evaluating test cases against expected outputs...</span>
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
                                  Failed {evaluationResult.totalCount - evaluationResult.passedCount} / {evaluationResult.totalCount} Test Cases
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
                                    <span>
                                      Case #{i + 1} {res.isHidden ? '(Hidden Anti-Cheat Case)' : ''}
                                    </span>
                                    <span>{res.passed ? 'PASSED ✅' : 'FAILED ❌'}</span>
                                  </div>
                                  {!res.passed && !res.isHidden && (
                                    <div className="mt-1 text-[10px] space-y-0.5 text-slate-300">
                                      <div>Expected: <code className="text-emerald-400">{res.expectedOutput}</code></div>
                                      <div>Actual: <code className="text-rose-400">{res.actualOutput}</code></div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500">
                            Press <strong>Test</strong> or <strong>Submit</strong> to run the full test suite.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 3: Custom Stdin */}
                    {activeConsoleTab === 'custom_input' && (
                      <div className="h-full flex flex-col space-y-1">
                        <span className="text-[10px] text-slate-400">Custom Standard Input:</span>
                        <textarea
                          value={customStdin}
                          onChange={e => setCustomStdin(e.target.value)}
                          placeholder="Provide custom input to pass to stdin..."
                          className="w-full flex-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono resize-none outline-none focus:border-brand-primary"
                        />
                      </div>
                    )}
                  </div>

                  {/* BOTTOM ACTION BAR: RUN, TEST, AND SUBMIT BUTTONS */}
                  <div className="p-2.5 border-t border-slate-800 bg-[#161B22] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                      ByteSized Live Code Sandbox
                    </span>

                    <div className="flex items-center gap-2">
                      {/* 1. RUN BUTTON */}
                      <button
                        type="button"
                        onClick={handleRun}
                        disabled={isRunning || isTesting || isSubmitting}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Run code against sample input"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                        <span>Run</span>
                      </button>

                      {/* 2. TEST BUTTON */}
                      <button
                        type="button"
                        onClick={handleTest}
                        disabled={isRunning || isTesting || isSubmitting}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Test against sample cases"
                      >
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Test</span>
                      </button>

                      {/* 3. SUBMIT BUTTON */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isRunning || isTesting || isSubmitting}
                        className="btn-3d btn-3d-green px-5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                        title="Submit code against all test cases (hidden & visible)"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SCREEN 3: RESULT & VICTORY MODAL ----------------- */}
        {screen === 'result' && currentMatch && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-pop">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center text-4xl shadow-2xl animate-bounce">
              <Trophy className="w-10 h-10 fill-current" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-primary block mb-1">
                Battle Concluded
              </span>
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
                {currentMatch.winnerId === 'host'
                  ? '🏆 Knockout Victory!'
                  : currentMatch.winnerId === 'tie'
                  ? '🤝 Honorable Draw!'
                  : '💀 Defeated by Opponent'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                {currentMatch.winnerId === 'host'
                  ? 'Phenomenal coding speed! You outsmarted your rival and completed the challenge set!'
                  : 'Great effort in the coding arena! Every battle sharpens your algorithmic instincts.'}
              </p>
            </div>

            {/* Scorecard */}
            <div className="w-full max-w-md p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Your Score
                </span>
                <span className="text-2xl font-black text-emerald-500">
                  {currentMatch.host.score} pts
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {currentMatch.host.solvedQuestionIds.length} Solved
                </span>
              </div>

              <div className="text-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  {currentMatch.opponent?.name}
                </span>
                <span className="text-2xl font-black text-rose-400">
                  {currentMatch.opponent?.score || 0} pts
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {currentMatch.opponent?.solvedQuestionIds.length || 0} Solved
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setScreen('lobby');
                }}
                className="btn-3d btn-3d-primary px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Another Match</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  stopConfetti();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Return to Track
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
