// 1.5 · Use cases: one object per NVIDIA platform on its own pedestal.
export const spec = { id: "t1-5", width: 620, height: 420, azimuth: 38, elevation: 30 };
const L = (ru, en, es) => ({ ru, en, es });
const N = [
  ["cuda", "CUDA-X", L("Общий фундамент: CUDA, библиотеки CUDA-X и AI Enterprise под каждой платформой · рядом Omniverse, Merlin, cuOpt", "The shared foundation: CUDA, CUDA-X libraries and AI Enterprise under every platform · alongside Omniverse, Merlin, cuOpt", "La base común: CUDA, las bibliotecas CUDA-X y AI Enterprise bajo cada plataforma · junto a Omniverse, Merlin, cuOpt"), "CUDA-X|one stack|Omniverse|Merlin|cuOpt"],
  ["clara", "Clara", L("Медицина: снимки, геномика, поиск лекарств", "Healthcare: imaging, genomics, drug discovery", "Salud: imagen médica, genómica, fármacos"), "Clara|health|medical|imaging"],
  ["isaac", "Isaac", L("Роботы: симуляция (Isaac Sim), мобильные роботы, манипуляторы, гуманоиды", "Robots: simulation (Isaac Sim), mobile robots, arms, humanoids", "Robots: simulación (Isaac Sim), robots móviles, brazos, humanoides"), "Isaac|robot"],
  ["metro", "Metropolis", L("Видеоаналитика: камеры, города, ритейл", "Video analytics: cameras, cities, retail", "Análisis de vídeo: cámaras, ciudades, retail"), "Metropolis|video|camera|vision"],
  ["drive", "DRIVE", L("Автономные автомобили", "Autonomous vehicles", "Vehículos autónomos"), "DRIVE|autonomous|vehicle|car"],
  ["riva", "Riva", L("Речь: распознавание и синтез", "Speech: recognition and synthesis", "Voz: reconocimiento y síntesis"), "Riva|speech|voice|ASR"],
  ["morph", "Morpheus", L("Кибербезопасность: поиск аномалий в трафике", "Cybersecurity: finding anomalies in traffic", "Ciberseguridad: anomalías en el tráfico"), "Morpheus|security|cyber|fraud"],
];
export const meta = {
  id: spec.id, topic: "1.5",
  title: L("Платформы по отраслям", "Platforms by industry", "Plataformas por sector"),
  cap: L("У каждой отрасли своя платформа NVIDIA поверх одного стека CUDA: от медицины до кибербезопасности.", "Each industry has its own NVIDIA platform on top of the same CUDA stack, from healthcare to cybersecurity.", "Cada sector tiene su plataforma de NVIDIA sobre la misma pila CUDA, de la salud a la ciberseguridad."),
  nodes: N.map(([id, n, read, kw]) => ({ id, kw, name: L(n, n, n), read })),
};
export function build(F) {
  const { k } = F;
  F.base({ x: -14, y: -96, w: 150, d: 206, r: 6 }, 7);
  const ped = (id, i) => { const x = (i % 2) * 64, y = -84 + Math.floor(i / 2) * 64, p = { x, y, w: 54, d: 54, r: 2 }; F.part("p", id, p, 0, 8, { steps: 3, tone: "lo", bevel: 0.6, name: "pedestal" }, F.dots(k.corners(p, 4).map(([a, b]) => [a, b, 8]))); return [x + 27, y + 27]; };
  let [cx, cy] = ped("clara", 0);
  F.part("o", "clara", { x: cx - 20, y: cy - 6, w: 40, d: 12, r: 1 }, 8, 8, { steps: 2, name: "bed" });
  F.cyl("o", "clara", cx + 4, cy, 16, 16, 6, { steps: 48, tone: "hi", crease: "lo", name: "gantry" }, F.line(k.ring(cx + 4, cy, 9, 22, F.P, 40), { tone: "lo" }));
  // the shared CUDA foundation: a green strip along the whole front edge of the bench
  F.part("o", "cuda", { x: -8, y: 101, w: 132, d: 3, r: 0.6 }, 0, 1.4, { steps: 1, bevel: 0, tint: "pcb", name: "cuda.strip" });
  F.part("o", "cuda", { x: 121, y: -90, w: 3, d: 191, r: 0.6 }, 0, 1.4, { steps: 1, bevel: 0, tint: "pcb", name: "cuda.strip" });
  [cx, cy] = ped("isaac", 1);
  F.cyl("o", "isaac", cx, cy, 9, 8, 6, { steps: 32, name: "base" });
  F.part("o", "isaac", { x: cx - 3, y: cy - 3, w: 6, d: 6, r: 1 }, 14, 24, { steps: 2, tone: "hi", crease: "lo", name: "arm1" });
  F.part("o", "isaac", { x: cx - 3, y: cy - 3, w: 24, d: 6, r: 1 }, 38, 6, { steps: 2, tone: "hi", crease: "lo", name: "arm2" });
  F.part("o", "isaac", { x: cx + 17, y: cy - 5, w: 6, d: 10, r: 0.8 }, 30, 8, { steps: 2, name: "grip" });
  [cx, cy] = ped("metro", 2);
  F.cyl("o", "metro", cx, cy, 2.5, 8, 26, { steps: 16, name: "pole" });
  F.part("o", "metro", { x: cx - 14, y: cy - 7, w: 24, d: 14, r: 1.5 }, 34, 11, { steps: 2, tone: "hi", crease: "lo", name: "camera" }, F.line(k.sideRing([cx + 10, cy, 39.5], 4, "x", F.P, 28) + k.sideRing([cx + 10, cy, 39.5], 2.2, "x", F.P, 20), { tone: "lo" }));
  [cx, cy] = ped("drive", 3);
  const car = { x: cx - 22, y: cy - 10, w: 44, d: 20, r: 3 };
  F.part("o", "drive", car, 8, 9, { steps: 4, tone: "hi", crease: "lo", name: "body" }, F.line([-12, 12].map((dx) => k.sideRing([cx + dx, cy + 10, 12], 4.5, "y", F.P, 28)).join(""), { tone: "lo" }));
  F.part("o", "drive", { x: cx - 10, y: cy - 8, w: 20, d: 16, r: 3 }, 17, 7, { steps: 3, name: "cabin" });
  F.cyl("o", "drive", cx - 2, cy, 2.5, 24, 3, { steps: 20, tone: "hi", name: "lidar" });
  [cx, cy] = ped("riva", 4);
  F.cyl("o", "riva", cx, cy, 8, 8, 3, { steps: 32, name: "foot" });
  F.cyl("o", "riva", cx, cy, 1.6, 11, 20, { steps: 14, name: "stand" });
  F.cyl("o", "riva", cx, cy, 6, 31, 14, { steps: 32, tone: "hi", crease: "lo", name: "mic", inner: F.line([34, 37, 40, 43].map((z) => k.sideArc(cx, cy, 6, z, F.P, 28)).join(""), { tone: "lo" }) });
  [cx, cy] = ped("morph", 5);
  const lk = { x: cx - 12, y: cy - 8, w: 24, d: 16, r: 2 };
  F.part("o", "morph", lk, 8, 18, { steps: 3, tone: "hi", crease: "lo", name: "lock" }, F.line(k.sideRing([cx, cy + 8, 18], 2, "y", F.P, 16), { tone: "lo" }));
  for (const dx of [-8, 5]) F.part("o", "morph", { x: cx + dx, y: cy - 2, w: 3, d: 4, r: 0.8 }, 26, 10, { steps: 2, name: "shackle" });
  F.part("o", "morph", { x: cx - 8, y: cy - 2, w: 16, d: 4, r: 0.8 }, 36, 3, { steps: 2, name: "shackle.top" });
}
