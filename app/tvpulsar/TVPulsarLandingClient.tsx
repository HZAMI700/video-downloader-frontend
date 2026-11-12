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
    {
      label: 'أيقونة التطبيق الرسمية',
      value: 'Pulsar TV HD Icon',
      hasIcon: true,
      sub: 'شعار التطبيق الرسمي للإصدار 2.0.0',
    },
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
      icon: <ShieldCheck className="w-6 h-6 text-accent" />,
      title: 'محرك حظر الإعلانات 100% (Ad-Free Engine)',
      desc: 'حماية متقدمة وعزل شبكي يمنع كل النوافذ المنبثقة (Pop-ups) وتحويلات الروابط المزعجة والإعلانات القسرية لتجربة مشاهدة نقية تماماً.',
      badge: 'أمان كامل',
    },
    {
      icon: <Trophy className="w-6 h-6 text-warning" />,
      title: 'مباريات حية وبطاقات تفاعلية (StreamFree)',
      desc: 'جداول وبطاقات مباريات رياضية مباشرة تعرض شعارات الأندية والبطولات بدقة عالية دون أي صور تالفة، مع أيقونات بديلة تلقائية لكل فريق.',
      badge: 'بث مباشر',
    },
    {
      icon: <Zap className="w-6 h-6 text-info" />,
      title: 'مشغل ذكي متعدد السيرفرات (Smart Player)',
      desc: 'تشغيل فوري مع صوت مفعل تلقائياً، فحص ذاتي لسرعة الخوادم، وتبديل سلس بين سيرفرات الجودة العالية (FHD 1080p) والسيرفرات الخفيفة (SD 540p).',
      badge: 'جودة FHD/SD',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-muted" />,
      title: 'استئناف المشاهدة بدقة الثانية (Continue Watching)',
      desc: 'حفظ دقيق لآخر ثانية توقفت عندها في الأفلام والمسلسلات مع تحديد الموسم ورقم الحلقة لاستكمال المتابعة فور فتح التطبيق بنقرة واحدة.',
      badge: 'مزامنة ذكية',
    },
    {
      icon: <Cpu className="w-6 h-6 text-muted" />,
      title: 'معمارية شاملة لجميع المعالجات (Universal APK)',
      desc: 'يعمل بسلاسة فائقة على كافة هواتف أندرويد القديمة والحديثة، وأجهزة التلفاز الذكية (Android TV)، وTV Box، وFirestick دون مشاكل توافق.',
      badge: 'توافق كامل',
    },
    {
      icon: <Sliders className="w-6 h-6 text-danger" />,
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
    <div className="min-h-screen bg-bg text-fg font-sans overflow-x-hidden" dir="rtl">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-line bg-bg/70 sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-line shadow-black/40 transition-transform bg-black flex-shrink-0">
                <img
                  src="/tvpulsar-icon.png"
                  alt="TVPulsar Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-fg tracking-tight">TVPulsar</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent border border-accent/30">
                    v2.0.0
                  </span>
                </div>
                <p className="text-xs text-muted -mt-0.5">Live Sports, Channels & Movies</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-fg hover:text-fg px-3 py-1.5 rounded-lg hover:bg-surface/50 transition-colors"
            >
              <span>أدوات Playzy</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-accent text-on-accent hover:brightness-110 transition-all transform"
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
          {/* App Official Icon Showcase */}
          <div className="relative inline-block mb-1 group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-card overflow-hidden border-2 border-line bg-black">
              <img
                src="/tvpulsar-icon.png"
                alt="TVPulsar App Icon v2.0.0"
                className="w-full h-full object-cover transform transition-transform duration-300"
              />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/30 text-accent animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>إصدار رسمي معتمد • نوفمبر 2026 • تحديث رئيسي Version 2.0.0</span>
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-fg">
            تحميل تطبيق <span className="text-accent">TVPulsar v2.0.0</span>
            <br />
            بث مباشر للمباريات والقنوات والأفلام
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-fg max-w-3xl mx-auto leading-relaxed">
            النسخة الأحدث من تطبيق <strong className="text-fg">TVPulsar للأندرويد</strong>. استمتع بمشاهدة المباريات الحية والقنوات التلفزيونية والأفلام بأعلى جودة مع مشغل ذكي متعدد السيرفرات ومحرك متطور لحظر الإعلانات بنسبة 100%.
          </p>

          {/* Download Action Card */}
          <div className="max-w-2xl mx-auto bg-surface/90 border border-line rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-accent" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-line text-right">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-line shadow-black/50 flex-shrink-0 bg-black">
                  <img
                    src="/tvpulsar-icon.png"
                    alt="TVPulsar App Icon"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-fg">TVPulsar • Version 2.0.0</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
                    <span className="font-mono text-accent font-medium">TVPulsar_v2.0.0.apk</span>
                    <span>•</span>
                    <span className="text-fg font-medium">23.93 MB</span>
                    <span>•</span>
                    <span className="text-accent">Android 7.0+</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>فحص أمني ناجح 100%</span>
              </div>
            </div>

            {/* Big CTA Download Button */}
            <div className="space-y-3 pt-6">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-4 sm:py-5 px-8 rounded-2xl font-semibold text-base sm:text-lg bg-accent text-on-accent hover:brightness-110 transition-all transform flex items-center justify-center gap-3 cursor-pointer"
              >
                {downloading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-line border-t-transparent rounded-full animate-spin" />
                    <span>جاري نقلك إلى صفحة التحميل على ميديافاير...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>تحميل TVPulsar v2.0.0 APK الآن (ميديافاير)</span>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-muted">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/60 hover:bg-surface text-fg hover:text-fg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم نسخ الرابط بنجاح!' : 'نسخ رابط التحميل المباشر'}</span>
                </button>

                <span>•</span>

                <a
                  href={MEDIAFIRE_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  <span>رابط احتياطي مباشر على Mediafire</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick spec indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-line text-center">
              <div className="p-2.5 rounded-xl bg-bg/60 border border-line">
                <div className="text-xs text-muted">حجم الملف</div>
                <div className="font-semibold text-sm text-fg mt-0.5">23.93 MB</div>
              </div>
              <div className="p-2.5 rounded-xl bg-bg/60 border border-line">
                <div className="text-xs text-muted">رمز الإصدار</div>
                <div className="font-semibold text-sm text-accent mt-0.5">v2.0.0 (Build 20)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-bg/60 border border-line">
                <div className="text-xs text-muted">المعمارية</div>
                <div className="font-semibold text-sm text-info mt-0.5">Universal (جميع الأجهزة)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-bg/60 border border-line">
                <div className="text-xs text-muted">نظام الأندرويد</div>
                <div className="font-semibold text-sm text-accent mt-0.5">Android 7.0 - 15+</div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights / Features Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-fg">
              أهم مميزات وتحديثات الإصدار 2.0.0
            </h2>
            <p className="text-sm text-muted max-w-xl mx-auto">
              تمت ترقية التطبيق بنظام متكامل يضمن لك أعلى استقرار وسرعة في البث التلفزيوني والرياضي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface/60 border border-line hover:border-line hover:bg-surface/90 transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-surface/80 border border-line/50 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface text-fg border border-line">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-medium text-base text-fg group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
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
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
              <FileCode className="w-4 h-4" />
              <span>المواصفات التقنية الرسمية للتطبيق</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-fg">
              بيانات الحزمة والبناء (Release Specification)
            </h2>
          </div>

          <div className="bg-surface/70 border border-line rounded-2xl overflow-hidden">
            <div className="divide-y divide-line">
              {techSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-surface/30 transition-colors gap-2"
                >
                  <div className="sm:w-1/3">
                    <span className="text-xs sm:text-sm font-medium text-fg">{spec.label}</span>
                  </div>
                  <div className="sm:w-2/3 flex flex-col sm:items-start text-right">
                    <div className="flex items-center gap-3">
                      {spec.hasIcon && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-line bg-black flex-shrink-0">
                          <img
                            src="/tvpulsar-icon.png"
                            alt="TVPulsar Icon"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <span
                          className={`text-xs sm:text-sm font-medium text-fg ${
                            spec.isMono ? 'font-mono text-accent' : ''
                          }`}
                        >
                          {spec.value}
                        </span>
                        {spec.sub && (
                          <span className="text-xs text-muted block mt-0.5">{spec.sub}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-Step Installation Guide */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-fg">
              طريقة تثبيت تطبيق TVPulsar على هاتفك أو شاشتك
            </h2>
            <p className="text-sm text-muted">
              خطوات بسيطة وسريعة لتثبيت ملف APK بدون أي تعقيد
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {installSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface/80 border border-line relative space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 text-accent font-semibold flex items-center justify-center text-lg">
                  {step.step}
                </div>
                <h3 className="font-medium text-base text-fg">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-fg">الأسئلة الشائعة حول التطبيق</h2>
            <p className="text-sm text-muted">إجابات على أكثر الاستفسارات حول التثبيت والتشغيل</p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-surface/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-medium text-sm sm:text-base text-fg hover:text-accent transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-fg leading-relaxed border-t border-line pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Download Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-accent/40 border border-accent/30 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial bg-accent/10 pointer-events-none" />
          
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-line shadow-black mx-auto bg-black">
            <img
              src="/tvpulsar-icon.png"
              alt="TVPulsar App Icon"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold text-fg">
            جاهز لمشاهدة المباريات والأفلام بجودة فائقة؟
          </h2>
          <p className="text-sm sm:text-base text-fg max-w-xl mx-auto leading-relaxed">
            حمل TVPulsar Version 2.0.0 الآن مجاناً برابط ميديافاير السريع والمباشر بدون أي انتظار.
          </p>

          <div className="pt-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base bg-accent text-on-accent hover:brightness-110 transition-all transform cursor-pointer"
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
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-bg/90 border-t border-line transform transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-line bg-black flex items-center justify-center shrink-0">
              <img
                src="/tvpulsar-icon.png"
                alt="TVPulsar Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-medium text-sm text-fg block">TVPulsar • Live Sports & Movies</span>
              <span className="text-xs text-muted">الإصدار 2.0.0 • 23.93 MB • Android APK</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface text-xs font-medium text-fg hover:text-fg"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-accent text-on-accent hover:brightness-110 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تحميل APK (23.9 MB)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line bg-bg/60 py-8 text-center text-xs text-muted">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <p>© {new Date().getFullYear()} TVPulsar • جميع الحقوق محفوظة لفرق التطوير والتوزيع.</p>
          <p className="text-muted text-xs">
            تطبيق TVPulsar v2.0.0 مخصص لتشغيل الوسائط وبث المباريات والقنوات الرياضية والأفلام بدون إعلانات مزعجة.
          </p>
        </div>
      </footer>
    </div>
  );
}
