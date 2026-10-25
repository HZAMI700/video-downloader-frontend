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
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [dislikedMap, setDislikedMap] = useState<Record<string, boolean>>({});
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

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

  // Handle file uploads (txt, md, doc, docx)
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

  // Chat message submission
  const handleSendMessage = async (textToSend?: string) => {
    const raw = typeof textToSend === 'string' ? textToSend : promptText;
    const clean = raw.trim();
    if (!clean || isGenerating) return;

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

      const response = await runAiChat(
        chatHistory,
        'You are Playzy AI — an intelligent, friendly, ultra-capable writing and reasoning assistant. Provide direct, beautifully structured, and high-quality responses.'
      );

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content:
          "I've processed your request. You can also send this text directly into Playzy's specialized tools (Paraphraser, AI Humanizer, AI Detector, or Voice Studio) using the Tools menu below.",
        createdAt: Date.now(),
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
        'You are Playzy AI — provide an alternative high-quality response.'
      );

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        createdAt: Date.now(),
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

  // ----------------------------------------------------------------------------------
  // VIEW 1: ACTIVE CHAT VIEW (Matching Screenshot 2 - media_1792939430993_c880f2fd.png)
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

        {/* Top Header Row in Chat: [+ New Chat] */}
        <div className="flex items-center justify-between pb-3 shrink-0">
          <button
            type="button"
            onClick={handleResetChat}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition active:scale-95 shadow-2xs cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-slate-600" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-6 py-4 space-y-6">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {isUser ? (
                  /* User Bubble (matching screenshot 2: light mint, right aligned) */
                  <div className="bg-[#EFF5F1] text-slate-800 px-4 py-2.5 rounded-[18px] max-w-[80%] text-sm leading-relaxed border border-[#DCE5DF]">
                    <p className="whitespace-pre-wrap select-text">{m.content}</p>
                  </div>
                ) : (
                  /* Assistant Bubble (matching screenshot 2: clean text on white + 4 action icons) */
                  <div className="max-w-[85%] space-y-2">
                    <div className="text-slate-800 text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap select-text font-normal">
                      {m.content}
                    </div>

                    {/* 4 Action Icons underneath text: Copy, Regenerate, Thumbs Up, Thumbs Down */}
                    <div className="flex items-center gap-2 pt-1 text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        title="Copy message"
                        className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        title="Regenerate response"
                        className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer disabled:opacity-40"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleThumbsUp(m.id)}
                        title="Good response"
                        className={`p-1.5 rounded-md hover:bg-slate-100 transition cursor-pointer ${
                          likedMap[m.id] ? 'text-emerald-600' : 'hover:text-slate-800'
                        }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${
                            likedMap[m.id] ? 'fill-emerald-600 text-emerald-600' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleThumbsDown(m.id)}
                        title="Bad response"
                        className={`p-1.5 rounded-md hover:bg-slate-100 transition cursor-pointer ${
                          dislikedMap[m.id] ? 'text-rose-600' : 'hover:text-slate-800'
                        }`}
                      >
                        <ThumbsDown
                          className={`w-4 h-4 ${
                            dislikedMap[m.id] ? 'fill-rose-600 text-rose-600' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Loader2 className="w-3.5 h-3.5 text-[#2E7D32] animate-spin" />
              <span>Playzy AI is writing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Pinned Area (Matching Screenshot 2) */}
        <div className="w-full max-w-[720px] mx-auto pt-3 pb-2 px-3 space-y-2 shrink-0">
          {/* Notification Banner */}
          {showNoticeBanner && (
            <div className="w-full bg-[#EFF5F1] border border-[#D5E3DA] rounded-xl px-4 py-2 flex items-center justify-between text-[12px] text-slate-600 shadow-2xs">
              <p className="truncate mr-2">
                Chats are processed by Playzy and its service providers.{' '}
                <a href="#terms" className="underline hover:text-slate-900">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="underline hover:text-slate-900">
                  Privacy Policy
                </a>{' '}
                apply.
              </p>
              <button
                type="button"
                onClick={() => setShowNoticeBanner(false)}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Floating Chat Input Box */}
          <div className="relative bg-white rounded-[22px] border border-[#CBDCD0] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-[#B8CEC0] focus-within:border-[#2E7D32]/40 transition-all p-3 sm:p-4">
            {attachedFileName && (
              <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF5F1] text-[11px] text-[#2E7D32] font-semibold">
                <Paperclip className="w-3 h-3" />
                <span>{attachedFileName}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFileName(null)}
                  className="hover:text-rose-600 ml-1"
                >
                  <X className="w-3 h-3" />
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
              placeholder="Type your message ..."
              className="w-full resize-none outline-none border-none text-slate-800 placeholder-[#9CA3AF] text-sm sm:text-base leading-relaxed bg-transparent focus:ring-0 select-text min-h-[44px] max-h-[160px]"
            />

            {/* Bottom Toolbar inside Chat Box */}
            <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-100">
              {/* Left Controls: Paperclip + [+ Tools ▾] */}
              <div className="relative flex items-center gap-2" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                  <span>Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Tools Dropdown Menu */}
                {showToolsDropdown && (
                  <div className="absolute bottom-11 left-0 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1 animate-apple-in">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                      Route Prompt to Tool
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('paraphrasing-tool', promptText);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-semibold text-left transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Paraphraser</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('ai-humanizer', promptText);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-semibold text-left transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>AI Humanizer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('ai-detector', promptText);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-semibold text-left transition"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
                      <span>AI Detector</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('ai-voice-generator', promptText);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-semibold text-left transition"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Voice Studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('mp3-to-text');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-semibold text-left transition"
                    >
                      <FileAudio className="w-3.5 h-3.5 text-blue-600" />
                      <span>MP3 to Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('mp4-to-text');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-semibold text-left transition"
                    >
                      <FileVideo className="w-3.5 h-3.5 text-indigo-600" />
                      <span>MP4 to Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowToolsDropdown(false);
                        onSelectTool('video-downloader');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-semibold text-left transition"
                    >
                      <Share2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Video Downloader</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Circular Send Button with Up Arrow */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!promptText.trim() || isGenerating}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  promptText.trim() && !isGenerating
                    ? 'bg-[#2E7D32] text-white hover:bg-[#256628] shadow-xs active:scale-95 cursor-pointer'
                    : 'bg-[#E3EBE6] text-[#9CA3AF] cursor-not-allowed'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.4]" />
              </button>
            </div>
          </div>

          {/* Under-prompt Disclaimer */}
          <p className="text-[11.5px] text-[#9CA3AF] text-center font-normal">
            AI responses may be inaccurate. Don&apos;t enter sensitive info.
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------------
  // VIEW 2: PRISTINE HOME SCREEN (Matching Screenshot 1 & quillbot_dashboard_replica.html)
  // ----------------------------------------------------------------------------------
  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center py-2 select-none animate-apple-in">
      {/* Hidden File Input for pristine prompt box */}
      <input
        ref={pristineFileInputRef}
        type="file"
        accept=".txt,.md,.doc,.docx,.pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* TOP PROMO BANNER (Laurel Wreath + Add to Edge) */}
      <div className="w-full flex items-center justify-center pt-0.5">
        <div className="inline-flex items-center flex-wrap justify-center gap-3 text-sm">
          {/* Left Laurel Wreath + Text */}
          <div className="flex items-center gap-1.5">
            <svg
              className="w-5 h-7 text-[#2E7D32]"
              viewBox="0 0 24 32"
              fill="currentColor"
            >
              <path
                d="M18 28c-5-2-9-7-10-13 2 0 4 1 5 3-1-3-1-6 1-9 1 2 2 4 2 6 0-3 2-6 5-8-1 3 0 5 1 7 1-2 3-4 5-5-2 3-2 6-1 8-2 0-4 2-5 4 2 1 3 3 3 5-3-1-5 0-6 2z"
                opacity="0.85"
              />
            </svg>
            <span className="text-[13.5px] font-semibold text-[#1F2937] tracking-tight">
              Perfect your writing everywhere
            </span>
            <svg
              className="w-5 h-7 text-[#2E7D32] scale-x-[-1]"
              viewBox="0 0 24 32"
              fill="currentColor"
            >
              <path
                d="M18 28c-5-2-9-7-10-13 2 0 4 1 5 3-1-3-1-6 1-9 1 2 2 4 2 6 0-3 2-6 5-8-1 3 0 5 1 7 1-2 3-4 5-5-2 3-2 6-1 8-2 0-4 2-5 4 2 1 3 3 3 5-3-1-5 0-6 2z"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-gray-300 hidden sm:block" />

          {/* Add to Edge Button */}
          <a
            href="https://microsoftedge.microsoft.com/addons"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-[#1F2937] flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="url(#edgeGradHome)" />
              <path
                d="M7.5 14.5C7.5 10.5 11 8 15 8C17.5 8 19.5 9.5 19.5 12C19.5 14 18 15.5 15.5 15.5H11C11 17 12.8 18 15 18C16.8 18 18 17.3 18.8 16.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="edgeGradHome"
                  x1="2"
                  y1="2"
                  x2="22"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0078D4" />
                  <stop offset="0.5" stopColor="#00B294" />
                  <stop offset="1" stopColor="#4CAF50" />
                </linearGradient>
              </defs>
            </svg>
            <span>Add to Edge. It&apos;s Free</span>
          </a>
        </div>
      </div>

      {/* CENTER HERO & PROMPT SECTION */}
      <div className="w-full max-w-[770px] flex flex-col items-center my-auto pt-6 pb-4">
        {/* Hero Heading */}
        <h1 className="text-3xl sm:text-[42px] font-extrabold text-[#111827] text-center leading-tight tracking-tight">
          Create something great today
        </h1>
        <p className="text-base sm:text-[18.5px] text-[#6B7280] text-center mt-2.5 font-normal">
          Write, design, build, and so much more with AI tools for every task.
        </p>

        {/* CENTRAL PROMPT BOX (Matching quillbot_dashboard_replica.html) */}
        <div className="w-full mt-8 bg-[#E9F1EC] p-[7px] rounded-[22px] border border-[#D5E3DA] prompt-outer-shadow transition-all">
          {/* Inner White Card */}
          <div className="bg-white rounded-[16px] px-5 pt-4 pb-3.5 flex flex-col justify-between min-h-[152px] border border-white focus-within:border-[#2E7D32]/30 transition-all">
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
              placeholder="Write, paste, upload, or start with an action below"
              className="w-full resize-none outline-none text-[#1F2937] placeholder-[#6B7280] text-[15.5px] leading-relaxed bg-transparent select-text"
            />

            {/* Bottom Controls inside White Box */}
            <div className="flex items-center justify-between pt-2">
              {/* Plus / Upload Trigger */}
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => pristineFileInputRef.current?.click()}
                  title="Upload document or image"
                  className="w-8 h-8 rounded-full text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 stroke-[2]" />
                </button>

                {attachedFileName && (
                  <span className="text-xs bg-[#EFF5F1] text-[#2E7D32] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Paperclip className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{attachedFileName}</span>
                  </span>
                )}
              </div>

              {/* Submit Arrow Button (Arrow Right or Arrow Up) */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!promptText.trim() && !attachedFileName}
                title="Run prompt"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  promptText.trim() || attachedFileName
                    ? 'bg-[#2E7D32] text-white shadow-xs hover:bg-[#256628] active:scale-95'
                    : 'bg-[#E3EBE6] text-[#6B7280] hover:bg-[#2E7D32] hover:text-white'
                }`}
              >
                <ArrowRight className="w-[18px] h-[18px] stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Action Pills Row (Inside Mint Container) */}
          <div className="flex items-center justify-center gap-2.5 py-2.5 px-2 flex-wrap">
            {/* Pill 1: Create */}
            <button
              type="button"
              onClick={() => {
                if (promptText.trim()) {
                  handleSendMessage();
                } else {
                  setPromptText('Create an engaging article outline about ');
                  pristineTextareaRef.current?.focus();
                }
              }}
              className="bg-white hover:bg-gray-50 active:scale-[0.98] text-[#1F2937] text-[13.5px] font-semibold px-4 py-1.5 rounded-full pill-shadow border border-gray-200/70 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span className="w-5 h-5 rounded-md bg-pink-50 flex items-center justify-center text-[#E11D48]">
                <FileText className="w-3.5 h-3.5 stroke-[2.3]" />
              </span>
              <span>Create</span>
            </button>

            {/* Pill 2: Paraphraser */}
            <button
              type="button"
              onClick={() => onSelectTool('paraphrasing-tool', promptText)}
              className="bg-white hover:bg-gray-50 active:scale-[0.98] text-[#1F2937] text-[13.5px] font-semibold px-4 py-1.5 rounded-full pill-shadow border border-gray-200/70 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-[#16A34A]">
                <RefreshCw className="w-3.5 h-3.5 stroke-[2.3]" />
              </span>
              <span>Paraphraser</span>
            </button>

            {/* Pill 3: AI Humanizer */}
            <button
              type="button"
              onClick={() => onSelectTool('ai-humanizer', promptText)}
              className="bg-white hover:bg-gray-50 active:scale-[0.98] text-[#1F2937] text-[13.5px] font-semibold px-4 py-1.5 rounded-full pill-shadow border border-gray-200/70 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[#10B981]">
                <Sparkles className="w-3.5 h-3.5 stroke-[2.3]" />
              </span>
              <span>AI Humanizer</span>
            </button>

            {/* Pill 4: AI Detector */}
            <button
              type="button"
              onClick={() => onSelectTool('ai-detector', promptText)}
              className="bg-white hover:bg-gray-50 active:scale-[0.98] text-[#1F2937] text-[13.5px] font-semibold px-4 py-1.5 rounded-full pill-shadow border border-gray-200/70 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center text-[#F97316]">
                <ShieldAlert className="w-3.5 h-3.5 stroke-[2.3]" />
              </span>
              <span>AI Detector</span>
            </button>

            {/* Pill 5: + More */}
            <button
              type="button"
              onClick={() => onOpenAllToolsModal?.()}
              className="bg-white hover:bg-gray-50 active:scale-[0.98] text-[#1F2937] text-[13.5px] font-semibold px-4 py-1.5 rounded-full pill-shadow border border-gray-200/70 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-gray-700 stroke-[2.3]" />
              <span>More</span>
            </button>
          </div>
        </div>

        {/* SUGGESTIONS SECTION ("Need an idea? Try one of these...") */}
        <p className="text-[12px] text-[#6B7280] mt-6 mb-3 font-medium">
          Need an idea? Try one of these...
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full">
          {/* Suggestion Card 1 */}
          <button
            type="button"
            onClick={() =>
              handleSendMessage(
                'Create a pitch deck for a SaaS marketing platform launching in Q3 with slide-by-slide talking points.'
              )
            }
            className="text-left bg-white hover:bg-[#F9FBFA] border border-gray-200/90 hover:border-[#B8CEC0] rounded-2xl p-3.5 flex items-start gap-3 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DB2777] shrink-0 mt-0.5">
              <FileText className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-[#111827] group-hover:text-[#2E7D32] transition-colors">
                Create presentations
              </div>
              <div className="text-[12px] text-[#6B7280] truncate mt-0.5">
                Create a pitch deck for a SaaS marketin...
              </div>
            </div>
          </button>

          {/* Suggestion Card 2 */}
          <button
            type="button"
            onClick={() =>
              handleSendMessage(
                'Create a resume for a business internship highlighting analytical coursework, leadership, and project management.'
              )
            }
            className="text-left bg-white hover:bg-[#F9FBFA] border border-gray-200/90 hover:border-[#B8CEC0] rounded-2xl p-3.5 flex items-start gap-3 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7] shrink-0 mt-0.5">
              <FileCheck2 className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-[#111827] group-hover:text-[#2E7D32] transition-colors">
                Create resumes
              </div>
              <div className="text-[12px] text-[#6B7280] truncate mt-0.5">
                Create a resume for a business internsh...
              </div>
            </div>
          </button>

          {/* Suggestion Card 3 */}
          <button
            type="button"
            onClick={() =>
              handleSendMessage(
                'Create an Instagram post announcing a new eco-friendly product line with engaging hooks and relevant hashtags.'
              )
            }
            className="text-left bg-white hover:bg-[#F9FBFA] border border-gray-200/90 hover:border-[#B8CEC0] rounded-2xl p-3.5 flex items-start gap-3 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#9333EA] shrink-0 mt-0.5">
              <Share2 className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-[#111827] group-hover:text-[#2E7D32] transition-colors">
                Create social media posts
              </div>
              <div className="text-[12px] text-[#6B7280] truncate mt-0.5">
                Create an Instagram post announcing a...
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* FOOTER DISCLAIMER */}
      <footer className="w-full text-center pb-1 pt-4">
        <p className="text-[12px] text-[#6B7280]">
          Ensure you have the rights to images or files you upload. Comply with our{' '}
          <a href="#copyright" className="underline hover:text-gray-800">
            Copyright Policy
          </a>{' '}
          and{' '}
          <a href="#guidelines" className="underline hover:text-gray-800">
            Community Guidelines
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
