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
  GraduationCap,
  History,
  Award,
  Database,
  Archive,
} from "lucide-react";
import {
  OperationalDeadline,
  DataQualityIssue,
  ModuleId,
  TrainingProgram,
  InstitutionalTimelineEvent,
  DataRetentionRecord,
  ResearchIncentiveRecord,
} from "@/types";
import {
  operationalDeadlinesList,
  dataQualityIssuesList,
  trainingProgramsList,
  institutionalTimelineList,
  dataRetentionRecordsList,
  researchIncentivesList,
} from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "../common/Toast";

interface OperationsCenterViewProps {
  onSelectModule?: (mod: ModuleId) => void;
}

export function OperationsCenterView({ onSelectModule }: OperationsCenterViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"calendar" | "quality" | "training" | "timeline" | "data-retention" | "incentives">("calendar");
  const [timelineWindow, setTimelineWindow] = useState<"7days" | "30days" | "90days">("30days");

  const [deadlines, setDeadlines] = useState<OperationalDeadline[]>(operationalDeadlinesList);
  const [issues, setIssues] = useState<DataQualityIssue[]>(dataQualityIssuesList);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(trainingProgramsList);
  const [timelineEvents, setTimelineEvents] = useState<InstitutionalTimelineEvent[]>(institutionalTimelineList);
  const [dataRetentionRecords, setDataRetentionRecords] = useState<DataRetentionRecord[]>(dataRetentionRecordsList);
  const [researchIncentives, setResearchIncentives] = useState<ResearchIncentiveRecord[]>(researchIncentivesList);
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
            <span>Data Quality ({issues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("training")}
            className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              activeTab === "training"
                ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Training & Workshops ({trainingPrograms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              activeTab === "timeline"
                ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <History className="w-4 h-4 text-amber-600" />
            <span>Timeline ({timelineEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("data-retention")}
            className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              activeTab === "data-retention"
                ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>Data Retention ({dataRetentionRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("incentives")}
            className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              activeTab === "incentives"
                ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Faculty Incentives ({researchIncentives.length})</span>
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

      {/* TAB 3: TRAINING & WORKSHOPS */}
      {activeTab === "training" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] font-medium text-slate-400 block">Total Programs</span>
              <div className="text-[24px] font-bold text-slate-900 dark:text-white">{trainingPrograms.length}</div>
              <span className="text-[11px] text-purple-600 font-medium">Workshops, FDPs & Courses</span>
            </div>
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] font-medium text-slate-400 block">Total Registered</span>
              <div className="text-[24px] font-bold text-slate-900 dark:text-white">
                {trainingPrograms.reduce((acc, p) => acc + p.registeredCount, 0)}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Researchers & Scholars</span>
            </div>
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] font-medium text-slate-400 block">Avg Feedback Score</span>
              <div className="text-[24px] font-bold text-slate-900 dark:text-white">
                {(
                  trainingPrograms.reduce((acc, p) => acc + (p.averageFeedbackScore || 0), 0) /
                  (trainingPrograms.filter((p) => p.averageFeedbackScore).length || 1)
                ).toFixed(2)}
                <span className="text-[16px] text-slate-400">/5.0</span>
              </div>
              <span className="text-[11px] text-amber-500 font-medium">High Satisfaction Rating</span>
            </div>
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] font-medium text-slate-400 block">Certifications Issued</span>
              <div className="text-[24px] font-bold text-slate-900 dark:text-white">
                {trainingPrograms.filter((p) => p.certificateIssued).reduce((acc, p) => acc + p.attendedCount, 0)}
              </div>
              <span className="text-[11px] text-[#0066cc] font-medium">Verified Credentials</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingPrograms.map((prog) => (
              <div key={prog.id} className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-800 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                      {prog.targetAudience}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {prog.certificateIssued ? "Certified Program" : "Standard Training"}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                    {prog.programTitle}
                  </h3>

                  <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Organized by: <strong className="text-slate-700 dark:text-slate-300">{prog.organization}</strong> ({prog.domainName})
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[12px]">
                    <div className="text-slate-500">
                      Trainer: <strong className="text-slate-800 dark:text-slate-200">{prog.trainerName}</strong>
                    </div>
                    <div className="text-slate-500">
                      Role: <strong className="text-slate-800 dark:text-slate-200">{prog.trainerDesignation}</strong>
                    </div>
                    <div className="text-slate-500">
                      Dates: <strong className="text-slate-800 dark:text-slate-200">{prog.startDate} → {prog.endDate}</strong>
                    </div>
                    <div className="text-slate-500">
                      Attended: <strong className="text-slate-800 dark:text-slate-200">{prog.attendedCount} / {prog.registeredCount}</strong>
                    </div>
                  </div>

                  {/* Enrollment Progress */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-500">
                      <span>Capacity: {prog.registeredCount} / {prog.capacity}</span>
                      <span>{Math.round((prog.registeredCount / prog.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${Math.min(100, (prog.registeredCount / prog.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11.5px] text-slate-400">
                    ★ {prog.averageFeedbackScore}/5.0 Participant Score
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast("Training Syllabus", `${prog.programTitle}: Course materials dispatched to participants.`, "info")}
                      className="btn-secondary h-[30px] text-xs px-2.5"
                    >
                      Syllabus
                    </button>
                    <button
                      onClick={() => toast("Certificates Issued", `Verified institutional credentials issued for ${prog.attendedCount} participants.`, "success")}
                      className="btn-primary h-[30px] text-xs px-2.5 flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificates</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HISTORICAL INSTITUTIONAL TIMELINE */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-[12.5px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <div>
              <strong>CIIRC Institutional Chronicles (2014 – Present):</strong> Canonical historical milestones, foundation charters, research chair appointments, major grants, and accreditation landmarks.
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 shrink-0 ml-3">
              {timelineEvents.length} Verified Milestones
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Node indicator */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 transition-all ${
                  evt.importance === "Milestone"
                    ? "border-amber-500 ring-4 ring-amber-500/20"
                    : "border-[#0066cc] ring-2 ring-blue-500/20"
                }`} />

                <div className={`p-5 rounded-2xl ref-card transition-all ${
                  evt.importance === "Milestone" ? "border-amber-300/80 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/10" : ""
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-extrabold text-[#0066cc] dark:text-sky-400 font-mono">
                        {evt.year}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        ({evt.date})
                      </span>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {evt.category}
                      </span>
                      {evt.importance === "Milestone" && (
                        <span className="text-[10.5px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          Milestone
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toast("Verified Archive Record", `Opening verified archival record for: ${evt.title}`, "info")}
                      className="text-[11.5px] text-[#0066cc] hover:underline font-medium flex items-center gap-1 shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Archive Record</span>
                    </button>
                  </div>

                  <h4 className="text-[16px] font-bold text-slate-900 dark:text-white mb-1.5">
                    {evt.title}
                  </h4>

                  <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {evt.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                    <span>Visibility: {evt.publicVisibility ? "Public Portal" : "Internal Restricted"}</span>
                    <span>Status: Verified Institutional Archive</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: RESEARCH DATA RETENTION & STATUTORY COMPLIANCE */}
      {/* ========================================== */}
      {activeTab === "data-retention" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-[12.5px] flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-[#0066cc] dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Statutory Research Data Management & 7–10 Year Retention Clocks
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[12px] mt-0.5">
                  Compliant with DST Extramural Guidelines, ICMR Clinical Trial Protocols (7 Years), and DRDO Defence Classification Schedules (10 Years). All datasets cryptographically sealed with SHA-256 integrity checksums.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                toast("Cryptographic Verification Complete", "All 4 archived datasets passed SHA-256 integrity check.", "success");
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0066cc] text-white font-semibold text-xs shrink-0 hover:bg-[#0055b3]"
            >
              Verify Checksums
            </button>
          </div>

          <div className="space-y-3">
            {dataRetentionRecords.map((rdm) => (
              <div
                key={rdm.id}
                className="p-5 rounded-2xl ref-card flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-blue-500/40 transition-all"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2 py-0.5 rounded">
                      {rdm.recordCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      ● {rdm.retentionComplianceStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-purple-500/10 text-purple-600">
                      {rdm.dataClassification}
                    </span>
                    <span className="text-[11.5px] text-slate-500">
                      • {rdm.statutoryBasis} ({rdm.mandatoryRetentionYears} Years Statutory Mandate)
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                    {rdm.datasetTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[12px] text-slate-600 dark:text-slate-400 pt-1">
                    <div>
                      <span className="text-[10.5px] text-slate-400 block">Project:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{rdm.projectCode}</span> ({rdm.piName})
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-400 block">Storage Vault:</span>
                      <span>{rdm.storageLocation} ({rdm.volumeGB} GB)</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-400 block">Data Steward:</span>
                      <span>{rdm.dataSteward}</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-400 block">Destruction Due:</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{rdm.destructionDueDate}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-400 font-mono truncate">
                    <span>SHA-256: {rdm.integrityHashSHA256}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      toast("Dataset Manifest Downloaded", `Retrieved archival manifest for ${rdm.recordCode}.`, "info");
                    }}
                    className="btn-secondary h-[33px] text-xs flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Manifest</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: FACULTY RESEARCH INCENTIVES & HONORARIUMS */}
      {/* ========================================== */}
      {activeTab === "incentives" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl ref-card">
              <span className="text-[11.5px] font-medium text-slate-500 block">Total Approved Incentive Pool</span>
              <div className="text-[24px] font-bold text-slate-900 dark:text-white mt-1">₹5,45,000</div>
              <span className="text-[11px] text-emerald-600 font-semibold">AY 2025-26 Annual Cycle</span>
            </div>
            <div className="p-4 rounded-2xl ref-card">
              <span className="text-[11.5px] font-medium text-slate-500 block">Cumulative Incentive Points</span>
              <div className="text-[24px] font-bold text-[#0066cc] dark:text-sky-400 mt-1">545 Points</div>
              <span className="text-[11px] text-slate-400">4 Lead PIs Accredited</span>
            </div>
            <div className="p-4 rounded-2xl ref-card">
              <span className="text-[11.5px] font-medium text-slate-500 block">Governance Formula</span>
              <div className="text-[12px] font-medium text-slate-700 dark:text-slate-300 mt-1">
                Q1: 30 pts • Q2: 15 pts • Patent: 50 pts • Grant &gt;1Cr: 40 pts
              </div>
              <span className="text-[11px] text-slate-400">Policy CIIRC-POL-INC-06</span>
            </div>
          </div>

          <div className="space-y-3">
            {researchIncentives.map((inc) => (
              <div
                key={inc.id}
                className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[15px] text-slate-900 dark:text-white">
                      {inc.facultyName}
                    </span>
                    <span className="text-[11.5px] text-slate-400">({inc.department})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                      inc.disbursementStatus === "Finance Disbursed"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : inc.disbursementStatus === "Dean R&D Cleared"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}>
                      ● {inc.disbursementStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px] text-slate-600 dark:text-slate-400">
                    <div>Q1 Papers: <strong>{inc.q1JournalPoints} pts</strong></div>
                    <div>Q2 Papers: <strong>{inc.q2JournalPoints} pts</strong></div>
                    <div>Patents Granted: <strong>{inc.patentsGrantedPoints} pts</strong></div>
                    <div>Sponsored Grants: <strong>{inc.sponsoredGrantPoints} pts</strong></div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">{inc.totalPoints} Total Points</span>
                    <span className="text-[18px] font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(inc.calculatedHonorariumINR)}
                    </span>
                  </div>

                  {inc.disbursementStatus !== "Finance Disbursed" && (
                    <button
                      onClick={() => {
                        setResearchIncentives((prev) =>
                          prev.map((item) =>
                            item.id === inc.id ? { ...item, disbursementStatus: "Finance Disbursed", disbursedDate: "Today" } : item
                          )
                        );
                        toast("Disbursement Approved", `Transferred ${formatCurrency(inc.calculatedHonorariumINR)} honorarium to ${inc.facultyName}.`, "success");
                      }}
                      className="btn-primary h-[33px] px-3 text-xs"
                    >
                      Authorize Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
