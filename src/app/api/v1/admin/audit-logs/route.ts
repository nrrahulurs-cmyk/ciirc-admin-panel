import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, logAuditEntry } from "@/lib/auditLogger";
import { hasPermission, Role } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const userRole = (request.headers.get("x-ciirc-role") || "Analyst") as Role;

    if (!hasPermission(userRole, "View")) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "FORBIDDEN", message: "User lacks permission to inspect institutional audit logs." },
        },
        { status: 403 }
      );
    }

    const logs = getAuditLogs(50);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: logs.length,
      data: logs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "AUDIT_FETCH_FAILED", message: "Failed to read audit log store." },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userRole = (request.headers.get("x-ciirc-role") || "Editor") as Role;

    if (!hasPermission(userRole, "Create") && !hasPermission(userRole, "Edit")) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "FORBIDDEN", message: "User lacks permission to append audit records." },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body.action || !body.entityType || !body.entityId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_AUDIT_PAYLOAD", message: "action, entityType, and entityId are required." },
        },
        { status: 400 }
      );
    }

    const recorded = logAuditEntry({
      userId: body.userId || "usr-current",
      userName: body.userName || "System User",
      userRole: userRole,
      action: body.action,
      entityType: body.entityType,
      entityId: body.entityId,
      oldValue: body.oldValue,
      newValue: body.newValue,
      status: "Success",
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: recorded,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "AUDIT_APPEND_FAILED", message: "Failed to record audit mutation." },
      },
      { status: 500 }
    );
  }
}
