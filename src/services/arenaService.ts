import { supabase } from '../lib/supabaseClient';
import { ArenaChallenge, ArenaMatch, ArenaMode, ArenaPlayer, QuestionSubmission } from '../types';
import { INITIAL_QUESTION_BANK } from '../data/questionBank';

const STORAGE_KEY_COMMUNITY_QUESTIONS = 'bytesized_community_questions';
const STORAGE_KEY_ARENA_MATCHES = 'bytesized_arena_history';

/**
 * Loads all approved challenges from built-in repository and approved community contributions.
 */
export async function getApprovedChallenges(): Promise<ArenaChallenge[]> {
  const localQuestions = getLocalCommunityQuestions();

  // Try fetching from Supabase if table exists
  let remoteApproved: ArenaChallenge[] = [];
  try {
    const { data, error } = await supabase
      .from('question_bank')
      .select('*')
      .eq('status', 'approved');

    if (!error && data && data.length > 0) {
      remoteApproved = data.map(mapDbToChallenge);
    }
  } catch (err) {
    // Graceful offline fallback
    console.warn('Using local question bank fallback:', err);
  }

  // Combine built-in + local approved + remote approved (deduplicating by id/slug)
  const challengeMap = new Map<string, ArenaChallenge>();

  INITIAL_QUESTION_BANK.forEach(q => challengeMap.set(q.id, q));
  localQuestions.filter(q => q.status === 'approved').forEach(q => challengeMap.set(q.id, q));
  remoteApproved.forEach(q => challengeMap.set(q.id, q));

  return Array.from(challengeMap.values());
}

/**
 * Retrieves all pending questions awaiting admin review.
 */
export async function getPendingChallenges(): Promise<ArenaChallenge[]> {
  const localPending = getLocalCommunityQuestions().filter(q => q.status === 'pending');

  let remotePending: ArenaChallenge[] = [];
  try {
    const { data, error } = await supabase
      .from('question_bank')
      .select('*')
      .eq('status', 'pending');

    if (!error && data && data.length > 0) {
      remotePending = data.map(mapDbToChallenge);
    }
  } catch (err) {
    console.warn('Pending questions fetch fallback:', err);
  }

  const map = new Map<string, ArenaChallenge>();
  localPending.forEach(q => map.set(q.id, q));
  remotePending.forEach(q => map.set(q.id, q));

  return Array.from(map.values());
}

/**
 * Submits a new challenge to the community question bank.
 * STRICT REQUIREMENT: User must have a streak > 10 days!
 */
export async function submitChallenge(
  submission: QuestionSubmission,
  author: { id?: string; name: string; streak: number }
): Promise<{ success: boolean; challenge?: ArenaChallenge; error?: string }> {
  // Validation: Perfect streak > 10 days requirement
  if (!author.streak || author.streak <= 10) {
    return {
      success: false,
      error: `Upload restricted: Perfect streak of more than 10 days is required. (Your streak: ${author.streak || 0} days). Keep practicing daily to unlock authoring!`
    };
  }

  const slug = submission.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `challenge-${Date.now()}`;

  const newChallenge: ArenaChallenge = {
    id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: submission.title.trim(),
    slug,
    description: submission.description.trim(),
    difficulty: submission.difficulty,
    category: submission.category.trim() || 'General',
    authorId: author.id,
    authorName: author.name,
    authorStreak: author.streak,
    constraints: submission.constraints,
    sampleCases: submission.sampleCases,
    hiddenCases: submission.hiddenCases,
    starterTemplates: submission.starterTemplates,
    status: 'pending',
    createdAt: new Date().toISOString(),
    isCommunity: true
  };

  // 1. Save to LocalStorage
  const local = getLocalCommunityQuestions();
  local.unshift(newChallenge);
  saveLocalCommunityQuestions(local);

  // 2. Attempt save to Supabase
  try {
    await supabase.from('question_bank').insert([
      {
        id: newChallenge.id,
        title: newChallenge.title,
        slug: newChallenge.slug,
        description: newChallenge.description,
        difficulty: newChallenge.difficulty,
        category: newChallenge.category,
        author_id: author.id || null,
        author_name: author.name,
        author_streak: author.streak,
        constraints: newChallenge.constraints,
        sample_cases: newChallenge.sampleCases,
        hidden_cases: newChallenge.hiddenCases,
        starter_templates: newChallenge.starterTemplates,
        status: 'pending'
      }
    ]);
  } catch (remoteErr) {
    console.warn('Could not sync question to Supabase cloud table:', remoteErr);
  }

  return { success: true, challenge: newChallenge };
}

/**
 * Admin action: Approve a pending question
 */
export async function approveChallenge(
  questionId: string,
  reviewerName: string
): Promise<boolean> {
  const local = getLocalCommunityQuestions();
  const q = local.find(item => item.id === questionId);
  if (q) {
    q.status = 'approved';
    q.reviewerName = reviewerName;
    q.reviewedAt = new Date().toISOString();
    saveLocalCommunityQuestions(local);
  }

  try {
    await supabase
      .from('question_bank')
      .update({
        status: 'approved',
        reviewer_name: reviewerName,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', questionId);
  } catch (err) {
    console.warn('Remote approve update error:', err);
  }

  return true;
}

/**
 * Admin action: Reject a pending question
 */
export async function rejectChallenge(
  questionId: string,
  reviewerName: string
): Promise<boolean> {
  const local = getLocalCommunityQuestions();
  const q = local.find(item => item.id === questionId);
  if (q) {
    q.status = 'rejected';
    q.reviewerName = reviewerName;
    q.reviewedAt = new Date().toISOString();
    saveLocalCommunityQuestions(local);
  }

  try {
    await supabase
      .from('question_bank')
      .update({
        status: 'rejected',
        reviewer_name: reviewerName,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', questionId);
  } catch (err) {
    console.warn('Remote reject update error:', err);
  }

  return true;
}

/**
 * Creates an arena room (for custom friend battle or instant stranger matchmaking).
 */
export function createArenaMatch(
  mode: ArenaMode,
  timeLimitSeconds: number,
  selectedQuestionIds: string[],
  host: { id: string; name: string; avatar?: string }
): ArenaMatch {
  const codeChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let roomCode = '';
  for (let i = 0; i < 6; i++) {
    roomCode += codeChars[Math.floor(Math.random() * codeChars.length)];
  }

  const match: ArenaMatch = {
    id: `arena-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    roomCode,
    mode,
    timeLimitSeconds,
    selectedQuestionIds,
    host: {
      id: host.id,
      name: host.name,
      avatar: host.avatar,
      score: 0,
      currentQuestionIndex: 0,
      solvedQuestionIds: []
    },
    status: 'lobby'
  };

  return match;
}

/**
 * Generates an active bot / online stranger challenger for solo practice or instant quick matches.
 */
export function generateStrangerOpponent(): ArenaPlayer {
  const BOT_OPPONENTS = [
    { name: 'SyntaxSamurai', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=samurai' },
    { name: 'AlgoNinja_99', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ninja' },
    { name: 'BinaryBeast', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=beast' },
    { name: 'CyberCat_Ada', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ada' },
    { name: 'HexHacker', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=hacker' },
    { name: 'DevDynamo', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dynamo' }
  ];

  const pick = BOT_OPPONENTS[Math.floor(Math.random() * BOT_OPPONENTS.length)];
  return {
    id: `stranger-${Date.now()}`,
    name: pick.name,
    avatar: pick.avatar,
    isBot: true,
    score: 0,
    currentQuestionIndex: 0,
    solvedQuestionIds: []
  };
}

// Local storage helpers
function getLocalCommunityQuestions(): ArenaChallenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMUNITY_QUESTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCommunityQuestions(questions: ArenaChallenge[]) {
  try {
    localStorage.setItem(STORAGE_KEY_COMMUNITY_QUESTIONS, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save community questions locally', e);
  }
}

function mapDbToChallenge(row: any): ArenaChallenge {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug || row.id,
    description: row.description,
    difficulty: row.difficulty,
    category: row.category,
    authorId: row.author_id,
    authorName: row.author_name,
    authorStreak: row.author_streak,
    constraints: Array.isArray(row.constraints) ? row.constraints : [],
    sampleCases: Array.isArray(row.sample_cases) ? row.sample_cases : [],
    hiddenCases: Array.isArray(row.hidden_cases) ? row.hidden_cases : [],
    starterTemplates: row.starter_templates || {},
    status: row.status,
    reviewerName: row.reviewer_name,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    isCommunity: true
  };
}
