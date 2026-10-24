# Data contract

Every data source (real WebSocket backend or mock) emits the same message, once per second.

```json
{
  "v": 1,
  "ts": 1730000000000,
  "host": {
    "cpu": 42.5,
    "mem": 61.2,
    "disk": 48.0,
    "load": [0.52, 0.48, 0.41],
    "net": { "rx": 120394, "tx": 80211 }
  },
  "containers": [
    {
      "id": "a1b2c3d4e5f6",
      "name": "api",
      "state": "running",
      "cpu": 12.3,
      "mem": 148,
      "uptime": 86400
    }
  ]
}
```

| Field | Unit | Notes |
|---|---|---|
| `v` | – | Contract version. Bump on breaking changes |
| `ts` | ms since epoch | Time the sample was taken |
| `host.cpu`, `host.mem`, `host.disk` | % (0–100) | |
| `host.load` | – | 1, 5 and 15 minute load average |
| `host.net.rx` / `tx` | bytes per second | |
| `containers[].state` | – | `running`, `restarting` or `exited` |
| `containers[].cpu` | % of one core | |
| `containers[].mem` | MiB | |
| `containers[].uptime` | seconds | `0` when not running |

## Source interface (frontend)

Every source in `web/js/sources/` exposes:

- `subscribe(handler)` — `handler(message)` on each sample. Returns an unsubscribe function.
- `onStatus(handler)` — `handler("connecting" | "live" | "down")`.
- `start()` / `stop()`

The WebSocket endpoint of the Go backend will be `GET /ws`, sending one JSON message per sample.
