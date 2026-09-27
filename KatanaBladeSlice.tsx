import React, { useEffect, useState } from "react";

interface KatanaBladeSliceProps {
  isTriggered: boolean;
  onSliceComplete?: () => void;
  bladeSound?: boolean;
}

export const KatanaBladeSlice: React.FC<KatanaBladeSliceProps> = ({
  isTriggered,
  onSliceComplete,
  bladeSound = true,
}) => {
  const [active, setActive] = useState(false);
  const [sliceAngle, setSliceAngle] = useState(-32);

  // Play synthetic metallic blade whoosh using Web Audio API
  const playBladeSound = () => {
    if (!bladeSound || typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Sharp metallic high-pass blade sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(4500, ctx.currentTime + 0.12);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      // Add a metallic resonant ping
      const ping = ctx.createOscillator();
      const pingGain = ctx.createGain();
      ping.type = "sine";
      ping.frequency.setValueAtTime(2400, ctx.currentTime + 0.02);
      ping.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
      pingGain.gain.setValueAtTime(0.15, ctx.currentTime + 0.02);
      pingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      ping.connect(pingGain);
      pingGain.connect(ctx.destination);
      ping.start(ctx.currentTime + 0.02);
      ping.stop(ctx.currentTime + 0.42);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isTriggered) {
      setActive(true);
      // Alternate angle slightly for organic variety
      setSliceAngle(Math.random() > 0.5 ? -35 : -28);
      playBladeSound();

      const timer = setTimeout(() => {
        setActive(false);
        if (onSliceComplete) {
          onSliceComplete();
        }
      }, 650);

      return () => clearTimeout(timer);
    }
  }, [isTriggered]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Upper screen displacement container */}
      <div 
        className="absolute inset-0 bg-transparent transition-all duration-300"
        style={{
          animation: "screen-slash-split-top 0.45s cubic-bezier(0.1, 0.9, 0.2, 1) forwards",
          clipPath: `polygon(0 0, 100% 0, 100% 48%, 0 54%)`,
        }}
      />

      {/* Lower screen displacement container */}
      <div 
        className="absolute inset-0 bg-transparent transition-all duration-300"
        style={{
          animation: "screen-slash-split-bottom 0.45s cubic-bezier(0.1, 0.9, 0.2, 1) forwards",
          clipPath: `polygon(0 54%, 100% 48%, 100% 100%, 0 100%)`,
        }}
      />

      {/* Razor-thin laser cut line */}
      <div
        className="absolute top-1/2 left-[-50%] w-[200vw] h-[2px] bg-white transform -translate-y-1/2 shadow-[0_0_12px_#ffffff,0_0_24px_#ef4444,0_0_48px_#b91c1c]"
        style={{
          transform: `rotate(${sliceAngle}deg) translateY(-50%)`,
          boxShadow: "0 0 10px #ffffff, 0 0 20px #ff0033, 0 0 35px #dc2626",
          animation: "katana-slice-beam 0.5s ease-out forwards",
        }}
      />

      {/* Red Ember Spark Burst along cut line */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {Array.from({ length: 18 }).map((_, i) => {
            const left = 15 + (i * 4.2) + (Math.random() * 4);
            const top = 30 + (i * 2.2) + (Math.sin(i) * 5);
            return (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ff0033]"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animation: `ping 0.4s ease-out ${(i * 0.015).toFixed(3)}s forwards`,
                  opacity: 0.9,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
