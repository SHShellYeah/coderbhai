import React, { useState, useEffect } from 'react';
import { supabaseClient as supabase } from '../../lib/supabase';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { FriendProfile } from '../../types';
import {
  fetchUserProfileById,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchPendingFriendRequests
} from '../../services/authService';
import { UserPlus, Check, X, Bell } from 'lucide-react';

interface Props {
  onInspectProfile?: (user: FriendProfile) => void;
  onFriendAccepted?: (user: FriendProfile) => void;
}

export const FriendRequestNotificationToast: React.FC<Props> = ({
  onInspectProfile,
  onFriendAccepted,
}) => {
  const { state } = useGame();
  const [activeRequest, setActiveRequest] = useState<FriendProfile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const authUserId = state.authUser?.id;

  // 1. Initial check for pending incoming friend requests on mount or when logging in
  useEffect(() => {
    if (!authUserId) return;

    let isMounted = true;
    fetchPendingFriendRequests(authUserId).then((pending) => {
      if (isMounted && pending.length > 0) {
        // Show the latest pending request
        setActiveRequest(pending[0]);
        sound.playPop();
      }
    });

    return () => {
      isMounted = false;
    };
  }, [authUserId]);

  // 2. Realtime listener for incoming friend requests
  useEffect(() => {
    if (!authUserId) return;

    const channelName = `friend_requests_user_${authUserId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `friend_id=eq.${authUserId}`,
        },
        async (payload) => {
          const newRow = payload.new as { id?: string; user_id?: string; status?: string } | null;

          if (newRow && newRow.status === 'pending' && newRow.user_id) {
            // New incoming friend request!
            const senderProfile = await fetchUserProfileById(newRow.user_id);
            if (senderProfile) {
              setActiveRequest({
                ...senderProfile,
                friendshipStatus: 'pending_received',
                pendingRequestId: newRow.id,
              });
              // Play click/pop sound as requested by user
              sound.playPop();
            }
          } else if (payload.eventType === 'DELETE' || (newRow && newRow.status !== 'pending')) {
            // Dismiss toast if request was handled
            const oldRow = payload.old as { user_id?: string } | null;
            setActiveRequest((prev) => (prev?.id === (newRow?.user_id || oldRow?.user_id) ? null : prev));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUserId]);

  if (!activeRequest) return null;

  const handleAccept = async () => {
    if (!authUserId || !activeRequest) return;
    setIsProcessing(true);
    sound.playSuccess();

    const res = await acceptFriendRequest(activeRequest.id, authUserId);
    setIsProcessing(false);

    if (res.success) {
      onFriendAccepted?.(activeRequest);
      setActiveRequest(null);
    }
  };

  const handleDelete = async () => {
    if (!authUserId || !activeRequest) return;
    setIsProcessing(true);
    sound.playClick();

    const res = await rejectFriendRequest(activeRequest.id, authUserId);
    setIsProcessing(false);

    if (res.success) {
      setActiveRequest(null);
    }
  };

  return (
    <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-50 max-w-sm w-[calc(100vw-24px)] sm:w-96 animate-slideDown shadow-2xl">
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#0E1526] border-2 border-indigo-500/40 dark:border-indigo-500/50 shadow-2xl flex flex-col gap-3 text-slate-800 dark:text-slate-100 ring-4 ring-indigo-500/10">
        
        {/* Header with Notification Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>New Friend Request</span>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sender Info & Request Prompt */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onInspectProfile?.(activeRequest)}
            className="relative shrink-0 cursor-pointer group"
            title="Inspect profile"
          >
            <img
              src={activeRequest.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeRequest.id}`}
              alt={activeRequest.displayName}
              className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-indigo-500/60 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shadow-sm">
              <UserPlus className="w-3 h-3" />
            </div>
          </button>

          <div className="min-w-0 flex-1 text-left">
            <div
              onClick={() => onInspectProfile?.(activeRequest)}
              className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-snug cursor-pointer hover:underline"
            >
              <strong className="font-black text-indigo-600 dark:text-indigo-400">
                @{activeRequest.username}
              </strong>{' '}
              sent you a friend request
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span>🔥 {activeRequest.streak ?? 0} streak</span>
              <span>•</span>
              <span className="capitalize">{activeRequest.role === 'admin' ? '👑 Admin' : 'Learner'}</span>
            </div>
          </div>
        </div>

        {/* Accept or Delete Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleAccept}
            className="flex-1 py-2 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Accept</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDelete}
            className="py-2 px-3.5 rounded-2xl bg-slate-100 hover:bg-rose-500/15 dark:bg-slate-800 dark:hover:bg-rose-500/20 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 hover:border-rose-500/30 font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
