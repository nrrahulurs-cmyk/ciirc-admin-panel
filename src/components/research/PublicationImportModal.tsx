"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight,
  Database,
} from "lucide-react";
import { Publication } from "@/types";
import { publicationsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

interface PublicationImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (newPubs: Publication[]) => void;
}

export function PublicationImportModal({
  isOpen,
  onClose,
  onImportComplete,
}: PublicationImportModalProps) {
  const { toast } = useToast();
  const [importFormat, setImportFormat] = useState<"bibtex" | "csv" | "ris">("bibtex");
  const [inputText, setInputText] = useState(
`@article{sharma2026swarm,
  title = {Cooperative Micro-UAV Mesh Routing in GPS-Denied Tunnels},
  author = {Sharma, Arvind and Rao, Sunita and Karthik, K. V.},
  journal = {IEEE Robotics and Automation Letters (RA-L)},
  year = {2026},
  volume = {11},
  pages = {1420--1428},
  doi = {10.1109/LRA.2026.349011}
}

@article{mehta2026exoskeleton,
  title = {Decentralized Cooperative SLAM in Feature-Depleted Subterranean Enclosures},
  author = {Sharma, Arvind and Rao, Sunita},
  journal = {IEEE Transactions on Robotics (T-RO)},
  year = {2026},
  doi = {10.1109/TRO.2026.3389012}
}`
  );

  const [step, setStep] = useState<"input" | "preview">("input");
  const [parsedItems, setParsedItems] = useState<Array<{
    title: string;
    authors: string[];
    journal: string;
    year: number;
    doi: string;
    isDuplicate: boolean;
    duplicateReason?: string;
    selected: boolean;
  }>>([]);

  if (!isOpen) return null;

  const handleParse = () => {
    // Basic parser simulation checking against publicationsList
    const rawEntries = inputText.split("@article").filter(Boolean);
    const parsed = rawEntries.map((entry, idx) => {
      const titleMatch = entry.match(/title\s*=\s*[{"]([^}"]+)[}"]/i);
      const authorMatch = entry.match(/author\s*=\s*[{"]([^}"]+)[}"]/i);
      const journalMatch = entry.match(/journal\s*=\s*[{"]([^}"]+)[}"]/i);
      const yearMatch = entry.match(/year\s*=\s*[{"]?(\d{4})[}"]?/i);
      const doiMatch = entry.match(/doi\s*=\s*[{"]([^}"]+)[}"]/i);

      const title = titleMatch ? titleMatch[1].trim() : `Imported Publication #${idx + 1}`;
      const authors = authorMatch ? authorMatch[1].split(" and ").map((a) => a.trim()) : ["CIIRC Researcher"];
      const journal = journalMatch ? journalMatch[1].trim() : "Peer-Reviewed Proceedings";
      const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;
      const doi = doiMatch ? doiMatch[1].trim() : `10.1109/CIIRC.2026.${idx + 100}`;

      // Duplicate detection against current publicationsList
      const existingMatch = publicationsList.find(
        (p) =>
          p.doi.toLowerCase() === doi.toLowerCase() ||
          p.title.toLowerCase().includes(title.toLowerCase().slice(0, 25))
      );

      return {
        title,
        authors,
        journal,
        year,
        doi,
        isDuplicate: !!existingMatch,
        duplicateReason: existingMatch ? `Matches existing paper: "${existingMatch.title.slice(0, 35)}..."` : undefined,
        selected: !existingMatch, // preselect only non-duplicates
      };
    });

    setParsedItems(parsed);
    setStep("preview");
    toast("Parsing Complete", `Detected ${parsed.length} entries. ${parsed.filter(p => p.isDuplicate).length} duplicates flagged.`, "info");
  };

  const handleConfirmImport = () => {
    const selectedToImport = parsedItems.filter((p) => p.selected);
    const newPubs: Publication[] = selectedToImport.map((item, idx) => ({
      id: `pub-imp-${Date.now()}-${idx}`,
      title: item.title,
      authors: item.authors,
      researchArea: "Cybernetics & Autonomous Systems",
      publicationType: "Journal",
      journalOrConference: item.journal,
      year: item.year,
      status: "Published",
      doi: item.doi,
      citations: 0,
      documents: ["FullText_Preprint.pdf"],
      abstract: "Peer-reviewed scientific manuscript imported into institutional repository.",
      indexing: ["Scopus", "IEEE Xplore"],
      verified: true,
      publicVisibility: true,
    }));

    onImportComplete(newPubs);
    toast("Publications Imported", `Successfully added ${newPubs.length} verified publications to CIIRC catalog.`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#0066cc] dark:text-sky-400" />
              <span>Import Publications Catalog</span>
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Automated parser with DOI matching and duplicate collision detection.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-[12.5px]">
          {step === "input" ? (
            <div className="space-y-4">
              {/* Format Switcher */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit text-xs">
                {(["bibtex", "csv", "ris"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setImportFormat(fmt)}
                    className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                      importFormat === fmt
                        ? "bg-white dark:bg-slate-700 text-[#0066cc] dark:text-sky-300 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Paste Citation Source Text:
                </label>
                <textarea
                  rows={10}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-3 font-mono text-[12px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200 leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-[12px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0066cc] dark:text-sky-400 shrink-0" />
                <span>Parser will automatically query cross-references and detect duplicates against CIIRC's 214 indexed records.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Parsed Publications Review:
                </span>
                <span className="text-slate-500">
                  {parsedItems.filter(p => p.selected).length} selected for import
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
                {parsedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.isDuplicate
                        ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/40"
                        : "bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => {
                          const next = [...parsedItems];
                          next[idx].selected = !next[idx].selected;
                          setParsedItems(next);
                        }}
                        className="mt-1 rounded text-[#0066cc] focus:ring-[#0066cc]"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.isDuplicate ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Duplicate Detected
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Ready for Index
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-400">DOI: {item.doi}</span>
                        </div>

                        <h4 className="font-semibold text-slate-900 dark:text-white mt-1 text-[13px]">
                          {item.title}
                        </h4>
                        <div className="text-slate-500 text-[11.5px] mt-0.5">
                          {item.authors.join(", ")} • <span className="font-medium text-slate-700 dark:text-slate-300">{item.journal}</span> ({item.year})
                        </div>

                        {item.duplicateReason && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                            ⚠️ {item.duplicateReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between">
          {step === "preview" ? (
            <button
              onClick={() => setStep("input")}
              className="btn-secondary h-[34px] text-xs"
            >
              ← Edit Raw Text
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary h-[34px] text-xs">
              Cancel
            </button>
            {step === "input" ? (
              <button
                onClick={handleParse}
                className="btn-primary h-[34px] text-xs"
              >
                <span>Parse & Detect Duplicates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmImport}
                disabled={parsedItems.filter(p => p.selected).length === 0}
                className="btn-primary h-[34px] text-xs disabled:opacity-50"
              >
                <span>Import {parsedItems.filter(p => p.selected).length} Records</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
