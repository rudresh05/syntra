'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Problem, GitHubConfig, ProgrammingLanguage } from '@/types/dsa';
import { UserSession } from '@/lib/auth-cookies';
import { API_ENDPOINTS, getLeetCodeProblemUrl } from '@/config/api';
import {
  User,
  Github,
  ExternalLink,
  Sparkles,
  FolderGit2,
  GitBranch,
  GitCommit,
  Flame,
  Award,
  Target,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Settings,
  ShieldCheck,
  Code2,
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  Share2,
  Zap,
  Lock,
  Sliders,
} from 'lucide-react';

interface UserProfileViewProps {
  user: UserSession | null;
  githubConfig: GitHubConfig;
  problems: Problem[];
  currentStreak: number;
  leetcodeUsername?: string;
  onOpenGitHubModal: () => void;
  onOpenLeetCodeModal: () => void;
  onOpenDetail: (problem: Problem) => void;
}

interface GitHubDetailedProfile {
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following?: number;
  html_url: string;
  company?: string;
  location?: string;
  created_at?: string;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  githubConfig,
  problems,
  currentStreak,
  leetcodeUsername,
  onOpenGitHubModal,
  onOpenLeetCodeModal,
  onOpenDetail,
}) => {
  const [profileData, setProfileData] = useState<GitHubDetailedProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>('java');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const ghUsername = user?.githubOwner || user?.username || githubConfig.username;

  // Fetch full GitHub profile
  useEffect(() => {
    if (ghUsername && ghUsername !== 'Engineer') {
      setLoadingProfile(true);
      fetch(`${API_ENDPOINTS.GITHUB_PROFILE}?username=${ghUsername}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setProfileData(data.profile);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingProfile(false));
    }
  }, [ghUsername]);

  const solvedProblems = useMemo(() => problems.filter((p) => p.solved), [problems]);
  const easySolved = useMemo(
    () => solvedProblems.filter((p) => p.difficulty === 'Easy').length,
    [solvedProblems]
  );
  const mediumSolved = useMemo(
    () => solvedProblems.filter((p) => p.difficulty === 'Medium').length,
    [solvedProblems]
  );
  const hardSolved = useMemo(
    () => solvedProblems.filter((p) => p.difficulty === 'Hard').length,
    [solvedProblems]
  );

  const easyTotal = useMemo(
    () => problems.filter((p) => p.difficulty === 'Easy').length,
    [problems]
  );
  const mediumTotal = useMemo(
    () => problems.filter((p) => p.difficulty === 'Medium').length,
    [problems]
  );
  const hardTotal = useMemo(
    () => problems.filter((p) => p.difficulty === 'Hard').length,
    [problems]
  );

  const handleCopyProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const displayName = profileData?.name || user?.name || ghUsername || 'Software Engineer';
  const avatarUrl =
    profileData?.avatar_url || user?.avatarUrl || `https://github.com/${ghUsername || 'github'}.png`;
  const bio =
    profileData?.bio ||
    user?.bio ||
    'Full Stack & Systems Engineer grinding Data Structures & Algorithms.';

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* 1. HERO PROFILE BANNER CARD */}
      <div className="specular-card rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        {/* Banner Glow Background */}
        <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border-b border-slate-800/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top-right Badges & Actions */}
          <div className="absolute top-4 right-4 flex items-center space-x-2.5">
            <button
              onClick={handleCopyProfile}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-xs font-semibold backdrop-blur-md shadow-sm active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share Portfolio</span>
                </>
              )}
            </button>

            <a
              href={profileData?.html_url || `https://github.com/${ghUsername}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
            {/* Avatar with Status Ring */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-[#030712] shadow-2xl bg-slate-900 ring-2 ring-emerald-500/40 flex-shrink-0">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-4 border-[#030712] shadow-md shadow-emerald-400/80"
                title="Syntra Live Sync Online"
              />
            </div>

            {/* Quick Metrics Header Pill */}
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
              <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <div className="text-xs">
                  <div className="font-extrabold text-white">{currentStreak} Days</div>
                  <div className="text-[10px] text-slate-400">Current Streak</div>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div className="text-xs">
                  <div className="font-extrabold text-white">{solvedProblems.length} Solved</div>
                  <div className="text-[10px] text-slate-400">Problems Bank</div>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <div className="text-xs">
                  <div className="font-extrabold text-white">
                    {profileData?.followers ?? user?.followers ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400">Followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Names & Bio */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="text-sm font-mono font-semibold text-emerald-400">
                  @{ghUsername}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PRO ENGINEER
                </span>
              </div>

              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {bio}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              {profileData?.location && (
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{profileData.location}</span>
                </div>
              )}

              {profileData?.company && (
                <div className="flex items-center space-x-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>{profileData.company}</span>
                </div>
              )}

              <div className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  <strong className="text-white">
                    {profileData?.followers ?? user?.followers ?? 0}
                  </strong>{' '}
                  followers
                </span>
                <span>•</span>
                <span>
                  <strong className="text-white">{profileData?.following ?? 0}</strong> following
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  <strong className="text-white">
                    {profileData?.public_repos ?? user?.publicRepos ?? 0}
                  </strong>{' '}
                  public repositories
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE CORE PROFILE PILLARS (LEETCODE + GITHUB SYNC + PREFERENCES) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PILLAR 1: CONNECTED GITHUB REPOSITORY */}
        <div className="specular-card p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-white text-sm">GitHub Target Repository</h3>
            </div>
            <button
              onClick={onOpenGitHubModal}
              className="text-xs text-emerald-400 hover:underline font-semibold flex items-center space-x-1"
            >
              <span>Edit</span>
              <Settings className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Repository Name</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                Active Sync
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-white flex items-center space-x-2 truncate">
              <Github className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">
                {ghUsername}/{githubConfig.repo || 'leetcode-dsa-solutions'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center space-x-1.5 font-mono text-[11px]">
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                <span>{githubConfig.branch || 'main'} branch</span>
              </span>
              <a
                href={`https://github.com/${ghUsername}/${githubConfig.repo || 'leetcode-dsa-solutions'}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white flex items-center space-x-1 text-[11px]"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Sync Stats Checklist */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-generate README.md</span>
              </span>
              <span className="font-bold text-emerald-400">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Format Java 21 Classes</span>
              </span>
              <span className="font-bold text-emerald-400">Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Duplicate Commits</span>
              </span>
              <span className="font-bold text-emerald-400">Guaranteed</span>
            </div>
          </div>
        </div>

        {/* PILLAR 2: LEETCODE ACCOUNT & BREAKDOWN */}
        <div className="specular-card p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-white text-sm">LeetCode Integration</h3>
            </div>
            <button
              onClick={onOpenLeetCodeModal}
              className="text-xs text-amber-400 hover:underline font-semibold flex items-center space-x-1"
            >
              <span>{leetcodeUsername ? 'Resync' : 'Connect'}</span>
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Linked Profile</span>
              <span className="text-emerald-400 font-bold font-mono text-xs">
                {solvedProblems.length} Solved
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-white flex items-center space-x-2">
              <span className="text-amber-400">@</span>
              <span>{leetcodeUsername || 'Not connected yet'}</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span>Automatic submission hook</span>
              <span className="text-emerald-400 font-semibold">Active (0ms)</span>
            </div>
          </div>

          {/* Difficulty Breakdown Bars */}
          <div className="space-y-3">
            {/* Easy Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-semibold">Easy</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {easySolved} / {easyTotal}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400 font-semibold">Medium</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {mediumSolved} / {mediumTotal}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-rose-400 font-semibold">Hard</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {hardSolved} / {hardTotal}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PILLAR 3: DEVELOPER PREFERENCES */}
        <div className="specular-card p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-white text-sm">Developer Preferences</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Preferred Language */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">Default Solution Language</span>
                <span className="text-[10px] font-mono text-emerald-400">Preferred</span>
              </div>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as ProgrammingLanguage)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="java">Java 21 (Solution.java)</option>
                <option value="cpp">C++ 20 (Solution.cpp)</option>
                <option value="python3">Python 3 (solution.py)</option>
                <option value="typescript">TypeScript (solution.ts)</option>
                <option value="golang">Go (solution.go)</option>
              </select>
            </div>

            {/* Auto Sync Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div>
                <div className="font-bold text-white">Auto-Push on Accepted</div>
                <div className="text-[11px] text-slate-400">Push to GitHub instantly upon passing</div>
              </div>
              <button
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    autoSyncEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Sync Tip Box */}
            <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[11px] space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated Solution Sync</span>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Accepted LeetCode solutions are formatted cleanly and committed directly to your chosen GitHub repository.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT PUSHED DSA SOLUTIONS SHOWCASE */}
      <div className="specular-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              Synchronized Solutions Portfolio
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {solvedProblems.length} Problems
            </span>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Real code formatted and pushed to GitHub main branch
          </span>
        </div>

        {solvedProblems.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No solved problems pushed yet. Solve problems on LeetCode or in the dashboard to populate your portfolio!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {solvedProblems.slice(0, 9).map((problem) => (
              <div
                key={problem.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-slate-500">
                      #{String(problem.number).padStart(4, '0')}
                    </span>
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                      {problem.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      problem.difficulty === 'Easy'
                        ? 'bg-[#00b8a3]/15 text-[#00b8a3] border-[#00b8a3]/30'
                        : problem.difficulty === 'Medium'
                        ? 'bg-[#ffc01e]/15 text-[#ffc01e] border-[#ffc01e]/30'
                        : 'bg-[#ff375f]/15 text-[#ff375f] border-[#ff375f]/30'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {problem.topics.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono">
                    Java
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <button
                    onClick={() => onOpenDetail(problem)}
                    className="text-slate-400 hover:text-white flex items-center space-x-1 font-semibold text-[11px]"
                  >
                    <Code2 className="w-3 h-3 text-emerald-400" />
                    <span>View Solution</span>
                  </button>

                  <a
                    href={getLeetCodeProblemUrl(problem.titleSlug)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-emerald-400 flex items-center space-x-1 text-[11px]"
                  >
                    <span>LeetCode</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
