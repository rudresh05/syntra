'use client';

import React, { useState } from 'react';
import { GitHubConfig } from '@/types/dsa';
import { Github, X, Check, Key, User, FolderGit2, GitBranch, AlertCircle, ShieldCheck } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

interface GitHubSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GitHubConfig;
  onSaveConfig: (newConfig: GitHubConfig) => void;
}

export const GitHubSettingsModal: React.FC<GitHubSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [token, setToken] = useState(config.token || '');
  const [username, setUsername] = useState(config.username || '');
  const [repo, setRepo] = useState(config.repo || 'leetcode-dsa-solutions');
  const [branch, setBranch] = useState(config.branch || 'main');
  const [isTesting, setIsTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMsg(null);

    try {
      // Test and save securely through backend API (zero token leak)
      const res = await fetch(API_ENDPOINTS.AUTH_GITHUB_PAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, owner: username, repo }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not access repository. Verify Token permissions & Repo name!');
      }

      const newConfig: GitHubConfig = {
        token: '', // Never persist token in client storage
        username,
        repo,
        branch: branch || 'main',
        isConfigured: true,
      };

      onSaveConfig(newConfig);
      setStatusMsg({
        type: 'success',
        text: `Connected securely to github.com/${username}/${repo}!`,
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to connect to GitHub',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">GitHub Repository Config</h3>
            <p className="text-xs text-zinc-400">Connect your repo to auto-push accepted solutions</p>
          </div>
        </div>

        <form onSubmit={handleTestAndSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              GitHub Personal Access Token (PAT)
            </label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Token needs <code className="text-emerald-400">repo</code> scope permission.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              GitHub Username
            </label>
            <input
              type="text"
              placeholder="e.g. rudra"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              Repository Name
            </label>
            <input
              type="text"
              placeholder="e.g. leetcode-dsa-solutions"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              Branch
            </label>
            <input
              type="text"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {statusMsg && (
            <div
              className={`p-3 rounded-xl flex items-center space-x-2 text-xs ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isTesting}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {isTesting ? 'Verifying GitHub Repo...' : 'Save & Test GitHub Connection'}
          </button>
        </form>
      </div>
    </div>
  );
};
