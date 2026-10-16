export type CourseId = 'c' | 'cpp' | 'python' | 'oop' | 'dsa' | 'algorithms';

export type CharacterId = 'byte' | 'ada' | 'turing' | 'junior' | 'lin';

export type CharacterMood = 'happy' | 'teaching' | 'thinking' | 'cheering' | 'surprised';

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  avatar: string;
  role: string;
  color: string;
}

export interface CodeAnatomyToken {
  token: string;
  explanation: string;
  color?: string;
}

export interface InteractiveTry {
  prompt: string;
  tokens: string[];
  targetOrder: string[];
  previewOutput: string;
}

export interface TeachingDialogueStep {
  characterId: CharacterId;
  characterMood: CharacterMood;
  speech: string;
  codeSnippet?: string;
  anatomy?: CodeAnatomyToken[];
  interactiveTry?: InteractiveTry;
}

export interface TeachingIntro {
  title: string;
  subtitle: string;
  characterId: CharacterId;
  steps: TeachingDialogueStep[];
}

export type QuestionType = 'tap-to-fill' | 'spot-the-bug' | 'predict-output' | 'concept-match';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
  xpReward: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  mentorTip?: string; // Character hint when user needs guidance!
}

export interface BlankItem {
  id: string;
  correctValue: string;
}

export interface TapToFillQuestion extends BaseQuestion {
  type: 'tap-to-fill';
  codeTemplate: string;
  options: string[];
  blanks: BlankItem[];
}

export interface SpotTheBugQuestion extends BaseQuestion {
  type: 'spot-the-bug';
  codeLines: string[];
  bugLineIndex: number;
  bugExplanation: string;
}

export interface PredictOutputOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface PredictOutputQuestion extends BaseQuestion {
  type: 'predict-output';
  codeSnippet: string;
  options: PredictOutputOption[];
}

export interface ConceptPair {
  id: string;
  term: string;
  definition: string;
}

export interface ConceptMatchQuestion extends BaseQuestion {
  type: 'concept-match';
  pairs: ConceptPair[];
}

export type Question =
  | TapToFillQuestion
  | SpotTheBugQuestion
  | PredictOutputQuestion
  | ConceptMatchQuestion;

export interface LessonNode {
  id: string;
  unitId: string;
  title: string;
  description: string;
  iconType: 'star' | 'book' | 'target' | 'trophy' | 'code' | 'zap' | 'bug' | 'terminal';
  teachingIntro?: TeachingIntro; // Interactive character teaching step!
  questions: Question[];
}

export interface Unit {
  id: string;
  courseId: CourseId;
  unitNumber: number;
  title: string;
  description: string;
  color: string;
  bannerColor: string;
  nodes: LessonNode[];
}

export interface Course {
  id: CourseId;
  title: string;
  shortTitle: string;
  tagline: string;
  badge: string;
  icon: string;
  color: string;
  units: Unit[];
  placementQuestions: Question[];
}

export interface Quest {
  id: string;
  title: string;
  icon: string;
  progress: number;
  target: number;
  rewardXp: number;
  rewardGems: number;
  completed: boolean;
}

export interface CourseProgress {
  completedNodeIds: string[];
  currentNodeId: string;
  placementTaken: boolean;
  unlockedUnitCount: number;
}

export type SoundPack = 'duolingo' | 'retro-8bit' | 'arcade-synth';
export type ThemeColor = 'midnight' | 'cyberpunk' | 'sunset' | 'emerald-synth' | 'emerald' | 'obsidian';
export type Language = 'en' | 'bn';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  isEduUser?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  isEduUser: boolean;
  xp: number;
  gems: number;
  streak: number;
  unlimitedHeartsUntil?: number | null;
  courseProgress?: Record<CourseId, CourseProgress>;
  settings?: {
    themeColor?: ThemeColor;
    darkMode?: boolean;
    language?: Language;
    soundEnabled?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  activeCourseId: CourseId;
  courseProgress: Record<CourseId, CourseProgress>;
  streak: number;
  lastActiveDate: string;
  gems: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  unlimitedHeartsUntil?: number | null; // Timestamp ms for .edu unlimited hearts perk
  authUser?: AuthUser | null;
  mistakes: Question[];
  soundEnabled: boolean;
  soundPack: SoundPack;
  themeColor: ThemeColor;
  darkMode: boolean;
  language: Language;
  quests: Quest[];
}

export type IdeaCategory = 'all' | 'idea' | 'dsa' | 'bug' | 'snippet' | 'general';

export interface IdeaNote {
  id: string;
  title: string;
  content: string;
  category: 'idea' | 'dsa' | 'bug' | 'snippet' | 'general';
  codeSnippet?: string;
  codeLanguage?: string;
  pinned?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CodeLanguage = 'c' | 'cpp' | 'python' | 'javascript';

