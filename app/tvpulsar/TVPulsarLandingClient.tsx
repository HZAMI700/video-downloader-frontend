'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  Tv,
  Trophy,
  PlayCircle,
  Layers,
  Cpu,
  CheckCircle2,
  ExternalLink,
  FileCode,
  Sparkles,
  Share2,
  ChevronDown,
  ArrowRight,
  Flame,
  Check,
  Copy,
  Clock,
  HardDrive,
  Info,
  Sliders,
  Volume2,
  Activity,
  RotateCcw,
} from 'lucide-react';

export const MEDIAFIRE_DOWNLOAD_URL =
  'https://www.mediafire.com/file/20mhv85dbfkd26y/app-debug.apk/file';

export function TVPulsarLandingClient() {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    // Trigger download redirect to Mediafire link
    window.open(MEDIAFIRE_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setDownloading(false);
    }, 4000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(MEDIAFIRE_DOWNLOAD_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const techSpecs = [
    { label: 'اسم التطبيق', value: 'TVPulsar • Live Sports, Channels & Movies', sub: 'تي في بولسار' },
    { label: 'رقم الإصدار (Version Name)', value: '2.0.0', sub: 'أحدث إصدار رسمي مستقر' },
    { label: 'رمز البناء (Version Code)', value: '20', sub: 'Build #20' },
    { label: 'نوع البناء (Build Type)', value: 'Debug / Pre-release', sub: 'نسخة جاهزة ومحدثة' },
    { label: 'معرف الحزمة (Package ID)', value: 'com.pulsartv.app.debug', isMono: true },
    { label: 'اسم ملف الحزمة (APK)', value: 'TVPulsar_v2.0.0.apk', isMono: true },
    { label: 'حجم الملف (File Size)', value: '23.93 MB', sub: '25,089,070 بايت - خفيف وسريع' },
    { label: 'تاريخ وتوقيت البناء', value: '8 نوفمبر 2026 — 12:19:35 PM', sub: 'November 8, 2026' },
    { label: 'حالة الفحص والأمان', value: '✅ ناجح 100% (Zero Errors)', sub: 'تم فحص سلامة الحزمة بنجاح' },
    { label: 'نظام التشغيل المطلوب', value: 'Android 7.0 (Nougat) إلى Android 15+', sub: 'Min SDK: API 24' },
    { label: 'المستهدف البرمجي (Target SDK)', value: 'API 34 (Android 14.0)', sub: 'دعم كامل للنوافذ العائمة PiP وإيماءات الحواف' },
    { label: 'المعمارية المدعومة', value: 'Universal شامل لجميع المعالجات', sub: 'arm64-v8a, armeabi-v7a, x86, x86_64' },
    { label: 'بيئة وقت التشغيل (JVM)', value: 'Java 17 / Kotlin 1.9.22', sub: 'Bytecode Optimization لأقصى سرعة' },
  ];

  const highlights = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'محرك حظر الإعلانات 100% (Ad-Free Engine)',
      desc: 'حماية متقدمة وعزل شبكي يمنع كل النوافذ المنبثقة (Pop-ups) وتحويلات الروابط المزعجة والإعلانات القسرية لتجربة مشاهدة نقية تماماً.',
      badge: 'أمان كامل',
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: 'مباريات حية وبطاقات تفاعلية (StreamFree)',
      desc: 'جداول وبطاقات مباريات رياضية مباشرة تعرض شعارات الأندية والبطولات بدقة عالية دون أي صور تالفة، مع أيقونات بديلة تلقائية لكل فريق.',
      badge: 'بث مباشر',
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: 'مشغل ذكي متعدد السيرفرات (Smart Player)',
      desc: 'تشغيل فوري مع صوت مفعل تلقائياً، فحص ذاتي لسرعة الخوادم، وتبديل سلس بين سيرفرات الجودة العالية (FHD 1080p) والسيرفرات الخفيفة (SD 540p).',
      badge: 'جودة FHD/SD',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-indigo-400" />,
      title: 'استئناف المشاهدة بدقة الثانية (Continue Watching)',
      desc: 'حفظ دقيق لآخر ثانية توقفت عندها في الأفلام والمسلسلات مع تحديد الموسم ورقم الحلقة لاستكمال المتابعة فور فتح التطبيق بنقرة واحدة.',
      badge: 'مزامنة ذكية',
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: 'معمارية شاملة لجميع المعالجات (Universal APK)',
      desc: 'يعمل بسلاسة فائقة على كافة هواتف أندرويد القديمة والحديثة، وأجهزة التلفاز الذكية (Android TV)، وTV Box، وFirestick دون مشاكل توافق.',
      badge: 'توافق كامل',
    },
    {
      icon: <Sliders className="w-6 h-6 text-rose-400" />,
      title: 'واجهة عالمية وتمرير فوري ناعم',
      desc: 'دعم كامل للواجهة والإنجليزية كلغة قياسية، تصفح سريع، إعادة ضبط موضع الشاشة تلقائياً عند فتح القنوات أو التبديل بين التبويبات.',
      badge: 'تحديث v2.0.0',
    },
  ];

  const installSteps = [
    {
      step: '1',
      title: 'تحميل ملف APK',
      desc: 'اضغط على زر "تحميل APK الآن" أعلاه لنقلك مباشرة إلى رابط التنزيل المباشر على ميديافاير، واحفظ الملف على هاتفك.',
    },
    {
      step: '2',
      title: 'السماح بتثبيت التطبيقات',
      desc: 'إذا ظهر لك تنبيه أمان، اضغط على "الإعدادات" ثم فعّل خيار "السماح بالتثبيت من هذا المصدر" (Install Unknown Apps).',
    },
    {
      step: '3',
      title: 'التثبيت والتشغيل الفوري',
      desc: 'افتح ملف TVPulsar_v2.0.0.apk واضغط على "تثبيت". افتح التطبيق واستمتع بمشاهدة المباريات والقنوات والأفلام بدون إعلانات.',
    },
  ];

  const faqs = [
    {
      q: 'هل تطبيق TVPulsar v2.0.0 مجاني بالكامل؟',
      a: 'نعم، التطبيق مجاني 100% ولا يتطلب أي اشتراك أو تسجيل دخول أو بطاقة بنكية. يمكنك مشاهدة جميع المباريات والقنوات فور تثبيته.',
    },
    {
      q: 'هل ملف APK آمن وخالٍ من الفيروسات؟',
      a: 'بالتأكيد. تم فحص حزمة TVPulsar v2.0.0 بعناية وهي خالية من أي برمجيات ضارة (Zero Errors)، كما يتضمن التطبيق محرك عزل شبكي يحجب كل النوافذ المنبثقة والإعلانات المضللة.',
    },
    {
      q: 'هل يعمل التطبيق على شاشات التلفزيون الذكية (Android TV / TV Box)؟',
      a: 'نعم، التطبيق مبني بحزمة Universal APK متوافقة مع معمارية ARM و x86، ويعمل بكفاءة على شاشات الأندرويد تيفي، وأجهزة TV Box، وFirestick بالإضافة لجميع الهواتف والأجهزة اللوحية.',
    },
    {
      q: 'ما الجديد في الإصدار 2.0.0 مقارنة بالإصدارات السابقة؟',
      a: 'الإصدار 2.0.0 يجلب نظاماً جديداً كلياً لحظر الإعلانات بنسبة 100%، ومشغل ذكي بميزة اختبار سرعة السيرفرات والتبديل بين FHD 1080p و SD 540p، وميزة حفظ مكان المشاهدة بالثانية، بالإضافة لبطاقات مباريات حديثة بدون صور مكسورة.',
    },
    {
      q: 'ماذا أفعل إذا ظهرت رسالة "قد يكون الملف ضاراً" أثناء التنزيل؟',
      a: 'هذا تحذير تلقائي قياسي من نظام أندرويد لجميع ملفات الـ APK التي يتم تحميلها من خارج متجر Google Play. التطبيق آمن تماماً، اضغط على "تنزيل على أي حال" (Download anyway) للمتابعة.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden" dir="rtl">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Tv className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-white tracking-tight">TVPulsar</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    v2.0.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 -mt-0.5">Live Sports, Channels & Movies</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <span>أدوات Playzy</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل APK (23.9 MB)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>إصدار رسمي معتمد • نوفمبر 2026 • تحديث رئيسي Version 2.0.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.25] sm:leading-[1.2]">
            تحميل تطبيق <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">TVPulsar v2.0.0</span>
            <br />
            بث مباشر للمباريات والقنوات والأفلام
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            النسخة الأحدث من تطبيق <strong className="text-white">TVPulsar للأندرويد</strong>. استمتع بمشاهدة المباريات الحية والقنوات التلفزيونية والأفلام بأعلى جودة مع مشغل ذكي متعدد السيرفرات ومحرك متطور لحظر الإعلانات بنسبة 100%.
          </p>

          {/* Download Action Card */}
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80 text-right">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/30 flex-shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Tv className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">TVPulsar • Version 2.0.0</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="font-mono text-emerald-400 font-bold">TVPulsar_v2.0.0.apk</span>
                    <span>•</span>
                    <span className="text-slate-300 font-semibold">23.93 MB</span>
                    <span>•</span>
                    <span className="text-teal-400">Android 7.0+</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>فحص أمني ناجح 100%</span>
              </div>
            </div>

            {/* Big CTA Download Button */}
            <div className="space-y-3 pt-6">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-4 sm:py-5 px-8 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-110 transition-all transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
              >
                {downloading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري نقلك إلى صفحة التحميل على ميديافاير...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6 animate-bounce" />
                    <span>تحميل TVPulsar v2.0.0 APK الآن (ميديافاير)</span>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم نسخ الرابط بنجاح!' : 'نسخ رابط التحميل المباشر'}</span>
                </button>

                <span>•</span>

                <a
                  href={MEDIAFIRE_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  <span>رابط احتياطي مباشر على Mediafire</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick spec indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/70 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[11px] text-slate-400">حجم الملف</div>
                <div className="font-extrabold text-sm text-white mt-0.5">23.93 MB</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[11px] text-slate-400">رمز الإصدار</div>
                <div className="font-extrabold text-sm text-emerald-400 mt-0.5">v2.0.0 (Build 20)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[11px] text-slate-400">المعمارية</div>
                <div className="font-extrabold text-sm text-cyan-400 mt-0.5">Universal (جميع الأجهزة)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[11px] text-slate-400">نظام الأندرويد</div>
                <div className="font-extrabold text-sm text-teal-400 mt-0.5">Android 7.0 - 15+</div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights / Features Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              أهم مميزات وتحديثات الإصدار 2.0.0
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              تمت ترقية التطبيق بنظام متكامل يضمن لك أعلى استقرار وسرعة في البث التلفزيوني والرياضي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Release Specifications Table */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <FileCode className="w-4 h-4" />
              <span>المواصفات التقنية الرسمية للتطبيق</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              بيانات الحزمة والبناء (Release Specification)
            </h2>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
            <div className="divide-y divide-slate-800/70">
              {techSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-800/30 transition-colors gap-2"
                >
                  <div className="sm:w-1/3">
                    <span className="text-xs sm:text-sm font-bold text-slate-300">{spec.label}</span>
                  </div>
                  <div className="sm:w-2/3 flex flex-col sm:items-start text-right">
                    <span
                      className={`text-xs sm:text-sm font-semibold text-white ${
                        spec.isMono ? 'font-mono text-emerald-400' : ''
                      }`}
                    >
                      {spec.value}
                    </span>
                    {spec.sub && (
                      <span className="text-[11px] text-slate-400 mt-0.5">{spec.sub}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-Step Installation Guide */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              طريقة تثبيت تطبيق TVPulsar على هاتفك أو شاشتك
            </h2>
            <p className="text-sm text-slate-400">
              خطوات بسيطة وسريعة لتثبيت ملف APK بدون أي تعقيد
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {installSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 relative space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black flex items-center justify-center text-lg">
                  {step.step}
                </div>
                <h3 className="font-bold text-base text-white">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">الأسئلة الشائعة حول التطبيق</h2>
            <p className="text-sm text-slate-400">إجابات على أكثر الاستفسارات حول التثبيت والتشغيل</p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Download Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            جاهز لمشاهدة المباريات والأفلام بجودة فائقة؟
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            حمل TVPulsar Version 2.0.0 الآن مجاناً برابط ميديافاير السريع والمباشر بدون أي انتظار.
          </p>

          <div className="pt-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 transition-all transform active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>تحميل TVPulsar_v2.0.0.apk (23.93 MB)</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </button>
          </div>
        </section>
      </main>

      {/* Floating Bottom Download Bar on Scroll */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 transform transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Tv className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm text-white block">TVPulsar • Live Sports & Movies</span>
              <span className="text-[11px] text-slate-400">الإصدار 2.0.0 • 23.93 MB • Android APK</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تحميل APK (23.9 MB)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 py-8 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <p>© {new Date().getFullYear()} TVPulsar • جميع الحقوق محفوظة لفرق التطوير والتوزيع.</p>
          <p className="text-slate-400 text-[11px]">
            تطبيق TVPulsar v2.0.0 مخصص لتشغيل الوسائط وبث المباريات والقنوات الرياضية والأفلام بدون إعلانات مزعجة.
          </p>
        </div>
      </footer>
    </div>
  );
}
