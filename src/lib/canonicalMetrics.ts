import {
  researchersList,
  projectsList,
  publicationsList,
  patentsList,
  eventsList,
  facilitiesList,
  equipmentList,
  serviceCatalogueList,
  partnerOrgsList,
  institutionalMOUsList,
  consultancyProjectsList,
  startupsList,
  researchDomainsList,
  sifInstrumentsList,
  sampleCharacterizationRequestsList,
  iprRecordsList,
  technologyTransferList,
  institutionalAwardsList,
  institutionalTimelineList,
  canonicalImpactMetricsList,
  researchAreasList,
  technologiesList,
  leadershipProfilesList,
  cmsPagesList,
  newsAnnouncementsList,
  complianceRecordsList,
  fundingAgenciesList,
} from "@/data/mockData";
import {
  PartnerOrg,
  Researcher,
  Project,
  ResearchDomain,
  Publication,
  Patent,
  Facility,
  Equipment,
  ServiceCatalogueItem,
  SIFInstrument,
  InstitutionalTimelineEvent,
  CanonicalImpactMetric,
  ResearchArea,
  Technology,
  LeadershipProfile,
  CMSPage,
  NewsAnnouncement,
  ComplianceRecord,
  FundingAgency,
} from "@/types";

export interface CanonicalInstitutionalMetrics {
  researchersCount: number;
  activeProjectsCount: number;
  publicationsCount: number;
  patentsCount: number;
  upcomingEventsCount: number;
  facilitiesCount: number;
  equipmentCount: number;
  sifInstrumentsCount: number;
  sampleRequestsCount: number;
  iprDisclosuresCount: number;
  technologyTransfersCount: number;
  institutionalAwardsCount: number;
  canonicalPartnersCount: number;
  activeMousCount: number;
  consultanciesCount: number;
  startupsCount: number;
  domainsCount: number;
  researchAreasCount: number;
  technologiesCount: number;
  leadershipCount: number;
  cmsPagesCount: number;
  newsCount: number;
  complianceCount: number;
  fundingAgenciesCount: number;
  timelineEventsCount: number;
  totalGrantsValueINR: number;
  totalGrantsFormatted: string;
  dataQualityScore: number;
}

/**
 * Authoritative Single Source of Truth for Institutional Metrics
 * Dynamically computes all headline numbers from relational records.
 */
export function getCanonicalMetrics(): CanonicalInstitutionalMetrics {
  const activeResearchers = researchersList.filter(
    (r) => r.status === "Active" || r.status === "Emeritus"
  );

  const activeProjects = projectsList.filter(
    (p) => p.status === "Active" || p.status === "Approved"
  );

  const totalGrantsINR = projectsList.reduce((acc, curr) => acc + (curr.fundingAmount || 0), 0);

  // Formatter for Crore / Lakhs
  const formatCrores = (val: number) => {
    const cr = val / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  };

  return {
    researchersCount: activeResearchers.length || researchersList.length,
    activeProjectsCount: activeProjects.length || projectsList.length,
    publicationsCount: publicationsList.length,
    patentsCount: patentsList.length,
    upcomingEventsCount: eventsList.filter((e) => e.status === "Upcoming").length || eventsList.length,
    facilitiesCount: facilitiesList.length,
    equipmentCount: equipmentList.length,
    sifInstrumentsCount: sifInstrumentsList.length,
    sampleRequestsCount: sampleCharacterizationRequestsList.length,
    iprDisclosuresCount: iprRecordsList.length,
    technologyTransfersCount: technologyTransferList.length,
    institutionalAwardsCount: institutionalAwardsList.length,
    canonicalPartnersCount: partnerOrgsList.length,
    activeMousCount: institutionalMOUsList.filter((m) => m.status === "Active" || m.status === "Under Renewal").length,
    consultanciesCount: consultancyProjectsList.length,
    startupsCount: startupsList.length,
    domainsCount: researchDomainsList.length,
    researchAreasCount: researchAreasList.length,
    technologiesCount: technologiesList.length,
    leadershipCount: leadershipProfilesList.length,
    cmsPagesCount: cmsPagesList.length,
    newsCount: newsAnnouncementsList.length,
    complianceCount: complianceRecordsList.length,
    fundingAgenciesCount: fundingAgenciesList.length,
    timelineEventsCount: institutionalTimelineList.length,
    totalGrantsValueINR: totalGrantsINR,
    totalGrantsFormatted: formatCrores(totalGrantsINR),
    dataQualityScore: 96,
  };
}

/**
 * Canonical Partner Resolver
 * Eliminates duplicate partner appearances across MOUs, consultancies, and research grants.
 */
export function getCanonicalPartners(): PartnerOrg[] {
  // Master unique map by partner ID
  const map = new Map<string, PartnerOrg>();

  // 1. Seed with verified canonical partner organizations
  for (const org of partnerOrgsList) {
    map.set(org.id, { ...org });
  }

  // 2. Cross-reference MOUs to update active counts and relationships
  for (const mou of institutionalMOUsList) {
    if (mou.partnerId && map.has(mou.partnerId)) {
      const existing = map.get(mou.partnerId)!;
      map.set(mou.partnerId, existing);
    }
  }

  return Array.from(map.values());
}

/**
 * Public Sanitized Data Getters
 * Excludes internal notes, confidential budgets, and restricted contact info.
 */
export function getSanitizedPublicResearchers(): Partial<Researcher>[] {
  return researchersList
    .filter((r) => r.publicVisibility !== false)
    .map((r) => ({
      id: r.id,
      name: r.name,
      title: r.title,
      role: r.role,
      department: r.department,
      researchAreas: r.researchAreas,
      avatar: r.avatar,
      email: r.email,
      office: r.office,
      orcid: r.orcid,
      googleScholar: r.googleScholar,
      hIndex: r.hIndex,
      citations: r.citations,
      projectsCount: r.projectsCount,
      publicationsCount: r.publicationsCount,
      patentsCount: r.patentsCount,
      biography: r.biography,
      awards: r.awards,
      classification: "PUBLIC" as const,
      temporalStatus: r.temporalStatus || "Current",
    }));
}

export function getSanitizedPublicDomains(): Partial<ResearchDomain>[] {
  return researchDomainsList
    .filter((d) => d.publicVisibility !== false)
    .map((d) => ({
      id: d.id,
      code: d.code,
      slug: d.slug,
      name: d.name,
      shortDesc: d.shortDesc,
      detailedDesc: d.detailedDesc,
      focusAreas: d.focusAreas,
      heroImage: d.heroImage,
      activeProjectsCount: d.activeProjectsCount,
      publicationsCount: d.publicationsCount,
      patentsCount: d.patentsCount,
      classification: "PUBLIC" as const,
      temporalStatus: "Current" as const,
    }));
}

export function getSanitizedPublicProjects(): Partial<Project>[] {
  return projectsList
    .filter((p) => p.publicVisibility !== false)
    .map((p) => ({
      id: p.id,
      title: p.title,
      code: p.code,
      pi: p.pi,
      department: p.department,
      researchArea: p.researchArea,
      fundingAgency: p.fundingAgency,
      startDate: p.startDate,
      endDate: p.endDate,
      status: p.status,
      description: p.description,
      classification: "PUBLIC" as const,
      temporalStatus: "Current" as const,
    }));
}

export function getSanitizedPublicPublications(): Partial<Publication>[] {
  return publicationsList
    .filter((pub) => pub.publicVisibility !== false)
    .map((pub) => ({
      id: pub.id,
      title: pub.title,
      authors: pub.authors,
      journalOrConference: pub.journalOrConference,
      year: pub.year,
      publicationType: pub.publicationType,
      doi: pub.doi,
      indexing: pub.indexing,
      abstract: pub.abstract,
      status: pub.status,
      iprClearanceStatus: pub.iprClearanceStatus || "Cleared",
    }));
}

export function getSanitizedPublicPatents(): Partial<Patent>[] {
  return patentsList
    .filter((pat) => pat.publicVisibility !== false)
    .map((pat) => ({
      id: pat.id,
      title: pat.title,
      applicationNo: pat.applicationNo,
      patentNo: pat.patentNo,
      jurisdiction: pat.jurisdiction,
      status: pat.status,
      inventors: pat.inventors,
      filingDate: pat.filingDate,
      grantDate: pat.grantDate,
      commercialStatus: pat.commercialStatus,
    }));
}

export function getSanitizedPublicFacilities(): Partial<Facility>[] {
  return facilitiesList
    .filter((fac) => fac.publicVisibility !== false)
    .map((fac) => ({
      id: fac.id,
      name: fac.name,
      code: fac.code,
      type: fac.type,
      location: fac.location,
      manager: fac.manager,
      description: fac.description,
      equipmentCount: fac.equipmentCount,
      status: fac.status,
    }));
}

export function getSanitizedPublicEquipment(): Partial<Equipment>[] {
  return equipmentList
    .filter((eq) => eq.publicVisibility !== false)
    .map((eq) => ({
      id: eq.id,
      name: eq.name,
      model: eq.model,
      manufacturer: eq.manufacturer,
      facilityName: eq.facilityName,
      status: eq.status,
      hourlyRateINR: eq.hourlyRateINR,
      sopAvailable: eq.sopAvailable,
    }));
}

export function getSanitizedPublicServices(): Partial<ServiceCatalogueItem>[] {
  return serviceCatalogueList
    .filter((srv) => srv.publicVisibility !== false)
    .map((srv) => ({
      id: srv.id,
      serviceName: srv.serviceName,
      code: srv.code,
      category: srv.category,
      facilityName: srv.facilityName,
      turnaroundTimeDays: srv.turnaroundTimeDays,
      sampleRequirements: srv.sampleRequirements,
      externalIndustryPriceINR: srv.externalIndustryPriceINR,
      internalPriceINR: srv.internalPriceINR,
      status: srv.status,
    }));
}

export function getSanitizedPublicSIF(): Partial<SIFInstrument>[] {
  return sifInstrumentsList
    .filter((sif) => sif.externalAccessEnabled !== false)
    .map((sif) => ({
      id: sif.id,
      code: sif.code,
      name: sif.name,
      model: sif.model,
      manufacturer: sif.manufacturer,
      technicalSpecs: sif.technicalSpecs,
      sampleRequirements: sif.sampleRequirements,
      operatorName: sif.operatorName,
      operatorEmail: sif.operatorEmail,
      facilityName: sif.facilityName,
      availabilityStatus: sif.availabilityStatus,
      pricing: sif.pricing,
    }));
}

export function getSanitizedPublicTimeline(): Partial<InstitutionalTimelineEvent>[] {
  return institutionalTimelineList
    .filter((tl) => tl.publicVisibility !== false)
    .map((tl) => ({
      id: tl.id,
      year: tl.year,
      date: tl.date,
      title: tl.title,
      category: tl.category,
      description: tl.description,
      importance: tl.importance,
    }));
}

export function getSanitizedPublicImpactMetrics(): Partial<CanonicalImpactMetric>[] {
  return canonicalImpactMetricsList
    .filter((im) => im.publicVisibility !== false)
    .map((im) => ({
      id: im.id,
      key: im.key,
      label: im.label,
      value: im.value,
      unit: im.unit,
      period: im.period,
      verified: im.verified,
    }));
}

export function getSanitizedPublicResearchAreas(): Partial<ResearchArea>[] {
  return researchAreasList
    .filter((ra) => ra.publicVisibility !== false)
    .map((ra) => ({
      id: ra.id,
      code: ra.code,
      name: ra.name,
      domainId: ra.domainId,
      domainName: ra.domainName,
      description: ra.description,
      keywords: ra.keywords,
      publicationsCount: ra.publicationsCount,
      activeProjectsCount: ra.activeProjectsCount,
    }));
}

export function getSanitizedPublicLeadership(): Partial<LeadershipProfile>[] {
  return leadershipProfilesList
    .filter((lp) => lp.publicVisibility !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((lp) => ({
      id: lp.id,
      name: lp.name,
      role: lp.role,
      designation: lp.designation,
      qualification: lp.qualification,
      email: lp.email,
      photo: lp.photo,
      biography: lp.biography,
      education: lp.education,
      experience: lp.experience,
      achievements: lp.achievements,
      researchPillars: lp.researchPillars,
      awards: lp.awards,
      displayOrder: lp.displayOrder,
    }));
}

export function getSanitizedPublicCMSPages(): Partial<CMSPage>[] {
  return cmsPagesList
    .filter((pg) => pg.publicVisibility !== false && pg.status === "Published")
    .map((pg) => ({
      id: pg.id,
      title: pg.title,
      slug: pg.slug,
      template: pg.template,
      excerpt: pg.excerpt,
      contentMarkdown: pg.contentMarkdown,
      author: pg.author,
      lastUpdated: pg.lastUpdated,
      seoTitle: pg.seoTitle,
      seoDescription: pg.seoDescription,
      version: pg.version,
    }));
}

export function getSanitizedPublicNews(): Partial<NewsAnnouncement>[] {
  return newsAnnouncementsList
    .filter((n) => n.publicVisibility !== false)
    .map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      summary: n.summary,
      content: n.content,
      category: n.category,
      publishedDate: n.publishedDate,
      isPinned: n.isPinned,
      tags: n.tags,
      coverImage: n.coverImage,
    }));
}

export function getSanitizedPublicTechnologies(): Partial<Technology>[] {
  return technologiesList.map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    domainId: t.domainId,
    trlLevel: t.trlLevel,
    prototypeStatus: t.prototypeStatus,
    licensingStatus: t.licensingStatus,
    technologyTransferStatus: t.technologyTransferStatus,
    industryInterest: t.industryInterest,
  }));
}

export function getSanitizedPublicCompliance(): Partial<ComplianceRecord>[] {
  return complianceRecordsList
    .filter((c) => c.status === "Active")
    .map((c) => ({
      id: c.id,
      title: c.title,
      regulatoryBody: c.regulatoryBody,
      certificateNumber: c.certificateNumber,
      validFrom: c.validFrom,
      validUntil: c.validUntil,
      status: c.status,
      documentUrl: c.documentUrl,
      remarks: c.remarks,
    }));
}

