'use client';

import React from 'react';
import { Puzzle, X, Download, CheckCircle2, Chrome, FolderCheck, Terminal } from 'lucide-react';

interface ExtensionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionGuideModal: React.FC<ExtensionGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-emerald-500 text-zinc-950 rounded-xl font-bold">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Install Chrome Extension</h3>
            <p className="text-xs text-zinc-400">Enable automatic LeetCode to GitHub solution syncing</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
            <p className="font-semibold mb-1">Extension folder is ready in this project:</p>
            <code className="text-[11px] bg-zinc-950 px-2 py-1 rounded border border-emerald-500/30 text-emerald-400 font-mono block overflow-x-auto">
              D:\react\rudra\leetcode_to_github\extension
            </code>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="p-1.5 bg-zinc-800 text-emerald-400 rounded-lg font-bold text-xs">1</div>
              <div>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Chrome className="w-3.5 h-3.5 text-emerald-400" />
                  Open Chrome Extensions Page
                </h4>
                <p className="text-zinc-400 mt-0.5">
                  Type <code className="text-zinc-200 bg-zinc-800 px-1 rounded">chrome://extensions</code> in your Chrome browser address bar.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="p-1.5 bg-zinc-800 text-emerald-400 rounded-lg font-bold text-xs">2</div>
              <div>
                <h4 className="font-bold text-white">Turn On Developer Mode</h4>
                <p className="text-zinc-400 mt-0.5">
                  Toggle the <span className="text-amber-400 font-semibold">"Developer mode"</span> switch in the top right corner of the extensions page.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="p-1.5 bg-zinc-800 text-emerald-400 rounded-lg font-bold text-xs">3</div>
              <div>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Load Unpacked Extension
                </h4>
                <p className="text-zinc-400 mt-0.5">
                  Click <span className="text-emerald-400 font-semibold">"Load unpacked"</span> and select the folder:
                  <br />
                  <span className="text-zinc-200 font-mono text-[11px]">D:\react\rudra\leetcode_to_github\extension</span>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="p-1.5 bg-zinc-800 text-emerald-400 rounded-lg font-bold text-xs">4</div>
              <div>
                <h4 className="font-bold text-white">Done! Solve any LeetCode problem</h4>
                <p className="text-zinc-400 mt-0.5">
                  Click the extension puzzle icon to enter your GitHub token. Whenever you get an <span className="text-emerald-400 font-semibold">Accepted</span> submission on LeetCode, it automatically syncs to GitHub!
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
        >
          Got it, let's solve DSA!
        </button>
      </div>
    </div>
  );
};
