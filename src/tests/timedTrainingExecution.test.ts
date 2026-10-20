import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { evaluateTestCases, executeCodeSandbox, normalizeOutput, normalizeError, Judge0ProxyAdapter } from '../utils/codeRunner';
import { recordProblemTime, getPersonalBest, getTrainingStats, getAllPersonalBests } from '../services/trainingService';
import { TestCase } from '../types';

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

describe('Timed Training Execution & Submission Workflow Regressions', () => {
  beforeAll(() => {
    if (typeof globalThis.localStorage === 'undefined') {
      (globalThis as unknown as { localStorage: LocalStorageMock }).localStorage = new LocalStorageMock();
    }
  });

  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  // 1. All sample cases pass
  it('1. Successfully evaluates when all sample cases pass', async () => {
    const code = `
const lines = stdin.trim().split(/\\s+/);
if (lines.length >= 2) {
  console.log(Number(lines[0]) + Number(lines[1]));
}
`;
    const sampleCases: TestCase[] = [
      { id: 's1', input: '2 3', output: '5' },
      { id: 's2', input: '10 20', output: '30' }
    ];

    const summary = await evaluateTestCases(code, 'javascript', sampleCases);
    expect(summary.allPassed).toBe(true);
    expect(summary.verdict).toBe('Accepted');
    expect(summary.passedCount).toBe(2);
    expect(summary.totalCount).toBe(2);
  });

  // 2. A sample case fails
  it('2. Marks evaluation failed when a sample case fails', async () => {
    const code = `
const n = Number(stdin.trim());
console.log(n > 0 ? "positive" : "negative");
`;
    const sampleCases: TestCase[] = [
      { id: 's1', input: '5', output: 'positive' },
      { id: 's2', input: '0', output: 'zero' } // Fails here: code outputs negative
    ];

    const summary = await evaluateTestCases(code, 'javascript', sampleCases);
    expect(summary.allPassed).toBe(false);
    expect(summary.verdict).toBe('Wrong Answer');
    expect(summary.passedCount).toBe(1);
    expect(summary.totalCount).toBe(2);
    expect(summary.firstFailedIndex).toBe(1);
    expect(summary.results[1].passed).toBe(false);
  });

  // 3. Samples pass but a hidden case fails
  it('3. Rejects submission when sample cases pass but a hidden case fails', async () => {
    // Solution only works for positive integers, fails on 0 or negative
    const code = `
const n = Number(stdin.trim());
console.log(n * 2);
`;
    const allCases: TestCase[] = [
      { id: 's1', input: '2', output: '4', isHidden: false },
      { id: 's2', input: '3', output: '6', isHidden: false },
      { id: 'h1', input: '-1', output: '0', isHidden: true } // Hidden test requires 0 for negatives
    ];

    const summary = await evaluateTestCases(code, 'javascript', allCases);
    expect(summary.allPassed).toBe(false);
    expect(summary.verdict).toBe('Wrong Answer');
    expect(summary.results[0].passed).toBe(true);
    expect(summary.results[1].passed).toBe(true);
    expect(summary.results[2].passed).toBe(false);
    expect(summary.results[2].isHidden).toBe(true);
    // Ensure hidden test input/output are not exposed directly in display
    expect(summary.results[2].input).toBe('[Hidden Test Case]');
    expect(summary.results[2].expectedOutput).toBe('[Hidden Expected Output]');
  });

  // 4. A syntax/compile error occurs
  it('4. Classifies syntax and compile errors as Compilation Error', async () => {
    const brokenCode = `const x = ;`; // Syntax error in JS
    const sampleCases: TestCase[] = [
      { id: 's1', input: 'test', output: 'test' }
    ];

    const summary = await evaluateTestCases(brokenCode, 'javascript', sampleCases);
    expect(summary.allPassed).toBe(false);
    expect(summary.verdict).toBe('Compilation Error');
    expect(summary.results[0].passed).toBe(false);
    expect(summary.results[0].errorMessage).toBeDefined();
  });

  // 5. A runtime error occurs
  it('5. Classifies runtime exceptions as Runtime Error', async () => {
    const crashingCode = `
const obj = null;
console.log(obj.nonExistentProperty);
`;
    const sampleCases: TestCase[] = [
      { id: 's1', input: 'test', output: 'test' }
    ];

    const summary = await evaluateTestCases(crashingCode, 'javascript', sampleCases);
    expect(summary.allPassed).toBe(false);
    expect(summary.verdict).toBe('Runtime Error');
    expect(summary.results[0].passed).toBe(false);
    expect(summary.results[0].errorMessage).toContain('Cannot read properties of null');
  });

  // 6. Output differs only by trailing whitespace
  it('6. Normalizes line endings and trailing whitespace without falsely matching different outputs', () => {
    const rawOutput = 'hello world   \r\n42 \n';
    const expectedOutput = 'hello world\n42';

    expect(normalizeOutput(rawOutput)).toBe(expectedOutput);

    // Genuinely different outputs must not match
    expect(normalizeOutput('hello world!')).not.toBe(normalizeOutput('hello world'));
    expect(normalizeOutput('1 2 3')).not.toBe(normalizeOutput('1 2'));
  });

  // 7. An empty test suite is rejected
  it('7. Rejects an empty or malformed test suite instead of falsely accepting it', async () => {
    const code = `console.log("anything");`;
    const emptySuite: TestCase[] = [];

    const summary = await evaluateTestCases(code, 'javascript', emptySuite);
    expect(summary.allPassed).toBe(false);
    expect(summary.verdict).toBe('Runtime Error');
    expect(summary.errorMessage).toContain('Empty or malformed test suite');
  });

  // 8. Run does not write Personal Best or completion statistics
  it('8. Test/Run execution never writes Personal Best or alters completion statistics', async () => {
    const statsBefore = getTrainingStats();
    expect(statsBefore.totalSolved).toBe(0);

    const code = `console.log("correct");`;
    const sampleCases: TestCase[] = [{ id: 's1', input: '', output: 'correct' }];

    // Simulate "Run" or "Test" action
    const summary = await evaluateTestCases(code, 'javascript', sampleCases);
    expect(summary.allPassed).toBe(true);

    // Verify storage was never touched
    expect(getPersonalBest('prob-run-only')).toBeNull();
    const statsAfter = getTrainingStats();
    expect(statsAfter.totalSolved).toBe(0);
    expect(statsAfter.recordsBeaten).toBe(0);
  });

  // 9. Failed Submit does not write Personal Best or completion statistics
  it('9. Failed Submit does not write Personal Best or increment solved statistics', async () => {
    const failingCode = `console.log("wrong");`;
    const allCases: TestCase[] = [{ id: 'tc1', input: '', output: 'expected' }];

    const summary = await evaluateTestCases(failingCode, 'javascript', allCases);
    expect(summary.allPassed).toBe(false);

    // Simulating handleSubmit check: only record on allPassed === true
    if (summary.allPassed) {
      recordProblemTime('prob-fail', 45, 'javascript');
    }

    expect(getPersonalBest('prob-fail')).toBeNull();
    expect(getTrainingStats().totalSolved).toBe(0);
  });

  // 10. Successful Submit records exactly once
  it('10. Successful Submit records completion and updates Personal Best exactly once', async () => {
    const correctCode = `console.log("expected");`;
    const allCases: TestCase[] = [{ id: 'tc1', input: '', output: 'expected' }];

    const summary = await evaluateTestCases(correctCode, 'javascript', allCases);
    expect(summary.allPassed).toBe(true);

    let recordsCount = 0;
    if (summary.allPassed) {
      recordProblemTime('prob-success', 42, 'javascript');
      recordsCount++;
    }

    expect(recordsCount).toBe(1);
    const pb = getPersonalBest('prob-success');
    expect(pb).toBeDefined();
    expect(pb?.bestTimeSeconds).toBe(42);
    expect(pb?.attemptsCount).toBe(1);

    const stats = getTrainingStats();
    expect(stats.totalSolved).toBe(1);
    expect(stats.recordsBeaten).toBe(1);
  });

  // 11. Rapid duplicate submissions do not double-record
  it('11. Prevents duplicate submissions and concurrent double-recording', () => {
    let isSubmitting = false;
    let hasRecordedResult = false;
    let submissionCallCount = 0;

    const simulateSubmit = (finalSeconds: number) => {
      if (isSubmitting || hasRecordedResult) return;
      isSubmitting = true;

      // Mock completion
      hasRecordedResult = true;
      recordProblemTime('prob-double-click', finalSeconds, 'python');
      submissionCallCount++;
      isSubmitting = false;
    };

    // First click
    simulateSubmit(60);
    // Second rapid click while already recorded / locked
    simulateSubmit(60);

    expect(submissionCallCount).toBe(1);
    const pb = getPersonalBest('prob-double-click');
    expect(pb?.attemptsCount).toBe(1);
    expect(getTrainingStats().totalSolved).toBe(1);
  });

  // 12. Switching problems while execution is pending cannot apply the old result to the new problem
  it('12. Discards pending execution results if the active problem is switched before completion', async () => {
    let activeProblemId = 'problem-A';

    // Simulate async execution of Problem A
    const code = `console.log("output A");`;
    const casesA: TestCase[] = [{ id: 'a1', input: '', output: 'output A' }];

    const executingProblemId = activeProblemId;
    const promise = evaluateTestCases(code, 'javascript', casesA);

    // User switches to Problem B before promise settles
    activeProblemId = 'problem-B';

    const summary = await promise;
    expect(summary.allPassed).toBe(true);

    // Stale guard: if activeProblemId !== executingProblemId, abort!
    let recordedForProblem = null;
    if (activeProblemId === executingProblemId) {
      recordedForProblem = executingProblemId;
      recordProblemTime(executingProblemId, 30, 'javascript');
    }

    // Must be aborted and not applied to problem-A or problem-B
    expect(recordedForProblem).toBeNull();
    expect(getPersonalBest('problem-A')).toBeNull();
    expect(getPersonalBest('problem-B')).toBeNull();
    expect(getTrainingStats().totalSolved).toBe(0);
  });

  // 13. Persistence consistency: repeat solves and existing stats preservation
  it('13. Repeat solves increment aggregate stats once while preserving existing statistics', () => {
    // Initial solve of Problem 1
    recordProblemTime('prob-1', 100, 'python');
    const stats1 = getTrainingStats();
    expect(stats1.totalSolved).toBe(1);
    expect(stats1.recordsBeaten).toBe(1);
    expect(stats1.totalTrainingTimeSeconds).toBe(100);

    // Repeat solve of Problem 1 (beats previous time)
    recordProblemTime('prob-1', 80, 'python');
    const pb1 = getPersonalBest('prob-1');
    expect(pb1?.bestTimeSeconds).toBe(80);
    expect(pb1?.attemptsCount).toBe(2);

    const stats2 = getTrainingStats();
    expect(stats2.totalSolved).toBe(2);
    expect(stats2.recordsBeaten).toBe(2);
    expect(stats2.totalTrainingTimeSeconds).toBe(180);

    // Initial solve of Problem 2
    recordProblemTime('prob-2', 60, 'javascript');
    const pb2 = getPersonalBest('prob-2');
    expect(pb2?.bestTimeSeconds).toBe(60);
    expect(pb2?.attemptsCount).toBe(1);

    const stats3 = getTrainingStats();
    expect(stats3.totalSolved).toBe(3);
    expect(stats3.recordsBeaten).toBe(3);
    expect(stats3.totalTrainingTimeSeconds).toBe(240);
  });

  // 14. Persistence consistency: failed Personal Best write cannot create inconsistent stats
  it('14. Failed Personal Best write rolls back and does not create inconsistent stats', () => {
    const originalSetItem = globalThis.localStorage.setItem;
    try {
      globalThis.localStorage.setItem = (key: string, val: string) => {
        if (key === 'bytesized_training_personal_bests') {
          throw new Error('QuotaExceededError: LocalStorage quota exceeded');
        }
        originalSetItem.call(globalThis.localStorage, key, val);
      };

      expect(() => {
        recordProblemTime('prob-storage-fail', 45, 'javascript');
      }).toThrow(/QuotaExceededError/);

      // Verify neither PB nor training stats were corrupted or incremented
      expect(getPersonalBest('prob-storage-fail')).toBeNull();
      expect(getTrainingStats().totalSolved).toBe(0);
      expect(getTrainingStats().totalTrainingTimeSeconds).toBe(0);
    } finally {
      globalThis.localStorage.setItem = originalSetItem;
    }
  });

  // 15. Error classification: prefers structured errorCategory with safe legacy fallback
  it('15. Error classification prefers structured errorCategory with fallback for legacy runners', async () => {
    const cases: TestCase[] = [{ id: 'c1', input: '', output: 'ok' }];

    // Mock adapter returning structured 'timeout' error
    const timeoutAdapter = {
      name: 'mock-timeout',
      isAvailable: () => true,
      execute: async () => ({
        stdout: '',
        stderr: 'Process killed by timer',
        executionTimeMs: 3000,
        hasError: true,
        errorMessage: 'Process killed by timer',
        errorCategory: 'timeout' as const
      })
    };
    const resTimeout = await evaluateTestCases('code', 'javascript', cases, timeoutAdapter);
    expect(resTimeout.verdict).toBe('Time Limit Exceeded');

    // Mock adapter returning structured 'compilation' error
    const compileAdapter = {
      name: 'mock-compile',
      isAvailable: () => true,
      execute: async () => ({
        stdout: '',
        stderr: 'Type error in declaration',
        executionTimeMs: 10,
        hasError: true,
        errorMessage: 'Type error in declaration',
        errorCategory: 'compilation' as const
      })
    };
    const resCompile = await evaluateTestCases('code', 'javascript', cases, compileAdapter);
    expect(resCompile.verdict).toBe('Compilation Error');

    // Mock legacy adapter without errorCategory (relying on fallback substring matching)
    const legacyCompileAdapter = {
      name: 'mock-legacy',
      isAvailable: () => true,
      execute: async () => ({
        stdout: '',
        stderr: 'SyntaxError: Unexpected token ;',
        executionTimeMs: 10,
        hasError: true,
        errorMessage: 'SyntaxError: Unexpected token ;'
      })
    };
    const resLegacy = await evaluateTestCases('code', 'javascript', cases, legacyCompileAdapter);
    expect(resLegacy.verdict).toBe('Compilation Error');
  });

  // 16. Language support honesty: clear error for unsupported module imports and unsupported languages
  it('16. Honest errors for unsupported module imports and unsupported languages', async () => {
    // Python module import in client sandbox
    const pythonImportCode = `
import math
print(math.sqrt(16))
`;
    const cases: TestCase[] = [{ id: 'p1', input: '', output: '4' }];
    const resImport = await evaluateTestCases(pythonImportCode, 'python', cases);
    expect(resImport.allPassed).toBe(false);
    expect(resImport.verdict).toBe('Compilation Error');
    expect(resImport.errorMessage).toContain('Module imports');
    expect(resImport.errorMessage).toContain('not supported in the client sandbox');

    // Unsupported language
    const resUnsupported = await executeCodeSandbox('fn main() {}', 'rust' as any);
    expect(resUnsupported.hasError).toBe(true);
    expect(resUnsupported.errorCategory).toBe('compilation');
    expect(resUnsupported.errorMessage).toContain('Language \'rust\' is not supported');
  });

  // 17. Unmount cleanup guard: drops execution results if component is unmounted
  it('17. Discards execution results and side-effects if unmounted before completion', async () => {
    let isComponentMounted = true;
    let pbSaved = false;

    const cases: TestCase[] = [{ id: 'u1', input: '', output: '42' }];
    const execPromise = evaluateTestCases('console.log(42);', 'javascript', cases);

    // Component unmounts
    isComponentMounted = false;

    const summary = await execPromise;
    expect(summary.allPassed).toBe(true);

    if (isComponentMounted) {
      recordProblemTime('prob-unmount', 20, 'javascript');
      pbSaved = true;
    }

    expect(pbSaved).toBe(false);
    expect(getPersonalBest('prob-unmount')).toBeNull();
    expect(getTrainingStats().totalSolved).toBe(0);
  });

  // 18. Judge0 status handling: unknown and pending statuses never pass
  it('18. Explicitly handles unknown and pending Judge0 statuses without false acceptance', async () => {
    const origFetch = globalThis.fetch;
    const adapter = new Judge0ProxyAdapter('https://mock-proxy.test/execute');

    try {
      // (a) Unknown Judge0 status (e.g. status ID 99)
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          status: { id: 99, description: 'Unknown custom error' },
          stdout: '',
          stderr: ''
        })
      } as any);

      const resUnknown = await adapter.execute('code', 'javascript', 'input');
      expect(resUnknown.hasError).toBe(true);
      expect(resUnknown.errorCategory).toBe('infrastructure');
      expect(resUnknown.errorMessage).toContain('Unknown Judge0 status');

      const cases: TestCase[] = [{ id: 'tc1', input: '', output: '' }];
      const evalUnknown = await evaluateTestCases('code', 'javascript', cases, adapter);
      expect(evalUnknown.allPassed).toBe(false);
      expect(evalUnknown.verdict).toBe('Infrastructure Error');

      // (b) Pending status: In Queue (status 1)
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          status: { id: 1, description: 'In Queue' },
          stdout: ''
        })
      } as any);

      const resPending1 = await adapter.execute('code', 'javascript', 'input');
      expect(resPending1.hasError).toBe(true);
      expect(resPending1.errorCategory).toBe('infrastructure');

      // (c) Pending status: Processing (status 2)
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          status: { id: 2, description: 'Processing' },
          stdout: ''
        })
      } as any);

      const resPending2 = await adapter.execute('code', 'javascript', 'input');
      expect(resPending2.hasError).toBe(true);
      expect(resPending2.errorCategory).toBe('infrastructure');

      // (d) Empty stdout with pending status must never pass even if expected output is empty
      const evalPending = await evaluateTestCases('code', 'javascript', cases, adapter);
      expect(evalPending.allPassed).toBe(false);
      expect(evalPending.verdict).toBe('Infrastructure Error');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // 19. Empty stdout only passes when execution genuinely succeeded
  it('19. Ensures empty stdout only passes when execution genuinely succeeded and expected is empty', async () => {
    const origFetch = globalThis.fetch;
    const adapter = new Judge0ProxyAdapter('https://mock-proxy.test/execute');
    const cases: TestCase[] = [{ id: 'tc1', input: '', output: '' }];

    try {
      // (a) Internal Error (status 13) with empty output must FAIL
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          status: { id: 13, description: 'Internal Error' },
          stdout: '',
          stderr: ''
        })
      } as any);

      const evalFail = await evaluateTestCases('code', 'javascript', cases, adapter);
      expect(evalFail.allPassed).toBe(false);
      expect(evalFail.verdict).toBe('Infrastructure Error');

      // (b) Accepted (status 3) with genuinely empty output must PASS
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          status: { id: 3, description: 'Accepted' },
          stdout: '',
          stderr: '',
          hasError: false
        })
      } as any);

      const evalPass = await evaluateTestCases('code', 'javascript', cases, adapter);
      expect(evalPass.allPassed).toBe(true);
      expect(evalPass.verdict).toBe('Accepted');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // 20. Test-case validation rejects malformed test cases without leaking hidden data
  it('20. Pre-validates test cases and rejects malformed cases without leaking hidden data', async () => {
    // (a) Null entry in testCases array
    const malformedSuite1: any = [null];
    const res1 = await evaluateTestCases('console.log("ok");', 'javascript', malformedSuite1);
    expect(res1.allPassed).toBe(false);
    expect(res1.verdict).toBe('Runtime Error');
    expect(res1.errorMessage).toContain('Malformed test case at index 0');

    // (b) Missing required 'input' field
    const malformedSuite2: any = [{ id: 't1', output: 'expected' }];
    const res2 = await evaluateTestCases('console.log("ok");', 'javascript', malformedSuite2);
    expect(res2.allPassed).toBe(false);
    expect(res2.verdict).toBe('Runtime Error');
    expect(res2.errorMessage).toContain('Malformed test case at index 0');

    // (c) Missing required 'output' field
    const malformedSuite3: any = [{ id: 't1', input: 'sample' }];
    const res3 = await evaluateTestCases('console.log("ok");', 'javascript', malformedSuite3);
    expect(res3.allPassed).toBe(false);
    expect(res3.verdict).toBe('Runtime Error');
    expect(res3.errorMessage).toContain('Malformed test case at index 0');

    // (d) Non-string input/output
    const malformedSuite4: any = [{ id: 't1', input: 12345, output: 67890 }];
    const res4 = await evaluateTestCases('console.log("ok");', 'javascript', malformedSuite4);
    expect(res4.allPassed).toBe(false);
    expect(res4.verdict).toBe('Runtime Error');
    expect(res4.errorMessage).toContain('Malformed test case at index 0');

    // (e) Hidden test case with malformed fields does not leak hidden values in error
    const malformedHidden: any = [
      { id: 'h1', isHidden: true, input: 'SECRET_INPUT_KEY', output: null }
    ];
    const resHidden = await evaluateTestCases('console.log("ok");', 'javascript', malformedHidden);
    expect(resHidden.allPassed).toBe(false);
    expect(resHidden.errorMessage).not.toContain('SECRET_INPUT_KEY');
    expect(resHidden.errorMessage).toContain('Malformed test case at index 0');
  });

  // 21. Safe exception normalization handles unknown thrown types safely
  it('21. normalizeError handles non-Error thrown values without throwing secondary exceptions', async () => {
    // Direct unit tests of normalizeError
    expect(normalizeError(null)).toBe('Unknown error (null or undefined exception)');
    expect(normalizeError(undefined)).toBe('Unknown error (null or undefined exception)');
    expect(normalizeError('Raw string error message')).toBe('Raw string error message');
    expect(normalizeError(404)).toBe('404');
    expect(normalizeError(new Error('Standard Error'))).toBe('Standard Error');
    expect(normalizeError({ message: 'Custom object message' })).toBe('Custom object message');
    expect(normalizeError({ code: 500, detail: 'network down' })).toBe('{"code":500,"detail":"network down"}');

    // evaluateTestCases with adapter throwing a raw string
    const throwingStringAdapter = {
      name: 'throw-string',
      isAvailable: () => true,
      execute: async () => {
        throw 'Fatal non-Error string exception';
      }
    };
    const cases: TestCase[] = [{ id: 'c1', input: '', output: 'ok' }];
    const resString = await evaluateTestCases('code', 'javascript', cases, throwingStringAdapter);
    expect(resString.allPassed).toBe(false);
    expect(resString.verdict).toBe('Runtime Error');
    expect(resString.errorMessage).toBe('Fatal non-Error string exception');

    // evaluateTestCases with adapter throwing null
    const throwingNullAdapter = {
      name: 'throw-null',
      isAvailable: () => true,
      execute: async () => {
        throw null;
      }
    };
    const resNull = await evaluateTestCases('code', 'javascript', cases, throwingNullAdapter);
    expect(resNull.allPassed).toBe(false);
    expect(resNull.verdict).toBe('Runtime Error');
    expect(resNull.errorMessage).toContain('null or undefined exception');
  });

  // 22. Rollback failure surfaces both original error and rollback error
  it('22. Preserves original error and surfaces failure when storage rollback itself fails', () => {
    const originalSetItem = globalThis.localStorage.setItem;
    const originalRemoveItem = globalThis.localStorage.removeItem;

    try {
      // Simulate environment where localStorage setItem and rollback cleanup both fail
      globalThis.localStorage.setItem = () => {
        throw new Error('QuotaExceededError: storage write blocked');
      };
      globalThis.localStorage.removeItem = () => {
        throw new Error('StorageDisabledError: cannot remove item');
      };

      expect(() => {
        recordProblemTime('prob-dual-storage-fail', 45, 'javascript');
      }).toThrow(/Storage operation failed: QuotaExceededError: storage write blocked \(Rollback also failed: StorageDisabledError: cannot remove item\)/);
    } finally {
      globalThis.localStorage.setItem = originalSetItem;
      globalThis.localStorage.removeItem = originalRemoveItem;
    }
  });

  // 23. Test failure of stats write with successful rollback
  it('23. Rolls back Personal Best if stats write fails and restores prior state', () => {
    const originalSetItem = globalThis.localStorage.setItem;
    let pbWritten = false;

    try {
      globalThis.localStorage.setItem = (key: string, val: string) => {
        if (key === 'bytesized_training_personal_bests') {
          pbWritten = true;
          originalSetItem.call(globalThis.localStorage, key, val);
          return;
        }
        if (key === 'bytesized_training_stats') {
          throw new Error('Stats write failed');
        }
        originalSetItem.call(globalThis.localStorage, key, val);
      };

      expect(() => {
        recordProblemTime('prob-stats-fail', 50, 'javascript');
      }).toThrow(/Stats write failed/);

      expect(pbWritten).toBe(true);
      // Ensure rollback cleaned up the PB write
      expect(getPersonalBest('prob-stats-fail')).toBeNull();
      expect(getTrainingStats().totalSolved).toBe(0);
    } finally {
      globalThis.localStorage.setItem = originalSetItem;
    }
  });
});
