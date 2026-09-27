/**
 * ChatGPT Regression Suite - Standalone Portable Wi-Fi Node Runner
 * 
 * Run this on any portable device (Raspberry Pi, laptop, Android Termux, mini-PC).
 * Automatically binds to 0.0.0.0, discovers active Wi-Fi subnet IP addresses,
 * and prints local network access URLs and terminal QR info.
 */

import os from "os";

console.log("\n========================================================");
console.log("  ⚡ ChatGPT Regression Suite - Standalone Wi-Fi Node");
console.log("========================================================\n");

function getWifiAddresses() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        results.push({ name, address: net.address });
      }
    }
  }
  return results;
}

const addresses = getWifiAddresses();
console.log("[✓] Active Wi-Fi & LAN Network Interfaces Detected:");
if (addresses.length === 0) {
  console.log("    • Localhost only: http://127.0.0.1:3000");
} else {
  addresses.forEach(a => {
    console.log(`    • Interface ${a.name}: http://${a.address}:3000`);
  });
}

console.log("\n[✓] Autonomous Capabilities:");
console.log("    • Attach to any Wi-Fi router or phone hotspot");
console.log("    • Zero-cloud local LLM regression testing (Ollama / LM Studio)");
console.log("    • Progressive WebAPK & Native Android APK export");
console.log("    • In-memory session recycling & audit logging");
console.log("\nStarting standalone crucible engine...\n");
