import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  DsaProblemStatus,
  DsaProgressState,
  DsaRoadmapId,
  RoadmapProgressSummary,
  TopicProgressSummary
} from '../types/dsa';
import { DSA_ROADMAPS, BLIND_75_ROADMAP, NEETCODE_150_ROADMAP } from '../data/dsaRoadmaps';
import { useGame } from './GameContext';
import { supabase } from '../lib/supabaseClient';

export const STORAGE_KEY_DSA_PROGRESS = 'bytesized_dsa_progress_v1';

export interface DsaProgressContextType {
  progress: DsaProgressState;
  setProblemStatus: (problemId: string, status: DsaProblemStatus) => void;
  resetProblemStatus: (problemId: string) => void;
  resetAllProgress: () => void;
  getProblemStatus: (problemId: string) => DsaProblemStatus;
  getRoadmapProgress: (roadmapId: DsaRoadmapId) => RoadmapProgressSummary;
  isSyncing: boolean;
  syncError: string | null;
}

/**
 * Calculates integer percentage rounding consistently.
 * Returns 0 if total is 0.
 */
export function calculateIntegerPercentage(solved: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.round((solved / total) * 100);
}

/**
 * Pure function to compute full roadmap and topic progress summaries.
 * Only 'solved' contributes to completion percentage.
 */
export function computeRoadmapProgress(
  roadmapId: DsaRoadmapId,
  userProgress: DsaProgressState
): RoadmapProgressSummary {
  const roadmap = DSA_ROADMAPS[roadmapId] || BLIND_75_ROADMAP;
  let solvedCount = 0;
  let attemptedCount = 0;
  let notStartedCount = 0;

  const topicMap: Record<string, { total: number; solved: number; attempted: number; notStarted: number }> = {};

  // Initialize all official categories
  roadmap.categories.forEach((cat) => {
    topicMap[cat] = { total: 0, solved: 0, attempted: 0, notStarted: 0 };
  });

  // Evaluate each problem in the roadmap once (no double counting)
  for (const prob of roadmap.problems) {
    const status: DsaProblemStatus = userProgress[prob.id] || 'not-started';
    const cat = prob.category;

    if (!topicMap[cat]) {
      topicMap[cat] = { total: 0, solved: 0, attempted: 0, notStarted: 0 };
    }
    topicMap[cat].total += 1;

    if (status === 'solved') {
      solvedCount += 1;
      topicMap[cat].solved += 1;
    } else if (status === 'attempted') {
      attemptedCount += 1;
      topicMap[cat].attempted += 1;
    } else {
      notStartedCount += 1;
      topicMap[cat].notStarted += 1;
    }
  }

  const topicSummaries: Record<string, TopicProgressSummary> = {};
  for (const [cat, counts] of Object.entries(topicMap)) {
    topicSummaries[cat] = {
      category: cat,
      total: counts.total,
      solved: counts.solved,
      attempted: counts.attempted,
      notStarted: counts.notStarted,
      percentage: calculateIntegerPercentage(counts.solved, counts.total),
    };
  }

  const overallPercentage = calculateIntegerPercentage(solvedCount, roadmap.totalCount);

  return {
    roadmapId,
    total: roadmap.totalCount,
    solved: solvedCount,
    attempted: attemptedCount,
    notStarted: notStartedCount,
    percentage: overallPercentage,
    topicSummaries,
  };
}

/**
 * Parses and validates stored DSA progress safely.
 * Handles null, malformed JSON, legacy formats, and ignores invalid statuses.
 */
export function parseStoredDsaProgress(raw: string | null): DsaProgressState {
  if (!raw || typeof raw !== 'string') return {};
  try {
    const parsed = JSON.parse(raw);
    const validProgress: DsaProgressState = {};

    // Support both versioned object { version: 1, progress: {...} } and raw map
    const sourceMap = parsed && typeof parsed === 'object' && parsed.progress && typeof parsed.progress === 'object'
      ? parsed.progress
      : parsed;

    if (sourceMap && typeof sourceMap === 'object') {
      for (const [key, val] of Object.entries(sourceMap)) {
        if (typeof key === 'string' && (val === 'solved' || val === 'attempted' || val === 'not-started')) {
          validProgress[key] = val;
        }
      }
    }
    return validProgress;
  } catch {
    return {};
  }
}

/**
 * Serializes DSA progress into a versioned JSON string.
 */
export function serializeDsaProgress(progress: DsaProgressState): string {
  return JSON.stringify({
    version: 1,
    updatedAt: new Date().toISOString(),
    progress,
  });
}

const DsaProgressContext = createContext<DsaProgressContextType | undefined>(undefined);

export const DsaProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useGame();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Initialize progress from localStorage
  const [progress, setProgress] = useState<DsaProgressState>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DSA_PROGRESS);
      return parseStoredDsaProgress(stored);
    } catch {
      return {};
    }
  });

  // Load cloud progress when user authenticates
  useEffect(() => {
    if (!state.authUser?.id) return;

    let isMounted = true;
    const loadCloudProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('course_progress')
          .eq('id', state.authUser!.id)
          .maybeSingle();

        if (!error && data?.course_progress?.dsaRoadmaps && isMounted) {
          const cloudProgress = data.course_progress.dsaRoadmaps;
          if (cloudProgress && typeof cloudProgress === 'object') {
            setProgress((prev) => {
              // Merge local + cloud (preserving any newly set statuses)
              const merged: DsaProgressState = { ...cloudProgress, ...prev };
              try {
                localStorage.setItem(STORAGE_KEY_DSA_PROGRESS, serializeDsaProgress(merged));
              } catch {
                // ignore
              }
              return merged;
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Could not fetch cloud DSA progress, staying with local cache:', err);
        }
      }
    };

    loadCloudProgress();
    return () => {
      isMounted = false;
    };
  }, [state.authUser?.id]);

  // Persist to localStorage immediately on any change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_DSA_PROGRESS, serializeDsaProgress(progress));
    } catch (e) {
      console.warn('Failed to save DSA progress to localStorage:', e);
    }
  }, [progress]);

  // Debounced cloud sync to Supabase when user is authenticated
  useEffect(() => {
    if (!state.authUser?.id) return;

    const timer = setTimeout(async () => {
      setIsSyncing(true);
      setSyncError(null);
      try {
        // Fetch existing course_progress to preserve course track progression
        const { data: profile } = await supabase
          .from('profiles')
          .select('course_progress')
          .eq('id', state.authUser!.id)
          .maybeSingle();

        const currentProg = profile?.course_progress || {};
        const updatedCourseProgress = {
          ...currentProg,
          dsaRoadmaps: progress,
        };

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            course_progress: updatedCourseProgress,
            updated_at: new Date().toISOString(),
          })
          .eq('id', state.authUser!.id);

        if (updateError) {
          setSyncError(updateError.message);
        }
      } catch (err) {
        setSyncError((err as Error).message || 'Cloud sync failed');
      } finally {
        setIsSyncing(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [progress, state.authUser?.id]);

  const setProblemStatus = useCallback((problemId: string, status: DsaProblemStatus) => {
    if (!problemId) return;
    setProgress((prev) => {
      if (status === 'not-started') {
        const next = { ...prev };
        delete next[problemId];
        return next;
      }
      return {
        ...prev,
        [problemId]: status,
      };
    });
  }, []);

  const resetProblemStatus = useCallback((problemId: string) => {
    if (!problemId) return;
    setProgress((prev) => {
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress({});
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_DSA_PROGRESS);
      } catch {
        // ignore
      }
    }
  }, []);

  const getProblemStatus = useCallback(
    (problemId: string): DsaProblemStatus => {
      return progress[problemId] || 'not-started';
    },
    [progress]
  );

  const getRoadmapProgress = useCallback(
    (roadmapId: DsaRoadmapId): RoadmapProgressSummary => {
      return computeRoadmapProgress(roadmapId, progress);
    },
    [progress]
  );

  const contextValue = useMemo(
    () => ({
      progress,
      setProblemStatus,
      resetProblemStatus,
      resetAllProgress,
      getProblemStatus,
      getRoadmapProgress,
      isSyncing,
      syncError,
    }),
    [
      progress,
      setProblemStatus,
      resetProblemStatus,
      resetAllProgress,
      getProblemStatus,
      getRoadmapProgress,
      isSyncing,
      syncError,
    ]
  );

  return <DsaProgressContext.Provider value={contextValue}>{children}</DsaProgressContext.Provider>;
};

export const useDsaProgress = (): DsaProgressContextType => {
  const ctx = useContext(DsaProgressContext);
  if (!ctx) {
    return {
      progress: {},
      setProblemStatus: () => {},
      resetProblemStatus: () => {},
      resetAllProgress: () => {},
      getProblemStatus: () => 'not-started',
      getRoadmapProgress: (id) => computeRoadmapProgress(id, {}),
      isSyncing: false,
      syncError: null,
    };
  }
  return ctx;
};
