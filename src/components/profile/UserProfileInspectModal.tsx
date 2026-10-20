import React, { useState, useEffect } from 'react';
import { FriendProfile, UserActiveStatus, UserRole } from '../../types';
import { sound } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import {
  fetchUserProfileById,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
} from '../../services/authService';
import {
  X,
  Flame,
  Zap,
  Crown,
  User as UserIcon,
  GraduationCap,
  MessageSquare,
  UserPlus,
  UserCheck,
  UserMinus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  user: FriendProfile | null;
  onClose: () => void;
  onStartDM?: (user: FriendProfile) => void;
  onFriendStatusChange?: () => void;
}

const STATUS_DOT: Record<UserActiveStatus, string> = {
  online: 'bg-emerald-500 shadow-emerald-500/50',
  away: 'bg-amber-400 shadow-amber-400/50',
  busy: 'bg-rose-500 shadow-rose-500/50',
  offline: 'bg-slate-400 shadow-slate-400/50',
};

const STATUS_TEXT: Record<UserActiveStatus, string> = {
  online: 'Online Now',
  away: 'Away',
  busy: 'In Deep Focus',
  offline: 'Offline',
};

export const UserProfileInspectModal: React.FC<Props> = ({
  isOpen,
  user,
  onClose,
  onStartDM,
  onFriendStatusChange,
}) => {
  const { state } = useGame();
  const [profile, setProfile] = useState<FriendProfile | null>(user);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setProfile(user);
    if (user?.id) {
      // Refresh profile data from database to get latest streak, bio, role, etc.
      fetchUserProfileById(user.id).then((fresh) => {
        if (fresh) {
          setProfile((prev) => ({
            ...fresh,
            isFriend: prev?.isFriend ?? fresh.isFriend,
            friendshipStatus: prev?.friendshipStatus ?? fresh.friendshipStatus,
          }));
        }
      });
    }
  }, [user]);

  if (!isOpen || !profile) return null;

  const isMe = state.authUser?.id === profile.id;
  const isAdmin = profile.role === 'admin';
  const currentStatus: UserActiveStatus = profile.activeStatus || 'online';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendRequest = async () => {
    if (!state.authUser?.id) return;
    sound.playClick();
    setActionLoading(true);
    const res = await sendFriendRequest(state.authUser.id, profile.id);
    setActionLoading(false);
    if (res.success) {
      if (res.status === 'accepted') {
        sound.playSuccess();
        setProfile((prev) => prev ? { ...prev, isFriend: true, friendshipStatus: 'accepted' } : null);
        showToast(`🎉 You and @${profile.username} are now friends!`);
      } else {
        sound.playClick();
        setProfile((prev) => prev ? { ...prev, friendshipStatus: 'pending_sent' } : null);
        showToast(`Friend request sent to @${profile.username}!`);
      }
      onFriendStatusChange?.();
    }
  };

  const handleAcceptRequest = async () => {
    if (!state.authUser?.id) return;
    sound.playSuccess();
    setActionLoading(true);
    const res = await acceptFriendRequest(profile.id, state.authUser.id);
    setActionLoading(false);
    if (res.success) {
      setProfile((prev) => prev ? { ...prev, isFriend: true, friendshipStatus: 'accepted' } : null);
      showToast(`🎉 Accepted @${profile.username}'s friend request!`);
      onFriendStatusChange?.();
    }
  };

  const handleDeleteRequest = async () => {
    if (!state.authUser?.id) return;
    sound.playClick();
    setActionLoading(true);
    const res = await rejectFriendRequest(profile.id, state.authUser.id);
    setActionLoading(false);
    if (res.success) {
      setProfile((prev) => prev ? { ...prev, friendshipStatus: 'none' } : null);
      showToast(`Removed friend request.`);
      onFriendStatusChange?.();
    }
  };

  const handleRemoveFriend = async () => {
    if (!state.authUser?.id) return;
    sound.playClick();
    setActionLoading(true);
    const res = await removeFriend(state.authUser.id, profile.id);
    setActionLoading(false);
    if (res.success) {
      setProfile((prev) => prev ? { ...prev, isFriend: false, friendshipStatus: 'none' } : null);
      showToast(`Removed @${profile.username} from friends.`);
      onFriendStatusChange?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
      <div className="w-full max-w-md bg-white dark:bg-[#0E1526] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 relative animate-pop">
        
        {/* Banner Background */}
        <div className={`h-28 w-full relative ${
          isAdmin
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500'
        }`}>
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-2xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all cursor-pointer shadow-sm active:scale-95"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Profile Info Container */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col">
          
          {/* Avatar with Status Ring */}
          <div className="relative -mt-14 mb-3 self-start flex items-end">
            <div className="relative">
              <img
                src={profile.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.id}`}
                alt={profile.displayName}
                className={`w-24 h-24 rounded-3xl bg-slate-900 border-4 border-white dark:border-[#0E1526] shadow-xl object-cover ring-2 ${
                  isAdmin ? 'ring-amber-400' : 'ring-indigo-500/40'
                }`}
              />
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-4 ring-white dark:ring-[#0E1526] ${
                  STATUS_DOT[currentStatus]
                }`}
                title={STATUS_TEXT[currentStatus]}
              />
            </div>

            {/* Admin or User Badge on Right */}
            <div className="ml-3 mb-1 flex flex-col gap-1">
              {isAdmin ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md border border-amber-300">
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>Admin</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Learner</span>
                </div>
              )}

              {profile.isEduUser && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <GraduationCap className="w-3 h-3" />
                  <span>DIU Student</span>
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {profile.displayName || profile.username}
              </h3>
              {isMe && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 uppercase">
                  You
                </span>
              )}
            </div>
            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              @{profile.username}
            </div>
          </div>

          {/* User Bio */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Bio
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              {profile.bio?.trim()
                ? `"${profile.bio.trim()}"`
                : 'No custom bio set yet. Learning C, C++, and DSA daily on ByteSized!'}
            </p>
          </div>

          {/* Key Stats Bar: Streak, XP, Active Status */}
          <div className="grid grid-cols-3 gap-2.5 mt-3.5">
            {/* Streak Stat */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                <Flame className="w-4 h-4 fill-current text-amber-500" />
                <span className="text-base font-black font-mono">
                  {profile.streak ?? 0}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Days Streak
              </span>
            </div>

            {/* XP Stat */}
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-indigo-500 mb-0.5">
                <Zap className="w-4 h-4 fill-current text-indigo-500" />
                <span className="text-base font-black font-mono">
                  {profile.xp ?? 0}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Total XP
              </span>
            </div>

            {/* Status Indicator */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[currentStatus]}`} />
                <span className="text-xs font-black capitalize text-slate-800 dark:text-slate-200">
                  {currentStatus}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Status
              </span>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="mt-3 p-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center animate-slideUp flex items-center justify-center gap-1.5 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          {!isMe && (
            <div className="mt-5 flex items-center gap-2.5">
              {/* Message button */}
              {onStartDM && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onStartDM(profile);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              )}

              {/* Friendship Action Button */}
              {profile.friendshipStatus === 'accepted' || profile.isFriend ? (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleRemoveFriend}
                  className="py-2.5 px-3.5 rounded-2xl bg-emerald-500/15 hover:bg-rose-500/20 text-emerald-600 dark:text-emerald-400 hover:text-rose-500 border border-emerald-500/30 hover:border-rose-500/30 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                  title="Click to remove friend"
                >
                  <UserCheck className="w-4 h-4 group-hover:hidden" />
                  <UserMinus className="w-4 h-4 hidden group-hover:block" />
                  <span className="group-hover:hidden">Friends ✓</span>
                  <span className="hidden group-hover:inline">Unfriend</span>
                </button>
              ) : profile.friendshipStatus === 'pending_received' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleAcceptRequest}
                    className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleDeleteRequest}
                    className="py-2.5 px-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              ) : profile.friendshipStatus === 'pending_sent' ? (
                <button
                  type="button"
                  disabled
                  className="py-2.5 px-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 opacity-80 cursor-default"
                >
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Request Sent</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleSendRequest}
                  className="py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Friend</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
