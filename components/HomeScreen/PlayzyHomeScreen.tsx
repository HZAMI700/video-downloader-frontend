'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Plus,
  ArrowUp,
  FileText,
  FileCheck2,
  Share2,
  Upload,
  Crown,
  ChevronRight,
  Compass,
  Grid,
  Check,
  MessageSquare,
  FileAudio,
  FileVideo,
  Youtube,
  Music2,
  Volume2,
  Languages,
  Layers,
  Search,
  ExternalLink,
  Mic,
  Copy,
  RotateCcw,
  Loader2,
  CornerDownLeft,
  X,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import { runAiChat } from '../../lib/api';

interface PlayzyHomeScreenProps {
  onSelectTool: (toolId: ToolId, initialText?: string) => void;
  onOpenAllToolsModal?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export function PlayzyHomeScreen({
  onSelectTool,
  onOpenAllToolsModal,
}: PlayzyHomeScreenProps) {
  const [promptText, setPromptText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  // Adjust textarea height dynamically like ChatGPT
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  };

  const handleActionClick = (toolId: ToolId) => {
    onSelectTool(toolId, promptText);
  };

  const handleCardClick = (presetText: string) => {
    setPromptText(presetText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setPromptText(text.slice(0, 10000));
        }
      };
      reader.readAsText(file);
    }
  };

  // Direct ChatGPT-style chat submission
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = promptText.trim();
    if (!clean || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: clean,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsGenerating(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await runAiChat(
        chatHistory,
        "You are Playzy AI — an intelligent, friendly, ultra-capable writing and coding assistant. Answer clearly, format with markdown, lists, and code blocks."
      );

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: "I've processed your prompt. You can also send this text directly into our specialized tools (Paraphraser, AI Humanizer, AI Detector, or Transcriber) using the buttons below.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeechToggle = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setPromptText('');
    setIsGenerating(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6 animate-apple-in font-sans">
      {/* Hidden Doc/Text File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.doc,.docx"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* 1. ACTIVE CHAT THREAD VIEW (When messages exist, ChatGPT view) */}
      {messages.length > 0 ? (
        <div className="space-y-6">
          {/* Conversation Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#499557] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Playzy AI Conversation</h3>
                <p className="text-[11px] text-slate-500 font-medium">Instant AI reasoning &amp; writing assistant</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-700 transition active:scale-95 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-[#499557] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs space-y-3'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {m.role === 'assistant' && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectTool('paraphrasing-tool', m.content)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-[10.5px] font-semibold text-slate-600 transition"
                        >
                          Paraphrase
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectTool('ai-humanizer', m.content)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-[10.5px] font-semibold text-slate-600 transition"
                        >
                          Humanize
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectTool('ai-detector', m.content)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-[10.5px] font-semibold text-slate-600 transition"
                        >
                          Check AI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#499557] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 text-[#499557] animate-spin" />
                  <span>Playzy AI is writing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        /* 2. PRISTINE HERO SECTION (When no messages yet) */
        <div className="space-y-6 pt-2">
          {/* Top Laurel Banner Matching Screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-2xs">
              <span className="text-emerald-600 text-sm">🌿</span>
              <span>Perfect your writing everywhere</span>
              <span className="text-emerald-600 text-sm">🌿</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Add to Browser. It&apos;s Free</span>
            </div>
          </div>

          {/* Hero Headline & Subtitle Matching Screenshot */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Create something great today
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">
              Write, design, build, and so much more with AI tools for every task.
            </p>
          </div>
        </div>
      )}

      {/* 3. CHATGPT-STYLE PROMPT FIELD (Clean, Elevated, Floating Box) */}
      <div className="w-full max-w-3xl mx-auto space-y-3">
        <form
          onSubmit={handleSendMessage}
          className="bg-white rounded-[26px] sm:rounded-[28px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-slate-300 focus-within:border-slate-400 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.09)] transition-all p-3 sm:p-4 relative"
        >
          {/* Auto-growing Textarea */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={promptText}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Message Playzy AI or paste text to summarize, paraphrase, detect..."
            className="w-full bg-transparent resize-none border-none text-slate-800 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed font-normal min-h-[50px] max-h-[220px]"
          />

          {/* Bottom Toolbar inside the ChatGPT Box */}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
            {/* Left Tools / Attachments */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach Document (.txt, .md, .doc)"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-[11px] font-semibold text-slate-600">
                <Sparkles className="w-3 h-3 text-[#499557]" />
                <span>Playzy 4.0</span>
              </div>
            </div>

            {/* Right: Word count + Mic + Send Arrow */}
            <div className="flex items-center gap-2">
              {promptText && (
                <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">
                  {promptText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              )}

              {/* Voice Microphone Input */}
              <button
                type="button"
                onClick={handleSpeechToggle}
                title={isListening ? 'Listening...' : 'Voice Input'}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Circular Send Button (Up Arrow like ChatGPT) */}
              <button
                type="submit"
                disabled={!promptText.trim() || isGenerating}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  promptText.trim() && !isGenerating
                    ? 'bg-slate-900 hover:bg-black text-white shadow-md active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.4]" />
              </button>
            </div>
          </div>
        </form>

        {/* Action Pills Row Attached Underneath Prompt Box */}
        <div className="flex flex-wrap items-center justify-start gap-2 px-1">
          <button
            type="button"
            onClick={() => handleActionClick('ai-chat')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
          >
            <span>📝</span>
            <span>Create</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick('paraphrasing-tool')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paraphraser</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick('ai-humanizer')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Humanizer</span>
          </button>

          <button
            type="button"
            onClick={() => handleActionClick('ai-detector')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Detector</span>
          </button>

          <button
            type="button"
            onClick={() => setShowToolsDrawer(!showToolsDrawer)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Expanded Tools Drawer (When clicking "+ More") */}
      {showToolsDrawer && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-lg space-y-4 animate-apple-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#499557]" />
              <span>All Playzy AI &amp; Media Tools</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowToolsDrawer(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => onSelectTool('mp3-to-text')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition"
            >
              <FileAudio className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">MP3 to Text</p>
                <p className="text-[10px] text-slate-400">Strictly .mp3</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('mp4-to-text')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition"
            >
              <FileVideo className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">MP4 to Text</p>
                <p className="text-[10px] text-slate-400">Strictly .mp4</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('youtube-to-mp3')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 text-left transition"
            >
              <Youtube className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">YouTube MP3</p>
                <p className="text-[10px] text-slate-400">Link Only</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('tiktok-to-mp3')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 text-left transition"
            >
              <Music2 className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">TikTok MP3</p>
                <p className="text-[10px] text-slate-400">Link Only</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('ai-voice-generator')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition"
            >
              <Volume2 className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">AI Voice Studio</p>
                <p className="text-[10px] text-slate-400">36+ Voices</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('translator')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 text-left transition"
            >
              <Languages className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Translator</p>
                <p className="text-[10px] text-slate-400">40+ Langs</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('grammar-checker')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 text-left transition"
            >
              <FileCheck2 className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Grammar</p>
                <p className="text-[10px] text-slate-400">0 Errors</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('video-downloader')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition"
            >
              <Share2 className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Playzy Video</p>
                <p className="text-[10px] text-slate-400">Downloader</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 4. PROMPT SUGGESTION CARDS (Visible when not actively chatting) */}
      {messages.length === 0 && (
        <div className="max-w-3xl mx-auto space-y-3 pt-2">
          <p className="text-xs font-semibold text-slate-400 text-center">
            Need an Idea? Try one of these...
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1: Create presentations */}
            <div
              onClick={() =>
                handleCardClick(
                  'Create a comprehensive pitch deck outline for an AI SaaS platform including problem, solution, market size, and pricing model.'
                )
              }
              className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs cursor-pointer transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg">📑</span>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Create presentations
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Create a pitch deck for a SaaS marketin...
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Create resumes */}
            <div
              onClick={() =>
                handleCardClick(
                  'Draft a high-impact resume summary highlighting 5+ years of software engineering, full-stack React, FastAPI, and machine learning.'
                )
              }
              className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs cursor-pointer transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg">📄</span>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Create resumes
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Create a resume for a business internsh...
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Create social media posts */}
            <div
              onClick={() =>
                handleCardClick(
                  'Write an engaging viral Instagram and LinkedIn post announcing a new product launch with high-converting hooks and hashtags.'
                )
              }
              className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs cursor-pointer transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg">💬</span>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Create social media posts
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Create an Instagram post announcing a...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Matching Screenshot */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-slate-400">
          Ensure you have the rights to images or files you upload. Comply with our{' '}
          <span className="underline hover:text-slate-600 cursor-pointer">Copyright Policy</span> and{' '}
          <span className="underline hover:text-slate-600 cursor-pointer">Community Guidelines</span>.
        </p>
      </div>
    </div>
  );
}
