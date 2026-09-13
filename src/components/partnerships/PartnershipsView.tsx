"use client";

import React, { useState } from "react";
import {
  Handshake,
  FileCheck,
  Briefcase,
  Rocket,
  GraduationCap,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Download,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  PartnerOrg,
  InstitutionalMOU,
  ConsultancyEngagement,
  StartupEntity,
  IEDCProject,
} from "@/types";
import {
  partnerOrgsList,
  institutionalMOUsList,
  consultancyProjectsList,
  startupsList,
  iedcProjectsList,
} from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "../common/Toast";

export function PartnershipsView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"mous" | "consultancy" | "startups" | "iedc">("mous");

  const [mous, setMous] = useState<InstitutionalMOU[]>(institutionalMOUsList);
  const [partners, setPartners] = useState<PartnerOrg[]>(partnerOrgsList);
  const [consultancies, setConsultancies] = useState<ConsultancyEngagement[]>(consultancyProjectsList);
  const [startups, setStartups] = useState<StartupEntity[]>(startupsList);
  const [iedcProjects, setIedcProjects] = useState<IEDCProject[]>(iedcProjectsList);

  const [search, setSearch] = useState("");

  const expiringMous = mous.filter((m) => m.daysRemaining <= 90);

  const handleConvertIEDC = (id: string, title: string) => {
    setIedcProjects((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, convertedToStartup: true, prototypeStatus: "Startup Candidate" } : item
      )
    );
    toast("IEDC Conversion Initiated", `"${title}" escalated to CIIRC Incubation Foundation pipeline.`, "success");
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Partnerships, MOUs & Incubation</span>
            <span className="text-[11.5px] font-medium px-2.5 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              Institutional Alliances
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Governance of strategic institutional MOUs, defense/industrial consultancy pipelines, deep-tech startups, and IEDC student innovations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toast("MOU Catalog Exported", "Comprehensive institutional agreement registry generated.", "success");
            }}
            className="btn-secondary h-[35px] text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Agreements</span>
          </button>
          <button
            onClick={() => {
              toast("Initiate MOU Draft", "New agreement workflow queued for Director & Legal clearance.", "info");
            }}
            className="btn-primary h-[35px] text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft New MOU</span>
          </button>
        </div>
      </div>

      {/* 90/60/30 Days Expiry Alert */}
      {expiringMous.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[12.5px] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-300">
                {expiringMous.length} Strategic MOUs Approaching Expiration Window (&lt; 90 Days)
              </span>
              <p className="text-amber-800 dark:text-amber-400 text-[12px] mt-0.5">
                {expiringMous.map((m) => `${m.partnerName} (${m.daysRemaining} days remaining)`).join(" • ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              toast("Renewal Sequence Initiated", "Formal extension requests generated for partner sign-off.", "success");
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs shrink-0 hover:bg-amber-700"
          >
            Initiate Renewals
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Active Strategic MOUs
          </span>
          <div className="text-[24px] font-bold text-slate-900 dark:text-white mt-1">
            {mous.length} Agreements
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            AIIMS, DRDO, Bosch, CTU Prague
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Consultancy Value
          </span>
          <div className="text-[24px] font-bold text-[#0066cc] dark:text-sky-400 mt-1">
            ₹2.15 Crore
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            3 Active Industrial Projects
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Incubated Startups
          </span>
          <div className="text-[24px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {startups.length} Deep-Tech
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ₹5.8 Crore Total Capital Raised
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Student IEDC Grants
          </span>
          <div className="text-[24px] font-bold text-purple-600 dark:text-purple-400 mt-1">
            {iedcProjects.length} Prototypes
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            1 Converted to Incubated Startup
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-1 text-[13px]">
        {[
          { id: "mous", label: `Active MOUs & Partners (${mous.length})`, icon: Handshake },
          { id: "consultancy", label: `Industrial Consultancy (${consultancies.length})`, icon: Briefcase },
          { id: "startups", label: `Incubated Startups (${startups.length})`, icon: Rocket },
          { id: "iedc", label: `IEDC Student Innovations (${iedcProjects.length})`, icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`h-[36px] px-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                active
                  ? "bg-[#edf2fe] dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 font-semibold shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-[#0066cc] dark:text-sky-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MOUS & PARTNER ORGANIZATIONS */}
      {activeTab === "mous" && (
        <div className="space-y-3">
          {mous.map((m) => {
            const isNearExpiry = m.daysRemaining <= 90;
            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0066cc]/40 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                      {m.mouNumber}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        m.alertLevel === "30 Days"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : m.alertLevel === "90 Days"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      ● {m.alertLevel === "Normal" ? "Valid" : `${m.alertLevel} Expiry Alert`}
                    </span>
                    <span className="text-[11.5px] text-slate-400">• {m.partnerType}</span>
                  </div>

                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                    {m.partnerName}
                  </h3>
                  <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {m.scope}
                  </p>

                  <div className="text-[12px] text-slate-500 pt-0.5 flex items-center gap-4 flex-wrap">
                    <span>Lead CIIRC Coordinator: <strong className="text-slate-800 dark:text-slate-200">{m.leadCoordinator}</strong></span>
                    <span>Active Period: {m.startDate} to {m.endDate}</span>
                    <span className={isNearExpiry ? "text-amber-600 dark:text-amber-400 font-bold" : "text-slate-400"}>
                      ({m.daysRemaining} days remaining)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      toast("Document Opened", `Displaying PDF agreement for ${m.partnerName}.`, "info");
                    }}
                    className="btn-secondary h-[33px] text-xs flex items-center gap-1.5"
                  >
                    <span>View Agreement</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CONSULTANCY PIPELINE */}
      {activeTab === "consultancy" && (
        <div className="space-y-3">
          {consultancies.map((con) => (
            <div
              key={con.id}
              className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {con.projectCode}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0066cc] dark:text-sky-300">
                    Stage: {con.stage}
                  </span>
                  <span className="text-[11.5px] text-slate-400">• Status: {con.status}</span>
                </div>

                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {con.title}
                </h3>
                <div className="text-[12px] text-slate-500">
                  Client: <strong className="text-slate-800 dark:text-slate-200">{con.clientOrganization}</strong> • CIIRC Lead PI: {con.piName}
                </div>
                <div className="text-[11.5px] text-slate-400">
                  Target Completion: {con.targetEndDate}
                </div>
              </div>

              <div className="text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">Total Contract Value</div>
                <div className="text-[18px] font-bold text-[#0066cc] dark:text-sky-400">
                  {formatCurrency(con.budgetINR)}
                </div>
                <span className="text-[10.5px] text-emerald-600 font-medium">Institutional Overhead 20%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INCUBATED STARTUPS */}
      {activeTab === "startups" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {startups.map((stu) => (
            <div
              key={stu.id}
              className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-4 hover:border-[#0066cc]/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600">
                    {stu.stage}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    TRL {stu.trl}
                  </span>
                </div>

                <h3 className="text-[16.5px] font-bold text-slate-900 dark:text-white">
                  {stu.name}
                </h3>

                <div className="text-[12px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Founders: <strong className="text-slate-800 dark:text-slate-200">{stu.founderNames.join(" • ")}</strong></div>
                  <div>Faculty Mentor: {stu.mentorFaculty}</div>
                  <div>Cohort: {stu.incubationCohort}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Funding Raised</span>
                  <span className="font-bold text-emerald-600 text-[13px]">{formatCurrency(stu.fundingRaisedINR)}</span>
                </div>
                {stu.iedcOriginated && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                    ★ IEDC Spin-Off
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: IEDC STUDENT INNOVATIONS */}
      {activeTab === "iedc" && (
        <div className="space-y-3">
          {iedcProjects.map((iedc) => (
            <div
              key={iedc.id}
              className="p-5 rounded-2xl ref-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0066cc] dark:text-sky-300">
                    {iedc.prototypeStatus}
                  </span>
                  <span className="text-[11.5px] text-slate-400">• Academic Year {iedc.academicYear}</span>
                  {iedc.convertedToStartup && (
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      ✓ Incubated Startup
                    </span>
                  )}
                </div>

                <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white">
                  {iedc.projectTitle}
                </h3>
                <div className="text-[12px] text-slate-500">
                  Lead Student: <strong className="text-slate-800 dark:text-slate-200">{iedc.studentLead}</strong> • Mentor: {iedc.facultyMentor} ({iedc.department})
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Grant Disbursed</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(iedc.grantAmountINR)}</span>
                </div>
                {!iedc.convertedToStartup && (
                  <button
                    onClick={() => handleConvertIEDC(iedc.id, iedc.projectTitle)}
                    className="btn-primary h-[33px] text-xs flex items-center gap-1.5"
                  >
                    <span>Convert to Startup</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
