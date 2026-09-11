"use client";

import React, { useState, useEffect } from "react";
import { ModuleId } from "@/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "../common/CommandPalette";
import { QuickCreateModal } from "../common/QuickCreateModal";
import { ToastProvider, useToast } from "../common/Toast";

// Domain Views
import { DashboardView } from "../dashboard/DashboardView";
import { ResearchersView } from "../research/ResearchersView";
import { ProjectsView } from "../research/ProjectsView";
import { PublicationsView } from "../research/PublicationsView";
import { ContentCMSView } from "../content/ContentCMSView";
import { WorkflowApprovalsView } from "../workflow/WorkflowApprovalsView";
import { MediaLibraryView } from "../media/MediaLibraryView";
import { EventsView } from "../events/EventsView";
import { FormsView } from "../forms/FormsView";
import { AnalyticsView } from "../analytics/AnalyticsView";
import { UsersRbacView } from "../admin/UsersRbacView";
import { AuditLogsView } from "../admin/AuditLogsView";
import { SystemSettingsView } from "../admin/SystemSettingsView";
import { CIIRCIntro } from "../intro/CIIRCIntro";

function AppShellContent() {
  const { toast } = useToast();
  const [currentModule, setCurrentModule] = useState<ModuleId>("dashboard");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<string | null>(null);

  // Default to Light Mode as primary per reference
  const [isDark, setIsDark] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const forceIntro = params.get("intro") === "true";
      const hasSeenIntro = localStorage.getItem("ciirc_intro_seen");
      if (forceIntro || !hasSeenIntro) {
        setShowIntro(true);
      }
    } catch (err) {
      console.warn("Intro check error:", err);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("ciirc-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("ciirc-theme", "dark");
        toast("Dark Theme Active", "Switched to deep blue-charcoal research console.", "info");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("ciirc-theme", "light");
        toast("Light Theme Active", "Switched to primary reference light palette.", "info");
      }
      return next;
    });
  };

  const handleOpenQuickCreate = (type: string = "researcher") => {
    setQuickCreateType(type);
  };

  return (
    <div className="min-h-screen w-screen ciirc-atmospheric-bg text-slate-900 dark:text-slate-100 flex items-center justify-center p-2.5 sm:p-3.5 lg:p-4 overflow-x-hidden">
      {/* Floating Workspace Shell matching exact specification */}
      <div className="w-full max-w-[1580px] h-[calc(100vh-28px)] rounded-[22px] bg-white/95 dark:bg-[#0c1220]/95 backdrop-blur-xl border border-[rgba(50,90,160,0.09)] dark:border-slate-800/80 shadow-[0_10px_35px_rgba(30,60,120,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50/30 dark:bg-slate-900/20">
          {/* Top Bar */}
          <TopBar
            currentModule={currentModule}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onSelectModule={(mod) => setCurrentModule(mod)}
            onReplayIntro={() => setShowIntro(true)}
          />

          {/* Main Workspace Body */}
          <main className="flex-1 overflow-y-auto px-5 sm:px-7 py-5">
            {currentModule === "dashboard" && (
              <DashboardView
                onSelectModule={(mod) => setCurrentModule(mod)}
                onOpenQuickCreate={handleOpenQuickCreate}
              />
            )}

            {currentModule === "researchers" && (
              <ResearchersView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {currentModule === "projects" && (
              <ProjectsView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {currentModule === "publications" && (
              <PublicationsView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {currentModule === "patents" && (
              <PublicationsView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {currentModule === "faculty" && (
              <ResearchersView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {(currentModule === "pages" || currentModule === "news" || currentModule === "banners" || currentModule === "faqs") && (
              <ContentCMSView />
            )}

            {(currentModule === "events" || currentModule === "speakers" || currentModule === "venues") && (
              <EventsView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {(currentModule === "form-builder" || currentModule === "form-submissions" || currentModule === "enquiries") && (
              <FormsView />
            )}

            {currentModule === "media-library" && <MediaLibraryView />}

            {currentModule === "workflow-approvals" && <WorkflowApprovalsView />}

            {currentModule === "analytics" && <AnalyticsView />}

            {currentModule === "users-rbac" && <UsersRbacView />}

            {currentModule === "audit-logs" && <AuditLogsView />}

            {currentModule === "system-settings" && <SystemSettingsView />}
          </main>
        </div>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={(mod) => setCurrentModule(mod)}
        onOpenQuickCreate={handleOpenQuickCreate}
        toggleTheme={toggleTheme}
      />

      {/* Quick Create Drawer */}
      <QuickCreateModal
        isOpen={!!quickCreateType}
        defaultType={quickCreateType || "researcher"}
        onClose={() => setQuickCreateType(null)}
      />

      {/* Cinematic First-Launch Intro Experience */}
      {showIntro && (
        <CIIRCIntro
          onComplete={() => setShowIntro(false)}
          isDark={isDark}
        />
      )}
    </div>
  );
}

export function AppShell() {
  return (
    <ToastProvider>
      <AppShellContent />
    </ToastProvider>
  );
}
