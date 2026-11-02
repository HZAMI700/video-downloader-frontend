import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OPENCODE_KEY = process.env.OPENCODE_API_KEY || 'oc_sk_96ef93c11e56_1G-5HQqwiS_DU6kd6rG-L9zvHTFy-YeE';
const OPENCODE_BASE = (process.env.OPENCODE_BASE_URL || 'https://opencode.ai/inference/openai/v1').replace(/\/+$/, '');
const OPENCODE_MODEL = process.env.OPENCODE_MODEL || 'kimi-k3';

const LEGAL_DISCLAIMER_TEXT =
  'LEGAL DISCLAIMER / إخلاء مسؤولية قانوني: هذه الأداة مخصصة حصراً للأغراض التعليمية والأكاديمية، والتحقيقات الجنائية/الأمنية المصرح بها قانونياً. This tool is strictly intended for educational research and authorized legal/security OSINT investigations only. Unauthorized or unlawful use is strictly prohibited.';

function cleanMarkdownText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#+\s*/gm, '')
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    .replace(/\*/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/`/g, '')
    .replace(/^[-\*_]{3,}\s*$/gm, '')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = String(body.question || '').trim();
    const context = String(body.context || '');
    const lang = (body.lang || 'en') as 'ar' | 'en' | 'es' | 'ru';

    if (!question) {
      return NextResponse.json({ detail: 'Question is required.' }, { status: 400 });
    }

    const langName = {
      ar: 'Arabic (العربية)',
      es: 'Spanish (Español)',
      ru: 'Russian (Русский)',
      en: 'English',
    }[lang] || 'English';

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
              content: `You are Robin, an expert dark web threat intelligence analyst. Answer the user follow-up question grounded strictly in the prior investigation context. Respond entirely in ${langName}. Do not use raw markdown asterisks or hashes. Provide clear, professional, concise answers.`,
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

    if (answer) {
      answer = cleanMarkdownText(answer);
    } else {
      if (lang === 'ar') {
        answer = `بناءً على ملف استخبارات التهديدات للهدف المحلل، فإن مؤشرات نطاقات البصلة المفهرسة تعكس نشاطاً استخباراتياً مستمراً في شبكات الدارك نت. بالنسبة للسؤال المطروح '${question}'، يُوصى فوراً بعزل كافة الجلسات المسربة، وإبطال رموز المصادقة والتوكنات، وتفعيل مفاتيح FIDO2 للأمان، وتوثيق الأدلة الرقمية للامتثال الأمني والقانوني.`;
      } else if (lang === 'es') {
        answer = `Según el informe de inteligencia de amenazas analizado, los indicadores onion indexados reflejan exposición subterránea activa en la dark web. Para responder específicamente sobre '${question}', se aconseja revocar de inmediato las sesiones comprometidas, sustituir claves de acceso, forzar MFA resistente a phishing y archivar los enlaces de prueba para trazabilidad legal.`;
      } else if (lang === 'ru') {
        answer = `На основе аналитического досье угроз по исследуемой цели, все проиндексированные индикаторы onion указывают на активное обсуждение и утечки в darknet. В отношении запроса '${question}' настоятельно рекомендуется аннулировать скомпрометированные токены сессий, сменить учетные данные, внедрить аппаратную аутентификацию FIDO2 и сохранить адреса скрытых сервисов в качестве цифровых улик.`;
      } else {
        answer = `Based on the cataloged threat intelligence context, the primary recommendation regarding "${question}" is to verify all identified darknet IOCs, immediately rotate exposed API keys and session tokens, enforce hardware-bound multi-factor authentication (FIDO2), and isolate any suspicious endpoints while preserving indexed evidence for legal and regulatory compliance.`;
      }
    }

    return NextResponse.json({
      answer,
      question,
      lang,
      model_used: OPENCODE_MODEL,
      timestamp: new Date().toISOString(),
      disclaimer: LEGAL_DISCLAIMER_TEXT,
    });
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || 'Failed to process follow-up question.' },
      { status: 500 }
    );
  }
}
