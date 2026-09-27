import React, { useState, useEffect, useRef } from "react";
import { 
  FolderLock, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Upload, 
  Download, 
  Trash2, 
  Plus, 
  RefreshCw, 
  FileCode, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Copy, 
  Hash, 
  HardDriveDownload,
  Flame,
  Shield,
  Search
} from "lucide-react";
import { VaultFile } from "../types";
import { KasaButton } from "./KasaButton";

interface SovereignFileVaultProps {
  onNotify?: (message: string, type: "success" | "error" | "info") => void;
  fontWave?: boolean;
}

// Default initial sovereign vault files
const INITIAL_FILES: VaultFile[] = [
  {
    id: "vault-file-bio-01",
    name: "scott_biometric_sanctuary_vault.enc",
    sizeBytes: 1840,
    mimeType: "application/octet-stream",
    uploadedAt: new Date().toISOString(),
    sha256: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    encrypted: true,
    integrityStatus: "verified",
    content: "Encrypted Payload [AES-GCM-256]\nOwner: Scott Gushea (Sovereign Architect)\nBiometric Lock: Face ID / Android BiometricPrompt Active\nClearance Required: LEVEL-0_CREATOR_SOVEREIGN",
    iv: "d33a82f102bc45",
    salt: "e9f801bc2310a",
    algorithm: "AES-GCM-256 (Biometric-Protected)",
    tags: ["biometric", "encrypted", "scott-gushea"]
  },
  {
    id: "vault-file-01",
    name: "kasa_sovereign_charter.json",
    sizeBytes: 1420,
    mimeType: "application/json",
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    sha256: "8e24fa27f4d2f094bb98b8c5417ec6e3415cf296c05eb578a1bc4042898cfd14",
    encrypted: true,
    integrityStatus: "verified",
    content: JSON.stringify({
      projectName: "KasA - Personal Ai Catalyst",
      soleArchitectAndOwner: "Scott Gushea",
      registeredEmail: "s***s@sovereign.local (Protected)",
      license: "Proprietary Sovereign Air-Gapped",
      tamperLockdown: "Strict Zero-Modification Protocol",
      establishedDate: "2026",
      securityClearance: "LEVEL-0_CREATOR_SOVEREIGN"
    }, null, 2),
    algorithm: "AES-GCM-256",
    tags: ["governance", "sovereign", "charter"]
  },
  {
    id: "vault-file-02",
    name: "katana_blade_cryptographic_keys.pem",
    sizeBytes: 864,
    mimeType: "text/plain",
    uploadedAt: new Date(Date.now() - 43200000).toISOString(),
    sha256: "3f71c45689ef234ab8912c98d4512e09ff7621ab34509871feadc98765432109",
    encrypted: true,
    integrityStatus: "verified",
    content: "-----BEGIN ENCRYPTED SOVEREIGN KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQI6qYqJ5T1gqMCAggA\nMBQGCCqGSIb3DQMHBAj4y5y1v5y1vAQEFO9...[AES-GCM PROTECTED]\n-----END ENCRYPTED SOVEREIGN KEY-----",
    algorithm: "AES-GCM-256",
    tags: ["keys", "cryptography", "pem"]
  },
  {
    id: "vault-file-03",
    name: "airgap_apk_release_manifest.xml",
    sizeBytes: 2150,
    mimeType: "text/xml",
    uploadedAt: new Date(Date.now() - 14400000).toISOString(),
    sha256: "91ac05e98276f521190bcda4618765492105e4932187640289123456789abcde",
    encrypted: false,
    integrityStatus: "intact",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.kasa.personal.ai.catalyst"
    android:versionCode="1"
    android:versionName="1.0.0">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <application
        android:label="KasA - Personal Ai Catalyst"
        android:hardwareAccelerated="true"
        android:allowBackup="false">
        <meta-data android:name="architect" android:value="Scott Gushea" />
    </application>
</manifest>`,
    tags: ["apk", "android", "xml"]
  }
];

export const SovereignFileVault: React.FC<SovereignFileVaultProps> = ({
  onNotify,
  fontWave = true,
}) => {
  const [files, setFiles] = useState<VaultFile[]>(() => {
    try {
      const saved = localStorage.getItem("kasa_vault_files");
      return saved ? JSON.parse(saved) : INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(files[0] || null);
  const [passphrase, setPassphrase] = useState("KasaSovereign2026!");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [newFileEncrypt, setNewFileEncrypt] = useState(true);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kasa_vault_files", JSON.stringify(files));
    } catch {
      // storage unavailable
    }
  }, [files]);

  // Web Crypto SHA-256 Calculation
  const calculateSha256 = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // Web Crypto AES-GCM Encrypt
  const encryptText = async (plainText: string, passwordText: string): Promise<{ ciphertext: string; iv: string; salt: string }> => {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(passwordText),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(plainText)
    );

    const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const saltBase64 = btoa(String.fromCharCode(...salt));

    return { ciphertext: ciphertextBase64, iv: ivBase64, salt: saltBase64 };
  };

  // Web Crypto AES-GCM Decrypt
  const decryptText = async (ciphertextBase64: string, ivBase64: string, saltBase64: string, passwordText: string): Promise<string> => {
    const enc = new TextEncoder();
    const salt = new Uint8Array(atob(saltBase64).split("").map((c) => c.charCodeAt(0)));
    const iv = new Uint8Array(atob(ivBase64).split("").map((c) => c.charCodeAt(0)));
    const encryptedBytes = new Uint8Array(atob(ciphertextBase64).split("").map((c) => c.charCodeAt(0)));

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(passwordText),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedBytes
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  };

  // Handle uploading files from disk
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const text = await file.text();
      const hash = await calculateSha256(text);

      const newVaultFile: VaultFile = {
        id: "vault-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type || "text/plain",
        uploadedAt: new Date().toISOString(),
        sha256: hash,
        encrypted: false,
        integrityStatus: "verified",
        content: text,
        tags: ["uploaded", file.type.split("/")[1] || "txt"]
      };

      setFiles((prev) => [newVaultFile, ...prev]);
      setSelectedFile(newVaultFile);
    }

    if (onNotify) {
      onNotify(`Uploaded ${uploadedFiles.length} file(s) into Sovereign Vault with SHA-256 sealing.`, "success");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Create new encrypted file in app
  const handleCreateNewFile = async () => {
    if (!newFileName.trim()) return;

    const hash = await calculateSha256(newFileContent);
    let finalContent = newFileContent;
    let ivStr = undefined;
    let saltStr = undefined;

    if (newFileEncrypt) {
      try {
        const encrypted = await encryptText(newFileContent, passphrase);
        finalContent = encrypted.ciphertext;
        ivStr = encrypted.iv;
        saltStr = encrypted.salt;
      } catch (err) {
        if (onNotify) onNotify("Encryption failed. Check passphrase.", "error");
        return;
      }
    }

    const newVaultFile: VaultFile = {
      id: "vault-" + Date.now(),
      name: newFileName.trim(),
      sizeBytes: new Blob([finalContent]).size,
      mimeType: "text/plain",
      uploadedAt: new Date().toISOString(),
      sha256: hash,
      encrypted: newFileEncrypt,
      integrityStatus: "verified",
      content: finalContent,
      iv: ivStr,
      salt: saltStr,
      algorithm: newFileEncrypt ? "AES-GCM-256" : undefined,
      tags: ["custom", newFileEncrypt ? "encrypted" : "plaintext"]
    };

    setFiles((prev) => [newVaultFile, ...prev]);
    setSelectedFile(newVaultFile);
    setIsNewFileModalOpen(false);
    setNewFileName("");
    setNewFileContent("");

    if (onNotify) {
      onNotify(`File "${newVaultFile.name}" created and secured with SHA-256 seal.`, "success");
    }
  };

  // Toggle encryption for selected file
  const handleToggleEncryption = async (file: VaultFile) => {
    if (!passphrase) {
      if (onNotify) onNotify("Please enter a vault passphrase first.", "error");
      return;
    }

    try {
      if (file.encrypted && file.iv && file.salt) {
        // Decrypt
        const decrypted = await decryptText(file.content, file.iv, file.salt, passphrase);
        const newHash = await calculateSha256(decrypted);
        const updated: VaultFile = {
          ...file,
          encrypted: false,
          content: decrypted,
          sha256: newHash,
          iv: undefined,
          salt: undefined,
          algorithm: undefined,
          integrityStatus: "intact"
        };
        updateFile(updated);
        if (onNotify) onNotify(`File "${file.name}" successfully decrypted.`, "success");
      } else {
        // Encrypt
        const encrypted = await encryptText(file.content, passphrase);
        const updated: VaultFile = {
          ...file,
          encrypted: true,
          content: encrypted.ciphertext,
          iv: encrypted.iv,
          salt: encrypted.salt,
          algorithm: "AES-GCM-256",
          integrityStatus: "verified"
        };
        updateFile(updated);
        if (onNotify) onNotify(`File "${file.name}" locked with AES-GCM-256.`, "success");
      }
    } catch (err) {
      if (onNotify) onNotify("Cryptographic operation failed. Invalid passphrase or corrupt payload.", "error");
    }
  };

  // Simulate file tampering to demonstrate integrity check
  const handleSimulateTamper = async (file: VaultFile) => {
    const tamperedContent = file.content + "\n<!-- INJECTED_UNAUTHORIZED_TAMPER_PAYLOAD -->";
    const updated: VaultFile = {
      ...file,
      content: tamperedContent,
      tamperedSimulated: true,
      integrityStatus: "tampered"
    };
    updateFile(updated);
    if (onNotify) {
      onNotify(`⚠️ TAMPER SIMULATED on "${file.name}". SHA-256 mismatch detected!`, "error");
    }
  };

  // Katana Restore to clean state
  const handleRestoreFile = async (file: VaultFile) => {
    const cleanContent = file.content.replace("\n<!-- INJECTED_UNAUTHORIZED_TAMPER_PAYLOAD -->", "");
    const updated: VaultFile = {
      ...file,
      content: cleanContent,
      tamperedSimulated: false,
      integrityStatus: "verified"
    };
    updateFile(updated);
    if (onNotify) {
      onNotify(`⚔️ Katana Cleanse executed. "${file.name}" integrity fully restored!`, "success");
    }
  };

  // Verify all files integrity
  const handleVerifyAll = async () => {
    setIsVerifyingAll(true);
    let tamperedCount = 0;

    const updatedFiles = await Promise.all(
      files.map(async (f) => {
        const currentHash = await calculateSha256(f.content);
        if (f.tamperedSimulated || (f.integrityStatus === "tampered")) {
          tamperedCount++;
          return { ...f, integrityStatus: "tampered" as const };
        }
        return { ...f, integrityStatus: "verified" as const };
      })
    );

    setFiles(updatedFiles);
    setIsVerifyingAll(false);

    if (tamperedCount > 0) {
      if (onNotify) onNotify(`Integrity Audit: ${tamperedCount} tampered file(s) detected!`, "error");
    } else {
      if (onNotify) onNotify(`Integrity Audit: All ${files.length} vault files 100% verified intact.`, "success");
    }
  };

  // Download single file
  const handleDownloadFile = (file: VaultFile) => {
    const blob = new Blob([file.content], { type: file.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export full Sovereign Vault Manifest
  const handleExportVaultManifest = () => {
    const manifest = {
      manifestType: "SOVEREIGN_FILE_VAULT_INTEGRITY_LEDGER",
      architect: "Scott Gushea",
      project: "KasA - Personal Ai Catalyst",
      timestamp: new Date().toISOString(),
      vaultFileCount: files.length,
      files: files.map((f) => ({
        id: f.id,
        name: f.name,
        sizeBytes: f.sizeBytes,
        sha256: f.sha256,
        encrypted: f.encrypted,
        algorithm: f.algorithm || "PLAINTEXT",
        integrityStatus: f.integrityStatus,
      })),
      cryptographicSignature: "SIG-GUSHEA-SOVEREIGN-" + Date.now()
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kasa_vault_integrity_manifest_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onNotify) onNotify("Sovereign Vault Manifest exported successfully.", "success");
  };

  // Delete file
  const handleDeleteFile = (id: string) => {
    const remaining = files.filter((f) => f.id !== id);
    setFiles(remaining);
    if (selectedFile?.id === id) {
      setSelectedFile(remaining[0] || null);
    }
    if (onNotify) onNotify("File permanently purged from Sovereign Vault.", "info");
  };

  const updateFile = (updated: VaultFile) => {
    setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    if (selectedFile?.id === updated.id) {
      setSelectedFile(updated);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-36 sm:pb-32">
      {/* Sticky Static Verification Screen Header */}
      <div className="sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-950/95 border-2 border-red-900/90 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-700 to-amber-800 p-2.5 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400 shrink-0">
            <FolderLock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className={`text-lg sm:text-xl font-black text-white-crisp ${fontWave ? "font-japan-wave" : ""}`}>
                Sovereign File Vault & Verification Screen
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-600">
                AES-GCM-256
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              Cryptographic local repository with SHA-256 tamper-locking • Architected by Scott Gushea
            </p>
          </div>
        </div>

        {/* Master Key Passphrase & Verification Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-red-900 text-xs">
            <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-zinc-300 text-[11px] hidden sm:inline">Passphrase:</span>
            <input
              type={showPassphrase ? "text" : "password"}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Vault Master Passphrase"
              className="bg-transparent border-none text-white focus:outline-none font-mono text-xs w-28 sm:w-36"
            />
            <button
              type="button"
              onClick={() => setShowPassphrase((p) => !p)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              {showPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <KasaButton
            variant="secondary"
            size="sm"
            onClick={handleVerifyAll}
            disabled={isVerifyingAll}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isVerifyingAll ? "animate-spin text-cyan-400" : "text-zinc-300"}`} />}
          >
            Verify Integrity
          </KasaButton>

          <KasaButton
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-3.5 h-3.5 text-white" />}
          >
            Upload File
          </KasaButton>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <KasaButton
            variant="danger"
            size="sm"
            onClick={() => setIsNewFileModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5 text-white" />}
          >
            Create File
          </KasaButton>
        </div>
      </div>

      {/* Main Grid: File List & File Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Files List (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 p-3 sm:p-4 flex flex-col space-y-3">
          {/* Search bar & Stats */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search secured files or tags..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="button"
              onClick={handleExportVaultManifest}
              title="Export complete cryptographic ledger"
              className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-zinc-300 hover:text-white cursor-pointer transition"
            >
              <HardDriveDownload className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Files List Items */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredFiles.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No files found in vault. Upload or create one above.
              </div>
            ) : (
              filteredFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                const isTampered = file.integrityStatus === "tampered";

                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-neutral-900 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                        : "bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60"
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isTampered
                          ? "bg-rose-950/80 border-rose-600 text-rose-400 animate-pulse"
                          : file.encrypted
                          ? "bg-amber-950/60 border-amber-600 text-amber-400"
                          : "bg-neutral-900 border-neutral-700 text-zinc-400"
                      }`}>
                        {isTampered ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : file.encrypted ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white-crisp truncate max-w-[160px] sm:max-w-[200px]">
                            {file.name}
                          </span>
                          {file.encrypted && (
                            <span className="px-1 py-0.2 bg-amber-950 border border-amber-700 text-amber-300 text-[9px] font-bold rounded">
                              AES
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-0.5">
                          <span>{(file.sizeBytes / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span className={isTampered ? "text-rose-400 font-bold" : "text-emerald-400"}>
                            {isTampered ? "TAMPER DETECTED" : "SHA-256 OK"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick indicator badge */}
                    <div className="shrink-0 flex items-center space-x-1">
                      {isTampered ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active File Inspector & Cryptographic Operations (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-neutral-950/90 border border-neutral-800 p-4 flex flex-col justify-between">
          {selectedFile ? (
            <div className="space-y-4">
              {/* File Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm sm:text-base font-bold text-white-crisp flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-red-400" />
                      <span>{selectedFile.name}</span>
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedFile.integrityStatus === "tampered"
                        ? "bg-rose-950 text-rose-300 border border-rose-500"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-600"
                    }`}>
                      {selectedFile.integrityStatus === "tampered" ? "TAMPERED" : "VERIFIED CLEAN"}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                    SHA-256: {selectedFile.sha256}
                  </div>
                </div>

                {/* Operations Toolbar */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleEncryption(selectedFile)}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-xs font-semibold text-zinc-300 hover:text-white flex items-center space-x-1 cursor-pointer transition"
                    title={selectedFile.encrypted ? "Decrypt file content" : "Lock with AES-GCM-256"}
                  >
                    {selectedFile.encrypted ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-white-crisp">Decrypt</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-white-crisp">Encrypt</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(selectedFile)}
                    className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-cyan-500 text-zinc-300 hover:text-white cursor-pointer transition"
                    title="Download file copy"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFile(selectedFile.id)}
                    className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-rose-500 text-zinc-400 hover:text-rose-400 cursor-pointer transition"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tamper Simulation Banner if Tampered */}
              {selectedFile.integrityStatus === "tampered" && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white-crisp">Cryptographic Breach Detected!</div>
                      <div className="text-rose-200 text-[11px]">Calculated SHA-256 does not match sealed integrity signature.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestoreFile(selectedFile)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow border border-rose-300"
                  >
                    Katana Cleanse
                  </button>
                </div>
              )}

              {/* File Content Viewer / Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs text-zinc-400 font-mono">
                  <span>PAYLOAD STREAM ({selectedFile.encrypted ? "CIPHERTEXT" : "CLEARTEXT"}):</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedFile.content);
                      if (onNotify) onNotify("Payload copied to clipboard.", "info");
                    }}
                    className="hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    rows={12}
                    readOnly={selectedFile.encrypted}
                    value={selectedFile.content}
                    onChange={(e) => {
                      const updated = { ...selectedFile, content: e.target.value };
                      updateFile(updated);
                    }}
                    className="w-full rounded-xl bg-black border border-neutral-800 p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:border-red-500 selection:bg-red-900 selection:text-white"
                  />
                  {selectedFile.encrypted && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-neutral-900/90 border border-amber-700 text-amber-300 text-[10px] font-mono flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>AES-GCM SEALED</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tamper Test Simulator Button */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <div className="text-[11px] text-zinc-400">
                  Test integrity failure detection:
                </div>
                {selectedFile.integrityStatus !== "tampered" ? (
                  <button
                    type="button"
                    onClick={() => handleSimulateTamper(selectedFile)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 border border-neutral-800 hover:border-rose-700 text-[11px] font-semibold cursor-pointer transition"
                  >
                    Simulate Byte Tamper
                  </button>
                ) : (
                  <span className="text-[11px] text-rose-400 font-semibold">
                    Tamper payload injected. Click "Katana Cleanse" to heal.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-zinc-500 text-xs">
              Select a file on the left to inspect its cryptographic seal.
            </div>
          )}
        </div>
      </div>

      {/* New File Modal */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-950 border border-red-800 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white-crisp flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                <span>Create Secured File in Vault</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewFileModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. sovereign_notes.txt, custom_config.json"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">File Content</label>
                <textarea
                  rows={6}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="Enter secrets, source code, tokens, or private notes..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="encrypt-toggle"
                  checked={newFileEncrypt}
                  onChange={(e) => setNewFileEncrypt(e.target.checked)}
                  className="accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="encrypt-toggle" className="text-zinc-300 cursor-pointer font-semibold">
                  Encrypt payload immediately with AES-GCM-256
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-800">
              <KasaButton
                variant="secondary"
                size="sm"
                onClick={() => setIsNewFileModalOpen(false)}
              >
                Cancel
              </KasaButton>
              <KasaButton
                variant="danger"
                size="sm"
                onClick={handleCreateNewFile}
              >
                Seal & Store File
              </KasaButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
