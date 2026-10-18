import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { ChatMessage, ChatChannel, UserActiveStatus, CodeLanguage } from '../../types';
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
  RefreshCw
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenCodeZone?: (code?: string, lang?: CodeLanguage) => void;
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
    reactions: { '🚀': 3, '💡': 4 },
  },
  {
    id: 'm3',
    channelId: 'dsa',
    senderId: 'mentor-turing',
    senderName: 'Alan Turing',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlanTuring',
    senderRole: 'admin',
    senderStatus: 'online',
    content: 'Remember: When analyzing recursive algorithms, always write out the recurrence relation first before leaping into Master Theorem!',
    codeSnippet: {
      language: 'cpp',
      code: '// Binary search recurrence:\n// T(n) = T(n/2) + O(1) => O(log n) time complexity!',
    },
    timestamp: Date.now() - 3600000,
    reactions: { '💡': 6, '🔥': 2 },
  },
  {
    id: 'm4',
    channelId: 'snippets',
    senderId: 'learner-bjarne',
    senderName: 'Bjarne S.',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bjarne',
    senderRole: 'user',
    senderStatus: 'online',
    content: 'Clean C++20 range iteration trick that replaces verbose indexed loops:',
    codeSnippet: {
      language: 'cpp',
      code: 'for (const auto& [idx, val] : std::views::enumerate(my_vector)) {\n    std::cout << idx << ": " << val << "\\n";\n}',
    },
    timestamp: Date.now() - 1800000,
    reactions: { '🔥': 8, '💻': 5 },
  },
  {
    id: 'm5',
    channelId: 'dm-byte',
    senderId: 'byte-bot',
    senderName: 'Byte (AI Tutor)',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteBot',
    senderRole: 'admin',
    senderStatus: 'online',
    content: 'Purr... I am here whenever you get stuck on a lesson! What programming language or concept are you practicing today? 🐱',
    timestamp: Date.now() - 900000,
    reactions: { '❤️': 3 },
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

export const MessagingModal: React.FC<Props> = ({ isOpen, onClose, onOpenCodeZone }) => {
  const { state, updateProfile } = useGame();
  const [activeChannelId, setActiveChannelId] = useState<string>('general');
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when channel changes or new message arrives
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeChannelId, messages.length]);

  if (!isOpen) return null;

  const currentChannel = INITIAL_CHANNELS.find((c) => c.id === activeChannelId) || INITIAL_CHANNELS[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const isAdmin = state.role === 'admin' || state.authUser?.role === 'admin';
  const currentUserStatus: UserActiveStatus = state.activeStatus || 'online';
  const currentUserName = state.authUser?.displayName || state.authUser?.email?.split('@')[0] || 'ByteSized Learner';
  const currentUserAvatar = state.authUser?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${state.authUser?.id || 'learner'}`;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedText = inputText.trim();
    const trimmedCode = codeContent.trim();

    if (!trimmedText && !trimmedCode) return;

    sound.playClick();

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      channelId: activeChannelId,
      senderId: state.authUser?.id || 'guest-learner',
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

    // AI mascot / peer auto-reply if inside a DM channel
    if (currentChannel.isDirect) {
      setTimeout(() => {
        handlePeerAutoReply(currentChannel.id, trimmedText);
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
      replyText = 'Good code explains itself. If your pointer arithmetic is clear and memory is freed, performance will follow.';
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
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const reactions = { ...(msg.reactions || {}) };
        const currentCount = reactions[emoji] || 0;
        reactions[emoji] = currentCount + 1;
        return { ...msg, reactions };
      })
    );
  };

  const handleCopyCode = (snippetCode: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(snippetCode);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade">
      <div className="w-full max-w-4xl h-[90vh] sm:h-[85vh] bg-white dark:bg-[#0B0F19] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 relative">
        {/* Top Chat Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#111827] z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Mobile Channel Toggle Button */}
            <button
              type="button"
              onClick={() => setShowChannelListMobile(!showChannelListMobile)}
              className="md:hidden p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 text-xs font-bold"
            >
              <Hash className="w-4 h-4" />
              <span>Channels</span>
            </button>

            <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shadow-inner text-base">
              {currentChannel.icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-none text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{currentChannel.name}</span>
                  {currentChannel.isDirect && (
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[currentChannel.peerStatus || 'online']}`} />
                  )}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[220px] sm:max-w-md mt-0.5">
                {currentChannel.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Status Quick Picker in Header */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
                title="Change active status"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[currentUserStatus]}`} />
                <span className="hidden sm:inline capitalize">{currentUserStatus}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isStatusMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-30 animate-pop">
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

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Sidebar Channels + Chat Feed */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Channels Sidebar (Always visible on desktop, drawer on mobile) */}
          <div
            className={`w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0E1526]/70 flex flex-col p-3 overflow-y-auto shrink-0 z-20 ${
              showChannelListMobile ? 'absolute inset-0 bg-white dark:bg-[#0B0F19] w-full z-30' : 'hidden md:flex'
            }`}
          >
            {/* Channels Header */}
            <div className="flex items-center justify-between px-2 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                <span>Channels</span>
              </span>
              {showChannelListMobile && (
                <button
                  type="button"
                  onClick={() => setShowChannelListMobile(false)}
                  className="p-1 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-1 mt-1">
              {INITIAL_CHANNELS.filter((c) => !c.isDirect).map((c) => {
                const isActive = activeChannelId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveChannelId(c.id);
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

            {/* Direct Messages Section */}
            <div className="mt-4 px-2 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Mentors &amp; Peers</span>
            </div>

            <div className="space-y-1 mt-1">
              {INITIAL_CHANNELS.filter((c) => c.isDirect).map((c) => {
                const isActive = activeChannelId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveChannelId(c.id);
                      setShowChannelListMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm font-black'
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
            <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <div className="relative shrink-0">
                <img
                  src={currentUserAvatar}
                  alt={currentUserName}
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-purple-500"
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
          </div>

          {/* Chat Messages Feed & Composer */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0B0F19]">
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {channelMessages.map((msg) => {
                const isMe = msg.senderId === state.authUser?.id;
                const isMsgAdmin = msg.senderRole === 'admin';

                return (
                  <div key={msg.id} className="flex items-start gap-3 group animate-fade">
                    <div className="relative shrink-0">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className={`w-9 h-9 rounded-2xl bg-slate-900 border object-cover ${
                          isMsgAdmin ? 'border-amber-400 ring-1 ring-amber-400/40' : 'border-purple-500/50'
                        }`}
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                          STATUS_DOT[msg.senderStatus || 'online']
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {msg.senderName}
                        </span>

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
                        {/* Existing reactions */}
                        {msg.reactions &&
                          Object.entries(msg.reactions).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{count}</span>
                            </button>
                          ))}

                        {/* Quick reaction button options on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {COMMON_REACTIONS.slice(0, 4).map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
                              title={`React with ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Code Attachment Expandable Drawer */}
            {isAttachingCode && (
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
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-black shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
