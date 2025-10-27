import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoke } from "@tauri-apps/api/core";

interface SetupStatus {
  is_first_launch: boolean;
  npm_installed: boolean;
  mcp_server_installed: boolean;
  mcp_server_registered: boolean;
  claude_code_installed: boolean;
}

interface ServiceNowCredentials {
  instance_url: string;
  username: string;
  password: string;
}

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'check' | 'credentials' | 'install' | 'register' | 'complete'>('check');

  const [credentials, setCredentials] = useState<ServiceNowCredentials>({
    instance_url: '',
    username: '',
    password: '',
  });

  const [installProgress, setInstallProgress] = useState<string>('');

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const setupStatus = await invoke<SetupStatus>('get_setup_status');
      setStatus(setupStatus);

      // If already set up, complete immediately
      if (!setupStatus.is_first_launch) {
        setStep('complete');
        setTimeout(() => onComplete(), 1000);
      } else if (setupStatus.claude_code_installed && setupStatus.mcp_server_registered) {
        setStep('complete');
        await invoke('complete_setup');
        setTimeout(() => onComplete(), 1000);
      } else {
        setStep('credentials');
      }
    } catch (err) {
      console.error('Failed to check setup status:', err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    try {
      setStep('install');
      setInstallProgress('Checking npm installation...');

      if (!status?.npm_installed) {
        throw new Error('npm is not installed. Please install Node.js first.');
      }

      // Install servicenow-mcp-server if needed
      if (!status.mcp_server_installed) {
        setInstallProgress('Installing ServiceNow MCP Server...');
        await invoke('install_mcp_server');
        setInstallProgress('ServiceNow MCP Server installed successfully!');
      }

      // Move to registration step
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('register');
      await handleRegister();
    } catch (err) {
      console.error('Installation failed:', err);
      setError(err as string);
      setStep('credentials');
    }
  };

  const handleRegister = async () => {
    try {
      setInstallProgress('Registering MCP server with Claude Code...');

      await invoke('register_mcp_server', { credentials });

      setInstallProgress('Registration complete!');
      await invoke('complete_setup');

      setStep('complete');
      setTimeout(() => onComplete(), 2000);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err as string);
      setStep('credentials');
    }
  };

  const handleSkip = async () => {
    try {
      await invoke('skip_setup');
      onComplete();
    } catch (err) {
      console.error('Failed to skip setup:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Checking setup status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen p-4 bg-gradient-to-br from-gray-900 to-black">
      <Card className="w-full max-w-2xl p-8 bg-gray-800/50 backdrop-blur-xl border-gray-700">
        <AnimatePresence mode="wait">
          {step === 'credentials' && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to HappyVibe
                </h2>
                <p className="text-gray-400">
                  Let's set up your ServiceNow MCP server integration
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-400">{error}</div>
                </div>
              )}

              {!status?.claude_code_installed && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-400">
                    Claude Code is not installed. Install it with:{' '}
                    <code className="px-2 py-1 bg-black/50 rounded">npm install -g @anthropics/claude-code</code>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="instance_url">ServiceNow Instance URL</Label>
                  <Input
                    id="instance_url"
                    type="url"
                    placeholder="https://your-instance.service-now.com"
                    value={credentials.instance_url}
                    onChange={(e) => setCredentials({ ...credentials, instance_url: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleInstall}
                  disabled={!credentials.instance_url || !credentials.username || !credentials.password || !status?.claude_code_installed}
                  className="flex-1"
                >
                  Continue Setup
                </Button>
                <Button onClick={handleSkip} variant="ghost">
                  Skip for Now
                </Button>
              </div>
            </motion.div>
          )}

          {(step === 'install' || step === 'register') && (
            <motion.div
              key="installing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-400" />
              <h3 className="text-2xl font-bold mb-2">Setting up MCP Server</h3>
              <p className="text-gray-400 mb-6">{installProgress}</p>

              {status && (
                <div className="space-y-3 text-left">
                  <StatusItem
                    label="npm Installed"
                    status={status.npm_installed}
                  />
                  <StatusItem
                    label="MCP Server Installed"
                    status={status.mcp_server_installed || step !== 'install'}
                  />
                  <StatusItem
                    label="Registered with Claude Code"
                    status={step === 'register' || status.mcp_server_registered}
                  />
                </div>
              )}
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-2">All Set!</h3>
              <p className="text-gray-400 mb-6">
                Your ServiceNow MCP server is configured and ready to use.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  status: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
    {status ? (
      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
    ) : (
      <Loader2 className="w-5 h-5 text-gray-400 animate-spin flex-shrink-0" />
    )}
    <span className="text-sm">{label}</span>
  </div>
);
