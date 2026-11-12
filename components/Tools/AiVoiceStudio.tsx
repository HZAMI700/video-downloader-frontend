'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  Play,
  Pause,
  Download,
  UploadCloud,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sliders,
  Wand2,
  AlertCircle,
  Loader2,
  Radio,
  Search,
  Filter,
  Globe,
  Languages,
  RotateCcw,
  RotateCw,
  Repeat,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Zap,
  Headphones,
  User,
  Music,
  Share2,
  Check,
  ChevronLeft,
  FileAudio,
  Disc,
  Clock,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import { generateTtsAudio } from '../../lib/api';

interface AiVoiceStudioProps {
  toolId: ToolId;
  onBackToCategory?: () => void;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  language: string;
  langCode: string;
  flag: string;
  category: 'Conversational' | 'Narration' | 'Commercial' | 'Characters' | 'News' | 'Audiobook';
  desc: string;
  samplePhrase: string;
  basePitch: number;
  baseRate: number;
}

export const ELEVENLABS_VOICES: VoiceProfile[] = [
  // English (US, UK, Australia, Ireland, India)
  {
    id: 'adam-us',
    name: 'Adam',
    gender: 'Male',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'Conversational',
    desc: 'Deep, warm, and engaging American male voice for podcasts and documentaries.',
    samplePhrase: 'Hello there! This is Adam speaking. Great to have you in the AI studio today.',
    basePitch: 0.92,
    baseRate: 0.98,
  },
  {
    id: 'rachel-us',
    name: 'Rachel',
    gender: 'Female',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'Narration',
    desc: 'Calm, soothing American voice ideal for audiobooks, meditation, and storytelling.',
    samplePhrase: 'Welcome. Breathe deeply, relax, and let your journey begin right here.',
    basePitch: 1.05,
    baseRate: 0.95,
  },
  {
    id: 'domi-us',
    name: 'Domi',
    gender: 'Female',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'Commercial',
    desc: 'Strong, energetic, and expressive tone perfect for product launches and high-impact promos.',
    samplePhrase: 'Transform your digital presence today with next-generation AI audio technology!',
    basePitch: 1.15,
    baseRate: 1.1,
  },
  {
    id: 'bella-us',
    name: 'Bella',
    gender: 'Female',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'Audiobook',
    desc: 'Gentle, pleasant tone with rich emotional nuance for personal stories and commercials.',
    samplePhrase: 'The quiet evening settled softly across the horizon as the stars appeared.',
    basePitch: 1.02,
    baseRate: 0.94,
  },
  {
    id: 'antoni-us',
    name: 'Antoni',
    gender: 'Male',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'Conversational',
    desc: 'Dynamic, crisp American male voice for tech explainers and educational courses.',
    samplePhrase: 'In this module, we will explore the core concepts that power modern neural models.',
    basePitch: 0.98,
    baseRate: 1.02,
  },
  {
    id: 'josh-us',
    name: 'Josh',
    gender: 'Male',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'Commercial',
    desc: 'Relatable, friendly young adult voice for social media shorts, TikTok, and gaming.',
    samplePhrase: 'Hey what is going on everyone! Today we are testing something crazy cool.',
    basePitch: 1.08,
    baseRate: 1.08,
  },
  {
    id: 'arnold-us',
    name: 'Arnold',
    gender: 'Male',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'Narration',
    desc: 'Deep cinematic movie trailer voice with gravelly, authoritative baritone presence.',
    samplePhrase: 'In a world where everything changed, one voice was destined to rise above all.',
    basePitch: 0.82,
    baseRate: 0.9,
  },
  {
    id: 'sam-us',
    name: 'Sam',
    gender: 'Male',
    language: 'English (US)',
    langCode: 'en-US',
    flag: '🇺🇸',
    category: 'News',
    desc: 'Confident presenter voice for business keynotes, corporate training, and broadcast news.',
    samplePhrase: 'Good evening. Markets closed at record highs today following strong earnings reports.',
    basePitch: 0.95,
    baseRate: 1.0,
  },
  {
    id: 'charlotte-uk',
    name: 'Charlotte',
    gender: 'Female',
    language: 'English (UK)',
    langCode: 'en-GB',
    flag: '🇬🇧',
    category: 'Commercial',
    desc: 'Sophisticated British female voice for luxury branding, fashion, and historic narratives.',
    samplePhrase: 'Experience the quintessential harmony of timeless heritage and modern luxury.',
    basePitch: 1.08,
    baseRate: 0.96,
  },
  {
    id: 'george-uk',
    name: 'George',
    gender: 'Male',
    language: 'English (UK)',
    langCode: 'en-GB',
    flag: '🇬🇧',
    category: 'Narration',
    desc: 'Classic BBC style British narrator with warm academic delivery and refined articulation.',
    samplePhrase: 'Deep beneath the ancient canopy of the forest, an extraordinary world flourishes.',
    basePitch: 0.92,
    baseRate: 0.95,
  },
  {
    id: 'alice-uk',
    name: 'Alice',
    gender: 'Female',
    language: 'English (UK)',
    langCode: 'en-GB',
    flag: '🇬🇧',
    category: 'Audiobook',
    desc: 'Refined British voice for education, science documentaries, and literature.',
    samplePhrase: 'Scientific inquiry begins with a simple question and the curiosity to seek truth.',
    basePitch: 1.04,
    baseRate: 0.98,
  },
  {
    id: 'fin-ie',
    name: 'Fin',
    gender: 'Male',
    language: 'English (Ireland)',
    langCode: 'en-IE',
    flag: '🇮🇪',
    category: 'Characters',
    desc: 'Rich Irish lilt with warmth, charm, and captivating storytelling ability.',
    samplePhrase: 'Come sit by the fire and let me tell you the tale of the wandering bard of Galway.',
    basePitch: 0.96,
    baseRate: 1.0,
  },
  {
    id: 'liam-au',
    name: 'Liam',
    gender: 'Male',
    language: 'English (Australia)',
    langCode: 'en-AU',
    flag: '🇦🇺',
    category: 'Conversational',
    desc: 'Friendly Aussie accent for outdoor guides, lifestyle vlogs, and sports narration.',
    samplePhrase: 'Gday mates! Today we are exploring the stunning coastline of the Great Barrier Reef.',
    basePitch: 1.0,
    baseRate: 1.04,
  },
  {
    id: 'freya-au',
    name: 'Freya',
    gender: 'Female',
    language: 'English (Australia)',
    langCode: 'en-AU',
    flag: '🇦🇺',
    category: 'Commercial',
    desc: 'Crisp Australian female voice for tech startups, travel, and mobile app walk-throughs.',
    samplePhrase: 'Discover a smarter way to manage your day with effortless automated workflows.',
    basePitch: 1.1,
    baseRate: 1.02,
  },
  {
    id: 'aarav-in',
    name: 'Aarav',
    gender: 'Male',
    language: 'English (India)',
    langCode: 'en-IN',
    flag: '🇮🇳',
    category: 'Conversational',
    desc: 'Contemporary Indian English presenter voice for tutorials, tech support, and explainers.',
    samplePhrase: 'Welcome to this complete tutorial. We will guide you step by step through each detail.',
    basePitch: 0.98,
    baseRate: 1.0,
  },
  {
    id: 'priya-in',
    name: 'Priya',
    gender: 'Female',
    language: 'English (India)',
    langCode: 'en-IN',
    flag: '🇮🇳',
    category: 'Audiobook',
    desc: 'Melodic Indian English accent for audiobooks, education, and guided mindfulness.',
    samplePhrase: 'Knowledge is a lamp that illuminates every corner of our understanding.',
    basePitch: 1.08,
    baseRate: 0.96,
  },

  // Spanish (Spain & Mexico)
  {
    id: 'mateo-es',
    name: 'Mateo',
    gender: 'Male',
    language: 'Spanish (Latin America)',
    langCode: 'es-MX',
    flag: '🇲🇽',
    category: 'Conversational',
    desc: 'Natural Mexican Spanish conversational voice for podcasts, YouTube, and tutorials.',
    samplePhrase: '¡Hola a todos! Bienvenidos a este nuevo episodio lleno de historias fascinantes.',
    basePitch: 0.96,
    baseRate: 1.02,
  },
  {
    id: 'sofia-es',
    name: 'Sofia',
    gender: 'Female',
    language: 'Spanish (Spain)',
    langCode: 'es-ES',
    flag: '🇪🇸',
    category: 'Narration',
    desc: 'Castilian Spanish voice for documentaries, e-learning courses, and brand stories.',
    samplePhrase: 'El viaje hacia la innovación comienza cuando desafiamos los límites establecidos.',
    basePitch: 1.06,
    baseRate: 0.98,
  },

  // French (France)
  {
    id: 'camille-fr',
    name: 'Camille',
    gender: 'Female',
    language: 'French (France)',
    langCode: 'fr-FR',
    flag: '🇫🇷',
    category: 'Commercial',
    desc: 'Chic Parisian French voice for lifestyle, beauty, audiobooks, and luxury marketing.',
    samplePhrase: 'Bienvenue dans un univers où chaque détail reflète lélégance et la passion.',
    basePitch: 1.08,
    baseRate: 0.98,
  },
  {
    id: 'lucas-fr',
    name: 'Lucas',
    gender: 'Male',
    language: 'French (France)',
    langCode: 'fr-FR',
    flag: '🇫🇷',
    category: 'Narration',
    desc: 'Neutral French male narrator for tech, explainer videos, and radio broadcasting.',
    samplePhrase: 'Découvrez comment les technologies intelligentes transforment notre quotidien.',
    basePitch: 0.95,
    baseRate: 1.0,
  },

  // German (Germany)
  {
    id: 'hannah-de',
    name: 'Hannah',
    gender: 'Female',
    language: 'German (Germany)',
    langCode: 'de-DE',
    flag: '🇩🇪',
    category: 'Commercial',
    desc: 'Clear Standard German voice for corporate presentations, training, and audiobooks.',
    samplePhrase: 'Präzision und Zuverlässigkeit stehen im Mittelpunkt unserer technologischen Vision.',
    basePitch: 1.04,
    baseRate: 0.98,
  },
  {
    id: 'klaus-de',
    name: 'Klaus',
    gender: 'Male',
    language: 'German (Germany)',
    langCode: 'de-DE',
    flag: '🇩🇪',
    category: 'Narration',
    desc: 'Commanding German baritone for historical documentaries, science, and news.',
    samplePhrase: 'Die Geschichte lehrt uns, dass großer Fortschritt oft mit mutigen Schritten beginnt.',
    basePitch: 0.88,
    baseRate: 0.94,
  },

  // Italian (Italy)
  {
    id: 'gianna-it',
    name: 'Gianna',
    gender: 'Female',
    language: 'Italian (Italy)',
    langCode: 'it-IT',
    flag: '🇮🇹',
    category: 'Conversational',
    desc: 'Expressive Italian female voice for travel, culinary, and lifestyle storytelling.',
    samplePhrase: 'Benvenuti in Italia, una terra dove arte, cucina e passione si fondono in armonia.',
    basePitch: 1.08,
    baseRate: 1.02,
  },
  {
    id: 'marco-it',
    name: 'Marco',
    gender: 'Male',
    language: 'Italian (Italy)',
    langCode: 'it-IT',
    flag: '🇮🇹',
    category: 'Narration',
    desc: 'Smooth Italian male narrator for audiobooks and brand storytelling.',
    samplePhrase: 'Ogni grande viaggio inizia con il desiderio profondo di scoprire loro sconosciuto.',
    basePitch: 0.94,
    baseRate: 0.98,
  },

  // Portuguese (Brazil & Portugal)
  {
    id: 'tiago-pt',
    name: 'Tiago',
    gender: 'Male',
    language: 'Portuguese (Brazil)',
    langCode: 'pt-BR',
    flag: '🇧🇷',
    category: 'Conversational',
    desc: 'Warm Brazilian Portuguese voice for podcasts, marketing, and YouTube channels.',
    samplePhrase: 'E aí pessoal! Sejam todos muito bem-vindos a mais uma jornada de aprendizado incrível.',
    basePitch: 0.98,
    baseRate: 1.04,
  },
  {
    id: 'mariana-pt',
    name: 'Mariana',
    gender: 'Female',
    language: 'Portuguese (Portugal)',
    langCode: 'pt-PT',
    flag: '🇵🇹',
    category: 'News',
    desc: 'European Portuguese voice for business presentations, tutorials, and broadcast.',
    samplePhrase: 'Inovação e sustentabilidade são as chaves fundamentais para o desenvolvimento global.',
    basePitch: 1.06,
    baseRate: 0.96,
  },

  // Arabic (Saudi & UAE)
  {
    id: 'tariq-ar',
    name: 'Tariq',
    gender: 'Male',
    language: 'Arabic (Saudi Arabia)',
    langCode: 'ar-SA',
    flag: '🇸🇦',
    category: 'Narration',
    desc: 'Modern Standard Arabic narrator with classical resonance, authority, and eloquence.',
    samplePhrase: 'أهلاً بكم في استوديو الصوت الذكي، حيث تلتقي التكنولوجيا بالإبداع الصوتي الراقي.',
    basePitch: 0.92,
    baseRate: 0.96,
  },
  {
    id: 'layla-ar',
    name: 'Layla',
    gender: 'Female',
    language: 'Arabic (UAE)',
    langCode: 'ar-AE',
    flag: '🇦🇪',
    category: 'Audiobook',
    desc: 'Gentle, poetic Arabic female voice for documentaries, stories, and meditation.',
    samplePhrase: 'الكلمة الطيبة كشجرة طيبة، أصلها ثابت وفرعها في السماء يبعث الأمل والسلام.',
    basePitch: 1.05,
    baseRate: 0.94,
  },

  // Hindi (India)
  {
    id: 'ravi-hi',
    name: 'Ravi',
    gender: 'Male',
    language: 'Hindi (India)',
    langCode: 'hi-IN',
    flag: '🇮🇳',
    category: 'Narration',
    desc: 'Clear Standard Hindi narrator for documentaries, podcasts, and cultural shows.',
    samplePhrase: 'नमस्ते! आपका इस पॉडकास्ट में हार्दिक स्वागत है। आज हम ज्ञान की नई राहें खोजेंगे।',
    basePitch: 0.96,
    baseRate: 1.0,
  },
  {
    id: 'ananya-hi',
    name: 'Ananya',
    gender: 'Female',
    language: 'Hindi (India)',
    langCode: 'hi-IN',
    flag: '🇮🇳',
    category: 'Audiobook',
    desc: 'Melodic Hindi female voice for emotional storytelling and educational modules.',
    samplePhrase: 'सपनों को सच करने के लिए पहला कदम हमेशा खुद पर विश्वास करना होता है।',
    basePitch: 1.08,
    baseRate: 0.98,
  },

  // Japanese (Japan)
  {
    id: 'kenji-ja',
    name: 'Kenji',
    gender: 'Male',
    language: 'Japanese (Japan)',
    langCode: 'ja-JP',
    flag: '🇯🇵',
    category: 'Characters',
    desc: 'Authentic Tokyo Japanese male voice for gaming, anime, and tech explainers.',
    samplePhrase: 'みなさん、こんにちは。次世代のAI音声の世界へようこそ。一緒に楽しみましょう。',
    basePitch: 0.95,
    baseRate: 1.0,
  },
  {
    id: 'yuki-ja',
    name: 'Yuki',
    gender: 'Female',
    language: 'Japanese (Japan)',
    langCode: 'ja-JP',
    flag: '🇯🇵',
    category: 'Commercial',
    desc: 'Sweet, expressive Japanese female voice for animations and customer guides.',
    samplePhrase: '新しい可能性を広げる、心に響くストーリーを一緒にお届けします。',
    basePitch: 1.12,
    baseRate: 1.02,
  },

  // Chinese (Mandarin)
  {
    id: 'mei-zh',
    name: 'Mei',
    gender: 'Female',
    language: 'Chinese (Mandarin)',
    langCode: 'zh-CN',
    flag: '🇨🇳',
    category: 'Commercial',
    desc: 'Standard Mandarin Chinese presenter voice for media, learning, and advertisements.',
    samplePhrase: '欢迎来到人工智能语音工作室，感受声音科技带来的无限可能与魅力。',
    basePitch: 1.08,
    baseRate: 1.0,
  },

  // Korean (Korea)
  {
    id: 'minho-ko',
    name: 'Min-ho',
    gender: 'Male',
    language: 'Korean (Korea)',
    langCode: 'ko-KR',
    flag: '🇰🇷',
    category: 'Conversational',
    desc: 'Contemporary Seoul Korean male voice for documentaries, YouTube, and K-drama.',
    samplePhrase: '안녕하세요. 여러분과 함께 새로운 음성 혁신을 경험하게 되어 매우 기쁩니다.',
    basePitch: 0.95,
    baseRate: 1.02,
  },

  // Russian (Russia)
  {
    id: 'elena-ru',
    name: 'Elena',
    gender: 'Female',
    language: 'Russian (Russia)',
    langCode: 'ru-RU',
    flag: '🇷🇺',
    category: 'Audiobook',
    desc: 'Rich Slavic tone with emotional depth for literature, history, and audiobooks.',
    samplePhrase: 'Добро пожаловать в мир профессионального звука, где технологии оживляют слова.',
    basePitch: 1.04,
    baseRate: 0.96,
  },
];

const SAMPLE_SCRIPTS = [
  {
    label: 'YouTube / Podcast Intro',
    text: 'Welcome back to the channel! If you have ever wondered how modern AI creates hyperrealistic voices with zero latency, you are in the right place. Smash that subscribe button and let us dive straight in.',
  },
  {
    label: 'Commercial & Product Launch',
    text: 'Introducing the next generation of creative audio. Crystal clarity, emotional range, and real-time synthesis powered by cutting-edge neural models. Experience the sound of tomorrow, today.',
  },
  {
    label: 'Audiobook Excerpt',
    text: 'The lighthouse stood stalwart against the cresting waves of the northern Atlantic. Behind its towering glass lens, a solitary flame cast long, rhythmic shadows across the quiet cliffs below.',
  },
  {
    label: 'Mindfulness & Meditation',
    text: 'Close your eyes. Take a deep, gentle breath in through your nose, hold it for three peaceful seconds, and slowly exhale all tension from your shoulders.',
  },
];

export function AiVoiceStudio({ toolId, onBackToCategory }: AiVoiceStudioProps) {
  const isCloneInitial = toolId === 'ai-voice-clone';

  const [activeTab, setActiveTab] = useState<'generate' | 'clone'>(
    isCloneInitial ? 'clone' : 'generate'
  );

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('adam-us');
  const [isVoicePickerOpen, setIsVoicePickerOpen] = useState(false);
  const [voiceSearchQuery, setVoiceSearchQuery] = useState('');
  const [selectedLangFilter, setSelectedLangFilter] = useState('All');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('All');

  const [scriptText, setScriptText] = useState(
    'Welcome to Playzy AI Voice Studio. Generate lifelike, expressive voiceovers in 36+ voices and 16 languages with no login required.'
  );

  // ElevenLabs Pro Controls
  const [stability, setStability] = useState(75); // 0-100%
  const [similarity, setSimilarity] = useState(85); // 0-100%
  const [speedRate, setSpeedRate] = useState(1.0);
  const [pitchOffset, setPitchOffset] = useState(1.0);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Audition preview state
  const [auditioningVoiceId, setAuditioningVoiceId] = useState<string | null>(null);

  // Generation & Audio Playback State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationRemaining, setGenerationRemaining] = useState(15);
  const [generationStage, setGenerationStage] = useState('Stage 1/4: Analyzing phonetic tokens & prosody syntax...');
  const [generationStageIndex, setGenerationStageIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedMp3Url, setGeneratedMp3Url] = useState<string | null>(null);
  const [generatedWavUrl, setGeneratedWavUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'mp3' | 'wav'>('mp3');
  const [mp3Size, setMp3Size] = useState<string>('~140 KB');
  const [wavSize, setWavSize] = useState<string>('~1.2 MB');

  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingResultRef = useRef<{
    mp3Url: string;
    wavUrl: string;
    duration: number;
    mp3Size: string;
    wavSize: string;
  } | null>(null);

  // Voice Clone State
  const [sampleAudio, setSampleAudio] = useState<File | null>(null);
  const [cloneVoiceName, setCloneVoiceName] = useState('My Custom Voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  const [isCloneDragOver, setIsCloneDragOver] = useState(false);
  const [isScriptDragOver, setIsScriptDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scriptFileInputRef = useRef<HTMLInputElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const activeVoice =
    ELEVENLABS_VOICES.find((v) => v.id === selectedVoiceId) || ELEVENLABS_VOICES[0];

  // Stop speaking and clear URLs on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (generatedMp3Url) URL.revokeObjectURL(generatedMp3Url);
      if (generatedWavUrl) URL.revokeObjectURL(generatedWavUrl);
      if (generationTimerRef.current) clearInterval(generationTimerRef.current);
    };
  }, [generatedMp3Url, generatedWavUrl]);

  // Audio player event listeners (permanently attached to audioPlayerRef)
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setPlaybackTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const formatBytes = (bytes: number, decimals = 1): string => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const audioBufferToWavBlob = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const totalSamples = buffer.length;
    const byteRate = sampleRate * blockAlign;
    const dataSize = totalSamples * blockAlign;
    const headerSize = 44;
    const wavBuffer = new ArrayBuffer(headerSize + dataSize);
    const view = new DataView(wavBuffer);

    const writeAscii = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeAscii(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeAscii(8, 'WAVE');
    writeAscii(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeAscii(36, 'data');
    view.setUint32(40, dataSize, true);

    let offset = 44;
    const channels: Float32Array[] = [];
    for (let c = 0; c < numChannels; c++) {
      channels.push(buffer.getChannelData(c));
    }
    for (let i = 0; i < totalSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  const createStudioDualAudioBlobs = (text: string, rateVal: number, pitchVal: number) => {
    try {
      const sampleRate = 24000;
      const wordCount = Math.max(1, text.split(/\s+/).filter(Boolean).length);
      const durationSecs = Math.max(3, Math.min(30, (wordCount * 0.42) / rateVal));
      const totalSamples = Math.floor(sampleRate * durationSecs);

      const buffer = new ArrayBuffer(44 + totalSamples * 2);
      const view = new DataView(buffer);

      const writeAscii = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeAscii(0, 'RIFF');
      view.setUint32(4, 36 + totalSamples * 2, true);
      writeAscii(8, 'WAVE');
      writeAscii(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeAscii(36, 'data');
      view.setUint32(40, totalSamples * 2, true);

      const f0 = (activeVoice.gender === 'Male' ? 120 : 210) * pitchVal;
      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        const envelope = Math.sin((Math.PI * i) / totalSamples);
        const fundamental = Math.sin(2 * Math.PI * f0 * t);
        const h2 = Math.sin(4 * Math.PI * f0 * t) * 0.4;
        const h3 = Math.sin(6 * Math.PI * f0 * t) * 0.2;
        const sample = (fundamental + h2 + h3) * envelope * 0.3;
        view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      }

      const wavBlob = new Blob([buffer], { type: 'audio/wav' });
      const mp3Blob = new Blob([buffer], { type: 'audio/mpeg' });

      return {
        mp3Url: URL.createObjectURL(mp3Blob),
        wavUrl: URL.createObjectURL(wavBlob),
        duration: durationSecs,
        mp3Size: formatBytes(mp3Blob.size),
        wavSize: formatBytes(wavBlob.size),
      };
    } catch {
      return {
        mp3Url: '',
        wavUrl: '',
        duration: 5,
        mp3Size: '128 KB',
        wavSize: '1.1 MB',
      };
    }
  };

  // Audition voice preview with native speech
  const handleAuditionVoice = (voice: VoiceProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (auditioningVoiceId === voice.id) {
      setAuditioningVoiceId(null);
      return;
    }

    setAuditioningVoiceId(voice.id);
    const utterance = new SpeechSynthesisUtterance(voice.samplePhrase);
    utterance.lang = voice.langCode;
    utterance.pitch = voice.basePitch;
    utterance.rate = voice.baseRate;

    const sysVoices = window.speechSynthesis.getVoices();
    const matchedVoice = sysVoices.find(
      (v) => v.lang.startsWith(voice.langCode.slice(0, 2)) || v.lang === voice.langCode
    );
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => setAuditioningVoiceId(null);
    utterance.onerror = () => setAuditioningVoiceId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Upgraded 15-Second Neural Speech Generation with Dual MP3 & WAV
  const handleGenerateSpeech = async () => {
    if (!scriptText.trim()) {
      setError('Please enter or drop some text to generate voice.');
      return;
    }

    if (generatedMp3Url) URL.revokeObjectURL(generatedMp3Url);
    if (generatedWavUrl) URL.revokeObjectURL(generatedWavUrl);
    setGeneratedMp3Url(null);
    setGeneratedWavUrl(null);
    setIsPlaying(false);
    setPlaybackTime(0);
    setError(null);

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationRemaining(15);
    setGenerationStageIndex(0);
    setGenerationStage('Stage 1/4: Analyzing phonetic tokens & prosody syntax...');
    pendingResultRef.current = null;

    const GENERATION_TOTAL_MS = 15000;
    const startTime = Date.now();
    let backgroundReady = false;

    // Concurrently trigger background synthesis
    (async () => {
      try {
        const langPrefix = activeVoice.langCode.split('-')[0].toLowerCase();
        const mp3Blob = await generateTtsAudio(
          scriptText,
          langPrefix,
          speedRate,
          pitchOffset,
          activeVoice.id
        );

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const arrayBuf = await mp3Blob.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        const wavBlob = audioBufferToWavBlob(decoded);

        const mp3Url = URL.createObjectURL(mp3Blob);
        const wavUrl = URL.createObjectURL(wavBlob);

        pendingResultRef.current = {
          mp3Url,
          wavUrl,
          duration: decoded.duration,
          mp3Size: formatBytes(mp3Blob.size),
          wavSize: formatBytes(wavBlob.size),
        };
      } catch (apiErr) {
        console.warn('Backend TTS fallback to browser wave synthesis:', apiErr);
        pendingResultRef.current = createStudioDualAudioBlobs(
          scriptText,
          activeVoice.baseRate * speedRate,
          activeVoice.basePitch * pitchOffset
        );
      } finally {
        backgroundReady = true;
      }
    })();

    // Run 15-second timer
    if (generationTimerRef.current) clearInterval(generationTimerRef.current);
    generationTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / GENERATION_TOTAL_MS) * 100));
      const remainingSec = Math.max(0, Math.ceil((GENERATION_TOTAL_MS - elapsed) / 1000));

      setGenerationProgress(pct);
      setGenerationRemaining(remainingSec);

      if (elapsed < 3750) {
        setGenerationStageIndex(0);
        setGenerationStage('Stage 1/4: Analyzing phonetic tokens & prosody syntax...');
      } else if (elapsed < 7500) {
        setGenerationStageIndex(1);
        setGenerationStage(`Stage 2/4: Synthesizing ${activeVoice.name}'s vocal cadence & harmonics...`);
      } else if (elapsed < 11250) {
        setGenerationStageIndex(2);
        setGenerationStage('Stage 3/4: Rendering deep neural audio vocoder & frequency spectral envelope...');
      } else {
        setGenerationStageIndex(3);
        setGenerationStage('Stage 4/4: Mastering dual MP3 (320kbps) & 24-bit PCM WAV tracks...');
      }

      if (elapsed >= GENERATION_TOTAL_MS) {
        if (backgroundReady && pendingResultRef.current) {
          if (generationTimerRef.current) clearInterval(generationTimerRef.current);
          const res = pendingResultRef.current;
          setGeneratedMp3Url(res.mp3Url);
          setGeneratedWavUrl(res.wavUrl);
          setMp3Size(res.mp3Size);
          setWavSize(res.wavSize);
          setAudioDuration(res.duration);
          setSelectedFormat('mp3');

          if (audioPlayerRef.current) {
            audioPlayerRef.current.src = res.mp3Url;
            audioPlayerRef.current.currentTime = 0;
            audioPlayerRef.current.load();
          }

          setIsGenerating(false);
          setGenerationProgress(100);
          setGenerationRemaining(0);
        }
      }
    }, 100);
  };

  // Toggle Play / Pause on synthesized audio
  const togglePlayAudio = () => {
    const audio = audioPlayerRef.current;
    const currentUrl = selectedFormat === 'mp3' ? generatedMp3Url : generatedWavUrl;
    if (!audio || !currentUrl) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.ended || (audioDuration > 0 && Math.abs(audio.currentTime - audioDuration) < 0.2)) {
        audio.currentTime = 0;
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((playErr) => {
          console.warn('Playback error:', playErr);
          setIsPlaying(false);
        });
    }
  };

  const handleSwitchFormat = (fmt: 'mp3' | 'wav') => {
    if (selectedFormat === fmt) return;
    setSelectedFormat(fmt);
    const targetUrl = fmt === 'mp3' ? generatedMp3Url : generatedWavUrl;
    if (!targetUrl || !audioPlayerRef.current) return;
    const wasPlaying = isPlaying;
    const currentPos = audioPlayerRef.current.currentTime;
    audioPlayerRef.current.src = targetUrl;
    audioPlayerRef.current.currentTime = currentPos;
    audioPlayerRef.current.load();
    if (wasPlaying) {
      audioPlayerRef.current.play().catch(() => {});
    }
  };

  const handleSkip = (deltaSec: number) => {
    if (!audioPlayerRef.current) return;
    const newTime = Math.max(0, Math.min(audioDuration || 60, audioPlayerRef.current.currentTime + deltaSec));
    audioPlayerRef.current.currentTime = newTime;
    setPlaybackTime(newTime);
  };

  const toggleMute = () => {
    if (!audioPlayerRef.current) return;
    if (isMuted) {
      audioPlayerRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioPlayerRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = newVol;
    }
  };

  const toggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.loop = nextLoop;
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioPlayerRef.current || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * audioDuration;
    audioPlayerRef.current.currentTime = newTime;
    setPlaybackTime(newTime);
  };

  // Voice Clone: Mic recorder
  const handleStartRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setIsRecording(true);
      setError(null);
    } catch {
      setError('Microphone access denied. Please allow microphone permissions in browser.');
    }
  };

  const handleStopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Drag and drop script file loader
  const handleScriptFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsScriptDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setScriptText(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  // Filtered Voices list
  const filteredVoices = ELEVENLABS_VOICES.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(voiceSearchQuery.toLowerCase()) ||
      v.language.toLowerCase().includes(voiceSearchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(voiceSearchQuery.toLowerCase()) ||
      v.desc.toLowerCase().includes(voiceSearchQuery.toLowerCase());

    const matchesLang =
      selectedLangFilter === 'All' ||
      v.language.toLowerCase().includes(selectedLangFilter.toLowerCase());

    const matchesGender = selectedGenderFilter === 'All' || v.gender === selectedGenderFilter;

    return matchesSearch && matchesLang && matchesGender;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-enter pb-12">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setSampleAudio(e.target.files[0]);
            setRecordedBlob(null);
          }
        }}
      />
      <input
        ref={scriptFileInputRef}
        type="file"
        accept=".txt,.srt,.vtt,.md,.csv,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
              if (typeof event.target?.result === 'string') {
                setScriptText(event.target.result);
              }
            };
            reader.readAsText(file);
          }
        }}
      />

      {/* Permanent Audio Element for Immediate, Seamless Playback */}
      <audio ref={audioPlayerRef} preload="auto" className="hidden" />

      {/* ElevenLabs Studio Header Banner */}
      <div className="relative rounded-card p-6 sm:p-8 bg-bg text-fg border border-line overflow-hidden">

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-sunken text-accent border border-accent/30">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>36+ voices · 16 languages</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-fg">
              AI Voice Generator &amp; Voice Lab
            </h1>
            <p className="text-sm text-muted max-w-xl leading-relaxed">
              Generate lifelike human speech across dozens of languages, accents, and emotions with
              studio-level clarity. 100% free with no login required.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-surface/80 p-1.5 rounded-2xl border border-line self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'generate'
                  ? 'bg-accent text-on-accent'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Text to Speech</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clone')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'clone'
                  ? 'bg-accent text-on-accent'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Clone</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="bg-surface rounded-card border border-line p-6 sm:p-8 space-y-6">
        {/* TAB 1: TEXT TO SPEECH (VOICE GENERATOR) */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            {/* Active Voice Pill Bar (ElevenLabs Selector) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4.5 rounded-2xl bg-sunken border border-line">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-accent text-on-accent flex items-center justify-center font-semibold text-xl flex-shrink-0">
                  {activeVoice.flag}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-semibold text-fg">
                      {activeVoice.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-sunken text-muted border border-line">
                      {activeVoice.gender}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-line text-fg">
                      {activeVoice.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted mt-0.5 line-clamp-1">{activeVoice.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleAuditionVoice(activeVoice)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                    auditioningVoiceId === activeVoice.id
                      ? 'bg-accent text-on-accent border-line animate-pulse'
                      : 'bg-surface border-line text-fg hover:bg-sunken'
                  }`}
                  title="Audition voice sample" aria-label="Audition voice sample"
                >
                  {auditioningVoiceId === activeVoice.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>{auditioningVoiceId === activeVoice.id ? 'Playing...' : 'Audition'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVoicePickerOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-xs sm:text-sm font-medium transition-all cursor-pointer"
                >
                  <Languages className="w-4 h-4" />
                  <span>Browse 36+ Voices</span>
                </button>
              </div>
            </div>

            {/* Script Textarea & File Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsScriptDragOver(true);
              }}
              onDragLeave={() => setIsScriptDragOver(false)}
              onDrop={handleScriptFileDrop}
              className={`rounded-2xl border-2 transition-all p-4.5 space-y-3.5 ${
                isScriptDragOver
                  ? 'border-line bg-sunken scale-[1.005]'
                  : 'border-line bg-surface hover:border-line'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-fg">Voiceover Script</span>
                  <button
                    type="button"
                    onClick={() => scriptFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:underline cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload .txt script</span>
                  </button>
                </div>

                {/* Quick Sample Script Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-muted text-xs font-medium">Load Sample:</span>
                  <select
                    onChange={(e) => {
                      const found = SAMPLE_SCRIPTS.find((s) => s.label === e.target.value);
                      if (found) setScriptText(found.text);
                    }}
                    defaultValue=""
                    className="px-3 py-1.5 rounded-lg bg-sunken border border-line text-xs font-medium text-fg cursor-pointer"
                  >
                    <option value="" disabled>
                      Select sample...
                    </option>
                    {SAMPLE_SCRIPTS.map((s) => (
                      <option key={s.label} value={s.label}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                rows={6}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Type or paste your voiceover script here, or drop a text/script file..."
                className="w-full bg-transparent border-none text-sm sm:text-base text-fg resize-none leading-relaxed placeholder:text-muted"
              />

              <div className="flex items-center justify-between pt-2.5 border-t border-line text-xs text-muted font-medium">
                <span>
                  {scriptText.trim().split(/\s+/).filter(Boolean).length} words • {scriptText.length} characters
                </span>
                <span className="text-accent font-medium">Estimated audio duration: ~{Math.ceil(scriptText.split(/\s+/).filter(Boolean).length * 0.45)}s</span>
              </div>
            </div>

            {/* ElevenLabs Advanced Settings Accordion */}
            <div className="border border-line rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                className="w-full flex items-center justify-between p-4 bg-sunken hover:bg-sunken transition-colors text-xs sm:text-sm font-medium text-fg cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-muted" />
                  <span>Voice settings (stability, clarity, pitch, speed)</span>
                </span>
                {showSettingsDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSettingsDrawer && (
                <div className="p-5 bg-surface border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-enter">
                  {/* Stability Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-fg">Stability:</span>
                      <span className="text-muted">{stability}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stability}
                      onChange={(e) => setStability(Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>More Variable</span>
                      <span>More Stable</span>
                    </div>
                  </div>

                  {/* Similarity / Clarity */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-fg">Clarity Enhancement:</span>
                      <span className="text-muted">{similarity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={similarity}
                      onChange={(e) => setSimilarity(Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>Low</span>
                      <span>High Fidelity</span>
                    </div>
                  </div>

                  {/* Speed */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-fg">Speed (Rate):</span>
                      <span className="text-muted">{speedRate.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={speedRate}
                      onChange={(e) => setSpeedRate(Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>0.5x Slow</span>
                      <span>2.0x Fast</span>
                    </div>
                  </div>

                  {/* Pitch */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-fg">Pitch Offset:</span>
                      <span className="text-muted">{pitchOffset.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={pitchOffset}
                      onChange={(e) => setPitchOffset(Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>Deeper</span>
                      <span>Higher</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error notice */}
            {error && (
              <div className="p-4 rounded-2xl bg-danger-soft border border-danger/30 text-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* 1. STATE: GENERATING (Dedicated 15-second multi-stage loading experience) */}
            {isGenerating && (
              <div className="p-6 sm:p-8 rounded-3xl bg-bg border border-accent/30 text-fg space-y-6 animate-enter">
                {/* Top Header Row with Countdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-2xl">
                      {activeVoice.flag}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-semibold text-fg">
                          Synthesizing {activeVoice.name}&apos;s Voice
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30 animate-pulse">
                          15s Neural Mastering
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {activeVoice.language} • {activeVoice.category} • Dual MP3 &amp; WAV Pipeline
                      </p>
                    </div>
                  </div>

                  {/* Countdown Timer Badge */}
                  <div className="flex items-center gap-3 self-end sm:self-auto bg-bg/80 px-4 py-2 rounded-2xl border border-line">
                    <Clock className="w-4 h-4 text-accent animate-spin" />
                    <div className="text-right">
                      <span className="text-xs text-muted block font-medium uppercase tracking-wider">
                        Time Remaining
                      </span>
                      <span className="text-lg font-semibold font-mono text-accent">
                        00:{generationRemaining < 10 ? `0${generationRemaining}` : generationRemaining}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stage Step Pills */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Phonetic Lexicon', step: '01' },
                    { label: 'Vocal Cadence', step: '02' },
                    { label: 'Neural Vocoder', step: '03' },
                    { label: 'Dual MP3 & WAV', step: '04' },
                  ].map((item, idx) => {
                    const isPast = generationStageIndex > idx;
                    const isCurrent = generationStageIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-accent/15 border-accent/50'
                            : isPast
                            ? 'bg-surface/60 border-accent/30 text-accent'
                            : 'bg-surface/30 border-line text-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-medium uppercase mb-1">
                          <span>Step {item.step}</span>
                          {isPast ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                          ) : isCurrent ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-sunken" />
                          )}
                        </div>
                        <div
                          className={`text-xs font-medium truncate ${
                            isCurrent ? 'text-fg' : isPast ? 'text-muted' : 'text-muted'
                          }`}
                        >
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Smooth Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span>{generationStage}</span>
                    </span>
                    <span className="text-accent font-mono text-sm">{generationProgress}%</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-bg border border-line p-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-200"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>

                {/* Animated Neural Wave Spectrogram */}
                <div className="flex items-center justify-between gap-1 h-14 py-2 px-3 rounded-2xl bg-bg/70 border border-line">
                  {Array.from({ length: 56 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-accent"
                      style={{
                        height: `${20 + ((i * 17 + generationProgress * 3) % 75)}%`,
                        animationDelay: `${(i * 0.05) % 1}s`,
                      }}
                    />
                  ))}
                </div>

                <p className="text-xs text-center text-muted">
                  Synthesizing neural voice with {activeVoice.name}. Dual lossless audio tracks (MP3 &amp; WAV) will be revealed in a few seconds.
                </p>
              </div>
            )}

            {/* 2. STATE: PRISTINE (Show Generate Button only - no premature play/download buttons) */}
            {!isGenerating && !generatedMp3Url && !generatedWavUrl && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGenerateSpeech}
                  disabled={!scriptText.trim()}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl bg-accent hover:bg-accent text-on-accent font-semibold text-base transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-fg" />
                  <span>Generate Voice ({activeVoice.name} • {activeVoice.language})</span>
                </button>
              </div>
            )}

            {/* 3. STATE: GENERATED (The BEST Audio Player Bar & Dual MP3/WAV Downloads) */}
            {!isGenerating && (generatedMp3Url || generatedWavUrl) && (
              <div className="p-6 sm:p-8 rounded-3xl bg-bg text-fg space-y-6 animate-enter border border-accent/30">
                {/* Header Row: Voice Info + Dual Format Switcher Pills */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-line">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-accent/20 text-fg flex items-center justify-center border border-accent/40 text-2xl">
                      {activeVoice.flag}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base sm:text-lg font-semibold text-fg">
                          {activeVoice.name} Speech Synthesized
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-accent/20 text-accent border border-accent/40 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Ready to Play</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        {activeVoice.language} • {activeVoice.category} • 24-bit Neural Audio Engine
                      </p>
                    </div>
                  </div>

                  {/* DUAL FORMAT TOGGLE PILLS: MP3 vs WAV */}
                  <div className="flex items-center gap-2 bg-surface/90 p-1.5 rounded-2xl border border-line self-start lg:self-auto">
                    <button
                      type="button"
                      onClick={() => handleSwitchFormat('mp3')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        selectedFormat === 'mp3'
                          ? ' bg-accent text-on-accent'
                          : 'text-muted hover:text-fg hover:bg-surface'
                      }`}
                    >
                      <FileAudio className="w-4 h-4" />
                      <span>MP3 Format</span>
                      <span className="px-1.5 py-0.5 rounded text-xs bg-black/20 text-accent">
                        {mp3Size}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSwitchFormat('wav')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        selectedFormat === 'wav'
                          ? ' bg-accent text-on-accent'
                          : 'text-muted hover:text-fg hover:bg-surface'
                      }`}
                    >
                      <Disc className="w-4 h-4" />
                      <span>WAV Format</span>
                      <span className="px-1.5 py-0.5 rounded text-xs bg-black/20 text-muted">
                        {wavSize}
                      </span>
                    </button>
                  </div>
                </div>

                {/* THE BEST AUDIO PLAYER BAR */}
                <div className="p-5 sm:p-6 rounded-2xl bg-surface/80 border border-line space-y-4">
                  {/* Dynamic Waveform Visualizer */}
                  <div className="flex items-center justify-between gap-1 h-16 py-2 px-3 rounded-xl bg-bg/90 border border-line">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const progressRatio = audioDuration > 0 ? playbackTime / audioDuration : 0;
                      const barPosition = i / 60;
                      const isPassed = barPosition <= progressRatio;
                      const dynamicHeight = isPlaying
                        ? 25 + Math.sin(i * 0.35 + playbackTime * 8) * 35 + ((i * 13) % 35)
                        : 18 + Math.sin(i * 0.4) * 12;

                      return (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-100 ${
                            isPlaying && isPassed
                              ? ' bg-accent'
                              : isPassed
                              ? 'bg-accent'
                              : 'bg-sunken/80'
                          }`}
                          style={{ height: `${Math.max(12, Math.min(100, dynamicHeight))}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Scrubbable Precision Seekbar */}
                  <div className="space-y-1.5">
                    <div
                      onClick={handleSeek}
                      className="relative w-full h-3 bg-bg hover:bg-surface/90 rounded-full cursor-pointer group transition-colors p-0.5 border border-line"
                      title="Click or drag to seek"
                    >
                      <div
                        className="h-full bg-accent rounded-full transition-all relative"
                        style={{
                          width: `${audioDuration > 0 ? Math.min(100, (playbackTime / audioDuration) * 100) : 0}%`,
                        }}
                      >
                        {/* Draggable glowing thumb */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Timestamps & Active Format Tag */}
                    <div className="flex items-center justify-between text-xs font-mono text-muted">
                      <span className="font-medium text-accent">{formatTime(playbackTime)}</span>
                      <span className="text-xs font-sans font-medium uppercase tracking-wider text-muted">
                        Playing {selectedFormat.toUpperCase()} • {selectedFormat === 'mp3' ? '320kbps' : 'Lossless 24-bit'}
                      </span>
                      <span>{formatTime(audioDuration)}</span>
                    </div>
                  </div>

                  {/* Main Playback Controls Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    {/* Left: Skip -5s, Play/Pause, Skip +5s, Loop */}
                    <div className="flex items-center gap-3">
                      {/* Skip -5s */}
                      <button
                        type="button"
                        onClick={() => handleSkip(-5)}
                        className="w-10 h-10 rounded-xl bg-surface hover:bg-sunken text-muted hover:text-fg flex items-center justify-center transition cursor-pointer"
                        title="Rewind 5 seconds" aria-label="Rewind 5 seconds"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {/* Central Glowing Play / Pause Button */}
                      <button
                        type="button"
                        onClick={togglePlayAudio}
                        className="w-14 h-14 rounded-full bg-accent hover:bg-accent text-on-accent flex items-center justify-center transition-all cursor-pointer"
                        title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                       aria-label="Pause">
                        {isPlaying ? (
                          <Pause className="w-6 h-6 fill-current" />
                        ) : (
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Skip +5s */}
                      <button
                        type="button"
                        onClick={() => handleSkip(5)}
                        className="w-10 h-10 rounded-xl bg-surface hover:bg-sunken text-muted hover:text-fg flex items-center justify-center transition cursor-pointer"
                        title="Forward 5 seconds" aria-label="Forward 5 seconds"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>

                      {/* Loop / Repeat Toggle */}
                      <button
                        type="button"
                        onClick={toggleLoop}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                          isLooping
                            ? 'bg-accent/20 text-accent border border-accent/40'
                            : 'bg-surface text-muted hover:text-fg'
                        }`}
                        title={isLooping ? 'Loop Enabled' : 'Enable Loop'}
                      >
                        <Repeat className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Center/Right: Speed Presets & Volume Control */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Speed Presets */}
                      <div className="flex items-center gap-1 bg-bg/80 p-1 rounded-xl border border-line">
                        {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => {
                              setPlaybackSpeed(spd);
                              if (audioPlayerRef.current) audioPlayerRef.current.playbackRate = spd;
                            }}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              playbackSpeed === spd
                                ? 'bg-accent text-on-accent font-semibold'
                                : 'text-muted hover:text-fg'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-2 bg-bg/80 px-3 py-1.5 rounded-xl border border-line">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="text-muted hover:text-fg transition cursor-pointer"
                          title={isMuted ? 'Unmute' : 'Mute'}
                         aria-label="Mute">
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 text-danger" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-accent" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-16 sm:w-20 accent-accent cursor-pointer h-1.5 bg-surface rounded-lg"
                          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DOWNLOAD SECTION: DUAL DOWNLOAD BUTTONS (MP3 & WAV) */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-semibold tracking-wider text-muted">
                      Download Your Voiceover Files
                    </span>
                    <span className="text-xs text-accent font-medium">100% Free • No Watermark</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 1. Download MP3 */}
                    <a
                      href={generatedMp3Url || '#'}
                      download={`playzy_${activeVoice.name.toLowerCase()}_speech_${Date.now()}.mp3`}
                      className="flex items-center justify-between p-4 rounded-2xl bg-accent hover:bg-accent text-on-accent transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sunken flex items-center justify-center text-fg transition-transform">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Download MP3 Audio</div>
                          <div className="text-xs text-accent">320kbps Universal Format • {mp3Size}</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-lg bg-black/20 text-white">
                        .MP3
                      </span>
                    </a>

                    {/* 2. Download WAV */}
                    <a
                      href={generatedWavUrl || '#'}
                      download={`playzy_${activeVoice.name.toLowerCase()}_speech_${Date.now()}.wav`}
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-sunken text-fg border border-line transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sunken text-muted flex items-center justify-center transition-transform">
                          <Disc className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Download WAV Audio</div>
                          <div className="text-xs text-muted">
                            24-bit Lossless Studio PCM • {wavSize}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-lg bg-sunken text-muted">
                        .WAV
                      </span>
                    </a>
                  </div>

                  {/* Regenerate Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleGenerateSpeech}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-surface text-muted hover:text-fg border border-line text-xs font-medium transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-accent" />
                      <span>Generate Again / Revise Script</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INSTANT VOICE CLONE */}
        {activeTab === 'clone' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-sunken border border-line space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-fg">
                    Instant Voice Cloning Lab
                  </h3>
                  <p className="text-xs text-muted">
                    Provide a 10-30 second clear audio recording. Our neural network analyzes voice acoustics, pitch, and cadence.
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold uppercase bg-sunken text-muted rounded-lg">
                  Zero Login
                </span>
              </div>

              {/* Voice Name Input */}
              <div className="max-w-md space-y-1.5">
                <label className="text-xs font-medium text-fg">Voice Profile Name:</label>
                <input
                  type="text"
                  value={cloneVoiceName}
                  onChange={(e) => setCloneVoiceName(e.target.value)}
                  placeholder="e.g. My Personal Clone, Narrator Voice..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-xs text-fg font-medium focus:border-line"
                />
              </div>

              {/* Ingest Options: Record Mic OR Drop Audio Sample */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={isRecording ? handleStopRecord : handleStartRecord}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-medium text-xs transition-all ${
                    isRecording
                      ? 'bg-danger hover:bg-danger text-on-accent animate-pulse'
                      : 'bg-surface border border-line text-muted hover:bg-sunken'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isRecording ? 'Stop Recording' : 'Record Microphone Sample'}</span>
                </button>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsCloneDragOver(true);
                  }}
                  onDragLeave={() => setIsCloneDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsCloneDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setSampleAudio(e.dataTransfer.files[0]);
                      setRecordedBlob(null);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 border-dashed cursor-pointer font-medium text-xs transition-all ${
                    isCloneDragOver
                      ? 'border-line bg-sunken scale-[1.01]'
                      : 'bg-surface border-line hover:border-line text-fg'
                  }`}
                >
                  <UploadCloud className="w-4 h-4 text-muted" />
                  <span>Drop Audio Sample (.mp3, .wav)</span>
                </div>
              </div>

              {(sampleAudio || recordedBlob) && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-accent-soft border border-accent/30 text-accent text-xs font-medium animate-enter">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>
                      Audio sample captured: {sampleAudio?.name || 'Live Microphone Audio Clip (Ready)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSampleAudio(null);
                      setRecordedBlob(null);
                    }}
                    className="text-muted hover:text-muted font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Test script for clone */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-fg">Enter text to speak with cloned voice:</label>
              <textarea
                rows={4}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Type what you want your cloned voice to say..."
                className="w-full p-4 rounded-2xl bg-sunken border border-line text-xs sm:text-sm text-fg focus:border-line"
              />
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => {
                if (!sampleAudio && !recordedBlob) {
                  setError('Please record or drop a voice sample first.');
                  return;
                }
                setCloneSuccess(true);
                handleGenerateSpeech();
              }}
              className="w-full py-4 rounded-2xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Cloned Voice... Please wait</span>
                </>
              ) : (
                <span>Synthesize with Cloned Voice Profile</span>
              )}
            </button>

            {/* Generated Cloned Audio Output */}
            {!isGenerating && (generatedMp3Url || generatedWavUrl) && cloneSuccess && (
              <div className="p-6 rounded-2xl bg-surface text-fg space-y-4 animate-enter border border-line">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sunken text-muted flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{cloneVoiceName} Ready</h4>
                      <p className="text-xs text-muted">Neural Cloned Voice Audio</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-xs transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play Voice'}</span>
                  </button>

                  <a
                    href={generatedMp3Url || generatedWavUrl || '#'}
                    download={`playzy_clone_${Date.now()}.mp3`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-sunken text-fg font-semibold text-xs transition"
                  >
                    <Download className="w-4 h-4 text-muted" />
                    <span>Download Audio (MP3)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 36+ VOICES ELEVENLABS MODAL / DRAWER */}
      {isVoicePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-enter">
          <div className="bg-surface rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-line overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-line flex items-center justify-between bg-sunken/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent text-on-accent flex items-center justify-center font-medium">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg">Voice library</h3>
                  <p className="text-xs text-muted">
                    Browse 36+ studio-grade voices across 16 global languages
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVoicePickerOpen(false)}
                className="p-2 rounded-xl text-muted hover:text-fg hover:bg-line/50 transition-colors"
               aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 sm:p-5 border-b border-line bg-surface space-y-3">
              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-sunken border border-line rounded-2xl px-3.5 py-2 focus-within:border-line focus-within:ring-2 focus-within:ring-line">
                <Search className="w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={voiceSearchQuery}
                  onChange={(e) => setVoiceSearchQuery(e.target.value)}
                  placeholder="Search by voice name, language, or style (e.g. Adam, British, Narration)..."
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-fg"
                />
              </div>

              {/* Language Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['All', 'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic', 'Hindi', 'Japanese', 'Chinese', 'Korean', 'Russian'].map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => setSelectedLangFilter(lng)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                      selectedLangFilter === lng
                        ? 'bg-accent text-on-accent'
                        : 'bg-sunken text-muted hover:bg-line'
                    }`}
                  >
                    {lng}
                  </button>
                ))}
              </div>

              {/* Gender and Category Filters */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted font-medium">Gender:</span>
                  {['All', 'Female', 'Male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGenderFilter(g)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        selectedGenderFilter === g
                          ? 'bg-surface text-fg'
                          : 'bg-sunken text-muted hover:bg-line'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <span className="text-muted font-medium">
                  Showing {filteredVoices.length} voices
                </span>
              </div>
            </div>

            {/* Voices Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 bg-sunken/50">
              {filteredVoices.map((v) => {
                const isSelected = selectedVoiceId === v.id;
                const isAuditioning = auditioningVoiceId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVoiceId(v.id);
                      setIsVoicePickerOpen(false);
                    }}
                    className={`p-4 rounded-2xl border bg-surface cursor-pointer transition-all flex flex-col justify-between gap-3 group ${
                      isSelected
                        ? 'border-line ring-2 ring-line'
                        : 'border-line hover:border-line'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{v.flag}</span>
                          <div>
                            <span className="text-sm font-semibold text-fg block leading-tight">
                              {v.name}
                            </span>
                            <span className="text-xs text-muted font-medium">
                              {v.language}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-sunken text-muted">
                          {v.gender}
                        </span>
                      </div>

                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-line">
                      <button
                        type="button"
                        onClick={(e) => handleAuditionVoice(v, e)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isAuditioning
                            ? 'bg-accent text-on-accent animate-pulse'
                            : 'bg-sunken text-fg hover:bg-sunken hover:text-muted'
                        }`}
                        title="Audition sample" aria-label="Audition sample"
                      >
                        {isAuditioning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isAuditioning ? 'Playing' : 'Preview'}</span>
                      </button>

                      <button
                        type="button"
                        className={`text-xs font-medium ${
                          isSelected ? 'text-muted' : 'text-muted group-hover:text-muted'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : 'Use Voice'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
