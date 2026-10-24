// Tycoon map data: one data-center object per syllabus topic, plus the NVIDIA certification ladder.
const ROOMS = [
  { d: 'd1', name: 'AI-лаборатория', sub: 'Essential AI Knowledge' },
  { d: 'd2', name: 'Машинный зал', sub: 'AI Infrastructure' },
  { d: 'd3', name: 'Центр управления', sub: 'AI Operations' },
];
// topic → object on the map. hw = the real NVIDIA product or component it depicts; pf = PFLOPS added per level.
const OBJ = {
  '1.1': { k: 'stack', name: 'Стек ПО NVIDIA', hw: 'CUDA · CUDA-X · NGC', pf: 2, fact: 'Железо → драйвер → CUDA и CUDA‑X (cuDNN, NCCL) → фреймворки → NeMo, RAPIDS → TensorRT, Triton, NIM.' },
  '1.2': { k: 'train', name: 'Плата обучения и карта инференса', hw: 'HGX H100 8-GPU · L4', pf: 6, fact: 'Обучение: forward + backward на многих GPU с NVLink. Инференс: только forward, важны задержка и цена запроса.' },
  '1.3': { k: 'neural', name: 'LLM и векторная база для RAG', hw: 'Transformer · Vector DB', pf: 3, fact: 'AI ⊃ ML ⊃ DL. RAG ищет документы в векторной базе и добавляет их в промпт LLM.' },
  '1.4': { k: 'data', name: 'Хранилище данных', hw: 'All-flash NVMe storage', pf: 2, fact: 'Рост AI держится на трёх китах: данные, вычисления на GPU и алгоритмы вроде трансформеров.' },
  '1.5': { k: 'robot', name: 'Робот-манипулятор', hw: 'Isaac · Jetson', pf: 2, fact: 'Clara — медицина, Isaac — роботы, Metropolis — видео, DRIVE — авто, Riva — речь, Morpheus — кибербезопасность.' },
  '1.6': { k: 'nim', name: 'Контейнеры NIM', hw: 'NIM · NeMo · AI Enterprise', pf: 3, fact: 'NIM — готовые инференс‑контейнеры с OpenAI‑совместимым API. NeMo — полный цикл генеративного AI.' },
  '1.7': { k: 'pipeline', name: 'Конвейер MLOps', hw: 'Data → Train → Deploy', pf: 2, fact: 'Данные → обучение → оптимизация (TensorRT) → развёртывание (Triton, NIM) → мониторинг → снова обучение.' },
  '1.8': { k: 'gpu', name: 'GPU и CPU', hw: 'H100 SXM5 · Xeon', pf: 4, fact: 'CPU: десятки мощных ядер для последовательной логики. GPU: тысячи ядер, Tensor Cores и HBM (80 ГБ на H100).' },
  '2.1': { k: 'dgx', name: 'Сервер DGX H100', hw: 'DGX H100 · 8× H100', pf: 12, fact: 'DGX H100: 8 GPU, 640 ГБ HBM3, 4 NVSwitch, 8× ConnectX‑7 400G, ~10,2 кВт, ~130 кг.' },
  '2.2': { k: 'su', name: 'Ряд Scalable Unit', hw: 'DGX SuperPOD · 32 узла', pf: 16, fact: 'SU в DGX SuperPOD — 32 узла DGX H100 = 256 GPU. Кластер растёт такими блоками.' },
  '2.3': { k: 'cooling', name: 'Жидкостное охлаждение', hw: 'CDU · direct-to-chip', pf: 6, fact: 'AI‑стойки 40–130+ кВт, воздух не справляется. PUE = вся мощность / мощность IT.' },
  '2.4': { k: 'cloud', name: 'Облачный шлюз', hw: 'DGX Cloud · hybrid', pf: 5, fact: 'Облако: эластично, без CapEx. On‑prem: дешевле при постоянной загрузке и контроль данных.' },
  '2.5': { k: 'head', name: 'Управляющие узлы', hw: 'Head nodes · BCM', pf: 3, fact: '4 сети SuperPOD: compute, storage, in‑band и out‑of‑band.' },
  '2.6': { k: 'power', name: 'ИБП и питание A/B', hw: 'UPS · PDU · 2N', pf: 4, fact: 'N+1 — один запасной блок, 2N — два независимых пути питания A и B. Плюс вес на пол, ASHRAE.' },
  '2.7': { k: 'leaf', name: 'Rail-коммутаторы', hw: 'Rail-optimized leaf', pf: 6, fact: 'Rail‑optimized: порт GPU N каждого узла идёт в один и тот же leaf «рельса» N.' },
  '2.8': { k: 'spine', name: 'Spine-ядро сети', hw: 'Spine-leaf · RoCE v2', pf: 5, fact: 'RoCE v2 — RDMA поверх UDP/IP, нужен lossless Ethernet: PFC + ECN. В InfiniBand — credit‑based flow control.' },
  '2.9': { k: 'ib', name: 'Коммутатор InfiniBand', hw: 'Quantum-2 QM9700 · NDR', pf: 8, fact: 'NDR — 400 Гб/с на порт, XDR — 800. Quantum‑2: 64 порта NDR. SHARP считает all‑reduce в коммутаторе.' },
  '2.10': { k: 'dpu', name: 'DPU BlueField-3', hw: 'BlueField-3 · DOCA', pf: 4, fact: 'DPU = NIC + Arm‑ядра + ускорители. Разгружает CPU и изолирует инфраструктуру, программируется через DOCA.' },
  '3.1': { k: 'noc', name: 'Видеостена NOC', hw: 'BMC · Redfish · Grafana', pf: 3, fact: 'BMC (IPMI, Redfish) через OOB‑сеть. DCGM Exporter → Prometheus → Grafana.' },
  '3.2': { k: 'sched', name: 'Консоль планировщика', hw: 'Slurm · Kubernetes', pf: 5, fact: 'Slurm: sbatch, squeue, --gres=gpu:8. Kubernetes: nvidia.com/gpu через device plugin.' },
  '3.3': { k: 'dcgm', name: 'Телеметрия GPU', hw: 'DCGM · nvidia-smi', pf: 3, fact: 'nvidia-smi (NVML), dcgmi diag, XID в dmesg. Рост некорректируемых ECC — выводить GPU.' },
  '3.4': { k: 'mig', name: 'GPU с MIG-разделами', hw: 'MIG · vGPU', pf: 5, fact: 'MIG — до 7 изолированных экземпляров. Time‑slicing — по очереди, без изоляции памяти.' },
};

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


// ── hardware illustrations (viewBox 160×110), drawn after real NVIDIA hardware, no logos ──
// Shared gradients and patterns live in one hidden <svg> so every illustration can reference them.
(function addDefs() {
  const d = document.createElement('div');
  d.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="hwDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#474b52"/><stop offset=".5" stop-color="#2a2d32"/><stop offset="1" stop-color="#17191c"/></linearGradient>
    <linearGradient id="hwSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ced6"/><stop offset=".55" stop-color="#8c939d"/><stop offset="1" stop-color="#5d636c"/></linearGradient>
    <linearGradient id="hwGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe2bd"/><stop offset=".45" stop-color="#c7b282"/><stop offset="1" stop-color="#8e7a51"/></linearGradient>
    <linearGradient id="hwPcb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c6b33"/><stop offset="1" stop-color="#15401c"/></linearGradient>
    <linearGradient id="hwDie" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e4e7ea"/><stop offset=".5" stop-color="#a3a9b1"/><stop offset="1" stop-color="#6d737b"/></linearGradient>
    <linearGradient id="hwScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1d08"/><stop offset="1" stop-color="#050a03"/></linearGradient>
    <linearGradient id="hwCold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a9fe0"/><stop offset="1" stop-color="#7fd6ff"/></linearGradient>
    <linearGradient id="hwHot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff7a45"/><stop offset="1" stop-color="#ffb07a"/></linearGradient>
    <linearGradient id="hwGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <radialGradient id="hwFloor" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <pattern id="hwFoam" width="11" height="9" patternUnits="userSpaceOnUse"><rect width="11" height="9" fill="#cbb685"/><circle cx="1.6" cy="1.8" r="1.25" fill="#5e5034" opacity=".8"/><circle cx="5.4" cy="3.6" r=".8" fill="#5e5034" opacity=".7"/><circle cx="8.8" cy="1.4" r="1.05" fill="#5e5034" opacity=".75"/><circle cx="3.2" cy="6.6" r="1.1" fill="#5e5034" opacity=".75"/><circle cx="7.6" cy="7.2" r="1.35" fill="#5e5034" opacity=".8"/><circle cx="10.4" cy="4.8" r=".7" fill="#5e5034" opacity=".6"/><circle cx="4.4" cy="1" r=".5" fill="#fff7dc" opacity=".7"/><circle cx="9.6" cy="6" r=".45" fill="#fff7dc" opacity=".6"/><circle cx="1.2" cy="4.6" r=".4" fill="#fff7dc" opacity=".6"/></pattern>
    <pattern id="hwVent" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#15171a"/><rect x=".6" y=".6" width="2.8" height="1.4" rx=".4" fill="#30343a"/></pattern>
    <pattern id="hwFins" width="2.4" height="10" patternUnits="userSpaceOnUse"><rect width="2.4" height="10" fill="#1d1f22"/><rect width="1.2" height="10" fill="#5a6068"/></pattern>
    <pattern id="hwRib" width="4" height="10" patternUnits="userSpaceOnUse"><rect width="4" height="10" fill="#2c3a22"/><rect width="2" height="10" fill="#3d5230"/></pattern>
  </defs></svg>`;
  document.body.appendChild(d.firstElementChild);
})();

function objSVG(k, lv) {
  const on = i => i < [0, 3, 6, 99][lv];
  const led = (x, y, i, c = '#9be12a', r = 1.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${on(i) ? c : '#23262a'}" class="${on(i) && lv >= 2 && i % 3 === 0 ? 'blink' : ''}" style="animation-delay:${(i * .23) % 1.2}s"/>`;
  const box = (x, y, w, h, f = 'url(#hwDark)', rx = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="#0b0c0d" stroke-width=".8"/><rect x="${x + .6}" y="${y + .6}" width="${w - 1.2}" height="${Math.min(h * .45, 10)}" rx="${rx}" fill="url(#hwGlass)"/>`;
  const txt = (x, y, s, size = 7, fill = '#cfd5dc', anchor = 'middle', w = 700) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" font-family="Manrope, sans-serif">${s}</text>`;
  const mono = (x, y, s, size = 6, fill = '#9be12a') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="JetBrains Mono, monospace">${s}</text>`;
  const floor = (w = 120) => `<ellipse cx="80" cy="103" rx="${w / 2}" ry="5" fill="url(#hwFloor)"/>`;
  const osfp = (x, y, i) => `<rect x="${x}" y="${y}" width="6.4" height="5" rx=".6" fill="url(#hwSteel)" stroke="#2b2f34" stroke-width=".4"/><rect x="${x + 1}" y="${y + 1.2}" width="4.4" height="2.6" fill="${on(i) ? '#111' : '#3b3f45'}"/>`;
  const dgx = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h > 20 ? 2.5 : 1}" fill="url(#hwFoam)" stroke="#5b4d31" stroke-width=".7"/><rect x="${x}" y="${y + h * .78}" width="${w}" height="${h * .22}" fill="#141619"/>`;
  const P = {
    // DGX H100: champagne metal-foam bezel, dark lower bay with NVMe drives
    dgx: floor(126) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="17" y="10" width="126" height="88" rx="4" fill="url(#hwFoam)" stroke="#5b4d31"/><rect x="17" y="10" width="126" height="30" rx="4" fill="url(#hwGlass)"/>
      <rect x="17" y="74" width="126" height="24" rx="2" fill="#121417" stroke="#000"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${22 + i * 14.6}" y="78" width="12.4" height="16" rx="1" fill="url(#hwDark)" stroke="#000" stroke-width=".5"/>${led(28.2 + i * 14.6, 90.5, i, '#76b900', 1.1)}`).join('')}
      <rect x="21" y="14" width="3" height="56" rx="1.5" fill="#76b900" opacity="${lv ? .9 : .25}"/>${txt(136, 70, 'DGX H100', 6.5, '#3b311e', 'end', 800)}</g>`,
    // DGX SuperPOD Scalable Unit: a row of racks, each holding DGX systems
    su: floor(150) + [6, 44, 82, 120].map((x, r) => `<g filter="drop-shadow(0 2px 3px rgba(0,0,0,.5))">${box(x, 6, 34, 94, 'url(#hwDark)', 2)}${[0, 1, 2, 3].map(j => dgx(x + 3, 12 + j * 21, 28, 17)).join('')}${led(x + 30, 9, r * 2, '#76b900', 1.1)}${led(x + 26, 9, r * 2 + 1, '#76b900', 1.1)}</g>`).join('') + `<path d="M8 5 H154" stroke="#76b900" stroke-width="2.2" opacity="${lv ? .8 : .2}"/>`,
    // HGX H100 8-GPU baseboard (top view) + low-profile L4 inference card
    train: floor(140) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="6" y="12" width="104" height="84" rx="3" fill="url(#hwPcb)" stroke="#0c2410"/>
      ${[0, 1, 2, 3].map(i => [0, 1].map(j => `<rect x="${11 + i * 25}" y="${17 + j * 46}" width="21" height="28" rx="1.5" fill="url(#hwFins)" stroke="#0b0c0d" stroke-width=".6"/><rect x="${11 + i * 25}" y="${17 + j * 46}" width="21" height="4" fill="#9aa1aa"/>`).join('')).join('')}
      ${[0, 1, 2, 3].map(i => `<rect x="${15 + i * 25}" y="48.5" width="13" height="11" rx="1" fill="url(#hwDie)" stroke="#444"/>`).join('')}${txt(58, 92, 'HGX H100 · 8 GPU', 6, '#bfe3a8')}
      <rect x="116" y="38" width="38" height="44" rx="2" fill="url(#hwDark)" stroke="#000"/><rect x="116" y="38" width="38" height="12" fill="url(#hwGlass)"/><rect x="120" y="82" width="22" height="4" fill="#d4af37"/><rect x="152" y="36" width="4" height="48" fill="url(#hwSteel)"/>${led(124, 44, 0)}${txt(135, 66, 'L4', 9, '#e8ecef', 'middle', 900)}${txt(135, 75, 'INFERENCE', 4.6, '#9aa1aa')}</g>`,
    // H100 SXM5 module (die + 6 HBM3 stacks) next to a server CPU
    gpu: floor(140) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="6" y="14" width="86" height="80" rx="3" fill="url(#hwPcb)" stroke="#0c2410"/>
      <rect x="26" y="30" width="46" height="48" rx="2" fill="#2b2410"/><rect x="34" y="38" width="30" height="32" rx="1.5" fill="url(#hwDie)" stroke="#555"/>
      ${[0, 1, 2].map(i => `<rect x="27.5" y="${32 + i * 15}" width="5" height="13" rx=".6" fill="#3a3f46" stroke="#111" stroke-width=".4"/><rect x="65.5" y="${32 + i * 15}" width="5" height="13" rx=".6" fill="#3a3f46" stroke="#111" stroke-width=".4"/>`).join('')}
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${10 + i * 8}" y="88" width="5" height="4" fill="#d4af37"/>`).join('')}${txt(49, 25, 'H100 SXM5', 6.5, '#d8f0c8')}${txt(49, 84, 'GPU + 6× HBM3', 5, '#bfe3a8')}
      <rect x="104" y="38" width="50" height="50" rx="3" fill="#1d4a23" stroke="#0c2410"/><rect x="110" y="44" width="38" height="38" rx="2.5" fill="url(#hwSteel)" stroke="#555"/>${txt(129, 66, 'CPU', 8, '#2b2f34', 'middle', 900)}${txt(129, 32, 'x86 / Arm', 5.5, '#9aa1aa')}</g>`,
    // Liquid cooling: CDU with pump + rack with cold plates, blue supply / red return
    cooling: floor(146) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${box(8, 14, 44, 86)}<rect x="14" y="20" width="32" height="14" rx="1.5" fill="url(#hwScreen)"/>${mono(16, 29, 'ΔT 10°C', 6)}
      <circle cx="30" cy="56" r="13" fill="#0d0f11" stroke="#555"/><g class="${lv ? 'spin' : ''}"><path d="M30 44 v24 M18 56 h24 M21.5 47.5 l17 17 M38.5 47.5 l-17 17" stroke="#5ec8ff" stroke-width="2.2"/></g>
      ${led(16, 90, 0, '#5ec8ff')}${led(22, 90, 1, '#5ec8ff')}${led(28, 90, 2, '#76b900')}${txt(30, 82, 'CDU', 7, '#cfd5dc', 'middle', 900)}
      ${box(104, 8, 48, 92)}${[0, 1, 2, 3].map(j => `<rect x="108" y="${14 + j * 21}" width="40" height="17" rx="1" fill="#16181b" stroke="#000"/><rect x="113" y="${18 + j * 21}" width="13" height="9" rx="1" fill="#8ea3b5"/><rect x="130" y="${18 + j * 21}" width="13" height="9" rx="1" fill="#8ea3b5"/>`).join('')}
      <path d="M52 30 H78 V22 H104" fill="none" stroke="url(#hwCold)" stroke-width="5" stroke-linecap="round"/><path d="M52 74 H78 V84 H104" fill="none" stroke="url(#hwHot)" stroke-width="5" stroke-linecap="round"/>
      ${lv >= 2 ? `<circle r="2" fill="#fff"><animateMotion dur="2s" repeatCount="indefinite" path="M52 30 H78 V22 H104"/></circle><circle r="2" fill="#fff"><animateMotion dur="2s" repeatCount="indefinite" path="M104 84 H78 V74 H52"/></circle>` : ''}</g>`,
    // UPS cabinets with battery modules and A/B feeds
    power: floor(146) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[8, 44, 80].map((x, c) => `${box(x, 12, 34, 88)}<rect x="${x + 5}" y="18" width="24" height="12" rx="1" fill="url(#hwScreen)"/>${mono(x + 7, 26.5, c === 2 ? 'BYPASS' : 'ONLINE', 4.6, c === 2 ? '#ffc800' : '#9be12a')}${[0, 1, 2, 3, 4].map(j => `<rect x="${x + 5}" y="${36 + j * 12}" width="24" height="9" rx="1" fill="#1a1c1f" stroke="#000"/>${led(x + 25, 40.5 + j * 12, c * 5 + j)}`).join('')}`).join('')}
      <rect x="120" y="22" width="32" height="38" rx="3" fill="#222" stroke="#000"/><path d="M140 26 l-10 16 h7 l-4 14 12 -19 h-7 l5 -11 z" fill="${lv ? '#ffc800' : '#555'}"/>
      <rect x="120" y="66" width="15" height="22" rx="2" fill="#1b3d6b"/><rect x="137" y="66" width="15" height="22" rx="2" fill="#6b1b1b"/>${txt(127.5, 81, 'A', 9, '#fff', 'middle', 900)}${txt(144.5, 81, 'B', 9, '#fff', 'middle', 900)}</g>`,
    // InfiniBand Quantum-2 style 1U switches: 32 OSFP cages each, cables plugged by level
    ib: floor(150) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[22, 52].map((y, s) => `${box(6, y, 148, 24, 'url(#hwDark)', 2)}${Array.from({ length: 32 }, (_, i) => osfp(12 + (i % 16) * 8.6, y + 4 + Math.floor(i / 16) * 9, s * 32 + i)).join('')}${led(10, y + 3, s, '#76b900', 1)}`).join('')}
      ${Array.from({ length: [0, 6, 14, 22][lv] }, (_, i) => { const x = 15.2 + (i % 16) * 8.6 + (i % 2) * 2; return `<path d="M${x} 79 C ${x} 92 ${x + 4} 96 ${x + 6} 104" stroke="${['#5ec8ff', '#76b900', '#ffc800'][i % 3]}" stroke-width="1.6" fill="none" opacity=".9"/>`; }).join('')}
      ${txt(80, 15, 'QUANTUM-2 · NDR 400G · 64 ports', 6.4, '#9be12a')}</g>`,
    // Rail-optimized leaf switches with color-coded rail cables going to GPU nodes
    leaf: floor(150) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[0, 1, 2].map(j => `${box(10, 8 + j * 15, 140, 11, 'url(#hwDark)', 1.5)}${Array.from({ length: 16 }, (_, i) => `<rect x="${16 + i * 8}" y="${10.5 + j * 15}" width="6" height="6" rx=".6" fill="url(#hwSteel)"/>`).join('')}${led(13, 13.5 + j * 15, j * 2)}`).join('')}
      ${['#e74c3c', '#f39c12', '#f1c40f', '#76b900', '#1abc9c', '#3498db', '#9b59b6', '#ecf0f1'].map((c, r) => on(r) || lv === 0 ? `<path d="M${19 + r * 16} 47 C ${19 + r * 16} 62 ${14 + r * 18} 66 ${14 + r * 18} 76" stroke="${lv ? c : '#3b3f45'}" stroke-width="2" fill="none"/>` : '').join('')}
      ${[0, 1].map(n => `${box(10 + n * 74, 76, 66, 22, 'url(#hwFoam)', 2)}`).join('')}${txt(80, 108, 'rail 0…7 → тот же leaf', 6, '#9aa1aa')}</g>`,
    // Spine-leaf: every leaf connects to every spine
    spine: floor(150) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[30, 88].map(x => `${box(x, 10, 42, 12, 'url(#hwDark)', 1.5)}${Array.from({ length: 6 }, (_, i) => `<rect x="${x + 4 + i * 6}" y="13" width="4.4" height="5" rx=".5" fill="url(#hwSteel)"/>`).join('')}`).join('')}
      ${[6, 44, 82, 120].map(x => `${box(x, 74, 34, 11, 'url(#hwDark)', 1.5)}${Array.from({ length: 4 }, (_, i) => `<rect x="${x + 4 + i * 7}" y="77" width="5" height="5" rx=".5" fill="url(#hwSteel)"/>`).join('')}`).join('')}
      ${[51, 109].map(sx => [23, 61, 99, 137].map((lx, i) => `<path d="M${sx} 22 L${lx} 74" stroke="${lv ? '#76b900' : '#3b3f45'}" stroke-width="1.4" opacity=".75"/>${lv >= 2 ? `<circle r="1.8" fill="#d8ff9a"><animateMotion dur="${1.4 + i * .3}s" repeatCount="indefinite" path="M${lx} 74 L${sx} 22"/></circle>` : ''}`).join('')).join('')}
      ${txt(80, 98, 'SPINE ⇄ LEAF · RoCE v2 / IB', 6.4, '#9be12a')}${txt(51, 8, 'spine', 5.5, '#9aa1aa')}${txt(109, 8, 'spine', 5.5, '#9aa1aa')}</g>`,
    // BlueField-3 DPU: PCIe card with heatsink, Arm SoC, two QSFP112 cages on the bracket
    dpu: floor(140) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="24" y="22" width="122" height="62" rx="3" fill="url(#hwPcb)" stroke="#0c2410"/>
      ${Array.from({ length: 16 }, (_, i) => `<rect x="${44 + i * 4.6}" y="84" width="3" height="8" fill="#d4af37"/>`).join('')}
      <rect x="62" y="28" width="58" height="48" rx="2" fill="url(#hwFins)" stroke="#000"/><rect x="62" y="28" width="58" height="6" fill="#9aa1aa"/>${txt(91, 59, 'BlueField-3', 7, '#e8ecef', 'middle', 900)}
      <rect x="128" y="30" width="12" height="12" rx="1" fill="#1a1c1f"/>${txt(134, 52, 'Arm', 5, '#bfe3a8')}${led(134, 64, 0)}${led(134, 70, 1)}
      <rect x="10" y="14" width="14" height="82" rx="1.5" fill="url(#hwSteel)" stroke="#4a4f55"/><rect x="12.5" y="30" width="9" height="12" rx="1" fill="#111" stroke="#666"/><rect x="12.5" y="48" width="9" height="12" rx="1" fill="#111" stroke="#666"/>${led(17, 66, 2, '#76b900', 1.2)}
      ${lv >= 2 ? '<path d="M2 36 h8 M2 54 h8" stroke="#5ec8ff" stroke-width="2.4"/>' : ''}${txt(85, 18, 'DPU = NIC + Arm + ускорители', 5.8, '#9aa1aa')}</g>`,
    // Head / management nodes: stack of 1U servers
    head: floor(130) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[0, 1, 2, 3].map(j => `${box(18, 16 + j * 19, 124, 15, 'url(#hwSteel)', 1.5)}<rect x="22" y="${19 + j * 19}" width="62" height="9" fill="url(#hwVent)"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${90 + i * 7}" y="${19 + j * 19}" width="5.6" height="9" rx=".6" fill="#2a2d32"/>`).join('')}${led(136, 23.5 + j * 19, j * 2)}${led(136, 27.5 + j * 19, j * 2 + 1, '#5ec8ff', 1)}`).join('')}
      ${txt(80, 11, 'HEAD NODES · Slurm/K8s control · BCM', 6, '#9be12a')}</g>`,
    // Cloud gateway: cloud linked to an on-prem rack
    cloud: floor(120) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><path d="M38 52 a16 16 0 0 1 6 -30 a22 22 0 0 1 40 -4 a17 17 0 0 1 32 8 a14 14 0 0 1 4 26 z" fill="#e9eef3" opacity="${lv ? .92 : .35}"/><path d="M38 52 a16 16 0 0 1 6 -30 a22 22 0 0 1 40 -4" fill="none" stroke="#fff" stroke-width="1.2" opacity=".8"/>${txt(80, 42, 'CLOUD GPU', 7.5, '#2b2f34', 'middle', 900)}
      <path d="M80 54 V70" stroke="#76b900" stroke-width="2.4" stroke-dasharray="3 2"/>${lv >= 2 ? '<circle r="2" fill="#76b900"><animateMotion dur="1.2s" repeatCount="indefinite" path="M80 54 V70"/></circle>' : ''}
      ${box(50, 70, 60, 30)}${dgx(54, 74, 52, 9)}${dgx(54, 86, 52, 9)}${txt(80, 108, 'on-prem ⇄ облако', 6, '#9aa1aa')}</g>`,
    // All-flash storage arrays: drive bays with activity LEDs
    data: floor(140) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[0, 1, 2].map(j => `${box(12, 14 + j * 28, 136, 24, 'url(#hwDark)', 2)}${Array.from({ length: 12 }, (_, i) => `<rect x="${17 + i * 10.6}" y="${17.5 + j * 28}" width="8.6" height="17" rx="1" fill="url(#hwSteel)" stroke="#2b2f34" stroke-width=".4"/>${led(21.3 + i * 10.6, 31 + j * 28, j * 12 + i, '#5ec8ff', 1)}`).join('')}`).join('')}
      ${txt(80, 10, 'NVMe · parallel FS · данные', 6.4, '#9be12a')}</g>`,
    // Industrial robot arm on a base with a Jetson-class module
    robot: floor(110) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="34" y="86" width="44" height="12" rx="2" fill="url(#hwDark)"/><rect x="44" y="76" width="24" height="12" rx="3" fill="#ff9a1f"/>
      <g class="${lv >= 2 ? 'arm' : ''}" style="transform-origin:56px 76px"><path d="M56 76 L56 50" stroke="#ff9a1f" stroke-width="10" stroke-linecap="round"/><circle cx="56" cy="50" r="7" fill="#2b2f34" stroke="#ff9a1f" stroke-width="2"/>
      <path d="M56 50 L92 34" stroke="#ff9a1f" stroke-width="8" stroke-linecap="round"/><circle cx="92" cy="34" r="5.5" fill="#2b2f34" stroke="#ff9a1f" stroke-width="2"/><path d="M92 34 L106 44" stroke="#c9ced6" stroke-width="5" stroke-linecap="round"/><path d="M106 44 l6 -4 M106 44 l6 5" stroke="#c9ced6" stroke-width="2.4" stroke-linecap="round"/></g>
      <rect x="112" y="72" width="36" height="24" rx="2" fill="url(#hwPcb)" stroke="#0c2410"/><rect x="120" y="76" width="20" height="14" rx="1" fill="url(#hwFins)"/>${led(116, 92, 0)}${txt(130, 70, 'Jetson', 6, '#bfe3a8')}${txt(56, 106, 'Isaac', 6, '#9aa1aa')}</g>`,
    // NIM containers: corrugated shipping containers with an API port
    nim: floor(150) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[[8, 62, 0], [56, 62, 1], [104, 62, 2], [32, 26, 3], [80, 26, 4]].map(([x, y, i]) => `<rect x="${x}" y="${y}" width="46" height="34" rx="1.5" fill="${on(i) ? 'url(#hwRib)' : '#2a2d32'}" stroke="#0b0c0d"/><rect x="${x}" y="${y}" width="46" height="5" fill="${on(i) ? '#76b900' : '#3b3f45'}"/>${txt(x + 23, y + 22, 'NIM', 9, on(i) ? '#e8ffd0' : '#6b7078', 'middle', 900)}`).join('')}
      ${txt(80, 18, 'API: /v1/chat/completions', 6.2, '#9aa1aa')}</g>`,
    // MLOps conveyor: boxes move across Data → Train → Deploy stations
    pipeline: floor(150) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="6" y="70" width="148" height="12" rx="6" fill="#26292d" stroke="#000"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${12 + i * 12.4}" cy="76" r="3" fill="#4a4f55"/>`).join('')}
      ${[['Data', 10], ['Train', 60], ['Deploy', 110]].map(([s, x], i) => `${box(x, 30, 40, 32, 'url(#hwDark)')}<rect x="${x + 4}" y="34" width="32" height="12" rx="1" fill="url(#hwScreen)"/>${txt(x + 20, 43, s, 6.4, on(i) ? '#9be12a' : '#555')}${led(x + 20, 54, i)}`).join('')}
      <g class="${lv ? 'belt' : ''}">${[0, 1, 2].map(i => `<rect x="${14 + i * 50}" y="60" width="12" height="10" rx="1" fill="#c7b282" stroke="#6f5f3d"/>`).join('')}</g>
      <path d="M140 22 a12 12 0 1 0 -100 0" fill="none" stroke="#76b900" stroke-width="1.6" stroke-dasharray="3 3" opacity="${lv ? .8 : .2}"/>${txt(80, 98, 'мониторинг → переобучение', 6, '#9aa1aa')}</g>`,
    // Software stack on a monitor
    stack: floor(120) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="18" y="6" width="124" height="80" rx="4" fill="#0d0e10" stroke="#3b3f45"/><rect x="22" y="10" width="116" height="72" rx="2" fill="url(#hwScreen)"/>
      ${[['NIM · Triton · TensorRT', '#f2f2f2'], ['NeMo · RAPIDS', '#c9e89a'], ['PyTorch · TensorFlow', '#9be12a'], ['CUDA-X: cuDNN · NCCL', '#76b900'], ['CUDA', '#5a8f00'], ['Driver · GPU', '#3b3f45']].map(([s, c], i) => `<rect x="${28 + i * 2}" y="${14 + i * 11}" width="${104 - i * 4}" height="9" rx="1.5" fill="${on(5 - i) || i >= 4 ? c : '#1d2a12'}" opacity="${on(5 - i) || i >= 4 ? 1 : .6}"/>${txt(80, 20.6 + i * 11, s, 5.6, i < 2 ? '#1a1a1a' : i === 5 ? '#cfd5dc' : '#0b1406', 'middle', 800)}`).join('')}
      <rect x="72" y="86" width="16" height="8" fill="#2a2d32"/><rect x="56" y="94" width="48" height="4" rx="2" fill="#3b3f45"/></g>`,
    // LLM + vector database for RAG
    neural: floor(140) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="8" y="12" width="88" height="70" rx="4" fill="#0d0e10" stroke="#3b3f45"/><rect x="12" y="16" width="80" height="62" rx="2" fill="url(#hwScreen)"/>
      ${[[24, 28], [24, 47], [24, 66], [52, 34], [52, 60], [80, 47]].map(([x, y], i, a) => '').join('')}<path d="M24 28 L52 34 M24 28 L52 60 M24 47 L52 34 M24 47 L52 60 M24 66 L52 34 M24 66 L52 60 M52 34 L80 47 M52 60 L80 47" stroke="#3d6a14" stroke-width="1.2"/>
      ${[[24, 28], [24, 47], [24, 66], [52, 34], [52, 60], [80, 47]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${on(i) ? '#76b900' : '#263016'}" stroke="#9be12a" stroke-width=".8"/>`).join('')}${txt(52, 24, 'Transformer LLM', 5.6, '#9be12a')}
      <ellipse cx="128" cy="30" rx="20" ry="6" fill="#9aa1aa"/><path d="M108 30 v44 a20 6 0 0 0 40 0 v-44" fill="url(#hwSteel)" stroke="#4a4f55"/><path d="M108 45 a20 6 0 0 0 40 0 M108 60 a20 6 0 0 0 40 0" fill="none" stroke="#4a4f55"/>${txt(128, 56, 'VECTOR', 6, '#1a1a1a', 'middle', 900)}${txt(128, 64, 'DB', 6, '#1a1a1a', 'middle', 900)}
      <path d="M106 50 H98" stroke="#ffc800" stroke-width="2" marker-end=""/><path d="M98 50 l4 -3 v6 z" fill="#ffc800"/>${txt(128, 92, 'RAG', 8, '#ffc800', 'middle', 900)}</g>`,
    // NOC video wall
    noc: floor(150) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))">${[0, 1, 2].map(c => [0, 1].map(r => { const x = 8 + c * 49, y = 8 + r * 34, i = c + r * 3; return `<rect x="${x}" y="${y}" width="46" height="31" rx="1.5" fill="#0d0e10" stroke="#3b3f45"/><rect x="${x + 2}" y="${y + 2}" width="42" height="27" fill="url(#hwScreen)"/>${on(i) ? (i % 3 === 0 ? `<path d="M${x + 5} ${y + 24} l7 -6 6 3 8 -10 7 4 8 -7" fill="none" stroke="#9be12a" stroke-width="1.3"/>` : i % 3 === 1 ? [0, 1, 2, 3, 4].map(b => `<rect x="${x + 6 + b * 7}" y="${y + 26 - (5 + (b * 7 + i * 3) % 16)}" width="4.5" height="${5 + (b * 7 + i * 3) % 16}" fill="${b === 3 ? '#ffc800' : '#76b900'}"/>`).join('') : `<circle cx="${x + 23}" cy="${y + 16}" r="9" fill="none" stroke="#333" stroke-width="3"/><path d="M${x + 14} ${y + 16} a9 9 0 0 1 15 -6.5" fill="none" stroke="#5ec8ff" stroke-width="3"/>`) : ''}`; }).join('')).join('')}
      <rect x="30" y="84" width="100" height="10" rx="2" fill="url(#hwDark)"/>${txt(80, 104, 'Prometheus · Grafana · Redfish', 6, '#9aa1aa')}</g>`,
    // Scheduler console with squeue output
    sched: floor(130) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="12" y="8" width="136" height="82" rx="4" fill="#0b0c0d" stroke="#3b3f45"/><rect x="12" y="8" width="136" height="10" rx="4" fill="#25282c"/>${['#ff5f57', '#febc2e', '#28c840'].map((c, i) => `<circle cx="${20 + i * 7}" cy="13" r="2.2" fill="${c}"/>`).join('')}
      ${mono(18, 28, '$ squeue', 6.4, '#e8ecef')}${mono(18, 37, 'JOBID  NAME    ST  NODES', 5.6, '#9aa1aa')}${[['4120', 'llm-pt', 'R', '32'], ['4121', 'eval', 'R', '2'], ['4122', 'sft', 'PD', '8'], ['4123', 'nim', 'PD', '1']].map((r, i) => mono(18, 46 + i * 8, `${r[0]}   ${r[1].padEnd(7, ' ')} ${r[2].padEnd(3, ' ')} ${r[3]}`, 5.6, on(i) ? (r[2] === 'R' ? '#9be12a' : '#ffc800') : '#3b3f45')).join('')}
      ${mono(18, 84, '$ sbatch --gres=gpu:8 train.sh', 5.6, '#5ec8ff')}<rect x="${lv ? 130 : 0}" y="79" width="4" height="7" fill="#e8ecef" class="blink" opacity="${lv ? 1 : 0}"/></g>`,
    // GPU telemetry: temperature gauge, power bars, ECC / XID counters
    dcgm: floor(140) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="8" y="8" width="144" height="86" rx="4" fill="#0d0e10" stroke="#3b3f45"/><rect x="12" y="12" width="136" height="78" rx="2" fill="url(#hwScreen)"/>
      <path d="M22 62 a24 24 0 0 1 48 0" fill="none" stroke="#2a2d32" stroke-width="7"/><path d="M22 62 a24 24 0 0 1 ${[0, 18, 34, 42][lv]} ${[0, -21, -22, -12][lv]}" fill="none" stroke="${lv === 3 ? '#ffc800' : '#76b900'}" stroke-width="7"/>${txt(46, 60, lv ? `${[0, 54, 67, 78][lv]}°C` : '—', 9, '#e8ecef', 'middle', 900)}${txt(46, 76, 'GPU TEMP', 5.4, '#9aa1aa')}
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${84 + i * 7.5}" y="${66 - (on(i) ? 12 + (i * 13) % 26 : 4)}" width="5" height="${on(i) ? 12 + (i * 13) % 26 : 4}" fill="#76b900"/>`).join('')}${txt(112, 76, 'POWER ×8', 5.4, '#9aa1aa')}
      ${mono(18, 86, 'ECC 0 · XID — · NVLink OK', 5.6, lv ? '#9be12a' : '#3b3f45')}${txt(80, 22, 'DCGM', 7, '#9be12a', 'middle', 900)}</g>`,
    // MIG: one GPU die split into seven isolated instances
    mig: floor(140) + `<g filter="drop-shadow(0 3px 4px rgba(0,0,0,.5))"><rect x="10" y="12" width="140" height="80" rx="3" fill="url(#hwPcb)" stroke="#0c2410"/><rect x="26" y="22" width="108" height="60" rx="2" fill="#2b2410"/>
      ${Array.from({ length: 7 }, (_, j) => `<rect x="${30 + j * 14.6}" y="26" width="12.6" height="52" rx="1.2" fill="${j < [0, 3, 5, 7][lv] ? ['#76b900', '#5ec8ff', '#ffc800', '#b78cff', '#ff7a45', '#1abc9c', '#f2f2f2'][j] : 'url(#hwDie)'}" opacity="${j < [0, 3, 5, 7][lv] ? .92 : .5}"/>${txt(36.3 + j * 14.6, 56, String(j + 1), 7, '#111', 'middle', 900)}`).join('')}
      ${txt(80, 98, '1 GPU → до 7 MIG-экземпляров', 6.2, '#9aa1aa')}</g>`,
  };
  return `<svg viewBox="0 0 160 110" class="obj lv${lv}" aria-hidden="true">${P[k] || ''}</svg>`;
}
