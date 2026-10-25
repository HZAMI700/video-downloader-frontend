'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  RefreshCw,
  CheckCheck,
  ShieldAlert,
  AlignLeft,
  UserCheck,
  Languages,
  FileSearch,
  Sparkles,
  Copy,
  Check,
  Download,
  UploadCloud,
  FileText,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
  Sliders,
  Send,
  X,
  Bot,
  Wand2,
  ClipboardPaste,
  HelpCircle,
  FileCode,
  Gauge,
  Info,
  RotateCcw,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import {
  runParaphrase,
  runGrammarCheck,
  runSummarize,
  runHumanize,
  runAiChat,
  runPlagiarismCheck,
  runAiDetector,
  translateTranscriptText,
  AiDetectorResponse,
} from '../../lib/api';

interface QuillBotAiStudioProps {
  toolId: ToolId;
  onSelectTool?: (toolId: ToolId) => void;
  onBackToCategory?: () => void;
}

interface AiToolCardConfig {
  id: ToolId;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badgeColor: string;
}

export const QUILLBOT_TOOLS: AiToolCardConfig[] = [
  {
    id: 'paraphrasing-tool',
    title: 'Paraphraser',
    description: 'Rewrite and refine text with fluency & creative modes',
    icon: <RefreshCw className="w-4 h-4 text-[#499557]" />,
    iconBg: 'bg-[#edf7ee] border-[#499557]/30',
    badgeColor: 'text-[#499557] bg-[#edf7ee] border-[#499557]/40',
  },
  {
    id: 'grammar-checker',
    title: 'Grammar Checker',
    description: 'Fix spelling, grammar, punctuation with zero errors',
    icon: <CheckCheck className="w-4 h-4 text-rose-600" />,
    iconBg: 'bg-rose-50 border-rose-200/80',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  {
    id: 'ai-detector',
    title: 'AI Detector',
    description: 'Detect AI text with a precise 0-100 probability score',
    icon: <ShieldAlert className="w-4 h-4 text-[#499557]" />,
    iconBg: 'bg-[#edf7ee] border-[#499557]/30',
    badgeColor: 'text-[#499557] bg-[#edf7ee] border-[#499557]/40',
  },
  {
    id: 'ai-humanizer',
    title: 'AI Humanizer',
    description: 'Make writing sound natural and bypass AI detectors',
    icon: <UserCheck className="w-4 h-4 text-teal-600" />,
    iconBg: 'bg-teal-50 border-teal-200/80',
    badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
  },
  {
    id: 'summarizer',
    title: 'Summarizer',
    description: 'Condense long text into bullet points or concise TL;DR',
    icon: <AlignLeft className="w-4 h-4 text-purple-600" />,
    iconBg: 'bg-purple-50 border-purple-200/80',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    id: 'translator',
    title: 'Translator',
    description: 'Translate quickly and accurately across 30+ languages',
    icon: <Languages className="w-4 h-4 text-slate-700" />,
    iconBg: 'bg-slate-100 border-slate-300/80',
    badgeColor: 'text-slate-700 bg-slate-100 border-slate-300',
  },
  {
    id: 'plagiarism-checker',
    title: 'Plagiarism Checker',
    description: 'Detect unoriginal content across billions of web pages',
    icon: <FileSearch className="w-4 h-4 text-amber-600" />,
    iconBg: 'bg-amber-50 border-amber-200/80',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: 'ai-chat',
    title: 'AI Chat',
    description: "Unlock your writing potential with QuillBot's free AI chat",
    icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
    iconBg: 'bg-blue-50 border-blue-200/80',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ru', label: 'Russian' },
  { code: 'ta', label: 'Tamil' },
];

const SAMPLE_TEXTS: Record<string, string> = {
  'paraphrasing-tool':
    'Artificial intelligence technology has advanced rapidly over the past few years, revolutionizing everyday workflows and allowing creators to automate mundane drafting tasks with unprecedented speed and efficiency.',
  'grammar-checker':
    'Their going to the office yesterday, but neither of the managers have received the report yet. Its essential that everyone do their part.',
  'ai-detector-ai':
    'In conclusion, it is vital to acknowledge the multifaceted paradigm of artificial intelligence. Delving into its profound implications, modern algorithmic synthesis represents a quintessential testament to the progression of computational cognition and linguistic modeling.',
  'ai-detector-human':
    'I tried baking sourdough bread for the first time this weekend. The kitchen ended up covered in flour, the dough stuck to my hands like glue, but the crust came out surprisingly crispy and tasted incredible with salted butter.',
  'ai-humanizer':
    'It is unequivocally imperative to acknowledge the quintessential role of modern algorithmic reasoning in optimizing corporate computational throughput.',
  'summarizer':
    'Machine learning is a branch of artificial intelligence and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy. In the last couple of decades, technological advances in storage and processing power have enabled some innovative products based on machine learning, such as Netflix’s recommendation engine and self-driving cars.',
  'translator':
    'Welcome to QuillBot! Our intelligent writing platform empowers millions of students and professionals to write with clarity and confidence.',
  'plagiarism-checker':
    'To be or not to be, that is the question: whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.',
};

export function QuillBotAiStudio({
  toolId,
  onSelectTool,
  onBackToCategory,
}: QuillBotAiStudioProps) {
  const [currentTool, setCurrentTool] = useState<ToolId>(
    toolId === 'ai-section' ? 'paraphrasing-tool' : toolId
  );

  useEffect(() => {
    if (toolId !== 'ai-section') {
      setCurrentTool(toolId);
    }
  }, [toolId]);

  const handleToolChange = (id: ToolId) => {
    setCurrentTool(id);
    if (onSelectTool) onSelectTool(id);
  };

  // Shared Drag & Drop File State
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Common input text state
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Paraphraser state
  const [paraphraseMode, setParaphraseMode] = useState('standard');
  const [synonymLevel, setSynonymLevel] = useState('medium');

  // Grammar checker state
  const [grammarErrors, setGrammarErrors] = useState<any[]>([]);

  // AI Detector state (NEW!)
  const [detectorResult, setDetectorResult] = useState<AiDetectorResponse | null>(null);
  const [hoveredSentenceIndex, setHoveredSentenceIndex] = useState<number | null>(null);

  // Summarizer state
  const [summaryFormat, setSummaryFormat] = useState('paragraph');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryStats, setSummaryStats] = useState<{ orig: number; sum: number; red: number } | null>(null);

  // AI Humanizer state
  const [humanizeTone, setHumanizeTone] = useState('balanced');
  const [aiScore, setAiScore] = useState<number | null>(null);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content:
        "Hello! I'm QuillBot AI Assistant. How can I help you write, brainstorm, edit, or research today?",
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Translator state
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');

  // Plagiarism checker state
  const [plagReport, setPlagReport] = useState<any | null>(null);

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter runs primary action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        triggerCurrentAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTool, inputText, paraphraseMode, synonymLevel, humanizeTone, summaryFormat, summaryLength, targetLang]);

  const triggerCurrentAction = () => {
    if (isLoading || !inputText.trim()) return;
    switch (currentTool) {
      case 'paraphrasing-tool':
        handleParaphrase();
        break;
      case 'grammar-checker':
        handleGrammarCheck();
        break;
      case 'ai-detector':
        handleAiDetector();
        break;
      case 'summarizer':
        handleSummarize();
        break;
      case 'ai-humanizer':
        handleHumanize();
        break;
      case 'translator':
        handleTranslate();
        break;
      case 'plagiarism-checker':
        handlePlagiarismCheck();
        break;
    }
  };

  // Universal File Drop handler
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processIncomingFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processIncomingFile(e.target.files[0]);
    }
  };

  const processIncomingFile = (file: File) => {
    setLoadedFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setInputText(text);
        if (currentTool === 'ai-chat') {
          setChatInput(`Please analyze this uploaded document (${file.name}):\n\n${text.slice(0, 1500)}`);
        }
      }
    };
    reader.readAsText(file);
  };

  // Copy helper
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Paste helper
  const handlePasteFromClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setInputText(clipText);
      }
    } catch {
      // Fallback
    }
  };

  // Sample text helper
  const handleInsertSample = (customKey?: string) => {
    const key = customKey || currentTool;
    const sample = SAMPLE_TEXTS[key] || SAMPLE_TEXTS['paraphrasing-tool'];
    setInputText(sample);
    setErrorMessage(null);
  };

  // Download helper
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 1. Run Paraphrase
  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter or drop some text to paraphrase.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runParaphrase(inputText, paraphraseMode, synonymLevel);
      setOutputText(res.paraphrased_text);
    } catch (err: any) {
      setErrorMessage(err.message || 'Paraphrasing failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Run Grammar Check
  const handleGrammarCheck = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter or drop text to check grammar.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runGrammarCheck(inputText);
      setOutputText(res.corrected_text);
      setGrammarErrors(res.errors || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Grammar check failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Run AI Detector (NEW!)
  const handleAiDetector = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter, paste, or drop text to scan for AI content.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runAiDetector(inputText);
      setDetectorResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'AI detection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Run Summarizer
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter or drop text to summarize.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runSummarize(inputText, summaryFormat, summaryLength);
      setOutputText(res.summary);
      setSummaryStats({
        orig: res.original_word_count,
        sum: res.summary_word_count,
        red: res.reduction_percent,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Summarization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Run AI Humanizer
  const handleHumanize = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter or drop text to humanize.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runHumanize(inputText, humanizeTone);
      setOutputText(res.humanized_text);
      setAiScore(res.humanized_ai_score);
    } catch (err: any) {
      setErrorMessage(err.message || 'Humanizing text failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Run AI Chat
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg = { role: 'user', content: chatInput.trim() };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput('');
    setIsLoading(true);

    try {
      const res = await runAiChat(updated);
      setChatMessages([...updated, { role: 'assistant', content: res.reply }]);
    } catch (err: any) {
      setChatMessages([
        ...updated,
        {
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Run Translator
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter or drop text to translate.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const targetLabel = LANGUAGES.find((l) => l.code === targetLang)?.label || targetLang;
      const res = await translateTranscriptText(inputText, targetLabel, sourceLang);
      setOutputText(res.translated_text);
    } catch (err: any) {
      setErrorMessage(err.message || 'Translation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 8. Run Plagiarism Check
  const handlePlagiarismCheck = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter or drop text to scan for plagiarism.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runPlagiarismCheck(inputText);
      setPlagReport(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Plagiarism scan failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setGrammarErrors([]);
    setPlagReport(null);
    setDetectorResult(null);
    setSummaryStats(null);
    setLoadedFileName(null);
    setErrorMessage(null);
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = inputText.length;

  return (
    <div className="w-full space-y-4 animate-apple-in font-sans">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.pdf,.docx,.doc,text/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* QuillBot Signature Header & Tool Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#499557] text-white flex items-center justify-center shadow-xs">
            {/* QuillBot Quill Icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">QuillBot</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#edf7ee] text-[#499557] border border-[#499557]/20">
                100% Free Suite
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              World’s Favorite AI Writing & Research Platform
            </p>
          </div>
        </div>

        {/* Quick Sibling Tool Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 custom-scrollbar">
          {QUILLBOT_TOOLS.map((t) => {
            const isActive = currentTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleToolChange(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#499557] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                }`}
              >
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QuillBot Main Workspace Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/30 overflow-hidden">
        {/* Top Control Bar (Modes & Controls) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 bg-[#f9fafb]">
          {/* Left: Mode Selection for Paraphraser */}
          {currentTool === 'paraphrasing-tool' ? (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs font-bold text-slate-600 mr-1.5">Modes:</span>
              {['standard', 'fluency', 'formal', 'academic', 'simple', 'creative', 'shorten', 'expand'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setParaphraseMode(m)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    paraphraseMode === m
                      ? 'bg-[#edf7ee] text-[#499557] font-bold border border-[#499557]/40 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : currentTool === 'ai-detector' ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#499557] bg-[#edf7ee] px-3 py-1 rounded-full border border-[#499557]/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>AI Content Detector (0-100 Score)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Deep neural scan analyzing vocabulary repetition and syntax
              </span>
            </div>
          ) : currentTool === 'grammar-checker' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                0 Errors Proofreader
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Fixes spelling, punctuation, and subject-verb disagreements instantly
              </span>
            </div>
          ) : currentTool === 'ai-humanizer' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Tone:</span>
              {['balanced', 'academic', 'casual'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setHumanizeTone(t)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    humanizeTone === t
                      ? 'bg-teal-50 text-teal-700 font-bold border border-teal-300'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : currentTool === 'summarizer' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Format:</span>
              <button
                type="button"
                onClick={() => setSummaryFormat('paragraph')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  summaryFormat === 'paragraph'
                    ? 'bg-purple-50 text-purple-700 font-bold border border-purple-300'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Paragraph
              </button>
              <button
                type="button"
                onClick={() => setSummaryFormat('bullets')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  summaryFormat === 'bullets'
                    ? 'bg-purple-50 text-purple-700 font-bold border border-purple-300'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Bullet Points
              </button>
            </div>
          ) : currentTool === 'translator' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Translate to:</span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-800 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {QUILLBOT_TOOLS.find((t) => t.id === currentTool)?.title}
              </span>
            </div>
          )}

          {/* Right: Synonym frequency slider (for Paraphraser) or Quick info */}
          {currentTool === 'paraphrasing-tool' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Synonyms:</span>
              <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5">
                {['low', 'medium', 'high'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSynonymLevel(lvl)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md capitalize transition-all ${
                      synonymLevel === lvl
                        ? 'bg-[#499557] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">Ctrl+Enter</kbd> to run</span>
            </div>
          )}
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button type="button" onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 1: PARAPHRASER & CORE SPLIT EDITOR */}
        {/* ======================================================== */}
        {currentTool === 'paraphrasing-tool' && (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Input Pane */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`flex flex-col rounded-2xl border transition-all ${
                  isDragOver
                    ? 'border-[#499557] bg-[#edf7ee]/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Input Toolbar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>Paste Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Doc</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSample('paraphrasing-tool')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[#499557] hover:bg-[#edf7ee] font-bold transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sample</span>
                    </button>
                  </div>

                  {inputText && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-slate-400 hover:text-slate-600 font-semibold text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Textarea */}
                <div className="flex-1 p-4">
                  <textarea
                    rows={12}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter or paste text here to rephrase into clear, polished sentences, or drag & drop your document..."
                    className="w-full h-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Bottom Input Action Bar */}
                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-medium text-slate-500">
                    {wordCount} words • {charCount} chars
                  </span>

                  <button
                    type="button"
                    onClick={handleParaphrase}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#499557] hover:bg-[#3d7d49] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>Paraphrase</span>
                  </button>
                </div>
              </div>

              {/* Right Output Pane */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-[#499557] flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4" />
                    <span>Paraphrased Text</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(outputText)}
                      disabled={!outputText}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold disabled:opacity-40"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(outputText, `quillbot_paraphrased_${Date.now()}.txt`)}
                      disabled={!outputText}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold disabled:opacity-40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  {outputText ? (
                    <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
                      {outputText}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <RefreshCw className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">Rephrased content appears here</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Select a mode (Standard, Fluency, Creative) and click Paraphrase
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  <span>
                    {outputText ? outputText.trim().split(/\s+/).filter(Boolean).length : 0} words
                  </span>
                  {outputText && (
                    <span className="text-[#499557] font-bold">✓ Paraphrase complete</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 2: AI CONTENT DETECTOR (NEW & PRO FEATURE)   */}
        {/* ======================================================== */}
        {currentTool === 'ai-detector' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Input Pane */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`flex flex-col rounded-2xl border transition-all ${
                  isDragOver
                    ? 'border-[#499557] bg-[#edf7ee]/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Input Toolbar with Quick Sample Buttons */}
                <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>Paste Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Doc</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleInsertSample('ai-detector-ai')}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                      title="Load AI-generated sample text"
                    >
                      Test AI Sample
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSample('ai-detector-human')}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#499557] bg-[#edf7ee] hover:bg-emerald-100 border border-[#499557]/30 transition"
                      title="Load human-written sample text"
                    >
                      Test Human Sample
                    </button>
                    {inputText && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-slate-400 hover:text-slate-600 font-semibold text-xs ml-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <textarea
                    rows={12}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your essay, article, or document here to check for AI content and receive an authentic score out of 100..."
                    className="w-full h-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-medium text-slate-500">
                    {wordCount} words • {charCount} chars
                  </span>

                  <button
                    type="button"
                    onClick={handleAiDetector}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#499557] hover:bg-[#3d7d49] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                    <span>Scan for AI</span>
                  </button>
                </div>
              </div>

              {/* Right Output / Detection Results Studio */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-[#499557]" />
                    <span>AI Detection Report</span>
                  </span>
                  {detectorResult && (
                    <span className="text-[11px] font-extrabold text-slate-500">
                      Scanned {detectorResult.total_words} words
                    </span>
                  )}
                </div>

                <div className="flex-1 p-5 overflow-y-auto max-h-[500px]">
                  {detectorResult ? (
                    <div className="space-y-5 animate-fadeIn">
                      {/* Big Score Radial Card */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-5">
                        {/* Radial Gauge Visual */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                            {/* Background circle */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-200"
                                strokeWidth="3.8"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              {/* Progress arc */}
                              <path
                                className={
                                  detectorResult.ai_score >= 66
                                    ? 'text-rose-600'
                                    : detectorResult.ai_score >= 25
                                    ? 'text-amber-500'
                                    : 'text-[#499557]'
                                }
                                strokeDasharray={`${detectorResult.ai_score}, 100`}
                                strokeWidth="3.8"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                              <span className="text-2xl font-black text-slate-900 leading-none">
                                {detectorResult.ai_score}%
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                AI Score
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                  detectorResult.ai_score >= 66
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : detectorResult.ai_score >= 25
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-[#edf7ee] text-[#499557] border border-[#499557]/40'
                                }`}
                              >
                                {detectorResult.verdict}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-2 font-medium max-w-sm leading-relaxed">
                              {detectorResult.analysis_summary}
                            </p>
                          </div>
                        </div>

                        {/* Breakdown pills */}
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-5">
                          <div>
                            <span className="text-xs text-slate-500 block">AI Probability</span>
                            <span className="text-base font-black text-rose-600">{detectorResult.ai_score} / 100</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 block">Human Written</span>
                            <span className="text-base font-black text-[#499557]">{detectorResult.human_score} / 100</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Sentence-by-Sentence Highlighted View */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Sentence-Level Inspection:</span>
                          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Likely AI
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Mixed
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Human
                            </span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-white leading-relaxed text-sm text-slate-800 space-y-1.5">
                          {detectorResult.sentences && detectorResult.sentences.length > 0 ? (
                            detectorResult.sentences.map((stn, idx) => {
                              const isAi = stn.classification === 'ai' || stn.ai_probability >= 66;
                              const isMixed = stn.classification === 'mixed' || (stn.ai_probability >= 25 && stn.ai_probability < 66);
                              const isHovered = hoveredSentenceIndex === idx;

                              return (
                                <span
                                  key={idx}
                                  onMouseEnter={() => setHoveredSentenceIndex(idx)}
                                  onMouseLeave={() => setHoveredSentenceIndex(null)}
                                  className={`relative inline cursor-pointer transition-colors px-1 py-0.5 rounded ${
                                    isAi
                                      ? 'bg-rose-100 text-rose-950 border-b-2 border-rose-400 hover:bg-rose-200'
                                      : isMixed
                                      ? 'bg-amber-100 text-amber-950 border-b-2 border-amber-400 hover:bg-amber-200'
                                      : 'bg-emerald-50 text-slate-900 hover:bg-emerald-100'
                                  }`}
                                  title={`AI Probability: ${stn.ai_probability}%${stn.reason ? ` • ${stn.reason}` : ''}`}
                                >
                                  {stn.text}{' '}
                                </span>
                              );
                            })
                          ) : (
                            <p>{inputText}</p>
                          )}
                        </div>

                        {/* Hover Sentence Tooltip Bar */}
                        {hoveredSentenceIndex !== null && detectorResult.sentences[hoveredSentenceIndex] && (
                          <div className="p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between animate-fadeIn">
                            <span className="font-semibold text-slate-300 truncate max-w-[70%]">
                              &ldquo;{detectorResult.sentences[hoveredSentenceIndex].text}&rdquo;
                            </span>
                            <span className="font-extrabold px-2 py-0.5 rounded bg-rose-500 text-white text-[11px]">
                              {detectorResult.sentences[hoveredSentenceIndex].ai_probability}% AI Probability
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <ShieldAlert className="w-10 h-10 text-slate-300 mb-3 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-700">No text scanned yet</p>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        Paste any text on the left and click &ldquo;Scan for AI&rdquo; to compute the 0-100 probability score.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  <span>Detection Model: High-Precision Token Distribution</span>
                  {detectorResult && (
                    <button
                      type="button"
                      onClick={() => handleCopy(JSON.stringify(detectorResult, null, 2))}
                      className="text-[#499557] font-bold hover:underline"
                    >
                      Copy Full JSON Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 3: GRAMMAR CHECKER                            */}
        {/* ======================================================== */}
        {currentTool === 'grammar-checker' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">Source Text</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInsertSample('grammar-checker')}
                      className="text-xs text-rose-600 font-bold hover:bg-rose-50 px-2 py-1 rounded"
                    >
                      Sample
                    </button>
                    {inputText && (
                      <button type="button" onClick={handleClear} className="text-slate-400 hover:text-slate-600 font-semibold">
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <textarea
                    rows={12}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter or paste text here to detect spelling, grammar, and punctuation mistakes..."
                    className="w-full h-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs text-slate-500">{wordCount} words</span>
                  <button
                    type="button"
                    onClick={handleGrammarCheck}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                    <span>Check Grammar</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-rose-700 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4" />
                    <span>Fixed Result</span>
                  </span>
                  {outputText && (
                    <button
                      type="button"
                      onClick={() => handleCopy(outputText)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 p-4 space-y-3">
                  {outputText ? (
                    <>
                      <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">{outputText}</div>
                      {grammarErrors.length > 0 && (
                        <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5 max-h-44 overflow-y-auto">
                          <span className="text-xs font-extrabold text-rose-800 block">
                            {grammarErrors.length} Issue{grammarErrors.length > 1 ? 's' : ''} Detected & Corrected:
                          </span>
                          {grammarErrors.map((err, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="line-through text-rose-600 font-mono">{err.original}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="text-emerald-700 font-bold font-mono">{err.suggestion}</span>
                              <span className="text-[10px] text-slate-500 font-medium">({err.type})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <CheckCheck className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">No grammar errors checked</p>
                      <p className="text-xs text-slate-400 mt-1">Paste text on the left and click Check Grammar</p>
                    </div>
                  )}
                </div>
                <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  {outputText ? `${grammarErrors.length} corrections applied` : 'Ready'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 4: AI HUMANIZER                                */}
        {/* ======================================================== */}
        {currentTool === 'ai-humanizer' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">AI Text to Humanize</span>
                  <button
                    type="button"
                    onClick={() => handleInsertSample('ai-humanizer')}
                    className="text-xs text-teal-600 font-bold hover:bg-teal-50 px-2 py-1 rounded"
                  >
                    Sample
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <textarea
                    rows={12}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste AI-generated text from ChatGPT, Claude, or Gemini to make it sound authentically human..."
                    className="w-full h-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs text-slate-500">{wordCount} words</span>
                  <button
                    type="button"
                    onClick={handleHumanize}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                    <span>Humanize Text</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-teal-700 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Humanized Version (Bypasses AI Detectors)</span>
                  </span>
                  {outputText && (
                    <button
                      type="button"
                      onClick={() => handleCopy(outputText)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 p-4">
                  {outputText ? (
                    <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">{outputText}</div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <UserCheck className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">Humanized text appears here</p>
                      <p className="text-xs text-slate-400 mt-1">Removes robotic cadence and generic filler clichés</p>
                    </div>
                  )}
                </div>
                <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  {aiScore !== null ? `New AI Score: ${aiScore}% (Human Score: 98%)` : 'Ready'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 5: SUMMARIZER                                  */}
        {/* ======================================================== */}
        {currentTool === 'summarizer' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">Source Document</span>
                  <button
                    type="button"
                    onClick={() => handleInsertSample('summarizer')}
                    className="text-xs text-purple-600 font-bold hover:bg-purple-50 px-2 py-1 rounded"
                  >
                    Sample
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <textarea
                    rows={12}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste research papers, articles, transcripts, or notes to summarize..."
                    className="w-full h-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs text-slate-500">{wordCount} words</span>
                  <button
                    type="button"
                    onClick={handleSummarize}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlignLeft className="w-4 h-4" />}
                    <span>Summarize</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-purple-700 flex items-center gap-1.5">
                    <AlignLeft className="w-4 h-4" />
                    <span>Summary</span>
                  </span>
                  {outputText && (
                    <button
                      type="button"
                      onClick={() => handleCopy(outputText)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 p-4">
                  {outputText ? (
                    <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">{outputText}</div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <AlignLeft className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">Summary appears here</p>
                      <p className="text-xs text-slate-400 mt-1">Select Paragraph or Bullet Points format</p>
                    </div>
                  )}
                </div>
                <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  {summaryStats ? `${summaryStats.sum} words (${summaryStats.red}% reduction)` : 'Ready'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 6: TRANSLATOR                                  */}
        {/* ======================================================== */}
        {currentTool === 'translator' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">Source Text</span>
                  <button
                    type="button"
                    onClick={() => handleInsertSample('translator')}
                    className="text-xs text-slate-700 font-bold hover:bg-slate-100 px-2 py-1 rounded"
                  >
                    Sample
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <textarea
                    rows={12}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to translate into Spanish, French, German, Arabic, Japanese, etc..."
                    className="w-full h-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs text-slate-500">{wordCount} words</span>
                  <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                    <span>Translate</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Languages className="w-4 h-4" />
                    <span>Translated Text</span>
                  </span>
                  {outputText && (
                    <button
                      type="button"
                      onClick={() => handleCopy(outputText)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 p-4">
                  {outputText ? (
                    <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">{outputText}</div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <Languages className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">Translation appears here</p>
                      <p className="text-xs text-slate-400 mt-1">Preserves context and idioms</p>
                    </div>
                  )}
                </div>
                <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  {outputText ? `${outputText.trim().split(/\s+/).filter(Boolean).length} words translated` : 'Ready'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 7: PLAGIARISM CHECKER                          */}
        {/* ======================================================== */}
        {currentTool === 'plagiarism-checker' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">Document to Check</span>
                  <button
                    type="button"
                    onClick={() => handleInsertSample('plagiarism-checker')}
                    className="text-xs text-amber-600 font-bold hover:bg-amber-50 px-2 py-1 rounded"
                  >
                    Sample
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <textarea
                    rows={12}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste an essay or article to scan for unoriginal content across published web sources..."
                    className="w-full h-full bg-transparent border-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs text-slate-500">{wordCount} words</span>
                  <button
                    type="button"
                    onClick={handlePlagiarismCheck}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
                    <span>Scan Plagiarism</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-amber-700 flex items-center gap-1.5">
                    <FileSearch className="w-4 h-4" />
                    <span>Originality Report</span>
                  </span>
                </div>
                <div className="flex-1 p-5 overflow-y-auto max-h-[460px]">
                  {plagReport ? (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-around text-center">
                        <div>
                          <span className="text-3xl font-black text-emerald-600">{plagReport.originality_percent}%</span>
                          <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">Original Text</p>
                        </div>
                        <div className="h-10 w-px bg-slate-300" />
                        <div>
                          <span className="text-3xl font-black text-amber-600">{plagReport.matched_percent}%</span>
                          <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">Matched Content</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {plagReport.summary}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <FileSearch className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">No report generated</p>
                      <p className="text-xs text-slate-400 mt-1">Scan to inspect uniqueness and citation integrity</p>
                    </div>
                  )}
                </div>
                <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                  {plagReport ? `Scanned ${plagReport.scanned_sources || 150} academic and web databases` : 'Ready'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE 8: AI CHAT                                     */}
        {/* ======================================================== */}
        {currentTool === 'ai-chat' && (
          <div className="flex flex-col h-[560px]">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-2xl ${
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                      m.role === 'user' ? 'bg-purple-600' : 'bg-[#499557]'
                    }`}
                  >
                    {m.role === 'user' ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs whitespace-pre-wrap'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#499557]" />
                  <span>QuillBot AI is thinking...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="p-3 sm:p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 focus-within:border-[#499557] focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask QuillBot AI anything, or drop a document above to analyze..."
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !chatInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#499557] hover:bg-[#3d7d49] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
