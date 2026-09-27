import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  RotateCw, 
  Globe, 
  Lock, 
  Smartphone, 
  Download, 
  Repeat, 
  Palette, 
  QrCode, 
  Terminal, 
  Sword, 
  FolderLock, 
  User, 
  Feather, 
  EyeOff, 
  Monitor,
  Flame,
  ChevronDown,
  Key,
  Layers,
  Sparkles,
  FileCheck
} from "lucide-react";
import { UserRole, SessionStatus, SecurityLockStatus, VisualThemeSettings } from "../types";
import { PWAInstallButton } from "./PWAInstallButton";
import { KasaButton } from "./KasaButton";
import { KasaSwordEmblem } from "./KasaSwordEmblem";
import { NarrationCatalyst } from "./NarrationCatalyst";

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  sessionStatus: SessionStatus | null;
  onRecycleIp: () => Promise<void>;
  isRecycling: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenBiometrics?: () => void;
  onLockSuite?: () => void;
  securityStatus?: SecurityLockStatus | null;
  activeIcon?: "katana" | "android";
  onToggleIcon?: () => void;
  onOpenPatchModal?: () => void;
  themeSettings?: VisualThemeSettings;
  onOpenThemeCustomizer?: () => void;
  onOpenApkQrModal?: () => void;
  onTriggerSlice?: () => void;
  onNarrationTrigger?: (text: string) => void;
  onOpenProfile?: () => void;
  onEngagePrivacyBlind?: () => void;
  onOpenChromiumOSModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  sessionStatus,
  onRecycleIp,
  isRecycling,
  activeTab,
  onTabChange,
  onOpenBiometrics,
  onLockSuite,
  securityStatus,
  activeIcon = "katana",
  onToggleIcon,
  themeSettings,
  onOpenThemeCustomizer,
  onOpenApkQrModal,
  onTriggerSlice,
  onOpenProfile,
  onEngagePrivacyBlind,
  onOpenChromiumOSModal,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isTopDrawerOpen, setIsTopDrawerOpen] = useState(true);
  const [secondsToNextRollingCode, setSecondsToNextRollingCode] = useState(60);

  useEffect(() => {
    const updateCountdown = () => {
      const sec = 60 - (Math.floor(Date.now() / 1000) % 60);
      setSecondsToNextRollingCode(sec);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = () => {
    if (sessionStatus?.rollingCode) {
      navigator.clipboard.writeText(sessionStatus.rollingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const formatHoursMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const useJapanese = themeSettings?.japaneseFontEnabled ?? true;
  const useWave = themeSettings?.fontWaveEnabled ?? true;
  const useShine = themeSettings?.buttonShineEnabled ?? true;
  const emblemStyle = themeSettings?.emblemStyle ?? "crimson_ronin";

  return (
    <header className="border-b-2 border-red-900/80 bg-black/95 backdrop-blur sticky top-0 z-40 shadow-2xl shadow-black/90">
      {/* Top Banner: Curated Identity & Controls */}
      {isTopDrawerOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 animate-in slide-in-from-top duration-200">
          {/* Brand & Creator Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group flex items-center">
              {activeIcon === "katana" ? (
                <div 
                  onClick={onToggleIcon}
                  className="cursor-pointer transition-transform hover:scale-105"
                  title="Toggle Emblem (Katana vs Red Android)"
                >
                  <KasaSwordEmblem
                    style={emblemStyle}
                    size="md"
                    showText={false}
                    neonGlow={true}
                    fontWave={useWave}
                  />
                </div>
              ) : (
                <div 
                  className="w-13 h-13 rounded-2xl overflow-hidden bg-black border-2 border-red-600 shadow-lg shadow-red-950/80 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  onClick={onToggleIcon}
                  title="Toggle Emblem"
                >
                  <img
                    src="/kasa-android-icon.jpg"
                    alt="KasA Emblem"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              
              {onToggleIcon && (
                <button
                  type="button"
                  onClick={onToggleIcon}
                  className="absolute -bottom-1 -right-1 bg-zinc-950 border border-red-700 hover:border-red-400 rounded-full p-1 text-zinc-300 hover:text-red-400 shadow cursor-pointer z-10"
                  title="Switch emblem variant"
                >
                  <Repeat className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider flex items-center gap-2">
                  <span className={`text-kasa-bright-red ${useWave ? "font-japan-wave" : useJapanese ? "font-japanese" : ""}`}>
                    KasA
                  </span>
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-red-900/90 text-white border border-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  Personal Ai Catalyst
                </span>
              </div>
              <p className="text-xs text-zinc-200 mt-0.5 font-medium">
                Sovereign Intelligence Hub • Creator: <span className="text-white-crisp font-bold">Scott Gushea</span>
              </p>
            </div>
          </div>

          {/* Cosmetically Curated Action Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            {/* Narration Catalyst */}
            <NarrationCatalyst onStateChange={() => {}} />

            {/* Thin Glowing Katana Blade Slice */}
            {onTriggerSlice && (
              <KasaButton
                variant="danger"
                size="sm"
                shine={useShine}
                onClick={onTriggerSlice}
                icon={<Sword className="w-3.5 h-3.5 text-white animate-pulse" />}
                className="border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] font-bold"
                title="Trigger razor-thin glowing katana blade slice"
              >
                <span className="text-white-crisp">Slice</span>
              </KasaButton>
            )}

            {/* Visual Theme Customizer */}
            {onOpenThemeCustomizer && (
              <KasaButton
                variant="secondary"
                size="sm"
                shine={useShine}
                onClick={onOpenThemeCustomizer}
                icon={<Palette className="w-3.5 h-3.5 text-red-400" />}
                className="border-red-700/80 hover:border-red-500"
                title="Visual theme customizer"
              >
                <span className="text-white-crisp">Theme</span>
              </KasaButton>
            )}

            {/* Instant Privacy Blind Curtain */}
            {onEngagePrivacyBlind && (
              <KasaButton
                variant="danger"
                size="sm"
                shine={useShine}
                onClick={onEngagePrivacyBlind}
                icon={<EyeOff className="w-3.5 h-3.5 text-white" />}
                title="Anti-shoulder-surfing creator privacy curtain (Alt+P)"
              >
                <span className="text-white-crisp hidden sm:inline">Privacy Blind</span>
              </KasaButton>
            )}

            {/* State-of-the-Art Perimeter Lock */}
            {onLockSuite && (
              <KasaButton
                variant="danger"
                size="sm"
                shine={useShine}
                onClick={onLockSuite}
                icon={<Lock className="w-3.5 h-3.5 text-white" />}
                title="Lock KasA sovereign perimeter"
              >
                <span className="text-white-crisp font-bold">Lock</span>
              </KasaButton>
            )}

            {/* Scott Gushea Sovereign Profile */}
            {onOpenProfile && (
              <KasaButton
                variant="secondary"
                size="sm"
                shine={useShine}
                onClick={onOpenProfile}
                icon={<User className="w-3.5 h-3.5 text-red-400" />}
                className="border-red-700/80 hover:border-red-500"
                title="Scott Gushea - Sole Creator & Architect"
              >
                <span className="text-white-crisp">Scott Gushea</span>
              </KasaButton>
            )}

            {/* Consolidated Sovereign Tools Menu (Prevents Button Clutter) */}
            <div className="relative">
              <button
                onClick={() => setIsToolsOpen((prev) => !prev)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-red-700/80 hover:border-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <span>Sanctuary Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-red-600/80 bg-neutral-950 p-2 shadow-2xl z-50 space-y-1">
                  <a
                    href="/api/apk/download-direct-apk"
                    download="KasA-Sovereign-v1.0.apk"
                    className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-neutral-900 flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-red-400" />
                    <span>Download APK (Direct)</span>
                  </a>

                  {onOpenApkQrModal && (
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenApkQrModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-neutral-900 flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4 text-red-400" />
                      <span>Scan Phone QR</span>
                    </button>
                  )}

                  {onOpenChromiumOSModal && (
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenChromiumOSModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-neutral-900 flex items-center gap-2"
                    >
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      <span>Hisense / ChromeOS Kiosk</span>
                    </button>
                  )}

                  {onOpenBiometrics && (
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenBiometrics();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-neutral-900 flex items-center gap-2"
                    >
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>Keyfob Credentials</span>
                    </button>
                  )}

                  <a
                    href="/api/export/zip"
                    download="KasA-Source-Bundle.zip"
                    className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-neutral-900 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-zinc-400" />
                    <span>Export Source Bundle</span>
                  </a>
                </div>
              )}
            </div>

            {/* PWA Install */}
            <PWAInstallButton />

            {/* Session IP & Rolling Token Indicator */}
            {sessionStatus && (
              <div className="flex items-center bg-neutral-950 border border-zinc-800 rounded-lg px-2 py-1 space-x-2 text-zinc-300">
                <div className="flex items-center gap-1" title="Active Protected IP">
                  <Globe className="w-3 h-3 text-red-400" />
                  <span className="font-mono text-zinc-100 text-[11px]">{sessionStatus.currentIp}</span>
                </div>
                <span className="text-zinc-700">|</span>
                <div
                  onClick={handleCopyCode}
                  className="cursor-pointer flex items-center gap-1 hover:text-white"
                  title="Click to copy rolling authorization token"
                >
                  <span className="font-mono text-kasa-bright-red font-bold text-[11px]">
                    {copiedCode ? "COPIED" : sessionStatus.rollingCode}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">({secondsToNextRollingCode}s)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Uniform, Abstract Navigation Tabs & Drawer Pull Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-1 border-t border-red-950/80">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto scrollbar-none">
          {/* PRIMARY TAB: KasA Genesis Hub */}
          <button
            onClick={() => onTabChange("kasa")}
            className={`py-2 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === "kasa" || activeTab === "personal-gpt"
                ? "border-red-500 text-white bg-red-950/60 shadow-inner"
                : "border-transparent text-zinc-300 hover:text-white hover:border-zinc-700"
            } ${useWave ? "font-japan-wave" : useJapanese ? "font-japanese" : ""}`}
          >
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="text-kasa-bright-red font-black">KasA Hub</span>
          </button>

        {/* Creator Safe Sanctuary */}
        <button
          onClick={() => onTabChange("creator-sanctuary")}
          className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === "creator-sanctuary"
              ? "border-red-500 text-white bg-red-950/50 shadow-inner"
              : "border-transparent text-zinc-300 hover:text-white hover:border-zinc-700"
          } ${useWave ? "font-japan-wave" : useJapanese ? "font-japanese" : ""}`}
        >
          <Feather className="w-4 h-4 text-red-400" />
          <span className="text-white-crisp">Sanctuary</span>
          <span className="px-1.5 py-0.5 bg-red-950 border border-red-500 text-red-200 text-[9px] font-bold rounded">AIR-GAP</span>
        </button>

        {/* Sovereign File Vault */}
        <button
          onClick={() => onTabChange("file-vault")}
          className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === "file-vault"
              ? "border-amber-500 text-white bg-amber-950/50 shadow-inner"
              : "border-transparent text-zinc-300 hover:text-white hover:border-zinc-700"
          } ${useWave ? "font-japan-wave" : useJapanese ? "font-japanese" : ""}`}
        >
          <FolderLock className="w-4 h-4 text-amber-400" />
          <span className="text-white-crisp">File Vault</span>
          <span className="px-1.5 py-0.5 bg-amber-950 border border-amber-500 text-amber-300 text-[9px] font-bold rounded">AES-256</span>
        </button>

        {/* Katana Arsenal & Forge */}
        <button
          onClick={() => onTabChange("swords-arsenal")}
          className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === "swords-arsenal"
              ? "border-rose-500 text-white bg-rose-950/50 shadow-inner"
              : "border-transparent text-zinc-300 hover:text-white hover:border-zinc-700"
          } ${useWave ? "font-japan-wave" : useJapanese ? "font-japanese" : ""}`}
        >
          <Sword className="w-4 h-4 text-rose-400" />
          <span className="text-white-crisp">Swords Forge</span>
        </button>

        {/* Privacy Kiosk Browser */}
        <button
          onClick={() => onTabChange("privacy-kiosk")}
          className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === "privacy-kiosk"
              ? "border-cyan-500 text-white bg-cyan-950/50 shadow-inner"
              : "border-transparent text-zinc-300 hover:text-white hover:border-zinc-700"
          } ${useWave ? "font-japan-wave" : useJapanese ? "font-japanese" : ""}`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-white-crisp">Privacy Kiosk</span>
        </button>

        {/* Linux CLI Terminal */}
        <button
          onClick={() => onTabChange("linux-terminal")}
          className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === "linux-terminal"
              ? "border-emerald-500 text-white bg-emerald-950/50 shadow-inner"
              : "border-transparent text-zinc-300 hover:text-white hover:border-zinc-700"
          } ${useWave ? "font-japan-wave" : useJapanese ? "font-japanese" : ""}`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-white-crisp">Linux CLI</span>
        </button>

        {/* Security, Testing & Audit Suite */}
        <button
          onClick={() => onTabChange("regression")}
          className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === "regression" || activeTab === "audit" || activeTab === "instances"
              ? "border-red-500 text-white bg-red-950/50 shadow-inner"
              : "border-transparent text-zinc-300 hover:text-white hover:border-zinc-700"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-zinc-200" />
          <span className="text-white-crisp">Security & Tests</span>
        </button>
        </div>

        {/* Retract/Dropdown Header Drawer Pull Button */}
        <button
          type="button"
          onClick={() => setIsTopDrawerOpen((prev) => !prev)}
          className="ml-auto px-2.5 py-1.5 rounded-b-xl bg-neutral-900 hover:bg-neutral-800 text-red-400 hover:text-white border border-t-0 border-red-800 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 cursor-pointer transition shrink-0"
          title="Click to drop down or retract top header drawer"
        >
          <span>{isTopDrawerOpen ? "Hide Header" : "Header Drawer"}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isTopDrawerOpen ? "rotate-180 text-zinc-400" : "text-red-400 animate-bounce"}`} />
        </button>
      </div>
    </header>
  );
};
