import React, { useState } from "react";
import { 
  X, 
  Laptop, 
  Download, 
  Maximize2, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Lock, 
  ArrowRight,
  ExternalLink,
  Cpu,
  Monitor
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface ChromiumOSKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterKioskFullscreen: () => void;
  isKioskFullscreen: boolean;
  fontWave?: boolean;
}

export const ChromiumOSKioskModal: React.FC<ChromiumOSKioskModalProps> = ({
  isOpen,
  onClose,
  onEnterKioskFullscreen,
  isKioskFullscreen,
  fontWave = true
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [justInstalled, setJustInstalled] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-neutral-950 border-2 border-red-800/80 p-5 sm:p-7 shadow-[0_0_60px_rgba(220,38,38,0.3)] text-zinc-100 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-zinc-400 hover:text-white transition cursor-pointer border border-neutral-800"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-start gap-3.5 border-b border-red-950 pb-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-900 to-neutral-900 border border-red-500/80 flex items-center justify-center shrink-0 shadow-lg shadow-red-950">
            <Monitor className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={`text-xl font-bold text-white tracking-wide ${fontWave ? "font-japan-wave" : "font-japanese"}`}>
                Hisense C11 & Chromium OS Standalone Kiosk
              </h2>
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 text-[10px] font-bold font-mono">
                NO PLAY STORE REQUIRED
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Engineered by Scott Gushea for instant standalone installation on Chromebooks and Chromium OS without Google Play Store dependencies.
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Chromium OS / Chrome Compatible</div>
              <div className="text-[11px] text-zinc-400">PWA Manifest & Service Worker Active</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Creator Air-Gap Safe</div>
              <div className="text-[11px] text-zinc-400">Zero telemetry, local encrypted storage</div>
            </div>
          </div>
        </div>

        {/* Option 1: Native 1-Click Install Button (if browser prompt is ready) */}
        {isInstallable && (
          <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-red-950/70 to-neutral-900 border border-red-600/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span>Instant 1-Click App Installation</span>
              </div>
              <div className="text-xs text-zinc-300">Add KasA directly to your Hisense C11 Chromebook shelf now.</div>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/50 transition transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Install App on Chrome OS
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>KasA is currently running as a standalone native app! You can also toggle Kiosk Fullscreen below.</span>
          </div>
        )}

        {/* Option 2: Step-by-Step Chrome OS Shelf Shortcut (Always works on Hisense C11) */}
        <div className="space-y-3 mb-5">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            How to install on Hisense C11 Chromebook (30-second setup):
          </h3>

          <div className="space-y-2 text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-950 text-red-400 font-bold flex items-center justify-center shrink-0 border border-red-800 font-mono text-[11px]">
                1
              </span>
              <div>
                <strong className="text-white">Click the 3-dots Menu (⋮):</strong> In the top-right corner of Chromium or Chrome on your Hisense C11 screen.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-950 text-red-400 font-bold flex items-center justify-center shrink-0 border border-red-800 font-mono text-[11px]">
                2
              </span>
              <div>
                <strong className="text-white">Select 'Save and share' (or 'More tools'):</strong> Click <span className="text-red-400 font-semibold font-mono">"Install KasA - Personal Ai Catalyst"</span> or <span className="text-red-400 font-semibold font-mono">"Create shortcut..."</span>.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-950 text-red-400 font-bold flex items-center justify-center shrink-0 border border-red-800 font-mono text-[11px]">
                3
              </span>
              <div>
                <strong className="text-white">Check 'Open as window':</strong> Check the box so it launches in clean standalone kiosk mode with no browser tabs or search bars, then click <strong className="text-white">Create / Install</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Option 3: Fullscreen Creator Kiosk Mode */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-red-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div className="space-y-1">
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-cyan-400" />
              <span>Creator Kiosk Mode (Full Display Lock)</span>
            </div>
            <p className="text-xs text-zinc-400">
              Locks into immersive full-screen display, hiding browser frames to give you a dedicated kiosk workstation for your creations.
            </p>
          </div>
          <button
            onClick={() => {
              onEnterKioskFullscreen();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isKioskFullscreen ? "Exit Kiosk Fullscreen" : "Enter Creator Kiosk"}</span>
          </button>
        </div>

        {/* Direct APK Download Alternative */}
        <div className="pt-3 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
          <span>Need a direct Android APK package for sideloading?</span>
          <a
            href="/api/apk/download-direct-apk"
            download="KasA-Sovereign-v1.0.apk"
            className="text-red-400 hover:text-white font-bold transition flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Standalone .APK File</span>
          </a>
        </div>
      </div>
    </div>
  );
};
