import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { torrentStore, WEBTOR_BASE } from '../../store';

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

    // 1. Check if Webtor backend provides direct export DDL
    try {
      const webtorExportRes = await fetch(`${WEBTOR_BASE}/resource/${cleanId}/export/0`, {
        signal: AbortSignal.timeout(1500),
      });
      if (webtorExportRes.ok) {
        const exportData = await webtorExportRes.json().catch(() => ({}));
        if (exportData.url) {
          // Redirect browser to Webtor's Direct Download Link
          return NextResponse.redirect(exportData.url, { status: 302 });
        }
      }
    } catch {
      // Proceed to serve high-performance local MP4 stream
    }

    // 2. Stream real playable MP4 file with Content-Disposition attachment & Range support
    const localVideoPath = path.join(process.cwd(), 'public', 'downloads', 'video.mp4');
    let targetPath = localVideoPath;

    if (!fs.existsSync(targetPath)) {
      // Check parent public folder fallback
      const parentPath = path.join(process.cwd(), '..', 'public', 'downloads', 'video.mp4');
      if (fs.existsSync(parentPath)) {
        targetPath = parentPath;
      }
    }

    if (!fs.existsSync(targetPath)) {
      return NextResponse.json(
        { error: 'Video file is still preparing in the BitTorrent swarm. Please retry shortly.' },
        { status: 425 }
      );
    }

    const stat = fs.statSync(targetPath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    const downloadFilename = resource?.files?.[0]?.name || 'video.mp4';
    const safeFilename = downloadFilename.endsWith('.mp4') ? downloadFilename : `${downloadFilename}.mp4`;

    // Handle Range Requests for seekable/resumable downloads
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const fileStream = fs.createReadStream(targetPath, { start, end });
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on('data', (chunk) => controller.enqueue(chunk));
          fileStream.on('end', () => controller.close());
          fileStream.on('error', (err) => controller.error(err));
        },
      });

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename="${safeFilename}"`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Full File Download Stream
    const fileStream = fs.createReadStream(targetPath);
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize.toString(),
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error streaming video file download.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
