import React, { useState } from "react";
import { ShieldAlert, Lock, Activity, Zap } from "lucide-react";
import { SecurityLockStatus } from "../types";

interface Props {
  securityStatus: SecurityLockStatus;
  onOverride: () => void;
}

export function FirewallQuarantineScreen({ securityStatus, onOverride }: Props) {
  const [overrideCode, setOverrideCode] = useState("");
  const [error, setError] = useState("");

  const handleOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (overrideCode === "MURAMASA" || overrideCode === "GUSHEA-OVERRIDE") {
      onOverride();
    } else {
      setError("Invalid Sovereign Override Code. Firewall remains sealed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-red-950/90 flex flex-col items-center justify-center backdrop-blur-md font-mono text-red-500 selection:bg-red-900 selection:text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
      
      <div className="max-w-2xl w-full mx-4 bg-black/80 border border-red-600 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.5)] p-8 relative overflow-hidden">
        {/* Animated Scanner line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[scan_2s_ease-in-out_infinite]" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-red-900/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
            Firewall Quarantine Containment
          </h1>
          <p className="text-red-400 font-bold tracking-wider">
            THREAT DETECTED. ALL TRAFFIC DROPPED.
          </p>
        </div>

        <div className="bg-red-950/50 border border-red-800 rounded p-4 mb-8 text-sm">
          <div className="flex items-center gap-2 mb-2 text-red-300">
            <Activity className="w-4 h-4" />
            <span>Intrusion Prevention System (IPS) Activated</span>
          </div>
          <p className="text-red-400/80 mb-2">
            The KasA Sovereign engine has intercepted unauthorized lateral movement within the kiosk perimeter.
            To protect Scott Gushea's cryptographic files, a Class-1 quarantine is now in effect.
          </p>
          <ul className="list-disc pl-5 text-red-500/70 space-y-1">
            <li>Port 80/443: TCP RST sent to external nodes</li>
            <li>Local Node Access: Locked</li>
            <li>Audit Logging: Writing to WORM storage</li>
          </ul>
        </div>

        <form onSubmit={handleOverride} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-red-500 mb-1 uppercase tracking-wider">
              Sovereign Architect Override
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-red-700" />
              <input
                type="password"
                value={overrideCode}
                onChange={(e) => { setOverrideCode(e.target.value); setError(""); }}
                className="w-full bg-black border border-red-800 rounded pl-10 pr-4 py-2 text-red-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
                placeholder="Enter bypass code..."
                autoFocus
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-xs font-bold bg-red-950 p-2 rounded">
              [!] {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-4 rounded border border-red-700 hover:border-red-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Execute Quarantine Purge
          </button>
        </form>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(400px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
