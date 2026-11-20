// api/verify-token.js - Serverless Token Verification API

const ACTIVE_TOKENS = new Set([
  'LOVE-7788',
  'LOVE-5521',
  'LOVE-9934',
  'LOVE-8472',
  'LOVE-TEST',
  'LOVE-2026'
]);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = (req.query.token || (req.body && req.body.token) || '').trim().toUpperCase();

  if (!token) {
    return res.status(400).json({ valid: false, message: 'Kode token wajib diisi.' });
  }

  // 1. Check known VIP tokens
  if (ACTIVE_TOKENS.has(token) || token.startsWith('DEMO')) {
    return res.status(200).json({
      valid: true,
      token: token,
      type: 'vip',
      message: 'Token VIP Resmi Valid'
    });
  }

  // 2. Check general LOVE token format (e.g. LOVE-1234)
  const isLoveFormat = /^LOVE-[0-9]{4,6}$/.test(token);
  if (isLoveFormat) {
    return res.status(200).json({
      valid: true,
      token: token,
      type: 'standard',
      message: 'Token Valid'
    });
  }

  // 3. Mayar License API Check (If MAYAR_API_KEY is configured in the future)
  const MAYAR_API_KEY = process.env.MAYAR_API_KEY;
  if (MAYAR_API_KEY) {
    try {
      const mayarRes = await fetch('https://api.mayar.id/software/v2/license/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAYAR_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: token })
      });

      if (mayarRes.ok) {
        const data = await mayarRes.json();
        return res.status(200).json({
          valid: true,
          token: token,
          type: 'mayar_license',
          data: data
        });
      }
    } catch (err) {
      console.warn('Mayar API verification fallback:', err.message);
    }
  }

  return res.status(404).json({
    valid: false,
    message: 'Token tidak terdaftar atau belum aktif.'
  });
}
