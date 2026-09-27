import React, { useState } from "react";
import { 
  Terminal, 
  Sparkles, 
  Waves, 
  Keyboard, 
  Volume2, 
  Zap, 
  Shield, 
  Layers, 
  Flame, 
  Smartphone, 
  CheckCircle2, 
  Cpu, 
  Palette,
  Sword,
  FolderLock,
  Globe,
  User,
  Feather,
  EyeOff,
  Monitor,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  PanelBottom
} from "lucide-react";
import { KasaEmblemStyle, VisualThemeSettings } from "../types";

interface KasaDockTrayProps {
  activeScreen: string;
  onSelectScreen: (screenId: string) => void;
  onTriggerSlice: () => void;
  onTriggerQuarantine?: () => void;
  onToggleKeyboard: () => void;
  isKeyboardOpen: boolean;
  onToggleKoiPond: () => void;
  themeSettings: VisualThemeSettings;
  onUpdateThemeSettings: (newSettings: Partial<VisualThemeSettings>) => void;
  onNarrationTrigger: (text: string) => void;
  onOpenProfile?: () => void;
  onEngagePrivacyBlind?: () => void;
  onOpenChromiumOSModal?: () => void;
}

export const KasaDockTray: React.FC<KasaDockTrayProps> = ({
  activeScreen,
  onSelectScreen,
  onTriggerSlice,
  onTriggerQuarantine,
  onToggleKeyboard,
  isKeyboardOpen,
  onToggleKoiPond,
  themeSettings,
  onUpdateThemeSettings,
  onNarrationTrigger,
  onOpenProfile,
  onEngagePrivacyBlind,
  onOpenChromiumOSModal,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const screens = [
    { id: "creator-sanctuary", label: "Sanctuary", icon: Feather, color: "text-red-400" },
    { id: "personal-gpt", label: "Catalyst AI", icon: Sparkles, color: "text-red-400" },
    { id: "file-vault", label: "Vault", icon: FolderLock, color: "text-amber-400" },
    { id: "privacy-kiosk", label: "Kiosk Web", icon: Globe, color: "text-cyan-400" },
    { id: "swords-arsenal", label: "Swords Forge", icon: Sword, color: "text-rose-400" },
    { id: "linux-terminal", label: "Terminal", icon: Terminal, color: "text-emerald-400" },
    { id: "koi-pond", label: "Koi Sanctuary", icon: Waves, color: "text-teal-400" },
    { id: "regression", label: "Regression", icon: Shield, color: "text-yellow-400" },
    { id: "wifi-apk", label: "Wi-Fi & APK", icon: Monitor, color: "text-blue-400" },
  ];

  const emblemStyles: { id: KasaEmblemStyle; label: string }[] = [
    { id: "crimson_ronin", label: "Crimson Ronin" },
    { id: "cyberpunk_kasa", label: "Cyberpunk Kasa" },
    { id: "shadow_shinobi", label: "Shadow Shinobi" },
    { id: "gold_shogun", label: "Gold Shogun" },
    { id: "neon_oni", label: "Neon Oni" },
  ];

  return (
    <div className="fixed bottom-0 right-2 sm:right-6 z-50 transition-all duration-300 ease-in-out">
      {/* Drawer Pull-out Edge Trigger Tab */}
      <div className="flex justify-end pr-2">
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          className="px-4 py-1.5 rounded-t-2xl bg-neutral-950 border-t-2 border-x-2 border-red-600/90 text-white font-extrabold text-xs flex items-center gap-2 shadow-[0_-5px_15px_rgba(239,68,68,0.4)] hover:bg-red-950 transition-all cursor-pointer"
        >
          <PanelBottom className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="uppercase tracking-wider text-kasa-bright-red">
            {isDrawerOpen ? "Close Dock Drawer" : "Dock Tray Drawer"}
          </span>
          {isDrawerOpen ? (
            <ChevronDown className="w-4 h-4 text-zinc-300" />
          ) : (
            <ChevronUp className="w-4 h-4 text-red-400 animate-bounce" />
          )}
        </button>
      </div>

      {/* Sliding Bottom Drawer Container */}
      {isDrawerOpen && (
        <div className="rounded-t-2xl bg-neutral-950/98 border-t-2 border-x-2 border-red-800/90 p-3 shadow-2xl backdrop-blur-xl max-w-5xl w-full animate-in slide-in-from-bottom duration-300 border-b-0 space-y-3">
          {/* Main Drawer Header & Edge Close bar */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="flex items-center justify-between cursor-pointer pb-2 border-b border-red-950 hover:bg-red-950/20 px-1 rounded transition"
            title="Click bottom edge bar to close drawer"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-black uppercase text-white tracking-widest">
                KasA Sovereign Command Drawer
              </span>
            </div>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider hover:underline">
              [ Tap Edge to Slide Back Down ]
            </span>
          </div>

          {/* Navigation Sub-Tabs Grid */}
          <div className="flex flex-wrap items-center gap-1.5 max-h-48 overflow-y-auto pr-1">
            {screens.map((s) => {
              const Icon = s.icon;
              const isActive = activeScreen === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectScreen(s.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-red-600 text-white shadow-[0_0_15px_#ff0033] border border-red-400"
                      : "bg-black/80 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-red-950"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : s.color}`} />
                  <span className="text-white-crisp">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Tools Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-red-950">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Katana Slice */}
              <button
                type="button"
                onClick={onTriggerSlice}
                title="Trigger razor-thin glowing Katana slice animation"
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-md border border-red-400"
              >
                <Sword className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="text-white-crisp">Slice</span>
              </button>

              {/* Koi Pond */}
              <button
                type="button"
                onClick={onToggleKoiPond}
                title="Summon Kasa from Koi Pond Sanctuary"
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition border border-cyan-800/80 hover:border-cyan-500"
              >
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white-crisp">Koi Pond</span>
              </button>

              {/* Virtual Keyboard */}
              <button
                type="button"
                onClick={onToggleKeyboard}
                title="Toggle Virtual Keyboard"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition border ${
                  isKeyboardOpen
                    ? "bg-red-600 text-white border-red-300 shadow-[0_0_10px_#ff0033]"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white border-red-900/80"
                }`}
              >
                <Keyboard className="w-3.5 h-3.5 text-red-400" />
                <span className="text-white-crisp">Virtual Keyboard</span>
              </button>

              {/* Lag Prevention Turbo Mode */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !themeSettings.lagPreventionTurbo;
                  onUpdateThemeSettings({ lagPreventionTurbo: nextState });
                  if (onNarrationTrigger) {
                    onNarrationTrigger(
                      nextState
                        ? "Lag Prevention Turbo Mode engaged. Frame rate locked to 60 FPS."
                        : "Standard visual fidelity restored."
                    );
                  }
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition border ${
                  themeSettings.lagPreventionTurbo
                    ? "bg-emerald-700 text-white border-emerald-400 shadow-[0_0_10px_#10b981]"
                    : "bg-neutral-900 text-zinc-300 hover:text-white border-zinc-700"
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${themeSettings.lagPreventionTurbo ? "text-emerald-300" : "text-zinc-400"}`} />
                <span className="text-white-crisp">
                  {themeSettings.lagPreventionTurbo ? "Turbo ON" : "Turbo"}
                </span>
              </button>

              {/* Threat Quarantine */}
              {onTriggerQuarantine && (
                <button
                  type="button"
                  onClick={onTriggerQuarantine}
                  className="px-2.5 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-500 font-bold text-xs flex items-center gap-1 cursor-pointer transition border border-red-700 hover:border-red-500"
                >
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-red-500" />
                  <span className="text-red-200">Quarantine</span>
                </button>
              )}

              {/* Privacy Blind */}
              {onEngagePrivacyBlind && (
                <button
                  type="button"
                  onClick={onEngagePrivacyBlind}
                  className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition border border-rose-800/80 hover:border-rose-400"
                >
                  <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-white-crisp">Blind</span>
                </button>
              )}

              {/* Chromium OS */}
              {onOpenChromiumOSModal && (
                <button
                  type="button"
                  onClick={onOpenChromiumOSModal}
                  className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition border border-cyan-800/80 hover:border-cyan-400"
                >
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white-crisp">C11 Kiosk</span>
                </button>
              )}

              {/* Profile */}
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition border border-red-800/80 hover:border-red-400"
                >
                  <User className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-white-crisp">Profile</span>
                </button>
              )}
            </div>

            <select
              value={themeSettings.emblemStyle}
              onChange={(e) => onUpdateThemeSettings({ emblemStyle: e.target.value as KasaEmblemStyle })}
              aria-label="Kasa Emblem Style"
              className="px-2 py-1.5 rounded-xl bg-black border border-red-700 text-[11px] font-bold text-white focus:outline-none focus:border-red-400 cursor-pointer"
            >
              {emblemStyles.map((est) => (
                <option key={est.id} value={est.id} className="bg-neutral-900 text-white">
                  {est.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

