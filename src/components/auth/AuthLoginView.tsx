"use client";

import React, { useState } from "react";
import {
  Shield,
  Lock,
  Mail,
  Key,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Fingerprint,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserAccount } from "@/types";
import { userAccountsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

interface AuthLoginViewProps {
  onLoginSuccess: (user: UserAccount) => void;
  isDark?: boolean;
}

export function AuthLoginView({ onLoginSuccess, isDark = false }: AuthLoginViewProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("admin@ciirc.edu.in");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authStep, setAuthStep] = useState<"credentials" | "2fa">("credentials");
  const [otpCode, setOtpCode] = useState(["4", "8", "1", "9", "2", "0"]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activePresetRole, setActivePresetRole] = useState("Super Admin");

  const demoRoles = [
    {
      role: "Super Admin",
      name: "Admin (Rahul Urs)",
      email: "admin@ciirc.edu.in",
      dept: "Directorate of Research Systems",
    },
    {
      role: "Research Director",
      name: "Prof. Rajesh Mehta",
      email: "rajesh.mehta@ciirc.edu.in",
      dept: "Biomechatronics & Neural Eng.",
    },
    {
      role: "Research Manager",
      name: "Dr. Arvind Sharma",
      email: "arvind.sharma@ciirc.edu.in",
      dept: "Cybernetics & Autonomous Systems",
    },
    {
      role: "Lab & Facilities Manager",
      name: "Dr. K. Ramanathan",
      email: "ramanathan.k@ciirc.edu.in",
      dept: "Materials & Cleanroom Infrastructure",
    },
  ];

  const handleSelectRolePreset = (r: typeof demoRoles[0]) => {
    setActivePresetRole(r.role);
    setEmail(r.email);
    setPassword("ciirc-research-2026");
    toast("Institutional Credentials Loaded", `Signed as ${r.name} (${r.role})`, "info");
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthStep("2fa");
      toast("Primary Credentials Verified", "2FA security token dispatched to registered device.", "info");
    }, 600);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      const matchedUser: UserAccount = userAccountsList.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || {
        id: "usr-custom",
        name: activePresetRole === "Super Admin" ? "Admin (Rahul Urs)" : activePresetRole,
        email: email,
        role: activePresetRole as any,
        department: "CIIRC Central Operations",
        status: "Active",
        lastActive: "Now",
        twoFactorEnabled: true,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      };

      toast("Authentication Successful", `Welcome to CIIRC Digital Operating System, ${matchedUser.name}.`, "success");
      onLoginSuccess(matchedUser);
    }, 500);
  };

  const handleQuickSSO = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const defaultAdmin = userAccountsList[0];
      toast("SAML SSO Authenticated", "Verified through CIIRC Institutional Federation.", "success");
      onLoginSuccess(defaultAdmin);
    }, 700);
  };

  return (
    <div className="min-h-screen w-screen ciirc-atmospheric-bg text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      {/* Centered Glass Container */}
      <div className="w-full max-w-[1020px] rounded-[24px] bg-white/95 dark:bg-[#0c1220]/95 backdrop-blur-xl border border-[rgba(50,90,160,0.12)] dark:border-slate-800/90 shadow-[0_16px_50px_rgba(30,60,120,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Side: Institutional Brand & Security Credentials (5 cols) */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-slate-50 via-[#edf4fe] to-[#e0edff] dark:from-slate-950 dark:via-[#0c152a] dark:to-[#081022] border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/ciirc-logo-transparent.png"
                alt="CIIRC"
                className="h-[34px] w-auto object-contain"
              />
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0066cc]/10 text-[#0066cc] dark:text-sky-300 border border-[#0066cc]/20">
                Operating System v2.6
              </span>
            </div>

            <div>
              <h1 className="text-[23px] font-bold text-slate-900 dark:text-white leading-tight tracking-[-0.02em]">
                Institutional Management & Research Console
              </h1>
              <p className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400 mt-2">
                Authoritative internal digital operating system for the Centre for Incubation, Innovation, Research and Consultancy (CIIRC).
              </p>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-[12px] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Shield className="w-4 h-4 text-[#0066cc] dark:text-sky-400" />
                <span>Restricted Access Clearance</span>
              </div>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-normal">
                Authorized institutional researchers, PIs, lab coordinators, and governance council members only. Sessions are cryptographically logged.
              </p>
            </div>

            {/* Quick Role Preset Switcher for Pair Reviewing */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Instant Institutional Role Switcher:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {demoRoles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleSelectRolePreset(r)}
                    className={`px-3 py-2 rounded-xl text-left text-[11.5px] transition-all flex items-center justify-between ${
                      activePresetRole === r.role
                        ? "bg-[#0066cc] text-white shadow-xs font-semibold"
                        : "bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="leading-tight">{r.role}</div>
                      <div className={`text-[10px] ${activePresetRole === r.role ? "text-blue-100" : "text-slate-400"}`}>
                        {r.name}
                      </div>
                    </div>
                    {activePresetRole === r.role && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>SAML 2.0 Federation</span>
            <span>TLS 1.3 End-to-End</span>
          </div>
        </div>

        {/* Right Side: Sign-In Form & 2FA Gateway (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          {authStep === "credentials" ? (
            <div className="max-w-md mx-auto w-full space-y-6">
              <div>
                <h2 className="text-[22px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                  Sign in to CIIRC OS
                </h2>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
                  Enter your registered institutional credentials to access the administrative console.
                </p>
              </div>

              {/* Single Sign-On Button */}
              <button
                type="button"
                onClick={handleQuickSSO}
                disabled={isAuthenticating}
                className="w-full h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0066cc] dark:hover:border-sky-400 bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-[13px] text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 transition-all shadow-2xs"
              >
                <Building2 className="w-4 h-4 text-[#0066cc] dark:text-sky-400" />
                <span>Sign in with Institutional SSO (SAML)</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-[#0c1220] px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Or password login
                </span>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@ciirc.edu.in"
                      className="w-full h-[40px] pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 dark:focus:ring-sky-400/30 text-[13px]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                      Master Password
                    </label>
                    <span className="text-[11px] text-[#0066cc] dark:text-sky-400 cursor-pointer hover:underline">
                      Forgot key?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[40px] pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 dark:focus:ring-sky-400/30 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#0066cc] focus:ring-[#0066cc]"
                    />
                    <span>Remember institutional session</span>
                  </label>
                  <span className="text-slate-400 text-[11.5px]">Clearance 30 days</span>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full h-[42px] rounded-xl btn-primary font-semibold text-[13px] flex items-center justify-center gap-2 shadow-sm mt-2"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating SAML Signature...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate & Proceed</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-md mx-auto w-full space-y-6 animate-in fade-in slide-in-from-right duration-200">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#0066cc]/10 text-[#0066cc] dark:text-sky-400 mx-auto flex items-center justify-center mb-3">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <h2 className="text-[22px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                  Two-Factor Verification
                </h2>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400">
                  Enter the 6-digit security token generated by your institutional authenticator app.
                </p>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-6">
                {/* 6-box OTP digits */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value;
                        const next = [...otpCode];
                        next[index] = val;
                        setOtpCode(next);
                      }}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-[20px] font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066cc] text-slate-900 dark:text-white"
                    />
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[12px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Hardware Key / YubiKey also accepted via USB-C touch.</span>
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full h-[42px] rounded-xl btn-primary font-semibold text-[13px] flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Confirming 2FA Payload...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Enter CIIRC OS</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthStep("credentials")}
                    className="w-full py-2 text-[12px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 font-medium"
                  >
                    ← Back to credentials
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
