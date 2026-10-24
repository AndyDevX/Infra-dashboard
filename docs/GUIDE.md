# Learning guide

This project is a playground for technologies I haven't used yet. Each stage adds one new thing.
Links are official docs unless noted.

## Roadmap

| # | Stage | What I'll learn |
|---|---|---|
| 1 | Health endpoint in Go | `net/http`, project layout, Docker multi-stage build |
| 2 | Read host metrics | CPU / RAM / disk from Go |
| 3 | Read container metrics | Docker Engine API from Go |
| 4 | Stream over WebSocket | Go WebSocket server, JS client, reconnection |
| 5 | Frontend charts | Chart.js with live data, ES modules |
| 6 | Demo mode | Same UI with simulated data, no backend |
| 7 | Reverse proxy | Traefik in front of the server |
| 8 | Swarm deploy | Stack file, services, overlay network |
| 9 | CI/CD and Pages | GitHub Actions, GitHub Pages |
| 10 | Stretch | Prometheus metrics, MongoDB history, Grafana |

## Where does each thing go

Target layout. Folders marked *(later)* don't exist yet; create them when you reach that stage.

```
infra-dashboard/
├── web/                        # frontend, static (this is what GitHub Pages serves)
│   ├── index.html              # page layout and containers for the components
│   ├── css/app.css             # custom styles on top of Tailwind (later)
│   ├── demo/sample.json        # recorded metrics for replay mode (later)
│   └── js/
│       ├── main.js             # wiring only: pick source, feed state, render
│       ├── sources/            # data sources: mock, WebSocket (done)
│       ├── state/store.js      # latest sample + history buffer for charts (later)
│       ├── components/         # one file per widget: cpu-chart.js, container-table.js... (later)
│       └── utils/format.js     # formatBytes, formatUptime, small pure helpers (later)
├── server/                     # Go backend
│   ├── main.go                 # wiring only: config, start collectors, start HTTP server
│   ├── internal/
│   │   ├── metrics/            # host.go (gopsutil), docker.go (Docker API) (later)
│   │   ├── hub/hub.go          # fans samples out to every connected client (later)
│   │   └── api/                # health.go, ws.go: HTTP and WebSocket handlers (later)
│   ├── go.mod
│   └── Dockerfile
├── deploy/                     # Swarm stack file and Traefik config (later)
├── .github/workflows/          # ci.yml (tests, vet), pages.yml (deploy the demo) (later)
├── docs/                       # GUIDE.md, CONTRACT.md, notes
├── docker-compose.yml          # local development
└── .env.example                # documented variables, never real values (later)
```

### Quick answers

| If you are writing... | Put it in |
|---|---|
| A new chart, card or table | `web/js/components/<name>.js`, mounted from `main.js` |
| Something that holds data between messages (history for charts) | `web/js/state/store.js` |
| A formatter or small helper | `web/js/utils/` |
| A new way to get data (e.g. replaying a file) | `web/js/sources/`, extending `DataSource` |
| Recorded sample data for the demo | `web/demo/sample.json` |
| Reading CPU, RAM or disk | `server/internal/metrics/host.go` |
| Reading container stats from Docker | `server/internal/metrics/docker.go` |
| Sending samples to browsers | `server/internal/hub/` and `server/internal/api/ws.go` |
| A new HTTP route | `server/internal/api/` |
| Env vars and config | read in `server/main.go`, document in `.env.example` |
| Swarm stack, Traefik labels | `deploy/` |
| A GitHub Actions workflow | `.github/workflows/` |
| Notes on what you learned | `docs/` |

### Rules of thumb

- **`main.js` and `main.go` only wire things together.** Logic goes in its own file or package.
- **Change the message format in `docs/CONTRACT.md` first**, bump `v`, then update the mock and the Go
  backend. Both must keep emitting the same shape.
- **Anything inside `server/internal/` can't be imported from outside the module.** That's intended.
- **Never commit real secrets.** Put them in `.env` (ignored) and list the names in `.env.example`.
- **Keep the mock working.** The Pages demo depends on it, so test with `?demo=1` before pushing.

### Which stage touches what

| Stage | Files |
|---|---|
| 2 Host metrics | `server/internal/metrics/host.go` |
| 3 Container metrics | `server/internal/metrics/docker.go` |
| 4 WebSocket | `server/internal/hub/`, `server/internal/api/ws.go`, `web/js/sources/websocket.js` |
| 5 Charts | `web/js/components/`, `web/js/state/store.js` |
| 6 Demo mode | `web/js/sources/mock.js`, optionally `web/demo/sample.json` |
| 7 Reverse proxy | `docker-compose.yml`, Traefik labels |
| 8 Swarm | `deploy/` |
| 9 CI/CD and Pages | `.github/workflows/` |

## Go (backend)

- [A Tour of Go](https://go.dev/tour/) · [Getting started tutorial](https://go.dev/doc/tutorial/getting-started)
- [Go by Example](https://gobyexample.com/) · [Effective Go](https://go.dev/doc/effective_go)
- [`net/http`](https://pkg.go.dev/net/http) — enough for the REST/health endpoints

## Metrics sources

- Host metrics: [gopsutil](https://pkg.go.dev/github.com/shirou/gopsutil/v4)
- Container metrics: [Docker Engine API](https://docs.docker.com/reference/api/engine/) and the
  [Go SDK](https://docs.docker.com/reference/api/engine/sdk/) ([client package](https://pkg.go.dev/github.com/docker/docker/client))
- Later: [Prometheus overview](https://prometheus.io/docs/introduction/overview/) and its
  [Go client](https://pkg.go.dev/github.com/prometheus/client_golang/prometheus)

## WebSocket

- Browser side: [MDN WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- Go side, pick one: [gorilla/websocket](https://pkg.go.dev/github.com/gorilla/websocket) or
  [coder/websocket](https://pkg.go.dev/github.com/coder/websocket)

## Frontend

- [JavaScript modules (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Chart.js docs](https://www.chartjs.org/docs/latest/)
- [Tailwind CSS docs](https://tailwindcss.com/docs) · [Lucide icons](https://lucide.dev/guide/)

## Containers and deployment

- [Docker Compose](https://docs.docker.com/compose/)
- [Dockerfile best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker Swarm](https://docs.docker.com/engine/swarm/)
- [Traefik](https://doc.traefik.io/traefik/) · [Traefik Swarm provider](https://doc.traefik.io/traefik/providers/swarm/)
- [The Twelve-Factor App](https://12factor.net/) — config, logs and processes done right

## CI/CD and hosting

- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Pages](https://docs.github.com/en/pages) — the demo mode will be published here

## Stretch goals

- [MongoDB Go driver](https://www.mongodb.com/docs/drivers/go/current/) — store metric history
- [Grafana docs](https://grafana.com/docs/) — compare with a ready-made dashboard
