// 3.2 · Schedulers: jobs submitted on a login node wait on the Slurm queue as cards sized by their GPUs,
// the controller places them on partitions, and Kubernetes hands GPUs to pods through its device plugin.
export const spec = { id: "t3-2", width: 620, height: 440, azimuth: 36, elevation: 32 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "3.2",
  title: L("Slurm и Kubernetes", "Slurm and Kubernetes", "Slurm y Kubernetes"),
  cap: L("Задачи ждут в очереди Slurm, контроллер раздаёт им GPU по партициям. В Kubernetes GPU выдаёт device plugin.", "Jobs wait on the Slurm queue and the controller hands them GPUs across partitions. In Kubernetes the device plugin hands out GPUs.", "Los trabajos esperan en la cola de Slurm y el controlador les asigna GPU por particiones. En Kubernetes las GPU las reparte el device plugin."),
  nodes: [
    { id: "login", kw: "sbatch|srun|login|submit", name: L("Login и sbatch", "Login and sbatch", "Login y sbatch"), read: L("sbatch ставит задачу в очередь, srun запускает шаги, squeue показывает очередь", "sbatch queues a job, srun runs its steps, squeue shows the queue", "sbatch encola un trabajo, srun ejecuta sus pasos, squeue muestra la cola") },
    { id: "ctl", kw: "slurmctld|controller|scancel|sinfo", name: L("Контроллер Slurm", "Slurm controller", "Controlador de Slurm"), read: L("slurmctld решает, какой задаче какие узлы и GPU отдать", "slurmctld decides which nodes and GPUs each job gets", "slurmctld decide qué nodos y GPU recibe cada trabajo") },
    { id: "queue", kw: "queue|backfill|fair share|preempt|priority|gang", name: L("Очередь", "Queue", "Cola"), read: L("Приоритеты, fair share, backfill и вытеснение (preemption)", "Priorities, fair share, backfill and preemption", "Prioridades, fair share, backfill y expropiación (preemption)") },
    { id: "gres", kw: "gres|gpu:8|--gres", name: L("`--gres=gpu:8`", "`--gres=gpu:8`", "`--gres=gpu:8`"), read: L("Задача просит 8 GPU: `--gres=gpu:8` или `--gpus=8` · узел целиком только с `--exclusive`", "The job asks for 8 GPUs: `--gres=gpu:8` or `--gpus=8` · a whole node only with `--exclusive`", "El trabajo pide 8 GPU: `--gres=gpu:8` o `--gpus=8` · el nodo entero solo con `--exclusive`") },
    { id: "part", kw: "partition", name: L("Партиции", "Partitions", "Particiones"), read: L("Группы узлов с общими правилами: например gpu и debug", "Groups of nodes with shared rules, such as gpu and debug", "Grupos de nodos con reglas comunes, como gpu y debug") },
    { id: "k8s", kw: "Kubernetes|device plugin|nvidia\\.com/gpu|GPU Operator|pod", name: L("Kubernetes", "Kubernetes", "Kubernetes"), read: L("Pod просит `nvidia.com/gpu` · GPU Operator ставит драйвер, toolkit, device plugin и DCGM Exporter", "A pod requests `nvidia.com/gpu` · the GPU Operator installs the driver, toolkit, device plugin and DCGM Exporter", "Un pod pide `nvidia.com/gpu` · el GPU Operator instala el driver, el toolkit, el device plugin y DCGM Exporter") },
  ],
};
export function build(F) {
  F.base({ x: -18, y: -104, w: 220, d: 210, r: 6 }, 7);
  F.unit("s", "login", { x: 0, y: -90, w: 34, d: 30, r: 1 }, 0, 14, { face: "x", ports: 1, pitch: 4, bays: 2, name: "login" });
  F.unit("s", "ctl", { x: 0, y: -40, w: 34, d: 34, r: 1 }, 0, 18, { face: "x", ports: 2, pitch: 4, bays: 2, name: "slurmctld" });
  F.wire("s", "login", [[17, -60, 7], [17, -40, 7]], { name: "submit" });
  const Q = { x: 50, y: -96, w: 18, d: 120, r: 1 };
  F.part("s", "queue", Q, 0, 4, { steps: 2, tone: "lo", name: "rail" }, F.finsTop(Q, 4, 8, "x"));
  const jobs = [[1, 6], [2, 10], [8, 22], [4, 14], [1, 6]];
  let y = -92;
  for (const [g, d] of jobs) { F.part("s", g === 8 ? "gres" : "queue", { x: 53, y, w: 12, d, r: 1 }, 4, 4 + g * 0.6, { steps: 2, tone: g === 8 ? "hi" : "mid", crease: "lo", name: "job" }); y += d + 3; }
  F.wire("s", "ctl", [[34, -23, 9], [44, -23, 9], [44, 0, 9], [50, 0, 2]], { name: "schedule" });
  const P1 = F.rack("s", "part", { x: 92, y: -96, w: 40, d: 64, r: 1 }, 84, { name: "gpu.partition" });
  const P2 = F.rack("s", "part", { x: 92, y: -24, w: 40, d: 64, r: 1 }, 64, { name: "debug.partition" });
  for (let i = 0; i < 4; i++) F.unit("s", i === 1 ? "gres" : "part", P1, 6 + i * 18, 14, { face: "x", ports: 2, pitch: 4, name: "node" });
  for (let i = 0; i < 3; i++) F.unit("s", "part", P2, 6 + i * 18, 14, { face: "x", ports: 2, pitch: 4, name: "node" });
  F.wire("s", "gres", [[65, -44, 14], [80, -44, 14], [80, -60, 31], [92, -60, 31]], { name: "allocate", tone: "mid" });
  const K = { x: 150, y: 52, w: 40, d: 44, r: 1 };
  F.unit("k", "k8s", K, 0, 16, { face: "x", ports: 2, pitch: 4, vents: 3, name: "k8s.node" });
  for (let i = 0; i < 3; i++) F.part("k", "k8s", { x: 154 + i * 12, y: 58, w: 10, d: 32, r: 0.4 }, 16, 10, { steps: 1, bevel: 0, tone: "hi", crease: "lo", inner: F.faceLines("x", { x: 154 + i * 12, y: 58, w: 10, d: 32, r: 0 }, 17, 25, 3.2), name: "pod" });
}
