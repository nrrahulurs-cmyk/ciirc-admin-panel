"use client";

import React, { useState, useEffect } from "react";
import { ModuleId, UserAccount } from "@/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "../common/CommandPalette";
import { QuickCreateModal } from "../common/QuickCreateModal";
import { ToastProvider, useToast } from "../common/Toast";
import { userAccountsList } from "@/data/mockData";

// Domain & Operational Views
import { DashboardView } from "../dashboard/DashboardView";
import { ResearchManagementView } from "../research/ResearchManagementView";
import { ResearchersView } from "../research/ResearchersView";
import { FacilitiesView } from "../facilities/FacilitiesView";
import { PartnershipsView } from "../partnerships/PartnershipsView";
import { OperationsCenterView } from "../operations/OperationsCenterView";
import { ContentCMSView } from "../content/ContentCMSView";
import { WorkflowApprovalsView } from "../workflow/WorkflowApprovalsView";
import { MediaLibraryView } from "../media/MediaLibraryView";
import { EventsView } from "../events/EventsView";
import { FormsView } from "../forms/FormsView";
import { AnalyticsView } from "../analytics/AnalyticsView";
import { UsersRbacView } from "../admin/UsersRbacView";
import { AuditLogsView } from "../admin/AuditLogsView";
import { SystemSettingsView } from "../admin/SystemSettingsView";
import { AuthLoginView } from "../auth/AuthLoginView";
import { CIIRCIntro } from "../intro/CIIRCIntro";

function AppShellContent() {
  const { toast } = useToast();
  const [currentModule, setCurrentModule] = useState<ModuleId>("dashboard");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<string | null>(null);

  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserAccount>(userAccountsList[0]);

  // Theme & Intro States
  const [isDark, setIsDark] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const skipIntro = params.get("skipIntro") === "true";
      const seenSession = sessionStorage.getItem("ciirc_intro_seen_session") === "true";
      if (skipIntro || seenSession) {
        setShowIntro(false);
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

  const [workspaceReady, setWorkspaceReady] = useState(false);

  useEffect(() => {
    if (!showIntro) {
      const t = setTimeout(() => setWorkspaceReady(true), 40);
      return () => clearTimeout(t);
    } else {
      setWorkspaceReady(false);
    }
  }, [showIntro]);

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast("Console Session Locked", "Signed out of CIIRC Digital Operating System.", "info");
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentModule("dashboard");
    setShowIntro(false);
  };

  // If session is locked/unauthenticated, render the high-security institutional Login Gateway
  if (!isAuthenticated || currentModule === "login") {
    return (
      <AuthLoginView
        onLoginSuccess={handleLoginSuccess}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="min-h-screen w-screen ciirc-atmospheric-bg text-slate-900 dark:text-slate-100 flex items-center justify-center p-2.5 sm:p-3.5 lg:p-4 overflow-x-hidden">
      {/* Floating Workspace Shell matching exact specification */}
      <div
        className="w-full max-w-[1580px] h-[calc(100vh-28px)] rounded-[22px] bg-white/95 dark:bg-[#0c1220]/95 backdrop-blur-xl border border-[rgba(50,90,160,0.09)] dark:border-slate-800/80 shadow-[0_10px_35px_rgba(30,60,120,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex overflow-hidden transition-all duration-700 ease-out"
        style={{
          opacity: showIntro && !workspaceReady ? 0.9 : 1,
          transform: showIntro && !workspaceReady ? "scale(0.985)" : "scale(1)",
        }}
      >
        {/* Left Sidebar (Group 1: Navigation Structure ~80ms) */}
        <div
          className="h-full flex transition-all duration-600 ease-out"
          style={{
            opacity: !showIntro && workspaceReady ? 1 : 0.4,
            transform: !showIntro && workspaceReady ? "translateX(0)" : "translateX(-6px)",
            transitionDelay: "60ms",
          }}
        >
          <Sidebar
            currentModule={currentModule}
            onSelectModule={(mod) => setCurrentModule(mod)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50/30 dark:bg-slate-900/20">
          {/* Top Bar (Group 2: Shell Header ~140ms) */}
          <div
            className="w-full relative z-30 transition-all duration-600 ease-out"
            style={{
              opacity: !showIntro && workspaceReady ? 1 : 0.4,
              transform: !showIntro && workspaceReady ? "translateY(0)" : "translateY(-4px)",
              transitionDelay: "140ms",
            }}
          >
            <TopBar
              currentModule={currentModule}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onSelectModule={(mod) => setCurrentModule(mod)}
              onReplayIntro={() => setShowIntro(true)}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Workspace Body (Group 3: Key & Secondary Content ~220ms) */}
          <main
            className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 transition-all duration-650 ease-out"
            style={{
              opacity: !showIntro && workspaceReady ? 1 : 0.3,
              transform: !showIntro && workspaceReady ? "translateY(0)" : "translateY(6px)",
              transitionDelay: "220ms",
            }}
          >
            {/* Dashboard */}
            {currentModule === "dashboard" && (
              <DashboardView
                onSelectModule={(mod) => setCurrentModule(mod)}
                onOpenQuickCreate={handleOpenQuickCreate}
                isReady={!showIntro && workspaceReady}
              />
            )}

            {/* Research & Innovation Pillar */}
            {(currentModule === "researchers" || currentModule === "research-areas") && (
              <ResearchManagementView
                initialTab="researchers"
                onOpenQuickCreate={handleOpenQuickCreate}
              />
            )}

            {currentModule === "domains" && (
              <ResearchManagementView
                initialTab="domains"
                onOpenQuickCreate={handleOpenQuickCreate}
              />
            )}

            {currentModule === "projects" && (
              <ResearchManagementView
                initialTab="projects"
                onOpenQuickCreate={handleOpenQuickCreate}
              />
            )}

            {currentModule === "publications" && (
              <ResearchManagementView
                initialTab="publications"
                onOpenQuickCreate={handleOpenQuickCreate}
              />
            )}

            {(currentModule === "patents" || currentModule === "technologies") && (
              <ResearchManagementView
                initialTab="patents"
                onOpenQuickCreate={handleOpenQuickCreate}
              />
            )}

            {currentModule === "relationship-explorer" && (
              <ResearchManagementView
                initialTab="researchers"
                onOpenQuickCreate={handleOpenQuickCreate}
              />
            )}

            {/* Facilities & Infrastructure Pillar */}
            {(currentModule === "facilities" || currentModule === "equipment" || currentModule === "labs" || currentModule === "services") && (
              <FacilitiesView />
            )}

            {/* Partnerships & Incubation Pillar */}
            {(currentModule === "partnerships" || currentModule === "mous" || currentModule === "consultancy" || currentModule === "startups" || currentModule === "iedc") && (
              <PartnershipsView />
            )}

            {/* Operations Center & Data Quality */}
            {(currentModule === "operations" || currentModule === "data-quality") && (
              <OperationsCenterView onSelectModule={(mod) => setCurrentModule(mod)} />
            )}

            {/* People (Faculty & Scholars) */}
            {(currentModule === "faculty" || currentModule === "scholars" || currentModule === "departments") && (
              <ResearchersView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {/* Content & Website CMS */}
            {(currentModule === "pages" || currentModule === "news" || currentModule === "banners" || currentModule === "faqs" || currentModule === "website-readiness" || currentModule === "api-explorer") && (
              <ContentCMSView />
            )}

            {/* Institutional Events */}
            {(currentModule === "events" || currentModule === "speakers" || currentModule === "venues") && (
              <EventsView onOpenQuickCreate={handleOpenQuickCreate} />
            )}

            {/* Forms, Enquiries & Service Desk */}
            {(currentModule === "form-builder" || currentModule === "form-submissions" || currentModule === "enquiries" || currentModule === "service-desk") && (
              <FormsView />
            )}

            {/* Media Library */}
            {currentModule === "media-library" && <MediaLibraryView />}

            {/* Governance & Workflow Pipeline */}
            {currentModule === "workflow-approvals" && <WorkflowApprovalsView />}

            {/* Analytics */}
            {currentModule === "analytics" && <AnalyticsView />}

            {/* System, Security & RBAC */}
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
