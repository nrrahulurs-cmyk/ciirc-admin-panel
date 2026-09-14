import { NextResponse } from "next/server";
import { getSanitizedPublicProjects } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const projects = getSanitizedPublicProjects();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: projects.length,
      data: projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "PROJECTS_FETCH_FAILED", message: "Failed to assemble public projects catalogue." },
      },
      { status: 500 }
    );
  }
}
