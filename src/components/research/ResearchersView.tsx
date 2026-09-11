"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  Eye,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  Columns,
  Sparkles,
} from "lucide-react";
import { Researcher } from "@/types";
import { researchersList } from "@/data/mockData";
import { ResearcherDetailDrawer } from "./ResearcherDetailDrawer";
import { useToast } from "../common/Toast";

interface ResearchersViewProps {
  onOpenQuickCreate: (type?: string) => void;
}

export function ResearchersView({ onOpenQuickCreate }: ResearchersViewProps) {
  const { toast } = useToast();
  const [researchers, setResearchers] = useState<Researcher[]>(researchersList);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "citations" | "publications" | "lastUpdated">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);

  // Column visibility states
  const [visibleColumns, setVisibleColumns] = useState({
    role: true,
    department: true,
    researchAreas: true,
    projects: true,
    publications: true,
    status: true,
    lastUpdated: true,
  });
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  // Filtered & Sorted researchers
  const filteredResearchers = useMemo(() => {
    return researchers
      .filter((r) => {
        const matchesQuery =
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.researchAreas.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesDept = selectedDept === "All" || r.department === selectedDept;
        const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;

        return matchesQuery && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "name") comp = a.name.localeCompare(b.name);
        else if (sortBy === "citations") comp = b.citations - a.citations;
        else if (sortBy === "publications") comp = b.publicationsCount - a.publicationsCount;
        else if (sortBy === "lastUpdated") comp = b.lastUpdated.localeCompare(a.lastUpdated);

        return sortOrder === "asc" ? comp : -comp;
      });
  }, [researchers, searchQuery, selectedDept, selectedStatus, sortBy, sortOrder]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredResearchers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResearchers.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Email,Department,Role,Status,Citations,hIndex"]
        .concat(
          filteredResearchers.map(
            (r) =>
              `"${r.name}","${r.email}","${r.department}","${r.role}","${r.status}",${r.citations},${r.hIndex}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ciirc_researchers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("CSV Export Successful", `Exported ${filteredResearchers.length} researcher records.`, "success");
  };

  const handleBulkStatusChange = (status: "Active" | "Incomplete") => {
    setResearchers((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status } : r))
    );
    toast("Bulk Update Completed", `Updated status for ${selectedIds.length} researchers to ${status}.`, "success");
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Researchers</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              {filteredResearchers.length} registered
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Manage CIIRC researchers, profiles and research activity.
          </p>
        </div>

        {/* Top actions: Add, Import, Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-secondary h-[35px]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.85} />
            <span>Export</span>
          </button>
          <button
            onClick={() => {
              toast("Import Wizard Ready", "CSV/BibTeX batch importer ready for parsing.", "info");
            }}
            className="btn-secondary h-[35px]"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={1.85} />
            <span>Import</span>
          </button>
          <button
            onClick={() => onOpenQuickCreate("researcher")}
            className="btn-primary h-[35px]"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>Add Researcher</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Columns, Sort */}
      <div className="p-3 rounded-2xl ref-card flex flex-wrap items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or research areas..."
            className="w-full h-[35px] pl-8 pr-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Cybernetics & Autonomous Systems">Cybernetics & Autonomous Systems</option>
            <option value="Biomechatronics & Neural Engineering">Biomechatronics & Neural Engineering</option>
            <option value="Computer Vision & Interactive Systems">Computer Vision & Interactive Systems</option>
            <option value="Materials & Soft Robotics">Materials & Soft Robotics</option>
            <option value="Human-Robot Interaction">Human-Robot Interaction</option>
            <option value="Quantum Cybernetics & Computing">Quantum Cybernetics & Computing</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Incomplete">Incomplete</option>
            <option value="On Leave">On Leave</option>
          </select>

          {/* Sort Selector */}
          <div className="flex items-center h-[35px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
            >
              <option value="name">Sort: Name</option>
              <option value="citations">Sort: Citations</option>
              <option value="publications">Sort: Publications</option>
              <option value="lastUpdated">Sort: Updated</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border-l border-slate-200 dark:border-slate-700"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.85} />
            </button>
          </div>

          {/* Columns Picker Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="h-[35px] flex items-center gap-1.5 px-3 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              <Columns className="w-3.5 h-3.5" strokeWidth={1.85} />
              <span>Columns</span>
            </button>

            {showColumnPicker && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-2xl glass-dropdown p-3 z-30 text-[12px] space-y-1.5 shadow-xl">
                <div className="font-semibold text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                  Toggle Columns
                </div>
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer py-1 text-slate-700 dark:text-slate-300 font-medium">
                    <input
                      type="checkbox"
                      checked={(visibleColumns as any)[col]}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({ ...prev, [col]: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-[#0066cc] focus:ring-0"
                    />
                    <span className="capitalize">{col.replace(/([A-Z])/g, " $1")}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (shows when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2.5 rounded-xl bg-[#edf2fe] dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 text-[#0055b3] dark:text-sky-300 flex items-center justify-between text-[12.5px] animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-medium">
            <CheckSquare className="w-4 h-4 text-[#0066cc] dark:text-sky-400" />
            <span>{selectedIds.length} researchers selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange("Active")}
              className="btn-secondary h-[30px] px-2.5 text-[12px]"
            >
              Mark Active
            </button>
            <button
              onClick={handleExportCSV}
              className="btn-primary h-[30px] px-2.5 text-[12px]"
            >
              Export Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-[12px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline ml-2"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-2xl ref-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <button onClick={toggleSelectAll} className="p-0.5">
                    {selectedIds.length === filteredResearchers.length && filteredResearchers.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#0066cc]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3">Researcher</th>
                {visibleColumns.role && <th className="py-3.5 px-3">Role</th>}
                {visibleColumns.department && <th className="py-3.5 px-3">Department</th>}
                {visibleColumns.researchAreas && <th className="py-3.5 px-3">Research Areas</th>}
                {visibleColumns.projects && <th className="py-3.5 px-3 text-center">Projects</th>}
                {visibleColumns.publications && <th className="py-3.5 px-3 text-center">Pubs</th>}
                {visibleColumns.status && <th className="py-3.5 px-3">Status</th>}
                {visibleColumns.lastUpdated && <th className="py-3.5 px-3">Last Updated</th>}
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredResearchers.map((r) => {
                const isSelected = selectedIds.includes(r.id);

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <button onClick={() => toggleSelectOne(r.id)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#0066cc]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <div
                        onClick={() => setSelectedResearcher(r)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-sky-400 transition-colors text-[13px]">
                            {r.name}
                          </div>
                          <div className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
                            {r.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {visibleColumns.role && (
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                        {r.role}
                      </td>
                    )}

                    {visibleColumns.department && (
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                        {r.department}
                      </td>
                    )}

                    {visibleColumns.researchAreas && (
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {r.researchAreas.slice(0, 2).map((a) => (
                            <span
                              key={a}
                              className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                            >
                              {a}
                            </span>
                          ))}
                          {r.researchAreas.length > 2 && (
                            <span className="text-[11px] text-slate-400 self-center">
                              +{r.researchAreas.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.projects && (
                      <td className="py-3 px-3 text-center font-semibold text-slate-800 dark:text-slate-200">
                        {r.projectsCount}
                      </td>
                    )}

                    {visibleColumns.publications && (
                      <td className="py-3 px-3 text-center font-semibold text-[#0066cc] dark:text-sky-400">
                        {r.publicationsCount}
                      </td>
                    )}

                    {visibleColumns.status && (
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            r.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    )}

                    {visibleColumns.lastUpdated && (
                      <td className="py-3 px-3 text-[11.5px] text-slate-400 font-medium">
                        {r.lastUpdated}
                      </td>
                    )}

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedResearcher(r)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#0066cc] transition-colors"
                          title="View Profile Drawer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            toast(`Editing ${r.name}`, "Opening full profile modifier.", "info");
                            setSelectedResearcher(r);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#0066cc] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">1</span> to{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {filteredResearchers.length}
            </span>{" "}
            of <span className="font-semibold text-slate-800 dark:text-slate-200">84</span> researchers
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled
              className="h-7 px-2.5 text-[12px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-50 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="h-7 min-w-[28px] px-2 text-[12px] rounded-lg bg-[#0066cc] text-white font-semibold">
              1
            </button>
            <button className="h-7 min-w-[28px] px-2 text-[12px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              2
            </button>
            <button className="h-7 min-w-[28px] px-2 text-[12px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              3
            </button>
            <button className="h-7 px-2.5 text-[12px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Researcher Profile Detail Drawer */}
      <ResearcherDetailDrawer
        researcher={selectedResearcher}
        isOpen={!!selectedResearcher}
        onClose={() => setSelectedResearcher(null)}
      />
    </div>
  );
}
