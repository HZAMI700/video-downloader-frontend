import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getBackendUrl(): string {
  const envUrl =
    process.env.TORRENT_BACKEND_URL ||
    process.env.NEXT_PUBLIC_TORRENT_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://node5.botkeep.cloud:41076';
  return envUrl.replace(/\/+$/, '');
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const backendBase = getBackendUrl();
  const targetUrl = `${backendBase}/api/download/start`;

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    // If remote cloud backend is unreachable, also attempt local engine on 127.0.0.1:3000
    if (!backendBase.includes('127.0.0.1') && !backendBase.includes('localhost')) {
      try {
        const localRes = await fetch('http://127.0.0.1:3000/api/download/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(3000),
        });
        const localData = await localRes.json().catch(() => ({}));
        return NextResponse.json(localData, { status: localRes.status });
      } catch {
        // Fall through to error
      }
    }

    return NextResponse.json(
      {
        error:
          'Torrent engine connection error: fetch failed. The BitTorrent download engine is not reachable at ' +
          backendBase +
          '. Make sure the server (npm start) is running, or connect directly to http://localhost:3000.',
        backendUrl: backendBase,
      },
      { status: 502 }
    );
  }
}
