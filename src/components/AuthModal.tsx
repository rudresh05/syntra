'use client';

import React, { useState } from 'react';
import { X, Github, User, Mail, Lock, Key, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { UserSession } from '@/lib/auth-cookies';
import { API_ENDPOINTS } from '@/config/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'oauth' | 'pat' | 'login' | 'register'>('oauth');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepo, setGithubRepo] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1-Click "Continue with GitHub" OAuth Handler
  const handleGitHubOAuthClick = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_GITHUB_URL);
      const data = await res.json();

      if (data.url && data.clientIdConfigured) {
        // Redirect to GitHub OAuth Authorization Page
        window.location.href = data.url;
      } else {
        // Fallback to Token sign in if OAuth Client ID is not set in env
        setMode('pat');
        setErrorMsg('To use 1-click OAuth, add GITHUB_CLIENT_ID to .env. You can sign in using your GitHub Token below!');
      }
    } catch (err: any) {
      setMode('pat');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubPATLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_GITHUB_PAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken, owner: githubOwner, repo: githubRepo }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'GitHub connection failed');

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username || email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
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

        {/* Modal Title */}
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 border border-emerald-500/30">
            <img src="/logo.jpg" alt="Syntra Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Welcome to SYNTRA</h3>
            <p className="text-xs text-zinc-400">Sign in to save your DSA progress & auto-sync</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click "Continue with GitHub" Button (LeetCode style) */}
        <div className="space-y-4">
          <button
            onClick={handleGitHubOAuthClick}
            disabled={loading}
            className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl border border-zinc-700 transition-all flex items-center justify-center space-x-3 shadow-lg group"
          >
            <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            <span>Continue with GitHub</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-800" />
            <span className="bg-zinc-900 px-3 text-[11px] text-zinc-500 uppercase tracking-wider font-semibold absolute">
              OR
            </span>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => { setMode('pat'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              mode === 'pat' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3 h-3 text-emerald-400" />
            <span>GitHub PAT</span>
          </button>
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Mode 1: GitHub PAT Token Login */}
        {mode === 'pat' && (
          <form onSubmit={handleGitHubPATLogin} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-emerald-400" /> GitHub Token (PAT)
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">GitHub Username</label>
                <input
                  type="text"
                  placeholder="e.g. rudra"
                  value={githubOwner}
                  onChange={(e) => setGithubOwner(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Repo Name</label>
                <input
                  type="text"
                  placeholder="leetcode-solutions"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Github className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In with Token'}</span>
            </button>
          </form>
        )}

        {/* Mode 2: Manual Login */}
        {mode === 'login' && (
          <form onSubmit={handleManualLogin} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Username or Email
              </label>
              <input
                type="text"
                placeholder="rudra@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In to Syntra'}
            </button>
          </form>
        )}

        {/* Mode 3: Manual Register */}
        {mode === 'register' && (
          <form onSubmit={handleManualRegister} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Username
              </label>
              <input
                type="text"
                placeholder="rudra"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address
              </label>
              <input
                type="email"
                placeholder="rudra@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Syntra Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
