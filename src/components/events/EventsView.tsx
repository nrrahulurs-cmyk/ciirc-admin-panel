"use client";

import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  Mic,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Ticket,
  Filter,
} from "lucide-react";
import { InstitutionalEvent } from "@/types";
import { eventsList } from "@/data/mockData";
import { useToast } from "../common/Toast";
import { logAuditEntry } from "@/lib/auditLogger";

interface EventsViewProps {
  onOpenQuickCreate: (type?: string) => void;
}

export function EventsView({ onOpenQuickCreate }: EventsViewProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<InstitutionalEvent[]>(eventsList);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const upcomingCount = events.filter((e) => e.status === "Upcoming").length;

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase()) ||
      ev.speakers.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "All" || ev.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Institutional Events & Symposia</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {upcomingCount} Upcoming
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Global conferences, guest distinguished lectures, student hackathons, and symposium venues.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickCreate("event")}
          className="btn-primary h-[35px]"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
          <span>Schedule Event</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl ref-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, venue, or keynote speaker..."
            className="w-full h-[35px] pl-8 pr-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Conference">Conference</option>
            <option value="Symposium">Symposium</option>
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Colloquium">Colloquium</option>
          </select>

          <span className="text-[12px] text-slate-400 font-medium px-1">
            {filtered.length} {filtered.length === 1 ? "event" : "events"}
          </span>
        </div>
      </div>

      {/* Events Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center ref-card rounded-2xl space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">
            No events match your search criteria
          </h3>
          <p className="text-[12px] text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
            }}
            className="btn-secondary h-[32px] text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((ev) => {
            const fillPercentage = Math.round((ev.registeredCount / ev.capacity) * 100);

            return (
              <div
                key={ev.id}
                className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {ev.category}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.85} />
                      <span>{ev.date}</span>
                    </span>
                  </div>

                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    {ev.title}
                  </h3>

                  <p className="text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ev.description}
                  </p>

                  <div className="space-y-1 text-[12px] text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.85} />
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
                      <span>Speakers: <strong className="font-semibold text-slate-800 dark:text-slate-200">{ev.speakers.join(" • ")}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Registration & Capacity Strip */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" strokeWidth={1.85} />
                      <span>Registration Fill</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ev.registeredCount} / {ev.capacity} Seats ({fillPercentage}%)
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        fillPercentage >= 90
                          ? "bg-rose-500"
                          : fillPercentage >= 75
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[12px]">
                  <button
                    onClick={() => {
                      toast("Badges & Certificates Ready", `Exporting credentials for ${ev.title}`, "info");
                    }}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
                  >
                    Download Attendee Roster
                  </button>
                  <button
                    onClick={() => {
                      logAuditEntry({
                        userId: "usr-admin",
                        userName: "Admin",
                        userRole: "Event Manager",
                        action: `Managed check-in desk for event: ${ev.title}`,
                        entityType: "InstitutionalEvent",
                        entityId: ev.id,
                        status: "Success",
                      });
                      toast("Registration Desk Open", "Direct check-in portal launched.", "success");
                    }}
                    className="font-semibold text-[#0066cc] dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Manage Desk</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
