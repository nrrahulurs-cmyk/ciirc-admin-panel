"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  FolderGit2,
  BookOpen,
  Award,
  Calendar,
  Newspaper,
  ChevronDown,
  Plus,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ModuleId } from "@/types";
import { useToast } from "../common/Toast";

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

  const kpis = [
    { id: "researchers", number: "84", label: "Researchers", trend: "12%", icon: Users, module: "researchers" as ModuleId },
    { id: "projects", number: "37", label: "Active Projects", trend: "8%", icon: FolderGit2, module: "projects" as ModuleId },
    { id: "publications", number: "214", label: "Publications", trend: "15%", icon: BookOpen, module: "publications" as ModuleId },
    { id: "patents", number: "28", label: "Patents", trend: "4%", icon: Award, module: "patents" as ModuleId },
    { id: "events", number: "6", label: "Upcoming Events", trend: "20%", icon: Calendar, module: "events" as ModuleId },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header Greeting — Inter 25px / 700 with optical letter spacing */}
      <div>
        <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2">
          <span>Good Morning, Admin!</span>
          <span className="text-[22px]">👋</span>
        </h1>
        <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 font-normal tracking-[-0.005em] mt-0.5">
          Here's what's happening at CIIRC today.
        </p>
      </div>

      {/* 2. KPI Strip — Exactly 5 cards matching reference visual & hierarchy */}
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
                {/* Tertiary Trend Pill */}
                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold mt-1.5">
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
        {/* Left: Research & Activity Overview */}
        <div className="lg:col-span-8 ref-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70">
            <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
              Research & Activity Overview
            </h2>

            <div className="relative">
              <button
                onClick={() => setShowRangeDropdown(!showRangeDropdown)}
                className="h-[28px] px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-[11.5px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
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

          {/* Smooth Wavy Two-Series Spline Chart matching reference (No Y-axis numbers) */}
          <div className="h-48 sm:h-56 w-full mt-2">
            {mounted && chartReady ? (
              <ResponsiveContainer width="100%" height="100%" key={`resp-${chartAnimKey}`}>
                <AreaChart
                  key={`chart-${chartAnimKey}-${selectedRange}`}
                  data={waveData}
                  margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
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
                              <span className="text-[#7c8cf8] font-medium">Citations:</span>
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

        {/* Right: Requires Attention Panel matching reference */}
        <div className="lg:col-span-4 ref-card p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
                Requires Attention
              </h2>
              <span className="bg-[#ef4444] text-white text-[10.5px] font-bold px-1.5 py-0.2 rounded-full">
                12
              </span>
            </div>

            {/* 4 Rows matching reference items */}
            <div className="space-y-3 mt-3.5">
              <div
                onClick={() => {
                  onSelectModule("workflow-approvals");
                  toast("Navigated to Workflow", "4 content approvals queued for review.", "info");
                }}
                className="flex items-center gap-3 cursor-pointer group py-0.5"
              >
                <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-500 font-bold flex items-center justify-center text-[11.5px] shrink-0 group-hover:scale-105 transition-transform">
                  4
                </div>
                <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] transition-colors tracking-[-0.005em]">
                  4 content approvals
                </span>
              </div>

              <div
                onClick={() => {
                  onSelectModule("researchers");
                  toast("Navigated to Researchers", "Filtered 2 incomplete profiles.", "info");
                }}
                className="flex items-center gap-3 cursor-pointer group py-0.5"
              >
                <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-500 font-bold flex items-center justify-center text-[11.5px] shrink-0 group-hover:scale-105 transition-transform">
                  2
                </div>
                <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] transition-colors tracking-[-0.005em]">
                  2 incomplete researcher profiles
                </span>
              </div>

              <div
                onClick={() => {
                  onSelectModule("events");
                  toast("Navigated to Events", "Managing 3 upcoming symposiums.", "info");
                }}
                className="flex items-center gap-3 cursor-pointer group py-0.5"
              >
                <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-500 font-bold flex items-center justify-center text-[11.5px] shrink-0 group-hover:scale-105 transition-transform">
                  3
                </div>
                <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] transition-colors tracking-[-0.005em]">
                  3 upcoming events
                </span>
              </div>

              <div
                onClick={() => {
                  onSelectModule("form-submissions");
                  toast("Navigated to Forms", "Reviewing 3 collaboration inquiries.", "info");
                }}
                className="flex items-center gap-3 cursor-pointer group py-0.5"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 font-bold flex items-center justify-center text-[11.5px] shrink-0 group-hover:scale-105 transition-transform">
                  3
                </div>
                <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0066cc] transition-colors tracking-[-0.005em]">
                  3 new form submissions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Activity (6 cols) + Quick Actions (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Recent Activity */}
        <div className="lg:col-span-6 ref-card p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
                Recent Activity
              </h2>
              <button
                onClick={() => onSelectModule("audit-logs")}
                className="text-[12px] font-semibold text-[#0066cc] dark:text-sky-400 hover:underline"
              >
                View All
              </button>
            </div>

            {/* 3 Activity Items */}
            <div className="space-y-3 mt-3.5">
              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-xl bg-[#e0f2fe] dark:bg-sky-950/50 text-[#0066cc] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" strokeWidth={1.85} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white leading-snug">
                    Publication updated
                  </div>
                  <div className="text-[11.5px] text-slate-400 leading-snug mt-0.5">
                    by Dr. Sharma · 10:42 AM
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-xl bg-[#f3e8ff] dark:bg-purple-950/50 text-[#9333ea] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" strokeWidth={1.85} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white leading-snug">
                    Event approved
                  </div>
                  <div className="text-[11.5px] text-slate-400 leading-snug mt-0.5">
                    Admin · 10:18 AM
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-xl bg-[#e0e7ff] dark:bg-indigo-950/50 text-[#4f46e5] flex items-center justify-center shrink-0">
                  <FolderGit2 className="w-4 h-4" strokeWidth={1.85} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white leading-snug">
                    New research project created
                  </div>
                  <div className="text-[11.5px] text-slate-400 leading-snug mt-0.5">
                    by Prof. Mehta · 09:51 AM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="lg:col-span-6 ref-card p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/70 dark:border-slate-800/70">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-[-0.01em]">
                Quick Actions
              </h2>
              {/* + Create New primary action button matching specification */}
              <button
                onClick={() => onOpenQuickCreate("researcher")}
                className="btn-primary h-[33px] px-3 rounded-lg text-[12px] font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
                <span>Create New</span>
              </button>
            </div>

            {/* Exactly 5 compact rounded tiles in a horizontal row */}
            <div className="grid grid-cols-5 gap-2 mt-3.5 text-center">
              {/* Tile 1: Researcher */}
              <button
                onClick={() => onOpenQuickCreate("researcher")}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-[40px] h-[40px] rounded-2xl bg-[#e0f2fe] dark:bg-sky-950/40 text-[#0066cc] flex items-center justify-center group-hover:-translate-y-0.5 transition-transform shadow-2xs">
                  <User className="w-[18px] h-[18px]" strokeWidth={1.85} />
                </div>
                <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 tracking-[-0.005em]">
                  Researcher
                </span>
              </button>

              {/* Tile 2: Project */}
              <button
                onClick={() => onOpenQuickCreate("project")}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-[40px] h-[40px] rounded-2xl bg-[#ccfbf1] dark:bg-teal-950/40 text-[#0d9488] flex items-center justify-center group-hover:-translate-y-0.5 transition-transform shadow-2xs">
                  <FolderGit2 className="w-[18px] h-[18px]" strokeWidth={1.85} />
                </div>
                <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 tracking-[-0.005em]">
                  Project
                </span>
              </button>

              {/* Tile 3: Publication */}
              <button
                onClick={() => onOpenQuickCreate("publication")}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-[40px] h-[40px] rounded-2xl bg-[#dbeafe] dark:bg-blue-950/40 text-[#2563eb] flex items-center justify-center group-hover:-translate-y-0.5 transition-transform shadow-2xs">
                  <BookOpen className="w-[18px] h-[18px]" strokeWidth={1.85} />
                </div>
                <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 tracking-[-0.005em]">
                  Publication
                </span>
              </button>

              {/* Tile 4: Event */}
              <button
                onClick={() => onOpenQuickCreate("event")}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-[40px] h-[40px] rounded-2xl bg-[#ffe4e6] dark:bg-rose-950/40 text-[#e11d48] flex items-center justify-center group-hover:-translate-y-0.5 transition-transform shadow-2xs">
                  <Calendar className="w-[18px] h-[18px]" strokeWidth={1.85} />
                </div>
                <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 tracking-[-0.005em]">
                  Event
                </span>
              </button>

              {/* Tile 5: News */}
              <button
                onClick={() => {
                  onSelectModule("pages");
                  toast("Opening News Studio", "Publish or schedule announcements.", "info");
                }}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-[40px] h-[40px] rounded-2xl bg-[#f3e8ff] dark:bg-purple-950/40 text-[#9333ea] flex items-center justify-center group-hover:-translate-y-0.5 transition-transform shadow-2xs">
                  <Newspaper className="w-[18px] h-[18px]" strokeWidth={1.85} />
                </div>
                <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 tracking-[-0.005em]">
                  News
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
