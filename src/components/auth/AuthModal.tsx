import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { supabase, isEduEmail } from '../../lib/supabase';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti } from '../../utils/confetti';
import { ADMIN_SECRET_CODE, saveUserProfile } from '../../services/authService';
import { UserRole, UserActiveStatus } from '../../types';
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
  ArrowRight,
  Edit3,
  Camera,
  Check,
  MessageSquare,
  FileText,
  Radio,
  ArrowLeft
} from 'lucide-react';

const AVATAR_PRESETS = [
  { name: 'Byte Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteBot' },
  { name: 'Ada Cyber', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdaLovelace' },
  { name: 'Pixel Cat', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PixelCat' },
  { name: 'Cyber Raven', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberHacker' },
  { name: 'Turing Matrix', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlanTuring' },
  { name: 'Robo Guru', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoboGuru' },
  { name: 'Neon Coder', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonCoder' },
  { name: 'Algorist', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Algorist' },
];

const STATUS_CONFIG: Record<UserActiveStatus, { label: string; dot: string; bg: string; text: string; desc: string }> = {
  online: { label: 'Online', dot: 'bg-emerald-500 shadow-emerald-500/50', bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-500', desc: 'Ready to pair program & learn' },
  away: { label: 'Away', dot: 'bg-amber-400 shadow-amber-400/50', bg: 'bg-amber-400/15 border-amber-400/30', text: 'text-amber-500', desc: 'Stepped away from keyboard' },
  busy: { label: 'Busy (DND)', dot: 'bg-rose-500 shadow-rose-500/50', bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-500', desc: 'Deep in coding flow' },
  offline: { label: 'Invisible', dot: 'bg-slate-400 shadow-slate-400/50', bg: 'bg-slate-500/15 border-slate-500/30', text: 'text-slate-400', desc: 'Appear offline to peers' },
};

interface Props {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onOpenMessaging?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, initialTab = 'login', onClose, onOpenMessaging }) => {
  const { state, login, register, logout, syncCloudProgress, updateProfile } = useGame();

  // Default to 'login' (Sign In) so users immediately see Sign In form
  const [tab, setTab] = useState<'register' | 'login'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [adminSecretPassword, setAdminSecretPassword] = useState('');

  // Logged-in profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editActiveStatus, setEditActiveStatus] = useState<UserActiveStatus>('online');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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
      setIsEditingProfile(false);
      if (state.authUser) {
        setEditDisplayName(state.authUser.displayName || '');
        setEditBio(state.bio || state.authUser.bio || '');
        setEditAvatarUrl(state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`);
        setEditActiveStatus(state.activeStatus || state.authUser.activeStatus || 'online');
      }
    }
  }, [isOpen, initialTab, state.authUser, state.bio, state.activeStatus]);

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

  const handleSaveProfile = async () => {
    if (!state.authUser) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSavingProfile(true);
    sound.playClick();

    const res = await updateProfile({
      displayName: editDisplayName.trim() || undefined,
      bio: editBio.trim(),
      avatarUrl: editAvatarUrl.trim() || undefined,
      activeStatus: editActiveStatus,
    });

    setIsSavingProfile(false);
    if (!res.success) {
      sound.playError();
      setErrorMsg(res.error || 'Failed to update profile.');
    } else {
      sound.playSuccess();
      fireSuccessConfetti();
      setSuccessMsg('🎉 Profile & Bio updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const currentStatusConfig = STATUS_CONFIG[state.activeStatus || 'online'] || STATUS_CONFIG.online;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade">
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#111C35] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            {isEditingProfile ? (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsEditingProfile(false);
                  setErrorMsg(null);
                }}
                className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Back to profile"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center shadow-inner">
                <User className="w-5 h-5 stroke-[2.5]" />
              </div>
            )}
            <div>
              <h3 className="text-base font-black tracking-tight leading-none">
                {state.authUser
                  ? (isEditingProfile ? 'Edit Profile' : 'Your Account')
                  : 'ByteSized Account'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {state.authUser
                  ? (isEditingProfile ? 'Customize avatar, bio & active status' : 'Account details & progress')
                  : 'Save your XP, streak & notes across devices'}
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
          isEditingProfile ? (
            /* EDIT PROFILE FORM */
            <div className="p-5 sm:p-6 space-y-4 animate-fade">
              {/* Avatar Selector Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-purple-400" />
                    <span>Choose Profile Picture</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">8 Presets + Custom URL</span>
                </label>

                {/* Avatar Preview */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="relative shrink-0">
                    <img
                      src={editAvatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-purple-500 shadow-md object-cover"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${STATUS_CONFIG[editActiveStatus]?.dot || 'bg-emerald-500'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {editDisplayName.trim() || 'Learner'}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      Previewing with status: <span className="font-bold text-purple-400">{STATUS_CONFIG[editActiveStatus]?.label}</span>
                    </div>
                  </div>
                </div>

                {/* Avatar Presets Grid */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = editAvatarUrl === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setEditAvatarUrl(preset.url);
                        }}
                        className={`p-1.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/15 shadow-md scale-105'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-8 h-8 rounded-lg bg-slate-800" />
                        <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-full">
                          {preset.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Avatar URL input */}
                <div className="pt-1">
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="Or paste custom image URL (https://...)"
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Display Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Display Name</span>
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="e.g. CodeNinja, ByteWizard"
                  maxLength={30}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Active Status Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Status</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(STATUS_CONFIG) as UserActiveStatus[]).map((st) => {
                    const cfg = STATUS_CONFIG[st];
                    const isSelected = editActiveStatus === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setEditActiveStatus(st);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? `${cfg.bg} border-2 shadow-sm font-black`
                            : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full mt-0.5 shrink-0 ${cfg.dot}`} />
                        <div className="min-w-0">
                          <div className={`text-xs font-bold ${isSelected ? cfg.text : 'text-slate-800 dark:text-slate-200'}`}>
                            {cfg.label}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium leading-tight">
                            {cfg.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Developer Bio</span>
                  </label>
                  <span className={`text-[10px] font-bold ${editBio.length > 150 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {editBio.length} / 160
                  </span>
                </div>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 160))}
                  placeholder="Share a short bio, learning goals, or your favorite language (e.g. DSA explorer, C++ lover, building daily!)..."
                  rows={3}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-primary leading-relaxed resize-none"
                />
              </div>

              {/* Error and Success alerts */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Save & Cancel Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsEditingProfile(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="flex-2 btn-3d btn-3d-green py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL PROFILE VIEW */
            <div className="p-5 sm:p-6 space-y-4">
              {/* User Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={state.authUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser.id}`}
                    alt="Avatar"
                    className={`w-14 h-14 rounded-2xl bg-slate-900 border-2 shadow-md object-cover ${
                      isAdminUser ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-purple-500'
                    }`}
                  />
                  {/* Active Status Badge Dot */}
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 ${currentStatusConfig.dot}`}
                    title={`Status: ${currentStatusConfig.label}`}
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

                  {/* Active Status Pill */}
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentStatusConfig.bg} ${currentStatusConfig.text}`}>
                      <span className={`w-2 h-2 rounded-full ${currentStatusConfig.dot}`} />
                      <span>{currentStatusConfig.label}</span>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setIsEditingProfile(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Bio</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsEditingProfile(true);
                    }}
                    className="text-[10px] text-purple-500 dark:text-purple-400 hover:underline font-bold cursor-pointer"
                  >
                    {state.bio ? 'Edit' : '+ Add Bio'}
                  </button>
                </div>
                {state.bio ? (
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                    &ldquo;{state.bio}&rdquo;
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No bio added yet. Click &ldquo;Edit Profile&rdquo; to introduce yourself to peers!
                  </p>
                )}
              </div>

              {/* In-App Messaging Quick Launcher */}
              {onOpenMessaging && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onOpenMessaging();
                  }}
                  className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 border border-indigo-500/30 hover:border-indigo-500/60 transition-all flex items-center justify-between cursor-pointer group shadow-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>ByteSized Community Chat</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        Chat with learners, share DSA snippets &amp; ask questions
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

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
        )
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
