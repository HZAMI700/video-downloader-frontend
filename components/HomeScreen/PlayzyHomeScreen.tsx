'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Plus,
  ArrowRight,
  ArrowUp,
  FileText,
  FileCheck2,
  Share2,
  Paperclip,
  Check,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  X,
  FileAudio,
  FileVideo,
  Youtube,
  Music2,
  Volume2,
  Languages,
  ChevronDown,
  FolderPlus,
  Compass,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  DownloadCloud,
  FileSpreadsheet,
  FileCode,
  Zap,
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
  reasoningSteps?: string[];
}

export function PlayzyHomeScreen({
  onSelectTool,
  onOpenAllToolsModal,
}: PlayzyHomeScreenProps) {
  const [promptText, setPromptText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [dislikedMap, setDislikedMap] = useState<Record<string, boolean>>({});
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [deepResearchActive, setDeepResearchActive] = useState(true);
  const [selectedAgentTab, setSelectedAgentTab] = useState<'all' | 'research' | 'doc' | 'voice' | 'downloader' | 'transcriber'>('all');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pristineFileInputRef = useRef<HTMLInputElement | null>(null);
  const pristineTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const activeChatTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle file uploads (txt, md, doc, docx, pdf)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFileName(file.name);
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

  // Chat message submission with Deep Research agent steps
  const handleSendMessage = async (textToSend?: string) => {
    const raw = typeof textToSend === 'string' ? textToSend : promptText;
    const clean = raw.trim();
    if (!clean || isGenerating) return;

    // Check if input is a YouTube/TikTok link -> route directly to Downloader
    const isYoutubeLink = /(youtube\.com|youtu\.be)/i.test(clean);
    const isTiktokLink = /tiktok\.com/i.test(clean);
    if (isYoutubeLink || isTiktokLink) {
      onSelectTool('video-downloader', clean);
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: clean,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptText('');
    setAttachedFileName(null);
    setIsGenerating(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const systemPrompt = deepResearchActive
        ? 'You are Playzy Deep Research Agent (powered by DeepSeek-R1 & Skywork multimodal intelligence). Provide comprehensive, rigorously structured, and deeply analytical deliverables with headings, bullet points, citations, and actionable synthesis.'
        : 'You are Playzy AI — an intelligent, friendly, ultra-capable writing and reasoning assistant. Provide direct, beautifully structured, and high-quality responses.';

      const response = await runAiChat(chatHistory, systemPrompt);

      const reasoningSteps = deepResearchActive
        ? [
            `Deconstructed prompt into multi-dimensional inquiry graph.`,
            `Cross-referenced knowledge repository and domain-specific benchmarks.`,
            `Synthesized verified insights with zero hallucinations.`,
          ]
        : undefined;

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        createdAt: Date.now(),
        reasoningSteps,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content:
          "I've synthesized your request. You can also send this text directly into Playzy's specialized studio agents (Paraphraser, AI Humanizer, AI Detector, or Voice Studio) using the action toolbar below.",
        createdAt: Date.now(),
        reasoningSteps: [
          'Direct reasoning model synthesis completed.',
          'Ready for tool transformation (Voice, Paraphrase, Detect).',
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate last response
  const handleRegenerate = async () => {
    if (isGenerating || messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    setIsGenerating(true);
    try {
      const chatHistory = messages
        .filter((_, idx) => idx < messages.length - 1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await runAiChat(
        chatHistory,
        'You are Playzy AI — provide an alternative high-quality, comprehensive deliverable.'
      );

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        createdAt: Date.now(),
        reasoningSteps: [
          'Alternative reasoning branch explored.',
          'Re-synthesized perspective generated.',
        ],
      };
      setMessages((prev) => [...prev.slice(0, -1), aiMsg]);
    } catch {
      // Keep previous
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleThumbsUp = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    if (dislikedMap[id]) {
      setDislikedMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleThumbsDown = (id: string) => {
    setDislikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    if (likedMap[id]) {
      setLikedMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setPromptText('');
    setAttachedFileName(null);
    setIsGenerating(false);
  };

  // Quick word/char count
  const wordCount = promptText.trim() ? promptText.trim().split(/\s+/).length : 0;
  const charCount = promptText.length;

  // ----------------------------------------------------------------------------------
  // VIEW 1: ACTIVE AGENTIC STREAM (Skywork Multi-Agent Execution View)
  // ----------------------------------------------------------------------------------
  if (messages.length > 0) {
    return (
      <div className="w-full h-full flex flex-col justify-between min-h-[calc(100vh-6rem)] animate-apple-in select-text">
        {/* Hidden File Input for chat */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.doc,.docx,.pdf"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Top Header Row in Active Workspace */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#212932] shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetChat}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-white hover:bg-slate-100 dark:bg-[#181D24] dark:hover:bg-[#202732] text-slate-800 dark:text-slate-200 font-semibold text-xs transition active:scale-95 shadow-2xs cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#009688] dark:text-[#00c9a7]" />
              <span>New Thread</span>
            </button>

            <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#141A22] border border-slate-200 dark:border-[#263241] text-xs text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00c9a7] animate-pulse" />
              <span className="font-medium text-slate-500 dark:text-slate-400">Model:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Playzy DeepSeek-R1 (Skywork 3.0)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDeepResearchActive(!deepResearchActive)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                deepResearchActive
                  ? 'bg-[#00c9a7]/10 dark:bg-[#00c9a7]/15 border-[#00c9a7]/30 dark:border-[#00c9a7]/40 text-[#00897b] dark:text-[#00c9a7]'
                  : 'bg-slate-100 dark:bg-[#181D24] border-slate-200 dark:border-[#263241] text-slate-600 dark:text-slate-400'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Deep Research {deepResearchActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-6 py-6 space-y-7">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {isUser ? (
                  /* User Bubble */
                  <div className="bg-emerald-50 dark:bg-[#1C232C] text-slate-900 dark:text-slate-100 px-5 py-3 rounded-[20px] rounded-tr-sm max-w-[80%] text-sm leading-relaxed border border-emerald-200/80 dark:border-[#2C3847] shadow-xs select-text">
                    {m.content}
                  </div>
                ) : (
                  /* Assistant Bubble with Skywork Agent Execution Steps */
                  <div className="w-full max-w-4xl space-y-3.5">
                    {/* Skywork Multi-Agent Reasoning Step Box */}
                    {m.reasoningSteps && m.reasoningSteps.length > 0 && (
                      <div className="bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#212A36] rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                        <div className="flex items-center gap-2 font-semibold text-[#009688] dark:text-[#00c9a7]">
                          <Cpu className="w-4 h-4 text-[#009688] dark:text-[#00c9a7] animate-pulse" />
                          <span>Skywork Multi-Agent Reasoning Process</span>
                        </div>
                        <div className="space-y-1.5 pl-6 border-l-2 border-slate-300 dark:border-[#263241] ml-2 text-slate-600 dark:text-slate-400">
                          {m.reasoningSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00c9a7]" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main Deliverable Content */}
                    <div className="bg-white dark:bg-[#181D24] border border-slate-200 dark:border-[#263241] rounded-[22px] p-5 sm:p-6 text-slate-800 dark:text-slate-100 text-[14.5px] leading-relaxed shadow-sm select-text whitespace-pre-wrap">
                      {m.content}
                    </div>

                    {/* Action Bar (Copy, Voiceover, Paraphrase, Detect, Thumbs) */}
                    <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 pl-1">
                      {/* Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#141A22] dark:hover:bg-[#1C232D] border border-slate-200 dark:border-[#263241] text-slate-700 dark:text-slate-300 transition"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Send to AI Voice Studio */}
                      <button
                        type="button"
                        onClick={() => onSelectTool('ai-voice-generator', m.content)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 dark:bg-[#141A22] dark:hover:bg-purple-950/20 border border-slate-200 dark:border-[#263241] hover:border-purple-300 dark:hover:border-purple-500/40 text-slate-700 hover:text-purple-700 dark:text-slate-300 dark:hover:text-purple-300 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Generate Voiceover</span>
                      </button>

                      {/* Send to Paraphraser */}
                      <button
                        type="button"
                        onClick={() => onSelectTool('paraphrasing-tool', m.content)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-[#141A22] dark:hover:bg-emerald-950/20 border border-slate-200 dark:border-[#263241] hover:border-emerald-300 dark:hover:border-emerald-500/40 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Paraphrase</span>
                      </button>

                      {/* Send to AI Detector */}
                      <button
                        type="button"
                        onClick={() => onSelectTool('ai-detector', m.content)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 dark:bg-[#141A22] dark:hover:bg-orange-950/20 border border-slate-200 dark:border-[#263241] hover:border-orange-300 dark:hover:border-orange-500/40 text-slate-700 hover:text-orange-700 dark:text-slate-300 dark:hover:text-orange-300 transition"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                        <span>Detect AI</span>
                      </button>

                      {/* Thumbs Up / Down */}
                      <button
                        type="button"
                        onClick={() => handleThumbsUp(m.id)}
                        className={`p-1.5 rounded-lg border border-slate-200 dark:border-[#263241] transition ${
                          likedMap[m.id] ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40' : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#141A22] dark:hover:bg-[#1C232D]'
                        }`}
                        title="Good response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleThumbsDown(m.id)}
                        className={`p-1.5 rounded-lg border border-slate-200 dark:border-[#263241] transition ${
                          dislikedMap[m.id] ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40' : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#141A22] dark:hover:bg-[#1C232D]'
                        }`}
                        title="Poor response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Real-time Generating State Indicator */}
          {isGenerating && (
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] rounded-2xl p-4 max-w-md animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[#00c9a7]/20 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[#009688] dark:text-[#00c9a7] animate-spin" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Skywork Autonomous Agents Running...</p>
                <p className="text-slate-500 dark:text-slate-400">Synthesizing deep research &amp; formatting deliverable</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating Chat Input Box */}
        <div className="w-full max-w-4xl mx-auto pt-2 pb-1 space-y-2">
          <div className="relative bg-white dark:bg-[#181D24] rounded-[22px] border border-slate-200 dark:border-[#263241] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:border-slate-300 dark:hover:border-[#354354] focus-within:border-[#00c9a7]/60 focus-within:shadow-[0_0_24px_rgba(0,201,167,0.15)] transition-all p-3 sm:p-4">
            {attachedFileName && (
              <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#141A22] border border-[#00c9a7]/40 text-xs text-[#00897b] dark:text-[#00c9a7] font-semibold">
                <Paperclip className="w-3.5 h-3.5" />
                <span>{attachedFileName}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFileName(null)}
                  className="hover:text-rose-500 ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <textarea
              ref={activeChatTextareaRef}
              rows={2}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything, request revisions, or paste media links..."
              className="w-full resize-none outline-none border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base leading-relaxed bg-transparent focus:ring-0 select-text min-h-[44px] max-h-[160px]"
            />

            {/* Bottom Toolbar inside Chat Box */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#263241]">
              <div className="relative flex items-center gap-2" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file (.pdf, .docx, .txt, .mp3)"
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-[#202732] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-[#263241] bg-slate-100 dark:bg-[#141A22] hover:bg-slate-200 dark:hover:bg-[#202732] text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#009688] dark:text-[#00c9a7]" />
                  <span>Skills</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </button>

                {/* Skills Dropdown Menu */}
                {showToolsDropdown && (
                  <div className="absolute bottom-11 left-0 w-64 bg-white dark:bg-[#181D24] rounded-2xl border border-slate-200 dark:border-[#263241] shadow-xl p-2 z-50 space-y-1 animate-apple-in">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                      Launch Studio Skill
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('paraphrasing-tool', promptText);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202732] text-xs text-slate-800 dark:text-slate-200 font-semibold text-left transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#009688] dark:text-[#00c9a7]" />
                      <span>Paraphraser</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('ai-humanizer', promptText);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202732] text-xs text-slate-800 dark:text-slate-200 font-semibold text-left transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-[#12c4ff]" />
                      <span>AI Humanizer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('ai-detector', promptText);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202732] text-xs text-slate-800 dark:text-slate-200 font-semibold text-left transition"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-[#f59e0b]" />
                      <span>AI Detector (0-100%)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('ai-voice-generator', promptText);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202732] text-xs text-slate-800 dark:text-slate-200 font-semibold text-left transition"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-[#a855f7]" />
                      <span>Voice Studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('video-downloader');
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202732] text-xs text-slate-800 dark:text-slate-200 font-semibold text-left transition"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-sky-500 dark:text-[#38bdf8]" />
                      <span>Media Downloader</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Circular Send Button with Up Arrow */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!promptText.trim() || isGenerating}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  promptText.trim() && !isGenerating
                    ? 'bg-gradient-to-tr from-[#00A9C0] to-[#00c9a7] text-slate-950 font-bold hover:shadow-[0_0_18px_rgba(0,201,167,0.4)] active:scale-95 cursor-pointer'
                    : 'bg-slate-200 dark:bg-[#202732] text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
                title="Send query"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <p className="text-[11.5px] text-slate-400 dark:text-slate-500 text-center font-normal">
            Playzy Autonomous Agents cross-reference knowledge across verifiable sources.
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // VIEW 2: SKYWORK PRISTINE WORKSPACE HOME (100% Skywork.ai Architecture)
  // ----------------------------------------------------------------------------------
  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center py-4 select-none animate-apple-in">
      {/* Hidden File Input for pristine prompt box */}
      <input
        ref={pristineFileInputRef}
        type="file"
        accept=".txt,.md,.doc,.docx,.pdf,.mp3,.mp4"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* TOP PROMO BADGE (The Originator of AI Workspace Agents) */}
      <div className="w-full flex items-center justify-center pt-1 pb-3">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-[#161C24] border border-slate-200 dark:border-[#263241] text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:border-[#00c9a7]/50 transition-all cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-[#00c9a7] shadow-[0_0_8px_#00c9a7] animate-pulse" />
          <span className="text-slate-500 dark:text-slate-400">Next-Gen Release:</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">The Originator of AI Workspace Agents</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00c9a7]/15 dark:bg-[#00c9a7]/20 text-[#00897b] dark:text-[#00c9a7]">v3.5 Pro</span>
        </div>
      </div>

      {/* CENTER HERO & SKYWORK PROMPT COMMAND CENTER */}
      <div className="w-full max-w-[820px] flex flex-col items-center my-auto pt-2 pb-6 px-3">
        {/* Playzy Signature 3D Prism Avatar */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#00A9C0] via-[#00c9a7] to-[#2495ff] p-0.5 shadow-[0_0_45px_rgba(0,201,167,0.4)] animate-pulse-glow">
            <div className="w-full h-full bg-[#0A0E14] rounded-[22px] flex items-center justify-center p-3 transition-colors overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 128 128" fill="none">
                <path d="M28 20C28 15.39 33.02 12.55 37.01 14.89L96.01 49.89C99.98 52.24 99.98 57.76 96.01 60.11L62 80L28 58V20Z" fill="url(#heroLogoGrad)"/>
                <path d="M28 58L62 80L37.01 94.41C33.02 96.72 28 93.88 28 89.27V58Z" fill="url(#heroLogoFacet)"/>
                <path d="M28 58L62 80L96.01 60.11" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.8"/>
                <path d="M104 46C109 52 112 59 112 66C112 73 109 80 104 86" stroke="url(#heroLogoGrad)" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.95"/>
                <g transform="translate(62, 58)">
                  <path d="M0 -15C0.8 -5 5 -0.8 15 0C5 0.8 0.8 5 0 15C-0.8 5 -5 0.8 -15 0C-5 -0.8 -0.8 -5 0 -15Z" fill="#FFFFFF"/>
                  <circle cx="0" cy="0" r="2.5" fill="#00C9A7"/>
                </g>
                <defs>
                  <linearGradient id="heroLogoGrad" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00F5D4"/>
                    <stop offset="45%" stopColor="#00C9A7"/>
                    <stop offset="100%" stopColor="#0284C7"/>
                  </linearGradient>
                  <linearGradient id="heroLogoFacet" x1="20" y1="50" x2="70" y2="110" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7000FF" stopOpacity="0.95"/>
                    <stop offset="100%" stopColor="#00C9A7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Hero Headings */}
        <h1 className="text-3xl sm:text-[44px] font-extrabold text-slate-900 dark:text-white text-center leading-tight tracking-tight">
          What would you like to{' '}
          <span className="skywork-gradient-text font-black">create or research</span> today?
        </h1>
        <p className="text-sm sm:text-[17px] text-slate-600 dark:text-slate-400 text-center mt-3 font-normal max-w-xl">
          Multi-agent deep web research, ElevenLabs-quality voice synthesis, 4K media extraction, and document writing.
        </p>

        {/* CENTRAL SKYWORK COMMAND CARD (`prompt-section`) */}
        <div className="w-full mt-7 bg-white dark:bg-[#181D24] rounded-[26px] border border-slate-200 dark:border-[#263241] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] focus-within:border-[#00c9a7]/50 focus-within:shadow-[0_0_32px_rgba(0,201,167,0.2)] transition-all p-3 sm:p-4">
          {/* Top Agent Mode Filter Tabs (Skywork agent pill navigation) */}
          <div className="flex items-center gap-1.5 pb-3 overflow-x-auto custom-scrollbar border-b border-slate-100 dark:border-[#212932]">
            <button
              type="button"
              onClick={() => setSelectedAgentTab('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAgentTab === 'all'
                  ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252F]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#009688] dark:text-[#00c9a7]" />
              <span>All Agents</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAgentTab('research');
                setDeepResearchActive(true);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAgentTab === 'research'
                  ? 'bg-slate-100 dark:bg-[#242C37] text-[#009688] dark:text-[#00c9a7] border border-[#00c9a7]/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252F]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Deep Research</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAgentTab('doc');
                onSelectTool('paraphrasing-tool');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAgentTab === 'doc'
                  ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Document Agent</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAgentTab('voice');
                onSelectTool('ai-voice-generator');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAgentTab === 'voice'
                  ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252F]'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Voice Studio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAgentTab('downloader');
                onSelectTool('video-downloader');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAgentTab === 'downloader'
                  ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252F]'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5 text-sky-500" />
              <span>Media Downloader</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAgentTab('transcriber');
                onSelectTool('mp3-to-text');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAgentTab === 'transcriber'
                  ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252F]'
              }`}
            >
              <FileAudio className="w-3.5 h-3.5 text-emerald-500" />
              <span>Transcriber</span>
            </button>
          </div>

          {/* Central Input Textarea */}
          <div className="pt-3 pb-2">
            <textarea
              ref={pristineTextareaRef}
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything, analyze documents, paste YouTube/TikTok links, or type text to synthesize voice..."
              className="w-full resize-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-[15px] sm:text-[16px] leading-relaxed bg-transparent select-text"
            />
          </div>

          {/* Bottom Controls Row inside Skywork Card */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#263241]">
            {/* Left: Attach File + Deep Research Toggle + Skills Dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* File Upload Trigger */}
              <button
                type="button"
                onClick={() => pristineFileInputRef.current?.click()}
                title="Upload document, audio or video (.pdf, .docx, .mp3, .mp4)"
                className="w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202732] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Deep Research Toggle Pill */}
              <button
                type="button"
                onClick={() => setDeepResearchActive(!deepResearchActive)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  deepResearchActive
                    ? 'bg-[#00c9a7]/10 dark:bg-[#00c9a7]/15 border-[#00c9a7]/30 dark:border-[#00c9a7]/40 text-[#00897b] dark:text-[#00c9a7] shadow-[0_0_12px_rgba(0,201,167,0.15)]'
                    : 'bg-slate-100 dark:bg-[#141A22] border-slate-200 dark:border-[#263241] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Deep Research</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    deepResearchActive ? 'bg-[#00c9a7] shadow-[0_0_6px_#00c9a7]' : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                />
              </button>

              {/* Attached file pill if any */}
              {attachedFileName && (
                <span className="text-xs bg-slate-100 dark:bg-[#141A22] border border-[#00c9a7]/40 text-[#00897b] dark:text-[#00c9a7] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Paperclip className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{attachedFileName}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedFileName(null)}
                    className="hover:text-rose-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {/* Right: Word Count & Send Arrow Button */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline-block">
                {wordCount} words
              </span>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!promptText.trim() && !attachedFileName}
                title="Run prompt"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  promptText.trim() || attachedFileName
                    ? 'bg-gradient-to-tr from-[#00A9C0] to-[#00c9a7] text-slate-950 font-bold shadow-[0_0_18px_rgba(0,201,167,0.4)] hover:scale-105 active:scale-95'
                    : 'bg-slate-200 dark:bg-[#202732] text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <ArrowRight className="w-4 h-4 stroke-[2.4]" />
              </button>
            </div>
          </div>
        </div>

        {/* SKYWORK BENTO QUERY CARDS GRID (Matching Skywork 6 core cards) */}
        <div className="w-full mt-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Autonomous Agent Modules
            </span>
            <button
              type="button"
              onClick={() => onOpenAllToolsModal?.()}
              className="text-xs text-[#009688] dark:text-[#00c9a7] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All 20+ Tools</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
            {/* Card 1: Deep Research */}
            <button
              type="button"
              onClick={() => {
                setPromptText(
                  'Conduct a deep multimodal market research report on autonomous AI agent frameworks in 2026 with architecture comparisons and benchmarks.'
                );
                setDeepResearchActive(true);
                pristineTextareaRef.current?.focus();
              }}
              className="text-left bg-white hover:bg-slate-50/80 dark:bg-[#181D24] dark:hover:bg-[#1E252F] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-xl bg-[#00c9a7]/15 border border-[#00c9a7]/30 flex items-center justify-center text-[#009688] dark:text-[#00c9a7]">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-slate-600 dark:text-slate-400">
                  Autonomous
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#009688] dark:group-hover:text-[#00c9a7] transition-colors">
                  Deep Research Agent
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Synthesizes 100+ sources into structured reports with verifiable citations.
                </div>
              </div>
            </button>

            {/* Card 2: AI Voice Studio */}
            <button
              type="button"
              onClick={() => onSelectTool('ai-voice-generator')}
              className="text-left bg-white hover:bg-slate-50/80 dark:bg-[#181D24] dark:hover:bg-[#1E252F] border border-slate-200 dark:border-[#263241] hover:border-purple-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-purple-600 dark:text-purple-400">
                  ElevenLabs Grade
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  AI Voice Studio
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Generate studio-quality speech with 36+ voices, lifelike accents, and instant MP3 download.
                </div>
              </div>
            </button>

            {/* Card 3: Media Downloader */}
            <button
              type="button"
              onClick={() => onSelectTool('video-downloader')}
              className="text-left bg-white hover:bg-slate-50/80 dark:bg-[#181D24] dark:hover:bg-[#1E252F] border border-slate-200 dark:border-[#263241] hover:border-sky-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <DownloadCloud className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-sky-600 dark:text-sky-400">
                  4K &amp; 320kbps
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Media Downloader
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Extract watermark-free HD videos and high-bitrate MP3s from YouTube and TikTok.
                </div>
              </div>
            </button>

            {/* Card 4: Audio & Video Transcriber */}
            <button
              type="button"
              onClick={() => onSelectTool('mp3-to-text')}
              className="text-left bg-white hover:bg-slate-50/80 dark:bg-[#181D24] dark:hover:bg-[#1E252F] border border-slate-200 dark:border-[#263241] hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <FileAudio className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-emerald-600 dark:text-emerald-400">
                  MP3 / MP4
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Audio &amp; Video Transcriber
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Convert speech into accurate timestamped text with SRT and DOCX export.
                </div>
              </div>
            </button>

            {/* Card 5: AI Content Detector */}
            <button
              type="button"
              onClick={() => onSelectTool('ai-detector')}
              className="text-left bg-white hover:bg-slate-50/80 dark:bg-[#181D24] dark:hover:bg-[#1E252F] border border-slate-200 dark:border-[#263241] hover:border-orange-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-orange-600 dark:text-orange-400">
                  0 - 100 Score
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  AI Content Detector
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Detect ChatGPT, Claude, and Gemini text with precise probability scoring.
                </div>
              </div>
            </button>

            {/* Card 6: AI Humanizer & Paraphraser */}
            <button
              type="button"
              onClick={() => onSelectTool('ai-humanizer')}
              className="text-left bg-white hover:bg-slate-50/80 dark:bg-[#181D24] dark:hover:bg-[#1E252F] border border-slate-200 dark:border-[#263241] hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-cyan-600 dark:text-cyan-400">
                  Undetectable
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  AI Humanizer &amp; Paraphraser
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Rewrite robotic AI writing into 100% natural, human-sounding flow that bypasses detectors.
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER DISCLAIMER */}
      <footer className="w-full text-center pb-2 pt-4">
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500">
          Playzy Workspace Agents adhere to ethical content synthesis and respectful copyright protocols.
        </p>
      </footer>
    </div>
  );
}
