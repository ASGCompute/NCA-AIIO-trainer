// Figure viewer, loaded on first use. Opens a figure from figs/<id>.js over the app: pick a part to light it
// and read its numbers, take the machine apart when the figure has assemblies. Calm springs, keys from the build.
(function () {
  const SPRING = { stagger: 0.035, stiffness: 64, damping: 14.2, substeps: 4 };
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const loading = {};
  const load = (id) => loading[id] || (loading[id] = new Promise((ok, no) => {
    if (window.FIGD && window.FIGD[id]) return ok();
    const s = document.createElement('script'); s.src = 'figs/' + id + '.js'; s.onload = () => ok(); s.onerror = () => { delete loading[id]; no(new Error('load')); }; document.head.appendChild(s);
  }));
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  let cur = null, skipPop = false;

  function close(viaHistory) {
    if (!cur) return;
    const c = cur; cur = null;
    cancelAnimationFrame(c.frame); document.removeEventListener('keydown', c.onKey, true);
    c.root.remove(); document.documentElement.style.overflow = '';
    if (c.opener && c.opener.isConnected) c.opener.focus({ preventScroll: true });
    if (!viaHistory && history.state && history.state.fig) { skipPop = true; history.back(); }
  }

  async function open(id, opts = {}) {
    const meta = FIGS[id]; if (!meta) return;
    if (cur) close();
    const root = document.createElement('div');
    root.className = 'figv'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'figv-t');
    const chips = (meta.ex ? `<button class="figv-ex" data-figex aria-pressed="false">${tr('Разобрать')}</button>` : '') + meta.nodes.map(([n, name]) => `<button data-fignode="${n}" aria-pressed="false">${esc(name)}</button>`).join('');
    root.innerHTML = `<div class="figv-in"><div class="figv-top"><button class="x" data-figclose aria-label="${tr('Закрыть')}">${X}</button><h2 id="figv-t">${esc(meta.title)}</h2><span class="tnum">${meta.t}</span></div>
      <div class="figv-card iso" data-theme="light"><div class="figv-stage" tabindex="0" aria-label="${tr('Стрелки выбирают деталь')}"><div class="figv-msg">${tr('Схема загружается…')}</div></div><div class="figv-read" aria-live="polite"><b></b><span>${tr('Наведите или нажмите на деталь')}</span></div></div>
      <div class="figv-chips" role="group" aria-label="${tr('Детали')}">${chips}</div><p class="figv-cap">${esc(meta.cap)}</p></div>`;
    document.body.appendChild(root);
    document.documentElement.style.overflow = 'hidden';
    const c = cur = { id, meta, root, opener: document.activeElement, frame: 0, sel: null, apart: false, skipPop: false };
    try { history.pushState({ fig: 1 }, ''); } catch (e) {}
    c.onKey = (e) => {
      if (cur !== c) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); return close(); }
      if (!root.contains(document.activeElement)) return;
      const ids = meta.nodes.map((n) => n[0]), i = ids.indexOf(c.sel);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select(c, ids[(i + 1) % ids.length]); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select(c, ids[(i + ids.length - 1) % ids.length]); }
      else if ((e.key === ' ' || e.key === 'Enter') && document.activeElement.classList.contains('figv-stage') && meta.ex) { e.preventDefault(); toggle(c, !c.apart); }
    };
    document.addEventListener('keydown', c.onKey, true);
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b && 'figclose' in b.dataset) return close();
      if (b && 'figex' in b.dataset) return toggle(c, !c.apart);
      if (b && b.dataset.fignode) return select(c, c.sel === b.dataset.fignode ? null : b.dataset.fignode);
      const it = e.target.closest('.it[data-s]'); if (it) select(c, it.dataset.s);
      else if (e.target === root || e.target.classList.contains('figv-in')) close();
    });
    root.querySelector('[data-figclose]').focus({ preventScroll: true });
    try { await load(id); } catch (e) { if (cur === c) root.querySelector('.figv-msg').textContent = tr('Не удалось загрузить схему. Проверьте интернет и попробуйте ещё раз.'); return; }
    if (cur !== c) return;
    mount(c);
    if (opts.onSeen) opts.onSeen(id);
    const go = () => { if (cur !== c) return; if (meta.ex) toggle(c, true); if (opts.node) select(c, opts.node); };
    if (still.matches) go(); else setTimeout(go, 450);
  }

  function mount(c) {
    const d = window.FIGD[c.id];
    const stage = c.root.querySelector('.figv-stage');
    stage.innerHTML = d.svg;
    const group = stage.querySelector('.fg-items');
    c.group = group;
    c.nodes = [...group.children].map((el) => {
      const t = el.dataset.t ? el.dataset.t.split(',').map(Number) : null;
      return { el, piece: el.dataset.p || null, sel: el.dataset.s || null, key: +el.dataset.k, lift: +(el.dataset.l || 0), t, shown: '' };
    });
    c.order = c.nodes.map((_, i) => i);
    c.springs = Object.fromEntries(d.st.map((p) => [p, { x: 0, v: 0, target: 0, pending: null }]));
    c.stagger = d.st; c.clock = 0; c.last = 0;
    stage.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; const it = e.target.closest && e.target.closest('.it[data-s]'); if (it && it.dataset.s !== c.sel) select(c, it.dataset.s); });
  }

  function select(c, id) {
    c.sel = id;
    if (c.nodes) for (const n of c.nodes) {
      const on = !!id && n.sel === id;
      for (const s of n.el.querySelectorAll('.iso-solid')) s.toggleAttribute('data-lit', on);
      for (const w of n.el.querySelectorAll('.iso-line[data-w], .iso-dots[data-w]')) { if (!w.dataset.t0) w.dataset.t0 = w.getAttribute('data-tone') || 'lo'; w.setAttribute('data-tone', on ? 'lit' : w.dataset.t0); }
    }
    for (const b of c.root.querySelectorAll('[data-fignode]')) b.setAttribute('aria-pressed', String(b.dataset.fignode === id));
    const node = c.meta.nodes.find((n) => n[0] === id);
    const r = c.root.querySelector('.figv-read');
    r.querySelector('b').textContent = node ? node[1] : '';
    r.querySelector('span').textContent = node ? node[2] : tr('Наведите или нажмите на деталь');
  }

  function toggle(c, value) {
    if (!c.springs) return;
    c.apart = value; const goal = value ? 1 : 0; let n = 0;
    for (const id of value ? c.stagger : [...c.stagger].reverse()) { const s = c.springs[id]; if (s.target === goal) s.pending = null; else s.pending = { value: goal, at: c.clock + n++ * SPRING.stagger }; }
    const b = c.root.querySelector('[data-figex]'); if (b) { b.setAttribute('aria-pressed', String(value)); b.textContent = value ? tr('Собрать') : tr('Разобрать'); }
    if (!c.frame) { c.last = 0; c.frame = requestAnimationFrame((t) => tick(c, t)); }
  }

  function tick(c, now) {
    if (cur !== c) return;
    const dt = c.last ? Math.min((now - c.last) / 1000, 1 / 30) : 1 / 60; c.last = now; c.clock += dt;
    let moving = false;
    for (const s of Object.values(c.springs)) {
      if (s.pending && c.clock >= s.pending.at) { s.target = s.pending.value; s.pending = null; }
      if (still.matches) { s.x = s.target; s.v = 0; }
      else for (let i = 0; i < SPRING.substeps; i++) { const h = dt / SPRING.substeps; s.v += ((s.target - s.x) * SPRING.stiffness - s.v * SPRING.damping) * h; s.x += s.v * h; }
      if (Math.abs(s.target - s.x) < 1e-3 && Math.abs(s.v) < 1e-3) { s.x = s.target; s.v = 0; }
      if (s.pending || s.x !== s.target) moving = true;
    }
    const share = (p) => (p && c.springs[p] ? c.springs[p].x : 0);
    for (const n of c.nodes) {
      if (!n.t) continue;
      const x = share(n.piece), tr2 = x ? `translate(${(n.t[0] * x).toFixed(2)} ${(n.t[1] * x).toFixed(2)})` : '';
      if (tr2 !== n.shown) { n.shown = tr2; tr2 ? n.el.setAttribute('transform', tr2) : n.el.removeAttribute('transform'); }
    }
    const next = c.nodes.map((_, i) => i).sort((a, b) => c.nodes[a].key + c.nodes[a].lift * share(c.nodes[a].piece) - (c.nodes[b].key + c.nodes[b].lift * share(c.nodes[b].piece)));
    if (next.some((v, i) => v !== c.order[i])) { const f = document.createDocumentFragment(); for (const i of next) f.appendChild(c.nodes[i].el); c.group.appendChild(f); c.order = next; }
    c.frame = moving ? requestAnimationFrame((t) => tick(c, t)) : 0;
  }

  window.FIGV = { open, close, isOpen: () => !!cur, popped: () => { if (skipPop) { skipPop = false; return true; } if (!cur) return false; close(true); return true; } };
})();
