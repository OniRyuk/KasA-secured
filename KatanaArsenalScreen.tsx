import React, { useState } from "react";
import { 
  Sword, 
  Flame, 
  Zap, 
  Shield, 
  Sparkles, 
  Award, 
  Sliders, 
  Check, 
  RefreshCw, 
  Radio, 
  Eye, 
  ExternalLink 
} from "lucide-react";
import { SwordConfig } from "../types";
import { SWORDS_ARSENAL } from "../data/swordsData";
import { KasaButton } from "./KasaButton";

interface KatanaArsenalScreenProps {
  activeSwordId: string;
  onSelectSword: (sword: SwordConfig) => void;
  onTriggerSlice: () => void;
  onNotify?: (message: string, type: "success" | "error" | "info") => void;
  fontWave?: boolean;
}

export const KatanaArsenalScreen: React.FC<KatanaArsenalScreenProps> = ({
  activeSwordId,
  onSelectSword,
  onTriggerSlice,
  onNotify,
  fontWave = true,
}) => {
  const [selectedSword, setSelectedSword] = useState<SwordConfig>(() => {
    return SWORDS_ARSENAL.find((s) => s.id === activeSwordId) || SWORDS_ARSENAL[0];
  });

  const isEquipped = selectedSword.id === activeSwordId;

  return (
    <div className="space-y-4">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-950/90 border border-red-900/80 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-700 to-rose-900 p-2.5 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400">
            <Sword className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className={`text-lg sm:text-xl font-black text-white-crisp ${fontWave ? "font-japan-wave" : ""}`}>
                Katana Arsenal & Legendary Blade Forge
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-600">
                10 MYTHIC BLADES
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Customizable sheaths, elemental energy infusions & monomolecular cutting edges
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <KasaButton
            variant="danger"
            size="sm"
            onClick={onTriggerSlice}
            icon={<Sword className="w-3.5 h-3.5 text-white animate-pulse" />}
          >
            Test Blade Slice
          </KasaButton>
        </div>
      </div>

      {/* Main Grid: 10 Swords Showcase & Blade Forge Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 10 Swords Grid (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 p-3 sm:p-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white-crisp">
              The 10 Sovereign Blades
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Click to inspect & wield
            </span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {SWORDS_ARSENAL.map((sw) => {
              const isCurrent = sw.id === selectedSword.id;
              const isCurrentlyActive = sw.id === activeSwordId;

              return (
                <div
                  key={sw.id}
                  onClick={() => setSelectedSword(sw)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isCurrent
                      ? "bg-neutral-900 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-[1.01]"
                      : "bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60"
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-inner shrink-0 border"
                      style={{
                        backgroundColor: sw.sheathColor,
                        borderColor: sw.sheathAccent,
                        boxShadow: `0 0 10px ${sw.sheathAccent}44`
                      }}
                    >
                      {sw.kanjiSymbol}
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white-crisp truncate">
                          {sw.name}
                        </span>
                        {isCurrentlyActive && (
                          <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded">
                            WIELDED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-0.5">
                        <span className="capitalize" style={{ color: sw.sheathAccent }}>{sw.element}</span>
                        <span>•</span>
                        <span>{sw.powerRating} PWR</span>
                        <span>•</span>
                        <span>{sw.speedRating} SPD</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div 
                      className="w-3 h-3 rounded-full border shadow-sm"
                      style={{ backgroundColor: sw.bladeTint, borderColor: sw.sheathAccent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Blade Inspection & Forge (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-neutral-950/90 border border-neutral-800 p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Element Glow Background */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: selectedSword.sheathAccent }}
          />

          <div className="space-y-5 relative z-10">
            {/* Header: Name, Japanese Kanji, Seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg sm:text-2xl font-black text-white-crisp font-japan-wave">
                    {selectedSword.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-700">
                    {selectedSword.element}
                  </span>
                </div>
                <div className="text-sm font-semibold text-zinc-300 mt-0.5">
                  {selectedSword.japaneseName}
                </div>
              </div>

              {/* Equip Button */}
              <div>
                {isEquipped ? (
                  <div className="px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <Check className="w-4 h-4 text-red-400" />
                    <span>Currently Equipped Atop Screen</span>
                  </div>
                ) : (
                  <KasaButton
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      onSelectSword(selectedSword);
                      if (onNotify) onNotify(`Equipped "${selectedSword.name}" as active sheathed katana atop the UI!`, "success");
                    }}
                    icon={<Sword className="w-3.5 h-3.5 text-white" />}
                  >
                    Equip as Sheathed Katana
                  </KasaButton>
                )}
              </div>
            </div>

            {/* Sword Graphic Representation */}
            <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>SCABBARD & MONOMOLECULAR EDGE PREVIEW</span>
                <span>{selectedSword.integritySeal}</span>
              </div>

              {/* Stylized Katana Graphic */}
              <div className="relative h-14 rounded-xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 p-2 flex items-center shadow-lg">
                {/* Tsuka */}
                <div 
                  className="w-16 h-8 rounded-l-lg border flex items-center justify-center font-bold text-white shadow-inner"
                  style={{ backgroundColor: selectedSword.sheathColor, borderColor: selectedSword.sheathAccent }}
                >
                  <span className="text-sm font-black">{selectedSword.kanjiSymbol}</span>
                </div>

                {/* Tsuba */}
                <div 
                  className="w-2.5 h-10 rounded-sm border"
                  style={{ backgroundColor: selectedSword.sheathAccent, borderColor: "#fef08a" }}
                />

                {/* Scabbard & Blade Glimpse */}
                <div className="flex-1 h-7 rounded-r-lg relative overflow-hidden bg-neutral-950 border-y border-r border-neutral-800 flex items-center px-4">
                  {/* Energy blade line */}
                  <div 
                    className="w-full h-1 rounded-full shadow-lg"
                    style={{
                      backgroundColor: selectedSword.bladeTint,
                      boxShadow: `0 0 12px ${selectedSword.bladeTint}`,
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-zinc-300 italic">
                "{selectedSword.quote}"
              </p>
              <p className="text-xs text-zinc-400">
                {selectedSword.lore}
              </p>
            </div>

            {/* Combat & Security Stats */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-white-crisp">
                Tactical & Cryptographic Ratings
              </span>

              <div className="grid grid-cols-3 gap-3 text-xs">
                {/* Power */}
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Cutting Power</span>
                    <span className="font-bold text-red-400">{selectedSword.powerRating}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-950 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${selectedSword.powerRating}%` }} />
                  </div>
                </div>

                {/* Speed */}
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Draw Speed</span>
                    <span className="font-bold text-cyan-400">{selectedSword.speedRating}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-950 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${selectedSword.speedRating}%` }} />
                  </div>
                </div>

                {/* Defense */}
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Parry Defense</span>
                    <span className="font-bold text-amber-400">{selectedSword.defenseRating}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-950 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedSword.defenseRating}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Customizer Specs */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">Tsuba Guard</span>
                <span className="font-bold text-white-crisp">{selectedSword.tsubaStyle}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">Sheath Color</span>
                <span className="font-bold text-white-crisp font-mono">{selectedSword.sheathColor}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">Accent Hue</span>
                <span className="font-bold text-white-crisp font-mono">{selectedSword.sheathAccent}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">Blade Tint</span>
                <span className="font-bold text-white-crisp font-mono">{selectedSword.bladeTint}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 text-[11px] text-zinc-500 font-mono flex items-center justify-between">
            <span>Forged for Scott Gushea • KasA Arsenal</span>
            <span>Monomolecular Sharpness Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
