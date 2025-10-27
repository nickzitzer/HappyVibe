#!/bin/bash

# HappyVibe - ServiceNow MCP Server Setup Script
# This script registers the ServiceNow MCP server with Claude Code

set -e

echo "🔌 HappyVibe - ServiceNow MCP Server Setup"
echo ""

# Check for required variables
if [ -z "$SN_INSTANCE_URL" ]; then
    echo "⚠️  SN_INSTANCE_URL not set. Using default: https://dev276360.service-now.com"
    SN_INSTANCE_URL="https://dev276360.service-now.com"
fi

if [ -z "$SN_USERNAME" ]; then
    echo "⚠️  SN_USERNAME not set. Using default: admin"
    SN_USERNAME="admin"
fi

if [ -z "$SN_PASSWORD" ]; then
    echo "❌ SN_PASSWORD is required!"
    echo ""
    echo "Please set your ServiceNow credentials:"
    echo "  export SN_INSTANCE_URL=https://your-instance.service-now.com"
    echo "  export SN_USERNAME=your_username"
    echo "  export SN_PASSWORD=your_password"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found!"
    echo ""
    echo "Please install Claude Code first:"
    echo "  npm install -g @anthropics/claude-code"
    echo ""
    exit 1
fi

echo "✅ Found Claude Code"
echo ""

# Check if servicenow-mcp-server is installed globally
if ! command -v servicenow-mcp-server &> /dev/null && ! npm list -g servicenow-mcp-server &> /dev/null; then
    echo "📦 ServiceNow MCP Server not found globally. Installing..."
    npm install -g servicenow-mcp-server
    echo "✅ ServiceNow MCP Server installed"
else
    echo "✅ ServiceNow MCP Server already installed"
fi

echo ""
echo "🔧 Registering ServiceNow MCP Server with Claude Code..."
echo ""

# Add the MCP server using Claude CLI
claude mcp add \
    -s local \
    -e "SN_INSTANCE_URL=${SN_INSTANCE_URL}" \
    -e "SN_USERNAME=${SN_USERNAME}" \
    -e "SN_PASSWORD=${SN_PASSWORD}" \
    servicenow \
    -- \
    npx servicenow-mcp-server

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ServiceNow MCP Server registered successfully!"
    echo ""
    echo "📋 Server Details:"
    echo "   Name: servicenow"
    echo "   Instance: ${SN_INSTANCE_URL}"
    echo "   Username: ${SN_USERNAME}"
    echo "   Scope: local (this project only)"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Open HappyVibe: http://localhost:8080"
    echo "   2. Click menu → MCP Manager"
    echo "   3. Verify 'servicenow' server is listed"
    echo "   4. Start chatting with Claude using ServiceNow tools!"
    echo ""
    echo "📚 Available Tools: 20+ ServiceNow automation tools"
    echo "   • SN-Query-Records, SN-Create-Record, SN-Update-Record"
    echo "   • SN-Set-Update-Set, SN-Set-Current-Application"
    echo "   • SN-Execute-Background-Script"
    echo "   • And many more!"
    echo ""
else
    echo ""
    echo "❌ Failed to register ServiceNow MCP Server"
    echo ""
    echo "💡 Alternative: Register via HappyVibe UI"
    echo "   1. Open HappyVibe at http://localhost:8080"
    echo "   2. Click menu → MCP Manager → Add Server"
    echo "   3. Select 'Stdio' transport"
    echo "   4. Fill in:"
    echo "      Name: servicenow"
    echo "      Command: npx"
    echo "      Arguments: servicenow-mcp-server"
    echo "      Environment Variables:"
    echo "        SN_INSTANCE_URL = ${SN_INSTANCE_URL}"
    echo "        SN_USERNAME = ${SN_USERNAME}"
    echo "        SN_PASSWORD = ${SN_PASSWORD}"
    echo "   5. Click 'Add Stdio Server'"
    echo ""
    exit 1
fi
