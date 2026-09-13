import { AuditLogItem } from "@/types";
import { auditLogsList } from "@/data/mockData";

let inMemoryAuditLogs: AuditLogItem[] = [...auditLogsList];

export interface RecordAuditParams {
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  status?: "Success" | "Denied" | "Error";
}

export function logAuditEntry(params: RecordAuditParams): AuditLogItem {
  const newEntry: AuditLogItem = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user: params.userName,
    userRole: params.userRole,
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    action: params.action,
    entity: params.entityId,
    entityType: params.entityType,
    timestamp: new Date().toISOString(),
    ip: params.ipAddress || "127.0.0.1",
    result: params.status === "Denied" ? "Warning" : params.status === "Error" ? "Failed" : "Success",
  };

  inMemoryAuditLogs.unshift(newEntry);
  return newEntry;
}

export function getAuditLogs(limit: number = 50): AuditLogItem[] {
  return inMemoryAuditLogs.slice(0, limit);
}
