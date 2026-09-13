"use client";

import React, { useState } from "react";
import {
  Building,
  Cpu,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Download,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  DollarSign,
  Activity,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { Facility, Equipment, ServiceCatalogueItem } from "@/types";
import { facilitiesList, equipmentList, serviceCatalogueList } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "../common/Toast";

export function FacilitiesView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"facilities" | "equipment" | "services">("equipment");
  const [facilities, setFacilities] = useState<Facility[]>(facilitiesList);
  const [equipment, setEquipment] = useState<Equipment[]>(equipmentList);
  const [services, setServices] = useState<ServiceCatalogueItem[]>(serviceCatalogueList);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const urgentCalibrations = equipment.filter((e) => e.daysToCalibration <= 15);

  const handleUpdateEquipmentStatus = (id: string, newStatus: Equipment["status"]) => {
    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    toast("Equipment Status Updated", `Instrument marked as ${newStatus}.`, "success");
  };

  const filteredEquipment = equipment.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.facilityName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Facilities, Equipment & Operations</span>
            <span className="text-[11.5px] font-medium px-2.5 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              R&D Infrastructure
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Operational governance of ISO cleanrooms, robotics arenas, motion capture rigs, calibration schedules and external testing services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toast("Operational Dossier Exported", "Comprehensive equipment calibration log downloaded.", "success");
            }}
            className="btn-secondary h-[35px] text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Calibration Report</span>
          </button>
          <button
            onClick={() => {
              toast("Log Equipment Ticket", "Maintenance dispatch scheduled with facility manager.", "info");
            }}
            className="btn-primary h-[35px] text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Equipment</span>
          </button>
        </div>
      </div>

      {/* Alert Banner for Overdue or Upcoming Calibrations */}
      {urgentCalibrations.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[12.5px] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-300">
                {urgentCalibrations.length} High-Precision Instruments Require Calibration Clearance
              </span>
              <p className="text-amber-800 dark:text-amber-400 text-[12px] mt-0.5">
                {urgentCalibrations.map((e) => `${e.name} (${e.daysToCalibration} days left)`).join(" • ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab("equipment");
              setStatusFilter("Calibration");
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs shrink-0 hover:bg-amber-700"
          >
            Manage Calibration
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Specialized R&D Labs
          </span>
          <div className="text-[24px] font-bold text-slate-900 dark:text-white mt-1">
            4 Facilities
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Bio, Swarms, Cleanroom, HPC
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Tracked Instruments
          </span>
          <div className="text-[24px] font-bold text-[#0066cc] dark:text-sky-400 mt-1">
            {equipment.length} Units
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            78% Mean Utilization Rate
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Testing Services
          </span>
          <div className="text-[24px] font-bold text-slate-900 dark:text-white mt-1">
            {services.length} Services
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Internal & External Industry Rates
          </div>
        </div>

        <div className="p-4 rounded-2xl ref-card">
          <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block">
            Operational Uptime
          </span>
          <div className="text-[24px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            98.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Continuous Environmental Control
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-1 text-[13px]">
        {[
          { id: "equipment", label: `Operational Equipment (${equipment.length})`, icon: Cpu },
          { id: "facilities", label: `Specialized Labs & Facilities (${facilities.length})`, icon: Building },
          { id: "services", label: `Service Catalogue & Requests (${services.length})`, icon: Wrench },
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

      {/* Search & Status Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl ref-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full h-[36px] pl-9 pr-4 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
          />
        </div>

        {activeTab === "equipment" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[36px] px-3 text-[12px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Operational Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Calibration">Under Calibration</option>
            <option value="Maintenance">Maintenance Window</option>
          </select>
        )}
      </div>

      {/* TAB 1: EQUIPMENT INVENTORY & OPERATIONS */}
      {activeTab === "equipment" && (
        <div className="space-y-3">
          {filteredEquipment.map((eq) => {
            const isNearCalibration = eq.daysToCalibration <= 15;
            return (
              <div
                key={eq.id}
                className="p-5 rounded-2xl ref-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0066cc]/40 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                      {eq.serialNumber}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        eq.status === "Available"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : eq.status === "Booked"
                          ? "bg-blue-500/10 text-[#0066cc] dark:text-sky-300 border-blue-500/20"
                          : eq.status === "Calibration"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      }`}
                    >
                      ● {eq.status}
                    </span>
                    <span className="text-[11.5px] text-slate-400">• {eq.facilityName}</span>
                  </div>

                  <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white leading-snug">
                    {eq.name}
                  </h3>

                  <div className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-4 flex-wrap pt-0.5">
                    <span>Model: <strong className="text-slate-700 dark:text-slate-300">{eq.model}</strong></span>
                    <span>Maker: {eq.manufacturer}</span>
                    <span>Facility Mgr: {eq.manager}</span>
                    <span>Hourly Rate: ₹{eq.hourlyRateINR}/hr</span>
                  </div>

                  {/* Calibration schedule */}
                  <div className="text-[11.5px] pt-1 flex items-center gap-2">
                    <span className="text-slate-400">Next Calibration: <strong>{eq.calibrationDueDate}</strong></span>
                    <span className={`px-2 py-0.2 rounded font-semibold text-[10.5px] ${isNearCalibration ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold" : "text-slate-400"}`}>
                      ({eq.daysToCalibration} days remaining)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right w-28">
                    <div className="text-[11px] text-slate-400 font-medium">Utilization</div>
                    <div className="text-[15px] font-bold text-slate-900 dark:text-white">{eq.utilizationRate}%</div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${eq.utilizationRate}%` }} />
                    </div>
                  </div>

                  <select
                    value={eq.status}
                    onChange={(e) => handleUpdateEquipmentStatus(eq.id, e.target.value as any)}
                    className="h-[34px] px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Available">Set Available</option>
                    <option value="Booked">Set Booked</option>
                    <option value="Calibration">Set Calibration</option>
                    <option value="Maintenance">Set Maintenance</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SPECIALIZED LABS & FACILITIES */}
      {activeTab === "facilities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-4 hover:border-[#0066cc]/40 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2 py-0.5 rounded">
                    {fac.code}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                    {fac.status}
                  </span>
                </div>

                <h3 className="text-[16.5px] font-bold text-slate-900 dark:text-white">
                  {fac.name}
                </h3>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {fac.description}
                </p>

                <div className="text-[12px] text-slate-500 space-y-1 pt-1">
                  <div>Location: <strong className="text-slate-700 dark:text-slate-300">{fac.location}</strong></div>
                  <div>Lab Director / Manager: <strong className="text-slate-700 dark:text-slate-300">{fac.manager}</strong> ({fac.managerEmail})</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <span><strong>{fac.equipmentCount}</strong> Instruments</span>
                  <span><strong>{fac.activeBookings}</strong> Active Sessions</span>
                </div>
                <span className="text-emerald-600 font-semibold">✓ Public Lab Profile</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SERVICE CATALOGUE */}
      {activeTab === "services" && (
        <div className="space-y-3">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl ref-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded">
                    {srv.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Category: {srv.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • Turnaround: <strong>{srv.turnaroundTimeDays} Days</strong>
                  </span>
                </div>

                <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white">
                  {srv.serviceName}
                </h3>

                <div className="text-[12px] text-slate-500">
                  Facility: <strong className="text-slate-700 dark:text-slate-300">{srv.facilityName}</strong> • Rig: {srv.equipmentUsed}
                </div>
                <div className="text-[11.5px] text-slate-400">
                  Sample Requirements: {srv.sampleRequirements}
                </div>
              </div>

              <div className="text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-[12px] font-semibold text-slate-900 dark:text-white">
                  Industry: ₹{srv.externalIndustryPriceINR.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-[#0066cc] dark:text-sky-400">
                  Internal: ₹{srv.internalPriceINR.toLocaleString("en-IN")}
                </div>
                <button
                  onClick={() => {
                    toast("Service Booking Created", `Dispatched request for ${srv.serviceName}.`, "success");
                  }}
                  className="btn-primary h-[32px] text-xs mt-2"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
