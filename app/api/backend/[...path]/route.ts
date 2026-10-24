import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://node5.botkeep.cloud:41076').replace(/\/+$/, '');

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const subpath = resolvedParams.path ? resolvedParams.path.join('/') : '';
    const search = request.nextUrl.search || '';
    const targetUrl = `${BACKEND_BASE}/api/${subpath}${search}`;

    // Build clean headers forwarding to backend
    const forwardHeaders = new Headers();
    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Drop browser host / hop-by-hop headers
      if (!['host', 'connection', 'content-length', 'content-encoding'].includes(lower)) {
        forwardHeaders.set(key, value);
      }
    });

    const isGetOrHead = request.method === 'GET' || request.method === 'HEAD';
    const body = isGetOrHead ? undefined : await request.arrayBuffer();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
      // @ts-ignore
      duplex: 'half',
      cache: 'no-store',
    });

    // Copy backend response headers
    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!['transfer-encoding', 'connection', 'content-encoding'].includes(lower)) {
        resHeaders.set(key, value);
      }
    });

    // Ensure permissive CORS so frontend clients are never blocked
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', '*');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        detail: `Backend proxy connection error: ${error?.message || 'Unable to reach backend service.'}`,
      },
      {
        status: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
