// love.js - Dynamic Apology & Mood Defuser Viewer for Couples

// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcL1mptIZw7Z7EnhFtga4xVAvecE1WIAs",
  authDomain: "ruang-damai-bubu.firebaseapp.com",
  projectId: "ruang-damai-bubu",
  storageBucket: "ruang-damai-bubu.firebasestorage.app",
  messagingSenderId: "157373986860",
  appId: "1:157373986860:web:bf3879b330c53bccccb989"
};

let db = null;
try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  }
} catch (e) {
  console.warn("Firebase init notice:", e.message);
}

// 2. Global State & Dynamic Configuration
const CONFIG = {
  slug: '',
  partnerName: 'Bubu Tersayang 🌸',
  senderName: 'Dudu yang Khilaf 🐻',
  whatsappNumber: '6281234567890',
  letterMessage: 'Hai Bubu sayang... Dudu tau Dudu salah dan bikin Bubu kesel hari ini. Dudu minta maaf yaa... Dudu gak mau Bubu sedih terus. Dudu bikinin Ruang Berdamai ini khusus buat Bubu tersayang.',
  compensations: [
    '🍜 Traktir Seblak Level Pedas',
    '🧋 Segelas Boba Matcha Dingin',
    '🤗 Deep Talk & Peluk Hangat 1 Jam',
    '👑 Bebas Jadi Ratu Seharian (No Debat)'
  ],
  soundEnabled: true,
  maxSlider: 1000
};

// Acoustic Web Audio Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick(frequency = 520) {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playPop() {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playPaper() {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.14);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  playChime() {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch (e) {}
  }

  playSuccess() {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {}
  }
}

const sounds = new SoundEngine();

// Bubu & Dudu Mood Stages
const BUBU_MOODS = [
  {
    max: 100,
    name: 'Cemberut Dikit',
    desc: 'Bubu lagi cemberut manja. Cuma butuh disayang dan dielus kepalanya.',
    img: '/assets/bubu-1-pout.gif',
    quote: '"Hmm... sebel dikit aja sih sebenernya..."',
    color: '#FF85A2'
  },
  {
    max: 350,
    name: 'Mulai Buang Muka',
    desc: 'Bubu udah pasang muka cuek dan gak mau natap kamu langsung!',
    img: '/assets/bubu-2-ignore.gif',
    quote: '"Jangan ngomong sama aku dulu, aku lagi gak mau denger!"',
    color: '#FF5E86'
  },
  {
    max: 650,
    name: 'Marah Berkepanjangan',
    desc: 'Bibir udah maju 5 cm! Perlu traktiran makanan pedas atau es krim manis secepatnya!',
    img: '/assets/bubu-3-mad.gif',
    quote: '"Pikir aja sendiri salah kamu apa! Jangan nanya mulu!"',
    color: '#F43F5E'
  },
  {
    max: 900,
    name: 'Nangis Minta Dipeluk',
    desc: 'Bubu sedih banget dan ngerasa gak diperhatiin... Butuh pelukan erat sekarang!',
    img: '/assets/bubu-4-cry.gif',
    quote: '"Huhu... Kamu jahat banget sih hari ini... 😭"',
    color: '#E11D48'
  },
  {
    max: 1000,
    name: 'MEGA TANTRUM (SIAGA 1)',
    desc: 'DARURAT! Bubu guling-guling ngamuk! Segera kirim permintaan maaf atau kamu dicoret dari KK cinta!',
    img: '/assets/bubu-5-tantrum.gif',
    quote: '"POKOKNYA SEBEL SEBEL SEBEL! GAK MAU TAUUU! 💥"',
    color: '#BE123C'
  }
];

// App State
let currentLevel = 1;
let refusalCount = 0;
let customDemands = [];
let isDodgeActive = false;

// DOM Selectors
const navPartnerName = document.getElementById('navPartnerName');
const navSenderName = document.getElementById('navSenderName');
const readLetterBtnLabel = document.getElementById('readLetterBtnLabel');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');

const step1Title = document.getElementById('step1Title');
const step1Subtext = document.getElementById('step1Subtext');
const step2Title = document.getElementById('step2Title');
const angerRange = document.getElementById('angerRange');
const levelValueDisplay = document.getElementById('levelValueDisplay');
const catMemeDisplay = document.getElementById('catMemeDisplay');
const memeContainer = document.getElementById('memeContainer');
const memeTagText = document.getElementById('memeTagText');
const maxAlertPill = document.getElementById('maxAlertPill');
const moodBadge = document.getElementById('moodBadge');
const moodQuote = document.getElementById('moodQuote');

const sincerityPercent = document.getElementById('sincerityPercent');
const sincerityBar = document.getElementById('sincerityBar');
const sincerityStatus = document.getElementById('sincerityStatus');
const compensationList = document.getElementById('compensationList');
const girlDemandIcon = document.getElementById('girlDemandIcon');
const customDemandInput = document.getElementById('customDemandInput');
const addCustomBtn = document.getElementById('addCustomBtn');
const customDemandsContainer = document.getElementById('customDemandsContainer');

const dodgeSpeechBubble = document.getElementById('dodgeSpeechBubble');
const btnStillMad = document.getElementById('btnStillMad');
const btnForgive = document.getElementById('btnForgive');
const refusalCounterText = document.getElementById('refusalCounterText');

// Modals
const welcomeIntroModal = document.getElementById('welcomeIntroModal');
const introPhaseEnvelope = document.getElementById('introPhaseEnvelope');
const introPhaseLetter = document.getElementById('introPhaseLetter');
const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
const btnCloseLetterIntro = document.getElementById('btnCloseLetterIntro');
const introPartnerGreeting = document.getElementById('introPartnerGreeting');
const introSenderSnippet = document.getElementById('introSenderSnippet');
const envelopeRecipientName = document.getElementById('envelopeRecipientName');
const envelopeBadgePartner = document.getElementById('envelopeBadgePartner');
const letterSenderHeading = document.getElementById('letterSenderHeading');
const letterContentBox = document.getElementById('letterContentBox');
const btnEnterDashboard = document.getElementById('btnEnterDashboard');
const btnReadLetter = document.getElementById('btnReadLetter');

const apologyModal = document.getElementById('apologyModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalActionBtn = document.getElementById('modalActionBtn');

const mainAppView = document.getElementById('mainAppView');
const successView = document.getElementById('successView');
const certPartner = document.getElementById('certPartner');
const certSender = document.getElementById('certSender');
const certDate = document.getElementById('certDate');
const certLevel = document.getElementById('certLevel');
const certClauses = document.getElementById('certClauses');
const btnClaimWa = document.getElementById('btnClaimWa');
const btnClaimWaText = document.getElementById('btnClaimWaText');
const btnCopyCert = document.getElementById('btnCopyCert');
const btnRestart = document.getElementById('btnRestart');

// Extract Slug from URL
function extractSlug() {
  const urlParams = new URLSearchParams(window.location.search);
  const qSlug = urlParams.get('p') || urlParams.get('slug');
  if (qSlug) return qSlug;

  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length >= 2 && parts[0] === 'love') {
    return parts[1];
  }
  return 'budi-dan-caca'; // fallback default
}

// Fetch Apology Page Data
async function loadApologyData() {
  const slug = extractSlug();
  CONFIG.slug = slug;

  let pageData = null;

  // 1. Try local preview / cache first
  const local = localStorage.getItem('local_page_' + slug);
  if (local) {
    try { pageData = JSON.parse(local); } catch (e) {}
  }

  // 2. Try Firestore
  if (!pageData && db) {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase timeout')), 2500)
      );
      const snap = await Promise.race([
        db.collection('apology_pages').doc(slug).get(),
        timeoutPromise
      ]);
      if (snap && snap.exists) {
        pageData = snap.data();
      }
    } catch (err) {
      console.warn("Firestore read fallback to local:", err.message);
    }
  }

  // 3. Apply page data or default
  if (pageData) {
    if (pageData.partner_name) CONFIG.partnerName = pageData.partner_name;
    if (pageData.sender_name) CONFIG.senderName = pageData.sender_name;
    if (pageData.whatsapp_number) CONFIG.whatsappNumber = pageData.whatsapp_number;
    if (pageData.letter_message) CONFIG.letterMessage = pageData.letter_message;
    if (Array.isArray(pageData.compensations) && pageData.compensations.length > 0) {
      CONFIG.compensations = pageData.compensations;
    }
  }

  // Update DOM with Custom Names & Roles
  document.title = `Ruang Berdamai - ${CONFIG.partnerName} & ${CONFIG.senderName}`;
  if (navPartnerName) navPartnerName.textContent = CONFIG.partnerName;
  if (navSenderName) navSenderName.textContent = CONFIG.senderName;
  if (readLetterBtnLabel) readLetterBtnLabel.textContent = `Surat ${CONFIG.senderName}`;

  if (introPartnerGreeting) introPartnerGreeting.textContent = `${CONFIG.partnerName} 🌸`;
  if (introSenderSnippet) introSenderSnippet.textContent = CONFIG.senderName;
  if (envelopeRecipientName) envelopeRecipientName.textContent = `${CONFIG.partnerName} 🌸`;
  if (envelopeBadgePartner) envelopeBadgePartner.textContent = `KHUSUS UNTUK ${CONFIG.partnerName.toUpperCase()}`;
  if (letterSenderHeading) letterSenderHeading.textContent = `DARI ${CONFIG.senderName.toUpperCase()} YANG LAGI KHILAF 🐻`;
  if (letterContentBox) letterContentBox.textContent = `"${CONFIG.letterMessage}"`;

  if (step1Title) step1Title.textContent = `Seberapa Kesel Kamu Sama ${CONFIG.senderName} Hari Ini?`;
  if (step1Subtext) step1Subtext.textContent = `Geser tuas ke kanan buat ngasih tahu ${CONFIG.senderName} level emosimu saat ini!`;
  if (step2Title) step2Title.textContent = `Menu Denda Jajan & Servis Buat ${CONFIG.senderName}`;
  if (btnClaimWaText) btnClaimWaText.textContent = `KIRIM BUKTI DAMAI KE WA ${CONFIG.senderName.toUpperCase()}`;

  // Render Compensation List
  renderTreatsList();
}

// Render dynamic treats
function renderTreatsList() {
  compensationList.innerHTML = '';

  CONFIG.compensations.forEach((itemText, idx) => {
    // Check if itemText has emoji prefix
    let iconChar = '🌸';
    let cleanText = itemText;
    const emojiMatch = itemText.match(/^(\p{Extended_Pictographic}|\p{Emoji_Presentation})\s*(.*)$/u);
    if (emojiMatch) {
      iconChar = emojiMatch[1];
      cleanText = emojiMatch[2];
    } else {
      const defaultIcons = ['🍜', '🧋', '🛵', '🎬', '☕', '🏖️', '🛍️', '🤗'];
      iconChar = defaultIcons[idx % defaultIcons.length];
    }

    const label = document.createElement('label');
    label.className = 'check-card flex items-center gap-3.5 p-3.5 rounded-2xl border border-pink-100 bg-white hover:bg-pink-50/40 cursor-pointer transition-all shadow-xs';
    label.innerHTML = `
      <input type="checkbox" class="h-5 w-5 rounded-lg border-pink-300 text-pink-500 focus:ring-0 focus:ring-offset-0">
      <div class="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-lg flex-shrink-0">
        ${iconChar}
      </div>
      <div class="flex-1">
        <div class="font-bold text-stone-800 text-sm comp-title">${escapeHtml(cleanText)}</div>
        <div class="text-[10px] text-stone-400 mt-0.5">Syarat resmi kompensasi damai</div>
      </div>
    `;
    compensationList.appendChild(label);
  });

  // Re-attach change listeners
  compensationList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      sounds.playPop();
      updateSincerity();
    });
  });
}

// Update Sincerity Calculator
function updateSincerity() {
  const checkboxes = compensationList.querySelectorAll('input[type="checkbox"]:checked');
  const baseCount = checkboxes.length;
  const customCount = customDemands.length;
  const totalCount = baseCount + customCount;

  // Highlight checked cards
  compensationList.querySelectorAll('.check-card').forEach(card => {
    const cb = card.querySelector('input[type="checkbox"]');
    if (cb && cb.checked) {
      card.classList.add('checked');
    } else {
      card.classList.remove('checked');
    }
  });

  const maxPossible = Math.max(CONFIG.compensations.length, 3);
  const ratio = Math.min(totalCount / maxPossible, 1);
  const pct = Math.round(ratio * 100);

  sincerityPercent.textContent = `${pct}%`;
  sincerityBar.style.width = `${pct}%`;

  if (pct === 0) {
    sincerityBar.className = 'h-full bg-slate-300 rounded-full transition-all duration-500';
    sincerityStatus.textContent = `Belum ada jajan/kompensasi terpilih untuk ${CONFIG.partnerName}...`;
    sincerityStatus.className = 'text-[11px] text-stone-500 font-medium italic';
  } else if (pct < 50) {
    sincerityBar.className = 'h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-500 shadow-sm';
    sincerityStatus.textContent = `${CONFIG.senderName} mulai modal, tapi masih kurang royal nih!`;
    sincerityStatus.className = 'text-[11px] text-amber-600 font-bold';
  } else if (pct < 100) {
    sincerityBar.className = 'h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500 shadow-sm';
    sincerityStatus.textContent = `Mantap! Hati ${CONFIG.partnerName} mulai luluh melihat kesiapan ini.`;
    sincerityStatus.className = 'text-[11px] text-pink-600 font-bold';
  } else {
    sincerityBar.className = 'h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500 shadow-sm';
    sincerityStatus.textContent = `LUAR BIASA! ${CONFIG.senderName} siap bayar denda & lulus sensor total! ✨`;
    sincerityStatus.className = 'text-[11px] text-emerald-600 font-black';
  }
}

// Render Custom Demands by Girlfriend
function renderCustomDemands() {
  customDemandsContainer.innerHTML = '';
  customDemands.forEach((demandText, idx) => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-3 rounded-2xl bg-pink-100/60 border border-pink-200 text-xs text-pink-800 font-bold shadow-xs';
    item.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-sm">✨</span>
        <span>${escapeHtml(demandText)}</span>
      </div>
      <button type="button" class="text-stone-400 hover:text-pink-600 font-black px-1.5 py-0.5 rounded-lg" data-index="${idx}">✕</button>
    `;

    item.querySelector('button').addEventListener('click', (e) => {
      const delIdx = parseInt(e.target.getAttribute('data-index'), 10);
      customDemands.splice(delIdx, 1);
      sounds.playPop();
      renderCustomDemands();
      updateSincerity();
    });

    customDemandsContainer.appendChild(item);
  });
}

// Update Mood Display based on slider (1% - 1000%)
function updateMoodDisplay(value) {
  currentLevel = value;
  levelValueDisplay.textContent = `${value}%`;

  let currentStage = BUBU_MOODS[0];
  for (let i = 0; i < BUBU_MOODS.length; i++) {
    if (value <= BUBU_MOODS[i].max) {
      currentStage = BUBU_MOODS[i];
      break;
    }
  }

  catMemeDisplay.src = currentStage.img;
  memeTagText.textContent = currentStage.name;
  moodBadge.textContent = currentStage.name;
  moodQuote.textContent = currentStage.quote;

  if (value >= 1000) {
    maxAlertPill.classList.remove('hidden');
    memeContainer.classList.add('wobble-stage-5');
  } else {
    maxAlertPill.classList.add('hidden');
    memeContainer.classList.remove('wobble-stage-5');
  }
}

// Setup WhatsApp Link on Treaty
function setupWhatsAppLink(allClauses) {
  const clausesText = allClauses.length > 0 
    ? allClauses.map((c, i) => `${i + 1}. ${c}`).join('\n')
    : `(Murni dimaafin karena cinta & kangen 💕)`;

  const message = `Halo ${CONFIG.senderName}! 💕\n\nAku udah buka dan baca Ruang Berdamai dari kamu. Aku resmi maafin kamu hari ini yaa...\n\nTAPI dengan syarat, kamu wajib lunasin denda ini secepatnya:\n${clausesText}\n\nJangan diulangin lagi yaa sayang! Kalo kamu melanggar, kena denda 10x lipat lho! 😘`;

  const cleanNumber = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  btnClaimWa.href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Trigger Forgiveness Celebration
function triggerForgiveCelebration() {
  sounds.playSuccess();

  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
    colors: ['#FF5E86', '#FF85A2', '#FFE4EC', '#FBBF24', '#48BB95']
  });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF5E86', '#FF85A2']
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF5E86', '#FF85A2']
    });
  }, 300);

  // Switch to Treaty View
  mainAppView.classList.add('hidden');
  successView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Certificate Data
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  certDate.textContent = dateStr;
  certLevel.textContent = `${currentLevel}%`;
  certPartner.textContent = CONFIG.partnerName;
  certSender.textContent = CONFIG.senderName;

  const checkedBoxes = compensationList.querySelectorAll('input[type="checkbox"]:checked');
  const allClauses = [];

  checkedBoxes.forEach(cb => {
    const title = cb.closest('.check-card').querySelector('.comp-title').textContent.trim();
    allClauses.push(title);
  });

  customDemands.forEach(d => {
    allClauses.push(`[Request Spesial] ${d}`);
  });

  certClauses.innerHTML = '';
  if (allClauses.length === 0) {
    certClauses.innerHTML = `<li class="text-stone-500 italic">Murni dimaafin karena cinta dan kangen sama ${CONFIG.senderName} 🥰</li>`;
  } else {
    allClauses.forEach((c, idx) => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2.5 text-stone-700 text-xs sm:text-sm font-semibold';
      li.innerHTML = `<span class="text-pink-500 font-bold">${idx + 1}.</span> <span>${escapeHtml(c)}</span>`;
      certClauses.appendChild(li);
    });
  }

  setupWhatsAppLink(allClauses);
}

// Refusal "Masih Marah" Handler with Character Reaction
function handleRefusal() {
  refusalCount++;
  sounds.playPop();

  if (dodgeSpeechBubble) {
    dodgeSpeechBubble.classList.remove('hidden');
  }

  if (refusalCount === 1) {
    if (dodgeSpeechBubble) {
      dodgeSpeechBubble.textContent = `🥺 Ampun sayang, jangan pencet yang ini...`;
    }
    refusalCounterText.textContent = `${CONFIG.senderName} mulai panik dan keringat dingin...`;
    refusalCounterText.className = 'text-center text-xs font-bold text-amber-600 animate-shake';
  } else if (refusalCount === 2) {
    if (dodgeSpeechBubble) {
      dodgeSpeechBubble.textContent = `🏃‍♂️ Kabur! ${CONFIG.senderName} belum siap dicoret dari KK cinta!`;
    }
    refusalCounterText.textContent = `Aduh... Ditolak 2 kali! ${CONFIG.senderName} makin gelisah! 🥺`;
    refusalCounterText.className = 'text-center text-xs font-bold text-amber-600 animate-shake';
    dodgeButton();
  } else if (refusalCount === 3) {
    if (dodgeSpeechBubble) {
      dodgeSpeechBubble.textContent = `💸 Jangan marah lagi, traktiran apa aja ${CONFIG.senderName} turutin!`;
    }
    refusalCounterText.textContent = `Tombolnya kabur! ${CONFIG.senderName} mohon ampun seikhlas-ikhlasnya 💕`;
    refusalCounterText.className = 'text-center text-xs font-bold text-pink-600 animate-pulse';
    isDodgeActive = true;
    dodgeButton();
  } else {
    // 4th refusal onwards: Sujud modal!
    if (dodgeSpeechBubble) {
      dodgeSpeechBubble.textContent = `🙇‍♂️ ${CONFIG.senderName} bersujud memohon ampunan ratu...`;
    }
    modalTitle.textContent = `${CONFIG.senderName.toUpperCase()} MINTA MAAF YA ${CONFIG.partnerName.toUpperCase()}... 🥺💐`;
    modalText.textContent = `${CONFIG.senderName} bersujud bawa bunga buat ${CONFIG.partnerName} tersayang. Dia bener-bener khilaf dan gak mau kamu sedih terus...`;
    apologyModal.classList.remove('hidden');
    isDodgeActive = true;
    dodgeButton();
  }
}

function dodgeButton() {
  const randX = Math.floor(Math.random() * 160) - 80;
  const randY = Math.floor(Math.random() * 80) - 40;
  btnStillMad.style.transform = `translate(${randX}px, ${randY}px)`;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await loadApologyData();

  // Slider event
  angerRange.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    sounds.playTick(400 + val * 0.4);
    updateMoodDisplay(val);
  });

  // Envelope Open Phase 1 -> 2
  function openEnvelopeAction() {
    sounds.playPaper();
    introPhaseEnvelope.classList.add('hidden');
    introPhaseLetter.classList.remove('hidden');
    sounds.playChime();
  }

  btnOpenEnvelope.addEventListener('click', openEnvelopeAction);
  const envelopeBtnText = document.getElementById('envelopeBtnText');
  if (envelopeBtnText) {
    envelopeBtnText.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelopeAction();
    });
  }

  // Phase 2 -> Dashboard
  btnEnterDashboard.addEventListener('click', () => {
    sounds.playPop();
    welcomeIntroModal.classList.add('hidden');
  });

  // Close button on Letter Intro Modal
  if (btnCloseLetterIntro) {
    btnCloseLetterIntro.addEventListener('click', () => {
      sounds.playPop();
      welcomeIntroModal.classList.add('hidden');
    });
  }

  // Re-read letter button from Navbar
  btnReadLetter.addEventListener('click', () => {
    sounds.playPaper();
    introPhaseEnvelope.classList.add('hidden');
    introPhaseLetter.classList.remove('hidden');
    welcomeIntroModal.classList.remove('hidden');
  });

  // Close apology modal
  modalActionBtn.addEventListener('click', () => {
    sounds.playPop();
    apologyModal.classList.add('hidden');
  });

  // Custom demand by girlfriend with icon
  addCustomBtn.addEventListener('click', () => {
    const icon = girlDemandIcon ? girlDemandIcon.value : '🌸';
    const val = customDemandInput.value.trim();
    if (val) {
      customDemands.push(`${icon} ${val}`);
      customDemandInput.value = '';
      sounds.playPop();
      renderCustomDemands();
      updateSincerity();
    }
  });

  customDemandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomBtn.click();
    }
  });

  // Action buttons
  btnStillMad.addEventListener('click', handleRefusal);
  btnStillMad.addEventListener('mouseenter', () => {
    if (isDodgeActive) dodgeButton();
  });

  btnForgive.addEventListener('click', triggerForgiveCelebration);

  // Sound toggle
  soundToggleBtn.addEventListener('click', () => {
    CONFIG.soundEnabled = !CONFIG.soundEnabled;
    soundIcon.textContent = CONFIG.soundEnabled ? 'Suara' : 'Bisu';
    soundToggleBtn.classList.toggle('opacity-50', !CONFIG.soundEnabled);
  });

  // Copy certificate
  btnCopyCert.addEventListener('click', () => {
    const lines = [
      `📜 SURAT PERJANJIAN DAMAI RESMI 📜`,
      `Tanggal: ${certDate.textContent}`,
      `Pihak Memaafkan: ${certPartner.textContent}`,
      `Pihak Dimaafkan: ${certSender.textContent}`,
      `Tingkat Ngambek: ${certLevel.textContent}`,
      `Denda yang Wajib Ditunaikan:`,
      ...Array.from(certClauses.children).map(c => c.textContent.trim()),
      `Status: Terverifikasi Cinta & Resmi Baikan! 💕`
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      btnCopyCert.textContent = "Tersalin! ✓";
      setTimeout(() => btnCopyCert.textContent = "Salin Teks Perjanjian", 2000);
    });
  });

  // Restart simulation
  btnRestart.addEventListener('click', () => {
    successView.classList.add('hidden');
    mainAppView.classList.remove('hidden');
    refusalCount = 0;
    isDodgeActive = false;
    btnStillMad.style.transform = 'none';
    if (dodgeSpeechBubble) dodgeSpeechBubble.classList.add('hidden');
    refusalCounterText.textContent = `${CONFIG.senderName} sedang menunggu vonis dengan penuh harap...`;
    refusalCounterText.className = 'text-center text-[11px] text-stone-400 min-h-[1.2rem]';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial Sincerity
  updateSincerity();
});
