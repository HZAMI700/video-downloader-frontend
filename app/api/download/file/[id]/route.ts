import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TORRENT_BACKEND = (
  process.env.TORRENT_BACKEND_URL ||
  process.env.NEXT_PUBLIC_TORRENT_BACKEND_URL ||
  'http://127.0.0.1:3000'
).replace(/\/+$/, '');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const targetUrl = `${TORRENT_BACKEND}/api/download/file/${id}`;

    const forwardHeaders: Record<string, string> = {};
    const range = request.headers.get('range');
    if (range) {
      forwardHeaders['range'] = range;
    }

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
    return NextResponse.json(
      { error: 'Torrent streaming service unreachable: ' + (err.message || 'Unknown error') },
      { status: 502 }
    );
  }
}
