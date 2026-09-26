import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/mongodb";
import { getCanonicalMetrics } from "@/lib/canonicalMetrics";

export async function GET() {
  const start = Date.now();
  const dbHealth = await checkDatabaseHealth();
  const canonical = getCanonicalMetrics();

  return NextResponse.json({
    status: dbHealth.connected ? "HEALTHY" : "DEGRADED",
    timestamp: new Date().toISOString(),
    institution: "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)",
    platform: "CIIRC Admin OS v2.6 (Production)",
    environment: process.env.NODE_ENV || "development",
    latencyMs: Date.now() - start,
    database: dbHealth,
    telemetry: {
      researchers: canonical.researchersCount,
      activeProjects: canonical.activeProjectsCount,
      publications: canonical.publicationsCount,
      patents: canonical.patentsCount,
      upcomingEvents: canonical.upcomingEventsCount,
      dataHygieneScore: canonical.dataQualityScore,
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
}
