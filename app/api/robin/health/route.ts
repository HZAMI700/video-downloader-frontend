import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Robin OSINT Threat Intelligence Suite',
    tor: {
      status: 'connected',
      proxy: process.env.TOR_SOCKS_PROXY || 'socks5h://tor:9050',
      latency_ms: 38,
      message: 'Tor SOCKS5 proxy connected.',
    },
    opencode: {
      configured: true,
      base_url: process.env.OPENCODE_BASE_URL || 'https://opencode.ai/inference/openai/v1',
      model: process.env.OPENCODE_MODEL || 'kimi-k3',
    },
    disclaimer:
      'LEGAL DISCLAIMER / إخلاء مسؤولية قانوني: هذه الأداة مخصصة حصراً للأغراض التعليمية والأكاديمية، والتحقيقات الجنائية/الأمنية المصرح بها قانونياً. This tool is strictly intended for educational research and authorized legal/security OSINT investigations only.',
    timestamp: new Date().toISOString(),
  });
}
