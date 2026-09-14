import { NextResponse } from "next/server";
import { getSanitizedPublicEquipment } from "@/lib/canonicalMetrics";

export async function GET() {
  try {
    const equipment = getSanitizedPublicEquipment();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
      count: equipment.length,
      data: equipment,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "EQUIPMENT_FETCH_FAILED", message: "Failed to assemble public equipment registry." },
      },
      { status: 500 }
    );
  }
}
