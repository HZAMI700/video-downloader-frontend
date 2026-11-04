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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const backendBase = getBackendUrl();
  const targetUrl = `${backendBase}/api/download/progress/${id}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    if (!backendBase.includes('127.0.0.1') && !backendBase.includes('localhost')) {
      try {
        const localRes = await fetch(`http://127.0.0.1:3000/api/download/progress/${id}`, {
          signal: AbortSignal.timeout(3000),
        });
        const localData = await localRes.json().catch(() => ({}));
        return NextResponse.json(localData, { status: localRes.status });
      } catch {}
    }

    return NextResponse.json(
      { error: 'Torrent progress service unreachable: ' + (err.message || 'Unknown error') },
      { status: 502 }
    );
  }
}
