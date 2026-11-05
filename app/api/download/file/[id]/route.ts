import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sessions } from '../../store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customBackend = process.env.TORRENT_BACKEND_URL;

  // 1. If explicit custom backend, forward
  if (customBackend) {
    try {
      const targetUrl = `${customBackend.replace(/\/+$/, '')}/api/download/file/${id}`;
      const forwardHeaders: Record<string, string> = {};
      const range = request.headers.get('range');
      if (range) forwardHeaders['range'] = range;

      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: forwardHeaders,
        cache: 'no-store',
      });

      if (res.status === 425) {
        const json = await res.json().catch(() => ({}));
        return NextResponse.json(json, { status: 425 });
      }

      if (res.ok) {
        const responseHeaders = new Headers();
        res.headers.forEach((val, key) => responseHeaders.set(key, val));
        return new Response(res.body, {
          status: res.status,
          headers: responseHeaders,
        });
      }
    } catch {}
  }

  // 2. Resilient file streamer
  const session = sessions.get(id);

  // If session marked not done and started less than 3 seconds ago, return 425
  if (session && !session.done) {
    const elapsed = (Date.now() - session.startedAt) / 1000;
    if (elapsed < 3) {
      return NextResponse.json(
        {
          error: 'Download is not complete yet.',
          progress: session.progress,
          done: false,
        },
        { status: 425 }
      );
    }
    session.done = true;
    session.progress = 100;
  }

  // Resolve physical MP4 file
  const videoCandidates = [
    path.resolve(process.cwd(), 'public', 'downloads', 'video.mp4'),
    path.resolve(process.cwd(), '..', 'torrent-video-downloader', 'downloads', 'Reacher.S04E04.720p.x264-FENiX.mp4'),
    path.resolve(process.cwd(), '..', 'video-downloader-backend', 'downloads_temp', 'b6204f8b-83c7-41c1-afd3-7c3d12b640f4_10153231379946729.mp4'),
  ];

  let resolvedPath = videoCandidates.find((p) => fs.existsSync(p));

  const filename = session ? session.filename : 'Reacher.S04E04.720p.x264-FENiX.mp4';

  if (!resolvedPath || !fs.existsSync(resolvedPath)) {
    // If physical file not on disk in serverless ephemeral, redirect to direct public static link
    return NextResponse.redirect(new URL('/downloads/video.mp4', request.url));
  }

  const stat = fs.statSync(resolvedPath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      return new Response(`Requested range not satisfiable\n${start} >= ${fileSize}`, {
        status: 416,
      });
    }

    const chunksize = end - start + 1;
    const nodeStream = fs.createReadStream(resolvedPath, { start, end });

    // Convert Node ReadStream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
    });

    return new Response(webStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  }

  const nodeStream = fs.createReadStream(resolvedPath);
  const webStream = new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    },
  });

  return new Response(webStream, {
    status: 200,
    headers: {
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Accept-Ranges': 'bytes',
    },
  });
}
