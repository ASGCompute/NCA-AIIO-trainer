// Figure viewer, loaded on first use. Opens a figure from figs/<id>.js over the app: numbered pins name the parts,
// a step player walks through the process (what happens first, where the data goes), green packets run along the
// links of whatever is picked, and figures with assemblies come apart. Calm springs, painter keys from the build.
(function () {
  const SPRING = { stagger: 0.035, stiffness: 64, damping: 14.2, substeps: 4 };
  const STEP_MS = 4800, SPEED = 70, GAP = 34;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const NS = 'http://www.w3.org/2000/svg';
  const loading = {};
  const load = (id) => loading[id] || (loading[id] = new Promise((ok, no) => {
    if (window.FIGD && window.FIGD[id]) return ok();
    const s = document.createElement('script'); s.src = 'figs/' + id + '.js'; s.onload = () => ok(); s.onerror = () => { delete loading[id]; no(new Error('load')); }; document.head.appendChild(s);
  }));
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
  const PAUSE = '<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>';
  const PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
  const NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  let cur = null, skipPop = false;

  function close(viaHistory) {
    if (!cur) return;
    const c = cur; cur = null;
    cancelAnimationFrame(c.frame); cancelAnimationFrame(c.flowFrame); clearTimeout(c.timer);
    document.removeEventListener('keydown', c.onKey, true); removeEventListener('resize', c.onResize);
    c.root.remove(); document.documentElement.style.overflow = '';
    if (c.opener && c.opener.isConnected) c.opener.focus({ preventScroll: true });
    if (!viaHistory && history.state && history.state.fig) { skipPop = true; history.back(); }
  }

  async function open(id, opts = {}) {
    const meta = FIGS[id]; if (!meta) return;
    if (cur) close();
    const steps = meta.steps || [];
    const root = document.createElement('div');
    root.className = 'figv'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'figv-t');
    const chips = (meta.ex ? `<button class="figv-ex" data-figex aria-pressed="false">${tr('Разобрать')}</button>` : '') + meta.nodes.map(([n, name], i) => `<button data-fignode="${n}" aria-pressed="false"><i>${i + 1}</i>${esc(name)}</button>`).join('');
    const player = steps.length ? `<div class="figv-play">
        <div class="figv-ctl"><button class="figv-pl" data-figplay aria-pressed="false">${PLAY}<span>${tr('Запустить процесс')}</span></button>
        <button class="figv-nav" data-figprev aria-label="${tr('Назад')}">${PREV}</button><input class="figv-rng" type="range" min="0" max="${steps.length - 1}" step="1" value="0" aria-label="${tr('Шаг')}"><button class="figv-nav" data-fignext aria-label="${tr('Дальше')}">${NEXT}</button>
        <span class="figv-k tnum"></span></div>
        <p class="figv-say" aria-live="polite">${tr('Нажмите «Запустить процесс», чтобы увидеть по шагам, как это работает.')}</p></div>` : '';
    root.innerHTML = `<div class="figv-in"><div class="figv-top"><button class="x" data-figclose aria-label="${tr('Закрыть')}">${X}</button><h2 id="figv-t">${esc(meta.title)}</h2><span class="tnum">${meta.t}</span></div>
      <div class="figv-card iso" data-theme="light"><div class="figv-stage" tabindex="0" aria-label="${tr('Стрелки выбирают деталь')}"><div class="figv-msg">${tr('Схема загружается…')}</div></div><div class="figv-read" aria-live="polite"><b></b><span>${tr('Наведите или нажмите на деталь')}</span></div></div>
      ${player}<div class="figv-chips" role="group" aria-label="${tr('Детали')}">${chips}</div><p class="figv-cap">${esc(meta.cap)}</p></div>`;
    document.body.appendChild(root);
    document.documentElement.style.overflow = 'hidden';
    const c = cur = { id, meta, steps, root, opener: document.activeElement, frame: 0, flowFrame: 0, timer: 0, sel: null, apart: false, step: -1, playing: false, flow: [] };
    try { history.pushState({ fig: 1 }, ''); } catch (e) {}
    c.onKey = (e) => {
      if (cur !== c) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); return close(); }
      if (!root.contains(document.activeElement) || document.activeElement.type === 'range') return;
      const ids = meta.nodes.map((n) => n[0]), i = ids.indexOf(c.sel);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pause(c); pick(c, ids[(i + 1) % ids.length]); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pause(c); pick(c, ids[(i + ids.length - 1) % ids.length]); }
      else if ((e.key === ' ' || e.key === 'Enter') && document.activeElement.classList.contains('figv-stage') && meta.ex) { e.preventDefault(); toggle(c, !c.apart); }
    };
    document.addEventListener('keydown', c.onKey, true);
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b && 'figclose' in b.dataset) return close();
      if (b && 'figex' in b.dataset) { pause(c); return toggle(c, !c.apart); }
      if (b && 'figplay' in b.dataset) return c.playing ? pause(c) : play(c);
      if (b && 'figprev' in b.dataset) { pause(c); return go(c, Math.max(0, c.step - 1)); }
      if (b && 'fignext' in b.dataset) { pause(c); return go(c, Math.min(steps.length - 1, c.step + 1)); }
      if (b && b.dataset.fignode) { pause(c); return pick(c, c.sel === b.dataset.fignode ? null : b.dataset.fignode); }
      if (b && b.dataset.figpin) { pause(c); return pick(c, c.sel === b.dataset.figpin ? null : b.dataset.figpin); }
      const it = e.target.closest('.it[data-s]'); if (it && meta.nodes.some((n) => n[0] === it.dataset.s)) { pause(c); pick(c, it.dataset.s); }
      else if (e.target === root || e.target.classList.contains('figv-in')) close();
    });
    const rng = root.querySelector('.figv-rng');
    if (rng) rng.addEventListener('input', () => { pause(c); go(c, +rng.value); });
    root.querySelector('[data-figclose]').focus({ preventScroll: true });
    try { await load(id); } catch (e) { if (cur === c) root.querySelector('.figv-msg').textContent = tr('Не удалось загрузить схему. Проверьте интернет и попробуйте ещё раз.'); return; }
    if (cur !== c) return;
    mount(c);
    if (opts.onSeen) opts.onSeen(id);
    const start = () => {
      if (cur !== c) return;
      if (opts.node) { if (meta.ex) toggle(c, true); pick(c, opts.node); }
      else if (steps.length) play(c);
      else if (meta.ex) toggle(c, true);
    };
    if (still.matches) start(); else setTimeout(start, 450);
  }

  function mount(c) {
    const d = window.FIGD[c.id];
    const stage = c.root.querySelector('.figv-stage');
    stage.innerHTML = d.svg + '<div class="figv-pins"></div>';
    const svg = stage.querySelector('svg');
    c.svg = svg; c.vb = svg.viewBox.baseVal;
    const group = svg.querySelector('.fg-items');
    c.group = group;
    c.nodes = [...group.children].map((el) => {
      const t = el.dataset.t ? el.dataset.t.split(',').map(Number) : null;
      return { el, piece: el.dataset.p || null, sel: el.dataset.s || null, key: +el.dataset.k, lift: +(el.dataset.l || 0), t, shown: '' };
    });
    c.order = c.nodes.map((_, i) => i);
    c.springs = Object.fromEntries(d.st.map((p) => [p, { x: 0, v: 0, target: 0, pending: null }]));
    c.stagger = d.st; c.clock = 0; c.last = 0;
    c.fx = document.createElementNS(NS, 'g'); c.fx.setAttribute('class', 'figv-fx'); svg.appendChild(c.fx);
    measure(c);
    pins(c);
    stage.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; const it = e.target.closest && e.target.closest('.it[data-s]'); if (it && it.dataset.s !== c.sel && !c.playing && c.meta.nodes.some((n) => n[0] === it.dataset.s)) pick(c, it.dataset.s); });
    c.onResize = () => place(c); addEventListener('resize', c.onResize);
  }

  // Every link the figure draws, as polylines in figure units with the item that carries it (so the packets follow
  // the part when the machine comes apart): wires are rebuilt leg by leg from their route ids, traces are sampled.
  function measure(c) {
    const byNode = new Map(c.nodes.map((n) => [n.el, n]));
    const routes = new Map(), lines = [];
    const tmp = document.createElementNS(NS, 'path'); tmp.setAttribute('visibility', 'hidden'); c.fx.appendChild(tmp);
    for (const n of c.nodes) {
      if (!n.sel) continue;
      for (const p of n.el.querySelectorAll('path[data-w]')) {
        if (p.dataset.r) {
          const m = p.getAttribute('d').match(/-?[\d.]+/g); if (!m || m.length < 4) continue;
          const key = n.sel + '|' + p.dataset.r;
          if (!routes.has(key)) routes.set(key, { sel: n.sel, legs: [] });
          routes.get(key).legs.push({ i: +p.dataset.li, a: [+m[0], +m[1]], b: [+m[2], +m[3]], n });
        } else {
          for (const sub of p.getAttribute('d').split(/(?=M)/)) {
            if (!/[LCQAHVlcqahv]/.test(sub)) continue;
            tmp.setAttribute('d', sub);
            let len = 0; try { len = tmp.getTotalLength(); } catch (e) {}
            if (len < 6) continue;
            const k = Math.max(2, Math.ceil(len / 6)), pts = [];
            for (let j = 0; j <= k; j++) { const q = tmp.getPointAtLength((len * j) / k); pts.push([q.x, q.y, n]); }
            lines.push({ sel: n.sel, pts });
          }
        }
      }
    }
    tmp.remove();
    for (const r of routes.values()) {
      r.legs.sort((a, b) => a.i - b.i);
      const pts = [];
      for (const l of r.legs) { if (!pts.length) pts.push([...l.a, l.n]); pts.push([...l.b, l.n]); }
      lines.push({ sel: r.sel, pts });
    }
    for (const l of lines) { let s = 0; l.cum = [0]; for (let i = 1; i < l.pts.length; i++) { s += Math.hypot(l.pts[i][0] - l.pts[i - 1][0], l.pts[i][1] - l.pts[i - 1][1]); l.cum.push(s); } l.len = s; }
    c.lines = lines.filter((l) => l.len > 4);
  }

  const share = (c, p) => (p && c.springs[p] ? c.springs[p].x : 0);
  const shift = (c, n) => (n && n.t ? [n.t[0] * share(c, n.piece), n.t[1] * share(c, n.piece)] : [0, 0]);

  // Numbered pins: one per part, at the top of the part, kept clear of each other.
  function pins(c) {
    const host = c.root.querySelector('.figv-pins');
    c.pins = [];
    c.meta.nodes.forEach(([id, name], i) => {
      const all = c.nodes.filter((n) => n.sel === id); if (!all.length) return;
      const boxes = [];
      for (const n of all) { let b; try { b = n.el.getBBox(); } catch (e) { continue; } if (b.width || b.height) boxes.push({ n, b, a: b.width * b.height }); }
      if (!boxes.length) return;
      // anchor on one recognisable piece: prefer parts that stay put, skip trays and boards that span the whole node
      const fixed = boxes.filter((o) => !o.n.t), pool = fixed.length ? fixed : boxes;
      const ux0 = Math.min(...pool.map((o) => o.b.x)), ux1 = Math.max(...pool.map((o) => o.b.x + o.b.width)), uy0 = Math.min(...pool.map((o) => o.b.y)), uy1 = Math.max(...pool.map((o) => o.b.y + o.b.height));
      const span = (ux1 - ux0) * (uy1 - uy0);
      const parts = pool.length > 1 ? pool.filter((o) => o.a < span * 0.3) : pool;
      const best = (parts.length ? parts : pool).reduce((m, o) => (o.a > m.a ? o : m));
      let x = best.b.x + best.b.width / 2, y = best.b.y + Math.min(9, best.b.height * 0.35);
      for (let k = 0; k < 8 && c.pins.some((p) => Math.abs(p.x - x) < 22 && Math.abs(p.y - y) < 18); k++) { x += 14; y += 12; }
      const el = document.createElement('button');
      el.className = 'figv-pin'; el.dataset.figpin = id; el.setAttribute('aria-label', name);
      el.innerHTML = `<i>${i + 1}</i><span>${esc(name)}</span>`;
      host.appendChild(el);
      c.pins.push({ id, x, y, n: best.n, el });
    });
    place(c);
  }

  function place(c) {
    if (!c.pins) return;
    for (const p of c.pins) {
      const [dx, dy] = shift(c, p.n);
      p.el.style.left = (((p.x + dx - c.vb.x) / c.vb.width) * 100).toFixed(2) + '%';
      p.el.style.top = (((p.y + dy - c.vb.y) / c.vb.height) * 100).toFixed(2) + '%';
    }
  }

  function pick(c, id, flow) {
    c.sel = id;
    if (c.nodes) for (const n of c.nodes) {
      const on = !!id && n.sel === id;
      for (const s of n.el.querySelectorAll('.iso-solid')) s.toggleAttribute('data-lit', on);
      for (const w of n.el.querySelectorAll('.iso-line[data-w], .iso-dots[data-w]')) { if (!w.dataset.t0) w.dataset.t0 = w.getAttribute('data-tone') || 'lo'; w.setAttribute('data-tone', on ? 'lit' : w.dataset.t0); }
    }
    for (const b of c.root.querySelectorAll('[data-fignode]')) b.setAttribute('aria-pressed', String(b.dataset.fignode === id));
    for (const b of c.root.querySelectorAll('[data-figpin]')) b.setAttribute('aria-pressed', String(b.dataset.figpin === id));
    const node = c.meta.nodes.find((n) => n[0] === id);
    const r = c.root.querySelector('.figv-read');
    r.querySelector('b').textContent = node ? node[1] : '';
    r.querySelector('span').textContent = node ? node[2] : tr('Наведите или нажмите на деталь');
    setFlow(c, flow || (id ? [id] : []));
  }

  // ---- the process player ----
  function go(c, i) {
    const st = c.steps[i]; if (!st) return;
    c.step = i;
    const [node, ex, flow, text] = st;
    if (ex !== -1 && c.meta.ex && !!ex !== c.apart) toggle(c, !!ex);
    pick(c, node || null, flow.length ? flow : null);
    const rng = c.root.querySelector('.figv-rng'); if (rng) { rng.value = i; rng.style.setProperty('--p', c.steps.length > 1 ? (i / (c.steps.length - 1)) * 100 + '%' : '100%'); }
    c.root.querySelector('.figv-k').textContent = `${tr('Шаг')} ${i + 1} / ${c.steps.length}`;
    const say = c.root.querySelector('.figv-say'); say.textContent = text; say.classList.remove('in'); void say.offsetWidth; say.classList.add('in');
  }
  function play(c) {
    if (!c.steps.length) return;
    c.playing = true; setPlay(c);
    go(c, c.step < 0 || c.step >= c.steps.length - 1 ? 0 : c.step + 1);
    schedule(c);
  }
  function schedule(c) {
    clearTimeout(c.timer);
    c.timer = setTimeout(() => {
      if (cur !== c || !c.playing) return;
      if (c.step >= c.steps.length - 1) return pause(c);
      go(c, c.step + 1); schedule(c);
    }, STEP_MS);
  }
  function pause(c) { if (!c.playing) return; c.playing = false; clearTimeout(c.timer); setPlay(c); }
  function setPlay(c) {
    const b = c.root.querySelector('[data-figplay]'); if (!b) return;
    b.setAttribute('aria-pressed', String(c.playing));
    b.innerHTML = c.playing ? `${PAUSE}<span>${tr('Пауза')}</span>` : `${PLAY}<span>${c.step < 0 || c.step >= c.steps.length - 1 ? tr('Запустить процесс') : tr('Продолжить')}</span>`;
  }

  // ---- packets along the links ----
  function setFlow(c, sels) {
    if (!c.lines) return;
    const want = new Set(sels);
    c.flow = c.lines.filter((l) => want.has(l.sel));
    c.fx.textContent = '';
    c.dots = [];
    for (const l of c.flow) {
      const k = Math.max(1, Math.round(l.len / GAP));
      for (let j = 0; j < k; j++) {
        const e = document.createElementNS(NS, 'circle'); e.setAttribute('r', '2.7'); e.setAttribute('class', 'figv-pk');
        c.fx.appendChild(e); c.dots.push({ l, off: (j * l.len) / k, e });
      }
    }
    c.t0 = performance.now();
    cancelAnimationFrame(c.flowFrame); c.flowFrame = 0;
    if (c.dots.length) drawFlow(c, c.t0);
  }
  function at(l, s) {
    let i = 1; while (i < l.cum.length - 1 && l.cum[i] < s) i++;
    const a = l.pts[i - 1], b = l.pts[i], seg = l.cum[i] - l.cum[i - 1] || 1, f = Math.min(1, Math.max(0, (s - l.cum[i - 1]) / seg));
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, f < 0.5 ? a[2] : b[2]];
  }
  function drawFlow(c, now) {
    if (cur !== c) return;
    const t = still.matches ? 0 : ((now - c.t0) / 1000) * SPEED;
    for (const d of c.dots) {
      const s = (d.off + t) % d.l.len, [x, y, n] = at(d.l, s), [dx, dy] = shift(c, n);
      d.e.setAttribute('cx', (x + dx).toFixed(1)); d.e.setAttribute('cy', (y + dy).toFixed(1));
    }
    c.flowFrame = still.matches ? 0 : requestAnimationFrame((tt) => drawFlow(c, tt));
  }

  // ---- taking it apart ----
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
    for (const n of c.nodes) {
      if (!n.t) continue;
      const x = share(c, n.piece), tr2 = x ? `translate(${(n.t[0] * x).toFixed(2)} ${(n.t[1] * x).toFixed(2)})` : '';
      if (tr2 !== n.shown) { n.shown = tr2; tr2 ? n.el.setAttribute('transform', tr2) : n.el.removeAttribute('transform'); }
    }
    const next = c.nodes.map((_, i) => i).sort((a, b) => c.nodes[a].key + c.nodes[a].lift * share(c, c.nodes[a].piece) - (c.nodes[b].key + c.nodes[b].lift * share(c, c.nodes[b].piece)));
    if (next.some((v, i) => v !== c.order[i])) { const f = document.createDocumentFragment(); for (const i of next) f.appendChild(c.nodes[i].el); c.group.appendChild(f); c.order = next; }
    place(c);
    if (still.matches && c.dots && c.dots.length) drawFlow(c, 0);
    c.frame = moving ? requestAnimationFrame((t) => tick(c, t)) : 0;
  }

  window.FIGV = { open, close, isOpen: () => !!cur, popped: () => { if (skipPop) { skipPop = false; return true; } if (!cur) return false; close(true); return true; } };
})();
