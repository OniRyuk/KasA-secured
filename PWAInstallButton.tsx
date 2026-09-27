import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { Download, Smartphone, Check, X, Info } from "lucide-react";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as standalone or WebAPK installed, show clean badge
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-medium" title="Running natively in standalone WebAPK mode">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span>Standalone APK Active</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  return (
    <>
      {/* Chromium / Android / Desktop Install */}
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-900/30 transition transform active:scale-95 cursor-pointer"
          title="Install as Android WebAPK / Standalone Application"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install WebAPK</span>
        </button>
      )}

      {/* iOS Safari Flow */}
      {isIOS && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          title="Install to iOS Home Screen"
        >
          <Smartphone className="w-3.5 h-3.5 text-purple-400" />
          <span>Install on iOS</span>
        </button>
      )}

      {/* iOS Safari Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-sm text-slate-100">Install ChatGPT Regression Suite</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px] border border-indigo-700">1</span>
                <span>Tap the <strong className="text-white">Share</strong> button in your Safari navigation bar (square with arrow up).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px] border border-indigo-700">2</span>
                <span>Scroll down and select <strong className="text-white">Add to Home Screen</strong>.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px] border border-indigo-700">3</span>
                <span>Tap <strong className="text-white">Add</strong> in the top right to launch full-screen standalone.</span>
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
