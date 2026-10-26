// 3.4 · Sharing a GPU: MIG walls one H100 into seven isolated slices; time-slicing takes turns on one GPU;
// vGPU puts VMs on a hypervisor; passthrough hands one whole GPU to one VM.
export const spec = { id: "t3-4", width: 620, height: 440, azimuth: 36, elevation: 36 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "3.4",
  title: L("MIG, time-slicing и vGPU", "MIG, time-slicing and vGPU", "MIG, time-slicing y vGPU"),
  cap: L("MIG делит GPU стенками: у каждой части своя память и вычисления. Time-slicing даёт задачам GPU по очереди. vGPU и passthrough отдают GPU виртуальным машинам.", "MIG walls a GPU off: each part has its own memory and compute. Time-slicing gives jobs the GPU in turns. vGPU and passthrough give GPUs to virtual machines.", "MIG separa la GPU con paredes: cada parte tiene su memoria y su cómputo. El time-slicing da la GPU por turnos. vGPU y passthrough dan GPU a máquinas virtuales."),
  nodes: [
    { id: "mig", kw: "MIG|Multi-Instance|isolat|seven|7 instances|QoS", name: L("MIG", "MIG", "MIG"), read: L("До 7 изолированных экземпляров · гарантированные память и вычисления", "Up to 7 isolated instances · guaranteed memory and compute", "Hasta 7 instancias aisladas · memoria y cómputo garantizados") },
    { id: "slice", kw: "1g\\.10gb|slice|instance|profile", name: L("Один срез", "One slice", "Una porción"), read: L("Например 1g.10gb на H100: 1/7 вычислений и 10 ГБ памяти", "For example 1g.10gb on an H100: 1/7 of the compute and 10 GB of memory", "Por ejemplo 1g.10gb en una H100: 1/7 del cómputo y 10 GB de memoria") },
    { id: "ts", kw: "time.slic|turn|no memory isolation", name: L("Time-slicing", "Time-slicing", "Time-slicing"), read: L("Задачи по очереди на одном GPU · память не изолирована", "Jobs take turns on one GPU · memory isn't isolated", "Los trabajos se turnan en una GPU · la memoria no está aislada") },
    { id: "vgpu", kw: "vGPU|hypervisor|virtual machine|VM|licen", name: L("vGPU", "vGPU", "vGPU"), read: L("ВМ делят GPU через гипервизор по профилям · нужна лицензия", "VMs share a GPU through the hypervisor using profiles · needs a license", "Las VM comparten la GPU mediante el hipervisor con perfiles · requiere licencia") },
    { id: "pt", kw: "passthrough|whole GPU|entire", name: L("Passthrough", "Passthrough", "Passthrough"), read: L("Весь GPU одной ВМ, почти без накладных расходов", "One whole GPU for one VM, with almost no overhead", "Una GPU entera para una VM, casi sin sobrecarga") },
  ],
};
export function build(F) {
  F.base({ x: -18, y: -104, w: 214, d: 210, r: 6 }, 7);
  const G = { x: 0, y: -90, w: 84, d: 112, r: 2 };
  F.part("m", "mig", G, 0, 4, { bevel: 0.6, name: "h100" });
  for (let i = 0; i < 7; i++) {
    const y = -88 + i * 15.7;
    if (i) F.part("m", "mig", { x: 2, y: y - 0.8, w: 80, d: 1.6, r: 0.2 }, 4, 12, { steps: 1, bevel: 0, tone: "hi", crease: "lo", name: "wall" });
    F.part("m", i === 3 ? "slice" : "mig", { x: 6, y: y + 1.6, w: 38, d: 11, r: 0.6 }, 4, 8, { steps: 2, tone: i === 3 ? "hi" : "mid", crease: "lo", name: "sm.slice" });
    F.part("m", i === 3 ? "slice" : "mig", { x: 50, y: y + 1.6, w: 28, d: 11, r: 0.6 }, 4, 5, { steps: 2, name: "mem.slice" });
  }
  const T = { x: 110, y: -90, w: 50, d: 50, r: 2 };
  F.part("t", "ts", T, 0, 14, { steps: 2, tone: "hi", crease: "lo", inner: F.faceLines("x", T, 1, 13, 3), name: "gpu" }, F.finsTop(T, 14, 3));
  const R = { x: 166, y: -86, w: 14, d: 76, r: 1 };
  F.part("t", "ts", R, 0, 3, { steps: 2, tone: "lo", name: "turns" }, F.finsTop(R, 3, 8, "x"));
  for (let i = 0; i < 3; i++) F.part("t", "ts", { x: 168, y: -82 + i * 24, w: 10, d: 18, r: 1 }, 3, 6, { steps: 2, tone: i === 0 ? "hi" : "mid", crease: "lo", name: "job" });
  const V = { x: 110, y: 0, w: 50, d: 50, r: 2 };
  F.part("v", "vgpu", V, 0, 10, { steps: 2, inner: F.faceLines("x", V, 1, 9, 3), name: "gpu" });
  F.part("v", "vgpu", { x: 108, y: -2, w: 54, d: 54, r: 1.5 }, 10, 4, { steps: 2, tone: "lo", name: "hypervisor" });
  for (let i = 0; i < 3; i++) F.unit("v", "vgpu", { x: 114, y: 4 + i * 15, w: 42, d: 12, r: 0.8 }, 14, 12, { face: "x", name: "vm" });
  F.part("p", "pt", { x: 0, y: 40, w: 60, d: 50, r: 2 }, 0, 10, { steps: 2, inner: F.faceLines("x", { x: 0, y: 40, w: 60, d: 50, r: 0 }, 1, 9, 3), name: "gpu" });
  F.unit("p", "pt", { x: 4, y: 44, w: 52, d: 42, r: 1 }, 10, 18, { face: "x", ports: 1, pitch: 5, name: "vm" });
}
