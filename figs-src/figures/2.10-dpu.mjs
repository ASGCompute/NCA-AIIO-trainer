// 2.10 · DPU: a BlueField card in an open server. Its Arm cores and accelerators run networking, storage and
// security behind a trust boundary, so the host CPU is free for applications.
export const spec = { id: "t2-10", width: 600, height: 420, azimuth: 40, elevation: 30 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.10",
  title: L("DPU BlueField в сервере", "A BlueField DPU in a server", "DPU BlueField en un servidor"),
  cap: L("DPU — сетевая карта со своими Arm-ядрами и ускорителями. Инфраструктура работает на ней, за границей доверия, а CPU хоста свободен.", "A DPU is a network card with its own Arm cores and accelerators. Infrastructure runs on it, behind a trust boundary, and the host CPU stays free.", "Una DPU es una tarjeta de red con sus propios núcleos Arm y aceleradores. La infraestructura corre en ella, tras un límite de confianza, y la CPU del host queda libre."),
  nodes: [
    { id: "dpu", kw: "DPU|BlueField|Data Processing", name: L("BlueField-3", "BlueField-3", "BlueField-3"), read: L("NIC + Arm-ядра + ускорители на одной карте · программируется через DOCA", "NIC + Arm cores + accelerators on one card · programmed with DOCA", "NIC + núcleos Arm + aceleradores en una tarjeta · se programa con DOCA") },
    { id: "arm", kw: "Arm|DOCA|SDK", name: L("Arm-ядра", "Arm cores", "Núcleos Arm"), read: L("Свой компьютер на карте: OVS, firewall, телеметрия работают здесь", "A computer of its own on the card: OVS, firewall and telemetry run here", "Un ordenador propio en la tarjeta: OVS, firewall y telemetría corren aquí") },
    { id: "accel", kw: "encrypt|IPsec|TLS|NVMe-oF|offload|storage", name: L("Ускорители", "Accelerators", "Aceleradores"), read: L("Шифрование, NVMe-oF, сжатие — в железе, без нагрузки на CPU", "Encryption, NVMe-oF and compression in hardware, with no CPU load", "Cifrado, NVMe-oF y compresión en hardware, sin carga para la CPU") },
    { id: "ports", kw: "SuperNIC|port|network", name: L("Порты", "Ports", "Puertos"), read: L("2 порта до 200G · SuperNIC-вариант ускоряет east-west трафик GPU", "2 ports up to 200G · the SuperNIC version speeds up east-west GPU traffic", "2 puertos de hasta 200G · la versión SuperNIC acelera el tráfico este-oeste de las GPU") },
    { id: "wall", kw: "isolat|zero.trust|tenant|trust|compromis", name: L("Граница доверия", "Trust boundary", "Límite de confianza"), read: L("Политики живут на DPU: root на хосте не может их отключить", "Policies live on the DPU: root on the host can't switch them off", "Las políticas viven en la DPU: root en el host no puede desactivarlas") },
    { id: "host", kw: "host CPU|free|frees|CPU cores", name: L("CPU хоста", "Host CPU", "CPU del host"), read: L("CPU, GPU и DPU — три опоры ЦОД · CPU освобождён для приложений", "CPU, GPU and DPU are the three pillars · the CPU is freed for applications", "CPU, GPU y DPU son los tres pilares · la CPU queda libre para las aplicaciones") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -16, y: -76, w: 236, d: 152, r: 6 }, 7);
  const PAN = { x: 0, y: -62, w: 170, d: 124, r: 2 }, MB = { x: 6, y: -56, w: 158, d: 112, r: 2 };
  F.part("host", null, PAN, 0, 3, { tone: "lo", bevel: 0.6, name: "pan" }, "", -10);
  F.part("host", null, MB, 3, 2, { name: "mb" }, F.line(k.planOutline(k.insetPlan(MB, 3), 5, F.P, 3), { tone: "faint" }) + F.dots(k.corners(MB, 4).map(([x, y]) => [x, y, 5])), -5);
  for (const cx of [40, 92]) {
    const sock = { x: cx - 14, y: -40, w: 28, d: 30, r: 1 }, hs = { x: cx - 13, y: -39, w: 26, d: 28, r: 1.2 };
    F.part("host", "host", sock, 5, 2, { steps: 2, name: "socket" });
    F.part("host", "host", hs, 7, 22, { tone: "hi", crease: "lo", inner: F.faceLines("x", hs, 7, 29, 2.5), name: "cpu" }, F.finsTop(hs, 29, 2.5));
    for (let j = 0; j < 6; j++) F.part("host", "host", { x: cx - 14, y: -6 + j * 4, w: 28, d: 1.6, r: 0.3 }, 5, 13, { steps: 1, bevel: 0, name: "dimm" });
  }
  const WALL = { x: 118, y: -56, w: 1.6, d: 112, r: 0.4 };
  F.part("host", "wall", WALL, 5, 46, { steps: 1, tone: "faint", bevel: 0, name: "wall" }, F.dots([[119.6, -50, 48], [119.6, 50, 48]], { size: 0.4 }));
  const SLOT = { x: 124, y: 20, w: 40, d: 6, r: 0.6 };
  F.part("host", "dpu", SLOT, 5, 4, { steps: 2, tone: "lo", name: "slot" }, F.line(k.planOutline(k.insetPlan(SLOT, 1.4), 9, F.P, 2), { tone: "faint" }));
  // the card stands in the slot: board along x, parts on its +y face, bracket and ports at the +x end
  const CARD = { x: 124, y: 22, w: 46, d: 2, r: 0.3 };
  F.part("card", "dpu", CARD, 9, 34, { steps: 1, bevel: 0, name: "card" }, F.faceRows("y", CARD, [13, 39]));
  F.part("card", "arm", { x: 130, y: 24, w: 14, d: 3, r: 0.6 }, 18, 14, { steps: 2, tone: "hi", crease: "lo", name: "arm" }, F.finsTop({ x: 130, y: 24, w: 14, d: 3, r: 0.6 }, 32, 1.4, "y"));
  F.part("card", "accel", { x: 148, y: 24, w: 10, d: 2.6, r: 0.5 }, 20, 10, { steps: 2, tone: "hi", crease: "lo", name: "accel" });
  for (let j = 0; j < 3; j++) F.part("card", "arm", { x: 131 + j * 4.6, y: 24, w: 3.4, d: 1.2, r: 0.2 }, 12, 4, { steps: 1, bevel: 0, name: "mem" });
  const BR = { x: 170, y: 18, w: 2, d: 12, r: 0.3 };
  F.part("card", "ports", BR, 5, 40, { steps: 1, bevel: 0, name: "bracket" }, F.ports("x", 172, 20, 28, 26, 30, 1, 0.6) + F.ports("x", 172, 20, 28, 33, 37, 1, 0.6));
  F.unit("net", "ports", { x: 196, y: -40, w: 18, d: 40, r: 1 }, 0, 10, { face: "x", ports: 6, pitch: 4, name: "switch" });
  for (const [z, x] of [[28, 182], [35, 186]]) F.wire("net", "ports", [[172, 24, z], [x, 24, z], [x, -20 + (z - 28) * 1.4, z], [x, -20 + (z - 28) * 1.4, 10]], { name: "cable" });
}
