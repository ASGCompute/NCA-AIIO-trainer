// 2.8 · Lossless fabrics: InfiniBand sends only against credits from the receiver's buffer;
// RoCE v2 rides UDP/IP and needs PFC pauses and ECN marks to stay lossless.
export const spec = { id: "t2-8", width: 620, height: 430, azimuth: 36, elevation: 30 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.8",
  title: L("InfiniBand и RoCE без потерь", "Lossless InfiniBand and RoCE", "InfiniBand y RoCE sin pérdidas"),
  cap: L("Сзади InfiniBand: отправитель шлёт, только пока у получателя есть свободные слоты. Спереди RoCE: Ethernet делают беспотерьным метками ECN и паузами PFC.", "At the back, InfiniBand: the sender transmits only while the receiver has free slots. In front, RoCE: Ethernet is made lossless with ECN marks and PFC pauses.", "Al fondo, InfiniBand: el emisor envía solo mientras el receptor tiene huecos libres. Delante, RoCE: Ethernet se vuelve sin pérdidas con marcas ECN y pausas PFC."),
  nodes: [
    { id: "credit", kw: "credit|avoid packet loss|InfiniBand avoid", name: L("Кредиты IB", "IB credits", "Créditos IB"), read: L("Credit-based flow control: шлём, только если у получателя есть буфер", "Credit-based flow control: send only when the receiver has buffer space", "Control por créditos: se envía solo si el receptor tiene búfer") },
    { id: "sm", kw: "Subnet Manager|LID|routing table|topology", name: L("Subnet Manager", "Subnet Manager", "Subnet Manager"), read: L("Находит топологию, раздаёт LID, считает маршруты · без него IB не работает", "Discovers the topology, assigns LIDs, computes routes · IB won't run without it", "Descubre la topología, asigna LID y calcula rutas · sin él IB no funciona") },
    { id: "sharp", kw: "SHARP|aggregat|inside the switch", name: L("SHARP", "SHARP", "SHARP"), read: L("All-reduce считается прямо в коммутаторе: по сети ходит меньше данных", "All-reduce is computed inside the switch, so less data crosses the network", "El all-reduce se calcula dentro del switch: viajan menos datos") },
    { id: "pfc", kw: "PFC|Priority Flow|pause|lossless", name: L("PFC", "PFC", "PFC"), read: L("Priority Flow Control: при заполнении буфера ставит на паузу соседний порт выше по потоку, по одному классу трафика", "Priority Flow Control: when a buffer fills, it pauses the upstream neighbour port for one traffic class", "Priority Flow Control: si un búfer se llena, pausa el puerto vecino anterior para una clase de tráfico") },
    { id: "ecn", kw: "ECN|congestion|DCQCN", name: L("ECN", "ECN", "ECN"), read: L("Коммутатор помечает пакеты при заторе, получатель шлёт CNP, отправитель снижает скорость (DCQCN)", "The switch marks packets on congestion, the receiver sends a CNP, the sender slows down (DCQCN)", "El switch marca los paquetes con congestión, el receptor envía un CNP y el emisor frena (DCQCN)") },
    { id: "roce", kw: "RoCE|UDP|routable|Layer 3|v2", name: L("RoCE v2", "RoCE v2", "RoCE v2"), read: L("RDMA поверх UDP/IP: маршрутизируется через L3, в отличие от RoCE v1", "RDMA over UDP/IP: routable across Layer 3, unlike RoCE v1", "RDMA sobre UDP/IP: se enruta por capa 3, a diferencia de RoCE v1") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -16, y: -110, w: 200, d: 220, r: 6 }, 7);
  // InfiniBand lane
  F.unit("ib", "credit", { x: 0, y: -96, w: 32, d: 26, r: 1 }, 0, 12, { face: "x", ports: 1, pitch: 5, name: "hca" });
  const SW = { x: 82, y: -100, w: 46, d: 58, r: 1 };
  F.unit("ib", "credit", SW, 0, 14, { face: "x", ports: 8, pitch: 4, vents: 0, name: "ibswitch" });
  for (let i = 0; i < 6; i++) { const slot = { x: 86 + i * 6.6, y: -96, w: 5, d: 12, r: 0.5 }; F.part("ib", "credit", slot, 14, i < 2 ? 4 : 1.2, { steps: 2, tone: i < 2 ? "hi" : "lo", bevel: 0, crease: "lo", name: "credit" }); }
  F.part("ib", "sharp", { x: 92, y: -72, w: 22, d: 22, r: 1 }, 14, 6, { steps: 2, tone: "hi", crease: "lo", name: "sharp" }, F.finsTop({ x: 92, y: -72, w: 22, d: 22, r: 1 }, 20, 2.4));
  F.wire("ib", "credit", [[32, -73.5, 4.2], [58, -73.5, 4.2], [58, -36, 4.2], [100, -36, 4.2], [100, -42, 4.2]], { name: "ib.cable", width: 1.2, tone: "mid" });
  for (let i = 0; i < 3; i++) F.part("ib", "credit", { x: 40 + i * 6, y: -76, w: 4, d: 5, r: 0.5 }, 0, 3, { steps: 2, tone: "hi", crease: "lo", name: "packet" });
  F.unit("ib", "sm", { x: 140, y: -100, w: 30, d: 26, r: 1 }, 0, 12, { face: "x", ports: 1, pitch: 5, bays: 2, name: "sm" });
  F.wire("ib", "sm", [[155, -74, 6], [155, -60, 6], [135, -60, 6], [135, -60, 20], [114, -60, 20]], { name: "sm.cable", tone: "lo" });
  // RoCE lane
  F.unit("eth", "roce", { x: 0, y: 30, w: 32, d: 26, r: 1 }, 0, 12, { face: "x", ports: 1, pitch: 5, name: "nic" });
  const ES = { x: 82, y: 22, w: 46, d: 58, r: 1 };
  F.unit("eth", "roce", ES, 0, 14, { face: "x", ports: 8, pitch: 4, vents: 4, name: "ethswitch" });
  F.cyl("eth", "pfc", 98, 36, 9, 14, 16, { steps: 32, tone: "hi", crease: "lo", name: "buffer", inner: F.line(k.sideArc(98, 36, 9, 26, F.P, 32), { tone: "lo" }) }, F.line(k.ring(98, 36, 7.5, 30, F.P, 32), { tone: "faint" }));
  F.wire("eth", "roce", [[32, 52.5, 4.2], [58, 52.5, 4.2], [58, 86, 4.2], [100, 86, 4.2], [100, 80, 4.2]], { name: "eth.cable", width: 1.2, tone: "mid" });
  F.part("eth", "pfc", { x: 66, y: 40, w: 3, d: 3, r: 0.6 }, 0, 22, { steps: 2, name: "pause.post" });
  F.part("eth", "pfc", { x: 64, y: 37, w: 7, d: 9, r: 1 }, 22, 3, { steps: 2, tone: "hi", crease: "lo", name: "pause.plate" });
  F.part("eth", "ecn", { x: 112, y: 58, w: 7, d: 8, r: 0.6 }, 14, 5, { steps: 2, tone: "hi", crease: "lo", name: "ecn" }, F.line(F.lineTop([113, 60], [118, 64], 19), { tone: "lo" }));
  F.unit("eth", "roce", { x: 140, y: 30, w: 30, d: 30, r: 1 }, 0, 12, { face: "x", ports: 4, pitch: 4, name: "router" });
  F.wire("eth", "roce", [[128, 76, 4.2], [134, 76, 4.2], [134, 58, 4.2], [140, 58, 4.2]], { name: "l3", ends: "to" });
}
