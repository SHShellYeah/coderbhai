import React from 'react';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../data/translations';
import { sound } from '../../utils/audio';
import {
  X,
  User,
  Compass,
  Lightbulb,
  Terminal,
  BookOpen,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Languages,
  Palette,
  LogOut,
  Zap,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onOpenPlacement: () => void;
  onOpenIdeaZone: () => void;
  onOpenCodeZone: () => void;
  onOpenQuestionBank: () => void;
  onOpenSettings: () => void;
  onOpenSpeedTraining?: (tab?: 'hub' | 'timed-training') => void;
  onOpenPractice?: () => void;
}

export const MoreDrawerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenPlacement,
  onOpenIdeaZone,
  onOpenCodeZone,
  onOpenQuestionBank,
  onOpenSettings,
  onOpenSpeedTraining,
  onOpenPractice,
}) => {
  const { state, toggleDarkMode, toggleLanguage, toggleSound, logout } = useGame();
  const t = useTranslation(state.language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-pop">
      <div
        className="w-full max-w-md bg-[#131F24] border border-[#263843] rounded-t-3xl sm:rounded-2xl p-5 text-white shadow-2xl overflow-y-auto max-h-[88vh]"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#263843] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#CE82FF] flex items-center justify-center text-white text-xs font-bold">
              ⋯
            </div>
            <h3 className="text-base font-extrabold tracking-tight">Features & Menu</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#18252D] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="mb-4 p-3.5 rounded-xl bg-[#18252D] border border-[#263843] flex items-center justify-between">
          {state.authUser ? (
            <div className="flex items-center gap-3">
              <img
                src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full bg-slate-900 border border-[#263843] object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm text-white">
                  {state.authUser.username ? `@${state.authUser.username}` : (state.authUser.displayName || state.authUser.email.split('@')[0])}
                </span>
                <span className="text-xs text-slate-400">
                  {state.role === 'admin' ? '👑 Admin' : 'Learner'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#263843] flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm text-white">Guest Learner</span>
                <span className="text-xs text-slate-400">Sign in to save your streak</span>
              </div>
            </div>
          )}

          {state.authUser ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                logout();
              }}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenAuth('login');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#1CB0F6] hover:bg-[#23B7FF] text-white font-black text-xs border-b-2 border-[#1899D6] active:translate-y-0.5 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              Sign In / Join
            </button>
          )}
        </div>

        {/* Speed Training Featured Hero Card */}
        {onOpenSpeedTraining && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenSpeedTraining('hub');
            }}
            className="w-full mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/10 border-2 border-amber-500/40 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center justify-between shadow-sm active:translate-y-0.5 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC800] text-amber-950 flex items-center justify-center font-black shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white">Speed Training</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    Timed PBs
                  </span>
                </div>
                <span className="text-xs text-amber-200/90 font-medium">
                  NeetCode 150 • Blind 75 • DSA Roadmaps
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 font-bold text-sm">
              →
            </div>
          </button>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Practice & Mistakes Refill */}
          {onOpenPractice && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenPractice();
              }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">Refill Hearts</span>
                <span className="text-[10px] text-slate-400">Review mistakes</span>
              </div>
            </button>
          )}

          {/* Byte's Learning Plan */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenPlacement();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-left transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white">Byte&apos;s Plan</span>
              <span className="text-[10px] text-slate-400">Custom course</span>
            </div>
          </button>

          {/* IdeaZone */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenIdeaZone();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-left transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white">IdeaZone</span>
              <span className="text-[10px] text-slate-400">Notes & ideas</span>
            </div>
          </button>

          {/* CodeZone */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenCodeZone();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-left transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white">CodeZone</span>
              <span className="text-[10px] text-slate-400">Live editor</span>
            </div>
          </button>

          {/* Question Bank */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenQuestionBank();
            }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-left transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white">Question Bank</span>
              <span className="text-[10px] text-slate-400">Browse problems</span>
            </div>
          </button>
        </div>

        {/* Quick Toggles */}
        <div className="pt-3 border-t border-[#263843] flex items-center justify-between gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              toggleLanguage();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-xs font-bold text-white cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-[#1CB0F6]" />
            <span>{state.language === 'en' ? 'বাং (বাংলা)' : 'EN (English)'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              toggleDarkMode();
            }}
            className="flex items-center justify-center p-2.5 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-amber-400 cursor-pointer"
            title="Toggle Dark Mode"
          >
            {state.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              toggleSound();
            }}
            className="flex items-center justify-center p-2.5 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-slate-300 cursor-pointer"
            title="Toggle Sound"
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-[#58CC02]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Settings */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenSettings();
            }}
            className="flex items-center justify-center p-2.5 rounded-xl bg-[#18252D] hover:bg-[#20313B] border border-[#263843] text-[#CE82FF] cursor-pointer"
            title="Themes & Sounds"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
