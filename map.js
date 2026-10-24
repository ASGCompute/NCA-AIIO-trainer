// Tycoon map data: one data-center object per syllabus topic, plus the NVIDIA certification ladder.
const ROOMS = [
  { d: 'd1', name: 'AI-лаборатория', sub: 'Essential AI Knowledge' },
  { d: 'd2', name: 'Машинный зал', sub: 'AI Infrastructure' },
  { d: 'd3', name: 'Центр управления', sub: 'AI Operations' },
];
// topic → object on the map. pf = PFLOPS added per level.
const OBJ = {
  '1.1': { k: 'stack', name: 'Терминал стека ПО', pf: 2, fact: 'Драйвер → CUDA → CUDA‑X (cuDNN, NCCL) → фреймворки → NIM и Triton.' },
  '1.2': { k: 'train', name: 'Кластер обучения и сервер инференса', pf: 6, fact: 'Обучение: forward + backward на многих GPU. Инференс: только forward, важна задержка.' },
  '1.3': { k: 'neural', name: 'Нейросеть и RAG-база', pf: 3, fact: 'AI ⊃ ML ⊃ DL. RAG подмешивает документы из векторной базы в промпт LLM.' },
  '1.4': { k: 'data', name: 'Озеро данных', pf: 2, fact: 'Рост AI держится на трёх китах: данные, GPU и алгоритмы вроде трансформеров.' },
  '1.5': { k: 'robot', name: 'Демо-стенд отраслей', pf: 2, fact: 'Clara — медицина, Isaac — роботы, Metropolis — видео, DRIVE — авто.' },
  '1.6': { k: 'nim', name: 'Витрина NIM-контейнеров', pf: 3, fact: 'NIM — готовые инференс‑контейнеры со стандартным API. NeMo — генеративный AI.' },
  '1.7': { k: 'pipeline', name: 'Конвейер MLOps', pf: 2, fact: 'Данные → обучение → оптимизация → развёртывание → мониторинг → снова обучение.' },
  '1.8': { k: 'gpu', name: 'Верстак GPU и CPU', pf: 4, fact: 'CPU: мало мощных ядер. GPU: тысячи простых ядер, Tensor Cores и HBM.' },
  '2.1': { k: 'dgx', name: 'Стойка DGX', pf: 12, fact: 'DGX H100: 8 GPU, 640 ГБ HBM3, NVSwitch, ~10,2 кВт.' },
  '2.2': { k: 'su', name: 'Ряд Scalable Unit', pf: 16, fact: 'SU в SuperPOD — 32 узла DGX H100, 256 GPU.' },
  '2.3': { k: 'cooling', name: 'Жидкостное охлаждение (CDU)', pf: 6, fact: 'AI‑стойки 40–130+ кВт, воздух не справляется. PUE = вся мощность / IT.' },
  '2.4': { k: 'cloud', name: 'Облачный шлюз', pf: 5, fact: 'Облако: эластично и без CapEx. On‑prem: дешевле при постоянной загрузке.' },
  '2.5': { k: 'head', name: 'Управляющие узлы', pf: 3, fact: '4 сети SuperPOD: compute, storage, in‑band и out‑of‑band.' },
  '2.6': { k: 'power', name: 'Подстанция и ИБП', pf: 4, fact: 'N+1 — один запасной блок, 2N — два независимых пути питания A и B.' },
  '2.7': { k: 'leaf', name: 'Rail-коммутаторы', pf: 6, fact: 'Rail‑optimized: порт GPU N каждого узла идёт в один и тот же leaf.' },
  '2.8': { k: 'spine', name: 'Spine-ядро сети', pf: 5, fact: 'RoCE v2 — RDMA поверх UDP/IP, нужен lossless Ethernet: PFC + ECN.' },
  '2.9': { k: 'ib', name: 'Коммутатор InfiniBand', pf: 8, fact: 'NDR — 400 Гб/с на порт, XDR — 800. SHARP считает all‑reduce в коммутаторе.' },
  '2.10': { k: 'dpu', name: 'DPU BlueField', pf: 4, fact: 'DPU = NIC + Arm + ускорители. Разгружает CPU, программируется через DOCA.' },
  '3.1': { k: 'noc', name: 'Видеостена NOC', pf: 3, fact: 'BMC + Redfish через OOB‑сеть. DCGM Exporter → Prometheus → Grafana.' },
  '3.2': { k: 'sched', name: 'Консоль планировщика', pf: 5, fact: 'Slurm: sbatch, squeue, --gres=gpu:8. Kubernetes: nvidia.com/gpu.' },
  '3.3': { k: 'dcgm', name: 'Телеметрия DCGM', pf: 3, fact: 'nvidia-smi, dcgmi diag, XID в dmesg, рост ECC‑ошибок — сигнал тревоги.' },
  '3.4': { k: 'mig', name: 'GPU с MIG-разделами', pf: 5, fact: 'MIG — до 7 изолированных экземпляров. Time‑slicing — без изоляции памяти.' },
};

// Certification ladder (from nvidia.com/en-us/learn/certification). Zones on the campus map.
const CERTS = [
  { zone: 'AI Infrastructure', items: [
    { code: 'NCA-AIIO', name: 'AI Infrastructure and Operations', lvl: 'Associate', price: '$125', dur: '1 ч', active: true },
    { code: 'NCP-AII', name: 'AI Infrastructure', lvl: 'Professional', price: '$400', dur: '2 ч' },
    { code: 'NCP-AIO', name: 'AI Operations', lvl: 'Professional', price: '$500', dur: '2 ч' },
    { code: 'NCP-AIN', name: 'AI Networking', lvl: 'Professional', price: '$400', dur: '2 ч' },
    { code: 'NCP-ARI', name: 'AI Rack and Interconnect', lvl: 'Professional', price: '$400', dur: '2 ч' },
  ] },
  { zone: 'Generative AI', items: [
    { code: 'NCA-GENL', name: 'Generative AI LLMs', lvl: 'Associate', price: '$125', dur: '1 ч' },
    { code: 'NCA-GENM', name: 'Generative AI Multimodal', lvl: 'Associate', price: '$125', dur: '1 ч' },
    { code: 'NCA-AMAD', name: 'AI Models and Application Development', lvl: 'Associate', price: '$125', dur: '1 ч' },
    { code: 'NCP-GENL', name: 'Generative AI LLMs', lvl: 'Professional', price: '$200', dur: '2 ч' },
    { code: 'NCP-AAI', name: 'Agentic AI', lvl: 'Professional', price: '$200', dur: '2 ч' },
  ] },
  { zone: 'Data Science', items: [
    { code: 'NCA-ADS', name: 'Accelerated Data Science', lvl: 'Associate', price: '$125', dur: '1 ч' },
    { code: 'NCP-ADS', name: 'Accelerated Data Science', lvl: 'Professional', price: '$200', dur: '2 ч' },
  ] },
  { zone: 'Simulation and Physical AI', items: [
    { code: 'NCP-OUSD', name: 'OpenUSD Development', lvl: 'Professional', price: '$200', dur: '2 ч' },
  ] },
];

// ── pictograms (64×64). lv 0 = blueprint, 1 = built, 2 = upgraded (more LEDs), 3 = maxed (gold trim, blinking). ──
function objSVG(k, lv) {
  const bp = lv === 0;
  const B = bp ? 'none' : '#262626', B2 = bp ? 'none' : '#333', S = bp ? '#3d5a1a' : '#4a4a4a', G = '#76b900', GL = '#9be12a', AU = '#ffc800';
  const st = bp ? `stroke="${S}" stroke-width="1.5" stroke-dasharray="3 3"` : `stroke="${S}" stroke-width="1.2"`;
  const led = (x, y, i, r = 1.6) => bp ? '' : `<circle cx="${x}" cy="${y}" r="${r}" fill="${i < lv * 2 ? GL : '#1a1a1a'}" class="${lv === 3 ? 'blink' : ''}" style="animation-delay:${(i * 0.17) % 1}s"/>`;
  const rack = (x, y, w, h, n) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${B}" ${st}/>` + Array.from({ length: n }, (_, i) => `<rect x="${x + 3}" y="${y + 4 + i * ((h - 6) / n)}" width="${w - 6}" height="${(h - 6) / n - 2}" rx="1" fill="${B2}" ${bp ? st : ''}/>${led(x + w - 6, y + 4 + i * ((h - 6) / n) + ((h - 6) / n - 2) / 2, i)}`).join('');
  const trim = lv === 3 ? `<rect x="2" y="2" width="60" height="60" rx="8" fill="none" stroke="${AU}" stroke-width="1.5" opacity=".7"/>` : '';
  const line = (d, c = G, w = 2) => `<path d="${d}" fill="none" stroke="${bp ? S : c}" stroke-width="${w}" stroke-linecap="round" ${bp ? 'stroke-dasharray="3 3"' : ''}/>`;
  const fill = c => (bp ? 'none' : c);
  const p = {
    stack: `<rect x="8" y="10" width="48" height="34" rx="3" fill="${B}" ${st}/>${[0, 1, 2, 3].map(i => `<rect x="14" y="${36 - i * 7}" width="${36 - i * 4}" height="5" rx="1" fill="${fill(['#4a4a4a', G, GL, '#f2f2f2'][i])}" ${bp ? st : ''} opacity="${bp ? 1 : i < lv + 1 ? 1 : 0.25}"/>`).join('')}<rect x="26" y="46" width="12" height="6" fill="${B2}" ${st}/><rect x="18" y="52" width="28" height="3" rx="1" fill="${B2}" ${st}/>`,
    train: rack(6, 10, 16, 44, 5) + rack(24, 10, 16, 44, 5) + line('M42 32 h6', GL) + `<path d="M46 28 l4 4 -4 4" fill="none" stroke="${bp ? S : GL}" stroke-width="2"/>` + rack(50, 24, 10, 18, 2),
    neural: [[12, 16], [12, 32], [12, 48], [32, 22], [32, 42], [52, 32]].map(([x, y], i, a) => '').join('') + line('M12 16 L32 22 M12 16 L32 42 M12 32 L32 22 M12 32 L32 42 M12 48 L32 22 M12 48 L32 42 M32 22 L50 30 M32 42 L50 30', '#4a6a1a', 1.4) + [[12, 16], [12, 32], [12, 48], [32, 22], [32, 42]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${fill(i < lv * 2 ? G : '#333')}" ${st}/>`).join('') + `<ellipse cx="52" cy="40" rx="8" ry="3" fill="${fill('#333')}" ${st}/><path d="M44 40 v12 a8 3 0 0 0 16 0 v-12" fill="${fill('#2a2a2a')}" ${st}/>${bp ? '' : `<text x="52" y="50" text-anchor="middle" font-size="6" font-weight="800" fill="${GL}" font-family="sans-serif">RAG</text>`}`,
    data: `<ellipse cx="18" cy="22" rx="10" ry="4" fill="${fill('#333')}" ${st}/><path d="M8 22 v24 a10 4 0 0 0 20 0 v-24" fill="${fill('#262626')}" ${st}/>${line('M8 30 a10 4 0 0 0 20 0 M8 38 a10 4 0 0 0 20 0', '#4a4a4a', 1.2)}` + line('M34 50 L42 40 L48 44 L58 24', GL, 2.5) + `<path d="M53 24 h5 v5" fill="none" stroke="${bp ? S : GL}" stroke-width="2.5"/>` + line('M34 54 h24', '#4a4a4a', 1.2),
    robot: `<rect x="10" y="50" width="24" height="6" rx="2" fill="${B2}" ${st}/>` + line('M22 50 L22 36 L38 24 L50 30', '#5a5a5a', 5) + `<circle cx="22" cy="36" r="4" fill="${fill(G)}" ${st}/><circle cx="38" cy="24" r="4" fill="${fill(G)}" ${st}/>` + line('M50 30 l6 -4 M50 30 l6 4', GL, 2.5) + `<rect x="42" y="44" width="14" height="10" rx="2" fill="${fill('#333')}" ${st}/>${led(49, 49, 0, 2)}`,
    nim: [[8, 34], [24, 34], [40, 34], [16, 18], [32, 18]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="15" height="14" rx="2" fill="${fill(i < lv * 2 ? '#1f3305' : '#2a2a2a')}" ${st}/>${bp ? '' : `<text x="${x + 7.5}" y="${y + 9.5}" text-anchor="middle" font-size="5" font-weight="800" fill="${i < lv * 2 ? GL : '#666'}" font-family="sans-serif">NIM</text>`}`).join('') + `<rect x="4" y="50" width="56" height="4" rx="1" fill="${B2}" ${st}/>`,
    pipeline: `<rect x="4" y="40" width="56" height="8" rx="4" fill="${B2}" ${st}/>${[10, 22, 34, 46, 54].map(x => `<circle cx="${x}" cy="44" r="2" fill="${fill('#555')}"/>`).join('')}` + [[8, 28], [24, 28], [40, 28]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="12" height="11" rx="2" fill="${fill(i < lv + 1 ? G : '#333')}" ${st} class="${lv >= 2 ? 'slide' : ''}"/>`).join('') + line('M50 22 a8 8 0 1 1 -6 -6', GL, 2) + `<path d="M43 12 l1 5 5 -1" fill="none" stroke="${bp ? S : GL}" stroke-width="2"/>`,
    gpu: `<rect x="4" y="22" width="40" height="22" rx="3" fill="${B}" ${st}/><circle cx="16" cy="33" r="7" fill="${fill('#1a1a1a')}" ${st}/><circle cx="32" cy="33" r="7" fill="${fill('#1a1a1a')}" ${st}/>${bp ? '' : `<path d="M16 26 v14 M9 33 h14 M32 26 v14 M25 33 h14" stroke="#444" stroke-width="2" class="${lv >= 2 ? 'spin' : ''}"/>`}<rect x="4" y="44" width="30" height="4" fill="${fill(G)}" ${st}/>` + `<rect x="48" y="30" width="12" height="12" rx="1" fill="${fill('#3a3a3a')}" ${st}/>${line('M48 33 h-2 M48 36 h-2 M48 39 h-2 M60 33 h2 M60 36 h2 M60 39 h2', '#666', 1)}`,
    dgx: rack(16, 4, 32, 56, 8) + (bp ? '' : `<rect x="16" y="4" width="32" height="3" fill="${G}"/>`),
    su: [4, 19, 34, 49].map((x, i) => rack(x, 10, 12, 46, 6)).join('') + (bp ? '' : `<rect x="4" y="8" width="57" height="2" fill="${G}" opacity=".7"/>`),
    cooling: `<rect x="6" y="14" width="24" height="40" rx="3" fill="${B}" ${st}/><circle cx="18" cy="28" r="8" fill="${fill('#1a1a1a')}" ${st}/>${bp ? '' : `<path d="M18 21 v14 M11 28 h14 M13 23 l10 10 M23 23 l-10 10" stroke="${'#5ec8ff'}" stroke-width="1.6" class="${lv >= 1 ? 'spin' : ''}"/>`}${led(12, 46, 0, 2)}${led(18, 46, 1, 2)}${led(24, 46, 2, 2)}` + line('M30 24 h12 v-8 h14', '#5ec8ff', 3) + line('M30 40 h12 v8 h14', '#ff7a5a', 3) + rack(46, 14, 14, 40, 4),
    cloud: `<path d="M14 34 a9 9 0 0 1 4 -17 a12 12 0 0 1 22 2 a8 8 0 0 1 4 15 z" fill="${fill('#2f2f2f')}" ${st}/>` + line('M28 36 v8', GL, 2) + `<path d="M24 40 l4 4 4 -4" fill="none" stroke="${bp ? S : GL}" stroke-width="2"/>` + rack(18, 46, 22, 14, 2),
    head: rack(10, 18, 30, 36, 4) + `<rect x="44" y="26" width="16" height="12" rx="2" fill="${fill('#1a1a1a')}" ${st}/>${bp ? '' : `<path d="M47 30 l3 2 -3 2 M51 35 h5" stroke="${GL}" stroke-width="1.4" fill="none"/>`}<rect x="49" y="38" width="6" height="4" fill="${B2}" ${st}/>` + `<path d="M17 12 l4 4 4 -6 4 6 4 -4 -2 6 h-12 z" fill="${fill(lv >= 3 ? AU : '#555')}" ${st}/>`,
    power: `<rect x="6" y="18" width="22" height="36" rx="3" fill="${B}" ${st}/><rect x="13" y="14" width="8" height="4" fill="${B2}" ${st}/>${[0, 1, 2].map(i => `<rect x="10" y="${44 - i * 9}" width="14" height="7" rx="1" fill="${fill(i < lv ? G : '#333')}"/>`).join('')}` + `<path d="M44 10 l-10 22 h8 l-4 22 14 -28 h-9 l5 -16 z" fill="${fill(lv >= 3 ? AU : GL)}" ${st}/>`,
    leaf: [12, 28, 44].map((y, i) => `<rect x="6" y="${y}" width="52" height="10" rx="2" fill="${B}" ${st}/>${Array.from({ length: 8 }, (_, j) => `<rect x="${10 + j * 5.5}" y="${y + 3}" width="3.5" height="4" fill="${fill(j < (lv + 1) * 2 + i ? G : '#1a1a1a')}"/>`).join('')}`).join('') + line('M56 17 C 62 22 62 30 56 33 M56 33 C 62 38 62 46 56 49', '#5ec8ff', 1.5),
    spine: `<rect x="14" y="8" width="36" height="12" rx="2" fill="${B}" ${st}/>${led(20, 14, 0)}${led(26, 14, 1)}${led(32, 14, 2)}${led(38, 14, 3)}${led(44, 14, 4)}` + [8, 24, 40].map(x => `<rect x="${x}" y="44" width="16" height="10" rx="2" fill="${B2}" ${st}/>`).join('') + line('M20 20 L16 44 M20 20 L32 44 M20 20 L48 44 M44 20 L16 44 M44 20 L32 44 M44 20 L48 44', '#4a6a1a', 1.3),
    ib: `<rect x="4" y="20" width="56" height="20" rx="3" fill="${B}" ${st}/>${Array.from({ length: 16 }, (_, j) => `<rect x="${8 + (j % 8) * 6.3}" y="${24 + Math.floor(j / 8) * 7}" width="4.5" height="4.5" rx=".5" fill="${fill(j < lv * 6 ? GL : '#1a1a1a')}" class="${lv === 3 && j % 3 === 0 ? 'blink' : ''}"/>`).join('')}` + line('M10 40 C 10 52 20 54 22 60 M24 40 C 24 50 32 52 34 60 M40 40 C 40 50 46 52 48 60', '#5ec8ff', 1.6) + (bp ? '' : `<text x="32" y="16" text-anchor="middle" font-size="7" font-weight="800" fill="${GL}" font-family="sans-serif">NDR 400G</text>`),
    dpu: `<rect x="6" y="20" width="48" height="24" rx="2" fill="${fill('#1f2a12')}" ${st}/><rect x="20" y="25" width="16" height="14" rx="2" fill="${fill('#333')}" ${st}/>${bp ? '' : `<text x="28" y="34" text-anchor="middle" font-size="5" font-weight="800" fill="${GL}" font-family="sans-serif">DPU</text>`}<rect x="42" y="26" width="8" height="5" fill="${fill('#555')}"/><rect x="42" y="33" width="8" height="5" fill="${fill('#555')}"/><rect x="10" y="44" width="30" height="4" fill="${fill(AU)}" ${st}/>${led(13, 30, 0, 2)}${led(13, 36, 1, 2)}` + line('M54 28 h6 M54 36 h6', '#5ec8ff', 2),
    noc: [[4, 8], [24, 8], [44, 8], [4, 28], [24, 28], [44, 28]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="17" height="16" rx="1.5" fill="${fill(i < lv * 2 ? '#0d1a02' : '#1a1a1a')}" ${st}/>${bp || i >= lv * 2 ? '' : `<path d="M${x + 2} ${y + 12} l4 -4 3 2 5 -6" fill="none" stroke="${GL}" stroke-width="1.3"/>`}`).join('') + `<rect x="10" y="50" width="44" height="6" rx="2" fill="${B2}" ${st}/>`,
    sched: `<rect x="6" y="8" width="52" height="40" rx="3" fill="${fill('#0b0b0b')}" ${st}/>${[0, 1, 2, 3, 4].map(i => `<rect x="11" y="${13 + i * 7}" width="${[30, 18, 38, 24, 12][i]}" height="4" rx="1" fill="${fill(i < lv * 2 ? G : '#333')}" class="${lv >= 2 && i === 0 ? 'grow' : ''}"/>`).join('')}${bp ? '' : `<text x="52" y="45" text-anchor="end" font-size="5" fill="#666" font-family="monospace">squeue</text>`}<rect x="24" y="48" width="16" height="4" fill="${B2}" ${st}/><rect x="16" y="52" width="32" height="3" rx="1" fill="${B2}" ${st}/>`,
    dcgm: `<path d="M10 44 a22 22 0 0 1 44 0" fill="none" stroke="${bp ? S : '#333'}" stroke-width="6" ${bp ? 'stroke-dasharray="3 3"' : ''}/>${bp ? '' : `<path d="M10 44 a22 22 0 0 1 ${[0, 14, 30, 44][lv]} ${[0, -18, -21, 0][lv]}" fill="none" stroke="${G}" stroke-width="6"/>`}` + line(`M32 44 L${[32, 22, 40, 48][lv]} ${[24, 28, 28, 34][lv]}`, GL, 2.5) + `<circle cx="32" cy="44" r="3.5" fill="${fill(GL)}" ${st}/>` + `<rect x="18" y="50" width="28" height="6" rx="2" fill="${B2}" ${st}/>${bp ? '' : `<text x="32" y="55" text-anchor="middle" font-size="4.5" font-weight="800" fill="${GL}" font-family="monospace">DCGM</text>`}`,
    mig: `<rect x="6" y="12" width="52" height="40" rx="3" fill="${B}" ${st}/>${Array.from({ length: 7 }, (_, j) => `<rect x="${10 + j * 6.6}" y="17" width="5.2" height="30" rx="1" fill="${fill(j < [0, 3, 5, 7][lv] ? G : '#1a1a1a')}" opacity="${0.55 + (j % 3) * 0.15}"/>`).join('')}${bp ? '' : `<text x="32" y="58" text-anchor="middle" font-size="5" font-weight="800" fill="#888" font-family="sans-serif">MIG × 7</text>`}`,
  };
  return `<svg viewBox="0 0 64 64" class="obj lv${lv}" aria-hidden="true">${trim}${p[k] || ''}</svg>`;
}
