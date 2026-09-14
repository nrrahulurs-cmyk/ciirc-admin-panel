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

test("Security: API Rate Limiter Sliding Window Enforcement", async () => {
  const { checkRateLimit } = await import("../src/middleware");
  const testIp = `test-ip-${Date.now()}`;
  const testLimit = 5;

  // First 5 requests should pass
  for (let i = 0; i < testLimit; i++) {
    const res = checkRateLimit(testIp, testLimit, 1000);
    assert.equal(res.allowed, true, `Request ${i + 1} should be permitted`);
    assert.equal(res.remaining, testLimit - 1 - i);
  }

  // 6th request must be blocked (429 condition)
  const blocked = checkRateLimit(testIp, testLimit, 1000);
  assert.equal(blocked.allowed, false, "Request exceeding threshold must be blocked");
  assert.equal(blocked.remaining, 0, "Remaining requests counter must be 0");
});

test("Research Governance: Project Financials & GFR 12-A Utilization Certificates", async () => {
  const { projectsList } = await import("../src/data/mockData");
  const projectWithFinancials = projectsList.find((p) => p.financials !== undefined);
  assert.ok(projectWithFinancials, "Must contain at least one project with structured multi-head financials");

  const fin = projectWithFinancials!.financials!;
  assert.ok(fin.sanctionedTotalINR > 0, "Sanctioned amount must be positive");
  assert.ok(fin.totalDisbursedINR > 0, "Disbursed amount must be positive");
  assert.ok(fin.disbursements.length >= 2, "Must track multi-tranche disbursements");
  assert.ok(fin.budgetHeads.length >= 4, "Must track canonical GFR budget heads");

  // Sum of budget head allocations must equal total sanctioned budget
  const headAllocationsSum = fin.budgetHeads.reduce((acc, h) => acc + h.sanctionedAmountINR, 0);
  assert.equal(
    headAllocationsSum,
    fin.sanctionedTotalINR,
    "Sum of itemized budget head allocations must match total project sanctioned budget"
  );

  // Utilization certificate verification
  assert.ok(fin.utilizationCertificates.length >= 1, "Must contain formal GFR 12-A UCs");
  for (const uc of fin.utilizationCertificates) {
    assert.ok(uc.ucNumber.startsWith("CIIRC/UC/"), "UC number must follow institutional format");
    assert.ok(uc.interestEarnedINR >= 0, "Interest earned must be tracked");
    const netExpenditure = uc.expenditureIncurredINR - uc.interestEarnedINR;
    assert.ok(netExpenditure >= 0, "Net expenditure cannot be negative");
  }
});

test("Human Ethics: Institutional Ethics Committee (IEC) Protocol Compliance", async () => {
  const { ethicsProtocolsList } = await import("../src/data/mockData");
  assert.ok(ethicsProtocolsList.length >= 2, "Must track human ethics protocols");

  for (const ep of ethicsProtocolsList) {
    assert.ok(ep.protocolNumber.startsWith("CIIRC/"), "Protocol number must follow CIIRC nomenclature");
    assert.ok(ep.piName.length > 0, "Principal Investigator must be declared");
    assert.ok(ep.reviewStatus.length > 0, "Review status must be defined");
    assert.ok(ep.riskTier.length > 0, "Risk tier must be categorized");
    assert.equal(typeof ep.adverseEventsReported, "number");

    // Clinical trials must carry CTRI registration numbers
    if (ep.studyType.includes("Clinical Trial")) {
      assert.ok(ep.ctriNumber?.startsWith("CTRI/"), "Clinical trials require CTRI registration");
    }
  }
});

test("Statutory Archival: Research Data Retention Clocks & Integrity Hashes", async () => {
  const { dataRetentionRecordsList } = await import("../src/data/mockData");
  assert.ok(dataRetentionRecordsList.length >= 2, "Must contain statutory retention records");

  for (const dr of dataRetentionRecordsList) {
    assert.ok(dr.integrityHashSHA256.length === 64, "Must contain 64-character SHA-256 integrity hash");
    assert.ok(dr.volumeGB > 0, "Storage footprint must be tracked");
    assert.ok(dr.storageLocation.length > 0, "Storage location must be specified");
    assert.ok(dr.mandatoryRetentionYears >= 7, "Statutory data retention period must be at least 7 years");
  }
});

test("Academic Productivity: Faculty Research Incentive Calculations", async () => {
  const { researchIncentivesList } = await import("../src/data/mockData");
  assert.ok(researchIncentivesList.length >= 3, "Must track faculty research incentive records");

  for (const inc of researchIncentivesList) {
    assert.ok(inc.facultyName.length > 0, "Faculty name must be specified");
    assert.ok(inc.totalPoints > 0, "Total productivity points must be positive");
    assert.ok(inc.calculatedHonorariumINR > 0, "Calculated honorarium must be positive");

    // Standard institutional multiplier check: ₹1,000 per point
    assert.equal(
      inc.calculatedHonorariumINR,
      inc.totalPoints * 1000,
      "Honorarium must equal total points multiplied by ₹1,000"
    );
  }
});

test("Scholarly Output: Book and Book Chapter Metadata Schemas", async () => {
  const { publicationsList } = await import("../src/data/mockData");
  const book = publicationsList.find((p) => p.publicationType === "Book");
  const chapter = publicationsList.find((p) => p.publicationType === "Book Chapter");

  assert.ok(book, "Publications repository must include Book items");
  assert.ok(chapter, "Publications repository must include Book Chapter items");

  // Book metadata checks
  assert.ok(book!.bookMetadata?.isbn, "Book must include ISBN number");
  assert.ok(book!.bookMetadata?.publisher, "Book must specify publishing house");

  // Chapter metadata checks
  assert.ok(chapter!.bookMetadata?.bookTitle, "Book Chapter must specify containing book title");
  assert.ok(chapter!.bookMetadata?.pageRange, "Book Chapter must specify page range");
  assert.ok(chapter!.bookMetadata?.isbn, "Book Chapter must carry book ISBN");
});

test("Incubation Governance: Deep-Tech Equity Stakes & Exit Milestones", async () => {
  const { incubationAgreementsList } = await import("../src/data/mockData");
  assert.ok(incubationAgreementsList.length >= 2, "Must contain statutory incubation agreements");

  for (const agr of incubationAgreementsList) {
    assert.ok(agr.equityStakePercent > 0 && agr.equityStakePercent <= 10.0, "Equity stake must be between 0.1% and 10%");
    assert.ok(agr.exitMilestones.length >= 2, "Agreement must define tangible exit milestones");
    assert.ok(agr.resourceQuota.length > 0, "Resource quota (GPU/SIF access) must be stipulated");
    assert.ok(agr.studentInternshipSeats > 0, "Must guarantee student internship capacity");
  }
});

test("Institutional Policy: Vault Regulatory Charters Completeness", async () => {
  const { institutionalPoliciesList } = await import("../src/data/mockData");
  assert.ok(institutionalPoliciesList.length >= 5, "Policy Vault must contain at least 5 statutory charters");

  const policyCodes = new Set<string>();
  for (const pol of institutionalPoliciesList) {
    assert.ok(pol.policyCode.startsWith("CIIRC-POL-"), "Policy code must follow CIIRC-POL standard prefix");
    assert.equal(policyCodes.has(pol.policyCode), false, `Duplicate policy code: ${pol.policyCode}`);
    policyCodes.add(pol.policyCode);
    assert.ok(pol.authorizingBody.length > 0, "Authorizing governance body must be identified");
    assert.equal(pol.status, "Active Policy", "Institutional policies in vault must be Active");
    assert.ok(pol.summary.length > 20, "Must include executive summary");
  }
});

test("Institutional Identity: Official CIIRC Name Enforcement Across All Layers", async () => {
  const { conflictOfInterestDisclosuresList } = await import("../src/data/mockData");
  const expectedOfficialName = "Centre for Incubation, Innovation, Research and Consultancy (CIIRC)";

  // Verify COI disclosure department affiliation
  for (const coi of conflictOfInterestDisclosuresList) {
    if (coi.personDepartment.includes("CIIRC") || coi.personDepartment.includes("Centre for")) {
      assert.equal(
        coi.personDepartment,
        expectedOfficialName,
        `COI disclosure department must strictly match official CIIRC name. Found: ${coi.personDepartment}`
      );
    }
  }
});

test("First-Class Entities: Research Areas & Specializations Architecture", async () => {
  const { researchAreasList } = await import("../src/data/mockData");
  const { getSanitizedPublicResearchAreas } = await import("../src/lib/canonicalMetrics");

  assert.ok(researchAreasList.length >= 4, "Must define first-class research areas");
  for (const area of researchAreasList) {
    assert.ok(area.code.startsWith("RA-"), "Research area code must start with RA-");
    assert.ok(area.domainId.startsWith("dom-"), "Must map to a valid Research Domain");
    assert.ok(area.keywords.length >= 2, "Must specify descriptive research keywords");
    assert.ok(area.leadResearcherIds.length >= 1, "Must assign at least one lead researcher");
    assert.equal(typeof area.publicationsCount, "number");
    assert.equal(typeof area.activeProjectsCount, "number");
  }

  const sanitized = getSanitizedPublicResearchAreas();
  assert.equal(sanitized.length, researchAreasList.filter((a) => a.publicVisibility !== false).length);
});

test("Funding Agency Directory & Extramural Grant Governance", async () => {
  const { fundingAgenciesList } = await import("../src/data/mockData");
  assert.ok(fundingAgenciesList.length >= 4, "Must maintain funding agency directory");

  for (const fa of fundingAgenciesList) {
    assert.ok(fa.name.length > 3, "Funding agency name must be defined");
    assert.ok(["Government", "Industry", "International", "Institutional", "Internal"].includes(fa.type));
    assert.ok(fa.contactEmail.includes("@"), "Contact email must be valid");
    assert.ok(fa.website.startsWith("http"), "Agency website URL must be valid");
    assert.ok(fa.totalSanctionedINR > 0, "Sanctioned grant sum must be positive");
    assert.equal(fa.verifiedStatus, true, "Agencies in directory must be verified");
  }
});

test("Technology Transfer Pipeline & TRL Readiness Validation", async () => {
  const { technologiesList } = await import("../src/data/mockData");
  const { getSanitizedPublicTechnologies } = await import("../src/lib/canonicalMetrics");

  assert.ok(technologiesList.length >= 3, "Must track technology assets in transfer pipeline");
  for (const tech of technologiesList) {
    assert.ok(tech.trlLevel >= 1 && tech.trlLevel <= 9, "TRL level must be between 1 and 9");
    assert.ok(tech.inventorIds.length >= 1, "Technology must attribute inventor researchers");
    assert.ok(["Concept", "Simulation", "Benchtop", "Field Tested", "Commercial Ready"].includes(tech.prototypeStatus));
    assert.ok(["Research", "Prototype", "Validation", "IP Protected", "Industry Interest", "Licensing", "Commercialized"].includes(tech.technologyTransferStatus));
  }

  const sanitized = getSanitizedPublicTechnologies();
  assert.equal(sanitized.length, technologiesList.length);
});

test("Leadership & Governance: Institutional Profiles and Public Directory", async () => {
  const { leadershipProfilesList } = await import("../src/data/mockData");
  const { getSanitizedPublicLeadership } = await import("../src/lib/canonicalMetrics");

  assert.ok(leadershipProfilesList.length >= 4, "Must define institutional leadership profiles");
  for (const leader of leadershipProfilesList) {
    assert.ok(leader.name.length > 0, "Leader name must be defined");
    assert.ok(leader.email.endsWith("@ciirc.jyothyit.ac.in"), "Official leadership email must use institutional domain");
    assert.ok(leader.education.length >= 1, "Must list formal credentials");
    assert.ok(leader.experience.length >= 1, "Must list career track record");
    assert.ok(leader.displayOrder > 0, "Display order must be a positive integer");
  }

  const sanitized = getSanitizedPublicLeadership();
  assert.equal(sanitized[0].name, "Prof. Rajesh Mehta", "Director must be ranked first in display order");
});

test("CMS & News Engine: Content Lifecycle, Slugs, and Statutory Compliance Records", async () => {
  const { cmsPagesList, newsAnnouncementsList, complianceRecordsList, projectReportsList } = await import("../src/data/mockData");
  const { getSanitizedPublicCMSPages, getSanitizedPublicNews, getSanitizedPublicCompliance } = await import("../src/lib/canonicalMetrics");

  // CMS Pages
  assert.ok(cmsPagesList.length >= 4, "Must contain CMS pages");
  for (const pg of cmsPagesList) {
    assert.ok(pg.slug.startsWith("/"), "CMS page slug must start with /");
    assert.ok(pg.seoTitle.includes("CIIRC"), "SEO title must mention CIIRC");
    assert.ok(pg.version >= 1, "Version number must be at least 1");
  }

  // News & Announcements
  assert.ok(newsAnnouncementsList.length >= 3, "Must contain news items");
  const pinned = newsAnnouncementsList.filter((n) => n.isPinned);
  assert.ok(pinned.length >= 1, "Must have at least one pinned announcement");

  // Compliance Records
  assert.ok(complianceRecordsList.length >= 3, "Must track statutory compliance certifications");
  for (const c of complianceRecordsList) {
    assert.ok(c.certificateNumber.length > 5, "Certificate number must be recorded");
    assert.ok(c.validUntil > c.validFrom, "Validity expiration must follow inception");
  }

  // Formal Project Reports
  assert.ok(projectReportsList.length >= 3, "Must track project governance reports");
  for (const rep of projectReportsList) {
    assert.ok(rep.projectId.startsWith("proj-"), "Report must link to a valid project");
    assert.ok(rep.periodCovered.length > 0, "Reporting period must be specified");
  }

  // Public Sanitized Getters
  assert.ok(getSanitizedPublicCMSPages().length >= 1);
  assert.ok(getSanitizedPublicNews().length >= 1);
  assert.ok(getSanitizedPublicCompliance().length >= 1);
});

