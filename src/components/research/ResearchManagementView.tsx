"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Layers,
  FolderGit2,
  BookOpen,
  Award,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  FileCheck,
  Shield,
  Eye,
  ShieldCheck,
  Briefcase,
  Medal,
} from "lucide-react";
import {
  Researcher,
  ResearchDomain,
  Project,
  Publication,
  Patent,
  ProductTechnology,
  IPRRecord,
  TechnologyTransfer,
  InstitutionalAward,
} from "@/types";
import {
  researchersList,
  researchDomainsList,
  projectsList,
  publicationsList,
  patentsList,
  productsTechnologyList,
  iprRecordsList,
  technologyTransferList,
  institutionalAwardsList,
} from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ResearcherDetailDrawer } from "./ResearcherDetailDrawer";
import { ProjectDetailDrawer } from "./ProjectDetailDrawer";
import { PublicationImportModal } from "./PublicationImportModal";
import { RelationshipExplorerModal } from "./RelationshipExplorerModal";
import { useToast } from "../common/Toast";

interface ResearchManagementViewProps {
  initialTab?: "researchers" | "domains" | "projects" | "publications" | "patents" | "ipr" | "tech-transfer" | "awards";
  onOpenQuickCreate: (type?: string) => void;
}

export function ResearchManagementView({
  initialTab = "researchers",
  onOpenQuickCreate,
}: ResearchManagementViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"researchers" | "domains" | "projects" | "publications" | "patents" | "ipr" | "tech-transfer" | "awards">(initialTab);

  // States
  const [researchers, setResearchers] = useState<Researcher[]>(researchersList);
  const [domains, setDomains] = useState<ResearchDomain[]>(researchDomainsList);
  const [projects, setProjects] = useState<Project[]>(projectsList);
  const [publications, setPublications] = useState<Publication[]>(publicationsList);
  const [patents, setPatents] = useState<Patent[]>(patentsList);
  const [technologies, setTechnologies] = useState<ProductTechnology[]>(productsTechnologyList);
  const [iprRecords, setIprRecords] = useState<IPRRecord[]>(iprRecordsList);
  const [techTransfers, setTechTransfers] = useState<TechnologyTransfer[]>(technologyTransferList);
  const [awards, setAwards] = useState<InstitutionalAward[]>(institutionalAwardsList);

  // Drawers & Modals
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [relationshipTargetId, setRelationshipTargetId] = useState("res-02");
  const [relationshipTargetType, setRelationshipTargetType] = useState<"researcher" | "project" | "domain">("researcher");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Summary Metrics
  const totalFunding = useMemo(() => projects.reduce((acc, p) => acc + p.fundingAmount, 0), [projects]);
  const totalUtilized = useMemo(() => projects.reduce((acc, p) => acc + (p.utilizedAmount ?? 0), 0), [projects]);

  // Tab 1: Filtered Researchers
  const filteredResearchers = useMemo(() => {
    return researchers.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.researchAreas.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [researchers, searchQuery, statusFilter]);

  // Tab 3: Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter || p.healthStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Tab 4: Filtered Publications
  const filteredPublications = useMemo(() => {
    return publications.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.journalOrConference.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [publications, searchQuery]);

  // Tab 5: Filtered Patents
  const filteredPatents = useMemo(() => {
    return patents.filter((pat) => {
      const matchSearch =
        pat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.inventors.some((inv) => inv.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [patents, searchQuery]);

  const handleOpenExplorer = (type: "researcher" | "project" | "domain", id: string) => {
    setRelationshipTargetType(type);
    setRelationshipTargetId(id);
    setIsRelationshipModalOpen(true);
  };

  const handleExportBibTeX = () => {
    const bibtex = publications
      .map(
        (p) =>
          `@article{ciirc_${p.id},\n  title={${p.title}},\n  author={${p.authors.join(" and ")}},\n  journal={${p.journalOrConference}},\n  year={${p.year}},\n  doi={${p.doi}}\n}`
      )
      .join("\n\n");

    const blob = new Blob([bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ciirc_publications_catalog.bib";
    a.click();
    toast("BibTeX Export Generated", `Exported ${publications.length} scholarly citations.`, "success");
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Pillar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Research & Academic Innovations</span>
            <span className="text-[11.5px] font-medium px-2.5 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              Institutional Core
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Authoritative registry of CIIRC research domains, sponsored grants, publications, patents, and faculty investigators.
          </p>
        </div>

        {/* Global Pillar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRelationshipModalOpen(true)}
            className="btn-secondary h-[35px] text-xs flex items-center gap-1.5"
            title="Open Interactive Knowledge Graph"
          >
            <Compass className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" />
            <span>Relationship Explorer</span>
          </button>

          <button
            onClick={() => onOpenQuickCreate("project")}
            className="btn-primary h-[35px] text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>New Grant / Project</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Total Active Research Grants
          </span>
          <div className="text-[24px] font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalFunding)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>37 Extramural Grants Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Research Domains (Vistas)
          </span>
          <div className="text-[24px] font-bold text-[#0066cc] dark:text-sky-400 mt-1">
            5 Core Vistas
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Autonomous Systems, Bio, AI, CPS, Materials
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Scholarly Citations & Papers
          </span>
          <div className="text-[24px] font-bold text-slate-900 dark:text-white mt-1">
            214 Indexed
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Scopus, IEEE Xplore, Web of Science
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Patents & Tech Transfer
          </span>
          <div className="text-[24px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            28 Filings
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            12 Granted • 4 TRL 7+ Commercialized
          </div>
        </div>
      </div>

      {/* Sub-Pillar Navigation Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-1 gap-4 overflow-x-auto text-[13px]">
        <div className="flex items-center gap-2">
          {[
            { id: "researchers", label: `Researchers (${researchers.length})`, icon: Users },
            { id: "domains", label: `Domains & Vistas (${domains.length})`, icon: Layers },
            { id: "projects", label: `Grants & Projects (${projects.length})`, icon: FolderGit2 },
            { id: "publications", label: `Publications (${publications.length})`, icon: BookOpen },
            { id: "patents", label: `Patents (${patents.length})`, icon: Award },
            { id: "ipr", label: `IPR Queue (${iprRecords.length})`, icon: ShieldCheck },
            { id: "tech-transfer", label: `Tech Transfer (${techTransfers.length})`, icon: Briefcase },
            { id: "awards", label: `Honors & Awards (${awards.length})`, icon: Medal },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#0066cc] dark:text-sky-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab-Specific Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab === "publications" && (
            <>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="btn-secondary h-[32px] text-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import BibTeX/RIS</span>
              </button>
              <button
                onClick={handleExportBibTeX}
                className="btn-secondary h-[32px] text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export BibTeX</span>
              </button>
            </>
          )}

          {activeTab === "researchers" && (
            <button
              onClick={() => onOpenQuickCreate("researcher")}
              className="btn-secondary h-[32px] text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Faculty</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl ref-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab} by name, keyword, or identifier...`}
            className="w-full h-[36px] pl-9 pr-4 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
          />
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "projects" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[36px] px-3 text-[12px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Health & Statuses</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Delayed">Delayed</option>
              <option value="Active">Active</option>
              <option value="In Review">In Review</option>
            </select>
          )}

          {activeTab === "researchers" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[36px] px-3 text-[12px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Faculty</option>
              <option value="Incomplete">Incomplete Profiles</option>
              <option value="On Leave">On Leave</option>
              <option value="Emeritus">Emeritus</option>
            </select>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: RESEARCHERS DIRECTORY */}
      {/* ========================================== */}
      {activeTab === "researchers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredResearchers.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl ref-card flex flex-col justify-between hover:border-[#0066cc]/50 transition-all group"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        onClick={() => setSelectedResearcher(r)}
                        className="font-bold text-[14.5px] text-slate-900 dark:text-white group-hover:text-[#0066cc] cursor-pointer truncate"
                      >
                        {r.name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                          r.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="text-[12px] text-[#0066cc] dark:text-sky-400 font-medium">
                      {r.title}
                    </div>
                    <div className="text-[11.5px] text-slate-400 truncate mt-0.5">
                      {r.department}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {r.researchAreas.slice(0, 3).map((area) => (
                    <span
                      key={area}
                      className="px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11.5px]">
                  <span><strong>{r.publicationsCount}</strong> papers</span>
                  <span><strong>{r.projectsCount}</strong> grants</span>
                  <span>h-index: <strong className="text-[#0066cc]">{r.hIndex}</strong></span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenExplorer("researcher", r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0066cc] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    title="View in Relationship Explorer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedResearcher(r)}
                    className="text-[12px] font-semibold text-[#0066cc] dark:text-sky-400 hover:underline"
                  >
                    Dossier →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: RESEARCH DOMAINS (VISTAS) */}
      {/* ========================================== */}
      {activeTab === "domains" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domains.map((dom) => (
            <div
              key={dom.id}
              className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-4 hover:border-[#0066cc]/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                        {dom.code}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {dom.status}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mt-1.5">
                      {dom.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleOpenExplorer("domain", dom.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0066cc]/10 text-slate-500 hover:text-[#0066cc] transition-colors"
                    title="Explore Domain Relationships"
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {dom.detailedDesc}
                </p>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Core Specialization Focus Areas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dom.focusAreas.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-[#0055b3] dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-500">
                  <span>Grants: <strong className="text-slate-900 dark:text-white">₹{(dom.totalGrantsValue / 10000000).toFixed(1)} Cr</strong></span>
                  <span>Projects: <strong className="text-slate-900 dark:text-white">{dom.activeProjectsCount}</strong></span>
                  <span>Papers: <strong className="text-slate-900 dark:text-white">{dom.publicationsCount}</strong></span>
                </div>

                <span className="text-[11px] text-emerald-600 font-semibold">
                  ✓ Public on ciirc.edu.in
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: GRANTS & PROJECTS */}
      {/* ========================================== */}
      {activeTab === "projects" && (
        <div className="space-y-3">
          {filteredProjects.map((p) => {
            const utilized = p.utilizedAmount ?? Math.round(p.fundingAmount * 0.65);
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="p-5 rounded-2xl ref-card cursor-pointer hover:border-[#0066cc]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                      {p.code}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        p.healthStatus === "On Track"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : p.healthStatus === "At Risk"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      }`}
                    >
                      ● {p.healthStatus || "On Track"}
                    </span>
                    <span className="text-[11.5px] text-slate-400">• {p.department}</span>
                  </div>

                  <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white leading-snug">
                    {p.title}
                  </h3>

                  <div className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-4 flex-wrap pt-0.5">
                    <span>PI: <strong className="text-slate-700 dark:text-slate-300">{p.pi}</strong></span>
                    <span>Grant: <strong className="text-[#0066cc] dark:text-sky-400">{formatCurrency(p.fundingAmount)}</strong></span>
                    <span>Utilized: {formatCurrency(utilized)}</span>
                    <span>Duration: {p.startDate.slice(0, 4)} - {p.endDate.slice(0, 4)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="w-32 text-right">
                    <div className="text-[11.5px] text-slate-400 font-medium">Progress</div>
                    <div className="text-[16px] font-bold text-slate-900 dark:text-white">{p.progress}%</div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                      <div className="h-full bg-[#0066cc]" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenExplorer("project", p.id);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0066cc]/10 text-slate-500 hover:text-[#0066cc] transition-colors"
                    title="Explore Project Relationships"
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: PUBLICATIONS & SCHOLARLY CITATIONS */}
      {/* ========================================== */}
      {activeTab === "publications" && (
        <div className="space-y-3">
          {filteredPublications.map((pub) => (
            <div
              key={pub.id}
              className="p-5 rounded-2xl ref-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-[#0066cc] dark:text-sky-300">
                    {pub.publicationType}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {pub.journalOrConference} ({pub.year})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    Scopus Indexed
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      pub.iprClearanceStatus === "Pending IPR Review"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {pub.iprClearanceStatus === "Pending IPR Review" ? "● Pending IPR Review" : "✓ IPR Cleared"}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
                  {pub.title}
                </h3>

                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Authors: <strong className="text-slate-700 dark:text-slate-300">{pub.authors.join(", ")}</strong>
                </p>

                <div className="text-[11.5px] font-mono text-[#0066cc] dark:text-sky-400 pt-0.5 flex items-center gap-2">
                  <span>DOI: {pub.doi}</span>
                  <span className="text-slate-400">• Citations: {pub.citations}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary h-[33px] text-xs flex items-center gap-1.5"
                >
                  <span>CrossRef</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: PATENTS & INTELLECTUAL PROPERTY */}
      {/* ========================================== */}
      {activeTab === "patents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatents.map((pat) => (
              <div
                key={pat.id}
                className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {pat.applicationNo}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      {pat.status}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                    {pat.title}
                  </h3>

                  <div className="text-[12px] text-slate-500 mt-1">
                    Inventors: <strong className="text-slate-700 dark:text-slate-300">{pat.inventors.join(", ")}</strong>
                  </div>
                  <div className="text-[11.5px] text-slate-400 mt-0.5">
                    Jurisdiction: {pat.jurisdiction} • Filed: {pat.filingDate}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold">
                    Commercial Status: {pat.commercialStatus}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">TRL {pat.trl || 7}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: IPR DISCLOSURE & GOVERNANCE QUEUE */}
      {/* ========================================== */}
      {activeTab === "ipr" && (
        <div className="space-y-3">
          {iprRecords.map((ipr) => (
            <div
              key={ipr.id}
              className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition-all"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/40">
                    {ipr.disclosureNumber}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    {ipr.iprType}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      ipr.reviewStatus === "Recommended for Filing"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : ipr.reviewStatus === "Publication Cleared"
                        ? "bg-blue-500/10 text-[#0066cc] border-blue-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    ● {ipr.reviewStatus}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Potential: <strong className="text-slate-600 dark:text-slate-300">{ipr.patentPotential}</strong>
                  </span>
                </div>

                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                  {ipr.title}
                </h3>

                <div className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-4 flex-wrap">
                  <span>Lead: <strong className="text-slate-700 dark:text-slate-300">{ipr.leadResearcher}</strong></span>
                  <span>Inventors: {ipr.inventors.join(", ")}</span>
                  <span>Domain: {ipr.technologyDomain}</span>
                  <span>Disclosed: {ipr.disclosureDate}</span>
                </div>

                {ipr.reviewerComments && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-[12px] text-slate-600 dark:text-slate-300 mt-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Reviewer Decision: {ipr.reviewerDecision} ({ipr.reviewerName})
                    </span>
                    {ipr.reviewerComments}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIprRecords((prev) =>
                      prev.map((item) =>
                        item.id === ipr.id
                          ? { ...item, reviewStatus: "Recommended for Filing", reviewerDecision: "Clear for Filing" }
                          : item
                      )
                    );
                    toast("IPR Cleared for Patent Filing", `"${ipr.title}" approved for provisional specification preparation.`, "success");
                  }}
                  className="btn-primary h-[34px] text-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Recommend Filing</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 7: TECHNOLOGY TRANSFER & COMMERCIALIZATION */}
      {/* ========================================== */}
      {activeTab === "tech-transfer" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techTransfers.map((tt) => (
              <div
                key={tt.id}
                className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {tt.code}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#0066cc] dark:text-sky-300">
                      TRL {tt.trl} ({tt.pipelineStage})
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                    {tt.title}
                  </h3>

                  <p className="text-[12px] text-slate-600 dark:text-slate-400">
                    Prototype Status: <strong className="text-slate-700 dark:text-slate-300">{tt.prototypeStatus}</strong>
                  </p>

                  <div className="text-[12px] text-slate-500 space-y-0.5">
                    <div>Lead Scientist: <strong className="text-slate-700 dark:text-slate-300">{tt.leadResearcher}</strong></div>
                    <div>Commercial Partner: <strong className="text-[#0066cc] dark:text-sky-400">{tt.commercialPartner || "Under Negotiation"}</strong></div>
                    <div>Licensing Status: <span className="font-semibold text-emerald-600">{tt.licensingStatus}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Realized Revenue: <strong className="text-slate-900 dark:text-white">₹{((tt.revenueINR || 0) / 100000).toFixed(1)} Lakhs</strong>
                  </span>
                  <button
                    onClick={() => {
                      toast("Tech Transfer Dossier Dispatched", `Licensing agreement brief generated for ${tt.title}.`, "success");
                    }}
                    className="btn-secondary h-[30px] text-[11px]"
                  >
                    View Term Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 8: INSTITUTIONAL & FACULTY HONORS */}
      {/* ========================================== */}
      {activeTab === "awards" && (
        <div className="space-y-3">
          {awards.map((awd) => (
            <div
              key={awd.id}
              className="p-5 rounded-2xl ref-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                    Year {awd.year}
                  </span>
                  <span className="text-[11px] font-semibold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded">
                    {awd.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    • Level: {awd.level}
                  </span>
                </div>

                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {awd.title}
                </h3>

                <p className="text-[12px] text-slate-600 dark:text-slate-400">
                  Recipient: <strong className="text-slate-800 dark:text-slate-200">{awd.recipientName}</strong> • Conferring Institution: {awd.institution}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => {
                    toast("Award Citation Downloaded", `Official citation for "${awd.title}" retrieved.`, "info");
                  }}
                  className="btn-secondary h-[32px] text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Citation Document</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals & Drawers */}
      <ResearcherDetailDrawer
        researcher={selectedResearcher}
        isOpen={!!selectedResearcher}
        onClose={() => setSelectedResearcher(null)}
      />

      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpdateProject={(updated) => {
          setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setSelectedProject(updated);
        }}
      />

      <PublicationImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={(newPubs) => {
          setPublications((prev) => [...newPubs, ...prev]);
        }}
      />

      <RelationshipExplorerModal
        isOpen={isRelationshipModalOpen}
        onClose={() => setIsRelationshipModalOpen(false)}
        initialEntityId={relationshipTargetId}
        initialEntityType={relationshipTargetType}
      />
    </div>
  );
}
