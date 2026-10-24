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
