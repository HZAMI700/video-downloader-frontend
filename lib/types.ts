export interface CapabilitiesResponse {
  backend: string;
  ytdlp_version: string;
  ffmpeg_available: boolean;
  max_file_size_mb: number;
  supported_extractors: string[];
  features: {
    audio_extraction: boolean;
    video_muxing: boolean;
    direct_formats: boolean;
    resumable_downloads: boolean;
  };
  notes: string;
}

export interface FormatOption {
  format_id: string;
  type: 'video' | 'audio';
  label: string;
  resolution: string;
  ext: string;
  quality_note?: string;
  requires_ffmpeg: boolean;
  available: boolean;
  approx_size_bytes?: number;
}

export interface MediaMetadata {
  id: string;
  title: string;
  thumbnail?: string;
  duration?: number;
  duration_formatted?: string;
  uploader?: string;
  view_count?: number;
  platform: string;
  original_url: string;
  formats: FormatOption[];
  ffmpeg_available: boolean;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface DownloadJob {
  job_id: string;
  url: string;
  format_id: string;
  status: JobStatus;
  progress_percent: number;
  downloaded_bytes: number;
  total_bytes?: number;
  speed_bytes_sec?: number;
  eta_seconds?: number;
  filename?: string;
  file_size?: number;
  content_type?: string;
  error_message?: string;
  created_at: number;
  completed_at?: number;
}
