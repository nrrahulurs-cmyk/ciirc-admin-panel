"use client";

import React, { useState } from "react";
import {
  History,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Clock,
} from "lucide-react";
import { AuditLogItem } from "@/types";
import { auditLogsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

export function AuditLogsView() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogItem[]>(auditLogsList);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || log.result === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportAuditTrail = () => {
    toast("Audit Trail Exported", "Generated cryptographically verified immutable security log.", "success");
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Institutional Audit Trail</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              SOC 2 / ISO 27001 Log
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable, timestamped event log for all administrative modifications, publication clearances and authentication events.
          </p>
        </div>

        <button
          onClick={exportAuditTrail}
          className="btn-primary h-[35px]"
        >
          <Download className="w-3.5 h-3.5" strokeWidth={1.85} />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl ref-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by user, action or entity..."
            className="w-full h-[35px] pl-8 pr-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Results</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl ref-card overflow-hidden">
        <table className="w-full text-left text-[12.5px]">
          <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">User & Role</th>
              <th className="py-3.5 px-3">Action Description</th>
              <th className="py-3.5 px-3">Target Entity</th>
              <th className="py-3.5 px-3">IP / Session</th>
              <th className="py-3.5 px-3">Timestamp</th>
              <th className="py-3.5 px-4 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.userAvatar}
                      alt={item.user}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-[13px]">
                        {item.user}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.userRole}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {item.action}
                </td>

                <td className="py-3.5 px-3 font-mono text-slate-500 max-w-[180px] truncate text-[11.5px]">
                  {item.entity}
                </td>

                <td className="py-3.5 px-3 font-mono text-slate-400 text-[11.5px]">
                  {item.ip}
                </td>

                <td className="py-3.5 px-3 font-mono text-slate-400 text-[11.5px]">
                  {item.timestamp}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      item.result === "Success"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : item.result === "Warning"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {item.result === "Success" && <CheckCircle2 className="w-3 h-3" />}
                    {item.result === "Warning" && <AlertTriangle className="w-3 h-3" />}
                    {item.result === "Failed" && <XCircle className="w-3 h-3" />}
                    <span>{item.result}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
