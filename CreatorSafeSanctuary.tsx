import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  EyeOff, 
  Lock, 
  Unlock, 
  FolderLock, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  Stamp, 
  AlertTriangle,
  Feather,
  Cpu,
  Layers,
  Shield,
  Eye,
  Hash
} from "lucide-react";
import { CreatorWorkDraft, PrivacyBlindConfig } from "../types";

interface CreatorSafeSanctuaryProps {
  onNotify: (msg: string, type?: "success" | "info" | "warning") => void;
  onEngagePrivacyBlind: () => void;
  onNavigateToVault: () => void;
  fontWave?: boolean;
}

const DEFAULT_DRAFTS: CreatorWorkDraft[] = [
  {
    id: "draft-kasa-core-architecture",
    title: "KasA Autonomous Air-Gap Catalyst Architecture",
    category: "system_design",
    content: `# KasA Autonomous Air-Gap Catalyst Architecture
Architect & Sole Creator: Scott Gushea
Security Clearance: Absolute Sovereign Air-Gap

## 1. Executive Summary
KasA operates as a zero-cloud, client-side autonomous catalyst designed to defend intellectual property and creative outputs.

## 2. Core Pillars
- Local In-Memory Cryptographic derivations (PBKDF2 100k + AES-GCM-256).
- Tamper-proof SHA-256 Provenance Stamping.
- Anti-Shoulder Surfing Visual Curtain for Kiosk & Chromebook installations.
- Total Air-Gap Sovereignty: No data leaves this device.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sha256Seal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    owner: "Scott Gushea",
    watermarkText: "CONFIDENTIAL • SCOTT GUSHEA • SOVEREIGN ASSET",
    isEncryptedInVault: true,
    tags: ["IP-PROTECTED", "AUTONOMOUS", "SYSTEM-DESIGN"]
  },
  {
    id: "draft-cyber-samurai-narrative",
    title: "The Neon Ronin: Chapter 1 Blueprint",
    category: "script",
    content: `SCENE 1: THE WATERFRONT KOI SANCTUARY - NIGHT
Neon rain falls across the obsidian stone lantern.
A shadowy figure in a broad-brimmed crimson Kasa stands motionless.

RONIN
"The blade only protects what you have the courage to guard."

He unsheathes the Muramasa. A thin glowing line cuts the mist.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sha256Seal: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    owner: "Scott Gushea",
    watermarkText: "CREATIVE DRAFT • SCOTT GUSHEA • COPYRIGHT RESERVED",
    isEncryptedInVault: false,
    tags: ["CREATIVE-STORY", "SCRIPT"]
  }
];

export const CreatorSafeSanctuary: React.FC<CreatorSafeSanctuaryProps> = ({
  onNotify,
  onEngagePrivacyBlind,
  onNavigateToVault,
  fontWave = true
}) => {
  const [drafts, setDrafts] = useState<CreatorWorkDraft[]>(() => {
    try {
      const saved = localStorage.getItem("kasa_creator_drafts");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_DRAFTS;
  });

  const [activeDraftId, setActiveDraftId] = useState<string>(drafts[0]?.id || "");
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"editor" | "provenance" | "settings">("editor");

  const activeDraft = drafts.find((d) => d.id === activeDraftId) || drafts[0];

  // Helper to calculate SHA-256 hash using Web Crypto API
  const calculateSha256 = async (text: string): Promise<string> => {
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      return "hash-unavailable-offline";
    }
  };

  // Update active draft content and re-seal hash
  const handleContentChange = async (newContent: string) => {
    if (!activeDraft) return;
    const newHash = await calculateSha256(newContent);
    const updatedDrafts = drafts.map((d) => {
      if (d.id === activeDraft.id) {
        return {
          ...d,
          content: newContent,
          updatedAt: new Date().toISOString(),
          sha256Seal: newHash
        };
      }
      return d;
    });
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem("kasa_creator_drafts", JSON.stringify(updatedDrafts));
    } catch {
      // ignore
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (!activeDraft) return;
    const updatedDrafts = drafts.map((d) => {
      if (d.id === activeDraft.id) {
        return { ...d, title: newTitle, updatedAt: new Date().toISOString() };
      }
      return d;
    });
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem("kasa_creator_drafts", JSON.stringify(updatedDrafts));
    } catch {}
  };

  const handleCreateNewDraft = async () => {
    const newId = "draft-" + Date.now();
    const initialText = `# Untitled Creation\nAuthor: Scott Gushea\nDate: ${new Date().toLocaleDateString()}\n\nEnter your confidential creative ideas, inventions, or blueprints here...`;
    const initialHash = await calculateSha256(initialText);
    const newDraft: CreatorWorkDraft = {
      id: newId,
      title: "Untitled Creation " + (drafts.length + 1),
      category: "invention",
      content: initialText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sha256Seal: initialHash,
      owner: "Scott Gushea",
      watermarkText: "CONFIDENTIAL • SCOTT GUSHEA",
      isEncryptedInVault: false,
      tags: ["DRAFT"]
    };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    setActiveDraftId(newId);
    try {
      localStorage.setItem("kasa_creator_drafts", JSON.stringify(updated));
    } catch {}
    onNotify("Created new protected creation canvas", "success");
  };

  const handleDeleteDraft = (id: string) => {
    if (drafts.length <= 1) {
      onNotify("You must maintain at least one protected draft.", "warning");
      return;
    }
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    setActiveDraftId(updated[0]?.id || "");
    try {
      localStorage.setItem("kasa_creator_drafts", JSON.stringify(updated));
    } catch {}
    onNotify("Draft removed from local sanctuary", "info");
  };

  // Export Provenance Certificate
  const handleExportCertificate = () => {
    if (!activeDraft) return;
    const certText = `===============================================================
       KASA SOVEREIGN CREATOR PROVENANCE CERTIFICATE
===============================================================
TITLE: ${activeDraft.title}
AUTHOR & ARCHITECT: ${activeDraft.owner}
CATEGORY: ${activeDraft.category.toUpperCase()}
CREATED AT: ${activeDraft.createdAt}
LAST SEALED: ${activeDraft.updatedAt}
CRYPTOGRAPHIC DIGEST (SHA-256):
${activeDraft.sha256Seal}

LEGAL ATTESTATION:
This document certifies that the creative, inventive, and intellectual
work contained within this record was composed on the sovereign KasA
kiosk environment under the exclusive ownership of Scott Gushea.
Tampering with this hash invalidates cryptographic verification.
===============================================================

CONTENT PREVIEW:
${activeDraft.content}
`;

    const blob = new Blob([certText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDraft.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_provenance.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("Provenance certificate downloaded successfully", "success");
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Easy to Digest Creator Safety Header */}
      <div className="rounded-2xl bg-neutral-950 border-2 border-red-900/80 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md">
                <Feather className="w-4 h-4" />
              </div>
              <h1 className={`text-xl sm:text-2xl font-bold text-white tracking-wide ${fontWave ? "font-japan-wave" : "font-japanese"}`}>
                Creator Safe Sanctuary
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-600 text-red-300 text-[10px] font-bold font-mono tracking-wider">
                PROTECTED KIOSK WORKSPACE
              </span>
            </div>
            <p className="text-xs text-zinc-300 max-w-2xl">
              A private, distraction-free creative sanctuary designed to safeguard your inventions, scripts, formulas, and intellectual property. All files stay 100% on your device with cryptographic proof of authorship.
            </p>
          </div>

          {/* Quick Creator Safety Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Privacy Curtain Trigger */}
            <button
              onClick={onEngagePrivacyBlind}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-red-800/80 hover:border-red-500 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              title="Activate anti-shoulder-surfing privacy screen immediately"
            >
              <EyeOff className="w-4 h-4 text-red-400" />
              <span>Privacy Blind</span>
            </button>

            {/* Toggle Watermark Overlay */}
            <button
              onClick={() => setShowWatermark(!showWatermark)}
              className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                showWatermark
                  ? "bg-red-950 text-red-300 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                  : "bg-neutral-900 text-zinc-400 border-neutral-800 hover:text-white"
              }`}
              title="Toggle diagonal micro-watermarking across workspace"
            >
              <Stamp className="w-4 h-4" />
              <span>{showWatermark ? "Watermark ON" : "Watermark"}</span>
            </button>

            {/* Navigate to AES-256 File Vault */}
            <button
              onClick={onNavigateToVault}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              title="Open Sovereign AES-256 Cryptographic File Vault"
            >
              <FolderLock className="w-4 h-4 text-amber-200" />
              <span>AES-256 Vault</span>
            </button>

            {/* New Creation Button */}
            <button
              onClick={handleCreateNewDraft}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Draft</span>
            </button>
          </div>
        </div>

        {/* Reassuring Creator Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-neutral-900 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Air-Gap Sealed: <strong className="text-zinc-200">Local Only</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-red-400 shrink-0" />
            <span>Owner: <strong className="text-red-300">Scott Gushea</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Integrity Seal: <strong className="text-zinc-200 font-mono text-[11px]">SHA-256 Active</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Kiosk Hardware: <strong className="text-zinc-200">Hisense C11</strong></span>
          </div>
        </div>
      </div>

      {/* Main Sanctuary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Drafts Drawer (4 columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-400" />
              <span>Your Protected Creations ({drafts.length})</span>
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {drafts.map((d) => {
              const isSelected = d.id === activeDraft?.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDraftId(d.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? "bg-neutral-900 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                      : "bg-neutral-950/70 hover:bg-neutral-900 border-neutral-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 overflow-hidden">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-red-400" : "text-zinc-500"}`} />
                        <span>{d.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                        <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-zinc-300 uppercase">
                          {d.category.replace("_", " ")}
                        </span>
                        <span>•</span>
                        <span>{new Date(d.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDraft(d.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-950/60 text-zinc-500 hover:text-rose-400 transition"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 text-[10px] text-zinc-500 font-mono truncate">
                    SHA: {d.sha256Seal.slice(0, 16)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Protected Canvas (8 columns) */}
        <div className="lg:col-span-8 space-y-3">
          {activeDraft ? (
            <div className="rounded-2xl bg-neutral-950 border border-red-950/80 p-4 sm:p-5 shadow-2xl relative">
              {/* Optional Subtle Diagonal Watermark Overlay */}
              {showWatermark && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none z-10 opacity-15">
                  <div className="text-zinc-400 font-mono text-2xl font-bold tracking-widest rotate-[-25deg] whitespace-nowrap">
                    {activeDraft.watermarkText || "CONFIDENTIAL CREATION • SCOTT GUSHEA"}
                  </div>
                </div>
              )}

              {/* Editor Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-3 mb-4">
                <input
                  type="text"
                  value={activeDraft.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-base sm:text-lg font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder-zinc-500"
                  placeholder="Creation Title..."
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportCertificate}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    title="Export Cryptographic Provenance Certificate"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Certificate</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeDraft.content);
                      onNotify("Content copied securely to clipboard", "success");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    title="Copy draft"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Textarea Workspace */}
              <textarea
                value={activeDraft.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={16}
                className="w-full bg-black/60 border border-neutral-900 rounded-xl p-4 text-xs sm:text-sm font-mono text-zinc-200 focus:outline-none focus:border-red-600 transition leading-relaxed resize-y relative z-0"
                placeholder="Begin drafting your proprietary idea, invention, or story..."
              />

              {/* Cryptographic Footprint Footer */}
              <div className="mt-3 pt-3 border-t border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2 overflow-hidden truncate">
                  <Stamp className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-zinc-500">Live SHA-256 Digest:</span>
                  <span className="text-red-300 font-mono truncate">{activeDraft.sha256Seal}</span>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span>Words: <strong className="text-zinc-200">{activeDraft.content.trim().split(/\s+/).filter(Boolean).length}</strong></span>
                  <span>•</span>
                  <span>Chars: <strong className="text-zinc-200">{activeDraft.content.length}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500">
              No draft selected. Create a new one to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
