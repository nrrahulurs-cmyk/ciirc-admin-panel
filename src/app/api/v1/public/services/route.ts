import { NextResponse } from "next/server";
import { getSanitizedPublicServices } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const services = getSanitizedPublicServices();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: services.length,
      data: services,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVICES_FETCH_FAILED", message: "Failed to assemble analytical services catalogue." },
      },
      { status: 500 }
    );
  }
}
