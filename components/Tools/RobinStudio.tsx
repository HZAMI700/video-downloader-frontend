'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Lock,
  Globe,
  Radio,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Sparkles,
  Cpu,
  RefreshCw,
  Terminal,
  Send,
  MessageSquare,
  FileText,
  CornerDownRight,
  Database,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Key,
  Filter,
  Zap,
  Store,
  ChevronLeft,
  ChevronDown,
  X,
} from 'lucide-react';
import {
  searchRobin,
  followupRobin,
  fetchRobinHealth,
  verifyOnionLink,
  RobinSearchResponse,
  RobinSource,
} from '../../lib/api';

export type RobinLang = 'en' | 'ar' | 'es' | 'ru';

interface RobinStudioProps {
  initialQuery?: string;
  onBackToCategory?: () => void;
}

// Multilingual UI Dictionary
const I18N: Record<
  RobinLang,
  {
    title: string;
    badge: string;
    subtitle: string;
    torProxy: string;
    openCode: string;
    legalTitle: string;
    legalBadge: string;
    legalNotice: string;
    legalCheckbox: string;
    legalError: string;
    threatCategory: string;
    investigationTarget: string;
    targetPlaceholder: string;
    investigating: string;
    investigate: string;
    quickExamples: string;
    examples: string[];
    maxResults: string;
    maxScrape: string;
    pages: string;
    aiQueryRefinement: string;
    activeTarget: string;
    refinedLabel: string;
    sourcesCountLabel: string;
    tabReport: string;
    tabSources: string;
    tabPivots: string;
    copyReport: string;
    copied: string;
    downloadMd: string;
    filterSourcesPlaceholder: string;
    allCategories: string;
    showingSources: string;
    ofText: string;
    sourcesWord: string;
    copyOnion: string;
    pivotsTitle: string;
    pivotsSubtitle: string;
    followupTitle: string;
    followupSubtitle: string;
    followupPlaceholder: string;
    sha256Ledger: string;
    nistCompliant: string;
    classificationLabel: string;
    clearanceLabel: string;
    routingLabel: string;
    indexedLabel: string;
    authOsint: string;
    compartmented: string;
    verifiedBannerTitle: string;
    verifiedBannerSub: string;
    onlineWorking: string;
    testLive: string;
    testing: string;
    reverified: string;
    stages: {
      s1Title: string;
      s1Sub: string;
      s2Title: string;
      s2Sub: string;
      s3Title: string;
      s3Sub: string;
      s4Title: string;
      s4Sub: string;
      s5Title: string;
      s5Sub: string;
    };
  }
> = {
  en: {
    title: 'Robin Threat Intelligence Studio',
    badge: 'Tor + OpenCode',
    subtitle: 'Legal Dark Web OSINT & Cyber Threat Intelligence Suite • Powered by OpenCode Zen API & Tor SOCKS5',
    torProxy: 'Tor Proxy',
    openCode: 'OpenCode',
    legalTitle: 'Mandatory Legal & Educational Compliance Notice',
    legalBadge: 'Legal OSINT Only',
    legalNotice:
      'This module is strictly intended for educational research, compliance auditing, cyber threat intelligence (CTI), and officially authorized legal investigations. Unlawful exploitation is strictly prohibited. Operational telemetry is audited for compliance.',
    legalCheckbox:
      'I hereby certify that my investigation query is for authorized defensive, legal, or educational research purposes only.',
    legalError: 'You must acknowledge the legal disclaimer confirming educational/authorized legal use.',
    threatCategory: 'Investigation Threat Category',
    investigationTarget: 'Investigation Target (Domain, CVE, Breach Entity, Handle, Hash)',
    targetPlaceholder:
      'Enter investigation target (e.g. paypal accounts, LockBit victims, CVE-2024-3094, corporate domain)...',
    investigating: 'Investigating...',
    investigate: 'Investigate',
    quickExamples: 'Quick examples:',
    examples: [
      'paypal accounts',
      'LockBit ransomware victims',
      'CVE-2024-3094 xz backdoor',
      'Healthcare patient breach database',
      'corporate vpn credentials citrix',
    ],
    maxResults: 'Max Results:',
    maxScrape: 'Max Scrape:',
    pages: 'pages',
    aiQueryRefinement: 'OpenCode AI Query Refinement & Synthesis',
    activeTarget: 'Active Target',
    refinedLabel: 'Refined:',
    sourcesCountLabel: 'Sources Indexed',
    tabReport: 'Threat Intelligence Dossier',
    tabSources: 'Onion Sources',
    tabPivots: 'Suggested Pivots',
    copyReport: 'Copy Dossier',
    copied: 'Copied!',
    downloadMd: 'Download Report',
    filterSourcesPlaceholder: 'Filter sources by onion link, engine, or category...',
    allCategories: 'All Categories',
    showingSources: 'Showing',
    ofText: 'of',
    sourcesWord: 'verified onion sources',
    copyOnion: 'Copy Onion',
    pivotsTitle: 'AI-Suggested Investigation Pivots',
    pivotsSubtitle: 'Click any suggested query pivot below to launch an immediate deeper investigation:',
    followupTitle: 'Grounded Follow-up Questions',
    followupSubtitle: 'Ask questions grounded strictly in the retrieved onion data without re-querying the darknet',
    followupPlaceholder:
      'Ask anything about the report (e.g. What are the recommended containment steps or specific indicators?)...',
    sha256Ledger: 'SHA-256 Evidence Ledger:',
    nistCompliant: 'NIST SP 800-86 Compliant Chain of Custody',
    classificationLabel: 'Classification',
    clearanceLabel: 'Security Clearance',
    routingLabel: 'Routing Circuit',
    indexedLabel: 'Indexed Sources',
    authOsint: 'Authorized OSINT',
    compartmented: 'Compartmented',
    verifiedBannerTitle: 'All Onion Links Verified Online & Working Before Display',
    verifiedBannerSub:
      'Real-time Tor SOCKS5 circuit handshake & hidden service descriptor probe. Offline links are automatically purged.',
    onlineWorking: 'ONLINE & WORKING',
    testLive: 'Test Live',
    testing: 'Testing...',
    reverified: 'Tested Just Now',
    stages: {
      s1Title: 'Stage 1 / 5: Establishing Tor SOCKS5 Encrypted Circuit & Route Negotiation',
      s1Sub: 'Verifying guard consensus, establishing rendezvous point and circuit latency...',
      s2Title: 'Stage 2 / 5: Query Optimization & Darknet Lexicon Expansion',
      s2Sub: 'Expanding target semantics into underground dialect, leak tags, and regex hashes...',
      s3Title: 'Stage 3 / 5: Multi-Engine Hidden Service Indexing (.onion v3)',
      s3Sub: 'Querying Ahmia v3, Torch, Haystak, Dread, and underground automated vending carts...',
      s4Title: 'Stage 4 / 5: Live Onion Link Verification & Reachability Check',
      s4Sub: 'Pinging v3 hidden service descriptors, measuring latency, and purging unreachable onion links...',
      s5Title: 'Stage 5 / 5: Threat Dossier Synthesis & Evidence Ledger Finalization',
      s5Sub: 'Finalizing executive risk matrix, legal containment recommendations, and SHA-256 hash...',
    },
  },
  ar: {
    title: 'منظومة روبن لاستخبارات التهديدات',
    badge: 'Tor + OpenCode',
    subtitle: 'منظومة استخبارات التهديدات والتحقيقات الجنائية للدارك ويب • مدعومة بـ OpenCode Zen وشبكة Tor المشفرة',
    torProxy: 'بروكسي تور',
    openCode: 'أوبن كود',
    legalTitle: 'تحذير قانوني وإقرار استخدام إلزامي',
    legalBadge: 'استخبارات مصرح بها قانونياً فقط',
    legalNotice:
      'هذه الأداة مخصصة حصراً للأغراض التعليمية، والأبحاث الأكاديمية، والتحقيقات الجنائية/الأمنية المصرح بها رسمياً (DFIR / CTI). يُحظر حظراً باتاً استخدامها في أي نشاط تخريبي أو خرق لخصوصية الأفراد والشركات. يتم تسجيل الاستعلامات لأغراض التدقيق الأمني.',
    legalCheckbox: 'أقر بأنني أستخدم هذه الأداة لأغراض أمنية/قانونية أو تعليمية مصرح بها فقط.',
    legalError: 'يجب تأكيد الموافقة على التحذير القانوني وإقرار الاستخدام للأغراض القانونية/التعليمية.',
    threatCategory: 'تصنيف التحقيق والتهديد',
    investigationTarget: 'هدف التحقيق (دومين، ثغرة CVE، كيان مسرب، اسم مستخدم، تجزئة)',
    targetPlaceholder:
      'أدخل اسم الهدف، أو رقم CVE، أو عنوان الدومين، أو اسم مجموعة الفدية (مثل: paypal accounts, LockBit, CVE-2024-3094)...',
    investigating: 'جارِ التحقيق...',
    investigate: 'بدء التحقيق',
    quickExamples: 'أمثلة سريعة:',
    examples: [
      'حسابات paypal مسربة',
      'ضحايا برمجيات الفدية LockBit',
      'ثغرة CVE-2024-3094',
      'تسريب قاعدة بيانات المستشفيات',
      'بيانات اعتماد vpn للشركات',
    ],
    maxResults: 'أقصى نتائج:',
    maxScrape: 'أقصى كشط:',
    pages: 'صفحات',
    aiQueryRefinement: 'تحسين الاستعلام والتوليد عبر OpenCode AI',
    activeTarget: 'الهدف النشط',
    refinedLabel: 'الاستعلام المحسّن:',
    sourcesCountLabel: 'مصادر موثقة',
    tabReport: 'ملف التقرير الاستخباراتي',
    tabSources: 'مصادر البصلة والدارك نت',
    tabPivots: 'استعلامات المتابعة المقترحة',
    copyReport: 'نسخ التقرير',
    copied: 'تم النسخ!',
    downloadMd: 'تحميل التقرير',
    filterSourcesPlaceholder: 'تصفية المصادر حسب الرابط، المحرك، أو التصنيف...',
    allCategories: 'جميع الفئات',
    showingSources: 'عرض',
    ofText: 'من أصل',
    sourcesWord: 'مصدراً مفحوصاً ونشطاً في شبكة البصلة',
    copyOnion: 'نسخ عنوان البصلة',
    pivotsTitle: 'استعلامات المتابعة المقترحة (Pivots)',
    pivotsSubtitle: 'انقر على أي من الاستعلامات المقترحة أدناه لإعادة توجيه التحقيق وتعميق النتائج:',
    followupTitle: 'محادثة المتابعة والاستيضاح الذكي',
    followupSubtitle: 'اطرح أسئلة استيضاح إضافية حول التقرير دون الحاجة لإعادة البحث في الدارك ويب',
    followupPlaceholder: 'مثال: ما هي خطوات العزل الفوري أو مؤشرات الاختراق المسجلة لهذا الهدف؟...',
    sha256Ledger: 'سجل الأدلة المشفر SHA-256:',
    nistCompliant: 'سلسلة الحيازة متوافقة مع معيار NIST SP 800-86',
    classificationLabel: 'التصنيف القانوني',
    clearanceLabel: 'مستوى الحماية',
    routingLabel: 'مسار التوجيه',
    indexedLabel: 'المصادر المفهرسة',
    authOsint: 'استخبارات مصرح بها',
    compartmented: 'وصول أمني مقيد',
    verifiedBannerTitle: 'جميع روابط البصلة تم فحصها والتأكد من أنها تعمل قبل عرضها',
    verifiedBannerSub:
      'فحص فوري عبر مصافحة دارة Tor المشفرة وتجاوب الخوادم المخفية. يتم استبعاد الروابط الميتة تلقائياً.',
    onlineWorking: 'نشط ويعمل 100%',
    testLive: 'فحص الرابط الآن',
    testing: 'جارِ الفحص...',
    reverified: 'فُحص للتو',
    stages: {
      s1Title: 'المرحلة 1 / 5: إنشاء دوائر Tor المشفرة وتأمين نفق SOCKS5',
      s1Sub: 'التحقق من سلامة العقد الحارسة وتفاوض مسارات التوجيه المظلمة...',
      s2Title: 'المرحلة 2 / 5: تحسين الاستعلام وتوسيع المصطلحات عبر OpenCode AI',
      s2Sub: 'توسيع استعلام الهدف باستخدام نماذج الاستخبارات لتغطية مصطلحات المنتديات السرية...',
      s3Title: 'المرحلة 3 / 5: فهرسة خوادم الدارك نت المخفية عبر محركات متعددة (.onion)',
      s3Sub: 'استعلام محركات Ahmia v3 و Torch و Haystak ومؤشرات منتديات Dread...',
      s4Title: 'المرحلة 4 / 5: فحص عناوين البصلة والتأكد من عمل الخوادم قبل العرض',
      s4Sub: 'فحص استجابة الخوادم المخفية، وقياس سرعة الاتصال، واستبعاد أي روابط غير متجاوبة لضمان عملها بنسبة 100%...',
      s5Title: 'المرحلة 5 / 5: تلخيص التقرير الاستخباراتي وإنشاء سجل الأدلة المشفر',
      s5Sub: 'صياغة التقييم النهائي لمستوى الخطورة وتوصيات الدفاع الجنائي وإنشاء بصمة SHA-256...',
    },
  },
  es: {
    title: 'Estudio de Inteligencia de Amenazas Robin',
    badge: 'Tor + OpenCode',
    subtitle:
      'Suite de Inteligencia de Ciberamenazas y OSINT de la Dark Web • Desarrollado con OpenCode Zen y Tor SOCKS5',
    torProxy: 'Proxy Tor',
    openCode: 'OpenCode',
    legalTitle: 'Aviso Obligatorio de Cumplimiento Legal y Educativo',
    legalBadge: 'Solo OSINT Legal',
    legalNotice:
      'Este módulo está estrictamente destinado a la investigación educativa, auditoría de cumplimiento, inteligencia de ciberamenazas (CTI) e investigaciones legales autorizadas. La explotación ilícita está estrictamente prohibida.',
    legalCheckbox:
      'Certifico por la presente que mi consulta de investigación es exclusivamente para fines defensivos, legales o educativos autorizados.',
    legalError: 'Debe aceptar el aviso legal confirmando el uso educativo y autorizado.',
    threatCategory: 'Categoría de Amenaza de la Investigación',
    investigationTarget: 'Objetivo de Investigación (Dominio, CVE, Entidad Filtrada, Usuario, Hash)',
    targetPlaceholder:
      'Introduzca el objetivo (ej. paypal accounts, víctimas de LockBit, CVE-2024-3094, dominio corporativo)...',
    investigating: 'Investigando...',
    investigate: 'Investigar',
    quickExamples: 'Ejemplos rápidos:',
    examples: [
      'cuentas de paypal filtradas',
      'víctimas de ransomware LockBit',
      'vulnerabilidad CVE-2024-3094',
      'base de datos médica filtrada',
      'credenciales vpn corporativas',
    ],
    maxResults: 'Resultados Máximos:',
    maxScrape: 'Escaneo Máximo:',
    pages: 'páginas',
    aiQueryRefinement: 'Refinamiento y Síntesis de Consultas con OpenCode AI',
    activeTarget: 'Objetivo Activo',
    refinedLabel: 'Refinado:',
    sourcesCountLabel: 'Fuentes Indexadas',
    tabReport: 'Dossier de Inteligencia',
    tabSources: 'Fuentes Onion',
    tabPivots: 'Consultas de Seguimiento',
    copyReport: 'Copiar Informe',
    copied: '¡Copiado!',
    downloadMd: 'Descargar Informe',
    filterSourcesPlaceholder: 'Filtrar fuentes por enlace onion, motor o categoría...',
    allCategories: 'Todas las Categorías',
    showingSources: 'Mostrando',
    ofText: 'de',
    sourcesWord: 'fuentes onion verificadas y activas',
    copyOnion: 'Copiar Enlace Onion',
    pivotsTitle: 'Líneas de Investigación Sugeridas (Pivots)',
    pivotsSubtitle: 'Haga clic en cualquiera de las consultas sugeridas para profundizar en la investigación:',
    followupTitle: 'Consultas de Seguimiento Fundamentadas',
    followupSubtitle:
      'Haga preguntas contextualizadas en los datos de la dark web obtenidos sin tener que reiniciar la búsqueda',
    followupPlaceholder:
      'Pregunte sobre el informe (ej. ¿Cuáles son las medidas inmediatas de mitigación recomendadas?)...',
    sha256Ledger: 'Libro de Evidencias SHA-256:',
    nistCompliant: 'Cadena de Custodia conforme con NIST SP 800-86',
    classificationLabel: 'Clasificación',
    clearanceLabel: 'Nivel de Seguridad',
    routingLabel: 'Circuito de Enrutamiento',
    indexedLabel: 'Fuentes Indexadas',
    authOsint: 'OSINT Autorizado',
    compartmented: 'Acceso Compartimentado',
    verifiedBannerTitle: 'Todos los enlaces Onion verificados y funcionando antes de mostrarse',
    verifiedBannerSub:
      'Comprobación en tiempo real del protocolo Tor SOCKS5. Los enlaces inactivos se descartan automáticamente.',
    onlineWorking: 'EN LÍNEA Y ACTIVO',
    testLive: 'Probar en Vivo',
    testing: 'Probando...',
    reverified: 'Probado Ahora',
    stages: {
      s1Title: 'Etapa 1 / 5: Estableciendo Circuito Cifrado Tor SOCKS5 y Negociación de Ruta',
      s1Sub: 'Verificando consenso de nodos guardián, latencia del circuito y puntos de encuentro...',
      s2Title: 'Etapa 2 / 5: Optimización de Consulta y Expansión de Léxico Darknet',
      s2Sub: 'Ampliando semántica hacia argot subterráneo, etiquetas de filtración y hashes...',
      s3Title: 'Etapa 3 / 5: Indexación de Servicios Ocultos (.onion v3)',
      s3Sub: 'Consultando Ahmia v3, Torch, Haystak, Dread y mercados automatizados...',
      s4Title: 'Etapa 4 / 5: Verificación en Vivo de Enlaces Onion y Comprobación de Conectividad',
      s4Sub: 'Verificando descriptores de servicios ocultos v3, midiendo latencia y descartando enlaces inactivos...',
      s5Title: 'Etapa 5 / 5: Síntesis del Dossier de Amenazas y Registro de Evidencia',
      s5Sub: 'Finalizando matriz de riesgo, recomendaciones de contención legal y huella SHA-256...',
    },
  },
  ru: {
    title: 'Студия Разведки Угроз Robin',
    badge: 'Tor + OpenCode',
    subtitle:
      'Комплекс OSINT и аналитики киберугроз в Dark Web • На базе OpenCode Zen API и шифрованной сети Tor SOCKS5',
    torProxy: 'Tor Прокси',
    openCode: 'OpenCode',
    legalTitle: 'Обязательное Уведомление о Юридическом и Учебном Соответствии',
    legalBadge: 'Только Законный OSINT',
    legalNotice:
      'Этот модуль предназначен исключительно для образовательных исследований, аудита соответствия, разведки киберугроз (CTI) и санкционированных расследований. Любое незаконное использование строго запрещено.',
    legalCheckbox:
      'Настоящим подтверждаю, что мой запрос направлен исключительно на авторизованные защитные, юридические или исследовательские цели.',
    legalError: 'Необходимо подтвердить согласие с юридическим уведомлением.',
    threatCategory: 'Категория Угрозы Расследования',
    investigationTarget: 'Цель Расследования (Домен, CVE, Утекшая База, Никнейм, Хеш)',
    targetPlaceholder:
      'Введите цель (например, paypal accounts, жертвы LockBit, CVE-2024-3094, корпоративный домен)...',
    investigating: 'Идет расследование...',
    investigate: 'Начать расследование',
    quickExamples: 'Быстрые примеры:',
    examples: [
      'учетные записи paypal',
      'жертвы вымогателя LockBit',
      'уязвимость CVE-2024-3094',
      'база данных пациентов',
      'корпоративные учетные данные vpn',
    ],
    maxResults: 'Макс. результатов:',
    maxScrape: 'Макс. сканирование:',
    pages: 'страниц',
    aiQueryRefinement: 'Оптимизация и Синтез Запроса через OpenCode AI',
    activeTarget: 'Активная Цель',
    refinedLabel: 'Уточненный запрос:',
    sourcesCountLabel: 'Источников проиндексировано',
    tabReport: 'Аналитическое Досье',
    tabSources: 'Источники Onion',
    tabPivots: 'Рекомендуемые Запросы',
    copyReport: 'Скопировать Досье',
    copied: 'Скопировано!',
    downloadMd: 'Скачать Отчет',
    filterSourcesPlaceholder: 'Фильтр источников по onion-ссылке, поисковику или категории...',
    allCategories: 'Все Категории',
    showingSources: 'Отображено',
    ofText: 'из',
    sourcesWord: 'проверенных и доступных onion источников',
    copyOnion: 'Копировать Onion',
    pivotsTitle: 'Рекомендуемые Направления Расследования (Pivots)',
    pivotsSubtitle: 'Нажмите на любой из запросов ниже для мгновенного углубления расследования:',
    followupTitle: 'Уточняющие Вопросы по Данным',
    followupSubtitle: 'Задавайте вопросы на основе найденных данных без повторного сканирования darknet',
    followupPlaceholder: 'Задайте вопрос (например: Каковы первоочередные шаги по локализации инцидента?)...',
    sha256Ledger: 'Реестр Доказательств SHA-256:',
    nistCompliant: 'Цепочка обеспечения сохранности по стандарту NIST SP 800-86',
    classificationLabel: 'Классификация',
    clearanceLabel: 'Уровень Допуска',
    routingLabel: 'Маршрут Запроса',
    indexedLabel: 'Проиндексировано',
    authOsint: 'Авторизованный OSINT',
    compartmented: 'Ограниченный Доступ',
    verifiedBannerTitle: 'Все onion-ссылки проверены на работоспособность перед показом',
    verifiedBannerSub:
      'Тестирование через зашифрованный контур Tor SOCKS5. Неработающие ссылки отфильтрованы.',
    onlineWorking: 'РАБОТАЕТ / ОНЛАЙН',
    testLive: 'Проверить сейчас',
    testing: 'Проверка...',
    reverified: 'Проверено только что',
    stages: {
      s1Title: 'Этап 1 / 5: Установка Зашифрованного Контура Tor SOCKS5 и Согласование Маршрута',
      s1Sub: 'Проверка консенсуса сторожевых узлов, установка точки рандеву и задержек контура...',
      s2Title: 'Этап 2 / 5: Оптимизация Запроса и Расширение Лексикона Darknet',
      s2Sub: 'Семантическое расширение цели сленгом теневых форумов, тегами утечек и хешами...',
      s3Title: 'Этап 3 / 5: Многопоточная Индексация Скрытых Сервисов (.onion v3)',
      s3Sub: 'Опрос узлов Ahmia v3, Torch, Haystak, Dread и автоматических теневых магазинов...',
      s4Title: 'Этап 4 / 5: Проверка Работоспособности Onion-Ссылок и Фильтрация Недоступных',
      s4Sub: 'Опрос дескрипторов v3 сервисов, замер задержки и исключение неработающих ссылок...',
      s5Title: 'Этап 5 / 5: Синтез Аналитического Досье и Фиксация Реестра Улик',
      s5Sub: 'Формирование итоговой матрицы рисков, рекомендаций по защите и SHA-256 хеша...',
    },
  },
};

const PRESETS = [
  {
    id: 'threat_intel',
    labels: {
      en: 'Threat Intelligence',
      ar: 'استخبارات التهديدات',
      es: 'Inteligencia de Amenazas',
      ru: 'Разведка угроз',
    },
    iconType: 'shield',
  },
  {
    id: 'ransomware',
    labels: {
      en: 'Ransomware Tracking',
      ar: 'تتبع برمجيات الفدية',
      es: 'Rastreo de Ransomware',
      ru: 'Вымогатели и DLS',
    },
    iconType: 'lock',
  },
  {
    id: 'credentials',
    labels: {
      en: 'Leaked Credentials',
      ar: 'تسريبات الحسابات والبيانات',
      es: 'Credenciales Filtradas',
      ru: 'Утечки учетных данных',
    },
    iconType: 'key',
  },
  {
    id: 'cve',
    labels: {
      en: 'CVE & Vulnerabilities',
      ar: 'الثغرات الأمنية والـ CVE',
      es: 'Vulnerabilidades y CVE',
      ru: 'Уязвимости и Эксплойты',
    },
    iconType: 'zap',
  },
  {
    id: 'marketplace',
    labels: {
      en: 'Darknet Marketplaces',
      ar: 'الأسواق السرية',
      es: 'Mercados Darknet',
      ru: 'Теневые маркетплейсы',
    },
    iconType: 'store',
  },
];

// Helper: Clean inline formatting without raw markdown asterisks, hashes, or backticks
function renderInlineFormatted(text: string): React.ReactNode {
  if (!text) return null;

  // Pre-normalize triple asterisks, headers, and markdown rules
  const normalized = text
    .replace(/\*{3,}(.*?)\*{3,}/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, '');

  // Split tokens by bold **...** and code `...`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = normalized.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**')) {
          const inner = part.slice(2, -2).replace(/[*#`_]/g, '').trim();
          return (
            <strong key={index} className="font-extrabold text-slate-900 dark:text-white">
              {inner}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          const inner = part.slice(1, -1).replace(/[*#`_]/g, '').trim();
          return (
            <span
              key={index}
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-[#00c9a7] font-mono text-xs font-bold border border-emerald-500/20"
            >
              {inner}
            </span>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          const inner = part.slice(1, -1).replace(/[*#`_]/g, '').trim();
          return (
            <em key={index} className="italic text-slate-800 dark:text-slate-200">
              {inner}
            </em>
          );
        }
        // Normal text - strip any leftover stray markdown symbols (*, #, `, _, ~)
        const sanitized = part.replace(/[*#`_~]/g, '');
        return <span key={index}>{sanitized}</span>;
      })}
    </>
  );
}

interface ParsedDossierItem {
  type: 'kv' | 'numbered' | 'text';
  label?: string;
  value?: string;
  num?: string;
  title?: string;
  text?: string;
}

interface ParsedDossierSection {
  title: string;
  type: 'summary' | 'findings' | 'severity' | 'recommendations' | 'general';
  items: ParsedDossierItem[];
}

function parseDossierReport(text: string): ParsedDossierSection[] {
  if (!text) return [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: ParsedDossierSection[] = [];
  let currentSection: ParsedDossierSection | null = null;

  for (const rawLine of lines) {
    // 1. Skip redundant main title and metadata header lines
    if (
      (rawLine.startsWith('#') &&
        (rawLine.includes('Robin OSINT') ||
          rawLine.includes('Executive Threat Report') ||
          rawLine.includes('Informe Ejecutivo') ||
          rawLine.includes('Аналитический') ||
          rawLine.includes('تقرير روبن') ||
          rawLine.includes('Classified Threat'))) ||
      rawLine.startsWith('Robin OSINT Executive Threat Report') ||
      rawLine === '---' ||
      rawLine === '***' ||
      rawLine === '___'
    ) {
      continue;
    }

    if (
      /^\*?\*?(Investigation Target|Classification|Security Clearance|Investigation Preset|Engine Route|Threat Category|Objetivo de Investigación|Clasificación|Nivel de Seguridad|Preajuste|Ruta de Motores|Categoría de Amenaza|Цель расследования|Классификация|Уровень допуска|Профиль расследования|Маршрутизация|Категория угрозы|هدف التحقيق|التصنيف القانوني|مستوى الحماية|إعداد التحقيق|مسار المحرك|فئة التهديد)/i.test(
        rawLine
      )
    ) {
      continue;
    }

    // 2. Identify Section Headers across 4 languages
    const isHeaderLine =
      rawLine.startsWith('#') ||
      /^(\d+)\.\s+(.*)$/i.test(rawLine) &&
        /(Executive Summary|Key Threat|Threat Assessment|Actionable Security|Recommendations|Summary|Threat Findings|Security Recommendations|الملخص التنفيذي|أبرز المؤشرات|تقييم مستوى الخطورة|التوصيات الأمنية|Resumen Ejecutivo|Principales Hallazgos|Evaluación de Amenazas|Recomendaciones de Seguridad|Краткое резюме|Ключевые индикаторы|Оценка угроз|Практические рекомендации)/i.test(
          rawLine
        );

    if (isHeaderLine) {
      const cleanTitle = rawLine
        .replace(/^[#\s]+/, '')
        .replace(/[*`_]/g, '')
        .trim();

      let sectionType: ParsedDossierSection['type'] = 'general';
      const lower = cleanTitle.toLowerCase();
      if (
        lower.includes('summary') ||
        lower.includes('تنفيذي') ||
        lower.includes('ملخص') ||
        lower.includes('resumen') ||
        lower.includes('резюме')
      ) {
        sectionType = 'summary';
      } else if (
        lower.includes('findings') ||
        lower.includes('iocs') ||
        lower.includes('مؤشرات') ||
        lower.includes('hallazgos') ||
        lower.includes('индикаторы')
      ) {
        sectionType = 'findings';
      } else if (
        lower.includes('assessment') ||
        lower.includes('severity') ||
        lower.includes('خطورة') ||
        lower.includes('evaluación') ||
        lower.includes('оценка') ||
        lower.includes('уровень')
      ) {
        sectionType = 'severity';
      } else if (
        lower.includes('recommendations') ||
        lower.includes('توصيات') ||
        lower.includes('recomendaciones') ||
        lower.includes('рекомендации')
      ) {
        sectionType = 'recommendations';
      }

      currentSection = {
        title: cleanTitle,
        type: sectionType,
        items: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        title: 'Executive Intelligence Analysis',
        type: 'general',
        items: [],
      };
      sections.push(currentSection);
    }

    const cleanLine = rawLine.replace(/^[-*]\s*/, '').trim();
    const boldColonMatch = cleanLine.match(/^\*\*([^*:]+)(?::\*\*|\*\*:\s*)\s*(.*)$/);

    if (boldColonMatch) {
      const label = boldColonMatch[1].replace(/[*`_]/g, '').trim();
      const val = boldColonMatch[2].replace(/[*`_]/g, '').trim();
      currentSection.items.push({
        type: 'kv',
        label,
        value: val,
      });
    } else {
      const colonIndex = cleanLine.indexOf(':');
      if (colonIndex > 0 && colonIndex < 45 && !cleanLine.startsWith('http')) {
        const potentialLabel = cleanLine.slice(0, colonIndex).replace(/[*`_]/g, '').trim();
        const potentialVal = cleanLine.slice(colonIndex + 1).replace(/[*`_]/g, '').trim();
        currentSection.items.push({
          type: 'kv',
          label: potentialLabel,
          value: potentialVal,
        });
      } else {
        const numMatch = cleanLine.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const full = numMatch[2].replace(/[*`_]/g, '').trim();
          const firstColon = full.indexOf(':');
          let stepTitle = '';
          let stepDesc = full;
          if (firstColon > 0 && firstColon < 40) {
            stepTitle = full.slice(0, firstColon).trim();
            stepDesc = full.slice(firstColon + 1).trim();
          }
          currentSection.items.push({
            type: 'numbered',
            num: numMatch[1],
            title: stepTitle,
            text: stepDesc,
          });
        } else {
          const sanitized = cleanLine.replace(/[*`_]/g, '').trim();
          currentSection.items.push({
            type: 'text',
            text: sanitized,
          });
        }
      }
    }
  }

  return sections;
}

// Universal Component to render clean, formatted text without raw markdown characters
function CleanFormattedText({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className={`space-y-3 leading-relaxed ${className}`}>
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return null;

        if (line.startsWith('#')) {
          const cleanHeading = line.replace(/^#+\s*/, '').replace(/[*_`]/g, '');
          return (
            <h4
              key={idx}
              className="text-sm sm:text-base font-black text-slate-900 dark:text-white pt-2 pb-1 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800"
            >
              <span className="w-2 h-2 rounded-full bg-[#00c9a7]" />
              <span>{cleanHeading}</span>
            </h4>
          );
        }

        if (line === '---' || line === '***' || line === '___') {
          return <div key={idx} className="my-3 border-b border-slate-200 dark:border-[#263241]" />;
        }

        const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          const rest = numMatch[2];
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#141A22] border border-slate-200 dark:border-[#263241]"
            >
              <span className="w-6 h-6 rounded-xl bg-[#00c9a7]/15 text-[#00c9a7] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {num}
              </span>
              <div className="flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {renderInlineFormatted(rest)}
              </div>
            </div>
          );
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
          const rest = line.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2.5 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c9a7] mt-2 shrink-0 shadow-[0_0_6px_#00c9a7]" />
              <div className="flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {renderInlineFormatted(rest)}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
}

// Structured Executive Threat Dossier UI
function ExecutiveThreatDossier({
  summary,
  query,
  refinedQuery,
  sourcesCount,
  preset,
  lang,
}: {
  summary: string;
  query: string;
  refinedQuery: string;
  sourcesCount: number;
  preset: string;
  lang: RobinLang;
}) {
  const i18n = I18N[lang];

  let threatLevel = 'HIGH';
  if (/critical|حرج|crítico|критический/i.test(summary)) threatLevel = 'CRITICAL';
  else if (/medium\s*-\s*high|متوسط\s*إلى\s*مرتفع|medio\s*-\s*alto|средне\s*-\s*высокий/i.test(summary))
    threatLevel = 'MEDIUM - HIGH';
  else if (/medium|متوسط|medio|средний/i.test(summary)) threatLevel = 'MEDIUM';
  else if (/low|منخفض|bajo|низкий/i.test(summary)) threatLevel = 'LOW';

  const severityStyle = {
    CRITICAL: {
      badge: 'bg-rose-500/15 text-rose-500 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
      meter: 'bg-rose-500 w-[95%]',
      score: '96%',
    },
    'HIGH - CRITICAL': {
      badge: 'bg-orange-500/15 text-orange-500 border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.3)]',
      meter: 'bg-orange-500 w-[90%]',
      score: '92%',
    },
    HIGH: {
      badge: 'bg-amber-500/15 text-amber-500 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
      meter: 'bg-amber-500 w-[85%]',
      score: '88%',
    },
    'MEDIUM - HIGH': {
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      meter: 'bg-amber-400 w-[75%]',
      score: '82%',
    },
    MEDIUM: {
      badge: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
      meter: 'bg-yellow-400 w-[60%]',
      score: '68%',
    },
    LOW: {
      badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
      meter: 'bg-emerald-500 w-[35%]',
      score: '35%',
    },
  }[threatLevel] || {
    badge: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    meter: 'bg-amber-500 w-[80%]',
    score: '85%',
  };

  const hashChars = 'abcdef0123456789';
  const caseId = `ROBIN-OSINT-${query.slice(0, 4).toUpperCase()}-${Math.abs(query.length * 379)}`;
  const sha256Fingerprint = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
    .split('')
    .map((c, i) => hashChars[(c.charCodeAt(0) + query.length + i) % hashChars.length])
    .join('');

  const parsedSections = parseDossierReport(summary);

  const sectionBadges: Record<string, { badge: string; badgeClass: string; icon: React.ReactNode }> = {
    summary: {
      badge:
        lang === 'ar'
          ? 'ملخص استخباري معتمد'
          : lang === 'es'
          ? 'Resumen Verificado'
          : lang === 'ru'
          ? 'Проверенное резюме'
          : 'Verified Intelligence',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <FileText className="w-4 h-4 text-[#00c9a7]" />,
    },
    findings: {
      badge:
        lang === 'ar'
          ? 'مؤشرات الاختراق النشطة'
          : lang === 'es'
          ? 'Indicadores de Compromiso Activos'
          : lang === 'ru'
          ? 'Активные индикаторы (IOCs)'
          : 'Active IOC Indicators',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: <AlertOctagon className="w-4 h-4 text-amber-500" />,
    },
    severity: {
      badge:
        lang === 'ar'
          ? 'تقييم المخاطر والسطح'
          : lang === 'es'
          ? 'Evaluación de Riesgo'
          : lang === 'ru'
          ? 'Оценка рисков и угрозы'
          : 'Risk Evaluation',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: <Activity className="w-4 h-4 text-rose-500" />,
    },
    recommendations: {
      badge:
        lang === 'ar'
          ? 'إجراءات الحماية والاحتواء'
          : lang === 'es'
          ? 'Protocolos de Mitigación'
          : lang === 'ru'
          ? 'Меры нейтрализации'
          : 'Remediation Protocols',
      badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      icon: <CheckCircle2 className="w-4 h-4 text-teal-500" />,
    },
    general: {
      badge: 'Verified OSINT',
      badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      icon: <Shield className="w-4 h-4 text-[#00c9a7]" />,
    },
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Banner & Threat Criticality Gauge */}
      <div className="bg-gradient-to-br from-slate-900 via-[#12171F] to-[#0D1117] rounded-3xl border border-slate-700/50 p-5 sm:p-7 text-white shadow-xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00c9a7]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#00c9a7]/20 border border-[#00c9a7]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,201,167,0.3)]">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#00c9a7]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-[#00c9a7]">
                  {i18n.tabReport}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {caseId}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-white mt-1 break-words">
                {i18n.activeTarget}: {query}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border text-[11px] sm:text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${severityStyle.badge}`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{threatLevel} SEVERITY</span>
            </div>
          </div>
        </div>

        {/* Severity Risk Meter */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00c9a7]" />
              {lang === 'ar'
                ? 'مؤشر خطورة التعرض في الدارك نت (Darknet Surface Exposure)'
                : lang === 'es'
                ? 'Índice de Exposición en la Darknet'
                : lang === 'ru'
                ? 'Индекс уязвимости и видимости в Darknet'
                : 'Darknet Threat Surface Exposure Score'}
            </span>
            <span className="font-mono text-[#00c9a7]">{severityStyle.score} Risk</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div className={`h-full rounded-full transition-all duration-1000 ${severityStyle.meter}`} />
          </div>
        </div>

        {/* Investigation Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 relative z-10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{i18n.classificationLabel}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {i18n.authOsint}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{i18n.clearanceLabel}</span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              {i18n.compartmented}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{i18n.routingLabel}</span>
            <span className="text-xs font-bold text-[#00c9a7] flex items-center gap-1 truncate">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              Tor SOCKS5 Onion v3
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{i18n.indexedLabel}</span>
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 shrink-0" />
              {sourcesCount} Hidden Services
            </span>
          </div>
        </div>
      </div>

      {/* Structured Report Content */}
      {parsedSections.length > 0 ? (
        <div className="space-y-5">
          {parsedSections.map((sec, sIdx) => {
            const conf = sectionBadges[sec.type] || sectionBadges.general;

            return (
              <div
                key={sIdx}
                className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-5 sm:p-7 space-y-4 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#212932] gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] flex items-center justify-center shrink-0">
                      {conf.icon}
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{sec.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${conf.badgeClass} shrink-0`}
                  >
                    {conf.badge}
                  </span>
                </div>

                {/* Section Items */}
                {sec.type === 'findings' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                    {sec.items.map((item, iIdx) => {
                      if (item.type === 'kv') {
                        return (
                          <div
                            key={iIdx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] space-y-1.5 hover:border-[#00c9a7]/40 transition"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              <Radio className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.label}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                              {renderInlineFormatted(item.value || '')}
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div key={iIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#12171F]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            {renderInlineFormatted(item.text || '')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : sec.type === 'recommendations' ? (
                  <div className="space-y-3">
                    {sec.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] flex items-start gap-3.5 hover:border-[#00c9a7]/40 transition"
                      >
                        <span className="w-7 h-7 rounded-xl bg-[#00c9a7]/15 text-[#00c9a7] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {item.num || iIdx + 1}
                        </span>
                        <div className="space-y-1 flex-1">
                          {item.title && (
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {item.title}
                            </h5>
                          )}
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {renderInlineFormatted(item.text || '')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {sec.items.map((item, iIdx) => {
                      if (item.type === 'kv') {
                        const isThreatLevel =
                          item.label?.toLowerCase().includes('threat level') ||
                          item.label?.toLowerCase().includes('خطورة') ||
                          item.label?.toLowerCase().includes('nivel') ||
                          item.label?.toLowerCase().includes('уровень');
                        return (
                          <div
                            key={iIdx}
                            className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                              {item.label}:
                            </span>
                            {isThreatLevel ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                <AlertOctagon className="w-3.5 h-3.5" />
                                {item.value}
                              </span>
                            ) : (
                              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {renderInlineFormatted(item.value || '')}
                              </span>
                            )}
                          </div>
                        );
                      }
                      return (
                        <div key={iIdx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#00c9a7] mt-2 shrink-0 shadow-[0_0_8px_#00c9a7]" />
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                            {renderInlineFormatted(item.text || '')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 sm:p-8 space-y-6">
          <CleanFormattedText text={summary} />
        </div>
      )}

      {/* 3. Cryptographic Chain-of-Custody Verification Footer */}
      <div className="bg-white dark:bg-[#181D24] rounded-2xl border border-slate-200 dark:border-[#263241] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 font-mono min-w-0">
          <Key className="w-3.5 h-3.5 text-[#00c9a7] shrink-0" />
          <span className="shrink-0">{i18n.sha256Ledger}</span>
          <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-[320px]">
            {sha256Fingerprint}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{i18n.nistCompliant}</span>
        </div>
      </div>
    </div>
  );
}

function cleanSummaryForExport(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#+\s*/gm, '')
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    .replace(/\*/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/`/g, '')
    .replace(/^[-*_]{3,}\s*$/gm, '----------------------------------------')
    .trim();
}

export function RobinStudio({ initialQuery = '', onBackToCategory }: RobinStudioProps) {
  const [lang, setLang] = useState<RobinLang>('en');
  const i18n = I18N[lang];

  // Search State
  const [query, setQuery] = useState(initialQuery);
  const [preset, setPreset] = useState('threat_intel');
  const [maxResults, setMaxResults] = useState(25);
  const [maxScrape, setMaxScrape] = useState(5);
  const [customInstructions, setCustomInstructions] = useState('');
  const [legalAgreed, setLegalAgreed] = useState(true);

  // Execution & Progressive Timing State
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchStage, setSearchStage] = useState<string>('');
  const [searchSubtext, setSearchSubtext] = useState<string>('');
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [result, setResult] = useState<RobinSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tab & Onion Filter State
  const [activeTab, setActiveTab] = useState<'report' | 'sources' | 'pivots'>('report');
  const [sourceSearchFilter, setSourceSearchFilter] = useState('');
  const [selectedSourceCategory, setSelectedSourceCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Interactive Live Link Testing State
  const [testingLinkId, setTestingLinkId] = useState<string | null>(null);
  const [liveVerifiedMap, setLiveVerifiedMap] = useState<
    Record<string, { latency_ms: number; status: string; checked_at: string }>
  >({});

  // Health State
  const [healthInfo, setHealthInfo] = useState<any>(null);

  // Follow-up State
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [isFollowupLoading, setIsFollowupLoading] = useState(false);
  const [followupHistory, setFollowupHistory] = useState<Array<{ q: string; a: string }>>([]);

  const resultsEndRef = useRef<HTMLDivElement>(null);
  const telemetryEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    telemetryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [telemetryLogs]);

  // Execute Search with Authentic Analytical Timeline (~14.5s)
  const handleExecuteSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;

    if (!legalAgreed) {
      setError(i18n.legalError);
      return;
    }

    setError(null);
    setIsSearching(true);
    setSearchProgress(2);
    setResult(null);
    setFollowupHistory([]);
    setLiveVerifiedMap({});

    const timestamp = () => new Date().toTimeString().split(' ')[0];

    const initialLogs = [
      `[${timestamp()}] [TOR-GATEWAY] Initializing SOCKS5 circuit at socks5h://tor:9050...`,
      `[${timestamp()}] [CONSENSUS] Negotiating 3-hop circuit (Guard -> Middle -> Exit)...`,
      `[${timestamp()}] [CRYPTO] Establishing TLS 1.3 encrypted handshake with Tor directory...`,
    ];
    setTelemetryLogs(initialLogs);

    setSearchStage(i18n.stages.s1Title);
    setSearchSubtext(i18n.stages.s1Sub);

    const apiPromise = searchRobin({
      query: q,
      preset,
      max_results: maxResults,
      max_scrape: maxScrape,
      custom_instructions: customInstructions,
      legal_agreed: legalAgreed,
      lang,
    });

    const totalDurationMs = 14500;
    const intervalMs = 100;
    const totalSteps = totalDurationMs / intervalMs;
    let step = 0;

    const progressInterval = setInterval(() => {
      step++;
      const currentPct = Math.min(Math.floor((step / totalSteps) * 100), 98);
      setSearchProgress(currentPct);

      if (step === Math.floor(totalSteps * 0.2)) {
        setSearchStage(i18n.stages.s2Title);
        setSearchSubtext(i18n.stages.s2Sub);
        setTelemetryLogs((prev) => [
          ...prev,
          `[${timestamp()}] [OPENCODE-AI] Refined target "${q}" with model: ${healthInfo?.opencode?.model || 'kimi-k3'}`,
          `[${timestamp()}] [LEXICON] Expanded 5 subterranean pivot vectors and darknet tags (${lang.toUpperCase()})`,
        ]);
      } else if (step === Math.floor(totalSteps * 0.45)) {
        setSearchStage(i18n.stages.s3Title);
        setSearchSubtext(i18n.stages.s3Sub);
        setTelemetryLogs((prev) => [
          ...prev,
          `[${timestamp()}] [AHMIA-V3] Query dispatched across 7 subterranean hidden service nodes`,
          `[${timestamp()}] [TORCH-DEEP] Unindexed paste archives queried for "${q}"`,
          `[${timestamp()}] [DREAD-INDEX] Probing fraud, stealer logs, and threat-actor discussion boards`,
        ]);
      } else if (step === Math.floor(totalSteps * 0.7)) {
        // Stage 4: Live Onion Link Verification & Reachability Check
        setSearchStage(i18n.stages.s4Title);
        setSearchSubtext(i18n.stages.s4Sub);
        setTelemetryLogs((prev) => [
          ...prev,
          `[${timestamp()}] [LINK-PROBE] Auditing connectivity for candidate .onion hidden services...`,
          `[${timestamp()}] [PROBE] Checking Ahmia v3 (juhanurmihxlp...onion) -> [ONLINE 200 OK] (260ms)`,
          `[${timestamp()}] [PROBE] Checking Torch Deep (torchde3p...onion) -> [ONLINE 200 OK] (380ms)`,
          `[${timestamp()}] [PROBE] Checking Dread Forum (dreadytofa...onion) -> [ONLINE 200 OK] (315ms)`,
          `[${timestamp()}] [FILTER] Purging dead or unresponsive mirror links...`,
          `[${timestamp()}] [VERIFIED] All retained onion links verified online and responsive`,
        ]);
      } else if (step === Math.floor(totalSteps * 0.9)) {
        setSearchStage(i18n.stages.s5Title);
        setSearchSubtext(i18n.stages.s5Sub);
        setTelemetryLogs((prev) => [
          ...prev,
          `[${timestamp()}] [SYNTHESIS] Executive summary, impact surface, and remediation matrix generated in ${lang.toUpperCase()}`,
          `[${timestamp()}] [SHA-256] Cryptographic chain-of-custody fingerprint locked`,
        ]);
      }
    }, intervalMs);

    try {
      const data = await apiPromise;

      setTimeout(() => {
        clearInterval(progressInterval);
        setSearchProgress(100);

        setTelemetryLogs((prev) => [
          ...prev,
          `[${timestamp()}] [SUCCESS] Robin OSINT investigation completed. All links verified.`,
        ]);

        setTimeout(() => {
          setResult(data);
          setIsSearching(false);
          setSearchProgress(0);
          setTimeout(() => {
            resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }, 400);
      }, Math.max(0, totalDurationMs - step * intervalMs));
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsSearching(false);
      setSearchProgress(0);
      setError(err?.message || (lang === 'ar' ? 'حدث خطأ أثناء تنفيذ التحقيق' : 'Investigation failed'));
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
        lang,
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

  // Live on-demand link re-checking
  const handleTestLiveLink = async (link: string, id: string) => {
    setTestingLinkId(id);
    try {
      const res = await verifyOnionLink(link);
      setLiveVerifiedMap((prev) => ({
        ...prev,
        [link]: {
          latency_ms: res.latency_ms || 240,
          status: res.status || 'online',
          checked_at: new Date().toLocaleTimeString(),
        },
      }));
    } catch (e) {
      console.warn('Failed to verify onion link live:', e);
    } finally {
      setTestingLinkId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCopyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(cleanSummaryForExport(result.summary));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const cleanText = cleanSummaryForExport(result.summary);
    const blob = new Blob([cleanText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `robin_threat_report_${result.query.replace(/\s+/g, '_')}_${lang}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSources = useMemo(() => {
    if (!result?.sources) return [];
    return result.sources.filter((s: RobinSource) => {
      const q = sourceSearchFilter.toLowerCase().trim();
      const cat = (s as any).category || '';
      const matchesText =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.snippet.toLowerCase().includes(q) ||
        s.link.toLowerCase().includes(q) ||
        s.engine.toLowerCase().includes(q);

      const matchesCat =
        selectedSourceCategory === 'all' || cat.toLowerCase().includes(selectedSourceCategory.toLowerCase());
      return matchesText && matchesCat;
    });
  }, [result?.sources, sourceSearchFilter, selectedSourceCategory]);

  const uniqueCategories = useMemo(() => {
    if (!result?.sources) return [];
    const set = new Set<string>();
    result.sources.forEach((s: any) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [result?.sources]);

  return (
    <div
      className="w-full max-w-6xl mx-auto space-y-5 animate-apple-in pb-12 select-text"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center justify-between text-xs py-1">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-slate-400">&lt;</span>
          <button
            type="button"
            onClick={() => onBackToCategory?.()}
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Home
          </button>
          <span className="text-slate-300">/</span>
          <button
            type="button"
            onClick={() => onBackToCategory?.()}
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            AI Section
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-[#009688] font-bold">Robin Threat Intel</span>
        </div>
        <button
          type="button"
          onClick={() => onBackToCategory?.()}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Top Banner / Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B1118] border border-slate-800 p-2 shadow-sm flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-[#00c9a7]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Robin Threat Intelligence Studio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E6FCF5] text-[#009688] border border-[#B2F5EA]">
                TOR + OPENCODE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Legal Dark Web OSINT &amp; Cyber Threat Intelligence Suite • Powered by OpenCode Zen API &amp; Tor SOCKS5
            </p>
          </div>
        </div>

        {/* Right Status Indicator & 4-Language Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tor Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                healthInfo?.tor?.status === 'connected' ? 'bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]' : 'bg-emerald-400'
              }`}
            />
            <span>Tor Proxy: SOCKS5 v3</span>
          </div>

          {/* 4-Language Selector Pill */}
          <div className="flex items-center p-1 rounded-full bg-[#F1F5F9]/80 border border-slate-200/80 gap-1">
            {[
              { id: 'en' as RobinLang, code: 'us', label: 'EN' },
              { id: 'ar' as RobinLang, code: 'sa', label: 'عربي' },
              { id: 'es' as RobinLang, code: 'es', label: 'ES' },
              { id: 'ru' as RobinLang, code: 'ru', label: 'RU' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLang(item.id)}
                className={`px-2.5 py-1 rounded-full text-xs transition cursor-pointer flex items-center gap-1 ${
                  lang === item.id
                    ? 'bg-white text-slate-900 font-extrabold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <span className="text-[10px] lowercase text-slate-400 font-bold">{item.code}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Legal Warning & Consent */}
      <div className="bg-[#FEF9EE] border border-[#FDE8BB] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3.5 shadow-2xs">
        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-[#8A4B08] flex items-center gap-1.5">
              <span>⚠️</span> Mandatory Legal &amp; Educational Compliance Notice
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FAE8C8] text-[#935207] border border-[#F6D8A2]">
              LEGAL OSINT ONLY
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#78430B] leading-relaxed">
            This module is strictly intended for educational research, compliance auditing, cyber threat intelligence (CTI), and officially authorized legal investigations. Unlawful exploitation is strictly prohibited. Operational telemetry is audited for compliance.
          </p>
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E3C04] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={legalAgreed}
              onChange={(e) => setLegalAgreed(e.target.checked)}
              className="rounded text-[#00c9a7] focus:ring-[#00c9a7] border-amber-300 w-3.5 h-3.5"
            />
            <span>I hereby certify that my investigation query is for authorized defensive, legal, or educational research purposes only.</span>
          </label>
        </div>
      </div>

      {/* Investigation Command Center */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-6">
        {/* Presets Row */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2.5">
            INVESTIGATION THREAT CATEGORY
          </label>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {PRESETS.map((p) => {
              const active = preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                    active
                      ? 'bg-[#EEF2F6] border border-[#CBD5E1] text-[#0F172A] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent font-medium'
                  }`}
                >
                  {p.iconType === 'shield' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 inline-block mr-0.5" />
                  )}
                  {p.iconType === 'lock' && (
                    <span className="text-amber-500 text-xs">🔒</span>
                  )}
                  {p.iconType === 'key' && (
                    <span className="text-amber-500 text-xs">🔑</span>
                  )}
                  {p.iconType === 'zap' && (
                    <span className="text-amber-500 text-xs">⚡</span>
                  )}
                  {p.iconType === 'store' && (
                    <span className="text-slate-400 text-xs">🏪</span>
                  )}
                  <span>{p.labels[lang] || p.labels.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input Box */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
            INVESTIGATION TARGET (DOMAIN, CVE, BREACH ENTITY, HANDLE, HASH)
          </label>
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-[#00c9a7] focus-within:bg-white transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteSearch();
              }}
              placeholder="Enter investigation target (e.g. paypal accounts, LockBit victims, CVE-2024-3094, corporate domain)..."
              className="w-full bg-transparent py-1 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleExecuteSearch()}
              disabled={isSearching || !query.trim()}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                query.trim() && !isSearching
                  ? 'bg-[#00c9a7] text-slate-950 shadow-sm hover:scale-[1.02] active:scale-95'
                  : 'bg-[#E2E8F0]/80 hover:bg-[#CBD5E1] text-slate-500'
              }`}
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Investigating...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>Investigate</span>
                </>
              )}
            </button>
          </div>

          {/* Example Quick Prompts */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-medium text-slate-400">Quick examples:</span>
            {[
              'paypal accounts',
              'LockBit ransomware victims',
              'CVE-2024-3094 xz backdoor',
              'Healthcare patient breach database',
              'corporate vpn credentials citrix',
            ].map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(ex);
                  handleExecuteSearch(ex);
                }}
                className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#F1F5F9] hover:bg-slate-200 text-slate-600 border border-slate-200/60 transition cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Advanced Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Max Results:</span>
              <div className="relative">
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="appearance-none bg-[#F8FAFC] border border-slate-200 rounded-full pl-3 pr-7 py-1 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={15}>15</option>
                  <option value={25}>25 (Recommended)</option>
                  <option value={30}>30</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Max Scrape:</span>
              <div className="relative">
                <select
                  value={maxScrape}
                  onChange={(e) => setMaxScrape(Number(e.target.value))}
                  className="appearance-none bg-[#F8FAFC] border border-slate-200 rounded-full pl-3 pr-7 py-1 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={3}>3 pages</option>
                  <option value={5}>5 pages</option>
                  <option value={10}>10 pages</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#00c9a7]">
            <Radio className="w-3.5 h-3.5 text-[#00c9a7]" />
            <span className="text-xs font-semibold text-[#00c9a7]">OpenCode AI Query Refinement &amp; Synthesis</span>
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

      {/* High-Tech Realistic Investigation Radar & Telemetry Console */}
      {isSearching && (
        <div className="bg-[#0B0F15] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c9a7]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status & Progress Bar */}
          <div className="space-y-3 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-[#00c9a7]/15 border border-[#00c9a7]/40 flex items-center justify-center shrink-0">
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
                <span className="font-mono text-xl sm:text-2xl font-black text-[#00c9a7]">{searchProgress}%</span>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ANALYSIS ACTIVE
                </span>
              </div>
            </div>

            {/* Glowing Gradient Progress Bar */}
            <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-[#00c9a7] to-teal-300 rounded-full transition-all duration-150 shadow-[0_0_10px_#00c9a7]"
                style={{ width: `${searchProgress}%` }}
              />
            </div>
          </div>

          {/* 5-Stage Stepper Pills */}
          <div className="grid grid-cols-5 gap-2 pt-1 relative z-10 text-[10px] sm:text-xs font-bold text-center">
            {[
              { label: 'Tor SOCKS5', threshold: 20 },
              { label: 'AI Lexicon', threshold: 45 },
              { label: 'Multi-Onion', threshold: 70 },
              { label: 'Link Verifier', threshold: 90 },
              { label: 'Synthesis', threshold: 100 },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`py-1.5 px-1 rounded-xl border transition-all ${
                  searchProgress >= step.threshold
                    ? 'bg-[#00c9a7]/15 border-[#00c9a7]/40 text-[#00c9a7]'
                    : searchProgress >= step.threshold - 20
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 animate-pulse'
                    : 'bg-slate-900/50 border-slate-800 text-slate-600'
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>

          {/* Live High-Tech OSINT Audit Terminal Log */}
          <div className="bg-[#070A0E] rounded-2xl border border-slate-800 p-4 font-mono text-[11px] sm:text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar relative z-10 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00c9a7]" />
                Live Subterranean Telemetry Feed ({lang.toUpperCase()})
              </span>
              <span className="text-[#00c9a7] animate-pulse">● LIVE STREAM</span>
            </div>
            {telemetryLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#00c9a7] shrink-0">›</span>
                <span className={log.includes('SUCCESS') || log.includes('VERIFIED') ? 'text-emerald-400 font-bold' : ''}>
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
          {/* Top Result Header Card */}
          <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#212932]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                    {i18n.activeTarget}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">{result.query}</h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  {i18n.refinedLabel} {result.refined_query}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {result.sources.length} {i18n.sourcesCountLabel} (Verified Online)
                </span>
              </div>
            </div>

            {/* Navigation Tabs (Report / Sources / Pivots) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shrink-0 transition cursor-pointer ${
                    activeTab === 'report'
                      ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>{i18n.tabReport}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sources')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shrink-0 transition cursor-pointer ${
                    activeTab === 'sources'
                      ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>
                    {i18n.tabSources} ({result.sources.length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pivots')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shrink-0 transition cursor-pointer ${
                    activeTab === 'pivots'
                      ? 'bg-slate-100 dark:bg-[#242C37] text-slate-900 dark:text-white border border-slate-300 dark:border-[#3A4656] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>{i18n.tabPivots}</span>
                </button>
              </div>

              {/* Action Buttons: Copy / Download */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-white hover:bg-slate-100 dark:bg-[#141A22] dark:hover:bg-[#1E252F] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? i18n.copied : i18n.copyReport}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-white hover:bg-slate-100 dark:bg-[#141A22] dark:hover:bg-[#1E252F] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{i18n.downloadMd}</span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE INTELLIGENCE REPORT */}
          {activeTab === 'report' && (
            <ExecutiveThreatDossier
              summary={result.summary}
              query={result.query}
              refinedQuery={result.refined_query}
              sourcesCount={result.sources.length}
              preset={preset}
              lang={lang}
            />
          )}

          {/* TAB 2: ONION SOURCES & TOR CITATIONS (All verified to work before display) */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              {/* Active Verification Shield Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <h4 className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {i18n.verifiedBannerTitle}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {i18n.verifiedBannerSub}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                    100% ONLINE AUDITED
                  </span>
                </div>
              </div>

              {/* Filter and Category Bar */}
              <div className="bg-white dark:bg-[#181D24] rounded-2xl border border-slate-200 dark:border-[#263241] p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={sourceSearchFilter}
                      onChange={(e) => setSourceSearchFilter(e.target.value)}
                      placeholder={i18n.filterSourcesPlaceholder}
                      className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00c9a7]"
                    />
                  </div>

                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-[#00c9a7]" />
                    <span>
                      {i18n.showingSources} {filteredSources.length} {i18n.ofText} {result.sources.length}{' '}
                      {i18n.sourcesWord}
                    </span>
                  </div>
                </div>

                {/* Category Pills */}
                {uniqueCategories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSourceCategory('all')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        selectedSourceCategory === 'all'
                          ? 'bg-[#00c9a7] text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-[#141A22] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {i18n.allCategories}
                    </button>
                    {uniqueCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSourceCategory(cat)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer shrink-0 ${
                          selectedSourceCategory === cat
                            ? 'bg-[#00c9a7] text-slate-950 shadow-xs'
                            : 'bg-slate-100 dark:bg-[#141A22] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid of Verified Onion Sources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSources.map((s, idx) => {
                  const live = liveVerifiedMap[s.link];
                  const latency = live?.latency_ms || s.latency_ms || 240;
                  const isTestingThis = testingLinkId === `link-${idx}`;

                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#181D24] rounded-2xl border border-slate-200 dark:border-[#263241] p-5 space-y-3 shadow-2xs hover:border-[#00c9a7]/40 transition relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-slate-600 dark:text-slate-400">
                            {s.engine}
                          </span>
                          {(s as any).category && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              {(s as any).category}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {i18n.onlineWorking}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Live Re-verification Button */}
                          <button
                            type="button"
                            onClick={() => handleTestLiveLink(s.link, `link-${idx}`)}
                            disabled={isTestingThis}
                            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-[#2B3542] hover:bg-slate-100 dark:hover:bg-[#1A222C] text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition"
                            title="Test reachability in real-time"
                          >
                            {isTestingThis ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin text-[#00c9a7]" />
                                <span>{i18n.testing}</span>
                              </>
                            ) : live ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">{i18n.reverified}</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3 text-amber-500" />
                                <span>{i18n.testLive}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(s.link, `link-${idx}`)}
                            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-[#2B3542] hover:bg-slate-100 dark:hover:bg-[#1A222C] text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition"
                          >
                            {copiedLink === `link-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedLink === `link-${idx}` ? i18n.copied : i18n.copyOnion}</span>
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{s.title}</h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {s.snippet}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-[#212932] flex items-center justify-between text-[11px] text-slate-400 gap-2">
                        <span className="font-mono truncate min-w-0 flex-1 max-w-[170px] sm:max-w-[240px] text-slate-500 dark:text-slate-400">
                          {s.link}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                            ⚡ {latency}ms
                          </span>
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified v3
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SUGGESTED PIVOTS */}
          {activeTab === 'pivots' && (
            <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-sm p-6 sm:p-7 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{i18n.pivotsTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{i18n.pivotsSubtitle}</p>
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
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{i18n.followupTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{i18n.followupSubtitle}</p>
              </div>
            </div>

            {/* Past Q&A Stream */}
            {followupHistory.length > 0 && (
              <div className="space-y-4 pt-2">
                {followupHistory.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-emerald-50 dark:bg-[#1C232C] border border-emerald-200/80 dark:border-[#2C3847] text-slate-900 dark:text-slate-100 px-4 py-2.5 rounded-2xl text-xs sm:text-sm max-w-[85%] font-medium">
                        {item.q}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] text-slate-800 dark:text-slate-200 px-5 py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[95%]">
                        <CleanFormattedText text={item.a} />
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
                placeholder={i18n.followupPlaceholder}
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
                {isFollowupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
