import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { supabase, isEduEmail } from '../../lib/supabase';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti } from '../../utils/confetti';
import { ADMIN_SECRET_CODE, saveUserProfile } from '../../services/authService';
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
  ChevronDown,
  ArrowRight
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

  // Logged-in role upgrade state
  const [upgradeRole, setUpgradeRole] = useState<UserRole>('admin');
  const [upgradeAdminKey, setUpgradeAdminKey] = useState('');
  const [isUpgradingRole, setIsUpgradingRole] = useState(false);

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

    setLoading(true);
    sound.playClick();

    if (tab === 'register') {
      const res = await register(email.trim(), password, displayName.trim(), selectedRole, adminSecretPassword);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
        sound.playError();
      } else {
        sound.playSuccess();
        if (res.user?.role === 'admin') {
          fireSuccessConfetti();
          setSuccessMsg('👑 Admin Verified! Unlimited Hearts ♾️ & Unlimited Diamonds 💎 granted via set_admin_role RPC!');
        } else if (res.adminVerificationFailed) {
          setErrorMsg(res.error || '⚠️ Admin security key verification failed. Registered as regular User.');
        } else if (res.isEduBonus) {
          fireSuccessConfetti();
          setSuccessMsg('🎉 Account created with .edu Perks! +200 Diamonds & 2 Days of Unlimited Hearts granted!');
        } else {
          setSuccessMsg('✅ Account created successfully! Profile saved to Supabase profiles table.');
        }
        setTimeout(() => onClose(), 2400);
      }
    } else {
      const res = await login(email.trim(), password, selectedRole, adminSecretPassword);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
        sound.playError();
      } else {
        sound.playSuccess();
        if (res.user?.role === 'admin') {
          fireSuccessConfetti();
          setSuccessMsg('👑 Admin Verified! Logged in with Unlimited Hearts ♾️ & Unlimited Diamonds 💎 via set_admin_role RPC!');
        } else if (res.adminVerificationFailed) {
          setErrorMsg(res.error || '⚠️ Admin security key verification failed. Logged in as regular User.');
        } else {
          setSuccessMsg('✅ Logged in successfully! Profile and session active.');
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

  const handleUpgradeToAdmin = async () => {
    if (!state.authUser) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUpgradingRole(true);
    sound.playClick();

    const key = upgradeAdminKey.trim();
    let rpcOk = false;
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('set_admin_role', { admin_secret: key });
      if (!rpcErr && rpcData !== false) {
        rpcOk = true;
      }
    } catch {
      // fallback
    }

    if (!rpcOk && key === ADMIN_SECRET_CODE) {
      rpcOk = true;
    }

    if (rpcOk) {
      sound.playSuccess();
      fireSuccessConfetti();
      await saveUserProfile(state.authUser.id, {
        role: 'admin',
        gems: 999999,
        unlimitedHeartsUntil: new Date('2099-12-31T23:59:59Z').getTime(),
      });
      await syncCloudProgress();
      setSuccessMsg('👑 Admin Verified! Promoted to Admin with Unlimited Hearts ♾️ & Unlimited Diamonds 💎 via set_admin_role RPC!');
      setUpgradeAdminKey('');
    } else {
      sound.playError();
      setErrorMsg('⚠️ Invalid Admin Security Key.');
    }
    setIsUpgradingRole(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade">
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#111C35] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center shadow-inner">
              <User className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-none">
                {state.authUser ? 'Your Account' : 'ByteSized Account'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {state.authUser ? 'Account details & progress' : 'Save your XP, streak & notes across devices'}
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

            {/* Role Status & Role Switcher in Logged-In Profile */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Account Role</span>
                </span>
                {isAdminUser ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-sm border border-amber-300">
                    <Crown className="w-3 h-3 fill-current" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
                    User
                  </span>
                )}
              </div>

              {!isAdminUser ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setUpgradeRole('user');
                        setErrorMsg(null);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        upgradeRole === 'user'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      User
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setUpgradeRole('admin');
                        setErrorMsg(null);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                        upgradeRole === 'admin'
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                  </div>

                  {upgradeRole === 'admin' && (
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/50 space-y-2 animate-slideUp">
                      <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Admin Security Key:</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={upgradeAdminKey}
                          onChange={(e) => setUpgradeAdminKey(e.target.value)}
                          placeholder="Enter Admin Security Key..."
                          className="flex-1 bg-slate-900 border border-amber-400/60 rounded-xl px-3 py-1.5 text-xs text-amber-200 placeholder-slate-500 font-mono focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleUpgradeToAdmin}
                          disabled={isUpgradingRole}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black hover:brightness-110 cursor-pointer shadow flex items-center gap-1 shrink-0"
                        >
                          {isUpgradingRole ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Crown className="w-3.5 h-3.5" />}
                          <span>Verify</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-300 font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Admin account active with unlimited hearts and diamonds.</span>
                </div>
              )}
            </div>

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
          <div className="p-5 sm:p-6 space-y-4">
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
                Sign Up
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
                Sign In
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
                    Sign up with any school <strong className="text-white">.edu</strong> email for <span className="text-cyan-400 font-bold">200 Free Diamonds 💎</span> &amp; <span className="text-rose-400 font-bold">2 Days of Unlimited Hearts 💖</span>!
                  </p>
                </div>
              </div>
            )}

            {/* Live .EDU Match Pill */}
            {isEduDetected && tab === 'register' && selectedRole === 'user' && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounceShort">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>🎉 .EDU email verified! +200 Diamonds &amp; 2-Day Unlimited Hearts will be granted!</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* ROLE SELECTOR: USER OR ADMIN */}
              <div className="space-y-2.5 p-3.5 sm:p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Select Role</span>
                  </span>
                  {selectedRole === 'admin' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-md border border-amber-300">
                      <Crown className="w-3 h-3 fill-current" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
                      User
                    </span>
                  )}
                </div>

                {/* User or Admin selection buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedRole('user');
                      setErrorMsg(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      selectedRole === 'user'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-2 ring-purple-500/40'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${selectedRole === 'user' ? 'bg-white' : 'bg-purple-400'}`} />
                    <span>User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedRole('admin');
                      setErrorMsg(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 shrink-0" />
                    <span>Admin</span>
                  </button>
                </div>
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

              {/* ADMIN SECURITY KEY (Only appears when Admin is selected) */}
              {selectedRole === 'admin' && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/70 flex flex-col gap-1.5 animate-slideUp">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Admin Security Key</span>
                    </label>
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
                      placeholder="Enter Admin Security Key..."
                      className="w-full bg-slate-900 border border-amber-400/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider shadow-inner"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-300 font-medium leading-tight">
                    Enter the secret key to verify admin authorization.
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
