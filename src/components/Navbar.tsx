'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Code2,
  Github,
  Puzzle,
  Plus,
  Sparkles,
  Flame,
  CheckCircle2,
  User,
  LogOut,
  FolderGit2,
  GitBranch,
  Layers,
  ChevronDown,
  ExternalLink,
  Settings,
  RefreshCw,
  Search,
  Command,
} from 'lucide-react';
import { GitHubConfig } from '@/types/dsa';
import { UserSession } from '@/lib/auth-cookies';

interface NavbarProps {
  activeTab: 'problems' | 'sheets' | 'profile' | 'extension';
  setActiveTab: (tab: 'problems' | 'sheets' | 'profile' | 'extension') => void;
  githubConfig: GitHubConfig;
  user: UserSession | null;
  leetcodeUsername?: string;
  onOpenGitHubModal: () => void;
  onOpenExtensionModal: () => void;
  onOpenAddModal: () => void;
  onOpenAuthModal: () => void;
  onOpenLeetCodeModal: () => void;
  onOpenCommandPalette?: () => void;
  onLogout: () => void;
  currentStreak: number;
  totalSolved: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  githubConfig,
  user,
  leetcodeUsername,
  onOpenGitHubModal,
  onOpenExtensionModal,
  onOpenAddModal,
  onOpenAuthModal,
  onOpenLeetCodeModal,
  onOpenCommandPalette,
  onLogout,
  currentStreak,
  totalSolved,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-2xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Clean Brand + Workspace Breadcrumb */}
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 border border-emerald-500/40 bg-slate-900 flex-shrink-0">
              <img src="/logo.png" alt="Syntra Logo" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SYNTRA
              </span>
              <span className="text-slate-600 font-light">/</span>
              
              {/* Workspace / Repository Pill */}
              <button
                onClick={onOpenGitHubModal}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-mono group"
                title="Configure GitHub sync repository"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold truncate max-w-[150px]">
                  {githubConfig.isConfigured ? githubConfig.repo : 'connect-repo'}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    githubConfig.isConfigured ? 'bg-emerald-400 shadow-sm shadow-emerald-400/80' : 'bg-amber-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* CENTER: Minimalist Segmented Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'problems'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Problems</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                {totalSolved}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'sheets'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Roadmaps</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'profile'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('extension')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'extension'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Extension</span>
            </button>
          </nav>

          {/* RIGHT: Compact Streak + Add Action + User Dropdown */}
          <div className="flex items-center space-x-2.5">
            {/* Spotlight ⌘K Trigger */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs"
                title="Search anything (⌘K or Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search</span>
                <kbd className="px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Streak Counter with Flame */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{currentStreak}d</span>
            </div>

            {/* Add Problem Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>

            {/* User Dropdown Menu */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                >
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-emerald-500/40 bg-slate-800 flex-shrink-0">
                    <img
                      src={user.avatarUrl || `https://github.com/${user.githubOwner || user.username}.png`}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden md:inline font-mono font-semibold text-slate-200">
                    {user.username}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      userMenuOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Card */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-[300px] rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl p-3 z-50 specular-card animate-fade-in space-y-2 text-xs">
                    {/* User GitHub Profile Header */}
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 flex-shrink-0 bg-slate-900">
                          <img
                            src={user.avatarUrl || `https://github.com/${user.githubOwner || user.username}.png`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-white text-xs truncate">
                            {user.name || user.username}
                          </div>
                          <div className="font-mono text-[11px] text-emerald-400 truncate">
                            @{user.githubOwner || user.username}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          PRO
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-[11px] text-slate-400 italic line-clamp-2">
                          {user.bio}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/60">
                        <span>{user.publicRepos !== undefined ? `${user.publicRepos} Repos` : 'GitHub Sync'}</span>
                        <span>{user.followers !== undefined ? `${user.followers} Followers` : 'Developer'}</span>
                        <a
                          href={user.htmlUrl || `https://github.com/${user.githubOwner || user.username}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-0.5 font-semibold"
                        >
                          <span>Profile</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Sync Status Info */}
                    <div className="space-y-1 pt-1">
                      {/* Full Profile View row */}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('profile');
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-800/60 flex items-center justify-between text-left text-slate-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-semibold text-white">Full Developer Profile</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          View
                        </span>
                      </button>

                      {/* LeetCode link row */}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenLeetCodeModal();
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-800/60 flex items-center justify-between text-left text-slate-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>LeetCode Account</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {leetcodeUsername ? `@${leetcodeUsername}` : 'Connect'}
                        </span>
                      </button>

                      {/* GitHub sync row */}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenGitHubModal();
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-800/60 flex items-center justify-between text-left text-slate-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Github className="w-3.5 h-3.5 text-emerald-400" />
                          <span>GitHub Settings</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 truncate max-w-[90px]">
                          {githubConfig.isConfigured ? githubConfig.repo : 'Configure'}
                        </span>
                      </button>

                      {/* Extension guide row */}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenExtensionModal();
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-800/60 flex items-center justify-between text-left text-slate-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Extension Guide</span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold">Active</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 flex items-center space-x-2 transition-colors font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Syntra</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 font-semibold text-xs transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Native-feel Mobile Bottom Navigation Bar */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060a14]/95 backdrop-blur-2xl border-t border-slate-800/90 px-2 py-1.5 safe-bottom shadow-2xl">
      <div className="flex items-center justify-around">
        {/* Problems Tab */}
        <button
          onClick={() => setActiveTab('problems')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'problems'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Code2 className="w-5 h-5" />
            {totalSolved > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-mono px-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold leading-tight">
                {totalSolved}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Problems</span>
        </button>

        {/* Roadmaps Tab */}
        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'sheets'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Roadmaps</span>
        </button>

        {/* Quick Spotlight Search Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
            title="Open Command Palette"
          >
            <div className="p-1 rounded-xl bg-slate-800/90 border border-slate-700 text-emerald-400 shadow-sm">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Search</span>
          </button>
        )}

        {/* Profile Tab */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Profile</span>
        </button>

        {/* Extension Tab */}
        <button
          onClick={() => setActiveTab('extension')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'extension'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Puzzle className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Extension</span>
        </button>

        {/* GitHub Repo Quick Modal */}
        <button
          onClick={onOpenGitHubModal}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-white transition-all relative"
        >
          <div className="relative">
            <FolderGit2 className="w-5 h-5" />
            <span
              className={`absolute -top-0.5 -right-1 w-2 h-2 rounded-full border border-[#060a14] ${
                githubConfig.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-[55px]">
            {githubConfig.isConfigured ? 'Repo' : 'Connect'}
          </span>
        </button>
      </div>
    </div>
    </>
  );
};
