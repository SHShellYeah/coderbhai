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
  Crown,
  Brain,
  Compass
} from 'lucide-react';
import { DsaRoadmapId } from '../../types/dsa';

interface Props {
  onOpenPractice: () => void;
  onOpenPlacement?: () => void;
  onOpenSettings?: () => void;
  onOpenIdeaZone?: () => void;
  onOpenCodeZone?: () => void;
  onOpenMessaging?: () => void;
  onOpenArena?: () => void;
  onOpenSpeedTraining?: (tab?: 'hub' | 'timed-training') => void;
  onOpenQuestionBank?: () => void;
  onOpenTraining?: () => void;
  onOpenRoadmap?: (roadmapId: DsaRoadmapId) => void;
  onOpenAuth?: (tab?: 'login' | 'register' | 'forgot' | 'update-password') => void;
}

export const LeftSidebar: React.FC<Props> = ({
  onOpenPractice,
  onOpenPlacement,
  onOpenSettings,
  onOpenIdeaZone,
  onOpenCodeZone,
  onOpenMessaging,
  onOpenArena,
  onOpenSpeedTraining,
  onOpenQuestionBank,
  onOpenTraining,
  onOpenRoadmap,
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
          className="w-full p-3 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between gap-2.5 text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base shrink-0">
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
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block leading-tight">
                Active Track
              </span>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {currentCourse.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(8, completionPercent))}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  {completionPercent}%
                </span>
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
              isCourseMenuOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu of Available Courses */}
        {isCourseMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 p-2 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xl space-y-0.5 animate-slideDown">
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Switch Course Track
            </div>
            {Object.values(COURSES).map((c) => {
              const isSelected = c.id === state.activeCourseId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCourse(c.id)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
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
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Navigation Rail */}
      <nav className="p-2 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xs space-y-0.5">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs cursor-pointer"
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
          className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>{t.practice}</span>
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
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
            className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Byte&apos;s Plan</span>
          </button>
        )}

        <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1 mx-2" />

        {onOpenIdeaZone && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenIdeaZone();
            }}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
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
            className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
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
            className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>Community Chat</span>
            </div>
            {!state.authUser ? (
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        )}

        <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1 mx-2" />

        {onOpenArena && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenArena();
            }}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Swords className="w-4 h-4 text-purple-500" />
              <span>Coding Arena</span>
            </div>
            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20">
              DUELS
            </span>
          </button>
        )}

        {/* Unified Speed Training Hub */}
        {onOpenSpeedTraining && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenSpeedTraining();
            }}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <span>Speed Training</span>
            </div>
            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              HUB
            </span>
          </button>
        )}

        {/* Standalone fallbacks only when the hub is unavailable */}
        {!onOpenSpeedTraining && (
          <>
            {onOpenQuestionBank && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenQuestionBank();
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-500" />
                <span>Question Bank</span>
              </button>
            )}

            {onOpenRoadmap && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenRoadmap('blind75');
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span>DSA Roadmaps</span>
                </div>
                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                  75 &amp; 150
                </span>
              </button>
            )}
          </>
        )}
      </nav>

      {/* Account / Sign In & Sign Up Card - Always Accessible */}
      {onOpenAuth && !state.authUser && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2.5 text-left">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-medium text-xs shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block leading-tight">
                ByteSized Account
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate block">
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
              className="py-1.5 px-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-center"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAuth('register');
              }}
              className="py-1.5 px-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 shadow-xs transition-colors cursor-pointer text-center"
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
          className="p-3 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between gap-2 text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate block">
                  {state.authUser.username ? `@${state.authUser.username}` : (state.authUser.displayName || state.authUser.email.split('@')[0])}
                </span>
                {state.role === 'admin' || state.authUser.role === 'admin' ? (
                  <span className="px-1 py-0.2 rounded text-[8px] font-semibold bg-amber-400 text-slate-950 shrink-0">👑</span>
                ) : null}
              </div>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium block">
                Manage Profile
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      )}

      {/* Byte the Cat Interactive Companion Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div
            onClick={handleCatPet}
            className="flex items-center gap-2 cursor-pointer group"
            title="Click Byte for encouragement!"
          >
            <div className="relative group-hover:scale-105 transition-transform">
              <CatFace mood={catMood} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block leading-tight">
                Byte 🐾
              </span>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                Code Companion
              </span>
            </div>
          </div>

          {/* Day Streak Pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{state.streak}d</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed italic bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80">
          &ldquo;Break complex algorithms into tiny 1-line steps. You&apos;ve got this!&rdquo;
        </p>
      </div>
    </aside>
  );
};
