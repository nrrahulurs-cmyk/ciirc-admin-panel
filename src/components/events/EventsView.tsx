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
} from "lucide-react";
import { InstitutionalEvent } from "@/types";
import { eventsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

interface EventsViewProps {
  onOpenQuickCreate: (type?: string) => void;
}

export function EventsView({ onOpenQuickCreate }: EventsViewProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<InstitutionalEvent[]>(eventsList);
  const [search, setSearch] = useState("");

  const filtered = events.filter((ev) =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Institutional Events & Symposia</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              6 Upcoming
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

      {/* Events Grid */}
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
    </div>
  );
}
