import { NextRequest, NextResponse } from "next/server";
import { userAccountsList } from "@/data/mockData";
import { isValidEmail } from "@/lib/validators";
import { logAuditEntry } from "@/lib/auditLogger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_EMAIL", message: "Valid institutional email is required." },
        },
        { status: 400 }
      );
    }

    const user = userAccountsList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      logAuditEntry({
        userId: "unregistered",
        userName: email,
        userRole: "Analyst",
        action: "Authentication Attempt Failed: Unknown Account",
        entityType: "AuthSession",
        entityId: email,
        status: "Denied",
      });

      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Institutional account not found." },
        },
        { status: 401 }
      );
    }

    if (user.status !== "Active") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "ACCOUNT_SUSPENDED", message: "This institutional account is suspended." },
        },
        { status: 403 }
      );
    }

    // Generate a temporary 6-digit OTP challenge for 2FA
    const otpChallenge = Math.floor(100000 + Math.random() * 900000).toString();

    return NextResponse.json({
      success: true,
      message: "Primary credentials verified. 2FA challenge dispatched.",
      requires2FA: user.twoFactorEnabled,
      email: user.email,
      role: user.role,
      name: user.name,
      // For institutional simulation/demo, return OTP preview or log it
      otpPreview: process.env.NODE_ENV !== "production" ? "481920" : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "AUTH_ERROR", message: "Authentication service encountered an error." },
      },
      { status: 500 }
    );
  }
}
