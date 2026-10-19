import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../data/translations';
import { sound } from '../../utils/audio';
import { COURSES } from '../../data/courses';
import { CourseId } from '../../types';
import { CatFace } from '../common/CatFace';
import {
  Map,
  RotateCcw,
  Target,
  Trophy,
  Lightbulb,
  Terminal,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Check,
  Zap,
  Flame,
  Settings,
  Lock,
  Swords,
  BookOpen,
  User,
  Crown
} from 'lucide-react';

interface Props {
  onOpenPractice: () => void;
  onOpenPlacement?: () => void;
  onOpenSettings?: () => void;
  onOpenIdeaZone?: () => void;
  onOpenCodeZone?: () => void;
  onOpenMessaging?: () => void;
  onOpenArena?: () => void;
  onOpenQuestionBank?: () => void;
  onOpenTraining?: () => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
}

export const LeftSidebar: React.FC<Props> = ({
  onOpenPractice,
  onOpenPlacement,
  onOpenSettings,
  onOpenIdeaZone,
  onOpenCodeZone,
  onOpenMessaging,
  onOpenArena,
  onOpenQuestionBank,
  onOpenTraining,
  onOpenAuth,
}) => {
  const { state, setActiveCourse } = useGame();
  const t = useTranslation(state.language);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [catMood, setCatMood] = useState<'happy' | 'cheering' | 'thinking' | 'idle'>('idle');

  const currentCourse = COURSES[state.activeCourseId] || COURSES.cpp;
  const progress = state.courseProgress[state.activeCourseId] || {
    completedNodeIds: [],
    currentNodeId: '',
    placementTaken: false,
    unlockedUnitCount: 1,
  };

  const totalCourseNodes = currentCourse.units.reduce((acc, u) => acc + u.nodes.length, 0);
  const completedNodesCount = progress.completedNodeIds.length;
  const completionPercent = totalCourseNodes > 0
    ? Math.round((completedNodesCount / totalCourseNodes) * 100)
    : 0;

  const handleSelectCourse = (courseId: CourseId) => {
    sound.playClick();
    setActiveCourse(courseId);
    setIsCourseMenuOpen(false);
  };

  const handleCatPet = () => {
    sound.playMeow();
    setCatMood('cheering');
    setTimeout(() => setCatMood('idle'), 1600);
  };

  return (
    <aside className="w-64 flex flex-col gap-4 py-4 lg:py-6 text-left select-none">
      {/* Active Course Card & Switcher */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsCourseMenuOpen(!isCourseMenuOpen);
          }}
          className="w-full p-3.5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-brand-primary/50 transition-all cursor-pointer flex items-center justify-between gap-2.5 text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black shadow-sm shrink-0 text-lg">
              {currentCourse.id === 'cpp'
                ? '⚡'
                : currentCourse.id === 'c'
                ? '⚙️'
                : currentCourse.id === 'python'
                ? '🐍'
                : currentCourse.id === 'oop'
                ? '🧱'
                : '🌳'}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-tight">
                Active Track
              </span>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-brand-primary transition-colors">
                {currentCourse.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(8, completionPercent))}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {completionPercent}%
                </span>
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
              isCourseMenuOpen ? 'rotate-180 text-brand-primary' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu of Available Courses */}
        {isCourseMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-1 animate-slideDown">
            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Switch Course Track
            </div>
            {Object.values(COURSES).map((c) => {
              const isSelected = c.id === state.activeCourseId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCourse(c.id)}
                  className={`w-full px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary/15 text-brand-primary font-black'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>
                      {c.id === 'cpp'
                        ? '⚡'
                        : c.id === 'c'
                        ? '⚙️'
                        : c.id === 'python'
                        ? '🐍'
                        : c.id === 'oop'
                        ? '🧱'
                        : '🌳'}
                    </span>
                    <span className="truncate">{c.title}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Navigation Rail */}
      <nav className="p-2.5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full px-3 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-3 bg-brand-primary text-white shadow-md active:scale-95 cursor-pointer"
        >
          <Map className="w-4 h-4" />
          <span>{t.learn} (Learning Map)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenPractice();
          }}
          className="w-full px-3 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer active:scale-95"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-purple-500" />
            <span>{t.practice}</span>
          </div>
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500">
            +1 ❤️
          </span>
        </button>

        {onOpenPlacement && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenPlacement();
            }}
            className="w-full px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Placement Test</span>
          </button>
        )}

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-2" />

        {onOpenIdeaZone && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenIdeaZone();
            }}
            className="w-full px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-3 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>IdeaZone (Vault)</span>
          </button>
        )}

        {onOpenCodeZone && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenCodeZone();
            }}
            className="w-full px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-3 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>CodeZone (IDE)</span>
          </button>
        )}

        {onOpenMessaging && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenMessaging();
            }}
            className="w-full px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center justify-between text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>Community Chat</span>
            </div>
            {!state.authUser ? (
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        )}

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-2" />

        {onOpenArena && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenArena();
            }}
            className="w-full px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center justify-between text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Swords className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform" />
              <span>Coding Arena</span>
            </div>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              DUELS
            </span>
          </button>
        )}

        {onOpenTraining && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenTraining();
            }}
            className="w-full px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center justify-between text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>Speed Training</span>
            </div>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              PBs
            </span>
          </button>
        )}

        {onOpenQuestionBank && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenQuestionBank();
            }}
            className="w-full px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-3 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>Question Bank</span>
          </button>
        )}
      </nav>

      {/* Account / Sign In & Sign Up Card - Always Accessible */}
      {onOpenAuth && !state.authUser && (
        <div className="p-3.5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 border-2 border-indigo-500/25 dark:border-indigo-500/40 shadow-sm flex flex-col gap-2.5 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-sm text-sm shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 block leading-tight">
                ByteSized Account
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate block">
                Save streaks, gems &amp; rank
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAuth('login');
              }}
              className="py-1.5 px-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer text-center"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAuth('register');
              }}
              className="py-1.5 px-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 shadow-sm transition-all cursor-pointer text-center"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* When Logged In: Profile Banner */}
      {onOpenAuth && state.authUser && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenAuth('login');
          }}
          className="p-3 rounded-3xl bg-white dark:bg-slate-900/90 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-brand-primary/50 transition-all cursor-pointer flex items-center justify-between gap-2 text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                alt="Avatar"
                className="w-9 h-9 rounded-2xl bg-slate-900 border border-brand-primary object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate block">
                  {state.authUser.username ? `@${state.authUser.username}` : (state.authUser.displayName || state.authUser.email.split('@')[0])}
                </span>
                {state.role === 'admin' || state.authUser.role === 'admin' ? (
                  <span className="px-1 py-0.2 rounded text-[8px] font-black bg-amber-400 text-slate-950 shrink-0">👑</span>
                ) : null}
              </div>
              <span className="text-[10px] text-brand-primary font-bold block">
                Manage Profile
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      )}

      {/* Byte the Cat Interactive Companion Card */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-[#111827] dark:to-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div
            onClick={handleCatPet}
            className="flex items-center gap-2 cursor-pointer group"
            title="Click Byte for encouragement!"
          >
            <div className="relative group-hover:scale-110 transition-transform">
              <CatFace mood={catMood} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 block leading-tight">
                Byte 🐾
              </span>
              <span className="text-[10px] font-bold text-brand-primary">
                Code Companion
              </span>
            </div>
          </div>

          {/* Day Streak Pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black">
            <Flame className="w-3.5 h-3.5 fill-current text-amber-500 animate-wiggle" />
            <span>{state.streak}d</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
          &ldquo;Break complex algorithms into tiny 1-line steps. You&apos;ve got this!&rdquo;
        </p>
      </div>
    </aside>
  );
};
