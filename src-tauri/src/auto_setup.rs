use anyhow::{Context, Result};
use log::{info, warn};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use tauri::{AppHandle, Manager};

/// Auto-setup status for tracking MCP server installation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetupStatus {
    pub is_first_launch: bool,
    pub npm_installed: bool,
    pub mcp_server_installed: bool,
    pub mcp_server_registered: bool,
    pub claude_code_installed: bool,
}

/// ServiceNow credentials for MCP setup
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceNowCredentials {
    pub instance_url: String,
    pub username: String,
    pub password: String,
}

/// Get the setup state file path
fn get_setup_state_path(app: &AppHandle) -> Result<PathBuf> {
    let app_dir = app
        .path()
        .app_data_dir()
        .context("Failed to get app data dir")?;

    fs::create_dir_all(&app_dir)?;
    Ok(app_dir.join("setup_state.json"))
}

/// Check if this is the first launch
#[tauri::command]
pub async fn check_first_launch(app: AppHandle) -> Result<bool, String> {
    let state_path = get_setup_state_path(&app).map_err(|e| e.to_string())?;
    Ok(!state_path.exists())
}

/// Get the current setup status
#[tauri::command]
pub async fn get_setup_status(app: AppHandle) -> Result<SetupStatus, String> {
    info!("Checking setup status...");

    let is_first_launch = check_first_launch(app.clone()).await?;

    // Check if npm is installed
    let npm_installed = Command::new("npm")
        .arg("--version")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);

    // Check if servicenow-mcp-server is installed globally
    let mcp_server_installed = Command::new("npm")
        .args(["list", "-g", "servicenow-mcp-server"])
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);

    // Check if Claude Code is installed
    let claude_code_installed = crate::claude_binary::find_claude_binary(&app).is_ok();

    // Check if MCP server is registered with Claude Code
    let mcp_server_registered = if claude_code_installed {
        check_mcp_server_registered(&app).await.unwrap_or(false)
    } else {
        false
    };

    Ok(SetupStatus {
        is_first_launch,
        npm_installed,
        mcp_server_installed,
        mcp_server_registered,
        claude_code_installed,
    })
}

/// Check if ServiceNow MCP server is already registered
async fn check_mcp_server_registered(app: &AppHandle) -> Result<bool> {
    let claude_path = crate::claude_binary::find_claude_binary(app)
        .map_err(|e| anyhow::anyhow!(e))?;

    let mut cmd = crate::claude_binary::create_command_with_env(&claude_path);
    cmd.args(["mcp", "list"]);

    let output = cmd.output()?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        Ok(stdout.contains("servicenow"))
    } else {
        Ok(false)
    }
}

/// Install servicenow-mcp-server via npm
#[tauri::command]
pub async fn install_mcp_server(_app: AppHandle) -> Result<String, String> {
    info!("Installing servicenow-mcp-server globally...");

    let mut cmd = crate::claude_binary::create_command_with_env("npm");
    cmd.args(["install", "-g", "servicenow-mcp-server"]);

    let output = cmd.output().map_err(|e| format!("Failed to run npm: {}", e))?;

    if output.status.success() {
        info!("servicenow-mcp-server installed successfully");
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to install servicenow-mcp-server: {}", stderr))
    }
}

/// Register ServiceNow MCP server with Claude Code
#[tauri::command]
pub async fn register_mcp_server(
    app: AppHandle,
    credentials: ServiceNowCredentials,
) -> Result<String, String> {
    info!("Registering ServiceNow MCP server with Claude Code...");

    // First check if already registered
    if check_mcp_server_registered(&app).await.unwrap_or(false) {
        info!("ServiceNow MCP server already registered");
        return Ok("ServiceNow MCP server already registered".to_string());
    }

    let claude_path = crate::claude_binary::find_claude_binary(&app)
        .map_err(|e| format!("Claude Code not found: {}", e))?;

    let mut cmd = crate::claude_binary::create_command_with_env(&claude_path);
    cmd.args([
        "mcp",
        "add",
        "-s",
        "user",
        "-e",
        &format!("SERVICENOW_INSTANCE_URL={}", credentials.instance_url),
        "-e",
        &format!("SERVICENOW_USERNAME={}", credentials.username),
        "-e",
        &format!("SERVICENOW_PASSWORD={}", credentials.password),
        "servicenow",
        "--",
        "npx",
        "servicenow-mcp-server",
    ]);

    let output = cmd.output().map_err(|e| format!("Failed to register MCP server: {}", e))?;

    if output.status.success() {
        info!("ServiceNow MCP server registered successfully");
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        warn!("Failed to register MCP server: {}", stderr);
        Err(format!("Failed to register MCP server: {}", stderr))
    }
}

/// Complete the setup and mark as done
#[tauri::command]
pub async fn complete_setup(app: AppHandle) -> Result<(), String> {
    let state_path = get_setup_state_path(&app).map_err(|e| e.to_string())?;

    let state = SetupStatus {
        is_first_launch: false,
        npm_installed: true,
        mcp_server_installed: true,
        mcp_server_registered: true,
        claude_code_installed: true,
    };

    let json = serde_json::to_string_pretty(&state).map_err(|e| e.to_string())?;
    fs::write(state_path, json).map_err(|e| e.to_string())?;

    info!("Setup completed and state saved");
    Ok(())
}

/// Skip setup (user will configure manually later)
#[tauri::command]
pub async fn skip_setup(app: AppHandle) -> Result<(), String> {
    let state_path = get_setup_state_path(&app).map_err(|e| e.to_string())?;

    let state = SetupStatus {
        is_first_launch: false,
        npm_installed: false,
        mcp_server_installed: false,
        mcp_server_registered: false,
        claude_code_installed: false,
    };

    let json = serde_json::to_string_pretty(&state).map_err(|e| e.to_string())?;
    fs::write(state_path, json).map_err(|e| e.to_string())?;

    info!("Setup skipped");
    Ok(())
}

/// Run automatic setup if needed (called on app startup)
#[tauri::command]
pub async fn auto_setup_on_launch(app: AppHandle) -> Result<SetupStatus, String> {
    let status = get_setup_status(app.clone()).await?;

    info!("Auto-setup status: {:?}", status);

    // If not first launch and setup was completed, nothing to do
    if !status.is_first_launch {
        return Ok(status);
    }

    // For first launch, just return the status
    // The UI will handle prompting the user for credentials
    Ok(status)
}
