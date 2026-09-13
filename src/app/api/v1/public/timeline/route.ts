import { NextResponse } from "next/server";
import { getSanitizedPublicTimeline } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const timeline = getSanitizedPublicTimeline();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Intelligent and Interactive Robotics and Cybernetics (CIIRC)",
      count: timeline.length,
      data: timeline,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "TIMELINE_FETCH_FAILED", message: "Failed to assemble institutional timeline chronicles." },
      },
      { status: 500 }
    );
  }
}
