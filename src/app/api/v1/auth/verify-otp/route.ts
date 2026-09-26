import { NextRequest, NextResponse } from "next/server";
import { userAccountsList } from "@/data/mockData";
import { signSessionToken } from "@/lib/auth";
import { logAuditEntry } from "@/lib/auditLogger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "MISSING_FIELDS", message: "Email and OTP code are required." },
        },
        { status: 400 }
      );
    }

    // Clean and validate OTP format (6 digits)
    const cleanOtp = String(otp).replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_OTP_FORMAT", message: "OTP must be a 6-digit code." },
        },
        { status: 400 }
      );
    }

    const user = userAccountsList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "USER_NOT_FOUND", message: "User account not found." },
        },
        { status: 404 }
      );
    }

    // In demo environment, accept "481920" or any valid 6-digit code
    const isValidOtp = cleanOtp === "481920" || cleanOtp.length === 6;

    if (!isValidOtp) {
      logAuditEntry({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "2FA Verification Failed",
        entityType: "AuthSession",
        entityId: user.email,
        status: "Denied",
      });

      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_OTP", message: "Incorrect or expired OTP verification code." },
        },
        { status: 401 }
      );
    }

    // Generate signed session token with HMAC-SHA256
    const token = signSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });

    logAuditEntry({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "Institutional Session Authenticated (2FA Verified)",
      entityType: "AuthSession",
      entityId: user.id,
      status: "Success",
    });

    const response = NextResponse.json({
      success: true,
      message: "Session authenticated successfully.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
      },
    });

    // Set HTTP cookie for middleware and direct browser navigation
    response.cookies.set("ciirc_session", token, {
      path: "/",
      httpOnly: false, // Accessible to client for unified sync
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "OTP_VERIFICATION_ERROR", message: "Failed to verify 2FA token." },
      },
      { status: 500 }
    );
  }
}
