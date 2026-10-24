# Infra Dashboard

Real-time infrastructure dashboard: a Go backend streams container and host metrics over WebSocket
to a vanilla JS frontend. Includes a demo mode with simulated data.

> 🚧 Work in progress.

## Stack

Go · WebSocket · Docker / Docker Swarm · Traefik · Vanilla JS · Tailwind · Chart.js

## Structure

- `web/` — frontend (static, works on GitHub Pages in demo mode)
- `server/` — Go backend
- `docker-compose.yml` — local environment

## Run locally

```bash
docker compose up --build -d
curl localhost:8080/health   # ok
```
