import React from 'react';
import {
  MessageSquare,
  RefreshCw,
  CheckCheck,
  Image as ImageIcon,
  AlignLeft,
  UserCheck,
  Languages,
  FileSearch,
  FileAudio,
  Youtube,
  Radio,
  Disc,
  Music2,
  FileVideo,
  Scissors,
  Sparkles,
  Mic,
  Volume2,
  Wand2,
  DownloadCloud,
  FolderOpen,
} from 'lucide-react';
import { ToolId } from '../components/AppSidebar';

export type CategoryId =
  | 'ai-section'
  | 'audio-tools'
  | 'ai-voice'
  | 'video-downloader'
  | 'workspace';

export interface CategoryToolItem {
  id: ToolId;
  name: string;
  category: CategoryId;
  categoryName: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  pastelBg: string;
  iconBg: string;
  badgeColor: string;
  pillTag: string;
  popular?: boolean;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  badge: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  themeColor: string;
  tools: CategoryToolItem[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'ai-section',
    name: 'AI Section',
    badge: '8 TOOLS',
    heroBadge: 'QuillBot AI Suite • 100% Free & No Sign-up',
    heroTitle: 'AI Writing & Creative Suite',
    heroDescription:
      'Rewrite, edit, humanize, translate, scan, and generate with high-performance AI tools.',
    themeColor: 'emerald',
    tools: [
      {
        id: 'ai-chat',
        name: 'AI Chat',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: "Unlock your potential with QuillBot's free AI chat!",
        fullDesc:
          'Ask questions, brainstorm ideas, draft emails, and solve complex problems with low latency LLMs.',
        iconName: 'MessageSquare',
        pastelBg: 'bg-[#EEF4FF]',
        iconBg: 'bg-white text-blue-600 shadow-sm',
        badgeColor: 'text-blue-600',
        pillTag: '+2.4k prompts/hr',
        popular: true,
      },
      {
        id: 'paraphrasing-tool',
        name: 'Paraphrasing tool',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: 'Rewrite and refine text with fluency & creative modes',
        fullDesc:
          'Rephrase any text with multiple tone controls, fluency enhancements, and custom synonym sliders.',
        iconName: 'RefreshCw',
        pastelBg: 'bg-[#ECFDF3]',
        iconBg: 'bg-white text-emerald-600 shadow-sm',
        badgeColor: 'text-emerald-600',
        pillTag: 'Fluency +98%',
        popular: true,
      },
      {
        id: 'grammar-checker',
        name: 'Grammar Checker',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: 'Fix spelling, grammar, punctuation with zero errors',
        fullDesc:
          'Catch tricky grammatical errors, punctuation slip-ups, and phrasing issues in one click.',
        iconName: 'CheckCheck',
        pastelBg: 'bg-[#FFF1F3]',
        iconBg: 'bg-white text-rose-600 shadow-sm',
        badgeColor: 'text-rose-600',
        pillTag: '0 Errors',
      },
      {
        id: 'ai-image-generator',
        name: 'AI Image Generator',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: 'Create AI images, photos, and graphics online',
        fullDesc:
          'Generate photorealistic renders, artistic illustrations, and vector icons from text prompts.',
        iconName: 'ImageIcon',
        pastelBg: 'bg-[#FFF8EB]',
        iconBg: 'bg-white text-amber-600 shadow-sm',
        badgeColor: 'text-amber-600',
        pillTag: '4K Studio',
      },
      {
        id: 'summarizer',
        name: 'Summarizer',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: 'Condense long text into bullet points or concise TL;DR',
        fullDesc:
          'Summarize research papers, articles, transcripts, and long documents into key highlights instantly.',
        iconName: 'AlignLeft',
        pastelBg: 'bg-[#F3EEFF]',
        iconBg: 'bg-white text-purple-600 shadow-sm',
        badgeColor: 'text-purple-600',
        pillTag: '-75% Length',
      },
      {
        id: 'ai-humanizer',
        name: 'AI Humanizer',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: 'Make writing sound natural and bypass AI detectors',
        fullDesc:
          'Inject authentic human cadence, remove robotic sentence rhythm, and pass AI detectors cleanly.',
        iconName: 'UserCheck',
        pastelBg: 'bg-[#EBFBFA]',
        iconBg: 'bg-white text-teal-600 shadow-sm',
        badgeColor: 'text-teal-600',
        pillTag: '100% Human Score',
        popular: true,
      },
      {
        id: 'translator',
        name: 'Translator',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: 'Translate quickly and accurately across 30+ languages',
        fullDesc:
          'Context-aware translation preserving nuance, idiomatic expressions, and technical vocabulary.',
        iconName: 'Languages',
        pastelBg: 'bg-[#ECFDF5]',
        iconBg: 'bg-white text-emerald-600 shadow-sm',
        badgeColor: 'text-emerald-600',
        pillTag: '30+ Languages',
      },
      {
        id: 'plagiarism-checker',
        name: 'Plagiarism Checker',
        category: 'ai-section',
        categoryName: 'AI Section',
        shortDesc: 'Detect unoriginal content across billions of web pages',
        fullDesc:
          'Deep web and academic database scanning with detailed uniqueness score and citation analysis.',
        iconName: 'FileSearch',
        pastelBg: 'bg-[#FFF5ED]',
        iconBg: 'bg-white text-orange-600 shadow-sm',
        badgeColor: 'text-orange-600',
        pillTag: '99.9% Original',
      },
    ],
  },
  {
    id: 'audio-tools',
    name: 'Audio Tools',
    badge: '9 TOOLS',
    heroBadge: 'CoreAudio AI Suite • Real-time Transcription & DSP',
    heroTitle: 'Audio Transcription & Audio Processing Suite',
    heroDescription:
      'Transcribe, extract, convert, record, and translate audio files with high-precision Whisper models.',
    themeColor: 'blue',
    tools: [
      {
        id: 'transcriber',
        name: 'Audio Transcriber',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Convert speech, podcasts, and video meetings to text',
        fullDesc:
          'Whisper Large-v3 automated speech recognition with speaker diarization and accurate timestamps.',
        iconName: 'FileAudio',
        pastelBg: 'bg-[#EEF4FF]',
        iconBg: 'bg-white text-blue-600 shadow-sm',
        badgeColor: 'text-blue-600',
        pillTag: 'Whisper Large-v3',
        popular: true,
      },
      {
        id: 'youtube-to-mp3',
        name: 'YouTube to MP3 Converter',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Extract high-bitrate MP3 audio from any YouTube video',
        fullDesc:
          'High-speed cloud extraction up to 320 kbps with metadata tagging and zero quality loss.',
        iconName: 'Youtube',
        pastelBg: 'bg-[#FFF1F3]',
        iconBg: 'bg-white text-rose-600 shadow-sm',
        badgeColor: 'text-rose-600',
        pillTag: '320 kbps HD',
        popular: true,
      },
      {
        id: 'podcast-generator',
        name: 'Free AI Podcast Generator',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Turn topics, notes, or articles into full podcasts',
        fullDesc:
          'Generates natural conversational multi-host podcast dialogues with realistic studio voice synthesis.',
        iconName: 'Radio',
        pastelBg: 'bg-[#F3EEFF]',
        iconBg: 'bg-white text-purple-600 shadow-sm',
        badgeColor: 'text-purple-600',
        pillTag: 'Dual Host AI',
      },
      {
        id: 'audio-translator',
        name: 'Free AI Audio Translator',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Translate foreign speech and audio files into 40+ languages',
        fullDesc:
          'Multi-lingual speech translation pipeline converting spoken foreign audio to native translated audio & text.',
        iconName: 'Languages',
        pastelBg: 'bg-[#EBFBFA]',
        iconBg: 'bg-white text-teal-600 shadow-sm',
        badgeColor: 'text-teal-600',
        pillTag: '40+ Languages',
        popular: true,
      },
      {
        id: 'recorder-transcriber',
        name: 'Recorder & Transcriber',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Record microphone live in browser and transcribe',
        fullDesc:
          'Direct browser microphone capture with real-time waveform visualizer and instant transcription.',
        iconName: 'Disc',
        pastelBg: 'bg-[#ECFDF3]',
        iconBg: 'bg-white text-emerald-600 shadow-sm',
        badgeColor: 'text-emerald-600',
        pillTag: 'Live Mic Input',
      },
      {
        id: 'tiktok-to-mp3',
        name: 'TikTok to MP3 Converter',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Extract audio & viral sounds from TikTok videos',
        fullDesc:
          'Save background music, voices, and audio clips from TikTok with high fidelity and zero watermark.',
        iconName: 'Music2',
        pastelBg: 'bg-[#FFF8EB]',
        iconBg: 'bg-white text-amber-600 shadow-sm',
        badgeColor: 'text-amber-600',
        pillTag: 'Lossless MP3',
      },
      {
        id: 'mp4-to-mp3',
        name: 'MP4 to MP3 Converter',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Convert any video file (MP4, MOV, MKV) to MP3',
        fullDesc:
          'Drag-and-drop any video format to extract clear audio with variable or constant 320 kbps bitrates.',
        iconName: 'FileVideo',
        pastelBg: 'bg-[#FFF5ED]',
        iconBg: 'bg-white text-orange-600 shadow-sm',
        badgeColor: 'text-orange-600',
        pillTag: 'Universal Video',
      },
      {
        id: 'youtube-to-wav',
        name: 'YouTube to WAV Converter',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Extract uncompressed studio-grade WAV audio',
        fullDesc:
          'Studio quality 24-bit 48kHz uncompressed WAV audio for sound designers and music producers.',
        iconName: 'Youtube',
        pastelBg: 'bg-[#EEF4FF]',
        iconBg: 'bg-white text-blue-600 shadow-sm',
        badgeColor: 'text-blue-600',
        pillTag: '24-bit PCM WAV',
      },
      {
        id: 'extract-audio',
        name: 'Extract Audio from Video',
        category: 'audio-tools',
        categoryName: 'Audio Tools',
        shortDesc: 'Separate audio tracks cleanly from any video source',
        fullDesc:
          'Client and server-side demuxer for instant audio stripping without video re-encoding delay.',
        iconName: 'Scissors',
        pastelBg: 'bg-[#ECFDF5]',
        iconBg: 'bg-white text-emerald-600 shadow-sm',
        badgeColor: 'text-emerald-600',
        pillTag: 'Clean Separation',
      },
    ],
  },
  {
    id: 'ai-voice',
    name: 'AI Voice Studio',
    badge: '36+ VOICES',
    heroBadge: 'ElevenLabs Engine • 36+ Voices in 16 Languages',
    heroTitle: 'ElevenLabs AI Voice Studio & Audio DSP',
    heroDescription:
      'Ultra-realistic voice synthesis across global languages, instant voice cloning, and audio mastering.',
    themeColor: 'purple',
    tools: [
      {
        id: 'ai-voice-generator',
        name: 'AI Voice Generator',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Ultra-realistic text-to-speech with 36+ voices',
        fullDesc:
          'ElevenLabs acoustic synthesis with emotional range, accents, stability, clarity, and pitch control.',
        iconName: 'Sparkles',
        pastelBg: 'bg-[#F3EEFF]',
        iconBg: 'bg-white text-purple-600 shadow-sm',
        badgeColor: 'text-purple-600',
        pillTag: '36+ Voices',
        popular: true,
      },
      {
        id: 'ai-voice-clone',
        name: 'AI Voice Clone',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Clone any voice instantly from reference audio',
        fullDesc:
          'Upload 10 seconds of clear speech to synthesize new dialogue with matching vocal timbre and cadence.',
        iconName: 'Mic',
        pastelBg: 'bg-[#EEF4FF]',
        iconBg: 'bg-white text-indigo-600 shadow-sm',
        badgeColor: 'text-indigo-600',
        pillTag: 'Instant Cloning',
        popular: true,
      },
      {
        id: 'volume-booster',
        name: 'Volume Booster',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Boost quiet audio up to 400% with limiter protection',
        fullDesc:
          'Dynamic range compression and true-peak brickwall limiting to increase loudness without digital clipping.',
        iconName: 'Volume2',
        pastelBg: 'bg-[#FFF8EB]',
        iconBg: 'bg-white text-amber-600 shadow-sm',
        badgeColor: 'text-amber-600',
        pillTag: 'Up to 400%',
      },
      {
        id: 'ai-voice-cleaner',
        name: 'AI Voice Cleaner',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Remove clicks, mouth noises, hums, and rumble',
        fullDesc:
          'Deep-clean voice recordings with studio-grade notch filtering and spectral de-reverberation.',
        iconName: 'Sparkles',
        pastelBg: 'bg-[#ECFDF3]',
        iconBg: 'bg-white text-emerald-600 shadow-sm',
        badgeColor: 'text-emerald-600',
        pillTag: 'Studio Polish',
      },
      {
        id: 'ai-vocal-remover',
        name: 'AI Vocal Remover',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Separate vocals and instrumental tracks cleanly',
        fullDesc:
          'Spleeter / Demucs AI stem separation to extract isolated acapella vocals or karaoke backing tracks.',
        iconName: 'Disc',
        pastelBg: 'bg-[#FFF1F3]',
        iconBg: 'bg-white text-rose-600 shadow-sm',
        badgeColor: 'text-rose-600',
        pillTag: 'Stem Separation',
        popular: true,
      },
      {
        id: 'ai-voice-changer',
        name: 'AI Voice Changer',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Transform voice pitch, timbre, robotic, or cinematic',
        fullDesc:
          'Real-time DSP pitch shifting, formant preservation, radio telephony filter, and robotic modulation.',
        iconName: 'Wand2',
        pastelBg: 'bg-[#EBFBFA]',
        iconBg: 'bg-white text-cyan-600 shadow-sm',
        badgeColor: 'text-cyan-600',
        pillTag: 'Real-time FX',
      },
      {
        id: 'background-noise-remover',
        name: 'Background Noise Remover',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Suppress air conditioning, traffic, hiss, and echoes',
        fullDesc:
          'Adaptive spectral subtraction to eliminate static background noise and room ambience instantly.',
        iconName: 'Radio',
        pastelBg: 'bg-[#EEF4FF]',
        iconBg: 'bg-white text-blue-600 shadow-sm',
        badgeColor: 'text-blue-600',
        pillTag: 'Spectral Denoise',
      },
      {
        id: 'background-music-remover',
        name: 'Background Music Remover',
        category: 'ai-voice',
        categoryName: 'AI Voice Studio',
        shortDesc: 'Isolate pure speech while ducking background music',
        fullDesc:
          'Remove copyrighted background music from podcasts and video clips while preserving clear voices.',
        iconName: 'Music2',
        pastelBg: 'bg-[#FFF5ED]',
        iconBg: 'bg-white text-orange-600 shadow-sm',
        badgeColor: 'text-orange-600',
        pillTag: 'Speech Isolation',
      },
    ],
  },
];

export const ALL_TOOLS: CategoryToolItem[] = CATEGORIES.flatMap((c) => c.tools);

export function getToolById(id: string): CategoryToolItem | undefined {
  return ALL_TOOLS.find((t) => t.id === id);
}

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryForTool(toolId: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.tools.some((t) => t.id === toolId));
}
