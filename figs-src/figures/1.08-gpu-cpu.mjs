// 1.8 · GPU and CPU side by side with their lids lifted: a few big cores and a big cache against
// many SMs with Tensor Cores and HBM stacks right next to the die.
export const spec = { id: "t1-8", width: 600, height: 420, azimuth: 40, elevation: 34, stagger: ["lids"], moves: { lids: [0, 0, 34] } };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "1.8", explode: true,
  title: L("CPU и GPU под крышкой", "CPU and GPU under the lid", "CPU y GPU bajo la tapa"),
  cap: L("CPU: несколько мощных ядер и большой кэш для логики и ветвлений. GPU: множество SM с Tensor Cores и память HBM прямо у кристалла.", "CPU: a few powerful cores and a large cache for logic and branching. GPU: many SMs with Tensor Cores and HBM memory right beside the die.", "CPU: pocos núcleos potentes y una caché grande para lógica y saltos. GPU: muchos SM con Tensor Cores y memoria HBM junto al chip."),
  nodes: [
    { id: "core", kw: "CPU|core|branch|sequential|operating system", name: L("Ядра CPU", "CPU cores", "Núcleos de CPU"), read: L("Десятки мощных ядер: ОС, ввод-вывод, логика, ветвления", "Tens of powerful cores: the OS, I/O, logic and branching", "Decenas de núcleos potentes: SO, E/S, lógica y saltos") },
    { id: "cache", kw: "cache|latency", name: L("Кэш CPU", "CPU cache", "Caché de CPU"), read: L("Большой кэш прячет задержку памяти для одного потока", "A big cache hides memory latency for one thread", "Una caché grande oculta la latencia de memoria de un hilo") },
    { id: "sm", kw: "SM|thousands|parallel|massively|warp", name: L("SM GPU", "GPU SMs", "SM de la GPU"), read: L("H100: 132 SM и 16 896 ядер CUDA · задержки прячутся тысячами потоков", "H100: 132 SMs and 16,896 CUDA cores · thousands of threads hide the latency", "H100: 132 SM y 16 896 núcleos CUDA · miles de hilos ocultan la latencia") },
    { id: "tc", kw: "Tensor Core|matrix|FP8|FP4|Transformer Engine|mixed precision", name: L("Tensor Cores", "Tensor Cores", "Tensor Cores"), read: L("528 Tensor Cores в H100, по 4 на SM · матрицы в железе · FP8 в Hopper, FP4 в Blackwell", "528 Tensor Cores in H100, 4 per SM · matrix math in hardware · FP8 on Hopper, FP4 on Blackwell", "528 Tensor Cores en la H100, 4 por SM · matrices en hardware · FP8 en Hopper, FP4 en Blackwell") },
    { id: "hbm", kw: "HBM|memory bandwidth|80 GB", name: L("HBM", "HBM", "HBM"), read: L("Память рядом с кристаллом · H100 SXM: 80 ГБ HBM3 и 3,35 ТБ/с", "Memory beside the die · H100 SXM: 80 GB of HBM3 at 3.35 TB/s", "Memoria junto al chip · H100 SXM: 80 GB de HBM3 a 3,35 TB/s") },
  ],
};
export function build(F) {
  F.base({ x: -20, y: -84, w: 160, d: 220, r: 6 }, 7);
  const CS = { x: 0, y: -70, w: 120, d: 70, r: 2 };
  F.part("cpu", null, CS, 0, 3, { bevel: 0.6, tint: "pcb", name: "cpu.substrate" }, F.dots(F.k.corners(CS, 3).map(([x, y]) => [x, y, 3])), -5);
  const DIE = { x: 14, y: -62, w: 92, d: 54, r: 1 };
  F.part("cpu", "cache", DIE, 3, 2, { steps: 2, tint: "die", name: "cpu.die" });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) F.part("cpu", "core", { x: 18 + c * 22, y: -58 + r * 32, w: 18, d: 14, r: 0.8 }, 5, 4, { steps: 2, tone: "hi", crease: "lo", name: "core" });
  F.part("cpu", "cache", { x: 18, y: -42, w: 84, d: 14, r: 0.8 }, 5, 2.4, { steps: 2, tone: "mid", name: "l3" }, F.finsTop({ x: 18, y: -42, w: 84, d: 14, r: 0 }, 7.4, 4, "y"));
  F.part("lids", "core", { x: 10, y: -66, w: 100, d: 62, r: 2 }, 9, 4, { steps: 3, bevel: 0.6, name: "cpu.lid" });
  const GS = { x: 0, y: 14, w: 120, d: 108, r: 2 };
  F.part("gpu", null, GS, 0, 3, { bevel: 0.6, tint: "pcb", name: "gpu.substrate" }, F.dots(F.k.corners(GS, 3).map(([x, y]) => [x, y, 3])), -5);
  const GD = { x: 24, y: 24, w: 72, d: 88, r: 1 };
  F.part("gpu", "sm", GD, 3, 2, { steps: 2, tint: "die", name: "gpu.die" });
  for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) {
    const p = { x: 27 + c * 11.2, y: 27 + r * 10.4, w: 9.6, d: 8.6, r: 0.4 };
    F.part("gpu", c % 2 === 0 && r % 2 === 0 ? "tc" : "sm", p, 5, c % 2 === 0 && r % 2 === 0 ? 3 : 2, { steps: 1, bevel: 0, tone: c % 2 === 0 && r % 2 === 0 ? "hi" : "mid", crease: "lo", name: "sm" });
  }
  for (const x of [4, 100]) for (let j = 0; j < 3; j++) F.part("gpu", "hbm", { x, y: 28 + j * 28, w: 16, d: 22, r: 0.8 }, 3, 9, { steps: 2, tone: "hi", crease: "lo", inner: F.faceRows("x", { x, y: 28 + j * 28, w: 16, d: 22, r: 0 }, [5, 7, 9, 11]), tint: "hbm", name: "hbm" });
  F.part("lids", "sm", { x: 2, y: 18, w: 116, d: 100, r: 2 }, 12, 4, { steps: 3, bevel: 0.6, name: "gpu.lid" });
}
