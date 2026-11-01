import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LEGAL_DISCLAIMER_TEXT =
  'LEGAL DISCLAIMER / إخلاء مسؤولية قانوني: هذه الميزة مخصصة للتحقيقات القانونية والتعليمية فقط. لا تفحص بريدًا إلكترونيًا دون إذن صريح من صاحبه. This feature is strictly intended for authorized legal investigations and educational security research only. Do not scan an email address without explicit permission from its owner.';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Blackbird OSINT Email Checker (Edge Proxy)',
    blackbird_installed: true,
    blackbird_enabled: true,
    werkzeug_version: '2.2.2',
    rate_limit_per_minute: 5,
    timeout_seconds: 120,
    ai_enabled: true,
    disclaimer: LEGAL_DISCLAIMER_TEXT,
    timestamp: new Date().toISOString(),
  });
}
