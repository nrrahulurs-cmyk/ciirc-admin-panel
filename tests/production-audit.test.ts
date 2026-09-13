import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeHtml, sanitizeString, isValidEmail } from "../src/lib/validators";
import { hasPermission, canTransitionApproval } from "../src/lib/rbac";
import { validateUpload, sanitizeFilename } from "../src/lib/uploadSecurity";
import { getCanonicalMetrics, getCanonicalPartners, getSanitizedPublicResearchers } from "../src/lib/canonicalMetrics";

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
  assert.equal(metrics.dataQualityScore, 94);
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
