"use client";

import React, { useState } from "react";
import {
  X,
  Globe,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Calendar,
  MapPin,
  Mail,
  Award,
} from "lucide-react";
import { useToast } from "../common/Toast";

interface PublicPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType?: "researcher" | "domain" | "project" | "facility";
  entityData?: any;
}

export function PublicPreviewModal({
  isOpen,
  onClose,
  entityType = "researcher",
  entityData,
}: PublicPreviewModalProps) {
  const { toast } = useToast();
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col h-[90vh] overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header Preview Bar */}
        <div className="p-4 px-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14px] text-slate-900 dark:text-white">
                  Public Website Preview Simulator
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  ciirc.edu.in Live Renderer
                </span>
              </div>
              <p className="text-[11.5px] text-slate-400">
                Demonstrates headless frontend syndication with internal sensitive fields stripped out.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Device Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setDeviceView("desktop")}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                  deviceView === "desktop"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceView("mobile")}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                  deviceView === "mobile"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Public Website Frame Simulation */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950/80 p-4 sm:p-6 flex justify-center items-start">
          <div
            className={`transition-all duration-300 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${
              deviceView === "mobile" ? "w-[390px] min-h-[600px]" : "w-full max-w-3xl"
            }`}
          >
            {/* Simulated Public Nav */}
            <div className="h-12 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <img
                  src="/ciirc-logo-transparent.png"
                  alt="CIIRC"
                  className="h-5 w-auto object-contain"
                />
                <span className="font-mono text-[10px] text-slate-400">ciirc.edu.in</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                <span>Research</span>
                <span>Faculty</span>
                <span>Facilities</span>
                <span>Admissions</span>
              </div>
            </div>

            {/* Public Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {entityType === "researcher" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <img
                      src={entityData?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                      alt="Faculty"
                      className="w-24 h-24 rounded-2xl object-cover ring-2 ring-slate-100 shadow-md"
                    />
                    <div className="space-y-1 flex-1">
                      <h1 className="text-[24px] font-extrabold text-slate-900 tracking-[-0.02em]">
                        {entityData?.name || "Dr. Arvind Sharma"}
                      </h1>
                      <div className="text-[13px] text-[#0066cc] font-semibold">
                        {entityData?.title || "Associate Professor & Lead Scientist"}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        {entityData?.department || "Cybernetics & Autonomous Systems"}
                      </div>
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {["Multi-Agent Swarms", "GPS-Denied SLAM", "Autonomous Inspection"].map((a) => (
                          <span key={a} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                      Academic Biography
                    </h3>
                    <p className="text-[13px] text-slate-700 leading-relaxed">
                      {entityData?.biography || "Pioneering research in cooperative decentralized SLAM and multi-robot autonomous exploration under GPS-denied environments. Supervises state-of-the-art national research consortia sponsored by DRDO and DST."}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Publications</span>
                      <div className="text-[18px] font-bold text-slate-900">42</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Citations</span>
                      <div className="text-[18px] font-bold text-[#0066cc]">890+</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">h-Index</span>
                      <div className="text-[18px] font-bold text-slate-900">18</div>
                    </div>
                  </div>
                </div>
              )}

              {entityType === "domain" && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0066cc]/10 text-[#0066cc]">
                      Research Vista
                    </span>
                    <h1 className="text-[26px] font-extrabold text-slate-900 mt-2">
                      Autonomous Systems & Cybernetics
                    </h1>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed mt-2">
                      Decentralized swarms, subterranean GPS-denied navigation, adaptive field rovers and aerial micro-drones designed for degraded environmental exploration.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-[11px] font-bold text-slate-500">Sponsored Grants</span>
                      <div className="text-[18px] font-bold text-[#0066cc]">₹5.85 Crore</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-[11px] font-bold text-slate-500">Faculty Researchers</span>
                      <div className="text-[18px] font-bold text-slate-900">14 Members</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Public Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 text-center">
              © 2026 Centre for Intelligent and Interactive Robotics and Cybernetics (CIIRC). All rights reserved.
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 px-6 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Certified Safe for Public Syndication (Internal financial data and private notes excluded)</span>
          </div>
          <button
            onClick={() => {
              toast("Public Link Generated", "Preview URL: https://ciirc.edu.in/preview/preview-dossier-01", "success");
            }}
            className="btn-primary h-[34px] text-xs flex items-center gap-1.5"
          >
            <span>Generate Shareable Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
