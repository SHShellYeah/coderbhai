/**
 * Validation script for DSA Roadmaps
 * Run with: npm run validate:roadmaps
 * Or: node scripts/validate-roadmaps.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const roadmapsFilePath = path.resolve(__dirname, '../src/data/dsaRoadmaps.ts');

const tsCode = fs.readFileSync(roadmapsFilePath, 'utf8');

// Extract definitions directly from the source TypeScript file
const catMatch = tsCode.match(/export const OFFICIAL_DSA_CATEGORIES: string\[\] = (\[[\s\S]*?\]);/);
if (!catMatch) {
  console.error('❌ Could not parse OFFICIAL_DSA_CATEGORIES from src/data/dsaRoadmaps.ts');
  process.exit(1);
}
const OFFICIAL_DSA_CATEGORIES = JSON.parse(catMatch[1]);

const b75Match = tsCode.match(/export const BLIND_75_PROBLEMS: DsaProblem\[\] = (\[[\s\S]*?\]);/);
if (!b75Match) {
  console.error('❌ Could not parse BLIND_75_PROBLEMS from src/data/dsaRoadmaps.ts');
  process.exit(1);
}
const BLIND_75_PROBLEMS = JSON.parse(b75Match[1]);

const nc150Match = tsCode.match(/export const NEETCODE_150_PROBLEMS: DsaProblem\[\] = (\[[\s\S]*?\]);/);
if (!nc150Match) {
  console.error('❌ Could not parse NEETCODE_150_PROBLEMS from src/data/dsaRoadmaps.ts');
  process.exit(1);
}
const NEETCODE_150_PROBLEMS = JSON.parse(nc150Match[1]);

const BLIND_75_ROADMAP = {
  id: 'blind75',
  title: 'Blind 75',
  totalCount: 75,
  categories: OFFICIAL_DSA_CATEGORIES,
  problems: BLIND_75_PROBLEMS
};

const NEETCODE_150_ROADMAP = {
  id: 'neetcode150',
  title: 'NeetCode 150',
  totalCount: 150,
  categories: OFFICIAL_DSA_CATEGORIES,
  problems: NEETCODE_150_PROBLEMS
};

const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

function validateRoadmap(roadmap, expectedCount, name) {
  console.log(`\nValidating ${name}...`);
  const errors = [];

  // 1. Check exact problem count
  if (roadmap.problems.length !== expectedCount) {
    errors.push(`Expected ${expectedCount} problems, got ${roadmap.problems.length}`);
  }
  if (roadmap.totalCount !== expectedCount) {
    errors.push(`Expected totalCount property to be ${expectedCount}, got ${roadmap.totalCount}`);
  }

  // 2. Check duplicate IDs & titles
  const seenIds = new Set();
  const seenTitles = new Set();
  roadmap.problems.forEach((p, idx) => {
    if (seenIds.has(p.id)) {
      errors.push(`Duplicate canonical problem ID found: "${p.id}" at index ${idx}`);
    }
    seenIds.add(p.id);

    if (seenTitles.has(p.title)) {
      errors.push(`Duplicate problem title found: "${p.title}" at index ${idx}`);
    }
    seenTitles.add(p.title);
  });

  // 3. Check sequential order
  roadmap.problems.forEach((p, idx) => {
    const expectedOrder = idx + 1;
    if (p.order !== expectedOrder) {
      errors.push(`Problem "${p.id}" has order ${p.order}, expected ${expectedOrder}`);
    }
  });

  // 4. Check difficulty values
  roadmap.problems.forEach((p) => {
    if (!VALID_DIFFICULTIES.includes(p.difficulty)) {
      errors.push(`Problem "${p.id}" has invalid difficulty: "${p.difficulty}"`);
    }
  });

  // 5. Check URL formats
  roadmap.problems.forEach((p) => {
    if (!p.leetcodeUrl || !p.leetcodeUrl.startsWith('https://leetcode.com/problems/')) {
      errors.push(`Problem "${p.id}" has invalid leetcodeUrl: "${p.leetcodeUrl}"`);
    }
    if (p.neetcodeUrl && !p.neetcodeUrl.startsWith('https://neetcode.io/problems/')) {
      errors.push(`Problem "${p.id}" has invalid neetcodeUrl: "${p.neetcodeUrl}"`);
    }
  });

  // 6. Check official category membership & category ordering
  let lastCatIndex = -1;
  const topicCounts = {};

  roadmap.problems.forEach((p) => {
    const catIndex = OFFICIAL_DSA_CATEGORIES.indexOf(p.category);
    if (catIndex === -1) {
      errors.push(`Problem "${p.id}" has unknown category: "${p.category}"`);
      return;
    }
    if (catIndex < lastCatIndex) {
      errors.push(`Topic sequence violation: "${p.category}" appeared out of order`);
    }
    lastCatIndex = Math.max(lastCatIndex, catIndex);

    topicCounts[p.category] = (topicCounts[p.category] || 0) + 1;
    if (p.topicOrder !== topicCounts[p.category]) {
      errors.push(
        `Topic order mismatch for "${p.id}": got topicOrder ${p.topicOrder}, expected ${topicCounts[p.category]}`
      );
    }
  });

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} error(s):`);
    errors.forEach(err => console.error(`  - ${err}`));
    return false;
  }

  console.log(`✅ ${name} passed validation: exactly ${roadmap.problems.length} problems, valid categories, ordering, and URLs.`);
  return true;
}

function run() {
  console.log('--- ByteSized DSA Roadmap Validation ---');
  const b75Passed = validateRoadmap(BLIND_75_ROADMAP, 75, 'Blind 75');
  const nc150Passed = validateRoadmap(NEETCODE_150_ROADMAP, 150, 'NeetCode 150');

  // Verify Blind 75 is NOT simply the first 75 entries of NeetCode 150
  const first75Of150 = NEETCODE_150_ROADMAP.problems.slice(0, 75).map(p => p.id);
  const blind75Ids = BLIND_75_ROADMAP.problems.map(p => p.id);
  const isIdenticalToFirst75 = blind75Ids.every((id, idx) => id === first75Of150[idx]);
  if (isIdenticalToFirst75) {
    console.error('❌ Blind 75 was improperly constructed as the first 75 entries of NeetCode 150!');
    process.exit(1);
  } else {
    console.log('✅ Verified: Blind 75 is an independently curated subset, not merely the first 75 entries of NeetCode 150.');
  }

  // Verify all Blind 75 problems exist within NeetCode 150 (shared canonical IDs)
  const nc150Set = new Set(NEETCODE_150_ROADMAP.problems.map(p => p.id));
  const allInNc150 = BLIND_75_ROADMAP.problems.every(p => nc150Set.has(p.id));
  if (!allInNc150) {
    console.error('❌ Some Blind 75 problems missing canonical match in NeetCode 150!');
    process.exit(1);
  } else {
    console.log('✅ Verified: All 75 Blind 75 problems match canonical IDs in NeetCode 150 for shared progress.');
  }

  if (!b75Passed || !nc150Passed) {
    process.exit(1);
  }
  console.log('\n🎉 ALL DSA ROADMAP VALIDATION CHECKS PASSED SUCCESSFULLY!\n');
}

run();
