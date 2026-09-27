import React, { useState, useEffect } from "react";
import { 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Clock, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  Key
} from "lucide-react";
import { PrivacyBlindConfig, PrivacyBlindMode } from "../types";

interface CreatorPrivacyBlindScreenProps {
  config: PrivacyBlindConfig;
  onUpdateConfig: (partial: Partial<PrivacyBlindConfig>) => void;
  onDeactivate: () => void;
  fontWave?: boolean;
}

export const CreatorPrivacyBlindScreen: React.FC<CreatorPrivacyBlindScreenProps> = ({
  config,
  onUpdateConfig,
  onDeactivate,
  fontWave = true
}) => {
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global hotkey listener (Escape or Alt+P to deactivate if no PIN, or focus PIN)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!config.pinRequired) {
          onDeactivate();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config.pinRequired, onDeactivate]);

  if (!config.isActive) return null;

  const handleUnlock = () => {
    if (config.pinRequired) {
      if (pinInput === (config.pinCode || "1234")) {
        setPinInput("");
        setPinError(false);
        onDeactivate();
      } else {
        setPinError(true);
        setTimeout(() => setPinError(false), 2000);
      }
    } else {
      onDeactivate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200">
      {/* Blackout Cloak Mode */}
      {config.mode === "blackout" && (
        <div className="absolute inset-0 bg-neutral-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center">
          {/* Subtle Cyber-Samurai Security Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a0a08_1px,transparent_1px),linear-gradient(to_bottom,#1f0a0a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* Central Privacy Crest */}
          <div className="relative z-10 max-w-md w-full flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-950 to-neutral-900 border-2 border-red-600/80 shadow-[0_0_50px_rgba(220,38,38,0.4)] flex items-center justify-center">
                <EyeOff className="w-12 h-12 text-red-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold border border-red-400 tracking-wider">
                CURTAIN ON
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-wide text-white ${fontWave ? "font-japan-wave" : "font-japanese"}`}>
                Creator Privacy Curtain
              </h1>
              <p className="text-xs text-zinc-400 max-w-sm">
                Active creation workspace is guarded against shoulder-surfing and unauthorized viewing.
              </p>
            </div>

            {/* Time & Clock */}
            <div className="px-5 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-zinc-300 font-mono flex flex-col items-center">
              <span className="text-2xl font-bold text-white tracking-widest">{timeStr}</span>
              <span className="text-[11px] text-zinc-500">{dateStr}</span>
            </div>

            {/* Security Protocol Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Sovereign Creator Sanctuary • Scott Gushea Protected</span>
            </div>

            {/* Unlock Controls */}
            {config.pinRequired ? (
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                    placeholder="Enter 4-digit PIN (default: 1234)"
                    className={`w-full px-4 py-2.5 rounded-xl bg-black border text-center font-mono text-sm tracking-widest text-white focus:outline-none ${
                      pinError ? "border-rose-500 bg-rose-950/30" : "border-red-900 focus:border-red-500"
                    }`}
                  />
                  <button
                    onClick={handleUnlock}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer shrink-0"
                  >
                    Unlock
                  </button>
                </div>
                {pinError && <p className="text-xs text-rose-400 font-medium">Invalid PIN. Try default: 1234</p>}
              </div>
            ) : (
              <button
                onClick={handleUnlock}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(220,38,38,0.5)] transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Dismiss Privacy Curtain</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] text-zinc-500">Curtain Style:</span>
              {(["blackout", "polarized_frost", "camouflage_diagnostic"] as PrivacyBlindMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onUpdateConfig({ mode: m })}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                    config.mode === m 
                      ? "bg-red-950 text-red-300 border border-red-700" 
                      : "bg-neutral-900 text-zinc-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  {m === "blackout" ? "Blackout" : m === "polarized_frost" ? "Frost Mesh" : "Camouflage"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Polarized Frost Shroud Mode */}
      {config.mode === "polarized_frost" && (
        <div 
          onClick={handleUnlock}
          className="absolute inset-0 bg-neutral-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer"
        >
          {/* Heavy security interference stripes */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#00000030,#00000030_10px,#1a050540_10px,#1a050540_20px)] pointer-events-none" />
          
          <div className="relative z-10 max-w-sm rounded-2xl bg-neutral-950/80 border-2 border-cyan-800/80 p-6 shadow-2xl backdrop-blur-md space-y-4">
            <EyeOff className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Polarized Frost Shroud
            </h2>
            <p className="text-xs text-zinc-300">
              Screen content is optically scrambled. Tap anywhere to resume creative work.
            </p>
            <div className="pt-2">
              <span className="px-4 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono text-xs font-bold">
                Tap Screen to Unveil
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Camouflage Diagnostic Shell Mode */}
      {config.mode === "camouflage_diagnostic" && (
        <div 
          onClick={handleUnlock}
          className="absolute inset-0 bg-black p-4 font-mono text-xs text-emerald-400 overflow-hidden cursor-pointer"
        >
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-2 text-zinc-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Chromium OS Kernel 6.1.0-cros-rk3288 (Hisense C11 Node)</span>
              </div>
              <span>[DIAGNOSTIC TELEMETRY MONITOR - CLICK TO DISMISS]</span>
            </div>

            <div className="text-zinc-500 text-[11px]">
              &gt; systemd[1]: Reached target Basic System.<br />
              &gt; kernel: [    0.000000] Linux version 6.1.0-cros (builder@cros-build) (gcc 12.2.0)<br />
              &gt; kernel: [    0.028491] Memory: 2048MB available, 64MB reserved<br />
              &gt; chromeos-boot: TPM verified secure state [HW-TPM: OK]<br />
              &gt; ksm: 42 pages shared, 128 unshared, zero-copy buffer active<br />
              &gt; net: wlan0 Link is Up - 72.2 Mbps, BSSID: 94:83:c4:12:ef:90<br />
              &gt; thermal: zone0 temp 39.4C, fan speed 0 RPM (passive silent)<br />
              &gt; battery: state DISCHARGING, 98% remaining, 6h 12m available<br />
              &gt; crx-container: sandbox seccomp-bpf filters applied strictly<br />
              &gt; display: eDP-1 connected 1366x768+0+0 60Hz (Hisense C11 Chromebook Display)<br />
              &gt; audio: ALSA SoC Rockchip I2S master codec running<br />
              &gt; security: sovereign sandbox locked. No external telemetry active.<br />
            </div>

            <div className="pt-8 text-center text-zinc-600 animate-pulse text-[11px]">
              [Camouflage Blind Active • Click or tap anywhere to return to KasA Creator Sanctuary]
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
