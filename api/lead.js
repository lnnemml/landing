// /api/lead.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    await resend.emails.send({
  from: process.env.RESEND_FROM,
  to: process.env.RESEND_TO,
  subject: '🧠 Новий лід з ISRIB-лендінгу',
  html: `<p>Нова заявка: <strong>${email}</strong></p>`,
});


    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[RESEND_ERROR]', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
