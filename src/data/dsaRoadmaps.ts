import { DsaProblem, DsaRoadmap, DsaRoadmapId } from "../types/dsa";

export const OFFICIAL_DSA_CATEGORIES: string[] = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Heap / Priority Queue",
  "Backtracking",
  "Tries",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation"
];

export const BLIND_75_PROBLEMS: DsaProblem[] = [
  {
    "id": "contains-duplicate",
    "title": "Contains Duplicate",
    "category": "Arrays & Hashing",
    "difficulty": "Easy",
    "order": 1,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/",
    "neetcodeUrl": "https://neetcode.io/problems/duplicate-integer/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "valid-anagram",
    "title": "Valid Anagram",
    "category": "Arrays & Hashing",
    "difficulty": "Easy",
    "order": 2,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/valid-anagram/",
    "neetcodeUrl": "https://neetcode.io/problems/is-anagram/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "two-sum",
    "title": "Two Sum",
    "category": "Arrays & Hashing",
    "difficulty": "Easy",
    "order": 3,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/two-integer-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "group-anagrams",
    "title": "Group Anagrams",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 4,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/group-anagrams/",
    "neetcodeUrl": "https://neetcode.io/problems/anagram-groups/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 5,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
    "neetcodeUrl": "https://neetcode.io/problems/top-k-elements-in-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "encode-and-decode-strings",
    "title": "Encode and Decode Strings",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 6,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/encode-and-decode-strings/",
    "neetcodeUrl": "https://neetcode.io/problems/string-encode-and-decode/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 7,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
    "neetcodeUrl": "https://neetcode.io/problems/products-of-array-discluding-self/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 8,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-consecutive-sequence/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "valid-palindrome",
    "title": "Valid Palindrome",
    "category": "Two Pointers",
    "difficulty": "Easy",
    "order": 9,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome/",
    "neetcodeUrl": "https://neetcode.io/problems/is-palindrome/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "3sum",
    "title": "3Sum",
    "category": "Two Pointers",
    "difficulty": "Medium",
    "order": 10,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/3sum/",
    "neetcodeUrl": "https://neetcode.io/problems/three-integer-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "container-with-most-water",
    "title": "Container With Most Water",
    "category": "Two Pointers",
    "difficulty": "Medium",
    "order": 11,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
    "neetcodeUrl": "https://neetcode.io/problems/max-water-container/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy And Sell Stock",
    "category": "Sliding Window",
    "difficulty": "Easy",
    "order": 12,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "neetcodeUrl": "https://neetcode.io/problems/buy-and-sell-crypto/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "category": "Sliding Window",
    "difficulty": "Medium",
    "order": 13,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-substring-without-duplicates/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-repeating-character-replacement",
    "title": "Longest Repeating Character Replacement",
    "category": "Sliding Window",
    "difficulty": "Medium",
    "order": 14,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-repeating-substring-with-replacement/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "category": "Sliding Window",
    "difficulty": "Hard",
    "order": 15,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
    "neetcodeUrl": "https://neetcode.io/problems/minimum-window-with-characters/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "valid-parentheses",
    "title": "Valid Parentheses",
    "category": "Stack",
    "difficulty": "Easy",
    "order": 16,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
    "neetcodeUrl": "https://neetcode.io/problems/validate-parentheses/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum In Rotated Sorted Array",
    "category": "Binary Search",
    "difficulty": "Medium",
    "order": 17,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "neetcodeUrl": "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "search-in-rotated-sorted-array",
    "title": "Search In Rotated Sorted Array",
    "category": "Binary Search",
    "difficulty": "Medium",
    "order": 18,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "neetcodeUrl": "https://neetcode.io/problems/find-target-in-rotated-sorted-array/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "reverse-linked-list",
    "title": "Reverse Linked List",
    "category": "Linked List",
    "difficulty": "Easy",
    "order": 19,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
    "neetcodeUrl": "https://neetcode.io/problems/reverse-a-linked-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "category": "Linked List",
    "difficulty": "Easy",
    "order": 20,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "neetcodeUrl": "https://neetcode.io/problems/merge-two-sorted-linked-lists/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "linked-list-cycle",
    "title": "Linked List Cycle",
    "category": "Linked List",
    "difficulty": "Easy",
    "order": 21,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/",
    "neetcodeUrl": "https://neetcode.io/problems/linked-list-cycle-detection/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "reorder-list",
    "title": "Reorder List",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 22,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/reorder-list/",
    "neetcodeUrl": "https://neetcode.io/problems/reorder-linked-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "remove-nth-node-from-end-of-list",
    "title": "Remove Nth Node From End of List",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 23,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "neetcodeUrl": "https://neetcode.io/problems/remove-node-from-end-of-linked-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "merge-k-sorted-lists",
    "title": "Merge K Sorted Lists",
    "category": "Linked List",
    "difficulty": "Hard",
    "order": 24,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "neetcodeUrl": "https://neetcode.io/problems/merge-k-sorted-linked-lists/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "invert-binary-tree",
    "title": "Invert Binary Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 25,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/invert-a-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "maximum-depth-of-binary-tree",
    "title": "Maximum Depth of Binary Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 26,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/depth-of-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "same-tree",
    "title": "Same Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 27,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/same-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/same-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "subtree-of-another-tree",
    "title": "Subtree of Another Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 28,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/subtree-of-another-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/subtree-of-a-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "lowest-common-ancestor-of-a-binary-search-tree",
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 29,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 30,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "neetcodeUrl": "https://neetcode.io/problems/level-order-traversal-of-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 31,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/valid-binary-search-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element In a Bst",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 32,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "neetcodeUrl": "https://neetcode.io/problems/kth-smallest-integer-in-bst/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "title": "Construct Binary Tree From Preorder And Inorder Traversal",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 33,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "neetcodeUrl": "https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "binary-tree-maximum-path-sum",
    "title": "Binary Tree Maximum Path Sum",
    "category": "Trees",
    "difficulty": "Hard",
    "order": 34,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/binary-tree-maximum-path-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "serialize-and-deserialize-binary-tree",
    "title": "Serialize And Deserialize Binary Tree",
    "category": "Trees",
    "difficulty": "Hard",
    "order": 35,
    "topicOrder": 11,
    "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/serialize-and-deserialize-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "find-median-from-data-stream",
    "title": "Find Median From Data Stream",
    "category": "Heap / Priority Queue",
    "difficulty": "Hard",
    "order": 36,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
    "neetcodeUrl": "https://neetcode.io/problems/find-median-in-a-data-stream/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "combination-sum",
    "title": "Combination Sum",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 37,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/combination-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/combination-target-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "word-search",
    "title": "Word Search",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 38,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/word-search/",
    "neetcodeUrl": "https://neetcode.io/problems/search-for-word/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "implement-trie-prefix-tree",
    "title": "Implement Trie Prefix Tree",
    "category": "Tries",
    "difficulty": "Medium",
    "order": 39,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/implement-prefix-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "design-add-and-search-words-data-structure",
    "title": "Design Add And Search Words Data Structure",
    "category": "Tries",
    "difficulty": "Medium",
    "order": 40,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    "neetcodeUrl": "https://neetcode.io/problems/design-word-search-data-structure/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "word-search-ii",
    "title": "Word Search II",
    "category": "Tries",
    "difficulty": "Hard",
    "order": 41,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/word-search-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/search-for-word-ii/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "number-of-islands",
    "title": "Number of Islands",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 42,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/number-of-islands/",
    "neetcodeUrl": "https://neetcode.io/problems/count-number-of-islands/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "clone-graph",
    "title": "Clone Graph",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 43,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/clone-graph/",
    "neetcodeUrl": "https://neetcode.io/problems/clone-graph/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 44,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "neetcodeUrl": "https://neetcode.io/problems/pacific-atlantic-water-flow/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "course-schedule",
    "title": "Course Schedule",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 45,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
    "neetcodeUrl": "https://neetcode.io/problems/course-schedule/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "graph-valid-tree",
    "title": "Graph Valid Tree",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 46,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/graph-valid-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/valid-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "number-of-connected-components-in-an-undirected-graph",
    "title": "Number of Connected Components In An Undirected Graph",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 47,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "neetcodeUrl": "https://neetcode.io/problems/count-connected-components/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "alien-dictionary",
    "title": "Alien Dictionary",
    "category": "Advanced Graphs",
    "difficulty": "Hard",
    "order": 48,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
    "neetcodeUrl": "https://neetcode.io/problems/foreign-dictionary/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "climbing-stairs",
    "title": "Climbing Stairs",
    "category": "1-D Dynamic Programming",
    "difficulty": "Easy",
    "order": 49,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
    "neetcodeUrl": "https://neetcode.io/problems/climbing-stairs/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "house-robber",
    "title": "House Robber",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 50,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
    "neetcodeUrl": "https://neetcode.io/problems/house-robber/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "house-robber-ii",
    "title": "House Robber II",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 51,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/house-robber-ii/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 52,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-palindromic-substring/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "palindromic-substrings",
    "title": "Palindromic Substrings",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 53,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/palindromic-substrings/",
    "neetcodeUrl": "https://neetcode.io/problems/palindromic-substrings/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "decode-ways",
    "title": "Decode Ways",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 54,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/decode-ways/",
    "neetcodeUrl": "https://neetcode.io/problems/decode-ways/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "coin-change",
    "title": "Coin Change",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 55,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
    "neetcodeUrl": "https://neetcode.io/problems/coin-change/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 56,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray/",
    "neetcodeUrl": "https://neetcode.io/problems/maximum-product-subarray/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "word-break",
    "title": "Word Break",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 57,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/word-break/",
    "neetcodeUrl": "https://neetcode.io/problems/word-break/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 58,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-increasing-subsequence/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "unique-paths",
    "title": "Unique Paths",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 59,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
    "neetcodeUrl": "https://neetcode.io/problems/count-paths/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-common-subsequence",
    "title": "Longest Common Subsequence",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 60,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-common-subsequence/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "maximum-subarray",
    "title": "Maximum Subarray",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 61,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
    "neetcodeUrl": "https://neetcode.io/problems/maximum-subarray/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "jump-game",
    "title": "Jump Game",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 62,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/jump-game/",
    "neetcodeUrl": "https://neetcode.io/problems/jump-game/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "insert-interval",
    "title": "Insert Interval",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 63,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/insert-interval/",
    "neetcodeUrl": "https://neetcode.io/problems/insert-new-interval/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "merge-intervals",
    "title": "Merge Intervals",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 64,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
    "neetcodeUrl": "https://neetcode.io/problems/merge-intervals/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "non-overlapping-intervals",
    "title": "Non Overlapping Intervals",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 65,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
    "neetcodeUrl": "https://neetcode.io/problems/non-overlapping-intervals/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "meeting-rooms",
    "title": "Meeting Rooms",
    "category": "Intervals",
    "difficulty": "Easy",
    "order": 66,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms/",
    "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "meeting-rooms-ii",
    "title": "Meeting Rooms II",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 67,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule-ii/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "rotate-image",
    "title": "Rotate Image",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 68,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/rotate-image/",
    "neetcodeUrl": "https://neetcode.io/problems/rotate-matrix/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "spiral-matrix",
    "title": "Spiral Matrix",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 69,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/spiral-matrix/",
    "neetcodeUrl": "https://neetcode.io/problems/spiral-matrix/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 70,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/set-matrix-zeroes/",
    "neetcodeUrl": "https://neetcode.io/problems/set-zeroes-in-matrix/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 71,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/number-of-1-bits/",
    "neetcodeUrl": "https://neetcode.io/problems/number-of-one-bits/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "counting-bits",
    "title": "Counting Bits",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 72,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/counting-bits/",
    "neetcodeUrl": "https://neetcode.io/problems/counting-bits/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "reverse-bits",
    "title": "Reverse Bits",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 73,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/reverse-bits/",
    "neetcodeUrl": "https://neetcode.io/problems/reverse-bits/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "missing-number",
    "title": "Missing Number",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 74,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/missing-number/",
    "neetcodeUrl": "https://neetcode.io/problems/missing-number/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "sum-of-two-integers",
    "title": "Sum of Two Integers",
    "category": "Bit Manipulation",
    "difficulty": "Medium",
    "order": 75,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/sum-of-two-integers/",
    "neetcodeUrl": "https://neetcode.io/problems/sum-of-two-integers/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  }
];

export const NEETCODE_150_PROBLEMS: DsaProblem[] = [
  {
    "id": "contains-duplicate",
    "title": "Contains Duplicate",
    "category": "Arrays & Hashing",
    "difficulty": "Easy",
    "order": 1,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/",
    "neetcodeUrl": "https://neetcode.io/problems/duplicate-integer/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "valid-anagram",
    "title": "Valid Anagram",
    "category": "Arrays & Hashing",
    "difficulty": "Easy",
    "order": 2,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/valid-anagram/",
    "neetcodeUrl": "https://neetcode.io/problems/is-anagram/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "two-sum",
    "title": "Two Sum",
    "category": "Arrays & Hashing",
    "difficulty": "Easy",
    "order": 3,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/two-integer-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "group-anagrams",
    "title": "Group Anagrams",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 4,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/group-anagrams/",
    "neetcodeUrl": "https://neetcode.io/problems/anagram-groups/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 5,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
    "neetcodeUrl": "https://neetcode.io/problems/top-k-elements-in-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "encode-and-decode-strings",
    "title": "Encode and Decode Strings",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 6,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/encode-and-decode-strings/",
    "neetcodeUrl": "https://neetcode.io/problems/string-encode-and-decode/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 7,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
    "neetcodeUrl": "https://neetcode.io/problems/products-of-array-discluding-self/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "valid-sudoku",
    "title": "Valid Sudoku",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 8,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/valid-sudoku/",
    "neetcodeUrl": "https://neetcode.io/problems/valid-sudoku/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence",
    "category": "Arrays & Hashing",
    "difficulty": "Medium",
    "order": 9,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-consecutive-sequence/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "valid-palindrome",
    "title": "Valid Palindrome",
    "category": "Two Pointers",
    "difficulty": "Easy",
    "order": 10,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome/",
    "neetcodeUrl": "https://neetcode.io/problems/is-palindrome/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "two-sum-ii-input-array-is-sorted",
    "title": "Two Sum II Input Array Is Sorted",
    "category": "Two Pointers",
    "difficulty": "Medium",
    "order": 11,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "neetcodeUrl": "https://neetcode.io/problems/two-integer-sum-ii/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "3sum",
    "title": "3Sum",
    "category": "Two Pointers",
    "difficulty": "Medium",
    "order": 12,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/3sum/",
    "neetcodeUrl": "https://neetcode.io/problems/three-integer-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "container-with-most-water",
    "title": "Container With Most Water",
    "category": "Two Pointers",
    "difficulty": "Medium",
    "order": 13,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
    "neetcodeUrl": "https://neetcode.io/problems/max-water-container/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "category": "Two Pointers",
    "difficulty": "Hard",
    "order": 14,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/trapping-rain-water/",
    "neetcodeUrl": "https://neetcode.io/problems/trapping-rain-water/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy And Sell Stock",
    "category": "Sliding Window",
    "difficulty": "Easy",
    "order": 15,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "neetcodeUrl": "https://neetcode.io/problems/buy-and-sell-crypto/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "category": "Sliding Window",
    "difficulty": "Medium",
    "order": 16,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-substring-without-duplicates/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-repeating-character-replacement",
    "title": "Longest Repeating Character Replacement",
    "category": "Sliding Window",
    "difficulty": "Medium",
    "order": 17,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-repeating-substring-with-replacement/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "permutation-in-string",
    "title": "Permutation In String",
    "category": "Sliding Window",
    "difficulty": "Medium",
    "order": 18,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/permutation-in-string/",
    "neetcodeUrl": "https://neetcode.io/problems/permutation-string/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "category": "Sliding Window",
    "difficulty": "Hard",
    "order": 19,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
    "neetcodeUrl": "https://neetcode.io/problems/minimum-window-with-characters/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "sliding-window-maximum",
    "title": "Sliding Window Maximum",
    "category": "Sliding Window",
    "difficulty": "Hard",
    "order": 20,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/sliding-window-maximum/",
    "neetcodeUrl": "https://neetcode.io/problems/sliding-window-maximum/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "valid-parentheses",
    "title": "Valid Parentheses",
    "category": "Stack",
    "difficulty": "Easy",
    "order": 21,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
    "neetcodeUrl": "https://neetcode.io/problems/validate-parentheses/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "min-stack",
    "title": "Min Stack",
    "category": "Stack",
    "difficulty": "Medium",
    "order": 22,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/min-stack/",
    "neetcodeUrl": "https://neetcode.io/problems/minimum-stack/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "evaluate-reverse-polish-notation",
    "title": "Evaluate Reverse Polish Notation",
    "category": "Stack",
    "difficulty": "Medium",
    "order": 23,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "neetcodeUrl": "https://neetcode.io/problems/evaluate-reverse-polish-notation/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "daily-temperatures",
    "title": "Daily Temperatures",
    "category": "Stack",
    "difficulty": "Medium",
    "order": 24,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/daily-temperatures/",
    "neetcodeUrl": "https://neetcode.io/problems/daily-temperatures/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "car-fleet",
    "title": "Car Fleet",
    "category": "Stack",
    "difficulty": "Medium",
    "order": 25,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/car-fleet/",
    "neetcodeUrl": "https://neetcode.io/problems/car-fleet/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "largest-rectangle-in-histogram",
    "title": "Largest Rectangle In Histogram",
    "category": "Stack",
    "difficulty": "Hard",
    "order": 26,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "neetcodeUrl": "https://neetcode.io/problems/largest-rectangle-in-histogram/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "binary-search",
    "title": "Binary Search",
    "category": "Binary Search",
    "difficulty": "Easy",
    "order": 27,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/binary-search/",
    "neetcodeUrl": "https://neetcode.io/problems/binary-search/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "search-a-2d-matrix",
    "title": "Search a 2D Matrix",
    "category": "Binary Search",
    "difficulty": "Medium",
    "order": 28,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix/",
    "neetcodeUrl": "https://neetcode.io/problems/search-2d-matrix/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "koko-eating-bananas",
    "title": "Koko Eating Bananas",
    "category": "Binary Search",
    "difficulty": "Medium",
    "order": 29,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/koko-eating-bananas/",
    "neetcodeUrl": "https://neetcode.io/problems/eating-bananas/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum In Rotated Sorted Array",
    "category": "Binary Search",
    "difficulty": "Medium",
    "order": 30,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "neetcodeUrl": "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "search-in-rotated-sorted-array",
    "title": "Search In Rotated Sorted Array",
    "category": "Binary Search",
    "difficulty": "Medium",
    "order": 31,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "neetcodeUrl": "https://neetcode.io/problems/find-target-in-rotated-sorted-array/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "time-based-key-value-store",
    "title": "Time Based Key Value Store",
    "category": "Binary Search",
    "difficulty": "Medium",
    "order": 32,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/time-based-key-value-store/",
    "neetcodeUrl": "https://neetcode.io/problems/time-based-key-value-store/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "category": "Binary Search",
    "difficulty": "Hard",
    "order": 33,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "neetcodeUrl": "https://neetcode.io/problems/median-of-two-sorted-arrays/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "reverse-linked-list",
    "title": "Reverse Linked List",
    "category": "Linked List",
    "difficulty": "Easy",
    "order": 34,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
    "neetcodeUrl": "https://neetcode.io/problems/reverse-a-linked-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "category": "Linked List",
    "difficulty": "Easy",
    "order": 35,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "neetcodeUrl": "https://neetcode.io/problems/merge-two-sorted-linked-lists/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "linked-list-cycle",
    "title": "Linked List Cycle",
    "category": "Linked List",
    "difficulty": "Easy",
    "order": 36,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/",
    "neetcodeUrl": "https://neetcode.io/problems/linked-list-cycle-detection/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "reorder-list",
    "title": "Reorder List",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 37,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/reorder-list/",
    "neetcodeUrl": "https://neetcode.io/problems/reorder-linked-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "remove-nth-node-from-end-of-list",
    "title": "Remove Nth Node From End of List",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 38,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "neetcodeUrl": "https://neetcode.io/problems/remove-node-from-end-of-linked-list/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "copy-list-with-random-pointer",
    "title": "Copy List With Random Pointer",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 39,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/copy-list-with-random-pointer/",
    "neetcodeUrl": "https://neetcode.io/problems/copy-linked-list-with-random-pointer/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "add-two-numbers",
    "title": "Add Two Numbers",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 40,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/add-two-numbers/",
    "neetcodeUrl": "https://neetcode.io/problems/add-two-numbers/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "find-the-duplicate-number",
    "title": "Find The Duplicate Number",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 41,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/find-the-duplicate-number/",
    "neetcodeUrl": "https://neetcode.io/problems/find-duplicate-integer/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "lru-cache",
    "title": "LRU Cache",
    "category": "Linked List",
    "difficulty": "Medium",
    "order": 42,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/lru-cache/",
    "neetcodeUrl": "https://neetcode.io/problems/lru-cache/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "merge-k-sorted-lists",
    "title": "Merge K Sorted Lists",
    "category": "Linked List",
    "difficulty": "Hard",
    "order": 43,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "neetcodeUrl": "https://neetcode.io/problems/merge-k-sorted-linked-lists/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "reverse-nodes-in-k-group",
    "title": "Reverse Nodes In K Group",
    "category": "Linked List",
    "difficulty": "Hard",
    "order": 44,
    "topicOrder": 11,
    "leetcodeUrl": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "neetcodeUrl": "https://neetcode.io/problems/reverse-nodes-in-k-group/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "invert-binary-tree",
    "title": "Invert Binary Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 45,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/invert-a-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "maximum-depth-of-binary-tree",
    "title": "Maximum Depth of Binary Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 46,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/depth-of-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "diameter-of-binary-tree",
    "title": "Diameter of Binary Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 47,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/diameter-of-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/binary-tree-diameter/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "balanced-binary-tree",
    "title": "Balanced Binary Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 48,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/balanced-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/balanced-binary-tree/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "same-tree",
    "title": "Same Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 49,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/same-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/same-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "subtree-of-another-tree",
    "title": "Subtree of Another Tree",
    "category": "Trees",
    "difficulty": "Easy",
    "order": 50,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/subtree-of-another-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/subtree-of-a-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "lowest-common-ancestor-of-a-binary-search-tree",
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 51,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 52,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "neetcodeUrl": "https://neetcode.io/problems/level-order-traversal-of-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "binary-tree-right-side-view",
    "title": "Binary Tree Right Side View",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 53,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/binary-tree-right-side-view/",
    "neetcodeUrl": "https://neetcode.io/problems/binary-tree-right-side-view/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "count-good-nodes-in-binary-tree",
    "title": "Count Good Nodes In Binary Tree",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 54,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/count-good-nodes-in-binary-tree/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 55,
    "topicOrder": 11,
    "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/valid-binary-search-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element In a Bst",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 56,
    "topicOrder": 12,
    "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "neetcodeUrl": "https://neetcode.io/problems/kth-smallest-integer-in-bst/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "title": "Construct Binary Tree From Preorder And Inorder Traversal",
    "category": "Trees",
    "difficulty": "Medium",
    "order": 57,
    "topicOrder": 13,
    "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "neetcodeUrl": "https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "binary-tree-maximum-path-sum",
    "title": "Binary Tree Maximum Path Sum",
    "category": "Trees",
    "difficulty": "Hard",
    "order": 58,
    "topicOrder": 14,
    "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/binary-tree-maximum-path-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "serialize-and-deserialize-binary-tree",
    "title": "Serialize And Deserialize Binary Tree",
    "category": "Trees",
    "difficulty": "Hard",
    "order": 59,
    "topicOrder": 15,
    "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/serialize-and-deserialize-binary-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "kth-largest-element-in-a-stream",
    "title": "Kth Largest Element In a Stream",
    "category": "Heap / Priority Queue",
    "difficulty": "Easy",
    "order": 60,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    "neetcodeUrl": "https://neetcode.io/problems/kth-largest-integer-in-a-stream/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "last-stone-weight",
    "title": "Last Stone Weight",
    "category": "Heap / Priority Queue",
    "difficulty": "Easy",
    "order": 61,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/last-stone-weight/",
    "neetcodeUrl": "https://neetcode.io/problems/last-stone-weight/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "k-closest-points-to-origin",
    "title": "K Closest Points to Origin",
    "category": "Heap / Priority Queue",
    "difficulty": "Medium",
    "order": 62,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/k-closest-points-to-origin/",
    "neetcodeUrl": "https://neetcode.io/problems/k-closest-points-to-origin/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "kth-largest-element-in-an-array",
    "title": "Kth Largest Element In An Array",
    "category": "Heap / Priority Queue",
    "difficulty": "Medium",
    "order": 63,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "neetcodeUrl": "https://neetcode.io/problems/kth-largest-element-in-an-array/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "task-scheduler",
    "title": "Task Scheduler",
    "category": "Heap / Priority Queue",
    "difficulty": "Medium",
    "order": 64,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/task-scheduler/",
    "neetcodeUrl": "https://neetcode.io/problems/task-scheduling/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "design-twitter",
    "title": "Design Twitter",
    "category": "Heap / Priority Queue",
    "difficulty": "Medium",
    "order": 65,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/design-twitter/",
    "neetcodeUrl": "https://neetcode.io/problems/design-twitter-feed/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "find-median-from-data-stream",
    "title": "Find Median From Data Stream",
    "category": "Heap / Priority Queue",
    "difficulty": "Hard",
    "order": 66,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
    "neetcodeUrl": "https://neetcode.io/problems/find-median-in-a-data-stream/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "subsets",
    "title": "Subsets",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 67,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/subsets/",
    "neetcodeUrl": "https://neetcode.io/problems/subsets/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "combination-sum",
    "title": "Combination Sum",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 68,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/combination-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/combination-target-sum/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "combination-sum-ii",
    "title": "Combination Sum II",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 69,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/combination-sum-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/combination-target-sum-ii/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "permutations",
    "title": "Permutations",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 70,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/permutations/",
    "neetcodeUrl": "https://neetcode.io/problems/permutations/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "subsets-ii",
    "title": "Subsets II",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 71,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/subsets-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/subsets-ii/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "generate-parentheses",
    "title": "Generate Parentheses",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 72,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/generate-parentheses/",
    "neetcodeUrl": "https://neetcode.io/problems/generate-parentheses/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "word-search",
    "title": "Word Search",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 73,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/word-search/",
    "neetcodeUrl": "https://neetcode.io/problems/search-for-word/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "palindrome-partitioning",
    "title": "Palindrome Partitioning",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 74,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning/",
    "neetcodeUrl": "https://neetcode.io/problems/palindrome-partitioning/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "letter-combinations-of-a-phone-number",
    "title": "Letter Combinations of a Phone Number",
    "category": "Backtracking",
    "difficulty": "Medium",
    "order": 75,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "neetcodeUrl": "https://neetcode.io/problems/combinations-of-a-phone-number/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "n-queens",
    "title": "N Queens",
    "category": "Backtracking",
    "difficulty": "Hard",
    "order": 76,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/n-queens/",
    "neetcodeUrl": "https://neetcode.io/problems/n-queens/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "implement-trie-prefix-tree",
    "title": "Implement Trie Prefix Tree",
    "category": "Tries",
    "difficulty": "Medium",
    "order": 77,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/implement-prefix-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "design-add-and-search-words-data-structure",
    "title": "Design Add And Search Words Data Structure",
    "category": "Tries",
    "difficulty": "Medium",
    "order": 78,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    "neetcodeUrl": "https://neetcode.io/problems/design-word-search-data-structure/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "word-search-ii",
    "title": "Word Search II",
    "category": "Tries",
    "difficulty": "Hard",
    "order": 79,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/word-search-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/search-for-word-ii/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "number-of-islands",
    "title": "Number of Islands",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 80,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/number-of-islands/",
    "neetcodeUrl": "https://neetcode.io/problems/count-number-of-islands/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "max-area-of-island",
    "title": "Max Area of Island",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 81,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/max-area-of-island/",
    "neetcodeUrl": "https://neetcode.io/problems/max-area-of-island/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "clone-graph",
    "title": "Clone Graph",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 82,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/clone-graph/",
    "neetcodeUrl": "https://neetcode.io/problems/clone-graph/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "walls-and-gates",
    "title": "Walls And Gates",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 83,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/walls-and-gates/",
    "neetcodeUrl": "https://neetcode.io/problems/islands-and-treasure/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "rotting-oranges",
    "title": "Rotting Oranges",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 84,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/rotting-oranges/",
    "neetcodeUrl": "https://neetcode.io/problems/rotting-fruit/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 85,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "neetcodeUrl": "https://neetcode.io/problems/pacific-atlantic-water-flow/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "surrounded-regions",
    "title": "Surrounded Regions",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 86,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/surrounded-regions/",
    "neetcodeUrl": "https://neetcode.io/problems/surrounded-regions/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "course-schedule",
    "title": "Course Schedule",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 87,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
    "neetcodeUrl": "https://neetcode.io/problems/course-schedule/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "course-schedule-ii",
    "title": "Course Schedule II",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 88,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/course-schedule-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/course-schedule-ii/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "graph-valid-tree",
    "title": "Graph Valid Tree",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 89,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/graph-valid-tree/",
    "neetcodeUrl": "https://neetcode.io/problems/valid-tree/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "number-of-connected-components-in-an-undirected-graph",
    "title": "Number of Connected Components In An Undirected Graph",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 90,
    "topicOrder": 11,
    "leetcodeUrl": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "neetcodeUrl": "https://neetcode.io/problems/count-connected-components/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "redundant-connection",
    "title": "Redundant Connection",
    "category": "Graphs",
    "difficulty": "Medium",
    "order": 91,
    "topicOrder": 12,
    "leetcodeUrl": "https://leetcode.com/problems/redundant-connection/",
    "neetcodeUrl": "https://neetcode.io/problems/redundant-connection/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "word-ladder",
    "title": "Word Ladder",
    "category": "Graphs",
    "difficulty": "Hard",
    "order": 92,
    "topicOrder": 13,
    "leetcodeUrl": "https://leetcode.com/problems/word-ladder/",
    "neetcodeUrl": "https://neetcode.io/problems/word-ladder/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "network-delay-time",
    "title": "Network Delay Time",
    "category": "Advanced Graphs",
    "difficulty": "Medium",
    "order": 93,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/network-delay-time/",
    "neetcodeUrl": "https://neetcode.io/problems/network-delay-time/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "reconstruct-itinerary",
    "title": "Reconstruct Itinerary",
    "category": "Advanced Graphs",
    "difficulty": "Hard",
    "order": 94,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/reconstruct-itinerary/",
    "neetcodeUrl": "https://neetcode.io/problems/reconstruct-flight-path/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "min-cost-to-connect-all-points",
    "title": "Min Cost to Connect All Points",
    "category": "Advanced Graphs",
    "difficulty": "Medium",
    "order": 95,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
    "neetcodeUrl": "https://neetcode.io/problems/min-cost-to-connect-points/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "swim-in-rising-water",
    "title": "Swim In Rising Water",
    "category": "Advanced Graphs",
    "difficulty": "Hard",
    "order": 96,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/swim-in-rising-water/",
    "neetcodeUrl": "https://neetcode.io/problems/swim-in-rising-water/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "alien-dictionary",
    "title": "Alien Dictionary",
    "category": "Advanced Graphs",
    "difficulty": "Hard",
    "order": 97,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
    "neetcodeUrl": "https://neetcode.io/problems/foreign-dictionary/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "cheapest-flights-within-k-stops",
    "title": "Cheapest Flights Within K Stops",
    "category": "Advanced Graphs",
    "difficulty": "Medium",
    "order": 98,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "neetcodeUrl": "https://neetcode.io/problems/cheapest-flight-path/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "climbing-stairs",
    "title": "Climbing Stairs",
    "category": "1-D Dynamic Programming",
    "difficulty": "Easy",
    "order": 99,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
    "neetcodeUrl": "https://neetcode.io/problems/climbing-stairs/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "min-cost-climbing-stairs",
    "title": "Min Cost Climbing Stairs",
    "category": "1-D Dynamic Programming",
    "difficulty": "Easy",
    "order": 100,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/min-cost-climbing-stairs/",
    "neetcodeUrl": "https://neetcode.io/problems/min-cost-climbing-stairs/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "house-robber",
    "title": "House Robber",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 101,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
    "neetcodeUrl": "https://neetcode.io/problems/house-robber/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "house-robber-ii",
    "title": "House Robber II",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 102,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/house-robber-ii/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 103,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-palindromic-substring/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "palindromic-substrings",
    "title": "Palindromic Substrings",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 104,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/palindromic-substrings/",
    "neetcodeUrl": "https://neetcode.io/problems/palindromic-substrings/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "decode-ways",
    "title": "Decode Ways",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 105,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/decode-ways/",
    "neetcodeUrl": "https://neetcode.io/problems/decode-ways/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "coin-change",
    "title": "Coin Change",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 106,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
    "neetcodeUrl": "https://neetcode.io/problems/coin-change/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 107,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray/",
    "neetcodeUrl": "https://neetcode.io/problems/maximum-product-subarray/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "word-break",
    "title": "Word Break",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 108,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/word-break/",
    "neetcodeUrl": "https://neetcode.io/problems/word-break/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 109,
    "topicOrder": 11,
    "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-increasing-subsequence/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "partition-equal-subset-sum",
    "title": "Partition Equal Subset Sum",
    "category": "1-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 110,
    "topicOrder": 12,
    "leetcodeUrl": "https://leetcode.com/problems/partition-equal-subset-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/partition-equal-subset-sum/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "unique-paths",
    "title": "Unique Paths",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 111,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
    "neetcodeUrl": "https://neetcode.io/problems/count-paths/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "longest-common-subsequence",
    "title": "Longest Common Subsequence",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 112,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-common-subsequence/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "best-time-to-buy-and-sell-stock-with-cooldown",
    "title": "Best Time to Buy And Sell Stock With Cooldown",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 113,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    "neetcodeUrl": "https://neetcode.io/problems/buy-and-sell-crypto-with-cooldown/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "coin-change-ii",
    "title": "Coin Change II",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 114,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/coin-change-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/coin-change-ii/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "target-sum",
    "title": "Target Sum",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 115,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/target-sum/",
    "neetcodeUrl": "https://neetcode.io/problems/target-sum/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "interleaving-string",
    "title": "Interleaving String",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 116,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/interleaving-string/",
    "neetcodeUrl": "https://neetcode.io/problems/interleaving-string/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "longest-increasing-path-in-a-matrix",
    "title": "Longest Increasing Path In a Matrix",
    "category": "2-D Dynamic Programming",
    "difficulty": "Hard",
    "order": 117,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
    "neetcodeUrl": "https://neetcode.io/problems/longest-increasing-path-in-matrix/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "distinct-subsequences",
    "title": "Distinct Subsequences",
    "category": "2-D Dynamic Programming",
    "difficulty": "Hard",
    "order": 118,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/distinct-subsequences/",
    "neetcodeUrl": "https://neetcode.io/problems/count-subsequences/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "edit-distance",
    "title": "Edit Distance",
    "category": "2-D Dynamic Programming",
    "difficulty": "Medium",
    "order": 119,
    "topicOrder": 9,
    "leetcodeUrl": "https://leetcode.com/problems/edit-distance/",
    "neetcodeUrl": "https://neetcode.io/problems/edit-distance/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "burst-balloons",
    "title": "Burst Balloons",
    "category": "2-D Dynamic Programming",
    "difficulty": "Hard",
    "order": 120,
    "topicOrder": 10,
    "leetcodeUrl": "https://leetcode.com/problems/burst-balloons/",
    "neetcodeUrl": "https://neetcode.io/problems/burst-balloons/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "regular-expression-matching",
    "title": "Regular Expression Matching",
    "category": "2-D Dynamic Programming",
    "difficulty": "Hard",
    "order": 121,
    "topicOrder": 11,
    "leetcodeUrl": "https://leetcode.com/problems/regular-expression-matching/",
    "neetcodeUrl": "https://neetcode.io/problems/regular-expression-matching/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "maximum-subarray",
    "title": "Maximum Subarray",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 122,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
    "neetcodeUrl": "https://neetcode.io/problems/maximum-subarray/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "jump-game",
    "title": "Jump Game",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 123,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/jump-game/",
    "neetcodeUrl": "https://neetcode.io/problems/jump-game/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "jump-game-ii",
    "title": "Jump Game II",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 124,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/jump-game-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/jump-game-ii/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "gas-station",
    "title": "Gas Station",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 125,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/gas-station/",
    "neetcodeUrl": "https://neetcode.io/problems/gas-station/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "hand-of-straights",
    "title": "Hand of Straights",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 126,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/hand-of-straights/",
    "neetcodeUrl": "https://neetcode.io/problems/hand-of-straights/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "merge-triplets-to-form-target-triplet",
    "title": "Merge Triplets to Form Target Triplet",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 127,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
    "neetcodeUrl": "https://neetcode.io/problems/merge-triplets-to-form-target/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "partition-labels",
    "title": "Partition Labels",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 128,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/partition-labels/",
    "neetcodeUrl": "https://neetcode.io/problems/partition-labels/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "valid-parenthesis-string",
    "title": "Valid Parenthesis String",
    "category": "Greedy",
    "difficulty": "Medium",
    "order": 129,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/valid-parenthesis-string/",
    "neetcodeUrl": "https://neetcode.io/problems/valid-parenthesis-string/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "insert-interval",
    "title": "Insert Interval",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 130,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/insert-interval/",
    "neetcodeUrl": "https://neetcode.io/problems/insert-new-interval/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "merge-intervals",
    "title": "Merge Intervals",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 131,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
    "neetcodeUrl": "https://neetcode.io/problems/merge-intervals/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "non-overlapping-intervals",
    "title": "Non Overlapping Intervals",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 132,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
    "neetcodeUrl": "https://neetcode.io/problems/non-overlapping-intervals/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "meeting-rooms",
    "title": "Meeting Rooms",
    "category": "Intervals",
    "difficulty": "Easy",
    "order": 133,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms/",
    "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "meeting-rooms-ii",
    "title": "Meeting Rooms II",
    "category": "Intervals",
    "difficulty": "Medium",
    "order": 134,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
    "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule-ii/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "minimum-interval-to-include-each-query",
    "title": "Minimum Interval to Include Each Query",
    "category": "Intervals",
    "difficulty": "Hard",
    "order": 135,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
    "neetcodeUrl": "https://neetcode.io/problems/minimum-interval-including-query/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "rotate-image",
    "title": "Rotate Image",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 136,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/rotate-image/",
    "neetcodeUrl": "https://neetcode.io/problems/rotate-matrix/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "spiral-matrix",
    "title": "Spiral Matrix",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 137,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/spiral-matrix/",
    "neetcodeUrl": "https://neetcode.io/problems/spiral-matrix/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 138,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/set-matrix-zeroes/",
    "neetcodeUrl": "https://neetcode.io/problems/set-zeroes-in-matrix/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "happy-number",
    "title": "Happy Number",
    "category": "Math & Geometry",
    "difficulty": "Easy",
    "order": 139,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/happy-number/",
    "neetcodeUrl": "https://neetcode.io/problems/non-cyclical-number/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "plus-one",
    "title": "Plus One",
    "category": "Math & Geometry",
    "difficulty": "Easy",
    "order": 140,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/plus-one/",
    "neetcodeUrl": "https://neetcode.io/problems/plus-one/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "powx-n",
    "title": "Pow(x, n)",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 141,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/powx-n/",
    "neetcodeUrl": "https://neetcode.io/problems/pow-x-n/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "multiply-strings",
    "title": "Multiply Strings",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 142,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/multiply-strings/",
    "neetcodeUrl": "https://neetcode.io/problems/multiply-strings/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "detect-squares",
    "title": "Detect Squares",
    "category": "Math & Geometry",
    "difficulty": "Medium",
    "order": 143,
    "topicOrder": 8,
    "leetcodeUrl": "https://leetcode.com/problems/detect-squares/",
    "neetcodeUrl": "https://neetcode.io/problems/count-squares/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "single-number",
    "title": "Single Number",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 144,
    "topicOrder": 1,
    "leetcodeUrl": "https://leetcode.com/problems/single-number/",
    "neetcodeUrl": "https://neetcode.io/problems/single-number/",
    "roadmaps": [
      "neetcode150"
    ]
  },
  {
    "id": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 145,
    "topicOrder": 2,
    "leetcodeUrl": "https://leetcode.com/problems/number-of-1-bits/",
    "neetcodeUrl": "https://neetcode.io/problems/number-of-one-bits/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "counting-bits",
    "title": "Counting Bits",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 146,
    "topicOrder": 3,
    "leetcodeUrl": "https://leetcode.com/problems/counting-bits/",
    "neetcodeUrl": "https://neetcode.io/problems/counting-bits/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "reverse-bits",
    "title": "Reverse Bits",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 147,
    "topicOrder": 4,
    "leetcodeUrl": "https://leetcode.com/problems/reverse-bits/",
    "neetcodeUrl": "https://neetcode.io/problems/reverse-bits/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "missing-number",
    "title": "Missing Number",
    "category": "Bit Manipulation",
    "difficulty": "Easy",
    "order": 148,
    "topicOrder": 5,
    "leetcodeUrl": "https://leetcode.com/problems/missing-number/",
    "neetcodeUrl": "https://neetcode.io/problems/missing-number/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "sum-of-two-integers",
    "title": "Sum of Two Integers",
    "category": "Bit Manipulation",
    "difficulty": "Medium",
    "order": 149,
    "topicOrder": 6,
    "leetcodeUrl": "https://leetcode.com/problems/sum-of-two-integers/",
    "neetcodeUrl": "https://neetcode.io/problems/sum-of-two-integers/",
    "roadmaps": [
      "blind75",
      "neetcode150"
    ]
  },
  {
    "id": "reverse-integer",
    "title": "Reverse Integer",
    "category": "Bit Manipulation",
    "difficulty": "Medium",
    "order": 150,
    "topicOrder": 7,
    "leetcodeUrl": "https://leetcode.com/problems/reverse-integer/",
    "neetcodeUrl": "https://neetcode.io/problems/reverse-integer/",
    "roadmaps": [
      "neetcode150"
    ]
  }
];

export const BLIND_75_ROADMAP: DsaRoadmap = {
  id: "blind75",
  title: "Blind 75",
  shortTitle: "Blind 75",
  description: "The definitive 75 high-frequency coding interview questions curated for maximum pattern coverage.",
  badge: "🧠 Blind 75",
  totalCount: 75,
  categories: OFFICIAL_DSA_CATEGORIES,
  problems: BLIND_75_PROBLEMS
};

export const NEETCODE_150_ROADMAP: DsaRoadmap = {
  id: "neetcode150",
  title: "NeetCode 150",
  shortTitle: "NeetCode 150",
  description: "The complete 150-problem comprehensive roadmap spanning all 18 core technical interview patterns.",
  badge: "🚀 NeetCode 150",
  totalCount: 150,
  categories: OFFICIAL_DSA_CATEGORIES,
  problems: NEETCODE_150_PROBLEMS
};

export const DSA_ROADMAPS: Record<DsaRoadmapId, DsaRoadmap> = {
  blind75: BLIND_75_ROADMAP,
  neetcode150: NEETCODE_150_ROADMAP
};
