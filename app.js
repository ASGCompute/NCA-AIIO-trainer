(() => {
'use strict';
const $app = document.getElementById('app');
const MIN = 60e3, DAY = 864e5;
const INTERVAL = [0, 10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY];
const P_BY_BOX = [0.25, 0.4, 0.6, 0.75, 0.85, 0.95];
const MAX_HEARTS = 5, HEART_MS = 30 * MIN, NODE_LEVELS = 3;
const LS = 'aiio-path-v1', LS_EXAM = 'aiio-path-exam-v1';
const LEVELS = [
  [0, 'Один GPU'], [120, 'PCIe-карта'], [300, 'NVLink-пара'], [550, 'Узел DGX'], [900, 'Стойка'],
  [1350, 'Scalable Unit'], [1900, 'BasePOD'], [2600, 'SuperPOD'], [3500, 'AI Factory'], [4600, 'Архитектор AI Factory'],
];

// ── icons ──
const I = {
  fire: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5-1.5 5.2-1.5 7.6 0 1.3.9 2.2 2 2.2 1.6 0 2.3-1.6 1.8-3.7C17 10 19 12.8 19 15.5 19 19.6 15.9 22 12 22s-7-2.4-7-6.4C5 10.7 9.8 8.3 12 2z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3 1.7-1.8 3.1-3 5.3-3 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.6L13.5 2z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V7.5a5 5 0 0 1 10 0V10h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1zm2 0h6V7.5a3 3 0 0 0-6 0V10z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>',
  cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
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
};

// ── helpers ──
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dayKey = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const vibrate = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

Q.forEach(x => { x.id = 'q' + hash(x.text); });
G.forEach(x => { x.id = 'g' + hash(x[1]); x.t = x[0]; x.term = x[1]; x.def = x[2]; x.d = 'd' + x[0].split('.')[0]; });
const QBY = Object.fromEntries(Q.map(x => [x.id, x]));
const GBY = Object.fromEntries(G.map(x => [x.id, x]));
const TKEYS = Object.keys(TOPICS);
const UNITS = Object.keys(DOMAINS);
const unitTopics = d => TKEYS.filter(t => 'd' + t.split('.')[0] === d);

// ── state ──
const fresh = () => ({ v: 1, xp: 0, cards: {}, nodes: {}, units: {}, hearts: MAX_HEARTS, heartsAt: Date.now(), goal: 30,
  streak: { day: '', count: 0, best: 0 }, daily: { day: '', xp: 0 }, stats: { answered: 0, correct: 0, lessons: 0, bestCombo: 0, flash: 0, perfect: 0 },
  exams: [], badges: [], unlockAll: false, introSeen: {} });
let S = fresh();
try { const raw = localStorage.getItem(LS); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
const save = () => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} };

function regenHearts() {
  if (S.hearts >= MAX_HEARTS) { S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); return; }
  const now = Date.now();
  while (S.hearts < MAX_HEARTS && now - S.heartsAt >= HEART_MS) { S.hearts++; S.heartsAt += HEART_MS; }
  if (S.hearts >= MAX_HEARTS) S.heartsAt = now;
}
const nextHeartIn = () => Math.max(0, HEART_MS - (Date.now() - S.heartsAt));
const streakAlive = () => S.streak.day === dayKey() || S.streak.day === dayKey(Date.now() - DAY);
const todayXP = () => (S.daily.day === dayKey() ? S.daily.xp : 0);

const box = id => (S.cards[id] ? S.cards[id].b : 0);
const topicMastery = t => { const qs = Q.filter(x => x.t === t); return qs.reduce((s, x) => s + box(x.id), 0) / (qs.length * 5); };
const domainMastery = d => { const qs = Q.filter(x => x.d === d); return qs.reduce((s, x) => s + box(x.id), 0) / (qs.length * 5); };
const domainP = d => { const qs = Q.filter(x => x.d === d); return qs.reduce((s, x) => s + P_BY_BOX[box(x.id)], 0) / qs.length; };
const readiness = () => UNITS.reduce((s, d) => s + domainP(d) * DOMAINS[d].w / 100, 0);
function levelInfo() {
  let i = 0; while (i + 1 < LEVELS.length && S.xp >= LEVELS[i + 1][0]) i++;
  const cur = LEVELS[i][0], next = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
  return { n: i + 1, name: LEVELS[i][1], next, frac: next ? (S.xp - cur) / (next - cur) : 1 };
}
const nodeLevel = t => S.nodes[t] || 0;
function nodeUnlocked(t) {
  if (S.unlockAll) return true;
  const i = TKEYS.indexOf(t);
  return i === 0 || nodeLevel(TKEYS[i - 1]) >= 1;
}
const unitTestUnlocked = d => S.unlockAll || unitTopics(d).every(t => nodeLevel(t) >= 1);
const currentNode = () => TKEYS.find(t => nodeUnlocked(t) && nodeLevel(t) === 0) || TKEYS.find(t => nodeLevel(t) < NODE_LEVELS) || null;

function grade(id, ok) {
  const c = S.cards[id] || { b: 0, due: 0, c: 0, w: 0 };
  if (ok) { const top = c.b === 5; c.b = Math.min(c.b + 1, 5); c.due = Date.now() + (top ? 30 * DAY : INTERVAL[c.b]); c.c++; }
  else { c.b = 1; c.due = Date.now() + INTERVAL[1]; c.w++; }
  S.cards[id] = c;
}

let toastT;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); }
function addXP(n) {
  const before = levelInfo().n;
  S.xp += n;
  const today = dayKey();
  if (S.daily.day !== today) S.daily = { day: today, xp: 0 };
  const wasBelow = S.daily.xp < S.goal;
  S.daily.xp += n;
  if (S.streak.day !== today) {
    S.streak.count = S.streak.day === dayKey(Date.now() - DAY) ? S.streak.count + 1 : 1;
    S.streak.day = today; S.streak.best = Math.max(S.streak.best || 0, S.streak.count);
  }
  const L = levelInfo();
  if (L.n > before) setTimeout(() => toast('Новый уровень ' + L.n + ': ' + L.name), 500);
  else if (wasBelow && S.daily.xp >= S.goal) setTimeout(() => toast('Дневная цель выполнена!'), 500);
}

const BADGES = [
  ['first', 'Первый урок', 'Пройди первый урок', () => S.stats.lessons >= 1],
  ['perfect', 'Без ошибок', 'Пройди урок без единой ошибки', () => S.stats.perfect >= 1],
  ['combo10', 'Серия 10', '10 верных ответов подряд', () => S.stats.bestCombo >= 10],
  ['s3', 'Огонёк', '3 дня подряд', () => (S.streak.best || 0) >= 3],
  ['s7', 'Неделя', '7 дней подряд', () => (S.streak.best || 0) >= 7],
  ['s30', 'Месяц', '30 дней подряд', () => (S.streak.best || 0) >= 30],
  ['u1', 'Основы AI', 'Пройди контрольную раздела 1', () => !!S.units.d1],
  ['u2', 'Инфраструктура', 'Пройди контрольную раздела 2', () => !!S.units.d2],
  ['u3', 'Эксплуатация', 'Пройди контрольную раздела 3', () => !!S.units.d3],
  ['gold', 'Золотой путь', 'Все уроки на максимальном уровне', () => TKEYS.every(t => nodeLevel(t) >= NODE_LEVELS)],
  ['exam1', 'Первый экзамен', 'Пройди пробный экзамен', () => S.exams.length >= 1],
  ['pass', 'Сдано', '70% на пробном экзамене', () => S.exams.some(e => e.score >= 0.7)],
  ['ace', 'Отличник', '85% на пробном экзамене', () => S.exams.some(e => e.score >= 0.85)],
  ['a500', '500 ответов', 'Ответь на 500 вопросов', () => S.stats.answered >= 500],
];
function checkBadges() { BADGES.forEach(([id, name, , t]) => { if (!S.badges.includes(id) && t()) { S.badges.push(id); setTimeout(() => toast('Достижение: ' + name), 1200); } }); }

// ── confetti ──
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.getElementById('confetti'), ctx = c.getContext('2d');
  c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio);
  const cols = ['#58cc02', '#1cb0f6', '#ce82ff', '#ffc800', '#ff4b4b', '#ff9600'];
  const ps = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
  const t0 = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach(p => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += 0.15; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (t - t0 < 2200) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })(t0);
}

// ── shared chrome ──
let tab = 'learn', view = 'learn', openNode = null, L = null, exam = null, notesD = 'd1', resetAsk = false, deferredPrompt = null;
function statusBar() {
  regenHearts();
  const lv = levelInfo();
  return `<div class="status">
    <span class="stat lvl" title="Уровень">${I.chip}<span>${lv.n}</span></span>
    <span class="stat fire ${streakAlive() && S.streak.count ? '' : 'off'}" title="Серия дней">${I.fire}<span>${streakAlive() ? S.streak.count : 0}</span></span>
    <span class="stat xp" title="Опыт">${I.bolt}<span>${S.xp}</span></span>
    <span class="stat heart" title="Сердца">${I.heart}<span>${S.hearts}</span></span>
  </div>`;
}
function tabBar() {
  const t = (id, icon, label) => `<button class="tab ${tab === id ? 'on' : ''}" data-tab="${id}"><span class="ti">${icon}</span>${label}</button>`;
  return `<nav class="tabs"><div class="tabs-in">${t('learn', I.home, 'Путь')}${t('practice', I.dumbbell, 'Практика')}${t('exam', I.exam, 'Экзамен')}${t('profile', I.user, 'Профиль')}</div></nav>`;
}
function page(html) { $app.innerHTML = `<div class="screen">${statusBar()}${html}</div>${tabBar()}`; }
function full(html) { $app.innerHTML = `<div class="screen full">${html}</div>`; }

// ── LEARN (path) ──
const OFFS = [0, 44, 70, 44, 0, -44, -70, -44];
function renderLearn() {
  view = 'learn'; tab = 'learn';
  const cur = currentNode();
  let k = 0;
  const units = UNITS.map((d, ui) => {
    const D = DOMAINS[d];
    const nodes = unitTopics(d).map(t => {
      const off = OFFS[k++ % OFFS.length];
      const lvl = nodeLevel(t), un = nodeUnlocked(t), done = lvl >= NODE_LEVELS;
      const icon = !un ? I.lock : done ? I.trophy : lvl > 0 ? I.check : I.star;
      const pop = openNode === t ? popNode(t, ui) : '';
      return `<div class="node-wrap" style="transform:translateX(${off}px)">
        ${t === cur && openNode !== t ? `<span class="start-bubble">${lvl ? 'Дальше' : 'Начать'}</span>` : ''}
        <button class="node ${!un ? 'locked' : done ? 'done' : ''} ${t === cur ? 'cur' : ''}" style="--rot:${lvl * 120}deg" data-node="${t}" aria-label="${esc(TOPICS[t])}">${icon}${un && lvl ? `<span class="crowns">${lvl}/${NODE_LEVELS}</span>` : ''}</button>
        <span class="node-label">${t} · ${esc(TOPICS[t])}</span>
      </div>${pop ? `<div style="transform:translateX(${off * 0.4}px)">${pop}</div>` : ''}`;
    }).join('');
    const tOpen = openNode === 'test-' + d, tUn = unitTestUnlocked(d), passed = !!S.units[d];
    const test = `<div class="node-wrap"><button class="node chest ${!tUn ? 'locked' : passed ? 'done' : ''}" data-node="test-${d}" aria-label="Контрольная раздела">${tUn ? I.trophy : I.lock}</button><span class="node-label">Контрольная раздела</span></div>${tOpen ? popTest(d, tUn, passed) : ''}`;
    return `<div class="u${ui + 1}">
      <div class="unit"><div><div class="k">Раздел ${ui + 1} · ${D.w}% экзамена</div><h2>${esc(D.name)}</h2><div class="ru">${esc(D.ru)} · освоено ${Math.round(domainMastery(d) * 100)}%</div></div><button class="notes-btn" data-notes="${d}">${I.book.replace('<svg', '<svg width="18" height="18" style="vertical-align:-3px;margin-right:4px"')}Конспект</button></div>
      <div class="path">${nodes}${test}</div>
    </div>`;
  }).join('');
  page(units);
  const curEl = document.querySelector('.node.cur');
  if (curEl && !openNode && !renderLearn.scrolled) { renderLearn.scrolled = true; curEl.scrollIntoView({ block: 'center' }); }
}
function popNode(t, ui) {
  const un = nodeUnlocked(t), lvl = nodeLevel(t);
  if (!un) return `<div class="popover locked"><h3>${esc(TOPICS[t])}</h3><p class="sub">Пройди предыдущий урок, чтобы открыть этот. Или открой все уроки в профиле.</p></div>`;
  const done = lvl >= NODE_LEVELS;
  regenHearts();
  return `<div class="popover"><h3>${esc(TOPICS[t])}</h3>
    <p class="sub">${done ? 'Урок пройден на максимум. Можно повторить для закрепления.' : 'Уровень ' + (lvl + 1) + ' из ' + NODE_LEVELS + ' · 7 заданий'}</p>
    <button class="btn white" data-start="${t}" ${S.hearts ? '' : 'disabled'}>${S.hearts ? (done ? 'Повторить +5 XP' : 'Начать +15 XP') : 'Нет сердец'}</button>
    <button class="btn white" style="box-shadow:none;background:transparent;color:#fff;border:2px solid rgba(255,255,255,.5)" data-theory="${t}">Теория</button>
  </div>`;
}
function popTest(d, un, passed) {
  if (!un) return `<div class="popover locked"><h3>Контрольная раздела</h3><p class="sub">Откроется, когда пройдёшь все уроки раздела хотя бы на первый уровень.</p></div>`;
  return `<div class="popover"><h3>Контрольная: ${esc(DOMAINS[d].name)}</h3><p class="sub">12 вопросов по всему разделу. ${passed ? 'Уже пройдена, можно пересдать.' : 'Пройди с сердцами в запасе и получи кубок.'}</p>
    <button class="btn white" data-test="${d}" ${S.hearts ? '' : 'disabled'}>${S.hearts ? 'Начать +30 XP' : 'Нет сердец'}</button></div>`;
}

// ── theory / notes ──
function renderTheory(t, thenStart) {
  view = 'theory';
  const cards = G.filter(g => g.t === t);
  full(`<div class="lesson-top"><button class="x" data-back aria-label="Закрыть">${I.x}</button><h2 style="font-size:18px">${esc(TOPICS[t])}</h2></div>
    <div class="lesson-body" style="padding-bottom:110px">
      <p class="qtype">Ключевые понятия · ${t}</p>
      <div class="theory">${cards.map(g => `<div class="t"><b>${esc(g.term)}</b><span>${esc(g.def)}</span></div>`).join('') || '<p class="muted">Для этой подтемы карточек нет, учимся сразу на вопросах.</p>'}</div>
    </div>
    <div class="sheet"><div class="sheet-in"><button class="btn" data-start="${t}" data-skipintro="1">${thenStart ? 'Понятно, к заданиям' : 'Начать урок'}</button></div></div>`);
}
function renderNotes(d) {
  view = 'notes'; notesD = d;
  full(`<div class="lesson-top"><button class="x" data-back aria-label="Закрыть">${I.x}</button><h2 style="font-size:18px">Конспект</h2></div>
    <div class="row" style="margin-bottom:14px">${UNITS.map((u, i) => `<button class="btn sm ${u === d ? 'blue' : 'ghost'}" data-notes="${u}">Раздел ${i + 1}</button>`).join('')}</div>
    <h2 style="margin-bottom:6px">${esc(DOMAINS[d].name)} · ${DOMAINS[d].w}%</h2>
    <div class="notes">${NOTES[d].map(([h, items]) => `<h3>${esc(h)}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`).join('')}</div>`);
}

// ── lesson engine ──
function mcqItem(q) { return { type: 'mcq', id: q.id, order: shuffle([0, 1, 2, 3]) }; }
function pickQs(pool, n) { return shuffle(pool).sort((a, b) => box(a.id) - box(b.id)).slice(0, n); }
function tfItem(t, d) {
  const pool = G.filter(g => g.t === t); const src = pool.length ? pool : G.filter(g => g.d === d);
  const g = src[Math.floor(Math.random() * src.length)];
  const truth = Math.random() < 0.5;
  let shown = g;
  if (!truth) { const others = G.filter(o => o.d === g.d && o.id !== g.id); shown = others[Math.floor(Math.random() * others.length)]; }
  return { type: 'tf', g: g.id, shown: shown.id, truth: !truth ? false : true };
}
function matchItem(t, d) {
  let pool = shuffle(G.filter(g => g.t === t));
  if (pool.length < 4) pool = pool.concat(shuffle(G.filter(g => g.d === d && g.t !== t))).slice(0, 4);
  const ids = pool.slice(0, 4).map(g => g.id);
  return { type: 'match', ids, defs: shuffle(ids), done: [], selT: null, selD: null, bad: null, errors: 0 };
}
function startLesson(t) {
  const d = 'd' + t.split('.')[0];
  const qs = pickQs(Q.filter(x => x.t === t), 5).map(mcqItem);
  const items = [qs[0], qs[1], tfItem(t, d), qs[2], matchItem(t, d), qs[3], qs[4]].filter(Boolean);
  L = { kind: 'lesson', topic: t, d, items, i: 0, hearts: true, correct: 0, wrong: 0, combo: 0, sel: null, fb: null, t0: Date.now() };
  renderLesson();
}
function startTest(d) {
  const items = [];
  unitTopics(d).forEach(t => { const q = pickQs(Q.filter(x => x.t === t), 1)[0]; if (q) items.push(q); });
  const rest = pickQs(Q.filter(x => x.d === d && !items.includes(x)), 12 - items.length);
  L = { kind: 'test', d, items: shuffle(items.concat(rest)).slice(0, 12).map(mcqItem), i: 0, hearts: true, correct: 0, wrong: 0, combo: 0, sel: null, fb: null, t0: Date.now() };
  renderLesson();
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
  let qs;
  if (kind === 'weak') qs = shuffle(Q.filter(x => S.cards[x.id] && S.cards[x.id].w > 0 && S.cards[x.id].b <= 2)).slice(0, 12);
  else qs = pickReview(10);
  if (!qs.length) { toast('Пока нечего повторять'); return; }
  L = { kind, items: qs.map(mcqItem), i: 0, hearts: false, correct: 0, wrong: 0, combo: 0, sel: null, fb: null, t0: Date.now() };
  renderLesson();
}

function renderLesson() {
  view = 'lesson';
  const it = L.items[L.i];
  const pct = Math.round(L.i / L.items.length * 100);
  regenHearts();
  const top = `<div class="lesson-top"><button class="x" data-quit aria-label="Выйти">${I.x}</button><div class="bar"><i style="width:${pct}%"></i></div>${L.hearts ? `<span class="stat heart">${I.heart}<span>${S.hearts}</span></span>` : ''}</div>`;
  let body = '', canCheck = false;
  if (it.type === 'mcq') {
    const q = QBY[it.id];
    const lock = !!L.fb;
    body = `<p class="qtype">${L.combo >= 3 ? '<span style="color:var(--orange)">Серия ×' + L.combo + '</span> · ' : ''}${q.t} ${esc(TOPICS[q.t])}</p>
      <div class="qtext en">${esc(q.text)}</div>
      <div class="choices">${it.order.map((oi, k) => {
        let cls = '';
        if (lock) { if (oi === 0) cls = 'right'; else if (k === L.sel) cls = 'wrong'; } else if (k === L.sel) cls = 'sel';
        return `<button class="choice ${cls}" data-ch="${k}" ${lock ? 'disabled' : ''}><span class="n">${k + 1}</span><span>${esc(q.opts[oi])}</span></button>`;
      }).join('')}</div>`;
    canCheck = L.sel !== null;
  } else if (it.type === 'tf') {
    const g = GBY[it.g], s = GBY[it.shown];
    body = `<p class="qtype">Верно ли определение?</p>
      <div class="tf-card"><div class="term">${esc(g.term)}</div><div>${esc(s.def)}</div></div>
      <div class="choices">${[['true', 'Верно'], ['false', 'Неверно']].map(([v, lbl], k) => {
        let cls = '';
        const val = v === 'true';
        if (L.fb) { if (val === it.truth) cls = 'right'; else if (L.sel === k) cls = 'wrong'; } else if (L.sel === k) cls = 'sel';
        return `<button class="choice ${cls}" data-ch="${k}" ${L.fb ? 'disabled' : ''}><span class="n">${k + 1}</span><span>${lbl}</span></button>`;
      }).join('')}</div>`;
    canCheck = L.sel !== null;
  } else if (it.type === 'match') {
    body = `<p class="qtype">Соедини термины с определениями</p>
      <div class="match">
        <div class="terms">${it.ids.map(id => `<button class="chip ${it.done.includes(id) ? 'ok' : it.selT === id ? 'sel' : ''} ${it.bad === 't' + id ? 'bad' : ''}" data-mt="${id}" ${it.done.includes(id) ? 'disabled' : ''}>${esc(GBY[id].term)}</button>`).join('')}</div>
        ${it.defs.map(id => `<button class="chip def ${it.done.includes(id) ? 'ok' : it.selD === id ? 'sel' : ''} ${it.bad === 'd' + id ? 'bad' : ''}" data-md="${id}" ${it.done.includes(id) ? 'disabled' : ''}>${esc(GBY[id].def)}</button>`).join('')}
      </div>`;
  }
  let sheet;
  if (L.fb) {
    const ok = L.fb.ok;
    let ex = '';
    if (it.type === 'mcq') { const q = QBY[it.id]; ex = (ok ? '' : `<div class="answer">Правильно: ${esc(q.opts[0])}</div>`) + `<div class="ex">${esc(q.ex)}</div>`; }
    else if (it.type === 'tf') { const g = GBY[it.g]; ex = `<div class="ex"><b>${esc(g.term)}</b>: ${esc(g.def)}</div>`; }
    else ex = `<div class="ex">${it.errors ? 'Ошибок при сопоставлении: ' + it.errors + '.' : 'Все пары с первой попытки.'}</div>`;
    sheet = `<div class="sheet ${ok ? 'ok' : 'bad'}"><div class="sheet-in">
      <div class="verdict">${ok ? I.check : I.cross}<span>${ok ? ['Отлично!', 'Верно!', 'Так держать!', 'Супер!'][Math.floor(Math.random() * 4)] : 'Неверно'}</span></div>
      ${ex}
      <button class="btn ${ok ? '' : 'red'}" data-next id="go">Продолжить</button></div></div>`;
  } else if (it.type === 'match') sheet = '';
  else sheet = `<div class="sheet"><div class="sheet-in"><button class="btn" data-check id="go" ${canCheck ? '' : 'disabled'}>Проверить</button></div></div>`;
  full(top + `<div class="lesson-body">${body}</div>` + sheet);
}
function check() {
  const it = L.items[L.i];
  if (L.fb || L.sel === null) return;
  let ok;
  if (it.type === 'mcq') { ok = it.order[L.sel] === 0; grade(it.id, ok); }
  else { ok = (L.sel === 0) === it.truth; grade(it.g, ok); }
  resolve(ok);
}
function resolve(ok) {
  const it = L.items[L.i];
  S.stats.answered++;
  if (ok) { L.correct++; L.combo++; S.stats.correct++; S.stats.bestCombo = Math.max(S.stats.bestCombo, L.combo); }
  else {
    L.wrong++; L.combo = 0; vibrate(120);
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
    if (it.selT === it.selD) { it.done.push(it.selT); grade(it.selT, true); }
    else { it.errors++; it.bad = 'd' + it.selD; vibrate(80); }
    it.selT = null; it.selD = null;
  }
  if (it.done.length === it.ids.length) { L.sel = 0; resolve(it.errors <= 1); return; }
  renderLesson();
}
function finishLesson() {
  const k = L.kind, perfect = L.wrong === 0;
  const secs = Math.round((Date.now() - L.t0) / 1000);
  let xp = 0, title = 'Урок пройден!';
  if (k === 'lesson') {
    const lvl = nodeLevel(L.topic);
    xp = lvl >= NODE_LEVELS ? 5 : 10 + Math.min(L.correct, 7) - Math.min(L.wrong, 2) + (perfect ? 5 : 0);
    S.nodes[L.topic] = Math.min(NODE_LEVELS, lvl + 1);
    S.stats.lessons++; if (perfect) S.stats.perfect++;
  } else if (k === 'test') {
    xp = 30 + (perfect ? 10 : 0); S.units[L.d] = true; title = 'Контрольная пройдена!';
  } else {
    xp = 5 + L.correct; title = 'Повторение завершено';
    regenHearts(); if (S.hearts < MAX_HEARTS) S.hearts++;
  }
  xp = Math.max(xp, 1);
  addXP(xp); checkBadges(); save();
  const acc = Math.round(L.correct / Math.max(1, L.correct + L.wrong) * 100);
  view = 'done';
  full(`<div class="done-screen">
    <div style="color:var(--gold)">${k === 'test' ? I.trophy.replace('<svg', '<svg class="big-icon"') : I.star.replace('<svg', '<svg class="big-icon"')}</div>
    <h1>${title}</h1>
    ${k !== 'lesson' && k !== 'test' ? '<p class="muted">+1 сердце за тренировку</p>' : perfect ? '<p class="muted">Без единой ошибки!</p>' : ''}
    <div class="done-stats">
      <div class="ds" style="--c:var(--gold)"><div class="h">Опыт</div><div class="v">${I.bolt}${xp}</div></div>
      <div class="ds" style="--c:var(--green)"><div class="h">Точность</div><div class="v">${acc}%</div></div>
      <div class="ds" style="--c:var(--blue)"><div class="h">Время</div><div class="v">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</div></div>
    </div>
    <div class="card" style="width:100%;text-align:left"><div class="kv"><span>Цель дня</span><span class="mono">${Math.min(todayXP(), S.goal)} / ${S.goal} XP</span></div><div class="meter"><i style="width:${Math.min(1, todayXP() / S.goal) * 100}%;background:var(--orange)"></i></div><div class="kv"><span class="muted">Серия</span><span style="color:var(--orange)">${S.streak.count} дн.</span></div></div>
  </div>
  <button class="btn" data-home>Продолжить</button>`);
  confetti();
  L = null;
}
function renderNoHearts() {
  view = 'nohearts';
  const m = Math.ceil(nextHeartIn() / MIN);
  full(`<div class="done-screen">
    <div style="color:var(--heart)">${I.heart.replace('<svg', '<svg class="big-icon"')}</div>
    <h1 style="color:var(--red-ink)">Сердца закончились</h1>
    <p class="muted">Новое сердце через ${m} мин. Или пройди короткую тренировку: она не тратит сердца и вернёт одно.</p>
  </div>
  <div style="display:grid;gap:12px"><button class="btn blue" data-review>Тренировка: +1 сердце</button><button class="btn ghost" data-home>Не сейчас</button></div>`);
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
    <p class="muted small" style="margin:-6px 0 14px">Практика не тратит сердца и возвращает одно за каждую тренировку.</p>
    <div class="list">
      ${item('review', 'var(--blue)', I.target, 'Повторение', due ? due + ' вопросов пора повторить' : 'Слабые и новые вопросы', due || '', false)}
      ${item('weak', 'var(--red)', I.cross, 'Работа над ошибками', weak ? weak + ' вопросов с ошибками' : 'Ошибок пока нет', weak || '', !weak)}
      ${item('flash', 'var(--purple)', I.cards, 'Карточки', G.length + ' терминов и цифр' + (gDue ? ' · ' + gDue + ' к повторению' : ''), gDue || '', false)}
      ${item('notes', 'var(--green)', I.book, 'Конспект', 'Главное по каждому разделу', '', false)}
    </div>
    <h2 style="margin:24px 0 10px">Освоение подтем</h2>
    <div class="card">${UNITS.map(d => `<div style="display:grid;gap:6px"><div class="kv"><span>${esc(DOMAINS[d].name)}</span><span class="mono">${Math.round(domainMastery(d) * 100)}%</span></div><div class="meter"><i style="width:${domainMastery(d) * 100}%"></i></div></div>`).join('')}</div>`);
}

// flashcards
let F = null;
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
    const xp = F.ok; addXP(Math.max(1, xp)); regenHearts(); if (S.hearts < MAX_HEARTS) S.hearts++; checkBadges(); save();
    full(`<div class="done-screen"><div style="color:var(--purple)">${I.cards.replace('<svg', '<svg class="big-icon"')}</div><h1 style="color:var(--purple-d)">Карточки пройдены</h1><p class="muted">Помню: ${F.ok} из ${F.items.length} · +${Math.max(1, xp)} XP · +1 сердце</p></div><button class="btn" data-home>Продолжить</button>`);
    F = null; return;
  }
  const g = GBY[F.items[F.i]];
  full(`<div class="lesson-top"><button class="x" data-home aria-label="Выйти">${I.x}</button><div class="bar"><i style="width:${F.i / F.items.length * 100}%;background:var(--purple)"></i></div></div>
    <div class="lesson-body">
      <p class="qtype">${g.t} ${esc(TOPICS[g.t])}</p>
      <button class="tf-card" data-flip style="min-height:240px;align-content:center;text-align:center;font:inherit;color:inherit">
        <div class="term" style="font-size:26px">${esc(g.term)}</div>
        ${F.flip ? `<div style="font-size:17px">${esc(g.def)}</div>` : '<div class="muted">Вспомни, что это, и нажми на карточку</div>'}
      </button>
    </div>
    <div class="sheet"><div class="sheet-in">${F.flip ? `<div class="row"><button class="btn red" data-fl="0">Не помню</button><button class="btn" data-fl="1">Помню</button></div>` : `<button class="btn blue" data-flip>Показать ответ</button>`}</div></div>`);
}

// ── EXAM ──
function loadExam() { try { const e = JSON.parse(localStorage.getItem(LS_EXAM) || 'null'); return e && e.items && e.items.every(x => QBY[x.id]) ? e : null; } catch (e) { return null; } }
function storeExam() { try { localStorage.setItem(LS_EXAM, JSON.stringify(exam)); } catch (e) {} }
function clearExam() { try { localStorage.removeItem(LS_EXAM); } catch (e) {} }
function renderExamTab() {
  view = 'exam'; tab = 'exam';
  const r = readiness(), going = loadExam();
  const hist = S.exams.slice(-8).reverse().map(e => `<div class="kv" style="padding:8px 0;border-bottom:2px solid var(--line)"><span>${new Date(e.at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span><span class="mono">${Math.round(e.score * 100)}%</span><span class="pill ${e.score >= 0.7 ? 'ok' : 'no'}">${e.score >= 0.7 ? 'сдано' : 'не сдано'}</span></div>`).join('');
  page(`<h1 class="section-title">Пробный экзамен</h1>
    <div class="card">
      <div class="kv"><span>Прогноз балла сейчас</span><span class="mono" style="font-size:22px;font-weight:900;color:${r >= 0.7 ? 'var(--green-ink)' : 'var(--red-ink)'}">${Math.round(r * 100)}%</span></div>
      <div class="meter"><i style="width:${r * 100}%"></i><span class="pass"></span></div>
      <p class="muted small">Черта — порог 70%. Прогноз растёт, когда вопросы закрепляются в повторениях.</p>
    </div>
    <div class="card" style="margin-top:12px">
      <h3>Как на настоящем</h3>
      <p class="muted small">50 вопросов · 60 минут · Domain 1: 19, Domain 2: 20, Domain 3: 11. Ответы и разбор только в конце. Сердца не тратятся.</p>
      <button class="btn blue" data-exam>${going ? 'Продолжить экзамен' : 'Начать экзамен'}</button>
    </div>
    <div class="card" style="margin-top:12px">
      <h3>Сам экзамен NCA-AIIO</h3>
      <p class="muted small">Онлайн с наблюдателем через Certiverse, $125, на английском, сертификат на 2 года. Записываться стоит, когда стабильно берёшь 80%+ на пробных.</p>
      <div class="row"><a class="btn sm ghost" style="text-decoration:none" href="https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/" target="_blank" rel="noopener">Страница экзамена</a><a class="btn sm ghost" style="text-decoration:none" href="https://www.nvidia.com/en-us/training/academy/course-detail/?id=course%3A15139841" target="_blank" rel="noopener">Курс NVIDIA</a></div>
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
  if (el) { el.textContent = String(Math.floor(left / MIN)).padStart(2, '0') + ':' + String(Math.floor(left % MIN / 1000)).padStart(2, '0'); el.classList.toggle('low', left < 5 * MIN); }
  tickT = setTimeout(tick, 500);
}
function renderExam() {
  view = 'examrun';
  const it = exam.items[exam.i], q = QBY[it.id];
  const nAns = exam.items.filter(x => x.a !== null).length;
  const grid = exam.items.map((x, k) => `<button class="cell ${x.a !== null ? 'ans' : ''} ${x.f ? 'flag' : ''} ${k === exam.i ? 'cur' : ''}" data-cell="${k}">${k + 1}</button>`).join('');
  full(`<div class="lesson-top"><button class="x" data-home aria-label="Пауза">${I.x}</button><div class="bar"><i style="width:${nAns / exam.items.length * 100}%;background:var(--blue)"></i></div><span class="timer" id="timer">--:--</span></div>
    <div class="lesson-body" style="padding-bottom:150px">
      <div class="kv"><span class="qtype" style="color:var(--blue-d)">Вопрос ${exam.i + 1} из ${exam.items.length}</span><button class="btn sm ghost" style="flex:none" data-flag>${it.f ? '★ Отмечен' : '☆ Отметить'}</button></div>
      <div class="qtext en">${esc(q.text)}</div>
      <div class="choices">${it.order.map((oi, k) => `<button class="choice ${it.a === k ? 'sel' : ''}" data-xa="${k}"><span class="n">${String.fromCharCode(65 + k)}</span><span>${esc(q.opts[oi])}</span></button>`).join('')}</div>
      <button class="btn sm ghost" style="justify-self:start" data-grid>${exam.grid ? 'Скрыть карту вопросов' : 'Карта вопросов · отвечено ' + nAns + '/50'}</button>
      ${exam.grid ? `<div class="grid50">${grid}</div>` : ''}
      ${exam.confirm ? `<div class="confirm"><span>${exam.items.length - nAns ? 'Без ответа: ' + (exam.items.length - nAns) + '. ' : ''}Завершить экзамен?</span><div class="row"><button class="btn red" data-fin-yes>Завершить</button><button class="btn ghost" data-fin-no>Назад</button></div></div>` : `<button class="btn sm ghost" style="justify-self:start;color:var(--red-ink)" data-fin>Завершить экзамен</button>`}
    </div>
    <div class="sheet"><div class="sheet-in"><div class="row"><button class="btn ghost" data-xprev ${exam.i === 0 ? 'disabled' : ''}>Назад</button><button class="btn blue" data-xnext ${exam.i === exam.items.length - 1 ? 'disabled' : ''}>Далее</button></div></div></div>`);
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
  addXP(Math.max(1, xp)); checkBadges(); save(); clearExam(); exam = null;
  view = 'examres';
  const pass = score >= 0.7;
  full(`<div class="lesson-top"><button class="x" data-home aria-label="Закрыть">${I.x}</button><h2 style="font-size:18px">Результат</h2></div>
    <div style="display:grid;gap:14px;padding-bottom:20px">
      <div class="card" style="text-align:center;justify-items:center"><div style="font-size:48px;font-weight:900;color:${pass ? 'var(--green-ink)' : 'var(--red-ink)'}">${Math.round(score * 100)}%</div><span class="pill ${pass ? 'ok' : 'no'}">${pass ? 'Сдано' : 'Не сдано'} · порог 70%</span><p class="muted small">${correct} из ${res.length} верно · +${Math.max(1, xp)} XP</p></div>
      <div class="card">${UNITS.map(d => { const [c, n] = by[d], p = n ? c / n : 0; return `<div style="display:grid;gap:4px"><div class="kv"><span>${esc(DOMAINS[d].name)}</span><span class="mono">${c}/${n}</span></div><div class="meter"><i style="width:${p * 100}%;background:var(--${p >= 0.7 ? 'green' : 'red'})"></i><span class="pass"></span></div></div>`; }).join('')}
        <div class="grid50" style="margin-top:6px">${res.map((r, k) => `<span class="cell ${r.ok ? 'ok' : 'no'}">${k + 1}</span>`).join('')}</div></div>
      ${res.some(r => !r.ok) ? `<h2>Разбор ошибок</h2>${res.filter(r => !r.ok).map(r => { const q = QBY[r.id]; const y = r.x.a !== null ? q.opts[r.x.order[r.x.a]] : null; return `<div class="rv"><span class="tag">${q.t} ${esc(TOPICS[q.t])}</span><b>${esc(q.text)}</b>${y ? `<span class="no">${esc(y)}</span>` : '<span class="muted">Без ответа</span>'}<span class="ok">✓ ${esc(q.opts[0])}</span><span class="muted">${esc(q.ex)}</span></div>`; }).join('')}` : ''}
      <button class="btn" data-weak>Работа над ошибками</button>
    </div>`);
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
      <div class="stat-box"><b style="color:var(--orange)">${I.fire}${streakAlive() ? S.streak.count : 0}</b><span>Серия дней · рекорд ${S.streak.best || 0}</span></div>
      <div class="stat-box"><b style="color:var(--gold-d)">${I.bolt}${todayXP()}</b><span>XP сегодня из ${S.goal}</span></div>
      <div class="stat-box"><b style="color:var(--blue-d)">${S.stats.lessons}</b><span>Уроков пройдено</span></div>
      <div class="stat-box"><b style="color:var(--green-ink)">${acc}%</b><span>Точность ответов</span></div>
    </div>
    <h2 style="margin:22px 0 10px">Цель дня</h2>
    <div class="goal-opts">${[10, 20, 30, 50].map(g => `<button class="${S.goal === g ? 'on' : ''}" data-goal="${g}">${g} XP</button>`).join('')}</div>
    <p class="muted small" style="margin-top:6px">Один урок дает около 15 XP. 30 XP — это 2 урока, примерно 10 минут.</p>
    ${!standalone ? `<h2 style="margin:22px 0 10px">Установить на телефон</h2><div class="card">${deferredPrompt ? '<button class="btn blue" data-install>Установить приложение</button>' : isIOS ? '<p class="small">В Safari нажми «Поделиться», затем «На экран Домой». Приложение откроется без адресной строки и будет работать без интернета.</p>' : '<p class="small">В меню браузера выбери «Установить приложение» или «Добавить на главный экран».</p>'}</div>` : ''}
    <h2 style="margin:22px 0 4px">Достижения <span class="muted mono small">${S.badges.length}/${BADGES.length}</span></h2>
    <div>${BADGES.map(([id, n, d]) => `<div class="ach ${S.badges.includes(id) ? 'got' : ''}"><span class="medal">${I.star}</span><span>${esc(n)}<small>${esc(d)}</small></span></div>`).join('')}</div>
    <h2 style="margin:22px 0 10px">Настройки</h2>
    <div class="card">
      <button class="btn ghost" data-unlock>${S.unlockAll ? 'Вернуть последовательный путь' : 'Открыть все уроки'}</button>
      <p class="muted small">Прогресс хранится на этом устройстве. Чтобы перенести на другое, скопируй код и вставь его там.</p>
      <div class="row"><button class="btn sm ghost" data-export>Скопировать код</button><button class="btn sm ghost" data-import>Вставить код</button></div>
      <textarea id="xfer" placeholder="Здесь появится код прогресса, или вставь сюда код с другого устройства" hidden></textarea>
      <button class="btn sm blue" data-import-go hidden id="importGo">Загрузить прогресс</button>
      ${resetAsk ? `<div class="confirm"><span>Удалить весь прогресс на этом устройстве?</span><div class="row"><button class="btn red" data-reset-yes>Удалить</button><button class="btn ghost" data-reset-no>Отмена</button></div></div>` : '<button class="btn sm ghost" style="color:var(--red-ink)" data-reset>Сбросить прогресс</button>'}
    </div>
    <p class="muted small" style="margin-top:16px;text-align:center">Неофициальный тренажёр по открытой программе экзамена NVIDIA NCA-AIIO.</p>`);
}

// ── router ──
function home() { openNode = null; ({ learn: renderLearn, practice: renderPractice, exam: renderExamTab, profile: renderProfile })[tab](); window.scrollTo(0, 0); }

$app.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  const d = b.dataset;
  if (d.tab) { tab = d.tab; resetAsk = false; return home(); }
  if (d.node) { openNode = openNode === d.node ? null : d.node; return renderLearn(); }
  if (d.start) {
    regenHearts(); if (!S.hearts) return renderNoHearts();
    if (!S.introSeen[d.start] && !d.skipintro && G.some(g => g.t === d.start)) { S.introSeen[d.start] = 1; save(); return renderTheory(d.start, true); }
    S.introSeen[d.start] = 1; save(); return startLesson(d.start);
  }
  if (d.theory) return renderTheory(d.theory, false);
  if (d.test) { regenHearts(); if (!S.hearts) return renderNoHearts(); return startTest(d.test); }
  if (d.notes !== undefined) return renderNotes(d.notes || notesD);
  if ('back' in d || 'home' in d) { if (view === 'examrun') clearTimeout(tickT); L = null; return home(); }
  if ('quit' in d) { L = null; return home(); }
  if (d.ch !== undefined) { if (!L.fb) { L.sel = +d.ch; renderLesson(); } return; }
  if ('check' in d) return check();
  if ('next' in d) return next();
  if (d.mt) return matchTap('t', d.mt);
  if (d.md) return matchTap('d', d.md);
  if ('review' in d) return startReview('review');
  if ('weak' in d) return startReview('weak');
  if ('flash' in d) return startFlash();
  if ('flip' in d) { F.flip = !F.flip; return renderFlash(); }
  if (d.fl !== undefined) { const id = F.items[F.i], ok = d.fl === '1'; grade(id, ok); S.stats.flash++; if (ok) F.ok++; F.i++; F.flip = false; save(); return renderFlash(); }
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
  if ('resetYes' in d) { S = fresh(); clearExam(); resetAsk = false; save(); toast('Прогресс сброшен'); return renderProfile(); }
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
document.addEventListener('visibilitychange', () => { if (!document.hidden && ['learn', 'practice', 'exam', 'profile'].includes(view)) home(); });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

regenHearts(); save();
renderLearn();
})();
