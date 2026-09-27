import React, { useState, useRef } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Smartphone, 
  Fingerprint, 
  CreditCard, 
  Cpu, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Clock, 
  Radio, 
  RefreshCw 
} from "lucide-react";
import { SecurityLockStatus, BiometricCredential, KeyfobCredential } from "../types";

interface BiometricKeyfobModalProps {
  isOpen: boolean;
  onClose: () => void;
  securityStatus: SecurityLockStatus;
  onLockSuite: () => void;
  onRefreshStatus: () => void;
  onNotify: (msg: string, type?: "success" | "info" | "warning") => void;
}

export function BiometricKeyfobModal({
  isOpen,
  onClose,
  securityStatus,
  onLockSuite,
  onRefreshStatus,
  onNotify
}: BiometricKeyfobModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"credentials" | "pair_fob" | "enroll_biometric" | "settings">("credentials");
  
  // New Fob Form
  const [fobName, setFobName] = useState("");
  const [fobId, setFobId] = useState("");
  const [fobType, setFobType] = useState<"hardware_fido" | "nfc_rfid" | "virtual_token">("hardware_fido");
  
  // New Biometric Form
  const [bioName, setBioName] = useState("");
  const [bioType, setBioType] = useState<"face" | "id_badge" | "webauthn_passkey" | "fingerprint">("face");
  
  // Auto-lock setting
  const [autoLockMinutes, setAutoLockMinutes] = useState(securityStatus.autoLockMinutes || 15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Pairing New Keyfob
  const handlePairKeyfob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fobName.trim()) {
      onNotify("Please enter a name for the keyfob token.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register-fob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fobName.trim(),
          fobId: fobId.trim() || `FOB-${Math.floor(1000 + Math.random() * 9000)}-AES`,
          type: fobType,
          actor: "scott_gushea_architect"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to pair keyfob");

      onNotify("Hardware keyfob paired and verified successfully!", "success");
      setFobName("");
      setFobId("");
      onRefreshStatus();
      setActiveTab("credentials");
    } catch (err: any) {
      onNotify("Failed to pair keyfob: " + err.message, "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enrolling New Biometric Credential
  const handleEnrollBiometric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioName.trim()) {
      onNotify("Please enter a name for the biometric profile.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register-biometric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bioName.trim(),
          type: bioType,
          actor: "scott_gushea_architect"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to enroll biometric");

      onNotify("Biometric profile enrolled and active!", "success");
      setBioName("");
      onRefreshStatus();
      setActiveTab("credentials");
    } catch (err: any) {
      onNotify("Failed to enroll biometric: " + err.message, "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Settings
  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoLockMinutes,
          actor: "scott_gushea_architect"
        })
      });

      if (!res.ok) throw new Error("Failed to update auto-lock settings");
      onNotify(`Auto-lock interval saved: ${autoLockMinutes} minutes`, "success");
      onRefreshStatus();
    } catch (err: any) {
      onNotify("Failed to save settings: " + err.message, "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-100">
                Keyfob & Cellphone Biometric Manager
              </h3>
              <p className="text-xs text-slate-400">
                Manage hardware tokens, FIDO2 keys, Face ID profiles, and lock perimeter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLockSuite();
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Suite Now</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-medium px-4">
          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "credentials"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Credentials ({securityStatus.registeredFobs.length + securityStatus.registeredBiometrics.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pair_fob")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "pair_fob"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Pair Keyfob</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("enroll_biometric")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "enroll_biometric"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Enroll Face / ID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "settings"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Auto-Lock</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: LIST ACTIVE CREDENTIALS */}
          {activeTab === "credentials" && (
            <div className="space-y-4">
              {/* Biometrics List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                    Cellphone Biometrics & Verified Photo IDs
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("enroll_biometric")}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Enroll New
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {securityStatus.registeredBiometrics.map((bio) => (
                    <div
                      key={bio.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                          {bio.type === "face" ? (
                            <Camera className="w-4 h-4" />
                          ) : bio.type === "id_badge" ? (
                            <CreditCard className="w-4 h-4" />
                          ) : (
                            <Fingerprint className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200">{bio.name}</h4>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[10px] uppercase font-mono rounded bg-slate-800 text-indigo-300 border border-slate-700">
                            {bio.type.replace("_", " ")}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Enrolled: {new Date(bio.enrolledAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyfobs List */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    Paired Hardware Keyfobs & RF/NFC Tokens
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pair_fob")}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Pair Fob
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {securityStatus.registeredFobs.map((fob) => (
                    <div
                      key={fob.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200">{fob.name}</h4>
                          <div className="text-[10px] font-mono text-amber-300/80 mt-0.5">
                            ID: {fob.fobId}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Type: {fob.type.toUpperCase()} • {fob.hardwareSerial || "AES Token"}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Paired
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAIR KEYFOB */}
          {activeTab === "pair_fob" && (
            <form onSubmit={handlePairKeyfob} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Supports USB FIDO2 keys (YubiKey), wireless RF keyfobs, and NFC employee badges.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Keyfob Label / Identifier:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer YubiKey 5C NFC"
                  value={fobName}
                  onChange={(e) => setFobName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Keyfob Type:
                  </label>
                  <select
                    value={fobType}
                    onChange={(e) => setFobType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="hardware_fido">FIDO2 Hardware Key (YubiKey/Titan)</option>
                    <option value="nfc_rfid">NFC / RFID Badge</option>
                    <option value="virtual_token">Cryptographic Rolling Fob</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hardware Fob ID (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generate or enter ID"
                    value={fobId}
                    onChange={(e) => setFobId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span>Pair Keyfob Credential</span>
              </button>
            </form>
          )}

          {/* TAB 3: ENROLL BIOMETRIC */}
          {activeTab === "enroll_biometric" && (
            <form onSubmit={handleEnrollBiometric} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-300 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Enroll a cellphone Face ID signature, employee photo ID card, or native biometric passkey.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Biometric Profile Label:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary Device Face ID or Work Security Badge"
                  value={bioName}
                  onChange={(e) => setBioName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Biometric Verification Modality:
                </label>
                <select
                  value={bioType}
                  onChange={(e) => setBioType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="face">Cellphone Face ID / Optical Facial Mesh</option>
                  <option value="id_badge">Government / Corporate Photo ID Badge</option>
                  <option value="webauthn_passkey">Native Platform Passkey (Android / iOS)</option>
                  <option value="fingerprint">Touch ID / Biometric Fingerprint</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Enroll Biometric Profile</span>
              </button>
            </form>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Inactivity Auto-Lock Interval:
                </label>
                <select
                  value={autoLockMinutes}
                  onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value={0}>Immediate Lock upon Window Blur</option>
                  <option value={5}>5 Minutes of Inactivity</option>
                  <option value={15}>15 Minutes of Inactivity</option>
                  <option value={30}>30 Minutes of Inactivity</option>
                  <option value={60}>1 Hour of Inactivity</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  When locked, access to regression scenarios, prompt studios, and webhook management requires keyfob tap or biometric unlock.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSubmitting}
                className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Save Interval Settings
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>FIDO2 / WebAuthn Active</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
