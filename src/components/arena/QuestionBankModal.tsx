import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti, stopConfetti } from '../../utils/confetti';
import { ArenaChallenge, ChallengeDifficulty, CodeLanguage, TestCase } from '../../types';
import {
  getApprovedChallenges,
  getPendingChallenges,
  submitChallenge,
  approveChallenge,
  rejectChallenge
} from '../../services/arenaService';
import { executeCodeSandbox } from '../../utils/codeRunner';
import {
  BookOpen,
  PlusCircle,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Flame,
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  X,
  ChevronRight,
  Send,
  AlertCircle,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
  Crown,
  Zap
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectForArena?: (challenge: ArenaChallenge) => void;
  onSelectForTraining?: (challenge: ArenaChallenge) => void;
  onOpenCodeZone?: (starterCode: string, language: CodeLanguage) => void;
}

export const QuestionBankModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectForArena,
  onSelectForTraining,
  onOpenCodeZone
}) => {
  const { state } = useGame();
  const isAdmin = state.role === 'admin' || state.authUser?.role === 'admin';
  const userStreak = state.streak || state.authUser?.streak || 0;
  const hasStreakEligibility = userStreak > 10;

  const [activeTab, setActiveTab] = useState<'explore' | 'submit' | 'admin'>('explore');
  const [challenges, setChallenges] = useState<ArenaChallenge[]>([]);
  const [pendingChallenges, setPendingChallenges] = useState<ArenaChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ArenaChallenge | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | ChallengeDifficulty>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Submit Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Arrays & Hashing');
  const [formDifficulty, setFormDifficulty] = useState<ChallengeDifficulty>('easy');
  const [formDescription, setFormDescription] = useState('');
  const [formConstraints, setFormConstraints] = useState('1 <= n <= 10^4\n-10^9 <= nums[i] <= 10^9');
  const [formSampleInput, setFormSampleInput] = useState('4 9\n2 7 11 15');
  const [formSampleOutput, setFormSampleOutput] = useState('0 1');
  const [formSampleExplanation, setFormSampleExplanation] = useState('nums[0] + nums[1] = 9');
  const [formHiddenInput, setFormHiddenInput] = useState('3 6\n3 2 4');
  const [formHiddenOutput, setFormHiddenOutput] = useState('1 2');
  const [formPythonCode, setFormPythonCode] = useState(
`# Write solution here
line = input().split()
print("result")
`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load challenges on open or tab change
  const loadData = async () => {
    setLoading(true);
    try {
      const approved = await getApprovedChallenges();
      setChallenges(approved);

      if (isAdmin) {
        const pending = await getPendingChallenges();
        setPendingChallenges(pending);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, isAdmin]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    challenges.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return ['all', ...Array.from(set)];
  }, [challenges]);

  // Filtered challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      const matchSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      return matchSearch && matchDiff && matchCat;
    });
  }, [challenges, searchQuery, selectedDifficulty, selectedCategory]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formTitle.trim() || !formDescription.trim()) {
      setSubmitError('Please provide both problem title and description.');
      return;
    }

    if (!hasStreakEligibility) {
      setSubmitError('Only learners with a streak of more than 10 days can author questions.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authorName =
        state.authUser?.username ||
        state.authUser?.displayName ||
        'ByteSized Contributor';

      const sampleCases: TestCase[] = [
        {
          id: `sample-1`,
          input: formSampleInput.trim(),
          output: formSampleOutput.trim(),
          explanation: formSampleExplanation.trim()
        }
      ];

      const hiddenCases: TestCase[] = formHiddenInput.trim()
        ? [
            {
              id: `hidden-1`,
              input: formHiddenInput.trim(),
              output: formHiddenOutput.trim(),
              isHidden: true
            }
          ]
        : [];

      const constraintsList = formConstraints
        .split('\n')
        .map(c => c.trim())
        .filter(Boolean);

      const starterTemplates: Record<CodeLanguage, string> = {
        python: formPythonCode,
        javascript: `// Read stdin and print result\nfunction solve(input) {\n  console.log("result");\n}\nsolve(stdin);`,
        cpp: `#include <iostream>\n\nint main() {\n    // Write solution\n    return 0;\n}`,
        c: `#include <stdio.h>\n\nint main() {\n    // Write solution\n    return 0;\n}`
      };

      const result = await submitChallenge(
        {
          title: formTitle,
          description: formDescription,
          difficulty: formDifficulty,
          category: formCategory,
          constraints: constraintsList,
          sampleCases,
          hiddenCases,
          starterTemplates
        },
        {
          id: state.authUser?.id,
          name: authorName,
          streak: userStreak
        }
      );

      if (result.success) {
        sound.playSuccess();
        fireSuccessConfetti();
        setSubmitSuccess(
          '🎉 Challenge submitted successfully! It is now pending admin review. Once approved, it will be available in the Question Bank and Coding Arena.'
        );
        // Reset form
        setFormTitle('');
        setFormDescription('');
        await loadData();
      } else {
        sound.playError();
        setSubmitError(result.error || 'Failed to submit challenge.');
      }
    } catch (err) {
      sound.playError();
      setSubmitError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (q: ArenaChallenge) => {
    sound.playClick();
    const reviewerName = state.authUser?.username || 'Admin';
    await approveChallenge(q.id, reviewerName);
    sound.playSuccess();
    fireSuccessConfetti();
    await loadData();
  };

  const handleReject = async (q: ArenaChallenge) => {
    sound.playClick();
    const reviewerName = state.authUser?.username || 'Admin';
    await rejectChallenge(q.id, reviewerName);
    await loadData();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#0E131F] border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-purple-50/20 dark:from-slate-900 dark:via-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  Question Bank Segment
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                  {challenges.length} Problems
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Official & community verified problem collection for practice and Coding Arena battles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              stopConfetti();
              onClose();
            }}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E131F]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('explore');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Explore Challenges ({challenges.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('submit');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'submit'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Challenge</span>
            {hasStreakEligibility ? (
              <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500">
                <Flame className="w-3 h-3 fill-current" />
                Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-400">
                <Lock className="w-3 h-3" />
                10+ Streak
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('admin');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'border-amber-400 text-amber-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Admin Approvals ({pendingChallenges.length})</span>
              {pendingChallenges.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  {pendingChallenges.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: EXPLORE CHALLENGES */}
          {activeTab === 'explore' && (
            <div className="space-y-4">
              {/* Search & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by problem name, topic, or keyword..."
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

                {/* Difficulty Filter */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 overflow-x-auto pb-1 sm:pb-0">
                  {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedDifficulty(d);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        selectedDifficulty === d
                          ? d === 'easy'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : d === 'medium'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : d === 'hard'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-brand-primary text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-primary"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'All Topics' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Challenge Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChallenges.map(challenge => {
                  const isEasy = challenge.difficulty === 'easy';
                  const isMed = challenge.difficulty === 'medium';

                  return (
                    <div
                      key={challenge.id}
                      onClick={() => setSelectedChallenge(challenge)}
                      className="p-4 rounded-3xl bg-white dark:bg-slate-900/80 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-brand-primary/60 transition-all flex flex-col justify-between gap-3 group cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isEasy
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : isMed
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {challenge.difficulty}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {challenge.category}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-slate-800 dark:text-slate-100 group-hover:text-brand-primary transition-colors line-clamp-1">
                          {challenge.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {challenge.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                        <span className="truncate max-w-[140px]">
                          By {challenge.authorName}
                        </span>
                        <div className="flex items-center gap-1 text-brand-primary font-bold">
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredChallenges.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    <p className="text-sm font-bold">No coding challenges found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SUBMIT CHALLENGE (STREAK > 10 REQUIREMENT) */}
          {activeTab === 'submit' && (
            <div>
              {!hasStreakEligibility ? (
                <div className="max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900/20 to-transparent border-2 border-amber-500/30 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-3xl shadow-inner">
                    <Flame className="w-8 h-8 fill-current animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                      Streak Requirement: &gt; 10 Days Needed
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mt-1">
                      To ensure problem bank quality, community members can upload their own challenge questions only if they maintain a continuous learning streak of more than 10 days.
                    </p>
                  </div>

                  {/* Streak Progress Gauge */}
                  <div className="max-w-xs mx-auto p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-black mb-1.5">
                      <span className="text-slate-500">Your Current Streak</span>
                      <span className="text-amber-500 font-mono font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {userStreak} / 10+ Days
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (userStreak / 11) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-semibold">
                      {11 - userStreak > 0
                        ? `${11 - userStreak} more active days to unlock question authoring!`
                        : 'Eligible!'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400">
                    Keep completing your daily lessons and practice sessions to unlock Question Creator status!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuestion} className="max-w-3xl mx-auto space-y-5">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-black text-indigo-400">Streak Status: Verified Creator ({userStreak} days)</h4>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        Your question will undergo review by Admin tag members. Once approved, it will be automatically available for everyone in both the Question Bank and the Coding Arena!
                      </p>
                    </div>
                  </div>

                  {submitSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-black uppercase text-slate-400">
                        Challenge Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        placeholder="e.g., Longest Substring Without Repeating Characters"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-slate-400">
                        Difficulty
                      </label>
                      <select
                        value={formDifficulty}
                        onChange={e => setFormDifficulty(e.target.value as ChallengeDifficulty)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">
                      Category / Topic *
                    </label>
                    <input
                      type="text"
                      required
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      placeholder="e.g., Arrays, Strings, Dynamic Programming, Math, Stack..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">
                      Problem Statement & Explanation *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      placeholder="Describe the challenge clearly with input details, expected behavior, and examples..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">
                      Constraints (One per line)
                    </label>
                    <textarea
                      rows={2}
                      value={formConstraints}
                      onChange={e => setFormConstraints(e.target.value)}
                      placeholder="1 <= n <= 10^5&#10;-100 <= val <= 100"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Sample Test Case */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Sample Test Case (Visible to Coders)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">Sample Input</span>
                        <textarea
                          rows={2}
                          value={formSampleInput}
                          onChange={e => setFormSampleInput(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">Expected Output</span>
                        <textarea
                          rows={2}
                          value={formSampleOutput}
                          onChange={e => setFormSampleOutput(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hidden Test Case for anti-cheat */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>Hidden Test Case (Anti-Cheat / Validation)</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400">
                        Evaluated upon Submit
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">Hidden Input</span>
                        <textarea
                          rows={2}
                          value={formHiddenInput}
                          onChange={e => setFormHiddenInput(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">Expected Hidden Output</span>
                        <textarea
                          rows={2}
                          value={formHiddenOutput}
                          onChange={e => setFormHiddenOutput(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-3d btn-3d-primary w-full py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting Question...' : 'Submit Challenge for Admin Review'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: ADMIN APPROVALS QUEUE */}
          {activeTab === 'admin' && isAdmin && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <div>
                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider">
                      Admin Review Queue
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Approve questions uploaded by community members with streak &gt; 10 days. Approved questions unlock immediately for Coding Arena rooms.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950">
                  {pendingChallenges.length} Pending
                </span>
              </div>

              {pendingChallenges.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-60" />
                  <p className="text-sm font-bold">All caught up! No pending questions awaiting review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingChallenges.map(q => (
                    <div
                      key={q.id}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                              {q.title}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/15 text-indigo-400">
                              {q.difficulty}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              ({q.category})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>Author: <strong className="text-slate-700 dark:text-slate-300">{q.authorName}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <Flame className="w-3.5 h-3.5 fill-current" />
                              Streak: {q.authorStreak || '> 10'} days
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleReject(q)}
                            className="px-3.5 py-2 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(q)}
                            className="btn-3d btn-3d-green px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve Question</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                          {q.description}
                        </div>

                        {q.sampleCases.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70">
                              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Sample Input:</span>
                              <pre className="whitespace-pre-wrap">{q.sampleCases[0].input}</pre>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70">
                              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Sample Output:</span>
                              <pre className="whitespace-pre-wrap">{q.sampleCases[0].output}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Challenge Detail Modal / Drawer */}
        {selectedChallenge && (
          <div className="absolute inset-0 z-20 bg-white dark:bg-[#0E131F] p-4 sm:p-6 overflow-y-auto flex flex-col justify-between animate-fadeIn">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      selectedChallenge.difficulty === 'easy'
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        : selectedChallenge.difficulty === 'medium'
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    }`}
                  >
                    {selectedChallenge.difficulty}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">
                    {selectedChallenge.title}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                    {selectedChallenge.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                {selectedChallenge.description}
              </div>

              {/* Constraints */}
              {selectedChallenge.constraints && selectedChallenge.constraints.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Constraints:
                  </h4>
                  <ul className="list-disc pl-5 text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1">
                    {selectedChallenge.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Cases */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Sample Cases:
                </h4>
                {selectedChallenge.sampleCases.map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">Input:</span>
                        <pre className="p-2 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">Expected Output:</span>
                        <pre className="p-2 rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">
                          {tc.output}
                        </pre>
                      </div>
                    </div>
                    {tc.explanation && (
                      <p className="text-[11px] font-sans text-slate-500 font-medium pt-1">
                        Explanation: {tc.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 mt-4">
              <span className="text-xs text-slate-400 font-semibold">
                Contributed by: <strong>{selectedChallenge.authorName}</strong>
              </span>

              <div className="flex items-center gap-2">
                {onOpenCodeZone && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      const starter = selectedChallenge.starterTemplates?.c || '';
                      onOpenCodeZone(starter, 'c');
                      setSelectedChallenge(null);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-black text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Practice in CodeZone</span>
                  </button>
                )}

                {onSelectForTraining && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onSelectForTraining(selectedChallenge);
                      setSelectedChallenge(null);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-black text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Train &amp; Beat PB</span>
                  </button>
                )}

                {onSelectForArena && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onSelectForArena(selectedChallenge);
                      setSelectedChallenge(null);
                      onClose();
                    }}
                    className="btn-3d btn-3d-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Battle in Arena</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
