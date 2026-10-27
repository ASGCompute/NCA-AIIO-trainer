// 3.1 · Management and monitoring: a GPU node with its BMC on the out-of-band network, DCGM metrics flowing
// to Prometheus and Grafana, and Base Command Manager on the head node.
export const spec = { id: "t3-1", width: 620, height: 430, azimuth: 38, elevation: 30 };
const L = (ru, en, es) => ({ ru, en, es });
export const meta = {
  id: spec.id, topic: "3.1",
  title: L("Управление и мониторинг", "Management and monitoring", "Gestión y monitorización"),
  cap: L("BMC управляет железом по отдельной сети, даже когда ОС не отвечает. Метрики GPU идут через DCGM Exporter в Prometheus и на дашборды Grafana.", "The BMC manages the hardware over its own network, even when the OS is down. GPU metrics flow through DCGM Exporter into Prometheus and onto Grafana dashboards.", "El BMC gestiona el hardware por su propia red, aunque el SO no responda. Las métricas de GPU pasan por DCGM Exporter a Prometheus y a los paneles de Grafana."),
  nodes: [
    { id: "bmc", kw: "BMC|IPMI|Redfish|out-of-band|power|console", name: L("BMC", "BMC", "BMC"), read: L("IPMI и Redfish по OOB-сети: питание, датчики, удалённая консоль", "IPMI and Redfish over the OOB network: power, sensors, remote console", "IPMI y Redfish por la red OOB: energía, sensores, consola remota") },
    { id: "dcgm", kw: "DCGM|exporter|telemetry|health", name: L("DCGM Exporter", "DCGM Exporter", "DCGM Exporter"), read: L("Отдаёт метрики GPU: загрузка, память, температура, ошибки", "Publishes GPU metrics: utilization, memory, temperature, errors", "Publica métricas de GPU: uso, memoria, temperatura, errores") },
    { id: "prom", kw: "Prometheus|time series|scrape", name: L("Prometheus", "Prometheus", "Prometheus"), read: L("Собирает метрики со всех узлов и хранит как временные ряды", "Scrapes metrics from every node and stores them as time series", "Recoge métricas de todos los nodos y las guarda como series temporales") },
    { id: "graf", kw: "Grafana|dashboard|visuali", name: L("Grafana", "Grafana", "Grafana"), read: L("Дашборды и алерты поверх Prometheus", "Dashboards and alerts on top of Prometheus", "Paneles y alertas sobre Prometheus") },
    { id: "bcm", kw: "Base Command|provision|Mission Control|cluster manag", name: L("Base Command Manager", "Base Command Manager", "Base Command Manager"), read: L("Провижининг, мониторинг и настройка Slurm или Kubernetes", "Provisioning, monitoring and setting up Slurm or Kubernetes", "Aprovisionamiento, monitorización y configuración de Slurm o Kubernetes") },
  ],
};
export function build(F) {
  const { k } = F;
  F.base({ x: -18, y: -96, w: 214, d: 196, r: 6 }, 7);
  const N = { x: 0, y: -80, w: 70, d: 70, r: 1.5 };
  F.unit("n", null, N, 0, 26, { face: "x", ports: 4, pitch: 5, vents: 3, name: "gpu.node" });
  F.part("n", "bmc", { x: 70, y: -78, w: 4, d: 14, r: 0.6 }, 4, 12, { steps: 1, bevel: 0, tone: "hi", crease: "lo", name: "bmc" }, F.ports("x", 74, -75, -67, 7, 11, 1, 0.4));
  F.part("n", "dcgm", { x: 20, y: -60, w: 30, d: 20, r: 1 }, 26, 8, { steps: 2, tone: "hi", crease: "lo", name: "exporter" }, F.finsTop({ x: 20, y: -60, w: 30, d: 20, r: 0 }, 34, 3));
  F.unit("n", null, { x: 104, y: -90, w: 26, d: 50, r: 1 }, 0, 9, { face: "x", ports: 10, pitch: 4, led: "mid", name: "oob.switch" });
  F.wire("n", "bmc", [[74, -71, 9], [90, -71, 9], [90, -50, 9], [104, -50, 5]], { name: "oob", tone: "lo" });
  F.unit("h", "bcm", { x: 0, y: 10, w: 70, d: 46, r: 1.5 }, 0, 20, { face: "x", ports: 2, pitch: 5, bays: 4, name: "head" });
  for (let j = 0; j < 4; j++) F.cyl("p", "prom", 120, 10, 14, j * 9, 9, { steps: 40, tone: j === 3 ? "hi" : "mid", crease: "lo", name: "tsdb", inner: F.line(k.sideArc(120, 10, 14, j * 9 + 4.5, F.P, 36), { tone: "faint" }) });
  F.wire("p", "dcgm", [[50, -50, 30], [120, -50, 30], [120, -4, 30]], { name: "metrics", width: 1.2, tone: "mid" });
  F.cyl("g", "graf", 150, 66, 2, 0, 20, { steps: 14, name: "stand" });
  const SC = { x: 128, y: 64, w: 46, d: 3, r: 0.4 };
  const chart = F.line("M" + [[132, 67, 30], [140, 67, 36], [148, 67, 33], [156, 67, 42], [164, 67, 39], [170, 67, 46]].map((p) => F.at(p).map((v) => v.toFixed(1)).join(" ")).join("L"), { tone: "hi", free: true });
  F.part("g", "graf", SC, 20, 32, { steps: 1, bevel: 0, name: "screen", inner: F.faceRows("y", SC, [28, 36, 44]) }, chart);
  F.wire("g", "graf", [[120, 24, 18], [120, 56, 18], [140, 56, 18], [140, 64, 24]], { name: "query" });
}
