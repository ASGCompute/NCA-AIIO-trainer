// 2.1 · DGX H100 in cutaway (lid and near side panel off). Numbers: NVIDIA DGX H100 User Guide.
export const spec = {
  id: "t2-1", width: 640, height: 600, azimuth: 52, elevation: 36,
  stagger: ["cpu", "net", "psu", "sinks"],
  moves: { cpu: [0, 0, 128], net: [44, 0, 0], psu: [44, 0, 0], sinks: [0, 0, 74] },
};
export const meta = {
  id: spec.id, topic: "2.1", explode: true,
  title: { ru: "DGX H100 в разрезе", en: "DGX H100, cut away", es: "DGX H100 en corte" },
  cap: { ru: "Восемь GPU связаны через четыре NVSwitch, у каждого GPU свой порт 400G. Компоновка упрощена, числа по спецификации.", en: "Eight GPUs are linked through four NVSwitch chips, and each GPU has its own 400G port. The layout is simplified; the numbers follow the spec.", es: "Ocho GPU se conectan a través de cuatro NVSwitch y cada GPU tiene su propio puerto de 400G. La disposición está simplificada; las cifras siguen la especificación." },
  nodes: [
    { id: "gpu", kw: "H100|SXM|HBM|640|80 GB|GPU memory", name: { ru: "GPU", en: "GPU", es: "GPU" }, read: { ru: "8 × H100 SXM5 · 80 ГБ HBM3 каждый · 640 ГБ всего", en: "8 × H100 SXM5 · 80 GB HBM3 each · 640 GB total", es: "8 × H100 SXM5 · 80 GB HBM3 cada una · 640 GB en total" } },
    { id: "nvs", kw: "NVSwitch|NVLink|900", name: { ru: "NVSwitch", en: "NVSwitch", es: "NVSwitch" }, read: { ru: "4 × NVSwitch · NVLink 4 · 900 ГБ/с на GPU, все со всеми", en: "4 × NVSwitch · NVLink 4 · 900 GB/s per GPU, all-to-all", es: "4 × NVSwitch · NVLink 4 · 900 GB/s por GPU, todas con todas" } },
    { id: "cpu", kw: "Xeon|CPU|DDR|2 TB|memory", name: { ru: "CPU и память", en: "CPU and memory", es: "CPU y memoria" }, read: { ru: "2 × Xeon 8480C по 56 ядер · 2 ТБ DDR5 в 32 модулях", en: "2 × Xeon 8480C, 56 cores each · 2 TB DDR5 in 32 DIMMs", es: "2 × Xeon 8480C de 56 núcleos · 2 TB DDR5 en 32 módulos" } },
    { id: "net", kw: "ConnectX|400 Gb|port|OSFP|in-band|BMC|fabric", name: { ru: "Сеть", en: "Network", es: "Red" }, read: { ru: "8 × ConnectX‑7 400G для фабрики · 2 двухпортовые для хранения · BMC 1 GbE", en: "8 × ConnectX-7 400G for the fabric · 2 dual-port for storage · BMC 1 GbE", es: "8 × ConnectX-7 400G para la red de cómputo · 2 de doble puerto para almacenamiento · BMC 1 GbE" } },
    { id: "store", kw: "NVMe|U\\.2|M\\.2|RAID|drive|cache", name: { ru: "Накопители", en: "Storage", es: "Almacenamiento" }, read: { ru: "ОС: 2 × 1,92 ТБ M.2, RAID 1 · кэш: 8 × 3,84 ТБ U.2, RAID 0", en: "OS: 2 × 1.92 TB M.2, RAID 1 · cache: 8 × 3.84 TB U.2, RAID 0", es: "SO: 2 × 1,92 TB M.2, RAID 1 · caché: 8 × 3,84 TB U.2, RAID 0" } },
    { id: "psu", kw: "power|kW|PSU|supply", name: { ru: "Питание", en: "Power", es: "Energía" }, read: { ru: "6 × 3,3 кВт, схема 4+2 · до 10,2 кВт · 8U, ~130 кг", en: "6 × 3.3 kW in 4+2 · up to 10.2 kW · 8U, ~130 kg", es: "6 × 3,3 kW en 4+2 · hasta 10,2 kW · 8U, ~130 kg" } },
  ],
};

export function build(F) {
  const { k } = F;
  const CH = { x: 0, y: -72, w: 270, d: 144, r: 3 }, WALL = 108, TRAY = 52, SINK_TOP = 44;
  const GX = [44, 94, 144, 194], GY = [-36, 36];
  F.back(`<path class="iso-halo" d="${k.haloOf(CH, -6, 6, F.P)}"/>` + F.box(CH, -6, 6, { tone: "lo", steps: 4, bevel: 1 }) + F.dots(k.corners(CH, 6).map(([x, y]) => [x, y, 0]), { size: 0.5 }), [F.A.slab(CH, -6, 6, { name: "stand.pan" })]);
  const SIDE = { x: 0, y: -72, w: 270, d: 3, r: 0.6 }, FRONT = { x: 0, y: -69, w: 3, d: 141, r: 0.6 }, RAIL = { x: 3, y: -69, w: 264, d: 4, r: 0.6 };
  F.part("stand", null, SIDE, 0, WALL, { steps: 2, inner: [24, 48, 72].map((z) => F.seam(SIDE, z, 2)).join("") }, F.dots([30, 90, 150, 210].map((x) => [x, -69, WALL - 4])), -50);
  F.part("stand", null, FRONT, 0, WALL, { steps: 2 }, "", -50);
  F.part("stand", null, RAIL, TRAY - 3, 3, { steps: 2 }, F.dots([20, 120, 240].map((x) => [x, -67, TRAY])), -40);
  // fan wall at the front: air runs front to back
  for (let i = 0; i < 4; i++) {
    const p = { x: 3, y: -66 + i * 33, w: 10, d: 31, r: 1 }, cy = p.y + 15.5;
    const rings = F.line([13, 10, 3].map((r) => k.sideRing([13, cy, 23], r, "x", F.P, 40)).join(""));
    const spokes = F.line([0, 1, 2, 3, 4].map((j) => { const a = j * 1.2566; return "M" + F.at([13, cy + 3 * Math.cos(a), 23 + 3 * Math.sin(a)]).join(" ") + "L" + F.at([13, cy + 10 * Math.cos(a + 0.5), 23 + 10 * Math.sin(a + 0.5)]).join(" "); }).join(""), { tone: "faint" });
    F.part("stand", null, p, 0, 46, { steps: 2, name: "fan" }, rings + spokes + F.dots([[13, p.y + 3, 43], [13, p.y + p.d - 3, 43]]));
  }
  // HGX baseboard with NVLink traces from every GPU to the switch row
  const BOARD = { x: 14, y: -66, w: 214, d: 132, r: 2 };
  const tr = [];
  for (const gx of GX) for (const gy of GY) { const s = Math.sign(gy); for (const dx of [-5, 0, 5]) tr.push(F.lineTop([gx + dx, gy - s * 23], [gx + dx, s * 8], 3)); }
  F.part("gpu", "board", BOARD, 0, 3, { bevel: 0.6, tint: "pcb", name: "gpu.board" }, F.line(k.planOutline(k.insetPlan(BOARD, 4), 3, F.P, 3), { tone: "faint" }) + F.traces(tr.join("")) + F.dots(k.corners(BOARD, 5).map(([x, y]) => [x, y, 3])), -20);
  GX.forEach((gx) => GY.forEach((gy) => {
    const mod = { x: gx - 21, y: gy - 23, w: 42, d: 46, r: 1.2 }, die = { x: gx - 9, y: gy - 10, w: 18, d: 20, r: 0.6 };
    F.part("gpu", "gpu", mod, 3, 2, { steps: 2, tint: "pcb", name: "gpu.sxm" }, F.dots(k.corners(mod, 2.4).map(([x, y]) => [x, y, 5]), { size: 0.4 }));
    F.part("gpu", "gpu", die, 5, 2, { steps: 2, tone: "hi", crease: "lo", tint: "die", name: "gpu.die" }, "", 0.1);
    for (const sx of [-1, 1]) for (const j of [-1, 0, 1]) F.part("gpu", "gpu", { x: gx + sx * 14 - 2.5, y: gy + j * 7.4 - 3, w: 5, d: 6, r: 0.4 }, 5, 2, { steps: 2, bevel: 0, tint: "hbm", name: "gpu.hbm" }, "", 0.1);
    const base = { x: gx - 20, y: gy - 22, w: 40, d: 44, r: 1.5 }, fins = { x: gx - 19, y: gy - 21, w: 38, d: 42, r: 1 };
    F.put("sinks", "gpu", [gx, gy, 25], F.box(base, 7, 5, { steps: 3, tint: "cu" }) + F.box(fins, 12, SINK_TOP - 12, { steps: 2, bevel: 0, tone: "hi", crease: "lo", inner: F.faceLines("x", fins, 12, SINK_TOP, 3) }) + F.finsTop(fins, SINK_TOP, 3) + F.dots(k.corners(base, 1.6).map(([x, y]) => [x, y, 12]), { size: 0.4 }),
      [F.slab(base, 7, 5, "sink.base"), F.slab(fins, 12, SINK_TOP - 12, "sink.fins")]);
  }));
  GX.forEach((sx) => {
    const chip = { x: sx - 7, y: -7, w: 14, d: 14, r: 0.6 }, hs = { x: sx - 7.5, y: -7.5, w: 15, d: 15, r: 0.8 };
    F.part("gpu", "nvs", chip, 3, 2, { steps: 2, tone: "hi", crease: "lo", tint: "die", name: "nvs.chip" });
    F.put("sinks", "nvs", [sx, 0, 11], F.box(hs, 5, 13, { steps: 2, tone: "hi", crease: "lo", inner: F.faceLines("x", hs, 5, 18, 2.5) }) + F.finsTop(hs, 18, 2.5), [F.slab(hs, 5, 13, "nvs.sink")]);
  });
  // power supplies at the rear, lower level
  for (let i = 0; i < 6; i++) {
    const p = { x: 232, y: -66 + i * 22, w: 36, d: 20, r: 0.8 };
    const slots = [6, 9, 12, 15].map((z) => F.rectX(268, p.y + 3, p.y + 9, z, z + 1.4)).join("");
    F.part("psu", "psu", p, 0, 22, { steps: 2, inner: F.seam(p, 18, 2), name: "psu" }, F.line(slots) + F.dots([[268, p.y + 16, 18.5]], { size: 0.55, tone: "hi" }));
    F.part("psu", "psu", { x: 268, y: p.y + 5, w: 2.4, d: 10, r: 0.6 }, 6, 3, { steps: 2, bevel: 0, name: "psu.handle" }, "", 0.1);
  }
  // motherboard tray: CPUs, 32 DIMMs, boot M.2, U.2 cage
  const PAN = { x: 4, y: -68, w: 226, d: 136, r: 2 }, MB = { x: 30, y: -62, w: 196, d: 124, r: 2 }, TOP = TRAY + 5;
  F.part("cpu", "cpu", PAN, TRAY, 3, { tone: "lo", bevel: 0.6, inner: F.seam(PAN, TRAY + 1.5), name: "cpu.pan" }, "", -10);
  F.part("cpu", "cpu", MB, TRAY + 3, 2, { tint: "pcb", name: "cpu.mb" }, F.line(k.planOutline(k.insetPlan(MB, 3), TOP, F.P, 3), { tone: "faint" }) + F.dots(k.corners(MB, 4).map(([x, y]) => [x, y, TOP])), -5);
  for (const cx of [80, 168]) {
    const sock = { x: cx - 14, y: -16, w: 28, d: 32, r: 1 }, hs = { x: cx - 13, y: -15, w: 26, d: 30, r: 1.2 };
    F.part("cpu", "cpu", sock, TOP, 2, { steps: 2, name: "cpu.socket" }, F.dots(k.corners(sock, 2).map(([x, y]) => [x, y, TOP + 2]), { size: 0.4 }));
    F.part("cpu", "cpu", hs, TOP + 2, 24, { tone: "hi", crease: "lo", inner: F.faceLines("x", hs, TOP + 2, TOP + 26, 2.5), name: "cpu.sink" }, F.finsTop(hs, TOP + 26, 2.5));
    for (const s of [-1, 1]) for (let j = 0; j < 8; j++) { const y = s * (21 + j * 4); F.part("cpu", "cpu", { x: cx - 16, y: y - 0.8, w: 32, d: 1.6, r: 0.3 }, TOP, 15, { steps: 1, bevel: 0, tint: "pcb", name: "cpu.dimm" }); }
  }
  for (const y of [-6, 3]) F.part("cpu", "store", { x: 112, y, w: 24, d: 4, r: 0.4 }, TOP, 1.2, { steps: 1, bevel: 0, tone: "hi", crease: "lo", name: "store.m2" }, F.dots([[134.5, y + 2, TOP + 1.2]], { size: 0.4 }), 0.1);
  F.part("cpu", "store", { x: 8, y: -64, w: 20, d: 128, r: 1 }, TRAY + 3, 2, { steps: 2, tone: "lo", name: "store.cage" }, "", -2);
  for (let i = 0; i < 8; i++) {
    const d = { x: 9, y: -63 + i * 16, w: 18, d: 14, r: 0.8 }, z0 = TRAY + 5;
    F.part("cpu", "store", d, z0, 30, { steps: 2, inner: F.seam(d, z0 + 24, 2), name: "store.u2" }, F.line(k.planOutline(k.insetPlan(d, 2.4), z0 + 30, F.P, 2), { tone: "faint" }) + F.dots([[d.x + 15, d.y + 7, z0 + 30]], { size: 0.45, tone: "hi" }));
  }
  // network modules at the rear, upper level: 4 twin-port OSFP (8 × 400G), 2 dual-port NICs, BMC
  F.part("net", "net", { x: 232, y: -68, w: 36, d: 136, r: 1.2 }, TRAY, 3, { steps: 2, tone: "lo", name: "net.shelf" }, "", -10);
  const Z0 = TRAY + 3;
  const mods = [...[0, 1, 2, 3].map((i) => ({ y: -64 + i * 15, d: 13, n: 2, kind: "osfp" })), ...[0, 1].map((i) => ({ y: -2 + i * 24, d: 22, n: 2, kind: "nic" })), { y: 50, d: 14, n: 1, kind: "bmc" }];
  for (const m of mods) {
    const p = { x: 236, y: m.y, w: 32, d: m.d, r: 0.8 }, h = m.kind === "bmc" ? 10 : 18;
    const ports = m.kind === "bmc" ? F.ports("x", 268, m.y + 4, m.y + m.d - 4, Z0 + 3, Z0 + 7, 1) : F.ports("x", 268, m.y + 2, m.y + m.d - 2, Z0 + 6, Z0 + 13, m.n, 1.2);
    F.part("net", "net", p, Z0, h, { steps: 2, name: "net." + m.kind }, ports + F.dots([[268, m.y + 2, Z0 + h - 2.5]], { size: 0.45, tone: m.kind === "bmc" ? "mid" : "hi" }));
  }
}
