import { DataSource } from "./base.js";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const noise = (amount) => (Math.random() - 0.5) * 2 * amount;

const SERVICES = [
  { name: "api", cpu: 22, mem: 180 },
  { name: "worker", cpu: 35, mem: 260 },
  { name: "postgres", cpu: 14, mem: 420 },
  { name: "redis", cpu: 5, mem: 60 },
  { name: "traefik", cpu: 4, mem: 45 },
  { name: "nginx", cpu: 3, mem: 30 },
];

/**
 * Simulated metrics with a realistic shape: slow waves plus noise, occasional
 * CPU spikes, and containers that sometimes crash and restart.
 */
export class MockSource extends DataSource {
  #timer = null;
  #tick = 0;
  #spike = 0;
  #containers = SERVICES.map((s, i) => ({
    ...s,
    id: (0xa1b2c3d4e5f6 + i * 7919).toString(16),
    state: "running",
    uptime: 3600 * (i + 1),
    down: 0,
  }));

  constructor({ intervalMs = 1000 } = {}) {
    super();
    this.intervalMs = intervalMs;
  }

  start() {
    if (this.#timer) return;
    this.setStatus("live");
    this.#timer = setInterval(() => this.emit(this.#sample()), this.intervalMs);
    this.emit(this.#sample());
  }

  stop() {
    clearInterval(this.#timer);
    this.#timer = null;
    this.setStatus("down");
  }

  #sample() {
    const t = this.#tick++;
    if (this.#spike > 0) this.#spike--;
    else if (Math.random() < 0.02) this.#spike = 5 + Math.floor(Math.random() * 8);
    const spikeBoost = this.#spike > 0 ? 35 : 0;

    const cpu = clamp(35 + 15 * Math.sin(t / 25) + spikeBoost + noise(6), 2, 100);
    const mem = clamp(58 + 6 * Math.sin(t / 90) + t * 0.003 + noise(0.8), 5, 97);
    const rx = Math.max(0, 150_000 + 90_000 * Math.sin(t / 15) + noise(40_000));
    const tx = Math.max(0, 90_000 + 60_000 * Math.sin(t / 18 + 1) + noise(25_000));

    return {
      v: 1,
      ts: Date.now(),
      host: {
        cpu: round(cpu),
        mem: round(mem),
        disk: round(48 + t * 0.0005),
        load: [round(cpu / 40), round(cpu / 45), round(cpu / 50)],
        net: { rx: Math.round(rx), tx: Math.round(tx) },
      },
      containers: this.#containers.map((c) => this.#stepContainer(c, cpu, spikeBoost)),
    };
  }

  #stepContainer(c, hostCpu, spikeBoost) {
    if (c.state === "running" && Math.random() < 0.002) {
      c.state = "restarting";
      c.down = 3 + Math.floor(Math.random() * 4);
      c.uptime = 0;
    } else if (c.state === "restarting" && --c.down <= 0) {
      c.state = "running";
    }

    const running = c.state === "running";
    if (running) c.uptime += this.intervalMs / 1000;

    return {
      id: c.id,
      name: c.name,
      state: c.state,
      cpu: running ? round(clamp(c.cpu * (hostCpu / 40) + (spikeBoost ? 8 : 0) + noise(2), 0, 100)) : 0,
      mem: running ? Math.round(c.mem + noise(c.mem * 0.04)) : 0,
      uptime: Math.round(c.uptime),
    };
  }
}

function round(n) {
  return Math.round(n * 10) / 10;
}
