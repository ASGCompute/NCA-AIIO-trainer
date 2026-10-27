// 2.5 · Cluster components: one rack holding every role, and the four networks of a DGX SuperPOD.
export const spec = { id: "t2-5", width: 560, height: 560, azimuth: 40, elevation: 26 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "2.5",
  title: L("Кластер в одной стойке", "A cluster in one rack", "Un clúster en un rack"),
  cap: L("Каждая роль на своём месте и четыре отдельные сети: вычислительная, хранения, in-band и out-of-band.", "Every role in its place and four separate networks: compute, storage, in-band and out-of-band.", "Cada función en su sitio y cuatro redes separadas: cómputo, almacenamiento, in-band y out-of-band."),
  nodes: [
    { id: "compute", kw: "compute node|GPU node|run the largest", name: L("GPU-узлы", "GPU nodes", "Nodos GPU"), read: L("Здесь идёт обучение · у каждого GPU свой порт 400G в фабрику", "Training runs here · every GPU has its own 400G port into the fabric", "Aquí se entrena · cada GPU tiene su propio puerto de 400G a la red") },
    { id: "cfab", kw: "compute fabric|GPU-to-GPU|east", name: L("Compute fabric", "Compute fabric", "Red de cómputo"), read: L("Зелёные кабели · InfiniBand или Spectrum‑X · rail-optimized, без переподписки", "Green cables · InfiniBand or Spectrum-X · rail-optimized, non-blocking", "Cables verdes · InfiniBand o Spectrum-X · optimizada por rieles, sin sobresuscripción") },
    { id: "storage", kw: "shared storage|dataset|checkpoint|parallel file", name: L("Хранилище", "Storage", "Almacenamiento"), read: L("Общее для всех узлов: датасеты и чекпоинты · параллельная ФС", "Shared by every node: datasets and checkpoints · parallel file system", "Compartido por todos los nodos: datasets y checkpoints · sistema de archivos paralelo") },
    { id: "sfab", kw: "storage fabric|storage network", name: L("Storage fabric", "Storage fabric", "Red de almacenamiento"), read: L("Синий кабель · Своя сеть к хранилищу: чтение данных не мешает all-reduce", "Blue cable · Its own network to storage: reading data doesn't slow all-reduce", "Cable azul · Red propia hacia el almacenamiento: leer datos no frena el all-reduce") },
    { id: "head", kw: "head|management node|provisioning|Base Command", name: L("Head-узлы", "Head nodes", "Nodos head"), read: L("Base Command Manager, контроллер Slurm или Kubernetes, мониторинг", "Base Command Manager, the Slurm or Kubernetes controller, monitoring", "Base Command Manager, el controlador de Slurm o Kubernetes, monitorización") },
    { id: "login", kw: "login|submission|user", name: L("Login-узлы", "Login nodes", "Nodos de login"), read: L("Вход пользователей: код, данные и отправка задач (sbatch)", "Where users log in: code, data and job submission (sbatch)", "Entrada de usuarios: código, datos y envío de trabajos (sbatch)") },
    { id: "inband", kw: "in-band", name: L("In-band", "In-band", "In-band"), read: L("Чёрный кабель · Ethernet для ОС, сервисов и доступа к узлам", "Black cable · Ethernet for the OS, services and node access", "Cable negro · Ethernet para el SO, los servicios y el acceso a los nodos") },
    { id: "oob", kw: "out-of-band|BMC|IPMI|Redfish", name: L("Out-of-band", "Out-of-band", "Out-of-band"), read: L("Красный кабель · BMC по 1 GbE: питание и консоль, даже если ОС не отвечает", "Red cable · BMC over 1 GbE: power and console even when the OS is down", "Cable rojo · BMC por 1 GbE: energía y consola aunque el SO no responda") },
  ],
};
export function build(F) {
  F.base({ x: -30, y: -78, w: 150, d: 156, r: 6 }, 7);
  const I = F.rack("rack", null, { x: 0, y: -50, w: 56, d: 100, r: 1 }, 180);
  const U = (z, h) => ({ ...I });
  F.unit("rack", "storage", U(), 3, 30, { face: "x", bays: 6, vents: 0, name: "storage" });
  for (let i = 0; i < 4; i++) F.unit("rack", "compute", U(), 36 + i * 18, 16, { face: "x", ports: 2, pitch: 4, name: "compute" });
  F.unit("rack", "head", U(), 112, 9, { face: "x", ports: 2, pitch: 4, name: "head" });
  F.unit("rack", "login", U(), 123, 9, { face: "x", ports: 1, pitch: 4, name: "login" });
  F.unit("rack", "oob", U(), 138, 5, { face: "x", ports: 12, pitch: 4, led: "mid", name: "oob" });
  F.unit("rack", "inband", U(), 145, 6, { face: "x", ports: 12, pitch: 4, name: "inband" });
  F.unit("rack", "sfab", U(), 153, 6, { face: "x", ports: 12, pitch: 4, name: "sfab" });
  F.unit("rack", "cfab", U(), 161, 9, { face: "x", ports: 16, pitch: 4, name: "cfab" });
  const X = I.x + I.w, pz = (z, h) => z + h * 0.3 + 1.6;
  for (let i = 0; i < 4; i++) {
    const z0 = pz(36 + i * 18, 16), zt = pz(161, 9), x = 60 + i * 2.2, y = 38, yt = -10 + i * 4;
    F.wire("net", "cfab", [[X, y, z0], [x, y, z0], [x, y, zt], [x, yt, zt], [X, yt, zt]], { name: "cfab.cable", tone: "green", width: 1.1 });
  }
  F.wire("net", "sfab", [[X, -40, 18], [70, -40, 18], [70, -40, pz(153, 6)], [70, -2, pz(153, 6)], [X, -2, pz(153, 6)]], { name: "sfab.cable", tone: "blue", width: 1.1 });
  F.wire("net", "inband", [[X, 38, pz(112, 9)], [76, 38, pz(112, 9)], [76, 38, pz(145, 6)], [76, 2, pz(145, 6)], [X, 2, pz(145, 6)]], { name: "inband.cable", tone: "hi", width: 1.1 });
  F.wire("net", "oob", [[X, 42, pz(90, 16)], [82, 42, pz(90, 16)], [82, 42, pz(138, 5)], [82, 6, pz(138, 5)], [X, 6, pz(138, 5)]], { name: "oob.cable", tone: "red", width: 1.1 });
}
