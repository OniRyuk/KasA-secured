import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Mic, Radio, Sparkles } from "lucide-react";

interface NarrationCatalystProps {
  initialText?: string;
  onStateChange?: (speaking: boolean) => void;
  className?: string;
}

export const NarrationCatalyst: React.FC<NarrationCatalystProps> = ({
  initialText,
  onStateChange,
  className = "",
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>("Ready to narrate");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const speak = (textToSpeak: string) => {
    if (isMuted || !speechSupported) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterances
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      // Try selecting an English / natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("David"))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setStatusMessage(textToSpeak.slice(0, 45) + "...");
        if (onStateChange) onStateChange(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setStatusMessage("Ready to narrate");
        if (onStateChange) onStateChange(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setStatusMessage("Speech synthesis error");
        if (onStateChange) onStateChange(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onStateChange) onStateChange(false);
    } else {
      speak("KasA Personal AI Catalyst active. Engineered by Scott Gushea. All sovereign systems running nominal.");
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Interactive Narration Icon Button */}
      <button
        type="button"
        onClick={handleToggleSpeak}
        title={isSpeaking ? "Click to silence narration" : "Click for voice status readout"}
        className={`relative p-2 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border ${
          isSpeaking
            ? "bg-red-600 text-white border-red-400 shadow-[0_0_15px_#ff0033]"
            : "bg-neutral-900/90 text-zinc-200 hover:text-white hover:bg-neutral-800 border-red-800/60"
        }`}
      >
        {isSpeaking ? (
          <Radio className="w-4 h-4 animate-pulse text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-red-400" />
        )}

        {/* Animated wave rings when speaking */}
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border border-red-500 animate-ping" />
        )}
      </button>

      {/* Voice Wave Visualizer Bars */}
      <div 
        onClick={handleToggleSpeak}
        className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-black/60 border border-red-950/60 cursor-pointer hover:border-red-700/60 transition"
      >
        {[14, 22, 10, 26, 16, 20].map((h, i) => (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isSpeaking ? "bg-red-500 animate-pulse" : "bg-zinc-700"
            }`}
            style={{
              height: isSpeaking ? `${Math.max(6, Math.round(h * Math.random()))}px` : "8px",
            }}
          />
        ))}
      </div>

      {/* Quick Status Tagline */}
      <span className="text-[11px] font-mono text-zinc-300 hidden md:inline truncate max-w-[200px]">
        {statusMessage}
      </span>
    </div>
  );
};
