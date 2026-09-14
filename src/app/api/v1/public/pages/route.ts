import { NextResponse } from "next/server";
import { getSanitizedPublicCMSPages } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const pages = getSanitizedPublicCMSPages();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: pages.length,
      data: pages,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "PAGES_FETCH_FAILED", message: "Failed to assemble published CMS pages." },
      },
      { status: 500 }
    );
  }
}
