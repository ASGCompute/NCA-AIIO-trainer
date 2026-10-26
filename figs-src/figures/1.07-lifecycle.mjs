// 1.7 · The AI lifecycle as a conveyor loop: data → training → optimization → deployment → monitoring,
// and back to training when the model drifts.
export const spec = { id: "t1-7", width: 620, height: 430, azimuth: 36, elevation: 36 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "1.7",
  title: L("Жизненный цикл AI", "The AI lifecycle", "El ciclo de vida de la IA"),
  cap: L("Модель едет по кругу: данные, обучение, оптимизация, развёртывание, мониторинг. Дрейф качества возвращает её на переобучение.", "The model travels a loop: data, training, optimization, deployment, monitoring. Quality drift sends it back to retraining.", "El modelo da la vuelta: datos, entrenamiento, optimización, despliegue, monitorización. La deriva de calidad lo devuelve a reentrenar."),
  nodes: [
    { id: "data", kw: "data prep|preparation|RAPIDS|DALI|Curator|clean", name: L("Данные", "Data", "Datos"), read: L("Подготовка данных — самый долгий этап · RAPIDS, DALI, NeMo Curator", "Data prep is the longest stage · RAPIDS, DALI, NeMo Curator", "Preparar los datos es la etapa más larga · RAPIDS, DALI, NeMo Curator") },
    { id: "train", kw: "train", name: L("Обучение", "Training", "Entrenamiento"), read: L("Обучение на GPU-кластере с чекпоинтами", "Training on a GPU cluster, with checkpoints", "Entrenamiento en un clúster GPU con checkpoints") },
    { id: "opt", kw: "TensorRT|optimi", name: L("Оптимизация", "Optimization", "Optimización"), read: L("TensorRT ужимает модель для быстрого инференса", "TensorRT slims the model down for fast inference", "TensorRT compacta el modelo para una inferencia rápida") },
    { id: "deploy", kw: "deploy|Triton|NIM|serve", name: L("Развёртывание", "Deployment", "Despliegue"), read: L("Triton или NIM обслуживают запросы в продакшене", "Triton or NIM serve requests in production", "Triton o NIM atienden las peticiones en producción") },
    { id: "monitor", kw: "monitor|drift|accuracy", name: L("Мониторинг", "Monitoring", "Monitorización"), read: L("Следим за качеством и задержкой · дрейф данных снижает точность", "Watch quality and latency · data drift lowers accuracy", "Vigilamos calidad y latencia · la deriva de datos baja la precisión") },
    { id: "loop", kw: "retrain|loop|feedback", name: L("Переобучение", "Retraining", "Reentrenamiento"), read: L("Новые данные возвращают модель на обучение: цикл не заканчивается", "New data sends the model back to training: the loop never ends", "Los datos nuevos devuelven el modelo al entrenamiento: el ciclo no acaba") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -20, y: -104, w: 236, d: 194, r: 6 }, 7);
  const belt = (p, sel) => F.part("belt", sel, p, 0, 6, { steps: 2, tone: "lo", bevel: 0.4, name: "belt" }, F.finsTop(p, 6, 6, p.w > p.d ? "y" : "x"));
  belt({ x: 0, y: -76, w: 180, d: 20, r: 2 }, null);
  belt({ x: 0, y: 56, w: 180, d: 20, r: 2 }, "loop");
  belt({ x: 0, y: -56, w: 20, d: 112, r: 0 }, "loop");
  belt({ x: 160, y: -56, w: 20, d: 112, r: 0 }, null);
  for (const [x, y] of [[10, -66], [170, -66], [10, 66], [170, 66]]) F.cyl("belt", null, x, y, 7, 6, 3, { steps: 24, tone: "mid", name: "drum" });
  // stations along the front run (y = -66) and the right run (x = 170)
  for (let i = 0; i < 3; i++) F.part("st", "data", { x: 26 + i * 12, y: -92, w: 10, d: 13, r: 1 }, 0, 10 + i * 4, { steps: 2, tone: "mid", name: "bin" });
  const T = { x: 64, y: -50, w: 34, d: 26, r: 1 };
  F.part("st", "train", T, 0, 26, { steps: 2, tone: "hi", crease: "lo", inner: F.faceLines("y", T, 2, 24, 2.6), name: "rig" }, F.finsTop(T, 26, 2.6));
  for (const x of [110, 128]) for (const y of [-86, -54]) F.part("st", "opt", { x, y, w: 4, d: 4, r: 0.6 }, 0, 34, { steps: 1, bevel: 0, name: "press.post" });
  F.part("st", "opt", { x: 108, y: -88, w: 26, d: 40, r: 1 }, 34, 5, { steps: 2, name: "press.beam" });
  F.part("st", "opt", { x: 114, y: -74, w: 14, d: 16, r: 1 }, 6, 8, { steps: 2, tone: "hi", crease: "lo", name: "model" });
  F.unit("st", "deploy", { x: 184, y: -30, w: 16, d: 40, r: 1 }, 0, 30, { face: "x", ports: 3, pitch: 4, bays: 3, name: "server" });
  F.cyl("st", "monitor", 192, 34, 2, 0, 24, { steps: 14, name: "gauge.post" });
  F.cyl("st", "monitor", 192, 34, 9, 24, 4, { steps: 40, tone: "hi", crease: "lo", name: "gauge" }, F.line(k.radialTicks(192, 34, 7.6, 30, 5, 28, [1, 2], F.P).major, { tone: "mid" }) + F.line(k.lineOnTop([192, 34], [196, 29], 28.2, F.P), { tone: "hi", free: "start" }));
  for (let i = 0; i < 4; i++) F.part("items", i === 3 ? "loop" : "train", { x: 30 + i * 36, y: -71, w: 9, d: 10, r: 1 }, 6, 6, { steps: 2, tone: "hi", crease: "lo", name: "model.item" });
  F.part("items", "loop", { x: 5, y: -10, w: 10, d: 9, r: 1 }, 6, 6, { steps: 2, tone: "hi", crease: "lo", name: "model.item" });
}
