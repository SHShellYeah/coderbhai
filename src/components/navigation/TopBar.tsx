import React, { useState, useRef, useEffect } from 'react';
import { CourseId } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
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
  Palette
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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCourseSelect = (id: CourseId) => {
    setActiveCourse(id);
    setCourseDropdownOpen(false);

    // If course not yet onboarded, trigger placement or start
    if (!state.courseProgress[id]?.placementTaken) {
      onOpenPlacement();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#131F24]/95 backdrop-blur border-b-2 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Course Switcher */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 select-none cursor-pointer group">
            <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110 group-active:scale-95 duration-150">
              🦉
            </span>
            <span className="hidden md:inline font-black text-2xl tracking-tighter text-brand-green dark:text-brand-green-light">
              CodeLingo
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* Course Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setCourseDropdownOpen(!courseDropdownOpen);
              }}
              className="btn-3d flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-b-2 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-black transition-all cursor-pointer"
            >
              <span className="text-base">{activeCourse.badge.split(' ')[0]}</span>
              <span className="font-extrabold">{activeCourse.shortTitle}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>

            {/* Dropdown Menu */}
            {courseDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-pop">
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
                          ? 'bg-brand-green/15 text-brand-green font-black dark:bg-brand-green/20'
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
                        <span className="w-2 h-2 rounded-full bg-brand-green" />
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
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-brand-blue hover:bg-brand-blue/10 transition-colors"
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
        <div className="flex items-center gap-2 sm:gap-4 select-none">
          {/* Daily Streak (🔥) */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-brand-orange font-black text-xs sm:text-sm"
            title={`${state.streak} Day Coding Streak`}
          >
            <Flame className="w-4 sm:w-5 h-4 sm:h-5 fill-brand-orange stroke-brand-orange animate-wiggle" />
            <span>{state.streak}</span>
          </div>

          {/* Gems (💎) */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-brand-blue font-black text-xs sm:text-sm"
            title={`${state.gems} Gems`}
          >
            <span className="text-sm sm:text-base">💎</span>
            <span>{state.gems}</span>
          </div>

          {/* XP (⚡) */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 font-black text-xs sm:text-sm"
            title={`${state.xp} Total XP`}
          >
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
            <span>{state.xp}</span>
          </div>

          {/* Hearts / Lives (❤️ max 5) */}
          <div className="relative" ref={heartRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setHeartDropdownOpen(!heartDropdownOpen);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-brand-rose font-black text-xs sm:text-sm cursor-pointer hover:brightness-95 transition-all"
              title="Hearts Remaining (Click to refill)"
            >
              <Heart
                className={`w-4 sm:w-5 h-4 sm:h-5 fill-brand-rose stroke-brand-rose ${
                  state.hearts <= 1 ? 'animate-bounce' : ''
                }`}
              />
              <span>{state.hearts}</span>
            </button>

            {/* Hearts Popover */}
            {heartDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-pop text-center">
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
                  Hearts protect you when you make coding mistakes in lessons.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHeartDropdownOpen(false);
                      onOpenPractice();
                    }}
                    className="btn-3d btn-3d-green w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5"
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

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={state.soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {state.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-brand-green" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
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
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Customize Theme & Sounds"
          >
            <Palette className="w-5 h-5 text-brand-purple" />
          </button>
        </div>
      </div>
    </header>
  );
};
