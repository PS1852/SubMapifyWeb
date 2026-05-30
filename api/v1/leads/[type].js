import nodemailer from 'nodemailer';

const allowedTypes = new Set(['pilot', 'demo', 'contact']);

function escapeHtml(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatKey(key) {
  return key
    .replace(/^_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function required(value) {
  return typeof value === 'string' && value.trim().length > 1;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { type } = req.query;
  if (!allowedTypes.has(type)) {
    return res.status(404).json({ success: false, message: 'Unknown lead type' });
  }

  const payload = req.body || {};

  if (payload.website) {
    return res.status(201).json({ success: true, message: 'Request submitted successfully.' });
  }

  if (!required(payload.name) || !required(payload.company) || !required(payload.role) || !required(payload.email)) {
    return res.status(422).json({ success: false, message: 'Please fill all required fields.' });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, message: 'Email service is not configured.' });
  }

  const cleanedPayload = { ...payload };
  delete cleanedPayload.website;
  delete cleanedPayload._loadedAt;

  const rows = Object.entries(cleanedPayload)
    .map(([key, value]) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #303236;font-weight:700;color:#ff8c00;width:190px;">${escapeHtml(formatKey(key))}</td>
        <td style="padding:10px;border-bottom:1px solid #303236;color:#e2e2e6;">${escapeHtml(value)}</td>
      </tr>
    `)
    .join('');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
    subject: `[SubMapify Website] New ${type.toUpperCase()} Request - ${escapeHtml(payload.name)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#111316;color:#e2e2e6;border:1px solid #333538;">
        <div style="padding:22px 24px;background:#1e2023;border-bottom:1px solid #333538;">
          <h2 style="margin:0;color:#ff8c00;">SubMapify Lead Captured</h2>
          <p style="margin:6px 0 0;color:#ddc1ae;">Type: ${escapeHtml(type.toUpperCase())}</p>
        </div>
        <div style="padding:20px 24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `,
  });

  return res.status(201).json({ success: true, message: `${type} request submitted successfully.` });
}
