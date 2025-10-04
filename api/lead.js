// /api/lead.js  (Vercel Serverless Function)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // на випадок префлайту (іноді буває через проксі/браузери)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ ok: false, error: 'INVALID_EMAIL' });
    }

    // Безпека: перевіримо, що ключ і відправник присутні
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ ok: false, error: 'MISSING_RESEND_API_KEY' });
    }
    if (!process.env.RESEND_FROM) {
      return res.status(500).json({ ok: false, error: 'MISSING_RESEND_FROM' });
    }
    if (!process.env.RESEND_TO) {
      return res.status(500).json({ ok: false, error: 'MISSING_RESEND_TO' });
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM,          // має бути з верифікованого домену
      to: process.env.RESEND_TO,
      subject: '🧠 Новий лід з ISRIB-лендінгу',
      html: `<p>Нова заявка:</p><p><strong>Email:</strong> ${email}</p>`,
    });

    // Resend інколи повертає помилки у result.error
    if (result?.error) {
      return res.status(500).json({ ok: false, error: `RESEND_ERROR: ${result.error.message || 'Unknown'}` });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[LEAD_HANDLER_ERROR]', err);
    // Пробуємо вивести повідомлення Resend
    const msg = err?.message || 'UNKNOWN';
    return res.status(500).json({ ok: false, error: `EXCEPTION: ${msg}` });
  }
}
