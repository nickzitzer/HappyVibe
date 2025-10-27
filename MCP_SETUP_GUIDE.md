# HappyVibe - ServiceNow MCP Server Setup Guide

## Overview

HappyVibe integrates with your ServiceNow MCP server to provide 20+ automated tools for ServiceNow development. This guide shows you how to configure the MCP server using the HappyVibe UI.

## Prerequisites

- **HappyVibe** running at http://localhost:8080
- **ServiceNow MCP Server** installed (global or Docker)
- **ServiceNow credentials** (instance URL, username, password)

## Method 1: UI Configuration ⭐ (Recommended)

This is the easiest and most user-friendly method.

### Step 1: Install ServiceNow MCP Server

Choose one of these installation methods:

**Option A: Global NPM Install**
```bash
npm install -g servicenow-mcp-server
```

**Option B: Use npx (no installation needed)**
```bash
# npx will automatically download and run the latest version
npx servicenow-mcp-server --version
```

**Option C: Docker Container**
```bash
docker pull nczitzer/mcp-servicenow-nodejs:latest
```

### Step 2: Open HappyVibe MCP Manager

1. Open HappyVibe at **http://localhost:8080**
2. Click the **menu icon** (☰) in the top-left corner
3. Select **"MCP Manager"** from the menu
4. You'll see the MCP Manager interface with three tabs

### Step 3: Add ServiceNow Server

1. Click the **"Add Server"** tab
2. Ensure **"Stdio"** transport is selected (default)

### Step 4: Fill in Server Details

**Basic Information:**
- **Server Name:** `servicenow`
  - This is the identifier you'll use to reference the server
  - Use lowercase, no spaces

- **Command:** `npx`
  - Uses npx to run the ServiceNow MCP server
  - Alternative: `/usr/local/bin/servicenow-mcp-server` if installed globally

- **Arguments:** `servicenow-mcp-server`
  - The package name to execute
  - Leave empty if using full path in Command field

- **Scope:** Choose one:
  - **Local** - Only for this project (recommended for testing)
  - **Project** - Shared via `.mcp.json` file (team collaboration)
  - **User** - All your projects (if you use one ServiceNow instance)

### Step 5: Add Environment Variables

Click **"+ Add Variable"** button three times to add:

**Variable 1:**
- **Key:** `SN_INSTANCE_URL`
- **Value:** `https://dev276360.service-now.com`
- *(Replace with your ServiceNow instance URL)*

**Variable 2:**
- **Key:** `SN_USERNAME`
- **Value:** `admin`
- *(Replace with your ServiceNow username)*

**Variable 3:**
- **Key:** `SN_PASSWORD`
- **Value:** `your_password_here`
- *(Replace with your ServiceNow password)*

**Security Note:** These credentials are stored securely in Claude Code's configuration and are never exposed in logs or the UI after entry.

### Step 6: Save Configuration

1. Click **"Add Stdio Server"** button
2. Wait for confirmation message: "MCP server added successfully!"
3. You'll be automatically switched to the "Servers" tab

### Step 7: Verify Connection

In the **"Servers"** tab, you should see:
- Server name: **servicenow**
- Status: **Listed** (active state may vary based on Claude Code setup)
- Transport: **stdio**

### Step 8: Test with Claude

1. Go back to the main HappyVibe interface
2. Start a new chat session
3. Try asking Claude to use a ServiceNow tool:
   ```
   "List the available ServiceNow tables"
   ```
   or
   ```
   "What ServiceNow MCP tools are available?"
   ```

Claude should now have access to all 20+ ServiceNow MCP tools!

## Method 2: Command Line Setup

If you prefer command-line configuration:

### Using the setup-mcp.sh Script

```bash
# 1. Set environment variables
export SN_INSTANCE_URL=https://dev276360.service-now.com
export SN_USERNAME=admin
export SN_PASSWORD=your_password_here

# 2. Run the setup script
cd /Users/nczitzer/WebstormProjects/HappyVibe
./setup-mcp.sh
```

### Manual Claude CLI Commands

```bash
# Add MCP server directly via Claude CLI
claude mcp add \
    -s local \
    -e "SN_INSTANCE_URL=https://dev276360.service-now.com" \
    -e "SN_USERNAME=admin" \
    -e "SN_PASSWORD=your_password" \
    servicenow \
    -- \
    npx servicenow-mcp-server
```

## Method 3: Import from Claude Desktop

If you already have the ServiceNow MCP server configured in Claude Desktop:

1. Open HappyVibe MCP Manager
2. Click **"Import/Export"** tab
3. Click **"Import from Claude Desktop"**
4. Select the **servicenow** server from the list
5. Choose your preferred scope (local, project, or user)
6. Click **"Import"**

## Available ServiceNow Tools (20+)

Once configured, you'll have access to:

### Generic Operations (6 tools):
- `SN-Query-Table` - Query any table with filters
- `SN-Create-Record` - Create records
- `SN-Get-Record` - Get single record details
- `SN-Update-Record` - Update records
- `SN-Get-Table-Schema` - Discover table structure
- `SN-List-Available-Tables` - Browse available tables

### Update Set Management (3 tools):
- `SN-Set-Update-Set` - Set current update set (~2 seconds!)
- `SN-Get-Current-Update-Set` - Verify current update set
- `SN-List-Update-Sets` - List available update sets

### Application Scope (1 tool):
- `SN-Set-Current-Application` - Set application scope

### Script Execution (2 tools):
- `SN-Execute-Background-Script` - Run server-side JavaScript
- `SN-Create-Fix-Script` - Generate scripts for manual execution

### Convenience Tools (8+ tools):
- `SN-List-Incidents`, `SN-Create-Incident`
- `SN-List-SysUsers`, `SN-List-CmdbCis`
- `SN-List-SysUserGroups`
- `SN-List-ChangeRequests`, `SN-List-Problems`
- And more!

## Troubleshooting

### Server not appearing in list

**Check 1:** Verify Claude Code is installed
```bash
claude --version
```

**Check 2:** List all MCP servers
```bash
claude mcp list
```

**Check 3:** Check logs in HappyVibe UI
- Open browser console (F12)
- Look for MCP-related errors

### Connection errors

**Check 1:** Verify ServiceNow credentials
```bash
curl -u admin:password https://dev276360.service-now.com/api/now/table/sys_user?sysparm_limit=1
```

**Check 2:** Test MCP server directly
```bash
npx servicenow-mcp-server
```

**Check 3:** Check environment variables
- Make sure no typos in variable names
- Verify values don't have extra quotes or spaces

### Tools not available in Claude

**Check 1:** Restart Claude session
- Close and reopen the chat
- Servers may need to be initialized

**Check 2:** Check server scope
- If set to "local", make sure you're in the right project
- Try "user" scope for global availability

**Check 3:** Re-add the server
- Remove the server from MCP Manager
- Add it again with correct configuration

## Security Best Practices

1. **Never commit credentials to git**
   - The MCP configuration is stored in Claude Code's config, not in your project
   - `.mcp.json` should only contain non-sensitive configuration

2. **Use environment variables for production**
   - Set credentials via environment variables in production
   - Use secrets management (AWS Secrets Manager, etc.)

3. **Scope appropriately**
   - Use "local" scope for dev/test instances
   - Use "user" scope carefully - applies to all projects

4. **Rotate credentials regularly**
   - Update ServiceNow passwords periodically
   - Update the MCP server configuration when credentials change

## Configuration Files Reference

### ~/.claude/settings.json

Claude Code's global settings, including enabled MCP servers:

```json
{
  "enabledMcpjsonServers": [
    "claude-flow",
    "ruv-swarm",
    "servicenow"
  ]
}
```

### .mcp.json (Project-scope)

Project-specific MCP configuration (if using "project" scope):

```json
{
  "mcpServers": {
    "servicenow": {
      "command": "npx",
      "args": ["servicenow-mcp-server"],
      "env": {
        "SN_INSTANCE_URL": "https://dev276360.service-now.com",
        "SN_USERNAME": "admin",
        "SN_PASSWORD": "$h4fG+9nAGeU"
      }
    }
  }
}
```

## Next Steps

1. **Test the integration**: Try asking Claude to query ServiceNow
2. **Read CLAUDE.md**: Learn about MCP-first development workflow
3. **Explore the tools**: Ask Claude "What ServiceNow tools are available?"
4. **Build something**: Use the tools to automate your ServiceNow development!

## Support

- **Documentation:** DEPLOYMENT.md, HAPPYVIBE_README.md
- **MCP Tools:** https://github.com/nczitzer/servicenow-mcp-server
- **Claude Code:** https://docs.anthropic.com/claude-code

---

**Ready to start?** Open HappyVibe and configure your ServiceNow MCP server! 🚀
