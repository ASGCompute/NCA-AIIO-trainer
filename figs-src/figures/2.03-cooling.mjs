// 2.3 · Power and cooling: a contained cold aisle between two rows of AI racks, rear-door coolers,
// and a CDU feeding direct-to-chip cold plates.
export const spec = { id: "t2-3", width: 620, height: 460, azimuth: 18, elevation: 40 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.3",
  title: L("Питание и охлаждение", "Power and cooling", "Energía y refrigeración"),
  cap: L("Холодный воздух идёт в изолированный коридор, горячий уходит назад через теплообменник. Самые горячие чипы охлаждает жидкость от CDU.", "Cold air goes into a contained aisle and hot air leaves through a rear-door exchanger. Liquid from the CDU cools the hottest chips.", "El aire frío entra en un pasillo aislado y el caliente sale por un intercambiador trasero. El líquido de la CDU enfría los chips más calientes."),
  nodes: [
    { id: "rack", kw: "rack|kW|density|10\\.2|DGX H100 systems per rack", name: L("AI-стойки", "AI racks", "Racks de IA"), read: L("40–130+ кВт на стойку против 5–15 кВт обычной · воздух не справляется", "40–130+ kW per rack versus 5–15 kW for a typical one · air can't keep up", "40–130+ kW por rack frente a 5–15 kW de uno normal · el aire no da abasto") },
    { id: "cold", kw: "aisle|contain|mix", name: L("Холодный коридор", "Cold aisle", "Pasillo frío"), read: L("Изоляция коридора: горячий выдув не смешивается с холодным входом", "Aisle containment: hot exhaust never mixes with cold intake", "Contención del pasillo: el aire caliente no se mezcla con el frío") },
    { id: "rdhx", kw: "rear-door|exhaust|heat exchanger", name: L("Rear-door", "Rear door", "Puerta trasera"), read: L("Теплообменник на задней двери охлаждает горячий воздух жидкостью", "A liquid coil on the rear door cools the hot exhaust", "Un serpentín de líquido en la puerta trasera enfría el aire caliente") },
    { id: "cdu", kw: "liquid|direct-to-chip|cold plate|CDU|coolant", name: L("CDU и cold plates", "CDU and cold plates", "CDU y placas frías"), read: L("Direct-to-chip: жидкость к пластинам на чипах, тепло уходит через CDU", "Direct-to-chip: coolant to plates on the chips, heat leaves through the CDU", "Directo al chip: líquido a placas sobre los chips; el calor sale por la CDU") },
    { id: "pue", kw: "PUE|efficien|overhead", name: L("PUE", "PUE", "PUE"), read: L("PUE = вся мощность ЦОД / мощность IT · 1,5 МВт / 1 МВт = 1,5", "PUE = total facility power / IT power · 1.5 MW / 1 MW = 1.5", "PUE = potencia total / potencia de TI · 1,5 MW / 1 MW = 1,5") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -16, y: -84, w: 136, d: 200, r: 6 }, 7);
  const aisle = { x: 0, y: -26, w: 100, d: 52, r: 0.5 };
  F.part("floor", "cold", aisle, 0, 0.6, { tone: "lo", bevel: 0, crease: "none", name: "tiles" }, F.grid(aisle, 0.6, 13) + F.dots([...Array(14)].flatMap((_, i) => [...Array(4)].map((__, j) => [5 + i * 7, -19 + j * 13, 0.6])), { size: 0.4, tone: "lo" }), -5);
  for (let i = 0; i < 3; i++) {
    const a = { x: i * 34, y: -64, w: 32, d: 38, r: 0.8 }, b = { x: i * 34, y: 26, w: 32, d: 34, r: 0.8 };
    F.part("racks", "rack", a, 0, 100, { steps: 2, inner: F.faceRows("y", a, [12, 24, 36, 48, 60, 72, 84]), name: "rackA" }, F.dots([[a.x + 3, a.y + a.d, 95]], { size: 0.55, tone: "hi" }));
    F.part("racks", "rack", b, 0, 100, { steps: 2, name: "rackB" });
    const door = { x: b.x + 1, y: 60, w: 30, d: 3, r: 0.6 };
    F.part("racks", "rdhx", door, 2, 94, { steps: 2, inner: F.faceLines("y", door, 2, 96, 2.2), name: "rdhx" });
  }
  F.part("roof", "cold", { x: 0, y: -26, w: 100, d: 52, r: 0.5 }, 100, 2, { steps: 2, bevel: 0.3, name: "roof" }, F.finsTop({ x: 0, y: -26, w: 100, d: 52, r: 0.5 }, 102, 10, "y"));
  const CDU = { x: 30, y: 74, w: 44, d: 26, r: 1 };
  F.part("cdu", "cdu", CDU, 0, 64, { steps: 2, inner: F.faceRows("x", CDU, [16, 48]), name: "cdu" }, F.dots([[74, 78, 58], [74, 82, 58]], { size: 0.55, tone: "hi" }) + F.line(F.rectX(74, 84, 96, 30, 40)));
  for (let i = 0; i < 3; i++) for (const [y, zz] of [[-45, 112], [43, 118]]) {
    const x = i * 34 + 16, sx = 36 + i * 4 + (y > 0 ? 2 : 0), z = zz + i * 1.6;
    F.wire("pipes", "cdu", [[sx, 87, 64], [sx, 87, z], [sx, y, z], [x, y, z], [x, y, 100]], { name: "coolant", width: 1.5, tone: "mid" });
  }
  const M = { x: 84, y: 76, w: 10, d: 22, r: 0.8 };
  F.part("cdu", "pue", { x: 86, y: 80, w: 6, d: 14, r: 0.5 }, 0, 30, { steps: 2, tone: "lo", name: "post" });
  F.part("cdu", "pue", M, 30, 16, { steps: 2, tone: "hi", crease: "lo", name: "meter" }, F.line(F.rectX(94, 80, 94, 34, 43)) + F.dots([[94, 96, 44]], { size: 0.6, tone: "hi" }));
}
