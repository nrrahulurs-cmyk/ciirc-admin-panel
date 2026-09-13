import { NextResponse } from "next/server";
import { getSanitizedPublicDomains } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const domains = getSanitizedPublicDomains();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: domains.length,
      data: domains,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "DOMAINS_FETCH_FAILED", message: "Failed to assemble research domains." },
      },
      { status: 500 }
    );
  }
}
