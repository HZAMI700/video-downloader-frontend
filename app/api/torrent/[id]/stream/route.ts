import { NextRequest, NextResponse } from 'next/server';
import { torrentStore, WEBTOR_BASE, PUBLIC_DOMAIN } from '../../store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.trim().toLowerCase();
    const resource = torrentStore.get(cleanId);

    // 1. Check if Webtor backend provides direct HLS / MP4 streaming URL
    let webtorStreamUrl = '';
    try {
      const webtorStreamRes = await fetch(`${WEBTOR_BASE}/resource/${cleanId}/export/0`, {
        signal: AbortSignal.timeout(1500),
      });
      if (webtorStreamRes.ok) {
        const data = await webtorStreamRes.json().catch(() => ({}));
        if (data.stream_url || data.url) {
          webtorStreamUrl = data.stream_url || data.url;
        }
      }
    } catch {
      // Container not reachable, use site stream
    }

    const directStreamUrl = `${PUBLIC_DOMAIN}/api/torrent/${cleanId}/download`;
    const watchUrl = `${PUBLIC_DOMAIN}/watch/${cleanId}`;

    return NextResponse.json({
      id: cleanId,
      streamUrl: webtorStreamUrl || directStreamUrl,
      directStreamUrl,
      watchUrl,
      mimeType: 'video/mp4',
      magnet: resource?.magnet || `magnet:?xt=urn:btih:${cleanId}`,
      torrentUrl: resource?.torrentUrl || `${PUBLIC_DOMAIN}/torrents/video.torrent`,
      filename: resource?.files?.[0]?.name || 'video.mp4',
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate torrent stream URL.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
