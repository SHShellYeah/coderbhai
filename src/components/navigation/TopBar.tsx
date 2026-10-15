import React, { useState, useRef, useEffect } from 'react';
import { CourseId } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
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
  MoreVertical
} from 'lucide-react';

interface Props {
  onOpenPractice: () => void;
  onOpenPlacement: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<Props> = ({ onOpenPractice, onOpenPlacement, onOpenSettings }) => {
  const { state, setActiveCourse, toggleSound, toggleDarkMode, refillHearts } = useGame();
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [heartDropdownOpen, setHeartDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const activeCourse = COURSES[state.activeCourseId] || COURSES.cpp;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCourseDropdownOpen(false);
      }
      if (heartRef.current && !heartRef.current.contains(e.target as Node)) {
        setHeartDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCourseSelect = (id: CourseId) => {
    setActiveCourse(id);
    setCourseDropdownOpen(false);

    if (!state.courseProgress[id]?.placementTaken) {
      onOpenPlacement();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors w-full max-w-full overflow-visible">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Brand Mascot & Course Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Logo with Animated Cat Face */}
          <div
            onClick={() => sound.playMeow()}
            className="flex items-center gap-1.5 sm:gap-2 select-none cursor-pointer group"
            title="CoderBhai - Click Bhai to hear a meow!"
          >
            <CatFace size="sm" mood="happy" className="transform group-hover:scale-110 transition-transform" />
            <span className="font-black text-xl sm:text-2xl tracking-tight text-brand-primary">
              CoderBhai
            </span>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1 hidden xs:block" />

          {/* Course Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setCourseDropdownOpen(!courseDropdownOpen);
              }}
              className="btn-3d flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-b-2 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-black transition-all cursor-pointer"
            >
              <span className="text-sm sm:text-base">{activeCourse.badge.split(' ')[0]}</span>
              <span className="font-extrabold max-w-[80px] sm:max-w-none truncate">{activeCourse.shortTitle}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>

            {/* Dropdown Menu */}
            {courseDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-pop">
                <div className="px-3 py-1.5 text-xs font-black uppercase text-slate-400">
                  Switch Track
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
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer mb-1 ${
                        isSelected
                          ? 'bg-brand-primary/15 text-brand-primary font-black dark:bg-brand-primary/20'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{c.badge.split(' ')[0]}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-black leading-tight">
                            {c.shortTitle}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            {completedCount} lessons completed
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      )}
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCourseDropdownOpen(false);
                      onOpenPlacement();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-brand-accent hover:bg-brand-accent/10 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Take Placement Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Gamification Stats Bar */}
        <div className="flex items-center gap-1.5 sm:gap-3 select-none shrink-0">
          {/* Daily Streak (🔥) */}
          <div
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-brand-orange font-black text-xs sm:text-sm"
            title={`${state.streak} Day Coding Streak`}
          >
            <Flame className="w-3.5 sm:w-5 h-3.5 sm:h-5 fill-brand-orange stroke-brand-orange animate-wiggle" />
            <span>{state.streak}</span>
          </div>

          {/* Hearts / Lives (❤️ max 5) */}
          <div className="relative" ref={heartRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setHeartDropdownOpen(!heartDropdownOpen);
              }}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-brand-rose font-black text-xs sm:text-sm cursor-pointer hover:brightness-95 transition-all"
              title="Hearts Remaining (Click to refill)"
            >
              <Heart
                className={`w-3.5 sm:w-5 h-3.5 sm:h-5 fill-brand-rose stroke-brand-rose ${
                  state.hearts <= 1 ? 'animate-bounce' : ''
                }`}
              />
              <span>{state.hearts}</span>
            </button>

            {/* Hearts Popover */}
            {heartDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-pop text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: state.maxHearts }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-6 h-6 ${
                        i < state.hearts
                          ? 'fill-brand-rose text-brand-rose'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                  {state.hearts} / {state.maxHearts} Hearts
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 mb-3">
                  Hearts protect you from compile mistakes. Practice to restore them anytime!
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHeartDropdownOpen(false);
                      onOpenPractice();
                    }}
                    className="btn-3d btn-3d-primary w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Practice to Refill (Free)
                  </button>

                  <button
                    type="button"
                    disabled={state.gems < 50 || state.hearts >= state.maxHearts}
                    onClick={() => {
                      refillHearts('gems');
                      setHeartDropdownOpen(false);
                    }}
                    className={`btn-3d w-full py-2 px-3 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 ${
                      state.gems >= 50 && state.hearts < state.maxHearts
                        ? 'btn-3d-blue'
                        : 'bg-slate-200 text-slate-400 border-b-2 border-slate-300 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-900 cursor-not-allowed'
                    }`}
                  >
                    <span>Refill Now (50 💎)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Gems (💎) - Desktop only */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-brand-accent font-black text-xs sm:text-sm"
            title={`${state.gems} Gems`}
          >
            <span>💎</span>
            <span>{state.gems}</span>
          </div>

          {/* XP (⚡) - Desktop only */}
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 font-black text-xs sm:text-sm"
            title={`${state.xp} Total XP`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{state.xp}</span>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1 hidden sm:block" />

          {/* Sound Toggle - Desktop */}
          <button
            type="button"
            onClick={toggleSound}
            className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={state.soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {state.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-brand-primary" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Dark Mode Toggle - Desktop */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={state.darkMode ? 'Light mode' : 'Dark mode'}
          >
            {state.darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Theme & Sound Customizer */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Customize Theme & Aesthetics"
          >
            <Palette className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-brand-secondary" />
          </button>

          {/* Mobile Overflow Menu */}
          <div className="relative sm:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-pop flex flex-col gap-1 text-left">
                <div className="px-3 py-1.5 text-[11px] font-black uppercase text-slate-400 flex items-center justify-between">
                  <span>Stats</span>
                  <span className="text-amber-500">⚡ {state.xp} XP</span>
                </div>
                <div className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span>💎 {state.gems} Gems</span>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    toggleDarkMode();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {state.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                  <span>{state.darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleSound();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {state.soundEnabled ? <Volume2 className="w-4 h-4 text-brand-primary" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span>{state.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Palette className="w-4 h-4 text-brand-secondary" />
                  <span>Theme & Sounds</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
