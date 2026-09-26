import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, logAuditEntry } from "@/lib/auditLogger";
import { hasPermission, Role } from "@/lib/rbac";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Determine authenticated role from verified header or session token
    let userRole = request.headers.get("x-ciirc-verified-role") as Role | null;
    if (!userRole) {
      const session = getSessionFromRequest(request);
      if (session.valid && session.user) {
        userRole = session.user.role;
      }
    }

    // Default to minimum privilege if unauthenticated
    if (!userRole || !hasPermission(userRole, "View")) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "FORBIDDEN", message: "User lacks permission to inspect institutional audit logs." },
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "50", 10), 200));
    const search = searchParams.get("search") || "";
    const entityType = searchParams.get("entityType") || "";

    let logs = getAuditLogs(200);

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q) ||
          l.entity.toLowerCase().includes(q)
      );
    }

    if (entityType && entityType !== "All") {
      logs = logs.filter((l) => l.entityType.toLowerCase() === entityType.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      pagination: {
        total: logs.length,
        limit,
      },
      data: logs.slice(0, limit),
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
    let userRole = request.headers.get("x-ciirc-verified-role") as Role | null;
    let userId = request.headers.get("x-ciirc-verified-user") || "usr-system";
    let userName = "System User";

    if (!userRole) {
      const session = getSessionFromRequest(request);
      if (session.valid && session.user) {
        userRole = session.user.role;
        userId = session.user.id;
        userName = session.user.name;
      }
    }

    if (!userRole || (!hasPermission(userRole, "Create") && !hasPermission(userRole, "Edit"))) {
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
      userId: body.userId || userId,
      userName: body.userName || userName,
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
