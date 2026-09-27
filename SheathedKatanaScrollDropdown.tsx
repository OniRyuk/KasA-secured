import React, { useState, useRef, useEffect } from "react";
import { 
  Sword, 
  Shield, 
  Sparkles, 
  Terminal, 
  Waves, 
  Globe, 
  FolderLock, 
  Lock, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ExternalLink,
  Flame,
  Zap,
  Sliders,
  Award,
  Feather,
  EyeOff,
  Monitor
} from "lucide-react";
import { SwordConfig } from "../types";
import { SWORDS_ARSENAL } from "../data/swordsData";

interface SheathedKatanaScrollDropdownProps {
  activeSwordId: string;
  onSelectSword: (sword: SwordConfig) => void;
  onTriggerSlice: () => void;
  onNavigateSection: (sectionId: string) => void;
  onLockApp: () => void;
  onOpenVault: () => void;
  onOpenBrowser: () => void;
  onOpenProfile: () => void;
  onOpenCreatorSanctuary?: () => void;
  onEngagePrivacyBlind?: () => void;
  onOpenChromiumOSModal?: () => void;
  vaultFileCount?: number;
  fontWave?: boolean;
}

export const SheathedKatanaScrollDropdown: React.FC<SheathedKatanaScrollDropdownProps> = ({
  activeSwordId,
  onSelectSword,
  onTriggerSlice,
  onNavigateSection,
  onLockApp,
  onOpenVault,
  onOpenBrowser,
  onOpenProfile,
  onOpenCreatorSanctuary,
  onEngagePrivacyBlind,
  onOpenChromiumOSModal,
  vaultFileCount = 3,
  fontWave = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeSword = SWORDS_ARSENAL.find((s) => s.id === activeSwordId) || SWORDS_ARSENAL[0];

  // Play synthesized metallic katana unsheathe chime
  const playUnsheatheChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3200, audioCtx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleToggle = () => {
    playUnsheatheChime();
    setIsOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50 w-full max-w-4xl mx-auto px-2 py-1">
      {/* The Clickable Sheathed Katana Bar */}
      <div
        onClick={handleToggle}
        title="Click to unsheathe the anime scroll dropdown & customize your blade arsenal"
        className="group relative cursor-pointer select-none rounded-xl overflow-hidden border border-red-900/80 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:border-red-500 transition-all duration-300 flex items-center justify-between"
        style={{
          boxShadow: isOpen ? `0 0 25px ${activeSword.auraGlow}` : undefined,
        }}
      >
        {/* Sheath Visual Presentation */}
        <div className="flex items-center space-x-3 w-full overflow-hidden">
          {/* Tsuka (Handle / Hilt) */}
          <div 
            className="shrink-0 flex items-center justify-center px-2.5 py-1.5 rounded-lg border shadow-inner transition-transform group-hover:scale-105"
            style={{
              backgroundColor: activeSword.sheathColor,
              borderColor: activeSword.sheathAccent,
            }}
          >
            {/* Diamond wrap tsuka pattern */}
            <div className="flex items-center space-x-1">
              <span className="text-sm font-black text-white px-1">
                {activeSword.kanjiSymbol}
              </span>
              <Sword 
                className="w-4 h-4 transition-transform group-hover:rotate-12"
                style={{ color: activeSword.bladeTint }} 
              />
            </div>
          </div>

          {/* Tsuba (Handguard) */}
          <div 
            className="w-2.5 h-7 rounded-sm shrink-0 border"
            style={{
              backgroundColor: activeSword.sheathAccent,
              borderColor: "#fef08a",
              boxShadow: `0 0 8px ${activeSword.sheathAccent}`,
            }}
          />

          {/* Saya (Sheath Body & Blade Representation) */}
          <div className="flex-1 relative flex items-center h-6 overflow-hidden rounded-md bg-neutral-950/80 border border-neutral-800 px-3">
            {/* Scabbard Lacquer Line */}
            <div 
              className="absolute inset-y-0 left-0 transition-all duration-500 opacity-80"
              style={{
                width: isOpen ? "100%" : "35%",
                background: `linear-gradient(90deg, ${activeSword.sheathAccent}44, ${activeSword.bladeTint}88, transparent)`,
              }}
            />

            {/* Glowing Blade Edge Glimpse */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, ${activeSword.bladeTint}, transparent 75%)`,
                boxShadow: `0 0 6px ${activeSword.bladeTint}`,
              }}
            />

            {/* Sword Name & Status */}
            <div className="relative z-10 flex items-center justify-between w-full text-xs">
              <div className="flex items-center space-x-2">
                <span className={`font-black tracking-wider text-white-crisp ${fontWave ? "font-japan-wave" : ""}`}>
                  {activeSword.name}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-neutral-900 border text-zinc-300" style={{ borderColor: activeSword.sheathAccent }}>
                  {activeSword.element.toUpperCase()}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 hidden md:inline font-mono">
                {isOpen ? "Blade Unsheathed • Scroll Active" : "Click to Unsheathe Anime Scroll"}
              </span>
            </div>
          </div>

          {/* Kojiri (Sheath Tip) */}
          <div 
            className="shrink-0 w-2 h-5 rounded-r-md border"
            style={{
              backgroundColor: activeSword.sheathAccent,
              borderColor: activeSword.bladeTint,
            }}
          />
        </div>

        {/* Dropdown Indicator Pill */}
        <div className="shrink-0 ml-3 flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-neutral-900/90 border border-neutral-700 text-zinc-300 group-hover:text-white group-hover:border-red-500 transition-colors text-xs">
          <span className="hidden sm:inline text-[11px] font-semibold text-white-crisp">
            {isOpen ? "Sheathe" : "Unsheathe"}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-red-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
        </div>
      </div>

      {/* Anime Fabricated Scroll Dropdown */}
      {isOpen && (
        <div 
          className="mt-2 w-full animate-in fade-in zoom-in-95 duration-200"
          style={{ perspective: "1000px" }}
        >
          {/* Top Wooden Scroll Roller */}
          <div className="h-4 rounded-t-lg bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 border-x-4 border-amber-600 flex items-center justify-between px-3 shadow-md">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-amber-300" />
            <span className="text-[10px] font-mono tracking-widest text-amber-200 font-bold uppercase">
              ◈ SOVEREIGN ANIME SCROLL OF KASA ◈
            </span>
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-amber-300" />
          </div>

          {/* Parchment Body with Glowing Runic Borders */}
          <div 
            className="p-4 sm:p-5 rounded-b-lg border-2 bg-[#120f0d] text-zinc-200 shadow-2xl relative overflow-hidden backdrop-blur-md"
            style={{
              borderColor: activeSword.sheathAccent,
              boxShadow: `0 10px 30px rgba(0,0,0,0.9), 0 0 20px ${activeSword.auraGlow}`,
              backgroundImage: "radial-gradient(circle at 50% 20%, rgba(220, 38, 38, 0.08) 0%, transparent 70%)"
            }}
          >
            {/* Background Kanji Watermark */}
            <div className="absolute right-4 bottom-2 text-8xl font-black text-white/5 pointer-events-none select-none font-japan-wave">
              {activeSword.kanjiSymbol}
            </div>

            {/* Scroll Header: Sword Lore & Owner Identity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-950/80 pb-3 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black text-white-crisp font-japan-wave">
                    {activeSword.japaneseName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-700">
                    Seal: {activeSword.integritySeal}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 italic mt-1 max-w-xl">
                  "{activeSword.quote}" — {activeSword.lore}
                </p>
              </div>

              {/* Architect Red Wax Seal */}
              <div 
                onClick={onOpenProfile}
                title="Sovereign Architect & Owner Scott Gushea"
                className="shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-red-950/70 border border-red-600/90 shadow-md cursor-pointer hover:bg-red-900/80 transition"
              >
                <div className="w-6 h-6 rounded-full bg-red-600 border border-red-300 flex items-center justify-center text-[10px] font-black text-white shadow-inner">
                  印
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-white-crisp">Scott Gushea</div>
                  <div className="text-[9px] text-red-200">Sole Creator & Owner</div>
                </div>
              </div>
            </div>

            {/* 10 Swords Arsenal Selector Grid */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white-crisp">
                    Katana Arsenal (10 Mythic Blades)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Select blade to equip atop the UI
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SWORDS_ARSENAL.map((sw) => {
                  const isEquipped = sw.id === activeSword.id;
                  return (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => {
                        onSelectSword(sw);
                        playUnsheatheChime();
                      }}
                      className={`p-2 rounded-xl text-left transition-all border relative flex flex-col justify-between cursor-pointer ${
                        isEquipped
                          ? "bg-neutral-900 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] scale-[1.02]"
                          : "bg-neutral-950/70 hover:bg-neutral-900/90 border-neutral-800 hover:border-neutral-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-inner border"
                          style={{
                            backgroundColor: sw.sheathColor,
                            borderColor: sw.sheathAccent,
                          }}
                        >
                          {sw.kanjiSymbol}
                        </span>
                        {isEquipped && (
                          <span className="px-1 py-0.2 rounded bg-red-600 text-[9px] text-white font-bold">
                            EQUIPPED
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5">
                        <div className="text-[11px] font-bold text-white-crisp truncate">
                          {sw.name}
                        </div>
                        <div className="flex items-center space-x-1 text-[10px] text-zinc-400">
                          <span className="capitalize">{sw.element}</span>
                          <span>•</span>
                          <span>{sw.powerRating} PWR</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Seals Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
              {/* Creator Safe Sanctuary */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenCreatorSanctuary) onOpenCreatorSanctuary();
                  else onNavigateSection("creator-sanctuary");
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-950 border border-red-800/80 hover:border-red-400 hover:bg-red-950/40 text-left transition flex items-center space-x-2.5 cursor-pointer shadow-sm group"
              >
                <div className="p-1.5 rounded-lg bg-red-900/50 border border-red-700 text-red-300 group-hover:text-white">
                  <Feather className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white-crisp">Sanctuary</div>
                  <div className="text-[10px] text-zinc-400">Air-Gap Studio</div>
                </div>
              </button>

              {/* Privacy Curtain Blind */}
              <button
                type="button"
                onClick={() => {
                  if (onEngagePrivacyBlind) onEngagePrivacyBlind();
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-950 border border-rose-800/80 hover:border-rose-400 hover:bg-rose-950/40 text-left transition flex items-center space-x-2.5 cursor-pointer shadow-sm group"
                title="Activate anti-shoulder-surfing privacy screen immediately"
              >
                <div className="p-1.5 rounded-lg bg-rose-900/50 border border-rose-700 text-rose-300 group-hover:text-white">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white-crisp">Privacy Blind</div>
                  <div className="text-[10px] text-zinc-400">Shield Screen</div>
                </div>
              </button>

              {/* Hisense C11 & Chromium OS Kiosk */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenChromiumOSModal) onOpenChromiumOSModal();
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-950 border border-cyan-800/80 hover:border-cyan-400 hover:bg-cyan-950/40 text-left transition flex items-center space-x-2.5 cursor-pointer shadow-sm group"
                title="Chromium OS & Hisense C11 Kiosk / Standalone App"
              >
                <div className="p-1.5 rounded-lg bg-cyan-900/50 border border-cyan-700 text-cyan-300 group-hover:text-white">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white-crisp">C11 Kiosk App</div>
                  <div className="text-[10px] text-zinc-400">No Play Store</div>
                </div>
              </button>

              {/* Katana Blade Slice */}
              <button
                type="button"
                onClick={() => {
                  onTriggerSlice();
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-950 border border-red-800/80 hover:border-red-400 hover:bg-red-950/40 text-left transition flex items-center space-x-2.5 cursor-pointer shadow-sm group"
              >
                <div className="p-1.5 rounded-lg bg-red-900/50 border border-red-700 text-red-300 group-hover:text-white">
                  <Sword className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white-crisp">Razor Slice</div>
                  <div className="text-[10px] text-zinc-400">Summon blade</div>
                </div>
              </button>

              {/* Sovereign File Vault */}
              <button
                type="button"
                onClick={() => {
                  onOpenVault();
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-950 border border-amber-800/80 hover:border-amber-400 hover:bg-amber-950/40 text-left transition flex items-center space-x-2.5 cursor-pointer shadow-sm group"
              >
                <div className="p-1.5 rounded-lg bg-amber-900/50 border border-amber-700 text-amber-300 group-hover:text-white">
                  <FolderLock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white-crisp">File Vault</div>
                  <div className="text-[10px] text-zinc-400">{vaultFileCount} Secured</div>
                </div>
              </button>

              {/* Privacy Kiosk Browser */}
              <button
                type="button"
                onClick={() => {
                  onOpenBrowser();
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-950 border border-cyan-800/80 hover:border-cyan-400 hover:bg-cyan-950/40 text-left transition flex items-center space-x-2.5 cursor-pointer shadow-sm group"
              >
                <div className="p-1.5 rounded-lg bg-cyan-900/50 border border-cyan-700 text-cyan-300 group-hover:text-white">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white-crisp">Kiosk Browser</div>
                  <div className="text-[10px] text-zinc-400">Tor Sandboxed</div>
                </div>
              </button>
            </div>

            {/* Quick Navigation Sections */}
            <div className="border-t border-neutral-800/80 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Direct Screen Teleport:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "creator-sanctuary", label: "Creator Sanctuary", icon: Feather },
                  { id: "personal-gpt", label: "Catalyst AI", icon: Sparkles },
                  { id: "linux-terminal", label: "Terminal", icon: Terminal },
                  { id: "file-vault", label: "Vault", icon: FolderLock },
                  { id: "privacy-kiosk", label: "Kiosk Browser", icon: Globe },
                  { id: "koi-pond", label: "Koi Sanctuary", icon: Waves },
                  { id: "regression", label: "Regression", icon: Shield },
                  { id: "swords-arsenal", label: "Swords Forge", icon: Sword },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onNavigateSection(s.id);
                        setIsOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-red-950 text-zinc-300 hover:text-white border border-neutral-700 hover:border-red-500 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer transition"
                    >
                      <Icon className="w-3 h-3 text-red-400" />
                      <span className="text-white-crisp">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Wooden Scroll Roller */}
          <div className="h-4 rounded-b-lg bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 border-x-4 border-amber-600 flex items-center justify-between px-3 shadow-md">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-amber-300" />
            <span className="text-[9px] font-mono tracking-widest text-amber-200">
              KASA • MONOMOLECULAR INTEGRITY ENFORCED
            </span>
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-amber-300" />
          </div>
        </div>
      )}
    </div>
  );
};
