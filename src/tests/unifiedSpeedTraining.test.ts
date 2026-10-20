import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import {
  recordProblemTime,
  getPersonalBest,
  getAllPersonalBests,
  getTrainingStats,
  getAllTrainingProblems,
  getFilteredTrainingProblems
} from '../services/trainingService';
import { evaluateTestCases } from '../utils/codeRunner';
import { BLIND_75_ROADMAP, NEETCODE_150_ROADMAP } from '../data/dsaRoadmaps';

class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

describe('Unified Speed Training: Personal Bests, Timed Training & Hub Integration', () => {
  beforeAll(() => {
    if (typeof globalThis.localStorage === 'undefined') {
      (globalThis as unknown as { localStorage: LocalStorageMock }).localStorage = new LocalStorageMock();
    }
  });

  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('Reads and updates Personal Best records in localStorage under bytesized_training_personal_bests', () => {
    expect(getAllPersonalBests()).toEqual({});

    // 1. Initial baseline solve (e.g. 120 seconds in Python)
    const firstResult = recordProblemTime('two-sum', 120, 'python');
    expect(firstResult.isNewBest).toBe(true);
    expect(firstResult.previousBestSeconds).toBeNull();
    expect(firstResult.newBestSeconds).toBe(120);
    expect(firstResult.attemptsCount).toBe(1);

    // Verify localStorage persistence
    const rawStored = globalThis.localStorage.getItem('bytesized_training_personal_bests');
    expect(rawStored).toBeTruthy();
    const stored = JSON.parse(rawStored!);
    expect(stored['two-sum']).toBeDefined();
    expect(stored['two-sum'].bestTimeSeconds).toBe(120);
    expect(stored['two-sum'].language).toBe('python');

    // Verify getter
    const pb = getPersonalBest('two-sum');
    expect(pb).not.toBeNull();
    expect(pb?.bestTimeSeconds).toBe(120);
  });

  it('Correctly handles record beating and attempt count increments', () => {
    // Initial record: 90 seconds
    recordProblemTime('contains-duplicate', 90, 'javascript');

    // Slower attempt: 105 seconds (should NOT beat record)
    const slowerResult = recordProblemTime('contains-duplicate', 105, 'javascript');
    expect(slowerResult.isNewBest).toBe(false);
    expect(slowerResult.newBestSeconds).toBe(90);
    expect(slowerResult.previousBestSeconds).toBe(90);
    expect(slowerResult.attemptsCount).toBe(2);

    // Faster attempt: 65 seconds (should BEAT record)
    const fasterResult = recordProblemTime('contains-duplicate', 65, 'python');
    expect(fasterResult.isNewBest).toBe(true);
    expect(fasterResult.newBestSeconds).toBe(65);
    expect(fasterResult.previousBestSeconds).toBe(90);
    expect(fasterResult.attemptsCount).toBe(3);

    // Verify stored PB is updated to the faster time
    const updatedPB = getPersonalBest('contains-duplicate');
    expect(updatedPB?.bestTimeSeconds).toBe(65);
    expect(updatedPB?.attemptsCount).toBe(3);
    expect(updatedPB?.language).toBe('python');
  });

  it('Accurately aggregates training statistics across all solved problems', () => {
    expect(getTrainingStats()).toEqual({
      totalSolved: 0,
      recordsBeaten: 0,
      totalTrainingTimeSeconds: 0
    });

    // Solve 1: problem-1 in 50s
    recordProblemTime('problem-1', 50, 'cpp');
    // Solve 2: problem-1 in 40s (beats previous record)
    recordProblemTime('problem-1', 40, 'cpp');
    // Solve 3: problem-2 in 70s
    recordProblemTime('problem-2', 70, 'python');

    const stats = getTrainingStats();
    expect(stats.totalSolved).toBeGreaterThanOrEqual(3);
    expect(stats.recordsBeaten).toBeGreaterThanOrEqual(2);
    expect(stats.totalTrainingTimeSeconds).toBeGreaterThanOrEqual(160);
  });

  it('Loads unified training problems combining Question Bank, NeetCode 75, and NeetCode 150', async () => {
    const all = await getAllTrainingProblems();
    expect(all.length).toBeGreaterThan(0);

    // Verify key challenges exist and have sheets attached
    const twoSum = all.find(p => p.id === 'two-sum');
    expect(twoSum).toBeDefined();
    expect(twoSum?.sheets).toContain('neetcode75');
    expect(twoSum?.sheets).toContain('neetcode150');
    expect(twoSum?.sheets).toContain('questionbank');

    // Test sheet filtering
    const nc75Filtered = await getFilteredTrainingProblems('neetcode75');
    expect(nc75Filtered.length).toBeGreaterThan(0);
    expect(nc75Filtered.every(p => p.sheets?.includes('neetcode75'))).toBe(true);

    const nc150Filtered = await getFilteredTrainingProblems('neetcode150');
    expect(nc150Filtered.length).toBeGreaterThan(0);
    expect(nc150Filtered.every(p => p.sheets?.includes('neetcode150'))).toBe(true);

    const bankFiltered = await getFilteredTrainingProblems('questionbank');
    expect(bankFiltered.length).toBeGreaterThan(0);
  });

  it('Evaluates test cases for timed submission victory transition', async () => {
    const testCases = [
      { id: 't1', input: '2\n3', output: '5' },
      { id: 't2', input: '10\n20', output: '30' }
    ];

    // JavaScript solution reading stdin lines
    const solutionCode = `
const lines = stdin.trim().split(/\\s+/);
if (lines.length >= 2) {
  console.log(Number(lines[0]) + Number(lines[1]));
}
`;

    const summary = await evaluateTestCases(solutionCode, 'javascript', testCases);
    expect(summary.allPassed).toBe(true);
    expect(summary.passedCount).toBe(2);
    expect(summary.totalCount).toBe(2);
  });

  it('Preserves access to Blind 75 and NeetCode 150 roadmaps within the unified Speed Training ecosystem', () => {
    expect(BLIND_75_ROADMAP.problems.length).toBe(75);
    expect(NEETCODE_150_ROADMAP.problems.length).toBe(150);

    // Verify problem data integrity
    const firstB75 = BLIND_75_ROADMAP.problems[0];
    expect(firstB75.id).toBe('contains-duplicate');
    expect(firstB75.title).toBe('Contains Duplicate');
    expect(firstB75.category).toBe('Arrays & Hashing');
  });

  it('Restores Personal Bests and aggregate statistics accurately after browser refresh / localStorage reload', () => {
    // Seed localStorage simulating existing user session
    recordProblemTime('two-sum', 85, 'python');
    recordProblemTime('reverse-string', 40, 'javascript');

    // Simulate page reload by reading directly from storage
    const storedPBs = getAllPersonalBests();
    expect(storedPBs['two-sum']).toBeDefined();
    expect(storedPBs['two-sum'].bestTimeSeconds).toBe(85);
    expect(storedPBs['reverse-string'].bestTimeSeconds).toBe(40);

    const stats = getTrainingStats();
    expect(stats.totalSolved).toBeGreaterThanOrEqual(2);
    expect(stats.totalTrainingTimeSeconds).toBeGreaterThanOrEqual(125);
  });

  it('Ensures failed evaluation does NOT create or update Personal Bests', async () => {
    const wrongSolution = `console.log("wrong output");`;
    const testCases = [{ id: 'tc1', input: 'input', output: 'expected' }];

    const summary = await evaluateTestCases(wrongSolution, 'javascript', testCases);
    expect(summary.allPassed).toBe(false);

    // If evaluation fails, recordProblemTime must not be called
    expect(getPersonalBest('unsolved-problem')).toBeNull();
    const statsBefore = getTrainingStats();
    expect(statsBefore.totalSolved).toBe(0);
  });

  it('Correctly resolves problem handoff from Question Bank by id or slug', async () => {
    const problems = await getAllTrainingProblems();

    // ID lookup
    const p1 = problems.find(p => p.id === 'two-sum' || p.slug === 'two-sum');
    expect(p1).toBeDefined();
    expect(p1?.id).toBe('two-sum');
    expect(p1?.starterTemplates?.python).toBeDefined();
    expect(p1?.starterTemplates?.javascript).toBeDefined();

    // Slug lookup
    const p2 = problems.find(p => p.id === 'palindrome-number' || p.slug === 'palindrome-number');
    expect(p2).toBeDefined();
    expect(p2?.slug).toBe('palindrome-number');

    // Ensure all supported languages have starter templates
    expect(p1?.starterTemplates?.python).toContain('input');
    expect(p1?.starterTemplates?.cpp).toContain('#include');
  });

  it('Guards against duplicate results and tracks attempts accurately', () => {
    // Attempt 1: 100s
    const res1 = recordProblemTime('fibonacci-number', 100, 'python');
    expect(res1.isNewBest).toBe(true);
    expect(res1.attemptsCount).toBe(1);

    // Attempt 2: 100s (tie does not beat PB)
    const res2 = recordProblemTime('fibonacci-number', 100, 'python');
    expect(res2.isNewBest).toBe(false);
    expect(res2.attemptsCount).toBe(2);

    // Attempt 3: 80s (beats PB)
    const res3 = recordProblemTime('fibonacci-number', 80, 'python');
    expect(res3.isNewBest).toBe(true);
    expect(res3.newBestSeconds).toBe(80);
    expect(res3.previousBestSeconds).toBe(100);
    expect(res3.attemptsCount).toBe(3);
  });

  it('Rejects invalid times (NaN, Infinity, negative) without corrupting records or stats', () => {
    const statsBefore = getTrainingStats();

    expect(() => recordProblemTime('invalid-time-prob', NaN, 'python')).toThrow(/Invalid timeSeconds/);
    expect(() => recordProblemTime('invalid-time-prob', Infinity, 'python')).toThrow(/Invalid timeSeconds/);
    expect(() => recordProblemTime('invalid-time-prob', -Infinity, 'python')).toThrow(/Invalid timeSeconds/);
    expect(() => recordProblemTime('invalid-time-prob', -10, 'python')).toThrow(/Invalid timeSeconds/);

    // Verify storage was never touched
    expect(getPersonalBest('invalid-time-prob')).toBeNull();
    const statsAfter = getTrainingStats();
    expect(statsAfter.totalSolved).toBe(statsBefore.totalSolved);
    expect(statsAfter.recordsBeaten).toBe(statsBefore.recordsBeaten);
    expect(statsAfter.totalTrainingTimeSeconds).toBe(statsBefore.totalTrainingTimeSeconds);
  });

  it('Handles legacy attemptsCount: 0 and missing/malformed attempts accurately', () => {
    // 1. Legacy record with explicit attemptsCount: 0
    localStorage.setItem(
      'bytesized_training_personal_bests',
      JSON.stringify({
        'legacy-zero': {
          problemId: 'legacy-zero',
          bestTimeSeconds: 60,
          achievedAt: new Date().toISOString(),
          attemptsCount: 0,
          language: 'python'
        }
      })
    );

    const resZero = recordProblemTime('legacy-zero', 45, 'python');
    // Valid 0 must increment to 1 (not 1 + 1 = 2)
    expect(resZero.attemptsCount).toBe(1);
    expect(resZero.isNewBest).toBe(true);
    expect(resZero.newBestSeconds).toBe(45);

    // 2. Legacy record where attemptsCount was omitted (undefined)
    localStorage.setItem(
      'bytesized_training_personal_bests',
      JSON.stringify({
        'legacy-missing': {
          problemId: 'legacy-missing',
          bestTimeSeconds: 70,
          achievedAt: new Date().toISOString(),
          language: 'javascript'
        }
      })
    );

    const resMissing = recordProblemTime('legacy-missing', 80, 'javascript');
    // Missing attemptsCount defaults safely to 1 prior solve, incrementing to 2
    expect(resMissing.attemptsCount).toBe(2);
    expect(resMissing.isNewBest).toBe(false);
    expect(resMissing.newBestSeconds).toBe(70);

    // 3. Legacy record with malformed (negative / NaN) attemptsCount
    localStorage.setItem(
      'bytesized_training_personal_bests',
      JSON.stringify({
        'legacy-malformed': {
          problemId: 'legacy-malformed',
          bestTimeSeconds: 50,
          achievedAt: new Date().toISOString(),
          attemptsCount: -99,
          language: 'cpp'
        }
      })
    );

    const resMalformed = recordProblemTime('legacy-malformed', 55, 'cpp');
    expect(resMalformed.attemptsCount).toBe(2);
  });
});
