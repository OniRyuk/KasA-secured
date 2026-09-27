import React, { useState, useRef, useEffect } from "react";
import { Terminal, Shield, Sparkles, CornerDownLeft, Play, RefreshCw, Cpu, HardDrive, Wifi, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "warning" | "system";
  text: string;
  timestamp: string;
}

// Built-in Linux & Sovereign Dictionary with Common Typos Map
const LINUX_COMMAND_DICTIONARY: Record<string, string> = {
  // Common typo mappings -> canonical command
  sl: "ls",
  l: "ls",
  ll: "ls -la",
  gpr: "grep",
  gerp: "grep",
  grepp: "grep",
  apkk: "apk",
  ap: "apk",
  sudoo: "sudo",
  sduo: "sudo",
  systmctl: "systemctl",
  systemclt: "systemctl",
  chmd: "chmod",
  chmdo: "chmod",
  clera: "clear",
  claer: "clear",
  clr: "clear",
  whomi: "whoami",
  whoam: "whoami",
  unmae: "uname",
  unme: "uname",
  topp: "top",
  paux: "ps aux",
  iptable: "iptables",
  wlan: "wifi",
  wffi: "wifi",
  slic: "slice",
  slise: "slice",
  kassa: "kasa",
  kaza: "kasa",
};

const CANONICAL_COMMANDS = [
  "ls",
  "ls -la",
  "cat",
  "grep",
  "uname -a",
  "top",
  "ps aux",
  "whoami",
  "apk",
  "apk status",
  "apk build",
  "wifi status",
  "wifi scan",
  "iptables -L",
  "kasa status",
  "kasa integrity",
  "slice",
  "systemctl status",
  "chmod +x",
  "df -h",
  "free -m",
  "curl",
  "clear",
  "history",
  "help",
];

interface LinuxTerminalScreenProps {
  onTriggerSlice?: () => void;
  onNarrationTrigger?: (text: string) => void;
  externalInput?: string;
  onClearExternalInput?: () => void;
}

export const LinuxTerminalScreen: React.FC<LinuxTerminalScreenProps> = ({
  onTriggerSlice,
  onNarrationTrigger,
  externalInput,
  onClearExternalInput,
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "init-1",
      type: "system",
      text: "KasA Sovereign Linux Subsystem v6.8.0-sovereign-scott-gushea (x86_64)",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "init-2",
      type: "system",
      text: "Type 'help' for available Linux commands. Auto-correct dictionary active.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [ghostSuggestion, setGhostSuggestion] = useState<string>("");
  const [autoCorrectMessage, setAutoCorrectMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle external input from Virtual Keyboard
  useEffect(() => {
    if (externalInput !== undefined && externalInput !== "") {
      if (externalInput === "ENTER") {
        executeCommand(inputVal);
      } else if (externalInput === "BACKSPACE") {
        setInputVal((prev) => prev.slice(0, -1));
      } else if (externalInput === "TAB") {
        if (ghostSuggestion) {
          setInputVal(ghostSuggestion);
        }
      } else {
        setInputVal((prev) => prev + externalInput);
      }
      if (onClearExternalInput) onClearExternalInput();
    }
  }, [externalInput]);

  // Scroll to bottom when new lines appear
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Auto-correct and autocomplete calculation as user writes
  useEffect(() => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setGhostSuggestion("");
      setAutoCorrectMessage(null);
      return;
    }

    const firstWord = trimmed.split(" ")[0].toLowerCase();

    // 1. Check Typo Dictionary
    if (LINUX_COMMAND_DICTIONARY[firstWord]) {
      const correction = LINUX_COMMAND_DICTIONARY[firstWord];
      const rest = trimmed.slice(firstWord.length);
      setAutoCorrectMessage(`Auto-correct: '${firstWord}' ➜ '${correction}'`);
      setGhostSuggestion(correction + rest);
      return;
    }

    // 2. Check prefix matching against canonical commands
    const match = CANONICAL_COMMANDS.find((cmd) => cmd.startsWith(trimmed.toLowerCase()));
    if (match && match !== trimmed.toLowerCase()) {
      setGhostSuggestion(match);
      setAutoCorrectMessage(`Autocomplete: Press [Tab] to complete to '${match}'`);
    } else {
      setGhostSuggestion("");
      setAutoCorrectMessage(null);
    }
  }, [inputVal]);

  const addLine = (text: string, type: TerminalLine["type"] = "output") => {
    setLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        type,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const executeCommand = (cmdToRun: string) => {
    const rawCmd = cmdToRun.trim();
    if (!rawCmd) return;

    // Check if auto-correct applies
    const parts = rawCmd.split(" ");
    let command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let wasAutoCorrected = false;
    if (LINUX_COMMAND_DICTIONARY[command]) {
      wasAutoCorrected = true;
      const corrected = LINUX_COMMAND_DICTIONARY[command];
      addLine(`scott@kasa-catalyst:~$ ${rawCmd}`, "input");
      addLine(`[Auto-Correct Engine]: Typo '${command}' detected ➜ auto-resolved to '${corrected}'`, "warning");
      command = corrected;
    } else {
      addLine(`scott@kasa-catalyst:~$ ${rawCmd}`, "input");
    }

    // Update command history
    setCommandHistory((prev) => [rawCmd, ...prev]);
    setHistoryIndex(-1);
    setInputVal("");
    setGhostSuggestion("");
    setAutoCorrectMessage(null);

    // Command dispatch
    const fullCmd = [command, ...args].join(" ");

    switch (command) {
      case "help":
        addLine("KasA Sovereign Command & Linux Utility Dictionary:", "system");
        addLine("  • ls [-la]          - List files & standalone binaries in project");
        addLine("  • cat <file>        - Print file content (e.g. cat metadata.json)");
        addLine("  • grep <pattern>    - Search files for text pattern");
        addLine("  • uname -a          - View sovereign kernel & machine architecture");
        addLine("  • top / ps aux      - View real-time active system processes");
        addLine("  • apk [status|build]- Inspect standalone KasA.apk package & QR engine");
        addLine("  • wifi [scan|status]- Inspect autonomous Wi-Fi mesh node");
        addLine("  • iptables -L       - Display rollover firewall & security tables");
        addLine("  • kasa status       - Inspect Scott Gushea's sovereign AI integrity");
        addLine("  • slice             - Execute razor-thin glowing katana blade slice");
        addLine("  • clear             - Clean the terminal screen");
        addLine("  • history           - Print command execution history");
        break;

      case "clear":
        setLines([]);
        break;

      case "history":
        commandHistory.forEach((h, idx) => {
          addLine(`  ${commandHistory.length - idx}  ${h}`);
        });
        break;

      case "uname":
        addLine("Linux kasa-sovereign-node 6.8.0-sovereign-scott-gushea #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux");
        break;

      case "whoami":
        addLine("scott (Architect & Sole Owner: Scott Gushea | KasA - Personal Ai Catalyst)");
        break;

      case "slice":
        addLine("⚡ Triggering Katana Blade Slice animation across viewport...", "warning");
        if (onTriggerSlice) onTriggerSlice();
        break;

      case "ls":
        if (args.includes("-la") || args.includes("-l")) {
          addLine("total 2480");
          addLine("drwxr-xr-x  14 scott scott    4096 Sep  5 07:42 .");
          addLine("drwxr-xr-x   3 root  root     4096 Sep  5 00:00 ..");
          addLine("-rw-r--r--   1 scott scott    1284 Sep  5 07:42 AGENTS.md (Lockdown Active)");
          addLine("-rw-r--r--   1 scott scott     280 Sep  5 07:42 metadata.json (KasA)");
          addLine("-rw-r--r--   1 scott scott    2584 Sep  5 07:42 server.ts (Express Port 3000)");
          addLine("-rw-r--r--   1 scott scott 1087520 Sep  5 07:42 KasA-Sovereign-v1.0.apk");
          addLine("-rw-r--r--   1 scott scott    7812 Sep  5 07:42 src/index.css (Japan Wave)");
          addLine("drwxr-xr-x   2 scott scott    4096 Sep  5 07:42 src/components/");
        } else {
          addLine("AGENTS.md   metadata.json   package.json   server.ts   src/   KasA.apk");
        }
        break;

      case "cat":
        if (!args[0]) {
          addLine("cat: missing file operand", "error");
        } else if (args[0].includes("metadata")) {
          addLine('{\n  "name": "KasA - Personal Ai Catalyst",\n  "owner": "Scott Gushea",\n  "version": "1.0.0"\n}');
        } else if (args[0].includes("AGENTS")) {
          addLine("# KasA - Personal Ai Catalyst\n# Sole Creator, Architect & Owner: Scott Gushea\n# Strict Lockdown & Zero Unprompted Modifications Enforced.");
        } else {
          addLine(`[${args[0]}]: Clean verified state. SHA-256 integrity passed.`, "output");
        }
        break;

      case "apk":
        if (args[0] === "build" || args[0] === "download") {
          addLine("📦 Preparing standalone KasA-Sovereign-v1.0.apk...", "warning");
          addLine("  Target: Samsung Galaxy S10e (SM-G970U) & all Android 9.0+ devices");
          addLine("  Binary size: 1.08 MB (No secondary setup required)");
          addLine("  Endpoint: /download/KasA.apk [Ready for direct scan/download]");
          if (onNarrationTrigger) onNarrationTrigger("Standalone KasA APK package verified. Download endpoint active.");
        } else {
          addLine("APK Engine: Standalone node operational.");
          addLine("  Package: com.kasa.sovereign.catalyst");
          addLine("  Status: Verified clean, zero external server dependencies.");
          addLine("  QR Code scan link: http://localhost:3000/api/apk/qr.png");
        }
        break;

      case "wifi":
        addLine("Wi-Fi Autonomous Subnet Node Status:", "system");
        addLine("  Interface: wlan0 (Client + Autonomous AP Mode)");
        addLine("  Subnet: 192.168.1.0/24");
        addLine("  Mesh link: Standby / Active. 0 external tether required.");
        break;

      case "iptables":
        addLine("Chain INPUT (policy ACCEPT 1420 packets, 185K bytes)");
        addLine("target     prot opt source               destination");
        addLine("ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:3000");
        addLine("ACCEPT     all  --  127.0.0.1            127.0.0.1");
        addLine("Chain ROLLING_CYCLE (1 references)");
        addLine("target     prot opt source               destination");
        addLine("LOG        all  --  0.0.0.0/0            0.0.0.0/0            /* Seamless IP Rollover Nominal */");
        break;

      case "top":
      case "ps":
        addLine("PID  USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND", "system");
        addLine("  1  scott     20   0  182420  42100  18400 S   0.4   1.2   0:14.20 node server.ts");
        addLine(" 42  scott     20   0   45210  12400   8200 S   0.1   0.4   0:02.15 kasa-wifi-mesh");
        addLine(" 88  scott     20   0   92140  24120  14500 S   0.2   0.8   0:01.88 apk-daemon");
        addLine("104  scott     20   0   12840   3410   2100 R   0.0   0.1   0:00.02 ps");
        break;

      case "kasa":
        addLine("KasA - Personal Ai Catalyst Sovereign Status:", "system");
        addLine("  Architect & Sole Owner: Scott Gushea");
        addLine("  Integrity: 5/5 Files Clean, Zero Tampering Detected");
        addLine("  Hardware Acceleration: Turbo Lag-Prevention Engine ACTIVE");
        addLine("  Linux Auto-correct Dictionary: ONLINE");
        break;

      default:
        addLine(`bash: ${command}: command not found. Type 'help' for command manual.`, "error");
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (ghostSuggestion) {
        setInputVal(ghostSuggestion);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-neutral-950 border-2 border-red-800/80 shadow-2xl overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black border-b border-red-900/60 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block border border-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-600 inline-block border border-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border border-emerald-400" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Terminal className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-white tracking-wider font-japan-wave">
              KasA Linux Sovereign Terminal
            </span>
            <span className="text-[10px] text-zinc-400">
              (scott@kasa-catalyst:~$)
            </span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[11px] px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-white font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
            Auto-Correct Active
          </span>
          <button
            type="button"
            onClick={() => setLines([])}
            className="text-[11px] text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 bg-[#050508] text-xs leading-relaxed select-text min-h-[360px]">
        {lines.map((line) => {
          let textClass = "text-white-crisp";
          if (line.type === "error") textClass = "text-red-400 font-bold";
          if (line.type === "warning") textClass = "text-amber-300";
          if (line.type === "system") textClass = "text-emerald-400 font-bold";
          if (line.type === "input") textClass = "text-zinc-200 font-bold";

          return (
            <div key={line.id} className="flex items-start gap-2 break-all">
              <span className="text-[10px] text-zinc-400 shrink-0 select-none">
                [{line.timestamp}]
              </span>
              <pre className={`font-mono whitespace-pre-wrap ${textClass}`}>
                {line.text}
              </pre>
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Auto-Correct Live Helper Banner */}
      {autoCorrectMessage && (
        <div className="px-4 py-1.5 bg-red-950/90 border-t border-red-700/80 text-[11px] text-white flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-300 animate-pulse" />
            <span className="font-semibold">{autoCorrectMessage}</span>
          </span>
          <span className="text-[10px] text-zinc-300 font-mono">
            Press [Tab] or [Enter]
          </span>
        </div>
      )}

      {/* Command Input Prompt */}
      <div className="relative flex items-center px-4 py-3 bg-black border-t border-red-900/60">
        <span className="text-red-500 font-bold mr-2 select-none shrink-0 flex items-center gap-1">
          <span className="text-white">scott@kasa:~$</span>
        </span>

        {/* Main Input Field */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type Linux command (e.g. ls, top, apk, slice, help)..."
            className="w-full bg-transparent text-white font-mono text-xs focus:outline-none border-none p-0 pr-16 text-white-crisp placeholder-zinc-400"
            autoFocus
            spellCheck={false}
          />

          {/* Ghost Completion Overlay */}
          {ghostSuggestion && ghostSuggestion.startsWith(inputVal.toLowerCase()) && (
            <div className="absolute inset-0 pointer-events-none text-xs font-mono text-zinc-600">
              <span className="invisible">{inputVal}</span>
              <span>{ghostSuggestion.slice(inputVal.length)}</span>
            </div>
          )}
        </div>

        {/* Run Button */}
        <button
          type="button"
          onClick={() => executeCommand(inputVal)}
          className="ml-2 px-2.5 py-1 rounded bg-red-600/90 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span>RUN</span>
        </button>
      </div>
    </div>
  );
};
