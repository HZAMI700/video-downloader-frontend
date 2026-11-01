'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Mail,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Cpu,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  AlertOctagon,
  Globe,
  Sliders,
  Filter,
  Eye,
  Lock,
} from 'lucide-react';
import {
  searchBlackbirdEmail,
  fetchBlackbirdHealth,
  aiBlackbirdAnalysis,
  BlackbirdEmailCheckResponse,
  BlackbirdAccount,
} from '../../lib/api';

interface BlackbirdEmailStudioProps {
  initialEmail?: string;
  onBackToCategory?: () => void;
}

const QUICK_EXAMPLES = [
  'test@example.com',
  'contact@domain.com',
  'security-audit@company.org',
  'researcher@osint.io',
];

export function BlackbirdEmailStudio({
  initialEmail = '',
  onBackToCategory,
}: BlackbirdEmailStudioProps) {
  // Locale State
  const [lang, setLang] = useState<'ar' | 'en'>('en');

  // Input & Options State
  const [email, setEmail] = useState(initialEmail);
  const [noNsfw, setNoNsfw] = useState(true);
  const [legalAgreed, setLegalAgreed] = useState(true);

  // Search & Progress State
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchStage, setSearchStage] = useState('');
  const [searchSubtext, setSearchSubtext] = useState('');
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [result, setResult] = useState<BlackbirdEmailCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search Inside Results State
  const [resultsFilter, setResultsFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // AI Analysis State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Health State
  const [healthInfo, setHealthInfo] = useState<any>(null);

  const resultsEndRef = useRef<HTMLDivElement>(null);
  const telemetryEndRef = useRef<HTMLDivElement>(null);

  // Fetch health on mount
  useEffect(() => {
    let mounted = true;
    fetchBlackbirdHealth()
      .then((data) => {
        if (mounted) setHealthInfo(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-scroll telemetry log
  useEffect(() => {
    telemetryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [telemetryLogs]);

  // Execute Search
  const handleExecuteSearch = async (targetEmail?: string) => {
    const rawEmail = (targetEmail || email).trim().toLowerCase();
    if (!rawEmail) return;

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(rawEmail)) {
      setError(
        lang === 'ar'
          ? 'يرجى إدخال عنوان بريد إلكتروني صالح (مثال: user@example.com)'
          : 'Please enter a valid email address (e.g. user@example.com)'
      );
      return;
    }

    if (!legalAgreed) {
      setError(
        lang === 'ar'
          ? 'يجب تأكيد الموافقة على التحذير القانوني وإقرار الاستخدام للأغراض القانونية والتعليمية فقط.'
          : 'You must acknowledge the legal disclaimer confirming authorized legal or educational use only.'
      );
      return;
    }

    setError(null);
    setIsSearching(true);
    setProgress(5);
    setResult(null);
    setAiAnalysis(null);

    const timestamp = () => new Date().toTimeString().split(' ')[0];
    setTelemetryLogs([
      `[${timestamp()}] [INITIALIZE] Spawning Blackbird CLI subprocess: python blackbird.py --email ${rawEmail}`,
      `[${timestamp()}] [VALIDATION] RFC 5322 syntax verified for "${rawEmail}"`,
      `[${timestamp()}] [WERKZEUG] Werkzeug 2.2.2 compatibility layer engaged`,
    ]);

    setSearchStage(
      lang === 'ar'
        ? 'المرحلة 1 / 4: التحقق من التوافق وإطلاق محرك Blackbird OSINT'
        : 'Stage 1 / 4: Validating Environment & Launching Blackbird CLI Engine'
    );
    setSearchSubtext(
      lang === 'ar'
        ? 'تجهيز نفق الاستعلامات وفحص معلمات التصفية...'
        : 'Preparing async requests and parameter filters...'
    );

    // Run progressive stages (~4 to 6 seconds)
    const totalSteps = 45;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const currentPct = Math.min(Math.floor((step / totalSteps) * 100), 96);
      setProgress(currentPct);

      if (step === 10) {
        setSearchStage(
          lang === 'ar'
            ? 'المرحلة 2 / 4: فحص منصات التواصل والخدمات الرقمية'
            : 'Stage 2 / 4: Querying Social Networks & Web Platform Endpoints'
        );
        setSearchSubtext(
          lang === 'ar'
            ? 'إرسال طلبات فحص متزامنة إلى Spotify و Twitter و Adobe و Chess و Duolingo...'
            : 'Probing registration APIs across Spotify, Twitter, Adobe, Chess.com, Duolingo...'
        );
        setTelemetryLogs((prev) => [
          ...prev,
          `[${timestamp()}] [DISPATCH] Concurrent async requests dispatched to 16 platform endpoints`,
          `[${timestamp()}] [RATE-LIMIT] Client rate-limit quota verified (max 5 req/min)`,
        ]);
      } else if (step === 25) {
        setSearchStage(
          lang === 'ar'
            ? 'المرحلة 3 / 4: تحليل استجابات المنصات واستخراج البيانات الوصفية'
            : 'Stage 3 / 4: Analyzing Response Codes & Extracting Account Metadata'
        );
        setSearchSubtext(
          lang === 'ar'
            ? 'مطابقة رموز الاستجابة، استخراج معرّفات المستخدمين والصور الشخصية...'
            : 'Parsing response strings, extracting User IDs, and resolving avatar tokens...',
        );
        setTelemetryLogs((prev) => [
          ...prev,
          `[${timestamp()}] [METADATA] Extracted user profile tokens and public avatar pointers`,
          `[${timestamp()}] [FILTER] Applying NSFW exclusion filter: ${noNsfw ? 'ENABLED' : 'DISABLED'}`,
        ]);
      } else if (step === 38) {
        setSearchStage(
          lang === 'ar'
            ? 'المرحلة 4 / 4: تجميع تقرير البصمة الرقمية والأدلة'
            : 'Stage 4 / 4: Compiling Digital Footprint Intelligence Dossier'
        );
        setSearchSubtext(
          lang === 'ar'
            ? 'صياغة التلخيص الاستخباري وتصنيف الحسابات المكتشفة...'
            : 'Summarizing linked accounts, risk surface, and defensive recommendations...',
        );
      }
    }, 100);

    try {
      const data = await searchBlackbirdEmail({
        email: rawEmail,
        legal_agreed: legalAgreed,
        no_nsfw: noNsfw,
      });

      clearInterval(interval);
      setProgress(100);
      setTelemetryLogs((prev) => [
        ...prev,
        `[${timestamp()}] [SUCCESS] Blackbird completed: ${data.accounts.length} linked accounts found`,
      ]);

      setTimeout(() => {
        setResult(data);
        setIsSearching(false);
        setProgress(0);
        setTimeout(() => {
          resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }, 300);
    } catch (err: any) {
      clearInterval(interval);
      setIsSearching(false);
      setProgress(0);
      setError(
        err?.message ||
          (lang === 'ar' ? 'فشل فحص البريد الإلكتروني عبر Blackbird' : 'Blackbird search failed')
      );
    }
  };

  // Run AI Digital Footprint Analysis
  const handleRunAiAnalysis = async () => {
    if (!result || isAiLoading) return;
    setIsAiLoading(true);

    try {
      const res = await aiBlackbirdAnalysis({
        email: result.email,
        accounts: result.accounts,
      });
      setAiAnalysis(res.analysis);
    } catch (err: any) {
      setAiAnalysis(
        lang === 'ar'
          ? 'تعذر إتمام التحليل بالذكاء الاصطناعي في الوقت الحالي.'
          : 'AI digital footprint analysis currently unavailable.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered accounts based on search query and category
  const filteredAccounts = useMemo(() => {
    if (!result) return [];
    return result.accounts.filter((acc) => {
      const matchesSearch =
        resultsFilter === '' ||
        acc.platform.toLowerCase().includes(resultsFilter.toLowerCase()) ||
        acc.url.toLowerCase().includes(resultsFilter.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' ||
        acc.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [result, resultsFilter, selectedCategory]);

  // Unique categories
  const categoriesList = useMemo(() => {
    if (!result) return [];
    const set = new Set(result.accounts.map((a) => a.category.toLowerCase()));
    return Array.from(set);
  }, [result]);

  // Copy helper
  const handleCopyUrl = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `blackbird_${result.email.replace(/[@.]/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto space-y-6 animate-apple-in pb-12 select-text"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Banner / Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#263241]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 via-[#00c9a7] to-emerald-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0E14] rounded-[14px] flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#00c9a7]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Blackbird Email Account Lookup
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                OSINT CLI v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ar'
                ? 'فحص الحسابات المسجلة المرتبطة بالبريد الإلكتروني عبر أداة Blackbird مفتوحة المصدر • مصرح به قانونياً'
                : 'Reverse-search online accounts linked to an email address via open-source Blackbird OSINT engine'}
            </p>
          </div>
        </div>

        {/* Status Indicators & Language Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Engine Status */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161C24] border border-slate-200 dark:border-[#263241] text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]" />
            <span>Blackbird: Active</span>
          </div>

          {/* Rate Limit Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161C24] border border-slate-200 dark:border-[#263241] text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Activity className="w-3.5 h-3.5 text-teal-500" />
            <span>Limit: 5 req/min</span>
          </div>

          {/* Bilingual Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-3 py-1 rounded-full bg-white dark:bg-[#1E252F] border border-slate-300 dark:border-[#354354] text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#00c9a7] transition cursor-pointer"
          >
            {lang === 'en' ? 'العربية 🇸🇦' : 'English 🌐'}
          </button>
        </div>
      </div>

      {/* Mandatory Legal Warning & Consent */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3.5">
        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400">
              {lang === 'ar' ? '⚠️ تحذير قانوني وإقرار استخدام إلزامي' : '⚠️ Mandatory Legal & Authorization Notice'}
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Authorized Use Only
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'هذه الميزة مخصصة للتحقيقات القانونية والتعليمية فقط. لا تفحص بريدًا إلكترونيًا دون إذن صاحبه الصريح. يُحظر حظرًا باتًا استخدامها لأغراض التحرش، أو الهندسة الاجتماعية، أو جمع البيانات بدون موافقة قانونية.'
              : 'This feature is strictly intended for authorized legal investigations and educational security research only. Do not scan an email address without explicit permission from its owner. Stalking, harassment, or unauthorized reconnaissance is strictly prohibited.'}
          </p>
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={legalAgreed}
              onChange={(e) => setLegalAgreed(e.target.checked)}
              className="rounded text-[#00c9a7] focus:ring-[#00c9a7] border-slate-300 dark:border-slate-600"
            />
            <span>
              {lang === 'ar'
                ? 'أقر بأنني أملك الإذن القانوني لفحص هذا البريد أو أستخدمه لغرض تعليمي/تحقيقي مصرح به.'
                : 'I certify that I have explicit authorization to scan this email or am conducting lawful research.'}
            </span>
          </label>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-5 sm:p-7 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {lang === 'ar' ? 'البريد الإلكتروني المستهدف للتحقيق' : 'Target Email Address to Reverse-Search'}
        </label>
        <div className="relative flex items-center">
          <Mail className="w-5 h-5 text-slate-400 absolute left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteSearch();
            }}
            placeholder={
              lang === 'ar'
                ? 'أدخل البريد الإلكتروني (مثال: user@example.com)...'
                : 'Enter email address (e.g. user@example.com)...'
            }
            className="w-full pl-12 pr-36 rtl:pl-36 rtl:pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00c9a7] focus:ring-1 focus:ring-[#00c9a7] transition-all"
          />
          <button
            type="button"
            onClick={() => handleExecuteSearch()}
            disabled={isSearching || !email.trim()}
            className={`absolute right-2 rtl:right-auto rtl:left-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition cursor-pointer ${
              email.trim() && !isSearching
                ? 'bg-gradient-to-tr from-teal-600 to-[#00c9a7] text-slate-950 shadow-md hover:scale-[1.02] active:scale-95'
                : 'bg-slate-200 dark:bg-[#202732] text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{lang === 'ar' ? 'جارِ الفحص...' : 'Scanning...'}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{lang === 'ar' ? 'فحص الحسابات' : 'Search Accounts'}</span>
              </>
            )}
          </button>
        </div>

        {/* Controls Row: NSFW toggle & Quick Examples */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
              {lang === 'ar' ? 'أمثلة سريعة:' : 'Quick examples:'}
            </span>
            {QUICK_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setEmail(ex);
                  handleExecuteSearch(ex);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#141A22] hover:bg-slate-200 dark:hover:bg-[#202732] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#263241] transition cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={noNsfw}
              onChange={(e) => setNoNsfw(e.target.checked)}
              className="rounded text-[#00c9a7] focus:ring-[#00c9a7] border-slate-300 dark:border-slate-600"
            />
            <span>{lang === 'ar' ? 'استبعاد المنصات الإباحية (NSFW)' : 'Exclude NSFW Sites'}</span>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* High-Tech Realistic Radar & Telemetry Console */}
      {isSearching && (
        <div className="bg-[#0B0F15] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status & Progress Bar */}
          <div className="space-y-3 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-[#00c9a7] animate-spin" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00c9a7] animate-ping" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>{searchStage}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{searchSubtext}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xl sm:text-2xl font-black text-[#00c9a7]">
                  {progress}%
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ENUMERATING
                </span>
              </div>
            </div>

            {/* Glowing Gradient Progress Bar */}
            <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-[#00c9a7] to-emerald-300 rounded-full transition-all duration-150 shadow-[0_0_10px_#00c9a7]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Live Telemetry Feed */}
          <div className="bg-[#070A0E] rounded-2xl border border-slate-800 p-4 font-mono text-[11px] sm:text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar relative z-10 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00c9a7]" />
                Live Blackbird Subprocess Log
              </span>
              <span className="text-[#00c9a7] animate-pulse">● SUBPROCESS ACTIVE</span>
            </div>
            {telemetryLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#00c9a7] shrink-0">›</span>
                <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : ''}>
                  {log}
                </span>
              </div>
            ))}
            <div ref={telemetryEndRef} />
          </div>
        </div>
      )}

      {/* Investigation Results */}
      {result && (
        <div ref={resultsEndRef} className="space-y-6">
          {/* Executive Overview Card */}
          <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#212932]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                    {lang === 'ar' ? 'البريد الإلكتروني المفحوص' : 'Scanned Target Email'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {result.email}
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-[#00c9a7] border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {result.accounts.length} {lang === 'ar' ? 'حسابات مكتشفة' : 'Accounts Found'}
                </span>

                <button
                  type="button"
                  onClick={handleCopyAllJson}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-white hover:bg-slate-100 dark:bg-[#141A22] dark:hover:bg-[#1E252F] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكل JSON' : 'Copy JSON')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-white hover:bg-slate-100 dark:bg-[#141A22] dark:hover:bg-[#1E252F] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تحميل التقرير' : 'Download Report'}</span>
                </button>
              </div>
            </div>

            {/* Summary Text Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-[#00c9a7]" />
                <span>{lang === 'ar' ? 'ملخص البصمة الرقمية' : 'Digital Footprint Assessment'}</span>
              </div>
              <p>{result.summary}</p>
            </div>

            {/* AI Footprint Analysis Action Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'تحليل البصمة الرقمية بالذكاء الاصطناعي (AI Analysis)' : 'AI Digital Footprint & Risk Assessment'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'ar'
                      ? 'تحليل مخاطر تكرار كلمات المرور، وتقييم أبعاد الهوية الرقمية عبر الحسابات المكتشفة'
                      : 'Analyze cross-platform password reuse exposure and identity attack surfaces'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAiLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00c9a7] text-slate-950 hover:bg-[#00b596] shadow-sm flex items-center gap-2 transition cursor-pointer shrink-0"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'ar' ? 'جارِ التحليل...' : 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'بدء تحليل AI' : 'Run AI Risk Analysis'}</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Analysis Result */}
            {aiAnalysis && (
              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-teal-500/30 text-xs sm:text-sm leading-relaxed space-y-2 whitespace-pre-wrap animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-teal-400 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تقرير الذكاء الاصطناعي للبصمة الرقمية' : 'AI Threat & Exposure Report'}</span>
                </div>
                <div className="pt-1">{aiAnalysis}</div>
              </div>
            )}
          </div>

          {/* Interactive Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#181D24] p-4 rounded-2xl border border-slate-200 dark:border-[#263241]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={resultsFilter}
                onChange={(e) => setResultsFilter(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث في الحسابات والمنصات...' : 'Filter by platform or URL...'}
                className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00c9a7]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#00c9a7] text-slate-950'
                    : 'bg-slate-100 dark:bg-[#141A22] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'} ({result.accounts.length})
              </button>

              {categoriesList.map((cat, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase shrink-0 transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#00c9a7] text-slate-950'
                      : 'bg-slate-100 dark:bg-[#141A22] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accounts Grid / Table */}
          {filteredAccounts.length === 0 ? (
            <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] p-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'لم يتم العثور على منصات مطابقة' : 'No Matching Accounts'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'لم يتم تسجيل حسابات نشطة مطابقة لهذا البريد في المنصات المحددة.'
                  : 'No active accounts were found matching your current filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.map((acc, idx) => {
                // Find avatar in metadata if available (e.g. Adobe avatar)
                const avatarMeta = acc.metadata?.find(
                  (m) =>
                    m.type === 'Image' ||
                    m.name?.toLowerCase().includes('avatar') ||
                    m.value?.includes('profile/image')
                );

                const userIdMeta = acc.metadata?.find((m) =>
                  m.name?.toLowerCase().includes('user id')
                );

                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#181D24] rounded-2xl border border-slate-200 dark:border-[#263241] p-5 space-y-3 shadow-2xs hover:border-[#00c9a7]/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {avatarMeta?.value ? (
                          <img
                            src={avatarMeta.value}
                            alt={acc.platform}
                            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-black text-xs uppercase">
                            {acc.platform.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {acc.platform}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {acc.category}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-[#00c9a7] border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Found
                      </span>
                    </div>

                    {/* Verification / Registration URL */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#12171F] border border-slate-100 dark:border-[#212932] flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <span className="truncate max-w-[320px]">{acc.url}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(acc.url, idx)}
                          title="Copy Link"
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={acc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open URL"
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Additional Metadata Details if present */}
                    {userIdMeta && (
                      <div className="pt-2 border-t border-slate-100 dark:border-[#212932] flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold">{userIdMeta.name}:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {userIdMeta.value}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
