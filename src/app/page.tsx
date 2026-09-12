'use client';

import React, { useState, useEffect } from 'react';
import { Problem, GitHubConfig } from '@/types/dsa';
import { INITIAL_PROBLEMS } from '@/data/sheetsData';
import { Navbar } from '@/components/Navbar';
import { DashboardStats } from '@/components/DashboardStats';
import { ProblemList } from '@/components/ProblemList';
import { RoadmapSheetView } from '@/components/RoadmapSheetView';
import { GitHubSettingsModal } from '@/components/GitHubSettingsModal';
import { ExtensionGuideModal } from '@/components/ExtensionGuideModal';
import { ProblemDetailModal } from '@/components/ProblemDetailModal';
import { AddProblemModal } from '@/components/AddProblemModal';
import { AuthModal } from '@/components/AuthModal';
import { LeetCodeLinkModal } from '@/components/LeetCodeLinkModal';
import { CommandPaletteModal } from '@/components/CommandPaletteModal';
import { LandingPage } from '@/components/LandingPage';
import { UserProfileView } from '@/components/UserProfileView';
import { UserSession, getSessionCookie, removeSessionCookie } from '@/lib/auth-cookies';
import { API_ENDPOINTS } from '@/config/api';
import { Puzzle, Github, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState<'problems' | 'sheets' | 'profile' | 'extension'>('problems');
  const [user, setUser] = useState<UserSession | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [leetcodeUsername, setLeetcodeUsername] = useState<string>('');

  const [githubConfig, setGithubConfig] = useState<GitHubConfig>({
    token: '',
    username: '',
    repo: '',
    branch: 'main',
    isConfigured: false,
  });

  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLeetCodeModalOpen, setIsLeetCodeModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [currentStreak, setCurrentStreak] = useState(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Global keyboard shortcut for Spotlight / Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load User Session from Cookies on mount
  useEffect(() => {
    // Quick synchronous cookie check first
    const localSession = getSessionCookie();
    if (localSession) {
      setUser(localSession);
      if (localSession.githubToken && localSession.githubOwner && localSession.githubRepo) {
        setGithubConfig({
          token: localSession.githubToken,
          username: localSession.githubOwner,
          repo: localSession.githubRepo,
          branch: 'main',
          isConfigured: true,
        });
      }
    }

    // Safety timeout to ensure loading screen never gets stuck
    const safetyTimer = setTimeout(() => {
      setLoadingAuth(false);
    }, 400);

    // Verify session with server
    fetch(API_ENDPOINTS.AUTH_ME)
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);

          // Fetch full GitHub profile
          const ghOwner = data.user.githubOwner || data.user.username;
          if (ghOwner) {
            fetch(`${API_ENDPOINTS.GITHUB_PROFILE}?username=${ghOwner}`)
              .then((r) => r.json())
              .then((pData) => {
                if (pData.success && pData.profile) {
                  setUser((prev) =>
                    prev
                      ? {
                          ...prev,
                          avatarUrl: pData.profile.avatar_url,
                          name: pData.profile.name,
                          bio: pData.profile.bio,
                          publicRepos: pData.profile.public_repos,
                          followers: pData.profile.followers,
                          htmlUrl: pData.profile.html_url,
                        }
                      : prev
                  );
                }
              })
              .catch(() => {});
          }

          setGithubConfig({
            token: '', // Never store raw tokens in frontend state
            username: data.user.githubOwner || data.user.username || '',
            repo: data.user.githubRepo || 'leetcode-dsa-solutions',
            branch: 'main',
            isConfigured: Boolean(data.user.hasGithubToken || data.user.authProvider === 'github'),
          });
        } else if (!localSession) {
          setUser(null);
        }
      })
      .catch(() => {
        if (localSession) setUser(localSession);
      })
      .finally(() => {
        clearTimeout(safetyTimer);
        setLoadingAuth(false);
        if (typeof window !== 'undefined' && window.location.search.includes('auth_success')) {
          window.history.replaceState({}, '', '/');
          showToast('Logged in with GitHub successfully!');
        }
      });

    // Load stored LeetCode username & problems
    const savedLcUser = localStorage.getItem('syntra_leetcode_username');
    if (savedLcUser) setLeetcodeUsername(savedLcUser);

    const savedProblems = localStorage.getItem('leetcode_dsa_problems');
    if (savedProblems) {
      try {
        const parsed: Problem[] = JSON.parse(savedProblems);
        const savedMap = new Map<string, Problem>();
        parsed.forEach((p) => savedMap.set(p.titleSlug, p));

        // Merge full 150 questions with user's saved status & notes
        const merged: Problem[] = INITIAL_PROBLEMS.map((init) => {
          const userState = savedMap.get(init.titleSlug);
          return userState ? { ...init, ...userState } : init;
        });

        // Add any custom questions user created that are not in INITIAL_PROBLEMS
        const initialSlugs = new Set(INITIAL_PROBLEMS.map((p) => p.titleSlug));
        parsed.forEach((p) => {
          if (!initialSlugs.has(p.titleSlug)) {
            merged.push(p);
          }
        });

        setProblems(merged);
      } catch (e) {
        setProblems(INITIAL_PROBLEMS);
      }
    } else {
      setProblems(INITIAL_PROBLEMS);
    }
  }, []);

  // Save problems to Storage
  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem('leetcode_dsa_problems', JSON.stringify(problems));
    }
  }, [problems]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveGitHubConfig = (newConfig: GitHubConfig) => {
    setGithubConfig(newConfig);
    localStorage.setItem('leetcode_dsa_github_config', JSON.stringify(newConfig));
    showToast(`GitHub repository linked: ${newConfig.username}/${newConfig.repo}`);
  };

  const handleAuthSuccess = (userSession: UserSession) => {
    setUser(userSession);
    showToast(`Welcome @${userSession.username}! Logged in successfully.`);
    if (userSession.githubToken && userSession.githubOwner && userSession.githubRepo) {
      handleSaveGitHubConfig({
        token: userSession.githubToken,
        username: userSession.githubOwner,
        repo: userSession.githubRepo,
        branch: 'main',
        isConfigured: true,
      });
    }
  };

  const handleLogout = async () => {
    await fetch(API_ENDPOINTS.AUTH_LOGOUT, { method: 'POST' });
    removeSessionCookie();
    setUser(null);
    showToast('Logged out of Syntra.');
  };

  const handleLeetCodeLinked = (username: string, fetchedProblems: Problem[]) => {
    setLeetcodeUsername(username);
    localStorage.setItem('syntra_leetcode_username', username);

    if (fetchedProblems.length > 0) {
      setProblems((prev) => {
        const existingSlugs = new Set(prev.map((p) => p.titleSlug));
        const newAdditions = fetchedProblems.filter((p) => !existingSlugs.has(p.titleSlug));
        const updated = prev.map((p) => {
          const match = fetchedProblems.find((fp) => fp.titleSlug === p.titleSlug);
          if (match) return { ...p, solved: true, solvedAt: match.solvedAt };
          return p;
        });
        return [...newAdditions, ...updated];
      });

      showToast(`Automatically synced ${fetchedProblems.length} recent accepted submissions from LeetCode!`);
    } else {
      showToast(`Linked LeetCode profile @${username}!`);
    }
  };

  const handleToggleSolved = (id: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const solved = !p.solved;
          return {
            ...p,
            solved,
            solvedAt: solved ? new Date().toISOString() : undefined,
          };
        }
        return p;
      })
    );
  };

  const handleToggleRevision = (id: string) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, needsRevision: !p.needsRevision } : p))
    );
  };

  const handleUpdateProblem = (updated: Problem) => {
    setProblems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProblem(updated);
    showToast(`Saved notes for #${updated.number} ${updated.title}`);
  };

  const handleAddProblem = (newProblem: Problem) => {
    setProblems((prev) => [newProblem, ...prev]);
    showToast(`Added #${newProblem.number} ${newProblem.title} to tracker!`);
  };

  const handlePushToGitHub = async (problem: Problem) => {
    if (!githubConfig.isConfigured && !user?.hasGithubToken && user?.authProvider !== 'github') {
      setIsGitHubModalOpen(true);
      return;
    }

    // Require actual code before pushing to GitHub
    if (!problem.code || !problem.code.trim() || problem.code.trim().startsWith('// Solution for')) {
      setSelectedProblem(problem);
      showToast('Please paste your solution code in the modal before pushing to GitHub!');
      return;
    }

    showToast(`Pushing #${problem.number} ${problem.title} to GitHub...`);

    try {
      const res = await fetch(API_ENDPOINTS.GITHUB_SYNC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: githubConfig.username || user?.username,
          repo: githubConfig.repo || 'leetcode-dsa-solutions',
          branch: githubConfig.branch || 'main',
          problemNumber: problem.number,
          problemTitle: problem.title,
          problemSlug: problem.titleSlug,
          difficulty: problem.difficulty,
          topics: problem.topics,
          code: problem.code,
          language: problem.language || 'java',
          runtime: problem.runtime,
          memory: problem.memory,
          description: problem.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to push');

      const updated: Problem = {
        ...problem,
        githubUrl: data.githubUrl,
        solved: true,
      };

      setProblems((prev) => prev.map((p) => (p.id === problem.id ? updated : p)));
      if (selectedProblem?.id === problem.id) setSelectedProblem(updated);

      showToast(`Pushed #${problem.number} ${problem.title} to GitHub!`);
    } catch (err: any) {
      showToast(`GitHub Sync Error: ${err.message}`);
    }
  };

  const totalSolved = problems.filter((p) => p.solved).length;

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-emerald-400 font-bold text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" />
        <span>Loading SYNTRA...</span>
      </div>
    );
  }

  // IF USER IS NOT LOGGED IN: Render Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenGitHubAuth={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // IF USER IS LOGGED IN: Render Full Syntra Dashboard
  return (
    <div className="min-h-screen pb-16 bg-[#030712] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="aurora-gradient absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0" />
      <div className="bg-grid-pattern absolute inset-0 opacity-60 pointer-events-none z-0" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 specular-card border border-emerald-500/60 text-emerald-300 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        githubConfig={githubConfig}
        user={user}
        leetcodeUsername={leetcodeUsername}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenLeetCodeModal={() => setIsLeetCodeModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onLogout={handleLogout}
        currentStreak={currentStreak}
        totalSolved={totalSolved}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-24 md:pb-8 space-y-6 sm:space-y-8 relative z-10">
        {/* LeetCode Sync Banner if LeetCode not linked */}
        {!leetcodeUsername && activeTab !== 'profile' && (
          <div className="specular-card border border-amber-500/40 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Connect LeetCode Account & Auto-Fetch Solved History</h3>
                <p className="text-xs text-slate-400">
                  Link your LeetCode username to automatically import your past accepted submissions into your dashboard and GitHub repository.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLeetCodeModalOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/25 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Link LeetCode Account</span>
            </button>
          </div>
        )}

        {/* Dashboard Stats */}
        {activeTab !== 'profile' && (
          <DashboardStats
            problems={problems}
            currentStreak={currentStreak}
            username={user?.githubOwner || user?.username || 'Engineer'}
            avatarUrl={user?.avatarUrl}
            name={user?.name}
            bio={user?.bio}
            publicRepos={user?.publicRepos}
            followers={user?.followers}
            repoName={githubConfig.repo || 'leetcode-dsa-solutions'}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        )}

        {/* Main Content Tabs */}
        {activeTab === 'problems' && (
          <ProblemList
            problems={problems}
            onToggleSolved={handleToggleSolved}
            onToggleRevision={handleToggleRevision}
            onOpenDetail={(problem) => setSelectedProblem(problem)}
            onPushToGitHub={handlePushToGitHub}
          />
        )}

        {activeTab === 'sheets' && (
          <RoadmapSheetView
            problems={problems}
            onToggleSolved={handleToggleSolved}
            onOpenDetail={(problem) => setSelectedProblem(problem)}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileView
            user={user}
            githubConfig={githubConfig}
            problems={problems}
            currentStreak={currentStreak}
            leetcodeUsername={leetcodeUsername}
            onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
            onOpenLeetCodeModal={() => setIsLeetCodeModalOpen(true)}
            onOpenDetail={(problem) => setSelectedProblem(problem)}
          />
        )}

        {activeTab === 'extension' && (
          <div className="specular-card rounded-2xl p-8 max-w-3xl mx-auto space-y-6 shadow-2xl">
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-emerald-500/25 border border-emerald-500/40 flex-shrink-0">
                <img src="/logo.png" alt="Syntra Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Syntra Chrome Extension Console</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Zero-latency background engine that automatically commits accepted solutions from leetcode.com
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Extension Directory Location
                </span>
                <p className="font-mono text-xs text-emerald-400 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  D:\react\rudra\leetcode_to_github\extension
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Connected GitHub Repository
                </span>
                <p className="text-xs text-white font-mono font-semibold">
                  {githubConfig.isConfigured
                    ? `${githubConfig.username}/${githubConfig.repo} (${githubConfig.branch})`
                    : 'Not configured yet'}
                </p>
                <button
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="text-xs text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1 mt-1"
                >
                  <span>Configure Token & Branch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsExtensionModalOpen(true)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 font-extrabold text-slate-950 text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Open 4-Step Chrome Extension Installation Modal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <LeetCodeLinkModal
        isOpen={isLeetCodeModalOpen}
        onClose={() => setIsLeetCodeModalOpen(false)}
        currentLeetCodeUsername={leetcodeUsername}
        onLeetCodeLinked={handleLeetCodeLinked}
      />

      <GitHubSettingsModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        config={githubConfig}
        onSaveConfig={handleSaveGitHubConfig}
      />

      <ExtensionGuideModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
      />

      <ProblemDetailModal
        problem={selectedProblem}
        isOpen={!!selectedProblem}
        onClose={() => setSelectedProblem(null)}
        onUpdateProblem={handleUpdateProblem}
        onPushToGitHub={handlePushToGitHub}
      />

      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProblem={handleAddProblem}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        problems={problems}
        onSelectProblem={(prob) => setSelectedProblem(prob)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenLeetCodeModal={() => setIsLeetCodeModalOpen(true)}
        onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
        onSwitchTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
