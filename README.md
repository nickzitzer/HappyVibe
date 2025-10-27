
<div align="center">
  <img src="src-tauri/icons/icon.png" alt="HappyVibe Logo" width="120" height="120">

  <h1>HappyVibe</h1>

  <p>
    <strong>ServiceNow AI Development IDE powered by Claude Code</strong>
  </p>
  <p>
    <strong>Intelligent ServiceNow development with 20+ automation tools via MCP integration</strong>
  </p>
  
  <p>
    <a href="#features"><img src="https://img.shields.io/badge/Features-✨-blue?style=for-the-badge" alt="Features"></a>
    <a href="#installation"><img src="https://img.shields.io/badge/Install-🚀-green?style=for-the-badge" alt="Installation"></a>
    <a href="#usage"><img src="https://img.shields.io/badge/Usage-📖-purple?style=for-the-badge" alt="Usage"></a>
    <a href="#development"><img src="https://img.shields.io/badge/Develop-🛠️-orange?style=for-the-badge" alt="Development"></a>
    <a href="https://discord.com/invite/KYwhHVzUsY"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  </p>
</div>

![457013521-6133a738-d0cb-4d3e-8746-c6768c82672c](https://github.com/user-attachments/assets/a028de9e-d881-44d8-bae5-7326ab3558b9)



https://github.com/user-attachments/assets/6bceea0f-60b6-4c3e-a745-b891de00b8d0



> [!TIP]
> **⭐ Star the repo and follow [@getAsterisk](https://x.com/getAsterisk) on X for early access to `asteria-swe-v0`**.

> [!NOTE]
> This project is not affiliated with, endorsed by, or sponsored by Anthropic. Claude is a trademark of Anthropic, PBC. This is an independent developer project using Claude.

## 🌟 Overview

**HappyVibe** is a comprehensive ServiceNow development IDE powered by Claude Code and MCP (Model Context Protocol). Built with Tauri 2, it provides an intuitive interface for AI-assisted ServiceNow development with 20+ automation tools.

Think of HappyVibe as your intelligent ServiceNow development companion - combining the power of Claude AI with direct ServiceNow integration through the servicenow-mcp-server, making ServiceNow development faster and more efficient.

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
  - [🗂️ Project & Session Management](#️-project--session-management)
  - [🤖 CC Agents](#-cc-agents)
  
  - [📊 Usage Analytics Dashboard](#-usage-analytics-dashboard)
  - [🔌 MCP Server Management](#-mcp-server-management)
  - [⏰ Timeline & Checkpoints](#-timeline--checkpoints)
  - [📝 CLAUDE.md Management](#-claudemd-management)
- [📖 Usage](#-usage)
  - [Getting Started](#getting-started)
  - [Managing Projects](#managing-projects)
  - [Creating Agents](#creating-agents)
  - [Tracking Usage](#tracking-usage)
  - [Working with MCP Servers](#working-with-mcp-servers)
- [🚀 Installation](#-installation)
- [🔨 Build from Source](#-build-from-source)
- [🛠️ Development](#️-development)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Features

### 🗂️ **Project & Session Management**
- **Visual Project Browser**: Navigate through all your Claude Code projects in `~/.claude/projects/`
- **Session History**: View and resume past coding sessions with full context
- **Smart Search**: Find projects and sessions quickly with built-in search
- **Session Insights**: See first messages, timestamps, and session metadata at a glance

### 🤖 **CC Agents**
- **Custom AI Agents**: Create specialized agents with custom system prompts and behaviors
- **Agent Library**: Build a collection of purpose-built agents for different tasks
- **Background Execution**: Run agents in separate processes for non-blocking operations
- **Execution History**: Track all agent runs with detailed logs and performance metrics



### 📊 **Usage Analytics Dashboard**
- **Cost Tracking**: Monitor your Claude API usage and costs in real-time
- **Token Analytics**: Detailed breakdown by model, project, and time period
- **Visual Charts**: Beautiful charts showing usage trends and patterns
- **Export Data**: Export usage data for accounting and analysis

### 🔌 **ServiceNow MCP Integration**
- **First-Launch Setup Wizard**: Automated installation and configuration of servicenow-mcp-server
- **20+ ServiceNow Tools**: Direct integration with ServiceNow via MCP tools
- **Multi-Instance Support**: Manage multiple ServiceNow instances from a single MCP server
- **Credential Management**: Securely store and edit ServiceNow credentials
- **Server Configuration**: Edit MCP server settings including passwords through intuitive UI

### ⏰ **Timeline & Checkpoints**
- **Session Versioning**: Create checkpoints at any point in your coding session
- **Visual Timeline**: Navigate through your session history with a branching timeline
- **Instant Restore**: Jump back to any checkpoint with one click
- **Fork Sessions**: Create new branches from existing checkpoints
- **Diff Viewer**: See exactly what changed between checkpoints

### 📝 **CLAUDE.md Management**
- **Built-in Editor**: Edit CLAUDE.md files directly within the app
- **Live Preview**: See your markdown rendered in real-time
- **Project Scanner**: Find all CLAUDE.md files in your projects
- **Syntax Highlighting**: Full markdown support with syntax highlighting

## 📖 Usage

### Getting Started

1. **Launch HappyVibe**: Open the application after installation
2. **First-Launch Setup Wizard**: On first launch, HappyVibe will guide you through:
   - Installing servicenow-mcp-server (if not already installed)
   - Configuring your ServiceNow credentials (instance URL, username, password)
   - Registering the MCP server with Claude Code
3. **Welcome Screen**: Choose between CC Agents or Projects
4. **Start Developing**: Begin AI-assisted ServiceNow development with 20+ integrated tools

### Managing Projects

```
Projects → Select Project → View Sessions → Resume or Start New
```

- Click on any project to view its sessions
- Each session shows the first message and timestamp
- Resume sessions directly or start new ones

### Creating Agents

```
CC Agents → Create Agent → Configure → Execute
```

1. **Design Your Agent**: Set name, icon, and system prompt
2. **Configure Model**: Choose between available Claude models
3. **Set Permissions**: Configure file read/write and network access
4. **Execute Tasks**: Run your agent on any project

### Tracking Usage

```
Menu → Usage Dashboard → View Analytics
```

- Monitor costs by model, project, and date
- Export data for reports
- Set up usage alerts (coming soon)

### Working with ServiceNow MCP Server

```
Menu → MCP Manager → View/Edit ServiceNow Server
```

**First-Time Setup:**
- The setup wizard automatically installs servicenow-mcp-server via npm
- Prompts for your ServiceNow credentials
- Registers the server with Claude Code automatically

**Managing Credentials:**
- Click the Edit button (pencil icon) on the servicenow server
- Update instance URL, username, or password as needed
- Changes are applied immediately

**Available Tools:**
The servicenow-mcp-server provides 20+ tools for:
- Table operations (create, read, update, delete)
- Script management (business rules, client scripts, UI policies)
- Application scoping and update sets
- User and group management
- And much more

## 🚀 Installation

### Prerequisites

- **Claude Code CLI**: Install from [Anthropic's Claude Code](https://claude.ai/code)
- **Node.js and npm**: Required for servicenow-mcp-server (the setup wizard will check for this)

### Download

Download the latest release for your platform:
- **macOS (Apple Silicon)**: `HappyVibe_[version]_aarch64.dmg`
- **macOS (Intel)**: `HappyVibe_[version]_x64.dmg`
- **Windows**: `HappyVibe_[version]_x64.msi`
- **Linux**: `HappyVibe_[version]_amd64.deb` or `HappyVibe_[version]_amd64.AppImage`

### First Launch

When you first launch HappyVibe, the **Setup Wizard** will guide you through:

1. **Checking Prerequisites**
   - Verifies npm is installed
   - Checks if Claude Code is installed

2. **ServiceNow Configuration**
   - Enter your ServiceNow instance URL (e.g., `https://dev12345.service-now.com`)
   - Provide your ServiceNow username
   - Provide your ServiceNow password

3. **Automatic Installation**
   - Installs servicenow-mcp-server globally via npm
   - Registers the server with Claude Code
   - Configures credentials securely

4. **Ready to Go**
   - Setup complete! Start developing with AI-powered ServiceNow tools

**Note**: You can skip the setup and configure manually later through the MCP Manager.

## 🔨 Build from Source

### Prerequisites

Before building opcode from source, ensure you have the following installed:

#### System Requirements

- **Operating System**: Windows 10/11, macOS 11+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 1GB free space

#### Required Tools

1. **Rust** (1.70.0 or later)
   ```bash
   # Install via rustup
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Bun** (latest version)
   ```bash
   # Install bun
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Git**
   ```bash
   # Usually pre-installed, but if not:
   # Ubuntu/Debian: sudo apt install git
   # macOS: brew install git
   # Windows: Download from https://git-scm.com
   ```

4. **Claude Code CLI**
   - Download and install from [Claude's official site](https://claude.ai/code)
   - Ensure `claude` is available in your PATH

#### Platform-Specific Dependencies

**Linux (Ubuntu/Debian)**
```bash
# Install system dependencies
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libxdo-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev
```

**macOS**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install additional dependencies via Homebrew (optional)
brew install pkg-config
```

**Windows**
- Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

### Build Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/HappyVibe.git
   cd HappyVibe
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Build the Application**

   **For Development (with hot reload)**
   ```bash
   npm run tauri dev
   ```

   **For Production Build**
   ```bash
   # Build the application
   npm run tauri build

   # The built installers will be in:
   # - macOS: src-tauri/target/release/bundle/dmg/
   # - Linux: src-tauri/target/release/bundle/deb/ or appimage/
   # - Windows: src-tauri/target/release/bundle/msi/
   ```

4. **Platform-Specific Build Options**

   **Debug Build (faster compilation, larger binary)**
   ```bash
   npm run tauri build -- --debug
   ```

   **DMG for macOS (Apple Silicon)**
   ```bash
   npm run tauri build -- --target aarch64-apple-darwin --bundles dmg
   ```

   **DMG for macOS (Intel)**
   ```bash
   npm run tauri build -- --target x86_64-apple-darwin --bundles dmg
   ```

### Troubleshooting

#### Common Issues

1. **"cargo not found" error**
   - Ensure Rust is installed and `~/.cargo/bin` is in your PATH
   - Run `source ~/.cargo/env` or restart your terminal

2. **Linux: "webkit2gtk not found" error**
   - Install the webkit2gtk development packages listed above
   - On newer Ubuntu versions, you might need `libwebkit2gtk-4.0-dev`

3. **Windows: "MSVC not found" error**
   - Install Visual Studio Build Tools with C++ support
   - Restart your terminal after installation

4. **"claude command not found" error**
   - Ensure Claude Code CLI is installed and in your PATH
   - Test with `claude --version`

5. **Build fails with "out of memory"**
   - Try building with fewer parallel jobs: `cargo build -j 2`
   - Close other applications to free up RAM

#### Verify Your Build

After building, you can verify the application works:

```bash
# Run the built executable directly
# Linux/macOS
./src-tauri/target/release/happyvibe

# Windows
./src-tauri/target/release/happyvibe.exe
```

### Build Artifacts

The build process creates several artifacts:

- **Executable**: The main HappyVibe application binary
- **Installers** (when using `tauri build`):
  - `.deb` package (Linux) - in `bundle/deb/`
  - `.AppImage` (Linux) - in `bundle/appimage/`
  - `.dmg` installer (macOS) - in `bundle/dmg/`
  - `.msi` installer (Windows) - in `bundle/msi/`

All artifacts are located in `src-tauri/target/release/bundle/`.

## 🛠️ Development

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Rust with Tauri 2
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite (via rusqlite)
- **Package Manager**: Bun

### Project Structure

```
HappyVibe/
├── src/                   # React frontend
│   ├── components/        # UI components
│   │   ├── SetupWizard.tsx      # First-launch setup
│   │   ├── MCPManager.tsx       # MCP server management
│   │   └── MCPServerList.tsx    # Server list with edit
│   ├── lib/               # API client & utilities
│   └── assets/            # Static assets
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri command handlers
│   │   ├── auto_setup.rs  # Setup wizard backend
│   │   ├── checkpoint/    # Timeline management
│   │   └── process/       # Process management
│   └── tests/             # Rust test suite
└── public/                # Public assets
```

### Development Commands

```bash
# Start development server
npm run tauri dev

# Run frontend only
npm run dev

# Type checking
npm run type-check

# Build frontend
npm run build

# Run Rust tests
cd src-tauri && cargo test

# Format code
cd src-tauri && cargo fmt

# Reset setup wizard for testing
rm -f ~/Library/Application\ Support/com.happyvibe.desktop/setup_state.json
```

## 🔒 Security

HappyVibe prioritizes your privacy and security:

1. **Local Credential Storage**: ServiceNow credentials are stored securely on your machine
2. **Process Isolation**: Agents run in separate processes
3. **Permission Control**: Configure file and network access per agent
4. **MCP Protocol**: Secure communication with ServiceNow via MCP
5. **No Cloud Storage**: All data stays on your local machine
6. **Anonymous Analytics**: Optional PostHog analytics (can be disabled)
7. **Open Source**: Full transparency through open source code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Areas for Contribution

- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Internationalization

## 📄 License

This project is licensed under the AGPL License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) - The secure framework for building desktop apps
- [Claude](https://claude.ai) by Anthropic

---

<div align="center">
  <p>
    <strong>Made with ❤️ for ServiceNow Developers</strong>
  </p>
  <p>
    <a href="https://github.com/yourusername/HappyVibe/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/HappyVibe/issues">Request Feature</a>
  </p>
</div>
