"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  FolderGit2,
  BookOpen,
  Award,
  Calendar,
  Newspaper,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ModuleId } from "@/types";
import { useToast } from "../common/Toast";
import { getCanonicalMetrics } from "@/lib/canonicalMetrics";

interface DashboardViewProps {
  onSelectModule: (module: ModuleId) => void;
  onOpenQuickCreate: (type?: string) => void;
  isReady?: boolean;
}

export function DashboardView({
  onSelectModule,
  onOpenQuickCreate,
  isReady = true,
}: DashboardViewProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [chartAnimKey, setChartAnimKey] = useState(0);
  const [selectedRange, setSelectedRange] = useState("Last 6 Months");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger chart animation cleanly after intro finishes and workspace fades in
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setChartReady(true);
        setChartAnimKey((k) => k + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setChartReady(false);
    }
  }, [isReady]);

  // Smooth two-series trend data matching reference visual
  const waveDataMap: Record<string, Array<{ month: string; waveA: number; waveB: number }>> = {
    "Last 7 Days": [
      { month: "Mon", waveA: 20, waveB: 15 },
      { month: "Tue", waveA: 28, waveB: 24 },
      { month: "Wed", waveA: 35, waveB: 32 },
      { month: "Thu", waveA: 42, waveB: 28 },
      { month: "Fri", waveA: 48, waveB: 45 },
      { month: "Sat", waveA: 38, waveB: 50 },
      { month: "Sun", waveA: 52, waveB: 56 },
    ],
    "Last 30 Days": [
      { month: "W1", waveA: 24, waveB: 30 },
      { month: "W2", waveA: 38, waveB: 26 },
      { month: "W3", waveA: 45, waveB: 42 },
      { month: "W4", waveA: 55, waveB: 48 },
    ],
    "Last 3 Months": [
      { month: "Jul", waveA: 26, waveB: 34 },
      { month: "Aug", waveA: 52, waveB: 30 },
      { month: "Sep", waveA: 42, waveB: 56 },
    ],
    "Last 6 Months": [
      { month: "Apr", waveA: 18, waveB: 28 },
      { month: "May", waveA: 36, waveB: 22 },
      { month: "Jun", waveA: 32, waveB: 46 },
      { month: "Jul", waveA: 26, waveB: 34 },
      { month: "Aug", waveA: 52, waveB: 30 },
      { month: "Sep", waveA: 42, waveB: 56 },
    ],
    "Last 12 Months": [
      { month: "Oct", waveA: 14, waveB: 20 },
      { month: "Dec", waveA: 22, waveB: 18 },
      { month: "Feb", waveA: 30, waveB: 35 },
      { month: "Apr", waveA: 28, waveB: 26 },
      { month: "Jun", waveA: 42, waveB: 40 },
      { month: "Aug", waveA: 52, waveB: 30 },
      { month: "Sep", waveA: 48, waveB: 58 },
    ],
  };

  const waveData = waveDataMap[selectedRange] || waveDataMap["Last 6 Months"];
  const canonical = getCanonicalMetrics();

  const kpis = [
    { id: "researchers", number: String(canonical.researchersCount), label: "Researchers", trend: "12%", icon: Users, module: "researchers" as ModuleId },
    { id: "projects", number: String(canonical.activeProjectsCount), label: "Active Projects", trend: "8%", icon: FolderGit2, module: "projects" as ModuleId },
    { id: "publications", number: String(canonical.publicationsCount), label: "Publications", trend: "15%", icon: BookOpen, module: "publications" as ModuleId },
    { id: "patents", number: String(canonical.patentsCount), label: "Patents", trend: "4%", icon: Award, module: "patents" as ModuleId },
    { id: "events", number: String(canonical.upcomingEventsCount), label: "Upcoming Events", trend: "20%", icon: Calendar, module: "events" as ModuleId },
  ];

  // Global unified entity definitions for Quick Actions (Issues 11, 12, 15)
  const quickActionItems = [
    {
      id: "researcher",
      label: "Researcher",
      icon: Users,
      bgClass: "bg-sky-50 dark:bg-sky-950/40",
      textClass: "text-sky-600 dark:text-sky-400",
      borderClass: "border-sky-200/60 dark:border-sky-800/60",
      onClick: () => onOpenQuickCreate("researcher"),
      tooltip: "Register new researcher profile",
    },
    {
      id: "project",
      label: "Project",
      icon: FolderGit2,
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
      textClass: "text-emerald-600 dark:text-emerald-400",
      borderClass: "border-emerald-200/60 dark:border-emerald-800/60",
      onClick: () => onOpenQuickCreate("project"),
      tooltip: "Initiate new research project",
    },
    {
      id: "publication",
      label: "Publication",
      icon: BookOpen,
      bgClass: "bg-purple-50 dark:bg-purple-950/40",
      textClass: "text-purple-600 dark:text-purple-400",
      borderClass: "border-purple-200/60 dark:border-purple-800/60",
      onClick: () => onOpenQuickCreate("publication"),
      tooltip: "Index publication or journal article",
    },
    {
      id: "event",
      label: "Event",
      icon: Calendar,
      bgClass: "bg-amber-50 dark:bg-amber-950/40",
      textClass: "text-amber-600 dark:text-amber-400",
      borderClass: "border-amber-200/60 dark:border-amber-800/60",
      onClick: () => onOpenQuickCreate("event"),
      tooltip: "Schedule seminar or conference",
    },
    {
      id: "news",
      label: "News",
      icon: Newspaper,
      bgClass: "bg-blue-50 dark:bg-blue-950/40",
      textClass: "text-blue-600 dark:text-blue-400",
      borderClass: "border-blue-200/60 dark:border-blue-800/60",
      onClick: () => {
        onSelectModule("pages");
        toast("Opening News Studio", "Publish or schedule announcements.", "info");
      },
      tooltip: "Publish institutional news",
    },
  ];

  return (
    <div className="space-y-4 max-w-full">
      {/* 1. Header Greeting */}
      <div>
        <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2">
          <span>Good Morning, Admin!</span>
          <span className="text-[22px]">👋</span>
        </h1>
        <p className="text-[12.5px] leading-5 text-slate-600 dark:text-slate-400 font-normal tracking-[-0.005em] mt-0.5">
          Here's what's happening at CIIRC today.
        </p>
      </div>

      {/* 2. KPI Strip — Consistent corner radii and semantic trend colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onSelectModule(kpi.module)}
              className="ref-card p-4 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="flex items-start justify-between">
                {/* Dominating Number */}
                <span className="text-[27px] leading-none font-bold text-slate-900 dark:text-white tracking-[-0.025em]">
                  {kpi.number}
                </span>
                <div className="w-5 h-5 rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Icon className="w-3 h-3" strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-3">
                {/* Secondary Label */}
                <div className="text-[12px] font-medium text-slate-600 dark:text-slate-400 tracking-[-0.005em]">
                  {kpi.label}
                </div>
                {/* Tertiary Trend Pill (Green exclusively for growth) */}
                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold mt-1.5">
                  <span>↑</span>
                  <span>{kpi.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Row: Research & Activity Overview (8 cols) + Requires Attention (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Research & Activity Overview with left-aligned Legend & vertically aligned controls (Issues 9 & 16) */}
        <div className="lg:col-span-8 ref-card p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70 h-[38px]">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em] leading-none">
                Research & Activity Overview
              </h2>

              {/* Chart Legend directly grouped adjacent to the title (Issue 9 & 16) */}
              <div className="hidden sm:flex items-center gap-3 text-[11.5px] font-medium pl-3 border-l border-slate-200 dark:border-slate-700 leading-none">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0066cc] shrink-0" />
                  <span>Research Momentum</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7c8cf8] shrink-0" />
                  <span>Citations & Output</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center">
              <button
                onClick={() => setShowRangeDropdown(!showRangeDropdown)}
                className="btn-secondary h-[28px] px-2.5 rounded-lg text-[11.5px] font-medium flex items-center gap-1"
              >
                <span>{selectedRange}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" strokeWidth={1.85} />
              </button>

              {showRangeDropdown && (
                <div className="absolute right-0 mt-1 w-36 rounded-xl glass-dropdown p-1.5 z-20 text-[11.5px]">
                  {["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "Last 12 Months"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRange(r);
                        setShowRangeDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Smooth Wavy Two-Series Spline Chart with Y-Axis vertically centered on grid lines (Issue 10) */}
          <div className="h-48 sm:h-56 w-full mt-2">
            {mounted && chartReady ? (
              <ResponsiveContainer width="100%" height="100%" key={`resp-${chartAnimKey}`}>
                <AreaChart
                  key={`chart-${chartAnimKey}-${selectedRange}`}
                  data={waveData}
                  margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="waveBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066cc" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0066cc" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="waveIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c8cf8" stopOpacity={0.16} />
                      <stop offset="95%" stopColor="#7c8cf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.55)" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={10.5}
                    tickLine={false}
                    axisLine={false}
                  />
                  {/* Numerical scale on Y-axis centered vertically on grid lines with dy: 3 (Issue 10) */}
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={26}
                    domain={[0, "auto"]}
                    tick={{ dy: 3, fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-dropdown p-2.5 rounded-xl text-xs shadow-md border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                            <div className="font-semibold text-slate-500 mb-1 text-[11px]">{label}</div>
                            <div className="flex items-center justify-between gap-3 text-[11.5px]">
                              <span className="text-[#0066cc] font-medium">Research Momentum:</span>
                              <span className="font-bold">{payload[0]?.value}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 text-[11.5px]">
                              <span className="text-[#7c8cf8] font-medium">Citations & Output:</span>
                              <span className="font-bold">{payload[1]?.value}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="waveA"
                    name="Research Momentum"
                    stroke="#0066cc"
                    strokeWidth={2.25}
                    fillOpacity={1}
                    fill="url(#waveBlue)"
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    animationBegin={60}
                  />
                  <Area
                    type="natural"
                    dataKey="waveB"
                    name="Citations & Output"
                    stroke="#7c8cf8"
                    strokeWidth={2.25}
                    fillOpacity={1}
                    fill="url(#waveIndigo)"
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    animationBegin={220}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-40">
                <div className="w-full h-full flex items-end px-3 pb-4">
                  <div className="w-full h-24 rounded-lg bg-gradient-to-t from-blue-100/30 to-transparent dark:from-sky-950/20" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Requires Attention Panel (Consistent semantic scale & interactive chevrons: Issues 8 & 14) */}
        <div className="lg:col-span-4 ref-card p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70 h-[38px]">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
                Requires Attention
              </h2>
              <span className="bg-[#ef4444] text-white text-[10.5px] font-bold px-1.5 py-0.2 rounded-full">
                12
              </span>
            </div>

            {/* List items with interactive chevrons (Issue 8) and unified semantic color scale (Issue 14) */}
            <div className="space-y-1.5 mt-3">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectModule("workflow-approvals");
                  toast("Navigated to Workflow", "4 content approvals queued for review.", "info");
                }}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 font-bold flex items-center justify-center text-[11.5px] shrink-0">
                    4
                  </div>
                  <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] dark:group-hover:text-sky-400 transition-colors tracking-[-0.005em] truncate">
                    Content approvals pending
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066cc] dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectModule("researchers");
                  toast("Navigated to Researchers", "Filtered 2 incomplete profiles.", "info");
                }}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 font-bold flex items-center justify-center text-[11.5px] shrink-0">
                    2
                  </div>
                  <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] dark:group-hover:text-sky-400 transition-colors tracking-[-0.005em] truncate">
                    Incomplete researcher profiles
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066cc] dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectModule("events");
                  toast("Navigated to Events", "Managing 3 upcoming symposiums.", "info");
                }}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 font-bold flex items-center justify-center text-[11.5px] shrink-0">
                    3
                  </div>
                  <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] dark:group-hover:text-sky-400 transition-colors tracking-[-0.005em] truncate">
                    Upcoming events requiring review
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066cc] dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectModule("form-submissions");
                  toast("Navigated to Forms", "Reviewing 3 collaboration inquiries.", "info");
                }}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 font-bold flex items-center justify-center text-[11.5px] shrink-0">
                    3
                  </div>
                  <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] dark:group-hover:text-sky-400 transition-colors tracking-[-0.005em] truncate">
                    New form submissions
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066cc] dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: 8:4 Grid Alignment matching top row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Recent Activity with balanced View All button (Issue 13), consistent metadata (Issue 7), and tighter density (Issue 6) */}
        <div className="lg:col-span-8 ref-card p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70 h-[38px] px-0.5">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em] leading-none">
                Recent Activity
              </h2>
              <button
                onClick={() => onSelectModule("audit-logs")}
                className="text-[12px] font-medium text-[#0066cc] dark:text-sky-400 hover:underline leading-none py-1"
              >
                View All
              </button>
            </div>

            {/* 3 Activity Items with unified iconography and colors (Issue 11), consistent metadata (Issue 7), and high density (Issue 6) */}
            <div className="space-y-2 mt-3">
              {/* Publication: BookOpen + Purple (strictly matches Quick Actions: Issue 11) */}
              <div className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" strokeWidth={1.85} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white leading-snug">
                    Publication updated
                  </div>
                  <div className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    by Dr. Sharma · 10:42 AM
                  </div>
                </div>
              </div>

              {/* Event: Calendar + Amber with 'by Admin' (Issue 7) */}
              <div className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" strokeWidth={1.85} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white leading-snug">
                    Event approved
                  </div>
                  <div className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    by Admin · 10:18 AM
                  </div>
                </div>
              </div>

              {/* Project: FolderGit2 + Emerald */}
              <div className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                  <FolderGit2 className="w-4 h-4" strokeWidth={1.85} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white leading-snug">
                    New research project created
                  </div>
                  <div className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    by Prof. Mehta · 09:51 AM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions with prominent button sizing & solid visual weight (Issues 12 & 15) */}
        <div className="lg:col-span-4 ref-card p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70 h-[38px]">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em] leading-none">
                Quick Actions
              </h2>
              <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
                Creation Shortcuts
              </span>
            </div>

            {/* Shortcut buttons with solid visual weight and prominent sizing (Issues 12 & 15) */}
            <div className="grid grid-cols-5 gap-2.5 mt-3.5">
              {quickActionItems.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-[#0066cc]/40 dark:hover:border-sky-400/50 shadow-xs hover:shadow-sm transition-all duration-150 group cursor-pointer active:scale-95 text-center min-w-0"
                    title={action.tooltip}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${action.bgClass} ${action.textClass} ${action.borderClass} border flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}
                    >
                      <Icon className="w-[18px] h-[18px]" strokeWidth={1.85} />
                    </div>
                    <span className="text-[10px] sm:text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight text-center tracking-tight">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
