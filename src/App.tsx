import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { useTranslation } from './data/translations';
import { sound } from './utils/audio';
import { LessonNode, CodeLanguage } from './types';
import { TopBar } from './components/navigation/TopBar';
import { WindingPath } from './components/path/WindingPath';
import { LeftSidebar } from './components/sidebar/LeftSidebar';
import { RightSidebar } from './components/sidebar/RightSidebar';
import { LessonModal } from './components/lesson/LessonModal';
import { PracticeModal } from './components/practice/PracticeModal';
import { PlacementModal } from './components/placement/PlacementModal';
import { ThemeCustomizerModal } from './components/settings/ThemeCustomizerModal';
import { IdeaZoneModal } from './components/ideazone/IdeaZoneModal';
import { CodeZoneModal } from './components/codezone/CodeZoneModal';
import { AuthModal } from './components/auth/AuthModal';
import { MessagingModal } from './components/chat/MessagingModal';
import { CodingArenaModal } from './components/arena/CodingArenaModal';
import { QuestionBankModal } from './components/arena/QuestionBankModal';
import { stopConfetti } from './utils/confetti';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Map, Trophy, Target, RotateCcw, Settings, Lightbulb, Terminal, MessageSquare, Swords, BookOpen } from 'lucide-react';
import { ArenaChallenge } from './types';

const MainApp: React.FC = () => {
  const { state } = useGame();
  const t = useTranslation(state.language);
  const [activeLessonNode, setActiveLessonNode] = useState<LessonNode | null>(null);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isIdeaZoneOpen, setIsIdeaZoneOpen] = useState<boolean>(false);
  const [isCodeZoneOpen, setIsCodeZoneOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState<boolean>(false);
  const [isArenaOpen, setIsArenaOpen] = useState<boolean>(false);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState<boolean>(false);
  const [arenaInitialChallenge, setArenaInitialChallenge] = useState<ArenaChallenge | null>(null);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('register');
  const [codeZoneSnippet, setCodeZoneSnippet] = useState<{ code: string; language: CodeLanguage } | undefined>();
  const [ideaZoneSeedNote, setIdeaZoneSeedNote] = useState<{
    title: string;
    content: string;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
  } | undefined>();
  const [mobileTab, setMobileTab] = useState<'learn' | 'practice' | 'quests' | 'leaderboard' | 'settings'>('learn');

  // Trigger placement flow if active course hasn't had onboarding yet
  useEffect(() => {
    const courseProg = state.courseProgress[state.activeCourseId];
    if (!courseProg || !courseProg.placementTaken) {
      setIsPlacementOpen(true);
    }
  }, [state.activeCourseId, state.courseProgress]);

  const handleOpenMessaging = () => {
    if (!state.authUser) {
      sound.playError();
      setAuthInitialTab('login');
      setIsAuthOpen(true);
      return;
    }
    setIsMessagingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors w-full max-w-full overflow-x-hidden">
      {/* Top Stats & Course Bar */}
      <TopBar
        onOpenPractice={() => setIsPracticeOpen(true)}
        onOpenPlacement={() => setIsPlacementOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenIdeaZone={() => {
          setIdeaZoneSeedNote(undefined);
          setIsIdeaZoneOpen(true);
        }}
        onOpenCodeZone={() => {
          setCodeZoneSnippet(undefined);
          setIsCodeZoneOpen(true);
        }}
        onOpenAuth={(tab = 'register') => {
          setAuthInitialTab(tab);
          setIsAuthOpen(true);
        }}
        onOpenMessaging={handleOpenMessaging}
        onOpenArena={() => {
          setArenaInitialChallenge(null);
          setIsArenaOpen(true);
        }}
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row justify-center pb-20 lg:pb-8">
        {/* Mobile View Switching Tabs - Complete Feature Access on Mobile */}
        <div className="lg:hidden flex items-center justify-around border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-2 px-2 sticky top-[57px] sm:top-[65px] z-20 w-full overflow-x-auto gap-1 scrollbar-none shadow-xs">
          <button
            type="button"
            onClick={() => setMobileTab('learn')}
            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'learn'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t.learn}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('practice')}
            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'practice'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.practice}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('quests')}
            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'quests'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{t.quests}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('leaderboard')}
            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'leaderboard'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t.rankings}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('settings')}
            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              mobileTab === 'settings'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.themes}</span>
          </button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 shrink-0 mx-0.5" />
          <button
            type="button"
            onClick={() => {
              setIdeaZoneSeedNote(undefined);
              setIsIdeaZoneOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/30"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.ideaZone || 'IdeaZone'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCodeZoneSnippet(undefined);
              setIsCodeZoneOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.codeZone || 'CodeZone'}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenMessaging}
            className="flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/30"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Chat</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setArenaInitialChallenge(null);
              setIsArenaOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 border border-purple-500/30"
          >
            <Swords className="w-3.5 h-3.5 text-purple-500" />
            <span>Arena</span>
          </button>
          <button
            type="button"
            onClick={() => setIsQuestionBankOpen(true)}
            className="flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 border border-sky-500/30"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>Bank</span>
          </button>
        </div>

        {/* 3-Column Balanced Desktop Layout: Left Nav + Centered Lessons + Right Stats */}
        <div className="w-full flex justify-center items-start gap-4 lg:gap-6 xl:gap-8 px-2 sm:px-4">
          {/* Left Navigation Sidebar (Desktop Only - balances page so lessons are dead center!) */}
          <div className="hidden xl:block w-64 shrink-0 sticky top-20">
            <LeftSidebar
              onOpenPractice={() => setIsPracticeOpen(true)}
              onOpenPlacement={() => setIsPlacementOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenIdeaZone={() => {
                setIdeaZoneSeedNote(undefined);
                setIsIdeaZoneOpen(true);
              }}
              onOpenCodeZone={() => {
                setCodeZoneSnippet(undefined);
                setIsCodeZoneOpen(true);
              }}
              onOpenMessaging={handleOpenMessaging}
              onOpenArena={() => {
                setArenaInitialChallenge(null);
                setIsArenaOpen(true);
              }}
              onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
            />
          </div>

          {/* Learning Path (The Winding Map - CENTRALLY ALIGNED) */}
          <div
            className={`flex-1 flex flex-col items-center max-w-xl w-full mx-auto ${
              mobileTab !== 'learn' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <WindingPath
              courseId={state.activeCourseId}
              onSelectNode={node => setActiveLessonNode(node)}
            />
          </div>

          {/* Right Sidebar (Quests, Leaderboards, Weak areas, Settings) */}
          <div
            className={`shrink-0 w-full lg:w-80 ${
              mobileTab === 'learn' ? 'hidden lg:block' : 'block w-full max-w-lg mx-auto'
            }`}
          >
            <RightSidebar
              onOpenPractice={() => setIsPracticeOpen(true)}
              onOpenPlacement={() => setIsPlacementOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenIdeaZone={() => {
                setIdeaZoneSeedNote(undefined);
                setIsIdeaZoneOpen(true);
              }}
              onOpenCodeZone={() => {
                setCodeZoneSnippet(undefined);
                setIsCodeZoneOpen(true);
              }}
              onOpenAuth={(tab = 'register') => {
                setAuthInitialTab(tab);
                setIsAuthOpen(true);
              }}
              onOpenMessaging={handleOpenMessaging}
              onOpenArena={() => {
                setArenaInitialChallenge(null);
                setIsArenaOpen(true);
              }}
              onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
              filter={mobileTab === 'learn' ? 'all' : mobileTab}
            />
          </div>
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
          key={activeLessonNode.id}
          node={activeLessonNode}
          onClose={() => {
            stopConfetti();
            setActiveLessonNode(null);
          }}
          onNextLesson={(nextNode) => {
            stopConfetti();
            setActiveLessonNode(nextNode);
          }}
          onOpenPractice={() => {
            stopConfetti();
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

      {/* IdeaZone Note Pad & Idea Vault Modal */}
      {isIdeaZoneOpen && (
        <IdeaZoneModal
          seedNote={ideaZoneSeedNote}
          onClose={() => {
            setIsIdeaZoneOpen(false);
            setIdeaZoneSeedNote(undefined);
          }}
          onOpenCodeZone={(snippet, lang) => {
            setIsIdeaZoneOpen(false);
            if (snippet) {
              setCodeZoneSnippet({ code: snippet, language: lang || 'c' });
            } else {
              setCodeZoneSnippet(undefined);
            }
            setIsCodeZoneOpen(true);
          }}
        />
      )}

      {/* CodeZone Live Interactive Coding Environment Modal */}
      {isCodeZoneOpen && (
        <CodeZoneModal
          initialCode={codeZoneSnippet?.code}
          initialLanguage={codeZoneSnippet?.language}
          onClose={() => {
            setIsCodeZoneOpen(false);
            setCodeZoneSnippet(undefined);
          }}
          onSaveToIdeaZone={(code, language) => {
            setIsCodeZoneOpen(false);
            setIdeaZoneSeedNote({
              title: `Snippet (${language.toUpperCase()}) - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              content: 'Saved directly from CodeZone playground.',
              codeSnippet: code,
              codeLanguage: language
            });
            setIsIdeaZoneOpen(true);
          }}
        />
      )}

      {/* Supabase User Account, Cloud Sync & Student .EDU Perks Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthOpen(false)}
        onOpenMessaging={() => setIsMessagingOpen(true)}
      />

      {/* In-App Community Messaging & Code Share Modal */}
      <MessagingModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        onOpenAuth={(tab) => {
          setIsMessagingOpen(false);
          setAuthInitialTab(tab || 'login');
          setIsAuthOpen(true);
        }}
        onOpenCodeZone={(snippet, lang) => {
          if (snippet) {
            setCodeZoneSnippet({ code: snippet, language: lang || 'cpp' });
          } else {
            setCodeZoneSnippet(undefined);
          }
          setIsCodeZoneOpen(true);
        }}
      />

      {/* Coding Arena Live Duels Modal */}
      <CodingArenaModal
        isOpen={isArenaOpen}
        initialChallenge={arenaInitialChallenge}
        onClose={() => {
          setIsArenaOpen(false);
          setArenaInitialChallenge(null);
        }}
        onOpenQuestionBank={() => {
          setIsArenaOpen(false);
          setIsQuestionBankOpen(true);
        }}
      />

      {/* Question Bank Explorer & Community Authoring Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        onSelectForArena={(challenge) => {
          setIsQuestionBankOpen(false);
          setArenaInitialChallenge(challenge);
          setIsArenaOpen(true);
        }}
        onOpenCodeZone={(starterCode, language) => {
          setIsQuestionBankOpen(false);
          setCodeZoneSnippet({ code: starterCode, language });
          setIsCodeZoneOpen(true);
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  const isStandaloneCodeZone =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'codezone';

  if (isStandaloneCodeZone) {
    const initialCode =
      localStorage.getItem('bytesized_standalone_codezone_code') ||
      localStorage.getItem('coderbhai_standalone_codezone_code') ||
      undefined;
    const initialLanguage =
      (localStorage.getItem('bytesized_standalone_codezone_lang') as CodeLanguage) ||
      (localStorage.getItem('coderbhai_standalone_codezone_lang') as CodeLanguage) ||
      'c';

    return (
      <ErrorBoundary>
        <GameProvider>
          <div className="w-screen h-screen overflow-hidden bg-[#0B0F19]">
            <CodeZoneModal
              isStandalone={true}
              initialCode={initialCode}
              initialLanguage={initialLanguage}
              onClose={() => {
                window.location.href = window.location.origin + window.location.pathname;
              }}
            />
          </div>
        </GameProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GameProvider>
        <MainApp />
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;
