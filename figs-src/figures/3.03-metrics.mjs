// 3.3 · GPU metrics: a GPU on a test bench wired to its instruments — temperature, power, utilization,
// memory, ECC errors — and a terminal running nvidia-smi.
export const spec = { id: "t3-3", width: 620, height: 430, azimuth: 38, elevation: 32 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "3.3",
  title: L("Метрики GPU", "GPU metrics", "Métricas de GPU"),
  cap: L("nvidia-smi и DCGM читают те же датчики: загрузку, память, температуру, мощность и ошибки ECC.", "nvidia-smi and DCGM read the same sensors: utilization, memory, temperature, power and ECC errors.", "nvidia-smi y DCGM leen los mismos sensores: uso, memoria, temperatura, potencia y errores ECC."),
  nodes: [
    { id: "util", kw: "utiliz|GPU-Util|idle|SM", name: L("Загрузка", "Utilization", "Uso"), read: L("GPU-Util — доля времени, когда работало хоть одно ядро · 100% ≠ все SM заняты: смотрите SM activity в DCGM", "GPU-Util is the share of time any kernel ran · 100% doesn't mean every SM is busy: check SM activity in DCGM", "GPU-Util es el tiempo con algún kernel activo · 100% no significa todos los SM ocupados: mira la actividad SM en DCGM") },
    { id: "mem", kw: "memory|out of memory|OOM", name: L("Память", "Memory", "Memoria"), read: L("Сколько HBM занято и кем: процессы видны в nvidia-smi", "How much HBM is used and by whom: nvidia-smi lists the processes", "Cuánta HBM se usa y quién: nvidia-smi muestra los procesos") },
    { id: "temp", kw: "temperature|thermal|throttl", name: L("Температура", "Temperature", "Temperatura"), read: L("Перегрев включает троттлинг и снижает частоты", "Overheating triggers throttling and lowers clocks", "El sobrecalentamiento activa el throttling y baja las frecuencias") },
    { id: "power", kw: "power|watt|-pl|cap", name: L("Мощность", "Power", "Potencia"), read: L("Потребление и лимит · `nvidia-smi -pl` задаёт предел мощности", "Draw and limit · `nvidia-smi -pl` sets the power cap", "Consumo y límite · `nvidia-smi -pl` fija el tope de potencia") },
    { id: "ecc", kw: "ECC|XID|error|dcgmi diag|retire|drain", name: L("ECC и XID", "ECC and XID", "ECC y XID"), read: L("Некорректируемые ECC → row remapping и сброс GPU; не удался remap — выводите GPU · XID-ошибки в `dmesg`", "Uncorrectable ECC → row remapping and a GPU reset; if remapping fails, drain the GPU · XID errors show in `dmesg`", "ECC no corregible → row remapping y reinicio de la GPU; si falla, retírala · los XID aparecen en `dmesg`") },
    { id: "smi", kw: "nvidia-smi|NVML|topo", name: L("nvidia-smi", "nvidia-smi", "nvidia-smi"), read: L("Утилита на NVML: состояние, процессы, nvidia-smi topo -m", "An NVML tool: status, processes, nvidia-smi topo -m", "Herramienta sobre NVML: estado, procesos, nvidia-smi topo -m") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -18, y: -96, w: 216, d: 196, r: 6 }, 7);
  const B = { x: 0, y: -30, w: 70, d: 60, r: 1.5 };
  F.part("g", null, B, 0, 3, { bevel: 0.6, tint: "pcb", name: "card" }, F.dots(k.corners(B, 3).map(([x, y]) => [x, y, 3])));
  const S = { x: 10, y: -22, w: 50, d: 44, r: 1.2 };
  F.part("g", null, S, 3, 18, { steps: 2, tone: "hi", crease: "lo", inner: F.faceLines("x", S, 3, 21, 2.4), name: "sink" }, F.finsTop(S, 21, 2.4));
  const dial = (sel, cx, cy, z, needle) => { F.cyl("i", sel, cx, cy, 2, 0, z, { steps: 14, name: "post" }); F.cyl("i", sel, cx, cy, 10, z, 4, { steps: 40, tone: "hi", crease: "lo", name: "dial" }, F.line(k.radialTicks(cx, cy, 8.6, 30, 5, z + 4, [1, 2], F.P).major, { tone: "mid" }) + F.line(k.lineOnTop([cx, cy], [cx + 7 * Math.sin(needle), cy - 7 * Math.cos(needle)], z + 4.2, F.P), { tone: "hi", free: "start" })); };
  dial("temp", 100, -70, 22, 1.4); dial("power", 132, -70, 22, 2.2);
  F.wire("i", "temp", [[60, -18, 12], [84, -18, 12], [84, -70, 12], [98, -70, 12]], { name: "probe" });
  F.wire("i", "power", [[60, -8, 6], [92, -8, 6], [92, -60, 6], [132, -60, 6], [132, -68, 6]], { name: "shunt" });
  for (let i = 0; i < 3; i++) F.part("i", "util", { x: 100 + i * 10, y: -20, w: 7, d: 7, r: 0.6 }, 0, i === 2 ? 30 : 14 + i * 6, { steps: 2, tone: i === 2 ? "hi" : "mid", crease: "lo", name: "bar" });
  for (let i = 0; i < 4; i++) F.part("i", "mem", { x: 100, y: 4 + i * 0, w: 28, d: 18, r: 1 }, i * 6, 6, { steps: 2, tone: i < 3 ? "hi" : "mid", crease: "lo", name: "mem" });
  F.unit("i", "ecc", { x: 100, y: 34, w: 28, d: 20, r: 1 }, 0, 12, { face: "x", name: "ecc" });
  F.part("i", "ecc", { x: 128, y: 38, w: 1, d: 12, r: 0.2 }, 3, 6, { steps: 1, bevel: 0, tone: "hi", crease: "lo", name: "counter" });
  const T = { x: 150, y: 20, w: 40, d: 3, r: 0.4 };
  F.cyl("t", "smi", 170, 22, 2, 0, 14, { steps: 14, name: "stand" });
  F.part("t", "smi", T, 14, 30, { steps: 1, bevel: 0, name: "terminal", inner: F.faceRows("y", T, [20, 24, 28, 32, 36, 40]) });
  F.wire("t", "smi", [[70, 28, 2], [170, 28, 2], [170, 24, 2]], { name: "nvml", tone: "faint" });
}
