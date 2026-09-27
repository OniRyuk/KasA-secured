/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { RegressionSuite } from "./components/RegressionSuite";
import { PromptStudio } from "./components/PromptStudio";
import { InstancesAndWebhooks } from "./components/InstancesAndWebhooks";
import { AuditLogsView } from "./components/AuditLogsView";
import { WifiStandaloneAndApkHub } from "./components/WifiStandaloneAndApkHub";
import { KasaCreationHub } from "./components/KasaCreationHub";
import { PersonalGPTFramework } from "./components/PersonalGPTFramework";
import { LegalAgreementView } from "./components/LegalAgreementView";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { SecurityLockScreen } from "./components/SecurityLockScreen";
import { BiometricKeyfobModal } from "./components/BiometricKeyfobModal";
import { TamperPatchModal } from "./components/TamperPatchModal";
import { ThemeCustomizerModal, defaultThemeSettings } from "./components/ThemeCustomizerModal";
import { ApkQrModal } from "./components/ApkQrModal";
import { KatanaBladeSlice } from "./components/KatanaBladeSlice";
import { LinuxTerminalScreen } from "./components/LinuxTerminalScreen";
import { KoiPondTile } from "./components/KoiPondTile";
import { KasaThemedKeyboard } from "./components/KasaThemedKeyboard";
import { KasaDockTray } from "./components/KasaDockTray";
import { SheathedKatanaScrollDropdown } from "./components/SheathedKatanaScrollDropdown";
import { SovereignFileVault } from "./components/SovereignFileVault";
import { PrivacyKioskBrowser } from "./components/PrivacyKioskBrowser";
import { KatanaArsenalScreen } from "./components/KatanaArsenalScreen";
import { UserProfileSidebar } from "./components/UserProfileSidebar";
import { CreatorSafeSanctuary } from "./components/CreatorSafeSanctuary";
import { CreatorPrivacyBlindScreen } from "./components/CreatorPrivacyBlindScreen";
import { ChromiumOSKioskModal } from "./components/ChromiumOSKioskModal";
import { FirewallQuarantineScreen } from "./components/FirewallQuarantineScreen";
import { SWORDS_ARSENAL } from "./data/swordsData";
import { usePWAInstall } from "./hooks/usePWAInstall";
import { 
  UserRole, 
  RegressionScenario, 
  ModelInstance, 
  WebhookConfig, 
  AuditLogEntry, 
  SessionStatus, 
  TestExecutionResult,
  SecurityLockStatus,
  VisualThemeSettings,
  PrivacyBlindConfig
} from "./types";
import { AlertCircle, CheckCircle2, RotateCw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("kasa");
  const [currentRole, setCurrentRole] = useState<UserRole>("creator");
  const [activeIcon, setActiveIcon] = useState<"katana" | "android">("katana");
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [isApkQrModalOpen, setIsApkQrModalOpen] = useState(false);
  const [isChromiumOSModalOpen, setIsChromiumOSModalOpen] = useState(false);
  const [isSlicing, setIsSlicing] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isKioskFullscreen, toggleKioskFullscreen } = usePWAInstall();

  // Creator Privacy Blind Configuration
  const [privacyBlindConfig, setPrivacyBlindConfig] = useState<PrivacyBlindConfig>(() => {
    try {
      const saved = localStorage.getItem("kasa_privacy_blind");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isActive: false,
      mode: "blackout",
      autoBlindOnIdleMinutes: 5,
      watermarkEnabled: true,
      pinRequired: false,
      pinCode: "1234",
      antiShoulderSurfingActive: true,
      disableRightClick: false
    };
  });

  // Global hotkey listener for Privacy Blind (Alt + P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        setPrivacyBlindConfig((prev) => ({ ...prev, isActive: !prev.isActive }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [activeSwordId, setActiveSwordId] = useState<string>(() => {
    try {
      return localStorage.getItem("kasa_active_sword") || "muramasa";
    } catch {
      return "muramasa";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kasa_active_sword", activeSwordId);
    } catch {
      // ignore
    }
  }, [activeSwordId]);

  const triggerSlice = () => {
    setIsSlicing(true);
  };

  // Visual Theme Settings (Persisted to localStorage)
  const [themeSettings, setThemeSettings] = useState<VisualThemeSettings>(() => {
    try {
      const saved = localStorage.getItem("kasa_theme_settings");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultThemeSettings;
  });

  // Core Data
  const [scenarios, setScenarios] = useState<RegressionScenario[]>([]);
  const [instances, setInstances] = useState<ModelInstance[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [securityStatus, setSecurityStatus] = useState<SecurityLockStatus | null>(null);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  // Loading and State Flags
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [isRecycling, setIsRecycling] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

  const showNotification = (message: string, type: "success" | "info" | "warning" = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Fetch initial data
  const loadAllData = async () => {
    try {
      const [scenRes, instRes, whRes, logsRes, sessRes, secRes] = await Promise.all([
        fetch("/api/regression/scenarios"),
        fetch("/api/instances"),
        fetch("/api/webhooks"),
        fetch("/api/audit-logs"),
        fetch("/api/session/status"),
        fetch("/api/auth/security-status")
      ]);

      if (scenRes.ok) {
        const data = await scenRes.json();
        setScenarios(data.scenarios || []);
      }
      if (instRes.ok) {
        const data = await instRes.json();
        setInstances(data.instances || []);
      }
      if (whRes.ok) {
        const data = await whRes.json();
        setWebhooks(data.webhooks || []);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setAuditLogs(data.logs || []);
      }
      if (sessRes.ok) {
        const data = await sessRes.json();
        setSessionStatus(data);
      }
      if (secRes.ok) {
        const data = await secRes.json();
        setSecurityStatus(data);
      }
    } catch (err) {
      console.error("Error loading application state:", err);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  const handleLockSuite = async () => {
    try {
      const res = await fetch("/api/auth/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Manual lock engaged by user",
          actor: `${currentRole}@regression.app`
        })
      });
      const data = await res.json();
      if (data.securityStatus) {
        setSecurityStatus(data.securityStatus);
      }
      showNotification("Security perimeter locked. Biometric or keyfob required to resume.", "warning");
      loadAllData();
    } catch (err: any) {
      showNotification("Failed to lock suite: " + err.message, "warning");
    }
  };

  const handleQuarantine = async () => {
    try {
      const res = await fetch("/api/auth/quarantine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Intrusion detected. Quarantine firewall engaged.",
          actor: `${currentRole}@regression.app`
        })
      });
      const data = await res.json();
      if (data.securityStatus) {
        setSecurityStatus(data.securityStatus);
      }
      showNotification("Firewall Quarantine Activated. All traffic dropped.", "warning");
      loadAllData();
    } catch (err: any) {
      showNotification("Failed to engage quarantine: " + err.message, "warning");
    }
  };

  const handleLiftQuarantine = async () => {
    try {
      const res = await fetch("/api/auth/lift-quarantine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor: "scott_gushea_architect"
        })
      });
      const data = await res.json();
      if (data.securityStatus) {
        setSecurityStatus(data.securityStatus);
      }
      showNotification("Quarantine lifted by Sovereign Override.", "success");
      loadAllData();
    } catch (err: any) {
      showNotification("Failed to lift quarantine: " + err.message, "warning");
    }
  };

  useEffect(() => {
    loadAllData();
    // Poll session status periodically
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/session/status");
        if (res.ok) {
          const data = await res.json();
          setSessionStatus(data);
        }
      } catch (err) {
        // silent poll error
      }
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Run single regression scenario
  const handleRunTest = async (
    scenarioId: string, 
    instanceId: string, 
    customSystemPrompt?: string, 
    customPrompt?: string
  ): Promise<TestExecutionResult | null> => {
    try {
      const res = await fetch("/api/regression/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          instanceId,
          customSystemPrompt,
          customPrompt,
          actor: `${currentRole}@regression.app`
        })
      });

      if (!res.ok) throw new Error("Failed to execute test");
      const result: TestExecutionResult = await res.json();

      // Update local scenario status
      setScenarios((prev) =>
        prev.map((s) => (s.id === scenarioId ? { ...s, status: result.status, lastScore: result.score } : s))
      );

      // Refresh audit logs
      refreshAuditLogs();

      showNotification(`Completed test run on ${result.instance}: ${result.status.toUpperCase()} (${result.score}%)`, result.status === "passed" ? "success" : "warning");
      return result;
    } catch (err: any) {
      showNotification(`Test execution failed: ${err.message}`, "warning");
      return null;
    }
  };

  // Run full batch regression suite
  const handleRunBatch = async (instanceId: string) => {
    if (isRunningBatch) return;
    setIsRunningBatch(true);
    showNotification("Executing full automated regression suite in sequence...", "info");

    try {
      let passedCount = 0;
      for (const scenario of scenarios) {
        await handleRunTest(scenario.id, instanceId);
        // Small pause between runs for realistic pacing
        await new Promise((r) => setTimeout(r, 400));
      }
      showNotification("Batch regression run complete across all scenarios!", "success");
    } finally {
      setIsRunningBatch(false);
    }
  };

  // Generate new scenario from symptoms & descriptors
  const handleGenerateFromSymptoms = async (
    symptoms: string, 
    descriptors: string, 
    category: string, 
    targetModel: string
  ): Promise<RegressionScenario | null> => {
    setIsGeneratingScenario(true);
    try {
      const res = await fetch("/api/regression/generate-from-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          descriptors,
          category,
          targetModel,
          actor: `${currentRole}@regression.app`
        })
      });

      if (!res.ok) throw new Error("Failed to synthesize scenario");
      const data = await res.json();
      if (data?.scenario) {
        setScenarios((prev) => [data.scenario, ...prev]);
        refreshAuditLogs();
        showNotification(`Synthesized new regression test: "${data.scenario.title}"`, "success");
        return data.scenario;
      }
      return null;
    } catch (err: any) {
      showNotification(`Symptom synthesis failed: ${err.message}`, "warning");
      return null;
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  // IP Recycling & Rolling Code refresh
  const handleRecycleIp = async () => {
    setIsRecycling(true);
    try {
      const res = await fetch("/api/session/recycle-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "User triggered seamless IP recycling" })
      });
      if (res.ok) {
        const data = await res.json();
        // refresh session
        const sessRes = await fetch("/api/session/status");
        if (sessRes.ok) {
          setSessionStatus(await sessRes.json());
        }
        refreshAuditLogs();
        showNotification(`Virtual IP recycled to ${data.newIp}. Synchronized rolling code ${data.rollingCode} activated.`, "success");
      }
    } catch (err) {
      console.error("IP recycling error:", err);
    } finally {
      setIsRecycling(false);
    }
  };

  // Add instance on the fly
  const handleAddInstance = async (instanceData: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...instanceData, actor: `${currentRole}@regression.app` })
      });
      if (res.ok) {
        const data = await res.json();
        setInstances((prev) => [...prev, data.instance]);
        refreshAuditLogs();
        showNotification(`Onboarded instance "${data.instance.name}" on the fly!`, "success");
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Delete instance
  const handleDeleteInstance = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/instances/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInstances((prev) => prev.filter((i) => i.id !== id));
        refreshAuditLogs();
        showNotification("Decommissioned instance.", "info");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Create Webhook
  const handleCreateWebhook = async (name: string, targetUrl: string, events: string[]): Promise<boolean> => {
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, targetUrl, events })
      });
      if (res.ok) {
        const data = await res.json();
        setWebhooks((prev) => [...prev, data.webhook]);
        refreshAuditLogs();
        showNotification(`Created webhook: ${name}`, "success");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Trigger Inbound Webhook
  const handleTriggerInboundWebhook = async (hookId: string, payload: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/webhooks/incoming/${hookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        refreshAuditLogs();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Prompt Crafting
  const handleGeneratePromptCraft = async (params: any) => {
    try {
      const res = await fetch("/api/prompt-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...params, actor: `${currentRole}@regression.app` })
      });
      if (res.ok) {
        refreshAuditLogs();
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  };

  // Image Generation
  const handleGenerateImage = async (prompt: string, style?: string, aspectRatio?: string) => {
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, aspectRatio })
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  };

  const refreshAuditLogs = async () => {
    try {
      const res = await fetch("/api/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch {
      // silent
    }
  };

  const bgThemeClass = {
    cyber_katana: "bg-theme-cyber-katana",
    crimson_nebula: "bg-theme-crimson-nebula",
    blood_wave: "bg-theme-blood-wave",
    obsidian_stealth: "bg-theme-obsidian-stealth"
  }[themeSettings.backgroundStyle] || "bg-theme-cyber-katana";

  const speedClass = `laser-speed-${themeSettings.borderSpeed}`;
  const colorClass = `laser-color-${themeSettings.borderColor}`;

  return (
    <div className={`min-h-screen ${bgThemeClass} ${themeSettings.lagPreventionTurbo ? "performance-turbo" : ""} text-zinc-100 flex flex-col font-sans selection:bg-red-600/40 selection:text-white transition-colors duration-300`}>
      {/* Visual Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
        settings={themeSettings}
        onChangeSettings={setThemeSettings}
      />

      {/* Global Toast Notification in Red, Gray, Black, and White */}
      {notification && (
        <div className="fixed bottom-24 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold border ${
            notification.type === "success"
              ? "bg-neutral-950 text-white border-red-600 shadow-red-950/60"
              : notification.type === "warning"
              ? "bg-neutral-950 text-red-300 border-red-700/80 shadow-red-950/60"
              : "bg-neutral-950 text-zinc-200 border-zinc-700 shadow-black/80"
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 text-red-500" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        sessionStatus={sessionStatus}
        onRecycleIp={handleRecycleIp}
        isRecycling={isRecycling}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenBiometrics={() => setIsBioModalOpen(true)}
        onLockSuite={handleLockSuite}
        securityStatus={securityStatus}
        activeIcon={activeIcon}
        onToggleIcon={() => setActiveIcon((prev) => (prev === "katana" ? "android" : "katana"))}
        onOpenPatchModal={() => setIsPatchModalOpen(true)}
        themeSettings={themeSettings}
        onOpenThemeCustomizer={() => setIsThemeCustomizerOpen(true)}
        onOpenApkQrModal={() => setIsApkQrModalOpen(true)}
        onTriggerSlice={triggerSlice}
        onNarrationTrigger={(msg) => showNotification(msg, "info")}
        onOpenProfile={() => setIsProfileOpen(true)}
        onEngagePrivacyBlind={() => setPrivacyBlindConfig((prev) => ({ ...prev, isActive: true }))}
        onOpenChromiumOSModal={() => setIsChromiumOSModalOpen(true)}
      />

      {/* Sheathed Katana Anime-Style Scroll Dropdown Atop the Screen */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3">
        <SheathedKatanaScrollDropdown
          activeSwordId={activeSwordId}
          onSelectSword={(sword) => {
            setActiveSwordId(sword.id);
            showNotification(`Equipped ${sword.name} - ${sword.loreTitle}`, "info");
          }}
          onTriggerSlice={triggerSlice}
          onNavigateSection={(screenId) => {
            setActiveTab(screenId);
          }}
          onLockApp={handleLockSuite}
          onOpenVault={() => setActiveTab("file-vault")}
          onOpenBrowser={() => setActiveTab("privacy-kiosk")}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCreatorSanctuary={() => setActiveTab("creator-sanctuary")}
          onEngagePrivacyBlind={() => setPrivacyBlindConfig((prev) => ({ ...prev, isActive: true }))}
          onOpenChromiumOSModal={() => setIsChromiumOSModalOpen(true)}
          vaultFileCount={3}
          fontWave={themeSettings.fontWaveEnabled}
        />
      </div>

      {/* APK QR Code Scan Modal */}
      <ApkQrModal
        isOpen={isApkQrModalOpen}
        onClose={() => setIsApkQrModalOpen(false)}
        japaneseFont={themeSettings.japaneseFontEnabled}
      />

      {/* 5-File Integrity & Patch Engine Modal */}
      <TamperPatchModal
        isOpen={isPatchModalOpen}
        onClose={() => setIsPatchModalOpen(false)}
        activeIcon={activeIcon}
      />

      {/* Security Lock Screen Modal when perimeter is locked */}
      {securityStatus && securityStatus.isQuarantined && (
        <FirewallQuarantineScreen
          securityStatus={securityStatus}
          onOverride={handleLiftQuarantine}
        />
      )}
      
      {securityStatus && securityStatus.isLocked && !securityStatus.isQuarantined && (
        <SecurityLockScreen
          securityStatus={securityStatus}
          currentRollingCode={sessionStatus?.rollingCode}
          onUnlockSuccess={(updated) => {
            setSecurityStatus(updated);
            loadAllData();
          }}
          onNotify={showNotification}
        />
      )}

      {/* Biometric & Keyfob Credentials Manager */}
      {securityStatus && (
        <BiometricKeyfobModal
          isOpen={isBioModalOpen}
          onClose={() => setIsBioModalOpen(false)}
          securityStatus={securityStatus}
          onLockSuite={handleLockSuite}
          onRefreshStatus={loadAllData}
          onNotify={showNotification}
        />
      )}

      {/* Main Content Body with Solid Moving Border & Bottom Padding for Dock Tray */}
      <main className="flex-1 py-4 sm:py-6 pb-32 sm:pb-36 px-3 sm:px-6 max-w-7xl mx-auto w-full">
        {isLoadingInitial ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
            <RotateCw className="w-8 h-8 animate-spin text-red-600" />
            <p className="text-xs text-zinc-400 font-medium">Bootstrapping KasA Sovereign Framework & Personal AI Catalyst...</p>
          </div>
        ) : (
          <div className={themeSettings.movingBorderEnabled ? `moving-border-wrapper ${speedClass} ${colorClass} shadow-2xl` : "rounded-2xl border border-red-950/80 bg-neutral-950/90 shadow-2xl"}>
            <div className={themeSettings.movingBorderEnabled ? "moving-border-inner p-3 sm:p-5" : "p-3 sm:p-5"}>
              {activeTab === "creator-sanctuary" && (
                <CreatorSafeSanctuary
                  onNotify={showNotification}
                  onEngagePrivacyBlind={() => setPrivacyBlindConfig((prev) => ({ ...prev, isActive: true }))}
                  onNavigateToVault={() => setActiveTab("file-vault")}
                  fontWave={themeSettings.fontWaveEnabled}
                />
              )}

              {(activeTab === "kasa" || activeTab === "personal-gpt") && (
                <KasaCreationHub
                  onNotify={showNotification}
                  fontWave={themeSettings.fontWaveEnabled}
                />
              )}

              {activeTab === "linux-terminal" && (
                <LinuxTerminalScreen
                  onNotify={showNotification}
                  fontWave={themeSettings.fontWaveEnabled}
                />
              )}

              {activeTab === "file-vault" && (
                <SovereignFileVault
                  onNotify={showNotification}
                  fontWave={themeSettings.fontWaveEnabled}
                />
              )}

              {activeTab === "privacy-kiosk" && (
                <PrivacyKioskBrowser
                  onNotify={showNotification}
                  fontWave={themeSettings.fontWaveEnabled}
                />
              )}

              {activeTab === "swords-arsenal" && (
                <KatanaArsenalScreen
                  activeSwordId={activeSwordId}
                  onSelectSword={(s) => {
                    setActiveSwordId(s.id);
                    showNotification(`Equipped ${s.name} into the Sheathed Katana`, "success");
                  }}
                  onTriggerSlice={triggerSlice}
                  onNotify={showNotification}
                  fontWave={themeSettings.fontWaveEnabled}
                />
              )}

              {activeTab === "koi-pond" && (
                <div className="flex flex-col items-center justify-center py-6 min-h-[500px]">
                  <KoiPondTile
                    onNarration={(msg) => showNotification(msg, "info")}
                    fontWave={themeSettings.fontWaveEnabled}
                  />
                </div>
              )}

              {activeTab === "regression" && (
                <RegressionSuite
                  scenarios={scenarios}
                  instances={instances}
                  onRunTest={handleRunTest}
                  onGenerateFromSymptoms={handleGenerateFromSymptoms}
                  isGeneratingScenario={isGeneratingScenario}
                  isRunningBatch={isRunningBatch}
                  onRunBatch={handleRunBatch}
                />
              )}

              {activeTab === "prompt-studio" && (
                <PromptStudio
                  onGeneratePromptCraft={handleGeneratePromptCraft}
                  onGenerateImage={handleGenerateImage}
                />
              )}

              {activeTab === "instances" && (
                <InstancesAndWebhooks
                  instances={instances}
                  webhooks={webhooks}
                  onAddInstance={handleAddInstance}
                  onDeleteInstance={handleDeleteInstance}
                  onCreateWebhook={handleCreateWebhook}
                  onTriggerInboundWebhook={handleTriggerInboundWebhook}
                  sessionStatus={sessionStatus}
                  onRecycleIp={handleRecycleIp}
                  isRecycling={isRecycling}
                />
              )}

              {activeTab === "audit" && (
                <AuditLogsView
                  logs={auditLogs}
                  currentRole={currentRole}
                />
              )}

              {activeTab === "wifi-apk" && (
                <WifiStandaloneAndApkHub
                  onNotify={showNotification}
                  onRefreshAuditLogs={loadAllData}
                />
              )}

              {activeTab === "legal-agreement" && (
                <LegalAgreementView />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Razor-thin Glowing Katana Blade Slice Animation Effect */}
      <KatanaBladeSlice
        isActive={isSlicing}
        onComplete={() => setIsSlicing(false)}
      />

      {/* Customizable Kasa-Themed Virtual Keyboard */}
      <KasaThemedKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        theme={themeSettings.keyboardTheme || "cyber_katana"}
        onKeyPress={(key) => {
          window.dispatchEvent(new CustomEvent("kasa-virtual-key", { detail: key }));
        }}
      />

      {/* Multi-Screen Dock Tray & Specialized Tools */}
      <KasaDockTray
        activeScreen={activeTab}
        onSelectScreen={setActiveTab}
        onTriggerSlice={triggerSlice}
        onTriggerQuarantine={handleQuarantine}
        onToggleKeyboard={() => setIsKeyboardOpen((prev) => !prev)}
        isKeyboardOpen={isKeyboardOpen}
        onToggleKoiPond={() => setActiveTab("koi-pond")}
        themeSettings={themeSettings}
        onUpdateThemeSettings={(partial) => {
          const updated = { ...themeSettings, ...partial };
          setThemeSettings(updated);
          try {
            localStorage.setItem("kasa_theme_settings", JSON.stringify(updated));
          } catch {
            // silent
          }
        }}
        onNarrationTrigger={(msg) => showNotification(msg, "info")}
        onOpenProfile={() => setIsProfileOpen(true)}
        onEngagePrivacyBlind={() => setPrivacyBlindConfig((prev) => ({ ...prev, isActive: true }))}
        onOpenChromiumOSModal={() => setIsChromiumOSModalOpen(true)}
      />

      {/* Scott Gushea User Profile & Security Requests Sidebar */}
      <UserProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        themeSettings={themeSettings}
        onUpdateThemeSettings={(partial) => {
          const updated = { ...themeSettings, ...partial };
          setThemeSettings(updated);
          try {
            localStorage.setItem("kasa_theme_settings", JSON.stringify(updated));
          } catch {
            // silent
          }
        }}
        onNotify={showNotification}
      />

      {/* Creator Privacy Blind Screen (Anti-Shoulder-Surfing Protection) */}
      <CreatorPrivacyBlindScreen
        config={privacyBlindConfig}
        onUpdateConfig={(partial) => {
          const updated = { ...privacyBlindConfig, ...partial };
          setPrivacyBlindConfig(updated);
          try {
            localStorage.setItem("kasa_privacy_blind", JSON.stringify(updated));
          } catch {
            // silent
          }
        }}
        onDeactivate={() => setPrivacyBlindConfig((prev) => ({ ...prev, isActive: false }))}
        fontWave={themeSettings.fontWaveEnabled}
      />

      {/* Chromium OS & Hisense C11 Kiosk Setup Modal */}
      <ChromiumOSKioskModal
        isOpen={isChromiumOSModalOpen}
        onClose={() => setIsChromiumOSModalOpen(false)}
        onEnterKioskFullscreen={toggleKioskFullscreen}
        isKioskFullscreen={isKioskFullscreen}
        fontWave={themeSettings.fontWaveEnabled}
      />

      {/* Offline Indicator Toast */}
      <OfflineIndicator />

      {/* KasA Red, Gray, Black, and White Footer */}
      <footer className="border-t border-red-950/80 bg-neutral-950/95 py-4 px-6 text-center text-[11px] text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className={`font-semibold text-white ${themeSettings.japaneseFontEnabled ? "font-japanese" : ""}`}>
              KasA - Personal Ai Catalyst
            </span>
            <span className="text-zinc-600">•</span>
            <span>Architected & Owned by Scott Gushea</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-zinc-400 text-[11px]">
            <span>IP: <strong className="text-zinc-200">{sessionStatus?.currentIp || "198.51.100.42"}</strong></span>
            <span>Rolling Code: <strong className="text-red-400">{sessionStatus?.rollingCode || "639201"}</strong></span>
            <button
              onClick={() => setActiveTab("legal-agreement")}
              className="text-zinc-400 hover:text-red-300 underline transition cursor-pointer"
            >
              Legal Agreement (/s/ Scott Gushea)
            </button>
            <a
              href="/api/apk/download-direct-apk"
              download="KasA-Sovereign-v1.0.apk"
              className="text-red-400 hover:text-white font-bold transition flex items-center gap-1"
            >
              Standalone .APK
            </a>
            <a
              href="/api/export/zip"
              download="chatgpt-regression-suite-bundle.zip"
              className="text-zinc-400 hover:text-white underline transition"
            >
              Export ZIP
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
