import { CodeLanguage, TestCase } from '../types/index';
import { SubmissionVerdict } from '../types/dsa';

export type ExecutionErrorCategory = 'compilation' | 'runtime' | 'timeout' | 'infrastructure';

export interface RunResult {
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  hasError: boolean;
  errorMessage?: string;
  errorCategory?: ExecutionErrorCategory;
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
  errorCategory?: ExecutionErrorCategory;
}

export interface EvaluationSummary {
  verdict: SubmissionVerdict;
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: TestCaseResult[];
  totalTimeMs: number;
  firstFailedIndex?: number;
  errorMessage?: string;
}

/**
 * Safely normalizes an unknown thrown exception into a clean string message.
 * Handles null, undefined, strings, numbers, Error instances, and arbitrary objects safely
 * without throwing secondary exceptions.
 */
export function normalizeError(err: unknown): string {
  if (err instanceof Error) {
    return err.message || err.name || 'Unknown Error';
  }
  if (typeof err === 'string') {
    return err.trim() || 'Unknown error occurred';
  }
  if (err === null || err === undefined) {
    return 'Unknown error (null or undefined exception)';
  }
  if (typeof err === 'number' || typeof err === 'boolean' || typeof err === 'bigint') {
    return String(err);
  }
  if (typeof err === 'object') {
    try {
      if ('message' in err && typeof (err as { message: unknown }).message === 'string') {
        return (err as { message: string }).message;
      }
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

/**
 * Injects execution time guards into loops to prevent infinite loops from hanging the thread.
 */
function injectLoopGuard(sourceCode: string, timeoutMs: number): string {
  const guardHeader = `
    const __exec_start = Date.now();
    let __exec_ticks = 0;
    function __guard_loop() {
      if (++__exec_ticks % 1000 === 0) {
        if (Date.now() - __exec_start > ${timeoutMs}) {
          throw new Error('Time Limit Exceeded: execution exceeded ${timeoutMs}ms limit.');
        }
      }
    }
  `;

  const guarded = sourceCode
    .replace(/\bwhile\s*\(([^)]*)\)\s*\{/g, 'while ($1) { __guard_loop(); ')
    .replace(/\bfor\s*\(([^)]*)\)\s*\{/g, 'for ($1) { __guard_loop(); ')
    .replace(/\bdo\s*\{/g, 'do { __guard_loop(); ');

  return guardHeader + '\n' + guarded;
}

/**
 * Transpiles basic Python syntax to executable JavaScript in client sandbox.
 */
function transpilePythonToJs(code: string): string {
  const lines = code.split('\n');
  const jsLines: string[] = [];
  const indentStack: number[] = [0];

  for (const rawLine of lines) {
    let line = rawLine;
    const commentIdx = line.indexOf('#');
    let comment = '';
    if (commentIdx !== -1) {
      comment = '// ' + line.slice(commentIdx + 1);
      line = line.slice(0, commentIdx);
    }
    const trimmed = line.trim();
    if (!trimmed) {
      if (comment) jsLines.push(comment);
      continue;
    }
    if (/^(import\s+\w+|from\s+\w+\s+import)/.test(trimmed)) {
      throw new Error(`Module imports ('${trimmed}') are not supported in the client sandbox. Use built-in Python constructs or connect a remote execution backend.`);
    }

    let indent = line.search(/\S/);
    if (indent === -1) indent = 0;

    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    let transformed = trimmed;
    transformed = transformed.replace(/f(["'])(.*?)\1/g, (_, __, str) => '`' + str.replace(/\{([^}]+)\}/g, '${$1}') + '`');
    transformed = transformed.replace(/\bTrue\b/g, 'true');
    transformed = transformed.replace(/\bFalse\b/g, 'false');
    transformed = transformed.replace(/\bNone\b/g, 'null');
    // Ternary expressions
    transformed = transformed
      .replace(/print\s*\(\s*(.+?)\s+if\s+(.+?)\s+else\s+(.+?)\s*\)/g, 'print(($2 ? $1 : $3))')
      .replace(/^([^(=]+?)\s*=\s*(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/, '$1 = ($3 ? $2 : $4)');

    if (/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:$/.test(transformed)) {
      transformed = transformed.replace(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:$/, 'function $1($2) {');
      indentStack.push(indent + 4);
    } else if (/^for\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s+in\s+enumerate\s*\((.*?)\)\s*:$/.test(transformed)) {
      transformed = transformed.replace(
        /^for\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s+in\s+enumerate\s*\((.*?)\)\s*:$/,
        'for (const [$1, $2] of ($3).entries()) {'
      );
      indentStack.push(indent + 4);
    } else if (/^for\s+([a-zA-Z_]\w*)\s+in\s+(.*?)\s*:$/.test(transformed)) {
      transformed = transformed.replace(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.*?)\s*:$/, 'for (const $1 of $2) {');
      indentStack.push(indent + 4);
    } else if (/^while\s+(.*?)\s*:$/.test(transformed)) {
      transformed = transformed.replace(/^while\s+(.*?)\s*:$/, 'while ($1) {');
      indentStack.push(indent + 4);
    } else if (/^if\s+(.*?)\s*:$/.test(transformed)) {
      let cond = transformed.replace(/^if\s+(.*?)\s*:$/, '$1');
      cond = cond.replace(/\b([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*)/g, '($2 instanceof Set ? $2.has($1) : ($1 in $2))');
      transformed = `if (${cond}) {`;
      indentStack.push(indent + 4);
    } else if (/^elif\s+(.*?)\s*:$/.test(transformed)) {
      let cond = transformed.replace(/^elif\s+(.*?)\s*:$/, '$1');
      cond = cond.replace(/\b([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*)/g, '($2 instanceof Set ? $2.has($1) : ($1 in $2))');
      transformed = `} else if (${cond}) {`;
    } else if (/^else\s*:$/.test(transformed)) {
      transformed = '} else {';
    } else {
      transformed = transformed
        .replace(/\bset\s*\(\s*\)/g, 'new Set()')
        .replace(/list\s*\(\s*map\s*\(\s*int\s*,\s*(.*?)\.split\s*\(\s*\)\s*\)\s*\)/g, '$1.trim().split(/\\s+/).map(Number)')
        .replace(/map\s*\(\s*int\s*,\s*(.*?)\.split\s*\(\s*\)\s*\)/g, '$1.trim().split(/\\s+/).map(Number)')
        .replace(/\.strip\s*\(\s*\)/g, '.trim()')
        .replace(/\.split\s*\(\s*\)/g, '.trim().split(/\\s+/)')
        .replace(/^([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s*=\s*(.*)$/, 'let [$1, $2] = [$3];')
        .replace(/^([a-zA-Z_]\w*)\s*=\s*([^=].*)$/, 'let $1 = $2;');

      if (!transformed.endsWith(';') && !transformed.endsWith('{') && !transformed.endsWith('}')) {
        transformed += ';';
      }
    }
    jsLines.push(' '.repeat(indent) + transformed + (comment ? ' ' + comment : ''));
  }
  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
  }
  return jsLines.join('\n');
}

/**
 * Transpiles basic C/C++ syntax to executable JavaScript in client sandbox.
 */
function transpileCppToJs(cppCode: string): string {
  return cppCode
    .replace(/^\s*#\s*include\s*<[^>]+>/gm, '// [include]')
    .replace(/^\s*#\s*include\s*"[^"]+"/gm, '// [include]')
    .replace(/using\s+namespace\s+std\s*;/g, '// [using namespace std]')
    .replace(/(?:std::)?vector\s*<[^>]+>\s+([a-zA-Z_]\w*)\s*(?:\([^)]*\))?\s*;/g, 'let $1 = [];')
    .replace(/(?:std::)?unordered_map\s*<[^>]+>\s+([a-zA-Z_]\w*)\s*;/g, 'let $1 = {};')
    .replace(/(?:std::)?unordered_set\s*<[^>]+>\s+([a-zA-Z_]\w*)\s*;/g, 'let $1 = new Set();')
    .replace(/\b(?:void|int|bool|double|float|char\*?|(?:std::)?vector\s*<[^>]+>)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g, (_, fnName, params) => {
      if (fnName === 'main') return 'function main() {';
      const cleanParams = params.replace(/\b(?:const\s+)?(?:int|void|bool|float|double|char|auto|size_t|(?:std::)?vector<[^>]+>|\w+)[*&\s]+([a-zA-Z_]\w*)(?:\[\])?/g, '$1');
      return `function ${fnName}(${cleanParams}) {`;
    })
    .replace(/\b(?:int|float|double|char|long|short|auto)\s+([a-zA-Z_]\w*)\s*\[\s*\d*\s*\]\s*;/g, 'let $1 = [];')
    .replace(/\bfor\s*\(\s*(?:const\s+)?(?:int|char|auto|float|double|size_t|\w+)[*&\s]+([*a-zA-Z_]\w*)\s*:\s*([^)]+)\)\s*\{/g, 'for (const $1 of $2) {')
    .replace(/\bconst\s+(?:int|float|double|char|long|short|auto)\s+([*a-zA-Z_]\w*)/g, 'const $1')
    .replace(/\b(int|float|double|char|long|short|auto|unsigned|size_t|bool)\s+([*a-zA-Z_]\w*)/g, 'let $2')
    .replace(/([a-zA-Z_]\w*)\.count\s*\(([^)]+)\)/g, '($1 instanceof Set ? $1.has($2) : $1[$2] !== undefined)')
    .replace(/\.insert\s*\(([^)]+)\)/g, '.add($1)')
    .replace(/\.size\s*\(\s*\)/g, '.length')
    .replace(/\b(?:std::)?cout\s*<<\s*([^;]+);/g, (_, exprs) => {
      const parts = exprs.split('<<').map((s: string) => s.trim());
      const calls = parts.map((p: string) => {
        if (p === 'std::endl' || p === 'endl') return 'printf("\\n")';
        return `printf("%s", ${p})`;
      });
      return calls.join('; ') + ';';
    })
    .replace(/\b(?:std::)?cin\s*>>\s*([^;]+);/g, (_, varName) => {
      const vars = varName.split('>>').map((v: string) => v.trim()).filter(Boolean);
      return vars.map((v: string) => `scanf("%s", { set: (val) => { ${v} = val; } });`).join(' ');
    })
    .replace(/scanf\s*\(\s*"[^"]*"\s*,\s*([^;)]+)\)\s*;/g, (_, args) => {
      const vars = args.split(',').map((a: string) => a.trim().replace(/^&/, '')).filter(Boolean);
      return vars.map((v: string) => `scanf("%s", { set: (val) => { ${v} = val; } });`).join(' ');
    });
}

/**
 * Executes user code with standard input and captures standard output.
 * Supports JavaScript, Python, C++, and C with client-side sandbox emulation and timeout guard.
 */
export async function executeCodeSandbox(
  code: string,
  language: CodeLanguage,
  stdinInput: string = '',
  timeoutMs: number = 3000
): Promise<RunResult> {
  const startTime = performance.now();

  const runPromise = new Promise<RunResult>((resolve) => {
    try {
      const outputLines: string[] = [];
      const errorLines: string[] = [];
      let errorCategory: ExecutionErrorCategory | undefined;

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
          const guardedCode = injectLoopGuard(code, timeoutMs);
          const runner = new Function('stdin', 'input', guardedCode);
          runner(stdinInput, stdinInput);
        } catch (err) {
          const errMsg = normalizeError(err);
          const isCompile = (err instanceof SyntaxError) || (err instanceof Error && err.name === 'SyntaxError') || errMsg.includes('SyntaxError');
          errorCategory = isCompile ? 'compilation' : 'runtime';
          errorLines.push(isCompile ? `[Syntax/Compilation Error] ${errMsg}` : errMsg);
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
          const js = transpilePythonToJs(code);
          const guardedJs = injectLoopGuard(js, timeoutMs);
          const customSorted = (iter: any) => {
            if (!iter) return iter;
            const arr = Array.from(iter).sort();
            return typeof iter === 'string' ? arr.join('') : arr;
          };
          const customLen = (o: any) => (o && typeof o.length === 'number' ? o.length : (o && typeof o.size === 'number' ? o.size : 0));
          const customSet = (iter?: any) => (iter ? new Set(iter) : new Set());
          const customList = (iter?: any) => (iter ? Array.from(iter) : []);
          const customInt = (v: any) => (isNaN(Number(v)) ? parseInt(String(v), 10) : Math.trunc(Number(v)));
          const pyRunner = new Function('print', 'input', 'sorted', 'len', 'set', 'list', 'int', guardedJs);
          pyRunner(customPrint, customInput, customSorted, customLen, customSet, customList, customInt);

          const rawLines = pyStdout.split('\n');
          if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
            rawLines.pop();
          }
          outputLines.push(...rawLines);
        } catch (pyErr) {
          const errMsg = normalizeError(pyErr);
          const isCompile = (pyErr instanceof SyntaxError) || (pyErr instanceof Error && pyErr.name === 'SyntaxError') || errMsg.includes('transpile') || errMsg.includes('not supported');
          errorCategory = isCompile ? 'compilation' : 'runtime';
          errorLines.push(isCompile ? `[Python Compilation Error] ${errMsg}` : `[Python Error] ${errMsg}`);
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
          const js = transpileCppToJs(code);
          const guardedJs = injectLoopGuard(js, timeoutMs);
          const runner = new Function(
            'printf',
            'scanf',
            'puts',
            'putchar',
            guardedJs + '\nreturn typeof main === "function" ? main() : 0;'
          );
          runner(customPrintf, customScanf, customPuts, customPutchar);

          const rawLines = cStdout.split('\n');
          if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
            rawLines.pop();
          }
          outputLines.push(...rawLines);
        } catch (cErr) {
          const errMsg = normalizeError(cErr);
          const isCompile = (cErr instanceof SyntaxError) || (cErr instanceof Error && cErr.name === 'SyntaxError') || errMsg.includes('Compiler');
          errorCategory = isCompile ? 'compilation' : 'runtime';
          errorLines.push(isCompile ? `[C/C++ Compilation Error] ${errMsg}` : `[Compiler/Runtime Error] ${errMsg}`);
        }
      } else {
        errorCategory = 'compilation';
        errorLines.push(`[Unsupported Language Error] Client execution sandbox only supports JavaScript, Python, C++, and C. Language '${language}' is not supported.`);
      }

      const endTime = performance.now();
      const executionTimeMs = Math.max(1, Math.round(endTime - startTime));

      const hasError = errorLines.length > 0;
      resolve({
        stdout: outputLines.join('\n'),
        stderr: errorLines.join('\n'),
        executionTimeMs,
        hasError,
        errorMessage: hasError ? errorLines.join('\n') : undefined,
        errorCategory: hasError ? errorCategory : undefined
      });
    } catch (unhandled) {
      const endTime = performance.now();
      const errMsg = normalizeError(unhandled);
      resolve({
        stdout: '',
        stderr: errMsg,
        executionTimeMs: Math.max(1, Math.round(endTime - startTime)),
        hasError: true,
        errorMessage: errMsg,
        errorCategory: 'runtime'
      });
    }
  });

  const timeoutPromise = new Promise<RunResult>((resolve) => {
    setTimeout(() => {
      resolve({
        stdout: '',
        stderr: `Time Limit Exceeded: execution exceeded ${timeoutMs}ms limit.`,
        executionTimeMs: timeoutMs,
        hasError: true,
        errorMessage: `Time Limit Exceeded: execution exceeded ${timeoutMs}ms limit.`,
        errorCategory: 'timeout'
      });
    }, timeoutMs);
  });

  return Promise.race([runPromise, timeoutPromise]);
}

/**
 * Normalizes output string for fair diffing (strips trailing whitespace & standardizes line breaks)
 */
export function normalizeOutput(str: string | unknown): string {
  if (typeof str !== 'string') {
    str = str == null ? '' : String(str);
  }
  return (str as string)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Execution adapter abstraction supporting both local client emulation
 * and secure remote sandboxed backends (e.g., Judge0 or Piston proxy).
 */
export interface ExecutionAdapter {
  name: string;
  isAvailable(): boolean;
  execute(
    code: string,
    language: CodeLanguage,
    stdin?: string,
    timeoutMs?: number
  ): Promise<RunResult>;
}

export class ClientSandboxAdapter implements ExecutionAdapter {
  name = 'client-sandbox';
  isAvailable(): boolean {
    return true;
  }
  execute(
    code: string,
    language: CodeLanguage,
    stdin: string = '',
    timeoutMs: number = 3000
  ): Promise<RunResult> {
    return executeCodeSandbox(code, language, stdin, timeoutMs);
  }
}

/**
 * Secure remote execution adapter calling a trusted backend or Supabase Edge Function proxy.
 * Prevents exposing API keys or credentials in client bundles.
 */
export class Judge0ProxyAdapter implements ExecutionAdapter {
  name = 'judge0-proxy';
  private proxyUrl?: string;

  constructor(proxyUrl?: string) {
    this.proxyUrl =
      proxyUrl ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_JUDGE0_PROXY_URL);
  }

  isAvailable(): boolean {
    return !!this.proxyUrl;
  }

  async execute(
    code: string,
    language: CodeLanguage,
    stdin: string = '',
    timeoutMs: number = 5000
  ): Promise<RunResult> {
    if (!this.proxyUrl) {
      throw new Error(
        'Judge0 proxy service is not configured. Set VITE_JUDGE0_PROXY_URL or deploy the Supabase Edge Function proxy.'
      );
    }
    const startTime = performance.now();
    try {
      const resp = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, stdin, timeoutMs }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        return {
          stdout: '',
          stderr: `Judge0 Proxy Error (${resp.status}): ${errText}`,
          executionTimeMs: Math.round(performance.now() - startTime),
          hasError: true,
          errorMessage: `Judge0 Proxy HTTP ${resp.status}`,
          errorCategory: 'infrastructure'
        };
      }
      const data = await resp.json();
      const rawStatusId = data.status?.id ?? data.status_id;
      const statusId = typeof rawStatusId === 'number' ? rawStatusId : (rawStatusId ? Number(rawStatusId) : undefined);

      let hasError = false;
      let errorCategory: ExecutionErrorCategory | undefined;
      let errorMessage: string | undefined = data.errorMessage || data.message;
      const stderr = data.stderr || data.compile_output || '';

      if (statusId !== undefined && !Number.isNaN(statusId)) {
        switch (statusId) {
          case 3: // Accepted
            hasError = !!data.hasError || !!stderr;
            if (hasError) {
              errorCategory = data.errorCategory || 'runtime';
              errorMessage = errorMessage || stderr || 'Execution error';
            }
            break;
          case 4: // Wrong Answer
            hasError = !!data.hasError || !!stderr;
            if (hasError) {
              errorCategory = data.errorCategory || 'runtime';
              errorMessage = errorMessage || stderr || 'Execution error';
            }
            break;
          case 5: // Time Limit Exceeded
            hasError = true;
            errorCategory = 'timeout';
            errorMessage = errorMessage || stderr || data.status?.description || 'Time Limit Exceeded';
            break;
          case 6: // Compilation Error
            hasError = true;
            errorCategory = 'compilation';
            errorMessage = errorMessage || stderr || data.status?.description || 'Compilation Error';
            break;
          case 7: // Runtime Error (SIGSEGV)
          case 8: // Runtime Error (SIGXFSZ)
          case 9: // Runtime Error (SIGFPE)
          case 10: // Runtime Error (SIGABRT)
          case 11: // Runtime Error (NZEC)
          case 12: // Runtime Error (Other)
            hasError = true;
            errorCategory = 'runtime';
            errorMessage = errorMessage || stderr || data.status?.description || 'Runtime Error';
            break;
          case 1: // In Queue (Pending)
          case 2: // Processing (Pending)
            hasError = true;
            errorCategory = 'infrastructure';
            errorMessage = errorMessage || data.status?.description || `Execution pending (${statusId === 1 ? 'In Queue' : 'Processing'}).`;
            break;
          case 13: // Internal Error
            hasError = true;
            errorCategory = 'infrastructure';
            errorMessage = errorMessage || stderr || data.status?.description || 'Judge0 Internal Error';
            break;
          case 14: // Exec Format Error
            hasError = true;
            errorCategory = 'infrastructure';
            errorMessage = errorMessage || stderr || data.status?.description || 'Exec Format Error';
            break;
          default:
            // Unknown status must NEVER be treated as successful execution
            hasError = true;
            errorCategory = 'infrastructure';
            errorMessage = `Unknown Judge0 status (${statusId})${data.status?.description ? `: ${data.status?.description}` : (errorMessage ? `: ${errorMessage}` : '')}`;
            break;
        }
      } else {
        // Fallback when no statusId is provided (e.g. custom proxy or legacy response)
        if (data.hasError || stderr || data.error) {
          hasError = true;
          errorCategory = data.errorCategory || 'runtime';
          errorMessage = errorMessage || stderr || data.error || 'Execution error';
        } else if (data.stdout === undefined && !data.output) {
          // Missing status and output cannot be treated as successful execution
          hasError = true;
          errorCategory = 'infrastructure';
          errorMessage = 'Malformed execution response: missing status and output.';
        }
      }

      return {
        stdout: data.stdout || '',
        stderr,
        executionTimeMs: data.executionTimeMs || Math.round(performance.now() - startTime),
        hasError,
        errorMessage: hasError ? (errorMessage || stderr || 'Execution error') : undefined,
        errorCategory: hasError ? errorCategory : undefined
      };
    } catch (fetchErr) {
      const errMsg = normalizeError(fetchErr);
      return {
        stdout: '',
        stderr: errMsg,
        executionTimeMs: Math.round(performance.now() - startTime),
        hasError: true,
        errorMessage: errMsg,
        errorCategory: 'infrastructure'
      };
    }
  }
}

export function getDefaultExecutionAdapter(): ExecutionAdapter {
  const remoteProxy = new Judge0ProxyAdapter();
  if (remoteProxy.isAvailable()) {
    return remoteProxy;
  }
  return new ClientSandboxAdapter();
}

/**
 * Runs code against an array of test cases and generates a complete evaluation report.
 * Provides accurate submission verdicts:
 * Accepted, Wrong Answer, Compilation Error, Runtime Error, Time Limit Exceeded.
 * Never exposes hidden test inputs or expected outputs to the client.
 */
export async function evaluateTestCases(
  code: string,
  language: CodeLanguage,
  testCases: TestCase[],
  adapter: ExecutionAdapter = getDefaultExecutionAdapter()
): Promise<EvaluationSummary> {
  const startTime = performance.now();

  // Pre-validate suite and all test cases before accessing properties
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return {
      verdict: 'Runtime Error',
      allPassed: false,
      passedCount: 0,
      totalCount: 0,
      results: [],
      totalTimeMs: 0,
      errorMessage: 'Empty or malformed test suite: no test cases provided.'
    };
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    if (
      !tc ||
      typeof tc !== 'object' ||
      typeof tc.input !== 'string' ||
      typeof tc.output !== 'string'
    ) {
      return {
        verdict: 'Runtime Error',
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        results: [],
        totalTimeMs: 0,
        firstFailedIndex: i,
        errorMessage: `Malformed test case at index ${i}: test case must be an object with string input and output.`
      };
    }
  }

  const results: TestCaseResult[] = [];
  let passedCount = 0;
  let firstFailedIndex: number | undefined;
  let firstErrorVerdict: SubmissionVerdict | undefined;
  let firstErrorMessage: string | undefined;

  for (let idx = 0; idx < testCases.length; idx++) {
    const tc = testCases[idx];
    let res: RunResult;
    try {
      res = await adapter.execute(code, language, tc.input);
    } catch (err) {
      const errMsg = normalizeError(err);
      res = {
        stdout: '',
        stderr: errMsg,
        executionTimeMs: 0,
        hasError: true,
        errorMessage: errMsg,
        errorCategory: 'runtime'
      };
    }

    if (!res || typeof res !== 'object') {
      res = {
        stdout: '',
        stderr: 'Malformed execution result from adapter',
        executionTimeMs: 0,
        hasError: true,
        errorMessage: 'Malformed execution result from adapter',
        errorCategory: 'infrastructure'
      };
    }

    const normalizedActual = normalizeOutput(res.stdout);
    const normalizedExpected = normalizeOutput(tc.output);

    // Empty stdout can only pass when execution genuinely succeeded (no error) and expected is empty
    const passed = !res.hasError && normalizedActual === normalizedExpected;
    if (passed) {
      passedCount++;
    } else {
      if (firstFailedIndex === undefined) {
        firstFailedIndex = idx;
        if (res.hasError) {
          firstErrorMessage = res.errorMessage || res.stderr;
          // Prefer structured error category when provided by adapter
          if (res.errorCategory === 'timeout') {
            firstErrorVerdict = 'Time Limit Exceeded';
          } else if (res.errorCategory === 'compilation') {
            firstErrorVerdict = 'Compilation Error';
          } else if (res.errorCategory === 'runtime') {
            firstErrorVerdict = 'Runtime Error';
          } else if (res.errorCategory === 'infrastructure') {
            firstErrorVerdict = 'Infrastructure Error';
          } else {
            // Safe fallback for legacy adapters without errorCategory
            const msg = (firstErrorMessage || '').toLowerCase();
            if (msg.includes('time limit exceeded')) {
              firstErrorVerdict = 'Time Limit Exceeded';
            } else if (
              msg.includes('compiler') ||
              msg.includes('compilation') ||
              msg.includes('syntax') ||
              msg.includes('unexpected') ||
              msg.includes("expected ';'") ||
              msg.includes('semicolon')
            ) {
              firstErrorVerdict = 'Compilation Error';
            } else {
              firstErrorVerdict = 'Runtime Error';
            }
          }
        } else {
          firstErrorVerdict = 'Wrong Answer';
        }
      }
    }

    const isHidden = Boolean(tc.isHidden);
    // Never expose hidden test inputs or expected outputs to the frontend
    const displayInput = isHidden ? '[Hidden Test Case]' : tc.input;
    const displayExpected = isHidden ? '[Hidden Expected Output]' : tc.output;
    const displayActual = isHidden
      ? (passed ? '[Passed]' : (res.hasError ? (res.errorMessage || 'Execution Error') : '[Wrong Output]'))
      : (res.hasError ? (res.errorMessage || 'Execution Error') : res.stdout);

    results.push({
      testCaseId: typeof tc.id === 'string' ? tc.id : `testcase-${idx + 1}`,
      input: displayInput,
      expectedOutput: displayExpected,
      actualOutput: displayActual,
      passed,
      isHidden,
      executionTimeMs: res.executionTimeMs,
      errorMessage: res.hasError ? (res.errorMessage || res.stderr) : undefined,
      errorCategory: res.errorCategory
    });
  }

  const allPassed = passedCount === testCases.length && testCases.length > 0;
  const verdict: SubmissionVerdict = allPassed
    ? 'Accepted'
    : (firstErrorVerdict || 'Wrong Answer');

  const endTime = performance.now();
  return {
    verdict,
    allPassed,
    passedCount,
    totalCount: testCases.length,
    results,
    totalTimeMs: Math.round(endTime - startTime),
    firstFailedIndex,
    errorMessage: firstErrorMessage
  };
}
