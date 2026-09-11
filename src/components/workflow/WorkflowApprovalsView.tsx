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
} from "lucide-react";
import { WorkflowApprovalItem } from "@/types";
import { workflowApprovalQueue } from "@/data/mockData";
import { useToast } from "../common/Toast";

export function WorkflowApprovalsView() {
  const { toast } = useToast();
  const [items, setItems] = useState<WorkflowApprovalItem[]>(workflowApprovalQueue);
  const [stageFilter, setStageFilter] = useState("All");

  const handleApprove = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved", stage: "Publish" } : item
      )
    );
    toast("Item Approved", `"${title}" has cleared institutional governance.`, "success");
  };

  const handleRequestChanges = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Changes Requested" } : item
      )
    );
    toast("Changes Requested", `Feedback notification sent to author for "${title}".`, "warning");
  };

  const handleReject = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Rejected" } : item
      )
    );
    toast("Submission Rejected", `Record marked as non-compliant: "${title}".`, "error");
  };

  const filtered = items.filter(
    (item) => stageFilter === "All" || item.stage === stageFilter
  );

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
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Pending Clearance Queue</span>
            {stageFilter !== "All" && (
              <span className="text-[12px] font-normal text-slate-500">
                (Filtered by {stageFilter})
              </span>
            )}
          </h2>

          {stageFilter !== "All" && (
            <button
              onClick={() => setStageFilter("All")}
              className="text-[12px] text-[#0066cc] dark:text-sky-400 font-medium hover:underline"
            >
              Clear filter
            </button>
          )}
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
                      onClick={() => handleRequestChanges(item.id, item.title)}
                      className="btn-secondary h-[32px] px-3 text-[12px]"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => handleReject(item.id, item.title)}
                      className="btn-secondary h-[32px] px-3 text-[12px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(item.id, item.title)}
                      className="btn-primary h-[32px] px-3.5 text-[12px] !bg-emerald-600 hover:!bg-emerald-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
