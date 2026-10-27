// 2.7 · Rail-optimized fabric: GPU k of every node goes to leaf k. Four of eight rails are drawn.
export const spec = { id: "t2-7", width: 620, height: 520, azimuth: 24, elevation: 20 };
const L = (ru, en, es) => ({ ru, en, es });
const rail = (k) => ({ id: "r" + k, kw: k === 0 ? "rail|leaf switch N|NIC N" : null, name: L(`Rail ${k}`, `Rail ${k}`, `Riel ${k}`), read: L(`GPU ${k} каждого узла → leaf ${k}: обмен между GPU ${k} разных узлов в один хоп`, `GPU ${k} of every node → leaf ${k}: GPU ${k} to GPU ${k} across nodes is one hop`, `La GPU ${k} de cada nodo → leaf ${k}: entre GPU ${k} de nodos distintos hay un salto`) });
export const meta = {
  id: spec.id, topic: "2.7",
  title: L("Rail-optimized фабрика", "Rail-optimized fabric", "Red optimizada por rieles"),
  cap: L("У каждого GPU свой порт, и порт N каждого узла идёт в свой leaf N. Показаны 4 из 8 rails; сверху spine.", "Each GPU has its own port, and port N of every node goes to its own leaf N. Four of the eight rails are drawn; the spine sits on top.", "Cada GPU tiene su propio puerto y el puerto N de cada nodo va a su leaf N. Se dibujan 4 de los 8 rieles; arriba está el spine."),
  nodes: [rail(0), rail(1), rail(2), rail(3),
    { id: "node", kw: "east-west|node", name: L("Узлы", "Nodes", "Nodos"), read: L("4 узла по 8 GPU · по одному порту 400G на GPU", "4 nodes with 8 GPUs each · one 400G port per GPU", "4 nodos de 8 GPU · un puerto de 400G por GPU") },
    { id: "spine", kw: "fat-tree|non-blocking|bisection|spine", name: L("Spine", "Spine", "Spine"), read: L("Связывает rails · fat-tree 1:1 даёт полную бисекционную полосу", "Joins the rails · a 1:1 fat-tree gives full bisection bandwidth", "Une los rieles · un fat-tree 1:1 da todo el ancho de bisección") },
  ],
};
export function build(F) {
  // three tiers in one open frame, read bottom to top: GPU nodes, one leaf per rail, the spine.
  // Rail k cables share one colour: GPU k of every node lands on leaf k.
  F.base({ x: -20, y: -104, w: 92, d: 208, r: 6 }, 7);
  const I = F.rack("racks", null, { x: 0, y: -92, w: 40, d: 184, r: 1 }, 124, { name: "frame" });
  const XF = I.x + I.w;
  for (const z of [42, 84]) F.part("racks", null, I, z, 2, { steps: 2, tone: "lo", name: "shelf" }, "", -1);
  const W = 41, G = 4, y0 = I.y + 2;
  const at = (j) => ({ x: I.x, y: y0 + j * (W + G), w: I.w, d: W, r: 0.6 });
  const port = (plan, z, h, n, pitch, i) => { const a0 = plan.y, a1 = plan.y + plan.d, pw = Math.min((a1 - a0) * 0.62, n * pitch), s0 = a1 - 3 - pw, span = pw / n; return [XF, s0 + (i + 0.5) * span, z + h * 0.3 + Math.min(h * 0.45, 3.4) / 2]; };
  const NZ = 3, NH = 18, LZ = 44, LH = 9, SZ = 86, SH = 9;
  for (let n = 0; n < 4; n++) F.unit("racks", "node", at(n), NZ, NH, { face: "x", ports: 4, pitch: 5, bays: 3, name: "node" });
  for (let r = 0; r < 4; r++) F.unit("racks", "r" + r, at(r), LZ, LH, { face: "x", ports: 6, pitch: 4, name: "leaf" });
  for (const s of [0, 1]) F.unit("racks", "spine", { ...at(0), y: y0 + 22 + s * 90, d: 50 }, SZ, SH, { face: "x", ports: 4, pitch: 5, name: "spine" });
  const tone = ["green", "blue", "red", "hi"];
  for (let n = 0; n < 4; n++) for (let r = 0; r < 4; r++) {
    const a = port(at(n), NZ, NH, 4, 5, r), b = port(at(r), LZ, LH, 6, 4, n);
    const x = XF + 3 + r * 2.2 + n * 0.5, zr = b[2];
    F.wire("cables", "r" + r, [a, [x, a[1], a[2]], [x, a[1], zr], [x, b[1], zr], b], { name: "rail.cable", tone: tone[r], width: 1.1 });
  }
  for (let r = 0; r < 4; r++) for (const s of [0, 1]) {
    const a = port(at(r), LZ, LH, 6, 4, 4 + s), b = port({ ...at(0), y: y0 + 22 + s * 90, d: 50 }, SZ, SH, 4, 5, r);
    const x = XF + 13 + r * 1.2 + s * 0.6;
    F.wire("cables", "spine", [a, [x, a[1], a[2]], [x, a[1], b[2]], [x, b[1], b[2]], b], { name: "uplink", tone: "faint" });
  }
}
