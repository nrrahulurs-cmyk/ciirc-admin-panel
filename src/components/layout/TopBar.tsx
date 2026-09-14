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
  CheckCheck,
  Check,
  Filter,
} from "lucide-react";
import { ModuleId, UserAccount, NotificationItem } from "@/types";
import { notificationsList } from "@/data/mockData";
import { useToast } from "../common/Toast";
import { LogOut } from "lucide-react";

interface TopBarProps {
  currentModule: ModuleId;
  onOpenCommandPalette: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onSelectModule: (module: ModuleId) => void;
  onReplayIntro?: () => void;
  currentUser?: UserAccount;
  onLogout?: () => void;
}

export function TopBar({
  currentModule,
  onOpenCommandPalette,
  isDark,
  onToggleTheme,
  onSelectModule,
  onReplayIntro,
  currentUser,
  onLogout,
}: TopBarProps) {
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsList);
  const [notifCategoryFilter, setNotifCategoryFilter] = useState<string>("all");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("Notifications Cleared", "All alerts marked as read", "info");
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    if (item.linkedModule) {
      onSelectModule(item.linkedModule as ModuleId);
    }
  };

  const handleToggleRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (notifCategoryFilter === "all") return true;
    return item.category.toLowerCase() === notifCategoryFilter.toLowerCase();
  });

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

        {/* Notifications with interactive popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={`${unreadCount} notifications require attention`}
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.85} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-[9.5px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl glass-dropdown p-3.5 z-50 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-in fade-in-50 zoom-in-95">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Action & Governance Alerts
                  </span>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                      {unreadCount} unread
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      All caught up
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-medium text-[#0066cc] dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Category Filter Badges */}
              <div className="flex items-center gap-1 py-2 overflow-x-auto border-b border-slate-100/70 dark:border-slate-800/60 scrollbar-none">
                {["all", "mou", "calibration", "grant", "ipr", "ethics"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNotifCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded-lg text-[10.5px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                      notifCategoryFilter === cat
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="mt-2 space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                {filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors text-xs border relative group ${
                      !item.read
                        ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            item.urgency === "urgent"
                              ? "bg-rose-500"
                              : item.urgency === "warning"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.category}
                        </span>
                        {!item.read && (
                          <span className="text-[9px] font-semibold text-blue-600 dark:text-sky-400">
                            • NEW
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">
                          {item.timestamp}
                        </span>
                        <button
                          onClick={(e) => handleToggleRead(e, item.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-opacity"
                          title={item.read ? "Mark unread" : "Mark read"}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-[12px] mt-1 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {item.message}
                    </div>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No alerts in this category
                  </div>
                )}
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
            className="w-7 h-7 rounded-full bg-[#0066cc] text-white flex items-center justify-center text-[11px] font-bold hover:ring-2 hover:ring-blue-500/30 transition-all shadow-2xs"
          >
            {currentUser?.name ? currentUser.name[0] : "A"}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-dropdown p-2 z-50 text-slate-900 dark:text-slate-100 text-xs animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-xs text-slate-900 dark:text-white">
                  {currentUser?.name || "Admin (Rahul Urs)"}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || "admin@ciirc.edu.in"}
                </div>
                <span className="inline-block mt-1 text-[9.5px] font-semibold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-[#0066cc] dark:text-sky-300">
                  {currentUser?.role || "Super Admin"}
                </span>
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
              {onLogout && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left text-[12px] text-rose-600 dark:text-rose-400 font-medium border-t border-slate-100 dark:border-slate-800 mt-1 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Console / Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

