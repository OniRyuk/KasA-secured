import React from "react";
import { KasaEmblemStyle } from "../types";

interface KasaSwordEmblemProps {
  style?: KasaEmblemStyle;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  neonGlow?: boolean;
  fontWave?: boolean;
}

export const KasaSwordEmblem: React.FC<KasaSwordEmblemProps> = ({
  style = "crimson_ronin",
  size = "md",
  className = "",
  showText = true,
  neonGlow = true,
  fontWave = true,
}) => {
  const sizeMap = {
    sm: { box: "w-10 h-10", text: "text-xs", svg: 40 },
    md: { box: "w-14 h-14", text: "text-sm", svg: 56 },
    lg: { box: "w-20 h-20", text: "text-lg", svg: 80 },
    xl: { box: "w-32 h-32", text: "text-2xl", svg: 128 },
  };

  const { box, text, svg } = sizeMap[size];

  // Neon trim color schemes per style
  const styleConfig = {
    crimson_ronin: {
      kasaFill: "url(#crimson-kasa-grad)",
      trimStroke: "#ff1744",
      bladeStroke: "#f8fafc",
      bladeGlow: "#ef4444",
      accent: "#b91c1c",
      glowColor: "rgba(239, 68, 68, 0.7)",
      label: "Crimson Ronin",
    },
    cyberpunk_kasa: {
      kasaFill: "url(#cyber-kasa-grad)",
      trimStroke: "#ff0055",
      bladeStroke: "#ffffff",
      bladeGlow: "#ff0077",
      accent: "#00f0ff",
      glowColor: "rgba(255, 0, 85, 0.8)",
      label: "Cyberpunk Kasa",
    },
    shadow_shinobi: {
      kasaFill: "url(#shadow-kasa-grad)",
      trimStroke: "#dc2626",
      bladeStroke: "#e2e8f0",
      bladeGlow: "#7f1d1d",
      accent: "#27272a",
      glowColor: "rgba(220, 38, 38, 0.6)",
      label: "Shadow Shinobi",
    },
    gold_shogun: {
      kasaFill: "url(#shogun-kasa-grad)",
      trimStroke: "#fbbf24",
      bladeStroke: "#fffbeb",
      bladeGlow: "#f59e0b",
      accent: "#991b1b",
      glowColor: "rgba(245, 158, 11, 0.7)",
      label: "Gold Shogun",
    },
    neon_oni: {
      kasaFill: "url(#oni-kasa-grad)",
      trimStroke: "#ff0033",
      bladeStroke: "#ffffff",
      bladeGlow: "#ff2a55",
      accent: "#831843",
      glowColor: "rgba(255, 0, 51, 0.85)",
      label: "Neon Oni",
    },
  }[style];

  return (
    <div className={`relative inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon Graphic Container */}
      <div 
        className={`relative ${box} rounded-2xl flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black border border-red-800/80 shadow-xl overflow-hidden group shrink-0`}
        style={{
          boxShadow: neonGlow ? `0 0 16px ${styleConfig.glowColor}, inset 0 0 10px rgba(255, 23, 68, 0.25)` : undefined,
        }}
      >
        <svg
          width={svg}
          height={svg}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="crimson-kasa-grad" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="60%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>

            <linearGradient id="cyber-kasa-grad" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff0055" />
              <stop offset="50%" stopColor="#700020" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>

            <linearGradient id="shadow-kasa-grad" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="60%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>

            <linearGradient id="shogun-kasa-grad" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="70%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>

            <linearGradient id="oni-kasa-grad" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff0033" />
              <stop offset="60%" stopColor="#881337" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Neon Filter */}
            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circular halo */}
          <circle cx="50" cy="50" r="42" stroke={styleConfig.trimStroke} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />

          {/* Style 5: Neon Oni Horns behind hat */}
          {style === "neon_oni" && (
            <g filter="url(#neon-glow)">
              <path d="M 32 30 Q 22 16 16 12 Q 26 22 34 32 Z" fill="#ff0033" />
              <path d="M 68 30 Q 78 16 84 12 Q 74 22 66 32 Z" fill="#ff0033" />
            </g>
          )}

          {/* Crossed Katana Blades */}
          <g filter="url(#neon-glow)">
            {/* Katana 1: Top-left to bottom-right */}
            <line
              x1="18"
              y1="18"
              x2="82"
              y2="82"
              stroke={styleConfig.bladeStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Edge neon glow line */}
            <line
              x1="18"
              y1="18"
              x2="82"
              y2="82"
              stroke={styleConfig.bladeGlow}
              strokeWidth="4"
              strokeOpacity="0.45"
            />
            {/* Katana 1 Tsuba (Guard) */}
            <line x1="26" y1="32" x2="32" y2="26" stroke={styleConfig.trimStroke} strokeWidth="3" strokeLinecap="square" />

            {/* Katana 2: Top-right to bottom-left */}
            <line
              x1="82"
              y1="18"
              x2="18"
              y2="82"
              stroke={styleConfig.bladeStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Edge neon glow line */}
            <line
              x1="82"
              y1="18"
              x2="18"
              y2="82"
              stroke={styleConfig.bladeGlow}
              strokeWidth="4"
              strokeOpacity="0.45"
            />
            {/* Katana 2 Tsuba (Guard) */}
            <line x1="74" y1="32" x2="68" y2="26" stroke={styleConfig.trimStroke} strokeWidth="3" strokeLinecap="square" />
          </g>

          {/* Central Kasa (Japanese Conical Hat) */}
          <g>
            {/* Hat Dome */}
            <path
              d="M 50 16 L 86 52 Q 50 62 14 52 Z"
              fill={styleConfig.kasaFill}
              stroke={styleConfig.trimStroke}
              strokeWidth="1.8"
            />

            {/* Bamboo Weave Ribs */}
            <path d="M 50 16 L 30 54" stroke={styleConfig.trimStroke} strokeWidth="0.8" strokeOpacity="0.6" />
            <path d="M 50 16 L 50 58" stroke={styleConfig.trimStroke} strokeWidth="0.8" strokeOpacity="0.6" />
            <path d="M 50 16 L 70 54" stroke={styleConfig.trimStroke} strokeWidth="0.8" strokeOpacity="0.6" />

            {/* Lower Hat Neon Rim Trim */}
            <path
              d="M 14 52 Q 50 62 86 52"
              stroke={styleConfig.trimStroke}
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#neon-glow)"
            />

            {/* Gold Shogun filigree or Cyber accent */}
            {style === "gold_shogun" && (
              <circle cx="50" cy="38" r="5" fill="#fbbf24" stroke="#991b1b" strokeWidth="1" />
            )}
          </g>

          {/* Stylized Kanji / Core Crest */}
          <circle cx="50" cy="46" r="8" fill="#09090b" stroke={styleConfig.trimStroke} strokeWidth="1.5" />
          <path d="M 47 42 L 53 42 M 50 42 L 50 50 M 47 50 L 53 50" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>

        {/* Ambient Corner Accent */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: "radial-gradient(circle at 50% 0%, rgba(255, 23, 68, 0.2) 0%, transparent 70%)"
          }}
        />
      </div>

      {/* Stylized Japanese-English "KasA" Lettering */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`${text} font-black tracking-wider transition-all duration-200 ${
                fontWave ? "font-japan-wave" : "font-japanese"
              } text-white-crisp flex items-center`}
              style={{
                letterSpacing: "0.12em",
                textShadow: "0 0 1px #fff, 0 0 6px #ff0033, 0 0 14px #dc2626",
              }}
            >
              <span className="text-red-500 drop-shadow-[0_0_8px_#ff0033]">K</span>
              <span>as</span>
              <span className="text-red-500 drop-shadow-[0_0_8px_#ff0033]">A</span>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950/80 border border-red-700/80 text-white font-mono font-bold tracking-widest uppercase">
              Catalyst
            </span>
          </div>
          <span className="text-[10px] text-zinc-300 font-medium tracking-tight">
            Personal Ai Sovereign Engine
          </span>
        </div>
      )}
    </div>
  );
};
