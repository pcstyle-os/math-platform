# docker-compose

## Description

Manage multi-container Docker environments (up, down, logs, rebuild).

## Instructions

- Use `docker compose up -d` to start the environment in the background.
- Use `docker compose logs -f <service>` to monitor specific logs.
- Use `docker compose build --no-cache` if dependencies changed significantly.
- Ensure all services have health checks defined in `docker-compose.yml`.
- Use volume mounts for local development to enable hot-reloading.
