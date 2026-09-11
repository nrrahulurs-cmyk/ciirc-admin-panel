"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Download,
  ExternalLink,
  Award,
  Filter,
  FileCheck,
  CheckCircle2,
  Clock,
  Share2,
} from "lucide-react";
import { Publication } from "@/types";
import { publicationsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

interface PublicationsViewProps {
  onOpenQuickCreate: (type?: string) => void;
}

export function PublicationsView({ onOpenQuickCreate }: PublicationsViewProps) {
  const { toast } = useToast();
  const [publications, setPublications] = useState<Publication[]>(publicationsList);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = publications.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
      p.journalOrConference.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || p.publicationType === typeFilter;
    return matchesSearch && matchesType;
  });

  const exportBibTeX = () => {
    const bibtex = filtered
      .map(
        (p) =>
          `@article{ciirc_${p.id},\n  title={${p.title}},\n  author={${p.authors.join(" and ")}},\n  journal={${p.journalOrConference}},\n  year={${p.year}},\n  doi={${p.doi}}\n}`
      )
      .join("\n\n");

    const blob = new Blob([bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ciirc_publications.bib";
    a.click();
    toast("BibTeX Export Ready", "Generated citations file for institutional catalog.", "success");
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Publications & Academic Citations</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              214 indexed papers
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Peer-reviewed scientific journals, IEEE conference proceedings, and patented cybernetic designs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportBibTeX}
            className="btn-secondary h-[35px]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.85} />
            <span>Export BibTeX</span>
          </button>
          <button
            onClick={() => onOpenQuickCreate("publication")}
            className="btn-primary h-[35px]"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>Index Publication</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl ref-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by publication title, authors, or journal..."
            className="w-full h-[35px] pl-8 pr-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Journal">Journal Articles</option>
            <option value="Conference">Conference Papers</option>
          </select>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-3">
        {filtered.map((pub) => (
          <div
            key={pub.id}
            className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/40 dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/40">
                  {pub.publicationType}
                </span>
                <span className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-300">
                  {pub.journalOrConference} ({pub.year})
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                    pub.status === "Published"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }`}
                >
                  {pub.status}
                </span>
              </div>

              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                {pub.title}
              </h3>

              <div className="text-[12px] text-slate-500 dark:text-slate-400">
                Authors: <span className="text-slate-700 dark:text-slate-300 font-medium">{pub.authors.join(", ")}</span>
              </div>

              <p className="text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                {pub.abstract}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11.5px] text-slate-400 font-mono pt-1">
                <span>DOI: {pub.doi}</span>
                <span className="text-[#0066cc] dark:text-sky-400 font-semibold font-sans">
                  {pub.citations} Citations
                </span>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
              <button
                onClick={() => {
                  toast("Accessing Full Paper PDF", `Downloading institutional copy: ${pub.documents[0]}`, "info");
                }}
                className="btn-secondary h-[32px] px-3 text-[12px]"
              >
                <span>Full Text PDF</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(pub.doi);
                  toast("DOI Copied", pub.doi, "success");
                }}
                className="btn-secondary h-[32px] px-3 text-[12px] text-[#0066cc] dark:text-sky-400 font-semibold"
              >
                Copy DOI
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
