// 2.1+ · Generations of the data-center GPU, Hopper to Feynman: each package on a column whose height is its HBM.
// Numbers: NVIDIA product pages and launch materials (H100, B200/GB200, GB300, Vera Rubin NVL72, Rubin Ultra roadmap).
export const spec = { id: "t2-1b", width: 640, height: 380, azimuth: 62, elevation: 22 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.1", isNew: true,
  title: L("От Hopper до Vera Rubin", "From Hopper to Vera Rubin", "De Hopper a Vera Rubin"),
  cap: L("Каждый год новое поколение: больше кристаллов в корпусе, больше HBM, быстрее NVLink. Высота колонны — объём памяти одного GPU.", "A new generation every year: more dies per package, more HBM, faster NVLink. Column height is one GPU's memory.", "Cada año una nueva generación: más chips por encapsulado, más HBM, NVLink más rápido. La altura de la columna es la memoria de una GPU."),
  nodes: [
    { id: "hopper", kw: "Hopper|H100|H200", name: L("Hopper H100", "Hopper H100", "Hopper H100"), read: L("2022 · 1 кристалл · 80 ГБ HBM3, 3,35 ТБ/с · NVLink 4: 900 ГБ/с · домен 8 GPU (HGX)", "2022 · 1 die · 80 GB HBM3, 3.35 TB/s · NVLink 4: 900 GB/s · 8-GPU domain (HGX)", "2022 · 1 chip · 80 GB HBM3, 3,35 TB/s · NVLink 4: 900 GB/s · dominio de 8 GPU (HGX)") },
    { id: "blackwell", kw: "Blackwell|B200|GB200", name: L("Blackwell B200", "Blackwell B200", "Blackwell B200"), read: L("2024 · 2 кристалла, 208 млрд транзисторов · 192 ГБ HBM3e, 8 ТБ/с · NVLink 5: 1,8 ТБ/с · FP4 · NVL72", "2024 · 2 dies, 208B transistors · 192 GB HBM3e, 8 TB/s · NVLink 5: 1.8 TB/s · FP4 · NVL72", "2024 · 2 chips, 208 000 M de transistores · 192 GB HBM3e, 8 TB/s · NVLink 5: 1,8 TB/s · FP4 · NVL72") },
    { id: "bultra", kw: "Blackwell Ultra|B300|GB300", name: L("Blackwell Ultra B300", "Blackwell Ultra B300", "Blackwell Ultra B300"), read: L("2025 · 288 ГБ HBM3e (стеки по 12 слоёв) · ~1,5× FP4 к B200 · ConnectX-8 800G · GB300 NVL72", "2025 · 288 GB HBM3e (12-high stacks) · ~1.5× the FP4 of B200 · ConnectX-8 800G · GB300 NVL72", "2025 · 288 GB HBM3e (pilas de 12 capas) · ~1,5× FP4 frente a B200 · ConnectX-8 800G · GB300 NVL72") },
    { id: "rubin", kw: "Rubin|Vera|HBM4|NVLink 6", name: L("Vera Rubin", "Vera Rubin", "Vera Rubin"), read: L("2026 · 288 ГБ HBM4, ~22 ТБ/с · 50 PFLOPS NVFP4 · NVLink 6: 3,6 ТБ/с · CPU Vera, 88 ядер", "2026 · 288 GB HBM4, ~22 TB/s · 50 PFLOPS NVFP4 · NVLink 6: 3.6 TB/s · Vera CPU, 88 cores", "2026 · 288 GB HBM4, ~22 TB/s · 50 PFLOPS NVFP4 · NVLink 6: 3,6 TB/s · CPU Vera, 88 núcleos") },
    { id: "rultra", kw: "Rubin Ultra|Kyber|NVL576|HBM4e", name: L("Rubin Ultra", "Rubin Ultra", "Rubin Ultra"), read: L("2027 (план) · 4 кристалла · 1 ТБ HBM4e · 100 PFLOPS FP4 · стойка Kyber, ~600 кВт", "2027 (planned) · 4 dies · 1 TB HBM4e · 100 PFLOPS FP4 · Kyber rack, ~600 kW", "2027 (previsto) · 4 chips · 1 TB HBM4e · 100 PFLOPS FP4 · rack Kyber, ~600 kW") },
    { id: "feynman", kw: "Feynman", name: L("Feynman", "Feynman", "Feynman"), read: L("2028 (анонс) · следующее поколение после Rubin · детали ещё раскрываются", "2028 (announced) · the generation after Rubin · details still emerging", "2028 (anunciado) · la generación tras Rubin · detalles aún por conocerse") },
  ],
  steps: [
    { node: "hopper", flow: [], t: L("Hopper H100 (2022): один кристалл и 80 ГБ HBM3. NVLink-домен — 8 GPU внутри сервера HGX/DGX. Именно его чаще всего спрашивают на экзамене.", "Hopper H100 (2022): one die and 80 GB of HBM3. The NVLink domain is 8 GPUs inside an HGX/DGX server. This is the one the exam asks about most.", "Hopper H100 (2022): un chip y 80 GB de HBM3. El dominio NVLink son 8 GPU dentro de un servidor HGX/DGX. Es la que más sale en el examen.") },
    { node: "blackwell", flow: [], t: L("Blackwell B200 (2024): два кристалла работают как один GPU, 192 ГБ HBM3e и формат FP4. В стойке NVL72 NVLink связывает уже 72 GPU.", "Blackwell B200 (2024): two dies act as one GPU, with 192 GB of HBM3e and the FP4 format. In the NVL72 rack NVLink now links 72 GPUs.", "Blackwell B200 (2024): dos chips actúan como una GPU, con 192 GB de HBM3e y el formato FP4. En el rack NVL72, NVLink ya une 72 GPU.") },
    { node: "bultra", flow: [], t: L("Blackwell Ultra B300 (2025): стеки HBM3e по 12 слоёв дают 288 ГБ, FP4 быстрее ~в 1,5 раза, сеть 800G на ConnectX-8. Стойка — GB300 NVL72.", "Blackwell Ultra B300 (2025): 12-high HBM3e stacks give 288 GB, FP4 is ~1.5× faster and the network is 800G on ConnectX-8. The rack is GB300 NVL72.", "Blackwell Ultra B300 (2025): pilas HBM3e de 12 capas dan 288 GB, FP4 ~1,5× más rápido y red de 800G con ConnectX-8. El rack es GB300 NVL72.") },
    { node: "rubin", flow: [], t: L("Vera Rubin (2026): HBM4 с ~22 ТБ/с на GPU, 50 PFLOPS NVFP4, NVLink 6 вдвое быстрее — 3,6 ТБ/с. Рядом новый CPU Vera на 88 ядер.", "Vera Rubin (2026): HBM4 at ~22 TB/s per GPU, 50 PFLOPS NVFP4, and NVLink 6 twice as fast at 3.6 TB/s. Beside it sits the new 88-core Vera CPU.", "Vera Rubin (2026): HBM4 a ~22 TB/s por GPU, 50 PFLOPS NVFP4 y NVLink 6 el doble de rápido, 3,6 TB/s. Al lado, la nueva CPU Vera de 88 núcleos.") },
    { node: "rubin", flow: [], t: L("Стойка Vera Rubin NVL72: 72 GPU и 36 CPU Vera, 20,7 ТБ HBM4, ~3,6 эксафлопса NVFP4 на инференсе, 100% жидкостное охлаждение. Сеть — ConnectX-9 и BlueField-4.", "The Vera Rubin NVL72 rack: 72 GPUs and 36 Vera CPUs, 20.7 TB of HBM4, ~3.6 exaflops NVFP4 for inference, 100% liquid-cooled. Networking is ConnectX-9 and BlueField-4.", "El rack Vera Rubin NVL72: 72 GPU y 36 CPU Vera, 20,7 TB de HBM4, ~3,6 exaflops NVFP4 en inferencia, 100% refrigerado por líquido. La red es ConnectX-9 y BlueField-4.") },
    { node: "rultra", flow: [], t: L("Rubin Ultra (план на 2027): четыре кристалла в корпусе и 1 ТБ HBM4e. Новая стойка Kyber на ~600 кВт объединяет 576 кристаллов в один NVLink-домен.", "Rubin Ultra (planned for 2027): four dies per package and 1 TB of HBM4e. The new Kyber rack at ~600 kW joins 576 dies in one NVLink domain.", "Rubin Ultra (previsto para 2027): cuatro chips por encapsulado y 1 TB de HBM4e. El nuevo rack Kyber de ~600 kW une 576 chips en un dominio NVLink.") },
    { node: "feynman", flow: [], t: L("Feynman (анонсирован на 2028). Тренд не меняется: каждый год больше памяти, шире NVLink и больше киловатт на стойку — поэтому ЦОД проектируют под жидкость и мегаватты.", "Feynman (announced for 2028). The trend holds: every year more memory, wider NVLink and more kilowatts per rack, so data centers are designed for liquid and megawatts.", "Feynman (anunciado para 2028). La tendencia se mantiene: cada año más memoria, NVLink más ancho y más kilovatios por rack, por eso los centros de datos se diseñan para líquido y megavatios.") },
  ],
};

export function build(F) {
  const G = [
    { id: "hopper", cols: 1, rows: 1, hbm: 6, gb: 80, hh: 1.4 },
    { id: "blackwell", cols: 1, rows: 2, hbm: 8, gb: 192, hh: 1.6 },
    { id: "bultra", cols: 1, rows: 2, hbm: 8, gb: 288, hh: 2.2 },
    { id: "rubin", cols: 1, rows: 2, hbm: 8, gb: 288, hh: 2.4 },
    { id: "rultra", cols: 2, rows: 2, hbm: 16, gb: 1024, hh: 2.6 },
    { id: "feynman", ghost: true, gb: 0 },
  ];
  const STEP = 44;
  F.base({ x: -14, y: -26, w: STEP * 6 + 4, d: 52, r: 6 }, 7);
  G.forEach((g, i) => {
    const x0 = i * STEP;
    const PED = { x: x0, y: -18, w: 34, d: 36, r: 1.2 };
    F.part("p", g.id, PED, 0, 3, { steps: 2, tone: "lo", name: "pedestal" });
    if (g.ghost) {
      const C = { x: x0 + 7, y: -11, w: 20, d: 22, r: 1 };
      F.part("p", g.id, C, 3, 30, { steps: 2, tone: "lo", tint: "ghost", name: "ghost.column" });
      F.part("p", g.id, { x: x0 + 4, y: -14, w: 26, d: 28, r: 1 }, 33, 1.4, { steps: 1, tone: "lo", tint: "ghost", name: "ghost.package" });
      return;
    }
    const dw = 7, dd = 6.4, gap = 1, hw = 2.4;
    const dx = g.cols * dw + (g.cols - 1) * gap, dy = g.rows * dd + (g.rows - 1) * gap;
    const SW = dx + 2 * (hw + 1.4) + 2, SD = dy + 4;
    const cx = x0 + 17, cy = 0;
    const SUB = { x: cx - SW / 2, y: cy - SD / 2, w: SW, d: SD, r: 0.8 };
    const H = 3 + g.gb / 14;
    const COL = { x: SUB.x + 2, y: SUB.y + 2, w: SW - 4, d: SD - 4, r: 0.8 };
    F.part("p", g.id, COL, 3, H, { steps: 2, tone: "mid", inner: F.faceRows("x", COL, [...Array(Math.floor(H / 8))].map((_, j) => 3 + (j + 1) * 8)), name: "memory.column" });
    const zt = 3 + H;
    F.part("p", g.id, SUB, zt, 1, { steps: 1, bevel: 0, tint: "pcb", name: "substrate" }, "", 0.05);
    for (let c = 0; c < g.cols; c++) for (let r = 0; r < g.rows; r++) {
      F.part("p", g.id, { x: cx - dx / 2 + c * (dw + gap), y: cy - dy / 2 + r * (dd + gap), w: dw, d: dd, r: 0.3 }, zt + 1, 0.8, { steps: 1, bevel: 0, tint: "die", name: "die" }, "", 0.06);
    }
    const per = g.hbm / 2, sd = Math.min(2.6, (dy - (per - 1) * 0.5) / per);
    for (const side of [-1, 1]) for (let j = 0; j < per; j++) {
      const hx = side < 0 ? cx - dx / 2 - 1 - hw : cx + dx / 2 + 1;
      const hy = cy - dy / 2 + j * (dy / per) + (dy / per - sd) / 2;
      F.part("p", g.id, { x: hx, y: hy, w: hw, d: sd, r: 0.2 }, zt + 1, g.hh, { steps: 1, bevel: 0, tint: "hbm", name: "hbm" }, "", 0.06);
    }
  });
  // the year rail along the front edge: one tick per generation
  F.part("p", null, { x: -6, y: 20, w: STEP * 6 - 10, d: 1.6, r: 0.6 }, 0, 0.8, { steps: 1, bevel: 0, tone: "lo", name: "rail" }, F.dots(G.map((_, i) => [i * STEP + 17, 20.8, 0.8]), { size: 0.7, tone: "hi" }));
}
