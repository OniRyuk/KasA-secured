import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";
import { 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Radio, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Zap, 
  Terminal, 
  Code, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Share2,
  Signal,
  QrCode,
  Maximize2
} from "lucide-react";
import { WifiStatus, NearbyWifiNetwork, LocalSubnetModel, ApkConfig } from "../types";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { KasaButton } from "./KasaButton";
import { ApkQrModal } from "./ApkQrModal";

interface WifiStandaloneAndApkHubProps {
  onNotify?: (message: string, type?: "success" | "info" | "warning") => void;
  onRefreshAuditLogs?: () => void;
}

export const WifiStandaloneAndApkHub: React.FC<WifiStandaloneAndApkHubProps> = ({
  onNotify,
  onRefreshAuditLogs
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Wi-Fi State
  const [wifiStatus, setWifiStatus] = useState<WifiStatus | null>(null);
  const [isLoadingWifi, setIsLoadingWifi] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyNetworks, setNearbyNetworks] = useState<NearbyWifiNetwork[]>([]);
  const [isAttaching, setIsAttaching] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NearbyWifiNetwork | null>(null);
  const [attachForm, setAttachForm] = useState({
    ssid: "",
    passphrase: "",
    security: "WPA2/WPA3-Personal",
    staticIp: ""
  });

  // Local Model State
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [newModelForm, setNewModelForm] = useState({
    name: "",
    endpoint: "http://192.168.1.120:11434",
    type: "ollama" as "ollama" | "lmstudio" | "vllm" | "local_ai"
  });

  // APK Builder State
  const [apkConfig, setApkConfig] = useState<ApkConfig>({
    packageName: "com.kasa.catalyst",
    appName: "KasA - Personal Ai Catalyst",
    versionName: "1.0.0",
    versionCode: 100,
    targetSdk: 34,
    minSdk: 24,
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.ACCESS_WIFI_STATE",
      "android.permission.CHANGE_WIFI_STATE",
      "android.permission.NEARBY_WIFI_DEVICES"
    ],
    orientation: "auto",
    offlineMode: "cached_first"
  });

  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<string>("AndroidManifest.xml");
  const [isGeneratingApk, setIsGeneratingApk] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Copy helpers
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);

  // QR Code Canvas
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const apkQrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showApkQrModal, setShowApkQrModal] = useState(false);
  const [copiedApkUrl, setCopiedApkUrl] = useState(false);

  const apkDownloadUrl = typeof window !== "undefined"
    ? `${window.location.origin}/download/KasA.apk`
    : "/download/KasA.apk";

  // Load Wi-Fi Status & APK Config on mount
  const fetchWifiStatus = async () => {
    try {
      const res = await fetch("/api/wifi/status");
      if (res.ok) {
        const data: WifiStatus = await res.json();
        setWifiStatus(data);
      }
    } catch (err) {
      console.error("Error fetching Wi-Fi status:", err);
    } finally {
      setIsLoadingWifi(false);
    }
  };

  const fetchApkConfig = async () => {
    try {
      const res = await fetch("/api/apk/config");
      if (res.ok) {
        const data = await res.json();
        if (data.config) setApkConfig(data.config);
      }
    } catch (err) {
      console.error("Error fetching APK config:", err);
    }
  };

  useEffect(() => {
    fetchWifiStatus();
    fetchApkConfig();
    generateApkProjectSources();
  }, []);

  // Update QR Code when hostUrl changes
  useEffect(() => {
    const url = wifiStatus?.localHostUrl || window.location.origin;
    if (qrCanvasRef.current && url) {
      QRCode.toCanvas(qrCanvasRef.current, url, {
        width: 170,
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff"
        }
      }, (err) => {
        if (err) console.error("QR Code render error:", err);
      });
    }
  }, [wifiStatus?.localHostUrl]);

  // Update APK Download QR Code
  useEffect(() => {
    if (apkQrCanvasRef.current && apkDownloadUrl) {
      QRCode.toCanvas(apkQrCanvasRef.current, apkDownloadUrl, {
        width: 180,
        margin: 1.5,
        color: {
          dark: "#050507",
          light: "#ffffff"
        },
        errorCorrectionLevel: "M"
      }, (err) => {
        if (err) console.error("APK QR Code render error:", err);
      });
    }
  }, [apkDownloadUrl]);

  // Scan Nearby Wi-Fi
  const handleScanWifi = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/wifi/scan");
      if (res.ok) {
        const data = await res.json();
        setNearbyNetworks(data.networks || []);
        onNotify?.(`Found ${data.networks?.length || 0} Wi-Fi networks in range.`, "info");
      }
    } catch (err) {
      onNotify?.("Failed to scan Wi-Fi networks.", "warning");
    } finally {
      setIsScanning(false);
    }
  };

  // Open attach dialog
  const handleSelectNetworkToAttach = (net: NearbyWifiNetwork) => {
    setSelectedNetwork(net);
    setAttachForm({
      ssid: net.ssid,
      passphrase: "",
      security: net.security,
      staticIp: ""
    });
    setShowAttachModal(true);
  };

  // Attach to Wi-Fi
  const handleAttachWifi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachForm.ssid) return;

    setIsAttaching(true);
    try {
      const res = await fetch("/api/wifi/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attachForm)
      });

      if (res.ok) {
        const data = await res.json();
        setWifiStatus(data.wifiStatus);
        setShowAttachModal(false);
        onNotify?.(data.message || `Attached to Wi-Fi: ${attachForm.ssid}`, "success");
        onRefreshAuditLogs?.();
      } else {
        const errData = await res.json();
        onNotify?.(errData.error || "Failed to attach to Wi-Fi.", "warning");
      }
    } catch (err: any) {
      onNotify?.(`Wi-Fi attachment failed: ${err.message}`, "warning");
    } finally {
      setIsAttaching(false);
    }
  };

  // Toggle Mode (Client Station vs Standalone AP)
  const handleToggleMode = async () => {
    try {
      const res = await fetch("/api/wifi/toggle-mode", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setWifiStatus(data.wifiStatus);
        const modeLabel = data.nodeMode === "standalone_ap" ? "Standalone Access Point (AP)" : "Client Wi-Fi Station (STA)";
        onNotify?.(`Switched Wi-Fi node mode to ${modeLabel}`, "success");
        onRefreshAuditLogs?.();
      }
    } catch (err) {
      onNotify?.("Failed to switch node mode.", "warning");
    }
  };

  // Register Local Model on Wi-Fi Subnet
  const handleAddLocalModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelForm.name || !newModelForm.endpoint) return;

    try {
      const res = await fetch("/api/wifi/register-local-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModelForm)
      });
      if (res.ok) {
        const data = await res.json();
        if (wifiStatus) {
          setWifiStatus({
            ...wifiStatus,
            localModelsOnSubnet: [...wifiStatus.localModelsOnSubnet, data.model]
          });
        }
        setShowAddModelModal(false);
        setNewModelForm({ name: "", endpoint: "http://192.168.1.120:11434", type: "ollama" });
        onNotify?.(`Linked local Wi-Fi model: "${data.model.name}"`, "success");
        onRefreshAuditLogs?.();
      }
    } catch (err) {
      onNotify?.("Failed to register local model.", "warning");
    }
  };

  // Generate APK Project Sources
  const generateApkProjectSources = async (customConfig?: ApkConfig) => {
    setIsGeneratingApk(true);
    try {
      const res = await fetch("/api/apk/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customConfig || apkConfig)
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedFiles(data.files || null);
      }
    } catch (err) {
      console.error("Error generating APK project sources:", err);
    } finally {
      setIsGeneratingApk(false);
    }
  };

  // Update APK Config
  const handleSaveApkConfig = async (newConfig: ApkConfig) => {
    setApkConfig(newConfig);
    try {
      await fetch("/api/apk/update-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig)
      });
      generateApkProjectSources(newConfig);
      onNotify?.("Updated APK Build configuration.", "success");
    } catch {
      // silent
    }
  };

  // Download Complete Android APK Project (.zip)
  const handleDownloadZip = async () => {
    if (!generatedFiles) return;
    setIsDownloadingZip(true);

    try {
      const zip = new JSZip();
      const folderName = apkConfig.appName.toLowerCase().replace(/\s+/g, "-");
      const root = zip.folder(folderName) || zip;

      // Add Manifest
      root.file("app/src/main/AndroidManifest.xml", generatedFiles["AndroidManifest.xml"]);
      // Add MainActivity
      const pkgPath = generatedFiles["packagePath"] || "com/creatorscrucible/gptapp";
      root.file(`app/src/main/java/${pkgPath}/MainActivity.kt`, generatedFiles["MainActivity.kt"]);
      // Add build.gradle
      root.file("app/build.gradle", generatedFiles["build.gradle"]);
      // Add build-apk.sh
      root.file("build-apk.sh", generatedFiles["build-apk.sh"]);
      // Add settings.gradle
      root.file("settings.gradle", `rootProject.name = "${apkConfig.appName}"\ninclude ':app'\n`);
      // Add gradle.properties
      root.file("gradle.properties", `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nandroid.enableJetifier=true\n`);
      
      // Add README
      root.file("README.md", `# ${apkConfig.appName} - Standalone Android APK Project

This project compiles a native Android APK wrapped with an optimized WebView,
Wi-Fi auto-discovery, and offline service worker caching.

## Quick Build Instructions:
1. Open this folder in **Android Studio** (Flamingo, Hedgehog, or newer).
2. Or build via command line:
   \`\`\`bash
   chmod +x gradlew build-apk.sh
   ./gradlew assembleRelease
   \`\`\`
3. Locate compiled APK at:
   \`app/build/outputs/apk/release/app-release.apk\`

## Wireless ADB Deployment over Wi-Fi:
\`\`\`bash
adb connect <phone-ip-on-wifi>:5555
adb install -r app/build/outputs/apk/release/app-release.apk
\`\`\`
`);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${apkConfig.packageName}-android-project.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onNotify?.("Downloaded Android APK build project bundle (.zip)!", "success");
    } catch (err: any) {
      onNotify?.(`Failed to generate ZIP: ${err.message}`, "warning");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleCopyHostUrl = () => {
    if (wifiStatus?.localHostUrl) {
      navigator.clipboard.writeText(wifiStatus.localHostUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleCopyActiveCode = () => {
    if (generatedFiles && generatedFiles[activeCodeTab]) {
      navigator.clipboard.writeText(generatedFiles[activeCodeTab]);
      setCopiedCodeSnippet(true);
      setTimeout(() => setCopiedCodeSnippet(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner: Standalone Wi-Fi Node & APK Control Center */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 text-xs font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Standalone Portable Node Active
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs font-semibold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                Android APK & WebAPK Ready
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Wi-Fi Subnet Attachment & Standalone APK Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Attach ChatGPT Regression Suite to any Wi-Fi network (home, studio, phone tether, or air-gapped lab) or broadcast as an autonomous hotspot. Run deterministic regression evaluations and multi-caliber prompt forms locally across any device on that Wi-Fi with zero external dependencies.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isInstallable && (
              <button
                onClick={() => install()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install Android WebAPK</span>
              </button>
            )}

            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip || !generatedFiles}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              title="Download Android Studio / Gradle Project Bundle"
            >
              <Download className={`w-4 h-4 ${isDownloadingZip ? "animate-bounce" : ""}`} />
              <span>{isDownloadingZip ? "Packaging..." : "Download APK Project (.zip)"}</span>
            </button>

            <button
              onClick={handleToggleMode}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
              title="Toggle between Wi-Fi Client Station and Standalone AP Hotspot"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Mode: {wifiStatus?.nodeMode === "standalone_ap" ? "Hotspot (AP)" : "Client (STA)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Wi-Fi Attachment & Local Network Broadcaster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Wi-Fi Network & Subnet Monitor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Wi-Fi Connection Card */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-100">
                      {wifiStatus?.nodeMode === "standalone_ap" ? "Standalone Hotspot Mode (AP)" : `Attached: ${wifiStatus?.ssid || "Discovering Wi-Fi..."}`}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    BSSID: {wifiStatus?.bssid || "00:00:00:00:00:00"} • Security: {wifiStatus?.security || "WPA3-Personal"}
                  </p>
                </div>
              </div>

              {/* Wi-Fi Switch Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleScanWifi}
                  disabled={isScanning}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-cyan-400" : ""}`} />
                  <span>Scan Networks</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedNetwork(null);
                    setAttachForm({ ssid: "", passphrase: "", security: "WPA2/WPA3-Personal", staticIp: "" });
                    setShowAttachModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Attach to Wi-Fi</span>
                </button>
              </div>
            </div>

            {/* Network Subnet Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Assigned Subnet IP</span>
                <p className="font-mono text-xs font-bold text-cyan-300">{wifiStatus?.ipAddress || "192.168.1.145"}</p>
                <span className="text-[10px] text-slate-500 font-mono">Port: 3000 (Open)</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gateway / Router</span>
                <p className="font-mono text-xs font-bold text-slate-200">{wifiStatus?.gateway || "192.168.1.1"}</p>
                <span className="text-[10px] text-slate-500 font-mono">Mask: {wifiStatus?.subnetMask || "255.255.255.0"}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Signal & Quality</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5 text-emerald-400" />
                  <p className="text-xs font-bold text-emerald-300">{wifiStatus?.signalPercent || 96}% ({wifiStatus?.signalDbm || -44} dBm)</p>
                </div>
                <span className="text-[10px] text-slate-500">{wifiStatus?.frequency || "5.0 GHz"}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Operating Mode</span>
                <p className="text-xs font-bold text-purple-300">
                  {wifiStatus?.nodeMode === "standalone_ap" ? "Autonomous AP" : "Client Station (STA)"}
                </p>
                <span className="text-[10px] text-slate-500">
                  {wifiStatus?.nodeMode === "standalone_ap" ? "SSID: " + wifiStatus.apSsid : "Zero-WAN Offline Ready"}
                </span>
              </div>
            </div>

            {/* Direct Local Wi-Fi Subnet Access Banner */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-300">Local Wi-Fi Endpoint: </span>
                  <span className="font-mono font-bold text-indigo-300 select-all">{wifiStatus?.localHostUrl || "http://192.168.1.145:3000"}</span>
                  <p className="text-[11px] text-slate-400">Any laptop, phone, or tablet on this Wi-Fi can connect directly via this URL.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyHostUrl}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800/60 text-indigo-200 text-xs font-medium border border-indigo-700/50 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? "Copied" : "Copy Link"}</span>
                </button>

                <a
                  href={wifiStatus?.localHostUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
              </div>
            </div>

            {/* Scanned Wi-Fi Networks in Range */}
            {nearbyNetworks.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Nearby Scanned Networks</h4>
                  <span className="text-[11px] text-slate-500">Click any network to attach</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {nearbyNetworks.map((net) => (
                    <div
                      key={net.ssid}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer ${
                        wifiStatus?.ssid === net.ssid
                          ? "bg-cyan-950/40 border-cyan-800/80 text-cyan-200"
                          : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-800 text-slate-300"
                      }`}
                      onClick={() => handleSelectNetworkToAttach(net)}
                    >
                      <div className="flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <span className="font-medium">{net.ssid}</span>
                          <span className="text-[10px] text-slate-500 ml-2">({net.frequency})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                          {net.security}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">{net.signalDbm} dBm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Local Subnet Models (Zero-Cloud Wi-Fi Execution) */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span>Wi-Fi Subnet LLM Nodes (Ollama, LM Studio, LocalAI)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Enables 100% offline regression testing & prompt crafting by discovering models on the same Wi-Fi.
                </p>
              </div>

              <button
                onClick={() => setShowAddModelModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800/60 border border-purple-700/60 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-purple-300" />
                <span>Link Local Model</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wifiStatus?.localModelsOnSubnet.map((model) => (
                <div
                  key={model.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-200">{model.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                        ONLINE
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-purple-300">{model.endpoint}</p>
                    <span className="text-[10px] text-slate-500">Latency: {model.latencyMs}ms • Wi-Fi LAN Peer</span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-900 text-slate-400 border border-slate-800">
                    {model.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Wi-Fi QR Code Broadcaster & Android WebAPK Launcher */}
        <div className="space-y-6">
          {/* QR Code Broadcaster Card */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-center flex flex-col items-center">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-slate-100 flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Wi-Fi Quick Connect QR</span>
              </h3>
              <p className="text-xs text-slate-400">
                Point any phone camera on this Wi-Fi to open the Crucible instantly.
              </p>
            </div>

            {/* QR Code Canvas */}
            <div className="p-3 rounded-2xl bg-white shadow-xl flex items-center justify-center">
              <canvas ref={qrCanvasRef} className="rounded-lg" />
            </div>

            <div className="w-full space-y-2">
              <div className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 truncate select-all border border-slate-800">
                {wifiStatus?.localHostUrl || "http://192.168.1.145:3000"}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyHostUrl}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? "Copied" : "Copy URL"}</span>
                </button>

                {isInstallable ? (
                  <button
                    onClick={() => install()}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Install APK</span>
                  </button>
                ) : isInstalled ? (
                  <div className="w-full py-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Installed</span>
                  </div>
                ) : (
                  <div className="w-full py-2 bg-slate-800/40 text-slate-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                    <span>WebAPK Ready</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Standalone Node Specifications */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Portable Standalone Commands</span>
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-400">Launch standalone Wi-Fi server script on any device:</p>
              <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800 flex items-center justify-between">
                <span>node standalone-wifi-server.mjs</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("node standalone-wifi-server.mjs");
                    onNotify?.("Copied command to clipboard!", "info");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Auto-detects active LAN subnets, binds to 0.0.0.0, and broadcasts the crucible across all connected clients.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Android APK Project Builder & Code Inspector */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-red-900/50 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">
                Android Standalone APK & Local Autonomous Engine
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Direct, single-package local APK with zero extra files. Pre-loaded with KasA offline neural catalyst, Wi-Fi mesh watcher, and full device independence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Direct Standalone APK Button */}
            <KasaButton
              variant="primary"
              size="md"
              shine={true}
              href="/api/apk/download-direct-apk"
              download="KasA-Sovereign-v1.0.apk"
              icon={<Download className="w-4 h-4" />}
              className="shadow-xl"
            >
              <span className="font-bold">Download KasA.apk (Single File)</span>
            </KasaButton>

            {/* Android Project ZIP */}
            <KasaButton
              variant="secondary"
              size="md"
              shine={true}
              onClick={handleDownloadZip}
              disabled={isDownloadingZip || !generatedFiles}
              icon={<Code className="w-4 h-4 text-zinc-300" />}
            >
              <span>{isDownloadingZip ? "Packaging..." : "Android Studio Project (.zip)"}</span>
            </KasaButton>
          </div>
        </div>

        {/* Standalone APK Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/50 via-zinc-950 to-neutral-950 border border-red-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Single Standalone APK Ready For Immediate Local Use
            </span>
            <p className="text-zinc-300 leading-relaxed">
              Tapping <strong>"Download KasA.apk"</strong> downloads the entire application as a single APK package. 
              No zip extraction, no build terminals, and no extra configuration files. Designed specifically for local autonomous execution on Samsung Galaxy and Android devices.
            </p>
          </div>
          <a
            href="/api/apk/download-direct-apk"
            download="KasA-Sovereign-v1.0.apk"
            className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg font-bold whitespace-nowrap text-xs transition border border-red-400/50 shadow-md shadow-red-950/80 cursor-pointer shrink-0"
          >
            Direct .APK Download
          </a>
        </div>

        {/* Standalone APK QR Code Scanner Card */}
        <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-red-800/80 shadow-2xl flex flex-col md:flex-row items-center gap-6">
          {/* QR Code Canvas with Red Border Frame */}
          <div className="relative p-2.5 bg-white rounded-xl shadow-lg border-2 border-red-600 shrink-0 group">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-red-500" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-red-500" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-red-500" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-red-500" />
            <canvas ref={apkQrCanvasRef} className="rounded block" style={{ width: "180px", height: "180px" }} />
          </div>

          {/* Description and Quick Actions */}
          <div className="flex-1 space-y-3 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-950/90 text-red-400 border border-red-800/80 text-[10px] font-mono uppercase tracking-wider font-bold">
                  Quick Mobile Scan
                </span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-zinc-400 text-xs font-mono">KasA-Sovereign-v1.0.apk</span>
              </div>
              <h4 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <QrCode className="w-5 h-5 text-red-500" />
                <span>Scan with your Phone Camera to Download KasA.apk</span>
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Open your Samsung Galaxy S10e or Android camera app and point it at the QR code. Your phone will immediately detect the download link and prompt you to download the single standalone APK package.
              </p>
            </div>

            {/* URL Display and Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowApkQrModal(true)}
                className="px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-red-700/80 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                <span>Enlarge QR Code</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(apkDownloadUrl);
                    setCopiedApkUrl(true);
                    setTimeout(() => setCopiedApkUrl(false), 2500);
                  } catch {}
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedApkUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Download Link</span>
                  </>
                )}
              </button>

              <a
                href={apkDownloadUrl}
                download="KasA-Sovereign-v1.0.apk"
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-red-950/80 ml-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Direct Download (.apk)</span>
              </a>
            </div>
          </div>
        </div>

        {/* APK Customization Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Package ID</label>
            <input
              type="text"
              value={apkConfig.packageName}
              onChange={(e) => handleSaveApkConfig({ ...apkConfig, packageName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-[11px] focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">App Name</label>
            <input
              type="text"
              value={apkConfig.appName}
              onChange={(e) => handleSaveApkConfig({ ...apkConfig, appName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Version Name</label>
            <input
              type="text"
              value={apkConfig.versionName}
              onChange={(e) => handleSaveApkConfig({ ...apkConfig, versionName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Target SDK</label>
            <select
              value={apkConfig.targetSdk}
              onChange={(e) => handleSaveApkConfig({ ...apkConfig, targetSdk: parseInt(e.target.value, 10) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="34">API 34 (Android 14)</option>
              <option value="33">API 33 (Android 13)</option>
              <option value="32">API 32 (Android 12L)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Orientation</label>
            <select
              value={apkConfig.orientation}
              onChange={(e) => handleSaveApkConfig({ ...apkConfig, orientation: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="auto">Auto-Rotate</option>
              <option value="portrait">Portrait Lock</option>
              <option value="landscape">Landscape Lock</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Offline Caching</label>
            <select
              value={apkConfig.offlineMode}
              onChange={(e) => handleSaveApkConfig({ ...apkConfig, offlineMode: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="cached_first">Cached First (Hybrid)</option>
              <option value="full_autonomous">Full Autonomous</option>
              <option value="network_only">Network Only</option>
            </select>
          </div>
        </div>

        {/* Code Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800">
            <div className="flex space-x-2">
              {["AndroidManifest.xml", "MainActivity.kt", "build.gradle", "build-apk.sh"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`py-2 px-3 text-xs font-mono border-b-2 transition cursor-pointer ${
                    activeCodeTab === tab
                      ? "border-indigo-500 text-indigo-400 font-semibold"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyActiveCode}
              className="py-1 px-2.5 mb-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              {copiedCodeSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCodeSnippet ? "Copied" : "Copy Source"}</span>
            </button>
          </div>

          {/* Code Viewer Container */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto overflow-x-auto selection:bg-indigo-500/30">
            <pre className="whitespace-pre">
              {generatedFiles ? generatedFiles[activeCodeTab] : "Generating APK sources..."}
            </pre>
          </div>
        </div>

        {/* ADB Wireless Wi-Fi Deployment Instructions */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Wireless ADB Wi-Fi Deployment (Push directly to phone)</span>
          </h4>
          <p className="text-xs text-slate-400">
            Deploy your APK directly over Wi-Fi without needing a USB cable:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800/80 space-y-1">
            <p className="text-slate-500"># 1. Enable Wireless Debugging on your Android Phone (Developer Options &gt; Wireless Debugging)</p>
            <p className="text-cyan-300">adb connect 192.168.1.185:5555</p>
            <p className="text-slate-500"># 2. Flash and launch the compiled APK over Wi-Fi</p>
            <p className="text-emerald-300">adb install -r app-release.apk</p>
          </div>
        </div>
      </div>

      {/* Attach Wi-Fi Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-sm">Attach Node to Wi-Fi</h3>
              </div>
              <button
                onClick={() => setShowAttachModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAttachWifi} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Wi-Fi Network (SSID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio_Mesh_5G or MyPhone_Hotspot"
                  value={attachForm.ssid}
                  onChange={(e) => setAttachForm({ ...attachForm, ssid: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Passphrase / Password (leave empty for Open)</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={attachForm.passphrase}
                  onChange={(e) => setAttachForm({ ...attachForm, passphrase: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Security Protocol</label>
                  <select
                    value={attachForm.security}
                    onChange={(e) => setAttachForm({ ...attachForm, security: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="WPA2/WPA3-Personal">WPA2 / WPA3 Personal</option>
                    <option value="WPA2-PSK">WPA2 PSK</option>
                    <option value="Open">Open (No Security)</option>
                    <option value="Enterprise 802.1X">Enterprise 802.1X</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Static IP (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.200"
                    value={attachForm.staticIp}
                    onChange={(e) => setAttachForm({ ...attachForm, staticIp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono text-[11px] focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-[11px] leading-relaxed">
                Attaching will bind the server to the new Wi-Fi subnet IP and generate a fresh local QR code so all devices on that Wi-Fi can join.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAttachModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAttaching}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAttaching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isAttaching ? "Attaching..." : "Attach & Bind"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Local Model Modal */}
      {showAddModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-sm">Link Wi-Fi Subnet Model</h3>
              </div>
              <button
                onClick={() => setShowAddModelModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLocalModel} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Model Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ollama Llama-3.2 3B Lab Node"
                  value={newModelForm.name}
                  onChange={(e) => setNewModelForm({ ...newModelForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">LAN Subnet Endpoint URL</label>
                <input
                  type="text"
                  required
                  placeholder="http://192.168.1.120:11434"
                  value={newModelForm.endpoint}
                  onChange={(e) => setNewModelForm({ ...newModelForm, endpoint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono text-[11px] focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Engine Type</label>
                <select
                  value={newModelForm.type}
                  onChange={(e) => setNewModelForm({ ...newModelForm, type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="ollama">Ollama (Port 11434)</option>
                  <option value="lmstudio">LM Studio (Port 1234)</option>
                  <option value="vllm">vLLM Server (Port 8000)</option>
                  <option value="local_ai">LocalAI (Port 8080)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModelModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Register Model</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APK QR Code Enlarge Modal */}
      <ApkQrModal
        isOpen={showApkQrModal}
        onClose={() => setShowApkQrModal(false)}
      />
    </div>
  );
};
