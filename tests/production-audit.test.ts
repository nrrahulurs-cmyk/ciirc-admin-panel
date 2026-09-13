import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeHtml, sanitizeString, isValidEmail } from "../src/lib/validators";
import { hasPermission, canTransitionApproval } from "../src/lib/rbac";
import { validateUpload, sanitizeFilename } from "../src/lib/uploadSecurity";
import {
  getCanonicalMetrics,
  getCanonicalPartners,
  getSanitizedPublicResearchers,
  getSanitizedPublicProjects,
  getSanitizedPublicPublications,
  getSanitizedPublicPatents,
  getSanitizedPublicFacilities,
  getSanitizedPublicEquipment,
  getSanitizedPublicServices,
  getSanitizedPublicSIF,
  getSanitizedPublicTimeline,
} from "../src/lib/canonicalMetrics";
import {
  sifInstrumentsList,
  sampleCharacterizationRequestsList,
  consultancyProjectsList,
  conflictOfInterestDisclosuresList,
  publicationsList,
} from "../src/data/mockData";

test("Security: XSS and Script Injection Sanitization", () => {
  const maliciousInput = '<script>alert("pwned")</script><b onmouseover="steal()">Title</b>';
  const clean = sanitizeHtml(maliciousInput);
  assert.equal(clean.includes("<script>"), false, "Script tags must be stripped");
  assert.equal(clean.includes("onmouseover"), false, "Event handlers must be stripped");
  assert.equal(clean.includes("Title"), true, "Legitimate content must be preserved");
});

test("Security: Filename Sanitization & Path Traversal Prevention", () => {
  const maliciousPath = "../../etc/passwd";
  const sanitized = sanitizeFilename(maliciousPath);
  assert.equal(sanitized.includes("/"), false, "Forward slashes must be stripped");
  assert.equal(sanitized.includes("\\"), false, "Backslashes must be stripped");
  assert.equal(sanitized.includes(".."), false, "Directory traversal sequences must be removed");
});

test("Security: Email Validation Allowlist", () => {
  assert.equal(isValidEmail("admin@ciirc.edu.in"), true);
  assert.equal(isValidEmail("invalid-email"), false);
  assert.equal(isValidEmail("test@domain"), false);
});

test("Security: Server-Side RBAC Enforcement", () => {
  // Editors cannot delete or publish directly
  assert.equal(hasPermission("Editor", "Delete"), false);
  assert.equal(hasPermission("Editor", "Publish"), false);
  assert.equal(canTransitionApproval("Editor", "Approved"), false);

  // Reviewers can approve
  assert.equal(hasPermission("Reviewer", "Approve"), true);
  assert.equal(canTransitionApproval("Reviewer", "Approved"), true);

  // Super Admin has unrestricted permissions
  assert.equal(hasPermission("Super Admin", "Manage"), true);
  assert.equal(hasPermission("Super Admin", "Delete"), true);
});

test("Security: File Upload Restrictions", () => {
  // Executable rejection
  const exeResult = validateUpload("malware.exe", "application/x-msdownload", 1024);
  assert.equal(exeResult.valid, false);

  // Size limit rejection (>15MB)
  const hugeResult = validateUpload("research_paper.pdf", "application/pdf", 20 * 1024 * 1024);
  assert.equal(hugeResult.valid, false);

  // Authorized PDF upload
  const pdfResult = validateUpload("mou_agreement.pdf", "application/pdf", 1024 * 1024);
  assert.equal(pdfResult.valid, true);
});

test("Data Integrity: Canonical Metrics Engine", () => {
  const metrics = getCanonicalMetrics();
  assert.ok(metrics.researchersCount > 0, "Researchers count must be positive");
  assert.ok(metrics.activeProjectsCount > 0, "Active projects count must be positive");
  assert.ok(metrics.totalGrantsValueINR > 0, "Total grants value must be positive");
  assert.equal(typeof metrics.totalGrantsFormatted, "string");
  assert.equal(metrics.sifInstrumentsCount, 10, "Must have exactly 10 SIF signature instruments");
  assert.equal(metrics.dataQualityScore, 96, "Data hygiene score is certified at 96");
});

test("Data Integrity: Partner De-duplication", () => {
  const partners = getCanonicalPartners();
  const partnerIds = new Set<string>();
  const partnerNames = new Set<string>();

  for (const p of partners) {
    assert.equal(partnerIds.has(p.id), false, `Duplicate partner ID detected: ${p.id}`);
    assert.equal(partnerNames.has(p.name), false, `Duplicate partner name detected: ${p.name}`);
    partnerIds.add(p.id);
    partnerNames.add(p.name);
  }

  assert.ok(partners.length >= 4, "Must contain all verified partner institutions");
});

test("Data Privacy: Public Researcher Data Sanitization", () => {
  const publicResearchers = getSanitizedPublicResearchers();
  for (const r of publicResearchers) {
    assert.equal(r.classification, "PUBLIC");
    // Ensure personal phone number is not exposed
    assert.equal((r as any).phone, undefined, "Phone number must be redacted from public view");
  }
});

test("SIF Subsystem: 10 Signature Instruments Registry & Capabilities", () => {
  assert.equal(sifInstrumentsList.length, 10, "Must contain 10 real CIIRC signature instruments");
  
  const instrumentCodes = new Set(sifInstrumentsList.map((i) => i.code));
  assert.equal(instrumentCodes.size, 10, "All instrument codes must be unique");

  for (const inst of sifInstrumentsList) {
    assert.ok(inst.name.length > 5, "Instrument name must be complete");
    assert.ok(inst.model.length > 2, "Instrument model must be specified");
    assert.ok(inst.manufacturer.length > 2, "Manufacturer must be specified");
    assert.ok(inst.sampleRequirements.length > 10, "Sample preparation guidelines required");
    assert.ok(
      inst.pricing.externalIndustryINR > inst.pricing.internalStudentINR,
      "Industry pricing must exceed subsidized internal pricing"
    );
    assert.ok(inst.technicalSpecs.supportedTechniques.length > 0, "Must list supported analytical techniques");
  }
});

test("Sample Characterization: Multi-Stage Workflow & Chain of Custody", () => {
  assert.ok(sampleCharacterizationRequestsList.length >= 2, "Must have active sample requests");
  
  for (const req of sampleCharacterizationRequestsList) {
    assert.ok(req.samples.length > 0, "Manifest must contain at least one sample item");
    assert.ok(req.chainOfCustodyLog.length > 0, "Chain of custody log must track timeline");
    assert.ok((req.quotationAmountINR ?? 0) > 0, "Quotation amount must be positive");
    assert.ok(req.paymentStatus.length > 0, "Payment status must be recorded");
  }
});

test("IPR & Publishing: Pre-Publication Clearance Rule", () => {
  // Public publications must only include IPR-cleared items
  const publicPubs = getSanitizedPublicPublications();
  for (const pub of publicPubs) {
    assert.equal(pub.iprClearanceStatus, "Cleared", "Public publications must have explicit IPR clearance");
  }

  // Publications with "Flagged" status must be excluded from public view
  const flaggedInMock = publicationsList.find((p) => p.iprClearanceStatus === "Flagged");
  if (flaggedInMock) {
    const foundInPublic = publicPubs.some((p) => p.id === flaggedInMock.id);
    assert.equal(foundInPublic, false, "Flagged publications must not be accessible in public APIs");
  }
});

test("Consultancy Subsystem: Revenue Share Governance & Settlement Rules", () => {
  for (const c of consultancyProjectsList) {
    if (c.revenueSharePercent) {
      const { institute, department, piTeam } = c.revenueSharePercent;
      const totalShare = institute + department + piTeam;
      assert.equal(totalShare, 100, `Revenue split for ${c.projectCode} must sum to exactly 100%`);
    }
  }
});

test("Governance: Conflict of Interest (COI) Confidentiality Protection", () => {
  for (const coi of conflictOfInterestDisclosuresList) {
    assert.equal(coi.restrictedAccess, true, "COI records must have restricted access flag enabled");
    assert.ok(coi.personName.length > 0);
    assert.ok(coi.relatedOrganization.length > 0);
    assert.ok(coi.reviewStatus.length > 0);
  }
});

test("Headless APIs: Public Sanitization Across All Entities", () => {
  // Projects
  const publicProjects = getSanitizedPublicProjects();
  for (const p of publicProjects) {
    assert.equal((p as any).budgetINR, undefined, "Project internal budget must be redacted from public view");
    assert.equal(p.classification, "PUBLIC");
  }

  // SIF
  const publicSIF = getSanitizedPublicSIF();
  assert.equal(publicSIF.length, 10);

  // Timeline
  const publicTimeline = getSanitizedPublicTimeline();
  assert.ok(publicTimeline.length >= 6);
  assert.ok(publicTimeline.some((t) => t.year === 2014), "Must contain 2014 founding milestone");
  assert.ok(publicTimeline.some((t) => t.year === 2026), "Must contain 2026 AI-assisted milestone");
});
