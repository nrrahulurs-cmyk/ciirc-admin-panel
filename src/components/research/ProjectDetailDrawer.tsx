"use client";

import React, { useState } from "react";
import {
  X,
  FolderGit2,
  Calendar,
  Building,
  User,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Download,
  Share2,
  ExternalLink,
  ShieldAlert,
  Layers,
  Sparkles,
  Landmark,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Project, ProjectHealthStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "../common/Toast";
import { projectReportsList } from "@/data/mockData";

interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject?: (updated: Project) => void;
}

export function ProjectDetailDrawer({
  project,
  isOpen,
  onClose,
  onUpdateProject,
}: ProjectDetailDrawerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "financials" | "governance">("overview");

  if (!isOpen || !project) return null;

  const utilized = project.utilizedAmount ?? Math.round(project.fundingAmount * 0.65);
  const balance = project.balanceAmount ?? (project.fundingAmount - utilized);
  const utilizationPct = Math.round((utilized / project.fundingAmount) * 100);

  const getHealthBadge = (health?: ProjectHealthStatus) => {
    switch (health) {
      case "On Track":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "At Risk":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Delayed":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Blocked":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const handleToggleMilestone = (milestoneIndex: number) => {
    const updatedMilestones = [...project.milestones];
    const target = updatedMilestones[milestoneIndex];
    if (target) {
      target.completed = !target.completed;
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const updatedProgress = Math.round((completedCount / updatedMilestones.length) * 100);
      const updated: Project = {
        ...project,
        milestones: updatedMilestones,
        progress: updatedProgress,
      };
      onUpdateProject?.(updated);
      toast("Milestone Updated", `Marked "${target.name}" as ${target.completed ? "completed" : "pending"}.`, "success");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200/90 dark:border-slate-800 flex flex-col text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="font-mono text-[11px] font-semibold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                  {project.code}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getHealthBadge(project.healthStatus)}`}>
                  ● {project.healthStatus || "On Track"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Status: {project.status}
                </span>
              </div>

              <h2 className="text-[20px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white leading-snug">
                {project.title}
              </h2>
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
                {project.department} • Lab: <span className="font-medium text-slate-700 dark:text-slate-300">{project.lab}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Grant Summary Ribbon */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-[12px]">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Principal Investigator</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{project.pi}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Sanctioned Grant</span>
              <span className="font-bold text-[#0066cc] dark:text-sky-400">{formatCurrency(project.fundingAmount)}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Progress / Completion</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{project.progress}%</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-[#0066cc]" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 px-6 gap-6 text-[12.5px] font-medium bg-white dark:bg-slate-900">
          {[
            { id: "overview", label: "Project Overview" },
            { id: "milestones", label: `Milestones (${project.milestones.length})` },
            { id: "financials", label: "Grant Utilization & Budget" },
            { id: "governance", label: "Governance & IPR" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === t.id
                  ? "border-[#0066cc] text-[#0066cc] dark:border-sky-400 dark:text-sky-400 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-[12.5px]">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {project.healthReason && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[12px] flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-800 dark:text-amber-300">Health Status Alert: </span>
                    <span className="text-amber-700 dark:text-amber-400">{project.healthReason}</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Project Scope & Technical Abstract
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Funding Agency & Scheme</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {project.fundingAgency}
                  </div>
                  <div className="text-[11.5px] text-slate-500">Grant Ref: {project.grantNumber || "DST/CIIRC/EXT-26"}</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Timeline & Active Duration</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(project.startDate)} — {formatDate(project.endDate)}
                  </div>
                  <div className="text-[11.5px] text-emerald-600 dark:text-emerald-400 font-medium">3-Year Institutional Grant</div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Investigator Team & Collaborators
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold text-xs">
                        PI
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{project.pi}</div>
                        <div className="text-[11.5px] text-slate-500">Principal Investigator (CIIRC)</div>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0066cc] dark:text-sky-300 font-medium">
                      Primary Grant Lead
                    </span>
                  </div>

                  {project.coPis.map((coPi, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                          Co
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{coPi}</div>
                          <div className="text-[11.5px] text-slate-500">Co-Principal Investigator</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">Co-Investigator</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400">
                  Track technical deliverables and report schedules against grant commitments:
                </p>
                <span className="text-xs font-semibold text-[#0066cc] dark:text-sky-400">
                  {project.milestones.filter((m) => m.completed).length} of {project.milestones.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {project.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleMilestone(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      m.completed
                        ? "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
                        : "bg-white dark:bg-slate-850 border-slate-300/80 dark:border-slate-700 hover:border-[#0066cc]"
                    }`}
                  >
                    <div className="mt-0.5">
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-semibold ${m.completed ? "text-slate-600 dark:text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}>
                          {m.name}
                        </span>
                        <span className="text-[11.5px] font-mono text-slate-400 shrink-0">
                          {formatDate(m.date)}
                        </span>
                      </div>

                      {"deliverable" in m && m.deliverable && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#0066cc]" />
                          <span>Deliverable: <strong>{m.deliverable}</strong></span>
                          {"verifiedBy" in m && m.verifiedBy && (
                            <span className="text-emerald-600 dark:text-emerald-400">• Verified by {m.verifiedBy}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "financials" && (() => {
            const fin = project.financials || {
              projectId: project.id,
              currency: "INR",
              sanctionedTotalINR: project.fundingAmount,
              totalDisbursedINR: Math.round(project.fundingAmount * 0.8),
              totalUtilizedINR: utilized,
              balanceINR: balance,
              overallBurnRate: utilizationPct,
              budgetHeads: [
                { id: "bh-def-1", category: "Equipment & Hardware" as const, sanctionedAmountINR: Math.round(project.fundingAmount * 0.6), utilizedAmountINR: Math.round(utilized * 0.7), committedAmountINR: 500000, balanceAmountINR: Math.round(project.fundingAmount * 0.6) - Math.round(utilized * 0.7) - 500000, utilizationPercentage: 85 },
                { id: "bh-def-2", category: "Manpower & Fellowships" as const, sanctionedAmountINR: Math.round(project.fundingAmount * 0.25), utilizedAmountINR: Math.round(utilized * 0.2), committedAmountINR: 300000, balanceAmountINR: Math.round(project.fundingAmount * 0.25) - Math.round(utilized * 0.2) - 300000, utilizationPercentage: 62 },
                { id: "bh-def-3", category: "Consumables & Chemicals" as const, sanctionedAmountINR: Math.round(project.fundingAmount * 0.1), utilizedAmountINR: Math.round(utilized * 0.08), committedAmountINR: 100000, balanceAmountINR: Math.round(project.fundingAmount * 0.1) - Math.round(utilized * 0.08) - 100000, utilizationPercentage: 54 },
                { id: "bh-def-4", category: "Institutional Overheads" as const, sanctionedAmountINR: Math.round(project.fundingAmount * 0.05), utilizedAmountINR: Math.round(project.fundingAmount * 0.05), committedAmountINR: 0, balanceAmountINR: 0, utilizationPercentage: 100 },
              ],
              disbursements: [
                { id: "disb-def-1", trancheNumber: 1, sanctionOrderNumber: `SO/${project.code}/T1`, releaseDate: project.startDate, amountINR: Math.round(project.fundingAmount * 0.5), financialYear: "FY 2025-26", bankRefNumber: "SBIN-TR-01", status: "Credited" as const },
                { id: "disb-def-2", trancheNumber: 2, sanctionOrderNumber: `SO/${project.code}/T2`, releaseDate: "2026-04-10", amountINR: Math.round(project.fundingAmount * 0.3), financialYear: "FY 2026-27", bankRefNumber: "SBIN-TR-02", status: "Credited" as const },
              ],
              utilizationCertificates: [
                {
                  id: "uc-def-1",
                  ucNumber: `CIIRC/UC/${project.code}/FY25-26`,
                  financialYear: "FY 2025-26",
                  periodFrom: project.startDate,
                  periodTo: "2026-03-31",
                  sanctionedAmountINR: Math.round(project.fundingAmount * 0.5),
                  interestEarnedINR: 85000,
                  totalAvailableINR: Math.round(project.fundingAmount * 0.5) + 85000,
                  expenditureIncurredINR: Math.round(project.fundingAmount * 0.48),
                  unspentBalanceINR: Math.round(project.fundingAmount * 0.02) + 85000,
                  gfrFormType: "GFR 12-A" as const,
                  statutoryAuditorStatus: "Accepted by Agency" as const,
                  auditorName: "M/s Raman & Associates, Chartered Accountants",
                  auditorMembershipNo: "CA-084920",
                  certifiedDate: "2026-05-02",
                  documentUrl: "/docs/uc-signed.pdf",
                },
              ],
            };

            return (
              <div className="space-y-5">
                {/* 3 KPI Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
                    <span className="text-[11px] text-slate-400 block font-medium">Sanctioned Grant</span>
                    <div className="text-[20px] font-bold text-slate-900 dark:text-white mt-1">
                      {formatCurrency(fin.sanctionedTotalINR)}
                    </div>
                    <span className="text-[10.5px] text-slate-400">Total Sanction Order</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Utilized (Burn)</span>
                    <div className="text-[20px] font-bold text-[#0066cc] dark:text-sky-400 mt-1">
                      {formatCurrency(fin.totalUtilizedINR)}
                    </div>
                    <span className="text-[10.5px] text-slate-400">{fin.overallBurnRate}% Aggregate Utilization</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
                    <span className="text-[11px] text-slate-400 block font-medium">Unspent Balance</span>
                    <div className="text-[20px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {formatCurrency(fin.balanceINR)}
                    </div>
                    <span className="text-[10.5px] text-emerald-500">Awaiting FY 26-27 Tranche</span>
                  </div>
                </div>

                {/* Section 1: Budget Heads Allocation */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" />
                      <span>Itemized Budget Heads (GFR Guidelines)</span>
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                      {fin.budgetHeads.length} Budget Subheads
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {fin.budgetHeads.map((head) => (
                      <div key={head.id} className="p-3 rounded-lg bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{head.category}</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">
                            {formatCurrency(head.utilizedAmountINR)} / {formatCurrency(head.sanctionedAmountINR)} ({head.utilizationPercentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              head.utilizationPercentage >= 90
                                ? "bg-emerald-500"
                                : head.utilizationPercentage >= 50
                                ? "bg-[#0066cc]"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(head.utilizationPercentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Committed Encumbrance: {formatCurrency(head.committedAmountINR)}</span>
                          <span>Available Head Balance: {formatCurrency(head.balanceAmountINR)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Tranche Disbursements */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Grant Release Tranches</span>
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                      Disbursed: {formatCurrency(fin.totalDisbursedINR)}
                    </span>
                  </div>

                  <div className="space-y-2 text-[12px]">
                    {fin.disbursements.map((tranche) => (
                      <div key={tranche.id} className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">Tranche #{tranche.trancheNumber}</span>
                            <span className="font-mono text-[11px] text-slate-500">({tranche.sanctionOrderNumber})</span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-semibold border ${
                              tranche.status === "Credited"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }`}>
                              {tranche.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Released: {formatDate(tranche.releaseDate)} • Bank Ref: {tranche.bankRefNumber}
                          </div>
                        </div>
                        <div className="font-bold text-[13px] text-slate-900 dark:text-white shrink-0">
                          {formatCurrency(tranche.amountINR)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Formal Utilization Certificates (GFR 12-A) */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Utilization Certificates (GFR 12-A Statutory Audit)</span>
                    </h4>
                    <button
                      onClick={() => {
                        toast("GFR 12-A Draft Generated", "Compiled new Statement of Expenditure for FY 2026-27.", "success");
                      }}
                      className="text-[11px] font-semibold text-[#0066cc] dark:text-sky-400 hover:underline"
                    >
                      + Draft New UC
                    </button>
                  </div>

                  <div className="space-y-2.5 text-[12px]">
                    {fin.utilizationCertificates.map((uc) => (
                      <div key={uc.id} className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">{uc.ucNumber}</span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0066cc] dark:text-sky-300 text-[10px] font-bold">
                              {uc.gfrFormType}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            ● {uc.statutoryAuditorStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11.5px] pt-1 text-slate-600 dark:text-slate-400">
                          <div>
                            <span className="text-[10.5px] text-slate-400 block">Period:</span>
                            <span>{uc.financialYear}</span>
                          </div>
                          <div>
                            <span className="text-[10.5px] text-slate-400 block">Sanctioned:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(uc.sanctionedAmountINR)}</span>
                          </div>
                          <div>
                            <span className="text-[10.5px] text-slate-400 block">Expended:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(uc.expenditureIncurredINR)}</span>
                          </div>
                          <div>
                            <span className="text-[10.5px] text-slate-400 block">Unspent Balance:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(uc.unspentBalanceINR)}</span>
                          </div>
                        </div>

                        {uc.auditorName && (
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                            <span>Auditor: <strong>{uc.auditorName}</strong> ({uc.auditorMembershipNo})</span>
                            <button
                              onClick={() => {
                                toast("Downloading Signed GFR 12-A", `Retrieved ${uc.ucNumber} document.`, "info");
                              }}
                              className="text-[#0066cc] dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download PDF</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === "governance" && (
            <div className="space-y-4">
              {/* Public Clearance */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">Public Website Clearance</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600">
                    Approved for ciirc.jyothyit.ac.in
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[12px]">
                  Research abstract, non-confidential deliverables, and PI contact details are authorized for public syndication on the institutional web portal.
                </p>
              </div>

              {/* Statutory Project Reports (APR, Midterm, Closure) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[13px]">
                    <FileText className="w-4 h-4 text-[#0066cc] dark:text-sky-400" />
                    <span>Project Governance & Statutory Progress Reports</span>
                  </h4>
                  <button
                    onClick={() => {
                      toast("Draft Report Initiated", "Created draft template for next reporting period.", "info");
                    }}
                    className="text-[11px] font-semibold text-[#0066cc] dark:text-sky-400 hover:underline"
                  >
                    + Submit New Report
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(() => {
                    const reports = projectReportsList.filter((r) => r.projectId === project.id);
                    if (reports.length === 0) {
                      return (
                        <div className="p-3 text-center text-slate-400 text-xs border border-dashed rounded-lg border-slate-200 dark:border-slate-800">
                          Next Annual Progress Report (APR) scheduled for Q4.
                        </div>
                      );
                    }
                    return reports.map((rep) => (
                      <div key={rep.id} className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 dark:text-white">{rep.reportType}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                            rep.status === "Accepted & Cleared"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          }`}>
                            ● {rep.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                          <div>Period: <strong className="text-slate-700 dark:text-slate-300">{rep.periodCovered}</strong></div>
                          <div>Submitted: <strong className="text-slate-700 dark:text-slate-300">{formatDate(rep.submissionDate)}</strong></div>
                        </div>
                        {rep.reviewerName && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/50 p-2 rounded border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                            <div>Reviewer: <strong>{rep.reviewerName}</strong></div>
                            {rep.approverComments && <div className="italic text-slate-500">"{rep.approverComments}"</div>}
                          </div>
                        )}
                        {rep.signedUcUrl && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => toast("Downloading Signed Report", `Retrieved ${rep.reportType} documentation.`, "info")}
                              className="text-[#0066cc] dark:text-sky-400 hover:underline flex items-center gap-1 font-medium text-[11px]"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download Endorsed Report</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Linked Intellectual Property */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Linked Intellectual Property</h4>
                <div className="text-[12px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div>• Indian Patent Application: <strong>IN-202441098234 (Active IPR Filing)</strong></div>
                  <div>• Linked Peer-Reviewed Papers: <strong>{project.publicationsCount} published articles</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between text-xs">
          <span className="text-slate-500">Last synchronized with Grants Directorate: Today, 09:15 AM</span>
          <button
            onClick={() => {
              toast("Project Dossier Exported", `Full audit PDF for ${project.code} generated.`, "success");
            }}
            className="btn-secondary h-[32px] text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Project Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
