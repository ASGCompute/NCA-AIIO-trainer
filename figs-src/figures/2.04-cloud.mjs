// 2.4 · On-prem and cloud: your own room with a few racks and a heavy data store, a cloud hall with rows of
// racks, and the link between them where bursting happens and egress is metered.
export const spec = { id: "t2-4", width: 620, height: 420, azimuth: 42, elevation: 30 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.4",
  title: L("On-prem и облако", "On-prem and cloud", "On-prem y nube"),
  cap: L("Своя площадка выгодна при постоянной загрузке и строгих требованиях к данным. Облако — для пиков и быстрого старта. Гибрид сочетает оба.", "Your own site pays off at steady load and strict data rules. The cloud suits peaks and a quick start. Hybrid combines both.", "Un sitio propio compensa con carga constante y reglas de datos estrictas. La nube sirve para picos y un arranque rápido. El híbrido combina ambos."),
  nodes: [
    { id: "onprem", kw: "on-prem|CapEx|capital|own|control|in-country", name: L("On-prem", "On-prem", "On-prem"), read: L("CapEx · дешевле при загрузке 24/7 · полный контроль над данными", "CapEx · cheaper at 24/7 load · full control of the data", "CapEx · más barato con carga 24/7 · control total de los datos") },
    { id: "cloud", kw: "cloud|OpEx|elastic|pay-as-you-go|unpredictable|startup", name: L("Облако", "Cloud", "Nube"), read: L("OpEx · эластично и без закупки железа · дорого при постоянной нагрузке", "OpEx · elastic, no hardware to buy · expensive at constant load", "OpEx · elástico y sin comprar hardware · caro con carga constante") },
    { id: "burst", kw: "burst|hybrid|peak", name: L("Cloud bursting", "Cloud bursting", "Cloud bursting"), read: L("База на своём кластере, пики уходят в облако", "Baseline on your own cluster, peaks go to the cloud", "La base en tu clúster, los picos van a la nube") },
    { id: "egress", kw: "egress|fee", name: L("Egress", "Egress", "Egress"), read: L("Плата за выгрузку данных из облака растёт с объёмом", "Fees for moving data out of the cloud grow with volume", "Las tarifas por sacar datos de la nube crecen con el volumen") },
    { id: "data", kw: "gravity|data is hard to move|residency|sovereign", name: L("Гравитация данных", "Data gravity", "Gravedad de los datos"), read: L("Большие данные дорого двигать, поэтому вычисления ставят рядом с ними", "Big data is costly to move, so compute is placed next to it", "Mover muchos datos es caro, así que el cómputo se pone junto a ellos") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -16, y: -132, w: 168, d: 264, r: 6 }, 7);
  const ROOM = { x: 0, y: -118, w: 90, d: 82, r: 1 };
  F.part("on", "onprem", ROOM, 0, 3, { steps: 2, tone: "lo", name: "room.floor" }, "", -4);
  F.part("on", "onprem", { x: 0, y: -118, w: 3, d: 82, r: 0.4 }, 3, 50, { steps: 1, bevel: 0, name: "wall" }, "", -3);
  F.part("on", "onprem", { x: 3, y: -118, w: 87, d: 3, r: 0.4 }, 3, 50, { steps: 1, bevel: 0, name: "wall" }, "", -3);
  for (let i = 0; i < 3; i++) { const r = { x: 12 + i * 22, y: -106, w: 18, d: 24, r: 0.6 }; F.part("on", "onprem", r, 3, 46, { steps: 2, inner: F.faceRows("y", r, [13, 23, 33, 43]), name: "rack" }, F.dots([[r.x + 2, r.y + r.d, 46]], { size: 0.5, tone: "hi" })); }
  for (let j = 0; j < 3; j++) F.cyl("on", "data", 30, -58, 12, 3 + j * 9, 9, { steps: 36, tone: j === 2 ? "hi" : "mid", crease: "lo", name: "data" }, F.line(k.sideArc(30, -58, 12, 3 + j * 9 + 4, F.P, 32), { tone: "faint" }));
  F.cyl("on", "data", 62, -56, 9, 3, 18, { steps: 32, name: "data2" }, F.line(k.sideArc(62, -56, 9, 12, F.P, 28), { tone: "faint" }));
  const HALL = { x: 0, y: 10, w: 136, d: 110, r: 1 };
  F.part("cl", "cloud", HALL, 0, 3, { steps: 2, tone: "lo", name: "hall" }, F.grid(HALL, 3, 11), -4);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 5; i++) { const r = { x: 10 + i * 24, y: 20 + row * 32, w: 18, d: 22, r: 0.6 }; F.part("cl", "cloud", r, 3, 40, { steps: 2, inner: F.faceRows("y", r, [13, 23, 33]), name: "rack" }); }
  // the cloud provider's hall gets a roof and a cloud on top, so it reads as "someone else's data center"
  F.part("cl", "cloud", { x: 8, y: 18, w: 122, d: 94, r: 1.2 }, 43, 2, { steps: 2, tone: "mid", name: "roof" }, "", 0);
  F.cyl("cl", "cloud", 70, 64, 30, 45, 7, { steps: 48, tone: "hi", crease: "lo", name: "cloud.base" });
  F.cyl("cl", "cloud", 58, 56, 13, 52, 8, { steps: 36, tone: "hi", crease: "lo", name: "puff" });
  F.cyl("cl", "cloud", 82, 70, 11, 52, 7, { steps: 36, tone: "hi", crease: "lo", name: "puff" });
  F.unit("link", "egress", { x: 52, y: -22, w: 22, d: 16, r: 1 }, 0, 12, { face: "x", name: "meter" });
  F.wire("link", "burst", [[45, -36, 3], [45, -30, 3], [63, -30, 3], [63, -22, 3]], { name: "link", width: 1.4, tone: "mid" });
  F.wire("link", "burst", [[63, -6, 3], [63, 2, 3], [63, 2, 3], [63, 10, 3]], { name: "link", width: 1.4, tone: "mid" });
}
