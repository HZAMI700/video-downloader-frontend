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
    const targetUrl = `${TORRENT_BACKEND}/api/download/progress/${id}`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Torrent progress service unreachable: ' + (err.message || 'Unknown error') },
      { status: 502 }
    );
  }
}
