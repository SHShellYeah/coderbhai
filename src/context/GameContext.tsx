import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CourseId, CourseProgress, Question, Quest, UserState, Language, AuthUser, UserRole } from '../types';
import { COURSES } from '../data/courses';
import { sound } from '../utils/audio';
import { supabase, isEduEmail } from '../lib/supabase';
import { loginUser, registerUser, logoutUser, fetchUserProfile, saveUserProfile } from '../services/authService';

const STORAGE_KEY = 'bytesized_user_v1';
const LEGACY_STORAGE_KEYS = ['coderbhai_user_v1', 'codelingo_user_v1'];

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
  unlimitedHeartsUntil: null,
  authUser: null,
  mistakes: [],
  soundEnabled: true,
  soundPack: 'duolingo',
  themeColor: 'midnight',
  darkMode: false,
  language: 'en',
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
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  completePlacementTest: (courseId: CourseId, score: number) => void;
  startScratch: (courseId: CourseId) => void;
  resetProgress: () => void;
  addGems: (amount: number) => void;
  addXp: (amount: number) => void;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  register: (email: string, password: string, displayName?: string, role?: UserRole) => Promise<{ success: boolean; isEduBonus?: boolean; error?: string }>;
  logout: () => Promise<void>;
  syncCloudProgress: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserState>(() => {
    try {
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        for (const legacyKey of LEGACY_STORAGE_KEYS) {
          const oldVal = localStorage.getItem(legacyKey);
          if (oldVal) {
            stored = oldVal;
            break;
          }
        }
      }
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize old duolingo emerald theme to fresh midnight theme
        const themeColor = parsed.themeColor === 'emerald' ? 'midnight' : (parsed.themeColor || 'midnight');
        const language = parsed.language === 'bn' ? 'bn' : 'en';
        return {
          ...DEFAULT_USER_STATE,
          ...parsed,
          themeColor,
          language,
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

  // Sync theme attribute to documentElement
  useEffect(() => {
    const theme = state.themeColor || 'midnight';
    document.documentElement.setAttribute('data-theme', theme);
  }, [state.themeColor]);

  // Sync dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Sync document language attribute
  useEffect(() => {
    document.documentElement.setAttribute('lang', state.language || 'en');
  }, [state.language]);

  // Sync sound muted
  useEffect(() => {
    sound.setMuted(!state.soundEnabled);
  }, [state.soundEnabled]);

  // Listen to Supabase Auth State Changes & load initial session
  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const isEdu = isEduEmail(u.email || '');
        const authUser: AuthUser = {
          id: u.id,
          email: u.email || '',
          displayName: u.user_metadata?.display_name || u.email?.split('@')[0],
          avatarUrl: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.id)}`,
          isEduUser: isEdu,
        };
        setState(prev => ({ ...prev, authUser }));
        // Load cloud profile
        fetchUserProfile(u.id).then(profile => {
          if (profile) {
            setState(prev => ({
              ...prev,
              xp: Math.max(prev.xp, profile.xp),
              gems: Math.max(prev.gems, profile.gems),
              streak: Math.max(prev.streak, profile.streak),
              unlimitedHeartsUntil: profile.unlimitedHeartsUntil || prev.unlimitedHeartsUntil,
              courseProgress: {
                ...prev.courseProgress,
                ...profile.courseProgress,
              },
            }));
          }
        });
      }
    });

    // 2. Auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user;
        const isEdu = isEduEmail(u.email || '');
        const authUser: AuthUser = {
          id: u.id,
          email: u.email || '',
          displayName: u.user_metadata?.display_name || u.email?.split('@')[0],
          avatarUrl: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.id)}`,
          isEduUser: isEdu,
        };
        setState(prev => ({ ...prev, authUser }));
        const profile = await fetchUserProfile(u.id);
        if (profile) {
          setState(prev => ({
            ...prev,
            xp: Math.max(prev.xp, profile.xp),
            gems: Math.max(prev.gems, profile.gems),
            streak: Math.max(prev.streak, profile.streak),
            unlimitedHeartsUntil: profile.unlimitedHeartsUntil || prev.unlimitedHeartsUntil,
            courseProgress: {
              ...prev.courseProgress,
              ...profile.courseProgress,
            },
          }));
        }
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...prev, authUser: null }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync to cloud when state changes and user is authenticated (debounced 1.5s)
  useEffect(() => {
    if (!state.authUser?.id) return;
    const timer = setTimeout(() => {
      saveUserProfile(state.authUser!.id, {
        xp: state.xp,
        gems: state.gems,
        streak: state.streak,
        isEduUser: !!state.authUser!.isEduUser,
        unlimitedHeartsUntil: state.unlimitedHeartsUntil,
        courseProgress: state.courseProgress,
        settings: {
          themeColor: state.themeColor,
          darkMode: state.darkMode,
          language: state.language,
          soundEnabled: state.soundEnabled,
        },
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [state.xp, state.gems, state.streak, state.courseProgress, state.unlimitedHeartsUntil, state.authUser]);

  const setActiveCourse = (courseId: CourseId) => {
    sound.playClick();
    setState(prev => ({ ...prev, activeCourseId: courseId }));
  };

  const deductHeart = (): boolean => {
    let stillAlive = true;
    setState(prev => {
      // Admin has permanent unlimited hearts
      if (prev.role === 'admin' || prev.authUser?.role === 'admin') {
        return prev;
      }
      // Unlimited hearts perk active (e.g. from .edu accounts)
      if (prev.unlimitedHeartsUntil && Date.now() < prev.unlimitedHeartsUntil) {
        return prev;
      }
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
      const isAdmin = prev.role === 'admin' || prev.authUser?.role === 'admin';
      if (type === 'gems') {
        if (!isAdmin && prev.gems < 50) {
          success = false;
          return prev;
        }
        return {
          ...prev,
          gems: isAdmin ? 999999 : prev.gems - 50,
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
      // Find course containing this node or activeCourse
      const activeCourse =
        Object.values(COURSES).find(c =>
          c.units.some(u => u.nodes.some(n => n.id === nodeId))
        ) || COURSES[prev.activeCourseId] || COURSES.c;
      const courseId = activeCourse.id;

      const currentProg = prev.courseProgress[courseId] || {
        completedNodeIds: [],
        currentNodeId: activeCourse.units[0]?.nodes[0]?.id || '',
        placementTaken: false,
        unlockedUnitCount: 1,
      };

      const completedSet = new Set(currentProg.completedNodeIds);
      completedSet.add(nodeId);

      // Find next node in course
      let nextNodeId = currentProg.currentNodeId;
      let unlockedUnits = currentProg.unlockedUnitCount;

      const allNodesInCourse = activeCourse.units.flatMap(u => u.nodes);
      const completedNodeIndex = allNodesInCourse.findIndex(n => n.id === nodeId);
      const currentProgNodeIndex = allNodesInCourse.findIndex(n => n.id === currentProg.currentNodeId);

      if (completedNodeIndex !== -1 && completedNodeIndex + 1 < allNodesInCourse.length) {
        // Only advance currentNodeId if completed node was at or ahead of current progress
        if (completedNodeIndex >= currentProgNodeIndex) {
          nextNodeId = allNodesInCourse[completedNodeIndex + 1].id;
        }
        const nextUnitId = allNodesInCourse[completedNodeIndex + 1].unitId;
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
          [courseId]: {
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

  const setLanguage = (lang: Language) => {
    sound.playClick();
    setState(prev => ({ ...prev, language: lang }));
  };

  const toggleLanguage = () => {
    sound.playClick();
    setState(prev => ({ ...prev, language: prev.language === 'en' ? 'bn' : 'en' }));
  };

  const resetProgress = () => {
    setState({
      ...DEFAULT_USER_STATE,
      courseProgress: DEFAULT_COURSE_PROGRESS,
      quests: INITIAL_QUESTS,
    });
  };

  const addGems = (amount: number) => {
    setState(prev => {
      const isAdmin = prev.role === 'admin' || prev.authUser?.role === 'admin';
      return { ...prev, gems: isAdmin ? 999999 : prev.gems + amount };
    });
  };

  const addXp = (amount: number) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const login = async (
    email: string,
    password: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    const res = await loginUser(email, password, requestedRole);
    if (res.error) {
      return { success: false, error: res.error };
    }
    if (res.user) {
      const userRole = res.user.role || requestedRole || 'user';
      const isAdmin = userRole === 'admin';
      setState(prev => ({
        ...prev,
        authUser: res.user,
        role: userRole,
        gems: isAdmin ? 999999 : prev.gems,
        unlimitedHeartsUntil: isAdmin ? Number.MAX_SAFE_INTEGER : prev.unlimitedHeartsUntil,
      }));
      const profile = await fetchUserProfile(res.user.id);
      if (profile) {
        setState(prev => {
          const effectiveRole = profile.role || userRole;
          const isProfAdmin = effectiveRole === 'admin';
          return {
            ...prev,
            role: effectiveRole,
            xp: Math.max(prev.xp, profile.xp),
            gems: isProfAdmin ? 999999 : Math.max(prev.gems, profile.gems),
            streak: Math.max(prev.streak, profile.streak),
            unlimitedHeartsUntil: isProfAdmin ? Number.MAX_SAFE_INTEGER : (profile.unlimitedHeartsUntil || prev.unlimitedHeartsUntil),
            courseProgress: {
              ...prev.courseProgress,
              ...profile.courseProgress,
            },
          };
        });
      }
    }
    return { success: true, user: res.user || undefined };
  };

  const register = async (
    email: string,
    password: string,
    displayName?: string,
    role: UserRole = 'user'
  ): Promise<{ success: boolean; isEduBonus?: boolean; error?: string }> => {
    const res = await registerUser(email, password, displayName, role);
    if (res.error) {
      return { success: false, error: res.error };
    }
    if (res.user) {
      const isAdmin = role === 'admin';
      const isEdu = !!res.isEduBonusGranted && !isAdmin;
      const bonusGems = isAdmin ? 999999 : (isEdu ? 200 : 0);
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      const bonusHeartsUntil = isAdmin
        ? Number.MAX_SAFE_INTEGER
        : (isEdu ? Date.now() + threeDaysMs : null);

      setState(prev => ({
        ...prev,
        authUser: res.user,
        role,
        gems: isAdmin ? 999999 : prev.gems + bonusGems,
        unlimitedHeartsUntil: bonusHeartsUntil || prev.unlimitedHeartsUntil,
      }));

      // Immediately save cloud profile with current local progress + role perks
      await saveUserProfile(res.user.id, {
        email: res.user.email,
        displayName: res.user.displayName,
        role,
        xp: state.xp,
        gems: isAdmin ? 999999 : state.gems + bonusGems,
        streak: state.streak,
        isEduUser: isEdu,
        unlimitedHeartsUntil: bonusHeartsUntil,
        courseProgress: state.courseProgress,
        settings: {
          themeColor: state.themeColor,
          darkMode: state.darkMode,
          language: state.language,
          soundEnabled: state.soundEnabled,
        },
      });
    }
    return { success: true, isEduBonus: res.isEduBonusGranted };
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setState(prev => ({ ...prev, authUser: null }));
  };

  const syncCloudProgress = async (): Promise<void> => {
    if (!state.authUser?.id) return;
    await saveUserProfile(state.authUser.id, {
      xp: state.xp,
      gems: state.gems,
      streak: state.streak,
      isEduUser: !!state.authUser.isEduUser,
      unlimitedHeartsUntil: state.unlimitedHeartsUntil,
      courseProgress: state.courseProgress,
      settings: {
        themeColor: state.themeColor,
        darkMode: state.darkMode,
        language: state.language,
        soundEnabled: state.soundEnabled,
      },
    });
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
      setLanguage,
      toggleLanguage,
      completePlacementTest,
      startScratch,
      resetProgress,
      addGems,
      addXp,
      login,
      register,
      logout,
      syncCloudProgress,
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
