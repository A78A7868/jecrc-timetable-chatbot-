#!/bin/bash
# JECRC Timetable ChatBot - Setup Script

set -e

echo "========================================="
echo "  JECRC Timetable ChatBot - Setup"
echo "========================================="
echo ""

# Check prerequisites
echo "[1/4] Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "ERROR: Docker Compose is not available."
    exit 1
fi

echo "  ✓ Docker found"
echo ""

# Setup environment
echo "[2/4] Setting up environment..."

if [ ! -f "../docker/.env" ]; then
    cp ../docker/.env.example ../docker/.env
    echo "  ✓ Created docker/.env (edit with your credentials)"
else
    echo "  ✓ docker/.env already exists"
fi

if [ ! -f "../.env" ]; then
    cp ../.env.example ../.env
    echo "  ✓ Created .env (edit with your API keys)"
else
    echo "  ✓ .env already exists"
fi

echo ""

# Start Docker containers
echo "[3/4] Starting n8n container..."
cd ../docker
docker compose up -d
echo "  ✓ n8n is starting..."
echo ""

# Wait for n8n
echo "[4/4] Waiting for n8n to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:5678/healthz > /dev/null 2>&1; then
        echo "  ✓ n8n is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "  ⚠ n8n is taking longer than expected. Check: docker logs jecrc-chatbot-n8n"
    fi
    sleep 2
done

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "  n8n Dashboard: http://localhost:5678"
echo "  Chat Interface: Open frontend/index.html"
echo ""
echo "  Next steps:"
echo "  1. Open n8n and import: n8n-workflows/main-chatbot-workflow.json"
echo "  2. Configure Google Sheets credentials in n8n"
echo "  3. Add your Gemini API key in n8n credentials"
echo "  4. Activate the workflow"
echo "  5. Open frontend/index.html and start chatting!"
echo ""
