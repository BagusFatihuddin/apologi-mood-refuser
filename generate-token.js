/**
 * GENERATE TOKEN AKSES RUANG BERDAMAI
 * Script untuk Developer / Owner membuat token pembeli
 * 
 * Penggunaan:
 * node generate-token.js [jumlah_token]
 * Contoh: node generate-token.js 3
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const count = parseInt(process.argv[2] || '1', 10);
const configPath = path.join(process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');

function getValidAccessToken() {
  if (!fs.existsSync(configPath)) {
    console.error("❌ Firebase config tidak ditemukan.");
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens.access_token;
}

let accessToken = getValidAccessToken();

function refreshAccessTokenSilently() {
  try {
    execSync('firebase projects:list', { stdio: 'ignore' });
    accessToken = getValidAccessToken();
  } catch (err) {
    console.warn("Peringatan auto-refresh token:", err.message);
  }
}

function generateRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LOVE-${rand}`;
}

async function createTokenDoc(tokenCode, isRetry = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/ruang-damai-bubu/databases/(default)/documents/tokens/${tokenCode}`);
    
    const body = JSON.stringify({
      fields: {
        status: { stringValue: 'active' },
        created_at: { timestampValue: new Date().toISOString() },
        device_fingerprint: { nullValue: null },
        slug: { nullValue: null }
      }
    });

    const req = https.request(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, async (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(tokenCode);
        } else if (res.statusCode === 401 && !isRetry) {
          // Token expired, auto refresh and retry once
          refreshAccessTokenSilently();
          try {
            const retriedCode = await createTokenDoc(tokenCode, true);
            resolve(retriedCode);
          } catch (retryErr) {
            reject(retryErr);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`\n========================================`);
  console.log(`🌸 RUANG BERDAMAI — GENERATOR TOKEN 🌸`);
  console.log(`Membuat ${count} token baru di Firestore...`);
  console.log(`========================================\n`);

  const created = [];
  for (let i = 0; i < count; i++) {
    const code = generateRandomCode();
    try {
      await createTokenDoc(code);
      created.push(code);
      console.log(`✅ [${i + 1}/${count}] Token dibuat: ${code}`);
    } catch (e) {
      console.error(`❌ Gagal membuat token: ${e.message}`);
    }
  }

  console.log(`\n----------------------------------------`);
  console.log(`📋 TEMPLATE PESAN WA SIAP KIRIM KE PEMBELI:`);
  console.log(`----------------------------------------`);
  created.forEach(code => {
    console.log(`
Halo Kak! Pembayaran sudah terverifikasi yaa ✨

Ini Token Akses VIP Ruang Berdamai Kakak:
👉 Kode Token: *${code}*

Silakan buka link berikut di HP Kakak:
https://apologi-mood-refuser.vercel.app/buat (atau http://localhost:3000/buat)

💡 *Catatan:*
- Begitu Kakak memasukkan token di HP Kakak, token ini otomatis terikat selamanya ke HP Kakak.
- Kakak bisa membuka kembali & mengedit isi permohonan maaf kapan pun secara gratis!
- Selamat berdamai dengan si dia ya Kak! 💕
    `);
  });
}

main();
