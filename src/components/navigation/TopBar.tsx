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
  Crown
} from 'lucide-react';

interface Props {
  onOpenPractice: () => void;
  onOpenPlacement: () => void;
  onOpenSettings: () => void;
  onOpenIdeaZone?: () => void;
  onOpenCodeZone?: () => void;
  onOpenAuth?: () => void;
}

export const TopBar: React.FC<Props> = ({
  onOpenPractice,
  onOpenPlacement,
  onOpenSettings,
  onOpenIdeaZone,
  onOpenCodeZone,
  onOpenAuth,
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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors w-full max-w-full">
      <div className="max-w-7xl w-full mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-4">
        {/* Left: Brand Mascot & Course Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Logo: Compact Cat Face on mobile, text on desktop */}
          <div
            onClick={() => sound.playMeow()}
            className="flex items-center gap-1.5 sm:gap-2 select-none cursor-pointer group"
            title="ByteSized - Click Byte to hear a meow!"
          >
            <CatFace size="sm" mood="happy" className="transform group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-black text-xl sm:text-2xl tracking-tight text-brand-primary">
              ByteSized
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
              className="btn-3d flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-b-2 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-black transition-all cursor-pointer"
            >
              <span className="text-sm sm:text-base">{activeCourse.badge.split(' ')[0]}</span>
              <span className="font-extrabold max-w-[55px] xs:max-w-[80px] sm:max-w-none truncate">{activeCourse.shortTitle}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
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
              <div className="fixed sm:absolute top-16 sm:top-full left-3 sm:left-0 right-3 sm:right-auto mt-1 sm:mt-2 max-w-sm sm:w-64 mx-auto sm:mx-0 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-pop text-left">
                <div className="px-3 py-1.5 text-xs font-black uppercase text-slate-400">
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
                            {completedCount} {t.lessonsCompleted}
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
                    {t.takePlacementTest}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick IdeaZone & CodeZone Launches */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-0.5 sm:ml-1">
            {onOpenIdeaZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenIdeaZone();
                }}
                className="btn-3d flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black transition-all cursor-pointer"
                title="IdeaZone - Notepad & Brainstorming Vault"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="hidden md:inline">{t.ideaZone || 'IdeaZone'}</span>
              </button>
            )}

            {onOpenCodeZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenCodeZone();
                }}
                className="btn-3d flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black transition-all cursor-pointer"
                title="CodeZone - Live Coding Environment"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden md:inline">{t.codeZone || 'CodeZone'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Gamification Stats Bar & Action Toggles */}
        <div className="flex items-center gap-1 sm:gap-2.5 select-none shrink-0">
          {/* Daily Streak (🔥) */}
          <div
            className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-brand-orange font-black text-xs sm:text-sm"
            title={`${state.streak} ${t.streakTitle}`}
          >
            <Flame className="w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 fill-brand-orange stroke-brand-orange animate-wiggle" />
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
              className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl ${
                isAdmin
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm'
                  : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                  ? 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 dark:bg-rose-500/20 text-brand-rose'
              } font-black text-xs sm:text-sm cursor-pointer hover:brightness-95 transition-all`}
              title={
                isAdmin
                  ? '👑 Admin Privileges: Unlimited Hearts Forever'
                  : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                  ? 'Unlimited Hearts Active (.EDU Student Perk)'
                  : `${t.heartsRemaining} (${t.refill})`
              }
            >
              <Heart
                className={`w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 ${
                  isAdmin || (state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil)
                    ? 'fill-amber-400 stroke-amber-400 animate-pulse'
                    : 'fill-brand-rose stroke-brand-rose'
                } ${state.hearts <= 1 && !isAdmin && !(state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil) ? 'animate-bounce' : ''}`}
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
              <div className="fixed sm:absolute top-16 sm:top-full left-3 sm:left-auto right-3 sm:right-0 mt-1 sm:mt-2 max-w-sm sm:w-64 mx-auto sm:mx-0 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-pop text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
                    <div className="flex items-center gap-1.5 text-2xl font-black text-amber-500 animate-bounceShort">
                      <span>💖</span>
                      <span>♾️</span>
                    </div>
                  ) : (
                    Array.from({ length: state.maxHearts }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          i < state.hearts
                            ? 'fill-brand-rose text-brand-rose'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))
                  )}
                </div>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
                  {isAdmin ? (
                    <span className="text-amber-400 font-extrabold flex items-center gap-1">
                      <Crown className="w-4 h-4 fill-current" />
                      Admin Unlimited Hearts Forever!
                    </span>
                  ) : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
                    <span className="text-amber-500 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 fill-current" />
                      Unlimited Hearts Active!
                    </span>
                  ) : (
                    `${state.hearts} / ${state.maxHearts} ${t.hearts}`
                  )}
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 mb-3">
                  {isAdmin
                    ? 'As an Admin, your hearts never deplete.'
                    : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                    ? 'Your .edu student perk gives you infinite hearts for 3 days!'
                    : t.heartsDesc}
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
                    {t.practiceToRefill}
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
                    <span>{t.refillNow}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Gems (💎) - Desktop only */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl ${
              isAdmin
                ? 'bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'bg-sky-500/10 dark:bg-sky-500/20 text-brand-accent'
            } font-black text-xs sm:text-sm`}
            title={isAdmin ? '👑 Admin Unlimited Diamonds' : `${state.gems} ${t.gems}`}
          >
            <span>💎</span>
            <span>{isAdmin ? '♾️ Unlimited' : state.gems}</span>
          </div>

          {/* XP (⚡) - Desktop only */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 font-black text-xs sm:text-sm"
            title={`${state.xp} ${t.totalXp}`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{state.xp}</span>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1 hidden xs:block" />

          {/* Language Switcher Pill: EN ⇄ বাং (1-tap instant switch) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl text-xs font-black bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary transition-all cursor-pointer border border-brand-primary/30"
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
            className="p-1 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={state.darkMode ? t.lightMode : t.darkMode}
          >
            {state.darkMode ? (
              <Sun className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {/* Theme & Sound Customizer - ALWAYS VISIBLE AND CLICKABLE ON ALL SCREENS */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-1 sm:p-2 rounded-xl text-brand-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.themesAndSounds}
          >
            <Palette className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-brand-secondary" />
          </button>

          {/* Sound Toggle - ALWAYS VISIBLE AND CLICKABLE ON ALL SCREENS */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={state.soundEnabled ? t.muteSound : t.enableSound}
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-brand-primary" />
            ) : (
              <VolumeX className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-slate-400" />
            )}
          </button>

          {/* Account / Sign In Button */}
          {onOpenAuth && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAuth();
              }}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                state.authUser
                  ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 shadow-sm'
                  : 'bg-gradient-to-r from-brand-primary via-cyan-600 to-brand-primary hover:brightness-110 text-white shadow-md'
              }`}
              title={
                state.authUser
                  ? `Account: ${state.authUser.displayName || state.authUser.email} (Cloud Synced)`
                  : 'Create account or Log In to save progress (.edu emails get 200 Diamonds free!)'
              }
            >
              {state.authUser ? (
                <>
                  <div className="relative">
                    <img
                      src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                      alt="Avatar"
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-slate-900 border border-brand-primary"
                    />
                    {state.authUser.isEduUser && (
                      <span className="absolute -top-1 -right-1 text-[8px]" title=".EDU Student Verified">🎓</span>
                    )}
                  </div>
                  <span className="hidden md:inline font-bold text-xs truncate max-w-[80px]">
                    {state.authUser.displayName || state.authUser.email.split('@')[0]}
                  </span>
                  {isAdmin ? (
                    <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-sm border border-amber-300">
                      👑 Admin
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
                      User
                    </span>
                  )}
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="font-extrabold text-[11px] sm:text-xs">Sign In</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
