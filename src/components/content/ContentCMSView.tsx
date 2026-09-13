"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Globe,
  Eye,
  Edit3,
  Calendar,
  Sparkles,
  Bold,
  Italic,
  Link2,
  Image,
  Code,
  List,
  Save,
  ArrowRight,
  History,
  ShieldCheck,
  Terminal,
  Copy,
  ExternalLink,
} from "lucide-react";
import { PublicPreviewModal } from "./PublicPreviewModal";
import { useToast } from "../common/Toast";

export function ContentCMSView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pages" | "editor" | "readiness" | "api-explorer">("pages");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Mock Pages
  const [pages, setPages] = useState([
    {
      id: "pg-01",
      title: "Centre for Intelligent Robotics: Overview & Mission",
      slug: "/about/mission",
      author: "Admin (Rahul Urs)",
      status: "Published",
      lastUpdated: "2026-09-08",
      views: "14.2k",
    },
    {
      id: "pg-02",
      title: "Sponsored Research & Strategic Technology Clearances",
      slug: "/research/sponsored-grants",
      author: "Dr. Arvind Sharma",
      status: "Review",
      lastUpdated: "2026-09-10",
      views: "3.8k",
    },
    {
      id: "pg-03",
      title: "Admissions & Doctoral Fellowships in Cybernetics 2026-27",
      slug: "/admissions/phd-fellowships",
      author: "Meera Krishnan",
      status: "Scheduled",
      lastUpdated: "2026-09-11",
      views: "-",
    },
    {
      id: "pg-04",
      title: "Biomechatronics & High-Density Neural Prosthetics Lab",
      slug: "/labs/biomechatronics",
      author: "Prof. Rajesh Mehta",
      status: "Published",
      lastUpdated: "2026-09-01",
      views: "22.5k",
    },
  ]);

  // Editor states
  const [editorTitle, setEditorTitle] = useState(
    "Breakthrough in Bipedal Exoskeleton Neuromotor Rehabilitation"
  );
  const [editorSlug, setEditorSlug] = useState("news/bipedal-exoskeleton-trials-2026");
  const [editorContent, setEditorContent] = useState(
    `CIIRC researchers in collaboration with AIIMS have demonstrated complete phase-2 gait restoration in post-stroke rehabilitation trials using the newly patented adaptive-impedance exoskeleton system.

Key highlights:
• Decodes multi-channel surface EMG at 200 Hz with sub-5ms control loop latency.
• Compliant micro-fluidic actuators provide natural joint compliance.
• Clinical evaluations verified 42% faster motor recovery in early cohort patients.`
  );
  const [metaTitle, setMetaTitle] = useState(
    "CIIRC Breakthrough: Bipedal Exoskeleton Neuromotor Rehabilitation"
  );
  const [metaDesc, setMetaDesc] = useState(
    "Official announcement: CIIRC's advanced powered exoskeleton completes successful clinical rehabilitation trials at AIIMS."
  );
  const [workflowStatus, setWorkflowStatus] = useState<"Draft" | "Review" | "Approved" | "Scheduled" | "Published">("Review");

  // API Explorer states
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<"/api/v1/public/researchers" | "/api/v1/public/domains" | "/api/v1/public/projects">("/api/v1/public/researchers");

  const apiResponses: Record<string, any> = {
    "/api/v1/public/researchers": {
      status: 200,
      timestamp: "2026-09-13T08:50:00Z",
      pagination: { total: 84, page: 1, pageSize: 10 },
      data: [
        {
          id: "res-01",
          name: "Prof. Rajesh Mehta",
          title: "Senior Professor & Lab Director",
          department: "Biomechatronics & Neural Engineering",
          researchAreas: ["Humanoid Robotics & Prosthetics", "Bio-Mechanical CAD"],
          hIndex: 26,
          citations: 1420,
          publicProfileUrl: "https://ciirc.edu.in/faculty/rajesh-mehta",
          publicVisibility: true,
          // Internal budgets & private notes are strictly excluded
        },
        {
          id: "res-02",
          name: "Dr. Arvind Sharma",
          title: "Associate Professor & Lead Scientist",
          department: "Cybernetics & Autonomous Systems",
          researchAreas: ["Multi-Agent Swarms", "GPS-Denied SLAM"],
          hIndex: 18,
          citations: 890,
          publicProfileUrl: "https://ciirc.edu.in/faculty/arvind-sharma",
          publicVisibility: true,
        },
      ],
    },
    "/api/v1/public/domains": {
      status: 200,
      timestamp: "2026-09-13T08:50:00Z",
      data: [
        {
          code: "VISTA-ROB",
          slug: "autonomous-systems-cybernetics",
          name: "Autonomous Systems & Cybernetics",
          focusAreas: ["Multi-Agent Swarms", "GPS-Denied SLAM", "Field Robotics"],
          activeProjectsCount: 14,
          publicationsCount: 68,
        },
        {
          code: "VISTA-BIO",
          slug: "biomechatronics-neural-engineering",
          name: "Biomechatronics & Neural Engineering",
          focusAreas: ["Powered Exoskeletons", "Surface EMG Neural Decoding"],
          activeProjectsCount: 9,
          publicationsCount: 54,
        },
      ],
    },
    "/api/v1/public/projects": {
      status: 200,
      timestamp: "2026-09-13T08:50:00Z",
      data: [
        {
          code: "CIIRC-BIO-2025-08",
          title: "Autonomous Bi-Pedal Exoskeleton for Neuromotor Rehabilitation",
          pi: "Prof. Rajesh Mehta",
          department: "Biomechatronics & Neural Engineering",
          fundingAgency: "DST & ICMR",
          status: "Active",
          progress: 64,
          publicVisibility: true,
          // confidential grant financial allocation removed
        },
      ],
    },
  };

  const handleSaveDraft = () => {
    toast("Draft Saved", "Auto-saved revision to institutional CMS vault.", "success");
  };

  const handlePublish = () => {
    setWorkflowStatus("Published");
    toast("Content Published", "Page is now live on https://ciirc.edu.in", "success");
  };

  const handleTriggerPreview = () => {
    setPreviewData({
      name: "Dr. Arvind Sharma",
      title: "Associate Professor & Lead Scientist",
      department: "Cybernetics & Autonomous Systems",
      biography: "Pioneering research in cooperative decentralized SLAM and multi-robot autonomous exploration under GPS-denied environments.",
    });
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Public Website CMS & Headless Engine</span>
            <span className="text-[11.5px] font-medium px-2.5 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              Source of Truth
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Authoritative institutional publishing hub, website readiness scorecard, and public headless API endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerPreview}
            className="btn-secondary h-[35px] text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#0066cc]" />
            <span>Preview as Public</span>
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className="btn-primary h-[35px] text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>New Page / Article</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-1 text-[13px]">
        {[
          { id: "pages", label: "Page Registry & Sections", icon: FileText },
          { id: "editor", label: "Live Editor & SEO Publisher", icon: Edit3 },
          { id: "readiness", label: "Website Readiness Index", icon: ShieldCheck },
          { id: "api-explorer", label: "Headless Public API Explorer", icon: Terminal },
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

      {/* TAB 1: PAGES REGISTRY */}
      {activeTab === "pages" && (
        <div className="space-y-3">
          {pages.map((pg) => (
            <div
              key={pg.id}
              className="p-5 rounded-2xl ref-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${
                      pg.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : pg.status === "Scheduled"
                        ? "bg-blue-500/10 text-[#0066cc] border-blue-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    {pg.status}
                  </span>
                  <span className="font-mono text-[11.5px] text-slate-400">{pg.slug}</span>
                </div>
                <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white">
                  {pg.title}
                </h3>
                <div className="text-[12px] text-slate-500">
                  Author: {pg.author} • Updated: {pg.lastUpdated} • Total Views: {pg.views}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditorTitle(pg.title);
                    setEditorSlug(pg.slug.replace("/", ""));
                    setActiveTab("editor");
                  }}
                  className="btn-secondary h-[33px] text-xs flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit in CMS</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LIVE EDITOR & PUBLISHER */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl ref-card space-y-4">
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article / Page Headline
                </label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="w-full h-[40px] px-3.5 text-[14px] font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug & Canonical Path
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 overflow-hidden">
                  <span className="text-slate-400 text-xs font-mono select-none">https://ciirc.edu.in/</span>
                  <input
                    type="text"
                    value={editorSlug}
                    onChange={(e) => setEditorSlug(e.target.value)}
                    className="flex-1 h-[36px] bg-transparent text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none pl-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article Body (Markdown / Rich Text)
                </label>
                <textarea
                  rows={10}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full p-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl ref-card space-y-3 text-[12px]">
              <div className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[13px]">
                <span>Publishing & Workflow</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {workflowStatus}
                </span>
              </div>

              <div>
                <label className="block text-[11.5px] text-slate-500 mb-1 font-medium">Assigned Stage</label>
                <select
                  value={workflowStatus}
                  onChange={(e) => setWorkflowStatus(e.target.value as any)}
                  className="w-full h-[35px] px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] font-medium focus:outline-none"
                >
                  <option>Draft</option>
                  <option>Review</option>
                  <option>Approved</option>
                  <option>Scheduled</option>
                  <option>Published</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="btn-secondary h-[35px] flex-1 text-[12px]"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="btn-primary h-[35px] flex-1 text-[12px]"
                >
                  Publish Live
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl ref-card space-y-3 text-[12px]">
              <div className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 text-[13px]">
                <Globe className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" />
                <span>Search Engine Preview (SERP)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  https://ciirc.edu.in › {editorSlug}
                </div>
                <div className="text-[13px] font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
                  {metaTitle}
                </div>
                <div className="text-[12px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {metaDesc}
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] text-slate-500 mb-1 font-medium">SEO Title Tag</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full h-[35px] px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11.5px] text-slate-500 mb-1 font-medium">Meta Description</label>
                <textarea
                  rows={2}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBSITE READINESS SCORECARD */}
      {activeTab === "readiness" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] text-slate-400">Researcher Profiles Ready</span>
              <div className="text-[22px] font-bold text-slate-900 dark:text-white mt-1">92%</div>
              <span className="text-[10.5px] text-emerald-600">82 of 84 verified bios</span>
            </div>
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] text-slate-400">Research Domains (Vistas)</span>
              <div className="text-[22px] font-bold text-[#0066cc] dark:text-sky-400 mt-1">100%</div>
              <span className="text-[10.5px] text-emerald-600">5 of 5 full dossiers</span>
            </div>
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] text-slate-400">Projects Public Clearance</span>
              <div className="text-[22px] font-bold text-slate-900 dark:text-white mt-1">84%</div>
              <span className="text-[10.5px] text-slate-400">31 of 37 cleared for web</span>
            </div>
            <div className="p-4 rounded-xl ref-card">
              <span className="text-[11px] text-slate-400">Scholarly DOIs Verified</span>
              <div className="text-[22px] font-bold text-emerald-600 mt-1">96%</div>
              <span className="text-[10.5px] text-emerald-600">205 of 214 matched</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl ref-card space-y-3">
            <h3 className="font-bold text-[15px] text-slate-900 dark:text-white">
              Institutional Website Readiness Checklist
            </h3>
            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">All 5 Core Research Domains Have Certified Descriptions & Hero Assets</span>
                </div>
                <span className="text-emerald-600 font-semibold text-xs">Ready</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Sanitized Headless Public API Endpoints Exclude Internal Financials</span>
                </div>
                <span className="text-emerald-600 font-semibold text-xs">Certified</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">2 Incomplete Faculty Biographies Awaiting Academic Office Upload</span>
                </div>
                <span className="text-amber-600 font-semibold text-xs">2 Pending</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HEADLESS PUBLIC API EXPLORER */}
      {activeTab === "api-explorer" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-emerald-500/20 text-emerald-400">
                GET
              </span>
              <span className="font-mono text-[13px] text-slate-200">
                https://ciirc.edu.in{selectedApiEndpoint}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedApiEndpoint}
                onChange={(e) => setSelectedApiEndpoint(e.target.value as any)}
                className="h-[32px] px-3 text-xs font-mono rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none"
              >
                <option value="/api/v1/public/researchers">/api/v1/public/researchers</option>
                <option value="/api/v1/public/domains">/api/v1/public/domains</option>
                <option value="/api/v1/public/projects">/api/v1/public/projects</option>
              </select>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(apiResponses[selectedApiEndpoint], null, 2));
                  toast("JSON Copied", "Public API payload copied to clipboard.", "success");
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy JSON Response"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[12px] overflow-x-auto border border-slate-800 max-h-[440px]">
            <pre className="leading-relaxed">
              {JSON.stringify(apiResponses[selectedApiEndpoint], null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Public Preview Modal */}
      <PublicPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        entityType="researcher"
        entityData={previewData}
      />
    </div>
  );
}
