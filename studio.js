// studio.js - Creator Studio for Ruang Berdamai (Bubu & Dudu Edition)

// 1. Firebase Project Initialization
const firebaseConfig = {
  apiKey: "AIzaSyAcL1mptIZw7Z7EnhFtga4xVAvecE1WIAs",
  authDomain: "ruang-damai-bubu.firebaseapp.com",
  projectId: "ruang-damai-bubu",
  storageBucket: "ruang-damai-bubu.firebasestorage.app",
  messagingSenderId: "157373986860",
  appId: "1:157373986860:web:bf3879b330c53bccccb989"
};

let db = null;
let isFirebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    isFirebaseReady = true;
  }
} catch (e) {
  console.warn("Firebase init notice:", e.message);
}

// 2. Hardware & Canvas Device Fingerprint Engine
let deviceFingerprint = null;

async function generateDeviceFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Bubu&Dudu<3', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('RuangDamai2026', 4, 17);
    const canvasData = canvas.toDataURL();

    const raw = [
      navigator.userAgent || '',
      navigator.hardwareConcurrency || 4,
      navigator.language || 'id-ID',
      screen.width + 'x' + screen.height,
      screen.colorDepth || 24,
      new Date().getTimezoneOffset(),
      canvasData.slice(20, 100)
    ].join('###');

    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return 'DEV_' + hashHex.substring(0, 28);
  } catch (err) {
    let stored = localStorage.getItem('ruang_damai_dev_id');
    if (!stored) {
      stored = 'DEV_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('ruang_damai_dev_id', stored);
    }
    return stored;
  }
}

// 3. Preset Messages (4 Persona Riset Media Sosial)
const PRESETS = {
  tulus: "Hai sayang... Aku paham banget kenapa kamu kesel dan bad mood sama aku hari ini, dan itu murni salahku. Aku gak mau membela diri karena perasaan kamu valid banget untuk kecewa. Aku bener-bener minta maaf ya manis. Aku kangen senyum kamu dan pengen dengerin apa pun yang bikin kamu ganjel di hati.",
  humor: "Halo pawangku yang cantiknya gak ngotak tapi lagi mode siaga 1... 😭🙏 Aku ngaku, otakku kemarin lagi konslet parah sampai bikin kamu darah tinggi. Tolong jangan coret aku dari kartu keluarga cinta ya. Daripada kamu cemberut terus nanti cantiknya tiris, mending hukum aku sepuasnya di bawah ini. Dompetku udah pasrah kok!",
  manja: "Bubu sayang... Jangan diemin Dudu terus yaa, sepi banget rasanya kayak rumah kosong kalau kamu ngambek 🥺. Dudu sedih liat kamu sedih gara-gara kelakuan Dudu. Dudu janji bakal lebih peka lagi ke depannya. Dimaafin yaa sayang? Dudu kangen peluk kamu erat-erat...",
  solutif: "Sayang, aku tahu aku salah dan bikin rencana kita kacau hari ini. Gak ada alasan, aku bener-bener minta maaf. Biar adil, kamu berhak pilih hukuman dan traktiran apa pun di halaman ini, nanti langsung aku lunasin tanpa debat. Baikan ya?"
};

// 4. Default Catalog Treats with Icons
const DEFAULT_TREATS = [
  { icon: '🍜', title: 'Traktir Seblak Level Pedas', desc: 'Sensasi pedas gurih buat ngilangin rasa kesel kamu.' },
  { icon: '🧋', title: 'Segelas Boba Matcha Dingin', desc: 'Minuman manis penyejuk hati yang lagi panas.' },
  { icon: '☕', title: 'Nongkrong di Cafe Favorit', desc: 'Ngopi santai sambil dengerin uneg-uneg kamu berdua.' },
  { icon: '🛵', title: 'Motoran Malam (Night Ride)', desc: 'Cari angin malam sambil keliling kota santai.' },
  { icon: '🎬', title: 'Nonton Bioskop VIP + Popcorn', desc: 'Kamu yang pilih filmnya, aku yang bayarin semuanya.' },
  { icon: '🏖️', title: 'Jalan Santai ke Pantai / Taman', desc: 'Healing tipis-tipis biar pikiran fresh lagi.' },
  { icon: '🤗', title: 'Deep Talk & Peluk Hangat 1 Jam', desc: 'Dengerin kamu tanpa disela dan dipeluk erat.' },
  { icon: '👑', title: 'Bebas Jadi Ratu Seharian (No Debat)', desc: 'Apapun kemauan kamu hari ini wajib dituruti!' }
];

// State
let validatedToken = null;
let isTokenBoundToUs = false;
let currentSlug = null;
let currentTemplate = 'polaroid';
let randomSlugSuffix = Math.random().toString(36).substring(2, 6);

// DOM Elements
const tokenGateSection = document.getElementById('tokenGateSection');
const tokenInput = document.getElementById('tokenInput');
const btnVerifyToken = document.getElementById('btnVerifyToken');
const tokenStatusBox = document.getElementById('tokenStatusBox');
const tokenStatusIcon = document.getElementById('tokenStatusIcon');
const tokenStatusMsg = document.getElementById('tokenStatusMsg');

const creatorForm = document.getElementById('creatorForm');
const partnerNameInput = document.getElementById('partnerNameInput');
const senderNameInput = document.getElementById('senderNameInput');
const waNumberInput = document.getElementById('waNumberInput');

const letterInput = document.getElementById('letterInput');
const letterCharCount = document.getElementById('letterCharCount');
const presetButtons = document.querySelectorAll('.preset-btn');
const coupleChips = document.querySelectorAll('.couple-chip');

const treatsList = document.getElementById('treatsList');
const newTreatInput = document.getElementById('newTreatInput');
const newTreatIconSelect = document.getElementById('newTreatIconSelect');
const btnAddTreat = document.getElementById('btnAddTreat');

const slugPreviewText = document.getElementById('slugPreviewText');
const qrQuoteInput = document.getElementById('qrQuoteInput');
const qrQuoteCount = document.getElementById('qrQuoteCount');
const btnPreviewPage = document.getElementById('btnPreviewPage');
const btnPublish = document.getElementById('btnPublish');
const btnPublishText = document.getElementById('btnPublishText');

const resultCard = document.getElementById('resultCard');
const liveLinkUrl = document.getElementById('liveLinkUrl');
const btnCopyLink = document.getElementById('btnCopyLink');
const btnOpenLiveLink = document.getElementById('btnOpenLiveLink');
const btnShareWA = document.getElementById('btnShareWA');
const photocardCanvas = document.getElementById('photocardCanvas');
const btnDownloadPhotocard = document.getElementById('btnDownloadPhotocard');
const templateChips = document.querySelectorAll('.template-chip');

// Initialize Studio
async function initStudio() {
  deviceFingerprint = await generateDeviceFingerprint();

  // Render initial treats
  renderInitialTreats();

  // Check if token already exists in localStorage (PERSISTENT ACCESS)
  const storedToken = localStorage.getItem('last_active_token');
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  const candidateToken = tokenFromUrl || storedToken;

  if (candidateToken) {
    tokenInput.value = candidateToken.toUpperCase();
    await verifyToken(candidateToken.toUpperCase(), true);
  }

  // Token button listener
  btnVerifyToken.addEventListener('click', () => {
    const val = tokenInput.value.trim().toUpperCase();
    if (val) verifyToken(val, false);
  });

  tokenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnVerifyToken.click();
    }
  });

  // Couple recommendation chips
  coupleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const p = chip.getAttribute('data-partner');
      const s = chip.getAttribute('data-sender');
      partnerNameInput.value = p;
      senderNameInput.value = s;
      updateAutoSlug();
      chip.classList.add('ring-2', 'ring-pink-400');
      setTimeout(() => chip.classList.remove('ring-2', 'ring-pink-400'), 400);
    });
  });

  // Persona Presets
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-preset');
      if (PRESETS[pKey]) {
        letterInput.value = PRESETS[pKey];
        updateCharCount();
        presetButtons.forEach(b => b.classList.replace('border-pink-500', 'border-stone-200'));
        btn.classList.replace('border-stone-200', 'border-pink-500');
      }
    });
  });

  // Set default preset
  if (!letterInput.value) {
    letterInput.value = PRESETS.tulus;
  }
  letterInput.addEventListener('input', updateCharCount);
  updateCharCount();

  // Dynamic Slug listener
  partnerNameInput.addEventListener('input', updateAutoSlug);
  senderNameInput.addEventListener('input', updateAutoSlug);
  updateAutoSlug();

  // Custom Treat Adder
  btnAddTreat.addEventListener('click', addCustomTreat);
  newTreatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTreat();
    }
  });

  // Preview Button
  btnPreviewPage.addEventListener('click', previewApologyPage);

  // QR Quote Input Listener
  if (qrQuoteInput) {
    qrQuoteInput.addEventListener('input', async () => {
      if (qrQuoteCount) qrQuoteCount.textContent = `${qrQuoteInput.value.length}/100`;
      if (!resultCard.classList.contains('hidden')) {
        const partnerName = partnerNameInput.value.trim() || 'Bubu';
        const senderName = senderNameInput.value.trim() || 'Dudu';
        const targetUrl = `${window.location.origin}/love/${currentSlug}`;
        await renderPhotocard(partnerName, senderName, targetUrl, currentTemplate);
      }
    });
  }

  // Publish Button
  btnPublish.addEventListener('click', publishApologyPage);

  // Copy Link Button
  btnCopyLink.addEventListener('click', copyLiveLink);

  // Download Photocard Button
  btnDownloadPhotocard.addEventListener('click', downloadPhotocardImage);

  // Template Switcher
  templateChips.forEach(chip => {
    chip.addEventListener('click', async () => {
      templateChips.forEach(c => {
        c.classList.replace('border-pink-500', 'border-stone-200');
        c.classList.replace('bg-pink-100', 'bg-white');
        c.classList.replace('text-pink-700', 'text-stone-600');
      });
      chip.classList.replace('border-stone-200', 'border-pink-500');
      chip.classList.replace('bg-white', 'bg-pink-100');
      chip.classList.replace('text-stone-600', 'text-pink-700');

      currentTemplate = chip.getAttribute('data-template');
      const partnerName = partnerNameInput.value.trim() || 'Bubu';
      const senderName = senderNameInput.value.trim() || 'Dudu';
      const targetUrl = `${window.location.origin}/love/${currentSlug}`;
      await renderPhotocard(partnerName, senderName, targetUrl, currentTemplate);
    });
  });
}

function updateCharCount() {
  letterCharCount.textContent = `${letterInput.value.length}/2000`;
}

function updateAutoSlug() {
  const p = partnerNameInput.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'bubu';
  const s = senderNameInput.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'dudu';
  
  if (!currentSlug) {
    currentSlug = `${p}-dan-${s}-${randomSlugSuffix}`;
  } else {
    // Keep existing suffix
    const parts = currentSlug.split('-');
    const suffix = parts.length >= 4 ? parts[parts.length - 1] : randomSlugSuffix;
    currentSlug = `${p}-dan-${s}-${suffix}`;
  }

  const origin = window.location.origin;
  slugPreviewText.textContent = `${origin}/love/${currentSlug}`;
}

function renderInitialTreats() {
  treatsList.innerHTML = '';
  DEFAULT_TREATS.forEach((t, idx) => {
    const isChecked = idx < 4 ? 'checked' : '';
    const label = document.createElement('label');
    label.className = 'flex items-center justify-between p-3 rounded-2xl bg-white border border-pink-100 hover:border-pink-300 transition-all cursor-pointer shadow-xs';
    label.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-lg flex-shrink-0">
          ${t.icon}
        </div>
        <div>
          <div class="text-xs sm:text-sm font-bold text-bubu-brown treat-title">${escapeHtml(t.title)}</div>
          <div class="text-[10px] text-stone-400">${escapeHtml(t.desc)}</div>
        </div>
      </div>
      <input type="checkbox" name="treatOption" value="${escapeHtml(t.icon + ' ' + t.title)}" ${isChecked} class="w-4 h-4 rounded text-pink-500 focus:ring-pink-400">
    `;
    treatsList.appendChild(label);
  });
}

function addCustomTreat() {
  const icon = newTreatIconSelect.value;
  const val = newTreatInput.value.trim();
  if (!val) return;

  const fullTitle = `${icon} ${val}`;
  const label = document.createElement('label');
  label.className = 'flex items-center justify-between p-3 rounded-2xl bg-pink-50/50 border border-pink-300 transition-all cursor-pointer shadow-xs animate-fadeIn';
  label.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-lg flex-shrink-0">
        ${icon}
      </div>
      <div>
        <div class="text-xs sm:text-sm font-bold text-bubu-brown treat-title">${escapeHtml(fullTitle)}</div>
        <div class="text-[10px] text-pink-600 font-semibold">Traktiran Khusus Kamu</div>
      </div>
    </div>
    <input type="checkbox" name="treatOption" value="${escapeHtml(fullTitle)}" checked class="w-4 h-4 rounded text-pink-500 focus:ring-pink-400">
  `;
  treatsList.prepend(label);
  newTreatInput.value = '';
}

// Token Verification & Gatekeeper Handler
async function verifyToken(tokenCode, isAutoCheck = false) {
  tokenCode = tokenCode.trim().toUpperCase();
  if (!tokenCode || tokenCode.length < 3) {
    if (!isAutoCheck) showTokenStatus('error', 'Format token tidak valid.');
    return;
  }

  if (!isAutoCheck) showTokenStatus('loading', 'Memverifikasi keaslian token...');

  // Demo tokens support
  if (tokenCode.startsWith('DEMO') || tokenCode === 'LOVE-TEST' || tokenCode === 'LOVE-2026') {
    grantAccess(tokenCode, 'Token Demo Valid! Selamat mencoba.');
    return;
  }

  if (!isFirebaseReady || !db) {
    grantAccess(tokenCode, `Token ${tokenCode} aktif! (Mode siaga Firestore)`);
    return;
  }

  try {
    const docRef = db.collection('tokens').doc(tokenCode);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firebase timeout')), 2500)
    );
    const docSnap = await Promise.race([docRef.get(), timeoutPromise]);

    if (!docSnap.exists) {
      // Auto-provision for valid test tokens
      await Promise.race([
        docRef.set({
          status: 'active',
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          device_fingerprint: deviceFingerprint,
          slug: null
        }),
        timeoutPromise
      ]);
      grantAccess(tokenCode, '✅ Token Baru Berhasil Diaktivasi!');
      return;
    }

    const data = docSnap.data();
    const boundDevice = data.device_fingerprint;

    if (!boundDevice || boundDevice === '') {
      // Unbound: bind now
      await Promise.race([
        docRef.update({ device_fingerprint: deviceFingerprint }),
        timeoutPromise
      ]);
      grantAccess(tokenCode, '✅ Token Berhasil Diikat ke Perangkat Ini!');
    } else if (boundDevice === deviceFingerprint) {
      // Returning user on same device -> BYPASS GATEKEEPER
      grantAccess(tokenCode, '👋 Selamat Datang Kembali!');
      if (data.slug) {
        currentSlug = data.slug;
        loadExistingPageData(data.slug);
      }
    } else {
      // Different device
      if (!isAutoCheck) {
        showTokenStatus('error', '⚠️ Token ini sudah terikat ke HP/perangkat lain! Demi keamanan, token hanya berlaku untuk perangkat pembelinya.');
      }
    }
  } catch (err) {
    grantAccess(tokenCode, `✅ Token ${tokenCode} aktif!`);
  }
}

function grantAccess(tokenCode, msg) {
  validatedToken = tokenCode;
  isTokenBoundToUs = true;
  localStorage.setItem('last_active_token', tokenCode);

  // HIDE TOKEN GATEKEEPER & REVEAL FORM
  tokenGateSection.classList.add('hidden');
  creatorForm.classList.remove('hidden');

  showTokenStatus('success', msg);
}

function showTokenStatus(type, msg) {
  tokenStatusBox.classList.remove('hidden', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-800', 'bg-rose-50', 'border-rose-200', 'text-rose-800', 'bg-amber-50', 'border-amber-200', 'text-amber-800');
  
  if (type === 'success') {
    tokenStatusBox.classList.add('bg-emerald-50', 'border', 'border-emerald-200', 'text-emerald-800');
    tokenStatusIcon.innerHTML = `✓`;
  } else if (type === 'error') {
    tokenStatusBox.classList.add('bg-rose-50', 'border', 'border-rose-200', 'text-rose-800');
    tokenStatusIcon.innerHTML = `✕`;
  } else {
    tokenStatusBox.classList.add('bg-amber-50', 'border', 'border-amber-200', 'text-amber-800');
    tokenStatusIcon.innerHTML = `⏳`;
  }
  tokenStatusMsg.textContent = msg;
}

async function loadExistingPageData(slug) {
  if (!db) return;
  try {
    const snap = await db.collection('apology_pages').doc(slug).get();
    if (snap.exists) {
      const p = snap.data();
      partnerNameInput.value = p.partner_name || 'Bubu';
      senderNameInput.value = p.sender_name || 'Dudu';
      waNumberInput.value = p.whatsapp_number || '';
      letterInput.value = p.letter_message || '';
      updateCharCount();
      if (p.qr_quote && qrQuoteInput) {
        qrQuoteInput.value = p.qr_quote;
        if (qrQuoteCount) qrQuoteCount.textContent = `${p.qr_quote.length}/100`;
      }
      updateAutoSlug();

      if (Array.isArray(p.compensations)) {
        document.querySelectorAll('input[name="treatOption"]').forEach(cb => {
          cb.checked = p.compensations.includes(cb.value);
        });
      }
    }
  } catch (e) {
    console.warn("Could not load existing apology page:", e);
  }
}

// Preview Handler: Opens in new tab before sending
function previewApologyPage() {
  const partnerName = partnerNameInput.value.trim() || 'Bubu';
  const senderName = senderNameInput.value.trim() || 'Dudu';
  const waNumber = waNumberInput.value.trim().replace(/[^0-9]/g, '');
  const letter = letterInput.value.trim();

  const compensations = [];
  document.querySelectorAll('input[name="treatOption"]:checked').forEach(cb => {
    compensations.push(cb.value);
  });

  const qrQuote = (qrQuoteInput && qrQuoteInput.value.trim()) ? qrQuoteInput.value.trim() : '"Dudu nyesel banget... Jangan ngambek lagi ya manis? 💕"';

  const previewPayload = {
    partner_name: partnerName,
    sender_name: senderName,
    whatsapp_number: waNumber,
    letter_message: letter,
    compensations: compensations,
    qr_quote: qrQuote
  };

  localStorage.setItem('local_page_' + currentSlug, JSON.stringify(previewPayload));
  window.open(`/love/${currentSlug}?preview=1`, '_blank');
}

// Publish Handler
async function publishApologyPage() {
  if (!validatedToken) {
    alert("Silakan aktifkan kode token akses terlebih dahulu!");
    return;
  }

  const partnerName = partnerNameInput.value.trim();
  const senderName = senderNameInput.value.trim();
  let waNumber = waNumberInput.value.trim().replace(/[^0-9]/g, '');
  const letter = letterInput.value.trim();

  if (!partnerName || !senderName) {
    alert("Mohon lengkapi nama panggilan kamu dan pasangan!");
    return;
  }

  if (!waNumber) {
    alert("Mohon masukkan nomor WhatsApp untuk menerima pesan damai!");
    return;
  }

  if (waNumber.startsWith('0')) {
    waNumber = '62' + waNumber.substring(1);
  }

  const compensations = [];
  document.querySelectorAll('input[name="treatOption"]:checked').forEach(cb => {
    compensations.push(cb.value);
  });

  if (compensations.length === 0) {
    alert("Pilih minimal satu denda traktiran sebagai tanda ketulusan damai!");
    return;
  }

  btnPublish.disabled = true;
  btnPublishText.textContent = "Menerbitkan...";

  const qrQuote = (qrQuoteInput && qrQuoteInput.value.trim()) ? qrQuoteInput.value.trim() : '"Dudu nyesel banget... Jangan ngambek lagi ya manis? 💕"';

  const payload = {
    slug: currentSlug,
    token_code: validatedToken,
    device_fingerprint: deviceFingerprint,
    partner_name: partnerName,
    sender_name: senderName,
    whatsapp_number: waNumber,
    letter_message: letter,
    compensations: compensations,
    qr_quote: qrQuote,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    updated_at: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    if (isFirebaseReady && db) {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase timeout')), 3000)
      );
      try {
        await Promise.race([
          Promise.all([
            db.collection('apology_pages').doc(currentSlug).set(payload, { merge: true }),
            db.collection('tokens').doc(validatedToken).set({
              status: 'used',
              device_fingerprint: deviceFingerprint,
              slug: currentSlug
            }, { merge: true })
          ]),
          timeoutPromise
        ]);
      } catch (fbErr) {
        console.warn("Firestore sync fallback to local:", fbErr.message);
      }
    }

    localStorage.setItem('local_page_' + currentSlug, JSON.stringify(payload));

    const fullUrl = `${window.location.origin}/love/${currentSlug}`;
    liveLinkUrl.textContent = fullUrl;
    btnOpenLiveLink.href = `/love/${currentSlug}`;

    const waShareText = `Hai ${partnerName} sayang... Ada amplop darurat khusus buat kamu di sini: ${fullUrl} 💕 Buka ya manis, jangan ngambek lagi... 🥺`;
    btnShareWA.href = `https://wa.me/?text=${encodeURIComponent(waShareText)}`;

    // Render Canvas Photocard
    await renderPhotocard(partnerName, senderName, fullUrl, currentTemplate);

    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth' });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5E86', '#FF85A2', '#FFE4EC', '#FBBF24', '#48BB95']
    });

  } catch (err) {
    alert("Gagal menerbitkan: " + err.message);
  } finally {
    btnPublish.disabled = false;
    btnPublishText.textContent = "Perbarui Ruang Berdamai 💌";
  }
}

function copyLiveLink() {
  const url = liveLinkUrl.textContent;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => {
    btnCopyLink.textContent = "Tersalin! ✓";
    setTimeout(() => btnCopyLink.textContent = "Salin Link", 2000);
  });
}

// 5 TEMPLATE PHOTOCARD QR CANVAS ENGINE
async function renderPhotocard(partnerName, senderName, targetUrl, templateName = 'polaroid') {
  const canvas = photocardCanvas;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  const qrQuote = (qrQuoteInput && qrQuoteInput.value.trim()) 
    ? qrQuoteInput.value.trim() 
    : `"${senderName} nyesel banget... Jangan ngambek lagi ya manis? 💕"`;

  // Generate QR Code as image
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 240,
    margin: 1,
    color: {
      dark: '#2A1B12',
      light: '#FFFFFF'
    }
  });

  const qrImg = new Image();
  qrImg.src = qrDataUrl;
  await new Promise(res => { qrImg.onload = res; });

  if (templateName === 'polaroid') {
    renderPolaroidTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote);
  } else if (templateName === 'spotify') {
    renderSpotifyTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote);
  } else if (templateName === 'boarding') {
    renderBoardingPassTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote);
  } else if (templateName === 'voucher') {
    renderVoucherTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote);
  } else {
    renderMarshmallowTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote);
  }
}

// Draw Wrapped Text Helper for Canvas
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, align = 'center') {
  ctx.save();
  ctx.textAlign = align;
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Center vertical offset if multiple lines
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  for (let k = 0; k < lines.length; k++) {
    ctx.fillText(lines[k], x, startY + (k * lineHeight));
  }
  ctx.restore();
}

// Template 1: Polaroid Photobooth Card
function renderPolaroidTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote) {
  // Classic white photo card
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);

  // Subtle drop shadow border
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#E8E5DF';
  ctx.strokeRect(0, 0, w, h);

  // Washi Tape at Top Center
  ctx.fillStyle = '#FFB6C1';
  ctx.globalAlpha = 0.85;
  ctx.fillRect((w - 100) / 2, 8, 100, 20);
  ctx.globalAlpha = 1.0;

  // Photo Area Box
  const photoMargin = 28;
  const photoSize = w - (photoMargin * 2);
  ctx.fillStyle = '#FFF0F5';
  ctx.fillRect(photoMargin, 36, photoSize, photoSize + 40);

  // QR Code inside photo area
  const qrSize = 220;
  ctx.drawImage(qrImg, (w - qrSize) / 2, 80, qrSize, qrSize);

  // Couple Tag under QR
  ctx.fillStyle = '#FF5E86';
  ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(`✨ ${partnerName} & ${senderName} ✨`, w / 2, 335);

  ctx.fillStyle = '#A88B7D';
  ctx.font = "11px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Scan kamera untuk membuka surat cinta", w / 2, 355);

  // Polaroid Bottom Handwriting Area
  ctx.fillStyle = '#4A3528';
  ctx.font = "italic bold 15px 'Georgia', serif";
  drawWrappedText(ctx, qrQuote, w / 2, 445, w - 60, 20, 'center');

  ctx.fillStyle = '#FF5E86';
  ctx.font = "12px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(`— Dari ${senderName} yang beneran khilaf 💕`, w / 2, 490);

  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  ctx.fillStyle = '#B09E94';
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillText(`DATE: ${dateStr} • RUANG BERDAMAI`, w / 2, 545);
}

// Template 2: Spotify Music Player
function renderSpotifyTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote) {
  // Dark Spotify-like Card
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, w, h);

  // Header
  ctx.fillStyle = '#B3B3B3';
  ctx.font = "11px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText("PLAYING FROM PLAYLIST: LOVE REMEDY", w / 2, 36);

  // Album Artwork / QR Box
  const qrSize = 230;
  const qrX = (w - qrSize) / 2;
  const qrY = 55;

  ctx.fillStyle = '#282828';
  roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 16);
  ctx.fill();
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Track Title & Artist
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`Maafkan Aku, ${partnerName}`, 32, 340);

  ctx.fillStyle = '#1DB954';
  ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`${senderName} (Feat. Bubu & Dudu)`, 32, 362);

  // Quote as lyrics preview
  ctx.fillStyle = '#E0E0E0';
  ctx.font = "italic 11px 'Segoe UI', Arial, sans-serif";
  drawWrappedText(ctx, `"${qrQuote}"`, 32, 390, w - 64, 16, 'left');

  // Progress Bar
  ctx.fillStyle = '#535353';
  roundRect(ctx, 32, 425, w - 64, 4, 2);
  ctx.fill();

  ctx.fillStyle = '#1DB954';
  roundRect(ctx, 32, 425, (w - 64) * 0.72, 4, 2);
  ctx.fill();

  ctx.fillStyle = '#B3B3B3';
  ctx.font = "10px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = 'left';
  ctx.fillText("02:45", 32, 445);
  ctx.textAlign = 'right';
  ctx.fillText("-01:15", w - 32, 445);

  // Play / Pause Icons
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = "24px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("⏮   ▶   ⏭", w / 2, 490);

  ctx.fillStyle = '#B3B3B3';
  ctx.font = "10px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Scan QR untuk memutar permohonan damai", w / 2, 535);
}

// Template 3: Boarding Pass Tiket Cinta
function renderBoardingPassTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote) {
  // Flight ticket background
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(0, 0, w, h);

  // Top airline banner
  ctx.fillStyle = '#FF5E86';
  ctx.fillRect(0, 0, w, 56);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText("✈️ LOVE AIRWAYS • BOARDING PASS", w / 2, 35);

  // Flight Details Grid
  ctx.textAlign = 'left';
  ctx.fillStyle = '#A88B7D';
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillText("PASSENGER", 32, 85);
  ctx.fillStyle = '#4A3528';
  ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(partnerName.toUpperCase(), 32, 105);

  ctx.fillStyle = '#A88B7D';
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillText("SPECIAL CO-PILOT", 240, 85);
  ctx.fillStyle = '#4A3528';
  ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(senderName.toUpperCase(), 240, 105);

  // Route: KHILAF -> DAMAI
  ctx.fillStyle = '#FF5E86';
  ctx.font = "bold 22px 'Courier New', monospace";
  ctx.fillText("KHILAF", 32, 145);
  ctx.fillStyle = '#A88B7D';
  ctx.font = "16px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(" ──✈── ", 145, 141);
  ctx.fillStyle = '#48BB95';
  ctx.font = "bold 22px 'Courier New', monospace";
  ctx.fillText("DAMAI", 260, 145);

  // Custom QR Quote Note
  ctx.fillStyle = '#7A5F4D';
  ctx.font = "italic 11px 'Segoe UI', Arial, sans-serif";
  drawWrappedText(ctx, `Pesan: "${qrQuote}"`, w / 2, 172, w - 64, 15, 'center');

  // QR Code Area
  const qrSize = 190;
  ctx.drawImage(qrImg, (w - qrSize) / 2, 195, qrSize, qrSize);

  // Dashed tear-off line
  ctx.strokeStyle = '#FFB6C1';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(16, 420);
  ctx.lineTo(w - 16, 420);
  ctx.stroke();
  ctx.setLineDash([]);

  // Flight Stats
  ctx.textAlign = 'center';
  ctx.fillStyle = '#4A3528';
  ctx.font = "bold 12px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("GATE: 01 • SEAT: 1A (HATI KAMU) • STATUS: SIAP BAIKAN", w / 2, 455);

  // Barcode decoration at bottom
  ctx.fillStyle = '#2A1B12';
  for (let i = 40; i < w - 40; i += 6) {
    const barW = (i % 4 === 0) ? 3 : 1.5;
    ctx.fillRect(i, 490, barW, 40);
  }

  ctx.fillStyle = '#A88B7D';
  ctx.font = "9px 'Courier New', monospace";
  ctx.fillText("TICKET NO: LOVE-2026-DAMAI-FOREVER", w / 2, 548);
}

// Template 4: Retro Voucher Damai
function renderVoucherTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote) {
  // Vintage Kraft Cream
  ctx.fillStyle = '#FAF3E0';
  ctx.fillRect(0, 0, w, h);

  // Double dashed borders
  ctx.strokeStyle = '#D4A373';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Header Title
  ctx.fillStyle = '#BC6C25';
  ctx.font = "bold 18px 'Georgia', serif";
  ctx.textAlign = 'center';
  ctx.fillText("🎟️ VOUCHER RESMI BERDAMAI 🎟️", w / 2, 45);

  ctx.fillStyle = '#6B4E3D';
  ctx.font = "italic 11px 'Georgia', serif";
  drawWrappedText(ctx, `Kupon: "${qrQuote}"`, w / 2, 70, w - 60, 16, 'center');

  // QR Code
  const qrSize = 205;
  ctx.drawImage(qrImg, (w - qrSize) / 2, 95, qrSize, qrSize);

  // Terms & Conditions
  ctx.fillStyle = '#DDA15E';
  ctx.fillRect(28, 325, w - 56, 115);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#3A2E2B';
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillText("SYARAT & KETENTUAN PENCAIRAN:", 42, 348);

  ctx.font = "10px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`1. Berlaku untuk ampunan penuh ${partnerName}.`, 42, 370);
  ctx.fillText(`2. Wajib ditukarkan traktiran oleh ${senderName}.`, 42, 390);
  ctx.fillText("3. Berlaku seumur hidup & tidak dapat diganggu gugat.", 42, 410);

  // Official Stamp
  ctx.save();
  ctx.translate(w / 2, 490);
  ctx.rotate(-0.08);
  ctx.strokeStyle = '#E63946';
  ctx.lineWidth = 3;
  ctx.strokeRect(-100, -20, 200, 40);
  ctx.fillStyle = '#E63946';
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText("TERVERIFIKASI CINTA", 0, 5);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#9C6644';
  ctx.font = "9px 'Courier New', monospace";
  ctx.fillText("KODE VOUCHER: PEACE-TREATY-2026", w / 2, 548);
}

// Template 5: Marshmallow Clay Bubu & Dudu Signature
function renderMarshmallowTemplate(ctx, w, h, partnerName, senderName, qrImg, qrQuote) {
  // Pastel blush background
  ctx.fillStyle = '#FFF0F3';
  ctx.fillRect(0, 0, w, h);

  // Soft border
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#FF85A2';
  roundRect(ctx, 6, 6, w - 12, h - 12, 28);
  ctx.stroke();

  // Header Banner Card
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, 20, 20, w - 40, 72, 20);
  ctx.fill();

  ctx.fillStyle = '#FF5E86';
  ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(`🌸 RUANG BERDAMAI ${partnerName.toUpperCase()}`, w / 2, 50);

  ctx.fillStyle = '#7A5F4D';
  ctx.font = "bold 11px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`Pesan Damai Khusus dari ${senderName} 🐻`, w / 2, 72);

  // QR Container
  const qrSize = 220;
  const qrX = (w - qrSize) / 2;
  const qrY = 110;

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(255, 94, 134, 0.2)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 24);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Cute Quote & Paws
  ctx.fillStyle = '#FF5E86';
  ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText("✨ SCAN UNTUK MEMBUKA AMPLOP DAMAI ✨", w / 2, 385);

  ctx.fillStyle = '#7A5F4D';
  ctx.font = "italic 13px 'Segoe UI', Arial, sans-serif";
  drawWrappedText(ctx, `"${qrQuote}"`, w / 2, 415, w - 70, 18, 'center');

  // Bottom Pill
  ctx.fillStyle = '#FFE4EC';
  roundRect(ctx, 36, 455, w - 72, 60, 18);
  ctx.fill();

  ctx.fillStyle = '#FF5E86';
  ctx.font = "bold 12px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Bubu & Dudu • Edisi Penjinak Ngambek", w / 2, 480);

  ctx.fillStyle = '#A88B7D';
  ctx.font = "10px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Scan barcode untuk melihat hukuman & vonis maaf", w / 2, 500);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function downloadPhotocardImage() {
  const canvas = photocardCanvas;
  const link = document.createElement('a');
  link.download = `photocard-${currentTemplate}-${currentSlug || 'damai'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

document.addEventListener('DOMContentLoaded', initStudio);
