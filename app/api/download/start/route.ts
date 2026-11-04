import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TORRENT_BACKEND = (
  process.env.TORRENT_BACKEND_URL ||
  process.env.NEXT_PUBLIC_TORRENT_BACKEND_URL ||
  'http://127.0.0.1:3000'
).replace(/\/+$/, '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetUrl = `${TORRENT_BACKEND}/api/download/start`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Torrent engine connection error: ' + (err.message || 'Server unreachable'),
        hint: 'Ensure torrent-video-downloader engine is running on port 3000.',
      },
      { status: 502 }
    );
  }
}
