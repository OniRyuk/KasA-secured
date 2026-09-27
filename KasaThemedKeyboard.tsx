import React, { useState } from "react";
import { Keyboard, X, ArrowUp, CornerDownLeft, Delete, Sparkles, Volume2, ShieldCheck } from "lucide-react";
import { KeyboardTheme } from "../types";

interface KasaThemedKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyPress: (char: string) => void;
  activeTheme: KeyboardTheme;
  onThemeChange?: (theme: KeyboardTheme) => void;
  onSpecialAction?: (action: "slice" | "clear" | "sudo" | "apk" | "mesh" | "kasa") => void;
}

export const KasaThemedKeyboard: React.FC<KasaThemedKeyboardProps> = ({
  isOpen,
  onClose,
  onKeyPress,
  activeTheme = "cyber_katana",
  onThemeChange,
  onSpecialAction,
}) => {
  const [isShift, setIsShift] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Play synthetic key click sound
  const playKeySound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio policy
    }
  };

  const handleKeyClick = (val: string) => {
    setActiveKey(val);
    playKeySound();
    onKeyPress(isShift ? val.toUpperCase() : val.toLowerCase());
    setTimeout(() => setActiveKey(null), 120);
  };

  // Theme styling definitions
  const themeStyles: Record<KeyboardTheme, {
    container: string;
    keyBg: string;
    keyActive: string;
    keyBorder: string;
    accentKeyBg: string;
    glow: string;
    label: string;
  }> = {
    cyber_katana: {
      container: "bg-neutral-950/95 border-red-600/80 shadow-[0_-5px_30px_rgba(220,38,38,0.3)]",
      keyBg: "bg-zinc-900 hover:bg-neutral-800 text-white",
      keyActive: "bg-red-600 text-white scale-95 shadow-[0_0_12px_#ff0033]",
      keyBorder: "border-red-900/80 hover:border-red-500",
      accentKeyBg: "bg-red-900/70 hover:bg-red-800 text-white border-red-600",
      glow: "#ef4444",
      label: "Cyber Katana",
    },
    crimson_nebula: {
      container: "bg-black/95 border-red-500/90 shadow-[0_-5px_30px_rgba(255,23,68,0.4)]",
      keyBg: "bg-red-950/40 hover:bg-red-900/60 text-white",
      keyActive: "bg-red-500 text-white scale-95 shadow-[0_0_15px_#ff1744]",
      keyBorder: "border-red-700/80 hover:border-red-400",
      accentKeyBg: "bg-red-700 hover:bg-red-600 text-white border-red-400",
      glow: "#ff1744",
      label: "Crimson Nebula",
    },
    blood_wave: {
      container: "bg-neutral-950/95 border-red-700/80 shadow-[0_-5px_30px_rgba(185,28,28,0.35)]",
      keyBg: "bg-neutral-900 hover:bg-zinc-800 text-white",
      keyActive: "bg-rose-600 text-white scale-95 shadow-[0_0_12px_#e11d48]",
      keyBorder: "border-rose-900/80 hover:border-rose-500",
      accentKeyBg: "bg-rose-950 hover:bg-rose-900 text-white border-rose-600",
      glow: "#e11d48",
      label: "Blood Wave",
    },
    obsidian_stealth: {
      container: "bg-[#070709]/95 border-zinc-700/80 shadow-[0_-5px_30px_rgba(0,0,0,0.8)]",
      keyBg: "bg-zinc-950 hover:bg-zinc-900 text-white",
      keyActive: "bg-zinc-700 text-white scale-95 shadow-[0_0_8px_#ffffff]",
      keyBorder: "border-zinc-800 hover:border-red-600/70",
      accentKeyBg: "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700",
      glow: "#ffffff",
      label: "Obsidian Stealth",
    },
    neon_shogun: {
      container: "bg-neutral-950/95 border-amber-500/80 shadow-[0_-5px_30px_rgba(245,158,11,0.25)]",
      keyBg: "bg-zinc-900 hover:bg-neutral-800 text-white",
      keyActive: "bg-amber-500 text-black scale-95 shadow-[0_0_14px_#fbbf24]",
      keyBorder: "border-amber-900/80 hover:border-amber-500",
      accentKeyBg: "bg-amber-950 hover:bg-amber-900 text-amber-200 border-amber-600",
      glow: "#f59e0b",
      label: "Neon Shogun",
    },
  };

  const currentTheme = themeStyles[activeTheme] || themeStyles.cyber_katana;

  if (!isOpen) return null;

  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ];

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 border-t-2 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom duration-300 ${currentTheme.container}`}
    >
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Top Control Bar: Themes & Tools */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center bg-red-950 border border-red-700 text-red-400">
              <Keyboard className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wider font-japan-wave">
              KasA Artisan Keyboard
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              ({currentTheme.label})
            </span>
          </div>

          {/* Quick Theme Switcher Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(Object.keys(themeStyles) as KeyboardTheme[]).map((thm) => (
              <button
                key={thm}
                type="button"
                onClick={() => onThemeChange && onThemeChange(thm)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                  activeTheme === thm
                    ? "bg-red-600 text-white font-bold shadow-[0_0_8px_#ff0033]"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                {themeStyles[thm].label}
              </button>
            ))}

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white ml-2 cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specialized Developer & Linux Hotkey Tray */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { label: "sudo", action: () => onKeyPress("sudo ") },
            { label: "grep", action: () => onKeyPress("grep ") },
            { label: "ls -la", action: () => onKeyPress("ls -la\n") },
            { label: "cat", action: () => onKeyPress("cat ") },
            { label: "apk", action: () => onSpecialAction ? onSpecialAction("apk") : onKeyPress("apk ") },
            { label: "mesh", action: () => onSpecialAction ? onSpecialAction("mesh") : onKeyPress("mesh ") },
            { label: "slice", action: () => onSpecialAction ? onSpecialAction("slice") : onKeyPress("slice\n") },
            { label: "kasa", action: () => onSpecialAction ? onSpecialAction("kasa") : onKeyPress("kasa ") },
            { label: "clear", action: () => onSpecialAction ? onSpecialAction("clear") : onKeyPress("clear\n") },
            { label: "|", action: () => onKeyPress(" | ") },
            { label: "&&", action: () => onKeyPress(" && ") },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                playKeySound();
                item.action();
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase transition cursor-pointer border ${currentTheme.accentKeyBg} shadow-sm shrink-0`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Keyboard QWERTY Rows */}
        <div className="space-y-1.5 select-none">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1.5">
              {/* Add Shift button on Row 3 */}
              {rIdx === 3 && (
                <button
                  type="button"
                  onClick={() => setIsShift(!isShift)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition flex items-center justify-center cursor-pointer ${
                    isShift ? "bg-red-600 text-white border-white" : `${currentTheme.keyBg} ${currentTheme.keyBorder}`
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}

              {row.map((k) => {
                const char = isShift ? k.toUpperCase() : k;
                const isSelected = activeKey === char;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleKeyClick(char)}
                    className={`min-w-[32px] sm:min-w-[42px] h-10 px-2 rounded-lg text-sm font-bold border transition-all duration-100 flex items-center justify-center cursor-pointer shadow-md ${
                      isSelected
                        ? currentTheme.keyActive
                        : `${currentTheme.keyBg} ${currentTheme.keyBorder}`
                    }`}
                  >
                    <span className="text-white-crisp">{char}</span>
                  </button>
                );
              })}

              {/* Add Backspace on Row 3 */}
              {rIdx === 3 && (
                <button
                  type="button"
                  onClick={() => {
                    playKeySound();
                    onKeyPress("BACKSPACE");
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${currentTheme.keyBg} ${currentTheme.keyBorder}`}
                >
                  <Delete className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          ))}

          {/* Bottom Space Bar Row */}
          <div className="flex justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                playKeySound();
                onKeyPress("TAB");
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border ${currentTheme.keyBg} ${currentTheme.keyBorder} cursor-pointer`}
            >
              TAB
            </button>

            <button
              type="button"
              onClick={() => handleKeyClick(" ")}
              className={`flex-1 max-w-md h-10 rounded-lg text-xs font-bold border tracking-widest text-zinc-300 uppercase transition cursor-pointer shadow-inner ${currentTheme.keyBg} ${currentTheme.keyBorder}`}
            >
              SPACE (KasA)
            </button>

            <button
              type="button"
              onClick={() => {
                playKeySound();
                onKeyPress("ENTER");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white border border-red-400 flex items-center gap-1 cursor-pointer shadow-md shadow-red-950`}
            >
              <CornerDownLeft className="w-4 h-4" />
              <span>RUN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
