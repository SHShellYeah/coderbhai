import { Course, CourseId } from '../types';

export const COURSES: Record<CourseId, Course> = {
  c: {
    id: 'c',
    title: 'C Language',
    shortTitle: 'Pure C',
    tagline: 'Master procedural C, stdio.h, printf/scanf, raw memory, pointers & structs',
    badge: '⚙️ Pure C',
    icon: 'Terminal',
    color: 'from-slate-700 to-cyan-900',
    placementQuestions: [
      {
        id: 'c-place-1',
        type: 'predict-output',
        prompt: 'What does this C code output to the terminal?',
        explanation: 'In C, integer division 15 / 4 truncates towards zero, yielding 3.',
        xpReward: 10,
        difficulty: 'beginner',
        codeSnippet: `#include <stdio.h>
int main(void) {
    int a = 15;
    int b = 4;
    printf("%d", a / b);
    return 0;
}`,
        options: [
          { id: '1', text: '3.75', isCorrect: false },
          { id: '2', text: '3', isCorrect: true },
          { id: '3', text: '4', isCorrect: false },
          { id: '4', text: 'Compilation Error', isCorrect: false },
        ],
      },
      {
        id: 'c-place-2',
        type: 'spot-the-bug',
        prompt: 'Spot the missing address-of (&) operator in scanf:',
        explanation: 'scanf expects the memory address (&score) to store input. Passing score directly without & triggers undefined behavior or a crash!',
        xpReward: 15,
        difficulty: 'intermediate',
        codeLines: [
          'int score = 0;',
          'printf("Enter score: ");',
          'scanf("%d", score); // Missing &!',
          'printf("Score: %d", score);'
        ],
        bugLineIndex: 2,
        bugExplanation: 'scanf requires &score to write input into the memory address of score!'
      },
      {
        id: 'c-place-3',
        type: 'concept-match',
        prompt: 'Match foundational C standard library functions with their purpose:',
        explanation: 'printf writes to stdout, scanf reads from stdin, malloc allocates heap memory, free releases heap bytes.',
        xpReward: 15,
        difficulty: 'intermediate',
        pairs: [
          { id: 'cp1', term: 'printf()', definition: 'Formatted output to terminal (<stdio.h>)' },
          { id: 'cp2', term: 'scanf()', definition: 'Formatted input from keyboard (<stdio.h>)' },
          { id: 'cp3', term: 'malloc(size)', definition: 'Allocates raw heap bytes (<stdlib.h>)' },
          { id: 'cp4', term: 'free(ptr)', definition: 'Releases allocated heap memory back to OS' }
        ]
      },
      {
        id: 'c-place-4',
        type: 'tap-to-fill',
        prompt: 'Allocate an array of 5 integers dynamically in C and safely free it:',
        explanation: 'In C, malloc takes byte size calculated with sizeof(type), and free() releases it.',
        xpReward: 15,
        difficulty: 'advanced',
        codeTemplate: `int* arr = (int*)malloc(5 * {{blank1}}(int));
// do work...
{{blank2}}(arr);`,
        options: ['sizeof', 'free', 'delete', 'new', 'calloc'],
        blanks: [
          { id: 'blank1', correctValue: 'sizeof' },
          { id: 'blank2', correctValue: 'free' }
        ]
      },
      {
        id: 'c-place-5',
        type: 'predict-output',
        prompt: 'What does this C pointer dereference print?',
        explanation: '*ptr = 99 directly updates the value stored at variable val address.',
        xpReward: 20,
        difficulty: 'advanced',
        codeSnippet: `#include <stdio.h>
int main(void) {
    int val = 42;
    int* ptr = &val;
    *ptr = 99;
    printf("%d", val);
    return 0;
}`,
        options: [
          { id: '1', text: '42', isCorrect: false },
          { id: '2', text: '99', isCorrect: true },
          { id: '3', text: 'Address of val', isCorrect: false },
          { id: '4', text: 'Garbage Value', isCorrect: false }
        ]
      }
    ],
    units: [
      {
        id: 'c-u1',
        courseId: 'c',
        unitNumber: 1,
        title: 'Unit 1: First Steps in C: printf & stdio.h',
        description: 'Understand pure procedural C, stdio.h, format specifiers, and pointers',
        color: 'border-cyan-600 bg-cyan-600/10 text-cyan-600 dark:text-cyan-400',
        bannerColor: 'bg-gradient-to-r from-slate-700 to-cyan-900',
        nodes: [
          {
            id: 'c-u1-n1',
            unitId: 'c-u1',
            title: 'Hello C & printf',
            description: 'Learn why C uses stdio.h and printf instead of std::cout',
            iconType: 'terminal',
            teachingIntro: {
              title: 'Your First C Program: printf & stdio.h',
              subtitle: 'Lin 🕶️ & Junior 🧢 introduce the mother of modern languages',
              characterId: 'lin',
              steps: [
                {
                  characterId: 'lin',
                  characterMood: 'teaching',
                  speech: "Welcome to Pure C! 🕶️ In C, there are no classes, no namespaces, and no 'std::cout'.\n\nC is direct and blazing fast. Operating system kernels like Linux and Windows are written in C! To print to the screen, we include <stdio.h> (Standard Input/Output) and use the printf() function.",
                  codeSnippet: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello, World!\\n");\n    return 0;\n}`
                },
                {
                  characterId: 'junior',
                  characterMood: 'thinking',
                  speech: "Wait Lin! 🧢 What is \\n and why does main return 0?",
                  anatomy: [
                    { token: '#include <stdio.h>', explanation: 'Loads standard C I/O tools (printf, scanf).' },
                    { token: 'printf("...")', explanation: 'Prints formatted text to your terminal screen.' },
                    { token: '\\n', explanation: 'Newline character. Moves the cursor down to the next line.' },
                    { token: 'return 0;', explanation: 'Tells the operating system the program executed successfully with 0 errors.' }
                  ],
                  interactiveTry: {
                    prompt: "Assemble your first line of pure C:",
                    tokens: ['printf(', '"Hello, World!\\n"', ');', 'std::cout', '<<'],
                    targetOrder: ['printf(', '"Hello, World!\\n"', ');'],
                    previewOutput: 'Hello, World!\n'
                  }
                }
              ]
            },
            questions: [
              {
                id: 'c-1-1-1',
                type: 'tap-to-fill',
                prompt: 'Complete your first C program to print "Hello from C!":',
                explanation: 'In C, printf() outputs text and is declared inside <stdio.h>.',
                xpReward: 10,
                mentorTip: 'In C we use printf(), NOT std::cout!',
                codeTemplate: `#include <{{blank1}}.h>
int main(void) {
    {{blank2}}("Hello from C!\\n");
    return 0;
}`,
                options: ['stdio', 'printf', 'iostream', 'cout', 'stdlib'],
                blanks: [
                  { id: 'blank1', correctValue: 'stdio' },
                  { id: 'blank2', correctValue: 'printf' }
                ]
              },
              {
                id: 'c-1-1-2',
                type: 'predict-output',
                prompt: 'What does this C code print?',
                explanation: 'printf does not automatically add a newline unless you include "\\n", so consecutive calls print on the same line.',
                xpReward: 10,
                codeSnippet: `#include <stdio.h>
int main(void) {
    printf("Code");
    printf("Lingo");
    return 0;
}`,
                options: [
                  { id: '1', text: 'CodeLingo', isCorrect: true },
                  { id: '2', text: 'Code Lingo', isCorrect: false },
                  { id: '3', text: 'Code\nLingo', isCorrect: false },
                  { id: '4', text: 'Compilation Error', isCorrect: false }
                ]
              },
              {
                id: 'c-1-1-3',
                type: 'spot-the-bug',
                prompt: 'Spot the invalid C++ header included in this pure C file:',
                explanation: 'Line 1 includes <iostream>, which is a C++ header! Pure C uses <stdio.h>.',
                xpReward: 15,
                codeLines: [
                  '#include <iostream> // Invalid in pure C!',
                  'int main(void) {',
                  '    printf("Hello!");',
                  '    return 0;',
                  '}'
                ],
                bugLineIndex: 0,
                bugExplanation: '<iostream> is a C++ header! Pure C programs must use #include <stdio.h>.'
              },
              {
                id: 'c-1-1-4',
                type: 'concept-match',
                prompt: 'Connect pure C syntax tokens with their roles:',
                explanation: 'printf outputs formatted strings, \\n creates newlines, stdio.h is the C I/O header, return 0 signals success.',
                xpReward: 15,
                pairs: [
                  { id: 'c_cm1', term: 'printf()', definition: 'Formatted print function in C (<stdio.h>)' },
                  { id: 'c_cm2', term: '\\n', definition: 'Escape sequence creating a new line in terminal' },
                  { id: 'c_cm3', term: 'stdio.h', definition: 'Standard Input Output header file in C' },
                  { id: 'c_cm4', term: 'return 0;', definition: 'Exit status code indicating successful program termination' }
                ]
              }
            ]
          },
          {
            id: 'c-u1-n2',
            unitId: 'c-u1',
            title: 'Format Specifiers (%d, %f, %c, %s)',
            description: 'Learn how C formats and prints variables with format specifiers',
            iconType: 'code',
            teachingIntro: {
              title: 'Format Specifiers: The C Placeholders',
              subtitle: 'Lin 🕶️ teaches how C replaces % with real variables',
              characterId: 'lin',
              steps: [
                {
                  characterId: 'lin',
                  characterMood: 'teaching',
                  speech: "In C, printf doesn't magically know what types you pass it! You must use format specifiers:\n\n• %d for integer (decimal)\n• %f for float/double (decimal numbers)\n• %c for char (single character)\n• %s for string (null-terminated char array)",
                  codeSnippet: `int age = 21;\nfloat gpa = 3.85f;\nprintf("Age: %d, GPA: %.2f\\n", age, gpa);`
                }
              ]
            },
            questions: [
              {
                id: 'c-1-2-1',
                type: 'tap-to-fill',
                prompt: 'Fill in the correct format specifier to print an integer and character:',
                explanation: '%d prints integer numbers, and %c prints single characters.',
                xpReward: 10,
                mentorTip: 'Use %d for integers and %c for characters!',
                codeTemplate: `int count = 7;
char grade = 'A';
printf("Count: %{{blank1}}, Grade: %{{blank2}}\\n", count, grade);`,
                options: ['d', 'c', 's', 'f', 'p'],
                blanks: [
                  { id: 'blank1', correctValue: 'd' },
                  { id: 'blank2', correctValue: 'c' }
                ]
              },
              {
                id: 'c-1-2-2',
                type: 'predict-output',
                prompt: 'What does this formatted C print statement output?',
                explanation: '%.1f formats the floating point number to 1 decimal place -> 9.8.',
                xpReward: 10,
                codeSnippet: `#include <stdio.h>
int main(void) {
    double gravity = 9.81;
    printf("G: %.1f", gravity);
    return 0;
}`,
                options: [
                  { id: '1', text: 'G: 9.8', isCorrect: true },
                  { id: '2', text: 'G: 9.81', isCorrect: false },
                  { id: '3', text: 'G: 10', isCorrect: false },
                  { id: '4', text: 'G: %.1f', isCorrect: false }
                ]
              },
              {
                id: 'c-1-2-3',
                type: 'spot-the-bug',
                prompt: 'Spot the format specifier mismatch bug on line 3:',
                explanation: 'Line 3 passes a floating-point number 3.14 to %d, which causes undefined behavior / garbage output in C!',
                xpReward: 15,
                codeLines: [
                  '#include <stdio.h>',
                  'int main(void) {',
                  '    printf("Value: %d\\n", 3.14159); // Mismatch! Expects %f',
                  '    return 0;',
                  '}'
                ],
                bugLineIndex: 2,
                bugExplanation: 'Passing a float to %d causes a format specifier mismatch and garbage output! Use %f for decimal numbers.'
              },
              {
                id: 'c-1-2-4',
                type: 'concept-match',
                prompt: 'Match C format specifiers with their corresponding data types:',
                explanation: '%d matches int, %f matches float/double, %c matches char, %s matches string.',
                xpReward: 15,
                pairs: [
                  { id: 'fs1', term: '%d', definition: 'Signed integer (int)' },
                  { id: 'fs2', term: '%f', definition: 'Floating-point number (float, double)' },
                  { id: 'fs3', term: '%c', definition: 'Single character (char)' },
                  { id: 'fs4', term: '%s', definition: 'Null-terminated string (char*)' }
                ]
              }
            ]
          },
          {
            id: 'c-u1-n3',
            unitId: 'c-u1',
            title: 'Pointers & Memory Addresses (& and *)',
            description: 'Learn memory addresses, pointer dereferencing, and scanf in C',
            iconType: 'code',
            teachingIntro: {
              title: 'C Pointers: The Memory Addresses',
              subtitle: 'Lin 🕶️ teaches how C accesses physical RAM directly',
              characterId: 'lin',
              steps: [
                {
                  characterId: 'lin',
                  characterMood: 'teaching',
                  speech: "In C, every variable lives at a specific numeric address in RAM.\n\n• &variable gets the address of variable.\n• int* ptr declares a pointer variable to store that address.\n• *ptr dereferences the pointer to read or write the value at that address!",
                  codeSnippet: `int val = 100;\nint* ptr = &val; // ptr stores address of val\n*ptr = 250;      // val is now 250!`
                }
              ]
            },
            questions: [
              {
                id: 'c-1-3-1',
                type: 'predict-output',
                prompt: 'What does this C pointer modification print?',
                explanation: '*p = 50 modifies the memory location where num lives, so num becomes 50.',
                xpReward: 10,
                codeSnippet: `#include <stdio.h>
int main(void) {
    int num = 10;
    int* p = &num;
    *p = 50;
    printf("%d", num);
    return 0;
}`,
                options: [
                  { id: '1', text: '50', isCorrect: true },
                  { id: '2', text: '10', isCorrect: false },
                  { id: '3', text: 'Address of num', isCorrect: false },
                  { id: '4', text: '0', isCorrect: false }
                ]
              },
              {
                id: 'c-1-3-2',
                type: 'spot-the-bug',
                prompt: 'Spot the classic scanf bug on line 3:',
                explanation: 'Line 3 passes age directly instead of &age! scanf requires the pointer &age to write the scanned number.',
                xpReward: 15,
                codeLines: [
                  'int age;',
                  'printf("Enter age: ");',
                  'scanf("%d", age); // CRASH! Missing &',
                  'printf("You are %d", age);'
                ],
                bugLineIndex: 2,
                bugExplanation: 'scanf requires the memory address (&age) to write input. Passing age directly crashes with Segmentation Fault!'
              }
            ]
          },
          {
            id: 'c-u1-n4',
            unitId: 'c-u1',
            title: 'Dynamic Memory: malloc() & free()',
            description: 'Allocate heap memory and prevent memory leaks in C',
            iconType: 'trophy',
            teachingIntro: {
              title: 'Dynamic Heap Memory in C',
              subtitle: 'Turing 🤖 shows how malloc allocates bytes',
              characterId: 'turing',
              steps: [
                {
                  characterId: 'turing',
                  characterMood: 'teaching',
                  speech: "In C, when you don't know array size at compile time, you use malloc(bytes) from <stdlib.h>.\n\nAlways multiply by sizeof(type). And rule #1 of C: for every malloc(), there MUST be a matching free(), or you leak memory!",
                  codeSnippet: `int* buffer = (int*)malloc(100 * sizeof(int));\n// use buffer...\nfree(buffer);`
                }
              ]
            },
            questions: [
              {
                id: 'c-1-4-1',
                type: 'tap-to-fill',
                prompt: 'Allocate an array of 10 integers on the heap and release it:',
                explanation: 'malloc() allocates raw bytes from <stdlib.h> and free() deallocates.',
                xpReward: 15,
                mentorTip: 'malloc allocates heap bytes, and free releases them!',
                codeTemplate: `#include <stdlib.h>
int* data = (int*){{blank1}}(10 * sizeof(int));
// work with data...
{{blank2}}(data);`,
                options: ['malloc', 'free', 'new', 'delete', 'calloc'],
                blanks: [
                  { id: 'blank1', correctValue: 'malloc' },
                  { id: 'blank2', correctValue: 'free' }
                ]
              },
              {
                id: 'c-1-4-2',
                type: 'concept-match',
                prompt: 'Match C memory allocation concepts:',
                explanation: 'malloc allocates uninitialized bytes, calloc zeroes memory, realloc resizes, free deallocates.',
                xpReward: 15,
                pairs: [
                  { id: 'cm_m1', term: 'malloc(size)', definition: 'Allocates uninitialized bytes on the heap' },
                  { id: 'cm_m2', term: 'free(ptr)', definition: 'Deallocates heap memory to prevent memory leaks' },
                  { id: 'cm_m3', term: 'NULL', definition: 'Returned by malloc if system runs out of memory' },
                  { id: 'cm_m4', term: 'sizeof(type)', definition: 'Determines exact byte size of a type on current architecture' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  cpp: {
    id: 'cpp',
    title: 'C++',
    shortTitle: 'Modern C++',
    tagline: 'Master modern C++, std::cout, classes, references, STL & templates',
    badge: '⚡ Modern C++',
    icon: 'Cpu',
    color: 'from-blue-600 to-indigo-700',
    placementQuestions: [
      {
        id: 'cpp-place-1',
        type: 'predict-output',
        prompt: 'What is the output of this C++ program?',
        explanation: 'In C++, integer division 7 / 2 truncates towards zero, yielding 3.',
        xpReward: 10,
        difficulty: 'beginner',
        codeSnippet: `#include <iostream>
int main() {
    int a = 7;
    int b = 2;
    std::cout << a / b;
    return 0;
}`,
        options: [
          { id: '1', text: '3.5', isCorrect: false },
          { id: '2', text: '3', isCorrect: true },
          { id: '3', text: '4', isCorrect: false },
          { id: '4', text: 'Compilation Error', isCorrect: false },
        ],
      },
      {
        id: 'cpp-place-2',
        type: 'spot-the-bug',
        prompt: 'Spot the memory bug in this dynamic allocation function:',
        explanation: 'Line 3 attempts to free ptr, but ptr was never allocated before dereferencing, or in this snippet delete is called on a stack variable.',
        xpReward: 15,
        difficulty: 'intermediate',
        codeLines: [
          'int x = 100;',
          'int* ptr = &x;',
          'delete ptr;',
          'std::cout << x;'
        ],
        bugLineIndex: 2,
        bugExplanation: 'delete should only be used on memory allocated with "new". "x" is allocated on the stack!'
      },
      {
        id: 'cpp-place-3',
        type: 'concept-match',
        prompt: 'Match fundamental C/C++ memory concepts with their definitions:',
        explanation: 'Stack is fast and automatic, Heap is dynamically allocated, and nullptr represents zero address.',
        xpReward: 15,
        difficulty: 'intermediate',
        pairs: [
          { id: 'p1', term: 'Stack Memory', definition: 'LIFO frame, automatic allocation & deallocation' },
          { id: 'p2', term: 'Heap Memory', definition: 'Dynamic manual lifetime via malloc/new' },
          { id: 'p3', term: 'nullptr', definition: 'Type-safe null pointer literal introduced in C++11' },
          { id: 'p4', term: 'Dangling Pointer', definition: 'Pointer pointing to already freed memory' }
        ]
      },
      {
        id: 'cpp-place-4',
        type: 'tap-to-fill',
        prompt: 'Complete the vector push and iteration code:',
        explanation: 'In C++, std::vector uses push_back to append elements, and size() or range-for to iterate.',
        xpReward: 15,
        difficulty: 'intermediate',
        codeTemplate: `std::vector<int> nums;
nums.{{blank1}}(42);
for (int x : nums) {
    std::{{blank2}} << x;
}`,
        options: ['push_back', 'append', 'cout', 'print', 'insert'],
        blanks: [
          { id: 'blank1', correctValue: 'push_back' },
          { id: 'blank2', correctValue: 'cout' }
        ]
      },
      {
        id: 'cpp-place-5',
        type: 'predict-output',
        prompt: 'What does this pointer arithmetic output?',
        explanation: 'arr is an array. *(arr + 2) is equivalent to arr[2], which is 30.',
        xpReward: 20,
        difficulty: 'advanced',
        codeSnippet: `int arr[] = {10, 20, 30, 40};
int* ptr = arr;
std::cout << *(ptr + 2);`,
        options: [
          { id: '1', text: '20', isCorrect: false },
          { id: '2', text: '30', isCorrect: true },
          { id: '3', text: '12 (Memory address)', isCorrect: false },
          { id: '4', text: '40', isCorrect: false },
        ]
      }
    ],
    units: [
      {
        id: 'cpp-u1',
        courseId: 'cpp',
        unitNumber: 1,
        title: 'Unit 1: Pointers & Memory Architecture',
        description: 'Understand addresses, the dereference operator (*), and heap memory',
        color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400',
        bannerColor: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        nodes: [
          {
            id: 'cpp-u1-n1',
            unitId: 'cpp-u1',
            title: 'Your First Code & std::cout',
            description: 'Learn what std::cout, <<, and semicolons mean with Bhai the Black Cat',
            iconType: 'terminal',
            teachingIntro: {
              title: 'Your Very First Line of Code: std::cout',
              subtitle: 'Meet Bhai 🐈‍⬛ and write your first message to the computer',
              characterId: 'byte',
              steps: [
                {
                  characterId: 'byte',
                  characterMood: 'teaching',
                  speech: "Hey coder! 🐈‍⬛ I'm Bhai, your black cat coding mentor. Welcome to C++!\n\nBefore we quiz you on anything, let's learn how to actually make the computer talk to the screen. In C++, we do this using a command called std::cout (pronounced 'see-out')!",
                  codeSnippet: `std::cout << "Hello, World!" << std::endl;`
                },
                {
                  characterId: 'byte',
                  characterMood: 'happy',
                  speech: "Let's break down this famous line piece-by-piece so you never get confused:",
                  anatomy: [
                    { token: 'std::', explanation: 'Standard namespace. Tells C++ to use the standard library tools.' },
                    { token: 'cout', explanation: 'Stands for Character Output (pronounced "see-out"). Sends text to your terminal.' },
                    { token: '<<', explanation: 'Stream Insertion operator. Think of it like arrows pushing your text into the screen!' },
                    { token: '"Hello, World!"', explanation: 'A string literal. The exact text message wrapped in double quotes.' },
                    { token: 'std::endl', explanation: 'End Line. Hits "Enter" on the terminal to start the next line.' },
                    { token: ';', explanation: 'The semicolon! In C++, every command sentence MUST end with a semicolon.' }
                  ]
                },
                {
                  characterId: 'junior',
                  characterMood: 'thinking',
                  speech: "Wait Byte! 🧢 Why are the arrows pointing to the left (<<) instead of to the right?",
                  anatomy: [
                    { token: 'std::cout << "Data"', explanation: 'Arrows point LEFT because data flows from right into the cout screen!' },
                    { token: 'std::cin >> variable', explanation: 'For input, arrows point RIGHT because data flows from keyboard into variable.' }
                  ],
                  interactiveTry: {
                    prompt: "Assemble your first line to print Hello World!",
                    tokens: ['std::cout', '<<', '"Hello World!"', '<<', 'std::endl;', '>>'],
                    targetOrder: ['std::cout', '<<', '"Hello World!"', '<<', 'std::endl;'],
                    previewOutput: 'Hello World!\n'
                  }
                },
                {
                  characterId: 'byte',
                  characterMood: 'cheering',
                  speech: "Brilliant! 🎉 You just wrote your first real line of C++!\n\nEvery C++ program wraps this inside #include <iostream> (the input/output library) and int main() { ... } (the starting door of your program).\n\nNow, test your intuition with the micro-challenges below!"
                }
              ]
            },
            questions: [
              {
                id: 'cpp-1-1-1',
                type: 'tap-to-fill',
                prompt: 'Complete your first C++ program to print "Hello, World!":',
                explanation: 'In C++, std::cout sends output to the terminal, and << inserts data into the stream.',
                xpReward: 10,
                mentorTip: 'Remember: "cout" means character output, and arrows << funnel your words into it!',
                codeTemplate: `#include <iostream>
int main() {
    std::{{blank1}} << "Hello, World!" {{blank2}} std::endl;
    return 0;
}`,
                options: ['cout', '<<', '>>', 'print', 'cin'],
                blanks: [
                  { id: 'blank1', correctValue: 'cout' },
                  { id: 'blank2', correctValue: '<<' }
                ]
              },
              {
                id: 'cpp-1-1-2',
                type: 'predict-output',
                prompt: 'What will this C++ program print to the terminal?',
                explanation: 'Chaining << outputs each text piece consecutively without spaces unless added inside quotes: "Code" + "Lingo" = "CodeLingo".',
                xpReward: 10,
                mentorTip: 'Chained << operators send pieces one after another into the screen.',
                codeSnippet: `#include <iostream>
int main() {
    std::cout << "Code" << "Lingo";
    return 0;
}`,
                options: [
                  { id: '1', text: 'CodeLingo', isCorrect: true },
                  { id: '2', text: 'Code Lingo', isCorrect: false },
                  { id: '3', text: 'Code\nLingo', isCorrect: false },
                  { id: '4', text: 'SyntaxError', isCorrect: false }
                ]
              },
              {
                id: 'cpp-1-1-3',
                type: 'spot-the-bug',
                prompt: 'Spot the syntax error on line 3:',
                explanation: 'Line 3 uses >> (stream extraction for input) instead of << (stream insertion for output).',
                xpReward: 15,
                mentorTip: 'Output uses arrows pointing into cout (<<). Arrows pointing right (>>) are for cin input!',
                codeLines: [
                  '#include <iostream>',
                  'int main() {',
                  '    std::cout >> "Welcome!";',
                  '    return 0;',
                  '}'
                ],
                bugLineIndex: 2,
                bugExplanation: 'std::cout requires the insertion operator <<. Using >> causes a compilation error!'
              },
              {
                id: 'cpp-1-1-4',
                type: 'concept-match',
                prompt: 'Connect each C++ building block with what it actually does:',
                explanation: 'std::cout prints characters, << is the stream insertion operator, std::endl creates a new line, and #include imports the stream tools.',
                xpReward: 15,
                mentorTip: 'Pair the keyword with its plain English role.',
                pairs: [
                  { id: 'cm1', term: 'std::cout', definition: 'Character Output stream (prints to terminal screen)' },
                  { id: 'cm2', term: '<< (Insertion)', definition: 'Operator that funnels text data into the output stream' },
                  { id: 'cm3', term: 'std::endl', definition: 'Inserts a newline character ("\\n") and flushes buffer' },
                  { id: 'cm4', term: '; (Semicolon)', definition: 'Mandatory statement terminator ending every command' }
                ]
              }
            ]
          },
          {
            id: 'cpp-u1-n2',
            unitId: 'cpp-u1',
            title: 'Variables & Data Storage',
            description: 'Learn how int, double, and std::string store info in memory',
            iconType: 'code',
            teachingIntro: {
              title: 'Variables: The Memory Boxes',
              subtitle: 'Ada 👧 shows you how computers remember things',
              characterId: 'ada',
              steps: [
                {
                  characterId: 'ada',
                  characterMood: 'teaching',
                  speech: "Hi! I'm Ada 👧. A computer without memory would forget everything instantly!\n\nIn C++, variables are like labeled boxes where we put numbers, words, and scores. But C++ is strongly typed: you must declare what kind of data fits inside the box!",
                  codeSnippet: `int score = 100;
double price = 19.99;
std::string name = "Ada";`
                },
                {
                  characterId: 'ada',
                  characterMood: 'happy',
                  speech: "Here are the 4 basic types you will use every single day:",
                  anatomy: [
                    { token: 'int', explanation: 'Whole numbers (e.g., 42, -5, 0). 4 bytes.' },
                    { token: 'double', explanation: 'Floating-point decimals (e.g., 3.14159, 0.99). 8 bytes.' },
                    { token: 'char', explanation: 'Single character enclosed in single quotes (e.g., \'A\', \'z\').' },
                    { token: 'std::string', explanation: 'Text strings enclosed in double quotes (e.g., "CodeLingo").' }
                  ]
                }
              ]
            },
            questions: [
              {
                id: 'cpp-1-2-1',
                type: 'tap-to-fill',
                prompt: 'Declare an integer score of 95 and a player name "Alex":',
                explanation: 'int holds whole numbers, and std::string holds text.',
                xpReward: 10,
                mentorTip: 'Use int for whole numbers and string for words!',
                codeTemplate: `{{blank1}} score = 95;
std::{{blank2}} player = "Alex";`,
                options: ['int', 'string', 'float', 'char', 'bool'],
                blanks: [
                  { id: 'blank1', correctValue: 'int' },
                  { id: 'blank2', correctValue: 'string' }
                ]
              },
              {
                id: 'cpp-1-2-2',
                type: 'predict-output',
                prompt: 'What does this variable reassignment print?',
                explanation: 'The variable "lives" starts at 3, and lives = lives - 1 updates it to 2.',
                xpReward: 10,
                codeSnippet: `int lives = 3;
lives = lives - 1;
std::cout << lives;`,
                options: [
                  { id: '1', text: '2', isCorrect: true },
                  { id: '2', text: '3', isCorrect: false },
                  { id: '3', text: '1', isCorrect: false },
                  { id: '4', text: 'lives - 1', isCorrect: false }
                ]
              },
              {
                id: 'cpp-1-2-3',
                type: 'spot-the-bug',
                prompt: 'Spot the type mismatch bug on line 2:',
                explanation: 'Line 2 tries to assign a string "Forty" to an int variable, which fails compilation in C++.',
                xpReward: 15,
                codeLines: [
                  'int points = 10;',
                  'points = "Forty"; // Cannot store text in int box!',
                  'std::cout << points;',
                  'return 0;'
                ],
                bugLineIndex: 1,
                bugExplanation: 'C++ is strongly typed: you cannot assign a string literal to an integer variable!'
              },
              {
                id: 'cpp-1-2-4',
                type: 'concept-match',
                prompt: 'Match C++ data types with the values they can hold:',
                explanation: 'int stores whole numbers, double stores decimals, bool stores true/false, char stores a single letter.',
                xpReward: 15,
                pairs: [
                  { id: 'dt1', term: 'int', definition: 'Whole numbers (e.g. 100, -5)' },
                  { id: 'dt2', term: 'double', definition: 'Floating-point decimal numbers (e.g. 3.14)' },
                  { id: 'dt3', term: 'bool', definition: 'Boolean true or false' },
                  { id: 'dt4', term: 'char', definition: 'Single character in single quotes (\'Z\')' }
                ]
              }
            ]
          },
          {
            id: 'cpp-u1-n3',
            unitId: 'cpp-u1',
            title: 'Dynamic Allocation (new / delete)',
            description: 'Allocate memory on the Heap and avoid memory leaks',
            iconType: 'terminal',
            teachingIntro: {
              title: 'Heap vs Stack: Dynamic Memory',
              subtitle: 'Turing 🤖 reveals where memory lives',
              characterId: 'turing',
              steps: [
                {
                  characterId: 'turing',
                  characterMood: 'teaching',
                  speech: "Greetings! 🤖 I am Turing. In C++, memory is split into two worlds: the Stack (automatic, fast, temporary) and the Heap (spacious, manual, persistent).\n\nWhen you use 'new', you request bytes directly from the Heap. But remember: you MUST call 'delete' when you finish, or the bytes leak into cyberspace!",
                  codeSnippet: `int* age = new int(21);\n// do work...\ndelete age;`
                }
              ]
            },
            questions: [
              {
                id: 'cpp-1-2-1',
                type: 'tap-to-fill',
                prompt: 'Allocate an integer on the heap and safely release it:',
                explanation: 'In C++, new allocates heap memory and delete frees it to prevent memory leaks.',
                xpReward: 10,
                codeTemplate: `int* age = {{blank1}} int(21);
// do work...
{{blank2}} age;`,
                options: ['new', 'delete', 'malloc', 'free', 'alloc'],
                blanks: [
                  { id: 'blank1', correctValue: 'new' },
                  { id: 'blank2', correctValue: 'delete' }
                ]
              },
              {
                id: 'cpp-1-2-2',
                type: 'spot-the-bug',
                prompt: 'Identify the Memory Leak in this loop:',
                explanation: 'Line 2 continuously allocates dynamic memory without ever freeing it, leaking memory each iteration.',
                xpReward: 15,
                codeLines: [
                  'for (int i = 0; i < 1000; i++) {',
                  '    int* buffer = new int[500];',
                  '    // no delete[] called!',
                  '}'
                ],
                bugLineIndex: 1,
                bugExplanation: 'buffer is reallocated every iteration without delete[] buffer, causing a catastrophic memory leak!'
              },
              {
                id: 'cpp-1-2-3',
                type: 'predict-output',
                prompt: 'What is the output when freeing dynamic arrays?',
                explanation: 'Dynamic arrays allocated with new[] must be freed using delete[].',
                xpReward: 10,
                codeSnippet: `int* arr = new int[3]{5, 10, 15};
std::cout << arr[1] << " ";
delete[] arr;
std::cout << "OK";`,
                options: [
                  { id: '1', text: '10 OK', isCorrect: true },
                  { id: '2', text: '5 OK', isCorrect: false },
                  { id: '3', text: '15 OK', isCorrect: false },
                  { id: '4', text: 'Compilation Error', isCorrect: false }
                ]
              },
              {
                id: 'cpp-1-2-4',
                type: 'concept-match',
                prompt: 'Match C vs C++ memory management functions:',
                explanation: 'malloc/free are C primitives; new/delete are C++ operators that call constructors and destructors.',
                xpReward: 15,
                pairs: [
                  { id: 'm1', term: 'malloc(size)', definition: 'Allocates raw bytes on heap without calling constructors' },
                  { id: 'm2', term: 'free(ptr)', definition: 'Frees heap memory allocated by malloc/calloc' },
                  { id: 'm3', term: 'new Type()', definition: 'Allocates memory and invokes constructor' },
                  { id: 'm4', term: 'delete ptr', definition: 'Calls destructor and returns memory to OS' }
                ]
              }
            ]
          },
          {
            id: 'cpp-u1-n4',
            unitId: 'cpp-u1',
            title: 'Modern STL & Vectors',
            description: 'Leverage std::vector, iterators, and automatic memory cleanup',
            iconType: 'star',
            teachingIntro: {
              title: 'Dynamic Vectors: The Supercharged Array',
              subtitle: 'Lin 🕶️ shows you modern STL power',
              characterId: 'lin',
              steps: [
                {
                  characterId: 'lin',
                  characterMood: 'teaching',
                  speech: "Hey! 🕶️ I'm Lin. Forget fixed-size static arrays! In real-world C++, we use std::vector from the Standard Template Library (STL).\n\nVectors automatically grow when you add items with push_back(), and clean up their own memory when destroyed!",
                  codeSnippet: `std::vector<int> nums = {10, 20};\nnums.push_back(30);\nstd::cout << nums.size(); // 3`
                }
              ]
            },
            questions: [
              {
                id: 'cpp-1-3-1',
                type: 'predict-output',
                prompt: 'What does this vector snippet print?',
                explanation: 'nums starts with {10, 20}. push_back(30) adds 30. pop_back() removes 30. size() is 2.',
                xpReward: 10,
                codeSnippet: `std::vector<int> nums = {10, 20};
nums.push_back(30);
nums.pop_back();
std::cout << nums.size();`,
                options: [
                  { id: '1', text: '3', isCorrect: false },
                  { id: '2', text: '2', isCorrect: true },
                  { id: '3', text: '1', isCorrect: false },
                  { id: '4', text: '20', isCorrect: false }
                ]
              },
              {
                id: 'cpp-1-3-2',
                type: 'tap-to-fill',
                prompt: 'Use modern C++ range-based for-loop by const reference:',
                explanation: 'Using const auto& avoids expensive object copies when reading container elements.',
                xpReward: 10,
                codeTemplate: `std::vector<std::string> names = {"Ada", "Bjarne"};
for ({{blank1}} auto{{blank2}} name : names) {
    std::cout << name << "\\n";
}`,
                options: ['const', '&', '*', 'static', 'mut'],
                blanks: [
                  { id: 'blank1', correctValue: 'const' },
                  { id: 'blank2', correctValue: '&' }
                ]
              },
              {
                id: 'cpp-1-3-3',
                type: 'spot-the-bug',
                prompt: 'Spot the vector iterator invalidation bug:',
                explanation: 'Line 2 inserts into vector inside an iterator loop, which invalidates the iterator and causes undefined behavior.',
                xpReward: 15,
                codeLines: [
                  'for (auto it = v.begin(); it != v.end(); ++it) {',
                  '    if (*it == 2) v.push_back(99);',
                  '    std::cout << *it;',
                  '}'
                ],
                bugLineIndex: 1,
                bugExplanation: 'Modifying a vector during traversal invalidates current iterators!'
              },
              {
                id: 'cpp-1-3-4',
                type: 'concept-match',
                prompt: 'Match STL containers with their internal mechanics:',
                explanation: 'vector uses dynamic array; list is doubly linked; map is balanced BST.',
                xpReward: 15,
                pairs: [
                  { id: 'stl1', term: 'std::vector', definition: 'Contiguous array with amortized O(1) push_back' },
                  { id: 'stl2', term: 'std::list', definition: 'Doubly-linked list with O(1) middle insertions' },
                  { id: 'stl3', term: 'std::unordered_map', definition: 'Hash table with average O(1) key lookup' },
                  { id: 'stl4', term: 'std::map', definition: 'Red-Black tree with O(log N) ordered traversal' }
                ]
              }
            ]
          },
          {
            id: 'cpp-u1-n5',
            unitId: 'cpp-u1',
            title: 'Unit 1 Checkpoint: RAII & Smart Pointers',
            description: 'Prove your memory mastery with unique_ptr & shared_ptr',
            iconType: 'trophy',
            questions: [
              {
                id: 'cpp-1-4-1',
                type: 'concept-match',
                prompt: 'Match Smart Pointer types with their ownership semantics:',
                explanation: 'unique_ptr has single exclusive ownership, shared_ptr has reference counted ownership, weak_ptr breaks cycles.',
                xpReward: 20,
                pairs: [
                  { id: 'sp1', term: 'std::unique_ptr', definition: 'Exclusive ownership; zero overhead; cannot be copied' },
                  { id: 'sp2', term: 'std::shared_ptr', definition: 'Shared reference-counted ownership' },
                  { id: 'sp3', term: 'std::weak_ptr', definition: 'Non-owning observer to prevent cyclic shared_ptr leaks' },
                  { id: 'sp4', term: 'RAII', definition: 'Resource Acquisition Is Initialization design idiom' }
                ]
              },
              {
                id: 'cpp-1-4-2',
                type: 'predict-output',
                prompt: 'What happens when a std::unique_ptr goes out of scope?',
                explanation: 'unique_ptr automatically calls delete on the managed resource when leaving scope.',
                xpReward: 15,
                codeSnippet: `{
    auto p = std::make_unique<int>(100);
} // scope ends here
std::cout << "Cleaned up";`,
                options: [
                  { id: '1', text: 'Cleaned up (Memory freed automatically)', isCorrect: true },
                  { id: '2', text: 'Memory Leak', isCorrect: false },
                  { id: '3', text: 'Double Free Error', isCorrect: false },
                  { id: '4', text: 'Compilation Error', isCorrect: false }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'cpp-u2',
        courseId: 'cpp',
        unitNumber: 2,
        title: 'Unit 2: Templates & Metaprogramming',
        description: 'Generic programming with templates, type traits, and constexpr',
        color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        bannerColor: 'bg-gradient-to-r from-indigo-600 to-purple-600',
        nodes: [
          {
            id: 'cpp-u2-n1',
            unitId: 'cpp-u2',
            title: 'Function Templates',
            description: 'Write type-agnostic algorithms using template <typename T>',
            iconType: 'zap',
            questions: [
              {
                id: 'cpp-2-1-1',
                type: 'tap-to-fill',
                prompt: 'Declare a generic template function that returns the maximum of two values:',
                explanation: 'Templates in C++ begin with template <typename T> or template <class T>.',
                xpReward: 10,
                codeTemplate: `{{blank1}} <typename T>
T myMax(T a, T b) {
    return (a > b) {{blank2}} a : b;
}`,
                options: ['template', 'typename', '?', ':', 'auto'],
                blanks: [
                  { id: 'blank1', correctValue: 'template' },
                  { id: 'blank2', correctValue: '?' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  python: {
    id: 'python',
    title: 'Python',
    shortTitle: 'Python',
    tagline: 'Write clean, expressive, and high-performance Pythonic code',
    badge: '🐍 Python',
    icon: 'Terminal',
    color: 'from-amber-500 to-emerald-600',
    placementQuestions: [
      {
        id: 'py-place-1',
        type: 'predict-output',
        prompt: 'What will this Python list comprehension output?',
        explanation: 'Only even numbers from range(4) (0, 2) are kept, and multiplied by 2 -> [0, 4].',
        xpReward: 10,
        difficulty: 'beginner',
        codeSnippet: `res = [x * 2 for x in range(4) if x % 2 == 0]
print(res)`,
        options: [
          { id: '1', text: '[0, 2, 4, 6]', isCorrect: false },
          { id: '2', text: '[0, 4]', isCorrect: true },
          { id: '3', text: '[2, 4]', isCorrect: false },
          { id: '4', text: '[4]', isCorrect: false },
        ]
      },
      {
        id: 'py-place-2',
        type: 'spot-the-bug',
        prompt: 'Find the infamous Python mutable default argument bug:',
        explanation: 'In Python, default arguments are evaluated once at function definition time, so items=[] persists across calls.',
        xpReward: 15,
        difficulty: 'intermediate',
        codeLines: [
          'def append_item(val, items=[]):',
          '    items.append(val)',
          '    return items',
          'print(append_item(1))'
        ],
        bugLineIndex: 0,
        bugExplanation: 'Using mutable default argument items=[] causes state to be shared across all function calls! Use items=None instead.'
      },
      {
        id: 'py-place-3',
        type: 'concept-match',
        prompt: 'Match Python collection types with their core properties:',
        explanation: 'Lists are mutable ordered sequences; tuples are immutable; sets are unordered unique items; dicts are key-value mappings.',
        xpReward: 15,
        difficulty: 'intermediate',
        pairs: [
          { id: 'pyp1', term: 'List [ ]', definition: 'Ordered, mutable sequence of elements' },
          { id: 'pyp2', term: 'Tuple ( )', definition: 'Ordered, immutable fixed sequence' },
          { id: 'pyp3', term: 'Set { }', definition: 'Unordered collection of unique hashable items' },
          { id: 'pyp4', term: 'Dict {k: v}', definition: 'Hash map with key-value pairs (O(1) lookup)' }
        ]
      },
      {
        id: 'py-place-4',
        type: 'predict-output',
        prompt: 'What does this slice expression return?',
        explanation: 'nums[::-1] reverses the list, yielding [4, 3, 2, 1].',
        xpReward: 15,
        difficulty: 'intermediate',
        codeSnippet: `nums = [1, 2, 3, 4]
print(nums[::-1])`,
        options: [
          { id: '1', text: '[4, 3, 2, 1]', isCorrect: true },
          { id: '2', text: '[1, 2, 3, 4]', isCorrect: false },
          { id: '3', text: '[-1, -2, -3, -4]', isCorrect: false },
          { id: '4', text: 'SyntaxError', isCorrect: false }
        ]
      },
      {
        id: 'py-place-5',
        type: 'tap-to-fill',
        prompt: 'Unpack items into head and remaining tail using the starred expression:',
        explanation: 'In Python 3 extended iterable unpacking, *rest captures the remaining items into a list.',
        xpReward: 20,
        difficulty: 'advanced',
        codeTemplate: `values = [10, 20, 30, 40]
first, {{blank1}}rest = values
print(len({{blank2}}))`,
        options: ['*', '**', 'rest', 'first', '&'],
        blanks: [
          { id: 'blank1', correctValue: '*' },
          { id: 'blank2', correctValue: 'rest' }
        ]
      }
    ],
    units: [
      {
        id: 'py-u1',
        courseId: 'python',
        unitNumber: 1,
        title: 'Unit 1: The Pythonic Idioms',
        description: 'F-strings, list comprehensions, slicing, and dictionaries',
        color: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        bannerColor: 'bg-gradient-to-r from-emerald-600 to-teal-600',
        nodes: [
          {
            id: 'py-u1-n1',
            unitId: 'py-u1',
            title: 'F-Strings & Formatted Output',
            description: 'Interpolate variables and expressions elegantly inside strings',
            iconType: 'code',
            teachingIntro: {
              title: "Python's Simplicity: print() & F-Strings",
              subtitle: 'Bhai 🐈‍⬛ & Ada 👧 explain why Python reads like plain English',
              characterId: 'byte',
              steps: [
                {
                  characterId: 'byte',
                  characterMood: 'teaching',
                  speech: "Welcome to Python! 🐍 If C++ is a Formula 1 race car with raw manual controls, Python is a sleek electric spaceship.\n\nThere are no semicolons, no complex boilerplates, and no manual memory management. To output text, we simply write print()!",
                  codeSnippet: `name = "Coder"\nscore = 100\nprint(f"Welcome {name}! Your score is {score}.")`
                },
                {
                  characterId: 'ada',
                  characterMood: 'happy',
                  speech: "F-Strings (Formatted String Literals) are one of Python's most beloved superpowers! Just put an 'f' in front of your quotes, and put any variable or math inside {curly brackets}!",
                  anatomy: [
                    { token: 'f"..."', explanation: 'Tells Python to evaluate expressions inside curly braces.' },
                    { token: '{name}', explanation: 'Evaluates the variable and pastes its value directly into the string.' },
                    { token: '{10 * 3}', explanation: 'You can even run math inside {}: this becomes 30!' }
                  ]
                }
              ]
            },
            questions: [
              {
                id: 'py-1-1-1',
                type: 'tap-to-fill',
                prompt: 'Format a welcome message using an f-string:',
                explanation: 'Prefixing string with f allows variable interpolation inside curly braces {}.',
                xpReward: 10,
                codeTemplate: `user = "Guido"
score = 100
msg = {{blank1}}"User: {{blank2}}, Score: {score}"`,
                options: ['f', 'r', '{user}', 'user', '$'],
                blanks: [
                  { id: 'blank1', correctValue: 'f' },
                  { id: 'blank2', correctValue: '{user}' }
                ]
              },
              {
                id: 'py-1-1-2',
                type: 'predict-output',
                prompt: 'What does this formatted expression print?',
                explanation: 'Expressions inside f-string {} are evaluated directly at runtime: 10 * 3 = 30.',
                xpReward: 10,
                codeSnippet: `x = 10
print(f"Result: {x * 3}")`,
                options: [
                  { id: '1', text: 'Result: 30', isCorrect: true },
                  { id: '2', text: 'Result: {x * 3}', isCorrect: false },
                  { id: '3', text: 'Result: 10 * 3', isCorrect: false },
                  { id: '4', text: 'TypeError', isCorrect: false }
                ]
              },
              {
                id: 'py-1-1-3',
                type: 'spot-the-bug',
                prompt: 'Spot the syntax error in this string formatting:',
                explanation: 'Line 2 tries to use a backslash escape inside f-string expression braces, which causes a SyntaxError in older Python versions.',
                xpReward: 15,
                codeLines: [
                  'items = ["c++", "python"]',
                  'print(f"Items: {\\\' \\\\\'.join(items)}")',
                  'print("All done!")',
                  '# end'
                ],
                bugLineIndex: 1,
                bugExplanation: 'Backslashes inside f-string expressions prior to Python 3.12 cause a SyntaxError!'
              },
              {
                id: 'py-1-1-4',
                type: 'concept-match',
                prompt: 'Match string formatting styles across Python evolution:',
                explanation: 'f-strings are modern (3.6+), str.format is 2.7/3.0, % operator is legacy C-style.',
                xpReward: 15,
                pairs: [
                  { id: 'str1', term: 'f"{name}"', definition: 'Modern formatted string literals (Python 3.6+)' },
                  { id: 'str2', term: '"{}".format(name)', definition: 'Method call formatting (Python 2.7+)' },
                  { id: 'str3', term: '"%s" % name', definition: 'Old printf-style string interpolation' },
                  { id: 'str4', term: 'r"\\n raw text"', definition: 'Raw string literal ignoring escape characters' }
                ]
              }
            ]
          },
          {
            id: 'py-u1-n2',
            unitId: 'py-u1',
            title: 'List Comprehensions',
            description: 'Transform, filter, and map iterables in a single concise line',
            iconType: 'zap',
            questions: [
              {
                id: 'py-1-2-1',
                type: 'tap-to-fill',
                prompt: 'Square all odd numbers from 1 to 5:',
                explanation: 'List comprehension follows: [expr for item in iterable if condition].',
                xpReward: 10,
                codeTemplate: `nums = [1, 2, 3, 4, 5]
odds_squared = [x**2 {{blank1}} x in nums {{blank2}} x % 2 != 0]`,
                options: ['for', 'if', 'in', 'while', 'filter'],
                blanks: [
                  { id: 'blank1', correctValue: 'for' },
                  { id: 'blank2', correctValue: 'if' }
                ]
              },
              {
                id: 'py-1-2-2',
                type: 'predict-output',
                prompt: 'What will this nested list comprehension produce?',
                explanation: 'x is 1, 2; y is 10. Pairs are [1+10, 2+10] -> [11, 12].',
                xpReward: 10,
                codeSnippet: `ans = [x + y for x in [1, 2] for y in [10]]
print(ans)`,
                options: [
                  { id: '1', text: '[11, 12]', isCorrect: true },
                  { id: '2', text: '[[11], [12]]', isCorrect: false },
                  { id: '3', text: '[1, 2, 10]', isCorrect: false },
                  { id: '4', text: '[13]', isCorrect: false }
                ]
              },
              {
                id: 'py-1-2-3',
                type: 'spot-the-bug',
                prompt: 'Spot the bug when trying to create a 2D matrix:',
                explanation: 'Line 1 creates a list of 3 references to the EXACT SAME list! Modifying one modifies all.',
                xpReward: 15,
                codeLines: [
                  'matrix = [[0] * 3] * 3',
                  'matrix[0][0] = 99',
                  'print(matrix)',
                  '# expects only first row to change'
                ],
                bugLineIndex: 0,
                bugExplanation: 'Multiplying a list of lists creates shallow copies of the same row! Use [[0]*3 for _ in range(3)] instead.'
              },
              {
                id: 'py-1-2-4',
                type: 'concept-match',
                prompt: 'Match comprehension forms with their output types:',
                explanation: '[ ] creates lists, { } with key:value creates dicts, ( ) creates generators.',
                xpReward: 15,
                pairs: [
                  { id: 'comp1', term: '[x for x in data]', definition: 'List comprehension (eagerly evaluates full list)' },
                  { id: 'comp2', term: '(x for x in data)', definition: 'Generator expression (lazy evaluation, low memory)' },
                  { id: 'comp3', term: '{x: x*2 for x in data}', definition: 'Dictionary comprehension' },
                  { id: 'comp4', term: '{x for x in data}', definition: 'Set comprehension (deduplicates values)' }
                ]
              }
            ]
          },
          {
            id: 'py-u1-n3',
            unitId: 'py-u1',
            title: 'Slicing & Negative Indexing',
            description: 'Master start:stop:step slicing mechanics',
            iconType: 'terminal',
            questions: [
              {
                id: 'py-1-3-1',
                type: 'predict-output',
                prompt: 'What does this slice step print?',
                explanation: 'nums[1:6:2] takes elements starting at index 1 up to index 5 stepping by 2: indices 1, 3, 5 -> [1, 3, 5].',
                xpReward: 10,
                codeSnippet: `nums = [0, 1, 2, 3, 4, 5, 6]
print(nums[1:6:2])`,
                options: [
                  { id: '1', text: '[1, 3, 5]', isCorrect: true },
                  { id: '2', text: '[0, 2, 4]', isCorrect: false },
                  { id: '3', text: '[1, 2, 3, 4, 5]', isCorrect: false },
                  { id: '4', text: '[2, 4, 6]', isCorrect: false }
                ]
              },
              {
                id: 'py-1-3-2',
                type: 'tap-to-fill',
                prompt: 'Reverse a string using slicing notation:',
                explanation: 'The slice idiom [::-1] walks backward through any sequence.',
                xpReward: 10,
                codeTemplate: `word = "Python"
reversed_word = word[{{blank1}}:{{blank2}}:-1]`,
                options: ['', '0', 'len(word)', 'None', '*'],
                blanks: [
                  { id: 'blank1', correctValue: '' },
                  { id: 'blank2', correctValue: '' }
                ]
              },
              {
                id: 'py-1-3-3',
                type: 'concept-match',
                prompt: 'Match slice patterns with their behavior:',
                explanation: '[:3] gets first 3, [-3:] gets last 3, [::2] takes every other element.',
                xpReward: 15,
                pairs: [
                  { id: 'sl1', term: 'seq[:3]', definition: 'First 3 items (indices 0, 1, 2)' },
                  { id: 'sl2', term: 'seq[-3:]', definition: 'Last 3 items of the sequence' },
                  { id: 'sl3', term: 'seq[::2]', definition: 'Every second item starting from index 0' },
                  { id: 'sl4', term: 'seq[:]', definition: 'Shallow copy of the entire sequence' }
                ]
              }
            ]
          },
          {
            id: 'py-u1-n4',
            unitId: 'py-u1',
            title: 'Unit 1 Checkpoint: Dictionary Idioms',
            description: 'Dict get(), setdefault(), and Counter',
            iconType: 'trophy',
            questions: [
              {
                id: 'py-1-4-1',
                type: 'predict-output',
                prompt: 'What happens when accessing a missing key with .get()?',
                explanation: 'dict.get(key, default) safely returns the default value without raising KeyError.',
                xpReward: 10,
                codeSnippet: `counts = {"apples": 5}
print(counts.get("bananas", 0))`,
                options: [
                  { id: '1', text: '0', isCorrect: true },
                  { id: '2', text: 'KeyError', isCorrect: false },
                  { id: '3', text: 'None', isCorrect: false },
                  { id: '4', text: '5', isCorrect: false }
                ]
              },
              {
                id: 'py-1-4-2',
                type: 'concept-match',
                prompt: 'Match Python dictionary methods with their operations:',
                explanation: 'keys() returns key view, values() returns values, items() yields (key, val) tuples.',
                xpReward: 15,
                pairs: [
                  { id: 'dm1', term: 'd.items()', definition: 'Yields key-value pairs as (k, v) tuples' },
                  { id: 'dm2', term: 'd.setdefault(k, v)', definition: 'Inserts key with default value only if not present' },
                  { id: 'dm3', term: 'collections.defaultdict', definition: 'Automatically initializes missing keys via factory' },
                  { id: 'dm4', term: 'collections.Counter', definition: 'High-performance frequency counting map' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  oop: {
    id: 'oop',
    title: 'Object-Oriented Programming',
    shortTitle: 'OOP Pillars',
    tagline: 'Encapsulation, Inheritance, Polymorphism & Abstraction in Depth',
    badge: '🧱 OOP Master',
    icon: 'Layers',
    color: 'from-purple-600 to-pink-600',
    placementQuestions: [
      {
        id: 'oop-place-1',
        type: 'concept-match',
        prompt: 'Match the 4 Pillars of OOP with their primary objectives:',
        explanation: 'Encapsulation hides internal state; Inheritance reuses code; Polymorphism allows uniform interface for varied types; Abstraction hides implementation complexity.',
        xpReward: 15,
        difficulty: 'beginner',
        pairs: [
          { id: 'p1', term: 'Encapsulation', definition: 'Bundling data with methods & restricting direct access' },
          { id: 'p2', term: 'Inheritance', definition: 'Deriving new classes from an existing parent class' },
          { id: 'p3', term: 'Polymorphism', definition: 'Single interface representing multiple underlying types' },
          { id: 'p4', term: 'Abstraction', definition: 'Hiding internal execution details, showing only essentials' }
        ]
      },
      {
        id: 'oop-place-2',
        type: 'predict-output',
        prompt: 'What does this polymorphism example print?',
        explanation: 'The Speak method is overridden in Dog, so d.Speak() prints "Woof".',
        xpReward: 15,
        difficulty: 'intermediate',
        codeSnippet: `class Animal:
    def speak(self): return "Generic"

class Dog(Animal):
    def speak(self): return "Woof"

def make_noise(animal: Animal):
    print(animal.speak())

make_noise(Dog())`,
        options: [
          { id: '1', text: 'Woof', isCorrect: true },
          { id: '2', text: 'Generic', isCorrect: false },
          { id: '3', text: 'Generic Woof', isCorrect: false },
          { id: '4', text: 'TypeError', isCorrect: false }
        ]
      },
      {
        id: 'oop-place-3',
        type: 'spot-the-bug',
        prompt: 'Spot the bug preventing superclass initialization in Python:',
        explanation: 'Line 3 forgets to call super().__init__(name), leaving the parent class uninitialized.',
        xpReward: 15,
        difficulty: 'intermediate',
        codeLines: [
          'class Employee(Person):',
          '    def __init__(self, name, emp_id):',
          '        # Forgot super().__init__(name)!',
          '        self.emp_id = emp_id'
        ],
        bugLineIndex: 2,
        bugExplanation: 'Child classes in Python should call super().__init__() to initialize parent attributes!'
      },
      {
        id: 'oop-place-4',
        type: 'tap-to-fill',
        prompt: 'In C++, declare a virtual destructor to prevent undefined behavior when deleting derived objects:',
        explanation: 'Base classes intended for polymorphic destruction must have a virtual destructor.',
        xpReward: 15,
        difficulty: 'advanced',
        codeTemplate: `class Base {
public:
    {{blank1}} ~Base() = {{blank2}};
};`,
        options: ['virtual', 'default', 'override', 'static', 'final'],
        blanks: [
          { id: 'blank1', correctValue: 'virtual' },
          { id: 'blank2', correctValue: 'default' }
        ]
      },
      {
        id: 'oop-place-5',
        type: 'predict-output',
        prompt: 'What principle is violated if a function relies on concrete class rather than interface?',
        explanation: 'The Dependency Inversion Principle states high-level modules should depend on abstractions, not concretions.',
        xpReward: 20,
        difficulty: 'advanced',
        codeSnippet: `// SOLID Principles Check:
// High-level modules should depend on abstractions,
// not on concrete details.`,
        options: [
          { id: '1', text: 'Dependency Inversion Principle (DIP)', isCorrect: true },
          { id: '2', text: 'Single Responsibility Principle (SRP)', isCorrect: false },
          { id: '3', text: 'Liskov Substitution Principle (LSP)', isCorrect: false },
          { id: '4', text: 'Open/Closed Principle (OCP)', isCorrect: false }
        ]
      }
    ],
    units: [
      {
        id: 'oop-u1',
        courseId: 'oop',
        unitNumber: 1,
        title: 'Unit 1: The Four Pillars',
        description: 'Encapsulation, Inheritance, Polymorphism & Abstraction',
        color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400',
        bannerColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
        nodes: [
          {
            id: 'oop-u1-n1',
            unitId: 'oop-u1',
            title: 'Encapsulation & State Protection',
            description: 'Getters, setters, private fields, and data integrity',
            iconType: 'code',
            teachingIntro: {
              title: 'The Blueprint Metaphor: Classes & Objects',
              subtitle: 'Turing 🤖 & Junior 🧢 decode the 4 Pillars of OOP',
              characterId: 'turing',
              steps: [
                {
                  characterId: 'turing',
                  characterMood: 'teaching',
                  speech: "Welcome to OOP! 🤖 In procedural code, data and functions wander around separately. In Object-Oriented Programming, we bundle them into neat living entities called Objects!\n\nThink of a Class like an architectural blueprint. An Object is the real physical house built from that blueprint.",
                  codeSnippet: `class Robot:\n    def __init__(self, name):\n        self.__battery = 100 # Private state!\n    def charge(self):\n        self.__battery = 100`
                },
                {
                  characterId: 'junior',
                  characterMood: 'thinking',
                  speech: "Why can't anyone just change __battery = 9999 from the outside?",
                  anatomy: [
                    { token: 'Encapsulation', explanation: 'Hiding internal variables so external code cannot corrupt the object state.' },
                    { token: 'Getter/Setter', explanation: 'Controlled doorways with validation (e.g. checking if battery is valid 0-100%).' }
                  ]
                }
              ]
            },
            questions: [
              {
                id: 'oop-1-1-1',
                type: 'tap-to-fill',
                prompt: 'Define private balance attribute and property getter in Python:',
                explanation: 'In Python, double leading underscore __ creates private mangled names, and @property decorator defines getters.',
                xpReward: 10,
                codeTemplate: `class BankAccount:
    def __init__(self, initial):
        self.{{blank1}}balance = initial

    {{blank2}}
    def balance(self):
        return self.__balance`,
                options: ['__', '@property', '@staticmethod', '_', 'self'],
                blanks: [
                  { id: 'blank1', correctValue: '__' },
                  { id: 'blank2', correctValue: '@property' }
                ]
              },
              {
                id: 'oop-1-1-2',
                type: 'spot-the-bug',
                prompt: 'Spot where encapsulation is broken by exposing internal state:',
                explanation: 'Line 3 makes internal array public or mutable directly, bypassing validation.',
                xpReward: 15,
                codeLines: [
                  'class SafeList:',
                  '    def __init__(self):',
                  '        self.raw_data = [] # Publicly mutable directly!',
                  '    def add(self, item): self.raw_data.append(item)'
                ],
                bugLineIndex: 2,
                bugExplanation: 'Exposing raw_data as a public attribute allows external code to mutate internal state without checks.'
              },
              {
                id: 'oop-1-1-3',
                type: 'predict-output',
                prompt: 'What happens when trying to read private member __secret directly?',
                explanation: 'Python mangles double underscore attributes to _ClassName__secret, so obj.__secret raises AttributeError.',
                xpReward: 10,
                codeSnippet: `class Vault:
    def __init__(self):
        self.__secret = 1337

v = Vault()
print(hasattr(v, "__secret"))`,
                options: [
                  { id: '1', text: 'False', isCorrect: true },
                  { id: '2', text: 'True', isCorrect: false },
                  { id: '3', text: '1337', isCorrect: false },
                  { id: '4', text: 'AttributeError', isCorrect: false }
                ]
              },
              {
                id: 'oop-1-1-4',
                type: 'concept-match',
                prompt: 'Match access specifiers across OOP languages:',
                explanation: 'public is accessible everywhere; protected is accessible within class and subclasses; private is only inside class.',
                xpReward: 15,
                pairs: [
                  { id: 'as1', term: 'Public', definition: 'Accessible from any code anywhere' },
                  { id: 'as2', term: 'Protected', definition: 'Accessible only within class and derived subclasses' },
                  { id: 'as3', term: 'Private', definition: 'Restricted strictly to the declaring class' },
                  { id: 'as4', term: 'Getter / Setter', definition: 'Controlled access methods enforcing validation logic' }
                ]
              }
            ]
          },
          {
            id: 'oop-u1-n2',
            unitId: 'oop-u1',
            title: 'Polymorphism & Virtual Dispatch',
            description: 'Runtime method resolution and dynamic dispatch',
            iconType: 'zap',
            questions: [
              {
                id: 'oop-1-2-1',
                type: 'predict-output',
                prompt: 'What does this C++ virtual function output?',
                explanation: 'Since draw() is marked virtual, the runtime dynamic type (Circle) determines which method executes.',
                xpReward: 10,
                codeSnippet: `struct Shape {
    virtual void draw() { std::cout << "Shape "; }
};
struct Circle : Shape {
    void draw() override { std::cout << "Circle "; }
};
Shape* s = new Circle();
s->draw();`,
                options: [
                  { id: '1', text: 'Circle ', isCorrect: true },
                  { id: '2', text: 'Shape ', isCorrect: false },
                  { id: '3', text: 'Shape Circle ', isCorrect: false },
                  { id: '4', text: 'Compiler Error', isCorrect: false }
                ]
              },
              {
                id: 'oop-1-2-2',
                type: 'tap-to-fill',
                prompt: 'In C++, designate a pure virtual function to make a class Abstract:',
                explanation: 'Setting a virtual method to = 0 marks it as pure virtual, making the class abstract.',
                xpReward: 10,
                codeTemplate: `class Renderer {
public:
    virtual void render() = {{blank1}};
};`,
                options: ['0', 'default', 'null', 'abstract'],
                blanks: [
                  { id: 'blank1', correctValue: '0' }
                ]
              },
              {
                id: 'oop-1-2-3',
                type: 'concept-match',
                prompt: 'Match Polymorphism mechanisms:',
                explanation: 'Compile-time polymorphism is overloading/templates; Runtime polymorphism is virtual functions/interfaces.',
                xpReward: 15,
                pairs: [
                  { id: 'pm1', term: 'Dynamic Dispatch', definition: 'VTable lookup resolving function address at runtime' },
                  { id: 'pm2', term: 'Function Overloading', definition: 'Compile-time polymorphism based on parameter signatures' },
                  { id: 'pm3', term: 'Pure Virtual Method', definition: 'Method with no base implementation (= 0)' },
                  { id: 'pm4', term: 'Duck Typing', definition: '"If it quacks like a duck, it is a duck" (Pythonic runtime)' }
                ]
              }
            ]
          },
          {
            id: 'oop-u1-n3',
            unitId: 'oop-u1',
            title: 'Inheritance vs Composition',
            description: 'The golden rule: "Favor object composition over class inheritance"',
            iconType: 'terminal',
            questions: [
              {
                id: 'oop-1-3-1',
                type: 'predict-output',
                prompt: 'What is the relationship in Composition?',
                explanation: 'Inheritance represents an IS-A relationship; Composition represents a HAS-A relationship.',
                xpReward: 10,
                codeSnippet: `class Engine: pass
class Car:
    def __init__(self):
        self.engine = Engine() # Car HAS-A Engine`,
                options: [
                  { id: '1', text: 'HAS-A relationship (Composition)', isCorrect: true },
                  { id: '2', text: 'IS-A relationship (Inheritance)', isCorrect: false },
                  { id: '3', text: 'CAN-DO relationship (Interface)', isCorrect: false },
                  { id: '4', text: 'FRIEND relationship', isCorrect: false }
                ]
              },
              {
                id: 'oop-1-3-2',
                type: 'spot-the-bug',
                prompt: 'Spot the Fragile Base Class issue:',
                explanation: 'Line 2 tightly couples subclasses to base internal implementation details.',
                xpReward: 15,
                codeLines: [
                  'class CustomArray(list):',
                  '    # Directly overriding internal CPython list internals',
                  '    def __setitem__(self, idx, val): super().__setitem__(idx, val)',
                  '    # May fail in C-extensions!'
                ],
                bugLineIndex: 1,
                bugExplanation: 'Subclassing built-in mutable types like list/dict can lead to inconsistent internal method dispatch.'
              }
            ]
          },
          {
            id: 'oop-u1-n4',
            unitId: 'oop-u1',
            title: 'Unit 1 Checkpoint: SOLID Principles',
            description: 'Master the 5 foundational software engineering principles',
            iconType: 'trophy',
            questions: [
              {
                id: 'oop-1-4-1',
                type: 'concept-match',
                prompt: 'Match SOLID acronym letters with their definitions:',
                explanation: 'S: Single Responsibility, O: Open/Closed, L: Liskov Substitution, I: Interface Segregation, D: Dependency Inversion.',
                xpReward: 20,
                pairs: [
                  { id: 's1', term: 'S - Single Responsibility', definition: 'A class should have only one reason to change' },
                  { id: 's2', term: 'O - Open / Closed', definition: 'Open for extension, closed for modification' },
                  { id: 's3', term: 'L - Liskov Substitution', definition: 'Subtypes must be substitutable for their base types' },
                  { id: 's4', term: 'I - Interface Segregation', definition: 'Clients should not be forced to depend on unused methods' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  dsa: {
    id: 'dsa',
    title: 'Data Structures',
    shortTitle: 'Data Structures',
    tagline: 'Arrays, Linked Lists, Stacks, Queues, Trees, Heaps & Graphs',
    badge: '🌲 Data Structures',
    icon: 'Network',
    color: 'from-cyan-500 to-blue-600',
    placementQuestions: [
      {
        id: 'dsa-place-1',
        type: 'concept-match',
        prompt: 'Match Data Structures with their insertion/removal access order:',
        explanation: 'Stack is LIFO, Queue is FIFO, Priority Queue orders by key priority, Array is random access.',
        xpReward: 15,
        difficulty: 'beginner',
        pairs: [
          { id: 'ds1', term: 'Stack', definition: 'LIFO: Last In, First Out (Call stack, undo buffer)' },
          { id: 'ds2', term: 'Queue', definition: 'FIFO: First In, First Out (Breadth-First Search, print spool)' },
          { id: 'ds3', term: 'Dynamic Array', definition: 'Random O(1) index access, amortized O(1) append' },
          { id: 'ds4', term: 'Linked List', definition: 'Sequential node chain with O(1) pointer insertions' }
        ]
      },
      {
        id: 'dsa-place-2',
        type: 'predict-output',
        prompt: 'What is the top element of the stack after these operations?',
        explanation: 'push(10), push(20), push(30), pop() removes 30. Top is now 20.',
        xpReward: 15,
        difficulty: 'intermediate',
        codeSnippet: `stack = []
stack.append(10)
stack.append(20)
stack.append(30)
stack.pop()
print(stack[-1])`,
        options: [
          { id: '1', text: '20', isCorrect: true },
          { id: '2', text: '30', isCorrect: false },
          { id: '3', text: '10', isCorrect: false },
          { id: '4', text: 'None', isCorrect: false }
        ]
      },
      {
        id: 'dsa-place-3',
        type: 'spot-the-bug',
        prompt: 'Spot the pointer lost bug when deleting a node from a singly linked list:',
        explanation: 'Line 2 reassigns head before pointing previous node to next node, severing the rest of the list.',
        xpReward: 15,
        difficulty: 'intermediate',
        codeLines: [
          '# Deleting current node',
          'current.next = None # Severed remainder of list!',
          'prev.next = current.next',
          'delete current'
        ],
        bugLineIndex: 1,
        bugExplanation: 'Setting current.next to None before linking prev to current.next permanently loses the tail of the list!'
      },
      {
        id: 'dsa-place-4',
        type: 'tap-to-fill',
        prompt: 'Implement a Queue pop operation using a double-ended queue (deque):',
        explanation: 'In Python collections.deque, popleft() performs an O(1) FIFO removal.',
        xpReward: 15,
        difficulty: 'advanced',
        codeTemplate: `from collections import deque
q = deque(["job1", "job2", "job3"])
first_job = q.{{blank1}}()
print(first_job)`,
        options: ['popleft', 'pop', 'dequeue', 'shift', 'remove'],
        blanks: [
          { id: 'blank1', correctValue: 'popleft' }
        ]
      },
      {
        id: 'dsa-place-5',
        type: 'predict-output',
        prompt: 'What is the average time complexity to lookup a key in a well-distributed Hash Table?',
        explanation: 'Hash table lookup with decent hash function is average O(1).',
        xpReward: 20,
        difficulty: 'advanced',
        codeSnippet: `// Hash Map Key Lookup:
// hash = hash_function(key) % capacity
// bucket = table[hash]`,
        options: [
          { id: '1', text: 'O(1) Constant Time', isCorrect: true },
          { id: '2', text: 'O(log N) Logarithmic', isCorrect: false },
          { id: '3', text: 'O(N) Linear Time', isCorrect: false },
          { id: '4', text: 'O(N^2) Quadratic', isCorrect: false }
        ]
      }
    ],
    units: [
      {
        id: 'dsa-u1',
        courseId: 'dsa',
        unitNumber: 1,
        title: 'Unit 1: Linear Data Structures',
        description: 'Dynamic Arrays, Singly Linked Lists, Stacks, and Queues',
        color: 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
        bannerColor: 'bg-gradient-to-r from-cyan-600 to-blue-600',
        nodes: [
          {
            id: 'dsa-u1-n1',
            unitId: 'dsa-u1',
            title: 'Dynamic Arrays & Capacity Doubling',
            description: 'Why array append is amortized O(1) despite memory reallocations',
            iconType: 'code',
            teachingIntro: {
              title: 'The Memory Strip: Why Arrays are Instant O(1)',
              subtitle: 'Lin 🕶️ & Bhai 🐈‍⬛ explain RAM address calculation',
              characterId: 'lin',
              steps: [
                {
                  characterId: 'lin',
                  characterMood: 'teaching',
                  speech: "Welcome to Data Structures! 🕶️ In RAM, an Array is a contiguous block of memory side-by-side like lockers in a school hallway.\n\nTo find locker #42, you don't scan lockers 0, 1, 2... you jump directly to step 42! Address = Base + (Index × Size). That's why array indexing is instantaneous O(1)!",
                  codeSnippet: `int numbers[4] = {10, 20, 30, 40};\nint val = numbers[2]; // Address = Base + 2 * 4 bytes -> Instant 30!`
                },
                {
                  characterId: 'byte',
                  characterMood: 'happy',
                  speech: "When the array gets full, dynamic arrays (like std::vector or Python lists) double their capacity in the background so future appends stay lightning fast!",
                  anatomy: [
                    { token: 'Array[i]', explanation: 'Instant O(1) constant time random access lookup.' },
                    { token: 'Capacity 2x', explanation: 'Doubling capacity ensures amortized O(1) append efficiency.' }
                  ]
                }
              ]
            },
            questions: [
              {
                id: 'dsa-1-1-1',
                type: 'predict-output',
                prompt: 'What is the index access time for any element in a contiguous array?',
                explanation: 'Because array elements are stored in contiguous memory: address = base + index * sizeof(element), lookup is O(1).',
                xpReward: 10,
                codeSnippet: `int arr[10000];
int val = arr[7421]; // Direct address calculation`,
                options: [
                  { id: '1', text: 'O(1) Constant Time', isCorrect: true },
                  { id: '2', text: 'O(N) Linear Time', isCorrect: false },
                  { id: '3', text: 'O(log N)', isCorrect: false },
                  { id: '4', text: 'O(N log N)', isCorrect: false }
                ]
              },
              {
                id: 'dsa-1-1-2',
                type: 'tap-to-fill',
                prompt: 'When dynamic arrays run out of capacity, by what factor do they typically resize?',
                explanation: 'Dynamic arrays like std::vector and Python lists double capacity (or multiply by 1.5 - 2.0x) to achieve amortized O(1) appends.',
                xpReward: 10,
                codeTemplate: `if (size == capacity) {
    capacity = capacity * {{blank1}};
}`,
                options: ['2', '10', '+ 1', 'N', '0'],
                blanks: [
                  { id: 'blank1', correctValue: '2' }
                ]
              },
              {
                id: 'dsa-1-1-3',
                type: 'concept-match',
                prompt: 'Match array operation costs:',
                explanation: 'Access by index is O(1); insertion at front requires shifting all items O(N); append at end is amortized O(1).',
                xpReward: 15,
                pairs: [
                  { id: 'arr1', term: 'Index Access', definition: 'O(1) instantaneous offset calculation' },
                  { id: 'arr2', term: 'Prepend (Insert at index 0)', definition: 'O(N) requires shifting all N elements' },
                  { id: 'arr3', term: 'Amortized Append', definition: 'O(1) average cost over a sequence of insertions' },
                  { id: 'arr4', term: 'Search unsorted array', definition: 'O(N) linear scan required' }
                ]
              }
            ]
          },
          {
            id: 'dsa-u1-n2',
            unitId: 'dsa-u1',
            title: 'Singly Linked Lists',
            description: 'Pointers, node traversals, and reversing lists in-place',
            iconType: 'terminal',
            questions: [
              {
                id: 'dsa-1-2-1',
                type: 'tap-to-fill',
                prompt: 'Complete the loop condition to traverse a linked list until the end:',
                explanation: 'Traversing terminates when the current pointer reaches nullptr / None.',
                xpReward: 10,
                codeTemplate: `Node* curr = head;
while (curr != {{blank1}}) {
    std::cout << curr->data << " ";
    curr = curr->{{blank2}};
}`,
                options: ['nullptr', 'next', 'prev', 'head', 'val'],
                blanks: [
                  { id: 'blank1', correctValue: 'nullptr' },
                  { id: 'blank2', correctValue: 'next' }
                ]
              },
              {
                id: 'dsa-1-2-2',
                type: 'spot-the-bug',
                prompt: 'Spot the infinite loop bug in this linked list traversal:',
                explanation: 'Line 2 prints the node data but forgets to advance the pointer (curr = curr.next), causing an infinite loop.',
                xpReward: 15,
                codeLines: [
                  'curr = head',
                  'while curr:',
                  '    print(curr.val)',
                  '    # forgot: curr = curr.next!'
                ],
                bugLineIndex: 3,
                bugExplanation: 'Failing to advance curr = curr.next causes curr to remain unchanged, looping forever!'
              },
              {
                id: 'dsa-1-2-3',
                type: 'concept-match',
                prompt: 'Compare Arrays vs Linked Lists:',
                explanation: 'Arrays offer fast random access and cache locality; Linked lists offer fast insert/delete with known pointers.',
                xpReward: 15,
                pairs: [
                  { id: 'all1', term: 'Cache Locality', definition: 'Arrays win due to contiguous memory spatial locality' },
                  { id: 'all2', term: 'Middle Insertion (known pos)', definition: 'Linked Lists do in O(1) without shifting data' },
                  { id: 'all3', term: 'Memory Overhead', definition: 'Linked Lists require extra pointer bytes per node' },
                  { id: 'all4', term: 'Random Access by index', definition: 'Arrays O(1), Linked Lists O(N)' }
                ]
              }
            ]
          },
          {
            id: 'dsa-u1-n3',
            unitId: 'dsa-u1',
            title: 'Stacks & Queues in Action',
            description: 'Balanced parentheses, monotonic stacks, and breadth queues',
            iconType: 'zap',
            questions: [
              {
                id: 'dsa-1-3-1',
                type: 'predict-output',
                prompt: 'Can a single stack check for balanced parentheses like "({[]})"?',
                explanation: 'Yes! Stacks naturally match open brackets to their corresponding closing brackets in reverse order.',
                xpReward: 10,
                codeSnippet: `// Balanced Parentheses matching
// Push open bracket '(', '{', '['
// On closing bracket, pop and verify matching type.`,
                options: [
                  { id: '1', text: 'Yes, in O(N) time and O(N) space', isCorrect: true },
                  { id: '2', text: 'No, requires a Queue', isCorrect: false },
                  { id: '3', text: 'Requires O(N^2) comparison', isCorrect: false },
                  { id: '4', text: 'Only works with single bracket types', isCorrect: false }
                ]
              },
              {
                id: 'dsa-1-3-2',
                type: 'spot-the-bug',
                prompt: 'Spot the pop on empty stack error:',
                explanation: 'Line 2 calls pop() before checking if stack is empty, causing an IndexError / Underflow.',
                xpReward: 15,
                codeLines: [
                  'stack = []',
                  'item = stack.pop() # Called on empty list!',
                  'print(item)',
                  '# crash'
                ],
                bugLineIndex: 1,
                bugExplanation: 'Popping from an empty stack triggers a Stack Underflow error! Always check if stack has elements.'
              }
            ]
          },
          {
            id: 'dsa-u1-n4',
            unitId: 'dsa-u1',
            title: 'Unit 1 Checkpoint: Hash Tables & Maps',
            description: 'Hash functions, bucket collisions, and chaining',
            iconType: 'trophy',
            questions: [
              {
                id: 'dsa-1-4-1',
                type: 'concept-match',
                prompt: 'Match Hash Table collision resolution techniques:',
                explanation: 'Separate chaining uses linked lists in buckets; Open addressing probes alternate slots.',
                xpReward: 20,
                pairs: [
                  { id: 'ht1', term: 'Separate Chaining', definition: 'Each bucket holds a linked list of collided key-values' },
                  { id: 'ht2', term: 'Linear Probing', definition: 'Checks next sequential slot (index + 1) % size' },
                  { id: 'ht3', term: 'Load Factor (alpha)', definition: 'Ratio of stored items to total capacity (N / M)' },
                  { id: 'ht4', term: 'Hash Collision', definition: 'Two distinct keys producing the same bucket index' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  algorithms: {
    id: 'algorithms',
    title: 'Algorithms',
    shortTitle: 'Algorithms',
    tagline: 'Sorting, Searching, Two Pointers, Recursion & Dynamic Programming',
    badge: '⚡ Algorithms',
    icon: 'GitBranch',
    color: 'from-orange-500 to-amber-600',
    placementQuestions: [
      {
        id: 'algo-place-1',
        type: 'predict-output',
        prompt: 'What is the time complexity of Binary Search on a sorted array of size N?',
        explanation: 'Binary Search halves the search space at each iteration, giving O(log N).',
        xpReward: 15,
        difficulty: 'beginner',
        codeSnippet: `// Searching for target in sorted array:
int low = 0, high = n - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    // ...
}`,
        options: [
          { id: '1', text: 'O(log N)', isCorrect: true },
          { id: '2', text: 'O(N)', isCorrect: false },
          { id: '3', text: 'O(1)', isCorrect: false },
          { id: '4', text: 'O(N log N)', isCorrect: false }
        ]
      },
      {
        id: 'algo-place-2',
        type: 'spot-the-bug',
        prompt: 'Spot the bug that can cause integer overflow in Binary Search mid calculation:',
        explanation: 'Line 1 uses (low + high) / 2, which can overflow if low + high exceeds maximum 32-bit signed integer (2^31 - 1).',
        xpReward: 15,
        difficulty: 'intermediate',
        codeLines: [
          'int mid = (low + high) / 2;',
          'if (arr[mid] == target) return mid;',
          'else if (arr[mid] < target) low = mid + 1;',
          'else high = mid - 1;'
        ],
        bugLineIndex: 0,
        bugExplanation: '(low + high) / 2 overflows with large numbers! Safe formula is low + (high - low) / 2.'
      },
      {
        id: 'algo-place-3',
        type: 'concept-match',
        prompt: 'Match Sorting Algorithms with their worst-case time complexities:',
        explanation: 'Merge sort is O(N log N) worst-case; Quick sort degrades to O(N^2) with poor pivot; Bubble sort is O(N^2).',
        xpReward: 15,
        difficulty: 'intermediate',
        pairs: [
          { id: 'alg1', term: 'Merge Sort', definition: 'O(N log N) worst-case (Divide and Conquer, Stable)' },
          { id: 'alg2', term: 'Quick Sort', definition: 'O(N log N) avg, O(N^2) worst with bad pivot' },
          { id: 'alg3', term: 'Bubble Sort', definition: 'O(N^2) comparisons and swaps' },
          { id: 'alg4', term: 'Counting Sort', definition: 'O(N + K) non-comparative integer sort' }
        ]
      },
      {
        id: 'algo-place-4',
        type: 'tap-to-fill',
        prompt: 'Complete the Two Pointers condition to find two numbers that sum to target:',
        explanation: 'In a sorted array, if current sum is less than target, advance the left pointer; if greater, decrement right pointer.',
        xpReward: 15,
        difficulty: 'advanced',
        codeTemplate: `int sum = arr[left] + arr[right];
if (sum == target) return {left, right};
else if (sum < target) {{blank1}}++;
else {{blank2}}--;`,
        options: ['left', 'right', 'mid', 'sum', 'target'],
        blanks: [
          { id: 'blank1', correctValue: 'left' },
          { id: 'blank2', correctValue: 'right' }
        ]
      },
      {
        id: 'algo-place-5',
        type: 'predict-output',
        prompt: 'What happens in recursion when the base case is omitted?',
        explanation: 'Without a base case, recursion continues indefinitely until the call stack runs out of memory, throwing a Stack Overflow error.',
        xpReward: 20,
        difficulty: 'advanced',
        codeSnippet: `def recurse(n):
    return recurse(n - 1) # No base case!

recurse(5)`,
        options: [
          { id: '1', text: 'RecursionError / Stack Overflow', isCorrect: true },
          { id: '2', text: 'Returns 0', isCorrect: false },
          { id: '3', text: 'Returns -Infinity', isCorrect: false },
          { id: '4', text: 'Memory Leak', isCorrect: false }
        ]
      }
    ],
    units: [
      {
        id: 'algo-u1',
        courseId: 'algorithms',
        unitNumber: 1,
        title: 'Unit 1: Searching & Sorting Fundamentals',
        description: 'Big-O notation, Binary Search, Two Pointers, and Merge Sort',
        color: 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400',
        bannerColor: 'bg-gradient-to-r from-orange-600 to-amber-600',
        nodes: [
          {
            id: 'algo-u1-n1',
            unitId: 'algo-u1',
            title: 'Big-O Complexity Mastery',
            description: 'Evaluate time & space asymptotic behavior',
            iconType: 'code',
            teachingIntro: {
              title: 'The Tear-in-Half Trick: Why Algorithms Matter',
              subtitle: 'Ada 👧 reveals how clever algorithms turn centuries into milliseconds',
              characterId: 'ada',
              steps: [
                {
                  characterId: 'ada',
                  characterMood: 'teaching',
                  speech: "Welcome to Algorithms! 👧 An algorithm is just a recipe for solving a problem. But some recipes take 10 seconds, and others take 10,000 years!\n\nImagine searching for a name in a 1,000-page phonebook. Looking page-by-page takes up to 1,000 steps (O(N)). But opening to the middle and cutting the book in half each time takes only 10 steps (O(log N))!",
                  codeSnippet: `// 1,000,000 items:
// Linear Search: up to 1,000,000 comparisons
// Binary Search: only ~20 comparisons!`
                },
                {
                  characterId: 'junior',
                  characterMood: 'thinking',
                  speech: "So Big-O notation is just measuring how much slower code gets as data grows?",
                  anatomy: [
                    { token: 'O(1)', explanation: 'Instantaneous! Takes the exact same time whether you have 1 item or 10 billion.' },
                    { token: 'O(log N)', explanation: 'Halves the work each step (like Binary Search). Super fast!' },
                    { token: 'O(N)', explanation: 'Time grows proportionally with data size (scanning every item once).' },
                    { token: 'O(N^2)', explanation: 'Nested loops. Danger zone for large data sets!' }
                  ]
                }
              ]
            },
            questions: [
              {
                id: 'algo-1-1-1',
                type: 'predict-output',
                prompt: 'What is the time complexity of this nested loop?',
                explanation: 'Outer loop runs N times, inner loop runs N times -> N * N = O(N^2).',
                xpReward: 10,
                codeSnippet: `for i in range(n):
    for j in range(n):
        print(i, j)`,
                options: [
                  { id: '1', text: 'O(N^2) Quadratic', isCorrect: true },
                  { id: '2', text: 'O(N) Linear', isCorrect: false },
                  { id: '3', text: 'O(2N)', isCorrect: false },
                  { id: '4', text: 'O(N log N)', isCorrect: false }
                ]
              },
              {
                id: 'algo-1-1-2',
                type: 'concept-match',
                prompt: 'Match Big-O orders from fastest to slowest:',
                explanation: 'O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N).',
                xpReward: 15,
                pairs: [
                  { id: 'bo1', term: 'O(1)', definition: 'Constant Time (Instantaneous hash lookup)' },
                  { id: 'bo2', term: 'O(log N)', definition: 'Logarithmic Time (Binary Search tree halving)' },
                  { id: 'bo3', term: 'O(N log N)', definition: 'Linearithmic Time (Optimal comparison sorting)' },
                  { id: 'bo4', term: 'O(2^N)', definition: 'Exponential Time (Brute force subsets / TSP)' }
                ]
              },
              {
                id: 'algo-1-1-3',
                type: 'spot-the-bug',
                prompt: 'Spot where an unintended O(N^2) operation hides inside an O(N) loop:',
                explanation: 'Line 2 tests "item in my_list" inside a loop, which does an O(N) linear search each iteration, making total time O(N^2).',
                xpReward: 15,
                codeLines: [
                  'for item in query_items: # N items',
                  '    if item in lookup_list: # O(N) scan on list!',
                  '        matched.append(item)',
                  '# Use set for O(1) lookup!'
                ],
                bugLineIndex: 1,
                bugExplanation: 'Testing membership with "in list" is O(N). Inside a loop, it makes the algorithm O(N^2)! Use a set instead for O(1).'
              }
            ]
          },
          {
            id: 'algo-u1-n2',
            unitId: 'algo-u1',
            title: 'Binary Search & Boundary Conditions',
            description: 'Halving search space, lower_bound, and upper_bound',
            iconType: 'terminal',
            questions: [
              {
                id: 'algo-1-2-1',
                type: 'tap-to-fill',
                prompt: 'Calculate mid without integer overflow:',
                explanation: 'Using low + (high - low) / 2 prevents (low + high) from exceeding integer capacity limits.',
                xpReward: 10,
                codeTemplate: `int mid = {{blank1}} + ({{blank2}} - low) / 2;`,
                options: ['low', 'high', 'mid', '2', 'size'],
                blanks: [
                  { id: 'blank1', correctValue: 'low' },
                  { id: 'blank2', correctValue: 'high' }
                ]
              },
              {
                id: 'algo-1-2-2',
                type: 'predict-output',
                prompt: 'How many comparisons does Binary Search need for 1,000,000 items in the worst case?',
                explanation: 'log2(1,000,000) ~ 20 comparisons!',
                xpReward: 10,
                codeSnippet: `// Array size = 1,000,000
// 2^20 = 1,048,576 > 1,000,000`,
                options: [
                  { id: '1', text: '~20 comparisons', isCorrect: true },
                  { id: '2', text: '500,000 comparisons', isCorrect: false },
                  { id: '3', text: '1,000 comparisons', isCorrect: false },
                  { id: '4', text: '~100 comparisons', isCorrect: false }
                ]
              },
              {
                id: 'algo-1-2-3',
                type: 'concept-match',
                prompt: 'Match search criteria with algorithms:',
                explanation: 'Linear search works on unsorted; Binary search requires sorted arrays.',
                xpReward: 15,
                pairs: [
                  { id: 'bs1', term: 'Sorted Array Requirement', definition: 'Mandatory precondition for Binary Search' },
                  { id: 'bs2', term: 'Lower Bound', definition: 'First index where arr[i] >= target' },
                  { id: 'bs3', term: 'Upper Bound', definition: 'First index where arr[i] > target' },
                  { id: 'bs4', term: 'Linear Search', definition: 'Only option for unsorted, unindexed data' }
                ]
              }
            ]
          },
          {
            id: 'algo-u1-n3',
            unitId: 'algo-u1',
            title: 'Two Pointers & Sliding Window',
            description: 'Pair sum, palindrome check, and subarray optimization',
            iconType: 'zap',
            questions: [
              {
                id: 'algo-1-3-1',
                type: 'predict-output',
                prompt: 'What does this Two Pointers Palindrome check return for "racecar"?',
                explanation: '"racecar" reads the same forwards and backwards, so left and right characters match until pointers meet -> True.',
                xpReward: 10,
                codeSnippet: `def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]: return False
        l += 1; r -= 1
    return True

print(is_palindrome("racecar"))`,
                options: [
                  { id: '1', text: 'True', isCorrect: true },
                  { id: '2', text: 'False', isCorrect: false },
                  { id: '3', text: 'None', isCorrect: false },
                  { id: '4', text: 'IndexError', isCorrect: false }
                ]
              },
              {
                id: 'algo-1-3-2',
                type: 'spot-the-bug',
                prompt: 'Spot the off-by-one pointer index error:',
                explanation: 'Line 2 sets right pointer to len(nums), which causes an IndexError when accessing nums[right]! It should be len(nums) - 1.',
                xpReward: 15,
                codeLines: [
                  'left = 0',
                  'right = len(nums) # Out of bounds!',
                  'while left < right:',
                  '    sum = nums[left] + nums[right]'
                ],
                bugLineIndex: 1,
                bugExplanation: 'right index must be len(nums) - 1. Using len(nums) will trigger an IndexError!'
              }
            ]
          },
          {
            id: 'algo-u1-n4',
            unitId: 'algo-u1',
            title: 'Unit 1 Checkpoint: Merge Sort & Divide and Conquer',
            description: 'Splitting, sorting, and merging subarrays in O(N log N)',
            iconType: 'trophy',
            questions: [
              {
                id: 'algo-1-4-1',
                type: 'concept-match',
                prompt: 'Match Divide & Conquer steps in Merge Sort:',
                explanation: 'Divide splits into halves, Conquer recursively sorts, Combine merges two sorted halves.',
                xpReward: 20,
                pairs: [
                  { id: 'dc1', term: 'Divide Step', definition: 'Split array into two halves at mid index' },
                  { id: 'dc2', term: 'Conquer Step', definition: 'Recursively sort both left and right subarrays' },
                  { id: 'dc3', term: 'Combine Step', definition: 'Merge two sorted arrays in O(N) using two pointers' },
                  { id: 'dc4', term: 'Space Complexity', definition: 'O(N) auxiliary memory required for temporary merge buffers' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
