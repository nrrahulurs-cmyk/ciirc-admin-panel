import { NextResponse } from "next/server";
import { getSanitizedPublicNews } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const news = getSanitizedPublicNews();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: news.length,
      data: news,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NEWS_FETCH_FAILED", message: "Failed to assemble institutional news." },
      },
      { status: 500 }
    );
  }
}
