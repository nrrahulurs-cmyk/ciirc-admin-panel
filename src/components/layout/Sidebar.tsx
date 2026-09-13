"use client";

import React from "react";
import {
  Home,
  FileText,
  FlaskConical,
  Users,
  Calendar,
  Image as ImageIcon,
  CheckSquare,
  GitFork,
  BarChart2,
  Settings,
  Building,
  Handshake,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { ModuleId, UserAccount } from "@/types";

interface SidebarProps {
  currentModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  currentUser?: UserAccount;
  onLogout?: () => void;
}

export function Sidebar({
  currentModule,
  onSelectModule,
  currentUser,
  onLogout,
}: SidebarProps) {
  // Navigation items matching exact reference dashboard + institutional pillars
  const navItems = [
    { id: "dashboard" as ModuleId, label: "Dashboard", icon: Home },
    { id: "pages" as ModuleId, label: "Content & CMS", icon: FileText },
    { id: "researchers" as ModuleId, label: "Research", icon: FlaskConical },
    { id: "facilities" as ModuleId, label: "Facilities & Labs", icon: Building },
    { id: "partnerships" as ModuleId, label: "Alliances & MOUs", icon: Handshake },
    { id: "operations" as ModuleId, label: "Operations & QA", icon: ShieldCheck },
    { id: "faculty" as ModuleId, label: "People", icon: Users },
    { id: "events" as ModuleId, label: "Events", icon: Calendar },
    { id: "media-library" as ModuleId, label: "Media", icon: ImageIcon },
    { id: "form-submissions" as ModuleId, label: "Forms & Desk", icon: CheckSquare },
    { id: "workflow-approvals" as ModuleId, label: "Governance", icon: GitFork },
    { id: "analytics" as ModuleId, label: "Analytics", icon: BarChart2 },
    { id: "system-settings" as ModuleId, label: "Settings", icon: Settings },
  ];

  const isItemActive = (id: ModuleId) => {
    if (currentModule === id) return true;
    if (id === "pages" && (currentModule === "news" || currentModule === "banners" || currentModule === "faqs" || currentModule === "website-readiness" || currentModule === "api-explorer")) return true;
    if (id === "researchers" && (currentModule === "domains" || currentModule === "projects" || currentModule === "publications" || currentModule === "patents" || currentModule === "technologies" || currentModule === "research-areas" || currentModule === "relationship-explorer")) return true;
    if (id === "facilities" && (currentModule === "equipment" || currentModule === "labs" || currentModule === "services")) return true;
    if (id === "partnerships" && (currentModule === "mous" || currentModule === "consultancy" || currentModule === "startups" || currentModule === "iedc")) return true;
    if (id === "operations" && (currentModule === "data-quality")) return true;
    if (id === "faculty" && (currentModule === "scholars" || currentModule === "departments")) return true;
    if (id === "events" && (currentModule === "speakers" || currentModule === "venues")) return true;
    if (id === "form-submissions" && (currentModule === "form-builder" || currentModule === "enquiries" || currentModule === "service-desk")) return true;
    if (id === "system-settings" && (currentModule === "users-rbac" || currentModule === "audit-logs")) return true;
    return false;
  };

  return (
    <aside className="w-[218px] shrink-0 flex flex-col justify-between py-4 px-3 border-r border-slate-100 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/30 select-none">
      <div>
        {/* CIIRC Logo with optical alignment */}
        <div className="pt-2 pb-4 px-3 flex items-center justify-between">
          <img
            src="/ciirc-logo-transparent.png"
            alt="ciirc"
            className="h-[30px] w-auto object-contain"
          />
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0066cc] dark:text-sky-300">
            OS
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-0.5 max-h-[calc(100vh-170px)] overflow-y-auto pr-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full h-[35px] flex items-center gap-2.5 px-3 rounded-xl text-[12px] font-medium transition-colors duration-150 text-left ${
                  active
                    ? "bg-[#edf2fe] dark:bg-blue-950/50 text-[#0055b3] dark:text-sky-300 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`w-[15px] h-[15px] shrink-0 ${
                    active
                      ? "text-[#0066cc] dark:text-sky-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                  strokeWidth={1.85}
                />
                <span className="truncate tracking-[-0.005em]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile section matching reference */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-2">
        <div
          onClick={() => onSelectModule("users-rbac")}
          className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
        >
          <div className="w-8 h-8 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold text-[11.5px] shadow-xs shrink-0">
            {currentUser?.name ? currentUser.name[0] : "A"}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[12px] text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0066cc] transition-colors leading-tight">
              {currentUser?.name ? currentUser.name.split(" ")[0] : "Admin"}
            </div>
            <div className="text-[10px] text-slate-400 truncate font-normal leading-tight mt-0.5">
              {currentUser?.role ? currentUser.role : "Super Admin"}
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Lock Session / Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
