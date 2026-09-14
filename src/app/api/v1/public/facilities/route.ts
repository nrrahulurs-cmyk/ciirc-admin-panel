import { NextResponse } from "next/server";
import { getSanitizedPublicFacilities } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const facilities = getSanitizedPublicFacilities();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: facilities.length,
      data: facilities,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FACILITIES_FETCH_FAILED", message: "Failed to assemble public facilities catalogue." },
      },
      { status: 500 }
    );
  }
}
