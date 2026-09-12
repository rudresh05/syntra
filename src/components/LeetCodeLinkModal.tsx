'use client';

import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Award } from 'lucide-react';
import { Problem } from '@/types/dsa';
import { API_ENDPOINTS } from '@/config/api';

interface LeetCodeLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLeetCodeUsername?: string;
  onLeetCodeLinked: (username: string, fetchedProblems: Problem[]) => void;
}

export const LeetCodeLinkModal: React.FC<LeetCodeLinkModalProps> = ({
  isOpen,
  onClose,
  currentLeetCodeUsername = '',
  onLeetCodeLinked,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState(currentLeetCodeUsername);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fetchedStats, setFetchedStats] = useState<any | null>(null);

  const handleFetchAndLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setStatusMsg(null);
    setFetchedStats(null);

    try {
      const res = await fetch(API_ENDPOINTS.LEETCODE_FETCH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch LeetCode profile');

      setFetchedStats(data.profile);
      setStatusMsg({
        type: 'success',
        text: `Found ${data.profile.totalSolved} total solved problems on LeetCode for @${username}!`,
      });

      onLeetCodeLinked(username.trim(), data.fetchedProblems || []);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Could not fetch LeetCode user',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Connect LeetCode Profile</h3>
            <p className="text-xs text-zinc-400">Auto-fetch all past solved problems & stats</p>
          </div>
        </div>

        <form onSubmit={handleFetchAndLink} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">LeetCode Username</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="e.g. rudra123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap disabled:opacity-50 flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Fetching...' : 'Fetch'}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Make sure your LeetCode profile is public so GraphQL can fetch your solved count.
            </p>
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
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {fetchedStats && (
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white">Fetched LeetCode Stats</span>
                <span className="text-xs font-mono text-emerald-400">@{fetchedStats.username}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                  <div className="text-sm font-bold text-white">{fetchedStats.totalSolved}</div>
                  <div className="text-[10px] text-zinc-500">Total</div>
                </div>
                <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                  <div className="text-sm font-bold text-emerald-400">{fetchedStats.easySolved}</div>
                  <div className="text-[10px] text-zinc-500">Easy</div>
                </div>
                <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                  <div className="text-sm font-bold text-amber-400">{fetchedStats.mediumSolved}</div>
                  <div className="text-[10px] text-zinc-500">Medium</div>
                </div>
                <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                  <div className="text-sm font-bold text-rose-400">{fetchedStats.hardSolved}</div>
                  <div className="text-[10px] text-zinc-500">Hard</div>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 font-semibold text-zinc-300 text-xs rounded-xl transition-all"
          >
            Done & Save to Syntra
          </button>
        </form>
      </div>
    </div>
  );
};
