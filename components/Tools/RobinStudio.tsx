'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Lock,
  Globe,
  Radio,
  ExternalLink,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Sparkles,
  Cpu,
  RefreshCw,
  Terminal,
  ChevronRight,
  Send,
  MessageSquare,
  FileText,
  CornerDownRight,
  Database,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  searchRobin,
  followupRobin,
  fetchRobinHealth,
  RobinSearchResponse,
  RobinSource,
} from '../../lib/api';

interface RobinStudioProps {
  initialQuery?: string;
  onBackToCategory?: () => void;
}

const PRESETS = [
  { id: 'threat_intel', labelEn: 'Threat Intelligence', labelAr: 'استخبارات التهديدات', icon: '🛡️' },
  { id: 'ransomware', labelEn: 'Ransomware Tracking', labelAr: 'تتبع برمجيات الفدية', icon: '🔒' },
  { id: 'credentials', labelEn: 'Leaked Credentials', labelAr: 'تسريبات الحسابات والبيانات', icon: '🔑' },
  { id: 'cve', labelEn: 'CVE & Vulnerabilities', labelAr: 'الثغرات الأمنية والـ CVE', icon: '⚡' },
  { id: 'marketplace', labelEn: 'Darknet Marketplaces', labelAr: 'الأسواق السرية', icon: '🛒' },
];

const EXAMPLE_QUERIES = [
  'LockBit ransomware victims',
  'CVE-2024-3094 xz backdoor',
  'Healthcare patient breach leak',
  'Telegram initial access broker',
];

export function RobinStudio({ initialQuery = '', onBackToCategory }: RobinStudioProps) {
  // Locale State
  const [lang, setLang] = useState<'ar' | 'en'>('en');

  // Search State
  const [query, setQuery] = useState(initialQuery);
  const [preset, setPreset] = useState('threat_intel');
  const [maxResults, setMaxResults] = useState(15);
  const [maxScrape, setMaxScrape] = useState(5);
  const [customInstructions, setCustomInstructions] = useState('');
  const [legalAgreed, setLegalAgreed] = useState(true);

  // Execution State
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<string>('');
  const [result, setResult] = useState<RobinSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'report' | 'sources' | 'pivots'>('report');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Health State
  const [healthInfo, setHealthInfo] = useState<any>(null);

  // Follow-up State
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [isFollowupLoading, setIsFollowupLoading] = useState(false);
  const [followupHistory, setFollowupHistory] = useState<Array<{ q: string; a: string }>>([]);

  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Fetch Robin backend health on mount
  useEffect(() => {
    let mounted = true;
    fetchRobinHealth()
      .then((data) => {
        if (mounted) setHealthInfo(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Execute Search
  const handleExecuteSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;

    if (!legalAgreed) {
      setError(
        lang === 'ar'
          ? 'يجب تأكيد الموافقة على التحذير القانوني وإقرار الاستخدام للأغراض القانونية/التعليمية.'
          : 'You must acknowledge the legal disclaimer confirming educational/authorized legal use.'
      );
      return;
    }

    setError(null);
    setIsSearching(true);
    setSearchStage(lang === 'ar' ? 'تحسين الاستعلام عبر OpenCode AI...' : 'Refining query via OpenCode AI...');

    const stageTimer1 = setTimeout(() => {
      setSearchStage(lang === 'ar' ? 'استعلام محركات بحث الدارك ويب عبر Tor SOCKS5...' : 'Querying darknet search engines via Tor SOCKS5...');
    }, 1500);

    const stageTimer2 = setTimeout(() => {
      setSearchStage(lang === 'ar' ? 'استخراج وتحليل صفحات الدارك ويب (.onion)...' : 'Scraping and analyzing live onion pages (.onion)...');
    }, 3500);

    const stageTimer3 = setTimeout(() => {
      setSearchStage(lang === 'ar' ? 'توليد التقرير الاستخباراتي عبر OpenCode Inference API...' : 'Synthesizing threat intelligence report via OpenCode API...');
    }, 5500);

    try {
      const data = await searchRobin({
        query: q,
        preset,
        max_results: maxResults,
        max_scrape: maxScrape,
        custom_instructions: customInstructions,
        legal_agreed: legalAgreed,
      });

      setResult(data);
      setFollowupHistory([]);
      setTimeout(() => {
        resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err?.message || (lang === 'ar' ? 'حدث خطأ أثناء تنفيذ التحقيق' : 'Investigation failed'));
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsSearching(false);
      setSearchStage('');
    }
  };

  // Follow-up Question
  const handleSendFollowup = async () => {
    if (!followupQuestion.trim() || !result || isFollowupLoading) return;

    const q = followupQuestion.trim();
    setFollowupQuestion('');
    setIsFollowupLoading(true);

    try {
      const res = await followupRobin({
        question: q,
        investigation_id: result.investigation_id,
        context: result.summary,
      });

      setFollowupHistory((prev) => [...prev, { q, a: res.answer }]);
    } catch (err: any) {
      setFollowupHistory((prev) => [
        ...prev,
        { q, a: `Error: ${err?.message || 'Failed to answer follow-up question.'}` },
      ]);
    } finally {
      setIsFollowupLoading(false);
    }
  };

  // Copy helpers
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCopyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const blob = new Blob([result.summary], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `robin_threat_report_${result.query.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-apple-in pb-12 select-text" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner / Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#263241]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-[#00c9a7] to-teal-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0E14] rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-[#00c9a7]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Robin Threat Intelligence Studio
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-[#00c9a7] border border-emerald-500/30">
                Tor + OpenCode
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ar'
                ? 'لوحة استخبارات التهديدات والتحقيقات الجنائية للدارك ويب • مدعومة بـ OpenCode Zen و شبكة Tor'
                : 'Legal Dark Web OSINT & Cyber Threat Intelligence Suite • Powered by OpenCode Zen API & Tor SOCKS5'}
            </p>
          </div>
        </div>

        {/* Status Indicators & Language Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tor Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161C24] border border-slate-200 dark:border-[#263241] text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                healthInfo?.tor?.status === 'connected' ? 'bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]' : 'bg-amber-400'
              }`}
            />
            <span>Tor Proxy: {healthInfo?.tor?.status === 'connected' ? 'SOCKS5 Active' : 'Direct OSINT'}</span>
          </div>

          {/* OpenCode Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161C24] border border-slate-200 dark:border-[#263241] text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-[#00c9a7]" />
            <span>OpenCode: {healthInfo?.opencode?.model || 'kimi-k3'}</span>
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
              {lang === 'ar' ? '⚠️ تحذير قانوني وإقرار استخدام إلزامي' : '⚠️ Mandatory Legal & Educational Compliance Notice'}
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Legal OSINT Only
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'هذه الأداة مخصصة حصراً للأغراض التعليمية، والأبحاث الأكاديمية، والتحقيقات الجنائية/الأمنية المصرح بها رسمياً (DFIR / CTI). يُحظر حظراً باتاً استخدامها في أي نشاط تخريبي أو خرق لخصوصية الأفراد والشركات. يتم تسجيل الاستعلامات لأغراض التدقيق الأمني.'
              : 'This module is strictly intended for educational research, compliance auditing, cyber threat intelligence (CTI), and officially authorized legal investigations. Unlawful exploitation is strictly prohibited. Operational telemetry is audited for compliance.'}
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
                ? 'أقر بأنني أستخدم هذه الأداة لأغراض أمنية/قانونية أو تعليمية مصرح بها فقط.'
                : 'I hereby certify that my investigation query is for authorized defensive, legal, or educational research purposes only.'}
            </span>
          </label>
        </div>
      </div>

      {/* Investigation Command Center */}
      <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-5 sm:p-7 space-y-5">
        {/* Presets Row */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {lang === 'ar' ? 'تصنيف التحقيق / الاستخبارات' : 'Investigation Threat Category'}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
                  preset === p.id
                    ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-[#00c9a7]/50 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252F] border border-transparent'
                }`}
              >
                <span>{p.icon}</span>
                <span>{lang === 'ar' ? p.labelAr : p.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Box */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {lang === 'ar' ? 'هدف البحث أو الكلمات المفتاحية' : 'Investigation Target (Domain, CVE, Breach Entity, Handle, Hash)'}
          </label>
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteSearch();
              }}
              placeholder={
                lang === 'ar'
                  ? 'أدخل اسم الهدف، أو رقم CVE، أو عنوان الدومين، أو اسم مجموعة الفدية (مثل: LockBit, CVE-2024-3094)...'
                  : 'Enter investigation query (e.g. LockBit victim, CVE-2024-3094, database dump, corporate domain)...'
              }
              className="w-full pl-12 pr-32 rtl:pl-32 rtl:pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00c9a7] focus:ring-1 focus:ring-[#00c9a7] transition-all"
            />
            <button
              type="button"
              onClick={() => handleExecuteSearch()}
              disabled={isSearching || !query.trim()}
              className={`absolute right-2 rtl:right-auto rtl:left-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition cursor-pointer ${
                query.trim() && !isSearching
                  ? 'bg-gradient-to-tr from-emerald-600 to-[#00c9a7] text-slate-950 shadow-md hover:scale-[1.02] active:scale-95'
                  : 'bg-slate-200 dark:bg-[#202732] text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ar' ? 'جارِ التحقيق...' : 'Investigating...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'بدء التحقيق' : 'Investigate'}</span>
                </>
              )}
            </button>
          </div>

          {/* Example Quick Prompts */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
              {lang === 'ar' ? 'أمثلة سريعة:' : 'Quick examples:'}
            </span>
            {EXAMPLE_QUERIES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(ex);
                  handleExecuteSearch(ex);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#141A22] hover:bg-slate-200 dark:hover:bg-[#202732] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#263241] transition cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Advanced Controls */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#212932] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{lang === 'ar' ? 'أقصى نتائج:' : 'Max Results:'}</span>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="bg-slate-100 dark:bg-[#141A22] border border-slate-200 dark:border-[#263241] rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">{lang === 'ar' ? 'أقصى كشط:' : 'Max Scrape:'}</span>
              <select
                value={maxScrape}
                onChange={(e) => setMaxScrape(Number(e.target.value))}
                className="bg-slate-100 dark:bg-[#141A22] border border-slate-200 dark:border-[#263241] rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200"
              >
                <option value={3}>3 pages</option>
                <option value={5}>5 pages</option>
                <option value={10}>10 pages</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-[#00c9a7] animate-pulse" />
            <span>OpenCode AI Query Refinement &amp; Synthesis</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Loading Progress Bar */}
      {isSearching && (
        <div className="bg-white dark:bg-[#181D24] rounded-2xl border border-slate-200 dark:border-[#263241] p-6 space-y-4 shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00c9a7]/20 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-[#00c9a7] animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'جارِ تنفيذ بروتوكول التحقيق المظلم...' : 'Robin Autonomous Darknet Pipeline Running...'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{searchStage}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#00c9a7]">STAGE ACTIVE</span>
          </div>

          {/* Simulated Step Progress Bars */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="h-1.5 rounded-full bg-[#00c9a7]" />
            <div className="h-1.5 rounded-full bg-[#00c9a7] animate-pulse" />
            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-[#263241]" />
            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-[#263241]" />
          </div>
        </div>
      )}

      {/* Investigation Results */}
      {result && (
        <div ref={resultsEndRef} className="space-y-6">
          {/* Top Result Header Card */}
          <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#212932]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                    {lang === 'ar' ? 'هدف التحقيق النشط' : 'Active Target'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">{result.query}</h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  {lang === 'ar' ? 'الاستعلام المحسّن:' : 'Refined:'} {result.refined_query}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {result.sources.length} {lang === 'ar' ? 'مصادر موثقة' : 'Sources Indexed'}
                </span>
              </div>
            </div>

            {/* Navigation Tabs (Report / Sources / Pivots) */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'report'
                      ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'ar' ? 'التقرير الاستخباراتي' : 'Intelligence Report'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sources')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'sources'
                      ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>{lang === 'ar' ? `المصادر والدارك نت (${result.sources.length})` : `Onion Sources (${result.sources.length})`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pivots')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'pivots'
                      ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>{lang === 'ar' ? 'استعلامات المتابعة المقترحة' : 'Suggested Pivots'}</span>
                </button>
              </div>

              {/* Action Buttons: Copy / Download */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-white hover:bg-slate-100 dark:bg-[#141A22] dark:hover:bg-[#1E252F] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ التقرير' : 'Copy Report')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-white hover:bg-slate-100 dark:bg-[#141A22] dark:hover:bg-[#1E252F] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تحميل .md' : 'Download .md'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE INTELLIGENCE REPORT */}
          {activeTab === 'report' && (
            <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 sm:p-8">
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-wrap select-text">
                {result.summary}
              </div>
            </div>
          )}

          {/* TAB 2: ONION SOURCES & TOR CITATIONS */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.sources.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#181D24] rounded-2xl border border-slate-200 dark:border-[#263241] p-5 space-y-3 shadow-2xs hover:border-[#00c9a7]/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-slate-600 dark:text-slate-400">
                        {s.engine}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(s.link, `link-${idx}`)}
                        className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedLink === `link-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedLink === `link-${idx}` ? 'Copied' : 'Copy Onion'}</span>
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{s.title}</h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {s.snippet}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-[#212932] flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono truncate max-w-[240px]">{s.link}</span>
                      <span className="text-emerald-500 font-bold">Tor Onion</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUGGESTED PIVOTS */}
          {activeTab === 'pivots' && (
            <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 sm:p-7 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'استعلامات المتابعة المقترحة (Pivots)' : 'AI-Suggested Investigation Pivots'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'ar'
                    ? 'انقر على أي من الاستعلامات المقترحة أدناه لإعادة توجيه التحقيق وتعميق النتائج:'
                    : 'Click any suggested query pivot below to launch an immediate deeper investigation:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {result.pivots.map((pivot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(pivot);
                      handleExecuteSearch(pivot);
                    }}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#141A22] dark:hover:bg-[#1E252F] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 text-left rtl:text-right flex items-center justify-between group transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <CornerDownRight className="w-4 h-4 text-[#00c9a7] shrink-0" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#00c9a7] transition-colors">
                        {pivot}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INTERACTIVE FOLLOW-UP CONSOLE */}
          <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'محادثة المتابعة والاستيضاح الذكي' : 'Grounded Follow-up Questions'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'ar'
                    ? 'اطرح أسئلة استيضاح إضافية حول التقرير دون الحاجة لإعادة البحث في الدارك ويب'
                    : 'Ask questions grounded strictly in the retrieved onion data without re-querying the darknet'}
                </p>
              </div>
            </div>

            {/* Past Q&A Stream */}
            {followupHistory.length > 0 && (
              <div className="space-y-4 pt-2">
                {followupHistory.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-emerald-50 dark:bg-[#1C232C] border border-emerald-200/80 dark:border-[#2C3847] text-slate-900 dark:text-slate-100 px-4 py-2.5 rounded-2xl text-xs sm:text-sm max-w-[85%]">
                        {item.q}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-slate-800 dark:text-slate-200 px-5 py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[95%] whitespace-pre-wrap">
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up input row */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={followupQuestion}
                onChange={(e) => setFollowupQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendFollowup();
                }}
                placeholder={
                  lang === 'ar'
                    ? 'مثال: ما هي عناوين المحافظ المرتبطة بهذا التسريب؟ أو ما هي خطوات العزل الفوري؟'
                    : 'Ask anything about the report (e.g. Which specific hashes or onion URLs were listed?)...'
                }
                className="w-full pl-4 pr-12 rtl:pl-12 rtl:pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00c9a7]"
              />
              <button
                type="button"
                onClick={handleSendFollowup}
                disabled={isFollowupLoading || !followupQuestion.trim()}
                className={`absolute right-2 rtl:right-auto rtl:left-2 p-2 rounded-xl transition cursor-pointer ${
                  followupQuestion.trim() && !isFollowupLoading
                    ? 'bg-[#00c9a7] text-slate-950 font-bold hover:scale-105'
                    : 'bg-slate-200 dark:bg-[#202732] text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                {isFollowupLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
