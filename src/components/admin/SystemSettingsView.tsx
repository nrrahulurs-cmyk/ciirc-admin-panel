"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  Shield,
  Bell,
  Database,
  Cloud,
  Mail,
  CheckCircle2,
  FileText,
  Download,
  Search,
  Filter,
  ExternalLink,
  BookOpen,
  Calendar,
  Building,
  Info,
  X,
  FileCheck,
} from "lucide-react";
import { useToast } from "../common/Toast";
import { institutionalPoliciesList } from "@/data/mockData";
import { InstitutionalPolicy } from "@/types";
import { logAuditEntry } from "@/lib/auditLogger";

export function SystemSettingsView() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"infrastructure" | "policies">("infrastructure");

  // Infrastructure form state
  const [siteName, setSiteName] = useState(
    "CIIRC - Centre for Incubation, Innovation, Research and Consultancy"
  );
  const [adminEmail, setAdminEmail] = useState("director.office@ciirc.jyothyit.ac.in");
  const [smtpServer, setSmtpServer] = useState("smtp.resend.com");
  const [s3Bucket, setS3Bucket] = useState("ciirc-digital-assets-prod");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [require2FA, setRequire2FA] = useState(true);

  // Policy Vault state
  const [policySearch, setPolicySearch] = useState("");
  const [policyCategoryFilter, setPolicyCategoryFilter] = useState("all");
  const [selectedPolicyModal, setSelectedPolicyModal] = useState<InstitutionalPolicy | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logAuditEntry({
      userId: "usr-admin-01",
      userName: "Rahul Urs (Super Admin)",
      userRole: "Super Admin",
      action: "UPDATE_SYSTEM_SETTINGS",
      entityType: "SystemConfiguration",
      entityId: "sys-config-01",
      newValue: {
        siteName,
        adminEmail,
        smtpServer,
        s3Bucket,
        require2FA,
      },
      status: "Success",
    });
    toast("System Configuration Saved", "All environment and security parameters synchronized.", "success");
  };

  const handleDownloadPolicy = (policy: InstitutionalPolicy) => {
    logAuditEntry({
      userId: "usr-admin-01",
      userName: "Rahul Urs (Super Admin)",
      userRole: "Super Admin",
      action: `EXPORT_POLICY: ${policy.policyCode}`,
      entityType: "InstitutionalPolicy",
      entityId: policy.id,
      newValue: {
        policyCode: policy.policyCode,
        version: policy.version,
        title: policy.title,
      },
      status: "Success",
    });
    toast("Policy Document Exported", `Downloading signed statutory PDF for ${policy.policyCode}`, "success");
  };

  const policyCategories = [
    "all",
    "Intellectual Property",
    "Consultancy & Revenue Share",
    "SIF Usage & Surcharges",
    "Data Retention & Compliance",
    "Academic Integrity & Ethics",
  ];

  const filteredPolicies = institutionalPoliciesList.filter((p) => {
    const matchesCategory =
      policyCategoryFilter === "all" || p.category === policyCategoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.policyCode.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.summary.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.authorizingBody.toLowerCase().includes(policySearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>System Configuration & Policy Vault</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              CIIRC Production v2.6
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Global institutional identity, storage endpoints, email dispatch, and official statutory regulatory charters.
          </p>
        </div>

        {activeTab === "infrastructure" && (
          <button
            onClick={handleSave}
            className="btn-primary h-[35px]"
          >
            <Save className="w-3.5 h-3.5" strokeWidth={1.85} />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("infrastructure")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-colors ${
            activeTab === "infrastructure"
              ? "bg-[#0066cc] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Settings className="w-4 h-4" strokeWidth={1.85} />
          <span>Infrastructure & Parameters</span>
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-colors ${
            activeTab === "policies"
              ? "bg-[#0066cc] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" strokeWidth={1.85} />
          <span>Institutional Policy Vault</span>
          <span className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === "policies"
              ? "bg-white/20 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          }`}>
            {institutionalPoliciesList.length}
          </span>
        </button>
      </div>

      {/* Infrastructure Tab Content */}
      {activeTab === "infrastructure" && (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Institutional Identity */}
          <div className="p-5 rounded-2xl ref-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <Settings className="w-4 h-4 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
              <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">
                Institutional Profile
              </h3>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Official Entity Title
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full h-[36px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-[12.5px]"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Directorate Dispatch Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full h-[36px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-[12.5px]"
                />
              </div>
            </div>
          </div>

          {/* Security & Authentication */}
          <div className="p-5 rounded-2xl ref-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <Shield className="w-4 h-4 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
              <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">
                Security Governance
              </h3>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Session Inactivity Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full h-[36px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-[12.5px]"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px]">
                    Enforce Mandatory 2FA for Faculty & Staff
                  </div>
                  <div className="text-[11.5px] text-slate-400 mt-0.5">
                    Require hardware or TOTP authenticator app upon sign-in
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={require2FA}
                  onChange={(e) => setRequire2FA(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0066cc] focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Storage Endpoints */}
          <div className="p-5 rounded-2xl ref-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <Cloud className="w-4 h-4 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
              <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">
                Cloud Storage & Media Bucket
              </h3>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  S3 / Cloudflare R2 Bucket Identifier
                </label>
                <input
                  type="text"
                  value={s3Bucket}
                  onChange={(e) => setS3Bucket(e.target.value)}
                  className="w-full h-[36px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* SMTP & Email Dispatch */}
          <div className="p-5 rounded-2xl ref-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <Mail className="w-4 h-4 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
              <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">
                Notification Relay (SMTP / Resend)
              </h3>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  SMTP Host Relay
                </label>
                <input
                  type="text"
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  className="w-full h-[36px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Institutional Policy Vault Tab Content */}
      {activeTab === "policies" && (
        <div className="space-y-4">
          {/* Controls: Search and Categories */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 rounded-2xl ref-card">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search policy code, title, keywords..."
                value={policySearch}
                onChange={(e) => setPolicySearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {policyCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPolicyCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize text-[11.5px] transition-colors ${
                    policyCategoryFilter === cat
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat === "all" ? "All Charters" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Policy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className="p-5 rounded-2xl ref-card flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#0066cc] dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/40">
                        {policy.policyCode}
                      </span>
                      <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {policy.version}
                      </span>
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {policy.status}
                      </span>
                    </div>
                    <span className="text-[10.5px] font-medium text-slate-400 whitespace-nowrap">
                      Reviewed: {policy.reviewDate}
                    </span>
                  </div>

                  <h3 className="text-[14.5px] font-bold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-[#0066cc] dark:group-hover:text-sky-400 transition-colors">
                    {policy.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11.5px] text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {policy.authorizingBody}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Effective: {policy.effectiveDate}
                    </span>
                  </div>

                  <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-850/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-4">
                    {policy.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                  <button
                    onClick={() => setSelectedPolicyModal(policy)}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0066cc] dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Regulatory Clauses</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPolicy(policy)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download Signed PDF</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredPolicies.length === 0 && (
              <div className="col-span-full p-12 text-center rounded-2xl ref-card">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                <h4 className="text-[14px] font-semibold text-slate-700 dark:text-slate-300">
                  No statutory policies match your criteria
                </h4>
                <p className="text-[12px] text-slate-400 mt-1">
                  Try clearing the category filter or search query.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Policy Details Modal */}
      {selectedPolicyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0066cc] dark:text-sky-300">
                    {selectedPolicyModal.policyCode}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedPolicyModal.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedPolicyModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPolicyModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-[11.5px]">
                <div>
                  <div className="text-slate-400">Category</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPolicyModal.category}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Version</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPolicyModal.version}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Authorizing Body</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPolicyModal.authorizingBody}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Next Review</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedPolicyModal.reviewDate}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#0066cc]" />
                  Executive Summary & Purpose
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-xl">
                  {selectedPolicyModal.summary}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                  Statutory Provisions & Enforceability
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5">
                  <li>
                    Mandatory adherence by all faculty members, principal investigators, visiting researchers, and graduate scholars across CIIRC research divisions.
                  </li>
                  <li>
                    Annual compliance audits performed by the Internal Quality Assurance Cell (IQAC) and reported to the Board of Governors.
                  </li>
                  <li>
                    Violations or non-compliances are referred to the Standing Institutional Ethics and Disciplinary Committee for formal adjudication.
                  </li>
                  <li>
                    Any modifications require a two-thirds majority vote by the {selectedPolicyModal.authorizingBody} followed by official gazetted notification.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Official certified electronic copies must bear the cryptographically signed seal of the Directorate before transmission to external grant agencies or legal counsel.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedPolicyModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700"
              >
                Close
              </button>

              <button
                onClick={() => {
                  handleDownloadPolicy(selectedPolicyModal);
                  setSelectedPolicyModal(null);
                }}
                className="btn-primary h-9 px-4 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed Statutory PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

