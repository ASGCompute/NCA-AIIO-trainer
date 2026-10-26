// 2.7 · Rail-optimized fabric: GPU k of every node goes to leaf k. Four of eight rails are drawn.
export const spec = { id: "t2-7", width: 620, height: 470, azimuth: 30, elevation: 26 };
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
  F.base({ x: -24, y: -130, w: 120, d: 260, r: 6 }, 7);
  const A = F.rack("racks", null, { x: 0, y: -112, w: 50, d: 72, r: 1 }, 112, { name: "rackA" });
  const B = F.rack("racks", null, { x: 0, y: 40, w: 50, d: 72, r: 1 }, 112, { name: "rackB" });
  const X = A.x + A.w;
  for (let i = 0; i < 4; i++) F.unit("racks", "node", A, 6 + i * 24, 18, { face: "x", ports: 4, pitch: 5, bays: 3, name: "node" });
  for (let j = 0; j < 4; j++) F.unit("racks", "r" + j, B, 10 + j * 20, 9, { face: "x", ports: 8, pitch: 4, name: "leaf" });
  F.unit("racks", "spine", B, 94, 9, { face: "x", ports: 8, pitch: 4, name: "spine" });
  // node ports: 4 × 5 wide ending 3 before the face edge; leaf ports: 8 × 4 wide
  const np = (k) => A.y + A.d - 3 - 20 + 2.5 + 5 * k, lp = (i) => B.y + B.d - 3 - 32 + 2 + 4 * i;
  for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) {
    const zp = 6 + i * 24 + 18 * 0.3 + 1.7, zl = 10 + k * 20 + 9 * 0.3 + 1.7, x = 56 + k * 4.5 + i * 0.9;
    F.wire("cables", "r" + k, [[X, np(k), zp], [x, np(k), zp], [x, lp(i), zp], [x, lp(i), zl], [X, lp(i), zl]], { name: "rail.cable" });
  }
  for (let j = 0; j < 4; j++) {
    const zl = 10 + j * 20 + 9 * 0.3 + 1.7, zs = 94 + 9 * 0.3 + 1.7, x = 76 + j * 2;
    F.wire("cables", "spine", [[X, lp(7), zl], [x, lp(7), zl], [x, lp(7), zs], [x, lp(j), zs], [X, lp(j), zs]], { name: "uplink", tone: "faint" });
  }
}
