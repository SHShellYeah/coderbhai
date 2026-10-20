import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { useTranslation } from './data/translations';
import { sound } from './utils/audio';
import { LessonNode, CodeLanguage, FriendProfile } from './types';
import { TopBar } from './components/navigation/TopBar';
import { WindingPath } from './components/path/WindingPath';
import { LeftSidebar } from './components/sidebar/LeftSidebar';
import { RightSidebar } from './components/sidebar/RightSidebar';
import { LessonModal } from './components/lesson/LessonModal';
import { PracticeModal } from './components/practice/PracticeModal';
import { ByteOnboardingModal } from './components/onboarding/ByteOnboardingModal';
import { ThemeCustomizerModal } from './components/settings/ThemeCustomizerModal';
import { IdeaZoneModal } from './components/ideazone/IdeaZoneModal';
import { CodeZoneModal } from './components/codezone/CodeZoneModal';
import { AuthModal } from './components/auth/AuthModal';
import { MessagingModal } from './components/chat/MessagingModal';
import { CodingArenaModal } from './components/arena/CodingArenaModal';
import { QuestionBankModal } from './components/arena/QuestionBankModal';
import { DsaRoadmapModal } from './components/dsa/DsaRoadmapModal';
import { SpeedTrainingModal } from './components/speed-training/SpeedTrainingModal';
import { DsaProgressProvider, useDsaProgress } from './context/DsaProgressContext';
import { DsaRoadmapId, DsaProblemSpec } from './types/dsa';
import { getDsaProblemSpec } from './data/dsaProblemSpecs';
import { stopConfetti } from './utils/confetti';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Map, Trophy, Target, RotateCcw, Settings, Lightbulb, Terminal, MessageSquare, Swords, BookOpen, Brain, Zap, User, Crown, Compass } from 'lucide-react';
import { ArenaChallenge } from './types';
import { BottomNavBar, BottomNavTab } from './components/navigation/BottomNavBar';
import { MoreDrawerModal } from './components/navigation/MoreDrawerModal';
import { FriendRequestNotificationToast } from './components/common/FriendRequestNotificationToast';
import { UserProfileInspectModal } from './components/profile/UserProfileInspectModal';

const MainApp: React.FC = () => {
  const { state } = useGame();
  const { setProblemStatus } = useDsaProgress();
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
  const [isSpeedTrainingOpen, setIsSpeedTrainingOpen] = useState<boolean>(false);
  const [speedTrainingInitialProblemId, setSpeedTrainingInitialProblemId] = useState<string | undefined>(undefined);
  const [speedTrainingInitialTab, setSpeedTrainingInitialTab] = useState<'hub' | 'timed-training'>('hub');
  const [arenaInitialChallenge, setArenaInitialChallenge] = useState<ArenaChallenge | null>(null);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register' | 'forgot' | 'update-password'>('register');
  const [inspectedUser, setInspectedUser] = useState<FriendProfile | null>(null);

  // Check for password recovery link in URL params or hash and auto-launch AuthModal in update-password mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setAuthInitialTab('update-password');
        setIsAuthOpen(true);
      }
    }
  }, []);
  const [codeZoneSnippet, setCodeZoneSnippet] = useState<{ code: string; language: CodeLanguage } | undefined>();
  const [codeZoneProblem, setCodeZoneProblem] = useState<DsaProblemSpec | null>(null);
  const [dsaReturnRoadmap, setDsaReturnRoadmap] = useState<DsaRoadmapId | null>(null);
  const [activeDsaRoadmap, setActiveDsaRoadmap] = useState<DsaRoadmapId | null>(null);
  const [ideaZoneSeedNote, setIdeaZoneSeedNote] = useState<{
    title: string;
    content: string;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
  } | undefined>();
  const [mobileTab, setMobileTab] = useState<'learn' | 'practice' | 'quests' | 'leaderboard' | 'settings'>('learn');
  const [bottomTab, setBottomTab] = useState<BottomNavTab>('learn');
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState<boolean>(false);

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

  const handleBottomTabSelect = (tab: BottomNavTab) => {
    setBottomTab(tab);
    if (tab === 'learn') {
      setMobileTab('learn');
    } else if (tab === 'quests') {
      setMobileTab('quests');
    } else if (tab === 'speed' || tab === 'practice') {
      setSpeedTrainingInitialProblemId(undefined);
      setSpeedTrainingInitialTab('hub');
      setIsSpeedTrainingOpen(true);
    } else if (tab === 'chat') {
      handleOpenMessaging();
    } else if (tab === 'arena') {
      setArenaInitialChallenge(null);
      setIsArenaOpen(true);
    } else if (tab === 'more') {
      setIsMoreDrawerOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#131F24] text-slate-900 dark:text-white transition-colors w-full max-w-full overflow-x-hidden">
      {/* Top Stats & Course Bar - Ultra-clean Duolingo Stats */}
      <TopBar
        onOpenPractice={() => setIsPracticeOpen(true)}
        onOpenPlacement={() => setIsPlacementOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={(tab = 'register') => {
          setAuthInitialTab(tab);
          setIsAuthOpen(true);
        }}
        onInspectProfile={(user) => setInspectedUser(user)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row justify-center pb-24 lg:pb-8">

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
              onOpenSpeedTraining={() => {
                setSpeedTrainingInitialProblemId(undefined);
                setSpeedTrainingInitialTab('hub');
                setIsSpeedTrainingOpen(true);
              }}
              onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
              onOpenRoadmap={(roadmapId) => setActiveDsaRoadmap(roadmapId)}
              onOpenAuth={(tab = 'register') => {
                setAuthInitialTab(tab);
                setIsAuthOpen(true);
              }}
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
              onOpenSpeedTraining={(tab) => {
                setSpeedTrainingInitialProblemId(undefined);
                setSpeedTrainingInitialTab(tab || 'hub');
                setIsSpeedTrainingOpen(true);
              }}
              onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
              onOpenRoadmap={(roadmapId) => setActiveDsaRoadmap(roadmapId)}
              onInspectProfile={(user) => setInspectedUser(user)}
              filter={mobileTab === 'learn' ? 'all' : mobileTab}
            />
          </div>
        </div>
      </div>

      {/* Duolingo Mobile Bottom Navigation Bar matching screenshot */}
      <BottomNavBar
        activeTab={bottomTab}
        onSelectTab={handleBottomTabSelect}
      />

      {/* Mobile More Drawer */}
      <MoreDrawerModal
        isOpen={isMoreDrawerOpen}
        onClose={() => setIsMoreDrawerOpen(false)}
        onOpenAuth={(tab) => {
          setAuthInitialTab(tab || 'login');
          setIsAuthOpen(true);
        }}
        onOpenPlacement={() => setIsPlacementOpen(true)}
        onOpenIdeaZone={() => {
          setIdeaZoneSeedNote(undefined);
          setIsIdeaZoneOpen(true);
        }}
        onOpenCodeZone={() => {
          setCodeZoneSnippet(undefined);
          setCodeZoneProblem(null);
          setIsCodeZoneOpen(true);
        }}
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSpeedTraining={(tab) => {
          setSpeedTrainingInitialProblemId(undefined);
          setSpeedTrainingInitialTab(tab || 'hub');
          setIsSpeedTrainingOpen(true);
        }}
        onOpenPractice={() => setIsPracticeOpen(true)}
      />

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
        <PracticeModal
          onClose={() => setIsPracticeOpen(false)}
          onOpenSpeedTraining={() => {
            setIsPracticeOpen(false);
            setSpeedTrainingInitialProblemId(undefined);
            setSpeedTrainingInitialTab('hub');
            setIsSpeedTrainingOpen(true);
          }}
        />
      )}

      {/* Byte Guided Onboarding & Custom Course Plan Modal */}
      {isPlacementOpen && (
        <ByteOnboardingModal
          initialCourseId={state.activeCourseId}
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
          problem={codeZoneProblem}
          onClose={() => {
            setIsCodeZoneOpen(false);
            setCodeZoneSnippet(undefined);
            setCodeZoneProblem(null);
          }}
          onBackToRoadmap={() => {
            setIsCodeZoneOpen(false);
            setCodeZoneSnippet(undefined);
            setCodeZoneProblem(null);
            if (dsaReturnRoadmap) {
              setActiveDsaRoadmap(dsaReturnRoadmap);
            }
          }}
          onProblemSolved={(problemId) => {
            setProblemStatus(problemId, 'solved');
          }}
          onProblemAttempted={(problemId) => {
            setProblemStatus(problemId, 'attempted');
          }}
          onSaveToIdeaZone={(code, language) => {
            setIsCodeZoneOpen(false);
            setCodeZoneSnippet(undefined);
            setCodeZoneProblem(null);
            setIdeaZoneSeedNote({
              title: `Snippet (${language.toUpperCase()}) - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              content: codeZoneProblem
                ? `Solution for ${codeZoneProblem.title} (${codeZoneProblem.category})`
                : 'Saved directly from CodeZone playground.',
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
        onInspectProfile={(user) => setInspectedUser(user)}
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

      {/* Unified Speed Training Hub Modal (Timed PBs, DSA Roadmaps & Question Bank) */}
      <SpeedTrainingModal
        isOpen={isSpeedTrainingOpen}
        initialTab={speedTrainingInitialTab}
        initialProblemId={speedTrainingInitialProblemId}
        onClose={() => {
          setIsSpeedTrainingOpen(false);
          setSpeedTrainingInitialProblemId(undefined);
          setSpeedTrainingInitialTab('hub');
        }}
        onOpenBankPractice={() => {
          setIsSpeedTrainingOpen(false);
          setIsQuestionBankOpen(true);
        }}
        onOpenDsaRoadmap={(roadmapId) => {
          setIsSpeedTrainingOpen(false);
          setActiveDsaRoadmap(roadmapId);
        }}
        onOpenInCodeZone={(problem, roadmapId) => {
          const spec = getDsaProblemSpec(problem.id, roadmapId);
          setCodeZoneProblem(spec);
          setDsaReturnRoadmap(roadmapId);
          setIsSpeedTrainingOpen(false);
          setIsCodeZoneOpen(true);
        }}
        onOpenArena={() => {
          setIsSpeedTrainingOpen(false);
          setArenaInitialChallenge(null);
          setIsArenaOpen(true);
        }}
      />

      {/* Question Bank Explorer & Community Authoring Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        onBackToSpeedTraining={() => {
          setIsQuestionBankOpen(false);
          setIsSpeedTrainingOpen(true);
        }}
        onSelectForArena={(challenge) => {
          setIsQuestionBankOpen(false);
          setArenaInitialChallenge(challenge);
          setIsArenaOpen(true);
        }}
        onSelectForTraining={(challenge) => {
          setIsQuestionBankOpen(false);
          setSpeedTrainingInitialProblemId(challenge.id);
          setSpeedTrainingInitialTab('timed-training');
          setIsSpeedTrainingOpen(true);
        }}
        onOpenCodeZone={(starterCode, language) => {
          setIsQuestionBankOpen(false);
          setCodeZoneSnippet({ code: starterCode, language });
          setIsCodeZoneOpen(true);
        }}
      />

      {/* DSA Roadmaps Explorer Modal (Blind 75 & NeetCode 150) */}
      {activeDsaRoadmap && (
        <DsaRoadmapModal
          isOpen={true}
          initialRoadmapId={activeDsaRoadmap}
          onClose={() => setActiveDsaRoadmap(null)}
          onBackToSpeedTraining={() => {
            setActiveDsaRoadmap(null);
            setIsSpeedTrainingOpen(true);
          }}
          onOpenInCodeZone={(problem, roadmapId) => {
            const spec = getDsaProblemSpec(problem.id, roadmapId);
            setCodeZoneProblem(spec);
            setDsaReturnRoadmap(roadmapId);
            setActiveDsaRoadmap(null);
            setIsCodeZoneOpen(true);
          }}
        />
      )}

      {/* Global Incoming Friend Request Notification Toast with Sound & Accept/Delete */}
      <FriendRequestNotificationToast
        onInspectProfile={(user) => setInspectedUser(user)}
        onFriendAccepted={(friend) => setInspectedUser(friend)}
      />

      {/* Global User Profile Inspection Modal */}
      {inspectedUser && (
        <UserProfileInspectModal
          isOpen={!!inspectedUser}
          user={inspectedUser}
          onClose={() => setInspectedUser(null)}
          onStartDM={(target) => {
            setInspectedUser(null);
            setIsMessagingOpen(true);
          }}
        />
      )}
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
          <DsaProgressProvider>
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
          </DsaProgressProvider>
        </GameProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GameProvider>
        <DsaProgressProvider>
          <MainApp />
        </DsaProgressProvider>
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;
