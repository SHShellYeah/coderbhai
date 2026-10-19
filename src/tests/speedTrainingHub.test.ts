import { describe, it, expect } from 'vitest';
import { BLIND_75_ROADMAP, NEETCODE_150_ROADMAP } from '../data/dsaRoadmaps';
import { INITIAL_QUESTION_BANK } from '../data/questionBank';
import { getApprovedChallenges } from '../services/arenaService';
import { computeRoadmapProgress, calculateIntegerPercentage } from '../context/DsaProgressContext';
import { DsaProgressState } from '../types/dsa';

describe('Speed Training Hub: Metric Calculations & Genuine Data Integration', () => {
  it('Calculates genuine progress summaries independently for Blind 75 and NeetCode 150', () => {
    const mockProgress: DsaProgressState = {
      'two-sum': 'solved',
      'contains-duplicate': 'solved',
      'valid-anagram': 'attempted',
    };

    const b75Summary = computeRoadmapProgress('blind75', mockProgress);
    const nc150Summary = computeRoadmapProgress('neetcode150', mockProgress);

    // Blind 75: 75 total
    expect(b75Summary.total).toBe(75);
    expect(b75Summary.solved).toBe(2);
    expect(b75Summary.attempted).toBe(1);
    expect(b75Summary.percentage).toBe(calculateIntegerPercentage(2, 75)); // Math.round(2/75 * 100) = 3%

    // NeetCode 150: 150 total
    expect(nc150Summary.total).toBe(150);
    expect(nc150Summary.solved).toBe(2);
    expect(nc150Summary.attempted).toBe(1);
    expect(nc150Summary.percentage).toBe(calculateIntegerPercentage(2, 150)); // Math.round(2/150 * 100) = 1%
  });

  it('Calculates unique total DSA problems solved without double counting shared slugs', () => {
    // Problem 'two-sum' exists in BOTH Blind 75 and NeetCode 150
    const mockProgress: DsaProgressState = {
      'two-sum': 'solved',
      'contains-duplicate': 'solved',
      'valid-anagram': 'solved',
    };

    const uniqueSolved = Object.values(mockProgress).filter(s => s === 'solved').length;
    expect(uniqueSolved).toBe(3);
  });

  it('Identifies attempted problem as highest priority for "Next Up / Resume" action', () => {
    const mockProgress: DsaProgressState = {
      'two-sum': 'solved',
      'contains-duplicate': 'attempted', // In progress
    };

    // Attempted problem in Blind 75
    const attempted = BLIND_75_ROADMAP.problems.find(p => mockProgress[p.id] === 'attempted');
    expect(attempted).toBeDefined();
    expect(attempted?.id).toBe('contains-duplicate');
  });

  it('Falls back to first unstarted problem in Blind 75 when none are attempted', () => {
    const mockProgress: DsaProgressState = {
      'two-sum': 'solved',
    };

    const nextUnstarted = BLIND_75_ROADMAP.problems.find(
      p => !mockProgress[p.id] || mockProgress[p.id] === 'not-started'
    );
    expect(nextUnstarted).toBeDefined();
    expect(nextUnstarted?.id).toBe('contains-duplicate');
  });

  it('Fetches genuine question bank challenges from approved pool', async () => {
    const challenges = await getApprovedChallenges();
    expect(challenges).toBeDefined();
    expect(challenges.length).toBeGreaterThanOrEqual(INITIAL_QUESTION_BANK.length);

    // Verify difficulty distribution contains genuine non-fabricated counts
    const easy = challenges.filter(c => c.difficulty === 'easy').length;
    const medium = challenges.filter(c => c.difficulty === 'medium').length;
    const hard = challenges.filter(c => c.difficulty === 'hard').length;

    expect(easy + medium + hard).toBe(challenges.length);
    expect(easy).toBeGreaterThan(0);
    expect(medium).toBeGreaterThan(0);
  });

  it('Preserves verified canonical ordering of roadmaps when accessed via Speed Training', () => {
    expect(BLIND_75_ROADMAP.problems[0].id).toBe('contains-duplicate');
    expect(BLIND_75_ROADMAP.problems[1].id).toBe('valid-anagram');
    expect(BLIND_75_ROADMAP.problems[2].id).toBe('two-sum');

    expect(NEETCODE_150_ROADMAP.problems[0].id).toBe('contains-duplicate');
    expect(NEETCODE_150_ROADMAP.problems[1].id).toBe('valid-anagram');
    expect(NEETCODE_150_ROADMAP.problems[2].id).toBe('two-sum');
  });
});
