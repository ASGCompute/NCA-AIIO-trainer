// 2.9 · High-speed networks: a Quantum-2 switch and a Spectrum-X switch, a ConnectX-7 card,
// and four cables from EDR to XDR, each twice as fast as the last.
export const spec = { id: "t2-9", width: 600, height: 420, azimuth: 42, elevation: 30 };
const L = (ru, en, es) => ({ ru, en, es });
const C = [["edr", "EDR", 100, 12.5], ["hdr", "HDR", 200, 25], ["ndr", "NDR", 400, 50], ["xdr", "XDR", 800, 100]];
export const meta = {
  id: spec.id, topic: "2.9",
  title: L("Скорости и железо сети", "Network speeds and hardware", "Velocidades y hardware de red"),
  cap: L("Каждое поколение InfiniBand вдвое быстрее прошлого: E, H, N, X. Скорость в гигабитах делим на 8, чтобы получить гигабайты.", "Each InfiniBand generation doubles the last: E, H, N, X. Divide gigabits by 8 to get gigabytes.", "Cada generación de InfiniBand duplica la anterior: E, H, N, X. Divide los gigabits entre 8 para obtener gigabytes."),
  nodes: [
    ...C.map(([id, n, gb, GB]) => ({ id, kw: id === "ndr" ? "NDR|400 Gb|50 GB" : id === "xdr" ? "XDR|800" : n, name: L(n, n, n), read: L(`${n}: ${gb} Гб/с на порт ≈ ${String(GB).replace(".", ",")} ГБ/с`, `${n}: ${gb} Gb/s per port ≈ ${GB} GB/s`, `${n}: ${gb} Gb/s por puerto ≈ ${String(GB).replace(".", ",")} GB/s`) })),
    { id: "q2", kw: "Quantum|InfiniBand switch|Subnet", name: L("Quantum-2", "Quantum-2", "Quantum-2"), read: L("Коммутатор InfiniBand NDR: 64 порта по 400G · дальше Quantum‑X800", "NDR InfiniBand switch: 64 ports of 400G · next is Quantum-X800", "Switch InfiniBand NDR: 64 puertos de 400G · le sigue Quantum-X800") },
    { id: "spx", kw: "Spectrum|Ethernet|RoCE|adaptive", name: L("Spectrum-X", "Spectrum-X", "Spectrum-X"), read: L("Ethernet для AI: RoCE, адаптивная маршрутизация, контроль заторов", "Ethernet built for AI: RoCE, adaptive routing, congestion control", "Ethernet para IA: RoCE, enrutamiento adaptativo, control de congestión") },
    { id: "cx", kw: "ConnectX|adapter|NIC|HCA", name: L("ConnectX-7", "ConnectX-7", "ConnectX-7"), read: L("Адаптер NVIDIA для InfiniBand и Ethernet · RDMA и GPUDirect", "NVIDIA adapter for InfiniBand and Ethernet · RDMA and GPUDirect", "Adaptador de NVIDIA para InfiniBand y Ethernet · RDMA y GPUDirect") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -14, y: -80, w: 190, d: 160, r: 6 }, 7);
  const Q = { x: 0, y: -66, w: 60, d: 132, r: 1 };
  F.unit("sw", "q2", Q, 0, 13, { face: "x", ports: 32, pitch: 2.6, vents: 4, name: "quantum2" });
  F.unit("sw", "spx", { ...Q }, 13, 11, { face: "x", ports: 32, pitch: 2.6, vents: 4, name: "spectrumx" });
  // ConnectX-7 card lying on the bench
  const B = { x: 104, y: -62, w: 48, d: 34, r: 0.8 };
  F.part("cx", "cx", B, 0, 2, { steps: 2, name: "board" }, F.line(k.planOutline(k.insetPlan(B, 2), 2, F.P, 2), { tone: "faint" }) + F.line([0, 1, 2, 3, 4, 5, 6, 7].map((i) => F.lineTop([B.x + 2 + i * 1.6, B.y], [B.x + 2 + i * 1.6, B.y + 4], 2)).join(""), { tone: "lo" }));
  F.part("cx", "cx", { x: 118, y: -52, w: 16, d: 16, r: 0.8 }, 2, 6, { steps: 2, tone: "hi", crease: "lo", name: "chip" }, F.finsTop({ x: 118, y: -52, w: 16, d: 16, r: 0.8 }, 8, 2));
  F.part("cx", "cx", { x: 152, y: -64, w: 2, d: 38, r: 0.3 }, 0, 16, { steps: 1, bevel: 0, name: "bracket" }, F.ports("x", 154, -52, -38, 6, 11, 1, 0.6));
  // four cables, thicker for each generation, from switch ports to plugs on the bench
  C.forEach(([id], i) => {
    const y = -12 + i * 14, w = 0.8 + i * 0.7;
    F.wire("cables", id, [[60, y, 5.6], [76 + i * 2, y, 5.6], [76 + i * 2, y, 2], [118, y, 2]], { name: "cable", width: w, tone: "mid", ends: "from" });
    F.part("cables", id, { x: 118, y: y - 2 - i * 0.4, w: 10, d: 4 + i * 0.8, r: 0.6 }, 0, 4 + i * 0.6, { steps: 2, tone: "hi", crease: "lo", name: "plug" });
  });
}
