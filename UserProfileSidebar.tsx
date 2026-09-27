import React, { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  Key, 
  Award, 
  FileCheck, 
  Send, 
  Clock, 
  CheckCircle2, 
  X, 
  Sliders, 
  Download, 
  Volume2, 
  Zap, 
  Sparkles, 
  Fingerprint, 
  Smartphone,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers
} from "lucide-react";
import { UserRole, UserProfileRequest, VisualThemeSettings } from "../types";
import { KasaButton } from "./KasaButton";

interface UserProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  themeSettings: VisualThemeSettings;
  onUpdateThemeSettings: (partial: Partial<VisualThemeSettings>) => void;
  onNotify?: (message: string, type: "success" | "error" | "info") => void;
  fontWave?: boolean;
}

export const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  themeSettings,
  onUpdateThemeSettings,
  onNotify,
  fontWave = true,
}) => {
  const [requests, setRequests] = useState<UserProfileRequest[]>([
    {
      id: "req-1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      requestType: "offline_certificate",
      reason: "Issuance of sovereign air-gap deployment certificate for Android APK node.",
      status: "approved",
      approvedBy: "Scott Gushea (Self-Approved Root)"
    },
    {
      id: "req-2",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      requestType: "key_rotation",
      reason: "Biannual cryptographic rolling code rotation for perimeter gate.",
      status: "approved",
      approvedBy: "Scott Gushea (Architect)"
    }
  ]);

  const [newRequestType, setNewRequestType] = useState<UserProfileRequest["requestType"]>("clearance_escalation");
  const [newRequestReason, setNewRequestReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestReason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq: UserProfileRequest = {
        id: "req-" + Date.now(),
        timestamp: new Date().toISOString(),
        requestType: newRequestType,
        reason: newRequestReason.trim(),
        status: "approved", // Sovereign owner auto-approves
        approvedBy: "Scott Gushea (Architect Sovereign Clearance)"
      };

      setRequests((prev) => [newReq, ...prev]);
      setNewRequestReason("");
      setIsSubmitting(false);

      if (onNotify) {
        onNotify(`Profile Request [${newReq.requestType}] submitted and sovereign-approved!`, "success");
      }
    }, 400);
  };

  const handleDownloadOwnershipDeed = () => {
    const deed = {
      deedType: "SOVEREIGN_ARCHITECT_OWNERSHIP_DEED",
      systemName: "KasA - Personal Ai Catalyst",
      soleArchitectAndOwner: "Scott Gushea",
      registeredEmail: "s***s@sovereign.local (Protected)",
      cryptographicHash: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      governanceClause: "No permission is granted to exchange, transfer, or license ownership to any third party. Strictly protected under monomolecular air-gap charter.",
      issuedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(deed, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kasa_ownership_deed_scott_gushea.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onNotify) onNotify("Ownership Deed downloaded successfully.", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in" 
      />

      {/* Slide-out Sidebar */}
      <div className="relative w-full max-w-md bg-neutral-950/95 border-l-2 border-red-800 shadow-2xl h-full flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
        <div className="p-4 sm:p-5 space-y-5">
          {/* Header & Close */}
          <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-700/80 border border-red-400 flex items-center justify-center text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-base font-black text-white-crisp ${fontWave ? "font-japan-wave" : ""}`}>
                  User Identity & Profile
                </h2>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Sovereign Credentials & Requests
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-zinc-400 hover:text-white cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Card: Scott Gushea */}
          <div className="rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-red-700/80 p-4 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black border-2 border-red-500 shadow-lg flex items-center justify-center">
                  <img
                    src="/kasa-android-icon.jpg"
                    alt="Scott Gushea Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center" title="Online & Air-Gapped" />
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm sm:text-base font-black text-white-crisp font-japan-wave">
                    Scott Gushea
                  </h3>
                  <span className="px-1.5 py-0.2 rounded bg-red-600 text-[9px] font-bold text-white uppercase">
                    ROOT
                  </span>
                </div>
                <p className="text-xs text-red-300 font-medium mt-0.5">
                  Sole Creator, Architect & Owner
                </p>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  s***s@sovereign.local • Privacy Shield Active
                </div>
              </div>
            </div>

            {/* Registration First, Biometrics & Digital Brand Entry Setup */}
            <div className="rounded-2xl bg-neutral-900 border border-red-700/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">
                    Kiosk Registry & Digital Brand
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 text-[9px] font-extrabold">
                  DIGITAL BRANDED
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 leading-relaxed">
                First entry visitors are marked with a cryptographic digital brand token. Multiple occupants detected within kiosk will trigger lockdown containment.
              </p>

              <div className="space-y-2 pt-1 border-t border-neutral-800 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-black border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-red-400" />
                    <span className="font-bold text-white">Registered Name</span>
                  </div>
                  <span className="text-red-300 font-mono font-bold">Scott Gushea</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-white">Digital Brand ID</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[10px]">BRAND-SG-9904-X</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">Biometric Status</span>
                  </div>
                  <span className="text-emerald-400 font-extrabold text-[10px]">ACTIVE & BOUND</span>
                </div>
              </div>
            </div>

            {/* Clearance & Biometric Indicators */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 text-[11px]">
              <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-zinc-400 block text-[9px] uppercase font-mono">Clearance Level</span>
                <span className="font-bold text-amber-400">LEVEL-0 SOVEREIGN</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-zinc-400 block text-[9px] uppercase font-mono">Biometrics</span>
                <span className="font-bold text-emerald-400">Synced & Enforced</span>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                Active Security Persona
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["creator", "admin", "qa_engineer", "viewer"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onRoleChange(r);
                      if (onNotify) onNotify(`Persona shifted to ${r.toUpperCase()}.`, "info");
                    }}
                    className={`py-1 px-2 rounded-lg text-xs font-semibold text-center border cursor-pointer transition ${
                      currentRole === r
                        ? "bg-red-700 text-white border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : "bg-neutral-950 text-zinc-400 hover:text-white border-neutral-800 hover:bg-neutral-900"
                    }`}
                  >
                    {r === "creator" ? "Creator (Scott)" : r.replace("_", " ").toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadOwnershipDeed}
              className="w-full py-1.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-800/80 hover:border-red-500 text-zinc-200 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span className="text-white-crisp">Download Cryptographic Ownership Deed</span>
            </button>
          </div>

          {/* Profile Requests Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white-crisp">
                  Profile & Clearance Requests
                </h4>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {requests.length} Requests Filed
              </span>
            </div>

            {/* Submit New Request Form */}
            <form onSubmit={handleSubmitRequest} className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Request Type</label>
                <select
                  value={newRequestType}
                  onChange={(e) => setNewRequestType(e.target.value as UserProfileRequest["requestType"])}
                  className="w-full bg-black border border-neutral-700 rounded-lg p-1.5 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="clearance_escalation">Clearance Escalation (Root Access)</option>
                  <option value="biometric_sync">Biometric FIDO2 Passkey Sync</option>
                  <option value="offline_certificate">Offline Air-Gap Certificate</option>
                  <option value="key_rotation">Cryptographic Key Rotation</option>
                  <option value="audit_export">Full System Audit Ledger Export</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Justification / Reason</label>
                <input
                  type="text"
                  value={newRequestReason}
                  onChange={(e) => setNewRequestReason(e.target.value)}
                  placeholder="e.g. Authorized security upgrade for sovereign node..."
                  className="w-full bg-black border border-neutral-700 rounded-lg p-1.5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <KasaButton
                type="submit"
                variant="danger"
                size="sm"
                className="w-full justify-center"
                disabled={isSubmitting || !newRequestReason.trim()}
                icon={<Send className="w-3 h-3" />}
              >
                Submit Sovereign Request
              </KasaButton>
            </form>

            {/* Requests History List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {requests.map((req) => (
                <div key={req.id} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white-crisp capitalize">
                      {req.requestType.replace("_", " ")}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[9px] font-bold">
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{req.reason}</p>
                  <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-0.5">
                    <span>{new Date(req.timestamp).toLocaleTimeString()}</span>
                    <span>{req.approvedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower-Tiered Quick Upgrades & QOL Toggles */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white-crisp">
                QOL & Interface Tuning
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              {/* Lag-Prevention Turbo */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white-crisp">Lag Prevention Turbo</div>
                  <div className="text-[10px] text-zinc-400">Lock GPU to 60 FPS</div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateThemeSettings({ lagPreventionTurbo: !themeSettings.lagPreventionTurbo })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    themeSettings.lagPreventionTurbo ? "bg-emerald-600" : "bg-neutral-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    themeSettings.lagPreventionTurbo ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              {/* Japanese Wave Font */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white-crisp">Japan Wave Typography</div>
                  <div className="text-[10px] text-zinc-400">Kanji artistic accents</div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateThemeSettings({ fontWaveEnabled: !themeSettings.fontWaveEnabled })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    themeSettings.fontWaveEnabled ? "bg-red-600" : "bg-neutral-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    themeSettings.fontWaveEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              {/* Voice Narration */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white-crisp">Voice Narration</div>
                  <div className="text-[10px] text-zinc-400">Spoken catalyst feedback</div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateThemeSettings({ voiceNarrationEnabled: !themeSettings.voiceNarrationEnabled })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    themeSettings.voiceNarrationEnabled ? "bg-red-600" : "bg-neutral-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    themeSettings.voiceNarrationEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 text-center text-[11px] text-zinc-500 font-mono">
          KasA • Air-Gapped Sovereign System • Scott Gushea
        </div>
      </div>
    </div>
  );
};
