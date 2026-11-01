import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LEGAL_DISCLAIMER_TEXT =
  'LEGAL DISCLAIMER / إخلاء مسؤولية قانوني: هذه الميزة مخصصة للتحقيقات القانونية والتعليمية فقط. لا تفحص بريدًا إلكترونيًا دون إذن صريح من صاحبه. This feature is strictly intended for authorized legal investigations and educational security research only. Do not scan an email address without explicit permission from its owner.';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || 'target').trim();
    const accounts = Array.isArray(body.accounts) ? body.accounts : [];

    const platforms = accounts.map((a: any) => a.platform || 'Platform');
    const categories = Array.from(new Set(accounts.map((a: any) => a.category || 'General')));

    const analysis = `AI Digital Footprint & Risk Assessment for "${email}":

1. Exposure Surface & Breadth:
   - Linked accounts detected: ${accounts.length} platforms (${platforms.join(', ')}).
   - Domain diversity: Spans ${categories.length} functional categories (${categories.join(', ')}).

2. Credential Stuffing & Attack Vector Assessment:
   - High correlation across personal, media, and productivity accounts.
   - If common or reused passwords were utilized, a compromise of any single platform could expose access across the remaining linked accounts.

3. Actionable Defense & Containment Playbook:
   - Deprecate / remove dormant account profiles where service is no longer actively used.
   - Deploy a dedicated password manager to generate distinct 20+ character passwords for every platform.
   - Enforce WebAuthn / FIDO2 security keys on high-value identity providers.`;

    return NextResponse.json({
      email,
      analysis,
      platforms_analyzed: platforms,
      disclaimer: LEGAL_DISCLAIMER_TEXT,
    });
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || 'Error processing AI footprint analysis.' },
      { status: 500 }
    );
  }
}
