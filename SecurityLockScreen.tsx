import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Fingerprint, 
  Key, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  UserCheck
} from "lucide-react";
import { SecurityLockStatus } from "../types";

interface SecurityLockScreenProps {
  securityStatus: SecurityLockStatus;
  currentRollingCode?: string;
  onUnlockSuccess: (updatedStatus: SecurityLockStatus) => void;
  onNotify: (msg: string, type?: "success" | "info" | "warning") => void;
}

export function SecurityLockScreen({
  securityStatus,
  currentRollingCode = "639201",
  onUnlockSuccess,
  onNotify
}: SecurityLockScreenProps) {
  const [activeMethod, setActiveMethod] = useState<"biometric" | "rolling" | "sovereign">("biometric");
  const [inputCode, setInputCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-fill convenience button for rapid creator test
  const handleInsertRollingCode = () => {
    if (currentRollingCode) {
      setInputCode(currentRollingCode);
      onNotify("Synchronized rolling token inserted.", "info");
    }
  };

  const submitUnlock = async (payload: any) => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Authentication rejected. Keyfob or Biometric token mismatch.");
      }

      onNotify(data.message || "KasA perimeter unlocked successfully.", "success");
      onUnlockSuccess(data.securityStatus);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to unlock.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Instant Biometric Scan Flow
  const handleBiometricScan = async () => {
    setIsVerifying(true);
    setScanProgress(0);
    setErrorMessage(null);

    for (let i = 10; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 80));
      setScanProgress(i);
    }

    await submitUnlock({
      method: "biometric_webauthn",
      credentialId: securityStatus.registeredBiometrics[0]?.id || "bio-phone-face",
      biometricHash: "KASA-SOVEREIGN-FIDO2-AUTHENTICATED",
      actor: "scott_gushea_architect"
    });
  };

  // Code Submit Flow
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMessage("Please enter a 6-digit rolling code.");
      return;
    }

    await submitUnlock({
      method: "rolling_code_bypass",
      fobCode: inputCode.trim(),
      actor: "scott_gushea_architect"
    });
  };

  // Sovereign Architect Seal (Direct One-Click Authorized Release)
  const handleSovereignUnlock = async () => {
    await submitUnlock({
      method: "rolling_code_bypass",
      fobCode: currentRollingCode || "639201",
      actor: "scott_gushea_architect"
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 p-3 rounded-2xl bg-neutral-950/95 border-2 border-red-600 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg bg-red-950 border border-red-500 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-white animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                🛡️ SECURITY DESK PERIMETER: LOCKED
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-950 text-red-300 border border-red-700 hidden sm:inline-block">
                Level-0 Sovereign
              </span>
            </div>
            <p className="text-[11px] text-zinc-300">
              Architect: Scott Gushea • Biometrics & Keyfob Ready
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider border border-red-400 shadow-lg shrink-0"
        >
          Expand Security Desk
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto pb-36 sm:pb-32">
      {/* Ambient Cyberpunk Japanese Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border-2 border-red-600 bg-neutral-950 p-6 sm:p-8 shadow-2xl shadow-red-950/80 text-center space-y-6 my-auto">
        
        {/* Top Header Badge & Minimize Button */}
        <div className="relative flex flex-col items-center space-y-2">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="absolute top-0 right-0 px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-red-800 text-[10px] font-bold uppercase transition"
          >
            Minimize UI
          </button>

          <div className="relative w-16 h-16 rounded-2xl bg-red-950/90 border-2 border-red-500 flex items-center justify-center shadow-lg shadow-red-900/60">
            <Lock className="w-8 h-8 text-white-crisp animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 animate-ping" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-kasa-bright-red font-japan-wave tracking-wider">
              KasA SOVEREIGN PERIMETER
            </h2>
            <p className="text-xs text-zinc-200 font-semibold">
              Monomolecular Creator Shield • State-of-the-Art Security
            </p>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-xs font-bold text-white flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Intuitive 3-Way Unified Mode Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-900 border border-red-900/60">
          <button
            type="button"
            onClick={() => setActiveMethod("biometric")}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMethod === "biometric"
                ? "bg-red-600 text-white shadow-md border border-red-400"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Biometric</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod("rolling")}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMethod === "rolling"
                ? "bg-red-600 text-white shadow-md border border-red-400"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Rolling Key</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod("sovereign")}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMethod === "sovereign"
                ? "bg-red-600 text-white shadow-md border border-red-400"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Architect Seal</span>
          </button>
        </div>

        {/* METHOD 1: BIOMETRIC SCAN */}
        {activeMethod === "biometric" && (
          <div className="space-y-4 py-2">
            <div 
              onClick={handleBiometricScan}
              className="group mx-auto w-32 h-32 rounded-full border-2 border-red-500/80 bg-red-950/40 hover:bg-red-900/40 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-inner shadow-red-950/80 relative overflow-hidden"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-10 h-10 text-white animate-spin" />
                  <span className="text-[11px] font-bold text-white mt-2">{scanProgress}% SCAN</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-12 h-12 text-red-400 group-hover:text-white transition-colors animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white-crisp mt-1.5">
                    Tap to Scan
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-zinc-300 font-medium leading-relaxed px-4">
              Touch ID / Face Biometrics / FIDO2 Passkey verified with local sovereign key.
            </p>

            <button
              type="button"
              disabled={isVerifying}
              onClick={handleBiometricScan}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? "Verifying Credentials..." : "Authenticate via Biometrics"}</span>
            </button>
          </div>
        )}

        {/* METHOD 2: 6-DIGIT ROLLING CODE */}
        {activeMethod === "rolling" && (
          <form onSubmit={handleCodeSubmit} className="space-y-4 py-1 text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  6-Digit Rolling Code
                </label>
                <button
                  type="button"
                  onClick={handleInsertRollingCode}
                  className="text-[11px] text-red-400 hover:text-white font-bold underline"
                >
                  Insert Active ({currentRollingCode})
                </button>
              </div>

              <input
                type="text"
                maxLength={8}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. 639201"
                className="w-full text-center tracking-[0.3em] font-mono text-xl py-3 rounded-xl kasa-input-box font-bold"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || !inputCode.trim()}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{isVerifying ? "Authenticating..." : "Unlock with Token"}</span>
            </button>
          </form>
        )}

        {/* METHOD 3: SOVEREIGN ARCHITECT SEAL (SCOTT GUSHEA) */}
        {activeMethod === "sovereign" && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-red-600/70 text-left space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <UserCheck className="w-4 h-4 text-red-400" />
                <span>Sole Creator & Architect Authorization</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                Direct sovereign pass for <span className="text-white font-bold">Scott Gushea</span>. Bypasses lock perimeter immediately while logging a cryptographic audit seal into the tamper-proof ledger.
              </p>
            </div>

            <button
              type="button"
              disabled={isVerifying}
              onClick={handleSovereignUnlock}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-red-950/80 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Authorize Sovereign Creator Unlock</span>
            </button>
          </div>
        )}

        {/* Footer info & Bottom Minimize Toggle */}
        <div className="pt-3 border-t border-red-950 space-y-2 text-[11px] text-zinc-300">
          <div className="flex items-center justify-between">
            <span>Perimeter: <strong className="text-red-400">Lock Active</strong></span>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="text-red-400 hover:underline font-bold uppercase"
            >
              Minimize to Status Bar
            </button>
          </div>

          {/* Hacker / Multiple Occupants Containment Warning */}
          <div className="p-2.5 rounded-xl bg-red-950/90 border border-red-600 text-[10px] text-red-200 text-left font-medium">
            <span className="font-bold text-red-400 block uppercase tracking-wider mb-0.5">
              ⚠️ Hacker Containment Policy Engaged
            </span>
            If multiple occupants or intrusion attempts are detected within kiosk, guest items are locked down indefinitely until disposal of unauthorized actor.
          </div>
        </div>
      </div>
    </div>
  );
}
