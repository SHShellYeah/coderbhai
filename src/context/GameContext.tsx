import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CourseId, CourseProgress, Question, Quest, UserState } from '../types';
import { COURSES } from '../data/courses';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'codelingo_user_v1';

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Earn 30 XP',
    icon: '⚡',
    progress: 0,
    target: 30,
    rewardXp: 15,
    rewardGems: 10,
    completed: false
  },
  {
    id: 'q2',
    title: 'Complete 2 Lessons',
    icon: '🎯',
    progress: 0,
    target: 2,
    rewardXp: 20,
    rewardGems: 15,
    completed: false
  },
  {
    id: 'q3',
    title: 'Perfect Lesson (100% Accuracy)',
    icon: '🌟',
    progress: 0,
    target: 1,
    rewardXp: 25,
    rewardGems: 20,
    completed: false
  }
];

const DEFAULT_COURSE_PROGRESS: Record<CourseId, CourseProgress> = {
  c: {
    completedNodeIds: [],
    currentNodeId: 'c-u1-n1',
    placementTaken: false,
    unlockedUnitCount: 1,
  },
  cpp: {
    completedNodeIds: [],
    currentNodeId: 'cpp-u1-n1',
    placementTaken: false,
    unlockedUnitCount: 1,
  },
  python: {
    completedNodeIds: [],
    currentNodeId: 'py-u1-n1',
    placementTaken: false,
    unlockedUnitCount: 1,
  },
  oop: {
    completedNodeIds: [],
    currentNodeId: 'oop-u1-n1',
    placementTaken: false,
    unlockedUnitCount: 1,
  },
  dsa: {
    completedNodeIds: [],
    currentNodeId: 'dsa-u1-n1',
    placementTaken: false,
    unlockedUnitCount: 1,
  },
  algorithms: {
    completedNodeIds: [],
    currentNodeId: 'algo-u1-n1',
    placementTaken: false,
    unlockedUnitCount: 1,
  },
};

const DEFAULT_USER_STATE: UserState = {
  activeCourseId: 'cpp',
  courseProgress: DEFAULT_COURSE_PROGRESS,
  streak: 3,
  lastActiveDate: new Date().toISOString(),
  gems: 120,
  xp: 180,
  hearts: 5,
  maxHearts: 5,
  mistakes: [],
  soundEnabled: true,
  soundPack: 'duolingo',
  themeColor: 'emerald',
  darkMode: false,
  quests: INITIAL_QUESTS,
};

interface GameContextType {
  state: UserState;
  setActiveCourse: (courseId: CourseId) => void;
  completeNodeLesson: (nodeId: string, earnedXp: number, earnedGems: number, accuracy: number) => void;
  deductHeart: () => boolean; // returns true if still alive (>0), false if 0
  refillHearts: (freeOrGems?: 'free' | 'gems') => boolean;
  addMistake: (question: Question) => void;
  resolveMistake: (questionId: string) => void;
  toggleSound: () => void;
  toggleDarkMode: () => void;
  setSoundPack: (pack: import('../types').SoundPack) => void;
  setThemeColor: (theme: import('../types').ThemeColor) => void;
  completePlacementTest: (courseId: CourseId, score: number) => void;
  startScratch: (courseId: CourseId) => void;
  resetProgress: () => void;
  addGems: (amount: number) => void;
  addXp: (amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_USER_STATE,
          ...parsed,
          courseProgress: {
            ...DEFAULT_COURSE_PROGRESS,
            ...(parsed.courseProgress || {}),
          },
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USER_STATE;
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  // Sync dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Sync sound muted
  useEffect(() => {
    sound.setMuted(!state.soundEnabled);
  }, [state.soundEnabled]);

  const setActiveCourse = (courseId: CourseId) => {
    sound.playClick();
    setState(prev => ({ ...prev, activeCourseId: courseId }));
  };

  const deductHeart = (): boolean => {
    let stillAlive = true;
    setState(prev => {
      const newHearts = Math.max(0, prev.hearts - 1);
      stillAlive = newHearts > 0;
      return {
        ...prev,
        hearts: newHearts,
      };
    });
    return stillAlive;
  };

  const refillHearts = (type: 'free' | 'gems' = 'free'): boolean => {
    let success = true;
    setState(prev => {
      if (type === 'gems') {
        if (prev.gems < 50) {
          success = false;
          return prev;
        }
        return {
          ...prev,
          gems: prev.gems - 50,
          hearts: prev.maxHearts,
        };
      }
      return {
        ...prev,
        hearts: prev.maxHearts,
      };
    });
    if (success) {
      sound.playSuccess();
    }
    return success;
  };

  const addMistake = (question: Question) => {
    setState(prev => {
      if (prev.mistakes.some(m => m.id === question.id)) return prev;
      return {
        ...prev,
        mistakes: [...prev.mistakes, question],
      };
    });
  };

  const resolveMistake = (questionId: string) => {
    setState(prev => ({
      ...prev,
      mistakes: prev.mistakes.filter(m => m.id !== questionId),
      hearts: Math.min(prev.maxHearts, prev.hearts + 1),
    }));
  };

  const completeNodeLesson = (
    nodeId: string,
    earnedXp: number,
    earnedGems: number,
    accuracy: number
  ) => {
    setState(prev => {
      const activeCourse = COURSES[prev.activeCourseId];
      const currentProg = prev.courseProgress[prev.activeCourseId];

      const completedSet = new Set(currentProg.completedNodeIds);
      completedSet.add(nodeId);

      // Find next node in course
      let nextNodeId = currentProg.currentNodeId;
      let unlockedUnits = currentProg.unlockedUnitCount;

      const allNodesInCourse = activeCourse.units.flatMap(u => u.nodes);
      const currentIndex = allNodesInCourse.findIndex(n => n.id === nodeId);

      if (currentIndex !== -1 && currentIndex + 1 < allNodesInCourse.length) {
        nextNodeId = allNodesInCourse[currentIndex + 1].id;
        const nextUnitId = allNodesInCourse[currentIndex + 1].unitId;
        const nextUnitIndex = activeCourse.units.findIndex(u => u.id === nextUnitId);
        if (nextUnitIndex + 1 > unlockedUnits) {
          unlockedUnits = nextUnitIndex + 1;
        }
      }

      // Quests progress update
      const updatedQuests = prev.quests.map(quest => {
        let addedProgress = 0;
        if (quest.id === 'q1') addedProgress = earnedXp;
        if (quest.id === 'q2') addedProgress = 1;
        if (quest.id === 'q3' && accuracy >= 100) addedProgress = 1;

        const newProg = Math.min(quest.target, quest.progress + addedProgress);
        return {
          ...quest,
          progress: newProg,
          completed: newProg >= quest.target,
        };
      });

      return {
        ...prev,
        xp: prev.xp + earnedXp,
        gems: prev.gems + earnedGems,
        courseProgress: {
          ...prev.courseProgress,
          [prev.activeCourseId]: {
            ...currentProg,
            completedNodeIds: Array.from(completedSet),
            currentNodeId: nextNodeId,
            unlockedUnitCount: Math.max(currentProg.unlockedUnitCount, unlockedUnits),
          },
        },
        quests: updatedQuests,
      };
    });
  };

  const completePlacementTest = (courseId: CourseId, score: number) => {
    const course = COURSES[courseId];
    setState(prev => {
      const prog = prev.courseProgress[courseId];
      let unlockedUnitCount = 1;
      let completedIds: string[] = [];
      let targetNodeId = course.units[0]?.nodes[0]?.id || '';

      if (score >= 4) {
        // Mastered basics: unlock Unit 1 and Unit 2
        unlockedUnitCount = Math.min(2, course.units.length);
        completedIds = course.units[0].nodes.map(n => n.id);
        targetNodeId = course.units[1]?.nodes[0]?.id || course.units[0].nodes[0].id;
      } else if (score >= 2) {
        // Some knowledge: completed first 2 nodes
        unlockedUnitCount = 1;
        completedIds = course.units[0].nodes.slice(0, 2).map(n => n.id);
        targetNodeId = course.units[0].nodes[2]?.id || course.units[0].nodes[0].id;
      }

      return {
        ...prev,
        xp: prev.xp + 40,
        gems: prev.gems + 25,
        courseProgress: {
          ...prev.courseProgress,
          [courseId]: {
            ...prog,
            placementTaken: true,
            unlockedUnitCount,
            completedNodeIds: completedIds,
            currentNodeId: targetNodeId,
          },
        },
      };
    });
  };

  const startScratch = (courseId: CourseId) => {
    const course = COURSES[courseId];
    setState(prev => ({
      ...prev,
      courseProgress: {
        ...prev.courseProgress,
        [courseId]: {
          ...prev.courseProgress[courseId],
          placementTaken: true,
          unlockedUnitCount: 1,
          completedNodeIds: [],
          currentNodeId: course.units[0]?.nodes[0]?.id || '',
        },
      },
    }));
  };

  const toggleSound = () => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setSoundPack = (pack: import('../types').SoundPack) => {
    setState(prev => ({ ...prev, soundPack: pack }));
  };

  const setThemeColor = (theme: import('../types').ThemeColor) => {
    setState(prev => ({ ...prev, themeColor: theme }));
  };

  const resetProgress = () => {
    setState({
      ...DEFAULT_USER_STATE,
      courseProgress: DEFAULT_COURSE_PROGRESS,
      quests: INITIAL_QUESTS,
    });
  };

  const addGems = (amount: number) => {
    setState(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const addXp = (amount: number) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const value = useMemo(
    () => ({
      state,
      setActiveCourse,
      completeNodeLesson,
      deductHeart,
      refillHearts,
      addMistake,
      resolveMistake,
      toggleSound,
      toggleDarkMode,
      setSoundPack,
      setThemeColor,
      completePlacementTest,
      startScratch,
      resetProgress,
      addGems,
      addXp,
    }),
    [state]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
