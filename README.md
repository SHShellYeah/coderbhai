# 🐈‍⬛ ByteSized

> **Duolingo-style gamified computer science and code-learning web application.**
> Master Pure C, Modern C++, Python, OOP, Data Structures, and Algorithms through bite-sized, tactile lessons with **Byte the Cat** mascot mentor!

---

## 🚀 Key Features

- **🐈‍⬛ Bhai the Black Cat Mascot Mentor**: Interactive concept comic dialogues, code anatomy breakdowns, and helpful pro tips.
- **⚡ 6 Distinct Learning Tracks**:
  - **Pure C**: `printf`, `scanf`, structs, `malloc` / `free` pointers and manual memory management.
  - **Modern C++**: `std::cout`, `std::cin`, references, vectors, and RAII.
  - **Python**: Dynamic typing, indentation, list comprehensions, and clean idioms.
  - **Object-Oriented Programming (OOP)**: Encapsulation, inheritance, polymorphism, and abstraction.
  - **Data Structures**: Arrays, dynamic arrays, linked lists, stacks, queues, and tree nodes.
  - **Algorithms**: Big-O runtime, binary search, bubble sort, merge sort, and hash maps.
- **⌨️ Dual Input Lesson Engine**:
  - **Direct Keyboard Typing Mode**: Type code directly into blanks with automatic focus and `Enter`/`Tab` navigation.
  - **Tap-to-Fill Word Bank**: Chunky 3D pills for tactile, tap-based learning on mobile.
- **🎯 4 Interactive Question Archetypes**:
  - Tap/Type to Fill
  - Spot the Bug (click the exact line)
  - Predict the Output
  - Concept & Syntax Matching
- **🎮 Gamified Retention Loop**:
  - Streaks, XP, and Gem rewards.
  - 5 Hearts system with mistakes review practice and instant refill.
  - Adaptive Mistake Loop (re-queues missed questions until mastered).
  - Confetti victory celebrations!
- **🎨 Customization & Audio**:
  - Web Audio API Sound Synthesizer with 3 packs (*Duolingo Classic*, *Retro 8-bit Arcade*, *Cyber Synthwave*).
  - 4 Vibrant Color Palettes (*Emerald Lime*, *Neon Cyberpunk*, *Sunset Coral*, *Deep Indigo*).
  - Crisp Dark & Light mode.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (3D chunky tactile buttons with active click depressions)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti & Web Audio API
- **Persistence**: `localStorage` state management

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/acidki/coderbhai.git
cd coderbhai

# 2. Install dependencies
npm install

# 3. Start local dev server
npm run dev
```

---

## 🌐 Deploying to Render

This app is optimized for **Render Static Sites**:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- SPA rewrite rules pre-configured in `public/_redirects`.
