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
} from "lucide-react";
import { useToast } from "../common/Toast";

export function SystemSettingsView() {
  const { toast } = useToast();

  const [siteName, setSiteName] = useState(
    "CIIRC - Centre for Intelligent and Interactive Robotics and Cybernetics"
  );
  const [adminEmail, setAdminEmail] = useState("director.office@ciirc.edu.in");
  const [smtpServer, setSmtpServer] = useState("smtp.resend.com");
  const [s3Bucket, setS3Bucket] = useState("ciirc-digital-assets-prod");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [require2FA, setRequire2FA] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast("System Configuration Saved", "All environment and security parameters synchronized.", "success");
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>System Configuration & Infrastructure</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              CIIRC Production v2.6
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Global institutional identity, storage endpoints, email dispatch, and cryptographic policy settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary h-[35px]"
        >
          <Save className="w-3.5 h-3.5" strokeWidth={1.85} />
          <span>Save Changes</span>
        </button>
      </div>

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
    </div>
  );
}
