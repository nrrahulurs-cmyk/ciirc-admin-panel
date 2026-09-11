"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  Globe,
  BookOpen,
  Calendar,
  Users,
  Award,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useToast } from "../common/Toast";

export function AnalyticsView() {
  const { toast } = useToast();
  const [period, setPeriod] = useState("Annual 2025-26");

  const departmentFundingData = [
    { name: "Cybernetics", funding: 42, color: "#0284c7" },
    { name: "Biomechatronics", funding: 28.5, color: "#10b981" },
    { name: "Vision & AI", funding: 16.5, color: "#6366f1" },
    { name: "Materials", funding: 19.8, color: "#06b6d4" },
    { name: "HRI", funding: 12, color: "#f59e0b" },
    { name: "Quantum", funding: 14.2, color: "#8b5cf6" },
  ];

  const citationsByYear = [
    { year: "2021", citations: 2100 },
    { year: "2022", citations: 3400 },
    { year: "2023", citations: 4850 },
    { year: "2024", citations: 6200 },
    { year: "2025", citations: 8900 },
    { year: "2026 (YTD)", citations: 11400 },
  ];

  const exportReport = () => {
    toast("Generating Executive Dossier", "PDF report compiled with institutional audit metrics.", "success");
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Institutional Research & Web Analytics</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              Q3 Benchmark
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Macro-level visibility into CIIRC citation trajectories, sponsored funding allocations, and portal traffic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option>Annual 2025-26</option>
            <option>Fiscal Q2 2026</option>
            <option>Historical 5-Year</option>
          </select>

          <button
            onClick={exportReport}
            className="btn-primary h-[35px]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.85} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium block">Cumulative Citations</span>
          <div className="text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white mt-1">
            32,840
          </div>
          <div className="text-[11.5px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            ↑ 28.4% YoY acceleration
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium block">Sponsored Grant Inflow</span>
          <div className="text-[26px] font-bold tracking-[-0.025em] text-[#0066cc] dark:text-sky-400 mt-1">
            ₹132.8 Cr
          </div>
          <div className="text-[11.5px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            ↑ 18.2% vs target
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium block">Portal Monthly Visitors</span>
          <div className="text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white mt-1">
            184,200
          </div>
          <div className="text-[11.5px] text-slate-400 mt-1">
            From 84 countries worldwide
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium block">Granted Patents</span>
          <div className="text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white mt-1">
            28 Patents
          </div>
          <div className="text-[11.5px] text-[#0066cc] dark:text-sky-400 font-semibold mt-1">
            4 commercialized licenses
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Research Funding by Department */}
        <div className="p-5 rounded-2xl ref-card space-y-4">
          <div>
            <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">
              Grant Allocations by Department (₹ Crores)
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Sponsored funding distribution across core robotics clusters</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentFundingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-dropdown p-2.5 rounded-xl text-[12px] shadow-lg border border-slate-200/80 dark:border-slate-800">
                          <span className="font-medium text-slate-500 dark:text-slate-400 block">{label}</span>
                          <span className="font-bold text-[#0066cc] dark:text-sky-400">₹{payload[0].value} Crores</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="funding" fill="#0066cc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Citations Trajectory */}
        <div className="p-5 rounded-2xl ref-card space-y-4">
          <div>
            <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">
              Annual Institutional Citations Trajectory
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Scopus & Google Scholar aggregate citations indexed</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citationsByYear} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-dropdown p-2.5 rounded-xl text-[12px] shadow-lg border border-slate-200/80 dark:border-slate-800">
                          <span className="font-medium text-slate-500 dark:text-slate-400 block">{label}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{payload[0].value} citations</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="citations" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
