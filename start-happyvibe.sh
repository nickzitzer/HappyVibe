#!/bin/bash

# HappyVibe Quick Start Script

set -e

echo "🎉 Welcome to HappyVibe - ServiceNow AI Development IDE"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your ServiceNow credentials:"
    echo "   - SN_INSTANCE_URL"
    echo "   - SN_USERNAME"
    echo "   - SN_PASSWORD"
    echo ""
    read -p "Press Enter after editing .env to continue..."
fi

# Load environment variables from .env
echo "📋 Loading configuration from .env..."
export $(grep -v '^#' .env | xargs)

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

# Auto-register ServiceNow MCP Server with Claude Code
echo ""
echo "🔌 Configuring ServiceNow MCP Server..."

if command -v claude &> /dev/null; then
    echo "✅ Found Claude Code"

    # Check if servicenow MCP server is already registered
    if claude mcp list 2>/dev/null | grep -q "servicenow:"; then
        echo "✅ ServiceNow MCP server already registered"
    else
        echo "📦 Registering ServiceNow MCP server..."

        # Check if servicenow-mcp-server is installed
        if ! command -v servicenow-mcp-server &> /dev/null && ! npm list -g servicenow-mcp-server &> /dev/null 2>&1; then
            echo "   Installing servicenow-mcp-server globally..."
            npm install -g servicenow-mcp-server > /dev/null 2>&1
        fi

        # Register with Claude Code (using correct SERVICENOW_* variable names)
        if [ -n "$SN_INSTANCE_URL" ] && [ -n "$SN_USERNAME" ] && [ -n "$SN_PASSWORD" ]; then
            claude mcp add \
                -s user \
                -e "SERVICENOW_INSTANCE_URL=${SN_INSTANCE_URL}" \
                -e "SERVICENOW_USERNAME=${SN_USERNAME}" \
                -e "SERVICENOW_PASSWORD=${SN_PASSWORD}" \
                servicenow \
                -- \
                npx servicenow-mcp-server 2>/dev/null

            if [ $? -eq 0 ]; then
                echo "✅ ServiceNow MCP server registered successfully!"
            else
                echo "⚠️  Could not auto-register MCP server"
                echo "   You can register it manually via the UI (Menu → MCP Manager)"
            fi
        else
            echo "⚠️  ServiceNow credentials not set in .env"
            echo "   You can register the MCP server manually via the UI"
        fi
    fi
else
    echo "⚠️  Claude Code not found (optional)"
    echo "   Install with: npm install -g @anthropics/claude-code"
    echo "   Or register MCP server via HappyVibe UI (Menu → MCP Manager)"
fi

echo ""
echo "🐳 Starting HappyVibe with Docker Compose..."
docker-compose up -d

echo ""
echo "✅ HappyVibe is starting up!"
echo ""
echo "📊 Services:"
echo "   - HappyVibe Web UI: http://localhost:9000"
echo "   - ServiceNow MCP Server: http://localhost:3100"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart: docker-compose restart"
echo ""
echo "🚀 Opening HappyVibe in your browser..."
sleep 3

# Open browser (works on macOS, Linux, WSL)
if command -v open &> /dev/null; then
    open http://localhost:9000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:9000
elif command -v wslview &> /dev/null; then
    wslview http://localhost:9000
else
    echo "Please open http://localhost:9000 in your browser"
fi

echo ""
echo "💡 Next steps:"
echo "   1. The ServiceNow MCP server is configured and ready!"
echo "   2. Click the menu → MCP Manager to verify"
echo "   3. Start a new chat and ask Claude to use ServiceNow tools!"
echo ""
echo "📚 Available: 20+ ServiceNow automation tools"
echo "📖 Read CLAUDE.md for best practices and MCP-first workflow"
echo ""
echo "🎯 Try asking Claude:"
echo "   'List available ServiceNow tables'"
echo "   'What ServiceNow tools are available?'"
