'use client';

import React, { useState } from 'react';
import { Problem } from '@/types/dsa';
import { ROADMAP_SHEETS } from '@/data/sheetsData';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Layers,
  Award,
  Sparkles,
  Code,
  FolderGit2,
  Check,
} from 'lucide-react';
import { getLeetCodeProblemUrl } from '@/config/api';

interface RoadmapSheetViewProps {
  problems: Problem[];
  onToggleSolved: (id: string) => void;
  onOpenDetail: (problem: Problem) => void;
}

export const RoadmapSheetView: React.FC<RoadmapSheetViewProps> = ({
  problems,
  onToggleSolved,
  onOpenDetail,
}) => {
  const [selectedSheet, setSelectedSheet] = useState<string>('Blind 75');

  // Filter problems for selected sheet
  const sheetProblems = problems.filter((p) => {
    if (selectedSheet === 'all') return true;
    return p.sheetName === selectedSheet || selectedSheet === 'Blind 75';
  });

  // Group by main topic tag
  const groupedByTopic: Record<string, Problem[]> = {};
  sheetProblems.forEach((problem) => {
    const mainTopic = problem.topics[0] || 'General DSA';
    if (!groupedByTopic[mainTopic]) {
      groupedByTopic[mainTopic] = [];
    }
    groupedByTopic[mainTopic].push(problem);
  });

  const totalSheet = sheetProblems.length;
  const solvedSheet = sheetProblems.filter((p) => p.solved).length;
  const sheetProgress = totalSheet > 0 ? Math.round((solvedSheet / totalSheet) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Sheet Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 specular-card p-4 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span className="font-extrabold text-white text-base sm:text-lg">Curated DSA Roadmaps</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar touch-scroll w-full sm:w-auto pb-1 sm:pb-0">
          {ROADMAP_SHEETS.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => setSelectedSheet(sheet.id)}
              className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                selectedSheet === sheet.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/25'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Header for Selected Sheet */}
      <div className="specular-card p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {selectedSheet === 'all' ? 'All Roadmap Questions' : selectedSheet} Mastery
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Industry Standard
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Master fundamental algorithmic patterns topic by topic. Submissions automatically push to your GitHub repository with solution and complexity breakdown.
          </p>
        </div>

        <div className="w-full md:w-72 bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold">Sheet Completion</span>
            <span className="text-emerald-400 font-bold font-mono">{solvedSheet} / {totalSheet} ({sheetProgress}%)</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-[1px]">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-sm shadow-emerald-400/50"
              style={{ width: `${sheetProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics Accordion / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Object.entries(groupedByTopic).map(([topic, topicProblems]) => {
          const topicSolved = topicProblems.filter((p) => p.solved).length;
          const topicTotal = topicProblems.length;
          const topicProgress = Math.round((topicSolved / topicTotal) * 100);

          return (
            <div
              key={topic}
              className="specular-card rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3.5 sm:space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Topic Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">{topic}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {topicSolved} of {topicTotal} solved ({topicProgress}%)
                  </div>
                </div>
                <div className="w-20 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${topicProgress}%` }}
                  />
                </div>
              </div>

              {/* Problems list */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {topicProblems.map((prob) => (
                  <div
                    key={prob.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <button
                        onClick={() => onToggleSolved(prob.id)}
                        className="text-slate-600 hover:text-emerald-400 transition-colors flex-shrink-0"
                      >
                        {prob.solved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <span className="font-mono text-slate-500 text-[10px] flex-shrink-0">
                        #{prob.number}
                      </span>
                      <a
                        href={getLeetCodeProblemUrl(prob.titleSlug)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-slate-200 hover:text-emerald-400 truncate transition-colors"
                      >
                        {prob.title}
                      </a>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
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
                      <button
                        onClick={() => onOpenDetail(prob)}
                        className="p-1 text-slate-500 hover:text-white transition-colors"
                        title="View Solution"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
