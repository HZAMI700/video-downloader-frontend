import { CapabilitiesResponse, MediaMetadata, DownloadJob } from './types';

export function getBackendBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return url.replace(/\/+$/, '');
}

export async function fetchCapabilities(): Promise<CapabilitiesResponse> {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/api/capabilities`, {
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
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/api/metadata`, {
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
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/api/downloads`, {
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
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/api/downloads/${jobId}`, {
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
  const baseUrl = getBackendBaseUrl();
  return `${baseUrl}/api/downloads/${jobId}/file`;
}

export async function deleteDownloadJob(jobId: string): Promise<void> {
  const baseUrl = getBackendBaseUrl();
  try {
    await fetch(`${baseUrl}/api/downloads/${jobId}`, {
      method: 'DELETE',
    });
  } catch (e) {
    // Ignore cleanup errors on frontend
  }
}
