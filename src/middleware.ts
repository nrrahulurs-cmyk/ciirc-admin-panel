import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Path Traversal & Injection Protection
  const rawUrl = request.url;
  if (rawUrl.includes("..") || rawUrl.includes("%2e%2e") || rawUrl.includes("<script>")) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { code: "MALICIOUS_REQUEST_BLOCKED", message: "Potentially harmful request sequence detected." },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Admin API Protection (/api/v1/admin/*)
  if (pathname.startsWith("/api/v1/admin")) {
    const authHeader = request.headers.get("authorization");
    const sessionCookie = request.cookies.get("ciirc_session")?.value;
    const clientRole = request.headers.get("x-ciirc-role");

    // Require either a bearer token, valid session cookie, or authorized internal role
    const isAuthorized =
      (authHeader && authHeader.startsWith("Bearer ")) ||
      sessionCookie === "active" ||
      clientRole === "Super Admin" ||
      clientRole === "Administrator" ||
      clientRole === "Research Director";

    if (!isAuthorized) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: "UNAUTHORIZED_ACCESS",
            message: "Elevated institutional credentials required to access this endpoint.",
          },
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 3. Attach enhanced security headers on outgoing response
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
