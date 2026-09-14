"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  MessageSquare,
  UserCheck,
  Filter,
  FileCheck,
  ShieldCheck,
  X,
} from "lucide-react";
import { WorkflowApprovalItem } from "@/types";
import { workflowApprovalQueue, ethicsProtocolsList } from "@/data/mockData";
import { logAuditEntry } from "@/lib/auditLogger";
import { useToast } from "../common/Toast";

export function WorkflowApprovalsView() {
  const { toast } = useToast();
  const [items, setItems] = useState<WorkflowApprovalItem[]>([
    ...workflowApprovalQueue,
    {
      id: "wf-eth-01",
      title: "Human Ethics Clearance: Clinical Evaluation of Powered Exoskeleton (AIIMS Cohort)",
      entityType: "Research Project",
      submittedBy: "Prof. Rajesh Mehta",
      submittedByRole: "Director & Lead PI",
      stage: "Approval",
      assignedReviewer: "Institutional Ethics Committee (IEC) Chairman",
      submittedAt: "10 Sep 2026",
      lastUpdated: "13 Sep 2026",
      commentsCount: 4,
      urgency: "Urgent",
      status: "Pending",
      summary: "Protocol CIIRC/IEC/2025/08-EXO (CTRI/2025/08/045892) requires final Chairman countersignature with verified patient informed consent documents.",
    },
    {
      id: "wf-uc-01",
      title: "Grant Utilization Certificate (GFR 12-A): DST Biomechatronics FY25-26",
      entityType: "Research Project",
      submittedBy: "M/s Raman & Associates (Auditor)",
      submittedByRole: "Statutory Auditor",
      stage: "Approval",
      assignedReviewer: "Finance Officer & Director",
      submittedAt: "12 Sep 2026",
      lastUpdated: "13 Sep 2026",
      commentsCount: 2,
      urgency: "Urgent",
      status: "Pending",
      summary: "GFR 12-A audited statement for ₹1.50 Crore grant release with statutory audit verification. Awaiting institutional countersignature.",
    },
    {
      id: "wf-extra-01",
      title: "IPR Invention Disclosure: Adaptive Neuromotor Exoskeleton Control",
      entityType: "Patent Filing",
      submittedBy: "Dr. Arvind Sharma",
      submittedByRole: "Associate Professor",
      stage: "Approval",
      assignedReviewer: "Dean of R&D",
      submittedAt: "12 Sep 2026",
      lastUpdated: "13 Sep 2026",
      commentsCount: 3,
      urgency: "Urgent",
      status: "Pending",
      summary: "Invention disclosure submitted for Indian Patent filing with clinical trial validation data from AIIMS cohort.",
    },
    {
      id: "wf-extra-03",
      title: "Industry Testing Service Quotation: Bosch Hydraulic Seal Analysis",
      entityType: "Research Project",
      submittedBy: "Dr. Kavitha Sundaram",
      submittedByRole: "SIF Coordinator",
      stage: "Approval",
      assignedReviewer: "Finance Desk",
      submittedAt: "13 Sep 2026",
      lastUpdated: "13 Sep 2026",
      commentsCount: 1,
      urgency: "Normal",
      status: "Pending",
      summary: "External commercial quotation of ₹5,000 generated for failure characterization on TGA & FTIR.",
    },
  ]);
  const [stageFilter, setStageFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Review Modal State
  const [selectedItemForReview, setSelectedItemForReview] = useState<WorkflowApprovalItem | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState("");

  const handleApprove = (id: string, title: string, customRemarks?: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved", stage: "Publish" } : item
      )
    );

    // Write to audit log
    logAuditEntry({
      userId: "usr-admin-01",
      userName: "Rahul Urs (Super Admin)",
      userRole: "Super Admin",
      action: `Governance Clearance Approved: ${title}`,
      entityType: "WorkflowApproval",
      entityId: id,
      newValue: { status: "Approved", remarks: customRemarks || "Cleared standard governance review." },
      status: "Success",
    });

    toast("Item Approved & Cleared", `"${title}" has cleared institutional governance. Logged in audit trail.`, "success");
    setSelectedItemForReview(null);
    setReviewRemarks("");
  };

  const handleRequestChanges = (id: string, title: string, customRemarks?: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Changes Requested" } : item
      )
    );

    logAuditEntry({
      userId: "usr-admin-01",
      userName: "Rahul Urs (Super Admin)",
      userRole: "Super Admin",
      action: `Changes Requested on Submission: ${title}`,
      entityType: "WorkflowApproval",
      entityId: id,
      newValue: { status: "Changes Requested", remarks: customRemarks || "Revision requested." },
      status: "Success",
    });

    toast("Changes Requested", `Feedback notification sent to author for "${title}".`, "warning");
    setSelectedItemForReview(null);
    setReviewRemarks("");
  };

  const handleReject = (id: string, title: string, customRemarks?: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Rejected" } : item
      )
    );

    logAuditEntry({
      userId: "usr-admin-01",
      userName: "Rahul Urs (Super Admin)",
      userRole: "Super Admin",
      action: `Submission Rejected: ${title}`,
      entityType: "WorkflowApproval",
      entityId: id,
      newValue: { status: "Rejected", remarks: customRemarks || "Declined." },
      status: "Denied",
    });

    toast("Submission Rejected", `Record marked as non-compliant: "${title}".`, "error");
    setSelectedItemForReview(null);
    setReviewRemarks("");
  };

  const handleDelegate = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, assignedReviewer: "Expert Committee Panel" } : item
      )
    );
    toast("Item Delegated", `"${title}" escalated to Expert Review Panel.`, "info");
  };

  const filtered = items.filter((item) => {
    const matchStage = stageFilter === "All" || item.stage === stageFilter;
    const matchType = typeFilter === "All" || item.entityType === typeFilter;
    return matchStage && matchType;
  });

  const stages = [
    { name: "Draft", count: 2 },
    { name: "Review", count: items.filter((i) => i.stage === "Review").length },
    { name: "Approval", count: items.filter((i) => i.stage === "Approval").length },
    { name: "Publish", count: items.filter((i) => i.stage === "Publish").length },
  ];

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Governance & Approval Pipeline</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {items.filter((i) => i.status === "Pending").length} pending action
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Gated review stages ensuring intellectual property, ethics, and communications compliance.
          </p>
        </div>
      </div>

      {/* Visual 4-Stage Governance Pipeline Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stages.map((st, idx) => (
          <div
            key={st.name}
            onClick={() => setStageFilter(st.name)}
            className={`p-4 rounded-2xl ref-card transition-all cursor-pointer ${
              stageFilter === st.name
                ? "ring-1 ring-[#0066cc] bg-[#edf2fe] dark:bg-blue-950/40"
                : "hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Stage 0{idx + 1}
              </span>
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {st.count}
              </span>
            </div>
            <div className="text-[15px] font-semibold text-slate-900 dark:text-white mt-1.5">
              {st.name}
            </div>
            <div className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              {idx === 0 && "Author preparation"}
              {idx === 1 && "Peer / Technical audit"}
              {idx === 2 && "Director / Dean clearance"}
              {idx === 3 && "Live institutional release"}
            </div>
          </div>
        ))}
      </div>

      {/* Approvals Queue */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              Pending Clearance Queue
            </h2>
            <span className="text-[12px] font-normal text-slate-500">
              ({filtered.length} items)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "Patent Filing", "Research Project", "Publication", "MOU", "News Article"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  typeFilter === type
                    ? "bg-[#0066cc] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl ref-card flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/40 dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/40">
                    {item.entityType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      item.urgency === "Urgent"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {item.urgency}
                  </span>
                  <span className="text-[12px] text-slate-400">
                    Submitted by <strong className="font-semibold text-slate-700 dark:text-slate-300">{item.submittedBy}</strong> ({item.submittedByRole})
                  </span>
                </div>

                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
                    <span>Assigned Reviewer: <strong className="font-semibold text-slate-800 dark:text-slate-200">{item.assignedReviewer}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.85} />
                    <span>Submitted: {item.submittedAt}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.85} />
                    <span>{item.commentsCount} comments</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                {item.status === "Approved" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approved & Cleared</span>
                  </span>
                ) : item.status === "Changes Requested" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Awaiting Author Fixes</span>
                  </span>
                ) : item.status === "Rejected" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <XCircle className="w-4 h-4" />
                    <span>Declined</span>
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleDelegate(item.id, item.title)}
                      className="btn-secondary h-[32px] px-2.5 text-[11.5px] text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                    >
                      Delegate
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItemForReview(item);
                        setReviewRemarks("");
                      }}
                      className="btn-primary h-[32px] px-3 text-[11.5px] flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Review Dossier</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Clearance Action Modal */}
      {selectedItemForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/60 dark:text-sky-300">
                    {selectedItemForReview.entityType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                    selectedItemForReview.urgency === "Urgent"
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {selectedItemForReview.urgency}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedItemForReview.title}
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Author: <strong className="text-slate-700 dark:text-slate-300">{selectedItemForReview.submittedBy}</strong> ({selectedItemForReview.submittedByRole})
                </p>
              </div>

              <button
                onClick={() => setSelectedItemForReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-[12.5px] max-h-[60vh] overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Submission Summary & Scope
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedItemForReview.summary}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-800 dark:text-slate-200">
                  Reviewer Statutory Notes & Caveats
                </label>
                <textarea
                  rows={3}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="Enter formal clearance observations, contingency requirements, or rejection rationale..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 text-[11.5px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-[#0066cc] dark:text-sky-300">Statutory Audit Trail Record</div>
                <div>Action will be cryptographically logged under institutional role <strong>Super Admin / Director</strong>.</div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => handleReject(selectedItemForReview.id, selectedItemForReview.title, reviewRemarks)}
                className="btn-secondary h-[34px] px-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold"
              >
                Reject
              </button>
              <button
                onClick={() => handleRequestChanges(selectedItemForReview.id, selectedItemForReview.title, reviewRemarks)}
                className="btn-secondary h-[34px] px-3 font-semibold"
              >
                Request Author Fixes
              </button>
              <button
                onClick={() => handleApprove(selectedItemForReview.id, selectedItemForReview.title, reviewRemarks)}
                className="btn-primary h-[34px] px-4 font-semibold !bg-emerald-600 hover:!bg-emerald-700 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Grant Clearance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
