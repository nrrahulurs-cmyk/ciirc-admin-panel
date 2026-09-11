"use client";

import React, { useState } from "react";
import {
  Shield,
  UserCheck,
  Plus,
  Search,
  Check,
  X,
  Lock,
  Smartphone,
  Save,
  Key,
} from "lucide-react";
import { UserAccount } from "@/types";
import { userAccountsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

export function UsersRbacView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "matrix">("matrix");
  const [users, setUsers] = useState<UserAccount[]>(userAccountsList);

  const roles = [
    "Super Admin",
    "Administrator",
    "Content Manager",
    "Research Manager",
    "Event Manager",
    "Editor",
    "Reviewer",
    "Analyst",
  ] as const;

  const permissions = [
    "View",
    "Create",
    "Edit",
    "Delete",
    "Approve",
    "Publish",
    "Export",
    "Manage",
  ] as const;

  // Initial Matrix permissions mapping
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    "Super Admin": { View: true, Create: true, Edit: true, Delete: true, Approve: true, Publish: true, Export: true, Manage: true },
    Administrator: { View: true, Create: true, Edit: true, Delete: true, Approve: true, Publish: true, Export: true, Manage: false },
    "Content Manager": { View: true, Create: true, Edit: true, Delete: false, Approve: true, Publish: true, Export: true, Manage: false },
    "Research Manager": { View: true, Create: true, Edit: true, Delete: false, Approve: true, Publish: false, Export: true, Manage: false },
    "Event Manager": { View: true, Create: true, Edit: true, Delete: false, Approve: false, Publish: true, Export: true, Manage: false },
    Editor: { View: true, Create: true, Edit: true, Delete: false, Approve: false, Publish: false, Export: false, Manage: false },
    Reviewer: { View: true, Create: false, Edit: false, Delete: false, Approve: true, Publish: false, Export: true, Manage: false },
    Analyst: { View: true, Create: false, Edit: false, Delete: false, Approve: false, Publish: false, Export: true, Manage: false },
  });

  const togglePermission = (role: string, perm: string) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role]?.[perm],
      },
    }));
  };

  const savePermissions = () => {
    toast("RBAC Policy Updated", "Granular privileges synced across all authenticated user sessions.", "success");
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Identity & Access Control (RBAC)</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              Enterprise Security
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            Granular permission matrices, role delegation, session security, and SAML 2FA verification.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[12px]">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "matrix"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Permission Matrix (8x8)
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "users"
                ? "bg-white dark:bg-slate-700 text-[#0066cc] dark:text-sky-400 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            User Accounts ({users.length})
          </button>
        </div>
      </div>

      {activeTab === "matrix" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400">
              Configure capability gates across institutional operations:
            </p>
            <button
              onClick={savePermissions}
              className="btn-primary h-[35px]"
            >
              <Save className="w-3.5 h-3.5" strokeWidth={1.85} />
              <span>Save Policy Changes</span>
            </button>
          </div>

          <div className="rounded-2xl ref-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 min-w-[160px]">Institutional Role</th>
                    {permissions.map((perm) => (
                      <th key={perm} className="py-3.5 px-3 text-center min-w-[80px]">
                        {perm}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {roles.map((role) => (
                    <tr key={role} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400" strokeWidth={1.85} />
                        <span>{role}</span>
                      </td>

                      {permissions.map((perm) => {
                        const hasPerm = matrix[role]?.[perm];
                        const isSuperAdmin = role === "Super Admin";

                        return (
                          <td key={perm} className="py-3 px-3 text-center">
                            <button
                              type="button"
                              disabled={isSuperAdmin}
                              onClick={() => togglePermission(role, perm)}
                              className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all ${
                                hasPerm
                                  ? "bg-[#0066cc] text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750"
                              } ${isSuperAdmin ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
                            >
                              {hasPerm ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* User Accounts View */
        <div className="space-y-3">
          <div className="rounded-2xl ref-card overflow-hidden">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-3">Role</th>
                  <th className="py-3.5 px-3">Department</th>
                  <th className="py-3.5 px-3">2FA Security</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-[13px]">{u.name}</div>
                          <div className="text-[11.5px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {u.role}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{u.department}</td>
                    <td className="py-3.5 px-3">
                      {u.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-500 font-medium">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[11.5px] text-slate-400 font-mono">
                      {u.lastActive}
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
