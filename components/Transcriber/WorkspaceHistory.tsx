'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, Clock, FileText, Trash2, Copy, Check, Download, AlertCircle, FileAudio } from 'lucide-react';
import { TranscriptionSegment } from '../../lib/types';

export interface WorkspaceItem {
  id: string;
  title: string;
  text: string;
  segments: TranscriptionSegment[];
  duration: number;
  language: string;
  createdAt: number;
}

interface WorkspaceHistoryProps {
  onSelectTranscript?: (item: WorkspaceItem) => void;
}

export function WorkspaceHistory({ onSelectTranscript }: WorkspaceHistoryProps) {
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('playzy_workspace_history');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    localStorage.setItem('playzy_workspace_history', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your local workspace history?')) {
      setItems([]);
      localStorage.removeItem('playzy_workspace_history');
    }
  };

  const handleCopy = (item: WorkspaceItem) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (item: WorkspaceItem) => {
    const blob = new Blob([item.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edf7ee] border border-[#499557]/30 text-[#499557] text-xs font-semibold shadow-2xs">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Local Browser Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Transcripts & History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Saved securely in your browser. No login or cloud account required.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-[22px] border border-slate-200/80 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#edf7ee] text-[#499557] flex items-center justify-center mx-auto shadow-2xs">
            <FileAudio className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No transcripts yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your transcribed audio, video files, and recordings will automatically appear here for easy access.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => {
            const wordCount = item.text.trim().split(/\s+/).filter(Boolean).length;
            const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                      <FileAudio className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{dateStr}</span>
                        </span>
                        <span>•</span>
                        <span className="uppercase font-semibold text-purple-600">
                          {item.language}
                        </span>
                        <span>•</span>
                        <span>{wordCount} words</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Copy text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadTxt(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Download TXT"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
