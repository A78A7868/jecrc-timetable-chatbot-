#!/bin/bash
# JECRC Timetable ChatBot - Health Check

echo "System Health Check"
echo "==================="
echo ""

# Check Docker
echo -n "Docker: "
if docker info > /dev/null 2>&1; then
    echo "✓ Running"
else
    echo "✗ Not running"
fi

# Check n8n container
echo -n "n8n Container: "
if docker ps --format '{{.Names}}' | grep -q "jecrc-chatbot-n8n"; then
    echo "✓ Running"
else
    echo "✗ Not running"
fi

# Check n8n API
echo -n "n8n API: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz | grep -q "200"; then
    echo "✓ Responding (http://localhost:5678)"
else
    echo "✗ Not responding"
fi

# Check webhook endpoint
echo -n "Webhook Endpoint: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5678/webhook/chatbot \
    -H "Content-Type: application/json" \
    -d '{"query":"test"}' 2>/dev/null)
if [ "$RESPONSE" = "200" ]; then
    echo "✓ Active"
elif [ "$RESPONSE" = "404" ]; then
    echo "⚠ Workflow not activated (import and activate in n8n)"
else
    echo "✗ Error (HTTP $RESPONSE)"
fi

echo ""
echo "Done."
