import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { logAuditEntry } from "@/lib/auditLogger";

export async function POST(request: NextRequest) {
  const sessionResult = getSessionFromRequest(request);

  if (sessionResult.valid && sessionResult.user) {
    logAuditEntry({
      userId: sessionResult.user.id,
      userName: sessionResult.user.name,
      userRole: sessionResult.user.role,
      action: "Institutional Session Signed Out",
      entityType: "AuthSession",
      entityId: sessionResult.user.id,
      status: "Success",
    });
  }

  const response = NextResponse.json({
    success: true,
    message: "Institutional session terminated.",
  });

  // Expire and clear cookie
  response.cookies.set("ciirc_session", "", {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
