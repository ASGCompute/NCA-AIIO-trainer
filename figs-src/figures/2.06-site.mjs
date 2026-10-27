// 2.6 · Site requirements: a heavy rack on a raised floor, A and B power paths (2N) through two UPS units
// to a generator, and an overhead tray for fibre.
export const spec = { id: "t2-6", width: 620, height: 440, azimuth: 40, elevation: 30 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.6",
  title: L("Площадка под AI-стойку", "A site for an AI rack", "Un sitio para un rack de IA"),
  cap: L("Сначала проверяют питание, охлаждение, нагрузку на пол и место. Питание идёт двумя независимыми путями A и B.", "Power, cooling, floor load and space are checked first. Power arrives over two independent paths, A and B.", "Primero se revisan energía, refrigeración, carga del suelo y espacio. La energía llega por dos caminos independientes, A y B."),
  nodes: [
    { id: "rack", kw: "floor|weight|kg|heavy|delivery", name: L("Стойка и пол", "Rack and floor", "Rack y suelo"), read: L("DGX ~130 кг, стойка GB200 NVL72 ~1,4 т · проверить фальшпол и путь доставки", "A DGX is ~130 kg, a GB200 NVL72 rack ~1.4 t · check the raised floor and the delivery path", "Un DGX pesa ~130 kg, un rack GB200 NVL72 ~1,4 t · revisa el falso suelo y el acceso") },
    { id: "feed", kw: "2N|A/B|independent|three-phase|feed", name: L("Пути A и B", "Paths A and B", "Caminos A y B"), read: L("2N: два независимых пути, каждый тянет всю нагрузку · трёхфазное питание", "2N: two independent paths, each carrying the full load · three-phase power", "2N: dos caminos independientes, cada uno con toda la carga · energía trifásica") },
    { id: "ups", kw: "UPS|battery|N\\+1|spare", name: L("ИБП", "UPS", "SAI"), read: L("Держит нагрузку минуты, пока стартует генератор · N+1 — один запасной модуль", "Carries the load for minutes until the generator starts · N+1 means one spare module", "Sostiene la carga minutos hasta que arranca el generador · N+1 es un módulo de reserva") },
    { id: "gen", kw: "generator|diesel|outage", name: L("Генератор", "Generator", "Generador"), read: L("Дизель-генератор берёт нагрузку при долгом отключении сети", "A diesel generator takes the load during a long outage", "Un generador diésel toma la carga en un corte largo") },
    { id: "tray", kw: "fiber|fibre|optical|cable|DAC|transceiver", name: L("Кабельный лоток", "Cable tray", "Bandeja de cables"), read: L("Между стойками 400G идёт по оптике (AOC или трансиверы) · медь DAC — до ~3 м", "400G between racks runs on fibre (AOC or transceivers) · copper DAC reaches ~3 m", "Entre racks, 400G va por fibra (AOC o transceptores) · el cobre DAC llega a ~3 m") },
  ],
};
export function build(F) {
  F.base({ x: -60, y: -90, w: 260, d: 180, r: 6 }, 7);
  const FLOOR = { x: -46, y: -76, w: 100, d: 152, r: 1 };
  F.part("site", "rack", FLOOR, 0, 4, { steps: 2, tone: "lo", bevel: 0, name: "raised.floor" }, F.grid(FLOOR, 4, 12.6), -3);
  const R = { x: -20, y: -24, w: 42, d: 44, r: 1 };
  F.part("site", "rack", R, 4, 108, { steps: 2, inner: F.faceRows("x", R, [20, 36, 52, 68, 84, 100]), name: "rack" }, F.dots([[22, -20, 108]], { size: 0.55, tone: "hi" }));
  for (const [y, sel] of [[-14, "feed"], [8, "feed"]]) F.part("site", sel, { x: 22, y, w: 3, d: 4, r: 0.6 }, 10, 90, { steps: 1, bevel: 0, tone: "hi", crease: "lo", name: "pdu" }, F.dots([30, 50, 70, 90].map((z) => [25, y + 2, z]), { size: 0.4 }));
  const UA = { x: 92, y: -70, w: 34, d: 40, r: 1 }, UB = { x: 92, y: 30, w: 34, d: 40, r: 1 };
  for (const U of [UA, UB]) F.unit("site", "ups", U, 0, 44, { face: "x", bays: 4, name: "ups" });
  const G = { x: 150, y: -26, w: 44, d: 52, r: 2 };
  F.part("site", "gen", G, 0, 34, { steps: 3, inner: F.seam(G, 24, 3), name: "gen" }, F.line(F.rectX(194, -16, 16, 6, 20)) + F.faceLines("x", { x: 150, y: -14, w: 44, d: 28, r: 0 }, 7, 19, 3));
  F.cyl("site", "gen", 160, 14, 3.5, 34, 22, { steps: 20, name: "exhaust" });
  F.wire("power", "feed", [[25, -12, 12], [60, -12, 12], [60, -50, 12], [92, -50, 12]], { name: "feedA", width: 1.3, tone: "mid" });
  F.wire("power", "feed", [[25, 10, 12], [70, 10, 12], [70, 50, 12], [92, 50, 12]], { name: "feedB", width: 1.3, tone: "mid" });
  F.wire("power", "gen", [[126, -50, 20], [138, -50, 20], [138, -10, 20], [150, -10, 20]], { name: "genA", width: 1.3 });
  F.wire("power", "gen", [[126, 50, 20], [140, 50, 20], [140, 10, 20], [150, 10, 20]], { name: "genB", width: 1.3 });
  // overhead tray on two posts with fibre runs
  for (const y of [-64, 60]) F.part("tray", "tray", { x: -40, y, w: 4, d: 4, r: 0.6 }, 4, 124, { steps: 1, bevel: 0, name: "tray.post" });
  const T = { x: -44, y: -66, w: 12, d: 134, r: 0.8 };
  F.part("tray", "tray", T, 128, 4, { steps: 2, name: "tray" }, F.finsTop({ x: -44, y: -66, w: 12, d: 134, r: 0 }, 132, 12, "x"));
  F.wire("tray", "tray", [[-34, 0, 132], [-34, 0, 134], [0, 0, 134], [0, 0, 112]], { name: "fibre", ends: "to" });
}
