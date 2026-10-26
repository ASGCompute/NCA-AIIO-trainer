// 1.1 · The NVIDIA software stack as a cabinet of drawers, hardware at the bottom, serving at the top.
// Taking it apart slides each drawer out a different distance, so every layer shows.
const D = ["hw", "driver", "cuda", "cudax", "fw", "infer"];
export const spec = { id: "t1-1", width: 600, height: 520, azimuth: 30, elevation: 34, stagger: [...D].reverse(), moves: Object.fromEntries(D.map((d, i) => [d, [96 - i * 15, 0, 0]])) };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "1.1", explode: true,
  title: L("Стек ПО NVIDIA", "The NVIDIA software stack", "La pila de software de NVIDIA"),
  cap: L("Снизу железо, над ним драйвер, CUDA и библиотеки CUDA‑X, выше фреймворки и инференс. NGC сверху раздаёт готовые контейнеры для всех слоёв.", "Hardware at the bottom, then the driver, CUDA and the CUDA-X libraries, then frameworks and inference. NGC on top ships ready containers for every layer.", "Abajo el hardware; encima el driver, CUDA y las librerías CUDA-X; luego frameworks e inferencia. NGC arriba reparte contenedores listos para todas las capas."),
  nodes: [
    { id: "hw", kw: "hardware|DPU|NIC", name: L("Железо", "Hardware", "Hardware"), read: L("GPU, DPU и NIC: на них стоит весь стек", "GPU, DPU and NIC: the whole stack stands on them", "GPU, DPU y NIC: toda la pila se apoya en ellos") },
    { id: "driver", kw: "driver", name: L("Драйвер", "Driver", "Driver"), read: L("Драйвер NVIDIA: без него ОС не видит GPU", "The NVIDIA driver: without it the OS can't use the GPU", "El driver de NVIDIA: sin él el SO no puede usar la GPU") },
    { id: "cuda", kw: "CUDA(?!-X)|parallel computing platform|programming model", name: L("CUDA", "CUDA", "CUDA"), read: L("Платформа и модель программирования для вычислений на GPU", "The platform and programming model for computing on GPUs", "La plataforma y el modelo de programación para calcular en GPU") },
    { id: "cudax", kw: "cuDNN|cuBLAS|NCCL|DALI|RAPIDS|cuDF|library", name: L("CUDA‑X", "CUDA-X", "CUDA-X"), read: L("cuDNN — слои нейросетей · cuBLAS — матрицы · NCCL — связь GPU · DALI, RAPIDS — данные", "cuDNN for network layers · cuBLAS for matrices · NCCL for GPU comms · DALI, RAPIDS for data", "cuDNN para capas · cuBLAS para matrices · NCCL para comunicación entre GPU · DALI, RAPIDS para datos") },
    { id: "fw", kw: "PyTorch|TensorFlow|NeMo|framework", name: L("Фреймворки", "Frameworks", "Frameworks"), read: L("PyTorch, TensorFlow, NeMo вызывают CUDA‑X, а не железо напрямую", "PyTorch, TensorFlow and NeMo call CUDA-X, not the hardware directly", "PyTorch, TensorFlow y NeMo llaman a CUDA-X, no al hardware directamente") },
    { id: "infer", kw: "TensorRT|Triton|NIM|serve|inference", name: L("Инференс", "Inference", "Inferencia"), read: L("TensorRT оптимизирует модель · Triton и NIM её обслуживают", "TensorRT optimizes the model · Triton and NIM serve it", "TensorRT optimiza el modelo · Triton y NIM lo sirven") },
    { id: "ngc", kw: "NGC|catalog|container|AI Enterprise", name: L("NGC", "NGC", "NGC"), read: L("Каталог GPU-контейнеров и моделей · AI Enterprise — с поддержкой", "A catalog of GPU containers and models · AI Enterprise adds support", "Catálogo de contenedores y modelos para GPU · AI Enterprise añade soporte") },
  ],
};
export function build(F) {
  F.base({ x: -24, y: -66, w: 230, d: 132, r: 6 }, 7);
  const I = F.rack("cab", null, { x: 0, y: -52, w: 84, d: 104, r: 1 }, 160, { name: "cabinet" });
  const levels = [["hw", 3, 30], ["driver", 35, 12], ["cuda", 49, 18], ["cudax", 69, 24], ["fw", 95, 20], ["infer", 117, 26]];
  for (const [id, z, h] of levels) {
    const fl = { ...I, w: I.w - 2 }, front = { x: I.x + I.w - 2, y: I.y, w: 2, d: I.d, r: 0.3 };
    F.part(id, id, fl, z, 2, { steps: 2, tone: "lo", name: id + ".tray" }, "", -2);
    F.part(id, id, front, z, h, { steps: 1, bevel: 0, name: id + ".front", inner: F.faceRows("x", front, [z + h - 2]) }, "", 2);
    F.part(id, id, { x: I.x + I.w, y: -10, w: 3, d: 20, r: 0.8 }, z + h / 2 - 1.5, 3, { steps: 2, tone: "hi", crease: "lo", name: id + ".pull" }, "", 2.1);
    const top = z + 2, room = h - 4, X0 = I.x + 4, W = I.w - 10;
    if (id === "hw") { for (let i = 0; i < 4; i++) { const p = { x: X0 + i * 18, y: -40, w: 14, d: 34, r: 1 }; F.part(id, id, p, top, room - 4, { steps: 2, tone: "hi", crease: "lo", name: "gpu" }, F.finsTop(p, top + room - 4, 2.2)); } F.part(id, id, { x: X0, y: 8, w: 28, d: 30, r: 1 }, top, 8, { steps: 2, name: "dpu" }); F.part(id, id, { x: X0 + 34, y: 8, w: 28, d: 30, r: 1 }, top, 8, { steps: 2, name: "nic" }); }
    if (id === "driver") F.part(id, id, { x: X0, y: -30, w: W, d: 60, r: 1 }, top, 4, { steps: 2, tone: "hi", crease: "lo", name: "driver" });
    if (id === "cuda") F.part(id, id, { x: X0, y: -40, w: W, d: 80, r: 1.5 }, top, room, { steps: 2, tone: "hi", crease: "lo", name: "cuda" }, F.grid({ x: X0, y: -40, w: W, d: 80, r: 0 }, top + room, 8));
    if (id === "cudax") for (let i = 0; i < 5; i++) F.part(id, id, { x: X0, y: -46 + i * 19, w: W, d: 16, r: 1 }, top, 6 + i * 2.4, { steps: 2, tone: "hi", crease: "lo", name: "lib" });
    if (id === "fw") for (let i = 0; i < 3; i++) F.part(id, id, { x: X0 + i * 23, y: -36, w: 19, d: 72, r: 1 }, top, room - 2, { steps: 2, tone: "hi", crease: "lo", name: "framework" });
    if (id === "infer") { F.part(id, id, { x: X0, y: -40, w: 30, d: 34, r: 1 }, top, room - 2, { steps: 2, tone: "hi", crease: "lo", name: "tensorrt" }, F.finsTop({ x: X0, y: -40, w: 30, d: 34, r: 0 }, top + room - 2, 3)); for (let i = 0; i < 3; i++) F.part(id, id, { x: X0 + 36, y: -40 + i * 27, w: 30, d: 23, r: 1 }, top, 12, { steps: 2, name: "nim" }, F.dots([[X0 + 66, -36 + i * 27, top + 10]], { size: 0.45, tone: "hi" })); }
  }
  const CR = { x: 10, y: -36, w: 60, d: 72, r: 1.5 };
  F.part("cab", "ngc", CR, 160, 16, { steps: 2, inner: F.faceLines("y", CR, 160, 176, 4) + F.faceLines("x", CR, 160, 176, 4), name: "ngc" });
}
