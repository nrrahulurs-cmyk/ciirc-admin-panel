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
  Sliders,
  Check,
} from "lucide-react";
import {
  Facility,
  Equipment,
  ServiceCatalogueItem,
  SIFInstrument,
  SampleCharacterizationRequest,
  EquipmentCalibrationRecord,
  EquipmentMaintenanceLog,
  FacilityBooking,
} from "@/types";
import {
  facilitiesList,
  equipmentList,
  serviceCatalogueList,
  sifInstrumentsList,
  sampleCharacterizationRequestsList,
  equipmentCalibrationRecordsList,
  equipmentMaintenanceLogsList,
  facilityBookingsList,
} from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "../common/Toast";

export function FacilitiesView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "sif" | "sample-requests" | "equipment" | "facilities" | "services" | "calibration" | "booking"
  >("sif");
  const [facilities, setFacilities] = useState<Facility[]>(facilitiesList);
  const [equipment, setEquipment] = useState<Equipment[]>(equipmentList);
  const [services, setServices] = useState<ServiceCatalogueItem[]>(serviceCatalogueList);
  const [sifInstruments, setSifInstruments] = useState<SIFInstrument[]>(sifInstrumentsList);
  const [sampleRequests, setSampleRequests] = useState<SampleCharacterizationRequest[]>(sampleCharacterizationRequestsList);
  const [calibrations, setCalibrations] = useState<EquipmentCalibrationRecord[]>(equipmentCalibrationRecordsList);
  const [maintenanceLogs, setMaintenanceLogs] = useState<EquipmentMaintenanceLog[]>(equipmentMaintenanceLogsList);
  const [bookings, setBookings] = useState<FacilityBooking[]>(facilityBookingsList);

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
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-1 text-[13px] overflow-x-auto">
        {[
          { id: "sif", label: `SIF Core (${sifInstruments.length})`, icon: Sparkles },
          { id: "sample-requests", label: `Sample Testing Requests (${sampleRequests.length})`, icon: FileText },
          { id: "equipment", label: `Equipment (${equipment.length})`, icon: Cpu },
          { id: "facilities", label: `Specialized Labs (${facilities.length})`, icon: Building },
          { id: "services", label: `Service Rates (${services.length})`, icon: Wrench },
          { id: "calibration", label: `Calibration & Maintenance (${calibrations.length})`, icon: Shield },
          { id: "booking", label: `Facility Bookings (${bookings.length})`, icon: Calendar },
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

      {/* ========================================== */}
      {/* TAB 4: SIF (SOPHISTICATED INSTRUMENTATION FACILITY) */}
      {/* ========================================== */}
      {activeTab === "sif" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sifInstruments.map((inst) => (
              <div
                key={inst.id}
                className="p-5 rounded-2xl ref-card flex flex-col justify-between space-y-4 hover:border-[#0066cc]/40 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/40">
                      {inst.code}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        inst.availabilityStatus === "Available"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : inst.availabilityStatus === "Calibration"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-blue-500/10 text-[#0066cc] border-blue-500/20"
                      }`}
                    >
                      ● {inst.availabilityStatus}
                    </span>
                  </div>

                  <h3 className="text-[16.5px] font-bold text-slate-900 dark:text-white leading-snug">
                    {inst.name}
                  </h3>

                  <div className="text-[12px] text-slate-600 dark:text-slate-400 space-y-0.5">
                    <div>Model: <strong className="text-slate-800 dark:text-slate-200">{inst.model}</strong> • {inst.manufacturer}</div>
                    <div>Detector / Sensor: {inst.technicalSpecs.detector}</div>
                    <div>Resolution / Range: <strong className="text-[#0066cc] dark:text-sky-400">{inst.technicalSpecs.resolutionRange}</strong></div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Supported Analytical Techniques:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {inst.technicalSpecs.supportedTechniques.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11.5px] text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Sample Specs:</strong> {inst.sampleRequirements}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="text-slate-400 block text-[10px]">Scholar</span>
                      <strong className="text-[#0066cc] dark:text-sky-300">₹{inst.pricing.internalStudentINR}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="text-slate-400 block text-[10px]">Faculty</span>
                      <strong className="text-[#0066cc] dark:text-sky-300">₹{inst.pricing.internalFacultyINR}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                      <span className="text-slate-400 block text-[10px]">Academic</span>
                      <strong className="text-purple-600 dark:text-purple-300">₹{inst.pricing.externalAcademicINR}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                      <span className="text-slate-400 block text-[10px]">Industry</span>
                      <strong className="text-emerald-600 dark:text-emerald-300">₹{inst.pricing.externalIndustryINR}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-[11.5px] text-slate-500">
                    Operator: <strong className="text-slate-700 dark:text-slate-300">{inst.operatorName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        toast("SOP Protocol Downloaded", `Standard Operating Procedure for ${inst.name} saved.`, "info");
                      }}
                      className="btn-secondary h-[30px] text-[11px]"
                    >
                      SOP Protocol
                    </button>
                    <button
                      onClick={() => {
                        toast("SIF Booking Form Queued", `Initiated testing reservation for ${inst.name}.`, "success");
                      }}
                      className="btn-primary h-[30px] text-[11px]"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: SAMPLE CHARACTERIZATION & TESTING WORKFLOW */}
      {/* ========================================== */}
      {activeTab === "sample-requests" && (
        <div className="space-y-4">
          {sampleRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl ref-card space-y-4 hover:border-[#0066cc]/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11.5px] font-bold text-[#0055b3] dark:text-sky-300 bg-[#edf2fe] dark:bg-blue-950/50 px-2.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/40">
                      {req.requestNumber}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600">
                      {req.client.type}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#0066cc] dark:text-sky-300 border border-blue-500/20">
                      Stage: {req.workflowStage}
                    </span>
                    <span className="text-[11.5px] text-slate-400">
                      Condition: <strong className="text-emerald-600">{req.sampleConditionOnReceipt || "Pending Receipt"}</strong>
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                    Client: {req.client.name} — <span className="text-slate-500 font-normal">{req.client.organization}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Quotation</div>
                    <div className="text-[15px] font-bold text-slate-900 dark:text-white">
                      ₹{req.quotationAmountINR?.toLocaleString("en-IN") || "Under Review"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const stages: SampleCharacterizationRequest["workflowStage"][] = [
                        "Draft", "Submitted", "Technical Review", "Quotation", "Approved",
                        "Scheduled", "Sample Received", "Analysis In Progress", "QA Review",
                        "Report Generated", "Completed"
                      ];
                      const currentIdx = stages.indexOf(req.workflowStage);
                      const nextStage = stages[Math.min(stages.length - 1, currentIdx + 1)];
                      setSampleRequests((prev) =>
                        prev.map((item) => (item.id === req.id ? { ...item, workflowStage: nextStage } : item))
                      );
                      toast("Sample Workflow Advanced", `Request ${req.requestNumber} moved to ${nextStage}.`, "success");
                    }}
                    className="btn-primary h-[34px] text-xs flex items-center gap-1.5"
                  >
                    <span>Advance Stage</span>
                  </button>
                </div>
              </div>

              {/* Sample Items Breakdown Table */}
              <div>
                <span className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Sample Batch Manifest ({req.samples.length} Samples):
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-slate-800">
                  <table className="w-full text-[12px] text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-medium border-b border-slate-200/70 dark:border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Sample ID</th>
                        <th className="py-2 px-3">Sample Name</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Composition</th>
                        <th className="py-2 px-3">Testing Specifications</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {req.samples.map((smp) => (
                        <tr key={smp.sampleId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-mono font-bold text-[#0066cc]">{smp.sampleId}</td>
                          <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">{smp.name}</td>
                          <td className="py-2 px-3 text-slate-500">{smp.sampleType}</td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{smp.composition}</td>
                          <td className="py-2 px-3 text-slate-500">{smp.measurementDetails}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chain of Custody Audit Log */}
              <div>
                <span className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Chain of Custody Log:
                </span>
                <div className="space-y-1">
                  {req.chainOfCustodyLog.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-[11px] flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-400 font-mono">{log.timestamp}</span>
                      <strong className="text-slate-800 dark:text-slate-200">{log.action}</strong>
                      <span className="text-slate-500">({log.handledBy})</span>
                      <span className="text-slate-400 italic truncate max-w-xs">{log.remarks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: CALIBRATION & PREVENTIVE MAINTENANCE LOGS */}
      {/* ========================================== */}
      {activeTab === "calibration" && (
        <div className="space-y-5">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0066cc]" />
              <span>NABL Instrument Calibration Schedule</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-slate-800">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-medium border-b border-slate-200/70 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Equipment</th>
                    <th className="py-2.5 px-3">Serial No</th>
                    <th className="py-2.5 px-3">Calibration Vendor</th>
                    <th className="py-2.5 px-3">Certificate Ref</th>
                    <th className="py-2.5 px-3">Last Calibration</th>
                    <th className="py-2.5 px-3">Next Due</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calibrations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{c.equipmentName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{c.serialNumber}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{c.vendor}</td>
                      <td className="py-2.5 px-3 font-mono text-[#0066cc]">{c.certificateNumber}</td>
                      <td className="py-2.5 px-3 text-slate-500">{c.lastCalibrationDate}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{c.nextCalibrationDate}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            c.status === "Valid"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          ● {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-600" />
              <span>Preventive Maintenance & MTBF Register</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-slate-800">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-medium border-b border-slate-200/70 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Equipment</th>
                    <th className="py-2.5 px-3">Service Date</th>
                    <th className="py-2.5 px-3">Maintenance Action</th>
                    <th className="py-2.5 px-3">Downtime</th>
                    <th className="py-2.5 px-3">Cost (INR)</th>
                    <th className="py-2.5 px-3">Service Engineer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {maintenanceLogs.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{m.equipmentName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{m.serviceDate}</td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{m.actionTaken}</td>
                      <td className="py-2.5 px-3 font-mono text-amber-600 font-bold">{m.downtimeHours} hrs</td>
                      <td className="py-2.5 px-3 font-mono font-bold">₹{m.costINR.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 text-slate-500">{m.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 7: FACILITY & EQUIPMENT BOOKING ENGINE */}
      {/* ========================================== */}
      {activeTab === "booking" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-slate-800">
            <table className="w-full text-[12px] text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-medium border-b border-slate-200/70 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Booking Ref</th>
                  <th className="py-2.5 px-3">Facility / Rig</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Time Slot</th>
                  <th className="py-2.5 px-3">Research Purpose</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0066cc]">{b.bookingRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {b.equipmentName || b.facilityName}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900 dark:text-white">{b.userName}</div>
                      <div className="text-[10.5px] text-slate-400">{b.userEmail}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-500/10 text-[#0066cc]">
                        {b.userType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{b.startTime}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{b.purpose}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          b.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        ● {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {b.status === "Requested" ? (
                        <button
                          onClick={() => {
                            setBookings((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, status: "Approved" } : item))
                            );
                            toast("Booking Approved", `Slot confirmed for ${b.userName}.`, "success");
                          }}
                          className="btn-primary h-[28px] text-[11px] px-2.5"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
