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
} from "lucide-react";
import { useToast } from "../common/Toast";

export function ContentCMSView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pages" | "editor">("pages");

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

  const handleSaveDraft = () => {
    toast("Draft Saved", "Auto-saved revision to institutional CMS vault.", "success");
  };

  const handlePublish = () => {
    setWorkflowStatus("Published");
    toast("Content Published", "Page is now live on https://ciirc.edu.in", "success");
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Content Management (CMS)</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              Institutional Web
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Author, review, schedule and publish scientific content with SEO simulation & workflow gating.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[12px]">
            <button
              onClick={() => setActiveTab("pages")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "pages"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All Pages
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "editor"
                  ? "bg-white dark:bg-slate-700 text-[#0066cc] dark:text-sky-400 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Rich Editor
            </button>
          </div>
        </div>
      </div>

      {activeTab === "pages" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2.5 p-3 rounded-2xl ref-card">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
              <input
                type="text"
                placeholder="Filter pages..."
                className="w-full h-[35px] pl-8 pr-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
            <button
              onClick={() => setActiveTab("editor")}
              className="btn-primary h-[35px]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
              <span>Create New Page</span>
            </button>
          </div>

          <div className="rounded-2xl ref-card overflow-hidden">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Page Title & Path</th>
                  <th className="py-3.5 px-3">Author</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Traffic</th>
                  <th className="py-3.5 px-3">Updated</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {pages.map((pg) => (
                  <tr key={pg.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-[13px]">
                        {pg.title}
                      </div>
                      <div className="text-[11.5px] text-slate-400 font-mono mt-0.5">
                        {pg.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{pg.author}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          pg.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : pg.status === "Review"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                        }`}
                      >
                        {pg.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {pg.views}
                    </td>
                    <td className="py-3.5 px-3 text-[11.5px] text-slate-400 font-mono">
                      {pg.lastUpdated}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditorTitle(pg.title);
                          setEditorSlug(pg.slug);
                          setActiveTab("editor");
                        }}
                        className="btn-secondary h-[28px] px-2.5 text-[11.5px]"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Rich Text & SEO Editor Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Editing Area (8 cols) */}
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
                  className="w-full h-[38px] px-3 text-[13px] font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Permalink Slug
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-[12px]">
                  <span className="text-slate-400">ciirc.edu.in/</span>
                  <input
                    type="text"
                    value={editorSlug}
                    onChange={(e) => setEditorSlug(e.target.value)}
                    className="flex-1 py-2 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <button
                  type="button"
                  onClick={() => toast("Format applied", "Bold text tag added.", "info")}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toast("Format applied", "Italic text tag added.", "info")}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toast("Insert Link", "Link prompt ready.", "info")}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toast("Embed Media", "Asset library modal triggered.", "info")}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Image className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toast("Code block formatted", "Monospace tag attached.", "info")}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toast("Bullet List", "List indented.", "info")}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Content Body */}
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

          {/* Sidebar & SEO Simulation (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Publishing Controls */}
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

            {/* Google SERP Search Snippet Preview */}
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
    </div>
  );
}
