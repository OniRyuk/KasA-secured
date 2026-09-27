import React, { useState } from "react";
import { 
  Layers, 
  Plus, 
  Activity, 
  Trash2, 
  CheckCircle2, 
  Radio, 
  Webhook as WebhookIcon, 
  ShieldAlert, 
  Send, 
  RotateCw, 
  Key, 
  Globe, 
  Check, 
  Clock, 
  ExternalLink,
  Cpu
} from "lucide-react";
import { ModelInstance, WebhookConfig, SessionStatus } from "../types";

interface InstancesAndWebhooksProps {
  instances: ModelInstance[];
  webhooks: WebhookConfig[];
  onAddInstance: (instanceData: any) => Promise<boolean>;
  onDeleteInstance: (id: string) => Promise<boolean>;
  onCreateWebhook: (name: string, targetUrl: string, events: string[]) => Promise<boolean>;
  onTriggerInboundWebhook: (hookId: string, payload: any) => Promise<boolean>;
  sessionStatus: SessionStatus | null;
  onRecycleIp: () => Promise<void>;
  isRecycling: boolean;
}

export const InstancesAndWebhooks: React.FC<InstancesAndWebhooksProps> = ({
  instances,
  webhooks,
  onAddInstance,
  onDeleteInstance,
  onCreateWebhook,
  onTriggerInboundWebhook,
  sessionStatus,
  onRecycleIp,
  isRecycling
}) => {
  // Onboard instance modal/form state
  const [showAddInstance, setShowAddInstance] = useState(false);
  const [instName, setInstName] = useState("");
  const [instProvider, setInstProvider] = useState<"openai_chatgpt" | "gemini" | "anthropic" | "custom_endpoint">("openai_chatgpt");
  const [instEndpoint, setInstEndpoint] = useState("https://api.openai.com/v1/chat/completions");
  const [instModelId, setInstModelId] = useState("gpt-4o");
  const [instApiKey, setInstApiKey] = useState("");
  const [instTemperature, setInstTemperature] = useState(0.7);
  const [instMaxTokens, setInstMaxTokens] = useState(2048);
  const [isSubmittingInst, setIsSubmittingInst] = useState(false);

  // New webhook state
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [whName, setWhName] = useState("");
  const [whUrl, setWhUrl] = useState("https://ci.mycompany.org/hooks/ai-regression");
  const [whEventFailure, setWhEventFailure] = useState(true);
  const [whEventCompleted, setWhEventCompleted] = useState(true);
  const [whEventInstance, setWhEventInstance] = useState(false);
  const [isSubmittingWh, setIsSubmittingWh] = useState(false);

  // Inbound webhook test trigger
  const [inboundHookId, setInboundHookId] = useState(webhooks[0]?.id || "wh-ci-cd-regression");
  const [inboundCommit, setInboundCommit] = useState("feat/rag-fine-tuning-eval");
  const [isTriggeringInbound, setIsTriggeringInbound] = useState(false);
  const [inboundSuccessMessage, setInboundSuccessMessage] = useState<string | null>(null);

  const handleProviderPresetChange = (provider: any) => {
    setInstProvider(provider);
    if (provider === "openai_chatgpt") {
      setInstEndpoint("https://api.openai.com/v1/chat/completions");
      setInstModelId("gpt-4o");
    } else if (provider === "gemini") {
      setInstEndpoint("https://generativelanguage.googleapis.com/v1beta");
      setInstModelId("gemini-3.8-flash");
    } else if (provider === "anthropic") {
      setInstEndpoint("https://api.anthropic.com/v1/messages");
      setInstModelId("claude-3-5-sonnet");
    } else {
      setInstEndpoint("https://my-llm-proxy.internal/v1/completions");
      setInstModelId("custom-llama-3");
    }
  };

  const handleCreateInstance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName || !instEndpoint || !instModelId) return;
    setIsSubmittingInst(true);
    try {
      const ok = await onAddInstance({
        name: instName,
        provider: instProvider,
        endpointUrl: instEndpoint,
        modelIdentifier: instModelId,
        apiKey: instApiKey,
        temperature: instTemperature,
        maxTokens: instMaxTokens
      });
      if (ok) {
        setShowAddInstance(false);
        setInstName("");
        setInstApiKey("");
      }
    } finally {
      setIsSubmittingInst(false);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName || !whUrl) return;
    setIsSubmittingWh(true);
    try {
      const events = [];
      if (whEventFailure) events.push("regression.failure.alert");
      if (whEventCompleted) events.push("regression.run.completed");
      if (whEventInstance) events.push("instance.onboarded");
      const ok = await onCreateWebhook(whName, whUrl, events);
      if (ok) {
        setShowAddWebhook(false);
        setWhName("");
      }
    } finally {
      setIsSubmittingWh(false);
    }
  };

  const handleTestInbound = async () => {
    setIsTriggeringInbound(true);
    setInboundSuccessMessage(null);
    try {
      const ok = await onTriggerInboundWebhook(inboundHookId, {
        commit: inboundCommit,
        branch: "main",
        triggeredBy: "GitHub Actions CI Runner"
      });
      if (ok) {
        setInboundSuccessMessage(`Inbound webhook triggered successfully! Regression suite dispatched for commit: ${inboundCommit}`);
        setTimeout(() => setInboundSuccessMessage(null), 4000);
      }
    } finally {
      setIsTriggeringInbound(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Instance Onboarding & Quota Telemetry */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Live Instance Onboarding & Webhook Integrations
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect ChatGPT, Gemini, or proprietary LLM proxy instances on the fly. Automate regression runs via CI/CD webhooks with zero-downtime rolling access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddInstance(!showAddInstance)}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-cyan-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Instance</span>
          </button>
          <button
            onClick={() => setShowAddWebhook(!showAddWebhook)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            <WebhookIcon className="w-4 h-4 text-purple-400" />
            <span>New Webhook</span>
          </button>
        </div>
      </div>

      {/* Onboard Instance Form Collapse */}
      {showAddInstance && (
        <form onSubmit={handleCreateInstance} className="bg-slate-900 border border-cyan-900/60 rounded-xl p-5 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Onboard New AI Model Instance On The Fly
            </h3>
            <button
              type="button"
              onClick={() => setShowAddInstance(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Instance Name:
              </label>
              <input
                type="text"
                required
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                placeholder="e.g. ChatGPT-4o Production"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Provider Type:
              </label>
              <select
                value={instProvider}
                onChange={(e) => handleProviderPresetChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none cursor-pointer"
              >
                <option value="openai_chatgpt">OpenAI ChatGPT API</option>
                <option value="gemini">Google Gemini API</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="custom_endpoint">Custom / Internal LLM Proxy</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Model Identifier:
              </label>
              <input
                type="text"
                required
                value={instModelId}
                onChange={(e) => setInstModelId(e.target.value)}
                placeholder="e.g. gpt-4o"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                API Key (Secured server-side):
              </label>
              <input
                type="password"
                value={instApiKey}
                onChange={(e) => setInstApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                API Endpoint URL:
              </label>
              <input
                type="url"
                required
                value={instEndpoint}
                onChange={(e) => setInstEndpoint(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none font-mono"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Temp:
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={instTemperature}
                  onChange={(e) => setInstTemperature(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Max Tokens:
                </label>
                <input
                  type="number"
                  step="256"
                  min="256"
                  max="8192"
                  value={instMaxTokens}
                  onChange={(e) => setInstMaxTokens(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSubmittingInst}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingInst ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Verify Health & Register Instance</span>
            </button>
          </div>
        </form>
      )}

      {/* New Webhook Form Collapse */}
      {showAddWebhook && (
        <form onSubmit={handleCreateWebhook} className="bg-slate-900 border border-purple-900/60 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Register Webhook Notification Endpoint
            </h3>
            <button
              type="button"
              onClick={() => setShowAddWebhook(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Webhook Name:
              </label>
              <input
                type="text"
                required
                value={whName}
                onChange={(e) => setWhName(e.target.value)}
                placeholder="e.g. Slack Regression Alerts"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Target URL:
              </label>
              <input
                type="url"
                required
                value={whUrl}
                onChange={(e) => setWhUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="block text-[11px] font-medium text-slate-300">Trigger Events:</span>
            <div className="flex flex-wrap gap-4 text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whEventFailure}
                  onChange={(e) => setWhEventFailure(e.target.checked)}
                  className="rounded bg-slate-950 text-purple-600"
                />
                <span>regression.failure.alert (Score &lt; 80%)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whEventCompleted}
                  onChange={(e) => setWhEventCompleted(e.target.checked)}
                  className="rounded bg-slate-950 text-purple-600"
                />
                <span>regression.run.completed (All runs)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whEventInstance}
                  onChange={(e) => setWhEventInstance(e.target.checked)}
                  className="rounded bg-slate-950 text-purple-600"
                />
                <span>instance.onboarded (New endpoint)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSubmittingWh}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingWh ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save Webhook</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Onboarded Instances (Left) & Webhooks/CI-CD (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Onboarded Instances List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Active Onboarded Model Instances ({instances.length})
            </h3>
            <span className="text-[11px] text-slate-500">Live healthchecked</span>
          </div>

          <div className="space-y-2.5">
            {instances.map((instance) => (
              <div
                key={instance.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <h4 className="text-sm font-semibold text-slate-100">
                        {instance.name}
                      </h4>
                      {instance.isDefault && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                          Primary Core
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                      {instance.endpointUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 bg-cyan-950/40 rounded border border-cyan-900/50">
                      {instance.latencyMs}ms
                    </span>
                    {!instance.isDefault && (
                      <button
                        onClick={() => onDeleteInstance(instance.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 cursor-pointer"
                        title="Decommission instance"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span>Model: <strong className="text-slate-300">{instance.modelIdentifier}</strong></span>
                  <span>Provider: <strong className="text-slate-300 capitalize">{instance.provider.replace("_", " ")}</strong></span>
                  <span>Temp: <strong className="text-slate-300">{instance.temperature}</strong></span>
                  <span>Max Tokens: <strong className="text-slate-300">{instance.maxTokens}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks & Inbound CI/CD Trigger Simulator (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Webhooks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <WebhookIcon className="w-3.5 h-3.5 text-purple-400" />
                Configured Webhooks ({webhooks.length})
              </h3>
            </div>

            <div className="space-y-2">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{wh.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-400 truncate">{wh.targetUrl}</p>
                  <div className="flex items-center gap-1 pt-1">
                    {wh.events.map((ev, ei) => (
                      <span key={ei} className="px-1.5 py-0.2 rounded text-[9px] bg-purple-950/60 text-purple-300 border border-purple-900/40">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inbound Webhook Remote Trigger Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Simulate Inbound CI/CD Webhook Trigger
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Simulate external GitHub Actions or Jenkins dispatching an automated regression check remotely via POST payload.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Select Inbound Hook:</label>
                <select
                  value={inboundHookId}
                  onChange={(e) => setInboundHookId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none cursor-pointer"
                >
                  {webhooks.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Commit / Branch Payload:</label>
                <input
                  type="text"
                  value={inboundCommit}
                  onChange={(e) => setInboundCommit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none font-mono"
                />
              </div>

              <button
                onClick={handleTestInbound}
                disabled={isTriggeringInbound}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded font-medium transition cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                {isTriggeringInbound ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Dispatch Remote Webhook Event</span>
              </button>

              {inboundSuccessMessage && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded text-[11px] font-sans">
                  {inboundSuccessMessage}
                </div>
              )}
            </div>
          </div>

          {/* Virtual IP & Rolling Code Synchronizer Info */}
          {sessionStatus && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Free Use Program IP Recycler
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  Seamless Rollover Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                To prevent hard 24-hour lockouts from interrupting creative workflows, the system synchronizes a rolling session hash every 60 seconds and recycles virtual IP addresses transparently.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Rotated: <strong className="text-slate-200">{sessionStatus.recycledCount} times</strong></span>
                <button
                  onClick={() => onRecycleIp()}
                  disabled={isRecycling}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <RotateCw className={`w-3 h-3 ${isRecycling ? "animate-spin" : ""}`} />
                  <span>Manual Recycle</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
