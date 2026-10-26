// 1.6 · NVIDIA software solutions as cargo on a GPU server: NIM containers and a NeMo container
// on an AI Enterprise pallet, with an OpenAI-compatible endpoint cabled to a client laptop.
export const spec = { id: "t1-6", width: 600, height: 430, azimuth: 40, elevation: 32 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "1.6",
  title: L("NIM, NeMo и AI Enterprise", "NIM, NeMo and AI Enterprise", "NIM, NeMo y AI Enterprise"),
  cap: L("Готовые контейнеры едут на GPU-сервер: NIM для инференса, NeMo для полного цикла генеративного AI, всё на поддерживаемой платформе AI Enterprise.", "Ready containers ride on a GPU server: NIM for inference, NeMo for the full generative AI cycle, all on the supported AI Enterprise platform.", "Contenedores listos sobre un servidor GPU: NIM para inferencia, NeMo para todo el ciclo de IA generativa, todo sobre la plataforma con soporte AI Enterprise."),
  nodes: [
    { id: "nim", kw: "NIM|microservice|inference container", name: L("NIM", "NIM", "NIM"), read: L("Готовые инференс-контейнеры с оптимизированной моделью внутри", "Ready inference containers with an optimized model inside", "Contenedores de inferencia listos con un modelo optimizado dentro") },
    { id: "nemo", kw: "NeMo|customiz|fine-tun|generative", name: L("NeMo", "NeMo", "NeMo"), read: L("Фреймворк полного цикла генеративного AI: данные, обучение, дообучение", "A framework for the full generative AI cycle: data, training, fine-tuning", "Framework de todo el ciclo de IA generativa: datos, entrenamiento, ajuste") },
    { id: "aie", kw: "AI Enterprise|support|certified|licens", name: L("AI Enterprise", "AI Enterprise", "AI Enterprise"), read: L("Сертифицированный стек с поддержкой · лицензия на GPU", "A certified, supported stack · licensed per GPU", "Pila certificada y con soporte · licencia por GPU") },
    { id: "api", kw: "API|OpenAI|endpoint", name: L("API", "API", "API"), read: L("NIM отвечает по OpenAI-совместимому API · приложение просто шлёт запрос", "NIM answers on an OpenAI-compatible API · the app just sends a request", "NIM responde con una API compatible con OpenAI · la app solo envía la petición") },
    { id: "server", kw: "GPU server|DGX|certified system", name: L("GPU-сервер", "GPU server", "Servidor GPU"), read: L("Любой сертифицированный сервер с GPU NVIDIA, в ЦОД или в облаке", "Any certified server with NVIDIA GPUs, on-prem or in the cloud", "Cualquier servidor certificado con GPU de NVIDIA, propio o en la nube") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -16, y: -76, w: 214, d: 152, r: 6 }, 7);
  const S = { x: 0, y: -60, w: 110, d: 120, r: 2 };
  F.unit("s", "server", S, 0, 22, { face: "x", ports: 4, pitch: 5, bays: 6, name: "server" });
  const PAL = { x: 4, y: -56, w: 102, d: 112, r: 1 };
  F.part("s", "aie", PAL, 22, 4, { steps: 2, tone: "lo", name: "pallet" }, F.faceLines("x", PAL, 22, 26, 6) + F.faceLines("y", PAL, 22, 26, 6));
  const box = (sel, p, h, name) => F.part("s", sel, p, 26, h, { steps: 1, bevel: 0, tone: "hi", crease: "lo", inner: F.faceLines("x", p, 27, 26 + h - 1, 2.2) + F.faceLines("y", p, 27, 26 + h - 1, 2.6), name }, F.line(k.planOutline(k.insetPlan(p, 1.6), 26 + h, F.P, 1), { tone: "faint" }));
  for (let i = 0; i < 3; i++) box("nim", { x: 60, y: -50 + i * 34, w: 40, d: 28, r: 0.3 }, 18, "nim");
  box("nemo", { x: 10, y: -50, w: 42, d: 96, r: 0.3 }, 30, "nemo");
  const LT = { x: 150, y: -10, w: 30, d: 40, r: 1 };
  F.part("c", "api", LT, 0, 2.4, { steps: 2, name: "laptop" }, F.grid({ x: 152, y: -6, w: 26, d: 28, r: 0 }, 2.4, 4));
  F.part("c", "api", { x: 150, y: 30, w: 30, d: 2, r: 0.3 }, 2.4, 22, { steps: 1, bevel: 0, tone: "hi", crease: "lo", name: "screen", inner: F.faceRows("y", { x: 150, y: 30, w: 30, d: 2, r: 0 }, [8, 12, 16]) });
  F.wire("c", "api", [[110, 44, 8.6], [130, 44, 8.6], [130, 0, 8.6], [150, 0, 1.6]], { name: "api" });
}
