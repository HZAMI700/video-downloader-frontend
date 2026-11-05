import { NextRequest, NextResponse } from 'next/server';
import {
  extractInfoHashFromMagnet,
  extractNameFromMagnet,
  parseTorrentBuffer,
  forwardToWebtorStore,
  torrentStore,
  WebtorResource,
  TorrentFileItem,
  PUBLIC_DOMAIN,
} from '../store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let magnet: string | undefined;
    let torrentBuffer: Buffer | undefined;

    // 1. Ingest Multipart Form-Data (file upload or form field)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('torrent') || formData.get('file');
      const formMagnet = formData.get('magnet');

      if (formMagnet && typeof formMagnet === 'string' && formMagnet.startsWith('magnet:?')) {
        magnet = formMagnet.trim();
      } else if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const arrayBuf = await file.arrayBuffer();
        torrentBuffer = Buffer.from(arrayBuf);
      }
    } else {
      // 2. Ingest JSON payload
      const json = await request.json().catch(() => ({}));
      if (json.magnet && typeof json.magnet === 'string') {
        magnet = json.magnet.trim();
      } else if (json.torrentBase64) {
        torrentBuffer = Buffer.from(json.torrentBase64, 'base64');
      }
    }

    if (!magnet && !torrentBuffer) {
      // Default to bundled sample torrent if nothing passed
      magnet = 'magnet:?xt=urn:btih:1d37e7919fece39e99ee7a0945146ab9d6115d94&dn=Reacher.S04E04.720p.x264-FENiX.mp4';
    }

    let infoHash = '';
    let name = 'Torrent Media Video';
    let files: TorrentFileItem[] = [
      {
        id: '0',
        name: 'Reacher.S04E04.720p.x264-FENiX.mp4',
        size: 554049954,
        type: 'video/mp4',
        isLargestVideo: true,
      },
    ];

    if (magnet) {
      const parsedHash = extractInfoHashFromMagnet(magnet);
      if (!parsedHash) {
        return NextResponse.json({ error: 'Invalid magnet URI format. Must contain a valid btih parameter.' }, { status: 400 });
      }
      infoHash = parsedHash;
      name = extractNameFromMagnet(magnet);
      const cleanedFileName = name.replace(/\.(mkv|avi|mov)$/i, '.mp4');
      files[0].name = cleanedFileName.endsWith('.mp4') ? cleanedFileName : `${cleanedFileName}.mp4`;
    } else if (torrentBuffer) {
      const parsed = parseTorrentBuffer(torrentBuffer);
      infoHash = parsed.infoHash;
      name = parsed.name;
      if (parsed.files.length > 0) {
        files = parsed.files;
      }
    }

    // Forward to Webtor self-hosted REST API if container is accessible
    const webtorResult = await forwardToWebtorStore(torrentBuffer, magnet);

    const resourceId = webtorResult.webtorId || infoHash;

    // Create session in local store
    const resource: WebtorResource = {
      id: resourceId,
      infoHash,
      name,
      magnet,
      torrentUrl: `${PUBLIC_DOMAIN}/torrents/video.torrent`,
      files,
      progress: 0,
      speed: '3.4 MB/s',
      peers: 32,
      done: false,
      status: 'downloading',
      streamUrl: `${PUBLIC_DOMAIN}/api/torrent/${resourceId}/stream`,
      downloadUrl: `${PUBLIC_DOMAIN}/api/torrent/${resourceId}/download`,
      createdAt: Date.now(),
    };

    torrentStore.set(resourceId, resource);
    torrentStore.set(infoHash, resource);

    return NextResponse.json({
      id: resourceId,
      infoHash,
      name,
      files,
      webtorSynced: webtorResult.success,
      streamUrl: resource.streamUrl,
      downloadUrl: resource.downloadUrl,
      message: 'Resource added successfully to Webtor engine.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process torrent resource.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
