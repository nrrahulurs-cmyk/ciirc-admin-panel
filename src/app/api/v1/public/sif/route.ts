import { NextResponse } from "next/server";
import { getSanitizedPublicSIF } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const sifInstruments = getSanitizedPublicSIF();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      facility: "Sophisticated Instrumentation Facility (SIF)",
      count: sifInstruments.length,
      data: sifInstruments,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SIF_FETCH_FAILED", message: "Failed to assemble SIF instruments catalogue." },
      },
      { status: 500 }
    );
  }
}
