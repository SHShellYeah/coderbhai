import { Character, CharacterId } from '../types';

export const CHARACTERS: Record<CharacterId, Character> = {
  byte: {
    id: 'byte',
    name: 'Bhai',
    title: 'Lead Code Mentor & Black Cat Hacker',
    avatar: '🐾',
    role: 'Your clever black cat guide who prowls through tricky CS syntax and makes code purrfect.',
    color: 'bg-brand-primary text-white',
  },
  ada: {
    id: 'ada',
    name: 'Ada',
    title: 'Algorithms Prodigy',
    avatar: '👧',
    role: 'Loves patterns, loops, and showing you the cleanest way to solve puzzles.',
    color: 'bg-purple-500 text-white',
  },
  turing: {
    id: 'turing',
    name: 'Turing-9000',
    title: 'System Automaton',
    avatar: '🤖',
    role: 'Visualizes RAM, byte addresses, and CPU instructions with crystal clarity.',
    color: 'bg-cyan-500 text-white',
  },
  junior: {
    id: 'junior',
    name: 'Junior',
    title: 'Curious Beginner',
    avatar: '🧢',
    role: 'Asks the common "why does this exist?" questions every beginner wonders.',
    color: 'bg-amber-500 text-white',
  },
  lin: {
    id: 'lin',
    name: 'Lin',
    title: 'Kernel & C++ Hacker',
    avatar: '🕶️',
    role: 'Shows you the power of raw memory, pointers, and blazing fast runtime performance.',
    color: 'bg-rose-500 text-white',
  },
};
