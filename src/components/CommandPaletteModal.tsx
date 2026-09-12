'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Code2,
  Layers,
  Puzzle,
  Github,
  Sparkles,
  ExternalLink,
  ArrowRight,
  X,
  Bookmark,
  CheckCircle2,
  Command,
  User,
} from 'lucide-react';
import { Problem } from '@/types/dsa';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  onOpenGitHubModal: () => void;
  onOpenLeetCodeModal: () => void;
  onOpenExtensionModal: () => void;
  onSwitchTab: (tab: 'problems' | 'sheets' | 'profile' | 'extension') => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  problems,
  onSelectProblem,
  onOpenGitHubModal,
  onOpenLeetCodeModal,
  onOpenExtensionModal,
  onSwitchTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape, keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return problems.slice(0, 8);
    }
    const q = query.toLowerCase();
    return problems
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          String(p.number).includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [query, problems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#090d16] border border-slate-700/80 shadow-2xl overflow-hidden specular-card">
        {/* Search Bar Header */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 sm:mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search problem #, title, or topic..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="sm:hidden ml-2 p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick System Actions (When query is short or empty) */}
        {!query.trim() && (
          <div className="p-2 border-b border-slate-800/80 bg-slate-950/40">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
              Quick Actions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-1 text-xs">
              <button
                onClick={() => {
                  onClose();
                  onOpenLeetCodeModal();
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Fetch LeetCode History</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenGitHubModal();
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors text-left"
              >
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <span>GitHub Sync Settings</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onSwitchTab('sheets');
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors text-left"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Blind 75 Roadmaps</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onSwitchTab('profile');
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>My Developer Profile</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenExtensionModal();
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors text-left"
              >
                <Puzzle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Extension Install Guide</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            {query.trim() ? `Search Results (${searchResults.length})` : 'Popular Problems'}
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No algorithmic problems found matching &quot;{query}&quot;
            </div>
          ) : (
            searchResults.map((prob, idx) => (
              <div
                key={prob.id}
                onClick={() => {
                  onSelectProblem(prob);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                  idx === selectedIndex
                    ? 'bg-emerald-500/10 text-white border border-emerald-500/30'
                    : 'hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="font-mono text-slate-500 text-[11px] flex-shrink-0">
                    #{String(prob.number).padStart(4, '0')}
                  </span>
                  <span className="font-semibold truncate">{prob.title}</span>
                  {prob.solved && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    {prob.topics[0]}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      prob.difficulty === 'Easy'
                        ? 'bg-[#00b8a3]/10 text-[#00b8a3] border-[#00b8a3]/30'
                        : prob.difficulty === 'Medium'
                        ? 'bg-[#ffc01e]/10 text-[#ffc01e] border-[#ffc01e]/30'
                        : 'bg-[#ff375f]/10 text-[#ff375f] border-[#ff375f]/30'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Navigation:</span>
            <span className="font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
              Click or ESC
            </span>
          </div>
          <span>Syntra Instant Search</span>
        </div>
      </div>
    </div>
  );
};
