'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AudioLines,
  CheckCheck,
  ChevronDown,
  Disc,
  DownloadCloud,
  FileAudio,
  FileSearch,
  FileText,
  FileVideo,
  FolderOpen,
  Headphones,
  Home,
  Languages,
  Mail,
  MessageSquare,
  Mic,
  Music2,
  Radio,
  RefreshCw,
  ScanSearch,
  Scissors,
  Search,
  ShieldAlert,
  Sliders,
  UserCheck,
  Volume2,
  Wand2,
  X,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { CategoryId } from '../lib/categories';
import { cn } from './ui/cn';

export type ToolId =
  | 'transcriber'
  | 'mp3-to-text'
  | 'mp4-to-text'
  | 'youtube-to-mp3'
  | 'youtube-to-mp4'
  | 'podcast-generator'
  | 'audio-translator'
  | 'recorder-transcriber'
  | 'tiktok-to-mp3'
  | 'video-to-mp3'
  | 'mp4-to-mp3'
  | 'youtube-to-wav'
  | 'extract-audio'
  | 'english-to-tamil'
  | 'voice-to-text'
  | 'speech-transcriber'
  | 'ai-voice-generator'
  | 'ai-voice-clone'
  | 'volume-booster'
  | 'ai-voice-cleaner'
  | 'ai-vocal-remover'
  | 'ai-voice-changer'
  | 'background-noise-remover'
  | 'background-music-remover'
  | 'text-to-speech'
  | 'ai-section'
  | 'ai-chat'
  | 'paraphrasing-tool'
  | 'grammar-checker'
  | 'ai-detector'
  | 'summarizer'
  | 'ai-humanizer'
  | 'translator'
  | 'plagiarism-checker'
  | 'robin'
  | 'email-checker'
  | 'workspace'
  | 'torrent-downloader'
  | 'video-downloader';

interface AppSidebarProps {
  activeCategory: CategoryId;
  activeTool: ToolId | null;
  onSelectCategory: (categoryId: CategoryId) => void;
  onSelectTool: (toolId: ToolId) => void;
  onGoHome: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isMoreModalOpen: boolean;
  setIsMoreModalOpen: (open: boolean) => void;
}

interface NavTool {
  id: ToolId;
  name: string;
  /** One-line description shown in the all-tools dialog. */
  hint: string;
  category: CategoryId;
  icon: LucideIcon;
}

interface NavGroup {
  id: string;
  name: string;
  tools: NavTool[];
}

/** Navigation model. Writing tools come first: they are what most people open Playzy for. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'writing',
    name: 'Writing',
    tools: [
      { id: 'paraphrasing-tool', name: 'Paraphraser', hint: 'Reword text in eight modes', category: 'ai-section', icon: RefreshCw },
      { id: 'grammar-checker', name: 'Grammar Checker', hint: 'Fix grammar and spelling', category: 'ai-section', icon: CheckCheck },
      { id: 'ai-detector', name: 'AI Detector', hint: 'Score text from 0 to 100%', category: 'ai-section', icon: ScanSearch },
      { id: 'ai-humanizer', name: 'AI Humanizer', hint: 'Make AI drafts read naturally', category: 'ai-section', icon: UserCheck },
      { id: 'summarizer', name: 'Summarizer', hint: 'Condense long text', category: 'ai-section', icon: FileText },
      { id: 'translator', name: 'Translator', hint: 'Translate between languages', category: 'ai-section', icon: Languages },
      { id: 'plagiarism-checker', name: 'Plagiarism Checker', hint: 'Check text for matches', category: 'ai-section', icon: FileSearch },
      { id: 'ai-chat', name: 'AI Chat', hint: 'Ask questions and research', category: 'ai-section', icon: MessageSquare },
    ],
  },
  {
    id: 'transcribe',
    name: 'Transcribe',
    tools: [
      { id: 'transcriber', name: 'MP3 to Text', hint: 'Audio to timestamped text', category: 'audio-tools', icon: FileAudio },
      { id: 'mp4-to-text', name: 'MP4 to Text', hint: 'Video speech to text', category: 'audio-tools', icon: FileVideo },
      { id: 'recorder-transcriber', name: 'Voice Recorder', hint: 'Record and transcribe live', category: 'audio-tools', icon: Mic },
      { id: 'audio-translator', name: 'Audio Translator', hint: 'Translate spoken audio', category: 'audio-tools', icon: Languages },
    ],
  },
  {
    id: 'voice',
    name: 'Voice & audio',
    tools: [
      { id: 'ai-voice-generator', name: 'Voice Generator', hint: 'Text to natural speech', category: 'ai-voice', icon: Volume2 },
      { id: 'ai-voice-clone', name: 'Voice Clone', hint: 'Clone a voice from a sample', category: 'ai-voice', icon: AudioLines },
      { id: 'podcast-generator', name: 'Podcast Studio', hint: 'Two-host audio from a script', category: 'audio-tools', icon: Radio },
      { id: 'ai-voice-cleaner', name: 'Voice Cleaner', hint: 'Reduce noise in recordings', category: 'ai-voice', icon: Wand2 },
      { id: 'background-noise-remover', name: 'Noise Remover', hint: 'Remove background noise', category: 'ai-voice', icon: Headphones },
      { id: 'background-music-remover', name: 'Music Remover', hint: 'Keep speech, drop music', category: 'ai-voice', icon: Disc },
      { id: 'ai-vocal-remover', name: 'Vocal Remover', hint: 'Split vocals from a track', category: 'ai-voice', icon: Music2 },
      { id: 'ai-voice-changer', name: 'Voice Changer', hint: 'Change pitch and character', category: 'ai-voice', icon: Sliders },
      { id: 'volume-booster', name: 'Volume Booster', hint: 'Make quiet audio louder', category: 'ai-voice', icon: Volume2 },
    ],
  },
  {
    id: 'download',
    name: 'Download & convert',
    tools: [
      { id: 'video-downloader', name: 'Video Downloader', hint: 'Save video or audio from a link', category: 'video-downloader', icon: DownloadCloud },
      { id: 'youtube-to-mp3', name: 'YouTube to MP3', hint: 'Audio from a YouTube link', category: 'audio-tools', icon: Youtube },
      { id: 'youtube-to-mp4', name: 'YouTube to MP4', hint: 'Video from a YouTube link', category: 'audio-tools', icon: FileVideo },
      { id: 'youtube-to-wav', name: 'YouTube to WAV', hint: 'Lossless audio from a link', category: 'audio-tools', icon: FileAudio },
      { id: 'tiktok-to-mp3', name: 'TikTok to MP3', hint: 'Audio from a TikTok link', category: 'audio-tools', icon: Music2 },
      { id: 'mp4-to-mp3', name: 'MP4 to MP3', hint: 'Convert a video file to audio', category: 'audio-tools', icon: Disc },
      { id: 'extract-audio', name: 'Extract Audio', hint: 'Pull the audio track from a file', category: 'audio-tools', icon: Scissors },
      { id: 'torrent-downloader', name: 'Torrent to Video', hint: 'Stream or save from a torrent', category: 'video-downloader', icon: DownloadCloud },
    ],
  },
  {
    id: 'research',
    name: 'Research',
    tools: [
      { id: 'robin', name: 'Robin Threat Intel', hint: 'Security research and OSINT', category: 'ai-section', icon: ShieldAlert },
      { id: 'email-checker', name: 'Email Lookup', hint: 'Find accounts tied to an email', category: 'ai-section', icon: Mail },
    ],
  },
];

const ALL_NAV_TOOLS = NAV_GROUPS.flatMap((g) => g.tools.map((t) => ({ ...t, group: g.name })));

/** Several routes are variants of one sidebar entry. */
const ALIASES: Partial<Record<ToolId, ToolId>> = {
  'mp3-to-text': 'transcriber',
  'voice-to-text': 'transcriber',
  'speech-transcriber': 'transcriber',
  'english-to-tamil': 'audio-translator',
  'video-to-mp3': 'mp4-to-mp3',
  'text-to-speech': 'ai-voice-generator',
};

const navItem =
  'w-full h-9 px-2.5 rounded-ctl flex items-center gap-2.5 text-left text-sm transition-colors';
const navIdle = 'text-muted hover:text-fg hover:bg-sunken';
const navActive = 'bg-accent-soft text-accent font-medium';

export function AppSidebar({
  activeCategory,
  activeTool,
  onSelectCategory,
  onSelectTool,
  onGoHome,
  isMobileOpen,
  onCloseMobile,
  isMoreModalOpen,
  setIsMoreModalOpen,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const currentId: ToolId | null = useMemo(() => {
    if (activeTool) return ALIASES[activeTool] ?? activeTool;
    if (activeCategory === 'video-downloader') return 'video-downloader';
    if (activeCategory === 'workspace') return 'workspace';
    return null;
  }, [activeTool, activeCategory]);

  const isHome = currentId === null;

  const openTool = (tool: { id: ToolId; category: CategoryId }) => {
    onSelectCategory(tool.category);
    onSelectTool(tool.id);
    onCloseMobile();
    setIsMoreModalOpen(false);
  };

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileOpen, onCloseMobile]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Tools"
        className={cn(
          'bg-bg border-r border-line w-64 shrink-0 flex-col',
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 flex max-w-[86vw] shadow-overlay'
            : 'hidden lg:flex sticky top-14 h-[calc(100vh-3.5rem)]'
        )}
      >
        {isMobileOpen && (
          <div className="h-14 px-4 flex items-center justify-between border-b border-line shrink-0 lg:hidden">
            <span className="text-sm font-medium text-fg">Tools</span>
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="h-10 w-10 -mr-2 flex items-center justify-center rounded-ctl text-muted hover:text-fg hover:bg-sunken transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onGoHome();
                onCloseMobile();
              }}
              aria-current={isHome ? 'page' : undefined}
              className={cn(navItem, isHome ? navActive : navIdle)}
            >
              <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Home</span>
            </button>
            <button
              type="button"
              onClick={() => openTool({ id: 'workspace', category: 'workspace' })}
              aria-current={currentId === 'workspace' ? 'page' : undefined}
              className={cn(navItem, currentId === 'workspace' ? navActive : navIdle)}
            >
              <FolderOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Saved work</span>
            </button>
          </div>

          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsed[group.id] ?? false;
            const panelId = `nav-group-${group.id}`;
            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => setCollapsed((prev) => ({ ...prev, [group.id]: !isCollapsed }))}
                  aria-expanded={!isCollapsed}
                  aria-controls={panelId}
                  className="w-full h-8 px-2.5 flex items-center justify-between rounded-ctl eyebrow hover:text-fg transition-colors"
                >
                  <span>{group.name}</span>
                  <ChevronDown
                    className={cn('w-3.5 h-3.5 transition-transform', isCollapsed && '-rotate-90')}
                    aria-hidden="true"
                  />
                </button>
                {!isCollapsed && (
                  <ul id={panelId} className="mt-0.5 space-y-0.5">
                    {group.tools.map((tool) => {
                      const active = currentId === tool.id;
                      const Icon = tool.icon;
                      return (
                        <li key={tool.id}>
                          <button
                            type="button"
                            onClick={() => openTool(tool)}
                            aria-current={active ? 'page' : undefined}
                            className={cn(navItem, active ? navActive : navIdle)}
                          >
                            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span className="truncate">{tool.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-5 py-3 border-t border-line shrink-0">
          <p className="text-xs text-muted">Free to use. No account needed.</p>
        </div>
      </aside>

      {isMoreModalOpen && (
        <AllToolsDialog onClose={() => setIsMoreModalOpen(false)} onPick={openTool} />
      )}
    </>
  );
}

/** Searchable list of every tool. Opened from the header search and with Ctrl/Cmd+K. */
function AllToolsDialog({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (tool: { id: ToolId; category: CategoryId }) => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    if (!q) return NAV_GROUPS;
    return NAV_GROUPS.map((g) => ({
      ...g,
      tools: g.tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.hint.toLowerCase().includes(q) ||
          g.name.toLowerCase().includes(q)
      ),
    })).filter((g) => g.tools.length > 0);
  }, [q]);

  const firstMatch = groups[0]?.tools[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-[10vh] bg-black/50 animate-enter"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="All tools"
        className="bg-surface border border-line rounded-card shadow-overlay w-full max-w-2xl max-h-[80vh] flex flex-col"
      >
        <form
          className="flex items-center gap-3 px-4 h-14 border-b border-line shrink-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (firstMatch) onPick(firstMatch);
          }}
        >
          <Search className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools"
            aria-label="Search tools"
            className="flex-1 min-w-0 h-10 bg-transparent text-base text-fg placeholder:text-muted outline-none focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 -mr-1.5 flex items-center justify-center rounded-ctl text-muted hover:text-fg hover:bg-sunken transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        <div className="overflow-y-auto p-4 space-y-5">
          {groups.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">
              No tools match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            groups.map((group) => (
              <section key={group.id} aria-label={group.name}>
                <h3 className="eyebrow px-2 mb-1.5">{group.name}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {group.tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <li key={tool.id}>
                        <button
                          type="button"
                          onClick={() => onPick(tool)}
                          className="w-full px-2 py-2 rounded-ctl flex items-center gap-3 text-left hover:bg-sunken transition-colors"
                        >
                          <span className="h-9 w-9 rounded-ctl bg-sunken text-muted flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-fg truncate">{tool.name}</span>
                            <span className="block text-xs text-muted truncate">{tool.hint}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export { ALL_NAV_TOOLS };
