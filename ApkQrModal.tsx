import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { 
  QrCode, 
  Smartphone, 
  Download, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { KasaButton } from "./KasaButton";

interface ApkQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  japaneseFont?: boolean;
}

export const ApkQrModal: React.FC<ApkQrModalProps> = ({
  isOpen,
  onClose,
  japaneseFont = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  // Compute absolute URL for APK download
  const downloadUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/download/KasA.apk`
    : "https://ais-dev-ix7fjsonqijzhgdgrjfqhq-436475290161.us-west1.run.app/download/KasA.apk";

  useEffect(() => {
    if (!isOpen) return;

    // Render QR Code onto canvas
    const renderQR = async () => {
      if (!canvasRef.current) return;
      try {
        await QRCode.toCanvas(canvasRef.current, downloadUrl, {
          width: 240,
          margin: 1.5,
          color: {
            dark: "#050507",
            light: "#ffffff"
          },
          errorCorrectionLevel: "M"
        });
        setQrGenerated(true);
      } catch (err) {
        console.error("Failed to render APK QR code:", err);
      }
    };

    // Small timeout to allow modal DOM insertion
    const t = setTimeout(renderQR, 50);
    return () => clearTimeout(t);
  }, [isOpen, downloadUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-950 border-2 border-red-700/90 rounded-2xl shadow-2xl shadow-red-950/80 overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-900/60 bg-gradient-to-r from-red-950/50 via-neutral-950 to-neutral-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-500/70 flex items-center justify-center text-red-400 shadow-md shadow-red-950/50">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold text-white tracking-wide flex items-center gap-1.5 ${japaneseFont ? "font-japanese text-red-100" : ""}`}>
                Scan to Download KasA.apk
              </h3>
              <p className="text-[11px] text-zinc-400">
                Single Standalone Android APK Package
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          {/* Instructions */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5">
              <Smartphone className="w-4 h-4 text-red-400" />
              Point your Phone Camera at the QR code below
            </span>
            <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
              Scan with your Samsung Galaxy S10e or Android camera to instantly download <strong className="text-red-300">KasA-Sovereign-v1.0.apk</strong> directly.
            </p>
          </div>

          {/* QR Code Container with High-Contrast Framing and Katana Edge Accents */}
          <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-red-950/60 border-4 border-red-600/80 group">
            {/* Corner Decorative Tech Markers */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-red-500" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-red-500" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-red-500" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-red-500" />

            <canvas
              ref={canvasRef}
              className="rounded-lg block mx-auto"
              style={{ width: "240px", height: "240px" }}
            />
          </div>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-2 gap-2 w-full text-left">
            <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] text-zinc-200 block">Single Standalone File</span>
                <span className="text-[10px] text-zinc-400">Zero folders or unzipping needed</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-2">
              <Zap className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] text-zinc-200 block">Local Autonomous Engine</span>
                <span className="text-[10px] text-zinc-400">Offline mesh & phone hardware ready</span>
              </div>
            </div>
          </div>

          {/* Direct Link & Copy Action */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
              <span className="font-mono text-zinc-400 truncate max-w-[240px] text-left">
                {downloadUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded text-xs transition cursor-pointer shrink-0 ml-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Android Install Note */}
          <div className="w-full p-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-[10px] text-zinc-400 text-left flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Android:</strong> When prompted, tap <em>"Download anyway"</em> and open the downloaded file. If asked, tap <em>"Allow from this source"</em> to install.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-800/80 bg-neutral-950">
          <KasaButton
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Close
          </KasaButton>
          <KasaButton
            variant="primary"
            size="sm"
            href={downloadUrl}
            download="KasA-Sovereign-v1.0.apk"
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Direct PC Download
          </KasaButton>
        </div>
      </div>
    </div>
  );
};
