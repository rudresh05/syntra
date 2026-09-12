'use client';

import React, { useState } from 'react';
import { Problem, ProgrammingLanguage } from '@/types/dsa';
import { X, ExternalLink, Github, Save, Code, FileText, Zap, RefreshCw, Bookmark, Check } from 'lucide-react';
import { getLeetCodeProblemUrl } from '@/config/api';

interface ProblemDetailModalProps {
  problem: Problem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProblem: (updated: Problem) => void;
  onPushToGitHub: (problem: Problem) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  isOpen,
  onClose,
  onUpdateProblem,
  onPushToGitHub,
}) => {
  if (!isOpen || !problem) return null;

  const [code, setCode] = useState(problem.code || '');
  const [language, setLanguage] = useState<ProgrammingLanguage>(problem.language || 'java');
  const [notes, setNotes] = useState(problem.notes || '');
  const [needsRevision, setNeedsRevision] = useState(!!problem.needsRevision);
  const [savedStatus, setSavedStatus] = useState(false);
  const [codeError, setCodeError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    onUpdateProblem({
      ...problem,
      code,
      language,
      notes,
      needsRevision,
      solved: true,
      solvedAt: problem.solvedAt || new Date().toISOString(),
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 1500);
  };

  const handlePushNow = () => {
    if (!code.trim() || code.trim().startsWith('// Solution for')) {
      setCodeError('Please paste your Java/C++ solution code above before pushing to GitHub.');
      return;
    }
    setCodeError('');
    const updated = {
      ...problem,
      code,
      language,
      notes,
      needsRevision,
      solved: true,
      solvedAt: problem.solvedAt || new Date().toISOString(),
    };
    onUpdateProblem(updated);
    onPushToGitHub(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="specular-card bg-[#070c18] border border-slate-800 w-full max-w-3xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between pr-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                #{String(problem.number).padStart(4, '0')}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">{problem.title}</h3>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
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
            <div className="flex items-center space-x-3 mt-2">
              <a
                href={getLeetCodeProblemUrl(problem.titleSlug)}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View on LeetCode</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {problem.githubUrl && (
                <>
                  <span className="text-slate-700">•</span>
                  <a
                    href={problem.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono"
                  >
                    <Github className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View GitHub Directory</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Performance & Topic Badges */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Runtime: <strong className="text-white font-mono">{problem.runtime || 'N/A'}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="text-slate-400">
            Memory: <strong className="text-white font-mono">{problem.memory || 'N/A'}</strong>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-slate-500">Topics:</span>
            {problem.topics.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[11px] border border-slate-800 font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Form to Edit Code & Notes */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-400" />
              Solution Source Code
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="java">Java 21 (Default)</option>
              <option value="cpp">C++ 20</option>
              <option value="python3">Python 3</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="golang">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            placeholder="// Paste or edit your solution code here..."
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 leading-relaxed shadow-inner"
          />

          {codeError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
              {codeError}
            </div>
          )}

          <div>
            <label className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              Key Learnings & Notes (Intuition, Time/Space Complexity)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Solved using Two Pointers with HashMap complement lookup. Time: O(N), Space: O(N)."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="revisionCheck"
              checked={needsRevision}
              onChange={(e) => setNeedsRevision(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 accent-emerald-500"
            />
            <label htmlFor="revisionCheck" className="text-slate-300 font-semibold cursor-pointer">
              Tag for technical interview revision
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handlePushNow}
              className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 hover:text-emerald-400 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>Push to GitHub</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-slate-400 hover:text-white transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-xs"
              >
                {savedStatus ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedStatus ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
