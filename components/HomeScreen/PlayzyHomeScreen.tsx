'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Check,
  CheckCheck,
  Copy,
  DownloadCloud,
  FileAudio,
  FileText,
  LayoutGrid,
  Languages,
  MessageSquare,
  Paperclip,
  Plus,
  Radio,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  Volume2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import { runAiChat } from '../../lib/api';
import { Button, IconButton } from '../ui/Button';
import { cn } from '../ui/cn';

interface PlayzyHomeScreenProps {
  onSelectTool: (toolId: ToolId, initialText?: string) => void;
  onOpenAllToolsModal?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  failed?: boolean;
}

const MAX_CHARS = 10000;

/** Text actions offered under the home editor. The first one is the primary button. */
const TEXT_ACTIONS: { id: ToolId; label: string; icon: LucideIcon }[] = [
  { id: 'paraphrasing-tool', label: 'Paraphrase', icon: RefreshCw },
  { id: 'grammar-checker', label: 'Check grammar', icon: CheckCheck },
  { id: 'ai-detector', label: 'Detect AI', icon: ScanSearch },
  { id: 'summarizer', label: 'Summarize', icon: FileText },
  { id: 'ai-humanizer', label: 'Humanize', icon: UserCheck },
];

const MORE_TOOLS: { id: ToolId; title: string; description: string; icon: LucideIcon }[] = [
  { id: 'transcriber', title: 'Transcribe audio', description: 'Turn a lecture or interview into text.', icon: FileAudio },
  { id: 'ai-voice-generator', title: 'Read text aloud', description: 'Generate natural speech from your writing.', icon: Volume2 },
  { id: 'translator', title: 'Translate', description: 'Move text between languages.', icon: Languages },
  { id: 'video-downloader', title: 'Download video', description: 'Save video or audio from a link.', icon: DownloadCloud },
  { id: 'podcast-generator', title: 'Make a podcast', description: 'Two-host audio from a script.', icon: Radio },
];

const CHAT_SYSTEM_PROMPT =
  'You are Playzy AI, a clear and careful writing and study assistant. Answer directly, structure longer answers with short headings and lists, and say so when you are not sure.';

function detectRoute(text: string): { tool: ToolId; label: string; payload: string } | null {
  if (/(youtube\.com|youtu\.be|tiktok\.com)/i.test(text)) {
    return { tool: 'video-downloader', label: 'Open in Video Downloader', payload: text };
  }
  if (/(^robin\b|\.onion\b|darknet osint|dark web intel)/i.test(text)) {
    return { tool: 'robin', label: 'Open in Robin Threat Intel', payload: text.replace(/^robin\s*/i, '') };
  }
  if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(text)) {
    return { tool: 'email-checker', label: 'Open in Email Lookup', payload: text };
  }
  return null;
}

export function PlayzyHomeScreen({ onSelectTool, onOpenAllToolsModal }: PlayzyHomeScreenProps) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down' | undefined>>({});
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isGenerating]);

  const clean = text.trim();
  const wordCount = clean ? clean.split(/\s+/).length : 0;
  const route = clean ? detectRoute(clean) : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string' && content) setText(content.slice(0, MAX_CHARS));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const requestReply = async (history: ChatMessage[], replaceLast: boolean) => {
    setIsGenerating(true);
    let reply: ChatMessage;
    try {
      const response = await runAiChat(
        history.map((m) => ({ role: m.role, content: m.content })),
        CHAT_SYSTEM_PROMPT
      );
      reply = { id: `ai_${Date.now()}`, role: 'assistant', content: response.reply, createdAt: Date.now() };
    } catch {
      reply = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: 'The assistant could not be reached. Check your connection and try again.',
        createdAt: Date.now(),
        failed: true,
      };
    }
    setMessages((prev) => [...(replaceLast ? prev.slice(0, -1) : prev), reply]);
    setIsGenerating(false);
  };

  const handleAsk = () => {
    if (!clean || isGenerating) return;
    if (route) {
      onSelectTool(route.tool, route.payload);
      return;
    }
    const userMsg: ChatMessage = { id: `usr_${Date.now()}`, role: 'user', content: clean, createdAt: Date.now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setText('');
    setAttachedFileName(null);
    void requestReply(history, false);
  };

  const handleRegenerate = () => {
    if (isGenerating || messages.length === 0) return;
    if (messages[messages.length - 1].role !== 'assistant') return;
    void requestReply(messages.slice(0, -1), true);
  };

  const handleCopy = (id: string, content: string) => {
    void navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setText('');
    setAttachedFileName(null);
    setIsGenerating(false);
  };

  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".txt,.md,text/plain,text/markdown"
      className="hidden"
      onChange={handleFileUpload}
    />
  );

  /* ------------------------------ Chat thread ------------------------------ */
  if (messages.length > 0) {
    const lastId = messages[messages.length - 1].id;
    return (
      <div className="max-w-3xl mx-auto w-full flex flex-col min-h-[calc(100vh-9rem)] animate-enter">
        {fileInput}

        <div className="flex items-center justify-between pb-4 border-b border-line">
          <h1 className="text-base font-medium text-fg">AI Chat</h1>
          <Button size="sm" onClick={handleNewChat} icon={<Plus className="w-4 h-4" aria-hidden="true" />}>
            New chat
          </Button>
        </div>

        <div className="flex-1 py-6 space-y-8" aria-live="polite">
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] bg-sunken rounded-card px-4 py-3 text-base text-fg whitespace-pre-wrap break-words">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={m.id}>
                <div
                  className={cn(
                    'whitespace-pre-wrap break-words',
                    m.failed ? 'text-sm text-danger' : 'prose-reading'
                  )}
                >
                  {m.content}
                </div>

                {!m.failed && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(m.id, m.content)}
                      icon={
                        copiedId === m.id ? (
                          <Check className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Copy className="w-4 h-4" aria-hidden="true" />
                        )
                      }
                    >
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectTool('paraphrasing-tool', m.content)}
                      icon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
                    >
                      Paraphrase
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectTool('ai-voice-generator', m.content)}
                      icon={<Volume2 className="w-4 h-4" aria-hidden="true" />}
                    >
                      Read aloud
                    </Button>
                    {m.id === lastId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        icon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
                      >
                        Try again
                      </Button>
                    )}
                    <span className="flex-1" />
                    <IconButton
                      size="sm"
                      label="Good answer"
                      aria-pressed={feedback[m.id] === 'up'}
                      className={cn(feedback[m.id] === 'up' && 'text-accent bg-accent-soft')}
                      onClick={() =>
                        setFeedback((prev) => ({ ...prev, [m.id]: prev[m.id] === 'up' ? undefined : 'up' }))
                      }
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      size="sm"
                      label="Poor answer"
                      aria-pressed={feedback[m.id] === 'down'}
                      className={cn(feedback[m.id] === 'down' && 'text-danger bg-danger-soft')}
                      onClick={() =>
                        setFeedback((prev) => ({ ...prev, [m.id]: prev[m.id] === 'down' ? undefined : 'down' }))
                      }
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </IconButton>
                  </div>
                )}

                {m.failed && m.id === lastId && (
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    icon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
                  >
                    Try again
                  </Button>
                )}
              </div>
            )
          )}

          {isGenerating && (
            <p className="text-sm text-muted" role="status">
              Writing a reply…
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-0 bg-bg pt-2 pb-3">
          <div className="bg-surface border border-line-strong rounded-card focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25 transition-colors">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              rows={2}
              placeholder="Ask a follow-up"
              aria-label="Message"
              className="block w-full resize-none bg-transparent px-4 pt-3 text-base text-fg placeholder:text-muted outline-none focus-visible:outline-none"
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <IconButton size="sm" label="Attach a text file" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-4 h-4" />
              </IconButton>
              <IconButton
                size="sm"
                variant="primary"
                label="Send"
                disabled={!clean || isGenerating}
                onClick={handleAsk}
              >
                <ArrowUp className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------- Home --------------------------------- */
  const [primaryAction, ...secondaryActions] = TEXT_ACTIONS;
  const PrimaryIcon = primaryAction.icon;

  return (
    <div className="max-w-3xl mx-auto w-full pt-6 sm:pt-12 pb-8 animate-enter">
      {fileInput}

      <h1 className="font-serif text-4xl sm:text-5xl font-medium text-fg">
        What are you writing today?
      </h1>
      <p className="mt-3 text-base text-muted max-w-xl">
        Paste your text, then choose what to do with it. Free, with no account.
      </p>

      <div className="mt-8 bg-surface border border-line-strong rounded-card focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25 transition-colors">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleAsk();
            }
          }}
          rows={7}
          placeholder="Paste or type your text here"
          aria-label="Your text"
          className="block w-full resize-y min-h-[10rem] bg-transparent px-4 sm:px-5 pt-4 font-serif text-lg leading-relaxed text-fg placeholder:text-muted placeholder:font-sans placeholder:text-base outline-none focus-visible:outline-none"
        />

        <div className="flex items-center justify-between gap-3 px-2 sm:px-3 py-2 border-t border-line">
          <div className="flex items-center gap-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              icon={<Paperclip className="w-4 h-4" aria-hidden="true" />}
            >
              <span className="hidden xs:inline">Upload .txt</span>
              <span className="xs:hidden">Upload</span>
            </Button>
            {attachedFileName && (
              <span className="inline-flex items-center gap-1 min-w-0 text-xs text-muted">
                <span className="truncate max-w-[10rem]">{attachedFileName}</span>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => {
                    setAttachedFileName(null);
                    setText('');
                  }}
                  className="h-6 w-6 flex items-center justify-center rounded-ctl hover:bg-sunken hover:text-fg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
          <p className="text-xs text-muted tabular-nums shrink-0">
            {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
            <span className="hidden sm:inline">
              {' '}
              · {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {route ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onSelectTool(route.tool, route.payload)}
            icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
          >
            {route.label}
          </Button>
          <p className="text-sm text-muted">This looks like a link or lookup, not text to edit.</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onSelectTool(primaryAction.id, clean)}
            icon={<PrimaryIcon className="w-4 h-4" aria-hidden="true" />}
          >
            {primaryAction.label}
          </Button>
          {secondaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                size="lg"
                onClick={() => onSelectTool(action.id, clean)}
                icon={<Icon className="w-4 h-4 text-muted" aria-hidden="true" />}
              >
                {action.label}
              </Button>
            );
          })}
          <Button
            size="lg"
            onClick={handleAsk}
            disabled={!clean}
            icon={<MessageSquare className="w-4 h-4 text-muted" aria-hidden="true" />}
          >
            Ask AI
          </Button>
        </div>
      )}

      <section aria-labelledby="more-tools" className="mt-14">
        <h2 id="more-tools" className="eyebrow">
          More tools
        </h2>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line rounded-card overflow-hidden">
          {MORE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.id} className="bg-surface">
                <button
                  type="button"
                  onClick={() => onSelectTool(tool.id)}
                  className="group w-full h-full px-4 py-4 flex items-start gap-3 text-left hover:bg-sunken transition-colors"
                >
                  <Icon className="w-5 h-5 mt-0.5 text-muted group-hover:text-accent transition-colors shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-fg">{tool.title}</span>
                    <span className="block text-sm text-muted">{tool.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
          <li className="bg-surface">
            <button
              type="button"
              onClick={() => onOpenAllToolsModal?.()}
              className="group w-full h-full px-4 py-4 flex items-start gap-3 text-left hover:bg-sunken transition-colors"
            >
              <LayoutGrid className="w-5 h-5 mt-0.5 text-muted group-hover:text-accent transition-colors shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">Browse all tools</span>
                <span className="block text-sm text-muted">Voice, audio, converters and research.</span>
              </span>
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
}
