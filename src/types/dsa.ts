export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProgrammingLanguage = 
  | 'cpp' 
  | 'java' 
  | 'python' 
  | 'python3' 
  | 'javascript' 
  | 'typescript' 
  | 'golang' 
  | 'rust' 
  | 'csharp' 
  | 'sql';

export interface Problem {
  id: string; // e.g. "1" or "two-sum"
  number: number;
  title: string;
  titleSlug: string;
  difficulty: Difficulty;
  topics: string[];
  solved: boolean;
  solvedAt?: string;
  code?: string;
  language?: ProgrammingLanguage;
  runtime?: string;
  memory?: string;
  notes?: string;
  needsRevision?: boolean;
  githubUrl?: string;
  sheetName?: string; // e.g., "Blind 75", "NeetCode 150", "Striver A2Z"
}

export interface GitHubConfig {
  token: string;
  username: string;
  repo: string;
  branch: string;
  isConfigured: boolean;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  lastSolvedDate: string | null;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
}
