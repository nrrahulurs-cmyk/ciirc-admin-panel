import { NextResponse } from "next/server";
import { getCanonicalMetrics } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const metrics = getCanonicalMetrics();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Intelligent and Interactive Robotics and Cybernetics (CIIRC)",
      data: metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "METRICS_FETCH_FAILED", message: "Failed to assemble institutional metrics." },
      },
      { status: 500 }
    );
  }
}
