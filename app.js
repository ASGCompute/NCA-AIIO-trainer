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
  [0, tr('Один GPU')], [120, tr('PCIe-карта')], [300, tr('NVLink-пара')], [550, tr('Узел DGX')], [900, tr('Стойка')],
  [1350, 'Scalable Unit'], [1900, 'BasePOD'], [2600, 'SuperPOD'], [3500, 'AI Factory'], [4600, tr('Архитектор AI Factory')],
];
const PRICES = { freeze: 200, hearts: 150, boost: 150 };

// ── icons ──
const I = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
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

I.cube = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z"/><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10"/></svg>';

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
const plural = (n, a, b, c) => { if (LANG !== 'ru') return n === 1 ? a : c; const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const days = n => n + ' ' + plural(n, tr('день'), tr('дня'), tr('дней'));

Q.forEach(x => { x.id = 'q' + hash(x.key); });
G.forEach(x => { x.id = 'g' + hash(x[3]); x.t = x[0]; x.term = x[1]; x.def = x[2]; x.d = 'd' + x[0].split('.')[0]; });
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
  exams: [], badges: [], unlockAll: false, introSeen: {}, vids: {}, figs: {}, flashDay: { day: '', n: 0 } });
let S = fresh();
// Saved state and imported codes are untrusted: every field is type-checked, clamped and rebuilt from fresh().
const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v, d, lo = 0, hi = 1e15) => (typeof v === 'number' && isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d);
const int = (v, d, lo, hi) => Math.round(num(v, d, lo, hi));
const arr = v => (Array.isArray(v) ? v : []);
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const DAYRE = /^\d{4}-\d\d-\d\d$/;
const pick = (o, ok, f) => { const r = {}; if (isObj(o)) Object.keys(o).forEach(k => { if (k !== '__proto__' && ok(k)) { const v = f(o[k]); if (v !== undefined) r[k] = v; } }); return r; };
const codeSum = json => hash('aiio-path:' + json + ':' + json.length);
// Older codes have no checksum: keep them working, but cap XP and gems at what the recorded activity could have earned.
function plausible(o) {
  const st = isObj(o.stats) ? o.stats : {}, n = k => int(st[k], 0, 0, 1e7);
  const cap = 500 + 60 * n('lessons') + 3 * n('answered') + 2 * n('flash') + 150 * arr(o.exams).length + 50 * n('quests');
  if (typeof o.xp === 'number') o.xp = Math.min(o.xp, cap);
  if (typeof o.gems === 'number') o.gems = Math.min(o.gems, 50 + Math.round(cap / 2));
  return o;
}
function normalize(o) {
  const s = fresh(), now = Date.now();
  if (!isObj(o)) return s;
  s.onboarded = !!o.onboarded;
  s.xp = int(o.xp, 0, 0, 1e7); s.gems = int(o.gems, 50, 0, 1e6);
  s.hearts = int(o.hearts, MAX_HEARTS, 0, MAX_HEARTS); s.heartsAt = num(o.heartsAt, now, 0, now);
  s.goal = [10, 20, 30, 50].includes(o.goal) ? o.goal : 30;
  s.streakGoal = [7, 14, 30, 60].includes(o.streakGoal) ? o.streakGoal : 7;
  if (isObj(o.streak)) s.streak = { day: typeof o.streak.day === 'string' && DAYRE.test(o.streak.day) ? o.streak.day : '', count: int(o.streak.count, 0, 0, 1e5), best: int(o.streak.best, 0, 0, 1e5) };
  s.freezes = int(o.freezes, 1, 0, MAX_FREEZES);
  s.freezeDays = arr(o.freezeDays).filter(k => typeof k === 'string' && DAYRE.test(k)).slice(-120);
  s.activeDays = pick(o.activeDays, k => DAYRE.test(k), v => (typeof v === 'number' ? num(v, 0, 0, 1e5) : undefined));
  s.lostStreak = int(o.lostStreak, 0, 0, 1e5);
  s.milestones = arr(o.milestones).filter(m => MILESTONES.includes(m));
  if (isObj(o.quests) && typeof o.quests.day === 'string' && DAYRE.test(o.quests.day)) {
    const list = arr(o.quests.list).filter(q => isObj(q) && QUEST_POOL.some(p => p.id === q.id)).map(q => { const target = int(q.target, 1, 1, 1000); return { id: q.id, prog: int(q.prog, 0, 0, target), target, claimed: !!q.claimed }; });
    if (list.length === 3) s.quests = { day: o.quests.day, list, chest: !!o.quests.chest };
  }
  s.boostUntil = num(o.boostUntil, 0, 0, now + 15 * MIN);
  s.sound = o.sound !== false;
  s.remindAt = typeof o.remindAt === 'string' && /^\d\d:\d\d$/.test(o.remindAt) ? o.remindAt : '20:00';
  if (isObj(o.stats)) Object.keys(s.stats).forEach(k => { s.stats[k] = int(o.stats[k], 0, 0, 1e7); });
  s.exams = arr(o.exams).filter(e => isObj(e) && typeof e.score === 'number').slice(-100).map(e => ({ at: num(e.at, now, 0, now), score: num(e.score, 0, 0, 1), by: Object.fromEntries(UNITS.map(d => { const b = isObj(e.by) ? arr(e.by[d]) : []; return [d, [int(b[0], 0, 0, 50), int(b[1], 0, 0, 50)]]; })) }));
  s.badges = arr(o.badges).filter(b => typeof b === 'string' && BADGES.some(x => x[0] === b));
  s.unlockAll = !!o.unlockAll;
  if (isObj(o.flashDay) && typeof o.flashDay.day === 'string' && DAYRE.test(o.flashDay.day)) s.flashDay = { day: o.flashDay.day, n: int(o.flashDay.n, 0, 0, 999) };
  s.introSeen = pick(o.introSeen, k => has(TOPICS, k), () => 1);
  s.vids = pick(o.vids, k => /^[\w-]{1,40}$/.test(k), v => num(v, now, 0, now));
  s.figs = pick(o.figs, k => typeof FIGS !== 'undefined' && has(FIGS, k), v => num(v, now, 0, now));
  s.cards = pick(o.cards, k => has(QBY, k) || has(GBY, k), c => (isObj(c) ? { b: int(c.b, 0, 0, 5), due: num(c.due, 0, 0, 1e15), c: int(c.c, 0, 0, 1e5), w: int(c.w, 0, 0, 1e5) } : undefined));
  s.nodes = pick(o.nodes, k => has(TOPICS, k), v => int(v, 0, 0, NODE_LEVELS));
  s.units = pick(o.units, k => has(DOMAINS, k), v => (v ? true : undefined));
  s.chests = pick(o.chests, k => /^c\d+\.\d+$/.test(k), v => (v ? 1 : undefined));
  return s;
}
let lastRaw = null, brokenRaw = null;
function loadState() {
  let raw = null;
  try { raw = localStorage.getItem(LS); } catch (e) { return fresh(); }
  if (raw) {
    try { lastRaw = raw; return normalize(JSON.parse(raw)); }
    catch (e) { brokenRaw = raw; try { localStorage.setItem(LS + '-broken', raw); } catch (e2) {} return fresh(); }
  }
  try {
    const old = localStorage.getItem(LS_OLD);
    if (old) {
      const o = JSON.parse(old), s = normalize({ xp: o.xp, cards: o.cards, nodes: o.nodes, units: o.units, goal: o.goal, exams: o.exams, badges: o.badges, unlockAll: o.unlockAll, introSeen: o.introSeen, stats: o.stats, onboarded: true });
      if (o.streak && typeof o.streak.day === 'string') { const [y, m, d] = o.streak.day.split('-').map(Number); if (y && m && d) { s.streak = { day: dayKey(new Date(y, m - 1, d).getTime()), count: int(o.streak.count, 0, 0, 1e5), best: int(o.streak.best || o.streak.count, 0, 0, 1e5) }; s.activeDays[s.streak.day] = 1; } }
      return s;
    }
  } catch (e) {}
  return fresh();
}
// Returns false when the browser refused to store the data (quota, private mode).
const save = () => { try { const raw = JSON.stringify(S); localStorage.setItem(LS, raw); lastRaw = raw; return true; } catch (e) { return false; } };
// Another tab may have saved newer progress: pick it up before changing anything.
function sync() {
  let raw = null; try { raw = localStorage.getItem(LS); } catch (e) { return false; }
  if (!raw || raw === lastRaw) return false;
  try { S = normalize(JSON.parse(raw)); lastRaw = raw; return true; } catch (e) { return false; }
}

// ── streak engine (with freezes) ──
let streakEvent = null; // {type:'freeze'|'lost', n}
function settleStreak() {
  const t = today(), y = yesterday(), last = S.streak.day;
  // A clock moved back (travel west, manual change) makes the last day look like the future: leave the streak alone.
  if (!last || last === t || last === y || !S.streak.count || parseDay(last) > parseDay(t)) return;
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
  if (S.heartsAt > now) S.heartsAt = now;
  while (S.hearts < MAX_HEARTS && now - S.heartsAt >= HEART_MS) { S.hearts++; S.heartsAt += HEART_MS; }
  if (S.hearts >= MAX_HEARTS) S.heartsAt = now;
}
const nextHeartIn = () => Math.max(0, HEART_MS - (Date.now() - S.heartsAt));
const todayXP = () => S.activeDays[today()] || 0;
const boostOn = () => S.boostUntil > Date.now();

const box = id => (S.cards[id] ? S.cards[id].b : 0);
const domainMastery = d => { const qs = Q.filter(x => x.d === d); return qs.reduce((s, x) => s + box(x.id), 0) / (qs.length * 5); };
const domainP = d => { const qs = Q.filter(x => x.d === d); return qs.reduce((s, x) => s + P_BY_BOX[box(x.id)], 0) / qs.length; };
const srsReadiness = () => UNITS.reduce((s, d) => s + domainP(d) * DOMAINS[d].w / 100, 0);
// Forecast blends spaced-repetition strength with the last mock exams; null until there is enough data.
function readiness() {
  const ex = S.exams.slice(-3);
  if (!ex.length && S.stats.answered < 30) return null;
  const r = srsReadiness();
  return ex.length ? 0.5 * r + 0.5 * ex.reduce((s, e) => s + e.score, 0) / ex.length : r;
}
function levelInfo() {
  let i = 0; while (i + 1 < LEVELS.length && S.xp >= LEVELS[i + 1][0]) i++;
  const cur = LEVELS[i][0], next = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
  return { n: i + 1, name: LEVELS[i][1], next, frac: next ? (S.xp - cur) / (next - cur) : 1 };
}
const nodeLevel = t => S.nodes[t] || 0;
// The first topic of a section opens after the previous section's unit test is passed.
const gateUnit = t => { const i = TKEYS.indexOf(t); if (i <= 0) return null; const d = 'd' + t.split('.')[0], pd = 'd' + TKEYS[i - 1].split('.')[0]; return d !== pd && !S.units[pd] ? pd : null; };
const nodeUnlocked = t => { if (S.unlockAll || nodeLevel(t) >= 1) return true; const i = TKEYS.indexOf(t); return i === 0 || (nodeLevel(TKEYS[i - 1]) >= 1 && !gateUnit(t)); };
const unitTestUnlocked = d => S.unlockAll || unitTopics(d).every(t => nodeLevel(t) >= 1);
// When every open topic of a section is started but its unit test is not passed, the test is the next step
const pendingTest = () => { if (S.unlockAll || TKEYS.some(t => nodeUnlocked(t) && nodeLevel(t) === 0)) return null; return UNITS.find(d => !S.units[d] && unitTestUnlocked(d)) || null; };
const currentNode = () => TKEYS.find(t => nodeUnlocked(t) && nodeLevel(t) === 0) || (pendingTest() ? null : TKEYS.find(t => nodeUnlocked(t) && nodeLevel(t) < NODE_LEVELS)) || null;

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
// Toasts wait while a lesson or exam question is on screen, so they never cover the question or the answer sheet.
const toastQ = [];
function toast(msg) { if (view === 'lesson' || view === 'examrun') { toastQ.push(msg); setTimeout(() => { if (view !== 'lesson' && view !== 'examrun' && toastQ.length && document.getElementById('toast').hidden) toast(toastQ.shift()); }, 80); return; } const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; if (toastQ.length) toast(toastQ.shift()); }, 2600); }
const flushToasts = () => { if (toastQ.length) setTimeout(() => toast(toastQ.shift()), 600); };
let confettiRun = 0;
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.getElementById('confetti'), ctx = c.getContext('2d'), run = ++confettiRun;
  const w = innerWidth, h = innerHeight, dpr = devicePixelRatio || 1;
  c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); c.style.opacity = '1';
  const cols = ['#76b900', '#9be12a', '#ffffff', '#ffc800', '#5ec8ff'];
  const ps = Array.from({ length: 130 }, () => ({ x: w / 2, y: h * 0.32, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
  // Elapsed time comes from performance.now() inside the frame, and a timer wipes the canvas regardless,
  // so the pieces can never stay frozen on screen (a throttled or backgrounded tab, a second burst, a resize).
  const t0 = performance.now(), wipe = () => { if (run === confettiRun) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); c.style.opacity = '0'; } };
  setTimeout(wipe, 2600);
  (function frame() {
    if (run !== confettiRun) return;
    const k = performance.now() - t0;
    if (k > 2300) return wipe();
    ctx.clearRect(0, 0, w, h);
    ps.forEach(p => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += 0.15; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = k > 1700 ? Math.max(0, (2300 - k) / 600) : 1; ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    requestAnimationFrame(frame);
  })();
}

// ── quests ──
const QUEST_POOL = [
  { id: 'xp', m: 'xp', n: g => g, txt: n => `${tr('Заработай {0} XP', n)}` },
  { id: 'les2', m: 'lesson', n: () => 2, txt: n => `${tr('Пройди {0} урока', n)}` },
  { id: 'les3', m: 'lesson', n: () => 3, txt: n => `${tr('Пройди {0} урока', n)}` },
  { id: 'combo5', m: 'combo', n: () => 5, txt: n => `${tr('Ответь верно {0} раз подряд', n)}` },
  { id: 'combo10', m: 'combo', n: () => 10, txt: n => `${tr('Ответь верно {0} раз подряд', n)}` },
  { id: 'perfect', m: 'perfect', n: () => 1, txt: () => tr('Пройди урок без ошибок') },
  { id: 'flash', m: 'flash', n: () => 10, txt: n => `${tr('Повтори {0} карточек', n)}` },
  { id: 'review', m: 'review', n: () => 1, txt: () => tr('Пройди тренировку в «Обучении»') },
  { id: 'correct', m: 'correct', n: () => 15, txt: n => `${tr('Дай {0} верных ответов', n)}` },
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
    if (q.prog >= q.target) { q.prog = q.target; setTimeout(() => toast(tr('Задание выполнено: ') + def.txt(q.target)), 700); }
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
  if (S.streak.day !== t && !(S.streak.day && parseDay(S.streak.day) > parseDay(t))) {
    S.streak.count = S.streak.day === yesterday() && S.streak.count ? S.streak.count + 1 : 1;
    S.streak.day = t; S.streak.best = Math.max(S.streak.best || 0, S.streak.count);
    pendingStreak = true; S.lostStreak = 0;
    const m = MILESTONES.find(x => x === S.streak.count);
    if (m && !S.milestones.includes(m)) { S.milestones.push(m); S.gems += m * 5; if (m >= 7 && S.freezes < MAX_FREEZES) S.freezes++; }
  }
  questEvent('xp', n);
  const L = levelInfo();
  if (L.n > before) setTimeout(() => toast(tr('Новый уровень ') + L.n + ': ' + L.name), 400);
  else if (wasBelow && todayXP() >= S.goal) setTimeout(() => toast(tr('Дневная цель выполнена!')), 400);
  return n;
}
const BADGES = [
  ['first', tr('Первый урок'), tr('Пройди первый урок'), () => S.stats.lessons >= 1],
  ['perfect', tr('Без ошибок'), tr('Урок без единой ошибки'), () => S.stats.perfect >= 1],
  ['combo10', tr('Серия ×10'), tr('10 верных ответов подряд'), () => S.stats.bestCombo >= 10],
  ['s3', tr('Искра'), tr('Серия 3 дня'), () => (S.streak.best || 0) >= 3],
  ['s7', tr('Неделя огня'), tr('Серия 7 дней'), () => (S.streak.best || 0) >= 7],
  ['pweek', tr('Идеальная неделя'), tr('7 дней подряд без заморозок'), () => perfectWeek()],
  ['s30', tr('Месяц'), tr('Серия 30 дней'), () => (S.streak.best || 0) >= 30],
  ['q10', tr('Исполнитель'), tr('Выполни 10 заданий дня'), () => S.stats.quests >= 10],
  ['u1', tr('Основы AI'), tr('Контрольная раздела 1'), () => !!S.units.d1],
  ['u2', tr('Инфраструктура'), tr('Контрольная раздела 2'), () => !!S.units.d2],
  ['u3', tr('Эксплуатация'), tr('Контрольная раздела 3'), () => !!S.units.d3],
  ['gold', tr('Золотой путь'), tr('Все уроки на максимум'), () => TKEYS.every(t => nodeLevel(t) >= NODE_LEVELS)],
  ['exam1', tr('Первый экзамен'), tr('Пройди пробный экзамен'), () => S.exams.length >= 1],
  ['pass', tr('Сдано'), tr('70% на пробном экзамене'), () => S.exams.some(e => e.score >= 0.7)],
  ['ace', tr('Отличник'), tr('85% на пробном экзамене'), () => S.exams.some(e => e.score >= 0.85)],
];
function perfectWeek() { let k = today(); if (!S.activeDays[k]) k = yesterday(); for (let i = 0; i < 7; i++) { if (!S.activeDays[k] || S.freezeDays.includes(k)) return false; k = addDays(k, -1); } return true; }
function checkBadges() { BADGES.forEach(([id, name, , t]) => { if (!S.badges.includes(id) && t()) { S.badges.push(id); S.gems += 20; setTimeout(() => toast(tr('Достижение: ') + name + ' · +20'), 1300); } }); }

// ── chrome ──
let tab = 'learn', view = 'learn', openNode = null, L = null, F = null, exam = null, notesD = 'd1', resetAsk = false, deferredPrompt = null, onb = { step: 0 };
function statusBar() {
  regenHearts();
  const lv = levelInfo(), st = streakNow();
  return `<div class="status">
    <span class="logo" title="AIIO Path">${DUCK}</span>
    <button class="stat fire ${st ? '' : 'off'} ${atRisk() ? 'risk' : ''}" data-streak aria-label="${tr('Серия дней')}">${I.fire}<span>${st}</span></button>
    <button class="stat gem" data-tab="quests" aria-label="${tr('Кристаллы')} · ${tr('Задания дня')}">${I.gem}<span>${S.gems}</span>${questsReady() > 0 ? '<span class="dot"></span>' : ''}</button>
    ${boostOn() ? `<span class="stat boost" title="${tr('Двойной XP')}">${I.bolt}<span>×2</span></span>` : `<span class="stat lvl" title="${tr('Уровень')}">${I.chip}<span>${lv.n}</span></span>`}
    <button class="stat heart" data-tab="quests" aria-label="${tr('Сердца')}">${I.heart}<span>${S.hearts}</span></button>
  </div>`;
}
function tabBar() {
  const qr = questsReady();
  const t = (id, icon, label, dot) => `<button class="tab ${tab === id ? 'on' : ''}" data-tab="${id}" aria-label="${label}" ${tab === id ? 'aria-current="page"' : ''}><span class="ti">${icon}${dot ? '<span class="dot"></span>' : ''}</span><span class="tl">${label}</span></button>`;
  return `<nav class="tabs" aria-label="${tr('Разделы')}"><div class="tabs-in">${t('learn', I.home, tr('Путь'))}${t('map', I.dc, tr('ЦОД'))}${t('practice', I.book, tr('Обучение'))}${t('exam', I.exam, tr('Экзамен'))}${t('profile', I.user, tr('Профиль'))}</div></nav>`;
}
// Screens animate in only when the view (or lesson step) changes, not on every re-render.
let lastKey = '';
function enterCls() { const k = view + (view === 'lesson' && L ? ':' + L.i : '') + (view === 'examrun' && exam ? ':' + exam.i : '') + (view === 'flash' && F ? ':' + F.i : ''); const c = k !== lastKey ? ' enter' : ''; lastKey = k; return c; }
// Keyboard users keep their place: the focused control is found again after a re-render, or focus moves to the new screen's heading.
let kbd = false, stepAt = 0;
document.addEventListener('keydown', () => { kbd = true; }, true);
document.addEventListener('pointerdown', () => { kbd = false; }, true);
function focusKey() { const a = document.activeElement; if (!a || a === document.body || !$app.contains(a)) return null; const at = [...a.attributes].find(x => x.name.startsWith('data-')); return at ? `[${at.name}="${CSS.escape(at.value)}"]` : null; }
function paint(html, entering) {
  const fk = focusKey();
  $app.innerHTML = html; enhance();
  if (entering) { stepAt = performance.now(); window.scrollTo(0, 0); }
  if (!kbd) return;
  const el = (!entering && fk && $app.querySelector(fk + ':not([disabled])')) || $app.querySelector('h1, h2, .qtext, [data-flip]');
  if (el) { if (!el.matches('button, a, input, textarea, summary')) el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
}
function page(html) { const e = enterCls(); if (tab !== 'learn' || e) navPush(); paint(`<main class="screen${e}">${statusBar()}${html}</main>${tabBar()}`, !!e); }
function full(html) { const e = enterCls(); navPush(); paint(`<main class="screen full${e}">${html}</main>`, !!e); }
// Android back button: one history entry stands for "inside the app"; popping it goes back a level instead of leaving.
let navDepth = 0, ignorePop = false;
function navPush() { if (navDepth || (view === 'learn' && tab === 'learn')) return; try { history.pushState({ aiio: 1 }, ''); navDepth = 1; } catch (e) {} }
function navRoot() { if (navDepth) { navDepth = 0; ignorePop = true; try { history.back(); } catch (e) { ignorePop = false; } } }
window.addEventListener('popstate', () => {
  if (window.FIGV && FIGV.popped()) return;
  if (ignorePop) { ignorePop = false; return; }
  navDepth = 0;
  if (view === 'lesson' && L) { storeLesson(); L = null; toast(tr('Урок сохранён. Продолжишь с того же места')); tab = 'learn'; return home(); }
  if (view === 'examrun') { clearTimeout(tickT); toast(tr('Экзамен не на паузе: таймер идёт')); tab = 'exam'; return home(); }
  if (view === 'onb' && onb.step > 0) { onb.step--; return renderOnboarding(); }
  if (['learn', 'map', 'practice', 'quests', 'exam', 'profile'].includes(view) && tab !== 'learn') { tab = 'learn'; return home(); }
  F = null; if (view === 'lesson') L = null;
  if (view !== 'learn') return home();
});
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function enhance() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduced() || !to) { el.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 700 + Math.min(600, to * 8);
    (function f(t) { const k = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(f); })(t0);
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
  tr('NVLink связывает GPU <b>внутри</b> узла или стойки NVL72, InfiniBand и Ethernet — <b>между</b> узлами.'),
  tr('PUE = вся мощность ЦОД / мощность IT. Идеал — <b>1,0</b>.'),
  tr('MIG делит GPU максимум на <b>7</b> изолированных частей.'),
  tr('Gb/s делим на 8, чтобы получить GB/s: 400G ≈ <b>50 ГБ/с</b>.'),
  tr('DCGM — мониторинг и диагностика GPU в масштабе всего ЦОД.'),
  tr('DGX H100: <b>8 GPU</b>, 640 ГБ HBM3, ~10,2 кВт.'),
  tr('RoCE v2 требует lossless Ethernet: <b>PFC + ECN</b>.'),
  tr('DPU BlueField разгружает CPU: сеть, хранение, безопасность.'),
  tr('sbatch — отправить задачу в Slurm, squeue — посмотреть очередь.'),
  tr('Обучение: forward + backward. Инференс: только forward.'),
];
function mascotLine() {
  if (streakEvent && streakEvent.type === 'freeze') return ['idle', `${tr('Заморозка спасла твою серию: пропущено {0}. Сегодня не пропускай!', days(streakEvent.n))}`];
  if (S.lostStreak) return ['sad', `${tr('Серия в {0} сгорела. Начнём новую прямо сейчас, это займёт 5 минут.', days(S.lostStreak))}`];
  const hot = svcList().length;
  if (hot) return ['sad', `${hotTxt(hot)}. ${tr('Нажми «Повтор дня», и мощность вернётся.')}`];
  if (atRisk()) return ['sad', `${tr('Серия в {0} под угрозой! Один урок, и огонь горит дальше.', days(S.streak.count))}`];
  if (!S.stats.lessons) return ['idle', tr('Привет, я <b>Тензор</b>! Пройдём путь к сертификату NCA-AIIO вместе. Жми на первый урок.')];
  if (doneToday() && todayXP() >= S.goal) return ['happy', `${tr('Цель дня выполнена, серия <b>{0}</b>. Ещё урок для закрепления?', days(S.streak.count))}`];
  const h = new Date().getHours();
  const tip = TIPS[(new Date().getDate() + h) % TIPS.length];
  return ['idle', (h < 12 ? tr('Доброе утро! ') : h >= 18 ? tr('Добрый вечер! ') : '') + tr('Факт дня: ') + tip];
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
        ${t === cur && openNode !== t ? `<span class="start-bubble">${lvl ? tr('Дальше') : tr('Старт')}</span>` : ''}
        <button class="node ${!un ? 'locked' : done ? 'done' : ''} ${t === cur ? 'cur' : ''}" style="${lvl >= 2 ? '--lvl2:var(--green-l)' : ''}" data-node="${t}" aria-label="${t} ${esc(TOPICS[t])}, ${un ? tr('уровень {0} из {1}', lvl, NODE_LEVELS) : tr('закрыто')}" aria-expanded="${openNode === t}">${icon}${un && lvl ? `<span class="crowns">${lvl}/${NODE_LEVELS}</span>` : ''}</button>
        <span class="node-label">${t} · ${esc(TOPICS[t])}</span>
      </div>`;
      if (openNode === t) nodes += popNode(t);
      if ((idx + 1) % 3 === 0 && idx < tps.length - 1) {
        const off2 = OFFS[k++ % OFFS.length], cid = 'c' + t;
        const avail = nodeLevel(t) >= 1, used = !!S.chests[cid];
        nodes += `<div class="node-wrap" style="transform:translateX(${off2}px)"><button class="node chest ${used ? 'used' : avail ? 'open' : ''}" data-chest="${cid}" ${avail && !used ? '' : 'aria-disabled="true"'} aria-label="${tr('Сундук')}">${I.chest}</button></div>`;
      }
    });
    const tOpen = openNode === 'test-' + d, tUn = unitTestUnlocked(d), passed = !!S.units[d];
    const tCur = pendingTest() === d;
    nodes += `<div class="node-wrap">${tCur && !tOpen ? `<span class="start-bubble">${tr('Дальше')}</span>` : ''}<button class="node test ${!tUn ? 'locked' : passed ? 'done' : ''} ${tCur ? 'cur' : ''}" data-node="test-${d}" aria-label="${tr('Контрольная раздела')}">${tUn ? I.trophy : I.lock}</button><span class="node-label">${tr('Контрольная раздела')}</span></div>${tOpen ? popTest(d, tUn, passed) : ''}`;
    return `<section class="u${ui + 1}">
      <div class="unit"><div><div class="k">${tr('Раздел {0} · {1}% экзамена', ui + 1, D.w)}</div><h2>${esc(D.name)}</h2><div class="ru">${LANG === 'ru' && D.ru !== D.name ? esc(D.ru) + ' ' : ''}${tr('· освоено {0}%', Math.round(domainMastery(d) * 100))}</div></div><button class="notes-btn" data-notes="${d}">${tr('Конспект')}</button></div>
      <div class="path">${nodes}</div>
    </section>`;
  }).join('');
  const qDone = S.quests.list.filter(q => q.prog >= q.target).length;
  page(`
    <div class="hero">${mascot(ms, 96)}<div class="bubble">${line}</div></div>
    ${resumeCards()}${legendCard()}
    ${reviewCTA()}
    <button class="mini-quests" data-tab="quests">
      <div class="head"><span>${tr('Задания дня')}</span><span class="mono muted small">${qDone}/3</span></div>
      ${S.quests.list.map(q => { const def = QUEST_POOL.find(p => p.id === q.id); return `<div class="mq ${q.prog >= q.target ? 'done' : ''}"><span>${esc(def.txt(q.target))}</span><div class="meter"><i style="width:${q.prog / q.target * 100}%;background:${q.prog >= q.target ? 'var(--green)' : 'var(--gold)'}"></i></div></div>`; }).join('')}
    </button>
    ${units}${pathDone()}`);
  if (streakEvent) { streakEvent = null; }
  const curEl = document.querySelector('.node.cur');
  if (learnY !== null) window.scrollTo(0, learnY);
  else if (curEl && !openNode && S.stats.lessons) curEl.scrollIntoView({ block: 'center' });
  learnY = window.scrollY;
}
// The path remembers where it was scrolled, so coming back to the app does not jump to the top.
let learnY = null;
window.addEventListener('scroll', () => { if (view === 'learn') learnY = window.scrollY; }, { passive: true });
function resumeCards() {
  const ex = loadExam(), sl = loadLesson();
  let h = '';
  if (ex) { const left = Math.max(0, Math.ceil((ex.end - Date.now()) / MIN)); h += `<button class="resume-card" data-exam><span class="ic">${I.exam}</span><span class="tx"><b>${left ? tr('Идёт пробный экзамен') : tr('Время экзамена вышло')}</b><span>${left ? tr('Осталось {0} мин · таймер не останавливается', left) : tr('Открой, чтобы увидеть результат')}</span></span></button>`; }
  if (sl) h += `<div class="resume-card"><span class="ic">${I.play}</span><span class="tx"><b>${tr('Незаконченный урок')}</b><span>${esc(sl.topic ? sl.topic + ' ' + TOPICS[sl.topic] : tr('Контрольная раздела'))} · ${Math.min(sl.i, sl.items.filter(x => !x.again).length)}/${sl.items.filter(x => !x.again).length}</span></span><button class="btn sm" data-resume>${tr('Продолжить')}</button><button class="x" data-dropless aria-label="${tr('Удалить незаконченный урок')}">${I.x}</button></div>`;
  return h;
}
function legendCard() {
  if (S.stats.lessons || S.introSeen.legend) return '';
  return `<div class="card legend"><h3>${tr('Что значат значки')}</h3>
    <div class="lg"><span class="stat fire">${I.fire}</span><span>${tr('Серия: сколько дней подряд ты занимаешься')}</span></div>
    <div class="lg"><span class="stat gem">${I.gem}</span><span>${tr('Кристаллы: награда за уроки, тратятся в магазине')}</span></div>
    <div class="lg"><span class="stat lvl">${I.chip}</span><span>${tr('Уровень: растёт с опытом (XP)')}</span></div>
    <div class="lg"><span class="stat heart">${I.heart}</span><span>${tr('Сердца: ошибка в уроке стоит одно сердце, они восстанавливаются сами')}</span></div>
    <button class="btn sm dark" data-legend-ok>${tr('Понятно')}</button></div>`;
}
function pathDone() {
  if (!TKEYS.every(t => nodeLevel(t) >= NODE_LEVELS) || !UNITS.every(d => S.units[d])) return '';
  return `<div class="card finale">${mascot('cheer', 96)}<h2>${tr('Путь пройден!')}</h2><p class="muted">${tr('Все темы на максимуме и все контрольные сданы. Теперь сдай пробный экзамен несколько раз подряд на 80% и выше, и можно записываться на настоящий.')}</p><button class="btn" data-tab="exam">${tr('К пробному экзамену')}</button></div>`;
}
function reviewCTA() {
  const now = Date.now(), n = Q.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).length;
  if (!n) return '';
  const hot = svcList().length;
  return `<button class="review-cta" data-service><span class="ic">${I.target}</span><span class="tx">${tr('<b>Повтор дня · {0} {1}</b>', Math.min(n, 10), plural(Math.min(n, 10), tr('вопрос'), tr('вопроса'), tr('вопросов')))}<span>${hot ? hotTxt(hot) + tr(', повтор вернёт мощность') : tr('Вспомнить сейчас, пока не забылось: так запоминается надолго')}</span></span><span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></span></button>`;
}
function popNode(t) {
  const un = nodeUnlocked(t), lvl = nodeLevel(t);
  if (!un) { const g = gateUnit(t); return `<div class="popover locked"><h3>${esc(TOPICS[t])}</h3><p class="sub">${g && nodeLevel(TKEYS[TKEYS.indexOf(t) - 1]) >= 1 ? tr('Сначала сдай контрольную раздела {0}: она в конце раздела.', UNITS.indexOf(g) + 1) : tr('Пройди предыдущий урок, чтобы открыть этот. Или открой все уроки в профиле.')}</p></div>`; }
  const done = lvl >= NODE_LEVELS;
  regenHearts();
  return `<div class="popover"><h3>${esc(TOPICS[t])}</h3>
    <div class="lvl-dots">${Array.from({ length: NODE_LEVELS }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>
    <p class="sub">${done ? tr('Пройдено на максимум. Повтор закрепит знания.') : tr('Уровень {0} из {1}', lvl + 1, NODE_LEVELS) + ' · ' + LEVEL_INFO[lvl]()}</p>
    <button class="btn" data-start="${t}">${!S.hearts ? tr('Нет сердец') : loadLesson() && loadLesson().topic === t ? tr('Продолжить') : done ? tr('Повторить') : tr('Начать')}</button>
    <button class="btn dark" data-theory="${t}">${tr('Теория')}</button>
  </div>`;
}
function popTest(d, un, passed) {
  if (!un) return `<div class="popover locked"><h3>${tr('Контрольная раздела')}</h3><p class="sub">${tr('Откроется, когда пройдёшь все уроки раздела хотя бы на первый уровень.')}</p></div>`;
  return `<div class="popover"><h3>${tr('Контрольная:')} ${esc(DOMAINS[d].name)}</h3><p class="sub">${tr('12 вопросов по всему разделу. Чтобы сдать, нужно 9 верных с первой попытки.')} ${passed ? tr('Уже сдана, пересдача для тренировки.') : tr('Сдай и получи кубок, 50 кристаллов и доступ к следующему разделу.')}</p>
    <button class="btn" data-test="${d}">${S.hearts ? tr('Начать') : tr('Нет сердец')}</button></div>`;
}
function openChest(cid) {
  if (S.chests[cid]) return;
  const t = cid.slice(1); if (nodeLevel(t) < 1) { toast(tr('Пройди урок перед сундуком')); return; }
  const g = 15 + Math.floor(Math.random() * 26);
  S.chests[cid] = 1; S.gems += g; save(); sfx.coin(); confetti(); toast(tr('Сундук: +') + g + tr(' кристаллов')); renderLearn();
}

// ── theory / notes ──
let glossFrom = null;

// ── interactive figures (figs/): loaded only when opened, so the app shell stays light ──
let figCss = null, figJs = null;
const figFor = t => (typeof FIG_OF !== 'undefined' && FIG_OF[t]) || null;
// The part of a topic's figure that a question is about: the first part whose keywords match the question or its answer.
function figNodeFor(id, ...texts) { const f = typeof FIGS !== 'undefined' && FIGS[id]; if (!f) return ''; for (const t of texts) { const n = f.nodes.find(x => x[3] && x[3].test(t)); if (n) return n[0]; } return ''; }
function figBtn(id, node, label) { return id ? `<button class="btn sm dark figbtn" data-fig="${id}"${node ? ` data-fignode="${node}"` : ''}>${I.cube}<span>${label || tr('Разобрать на схеме')}</span></button>` : ''; }
function figCard(id) { if (!id) return ''; const seen = S.figs[id]; return `<button class="prac figcard" data-fig="${id}"><span class="ic" style="background:var(--ice)">${I.cube}</span><span><h3>${esc(FIGS[id].title)}</h3><span class="muted small">${tr('Интерактивная схема темы')}</span></span><span class="mono small ${seen ? 'green' : 'muted'}">${seen ? I.check : '+5'}</span></button>`; }
function figSeen(id) { if (S.figs[id]) return; S.figs[id] = Date.now(); addXP(5); save(); toast(tr('+5 XP за схему')); }
function openFigure(id, node) {
  if (typeof FIGS === 'undefined' || !FIGS[id]) return;
  const add = (tag, attrs) => new Promise((ok, no) => { const e = document.createElement(tag); Object.assign(e, attrs); e.onload = ok; e.onerror = no; document.head.appendChild(e); });
  figCss = figCss || add('link', { rel: 'stylesheet', href: 'figs/view.css' }).catch(() => { figCss = null; });
  figJs = figJs || (window.FIGV ? Promise.resolve() : add('script', { src: 'figs/view.js' }).catch(e => { figJs = null; throw e; }));
  Promise.all([figCss, figJs]).then(() => FIGV.open(id, { node, onSeen: figSeen })).catch(() => toast(tr('Не удалось загрузить схему. Проверьте интернет и попробуйте ещё раз.')));
}
function renderFigs() {
  view = 'figs';
  const all = Object.keys(FIGS), seen = all.filter(id => S.figs[id]).length;
  full(`<div class="lesson-top"><button class="x" data-back aria-label="${tr('Закрыть')}">${I.x}</button><h2 style="font-size:1.125rem">${tr('Интерактивные схемы')}</h2><span class="mono small muted">${seen}/${all.length}</span></div>
    <div class="hero" style="grid-template-columns:72px 1fr">${mascot('cheer', 72)}<div class="bubble">${tr('Каждую тему можно разобрать как устройство: нажмите на деталь, чтобы увидеть её цифры для экзамена. За первый просмотр схемы <b>+5 XP</b>.')}</div></div>
    ${UNITS.map(d => `<h2 class="sub-h">${esc(DOMAINS[d].ru)} <span class="muted small">${esc(DOMAINS[d].name)}</span></h2><div class="list">${unitTopics(d).filter(figFor).map(t => { const id = figFor(t); return `<button class="vid figrow ${S.figs[id] ? 'seen' : ''}" data-fig="${id}"><span class="vi">${S.figs[id] ? I.check : I.cube}</span><span class="vt"><b>${esc(FIGS[id].title)}</b><span class="muted small">${t} · ${esc(TOPICS[t])}</span></span><span class="vx">${S.figs[id] ? '' : '+5'}</span></button>`; }).join('')}</div>`).join('')}
    <div style="height:24px"></div>`);
}
function renderTheory(t, thenStart) {
  view = 'theory'; glossFrom = [t, thenStart];
  const cards = G.filter(g => g.t === t);
  full(`<div class="lesson-top"><button class="x" data-back aria-label="${tr('Закрыть')}">${I.x}</button><h2 style="font-size:1.125rem">${esc(TOPICS[t])}</h2></div>
    <div class="lesson-body" style="padding-bottom:110px">
      <div class="hero" style="grid-template-columns:72px 1fr">${mascot('think', 72)}<div class="bubble">${tr('Сначала пробеги ключевые понятия. Потом проверим, что запомнилось.')}</div></div>
      ${figCard(figFor(t))}
      ${TKEYS.indexOf(t) < 2 ? `<button class="btn sm dark gl-link" data-gloss>${tr('Новичок в IT? Сначала словарь базовых терминов')}</button>` : ''}
      <div class="theory">${cards.map(g => `<div class="t"><b>${esc(g.term)}</b><span>${esc(g.def)}</span></div>`).join('') || tr('<p class="muted">Для этой подтемы карточек нет, учимся сразу на вопросах.</p>')}</div>
    </div>
    <div class="sheet"><div class="sheet-in"><button class="btn" data-start="${t}" data-skipintro="1">${thenStart ? tr('Понятно, к заданиям') : tr('Начать урок')}</button></div></div>`);
}
function renderNotes(d) {
  view = 'notes'; notesD = d;
  full(`<div class="lesson-top"><button class="x" data-back aria-label="${tr('Закрыть')}">${I.x}</button><h2 style="font-size:1.125rem">${tr('Конспект')}</h2></div>
    <div class="row" style="margin-bottom:14px">${UNITS.map((u, i) => `<button class="btn sm ${u === d ? '' : 'dark'}" data-notes="${u}">${tr('Раздел')} ${i + 1}</button>`).join('')}</div>
    <h2>${esc(DOMAINS[d].name)} · ${DOMAINS[d].w}%</h2>
    <div class="figchips"><span class="muted small">${tr('Схемы раздела')}</span>${unitTopics(d).filter(figFor).map(t => `<button class="chip" data-fig="${figFor(t)}">${I.cube}<span>${t} ${esc(FIGS[figFor(t)].title)}</span></button>`).join('')}</div>
    <div class="notes">${NOTES[d].map(([h, items]) => `<h3>${esc(h)}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`).join('')}</div>`);
}

function renderGloss() {
  view = 'gloss';
  full(`<div class="lesson-top"><button class="x" data-back aria-label="${tr('Закрыть')}">${I.x}</button><h2 style="font-size:1.125rem">${tr('Словарь для новичка')}</h2></div>
    <div class="hero" style="grid-template-columns:72px 1fr">${mascot('think', 72)}<div class="bubble">${tr('Эти слова встречаются в вопросах с первого урока. Прочитай один раз, дальше будет проще.')}</div></div>
    <div class="theory gloss">${BASICS.map(([term, def]) => `<div class="t"><b lang="en">${esc(term)}</b><span>${esc(def)}</span></div>`).join('')}</div>`);
}

// ── streak screen ──
function renderStreak(celebrate) {
  view = 'streak';
  const st = streakNow(), t = today();
  const monday = addDays(t, -((parseDay(t).getDay() + 6) % 7));
  const week = [tr('Пн'), tr('Вт'), tr('Ср'), tr('Чт'), tr('Пт'), tr('Сб'), tr('Вс')].map((lbl, i) => {
    const k = addDays(monday, i), on = !!S.activeDays[k], ice = S.freezeDays.includes(k);
    return `<div class="d"><span class="c ${on ? 'on' : ice ? 'ice' : ''} ${k === t ? 'today' : ''}">${on ? I.fire : ice ? I.ice : ''}</span>${lbl}</div>`;
  }).join('');
  const start = addDays(monday, -21);
  const month = Array.from({ length: 28 }, (_, i) => { const k = addDays(start, i); const fut = parseDay(k) > parseDay(t); return `<span class="${fut ? 'fut' : S.activeDays[k] ? 'on' : S.freezeDays.includes(k) ? 'ice' : ''}">${parseDay(k).getDate()}</span>`; }).join('');
  const nextM = MILESTONES.find(m => m > st) || 365;
  const goalLeft = Math.max(0, S.streakGoal - st);
  full(`<div class="lesson-top"><button class="x" data-back aria-label="${tr('Закрыть')}">${I.x}</button><h2 style="font-size:1.125rem">${tr('Серия')}</h2></div>
    <div style="display:grid;gap:16px;padding-bottom:${celebrate ? 110 : 24}px">
      <div class="streak-hero">
        <svg class="flame-big ${st ? '' : 'off'} ${celebrate ? 'anim' : ''}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5-1.5 5.2-1.5 7.6 0 1.3.9 2.2 2 2.2 1.6 0 2.3-1.6 1.8-3.7C17 10 19 12.8 19 15.5 19 19.6 15.9 22 12 22s-7-2.4-7-6.4C5 10.7 9.8 8.3 12 2z"/></svg>
        <div class="streak-num ${st ? '' : 'off'}">${st}</div>
        <h2>${celebrate ? (st === 1 ? tr('Серия началась!') : tr('Серия продлена!')) : st ? days(st) + tr(' подряд') : tr('Серии пока нет')}</h2>
        <p class="muted small">${doneToday() ? tr('Сегодня уже засчитано. Возвращайся завтра.') : st ? tr('Сегодня ещё не занимался. Один урок продлит серию.') : tr('Пройди урок, чтобы зажечь огонь.')}</p>
      </div>
      <div class="card"><div class="week">${week}</div></div>
      <div class="card">
        <div class="kv"><span>${tr('Цель серии')}</span><span class="mono">${Math.min(st, S.streakGoal)} / ${S.streakGoal}</span></div>
        <div class="meter"><i style="width:${Math.min(1, st / S.streakGoal) * 100}%;background:var(--orange)"></i></div>
        <p class="muted small">${goalLeft ? tr('Ещё ') + days(goalLeft) + tr(' до цели.') : tr('Цель достигнута! Поставь новую.')}</p>
        <div class="opts4">${[7, 14, 30, 60].map(g => `<button class="${S.streakGoal === g ? 'on' : ''}" data-sgoal="${g}" aria-pressed="${S.streakGoal === g}">${g}</button>`).join('')}</div>
      </div>
      <div class="card">
        <div class="kv"><span style="display:flex;gap:8px;align-items:center;color:var(--ice)">${I.ice.replace('<svg', '<svg width="22" height="22"')}${tr('Заморозки')}</span><span class="mono">${S.freezes} / ${MAX_FREEZES}</span></div>
        <p class="muted small">${tr('Если пропустишь день, заморозка сработает сама и серия не сгорит. Новая даётся на вехах 7+ дней, либо купи в магазине.')}</p>
        <button class="btn ice sm" data-buy="freeze" ${S.freezes >= MAX_FREEZES || S.gems < PRICES.freeze ? 'disabled' : ''}>${tr('Купить за')} ${PRICES.freeze}</button>
      </div>
      <div class="card"><h3>${tr('Последние 4 недели')}</h3><div class="month">${month}</div></div>
      <div class="card"><h3>${tr('Вехи · следующая')} ${nextM}</h3><div class="miles">${MILESTONES.map(m => `<div class="mile ${S.milestones.includes(m) || (S.streak.best || 0) >= m ? 'got' : ''}"><b>${m}</b><span>+${m * 5} ${I.gem.replace('<svg', '<svg width="10" height="10"')}</span></div>`).join('')}</div><p class="muted small">${tr('Рекорд:')} ${days(S.streak.best || 0)}</p></div>
      <div class="card">
        <h3 style="display:flex;gap:8px;align-items:center">${I.bell.replace('<svg', '<svg width="20" height="20"')}${tr('Напоминание')}</h3>
        <p class="muted small">${tr('Добавь ежедневное событие в календарь телефона, чтобы не терять серию.')}</p>
        <div class="row"><input type="time" id="remind" value="${esc(S.remindAt)}" aria-label="${tr('Время напоминания')}"><button class="btn sm" data-ics>${tr('В календарь')}</button></div>
      </div>
    </div>${celebrate ? `<div class="sheet"><div class="sheet-in"><button class="btn" data-back>${tr('Продолжить')}</button></div></div>` : ''}`);
  if (celebrate) { sfx.done(); if (st > 1) confetti(); }
}
function downloadICS() {
  const v = (document.getElementById('remind') || {}).value || '20:00';
  S.remindAt = v; save();
  const [h, m] = v.split(':');
  const d = new Date(); const dt = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AIIO Path//RU', 'BEGIN:VEVENT', 'UID:aiio-path-daily@asgcompute', 'DTSTAMP:' + dt + 'T000000Z',
    'DTSTART:' + dt + 'T' + pad(h) + pad(m) + '00', 'DURATION:PT10M', 'RRULE:FREQ=DAILY', tr('SUMMARY:AIIO Path: урок дня'), tr('DESCRIPTION:Сохрани серию: ') + location.href,
    'URL:' + location.href, 'BEGIN:VALARM', 'ACTION:DISPLAY', tr('DESCRIPTION:Пора на урок AIIO Path'), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'aiio-path-reminder.ics';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast(tr('Открой файл, чтобы добавить напоминание'));
}

// ── lesson engine ──
const LS_LES = 'aiio-path-lesson-v1';
const mcqItem = (q, rev) => ({ type: 'mcq', id: q.id, order: shuffle([0, 1, 2, 3]), rev: rev || false });
const pickQs = (pool, n) => shuffle(pool).sort((a, b) => box(a.id) - box(b.id)).slice(0, n);
// Two flashcards are too close to be each other's "false" definition when they share a key word or one names the other.
const STOP = new Set(['nvidia', 'gpu', 'gpus', 'the', 'and', 'for', 'with']);
const keyWords = g => ((g[3] + ' ' + g.term).match(/[A-Za-z][A-Za-z0-9-]{2,}/g) || []).map(w => w.toLowerCase()).filter(w => !STOP.has(w));
const SAME = [['nim', 'ai enterprise'], ['bf16', 'mixed precision'], ['ib поколения', 'quantum'], ['bluefield', 'doca'], ['bluefield', 'dpu'], ['rdma', 'gpudirect'], ['triton', 'dynamic batching']];
function confusable(a, b) {
  const wa = new Set(keyWords(a));
  if (keyWords(b).some(w => wa.has(w))) return true;
  const ta = (a[3] + ' ' + a.term).toLowerCase(), tb = (b[3] + ' ' + b.term).toLowerCase();
  if (a.def.toLowerCase().includes(b.term.toLowerCase()) || b.def.toLowerCase().includes(a.term.toLowerCase())) return true;
  return SAME.some(([x, y]) => (ta.includes(x) && (tb.includes(y) || b.def.toLowerCase().includes(y))) || (ta.includes(y) && (tb.includes(x) || b.def.toLowerCase().includes(x))));
}
function tfItem(t, d) {
  const pool = G.filter(g => g.t === t); const src = pool.length ? pool : G.filter(g => g.d === d);
  const g = src[Math.floor(Math.random() * src.length)];
  let truth = Math.random() < 0.5, shown = g;
  if (!truth) {
    const ok = o => o.id !== g.id && !confusable(g, o);
    const near = G.filter(o => o.t === g.t && ok(o)), dom = G.filter(o => o.d === g.d && ok(o));
    const cand = near.length ? near : dom.length ? dom : G.filter(ok);
    if (cand.length) shown = cand[Math.floor(Math.random() * cand.length)]; else truth = true;
  }
  return { type: 'tf', g: g.id, shown: shown.id, truth };
}
function matchItem(t, d) {
  let pool = shuffle(G.filter(g => g.t === t));
  if (pool.length < 4) pool = pool.concat(shuffle(G.filter(g => g.d === d && g.t !== t))).slice(0, 4);
  const ids = pool.slice(0, 4).map(g => g.id);
  return { type: 'match', ids, defs: shuffle(ids), done: [], selT: null, selD: null, bad: null, errors: 0, errIds: [] };
}
function interleaveQs(t, n) {
  // questions from earlier, already-started topics: due first, then weakest
  const idx = TKEYS.indexOf(t);
  const prev = Q.filter(x => TKEYS.indexOf(x.t) < idx && nodeLevel(x.t) >= 1);
  if (!prev.length) return [];
  const now = Date.now();
  const due = shuffle(prev.filter(x => S.cards[x.id] && S.cards[x.id].due <= now));
  return due.concat(pickQs(prev.filter(x => !due.includes(x)), n)).slice(0, n).map(q => mcqItem(q, 'prev'));
}
// Each level of a topic is a different lesson: level 2 mixes in earlier topics, level 3 drops the easy formats and adds neighbouring topics.
const LEVEL_INFO = [
  () => tr('5 вопросов темы, «верно или нет» и сопоставление'),
  () => tr('другие вопросы темы и два из прошлых тем'),
  () => tr('уровень экзамена: только вопросы, включая соседние темы'),
];
function startLesson(t) {
  const saved = loadLesson(); if (saved && saved.topic === t) return resumeLesson(saved);
  const d = 'd' + t.split('.')[0], lvl = Math.min(nodeLevel(t), NODE_LEVELS - 1);
  const qs = pickQs(Q.filter(x => x.t === t), 5).map(q => mcqItem(q));
  const prev = interleaveQs(t, lvl ? 2 : 1);
  let items;
  if (lvl === 0) items = [qs[0], qs[1], tfItem(t, d), qs[2], matchItem(t, d), qs[3], prev[0], qs[4]];
  else if (lvl === 1) items = [qs[0], prev[0], qs[1], matchItem(t, d), qs[2], tfItem(t, d), qs[3], prev[1], qs[4]];
  else { const near = pickQs(Q.filter(x => x.d === d && x.t !== t), 2).map(q => mcqItem(q, 'near')); items = [qs[0], qs[1], near[0], qs[2], prev[0], qs[3], near[1], qs[4], prev[1]]; }
  learnY = null;
  newLesson('lesson', items.filter(Boolean), { topic: t, d });
}
function startTest(d) {
  const saved = loadLesson(); if (saved && saved.kind === 'test' && saved.d === d) return resumeLesson(saved);
  const items = [];
  unitTopics(d).forEach(t => { const q = pickQs(Q.filter(x => x.t === t), 1)[0]; if (q) items.push(q); });
  const rest = pickQs(Q.filter(x => x.d === d && !items.includes(x)), 12 - items.length);
  learnY = null;
  newLesson('test', shuffle(items.concat(rest)).slice(0, 12).map(q => mcqItem(q)), { d });
}
function newLesson(kind, items, extra) { L = Object.assign({ kind, items, i: 0, missed: [], hearts: kind === 'lesson' || kind === 'test', correct: 0, wrong: 0, miss1: 0, paid: 0, combo: 0, sel: null, fb: null, t0: Date.now(), sid: Math.random().toString(36).slice(2) }, extra); storeLesson(); renderLesson(); }
// Lessons and unit tests survive a reload, the back button, a language switch and running out of hearts.
function storeLesson() {
  if (!L || (L.kind !== 'lesson' && L.kind !== 'test')) return;
  const o = { kind: L.kind, topic: L.topic || null, d: L.d, items: L.items, i: L.i + (L.fb ? 1 : 0), missed: L.missed, correct: L.correct, wrong: L.wrong, miss1: L.miss1, paid: L.paid, secs: Math.round((Date.now() - L.t0) / 1000), at: Date.now(), sid: L.sid };
  try { localStorage.setItem(LS_LES, JSON.stringify(o)); L.stored = true; } catch (e) {}
}
function loadLesson() {
  try {
    const o = JSON.parse(localStorage.getItem(LS_LES) || 'null');
    if (!isObj(o) || !['lesson', 'test'].includes(o.kind) || !(has(DOMAINS, o.d)) || (o.topic && !(has(TOPICS, o.topic))) || Date.now() - num(o.at, 0) > 3 * DAY) return null;
    const items = arr(o.items).filter(it => isObj(it) && (it.type === 'mcq' ? QBY[it.id] : it.type === 'tf' ? GBY[it.g] && GBY[it.shown] : it.type === 'match' && arr(it.ids).every(id => GBY[id])));
    if (!items.length || items.length !== arr(o.items).length) return null;
    return Object.assign(o, { items, i: int(o.i, 0, 0, items.length), missed: arr(o.missed).filter(id => QBY[id] || GBY[id]), correct: int(o.correct, 0, 0, 99), wrong: int(o.wrong, 0, 0, 99), miss1: int(o.miss1, 0, 0, 99), paid: int(o.paid, 0, 0, 99) });
  } catch (e) { return null; }
}
const clearLesson = () => { try { localStorage.removeItem(LS_LES); } catch (e) {} };
function resumeLesson(o) {
  L = Object.assign({ hearts: true, combo: 0, sel: null, fb: null }, o, { t0: Date.now() - (o.secs || 0) * 1000 });
  L.items.forEach(it => { if (it.type === 'match') Object.assign(it, { done: [], selT: null, selD: null, bad: null, errors: 0, errIds: [] }); });
  regenHearts(); if (!S.hearts) { const t = L.topic; L = null; return renderNoHearts(t); }
  if (L.i >= L.items.length) return finishLesson();
  renderLesson();
}
function announce(msg) { const el = document.getElementById('sr-live'); if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 60); } }
let showOrig = false;

function renderLesson() {
  view = 'lesson';
  const it = L.items[L.i];
  const pct = Math.round(L.i / L.items.length * 100);
  regenHearts();
  const top = `<div class="lesson-top"><button class="x" data-quit aria-label="${tr('Выйти, урок сохранится')}">${I.x}</button><div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${tr('Прогресс урока')}"><i style="width:${pct}%"></i></div>${L.hearts ? `<span class="stat heart" aria-label="${tr('Сердца')}: ${S.hearts}">${I.heart}<span>${S.hearts}</span></span>` : ''}</div>`;
  const combo = L.combo >= 3 ? `<span class="combo">${tr('Серия ×')}${L.combo}</span>` : '';
  const mark = (ok, label) => `<span class="mk ${ok ? 'ok' : 'no'}" aria-hidden="true">${ok ? I.check : I.x}</span><span class="sr">${label}</span>`;
  let body = '', canCheck = false;
  if (it.type === 'mcq') {
    const q = QBY[it.id], lock = !!L.fb, orig = showOrig && LANG === 'es';
    const qlang = LANG === 'ru' || orig ? ' lang="en"' : '';
    body = `<p class="qtype">${it.rev === 'near' ? `<span class="rev">${tr('Из соседней темы')}</span>` : it.rev ? tr('<span class="rev">Повтор из прошлых тем</span>') : ''}${combo}<span>${q.t} ${esc(TOPICS[q.t])}</span>${LANG === 'es' ? `<button class="orig" data-orig aria-pressed="${orig}" aria-label="${tr('Показать оригинал на английском')}">EN</button>` : ''}</p>
      <div class="qtext"${qlang}>${esc(orig ? q.orig : q.text)}</div>
      <div class="choices"${qlang}>${it.order.map((oi, k) => {
        let cls = '', mk = '';
        if (lock) { if (oi === 0) { cls = 'right'; mk = mark(true, tr('Верный ответ')); } else if (k === L.sel) { cls = 'wrong'; mk = mark(false, tr('Твой ответ, неверно')); } } else if (k === L.sel) cls = 'sel';
        return `<button class="choice ${cls}" data-ch="${k}" ${lock ? 'disabled' : ''} aria-pressed="${k === L.sel}"><span class="n">${k + 1}</span><span>${esc(orig ? q.okeys[oi] : q.opts[oi])}</span>${mk}</button>`;
      }).join('')}</div>`;
    canCheck = L.sel !== null;
  } else if (it.type === 'tf') {
    const g = GBY[it.g], s = GBY[it.shown];
    body = `<p class="qtype">${combo}<span>${tr('Верно ли определение?')}</span></p>
      <div class="tf-card"><div class="term">${esc(g.term)}</div><div>${esc(s.def)}</div></div>
      <div class="choices">${[tr('Верно'), tr('Неверно')].map((lbl, k) => {
        let cls = '', mk = ''; const val = k === 0;
        if (L.fb) { if (val === it.truth) { cls = 'right'; mk = mark(true, tr('Верный ответ')); } else if (L.sel === k) { cls = 'wrong'; mk = mark(false, tr('Твой ответ, неверно')); } } else if (L.sel === k) cls = 'sel';
        return `<button class="choice ${cls}" data-ch="${k}" ${L.fb ? 'disabled' : ''} aria-pressed="${L.sel === k}"><span class="n">${k + 1}</span><span>${lbl}</span>${mk}</button>`;
      }).join('')}</div>`;
    canCheck = L.sel !== null;
  } else {
    body = `<p class="qtype">${combo}<span>${tr('Соедини термины с определениями')}</span></p>
      <div class="match">
        <div class="terms">${it.ids.map(id => `<button class="chip ${it.done.includes(id) ? 'ok' : it.selT === id ? 'sel' : ''}" data-mt="${id}" ${it.done.includes(id) ? 'disabled' : ''} aria-pressed="${it.selT === id}">${it.done.includes(id) ? `<span class="mk ok" aria-hidden="true">${I.check}</span>` : ''}${esc(GBY[id].term)}</button>`).join('')}</div>
        ${it.defs.map(id => `<button class="chip def ${it.done.includes(id) ? 'ok' : it.selD === id ? 'sel' : ''} ${it.bad === 'd' + id ? 'bad' : ''}" data-md="${id}" ${it.done.includes(id) ? 'disabled' : ''} aria-pressed="${it.selD === id}">${esc(GBY[id].def)}</button>`).join('')}
      </div>`;
  }
  let sheet = '';
  if (L.fb) {
    const ok = L.fb.ok;
    let ex = '';
    if (it.type === 'mcq') { const q = QBY[it.id]; const eo = showOrig && LANG === 'es'; ex = (ok ? '' : `<div class="answer">${tr('Правильно:')} <span${eo ? ' lang="en"' : ''}>${esc(eo ? q.okeys[0] : q.opts[0])}</span></div>`) + `<div class="ex">${esc(q.ex)}</div>`; }
    else if (it.type === 'tf') { const g = GBY[it.g]; ex = `<div class="ex"><b>${esc(g.term)}</b>: ${esc(g.def)}</div>`; }
    else ex = `<div class="ex">${it.errors ? tr('Ошибок при сопоставлении: ') + it.errors + '.' + it.errIds.map(id => `<br><b>${esc(GBY[id].term)}</b>: ${esc(GBY[id].def)}`).join('') : tr('Все пары с первой попытки.')}</div>`;
    const words = ok ? (L.combo >= 5 ? [tr('Ты в ударе!'), tr('Неудержимо!')] : [tr('Отлично!'), tr('Верно!'), tr('Так держать!'), tr('Точно в цель!')]) : [tr('Не совсем'), tr('Почти!'), tr('Запомним это')];
    sheet = `<div class="sheet ${ok ? 'ok' : 'bad'}"><div class="sheet-in">
      <div class="verdict">${mascot(ok ? 'happy' : 'sad', 56)}<h3><span class="mk ${ok ? 'ok' : 'no'}" aria-hidden="true">${ok ? I.check : I.x}</span>${words[Math.floor(Math.random() * words.length)]}</h3></div>
      ${ex}
      ${!ok && it.type === 'mcq' ? (fid => figBtn(fid, figNodeFor(fid, QBY[it.id].okeys[0], QBY[it.id].orig)))(figFor(QBY[it.id].t)) : ''}${!ok && it.type === 'tf' ? (fid => figBtn(fid, figNodeFor(fid, GBY[it.g].term)))(figFor(GBY[it.g].t)) : ''}
      <button class="btn ${ok ? '' : 'red'}" data-next id="go">${tr('Продолжить')}</button></div></div>`;
  } else if (it.type !== 'match') sheet = `<div class="sheet"><div class="sheet-in"><button class="btn" data-check id="go" ${canCheck ? '' : 'disabled'}>${tr('Проверить')}</button></div></div>`;
  full(top + `<div class="lesson-body">${body}</div>` + sheet);
}
let fbAt = 0;
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
    if (!it.again) L.miss1++;
    const mk = it.type === 'mcq' ? it.id : it.type === 'tf' ? it.g : null; if (mk && !L.missed.includes(mk)) L.missed.push(mk);
    // Only the first try costs a heart; a repeated question is there to learn, not to punish twice.
    if (L.hearts && !it.again) { regenHearts(); if (S.hearts === MAX_HEARTS) S.heartsAt = Date.now(); S.hearts = Math.max(0, S.hearts - 1); }
    if (!it.again && it.type !== 'match') { const copy = Object.assign({}, it, { again: true }); if (copy.order) copy.order = shuffle([0, 1, 2, 3]); L.items.push(copy); }
  }
  L.fb = { ok }; fbAt = performance.now();
  if (it.type === 'mcq') { const q = QBY[it.id]; announce((ok ? tr('Верно!') : tr('Неверно.') + ' ' + tr('Правильно:') + ' ' + q.opts[0]) + ' ' + q.ex); }
  else announce(ok ? tr('Верно!') : tr('Неверно.'));
  save(); storeLesson(); renderLesson();
  const go = document.getElementById('go'); go && go.focus({ preventScroll: true });
}
function next() {
  if (!L.fb) return;
  L.fb = null; L.sel = null; L.i++;
  storeLesson();
  if (L.hearts && S.hearts <= 0 && L.i < L.items.length) return pauseNoHearts();
  if (L.i >= L.items.length) return finishLesson();
  renderLesson();
}
// Out of hearts: the lesson pauses instead of being lost, and the correct answers so far already count for today.
function pauseNoHearts() {
  const part = L.correct - L.paid;
  if (part > 0) { addXP(part); L.paid = L.correct; save(); }
  storeLesson();
  const t = L.topic || null; L = null;
  renderNoHearts(t, true);
}
function matchTap(kind, id) {
  const it = L.items[L.i];
  if (it.done.includes(id)) return;
  it.bad = null;
  if (kind === 't') it.selT = it.selT === id ? null : id; else it.selD = it.selD === id ? null : id;
  if (it.selT && it.selD) {
    if (it.selT === it.selD) { it.done.push(it.selT); if (!it.errIds.includes(it.selT)) grade(it.selT, true); sfx.tap(); }
    else { it.errors++; it.bad = 'd' + it.selD; vibrate(80); if (!it.errIds.includes(it.selT)) { it.errIds.push(it.selT); grade(it.selT, false); } }
    it.selT = null; it.selD = null;
  }
  if (it.done.length === it.ids.length) { L.sel = 0; resolve(it.errors <= 1); return; }
  renderLesson();
}
// The same saved lesson can be open in two tabs (PWA and browser). Whichever finishes first gets the reward.
function finishedElsewhere() {
  if (!L || !L.stored || (L.kind !== 'lesson' && L.kind !== 'test')) return false;
  const o = loadLesson();
  return !o || o.sid !== L.sid;
}
function finishLesson() {
  if (finishedElsewhere()) { L = null; sync(); toast(tr('Этот урок уже засчитан в другой вкладке')); return home(); }
  const k = L.kind, perfect = L.wrong === 0, n1 = L.items.filter(x => !x.again).length;
  const secs = Math.round((Date.now() - L.t0) / 1000);
  const acc = Math.round(L.correct / Math.max(1, L.correct + L.wrong) * 100), acc1 = (n1 - L.miss1) / Math.max(1, n1);
  let xp = 0, gems = 0, title = tr('Урок пройден!'), note = '', failed = false, back = false;
  if (k === 'lesson') {
    const lvl = nodeLevel(L.topic);
    xp = lvl >= NODE_LEVELS ? 5 : 10 + Math.min(L.correct, 8) - Math.min(L.wrong, 3) + (perfect ? 5 : 0);
    xp = Math.max(1, xp - L.paid);
    gems = lvl >= NODE_LEVELS ? 0 : perfect ? 15 : 8;
    S.nodes[L.topic] = Math.min(NODE_LEVELS, lvl + 1);
    if (lvl < NODE_LEVELS && OBJ[L.topic]) pendingBuild = { t: L.topic, lv: lvl + 1 };
    S.stats.lessons++; questEvent('lesson'); if (perfect) { S.stats.perfect++; questEvent('perfect'); note = tr('Без единой ошибки! +5 XP бонус'); }
    if (lvl + 1 === NODE_LEVELS) note = tr('Тема пройдена на максимум!');
  } else if (k === 'test') {
    const had = !!S.units[L.d], last = UNITS.indexOf(L.d) === UNITS.length - 1;
    if (!had) questEvent('lesson');
    if (L.miss1 <= 3) {
      xp = had ? 10 : 30 + (perfect ? 10 : 0); gems = had ? 0 : 50; S.units[L.d] = true;
      title = had ? tr('Контрольная пересдана') : tr('Контрольная сдана!');
      if (!had && !last) note = tr('Открыт следующий раздел');
    } else {
      failed = true; xp = Math.max(1, Math.round(L.correct / 2)); title = tr('Контрольная не сдана');
      note = tr('С первой попытки верно {0} из {1}, нужно 9. Повтори темы раздела и попробуй снова.', n1 - L.miss1, n1);
    }
  } else if (k === 'refill') {
    xp = L.correct; regenHearts();
    if (n1 - L.miss1 >= 2) { if (S.hearts < MAX_HEARTS) S.hearts++; title = tr('Сердце возвращено'); back = !!loadLesson(); note = back ? tr('Можно вернуться к уроку с того же места') : ''; }
    else { failed = true; title = tr('Сердце не вернулось'); note = tr('Нужно 2 верных ответа из 3 с первой попытки. Перечитай объяснения и попробуй ещё раз.'); }
  } else {
    xp = L.correct ? 5 + L.correct : 0; gems = acc1 >= 0.6 ? 5 : 0;
    title = k === 'service' ? tr('ЦОД обслужен') : tr('Тренировка завершена');
    if (L.correct) questEvent('review');
    regenHearts();
    if (S.hearts < MAX_HEARTS) { if (acc1 >= 0.5) { S.hearts++; note = tr('+1 сердце за тренировку'); } else note = tr('Сердце даётся, если верно хотя бы половина с первой попытки'); }
  }
  if (boostOn() && xp) { xp *= 2; note = (note ? note + ' · ' : '') + tr('Двойной XP!'); }
  addXP(xp); S.gems += gems; checkBadges();
  if (k === 'lesson' || k === 'test') clearLesson();
  save();
  view = 'done';
  full(`<div class="done-screen">
    ${mascot(failed ? 'sad' : 'cheer', 130)}
    <h1>${title}</h1>
    ${note ? `<p class="muted">${note}</p>` : ''}
    <div class="done-stats">
      <div class="ds" style="--c:var(--gold)"><div class="h">${tr('Опыт')}</div><div class="v">${I.bolt}<span data-count="${xp}">0</span></div></div>
      <div class="ds" style="--c:var(--green)"><div class="h">${tr('Точность')}</div><div class="v"><span data-count="${acc}" data-suffix="%">0</span></div></div>
      <div class="ds" style="--c:var(--ice)"><div class="h">${tr('Кристаллы')}</div><div class="v">${I.gem}${gems}</div></div>
    </div>
    ${recap(L.missed)}
    <div class="card" style="width:100%;text-align:left"><div class="kv"><span>${tr('Цель дня')}</span><span class="mono">${Math.min(todayXP(), S.goal)} / ${S.goal} XP</span></div><div class="meter"><i style="width:${Math.min(1, todayXP() / S.goal) * 100}%;background:var(--orange)"></i></div><div class="kv"><span class="muted">${tr('Время')}</span><span class="mono">${Math.floor(secs / 60)}:${pad(secs % 60)}</span></div></div>
  </div>
  ${back ? `<div class="row2"><button class="btn dark" data-after>${tr('Позже')}</button><button class="btn" data-resume>${tr('Вернуться к уроку')}</button></div>` : `<button class="btn" data-after>${tr('Продолжить')}</button>`}`);
  if (failed) sfx.bad(); else { sfx.done(); confetti(); }
  L = null; fbAt = performance.now(); flushToasts();
}
function recap(ids) {
  if (!ids || !ids.length) return '';
  const rows = ids.slice(0, 4).map(id => QBY[id] ? `<div class="rc"><span class="rq">${esc(QBY[id].text)}</span><b>${esc(QBY[id].opts[0])}</b></div>` : GBY[id] ? `<div class="rc"><b>${esc(GBY[id].term)}</b><span class="rq">${esc(GBY[id].def)}</span></div>` : '').join('');
  return `<div class="recap"><div class="eyebrow" style="color:var(--orange)">${tr('Запомни перед следующим уроком')}</div>${rows}<p class="muted sm">${tr('Эти вопросы вернутся в повторении: через 10 минут, завтра и через 3 дня.')}</p></div>`;
}
function renderNoHearts(topic, paused) {
  view = 'nohearts';
  const m = Math.ceil(nextHeartIn() / MIN);
  full(`<div class="done-screen">
    ${mascot('sad', 120)}
    <h1 style="color:var(--red)">${tr('Сердца закончились')}</h1>
    <p class="muted">${paused || loadLesson() ? tr('Урок сохранён, продолжишь с того же места.') + ' ' : ''}${tr('Новое сердце через {0} мин. Или верни его сразу: ответь на 3 вопроса повторения, сердца на них не тратятся.', m)}</p>
  </div>
  <div style="display:grid;gap:12px"><button class="btn" data-refill>${tr('Вернуть сердце: 3 вопроса')}</button>${topic ? `<button class="btn dark" data-theory="${topic}">${tr('Перечитать теорию')}</button>` : ''}<button class="btn ice" data-buy="hearts" ${S.gems < PRICES.hearts ? 'disabled' : ''}>${tr('Все сердца за')} ${PRICES.hearts} ${I.gem.replace('<svg', '<svg width="16" height="16"')}</button><button class="btn dark" data-home>${tr('Не сейчас')}</button></div>`);
  L = null;
}

function pickReview(n) {
  const now = Date.now();
  const due = Q.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).sort((a, b) => box(a.id) - box(b.id));
  let pick = due.slice(0, n);
  if (pick.length < n) pick = pick.concat(shuffle(Q.filter(x => S.cards[x.id] && !pick.includes(x))).sort((a, b) => box(a.id) - box(b.id)).slice(0, n - pick.length));
  if (pick.length < n) pick = pick.concat(shuffle(Q.filter(x => !pick.includes(x) && nodeUnlocked(x.t))).slice(0, n - pick.length));
  return shuffle(pick);
}
const weakQs = () => Q.filter(x => S.cards[x.id] && S.cards[x.id].w > 0 && S.cards[x.id].b <= 2);
function startReview(kind) {
  const qs = kind === 'refill' ? pickReview(3) : kind === 'weak' ? shuffle(weakQs()).slice(0, 12) : pickReview(10);
  if (!qs.length) { toast(tr('Пока нечего повторять')); return; }
  newLesson(kind, qs.map(q => mcqItem(q)));
}

// ── PRACTICE ──
let learnSeg = 'train';
function renderPractice() {
  view = 'practice'; tab = 'practice';
  const now = Date.now();
  const due = Q.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).length;
  const weak = Q.filter(x => S.cards[x.id] && S.cards[x.id].w > 0 && S.cards[x.id].b <= 2).length;
  const gDue = G.filter(x => S.cards[x.id] && S.cards[x.id].due <= now).length;
  const item = (act, color, icon, title, sub, badge, dis) => `<button class="prac" data-${act} ${dis ? 'disabled' : ''}><span class="ic" style="background:${color}">${icon}</span><span><h3>${title}</h3><span class="muted small">${sub}</span></span>${badge ? `<span class="badge">${badge}</span>` : '<span></span>'}</button>`;
  const nV = vidTotal(), seen = Object.keys(S.vids || {}).filter(k => VIDS_ALL.includes(k)).length;
  const seg = `<div class="seg" role="group" aria-label="${tr('Обучение')}"><button class="${learnSeg === 'train' ? 'on' : ''}" data-seg="train" aria-pressed="${learnSeg === 'train'}">${tr('Тренировки')}</button><button class="${learnSeg === 'video' ? 'on' : ''}" data-seg="video" aria-pressed="${learnSeg === 'video'}">${tr('Видео')} <span class="mono small">${seen}/${nV}</span></button></div>`;
  const train = `<div class="hero" style="grid-template-columns:72px 1fr">${mascot('idle', 72)}<div class="bubble">${tr('Тренировки не тратят сердца. Если верно хотя бы половина, вернётся <b>одно</b> сердце.')}</div></div>
    <h2 class="sub-h">${tr('Закрепить')}</h2>
    <div class="list">
      ${item('review', 'var(--green)', I.target, tr('Повторение'), due ? tr('{0} {1} пора повторить', due, plural(due, tr('вопрос'), tr('вопроса'), tr('вопросов'))) : tr('Слабые и новые вопросы'), due || '', false)}
      ${item('weak', 'var(--red)', I.x, tr('Работа над ошибками'), weak ? tr('{0} {1} с ошибками', weak, plural(weak, tr('вопрос'), tr('вопроса'), tr('вопросов'))) : tr('Ошибок пока нет'), weak || '', !weak)}
    </div>
    <h2 class="sub-h">${tr('Материалы')}</h2>
    <div class="list">
      ${item('flash', 'var(--ice)', I.cards, tr('Карточки'), G.length + tr(' терминов и цифр') + (gDue ? ' · ' + gDue + tr(' к повторению') : ''), gDue || '', false)}
      ${item('figs', 'var(--ice)', I.cube, tr('Схемы'), tr('{0} схемы · просмотрено {1}', Object.keys(FIGS).length, Object.keys(FIGS).filter(id => S.figs[id]).length), '', false)}
      ${item('notes', '#f2f2f2', I.book, tr('Конспект'), tr('Главное по каждому разделу'), '', false)}
      ${item('gloss', 'var(--gold)', I.chip, tr('Словарь для новичка'), tr('{0} базовых терминов простыми словами', BASICS.length), '', false)}
      ${item('seg="video"', '#ff3b30', I.play, tr('Видео по темам'), nV + tr(' ссылок на YouTube · просмотрено ') + seen, '', false)}
    </div>
    <h2 class="sub-h">${tr('Освоение разделов')}</h2>
    <div class="card">${UNITS.map(d => `<div style="display:grid;gap:6px"><div class="kv"><span>${esc(DOMAINS[d].name)}</span><span class="mono">${Math.round(domainMastery(d) * 100)}%</span></div><div class="meter"><i style="width:${domainMastery(d) * 100}%"></i></div></div>`).join('')}</div>`;
  page(`<h1 class="section-title">${tr('Обучение')}</h1>${seg}${learnSeg === 'video' ? renderVideos() : train}`);
}
const VIDS_ALL = [...VIDEOS.courses.map(c => c.id), ...VIDEOS.prep.map(c => c.id), ...Object.values(VIDEOS.domain).flat().map(x => x[0]), ...Object.values(VIDEOS.topic).flatMap(x => (x.v || []).map(v => v[0]))];
const vidTotal = () => VIDS_ALL.length;
function vlink(id, u, title, meta, kind) {
  const on = S.vids && S.vids[id];
  return `<a class="vid ${on ? 'seen' : ''}" href="${u}" target="_blank" rel="noopener" data-vid="${id}"><span class="vi ${kind || ''}">${on ? I.check : I.play}</span><span class="vt"><b>${esc(title)}</b><span class="muted small">${esc(meta)}</span></span><span class="vx">${on ? '' : '+5'}</span></a>`;
}
function renderVideos() {
  const card = c => `<div class="vcard">${vlink(c.id, c.u, c.t, c.ch + ' · ' + c.len, 'big')}${c.parts ? `<div class="vparts">${c.parts.map(([n, s]) => `<a class="vchip" href="${YT('0WjfKQdfeMU', s)}" target="_blank" rel="noopener">${esc(n)} <span class="mono">${fmtT(s)}</span></a>`).join('')}</div>` : ''}</div>`;
  return `<div class="hero" style="grid-template-columns:72px 1fr">${mascot('cheer', 72)}<div class="bubble">${tr('Ссылки сразу открывают YouTube. За первый просмотр каждого видео <b>+5 XP</b>.')}</div></div>
    <h2 class="sub-h">${tr('С чего начать')}</h2>
    <div class="list">${VIDEOS.courses.map(card).join('')}</div>
    <h2 class="sub-h">${tr('Как готовиться к экзамену')}</h2>
    <div class="list">${VIDEOS.prep.map(card).join('')}</div>
    ${UNITS.map(d => `<details class="vdom" ${d === 'd1' ? 'open' : ''}><summary><span><b>${esc(DOMAINS[d].ru)}</b> <span class="muted small">${esc(DOMAINS[d].name)} ${tr('· {0}% экзамена', DOMAINS[d].w)}</span></span><span class="mono small">${VIDEOS.domain[d].filter(x => S.vids[x[0]]).length}/${VIDEOS.domain[d].length}</span></summary>
      <div class="list">${VIDEOS.domain[d].map(([id, u, t, len]) => vlink(id, u, t, len, 'dom')).join('')}</div>
      <p class="muted small vlab">${tr('По темам')}</p>
      <div class="vtopics">${unitTopics(d).map(t => { const x = VIDEOS.topic[t]; return `<div class="vtopic"><span class="tnum mono">${t}</span><span class="tnm">${esc(TOPICS[t])}</span><a class="vsearch" href="${YTQ(x.q)}" target="_blank" rel="noopener" aria-label="${tr('Найти видео на YouTube: {0}', esc(TOPICS[t]))}">${I.search}<span>YouTube</span></a>${(x.v || []).map(([id, u, tt, ch, len]) => `<div class="vfull">${vlink(id, u, tt, ch + ' · ' + len)}</div>`).join('')}</div>`; }).join('')}</div>
    </details>`).join('')}
    <p class="muted small" style="text-align:center;margin:18px 0 6px">${tr('Кнопка «YouTube» у темы открывает поиск по точному запросу, чтобы всегда были свежие ролики.')}</p>`;
}
const fmtT = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(ss).padStart(2, '0'); };
function startFlash() {
  const now = Date.now();
  const due = G.filter(x => S.cards[x.id] && S.cards[x.id].due <= now);
  // New cards come only from topics the learner has opened, so day one is not a wall of unknown terms.
  const open = t => S.unlockAll || nodeLevel(t) >= 1 || t === currentNode() || t === TKEYS[0];
  let pick = due.concat(shuffle(G.filter(x => !S.cards[x.id] && open(x.t)))).slice(0, 12);
  if (pick.length < 12) pick = pick.concat(shuffle(G.filter(x => !pick.includes(x) && open(x.t))).slice(0, 12 - pick.length));
  F = { items: shuffle(pick).map(x => x.id), i: 0, flip: false, ok: 0 };
  renderFlash();
}
function renderFlash() {
  view = 'flash';
  if (F.i >= F.items.length) {
    // Rewards follow what was actually remembered: nothing for a run of "don't remember".
    if (S.flashDay.day !== today()) S.flashDay = { day: today(), n: 0 };
    const paid = S.flashDay.n++ < 3;
    const n = F.items.length, good = F.ok >= Math.ceil(n / 2), xp = boostOn() ? F.ok * 2 : F.ok, gems = good && paid ? 5 : 0;
    regenHearts(); const heart = good && paid && S.hearts < MAX_HEARTS; if (heart) S.hearts++;
    addXP(xp); S.gems += gems; checkBadges(); save();
    const parts = [tr('Помню: {0} из {1}', F.ok, n), '+' + xp + ' XP'].concat(gems ? [tr('+{0} кристаллов', gems)] : []).concat(heart ? [tr('+1 сердце')] : []);
    full(`<div class="done-screen">${mascot(good ? 'cheer' : 'think', 120)}<h1>${tr('Карточки пройдены')}</h1><p class="muted">${parts.join(' · ')}</p>${good ? '' : `<p class="muted small">${tr('Кристаллы и сердце даются, если помнишь хотя бы половину. Забытые карточки вернутся завтра.')}</p>`}</div><button class="btn" data-after>${tr('Продолжить')}</button>`);
    sfx.done(); F = null; return;
  }
  const g = GBY[F.items[F.i]];
  full(`<div class="lesson-top"><button class="x" data-home aria-label="${tr('Выйти')}">${I.x}</button><div class="bar"><i style="width:${F.i / F.items.length * 100}%"></i></div></div>
    <div class="lesson-body">
      <p class="qtype">${g.t} ${esc(TOPICS[g.t])}</p>
      <button class="tf-card" data-flip style="min-height:250px;align-content:center;text-align:center;font:inherit;color:inherit">
        <div class="term" style="font-size:1.6875rem">${esc(g.term)}</div>
        ${F.flip ? `<div style="font-size:1.0625rem">${esc(g.def)}</div>` : tr('<div class="muted">Вспомни определение и нажми на карточку</div>')}
      </button>
    </div>
    <div class="sheet"><div class="sheet-in">${F.flip ? `<div class="row"><button class="btn red" data-fl="0">${tr('Не помню')}</button><button class="btn" data-fl="1">${tr('Помню')}</button></div>` : `<button class="btn dark" data-flip>${tr('Показать ответ')}</button>`}</div></div>`);
}

// ── QUESTS + SHOP ──
function renderQuests() {
  view = 'quests'; tab = 'quests';
  ensureQuests(); regenHearts();
  const all = S.quests.list.every(q => q.claimed);
  page(`<h1 class="section-title">${tr('Задания дня')}</h1>
    <div class="card">
      ${S.quests.list.map((q, i) => { const def = QUEST_POOL.find(p => p.id === q.id); const done = q.prog >= q.target; return `<div class="quest ${done ? 'done' : ''}"><span class="qi">${done ? I.check : I.target}</span><div style="display:grid;gap:6px"><span class="t">${esc(def.txt(q.target))}</span><div class="meter"><i style="width:${q.prog / q.target * 100}%;background:${done ? 'var(--green)' : 'var(--gold)'}"></i></div><span class="p">${q.prog} / ${q.target}</span></div>${done && !q.claimed ? `<button class="btn sm gold" data-claim="${i}">+10</button>` : q.claimed ? tr('<span class="muted small">Получено</span>') : '<span></span>'}</div>`; }).join('')}
      <div class="chest-big ${all && !S.quests.chest ? 'ready' : ''}">${I.chest}<span class="muted small">${S.quests.chest ? tr('Сундук дня открыт. Новые задания завтра.') : all ? tr('Все задания выполнены!') : tr('Выполни все 3 задания, чтобы открыть сундук дня')}</span>${all && !S.quests.chest ? tr('<button class="btn gold sm" data-qchest>Открыть сундук</button>') : ''}</div>
    </div>
    <h2 style="margin:22px 0 10px;display:flex;gap:8px;align-items:center">${tr('Магазин')} <span class="stat gem" style="font-size:0.9375rem">${I.gem}${S.gems}</span></h2>
    <div class="card">
      <div class="shop-item"><span class="si" style="background:var(--ice-soft);color:var(--ice)">${I.ice}</span><div>${tr('<b>Заморозка серии</b>')}<p class="muted small">${tr('Спасёт серию в пропущенный день. Есть {0} из {1}.', S.freezes, MAX_FREEZES)}</p></div><button class="btn sm ice" data-buy="freeze" aria-label="${tr('Купить заморозку серии за {0} кристаллов', PRICES.freeze)}" ${S.freezes >= MAX_FREEZES || S.gems < PRICES.freeze ? 'disabled' : ''}><span class="price">${I.gem}${PRICES.freeze}</span></button></div>
      <div class="shop-item"><span class="si" style="background:var(--red-soft);color:var(--heart)">${I.heart}</span><div>${tr('<b>Все сердца</b>')}<p class="muted small">${tr('Сейчас {0} из {1}.', S.hearts, MAX_HEARTS)}</p></div><button class="btn sm red" data-buy="hearts" aria-label="${tr('Купить все сердца за {0} кристаллов', PRICES.hearts)}" ${S.hearts >= MAX_HEARTS || S.gems < PRICES.hearts ? 'disabled' : ''}><span class="price">${I.gem}${PRICES.hearts}</span></button></div>
      <div class="shop-item"><span class="si" style="background:#241a38;color:var(--violet)">${I.bolt}</span><div>${tr('<b>Двойной XP, 15 минут</b>')}<p class="muted small">${boostOn() ? tr('Активен ещё ') + Math.ceil((S.boostUntil - Date.now()) / MIN) + tr(' мин.') : tr('Удваивает опыт за уроки и практику.')}</p></div><button class="btn sm" data-buy="boost" aria-label="${tr('Купить двойной XP за {0} кристаллов', PRICES.boost)}" ${boostOn() || S.gems < PRICES.boost ? 'disabled' : ''}><span class="price">${I.gem}${PRICES.boost}</span></button></div>
    </div>
    <p class="muted small" style="margin-top:10px">${tr('Кристаллы дают за уроки, сундуки на пути, задания, вехи серии и достижения.')}</p>`);
}
function buy(item) {
  const p = PRICES[item]; if (S.gems < p) return toast(tr('Не хватает кристаллов'));
  if (item === 'freeze') { if (S.freezes >= MAX_FREEZES) return; S.freezes++; toast(tr('Заморозка куплена')); }
  if (item === 'hearts') { S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); toast(tr('Сердца восстановлены')); }
  if (item === 'boost') { S.boostUntil = Date.now() + 15 * MIN; toast(tr('Двойной XP на 15 минут')); }
  S.gems -= p; save(); sfx.coin();
}

// ── EXAM ──
function loadExam() {
  try {
    const e = JSON.parse(localStorage.getItem(LS_EXAM) || 'null');
    if (!isObj(e) || !Array.isArray(e.items) || !e.items.length || !e.items.every(x => isObj(x) && has(QBY, x.id) && Array.isArray(x.order) && x.order.length === 4 && [0, 1, 2, 3].every(k => x.order.includes(k)))) return null;
    e.items.forEach(x => { x.a = x.a === null || x.a === undefined ? null : int(x.a, null, 0, 3); x.f = !!x.f; });
    e.i = int(e.i, 0, 0, e.items.length - 1); e.end = num(e.end, 0, 0, Date.now() + 60 * MIN);
    return e;
  } catch (e) { return null; }
}
function storeExam() {
  try {
    const o = loadExam();
    // Same exam open in another tab: keep answers given there for questions this tab has not answered.
    if (o && o.end === exam.end && o.items.length === exam.items.length) exam.items.forEach((x, k) => { const y = o.items[k]; if (y.id === x.id && x.a === null && y.a !== null && y.a !== undefined) { x.a = y.a; x.order = y.order; } if (y.id === x.id && y.f) x.f = x.f || y.f; });
    localStorage.setItem(LS_EXAM, JSON.stringify(exam)); exam.stored = true;
  } catch (e) {}
}
function clearExam() { try { localStorage.removeItem(LS_EXAM); } catch (e) {} }
const domShort = by => UNITS.map((d, i) => `D${i + 1} ${by[d][0]}/${by[d][1]}`).join(' · ');
function renderExamTab() {
  view = 'exam'; tab = 'exam';
  const r = readiness(), going = loadExam(), over = going && going.end <= Date.now();
  const hist = S.exams.slice(-8).reverse().map(e => `<div class="hrow"><div class="kv"><span>${new Date(e.at).toLocaleString(LOCALE, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span><span class="mono">${Math.round(e.score * 100)}%</span><span class="pill ${e.score >= 0.7 ? 'ok' : 'no'}">${e.score >= 0.7 ? '≥ 70%' : '< 70%'}</span></div><span class="muted small mono">${domShort(e.by)}</span></div>`).join('');
  page(`<h1 class="section-title">${tr('Пробный экзамен')}</h1>
    <div class="card">
      <div class="kv"><span>${tr('Прогноз балла сейчас')}</span><span class="mono" style="font-size:1.5rem;font-weight:800;color:${r === null ? 'var(--muted)' : r >= 0.7 ? 'var(--green)' : 'var(--red)'}">${r === null ? '—' : Math.round(r * 100) + '%'}</span></div>
      <div class="meter"><i style="width:${(r || 0) * 100}%${r !== null && r < 0.7 ? ';background:var(--red)' : ''}"></i><span class="pass"></span></div>
      <p class="muted small">${r === null ? tr('Прогноз появится после 30 ответов или первого пробного экзамена.') : tr('Учитывает повторения и последние пробные экзамены. Черта — ориентир 70%.')}</p>
    </div>
    <div class="card" style="margin-top:12px">
      <h3>${tr('Как на настоящем')}</h3>
      <p class="muted small">${tr('50 вопросов · 60 минут · Domain 1: 19, Domain 2: 20, Domain 3: 11. Ответы и разбор только в конце. Сердца не тратятся.')}</p>
      <p class="muted small">${tr('Таймер не останавливается: если выйти, время продолжает идти, как на настоящем экзамене.')}</p>
      <button class="btn" data-exam>${over ? tr('Время вышло: посмотреть результат') : going ? tr('Продолжить экзамен') : tr('Начать экзамен')}</button>
    </div>
    <div class="card" style="margin-top:12px">
      <h3>${tr('Сам экзамен NCA-AIIO')}</h3>
      <p class="muted small">${tr('Онлайн с наблюдателем через Certiverse, $125, только на английском, сертификат на 2 года. NVIDIA не публикует проходной балл: 70% здесь — неофициальный ориентир. Записываться стоит, когда стабильно берёшь 80%+ на пробных.')}</p>
      <div class="row"><a class="btn sm dark" href="https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/" target="_blank" rel="noopener">${tr('Экзамен')} ↗</a><a class="btn sm dark" href="https://www.nvidia.com/en-us/training/academy/course-detail/?id=course%3A15139841" target="_blank" rel="noopener">${tr('Курс NVIDIA')} ↗</a></div>
    </div>
    ${hist ? `<h2 style="margin:22px 0 6px">${tr('История')}</h2><div>${hist}</div>` : ''}`);
}
function startExam() {
  exam = loadExam();
  if (exam && exam.end <= Date.now()) return finishExam(true);
  if (!exam) {
    // Fresh questions first: never-seen ones, then the weakest, spread evenly over the topics of each domain.
    const seen = new Set(S.exams.length ? Object.keys(S.cards) : []);
    let items = [];
    UNITS.forEach(d => {
      const byT = {};
      shuffle(Q.filter(x => x.d === d)).sort((a, b) => (seen.has(b.id) - seen.has(a.id)) || (box(b.id) - box(a.id))).forEach(x => { (byT[x.t] = byT[x.t] || []).push(x); });
      const pool = []; let more = true;
      while (more) { more = false; shuffle(Object.keys(byT)).forEach(t => { if (byT[t].length) { pool.push(byT[t].pop()); more = true; } }); }
      items = items.concat(pool.slice(0, DOMAINS[d].exam));
    });
    exam = { items: shuffle(items).map(x => ({ id: x.id, order: shuffle([0, 1, 2, 3]), a: null, f: false })), i: 0, end: Date.now() + 60 * MIN, confirm: false, grid: false, w10: false, w1: false };
    storeExam();
  }
  renderExam();
}
let tickT;
function tick() {
  clearTimeout(tickT);
  if (!exam || view !== 'examrun') return;
  const left = exam.end - Date.now();
  if (left <= 0) return finishExam(true);
  const el = document.getElementById('timer');
  if (el) { el.textContent = pad(Math.floor(left / MIN)) + ':' + pad(Math.floor(left % MIN / 1000)); el.classList.toggle('low', left < 5 * MIN); }
  const warn = (k, ms, msg) => { if (left < ms && !exam[k]) { exam[k] = true; storeExam(); announce(msg); const w = document.getElementById('xwarn'); if (w) { w.textContent = msg; w.hidden = false; } } };
  if (left > 5 * MIN) warn('w10', 10 * MIN, tr('Осталось 10 минут')); else if (left > MIN) warn('w5', 5 * MIN, tr('Осталось 5 минут')); warn('w1', MIN, tr('Осталась 1 минута'));
  tickT = setTimeout(tick, 500);
}
function renderExam() {
  view = 'examrun';
  const it = exam.items[exam.i], q = QBY[it.id];
  const nAns = exam.items.filter(x => x.a !== null).length, orig = showOrig && LANG === 'es';
  const qlang = LANG === 'ru' || orig ? ' lang="en"' : '';
  const grid = exam.items.map((x, k) => `<button class="cell ${x.a !== null ? 'ans' : ''} ${x.f ? 'flag' : ''} ${k === exam.i ? 'cur' : ''}" data-cell="${k}" aria-label="${tr('Вопрос {0}', k + 1)}${x.a !== null ? ', ' + tr('есть ответ') : ''}${x.f ? ', ' + tr('отмечен') : ''}">${k + 1}</button>`).join('');
  full(`<div class="lesson-top"><button class="x" data-home aria-label="${tr('Выйти, таймер идёт')}">${I.x}</button><div class="bar"><i style="width:${nAns / exam.items.length * 100}%"></i></div><span class="timer" id="timer" role="timer" aria-label="${tr('Осталось времени')}">--:--</span></div>
    <div class="lesson-body" style="padding-bottom:150px">
      <p class="xwarn" id="xwarn" role="status" hidden></p>
      <div class="kv"><span class="qtype">${tr('Вопрос {0} из', exam.i + 1)} ${exam.items.length}${LANG === 'es' ? ` <button class="orig" data-orig aria-pressed="${orig}" aria-label="${tr('Показать оригинал на английском')}">EN</button>` : ''}</span><button class="btn sm dark" style="flex:none" data-flag aria-pressed="${it.f}">${it.f ? tr('★ Отмечен') : tr('☆ Отметить')}</button></div>
      <div class="qtext"${qlang}>${esc(orig ? q.orig : q.text)}</div>
      <div class="choices"${qlang}>${it.order.map((oi, k) => `<button class="choice ${it.a === k ? 'sel' : ''}" data-xa="${k}" aria-pressed="${it.a === k}"><span class="n">${String.fromCharCode(65 + k)}</span><span>${esc(orig ? q.okeys[oi] : q.opts[oi])}</span></button>`).join('')}</div>
      <button class="btn sm dark" style="justify-self:start" data-grid aria-expanded="${!!exam.grid}">${exam.grid ? tr('Скрыть карту') : tr('Карта вопросов · ') + nAns + '/50'}</button>
      ${exam.grid ? `<div class="grid50">${grid}</div>` : ''}
      ${exam.confirm ? `<div class="confirm" role="alert"><span>${exam.items.length - nAns ? tr('Без ответа: ') + (exam.items.length - nAns) + '. ' : ''}${tr('Завершить экзамен?')}</span><div class="row"><button class="btn red" data-fin-yes>${tr('Завершить')}</button><button class="btn dark" data-fin-no>${tr('Вернуться к экзамену')}</button></div></div>` : `<button class="btn sm dark" style="justify-self:start;color:var(--red)" data-fin>${tr('Завершить экзамен')}</button>`}
    </div>
    <div class="sheet"><div class="sheet-in"><div class="row"><button class="btn dark" data-xprev ${exam.i === 0 ? 'disabled' : ''}>${tr('Назад')}</button><button class="btn" data-xnext ${exam.i === exam.items.length - 1 ? 'disabled' : ''}>${tr('Далее')}</button></div></div></div>`);
  tick();
}
function finishExam(timedOut) {
  clearTimeout(tickT);
  if (exam.stored) { const o = loadExam(); if (!o || o.end !== exam.end) { exam = null; sync(); toast(tr('Этот экзамен уже завершён в другой вкладке')); tab = 'exam'; return renderExamTab(); } storeExam(); }
  const res = exam.items.map(x => ({ id: x.id, ok: x.a !== null && x.order[x.a] === 0, x }));
  const answered = res.filter(r => r.x.a !== null);
  const correct = res.filter(r => r.ok).length, score = correct / res.length;
  const by = {}; UNITS.forEach(d => { by[d] = [0, 0]; });
  // Only questions the learner actually answered feed spaced repetition and the accuracy stats.
  res.forEach(r => { const d = QBY[r.id].d; by[d][1]++; if (r.ok) by[d][0]++; if (r.x.a !== null) grade(r.id, r.ok); });
  const best = S.exams.reduce((m, e) => Math.max(m, e.score), 0), firstPass = !S.exams.some(e => e.score >= 0.7);
  // An exam with almost no answers is not a real attempt: it does not enter the history, forecast or badges.
  const counts = answered.length >= 10, today = new Date().toDateString(), again = S.exams.some(e => new Date(e.at).toDateString() === today);
  if (counts) S.exams.push({ at: Date.now(), score, by });
  S.stats.answered += answered.length; S.stats.correct += correct;
  const pass = score >= 0.7;
  // Gems reward progress, not repetition: the first pass, then only a new personal best.
  const gems = counts && pass && firstPass ? 100 : counts && pass && score > best ? 20 : 0;
  // Full XP once a day; repeat runs the same day earn a little, so the exam is not an XP farm.
  const xp = !answered.length ? 0 : again ? Math.round(correct / 5) : correct + (pass ? 20 : 0);
  addXP(xp); S.gems += gems; if (counts) checkBadges(); save(); clearExam(); exam = null;
  view = 'examres';
  full(`<div class="lesson-top"><button class="x" data-home aria-label="${tr('Закрыть')}">${I.x}</button><h2 style="font-size:1.125rem">${tr('Результат')}</h2></div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:14px;padding-bottom:20px">
      ${timedOut ? `<div class="card warn-card" role="status"><b>${tr('Время вышло')}</b><span class="muted small">${tr('Экзамен завершился сам через 60 минут. Вопросы без ответа засчитаны как неверные, но в повторение не попали.')}</span></div>` : ''}
      ${!counts ? `<div class="card warn-card" role="status"><b>${tr('Попытка не засчитана')}</b><span class="muted small">${tr('Меньше 10 ответов: результат не попал в историю, прогноз и достижения.')}</span></div>` : again && answered.length ? `<p class="muted small" style="text-align:center">${tr('Повторный экзамен за день: опыта меньше, полный опыт снова завтра.')}</p>` : ''}
      <div class="card" style="text-align:center;justify-items:center">${mascot(pass ? 'cheer' : 'sad', 90)}<div style="font-family:var(--f-display);font-size:3.25rem;font-weight:900;color:${pass ? 'var(--green)' : 'var(--red)'}">${Math.round(score * 100)}%</div><span class="pill ${pass ? 'ok' : 'no'}">${pass ? tr('Выше ориентира 70%') : tr('Ниже ориентира 70%')}</span><p class="muted small">${correct} ${tr('из {0} верно · +{1} XP', res.length, xp)}${gems ? tr(' · +{0} кристаллов', gems) : ''}</p><p class="muted small">${tr('NVIDIA не публикует проходной балл, 70% — неофициальный ориентир.')}</p></div>
      <div class="card">${UNITS.map(d => { const [c, n] = by[d], p = n ? c / n : 0; return `<div style="display:grid;gap:4px"><div class="kv"><span>${esc(DOMAINS[d].name)}</span><span class="mono">${c}/${n} · ${Math.round(p * 100)}%</span></div><div class="meter"><i style="width:${p * 100}%;background:var(--${p >= 0.7 ? 'green' : 'red'})"></i><span class="pass"></span></div></div>`; }).join('')}
        <div class="grid50" style="margin-top:6px" role="list" aria-label="${tr('Ответы по вопросам')}">${res.map((r, k) => `<span class="cell ${r.ok ? 'ok' : r.x.a === null ? 'skip' : 'no'}" role="listitem" aria-label="${tr('Вопрос {0}', k + 1)}: ${r.ok ? tr('верно') : r.x.a === null ? tr('без ответа') : tr('неверно')}">${k + 1}</span>`).join('')}</div>
        <p class="muted small legend-row"><span class="cell ok">✓</span>${tr('верно')} <span class="cell no">✗</span>${tr('неверно')} <span class="cell skip">–</span>${tr('без ответа')}</p></div>
      ${res.some(r => !r.ok) ? `<h2>${tr('Разбор ошибок')}</h2>${res.filter(r => !r.ok).map(r => { const q = QBY[r.id]; const y = r.x.a !== null ? q.opts[r.x.order[r.x.a]] : null; return `<div class="rv"><span class="tag">${q.t} ${esc(TOPICS[q.t])}</span><b>${esc(q.text)}</b>${LANG === 'es' ? `<span class="muted small" lang="en">EN: ${esc(q.orig)}</span>` : ''}${y ? `<span class="no">✗ ${esc(y)}</span>` : tr('<span class="muted">Без ответа</span>')}<span class="ok">✓ ${esc(q.opts[0])}</span><span class="muted">${esc(q.ex)}</span>${(fid => figBtn(fid, figNodeFor(fid, q.okeys[0], q.orig)))(figFor(q.t))}</div>`; }).join('')}` : ''}
      ${weakQs().length ? `<button class="btn" data-weak>${tr('Работа над ошибками')}</button>` : `<button class="btn" data-home>${tr('Готово')}</button>`}
    </div>`);
  if (pass) { sfx.done(); confetti(); }
  flushToasts();
}

// ── PROFILE ──
function renderProfile() {
  view = 'profile'; tab = 'profile';
  const lv = levelInfo();
  const acc = S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  page(`<h1 class="section-title">${tr('Профиль')}</h1>
    <button class="prac" data-tab="quests" style="margin-bottom:12px"><span class="ic" style="background:var(--gold)">${I.quest}</span><span><h3>${tr('Задания и магазин')}</h3><span class="muted small">${tr('Задания дня, сундук и магазин за кристаллы')}</span></span>${questsReady() > 0 ? `<span class="badge">${questsReady()}</span>` : '<span></span>'}</button>
    <div class="card">
      <div class="kv"><span class="muted">${tr('Уровень {0} из', lv.n)} ${LEVELS.length}</span><span class="mono">${S.xp} XP</span></div>
      <h2>${esc(lv.name)}</h2>
      <div class="meter"><i style="width:${lv.frac * 100}%;background:var(--gold)"></i></div>
      <p class="muted small">${lv.next ? tr('До следующего уровня ') + (lv.next - S.xp) + ' XP' : tr('Максимальный уровень')}</p>
    </div>
    <div class="stats-grid" style="margin-top:12px">
      <button class="stat-box" data-streak style="text-align:left"><b style="color:var(--orange)">${I.fire}${streakNow()}</b><span>${tr('Серия · рекорд')} ${S.streak.best || 0}</span></button>
      <div class="stat-box"><b style="color:var(--gold)">${I.bolt}${todayXP()}</b><span>${tr('XP сегодня из')} ${S.goal}</span></div>
      <div class="stat-box"><b style="color:var(--green)">${S.stats.lessons}</b><span>${tr('Уроков пройдено')}</span></div>
      <div class="stat-box"><b>${acc}%</b><span>${tr('Точность ответов')}</span></div>
    </div>
    <h2 style="margin:22px 0 10px">${tr('Цель дня')}</h2>
    <div class="opts4">${[10, 20, 30, 50].map(g => `<button class="${S.goal === g ? 'on' : ''}" data-goal="${g}" aria-pressed="${S.goal === g}">${g} XP</button>`).join('')}</div>
    <p class="muted small" style="margin-top:6px">${tr('Урок даёт около 15–20 XP. 30 XP — это 2 урока, примерно 10 минут.')}</p>
    ${!standalone ? `<h2 style="margin:22px 0 10px">${tr('Установить на телефон')}</h2><div class="card">${deferredPrompt ? tr('<button class="btn" data-install>Установить приложение</button>') : isIOS ? tr('<p class="small">В Safari нажми «Поделиться», затем «На экран Домой». Приложение откроется без адресной строки и будет работать без интернета.</p>') : tr('<p class="small">В меню браузера выбери «Установить приложение» или «Добавить на главный экран».</p>')}</div>` : ''}
    <h2 style="margin:22px 0 4px">${tr('Достижения')} <span class="muted mono small">${S.badges.length}/${BADGES.length}</span></h2>
    <div>${BADGES.map(([id, n, d]) => `<div class="ach ${S.badges.includes(id) ? 'got' : ''}"><span class="medal">${I.star}</span><span>${esc(n)}<small>${esc(d)}</small></span></div>`).join('')}</div>
    <h2 style="margin:22px 0 10px">${tr('Язык')}</h2>${langPick()}
    <h2 style="margin:22px 0 10px">${tr('Настройки')}</h2>
    <div class="card">
      <button class="btn dark" data-sound>${S.sound ? tr('Звук: включён') : tr('Звук: выключен')}</button>
      <button class="btn dark" data-unlock>${S.unlockAll ? tr('Вернуть последовательный путь') : tr('Открыть все уроки')}</button>
      <p class="muted small">${tr('Прогресс хранится на этом устройстве. Чтобы перенести на другое, скопируй код и вставь его там.')}</p>
      <div class="row"><button class="btn sm dark" data-export>${tr('Скопировать код')}</button><button class="btn sm dark" data-import>${tr('Вставить код')}</button></div>
      <textarea id="xfer" aria-label="${tr('Код прогресса')}" placeholder="${tr('Здесь появится код прогресса, или вставь сюда код с другого устройства')}" hidden></textarea>
      <button class="btn sm" data-import-go hidden id="importGo">${tr('Загрузить прогресс')}</button>
      ${resetAsk ? `<div class="confirm"><span>${tr('Удалить весь прогресс на этом устройстве?')}</span><div class="row"><button class="btn red" data-reset-yes>${tr('Удалить')}</button><button class="btn dark" data-reset-no>${tr('Отмена')}</button></div></div>` : tr('<button class="btn sm dark" style="color:var(--red)" data-reset>Сбросить прогресс</button>')}
    </div>
    <p class="muted small" style="margin-top:16px;text-align:center">${tr('Неофициальный тренажёр по открытой программе экзамена NVIDIA NCA-AIIO. Не связан с NVIDIA.')} ${tr('NVIDIA, DGX, BlueField, NVLink и другие названия — товарные знаки NVIDIA Corporation.')} ${tr('Прогресс хранится только в этом браузере и никуда не отправляется.')}</p>`);
}

// ── onboarding ──
const FLAG = {
  en: '<svg viewBox="0 0 60 30" class="flag" aria-hidden="true"><clipPath id="fu"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#fu)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>',
  ru: '<svg viewBox="0 0 9 6" class="flag" aria-hidden="true"><path fill="#fff" d="M0 0h9v2H0z"/><path fill="#0039A6" d="M0 2h9v2H0z"/><path fill="#D52B1E" d="M0 4h9v2H0z"/></svg>',
  // Neutral badge: the Spanish translation targets Latin America (es-419), so no national flag.
  es: '<svg viewBox="0 0 30 20" class="flag" aria-hidden="true"><rect width="30" height="20" rx="2" fill="#2F6FDE"/><text x="15" y="14.5" text-anchor="middle" font-size="11" font-weight="700" font-family="system-ui,sans-serif" fill="#fff">ES</text></svg>',
};
// Full segmented picker for Profile; compact flag menu for the top corner of the start screen.
const langPick = () => `<div class="langs" role="group" aria-label="${tr('Язык')}">${Object.entries(LANGS).map(([k, v]) => `<button class="lang ${k === LANG ? 'on' : ''}" data-lang="${k}" aria-pressed="${k === LANG}">${FLAG[k]}<span>${v}</span></button>`).join('')}</div>`;
const langMenu = () => `<details class="lsel"><summary aria-label="${tr('Язык')}: ${LANGS[LANG]}">${FLAG[LANG]}<b>${LANG.toUpperCase()}</b><svg viewBox="0 0 24 24" class="chev" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="lmenu" role="menu">${Object.entries(LANGS).map(([k, v]) => `<button role="menuitemradio" aria-checked="${k === LANG}" class="${k === LANG ? 'on' : ''}" data-lang="${k}">${FLAG[k]}<span>${v}</span>${k === LANG ? I.check : ''}</button>`).join('')}</div></details>`;

function renderOnboarding() {
  view = 'onb';
  const steps = [
    () => `<div class="onbtop">${langMenu()}</div><div class="onb">${mascot('happy', 140)}<h1>${tr('Привет! Я <span class="green">Тензор</span>.')}</h1><p class="muted">${tr('Помогу подготовиться к экзамену NVIDIA AI Infrastructure and Operations Associate. По 5–10 минут в день: короткие уроки, повторение в нужный момент и пробный экзамен как настоящий.')}</p>${LANG !== 'en' ? `<p class="onb-note">${tr('Настоящий экзамен идёт только на английском. Вопросы здесь на английском, как на экзамене, а пояснения на русском.')}</p>` : ''}<button class="btn" data-onb="1">${tr('Поехали')}</button><button class="link-btn" data-onbimport>${tr('У меня уже есть код прогресса')}</button>${onb.imp ? `<textarea id="xfer" aria-label="${tr('Код прогресса')}" placeholder="${tr('Вставь код прогресса с другого устройства')}"></textarea><button class="btn sm" data-import-go id="importGo">${tr('Загрузить прогресс')}</button>` : ''}<p class="onb-legal">${tr('Неофициальный тренажёр, не связан с NVIDIA. NVIDIA и названия продуктов — товарные знаки NVIDIA Corporation.')}</p></div>`,
    () => `<div class="onb">${mascot('think', 100)}<h1>${tr('Сколько заниматься в день?')}</h1><div class="choices">${[[10, tr('Легко'), tr('~5 мин')], [20, tr('Нормально'), tr('~8 мин')], [30, tr('Серьёзно'), tr('~12 мин')], [50, tr('Интенсив'), tr('~20 мин')]].map(([g, a, b]) => `<button class="choice ${S.goal === g ? 'sel' : ''}" data-ogoal="${g}" aria-pressed="${S.goal === g}"><span>${a} · ${g} XP</span><span class="muted">${b}</span></button>`).join('')}</div><button class="btn" data-onb="2">${tr('Дальше')}</button></div>`,
    () => `<div class="onb">${mascot('idle', 100)}<h1>${tr('Какую серию берём в цель?')}</h1><p class="muted">${tr('Те, кто ставит цель серии, занимаются заметно регулярнее. Огонь горит, пока ты учишься каждый день, а заморозка спасёт в пропущенный.')}</p><div class="choices">${[[7, tr('Неделя')], [14, tr('Две недели')], [30, tr('Месяц')], [60, tr('Два месяца')]].map(([g, a]) => `<button class="choice ${S.streakGoal === g ? 'sel' : ''}" data-osgoal="${g}" aria-pressed="${S.streakGoal === g}"><span>${a}</span><span class="muted">${days(g)}</span></button>`).join('')}</div><button class="btn" data-onb="3">${tr('Начать первый урок')}</button></div>`,
  ];
  full((onb.step ? `<div class="onbtop left"><button class="x" data-onbback aria-label="${tr('Назад')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button></div>` : '') + steps[onb.step]());
}

// ── tycoon map ──
const DUCK = '<svg viewBox="0 0 512 512" class="duck" aria-hidden="true"><g fill="#76b900">' + [0, 1, 2, 3, 4].map(i => `<rect x="${150 + i * 48}" y="80" width="20" height="44" rx="6"/><rect x="${150 + i * 48}" y="388" width="20" height="44" rx="6"/><rect x="80" y="${150 + i * 48}" width="44" height="20" rx="6"/><rect x="388" y="${150 + i * 48}" width="44" height="20" rx="6"/>`).join('') + '</g><rect x="116" y="116" width="280" height="280" rx="44" fill="#141414" stroke="#76b900" stroke-width="12"/><path d="M168 300 L156 256 L206 286 Z" fill="#f2b705"/><ellipse cx="250" cy="318" rx="94" ry="52" fill="#ffc800"/><circle cx="292" cy="230" r="50" fill="#ffc800"/><path d="M334 222 q38 -6 46 12 q-12 18 -46 14 z" fill="#ff8a00"/><path d="M212 312 q40 -26 80 2 q-36 34 -80 -2 z" fill="#e0a800"/><circle cx="304" cy="220" r="9" fill="#050505"/><circle cx="307" cy="217" r="3" fill="#fff"/></svg>';
const lvOf = t => Math.min(3, nodeLevel(t));
const pfOf = t => OBJ[t].pf * lvOf(t);
const pfTotal = () => TKEYS.reduce((s, t) => s + pfOf(t), 0);
// An object needs service when its topic has overdue reviews (learned cards or past mistakes); it then runs at half power.
const svcDue = t => { const now = Date.now(); return Q.filter(x => x.t === t && S.cards[x.id] && S.cards[x.id].due <= now && (S.cards[x.id].b >= 2 || S.cards[x.id].w > 0)).length; };
const pfOnline = () => TKEYS.reduce((s, t) => s + pfOf(t) * (lvOf(t) && svcDue(t) ? 0.5 : 1), 0);
const hotTxt = n => n + ' ' + plural(n, tr('объект ЦОД перегрелся'), tr('объекта ЦОД перегрелись'), tr('объектов ЦОД перегрелись'));
const svcList = () => TKEYS.filter(t => lvOf(t) && svcDue(t));
const pfMax = () => TKEYS.reduce((s, t) => s + OBJ[t].pf * 3, 0);
const DC_RANKS = [[0, tr('Пустой ангар')], [1, tr('Гаражная стойка')], [5, tr('Серверная стартапа')], [10, tr('Корпоративный кластер')], [16, tr('Региональный ЦОД')], [22, 'AI Factory']];
const dcRank = n => DC_RANKS.filter(([k]) => n >= k).pop()[1];
let openObj = null, pendingBuild = null;

function renderMap() {
  view = 'map';
  const built = TKEYS.filter(t => lvOf(t) >= 1).length, pf = pfTotal(), on = Math.round(pfOnline()), max = pfMax(), ready = Math.round((readiness() || 0) * 100), svc = svcList();
  const rooms = ROOMS.map(r => {
    const ts = unitTopics(r.d), lit = ts.some(t => lvOf(t) >= 1), cert = !!S.units[r.d];
    const tiles = ts.map(t => {
      const lv = lvOf(t), sv = lv ? svcDue(t) : 0;
      return `<button class="tile tilt ${lv ? 'on' : ''} ${lv === 3 ? 'max' : ''} ${sv ? 'warn' : ''}" data-obj="${t}" aria-label="${esc(OBJ[t].name)}">${sv ? `<span class="svc">${sv}</span>` : ''}<span class="stage">${objSVG(OBJ[t].k, lv)}${lv ? '' : `<span class="lock">${I.lock}</span>`}</span><span class="hw mono">${esc(OBJ[t].hw)}</span><span class="tn">${esc(OBJ[t].name)}</span><span class="pips">${[1, 2, 3].map(i => `<i class="${i <= lv ? 'f' : ''}"></i>`).join('')}</span></button>`;
    }).join('');
    return `<section class="room ${lit ? 'lit' : 'dark'} ${cert ? 'cert' : ''}">
      <div class="room-h"><div><div class="room-n">${r.name}</div><div class="room-s">${r.sub} ${tr('· {0}% экзамена', DOMAINS[r.d].w)}</div></div>${cert ? `<span class="neon">${I.trophy}${tr('Сертифицирована')}</span>` : `<span class="room-c mono">${ts.filter(t => lvOf(t)).length}/${ts.length}</span>`}</div>
      ${lit ? '' : `<div class="room-off">${tr('Свет выключен. Пройди первый урок темы «{0}», чтобы запустить комнату.', esc(TOPICS[ts[0]]))}</div>`}
      <div class="tiles">${tiles}</div>
    </section>`;
  }).join('');
  const certs = CERTS.map(z => `<div class="zone"><div class="zone-h">${z.zone}</div><div class="certs">${z.items.map(c => `<div class="cert ${c.active ? 'active' : 'locked'}">
      <div class="cert-top"><span class="ccode mono">${c.code}</span>${c.active ? `<span class="cbadge">${ready}%</span>` : I.lock}</div>
      <div class="cname">${c.name}</div><div class="cmeta">${c.lvl} · ${c.price} · ${c.dur}</div>
      ${c.active ? `<div class="meter"><i style="width:${ready}%"></i></div>` : ''}
    </div>`).join('')}</div></div>`).join('');
  page(`<div class="dc-hero">
      <div class="dc-top"><div><div class="eyebrow">${tr('Твой AI-ЦОД')}</div><h1 class="dc-rank">${dcRank(built)}</h1></div>${DUCK}</div>
      <div class="dc-stats"><div><b class="mono" data-count="${on}">0</b><span>${tr('PF онлайн')}</span></div><div><b class="mono">${built}/${TKEYS.length}</b><span>${tr('объектов')}</span></div><div><b class="mono" data-count="${ready}" data-suffix="%">0</b><span>${tr('готовность')}</span></div></div>
      <div class="meter dual"><i class="nom" style="width:${pf / max * 100}%"></i><i style="width:${on / max * 100}%"></i></div>
      ${svc.length ? `<div class="svc-bar"><div><b>${hotTxt(svc.length)}</b><span>${tr('Пора повторить темы, иначе работают на 50% мощности.')}</span></div><button class="btn sm gold" data-service>${tr('Обслужить')}</button></div>` : `<p class="muted sm">${tr('Каждый урок строит или прокачивает объект по своей теме. Если не повторять темы вовремя, объекты перегреваются и теряют половину мощности.')}</p>`}
    </div>
    <div class="campus-h"><span class="bld">${tr('Здание 1')}</span> NCA-AIIO · AI Infrastructure and Operations</div>
    ${rooms}
    <h2 class="sec-h">${tr('Кампус NVIDIA')}</h2>
    <p class="muted sm">${tr('Следующие здания — остальные сертификации NVIDIA. Откроются, когда сдашь NCA-AIIO.')}</p>
    ${certs}
    <p class="muted small">${tr('Цены и форматы экзаменов указаны на октябрь 2026 года. Актуальные смотри на сайте NVIDIA.')}</p>
    <a class="link-sm" href="https://www.nvidia.com/en-us/learn/certification/" target="_blank" rel="noopener">${tr('Все сертификации на nvidia.com ↗')}</a>
    ${openObj ? objSheet(openObj) : ''}`);
}
function objSheet(t) {
  const o = OBJ[t], lv = lvOf(t), un = nodeUnlocked(t);
  const r = ROOMS.find(x => x.d === 'd' + t.split('.')[0]);
  const prev = TKEYS[TKEYS.indexOf(t) - 1];
  return `<button class="backdrop" data-objclose aria-label="${tr('Закрыть')}"></button><div class="sheet objsheet" role="dialog" aria-modal="true" aria-labelledby="objh"><div class="sheet-in">
    <div class="os-pic">${objSVG(o.k, Math.max(1, lv))}</div><div><div class="eyebrow">${r.name} ${tr('· тема {0} ·', t)} ${esc(o.hw)}</div><h3 id="objh">${esc(o.name)}</h3><div class="muted sm">${esc(TOPICS[t])}${lv ? '' : tr(' · так он будет выглядеть после первого урока')}</div></div>
    <div class="fact">${o.fact}</div>
    ${figBtn(figFor(t), '', tr('Схема'))}
    <div class="kv"><span>${tr('Уровень')}</span><span class="mono">${lv}${tr('/3 · +{0} PFLOPS за уровень', o.pf)}</span></div>
    ${lv && svcDue(t) ? `<div class="kv" style="color:var(--orange)"><span>${tr('Перегрев')}</span><span class="mono">${svcDue(t)} ${tr('вопр. к повтору')}</span></div><button class="btn gold" data-service>${tr('Обслужить повтором')}</button>` : ''}
    ${lv >= 3 ? `<button class="btn dark" data-objclose>${tr('Объект на максимуме')}</button>` : un ? `<button class="btn" data-start="${t}">${lv ? tr('Прокачать уроком') : tr('Построить уроком')}</button>` : `<button class="btn" disabled>${I.lock} ${tr('Сначала тема «{0}»', esc(TOPICS[prev]))}</button>`}
  </div></div>`;
}
function renderBuilt() {
  const { t, lv } = pendingBuild; pendingBuild = null;
  const o = OBJ[t], r = ROOMS.find(x => x.d === 'd' + t.split('.')[0]);
  view = 'built';
  full(`<div class="done-screen built">
    <div class="eyebrow">${lv === 1 ? tr('Новый объект в ЦОД') : lv === 3 ? tr('Объект на максимуме') : tr('Апгрейд объекта')}</div>
    <div class="reveal"><div class="rays"></div>${objSVG(o.k, lv)}</div>
    <h1>${esc(o.name)}</h1>
    <p class="muted">${r.name} ${tr('· уровень {0}/3', lv)}</p>
    <div class="fact">${o.fact}</div>
    <div class="done-stats"><div class="ds" style="--c:var(--green)"><div class="h">${tr('Мощность')}</div><div class="v">+${o.pf} PF</div></div><div class="ds" style="--c:var(--ice)"><div class="h">${tr('Всего')}</div><div class="v">${pfTotal()} PF</div></div></div>
  </div>
  ${figBtn(figFor(t), '', tr('Схема'))}
  <div class="row2"><button class="btn dark" data-gomap>${tr('Смотреть ЦОД')}</button><button class="btn" data-after>${tr('Дальше')}</button></div>`);
  sfx.coin(); confetti();
}

// ── router ──
const TABS = () => ({ learn: renderLearn, map: renderMap, practice: renderPractice, quests: renderQuests, exam: renderExamTab, profile: renderProfile });
let updateReady = false;
function home() { if (updateReady) { location.reload(); return; } openNode = null; openObj = null; if (tab === 'learn') navRoot(); TABS()[tab](); if (tab !== 'learn') window.scrollTo(0, 0); }
// Re-render the current tab in place (another tab saved, or the app came back to the foreground) without losing scroll or open popovers.
function refresh() { const y = window.scrollY; TABS()[tab](); window.scrollTo(0, y); }

$app.addEventListener('click', e => {
  const ls = $app.querySelector('details.lsel[open]'); if (ls && !e.target.closest('summary')) ls.open = false;
  sync();
  const a = e.target.closest('a[data-vid]');
  if (a) { const id = a.dataset.vid; if (!S.vids[id]) { S.vids[id] = Date.now(); addXP(5); save(); a.classList.add('seen'); a.querySelector('.vi').innerHTML = I.check; a.querySelector('.vx').textContent = ''; toast(tr('+5 XP за видео')); } return; }
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  const d = b.dataset;
  // A fast double tap must not skip the answer sheet or pick something on the screen that just appeared.
  const since = performance.now();
  if (('next' in d || 'after' in d) && since - fbAt < 450) return;
  if ((d.ch !== undefined || d.mt || d.md || d.xa !== undefined || d.fl !== undefined) && since - stepAt < 300) return;
  if (d.fig) return openFigure(d.fig, d.fignode);
  if (d.tab) { tab = d.tab; resetAsk = false; return home(); }
  if (d.lang) { if (d.lang !== LANG) setLang(d.lang); return; }
  if (d.seg) { learnSeg = d.seg; sfx.tap(); renderPractice(); window.scrollTo(0, 0); return; }
  if ('streak' in d) return renderStreak(false);
  if (d.chest) return openChest(d.chest);
  if (d.node) { openNode = openNode === d.node ? null : d.node; sfx.tap(); return renderLearn(); }
  if (d.start) {
    regenHearts(); if (!S.hearts) return renderNoHearts(d.start);
    if (!S.introSeen[d.start] && !d.skipintro && G.some(g => g.t === d.start)) { S.introSeen[d.start] = 1; save(); return renderTheory(d.start, true); }
    S.introSeen[d.start] = 1; save(); return startLesson(d.start);
  }
  if (d.theory) return renderTheory(d.theory, false);
  if (d.test) { regenHearts(); if (!S.hearts) return renderNoHearts(null); return startTest(d.test); }
  if ('resume' in d) { const sl = loadLesson(); if (!sl) { toast(tr('Урок не найден, начни заново')); return home(); } return resumeLesson(sl); }
  if ('dropless' in d) { clearLesson(); return renderLearn(); }
  if ('refill' in d) return startReview('refill');
  if ('gloss' in d) { if (view !== 'theory') glossFrom = null; return renderGloss(); }
  if ('legendOk' in d) { S.introSeen.legend = 1; save(); return renderLearn(); }
  if ('orig' in d) { showOrig = !showOrig; return view === 'examrun' ? renderExam() : renderLesson(); }
  if ('onbback' in d) { onb.step = Math.max(0, onb.step - 1); return renderOnboarding(); }
  if ('onbimport' in d) { onb.imp = !onb.imp; renderOnboarding(); const ta = document.getElementById('xfer'); if (ta) ta.focus(); return; }
  if (d.notes !== undefined) return renderNotes(d.notes || notesD);
  if ('figs' in d) return renderFigs();
  if (d.obj) { openObj = d.obj; sfx.tap(); renderMap(); return; }
  if ('objclose' in d) { openObj = null; return renderMap(); }
  if ('gomap' in d) { tab = 'map'; if (pendingStreak) { pendingStreak = false; return renderStreak(true); } return home(); }
  if ('after' in d) { if (pendingBuild) return renderBuilt(); if (pendingStreak) { pendingStreak = false; return renderStreak(true); } return home(); }
  // The glossary opened from a theory page closes back to that page.
  if ('back' in d && view === 'gloss' && glossFrom) { const [t, s0] = glossFrom; glossFrom = null; return renderTheory(t, s0); }
  if ('back' in d || 'home' in d) { if (view === 'examrun') { clearTimeout(tickT); toast(tr('Экзамен не на паузе: таймер идёт')); } L = null; F = null; return home(); }
  if ('quit' in d) { if (L && (L.kind === 'lesson' || L.kind === 'test') && L.i + (L.fb ? 1 : 0) > 0) { storeLesson(); toast(tr('Урок сохранён. Продолжишь с того же места')); } else if (L && (L.kind === 'lesson' || L.kind === 'test')) clearLesson(); L = null; return home(); }
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
  if ('qchest' in d) { if (!S.quests.chest && S.quests.list.every(q => q.claimed)) { const g = 30 + Math.floor(Math.random() * 31); S.quests.chest = true; S.gems += g; save(); sfx.coin(); confetti(); toast(tr('Сундук дня: +') + g + tr(' кристаллов')); } return renderQuests(); }
  if (d.buy) { buy(d.buy); save(); if (view === 'streak') return renderStreak(false); if (view === 'nohearts') { const sl = loadLesson(); return S.hearts ? (sl ? resumeLesson(sl) : home()) : renderNoHearts(sl && sl.topic); } return renderQuests(); }
  if (d.sgoal) { S.streakGoal = +d.sgoal; save(); return renderStreak(false); }
  if ('ics' in d) return downloadICS();
  if ('exam' in d) { if (view !== 'examrun') showOrig = false; return startExam(); }
  if (d.xa !== undefined) { exam.items[exam.i].a = +d.xa; storeExam(); return renderExam(); }
  if (d.cell !== undefined) { exam.i = +d.cell; storeExam(); return renderExam(); }
  if ('flag' in d) { exam.items[exam.i].f = !exam.items[exam.i].f; storeExam(); return renderExam(); }
  if ('grid' in d) { exam.grid = !exam.grid; return renderExam(); }
  if ('xprev' in d) { exam.i--; exam.confirm = false; storeExam(); renderExam(); return window.scrollTo(0, 0); }
  if ('xnext' in d) { exam.i++; exam.confirm = false; storeExam(); renderExam(); return window.scrollTo(0, 0); }
  if ('fin' in d) { exam.confirm = true; renderExam(); const y = $app.querySelector('[data-fin-yes]'); if (y) y.focus(); return; }
  if ('finNo' in d) { exam.confirm = false; return renderExam(); }
  if ('finYes' in d) { finishExam(); return window.scrollTo(0, 0); }
  if (d.goal) { S.goal = +d.goal; save(); return renderProfile(); }
  if ('sound' in d) { S.sound = !S.sound; save(); sfx.tap(); return renderProfile(); }
  if ('unlock' in d) { S.unlockAll = !S.unlockAll; save(); return renderProfile(); }
  if ('install' in d && deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; renderProfile(); }); return; }
  if ('export' in d) {
    const json = JSON.stringify(S), code = btoa(unescape(encodeURIComponent(JSON.stringify({ s: S, k: codeSum(json) }))));
    const ta = document.getElementById('xfer'); ta.hidden = false; ta.value = code; ta.select();
    (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => toast(tr('Код скопирован')), () => toast(tr('Выдели код и скопируй вручную')));
    return;
  }
  if ('import' in d) { const ta = document.getElementById('xfer'); ta.hidden = false; ta.value = ''; ta.focus(); document.getElementById('importGo').hidden = false; return; }
  if ('importGo' in d) {
    const code = (document.getElementById('xfer').value || '').replace(/\s+/g, '');
    let obj = null;
    if (code.length && code.length < 400000) { try { obj = JSON.parse(decodeURIComponent(escape(atob(code)))); } catch (err) { obj = null; } }
    // Current codes carry a checksum; a code that was edited by hand is refused.
    if (isObj(obj) && isObj(obj.s) && 'k' in obj) obj = obj.k === codeSum(JSON.stringify(obj.s)) ? obj.s : 'bad';
    else if (isObj(obj)) obj = plausible(obj);
    if (obj === 'bad') { toast(tr('Код изменён вручную или повреждён')); return; }
    if (!isObj(obj) || typeof obj.xp !== 'number') { toast(code.length >= 400000 ? tr('Код слишком длинный, это не код прогресса') : tr('Код не подошёл. Скопируй его целиком ещё раз')); return; }
    const prev = S;
    S = normalize(obj); S.onboarded = true;
    if (!save()) { S = prev; toast(tr('Не удалось сохранить: в браузере нет места')); return; }
    clearLesson(); onb.imp = false; toast(tr('Прогресс загружен')); tab = 'profile'; return renderProfile();
  }
  if ('reset' in d) { resetAsk = true; return renderProfile(); }
  if ('resetNo' in d) { resetAsk = false; return renderProfile(); }
  if ('resetYes' in d) { S = fresh(); clearExam(); clearLesson(); resetAsk = false; save(); toast(tr('Прогресс сброшен')); onb.step = 0; return renderOnboarding(); }
  if (d.ogoal) { S.goal = +d.ogoal; return renderOnboarding(); }
  if (d.osgoal) { S.streakGoal = +d.osgoal; return renderOnboarding(); }
  if (d.onb) { const n = +d.onb; if (n < 3) { onb.step = n; return renderOnboarding(); } S.onboarded = true; save(); S.introSeen[TKEYS[0]] = 1; return renderTheory(TKEYS[0], true); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const ls = $app.querySelector('details.lsel[open]'); if (ls) { ls.open = false; ls.querySelector('summary').focus(); return; }
    if (view === 'learn' && openNode) { const t = openNode; openNode = null; renderLearn(); const b = $app.querySelector(`[data-node="${t}"]`); if (b) b.focus({ preventScroll: true }); return; }
    if (view === 'map' && openObj) { const t = openObj; openObj = null; renderMap(); const b = $app.querySelector(`[data-obj="${t}"]`); if (b) b.focus({ preventScroll: true }); return; }
    if (view === 'examrun' && exam && exam.confirm) { exam.confirm = false; renderExam(); const b = $app.querySelector('[data-fin]'); if (b) b.focus(); return; }
  }
  if (e.metaKey || e.ctrlKey || e.altKey || /textarea|input|select/i.test(e.target.tagName)) return;
  // Enter and Space on a focused control do what that control says; the shortcuts below only apply when nothing is focused.
  const onCtl = e.target !== document.body && e.target.closest && e.target.closest('button, a, summary, [tabindex]:not([tabindex="-1"])');
  if ((e.key === 'Enter' || e.key === ' ') && onCtl) return;
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
    else if (e.key === 'ArrowRight' && exam.i < exam.items.length - 1) { exam.i++; exam.confirm = false; storeExam(); renderExam(); }
    else if (e.key === 'ArrowLeft' && exam.i > 0) { exam.i--; exam.confirm = false; storeExam(); renderExam(); }
  }
});
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if (view === 'profile') renderProfile(); });
const ROOT = () => ['learn', 'map', 'practice', 'quests', 'exam', 'profile'].includes(view);
document.addEventListener('visibilitychange', () => { if (document.hidden) return; sync(); if (ROOT()) { settleStreak(); refresh(); } });
window.addEventListener('storage', e => { if (e.key === LS && sync() && ROOT()) refresh(); });
// The service worker serves everything from cache, so a new version shows up as a new worker taking over.
// Right after launch reload into it; later in a session the new version simply opens next time.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  const hadSW = !!navigator.serviceWorker.controller;
  // A new version took over: reload now if nothing is in progress, otherwise on the next tab change.
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!hadSW) return; if (view !== 'lesson' && view !== 'examrun' && !(window.FIGV && FIGV.isOpen())) location.reload(); else updateReady = true; });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    reg.update().catch(() => {});
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
}

document.title = tr('AIIO Path — подготовка к NVIDIA NCA-AIIO (неофициально)');
// If anything in the saved data still breaks the first render, show a way out instead of a blank screen.
function recovery(err) {
  let raw = brokenRaw; try { raw = raw || localStorage.getItem(LS); } catch (e) {}
  $app.innerHTML = `<main class="screen full"><div class="done-screen"><h1>${tr('Данные повреждены')}</h1><p class="muted">${tr('Сохранённый прогресс не удалось открыть. Скопируй данные на всякий случай и начни заново.')}</p><textarea id="rawdata" aria-label="${tr('Сохранённые данные')}" readonly>${esc(raw || String(err))}</textarea></div><div style="display:grid;gap:12px"><button class="btn dark" id="rcopy">${tr('Скопировать данные')}</button><button class="btn red" id="rreset">${tr('Начать заново')}</button></div></main>`;
  document.getElementById('rcopy').onclick = () => { const t = document.getElementById('rawdata'); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) {} };
  document.getElementById('rreset').onclick = () => { try { localStorage.setItem(LS + '-broken', raw || ''); localStorage.removeItem(LS); localStorage.removeItem(LS_EXAM); localStorage.removeItem(LS_LES); } catch (e) {} location.reload(); };
}
try {
  S = loadState();
  settleStreak(); regenHearts(); ensureQuests(); save();
  try { history.replaceState({ aiio: 0 }, ''); } catch (e) {}
  if (!S.onboarded) renderOnboarding(); else renderLearn();
  if (brokenRaw) toast(tr('Сохранение было повреждено, копия отложена. Начинаем с чистого листа'));
} catch (err) { recovery(err); }
})();
