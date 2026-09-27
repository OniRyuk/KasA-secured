import React, { useState } from "react";
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Lock, 
  Calendar, 
  User, 
  AlertCircle
} from "lucide-react";

export const LegalAgreementView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const agreementText = `SOFTWARE OWNERSHIP, INTELLECTUAL PROPERTY & SOVEREIGN RECOGNITION AGREEMENT

EFFECTIVE DATE: September 3, 2026
SOLE OWNER & AUTHOR: Scott Gushea
STATUS: EXCLUSIVE & PERPETUAL TITLE

--------------------------------------------------------------------------------
1. SOLE OWNERSHIP & INTELLECTUAL PROPERTY DECLARATION
This Agreement conclusively affirms that Scott Gushea is the sole author, developer, 
and absolute owner of all intellectual property, source code, diagnostic engines, 
hardware sentinels, regression test suites, and sovereign personal GPT frameworks 
contained within this software system (collectively, the "Software").

2. EXCLUSION OF THIRD-PARTY LICENSEES
There are no other licensees, co-owners, partners, assignees, or third-party rights 
holders. No third party holds any open-ended license, sublicensing rights, equity, 
or claim of ownership. Any unauthorized deployment, fork, reverse engineering, 
tampering, or commercial exploitation is strictly forbidden and subject to maximum 
statutory enforcement under applicable domestic and international intellectual property law.

3. SOVEREIGN INTEGRITY & TAMPER PROTOCOL
The Software incorporates cryptographic hashing, rolling verification codes, 
and defensive integrity monitoring. Any unauthorized attempt to inject rogue 
payloads, modify system binaries, or circumvent access governance triggers an 
immediate defensive lockdown and audit logging.

4. DISCLAIMER & AS-IS EXECUTION
The Software is maintained directly by Scott Gushea. Any evaluation or administrative 
execution is performed on an "AS IS" and "AS AVAILABLE" basis without external warranty. 
Scott Gushea retains the unilateral right to update, modify, restrict, or revoke 
runtime instances at his sole discretion.

5. GOVERNING LAW & SEVERABILITY
This Agreement is governed by the laws of the jurisdiction of Scott Gushea. If any 
provision is held invalid or unenforceable, all remaining provisions remain in full 
legal force and effect.

--------------------------------------------------------------------------------
EXECUTED AND RATIFIED AS OF SEPTEMBER 3, 2026:

SOLE OWNER & DEVELOPER:
Signature: /s/ Scott Gushea
Printed Name: Scott Gushea
Title: Software Developer, System Architect & Sole Proprietor
Date of Execution: September 3, 2026
Execution Status: Ratified & Posted to Product
--------------------------------------------------------------------------------`;

  const handleCopy = () => {
    navigator.clipboard.writeText(agreementText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([agreementText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Scott_Gushea_Software_Agreement_2026.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="legal-agreement-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-neutral-900 to-black border border-red-600/50 rounded-xl p-6 mb-8 shadow-xl shadow-red-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/80 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  SOVEREIGN OWNERSHIP & LEGAL AGREEMENT
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white tracking-wider uppercase">
                  Executed
                </span>
              </div>
              <p className="text-sm text-zinc-300 mt-1">
                Sole Title & Intellectual Property Ratification for <strong className="text-white font-bold">Scott Gushea</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-agreement-btn"
              onClick={handleCopy}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copied ? "Copied" : "Copy Agreement"}</span>
            </button>
            <button
              id="download-agreement-btn"
              onClick={handleDownload}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-red-950 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export .TXT</span>
            </button>
          </div>
        </div>

        {/* Badges metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-400 bg-black/50 p-2.5 rounded-lg border border-zinc-800/80">
            <User className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Sole Owner / Author</div>
              <div className="font-bold text-white">Scott Gushea</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 bg-black/50 p-2.5 rounded-lg border border-zinc-800/80">
            <Calendar className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Effective & Execution Date</div>
              <div className="font-bold text-white">September 3, 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 bg-black/50 p-2.5 rounded-lg border border-zinc-800/80">
            <Lock className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Licensee Status</div>
              <div className="font-bold text-white">No Other Licensee (Closed)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Document Content */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 sm:p-8 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed shadow-lg">
        <div className="text-center pb-6 border-b border-zinc-800 mb-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
            SOFTWARE OWNERSHIP & INTELLECTUAL PROPERTY RATIFICATION
          </h2>
          <div className="text-red-400 font-semibold text-xs">
            RECORD IDENTIFIER: SG-IP-20260903-CLOSED
          </div>
        </div>

        <section className="space-y-6">
          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-xs mb-2 text-red-400">
              SECTION 1: PARTIES & ABSOLUTE TITLE
            </h3>
            <p className="text-zinc-300">
              This Agreement is made, executed, and ratified on <strong className="text-white">September 3, 2026</strong>, by and for <strong className="text-white">Scott Gushea</strong> ("Owner", "Author", "Developer"). 
              Scott Gushea retains sole, exclusive, unencumbered, and perpetual title, ownership, copyright, patent, trademark, and trade secret rights in and to this entire software product, including the personal GPT sovereign framework, automated regression test suites, diagnostic hardware agents, and associated source code.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-xs mb-2 text-red-400">
              SECTION 2: COMPLETE EXCLUSION OF THIRD-PARTY LICENSEES
            </h3>
            <p className="text-zinc-300">
              <strong className="text-white">There is no other licensee.</strong> The license grant is strictly closed and non-open-ended. No third party, organization, enterprise, or individual holds any rights of reproduction, redistribution, sublicensing, commercial exploitation, white-labeling, or derivative works without an express subsequent written deed executed by Scott Gushea.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-xs mb-2 text-red-400">
              SECTION 3: SECURITY, VERIFICATION & TAMPER IMMUNITY
            </h3>
            <p className="text-zinc-300">
              The product incorporates a cryptographic 5-file integrity verification engine, synchronized rolling authorization codes, and local runtime protection. Any unauthorized attempt to inject third-party payloads, alter core binaries, or spoof access controls constitutes an immediate violation of security perimeters and will trigger automatic lockdown.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-xs mb-2 text-red-400">
              SECTION 4: RATIFICATION & ELECTRONIC EXECUTION
            </h3>
            <p className="text-zinc-300">
              By posting directly to this software product on September 3, 2026, this document stands as the definitive public-facing and product-embedded ownership certificate of Scott Gushea.
            </p>
          </div>

          {/* Electronic Signature Box */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-zinc-800 bg-black/70 p-5 rounded-lg border border-zinc-800">
            <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">
              OFFICIAL ELECTRONIC SIGNATURE & ATTESTATION
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-zinc-400">AUTHOR / LICENSOR SIGNATURE:</div>
                <div className="text-base font-serif italic text-red-400 font-bold tracking-wider mt-1">
                  /s/ Scott Gushea
                </div>
                <div className="text-xs text-white font-bold mt-1">Scott Gushea</div>
                <div className="text-[11px] text-zinc-400">Software Developer & Sole System Architect</div>
              </div>
              <div>
                <div className="text-[11px] text-zinc-400">DATE & TIMESTAMP:</div>
                <div className="text-xs font-mono text-zinc-200 font-bold mt-1">
                  September 3, 2026
                </div>
                <div className="text-[11px] text-zinc-400 mt-2">LICENSEE STATUS:</div>
                <div className="text-xs font-mono text-red-400 font-semibold">
                  CLOSED (NO OTHER LICENSEE)
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
