# HappyVibe Port Configuration

This document describes the port allocation for different HappyVibe deployments.

## Port Allocation

| Service | Port | Description |
|---------|------|-------------|
| **HappyVibe Web** | **9000** | Web version (Docker/standalone server) |
| **HappyVibe Desktop** | **1420** | Desktop app (Tauri/Vite dev server) |
| **ServiceNow MCP** | **3100** | ServiceNow MCP Server (unique port to avoid conflicts) |

## Why Different Ports?

### Web Version: Port 9000
- Easy to remember and type
- Clearly distinct from other common dev ports (3000, 8080)
- Makes it obvious you're running the web version
- Access at: `http://localhost:9000`

### Desktop App: Port 1420
- Uses Tauri's default Vite dev server port
- Only accessible when running the desktop app
- Automatically managed by Tauri
- Access at: `http://localhost:1420`

### ServiceNow MCP Server: Port 3100
- Unique port to avoid conflicts with other dev servers on port 3000
- Used by both web and desktop versions
- Shared across deployments
- Access at: `http://localhost:3100`

## Deployment URLs

### Web Version (Docker)
```bash
./start-happyvibe.sh
# Opens: http://localhost:9000
```

### Desktop App (DMG)
```bash
npm run tauri dev  # or launch the .app
# Opens: http://localhost:1420 (internal)
```

### Development
```bash
# Web server only
cd src-tauri && cargo run --bin opcode-web --port 9000

# Desktop app
npm run tauri dev
```

## Customizing Ports

### Web Version
You can override the port via command line or environment:

```bash
# Via command line
opcode-web --port 9500

# Via Docker Compose
docker-compose up -d
# Edit docker-compose.yml to change the port mapping

# Via environment variable in .env
WEB_PORT=9500
```

### Desktop App
The desktop app uses Tauri's built-in dev server (port 1420).
To change it, modify `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 1420, // Change this
  },
});
```

## Port Conflicts

If you see errors like "Address already in use":

1. **Check what's using the port:**
   ```bash
   lsof -i :9000  # Check port 9000
   lsof -i :3100  # Check port 3100
   ```

2. **Kill the process:**
   ```bash
   kill -9 <PID>
   ```

3. **Use a different port:**
   ```bash
   opcode-web --port 9001
   ```

## Firewall & Network Access

### Accessing from other devices (web version)
The web version binds to `0.0.0.0`, making it accessible from other devices:

```bash
# From your phone or another computer on the same network
http://YOUR_PC_IP:9000
```

### Desktop app (local only)
The desktop app is typically only accessible from `localhost` for security.

## Summary

- 🌐 **Web**: Port **9000** - `http://localhost:9000`
- 🖥️ **Desktop**: Port **1420** - `http://localhost:1420`
- 🔌 **MCP Server**: Port **3100** - `http://localhost:3100`

Now you can easily identify which version you're running just by looking at the port!
