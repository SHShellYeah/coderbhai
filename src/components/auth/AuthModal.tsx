import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { isEduEmail } from '../../lib/supabase';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti } from '../../utils/confetti';
import { CatFace } from '../common/CatFace';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  Heart,
  Gem,
  CheckCircle2,
  AlertCircle,
  Cloud,
  LogOut,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state, login, register, logout, syncCloudProgress } = useGame();

  const [tab, setTab] = useState<'register' | 'login'>(
    state.authUser ? 'login' : 'register'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const isEduDetected = useMemo(() => isEduEmail(email), [email]);

  if (!isOpen) return null;

  // Active Unlimited Hearts Time Left
  const formatHeartsTimeRemaining = (expiryTimestamp?: number | null) => {
    if (!expiryTimestamp) return null;
    const diff = expiryTimestamp - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h remaining`;
  };

  const heartsTimeLeft = formatHeartsTimeRemaining(state.unlimitedHeartsUntil);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      sound.playError();
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      sound.playError();
      return;
    }

    setLoading(true);
    sound.playClick();

    if (tab === 'register') {
      const res = await register(email.trim(), password, displayName.trim());
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
        sound.playError();
      } else {
        sound.playSuccess();
        fireSuccessConfetti();
        if (res.isEduBonus) {
          setSuccessMsg('🎉 Account created with .edu Perks! +200 Diamonds & 3 Days of Unlimited Hearts granted!');
        } else {
          setSuccessMsg('✅ Account created successfully! Progress saved to Supabase cloud.');
        }
        setTimeout(() => onClose(), 2200);
      }
    } else {
      const res = await login(email.trim(), password);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
        sound.playError();
      } else {
        sound.playSuccess();
        setSuccessMsg('✅ Logged in successfully! Cloud progress synced.');
        setTimeout(() => onClose(), 1200);
      }
    }
  };

  const handleSyncNow = async () => {
    sound.playClick();
    setIsSyncing(true);
    await syncCloudProgress();
    setTimeout(() => {
      setIsSyncing(false);
      sound.playSuccess();
      setSuccessMsg('Cloud sync complete!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 600);
  };

  const handleLogout = async () => {
    sound.playClick();
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade">
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 relative">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#111C35]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center shadow-inner">
              <Cloud className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-none">
                {state.authUser ? 'Your Account & Cloud Profile' : 'CoderBhai Cloud Account'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {state.authUser ? 'Synced with Supabase Cloud' : 'Save your XP, streak & notes across devices'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGGED-IN VIEW */}
        {state.authUser ? (
          <div className="p-5 sm:p-6 space-y-4">
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3.5">
              <img
                src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                alt="Avatar"
                className="w-13 h-13 rounded-2xl bg-slate-900 border-2 border-brand-primary shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                    {state.authUser.displayName || 'Coder'}
                  </h4>
                  {state.authUser.isEduUser && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                      <GraduationCap className="w-3 h-3" />
                      .EDU Student
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                  {state.authUser.email}
                </p>
              </div>
            </div>

            {/* Perks & Stats Badge Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Diamond Perks */}
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Gem className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-cyan-500">Diamonds</div>
                  <div className="text-base font-black font-mono">{state.gems} 💎</div>
                </div>
              </div>

              {/* Heart Status */}
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-rose-500">Hearts</div>
                  <div className="text-sm font-black flex items-center gap-1">
                    {heartsTimeLeft ? (
                      <span className="text-emerald-400 font-bold text-xs">
                        ♾️ Unlimited ({heartsTimeLeft})
                      </span>
                    ) : (
                      <span>{state.hearts} / {state.maxHearts}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Perks Status */}
            {state.authUser.isEduUser && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div className="text-xs">
                  <div className="font-black text-amber-500 uppercase tracking-wide">
                    Active Student Privileges
                  </div>
                  <div className="text-slate-300 font-medium text-[11px]">
                    200 Free Diamonds & Unlimited Hearts activated via .edu email.
                  </div>
                </div>
              </div>
            )}

            {/* Cloud Sync Status */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="btn-3d btn-3d-green w-full py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing with Supabase...' : 'Sync Cloud Progress Now'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-xs font-black text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of CoderBhai</span>
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION / LOGIN FORM */
          <div className="p-5 sm:p-6 space-y-4">
            {/* Student Special Perk Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-start gap-3 shadow-inner animate-slideUp">
              <span className="text-2xl shrink-0 mt-0.5">🎓</span>
              <div>
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Student .EDU Special Bonus
                </div>
                <p className="text-[11px] font-semibold text-slate-300 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Sign up with any school/college <strong className="text-white">.edu</strong> email to instantly receive <span className="text-cyan-400 font-bold">200 Free Diamonds 💎</span> and <span className="text-rose-400 font-bold">3 Days of Unlimited Hearts 💖</span>!
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTab('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTab('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Log In
              </button>
            </div>

            {/* Live .EDU Match Pill */}
            {isEduDetected && tab === 'register' && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounceShort">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>🎉 .EDU email verified! 200 Diamonds & 3-Day Unlimited Hearts will be granted!</span>
              </div>
            )}

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Display Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. CoderBhai"
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={tab === 'register' ? 'student@university.edu (or standard email)' : 'you@example.com'}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-3d btn-3d-primary w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : tab === 'register' ? (
                  <span>Create Account & Save Progress</span>
                ) : (
                  <span>Log In to CoderBhai</span>
                )}
              </button>
            </form>

            <div className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              {tab === 'register' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Log In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Sign Up with .EDU perks
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
