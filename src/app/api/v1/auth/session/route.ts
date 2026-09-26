import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const sessionResult = getSessionFromRequest(request);

  if (!sessionResult.valid || !sessionResult.user) {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: { code: sessionResult.error || "UNAUTHORIZED", message: "No active or valid institutional session." },
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: sessionResult.user,
  });
}
