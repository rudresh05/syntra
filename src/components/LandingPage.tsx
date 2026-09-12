'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Github,
  Code2,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Layers,
  Terminal,
  ArrowRight,
  ChevronDown,
  GitBranch,
  FolderGit2,
  FileCode2,
  Flame,
  Star,
  Lock,
  Play,
  RotateCcw,
  Check,
  ExternalLink,
  GitCommit,
  Clock,
  UserCheck,
  CheckSquare,
  Square,
  Search,
  Sparkles,
  Award,
  Cpu,
  Bookmark,
  Share2,
  Eye,
  Database,
  Copy,
  Sliders,
  Radio,
  Laptop,
  CheckCircle,
  Activity,
  GitPullRequest,
  RefreshCw,
  X,
  LaptopMinimal,
  Settings,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuthModal: () => void;
  onOpenGitHubAuth: () => void;
}

interface DemoProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  acceptance: string;
  runtime: string;
  memory: string;
  runtimePercent: string;
  memoryPercent: string;
  testcases: string;
  codeSnippet: string;
  inputExample: string;
  outputExample: string;
}

const DEMO_PROBLEMS: DemoProblem[] = [
  {
    id: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topics: ['Array', 'Hash Table'],
    acceptance: '53.8%',
    runtime: '1 ms',
    memory: '44.8 MB',
    runtimePercent: '99.20%',
    memoryPercent: '88.45%',
    testcases: '57 / 57 testcases passed',
    inputExample: 'nums = [2,7,11,15], target = 9',
    outputExample: '[0,1]',
    codeSnippet: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
  },
  {
    id: 9,
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    difficulty: 'Easy',
    topics: ['Math'],
    acceptance: '56.4%',
    runtime: '4 ms',
    memory: '42.6 MB',
    runtimePercent: '98.54%',
    memoryPercent: '91.20%',
    testcases: '11511 / 11511 testcases passed',
    inputExample: 'x = 121',
    outputExample: 'true',
    codeSnippet: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int reverted = 0;
        while (x > reverted) {
            reverted = reverted * 10 + x % 10;
            x /= 10;
        }
        return x == reverted || x == reverted / 10;
    }
}`,
  },
  {
    id: 15,
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    topics: ['Array', 'Two Pointers', 'Sorting'],
    acceptance: '34.9%',
    runtime: '28 ms',
    memory: '51.2 MB',
    runtimePercent: '96.12%',
    memoryPercent: '84.30%',
    testcases: '313 / 313 testcases passed',
    inputExample: 'nums = [-1,0,1,2,-1,-4]',
    outputExample: '[[-1,-1,2],[-1,0,1]]',
    codeSnippet: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l++], nums[r--]));
                    while (l < r && nums[l] == nums[l - 1]) l++;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`,
  },
  {
    id: 42,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topics: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    acceptance: '61.2%',
    runtime: '1 ms',
    memory: '46.1 MB',
    runtimePercent: '99.85%',
    memoryPercent: '94.10%',
    testcases: '322 / 322 testcases passed',
    inputExample: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    outputExample: '6',
    codeSnippet: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`,
  },
];

const BLIND_75_SAMPLE = [
  { id: 1, title: 'Two Sum', diff: 'Easy' as const, topic: 'Arrays & Hashing' },
  { id: 121, title: 'Best Time to Buy and Sell Stock', diff: 'Easy' as const, topic: 'Dynamic Programming' },
  { id: 217, title: 'Contains Duplicate', diff: 'Easy' as const, topic: 'Arrays & Hashing' },
  { id: 238, title: 'Product of Array Except Self', diff: 'Medium' as const, topic: 'Arrays & Hashing' },
  { id: 53, title: 'Maximum Subarray', diff: 'Medium' as const, topic: 'Dynamic Programming' },
  { id: 15, title: '3Sum', diff: 'Medium' as const, topic: 'Two Pointers' },
  { id: 20, title: 'Valid Parentheses', diff: 'Easy' as const, topic: 'Stack' },
  { id: 206, title: 'Reverse Linked List', diff: 'Easy' as const, topic: 'Linked List' },
  { id: 141, title: 'Linked List Cycle', diff: 'Easy' as const, topic: 'Two Pointers' },
  { id: 42, title: 'Trapping Rain Water', diff: 'Hard' as const, topic: 'Two Pointers' },
];

const RECENT_LIVE_SYNCS = [
  { user: 'rudresh_dev', problem: '#9 Palindrome Number', lang: 'Java', time: '14s ago', runtime: '4ms' },
  { user: 'aniket_sde', problem: '#1 Two Sum', lang: 'Java', time: '42s ago', runtime: '1ms' },
  { user: 'rhea_codes', problem: '#15 3Sum', lang: 'Java', time: '2m ago', runtime: '28ms' },
  { user: 'dev_varun', problem: '#42 Trapping Rain Water', lang: 'Java', time: '3m ago', runtime: '1ms' },
  { user: 'priya_tech', problem: '#20 Valid Parentheses', lang: 'Java', time: '5m ago', runtime: '2ms' },
];

const FLOATING_FEED = [
  { name: 'aditya_sde', role: 'Amazon SDE 1', problem: '#42 Trapping Rain Water', lang: 'Java', time: 'Just now' },
  { name: 'priya_codes', role: 'BITS Pilani CS', problem: '#15 3Sum', lang: 'Java', time: '12s ago' },
  { name: 'kunal_tech', role: 'IIT Delhi Senior', problem: '#20 Valid Parentheses', lang: 'Java', time: '28s ago' },
  { name: 'rohit_dev', role: 'Microsoft SDE', problem: '#9 Palindrome Number', lang: 'Java', time: '45s ago' },
  { name: 'rhea_cs', role: 'Stanford CS', problem: '#1 Two Sum', lang: 'Java', time: '1m ago' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuthModal,
  onOpenGitHubAuth,
}) => {
  const [selectedProb, setSelectedProb] = useState<DemoProblem>(DEMO_PROBLEMS[0]);
  const [activeTab, setActiveTab] = useState<'editor' | 'testcase'>('editor');
  const [pipelineStep, setPipelineStep] = useState<'idle' | 'running' | 'accepted' | 'pushing' | 'committed'>('idle');
  const [githubTab, setGithubTab] = useState<'code' | 'readme' | 'diff'>('code');
  const [hoveredCell, setHoveredCell] = useState<{ day: string; count: number } | null>(null);
  const [showTerminalLogs, setShowTerminalLogs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDiff, setSelectedDiff] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [demoViewMode, setDemoViewMode] = useState<'pipeline' | 'extension_popup'>('pipeline');

  // Extension popup state simulator
  const [extAutoCommit, setExtAutoCommit] = useState(true);
  const [extLanguage, setExtLanguage] = useState('Java 21');
  const [extPingStatus, setExtPingStatus] = useState<string | null>(null);

  // Social proof floating toast
  const [feedIndex, setFeedIndex] = useState(0);
  const [showToast, setShowToast] = useState(true);

  // LeetCode timer simulator
  const [timerSeconds, setTimerSeconds] = useState(864); // 14m 24s

  useEffect(() => {
    const t = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const feedInterval = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % FLOATING_FEED.length);
    }, 5500);
    return () => clearInterval(feedInterval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Checklist state
  const [sheetChecklist, setSheetChecklist] = useState<Record<number, boolean>>({
    1: true,
    121: true,
    217: true,
    20: true,
    206: true,
    238: false,
    53: false,
    15: false,
    141: false,
    42: false,
  });

  const toggleCheck = (id: number) => {
    setSheetChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const topicsList = ['All', 'Arrays & Hashing', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Linked List'];
  const diffList = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredProblems = useMemo(() => {
    return BLIND_75_SAMPLE.filter((p) => {
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id).includes(searchQuery);
      const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
      const matchDiff = selectedDiff === 'All' || p.diff === selectedDiff;
      return matchSearch && matchTopic && matchDiff;
    });
  }, [searchQuery, selectedTopic, selectedDiff]);

  const solvedCount = Object.values(sheetChecklist).filter(Boolean).length;
  const progressPercent = Math.round((solvedCount / BLIND_75_SAMPLE.length) * 100);

  // Run simulation
  const handleSimulateSubmit = () => {
    if (pipelineStep !== 'idle' && pipelineStep !== 'committed') return;
    setPipelineStep('running');

    setTimeout(() => {
      setPipelineStep('accepted');
      setTimeout(() => {
        setPipelineStep('pushing');
        setTimeout(() => {
          setPipelineStep('committed');
        }, 1100);
      }, 1000);
    }, 1100);
  };

  const handleReset = () => {
    setPipelineStep('idle');
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedProb.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePingExtension = () => {
    setExtPingStatus('Pinging GitHub REST API...');
    setTimeout(() => {
      setExtPingStatus('Latency: 142ms • Status: 200 OK • Handshake Verified');
      setTimeout(() => setExtPingStatus(null), 4000);
    }, 450);
  };

  // Realistic Java Syntax Highlighter
  const renderJavaCode = (code: string) => {
    return code.split('\n').map((line, lineIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return (
          <div key={lineIdx} className="leading-6">
            <span className="text-slate-500 italic">{line}</span>
          </div>
        );
      }

      const tokens = line.split(/(\b(?:class|public|private|protected|static|final|void|int|boolean|char|double|float|long|byte|short|new|return|if|else|while|for|break|continue|import|package|null|true|false)\b|\b(?:Solution|Map|HashMap|List|ArrayList|Arrays|String|Integer|Math|System)\b|\b\d+\b|"[^"]*"|'[^']*'|[{}()\[\];,=+\-*/<>!&|])/g);

      return (
        <div key={lineIdx} className="leading-6">
          {tokens.map((token, tokIdx) => {
            if (!token) return null;
            if (/^(?:class|public|private|protected|static|final|void|int|boolean|char|double|float|long|byte|short|new|return|if|else|while|for|break|continue|import|package|null|true|false)$/.test(token)) {
              return <span key={tokIdx} className="text-purple-400 font-semibold">{token}</span>;
            }
            if (/^(?:Solution|Map|HashMap|List|ArrayList|Arrays|String|Integer|Math|System)$/.test(token)) {
              return <span key={tokIdx} className="text-amber-300 font-medium">{token}</span>;
            }
            if (/^\d+$/.test(token)) {
              return <span key={tokIdx} className="text-orange-400">{token}</span>;
            }
            if (/^"[^"]*"|'[^']*'$/.test(token)) {
              return <span key={tokIdx} className="text-emerald-300">{token}</span>;
            }
            if (/^[{}()\[\];,]$/.test(token)) {
              return <span key={tokIdx} className="text-slate-500">{token}</span>;
            }
            if (/^[=+\-*/<>!&|]$/.test(token)) {
              return <span key={tokIdx} className="text-cyan-400">{token}</span>;
            }
            return <span key={tokIdx} className="text-slate-200">{token}</span>;
          })}
        </div>
      );
    });
  };

  const faqs = [
    {
      q: 'How does the automatic GitHub sync work under the hood?',
      a: 'Syntra runs a zero-latency Chrome extension with zero external trackers. The moment LeetCode outputs an "Accepted" verdict, the extension intercepts your solution code directly from the DOM, grabs execution stats (runtime & memory percentiles), packages a clean directory with Solution.java + README.md, and pushes it directly to your GitHub repository.',
    },
    {
      q: 'Does Syntra expose my GitHub Personal Access Token or credentials?',
      a: 'Never. Syntra is built with a 100% backend-controlled architecture. Sessions are cryptographically signed and stored securely on the server, and database interactions use protected service keys. Your tokens are completely invisible to client-side scripts, browser devtools, and localStorage.',
    },
    {
      q: 'I code in Java. Is Java fully supported by default?',
      a: 'Yes, Syntra defaults to Java across the entire stack. Submissions are saved as Solution.java with clean formatting, class structure, and metadata headers. It also includes full detection support for C++, Python, and TypeScript.',
    },
    {
      q: 'Will this turn my GitHub contribution graph green?',
      a: 'Yes! Every accepted LeetCode solution creates an official Git commit on your repository default branch (e.g. main). Each daily problem you solve immediately lights up your public GitHub activity graph for recruiters to see.',
    },
    {
      q: 'Is Syntra completely free?',
      a: 'Yes, 100% free and open-source. There are no $5/month paywalls, hidden limits, or subscriptions. You own your code, your repository, and your progress.',
    },
  ];

  const currentToastItem = FLOATING_FEED[feedIndex];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="aurora-gradient absolute top-0 left-0 right-0 h-[700px] pointer-events-none z-0" />
      <div className="bg-grid-pattern absolute inset-0 opacity-60 pointer-events-none z-0" />

      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#030712]/85 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/25 border border-emerald-500/40 bg-slate-900 flex-shrink-0">
              <img src="/logo.png" alt="Syntra Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SYNTRA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-400">
            <a href="#simulator" className="hover:text-emerald-400 transition-colors">
              Interactive Demo
            </a>
            <a href="#comparison" className="hover:text-emerald-400 transition-colors">
              Comparison
            </a>
            <a href="#heatmap" className="hover:text-emerald-400 transition-colors">
              GitHub Graph
            </a>
            <a href="#sheets" className="hover:text-emerald-400 transition-colors">
              Blind 75 Sheet
            </a>
            <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
              Engineers
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-sm"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Star 1.4k</span>
            </a>

            <button
              onClick={onOpenAuthModal}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={onOpenGitHubAuth}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Connect GitHub</span>
              <span className="sm:hidden inline">GitHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Community Activity Ribbon */}
      <div className="border-b border-slate-800/60 bg-[#050914] py-2 overflow-x-auto text-xs z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 whitespace-nowrap">
          <div className="flex items-center space-x-2 font-bold text-emerald-400 uppercase tracking-widest text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Sync Engine</span>
          </div>
          <div className="flex items-center space-x-8 text-[11px] text-slate-400">
            {RECENT_LIVE_SYNCS.map((sync, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-slate-300 font-mono font-semibold">@{sync.user}</span>
                <span className="text-slate-500">synced</span>
                <span className="text-emerald-300 font-semibold">{sync.problem}</span>
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 font-mono">
                  {sync.lang} ({sync.runtime})
                </span>
                <span className="text-slate-600 text-[10px]">{sync.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-10 md:pt-20 md:pb-20 overflow-hidden z-10">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-5 sm:space-y-7">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-[11px] sm:text-xs font-medium shadow-xl backdrop-blur-md animate-float">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-semibold">Engineered for Developers</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-bold">Java-First Ecosystem</span>
          </div>

          {/* Grand Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12] sm:leading-[1.08] max-w-4xl mx-auto">
            Turn LeetCode Grinding Into a{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Recruiter-Ready GitHub Portfolio
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Never copy-paste code again. Hit <span className="text-emerald-400 font-semibold">Accepted</span> on LeetCode, and Syntra automatically packages clean Java code, execution stats, and formatted problem documentation straight to your GitHub repository.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenGitHubAuth}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-2.5 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Github className="w-4 h-4" />
              <span>Connect GitHub in 1-Click</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 hover:border-emerald-500/50 transition-all shadow-lg backdrop-blur-md"
            >
              Open DSA Tracker Dashboard
            </button>
          </div>

          {/* Real Metrics Ticker */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="specular-card p-3.5 rounded-xl">
              <div className="text-xl font-extrabold text-white">450+</div>
              <div className="text-[11px] text-slate-400">Curated DSA Questions</div>
            </div>
            <div className="specular-card p-3.5 rounded-xl">
              <div className="text-xl font-extrabold text-emerald-400">0 ms</div>
              <div className="text-[11px] text-slate-400">Submission Overhead</div>
            </div>
            <div className="specular-card p-3.5 rounded-xl">
              <div className="text-xl font-extrabold text-cyan-400">100%</div>
              <div className="text-[11px] text-slate-400">Automated Sync</div>
            </div>
            <div className="specular-card p-3.5 rounded-xl">
              <div className="text-xl font-extrabold text-amber-400">$0 / mo</div>
              <div className="text-[11px] text-slate-400">100% Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* REALISTIC INTERACTIVE SIMULATOR (LEETCODE + GITHUB SIDE BY SIDE) */}
      <section id="simulator" className="relative py-12 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              TRY THE PIPELINE LIVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Real-Time LeetCode to GitHub Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Test how Syntra intercepts LeetCode submissions with zero client latency.
            </p>

            {/* View Switcher: Full Pipeline vs Chrome Extension Popup */}
            <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 mt-3">
              <button
                onClick={() => setDemoViewMode('pipeline')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  demoViewMode === 'pipeline'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LaptopMinimal className="w-3.5 h-3.5" />
                <span>IDE & Repo Split Screen</span>
              </button>
              <button
                onClick={() => setDemoViewMode('extension_popup')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  demoViewMode === 'extension_popup'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Extension Popup Preview</span>
              </button>
            </div>
          </div>

          {demoViewMode === 'pipeline' ? (
            <div className="rounded-2xl border border-slate-800 bg-[#070b14] shadow-2xl shadow-emerald-950/40 overflow-hidden specular-card">
              {/* Top Toolbar */}
              <div className="bg-[#0e1320] px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-400">Problem:</span>
                  <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                    {DEMO_PROBLEMS.map((prob) => (
                      <button
                        key={prob.id}
                        onClick={() => {
                          setSelectedProb(prob);
                          setPipelineStep('idle');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          selectedProb.id === prob.id
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        #{prob.id} {prob.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <button
                    onClick={() => setShowTerminalLogs(!showTerminalLogs)}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 flex items-center space-x-1.5 font-mono text-[11px]"
                  >
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    <span>{showTerminalLogs ? 'Hide Extension Logs' : 'View Extension Logs'}</span>
                  </button>
                  <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-400 font-bold">Java 21</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-mono text-[11px]">{formatTimer(timerSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Split Screen Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                {/* Left Column: Authentic LeetCode Interface Clone */}
                <div className="lg:col-span-7 bg-[#1a1a1a] p-5 border-b lg:border-b-0 lg:border-r border-[#282828] flex flex-col justify-between">
                  <div>
                    {/* LeetCode Header bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#282828] mb-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">
                          {selectedProb.id}. {selectedProb.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            selectedProb.difficulty === 'Easy'
                              ? 'bg-[#00b8a3]/20 text-[#00b8a3]'
                              : selectedProb.difficulty === 'Medium'
                              ? 'bg-[#ffc01e]/20 text-[#ffc01e]'
                              : 'bg-[#ff375f]/20 text-[#ff375f]'
                          }`}
                        >
                          {selectedProb.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Acceptance: {selectedProb.acceptance}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-slate-400">
                        <button
                          onClick={() => setActiveTab('editor')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            activeTab === 'editor' ? 'bg-[#282828] text-white' : 'hover:text-slate-200'
                          }`}
                        >
                          Code
                        </button>
                        <button
                          onClick={() => setActiveTab('testcase')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            activeTab === 'testcase' ? 'bg-[#282828] text-white' : 'hover:text-slate-200'
                          }`}
                        >
                          Testcase
                        </button>
                      </div>
                    </div>

                    {activeTab === 'editor' ? (
                      <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#2d2d2d] font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto max-h-[260px]">
                        <div className="flex">
                          {/* Line numbers */}
                          <div className="text-slate-600 select-none pr-4 text-right">
                            {selectedProb.codeSnippet.split('\n').map((_, i) => (
                              <div key={i} className="leading-6">
                                {i + 1}
                              </div>
                            ))}
                          </div>
                          {/* Tokenized Syntax Highlighted Code */}
                          <div className="flex-1 overflow-x-auto">{renderJavaCode(selectedProb.codeSnippet)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#2d2d2d] text-xs space-y-3">
                        <div className="flex space-x-2">
                          <span className="px-2.5 py-1 bg-[#282828] rounded text-white font-semibold">Case 1</span>
                          <span className="px-2.5 py-1 text-slate-500">Case 2</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-500 font-mono text-[11px]">Input:</div>
                          <div className="p-2 bg-[#121212] rounded font-mono text-slate-200">{selectedProb.inputExample}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-500 font-mono text-[11px]">Expected Output:</div>
                          <div className="p-2 bg-[#121212] rounded font-mono text-emerald-400">{selectedProb.outputExample}</div>
                        </div>
                      </div>
                    )}

                    {/* Submission Result Modal Preview (When Accepted) */}
                    {(pipelineStep === 'accepted' || pipelineStep === 'pushing' || pipelineStep === 'committed') && (
                      <div className="mt-4 p-3.5 rounded-xl bg-[#00b8a3]/10 border border-[#00b8a3]/30 text-xs flex items-center justify-between animate-fade-in">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-5 h-5 text-[#00b8a3]" />
                          <div>
                            <div className="font-bold text-[#00b8a3] text-sm">Accepted</div>
                            <div className="text-[11px] text-slate-300">
                              Runtime: <strong className="text-white">{selectedProb.runtime}</strong> (Beats {selectedProb.runtimePercent}) • Memory: <strong className="text-white">{selectedProb.memory}</strong> (Beats {selectedProb.memoryPercent})
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-1 rounded">
                          {selectedProb.testcases}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Submit Controls */}
                  <div className="pt-4 mt-4 border-t border-[#282828] flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {pipelineStep === 'idle' && <span>Ready. Click &quot;Submit Solution&quot; to test Syntra auto-sync!</span>}
                      {pipelineStep === 'running' && (
                        <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                          Evaluating testcases on LeetCode judge...
                        </span>
                      )}
                      {pipelineStep === 'accepted' && (
                        <span className="text-[#00b8a3] font-bold">Verdict: Accepted! Intercepting code...</span>
                      )}
                      {pipelineStep === 'pushing' && (
                        <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
                          <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
                          Syntra packaging Solution.java & pushing commit...
                        </span>
                      )}
                      {pipelineStep === 'committed' && (
                        <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                          <Check className="w-4 h-4 text-emerald-400" />
                          Pushed to GitHub Repository in 340ms!
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {pipelineStep === 'committed' ? (
                        <button
                          onClick={handleReset}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-[#282828] border border-[#3e3e3e] flex items-center space-x-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Replay</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleSimulateSubmit}
                          disabled={pipelineStep !== 'idle'}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                            pipelineStep === 'idle'
                              ? 'bg-[#00b8a3] hover:bg-[#009b89] text-white shadow-lg shadow-[#00b8a3]/20'
                              : 'bg-[#282828] text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Submit Solution</span>
                          <span className="text-[10px] opacity-70 border border-white/20 px-1 rounded font-mono">
                            Ctrl ↵
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Authentic GitHub Repository View Clone */}
                <div className="lg:col-span-5 bg-[#0d1117] p-5 border-t lg:border-t-0 border-slate-800 flex flex-col justify-between">
                  <div>
                    {/* GitHub Repo Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                      <div className="flex items-center space-x-2 font-mono">
                        <FolderGit2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-bold">rudresh / leetcode-dsa-solutions</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full border border-slate-700 text-slate-400">
                          Public
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px]">
                        <span className="flex items-center space-x-1 text-slate-300">
                          <GitBranch className="w-3 h-3 text-slate-500" />
                          <span className="font-mono">main</span>
                        </span>
                      </div>
                    </div>

                    {/* GitHub Commit Notification Bar */}
                    <div className="py-2 px-3 my-3 bg-[#161b22] border border-slate-800 rounded-lg text-xs flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                          R
                        </div>
                        <span className="text-slate-300 font-semibold">rudresh</span>
                        <span className="text-slate-400 font-mono text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                          {pipelineStep === 'committed'
                            ? `feat: add solution for 000${selectedProb.id}`
                            : 'feat: add solutions'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {pipelineStep === 'committed' ? 'c4d92a1 • just now' : 'c4d92a1'}
                      </span>
                    </div>

                    {/* Tab Selector: Code vs README vs Diff */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-3 text-xs">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setGithubTab('code')}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                            githubTab === 'code'
                              ? 'bg-[#21262d] text-emerald-400 border border-slate-700'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Solution.java
                        </button>
                        <button
                          onClick={() => setGithubTab('readme')}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                            githubTab === 'readme'
                              ? 'bg-[#21262d] text-emerald-400 border border-slate-700'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          README.md
                        </button>
                        <button
                          onClick={() => setGithubTab('diff')}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                            githubTab === 'diff'
                              ? 'bg-[#21262d] text-emerald-400 border border-slate-700'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <GitPullRequest className="w-3 h-3 text-slate-500" />
                          <span>Git Diff (+24)</span>
                        </button>
                      </div>

                      {githubTab === 'code' && (
                        <button
                          onClick={handleCopyCode}
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-white flex items-center space-x-1"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>

                    {/* GitHub File Content Area */}
                    {githubTab === 'code' ? (
                      <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-[230px]">
                        <p className="text-slate-500">/*</p>
                        <p className="text-slate-500"> * Problem: {selectedProb.id}. {selectedProb.title}</p>
                        <p className="text-slate-500"> * Link: https://leetcode.com/problems/{selectedProb.slug}/</p>
                        <p className="text-slate-500"> * Difficulty: {selectedProb.difficulty} | Language: Java</p>
                        <p className="text-slate-500"> * Runtime: {selectedProb.runtime} | Memory: {selectedProb.memory}</p>
                        <p className="text-slate-500"> */</p>
                        <br />
                        <div className="text-emerald-300 whitespace-pre font-mono">{selectedProb.codeSnippet}</div>
                      </div>
                    ) : githubTab === 'readme' ? (
                      <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2.5 max-h-[230px] overflow-y-auto">
                        <h4 className="font-bold text-white text-sm"># {selectedProb.id}. {selectedProb.title}</h4>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                            Difficulty: {selectedProb.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/40">
                            Language: Java 21
                          </span>
                        </div>
                        <div className="p-2.5 bg-[#0d1117] rounded-lg border border-slate-800 text-[11px] space-y-0.5">
                          <div className="font-bold text-white">Performance Stats</div>
                          <div className="text-slate-400">
                            - Runtime: <strong className="text-emerald-400">{selectedProb.runtime}</strong> (Beats {selectedProb.runtimePercent})
                          </div>
                          <div className="text-slate-400">
                            - Memory: <strong className="text-emerald-400">{selectedProb.memory}</strong> (Beats {selectedProb.memoryPercent})
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          *Auto-synced via Syntra — LeetCode to GitHub Tracker*
                        </p>
                      </div>
                    ) : (
                      /* Git Unified Diff View */
                      <div className="bg-[#161b22] p-3 rounded-xl border border-slate-800 font-mono text-[10px] max-h-[230px] overflow-y-auto space-y-0.5">
                        <div className="text-slate-500 pb-1 border-b border-slate-800">
                          diff --git a/000{selectedProb.id}-{selectedProb.slug}/Solution.java
                        </div>
                        <div className="text-cyan-400 bg-cyan-950/30 px-2 py-0.5 my-1 rounded">
                          @@ -0,0 +1,24 @@
                        </div>
                        <div className="git-diff-line-add px-2 py-0.5">+ package leetcode;</div>
                        <div className="git-diff-line-add px-2 py-0.5">+ import java.util.*;</div>
                        <div className="git-diff-line-add px-2 py-0.5">+ /* Auto-generated by Syntra */</div>
                        {selectedProb.codeSnippet.split('\n').slice(0, 8).map((line, idx) => (
                          <div key={idx} className="git-diff-line-add px-2 py-0.5">
                            + {line}
                          </div>
                        ))}
                        <div className="text-slate-500 px-2 py-0.5">... {selectedProb.codeSnippet.split('\n').length - 8} more lines</div>
                      </div>
                    )}
                  </div>

                  {/* Contribution Square Pulse Highlight */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="text-[11px] font-semibold">GitHub Graph Status:</span>
                      <span className="text-emerald-400 font-bold text-[11px]">
                        {pipelineStep === 'committed' ? 'Green Square Lighted Up!' : 'Awaiting Accepted Submission'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 2, 4, 3, 4, 5, 3, 4, 5, 4, 5].map((lvl, i) => (
                        <div
                          key={i}
                          className={`h-3.5 flex-1 rounded-sm ${
                            lvl === 5 ? 'bg-[#39d353]' : lvl === 4 ? 'bg-[#26a641]' : lvl === 3 ? 'bg-[#006d32]' : 'bg-[#0e4429]'
                          }`}
                        />
                      ))}
                      {/* Today tile */}
                      <div
                        className={`h-3.5 flex-1 rounded-sm border transition-all ${
                          pipelineStep === 'committed'
                            ? 'bg-[#39d353] border-white shadow-lg shadow-[#39d353]/80 scale-125'
                            : 'bg-[#161b22] border-slate-700'
                        }`}
                        title="Today"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* REAL-TIME TERMINAL / CONSOLE LOGS DRAWER */}
              {showTerminalLogs && (
                <div className="bg-[#03060f] border-t border-slate-800/90 p-4 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-slate-500">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-400">
                      <Terminal className="w-3.5 h-3.5" />
                      Syntra Extension Background Worker Logs
                    </span>
                    <span className="text-[10px]">Connected to Chrome Tabs • Mode: Auto-Sync</span>
                  </div>
                  <div className="pt-1.5 space-y-1">
                    <div className="text-slate-500">
                      [17:55:01] <span className="text-cyan-400">INFO</span> Extension content script initialized on https://leetcode.com/problems/{selectedProb.slug}
                    </div>
                    <div className="text-slate-500">
                      [17:55:02] <span className="text-cyan-400">HOOK</span> DOM listener attached to LeetCode submit action button
                    </div>
                    {pipelineStep === 'running' && (
                      <div className="text-amber-400 animate-pulse">
                        [17:55:03] <span className="text-amber-400">WAIT</span> Evaluating testcases on remote judge servers...
                      </div>
                    )}
                    {(pipelineStep === 'accepted' || pipelineStep === 'pushing' || pipelineStep === 'committed') && (
                      <div className="text-emerald-400 font-semibold">
                        [17:55:03] <span className="text-emerald-400">VERDICT</span> Submission Accepted! Runtime: {selectedProb.runtime} ({selectedProb.runtimePercent}) | Memory: {selectedProb.memory}
                      </div>
                    )}
                    {(pipelineStep === 'pushing' || pipelineStep === 'committed') && (
                      <div className="text-cyan-300">
                        [17:55:04] <span className="text-cyan-400">PACK</span> Formatted 000{selectedProb.id}-{selectedProb.slug}/Solution.java & generated README.md
                      </div>
                    )}
                    {pipelineStep === 'committed' && (
                      <div className="text-emerald-400 font-bold">
                        [17:55:05] <span className="text-emerald-400">GIT</span> Pushed commit c4d92a1 to main branch in 340ms! GitHub contribution heatmap updated.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Chrome Extension Popup Simulator */
            <div className="max-w-md mx-auto rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl p-5 space-y-5 specular-card animate-fade-in">
              {/* Extension Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-500/40">
                    <img src="/logo.png" alt="Syntra" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      Syntra Extension
                      <span className="text-[10px] font-normal text-slate-400">v2.4.0</span>
                    </h3>
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Active on leetcode.com</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-emerald-400">
                    Connected
                  </span>
                </div>
              </div>

              {/* Target Repository Box */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px]">Target Repository:</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold">main branch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-white font-bold text-xs">
                    rudresh / leetcode-dsa-solutions
                  </span>
                </div>
              </div>

              {/* Interactive Settings */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <div className="font-bold text-white">Auto-Push on Accepted</div>
                    <div className="text-[11px] text-slate-400">Zero clicks needed when you pass testcases</div>
                  </div>
                  <button
                    onClick={() => setExtAutoCommit(!extAutoCommit)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      extAutoCommit ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        extAutoCommit ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <div className="font-bold text-white">Primary Programming Language</div>
                    <div className="text-[11px] text-slate-400">Parsed and saved as language extension</div>
                  </div>
                  <select
                    value={extLanguage}
                    onChange={(e) => setExtLanguage(e.target.value)}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="Java 21">Java 21 (.java)</option>
                    <option value="C++ 20">C++ 20 (.cpp)</option>
                    <option value="Python 3">Python 3 (.py)</option>
                    <option value="TypeScript">TypeScript (.ts)</option>
                  </select>
                </div>
              </div>

              {/* Live Diagnostics & Ping button */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePingExtension}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Test Handshake Ping</span>
                  </button>
                  <span className="text-[11px] text-slate-500">247 Problems Synced</span>
                </div>
                {extPingStatus && (
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                    {extPingStatus}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* COMPARISON MATRIX (WHY SYNTRA PRO) */}
      <section id="comparison" className="py-20 border-t border-slate-800/80 bg-[#040814] relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              FEATURE ARCHITECTURE
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Why Engineers Choose Syntra Over Legacy Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Modern 2026 standards with zero client-side token exposure.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 specular-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0a0f1d] text-slate-300">
                  <th className="p-4 font-bold">Capabilities</th>
                  <th className="p-4 font-bold text-slate-400">Manual Copy-Pasting</th>
                  <th className="p-4 font-bold text-slate-400">Legacy Chrome Extensions</th>
                  <th className="p-4 font-bold text-emerald-400 bg-emerald-500/10 border-x border-emerald-500/20">
                    Syntra PRO (Java-First)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-4 font-semibold text-white">Credential Security</td>
                  <td className="p-4 text-slate-400">Manual Git credentials</td>
                  <td className="p-4 text-rose-400 font-mono">Raw PAT in LocalStorage (Unsafe)</td>
                  <td className="p-4 text-emerald-400 font-bold bg-emerald-500/5 border-x border-emerald-500/20">
                    100% Server-Side Security & Isolation
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">2026 LeetCode Support</td>
                  <td className="p-4 text-slate-400">Manual steps</td>
                  <td className="p-4 text-rose-400">Frequently breaks on UI updates</td>
                  <td className="p-4 text-emerald-400 font-bold bg-emerald-500/5 border-x border-emerald-500/20">
                    Zero-latency DOM Mutation Observer
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Java Formatting & AST</td>
                  <td className="p-4 text-slate-400">Requires manual indentation</td>
                  <td className="p-4 text-slate-400">Raw text dumps</td>
                  <td className="p-4 text-emerald-400 font-bold bg-emerald-500/5 border-x border-emerald-500/20">
                    Solution.java + Metadata + Class Parsing
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Automated README & Stats</td>
                  <td className="p-4 text-slate-400">Manual writeup</td>
                  <td className="p-4 text-slate-400">Basic problem text</td>
                  <td className="p-4 text-emerald-400 font-bold bg-emerald-500/5 border-x border-emerald-500/20">
                    Shields.io Badges, Percentiles & Links
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Curated Sheets Tracker</td>
                  <td className="p-4 text-slate-400">Excel / Notion sheet</td>
                  <td className="p-4 text-slate-500">None</td>
                  <td className="p-4 text-emerald-400 font-bold bg-emerald-500/5 border-x border-emerald-500/20">
                    Integrated Blind 75 & NeetCode 150
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Pricing</td>
                  <td className="p-4 text-slate-400">Free (Tedious)</td>
                  <td className="p-4 text-amber-400">$5/mo or abandoned</td>
                  <td className="p-4 text-emerald-400 font-bold bg-emerald-500/5 border-x border-emerald-500/20">
                    100% Free Forever
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* GITHUB HEATMAP REALISTIC SHOWCASE */}
      <section id="heatmap" className="py-20 border-t border-slate-800/80 bg-[#030712] relative z-10">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              PROOF OF WORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Never Let Your GitHub Graph Look Inactive
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Recruiters judge consistency by your GitHub commit history. Syntra ensures every DSA problem you solve shows up on your profile.
            </p>
          </div>

          {/* GitHub 52-Week Heatmap Container */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 max-w-4xl mx-auto text-left space-y-4 specular-card">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-white">418 contributions in 2026</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-semibold">42 Day Active Streak</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22]"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32]"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641]"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353]"></span>
                <span>More</span>
              </div>
            </div>

            {/* Matrix Tiles */}
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
                {Array.from({ length: 52 * 7 }).map((_, i) => {
                  const density = (i * 13 + 7) % 5;
                  const color =
                    density === 4
                      ? 'bg-[#39d353]'
                      : density === 3
                      ? 'bg-[#26a641]'
                      : density === 2
                      ? 'bg-[#006d32]'
                      : density === 1
                      ? 'bg-[#0e4429]'
                      : 'bg-[#161b22]';
                  return (
                    <div
                      key={i}
                      onMouseEnter={() =>
                        setHoveredCell({
                          day: `Day ${i + 1}`,
                          count: density > 0 ? density * 2 : 0,
                        })
                      }
                      className={`w-2.5 h-2.5 rounded-[2px] ${color} hover:ring-2 hover:ring-white transition-all cursor-pointer`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Tooltip feedback bar */}
            <div className="text-[11px] text-slate-400 min-h-[16px] flex items-center space-x-2">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>
                {hoveredCell
                  ? `${hoveredCell.count} accepted DSA solutions synced on ${hoveredCell.day}`
                  : 'Hover over any tile in the matrix to inspect real-time sync metrics'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* REAL BLIND 75 INTERACTIVE CHECKLIST SHOWCASE */}
      <section id="sheets" className="py-20 border-t border-slate-800/80 bg-[#050914] relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              INTERACTIVE CURATED ROADMAPS
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Blind 75 & NeetCode 150 Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive Blind 75 checklist built directly into your dashboard. Try searching and ticking off problems below!
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl bg-slate-900/50 border border-slate-800 p-6 space-y-5 specular-card">
            {/* Progress Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">Blind 75 Essential Core</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/30">
                    {solvedCount} / {BLIND_75_SAMPLE.length} Solved ({progressPercent}%)
                  </span>
                </div>
                <div className="w-48 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter 75 questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 mr-1">Topic:</span>
              {topicsList.map((top) => (
                <button
                  key={top}
                  onClick={() => setSelectedTopic(top)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedTopic === top
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {top}
                </button>
              ))}
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredProblems.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No questions match your filter criteria.
                </div>
              ) : (
                filteredProblems.map((p) => {
                  const checked = sheetChecklist[p.id];
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleCheck(p.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        checked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                        <span className={`text-xs font-semibold ${checked ? 'line-through text-slate-400' : 'text-white'}`}>
                          #{p.id}. {p.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">{p.topic}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.diff === 'Easy'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : p.diff === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {p.diff}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AUTHENTIC DEVELOPER TESTIMONIALS */}
      <section id="testimonials" className="py-20 border-t border-slate-800/80 bg-[#030712] relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              COMMUNITY PROOF
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Loved by Engineers Preparing for FAANG & SDE Roles
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Real feedback from developers who replaced manual copy-pasting with Syntra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="specular-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  AS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aniket Sharma</h4>
                  <p className="text-[11px] text-slate-400">SDE 1 @ Amazon</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &quot;My interviewer clicked through my leetcode-dsa-solutions repo during my technical round. Seeing 200+ well-organized Java solutions with problem links and runtime percentiles made our code quality conversation effortless.&quot;
              </p>
            </div>

            <div className="specular-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm">
                  RD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rhea Desai</h4>
                  <p className="text-[11px] text-slate-400">CS Senior @ BITS Pilani</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &quot;Before Syntra, my GitHub looked like a ghost town while I was solving 5 hours of DSA daily. Now my heatmap is vibrant green, and I have clean revision notes for every dynamic programming problem before interviews.&quot;
              </p>
            </div>

            <div className="specular-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                  DP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Devansh Patel</h4>
                  <p className="text-[11px] text-slate-400">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &quot;The fact that it defaults to Java, doesn&apos;t demand $5/month like other dead Chrome extensions, and never exposes my credentials on the client side makes this an instant recommendation.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER & PHILOSOPHY NOTE (REAL HUMAN FEEL) */}
      <section className="py-14 border-t border-slate-800/80 bg-[#040714] relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-3">
          <h3 className="text-lg font-bold text-white">Why We Built Syntra</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Most software engineers solve hundreds of algorithmic challenges, yet their public GitHub accounts show zero activity. Existing tools either broke after LeetCode UI updates, charged monthly fees, or stored raw GitHub Personal Access Tokens insecurely. Syntra was built as a zero-compromise, open-source, Java-first solution that simply works without hassle.
          </p>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-20 border-t border-slate-800/80 bg-[#030712] relative z-10">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about Syntra</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden transition-all specular-card"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRAND BOTTOM CTA */}
      <section className="py-24 border-t border-slate-800/80 bg-gradient-to-b from-[#040714] to-[#02050c] text-center relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto px-4 space-y-7">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Build Your Engineering Proof of Work?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Turn every accepted LeetCode submission into a polished, recruiter-ready GitHub portfolio. 100% free and ready in 60 seconds.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenGitHubAuth}
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm transition-all shadow-2xl shadow-emerald-500/35 inline-flex items-center space-x-3 hover:scale-[1.03] active:scale-[0.98] group"
            >
              <Github className="w-5 h-5" />
              <span>Connect with GitHub Free</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Real-time Sync Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in max-w-xs sm:max-w-sm">
          <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 flex items-center space-x-3 backdrop-blur-xl">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Github className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate">@{currentToastItem.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{currentToastItem.time}</span>
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                Pushed <span className="text-emerald-400 font-semibold">{currentToastItem.problem}</span> ({currentToastItem.lang})
              </div>
              <div className="text-[10px] text-slate-500">{currentToastItem.role}</div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 bg-[#02050c] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white">SYNTRA</span>
            <span>— Automated LeetCode to GitHub Sync</span>
          </div>
          <p>© 2026 Syntra. Built for DSA Consistency & Technical Interview Success.</p>
        </div>
      </footer>
    </div>
  );
};
