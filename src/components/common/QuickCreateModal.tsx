"use client";

import React, { useState } from "react";
import { X, Users, FolderGit2, BookOpen, Calendar, Newspaper, FileText, CheckCircle } from "lucide-react";
import { useToast } from "./Toast";

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
  onCreated?: (type: string, data: any) => void;
}

export function QuickCreateModal({
  isOpen,
  onClose,
  defaultType = "researcher",
  onCreated,
}: QuickCreateModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultType);

  // Form states
  const [resForm, setResForm] = useState({
    name: "",
    title: "Assistant Professor",
    department: "Cybernetics & Autonomous Systems",
    email: "",
    researchAreas: "",
  });

  const [projForm, setProjForm] = useState({
    title: "",
    code: "CIIRC-ROB-2026-09",
    pi: "Dr. Arvind Sharma",
    department: "Cybernetics & Autonomous Systems",
    fundingAgency: "Department of Science and Technology (DST)",
    fundingAmount: "25000000",
  });

  const [pubForm, setPubForm] = useState({
    title: "",
    authors: "",
    journal: "IEEE Transactions on Robotics (T-RO)",
    year: "2026",
    doi: "10.1109/TRO.2026.10982",
    type: "Journal",
  });

  const [evForm, setEvForm] = useState({
    title: "",
    date: "2026-11-20",
    time: "09:30 AM - 04:30 PM",
    location: "CIIRC Main Auditorium",
    category: "Symposium",
    capacity: "200",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "researcher") {
      toast("Researcher Created", `${resForm.name || "New Researcher"} profile initialized.`, "success");
      onCreated?.("researcher", resForm);
    } else if (activeTab === "project") {
      toast("Project Initialized", `${projForm.title || "New Project"} registered with grants office.`, "success");
      onCreated?.("project", projForm);
    } else if (activeTab === "publication") {
      toast("Publication Indexed", `${pubForm.title || "New Publication"} queued for metadata verification.`, "success");
      onCreated?.("publication", pubForm);
    } else if (activeTab === "event") {
      toast("Event Scheduled", `${evForm.title || "New Event"} added to institutional calendar.`, "success");
      onCreated?.("event", evForm);
    }
    onClose();
  };

  const tabs = [
    { id: "researcher", label: "Researcher", icon: Users },
    { id: "project", label: "Project", icon: FolderGit2 },
    { id: "publication", label: "Publication", icon: BookOpen },
    { id: "event", label: "Event", icon: Calendar },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Create New Entity
            </h2>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Rapidly deploy new records across CIIRC digital modules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 px-6 bg-slate-50/60 dark:bg-slate-950/30">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 text-[12px] font-medium border-b-2 transition-all ${
                  isActive
                    ? "border-[#0066cc] text-[#0066cc] dark:border-[#38bdf8] dark:text-[#38bdf8]"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "researcher" && (
            <>
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Full Name & Honorific *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Malini Sengupta"
                  value={resForm.name}
                  onChange={(e) => setResForm({ ...resForm, name: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Designation / Title
                  </label>
                  <select
                    value={resForm.title}
                    onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  >
                    <option>Principal Research Scientist</option>
                    <option>Professor of Robotics</option>
                    <option>Associate Professor</option>
                    <option>Assistant Professor</option>
                    <option>Postdoctoral Fellow</option>
                    <option>Visiting Chair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Department
                  </label>
                  <select
                    value={resForm.department}
                    onChange={(e) => setResForm({ ...resForm, department: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  >
                    <option>Cybernetics & Autonomous Systems</option>
                    <option>Biomechatronics & Neural Engineering</option>
                    <option>Computer Vision & Interactive Systems</option>
                    <option>Materials & Soft Robotics</option>
                    <option>Human-Robot Interaction</option>
                    <option>Quantum Cybernetics & Computing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="m.sengupta@ciirc.edu.in"
                  value={resForm.email}
                  onChange={(e) => setResForm({ ...resForm, email: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Primary Research Areas (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Microrobotics, Magnetotactic Actuation, Targeted Drug Delivery"
                  value={resForm.researchAreas}
                  onChange={(e) => setResForm({ ...resForm, researchAreas: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>
            </>
          )}

          {activeTab === "project" && (
            <>
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tactile-Enabled Surgical Robot for Endoscopic Procedures"
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Project Code
                  </label>
                  <input
                    type="text"
                    value={projForm.code}
                    onChange={(e) => setProjForm({ ...projForm, code: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Principal Investigator (PI)
                  </label>
                  <select
                    value={projForm.pi}
                    onChange={(e) => setProjForm({ ...projForm, pi: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  >
                    <option>Dr. Arvind Sharma</option>
                    <option>Prof. Rajesh Mehta</option>
                    <option>Dr. Sunita Rao</option>
                    <option>Dr. K. Ramanathan</option>
                    <option>Dr. Ananya Roy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Funding Agency
                  </label>
                  <input
                    type="text"
                    value={projForm.fundingAgency}
                    onChange={(e) => setProjForm({ ...projForm, fundingAgency: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Grant Amount (INR)
                  </label>
                  <input
                    type="number"
                    value={projForm.fundingAmount}
                    onChange={(e) => setProjForm({ ...projForm, fundingAmount: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "publication" && (
            <>
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Publication Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robust Visual-Inertial Navigation in Sensor-Degraded Mining Shafts"
                  value={pubForm.title}
                  onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Authors (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Dr. Arvind Sharma, K. Ramanathan, S. Rao"
                  value={pubForm.authors}
                  onChange={(e) => setPubForm({ ...pubForm, authors: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Journal / Conference
                  </label>
                  <input
                    type="text"
                    value={pubForm.journal}
                    onChange={(e) => setPubForm({ ...pubForm, journal: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Digital Object Identifier (DOI)
                  </label>
                  <input
                    type="text"
                    value={pubForm.doi}
                    onChange={(e) => setPubForm({ ...pubForm, doi: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "event" && (
            <>
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. International Cybernetics Hands-On Winter School"
                  value={evForm.title}
                  onChange={(e) => setEvForm({ ...evForm, title: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={evForm.date}
                    onChange={(e) => setEvForm({ ...evForm, date: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    value={evForm.capacity}
                    onChange={(e) => setEvForm({ ...evForm, capacity: e.target.value })}
                    className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={evForm.location}
                  onChange={(e) => setEvForm({ ...evForm, location: e.target.value })}
                  className="w-full h-[35px] px-3 text-[12.5px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc] transition-all"
                />
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary h-[34px] px-4 text-[12px] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary h-[34px] px-4 text-[12px] font-semibold flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Save & Publish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
