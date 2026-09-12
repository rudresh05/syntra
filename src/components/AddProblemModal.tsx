'use client';

import React, { useState } from 'react';
import { Problem, Difficulty, ProgrammingLanguage } from '@/types/dsa';
import { X, Plus, Sparkles } from 'lucide-react';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProblem: (problem: Problem) => void;
}

export const AddProblemModal: React.FC<AddProblemModalProps> = ({
  isOpen,
  onClose,
  onAddProblem,
}) => {
  if (!isOpen) return null;

  const [number, setNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [topicsInput, setTopicsInput] = useState('Array, Hash Table');
  const [sheetName, setSheetName] = useState('Blind 75');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('java');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const titleSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const topics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProblem: Problem = {
      id: Date.now().toString(),
      number: Number(number) || 0,
      title,
      titleSlug,
      difficulty,
      topics: topics.length > 0 ? topics : ['Array'],
      solved: true,
      solvedAt: new Date().toISOString(),
      code,
      language,
      notes,
      sheetName,
    };

    onAddProblem(newProblem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Add LeetCode Problem</h3>
            <p className="text-xs text-zinc-400">Manually add a problem you solved</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Problem #</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-zinc-300 mb-1">Problem Title</label>
              <input
                type="text"
                placeholder="e.g. Two Sum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Roadmap Sheet</label>
              <select
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Blind 75">Blind 75</option>
                <option value="NeetCode 150">NeetCode 150</option>
                <option value="Striver A2Z">Striver A2Z</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Topics (Comma separated)</label>
            <input
              type="text"
              placeholder="Array, Hash Table, Two Pointers"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Coding Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="java">Java (Default)</option>
              <option value="cpp">C++</option>
              <option value="python3">Python 3</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="golang">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Solution Code (Optional)</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={4}
              placeholder="// Paste your Java / C++ / Python solution..."
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
          >
            Add Problem to Tracker
          </button>
        </form>
      </div>
    </div>
  );
};
