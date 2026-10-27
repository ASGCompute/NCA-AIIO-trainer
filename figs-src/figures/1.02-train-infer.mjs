// 1.2 · Training and inference as two benches: a big rig that loops forward and backward over data and
// writes checkpoints, and a small server that answers a queue of requests after TensorRT has tuned the model.
export const spec = { id: "t1-2", width: 620, height: 430, azimuth: 36, elevation: 32 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "1.2",
  title: L("Обучение и инференс", "Training and inference", "Entrenamiento e inferencia"),
  cap: L("Обучение гоняет данные вперёд и назад на многих GPU и пишет чекпоинты. Инференс — только проход вперёд, где важны задержка и цена запроса.", "Training runs data forward and backward on many GPUs and writes checkpoints. Inference is a forward pass only, where latency and cost per request matter.", "El entrenamiento pasa los datos hacia delante y hacia atrás en muchas GPU y guarda checkpoints. La inferencia es solo hacia delante: importan la latencia y el coste por petición."),
  nodes: [
    { id: "data", kw: "dataset|data|label", name: L("Данные", "Data", "Datos"), read: L("Огромные наборы данных читаются много эпох подряд", "Huge datasets are read over many epochs", "Enormes conjuntos de datos se leen durante muchas épocas") },
    { id: "train", kw: "train|forward|backward|gradient|epoch|BF16", name: L("Обучение", "Training", "Entrenamiento"), read: L("Forward + backward на многих GPU · память под веса, градиенты и оптимизатор", "Forward + backward on many GPUs · memory for weights, gradients and optimizer", "Forward + backward en muchas GPU · memoria para pesos, gradientes y optimizador") },
    { id: "ckpt", kw: "checkpoint|resume|save", name: L("Чекпоинты", "Checkpoints", "Checkpoints"), read: L("Сохранения долгого обучения: после сбоя продолжить, а не начать заново", "Saves for long runs: resume after a failure instead of starting over", "Guardados de entrenamientos largos: retomar tras un fallo sin empezar de cero") },
    { id: "opt", kw: "TensorRT|optimi|quantiz|INT8|FP8|precision", name: L("TensorRT", "TensorRT", "TensorRT"), read: L("Оптимизирует обученную модель: слияние слоёв, INT8/FP8", "Optimizes a trained model: layer fusion, INT8/FP8", "Optimiza un modelo entrenado: fusión de capas, INT8/FP8") },
    { id: "infer", kw: "inference|deploy|serve|L4|Triton", name: L("Инференс", "Inference", "Inferencia"), read: L("Только forward · малой модели хватит одного L4, большой LLM нужны несколько GPU (TensorRT-LLM)", "Forward only · a small model fits on one L4; a large LLM needs several GPUs (TensorRT-LLM)", "Solo forward · un modelo pequeño cabe en una L4; un LLM grande necesita varias GPU (TensorRT-LLM)") },
    { id: "req", kw: "latency|throughput|request|batch|user", name: L("Запросы", "Requests", "Peticiones"), read: L("Важны задержка, пропускная способность и цена одного ответа", "Latency, throughput and cost per answer are what matter", "Importan la latencia, el rendimiento y el coste por respuesta") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -20, y: -110, w: 200, d: 230, r: 6 }, 7);
  for (let i = 0; i < 3; i++) F.cyl("tr", "data", 14, -92 + i * 26, 11, 0, 30, { steps: 36, name: "drum", inner: F.line([8, 16, 24].map((z) => k.sideArc(14, -92 + i * 26, 11, z, F.P, 32)).join(""), { tone: "faint" }) }, F.line(k.ring(14, -92 + i * 26, 8.5, 30, F.P, 32), { tone: "faint" }));
  const B = { x: 44, y: -100, w: 70, d: 80, r: 2 };
  F.part("tr", "train", B, 0, 3, { bevel: 0.6, tint: "pcb", name: "board" });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const p = { x: 48 + c * 16.5, y: -96 + r * 40, w: 13, d: 32, r: 1 }; F.part("tr", "train", p, 3, 20, { steps: 2, tone: "hi", crease: "lo", name: "gpu" }, F.finsTop(p, 23, 2.2)); }
  F.part("tr", "train", { x: 134, y: -86, w: 22, d: 40, r: 1 }, 0, 24, { steps: 2, name: "loss" }, F.line(F.rectX(156, -78, -54, 8, 18)));
  F.wire("tr", "train", [[114, -76, 18], [134, -76, 18]], { name: "forward", width: 1.3, tone: "mid" });
  F.wire("tr", "train", [[134, -56, 8], [124, -56, 8], [124, -40, 8], [114, -40, 8]], { name: "backward", width: 1.3, tone: "mid" });
  F.wire("tr", "data", [[25, -66, 15], [44, -66, 15]], { name: "feed", width: 1.2 });
  F.unit("tr", "ckpt", { x: 44, y: -12, w: 40, d: 18, r: 1 }, 0, 16, { face: "y", bays: 5, name: "ckpt" });
  F.wire("tr", "ckpt", [[64, -20, 3], [64, -12, 3]], { name: "save", ends: "both" });
  // inference bench
  F.part("in", "opt", { x: 40, y: 30, w: 30, d: 30, r: 1 }, 0, 6, { steps: 2, name: "press.bed" });
  for (const x of [42, 64]) F.part("in", "opt", { x, y: 32, w: 4, d: 4, r: 0.6 }, 6, 30, { steps: 1, bevel: 0, name: "press.post" });
  F.part("in", "opt", { x: 40, y: 30, w: 30, d: 8, r: 1 }, 36, 6, { steps: 2, name: "press.beam" });
  F.part("in", "opt", { x: 48, y: 42, w: 14, d: 12, r: 1 }, 6, 10, { steps: 2, tone: "hi", crease: "lo", name: "model" });
  const S = { x: 96, y: 30, w: 50, d: 56, r: 1 };
  F.unit("in", "infer", S, 0, 16, { face: "x", ports: 2, pitch: 5, vents: 4, name: "server" });
  F.part("in", "infer", { x: 104, y: 70, w: 30, d: 3, r: 0.4 }, 16, 12, { steps: 1, bevel: 0, tone: "hi", crease: "lo", name: "l4" });
  const RQ = { x: 150, y: 50, w: 12, d: 66, r: 1 };
  F.part("in", "req", RQ, 0, 3, { steps: 2, tone: "lo", name: "queue" });
  for (let i = 0; i < 6; i++) F.part("in", "req", { x: 152, y: 54 + i * 10, w: 8, d: 7, r: 0.8 }, 3, 5, { steps: 2, tone: "hi", crease: "lo", name: "request" });
  F.wire("in", "infer", [[62, 54, 8], [80, 54, 8], [80, 50, 8], [96, 50, 8]], { name: "deploy" });
}
