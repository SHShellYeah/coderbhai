import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { LessonNode } from './types';
import { TopBar } from './components/navigation/TopBar';
import { WindingPath } from './components/path/WindingPath';
import { RightSidebar } from './components/sidebar/RightSidebar';
import { LessonModal } from './components/lesson/LessonModal';
import { PracticeModal } from './components/practice/PracticeModal';
import { PlacementModal } from './components/placement/PlacementModal';
import { ThemeCustomizerModal } from './components/settings/ThemeCustomizerModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Map, Trophy, Target, RotateCcw, Settings } from 'lucide-react';

const MainApp: React.FC = () => {
  const { state } = useGame();
  const [activeLessonNode, setActiveLessonNode] = useState<LessonNode | null>(null);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'learn' | 'practice' | 'quests' | 'leaderboard' | 'settings'>('learn');

  // Trigger placement flow if active course hasn't had onboarding yet
  useEffect(() => {
    const courseProg = state.courseProgress[state.activeCourseId];
    if (!courseProg || !courseProg.placementTaken) {
      setIsPlacementOpen(true);
    }
  }, [state.activeCourseId, state.courseProgress]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors w-full max-w-full overflow-x-hidden">
      {/* Top Stats & Course Bar */}
      <TopBar
        onOpenPractice={() => setIsPracticeOpen(true)}
        onOpenPlacement={() => setIsPlacementOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row justify-center pb-20 lg:pb-8">
        {/* Mobile View Switching Tabs - Complete Feature Access on Mobile */}
        <div className="lg:hidden flex items-center justify-around border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] py-2 px-1.5 sticky top-16 z-20 w-full overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setMobileTab('learn')}
            className={`flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'learn'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Learn
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('practice')}
            className={`flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'practice'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Practice
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('quests')}
            className={`flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'quests'
                ? 'bg-brand-gold text-amber-950 shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Quests
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('leaderboard')}
            className={`flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'leaderboard'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Ranks
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('settings')}
            className={`flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'settings'
                ? 'bg-brand-accent text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Themes
          </button>
        </div>

        {/* Learning Path (The Winding Map) */}
        <div
          className={`flex-1 flex flex-col items-center max-w-2xl w-full border-r-0 lg:border-r-2 border-slate-200 dark:border-slate-800/80 ${
            mobileTab !== 'learn' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <WindingPath
            courseId={state.activeCourseId}
            onSelectNode={node => setActiveLessonNode(node)}
          />
        </div>

        {/* Sidebars (Quests, Leaderboards, Weak areas, Settings) */}
        <div
          className={`shrink-0 ${
            mobileTab === 'learn' ? 'hidden lg:block' : 'block w-full max-w-lg mx-auto'
          }`}
        >
          <RightSidebar
            onOpenPractice={() => setIsPracticeOpen(true)}
            onOpenPlacement={() => setIsPlacementOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            filter={mobileTab === 'learn' ? 'all' : mobileTab}
          />
        </div>
      </div>

      {/* Floating Action Button on Mobile (Quick Practice) when in Learn map */}
      {mobileTab === 'learn' && (
        <div className="lg:hidden fixed bottom-5 right-5 z-20">
          <button
            type="button"
            onClick={() => setIsPracticeOpen(true)}
            className="btn-3d btn-3d-purple p-4 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer"
            title="Practice Weak Areas"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Full-Screen Interactive Lesson Modal */}
      {activeLessonNode && (
        <LessonModal
          node={activeLessonNode}
          onClose={() => setActiveLessonNode(null)}
          onOpenPractice={() => {
            setActiveLessonNode(null);
            setIsPracticeOpen(true);
          }}
        />
      )}

      {/* Practice Weak Areas & Refill Hearts Modal */}
      {isPracticeOpen && (
        <PracticeModal onClose={() => setIsPracticeOpen(false)} />
      )}

      {/* Onboarding & Adaptive Placement Modal */}
      {isPlacementOpen && (
        <PlacementModal
          courseId={state.activeCourseId}
          onClose={() => setIsPlacementOpen(false)}
        />
      )}

      {/* Aesthetics & Sound Customizer Modal */}
      {isSettingsOpen && (
        <ThemeCustomizerModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GameProvider>
        <MainApp />
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;
