import { NextResponse } from "next/server";
import { getSanitizedPublicPublications } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const publications = getSanitizedPublicPublications();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Intelligent and Interactive Robotics and Cybernetics (CIIRC)",
      count: publications.length,
      data: publications,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "PUBLICATIONS_FETCH_FAILED", message: "Failed to assemble public publications register." },
      },
      { status: 500 }
    );
  }
}
