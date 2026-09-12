"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  Settings,
  Sparkles,
} from "lucide-react";
import { ModuleId } from "@/types";
import { requiresAttentionItems } from "@/data/mockData";
import { useToast } from "../common/Toast";

interface TopBarProps {
  currentModule: ModuleId;
  onOpenCommandPalette: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onSelectModule: (module: ModuleId) => void;
  onReplayIntro?: () => void;
}

export function TopBar({
  currentModule,
  onOpenCommandPalette,
  isDark,
  onToggleTheme,
  onSelectModule,
  onReplayIntro,
}: TopBarProps) {
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns when module changes (e.g. sidebar navigation)
  useEffect(() => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [currentModule]);

  return (
    <header className="h-[54px] px-7 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70 select-none bg-transparent">
      {/* Left: Command Search Field matching exact 315px width & 36px height */}
      <div className="flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="w-[315px] h-[36px] rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 px-3 flex items-center gap-2 text-[12px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.85} />
          <span className="flex-1 truncate tracking-[-0.005em]">Search anything...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 rounded-md border border-slate-200/60 dark:border-slate-700/60">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Date, Notifications, Theme, Profile */}
      <div className="flex items-center gap-4 text-xs">
        {/* Date Display (Exact match: Mon, 15 Sep 2025) */}
        <span className="text-slate-500 dark:text-slate-400 text-[12px] font-medium tracking-[-0.005em] hidden sm:inline-block">
          Mon, 15 Sep 2025
        </span>

        {/* Notifications with badge matching reference */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="4 notifications require attention"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.85} />
            <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-[9.5px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              4
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-dropdown p-3.5 z-50 text-slate-900 dark:text-slate-100 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Requires Attention
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                  12
                </span>
              </div>
              <div className="mt-2 space-y-1.5 max-h-60 overflow-y-auto">
                {requiresAttentionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.targetModule as ModuleId);
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-xs"
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-[12px]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sliding Pill Theme Switcher matching reference */}
        <button
          onClick={onToggleTheme}
          className="relative w-[50px] h-[26px] rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 p-0.5 flex items-center transition-colors cursor-pointer"
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          <div
            className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all transform duration-200 ${
              isDark
                ? "translate-x-[24px] bg-amber-400 text-slate-900 shadow-xs"
                : "translate-x-0 bg-slate-900 text-white shadow-xs"
            }`}
          >
            {isDark ? (
              <Sun className="w-3 h-3 text-slate-900" strokeWidth={2.2} />
            ) : (
              <Moon className="w-2.5 h-2.5 text-white" strokeWidth={2.2} />
            )}
          </div>
        </button>

        {/* Profile Avatar button */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-7 h-7 rounded-full bg-slate-200/90 dark:bg-slate-700 flex items-center justify-center text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:ring-2 hover:ring-blue-500/30 transition-all"
          >
            A
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-dropdown p-2 z-50 text-slate-900 dark:text-slate-100 text-xs animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-xs">Admin</div>
                <div className="text-[10px] text-slate-400">admin@ciirc.edu.in</div>
              </div>
              <button
                onClick={() => {
                  onSelectModule("users-rbac");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left mt-1 text-[12px]"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Role & Security</span>
              </button>
              <button
                onClick={() => {
                  onSelectModule("system-settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-[12px]"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings</span>
              </button>
              {onReplayIntro && (
                <button
                  onClick={() => {
                    onReplayIntro();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/40 text-left text-[12px] text-sky-600 dark:text-sky-400 font-medium border-t border-slate-100 dark:border-slate-800 mt-1 pt-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Replay Intro Experience</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

