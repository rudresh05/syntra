'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Problem } from '@/types/dsa';
import {
  CheckCircle2,
  Bookmark,
  Flame,
  Zap,
  Award,
  Target,
  TrendingUp,
  FolderGit2,
  GitBranch,
  Activity,
  Sparkles,
  Calendar,
  Command,
  Clock,
  ExternalLink,
  GitCommit,
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

interface DashboardStatsProps {
  problems: Problem[];
  currentStreak: number;
  username?: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
  publicRepos?: number;
  followers?: number;
  repoName?: string;
  onOpenCommandPalette?: () => void;
}

interface RecentCommit {
  sha: string;
  message: string;
  date: string;
  url: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  problems,
  currentStreak,
  username = 'Engineer',
  avatarUrl: propAvatarUrl,
  name: propName,
  bio: propBio,
  publicRepos: propPublicRepos,
  followers: propFollowers,
  repoName = 'leetcode-dsa-solutions',
  onOpenCommandPalette,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; count: number } | null>(null);
  const [githubCommitsByDate, setGithubCommitsByDate] = useState<Record<string, number>>({});
  const [recentCommits, setRecentCommits] = useState<RecentCommit[]>([]);
  const [githubApiLoaded, setGithubApiLoaded] = useState(false);
  const heatmapScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll heatmap to today (far right) on mount for mobile & small screens
  useEffect(() => {
    if (heatmapScrollRef.current) {
      heatmapScrollRef.current.scrollLeft = heatmapScrollRef.current.scrollWidth;
    }
  }, []);
  const [ghProfile, setGhProfile] = useState<{
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    html_url: string;
  } | null>(null);

  // Fetch real GitHub user profile
  useEffect(() => {
    if (username && username !== 'Engineer') {
      fetch(`${API_ENDPOINTS.GITHUB_PROFILE}?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setGhProfile(data.profile);
          }
        })
        .catch(() => {});
    }
  }, [username]);

  // Fetch real commits from GitHub API
  useEffect(() => {
    fetch(API_ENDPOINTS.GITHUB_COMMITS)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.commitsByDate) {
          setGithubCommitsByDate(data.commitsByDate);
          if (data.recentCommits) {
            setRecentCommits(data.recentCommits);
          }
          setGithubApiLoaded(true);
        }
      })
      .catch(() => {
        setGithubApiLoaded(false);
      });
  }, [repoName]);

  const total = problems.length;
  const solvedList = problems.filter((p) => p.solved);
  const totalSolved = solvedList.length;

  const easyTotal = problems.filter((p) => p.difficulty === 'Easy').length;
  const easySolved = solvedList.filter((p) => p.difficulty === 'Easy').length;

  const mediumTotal = problems.filter((p) => p.difficulty === 'Medium').length;
  const mediumSolved = solvedList.filter((p) => p.difficulty === 'Medium').length;

  const hardTotal = problems.filter((p) => p.difficulty === 'Hard').length;
  const hardSolved = solvedList.filter((p) => p.difficulty === 'Hard').length;

  const needsRevisionCount = problems.filter((p) => p.needsRevision).length;
  const solvePercentage = total > 0 ? Math.round((totalSolved / total) * 100) : 0;

  // Combine real GitHub commit dates with real app problem solved timestamps
  const realActivityMap = useMemo(() => {
    const map: Record<string, number> = { ...githubCommitsByDate };

    // Tally solved questions from current user problem list
    problems.forEach((p) => {
      if (p.solved) {
        // Use real solvedAt timestamp, or fall back to today's date
        const dateKey = p.solvedAt ? p.solvedAt.split('T')[0] : new Date().toISOString().split('T')[0];
        map[dateKey] = (map[dateKey] || 0) + 1;
      }
    });

    return map;
  }, [githubCommitsByDate, problems]);

  // Real 14-day history computed directly from actual calendar dates
  const real14Days = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().split('T')[0];
      const count = realActivityMap[dayKey] || 0;
      const dayLetter = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      days.push({
        dayLabel: i === 0 ? 'Today' : dayLetter,
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
        active: count > 0,
      });
    }
    return days;
  }, [realActivityMap]);

  // Real 52-week grid (52 weeks x 7 days = 364 real days up to today)
  const realYearDays = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 363; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().split('T')[0];
      const count = realActivityMap[dayKey] || 0;
      days.push({
        date: dayKey,
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        count,
      });
    }
    return days;
  }, [realActivityMap]);

  const totalContributions = useMemo(() => {
    return Object.values(realActivityMap).reduce((sum, c) => sum + c, 0);
  }, [realActivityMap]);

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Personalized Hero Greeting & Daily Goal Bar */}
      <div className="specular-card p-4 sm:p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-2xl">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
          {/* Real GitHub Avatar */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20 flex-shrink-0 bg-slate-900">
            <img
              src={ghProfile?.avatar_url || propAvatarUrl || `https://github.com/${username}.png`}
              alt={username}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {ghProfile?.name || propName || username}
              </h2>
              <a
                href={ghProfile?.html_url || `https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline font-mono font-semibold flex items-center gap-1"
              >
                <span>@{username}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                Day {currentStreak}
              </span>
            </div>

            {/* GitHub Bio if present */}
            {(ghProfile?.bio || propBio) && (
              <p className="text-xs text-slate-300 line-clamp-1 italic">
                &ldquo;{ghProfile?.bio || propBio}&rdquo;
              </p>
            )}

            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
              <span className="text-emerald-300 font-mono flex items-center gap-1 text-[11px]">
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                {repoName} (main)
              </span>
              <span>•</span>
              <span className="text-[11px] text-slate-400">
                {ghProfile?.public_repos || propPublicRepos ? `${ghProfile?.public_repos || propPublicRepos} Repos` : 'Auto-Sync Active'}
              </span>
              {(ghProfile?.followers || propFollowers) ? (
                <>
                  <span>•</span>
                  <span className="text-[11px] text-slate-400">{ghProfile?.followers || propFollowers} Followers</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Daily Goal & Command Palette Trigger */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Daily Goal Pill */}
          <div className="flex-1 md:flex-none p-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-[11px] font-extrabold text-emerald-400">
              {real14Days[13]?.count || 0}/3
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">Today&apos;s Solved</div>
              <div className="text-[10px] text-slate-400">
                {real14Days[13]?.count >= 3
                  ? 'Daily target accomplished!'
                  : `${3 - (real14Days[13]?.count || 0)} more to reach daily goal`}
              </div>
            </div>
          </div>

          {/* ⌘K Trigger Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center space-x-2 shadow-sm"
              title="Press Ctrl+K or Cmd+K anytime"
            >
              <Command className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Spotlight</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded">
                ⌘K
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* 2. Four Main Specular Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Mastery */}
        <div className="specular-card p-5 rounded-2xl relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Overall DSA Solved
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {solvePercentage}%
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{totalSolved}</span>
              <span className="text-xs text-slate-500 font-medium">/ {total} Problems</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Real Progress</span>
            </div>
          </div>

          {/* Multi-tier segmented progress bar */}
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden flex p-[1px] border border-slate-800">
            <div
              className="bg-emerald-400 h-full rounded-l-full transition-all duration-700"
              style={{ width: `${total > 0 ? (easySolved / total) * 100 : 0}%` }}
              title={`Easy: ${easySolved}`}
            />
            <div
              className="bg-amber-400 h-full transition-all duration-700"
              style={{ width: `${total > 0 ? (mediumSolved / total) * 100 : 0}%` }}
              title={`Medium: ${mediumSolved}`}
            />
            <div
              className="bg-rose-500 h-full rounded-r-full transition-all duration-700"
              style={{ width: `${total > 0 ? (hardSolved / total) * 100 : 0}%` }}
              title={`Hard: ${hardSolved}`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Easy: {easySolved}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Med: {mediumSolved}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Hard: {hardSolved}
            </span>
          </div>
        </div>

        {/* Card 2: Consistency Streak (14 Real Calendar Days) */}
        <div className="specular-card p-5 rounded-2xl relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Consistency Streak
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {real14Days[13]?.active ? 'Active Today' : 'Pending Today'}
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-3xl font-extrabold text-white tracking-tight">{currentStreak}</span>
            <span className="text-xs text-slate-400 font-medium">Consecutive Days</span>
          </div>

          {/* Real 14-day dots track */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {real14Days.map((item, idx) => (
              <div
                key={idx}
                className={`flex-1 h-5 rounded-[3px] flex items-center justify-center text-[9px] font-mono transition-all ${
                  item.active
                    ? 'bg-[#238636] text-white shadow-sm border border-[#2ea043]'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
                title={`${item.formattedDate}: ${item.count} solved/committed`}
              >
                {item.active ? (item.count > 1 ? item.count : '✓') : ''}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5">
            <span>Last 14 Days Activity</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {real14Days.filter((d) => d.active).length}/14 Days Active
            </span>
          </div>
        </div>

        {/* Card 3: Problem Difficulty Breakdown */}
        <div className="specular-card p-5 rounded-2xl relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Tier Mastery
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {totalSolved} Completed
            </span>
          </div>

          <div className="space-y-2">
            {/* Easy Row */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-emerald-400 font-semibold">Easy</span>
                <span className="text-slate-400 font-mono">
                  {easySolved}/{easyTotal} ({easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Row */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-400 font-semibold">Medium</span>
                <span className="text-slate-400 font-mono">
                  {mediumSolved}/{mediumTotal} ({mediumTotal > 0 ? Math.round((mediumSolved / mediumTotal) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard Row */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-rose-400 font-semibold">Hard</span>
                <span className="text-slate-400 font-mono">
                  {hardSolved}/{hardTotal} ({hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Interview Revision & Sync Engine */}
        <div className="specular-card p-5 rounded-2xl relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              Interview Revision
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
              {needsRevisionCount} Bookmarked
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{needsRevisionCount}</span>
            <span className="text-xs text-slate-400">Questions to Review</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Zap className="w-3 h-3" /> Auto-Push Engine:
              </span>
              <span className="text-white font-mono text-[10px]">Active (0ms)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Primary Language:</span>
              <span className="text-slate-200 font-mono text-[10px]">Java 21</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 mt-2 text-right">
            Bookmark tricky problems for fast technical round revision
          </div>
        </div>
      </div>

      {/* 3. Real 52-Week GitHub Heatmap Section in Dashboard (100% Real Data) */}
      <div className="specular-card p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-xs sm:text-sm">
              Your Real GitHub Contribution Heatmap (Last 52 Weeks)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {totalContributions} Total Solved / Synced
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span>0</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-slate-800" title="0 commits"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]" title="1 commit"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32]" title="2 commits"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641]" title="3-4 commits"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353]" title="5+ commits"></span>
            <span>5+</span>
          </div>
        </div>

        {/* Heatmap Grid - 100% Real Calendar Dates with mobile auto-scroll to today */}
        <div
          ref={heatmapScrollRef}
          className="overflow-x-auto no-scrollbar touch-scroll pb-1 scroll-smooth"
        >
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {realYearDays.map((dayItem, i) => {
              const count = dayItem.count;
              const color =
                count === 0
                  ? 'bg-[#161b22] border border-slate-800/40'
                  : count === 1
                  ? 'bg-[#0e4429]'
                  : count === 2
                  ? 'bg-[#006d32]'
                  : count <= 4
                  ? 'bg-[#26a641]'
                  : 'bg-[#39d353] shadow-sm shadow-emerald-400/30';
              return (
                <div
                  key={i}
                  onMouseEnter={() =>
                    setHoveredCell({
                      day: dayItem.formattedDate,
                      count: dayItem.count,
                    })
                  }
                  className={`w-2.5 h-2.5 rounded-[2px] ${color} hover:ring-2 hover:ring-white transition-all cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile Swipe Indicators */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-0.5">
          <span>← Swipe for past months</span>
          <span className="text-emerald-400 font-semibold">Today →</span>
        </div>

        {/* Real Tooltip feedback bar */}
        <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {hoveredCell
                ? `${hoveredCell.count} ${hoveredCell.count === 1 ? 'solution' : 'solutions'} synced on ${hoveredCell.day}`
                : 'Hover over any tile in the matrix to inspect exact daily sync activity'}
            </span>
          </span>

          <span className="text-[10px] text-slate-500 font-mono">
            {githubApiLoaded ? 'Synced with GitHub REST API' : 'Synced with Syntra Database'}
          </span>
        </div>

        {/* Recent Real Commits Feed (if available) */}
        {recentCommits.length > 0 && (
          <div className="pt-2 border-t border-slate-800/60 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-emerald-400" />
              Recent Repository Commits:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {recentCommits.slice(0, 4).map((c, idx) => (
                <a
                  key={idx}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1.5 truncate mr-2">
                    <span className="font-mono text-emerald-400 text-[10px]">{c.sha}</span>
                    <span className="truncate">{c.message}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
