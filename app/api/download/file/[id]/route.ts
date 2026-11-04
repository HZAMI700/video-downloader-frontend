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
  const targetUrl = `${backendBase}/api/download/file/${id}`;

  const forwardHeaders: Record<string, string> = {};
  const range = request.headers.get('range');
  if (range) {
    forwardHeaders['range'] = range;
  }

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: forwardHeaders,
      cache: 'no-store',
    });

    if (res.status === 425) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: 425 });
    }

    const responseHeaders = new Headers();
    res.headers.forEach((val, key) => {
      responseHeaders.set(key, val);
    });

    return new Response(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    if (!backendBase.includes('127.0.0.1') && !backendBase.includes('localhost')) {
      try {
        const localRes = await fetch(`http://127.0.0.1:3000/api/download/file/${id}`, {
          headers: forwardHeaders,
        });
        if (localRes.status === 425) {
          const json = await localRes.json().catch(() => ({}));
          return NextResponse.json(json, { status: 425 });
        }
        const responseHeaders = new Headers();
        localRes.headers.forEach((val, key) => {
          responseHeaders.set(key, val);
        });
        return new Response(localRes.body, {
          status: localRes.status,
          headers: responseHeaders,
        });
      } catch {}
    }

    return NextResponse.json(
      { error: 'Torrent streaming service unreachable: ' + (err.message || 'Unknown error') },
      { status: 502 }
    );
  }
}
