import React, { useState, useRef, useEffect } from "react";
import { 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Search, 
  Bookmark, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Plus, 
  X, 
  Wifi, 
  Battery, 
  EyeOff, 
  Trash2, 
  ExternalLink, 
  Sliders, 
  Check, 
  Radio,
  Flame,
  Terminal,
  Shield
} from "lucide-react";
import { BrowserTab } from "../types";
import { KasaButton } from "./KasaButton";

interface PrivacyKioskBrowserProps {
  onNotify?: (message: string, type: "success" | "error" | "info") => void;
  fontWave?: boolean;
}

const DEFAULT_BOOKMARKS = [
  { title: "DuckDuckGo", url: "https://duckduckgo.com", icon: "🦆", category: "Search" },
  { title: "Wikipedia", url: "https://en.wikipedia.org", icon: "📚", category: "Knowledge" },
  { title: "Linux Kernel", url: "https://kernel.org", icon: "🐧", category: "System" },
  { title: "EFF Privacy", url: "https://eff.org", icon: "🛡️", category: "Privacy" },
  { title: "Internet Archive", url: "https://archive.org", icon: "🏛️", category: "Archive" },
];

const USER_AGENTS = [
  { id: "kasa_sovereign", name: "KasA Sovereign OS 1.0 (Zero-Telemetry Air-Gap)", val: "Mozilla/5.0 (X11; KasA-Sovereign-Linux-x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" },
  { id: "tor_hardened", name: "Tor Browser 14.0 (Linux Hardened / Anti-Fingerprint)", val: "Mozilla/5.0 (Windows NT 10.0; rv:115.0) Gecko/20100101 Firefox/115.0" },
  { id: "graphene_os", name: "GrapheneOS Android Privacy Phone", val: "Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36" },
];

export const PrivacyKioskBrowser: React.FC<PrivacyKioskBrowserProps> = ({
  onNotify,
  fontWave = true,
}) => {
  // Tabs State
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: "tab-1",
      title: "DuckDuckGo Privacy Search",
      url: "https://duckduckgo.com",
      history: ["https://duckduckgo.com"],
      historyIndex: 0,
      isLoading: false,
      privacyShieldActive: true,
      trackersBlockedCount: 14,
      sandboxed: true,
      isTorMode: true,
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");
  const [inputUrl, setInputUrl] = useState<string>("https://duckduckgo.com");
  const [deviceFrame, setDeviceFrame] = useState<"phone" | "tablet" | "desktop">("phone");
  const [selectedUserAgent, setSelectedUserAgent] = useState(USER_AGENTS[0].id);
  const [isPrivacyInspectorOpen, setIsPrivacyInspectorOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Active Tab
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url);
    }
  }, [activeTabId, activeTab]);

  // Navigate to URL or Search
  const handleNavigate = (targetUrl: string) => {
    let finalUrl = targetUrl.trim();
    if (!finalUrl) return;

    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      if (finalUrl.includes(".") && !finalUrl.includes(" ")) {
        finalUrl = "https://" + finalUrl;
      } else {
        // Search query via DuckDuckGo
        finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(finalUrl)}`;
      }
    }

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTabId) {
          const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), finalUrl];
          return {
            ...tab,
            url: finalUrl,
            title: finalUrl.replace(/^https?:\/\//, "").split("/")[0],
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isLoading: false,
            trackersBlockedCount: tab.trackersBlockedCount + Math.floor(Math.random() * 5 + 3),
          };
        }
        return tab;
      })
    );

    setIframeKey((k) => k + 1);
    if (onNotify) {
      onNotify(`Kiosk routed to "${finalUrl}" through Sovereign Privacy Shield.`, "info");
    }
  };

  // Back / Forward
  const handleBack = () => {
    if (activeTab && activeTab.historyIndex > 0) {
      const newIdx = activeTab.historyIndex - 1;
      const target = activeTab.history[newIdx];
      updateActiveTab({ url: target, historyIndex: newIdx, title: target.replace(/^https?:\/\//, "").split("/")[0] });
      setInputUrl(target);
      setIframeKey((k) => k + 1);
    }
  };

  const handleForward = () => {
    if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
      const newIdx = activeTab.historyIndex + 1;
      const target = activeTab.history[newIdx];
      updateActiveTab({ url: target, historyIndex: newIdx, title: target.replace(/^https?:\/\//, "").split("/")[0] });
      setInputUrl(target);
      setIframeKey((k) => k + 1);
    }
  };

  const handleReload = () => {
    setIframeKey((k) => k + 1);
  };

  // New Tab
  const handleNewTab = () => {
    const newTab: BrowserTab = {
      id: "tab-" + Date.now(),
      title: "New Private Tab",
      url: "https://duckduckgo.com",
      history: ["https://duckduckgo.com"],
      historyIndex: 0,
      isLoading: false,
      privacyShieldActive: true,
      trackersBlockedCount: 0,
      sandboxed: true,
      isTorMode: true,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl(newTab.url);
  };

  // Close Tab
  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Keep at least one tab
      handleNavigate("https://duckduckgo.com");
      return;
    }
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[0].id);
    }
  };

  // Zero-Telemetry Wipe
  const handleWipeSession = () => {
    setTabs([
      {
        id: "tab-" + Date.now(),
        title: "Clean Slate Sandbox",
        url: "https://duckduckgo.com",
        history: ["https://duckduckgo.com"],
        historyIndex: 0,
        isLoading: false,
        privacyShieldActive: true,
        trackersBlockedCount: 0,
        sandboxed: true,
        isTorMode: true,
      }
    ]);
    setActiveTabId(tabs[0]?.id || "tab-1");
    setInputUrl("https://duckduckgo.com");
    setIframeKey((k) => k + 1);
    if (onNotify) {
      onNotify("⚡ Zero-Telemetry Wipe complete. All cookies, caches, and storage vaporized.", "success");
    }
  };

  const updateActiveTab = (partial: Partial<BrowserTab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, ...partial } : t))
    );
  };

  return (
    <div className="space-y-4">
      {/* Kiosk Header & Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-950/90 border border-red-900/80 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-700 to-blue-900 p-2.5 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className={`text-lg sm:text-xl font-black text-white-crisp ${fontWave ? "font-japan-wave" : ""}`}>
                Sovereign Privacy Kiosk Web Browser
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500">
                ZERO-TELEMETRY OS
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Air-gapped sandboxed cellphone browser with onion routing & anti-fingerprinting
            </p>
          </div>
        </div>

        {/* Kiosk Device Frame Form Factors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-xl border border-neutral-700 text-xs">
            <button
              type="button"
              onClick={() => setDeviceFrame("phone")}
              className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition ${
                deviceFrame === "phone"
                  ? "bg-red-600 text-white font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-white-crisp">Phone Kiosk</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceFrame("tablet")}
              className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition ${
                deviceFrame === "tablet"
                  ? "bg-red-600 text-white font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-white-crisp">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceFrame("desktop")}
              className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition ${
                deviceFrame === "desktop"
                  ? "bg-red-600 text-white font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-white-crisp">Full Window</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPrivacyInspectorOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition ${
              isPrivacyInspectorOpen
                ? "bg-cyan-950 text-cyan-200 border-cyan-400"
                : "bg-neutral-900 text-zinc-300 border-neutral-700 hover:border-cyan-500"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white-crisp">Shield ({activeTab?.trackersBlockedCount || 0})</span>
          </button>

          <button
            type="button"
            onClick={handleWipeSession}
            title="Instant Zero-Telemetry Vaporization (Clears all cookies, history, DOM cache)"
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-rose-950 border border-neutral-700 hover:border-rose-500 text-zinc-300 hover:text-rose-200 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-white-crisp">Wipe Session</span>
          </button>
        </div>
      </div>

      {/* Privacy Shield Inspector Panel */}
      {isPrivacyInspectorOpen && (
        <div className="p-4 rounded-2xl bg-neutral-950 border border-cyan-700/80 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in">
          <div>
            <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              Active Fingerprint Mask
            </div>
            <select
              value={selectedUserAgent}
              onChange={(e) => {
                setSelectedUserAgent(e.target.value);
                if (onNotify) onNotify("User-Agent randomized.", "info");
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white text-xs font-mono"
            >
              {USER_AGENTS.map((ua) => (
                <option key={ua.id} value={ua.id}>
                  {ua.name}
                </option>
              ))}
            </select>
            <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
              {USER_AGENTS.find((u) => u.id === selectedUserAgent)?.val}
            </div>
          </div>

          <div>
            <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              Tor Onion Circuit
            </div>
            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 space-y-1 font-mono text-[11px]">
              <div className="text-emerald-400">✓ Guard Node: [185.220.101.5] (SE)</div>
              <div className="text-cyan-400">✓ Middle Relay: [51.15.23.41] (FR)</div>
              <div className="text-purple-400">✓ Sovereign Exit: [194.26.29.112] (CH)</div>
            </div>
          </div>

          <div>
            <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              Sandboxing & Telemetry
            </div>
            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Third-Party Trackers Blocked:</span>
                <span className="font-bold text-cyan-400">{activeTab?.trackersBlockedCount || 0}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Cookies Sandboxed:</span>
                <span className="font-bold text-emerald-400">Isolated</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>WebRTC IP Leak Protection:</span>
                <span className="font-bold text-emerald-400">Enforced</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Kiosk Simulation Container */}
      <div className="flex justify-center w-full">
        <div
          className={`transition-all duration-300 w-full ${
            deviceFrame === "phone"
              ? "max-w-md"
              : deviceFrame === "tablet"
              ? "max-w-3xl"
              : "max-w-6xl"
          }`}
        >
          {/* Physical Device Frame (Cellphone Bezel) */}
          <div className="relative rounded-[36px] bg-neutral-950 p-3 sm:p-4 border-4 border-red-950 shadow-[0_0_40px_rgba(0,0,0,0.95)] ring-1 ring-red-700/60">
            {/* Phone Top Notch / Speaker Grill */}
            {deviceFrame === "phone" && (
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-12 h-1.5 rounded-full bg-neutral-800" />
                <div className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-500/80" />
                </div>
              </div>
            )}

            {/* Simulated Phone Status Bar */}
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono text-zinc-400 mb-1 select-none">
              <div className="flex items-center space-x-1.5 font-bold text-white">
                <span>07:52</span>
                <span className="px-1 py-0.2 rounded bg-red-900 text-red-200 text-[8px] font-bold">TOR</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <span className="text-[9px]">5G-AIRGAP</span>
                <Wifi className="w-3 h-3 text-cyan-400" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Screen Inner Bezel */}
            <div className="rounded-2xl bg-black border border-neutral-800 overflow-hidden flex flex-col min-h-[560px] shadow-inner">
              {/* Tab Strip */}
              <div className="flex items-center bg-neutral-950 border-b border-neutral-800 overflow-x-auto px-1.5 pt-1.5 gap-1 scrollbar-none">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <div
                      key={tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`group max-w-[180px] shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-t-xl text-xs font-semibold cursor-pointer border-t border-x transition-colors ${
                        isActive
                          ? "bg-neutral-900 text-white border-red-600 shadow"
                          : "bg-neutral-950/60 text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-neutral-900/40"
                      }`}
                    >
                      <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span className="truncate text-white-crisp">{tab.title}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        className="opacity-60 hover:opacity-100 hover:text-red-400 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={handleNewTab}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-neutral-900 cursor-pointer transition"
                  title="Open new private tab"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Browser Navigation Toolbar */}
              <div className="p-2 bg-neutral-900/90 border-b border-neutral-800 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={!activeTab || activeTab.historyIndex <= 0}
                  className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Back"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleForward}
                  disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1}
                  className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Forward"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleReload}
                  className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-neutral-800 cursor-pointer transition"
                  title="Reload"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                {/* URL Address Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNavigate(inputUrl);
                  }}
                  className="flex-1 relative flex items-center"
                >
                  <div className="absolute left-2.5 flex items-center space-x-1 pointer-events-none">
                    <Lock className="w-3 h-3 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Search with DuckDuckGo or enter URL..."
                    className="w-full bg-black border border-neutral-700 rounded-xl pl-7 pr-16 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono selection:bg-red-900"
                  />
                  <div className="absolute right-2 flex items-center space-x-1">
                    <span className="px-1 py-0.2 rounded bg-neutral-900 border border-neutral-700 text-[9px] font-mono text-cyan-400">
                      SECURE
                    </span>
                  </div>
                </form>

                <button
                  type="button"
                  onClick={() => handleNavigate("https://duckduckgo.com")}
                  className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-neutral-800 cursor-pointer transition"
                  title="Kiosk Home"
                >
                  <Home className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bookmarks Bar */}
              <div className="px-2 py-1 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
                <Bookmark className="w-3 h-3 text-amber-400 shrink-0" />
                {DEFAULT_BOOKMARKS.map((bm) => (
                  <button
                    key={bm.title}
                    type="button"
                    onClick={() => handleNavigate(bm.url)}
                    className="px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-neutral-800 hover:border-red-800 shrink-0 flex items-center space-x-1 cursor-pointer transition"
                  >
                    <span>{bm.icon}</span>
                    <span className="text-white-crisp">{bm.title}</span>
                  </button>
                ))}
              </div>

              {/* Browser Viewport (Safe Sandbox) */}
              <div className="flex-1 bg-neutral-950 relative min-h-[440px] flex flex-col">
                {activeTab?.url ? (
                  <iframe
                    key={iframeKey}
                    src={activeTab.url}
                    title="Kiosk Sovereign Web View"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    referrerPolicy="no-referrer"
                    className="w-full flex-1 border-0 min-h-[460px] bg-white text-black"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Globe className="w-12 h-12 text-cyan-500 animate-pulse" />
                    <h3 className="text-base font-bold text-white-crisp">
                      Sovereign Air-Gapped Kiosk
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-sm">
                      Type a URL or search query in the address bar above to browse with zero telemetry.
                    </p>
                  </div>
                )}
              </div>

              {/* Phone Physical Home Indicator Bar */}
              {deviceFrame === "phone" && (
                <div className="py-2 flex justify-center bg-black">
                  <div className="w-28 h-1 rounded-full bg-neutral-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
