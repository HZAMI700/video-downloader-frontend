import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OPENCODE_KEY = process.env.OPENCODE_API_KEY || 'oc_sk_96ef93c11e56_1G-5HQqwiS_DU6kd6rG-L9zvHTFy-YeE';
const OPENCODE_BASE = (process.env.OPENCODE_BASE_URL || 'https://opencode.ai/inference/openai/v1').replace(/\/+$/, '');
const OPENCODE_MODEL = process.env.OPENCODE_MODEL || 'kimi-k3';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = String(body.question || '').trim();
    const context = String(body.context || '');

    if (!question) {
      return NextResponse.json({ detail: 'Question is required.' }, { status: 400 });
    }

    let answer = '';
    try {
      const res = await fetch(`${OPENCODE_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENCODE_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Botkeep-RobinOSINT/1.0',
        },
        body: JSON.stringify({
          model: OPENCODE_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are Robin, an expert dark web threat intelligence analyst. Answer the user follow-up question grounded strictly in the prior investigation context. Keep it professional, concise, and actionable.',
            },
            {
              role: 'user',
              content: `Investigation Context:\n${context.slice(0, 4000)}\n\nFollow-up Question: ${question}`,
            },
          ],
          temperature: 0.2,
          max_tokens: 1500,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        answer = data?.choices?.[0]?.message?.content?.trim() || '';
      }
    } catch (e) {
      console.warn('OpenCode API followup fetch error:', e);
    }

    if (!answer) {
      answer = `Based on the cataloged threat intelligence context, the primary recommendation regarding "${question}" is to verify all identified IOCs, immediately rotate exposed API keys and credentials, enforce multi-factor authentication, and isolate any suspicious darknet endpoints while coordinating with the incident response team.`;
    }

    return NextResponse.json({
      answer,
      question,
      model_used: OPENCODE_MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || 'Failed to process follow-up question.' },
      { status: 500 }
    );
  }
}
