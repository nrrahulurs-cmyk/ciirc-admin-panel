import { NextResponse } from "next/server";
import { getCanonicalPartners } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const partners = getCanonicalPartners();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: partners.length,
      data: partners,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "PARTNERS_FETCH_FAILED", message: "Failed to assemble partner directory." },
      },
      { status: 500 }
    );
  }
}
