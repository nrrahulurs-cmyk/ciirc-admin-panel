import { NextResponse } from "next/server";
import { getSanitizedPublicLeadership } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const leadership = getSanitizedPublicLeadership();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: leadership.length,
      data: leadership,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "LEADERSHIP_FETCH_FAILED", message: "Failed to assemble leadership directory." },
      },
      { status: 500 }
    );
  }
}
