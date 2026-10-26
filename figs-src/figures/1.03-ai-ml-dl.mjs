// 1.3 · AI ⊃ ML ⊃ DL as nested trays, a transformer stack in the middle, and a vector store that RAG reads from.
export const spec = { id: "t1-3", width: 600, height: 420, azimuth: 38, elevation: 38 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "1.3",
  title: L("AI, ML и DL", "AI, ML and DL", "IA, ML y DL"),
  cap: L("Как матрёшка: машинное обучение — часть AI, глубокое обучение — часть ML. В центре LLM, рядом векторная база для RAG.", "Like nesting dolls: machine learning is part of AI, deep learning is part of ML. An LLM sits in the middle, with a vector store for RAG beside it.", "Como muñecas rusas: el machine learning es parte de la IA y el deep learning, parte del ML. En el centro un LLM y al lado una base vectorial para RAG."),
  nodes: [
    { id: "ai", kw: "artificial intelligence|rule-based", name: L("AI", "AI", "IA"), read: L("Любые системы, которые решают задачи «разумно», включая правила", "Any system that solves tasks intelligently, rules included", "Cualquier sistema que resuelve tareas de forma inteligente, reglas incluidas") },
    { id: "ml", kw: "machine learning|supervised|unsupervised|reinforcement|label", name: L("ML", "ML", "ML"), read: L("Учится на данных: с учителем (метки), без учителя (кластеры), с подкреплением (награды)", "Learns from data: supervised (labels), unsupervised (clusters), reinforcement (rewards)", "Aprende de datos: supervisado (etiquetas), no supervisado (clústeres), por refuerzo (recompensas)") },
    { id: "dl", kw: "deep learning|neural|layer", name: L("DL", "DL", "DL"), read: L("Глубокие нейросети: много слоёв, нужны GPU и много данных", "Deep neural networks: many layers, lots of data and GPUs", "Redes neuronales profundas: muchas capas, muchos datos y GPU") },
    { id: "llm", kw: "LLM|transformer|generative|large language", name: L("LLM", "LLM", "LLM"), read: L("Генеративный AI на трансформерах · fine‑tuning и RAG его адаптируют", "Generative AI on transformers · fine-tuning and RAG adapt it", "IA generativa con transformers · fine-tuning y RAG la adaptan") },
    { id: "rag", kw: "RAG|retriev|vector|embedding", name: L("RAG", "RAG", "RAG"), read: L("Ищет документы в векторной базе и добавляет их в промпт LLM", "Finds documents in a vector store and adds them to the LLM prompt", "Busca documentos en una base vectorial y los añade al prompt del LLM") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -20, y: -90, w: 210, d: 180, r: 6 }, 7);
  const tray = (id, p, z, h) => { F.part("t", id, p, z, 2, { steps: 3, tone: "lo", name: id + ".floor" }, "", -1); const t = 2; for (const w of [{ x: p.x, y: p.y, w: t, d: p.d }, { x: p.x + t, y: p.y, w: p.w - 2 * t, d: t }, { x: p.x + p.w - t, y: p.y, w: t, d: p.d }, { x: p.x + t, y: p.y + p.d - t, w: p.w - 2 * t, d: t }]) F.part("t", id, { ...w, r: 0.3 }, z + 2, h, { steps: 1, bevel: 0, name: id + ".wall" }); };
  tray("ai", { x: 0, y: -76, w: 150, d: 152, r: 1 }, 0, 16);
  tray("ml", { x: 12, y: -64, w: 120, d: 124, r: 1 }, 2, 12);
  tray("dl", { x: 24, y: -52, w: 92, d: 98, r: 1 }, 4, 9);
  for (let i = 0; i < 6; i++) F.part("t", "llm", { x: 44 - i * 0, y: -32, w: 52, d: 56, r: 1.5 }, 6 + i * 4, 4, { steps: 2, tone: i % 2 ? "mid" : "hi", crease: "lo", name: "layer" });
  F.part("t", "llm", { x: 50, y: -26, w: 40, d: 44, r: 1 }, 30, 3, { steps: 2, tone: "hi", crease: "lo", name: "head" }, F.dots([[60, -14, 33], [70, -4, 33], [80, 6, 33]], { size: 0.6, tone: "hi" }));
  for (let j = 0; j < 3; j++) F.cyl("t", "rag", 176, -40, 12, j * 10, 10, { steps: 36, tone: j === 2 ? "hi" : "mid", crease: "lo", name: "vector", inner: F.line(k.sideArc(176, -40, 12, j * 10 + 5, F.P, 32), { tone: "faint" }) });
  F.wire("t", "rag", [[176, -28, 26], [176, 30, 26], [96, 30, 26], [96, 0, 26]], { name: "retrieve", width: 1.2, tone: "mid" });
}
