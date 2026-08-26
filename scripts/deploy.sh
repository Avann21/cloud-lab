#!/bin/bash
set -e

echo "========================================="
echo "  Cloud-Lab Deploy Script"
echo "========================================="

SCRIPT_DIR="$(dirname "$0")"
PROJECT_DIR="$SCRIPT_DIR/.."

# Check if .env exists for backend
if [ ! -f "$PROJECT_DIR/nern-demo/.env" ]; then
  echo "❌ Error: nern-demo/.env not found!"
  echo "   Copy nern-demo/.env.example to nern-demo/.env and fill in values."
  exit 1
fi

# Build and start with Docker Compose
echo ""
echo "🐳 Building and starting Docker containers..."
docker compose -f "$PROJECT_DIR/docker/compose.yaml" up --build -d

echo ""
echo "========================================="
echo "  Deployment completed!"
echo "  Frontend: http://localhost:80"
echo "  Backend:  http://localhost:5000"
echo "========================================="
