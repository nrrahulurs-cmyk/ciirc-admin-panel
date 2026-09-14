import { NextResponse } from "next/server";
import { getSanitizedPublicResearchAreas } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const researchAreas = getSanitizedPublicResearchAreas();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: researchAreas.length,
      data: researchAreas,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "RESEARCH_AREAS_FETCH_FAILED", message: "Failed to assemble research areas." },
      },
      { status: 500 }
    );
  }
}
