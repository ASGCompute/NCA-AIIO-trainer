// 2.2 · Scale-up vs scale-out: one NVLink domain on an HGX board, then more nodes over InfiniBand.
export const spec = { id: "t2-2", width: 620, height: 400, azimuth: 40, elevation: 32 };
export const meta = {
  id: spec.id, topic: "2.2",
  title: { ru: "Scale-up и scale-out", en: "Scale-up and scale-out", es: "Scale-up y scale-out" },
  cap: { ru: "Слева один NVLink-домен: восемь GPU связаны через NVSwitch. Справа узлы соединены InfiniBand: так кластер растёт вширь.", en: "On the left, one NVLink domain: eight GPUs linked through NVSwitch. On the right, nodes joined by InfiniBand: that is how a cluster grows out.", es: "A la izquierda, un dominio NVLink: ocho GPU unidas por NVSwitch. A la derecha, nodos unidos por InfiniBand: así crece el clúster hacia fuera." },
  nodes: [
    { id: "nvs", kw: "NVSwitch|NVLink|scale.?up|NVL72", name: { ru: "NVLink и NVSwitch", en: "NVLink and NVSwitch", es: "NVLink y NVSwitch" }, read: { ru: "Scale-up: каждый GPU говорит с каждым через NVSwitch · 900 ГБ/с на GPU (H100)", en: "Scale-up: every GPU talks to every other through NVSwitch · 900 GB/s per GPU (H100)", es: "Scale-up: cada GPU habla con todas a través de NVSwitch · 900 GB/s por GPU (H100)" } },
    { id: "gpu", kw: "tensor|model parallel|fit in a single GPU", name: { ru: "GPU узла", en: "GPUs in a node", es: "GPU del nodo" }, read: { ru: "Один NVLink-домен · здесь держат tensor parallelism: обмен на каждом слое", en: "One NVLink domain · tensor parallelism lives here: it exchanges data every layer", es: "Un dominio NVLink · aquí vive el paralelismo de tensor: intercambia datos en cada capa" } },
    { id: "node", kw: "scale.?out|more nodes|data.parallel|pipeline", name: { ru: "Узлы", en: "Nodes", es: "Nodos" }, read: { ru: "Scale-out: больше узлов · data parallel и pipeline идут между узлами", en: "Scale-out: more nodes · data and pipeline parallelism run between nodes", es: "Scale-out: más nodos · el paralelismo de datos y de pipeline va entre nodos" } },
    { id: "ib", kw: "InfiniBand|network|gradient|all-reduce|bottleneck", name: { ru: "InfiniBand", en: "InfiniBand", es: "InfiniBand" }, read: { ru: "NDR 400 Гб/с ≈ 50 ГБ/с на порт · по ней идёт all-reduce градиентов", en: "NDR 400 Gb/s ≈ 50 GB/s per port · gradient all-reduce runs over it", es: "NDR 400 Gb/s ≈ 50 GB/s por puerto · por ella va el all-reduce de gradientes" } },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -14, y: -84, w: 316, d: 168, r: 6 }, 8);
  const B = { x: 0, y: -70, w: 132, d: 140, r: 2 };
  const GX = [20, 48, 76, 104], tr = [];
  for (const gx of GX) for (const s of [-1, 1]) for (const sx of GX) tr.push(F.lineTop([gx + (sx - gx) * 0.08, s * 27], [sx, s * 8], 3));
  F.part("up", "nvs", B, 0, 3, { bevel: 0.6, tint: "pcb", name: "hgx.board" }, F.traces(tr.join("")) + F.line(k.planOutline(k.insetPlan(B, 3.5), 3, F.P, 3), { tone: "faint" }) + F.dots(k.corners(B, 4).map(([x, y]) => [x, y, 3])), -10);
  for (const gx of GX) {
    F.part("up", "nvs", { x: gx - 7, y: -7, w: 14, d: 14, r: 0.6 }, 3, 4, { steps: 2, tone: "hi", crease: "lo", tint: "die", name: "nvs" });
    for (const gy of [-42, 42]) {
      const m = { x: gx - 12, y: gy - 15, w: 24, d: 30, r: 1 };
      F.part("up", "gpu", m, 3, 2, { steps: 2, tint: "pcb", name: "sxm" }, F.dots(k.corners(m, 1.8).map(([x, y]) => [x, y, 5]), { size: 0.35 }));
      const fin = { x: gx - 11, y: gy - 13, w: 22, d: 26, r: 1 };
      F.part("up", "gpu", fin, 5, 17, { steps: 2, tone: "hi", crease: "lo", inner: F.faceLines("x", fin, 5, 22, 2.4), name: "sink" }, F.finsTop(fin, 22, 2.4));
    }
  }
  // scale-out: four nodes, each with a 400G cable up to a leaf switch on a stand
  const NX = 172, SW = { x: 252, y: -44, w: 30, d: 88, r: 1 };
  F.part("out", null, { x: 254, y: -26, w: 26, d: 52, r: 1 }, 0, 34, { steps: 2, tone: "lo", name: "stand" }, F.seam({ x: 254, y: -26, w: 26, d: 52, r: 1 }, 17, 2));
  F.unit("out", "ib", SW, 34, 9, { face: "x", ports: 16, pitch: 4, vents: 3, name: "leaf" });
  for (let i = 0; i < 4; i++) {
    const n = { x: NX, y: -70 + i * 36, w: 48, d: 31, r: 1 };
    F.unit("out", "node", n, 0, 22, { face: "x", ports: 2, pitch: 5, bays: 4, vents: 3, name: "node" });
    const y0 = n.y + n.d - 8, ye = -8 + i * 6, z = 7 + i * 1.6, xr = 232 + i * 3, xf = 290 + i * 2.5, ys = i < 2 ? -32 - i * 3 : 32 + (i - 2) * 3;
    F.wire("out", "ib", [[n.x + n.w, y0, z], [xr, y0, z], [xr, ys, z], [xf, ys, z], [xf, ye, z], [xf, ye, 38.4], [282, ye, 38.4]], { name: "ib.cable" });
  }
}
