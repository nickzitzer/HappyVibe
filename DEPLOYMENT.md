# HappyVibe Deployment Guide

## Overview

HappyVibe is a web-based ServiceNow AI Development IDE with integrated MCP (Model Context Protocol) support. This guide covers all deployment options.

## Prerequisites

- **Docker** (for Docker deployment): [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (for Docker deployment): [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Node.js 20+** (for NPM deployment): [Install Node.js](https://nodejs.org/)
- **Rust 1.75+** (for source build): [Install Rust](https://rustup.rs/)

## Quick Start (Recommended)

### 1. Clone and Configure

```bash
cd /Users/nczitzer/WebstormProjects/HappyVibe

# Copy environment template
cp .env.example .env

# Edit with your ServiceNow credentials
nano .env
```

**Required environment variables:**
```bash
SN_INSTANCE_URL=https://dev276360.service-now.com
SN_USERNAME=admin
SN_PASSWORD=your_password_here
```

### 2. Start Services

```bash
# One-command start with automatic MCP registration
./start-happyvibe.sh

# Or manually with Docker Compose
docker-compose up -d
```

**What `start-happyvibe.sh` does:**
- ✅ Loads credentials from `.env`
- ✅ Auto-installs `servicenow-mcp-server` if needed
- ✅ **Automatically registers ServiceNow MCP server with Claude Code**
- ✅ Starts both HappyVibe and MCP server containers
- ✅ Opens browser to http://localhost:8080

**No manual MCP configuration needed!** The script handles everything.

### 3. Access HappyVibe

Open your browser to: **http://localhost:8080**

**Services running:**
- 🌐 HappyVibe Web UI: http://localhost:8080
- 🔧 ServiceNow MCP Server: http://localhost:3000
- 🔌 **ServiceNow MCP: Auto-registered and ready!**

## Deployment Options

### Option 1: Docker Compose (Recommended)

**Pros:**
- ✅ Everything pre-configured
- ✅ Both HappyVibe + MCP server included
- ✅ Easy to start/stop
- ✅ Isolated environment

**Steps:**

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with credentials

# 2. Start services
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

**Architecture:**
```
┌─────────────────────┐
│   Browser (You)     │
└──────────┬──────────┘
           │
           │ http://localhost:8080
           ▼
┌─────────────────────┐
│  HappyVibe Server   │──────┐
│  (Rust/Axum)        │      │
│  Port: 8080         │      │
└─────────────────────┘      │
                              │ Internal Network
                              │ (happyvibe-network)
┌─────────────────────┐      │
│  ServiceNow MCP     │◀─────┘
│  (Node.js)          │
│  Port: 3000         │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│  ServiceNow         │
│  dev276360...       │
└─────────────────────┘
```

### Option 2: NPM + Local Server

**Pros:**
- ✅ No Docker required
- ✅ Direct access to logs
- ✅ Easy to modify

**Steps:**

```bash
# 1. Install MCP server globally
npm install -g servicenow-mcp-server

# 2. Set environment variables
export SN_INSTANCE_URL=https://dev276360.service-now.com
export SN_USERNAME=admin
export SN_PASSWORD=your_password

# 3. Start MCP server (terminal 1)
servicenow-mcp-server

# 4. Start HappyVibe (terminal 2)
cd /Users/nczitzer/WebstormProjects/HappyVibe
npm run build
cd src-tauri && cargo run --bin opcode-web
```

### Option 3: Docker MCP + Local HappyVibe

**Pros:**
- ✅ MCP server isolated in Docker
- ✅ HappyVibe runs natively (faster iteration)

**Steps:**

```bash
# 1. Start MCP server in Docker
docker run -d --name happyvibe-mcp \
  -p 3000:3000 \
  -e SN_INSTANCE_URL=https://dev276360.service-now.com \
  -e SN_USERNAME=admin \
  -e SN_PASSWORD=your_password \
  nczitzer/mcp-servicenow-nodejs:latest

# 2. Start HappyVibe
cd /Users/nczitzer/WebstormProjects/HappyVibe
npm run build
cd src-tauri && cargo run --bin opcode-web
```

### Option 4: Build from Source

**Pros:**
- ✅ Full control
- ✅ Development/debugging
- ✅ Custom modifications

**Steps:**

```bash
# 1. Install dependencies
cd /Users/nczitzer/WebstormProjects/HappyVibe
npm install

# 2. Build frontend
npm run build

# 3. Build Rust backend
cd src-tauri
cargo build --release --bin opcode-web

# 4. Run
./target/release/opcode-web --port 8080 --host 0.0.0.0
```

## Configuration

### MCP Server Configuration

### ⭐ Automatic Registration (Default)

**The `start-happyvibe.sh` script automatically registers the ServiceNow MCP server!**

When you run `./start-happyvibe.sh`, the script:
1. Loads credentials from `.env`
2. Checks if Claude Code is installed
3. Auto-installs `servicenow-mcp-server` if needed
4. **Automatically registers the MCP server with your credentials**
5. Starts all services

**No manual configuration needed!** Just edit `.env` and run the start script.

If you need to manually configure or add additional servers, use one of these methods:

**Method 1: Via HappyVibe UI**

1. Open http://localhost:8080
2. Click menu → **MCP Manager**
3. Click **Add Server** tab
4. Select **Stdio** transport
5. Fill in:
   - **Server Name:** `servicenow`
   - **Command:** `npx`
   - **Arguments:** `servicenow-mcp-server`
6. Add environment variables (click "+ Add Variable"):
   - `SN_INSTANCE_URL` = `https://dev276360.service-now.com`
   - `SN_USERNAME` = `admin`
   - `SN_PASSWORD` = `your_password`
7. Click **Add Stdio Server**

**Method 2: Via Config File**

Edit `mcp-config.json`:

```json
{
  "mcpServers": {
    "servicenow": {
      "command": "node",
      "args": ["/usr/local/bin/servicenow-mcp-server"],
      "env": {
        "SN_INSTANCE_URL": "https://dev276360.service-now.com",
        "SN_USERNAME": "admin",
        "SN_PASSWORD": "your_password"
      },
      "autoStart": true
    }
  }
}
```

**Method 3: Docker Network (Automatic)**

When using `docker-compose`, the MCP server is automatically available at `http://mcp-servicenow:3000` within the Docker network.

### Environment Variables

**HappyVibe:**
- `HAPPYVIBE_PORT` - Web server port (default: 8080)
- `RUST_LOG` - Logging level (info, debug, trace)

**ServiceNow MCP Server:**
- `SN_INSTANCE_URL` - ServiceNow instance URL (required)
- `SN_USERNAME` - ServiceNow username (required)
- `SN_PASSWORD` - ServiceNow password (required)
- `MCP_SERVER_PORT` - MCP server port (default: 3000)
- `NODE_ENV` - Environment (production/development)

## Verification

### 1. Check Services

```bash
# Docker Compose
docker-compose ps

# Expected output:
# NAME                   STATUS    PORTS
# happyvibe              Up        0.0.0.0:8080->8080/tcp
# happyvibe-mcp-...      Up        0.0.0.0:3000->3000/tcp
```

### 2. Test Endpoints

```bash
# HappyVibe web server
curl http://localhost:8080
# Expected: HTTP 200 with HTML

# MCP server health check
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

### 3. Test MCP Connection

1. Open HappyVibe at http://localhost:8080
2. Click menu → **MCP Manager**
3. Verify ServiceNow MCP server shows "Connected"
4. Test with: "List available ServiceNow tables"

## Troubleshooting

### HappyVibe not accessible

**Check 1: Server running?**
```bash
docker-compose ps
# or
lsof -i :8080
```

**Check 2: Logs**
```bash
docker-compose logs happyvibe
```

**Check 3: Port conflict?**
```bash
lsof -i :8080 | grep LISTEN
kill -9 <PID>
docker-compose restart
```

### MCP Server not connecting

**Check 1: MCP server running?**
```bash
docker-compose logs mcp-servicenow
```

**Check 2: Credentials correct?**
```bash
# Test manually
curl -u admin:password https://dev276360.service-now.com/api/now/table/sys_user?sysparm_limit=1
```

**Check 3: Network connectivity**
```bash
# From HappyVibe container
docker exec happyvibe curl http://mcp-servicenow:3000/health
```

### Build failures

**Rust build fails:**
```bash
# Update Rust
rustup update

# Clean and rebuild
cd src-tauri
cargo clean
cargo build --release
```

**Frontend build fails:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Production Deployment

### Security Considerations

1. **Change default passwords**
   - Don't use admin/admin in production
   - Use environment variables, not hardcoded values

2. **Use HTTPS**
   - Add nginx/Caddy reverse proxy
   - Get SSL certificate (Let's Encrypt)

3. **Restrict access**
   - Use firewall rules
   - VPN or IP whitelist
   - Authentication layer

4. **Secure environment variables**
   - Use Docker secrets
   - Or cloud provider secrets management (AWS Secrets Manager, etc.)

### Example: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name happyvibe.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Example: Systemd Service

```ini
[Unit]
Description=HappyVibe Web Server
After=network.target

[Service]
Type=simple
User=happyvibe
WorkingDirectory=/opt/happyvibe
ExecStart=/opt/happyvibe/opcode-web --port 8080 --host 0.0.0.0
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## Monitoring

### Docker Compose

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f happyvibe
docker-compose logs -f mcp-servicenow

# Monitor resource usage
docker stats
```

### Health Checks

```bash
# HappyVibe
curl -f http://localhost:8080 || echo "HappyVibe down"

# MCP Server
curl -f http://localhost:3000/health || echo "MCP down"
```

## Maintenance

### Update HappyVibe

```bash
# Pull latest changes
cd /Users/nczitzer/WebstormProjects/HappyVibe
git pull

# Rebuild
npm run build
cd src-tauri && cargo build --release

# Restart
docker-compose down
docker-compose up -d
```

### Update MCP Server

```bash
# Docker
docker-compose pull mcp-servicenow
docker-compose up -d mcp-servicenow

# NPM
npm update -g servicenow-mcp-server
```

### Backup

**Important data to backup:**
- `.env` - Environment configuration
- `mcp-config.json` - MCP server configuration
- `~/.claude/` - Claude Code settings (if using)

```bash
# Backup script
tar -czf happyvibe-backup-$(date +%Y%m%d).tar.gz \
  .env \
  mcp-config.json \
  ~/.claude/
```

## Performance Tuning

### HappyVibe Server

```bash
# Increase Rust async workers
export TOKIO_WORKER_THREADS=8

# Enable production optimizations
export RUST_LOG=info  # Less verbose logging
```

### MCP Server

```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Use production mode
export NODE_ENV=production
```

## Support

**Documentation:**
- `HAPPYVIBE_README.md` - Quick start guide
- `CLAUDE.md` - MCP best practices and workflow
- `web_server.design.md` - Architecture details

**Resources:**
- HappyVibe: http://localhost:8080
- MCP Server: http://localhost:3000
- ServiceNow Docs: https://docs.servicenow.com

**Common Issues:**
- Port conflicts: Change ports in `docker-compose.yml` or `.env`
- MCP connection: Verify credentials in `.env`
- Build failures: Update dependencies and rebuild

## Advanced Topics

### Custom Build with Different Ports

```bash
# Build with custom ports
docker-compose -f docker-compose.yml \
  -e HAPPYVIBE_PORT=9090 \
  -e MCP_SERVER_PORT=4000 \
  up -d
```

### Multi-Instance Deployment

```bash
# Instance 1
docker-compose -p happyvibe-dev up -d

# Instance 2 (different ports)
HAPPYVIBE_PORT=8081 MCP_SERVER_PORT=3001 \
  docker-compose -p happyvibe-test up -d
```

### Integration with CI/CD

```yaml
# GitHub Actions example
name: Deploy HappyVibe

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and deploy
        run: |
          docker-compose build
          docker-compose up -d
```

---

**Ready to deploy?** Start with the Quick Start section above! 🚀
