#!/bin/bash
set -e

echo "========================================="
echo "  Cloud-Lab Build Script"
echo "========================================="

# Build client
echo ""
echo "📦 Building client (React/Vite)..."
cd "$(dirname "$0")/../client"
npm install
npm run build
echo "✅ Client build complete!"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd "$(dirname "$0")/../nern-demo"
npm install --omit=dev
echo "✅ Backend dependencies installed!"

echo ""
echo "========================================="
echo "  Build completed successfully!"
echo "========================================="
