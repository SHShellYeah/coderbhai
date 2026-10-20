import { ArenaChallenge, CodeLanguage, PersonalBestRecord, ProblemSheet, TrainingStats } from '../types';
import { INITIAL_QUESTION_BANK } from '../data/questionBank';
import { NEETCODE_PROBLEMS } from '../data/neetcodeProblems';
import { getApprovedChallenges } from './arenaService';
import { normalizeError } from '../utils/codeRunner';

const STORAGE_KEY_PERSONAL_BESTS = 'bytesized_training_personal_bests';
const STORAGE_KEY_TRAINING_STATS = 'bytesized_training_stats';

/**
 * Combines all question sources (Question Bank, NeetCode 75, NeetCode 150, Community challenges)
 * with sheet and category metadata.
 */
export async function getAllTrainingProblems(): Promise<ArenaChallenge[]> {
  const map = new Map<string, ArenaChallenge>();

  // 1. Pre-seed Question Bank (tag with 'questionbank' and classic ones with neetcode75/150)
  INITIAL_QUESTION_BANK.forEach(q => {
    const sheets: ('neetcode75' | 'neetcode150' | 'questionbank')[] = ['questionbank'];
    if (['two-sum', 'valid-parentheses', 'max-subarray', 'binary-search'].includes(q.id)) {
      sheets.push('neetcode75', 'neetcode150');
    }
    map.set(q.id, { ...q, sheets });
  });

  // 2. Curated NeetCode 75 & 150 problems
  NEETCODE_PROBLEMS.forEach(nc => {
    map.set(nc.id, nc);
  });

  // 3. Approved Community Challenges
  try {
    const community = await getApprovedChallenges();
    community.forEach(c => {
      if (!map.has(c.id)) {
        map.set(c.id, { ...c, sheets: ['questionbank'] });
      }
    });
  } catch (err) {
    console.warn('Fallback loading community training challenges:', err);
  }

  return Array.from(map.values());
}

/**
 * Filter training problems by sheet roadmap, topic category, and search query.
 */
export async function getFilteredTrainingProblems(
  sheet: ProblemSheet = 'all',
  category: string = 'all',
  searchQuery: string = ''
): Promise<ArenaChallenge[]> {
  const all = await getAllTrainingProblems();

  return all.filter(p => {
    // Sheet match
    let sheetMatch = true;
    if (sheet === 'neetcode75') {
      sheetMatch = !!p.sheets?.includes('neetcode75');
    } else if (sheet === 'neetcode150') {
      sheetMatch = !!p.sheets?.includes('neetcode150');
    } else if (sheet === 'questionbank') {
      sheetMatch = !!p.sheets?.includes('questionbank') || !!p.isCommunity;
    }

    // Category match
    const catMatch = category === 'all' || p.category.toLowerCase() === category.toLowerCase();

    // Search query match
    const searchMatch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return sheetMatch && catMatch && searchMatch;
  });
}

/**
 * Retrieves all stored Personal Best records from local storage.
 */
export function getAllPersonalBests(): Record<string, PersonalBestRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERSONAL_BESTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Retrieves the user's personal best time for a specific challenge.
 */
export function getPersonalBest(problemId: string): PersonalBestRecord | null {
  const records = getAllPersonalBests();
  return records[problemId] || null;
}

export interface RecordTimeResult {
  isNewBest: boolean;
  previousBestSeconds: number | null;
  newBestSeconds: number;
  attemptsCount: number;
}

/**
 * Records a problem completion time. If it beats the previous lowest time, saves as new Personal Best!
 */
export function recordProblemTime(
  problemId: string,
  timeSeconds: number,
  language: CodeLanguage
): RecordTimeResult {
  if (
    typeof timeSeconds !== 'number' ||
    !Number.isFinite(timeSeconds) ||
    timeSeconds < 0
  ) {
    throw new Error(`Invalid timeSeconds for recordProblemTime: ${timeSeconds}`);
  }

  const safeTime = Math.max(1, Math.round(timeSeconds));
  const records = getAllPersonalBests();
  const existing = records[problemId];

  let isNewBest = false;
  let previousBestSeconds: number | null = null;
  let attempts = 1;

  if (!existing) {
    // First time solving this problem
    isNewBest = true;
    records[problemId] = {
      problemId,
      bestTimeSeconds: safeTime,
      achievedAt: new Date().toISOString(),
      attemptsCount: 1,
      language
    };
  } else {
    previousBestSeconds = existing.bestTimeSeconds;
    let prevAttempts: number;
    if (
      typeof existing.attemptsCount === 'number' &&
      Number.isFinite(existing.attemptsCount) &&
      existing.attemptsCount >= 0
    ) {
      prevAttempts = Math.floor(existing.attemptsCount);
    } else {
      prevAttempts = 1;
    }
    attempts = prevAttempts + 1;

    if (safeTime < existing.bestTimeSeconds) {
      // Beat previous personal best!
      isNewBest = true;
      records[problemId] = {
        problemId,
        bestTimeSeconds: safeTime,
        achievedAt: new Date().toISOString(),
        attemptsCount: attempts,
        language
      };
    } else {
      // Completed, but didn't beat PB
      isNewBest = false;
      records[problemId] = {
        ...existing,
        attemptsCount: attempts
      };
    }
  }

  // 1. Snapshot prior storage state for atomic rollback if writing fails
  const prevPbsRaw = localStorage.getItem(STORAGE_KEY_PERSONAL_BESTS);
  const prevStatsRaw = localStorage.getItem(STORAGE_KEY_TRAINING_STATS);

  // 2. Read baseline stats prior to modifications
  const currentStats = getTrainingStats();

  try {
    // 3. Persist updated personal best record
    localStorage.setItem(STORAGE_KEY_PERSONAL_BESTS, JSON.stringify(records));

    // 4. Persist updated training stats
    updateTrainingStats(safeTime, isNewBest, currentStats);
  } catch (err) {
    // Attempt rollback so a failed write never leaves inconsistent stats.
    // Note: If storage is completely broken/unavailable, rollback may also fail.
    // Preserve the original error and report rollback failure appropriately.
    let rollbackError: unknown = null;
    try {
      if (prevPbsRaw !== null) {
        localStorage.setItem(STORAGE_KEY_PERSONAL_BESTS, prevPbsRaw);
      } else {
        localStorage.removeItem(STORAGE_KEY_PERSONAL_BESTS);
      }
      if (prevStatsRaw !== null) {
        localStorage.setItem(STORAGE_KEY_TRAINING_STATS, prevStatsRaw);
      } else {
        localStorage.removeItem(STORAGE_KEY_TRAINING_STATS);
      }
    } catch (rbErr) {
      rollbackError = rbErr;
    }

    const originalErrMsg = normalizeError(err);
    if (rollbackError) {
      const rollbackErrMsg = normalizeError(rollbackError);
      console.error(
        `Failed saving personal best or training stats: ${originalErrMsg}. Rollback also failed: ${rollbackErrMsg}`
      );
      throw new Error(
        `Storage operation failed: ${originalErrMsg} (Rollback also failed: ${rollbackErrMsg})`
      );
    }

    console.error('Failed saving personal best or training stats:', originalErrMsg);
    throw err;
  }

  return {
    isNewBest,
    previousBestSeconds,
    newBestSeconds: records[problemId].bestTimeSeconds,
    attemptsCount: attempts
  };
}

/**
 * Retrieves overall training statistics.
 */
export function getTrainingStats(): TrainingStats {
  const pbs = getAllPersonalBests();
  const keys = Object.keys(pbs);

  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRAINING_STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          totalSolved: typeof parsed.totalSolved === 'number' ? parsed.totalSolved : keys.length,
          recordsBeaten: typeof parsed.recordsBeaten === 'number' ? parsed.recordsBeaten : 0,
          totalTrainingTimeSeconds:
            typeof parsed.totalTrainingTimeSeconds === 'number'
              ? parsed.totalTrainingTimeSeconds
              : keys.reduce((acc, k) => acc + (pbs[k]?.bestTimeSeconds || 0), 0)
        };
      }
    }
  } catch {
    // ignore
  }

  return {
    totalSolved: keys.length,
    recordsBeaten: 0,
    totalTrainingTimeSeconds: keys.reduce((acc, k) => acc + (pbs[k]?.bestTimeSeconds || 0), 0)
  };
}

function updateTrainingStats(timeSeconds: number, wasNewBest: boolean, baseStats?: TrainingStats): TrainingStats {
  try {
    const stats = baseStats ? { ...baseStats } : getTrainingStats();
    stats.totalSolved += 1;
    stats.totalTrainingTimeSeconds += timeSeconds;
    if (wasNewBest) {
      stats.recordsBeaten += 1;
    }
    localStorage.setItem(STORAGE_KEY_TRAINING_STATS, JSON.stringify(stats));
    return stats;
  } catch (e) {
    console.error('Failed updating training stats:', normalizeError(e));
    throw e;
  }
}
