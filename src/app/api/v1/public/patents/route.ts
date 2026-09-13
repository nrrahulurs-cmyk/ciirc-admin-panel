import { NextResponse } from "next/server";
import { getSanitizedPublicPatents } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const patents = getSanitizedPublicPatents();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Intelligent and Interactive Robotics and Cybernetics (CIIRC)",
      count: patents.length,
      data: patents,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "PATENTS_FETCH_FAILED", message: "Failed to assemble public patents registry." },
      },
      { status: 500 }
    );
  }
}
