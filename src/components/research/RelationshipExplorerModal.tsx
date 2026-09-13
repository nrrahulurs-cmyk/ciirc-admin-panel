"use client";

import React, { useState } from "react";
import {
  X,
  Share2,
  Users,
  FolderGit2,
  BookOpen,
  Award,
  Building,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  GitFork,
  Cpu,
  ShieldCheck,
  Search,
  Compass,
} from "lucide-react";
import {
  researchersList,
  projectsList,
  publicationsList,
  patentsList,
  researchDomainsList,
  facilitiesList,
  partnerOrgsList,
  startupsList,
} from "@/data/mockData";
import { useToast } from "../common/Toast";

interface RelationshipExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEntityId?: string;
  initialEntityType?: "researcher" | "project" | "domain" | "facility";
}

export function RelationshipExplorerModal({
  isOpen,
  onClose,
  initialEntityId = "res-02", // Dr. Arvind Sharma
  initialEntityType = "researcher",
}: RelationshipExplorerModalProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState(initialEntityType);
  const [selectedId, setSelectedId] = useState(initialEntityId);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Resolve current central entity
  let centralNode: {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    badge: string;
    icon: any;
    meta?: string;
  } = {
    id: "res-02",
    title: "Dr. Arvind Sharma",
    subtitle: "Associate Professor & Lead Scientist",
    category: "Researcher",
    badge: "Cybernetics & Autonomous Systems",
    icon: Users,
  };

  if (selectedType === "researcher") {
    const r = researchersList.find((x) => x.id === selectedId) || researchersList[1];
    centralNode = {
      id: r.id,
      title: r.name,
      subtitle: `${r.title} • ${r.department}`,
      category: "Researcher",
      badge: `${r.publicationsCount} Papers • ${r.patentsCount} Patents`,
      icon: Users,
      meta: r.biography.slice(0, 110) + "...",
    };
  } else if (selectedType === "project") {
    const p = projectsList.find((x) => x.id === selectedId) || projectsList[0];
    centralNode = {
      id: p.id,
      title: p.title,
      subtitle: `PI: ${p.pi} • Code: ${p.code}`,
      category: "Research Grant",
      badge: `₹${(p.fundingAmount / 10000000).toFixed(2)} Cr • ${p.status}`,
      icon: FolderGit2,
      meta: p.description,
    };
  } else if (selectedType === "domain") {
    const d = researchDomainsList.find((x) => x.id === selectedId) || researchDomainsList[0];
    centralNode = {
      id: d.id,
      title: d.name,
      subtitle: `${d.code} • ${d.focusAreas.join(" • ")}`,
      category: "Research Domain (Vista)",
      badge: `₹${(d.totalGrantsValue / 10000000).toFixed(1)} Cr Active Grants`,
      icon: Layers,
      meta: d.shortDesc,
    };
  } else if (selectedType === "facility") {
    const f = facilitiesList.find((x) => x.id === selectedId) || facilitiesList[0];
    centralNode = {
      id: f.id,
      title: f.name,
      subtitle: `Location: ${f.location} • Manager: ${f.manager}`,
      category: "Lab & Facility",
      badge: `${f.equipmentCount} High-End Instruments`,
      icon: Building,
      meta: f.description,
    };
  }

  // Linked satellite relationships based on central entity
  const linkedDomains = researchDomainsList.slice(0, 2);
  const linkedProjects = projectsList.slice(0, 3);
  const linkedPubs = publicationsList.slice(0, 4);
  const linkedPatents = patentsList.slice(0, 2);
  const linkedFacilities = facilitiesList.slice(0, 2);
  const linkedPartners = partnerOrgsList.slice(0, 2);
  const linkedStartups = startupsList.slice(0, 1);

  const handlePivot = (type: "researcher" | "project" | "domain" | "facility", id: string, name: string) => {
    setSelectedType(type);
    setSelectedId(id);
    toast("Pivoted Relationship Graph", `Now centered on "${name}"`, "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-slate-200/90 dark:border-slate-800/90 flex flex-col h-[88vh] overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0066cc]/10 text-[#0066cc] dark:text-sky-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold tracking-[-0.01em] text-slate-900 dark:text-white">
                  Institutional Relationship Explorer
                </h2>
                <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0066cc] dark:text-sky-300 border border-blue-500/20">
                  Interactive Knowledge Graph
                </span>
              </div>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">
                Visualizing multi-dimensional connections between faculty, grants, publications, patents, and labs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Quick Pivot Bar */}
        <div className="px-6 py-2.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium">Quick Pivot Centers:</span>
            <button
              onClick={() => handlePivot("researcher", "res-02", "Dr. Arvind Sharma")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0066cc]/10 text-slate-700 dark:text-slate-300 font-medium"
            >
              Dr. Arvind Sharma (PI)
            </button>
            <button
              onClick={() => handlePivot("researcher", "res-01", "Prof. Rajesh Mehta")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0066cc]/10 text-slate-700 dark:text-slate-300 font-medium"
            >
              Prof. Rajesh Mehta (Exoskeleton)
            </button>
            <button
              onClick={() => handlePivot("domain", "dom-01", "Autonomous Systems")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0066cc]/10 text-slate-700 dark:text-slate-300 font-medium"
            >
              VISTA-ROB (Domain)
            </button>
            <button
              onClick={() => handlePivot("project", "proj-02", "SUB-MAP Swarm")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0066cc]/10 text-slate-700 dark:text-slate-300 font-medium"
            >
              SUB-MAP Swarm Grant (DRDO)
            </button>
          </div>

          <span className="text-[11.5px] text-slate-400 font-medium hidden sm:inline-block">
            Click any linked node to re-center
          </span>
        </div>

        {/* Interactive Visual Graph Canvas */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between bg-radial-gradient">
          
          {/* Central Orbit Anchor Card */}
          <div className="max-w-xl mx-auto w-full my-2 text-center relative z-20">
            <div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-blue-500 via-[#0066cc] to-sky-400 shadow-xl">
              <div className="bg-white dark:bg-slate-900 rounded-[22px] p-5 px-8 shadow-inner border border-white/40 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-sky-300 border border-[#0066cc]/20">
                  {centralNode.category}
                </span>

                <h3 className="text-[21px] font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {centralNode.title}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {centralNode.subtitle}
                </p>

                {centralNode.meta && (
                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    "{centralNode.meta}"
                  </p>
                )}

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-[11.5px] font-semibold text-[#0066cc] dark:text-sky-400">
                    ● {centralNode.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Clusters (Grouped Relationships) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/70">
            
            {/* Cluster 1: Research Projects & Grants */}
            <div className="p-4 rounded-2xl ref-card space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#0066cc]" />
                  <span>Linked Grants ({linkedProjects.length})</span>
                </span>
                <span className="text-[10.5px] text-slate-400">Pivots Graph</span>
              </div>

              <div className="space-y-2">
                {linkedProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePivot("project", p.id, p.title)}
                    className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 hover:bg-[#edf2fe] dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#0055b3] dark:text-sky-300 font-semibold">{p.code}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{p.healthStatus}</span>
                    </div>
                    <h5 className="font-semibold text-[12px] text-slate-800 dark:text-slate-200 group-hover:text-[#0066cc] mt-0.5 line-clamp-1">
                      {p.title}
                    </h5>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Funding: ₹{(p.fundingAmount / 10000000).toFixed(2)} Cr • PI: {p.pi}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cluster 2: Publications & Patents */}
            <div className="p-4 rounded-2xl ref-card space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  <span>Scholarly Output</span>
                </span>
                <span className="text-[10.5px] text-slate-400">{linkedPubs.length} Papers • {linkedPatents.length} Patents</span>
              </div>

              <div className="space-y-2">
                {linkedPubs.slice(0, 2).map((pub) => (
                  <div
                    key={pub.id}
                    className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800"
                  >
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600">
                      {pub.journalOrConference.split("(")[0]}
                    </span>
                    <h5 className="font-semibold text-[12px] text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                      {pub.title}
                    </h5>
                    <div className="text-[11px] font-mono text-[#0066cc] dark:text-sky-400 mt-0.5">
                      DOI: {pub.doi}
                    </div>
                  </div>
                ))}

                {linkedPatents.map((pat) => (
                  <div
                    key={pat.id}
                    className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10.5px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        Patent: {pat.applicationNo}
                      </div>
                      <div className="font-semibold text-[12px] text-slate-800 dark:text-slate-200 line-clamp-1">
                        {pat.title}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      {pat.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cluster 3: Facilities, Partners & Startups */}
            <div className="p-4 rounded-2xl ref-card space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-500" />
                  <span>Infrastructure & Industry</span>
                </span>
                <span className="text-[10.5px] text-slate-400">Pivots Graph</span>
              </div>

              <div className="space-y-2">
                {linkedFacilities.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => handlePivot("facility", fac.id, fac.name)}
                    className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 hover:bg-[#edf2fe] dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer transition-all group"
                  >
                    <span className="text-[10.5px] font-semibold text-amber-600 dark:text-amber-400">
                      Lab Facility ({fac.equipmentCount} Instruments)
                    </span>
                    <h5 className="font-semibold text-[12px] text-slate-800 dark:text-slate-200 group-hover:text-[#0066cc] mt-0.5 line-clamp-1">
                      {fac.name}
                    </h5>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {fac.location} • Mgr: {fac.manager}
                    </div>
                  </div>
                ))}

                {linkedPartners.slice(0, 1).map((prt) => (
                  <div
                    key={prt.id}
                    className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800"
                  >
                    <span className="text-[10.5px] font-semibold text-[#0066cc] dark:text-sky-400">
                      Collaborative Partner ({prt.country})
                    </span>
                    <div className="font-semibold text-[12px] text-slate-800 dark:text-slate-200 mt-0.5">
                      {prt.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{prt.contactPerson}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Dynamic Graph Depth: Level 1-2 Direct Relationships • 32 Connected Vertices
          </span>
          <button
            onClick={() => {
              toast("Relationship Graph Exported", "Generated high-resolution SVG topology diagram.", "success");
            }}
            className="btn-secondary h-[34px] text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export Graph Snapshot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
