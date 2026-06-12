#!/bin/bash
set -e

echo "🐳 Docker Build — Admin Frontend"
echo "================================"

MODE="${1:-prod}"

case "$MODE" in
  dev)
    echo "▶ Development (HMR)  → http://localhost:3000"
    docker compose up frontend-dev --build
    ;;
  down)
    echo "▶ Stop & Remove"
    docker compose down
    ;;
  rebuild)
    echo "▶ Rebuild Production (no cache)"
    docker compose build --no-cache frontend-prod
    docker compose up frontend-prod -d
    echo "✅ http://localhost:3030/notices"
    ;;
  prod|*)
    echo "▶ Production (Nginx) → http://localhost:3030"
    docker compose up frontend-prod -d --build
    echo "✅ http://localhost:3030/notices"
    ;;
esac
