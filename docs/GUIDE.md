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
