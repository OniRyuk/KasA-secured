import React, { useState } from "react";
import { 
  Lock, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  Calendar,
  Activity,
  Globe,
  User
} from "lucide-react";
import { AuditLogEntry, UserRole } from "../types";

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
  currentRole: UserRole;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, currentRole }) => {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter((log) => {
    const matchesRole = roleFilter === "all" || log.role === roleFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Role-Based Access Control & Audit Telemetry
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
              Active Role: {currentRole.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Brief but detailed operational audit logs to safeguard creators building generative AI pipelines. Records actions, model executions, and quota rollover events.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Logs (JSON)</span>
        </button>
      </div>

      {/* Quick Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Total Audit Events</span>
          <span className="text-xl font-bold font-mono text-slate-100">{logs.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-emerald-400 block font-medium">Successful Actions</span>
          <span className="text-xl font-bold font-mono text-emerald-300">
            {logs.filter((l) => l.status === "success").length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-amber-400 block font-medium">Warnings & Rollovers</span>
          <span className="text-xl font-bold font-mono text-amber-300">
            {logs.filter((l) => l.status === "warning").length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-cyan-400 block font-medium">IP Recycler Events</span>
          <span className="text-xl font-bold font-mono text-cyan-300">
            {logs.filter((l) => l.action.includes("IP_")).length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit actions, targets, details, or actors..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="creator">Creator Only</option>
          <option value="qa_engineer">QA Engineer Only</option>
          <option value="admin">Admin Only</option>
          <option value="viewer">Viewer Only</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Status & Action</th>
                <th className="py-3 px-4">Actor / Role</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  {/* Action & Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {log.status === "success" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : log.status === "warning" ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className="font-mono font-semibold text-slate-200">
                        {log.action}
                      </span>
                    </div>
                  </td>

                  {/* Actor & Role */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div>
                      <span className="text-slate-300 font-medium">{log.actor}</span>
                      <span className="block text-[10px] text-slate-500 capitalize">
                        {log.role.replace("_", " ")}
                      </span>
                    </div>
                  </td>

                  {/* Target Resource */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-indigo-300 font-mono text-[11px] bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/40">
                      {log.target}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="py-3 px-4 max-w-xs sm:max-w-md">
                    <p className="text-slate-300 line-clamp-2 text-[11px] leading-relaxed">
                      {log.details}
                    </p>
                  </td>

                  {/* IP Address */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-cyan-400">
                    {log.ipAddress}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-4 whitespace-nowrap text-right text-[11px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No audit records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
