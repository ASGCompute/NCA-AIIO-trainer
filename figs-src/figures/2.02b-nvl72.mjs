// 2.2+ · Grace Blackwell NVL72: one NVLink domain of 72 GPUs in one liquid-cooled rack.
// Layout after the GB200 NVL72 reference: 18 compute trays (2 GB200 superchips each), 9 NVLink switch trays in the
// middle, power shelves top and bottom, the copper NVLink spine and coolant manifolds at the rear, a CDU beside it.
export const spec = {
  id: "t2-2b", width: 600, height: 660, azimuth: 50, elevation: 24,
  stagger: ["hero"], moves: { hero: [62, 0, 0] },
};
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.2", isNew: true, explode: true,
  title: L("Стойка GB200 NVL72", "The GB200 NVL72 rack", "El rack GB200 NVL72"),
  cap: L("72 GPU Blackwell и 36 CPU Grace в одной стойке связаны NVLink в один домен: стойка работает как один огромный GPU. Охлаждение только жидкостное.", "72 Blackwell GPUs and 36 Grace CPUs in one rack share a single NVLink domain, so the rack works like one giant GPU. Cooling is liquid only.", "72 GPU Blackwell y 36 CPU Grace en un rack comparten un solo dominio NVLink: el rack funciona como una GPU gigante. La refrigeración es solo líquida."),
  nodes: [
    { id: "rack", kw: "NVL72|rack-scale|GB200|GB300", name: L("Стойка NVL72", "NVL72 rack", "Rack NVL72"), read: L("72 GPU + 36 CPU · ~120 кВт · ~1,4 т · GB300: 72 Blackwell Ultra, 20 ТБ HBM3e", "72 GPUs + 36 CPUs · ~120 kW · ~1.4 t · GB300: 72 Blackwell Ultra, 20 TB HBM3e", "72 GPU + 36 CPU · ~120 kW · ~1,4 t · GB300: 72 Blackwell Ultra, 20 TB HBM3e") },
    { id: "tray", kw: "compute tray|superchip|Grace Blackwell", name: L("Вычислительный лоток", "Compute tray", "Bandeja de cómputo"), read: L("18 лотков · в каждом 2 суперчипа GB200 = 2 Grace + 4 Blackwell", "18 trays · each holds 2 GB200 superchips = 2 Grace + 4 Blackwell", "18 bandejas · cada una con 2 superchips GB200 = 2 Grace + 4 Blackwell") },
    { id: "gpu", kw: "Blackwell|B200|B300|two dies|HBM3e", name: L("GPU Blackwell", "Blackwell GPU", "GPU Blackwell"), read: L("Два кристалла в одном корпусе · 186 ГБ HBM3e (GB200), 288 ГБ (GB300) · 13,4 ТБ на стойку", "Two dies in one package · 186 GB HBM3e (GB200), 288 GB (GB300) · 13.4 TB per rack", "Dos chips en un encapsulado · 186 GB HBM3e (GB200), 288 GB (GB300) · 13,4 TB por rack") },
    { id: "cpu", kw: "Grace|NVLink-C2C|LPDDR5X|Arm", name: L("CPU Grace", "Grace CPU", "CPU Grace"), read: L("72 ядра Arm Neoverse V2 · 480 ГБ LPDDR5X · с GPU по NVLink-C2C 900 ГБ/с", "72 Arm Neoverse V2 cores · 480 GB LPDDR5X · NVLink-C2C to the GPUs at 900 GB/s", "72 núcleos Arm Neoverse V2 · 480 GB LPDDR5X · NVLink-C2C con las GPU a 900 GB/s") },
    { id: "nvsw", kw: "NVLink Switch|switch tray|NVLink 5", name: L("Лотки NVLink Switch", "NVLink Switch trays", "Bandejas NVLink Switch"), read: L("9 лотков по 2 чипа NVLink Switch · 1,8 ТБ/с на GPU · 130 ТБ/с на стойку", "9 trays with 2 NVLink Switch chips each · 1.8 TB/s per GPU · 130 TB/s per rack", "9 bandejas con 2 chips NVLink Switch · 1,8 TB/s por GPU · 130 TB/s por rack") },
    { id: "spine", kw: "spine|copper|cable cartridge", name: L("Медный NVLink-spine", "Copper NVLink spine", "Spine NVLink de cobre"), read: L("Тысячи медных пар сзади стойки: все 72 GPU со всеми, без оптики", "Thousands of copper pairs at the back: all 72 GPUs to all, no optics", "Miles de pares de cobre atrás: las 72 GPU con todas, sin óptica") },
    { id: "liquid", kw: "liquid|CDU|cold plate|manifold|direct-to-chip", name: L("Жидкостное охлаждение", "Liquid cooling", "Refrigeración líquida"), read: L("Cold plates на каждом чипе · коллекторы сзади · CDU отдаёт тепло контуру здания", "Cold plates on every chip · manifolds at the back · the CDU hands heat to the building loop", "Cold plates en cada chip · colectores atrás · la CDU pasa el calor al circuito del edificio") },
    { id: "power", kw: "power shelf|busbar|54 V|kW", name: L("Питание", "Power", "Energía"), read: L("Силовые полки по 33 кВт сверху и снизу · шина 54 В DC сзади", "33 kW power shelves top and bottom · 54 V DC busbar at the back", "Estantes de 33 kW arriba y abajo · barra de 54 V CC atrás") },
    { id: "net", kw: "ConnectX|SuperNIC|scale-out|SuperPOD", name: L("Сеть наружу", "Scale-out network", "Red hacia fuera"), read: L("На каждый GPU свой порт: 400G ConnectX-7 (GB200), 800G ConnectX-8 (GB300)", "One port per GPU: 400G ConnectX-7 (GB200), 800G ConnectX-8 (GB300)", "Un puerto por GPU: 400G ConnectX-7 (GB200), 800G ConnectX-8 (GB300)") },
  ],
  steps: [
    { node: "rack", ex: 0, flow: [], t: L("Это не сервер, а одна машина размером со стойку: 72 GPU Blackwell и 36 CPU Grace. Около 120 кВт и ~1,4 тонны.", "This isn't a server but one rack-sized machine: 72 Blackwell GPUs and 36 Grace CPUs. About 120 kW and ~1.4 tonnes.", "No es un servidor sino una máquina del tamaño de un rack: 72 GPU Blackwell y 36 CPU Grace. Unos 120 kW y ~1,4 toneladas.") },
    { node: "tray", ex: 1, flow: [], t: L("Выдвигаем вычислительный лоток. В нём 2 суперчипа GB200: каждый — 1 Grace и 2 Blackwell. Таких лотков 18.", "Slide out a compute tray. It holds 2 GB200 superchips, each 1 Grace and 2 Blackwell. There are 18 such trays.", "Sacamos una bandeja de cómputo. Lleva 2 superchips GB200, cada uno con 1 Grace y 2 Blackwell. Hay 18 bandejas.") },
    { node: "gpu", flow: [], t: L("Каждый Blackwell — два кристалла в одном корпусе с HBM3e по бокам: 186 ГБ в GB200, 288 ГБ в GB300.", "Each Blackwell is two dies in one package with HBM3e alongside: 186 GB in GB200, 288 GB in GB300.", "Cada Blackwell son dos chips en un encapsulado con HBM3e a los lados: 186 GB en GB200, 288 GB en GB300.") },
    { node: "cpu", flow: [], t: L("Grace связан со своими двумя GPU по NVLink-C2C (900 ГБ/с): GPU может брать данные прямо из памяти CPU.", "Grace links to its two GPUs over NVLink-C2C (900 GB/s), so a GPU can read straight from CPU memory.", "Grace se une a sus dos GPU por NVLink-C2C (900 GB/s): la GPU puede leer directamente de la memoria de la CPU.") },
    { node: "nvsw", ex: 0, flow: ["spine", "nvsw"], t: L("Задвигаем лоток. В середине 9 лотков NVLink Switch, сзади медный spine: каждый из 72 GPU говорит с каждым на 1,8 ТБ/с.", "Slide the tray back. Nine NVLink Switch trays sit in the middle and a copper spine runs at the back: each of the 72 GPUs talks to every other at 1.8 TB/s.", "Metemos la bandeja. En el centro hay 9 bandejas NVLink Switch y atrás un spine de cobre: cada una de las 72 GPU habla con todas a 1,8 TB/s.") },
    { node: "liquid", flow: ["liquid:cold"], t: L("Воздухом ~120 кВт не охладить. Жидкость идёт к cold plates на каждом чипе, коллекторы собирают её сзади, CDU отдаёт тепло зданию.", "Air can't remove ~120 kW. Coolant reaches cold plates on every chip, manifolds collect it at the back, and the CDU hands the heat to the building.", "El aire no puede con ~120 kW. El líquido llega a cold plates en cada chip, los colectores lo recogen atrás y la CDU pasa el calor al edificio.") },
    { node: "power", flow: ["power:power"], t: L("Питание: силовые полки по 33 кВт сверху и снизу и общая шина 54 В постоянного тока вдоль задней стенки.", "Power: 33 kW shelves at the top and bottom and a shared 54 V DC busbar along the back.", "Energía: estantes de 33 kW arriba y abajo y una barra común de 54 V CC a lo largo de la parte trasera.") },
    { node: "net", flow: ["net"], t: L("Наружу у каждого GPU свой порт: 400G ConnectX-7 в GB200, 800G ConnectX-8 в GB300. Через них стойки собираются в SuperPOD.", "Outward, each GPU has its own port: 400G ConnectX-7 in GB200, 800G ConnectX-8 in GB300. Racks join into a SuperPOD through them.", "Hacia fuera cada GPU tiene su puerto: 400G ConnectX-7 en GB200, 800G ConnectX-8 en GB300. Por ellos los racks forman un SuperPOD.") },
    { node: "", flow: ["spine", "nvsw"], t: L("Итог: в DGX H100 NVLink-домен — 8 GPU в сервере, здесь — 72 GPU в стойке. Tensor parallelism теперь помещается в стойку, а не в сервер.", "So: in a DGX H100 the NVLink domain is 8 GPUs in a server; here it is 72 GPUs in a rack. Tensor parallelism now fits in a rack, not a server.", "En resumen: en un DGX H100 el dominio NVLink son 8 GPU en un servidor; aquí son 72 GPU en un rack. El paralelismo de tensores cabe ahora en un rack.") },
  ],
};

export function build(F) {
  const { k } = F;
  F.base({ x: -40, y: -14, w: 140, d: 76, r: 6 }, 7);
  const I = F.rack("rack", "rack", { x: 0, y: 0, w: 50, d: 30, r: 1 }, 120);
  const U = 3.2, Z0 = 5, TH = 2.5, slot = (s) => Z0 + s * U;
  const TRAY = { x: 8, y: 2, w: 39.5, d: 25, r: 0.4 };
  const kinds = [];
  for (let s = 0; s < 33; s++) kinds.push(s < 3 || s >= 30 ? "power" : s >= 11 && s < 20 ? "nvsw" : "tray");
  const HERO = 25;
  kinds.forEach((kd, s) => {
    const z = slot(s);
    if (s === HERO) return;
    if (kd === "power") F.unit("rack", "power", TRAY, z, TH, { face: "x", vents: 3, led: "mid", name: "power.shelf" });
    else if (kd === "nvsw") F.unit("rack", "nvsw", TRAY, z, TH, { face: "x", tint: "black", led: "hi", name: "nvlink.switch" });
    else F.unit("rack", "tray", TRAY, z, TH, { face: "x", ports: 4, pitch: 3, name: "compute.tray" });
  });
  // the hero tray slides out on its rails: board, two GB200 superchips (Grace + two dual-die Blackwell each)
  const zh = slot(HERO), top = zh + TH;
  F.unit("hero", "tray", TRAY, zh, TH, { face: "x", ports: 4, pitch: 3, name: "compute.tray" });
  for (let s = 0; s < 2; s++) {
    const y0 = 4.4 + s * 11.6;
    F.part("hero", "tray", { x: 11, y: y0, w: 34, d: 10.4, r: 0.4 }, top, 0.15, { steps: 1, bevel: 0, tint: "pcb", name: "superchip.board" }, "", 0.05);
    for (let g = 0; g < 2; g++) {
      const px = 13 + g * 10.5;
      F.part("hero", "gpu", { x: px, y: y0 + 1.4, w: 8.4, d: 7.6, r: 0.3 }, top + 0.15, 0.15, { steps: 1, bevel: 0, tint: "black", name: "gpu.package" }, "", 0.06);
      for (const dx of [1.6, 4.4]) F.part("hero", "gpu", { x: px + dx, y: y0 + 2.4, w: 2.4, d: 5.6, r: 0.2 }, top + 0.3, 0.2, { steps: 1, bevel: 0, tint: "die", name: "gpu.die" }, "", 0.07);
      for (const hx of [0.4, 7.2]) for (let j = 0; j < 4; j++) F.part("hero", "gpu", { x: px + hx, y: y0 + 2.2 + j * 1.5, w: 0.8, d: 1.2, r: 0.1 }, top + 0.3, 0.2, { steps: 1, bevel: 0, tint: "hbm", name: "gpu.hbm" }, "", 0.07);
    }
    F.part("hero", "cpu", { x: 36.4, y: y0 + 2.6, w: 5, d: 5.2, r: 0.3 }, top + 0.15, 0.3, { steps: 1, bevel: 0, tint: "die", name: "grace" }, "", 0.06);
    for (const yy of [y0 + 0.6, y0 + 8.4]) F.part("hero", "cpu", { x: 36, y: yy, w: 6, d: 1.2, r: 0.2 }, top + 0.15, 0.25, { steps: 1, bevel: 0, tint: "black", name: "lpddr" }, "", 0.06);
  }
  // rear zone: copper NVLink spine (outermost), coolant manifolds, the 54 V busbar
  const zLo = slot(3), zHi = slot(29) + TH;
  for (const x of [3.2, 4.6, 6.0]) F.wire("rack", "spine", [[x, 28.6, 3], [x, 28.6, zHi]], { name: "spine", width: 1.4, tone: "mid", r: 0.3 });
  F.part("rack", "power", { x: 2.4, y: 21.6, w: 1.1, d: 1.1, r: 0.2 }, 3, slot(33) - 3, { steps: 1, bevel: 0, tint: "cu", name: "busbar" });
  F.wire("rack", "power", [[3.0, 23.4, 3], [3.0, 23.4, slot(15)]], { name: "busbar.feed", tone: "faint", r: 0.2, ends: "none" });
  F.wire("rack", "power", [[3.0, 23.4, slot(33) - 1], [3.0, 23.4, slot(15)]], { name: "busbar.feed", tone: "faint", r: 0.2, ends: "none" });
  F.wire("rack", "liquid", [[5.4, 25.8, slot(30)], [5.4, 25.8, 3]], { name: "manifold.supply", width: 1.6, tone: "mid", r: 0.4 });
  F.wire("rack", "liquid", [[6.9, 25.8, 3], [6.9, 25.8, slot(30) + 2]], { name: "manifold.return", width: 1.6, tone: "mid", r: 0.4 });
  // CDU on the floor beside the rack, piped into the manifolds
  const CDU = { x: -32, y: 2, w: 22, d: 24, r: 1 };
  F.unit("cdu", "liquid", CDU, 0, 46, { face: "x", vents: 3, led: "mid", name: "cdu" });
  F.wire("cdu", "liquid", [[-21, 18, 46], [-21, 18, 52], [-21, 34, 52], [5.4, 34, 52], [5.4, 26.6, 52]], { name: "cdu.supply", width: 1.6, tone: "mid", r: 0.4 });
  F.wire("cdu", "liquid", [[6.9, 26.6, 58], [6.9, 36, 58], [-25, 36, 58], [-25, 20, 58], [-25, 20, 46]], { name: "cdu.return", width: 1.6, tone: "mid", r: 0.4 });
  // scale-out: a leaf switch on the bench and cables from the tray fronts
  const LEAF = { x: 62, y: 28, w: 26, d: 26, r: 1 };
  F.unit("net", "net", LEAF, 0, 7, { face: "x", ports: 12, pitch: 2, vents: 3, name: "leaf" });
  [4, 8, 20, 24].forEach((s, i) => {
    const z = slot(s) + 1.2, y = 10 + i * 4;
    F.wire("net", "net", [[47.7, y, z], [55 + i * 1.2, y, z], [55 + i * 1.2, y, 4], [55 + i * 1.2, 40, 4], [62, 40, 4]], { name: "uplink", tone: "lo", r: 0.3 });
  });
}
