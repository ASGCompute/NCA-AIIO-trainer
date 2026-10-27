// 1.4 · Why AI is growing: three pillars — data, GPU compute, algorithms — carrying the model on top.
export const spec = { id: "t1-4", width: 600, height: 440, azimuth: 40, elevation: 28 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "1.4",
  title: L("Три опоры роста AI", "Three pillars of AI growth", "Tres pilares del auge de la IA"),
  cap: L("Модели растут, потому что одновременно выросли данные, вычисления на GPU и алгоритмы вроде трансформеров.", "Models keep growing because data, GPU compute and algorithms such as transformers all grew at once.", "Los modelos crecen porque crecieron a la vez los datos, el cómputo en GPU y algoritmos como los transformers."),
  nodes: [
    { id: "data", kw: "data", name: L("Данные", "Data", "Datos"), read: L("Цифровые данные растут лавинообразно: текст, видео, сенсоры", "Digital data keeps exploding: text, video, sensors", "Los datos digitales no paran de crecer: texto, vídeo, sensores") },
    { id: "compute", kw: "GPU|compute|accelerat|parallel", name: L("Вычисления", "Compute", "Cómputo"), read: L("GPU сделали обучение больших моделей реальным по времени и цене", "GPUs made training large models affordable in time and cost", "Las GPU hicieron viable entrenar modelos grandes en tiempo y coste") },
    { id: "algo", kw: "algorithm|transformer|attention", name: L("Алгоритмы", "Algorithms", "Algoritmos"), read: L("Трансформеры и внимание масштабируются на тысячи GPU", "Transformers and attention scale across thousands of GPUs", "Los transformers y la atención escalan a miles de GPU") },
    { id: "model", kw: "scaling law|parameter|foundation|pretrained", name: L("Модель", "The model", "El modelo"), read: L("Законы масштабирования: больше параметров, данных и вычислений → выше качество", "Scaling laws: more parameters, data and compute → better quality", "Leyes de escala: más parámetros, datos y cómputo → mejor calidad") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -16, y: -56, w: 160, d: 118, r: 6 }, 7);
  for (let i = 0; i < 9; i++) F.cyl("p", "data", 22, 22, 16, i * 8, 8, { steps: 40, tone: i % 3 === 2 ? "hi" : "mid", crease: "lo", name: "disk" });
  for (let i = 0; i < 6; i++) { const p = { x: 44, y: 4, w: 34, d: 34, r: 1.2 }; F.part("p", "compute", p, i * 12, 12, { steps: 2, tone: "hi", crease: "lo", inner: F.faceLines("x", p, i * 12 + 1, i * 12 + 11, 2.4), name: "gpu" }); }
  for (let i = 0; i < 6; i++) { const p = { x: 86, y: 2 + (i % 2) * 2, w: 36, d: 38, r: 1.5 }; F.part("p", "algo", p, i * 12, 12, { steps: 3, tone: i % 2 ? "mid" : "hi", crease: "lo", inner: F.seam(p, i * 12 + 6, 3), name: "layer" }); }
  const DECK = { x: 0, y: -40, w: 128, d: 86, r: 2 };
  F.part("p", "model", DECK, 72, 5, { bevel: 0.8, name: "deck" }, F.line(k.planOutline(k.insetPlan(DECK, 5), 77, F.P), { tone: "faint" }));
  const M = { x: 33, y: -28, w: 62, d: 62, r: 3 };
  F.part("p", "model", M, 77, 30, { steps: 4, tone: "hi", crease: "lo", inner: F.seam(M, 92, 4), name: "model" }, F.grid(M, 107, 10.3));
}
