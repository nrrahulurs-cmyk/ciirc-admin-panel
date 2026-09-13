"use client";

import React, { useState } from "react";
import {
  Inbox,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  Eye,
  Sliders,
  FileSpreadsheet,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { FormSubmission, ServiceDeskTicket } from "@/types";
import { formSubmissionsList, serviceDeskTicketsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string;
}

export function FormsView() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"submissions" | "builder" | "service-desk">("submissions");
  const [submissions, setSubmissions] = useState<FormSubmission[]>(formSubmissionsList);
  const [tickets, setTickets] = useState<ServiceDeskTicket[]>(serviceDeskTicketsList);
  const [selectedSub, setSelectedSub] = useState<FormSubmission | null>(null);

  // Form builder fields state
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "f1", label: "Full Name", type: "text", required: true, placeholder: "e.g. Dr. Priya Sharma" },
    { id: "f2", label: "Institutional / Work Email", type: "email", required: true, placeholder: "priya@university.edu" },
    { id: "f3", label: "Collaboration Category", type: "select", options: "Joint Sponsored Research, Visiting Fellowship, Technology Licensing", required: true },
    { id: "f4", label: "Project Summary & Objectives", type: "textarea", required: true, placeholder: "Provide technical scope..." },
    { id: "f5", label: "Proposal PDF (Max 25MB)", type: "file", required: false, placeholder: "Upload document" },
  ]);

  const addField = (type: string) => {
    const id = `f-${Date.now()}`;
    const newField = {
      id,
      label: `New ${type.toUpperCase()} Field`,
      type,
      required: false,
      placeholder: `Enter ${type}...`,
      ...(type === "select" ? { options: "Option 1, Option 2, Option 3" } : {}),
    };
    setFormFields([...formFields, newField]);
    toast("Field Added to Canvas", `Configured new ${type} element.`, "info");
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter((f) => f.id !== id));
  };

  const handleUpdateStatus = (id: string, status: FormSubmission["status"]) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    toast("Submission Updated", `Applicant status transitioned to ${status}.`, "success");
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub({ ...selectedSub, status });
    }
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Forms & Enquiries Engine</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              3 Inbound New
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Build dynamic research intake forms, track grant applications, and manage industry collaborations.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[12px] flex-wrap gap-1">
          <button
            onClick={() => setTab("submissions")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === "submissions"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setTab("builder")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === "builder"
                ? "bg-white dark:bg-slate-700 text-[#0066cc] dark:text-sky-400 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Form Builder
          </button>
          <button
            onClick={() => setTab("service-desk")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === "service-desk"
                ? "bg-white dark:bg-slate-700 text-[#0066cc] dark:text-sky-400 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Service Desk ({tickets.length})
          </button>
        </div>
      </div>

      {tab === "service-desk" && (
        <div className="space-y-3">
          {tickets.map((tkt) => (
            <div
              key={tkt.id}
              className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0066cc]/40 transition-all"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2 py-0.5 rounded">
                    {tkt.ticketNumber}
                  </span>
                  <span
                    className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      tkt.priority === "Urgent"
                        ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        : tkt.priority === "High"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                    }`}
                  >
                    {tkt.priority}
                  </span>
                  <span className="text-[11.5px] text-slate-400">• {tkt.category}</span>
                  <span className="text-[11px] text-slate-400">• SLA Target: {tkt.slaTarget}</span>
                </div>

                <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white">
                  {tkt.title}
                </h3>
                <div className="text-[12px] text-slate-500 flex items-center gap-4 flex-wrap">
                  <span>Requester: <strong className="text-slate-700 dark:text-slate-300">{tkt.requesterName}</strong> ({tkt.requesterEmail})</span>
                  <span>Assigned: {tkt.assignedTo}</span>
                  <span>Created: {tkt.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <select
                  value={tkt.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    setTickets((prev) =>
                      prev.map((t) => (t.id === tkt.id ? { ...t, status: newStatus } : t))
                    );
                    toast("Ticket Status Updated", `${tkt.ticketNumber} changed to ${newStatus}.`, "success");
                  }}
                  className="h-[34px] px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "submissions" && (
        <div className="space-y-3">
          <div className="rounded-2xl ref-card overflow-hidden">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Applicant & Email</th>
                  <th className="py-3.5 px-3">Form Domain</th>
                  <th className="py-3.5 px-3">Organization</th>
                  <th className="py-3.5 px-3">Priority</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-[13px]">
                        {sub.applicantName}
                      </div>
                      <div className="text-[11.5px] text-slate-400">{sub.email}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/40 dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/40">
                        {sub.formType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                      {sub.organization}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold text-[11px] ${
                          sub.priority === "High"
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-slate-500"
                        }`}
                      >
                        {sub.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          sub.status === "New"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            : sub.status === "Under Review"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[11.5px] text-slate-400 font-mono">
                      {sub.submittedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSub(sub);
                        }}
                        className="btn-secondary h-[28px] px-2.5 text-[11.5px] text-[#0066cc] dark:text-sky-400 font-semibold"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "builder" && (
        /* Interactive Form Builder */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Builder Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 rounded-2xl ref-card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">
                  Form Structure Canvas
                </h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  Drag, order or remove intake fields for the active schema
                </p>
              </div>

              {/* Add Field Palette */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => addField("text")}
                  className="btn-secondary h-[30px] px-2.5 text-[12px]"
                >
                  + Text
                </button>
                <button
                  onClick={() => addField("select")}
                  className="btn-secondary h-[30px] px-2.5 text-[12px]"
                >
                  + Select
                </button>
                <button
                  onClick={() => addField("file")}
                  className="btn-secondary h-[30px] px-2.5 text-[12px]"
                >
                  + Upload
                </button>
              </div>
            </div>

            {/* Field Rows */}
            <div className="space-y-2.5">
              {formFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl ref-card flex items-start justify-between gap-4 group"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-500">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormFields(formFields.map((f) => f.id === field.id ? { ...f, label: val } : f));
                        }}
                        className="text-[13px] font-semibold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0066cc] focus:outline-none"
                      />
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
                        {field.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[12px]">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormFields(formFields.map((f) => f.id === field.id ? { ...f, placeholder: val } : f));
                          }}
                          className="w-full h-[32px] px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[12px] bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setFormFields(formFields.map((f) => f.id === field.id ? { ...f, required: val } : f));
                          }}
                          className="rounded text-[#0066cc] focus:ring-0"
                        />
                        <span className="text-[12px] text-slate-600 dark:text-slate-300">Required Field</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeField(field.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview Mode (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl ref-card space-y-4">
              <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] uppercase font-semibold text-[#0066cc] dark:text-sky-400">
                  Live Form Preview
                </span>
                <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mt-1">
                  Industry & Institutional Collaboration Portal
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Submit research proposals to the Centre for Intelligent Robotics.
                </p>
              </div>

              <div className="space-y-3">
                {formFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        placeholder={field.placeholder}
                        className="w-full p-2.5 text-[12px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : field.type === "select" ? (
                      <select className="w-full h-[35px] px-2.5 text-[12px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none">
                        <option>Select an option...</option>
                        {field.options?.split(",").map((opt) => (
                          <option key={opt.trim()}>{opt.trim()}</option>
                        ))}
                      </select>
                    ) : field.type === "file" ? (
                      <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-[12px] text-slate-400">
                        Drag & Drop or Click to attach file
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full h-[35px] px-2.5 text-[12px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => toast("Test Submission Sent", "Preview mode verified successfully.", "success")}
                  className="btn-primary w-full h-[36px] text-[12.5px] mt-2"
                >
                  Submit Form (Preview)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Drawer */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200/90 dark:border-slate-800 p-6 flex flex-col justify-between text-slate-900 dark:text-slate-100">
            <div className="space-y-5 overflow-y-auto flex-1">
              <div className="flex items-start justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0066cc] dark:text-sky-400">
                    {selectedSub.formType}
                  </span>
                  <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white mt-1">
                    {selectedSub.applicantName}
                  </h2>
                  <p className="text-[12px] text-slate-500">{selectedSub.organization}</p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-[12px]">
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-[#0066cc] dark:text-sky-400">{selectedSub.status}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex justify-between">
                  <span className="text-slate-500">Submitted Timestamp</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedSub.submittedAt}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex justify-between">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedSub.email}</span>
                </div>

                <div className="pt-2">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2 text-[12.5px]">
                    Submitted Questionnaire Responses:
                  </div>
                  <div className="space-y-2">
                    {Object.entries(selectedSub.data).map(([k, v]) => (
                      <div key={k} className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block">{k}</span>
                        <span className="text-slate-800 dark:text-slate-200">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => handleUpdateStatus(selectedSub.id, "Under Review")}
                className="btn-secondary h-[35px] flex-1 text-[12px]"
              >
                Mark Under Review
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedSub.id, "Approved")}
                className="btn-primary h-[35px] flex-1 text-[12px]"
              >
                Approve & Engage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
