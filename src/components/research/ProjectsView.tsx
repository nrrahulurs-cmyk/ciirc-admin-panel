"use client";

import React, { useState } from "react";
import {
  FolderGit2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";
import { Project } from "@/types";
import { projectsList } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "../common/Toast";

interface ProjectsViewProps {
  onOpenQuickCreate: (type?: string) => void;
}

export function ProjectsView({ onOpenQuickCreate }: ProjectsViewProps) {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(projectsList);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.pi.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalFunding = projects.reduce((acc, p) => acc + p.fundingAmount, 0);

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Research Projects & Grants</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              37 active grants
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Tracking CIIRC sponsored research, milestone deliverables and funded robotics consortia.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickCreate("project")}
          className="btn-primary h-[35px]"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
          <span>New Research Grant</span>
        </button>
      </div>

      {/* Grant Funding Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Total Active Research Grants
          </span>
          <div className="text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalFunding)}
          </div>
          <div className="text-[11.5px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.6% vs previous fiscal cycle</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Avg Milestone Completion
          </span>
          <div className="text-[26px] font-bold tracking-[-0.025em] text-[#0066cc] dark:text-sky-400 mt-1">
            68.4%
          </div>
          <div className="text-[11.5px] text-slate-400 mt-1">
            18 critical deliverable evaluations scheduled this quarter
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Linked Institutional Papers
          </span>
          <div className="text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white mt-1">
            48 Articles
          </div>
          <div className="text-[11.5px] text-slate-400 mt-1">
            Indexed in IEEE, Science Robotics & ACM
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl ref-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, code, or PI..."
            className="w-full h-[35px] pl-8 pr-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Review">In Review</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl ref-card flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                  {proj.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                    proj.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : proj.status === "In Review"
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }`}
                >
                  {proj.status}
                </span>
                <span className="text-[11.5px] text-slate-400">• {proj.department}</span>
              </div>

              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                {proj.title}
              </h3>

              <p className="text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                {proj.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-600 dark:text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
                  <span>PI: <strong className="font-semibold text-slate-900 dark:text-white">{proj.pi}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.85} />
                  <span>{proj.fundingAgency}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.85} />
                  <span>{formatDate(proj.startDate)} → {formatDate(proj.endDate)}</span>
                </span>
              </div>
            </div>

            {/* Right progress & Funding block */}
            <div className="lg:w-72 shrink-0 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                  Grant Allocation
                </span>
                <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                  {formatCurrency(proj.fundingAmount)}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px] mb-1">
                  <span className="text-slate-500">Milestone Progress</span>
                  <span className="font-semibold text-[#0066cc] dark:text-sky-400">
                    {proj.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0066cc]"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11.5px]">
                <span className="text-slate-500">{proj.publicationsCount} linked papers</span>
                <button
                  onClick={() => {
                    toast("Project Portfolio Opened", `Viewing full dossiers for ${proj.code}`, "info");
                  }}
                  className="font-medium text-[#0066cc] dark:text-sky-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Dossier</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
