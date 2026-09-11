"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  FolderGit2,
  Globe,
  ExternalLink,
  Edit,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";
import { Researcher } from "@/types";
import { useToast } from "../common/Toast";

interface ResearcherDetailDrawerProps {
  researcher: Researcher | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResearcherDetailDrawer({
  researcher,
  isOpen,
  onClose,
}: ResearcherDetailDrawerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    | "biography"
    | "projects"
    | "publications"
    | "awards"
    | "collaborations"
    | "activity"
  >("biography");

  if (!isOpen || !researcher) return null;

  const handleExportProfile = () => {
    toast("Researcher Dossier Exported", `CV & portfolio for ${researcher.name} saved.`, "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200/90 dark:border-slate-800 flex flex-col text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-start gap-4">
            <img
              src={researcher.avatar}
              alt={researcher.name}
              className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] leading-6 font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                  {researcher.name}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                    researcher.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }`}
                >
                  {researcher.status}
                </span>
              </div>
              <p className="text-[12.5px] text-[#0066cc] dark:text-sky-400 font-medium mt-0.5">
                {researcher.title}
              </p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">
                {researcher.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportProfile}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Export Profile"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Contact Bar & Metrics */}
        <div className="px-6 py-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{researcher.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{researcher.phone}</span>
            </span>
          </div>

          {/* Academic Impact Metrics */}
          <div className="flex items-center gap-2.5">
            <div className="text-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-medium block">h-Index</span>
              <span className="font-bold text-[#0066cc] dark:text-sky-400 text-[13px]">{researcher.hIndex}</span>
            </div>
            <div className="text-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-medium block">Citations</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">{researcher.citations}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 px-6 gap-5 overflow-x-auto text-[12.5px] font-medium">
          {[
            { id: "biography", label: "Biography & Areas" },
            { id: "projects", label: `Projects (${researcher.projectsCount})` },
            { id: "publications", label: `Publications (${researcher.publicationsCount})` },
            { id: "awards", label: "Awards & Honors" },
            { id: "collaborations", label: "Collaborations" },
            { id: "activity", label: "Activity Log" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-[#0066cc] text-[#0066cc] dark:border-sky-400 dark:text-sky-400 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-[12.5px]">
          {activeTab === "biography" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Academic Background
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {researcher.biography}
                </p>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Core Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {researcher.researchAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 rounded-md text-[11.5px] font-medium bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/40 dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/40"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Institutional Location
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" />
                  <span>{researcher.office}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-3">
              <p className="text-slate-500 dark:text-slate-400">
                Active grant projects supervised as Principal Investigator:
              </p>
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    CIIRC Subterranean Autonomous Swarms
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  DRDO Sponsored multi-agent decentralized exploration in degraded tunnels.
                </p>
                <div className="text-[11.5px] font-medium text-[#0066cc] dark:text-sky-400">
                  Grant Budget: ₹4.20 Crore • Progress: 72%
                </div>
              </div>
            </div>
          )}

          {activeTab === "publications" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Decentralized Cooperative SLAM in Feature-Depleted Subterranean Enclosures
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  IEEE Transactions on Robotics (T-RO), 2026
                </div>
                <div className="text-[11.5px] text-[#0066cc] dark:text-sky-400 font-mono">
                  DOI: 10.1109/TRO.2026.3389012 (Citations: 28)
                </div>
              </div>
            </div>
          )}

          {activeTab === "awards" && (
            <div className="space-y-2.5">
              {researcher.awards.length > 0 ? (
                researcher.awards.map((award, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                  >
                    <Award className="w-4 h-4 text-amber-500 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {award.title} ({award.year})
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">{award.issuer}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 italic">No recorded awards in current profile cycle.</div>
              )}
            </div>
          )}

          {activeTab === "collaborations" && (
            <div className="space-y-2.5">
              {researcher.collaborations.length > 0 ? (
                researcher.collaborations.map((col, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {col.institution}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">{col.project}</div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                      {col.country}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 italic">No external institutional MOUs linked yet.</div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-3">
              {researcher.recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-[12.5px]">
                  <div className="w-2 h-2 rounded-full bg-[#0066cc] mt-1.5" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {act.action}: {act.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{act.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex justify-between items-center">
          <span className="text-[11.5px] text-slate-400">
            Last verified: {researcher.lastUpdated}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast("Researcher Profile Updated", "Changes committed to directory database.", "success");
                onClose();
              }}
              className="btn-primary h-[35px] px-4 text-[12.5px]"
            >
              Update Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
