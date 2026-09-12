import { Problem } from '@/types/dsa';

export const INITIAL_PROBLEMS: Problem[] = [
  // ==========================================
  // 1. ARRAYS & HASHING (9 Problems)
  // ==========================================
  { id: '217', number: 217, title: 'Contains Duplicate', titleSlug: 'contains-duplicate', difficulty: 'Easy', topics: ['Array', 'Hash Table', 'Sorting'], solved: false, sheetName: 'Blind 75' },
  { id: '242', number: 242, title: 'Valid Anagram', titleSlug: 'valid-anagram', difficulty: 'Easy', topics: ['String', 'Hash Table', 'Sorting'], solved: false, sheetName: 'Blind 75' },
  { id: '1', number: 1, title: 'Two Sum', titleSlug: 'two-sum', difficulty: 'Easy', topics: ['Array', 'Hash Table'], solved: false, sheetName: 'Blind 75' },
  { id: '49', number: 49, title: 'Group Anagrams', titleSlug: 'group-anagrams', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'String'], solved: false, sheetName: 'Blind 75' },
  { id: '347', number: 347, title: 'Top K Frequent Elements', titleSlug: 'top-k-frequent-elements', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'Heap (Priority Queue)'], solved: false, sheetName: 'Blind 75' },
  { id: '238', number: 238, title: 'Product of Array Except Self', titleSlug: 'product-of-array-except-self', difficulty: 'Medium', topics: ['Array', 'Prefix Sum'], solved: false, sheetName: 'Blind 75' },
  { id: '36', number: 36, title: 'Valid Sudoku', titleSlug: 'valid-sudoku', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'Matrix'], solved: false, sheetName: 'NeetCode 150' },
  { id: '271', number: 271, title: 'Encode and Decode Strings', titleSlug: 'encode-and-decode-strings', difficulty: 'Medium', topics: ['Array', 'String', 'Design'], solved: false, sheetName: 'Blind 75' },
  { id: '128', number: 128, title: 'Longest Consecutive Sequence', titleSlug: 'longest-consecutive-sequence', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'Union Find'], solved: false, sheetName: 'Blind 75' },

  // ==========================================
  // 2. TWO POINTERS (5 Problems)
  // ==========================================
  { id: '125', number: 125, title: 'Valid Palindrome', titleSlug: 'valid-palindrome', difficulty: 'Easy', topics: ['Two Pointers', 'String'], solved: false, sheetName: 'Blind 75' },
  { id: '167', number: 167, title: 'Two Sum II - Input Array Is Sorted', titleSlug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Medium', topics: ['Array', 'Two Pointers', 'Binary Search'], solved: false, sheetName: 'NeetCode 150' },
  { id: '15', number: 15, title: '3Sum', titleSlug: '3sum', difficulty: 'Medium', topics: ['Array', 'Two Pointers', 'Sorting'], solved: false, sheetName: 'Blind 75' },
  { id: '11', number: 11, title: 'Container With Most Water', titleSlug: 'container-with-most-water', difficulty: 'Medium', topics: ['Array', 'Two Pointers', 'Greedy'], solved: false, sheetName: 'Blind 75' },
  { id: '42', number: 42, title: 'Trapping Rain Water', titleSlug: 'trapping-rain-water', difficulty: 'Hard', topics: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'], solved: false, sheetName: 'Blind 75' },

  // ==========================================
  // 3. SLIDING WINDOW (6 Problems)
  // ==========================================
  { id: '121', number: 121, title: 'Best Time to Buy and Sell Stock', titleSlug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '3', number: 3, title: 'Longest Substring Without Repeating Characters', titleSlug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', topics: ['Hash Table', 'String', 'Sliding Window'], solved: false, sheetName: 'Blind 75' },
  { id: '424', number: 424, title: 'Longest Repeating Character Replacement', titleSlug: 'longest-repeating-character-replacement', difficulty: 'Medium', topics: ['Hash Table', 'String', 'Sliding Window'], solved: false, sheetName: 'Blind 75' },
  { id: '567', number: 567, title: 'Permutation in String', titleSlug: 'permutation-in-string', difficulty: 'Medium', topics: ['Hash Table', 'Two Pointers', 'String', 'Sliding Window'], solved: false, sheetName: 'NeetCode 150' },
  { id: '76', number: 76, title: 'Minimum Window Substring', titleSlug: 'minimum-window-substring', difficulty: 'Hard', topics: ['Hash Table', 'String', 'Sliding Window'], solved: false, sheetName: 'Blind 75' },
  { id: '239', number: 239, title: 'Sliding Window Maximum', titleSlug: 'sliding-window-maximum', difficulty: 'Hard', topics: ['Array', 'Queue', 'Sliding Window', 'Heap (Priority Queue)', 'Monotonic Queue'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 4. STACK (7 Problems)
  // ==========================================
  { id: '20', number: 20, title: 'Valid Parentheses', titleSlug: 'valid-parentheses', difficulty: 'Easy', topics: ['String', 'Stack'], solved: false, sheetName: 'Blind 75' },
  { id: '155', number: 155, title: 'Min Stack', titleSlug: 'min-stack', difficulty: 'Medium', topics: ['Stack', 'Design'], solved: false, sheetName: 'NeetCode 150' },
  { id: '150', number: 150, title: 'Evaluate Reverse Polish Notation', titleSlug: 'evaluate-reverse-polish-notation', difficulty: 'Medium', topics: ['Array', 'Math', 'Stack'], solved: false, sheetName: 'NeetCode 150' },
  { id: '22', number: 22, title: 'Generate Parentheses', titleSlug: 'generate-parentheses', difficulty: 'Medium', topics: ['String', 'Dynamic Programming', 'Backtracking'], solved: false, sheetName: 'NeetCode 150' },
  { id: '739', number: 739, title: 'Daily Temperatures', titleSlug: 'daily-temperatures', difficulty: 'Medium', topics: ['Array', 'Stack', 'Monotonic Stack'], solved: false, sheetName: 'NeetCode 150' },
  { id: '853', number: 853, title: 'Car Fleet', titleSlug: 'car-fleet', difficulty: 'Medium', topics: ['Array', 'Stack', 'Sorting', 'Monotonic Stack'], solved: false, sheetName: 'NeetCode 150' },
  { id: '84', number: 84, title: 'Largest Rectangle in Histogram', titleSlug: 'largest-rectangle-in-histogram', difficulty: 'Hard', topics: ['Array', 'Stack', 'Monotonic Stack'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 5. BINARY SEARCH (7 Problems)
  // ==========================================
  { id: '704', number: 704, title: 'Binary Search', titleSlug: 'binary-search', difficulty: 'Easy', topics: ['Array', 'Binary Search'], solved: false, sheetName: 'NeetCode 150' },
  { id: '74', number: 74, title: 'Search a 2D Matrix', titleSlug: 'search-a-2d-matrix', difficulty: 'Medium', topics: ['Array', 'Binary Search', 'Matrix'], solved: false, sheetName: 'NeetCode 150' },
  { id: '875', number: 875, title: 'Koko Eating Bananas', titleSlug: 'koko-eating-bananas', difficulty: 'Medium', topics: ['Array', 'Binary Search'], solved: false, sheetName: 'NeetCode 150' },
  { id: '153', number: 153, title: 'Find Minimum in Rotated Sorted Array', titleSlug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium', topics: ['Array', 'Binary Search'], solved: false, sheetName: 'Blind 75' },
  { id: '33', number: 33, title: 'Search in Rotated Sorted Array', titleSlug: 'search-in-rotated-sorted-array', difficulty: 'Medium', topics: ['Array', 'Binary Search'], solved: false, sheetName: 'Blind 75' },
  { id: '981', number: 981, title: 'Time Based Key-Value Store', titleSlug: 'time-based-key-value-store', difficulty: 'Medium', topics: ['Hash Table', 'String', 'Binary Search', 'Design'], solved: false, sheetName: 'NeetCode 150' },
  { id: '4', number: 4, title: 'Median of Two Sorted Arrays', titleSlug: 'median-of-two-sorted-arrays', difficulty: 'Hard', topics: ['Array', 'Binary Search', 'Divide and Conquer'], solved: false, sheetName: 'Blind 75' },

  // ==========================================
  // 6. LINKED LIST (11 Problems)
  // ==========================================
  { id: '206', number: 206, title: 'Reverse Linked List', titleSlug: 'reverse-linked-list', difficulty: 'Easy', topics: ['Linked List', 'Recursion'], solved: false, sheetName: 'Blind 75' },
  { id: '21', number: 21, title: 'Merge Two Sorted Lists', titleSlug: 'merge-two-sorted-lists', difficulty: 'Easy', topics: ['Linked List', 'Recursion'], solved: false, sheetName: 'Blind 75' },
  { id: '143', number: 143, title: 'Reorder List', titleSlug: 'reorder-list', difficulty: 'Medium', topics: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'], solved: false, sheetName: 'Blind 75' },
  { id: '19', number: 19, title: 'Remove Nth Node From End of List', titleSlug: 'remove-nth-node-from-end-of-list', difficulty: 'Medium', topics: ['Linked List', 'Two Pointers'], solved: false, sheetName: 'Blind 75' },
  { id: '138', number: 138, title: 'Copy List with Random Pointer', titleSlug: 'copy-list-with-random-pointer', difficulty: 'Medium', topics: ['Hash Table', 'Linked List'], solved: false, sheetName: 'NeetCode 150' },
  { id: '2', number: 2, title: 'Add Two Numbers', titleSlug: 'add-two-numbers', difficulty: 'Medium', topics: ['Linked List', 'Math', 'Recursion'], solved: false, sheetName: 'Blind 75' },
  { id: '141', number: 141, title: 'Linked List Cycle', titleSlug: 'linked-list-cycle', difficulty: 'Easy', topics: ['Hash Table', 'Linked List', 'Two Pointers'], solved: false, sheetName: 'Blind 75' },
  { id: '287', number: 287, title: 'Find the Duplicate Number', titleSlug: 'find-the-duplicate-number', difficulty: 'Medium', topics: ['Array', 'Two Pointers', 'Binary Search', 'Bit Manipulation'], solved: false, sheetName: 'NeetCode 150' },
  { id: '146', number: 146, title: 'LRU Cache', titleSlug: 'lru-cache', difficulty: 'Medium', topics: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'], solved: false, sheetName: 'NeetCode 150' },
  { id: '23', number: 23, title: 'Merge k Sorted Lists', titleSlug: 'merge-k-sorted-lists', difficulty: 'Hard', topics: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'], solved: false, sheetName: 'Blind 75' },
  { id: '25', number: 25, title: 'Reverse Nodes in k-Group', titleSlug: 'reverse-nodes-in-k-group', difficulty: 'Hard', topics: ['Linked List', 'Recursion'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 7. TREES (15 Problems)
  // ==========================================
  { id: '226', number: 226, title: 'Invert Binary Tree', titleSlug: 'invert-binary-tree', difficulty: 'Easy', topics: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '104', number: 104, title: 'Maximum Depth of Binary Tree', titleSlug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', topics: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '543', number: 543, title: 'Diameter of Binary Tree', titleSlug: 'diameter-of-binary-tree', difficulty: 'Easy', topics: ['Tree', 'Depth-First Search', 'Binary Tree'], solved: false, sheetName: 'NeetCode 150' },
  { id: '110', number: 110, title: 'Balanced Binary Tree', titleSlug: 'balanced-binary-tree', difficulty: 'Easy', topics: ['Tree', 'Depth-First Search', 'Binary Tree'], solved: false, sheetName: 'NeetCode 150' },
  { id: '100', number: 100, title: 'Same Tree', titleSlug: 'same-tree', difficulty: 'Easy', topics: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '572', number: 572, title: 'Subtree of Another Tree', titleSlug: 'subtree-of-another-tree', difficulty: 'Easy', topics: ['Tree', 'Depth-First Search', 'String Matching', 'Binary Tree', 'Hash Function'], solved: false, sheetName: 'Blind 75' },
  { id: '235', number: 235, title: 'Lowest Common Ancestor of a Binary Search Tree', titleSlug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Medium', topics: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '102', number: 102, title: 'Binary Tree Level Order Traversal', titleSlug: 'binary-tree-level-order-traversal', difficulty: 'Medium', topics: ['Tree', 'Breadth-First Search', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '199', number: 199, title: 'Binary Tree Right Side View', titleSlug: 'binary-tree-right-side-view', difficulty: 'Medium', topics: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'], solved: false, sheetName: 'NeetCode 150' },
  { id: '1448', number: 1448, title: 'Count Good Nodes in Binary Tree', titleSlug: 'count-good-nodes-in-binary-tree', difficulty: 'Medium', topics: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'], solved: false, sheetName: 'NeetCode 150' },
  { id: '98', number: 98, title: 'Validate Binary Search Tree', titleSlug: 'validate-binary-search-tree', difficulty: 'Medium', topics: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '230', number: 230, title: 'Kth Smallest Element in a BST', titleSlug: 'kth-smallest-element-in-a-bst', difficulty: 'Medium', topics: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '105', number: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', titleSlug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'Divide and Conquer', 'Tree', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '124', number: 124, title: 'Binary Tree Maximum Path Sum', titleSlug: 'binary-tree-maximum-path-sum', difficulty: 'Hard', topics: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },
  { id: '297', number: 297, title: 'Serialize and Deserialize Binary Tree', titleSlug: 'serialize-and-deserialize-binary-tree', difficulty: 'Hard', topics: ['String', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Design', 'Binary Tree'], solved: false, sheetName: 'Blind 75' },

  // ==========================================
  // 8. TRIES (3 Problems)
  // ==========================================
  { id: '208', number: 208, title: 'Implement Trie (Prefix Tree)', titleSlug: 'implement-trie-prefix-tree', difficulty: 'Medium', topics: ['Hash Table', 'String', 'Design', 'Trie'], solved: false, sheetName: 'Blind 75' },
  { id: '211', number: 211, title: 'Design Add and Search Words Data Structure', titleSlug: 'design-add-and-search-words-data-structure', difficulty: 'Medium', topics: ['String', 'Depth-First Search', 'Design', 'Trie'], solved: false, sheetName: 'Blind 75' },
  { id: '212', number: 212, title: 'Word Search II', titleSlug: 'word-search-ii', difficulty: 'Hard', topics: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'], solved: false, sheetName: 'Blind 75' },

  // ==========================================
  // 9. HEAP / PRIORITY QUEUE (7 Problems)
  // ==========================================
  { id: '703', number: 703, title: 'Kth Largest Element in a Stream', titleSlug: 'kth-largest-element-in-a-stream', difficulty: 'Easy', topics: ['Tree', 'Design', 'Binary Search Tree', 'Heap (Priority Queue)', 'Binary Tree', 'Data Stream'], solved: false, sheetName: 'NeetCode 150' },
  { id: '1046', number: 1046, title: 'Last Stone Weight', titleSlug: 'last-stone-weight', difficulty: 'Easy', topics: ['Array', 'Heap (Priority Queue)'], solved: false, sheetName: 'NeetCode 150' },
  { id: '973', number: 973, title: 'K Closest Points to Origin', titleSlug: 'k-closest-points-to-origin', difficulty: 'Medium', topics: ['Array', 'Math', 'Divide and Conquer', 'Geometry', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'], solved: false, sheetName: 'NeetCode 150' },
  { id: '215', number: 215, title: 'Kth Largest Element in an Array', titleSlug: 'kth-largest-element-in-an-array', difficulty: 'Medium', topics: ['Array', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'], solved: false, sheetName: 'NeetCode 150' },
  { id: '621', number: 621, title: 'Task Scheduler', titleSlug: 'task-scheduler', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'Greedy', 'Sorting', 'Heap (Priority Queue)', 'Counting'], solved: false, sheetName: 'NeetCode 150' },
  { id: '355', number: 355, title: 'Design Twitter', titleSlug: 'design-twitter', difficulty: 'Medium', topics: ['Hash Table', 'Linked List', 'Design', 'Heap (Priority Queue)'], solved: false, sheetName: 'NeetCode 150' },
  { id: '295', number: 295, title: 'Find Median from Data Stream', titleSlug: 'find-median-from-data-stream', difficulty: 'Hard', topics: ['Two Pointers', 'Design', 'Sorting', 'Heap (Priority Queue)', 'Data Stream'], solved: false, sheetName: 'Blind 75' },

  // ==========================================
  // 10. BACKTRACKING (9 Problems)
  // ==========================================
  { id: '78', number: 78, title: 'Subsets', titleSlug: 'subsets', difficulty: 'Medium', topics: ['Array', 'Backtracking', 'Bit Manipulation'], solved: false, sheetName: 'NeetCode 150' },
  { id: '39', number: 39, title: 'Combination Sum', titleSlug: 'combination-sum', difficulty: 'Medium', topics: ['Array', 'Backtracking'], solved: false, sheetName: 'Blind 75' },
  { id: '46', number: 46, title: 'Permutations', titleSlug: 'permutations', difficulty: 'Medium', topics: ['Array', 'Backtracking'], solved: false, sheetName: 'NeetCode 150' },
  { id: '90', number: 90, title: 'Subsets II', titleSlug: 'subsets-ii', difficulty: 'Medium', topics: ['Array', 'Backtracking', 'Bit Manipulation'], solved: false, sheetName: 'NeetCode 150' },
  { id: '40', number: 40, title: 'Combination Sum II', titleSlug: 'combination-sum-ii', difficulty: 'Medium', topics: ['Array', 'Backtracking'], solved: false, sheetName: 'NeetCode 150' },
  { id: '79', number: 79, title: 'Word Search', titleSlug: 'word-search', difficulty: 'Medium', topics: ['Array', 'String', 'Backtracking', 'Matrix'], solved: false, sheetName: 'Blind 75' },
  { id: '131', number: 131, title: 'Palindrome Partitioning', titleSlug: 'palindrome-partitioning', difficulty: 'Medium', topics: ['String', 'Dynamic Programming', 'Backtracking'], solved: false, sheetName: 'NeetCode 150' },
  { id: '17', number: 17, title: 'Letter Combinations of a Phone Number', titleSlug: 'letter-combinations-of-a-phone-number', difficulty: 'Medium', topics: ['Hash Table', 'String', 'Backtracking'], solved: false, sheetName: 'NeetCode 150' },
  { id: '51', number: 51, title: 'N-Queens', titleSlug: 'n-queens', difficulty: 'Hard', topics: ['Array', 'Backtracking'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 11. GRAPHS (13 Problems)
  // ==========================================
  { id: '200', number: 200, title: 'Number of Islands', titleSlug: 'number-of-islands', difficulty: 'Medium', topics: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'], solved: false, sheetName: 'Blind 75' },
  { id: '133', number: 133, title: 'Clone Graph', titleSlug: 'clone-graph', difficulty: 'Medium', topics: ['Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'], solved: false, sheetName: 'Blind 75' },
  { id: '695', number: 695, title: 'Max Area of Island', titleSlug: 'max-area-of-island', difficulty: 'Medium', topics: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'], solved: false, sheetName: 'NeetCode 150' },
  { id: '417', number: 417, title: 'Pacific Atlantic Water Flow', titleSlug: 'pacific-atlantic-water-flow', difficulty: 'Medium', topics: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'], solved: false, sheetName: 'Blind 75' },
  { id: '130', number: 130, title: 'Surrounded Regions', titleSlug: 'surrounded-regions', difficulty: 'Medium', topics: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'], solved: false, sheetName: 'NeetCode 150' },
  { id: '994', number: 994, title: 'Rotting Oranges', titleSlug: 'rotting-oranges', difficulty: 'Medium', topics: ['Array', 'Breadth-First Search', 'Matrix'], solved: false, sheetName: 'NeetCode 150' },
  { id: '286', number: 286, title: 'Walls and Gates', titleSlug: 'walls-and-gates', difficulty: 'Medium', topics: ['Array', 'Breadth-First Search', 'Matrix'], solved: false, sheetName: 'NeetCode 150' },
  { id: '207', number: 207, title: 'Course Schedule', titleSlug: 'course-schedule', difficulty: 'Medium', topics: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'], solved: false, sheetName: 'Blind 75' },
  { id: '210', number: 210, title: 'Course Schedule II', titleSlug: 'course-schedule-ii', difficulty: 'Medium', topics: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'], solved: false, sheetName: 'NeetCode 150' },
  { id: '684', number: 684, title: 'Redundant Connection', titleSlug: 'redundant-connection', difficulty: 'Medium', topics: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'], solved: false, sheetName: 'NeetCode 150' },
  { id: '323', number: 323, title: 'Number of Connected Components in an Undirected Graph', titleSlug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'Medium', topics: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'], solved: false, sheetName: 'Blind 75' },
  { id: '261', number: 261, title: 'Graph Valid Tree', titleSlug: 'graph-valid-tree', difficulty: 'Medium', topics: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'], solved: false, sheetName: 'Blind 75' },
  { id: '127', number: 127, title: 'Word Ladder', titleSlug: 'word-ladder', difficulty: 'Hard', topics: ['Hash Table', 'String', 'Breadth-First Search'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 12. 1-D DYNAMIC PROGRAMMING (12 Problems)
  // ==========================================
  { id: '70', number: 70, title: 'Climbing Stairs', titleSlug: 'climbing-stairs', difficulty: 'Easy', topics: ['Math', 'Dynamic Programming', 'Memoization'], solved: false, sheetName: 'Blind 75' },
  { id: '746', number: 746, title: 'Min Cost Climbing Stairs', titleSlug: 'min-cost-climbing-stairs', difficulty: 'Easy', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },
  { id: '198', number: 198, title: 'House Robber', titleSlug: 'house-robber', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '213', number: 213, title: 'House Robber II', titleSlug: 'house-robber-ii', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '5', number: 5, title: 'Longest Palindromic Substring', titleSlug: 'longest-palindromic-substring', difficulty: 'Medium', topics: ['Two Pointers', 'String', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '647', number: 647, title: 'Palindromic Substrings', titleSlug: 'palindromic-substrings', difficulty: 'Medium', topics: ['Two Pointers', 'String', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '91', number: 91, title: 'Decode Ways', titleSlug: 'decode-ways', difficulty: 'Medium', topics: ['String', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '322', number: 322, title: 'Coin Change', titleSlug: 'coin-change', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming', 'Breadth-First Search'], solved: false, sheetName: 'Blind 75' },
  { id: '152', number: 152, title: 'Maximum Product Subarray', titleSlug: 'maximum-product-subarray', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '139', number: 139, title: 'Word Break', titleSlug: 'word-break', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'], solved: false, sheetName: 'Blind 75' },
  { id: '300', number: 300, title: 'Longest Increasing Subsequence', titleSlug: 'longest-increasing-subsequence', difficulty: 'Medium', topics: ['Array', 'Binary Search', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '416', number: 416, title: 'Partition Equal Subset Sum', titleSlug: 'partition-equal-subset-sum', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 13. 2-D DYNAMIC PROGRAMMING (11 Problems)
  // ==========================================
  { id: '62', number: 62, title: 'Unique Paths', titleSlug: 'unique-paths', difficulty: 'Medium', topics: ['Math', 'Dynamic Programming', 'Combinatorics'], solved: false, sheetName: 'Blind 75' },
  { id: '1143', number: 1143, title: 'Longest Common Subsequence', titleSlug: 'longest-common-subsequence', difficulty: 'Medium', topics: ['String', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '309', number: 309, title: 'Best Time to Buy and Sell Stock with Cooldown', titleSlug: 'best-time-to-buy-and-sell-stock-with-cooldown', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },
  { id: '518', number: 518, title: 'Coin Change II', titleSlug: 'coin-change-ii', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },
  { id: '494', number: 494, title: 'Target Sum', titleSlug: 'target-sum', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming', 'Backtracking'], solved: false, sheetName: 'NeetCode 150' },
  { id: '97', number: 97, title: 'Interleaving String', titleSlug: 'interleaving-string', difficulty: 'Medium', topics: ['String', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },
  { id: '329', number: 329, title: 'Longest Increasing Path in a Matrix', titleSlug: 'longest-increasing-path-in-a-matrix', difficulty: 'Hard', topics: ['Array', 'Dynamic Programming', 'Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort', 'Memoization', 'Matrix'], solved: false, sheetName: 'NeetCode 150' },
  { id: '115', number: 115, title: 'Distinct Subsequences', titleSlug: 'distinct-subsequences', difficulty: 'Hard', topics: ['String', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },
  { id: '72', number: 72, title: 'Edit Distance', titleSlug: 'edit-distance', difficulty: 'Medium', topics: ['String', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },
  { id: '312', number: 312, title: 'Burst Balloons', titleSlug: 'burst-balloons', difficulty: 'Hard', topics: ['Array', 'Dynamic Programming'], solved: false, sheetName: 'NeetCode 150' },
  { id: '10', number: 10, title: 'Regular Expression Matching', titleSlug: 'regular-expression-matching', difficulty: 'Hard', topics: ['String', 'Dynamic Programming', 'Recursion'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 14. GREEDY (8 Problems)
  // ==========================================
  { id: '53', number: 53, title: 'Maximum Subarray', titleSlug: 'maximum-subarray', difficulty: 'Medium', topics: ['Array', 'Divide and Conquer', 'Dynamic Programming'], solved: false, sheetName: 'Blind 75' },
  { id: '55', number: 55, title: 'Jump Game', titleSlug: 'jump-game', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming', 'Greedy'], solved: false, sheetName: 'Blind 75' },
  { id: '45', number: 45, title: 'Jump Game II', titleSlug: 'jump-game-ii', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming', 'Greedy'], solved: false, sheetName: 'NeetCode 150' },
  { id: '134', number: 134, title: 'Gas Station', titleSlug: 'gas-station', difficulty: 'Medium', topics: ['Array', 'Greedy'], solved: false, sheetName: 'NeetCode 150' },
  { id: '846', number: 846, title: 'Hand of Straights', titleSlug: 'hand-of-straights', difficulty: 'Medium', topics: ['Array', 'Hash Table', 'Greedy', 'Sorting'], solved: false, sheetName: 'NeetCode 150' },
  { id: '1899', number: 1899, title: 'Merge Triplets to Form Target Triplet', titleSlug: 'merge-triplets-to-form-target-triplet', difficulty: 'Medium', topics: ['Array', 'Greedy'], solved: false, sheetName: 'NeetCode 150' },
  { id: '763', number: 763, title: 'Partition Labels', titleSlug: 'partition-labels', difficulty: 'Medium', topics: ['Hash Table', 'Two Pointers', 'String', 'Greedy'], solved: false, sheetName: 'NeetCode 150' },
  { id: '678', number: 678, title: 'Valid Parenthesis String', titleSlug: 'valid-parenthesis-string', difficulty: 'Medium', topics: ['String', 'Dynamic Programming', 'Stack', 'Greedy'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 15. INTERVALS (6 Problems)
  // ==========================================
  { id: '57', number: 57, title: 'Insert Interval', titleSlug: 'insert-interval', difficulty: 'Medium', topics: ['Array'], solved: false, sheetName: 'Blind 75' },
  { id: '56', number: 56, title: 'Merge Intervals', titleSlug: 'merge-intervals', difficulty: 'Medium', topics: ['Array', 'Sorting'], solved: false, sheetName: 'Blind 75' },
  { id: '435', number: 435, title: 'Non-overlapping Intervals', titleSlug: 'non-overlapping-intervals', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'], solved: false, sheetName: 'Blind 75' },
  { id: '252', number: 252, title: 'Meeting Rooms', titleSlug: 'meeting-rooms', difficulty: 'Easy', topics: ['Array', 'Sorting'], solved: false, sheetName: 'Blind 75' },
  { id: '253', number: 253, title: 'Meeting Rooms II', titleSlug: 'meeting-rooms-ii', difficulty: 'Medium', topics: ['Array', 'Two Pointers', 'Greedy', 'Sorting', 'Heap (Priority Queue)', 'Prefix Sum'], solved: false, sheetName: 'Blind 75' },
  { id: '1851', number: 1851, title: 'Minimum Interval to Include Each Query', titleSlug: 'minimum-interval-to-include-each-query', difficulty: 'Hard', topics: ['Array', 'Binary Search', 'Line Sweep', 'Sorting', 'Heap (Priority Queue)'], solved: false, sheetName: 'NeetCode 150' },

  // ==========================================
  // 16. BIT MANIPULATION (7 Problems)
  // ==========================================
  { id: '136', number: 136, title: 'Single Number', titleSlug: 'single-number', difficulty: 'Easy', topics: ['Array', 'Bit Manipulation'], solved: false, sheetName: 'Blind 75' },
  { id: '191', number: 191, title: 'Number of 1 Bits', titleSlug: 'number-of-1-bits', difficulty: 'Easy', topics: ['Divide and Conquer', 'Bit Manipulation'], solved: false, sheetName: 'Blind 75' },
  { id: '338', number: 338, title: 'Counting Bits', titleSlug: 'counting-bits', difficulty: 'Easy', topics: ['Dynamic Programming', 'Bit Manipulation'], solved: false, sheetName: 'Blind 75' },
  { id: '190', number: 190, title: 'Reverse Bits', titleSlug: 'reverse-bits', difficulty: 'Easy', topics: ['Divide and Conquer', 'Bit Manipulation'], solved: false, sheetName: 'Blind 75' },
  { id: '268', number: 268, title: 'Missing Number', titleSlug: 'missing-number', difficulty: 'Easy', topics: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation', 'Sorting'], solved: false, sheetName: 'Blind 75' },
  { id: '371', number: 371, title: 'Sum of Two Integers', titleSlug: 'sum-of-two-integers', difficulty: 'Medium', topics: ['Math', 'Bit Manipulation'], solved: false, sheetName: 'Blind 75' },
  { id: '7', number: 7, title: 'Reverse Integer', titleSlug: 'reverse-integer', difficulty: 'Medium', topics: ['Math'], solved: false, sheetName: 'NeetCode 150' },
];

export const ROADMAP_SHEETS = [
  { id: 'all', name: 'All Problems' },
  { id: 'Blind 75', name: 'Blind 75' },
  { id: 'NeetCode 150', name: 'NeetCode 150' },
  { id: 'Striver A2Z', name: 'Striver A2Z Sheet' },
];
