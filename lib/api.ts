import { CapabilitiesResponse, MediaMetadata, DownloadJob, TranscriptionJob } from './types';

export const DEFAULT_BACKEND_URL = 'http://node5.botkeep.cloud:41076';

export function getBackendBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;
  return url.replace(/\/+$/, '');
}

/**
 * Returns the effective API endpoint prefix.
 * If the frontend is loaded over HTTPS (like on Vercel) and the backend is HTTP,
 * we use the same-origin Next.js rewrite '/api/backend' to prevent browser Mixed-Content blocking.
 */
function getApiEndpoint(subpath: string): string {
  const configured = getBackendBaseUrl();
  const cleanSubpath = subpath.replace(/^\/+/, '');

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && configured.startsWith('http://')) {
    return `/api/backend/${cleanSubpath}`;
  }

  return `${configured}/api/${cleanSubpath}`;
}

export async function fetchCapabilities(): Promise<CapabilitiesResponse> {
  const endpoint = getApiEndpoint('capabilities');
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch backend capabilities (${res.status})`);
  }

  return res.json();
}

export async function fetchMetadata(url: string): Promise<MediaMetadata> {
  const endpoint = getApiEndpoint('metadata');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to retrieve media metadata (${res.status})`);
  }

  return res.json();
}

export async function createDownloadJob(url: string, formatId: string): Promise<{ job_id: string; status: string; message: string }> {
  const endpoint = getApiEndpoint('downloads');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ url, format_id: formatId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to initiate download job (${res.status})`);
  }

  return res.json();
}

export async function fetchJobStatus(jobId: string): Promise<DownloadJob> {
  const endpoint = getApiEndpoint(`downloads/${jobId}`);
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to check download status (${res.status})`);
  }

  return res.json();
}

export function buildFileDownloadUrl(jobId: string): string {
  return getApiEndpoint(`downloads/${jobId}/file`);
}

export async function deleteDownloadJob(jobId: string): Promise<void> {
  const endpoint = getApiEndpoint(`downloads/${jobId}`);
  try {
    await fetch(endpoint, {
      method: 'DELETE',
    });
  } catch (e) {
    // Ignore cleanup errors on frontend
  }
}

export async function uploadAndTranscribeFile(
  file: File,
  language: string = 'auto',
  diarization: boolean = false
): Promise<{ job_id: string; status: string; filename: string }> {
  const endpoint = getApiEndpoint('transcribe/upload');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  formData.append('diarization', String(diarization));

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error(
        'File exceeds the upload limit. For large video or audio files, click the "Link" button to transcribe directly from any URL, or choose a smaller audio file.'
      );
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed (${res.status})`);
  }

  return res.json();
}

export async function transcribeMediaUrl(
  url: string,
  language: string = 'auto',
  diarization: boolean = false
): Promise<{ job_id: string; status: string; url: string }> {
  const endpoint = getApiEndpoint('transcribe/url');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ url, language, diarization }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Transcription request failed (${res.status})`);
  }

  return res.json();
}

export async function fetchTranscriptionStatus(jobId: string): Promise<TranscriptionJob> {
  const endpoint = getApiEndpoint(`transcribe/${jobId}`);
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch transcription status (${res.status})`);
  }

  return res.json();
}

export function getTranscriptionExportUrl(jobId: string, format: 'txt' | 'srt' | 'vtt'): string {
  return getApiEndpoint(`transcribe/${jobId}/export?format=${format}`);
}

export async function translateTranscriptText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<{ original_text: string; translated_text: string; target_language: string }> {
  const endpoint = getApiEndpoint('transcribe/translate');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      text,
      target_language: targetLanguage,
      source_language: sourceLanguage,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Translation failed (${res.status})`);
  }

  return res.json();
}

export async function processAudioBoost(file: File, boostPercent: number): Promise<Blob> {
  const endpoint = getApiEndpoint('audio/boost');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('boost_percent', String(boostPercent));

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Volume boost failed (${res.status})`);
  }

  return res.blob();
}

export async function processVocalRemover(file: File, mode: 'instrumental' | 'vocals'): Promise<Blob> {
  const endpoint = getApiEndpoint('audio/vocal-remover');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mode', mode);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Vocal separation failed (${res.status})`);
  }

  return res.blob();
}

export async function processAudioClean(file: File): Promise<Blob> {
  const endpoint = getApiEndpoint('audio/clean');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Voice cleaner failed (${res.status})`);
  }

  return res.blob();
}

export async function processVoiceChange(file: File, preset: string): Promise<Blob> {
  const endpoint = getApiEndpoint('audio/voice-change');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('preset', preset);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Voice changer failed (${res.status})`);
  }

  return res.blob();
}

export async function convertMediaFile(
  file: File,
  targetFormat: string = 'mp3',
  bitrate: string = '320k'
): Promise<Blob> {
  const endpoint = getApiEndpoint('audio/convert');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_format', targetFormat);
  formData.append('bitrate', bitrate);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `File conversion failed (${res.status})`);
  }

  return res.blob();
}

// -------------------------------------------------------------
// QuillBot AI Suite Client APIs
// -------------------------------------------------------------
export async function runParaphrase(
  text: string,
  mode: string = 'standard',
  synonyms: string = 'medium'
): Promise<{ original_text: string; paraphrased_text: string; mode: string; synonyms: string }> {
  const endpoint = getApiEndpoint('ai/paraphrase');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ text, mode, synonyms }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Paraphrase failed (${res.status})`);
  }
  return res.json();
}

export async function runGrammarCheck(
  text: string
): Promise<{
  original_text: string;
  corrected_text: string;
  errors: Array<{ original: string; suggestion: string; type: string; explanation: string }>;
  total_errors: number;
}> {
  const endpoint = getApiEndpoint('ai/grammar-check');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Grammar check failed (${res.status})`);
  }
  return res.json();
}

export async function runSummarize(
  text: string,
  format: string = 'paragraph',
  length: string = 'medium'
): Promise<{
  original_text: string;
  summary: string;
  original_word_count: number;
  summary_word_count: number;
  reduction_percent: number;
}> {
  const endpoint = getApiEndpoint('ai/summarize');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ text, format, length }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Summarize failed (${res.status})`);
  }
  return res.json();
}

export async function runHumanize(
  text: string,
  tone: string = 'balanced'
): Promise<{
  original_text: string;
  humanized_text: string;
  original_ai_score: number;
  humanized_ai_score: number;
  human_score: number;
  tone: string;
}> {
  const endpoint = getApiEndpoint('ai/humanize');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ text, tone }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `AI Humanizer failed (${res.status})`);
  }
  return res.json();
}

export async function runAiChat(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<{ reply: string; model: string }> {
  const endpoint = getApiEndpoint('ai/chat');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ messages, system_prompt: systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `AI Chat failed (${res.status})`);
  }
  return res.json();
}

export async function runPlagiarismCheck(
  text: string
): Promise<{
  original_text: string;
  total_words: number;
  total_sentences: number;
  originality_percent: number;
  matched_percent: number;
  scanned_sources: number;
  flagged_phrases: Array<{ phrase: string; similarity: number; reason: string }>;
  summary: string;
}> {
  const endpoint = getApiEndpoint('ai/plagiarism-check');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Plagiarism check failed (${res.status})`);
  }
  return res.json();
}

export interface AiDetectorSentence {
  text: string;
  ai_probability: number;
  classification: 'ai' | 'mixed' | 'human';
  reason?: string;
}

export interface AiDetectorResponse {
  original_text: string;
  ai_score: number;
  human_score: number;
  verdict: string;
  analysis_summary: string;
  total_words: number;
  total_sentences: number;
  sentences: AiDetectorSentence[];
}

export async function runAiDetector(text: string): Promise<AiDetectorResponse> {
  const endpoint = getApiEndpoint('ai/ai-detector');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `AI Detector failed (${res.status})`);
  }
  return res.json();
}




