export interface TorrentSession {
  id: string;
  infoHash: string;
  filename: string;
  total: number;
  downloaded: number;
  progress: number;
  speed: number;
  peers: number;
  done: boolean;
  status: 'starting' | 'downloading' | 'converting' | 'completed' | 'error';
  startedAt: number;
}

// Global in-memory store preserved across invocations in the Node process
const globalSessions = globalThis as unknown as {
  __torrent_sessions?: Map<string, TorrentSession>;
};

if (!globalSessions.__torrent_sessions) {
  globalSessions.__torrent_sessions = new Map();
}

export const sessions = globalSessions.__torrent_sessions;

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
