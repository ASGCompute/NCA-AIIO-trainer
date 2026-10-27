// 2.5+ · The ladder of scale, chip to AI factory, with the napkin math of a 100k-GPU cluster: power, network, failures.
// Numbers: GB200 NVL72 / DGX SuperPOD (NVIDIA), fat-tree capacity k³/4, Llama 3 paper (Meta, 2024) for failure rates.
export const spec = { id: "t2-5b", width: 640, height: 340, azimuth: 62, elevation: 24 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.5", isNew: true,
  title: L("Лестница масштаба: от чипа до AI-фабрики", "The ladder of scale: chip to AI factory", "La escalera de escala: del chip a la fábrica de IA"),
  cap: L("Одна архитектура на всех уровнях: GPU → суперчип → лоток → стойка NVL72 → SuperPOD → AI-фабрика. На каждой ступени растут киловатты, кабели и цена ошибки.", "One architecture at every level: GPU → superchip → tray → NVL72 rack → SuperPOD → AI factory. Each step up adds kilowatts, cables and the cost of a failure.", "Una arquitectura en cada nivel: GPU → superchip → bandeja → rack NVL72 → SuperPOD → fábrica de IA. Cada escalón suma kilovatios, cables y el coste de un fallo."),
  nodes: [
    { id: "chip", kw: "GPU package|die|HBM", name: L("GPU", "GPU", "GPU"), read: L("1 GPU Blackwell: 2 кристалла + HBM3e · около 1 кВт", "1 Blackwell GPU: 2 dies + HBM3e · about 1 kW", "1 GPU Blackwell: 2 chips + HBM3e · cerca de 1 kW") },
    { id: "superchip", kw: "superchip|GB200|Grace", name: L("Суперчип", "Superchip", "Superchip"), read: L("GB200 = 1 Grace + 2 Blackwell · NVLink-C2C 900 ГБ/с", "GB200 = 1 Grace + 2 Blackwell · NVLink-C2C 900 GB/s", "GB200 = 1 Grace + 2 Blackwell · NVLink-C2C 900 GB/s") },
    { id: "tray", kw: "compute tray|1U", name: L("Лоток", "Tray", "Bandeja"), read: L("2 суперчипа = 4 GPU · 1U, жидкостное охлаждение", "2 superchips = 4 GPUs · 1U, liquid-cooled", "2 superchips = 4 GPU · 1U, refrigeración líquida") },
    { id: "rack", kw: "NVL72|rack", name: L("Стойка NVL72", "NVL72 rack", "Rack NVL72"), read: L("18 лотков = 72 GPU в одном NVLink-домене · ~120 кВт", "18 trays = 72 GPUs in one NVLink domain · ~120 kW", "18 bandejas = 72 GPU en un dominio NVLink · ~120 kW") },
    { id: "pod", kw: "SuperPOD|scalable unit|BasePOD", name: L("SuperPOD", "SuperPOD", "SuperPOD"), read: L("8 стоек NVL72 = 576 GPU · сеть 400–800G · ~1 МВт", "8 NVL72 racks = 576 GPUs · 400–800G network · ~1 MW", "8 racks NVL72 = 576 GPU · red de 400–800G · ~1 MW") },
    { id: "factory", kw: "AI factory|megawatt|100k|100,000", name: L("AI-фабрика", "AI factory", "Fábrica de IA"), read: L("100 000 GPU ≈ 1 400 стоек · ~180 МВт IT · ~220 МВт с охлаждением", "100,000 GPUs ≈ 1,400 racks · ~180 MW IT · ~220 MW with cooling", "100 000 GPU ≈ 1400 racks · ~180 MW de TI · ~220 MW con refrigeración") },
  ],
  steps: [
    { node: "chip", flow: [], t: L("Начинаем с одного GPU Blackwell: два кристалла и HBM3e в одном корпусе, около 1 кВт тепла.", "Start with one Blackwell GPU: two dies and HBM3e in one package, about 1 kW of heat.", "Empezamos con una GPU Blackwell: dos chips y HBM3e en un encapsulado, cerca de 1 kW de calor.") },
    { node: "superchip", flow: [], t: L("Суперчип GB200: CPU Grace и два GPU на одной плате, связаны NVLink-C2C на 900 ГБ/с.", "The GB200 superchip: a Grace CPU and two GPUs on one board, linked by NVLink-C2C at 900 GB/s.", "El superchip GB200: una CPU Grace y dos GPU en una placa, unidas por NVLink-C2C a 900 GB/s.") },
    { node: "tray", flow: [], t: L("Вычислительный лоток: два суперчипа, то есть 4 GPU, плюс сетевые карты и жидкостные трубки. Это кирпичик стойки.", "A compute tray: two superchips, so 4 GPUs, plus NICs and coolant lines. It's the brick of the rack.", "Una bandeja de cómputo: dos superchips, es decir 4 GPU, más tarjetas de red y tubos de líquido. Es el ladrillo del rack.") },
    { node: "rack", flow: [], t: L("Стойка NVL72: 18 лотков = 72 GPU в одном NVLink-домене. Около 120 кВт, охлаждение только жидкостью.", "The NVL72 rack: 18 trays = 72 GPUs in one NVLink domain. About 120 kW, liquid cooling only.", "El rack NVL72: 18 bandejas = 72 GPU en un dominio NVLink. Unos 120 kW, solo refrigeración líquida.") },
    { node: "pod", flow: ["pod"], t: L("SuperPOD: 8 стоек NVL72 = 576 GPU. Между стойками уже не NVLink, а InfiniBand или Spectrum-X на 400–800G. Около мегаватта.", "A SuperPOD: 8 NVL72 racks = 576 GPUs. Between racks it's no longer NVLink but InfiniBand or Spectrum-X at 400–800G. About a megawatt.", "Un SuperPOD: 8 racks NVL72 = 576 GPU. Entre racks ya no hay NVLink sino InfiniBand o Spectrum-X a 400–800G. Cerca de un megavatio.") },
    { node: "factory", flow: ["factory:power"], t: L("AI-фабрика на 100 000 GPU — около 1 400 стоек. 1 400 × ~130 кВт ≈ 180 МВт на IT, с охлаждением при PUE 1,2 ≈ 220 МВт. Это потребление небольшого города.", "An AI factory of 100,000 GPUs is about 1,400 racks. 1,400 × ~130 kW ≈ 180 MW of IT, and with cooling at PUE 1.2 ≈ 220 MW. That's a small city's demand.", "Una fábrica de IA de 100 000 GPU son unos 1400 racks. 1400 × ~130 kW ≈ 180 MW de TI y, con refrigeración a PUE 1,2, ≈ 220 MW. Es lo que consume una ciudad pequeña.") },
    { node: "factory", flow: ["pod"], t: L("Сеть: трёхуровневое fat-tree на коммутаторах с 64 портами вмещает 64³/4 ≈ 65 тыс. портов. Для 100 000 GPU нужны коммутаторы ёмче (Quantum-X800 на 144 порта) или ещё один уровень.", "Network: a three-tier fat tree of 64-port switches holds 64³/4 ≈ 65k ports. For 100,000 GPUs you need bigger switches (the 144-port Quantum-X800) or another tier.", "Red: un fat-tree de tres niveles con switches de 64 puertos admite 64³/4 ≈ 65 000 puertos. Para 100 000 GPU hacen falta switches mayores (Quantum-X800 de 144 puertos) u otro nivel.") },
    { node: "factory", flow: [], t: L("Отказы: при обучении Llama 3 на 16 тыс. H100 было ~420 незапланированных остановок за 54 дня — раз в 3 часа. На 100 тыс. GPU это примерно раз в полчаса: чекпоинты пишут часто, а сбойные узлы сразу выводят.", "Failures: training Llama 3 on 16k H100s saw ~420 unplanned stops in 54 days, one every 3 hours. At 100k GPUs that's about every half hour, so checkpoints are frequent and bad nodes are drained at once.", "Fallos: al entrenar Llama 3 en 16 000 H100 hubo ~420 paradas imprevistas en 54 días, una cada 3 horas. Con 100 000 GPU es cada media hora: se guardan checkpoints a menudo y los nodos malos se retiran al momento.") },
  ],
};

export function build(F) {
  const STEP = 46, W = 36;
  F.base({ x: -14, y: -26, w: STEP * 6 + 4, d: 52, r: 6 }, 7);
  const ped = (i, id) => F.part("p", id, { x: i * STEP, y: -18, w: W, d: 36, r: 1.2 }, 0, 3, { steps: 2, tone: "lo", name: "pedestal" });
  const cx = (i) => i * STEP + W / 2;
  // 1 · one GPU package on a small post
  ped(0, "chip");
  F.part("p", "chip", { x: cx(0) - 5, y: -5, w: 10, d: 10, r: 0.6 }, 3, 6, { steps: 2, tone: "mid", name: "post" });
  F.part("p", "chip", { x: cx(0) - 7, y: -6, w: 14, d: 12, r: 0.5 }, 9, 0.8, { steps: 1, bevel: 0, tint: "pcb", name: "substrate" }, "", 0.05);
  for (const dy of [-4.6, 0.4]) F.part("p", "chip", { x: cx(0) - 2.4, y: dy, w: 4.8, d: 4.2, r: 0.2 }, 9.8, 0.6, { steps: 1, bevel: 0, tint: "die", name: "die" }, "", 0.06);
  for (const hx of [cx(0) - 5.6, cx(0) + 3.6]) for (let j = 0; j < 4; j++) F.part("p", "chip", { x: hx, y: -4.6 + j * 2.4, w: 2, d: 1.8, r: 0.15 }, 9.8, 1.2, { steps: 1, bevel: 0, tint: "hbm", name: "hbm" }, "", 0.06);
  // 2 · superchip: one board, two GPU packages and a Grace
  ped(1, "superchip");
  F.part("p", "superchip", { x: cx(1) - 6, y: -6, w: 12, d: 12, r: 0.6 }, 3, 8, { steps: 2, tone: "mid", name: "post" });
  F.part("p", "superchip", { x: cx(1) - 14, y: -9, w: 28, d: 18, r: 0.6 }, 11, 0.8, { steps: 1, bevel: 0, tint: "pcb", name: "board" }, "", 0.05);
  for (const gx of [cx(1) - 12.5, cx(1) - 3.5]) {
    F.part("p", "superchip", { x: gx, y: -6, w: 8, d: 12, r: 0.3 }, 11.8, 0.4, { steps: 1, bevel: 0, tint: "black", name: "package" }, "", 0.06);
    for (const dy of [-4.8, 0.2]) F.part("p", "superchip", { x: gx + 2, y: dy, w: 4, d: 4.4, r: 0.2 }, 12.2, 0.5, { steps: 1, bevel: 0, tint: "die", name: "die" }, "", 0.07);
  }
  F.part("p", "superchip", { x: cx(1) + 6.5, y: -3.5, w: 6, d: 7, r: 0.3 }, 11.8, 0.8, { steps: 1, bevel: 0, tint: "die", name: "grace" }, "", 0.06);
  // 3 · compute tray (1U), lid off
  ped(2, "tray");
  F.part("p", "tray", { x: cx(2) - 7, y: -7, w: 14, d: 14, r: 0.6 }, 3, 10, { steps: 2, tone: "mid", name: "post" });
  const T = { x: cx(2) - 16, y: -13, w: 32, d: 26, r: 0.6 };
  F.unit("p", "tray", T, 13, 2.6, { face: "x", ports: 4, pitch: 2.6, name: "tray" });
  for (const yy of [-11, 1]) {
    F.part("p", "tray", { x: cx(2) - 13, y: yy, w: 24, d: 10, r: 0.4 }, 15.6, 0.3, { steps: 1, bevel: 0, tint: "pcb", name: "board" }, "", 0.05);
    for (const gx of [cx(2) - 11.5, cx(2) - 4]) F.part("p", "tray", { x: gx, y: yy + 1.6, w: 6, d: 6.8, r: 0.2 }, 15.9, 0.5, { steps: 1, bevel: 0, tint: "die", name: "gpu" }, "", 0.06);
    F.part("p", "tray", { x: cx(2) + 4, y: yy + 2.6, w: 4.4, d: 4.8, r: 0.2 }, 15.9, 0.5, { steps: 1, bevel: 0, tint: "die", name: "grace" }, "", 0.06);
  }
  // 4 · the NVL72 rack
  ped(3, "rack");
  const R = { x: cx(3) - 10, y: -8, w: 20, d: 16, r: 0.8 }, RH = 78;
  F.part("p", "rack", R, 3, RH, { steps: 2, tone: "mid", inner: F.faceRows("x", R, [...Array(25)].map((_, j) => 6 + j * 3)), name: "rack" }, "", 0);
  F.part("p", "rack", { x: R.x + R.w, y: R.y + 1, w: 0.6, d: R.d - 2, r: 0.2 }, 3 + RH * 0.38, RH * 0.24, { steps: 1, bevel: 0, tint: "black", name: "switch.band" }, "", 0.05);
  // 5 · SuperPOD: eight racks in a row with a cable tray above
  ped(4, "pod");
  for (let j = 0; j < 8; j++) F.part("p", "pod", { x: cx(4) - 6, y: -16 + j * 4, w: 12, d: 3.6, r: 0.3 }, 3, 40, { steps: 1, tone: j % 2 ? "mid" : "hi", crease: "lo", name: "pod.rack" });
  F.part("p", "pod", { x: cx(4) - 3, y: -16, w: 6, d: 32, r: 0.4 }, 45, 1.4, { steps: 1, bevel: 0, tone: "lo", name: "cable.tray" });
  for (let j = 0; j < 8; j++) F.wire("p", "pod", [[cx(4), -14 + j * 4, 43], [cx(4), -14 + j * 4, 45]], { name: "riser", tone: "lo", r: 0.2, ends: "none" });
  F.wire("p", "pod", [[cx(4), -15, 46.4], [cx(4), 15, 46.4]], { name: "pod.trunk", tone: "lo", width: 1.2, r: 0.2, ends: "none" });
  // 6 · AI factory: a hall with roof chillers and a substation feeding it
  ped(5, "factory");
  const HALL = { x: cx(5) - 15, y: -12, w: 26, d: 28, r: 1 };
  F.part("p", "factory", HALL, 3, 26, { steps: 2, tone: "hi", crease: "lo", inner: F.faceRows("x", HALL, [10, 17, 24]), name: "hall" });
  for (const [x, y] of [[cx(5) - 9, -6], [cx(5) - 9, 6], [cx(5) + 2, -6], [cx(5) + 2, 6]]) F.cyl("p", "factory", x, y, 3.2, 29, 4, { steps: 24, tone: "mid", crease: "lo", name: "chiller" });
  const SUB = { x: cx(5) + 13, y: -16, w: 4, d: 8, r: 0.4 };
  F.part("p", "factory", SUB, 3, 9, { steps: 2, tone: "lo", inner: F.faceLines("x", SUB, 4, 11, 1.4), name: "substation" });
  F.wire("p", "factory", [[cx(5) + 15, -12, 12], [cx(5) + 15, -12, 18], [cx(5) + 11.2, -12, 18], [cx(5) + 11.2, -6, 18]], { name: "feeder", tone: "mid", width: 1.3, r: 0.3 });
  // the rail along the front edge, one tick per rung
  F.part("p", null, { x: -6, y: 20, w: STEP * 6 - 10, d: 1.6, r: 0.6 }, 0, 0.8, { steps: 1, bevel: 0, tone: "lo", name: "rail" }, F.dots([0, 1, 2, 3, 4, 5].map((i) => [cx(i), 20.8, 0.8]), { size: 0.7, tone: "hi" }));
}
