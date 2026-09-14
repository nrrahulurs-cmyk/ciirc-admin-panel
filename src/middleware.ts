import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// =========================================================================
// SLIDING-WINDOW IN-MEMORY RATE LIMITER FOR NEXT.JS MIDDLEWARE / HEADLESS APIS
// =========================================================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired buckets periodically (every 10 minutes)
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }
}

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetTime: number; limit: number } {
  cleanupExpiredRecords();
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newRecord.resetTime,
      limit,
    };
  }

  record.count += 1;
  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - record.count),
    resetTime: record.resetTime,
    limit,
  };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";

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

  // 2. Anti-CSRF Guard for State-Modifying Requests
  const mutatingMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (mutatingMethods.includes(request.method) && pathname.startsWith("/api/")) {
    const secFetchSite = request.headers.get("sec-fetch-site");
    const customCsrfHeader = request.headers.get("x-ciirc-csrf") || request.headers.get("x-requested-with");
    const authHeader = request.headers.get("authorization");

    // If request is cross-site and lacks custom headers or authorization, block CSRF
    if (secFetchSite === "cross-site" && !customCsrfHeader && !authHeader) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: "CSRF_DETECTED",
            message: "Cross-site mutating requests require institutional authorization headers.",
          },
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 3. API Rate Limiting (/api/v1/*)
  if (pathname.startsWith("/api/v1")) {
    const isPublic = pathname.startsWith("/api/v1/public");
    const limit = isPublic ? 120 : 300; // 120 req/min for public APIs, 300 for admin APIs
    const rateLimitKey = `${clientIp}:${isPublic ? "public" : "admin"}`;
    const rateResult = checkRateLimit(rateLimitKey, limit, 60 * 1000);

    if (!rateResult.allowed) {
      const retryAfter = Math.ceil((rateResult.resetTime - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: `Too many requests. Limit is ${limit} requests per minute.`,
            retryAfterSeconds: Math.max(1, retryAfter),
          },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.max(1, retryAfter)),
            "X-RateLimit-Limit": String(rateResult.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateResult.resetTime / 1000)),
          },
        }
      );
    }

    // Pass rate limit telemetry headers to response
    request.headers.set("x-ratelimit-limit", String(rateResult.limit));
    request.headers.set("x-ratelimit-remaining", String(rateResult.remaining));
  }

  // 4. Admin API Protection (/api/v1/admin/*)
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

  // 5. Attach enhanced security headers on outgoing response
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:;"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

