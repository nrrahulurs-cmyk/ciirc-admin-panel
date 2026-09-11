"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Users,
  FolderGit2,
  BookOpen,
  Calendar,
  FileText,
  PlusCircle,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Layers,
} from "lucide-react";
import { ModuleId } from "@/types";
import { researchersList, projectsList, publicationsList, eventsList } from "@/data/mockData";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: ModuleId) => void;
  onOpenQuickCreate: (type?: string) => void;
  toggleTheme: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectModule,
  onOpenQuickCreate,
  toggleTheme,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search Results aggregation
  const filteredResearchers = researchersList
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.department.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const filteredProjects = projectsList
    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.code.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const filteredPubs = publicationsList
    .filter((pb) => pb.title.toLowerCase().includes(query.toLowerCase()) || pb.researchArea.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const filteredEvents = eventsList
    .filter((ev) => ev.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 2);

  // Grouped results
  const results = [
    // Quick Actions
    {
      group: "Quick Actions",
      items: [
        {
          id: "qa-res",
          title: "Create Researcher Profile",
          subtitle: "Add new faculty, scholar, or PI to directory",
          icon: Users,
          action: () => {
            onClose();
            onOpenQuickCreate("researcher");
          },
        },
        {
          id: "qa-proj",
          title: "Create Research Project",
          subtitle: "Initiate project, grant allocations and milestones",
          icon: FolderGit2,
          action: () => {
            onClose();
            onOpenQuickCreate("project");
          },
        },
        {
          id: "qa-pub",
          title: "Add Publication Record",
          subtitle: "Index new journal article, conference, or patent",
          icon: BookOpen,
          action: () => {
            onClose();
            onOpenQuickCreate("publication");
          },
        },
        {
          id: "qa-ev",
          title: "Schedule Event or Symposium",
          subtitle: "Create workshop, guest lecture, or conference",
          icon: Calendar,
          action: () => {
            onClose();
            onOpenQuickCreate("event");
          },
        },
      ],
    },
    // Navigation Modules
    {
      group: "Navigation Modules",
      items: [
        {
          id: "nav-dash",
          title: "Institution Dashboard",
          subtitle: "Real-time KPIs, attention stream, and analytics",
          icon: Layers,
          action: () => {
            onSelectModule("dashboard");
            onClose();
          },
        },
        {
          id: "nav-res",
          title: "Researchers & Faculty Directory",
          subtitle: "84 active researchers across 6 departments",
          icon: Users,
          action: () => {
            onSelectModule("researchers");
            onClose();
          },
        },
        {
          id: "nav-projects",
          title: "Research Projects & Grants",
          subtitle: "37 funded robotics & cybernetics projects",
          icon: FolderGit2,
          action: () => {
            onSelectModule("projects");
            onClose();
          },
        },
        {
          id: "nav-pubs",
          title: "Publications & Citations",
          subtitle: "214 peer-reviewed publications and patents",
          icon: BookOpen,
          action: () => {
            onSelectModule("publications");
            onClose();
          },
        },
        {
          id: "nav-workflow",
          title: "Approval Workflow Queue",
          subtitle: "4 pending content approvals and grant clearances",
          icon: Sparkles,
          action: () => {
            onSelectModule("workflow-approvals");
            onClose();
          },
        },
        {
          id: "nav-settings",
          title: "Security & System Settings",
          subtitle: "RBAC roles, audit logs, and institutional config",
          icon: Settings,
          action: () => {
            onSelectModule("system-settings");
            onClose();
          },
        },
      ],
    },
    // Matched Entities
    ...(filteredResearchers.length > 0
      ? [
          {
            group: "Researchers",
            items: filteredResearchers.map((r) => ({
              id: r.id,
              title: r.name,
              subtitle: `${r.title} • ${r.department}`,
              icon: Users,
              action: () => {
                onSelectModule("researchers");
                onClose();
              },
            })),
          },
        ]
      : []),
    ...(filteredProjects.length > 0
      ? [
          {
            group: "Projects",
            items: filteredProjects.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: `${p.code} • ${p.fundingAgency}`,
              icon: FolderGit2,
              action: () => {
                onSelectModule("projects");
                onClose();
              },
            })),
          },
        ]
      : []),
    ...(filteredPubs.length > 0
      ? [
          {
            group: "Publications",
            items: filteredPubs.map((pb) => ({
              id: pb.id,
              title: pb.title,
              subtitle: `${pb.journalOrConference} (${pb.year})`,
              icon: BookOpen,
              action: () => {
                onSelectModule("publications");
                onClose();
              },
            })),
          },
        ]
      : []),
  ];

  // Flatten for keyboard nav
  const flatItems = results.flatMap((g) => g.items);

  const handleKeyDownInBox = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === "Enter" && flatItems[selectedIndex]) {
      e.preventDefault();
      flatItems[selectedIndex].action();
    }
  };

  let currentIndexTracker = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden text-slate-900 dark:text-slate-100"
        onKeyDown={handleKeyDownInBox}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 h-[48px] border-b border-slate-200/80 dark:border-slate-800/80 gap-3">
          <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search researchers, projects, publications, events, commands..."
            className="w-full bg-transparent text-[13.5px] font-normal focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700/80">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[58vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {results.map((group) => {
            const items = group.items;
            if (items.length === 0) return null;

            return (
              <div key={group.group} className="py-2 first:pt-1 last:pb-1">
                <div className="px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.group}
                </div>
                <div className="mt-1 space-y-0.5">
                  {items.map((item) => {
                    const itemIndex = currentIndexTracker++;
                    const isSelected = itemIndex === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? "bg-[#edf2fe] text-[#0066cc] dark:bg-[#0066cc]/20 dark:text-[#38bdf8]"
                            : "hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-[#0066cc] text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-[13px] text-slate-900 dark:text-slate-100 truncate">
                              {item.title}
                            </div>
                            <div className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-[11.5px] text-[#0066cc] dark:text-[#38bdf8] shrink-0 font-semibold">
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↵
              </kbd>{" "}
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>
          <div className="text-[11px] font-semibold text-[#0066cc] dark:text-[#38bdf8]">
            CIIRC Research OS
          </div>
        </div>
      </div>
    </div>
  );
}
