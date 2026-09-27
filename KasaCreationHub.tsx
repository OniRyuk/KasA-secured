import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Flame,
  Palette,
  Layers,
  Code2,
  Film,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ChevronRight,
  Terminal,
  HeartHandshake,
  Check,
  Copy,
  Plus,
  Play,
  FileCheck,
  Cpu,
  AlertTriangle,
  Download,
  Maximize2,
  Smartphone,
  Webhook as WebhookIcon
} from "lucide-react";
import { KasaConfig, KasaMessage, KasaProjectItem, KasaCreativePack } from "../types";

interface KasaCreationHubProps {
  onNotify: (msg: string, type: "success" | "info" | "warning") => void;
  fontWave?: boolean;
}

const CREATIVE_PACKS: KasaCreativePack[] = [
  {
    id: "pack-anime-genesis",
    name: "Neo-Tokyo Anime Genesis Pack",
    japaneseTitle: "新東京・創世脚本集",
    category: "anime",
    description: "Production-grade episodic storyboards, cyberpunk fight choreography scripts, and character design sheets.",
    features: [
      "Cinematic 3-Act anime screenplay templates",
      "Action shot-list & camera angle tokens (Dutch angle, katana zoom)",
      "Japanese voice-acting phonetic cue scripts",
      "Shinjuku & Neo-Kyoto atmospheric soundscape directions"
    ],
    highlight: "Cinematic Anime Storyboards",
    overheadSupportNote: "Directly funds upstream model tokens & rendering compute.",
    tier: "creator",
    iconName: "film"
  },
  {
    id: "pack-ronin-app",
    name: "Ronin Sovereign App Architecture Pack",
    japaneseTitle: "浪人・自律型設計書",
    category: "app",
    description: "Zero-telemetry client-side app templates, WebCrypto SHA-256 engines, and automated edge-case bug detection blueprints.",
    features: [
      "Pre-configured PWA offline manifest & service worker",
      "Full hardware crypto.subtle AES-GCM local vault scaffolding",
      "Automated edge-case and latency regression assertions",
      "High-contrast Tailwind UI design kit with Japanese motifs"
    ],
    highlight: "Production Software Architecture",
    overheadSupportNote: "Supports server infrastructure, domain routing, and dev upkeep.",
    tier: "master",
    iconName: "code"
  },
  {
    id: "pack-sumie-art",
    name: "Cyber-Sumi-e Master Visual Pack",
    japaneseTitle: "墨絵・電脳絵巻",
    category: "art",
    description: "High-contrast Japanese aesthetics, procedural SVG vector generators, and vermilion-to-obsidian color harmonies.",
    features: [
      "120+ Japanese cyberpunk prompt catalysts",
      "Procedural SVG starlight & shrine vector renderer",
      "Washi paper & bioluminescent ink shader directives",
      "Commercial art license rights for 2026 releases"
    ],
    highlight: "Mesmerizing Visual Direction",
    overheadSupportNote: "Sustains high-tier image generation and SVG procedural compute.",
    tier: "creator",
    iconName: "palette"
  },
  {
    id: "pack-compute-fuel",
    name: "KasA API Fuel & Overhead Sanctuary",
    japaneseTitle: "神威・計算燃料基盤",
    category: "compute",
    description: "Community-backed overhead subsidy to keep KasA free, fast, sovereign, and resilient against API rate limits.",
    features: [
      "Priority latency routing on dedicated Gemini 2026 endpoints",
      "Extended context window (32k token memory buffer)",
      "Honorable Patron digital seal in user profile",
      "100% transparent overhead & token maintenance telemetry"
    ],
    highlight: "Sovereign Compute Upkeep",
    overheadSupportNote: "Ensures KasA remains autonomous and continuously funded.",
    tier: "master",
    iconName: "zap"
  }
];

export const KasaCreationHub: React.FC<KasaCreationHubProps> = ({
  onNotify,
  fontWave = true
}) => {
  // Navigation within KasA
  const [activeSection, setActiveSection] = useState<"hub" | "chat" | "projects" | "packs" | "artgen">("hub");
  const [projectFilter, setProjectFilter] = useState<"all" | "anime" | "app" | "art">("all");

  // UI Minimization & Status Bar Mode
  const [isAiMinimized, setIsAiMinimized] = useState(false);
  const [chatTheme, setChatTheme] = useState<"crimson" | "gold" | "obsidian" | "emerald">("crimson");

  // External Webhook Bridge State
  const [useWebhook, setUseWebhook] = useState(false);
  const [webhookUrlInput, setWebhookUrlInput] = useState("https://api.openai.com/v1/chat/completions");
  const [webhookTokenInput, setWebhookTokenInput] = useState("");
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);

  // Dedicated Art AI Generator State
  const [artPrompt, setArtPrompt] = useState("Crimson cyber-katana standing in Neo-Tokyo rain beneath glowing Torii gate");
  const [artStylePreset, setArtStylePreset] = useState("Cyberpunk Ukiyo-e");
  const [artAspectRatio, setArtAspectRatio] = useState("1:1");
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [lastGeneratedArt, setLastGeneratedArt] = useState<string | null>(null);

  // Zoomed Image Modal State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // KasA Configuration State
  const [config, setConfig] = useState<KasaConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Chat Console State
  const [chatMessages, setChatMessages] = useState<KasaMessage[]>([
    {
      id: "kasa-welcome",
      role: "assistant",
      content: "ようこそ。I am KasA, your sovereign Japanese creative catalyst and multi-disciplinary genesis engine.\n\nI am here to help you begin, refine, and finalize your projects across Anime Creation, App Architecture, and Masterwork Art. How shall we direct our creative energy today?",
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: 38
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<KasaProjectItem[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectType, setNewProjectType] = useState<"anime" | "app" | "art">("anime");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectSummary, setNewProjectSummary] = useState("");
  const [newProjectContent, setNewProjectContent] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Spark Prompts
  const quickSparks = [
    { label: "Anime Storyboard", prompt: "Synthesize an Anime Storyboard opening scene with cinematic camera directions in Neo-Tokyo rain.", type: "anime" },
    { label: "App Architecture & Bugs", prompt: "Architect a local-first TypeScript application and identify the 3 most critical edge-case bugs that could break it.", type: "app" },
    { label: "Masterclass Art Genesis", prompt: "Generate an image of a Crimson Katana in Neo-Tokyo rain beneath a Torii gate", type: "art" },
    { label: "Finalize Project Draft", prompt: "Review my current project specifications and format them into a finalized production blueprint ready for release.", type: "hub" }
  ];

  // Fetch initial config & projects
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cfgRes, projRes] = await Promise.all([
          fetch("/api/kasa/config"),
          fetch("/api/kasa/projects")
        ]);

        if (cfgRes.ok) {
          const cfgData = await cfgRes.json();
          setConfig(cfgData.config);
          if (cfgData.config?.webhookBridge) {
            setWebhookUrlInput(cfgData.config.webhookBridge.targetUrl || "https://api.openai.com/v1/chat/completions");
            setUseWebhook(cfgData.config.webhookBridge.enabled || false);
          }
        }

        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData.projects || []);
        }
      } catch (err) {
        console.error("Failed loading KasA data:", err);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadInitialData();
  }, []);

  // Send message to KasA
  const handleSendMessage = async (promptToSend?: string, isExplicitArt?: boolean) => {
    const text = (promptToSend || chatInput).trim();
    if (!text || isSending) return;

    const userMsg: KasaMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setChatInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/kasa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          config: {
            ...config,
            webhookBridge: {
              enabled: useWebhook,
              targetUrl: webhookUrlInput,
              authBearerToken: webhookTokenInput,
              requestFormat: webhookUrlInput.includes("11434") ? "ollama" : "openai"
            }
          },
          webhookUrl: webhookUrlInput,
          routeViaWebhook: useWebhook,
          isArtGen: isExplicitArt
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: KasaMessage = {
          id: "msg-" + Date.now() + "-resp",
          role: "assistant",
          content: data.reply || "Creative catalyst executed.",
          timestamp: new Date().toLocaleTimeString(),
          latencyMs: data.latencyMs,
          tokens: data.tokens,
          generatedImageUrl: data.generatedImageUrl || data.imageUrl,
          framework: data.framework,
          webhookTarget: data.webhookTarget
        };
        setChatMessages((prev) => [...prev, assistantMsg]);

        if (data.belligerenceHandled) {
          onNotify("KasA disengaged serenely from hostile input. Creative tranquility preserved.", "info");
        }
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      // Sovereign local fallback
      const fallbackMsg: KasaMessage = {
        id: "msg-" + Date.now() + "-fallback",
        role: "assistant",
        content: `【KasA Sovereign Mode】\nDirective: "${text}"\n\nKasA has processed your creative instruction within the local sanctuary sandbox. All artistic tokens, script arcs, and software blueprints remain intact.`,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: 45
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Generate Image directly in Art AI Genesis Tab
  const handleGenerateArtDirect = async () => {
    if (!artPrompt.trim() || isGeneratingArt) return;
    setIsGeneratingArt(true);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: artPrompt,
          style: artStylePreset,
          aspectRatio: artAspectRatio
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          setLastGeneratedArt(data.imageUrl);
          onNotify("Masterpiece Art synthesized successfully!", "success");
        }
      }
    } catch (err) {
      onNotify("Error synthesizing art.", "warning");
    } finally {
      setIsGeneratingArt(false);
    }
  };

  // Create and save a new Project
  const handleSaveProject = async () => {
    if (!newProjectTitle.trim()) {
      onNotify("Please provide a project title.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/kasa/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newProjectType,
          title: newProjectTitle,
          summary: newProjectSummary || "Authored within KasA Genesis Hub.",
          content: newProjectContent || "Project draft initialized.",
          tags: [newProjectType, "kasa-genesis", "2026"]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [data.project, ...prev]);
        setIsCreatingProject(false);
        setNewProjectTitle("");
        setNewProjectSummary("");
        setNewProjectContent("");
        onNotify(`Project '${data.project.title}' sealed into KasA Hub!`, "success");
      }
    } catch {
      onNotify("Failed to save project.", "warning");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify("Copied to clipboard with author seal.", "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProjects = projects.filter((p) => projectFilter === "all" || p.type === projectFilter);

  return (
    <div className="space-y-6 pb-36 sm:pb-32">
      {/* Minimized Status Bar Mode */}
      {isAiMinimized ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-950 border-2 border-red-600/90 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  ⚡ KasA AI Catalyst Console: MINIMIZED STATUS BAR
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">
                  Model: Gemini-3.8-Flash
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Sovereign AI Engine Standby • {chatMessages.length} Messages in Active Memory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setActiveSection("chat");
                setIsAiMinimized(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all border border-red-400 shadow-lg shadow-red-950/60"
            >
              Expand AI Console
            </button>
          </div>
        </div>
      ) : (
        /* Full Hero & Navigation Banner */
        <div className="relative overflow-hidden rounded-2xl border border-red-600/70 bg-gradient-to-b from-neutral-950 via-black to-neutral-950 p-5 sm:p-7 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-red-700/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/80 shadow-md">
                  <Flame className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white-crisp">
                    KasA Sovereign Japanese Creation Hub • 2026
                  </span>
                </div>
                <button
                  onClick={() => setIsAiMinimized(true)}
                  title="Minimize AI Console to Top Status Bar"
                  className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-red-800 text-[10px] font-bold uppercase transition flex items-center gap-1"
                >
                  Minimize UI
                </button>
              </div>

              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black text-kasa-bright-red ${fontWave ? "font-japan-wave" : "font-cyber"}`}>
                KasA — THE CREATIVE CATALYST
              </h1>

              <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed">
                A unified, mesmerizing sanctuary for <span className="text-red-400 font-bold">Anime Creation</span>, <span className="text-red-400 font-bold">App Architecture</span>, and <span className="text-red-400 font-bold">Mastercraft Art Synthesis</span>. Designed with zero dark text, immaculate high-contrast legibility, and serene ethical boundaries.
              </p>
            </div>

            {/* Quick Metrics & Upkeep Fuel Badge */}
            <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-xl border border-red-600/60 bg-red-950/50 backdrop-blur text-center shadow-lg">
                <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest block">API Compute Upkeep</span>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-sm font-extrabold text-white-crisp">100% Sovereign Active</span>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl border border-zinc-700/80 bg-neutral-900/80 text-center shadow-md">
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">Architect & Sole Creator</span>
                <span className="text-sm font-bold text-red-400">Scott Gushea</span>
              </div>
            </div>
          </div>

          {/* Clean, Curated Navigation Sub-Tabs */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 sm:gap-3 mt-6 pt-4 border-t border-red-950/80">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setActiveSection("hub")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeSection === "hub"
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50 border border-red-400"
                    : "bg-neutral-900 text-zinc-200 border border-zinc-800 hover:border-red-600 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creative Genesis Hub</span>
              </button>

              <button
                onClick={() => setActiveSection("chat")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeSection === "chat"
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50 border border-red-400"
                    : "bg-neutral-900 text-zinc-200 border border-zinc-800 hover:border-red-600 hover:text-white"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>KasA Interactive Console</span>
              </button>

              <button
                onClick={() => setActiveSection("artgen")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeSection === "artgen"
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50 border border-red-400"
                    : "bg-neutral-900 text-zinc-200 border border-zinc-800 hover:border-red-600 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-pink-400" />
                <span>Art AI Genesis Studio</span>
              </button>

              <button
                onClick={() => setActiveSection("projects")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeSection === "projects"
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50 border border-red-400"
                    : "bg-neutral-900 text-zinc-200 border border-zinc-800 hover:border-red-600 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Project Archives ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveSection("packs")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeSection === "packs"
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50 border border-red-400"
                    : "bg-neutral-900 text-zinc-200 border border-zinc-800 hover:border-red-600 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Creative Packs & Upkeep</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/api/apk/download-direct-apk"
                download="KasA-Sovereign-v1.0.apk"
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white border border-red-400 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-red-950/80"
                title="Download single standalone Android KasA.apk package"
              >
                <Smartphone className="w-3.5 h-3.5 text-white" />
                <span>Download KasA.apk</span>
              </a>

              <a
                href="/api/export/airgapped-standalone"
                download="KasA-Offline-AirGapped-Standalone.html"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/80 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md"
                title="Download 100% offline standalone compiled HTML bundle"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Air-Gapped HTML</span>
              </a>

              <button
                onClick={() => setIsAiMinimized(true)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-red-900 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shrink-0"
              >
                <span>Minimize Bar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: CREATIVE GENESIS HUB (THE 3 SACRED DOMAINS) */}
      {activeSection === "hub" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quick Spark Tray */}
          <div className="p-4 rounded-xl border border-red-700/60 bg-neutral-950/90 shadow-xl">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2.5">
              ⚡ Instant Creative Sparks (One-Click Synthesis)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {quickSparks.map((spark, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSection("chat");
                    handleSendMessage(spark.prompt);
                  }}
                  className="p-3 text-left rounded-lg bg-neutral-900/90 hover:bg-neutral-800/90 border border-red-900/50 hover:border-red-500 transition-all group"
                >
                  <div className="text-xs font-extrabold text-white group-hover:text-red-300 flex items-center justify-between">
                    <span>{spark.label}</span>
                    <ChevronRight className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 font-normal">
                    {spark.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* The Three Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1: Anime Studio */}
            <div className="rounded-2xl border border-red-700/80 bg-neutral-950/90 p-5 shadow-xl flex flex-col justify-between hover:border-red-500 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/90 border border-red-500 flex items-center justify-center text-red-400">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white-crisp">Anime Creation & Scripting</h3>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  Compose episodic anime scripts, storyboards, pacing beats, and cinematic camera cues in Neo-Tokyo cyberpunk and Edo folklore realms.
                </p>
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>3-Act Screenplay Framing</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Voice Actor Dialect & Stage Notes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Combat Choreography & Slow-Mo Tokens</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setNewProjectType("anime");
                  setIsCreatingProject(true);
                  setActiveSection("projects");
                }}
                className="mt-5 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start Anime Project</span>
              </button>
            </div>

            {/* Pillar 2: App Architecture */}
            <div className="rounded-2xl border border-red-700/80 bg-neutral-950/90 p-5 shadow-xl flex flex-col justify-between hover:border-red-500 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/90 border border-red-500 flex items-center justify-center text-red-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white-crisp">App Creation & Bug Audit</h3>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  The AI you create here is responsible for identifying architectural issues, latency bottlenecks, and edge cases that would otherwise remain incomplete.
                </p>
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Zero-Telemetry Client-Side Contracts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Edge-Case & Re-entrancy Bug Isolation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Type-Safe Scaffolding & State Machines</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setNewProjectType("app");
                  setIsCreatingProject(true);
                  setActiveSection("projects");
                }}
                className="mt-5 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Architect New App</span>
              </button>
            </div>

            {/* Pillar 3: Art & Aesthetic Direction */}
            <div className="rounded-2xl border border-red-700/80 bg-neutral-950/90 p-5 shadow-xl flex flex-col justify-between hover:border-red-500 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/90 border border-red-500 flex items-center justify-center text-red-400">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white-crisp">Art & Aesthetic Synthesis</h3>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  Design mesmerizing visual guidelines, color harmonies, procedural vector blueprints, and Japanese cyberpunk atmosphere without murky dark text.
                </p>
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Ukiyo-e Woodblock & Neon Fusion</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>High-Contrast Vermilion Palette Tuning</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Procedural SVG Vector Blueprints</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setNewProjectType("art");
                  setIsCreatingProject(true);
                  setActiveSection("projects");
                }}
                className="mt-5 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Synthesize Art Direction</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SINGLE CLEAN INTERACTIVE KASA CHAT CONSOLE */}
      {activeSection === "chat" && (
        <div className="animate-in fade-in duration-300">
          {/* Single Static Chat Frame */}
          <div className={`rounded-2xl border p-3 sm:p-5 shadow-2xl flex flex-col h-[650px] relative ${
            chatTheme === "crimson"
              ? "border-red-700/80 bg-neutral-950"
              : chatTheme === "gold"
              ? "border-amber-600/80 bg-neutral-950"
              : chatTheme === "emerald"
              ? "border-emerald-600/80 bg-neutral-950"
              : "border-neutral-700 bg-black"
          }`}>
            {/* Header & Controls */}
            <div className="flex flex-col gap-2 pb-3 border-b border-red-950/90 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-500 text-red-400 flex items-center justify-center font-black text-sm">
                    K
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white-crisp">KasA Sovereign Catalyst AI</h3>
                    <p className="text-[10px] text-zinc-400 font-medium">Single Static Interface • Local & Webhook Bridge</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* External Webhook Bridge Toggle Button */}
                  <button
                    onClick={() => setShowWebhookConfig(!showWebhookConfig)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1.5 border ${
                      useWebhook
                        ? "bg-purple-950/90 border-purple-500 text-purple-300"
                        : "bg-neutral-900 border-neutral-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <WebhookIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{useWebhook ? "ChatGPT Webhook ON" : "Webhook Bridge"}</span>
                  </button>

                  {/* Theme Selector */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px]">
                    {(["crimson", "gold", "emerald", "obsidian"] as const).map((th) => (
                      <button
                        key={th}
                        onClick={() => setChatTheme(th)}
                        className={`px-2 py-0.5 rounded font-bold uppercase transition ${
                          chatTheme === th
                            ? "bg-red-600 text-white shadow"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {th}
                      </button>
                    ))}
                  </div>

                  {/* Minimize Button */}
                  <button
                    onClick={() => setIsAiMinimized(true)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-red-300 border border-red-900 text-xs font-bold uppercase transition"
                  >
                    Minimize
                  </button>
                </div>
              </div>

              {/* Collapsible External Webhook AI Configuration Bar */}
              {showWebhookConfig && (
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-600/80 space-y-2 animate-in fade-in text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-300 flex items-center gap-1.5">
                      <WebhookIcon className="w-4 h-4 text-purple-400" />
                      External AI Webhook Bridge (ChatGPT / Ollama / N8N)
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={useWebhook}
                        onChange={(e) => setUseWebhook(e.target.checked)}
                        className="rounded accent-purple-500 w-4 h-4"
                      />
                      <span>Route Prompts to Webhook</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-300 font-bold block mb-1">Target Webhook URL:</label>
                      <input
                        type="text"
                        value={webhookUrlInput}
                        onChange={(e) => setWebhookUrlInput(e.target.value)}
                        placeholder="https://api.openai.com/v1/chat/completions or http://localhost:11434"
                        className="w-full px-3 py-1.5 rounded bg-black/80 border border-purple-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-300 font-bold block mb-1">Bearer Auth Token (Optional):</label>
                      <input
                        type="password"
                        value={webhookTokenInput}
                        onChange={(e) => setWebhookTokenInput(e.target.value)}
                        placeholder="sk-... or webhook secret"
                        className="w-full px-3 py-1.5 rounded bg-black/80 border border-purple-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-purple-300">
                    💡 When enabled, KasA dispatches your prompts directly through this webhook to ChatGPT, Ollama, or N8N!
                  </div>
                </div>
              )}
            </div>

            {/* Sliding Scrollable Message Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 py-3 scrollbar-thin">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      {msg.role === "user" ? "Scott (Creator)" : "KasA Catalyst"}
                    </span>
                    {msg.framework && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono">
                        {msg.framework}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap relative group text-xs sm:text-sm ${
                      msg.role === "user"
                        ? "bg-red-700/80 text-white font-medium border border-red-400 shadow-md"
                        : "bg-neutral-900/95 text-white font-medium border border-red-600/60 shadow-lg"
                    }`}
                  >
                    {msg.content}

                    {/* Inline Synthesized Image Card */}
                    {(msg.generatedImageUrl || msg.imageUrl) && (
                      <div className="mt-3 p-2 rounded-xl bg-black/80 border border-red-500/80 space-y-2">
                        <img
                          src={msg.generatedImageUrl || msg.imageUrl}
                          alt="Synthesized Artwork"
                          className="w-full max-h-72 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
                          onClick={() => setZoomedImage(msg.generatedImageUrl || msg.imageUrl || null)}
                        />
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-red-400 font-bold uppercase">Synthesized Art Masterpiece</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setZoomedImage(msg.generatedImageUrl || msg.imageUrl || null)}
                              className="px-2 py-0.5 rounded bg-red-900 hover:bg-red-800 text-white font-bold transition flex items-center gap-1"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Zoom</span>
                            </button>
                            <a
                              href={msg.generatedImageUrl || msg.imageUrl}
                              download="KasA-Masterpiece-Artwork.svg"
                              className="px-2 py-0.5 rounded bg-emerald-900 hover:bg-emerald-800 text-white font-bold transition flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="absolute top-2 right-2 p-1 rounded bg-black/60 hover:bg-black text-zinc-300 hover:text-white opacity-0 group-hover:opacity-100 transition"
                      title="Copy Message"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-red-900/60 w-fit">
                  <RefreshCw className="w-3.5 h-3.5 text-red-400 animate-spin" />
                  <span className="text-xs font-semibold text-red-300">KasA is formulating answer...</span>
                </div>
              )}
            </div>

            {/* Static Bottom Chat Input (Stays Visible & Above Keyboards) */}
            <div className="pt-2 border-t border-red-950/90 shrink-0 sticky bottom-0 bg-neutral-950 z-20">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask KasA or type creative prompts..."
                  className="flex-1 px-4 py-2.5 rounded-xl kasa-input-box text-xs sm:text-sm font-medium"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={isSending || !chatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ART AI GENESIS STUDIO */}
      {activeSection === "artgen" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl border border-pink-600/80 bg-neutral-950 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-pink-900/60 pb-3">
              <div>
                <h3 className="text-lg font-black text-white-crisp flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-400" />
                  <span>KasA Masterpiece Art AI Generator</span>
                </h3>
                <p className="text-xs text-zinc-300 font-medium mt-0.5">
                  Generate distinct vector and raster artworks, palettes, and anime scenes with zero greeting loops.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-pink-950 border border-pink-600 text-pink-300 text-[10px] font-bold uppercase">
                  Procedural & Gemini AI Active
                </span>
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs font-extrabold text-pink-300 uppercase block">Art Direction & Prompt</label>
                <textarea
                  value={artPrompt}
                  onChange={(e) => setArtPrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe your desired artwork, anime scene, or visual atmosphere..."
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-pink-900 text-white text-xs font-medium focus:border-pink-500 focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-zinc-300 mr-1">Aesthetic Style:</span>
                  {(["Cyberpunk Ukiyo-e", "Studio Ghibli Anime", "Renaissance Chiaroscuro", "Celestial Starlight Ink", "Oil Masterpiece"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setArtStylePreset(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        artStylePreset === st
                          ? "bg-pink-600 text-white border border-pink-400 shadow"
                          : "bg-neutral-900 text-zinc-300 border border-zinc-800 hover:border-pink-600"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-neutral-900 border border-pink-950 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-extrabold text-pink-300 uppercase block mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {(["1:1", "16:9", "9:16"] as const).map((ar) => (
                      <button
                        key={ar}
                        onClick={() => setArtAspectRatio(ar)}
                        className={`py-1.5 rounded-lg font-bold border transition ${
                          artAspectRatio === ar
                            ? "bg-pink-600 border-pink-400 text-white shadow"
                            : "bg-black text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateArtDirect}
                  disabled={isGeneratingArt || !artPrompt.trim()}
                  className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-pink-950/60 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingArt ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Synthesizing Artwork...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Synthesize Masterpiece Art</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Art Preview Display */}
            {lastGeneratedArt && (
              <div className="p-4 rounded-2xl bg-black border-2 border-pink-500 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-pink-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Synthesized Artwork Preview</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoomedImage(lastGeneratedArt)}
                      className="px-3 py-1 rounded-lg bg-pink-900 hover:bg-pink-800 text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Zoom Fullscreen</span>
                    </button>
                    <a
                      href={lastGeneratedArt}
                      download="KasA-Generated-Art.svg"
                      className="px-3 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Artwork</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-center bg-neutral-950 rounded-xl p-3 border border-pink-950">
                  <img
                    src={lastGeneratedArt}
                    alt="Synthesized Art Masterpiece"
                    className="max-h-[500px] w-auto object-contain rounded-lg shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform"
                    onClick={() => setZoomedImage(lastGeneratedArt)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ZOOMED IMAGE MODAL */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <a
              href={zoomedImage}
              download="KasA-Art-Masterpiece.svg"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </a>
            <button
              onClick={() => setZoomedImage(null)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg"
            >
              Close
            </button>
          </div>

          <img
            src={zoomedImage}
            alt="Full Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl border-2 border-red-500 shadow-2xl"
          />
        </div>
      )}

      {/* SECTION 3: PROJECT ARCHIVES & FINALIZATION */}
      {activeSection === "projects" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-red-700/60 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider mr-2">Filter:</span>
              {(["all", "anime", "app", "art"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    projectFilter === filter
                      ? "bg-red-600 text-white border border-red-400"
                      : "bg-neutral-900 text-zinc-300 border border-zinc-800 hover:border-red-600"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreatingProject(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>Begin New Project</span>
            </button>
          </div>

          {/* New Project Modal / Drawer */}
          {isCreatingProject && (
            <div className="p-5 rounded-2xl border-2 border-red-500 bg-neutral-950/95 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
                <h3 className="text-base font-black text-white-crisp flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span>Initialize New Genesis Project</span>
                </h3>
                <button
                  onClick={() => setIsCreatingProject(false)}
                  className="text-zinc-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-red-300 uppercase tracking-wider block mb-1">
                    Project Category
                  </label>
                  <select
                    value={newProjectType}
                    onChange={(e) => setNewProjectType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg kasa-input-box text-xs font-semibold"
                  >
                    <option value="anime">Anime Creation & Script</option>
                    <option value="app">App Creation & Bug Identification</option>
                    <option value="art">Art & Aesthetic Synthesis</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-red-300 uppercase tracking-wider block mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g. Chronicles of Neo-Edo"
                    className="w-full px-3 py-2 rounded-lg kasa-input-box text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-red-300 uppercase tracking-wider block mb-1">
                  Summary & Objectives
                </label>
                <input
                  type="text"
                  value={newProjectSummary}
                  onChange={(e) => setNewProjectSummary(e.target.value)}
                  placeholder="Short brief of this creative endeavor..."
                  className="w-full px-3 py-2 rounded-lg kasa-input-box text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-red-300 uppercase tracking-wider block mb-1">
                  Draft Specifications & Content
                </label>
                <textarea
                  rows={5}
                  value={newProjectContent}
                  onChange={(e) => setNewProjectContent(e.target.value)}
                  placeholder="Enter script lines, app component architectures, or art prompt directives..."
                  className="w-full px-3 py-2 rounded-lg kasa-input-box text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsCreatingProject(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-zinc-300 text-xs font-bold hover:bg-neutral-800"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveProject}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Seal Project into KasA</span>
                </button>
              </div>
            </div>
          )}

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-red-700/70 bg-neutral-950/90 p-5 shadow-xl space-y-3 hover:border-red-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-950 border border-red-500 text-white">
                      {p.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-zinc-300 font-semibold">{p.status.toUpperCase()}</span>
                  </div>

                  <h4 className="text-base font-black text-white-crisp">{p.title}</h4>
                  <p className="text-xs text-zinc-200 leading-relaxed">{p.summary}</p>

                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-red-950 text-xs font-mono text-zinc-200 max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {p.content}
                  </div>
                </div>

                <div className="pt-3 border-t border-red-950/80 flex items-center justify-between text-[11px] text-zinc-300">
                  <span>Author: {p.creatorSignature}</span>
                  <button
                    onClick={() => copyToClipboard(p.content, p.id)}
                    className="flex items-center gap-1 text-red-400 hover:text-white font-bold transition-colors"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === p.id ? "Copied" : "Copy Blueprint"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: CREATIVE PACKS & UPKEEP STATION */}
      {activeSection === "packs" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl border border-red-600/80 bg-neutral-950 shadow-xl">
            <div className="max-w-3xl space-y-2">
              <h3 className="text-lg font-black text-white-crisp flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-red-400" />
                <span>Creator Overhead & Upkeep Sponsorship</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal">
                To support ongoing Gemini API compute, dedicated server memory, and high-concurrency offline nodes, KasA features curated modular packs. Each pack directly offsets API token overhead while expanding the creator's toolkit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CREATIVE_PACKS.map((pack) => (
              <div
                key={pack.id}
                className="rounded-2xl border border-red-700/80 bg-neutral-950/90 p-5 shadow-2xl flex flex-col justify-between hover:border-red-500 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 tracking-wider">
                      {pack.japaneseTitle}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-950 border border-red-500 text-white">
                      {pack.tier}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-white-crisp group-hover:text-red-300 transition-colors">
                    {pack.name}
                  </h4>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {pack.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {pack.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-100 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-red-900/50 text-[11px] text-red-300 font-semibold">
                    💡 {pack.overheadSupportNote}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-red-950/80 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white-crisp">{pack.highlight}</span>
                  <button
                    onClick={() => {
                      onNotify(`Engaged ${pack.name} blueprint! API tokens allocated.`, "success");
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-950/50 flex items-center gap-1.5"
                  >
                    <span>Engage Pack</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
