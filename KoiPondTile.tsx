import React, { useEffect, useRef, useState } from "react";
import { Play, Sparkles, Volume2, Waves, RotateCcw } from "lucide-react";
import { KasaSwordEmblem } from "./KasaSwordEmblem";

interface KoiFish {
  x: number;
  y: number;
  angle: number;
  speed: number;
  turnSpeed: number;
  size: number;
  color: string;
  finPhase: number;
}

interface WaterDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface KoiPondTileProps {
  onBurst?: () => void;
  onNarrationTrigger?: (text: string) => void;
  className?: string;
}

export const KoiPondTile: React.FC<KoiPondTileProps> = ({
  onBurst,
  onNarrationTrigger,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSubmerged, setIsSubmerged] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [hasBurst, setHasBurst] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  // Koi simulation state
  const koiListRef = useRef<KoiFish[]>([
    { x: 70, y: 90, angle: 0.8, speed: 1.2, turnSpeed: 0.02, size: 28, color: "#ffffff", finPhase: 0 },
    { x: 180, y: 140, angle: 2.2, speed: 1.0, turnSpeed: -0.015, size: 34, color: "#ef4444", finPhase: 1.2 },
    { x: 120, y: 220, angle: -1.1, speed: 1.4, turnSpeed: 0.03, size: 26, color: "#f97316", finPhase: 2.5 },
  ]);

  const ripplesRef = useRef<{ x: number; y: number; radius: number; alpha: number }[]>([]);
  const dropsRef = useRef<WaterDrop[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Play water splash sound
  const playSplashSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Water splash white noise burst
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Resonant chime
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "sine";
      chime.frequency.setValueAtTime(523.25, ctx.currentTime + 0.05); // C5
      chime.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.2); // C6
      chimeGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(ctx.currentTime + 0.05);
      chime.stop(ctx.currentTime + 0.65);
    } catch {
      // Audio context policy
    }
  };

  // Canvas render loop for realistic swimming koi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 340);
    let height = (canvas.height = canvas.offsetHeight || 280);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep water gradient
      const waterGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width);
      waterGrad.addColorStop(0, "#0a0305");
      waterGrad.addColorStop(0.6, "#140407");
      waterGrad.addColorStop(1, "#050102");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // Water light caustics
      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const t = Date.now() * 0.001 + i;
        ctx.arc(width / 2 + Math.cos(t) * 40, height / 2 + Math.sin(t * 0.8) * 30, 40 + i * 25, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Submerged Kasa if emerging
      if (isSubmerged || isBursting) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.globalAlpha = isBursting ? 0.3 : 0.75;
        // Submerged crimson hat silhouette
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220, 38, 38, 0.45)";
        ctx.shadowColor = "#ff0033";
        ctx.shadowBlur = 20;
        ctx.fill();

        ctx.strokeStyle = "#ff1744";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-35, 10);
        ctx.lineTo(0, -25);
        ctx.lineTo(35, 10);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Update & Draw Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 1.8;
        r.alpha -= 0.015;
        if (r.alpha <= 0) {
          ripplesRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 60, 80, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#ff0033";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // Update & Draw Swimming Koi Fish
      const koiList = koiListRef.current;
      koiList.forEach((koi) => {
        // Organic wandering motion
        koi.angle += (Math.random() - 0.5) * 0.08 + koi.turnSpeed;
        koi.x += Math.cos(koi.angle) * koi.speed;
        koi.y += Math.sin(koi.angle) * koi.speed;
        koi.finPhase += 0.12;

        // Bounce back from pond edges smoothly
        const margin = 35;
        if (koi.x < margin) koi.angle = 0 + (Math.random() - 0.5);
        if (koi.x > width - margin) koi.angle = Math.PI + (Math.random() - 0.5);
        if (koi.y < margin) koi.angle = Math.PI / 2 + (Math.random() - 0.5);
        if (koi.y > height - margin) koi.angle = -Math.PI / 2 + (Math.random() - 0.5);

        ctx.save();
        ctx.translate(koi.x, koi.y);
        ctx.rotate(koi.angle);

        // Soft shadow underneath koi
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(4, 6, koi.size * 0.7, koi.size * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Koi Body Sinuous Shape
        const tailOffset = Math.sin(koi.finPhase) * 4;
        ctx.fillStyle = koi.color;
        ctx.shadowColor = koi.color === "#ef4444" ? "#ff0033" : "rgba(255,255,255,0.4)";
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(koi.size * 0.6, 0); // Head
        ctx.quadraticCurveTo(0, koi.size * 0.32, -koi.size * 0.6 + tailOffset, tailOffset * 0.5); // Right flank to tail
        ctx.quadraticCurveTo(0, -koi.size * 0.32, koi.size * 0.6, 0); // Left flank back to head
        ctx.fill();

        // Crimson markings on white koi
        if (koi.color === "#ffffff") {
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.ellipse(0, 0, koi.size * 0.25, koi.size * 0.15, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pectoral Fins waving
        const finWiggle = Math.sin(koi.finPhase * 1.5) * 0.2;
        ctx.fillStyle = koi.color;
        ctx.globalAlpha = 0.75;
        // Left fin
        ctx.beginPath();
        ctx.ellipse(koi.size * 0.1, -koi.size * 0.3, koi.size * 0.25, koi.size * 0.12, -0.4 + finWiggle, 0, Math.PI * 2);
        ctx.fill();
        // Right fin
        ctx.beginPath();
        ctx.ellipse(koi.size * 0.1, koi.size * 0.3, koi.size * 0.25, koi.size * 0.12, 0.4 - finWiggle, 0, Math.PI * 2);
        ctx.fill();

        // Tail Fin
        ctx.beginPath();
        ctx.moveTo(-koi.size * 0.6 + tailOffset, tailOffset * 0.5);
        ctx.lineTo(-koi.size * 0.95 + tailOffset * 1.5, -koi.size * 0.2 + tailOffset);
        ctx.lineTo(-koi.size * 0.95 + tailOffset * 1.5, koi.size * 0.2 + tailOffset);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      // Update & Draw Burst Water Drops
      for (let i = dropsRef.current.length - 1; i >= 0; i--) {
        const d = dropsRef.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.15; // gravity
        d.alpha -= 0.02;
        if (d.alpha <= 0) {
          dropsRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 210, ${d.alpha})`;
        ctx.shadowColor = "#ff0033";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSubmerged, isBursting]);

  // Handle Pond Tap / Click
  const handlePondClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add ripples at click position
    ripplesRef.current.push({ x, y, radius: 8, alpha: 0.9 });
    ripplesRef.current.push({ x, y, radius: 4, alpha: 0.7 });

    // Scatter koi away from touch
    koiListRef.current.forEach((koi) => {
      const dx = koi.x - x;
      const dy = koi.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        koi.angle = Math.atan2(dy, dx);
        koi.speed = 3.2; // scatter burst
        setTimeout(() => {
          koi.speed = 1.2;
        }, 800);
      }
    });

    if (!isBursting) {
      triggerKasaBurst();
    }
  };

  // Trigger the dramatic Kasa burst out of the water
  const triggerKasaBurst = () => {
    setIsSubmerged(true);
    playSplashSound();

    // Spawn splash droplets
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 : 170;
    const cy = canvas ? canvas.height / 2 : 140;

    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.5;
      dropsRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.95,
      });
    }

    // Delay 200ms then trigger full burst animation onto screen
    setTimeout(() => {
      setIsBursting(true);
      setHasBurst(true);
      setBurstCount((prev) => prev + 1);

      if (onBurst) {
        onBurst();
      }

      if (onNarrationTrigger) {
        onNarrationTrigger("KasA has emerged from the sanctuary depths. Sovereign Catalyst awakened.");
      }
    }, 220);

    // Reset burst effect after display
    setTimeout(() => {
      setIsBursting(false);
      setIsSubmerged(false);
    }, 3800);
  };

  return (
    <div className={`relative rounded-2xl bg-neutral-950 border-2 border-red-800/80 p-5 shadow-2xl overflow-hidden ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-red-900/60 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-600/70 flex items-center justify-center text-red-400">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide font-japan-wave flex items-center gap-1.5">
              <span>Koi Pond Sanctuary</span>
              <span className="text-[10px] text-red-400 font-mono font-normal">・ 錦鯉</span>
            </h3>
            <p className="text-[11px] text-zinc-300">
              Interactive water sanctuary. Tap the water to summon the surging Kasa catalyst.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={triggerKasaBurst}
          disabled={isBursting}
          className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-red-950/80 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isBursting ? "Emerging..." : "Summon KasA"}</span>
        </button>
      </div>

      {/* Interactive Water Pond Canvas */}
      <div
        onClick={handlePondClick}
        className="relative w-full h-64 rounded-xl border border-red-900/80 overflow-hidden cursor-pointer group shadow-inner"
        title="Tap the pond to disturb the water and burst out the KasA hat"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Ambient Overlay Glint */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-red-950/20 via-transparent to-transparent" />

        {/* Hint banner */}
        {!isBursting && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 border border-red-700/60 text-[10px] text-zinc-200 font-medium tracking-wide flex items-center gap-1.5 backdrop-blur-sm pointer-events-none group-hover:border-red-500 transition">
            <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
            <span>Tap water surface to summon KasA from depths</span>
          </div>
        )}

        {/* Bursting Screen Kasa Animation Overlay */}
        {isBursting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-red-950/40 backdrop-blur-[2px] animate-in fade-in duration-200 z-20">
            {/* Water splash rings */}
            <div className="absolute w-44 h-44 rounded-full border-2 border-white/80 animate-ping opacity-75" />
            <div className="absolute w-64 h-64 rounded-full border border-red-500/80 animate-ping delay-100 opacity-60" />

            {/* Glowing Kasa Emblem bursting onto screen */}
            <div 
              className="relative flex flex-col items-center space-y-2"
              style={{ animation: "kasa-burst-surge 1.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards" }}
            >
              <KasaSwordEmblem size="xl" neonGlow={true} showText={false} style="crimson_ronin" />
              <div className="px-4 py-1.5 rounded-xl bg-black/90 border-2 border-red-500 shadow-2xl shadow-red-950">
                <span className="font-japan-wave text-base font-black text-white tracking-widest text-red-outline">
                  KASA AWAKENED
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pond Telemetry & Audio Narration Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs">
        <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-zinc-200">3</strong> Swimming Koi
          </span>
          <span>•</span>
          <span>Summons: <strong className="text-red-400 font-mono">{burstCount}</strong></span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onNarrationTrigger) {
              onNarrationTrigger("KasA Koi Sanctuary is running nominal. Scott Gushea's neural mesh catalyst is standing by.");
            }
          }}
          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-red-400" />
          <span>Play Voice Status</span>
        </button>
      </div>
    </div>
  );
};
