import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../data/translations';
import { sound } from '../../utils/audio';
import { CatFace } from '../common/CatFace';
import { supabase } from '../../lib/supabaseClient';
import { UserRole } from '../../types';
import {
  Trophy,
  Target,
  RotateCcw,
  Sparkles,
  Zap,
  Lightbulb,
  CheckCircle,
  Heart,
  ChevronRight,
  Palette,
  Moon,
  Sun,
  Terminal,
  Code2,
  GraduationCap,
  User,
  Cloud,
  Crown,
  MessageSquare,
  Lock,
  Swords,
  BookOpen
} from 'lucide-react';

interface Props {
  onOpenPractice: () => void;
  onOpenPlacement: () => void;
  onOpenSettings?: () => void;
  onOpenIdeaZone?: () => void;
  onOpenCodeZone?: () => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
  onOpenMessaging?: () => void;
  onOpenArena?: () => void;
  onOpenQuestionBank?: () => void;
  filter?: 'all' | 'practice' | 'quests' | 'leaderboard' | 'settings';
}

export const RightSidebar: React.FC<Props> = ({
  onOpenPractice,
  onOpenPlacement,
  onOpenSettings,
  onOpenIdeaZone,
  onOpenCodeZone,
  onOpenAuth,
  onOpenMessaging,
  onOpenArena,
  onOpenQuestionBank,
  filter = 'all',
}) => {
  const { state, toggleDarkMode } = useGame();
  const t = useTranslation(state.language);
  const isAdmin = state.role === 'admin' || state.authUser?.role === 'admin';

  const [cloudLeaders, setCloudLeaders] = useState<
    Array<{
      id: string;
      username?: string;
      display_name?: string;
      xp?: number;
      avatar_url?: string;
      role?: string;
    }>
  >([]);

  // Fetch live top learners from Supabase profiles
  useEffect(() => {
    let isMounted = true;
    const fetchTopLearners = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, display_name, xp, avatar_url, role')
          .order('xp', { ascending: false })
          .limit(10);

        if (!error && data && isMounted) {
          setCloudLeaders(data);
        }
      } catch {
        // ignore
      }
    };

    fetchTopLearners();
    return () => {
      isMounted = false;
    };
  }, [state.authUser?.id, state.xp]);

  // Dynamic, reactive Leaderboard based on current user's real points
  const sortedLeaderboard = useMemo(() => {
    interface ContenderItem {
      id: string;
      name: string;
      username?: string;
      xp: number;
      avatar: string;
      role: UserRole;
      isUser: boolean;
    }

    const PEER_CONTENDERS: ContenderItem[] = [
      { id: 'peer-linus', name: 'Linus T.', username: 'linus', xp: 620, avatar: '🐧', role: 'admin' as UserRole, isUser: false },
      { id: 'peer-grace', name: 'Grace H.', username: 'grace_h', xp: 510, avatar: '🚀', role: 'user' as UserRole, isUser: false },
      { id: 'peer-bjarne', name: 'Bjarne S.', username: 'bjarne_cpp', xp: 440, avatar: '⚡', role: 'user' as UserRole, isUser: false },
      { id: 'peer-ada', name: 'Ada L.', username: 'ada_lovelace', xp: 220, avatar: '✨', role: 'user' as UserRole, isUser: false },
      { id: 'peer-dennis', name: 'Dennis R.', username: 'dennis_c', xp: 150, avatar: '💾', role: 'user' as UserRole, isUser: false },
    ];

    const currentUserId = state.authUser?.id;
    const currentUserName =
      state.authUser?.displayName ||
      state.authUser?.username ||
      (state.language === 'bn' ? 'আপনি (চ্যাম্পিয়ন)' : 'You (ByteSized Champion)');
    const currentUserAvatar = state.authUser?.avatarUrl || '🐈‍⬛';
    const currentUserRole = (state.authUser?.role || state.role) as UserRole;
    const currentUserXp = state.xp || 0;

    // Filter out current user from cloud profiles to prevent duplicate listing
    const cloudFiltered: ContenderItem[] = cloudLeaders
      .filter((l) => !currentUserId || l.id !== currentUserId)
      .map((l) => ({
        id: l.id,
        name: l.display_name || l.username || 'Learner',
        username: l.username,
        xp: l.xp || 0,
        avatar: l.avatar_url || '👤',
        role: (l.role as UserRole) || 'user',
        isUser: false,
      }));

    // Merge peers and cloud learners (dedup by username or ID)
    const contenders: ContenderItem[] = [...PEER_CONTENDERS];
    for (const c of cloudFiltered) {
      if (!contenders.some((p) => (p.username && p.username === c.username) || p.id === c.id)) {
        contenders.push(c);
      }
    }

    // Insert the current user with their exact, real-time reactive points!
    const userEntry = {
      id: currentUserId || 'me',
      name: currentUserName,
      username: state.authUser?.username,
      xp: currentUserXp,
      avatar: currentUserAvatar,
      role: currentUserRole,
      isUser: true,
    };

    contenders.push(userEntry);

    // Sort strictly by XP descending. If tied, prioritize active user!
    contenders.sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (a.isUser) return -1;
      if (b.isUser) return 1;
      return 0;
    });

    // Assign dynamic ranks (1-indexed)
    return contenders.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [cloudLeaders, state.authUser, state.xp, state.role, state.language]);

  const userRankItem = sortedLeaderboard.find((u) => u.isUser);
  const userRank = userRankItem?.rank || 1;
  const userAhead = userRank > 1 ? sortedLeaderboard[userRank - 2] : null;
  const xpNeededToOvertake = userAhead ? Math.max(10, userAhead.xp - state.xp + 10) : 0;

  // Daily CS Wisdom
  const csTips = [
    'Amortized analysis proves vector capacity doubling gives O(1) average append time.',
    'RAII guarantees zero memory leaks by coupling resource lifetime to object scope.',
    'Prefer Python generator expressions ( ) over [ ] to conserve RAM on large datasets.',
    'Always use virtual destructors in polymorphic C++ base classes to avoid UB!',
    'Hash tables provide O(1) average lookup, but degrade to O(N) if collisions peak.'
  ];
  const tipOfTheDay = csTips[state.streak % csTips.length];

  const showPractice = filter === 'all' || filter === 'practice';
  const showQuests = filter === 'all' || filter === 'quests';
  const showLeaderboard = filter === 'all' || filter === 'leaderboard';
  const showSettings = filter === 'all' || filter === 'settings';

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-5 py-4 lg:py-6 px-3 sm:px-4">
      {/* ByteSized Account & Student .EDU Perks Card */}
      {onOpenAuth && (filter === 'all' || filter === 'practice' || filter === 'settings') && (
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/40 border-2 border-indigo-500/20 dark:border-indigo-500/30 shadow-sm text-left flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black shadow-md ${
                isAdmin
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                  : 'bg-indigo-600 text-white shadow-indigo-500/20'
              }`}>
                {isAdmin ? <Crown className="w-5 h-5 fill-current" /> : state.authUser ? <User className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight truncate">
                    {state.authUser ? (state.authUser.displayName || state.authUser.email?.split('@')[0]) : 'ByteSized Account'}
                  </h4>
                  {isAdmin ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border border-amber-300">
                      👑 Admin
                    </span>
                  ) : state.authUser ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
                      User
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAdmin ? (
                    <span className="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                      👑 Unlimited 💖 &amp; 💎
                    </span>
                  ) : state.authUser ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle className="w-3 h-3" /> Synced
                    </span>
                  ) : (
                    <span>Save your learning progress</span>
                  )}
                </div>
              </div>
            </div>
            {isAdmin ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                👑 ♾️ Unlimited
              </span>
            ) : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                ♾️ Unlimited
              </span>
            ) : null}
          </div>

          {!state.authUser ? (
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-indigo-500/20 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>🎓 .EDU Student Perk</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Register with your school <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">.edu</span> email to get <span className="font-black text-amber-500">+200 Diamonds 💎</span> &amp; <span className="font-black text-rose-500">Unlimited Hearts ❤️</span> for 2 days!
              </p>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Connected as <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{state.authUser.email}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAuth?.(state.authUser ? 'login' : 'register');
            }}
            className={`btn-3d w-full py-2.5 px-3 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer ${
              state.authUser
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-b-2 border-slate-300 dark:border-slate-900'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 text-white shadow-md border-b-2 border-indigo-800'
            }`}
          >
            {state.authUser ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Manage Profile &amp; Role</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Community Messaging Card */}
      {onOpenMessaging && (filter === 'all' || filter === 'practice') && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenMessaging();
          }}
          className="btn-3d p-4 rounded-3xl bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-blue-600/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-blue-950/30 border-2 border-indigo-500/20 hover:border-indigo-500/40 text-left transition-all cursor-pointer group flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  Community Chat
                </span>
                {state.authUser ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500 font-bold uppercase tracking-wider shrink-0 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Sign In</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {state.authUser ? 'Live discussion, DSA & code share' : 'Members only • Sign in to chat & share code'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      )}

      {/* Coding Arena Battle Card */}
      {onOpenArena && (filter === 'all' || filter === 'practice') && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenArena();
          }}
          className="btn-3d p-4 rounded-3xl bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-indigo-950/30 border-2 border-purple-500/25 hover:border-purple-500/50 text-left transition-all cursor-pointer group flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Swords className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                  Coding Arena
                </h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-black uppercase tracking-wider shrink-0 border border-purple-500/30">
                  DUELS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Stopwatch race &amp; Takedown knockout battles
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      )}

      {/* Dev Hub: IdeaZone & CodeZone */}
      {(filter === 'all' || filter === 'practice') && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 text-white flex items-center justify-center font-black shadow-sm text-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                  Developer Hub
                </h4>
                <span className="text-[11px] font-semibold text-slate-400">
                  Idea Vault & Playground
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-0.5">
            {onOpenIdeaZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenIdeaZone();
                }}
                className="btn-3d flex flex-col p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5 w-full">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Lightbulb className="w-4 h-4 fill-white" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {t.ideaZone || 'IdeaZone'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  Notes & Vault
                </span>
              </button>
            )}

            {onOpenCodeZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenCodeZone();
                }}
                className="btn-3d flex flex-col p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5 w-full">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {t.codeZone || 'CodeZone'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  Live Compiler
                </span>
              </button>
            )}
          </div>
        </div>
      )}
      {/* Settings / Appearance Card (on mobile settings view) */}
      {filter === 'settings' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
              {t.appearanceMode}
            </h4>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              {state.darkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {state.darkMode ? t.darkAppearance : t.lightAppearance}
                </span>
                <span className="text-[11px] text-slate-400">
                  {state.darkMode ? 'OLED Dark' : 'Crisp Light'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                toggleDarkMode();
              }}
              className="btn-3d px-3 py-1.5 rounded-xl text-xs font-black uppercase bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-900 cursor-pointer"
            >
              {t.toggle}
            </button>
          </div>
        </div>
      )}

      {/* Hearts Low Warning Card */}
      {showPractice && state.hearts < 5 && (
        <div className="p-4 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-between gap-3 animate-wiggle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-rose text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-slate-800 dark:text-slate-100">
                {state.hearts} / 5 {t.hearts}
              </div>
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {t.practiceRefillHearts}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPractice}
            className="btn-3d btn-3d-rose px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer"
          >
            {t.refill}
          </button>
        </div>
      )}

      {/* Weak Areas / Practice Mistakes Widget */}
      {showPractice && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                {t.weakAreas}
              </h4>
            </div>
            <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {state.mistakes.length} {t.logged}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {state.mistakes.length > 0
              ? t.pendingMistakes(state.mistakes.length)
              : t.zeroMistakes}
          </p>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenPractice();
            }}
            className="btn-3d btn-3d-purple w-full py-2.5 px-3 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.practiceMistakesBtn}
          </button>
        </div>
      )}

      {/* Daily Quests Widget */}
      {showQuests && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                {t.dailyQuests}
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-400">{t.resetsDaily}</span>
          </div>

          <div className="flex flex-col gap-3">
            {state.quests.map(quest => (
              <div key={quest.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span>{quest.icon}</span>
                    <span>{quest.title}</span>
                  </span>
                  <span className="font-mono text-slate-400">
                    {quest.progress} / {quest.target}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      quest.completed ? 'bg-brand-primary' : 'bg-brand-gold'
                    }`}
                    style={{
                      width: `${Math.min(100, (quest.progress / quest.target) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Reward: +{quest.rewardXp} XP, +{quest.rewardGems} 💎</span>
                  {quest.completed && (
                    <span className="text-brand-primary font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Dynamic Reactive Leaderboard */}
      {showLeaderboard && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                  {t.diamondLeague}
                </h4>
                <span className="text-[11px] font-bold text-slate-400">
                  {t.topThreeAdvance}
                </span>
              </div>
            </div>
            {userRank === 1 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-sm border border-amber-300 animate-pulse">
                🏆 #1 Champion
              </span>
            ) : (
              <span className="text-xs font-mono font-black text-indigo-500">
                Rank #{userRank}
              </span>
            )}
          </div>

          {/* Dynamic Rank Alert Banner */}
          {userRank === 1 ? (
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black flex items-center gap-2 shadow-xs">
              <Crown className="w-4 h-4 text-amber-400 shrink-0 fill-current animate-wiggle" />
              <span>You are currently #1 at the top of the Diamond League!</span>
            </div>
          ) : userAhead ? (
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-300 text-xs font-bold flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Earn <strong className="text-indigo-400 font-mono font-black">+{xpNeededToOvertake} XP</strong> to overtake #{userRank - 1}!</span>
              </span>
            </div>
          ) : null}

          {/* Contenders List */}
          <div className="flex flex-col gap-1.5">
            {sortedLeaderboard.slice(0, 6).map((user) => {
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const isThird = user.rank === 3;
              const isUserRow = user.isUser;

              return (
                <div
                  key={user.id}
                  className={`p-2.5 rounded-2xl flex items-center justify-between transition-all ${
                    isUserRow && isFirst
                      ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border-2 border-amber-400 text-amber-300 font-black shadow-sm ring-1 ring-amber-400/30'
                      : isUserRow
                      ? 'bg-brand-primary/15 text-brand-primary font-black border-2 border-brand-primary/40 dark:bg-brand-primary/20 shadow-xs'
                      : isFirst
                      ? 'bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 text-center text-xs font-black shrink-0">
                      {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${user.rank}`}
                    </span>

                    <span className="shrink-0 flex items-center justify-center">
                      {isUserRow ? (
                        <CatFace size="xs" mood={isFirst ? 'cheering' : 'happy'} />
                      ) : user.avatar && user.avatar.startsWith('http') ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-lg object-cover bg-slate-900 border border-slate-700"
                        />
                      ) : (
                        <span className="text-base">{user.avatar}</span>
                      )}
                    </span>

                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <span className="text-xs truncate">{user.name}</span>
                      {user.role === 'admin' ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border border-amber-300 shrink-0">
                          👑 Admin
                        </span>
                      ) : isUserRow ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40 shrink-0">
                          You
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs font-black text-amber-500 shrink-0 ml-2">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>{user.xp} XP</span>
                  </div>
                </div>
              );
            })}

            {/* Pinned User Row if User is Ranked Beyond Top 6 */}
            {userRank > 6 && userRankItem && (
              <>
                <div className="text-center text-[10px] text-slate-400 font-bold py-0.5">•••</div>
                <div className="p-2.5 rounded-2xl flex items-center justify-between bg-brand-primary/15 text-brand-primary font-black border-2 border-brand-primary/40 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 text-center text-xs font-black shrink-0">
                      #{userRank}
                    </span>
                    <CatFace size="xs" mood="happy" />
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <span className="text-xs truncate">{userRankItem.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40 shrink-0">
                        You
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs font-black text-amber-500 shrink-0 ml-2">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>{userRankItem.xp} XP</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CS Tip of the Day Card */}
      {(showQuests || showLeaderboard) && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20 text-left flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-indigo-500 tracking-wider">
              {t.engineersWisdom}
            </span>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {tipOfTheDay}
            </p>
          </div>
        </div>
      )}

      {/* Personalize Theme & Sounds Button */}
      {showSettings && onOpenSettings && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-black uppercase transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-secondary" />
            {t.themesAndSounds}
          </span>
          <ChevronRight className="w-4 h-4 text-purple-400" />
        </button>
      )}

      {/* Quick Test Out / Placement link */}
      {(showSettings || showPractice) && (
        <button
          type="button"
          onClick={onOpenPlacement}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black uppercase transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            {t.testOutPlacement}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      )}
    </aside>
  );
};
