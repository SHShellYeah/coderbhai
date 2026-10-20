import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { supabaseClient as supabase } from '../../lib/supabase';
import { ChatMessage, ChatChannel, UserActiveStatus, CodeLanguage, FriendProfile } from '../../types';
import {
  searchUsersByUsername,
  fetchUserFriends,
  fetchPendingFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getDirectChannelId,
  fetchUserProfileById
} from '../../services/authService';
import { UserProfileInspectModal } from '../profile/UserProfileInspectModal';
import {
  X,
  Send,
  Code2,
  Smile,
  Hash,
  Users,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Crown,
  Bot,
  Circle,
  HelpCircle,
  CornerDownRight,
  RefreshCw,
  UserPlus,
  Search,
  UserCheck,
  UserMinus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
  Flame,
  Shield,
  MessageCircle,
  Lock,
  Clock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenCodeZone?: (code?: string, lang?: CodeLanguage) => void;
  onOpenAuth?: (tab?: 'login' | 'register' | 'forgot' | 'update-password') => void;
  onInspectProfile?: (user: FriendProfile) => void;
}

const STORAGE_KEY = 'bytesized_chat_messages_v1';

const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'general-lounge',
    description: 'Welcome & community banter among ByteSized learners',
    icon: '💬',
  },
  {
    id: 'dsa',
    name: 'dsa-help',
    description: 'Data structures, algorithm complexity & problem solving',
    icon: '⚡',
  },
  {
    id: 'snippets',
    name: 'code-snippets',
    description: 'Showcase neat one-liners and C/C++/Python tricks',
    icon: '💻',
  },
  {
    id: 'dm-byte',
    name: 'Byte (AI Tutor)',
    description: 'Direct assistance & hints from your feline coding companion',
    icon: '🐈‍⬛',
    isDirect: true,
    peerStatus: 'online',
  },
  {
    id: 'dm-ada',
    name: 'Ada Lovelace',
    description: 'Algorithms & recursion discussions with Ada',
    icon: '✨',
    isDirect: true,
    peerStatus: 'online',
  },
  {
    id: 'dm-linus',
    name: 'Linus Torvalds',
    description: 'Pointers, memory management & low-level C talk',
    icon: '🐧',
    isDirect: true,
    peerStatus: 'away',
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    channelId: 'general',
    senderId: 'byte-bot',
    senderName: 'Byte (ByteSized Mascot)',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteBot',
    senderRole: 'admin',
    senderStatus: 'online',
    content: 'Meow! 🐾 Welcome to the ByteSized Community Lounge! Share your streak, ask coding questions, or paste snippets to review.',
    timestamp: Date.now() - 3600000 * 2,
    reactions: { '🔥': 5, '❤️': 4, '🐾': 7 },
  },
  {
    id: 'm2',
    channelId: 'general',
    senderId: 'learner-grace',
    senderName: 'Grace Hopper',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GraceHopper',
    senderRole: 'user',
    senderStatus: 'online',
    content: 'Just finished the Pointers & Memory unit in C! The mental model of memory addresses finally clicked.',
    timestamp: Date.now() - 3600000 * 1.5,
    reactions: { '👏': 3, '💡': 6 },
  },
  {
    id: 'm3',
    channelId: 'dsa',
    senderId: 'learner-turing',
    senderName: 'Alan Turing',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlanTuring',
    senderRole: 'user',
    senderStatus: 'busy',
    content: 'Quick tip: When implementing Binary Search, use `mid = low + (high - low) / 2` instead of `(low + high) / 2` to prevent 32-bit integer overflow!',
    timestamp: Date.now() - 3600000 * 1,
    reactions: { '💡': 12, '🔥': 8 },
  },
  {
    id: 'm4',
    channelId: 'snippets',
    senderId: 'learner-linus',
    senderName: 'Linus Torvalds',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Linus',
    senderRole: 'admin',
    senderStatus: 'away',
    content: 'Fast bit manipulation check to see if an integer is a power of 2 in C/C++:',
    codeSnippet: {
      language: 'c',
      code: 'bool isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}',
    },
    timestamp: Date.now() - 1800000,
    reactions: { '⚡': 9, '🚀': 7 },
  },
  {
    id: 'm5',
    channelId: 'dm-byte',
    senderId: 'byte-bot',
    senderName: 'Byte (AI Tutor)',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteBot',
    senderRole: 'admin',
    senderStatus: 'online',
    content: 'Meow! Purr... Need hints on your current lesson? Drop your question or snippet below and I will help you debug!',
    timestamp: Date.now() - 900000,
    reactions: { '🐾': 3 },
  },
  {
    id: 'm6',
    channelId: 'dm-ada',
    senderId: 'mentor-ada',
    senderName: 'Ada Lovelace',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdaLovelace',
    senderRole: 'admin',
    senderStatus: 'online',
    content: 'Greetings! Remember, algorithms are the poetry of mathematical thought. Let me know if you want to inspect recursion trees together!',
    timestamp: Date.now() - 800000,
    reactions: { '✨': 4 },
  },
  {
    id: 'm7',
    channelId: 'dm-linus',
    senderId: 'mentor-linus',
    senderName: 'Linus Torvalds',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Linus',
    senderRole: 'admin',
    senderStatus: 'away',
    content: 'Talk is cheap. Show me the code. If you have questions about raw pointers or structs in C, drop them here.',
    timestamp: Date.now() - 700000,
    reactions: { '🐧': 5 },
  },
];

const STATUS_DOT: Record<UserActiveStatus, string> = {
  online: 'bg-emerald-500 shadow-emerald-500/50',
  away: 'bg-amber-400 shadow-amber-400/50',
  busy: 'bg-rose-500 shadow-rose-500/50',
  offline: 'bg-slate-400 shadow-slate-400/50',
};

const COMMON_REACTIONS = ['🔥', '💡', '❤️', '🚀', '💻', '👀'];

export const MessagingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenCodeZone,
  onOpenAuth,
  onInspectProfile,
}) => {
  const { state, updateProfile } = useGame();
  const [activeChannelId, setActiveChannelId] = useState<string>('general');
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<FriendProfile[]>([]);
  const [loadingPendingRequests, setLoadingPendingRequests] = useState(false);
  const [inspectingUser, setInspectingUser] = useState<FriendProfile | null>(null);

  // User's own reactions: messageId -> array of emojis reacted by current user
  const [myReactions, setMyReactions] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem('bytesized_user_reactions_v1');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('bytesized_user_reactions_v1', JSON.stringify(myReactions));
    } catch {
      // ignore
    }
  }, [myReactions]);

  // Add friend / Search states
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [searchUsernameQuery, setSearchUsernameQuery] = useState('');
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);
  const [searchFeedback, setSearchFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const [isAttachingCode, setIsAttachingCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('cpp');
  const [codeContent, setCodeContent] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [showChannelListMobile, setShowChannelListMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages to localStorage cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Load user friends and canonical DM channels
  const refreshFriendsList = async () => {
    const currentUid = state.authUser?.id;
    if (!currentUid) return;
    setLoadingFriends(true);
    try {
      const friendList = await fetchUserFriends(currentUid);
      setFriends(friendList);

      // Dynamically add friend channels with canonical sorted DM channel ID
      setChannels((prev) => {
        const nonFriendChannels = prev.filter((c) => !c.id.startsWith('dm:'));
        const friendChannels: ChatChannel[] = friendList.map((f) => ({
          id: getDirectChannelId(currentUid, f.id),
          name: f.displayName || f.username || 'Friend',
          description: `@${f.username} • Direct Message`,
          icon: '💬',
          isDirect: true,
          peerStatus: f.activeStatus || 'online',
          peerUserId: f.id,
          peerUsername: f.username,
          peerAvatar: f.avatarUrl,
        }));
        return [...nonFriendChannels, ...friendChannels];
      });
    } catch (err) {
      console.warn('Failed to load friends:', err);
    } finally {
      setLoadingFriends(false);
    }
  };

  // Load incoming pending friend requests
  const refreshPendingRequests = async () => {
    const currentUid = state.authUser?.id;
    if (!currentUid) return;
    setLoadingPendingRequests(true);
    try {
      const pending = await fetchPendingFriendRequests(currentUid);
      setPendingRequests(pending);
    } catch (err) {
      console.warn('Failed to load pending requests:', err);
    } finally {
      setLoadingPendingRequests(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshFriendsList();
      refreshPendingRequests();
    }
  }, [isOpen, state.authUser?.id]);

  // Realtime Supabase listener & database sync for active channel messages
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    // Fetch persisted messages from Supabase for this channel
    const loadChannelMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', activeChannelId)
          .order('created_at', { ascending: true })
          .limit(100);

        if (!error && data && isMounted) {
          const dbMsgs: ChatMessage[] = data.map((r) => ({
            id: r.id,
            channelId: r.channel_id,
            senderId: r.sender_id,
            senderName: r.sender_name,
            senderAvatar: r.sender_avatar,
            senderRole: (r.sender_role as 'admin' | 'user') || 'user',
            senderStatus: (r.sender_status as UserActiveStatus) || 'online',
            content: r.content,
            codeSnippet: r.code_snippet,
            reactions: r.reactions || {},
            timestamp: new Date(r.created_at).getTime(),
          }));

          setMessages((prev) => {
            const others = prev.filter((m) => m.channelId !== activeChannelId);
            if (dbMsgs.length > 0) {
              return [...others, ...dbMsgs];
            }
            const seeds = INITIAL_MESSAGES.filter((m) => m.channelId === activeChannelId);
            return [...others, ...seeds];
          });
        }
      } catch (err) {
        console.warn('Failed to load messages from Supabase:', err);
      }
    };

    loadChannelMessages();

    // Supabase Realtime Channel Subscription
    const channelListener = supabase
      .channel(`realtime_chat_${activeChannelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannelId}`,
        },
        (payload) => {
          const r = payload.new as any;
          if (!r || !r.id) return;
          const incoming: ChatMessage = {
            id: r.id,
            channelId: r.channel_id,
            senderId: r.sender_id,
            senderName: r.sender_name,
            senderAvatar: r.sender_avatar,
            senderRole: (r.sender_role as 'admin' | 'user') || 'user',
            senderStatus: (r.sender_status as UserActiveStatus) || 'online',
            content: r.content,
            codeSnippet: r.code_snippet,
            reactions: r.reactions || {},
            timestamp: new Date(r.created_at).getTime(),
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });

          // Play pop sound for incoming message if sent by peer
          if (r.sender_id !== state.authUser?.id) {
            sound.playPop();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannelId}`,
        },
        (payload) => {
          const r = payload.new as any;
          if (!r || !r.id) return;
          setMessages((prev) =>
            prev.map((m) => (m.id === r.id ? { ...m, reactions: r.reactions || {} } : m))
          );
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channelListener);
    };
  }, [isOpen, activeChannelId, state.authUser?.id]);

  // Debounced search for learners by username
  useEffect(() => {
    const trimmed = searchUsernameQuery.trim().replace(/^@+/, '');
    if (!trimmed) {
      setSearchResults([]);
      setIsSearchingUsers(false);
      return;
    }

    setIsSearchingUsers(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchUsersByUsername(trimmed, state.authUser?.id);
        setSearchResults(results);
      } catch (err) {
        console.warn('Search users error:', err);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchUsernameQuery, state.authUser?.id]);

  // Scroll to bottom when channel changes or new message arrives
  useEffect(() => {
    if (isOpen && !isAddFriendOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeChannelId, messages.length, isAddFriendOpen]);

  if (!isOpen) return null;

  const currentChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const isAdmin = state.role === 'admin' || state.authUser?.role === 'admin';
  const currentUserStatus: UserActiveStatus = state.activeStatus || 'online';
  const currentUserName = state.authUser?.displayName || state.authUser?.email?.split('@')[0] || 'ByteSized Learner';
  const currentUserAvatar = state.authUser?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser?.id || 'learner'}`;

  const handleInspectUser = (user: FriendProfile) => {
    sound.playClick();
    if (onInspectProfile) {
      onInspectProfile(user);
    } else {
      setInspectingUser(user);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.authUser) {
      sound.playError();
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    const trimmedText = inputText.trim();
    const trimmedCode = codeContent.trim();

    if (!trimmedText && !trimmedCode) return;

    sound.playClick();

    const isBotChannel =
      activeChannelId === 'dm-byte' ||
      activeChannelId === 'dm-ada' ||
      activeChannelId === 'dm-linus';

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      channelId: activeChannelId,
      senderId: state.authUser.id,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      senderRole: isAdmin ? 'admin' : 'user',
      senderStatus: currentUserStatus,
      content: trimmedText || (trimmedCode ? 'Shared a code snippet:' : ''),
      codeSnippet: trimmedCode
        ? {
            code: trimmedCode,
            language: codeLanguage,
          }
        : undefined,
      timestamp: Date.now(),
      reactions: {},
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setCodeContent('');
    setIsAttachingCode(false);

    // If public or direct channel with friend: PERSIST TO SUPABASE DATABASE
    if (!isBotChannel) {
      supabase
        .from('messages')
        .insert({
          channel_id: activeChannelId,
          sender_id: state.authUser.id,
          sender_name: currentUserName,
          sender_avatar: currentUserAvatar,
          sender_role: isAdmin ? 'admin' : 'user',
          sender_status: currentUserStatus,
          content: trimmedText || (trimmedCode ? 'Shared a code snippet:' : ''),
          code_snippet: trimmedCode ? { code: trimmedCode, language: codeLanguage } : null,
          reactions: {},
        })
        .then(({ error }) => {
          if (error) {
            console.warn('[Supabase] Failed to persist message:', error);
          }
        });
    }

    // AI mentor auto-replies for companion bots
    if (isBotChannel) {
      setTimeout(() => {
        handlePeerAutoReply(activeChannelId, trimmedText);
      }, 1200);
    }
  };

  const handlePeerAutoReply = (channelId: string, userText: string) => {
    let replyText = 'Great question! Keep practicing and experimenting with the concepts in CodeZone.';
    let replySnippet: { code: string; language: string } | undefined;
    let peerName = 'Byte (AI Tutor)';
    let peerAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteBot';

    if (channelId === 'dm-byte') {
      peerName = 'Byte (AI Tutor)';
      peerAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteBot';
      replyText = `Meow! 🐾 You said: "${userText.slice(0, 40)}${userText.length > 40 ? '...' : ''}". In ByteSized lessons, remember to think step-by-step and predict output before running!`;
    } else if (channelId === 'dm-ada') {
      peerName = 'Ada Lovelace';
      peerAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=AdaLovelace';
      replyText = 'Fascinating! Breaking down complex algorithmic sequences into modular functions is the essence of elegant engineering.';
      replySnippet = {
        language: 'python',
        code: '# Clean modular recursion template\ndef solve(subproblem):\n    if is_base_case(subproblem):\n        return base_result\n    return combine(solve(left), solve(right))',
      };
    } else if (channelId === 'dm-linus') {
      peerName = 'Linus Torvalds';
      peerAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=Linus';
      replyText = 'Talk is cheap. Show me the code. If your pointer arithmetic is clear and memory is freed, performance will follow.';
      replySnippet = {
        language: 'c',
        code: '// Always check malloc returns!\nint *arr = malloc(n * sizeof(int));\nif (!arr) return -1; // handle allocation failure',
      };
    }

    const replyMsg: ChatMessage = {
      id: `reply-${Date.now()}`,
      channelId,
      senderId: channelId,
      senderName: peerName,
      senderAvatar: peerAvatar,
      senderRole: 'admin',
      senderStatus: 'online',
      content: replyText,
      codeSnippet: replySnippet,
      timestamp: Date.now(),
      reactions: { '💡': 1, '🐾': 1 },
    };

    setMessages((prev) => [...prev, replyMsg]);
    sound.playSuccess();
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    sound.playClick();
    const currentUid = state.authUser?.id;
    if (!currentUid) {
      sound.playError();
      if (onOpenAuth) {
        onOpenAuth('login');
      }
      return;
    }

    const currentEmojis = myReactions[messageId] || [];
    const hasAlreadyReacted = currentEmojis.includes(emoji);

    if (hasAlreadyReacted) {
      // UNDO / REMOVE REACTION
      setMyReactions((prev) => ({
        ...prev,
        [messageId]: (prev[messageId] || []).filter((e) => e !== emoji),
      }));

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          const reactions = { ...(msg.reactions || {}) };
          const userReactions = { ...(msg.userReactions || {}) };

          const count = reactions[emoji] || 1;
          if (count <= 1) {
            delete reactions[emoji];
          } else {
            reactions[emoji] = count - 1;
          }

          if (userReactions[emoji]) {
            userReactions[emoji] = userReactions[emoji].filter((uid) => uid !== currentUid);
            if (userReactions[emoji].length === 0) {
              delete userReactions[emoji];
            }
          }

          return { ...msg, reactions, userReactions };
        })
      );
    } else {
      // ADD REACTION
      setMyReactions((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), emoji],
      }));

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          const reactions = { ...(msg.reactions || {}) };
          const userReactions = { ...(msg.userReactions || {}) };

          reactions[emoji] = (reactions[emoji] || 0) + 1;
          userReactions[emoji] = Array.from(new Set([...(userReactions[emoji] || []), currentUid]));

          return { ...msg, reactions, userReactions };
        })
      );
    }
  };

  const handleCopyCode = (snippetCode: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(snippetCode);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Send friend request or accept incoming request
  const handleAddFriendClick = async (targetUser: FriendProfile) => {
    sound.playClick();
    const currentUid = state.authUser?.id;
    if (!currentUid) {
      setSearchFeedback({ msg: 'Please log in to add friends!', type: 'error' });
      sound.playError();
      return;
    }

    const res = await sendFriendRequest(currentUid, targetUser.id);
    if (res.success) {
      if (res.status === 'accepted') {
        sound.playSuccess();
        setSearchFeedback({ msg: `🎉 Added @${targetUser.username} as a friend!`, type: 'success' });
        setSearchResults((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, isFriend: true, friendshipStatus: 'accepted' } : u))
        );
        refreshFriendsList();
        refreshPendingRequests();
      } else {
        sound.playPop();
        setSearchFeedback({ msg: `Friend request sent to @${targetUser.username}! They must accept to become friends.`, type: 'success' });
        setSearchResults((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, friendshipStatus: 'pending_sent' } : u))
        );
      }
    } else {
      sound.playError();
      setSearchFeedback({ msg: res.error || 'Failed to send friend request.', type: 'error' });
    }
  };

  const handleAcceptPendingRequest = async (req: FriendProfile) => {
    const currentUid = state.authUser?.id;
    if (!currentUid) return;
    sound.playSuccess();
    const res = await acceptFriendRequest(req.id, currentUid);
    if (res.success) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
      refreshFriendsList();
    }
  };

  const handleDeletePendingRequest = async (req: FriendProfile) => {
    const currentUid = state.authUser?.id;
    if (!currentUid) return;
    sound.playClick();
    const res = await rejectFriendRequest(req.id, currentUid);
    if (res.success) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
    }
  };

  // Remove friend action
  const handleRemoveFriendClick = async (targetUser: FriendProfile) => {
    sound.playClick();
    const currentUid = state.authUser?.id;
    if (!currentUid) return;

    const res = await removeFriend(currentUid, targetUser.id);
    if (res.success) {
      sound.playClick();
      setSearchResults((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isFriend: false, friendshipStatus: 'none' } : u))
      );
      refreshFriendsList();
    }
  };

  // Switch to a direct message channel with a user/friend using canonical channel ID
  const handleStartDMWithUser = (user: FriendProfile) => {
    sound.playClick();
    const currentUid = state.authUser?.id || 'me';
    const dmChannelId = getDirectChannelId(currentUid, user.id);

    // Ensure channel exists in channels list
    setChannels((prev) => {
      if (prev.some((c) => c.id === dmChannelId)) return prev;
      return [
        ...prev,
        {
          id: dmChannelId,
          name: user.displayName || user.username,
          description: `@${user.username} • Direct Message`,
          icon: '💬',
          isDirect: true,
          peerStatus: user.activeStatus || 'online',
          peerUserId: user.id,
          peerUsername: user.username,
          peerAvatar: user.avatarUrl,
        },
      ];
    });

    setActiveChannelId(dmChannelId);
    setIsAddFriendOpen(false);
    setShowChannelListMobile(false);
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade">
      <div className="w-full h-full sm:h-[88vh] max-w-4xl bg-white dark:bg-[#0B0F19] sm:border-2 border-slate-200 dark:border-slate-800 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 relative">
        
        {!state.authUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#0B0F19] dark:via-[#0E1526] dark:to-[#0B0F19]">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon & Lock Badge */}
            <div className="relative mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/20">
                🐱
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                <Lock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Members Only Community</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white max-w-md leading-tight">
              Sign In Required to Access Community Chat
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2.5 leading-relaxed">
              Anonymous messaging is completely turned off to keep our learning community clean, safe, and helpful. Sign in or register your unique @username to chat, ask DSA questions, and share code.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-7 w-full max-w-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  if (onOpenAuth) onOpenAuth('login');
                }}
                className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  if (onOpenAuth) onOpenAuth('register');
                }}
                className="w-full py-3 px-5 rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs sm:text-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Register Account</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* =====================================================================
                TOP CHAT HEADER BAR - ALWAYS CONTAINS A UNMISSABLE CLOSE BUTTON
                ===================================================================== */}
            <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#111827] z-10 shrink-0">
          
          {/* Left Side: Channel / View Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden pr-2">
            {/* Mobile Channel Toggle Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowChannelListMobile(!showChannelListMobile);
              }}
              className="md:hidden p-2 rounded-xl bg-slate-200/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs font-black shrink-0 hover:bg-slate-300 transition-colors"
              title="Toggle channel list"
            >
              <Hash className="w-4 h-4 text-indigo-500" />
              <span className="hidden xs:inline">Channels</span>
            </button>

            {isAddFriendOpen ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-black tracking-tight leading-none text-slate-900 dark:text-white truncate">
                    Find Friends by @Username
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    Search unique handles across ByteSized
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0 text-sm sm:text-base">
                  {currentChannel.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-base font-black tracking-tight leading-none text-slate-900 dark:text-white truncate">
                      {currentChannel.name}
                    </h3>
                    {currentChannel.isDirect && (
                      <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[currentChannel.peerStatus || 'online']}`} />
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    {currentChannel.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!state.authUser && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onOpenAuth) onOpenAuth('login');
                }}
                className="hidden xs:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-black transition-all cursor-pointer"
                title="Anonymous chat disabled: click to sign in"
              >
                <Lock className="w-3 h-3 text-amber-500" />
                <span>Sign In</span>
              </button>
            )}

            {/* Find / Add Friend Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsAddFriendOpen(!isAddFriendOpen);
                setShowChannelListMobile(false);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isAddFriendOpen
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/50'
                  : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/25 border border-indigo-500/30'
              }`}
              title="Search and add friends by username"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Friend</span>
            </button>

            {/* Active Status Quick Picker in Header */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
                title="Change active status"
              >
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[currentUserStatus]}`} />
                <span className="hidden md:inline capitalize text-[11px]">{currentUserStatus}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isStatusMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-40 animate-pop">
                  {(['online', 'away', 'busy', 'offline'] as UserActiveStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        updateProfile({ activeStatus: st });
                        setIsStatusMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold capitalize text-left transition-colors cursor-pointer ${
                        currentUserStatus === st
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[st]}`} />
                      <span>{st === 'offline' ? 'Invisible' : st}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PROMINENT, UNMISSABLE CLOSE BUTTON (Visible on all screen sizes) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Close Chat"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 transition-all font-black text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">Close</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            MAIN BODY: SIDEBAR CHANNELS + (CHAT FEED OR ADD FRIEND VIEW)
            ===================================================================== */}
        <div className="flex-1 flex min-h-0 relative">
          
          {/* ===================================================================
              CHANNELS SIDEBAR (Desktop permanent / Mobile drawer overlay)
              =================================================================== */}
          <div
            className={`w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0E1526]/70 flex flex-col p-3 overflow-y-auto shrink-0 z-20 ${
              showChannelListMobile
                ? 'absolute inset-0 bg-white dark:bg-[#0B0F19] w-full h-full z-30 p-4'
                : 'hidden md:flex'
            }`}
          >
            {/* Mobile Drawer Top Action Bar with Clear Back & Close Buttons */}
            {showChannelListMobile && (
              <div className="pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowChannelListMobile(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Chat</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-black flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span>Close Chat</span>
                </button>
              </div>
            )}

            {/* Quick "Add Friend" Button in Sidebar */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsAddFriendOpen(true);
                setShowChannelListMobile(false);
              }}
              className="w-full mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Search &amp; Add Friend</span>
            </button>

            {/* Public Community Channels */}
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                <span>Channels</span>
              </span>
            </div>

            <div className="space-y-1 mt-1">
              {channels.filter((c) => !c.isDirect).map((c) => {
                const isActive = !isAddFriendOpen && activeChannelId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveChannelId(c.id);
                      setIsAddFriendOpen(false);
                      setShowChannelListMobile(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Friends / Direct Messages Section */}
            <div className="mt-4 flex items-center justify-between px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Friends &amp; Peers ({friends.length})</span>
              </span>
            </div>

            <div className="space-y-1 mt-1">
              {channels.filter((c) => c.isDirect && (c.id.startsWith('dm:') || c.id.startsWith('dm-user-'))).map((c) => {
                const isActive = !isAddFriendOpen && activeChannelId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveChannelId(c.id);
                      setIsAddFriendOpen(false);
                      setShowChannelListMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {c.peerAvatar ? (
                        <img
                          src={c.peerAvatar}
                          alt={c.name}
                          className="w-5 h-5 rounded-lg object-cover bg-slate-900 border border-slate-700"
                        />
                      ) : (
                        <span>{c.icon}</span>
                      )}
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[c.peerStatus || 'online']}`} />
                  </button>
                );
              })}

              {/* AI Mentors */}
              <div className="pt-2 px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                AI Companions
              </div>
              {channels.filter((c) => c.isDirect && !c.id.startsWith('dm:') && !c.id.startsWith('dm-user-')).map((c) => {
                const isActive = !isAddFriendOpen && activeChannelId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveChannelId(c.id);
                      setIsAddFriendOpen(false);
                      setShowChannelListMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{c.icon}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[c.peerStatus || 'online']}`} />
                  </button>
                );
              })}
            </div>

            {/* User Profile Mini Footer inside Sidebar */}
            <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-800">
              {state.authUser ? (
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <img
                      src={currentUserAvatar}
                      alt={currentUserName}
                      className="w-8 h-8 rounded-xl bg-slate-900 border border-purple-500 object-cover"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${STATUS_DOT[currentUserStatus]}`} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                      <span>{currentUserName}</span>
                      {isAdmin && <Crown className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {currentUserStatus}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0 text-left">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                        Guest Mode
                      </div>
                      <div className="text-[9px] text-amber-600 dark:text-amber-400 font-bold truncate">
                        Chatting disabled
                      </div>
                    </div>
                  </div>
                  {onOpenAuth && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onOpenAuth('login');
                      }}
                      className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 hover:underline shrink-0"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===================================================================
              MAIN VIEW AREA: EITHER "ADD FRIEND & SEARCH" OR "CHAT FEED"
              =================================================================== */}
          {isAddFriendOpen ? (
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0B0F19] overflow-y-auto p-4 sm:p-6 space-y-5 animate-fade">
              {/* Back to Chat Link */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddFriendOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-black text-indigo-500 hover:text-indigo-400 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Channel Feed</span>
                </button>

                <span className="text-[11px] font-bold text-slate-400">
                  Usernames are 100% unique across ByteSized
                </span>
              </div>

              {/* Add Friend Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-indigo-500/10 border-2 border-indigo-500/30">
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-500" />
                  <span>Connect with Friends &amp; Peers</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Search for your classmates or coding partners by their unique <span className="font-bold text-indigo-400">@username</span> handle to add them, compare learning streaks, and send direct messages.
                </p>

                {/* Real-Time Username Search Input */}
                <div className="mt-4 relative">
                  <span className="absolute left-3.5 top-3 text-sm font-black text-slate-400 select-none">@</span>
                  <input
                    type="text"
                    value={searchUsernameQuery}
                    onChange={(e) => setSearchUsernameQuery(e.target.value)}
                    placeholder="Search username handle (e.g. acid, codeninja)..."
                    className="w-full bg-white dark:bg-slate-900 border-2 border-indigo-500/40 focus:border-indigo-500 rounded-xl pl-8 pr-10 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none shadow-sm"
                  />
                  <div className="absolute right-3 top-3 text-slate-400">
                    {isSearchingUsers ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Alert */}
              {searchFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-slideUp ${
                    searchFeedback.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                  }`}
                >
                  {searchFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{searchFeedback.msg}</span>
                </div>
              )}

              {/* Search Results List */}
              {searchUsernameQuery.trim() && (
                <div className="space-y-3">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Search Results ({searchResults.length})</span>
                    {isSearchingUsers && <span className="text-[10px] text-indigo-400">Searching database...</span>}
                  </div>

                  {searchResults.length === 0 && !isSearchingUsers ? (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                      <div className="text-2xl">🔍</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        No learner found matching &ldquo;@{searchUsernameQuery.replace(/^@+/, '')}&rdquo;
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        Make sure the username is spelled correctly. Usernames in ByteSized are strictly unique!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex items-start gap-3 shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={() => handleInspectUser(user)}
                            className="relative shrink-0 cursor-pointer group"
                            title="Inspect profile"
                          >
                            <img
                              src={user.avatarUrl}
                              alt={user.displayName}
                              className="w-11 h-11 rounded-2xl bg-slate-950 border border-purple-500/50 object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${STATUS_DOT[user.activeStatus || 'online']}`} />
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleInspectUser(user)}
                                className="text-xs font-black text-slate-900 dark:text-white truncate hover:underline cursor-pointer text-left"
                              >
                                {user.displayName}
                              </button>
                              {user.role === 'admin' ? (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xs border border-amber-300">
                                  👑 Admin
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                  User
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleInspectUser(user)}
                              className="text-[11px] font-mono font-bold text-indigo-500 dark:text-indigo-400 mt-0.5 hover:underline cursor-pointer block"
                            >
                              @{user.username}
                            </button>

                            {user.bio && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                                {user.bio}
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-2.5 flex items-center gap-2">
                              {user.isFriend || user.friendshipStatus === 'accepted' ? (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFriendClick(user)}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-rose-500/20 hover:text-rose-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-all"
                                  title="Click to remove friend"
                                >
                                  <UserCheck className="w-3 h-3" />
                                  <span>Friends ✓</span>
                                </button>
                              ) : user.friendshipStatus === 'pending_received' ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleAcceptPendingRequest(user)}
                                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePendingRequest(user)}
                                    className="px-2 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              ) : user.friendshipStatus === 'pending_sent' ? (
                                <span className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 text-[10px] font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  <span>Request Sent</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddFriendClick(user)}
                                  className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                                >
                                  <UserPlus className="w-3 h-3" />
                                  <span>Add Friend</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleStartDMWithUser(user)}
                                className="px-2.5 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Message</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pending Friend Requests Section */}
              {pendingRequests.length > 0 && (
                <div className="pt-2 space-y-3 animate-fade">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pending Friend Requests ({pendingRequests.length})</span>
                    </span>
                    {loadingPendingRequests && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div
                          onClick={() => handleInspectUser(req)}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                          title="Click to inspect profile"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={req.avatarUrl}
                              alt={req.displayName}
                              className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-400/50 object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 ${STATUS_DOT[req.activeStatus || 'online']}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-400 transition-colors">
                              {req.displayName}
                            </div>
                            <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold truncate">
                              @{req.username}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              🔥 {req.streak ?? 0} streak
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAcceptPendingRequest(req)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                            title="Accept friend request"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Accept</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePendingRequest(req)}
                            className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/15 border border-rose-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            title="Delete friend request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Friends List */}
              <div className="pt-2 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Your Friends ({friends.length})</span>
                  {loadingFriends && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />}
                </div>

                {friends.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <div className="text-3xl">👥</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      You haven&apos;t added any friends yet
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Search your classmate&apos;s unique @username handle above to connect and direct message.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div
                          onClick={() => handleInspectUser(friend)}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                          title="Click to inspect profile"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={friend.avatarUrl}
                              alt={friend.displayName}
                              className="w-10 h-10 rounded-xl bg-slate-950 border border-purple-500/40 object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 ${STATUS_DOT[friend.activeStatus || 'online']}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-400 transition-colors">
                              {friend.displayName}
                            </div>
                            <div className="text-[11px] font-mono text-indigo-400 font-bold truncate">
                              @{friend.username}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartDMWithUser(friend)}
                            className="px-2.5 py-1 rounded-xl bg-purple-600 text-white hover:bg-purple-500 text-xs font-black flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Chat</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveFriendClick(friend)}
                            className="p-1 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove friend"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ===================================================================
                CHAT MESSAGES FEED & COMPOSER
                =================================================================== */
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0B0F19]">
              {/* Scrollable Messages Area */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
                {channelMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-400">
                    <div className="text-4xl">{currentChannel.icon || '💬'}</div>
                    <div className="text-sm font-black text-slate-700 dark:text-slate-200">
                      Welcome to #{currentChannel.name}!
                    </div>
                    <p className="text-xs max-w-sm">
                      {currentChannel.description}
                    </p>
                  </div>
                ) : (
                  channelMessages.map((msg) => {
                    const isMsgAdmin = msg.senderRole === 'admin';

                    return (
                      <div key={msg.id} className="flex items-start gap-2.5 sm:gap-3 group animate-fade">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            handleInspectUser({
                              id: msg.senderId,
                              username: msg.senderName,
                              displayName: msg.senderName,
                              avatarUrl: msg.senderAvatar,
                              role: msg.senderRole,
                              activeStatus: msg.senderStatus,
                            });
                          }}
                          className="relative shrink-0 cursor-pointer hover:opacity-85 transition-opacity text-left"
                          title={`Inspect ${msg.senderName}'s profile`}
                        >
                          <img
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 border object-cover ${
                              isMsgAdmin ? 'border-amber-400 ring-1 ring-amber-400/40' : 'border-purple-500/50'
                            }`}
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                              STATUS_DOT[msg.senderStatus || 'online']
                            }`}
                          />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                handleInspectUser({
                                  id: msg.senderId,
                                  username: msg.senderName,
                                  displayName: msg.senderName,
                                  avatarUrl: msg.senderAvatar,
                                  role: msg.senderRole,
                                  activeStatus: msg.senderStatus,
                                });
                              }}
                              className="text-xs font-black text-slate-900 dark:text-white hover:underline cursor-pointer text-left"
                            >
                              {msg.senderName}
                            </button>

                            {isMsgAdmin ? (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xs border border-amber-300">
                                👑 Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                User
                              </span>
                            )}

                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>

                          {/* Message Content */}
                          {msg.content && (
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          )}

                          {/* Attached Code Snippet */}
                          {msg.codeSnippet && (
                            <div className="mt-2 rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-md max-w-xl">
                              <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                                <span className="text-purple-400 uppercase font-black">
                                  {msg.codeSnippet.language}
                                </span>
                                <div className="flex items-center gap-2">
                                  {onOpenCodeZone && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        sound.playClick();
                                        onClose();
                                        onOpenCodeZone(msg.codeSnippet?.code, (msg.codeSnippet?.language as CodeLanguage) || 'cpp');
                                      }}
                                      className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                                      title="Open in CodeZone playground"
                                    >
                                      <Sparkles className="w-3 h-3 text-emerald-400" />
                                      <span>Run in CodeZone</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                                    className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    {copiedCodeId === msg.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                                <code>{msg.codeSnippet.code}</code>
                              </pre>
                            </div>
                          )}

                          {/* Emoji Reactions Row */}
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            {msg.reactions &&
                              Object.entries(msg.reactions).map(([emoji, count]) => {
                                const isReactedByMe = (myReactions[msg.id] || []).includes(emoji);
                                return (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleToggleReaction(msg.id, emoji)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs transition-all cursor-pointer ${
                                      isReactedByMe
                                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-xs ring-1 ring-indigo-500/30 font-bold scale-105'
                                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                                    title={isReactedByMe ? "You reacted • Click to remove/undo" : "Click to react"}
                                  >
                                    <span>{emoji}</span>
                                    <span className={`text-[10px] font-bold ${isReactedByMe ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                      {count}
                                    </span>
                                    {isReactedByMe && <span className="text-[10px] text-indigo-400 font-black">✓</span>}
                                  </button>
                                );
                              })}

                            {/* Quick reactions on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              {COMMON_REACTIONS.slice(0, 4).map((emoji) => {
                                const isReactedByMe = (myReactions[msg.id] || []).includes(emoji);
                                return (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleToggleReaction(msg.id, emoji)}
                                    className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                                      isReactedByMe
                                        ? 'bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-400 scale-110'
                                        : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}
                                    title={isReactedByMe ? `You reacted with ${emoji} (click to remove/undo)` : `React with ${emoji}`}
                                  >
                                    {emoji}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Code Attachment Expandable Drawer */}
              {isAttachingCode && state.authUser && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 animate-slideUp space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Attach Code Snippet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={codeLanguage}
                        onChange={(e) => setCodeLanguage(e.target.value)}
                        className="bg-slate-200 dark:bg-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
                      >
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsAttachingCode(false)}
                        className="p-1 hover:text-rose-400 text-slate-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    placeholder="// Paste your code here..."
                    rows={4}
                    className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                  />
                </div>
              )}

              {/* Input Composer Box */}
              {!state.authUser ? (
                <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/90 backdrop-blur-sm shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2.5 text-center sm:text-left">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 justify-center sm:justify-start">
                        <span>Anonymous Chatting Disabled</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                          Members Only
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Sign in or register your account to chat, share code snippets, and react.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onOpenAuth && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            onOpenAuth('login');
                          }}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            onOpenAuth('register');
                          }}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Register</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526] shrink-0"
                >
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 focus-within:border-indigo-500 transition-colors">
                    {/* Code Attachment Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setIsAttachingCode(!isAttachingCode);
                      }}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isAttachingCode
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                      title="Attach code snippet"
                    >
                      <Code2 className="w-4 h-4" />
                    </button>

                    {/* Message Text Input */}
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Message #${currentChannel.name}...`}
                      className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
                    />

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!inputText.trim() && !codeContent.trim()}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-black shadow-md active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* Embedded Profile Inspection Modal */}
      {inspectingUser && (
        <UserProfileInspectModal
          isOpen={!!inspectingUser}
          user={inspectingUser}
          onClose={() => setInspectingUser(null)}
          onStartDM={(target) => {
            setInspectingUser(null);
            handleStartDMWithUser(target);
          }}
          onFriendStatusChange={() => {
            refreshFriendsList();
            refreshPendingRequests();
          }}
        />
      )}
    </div>
  );
};
