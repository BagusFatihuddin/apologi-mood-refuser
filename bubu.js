/**
 * BUBU & DUDU: RUANG BERDAMAI (Mood & Apology Defuser)
 * Cozy Pastel Sound & Interaction Engine
 */

// Global Configuration
const CONFIG = {
  whatsappNumber: '6281234567890', // Default editable via settings
  partnerName: 'Bubu Tersayang 🌸',
  senderName: 'Dudu yang Khilaf 🐻',
  soundEnabled: true,
  maxSlider: 1000
};

// Web Audio API Synthesizer (Zero dependencies, pure warm acoustic tones)
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

  // Soft marimba-like bubble tick
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

  // Soft gentle pop
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

  // Soft paper rustle
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

  // Sweet chime for opening letter
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

  // Cute descending sorrow tone
  playSorrow() {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [440, 392, 349.23, 293.66].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.09, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + (idx + 1) * 0.12);
      });
    } catch (e) {}
  }

  // Play quick gentle whoosh when button dodges
  playWhoosh() {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Sweet music box celebration fanfare
  playVictory() {
    if (!CONFIG.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Dreamy Pentatonic: C5, D5, E5, G5, A5, C6
      const chord = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        const duration = i === chord.length - 1 ? 0.9 : 0.28;
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + duration);
      });
    } catch (e) {}
  }
}

const sounds = new SoundEngine();

// App State
let currentLevel = 1;
let refusalCount = 0;
let customDemands = [];
let isDodgeActive = false;

// Bubu & Dudu Mood Stages
const BUBU_MOODS = [
  {
    max: 25,
    name: 'Bubu Cemberut Manja',
    subtext: 'Bete dikit doang, disodorin boba atau es krim langsung senyum lagi.',
    badge: 'Level 01 • Cemberut Dikit',
    badgeColor: 'bg-pink-100 text-pink-600 border-pink-200',
    gif: '/assets/bubu-1-pout.gif',
    quote: '"Hmm... Bubu gak apa-apa kok (tapi Dudu jangan cuek ya!)."'
  },
  {
    max: 75,
    name: 'Bubu Mode Silent Treatment',
    subtext: 'Dudu dicuekin... chat cuma dibalas singkat "Y", "Gpp", atau "Oh".',
    badge: 'Level 02 • Silent Treatment',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    gif: '/assets/bubu-2-ignore.gif',
    quote: '"Kalo Dudu peka, Dudu pasti tau salah Dudu apa. Pikir sendiri!"'
  },
  {
    max: 150,
    name: 'Bubu Mulai Judes: "Gpp / Terserah"',
    subtext: 'Waspada! Bubu mulai melempar tatapan maut, jangan dijawab sembarangan!',
    badge: 'Level 03 • Mode Judes',
    badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
    gif: '/assets/bubu-3-mad.gif',
    quote: '"Iya terserah Dudu aja, kan Dudu yang paling bener sedunia."'
  },
  {
    max: 500,
    name: 'Bubu Sedih & Nangis Sesenggukan',
    subtext: 'Hati Dudu ikutan remuk liat Bubu sedih begini. Butuh pelukan segera!',
    badge: 'Level 04 • Butuh Pelukan',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    gif: '/assets/bubu-4-cry.gif',
    quote: '"Dudu jahat... bikin Bubu sedih terus seharian 🥺💔"'
  },
  {
    max: 1000,
    name: 'Mega Tantrum: Bubu Marah Besar!',
    subtext: 'Gawat! Bubu guling-gulingan, Dudu harus gerak cepat sebelum Bubu ngambek 1 abad!',
    badge: 'Level 05 • Mega Tantrum',
    badgeColor: 'bg-red-100 text-red-600 border-red-200 animate-pulse',
    gif: '/assets/bubu-5-tantrum.gif',
    quote: '"JANGAN DEKET-DEKET DUDU! Bubu lagi gak mau liat Dudu pokoknya!"'
  }
];

// DOM Elements
const moodSlider = document.getElementById('moodSlider');
const sliderValueDisplay = document.getElementById('sliderValueDisplay');
const moodBadge = document.getElementById('moodBadge');
const moodTitle = document.getElementById('moodTitle');
const moodSubtext = document.getElementById('moodSubtext');
const moodQuote = document.getElementById('moodQuote');
const catMemeDisplay = document.getElementById('catMemeDisplay');
const memeContainer = document.getElementById('memeContainer');
const sincerityBar = document.getElementById('sincerityBar');
const sincerityPercent = document.getElementById('sincerityPercent');
const sincerityStatus = document.getElementById('sincerityStatus');
const compensationList = document.getElementById('compensationList');
const customDemandInput = document.getElementById('customDemandInput');
const addCustomBtn = document.getElementById('addCustomBtn');
const customDemandsContainer = document.getElementById('customDemandsContainer');

const btnStillMad = document.getElementById('btnStillMad');
const btnForgive = document.getElementById('btnForgive');
const refusalCounterText = document.getElementById('refusalCounterText');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');
const settingsBtn = document.getElementById('settingsBtn');

// Intro Modal Elements
const welcomeIntroModal = document.getElementById('welcomeIntroModal');
const introPhaseEnvelope = document.getElementById('introPhaseEnvelope');
const introPhaseLetter = document.getElementById('introPhaseLetter');
const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
const btnEnterDashboard = document.getElementById('btnEnterDashboard');
const btnReadLetter = document.getElementById('btnReadLetter');
const introPartnerGreeting = document.getElementById('introPartnerGreeting');
const envelopeRecipientName = document.getElementById('envelopeRecipientName');

// Apology Modal (Dudu Sorry)
const apologyModal = document.getElementById('apologyModal');
const modalMemeImg = document.getElementById('modalMemeImg');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalActionBtn = document.getElementById('modalActionBtn');

// Settings Modal
const settingsModal = document.getElementById('settingsModal');
const inputPartnerName = document.getElementById('inputPartnerName');
const inputWaNumber = document.getElementById('inputWaNumber');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');

// Victory / Photocard Elements
const mainAppView = document.getElementById('mainAppView');
const victoryView = document.getElementById('victoryView');
const certDate = document.getElementById('certDate');
const certLevel = document.getElementById('certLevel');
const certClauses = document.getElementById('certClauses');
const certPartner = document.getElementById('certPartner');
const btnClaimWa = document.getElementById('btnClaimWa');
const btnCopyCert = document.getElementById('btnCopyCert');
const btnRestart = document.getElementById('btnRestart');

// Initialize Saved Settings
function loadSettings() {
  const savedWa = localStorage.getItem('defuser_wa');
  const savedPartner = localStorage.getItem('defuser_partner');
  if (savedWa) CONFIG.whatsappNumber = savedWa;
  if (savedPartner) CONFIG.partnerName = savedPartner;

  if (introPartnerGreeting) introPartnerGreeting.textContent = CONFIG.partnerName;
  if (envelopeRecipientName) envelopeRecipientName.textContent = CONFIG.partnerName;
}

// Update Slider and Visuals
function updateMoodLevel(val) {
  currentLevel = parseInt(val, 10);
  sliderValueDisplay.textContent = `${currentLevel}%`;

  let currentMood = BUBU_MOODS[0];
  for (const m of BUBU_MOODS) {
    if (currentLevel <= m.max) {
      currentMood = m;
      break;
    }
  }

  moodBadge.textContent = currentMood.badge;
  moodBadge.className = `px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 font-heading ${currentMood.badgeColor}`;
  moodTitle.textContent = currentMood.name;
  moodSubtext.textContent = currentMood.subtext;
  moodQuote.textContent = currentMood.quote;

  if (catMemeDisplay.getAttribute('src') !== currentMood.gif) {
    catMemeDisplay.src = currentMood.gif;
  }

  // Stage 5 Cute Tantrum Wobble
  if (currentLevel >= 501) {
    memeContainer.classList.add('wobble-stage-5');
  } else {
    memeContainer.classList.remove('wobble-stage-5');
  }

  sounds.playTick(480 + (currentLevel / 1000) * 350);
}

// Sincerity & Treaty Calculator
function updateSincerity() {
  const checkboxes = compensationList.querySelectorAll('input[type="checkbox"]:checked');
  const baseCount = checkboxes.length;
  const customCount = customDemands.length;
  const totalCount = baseCount + customCount;

  // Visual card highlight
  compensationList.querySelectorAll('.check-card').forEach(card => {
    const cb = card.querySelector('input[type="checkbox"]');
    if (cb && cb.checked) {
      card.classList.add('checked');
    } else {
      card.classList.remove('checked');
    }
  });

  const percent = Math.min(100, totalCount * 20);
  sincerityBar.style.width = `${percent}%`;
  sincerityPercent.textContent = `${percent}%`;

  if (percent === 0) {
    sincerityStatus.textContent = 'Belum ada jajan/kompensasi terpilih untuk Bubu...';
    sincerityBar.className = 'h-full bg-slate-300 transition-all duration-500 rounded-full';
  } else if (percent < 60) {
    sincerityStatus.textContent = 'Masih kurang manis... Tambah lagi jajanannya Dudu!';
    sincerityBar.className = 'h-full bg-amber-400 transition-all duration-500 rounded-full';
  } else if (percent < 100) {
    sincerityStatus.textContent = 'Bubu mulai luluh... Sedikit lagi baikan!';
    sincerityBar.className = 'h-full bg-pink-400 transition-all duration-500 rounded-full';
  } else {
    sincerityStatus.textContent = 'Ketulusan Dudu 100%! Bubu siap dipalak & dimaafin! 🌸';
    sincerityBar.className = 'h-full bg-gradient-to-r from-pink-400 to-rose-400 shadow-md shadow-pink-300 transition-all duration-500 rounded-full';
  }
}

// Add Custom Demands
function addCustomDemand() {
  const text = customDemandInput.value.trim();
  if (!text) return;

  customDemands.push(text);
  customDemandInput.value = '';
  sounds.playPop();
  renderCustomDemands();
  updateSincerity();
}

function renderCustomDemands() {
  customDemandsContainer.innerHTML = '';
  customDemands.forEach((demand, index) => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-pink-900 text-xs sm:text-sm animate-fadeIn';
    item.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs">✨</span>
        <span class="font-bold">${escapeHtml(demand)}</span>
      </div>
      <button type="button" data-index="${index}" class="text-rose-500 hover:text-rose-700 px-2 py-1 text-xs delete-demand font-bold transition">Hapus ✕</button>
    `;
    customDemandsContainer.appendChild(item);
  });

  customDemandsContainer.querySelectorAll('.delete-demand').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      customDemands.splice(idx, 1);
      sounds.playPop();
      renderCustomDemands();
      updateSincerity();
    });
  });
}

// Multi-Stage "Masih Marah" Handler
function handleStillMadClick() {
  refusalCount++;
  sounds.playSorrow();

  if (refusalCount === 1) {
    modalMemeImg.src = '/assets/dudu-sorry.gif';
    modalTitle.textContent = 'DUDU MINTA MAAF YA BUBU... 🥺💐';
    modalText.innerHTML = `
      Dudu bersujud bawa bunga buat <strong class="text-pink-600">${escapeHtml(CONFIG.partnerName)}</strong>.<br>
      Dudu bener-bener khilaf dan gak bakal ngulangin lagi. Maafin Dudu ya Bubu cantik?
    `;
    modalActionBtn.textContent = 'Yaudah, Bubu dengerin dulu alasannya...';
    apologyModal.classList.remove('hidden');
  } else if (refusalCount === 2) {
    modalMemeImg.src = '/assets/bubu-4-cry.gif';
    modalTitle.textContent = 'JANGAN NGAMBEK LAGI DONG BUBU... 💔';
    modalText.innerHTML = `
      Hati Dudu sedih banget liat Bubu masih kesel.<br>
      Dudu siap ditraktir jajan apa aja asalkan Bubu tersenyum lagi!
    `;
    modalActionBtn.textContent = 'Hmm... masih Bubu pantau kelakuannya!';
    apologyModal.classList.remove('hidden');

    btnStillMad.style.transform = 'scale(0.88)';
    btnForgive.style.transform = 'scale(1.12)';
  } else {
    isDodgeActive = true;
    btnStillMad.textContent = 'Capek kabur... pencet tombol pink aja Bubu 🌸';
    btnStillMad.style.transform = `scale(${Math.max(0.45, 0.85 - (refusalCount * 0.08))})`;
    btnForgive.style.transform = `scale(${Math.min(1.35, 1.15 + (refusalCount * 0.05))})`;
    dodgeButton();
  }

  refusalCounterText.textContent = `Bubu sudah menolak ${refusalCount}x! Dudu makin merasa bersalah dan siap nurut 100% 🐻❤️`;
  refusalCounterText.classList.remove('hidden');
}

// Button Dodge Mechanics
function dodgeButton() {
  if (!isDodgeActive) return;
  sounds.playWhoosh();

  const container = document.getElementById('decisionActions');
  const rect = container.getBoundingClientRect();
  const btnRect = btnStillMad.getBoundingClientRect();

  const maxX = Math.max(0, rect.width - btnRect.width - 20);
  const maxY = 100;

  const randX = (Math.random() - 0.5) * maxX;
  const randY = (Math.random() - 0.5) * maxY;

  btnStillMad.style.position = 'relative';
  btnStillMad.style.left = `${randX}px`;
  btnStillMad.style.top = `${randY}px`;
}

// Victory & Forgiveness Handler
function handleForgiveClick() {
  sounds.playVictory();

  for (let i = 0; i < 24; i++) {
    createFloatingHeart();
  }

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF85A2', '#FFB4C8', '#FFF0F3', '#FEF3C7', '#E6F7F1']
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FF5E86', '#FFB84C', '#A78BFA']
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FF5E86', '#FFB84C', '#A78BFA']
      });
    }, 250);
  }

  renderCertificate();
  mainAppView.classList.add('hidden');
  victoryView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Certificate Details (Voucher Damai Cinta)
function renderCertificate() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  certDate.textContent = dateStr;
  certLevel.textContent = `${currentLevel}% (${getLevelName(currentLevel)})`;
  certPartner.textContent = CONFIG.partnerName;

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
    certClauses.innerHTML = '<li class="text-stone-500 italic">Murni dimaafin karena cinta mati dan kangen sama Dudu 🥰</li>';
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

function getLevelName(val) {
  for (const m of BUBU_MOODS) {
    if (val <= m.max) return m.name;
  }
  return 'Mega Tantrum';
}

function setupWhatsAppLink(clauses) {
  const clausesText = clauses.length > 0
    ? clauses.map((c, i) => `${i + 1}. ${c}`).join('\n')
    : 'Murni dimaafin karena Bubu sayang banget sama Dudu! 🥰';

  const waMessage =
`🌸 *VOUCHER RESMI BERDAMAI BUBU & DUDU* 🌸
No: LOVE/BUBU-DUDU/${new Date().getFullYear()}/001

Hai Dudu sayang! Bubu udah nyelesaiin perundingan damai di web:

👑 *Yang Memaafkan:* ${CONFIG.partnerName}
🐻 *Yang Dimaafkan:* ${CONFIG.senderName}
📊 *Tingkat Ngambek Awal:* ${currentLevel}% (${getLevelName(currentLevel)})
✅ *Status:* RESMI BAIKAN & UDAH GAK NGAMBEK LAGI! 🥰✨

📋 *Denda Jajan yang WAJIB Dudu Tunaikan:*
${clausesText}

Ditunggu traktiran dan pelukannya ya Dudu! Love you! 🐻❤️🐼`;

  const encodedUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
  btnClaimWa.href = encodedUrl;

  btnCopyCert.onclick = () => {
    navigator.clipboard.writeText(waMessage).then(() => {
      sounds.playPop();
      btnCopyCert.textContent = 'Berhasil Disalin! ✨';
      setTimeout(() => {
        btnCopyCert.innerHTML = 'Salin Teks Perjanjian';
      }, 2500);
    });
  };
}

function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart-float';
  heart.textContent = ['🌸', '💖', '🥰', '✨', '💕', '🐻', '🐼'][Math.floor(Math.random() * 7)];
  heart.style.left = `${Math.random() * 90 + 5}vw`;
  heart.style.bottom = '20px';
  heart.style.fontSize = `${Math.random() * 16 + 18}px`;
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 3500);
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function initEvents() {
  // Slider listener
  moodSlider.addEventListener('input', (e) => {
    updateMoodLevel(e.target.value);
  });

  // Checkbox listeners
  compensationList.addEventListener('change', () => {
    sounds.playPop();
    updateSincerity();
  });

  // Custom demand
  addCustomBtn.addEventListener('click', addCustomDemand);
  customDemandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomDemand();
    }
  });

  // Decision buttons
  btnStillMad.addEventListener('click', handleStillMadClick);
  btnStillMad.addEventListener('mouseenter', () => {
    if (isDodgeActive) dodgeButton();
  });
  btnStillMad.addEventListener('touchstart', (e) => {
    if (isDodgeActive) {
      e.preventDefault();
      dodgeButton();
    }
  });

  btnForgive.addEventListener('click', handleForgiveClick);

  // Intro Envelope & Letter Interactions
  if (btnOpenEnvelope) {
    btnOpenEnvelope.addEventListener('click', () => {
      sounds.init();
      sounds.playPaper();
      sounds.playChime();
      introPhaseEnvelope.classList.add('hidden');
      introPhaseLetter.classList.remove('hidden');
    });
  }

  if (btnEnterDashboard) {
    btnEnterDashboard.addEventListener('click', () => {
      sounds.playPop();
      welcomeIntroModal.classList.add('hidden');
    });
  }

  if (btnReadLetter) {
    btnReadLetter.addEventListener('click', () => {
      sounds.playPaper();
      introPhaseEnvelope.classList.add('hidden');
      introPhaseLetter.classList.remove('hidden');
      welcomeIntroModal.classList.remove('hidden');
    });
  }

  // Modal dismiss
  modalActionBtn.addEventListener('click', () => {
    sounds.playPop();
    apologyModal.classList.add('hidden');
  });

  // Sound toggle
  soundToggleBtn.addEventListener('click', () => {
    CONFIG.soundEnabled = !CONFIG.soundEnabled;
    soundIcon.textContent = CONFIG.soundEnabled ? 'Suara Aktif' : 'Mute';
    soundToggleBtn.classList.toggle('opacity-60', !CONFIG.soundEnabled);
    if (CONFIG.soundEnabled) sounds.playPop();
  });

  // Settings Modal
  settingsBtn.addEventListener('click', () => {
    inputPartnerName.value = CONFIG.partnerName;
    inputWaNumber.value = CONFIG.whatsappNumber;
    settingsModal.classList.remove('hidden');
    sounds.playPop();
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    sounds.playPop();
  });

  saveSettingsBtn.addEventListener('click', () => {
    const wa = inputWaNumber.value.trim().replace(/[^0-9]/g, '');
    const partner = inputPartnerName.value.trim();

    if (wa) {
      CONFIG.whatsappNumber = wa;
      localStorage.setItem('defuser_wa', wa);
    }
    if (partner) {
      CONFIG.partnerName = partner;
      localStorage.setItem('defuser_partner', partner);
    }

    settingsModal.classList.add('hidden');
    sounds.playChime();
    updateSincerity();
  });

  // Restart simulation
  btnRestart.addEventListener('click', () => {
    sounds.playPop();
    refusalCount = 0;
    isDodgeActive = false;
    btnStillMad.style.position = '';
    btnStillMad.style.left = '';
    btnStillMad.style.top = '';
    btnStillMad.style.transform = '';
    btnStillMad.textContent = 'Masih Marah Bubu';
    btnForgive.style.transform = '';
    refusalCounterText.classList.add('hidden');

    moodSlider.value = 1;
    updateMoodLevel(1);
    updateSincerity();

    victoryView.classList.add('hidden');
    mainAppView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('pointerdown', () => sounds.init(), { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initEvents();
  updateMoodLevel(1);
  updateSincerity();
});
