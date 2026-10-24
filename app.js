(() => {
'use strict';
const $app = document.getElementById('app');
const MIN = 60e3, DAY = 864e5;
const INTERVAL = [0, 10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY];
const P_BY_BOX = [0.25, 0.4, 0.6, 0.75, 0.85, 0.95];
const MAX_HEARTS = 5, HEART_MS = 30 * MIN, NODE_LEVELS = 3, MAX_FREEZES = 2;
const LS = 'aiio-path-v2', LS_OLD = 'aiio-path-v1', LS_EXAM = 'aiio-path-exam-v1';
const MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];
const LEVELS = [
  [0, 'Один GPU'], [120, 'PCIe-карта'], [300, 'NVLink-пара'], [550, 'Узел DGX'], [900, 'Стойка'],
  [1350, 'Scalable Unit'], [1900, 'BasePOD'], [2600, 'SuperPOD'], [3500, 'AI Factory'], [4600, 'Архитектор AI Factory'],
];
const PRICES = { freeze: 200, hearts: 300, boost: 150 };

// ── icons ──
const I = {
  dc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="8" height="18" rx="1.5"/><rect x="13" y="3" width="8" height="18" rx="1.5"/><path d="M5.5 7h3M5.5 11h3M5.5 15h3M15.5 7h3M15.5 11h3M15.5 15h3" stroke-linecap="round"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5-1.5 5.2-1.5 7.6 0 1.3.9 2.2 2 2.2 1.6 0 2.3-1.6 1.8-3.7C17 10 19 12.8 19 15.5 19 19.6 15.9 22 12 22s-7-2.4-7-6.4C5 10.7 9.8 8.3 12 2z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3 1.7-1.8 3.1-3 5.3-3 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.6L13.5 2z"/></svg>',
  gem: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 3h11L22 9l-10 12L2 9zm1 2-2.4 3.5h3.6L10 5zm4.3 0-1.4 3.5h3.2L12.2 5zm4.4 0 1.3 3.5h3.6L16.7 5zM5 10.5l5.7 6.8-2.3-6.8zm5.5 0L12 15.6l1.5-5.1zm5.1 0-2.3 6.8 5.7-6.8z"/></svg>',
  ice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V7.5a5 5 0 0 1 10 0V10h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1zm2 0h6V7.5a3 3 0 0 0-6 0V10z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2.5 11h2.5v9h5v-6h4v6h5v-9h2.5z"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h2V7h3v10H5v-2H3zm18 0h-2V7h-3v10h3v-2h2zM9 11h6v2H9z"/></svg>',
  exam: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5zM7 12h10v2H7zm0 4h7v2H7z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.5"/><path d="M3 21c.8-4.4 4.4-7 9-7s8.2 2.6 9 7z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v2h4v3a5 5 0 0 1-4.6 5A5 5 0 0 1 13 15.9V19h4v2H7v-2h4v-3.1A5 5 0 0 1 7.6 13 5 5 0 0 1 3 8V5h4zm10 4v4a3 3 0 0 0 2-3V7zM5 7v1a3 3 0 0 0 2 3V7z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5a.5.5 0 0 0 0 1H20v3H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
  cards: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 3h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 7h1.5v12.5H17V21H4.5A1.5 1.5 0 0 1 3 19.5z"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  chip: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h2v2h2V2h2v2h1a3 3 0 0 1 3 3v1h2v2h-2v2h2v2h-2v2h2v2h-2v1a3 3 0 0 1-3 3h-1v2h-2v-2h-2v2H9v-2H8a3 3 0 0 1-3-3v-1H3v-2h2v-2H3v-2h2V8H3V6h2V7a3 3 0 0 1 3-3h1zm0 6v8h6V8z"/></svg>',
  chest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1H4zm0 3h7v2h2v-2h7v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/></svg>',
  quest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h11l3 3v15H5zm3 6v2h8V9zm0 4v2h8v-2zm0 4v2h5v-2z"/></svg>',
  shop: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16l1.5 5a3 3 0 0 1-5.5 1.8A3 3 0 0 1 12 12a3 3 0 0 1-4-1.2A3 3 0 0 1 2.5 9zm1 9.5c1.2.6 2.6.6 3.8 0 1 .6 2.1.8 3.2.6 1 .2 2.2 0 3.2-.6 1.2.6 2.6.6 3.8 0V20H5z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a6 6 0 0 1 6 6v4l2 4H4l2-4V8a6 6 0 0 1 6-6zm-2.5 16h5a2.5 2.5 0 0 1-5 0z"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h4l5-4v14l-5-4H3zm13.5-1.5a6 6 0 0 1 0 9l-1.4-1.4a4 4 0 0 0 0-6.2zM19 5a9.5 9.5 0 0 1 0 14l-1.4-1.4a7.5 7.5 0 0 0 0-11.2z"/></svg>',
};

// ── mascot "Тензор" ──
function mascot(state = 'idle', size = 96) {
  return `<svg class="mascot ${state}" width="${size}" height="${Math.round(size * 1.1)}" viewBox="0 0 120 132" aria-hidden="true">
    <ellipse class="shadow" cx="60" cy="124" rx="30" ry="5" fill="#000" opacity=".7"/>
    <g class="body-g">
      <line x1="60" y1="24" x2="60" y2="11" stroke="#9a9a9a" stroke-width="3" stroke-linecap="round"/>
      <circle class="ant" cx="60" cy="9" r="6" fill="#76b900"/>
      <circle cx="60" cy="9" r="11" fill="#76b900" opacity=".18" class="ant"/>
      <g fill="#76b900" opacity=".75">
        <rect x="14" y="40" width="8" height="5" rx="1.5"/><rect x="14" y="52" width="8" height="5" rx="1.5"/><rect x="14" y="64" width="8" height="5" rx="1.5"/>
        <rect x="98" y="40" width="8" height="5" rx="1.5"/><rect x="98" y="52" width="8" height="5" rx="1.5"/><rect x="98" y="64" width="8" height="5" rx="1.5"/>
      </g>
      <path class="arm-l" d="M22 74 C 10 78, 8 88, 12 96" stroke="#3a3a3a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path class="arm-r" d="M98 74 C 110 78, 112 88, 108 96" stroke="#3a3a3a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <rect x="22" y="24" width="76" height="78" rx="18" fill="#232323" stroke="#76b900" stroke-width="3"/>
      <rect x="30" y="32" width="60" height="42" rx="11" fill="#050505" stroke="#2f2f2f" stroke-width="2"/>
      <g class="e-normal" fill="#9be12a"><rect class="eye" x="41" y="45" width="10" height="14" rx="5"/><rect class="eye" x="69" y="45" width="10" height="14" rx="5"/></g>
      <g class="e-happy" fill="none" stroke="#9be12a" stroke-width="4" stroke-linecap="round"><path d="M40 55 q6 -9 12 0"/><path d="M68 55 q6 -9 12 0"/></g>
      <g class="e-sad" fill="none" stroke="#5ec8ff" stroke-width="4" stroke-linecap="round"><path d="M40 49 l11 5"/><path d="M80 49 l-11 5"/><circle cx="46" cy="60" r="2.5" fill="#5ec8ff" stroke="none"/></g>
      <g class="e-sleep" fill="none" stroke="#5f7d2a" stroke-width="4" stroke-linecap="round"><path d="M40 53 h11"/><path d="M69 53 h11"/></g>
      <path class="m-normal" d="M54 66 q6 4 12 0" stroke="#9be12a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path class="m-happy" d="M50 63 q10 10 20 0 z" fill="#9be12a"/>
      <path class="m-sad" d="M53 69 q7 -5 14 0" stroke="#5ec8ff" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="36" y="82" width="48" height="10" rx="3" fill="#121212"/>
      <rect x="40" y="85" width="9" height="4" rx="1" fill="#76b900"/><rect x="52" y="85" width="9" height="4" rx="1" fill="#76b900" opacity=".6"/><rect x="64" y="85" width="9" height="4" rx="1" fill="#76b900" opacity=".3"/>
      <rect x="38" y="102" width="14" height="12" rx="4" fill="#3a3a3a"/><rect x="68" y="102" width="14" height="12" rx="4" fill="#3a3a3a"/>
      <text class="zzz" x="94" y="22" fill="#9a9a9a" font-family="Exo 2, sans-serif" font-weight="800" font-size="14">z z</text>
    </g>
  </svg>`;
}

// ── helpers ──
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pad = n => String(n).padStart(2, '0');
const dayKey = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d.getTime()); };
const today = () => dayKey();
const yesterday = () => addDays(today(), -1);
const vibrate = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const days = n => n + ' ' + plural(n, 'день', 'дня', 'дней');

Q.forEach(x => { x.id = 'q' + hash(x.text); });
G.forEach(x => { x.id = 'g' + hash(x[1]); x.t = x[0]; x.term = x[1]; x.def = x[2]; x.d = 'd' + x[0].split('.')[0]; });
const QBY = Object.fromEntries(Q.map(x => [x.id, x]));
const GBY = Object.fromEntries(G.map(x => [x.id, x]));
const TKEYS = Object.keys(TOPICS);
const UNITS = Object.keys(DOMAINS);
const unitTopics = d => TKEYS.filter(t => 'd' + t.split('.')[0] === d);

// ── state ──
const fresh = () => ({ v: 2, onboarded: false, xp: 0, gems: 50, cards: {}, nodes: {}, units: {}, chests: {}, hearts: MAX_HEARTS, heartsAt: Date.now(), goal: 30, streakGoal: 7,
  streak: { day: '', count: 0, best: 0 }, freezes: 1, freezeDays: [], activeDays: {}, lostStreak: 0, milestones: [],
  quests: { day: '', list: [], chest: false }, boostUntil: 0, sound: true, remindAt: '20:00',
  stats: { answered: 0, correct: 0, lessons: 0, bestCombo: 0, flash: 0, perfect: 0, quests: 0 },
  exams: [], badges: [], unlockAll: false, introSeen: {} });
let S = fresh();
try {
  const raw = localStorage.getItem(LS);
  if (raw) S = Object.assign(fresh(), JSON.parse(raw));
  else {
    const old = localStorage.getItem(LS_OLD);
    if (old) {
      const o = JSON.parse(old);
      ['xp', 'cards', 'nodes', 'units', 'goal', 'exams', 'badges', 'unlockAll', 'introSeen'].forEach(k => { if (o[k] !== undefined) S[k] = o[k]; });
      S.stats = Object.assign(S.stats, o.stats || {});
      S.onboarded = true;
      if (o.streak && o.streak.day) { const [y, m, d] = o.streak.day.split('-').map(Number); S.streak = { day: dayKey(new Date(y, m - 1, d).getTime()), count: o.streak.count || 0, best: o.streak.best || o.streak.count || 0 }; S.activeDays[S.streak.day] = 1; }
    }
  }
} catch (e) {}
const save = () => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} };

// ── streak engine (with freezes) ──
let streakEvent = null; // {type:'freeze'|'lost', n}
function settleStreak() {
  const t = today(), y = yesterday(), last = S.streak.day;
  if (!last || last === t || last === y || !S.streak.count) return;
  const missed = [];
  for (let k = addDays(last, 1); k !== t && missed.length < 400; k = addDays(k, 1)) missed.push(k);
  if (missed.length <= S.freezes) {
    S.freezes -= missed.length; S.freezeDays = S.freezeDays.concat(missed).slice(-120);
    S.streak.day = y; streakEvent = { type: 'freeze', n: missed.length };
  } else {
    S.lostStreak = S.streak.count; S.streak.count = 0; streakEvent = { type: 'lost', n: S.lostStreak };
  }
  save();
}
const doneToday = () => S.streak.day === today();
const streakAlive = () => S.streak.count > 0 && (doneToday() || S.streak.day === yesterday());
const streakNow = () => (streakAlive() ? S.streak.count : 0);
const atRisk = () => streakAlive() && !doneToday() && new Date().getHours() >= 17;

function regenHearts() {
  if (S.hearts >= MAX_HEARTS) { S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); return; }
  const now = Date.now();
  while (S.hearts < MAX_HEARTS && now - S.heartsAt >= HEART_MS) { S.hearts++; S.heartsAt += HEART_MS; }
  if (S.hearts >= MAX_HEARTS) S.heartsAt = now;
}
const nextHeartIn = () => Math.max(0, HEART_MS - (Date.now() - S.heartsAt));
const todayXP = () => S.activeDays[today()] || 0;
const boostOn = () => S.boostUntil > Date.now();

const box = id => (S.cards[id] ? S.cards[id].b : 0);
const domainMastery = d => { const qs = Q.filter(x => x.d === d); return qs.reduce((s, x) => s + box(x.id), 0) / (qs.length * 5); };
const domainP = d => { const qs = Q.filter(x => x.d === d); return qs.reduce((s, x) => s + P_BY_BOX[box(x.id)], 0) / qs.length; };
const readiness = () => UNITS.reduce((s, d) => s + domainP(d) * DOMAINS[d].w / 100, 0);
function levelInfo() {
  let i = 0; while (i + 1 < LEVELS.length && S.xp >= LEVELS[i + 1][0]) i++;
  const cur = LEVELS[i][0], next = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
  return { n: i + 1, name: LEVELS[i][1], next, frac: next ? (S.xp - cur) / (next - cur) : 1 };
}
const nodeLevel = t => S.nodes[t] || 0;
const nodeUnlocked = t => { if (S.unlockAll) return true; const i = TKEYS.indexOf(t); return i === 0 || nodeLevel(TKEYS[i - 1]) >= 1; };
const unitTestUnlocked = d => S.unlockAll || unitTopics(d).every(t => nodeLevel(t) >= 1);
const currentNode = () => TKEYS.find(t => nodeUnlocked(t) && nodeLevel(t) === 0) || TKEYS.find(t => nodeLevel(t) < NODE_LEVELS) || null;

function grade(id, ok) {
  const c = S.cards[id] || { b: 0, due: 0, c: 0, w: 0 };
  if (ok) { const top = c.b === 5; c.b = Math.min(c.b + 1, 5); c.due = Date.now() + (top ? 30 * DAY : INTERVAL[c.b]); c.c++; }
  else { c.b = 1; c.due = Date.now() + INTERVAL[1]; c.w++; }
  S.cards[id] = c;
}

// ── sound ──
let actx = null;
function beep(notes) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    let t = actx.currentTime;
    notes.forEach(([f, d, type = 'sine', v = 0.08]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d); t += d * 0.75;
    });
  } catch (e) {}
}
const sfx = {
  ok: () => beep([[660, 0.09, 'triangle'], [990, 0.16, 'triangle']]),
  bad: () => beep([[180, 0.18, 'sawtooth', 0.05], [140, 0.22, 'sawtooth', 0.05]]),
  done: () => beep([[523, 0.1, 'triangle'], [659, 0.1, 'triangle'], [784, 0.1, 'triangle'], [1046, 0.3, 'triangle']]),
  tap: () => beep([[880, 0.04, 'sine', 0.03]]),
  coin: () => beep([[1318, 0.06, 'square', 0.03], [1760, 0.12, 'square', 0.03]]),
};

// ── toast + confetti ──
let toastT;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); }
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.getElementById('confetti'), ctx = c.getContext('2d');
  c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const cols = ['#76b900', '#9be12a', '#ffffff', '#ffc800', '#5ec8ff'];
  const ps = Array.from({ length: 130 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.32, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
  const t0 = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach(p => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += 0.15; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (t - t0 < 2300) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })(t0);
}

// ── quests ──
const QUEST_POOL = [
  { id: 'xp', m: 'xp', n: g => g, txt: n => `Заработай ${n} XP` },
  { id: 'les2', m: 'lesson', n: () => 2, txt: n => `Пройди ${n} урока` },
  { id: 'les3', m: 'lesson', n: () => 3, txt: n => `Пройди ${n} урока` },
  { id: 'combo5', m: 'combo', n: () => 5, txt: n => `Ответь верно ${n} раз подряд` },
  { id: 'combo10', m: 'combo', n: () => 10, txt: n => `Ответь верно ${n} раз подряд` },
  { id: 'perfect', m: 'perfect', n: () => 1, txt: () => 'Пройди урок без ошибок' },
  { id: 'flash', m: 'flash', n: () => 10, txt: n => `Повтори ${n} карточек` },
  { id: 'review', m: 'review', n: () => 1, txt: () => 'Пройди тренировку в Практике' },
  { id: 'correct', m: 'correct', n: () => 15, txt: n => `Дай ${n} верных ответов` },
];
function ensureQuests() {
  const t = today();
  if (S.quests.day === t) return;
  let seed = parseInt(hash(t), 36);
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const others = QUEST_POOL.filter(q => q.id !== 'xp').sort(() => rnd() - 0.5);
  const picked = [QUEST_POOL[0]];
  for (const q of others) { if (picked.length >= 3) break; if (!picked.some(p => p.m === q.m)) picked.push(q); }
  S.quests = { day: t, list: picked.map(q => ({ id: q.id, prog: 0, target: q.n(S.goal), claimed: false })), chest: false };
  save();
}
function questEvent(m, val = 1) {
  ensureQuests();
  S.quests.list.forEach(q => {
    const def = QUEST_POOL.find(p => p.id === q.id);
    if (!def || def.m !== m || q.prog >= q.target) return;
    q.prog = m === 'combo' ? Math.max(q.prog, val) : q.prog + val;
    if (q.prog >= q.target) { q.prog = q.target; setTimeout(() => toast('Задание выполнено: ' + def.txt(q.target)), 700); }
  });
}
const questsReady = () => { ensureQuests(); return S.quests.list.filter(q => q.prog >= q.target && !q.claimed).length + (S.quests.list.every(q => q.claimed) && !S.quests.chest ? 1 : 0); };

// ── progress ──
let pendingStreak = false;
function addXP(n) {
  if (n <= 0) return 0;
  const before = levelInfo().n, t = today();
  const wasBelow = todayXP() < S.goal;
  S.xp += n; S.activeDays[t] = (S.activeDays[t] || 0) + n;
  if (S.streak.day !== t) {
    S.streak.count = S.streak.day === yesterday() && S.streak.count ? S.streak.count + 1 : 1;
    S.streak.day = t; S.streak.best = Math.max(S.streak.best || 0, S.streak.count);
    pendingStreak = true; S.lostStreak = 0;
    const m = MILESTONES.find(x => x === S.streak.count);
    if (m && !S.milestones.includes(m)) { S.milestones.push(m); S.gems += m * 5; if (m >= 7 && S.freezes < MAX_FREEZES) S.freezes++; }
  }
  questEvent('xp', n);
  const L = levelInfo();
  if (L.n > before) setTimeout(() => toast('Новый уровень ' + L.n + ': ' + L.name), 400);
  else if (wasBelow && todayXP() >= S.goal) setTimeout(() => toast('Дневная цель выполнена!'), 400);
  return n;
}
const BADGES = [
  ['first', 'Первый урок', 'Пройди первый урок', () => S.stats.lessons >= 1],
  ['perfect', 'Без ошибок', 'Урок без единой ошибки', () => S.stats.perfect >= 1],
  ['combo10', 'Серия ×10', '10 верных ответов подряд', () => S.stats.bestCombo >= 10],
  ['s3', 'Искра', 'Серия 3 дня', () => (S.streak.best || 0) >= 3],
  ['s7', 'Неделя огня', 'Серия 7 дней', () => (S.streak.best || 0) >= 7],
  ['pweek', 'Идеальная неделя', '7 дней подряд без заморозок', () => perfectWeek()],
  ['s30', 'Месяц', 'Серия 30 дней', () => (S.streak.best || 0) >= 30],
  ['q10', 'Исполнитель', 'Выполни 10 заданий дня', () => S.stats.quests >= 10],
  ['u1', 'Основы AI', 'Контрольная раздела 1', () => !!S.units.d1],
  ['u2', 'Инфраструктура', 'Контрольная раздела 2', () => !!S.units.d2],
  ['u3', 'Эксплуатация', 'Контрольная раздела 3', () => !!S.units.d3],
  ['gold', 'Золотой путь', 'Все уроки на максимум', () => TKEYS.every(t => nodeLevel(t) >= NODE_LEVELS)],
  ['exam1', 'Первый экзамен', 'Пройди пробный экзамен', () => S.exams.length >= 1],
  ['pass', 'Сдано', '70% на пробном экзамене', () => S.exams.some(e => e.score >= 0.7)],
  ['ace', 'Отличник', '85% на пробном экзамене', () => S.exams.some(e => e.score >= 0.85)],
];
function perfectWeek() { let k = today(); if (!S.activeDays[k]) k = yesterday(); for (let i = 0; i < 7; i++) { if (!S.activeDays[k] || S.freezeDays.includes(k)) return false; k = addDays(k, -1); } return true; }
function checkBadges() { BADGES.forEach(([id, name, , t]) => { if (!S.badges.includes(id) && t()) { S.badges.push(id); S.gems += 20; setTimeout(() => toast('Достижение: ' + name + ' · +20'), 1300); } }); }

// ── chrome ──
let tab = 'learn', view = 'learn', openNode = null, L = null, F = null, exam = null, notesD = 'd1', resetAsk = false, deferredPrompt = null, onb = { step: 0 };
function statusBar() {
  regenHearts();
  const lv = levelInfo(), st = streakNow();
  return `<div class="status">
    <span class="logo" title="AIIO Path">${DUCK}</span>
    <button class="stat fire ${st ? '' : 'off'} ${atRisk() ? 'risk' : ''}" data-streak aria-label="Серия дней">${I.fire}<span>${st}</span></button>
    <button class="stat gem" data-tab="quests" aria-label="Кристаллы">${I.gem}<span>${S.gems}</span></button>
    ${boostOn() ? `<span class="stat boost" title="Двойной XP">${I.bolt}<span>×2</span></span>` : `<span class="stat lvl" title="Уровень">${I.chip}<span>${lv.n}</span></span>`}
    <button class="stat heart" data-tab="quests" aria-label="Сердца">${I.heart}<span>${S.hearts}</span></button>
  </div>`;
}
function tabBar() {
  const qr = questsReady();
  const t = (id, icon, label, dot) => `<button class="tab ${tab === id ? 'on' : ''}" data-tab="${id}"><span class="ti">${icon}${dot ? '<span class="dot"></span>' : ''}</span>${label}</button>`;
  return `<nav class="tabs"><div class="tabs-in">${t('learn', I.home, 'Путь')}${t('map', I.dc, 'ЦОД')}${t('practice', I.dumbbell, 'Практика')}${t('quests', I.quest, 'Задания', qr > 0)}${t('exam', I.exam, 'Экзамен')}${t('profile', I.user, 'Профиль')}</div></nav>`;
}
// Screens animate in only when the view (or lesson step) changes, not on every re-render.
let lastKey = '';
function enterCls() { const k = view + (view === 'lesson' && L ? ':' + L.i : ''); const c = k !== lastKey ? ' enter' : ''; lastKey = k; return c; }
function page(html) { $app.innerHTML = `<div class="screen${enterCls()}">${statusBar()}${html}</div>${tabBar()}`; enhance(); }
function full(html) { $app.innerHTML = `<div class="screen full${enterCls()}">${html}</div>`; enhance(); }
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function enhance() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduced() || !to) { el.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 700 + Math.min(600, to * 8);
    (function f(t) { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(f); })(t0);
  });
}
// 3D tilt for map tiles and hero cards
document.addEventListener('pointermove', e => {
  const el = e.target.closest && e.target.closest('.tilt'); if (!el || reduced() || e.pointerType === 'touch') return;
  const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty('--ry', (x * 14).toFixed(1) + 'deg'); el.style.setProperty('--rx', (-y * 14).toFixed(1) + 'deg'); el.style.setProperty('--gx', (x + 0.5) * 100 + '%'); el.style.setProperty('--gy', (y + 0.5) * 100 + '%');
});
document.addEventListener('pointerout', e => { const el = e.target.closest && e.target.closest('.tilt'); if (el && !el.contains(e.relatedTarget)) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); } });

// ── mascot lines ──
const TIPS = [
  'NVLink связывает GPU <b>внутри</b> узла, InfiniBand — <b>между</b> узлами.',
  'PUE = вся мощность ЦОД / мощность IT. Идеал — <b>1,0</b>.',
  'MIG делит GPU максимум на <b>7</b> изолированных частей.',
  'Gb/s делим на 8, чтобы получить GB/s: 400G ≈ <b>50 ГБ/с</b>.',
  'DCGM — мониторинг и диагностика GPU в масштабе всего ЦОД.',
  'DGX H100: <b>8 GPU</b>, 640 ГБ HBM3, ~10,2 кВт.',
  'RoCE v2 требует lossless Ethernet: <b>PFC + ECN</b>.',
  'DPU BlueField разгружает CPU: сеть, хранение, безопасность.',
  'sbatch — отправить задачу в Slurm, squeue — посмотреть очередь.',
  'Обучение: forward + backward. Инференс: только forward.',
];
function mascotLine() {
  if (streakEvent && streakEvent.type === 'freeze') return ['idle', `Заморозка спасла твою серию: пропущено ${days(streakEvent.n)}. Сегодня не пропускай!`];
  if (S.lostStreak) return ['sad', `Серия в ${days(S.lostStreak)} сгорела. Начнём новую прямо сейчас, это займёт 5 минут.`];
  if (atRisk()) return ['sad', `Серия в ${days(S.streak.count)} под угрозой! Один урок, и огонь горит дальше.`];
  if (!S.stats.lessons) return ['idle', 'Привет, я <b>Тензор</b>! Пройдём путь к сертификату NCA-AIIO вместе. Жми на первый урок.'];
  if (doneToday() && todayXP() >= S.goal) return ['happy', `Цель дня выполнена, серия <b>${days(S.streak.count)}</b>. Ещё урок для закрепления?`];
  const h = new Date().getHours();
  const tip = TIPS[(new Date().getDate() + h) % TIPS.length];
  return ['idle', (h < 12 ? 'Доброе утро! ' : h >= 18 ? 'Добрый вечер! ' : '') + 'Факт дня: ' + tip];
}

// ── LEARN ──
const OFFS = [0, 46, 72, 46, 0, -46, -72, -46];
function renderLearn() {
  view = 'learn'; tab = 'learn';
  ensureQuests();
  const cur = currentNode();
  const [ms, line] = mascotLine();
  let k = 0;
  const units = UNITS.map((d, ui) => {
    const D = DOMAINS[d];
    const tps = unitTopics(d);
    let nodes = '';
    tps.forEach((t, idx) => {
      const off = OFFS[k++ % OFFS.length];
      const lvl = nodeLevel(t), un = nodeUnlocked(t), done = lvl >= NODE_LEVELS;
      const icon = !un ? I.lock : done ? I.trophy : lvl > 0 ? I.check : I.star;
      nodes += `<div class="node-wrap" style="transform:translateX(${off}px)">
        ${t === cur && openNode !== t ? `<span class="start-bubble">${lvl ? 'Дальше' : 'Старт'}</span>` : ''}
        <button class="node ${!un ? 'locked' : done ? 'done' : ''} ${t === cur ? 'cur' : ''}" style="${lvl >= 2 ? '--lvl2:var(--green-l)' : ''}" data-node="${t}" aria-label="${esc(TOPICS[t])}">${icon}${un && lvl ? `<span class="crowns">${lvl}/${NODE_LEVELS}</span>` : ''}</button>
        <span class="node-label">${t} · ${esc(TOPICS[t])}</span>
      </div>`;
      if (openNode === t) nodes += popNode(t);
      if ((idx + 1) % 3 === 0 && idx < tps.length - 1) {
        const off2 = OFFS[k++ % OFFS.length], cid = 'c' + t;
        const avail = nodeLevel(t) >= 1, used = !!S.chests[cid];
        nodes += `<div class="node-wrap" style="transform:translateX(${off2}px)"><button class="node chest ${used ? 'used' : avail ? 'open' : ''}" data-chest="${cid}" ${avail && !used ? '' : 'aria-disabled="true"'} aria-label="Сундук">${I.chest}</button></div>`;
      }
    });
    const tOpen = openNode === 'test-' + d, tUn = unitTestUnlocked(d), passed = !!S.units[d];
    nodes += `<div class="node-wrap"><button class="node test ${!tUn ? 'locked' : passed ? 'done' : ''}" data-node="test-${d}" aria-label="Контрольная раздела">${tUn ? I.trophy : I.lock}</button><span class="node-label">Контрольная раздела</span></div>${tOpen ? popTest(d, tUn, passed) : ''}`;
    return `<section class="u${ui + 1}">
      <div class="unit"><div><div class="k">Раздел ${ui + 1} · ${D.w}% экзамена</div><h2>${esc(D.name)}</h2><div class="ru">${esc(D.ru)} · освоено ${Math.round(domainMastery(d) * 100)}%</div></div><button class="notes-btn" data-notes="${d}">Конспект</button></div>
      <div class="path">${nodes}</div>
    </section>`;
  }).join('');
  const qDone = S.quests.list.filter(q => q.prog >= q.target).length;
  page(`
    <div class="hero">${mascot(ms, 96)}<div class="bubble">${line}</div></div>
    ${reviewCTA()}
    <button class="mini-quests" data-tab="quests">
      <div class="head"><span>Задания дня</span><span class="mono muted small">${qDone}/3</span></div>
      ${S.quests.list.map(q => { const def = QUEST_POOL.find(p => p.id === q.id); return `<div class="mq ${q.prog >= q.target ? 'done' : ''}"><span>${esc(def.txt(q.target))}</span><div class="meter"><i style="width:${q.prog / q.target * 100}%;background:${q.prog >= q.target ? 'var(--green)' : 'var(--gold)'}"></i></div></div>`; }).join('')}
    </button>
    ${units}`);
  if (streakEvent) { streakEvent = null; }
  const curEl = document.querySelector('.node.cur');
  if (curEl && !openNode && !renderLearn.scrolled && S.stats.lessons) { renderLearn.scrolled = true; curEl.scrollIntoView({ block: 'center' }); }
}
function reviewCTA() {
  const now = Date.now(), n = Q.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).length;
  if (!n) return '';
  const hot = svcList().length;
  return `<button class="review-cta" data-service><span class="ic">${I.target}</span><span class="tx"><b>Повтор дня · ${Math.min(n, 10)} ${plural(Math.min(n, 10), 'вопрос', 'вопроса', 'вопросов')}</b><span>${hot ? hotTxt(hot) + ', повтор вернёт мощность' : 'Вспомнить сейчас, пока не забылось: так запоминается надолго'}</span></span><span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></span></button>`;
}
function popNode(t) {
  const un = nodeUnlocked(t), lvl = nodeLevel(t);
  if (!un) return `<div class="popover locked"><h3>${esc(TOPICS[t])}</h3><p class="sub">Пройди предыдущий урок, чтобы открыть этот. Или открой все уроки в профиле.</p></div>`;
  const done = lvl >= NODE_LEVELS;
  regenHearts();
  return `<div class="popover"><h3>${esc(TOPICS[t])}</h3>
    <div class="lvl-dots">${Array.from({ length: NODE_LEVELS }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>
    <p class="sub">${done ? 'Пройдено на максимум. Повтор закрепит знания.' : 'Уровень ' + (lvl + 1) + ' из ' + NODE_LEVELS + ' · 8 заданий, одно из прошлых тем'}</p>
    <button class="btn" data-start="${t}" ${S.hearts ? '' : 'disabled'}>${S.hearts ? (done ? 'Повторить' : 'Начать') : 'Нет сердец'}</button>
    <button class="btn dark" data-theory="${t}">Теория</button>
  </div>`;
}
function popTest(d, un, passed) {
  if (!un) return `<div class="popover locked"><h3>Контрольная раздела</h3><p class="sub">Откроется, когда пройдёшь все уроки раздела хотя бы на первый уровень.</p></div>`;
  return `<div class="popover"><h3>Контрольная: ${esc(DOMAINS[d].name)}</h3><p class="sub">12 вопросов по всему разделу. ${passed ? 'Уже пройдена, можно пересдать.' : 'Пройди и получи кубок и 50 кристаллов.'}</p>
    <button class="btn" data-test="${d}" ${S.hearts ? '' : 'disabled'}>${S.hearts ? 'Начать' : 'Нет сердец'}</button></div>`;
}
function openChest(cid) {
  if (S.chests[cid]) return;
  const t = cid.slice(1); if (nodeLevel(t) < 1) { toast('Пройди урок перед сундуком'); return; }
  const g = 15 + Math.floor(Math.random() * 26);
  S.chests[cid] = 1; S.gems += g; save(); sfx.coin(); confetti(); toast('Сундук: +' + g + ' кристаллов'); renderLearn();
}

// ── theory / notes ──
function renderTheory(t, thenStart) {
  view = 'theory';
  const cards = G.filter(g => g.t === t);
  full(`<div class="lesson-top"><button class="x" data-back aria-label="Закрыть">${I.x}</button><h2 style="font-size:18px">${esc(TOPICS[t])}</h2></div>
    <div class="lesson-body" style="padding-bottom:110px">
      <div class="hero" style="grid-template-columns:72px 1fr">${mascot('think', 72)}<div class="bubble">Сначала пробеги ключевые понятия. Потом проверим, что запомнилось.</div></div>
      <div class="theory">${cards.map(g => `<div class="t"><b>${esc(g.term)}</b><span>${esc(g.def)}</span></div>`).join('') || '<p class="muted">Для этой подтемы карточек нет, учимся сразу на вопросах.</p>'}</div>
    </div>
    <div class="sheet"><div class="sheet-in"><button class="btn" data-start="${t}" data-skipintro="1">${thenStart ? 'Понятно, к заданиям' : 'Начать урок'}</button></div></div>`);
}
function renderNotes(d) {
  view = 'notes'; notesD = d;
  full(`<div class="lesson-top"><button class="x" data-back aria-label="Закрыть">${I.x}</button><h2 style="font-size:18px">Конспект</h2></div>
    <div class="row" style="margin-bottom:14px">${UNITS.map((u, i) => `<button class="btn sm ${u === d ? '' : 'dark'}" data-notes="${u}">Раздел ${i + 1}</button>`).join('')}</div>
    <h2>${esc(DOMAINS[d].name)} · ${DOMAINS[d].w}%</h2>
    <div class="notes">${NOTES[d].map(([h, items]) => `<h3>${esc(h)}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`).join('')}</div>`);
}

// ── streak screen ──
function renderStreak(celebrate) {
  view = 'streak';
  const st = streakNow(), t = today();
  const monday = addDays(t, -((parseDay(t).getDay() + 6) % 7));
  const week = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((lbl, i) => {
    const k = addDays(monday, i), on = !!S.activeDays[k], ice = S.freezeDays.includes(k);
    return `<div class="d"><span class="c ${on ? 'on' : ice ? 'ice' : ''} ${k === t ? 'today' : ''}">${on ? I.fire : ice ? I.ice : ''}</span>${lbl}</div>`;
  }).join('');
  const start = addDays(monday, -21);
  const month = Array.from({ length: 28 }, (_, i) => { const k = addDays(start, i); const fut = parseDay(k) > parseDay(t); return `<span class="${fut ? 'fut' : S.activeDays[k] ? 'on' : S.freezeDays.includes(k) ? 'ice' : ''}">${parseDay(k).getDate()}</span>`; }).join('');
  const nextM = MILESTONES.find(m => m > st) || 365;
  const goalLeft = Math.max(0, S.streakGoal - st);
  full(`<div class="lesson-top"><button class="x" data-back aria-label="Закрыть">${I.x}</button><h2 style="font-size:18px">Серия</h2></div>
    <div style="display:grid;gap:16px;padding-bottom:24px">
      <div class="streak-hero">
        <svg class="flame-big ${st ? '' : 'off'} ${celebrate ? 'anim' : ''}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5-1.5 5.2-1.5 7.6 0 1.3.9 2.2 2 2.2 1.6 0 2.3-1.6 1.8-3.7C17 10 19 12.8 19 15.5 19 19.6 15.9 22 12 22s-7-2.4-7-6.4C5 10.7 9.8 8.3 12 2z"/></svg>
        <div class="streak-num ${st ? '' : 'off'}">${st}</div>
        <h2>${celebrate ? (st === 1 ? 'Серия началась!' : 'Серия продлена!') : st ? days(st) + ' подряд' : 'Серии пока нет'}</h2>
        <p class="muted small">${doneToday() ? 'Сегодня уже засчитано. Возвращайся завтра.' : st ? 'Сегодня ещё не занимался. Один урок продлит серию.' : 'Пройди урок, чтобы зажечь огонь.'}</p>
      </div>
      <div class="card"><div class="week">${week}</div></div>
      <div class="card">
        <div class="kv"><span>Цель серии</span><span class="mono">${Math.min(st, S.streakGoal)} / ${S.streakGoal}</span></div>
        <div class="meter"><i style="width:${Math.min(1, st / S.streakGoal) * 100}%;background:var(--orange)"></i></div>
        <p class="muted small">${goalLeft ? 'Ещё ' + days(goalLeft) + ' до цели.' : 'Цель достигнута! Поставь новую.'}</p>
        <div class="opts4">${[7, 14, 30, 60].map(g => `<button class="${S.streakGoal === g ? 'on' : ''}" data-sgoal="${g}">${g}</button>`).join('')}</div>
      </div>
      <div class="card">
        <div class="kv"><span style="display:flex;gap:8px;align-items:center;color:var(--ice)">${I.ice.replace('<svg', '<svg width="22" height="22"')}Заморозки</span><span class="mono">${S.freezes} / ${MAX_FREEZES}</span></div>
        <p class="muted small">Если пропустишь день, заморозка сработает сама и серия не сгорит. Новая даётся на вехах 7+ дней, либо купи в магазине.</p>
        <button class="btn ice sm" data-buy="freeze" ${S.freezes >= MAX_FREEZES || S.gems < PRICES.freeze ? 'disabled' : ''}>Купить за ${PRICES.freeze}</button>
      </div>
      <div class="card"><h3>Последние 4 недели</h3><div class="month">${month}</div></div>
      <div class="card"><h3>Вехи · следующая ${nextM}</h3><div class="miles">${MILESTONES.map(m => `<div class="mile ${S.milestones.includes(m) || (S.streak.best || 0) >= m ? 'got' : ''}"><b>${m}</b><span>+${m * 5} ${I.gem.replace('<svg', '<svg width="10" height="10"')}</span></div>`).join('')}</div><p class="muted small">Рекорд: ${days(S.streak.best || 0)}</p></div>
      <div class="card">
        <h3 style="display:flex;gap:8px;align-items:center">${I.bell.replace('<svg', '<svg width="20" height="20"')}Напоминание</h3>
        <p class="muted small">Добавь ежедневное событие в календарь телефона, чтобы не терять серию.</p>
        <div class="row"><input type="time" id="remind" value="${esc(S.remindAt)}" aria-label="Время напоминания"><button class="btn sm" data-ics>В календарь</button></div>
      </div>
      ${celebrate ? '<button class="btn" data-back>Продолжить</button>' : ''}
    </div>`);
  if (celebrate) { sfx.done(); if (st > 1) confetti(); }
}
function downloadICS() {
  const v = (document.getElementById('remind') || {}).value || '20:00';
  S.remindAt = v; save();
  const [h, m] = v.split(':');
  const d = new Date(); const dt = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AIIO Path//RU', 'BEGIN:VEVENT', 'UID:aiio-path-daily@asgcompute', 'DTSTAMP:' + dt + 'T000000Z',
    'DTSTART:' + dt + 'T' + pad(h) + pad(m) + '00', 'DURATION:PT10M', 'RRULE:FREQ=DAILY', 'SUMMARY:AIIO Path: урок дня', 'DESCRIPTION:Сохрани серию: ' + location.href,
    'URL:' + location.href, 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Пора на урок AIIO Path', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'aiio-path-reminder.ics';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('Открой файл, чтобы добавить напоминание');
}

// ── lesson engine ──
const mcqItem = (q, rev) => ({ type: 'mcq', id: q.id, order: shuffle([0, 1, 2, 3]), rev: !!rev });
const pickQs = (pool, n) => shuffle(pool).sort((a, b) => box(a.id) - box(b.id)).slice(0, n);
function tfItem(t, d) {
  const pool = G.filter(g => g.t === t); const src = pool.length ? pool : G.filter(g => g.d === d);
  const g = src[Math.floor(Math.random() * src.length)];
  const truth = Math.random() < 0.5;
  let shown = g;
  if (!truth) { const others = G.filter(o => o.d === g.d && o.id !== g.id); shown = others[Math.floor(Math.random() * others.length)]; }
  return { type: 'tf', g: g.id, shown: shown.id, truth };
}
function matchItem(t, d) {
  let pool = shuffle(G.filter(g => g.t === t));
  if (pool.length < 4) pool = pool.concat(shuffle(G.filter(g => g.d === d && g.t !== t))).slice(0, 4);
  const ids = pool.slice(0, 4).map(g => g.id);
  return { type: 'match', ids, defs: shuffle(ids), done: [], selT: null, selD: null, bad: null, errors: 0 };
}
function interleaveQ(t) {
  // one question from an earlier, already-started topic: due first, then weakest
  const idx = TKEYS.indexOf(t);
  const prev = Q.filter(x => TKEYS.indexOf(x.t) < idx && nodeLevel(x.t) >= 1);
  if (!prev.length) return null;
  const now = Date.now();
  const due = prev.filter(x => S.cards[x.id] && S.cards[x.id].due <= now);
  return (due.length ? shuffle(due) : pickQs(prev, 3))[0];
}
function newLesson(kind, items, extra) { L = Object.assign({ kind, items, i: 0, missed: [], hearts: kind === 'lesson' || kind === 'test', correct: 0, wrong: 0, combo: 0, sel: null, fb: null, t0: Date.now() }, extra); renderLesson(); }
function startLesson(t) {
  const d = 'd' + t.split('.')[0];
  const qs = pickQs(Q.filter(x => x.t === t), 5).map(q => mcqItem(q));
  const rq = interleaveQ(t);
  const items = [qs[0], qs[1], tfItem(t, d), qs[2], matchItem(t, d), qs[3], rq ? mcqItem(rq, true) : null, qs[4]].filter(Boolean);
  newLesson('lesson', items, { topic: t, d });
}
function startTest(d) {
  const items = [];
  unitTopics(d).forEach(t => { const q = pickQs(Q.filter(x => x.t === t), 1)[0]; if (q) items.push(q); });
  const rest = pickQs(Q.filter(x => x.d === d && !items.includes(x)), 12 - items.length);
  newLesson('test', shuffle(items.concat(rest)).slice(0, 12).map(q => mcqItem(q)), { d });
}
function pickReview(n) {
  const now = Date.now();
  const due = Q.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).sort((a, b) => box(a.id) - box(b.id));
  let pick = due.slice(0, n);
  if (pick.length < n) pick = pick.concat(shuffle(Q.filter(x => S.cards[x.id] && !pick.includes(x))).sort((a, b) => box(a.id) - box(b.id)).slice(0, n - pick.length));
  if (pick.length < n) pick = pick.concat(shuffle(Q.filter(x => !pick.includes(x) && nodeUnlocked(x.t))).slice(0, n - pick.length));
  return shuffle(pick);
}
function startReview(kind) {
  const qs = kind === 'service' ? pickReview(10) : kind === 'weak' ? shuffle(Q.filter(x => S.cards[x.id] && S.cards[x.id].w > 0 && S.cards[x.id].b <= 2)).slice(0, 12) : pickReview(10);
  if (!qs.length) { toast('Пока нечего повторять'); return; }
  newLesson(kind, qs.map(q => mcqItem(q)));
}

function renderLesson() {
  view = 'lesson';
  const it = L.items[L.i];
  const pct = Math.round(L.i / L.items.length * 100);
  regenHearts();
  const top = `<div class="lesson-top"><button class="x" data-quit aria-label="Выйти">${I.x}</button><div class="bar"><i style="width:${pct}%"></i></div>${L.hearts ? `<span class="stat heart">${I.heart}<span>${S.hearts}</span></span>` : ''}</div>`;
  const combo = L.combo >= 3 ? `<span class="combo">Серия ×${L.combo}</span>` : '';
  let body = '', canCheck = false;
  if (it.type === 'mcq') {
    const q = QBY[it.id], lock = !!L.fb;
    body = `<p class="qtype">${it.rev ? '<span class="rev">Повтор из прошлых тем</span>' : ''}${combo}<span>${q.t} ${esc(TOPICS[q.t])}</span></p>
      <div class="qtext">${esc(q.text)}</div>
      <div class="choices">${it.order.map((oi, k) => {
        let cls = '';
        if (lock) { if (oi === 0) cls = 'right'; else if (k === L.sel) cls = 'wrong'; } else if (k === L.sel) cls = 'sel';
        return `<button class="choice ${cls}" data-ch="${k}" ${lock ? 'disabled' : ''}><span class="n">${k + 1}</span><span>${esc(q.opts[oi])}</span></button>`;
      }).join('')}</div>`;
    canCheck = L.sel !== null;
  } else if (it.type === 'tf') {
    const g = GBY[it.g], s = GBY[it.shown];
    body = `<p class="qtype">${combo}<span>Верно ли определение?</span></p>
      <div class="tf-card"><div class="term">${esc(g.term)}</div><div>${esc(s.def)}</div></div>
      <div class="choices">${['Верно', 'Неверно'].map((lbl, k) => {
        let cls = ''; const val = k === 0;
        if (L.fb) { if (val === it.truth) cls = 'right'; else if (L.sel === k) cls = 'wrong'; } else if (L.sel === k) cls = 'sel';
        return `<button class="choice ${cls}" data-ch="${k}" ${L.fb ? 'disabled' : ''}><span class="n">${k + 1}</span><span>${lbl}</span></button>`;
      }).join('')}</div>`;
    canCheck = L.sel !== null;
  } else {
    body = `<p class="qtype">${combo}<span>Соедини термины с определениями</span></p>
      <div class="match">
        <div class="terms">${it.ids.map(id => `<button class="chip ${it.done.includes(id) ? 'ok' : it.selT === id ? 'sel' : ''}" data-mt="${id}" ${it.done.includes(id) ? 'disabled' : ''}>${esc(GBY[id].term)}</button>`).join('')}</div>
        ${it.defs.map(id => `<button class="chip def ${it.done.includes(id) ? 'ok' : it.selD === id ? 'sel' : ''} ${it.bad === 'd' + id ? 'bad' : ''}" data-md="${id}" ${it.done.includes(id) ? 'disabled' : ''}>${esc(GBY[id].def)}</button>`).join('')}
      </div>`;
  }
  let sheet = '';
  if (L.fb) {
    const ok = L.fb.ok;
    let ex = '';
    if (it.type === 'mcq') { const q = QBY[it.id]; ex = (ok ? '' : `<div class="answer">Правильно: ${esc(q.opts[0])}</div>`) + `<div class="ex">${esc(q.ex)}</div>`; }
    else if (it.type === 'tf') { const g = GBY[it.g]; ex = `<div class="ex"><b>${esc(g.term)}</b>: ${esc(g.def)}</div>`; }
    else ex = `<div class="ex">${it.errors ? 'Ошибок при сопоставлении: ' + it.errors + '.' : 'Все пары с первой попытки.'}</div>`;
    const words = ok ? (L.combo >= 5 ? ['Ты в ударе!', 'Неудержимо!'] : ['Отлично!', 'Верно!', 'Так держать!', 'Точно в цель!']) : ['Не совсем', 'Почти!', 'Запомним это'];
    sheet = `<div class="sheet ${ok ? 'ok' : 'bad'}"><div class="sheet-in">
      <div class="verdict">${mascot(ok ? 'happy' : 'sad', 56)}<h3>${words[Math.floor(Math.random() * words.length)]}</h3></div>
      ${ex}
      <button class="btn ${ok ? '' : 'red'}" data-next id="go">Продолжить</button></div></div>`;
  } else if (it.type !== 'match') sheet = `<div class="sheet"><div class="sheet-in"><button class="btn" data-check id="go" ${canCheck ? '' : 'disabled'}>Проверить</button></div></div>`;
  full(top + `<div class="lesson-body">${body}</div>` + sheet);
}
function check() {
  const it = L.items[L.i];
  if (L.fb || L.sel === null || it.type === 'match') return;
  let ok;
  if (it.type === 'mcq') { ok = it.order[L.sel] === 0; grade(it.id, ok); }
  else { ok = (L.sel === 0) === it.truth; grade(it.g, ok); }
  resolve(ok);
}
function resolve(ok) {
  const it = L.items[L.i];
  S.stats.answered++;
  if (ok) { L.correct++; L.combo++; S.stats.correct++; S.stats.bestCombo = Math.max(S.stats.bestCombo, L.combo); questEvent('combo', L.combo); questEvent('correct'); sfx.ok(); vibrate(12); }
  else {
    L.wrong++; L.combo = 0; vibrate([40, 60, 40]); sfx.bad();
    const mk = it.type === 'mcq' ? it.id : it.type === 'tf' ? it.g : null; if (mk && !L.missed.includes(mk)) L.missed.push(mk);
    if (L.hearts) { regenHearts(); if (S.hearts === MAX_HEARTS) S.heartsAt = Date.now(); S.hearts = Math.max(0, S.hearts - 1); }
    if (!it.again && it.type !== 'match') { const copy = Object.assign({}, it, { again: true }); if (copy.order) copy.order = shuffle([0, 1, 2, 3]); L.items.push(copy); }
  }
  L.fb = { ok };
  save(); renderLesson();
  const go = document.getElementById('go'); go && go.focus({ preventScroll: true });
}
function next() {
  if (!L.fb) return;
  L.fb = null; L.sel = null; L.i++;
  if (L.hearts && S.hearts <= 0) return renderNoHearts();
  if (L.i >= L.items.length) return finishLesson();
  renderLesson();
}
function matchTap(kind, id) {
  const it = L.items[L.i];
  if (it.done.includes(id)) return;
  it.bad = null;
  if (kind === 't') it.selT = it.selT === id ? null : id; else it.selD = it.selD === id ? null : id;
  if (it.selT && it.selD) {
    if (it.selT === it.selD) { it.done.push(it.selT); grade(it.selT, true); sfx.tap(); }
    else { it.errors++; it.bad = 'd' + it.selD; vibrate(80); }
    it.selT = null; it.selD = null;
  }
  if (it.done.length === it.ids.length) { L.sel = 0; resolve(it.errors <= 1); return; }
  renderLesson();
}
function finishLesson() {
  const k = L.kind, perfect = L.wrong === 0;
  const secs = Math.round((Date.now() - L.t0) / 1000);
  const acc = Math.round(L.correct / Math.max(1, L.correct + L.wrong) * 100);
  let xp = 0, gems = 0, title = 'Урок пройден!', note = '';
  if (k === 'lesson') {
    const lvl = nodeLevel(L.topic);
    xp = lvl >= NODE_LEVELS ? 5 : 10 + Math.min(L.correct, 8) - Math.min(L.wrong, 3) + (perfect ? 5 : 0);
    gems = perfect ? 15 : 8;
    S.nodes[L.topic] = Math.min(NODE_LEVELS, lvl + 1);
    if (lvl < NODE_LEVELS && OBJ[L.topic]) pendingBuild = { t: L.topic, lv: lvl + 1 };
    S.stats.lessons++; questEvent('lesson'); if (perfect) { S.stats.perfect++; questEvent('perfect'); note = 'Без единой ошибки! +5 XP бонус'; }
    if (lvl + 1 === NODE_LEVELS) note = 'Тема пройдена на максимум!';
  } else if (k === 'test') {
    xp = 30 + (perfect ? 10 : 0); gems = 50; S.units[L.d] = true; title = 'Контрольная пройдена!'; questEvent('lesson');
  } else {
    xp = 5 + L.correct; gems = 5; title = k === 'service' ? 'ЦОД обслужен' : 'Тренировка завершена'; questEvent('review');
    regenHearts(); if (S.hearts < MAX_HEARTS) S.hearts++; note = '+1 сердце за тренировку';
  }
  if (boostOn()) { xp *= 2; note = (note ? note + ' · ' : '') + 'Двойной XP!'; }
  addXP(Math.max(1, xp)); S.gems += gems; checkBadges(); save();
  view = 'done';
  full(`<div class="done-screen">
    ${mascot('cheer', 130)}
    <h1>${title}</h1>
    ${note ? `<p class="muted">${note}</p>` : ''}
    <div class="done-stats">
      <div class="ds" style="--c:var(--gold)"><div class="h">Опыт</div><div class="v">${I.bolt}<span data-count="${Math.max(1, xp)}">0</span></div></div>
      <div class="ds" style="--c:var(--green)"><div class="h">Точность</div><div class="v"><span data-count="${acc}" data-suffix="%">0</span></div></div>
      <div class="ds" style="--c:var(--ice)"><div class="h">Кристаллы</div><div class="v">${I.gem}${gems}</div></div>
    </div>
    ${recap(L.missed)}
    <div class="card" style="width:100%;text-align:left"><div class="kv"><span>Цель дня</span><span class="mono">${Math.min(todayXP(), S.goal)} / ${S.goal} XP</span></div><div class="meter"><i style="width:${Math.min(1, todayXP() / S.goal) * 100}%;background:var(--orange)"></i></div><div class="kv"><span class="muted">Время</span><span class="mono">${Math.floor(secs / 60)}:${pad(secs % 60)}</span></div></div>
  </div>
  <button class="btn" data-after>Продолжить</button>`);
  sfx.done(); confetti();
  L = null;
}
function recap(ids) {
  if (!ids || !ids.length) return '';
  const rows = ids.slice(0, 4).map(id => QBY[id] ? `<div class="rc"><span class="rq">${esc(QBY[id].text)}</span><b>${esc(QBY[id].opts[0])}</b></div>` : GBY[id] ? `<div class="rc"><b>${esc(GBY[id].term)}</b><span class="rq">${esc(GBY[id].def)}</span></div>` : '').join('');
  return `<div class="recap"><div class="eyebrow" style="color:var(--orange)">Запомни перед следующим уроком</div>${rows}<p class="muted sm">Эти вопросы вернутся в повторении: через 10 минут, завтра и через 3 дня.</p></div>`;
}
function renderNoHearts() {
  view = 'nohearts';
  const m = Math.ceil(nextHeartIn() / MIN);
  full(`<div class="done-screen">
    ${mascot('sad', 120)}
    <h1 style="color:var(--red)">Сердца закончились</h1>
    <p class="muted">Новое сердце через ${m} мин. Тренировка в Практике не тратит сердца и вернёт одно. Или восстанови все в магазине.</p>
  </div>
  <div style="display:grid;gap:12px"><button class="btn" data-review>Тренировка: +1 сердце</button><button class="btn ice" data-buy="hearts" ${S.gems < PRICES.hearts ? 'disabled' : ''}>Все сердца за ${PRICES.hearts}</button><button class="btn dark" data-home>Не сейчас</button></div>`);
  L = null;
}

// ── PRACTICE ──
function renderPractice() {
  view = 'practice'; tab = 'practice';
  const now = Date.now();
  const due = Q.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).length;
  const weak = Q.filter(x => S.cards[x.id] && S.cards[x.id].w > 0 && S.cards[x.id].b <= 2).length;
  const gDue = G.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).length;
  const item = (act, color, icon, title, sub, badge, dis) => `<button class="prac" data-${act} ${dis ? 'disabled' : ''}><span class="ic" style="background:${color}">${icon}</span><span><h3>${title}</h3><span class="muted small">${sub}</span></span>${badge ? `<span class="badge">${badge}</span>` : '<span></span>'}</button>`;
  page(`<h1 class="section-title">Практика</h1>
    <div class="hero" style="grid-template-columns:72px 1fr">${mascot('idle', 72)}<div class="bubble">Практика не тратит сердца и возвращает <b>одно</b> за каждую тренировку.</div></div>
    <div class="list">
      ${item('review', 'var(--green)', I.target, 'Повторение', due ? due + ' вопросов пора повторить' : 'Слабые и новые вопросы', due || '', false)}
      ${item('weak', 'var(--red)', I.x, 'Работа над ошибками', weak ? weak + ' вопросов с ошибками' : 'Ошибок пока нет', weak || '', !weak)}
      ${item('flash', 'var(--ice)', I.cards, 'Карточки', G.length + ' терминов и цифр' + (gDue ? ' · ' + gDue + ' к повторению' : ''), gDue || '', false)}
      ${item('notes', '#f2f2f2', I.book, 'Конспект', 'Главное по каждому разделу', '', false)}
    </div>
    <h2 style="margin:24px 0 10px">Освоение разделов</h2>
    <div class="card">${UNITS.map(d => `<div style="display:grid;gap:6px"><div class="kv"><span>${esc(DOMAINS[d].name)}</span><span class="mono">${Math.round(domainMastery(d) * 100)}%</span></div><div class="meter"><i style="width:${domainMastery(d) * 100}%"></i></div></div>`).join('')}</div>`);
}
function startFlash() {
  const now = Date.now();
  const due = G.filter(x => S.cards[x.id] && S.cards[x.id].due <= now);
  let pick = due.concat(shuffle(G.filter(x => !S.cards[x.id]))).slice(0, 12);
  if (pick.length < 12) pick = pick.concat(shuffle(G.filter(x => !pick.includes(x))).slice(0, 12 - pick.length));
  F = { items: shuffle(pick).map(x => x.id), i: 0, flip: false, ok: 0 };
  renderFlash();
}
function renderFlash() {
  view = 'flash';
  if (F.i >= F.items.length) {
    const xp = Math.max(1, F.ok); addXP(boostOn() ? xp * 2 : xp); S.gems += 5; regenHearts(); if (S.hearts < MAX_HEARTS) S.hearts++; checkBadges(); save();
    full(`<div class="done-screen">${mascot('cheer', 120)}<h1>Карточки пройдены</h1><p class="muted">Помню: ${F.ok} из ${F.items.length} · +${xp} XP · +5 кристаллов · +1 сердце</p></div><button class="btn" data-after>Продолжить</button>`);
    sfx.done(); F = null; return;
  }
  const g = GBY[F.items[F.i]];
  full(`<div class="lesson-top"><button class="x" data-home aria-label="Выйти">${I.x}</button><div class="bar"><i style="width:${F.i / F.items.length * 100}%"></i></div></div>
    <div class="lesson-body">
      <p class="qtype">${g.t} ${esc(TOPICS[g.t])}</p>
      <button class="tf-card" data-flip style="min-height:250px;align-content:center;text-align:center;font:inherit;color:inherit">
        <div class="term" style="font-size:27px">${esc(g.term)}</div>
        ${F.flip ? `<div style="font-size:17px">${esc(g.def)}</div>` : '<div class="muted">Вспомни определение и нажми на карточку</div>'}
      </button>
    </div>
    <div class="sheet"><div class="sheet-in">${F.flip ? `<div class="row"><button class="btn red" data-fl="0">Не помню</button><button class="btn" data-fl="1">Помню</button></div>` : `<button class="btn dark" data-flip>Показать ответ</button>`}</div></div>`);
}

// ── QUESTS + SHOP ──
function renderQuests() {
  view = 'quests'; tab = 'quests';
  ensureQuests(); regenHearts();
  const all = S.quests.list.every(q => q.claimed);
  page(`<h1 class="section-title">Задания дня</h1>
    <div class="card">
      ${S.quests.list.map((q, i) => { const def = QUEST_POOL.find(p => p.id === q.id); const done = q.prog >= q.target; return `<div class="quest ${done ? 'done' : ''}"><span class="qi">${done ? I.check : I.target}</span><div style="display:grid;gap:6px"><span class="t">${esc(def.txt(q.target))}</span><div class="meter"><i style="width:${q.prog / q.target * 100}%;background:${done ? 'var(--green)' : 'var(--gold)'}"></i></div><span class="p">${q.prog} / ${q.target}</span></div>${done && !q.claimed ? `<button class="btn sm gold" data-claim="${i}">+10</button>` : q.claimed ? '<span class="muted small">Получено</span>' : '<span></span>'}</div>`; }).join('')}
      <div class="chest-big ${all && !S.quests.chest ? 'ready' : ''}">${I.chest}<span class="muted small">${S.quests.chest ? 'Сундук дня открыт. Новые задания завтра.' : all ? 'Все задания выполнены!' : 'Выполни все 3 задания, чтобы открыть сундук дня'}</span>${all && !S.quests.chest ? '<button class="btn gold sm" data-qchest>Открыть сундук</button>' : ''}</div>
    </div>
    <h2 style="margin:22px 0 10px;display:flex;gap:8px;align-items:center">Магазин <span class="stat gem" style="font-size:15px">${I.gem}${S.gems}</span></h2>
    <div class="card">
      <div class="shop-item"><span class="si" style="background:var(--ice-soft);color:var(--ice)">${I.ice}</span><div><b>Заморозка серии</b><p class="muted small">Спасёт серию в пропущенный день. Есть ${S.freezes} из ${MAX_FREEZES}.</p></div><button class="btn sm ice" data-buy="freeze" ${S.freezes >= MAX_FREEZES || S.gems < PRICES.freeze ? 'disabled' : ''}><span class="price">${I.gem}${PRICES.freeze}</span></button></div>
      <div class="shop-item"><span class="si" style="background:var(--red-soft);color:var(--heart)">${I.heart}</span><div><b>Все сердца</b><p class="muted small">Сейчас ${S.hearts} из ${MAX_HEARTS}.</p></div><button class="btn sm red" data-buy="hearts" ${S.hearts >= MAX_HEARTS || S.gems < PRICES.hearts ? 'disabled' : ''}><span class="price">${I.gem}${PRICES.hearts}</span></button></div>
      <div class="shop-item"><span class="si" style="background:#241a38;color:var(--violet)">${I.bolt}</span><div><b>Двойной XP, 15 минут</b><p class="muted small">${boostOn() ? 'Активен ещё ' + Math.ceil((S.boostUntil - Date.now()) / MIN) + ' мин.' : 'Удваивает опыт за уроки и практику.'}</p></div><button class="btn sm" data-buy="boost" ${boostOn() || S.gems < PRICES.boost ? 'disabled' : ''}><span class="price">${I.gem}${PRICES.boost}</span></button></div>
    </div>
    <p class="muted small" style="margin-top:10px">Кристаллы дают за уроки, сундуки на пути, задания, вехи серии и достижения.</p>`);
}
function buy(item) {
  const p = PRICES[item]; if (S.gems < p) return toast('Не хватает кристаллов');
  if (item === 'freeze') { if (S.freezes >= MAX_FREEZES) return; S.freezes++; toast('Заморозка куплена'); }
  if (item === 'hearts') { S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); toast('Сердца восстановлены'); }
  if (item === 'boost') { S.boostUntil = Date.now() + 15 * MIN; toast('Двойной XP на 15 минут'); }
  S.gems -= p; save(); sfx.coin();
}

// ── EXAM ──
function loadExam() { try { const e = JSON.parse(localStorage.getItem(LS_EXAM) || 'null'); return e && e.items && e.items.every(x => QBY[x.id]) ? e : null; } catch (e) { return null; } }
function storeExam() { try { localStorage.setItem(LS_EXAM, JSON.stringify(exam)); } catch (e) {} }
function clearExam() { try { localStorage.removeItem(LS_EXAM); } catch (e) {} }
function renderExamTab() {
  view = 'exam'; tab = 'exam';
  const r = readiness(), going = loadExam();
  const hist = S.exams.slice(-8).reverse().map(e => `<div class="kv" style="padding:8px 0;border-bottom:1px solid var(--line)"><span>${new Date(e.at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span><span class="mono">${Math.round(e.score * 100)}%</span><span class="pill ${e.score >= 0.7 ? 'ok' : 'no'}">${e.score >= 0.7 ? 'сдано' : 'не сдано'}</span></div>`).join('');
  page(`<h1 class="section-title">Пробный экзамен</h1>
    <div class="card">
      <div class="kv"><span>Прогноз балла сейчас</span><span class="mono" style="font-size:24px;font-weight:800;color:${r >= 0.7 ? 'var(--green)' : 'var(--red)'}">${Math.round(r * 100)}%</span></div>
      <div class="meter"><i style="width:${r * 100}%"></i><span class="pass"></span></div>
      <p class="muted small">Черта — порог 70%. Прогноз растёт, когда вопросы закрепляются в повторениях.</p>
    </div>
    <div class="card" style="margin-top:12px">
      <h3>Как на настоящем</h3>
      <p class="muted small">50 вопросов · 60 минут · Domain 1: 19, Domain 2: 20, Domain 3: 11. Ответы и разбор только в конце. Сердца не тратятся.</p>
      <button class="btn" data-exam>${going ? 'Продолжить экзамен' : 'Начать экзамен'}</button>
    </div>
    <div class="card" style="margin-top:12px">
      <h3>Сам экзамен NCA-AIIO</h3>
      <p class="muted small">Онлайн с наблюдателем через Certiverse, $125, на английском, сертификат на 2 года. Записываться стоит, когда стабильно берёшь 80%+ на пробных.</p>
      <div class="row"><a class="btn sm dark" href="https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/" target="_blank" rel="noopener">Экзамен</a><a class="btn sm dark" href="https://www.nvidia.com/en-us/training/academy/course-detail/?id=course%3A15139841" target="_blank" rel="noopener">Курс NVIDIA</a></div>
    </div>
    ${hist ? `<h2 style="margin:22px 0 6px">История</h2><div>${hist}</div>` : ''}`);
}
function startExam() {
  exam = loadExam();
  if (!exam) {
    let items = [];
    UNITS.forEach(d => {
      const byT = {}; shuffle(Q.filter(x => x.d === d)).forEach(x => { (byT[x.t] = byT[x.t] || []).push(x); });
      const pool = []; let more = true;
      while (more) { more = false; shuffle(Object.keys(byT)).forEach(t => { if (byT[t].length) { pool.push(byT[t].pop()); more = true; } }); }
      items = items.concat(pool.slice(0, DOMAINS[d].exam));
    });
    exam = { items: shuffle(items).map(x => ({ id: x.id, order: shuffle([0, 1, 2, 3]), a: null, f: false })), i: 0, end: Date.now() + 60 * MIN, confirm: false, grid: false };
    storeExam();
  }
  renderExam();
}
let tickT;
function tick() {
  clearTimeout(tickT);
  if (!exam || view !== 'examrun') return;
  const left = exam.end - Date.now();
  if (left <= 0) return finishExam();
  const el = document.getElementById('timer');
  if (el) { el.textContent = pad(Math.floor(left / MIN)) + ':' + pad(Math.floor(left % MIN / 1000)); el.classList.toggle('low', left < 5 * MIN); }
  tickT = setTimeout(tick, 500);
}
function renderExam() {
  view = 'examrun';
  const it = exam.items[exam.i], q = QBY[it.id];
  const nAns = exam.items.filter(x => x.a !== null).length;
  const grid = exam.items.map((x, k) => `<button class="cell ${x.a !== null ? 'ans' : ''} ${x.f ? 'flag' : ''} ${k === exam.i ? 'cur' : ''}" data-cell="${k}">${k + 1}</button>`).join('');
  full(`<div class="lesson-top"><button class="x" data-home aria-label="Пауза">${I.x}</button><div class="bar"><i style="width:${nAns / exam.items.length * 100}%"></i></div><span class="timer" id="timer">--:--</span></div>
    <div class="lesson-body" style="padding-bottom:150px">
      <div class="kv"><span class="qtype">Вопрос ${exam.i + 1} из ${exam.items.length}</span><button class="btn sm dark" style="flex:none" data-flag>${it.f ? '★ Отмечен' : '☆ Отметить'}</button></div>
      <div class="qtext">${esc(q.text)}</div>
      <div class="choices">${it.order.map((oi, k) => `<button class="choice ${it.a === k ? 'sel' : ''}" data-xa="${k}"><span class="n">${String.fromCharCode(65 + k)}</span><span>${esc(q.opts[oi])}</span></button>`).join('')}</div>
      <button class="btn sm dark" style="justify-self:start" data-grid>${exam.grid ? 'Скрыть карту' : 'Карта вопросов · ' + nAns + '/50'}</button>
      ${exam.grid ? `<div class="grid50">${grid}</div>` : ''}
      ${exam.confirm ? `<div class="confirm"><span>${exam.items.length - nAns ? 'Без ответа: ' + (exam.items.length - nAns) + '. ' : ''}Завершить экзамен?</span><div class="row"><button class="btn red" data-fin-yes>Завершить</button><button class="btn dark" data-fin-no>Назад</button></div></div>` : `<button class="btn sm dark" style="justify-self:start;color:var(--red)" data-fin>Завершить экзамен</button>`}
    </div>
    <div class="sheet"><div class="sheet-in"><div class="row"><button class="btn dark" data-xprev ${exam.i === 0 ? 'disabled' : ''}>Назад</button><button class="btn" data-xnext ${exam.i === exam.items.length - 1 ? 'disabled' : ''}>Далее</button></div></div></div>`);
  tick();
}
function finishExam() {
  clearTimeout(tickT);
  const res = exam.items.map(x => ({ id: x.id, ok: x.a !== null && x.order[x.a] === 0, x }));
  const correct = res.filter(r => r.ok).length, score = correct / res.length;
  const by = {}; UNITS.forEach(d => { by[d] = [0, 0]; });
  res.forEach(r => { const d = QBY[r.id].d; by[d][1]++; if (r.ok) by[d][0]++; grade(r.id, r.ok); });
  S.exams.push({ at: Date.now(), score, by });
  S.stats.answered += res.length; S.stats.correct += correct;
  const xp = correct + (score >= 0.7 ? 20 : 0);
  addXP(Math.max(1, xp)); if (score >= 0.7) S.gems += 100; checkBadges(); save(); clearExam(); exam = null;
  view = 'examres';
  const pass = score >= 0.7;
  full(`<div class="lesson-top"><button class="x" data-home aria-label="Закрыть">${I.x}</button><h2 style="font-size:18px">Результат</h2></div>
    <div style="display:grid;gap:14px;padding-bottom:20px">
      <div class="card" style="text-align:center;justify-items:center">${mascot(pass ? 'cheer' : 'sad', 90)}<div style="font-family:var(--f-display);font-size:52px;font-weight:900;color:${pass ? 'var(--green)' : 'var(--red)'}">${Math.round(score * 100)}%</div><span class="pill ${pass ? 'ok' : 'no'}">${pass ? 'Сдано' : 'Не сдано'} · порог 70%</span><p class="muted small">${correct} из ${res.length} верно · +${Math.max(1, xp)} XP${pass ? ' · +100 кристаллов' : ''}</p></div>
      <div class="card">${UNITS.map(d => { const [c, n] = by[d], p = n ? c / n : 0; return `<div style="display:grid;gap:4px"><div class="kv"><span>${esc(DOMAINS[d].name)}</span><span class="mono">${c}/${n}</span></div><div class="meter"><i style="width:${p * 100}%;background:var(--${p >= 0.7 ? 'green' : 'red'})"></i><span class="pass"></span></div></div>`; }).join('')}
        <div class="grid50" style="margin-top:6px">${res.map((r, k) => `<span class="cell ${r.ok ? 'ok' : 'no'}">${k + 1}</span>`).join('')}</div></div>
      ${res.some(r => !r.ok) ? `<h2>Разбор ошибок</h2>${res.filter(r => !r.ok).map(r => { const q = QBY[r.id]; const y = r.x.a !== null ? q.opts[r.x.order[r.x.a]] : null; return `<div class="rv"><span class="tag">${q.t} ${esc(TOPICS[q.t])}</span><b>${esc(q.text)}</b>${y ? `<span class="no">${esc(y)}</span>` : '<span class="muted">Без ответа</span>'}<span class="ok">✓ ${esc(q.opts[0])}</span><span class="muted">${esc(q.ex)}</span></div>`; }).join('')}` : ''}
      <button class="btn" data-weak>Работа над ошибками</button>
    </div>`);
  if (pass) { sfx.done(); confetti(); }
}

// ── PROFILE ──
function renderProfile() {
  view = 'profile'; tab = 'profile';
  const lv = levelInfo();
  const acc = S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  page(`<h1 class="section-title">Профиль</h1>
    <div class="card">
      <div class="kv"><span class="muted">Уровень ${lv.n} из ${LEVELS.length}</span><span class="mono">${S.xp} XP</span></div>
      <h2>${esc(lv.name)}</h2>
      <div class="meter"><i style="width:${lv.frac * 100}%;background:var(--gold)"></i></div>
      <p class="muted small">${lv.next ? 'До следующего уровня ' + (lv.next - S.xp) + ' XP' : 'Максимальный уровень'}</p>
    </div>
    <div class="stats-grid" style="margin-top:12px">
      <button class="stat-box" data-streak style="text-align:left"><b style="color:var(--orange)">${I.fire}${streakNow()}</b><span>Серия · рекорд ${S.streak.best || 0}</span></button>
      <div class="stat-box"><b style="color:var(--gold)">${I.bolt}${todayXP()}</b><span>XP сегодня из ${S.goal}</span></div>
      <div class="stat-box"><b style="color:var(--green)">${S.stats.lessons}</b><span>Уроков пройдено</span></div>
      <div class="stat-box"><b>${acc}%</b><span>Точность ответов</span></div>
    </div>
    <h2 style="margin:22px 0 10px">Цель дня</h2>
    <div class="opts4">${[10, 20, 30, 50].map(g => `<button class="${S.goal === g ? 'on' : ''}" data-goal="${g}">${g} XP</button>`).join('')}</div>
    <p class="muted small" style="margin-top:6px">Урок даёт около 15–20 XP. 30 XP — это 2 урока, примерно 10 минут.</p>
    ${!standalone ? `<h2 style="margin:22px 0 10px">Установить на телефон</h2><div class="card">${deferredPrompt ? '<button class="btn" data-install>Установить приложение</button>' : isIOS ? '<p class="small">В Safari нажми «Поделиться», затем «На экран Домой». Приложение откроется без адресной строки и будет работать без интернета.</p>' : '<p class="small">В меню браузера выбери «Установить приложение» или «Добавить на главный экран».</p>'}</div>` : ''}
    <h2 style="margin:22px 0 4px">Достижения <span class="muted mono small">${S.badges.length}/${BADGES.length}</span></h2>
    <div>${BADGES.map(([id, n, d]) => `<div class="ach ${S.badges.includes(id) ? 'got' : ''}"><span class="medal">${I.star}</span><span>${esc(n)}<small>${esc(d)}</small></span></div>`).join('')}</div>
    <h2 style="margin:22px 0 10px">Настройки</h2>
    <div class="card">
      <button class="btn dark" data-sound>${S.sound ? 'Звук: включён' : 'Звук: выключен'}</button>
      <button class="btn dark" data-unlock>${S.unlockAll ? 'Вернуть последовательный путь' : 'Открыть все уроки'}</button>
      <p class="muted small">Прогресс хранится на этом устройстве. Чтобы перенести на другое, скопируй код и вставь его там.</p>
      <div class="row"><button class="btn sm dark" data-export>Скопировать код</button><button class="btn sm dark" data-import>Вставить код</button></div>
      <textarea id="xfer" placeholder="Здесь появится код прогресса, или вставь сюда код с другого устройства" hidden></textarea>
      <button class="btn sm" data-import-go hidden id="importGo">Загрузить прогресс</button>
      ${resetAsk ? `<div class="confirm"><span>Удалить весь прогресс на этом устройстве?</span><div class="row"><button class="btn red" data-reset-yes>Удалить</button><button class="btn dark" data-reset-no>Отмена</button></div></div>` : '<button class="btn sm dark" style="color:var(--red)" data-reset>Сбросить прогресс</button>'}
    </div>
    <p class="muted small" style="margin-top:16px;text-align:center">Неофициальный тренажёр по открытой программе экзамена NVIDIA NCA-AIIO. Не связан с NVIDIA.</p>`);
}

// ── onboarding ──
function renderOnboarding() {
  view = 'onb';
  const steps = [
    () => `<div class="onb">${mascot('happy', 140)}<h1>Привет! Я <span class="green">Тензор</span>.</h1><p class="muted">Помогу подготовиться к экзамену NVIDIA AI Infrastructure and Operations Associate. По 5–10 минут в день: короткие уроки, повторение в нужный момент и пробный экзамен как настоящий.</p><button class="btn" data-onb="1">Поехали</button></div>`,
    () => `<div class="onb">${mascot('think', 100)}<h1>Сколько заниматься в день?</h1><div class="choices">${[[10, 'Легко', '~5 мин'], [20, 'Нормально', '~8 мин'], [30, 'Серьёзно', '~12 мин'], [50, 'Интенсив', '~20 мин']].map(([g, a, b]) => `<button class="choice ${S.goal === g ? 'sel' : ''}" data-ogoal="${g}"><span>${a} · ${g} XP</span><span class="muted">${b}</span></button>`).join('')}</div><button class="btn" data-onb="2">Дальше</button></div>`,
    () => `<div class="onb">${mascot('idle', 100)}<h1>Какую серию берём в цель?</h1><p class="muted">Те, кто ставит цель серии, занимаются заметно регулярнее. Огонь горит, пока ты учишься каждый день, а заморозка спасёт в пропущенный.</p><div class="choices">${[[7, 'Неделя'], [14, 'Две недели'], [30, 'Месяц'], [60, 'До экзамена']].map(([g, a]) => `<button class="choice ${S.streakGoal === g ? 'sel' : ''}" data-osgoal="${g}"><span>${a}</span><span class="muted">${days(g)}</span></button>`).join('')}</div><button class="btn" data-onb="3">Начать первый урок</button></div>`,
  ];
  full(steps[onb.step]());
}

// ── tycoon map ──
const DUCK = '<svg viewBox="0 0 512 512" class="duck" aria-hidden="true"><g fill="#76b900">' + [0, 1, 2, 3, 4].map(i => `<rect x="${150 + i * 48}" y="80" width="20" height="44" rx="6"/><rect x="${150 + i * 48}" y="388" width="20" height="44" rx="6"/><rect x="80" y="${150 + i * 48}" width="44" height="20" rx="6"/><rect x="388" y="${150 + i * 48}" width="44" height="20" rx="6"/>`).join('') + '</g><rect x="116" y="116" width="280" height="280" rx="44" fill="#141414" stroke="#76b900" stroke-width="12"/><path d="M168 300 L156 256 L206 286 Z" fill="#f2b705"/><ellipse cx="250" cy="318" rx="94" ry="52" fill="#ffc800"/><circle cx="292" cy="230" r="50" fill="#ffc800"/><path d="M334 222 q38 -6 46 12 q-12 18 -46 14 z" fill="#ff8a00"/><path d="M212 312 q40 -26 80 2 q-36 34 -80 -2 z" fill="#e0a800"/><circle cx="304" cy="220" r="9" fill="#050505"/><circle cx="307" cy="217" r="3" fill="#fff"/></svg>';
const lvOf = t => Math.min(3, nodeLevel(t));
const pfOf = t => OBJ[t].pf * lvOf(t);
const pfTotal = () => TKEYS.reduce((s, t) => s + pfOf(t), 0);
// An object needs service when its topic has overdue reviews (learned cards or past mistakes); it then runs at half power.
const svcDue = t => { const now = Date.now(); return Q.filter(x => x.t === t && S.cards[x.id] && S.cards[x.id].due <= now && (S.cards[x.id].b >= 2 || S.cards[x.id].w > 0)).length; };
const pfOnline = () => TKEYS.reduce((s, t) => s + pfOf(t) * (lvOf(t) && svcDue(t) ? 0.5 : 1), 0);
const hotTxt = n => n + ' ' + plural(n, 'объект ЦОД перегрелся', 'объекта ЦОД перегрелись', 'объектов ЦОД перегрелись');
const svcList = () => TKEYS.filter(t => lvOf(t) && svcDue(t));
const pfMax = () => TKEYS.reduce((s, t) => s + OBJ[t].pf * 3, 0);
const DC_RANKS = [[0, 'Пустой ангар'], [1, 'Гаражная стойка'], [5, 'Серверная стартапа'], [10, 'Корпоративный кластер'], [16, 'Региональный ЦОД'], [22, 'AI Factory']];
const dcRank = n => DC_RANKS.filter(([k]) => n >= k).pop()[1];
let openObj = null, pendingBuild = null;

function renderMap() {
  view = 'map';
  const built = TKEYS.filter(t => lvOf(t) >= 1).length, pf = pfTotal(), on = Math.round(pfOnline()), max = pfMax(), ready = Math.round(readiness() * 100), svc = svcList();
  const rooms = ROOMS.map(r => {
    const ts = unitTopics(r.d), lit = ts.some(t => lvOf(t) >= 1), cert = !!S.units[r.d];
    const tiles = ts.map(t => {
      const lv = lvOf(t), sv = lv ? svcDue(t) : 0;
      return `<button class="tile tilt ${lv ? 'on' : ''} ${lv === 3 ? 'max' : ''} ${sv ? 'warn' : ''}" data-obj="${t}" aria-label="${esc(OBJ[t].name)}">${sv ? `<span class="svc">${sv}</span>` : ''}${objSVG(OBJ[t].k, lv)}<span class="tn">${esc(OBJ[t].name)}</span><span class="pips">${[1, 2, 3].map(i => `<i class="${i <= lv ? 'f' : ''}"></i>`).join('')}</span></button>`;
    }).join('');
    return `<section class="room ${lit ? 'lit' : 'dark'} ${cert ? 'cert' : ''}">
      <div class="room-h"><div><div class="room-n">${r.name}</div><div class="room-s">${r.sub} · ${DOMAINS[r.d].w}% экзамена</div></div>${cert ? `<span class="neon">${I.trophy}Сертифицирована</span>` : `<span class="room-c mono">${ts.filter(t => lvOf(t)).length}/${ts.length}</span>`}</div>
      ${lit ? '' : `<div class="room-off">Свет выключен. Пройди первый урок темы «${esc(TOPICS[ts[0]])}», чтобы запустить комнату.</div>`}
      <div class="tiles">${tiles}</div>
    </section>`;
  }).join('');
  const certs = CERTS.map(z => `<div class="zone"><div class="zone-h">${z.zone}</div><div class="certs">${z.items.map(c => `<div class="cert ${c.active ? 'active' : 'locked'}">
      <div class="cert-top"><span class="ccode mono">${c.code}</span>${c.active ? `<span class="cbadge">${ready}%</span>` : I.lock}</div>
      <div class="cname">${c.name}</div><div class="cmeta">${c.lvl} · ${c.price} · ${c.dur}</div>
      ${c.active ? `<div class="meter"><i style="width:${ready}%"></i></div>` : ''}
    </div>`).join('')}</div></div>`).join('');
  page(`<div class="dc-hero">
      <div class="dc-top"><div><div class="eyebrow">Твой AI-ЦОД</div><h1 class="dc-rank">${dcRank(built)}</h1></div>${DUCK}</div>
      <div class="dc-stats"><div><b class="mono" data-count="${on}">0</b><span>PF онлайн</span></div><div><b class="mono">${built}/${TKEYS.length}</b><span>объектов</span></div><div><b class="mono" data-count="${ready}" data-suffix="%">0</b><span>готовность</span></div></div>
      <div class="meter dual"><i class="nom" style="width:${pf / max * 100}%"></i><i style="width:${on / max * 100}%"></i></div>
      ${svc.length ? `<div class="svc-bar"><div><b>${hotTxt(svc.length)}</b><span>Пора повторить темы, иначе работают на 50% мощности.</span></div><button class="btn sm gold" data-service>Обслужить</button></div>` : `<p class="muted sm">Каждый урок строит или прокачивает объект по своей теме. Если не повторять темы вовремя, объекты перегреваются и теряют половину мощности.</p>`}
    </div>
    <div class="campus-h"><span class="bld">Здание 1</span> NCA-AIIO · AI Infrastructure and Operations</div>
    ${rooms}
    <h2 class="sec-h">Кампус NVIDIA</h2>
    <p class="muted sm">Следующие здания — остальные сертификации NVIDIA. Откроются, когда сдашь NCA-AIIO.</p>
    ${certs}
    <a class="link-sm" href="https://www.nvidia.com/en-us/learn/certification/" target="_blank" rel="noopener">Все сертификации на nvidia.com ↗</a>
    ${openObj ? objSheet(openObj) : ''}`);
}
function objSheet(t) {
  const o = OBJ[t], lv = lvOf(t), un = nodeUnlocked(t);
  const r = ROOMS.find(x => x.d === 'd' + t.split('.')[0]);
  const prev = TKEYS[TKEYS.indexOf(t) - 1];
  return `<button class="backdrop" data-objclose aria-label="Закрыть"></button><div class="sheet objsheet"><div class="sheet-in">
    <div class="os-top"><div class="os-pic">${objSVG(o.k, lv)}</div><div><div class="eyebrow">${r.name} · тема ${t}</div><h3>${esc(o.name)}</h3><div class="muted sm">${esc(TOPICS[t])}</div></div></div>
    <div class="fact">${o.fact}</div>
    <div class="kv"><span>Уровень</span><span class="mono">${lv}/3 · +${o.pf} PFLOPS за уровень</span></div>
    ${lv && svcDue(t) ? `<div class="kv" style="color:var(--orange)"><span>Перегрев</span><span class="mono">${svcDue(t)} вопр. к повтору</span></div><button class="btn gold" data-service>Обслужить повтором</button>` : ''}
    ${lv >= 3 ? `<button class="btn dark" data-objclose>Объект на максимуме</button>` : un ? `<button class="btn" data-start="${t}">${lv ? 'Прокачать уроком' : 'Построить уроком'}</button>` : `<button class="btn" disabled>${I.lock} Сначала тема «${esc(TOPICS[prev])}»</button>`}
  </div></div>`;
}
function renderBuilt() {
  const { t, lv } = pendingBuild; pendingBuild = null;
  const o = OBJ[t], r = ROOMS.find(x => x.d === 'd' + t.split('.')[0]);
  view = 'built';
  full(`<div class="done-screen built">
    <div class="eyebrow">${lv === 1 ? 'Новый объект в ЦОД' : lv === 3 ? 'Объект на максимуме' : 'Апгрейд объекта'}</div>
    <div class="reveal"><div class="rays"></div>${objSVG(o.k, lv)}</div>
    <h1>${esc(o.name)}</h1>
    <p class="muted">${r.name} · уровень ${lv}/3</p>
    <div class="fact">${o.fact}</div>
    <div class="done-stats"><div class="ds" style="--c:var(--green)"><div class="h">Мощность</div><div class="v">+${o.pf} PF</div></div><div class="ds" style="--c:var(--ice)"><div class="h">Всего</div><div class="v">${pfTotal()} PF</div></div></div>
  </div>
  <div class="row2"><button class="btn dark" data-gomap>Смотреть ЦОД</button><button class="btn" data-after>Дальше</button></div>`);
  sfx.coin(); confetti();
}

// ── router ──
function home() { openNode = null; openObj = null; ({ learn: renderLearn, map: renderMap, practice: renderPractice, quests: renderQuests, exam: renderExamTab, profile: renderProfile })[tab](); window.scrollTo(0, 0); }

$app.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  const d = b.dataset;
  if (d.tab) { tab = d.tab; resetAsk = false; return home(); }
  if ('streak' in d) return renderStreak(false);
  if (d.chest) return openChest(d.chest);
  if (d.node) { openNode = openNode === d.node ? null : d.node; sfx.tap(); return renderLearn(); }
  if (d.start) {
    regenHearts(); if (!S.hearts) return renderNoHearts();
    if (!S.introSeen[d.start] && !d.skipintro && G.some(g => g.t === d.start)) { S.introSeen[d.start] = 1; save(); return renderTheory(d.start, true); }
    S.introSeen[d.start] = 1; save(); return startLesson(d.start);
  }
  if (d.theory) return renderTheory(d.theory, false);
  if (d.test) { regenHearts(); if (!S.hearts) return renderNoHearts(); return startTest(d.test); }
  if (d.notes !== undefined) return renderNotes(d.notes || notesD);
  if (d.obj) { openObj = d.obj; sfx.tap(); renderMap(); return; }
  if ('objclose' in d) { openObj = null; return renderMap(); }
  if ('gomap' in d) { tab = 'map'; if (pendingStreak) { pendingStreak = false; return renderStreak(true); } return home(); }
  if ('after' in d) { if (pendingBuild) return renderBuilt(); if (pendingStreak) { pendingStreak = false; return renderStreak(true); } return home(); }
  if ('back' in d || 'home' in d) { if (view === 'examrun') clearTimeout(tickT); L = null; F = null; return home(); }
  if ('quit' in d) { L = null; return home(); }
  if (d.ch !== undefined) { if (!L.fb) { L.sel = +d.ch; sfx.tap(); renderLesson(); } return; }
  if ('check' in d) return check();
  if ('next' in d) return next();
  if (d.mt) return matchTap('t', d.mt);
  if (d.md) return matchTap('d', d.md);
  if ('review' in d) return startReview('review');
  if ('weak' in d) return startReview('weak');
  if ('service' in d) return startReview('service');
  if ('flash' in d) return startFlash();
  if ('flip' in d) { F.flip = !F.flip; return renderFlash(); }
  if (d.fl !== undefined) { const id = F.items[F.i], ok = d.fl === '1'; grade(id, ok); S.stats.flash++; questEvent('flash'); if (ok) F.ok++; F.i++; F.flip = false; save(); return renderFlash(); }
  if (d.claim !== undefined) { const q = S.quests.list[+d.claim]; if (q && q.prog >= q.target && !q.claimed) { q.claimed = true; S.gems += 10; S.stats.quests++; checkBadges(); save(); sfx.coin(); } return renderQuests(); }
  if ('qchest' in d) { if (!S.quests.chest && S.quests.list.every(q => q.claimed)) { const g = 30 + Math.floor(Math.random() * 31); S.quests.chest = true; S.gems += g; save(); sfx.coin(); confetti(); toast('Сундук дня: +' + g + ' кристаллов'); } return renderQuests(); }
  if (d.buy) { buy(d.buy); if (view === 'streak') return renderStreak(false); if (view === 'nohearts') return S.hearts ? home() : renderNoHearts(); return renderQuests(); }
  if (d.sgoal) { S.streakGoal = +d.sgoal; save(); return renderStreak(false); }
  if ('ics' in d) return downloadICS();
  if ('exam' in d) return startExam();
  if (d.xa !== undefined) { exam.items[exam.i].a = +d.xa; storeExam(); return renderExam(); }
  if (d.cell !== undefined) { exam.i = +d.cell; storeExam(); return renderExam(); }
  if ('flag' in d) { exam.items[exam.i].f = !exam.items[exam.i].f; storeExam(); return renderExam(); }
  if ('grid' in d) { exam.grid = !exam.grid; return renderExam(); }
  if ('xprev' in d) { exam.i--; exam.confirm = false; storeExam(); renderExam(); return window.scrollTo(0, 0); }
  if ('xnext' in d) { exam.i++; exam.confirm = false; storeExam(); renderExam(); return window.scrollTo(0, 0); }
  if ('fin' in d) { exam.confirm = true; return renderExam(); }
  if ('finNo' in d) { exam.confirm = false; return renderExam(); }
  if ('finYes' in d) { finishExam(); return window.scrollTo(0, 0); }
  if (d.goal) { S.goal = +d.goal; save(); return renderProfile(); }
  if ('sound' in d) { S.sound = !S.sound; save(); sfx.tap(); return renderProfile(); }
  if ('unlock' in d) { S.unlockAll = !S.unlockAll; save(); return renderProfile(); }
  if ('install' in d && deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; renderProfile(); }); return; }
  if ('export' in d) {
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    const ta = document.getElementById('xfer'); ta.hidden = false; ta.value = code; ta.select();
    (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => toast('Код скопирован'), () => toast('Выдели код и скопируй вручную'));
    return;
  }
  if ('import' in d) { const ta = document.getElementById('xfer'); ta.hidden = false; ta.value = ''; ta.focus(); document.getElementById('importGo').hidden = false; return; }
  if ('importGo' in d) {
    try { const obj = JSON.parse(decodeURIComponent(escape(atob(document.getElementById('xfer').value.trim())))); if (!obj || typeof obj.xp !== 'number') throw 0; S = Object.assign(fresh(), obj); save(); toast('Прогресс загружен'); renderProfile(); }
    catch (err) { toast('Код не подошёл. Скопируй его целиком ещё раз'); }
    return;
  }
  if ('reset' in d) { resetAsk = true; return renderProfile(); }
  if ('resetNo' in d) { resetAsk = false; return renderProfile(); }
  if ('resetYes' in d) { S = fresh(); clearExam(); resetAsk = false; save(); toast('Прогресс сброшен'); onb.step = 0; return renderOnboarding(); }
  if (d.ogoal) { S.goal = +d.ogoal; return renderOnboarding(); }
  if (d.osgoal) { S.streakGoal = +d.osgoal; return renderOnboarding(); }
  if (d.onb) { const n = +d.onb; if (n < 3) { onb.step = n; return renderOnboarding(); } S.onboarded = true; save(); S.introSeen[TKEYS[0]] = 1; return renderTheory(TKEYS[0], true); }
});
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || /textarea|input/i.test(e.target.tagName)) return;
  const n = parseInt(e.key, 10);
  if (view === 'lesson' && L) {
    const it = L.items[L.i];
    if (it.type !== 'match' && !L.fb && n >= 1 && n <= (it.type === 'tf' ? 2 : 4)) { L.sel = n - 1; renderLesson(); }
    else if (e.key === 'Enter') { e.preventDefault(); L.fb ? next() : check(); }
  } else if (view === 'flash' && F) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); F.flip = !F.flip; renderFlash(); }
    else if (F.flip && (n === 1 || n === 2)) document.querySelector(`[data-fl="${n - 1}"]`).click();
  } else if (view === 'examrun' && exam) {
    if (n >= 1 && n <= 4) { exam.items[exam.i].a = n - 1; storeExam(); renderExam(); }
    else if (e.key === 'ArrowRight' && exam.i < exam.items.length - 1) { exam.i++; renderExam(); }
    else if (e.key === 'ArrowLeft' && exam.i > 0) { exam.i--; renderExam(); }
  }
});
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if (view === 'profile') renderProfile(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && ['learn', 'map', 'practice', 'quests', 'exam', 'profile'].includes(view)) { settleStreak(); home(); } });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

settleStreak(); regenHearts(); ensureQuests(); save();
if (!S.onboarded) renderOnboarding(); else renderLearn();
})();
