import React from 'react';
import { sound } from '../../utils/audio';

export type BottomNavTab = 'learn' | 'quests' | 'speed' | 'practice' | 'chat' | 'arena' | 'more';

interface Props {
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  unreadChatCount?: number;
}

export const BottomNavBar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  unreadChatCount = 0,
}) => {
  const handleTabClick = (tab: BottomNavTab) => {
    sound.playClick();
    onSelectTab(tab);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#131F24] border-t border-[#263843] px-2 py-1.5 flex items-center justify-around select-none shadow-lg lg:hidden"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      aria-label="Bottom Navigation"
    >
      {/* 1. Learn (Home Birdhouse) */}
      <button
        type="button"
        onClick={() => handleTabClick('learn')}
        className={`flex items-center justify-center p-2 transition-all cursor-pointer ${
          activeTab === 'learn'
            ? 'rounded-xl border-2 border-[#1CB0F6] bg-[#1CB0F6]/10'
            : 'hover:opacity-80'
        }`}
        title="Learn / Path"
        aria-label="Learn / Path"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9Z"
            fill="#FFC800"
            stroke="#E5A100"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9 21v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"
            fill="#B45309"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="8.5" r="1.5" fill="#78350F" />
        </svg>
      </button>

      {/* 2. Quests / Chest */}
      <button
        type="button"
        onClick={() => handleTabClick('quests')}
        className={`flex items-center justify-center p-2 transition-all cursor-pointer ${
          activeTab === 'quests'
            ? 'rounded-xl border-2 border-[#1CB0F6] bg-[#1CB0F6]/10'
            : 'hover:opacity-80'
        }`}
        title="Quests & Achievements"
        aria-label="Quests"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="9" width="18" height="12" rx="2" fill="#E5A100" stroke="#FFC800" strokeWidth="1.5" />
          <path d="M2 9.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2v-2Z" fill="#FFC800" stroke="#FFE664" strokeWidth="1" />
          <rect x="10" y="11" width="4" height="4" rx="1" fill="#78350F" stroke="#E5A100" strokeWidth="1" />
          <circle cx="12" cy="13" r="0.75" fill="#FFC800" />
        </svg>
      </button>

      {/* 3. Speed Training (⚡ Golden Lightning) */}
      <button
        type="button"
        onClick={() => handleTabClick('speed')}
        className={`flex items-center justify-center p-2 transition-all cursor-pointer ${
          activeTab === 'speed'
            ? 'rounded-xl border-2 border-[#FFC800] bg-[#FFC800]/10'
            : 'hover:opacity-80'
        }`}
        title="Speed Training - Timed PBs & Roadmaps"
        aria-label="Speed Training"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"
            fill="#FFC800"
            stroke="#E5A100"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 4. Chat / Heart */}
      <button
        type="button"
        onClick={() => handleTabClick('chat')}
        className={`relative flex items-center justify-center p-2 transition-all cursor-pointer ${
          activeTab === 'chat'
            ? 'rounded-xl border-2 border-[#1CB0F6] bg-[#1CB0F6]/10'
            : 'hover:opacity-80'
        }`}
        title="Community Chat"
        aria-label="Chat"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
            fill="#FF86D0"
          />
          <path
            d="M12 8.5c-.8-1-2.2-1.2-3.1-.3-.9.9-.9 2.3 0 3.2l3.1 3.1 3.1-3.1c.9-.9.9-2.3 0-3.2-.9-.9-2.3-.7-3.1.3Z"
            fill="#FFFFFF"
          />
        </svg>
        {unreadChatCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#131F24]" />
        )}
      </button>

      {/* 5. Arena / League Shield */}
      <button
        type="button"
        onClick={() => handleTabClick('arena')}
        className={`flex items-center justify-center p-2 transition-all cursor-pointer ${
          activeTab === 'arena'
            ? 'rounded-xl border-2 border-[#1CB0F6] bg-[#1CB0F6]/10'
            : 'hover:opacity-80'
        }`}
        title="Coding Arena & Leaderboards"
        aria-label="Arena"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1CB0F6" />
              <stop offset="50%" stopColor="#CE82FF" />
              <stop offset="100%" stopColor="#00CD9C" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L4 5v6.5c0 5 3.4 9.7 8 10.5 4.6-.8 8-5.5 8-10.5V5l-8-3Z"
            fill="url(#shieldGrad)"
          />
          <polygon
            points="12,7 13.5,10.5 17,11 14.5,13.5 15,17 12,15 9,17 9.5,13.5 7,11 10.5,10.5"
            fill="#FFFFFF"
          />
        </svg>
      </button>

      {/* 6. More / Three Dots */}
      <button
        type="button"
        onClick={() => handleTabClick('more')}
        className={`flex items-center justify-center p-2 transition-all cursor-pointer ${
          activeTab === 'more'
            ? 'rounded-xl border-2 border-[#1CB0F6] bg-[#1CB0F6]/10'
            : 'hover:opacity-80'
        }`}
        title="More Features & Profile"
        aria-label="More"
      >
        <div className="w-6 h-6 rounded-full bg-[#CE82FF] flex items-center justify-center text-white">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </div>
      </button>
    </nav>
  );
};
