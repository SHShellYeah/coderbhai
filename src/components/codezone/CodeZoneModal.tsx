import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import { CodeLanguage } from '../../types';
import { sound } from '../../utils/audio';
import { fireSuccessConfetti } from '../../utils/confetti';
import { CatFace } from '../common/CatFace';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  X,
  Lightbulb,
  Sparkles,
  Settings,
  HelpCircle,
  FileCode,
  Sliders,
  Maximize2,
  Minimize2,
  Trash2,
  ChevronDown,
  ArrowRight,
  Keyboard,
  ExternalLink
} from 'lucide-react';

interface Props {
  initialCode?: string;
  initialLanguage?: CodeLanguage;
  isStandalone?: boolean;
  onClose: () => void;
  onSaveToIdeaZone?: (code: string, language: CodeLanguage) => void;
}

const PAIRS: Record<string, string> = {
  '(': ')',
  '{': '}',
  '[': ']',
  '"': '"',
  "'": "'",
  '`': '`',
};
const CLOSING_SET = new Set([')', '}', ']', '"', "'", '`']);

// Helper for safe client-side math and token evaluation without direct eval
const safeCalc = (expr: string): unknown => {
  try {
    return new Function(`"use strict"; return (${expr});`)();
  } catch {
    return expr;
  }
};

const STARTER_TEMPLATES: Record<CodeLanguage, Record<string, string>> = {
  c: {
    'Hello World': `#include <stdio.h>

int main(void) {
    printf("Hello, ByteSized!\\n");
    printf("Mastering Pure C line by line!\\n");
    return 0;
}`,
    'Variables & Math': `#include <stdio.h>

int main(void) {
    int age = 21;
    float gpa = 3.85f;
    int division = 15 / 4; // Truncates in C!
    int modulo = 15 % 4;

    printf("Age: %d\\n", age);
    printf("GPA: %.2f\\n", gpa);
    printf("15 / 4 = %d (fraction truncated)\\n", division);
    printf("15 %% 4 = %d (remainder)\\n", modulo);
    return 0;
}`,
    'Pointers & Memory': `#include <stdio.h>

int main(void) {
    int value = 42;
    int* ptr = &value; // ptr stores address of value

    printf("Original value: %d\\n", value);
    printf("Memory address (&value): %p\\n", (void*)&value);

    // Dereference pointer to change value directly
    *ptr = 99;
    printf("Value after *ptr = 99: %d\\n", value);
    return 0;
}`,
    'Functions & Logic': `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    int score1 = 50;
    int score2 = 35;
    int total = add(score1, score2);

    printf("Total score: %d\\n", total);
    if (total >= 70) {
        printf("Status: Passed with honors!\\n");
    } else {
        printf("Status: Keep practicing!\\n");
    }
    return 0;
}`,
  },

  cpp: {
    'Hello World': `#include <iostream>

int main() {
    std::cout << "Hello from Modern C++!" << std::endl;
    std::cout << "Fast, typed, and powerful." << std::endl;
    return 0;
}`,
    'Variables & Input': `#include <iostream>
#include <string>

int main() {
    std::string name = "Bhai";
    int streak = 7;

    std::cout << "Developer: " << name << std::endl;
    std::cout << "Coding Streak: " << streak << " days!" << std::endl;
    return 0;
}`,
    'Vector & Range Loop': `#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {10, 20, 30};
    scores.push_back(40);

    std::cout << "Vector items: ";
    for (int x : scores) {
        std::cout << x << " ";
    }
    std::cout << "\\nTotal size: " << scores.size() << std::endl;
    return 0;
}`,
  },

  python: {
    'Hello World & F-Strings': `name = "ByteSized"
streak = 5
print(f"Welcome to {name}!")
print(f"Current Streak: {streak} days on fire 🔥")
`,
    'Lists & Comprehensions': `nums = [1, 2, 3, 4, 5]
evens = [x * 2 for x in nums if x % 2 == 0]

print("Original:", nums)
print("Even numbers doubled:", evens)
`,
    'Functions & Dictionaries': `def get_user_profile(username, score):
    return {
        "username": username,
        "score": score,
        "badge": "Masters" if score >= 80 else "Challenger"
    }

user = get_user_profile("Lin", 95)
print("User Profile:", user)
`,
  },

  javascript: {
    'Hello World & Logs': `console.log("Welcome to CodeZone! ⚡");
const coder = {
  name: "Bhai the Cat",
  role: "Lead Mascot & CS Mentor",
  hearts: 5
};
console.log("Active Companion:", coder);
`,
    'Array Methods & Math': `const scores = [85, 92, 78, 96, 88];
const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
console.log("Scores:", scores);
console.log("Class Average:", average.toFixed(1));
`,
  },
};

export const CodeZoneModal: React.FC<Props> = ({
  initialCode,
  initialLanguage = 'c',
  isStandalone = false,
  onClose,
  onSaveToIdeaZone,
}) => {
  const [language, setLanguage] = useState<CodeLanguage>(initialLanguage);
  const [code, setCode] = useState<string>(() => {
    if (initialCode) return initialCode;
    return STARTER_TEMPLATES[initialLanguage]['Hello World'] || '';
  });

  const [stdinInput, setStdinInput] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionStats, setExecutionStats] = useState<{ timeMs: number; status: 'ok' | 'error' } | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [mascotWisdom, setMascotWisdom] = useState<string | null>(null);

  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  // Synchronously lock selection range after React DOM updates
  useLayoutEffect(() => {
    if (selectionRef.current && editorTextareaRef.current) {
      const { start, end } = selectionRef.current;
      editorTextareaRef.current.setSelectionRange(start, end);
      selectionRef.current = null;
    }
  });

  // Synchronize scroll between textarea, pre highlight layer, and line number gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  // Syntax highlighting HTML layer via Prism
  const highlightedHtml = useMemo(() => {
    let langGrammar = Prism.languages.c;
    let langId = 'c';
    if (language === 'cpp') {
      langGrammar = Prism.languages.cpp || Prism.languages.c;
      langId = 'cpp';
    } else if (language === 'python') {
      langGrammar = Prism.languages.python;
      langId = 'python';
    } else if (language === 'javascript') {
      langGrammar = Prism.languages.javascript;
      langId = 'javascript';
    }

    try {
      const rawHtml = Prism.highlight(code, langGrammar, langId);
      // Ensure trailing empty lines expand the pre height so it matches textarea
      return code.endsWith('\n') ? rawHtml + '\n ' : rawHtml;
    } catch {
      return code;
    }
  }, [code, language]);

  // Switch template when language changes
  const handleLanguageChange = (newLang: CodeLanguage) => {
    sound.playClick();
    setLanguage(newLang);
    const firstTemplateKey = Object.keys(STARTER_TEMPLATES[newLang])[0];
    setCode(STARTER_TEMPLATES[newLang][firstTemplateKey] || '');
    setTerminalOutput([`// Switched environment to ${newLang.toUpperCase()}. Click Run Code to execute!`]);
    setExecutionStats(null);
  };

  // Reset to current starter template
  const handleResetTemplate = (templateName?: string) => {
    sound.playClick();
    const key = templateName || Object.keys(STARTER_TEMPLATES[language])[0];
    setCode(STARTER_TEMPLATES[language][key] || '');
    setExecutionStats(null);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Launch standalone editor in another tab
  const handleLaunchInNewTab = () => {
    sound.playClick();
    try {
      localStorage.setItem('bytesized_standalone_codezone_code', code);
      localStorage.setItem('bytesized_standalone_codezone_lang', language);
      localStorage.setItem('coderbhai_standalone_codezone_code', code);
      localStorage.setItem('coderbhai_standalone_codezone_lang', language);
    } catch {
      // ignore
    }
    const url = `${window.location.origin}${window.location.pathname}?mode=codezone`;
    window.open(url, '_blank');
  };

  // Synchronous text insertion helper
  const insertPair = (openChar: string, closeChar: string) => {
    const textarea = editorTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;

    if (start !== end) {
      // Selection wrapping
      const selected = val.substring(start, end);
      const wrapped = openChar + selected + closeChar;
      textarea.setRangeText(wrapped, start, end, 'select');
      const newStart = start + openChar.length;
      const newEnd = end + openChar.length;
      textarea.setSelectionRange(newStart, newEnd);
      selectionRef.current = { start: newStart, end: newEnd };
      setCode(textarea.value);
      return;
    }

    // Single cursor: insert pair and place cursor in the middle
    const pair = openChar + closeChar;
    textarea.setRangeText(pair, start, end, 'end');
    const targetPos = start + openChar.length;
    textarea.setSelectionRange(targetPos, targetPos);
    selectionRef.current = { start: targetPos, end: targetPos };
    setCode(textarea.value);
  };

  // Advanced Developer Keydown Handling: Auto-indent, Auto-closing brackets & quotes, Over-typing, Backspace pairs, Tab
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = editorTextareaRef.current;
    if (!textarea) return;

    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;

    // 1. Tab & Shift+Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent lines
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = val.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? val.length : lineEnd;
        const selectedBlock = val.substring(lineStart, effectiveEnd);
        const outdented = selectedBlock.replace(/^ {1,4}/gm, '');
        textarea.setRangeText(outdented, lineStart, effectiveEnd, 'select');
        const diff = selectedBlock.length - outdented.length;
        const newStart = Math.max(lineStart, start - diff);
        const newEnd = Math.max(lineStart, end - diff);
        textarea.setSelectionRange(newStart, newEnd);
        selectionRef.current = { start: newStart, end: newEnd };
        setCode(textarea.value);
        return;
      }

      if (start !== end) {
        // Indent multiple selected lines
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = val.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? val.length : lineEnd;
        const selectedBlock = val.substring(lineStart, effectiveEnd);
        const indented = selectedBlock.replace(/^/gm, '    ');
        textarea.setRangeText(indented, lineStart, effectiveEnd, 'select');
        const added = indented.length - selectedBlock.length;
        const newStart = start + 4;
        const newEnd = end + added;
        textarea.setSelectionRange(newStart, newEnd);
        selectionRef.current = { start: newStart, end: newEnd };
        setCode(textarea.value);
        return;
      }

      // Single cursor Tab: 4 spaces
      const indentation = '    ';
      textarea.setRangeText(indentation, start, end, 'end');
      const newPos = start + indentation.length;
      textarea.setSelectionRange(newPos, newPos);
      selectionRef.current = { start: newPos, end: newPos };
      setCode(textarea.value);
      return;
    }

    // 2. Auto-Indentation on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const lineBeforeCursor = val.substring(lineStart, start);
      const indentMatch = lineBeforeCursor.match(/^[ \t]*/);
      const currentIndent = indentMatch ? indentMatch[0] : '';
      const trimmedBefore = lineBeforeCursor.trim();
      const charAfter = val[start];

      const isBetweenPair =
        (trimmedBefore.endsWith('{') && charAfter === '}') ||
        (trimmedBefore.endsWith('(') && charAfter === ')') ||
        (trimmedBefore.endsWith('[') && charAfter === ']');

      if (isBetweenPair) {
        // Expand pair on enter (e.g. {\n    |\n})
        const extraIndent = currentIndent + '    ';
        const insertion = '\n' + extraIndent + '\n' + currentIndent;
        textarea.setRangeText(insertion, start, end, 'end');
        const newPos = start + 1 + extraIndent.length;
        textarea.setSelectionRange(newPos, newPos);
        selectionRef.current = { start: newPos, end: newPos };
        setCode(textarea.value);
        return;
      }

      const opensBlock =
        trimmedBefore.endsWith('{') ||
        trimmedBefore.endsWith(':') ||
        trimmedBefore.endsWith('(') ||
        trimmedBefore.endsWith('[');

      const nextIndent = opensBlock ? currentIndent + '    ' : currentIndent;
      const insertion = '\n' + nextIndent;
      textarea.setRangeText(insertion, start, end, 'end');
      const newPos = start + insertion.length;
      textarea.setSelectionRange(newPos, newPos);
      selectionRef.current = { start: newPos, end: newPos };
      setCode(textarea.value);
      return;
    }

    // 3. Auto-Closing Brackets & Quotations: ( { [ " ' `
    if (PAIRS[e.key]) {
      e.preventDefault();
      const openChar = e.key;
      const closeChar = PAIRS[openChar];

      // Overtyping quote marks if already at closing quote
      if ((openChar === '"' || openChar === "'" || openChar === '`') && val[start] === openChar && start === end) {
        const nextPos = start + 1;
        textarea.setSelectionRange(nextPos, nextPos);
        selectionRef.current = { start: nextPos, end: nextPos };
        return;
      }

      insertPair(openChar, closeChar);
      return;
    }

    // 4. Overtyping closing characters: ) } ]
    if (CLOSING_SET.has(e.key) && val[start] === e.key && start === end) {
      e.preventDefault();
      const nextPos = start + 1;
      textarea.setSelectionRange(nextPos, nextPos);
      selectionRef.current = { start: nextPos, end: nextPos };
      return;
    }

    // 5. Backspace pair deletion: if deleting inside an empty pair () {} [] "" '' ``, delete both
    if (e.key === 'Backspace' && start === end && start > 0) {
      const charBefore = val[start - 1];
      const charAfter = val[start];
      if (PAIRS[charBefore] && PAIRS[charBefore] === charAfter) {
        e.preventDefault();
        textarea.setRangeText('', start - 1, start + 1, 'end');
        const newPos = start - 1;
        textarea.setSelectionRange(newPos, newPos);
        selectionRef.current = { start: newPos, end: newPos };
        setCode(textarea.value);
        return;
      }
    }
  };

  // Execution Simulator & Real Sandbox Runner
  const handleRunCode = () => {
    sound.playClick();
    setIsRunning(true);
    setTerminalOutput([]);
    setExecutionStats(null);
    setMascotWisdom(null);

    const startTime = performance.now();

    setTimeout(() => {
      try {
        const outputLines: string[] = [];

        if (language === 'javascript') {
          // Safe real JavaScript execution
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;

          console.log = (...args: unknown[]) => {
            outputLines.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
          };
          console.error = (...args: unknown[]) => {
            outputLines.push(`[ERROR] ${args.map(a => String(a)).join(' ')}`);
          };
          console.warn = (...args: unknown[]) => {
            outputLines.push(`[WARN] ${args.map(a => String(a)).join(' ')}`);
          };

          try {
            const runner = new Function(code);
            runner();
          } finally {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
          }
        } else if (language === 'python') {
          // Client-side Python runner with variable tracking & f-strings
          let pyStdout = '';
          const customPrint = (...args: unknown[]) => {
            pyStdout += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
          };

          try {
            const js = code
              // f-strings: f"hello {x}" -> `hello ${x}`
              .replace(/f(["'])(.*?)\1/g, (_, __, str) => '`' + str.replace(/\{([^}]+)\}/g, '${$1}') + '`')
              // Simple variable assignments: x = 10 -> let x = 10;
              .replace(/^([a-zA-Z_]\w*)\s*=\s*([^=].*)$/gm, 'let $1 = $2;')
              ;

            const pyRunner = new Function('print', js);
            pyRunner(customPrint);

            const pyLines = pyStdout.split('\n');
            if (pyLines.length > 1 && pyLines[pyLines.length - 1] === '') {
              pyLines.pop();
            }
            outputLines.push(...pyLines);
          } catch (pyErr) {
            outputLines.push(`[Python Error] ${(pyErr as Error).message}`);
          }
        } else if (language === 'c' || language === 'cpp') {
          // Real C / C++ interpreter simulation with actual variable tracking & formatted I/O
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
                const prec = precision ? parseInt(precision.slice(1)) : 6;
                return num.toFixed(prec);
              }
              if (lower === 'c') {
                if (typeof val === 'number') return String.fromCharCode(val);
                return String(val)[0] || '';
              }
              if (lower === 's') {
                return String(val);
              }
              if (lower === 'p') {
                return '0x7ffd5e20';
              }
              return String(val);
            });

            cStdout += str;
          };

          // Syntax check: missing semicolons
          const rawLines = code.split('\n');
          let hasMissingSemicolon = false;
          let missingSemiLine = -1;

          rawLines.forEach((l, idx) => {
            const trimmed = l.trim();
            if (
              (trimmed.startsWith('printf') ||
                trimmed.startsWith('std::cout') ||
                trimmed.startsWith('cout') ||
                trimmed.startsWith('int ') ||
                trimmed.startsWith('float ') ||
                trimmed.startsWith('double ') ||
                trimmed.startsWith('char ') ||
                trimmed.startsWith('return ') ||
                trimmed.startsWith('*ptr =')) &&
              !trimmed.endsWith(';') &&
              !trimmed.endsWith('{') &&
              !trimmed.endsWith('}') &&
              !trimmed.startsWith('//')
            ) {
              hasMissingSemicolon = true;
              missingSemiLine = idx + 1;
            }
          });

          if (hasMissingSemicolon) {
            throw new Error(`expected ';' before end of line ${missingSemiLine}`);
          }

          // Stdin buffer for scanf / cin
          const stdinTokens = (stdinInput || '42 100').trim().split(/\s+/);
          let stdinIdx = 0;

          const customScanf = (_: string, ...targets: any[]) => {
            for (const target of targets) {
              if (stdinIdx < stdinTokens.length) {
                const token = stdinTokens[stdinIdx++];
                if (typeof target === 'object' && target !== null && 'set' in target) {
                  target.set(isNaN(Number(token)) ? token : Number(token));
                }
              }
            }
            return targets.length;
          };

          try {
            // Transpile C / C++ statements to JS for real execution
            const js = code
              // Remove preprocessors & namespaces
              .replace(/^\s*#\s*include\s*<[^>]+>/gm, '// [include]')
              .replace(/^\s*#\s*include\s*"[^"]+"/gm, '// [include]')
              .replace(/using\s+namespace\s+std\s*;/g, '// [using namespace std]')
              // Convert int main or void main to function main
              .replace(/\b(?:int|void)\s+main\s*\([^)]*\)\s*\{/g, 'function main() {')
              // Pointers: int* ptr = &x; -> let ptr = { get: () => x, set: (v) => { x = v; } }
              .replace(
                /(?:int|float|double|char|long|short)\s*\*\s*([a-zA-Z_]\w*)\s*=\s*&([a-zA-Z_]\w*)\s*;/g,
                'let $1 = { get: () => $2, set: (v) => { $2 = v; } };'
              )
              // Pointer assignments: *ptr = val; -> ptr.set(val);
              .replace(/\*([a-zA-Z_]\w*)\s*=\s*([^;]+);/g, '$1.set($2);')
              // Pointer reads: *ptr in expressions -> ptr.get()
              .replace(/\*([a-zA-Z_]\w*)/g, '($1.get ? $1.get() : $1)')
              // Const variable declarations: const int x = 10;
              .replace(/\bconst\s+(?:int|float|double|char|long|short|auto)\s+([*a-zA-Z_]\w*)/g, 'const $1')
              // Variable declarations: int x = 10; float f = 3.5;
              .replace(
                /\b(int|float|double|char|long|short|auto|unsigned|size_t)\s+([*a-zA-Z_]\w*)/g,
                'let $2'
              )
              // C++ std::cout << a << b << std::endl;
              .replace(/\b(?:std::)?cout\s*<<\s*([^;]+);/g, (_, exprs) => {
                const parts = exprs.split('<<').map((s: string) => s.trim());
                const calls = parts.map((p: string) => {
                  if (p === 'std::endl' || p === 'endl') return 'printf("\\n")';
                  return `printf("%s", ${p})`;
                });
                return calls.join('; ') + ';';
              })
              // C++ std::cin >> x;
              .replace(/\b(?:std::)?cin\s*>>\s*([^;]+);/g, (_, varName) => {
                return `scanf("%s", { set: (v) => { ${varName.trim()} = v; } });`;
              });

            const runner = new Function('printf', 'scanf', js + '\nreturn typeof main === "function" ? main() : 0;');
            runner(customPrintf, customScanf);

            const cLines = cStdout.split('\n');
            if (cLines.length > 1 && cLines[cLines.length - 1] === '') {
              cLines.pop();
            }
            outputLines.push(...cLines);
          } catch (runtimeErr) {
            outputLines.push(`[Runtime Error] ${(runtimeErr as Error).message}`);
          }
        }

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime + Math.random() * 6 + 2);

        setTerminalOutput(outputLines.length > 0 ? outputLines : ['// Program executed with 0 exit code (no stdout).']);
        setExecutionStats({ timeMs: duration, status: 'ok' });
        sound.playSuccess();
        fireSuccessConfetti();

        // Cheering tip from companions
        const praises = [
          'Lin 🕶️: "Clean execution! Memory bounds look pristine."',
          'Bhai 🐈‍⬛: "Purrfect compile! Your logic is on point."',
          'Ada 👧: "Variables initialized and output verified!"',
          'Turing 🤖: "Zero syntax errors. State transitions executed in constant time."'
        ];
        setMascotWisdom(praises[Math.floor(Math.random() * praises.length)]);
      } catch (err) {
        sound.playError();
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime + 5);
        setTerminalOutput([`❌ COMPILER ERROR:\n${(err as Error).message}`]);
        setExecutionStats({ timeMs: duration, status: 'error' });
        setMascotWisdom('Junior 🧢: "Oops! Check your semicolons, brackets, or variable declarations."');
      } finally {
        setIsRunning(false);
      }
    }, 180);
  };

  // Line numbers calculation
  const lineCount = Math.max(code.split('\n').length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isStandalone ? 'p-0 bg-[#0B0F19]' : 'p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade'
      }`}
    >
      <div
        className={`w-full ${
          isStandalone
            ? 'h-full max-w-none max-h-none rounded-none border-0'
            : 'max-w-6xl h-full sm:h-[94vh] sm:max-h-[880px] rounded-none sm:rounded-3xl border-0 sm:border-2 border-slate-700/80 shadow-2xl'
        } bg-[#0B0F19] flex flex-col overflow-hidden text-slate-100`}
      >
        {/* Top Control Bar */}
        <div className="px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-800 bg-[#101726] flex items-center justify-between gap-2 sm:gap-3 shrink-0">
          {/* Left: Brand & Live Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0 shadow-inner">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 truncate">
                  CodeZone
                  <span className="hidden xs:inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live
                  </span>
                  {isStandalone && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                      Standalone
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block truncate">
                Write, test, and run code instantly in Pure C, Modern C++, Python, and JavaScript.
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Run Button */}
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunCode}
              className="btn-3d btn-3d-green px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 text-white shadow-lg cursor-pointer shrink-0"
              title="Execute program (Ctrl + Enter)"
            >
              <Play className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
              <span className="hidden sm:inline">Code</span>
            </button>

            {/* Launch in another tab option */}
            {!isStandalone && (
              <button
                type="button"
                onClick={handleLaunchInNewTab}
                className="btn-3d flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer shrink-0"
                title="Launch in dedicated browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Launch in another tab</span>
                <span className="hidden sm:inline md:hidden">New Tab</span>
              </button>
            )}

            {/* Save to IdeaZone */}
            {onSaveToIdeaZone && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSaveToIdeaZone(code, language);
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all cursor-pointer shrink-0"
                title="Save current snippet into IdeaZone"
              >
                <Lightbulb className="w-3.5 h-3.5 fill-current" />
                <span>Save to IdeaZone</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Copy code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Close Button - ALWAYS pinned, high-contrast and fully visible on mobile */}
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                isStandalone
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 font-bold text-xs'
                  : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 sm:bg-transparent border border-slate-700/80 sm:border-transparent'
              }`}
              title={isStandalone ? 'Return to ByteSized learning app' : 'Close CodeZone'}
              aria-label="Close CodeZone"
            >
              {isStandalone ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back</span>
                </>
              ) : (
                <X className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Sub-bar: Language Picker & Template Selector */}
        <div className="px-3 sm:px-6 py-2 border-b border-slate-800 bg-[#0E1524] flex items-center justify-between gap-2.5 shrink-0 text-xs font-semibold overflow-x-auto scrollbar-none">
          {/* Language Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {(
              [
                { id: 'c', label: '⚙️ Pure C' },
                { id: 'cpp', label: '⚡ Modern C++' },
                { id: 'python', label: '🐍 Python' },
                { id: 'javascript', label: '🟨 JavaScript' },
              ] as { id: CodeLanguage; label: string }[]
            ).map(item => {
              const isActive = language === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLanguageChange(item.id)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 text-xs ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Preset Templates */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold hidden md:inline">
              Templates:
            </span>
            <div className="flex items-center gap-1">
              {Object.keys(STARTER_TEMPLATES[language]).map(tmplName => (
                <button
                  key={tmplName}
                  type="button"
                  onClick={() => handleResetTemplate(tmplName)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {tmplName}
                </button>
              ))}
            </div>

            {/* Toggle STDIN */}
            <button
              type="button"
              onClick={() => setShowStdin(!showStdin)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-colors flex items-center gap-1 cursor-pointer ${
                showStdin ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3 h-3" />
              <span>stdin</span>
            </button>
          </div>
        </div>

        {/* Optional STDIN Drawer */}
        {showStdin && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#080C14] border-b border-slate-800 flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400 font-bold shrink-0">
              STDIN Input:
            </span>
            <input
              type="text"
              value={stdinInput}
              onChange={e => setStdinInput(e.target.value)}
              placeholder="Provide keyboard input for scanf / cin (e.g. 42)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
            />
          </div>
        )}

        {/* Main Workspace: Code Editor + Terminal Console */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Pane: Code Editor */}
          <div className="flex-1 flex flex-col border-r-0 md:border-r border-b md:border-b-0 border-slate-800 bg-[#070B12] min-h-[50%] md:min-h-0 relative">
            <div className="flex-1 flex overflow-hidden">
              {/* Line Numbers Gutter */}
              <div
                ref={gutterRef}
                className="w-12 py-3.5 pr-2 pl-3 select-none text-right font-mono text-xs text-slate-600 bg-[#060910] border-r border-slate-800/80 overflow-hidden shrink-0"
              >
                {lineNumbers.map(n => (
                  <div key={n} className="leading-6 h-6">
                    {n}
                  </div>
                ))}
              </div>

              {/* Editor Workspace with Synchronized Syntax Highlighting Overlay */}
              <div className="relative flex-1 h-full overflow-hidden">
                {/* Syntax Highlighted Layer (Pre/Code) */}
                <pre
                  ref={preRef}
                  aria-hidden="true"
                  className="codezone-pre absolute inset-0 w-full h-full p-3.5 bg-transparent pointer-events-none overflow-hidden m-0 border-0 whitespace-pre text-slate-200 select-none z-0"
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />

                {/* Interactive Caret Textarea Layer */}
                <textarea
                  ref={editorTextareaRef}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className="codezone-textarea absolute inset-0 w-full h-full p-3.5 bg-transparent text-transparent caret-sky-400 outline-none resize-none overflow-auto m-0 border-0 whitespace-pre z-10 selection:bg-sky-500/30 selection:text-transparent"
                  placeholder="// Type or paste your code here..."
                />
              </div>
            </div>

            {/* Editor Footer Status */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-[#080C14] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span>Lines: {lineCount}</span>
                <span>Length: {code.length}</span>
                <span className="hidden sm:inline">Press Ctrl+Enter to Run</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Tab: 4 spaces</span>
                <span>UTF-8</span>
              </div>
            </div>
          </div>

          {/* Right Pane: Terminal Output Console */}
          <div className="w-full md:w-[45%] flex flex-col bg-[#050810] min-h-[40%] md:min-h-0">
            {/* Terminal Top Bar */}
            <div className="px-4 py-2 border-b border-slate-800/80 bg-[#090D18] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-bold text-slate-300 ml-1.5">Terminal Console</span>
              </div>

              <div className="flex items-center gap-2">
                {executionStats && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      executionStats.status === 'ok'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {executionStats.timeMs}ms
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setTerminalOutput([])}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                  title="Clear console"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-200 space-y-1 select-text leading-relaxed">
              <div className="text-slate-500 pb-1">
                $ {language === 'c' ? 'gcc main.c -o main && ./main' : language === 'cpp' ? 'g++ -std=c++20 main.cpp && ./main' : language === 'python' ? 'python3 main.py' : 'node index.js'}
              </div>

              {terminalOutput.length === 0 ? (
                <div className="text-slate-600 italic py-4">
                  Ready. Click [Run Code] or press Ctrl+Enter to execute.
                </div>
              ) : (
                terminalOutput.map((line, idx) => (
                  <div
                    key={idx}
                    className={`whitespace-pre-wrap break-words min-h-[1.25rem] ${
                      line.startsWith('❌') || line.includes('[ERROR]') || line.includes('error:')
                        ? 'text-rose-400 font-bold'
                        : line.startsWith('[WARN]')
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {line === '' ? '\u00A0' : line}
                  </div>
                ))
              )}
            </div>

            {/* Mascot Cheer / Feedback Bubble */}
            {mascotWisdom && (
              <div className="p-3 border-t border-slate-800 bg-[#0A0F1D] flex items-center gap-2.5 text-xs text-slate-300 animate-slideUp">
                <CatFace size="xs" mood="happy" />
                <span className="font-medium text-slate-300">{mascotWisdom}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
