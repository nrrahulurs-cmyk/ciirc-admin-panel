import { NextRequest, NextResponse } from "next/server";
import { getSanitizedPublicResearchers } from "@/lib/canonicalMetrics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const department = searchParams.get("department");

    let researchers = getSanitizedPublicResearchers();

    if (department && department !== "All") {
      researchers = researchers.filter((r) =>
        r.department?.toLowerCase().includes(department.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      pagination: {
        total: researchers.length,
        limit,
      },
      data: researchers.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "RESEARCHERS_FETCH_FAILED", message: "Failed to assemble researcher directory." },
      },
      { status: 500 }
    );
  }
}
