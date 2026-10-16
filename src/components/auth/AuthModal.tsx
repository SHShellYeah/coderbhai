import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { isEduEmail } from '../../lib/supabase';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti } from '../../utils/confetti';
import { ADMIN_SECRET_CODE } from '../../services/authService';
import { UserRole } from '../../types';
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
  Crown,
  KeyRound,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, initialTab = 'login', onClose }) => {
  const { state, login, register, logout, syncCloudProgress } = useGame();

  // Default to 'login' (Sign In) so users immediately see Sign In form
  const [tab, setTab] = useState<'register' | 'login'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [adminSecretPassword, setAdminSecretPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialTab]);

  const isEduDetected = useMemo(() => isEduEmail(email), [email]);

  if (!isOpen) return null;

  const isAdminUser = state.role === 'admin' || state.authUser?.role === 'admin';

  // Active Unlimited Hearts Time Left
  const formatHeartsTimeRemaining = (expiryTimestamp?: number | null) => {
    if (isAdminUser) return '♾️ Forever';
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
      setErrorMsg('Please enter both email and account password.');
      sound.playError();
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Account password must be at least 6 characters.');
      sound.playError();
      return;
    }

    // Role Verification Logic
    let finalRole: UserRole = 'user';
    let adminPassFailed = false;

    if (selectedRole === 'admin') {
      if (adminSecretPassword.trim() === ADMIN_SECRET_CODE) {
        finalRole = 'admin';
      } else {
        // Verification failed: Fall back to standard user role
        finalRole = 'user';
        adminPassFailed = true;
      }
    } else {
      finalRole = 'user';
    }

    setLoading(true);
    sound.playClick();

    if (tab === 'register') {
      const res = await register(email.trim(), password, displayName.trim(), finalRole);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
        sound.playError();
      } else {
        sound.playSuccess();
        if (finalRole === 'admin') {
          fireSuccessConfetti();
          setSuccessMsg('👑 Admin Verified! Granted Golden Nametag, Unlimited Hearts ♾️ & Unlimited Diamonds 💎!');
        } else if (adminPassFailed) {
          setSuccessMsg('⚠️ Admin secret password mismatch! You did not get Admin privileges and were registered as a regular User (Purple Nametag).');
        } else if (res.isEduBonus) {
          fireSuccessConfetti();
          setSuccessMsg('🎉 Account created with .edu Perks! +200 Diamonds & 3 Days of Unlimited Hearts granted!');
        } else {
          setSuccessMsg('✅ Account created successfully! Progress saved to Supabase cloud.');
        }
        setTimeout(() => onClose(), 2400);
      }
    } else {
      const res = await login(email.trim(), password, finalRole);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
        sound.playError();
      } else {
        sound.playSuccess();
        if (finalRole === 'admin') {
          fireSuccessConfetti();
          setSuccessMsg('👑 Admin Verified! Logged in with Golden Nametag, Unlimited Hearts ♾️ & Unlimited Diamonds 💎!');
        } else if (adminPassFailed) {
          setSuccessMsg('⚠️ Admin secret password mismatch! You did not get Admin privileges and were signed in as a regular User.');
        } else {
          setSuccessMsg('✅ Logged in successfully! Cloud progress synced.');
        }
        setTimeout(() => onClose(), 2000);
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
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#111C35] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center shadow-inner">
              <Cloud className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-none">
                {state.authUser ? 'Your Account & Cloud Profile' : 'ByteSized Cloud Account'}
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
              <div className="relative shrink-0">
                <img
                  src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                  alt="Avatar"
                  className={`w-13 h-13 rounded-2xl bg-slate-900 border-2 shadow-md ${
                    isAdminUser ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-purple-500'
                  }`}
                />
                {isAdminUser && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-amber-400 text-slate-950 p-0.5 rounded-full shadow">
                    👑
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                    {state.authUser.displayName || 'Learner'}
                  </h4>

                  {/* Golden or Purple Nametag */}
                  {isAdminUser ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-md border border-amber-300">
                      <Crown className="w-3 h-3 fill-current" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
                      User
                    </span>
                  )}

                  {state.authUser.isEduUser && !isAdminUser && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                      <GraduationCap className="w-3 h-3" />
                      .EDU
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                  {state.authUser.email}
                </p>
              </div>
            </div>

            {/* Perks & Stats Badge Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Diamond Perks */}
              <div className={`p-3 rounded-2xl flex items-center gap-2.5 ${
                isAdminUser
                  ? 'bg-amber-500/10 border-2 border-amber-500/30'
                  : 'bg-cyan-500/10 border border-cyan-500/20'
              }`}>
                <div className={`p-2 rounded-xl ${
                  isAdminUser ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  <Gem className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className={`text-[10px] font-black uppercase ${isAdminUser ? 'text-amber-400' : 'text-cyan-500'}`}>
                    Diamonds
                  </div>
                  <div className="text-base font-black font-mono">
                    {isAdminUser ? '♾️ Unlimited' : `${state.gems} 💎`}
                  </div>
                </div>
              </div>

              {/* Heart Status */}
              <div className={`p-3 rounded-2xl flex items-center gap-2.5 ${
                isAdminUser
                  ? 'bg-amber-500/10 border-2 border-amber-500/30'
                  : 'bg-rose-500/10 border border-rose-500/20'
              }`}>
                <div className={`p-2 rounded-xl ${
                  isAdminUser ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className={`text-[10px] font-black uppercase ${isAdminUser ? 'text-amber-400' : 'text-rose-500'}`}>
                    Hearts
                  </div>
                  <div className="text-sm font-black flex items-center gap-1">
                    {isAdminUser ? (
                      <span className="text-emerald-400 font-extrabold text-xs">
                        ♾️ Unlimited Forever
                      </span>
                    ) : heartsTimeLeft ? (
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

            {/* Special Role / Privilege Banner */}
            {isAdminUser ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border-2 border-amber-400/50 flex items-center gap-3 shadow-md animate-slideUp">
                <Crown className="w-7 h-7 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-black text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                    <span>👑 Super Admin Tier</span>
                    <span className="px-1.5 py-0.2 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[9px] rounded-full">GOLD ACTIVE</span>
                  </div>
                  <div className="text-slate-200 font-medium text-[11px] mt-0.5">
                    Permanent Unlimited Hearts &amp; Unlimited Diamonds activated.
                  </div>
                </div>
              </div>
            ) : state.authUser.isEduUser ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div className="text-xs">
                  <div className="font-black text-amber-500 uppercase tracking-wide">
                    Active Student Privileges
                  </div>
                  <div className="text-slate-300 font-medium text-[11px]">
                    200 Free Diamonds &amp; Unlimited Hearts activated via .edu email.
                  </div>
                </div>
              </div>
            ) : null}

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
                <span>Sign Out of ByteSized</span>
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION / LOGIN FORM */
          <div className="p-5 sm:p-6 space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/80">
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
                Sign In
              </button>
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
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-shake">
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

            {/* Student Special Perk Banner for standard user on Register */}
            {tab === 'register' && selectedRole === 'user' && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-start gap-3 shadow-inner animate-slideUp">
                <span className="text-xl shrink-0 mt-0.5">🎓</span>
                <div>
                  <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Student .EDU Bonus
                  </div>
                  <p className="text-[11px] font-semibold text-slate-300 mt-0.5 leading-relaxed">
                    Sign up with any school <strong className="text-white">.edu</strong> email for <span className="text-cyan-400 font-bold">200 Free Diamonds 💎</span> &amp; <span className="text-rose-400 font-bold">3 Days of Unlimited Hearts 💖</span>!
                  </p>
                </div>
              </div>
            )}

            {/* Live .EDU Match Pill */}
            {isEduDetected && tab === 'register' && selectedRole === 'user' && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounceShort">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>🎉 .EDU email verified! +200 Diamonds &amp; 3-Day Unlimited Hearts will be granted!</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 1. ROLE SELECT DROPDOWN MENU (AT THE TOP OF THE FORM) */}
              <div className="space-y-1.5 p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <label htmlFor="role-select" className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>Role Select Drop Down Menu</span>
                  </label>
                  {/* Live Nametag Indicator */}
                  {selectedRole === 'admin' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-md border border-amber-300 animate-pulse">
                      <Crown className="w-3 h-3 fill-current" />
                      Admin (Golden Nametag)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/25 text-purple-400 dark:text-purple-300 border border-purple-500/40">
                      💜 User (Purple Nametag)
                    </span>
                  )}
                </div>

                <div className="relative mt-1">
                  <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => {
                      sound.playClick();
                      setSelectedRole(e.target.value as UserRole);
                      setErrorMsg(null);
                    }}
                    className={`w-full appearance-none rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-black transition-all cursor-pointer border-2 ${
                      selectedRole === 'admin'
                        ? 'bg-amber-500/15 border-amber-400 text-amber-300 focus:ring-2 focus:ring-amber-400'
                        : 'bg-white dark:bg-slate-800 border-purple-500/60 text-purple-500 dark:text-purple-300 focus:ring-2 focus:ring-purple-500'
                    } focus:outline-none`}
                  >
                    <option value="user" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold py-2">
                      💜 User (Standard Learner - Purple Nametag)
                    </option>
                    <option value="admin" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 font-bold py-2">
                      👑 Admin (Special Privileges - Golden Nametag)
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                {selectedRole === 'admin' ? (
                  <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center gap-2 text-[11px] text-amber-300 font-medium">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      <strong>Admin perks:</strong> Unlimited Hearts ♾️ &amp; Diamonds 💎. Type passcode in the verification bar below.
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2 text-[11px] text-purple-400 dark:text-purple-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>
                      <strong>User role:</strong> Standard learner with normal hearts &amp; diamonds.
                    </span>
                  </div>
                )}
              </div>

              {/* 2. DISPLAY NAME (ONLY ON CREATE ACCOUNT TAB) */}
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
                      placeholder={selectedRole === 'admin' ? 'e.g. Master Admin' : 'e.g. ByteSized'}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              )}

              {/* 3. EMAIL ADDRESS */}
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
                    placeholder={tab === 'register' && selectedRole === 'user' ? 'student@university.edu (or any email)' : 'you@example.com'}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* 4. PASSWORD BAR 1: ACCOUNT PASSWORD (User can give random password to save password) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    {tab === 'register' ? 'Account Password' : 'Password'}
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {selectedRole === 'user' ? 'Save any password' : 'Your login credentials'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter account password (at least 6 characters)"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* 5. PASSWORD BAR 2: ADMIN VERIFICATION PASSWORD (Shown dynamically when Admin is selected) */}
              {selectedRole === 'admin' && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/80 flex flex-col gap-1.5 animate-slideUp">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Admin Secret Verification Password</span>
                    </label>
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-400/30">
                      @dm1n.D1u
                    </span>
                  </div>

                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={adminSecretPassword}
                      onChange={e => {
                        setAdminSecretPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder="Type @dm1n.D1u to verify Admin role..."
                      className="w-full bg-slate-900 border border-amber-400/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider shadow-inner"
                    />
                  </div>

                  <p className="text-[10px] text-slate-300 font-medium leading-tight">
                    Type <code className="bg-amber-400/20 text-amber-300 font-mono px-1 rounded font-bold">@dm1n.D1u</code> to verify. If correct, you will be given the <strong>Golden Admin</strong> role and unlimited facilities. If you fail, you will not get those privileges and will proceed as a regular <strong>User</strong>.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`btn-3d w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2 ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-b-2 border-amber-600 shadow-amber-500/20'
                    : 'btn-3d-primary'
                }`}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : tab === 'register' ? (
                  <span>
                    {selectedRole === 'admin'
                      ? '👑 Verify & Create Admin Account'
                      : 'Create Account & Save Progress'}
                  </span>
                ) : (
                  <span>
                    {selectedRole === 'admin'
                      ? '👑 Verify & Sign In as Admin'
                      : 'Sign In to ByteSized'}
                  </span>
                )}
              </button>
            </form>

            <div className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              {tab === 'register' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTab('login');
                    }}
                    className="text-brand-primary font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTab('register');
                    }}
                    className="text-brand-primary font-bold hover:underline cursor-pointer"
                  >
                    Create Account
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
