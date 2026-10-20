import React, { useState, useRef, useEffect } from 'react';
import { CourseId } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../data/translations';
import { sound } from '../../utils/audio';
import { CatFace } from '../common/CatFace';
import {
  Flame,
  Zap,
  Heart,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Palette,
  Languages,
  Terminal,
  Lightbulb,
  GraduationCap,
  User,
  Cloud,
  Crown,
  MessageSquare,
  Swords,
  BookOpen
} from 'lucide-react';

interface Props {
  onOpenPractice: () => void;
  onOpenPlacement: () => void;
  onOpenSettings: () => void;
  onOpenIdeaZone?: () => void;
  onOpenCodeZone?: () => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
  onOpenMessaging?: () => void;
  onOpenArena?: () => void;
  onOpenQuestionBank?: () => void;
  onOpenTraining?: () => void;
  onOpenSpeedTraining?: () => void;
}

export const TopBar: React.FC<Props> = ({
  onOpenPractice,
  onOpenPlacement,
  onOpenSettings,
  onOpenIdeaZone,
  onOpenCodeZone,
  onOpenAuth,
  onOpenMessaging,
  onOpenArena,
  onOpenQuestionBank,
  onOpenTraining,
  onOpenSpeedTraining,
}) => {
  const { state, setActiveCourse, toggleSound, toggleDarkMode, toggleLanguage, refillHearts } = useGame();
  const t = useTranslation(state.language);
  const isAdmin = state.role === 'admin' || state.authUser?.role === 'admin';
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [heartDropdownOpen, setHeartDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);

  const activeCourse = COURSES[state.activeCourseId] || COURSES.cpp;

  // Close dropdowns on outside click or touch
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setCourseDropdownOpen(false);
      }
      if (heartRef.current && !heartRef.current.contains(target)) {
        setHeartDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  const handleCourseSelect = (id: CourseId) => {
    setActiveCourse(id);
    setCourseDropdownOpen(false);

    if (!state.courseProgress[id]?.placementTaken) {
      onOpenPlacement();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full">
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2 overflow-visible">
        {/* Left: Brand Mascot & Course Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Logo: Compact Cat Face on mobile, text on desktop */}
          <div
            onClick={() => sound.playMeow()}
            className="flex items-center gap-2 select-none cursor-pointer group shrink-0"
            title="ByteSized - Click Byte to hear a meow!"
          >
            <CatFace size="sm" mood="happy" className="transform group-hover:scale-105 transition-transform" />
            <span className="hidden sm:inline font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
              Byte<span className="text-indigo-600 dark:text-indigo-400">Sized</span>
            </span>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1 hidden sm:block" />

          {/* Course Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setCourseDropdownOpen(!courseDropdownOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <span className="text-sm sm:text-base">{activeCourse.badge.split(' ')[0]}</span>
              <span className="font-semibold max-w-[55px] xs:max-w-[80px] sm:max-w-none truncate">{activeCourse.shortTitle}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>

            {/* Backdrop for mobile */}
            {courseDropdownOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/30 sm:hidden backdrop-blur-xs"
                onClick={() => setCourseDropdownOpen(false)}
              />
            )}

            {/* Dropdown Menu (Centered modal on mobile, dropdown on desktop) */}
            {courseDropdownOpen && (
              <div className="fixed sm:absolute top-16 sm:top-full left-3 sm:left-0 right-3 sm:right-auto mt-1 sm:mt-2 max-w-sm sm:w-64 mx-auto sm:mx-0 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-pop text-left">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400">
                  {t.switchTrack}
                </div>
                {(Object.keys(COURSES) as CourseId[]).map(id => {
                  const c = COURSES[id];
                  const isSelected = id === state.activeCourseId;
                  const progress = state.courseProgress[id];
                  const completedCount = progress?.completedNodeIds.length || 0;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleCourseSelect(id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer mb-0.5 ${
                        isSelected
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{c.badge.split(' ')[0]}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold leading-tight">
                            {c.shortTitle}
                          </span>
                          <span className="text-xs text-slate-400 font-normal">
                            {completedCount} {t.lessonsCompleted}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </button>
                  );
                })}

                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCourseDropdownOpen(false);
                      onOpenPlacement();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.takePlacementTest}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick IdeaZone & CodeZone Launches - Only on XL screens to ensure Auth buttons are never pushed off */}
          <div className="hidden xl:flex items-center gap-1.5 ml-1">
            {onOpenIdeaZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenIdeaZone();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-xs font-medium transition-colors cursor-pointer shrink-0"
                title="IdeaZone - Notepad & Brainstorming Vault"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xl:inline">{t.ideaZone || 'IdeaZone'}</span>
              </button>
            )}

            {onOpenCodeZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenCodeZone();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-xs font-medium transition-colors cursor-pointer shrink-0"
                title="CodeZone - Live Coding Environment"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden xl:inline">{t.codeZone || 'CodeZone'}</span>
              </button>
            )}

            {onOpenArena && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenArena();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-xs font-medium transition-colors cursor-pointer shrink-0"
                title="Coding Arena - Live Duels & Battles"
              >
                <Swords className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden xl:inline">Arena</span>
              </button>
            )}

            {(onOpenSpeedTraining || onOpenTraining) && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onOpenSpeedTraining) onOpenSpeedTraining();
                  else if (onOpenTraining) onOpenTraining();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-xs font-medium transition-colors cursor-pointer shrink-0"
                title="Speed Training - Timed PBs, DSA Roadmaps & Practice"
                aria-label="Speed Training"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span className="hidden xl:inline">Speed</span>
              </button>
            )}

            {onOpenQuestionBank && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenQuestionBank();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-xs font-medium transition-colors cursor-pointer shrink-0"
                title="Question Bank - Browse & Submit Coding Challenges"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden xl:inline">Bank</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Gamification Stats Bar & Action Toggles */}
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 select-none shrink-0">
          {/* Daily Streak (🔥) */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs border border-amber-500/20"
            title={`${state.streak} ${t.streakTitle}`}
          >
            <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{state.streak}</span>
          </div>

          {/* Hearts / Lives (❤️ max 5 or ♾️ if unlimited) */}
          <div className="relative" ref={heartRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setHeartDropdownOpen(!heartDropdownOpen);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                isAdmin
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                  : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                  ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              } font-semibold text-xs cursor-pointer hover:opacity-90 transition-opacity`}
              title={
                isAdmin
                  ? '👑 Admin Privileges: Unlimited Hearts Forever'
                  : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                  ? 'Unlimited Hearts Active (.EDU Student Perk)'
                  : `${t.heartsRemaining} (${t.refill})`
              }
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isAdmin || (state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil)
                    ? 'fill-amber-400 stroke-amber-400'
                    : 'fill-rose-500 stroke-rose-500'
                }`}
              />
              <span>
                {isAdmin || (state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil) ? '♾️' : state.hearts}
              </span>
            </button>

            {/* Backdrop for mobile */}
            {heartDropdownOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/30 sm:hidden backdrop-blur-xs"
                onClick={() => setHeartDropdownOpen(false)}
              />
            )}

            {/* Hearts Popover (Centered modal on mobile, dropdown on desktop) */}
            {heartDropdownOpen && (
              <div className="fixed sm:absolute top-16 sm:top-full left-3 sm:left-auto right-3 sm:right-0 mt-1 sm:mt-2 max-w-sm sm:w-64 mx-auto sm:mx-0 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-pop text-center">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  {state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
                    <div className="flex items-center gap-1.5 text-xl font-bold text-amber-500">
                      <span>💖</span>
                      <span>♾️</span>
                    </div>
                  ) : (
                    Array.from({ length: state.maxHearts }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 ${
                          i < state.hearts
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))
                  )}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
                  {isAdmin ? (
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      <Crown className="w-4 h-4 fill-current" />
                      Admin Unlimited Hearts Forever!
                    </span>
                  ) : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 fill-current" />
                      Unlimited Hearts Active!
                    </span>
                  ) : (
                    `${state.hearts} / ${state.maxHearts} ${t.hearts}`
                  )}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                  {isAdmin
                    ? 'As an Admin, your hearts never deplete.'
                    : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                    ? 'Your .edu student perk gives you infinite hearts for 2 days!'
                    : t.heartsDesc}
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHeartDropdownOpen(false);
                      onOpenPractice();
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t.practiceToRefill}
                  </button>

                  <button
                    type="button"
                    disabled={state.gems < 50 || state.hearts >= state.maxHearts}
                    onClick={() => {
                      refillHearts('gems');
                      setHeartDropdownOpen(false);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      state.gems >= 50 && state.hearts < state.maxHearts
                        ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 cursor-pointer border border-slate-200 dark:border-slate-700'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>{t.refillNow}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Gems (💎) - Desktop only */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              isAdmin
                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
            } font-semibold text-xs shrink-0`}
            title={isAdmin ? '👑 Admin Unlimited Diamonds' : `${state.gems} ${t.gems}`}
          >
            <span>💎</span>
            <span className="hidden xl:inline">{isAdmin ? '♾️ Unlimited' : state.gems}</span>
            <span className="xl:hidden">{isAdmin ? '♾️' : state.gems}</span>
          </div>

          {/* XP (⚡) - Display on xl screens to preserve desktop topbar space */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 font-semibold text-xs shrink-0"
            title={`${state.xp} ${t.totalXp}`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>{state.xp}</span>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1 hidden xs:block" />

          {/* Language Switcher Pill: EN ⇄ বাং (1-tap instant switch) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl text-xs font-black bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary transition-all cursor-pointer border border-brand-primary/30 shrink-0"
            title={state.language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন (Switch to Bangla)' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-primary" />
            <span className="font-extrabold text-[11px] sm:text-xs">
              {state.language === 'en' ? 'বাং' : 'EN'}
            </span>
          </button>

          {/* Dark Mode Toggle - ALWAYS VISIBLE AND CLICKABLE (1-TAP) ON ALL SCREENS */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              toggleDarkMode();
            }}
            className="p-1 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={state.darkMode ? t.lightMode : t.darkMode}
          >
            {state.darkMode ? (
              <Sun className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {/* Theme & Sound Customizer - Desktop only */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="hidden lg:inline-flex p-1 sm:p-2 rounded-xl text-brand-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={t.themesAndSounds}
          >
            <Palette className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-brand-secondary" />
          </button>

          {/* Sound Toggle - Desktop only */}
          <button
            type="button"
            onClick={toggleSound}
            className="hidden lg:inline-flex p-1 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={state.soundEnabled ? t.muteSound : t.enableSound}
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-brand-primary" />
            ) : (
              <VolumeX className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-slate-400" />
            )}
          </button>

          {/* Community Chat Launcher - Tablet and Desktop */}
          {onOpenMessaging && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenMessaging();
              }}
              className="hidden sm:inline-flex relative p-1 sm:p-2 rounded-xl text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer shrink-0"
              title={state.authUser ? "Community Chat & Code Share" : "Community Chat (Sign In Required)"}
            >
              <MessageSquare className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
              {state.authUser ? (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <span className="absolute -top-0.5 -right-0.5 text-[10px]">🔒</span>
              )}
            </button>
          )}

          {/* Account / Sign In & Sign Up Buttons - ALWAYS VISIBLE ON ALL SCREENS, NEVER HIDDEN */}
          {onOpenAuth && (
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-0.5 sm:ml-1">
              {state.authUser ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenAuth('login');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 shrink-0"
                  title={`Account: ${state.authUser.username ? `@${state.authUser.username}` : (state.authUser.displayName || state.authUser.email)}`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                      alt="Avatar"
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-slate-900 border border-slate-700 object-cover"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-white dark:ring-slate-900 ${
                        state.activeStatus === 'away'
                          ? 'bg-amber-400'
                          : state.activeStatus === 'busy'
                          ? 'bg-rose-500'
                          : state.activeStatus === 'offline'
                          ? 'bg-slate-400'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span className="inline-block font-medium text-xs truncate max-w-[65px] xs:max-w-[95px] sm:max-w-[130px] md:max-w-[160px]">
                    {state.authUser.username ? `@${state.authUser.username}` : (state.authUser.displayName || state.authUser.email.split('@')[0])}
                  </span>
                  {isAdmin ? (
                    <span className="hidden xs:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-400/20 text-amber-500 border border-amber-400/30 shrink-0">
                      👑 Admin
                    </span>
                  ) : null}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenAuth('login');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    title="Sign In to your account"
                  >
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenAuth('register');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 shadow-xs shrink-0"
                    title="Sign Up free"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
