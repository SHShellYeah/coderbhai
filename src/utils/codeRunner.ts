import { CodeLanguage, TestCase } from '../types';

export interface RunResult {
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  hasError: boolean;
  errorMessage?: string;
}

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
  executionTimeMs: number;
  errorMessage?: string;
}

export interface EvaluationSummary {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: TestCaseResult[];
  totalTimeMs: number;
}

/**
 * Executes user code with standard input and captures standard output.
 * Supports JavaScript, Python, C++, and C with client-side sandbox emulation.
 */
export async function executeCodeSandbox(
  code: string,
  language: CodeLanguage,
  stdinInput: string = ''
): Promise<RunResult> {
  const startTime = performance.now();

  return new Promise((resolve) => {
    try {
      const outputLines: string[] = [];
      const errorLines: string[] = [];

      if (language === 'javascript') {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args: unknown[]) => {
          outputLines.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        };
        console.error = (...args: unknown[]) => {
          errorLines.push(args.map(a => String(a)).join(' '));
        };
        console.warn = (...args: unknown[]) => {
          outputLines.push(args.map(a => String(a)).join(' '));
        };

        try {
          // Provide 'stdin' variable for JS scripts that read from standard input
          const runner = new Function('stdin', 'input', code);
          runner(stdinInput, stdinInput);
        } catch (err) {
          errorLines.push((err as Error).message);
        } finally {
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
        }
      } else if (language === 'python') {
        let pyStdout = '';
        const customPrint = (...args: unknown[]) => {
          pyStdout += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
        };

        const stdinLines = stdinInput.split('\n');
        let stdinIndex = 0;
        const customInput = () => {
          if (stdinIndex < stdinLines.length) {
            return stdinLines[stdinIndex++];
          }
          return '';
        };

        try {
          // Basic client-side Python transpilation for coding challenges
          const js = code
            // f-strings
            .replace(/f(["'])(.*?)\1/g, (_, __, str) => '`' + str.replace(/\{([^}]+)\}/g, '${$1}') + '`')
            // Python comments to JS comments
            .replace(/#.*$/gm, (match) => '// ' + match.slice(1))
            // Python boolean / None
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false')
            .replace(/\bNone\b/g, 'null')
            // range(a, b) -> Array.from({length: b - a}, (_, i) => a + i)
            .replace(/\brange\s*\(\s*(\d+)\s*,\s*([^)]+)\s*\)/g, 'Array.from({length: ($2) - ($1)}, (_, idx) => ($1) + idx)')
            .replace(/\brange\s*\(\s*([^)]+)\s*\)/g, 'Array.from({length: $1}, (_, idx) => idx)')
            // Simple assignments
            .replace(/^([a-zA-Z_]\w*)\s*=\s*([^=].*)$/gm, 'let $1 = $2;');

          const pyRunner = new Function('print', 'input', js);
          pyRunner(customPrint, customInput);

          const rawLines = pyStdout.split('\n');
          if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
            rawLines.pop();
          }
          outputLines.push(...rawLines);
        } catch (pyErr) {
          errorLines.push(`[Python Error] ${(pyErr as Error).message}`);
        }
      } else if (language === 'c' || language === 'cpp') {
        let cStdout = '';
        const customPrintf = (formatStr: unknown, ...args: unknown[]) => {
          if (typeof formatStr !== 'string') {
            cStdout += String(formatStr ?? '');
            return;
          }

          let str = formatStr.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
          let argIdx = 0;

          str = str.replace(/%(\.[0-9]+)?([dfcspe%])/gi, (match, precision, type) => {
            const lower = type.toLowerCase();
            if (match === '%%') return '%';
            if (argIdx >= args.length) return match;
            const val = args[argIdx++];

            if (lower === 'd' || lower === 'i') {
              const num = Number(val);
              return isNaN(num) ? String(val) : String(Math.trunc(num));
            }
            if (lower === 'f' || lower === 'e') {
              const num = Number(val);
              if (isNaN(num)) return String(val);
              const prec = precision ? parseInt(precision.slice(1), 10) : 6;
              return num.toFixed(prec);
            }
            if (lower === 'c') {
              if (typeof val === 'number') return String.fromCharCode(val);
              return String(val)[0] || '';
            }
            if (lower === 's') {
              return String(val);
            }
            return String(val);
          });

          cStdout += str;
        };

        const customPuts = (str: string) => {
          cStdout += str + '\n';
        };

        const customPutchar = (ch: unknown) => {
          if (typeof ch === 'number') cStdout += String.fromCharCode(ch);
          else cStdout += String(ch);
        };

        // Stdin buffer for scanf / cin
        const stdinTokens = stdinInput.trim().split(/\s+/).filter(Boolean);
        let tokenIdx = 0;

        const customScanf = (_: string, ...targets: any[]) => {
          let count = 0;
          for (const target of targets) {
            if (tokenIdx < stdinTokens.length) {
              const token = stdinTokens[tokenIdx++];
              if (typeof target === 'object' && target !== null && 'set' in target) {
                target.set(isNaN(Number(token)) ? token : Number(token));
                count++;
              }
            }
          }
          return count;
        };

        try {
          const js = code
            .replace(/^\s*#\s*include\s*<[^>]+>/gm, '// [include]')
            .replace(/^\s*#\s*include\s*"[^"]+"/gm, '// [include]')
            .replace(/using\s+namespace\s+std\s*;/g, '// [using namespace std]')
            .replace(/\b(?:int|void)\s+main\s*\([^)]*\)\s*\{/g, 'function main() {')
            .replace(/\bconst\s+(?:int|float|double|char|long|short|auto)\s+([*a-zA-Z_]\w*)/g, 'const $1')
            .replace(
              /\b(int|float|double|char|long|short|auto|unsigned|size_t)\s+([*a-zA-Z_]\w*)/g,
              'let $2'
            )
            .replace(/\b(?:std::)?cout\s*<<\s*([^;]+);/g, (_, exprs) => {
              const parts = exprs.split('<<').map((s: string) => s.trim());
              const calls = parts.map((p: string) => {
                if (p === 'std::endl' || p === 'endl') return 'printf("\\n")';
                return `printf("%s", ${p})`;
              });
              return calls.join('; ') + ';';
            })
            .replace(/\b(?:std::)?cin\s*>>\s*([^;]+);/g, (_, varName) => {
              return `scanf("%s", { set: (v) => { ${varName.trim()} = v; } });`;
            });

          const runner = new Function(
            'printf',
            'scanf',
            'puts',
            'putchar',
            js + '\nreturn typeof main === "function" ? main() : 0;'
          );
          runner(customPrintf, customScanf, customPuts, customPutchar);

          const rawLines = cStdout.split('\n');
          if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
            rawLines.pop();
          }
          outputLines.push(...rawLines);
        } catch (cErr) {
          errorLines.push(`[Compiler/Runtime Error] ${(cErr as Error).message}`);
        }
      }

      const endTime = performance.now();
      const executionTimeMs = Math.max(1, Math.round(endTime - startTime));

      const hasError = errorLines.length > 0;
      resolve({
        stdout: outputLines.join('\n'),
        stderr: errorLines.join('\n'),
        executionTimeMs,
        hasError,
        errorMessage: hasError ? errorLines.join('\n') : undefined
      });
    } catch (unhandled) {
      const endTime = performance.now();
      resolve({
        stdout: '',
        stderr: (unhandled as Error).message,
        executionTimeMs: Math.max(1, Math.round(endTime - startTime)),
        hasError: true,
        errorMessage: (unhandled as Error).message
      });
    }
  });
}

/**
 * Normalizes output string for fair diffing (strips trailing whitespace & standardizes line breaks)
 */
export function normalizeOutput(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Runs code against an array of test cases and generates a complete evaluation report.
 */
export async function evaluateTestCases(
  code: string,
  language: CodeLanguage,
  testCases: TestCase[]
): Promise<EvaluationSummary> {
  const startTime = performance.now();
  const results: TestCaseResult[] = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const res = await executeCodeSandbox(code, language, tc.input);
    const normalizedActual = normalizeOutput(res.stdout);
    const normalizedExpected = normalizeOutput(tc.output);

    const passed = !res.hasError && normalizedActual === normalizedExpected;
    if (passed) passedCount++;

    results.push({
      testCaseId: tc.id,
      input: tc.input,
      expectedOutput: tc.output,
      actualOutput: res.hasError ? (res.errorMessage || 'Execution Error') : res.stdout,
      passed,
      isHidden: !!tc.isHidden,
      executionTimeMs: res.executionTimeMs,
      errorMessage: res.hasError ? res.errorMessage : undefined
    });
  }

  const endTime = performance.now();
  return {
    allPassed: passedCount === testCases.length,
    passedCount,
    totalCount: testCases.length,
    results,
    totalTimeMs: Math.round(endTime - startTime)
  };
}
