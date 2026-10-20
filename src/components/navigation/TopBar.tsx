import React, { useState, useRef, useEffect } from 'react';
import { CourseId, FriendProfile } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../data/translations';
import { sound } from '../../utils/audio';
import { CatFace } from '../common/CatFace';
import {
  Flame,
  Zap,
  Heart,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  Crown,
  User
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
  onOpenTraining?: () => void;
  onOpenSpeedTraining?: () => void;
  onInspectProfile?: (user: FriendProfile) => void;
}

export const TopBar: React.FC<Props> = ({
  onOpenPractice,
  onOpenPlacement,
  onOpenSettings,
  onOpenAuth,
  onInspectProfile,
}) => {
  const { state, setActiveCourse, toggleDarkMode, refillHearts } = useGame();
  const t = useTranslation(state.language);
  const isAdmin = state.role === 'admin' || state.authUser?.role === 'admin';
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [heartDropdownOpen, setHeartDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);

  const activeCourse = COURSES[state.activeCourseId] || COURSES.cpp;
  const currentProgress = state.courseProgress[state.activeCourseId];
  const completedCount = currentProgress?.completedNodeIds.length || 0;
  const courseLevel = Math.max(1, Math.floor(completedCount / 3) + 1);

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
    <header className="sticky top-0 z-30 bg-[#131F24] border-b border-[#263843] text-white transition-colors w-full select-none">
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: ByteSized Logo & Course Flag */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* ByteSized Brand Logo */}
          <div
            onClick={() => sound.playMeow()}
            className="flex items-center gap-1.5 sm:gap-2 select-none cursor-pointer group shrink-0"
            title="ByteSized - Click Byte to hear a meow!"
          >
            <CatFace size="sm" mood="happy" className="transform group-hover:scale-105 transition-transform shrink-0" />
            <span className="hidden sm:inline font-black text-base sm:text-lg tracking-tight text-white select-none shrink-0">
              Byte<span className="text-[#1CB0F6]">Sized</span>
            </span>
          </div>

          <div className="h-5 w-px bg-[#263843] mx-0.5 sm:mx-1 hidden sm:block" />

          {/* Course Flag / Badge Pill with Level */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setCourseDropdownOpen(!courseDropdownOpen);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-white text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs active:translate-y-0.5"
              title="Switch Language / Course"
              aria-label="Course Switcher"
            >
              <span className="text-sm sm:text-base">{activeCourse.badge.split(' ')[0]}</span>
              <span className="font-extrabold text-xs sm:text-sm text-slate-100">
                {courseLevel}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
            </button>

            {/* Backdrop for mobile */}
          {courseDropdownOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setCourseDropdownOpen(false)}
            />
          )}

          {/* Course Switcher Menu */}
          {courseDropdownOpen && (
            <div className="fixed sm:absolute top-16 sm:top-full left-3 sm:left-0 right-3 sm:right-auto mt-1 sm:mt-2 max-w-sm sm:w-64 mx-auto sm:mx-0 rounded-2xl bg-[#131F24] border border-[#263843] shadow-2xl p-2.5 z-50 animate-pop text-left">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.switchTrack}
              </div>
              {(Object.keys(COURSES) as CourseId[]).map(id => {
                const c = COURSES[id];
                const isSelected = id === state.activeCourseId;
                const progress = state.courseProgress[id];
                const cCompleted = progress?.completedNodeIds.length || 0;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleCourseSelect(id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer mb-1 ${
                      isSelected
                        ? 'bg-[#1CB0F6]/15 border border-[#1CB0F6]/40 text-[#1CB0F6] font-bold'
                        : 'hover:bg-[#18252D] text-slate-200 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{c.badge.split(' ')[0]}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight text-white">
                          {c.shortTitle}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          {cCompleted} {t.lessonsCompleted}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#1CB0F6]" />
                    )}
                  </button>
                );
              })}

              <div className="pt-2 mt-1 border-t border-[#263843]">
                <button
                  type="button"
                  onClick={() => {
                    setCourseDropdownOpen(false);
                    onOpenPlacement();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#1CB0F6] hover:bg-[#1CB0F6]/10 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Learning Plan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Center: Duolingo Core Gamification Stats (Flame, Gems, Hearts) */}
        <div className="flex items-center gap-2 sm:gap-6 font-extrabold text-xs sm:text-base shrink-0">
          {/* Daily Streak (🔥 274) */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 text-[#FF9600] cursor-default"
            title={`${state.streak} ${t.streakTitle}`}
          >
            <Flame className="w-4 sm:w-5 h-4 sm:h-5 fill-current text-[#FF9600]" />
            <span className="tracking-tight">{state.streak}</span>
          </div>

          {/* Blue Gems / Diamonds (💎 205) */}
          <div
            className="flex items-center gap-1.5 text-[#1CB0F6] cursor-default"
            title={isAdmin ? '👑 Admin Unlimited Diamonds' : `${state.gems} ${t.gems}`}
          >
            {/* Duolingo polygon blue gem icon */}
            <svg className="w-4.5 sm:w-5 h-4.5 sm:h-5" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,8.5 17,21 7,21 2,8.5" fill="#1CB0F6" stroke="#1899D6" strokeWidth="1.5" />
              <polygon points="12,2 7,8.5 12,17 17,8.5" fill="#44C4FF" opacity="0.6" />
            </svg>
            <span className="tracking-tight">{isAdmin ? '♾️' : state.gems}</span>
          </div>

          {/* Hearts / Lives (⚡ 25 or ❤️ 5) */}
          <div className="relative" ref={heartRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setHeartDropdownOpen(!heartDropdownOpen);
              }}
              className="flex items-center gap-1.5 text-[#FF4B4B] cursor-pointer hover:opacity-85 transition-opacity"
              title={
                isAdmin
                  ? '👑 Admin Privileges: Unlimited Hearts Forever'
                  : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                  ? 'Unlimited Hearts Active'
                  : `${t.heartsRemaining} (${t.refill})`
              }
              aria-label="Hearts / Lives"
            >
              {/* Pink battery/lightning or red heart matching screenshot */}
              <div className="flex items-center gap-1">
                <Heart className="w-4.5 sm:w-5 h-4.5 sm:h-5 fill-[#FF4B4B] text-[#FF4B4B]" />
                <span className="tracking-tight text-[#FF4B4B]">
                  {isAdmin || (state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil)
                    ? '♾️'
                    : state.hearts}
                </span>
              </div>
            </button>

            {/* Backdrop for mobile */}
            {heartDropdownOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                onClick={() => setHeartDropdownOpen(false)}
              />
            )}

            {/* Hearts Popover */}
            {heartDropdownOpen && (
              <div className="fixed sm:absolute top-16 sm:top-full left-3 sm:left-auto right-3 sm:right-0 mt-1 sm:mt-2 max-w-sm sm:w-64 mx-auto sm:mx-0 rounded-2xl bg-[#131F24] border border-[#263843] shadow-2xl p-4 z-50 animate-pop text-center">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  {state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
                    <div className="flex items-center gap-1.5 text-xl font-bold text-amber-400">
                      <span>💖</span>
                      <span>♾️</span>
                    </div>
                  ) : (
                    Array.from({ length: state.maxHearts }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 ${
                          i < state.hearts
                            ? 'fill-[#FF4B4B] text-[#FF4B4B]'
                            : 'text-[#263843]'
                        }`}
                      />
                    ))
                  )}
                </div>
                <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  {isAdmin ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Crown className="w-4 h-4 fill-current" />
                      Unlimited Hearts Forever!
                    </span>
                  ) : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 fill-current" />
                      Unlimited Hearts Active!
                    </span>
                  ) : (
                    `${state.hearts} / ${state.maxHearts} ${t.hearts}`
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  {isAdmin
                    ? 'As an Admin, your hearts never deplete.'
                    : state.unlimitedHeartsUntil && Date.now() < state.unlimitedHeartsUntil
                    ? 'Your student perk gives you infinite hearts!'
                    : t.heartsDesc}
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHeartDropdownOpen(false);
                      onOpenPractice();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#23B7FF] text-white flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.practiceToRefill}</span>
                  </button>

                  <button
                    type="button"
                    disabled={state.gems < 50 || state.hearts >= state.maxHearts}
                    onClick={() => {
                      refillHearts('gems');
                      setHeartDropdownOpen(false);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      state.gems >= 50 && state.hearts < state.maxHearts
                        ? 'bg-[#18252D] hover:bg-[#20313B] text-white cursor-pointer border border-[#263843]'
                        : 'bg-[#18252D]/50 text-slate-500 cursor-not-allowed border border-[#263843]/40'
                    }`}
                  >
                    <span>{t.refillNow} (50 💎)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: User Avatar / Sign In & Dark Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dark Mode Toggle - Visible on sm+ screens to preserve mobile header space for Sign In */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              toggleDarkMode();
            }}
            className="hidden sm:inline-flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#18252D] transition-colors cursor-pointer"
            title={state.darkMode ? t.lightMode : t.darkMode}
            aria-label="Toggle theme"
          >
            {state.darkMode ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-300" />
            )}
          </button>

          {/* Account / Sign In - Always visible on all mobile screens */}
          {onOpenAuth && (
            state.authUser ? (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onInspectProfile && state.authUser) {
                    onInspectProfile({
                      id: state.authUser.id,
                      username: state.authUser.username || state.authUser.displayName || 'me',
                      displayName: state.authUser.displayName || state.authUser.username || 'Learner',
                      avatarUrl: state.authUser.avatarUrl,
                      role: state.authUser.role,
                      activeStatus: state.activeStatus,
                      bio: state.authUser.bio,
                      streak: state.streak,
                      xp: state.xp,
                      isEduUser: state.authUser.isEduUser,
                    });
                  } else {
                    onOpenAuth('login');
                  }
                }}
                className="flex items-center gap-1.5 p-0.5 sm:p-1 rounded-full hover:ring-2 hover:ring-[#1CB0F6] transition-all cursor-pointer shrink-0"
                title={`Inspect Profile: @${state.authUser.username || state.authUser.displayName || 'me'}`}
              >
                <img
                  src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                  alt="Avatar"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-[#263843] object-cover"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('login');
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black text-white bg-[#1CB0F6] hover:bg-[#23B7FF] border-b-2 border-[#1899D6] active:translate-y-0.5 transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-xs"
              >
                <span>Sign In</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
