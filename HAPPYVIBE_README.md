# HappyVibe - ServiceNow AI Development IDE

A clean web-based IDE for ServiceNow development powered by Claude Code and MCP servers.

## 🔔 Important: MCP Server Persistence

**The ServiceNow MCP server registration is PERSISTENT** - it remains registered in Claude Code even after stopping HappyVibe.

- ✅ **Persists across sessions**: The MCP server is registered at "user" scope in `~/.claude.json`
- ✅ **Available everywhere**: Works in all Claude Code sessions, not just HappyVibe
- ✅ **Automatic startup**: Claude Code spawns the MCP server on-demand when needed

**To stop HappyVibe web server:**
```bash
lsof -ti :8080 | xargs kill -9
```

**To completely remove the MCP server registration:**
```bash
claude mcp remove servicenow
```

## What You Have

✅ **Web Server Running** on `http://localhost:8080`
✅ **Beautiful Color Themes** - Dark, Light, Gray, White (built-in)
✅ **Claude Code Integration** - Full WebSocket streaming support
✅ **Session Management** - Track and resume coding sessions
✅ **Real-time AI Assistance** - Chat with Claude about your code

## Quick Start

### 1. Start the Server

```bash
cd /Users/nczitzer/WebstormProjects/HappyVibe

# Build frontend (only needed once or after code changes)
npm run build

# Start web server
cd src-tauri && cargo run --bin opcode-web
```

The server will start on **http://localhost:8080**

### 2. Access the IDE

Open your browser to: **http://localhost:8080**

### 3. Configure ServiceNow MCP Server

#### Option A: Via MCP Manager UI ⭐ (Recommended)

The easiest way to configure the ServiceNow MCP server with your credentials:

1. **Open HappyVibe** at http://localhost:8080
2. **Click the menu** (top-left) → **MCP Manager**
3. **Click "Add Server" tab**
4. **Select "Stdio" transport** (default)
5. **Fill in the form:**
   - **Server Name:** `servicenow`
   - **Command:** `npx`
   - **Arguments:** `servicenow-mcp-server`
   - **Scope:** Local (this project only) or User (all projects)
6. **Add Environment Variables** (click "+ Add Variable"):
   - `SN_INSTANCE_URL` = `https://dev276360.service-now.com`
   - `SN_USERNAME` = `admin`
   - `SN_PASSWORD` = `your_password_here`
7. **Click "Add Stdio Server"**
8. **Done!** The ServiceNow MCP server is now registered

The UI allows you to:
- ✅ Easily add/edit environment variables
- ✅ Choose scope (local, project, or user-wide)
- ✅ Test connection before saving
- ✅ Import from Claude Desktop config
- ✅ Export/backup your configuration

#### Option B: Via Setup Script (Command Line)

```bash
# Set your credentials
export SN_INSTANCE_URL=https://dev276360.service-now.com
export SN_USERNAME=admin
export SN_PASSWORD=your_password

# Run the setup script
./setup-mcp.sh
```

#### Option C: Via Claude Desktop Config (Import)

If you already have Claude Desktop configured with your ServiceNow MCP server:

1. Open MCP Manager
2. Click **Import/Export** tab
3. Click **Import from Claude Desktop**
4. Select your ServiceNow MCP server
5. Choose scope and click Import

## Color Themes

The app includes 4 beautiful color schemes (already configured):

- **Dark**: Navy backgrounds (#032d42), Teal accents (#00a3ba)
- **Light**: Clean white with teal accents
- **Gray**: Neutral gray theme
- **White**: High contrast light theme

Switch themes via the settings menu in the top-right corner.

## Features

- 🤖 **Chat with Claude**: Real-time AI assistance for ServiceNow development
- 📁 **Project Management**: Track multiple projects and sessions
- 🔌 **MCP Integration**: Connect to ServiceNow via MCP tools (20+ tools available)
- 💬 **Session History**: Resume previous conversations with full context
- 🎨 **Beautiful UI**: Modern, responsive interface with multiple themes
- 📊 **Usage Tracking**: Monitor your Claude API usage and costs

## ServiceNow MCP Tools Available

Once your ServiceNow MCP server is configured, you'll have access to:

- `SN-Get-Table-Schema` - Get table structure
- `SN-Create-Record` - Create records
- `SN-Update-Record` - Update records
- `SN-Query-Records` - Query ServiceNow data
- `SN-Execute-Background-Script` - Run server-side scripts
- `SN-Set-Current-Application` - Set scope
- `SN-Set-Update-Set` - Manage update sets
- **20+ more tools** for complete ServiceNow automation

## Development

### Rebuild Frontend

```bash
cd /Users/nczitzer/WebstormProjects/HappyVibe
npm run build
```

### Rebuild & Restart Server

```bash
# Stop the running server (Ctrl+C)
# Then rebuild and restart
cd src-tauri && cargo run --bin opcode-web
```

## Architecture

```
┌─────────────────┐    WebSocket     ┌─────────────────┐    Process     ┌─────────────────┐
│   Browser UI    │ ←──────────────→ │  Rust Backend   │ ────────────→  │  Claude Binary  │
│                 │    REST API      │   (Axum Server) │               │                 │
│ • React/TS      │ ←──────────────→ │                 │               │ • claude-code   │
│ • WebSocket     │                  │ • Session Mgmt  │               │ • Subprocess    │
│ • DOM Events    │                  │ • Process Spawn │               │ • Stream Output │
└─────────────────┘                  └─────────────────┘               └─────────────────┘
```

## Troubleshooting

### Server won't start

```bash
# Check if port 8080 is already in use
lsof -i :8080

# Kill the process if needed
kill -9 <PID>
```

### Frontend not loading

```bash
# Rebuild the frontend
cd /Users/nczitzer/WebstormProjects/HappyVibe
npm run build
```

### MCP server connection fails

1. Verify your ServiceNow credentials are correct
2. Check the MCP server path is valid
3. Ensure your ServiceNow instance is accessible
4. Check browser console for detailed error messages

## 🔌 ServiceNow MCP Integration

### Option 1: Docker Compose (Recommended)

**Includes both HappyVibe and ServiceNow MCP server:**

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your ServiceNow credentials

# 2. Start all services
docker-compose up -d

# 3. Access HappyVibe
open http://localhost:8080
```

**What you get:**
- ✅ HappyVibe web server on port 8080
- ✅ ServiceNow MCP server on port 3000
- ✅ Pre-configured connection
- ✅ 20+ ServiceNow tools ready to use

### Option 2: NPM Global Install

```bash
# Install MCP server globally
npm install -g servicenow-mcp-server

# Set environment variables
export SN_INSTANCE_URL=https://dev276360.service-now.com
export SN_USERNAME=admin
export SN_PASSWORD=your_password

# Start MCP server
servicenow-mcp-server

# In another terminal, start HappyVibe
cd /Users/nczitzer/WebstormProjects/HappyVibe
npm run web
```

### Option 3: Docker MCP Server Only

```bash
# Run MCP server in Docker
docker run -d --name happyvibe-mcp \
  -p 3000:3000 \
  -e SN_INSTANCE_URL=https://dev276360.service-now.com \
  -e SN_USERNAME=admin \
  -e SN_PASSWORD=your_password \
  nczitzer/mcp-servicenow-nodejs:latest

# Start HappyVibe normally
cd src-tauri && cargo run --bin opcode-web
```

### MCP Configuration in HappyVibe

**Via UI** (Easiest):
1. Open HappyVibe at http://localhost:8080
2. Click menu → **MCP Manager**
3. Click **Add Server**
4. Use one of the pre-configured templates:
   - **Docker**: `http://localhost:3000`
   - **NPM**: Local installation path
   - **Remote**: Your deployed MCP server URL

**Via Config File**:
Edit `mcp-config.json`:
```json
{
  "mcpServers": {
    "servicenow": {
      "command": "node",
      "args": ["/path/to/servicenow-mcp-server"],
      "env": {
        "SN_INSTANCE_URL": "https://dev276360.service-now.com",
        "SN_USERNAME": "admin",
        "SN_PASSWORD": "your_password_here"
      },
      "autoStart": true
    }
  }
}
```

## Available MCP Tools (20+)

Once connected, you'll have access to:

**Generic Operations** (6 tools):
- `SN-Query-Table` - Query any table with filters
- `SN-Create-Record` - Create records
- `SN-Get-Record` - Get single record details
- `SN-Update-Record` - Update records
- `SN-Get-Table-Schema` - Discover table structure
- `SN-List-Available-Tables` - Browse available tables

**Update Set Management** (3 tools):
- `SN-Set-Update-Set` - Set current update set (~2 seconds!)
- `SN-Get-Current-Update-Set` - Verify current update set
- `SN-List-Update-Sets` - List available update sets

**Application Scope** (1 tool):
- `SN-Set-Current-Application` - Set application scope

**Script Execution** (2 tools):
- `SN-Execute-Background-Script` - Run server-side JavaScript
- `SN-Create-Fix-Script` - Generate scripts for manual execution

**Convenience Tools** (8+ tools):
- `SN-List-Incidents`, `SN-Create-Incident`
- `SN-List-SysUsers`, `SN-List-CmdbCis`
- `SN-List-SysUserGroups`
- `SN-List-ChangeRequests`, `SN-List-Problems`

## What's Next

1. **Configure your ServiceNow MCP server** (see above options)
2. **Start a new chat** and ask Claude to help with ServiceNow development
3. **Use MCP-first workflow** - read CLAUDE.md for best practices
4. **Enjoy fully automated development** - no manual UI clicks needed!

### Quick Start Example

```javascript
// 1. Set application scope
SN-Set-Current-Application({ app_sys_id: "abc123" });

// 2. Set update set (~2 seconds!)
SN-Set-Update-Set({ update_set_sys_id: "def456" });

// 3. Create configuration (automatically captured!)
SN-Create-Record({
  table_name: "sys_properties",
  data: {
    name: "my_app.setting",
    value: "enabled"
  }
});
```

---

**Built on OpCode** - A powerful GUI for Claude Code
**ServiceNow MCP**: Integrated for automated development
**License**: AGPL-3.0
**Web Server Mode**: Enabled for browser access
