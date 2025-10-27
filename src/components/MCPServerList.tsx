import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Globe,
  Terminal,
  Trash2,
  Play,
  CheckCircle,
  Loader2,
  RefreshCw,
  FolderOpen,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Pencil,
  X,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type MCPServer } from "@/lib/api";
import { useTrackEvent } from "@/hooks";

interface MCPServerListProps {
  /**
   * List of MCP servers to display
   */
  servers: MCPServer[];
  /**
   * Whether the list is loading
   */
  loading: boolean;
  /**
   * Callback when a server is removed
   */
  onServerRemoved: (name: string) => void;
  /**
   * Callback to refresh the server list
   */
  onRefresh: () => void;
}

/**
 * Component for displaying a list of MCP servers
 * Shows servers grouped by scope with status indicators
 */
export const MCPServerList: React.FC<MCPServerListProps> = ({
  servers,
  loading,
  onServerRemoved,
  onRefresh,
}) => {
  const [removingServer, setRemovingServer] = useState<string | null>(null);
  const [testingServer, setTestingServer] = useState<string | null>(null);
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());
  const [copiedServer, setCopiedServer] = useState<string | null>(null);
  const [connectedServers] = useState<string[]>([]);
  const [editingServer, setEditingServer] = useState<MCPServer | null>(null);
  const [editEnvVars, setEditEnvVars] = useState<Record<string, string>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Analytics tracking
  const trackEvent = useTrackEvent();

  // Group servers by scope
  const serversByScope = servers.reduce((acc, server) => {
    const scope = server.scope || "local";
    if (!acc[scope]) acc[scope] = [];
    acc[scope].push(server);
    return acc;
  }, {} as Record<string, MCPServer[]>);

  /**
   * Toggles expanded state for a server
   */
  const toggleExpanded = (serverName: string) => {
    setExpandedServers(prev => {
      const next = new Set(prev);
      if (next.has(serverName)) {
        next.delete(serverName);
      } else {
        next.add(serverName);
      }
      return next;
    });
  };

  /**
   * Copies command to clipboard
   */
  const copyCommand = async (command: string, serverName: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedServer(serverName);
      setTimeout(() => setCopiedServer(null), 2000);
    } catch (error) {
      console.error("Failed to copy command:", error);
    }
  };

  /**
   * Removes a server
   */
  const handleRemoveServer = async (name: string) => {
    try {
      setRemovingServer(name);
      
      // Check if server was connected
      const wasConnected = connectedServers.includes(name);
      
      await api.mcpRemove(name);
      
      // Track server removal
      trackEvent.mcpServerRemoved({
        server_name: name,
        was_connected: wasConnected
      });
      
      onServerRemoved(name);
    } catch (error) {
      console.error("Failed to remove server:", error);
    } finally {
      setRemovingServer(null);
    }
  };

  /**
   * Tests connection to a server
   */
  const handleTestConnection = async (name: string) => {
    try {
      setTestingServer(name);
      const result = await api.mcpTestConnection(name);
      const server = servers.find(s => s.name === name);

      // Track connection result - result is a string message
      trackEvent.mcpServerConnected(name, true, server?.transport || 'unknown');

      // TODO: Show result in a toast or modal
      console.log("Test result:", result);
    } catch (error) {
      console.error("Failed to test connection:", error);

      trackEvent.mcpConnectionError({
        server_name: name,
        error_type: 'test_failed',
        retry_attempt: 0
      });
    } finally {
      setTestingServer(null);
    }
  };

  /**
   * Opens the edit modal for a server
   */
  const handleEditServer = (server: MCPServer) => {
    setEditingServer(server);
    setEditEnvVars({ ...server.env });
  };

  /**
   * Closes the edit modal
   */
  const handleCancelEdit = () => {
    setEditingServer(null);
    setEditEnvVars({});
  };

  /**
   * Updates environment variable
   */
  const updateEnvVar = (key: string, value: string) => {
    setEditEnvVars(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Saves the edited server configuration
   * Atomically removes the old config and adds the new one
   */
  const handleSaveEdit = async () => {
    if (!editingServer) return;

    try {
      setSavingEdit(true);

      // Step 1: Remove the old server
      await api.mcpRemove(editingServer.name);

      // Step 2: Add the server with updated configuration
      await api.mcpAdd(
        editingServer.name,
        editingServer.transport,
        editingServer.command,
        editingServer.args,
        editEnvVars, // Updated env vars
        editingServer.url,
        editingServer.scope || "local"
      );

      // Track the update
      trackEvent.mcpServerAdded({
        server_type: editingServer.transport,
        configuration_method: "manual"
      });

      // Close modal and refresh
      handleCancelEdit();
      onRefresh();
    } catch (error) {
      console.error("Failed to update server:", error);
      // TODO: Show error toast
    } finally {
      setSavingEdit(false);
    }
  };

  /**
   * Gets icon for transport type
   */
  const getTransportIcon = (transport: string) => {
    switch (transport) {
      case "stdio":
        return <Terminal className="h-4 w-4 text-amber-500" />;
      case "sse":
        return <Globe className="h-4 w-4 text-emerald-500" />;
      default:
        return <Network className="h-4 w-4 text-blue-500" />;
    }
  };

  /**
   * Gets icon for scope
   */
  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case "local":
        return <User className="h-3 w-3 text-slate-500" />;
      case "project":
        return <FolderOpen className="h-3 w-3 text-orange-500" />;
      case "user":
        return <FileText className="h-3 w-3 text-purple-500" />;
      default:
        return null;
    }
  };

  /**
   * Gets scope display name
   */
  const getScopeDisplayName = (scope: string) => {
    switch (scope) {
      case "local":
        return "Local (Project-specific)";
      case "project":
        return "Project (Shared via .mcp.json)";
      case "user":
        return "User (All projects)";
      default:
        return scope;
    }
  };

  /**
   * Renders a single server item
   */
  const renderServerItem = (server: MCPServer) => {
    const isExpanded = expandedServers.has(server.name);
    const isCopied = copiedServer === server.name;
    
    return (
      <motion.div
        key={server.name}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/5 hover:border-primary/20 transition-all overflow-hidden"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded">
                  {getTransportIcon(server.transport)}
                </div>
                <h4 className="font-medium truncate">{server.name}</h4>
                {server.status?.running && (
                  <Badge variant="outline" className="gap-1 flex-shrink-0 border-green-500/50 text-green-600 bg-green-500/10">
                    <CheckCircle className="h-3 w-3" />
                    Running
                  </Badge>
                )}
              </div>
              
              {server.command && !isExpanded && (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground font-mono truncate pl-9 flex-1" title={server.command}>
                    {server.command}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(server.name)}
                    className="h-6 px-2 text-xs hover:bg-primary/10"
                  >
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show full
                  </Button>
                </div>
              )}
              
              {server.transport === "sse" && server.url && !isExpanded && (
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground font-mono truncate pl-9" title={server.url}>
                    {server.url}
                  </p>
                </div>
              )}
              
              {Object.keys(server.env).length > 0 && !isExpanded && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground pl-9">
                  <span>Environment variables: {Object.keys(server.env).length}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTestConnection(server.name)}
                disabled={testingServer === server.name}
                className="hover:bg-green-500/10 hover:text-green-600"
                title="Test connection"
              >
                {testingServer === server.name ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditServer(server)}
                className="hover:bg-blue-500/10 hover:text-blue-600"
                title="Edit server configuration"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveServer(server.name)}
                disabled={removingServer === server.name}
                className="hover:bg-destructive/10 hover:text-destructive"
                title="Remove server"
              >
                {removingServer === server.name ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Expanded Details */}
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-9 space-y-3 pt-2 border-t border-border/50"
            >
              {server.command && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Command</p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCommand(server.command!, server.name)}
                        className="h-6 px-2 text-xs hover:bg-primary/10"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {isCopied ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(server.name)}
                        className="h-6 px-2 text-xs hover:bg-primary/10"
                      >
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs font-mono bg-muted/50 p-2 rounded break-all">
                    {server.command}
                  </p>
                </div>
              )}
              
              {server.args && server.args.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Arguments</p>
                  <div className="text-xs font-mono bg-muted/50 p-2 rounded space-y-1">
                    {server.args.map((arg, idx) => (
                      <div key={idx} className="break-all">
                        <span className="text-muted-foreground mr-2">[{idx}]</span>
                        {arg}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {server.transport === "sse" && server.url && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">URL</p>
                  <p className="text-xs font-mono bg-muted/50 p-2 rounded break-all">
                    {server.url}
                  </p>
                </div>
              )}
              
              {Object.keys(server.env).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Environment Variables</p>
                  <div className="text-xs font-mono bg-muted/50 p-2 rounded space-y-1">
                    {Object.entries(server.env).map(([key, value]) => (
                      <div key={key} className="break-all">
                        <span className="text-primary">{key}</span>
                        <span className="text-muted-foreground mx-1">=</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold">Configured Servers</h3>
            <p className="text-sm text-muted-foreground">
              {servers.length} server{servers.length !== 1 ? "s" : ""} configured
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Server List */}
        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Network className="h-12 w-12 text-primary" />
            </div>
            <p className="text-muted-foreground mb-2 font-medium">No MCP servers configured</p>
            <p className="text-sm text-muted-foreground">
              Add a server to get started with Model Context Protocol
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(serversByScope).map(([scope, scopeServers]) => (
              <div key={scope} className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getScopeIcon(scope)}
                  <span className="font-medium">{getScopeDisplayName(scope)}</span>
                  <span className="text-muted-foreground/60">({scopeServers.length})</span>
                </div>
                <AnimatePresence>
                  <div className="space-y-2">
                    {scopeServers.map(renderServerItem)}
                  </div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingServer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded">
                      <Pencil className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Edit MCP Server</h3>
                      <p className="text-sm text-muted-foreground">{editingServer.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Server Info (Read-only) */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Transport Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getTransportIcon(editingServer.transport)}
                      <Badge variant="outline">{editingServer.transport}</Badge>
                    </div>
                  </div>

                  {editingServer.command && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Command</Label>
                      <p className="text-sm font-mono bg-muted/50 p-2 rounded mt-1 break-all">
                        {editingServer.command}
                      </p>
                    </div>
                  )}

                  {editingServer.url && (
                    <div>
                      <Label className="text-xs text-muted-foreground">URL</Label>
                      <p className="text-sm font-mono bg-muted/50 p-2 rounded mt-1 break-all">
                        {editingServer.url}
                      </p>
                    </div>
                  )}
                </div>

                {/* Environment Variables (Editable) */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Environment Variables</Label>
                  <p className="text-xs text-muted-foreground">
                    Update credentials and configuration values below
                  </p>
                  <div className="space-y-3">
                    {Object.entries(editEnvVars).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-xs font-medium">{key}</Label>
                        <Input
                          type={key.toLowerCase().includes('password') ? 'password' : 'text'}
                          value={value}
                          onChange={(e) => updateEnvVar(key, e.target.value)}
                          placeholder={`Enter ${key}`}
                          className="font-mono text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={savingEdit}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="gap-2"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 