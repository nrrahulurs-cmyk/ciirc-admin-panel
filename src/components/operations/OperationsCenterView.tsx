"use client";

import React, { useState } from "react";
import {
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Wrench,
  Users,
  FolderGit2,
  Handshake,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { OperationalDeadline, DataQualityIssue, ModuleId } from "@/types";
import { operationalDeadlinesList, dataQualityIssuesList } from "@/data/mockData";
import { useToast } from "../common/Toast";

interface OperationsCenterViewProps {
  onSelectModule?: (mod: ModuleId) => void;
}

export function OperationsCenterView({ onSelectModule }: OperationsCenterViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"calendar" | "quality">("calendar");
  const [timelineWindow, setTimelineWindow] = useState<"7days" | "30days" | "90days">("30days");

  const [deadlines, setDeadlines] = useState<OperationalDeadline[]>(operationalDeadlinesList);
  const [issues, setIssues] = useState<DataQualityIssue[]>(dataQualityIssuesList);
  const [qualityScore, setQualityScore] = useState(93);

  const handleResolveIssue = (issueId: string, actionTitle: string, targetModule: ModuleId) => {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
    setQualityScore((prev) => Math.min(100, prev + 2));
    toast("Remediation Action Dispatched", `Action "${actionTitle}" executed. Data Quality score updated.`, "success");
    if (onSelectModule) {
      onSelectModule(targetModule);
    }
  };

  const handleMarkDeadlineComplete = (id: string, title: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Completed" } : d))
    );
    toast("Deadline Fulfilled", `"${title}" logged as compliant in institutional register.`, "success");
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Operations Center & Data Quality</span>
            <span className="text-[11.5px] font-medium px-2.5 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              Institutional Cockpit
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Forward operational horizon for grant deliverables, calibration windows, MOU renewals, and automated metadata hygiene auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toast("Audit Report Synchronized", "Data Quality Hygiene re-assessed across all 984 institutional records.", "info");
            }}
            className="btn-secondary h-[35px] text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Run Audit</span>
          </button>
        </div>
      </div>

      {/* Institutional Health & Quality Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Score Card */}
        <div className="p-5 rounded-2xl ref-card flex items-center justify-between">
          <div>
            <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
              Institutional Data Quality Score
            </span>
            <div className="text-[32px] font-extrabold text-[#0066cc] dark:text-sky-400 mt-0.5">
              {qualityScore}<span className="text-[20px] font-semibold text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Top 5% University Research Hygiene
            </div>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#0066cc]/10 text-[#0066cc] dark:text-sky-400 flex items-center justify-center font-extrabold text-[22px]">
            A+
          </div>
        </div>

        {/* Forward Deliverables */}
        <div className="p-5 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Upcoming Critical Milestones
          </span>
          <div className="text-[32px] font-bold text-slate-900 dark:text-white mt-0.5">
            {deadlines.filter((d) => d.status !== "Completed").length} Pending
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            2 Grant Reports • 1 MOU • 1 Laser Calibration
          </div>
        </div>

        {/* Flagged Hygiene Issues */}
        <div className="p-5 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Flagged Metadata Remediation
          </span>
          <div className="text-[32px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {issues.length} Items
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            1-Click automated fix actions ready
          </div>
        </div>
      </div>

      {/* Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-1 gap-4 text-[13px]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              activeTab === "calendar"
                ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4 text-[#0066cc]" />
            <span>Forward Operations Horizon ({deadlines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("quality")}
            className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              activeTab === "quality"
                ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Data Quality & Metadata Hygiene ({issues.length})</span>
          </button>
        </div>

        {activeTab === "calendar" && (
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            {[
              { id: "7days", label: "Next 7 Days" },
              { id: "30days", label: "Next 30 Days" },
              { id: "90days", label: "Next 90 Days" },
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => setTimelineWindow(w.id as any)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  timelineWindow === w.id
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: OPERATIONAL FORWARD CALENDAR */}
      {activeTab === "calendar" && (
        <div className="space-y-3">
          {deadlines.map((dl) => (
            <div
              key={dl.id}
              className={`p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                dl.status === "Completed" ? "opacity-60 bg-slate-50/50" : ""
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      dl.urgency === "urgent"
                        ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        : dl.urgency === "warning"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-blue-500/10 text-[#0066cc] border border-blue-500/20"
                    }`}
                  >
                    {dl.category}
                  </span>
                  <span className="text-[12px] font-mono text-slate-500">
                    Due: <strong>{dl.dueDate}</strong>
                  </span>
                  <span className="text-[11.5px] text-slate-400">• Owner: {dl.assignedTo}</span>
                </div>

                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {dl.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                {dl.status !== "Completed" ? (
                  <button
                    onClick={() => handleMarkDeadlineComplete(dl.id, dl.title)}
                    className="btn-primary h-[33px] text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fulfill Milestone</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed & Logged</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DATA QUALITY & METADATA HYGIENE */}
      {activeTab === "quality" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-[12.5px] text-slate-600 dark:text-slate-300">
            <strong>Continuous Hygiene Engine:</strong> Actively monitors database integrity, orphan relationships, missing ORCID/DOI handles, and equipment calibration compliance across all active institutional entities.
          </div>

          <div className="space-y-3">
            {issues.map((iss) => (
              <div
                key={iss.id}
                className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0066cc]/40 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        iss.severity === "Critical"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : iss.severity === "Warning"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                      }`}
                    >
                      {iss.severity}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                      {iss.entityType}: {iss.entityName}
                    </span>
                  </div>

                  <p className="text-[13px] text-slate-600 dark:text-slate-400">
                    {iss.issueDescription}
                  </p>
                </div>

                <button
                  onClick={() => handleResolveIssue(iss.id, iss.remediationAction, iss.targetModule)}
                  className="btn-primary h-[34px] text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{iss.remediationAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
