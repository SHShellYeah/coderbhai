import { Course, CourseId } from '../types';

export const COURSES: Record<CourseId, Course> = {
  "c": {
    "id": "c",
    "title": "C Language",
    "shortTitle": "Pure C",
    "tagline": "Master procedural C, stdio.h, printf/scanf, raw memory, pointers & structs",
    "badge": "⚙️ Pure C",
    "icon": "Terminal",
    "color": "from-slate-700 to-cyan-900",
    "placementQuestions": [
      {
        "id": "c-place-1",
        "type": "predict-output",
        "prompt": "What does this C code output to the terminal?",
        "explanation": "In C, integer division 15 / 4 truncates towards zero, yielding 3.",
        "xpReward": 10,
        "difficulty": "beginner",
        "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int a = 15;\n    int b = 4;\n    printf(\"%d\", a / b);\n    return 0;\n}",
        "options": [
          {
            "id": "1",
            "text": "3.75",
            "isCorrect": false
          },
          {
            "id": "2",
            "text": "3",
            "isCorrect": true
          },
          {
            "id": "3",
            "text": "4",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "Compilation Error",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "c-place-2",
        "type": "spot-the-bug",
        "prompt": "Spot the missing address-of (&) operator in scanf:",
        "explanation": "scanf expects the memory address (&score) to store input. Passing score directly without & triggers undefined behavior or a crash!",
        "xpReward": 15,
        "difficulty": "intermediate",
        "codeLines": [
          "int score = 0;",
          "printf(\"Enter score: \");",
          "scanf(\"%d\", score); // Missing &!",
          "printf(\"Score: %d\", score);"
        ],
        "bugLineIndex": 2,
        "bugExplanation": "scanf requires &score to write input into the memory address of score!"
      },
      {
        "id": "c-place-3",
        "type": "concept-match",
        "prompt": "Match foundational C standard library functions with their purpose:",
        "explanation": "printf writes to stdout, scanf reads from stdin, malloc allocates heap memory, free releases heap bytes.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "pairs": [
          {
            "id": "cp1",
            "term": "printf()",
            "definition": "Formatted output to terminal (<stdio.h>)"
          },
          {
            "id": "cp2",
            "term": "scanf()",
            "definition": "Formatted input from keyboard (<stdio.h>)"
          },
          {
            "id": "cp3",
            "term": "malloc(size)",
            "definition": "Allocates raw heap bytes (<stdlib.h>)"
          },
          {
            "id": "cp4",
            "term": "free(ptr)",
            "definition": "Releases allocated heap memory back to OS"
          }
        ]
      },
      {
        "id": "c-place-4",
        "type": "tap-to-fill",
        "prompt": "Allocate an array of 5 integers dynamically in C and safely free it:",
        "explanation": "In C, malloc takes byte size calculated with sizeof(type), and free() releases it.",
        "xpReward": 15,
        "difficulty": "advanced",
        "codeTemplate": "int* arr = (int*)malloc(5 * {{blank1}}(int));\n// do work...\n{{blank2}}(arr);",
        "options": [
          "sizeof",
          "free",
          "delete",
          "new",
          "calloc"
        ],
        "blanks": [
          {
            "id": "blank1",
            "correctValue": "sizeof"
          },
          {
            "id": "blank2",
            "correctValue": "free"
          }
        ]
      },
      {
        "id": "c-place-5",
        "type": "predict-output",
        "prompt": "What does this C pointer dereference print?",
        "explanation": "*ptr = 99 directly updates the value stored at variable val address.",
        "xpReward": 20,
        "difficulty": "advanced",
        "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int val = 42;\n    int* ptr = &val;\n    *ptr = 99;\n    printf(\"%d\", val);\n    return 0;\n}",
        "options": [
          {
            "id": "1",
            "text": "42",
            "isCorrect": false
          },
          {
            "id": "2",
            "text": "99",
            "isCorrect": true
          },
          {
            "id": "3",
            "text": "Address of val",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "Garbage Value",
            "isCorrect": false
          }
        ]
      }
    ],
    "units": [
      {
        "id": "c-u1",
        "courseId": "c",
        "unitNumber": 1,
        "title": "Unit 1: The Launchpad — Output & Variables",
        "description": "Master printf, fundamental variables, format specifiers, and arithmetic expressions",
        "color": "border-cyan-600 bg-cyan-600/10 text-cyan-600 dark:text-cyan-400",
        "bannerColor": "bg-gradient-to-r from-slate-700 to-cyan-900",
        "nodes": [
          {
            "id": "c-u1-n1",
            "unitId": "c-u1",
            "title": "Hello C & printf",
            "description": "Learn why C uses stdio.h and printf instead of std::cout",
            "iconType": "terminal",
            "teachingIntro": {
              "title": "Your First C Program: printf & stdio.h",
              "subtitle": "Lin 🕶️ & Junior 🧢 introduce the mother of modern languages",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "Welcome to Pure C! 🕶️ In C, there are no classes, no namespaces, and no 'std::cout'.\n\nC is direct and blazing fast. Operating system kernels like Linux and Windows are written in C! To print to the screen, we include <stdio.h> (Standard Input/Output) and use the printf() function.",
                  "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}"
                },
                {
                  "characterId": "junior",
                  "characterMood": "thinking",
                  "speech": "Wait Lin! 🧢 What is \\n and why does main return 0?",
                  "anatomy": [
                    {
                      "token": "#include <stdio.h>",
                      "explanation": "Loads standard C I/O tools (printf, scanf)."
                    },
                    {
                      "token": "printf(\"...\")",
                      "explanation": "Prints formatted text to your terminal screen."
                    },
                    {
                      "token": "\\n",
                      "explanation": "Newline character. Moves the cursor down to the next line."
                    },
                    {
                      "token": "return 0;",
                      "explanation": "Tells the operating system the program executed successfully with 0 errors."
                    }
                  ],
                  "interactiveTry": {
                    "prompt": "Assemble your first pure C program statement to print Hello C!",
                    "tokens": [
                      "printf(",
                      "\"Hello C!\\n\"",
                      ");",
                      "std::cout",
                      "<<"
                    ],
                    "targetOrder": [
                      "printf(",
                      "\"Hello C!\\n\"",
                      ");"
                    ],
                    "previewOutput": "Hello C!\n"
                  }
                },
                {
                  "characterId": "lin",
                  "characterMood": "cheering",
                  "speech": "Awesome! 🎉 Notice the semicolon (;) at the end of every statement. In C, missing a semicolon breaks the whole compilation!"
                }
              ]
            },
            "questions": [
              {
                "id": "c-1-1-1",
                "type": "tap-to-fill",
                "prompt": "Fill in the basic C hello world program structure:",
                "explanation": "stdio.h provides printf, and return 0 signals successful completion to the operating system.",
                "xpReward": 10,
                "mentorTip": "stdio.h is Standard Input Output!",
                "codeTemplate": "#include <{{blank1}}>\nint main(void) {\n    printf(\"Hello, World!\\n\");\n    return {{blank2}};\n}",
                "options": [
                  "stdio.h",
                  "iostream",
                  "0",
                  "1",
                  "void"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "stdio.h"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "0"
                  }
                ]
              },
              {
                "id": "c-1-1-2",
                "type": "predict-output",
                "prompt": "What will this C program print to the terminal?",
                "explanation": "Without a newline character \\n, multiple printf statements continue on the exact same terminal line!",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    printf(\"Pure\");\n    printf(\"C\");\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "PureC",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Pure C",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Pure\\nC",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Compilation Error",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-1-1-3",
                "type": "spot-the-bug",
                "prompt": "Spot the missing semicolon syntax error on line 4:",
                "explanation": "Every executable statement in C must end with a semicolon (;). Line 4 is missing it!",
                "xpReward": 15,
                "codeLines": [
                  "#include <stdio.h>",
                  "int main(void) {",
                  "    printf(\"Welcome to C!\\n\");",
                  "    printf(\"No semicolon here\")",
                  "    return 0;",
                  "}"
                ],
                "bugLineIndex": 3,
                "bugExplanation": "Missing semicolon (;) at the end of the printf statement!"
              },
              {
                "id": "c-1-1-4",
                "type": "concept-match",
                "prompt": "Connect pure C syntax tokens with their roles:",
                "explanation": "printf outputs formatted strings, \\n creates newlines, stdio.h is the C I/O header, return 0 signals success.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "c_cm1",
                    "term": "printf()",
                    "definition": "Formatted print function in C (<stdio.h>)"
                  },
                  {
                    "id": "c_cm2",
                    "term": "\\n",
                    "definition": "Escape sequence creating a new line in terminal"
                  },
                  {
                    "id": "c_cm3",
                    "term": "stdio.h",
                    "definition": "Standard Input Output header file in C"
                  },
                  {
                    "id": "c_cm4",
                    "term": "return 0;",
                    "definition": "Exit status code indicating successful program termination"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u1-n2",
            "unitId": "c-u1",
            "title": "Variables & Data Types",
            "description": "Store numbers and characters in memory with int, float, and char",
            "iconType": "code",
            "teachingIntro": {
              "title": "Variables: Labeled Memory Storage",
              "subtitle": "Ada 👧 & Junior 🧢 teach how C stores data in RAM",
              "characterId": "ada",
              "steps": [
                {
                  "characterId": "ada",
                  "characterMood": "teaching",
                  "speech": "Hi! I'm Ada 👧. Before we jump to anything complex, let's understand how computers remember things!\n\nIn C, variables are labeled boxes in memory. Because C is strongly typed, you must declare what type of data fits in each box:\n• int for integers (42, -5)\n• float for decimal numbers (3.14)\n• char for single characters in single quotes ('A')",
                  "codeSnippet": "int score = 100;\nfloat price = 19.99f;\nchar grade = 'A';"
                },
                {
                  "characterId": "junior",
                  "characterMood": "thinking",
                  "speech": "Can I update the value in a box later?",
                  "anatomy": [
                    {
                      "token": "int score = 100;",
                      "explanation": "Declaration & initialization: reserves 4 bytes in RAM for score."
                    },
                    {
                      "token": "score = 150;",
                      "explanation": "Reassignment: updates the value inside the box to 150."
                    },
                    {
                      "token": "'A' vs \"A\"",
                      "explanation": "Single quotes 'A' are for single char. Double quotes \"A\" are for strings!"
                    }
                  ]
                }
              ]
            },
            "questions": [
              {
                "id": "c-var-1",
                "type": "tap-to-fill",
                "prompt": "Declare an integer age and a character grade in C:",
                "explanation": "int represents whole numbers and char represents single characters in single quotes.",
                "xpReward": 10,
                "codeTemplate": "{{blank1}} age = 21;\n{{blank2}} grade = 'A';",
                "options": [
                  "int",
                  "char",
                  "float",
                  "string",
                  "bool"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "int"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "char"
                  }
                ]
              },
              {
                "id": "c-var-2",
                "type": "predict-output",
                "prompt": "What does this variable update output?",
                "explanation": "score starts at 50, then score = score + 25 updates it to 75.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int score = 50;\n    score = score + 25;\n    printf(\"%d\", score);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "75",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "50",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "25",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "score + 25",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-var-3",
                "type": "spot-the-bug",
                "prompt": "Spot the incorrect quote syntax for char on line 3:",
                "explanation": "In C, single characters must be enclosed in single quotes 'A'. Double quotes \"A\" create a string literal (char*)!",
                "xpReward": 15,
                "codeLines": [
                  "#include <stdio.h>",
                  "int main(void) {",
                  "    char letter = \"Z\"; // Bug! Must use single quotes 'Z'",
                  "    printf(\"%c\", letter);",
                  "    return 0;",
                  "}"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "Single characters must use single quotes 'Z', not double quotes \"Z\"!"
              },
              {
                "id": "c-var-4",
                "type": "concept-match",
                "prompt": "Match C fundamental data types with their properties:",
                "explanation": "int holds whole numbers, float holds decimals, char holds single characters, and double provides 64-bit precision.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "cv1",
                    "term": "int",
                    "definition": "Whole numbers (typically 4 bytes, e.g. -10, 42)"
                  },
                  {
                    "id": "cv2",
                    "term": "float",
                    "definition": "Single-precision floating-point numbers (e.g. 3.14f)"
                  },
                  {
                    "id": "cv3",
                    "term": "char",
                    "definition": "Single ASCII character in single quotes ('A')"
                  },
                  {
                    "id": "cv4",
                    "term": "double",
                    "definition": "Double-precision floating-point numbers (8 bytes)"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u1-n3",
            "unitId": "c-u1",
            "title": "Format Specifiers (%d, %f, %c, %s)",
            "description": "Learn how C formats and prints variables with format specifiers",
            "iconType": "code",
            "teachingIntro": {
              "title": "Format Specifiers: The C Placeholders",
              "subtitle": "Lin 🕶️ teaches how C replaces % with real variables",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "In C, printf doesn't magically know what types you pass it! You must use format specifiers:\n\n• %d for integer (decimal)\n• %f for float/double (decimal numbers)\n• %c for char (single character)\n• %s for string (null-terminated char array)",
                  "codeSnippet": "int age = 21;\nfloat gpa = 3.85f;\nprintf(\"Age: %d, GPA: %.2f\\n\", age, gpa);"
                }
              ]
            },
            "questions": [
              {
                "id": "c-1-2-1",
                "type": "tap-to-fill",
                "prompt": "Fill in the correct format specifier to print an integer and character:",
                "explanation": "%d prints integer numbers, and %c prints single characters.",
                "xpReward": 10,
                "mentorTip": "Use %d for integers and %c for characters!",
                "codeTemplate": "int count = 7;\nchar grade = 'A';\nprintf(\"Count: %{{blank1}}, Grade: %{{blank2}}\\n\", count, grade);",
                "options": [
                  "d",
                  "c",
                  "s",
                  "f",
                  "p"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "d"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "c"
                  }
                ]
              },
              {
                "id": "c-1-2-2",
                "type": "predict-output",
                "prompt": "What does this formatted C print statement output?",
                "explanation": "%.1f formats the floating point number to 1 decimal place -> 9.8.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    double gravity = 9.81;\n    printf(\"G: %.1f\", gravity);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "G: 9.8",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "G: 9.81",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "G: 10",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "G: %.1f",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-1-2-3",
                "type": "spot-the-bug",
                "prompt": "Spot the format specifier mismatch bug on line 3:",
                "explanation": "Line 3 passes a floating-point number 3.14 to %d, which causes undefined behavior / garbage output in C!",
                "xpReward": 15,
                "codeLines": [
                  "#include <stdio.h>",
                  "int main(void) {",
                  "    printf(\"Value: %d\\n\", 3.14159); // Mismatch! Expects %f",
                  "    return 0;",
                  "}"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "Passing a float to %d causes a format specifier mismatch and garbage output! Use %f for decimal numbers."
              },
              {
                "id": "c-1-2-4",
                "type": "concept-match",
                "prompt": "Match C format specifiers with their corresponding data types:",
                "explanation": "%d matches int, %f matches float/double, %c matches char, %s matches string.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "fs1",
                    "term": "%d",
                    "definition": "Signed integer (int)"
                  },
                  {
                    "id": "fs2",
                    "term": "%f",
                    "definition": "Floating-point number (float, double)"
                  },
                  {
                    "id": "fs3",
                    "term": "%c",
                    "definition": "Single character (char)"
                  },
                  {
                    "id": "fs4",
                    "term": "%s",
                    "definition": "Null-terminated string (char*)"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u1-n4",
            "unitId": "c-u1",
            "title": "Operators & Arithmetic Expressions",
            "description": "Integer division, modulo remainder, and operator precedence in C",
            "iconType": "zap",
            "teachingIntro": {
              "title": "Arithmetic in C: Truncation & Modulo",
              "subtitle": "Turing 🤖 reveals how C handles math calculations",
              "characterId": "turing",
              "steps": [
                {
                  "characterId": "turing",
                  "characterMood": "teaching",
                  "speech": "Attention coder! 🤖 Math in C has one vital quirk every developer must know:\n\nWhen dividing two integers, C throws away the fractional part (it truncates towards zero)! So 10 / 4 is NOT 2.5, it is 2!\n\nTo get the remainder, use the modulo operator (%): 10 % 4 is 2!",
                  "codeSnippet": "int div = 10 / 4; // 2 (fraction dropped!)\nint rem = 10 % 4; // 2 (remainder)"
                }
              ]
            },
            "questions": [
              {
                "id": "c-1-3-1",
                "type": "predict-output",
                "prompt": "What does this integer arithmetic expression print?",
                "explanation": "Integer division 10 / 4 is 2. Then 2 + 2 = 4.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int result = 10 / 4 + 2;\n    printf(\"%d\", result);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "4",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "4.5",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "5",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "2",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-1-3-2",
                "type": "tap-to-fill",
                "prompt": "Use the modulo operator to calculate the remainder of 17 divided by 5:",
                "explanation": "The % operator calculates the remainder after integer division: 17 % 5 = 2.",
                "xpReward": 10,
                "codeTemplate": "int remainder = 17 {{blank1}} 5;",
                "options": [
                  "%",
                  "/",
                  "//",
                  "mod",
                  "*"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "%"
                  }
                ]
              },
              {
                "id": "c-1-3-3",
                "type": "spot-the-bug",
                "prompt": "Spot the fatal division by zero bug on line 4:",
                "explanation": "Division by zero triggers undefined behavior and crashes the program at runtime!",
                "xpReward": 15,
                "codeLines": [
                  "#include <stdio.h>",
                  "int main(void) {",
                  "    int y = 0;",
                  "    int result = 100 / y; // CRASH! Division by zero",
                  "    return 0;",
                  "}"
                ],
                "bugLineIndex": 3,
                "bugExplanation": "Dividing by variable y which has value 0 causes undefined behavior and crashes!"
              },
              {
                "id": "c-1-3-4",
                "type": "concept-match",
                "prompt": "Match C arithmetic operators with their behaviors:",
                "explanation": "/ truncates with ints, % returns remainder, ++ increments by 1, == checks equality.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "op1",
                    "term": "/ (integer)",
                    "definition": "Divides and truncates fractional part towards zero"
                  },
                  {
                    "id": "op2",
                    "term": "% (modulo)",
                    "definition": "Returns remainder after integer division"
                  },
                  {
                    "id": "op3",
                    "term": "++",
                    "definition": "Increments variable value by 1"
                  },
                  {
                    "id": "op4",
                    "term": "==",
                    "definition": "Relational operator checking equality (returns 1 or 0)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "c-u2",
        "courseId": "c",
        "unitNumber": 2,
        "title": "Unit 2: User Input & Decision Making",
        "description": "Interact with users via scanf, compare values, and branch logic with if & else",
        "color": "border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400",
        "bannerColor": "bg-gradient-to-r from-blue-700 to-cyan-800",
        "nodes": [
          {
            "id": "c-u2-n1",
            "unitId": "c-u2",
            "title": "Interactive scanf & User Input",
            "description": "Read user input with scanf and learn why the & symbol is required",
            "iconType": "terminal",
            "teachingIntro": {
              "title": "Reading Input: scanf() and the & Symbol",
              "subtitle": "Lin 🕶️ & Junior 🧢 explain how scanf stores keyboard input",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "Now your programs can talk, but can they listen? In C, we read input with scanf() from <stdio.h>!\n\nNotice the & before the variable name: scanf(\"%d\", &age);\n\nThink of & as giving the mail carrier your house address! The & tells scanf where in memory to put the number you typed.",
                  "codeSnippet": "int age;\nprintf(\"Enter your age: \");\nscanf(\"%d\", &age);\nprintf(\"You are %d years old!\\n\", age);"
                },
                {
                  "characterId": "junior",
                  "characterMood": "surprised",
                  "speech": "What happens if I forget the &?",
                  "anatomy": [
                    {
                      "token": "scanf(\"%d\", ...)",
                      "explanation": "Reads an integer from keyboard input."
                    },
                    {
                      "token": "&age",
                      "explanation": "Address-of operator: tells scanf the memory destination where to write the input."
                    },
                    {
                      "token": "Missing &",
                      "explanation": "Without &, scanf treats the uninitialized number as a memory address and crashes!"
                    }
                  ]
                }
              ]
            },
            "questions": [
              {
                "id": "c-scanf-1",
                "type": "tap-to-fill",
                "prompt": "Complete the scanf statement to read an integer into variable score:",
                "explanation": "scanf requires format specifier %d and the memory address &score.",
                "xpReward": 10,
                "codeTemplate": "int score;\nprintf(\"Enter score: \");\nscanf(\"%{{blank1}}\", {{blank2}}score);",
                "options": [
                  "d",
                  "&",
                  "f",
                  "*",
                  "c"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "d"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "&"
                  }
                ]
              },
              {
                "id": "c-scanf-2",
                "type": "spot-the-bug",
                "prompt": "Spot the missing address-of (&) operator in scanf:",
                "explanation": "scanf requires &score to write input into the memory address of score!",
                "xpReward": 15,
                "codeLines": [
                  "int score = 0;",
                  "printf(\"Enter score: \");",
                  "scanf(\"%d\", score); // Bug! Missing &",
                  "printf(\"Score: %d\", score);"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "scanf requires &score to write input into the memory address of score!"
              },
              {
                "id": "c-scanf-3",
                "type": "concept-match",
                "prompt": "Match user input components with their roles:",
                "explanation": "scanf parses stdin, & gets memory address, %d specifies integer format, and stdin is standard input stream.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "sc1",
                    "term": "scanf()",
                    "definition": "Standard C function reading formatted user input"
                  },
                  {
                    "id": "sc2",
                    "term": "& operator",
                    "definition": "Address-of operator giving destination address to scanf"
                  },
                  {
                    "id": "sc3",
                    "term": "stdin",
                    "definition": "Standard input stream (keyboard)"
                  },
                  {
                    "id": "sc4",
                    "term": "Buffer",
                    "definition": "Temporary memory area holding unread keystrokes"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u2-n2",
            "unitId": "c-u2",
            "title": "Conditionals: if & else",
            "description": "Make decisions based on comparison operators (==, !=, <, >)",
            "iconType": "code",
            "teachingIntro": {
              "title": "Decision Making: if and else",
              "subtitle": "Ada 👧 teaches the logic of branching code paths",
              "characterId": "ada",
              "steps": [
                {
                  "characterId": "ada",
                  "characterMood": "teaching",
                  "speech": "Computers become smart when they make choices! In C, we use if and else:\n\nif (condition) {\n    // runs if condition is true\n} else {\n    // runs if condition is false\n}\n\nWatch out: == checks equality, while a single = assigns values!",
                  "codeSnippet": "int score = 75;\nif (score >= 50) {\n    printf(\"Pass!\\n\");\n} else {\n    printf(\"Try Again!\\n\");\n}"
                }
              ]
            },
            "questions": [
              {
                "id": "c-1-4-1",
                "type": "tap-to-fill",
                "prompt": "Complete the if-else branch to test if score is passing:",
                "explanation": "if executes the code block when true; else executes when false.",
                "xpReward": 10,
                "codeTemplate": "int score = 85;\n{{blank1}} (score >= 50) {\n    printf(\"Pass\\n\");\n} {{blank2}} {\n    printf(\"Fail\\n\");\n}",
                "options": [
                  "if",
                  "else",
                  "elif",
                  "then",
                  "switch"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "if"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "else"
                  }
                ]
              },
              {
                "id": "c-1-4-2",
                "type": "predict-output",
                "prompt": "What does this conditional statement output?",
                "explanation": "Since temperature 18 is less than 20, the else block runs and prints \"Jacket\".",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int temp = 18;\n    if (temp >= 20) {\n        printf(\"T-Shirt\");\n    } else {\n        printf(\"Jacket\");\n    }\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "Jacket",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "T-Shirt",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "T-ShirtJacket",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Nothing",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-1-4-3",
                "type": "spot-the-bug",
                "prompt": "Spot the accidental assignment bug on line 3:",
                "explanation": "Using a single = inside if condition assigns 100 to score (which evaluates as truthy!) instead of comparing with ==.",
                "xpReward": 15,
                "codeLines": [
                  "int score = 40;",
                  "// Bug on line 3: assigns instead of compares!",
                  "if (score = 100) {",
                  "    printf(\"Perfect Score!\");",
                  "}"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "Single = is assignment! Use == to check equality."
              },
              {
                "id": "c-1-4-4",
                "type": "concept-match",
                "prompt": "Match relational operators with their meaning:",
                "explanation": "== tests equality, != tests inequality, >= tests greater or equal, <= tests less or equal.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "rel1",
                    "term": "==",
                    "definition": "Checks if two values are equal"
                  },
                  {
                    "id": "rel2",
                    "term": "!=",
                    "definition": "Checks if two values are NOT equal"
                  },
                  {
                    "id": "rel3",
                    "term": ">=",
                    "definition": "Greater than or equal to"
                  },
                  {
                    "id": "rel4",
                    "term": "<=",
                    "definition": "Less than or equal to"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u2-n3",
            "unitId": "c-u2",
            "title": "Logical Operators (&&, ||, !)",
            "description": "Combine multiple conditions with AND, OR, and NOT",
            "iconType": "zap",
            "teachingIntro": {
              "title": "Combining Conditions: &&, ||, and !",
              "subtitle": "Turing 🤖 shows how to build complex decisions",
              "characterId": "turing",
              "steps": [
                {
                  "characterId": "turing",
                  "characterMood": "teaching",
                  "speech": "Real world decisions require multiple conditions! In C:\n\n• && (AND): true only if BOTH sides are true\n• || (OR): true if AT LEAST ONE side is true\n• ! (NOT): inverts true to false and false to true",
                  "codeSnippet": "int age = 22;\nint hasTicket = 1;\nif (age >= 18 && hasTicket) {\n    printf(\"Welcome to the show!\\n\");\n}"
                }
              ]
            },
            "questions": [
              {
                "id": "c-logic-1",
                "type": "predict-output",
                "prompt": "What does this logical AND (&&) expression print?",
                "explanation": "(x > 5) is false because x is 3. Since the first condition is false, && evaluates to false (0).",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int x = 3;\n    int y = 8;\n    if (x > 5 && y > 5) {\n        printf(\"Both\");\n    } else {\n        printf(\"Not Both\");\n    }\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "Not Both",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Both",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Error",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-logic-2",
                "type": "tap-to-fill",
                "prompt": "Fill in the logical operator for \"age between 18 and 65 inclusive\":",
                "explanation": "&& requires both the lower and upper bounds to be satisfied simultaneously.",
                "xpReward": 10,
                "codeTemplate": "if (age >= 18 {{blank1}} age <= 65) {\n    printf(\"Eligible\");\n}",
                "options": [
                  "&&",
                  "||",
                  "and",
                  "&",
                  "=="
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "&&"
                  }
                ]
              },
              {
                "id": "c-logic-3",
                "type": "concept-match",
                "prompt": "Match C logical operators with their truth rules:",
                "explanation": "&& requires both true, || requires either true, ! inverts truth, and else if creates multi-way ladders.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "lo1",
                    "term": "&& (Logical AND)",
                    "definition": "Evaluates to 1 (true) only if both operands are non-zero"
                  },
                  {
                    "id": "lo2",
                    "term": "|| (Logical OR)",
                    "definition": "Evaluates to 1 (true) if either operand is non-zero"
                  },
                  {
                    "id": "lo3",
                    "term": "! (Logical NOT)",
                    "definition": "Inverts truth: !1 becomes 0, !0 becomes 1"
                  },
                  {
                    "id": "lo4",
                    "term": "else if",
                    "definition": "Tests a subsequent condition if preceding if was false"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u2-n4",
            "unitId": "c-u2",
            "title": "Unit 2 Checkpoint: Logic Master",
            "description": "Synthesize user input, conditions, and format specifiers",
            "iconType": "trophy",
            "questions": [
              {
                "id": "c-check-1",
                "type": "predict-output",
                "prompt": "What does this grade evaluator print when score is 75?",
                "explanation": "75 is not >= 90. In the else if, 75 >= 70 is true, so it prints \"B\".",
                "xpReward": 15,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int score = 75;\n    if (score >= 90) {\n        printf(\"A\");\n    } else if (score >= 70) {\n        printf(\"B\");\n    } else {\n        printf(\"C\");\n    }\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "B",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "A",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "C",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "AB",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-check-2",
                "type": "tap-to-fill",
                "prompt": "Read an integer and print \"Even\" if divisible by 2:",
                "explanation": "Modulo 2 == 0 checks if a number is even, and scanf needs &n.",
                "xpReward": 15,
                "codeTemplate": "int n;\nscanf(\"%d\", {{blank1}}n);\nif (n % 2 == {{blank2}}) {\n    printf(\"Even\");\n}",
                "options": [
                  "&",
                  "0",
                  "1",
                  "*",
                  "2"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "&"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "0"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "c-u3",
        "courseId": "c",
        "unitNumber": 3,
        "title": "Unit 3: Loops & Repetition",
        "description": "Automate tasks with while loops, for loops, break, and continue",
        "color": "border-indigo-600 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400",
        "bannerColor": "bg-gradient-to-r from-indigo-700 to-purple-800",
        "nodes": [
          {
            "id": "c-u3-n1",
            "unitId": "c-u3",
            "title": "While Loops & Iteration",
            "description": "Repeat actions while a condition stays true and avoid infinite loops",
            "iconType": "zap",
            "teachingIntro": {
              "title": "Repetition: The While Loop",
              "subtitle": "Lin 🕶️ shows how loops save you from writing repeated code",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "Imagine writing printf 1,000 times! That would be awful. Instead, loops repeat code for you!\n\nA while loop runs as long as its condition remains true. Always remember to increment your counter (i++), or your loop will run forever!",
                  "codeSnippet": "int i = 1;\nwhile (i <= 3) {\n    printf(\"%d \", i);\n    i++; // Don't forget this!\n}\n// Prints: 1 2 3"
                }
              ]
            },
            "questions": [
              {
                "id": "c-2-1-1",
                "type": "tap-to-fill",
                "prompt": "Fill in the while loop to print numbers from 1 to 5:",
                "explanation": "while loop continues while i <= 5 and advances with i++.",
                "xpReward": 10,
                "codeTemplate": "int i = 1;\nwhile (i <= {{blank1}}) {\n    printf(\"%d \", i);\n    {{blank2}};\n}",
                "options": [
                  "5",
                  "i++",
                  "i--",
                  "0",
                  "10"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "5"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "i++"
                  }
                ]
              },
              {
                "id": "c-2-1-2",
                "type": "predict-output",
                "prompt": "What does this post-increment while loop output?",
                "explanation": "i is 0: prints 0, increments to 1. i is 1: prints 1, increments to 2. Loop terminates when i < 2 is false.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int i = 0;\n    while (i < 2) {\n        printf(\"%d\", i);\n        i++;\n    }\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "01",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "012",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "12",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-2-1-3",
                "type": "spot-the-bug",
                "prompt": "Identify the infinite loop bug on line 4:",
                "explanation": "Without updating the counter i++, i remains 0 forever, creating an infinite loop that never terminates!",
                "xpReward": 15,
                "codeLines": [
                  "int i = 0;",
                  "while (i < 5) {",
                  "    printf(\"Looping!\\n\");",
                  "    // Missing counter increment i++!",
                  "}"
                ],
                "bugLineIndex": 3,
                "bugExplanation": "Missing i++ counter increment causes an infinite loop!"
              },
              {
                "id": "c-2-1-4",
                "type": "concept-match",
                "prompt": "Match loop concepts with their definitions:",
                "explanation": "Condition decides whether to run, counter tracks progress, infinite loop never ends, and body contains statements.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "lp1",
                    "term": "Loop Condition",
                    "definition": "Boolean expression checked before each iteration"
                  },
                  {
                    "id": "lp2",
                    "term": "Loop Counter",
                    "definition": "Variable tracking how many times the loop has executed"
                  },
                  {
                    "id": "lp3",
                    "term": "Infinite Loop",
                    "definition": "Bug where condition never becomes false and program freezes"
                  },
                  {
                    "id": "lp4",
                    "term": "Iteration",
                    "definition": "A single cycle through the loop body"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u3-n2",
            "unitId": "c-u3",
            "title": "For Loops & Counting",
            "description": "Condense initialization, condition, and increment in one clean line",
            "iconType": "code",
            "teachingIntro": {
              "title": "Counting Made Simple: The For Loop",
              "subtitle": "Ada 👧 shows the 3-part engine of the for loop",
              "characterId": "ada",
              "steps": [
                {
                  "characterId": "ada",
                  "characterMood": "teaching",
                  "speech": "While loops are great, but the for loop is the undisputed champion of counting!\n\nIt bundles initialization, condition, and increment into one neat header: for (init; condition; step). Everything in one place so you never forget i++!",
                  "codeSnippet": "for (int i = 0; i < 5; i++) {\n    printf(\"%d \", i);\n}\n// Prints: 0 1 2 3 4"
                }
              ]
            },
            "questions": [
              {
                "id": "c-for-1",
                "type": "tap-to-fill",
                "prompt": "Complete the for loop to run 4 times (i from 0 to 3):",
                "explanation": "for (int i = 0; i < 4; i++) runs for i = 0, 1, 2, 3.",
                "xpReward": 10,
                "codeTemplate": "for (int i = 0; i < {{blank1}}; {{blank2}}) {\n    printf(\"Step \");\n}",
                "options": [
                  "4",
                  "i++",
                  "i--",
                  "5",
                  "0"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "4"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "i++"
                  }
                ]
              },
              {
                "id": "c-for-2",
                "type": "predict-output",
                "prompt": "What does this accumulator loop print?",
                "explanation": "sum accumulates: 0 + 1 + 2 + 3 = 6.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int sum = 0;\n    for (int i = 1; i <= 3; i++) {\n        sum += i;\n    }\n    printf(\"%d\", sum);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "6",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "3",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "123",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-for-3",
                "type": "concept-match",
                "prompt": "Match the 3 components of a for loop header:",
                "explanation": "Initialization runs once, condition is evaluated before each loop, update runs after each iteration.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "fh1",
                    "term": "int i = 0 (Init)",
                    "definition": "Executes once at the very start of the loop"
                  },
                  {
                    "id": "fh2",
                    "term": "i < n (Condition)",
                    "definition": "Checked before every iteration; if false, loop exits"
                  },
                  {
                    "id": "fh3",
                    "term": "i++ (Update)",
                    "definition": "Executes at the end of each iteration to advance counter"
                  },
                  {
                    "id": "fh4",
                    "term": "Off-by-one",
                    "definition": "Classic bug where loop runs one time too many or too few"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u3-n3",
            "unitId": "c-u3",
            "title": "Loop Controls: break & continue",
            "description": "Control flow inside loops: exit early with break or skip cycles with continue",
            "iconType": "terminal",
            "questions": [
              {
                "id": "c-ctrl-1",
                "type": "predict-output",
                "prompt": "What does this loop with a break statement print?",
                "explanation": "When i reaches 2, break immediately exits the loop, so only \"01\" is printed.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    for (int i = 0; i < 5; i++) {\n        if (i == 2) break;\n        printf(\"%d\", i);\n    }\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "01",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "012",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "01234",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "2",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-ctrl-2",
                "type": "tap-to-fill",
                "prompt": "Use continue to skip printing when i is 2:",
                "explanation": "continue skips the rest of the current iteration and jumps to the next cycle.",
                "xpReward": 10,
                "codeTemplate": "for (int i = 1; i <= 3; i++) {\n    if (i == 2) {{blank1}};\n    printf(\"%d\", i);\n}",
                "options": [
                  "continue",
                  "break",
                  "return",
                  "exit",
                  "pass"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "continue"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "c-u4",
        "courseId": "c",
        "unitNumber": 4,
        "title": "Unit 4: Functions & Modular Code",
        "description": "Write reusable functions, pass parameters, return values, and understand scope",
        "color": "border-emerald-600 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400",
        "bannerColor": "bg-gradient-to-r from-teal-700 to-emerald-800",
        "nodes": [
          {
            "id": "c-u4-n1",
            "unitId": "c-u4",
            "title": "Writing Functions & Return Values",
            "description": "Decompose programs into clean, modular, reusable functions",
            "iconType": "code",
            "teachingIntro": {
              "title": "Modular Code: Functions and Returns",
              "subtitle": "Turing 🤖 shows how functions turn spaghetti code into clean architecture",
              "characterId": "turing",
              "steps": [
                {
                  "characterId": "turing",
                  "characterMood": "teaching",
                  "speech": "A function is a mini-machine inside your program!\n\nIt takes inputs (parameters), does some work, and gives back a result (return value). Every function in C declares what type it returns, such as int, float, or void (if returning nothing).",
                  "codeSnippet": "int add(int a, int b) {\n    return a + b;\n}\n\nint main(void) {\n    int sum = add(10, 20); // sum is 30\n    return 0;\n}"
                }
              ]
            },
            "questions": [
              {
                "id": "c-2-2-1",
                "type": "tap-to-fill",
                "prompt": "Complete the add function returning the sum of two integers:",
                "explanation": "The return statement sends the calculated value back to the caller.",
                "xpReward": 10,
                "codeTemplate": "int add(int a, int b) {\n    {{blank1}} a {{blank2}} b;\n}",
                "options": [
                  "return",
                  "+",
                  "int",
                  "-",
                  "printf"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "return"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "+"
                  }
                ]
              },
              {
                "id": "c-2-2-2",
                "type": "predict-output",
                "prompt": "What does this multiply function print?",
                "explanation": "multiply(4, 5) calculates 4 * 5 = 20 and returns it to printf.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint multiply(int x, int y) {\n    return x * y;\n}\nint main(void) {\n    printf(\"%d\", multiply(4, 5));\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "20",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "9",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "45",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-2-2-3",
                "type": "spot-the-bug",
                "prompt": "Spot the missing return statement bug in this non-void function:",
                "explanation": "A function declared with return type int MUST return an integer value!",
                "xpReward": 15,
                "codeLines": [
                  "int square(int n) {",
                  "    int ans = n * n;",
                  "    // Bug: forgot return ans!",
                  "}"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "Non-void function square() is missing its return statement!"
              },
              {
                "id": "c-func-4",
                "type": "concept-match",
                "prompt": "Match function terminology with its role:",
                "explanation": "Return type declares what comes out, parameters receive inputs, arguments are passed by caller, and void means no return.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "fn1",
                    "term": "Return Type",
                    "definition": "Type of value function produces (int, float, void)"
                  },
                  {
                    "id": "fn2",
                    "term": "Parameters",
                    "definition": "Placeholder variables declared in function definition"
                  },
                  {
                    "id": "fn3",
                    "term": "Arguments",
                    "definition": "Actual values passed into function when called"
                  },
                  {
                    "id": "fn4",
                    "term": "void",
                    "definition": "Specifies that a function returns no value"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u4-n2",
            "unitId": "c-u4",
            "title": "Void Functions & Variable Scope",
            "description": "Procedures with no return value and how variable lifetime is bounded by scope",
            "iconType": "terminal",
            "questions": [
              {
                "id": "c-scope-1",
                "type": "predict-output",
                "prompt": "What does this variable scope test print?",
                "explanation": "C passes variables by value: modify() changes its own local copy of num, leaving main's num unchanged at 10!",
                "xpReward": 15,
                "codeSnippet": "#include <stdio.h>\nvoid modify(int num) {\n    num = 99; // Only modifies local copy!\n}\nint main(void) {\n    int num = 10;\n    modify(num);\n    printf(\"%d\", num);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "10",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "99",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "0",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Compilation Error",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-scope-2",
                "type": "tap-to-fill",
                "prompt": "Declare a function greet that returns nothing (void):",
                "explanation": "void indicates the function performs an action but returns no value.",
                "xpReward": 10,
                "codeTemplate": "{{blank1}} greet(void) {\n    printf(\"Hello from C!\\n\");\n}",
                "options": [
                  "void",
                  "int",
                  "null",
                  "empty",
                  "char"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "void"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "c-u5",
        "courseId": "c",
        "unitNumber": 5,
        "title": "Unit 5: Arrays & Sequences",
        "description": "Store multiple elements in contiguous memory, iterate with loops, and handle C-strings",
        "color": "border-amber-600 bg-amber-600/10 text-amber-600 dark:text-amber-400",
        "bannerColor": "bg-gradient-to-r from-amber-700 to-orange-800",
        "nodes": [
          {
            "id": "c-u5-n1",
            "unitId": "c-u5",
            "title": "Arrays & Zero-Indexing",
            "description": "Contiguous memory sequences, zero-based indexing, and preventing out-of-bounds errors",
            "iconType": "code",
            "teachingIntro": {
              "title": "Arrays: School Lockers in Memory",
              "subtitle": "Lin 🕶️ & Bhai 🐈‍⬛ explain contiguous RAM storage",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "Need to store 100 test scores? You wouldn't want score1, score2... score100!\n\nAn array is a row of identical lockers placed side-by-side in RAM. In C, arrays always start at index 0! An array of size 5 has indices 0, 1, 2, 3, 4.",
                  "codeSnippet": "int scores[5] = {90, 85, 77, 95, 88};\nprintf(\"%d\", scores[0]); // 90 (first locker!)"
                }
              ]
            },
            "questions": [
              {
                "id": "c-3-1-1",
                "type": "tap-to-fill",
                "prompt": "Declare an array of 5 integers and initialize the first element:",
                "explanation": "In C, int arr[5] reserves 5 contiguous integers in memory, indexed 0 through 4.",
                "xpReward": 10,
                "codeTemplate": "int scores[{{blank1}}] = {10, 20, 30, 40, 50};\nscores[0] = {{blank2}};",
                "options": [
                  "5",
                  "99",
                  "4",
                  "10",
                  "size"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "5"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "99"
                  }
                ]
              },
              {
                "id": "c-3-1-2",
                "type": "predict-output",
                "prompt": "What does this array index access output?",
                "explanation": "Index 2 corresponds to the 3rd element: 30.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int nums[4] = {10, 20, 30, 40};\n    printf(\"%d\", nums[2]);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "30",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "20",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "40",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "10",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-3-1-3",
                "type": "spot-the-bug",
                "prompt": "Spot the dangerous out-of-bounds array access on line 4:",
                "explanation": "An array of size 3 only has valid indices 0, 1, 2. Accessing nums[3] reads illegal memory out-of-bounds!",
                "xpReward": 15,
                "codeLines": [
                  "int nums[3] = {10, 20, 30};",
                  "// Valid: nums[0], nums[1], nums[2]",
                  "// Bug on line 4: index 3 is out of bounds!",
                  "printf(\"%d\", nums[3]);"
                ],
                "bugLineIndex": 3,
                "bugExplanation": "Array size is 3 (indices 0..2). nums[3] is an illegal out-of-bounds access!"
              },
              {
                "id": "c-arr-4",
                "type": "concept-match",
                "prompt": "Match array concepts with their behaviors:",
                "explanation": "Index 0 is first, size - 1 is last, contiguous means side-by-side in RAM, out-of-bounds is undefined behavior.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "ar1",
                    "term": "Zero-indexing",
                    "definition": "First element lives at index 0, last at size - 1"
                  },
                  {
                    "id": "ar2",
                    "term": "Contiguous Memory",
                    "definition": "Elements stored consecutively with no gaps in RAM"
                  },
                  {
                    "id": "ar3",
                    "term": "Out-of-bounds",
                    "definition": "Accessing invalid index outside array bounds causing UB"
                  },
                  {
                    "id": "ar4",
                    "term": "sizeof(arr)",
                    "definition": "Returns total byte size of whole array in memory"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u5-n2",
            "unitId": "c-u5",
            "title": "Iterating Arrays & C-Strings",
            "description": "Loop over arrays and discover that C-strings are null-terminated char arrays",
            "iconType": "terminal",
            "teachingIntro": {
              "title": "C-Strings: Char Arrays Ending in \\0",
              "subtitle": "Ada 👧 reveals how C represents text",
              "characterId": "ada",
              "steps": [
                {
                  "characterId": "ada",
                  "characterMood": "teaching",
                  "speech": "Did you know C doesn't have a built-in 'string' keyword? In C, a string is simply an array of char characters ending with a special null-terminator: '\\0' (byte value 0)!\n\nThe '\\0' tells printf when the word ends!",
                  "codeSnippet": "char name[] = \"Ada\"; // In RAM: 'A', 'd', 'a', '\\0' (4 bytes!)\nprintf(\"%s\", name);"
                }
              ]
            },
            "questions": [
              {
                "id": "c-str-1",
                "type": "predict-output",
                "prompt": "What is the sum printed by this array iteration loop?",
                "explanation": "The loop adds 5 + 10 + 15 = 30.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int arr[3] = {5, 10, 15};\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        total += arr[i];\n    }\n    printf(\"%d\", total);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "30",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "15",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "0",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "60",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-str-2",
                "type": "tap-to-fill",
                "prompt": "Complete the null-terminator character that marks the end of a C-string:",
                "explanation": "All C strings must terminate with the null character '\\0'.",
                "xpReward": 10,
                "codeTemplate": "char word[4] = {'C', 'a', 't', {{blank1}}};",
                "options": [
                  "'\\0'",
                  "'\\n'",
                  "0",
                  "'EOF'",
                  "NULL"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "'\\0'"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "c-u6",
        "courseId": "c",
        "unitNumber": 6,
        "title": "Unit 6: Pointers & Direct Memory",
        "description": "Demystify RAM memory addresses, pointer dereferencing (*), and pass-by-reference",
        "color": "border-rose-600 bg-rose-600/10 text-rose-600 dark:text-rose-400",
        "bannerColor": "bg-gradient-to-r from-rose-700 to-red-900",
        "nodes": [
          {
            "id": "c-u6-n1",
            "unitId": "c-u6",
            "title": "Memory Addresses & The & Operator",
            "description": "See physical RAM addresses with %p and connect the dots to why scanf needed &",
            "iconType": "terminal",
            "teachingIntro": {
              "title": "Memory Addresses: The Physical RAM",
              "subtitle": "Lin 🕶️ connects the dots: why scanf used & all along!",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "Now that you master variables, loops, and functions, it's time for C's greatest superpower: Direct Memory Access! 🕶️\n\nRemember when we used & in scanf(\"%d\", &age)? Now you know why: in RAM, every variable lives at a hexadecimal address (like 0x7ffd9c). The & operator is the address-of operator!",
                  "codeSnippet": "int num = 42;\nprintf(\"Value: %d\\n\", num);       // 42\nprintf(\"Address: %p\\n\", (void*)&num); // e.g. 0x7ffd5e20"
                }
              ]
            },
            "questions": [
              {
                "id": "c-addr-1",
                "type": "predict-output",
                "prompt": "What does printing num (without &) display compared to &num?",
                "explanation": "num displays the stored value (100), while &num displays its hexadecimal memory address.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int num = 100;\n    printf(\"%d\", num);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "100",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Memory Address",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "0",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Error",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-addr-2",
                "type": "tap-to-fill",
                "prompt": "Fill in the format specifier and address operator to print variable x address:",
                "explanation": "%p is the format specifier for pointer/memory addresses, and & gets the address.",
                "xpReward": 10,
                "codeTemplate": "int x = 50;\nprintf(\"Address: %{{blank1}}\\n\", {{blank2}}x);",
                "options": [
                  "p",
                  "&",
                  "d",
                  "*",
                  "x"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "p"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "&"
                  }
                ]
              },
              {
                "id": "c-addr-3",
                "type": "concept-match",
                "prompt": "Match memory addressing concepts:",
                "explanation": "& gets address, %p prints address, RAM is physical memory cells, and variable holds data.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "ad1",
                    "term": "&val",
                    "definition": "Address-of operator: returns memory address of val"
                  },
                  {
                    "id": "ad2",
                    "term": "%p",
                    "definition": "Format specifier for hexadecimal memory addresses"
                  },
                  {
                    "id": "ad3",
                    "term": "Hexadecimal (0x...)",
                    "definition": "Base-16 notation used to represent memory addresses"
                  },
                  {
                    "id": "ad4",
                    "term": "val",
                    "definition": "The actual value stored inside the memory box"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u6-n2",
            "unitId": "c-u6",
            "title": "Pointers & Dereferencing (*)",
            "description": "Store addresses in pointer variables and mutate memory with *ptr",
            "iconType": "code",
            "teachingIntro": {
              "title": "Pointers: Variables that Hold Addresses",
              "subtitle": "Lin 🕶️ & Turing 🤖 reveal how *ptr reads and updates values",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "A Pointer is simply a variable that stores another variable's memory address!\n\n• int* ptr = &val;  -> ptr holds the address of val.\n• *ptr = 99;         -> The asterisk (*) dereferences the pointer: it travels to that address and writes 99 into val!",
                  "codeSnippet": "int val = 10;\nint* ptr = &val; // ptr points to val\n*ptr = 99;      // val is now 99!\nprintf(\"%d\", val); // prints 99"
                }
              ]
            },
            "questions": [
              {
                "id": "c-3-2-1",
                "type": "tap-to-fill",
                "prompt": "Declare a pointer ptr pointing to count, and update count to 88 via dereference:",
                "explanation": "int* ptr = &count sets the pointer to count address, and *ptr = 88 mutates count.",
                "xpReward": 10,
                "codeTemplate": "int count = 10;\nint* ptr = {{blank1}}count;\n{{blank2}}ptr = 88;",
                "options": [
                  "&",
                  "*",
                  "int",
                  "ptr",
                  "count"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "&"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "*"
                  }
                ]
              },
              {
                "id": "c-3-2-2",
                "type": "predict-output",
                "prompt": "What does this pointer modification print?",
                "explanation": "*p = 50 modifies the memory location where num lives, so num becomes 50.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int num = 10;\n    int* p = &num;\n    *p = 50;\n    printf(\"%d\", num);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "50",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "10",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Address of num",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-3-2-3",
                "type": "spot-the-bug",
                "prompt": "Spot the dangerous NULL pointer dereference bug on line 3:",
                "explanation": "Dereferencing a NULL or uninitialized pointer (*ptr) causes a Segmentation Fault and crashes instantly!",
                "xpReward": 15,
                "codeLines": [
                  "int* ptr = NULL;",
                  "// Bug on line 3: dereferencing NULL!",
                  "*ptr = 42; // CRASH! Segmentation Fault"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "Dereferencing NULL pointer crashes with Segmentation Fault!"
              },
              {
                "id": "c-ptr-4",
                "type": "concept-match",
                "prompt": "Match pointer symbols with their operations:",
                "explanation": "int* declares pointer, & gets address, *ptr dereferences, and NULL is empty pointer.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "pt1",
                    "term": "int* p",
                    "definition": "Declares variable p as a pointer to an integer"
                  },
                  {
                    "id": "pt2",
                    "term": "&variable",
                    "definition": "Retrieves the memory address of variable"
                  },
                  {
                    "id": "pt3",
                    "term": "*p",
                    "definition": "Dereferences p to read or write value at stored address"
                  },
                  {
                    "id": "pt4",
                    "term": "NULL",
                    "definition": "Special pointer value (0) pointing to no memory"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u6-n3",
            "unitId": "c-u6",
            "title": "Pass-by-Pointer (Mutating Function Arguments)",
            "description": "How pointers allow helper functions to modify variables in caller scope",
            "iconType": "star",
            "teachingIntro": {
              "title": "The Swap Problem: Why Functions Need Pointers",
              "subtitle": "Ada 👧 & Lin 🕶️ show how pointers solve the scope limitation",
              "characterId": "ada",
              "steps": [
                {
                  "characterId": "ada",
                  "characterMood": "teaching",
                  "speech": "In Unit 4, we saw that regular functions receive a copy of variables, so they cannot modify caller variables. But with pointers, functions can mutate anything!\n\nBy passing &x (the address), the function can dereference *ptr to directly swap or modify your original variables!",
                  "codeSnippet": "void swap(int* a, int* b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n// in main: swap(&x, &y);"
                }
              ]
            },
            "questions": [
              {
                "id": "c-swap-1",
                "type": "predict-output",
                "prompt": "What does this swap function print?",
                "explanation": "swap(&x, &y) modifies x and y in-place using their memory addresses, swapping them to x=2, y=1.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nvoid swap(int* a, int* b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\nint main(void) {\n    int x = 1, y = 2;\n    swap(&x, &y);\n    printf(\"%d %d\", x, y);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "2 1",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "1 2",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "1 1",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "2 2",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-swap-2",
                "type": "tap-to-fill",
                "prompt": "Complete the doubleValue function that doubles an integer through its pointer:",
                "explanation": "*p dereferences the pointer to read and update the original integer.",
                "xpReward": 10,
                "codeTemplate": "void doubleValue(int* p) {\n    {{blank1}}p = {{blank2}}p * 2;\n}",
                "options": [
                  "*",
                  "&",
                  "int",
                  "p",
                  "void"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "*"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "*"
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u6-n4",
            "unitId": "c-u6",
            "title": "Array-Pointer Duality",
            "description": "Discover how array names decay into pointers and how pointer arithmetic works",
            "iconType": "zap",
            "questions": [
              {
                "id": "c-arrptr-1",
                "type": "predict-output",
                "prompt": "What does this pointer arithmetic output?",
                "explanation": "arr decays to a pointer to arr[0]. *(arr + 1) accesses arr[1], which is 20.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nint main(void) {\n    int arr[] = {10, 20, 30};\n    printf(\"%d\", *(arr + 1));\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "20",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "11",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "10",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "30",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-arrptr-2",
                "type": "tap-to-fill",
                "prompt": "Access the 3rd element of array arr using pointer arithmetic:",
                "explanation": "Index 2 is accessed by *(arr + 2).",
                "xpReward": 10,
                "codeTemplate": "int arr[4] = {5, 10, 15, 20};\nint val = *({{blank1}} + {{blank2}});",
                "options": [
                  "arr",
                  "2",
                  "3",
                  "&arr",
                  "1"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "arr"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "2"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "c-u7",
        "courseId": "c",
        "unitNumber": 7,
        "title": "Unit 7: Dynamic Memory & Structs",
        "description": "Allocate heap memory with malloc/free, build custom structures, and achieve systems mastery",
        "color": "border-purple-600 bg-purple-600/10 text-purple-600 dark:text-purple-400",
        "bannerColor": "bg-gradient-to-r from-purple-800 to-slate-900",
        "nodes": [
          {
            "id": "c-u7-n1",
            "unitId": "c-u7",
            "title": "Dynamic Heap Memory: malloc() & free()",
            "description": "Allocate heap memory and prevent memory leaks in C",
            "iconType": "terminal",
            "teachingIntro": {
              "title": "Dynamic Heap Memory in C",
              "subtitle": "Turing 🤖 shows how malloc allocates bytes",
              "characterId": "turing",
              "steps": [
                {
                  "characterId": "turing",
                  "characterMood": "teaching",
                  "speech": "In C, when you don't know array size at compile time, you use malloc(bytes) from <stdlib.h>.\n\nAlways multiply by sizeof(type). And rule #1 of C: for every malloc(), there MUST be a matching free(), or you leak memory!",
                  "codeSnippet": "int* buffer = (int*)malloc(100 * sizeof(int));\n// use buffer...\nfree(buffer);"
                }
              ]
            },
            "questions": [
              {
                "id": "c-7-1-1",
                "type": "tap-to-fill",
                "prompt": "Allocate an array of 10 integers on the heap and release it:",
                "explanation": "malloc() allocates raw bytes from <stdlib.h> and free() deallocates.",
                "xpReward": 15,
                "mentorTip": "malloc allocates heap bytes, and free releases them!",
                "codeTemplate": "#include <stdlib.h>\nint* data = (int*){{blank1}}(10 * sizeof(int));\n// work with data...\n{{blank2}}(data);",
                "options": [
                  "malloc",
                  "free",
                  "new",
                  "delete",
                  "calloc"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "malloc"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "free"
                  }
                ]
              },
              {
                "id": "c-7-1-2",
                "type": "concept-match",
                "prompt": "Match C memory allocation concepts:",
                "explanation": "malloc allocates uninitialized bytes, calloc zeroes memory, realloc resizes, free deallocates.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "cm_m1",
                    "term": "malloc(size)",
                    "definition": "Allocates uninitialized bytes on the heap"
                  },
                  {
                    "id": "cm_m2",
                    "term": "free(ptr)",
                    "definition": "Deallocates heap memory to prevent memory leaks"
                  },
                  {
                    "id": "cm_m3",
                    "term": "NULL",
                    "definition": "Returned by malloc if system runs out of memory"
                  },
                  {
                    "id": "cm_m4",
                    "term": "sizeof(type)",
                    "definition": "Determines exact byte size of a type on current architecture"
                  }
                ]
              },
              {
                "id": "c-mal-3",
                "type": "spot-the-bug",
                "prompt": "Spot the memory leak bug inside this loop:",
                "explanation": "buffer is allocated with malloc on every iteration but free(buffer) is never called, causing a memory leak!",
                "xpReward": 15,
                "codeLines": [
                  "for (int i = 0; i < 100; i++) {",
                  "    int* buffer = (int*)malloc(50 * sizeof(int));",
                  "    // Bug: forgot free(buffer) before next iteration!",
                  "}"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "malloc memory is never released with free(buffer), leaking memory on every loop cycle!"
              }
            ]
          },
          {
            "id": "c-u7-n2",
            "unitId": "c-u7",
            "title": "Structures (struct) in C",
            "description": "Bundle related variables into custom composite data types",
            "iconType": "code",
            "teachingIntro": {
              "title": "Custom Types: struct in C",
              "subtitle": "Junior 🧢 & Ada 👧 create composite records",
              "characterId": "junior",
              "steps": [
                {
                  "characterId": "junior",
                  "characterMood": "teaching",
                  "speech": "What if you want to represent a Player with a name, score, and level? Using separate variables is messy!\n\nA struct lets you group related variables under one custom type name. Use the dot (.) operator to access fields: player.score = 100!",
                  "codeSnippet": "struct Player {\n    char name[20];\n    int score;\n};\n\nstruct Player p1;\np1.score = 100;"
                }
              ]
            },
            "questions": [
              {
                "id": "c-struct-1",
                "type": "tap-to-fill",
                "prompt": "Define a struct Point with x and y coordinates and initialize p.x:",
                "explanation": "struct groups variables, and dot (.) accesses members.",
                "xpReward": 10,
                "codeTemplate": "struct Point {\n    int x;\n    int y;\n};\nstruct Point p;\np.{{blank1}} = 10;\np.{{blank2}} = 20;",
                "options": [
                  "x",
                  "y",
                  "Point",
                  "int",
                  "val"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "x"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "y"
                  }
                ]
              },
              {
                "id": "c-struct-2",
                "type": "predict-output",
                "prompt": "What does this struct access print?",
                "explanation": "b.pages is initialized to 320 and printed with %d.",
                "xpReward": 10,
                "codeSnippet": "#include <stdio.h>\nstruct Book {\n    int pages;\n};\nint main(void) {\n    struct Book b = {320};\n    printf(\"%d\", b.pages);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "320",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Book",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "pages",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "c-u7-n3",
            "unitId": "c-u7",
            "title": "Unit 7 Checkpoint: Systems Mastery",
            "description": "Capstone challenge synthesizing dynamic allocation, pointers, and structs",
            "iconType": "trophy",
            "questions": [
              {
                "id": "c-sys-1",
                "type": "predict-output",
                "prompt": "What does the arrow operator (->) on a struct pointer access?",
                "explanation": "ptr->score is shorthand for (*ptr).score, which accesses the member of the pointed-to struct (99).",
                "xpReward": 15,
                "codeSnippet": "#include <stdio.h>\nstruct Player {\n    int score;\n};\nint main(void) {\n    struct Player p = {99};\n    struct Player* ptr = &p;\n    printf(\"%d\", ptr->score);\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "99",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Address of p",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "score",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Error",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "c-sys-2",
                "type": "tap-to-fill",
                "prompt": "Access member score through pointer ptr using the arrow operator:",
                "explanation": "ptr->score accesses the member through a pointer.",
                "xpReward": 15,
                "codeTemplate": "struct Player p = {50};\nstruct Player* ptr = &p;\nptr{{blank1}}score = 100;",
                "options": [
                  "->",
                  ".",
                  "::",
                  "=>",
                  "*"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "->"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "cpp": {
    "id": "cpp",
    "title": "C++",
    "shortTitle": "Modern C++",
    "tagline": "Master modern C++, std::cout, classes, references, STL & templates",
    "badge": "⚡ Modern C++",
    "icon": "Cpu",
    "color": "from-blue-600 to-indigo-700",
    "placementQuestions": [
      {
        "id": "cpp-place-1",
        "type": "predict-output",
        "prompt": "What does this C++ snippet output?",
        "explanation": "std::cout prints \"42\" to the terminal, and std::endl flushes the buffer and moves to the next line.",
        "xpReward": 10,
        "difficulty": "beginner",
        "codeSnippet": "#include <iostream>\nint main() {\n    int x = 42;\n    std::cout << x << std::endl;\n    return 0;\n}",
        "options": [
          {
            "id": "1",
            "text": "42",
            "isCorrect": true
          },
          {
            "id": "2",
            "text": "x",
            "isCorrect": false
          },
          {
            "id": "3",
            "text": "0",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "endl",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "cpp-place-2",
        "type": "spot-the-bug",
        "prompt": "Identify the line containing a syntax error with std::cin:",
        "explanation": "Line 3 uses the insertion operator (<<) with std::cin instead of the extraction operator (>>).",
        "xpReward": 15,
        "difficulty": "beginner",
        "codeLines": [
          "int age;",
          "std::cout << \"Enter age: \";",
          "std::cin << age; // Bug here!",
          "std::cout << age;"
        ],
        "bugLineIndex": 2,
        "bugExplanation": "std::cin requires extraction operator (>>) pointing towards the variable, not (<<)!"
      },
      {
        "id": "cpp-place-3",
        "type": "concept-match",
        "prompt": "Match modern C++ features with their purpose:",
        "explanation": "vector dynamically resizes, auto infers types, unique_ptr manages dynamic lifetime, and reference avoids copying.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "pairs": [
          {
            "id": "cp_cpp1",
            "term": "std::vector<T>",
            "definition": "Dynamic array that automatically resizes as elements are added"
          },
          {
            "id": "cp_cpp2",
            "term": "auto keyword",
            "definition": "Deduces variable type automatically from initializer"
          },
          {
            "id": "cp_cpp3",
            "term": "std::unique_ptr<T>",
            "definition": "Smart pointer automatically freeing heap memory on scope exit"
          },
          {
            "id": "cp_cpp4",
            "term": "int& ref",
            "definition": "Reference alias that avoids copying data when passed to functions"
          }
        ]
      },
      {
        "id": "cpp-place-4",
        "type": "tap-to-fill",
        "prompt": "Allocate dynamic memory on the heap and safely delete it in C++:",
        "explanation": "In C++, new allocates heap memory and delete frees it.",
        "xpReward": 15,
        "difficulty": "advanced",
        "codeTemplate": "int* ptr = {{blank1}} int(100);\n// do work...\n{{blank2}} ptr;",
        "options": [
          "new",
          "delete",
          "malloc",
          "free",
          "alloc"
        ],
        "blanks": [
          {
            "id": "blank1",
            "correctValue": "new"
          },
          {
            "id": "blank2",
            "correctValue": "delete"
          }
        ]
      },
      {
        "id": "cpp-place-5",
        "type": "predict-output",
        "prompt": "What does this pointer arithmetic output?",
        "explanation": "arr is an array. *(ptr + 2) is equivalent to arr[2], which is 30.",
        "xpReward": 20,
        "difficulty": "advanced",
        "codeSnippet": "int arr[] = {10, 20, 30, 40};\nint* ptr = arr;\nstd::cout << *(ptr + 2);",
        "options": [
          {
            "id": "1",
            "text": "20",
            "isCorrect": false
          },
          {
            "id": "2",
            "text": "30",
            "isCorrect": true
          },
          {
            "id": "3",
            "text": "12 (Memory address)",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "40",
            "isCorrect": false
          }
        ]
      }
    ],
    "units": [
      {
        "id": "cpp-u1",
        "courseId": "cpp",
        "unitNumber": 1,
        "title": "Unit 1: The Modern C++ Launchpad",
        "description": "Learn std::cout, variables, user input with cin, and type safety with Bhai 🐈‍⬛",
        "color": "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400",
        "bannerColor": "bg-gradient-to-r from-blue-600 to-indigo-600",
        "nodes": [
          {
            "id": "cpp-u1-n1",
            "unitId": "cpp-u1",
            "title": "Your First Code & std::cout",
            "description": "Learn what std::cout, <<, and semicolons mean with Bhai the Black Cat",
            "iconType": "terminal",
            "teachingIntro": {
              "title": "Your Very First Line of Code: std::cout",
              "subtitle": "Meet Bhai 🐈‍⬛ and write your first message to the computer",
              "characterId": "byte",
              "steps": [
                {
                  "characterId": "byte",
                  "characterMood": "teaching",
                  "speech": "Hey coder! 🐈‍⬛ I'm Nyan, your black cat coding companion. Welcome to C++!\n\nBefore we quiz you on anything, let's learn how to actually make the computer talk to the screen. In C++, we do this using a command called std::cout (pronounced 'see-out')!",
                  "codeSnippet": "std::cout << \"Hello, World!\" << std::endl;"
                },
                {
                  "characterId": "byte",
                  "characterMood": "happy",
                  "speech": "Let's break down this famous line piece-by-piece so you never get confused:",
                  "anatomy": [
                    {
                      "token": "std::",
                      "explanation": "Standard namespace. Tells C++ to use the standard library tools."
                    },
                    {
                      "token": "cout",
                      "explanation": "Stands for Character Output (pronounced \"see-out\"). Sends text to your terminal."
                    },
                    {
                      "token": "<<",
                      "explanation": "Stream Insertion operator. Think of it like arrows pushing your text into the screen!"
                    },
                    {
                      "token": "\"Hello, World!\"",
                      "explanation": "A string literal. The exact text message wrapped in double quotes."
                    },
                    {
                      "token": "std::endl",
                      "explanation": "End Line. Hits \"Enter\" on the terminal to start the next line."
                    },
                    {
                      "token": ";",
                      "explanation": "The semicolon! In C++, every command sentence MUST end with a semicolon."
                    }
                  ]
                },
                {
                  "characterId": "junior",
                  "characterMood": "thinking",
                  "speech": "Wait Nyan! 🧢 Why are the arrows pointing to the left (<<) instead of to the right?",
                  "anatomy": [
                    {
                      "token": "std::cout << \"Data\"",
                      "explanation": "Arrows point LEFT because data flows from right into the cout screen!"
                    },
                    {
                      "token": "std::cin >> variable",
                      "explanation": "For input, arrows point RIGHT because data flows from keyboard into variable."
                    }
                  ],
                  "interactiveTry": {
                    "prompt": "Assemble your first line to print Hello World!",
                    "tokens": [
                      "std::cout",
                      "<<",
                      "\"Hello World!\"",
                      "<<",
                      "std::endl;",
                      ">>"
                    ],
                    "targetOrder": [
                      "std::cout",
                      "<<",
                      "\"Hello World!\"",
                      "<<",
                      "std::endl;"
                    ],
                    "previewOutput": "Hello World!\n"
                  }
                },
                {
                  "characterId": "byte",
                  "characterMood": "cheering",
                  "speech": "Brilliant! 🎉 You just wrote your first real line of C++!\n\nEvery C++ program wraps this inside #include <iostream> (the input/output library) and int main() { ... } (the starting door of your program).\n\nNow, test your intuition with the micro-challenges below!"
                }
              ]
            },
            "questions": [
              {
                "id": "cpp-1-1-1",
                "type": "tap-to-fill",
                "prompt": "Complete your first C++ program to print \"Hello, World!\":",
                "explanation": "In C++, std::cout sends output to the terminal, and << inserts data into the stream.",
                "xpReward": 10,
                "mentorTip": "Remember: \"cout\" means character output, and arrows << funnel your words into it!",
                "codeTemplate": "#include <iostream>\nint main() {\n    std::{{blank1}} << \"Hello, World!\" {{blank2}} std::endl;\n    return 0;\n}",
                "options": [
                  "cout",
                  "<<",
                  ">>",
                  "print",
                  "cin"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "cout"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "<<"
                  }
                ]
              },
              {
                "id": "cpp-1-1-2",
                "type": "predict-output",
                "prompt": "What will this C++ program print to the terminal?",
                "explanation": "Chaining << outputs each text piece consecutively without spaces unless added inside quotes: \"Code\" + \"Lingo\" = \"CodeLingo\".",
                "xpReward": 10,
                "mentorTip": "C++ prints pieces side by side without extra spaces unless you add quotes like \" \"!",
                "codeSnippet": "#include <iostream>\nint main() {\n    std::cout << \"Code\" << \"Lingo\";\n    return 0;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "CodeLingo",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Code Lingo",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Code\\nLingo",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Error",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-1-1-3",
                "type": "spot-the-bug",
                "prompt": "Find the missing semicolon on line 4 that stops the code from compiling:",
                "explanation": "Line 4 is missing a terminating semicolon (;). In C++, every single statement must end with a semicolon or the compiler refuses to build!",
                "xpReward": 15,
                "codeLines": [
                  "#include <iostream>",
                  "int main() {",
                  "    std::cout << \"Starting ByteSized!\" << std::endl;",
                  "    std::cout << \"Ready to learn\" // Missing semicolon!",
                  "    return 0;",
                  "}"
                ],
                "bugLineIndex": 3,
                "bugExplanation": "Missing semicolon (;) at the end of the output statement on line 4!"
              },
              {
                "id": "cpp-1-1-4",
                "type": "concept-match",
                "prompt": "Connect the C++ building blocks with their everyday real-world meaning:",
                "explanation": "std::cout acts like a megaphone, << is the funnel, std::endl hits enter, and semicolons are periods.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "p1",
                    "term": "std::cout",
                    "definition": "The terminal screen (Character Output)"
                  },
                  {
                    "id": "p2",
                    "term": "<<",
                    "definition": "Insertion arrows funneling data to the screen"
                  },
                  {
                    "id": "p3",
                    "term": "std::endl",
                    "definition": "Hits \"Enter\" and flushes line buffer"
                  },
                  {
                    "id": "p4",
                    "term": ";",
                    "definition": "Period ending a code sentence"
                  }
                ]
              }
            ]
          },
          {
            "id": "cpp-u1-n2",
            "unitId": "cpp-u1",
            "title": "Variables & Data Storage",
            "description": "Learn how int, double, and std::string store info in memory",
            "iconType": "code",
            "teachingIntro": {
              "title": "Variables: The Memory Boxes",
              "subtitle": "Ada 👧 shows you how computers remember things",
              "characterId": "ada",
              "steps": [
                {
                  "characterId": "ada",
                  "characterMood": "teaching",
                  "speech": "Hi! I'm Ada 👧. A computer without memory would forget everything instantly!\n\nIn C++, variables are like labeled boxes where we put numbers, words, and scores. But C++ is strongly typed: you must declare what kind of data fits inside the box!",
                  "codeSnippet": "int score = 100;\ndouble price = 19.99;\nstd::string name = \"Ada\";"
                },
                {
                  "characterId": "ada",
                  "characterMood": "happy",
                  "speech": "Here are the 4 basic types you will use every single day:",
                  "anatomy": [
                    {
                      "token": "int",
                      "explanation": "Whole numbers (e.g., 42, -5, 0). 4 bytes."
                    },
                    {
                      "token": "double",
                      "explanation": "Floating-point decimals (e.g., 3.14159, 0.99). 8 bytes."
                    },
                    {
                      "token": "char",
                      "explanation": "Single character enclosed in single quotes (e.g., 'A', 'z')."
                    },
                    {
                      "token": "std::string",
                      "explanation": "Text strings enclosed in double quotes (e.g., \"CodeLingo\")."
                    }
                  ]
                }
              ]
            },
            "questions": [
              {
                "id": "cpp-1-2-1",
                "type": "tap-to-fill",
                "prompt": "Declare an integer score of 95 and a player name \"Alex\":",
                "explanation": "int holds whole numbers, and std::string holds text.",
                "xpReward": 10,
                "mentorTip": "Use int for whole numbers and string for words!",
                "codeTemplate": "{{blank1}} score = 95;\nstd::{{blank2}} player = \"Alex\";",
                "options": [
                  "int",
                  "string",
                  "float",
                  "char",
                  "bool"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "int"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "string"
                  }
                ]
              },
              {
                "id": "cpp-1-2-2",
                "type": "predict-output",
                "prompt": "What does this variable reassignment print?",
                "explanation": "The variable \"lives\" starts at 3, and lives = lives - 1 updates it to 2.",
                "xpReward": 10,
                "codeSnippet": "int lives = 3;\nlives = lives - 1;\nstd::cout << lives;",
                "options": [
                  {
                    "id": "1",
                    "text": "2",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "3",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "1",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "lives - 1",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-1-2-3",
                "type": "spot-the-bug",
                "prompt": "Spot the type mismatch bug on line 2:",
                "explanation": "Line 2 tries to assign a string \"Forty\" to an int variable, which fails compilation in C++.",
                "xpReward": 15,
                "codeLines": [
                  "int points = 10;",
                  "points = \"Forty\"; // Cannot store text in int box!",
                  "std::cout << points;",
                  "return 0;"
                ],
                "bugLineIndex": 1,
                "bugExplanation": "C++ is strongly typed: you cannot assign a string literal to an integer variable!"
              },
              {
                "id": "cpp-1-2-4",
                "type": "concept-match",
                "prompt": "Match C++ data types with the values they can hold:",
                "explanation": "int stores whole numbers, double stores decimals, bool stores true/false, char stores a single letter.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "dt1",
                    "term": "int",
                    "definition": "Whole numbers (e.g. 100, -5)"
                  },
                  {
                    "id": "dt2",
                    "term": "double",
                    "definition": "Floating-point decimal numbers (e.g. 3.14)"
                  },
                  {
                    "id": "dt3",
                    "term": "bool",
                    "definition": "Boolean true or false"
                  },
                  {
                    "id": "dt4",
                    "term": "char",
                    "definition": "Single character in single quotes ('Z')"
                  }
                ]
              }
            ]
          },
          {
            "id": "cpp-u1-n3",
            "unitId": "cpp-u1",
            "title": "User Input with std::cin",
            "description": "Read data from the keyboard using the stream extraction operator (>>)",
            "iconType": "terminal",
            "teachingIntro": {
              "title": "Interactive Programs: std::cin",
              "subtitle": "Junior 🧢 & Ada 👧 explain how to read input",
              "characterId": "junior",
              "steps": [
                {
                  "characterId": "junior",
                  "characterMood": "teaching",
                  "speech": "Now that we know how to print, let's learn how to read what the user types! In C++, we use std::cin (Character Input).\n\nNotice the arrows point RIGHT (>>): std::cin >> age;\nThink of the arrows pushing data from the keyboard INTO your variable!",
                  "codeSnippet": "int age;\nstd::cout << \"Enter your age: \";\nstd::cin >> age;\nstd::cout << \"You are \" << age << \" years old!\";"
                }
              ]
            },
            "questions": [
              {
                "id": "cpp-cin-1",
                "type": "tap-to-fill",
                "prompt": "Read an integer into variable score from keyboard:",
                "explanation": "std::cin uses extraction operator (>>) pointing towards variable.",
                "xpReward": 10,
                "codeTemplate": "int score;\nstd::cin {{blank1}} {{blank2}};",
                "options": [
                  ">>",
                  "score",
                  "<<",
                  "cin",
                  "int"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": ">>"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "score"
                  }
                ]
              },
              {
                "id": "cpp-cin-2",
                "type": "spot-the-bug",
                "prompt": "Spot the incorrect extraction operator on line 3:",
                "explanation": "Line 3 accidentally used << with cin instead of >>.",
                "xpReward": 15,
                "codeLines": [
                  "int age;",
                  "std::cout << \"Enter age: \";",
                  "std::cin << age; // Bug here!",
                  "std::cout << age;"
                ],
                "bugLineIndex": 2,
                "bugExplanation": "std::cin requires >> operator, not <<!"
              }
            ]
          },
          {
            "id": "cpp-u1-n4",
            "unitId": "cpp-u1",
            "title": "Operators & Calculations",
            "description": "Math operations, string concatenation with +, and modulo",
            "iconType": "zap",
            "questions": [
              {
                "id": "cpp-calc-1",
                "type": "predict-output",
                "prompt": "What does this integer division in C++ print?",
                "explanation": "Integer division truncates fractional parts: 14 / 4 = 3.",
                "xpReward": 10,
                "codeSnippet": "int a = 14;\nint b = 4;\nstd::cout << a / b;",
                "options": [
                  {
                    "id": "1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "3.5",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "4",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Error",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-calc-2",
                "type": "tap-to-fill",
                "prompt": "Concatenate two C++ strings using the + operator:",
                "explanation": "std::string supports operator+ for concatenation.",
                "xpReward": 10,
                "codeTemplate": "std::string first = \"Hello \";\nstd::string second = \"World\";\nstd::string result = first {{blank1}} second;",
                "options": [
                  "+",
                  ".",
                  "&",
                  ",",
                  "concat"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "+"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cpp-u2",
        "courseId": "cpp",
        "unitNumber": 2,
        "title": "Unit 2: Decisions & Control Flow",
        "description": "Branch with if/else, repeat with for & while, and use modern range-based for loops",
        "color": "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400",
        "bannerColor": "bg-gradient-to-r from-teal-600 to-emerald-700",
        "nodes": [
          {
            "id": "cpp-u2-n1",
            "unitId": "cpp-u2",
            "title": "Conditionals: if, else if, else",
            "description": "Branch program flow and compare values with boolean logic",
            "iconType": "code",
            "questions": [
              {
                "id": "cpp-flow-1",
                "type": "predict-output",
                "prompt": "What does this C++ conditional statement print?",
                "explanation": "level 5 is not > 10, but 5 > 2 is true, so it prints \"Mid\".",
                "xpReward": 10,
                "codeSnippet": "int level = 5;\nif (level > 10) {\n    std::cout << \"High\";\n} else if (level > 2) {\n    std::cout << \"Mid\";\n} else {\n    std::cout << \"Low\";\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "Mid",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "High",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Low",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "HighMid",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-flow-2",
                "type": "tap-to-fill",
                "prompt": "Complete the condition to test if age is at least 18:",
                "explanation": ">= tests greater than or equal to.",
                "xpReward": 10,
                "codeTemplate": "int age = 20;\nif (age {{blank1}} 18) {\n    std::cout << \"Adult\";\n}",
                "options": [
                  ">=",
                  "==",
                  "<=",
                  "=",
                  "!="
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": ">="
                  }
                ]
              }
            ]
          },
          {
            "id": "cpp-u2-n2",
            "unitId": "cpp-u2",
            "title": "Loops: while & for",
            "description": "Repeat actions, count iterations, and accumulate sums in C++",
            "iconType": "zap",
            "questions": [
              {
                "id": "cpp-loop-1",
                "type": "predict-output",
                "prompt": "What does this for loop print?",
                "explanation": "Prints numbers 0, 1, 2.",
                "xpReward": 10,
                "codeSnippet": "for (int i = 0; i < 3; i++) {\n    std::cout << i;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "012",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "0123",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "123",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "3",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-loop-2",
                "type": "tap-to-fill",
                "prompt": "Fill in the while loop counter increment to avoid infinite loop:",
                "explanation": "count++ increments the counter towards terminating condition.",
                "xpReward": 10,
                "codeTemplate": "int count = 0;\nwhile (count < 5) {\n    {{blank1}};\n}",
                "options": [
                  "count++",
                  "count--",
                  "break",
                  "return",
                  "0"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "count++"
                  }
                ]
              }
            ]
          },
          {
            "id": "cpp-u2-n3",
            "unitId": "cpp-u2",
            "title": "Modern Range-Based For Loops",
            "description": "Iterate effortlessly over collections with for (auto x : container)",
            "iconType": "star",
            "questions": [
              {
                "id": "cpp-range-1",
                "type": "predict-output",
                "prompt": "What does this range-based for loop print?",
                "explanation": "Loop iterates over each element in array: 1, 2, 3.",
                "xpReward": 10,
                "codeSnippet": "int nums[] = {1, 2, 3};\nfor (int x : nums) {\n    std::cout << x;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "123",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "3",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "1",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "012",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-range-2",
                "type": "tap-to-fill",
                "prompt": "Use modern range-based loop with auto keyword:",
                "explanation": "for (auto x : collection) automatically deduces the element type.",
                "xpReward": 10,
                "codeTemplate": "int items[] = {10, 20};\nfor ({{blank1}} x {{blank2}} items) {\n    std::cout << x << \" \";\n}",
                "options": [
                  "auto",
                  ":",
                  "in",
                  "int",
                  "of"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "auto"
                  },
                  {
                    "id": "blank2",
                    "correctValue": ":"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cpp-u3",
        "courseId": "cpp",
        "unitNumber": 3,
        "title": "Unit 3: Functions & Modern References",
        "description": "Write modular functions and understand C++ references (&) before touching pointers",
        "color": "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        "bannerColor": "bg-gradient-to-r from-cyan-600 to-blue-700",
        "nodes": [
          {
            "id": "cpp-u3-n1",
            "unitId": "cpp-u3",
            "title": "Functions & Return Values",
            "description": "Modular code design with parameter signatures and return types",
            "iconType": "code",
            "questions": [
              {
                "id": "cpp-fn-1",
                "type": "tap-to-fill",
                "prompt": "Complete the square function returning the square of an integer:",
                "explanation": "Returns n * n of type int.",
                "xpReward": 10,
                "codeTemplate": "int square(int n) {\n    {{blank1}} n {{blank2}} n;\n}",
                "options": [
                  "return",
                  "*",
                  "+",
                  "int",
                  "cout"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "return"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "*"
                  }
                ]
              },
              {
                "id": "cpp-fn-2",
                "type": "predict-output",
                "prompt": "What does calling add(3, 7) output?",
                "explanation": "3 + 7 = 10.",
                "xpReward": 10,
                "codeSnippet": "int add(int a, int b) {\n    return a + b;\n}\nint main() {\n    std::cout << add(3, 7);\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "10",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "37",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "0",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Error",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "cpp-u3-n2",
            "unitId": "cpp-u3",
            "title": "Pass-by-Reference (&)",
            "description": "Avoid costly data copies and mutate caller state using clean C++ references",
            "iconType": "zap",
            "teachingIntro": {
              "title": "References: Aliases Without Pointers",
              "subtitle": "Ada 👧 explains why C++ added references",
              "characterId": "ada",
              "steps": [
                {
                  "characterId": "ada",
                  "characterMood": "teaching",
                  "speech": "In C, to modify a variable you had to deal with tricky pointer syntax (* and &). C++ introduced References: clean aliases for existing variables!\n\nWhen a function takes int& x, it doesn't make a copy: it works directly on the original variable!",
                  "codeSnippet": "void doubleIt(int& n) {\n    n = n * 2; // directly changes original!\n}\n// in main: doubleIt(score);"
                }
              ]
            },
            "questions": [
              {
                "id": "cpp-ref-1",
                "type": "predict-output",
                "prompt": "What does this pass-by-reference function output?",
                "explanation": "Because num is passed by reference (int&), changeNum() directly modifies the original variable to 99.",
                "xpReward": 15,
                "codeSnippet": "void changeNum(int& n) {\n    n = 99;\n}\nint main() {\n    int val = 10;\n    changeNum(val);\n    std::cout << val;\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "99",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "10",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "val",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-ref-2",
                "type": "tap-to-fill",
                "prompt": "Declare parameter as a reference to prevent copying:",
                "explanation": "Type& creates a reference parameter.",
                "xpReward": 10,
                "codeTemplate": "void reset(int{{blank1}} x) {\n    x = 0;\n}",
                "options": [
                  "&",
                  "*",
                  "%",
                  "ref",
                  "const"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "&"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cpp-u4",
        "courseId": "cpp",
        "unitNumber": 4,
        "title": "Unit 4: Modern STL Vectors",
        "description": "Dynamic resizing, push_back, pop_back, and vector iterators",
        "color": "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        "bannerColor": "bg-gradient-to-r from-indigo-600 to-purple-700",
        "nodes": [
          {
            "id": "cpp-u4-n1",
            "unitId": "cpp-u4",
            "title": "std::vector: Dynamic Arrays",
            "description": "Supercharged dynamic arrays with push_back and automatic memory cleanup",
            "iconType": "star",
            "teachingIntro": {
              "title": "Dynamic Vectors: The Supercharged Array",
              "subtitle": "Lin 🕶️ shows you modern STL power",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "Hey! 🕶️ I'm Lin. Forget fixed-size static arrays! In real-world C++, we use std::vector from the Standard Template Library (STL).\n\nVectors automatically grow when you add items with push_back(), and clean up their own memory when destroyed!",
                  "codeSnippet": "std::vector<int> nums = {10, 20};\nnums.push_back(30);\nstd::cout << nums.size(); // 3"
                }
              ]
            },
            "questions": [
              {
                "id": "cpp-1-3-1",
                "type": "predict-output",
                "prompt": "What does this vector snippet print?",
                "explanation": "nums starts with {10, 20}. push_back(30) adds 30. pop_back() removes 30. size() is 2.",
                "xpReward": 10,
                "codeSnippet": "std::vector<int> nums = {10, 20};\nnums.push_back(30);\nnums.pop_back();\nstd::cout << nums.size();",
                "options": [
                  {
                    "id": "1",
                    "text": "2",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "3",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "20",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "1",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-1-3-2",
                "type": "tap-to-fill",
                "prompt": "Add the number 99 to the end of a std::vector named scores:",
                "explanation": "push_back(element) appends to the end of the vector.",
                "xpReward": 10,
                "codeTemplate": "std::vector<int> scores;\nscores.{{blank1}}(99);",
                "options": [
                  "push_back",
                  "append",
                  "add",
                  "insert",
                  "pop"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "push_back"
                  }
                ]
              }
            ]
          },
          {
            "id": "cpp-u4-n2",
            "unitId": "cpp-u4",
            "title": "Vector Operations & Bounds",
            "description": "Access elements with at() vs [], check empty(), and clear()",
            "iconType": "code",
            "questions": [
              {
                "id": "cpp-vec-1",
                "type": "predict-output",
                "prompt": "What does accessing nums[1] print?",
                "explanation": "Index 1 is the 2nd element, which is 25.",
                "xpReward": 10,
                "codeSnippet": "std::vector<int> nums = {15, 25, 35};\nstd::cout << nums[1];",
                "options": [
                  {
                    "id": "1",
                    "text": "25",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "15",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "35",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "1",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cpp-u5",
        "courseId": "cpp",
        "unitNumber": 5,
        "title": "Unit 5: Memory Architecture & Pointers",
        "description": "Pointers, nullptr, new/delete, and Modern Smart Pointers (std::unique_ptr)",
        "color": "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400",
        "bannerColor": "bg-gradient-to-r from-rose-600 to-red-800",
        "nodes": [
          {
            "id": "cpp-u5-n1",
            "unitId": "cpp-u5",
            "title": "Pointers & Memory Addresses",
            "description": "Addresses (&), pointer declaration (*), dereferencing, and nullptr",
            "iconType": "terminal",
            "questions": [
              {
                "id": "cpp-ptr-1",
                "type": "predict-output",
                "prompt": "What does this pointer modification print?",
                "explanation": "*p = 80 writes 80 into the memory location of val, modifying val.",
                "xpReward": 10,
                "codeSnippet": "int val = 20;\nint* p = &val;\n*p = 80;\nstd::cout << val;",
                "options": [
                  {
                    "id": "1",
                    "text": "80",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "20",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Address",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "cpp-ptr-2",
                "type": "tap-to-fill",
                "prompt": "Initialize a pointer to the modern C++ null pointer literal:",
                "explanation": "nullptr is the type-safe modern C++ null pointer literal.",
                "xpReward": 10,
                "codeTemplate": "int* ptr = {{blank1}};",
                "options": [
                  "nullptr",
                  "NULL",
                  "0",
                  "nil",
                  "void"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "nullptr"
                  }
                ]
              }
            ]
          },
          {
            "id": "cpp-u5-n2",
            "unitId": "cpp-u5",
            "title": "Dynamic Allocation: new & delete",
            "description": "Heap vs Stack memory allocation and avoiding memory leaks",
            "iconType": "zap",
            "teachingIntro": {
              "title": "Heap vs Stack: Dynamic Memory",
              "subtitle": "Turing 🤖 reveals where memory lives",
              "characterId": "turing",
              "steps": [
                {
                  "characterId": "turing",
                  "characterMood": "teaching",
                  "speech": "Greetings! 🤖 I am Turing. In C++, memory is split into two worlds: the Stack (automatic, fast, temporary) and the Heap (spacious, manual, persistent).\n\nWhen you use 'new', you request bytes directly from the Heap. But remember: you MUST call 'delete' when you finish, or the bytes leak into cyberspace!",
                  "codeSnippet": "int* age = new int(21);\n// do work...\ndelete age;"
                }
              ]
            },
            "questions": [
              {
                "id": "cpp-5-2-1",
                "type": "tap-to-fill",
                "prompt": "Allocate an integer on the heap and safely release it:",
                "explanation": "In C++, new allocates heap memory and delete frees it to prevent memory leaks.",
                "xpReward": 10,
                "codeTemplate": "int* age = {{blank1}} int(21);\n// do work...\n{{blank2}} age;",
                "options": [
                  "new",
                  "delete",
                  "malloc",
                  "free",
                  "alloc"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "new"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "delete"
                  }
                ]
              },
              {
                "id": "cpp-5-2-2",
                "type": "spot-the-bug",
                "prompt": "Identify the Memory Leak in this loop:",
                "explanation": "Line 2 continuously allocates dynamic memory without ever freeing it, leaking memory each iteration.",
                "xpReward": 15,
                "codeLines": [
                  "for (int i = 0; i < 1000; i++) {",
                  "    int* buffer = new int[500];",
                  "    // no delete[] called!",
                  "}"
                ],
                "bugLineIndex": 1,
                "bugExplanation": "buffer is reallocated every iteration without delete[] buffer, causing a memory leak!"
              }
            ]
          },
          {
            "id": "cpp-u5-n3",
            "unitId": "cpp-u5",
            "title": "Smart Pointers & RAII (std::unique_ptr)",
            "description": "Modern zero-leak memory management using std::make_unique",
            "iconType": "star",
            "questions": [
              {
                "id": "cpp-smart-1",
                "type": "tap-to-fill",
                "prompt": "Create a modern memory-safe unique_ptr holding an integer 42:",
                "explanation": "std::make_unique<int>(42) allocates safely and deletes automatically when leaving scope.",
                "xpReward": 15,
                "codeTemplate": "std::{{blank1}}<int> ptr = std::{{blank2}}<int>(42);",
                "options": [
                  "unique_ptr",
                  "make_unique",
                  "shared_ptr",
                  "new",
                  "delete"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "unique_ptr"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "make_unique"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cpp-u6",
        "courseId": "cpp",
        "unitNumber": 6,
        "title": "Unit 6: Object-Oriented C++",
        "description": "Build robust classes, encapsulate state, and master constructors & destructors",
        "color": "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400",
        "bannerColor": "bg-gradient-to-r from-purple-600 to-indigo-800",
        "nodes": [
          {
            "id": "cpp-u6-n1",
            "unitId": "cpp-u6",
            "title": "Classes & Encapsulation",
            "description": "Public vs private access specifiers and member functions in C++",
            "iconType": "code",
            "questions": [
              {
                "id": "cpp-cls-1",
                "type": "tap-to-fill",
                "prompt": "Declare public access specifier for member methods:",
                "explanation": "public: exposes methods to outside callers, while private: protects internal data.",
                "xpReward": 10,
                "codeTemplate": "class Player {\nprivate:\n    int health;\n{{blank1}}:\n    void heal() { health = 100; }\n};",
                "options": [
                  "public",
                  "protected",
                  "virtual",
                  "static",
                  "friend"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "public"
                  }
                ]
              },
              {
                "id": "cpp-cls-2",
                "type": "spot-the-bug",
                "prompt": "Spot the illegal access to private member on line 8:",
                "explanation": "speed is a private member of Car and cannot be read or modified directly outside the class.",
                "xpReward": 15,
                "codeLines": [
                  "class Car {",
                  "    int speed = 0; // private by default in class!",
                  "public:",
                  "    void accelerate() { speed += 10; }",
                  "};",
                  "int main() {",
                  "    Car c;",
                  "    std::cout << c.speed; // Illegal private access!",
                  "}"
                ],
                "bugLineIndex": 7,
                "bugExplanation": "speed is private and cannot be accessed directly from main()!"
              }
            ]
          },
          {
            "id": "cpp-u6-n2",
            "unitId": "cpp-u6",
            "title": "Constructors & Destructors",
            "description": "Initialize object state automatically and leverage RAII cleanup",
            "iconType": "star",
            "questions": [
              {
                "id": "cpp-ctor-1",
                "type": "predict-output",
                "prompt": "What does this constructor call output?",
                "explanation": "Hero h(\"Bhai\") invokes the parameterized constructor, printing \"Hero Bhai created!\".",
                "xpReward": 10,
                "codeSnippet": "#include <iostream>\nclass Hero {\npublic:\n    Hero(std::string name) {\n        std::cout << name << \"!\";\n    }\n};\nint main() {\n    Hero h(\"Bhai\");\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "Bhai!",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Hero!",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "name!",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Error",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cpp-u7",
        "courseId": "cpp",
        "unitNumber": 7,
        "title": "Unit 7: Templates & Generics",
        "description": "Write type-independent generic functions with template <typename T>",
        "color": "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        "bannerColor": "bg-gradient-to-r from-amber-600 to-orange-700",
        "nodes": [
          {
            "id": "cpp-u7-n1",
            "unitId": "cpp-u7",
            "title": "Function Templates",
            "description": "Write one algorithm that works for ints, doubles, and strings alike",
            "iconType": "trophy",
            "questions": [
              {
                "id": "cpp-tmpl-1",
                "type": "tap-to-fill",
                "prompt": "Complete the generic getMax function template header:",
                "explanation": "template <typename T> defines a generic type placeholder T.",
                "xpReward": 15,
                "codeTemplate": "{{blank1}} <{{blank2}} T>\nT getMax(T a, T b) {\n    return (a > b) ? a : b;\n}",
                "options": [
                  "template",
                  "typename",
                  "class",
                  "generic",
                  "type"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "template"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "typename"
                  }
                ]
              },
              {
                "id": "cpp-tmpl-2",
                "type": "predict-output",
                "prompt": "What does getMax(3.5, 9.2) return?",
                "explanation": "The compiler instantiates getMax<double> and returns 9.2.",
                "xpReward": 10,
                "codeSnippet": "template <typename T>\nT getMax(T a, T b) { return (a > b) ? a : b; }\nint main() {\n    std::cout << getMax(3.5, 9.2);\n}",
                "options": [
                  {
                    "id": "1",
                    "text": "9.2",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "3.5",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "12.7",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Error",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "python": {
    "id": "python",
    "title": "Python",
    "shortTitle": "Python 3",
    "tagline": "Master Pythonic syntax, list comprehensions, slicing, generators & decorators",
    "badge": "🐍 Pythonic",
    "icon": "Zap",
    "color": "from-emerald-500 to-teal-700",
    "placementQuestions": [
      {
        "id": "py-place-1",
        "type": "predict-output",
        "prompt": "What does this Python list slicing expression output?",
        "explanation": "Slicing [1:3] extracts elements from index 1 up to (but not including) index 3 -> [20, 30].",
        "xpReward": 10,
        "difficulty": "beginner",
        "codeSnippet": "nums = [10, 20, 30, 40]\nprint(nums[1:3])",
        "options": [
          {
            "id": "1",
            "text": "[20, 30]",
            "isCorrect": true
          },
          {
            "id": "2",
            "text": "[10, 20, 30]",
            "isCorrect": false
          },
          {
            "id": "3",
            "text": "[20, 30, 40]",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "[30, 40]",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "py-place-2",
        "type": "spot-the-bug",
        "prompt": "Spot the syntax error in this conditional statement on line 2:",
        "explanation": "In Python, control flow statements (if, for, while, def, class) MUST end with a colon (:).",
        "xpReward": 15,
        "difficulty": "beginner",
        "codeLines": [
          "score = 85",
          "if score >= 50 // Missing colon!",
          "    print(\"Pass\")",
          "else:",
          "    print(\"Fail\")"
        ],
        "bugLineIndex": 1,
        "bugExplanation": "Missing colon (:) at the end of the if statement!"
      },
      {
        "id": "py-place-3",
        "type": "concept-match",
        "prompt": "Match Python data structures with their characteristics:",
        "explanation": "List is mutable, tuple is immutable, dict is key-value, and set stores unique elements.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "pairs": [
          {
            "id": "pyd1",
            "term": "list [ ]",
            "definition": "Ordered, mutable sequence of elements"
          },
          {
            "id": "pyd2",
            "term": "tuple ( )",
            "definition": "Ordered, immutable sequence that cannot be modified"
          },
          {
            "id": "pyd3",
            "term": "dict { }",
            "definition": "Key-value mapping providing O(1) average key lookup"
          },
          {
            "id": "pyd4",
            "term": "set { }",
            "definition": "Unordered collection of unique items with no duplicates"
          }
        ]
      },
      {
        "id": "py-place-4",
        "type": "tap-to-fill",
        "prompt": "Write a list comprehension to square even numbers:",
        "explanation": "[x**2 for x in nums if x % 2 == 0] filters even numbers and squares them.",
        "xpReward": 15,
        "difficulty": "advanced",
        "codeTemplate": "evens_squared = [x**2 {{blank1}} x in nums {{blank2}} x % 2 == 0]",
        "options": [
          "for",
          "if",
          "while",
          "in",
          "where"
        ],
        "blanks": [
          {
            "id": "blank1",
            "correctValue": "for"
          },
          {
            "id": "blank2",
            "correctValue": "if"
          }
        ]
      }
    ],
    "units": [
      {
        "id": "py-u1",
        "courseId": "python",
        "unitNumber": 1,
        "title": "Unit 1: Python Basics — print(), Variables & Math",
        "description": "Learn Python's clean syntax, print(), dynamic variables, and f-strings",
        "color": "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        "bannerColor": "bg-gradient-to-r from-emerald-600 to-teal-600",
        "nodes": [
          {
            "id": "py-u1-n1",
            "unitId": "py-u1",
            "title": "Python's Simplicity: print() & F-Strings",
            "description": "Print text and interpolate variables effortlessly with f-strings",
            "iconType": "code",
            "teachingIntro": {
              "title": "Python's Simplicity: print() & F-Strings",
              "subtitle": "Bhai 🐈‍⬛ & Ada 👧 explain why Python reads like plain English",
              "characterId": "byte",
              "steps": [
                {
                  "characterId": "byte",
                  "characterMood": "teaching",
                  "speech": "Welcome to Python! 🐍 If C++ is a Formula 1 race car with raw manual controls, Python is a sleek electric spaceship.\n\nThere are no semicolons, no complex boilerplates, and no manual memory management. To output text, we simply write print()!",
                  "codeSnippet": "name = \"Coder\"\nscore = 100\nprint(f\"Welcome {name}! Your score is {score}.\")"
                },
                {
                  "characterId": "ada",
                  "characterMood": "happy",
                  "speech": "F-Strings (Formatted String Literals) are one of Python's most beloved superpowers! Just put an 'f' in front of your quotes, and put any variable or math inside {curly brackets}!",
                  "anatomy": [
                    {
                      "token": "f\"...\"",
                      "explanation": "Tells Python to evaluate expressions inside curly braces."
                    },
                    {
                      "token": "{name}",
                      "explanation": "Evaluates the variable and pastes its value directly into the string."
                    },
                    {
                      "token": "{10 * 3}",
                      "explanation": "You can even run math inside {}: this becomes 30!"
                    }
                  ]
                }
              ]
            },
            "questions": [
              {
                "id": "py-1-1-1",
                "type": "tap-to-fill",
                "prompt": "Format a welcome message using an f-string:",
                "explanation": "Prefixing string with f allows variable interpolation inside curly braces {}.",
                "xpReward": 10,
                "codeTemplate": "user = \"Guido\"\nscore = 100\nmsg = {{blank1}}\"User: {{blank2}}, Score: {score}\"",
                "options": [
                  "f",
                  "r",
                  "{user}",
                  "user",
                  "$"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "f"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "{user}"
                  }
                ]
              },
              {
                "id": "py-1-1-2",
                "type": "predict-output",
                "prompt": "What does this formatted expression print?",
                "explanation": "Expressions inside f-string {} are evaluated directly at runtime: 10 * 3 = 30.",
                "xpReward": 10,
                "codeSnippet": "x = 10\nprint(f\"Result: {x * 3}\")",
                "options": [
                  {
                    "id": "1",
                    "text": "Result: 30",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Result: {x * 3}",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Result: 10 * 3",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "TypeError",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "py-u1-n2",
            "unitId": "py-u1",
            "title": "Variables & Dynamic Types",
            "description": "No type declarations needed: variables adapt dynamically to values",
            "iconType": "terminal",
            "questions": [
              {
                "id": "py-var-1",
                "type": "predict-output",
                "prompt": "What does type(3.14) print in Python?",
                "explanation": "3.14 is a floating-point number, so type() returns <class 'float'>.",
                "xpReward": 10,
                "codeSnippet": "x = 3.14\nprint(type(x).__name__)",
                "options": [
                  {
                    "id": "1",
                    "text": "float",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "int",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "double",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "number",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "py-var-2",
                "type": "tap-to-fill",
                "prompt": "Assign an integer and string variable in Python:",
                "explanation": "Python uses simple variable = value syntax with no types needed.",
                "xpReward": 10,
                "codeTemplate": "lives = {{blank1}}\nplayer = {{blank2}}",
                "options": [
                  "3",
                  "\"Alex\"",
                  "int",
                  "var",
                  "string"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "3"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "\"Alex\""
                  }
                ]
              }
            ]
          },
          {
            "id": "py-u1-n3",
            "unitId": "py-u1",
            "title": "User Input & Type Casting",
            "description": "Read user input with input() and cast strings to int() or float()",
            "iconType": "zap",
            "questions": [
              {
                "id": "py-cast-1",
                "type": "predict-output",
                "prompt": "What does this input concatenation without int() print if user typed 5?",
                "explanation": "input() always returns a string. \"5\" + \"5\" = \"55\", not 10!",
                "xpReward": 10,
                "codeSnippet": "age = \"5\"\nprint(age + age)",
                "options": [
                  {
                    "id": "1",
                    "text": "55",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "10",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "TypeError",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "5",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "py-cast-2",
                "type": "tap-to-fill",
                "prompt": "Cast string to an integer before addition:",
                "explanation": "int(text) parses numeric strings to real integer values.",
                "xpReward": 10,
                "codeTemplate": "raw = \"42\"\nnumber = {{blank1}}(raw)",
                "options": [
                  "int",
                  "float",
                  "str",
                  "parse",
                  "Number"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "int"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "py-u2",
        "courseId": "python",
        "unitNumber": 2,
        "title": "Unit 2: Flow Control — Conditionals & Loops",
        "description": "Clean indentation, if/elif/else, for loops with range(), and while loops",
        "color": "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400",
        "bannerColor": "bg-gradient-to-r from-teal-600 to-cyan-700",
        "nodes": [
          {
            "id": "py-u2-n1",
            "unitId": "py-u2",
            "title": "Conditionals: if, elif, else",
            "description": "Branching logic using 4-space indentation and colons",
            "iconType": "code",
            "questions": [
              {
                "id": "py-cond-1",
                "type": "predict-output",
                "prompt": "What does this elif ladder print?",
                "explanation": "score 75 is not >= 90, but 75 >= 70 is true -> prints \"B\".",
                "xpReward": 10,
                "codeSnippet": "score = 75\nif score >= 90:\n    print(\"A\")\nelif score >= 70:\n    print(\"B\")\nelse:\n    print(\"C\")",
                "options": [
                  {
                    "id": "1",
                    "text": "B",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "A",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "C",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "AB",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "py-cond-2",
                "type": "tap-to-fill",
                "prompt": "Fill in the elif keyword for multi-way branching in Python:",
                "explanation": "Python uses elif instead of \"else if\".",
                "xpReward": 10,
                "codeTemplate": "if x > 10:\n    print(\"Big\")\n{{blank1}} x > 5:\n    print(\"Med\")",
                "options": [
                  "elif",
                  "else if",
                  "elseif",
                  "else",
                  "case"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "elif"
                  }
                ]
              }
            ]
          },
          {
            "id": "py-u2-n2",
            "unitId": "py-u2",
            "title": "For Loops & range()",
            "description": "Count and iterate gracefully with Python's range(start, stop, step)",
            "iconType": "zap",
            "questions": [
              {
                "id": "py-loop-1",
                "type": "predict-output",
                "prompt": "What does range(3) generate in this loop?",
                "explanation": "range(3) generates numbers 0, 1, 2.",
                "xpReward": 10,
                "codeSnippet": "for i in range(3):\n    print(i, end=\"\")",
                "options": [
                  {
                    "id": "1",
                    "text": "012",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "123",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "0123",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "3",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "py-u3",
        "courseId": "python",
        "unitNumber": 3,
        "title": "Unit 3: Lists & Slicing",
        "description": "Master mutable lists, negative indexing, and slicing [start:stop:step]",
        "color": "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        "bannerColor": "bg-gradient-to-r from-cyan-600 to-blue-700",
        "nodes": [
          {
            "id": "py-u3-n1",
            "unitId": "py-u3",
            "title": "Lists Fundamentals",
            "description": "Create lists, append(), pop(), and access items by index",
            "iconType": "code",
            "questions": [
              {
                "id": "py-list-1",
                "type": "predict-output",
                "prompt": "What does this list append and pop output?",
                "explanation": "Starts [1, 2], appends 3 -> [1, 2, 3], pops last -> returns 3.",
                "xpReward": 10,
                "codeSnippet": "nums = [1, 2]\nnums.append(3)\nprint(nums.pop())",
                "options": [
                  {
                    "id": "1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "2",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "[1, 2]",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "1",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "py-u3-n2",
            "unitId": "py-u3",
            "title": "Slicing & Negative Indexing",
            "description": "Extract sub-lists with [start:stop] and access from end with [-1]",
            "iconType": "star",
            "questions": [
              {
                "id": "py-slice-1",
                "type": "predict-output",
                "prompt": "What does negative index [-1] access?",
                "explanation": "Negative index -1 always accesses the very last element: 40.",
                "xpReward": 10,
                "codeSnippet": "items = [10, 20, 30, 40]\nprint(items[-1])",
                "options": [
                  {
                    "id": "1",
                    "text": "40",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "10",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "30",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "IndexError",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "py-slice-2",
                "type": "predict-output",
                "prompt": "What does the slice [::-1] do to a list?",
                "explanation": "Step -1 reverses the sequence.",
                "xpReward": 10,
                "codeSnippet": "print([1, 2, 3][::-1])",
                "options": [
                  {
                    "id": "1",
                    "text": "[3, 2, 1]",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "[1, 2, 3]",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "[-1, -2, -3]",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "None",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "py-u4",
        "courseId": "python",
        "unitNumber": 4,
        "title": "Unit 4: Dictionaries & Sets",
        "description": "Key-value lookups with dict, get() default fallbacks, and unique sets",
        "color": "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        "bannerColor": "bg-gradient-to-r from-indigo-600 to-purple-700",
        "nodes": [
          {
            "id": "py-u4-n1",
            "unitId": "py-u4",
            "title": "Dictionaries: Key-Value Pairs",
            "description": "Fast O(1) lookups, get() with defaults, and updating values",
            "iconType": "code",
            "questions": [
              {
                "id": "py-dict-1",
                "type": "predict-output",
                "prompt": "What does user.get(\"city\", \"Unknown\") return?",
                "explanation": "\"city\" key does not exist in user, so get() returns the fallback \"Unknown\".",
                "xpReward": 10,
                "codeSnippet": "user = {\"name\": \"Lin\", \"score\": 90}\nprint(user.get(\"city\", \"Unknown\"))",
                "options": [
                  {
                    "id": "1",
                    "text": "Unknown",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "None",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "KeyError",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "Lin",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "py-u4-n2",
            "unitId": "py-u4",
            "title": "Dictionary Idioms & Sets",
            "description": "Unique collections with set() and checking membership with \"in\"",
            "iconType": "zap",
            "questions": [
              {
                "id": "py-set-1",
                "type": "predict-output",
                "prompt": "What does passing a list with duplicates to set() output?",
                "explanation": "Sets eliminate all duplicate values: {1, 2, 3}.",
                "xpReward": 10,
                "codeSnippet": "print(len(set([1, 2, 2, 3, 3])))",
                "options": [
                  {
                    "id": "1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "5",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "2",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "1",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "py-u5",
        "courseId": "python",
        "unitNumber": 5,
        "title": "Unit 5: Pythonic Superpowers",
        "description": "Write expressive code with list comprehensions and flexible functions",
        "color": "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400",
        "bannerColor": "bg-gradient-to-r from-purple-600 to-indigo-800",
        "nodes": [
          {
            "id": "py-u5-n1",
            "unitId": "py-u5",
            "title": "List Comprehensions",
            "description": "Transform and filter sequences in one readable, declarative line",
            "iconType": "trophy",
            "questions": [
              {
                "id": "py-comp-1",
                "type": "predict-output",
                "prompt": "What does this list comprehension output?",
                "explanation": "[x * 2 for x in [1, 2, 3]] doubles each item -> [2, 4, 6].",
                "xpReward": 10,
                "codeSnippet": "doubled = [x * 2 for x in [1, 2, 3]]\nprint(doubled)",
                "options": [
                  {
                    "id": "1",
                    "text": "[2, 4, 6]",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "[1, 2, 3, 1, 2, 3]",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "[2, 2, 2]",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "6",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "py-comp-2",
                "type": "tap-to-fill",
                "prompt": "Filter only positive numbers with list comprehension:",
                "explanation": "Adding \"if x > 0\" at the end filters elements.",
                "xpReward": 10,
                "codeTemplate": "positives = [x for x in nums {{blank1}} x > 0]",
                "options": [
                  "if",
                  "where",
                  "while",
                  "when",
                  "for"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "if"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "oop": {
    "id": "oop",
    "title": "Object-Oriented Programming",
    "shortTitle": "OOP Design",
    "tagline": "Master classes, objects, the 4 Pillars, design patterns & SOLID architecture",
    "badge": "🏛️ OOP Architecture",
    "icon": "Layers",
    "color": "from-purple-600 to-indigo-800",
    "placementQuestions": [
      {
        "id": "oop-place-1",
        "type": "predict-output",
        "prompt": "What does this object method invocation output?",
        "explanation": "The BankAccount object starts with 100, deposits 50, resulting in 150 balance.",
        "xpReward": 10,
        "difficulty": "beginner",
        "codeSnippet": "class BankAccount:\n    def __init__(self, initial):\n        self.balance = initial\n    def deposit(self, amt):\n        self.balance += amt\n\nacc = BankAccount(100)\nacc.deposit(50)\nprint(acc.balance)",
        "options": [
          {
            "id": "1",
            "text": "150",
            "isCorrect": true
          },
          {
            "id": "2",
            "text": "100",
            "isCorrect": false
          },
          {
            "id": "3",
            "text": "50",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "None",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "oop-place-2",
        "type": "spot-the-bug",
        "prompt": "Identify the encapsulation violation trying to mutate private state directly on line 8:",
        "explanation": "Directly modifying private internal fields outside class methods breaks encapsulation invariants.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "codeLines": [
          "class Thermostat {",
          "private:",
          "    int temperature;",
          "public:",
          "    void setTemp(int t) { temperature = t; }",
          "};",
          "Thermostat t;",
          "t.temperature = 1000; // Direct access bug!"
        ],
        "bugLineIndex": 7,
        "bugExplanation": "Cannot directly write to private member temperature! Use public setTemp() method."
      },
      {
        "id": "oop-place-3",
        "type": "concept-match",
        "prompt": "Match the 4 Pillars of OOP with their definitions:",
        "explanation": "Encapsulation hides state, Abstraction simplifies interfaces, Inheritance shares code, Polymorphism enables interchangeable behaviors.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "pairs": [
          {
            "id": "opp1",
            "term": "Encapsulation",
            "definition": "Bundles data and methods together while hiding internal representation"
          },
          {
            "id": "opp2",
            "term": "Abstraction",
            "definition": "Exposes clean public interfaces while hiding complex implementation details"
          },
          {
            "id": "opp3",
            "term": "Inheritance",
            "definition": "Mechanism where a subclass inherits fields and methods from a superclass"
          },
          {
            "id": "opp4",
            "term": "Polymorphism",
            "definition": "Ability for different classes to respond to the same method call differently"
          }
        ]
      }
    ],
    "units": [
      {
        "id": "oop-u1",
        "courseId": "oop",
        "unitNumber": 1,
        "title": "Unit 1: Classes & Objects — The Blueprint",
        "description": "Understand the blueprint metaphor, instantiate objects, and write constructors",
        "color": "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400",
        "bannerColor": "bg-gradient-to-r from-purple-600 to-indigo-700",
        "nodes": [
          {
            "id": "oop-u1-n1",
            "unitId": "oop-u1",
            "title": "Classes & Instances: The Blueprint",
            "description": "A Class is the architectural blueprint; an Object is the actual house built from it",
            "iconType": "code",
            "teachingIntro": {
              "title": "The Blueprint Metaphor: Classes & Objects",
              "subtitle": "Turing 🤖 & Junior 🧢 decode the foundations of OOP",
              "characterId": "turing",
              "steps": [
                {
                  "characterId": "turing",
                  "characterMood": "teaching",
                  "speech": "Think of an architectural blueprint of a house. The blueprint itself is not a house you can live in! It defines the layout.\n\nA Class is the blueprint. An Object (Instance) is the actual house built from that blueprint!",
                  "codeSnippet": "class Cat:\n    name = \"Bhai\"\n\nmy_cat = Cat() # my_cat is an instance of Cat!"
                }
              ]
            },
            "questions": [
              {
                "id": "oop-bs-1",
                "type": "predict-output",
                "prompt": "What does this object instantiation print?",
                "explanation": "c1 is an instance of Car with color \"Red\".",
                "xpReward": 10,
                "codeSnippet": "class Car:\n    def __init__(self, color):\n        self.color = color\n\nc1 = Car(\"Red\")\nprint(c1.color)",
                "options": [
                  {
                    "id": "1",
                    "text": "Red",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Car",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "color",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "None",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "oop-bs-2",
                "type": "concept-match",
                "prompt": "Match fundamental OOP terms:",
                "explanation": "Class is template, Object is instance, Field is property, Method is behavior.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "om1",
                    "term": "Class",
                    "definition": "The blueprint / user-defined data type defining structure"
                  },
                  {
                    "id": "om2",
                    "term": "Object / Instance",
                    "definition": "A concrete entity created in memory from the class"
                  },
                  {
                    "id": "om3",
                    "term": "Field / Attribute",
                    "definition": "Variable that holds state inside an object"
                  },
                  {
                    "id": "om4",
                    "term": "Method",
                    "definition": "Function defined inside a class that operates on object state"
                  }
                ]
              }
            ]
          },
          {
            "id": "oop-u1-n2",
            "unitId": "oop-u1",
            "title": "Constructors & State Initialization",
            "description": "Initialize object state automatically upon creation (__init__ / constructor)",
            "iconType": "star",
            "questions": [
              {
                "id": "oop-ctor-1",
                "type": "tap-to-fill",
                "prompt": "Complete the Python constructor method that initializes instance fields:",
                "explanation": "__init__ is Python's special constructor method called upon object creation.",
                "xpReward": 10,
                "codeTemplate": "class Hero:\n    def {{blank1}}(self, name, hp):\n        self.name = name\n        self.hp = hp",
                "options": [
                  "__init__",
                  "__new__",
                  "constructor",
                  "Hero",
                  "init"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "__init__"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "oop-u2",
        "courseId": "oop",
        "unitNumber": 2,
        "title": "Unit 2: Encapsulation & State Protection",
        "description": "Protect object internals, prevent invalid state, and write getters & setters",
        "color": "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        "bannerColor": "bg-gradient-to-r from-indigo-600 to-purple-800",
        "nodes": [
          {
            "id": "oop-u2-n1",
            "unitId": "oop-u2",
            "title": "Encapsulation & Access Modifiers",
            "description": "Keep state private and expose controlled public methods to safeguard data",
            "iconType": "zap",
            "questions": [
              {
                "id": "oop-enc-1",
                "type": "predict-output",
                "prompt": "What does calling withdraw(200) on a 100 balance output with invariant protection?",
                "explanation": "Because amount > balance, the setter rejects it and balance remains 100.",
                "xpReward": 10,
                "codeSnippet": "class Bank:\n    def __init__(self):\n        self._balance = 100\n    def withdraw(self, amt):\n        if amt <= self._balance:\n            self._balance -= amt\n        return self._balance\n\nb = Bank()\nb.withdraw(200)\nprint(b._balance)",
                "options": [
                  {
                    "id": "1",
                    "text": "100",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "-100",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "200",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "0",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "oop-u3",
        "courseId": "oop",
        "unitNumber": 3,
        "title": "Unit 3: Inheritance & Polymorphism",
        "description": "Reuse code with subclasses and dispatch interchangeable behaviors",
        "color": "border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400",
        "bannerColor": "bg-gradient-to-r from-pink-600 to-rose-700",
        "nodes": [
          {
            "id": "oop-u3-n1",
            "unitId": "oop-u3",
            "title": "Inheritance: Code Reuse",
            "description": "Subclasses inherit properties and methods from parent classes",
            "iconType": "code",
            "questions": [
              {
                "id": "oop-inh-1",
                "type": "predict-output",
                "prompt": "What does Dog inheriting from Animal output when calling speak()?",
                "explanation": "Dog overrides speak() to print \"Woof!\".",
                "xpReward": 10,
                "codeSnippet": "class Animal:\n    def speak(self): return \"Generic\"\n\nclass Dog(Animal):\n    def speak(self): return \"Woof!\"\n\nd = Dog()\nprint(d.speak())",
                "options": [
                  {
                    "id": "1",
                    "text": "Woof!",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "Generic",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "Animal",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "None",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "oop-u3-n2",
            "unitId": "oop-u3",
            "title": "Polymorphism & Dynamic Dispatch",
            "description": "Treat different objects through a common interface without caring about concrete type",
            "iconType": "trophy",
            "questions": [
              {
                "id": "oop-poly-1",
                "type": "tap-to-fill",
                "prompt": "Polymorphically call render() on every shape in a list:",
                "explanation": "Polymorphism allows iterating different shapes and calling the same method.",
                "xpReward": 15,
                "codeTemplate": "for shape in shapes:\n    shape.{{blank1}}()",
                "options": [
                  "render",
                  "draw",
                  "show",
                  "print",
                  "execute"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "render"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "oop-u4",
        "courseId": "oop",
        "unitNumber": 4,
        "title": "Unit 4: Architecture & SOLID Principles",
        "description": "Composition over inheritance and the 5 foundational SOLID principles",
        "color": "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        "bannerColor": "bg-gradient-to-r from-amber-600 to-orange-700",
        "nodes": [
          {
            "id": "oop-u4-n1",
            "unitId": "oop-u4",
            "title": "Composition over Inheritance",
            "description": "Favor \"has-a\" relationships over rigid \"is-a\" hierarchies",
            "iconType": "star",
            "questions": [
              {
                "id": "oop-comp-1",
                "type": "concept-match",
                "prompt": "Match architecture principles:",
                "explanation": "Composition is \"has-a\", Inheritance is \"is-a\", SRP says one reason to change, Open-Closed extends without modifying.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "sl1",
                    "term": "Composition (\"Has-a\")",
                    "definition": "Building complex classes by combining smaller independent components"
                  },
                  {
                    "id": "sl2",
                    "term": "Inheritance (\"Is-a\")",
                    "definition": "Specializing a base class by subclassing"
                  },
                  {
                    "id": "sl3",
                    "term": "Single Responsibility (SRP)",
                    "definition": "A class should have only one reason to change"
                  },
                  {
                    "id": "sl4",
                    "term": "Open-Closed Principle (OCP)",
                    "definition": "Software entities should be open for extension, but closed for modification"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "dsa": {
    "id": "dsa",
    "title": "Data Structures",
    "shortTitle": "Data Structures",
    "tagline": "Master contiguous memory, pointer chains, trees, hash tables & heaps",
    "badge": "🌳 Data Structures",
    "icon": "GitBranch",
    "color": "from-cyan-600 to-blue-700",
    "placementQuestions": [
      {
        "id": "dsa-place-1",
        "type": "predict-output",
        "prompt": "In a LIFO Stack, elements [10, 20, 30] are pushed in order. What element is popped first?",
        "explanation": "A stack operates on Last-In, First-Out (LIFO), so the last item pushed (30) is the first popped.",
        "xpReward": 10,
        "difficulty": "beginner",
        "codeSnippet": "stack = []\nstack.append(10)\nstack.append(20)\nstack.append(30)\nprint(stack.pop())",
        "options": [
          {
            "id": "1",
            "text": "30",
            "isCorrect": true
          },
          {
            "id": "2",
            "text": "10",
            "isCorrect": false
          },
          {
            "id": "3",
            "text": "20",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "None",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "dsa-place-2",
        "type": "spot-the-bug",
        "prompt": "Identify the incorrect BST insertion on line 4 violating binary search tree invariant:",
        "explanation": "In a BST, values strictly greater than current node must go to the right subtree.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "codeLines": [
          "// Root value: 50",
          "// Insert 30 -> goes Left (30 < 50) Correct",
          "// Insert 70 -> goes Left (70 > 50) Bug!",
          "root->left = new Node(70);"
        ],
        "bugLineIndex": 3,
        "bugExplanation": "70 is greater than 50 and must be placed in the right subtree!"
      },
      {
        "id": "dsa-place-3",
        "type": "concept-match",
        "prompt": "Match fundamental data structures with their access times:",
        "explanation": "Array index is O(1), Stack pop is O(1), Linked list traversal is O(N), BST search is O(log N) average.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "pairs": [
          {
            "id": "ds1",
            "term": "Array Index Lookup",
            "definition": "O(1) instant random access via address arithmetic"
          },
          {
            "id": "ds2",
            "term": "Singly Linked List Search",
            "definition": "O(N) linear traversal from head pointer"
          },
          {
            "id": "ds3",
            "term": "Stack Push / Pop",
            "definition": "O(1) constant time top operation"
          },
          {
            "id": "ds4",
            "term": "Hash Table Lookup (Average)",
            "definition": "O(1) constant time hash calculation"
          }
        ]
      }
    ],
    "units": [
      {
        "id": "dsa-u1",
        "courseId": "dsa",
        "unitNumber": 1,
        "title": "Unit 1: Linear Data Structures — Dynamic Arrays",
        "description": "Why array index lookup is instant O(1) and how capacity doubling yields amortized O(1)",
        "color": "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        "bannerColor": "bg-gradient-to-r from-cyan-600 to-blue-600",
        "nodes": [
          {
            "id": "dsa-u1-n1",
            "unitId": "dsa-u1",
            "title": "Dynamic Arrays & Capacity Doubling",
            "description": "Why array append is amortized O(1) despite memory reallocations",
            "iconType": "code",
            "teachingIntro": {
              "title": "The Memory Strip: Why Arrays are Instant O(1)",
              "subtitle": "Lin 🕶️ & Bhai 🐈‍⬛ explain RAM address calculation",
              "characterId": "lin",
              "steps": [
                {
                  "characterId": "lin",
                  "characterMood": "teaching",
                  "speech": "Welcome to Data Structures! 🕶️ In RAM, an Array is a contiguous block of memory side-by-side like lockers in a school hallway.\n\nTo find locker #42, you don't scan lockers 0, 1, 2... you jump directly to step 42! Address = Base + (Index × Size). That's why array indexing is instantaneous O(1)!",
                  "codeSnippet": "int numbers[4] = {10, 20, 30, 40};\nint val = numbers[2]; // Address = Base + 2 * 4 bytes -> Instant 30!"
                },
                {
                  "characterId": "byte",
                  "characterMood": "happy",
                  "speech": "When the array gets full, dynamic arrays (like std::vector or Python lists) double their capacity in the background so future appends stay lightning fast!",
                  "anatomy": [
                    {
                      "token": "Array[i]",
                      "explanation": "Instant O(1) constant time random access lookup."
                    },
                    {
                      "token": "Capacity 2x",
                      "explanation": "Doubling capacity ensures amortized O(1) append efficiency."
                    }
                  ]
                }
              ]
            },
            "questions": [
              {
                "id": "dsa-1-1-1",
                "type": "predict-output",
                "prompt": "What is the index access time for any element in a contiguous array?",
                "explanation": "Because array elements are stored in contiguous memory: address = base + index * sizeof(element), lookup is O(1).",
                "xpReward": 10,
                "codeSnippet": "int arr[10000];\nint val = arr[7421]; // Direct address calculation",
                "options": [
                  {
                    "id": "1",
                    "text": "O(1) Constant Time",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "O(N) Linear Time",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "O(log N)",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "O(N log N)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dsa-1-1-2",
                "type": "tap-to-fill",
                "prompt": "When dynamic arrays run out of capacity, by what factor do they typically resize?",
                "explanation": "Dynamic arrays double capacity to achieve amortized O(1) appends.",
                "xpReward": 10,
                "codeTemplate": "if (size == capacity) {\n    capacity = capacity * {{blank1}};\n}",
                "options": [
                  "2",
                  "10",
                  "+ 1",
                  "N",
                  "0"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "2"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "dsa-u2",
        "courseId": "dsa",
        "unitNumber": 2,
        "title": "Unit 2: Node-Based Structures — Linked Lists",
        "description": "Pointers connecting nodes, O(1) head insertions, and list traversal",
        "color": "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400",
        "bannerColor": "bg-gradient-to-r from-blue-600 to-indigo-700",
        "nodes": [
          {
            "id": "dsa-u2-n1",
            "unitId": "dsa-u2",
            "title": "Singly Linked Lists",
            "description": "Pointers, node traversals, and inserting at the head",
            "iconType": "terminal",
            "questions": [
              {
                "id": "dsa-1-2-1",
                "type": "tap-to-fill",
                "prompt": "Complete the loop condition to traverse a linked list until the end:",
                "explanation": "Traversing terminates when current pointer reaches nullptr.",
                "xpReward": 10,
                "codeTemplate": "Node* curr = head;\nwhile (curr != {{blank1}}) {\n    curr = curr->{{blank2}};\n}",
                "options": [
                  "nullptr",
                  "next",
                  "prev",
                  "head",
                  "val"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "nullptr"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "next"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "dsa-u3",
        "courseId": "dsa",
        "unitNumber": 3,
        "title": "Unit 3: LIFO & FIFO — Stacks & Queues",
        "description": "Last-In First-Out vs First-In First-Out, undo operations, and buffering",
        "color": "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        "bannerColor": "bg-gradient-to-r from-indigo-600 to-purple-700",
        "nodes": [
          {
            "id": "dsa-u3-n1",
            "unitId": "dsa-u3",
            "title": "Stacks & LIFO",
            "description": "Last-In First-Out operations and matching parentheses",
            "iconType": "zap",
            "questions": [
              {
                "id": "dsa-stk-1",
                "type": "predict-output",
                "prompt": "What does popping from this stack output?",
                "explanation": "LIFO: 3 is on top and pops first.",
                "xpReward": 10,
                "codeSnippet": "stack = [1, 2, 3]\nprint(stack.pop())",
                "options": [
                  {
                    "id": "1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "1",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "2",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "None",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "dsa-u4",
        "courseId": "dsa",
        "unitNumber": 4,
        "title": "Unit 4: Hash Tables & Binary Trees",
        "description": "O(1) average lookup via hashing, collision handling, and Binary Search Trees",
        "color": "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400",
        "bannerColor": "bg-gradient-to-r from-purple-600 to-slate-800",
        "nodes": [
          {
            "id": "dsa-u4-n1",
            "unitId": "dsa-u4",
            "title": "Hash Tables & Collision Handling",
            "description": "Hash functions, bucket arrays, and resolving collisions with chaining",
            "iconType": "star",
            "questions": [
              {
                "id": "dsa-hash-1",
                "type": "concept-match",
                "prompt": "Match hash table concepts:",
                "explanation": "Hash function maps keys to index, collision occurs when two keys map to same bucket, chaining uses linked lists.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "hm1",
                    "term": "Hash Function",
                    "definition": "Converts arbitrary key into numeric bucket index"
                  },
                  {
                    "id": "hm2",
                    "term": "Collision",
                    "definition": "Two distinct keys producing the exact same hash index"
                  },
                  {
                    "id": "hm3",
                    "term": "Separate Chaining",
                    "definition": "Handling collisions by keeping a linked list at each bucket"
                  },
                  {
                    "id": "hm4",
                    "term": "Load Factor",
                    "definition": "Ratio of stored elements to total bucket capacity"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "algorithms": {
    "id": "algorithms",
    "title": "Algorithms",
    "shortTitle": "Algorithms",
    "tagline": "Master time/space complexity, sorting, divide-and-conquer, graph BFS/DFS & DP",
    "badge": "🧠 Algorithms",
    "icon": "Compass",
    "color": "from-amber-600 to-rose-700",
    "placementQuestions": [
      {
        "id": "algo-place-1",
        "type": "predict-output",
        "prompt": "What is the time complexity of Binary Search on a sorted array of N elements?",
        "explanation": "Binary Search halves the search space at each iteration, yielding O(log N) runtime.",
        "xpReward": 10,
        "difficulty": "beginner",
        "codeSnippet": "// Searching for target in sorted array:\n// Step 1: N elements\n// Step 2: N / 2 elements\n// Step 3: N / 4 elements ...",
        "options": [
          {
            "id": "1",
            "text": "O(log N)",
            "isCorrect": true
          },
          {
            "id": "2",
            "text": "O(N)",
            "isCorrect": false
          },
          {
            "id": "3",
            "text": "O(N log N)",
            "isCorrect": false
          },
          {
            "id": "4",
            "text": "O(1)",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "algo-place-2",
        "type": "concept-match",
        "prompt": "Match algorithm paradigms with their key ideas:",
        "explanation": "Divide and conquer breaks into subproblems, Two pointers moves inward from ends, Greedy picks local optimum.",
        "xpReward": 15,
        "difficulty": "intermediate",
        "pairs": [
          {
            "id": "ap1",
            "term": "Divide & Conquer",
            "definition": "Splits problem into subproblems, solves recursively, merges solutions"
          },
          {
            "id": "ap2",
            "term": "Two Pointers",
            "definition": "Uses two indices moving toward each other to solve search/sum problems"
          },
          {
            "id": "ap3",
            "term": "Breadth-First Search",
            "definition": "Explores level-by-level using a queue for shortest path"
          },
          {
            "id": "ap4",
            "term": "Depth-First Search",
            "definition": "Explores as far as possible along each branch before backtracking"
          }
        ]
      }
    ],
    "units": [
      {
        "id": "algo-u1",
        "courseId": "algorithms",
        "unitNumber": 1,
        "title": "Unit 1: Search & Two Pointers",
        "description": "Halve the search space with Binary Search O(log N) and two pointers",
        "color": "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        "bannerColor": "bg-gradient-to-r from-amber-600 to-orange-700",
        "nodes": [
          {
            "id": "algo-u1-n1",
            "unitId": "algo-u1",
            "title": "Binary Search",
            "description": "Find elements in sorted arrays in lightning O(log N) time",
            "iconType": "target",
            "questions": [
              {
                "id": "algo-bs-1",
                "type": "predict-output",
                "prompt": "How many maximum comparisons does Binary Search need on 1,024 sorted elements?",
                "explanation": "log2(1024) = 10 comparisons.",
                "xpReward": 10,
                "codeSnippet": "// Array size = 1024\n// Iterations: 1024 -> 512 -> 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1",
                "options": [
                  {
                    "id": "1",
                    "text": "10",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "512",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "100",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "1024",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "algo-bs-2",
                "type": "tap-to-fill",
                "prompt": "Calculate the midpoint index without integer overflow:",
                "explanation": "low + (high - low) / 2 avoids potential integer overflow.",
                "xpReward": 10,
                "codeTemplate": "int mid = low + (high {{blank1}} low) {{blank2}} 2;",
                "options": [
                  "-",
                  "/",
                  "+",
                  "*",
                  "%"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "-"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "/"
                  }
                ]
              }
            ]
          },
          {
            "id": "algo-u1-n2",
            "unitId": "algo-u1",
            "title": "Two Pointers Technique",
            "description": "Solve pair sums, palindromes, and partition problems in linear O(N) time",
            "iconType": "code",
            "questions": [
              {
                "id": "algo-tp-1",
                "type": "concept-match",
                "prompt": "Match two-pointer patterns with their use cases:",
                "explanation": "Opposite ends finds target sum in sorted array, fast & slow finds cycles, sliding window finds substrings.",
                "xpReward": 15,
                "pairs": [
                  {
                    "id": "tp1",
                    "term": "Opposite Ends (left & right)",
                    "definition": "Checks palindromes or two-sum in sorted sequences"
                  },
                  {
                    "id": "tp2",
                    "term": "Fast & Slow (Floyd's Cycle)",
                    "definition": "Detects cycles in linked lists or finds midpoints"
                  },
                  {
                    "id": "tp3",
                    "term": "Sliding Window",
                    "definition": "Maintains running subarray state for continuous subarray problems"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "algo-u2",
        "courseId": "algorithms",
        "unitNumber": 2,
        "title": "Unit 2: Divide and Conquer & Sorting",
        "description": "Divide into subproblems, merge sorted halves, and understand recursion",
        "color": "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400",
        "bannerColor": "bg-gradient-to-r from-orange-600 to-rose-700",
        "nodes": [
          {
            "id": "algo-u2-n1",
            "unitId": "algo-u2",
            "title": "Divide & Conquer: Merge Sort",
            "description": "Recursively split arrays and merge them in guaranteed O(N log N) time",
            "iconType": "zap",
            "questions": [
              {
                "id": "algo-ms-1",
                "type": "predict-output",
                "prompt": "What is the worst-case time complexity of Merge Sort?",
                "explanation": "Merge sort consistently divides in half and merges in linear time: O(N log N) in all cases.",
                "xpReward": 10,
                "codeSnippet": "// Merge Sort recurrence:\n// T(N) = 2T(N/2) + O(N)\n// By Master Theorem:",
                "options": [
                  {
                    "id": "1",
                    "text": "O(N log N)",
                    "isCorrect": true
                  },
                  {
                    "id": "2",
                    "text": "O(N^2)",
                    "isCorrect": false
                  },
                  {
                    "id": "3",
                    "text": "O(N)",
                    "isCorrect": false
                  },
                  {
                    "id": "4",
                    "text": "O(log N)",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "algo-u3",
        "courseId": "algorithms",
        "unitNumber": 3,
        "title": "Unit 3: Graph Traversal",
        "description": "Explore networks level-by-level with BFS and deep-dive with DFS",
        "color": "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400",
        "bannerColor": "bg-gradient-to-r from-rose-600 to-red-800",
        "nodes": [
          {
            "id": "algo-u3-n1",
            "unitId": "algo-u3",
            "title": "Breadth-First Search (BFS)",
            "description": "Find shortest paths in unweighted graphs using a FIFO queue",
            "iconType": "star",
            "questions": [
              {
                "id": "algo-bfs-1",
                "type": "tap-to-fill",
                "prompt": "What data structure is fundamentally used to maintain BFS traversal order?",
                "explanation": "BFS uses a FIFO queue to visit nodes level-by-level.",
                "xpReward": 10,
                "codeTemplate": "// In BFS:\nfrom collections import {{blank1}}\nqueue = {{blank2}}([start_node])",
                "options": [
                  "deque",
                  "deque",
                  "heap",
                  "stack",
                  "set"
                ],
                "blanks": [
                  {
                    "id": "blank1",
                    "correctValue": "deque"
                  },
                  {
                    "id": "blank2",
                    "correctValue": "deque"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
