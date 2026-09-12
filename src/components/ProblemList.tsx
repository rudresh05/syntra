'use client';

import React, { useState } from 'react';
import { Problem, Difficulty } from '@/types/dsa';
import {
  Search,
  ExternalLink,
  Github,
  Code,
  Code2,
  Bookmark,
  CheckCircle2,
  Circle,
  Filter,
  RefreshCw,
  Sparkles,
  CheckSquare,
  Square,
  Tag,
} from 'lucide-react';
import { getLeetCodeProblemUrl } from '@/config/api';

interface ProblemListProps {
  problems: Problem[];
  onToggleSolved: (id: string) => void;
  onToggleRevision: (id: string) => void;
  onOpenDetail: (problem: Problem) => void;
  onPushToGitHub: (problem: Problem) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  onToggleSolved,
  onToggleRevision,
  onOpenDetail,
  onPushToGitHub,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  // Extract unique topic list
  const allTopics = Array.from(
    new Set(problems.flatMap((p) => p.topics))
  ).sort();

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.number.toString().includes(searchTerm) ||
      p.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDiff =
      difficultyFilter === 'All' || p.difficulty === difficultyFilter;

    let matchesStatus = true;
    if (statusFilter === 'Solved') matchesStatus = p.solved;
    if (statusFilter === 'Unsolved') matchesStatus = !p.solved;
    if (statusFilter === 'Revision') matchesStatus = !!p.needsRevision;

    const matchesTopic =
      selectedTopic === 'All' || p.topics.includes(selectedTopic);

    return matchesSearch && matchesDiff && matchesStatus && matchesTopic;
  });

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-[#00b8a3]/15 text-[#00b8a3] border-[#00b8a3]/35';
      case 'Medium':
        return 'bg-[#ffc01e]/15 text-[#ffc01e] border-[#ffc01e]/35';
      case 'Hard':
        return 'bg-[#ff375f]/15 text-[#ff375f] border-[#ff375f]/35';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const solvedCount = problems.filter((p) => p.solved).length;
  const revisionCount = problems.filter((p) => p.needsRevision).length;

  return (
    <div className="specular-card rounded-2xl p-3.5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
      {/* Header & Quick Stat Chips */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Curated LeetCode Problem Bank</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {solvedCount} Solved
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredProblems.length} of {problems.length} questions • Auto-syncs to GitHub on solve
          </p>
        </div>

        {/* Search input with keyboard feel */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search #, title, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            /
          </span>
        </div>
      </div>

      {/* Filter Chips Bar (Touch-scrollable on mobile) */}
      <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-800/80 text-xs overflow-x-auto no-scrollbar touch-scroll">
        <span className="text-slate-400 flex items-center gap-1 font-semibold mr-1 text-[11px] whitespace-nowrap flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filters:
        </span>

        {/* Difficulty Filter */}
        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficultyFilter(diff)}
            className={`px-3 py-1 rounded-lg border font-semibold text-[11px] whitespace-nowrap flex-shrink-0 transition-all ${
              difficultyFilter === diff
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {diff}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-800 mx-1 flex-shrink-0" />

        {/* Status Filter */}
        {['All', 'Solved', 'Unsolved', 'Revision'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg border font-semibold text-[11px] whitespace-nowrap flex-shrink-0 transition-all ${
              statusFilter === st
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {st} {st === 'Revision' && revisionCount > 0 ? `(${revisionCount})` : ''}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-800 mx-1 flex-shrink-0" />

        {/* Topic dropdown */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] whitespace-nowrap flex-shrink-0 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Topics ({allTopics.length})</option>
          {allTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Touch Cards View (md:hidden) */}
      <div className="md:hidden space-y-2.5">
        {filteredProblems.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
            No problems match your current search/filters.
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="specular-card p-3.5 rounded-xl border border-slate-800/80 space-y-2.5 bg-[#080d19]/80"
            >
              {/* Header: Status + ID + Title + Difficulty */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5 min-w-0">
                  <button
                    onClick={() => onToggleSolved(problem.id)}
                    className="mt-0.5 text-slate-600 hover:text-emerald-400 transition-colors p-1 -m-1 flex-shrink-0"
                    title={problem.solved ? 'Mark as Unsolved' : 'Mark as Solved'}
                  >
                    {problem.solved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-slate-500 text-[10px]">
                        #{String(problem.number).padStart(4, '0')}
                      </span>
                      <a
                        href={getLeetCodeProblemUrl(problem.titleSlug)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-sm text-white hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      >
                        <span className={problem.solved ? 'text-slate-300' : 'text-white'}>
                          {problem.title}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      </a>
                    </div>

                    {/* Topic Tags */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {problem.topics.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getDifficultyBadge(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                  {problem.needsRevision && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                      Review
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/70 text-xs">
                <button
                  onClick={() => onOpenDetail(problem)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all font-semibold flex items-center justify-center space-x-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Code & Notes</span>
                </button>

                <button
                  onClick={() => onToggleRevision(problem.id)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    problem.needsRevision
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-amber-400'
                  }`}
                  title={problem.needsRevision ? 'Remove review bookmark' : 'Bookmark for review'}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                {problem.githubUrl ? (
                  <a
                    href={problem.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold transition-all flex items-center space-x-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Synced</span>
                  </a>
                ) : (
                  <button
                    onClick={() => onPushToGitHub(problem)}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-emerald-400 transition-all font-semibold flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Push</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (hidden md:block) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#070b16] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4 w-20 font-mono">ID</th>
              <th className="py-3 px-4">Title & LeetCode Link</th>
              <th className="py-3 px-4 w-28">Difficulty</th>
              <th className="py-3 px-4">Topic Tags</th>
              <th className="py-3 px-4 w-44 text-right">Actions & GitHub</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                  No problems match your current search/filters.
                </td>
              </tr>
            ) : (
              filteredProblems.map((problem) => (
                <tr
                  key={problem.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Status Checkbox */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleSolved(problem.id)}
                      className="text-slate-600 hover:text-emerald-400 transition-colors"
                      title={problem.solved ? 'Mark as Unsolved' : 'Mark as Solved'}
                    >
                      {problem.solved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </td>

                  {/* Problem Number */}
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    #{String(problem.number).padStart(4, '0')}
                  </td>

                  {/* Problem Title & LeetCode Link */}
                  <td className="py-3 px-4 font-semibold text-white">
                    <div className="flex items-center space-x-2">
                      <a
                        href={getLeetCodeProblemUrl(problem.titleSlug)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-emerald-400 flex items-center space-x-1.5 transition-colors"
                      >
                        <span className={problem.solved ? 'text-slate-300' : 'text-white'}>
                          {problem.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </a>
                      {problem.needsRevision && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                          Review
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-block ${getDifficultyBadge(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  {/* Topics */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                        >
                          {topic}
                        </span>
                      ))}
                      {problem.topics.length > 3 && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          +{problem.topics.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions & GitHub Link */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Revision Toggle */}
                      <button
                        onClick={() => onToggleRevision(problem.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          problem.needsRevision
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-amber-400 hover:border-slate-700'
                        }`}
                        title={
                          problem.needsRevision
                            ? 'Remove from Revision List'
                            : 'Mark for Revision'
                        }
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      {/* View Code / Notes Modal */}
                      <button
                        onClick={() => onOpenDetail(problem)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                        title="View Java Code & Notes"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>

                      {/* GitHub Link or Push Button */}
                      {problem.githubUrl ? (
                        <a
                          href={problem.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center space-x-1"
                          title="Open Solution in GitHub Repo"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono hidden sm:inline">Synced</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => onPushToGitHub(problem)}
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all flex items-center space-x-1"
                          title="Push Solution to GitHub"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono hidden sm:inline">Push</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
