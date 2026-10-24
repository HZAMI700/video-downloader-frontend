'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  RefreshCw,
  CheckCheck,
  Image as ImageIcon,
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
  ChevronRight,
  ChevronLeft,
  Zap,
  Volume2,
  Sliders,
  Send,
  X,
  Bot,
  Wand2,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import {
  runParaphrase,
  runGrammarCheck,
  runSummarize,
  runHumanize,
  runAiChat,
  runPlagiarismCheck,
  translateTranscriptText,
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
    id: 'ai-chat',
    title: 'AI Chat',
    description: "Unlock your potential with QuillBot's free AI chat!...",
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
    iconBg: 'bg-blue-50 border-blue-200/80',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 'paraphrasing-tool',
    title: 'Paraphrasing tool',
    description: 'Rewrite and refine text',
    icon: <RefreshCw className="w-5 h-5 text-emerald-600" />,
    iconBg: 'bg-emerald-50 border-emerald-200/80',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'grammar-checker',
    title: 'Grammar Checker',
    description: 'Fix spelling, grammar, punctuation',
    icon: <CheckCheck className="w-5 h-5 text-rose-500" />,
    iconBg: 'bg-rose-50 border-rose-200/80',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  {
    id: 'ai-image-generator',
    title: 'AI Image Generator',
    description: "Create AI images, photos, and graphics online with QuillBot's...",
    icon: <ImageIcon className="w-5 h-5 text-amber-500" />,
    iconBg: 'bg-amber-50 border-amber-200/80',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: 'summarizer',
    title: 'Summarizer',
    description: 'Condense long text',
    icon: <AlignLeft className="w-5 h-5 text-purple-600" />,
    iconBg: 'bg-purple-50 border-purple-200/80',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    id: 'ai-humanizer',
    title: 'AI Humanizer',
    description: 'Make writing sound natural',
    icon: <UserCheck className="w-5 h-5 text-teal-600" />,
    iconBg: 'bg-teal-50 border-teal-200/80',
    badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
  },
  {
    id: 'translator',
    title: 'Translator',
    description: 'Translate quickly and accurately',
    icon: <Languages className="w-5 h-5 text-slate-700" />,
    iconBg: 'bg-slate-100 border-slate-300/80',
    badgeColor: 'text-slate-700 bg-slate-100 border-slate-300',
  },
  {
    id: 'plagiarism-checker',
    title: 'Plagiarism Checker',
    description: 'Detect unoriginal content',
    icon: <FileSearch className="w-5 h-5 text-orange-500" />,
    iconBg: 'bg-orange-50 border-orange-200/80',
    badgeColor: 'text-orange-700 bg-orange-50 border-orange-200',
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

  // Shared Drag & Drop File State for all tools
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

  // Summarizer state
  const [summaryFormat, setSummaryFormat] = useState('paragraph');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryStats, setSummaryStats] = useState<{ orig: number; sum: number; red: number } | null>(null);

  // AI Humanizer state
  const [humanizeTone, setHumanizeTone] = useState('balanced');
  const [aiScore, setAiScore] = useState<number | null>(null);

  // AI Image Generator state
  const [imagePrompt, setImagePrompt] = useState('A futuristic glowing crystal city at sunset, 8k cinematic hyperrealistic');
  const [imageStyle, setImageStyle] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

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

    // If it's an image and user is in image generator
    if (file.type.startsWith('image/')) {
      const promptFromImg = `Variation inspired by image ${file.name.replace(/\.[^/.]+$/, '')}, high resolution studio detail`;
      setImagePrompt(promptFromImg);
      return;
    }

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

  // 3. Run Summarizer
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

  // 4. Run AI Humanizer
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

  // 5. Run AI Image Generator
  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    const encodedPrompt = encodeURIComponent(`${imagePrompt}, ${imageStyle} style, 8k wallpaper`);
    let dims = 'width=1024&height=1024';
    if (aspectRatio === '16:9') dims = 'width=1280&height=720';
    if (aspectRatio === '9:16') dims = 'width=720&height=1280';

    const seed = Math.floor(Math.random() * 100000);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${dims}&seed=${seed}&nologo=true`;

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setGeneratedImageUrl(url);
      setIsLoading(false);
    };
    img.onerror = () => {
      // Fallback
      setGeneratedImageUrl(url);
      setIsLoading(false);
    };
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

  // Reset helper
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setLoadedFileName(null);
    setErrorMessage(null);
    setGrammarErrors([]);
    setSummaryStats(null);
    setAiScore(null);
    setPlagReport(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Hidden Universal File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.doc,.docx,.pdf,.md,.srt,.vtt,.csv,image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Top Apple Navigation Bar for Dedicated Tool */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 pt-1 border-b border-zinc-200/70">
        <div className="flex items-center gap-2">
          {onBackToCategory && (
            <button
              type="button"
              onClick={onBackToCategory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 transition active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to AI Section</span>
            </button>
          )}
          <span className="text-zinc-300">/</span>
          <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            QuillBot {QUILLBOT_TOOLS.find((t) => t.id === currentTool)?.title}
          </span>
        </div>

        {/* Quick Sibling Tool Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 custom-scrollbar">
          {QUILLBOT_TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleToolChange(t.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                currentTool === t.id
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Universal Drop Indicator Pill */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex items-center justify-between p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50 scale-[1.01] shadow-lg shadow-emerald-500/10'
            : loadedFileName
            ? 'border-emerald-300 bg-emerald-50/40'
            : 'border-slate-200 hover:border-emerald-300 bg-white shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {isDragOver
                ? 'Release to drop file into workspace!'
                : loadedFileName
                ? `Active file: ${loadedFileName}`
                : 'Drag & drop your document (.txt, .docx, .pdf, .md) here'}
            </p>
            <p className="text-[11px] text-slate-400">
              {loadedFileName
                ? 'Click or drop another file to replace text'
                : 'Works automatically with Paraphraser, Grammar, Summarizer, Humanizer, and Translator'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-xs font-bold px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          Browse Local File
        </button>
      </div>

      {/* ACTIVE TOOL WORKSPACE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 overflow-hidden">
        {/* Workspace Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
              {QUILLBOT_TOOLS.find((t) => t.id === currentTool)?.icon}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {QUILLBOT_TOOLS.find((t) => t.id === currentTool)?.title}
              </h2>
              <span className="text-[11px] text-emerald-700 font-bold">QuillBot AI Powered • Free & Unlimited</span>
            </div>
          </div>

          {/* Tool-specific Mode Switchers in Top Toolbar */}
          {currentTool === 'paraphrasing-tool' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Modes:</span>
              {['standard', 'fluency', 'formal', 'creative', 'shorten', 'expand'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setParaphraseMode(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    paraphraseMode === m
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {currentTool === 'summarizer' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Format:</span>
              <button
                type="button"
                onClick={() => setSummaryFormat('paragraph')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  summaryFormat === 'paragraph'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                Paragraph
              </button>
              <button
                type="button"
                onClick={() => setSummaryFormat('bullets')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  summaryFormat === 'bullets'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                Key Bullets
              </button>
            </div>
          )}

          {currentTool === 'ai-humanizer' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Tone:</span>
              {['balanced', 'academic', 'casual'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setHumanizeTone(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    humanizeTone === t
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {currentTool === 'translator' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">To:</span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="m-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* 1. PARAPHRASING TOOL WORKSPACE */}
        {currentTool === 'paraphrasing-tool' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Input Pane */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Input Text</span>
                  <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or drop text here to paraphrase (e.g. essay, email, article)..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleParaphrase}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>Paraphrase Text</span>
                  </button>
                </div>
              </div>

              {/* Right: Output Pane */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="text-emerald-700">Paraphrased Output</span>
                  <span>{outputText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={10}
                  readOnly
                  value={outputText}
                  placeholder="Paraphrased text will appear here with enhanced phrasing..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(outputText)}
                    disabled={!outputText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(outputText, `paraphrased_${Date.now()}.txt`)}
                    disabled={!outputText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. GRAMMAR CHECKER WORKSPACE */}
        {currentTool === 'grammar-checker' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Original Text</span>
                  <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or drop text here to check spelling, grammar, and punctuation..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleGrammarCheck}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                    <span>Check Grammar</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-700">Corrected Result & Issues</span>
                  {grammarErrors.length > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px]">
                      {grammarErrors.length} Issue{grammarErrors.length > 1 ? 's' : ''} Fixed
                    </span>
                  )}
                </div>
                <textarea
                  rows={7}
                  readOnly
                  value={outputText}
                  placeholder="Corrected text will appear here..."
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none resize-none leading-relaxed"
                />

                {grammarErrors.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-1.5 max-h-36 overflow-y-auto">
                    <span className="text-[11px] font-extrabold text-rose-800 block">Corrections Applied:</span>
                    {grammarErrors.map((err, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="line-through text-rose-500 font-mono">{err.original}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-emerald-700 font-bold font-mono">{err.suggestion}</span>
                        <span className="text-[10px] text-slate-500">({err.type})</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(outputText)}
                    disabled={!outputText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Clean Text</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. SUMMARIZER WORKSPACE */}
        {currentTool === 'summarizer' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Document / Article</span>
                  <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or drop long text, report, or notes here to condense..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleSummarize}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlignLeft className="w-4 h-4" />}
                    <span>Summarize Now</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-purple-700">Summary</span>
                  {summaryStats && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px]">
                      -{summaryStats.red}% Condensed ({summaryStats.sum} words)
                    </span>
                  )}
                </div>
                <textarea
                  rows={10}
                  readOnly
                  value={outputText}
                  placeholder="Summary will appear here..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none resize-none leading-relaxed whitespace-pre-wrap"
                />
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(outputText)}
                    disabled={!outputText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. AI HUMANIZER WORKSPACE */}
        {currentTool === 'ai-humanizer' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>AI Generated Draft</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px]">
                    Typical AI Pattern
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or drop text generated by ChatGPT / Claude to humanize..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleHumanize}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                    <span>Humanize Text</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-teal-700">100% Humanized Version</span>
                  {aiScore !== null && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                      AI Score: {aiScore}% (Bypasses AI Detectors)
                    </span>
                  )}
                </div>
                <textarea
                  rows={10}
                  readOnly
                  value={outputText}
                  placeholder="Humanized text with natural cadence will appear here..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(outputText)}
                    disabled={!outputText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Humanized Text</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. AI IMAGE GENERATOR WORKSPACE */}
        {currentTool === 'ai-image-generator' && (
          <div className="p-4 sm:p-8 space-y-6">
            <div className="space-y-4 max-w-3xl mx-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Image Prompt Description
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate (or drop prompt file)..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isLoading || !imagePrompt.trim()}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              {/* Style presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Style:</span>
                {['cinematic', 'photorealistic', 'anime', 'digital-art', '3d-render', 'fantasy'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setImageStyle(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      imageStyle === s
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Generated Image Showcase */}
              {generatedImageUrl && (
                <div className="pt-4 flex flex-col items-center space-y-4 animate-fadeIn">
                  <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl max-h-[500px] w-full max-w-lg bg-slate-950 flex items-center justify-center">
                    <img
                      src={generatedImageUrl}
                      alt={imagePrompt}
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={generatedImageUrl}
                      download={`quillbot_ai_${Date.now()}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download High-Res Image</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. AI CHAT WORKSPACE */}
        {currentTool === 'ai-chat' && (
          <div className="flex flex-col h-[520px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-2xl ${
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                      m.role === 'user' ? 'bg-purple-600' : 'bg-blue-600'
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
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>QuillBot AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-3 sm:p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 7. TRANSLATOR WORKSPACE */}
        {currentTool === 'translator' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Source Text</span>
                  <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or drop text to translate into 150+ languages..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                    <span>Translate</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="text-slate-800">Translated Result</span>
                  <span>{outputText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={10}
                  readOnly
                  value={outputText}
                  placeholder="Translation will appear here instantly..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(outputText)}
                    disabled={!outputText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. PLAGIARISM CHECKER WORKSPACE */}
        {currentTool === 'plagiarism-checker' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Document to Scan</span>
                  <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or drop your essay, thesis, or article to scan for plagiarism..."
                  className="w-full flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handlePlagiarismCheck}
                    disabled={isLoading || !inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
                    <span>Scan for Plagiarism</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
                <span className="text-xs font-bold text-orange-700">Scan Report & Originality Score</span>

                {plagReport ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-around p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 text-center">
                      <div>
                        <span className="text-3xl font-black text-emerald-600">{plagReport.originality_percent}%</span>
                        <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">Original Text</p>
                      </div>
                      <div className="h-10 w-px bg-slate-200" />
                      <div>
                        <span className="text-3xl font-black text-orange-600">{plagReport.matched_percent}%</span>
                        <p className="text-[11px] font-bold text-slate-600 uppercase mt-1">Matched Content</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      ✓ {plagReport.summary}
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p>• Scanned over {plagReport.scanned_sources} web & academic databases</p>
                      <p>• Analyzed {plagReport.total_words} words across {plagReport.total_sentences} sentences</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                    <FileSearch className="w-10 h-10 text-slate-300" />
                    <p className="text-xs">Originality percentage and scanned report will display here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
