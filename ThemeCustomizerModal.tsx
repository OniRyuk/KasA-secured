import React from "react";
import { 
  Palette, 
  Sparkles, 
  X, 
  Check, 
  Sliders, 
  Flame, 
  Eye, 
  Zap, 
  Layers,
  RotateCcw
} from "lucide-react";
import { VisualThemeSettings } from "../types";
import { KasaButton } from "./KasaButton";

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VisualThemeSettings;
  onChangeSettings: (newSettings: VisualThemeSettings) => void;
}

export const defaultThemeSettings: VisualThemeSettings = {
  backgroundStyle: "cyber_katana",
  movingBorderEnabled: true,
  borderSpeed: "normal",
  borderColor: "crimson",
  japaneseFontEnabled: true,
  fontWaveEnabled: true,
  buttonShineEnabled: true,
  glowIntensity: "vivid",
  emblemStyle: "crimson_ronin",
  lagPreventionTurbo: false,
  keyboardTheme: "cyber_katana",
  virtualKeyboardOpen: false,
  voiceNarrationEnabled: true,
};

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChangeSettings
}) => {
  if (!isOpen) return null;

  const update = <K extends keyof VisualThemeSettings>(key: K, val: VisualThemeSettings[K]) => {
    const updated = { ...settings, [key]: val };
    onChangeSettings(updated);
    try {
      localStorage.setItem("kasa_theme_settings", JSON.stringify(updated));
    } catch {
      // silent
    }
  };

  const handleReset = () => {
    onChangeSettings(defaultThemeSettings);
    try {
      localStorage.setItem("kasa_theme_settings", JSON.stringify(defaultThemeSettings));
    } catch {
      // silent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-neutral-950 border border-red-800/80 rounded-2xl shadow-2xl shadow-red-950/70 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/90 bg-gradient-to-r from-red-950/40 to-neutral-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-red-900/40 border border-red-600/60 flex items-center justify-center text-red-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold text-white tracking-wide ${settings.japaneseFontEnabled ? "font-japanese" : ""}`}>
                KasA Visual Customizer
              </h3>
              <p className="text-xs text-zinc-400">
                Personalize your Black & Red Cyber-Samurai aesthetic
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-zinc-300">
          {/* 1. Background Theme Presets */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span>Background Matrix Style</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "cyber_katana", label: "Cyber Katana Grid", desc: "Hexagonal grid with deep crimson radial flare" },
                { id: "crimson_nebula", label: "Crimson Nebula", desc: "Volumetric blood-red aura with obsidian shadows" },
                { id: "blood_wave", label: "Blood Wave Matrix", desc: "Japanese geometric weave with subtle scanline pulse" },
                { id: "obsidian_stealth", label: "Obsidian Stealth", desc: "Ultra-dark OLED black with razor crimson edge" }
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => update("backgroundStyle", style.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    settings.backgroundStyle === style.id
                      ? "bg-red-950/40 border-red-500 shadow-md shadow-red-950/60 text-white"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <div className="font-semibold text-xs text-zinc-200 flex items-center justify-between mb-1">
                    <span>{style.label}</span>
                    {settings.backgroundStyle === style.id && (
                      <Check className="w-3.5 h-3.5 text-red-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-tight">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Solid Moving Border Controls */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  Solid Moving Laser Border
                </span>
                <p className="text-[11px] text-zinc-400">
                  Continuous luminous laser track traveling around the main dashboard container
                </p>
              </div>
              <button
                type="button"
                onClick={() => update("movingBorderEnabled", !settings.movingBorderEnabled)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                  settings.movingBorderEnabled ? "bg-red-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.movingBorderEnabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {settings.movingBorderEnabled && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
                {/* Border Color */}
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Laser Color
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { id: "crimson", color: "bg-red-600", label: "Crimson" },
                      { id: "sakura", color: "bg-rose-500", label: "Sakura" },
                      { id: "flame", color: "bg-orange-500", label: "Flame" },
                      { id: "ruby", color: "bg-red-800", label: "Ruby" }
                    ].map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => update("borderColor", col.id as any)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                          settings.borderColor === col.id
                            ? "border-white ring-2 ring-red-500/50 scale-105"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        title={col.label}
                      >
                        <span className={`w-5 h-5 rounded-md ${col.color}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Laser Speed */}
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                    Cycle Speed
                  </label>
                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    {[
                      { id: "slow", label: "Slow" },
                      { id: "normal", label: "Normal" },
                      { id: "fast", label: "Hyper" }
                    ].map((spd) => (
                      <button
                        key={spd.id}
                        type="button"
                        onClick={() => update("borderSpeed", spd.id as any)}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded transition cursor-pointer ${
                          settings.borderSpeed === spd.id
                            ? "bg-red-600 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {spd.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Japanese Styled English Typography */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <span className="text-red-500 font-japanese text-sm">侍</span>
                Japanese Styled English Font
              </span>
              <p className="text-[11px] text-zinc-400">
                Applies the traditional Katana woodblock / brush calligraphy font (Shojumaru) to headers, titles, and buttons
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("japaneseFontEnabled", !settings.japaneseFontEnabled)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                settings.japaneseFontEnabled ? "bg-red-600" : "bg-zinc-800"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.japaneseFontEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 4. Detailed Button Styling & Randomized Shine */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Randomized Button Blade Shine
              </span>
              <p className="text-[11px] text-zinc-400">
                Random light beams glide across buttons every so often like a polished katana reflection
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("buttonShineEnabled", !settings.buttonShineEnabled)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                settings.buttonShineEnabled ? "bg-red-600" : "bg-zinc-800"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.buttonShineEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Live Preview Sample */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-red-900/40 space-y-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Live Interactive Button & Typography Preview:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <KasaButton
                variant="primary"
                size="md"
                shine={settings.buttonShineEnabled}
                className={settings.japaneseFontEnabled ? "font-japanese" : ""}
              >
                Katana Execute
              </KasaButton>
              <KasaButton
                variant="secondary"
                size="md"
                shine={settings.buttonShineEnabled}
                className={settings.japaneseFontEnabled ? "font-japanese" : ""}
              >
                Obsidian Shield
              </KasaButton>
              <KasaButton
                variant="danger"
                size="md"
                shine={settings.buttonShineEnabled}
                className={settings.japaneseFontEnabled ? "font-japanese" : ""}
              >
                Lock Perimeter
              </KasaButton>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-800 bg-neutral-950/80">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
          <KasaButton
            variant="primary"
            size="md"
            onClick={onClose}
          >
            Apply & Close
          </KasaButton>
        </div>
      </div>
    </div>
  );
};
