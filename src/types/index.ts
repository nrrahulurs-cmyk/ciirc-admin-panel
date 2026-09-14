export type ModuleId =
  | "dashboard"
  // Content & CMS
  | "pages"
  | "news"
  | "banners"
  | "faqs"
  | "website-readiness"
  | "api-explorer"
  // Research & Innovation
  | "researchers"
  | "domains"
  | "research-areas"
  | "projects"
  | "publications"
  | "patents"
  | "technologies"
  | "relationship-explorer"
  // Facilities & Infrastructure
  | "facilities"
  | "labs"
  | "equipment"
  | "services"
  // Partnerships & Incubation
  | "partnerships"
  | "mous"
  | "consultancy"
  | "startups"
  | "iedc"
  // Operations & Governance
  | "operations"
  | "data-quality"
  | "workflow-approvals"
  | "service-desk"
  // People & Community
  | "faculty"
  | "scholars"
  | "departments"
  // Events
  | "events"
  | "speakers"
  | "venues"
  // Forms
  | "form-builder"
  | "form-submissions"
  | "enquiries"
  // Media & Assets
  | "media-library"
  // Analytics
  | "analytics"
  // Admin & Security
  | "users-rbac"
  | "audit-logs"
  | "system-settings"
  | "login";

// ==========================================
// 0. DATA CLASSIFICATION & SOURCE PROVENANCE
// ==========================================

export type DataClassification = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";

export type TemporalStatus = "Current" | "Historical" | "Archived" | "Scheduled" | "Draft";

export interface SourceProvenance {
  sourceUrl?: string;
  sourceType?: string;
  sourceDocument?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationStatus: "Verified" | "Needs Verification" | "Historical" | "Unverified";
}

// ==========================================
// 1. RESEARCH & PEOPLE ENTITIES
// ==========================================

export interface Researcher {
  id: string;
  name: string;
  title: string;
  role: string;
  department: string;
  domainId?: string;
  researchAreas: string[];
  avatar: string;
  email: string;
  phone: string;
  office: string;
  orcid?: string;
  googleScholar?: string;
  hIndex: number;
  citations: number;
  projectsCount: number;
  publicationsCount: number;
  patentsCount: number;
  status: "Active" | "On Leave" | "Emeritus" | "Incomplete";
  lastUpdated: string;
  biography: string;
  completenessScore?: number; // 0 - 100%
  awards: { year: string; title: string; issuer: string }[];
  collaborations: { institution: string; country: string; project: string; partnerId?: string }[];
  recentActivities: { date: string; action: string; title: string }[];
  publicVisibility?: boolean;
  classification?: DataClassification;
  temporalStatus?: TemporalStatus;
  provenance?: SourceProvenance;
}

export interface ResearchDomain {
  id: string;
  code: string;
  slug: string;
  name: string;
  shortDesc: string;
  detailedDesc: string;
  focusAreas: string[];
  heroImage: string;
  leadResearcherIds: string[];
  facilityIds: string[];
  totalGrantsValue: number;
  activeProjectsCount: number;
  publicationsCount: number;
  patentsCount: number;
  status: "Active" | "Emerging" | "Archived";
  publicVisibility?: boolean;
}

// ==========================================
// 2. PROJECT & FUNDING ENTITIES
// ==========================================

export type ProjectHealthStatus = "On Track" | "At Risk" | "Delayed" | "Blocked" | "Completed";

export interface ProjectMilestone {
  id: string;
  name: string;
  date: string;
  completed: boolean;
  deliverable?: string;
  verifiedBy?: string;
}

export interface Project {
  id: string;
  title: string;
  code: string;
  pi: string;
  piId?: string;
  coPis: string[];
  coPiIds?: string[];
  department: string;
  domainId?: string;
  researchArea: string;
  fundingAgency: string;
  fundingAgencyId?: string;
  grantNumber?: string;
  fundingAmount: number;
  utilizedAmount?: number;
  balanceAmount?: number;
  startDate: string;
  endDate: string;
  status: "Proposal" | "Submitted" | "Approved" | "Active" | "Under Review" | "In Review" | "Completed" | "Pending Approval" | "Extended" | "Closed";
  healthStatus?: ProjectHealthStatus;
  healthReason?: string;
  progress: number;
  milestones: (ProjectMilestone | { name: string; date: string; completed: boolean })[];
  financials?: ProjectFinancials;
  publicationsCount: number;
  lab: string;
  facilityId?: string;
  description: string;
  publicVisibility?: boolean;
  partnerId?: string;
  classification?: DataClassification;
  temporalStatus?: TemporalStatus;
  provenance?: SourceProvenance;
}

export interface FundingGrant {
  id: string;
  agencyName: string;
  partnerId?: string;
  program: string;
  grantNumber: string;
  projectId: string;
  projectTitle: string;
  piName: string;
  sanctionedAmount: number;
  utilizedAmount: number;
  balanceAmount: number;
  currency: string;
  financialYear: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Audited" | "Closed" | "Extension Requested";
  nextReportDue: string;
  classification?: DataClassification;
  temporalStatus?: TemporalStatus;
  provenance?: SourceProvenance;
}

// ==========================================
// 3. PUBLICATIONS & PATENTS
// ==========================================

export type PublicationWorkflowStage = "Draft" | "Review" | "IPR Review" | "Approved" | "Published" | "Archived";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  authorIds?: string[];
  researchArea: string;
  domainId?: string;
  projectId?: string;
  publicationType: "Journal" | "Conference" | "Book" | "Book Chapter" | "Patent Spec" | "Technical Report";
  journalOrConference: string;
  year: number;
  status: "Published" | "In Press" | "Under Review" | "Draft";
  workflowStage?: PublicationWorkflowStage;
  iprClearanceStatus?: "Cleared" | "Pending IPR Review" | "Exempt" | "Flagged";
  bookMetadata?: BookChapterMetadata;
  contributors?: {
    name: string;
    role: "PI" | "Co-PI" | "Researcher" | "Research Scholar" | "Student" | "RA" | "P-DRA" | "Technical Staff" | "External Collaborator";
    notes?: string;
    researcherId?: string;
  }[];
  acknowledgements?: string;
  fundingGrantId?: string;
  doi: string;
  citations: number;
  indexing?: ("Scopus" | "Web of Science" | "IEEE Xplore" | "PubMed")[];
  documents: string[];
  abstract: string;
  verified?: boolean;
  publicVisibility?: boolean;
}

export interface Patent {
  id: string;
  title: string;
  applicationNo: string;
  patentNo?: string;
  jurisdiction: "Indian Patent Office" | "USPTO" | "PCT / WIPO" | "EPO";
  status: "Idea" | "Filed" | "Published" | "Under Examination" | "Granted" | "Commercialized" | "Abandoned";
  inventors: string[];
  inventorIds?: string[];
  domainId?: string;
  projectId?: string;
  trl?: number; // 1 - 9
  filingDate: string;
  grantDate?: string;
  commercialStatus: "Licensed" | "Commercialized" | "Available" | "Internal Use";
  licensee?: string;
  publicVisibility?: boolean;
}

export interface ProductTechnology {
  id: string;
  name: string;
  code: string;
  tagline: string;
  domainId: string;
  leadResearcher: string;
  trl: number; // Technology Readiness Level 1-9
  stage: "Concept" | "Lab Prototype" | "Field Validated" | "Commercialized";
  patentNumber?: string;
  industryPartner?: string;
  description: string;
  publicVisibility?: boolean;
}

// ==========================================
// 4. FACILITIES & EQUIPMENT
// ==========================================

export type EquipmentOperationalStatus = "Available" | "Booked" | "Maintenance" | "Calibration" | "Offline";

export interface Facility {
  id: string;
  name: string;
  code: string;
  type: "Specialized Lab" | "Prototyping Arena" | "Cleanroom" | "Testing Facility";
  domainId: string;
  location: string;
  manager: string;
  managerEmail: string;
  description: string;
  equipmentCount: number;
  activeBookings: number;
  image: string;
  status: "Operational" | "Maintenance" | "Restricted";
  publicVisibility?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  facilityId: string;
  facilityName: string;
  manager: string;
  status: EquipmentOperationalStatus;
  warrantyExpiry: string;
  calibrationDueDate: string;
  daysToCalibration: number;
  maintenanceSchedule: string;
  utilizationRate: number; // 0 - 100%
  hourlyRateINR: number;
  sopAvailable: boolean;
  publicVisibility?: boolean;
}

export interface ServiceCatalogueItem {
  id: string;
  serviceName: string;
  code: string;
  category: "Material Characterization" | "Robotic Prototyping" | "Bio-Signal Analysis" | "Micro-Machining" | "AI Simulation";
  facilityName: string;
  equipmentUsed: string;
  turnaroundTimeDays: number;
  sampleRequirements: string;
  internalPriceINR: number;
  externalIndustryPriceINR: number;
  status: "Available" | "Waitlisted" | "Offline";
  publicVisibility?: boolean;
}

// ==========================================
// 5. COLLABORATIONS, MOUS & INCUBATION
// ==========================================

export interface PartnerOrg {
  id: string;
  name: string;
  type: "Academic" | "National Lab" | "Defense / Space" | "Industry";
  country: string;
  website: string;
  contactPerson: string;
  logo: string;
  activeProjects: number;
  classification?: DataClassification;
  temporalStatus?: TemporalStatus;
  provenance?: SourceProvenance;
}

export interface InstitutionalMOU {
  id: string;
  mouNumber: string;
  partnerId?: string;
  partnerName: string;
  partnerType: string;
  scope: string;
  leadCoordinator: string;
  domainId: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  alertLevel: "Normal" | "90 Days" | "60 Days" | "30 Days" | "Expired";
  status: "Active" | "Under Renewal" | "Completed" | "Pending Signing";
  documentUrl: string;
  classification?: DataClassification;
  temporalStatus?: TemporalStatus;
  provenance?: SourceProvenance;
}

export interface ConsultancyEngagement {
  id: string;
  projectCode: string;
  partnerId?: string;
  title: string;
  clientOrganization: string;
  piName: string;
  piId?: string;
  domainId?: string;
  budgetINR: number;
  revenueSharePercent?: {
    institute: number;
    department: number;
    piTeam: number;
  };
  expensesINR?: number;
  externalResourceCostsINR?: number;
  taxesINR?: number;
  approvals?: {
    role: string;
    approverName: string;
    status: "Pending" | "Approved" | "Rejected";
    approvedAt?: string;
  }[];
  settlementStatus?: "Pending" | "Interim Settled" | "Final Settlement Completed";
  stage: "Lead" | "Discussion" | "Proposal" | "Contract" | "Active" | "Completed";
  startDate: string;
  targetEndDate: string;
  status: "On Schedule" | "Milestone Review" | "Invoice Pending";
  classification?: DataClassification;
  temporalStatus?: TemporalStatus;
  provenance?: SourceProvenance;
}

export interface StartupEntity {
  id: string;
  name: string;
  founderNames: string[];
  mentorFaculty: string;
  domainId: string;
  stage: "Idea" | "Validation" | "Prototype" | "Incubation" | "Acceleration" | "Commercialized" | "Graduated";
  incubationCohort: string;
  fundingRaisedINR: number;
  patentsLicensed: string[];
  trl: number;
  iedcOriginated: boolean;
}

export interface IEDCProject {
  id: string;
  projectTitle: string;
  studentLead: string;
  facultyMentor: string;
  department: string;
  academicYear: string;
  grantAmountINR: number;
  prototypeStatus: "Concept" | "Working Model" | "Validated" | "Startup Candidate";
  convertedToStartup: boolean;
}

// ==========================================
// 6. OPERATIONS, GOVERNANCE & DATA QUALITY
// ==========================================

export interface OperationalDeadline {
  id: string;
  title: string;
  category: "Grant Deliverable" | "MOU Renewal" | "Equipment Calibration" | "Audit Report" | "IPR Filing";
  dueDate: string;
  urgency: "urgent" | "warning" | "info";
  assignedTo: string;
  linkedEntityId: string;
  linkedModule: ModuleId;
  status: "Pending" | "In Review" | "Completed";
}

export interface DataQualityIssue {
  id: string;
  severity: "Critical" | "Warning" | "Notice";
  entityType: "Researcher" | "Project" | "Publication" | "Patent" | "Equipment" | "MOU";
  entityId: string;
  entityName: string;
  issueDescription: string;
  remediationAction: string;
  targetModule: ModuleId;
}

export interface ServiceDeskTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: "Compute Cluster" | "Lab Access" | "Equipment Issue" | "Grants Finance" | "Profile Update" | "General Inquiry";
  requesterName: string;
  requesterEmail: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Open" | "Assigned" | "In Progress" | "Waiting" | "Resolved" | "Closed";
  assignedTo: string;
  createdAt: string;
  slaTarget: string;
  messagesCount: number;
}

export interface WorkflowApprovalItem {
  id: string;
  title: string;
  entityType: "Publication" | "Research Project" | "News Article" | "Event" | "Researcher Profile" | "MOU" | "Patent Filing";
  submittedBy: string;
  submittedByRole: string;
  stage: "Draft" | "Review" | "Approval" | "Publish";
  assignedReviewer: string;
  submittedAt: string;
  lastUpdated: string;
  commentsCount: number;
  urgency: "Urgent" | "Normal" | "Low";
  status: "Pending" | "Approved" | "Changes Requested" | "Rejected";
  summary: string;
}

// ==========================================
// 7. EVENTS, FORMS, MEDIA, AUDIT & SYSTEM
// ==========================================

export interface InstitutionalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "Conference" | "Workshop" | "Symposium" | "Distinguished Lecture" | "Hackathon" | "Training Program";
  speakers: string[];
  description: string;
  registeredCount: number;
  capacity: number;
  attendanceRate: number;
  status: "Upcoming" | "Live" | "Completed" | "Pending Approval";
  domainId?: string;
  publicVisibility?: boolean;
}

export interface FormSubmission {
  id: string;
  formType: "Contact Enquiry" | "Internship Application" | "Job Application" | "Collaboration Request" | "Facility Access Request";
  applicantName: string;
  email: string;
  organization: string;
  submittedAt: string;
  status: "New" | "Under Review" | "Shortlisted" | "Approved" | "Archived";
  priority: "High" | "Medium" | "Low";
  data: Record<string, string>;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  size: string;
  format: string;
  url: string;
  folder: string;
  tags: string[];
  dimensions?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AuditLogItem {
  id: string;
  user: string;
  userRole: string;
  userAvatar: string;
  action: string;
  entity: string;
  entityType: string;
  timestamp: string;
  ip: string;
  result: "Success" | "Warning" | "Failed";
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Administrator" | "Content Manager" | "Research Manager" | "Event Manager" | "Editor" | "Reviewer" | "Analyst" | "Director / Management" | "Lab Manager";
  department: string;
  status: "Active" | "Inactive" | "Suspended";
  lastActive: string;
  twoFactorEnabled: boolean;
  avatar: string;
}

export interface KPICardData {
  title: string;
  value: number | string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  sparkline: number[];
  icon: string;
}

// ==========================================
// 8. IPR & TECHNOLOGY TRANSFER
// ==========================================

export type IPRType = "Invention Disclosure" | "Provisional Patent" | "Complete Patent" | "Design Registration" | "Copyright / Software";

export interface IPRRecord {
  id: string;
  disclosureNumber: string;
  title: string;
  projectId?: string;
  projectTitle?: string;
  leadResearcher: string;
  researcherId?: string;
  inventors: string[];
  technologyDomain: string;
  confidentialityLevel: "High" | "Restricted" | "Standard";
  disclosureDate: string;
  iprType: IPRType;
  patentPotential: "High" | "Medium" | "Low" | "Defensive Publication";
  reviewStatus: "Submitted" | "IPR Committee Review" | "Prior Art Search" | "Recommended for Filing" | "Publication Cleared" | "Rejected";
  reviewerName?: string;
  reviewerDecision?: "Clear for Filing" | "Clear for Publication" | "Modifications Needed" | "Withhold";
  reviewerComments?: string;
  decisionDate?: string;
  documents: string[];
}

export interface TechnologyTransfer {
  id: string;
  code: string;
  title: string;
  leadResearcher: string;
  researcherId?: string;
  projectId?: string;
  patentId?: string;
  productId?: string;
  trl: number; // 1 - 9
  prototypeStatus: string;
  ipStatus: "Patent Filed" | "Patent Granted" | "Trade Secret" | "Open Source";
  industryInterest: "High" | "Active Discussions" | "MOU Signed" | "Evaluating";
  licensingStatus: "Available" | "Exclusive Negotiation" | "Non-Exclusive Licensed" | "Transferred";
  commercialPartner?: string;
  partnerId?: string;
  revenueINR?: number;
  pipelineStage: "Research" | "Prototype" | "Validation" | "IP Protected" | "Industry Engagement" | "Licensing" | "Commercialized";
}

export interface InstitutionalAward {
  id: string;
  title: string;
  recipientName: string;
  recipientId?: string;
  institution: string;
  category: "National Award" | "International Recognition" | "Young Scientist" | "Best Paper" | "Fellowship" | "Innovation Honor";
  year: number;
  level: "National" | "International" | "State" | "University";
  domainId?: string;
  projectId?: string;
  evidenceUrl?: string;
  certificateUrl?: string;
}

// ==========================================
// 9. SIF & ADVANCED LAB OPERATIONS
// ==========================================

export interface SIFInstrument {
  id: string;
  code: string;
  name: string;
  model: string;
  manufacturer: string;
  technicalSpecs: {
    resolutionRange: string;
    detector: string;
    capacity: string;
    supportedTechniques: string[];
  };
  sampleRequirements: string;
  sopUrl?: string;
  userGuideUrl?: string;
  operatorName: string;
  operatorEmail: string;
  facilityId: string;
  facilityName: string;
  availabilityStatus: "Available" | "Booked" | "Maintenance" | "Calibration";
  pricing: {
    internalStudentINR: number;
    internalFacultyINR: number;
    externalAcademicINR: number;
    externalIndustryINR: number;
  };
  externalAccessEnabled: boolean;
}

export interface SampleCharacterizationRequest {
  id: string;
  requestNumber: string;
  client: {
    name: string;
    organization: string;
    type: "Internal Scholar" | "Internal Faculty" | "External Academic" | "External Industry";
    address: string;
    mobile: string;
    email: string;
    gstn?: string;
  };
  samples: {
    sampleId: string;
    name: string;
    sampleType: string;
    composition: string;
    measurementDetails: string;
    specialHandling?: string;
  }[];
  requestedInstruments: string[]; // e.g. ["sif-01", "sif-02"]
  preferredDate: string;
  additionalRequirements?: string;
  workflowStage:
    | "Draft"
    | "Submitted"
    | "Technical Review"
    | "Quotation"
    | "Approved"
    | "Scheduled"
    | "Sample Received"
    | "Analysis In Progress"
    | "QA Review"
    | "Report Generated"
    | "Completed"
    | "Cancelled";
  technicianAssigned?: string;
  sampleConditionOnReceipt?: "Good" | "Compromised" | "Insufficient Quantity" | "Hazardous";
  chainOfCustodyLog: {
    timestamp: string;
    action: string;
    handledBy: string;
    remarks?: string;
  }[];
  analysisStatus: string;
  resultFiles: string[];
  quotationAmountINR?: number;
  invoiceNumber?: string;
  paymentStatus: "Unbilled" | "Quoted" | "Invoice Generated" | "Paid" | "Waived";
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCalibrationRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  serialNumber: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  vendor: string;
  certificateNumber: string;
  certificateUrl?: string;
  result: "Pass" | "Conditional Pass" | "Fail";
  status: "Valid" | "Due Soon" | "Due" | "Expired";
}

export interface EquipmentMaintenanceLog {
  id: string;
  equipmentId: string;
  equipmentName: string;
  vendor: string;
  serviceDate: string;
  issueType: "Preventive Maintenance" | "Breakdown" | "Optics Realignment" | "Software Upgrade";
  actionTaken: string;
  costINR: number;
  downtimeHours: number;
  nextScheduledService: string;
  technician: string;
  documents: string[];
}

export interface FacilityBooking {
  id: string;
  bookingRef: string;
  facilityId: string;
  facilityName: string;
  equipmentId?: string;
  equipmentName?: string;
  userType: "Researcher" | "Student" | "Incubatee" | "Industry Client";
  userName: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "Requested" | "Approved" | "Active" | "Completed" | "Cancelled";
  approvalBy?: string;
}

// ==========================================
// 10. GOVERNANCE, COI & INCUBATION
// ==========================================

export interface ConflictOfInterestDisclosure {
  id: string;
  referenceNumber: string;
  personName: string;
  personRole: string;
  personDepartment: string;
  relatedProjectId?: string;
  relatedProjectTitle?: string;
  relatedOrganization: string;
  disclosureDate: string;
  description: string;
  potentialConflictType: "Financial Interest" | "Advisory / Board Role" | "Family Affiliation" | "Procurement Entity" | "Equity Holding";
  reviewStatus: "Declared" | "Under Review" | "Resolved" | "Rejected" | "Monitoring";
  reviewerName?: string;
  resolutionDetails?: string;
  resolutionDate?: string;
  restrictedAccess: boolean;
}

export interface IncubationAgreement {
  id: string;
  startupId: string;
  startupName: string;
  agreementType: "Incubation Agreement" | "Pre-Incubation MOU" | "Graduation Agreement";
  equityStakePercent: number;
  facilityUsageScope: string;
  mentorshipAssigned: string;
  studentInternshipSeats: number;
  resourceQuota: string;
  startDate: string;
  durationMonths: number;
  exitMilestones: string[];
  status: "Active" | "Under Review" | "Renewed" | "Graduated" | "Terminated";
}

export interface TrainingProgram {
  id: string;
  programTitle: string;
  domainId: string;
  domainName: string;
  trainerName: string;
  trainerDesignation: string;
  targetAudience: "Undergraduate" | "Postgraduate" | "Doctoral Scholars" | "Industry Engineers" | "Faculty Development";
  organization: string;
  startDate: string;
  endDate: string;
  capacity: number;
  registeredCount: number;
  attendedCount: number;
  certificateIssued: boolean;
  averageFeedbackScore: number; // e.g. 4.8 / 5
}

export interface InstitutionalTimelineEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  category: "Foundation" | "Major Grant" | "SIF Inauguration" | "Patent Breakthrough" | "National Award" | "Strategic Alliance" | "Accreditation";
  description: string;
  image?: string;
  linkedProjectId?: string;
  linkedPatentId?: string;
  linkedPublicationId?: string;
  linkedAwardId?: string;
  importance: "Milestone" | "Key Event" | "Standard";
  publicVisibility: boolean;
}

export interface CanonicalImpactMetric {
  id: string;
  key: string;
  label: string;
  value: number | string;
  unit: string;
  period: string;
  source: string;
  verified: boolean;
  publicVisibility: boolean;
  priority: number;
  lastUpdated: string;
}

// ==========================================
// 11. FINANCIAL GOVERNANCE & UTILIZATION
// ==========================================

export interface BudgetHeadAllocation {
  id: string;
  category: "Equipment & Hardware" | "Manpower & Fellowships" | "Consumables & Chemicals" | "Travel & Fieldwork" | "Contingency" | "Institutional Overheads";
  sanctionedAmountINR: number;
  utilizedAmountINR: number;
  committedAmountINR: number;
  balanceAmountINR: number;
  utilizationPercentage: number;
}

export interface GrantDisbursement {
  id: string;
  trancheNumber: number;
  sanctionOrderNumber: string;
  releaseDate: string;
  amountINR: number;
  financialYear: string;
  bankRefNumber: string;
  status: "Credited" | "Scheduled" | "Awaiting UC Clearance";
}

export interface UtilizationCertificate {
  id: string;
  ucNumber: string;
  financialYear: string;
  periodFrom: string;
  periodTo: string;
  sanctionedAmountINR: number;
  interestEarnedINR: number;
  totalAvailableINR: number;
  expenditureIncurredINR: number;
  unspentBalanceINR: number;
  gfrFormType: "GFR 12-A" | "GFR 12-B" | "Custom Agency SoE";
  statutoryAuditorStatus: "Draft" | "Verified by Auditor" | "Countersigned by Director" | "Submitted to Ministry" | "Accepted by Agency";
  auditorName?: string;
  auditorMembershipNo?: string;
  certifiedDate?: string;
  documentUrl?: string;
}

export interface ProjectFinancials {
  projectId: string;
  currency: string;
  sanctionedTotalINR: number;
  totalDisbursedINR: number;
  totalUtilizedINR: number;
  balanceINR: number;
  overallBurnRate: number; // percentage 0-100
  budgetHeads: BudgetHeadAllocation[];
  disbursements: GrantDisbursement[];
  utilizationCertificates: UtilizationCertificate[];
}

// ==========================================
// 12. ETHICS & BIO-SAFETY PROTOCOLS (IEC / IBSC)
// ==========================================

export interface EthicsProtocol {
  id: string;
  protocolNumber: string; // e.g. "CIIRC/IEC/2025/11-B"
  title: string;
  committeeType: "IEC (Human Ethics)" | "IBSC (Bio-Safety)" | "IAEC (Animal Ethics)" | "Dual-Use / Cybernetic Safety";
  piName: string;
  piId?: string;
  projectId?: string;
  projectTitle?: string;
  collaboratingInstitutions: string[]; // e.g. ["AIIMS New Delhi"]
  studyType: "Clinical Trial Phase-2" | "Bio-Signal & EMG Collection" | "Recombinant DNA" | "Human Factors / Exoskeleton";
  ctriNumber?: string; // Clinical Trials Registry - India ID
  submissionDate: string;
  approvalDate?: string;
  validUntil?: string;
  reviewStatus: "Draft" | "Under Review" | "Modifications Requested" | "Approved" | "Active Monitoring" | "Completed" | "Suspended";
  riskTier: "Minimal Risk" | "Low Risk" | "Moderate Risk" | "High / Invasive Risk";
  informedConsentAudit: "Verified" | "Pending Audit" | "Exempt";
  adverseEventsReported: number;
  documents: string[];
}

// ==========================================
// 13. RESEARCH DATA MANAGEMENT & DOCUMENT RETENTION
// ==========================================

export interface DataRetentionRecord {
  id: string;
  recordCode: string; // e.g. "RDM-2025-EXO-01"
  datasetTitle: string;
  projectId: string;
  projectCode: string;
  piName: string;
  dataSteward: string;
  storageLocation: "On-Premises NAS Vault" | "Cold Glacier Archive" | "Secure Lab Server" | "Air-Gapped Encrypted Drive";
  volumeGB: number;
  dataClassification: DataClassification;
  statutoryBasis: "DST Extramural Guidelines" | "ICMR Clinical Trial Rules" | "DRDO Defence Security Schedule" | "Institutional Patent Defense";
  archivalDate: string;
  mandatoryRetentionYears: number; // e.g. 7 or 10 years
  destructionDueDate: string;
  dispositionAction: "Retain Indefinitely" | "Review at Expiry" | "Secure Destruction Authorized";
  retentionComplianceStatus: "Active Compliance" | "Archived" | "Pending Review" | "Under Legal Hold";
  integrityHashSHA256: string;
}

// ==========================================
// 14. RESEARCH INCENTIVE POINTS & HONORARIUMS
// ==========================================

export interface ResearchIncentiveRecord {
  id: string;
  facultyName: string;
  facultyId: string;
  department: string;
  academicYear: string;
  q1JournalPoints: number;
  q2JournalPoints: number;
  patentsGrantedPoints: number;
  sponsoredGrantPoints: number;
  consultancySharePoints: number;
  totalPoints: number;
  calculatedHonorariumINR: number;
  disbursementStatus: "Calculated" | "HOD Verified" | "Dean R&D Cleared" | "Finance Disbursed";
  disbursedDate?: string;
}

// ==========================================
// 15. INSTITUTIONAL POLICY VAULT
// ==========================================

export interface InstitutionalPolicy {
  id: string;
  policyCode: string; // e.g. "CIIRC-POL-IPR-01"
  title: string;
  category: "Intellectual Property" | "Research Ethics" | "Consultancy & Revenue Share" | "SIF Usage & Surcharges" | "Data Retention & Compliance" | "Faculty Incentives";
  version: string;
  effectiveDate: string;
  reviewDate: string;
  authorizingBody: "Board of Governors" | "Academic & Research Council" | "Directorate";
  status: "Active Policy" | "Under Revision" | "Superseded";
  summary: string;
  documentUrl: string;
}

// ==========================================
// 16. BOOKS & BOOK CHAPTERS METADATA
// ==========================================

export interface BookChapterMetadata {
  isbn: string;
  publisher: string;
  edition?: string;
  editors?: string[];
  bookTitle?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  pageRange?: string; // e.g. "145-182"
  seriesName?: string;
  scopusBookCitationIndexed?: boolean;
}

// ==========================================
// 17. NOTIFICATIONS & ALERTS
// ==========================================

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "Grant" | "MOU" | "Calibration" | "IPR" | "Ethics" | "System";
  urgency: "urgent" | "warning" | "info";
  timestamp: string;
  read: boolean;
  linkedModule: ModuleId;
  linkedEntityId?: string;
}

// ==========================================
// 18. RESEARCH AREAS & FUNDING AGENCIES
// ==========================================

export interface ResearchArea {
  id: string;
  code: string;
  name: string;
  domainId: string;
  domainName: string;
  description: string;
  keywords: string[];
  leadResearcherIds: string[];
  publicationsCount: number;
  activeProjectsCount: number;
  publicVisibility: boolean;
}

export interface FundingAgency {
  id: string;
  code: string;
  name: string;
  program: string;
  type: "Government" | "Industry" | "International" | "Institutional" | "Internal";
  contactPerson: string;
  contactEmail: string;
  website: string;
  activeGrantsCount: number;
  totalSanctionedINR: number;
  verifiedStatus: boolean;
}

// ==========================================
// 19. TECHNOLOGY ASSET & TRANSFER PIPELINE
// ==========================================

export interface Technology {
  id: string;
  title: string;
  slug: string;
  domainId: string;
  projectId?: string;
  patentId?: string;
  inventorIds: string[];
  trlLevel: number; // TRL 1 - 9
  prototypeStatus: "Concept" | "Simulation" | "Benchtop" | "Field Tested" | "Commercial Ready";
  industryInterest: string[];
  licensingStatus: "Available" | "Under Negotiation" | "Exclusive Licensed" | "Non-Exclusive Licensed";
  commercializationValueINR?: number;
  technologyTransferStatus:
    | "Research"
    | "Prototype"
    | "Validation"
    | "IP Protected"
    | "Industry Interest"
    | "Licensing"
    | "Commercialized";
  documents: string[];
}

// ==========================================
// 20. LEADERSHIP & GOVERNANCE PROFILES
// ==========================================

export interface LeadershipProfile {
  id: string;
  name: string;
  role: string;
  designation: string;
  qualification: string;
  email: string;
  photo: string;
  biography: string;
  education: string[];
  experience: string[];
  achievements: string[];
  researchPillars: string[];
  awards: string[];
  publicVisibility: boolean;
  displayOrder: number;
}

// ==========================================
// 21. CMS PAGES & NEWS ANNOUNCEMENTS
// ==========================================

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  template: "Standard" | "Hero-Split" | "Atlas" | "Policy";
  excerpt: string;
  contentMarkdown: string;
  author: string;
  status: "Draft" | "In Review" | "Approved" | "Scheduled" | "Published" | "Archived";
  lastUpdated: string;
  seoTitle: string;
  seoDescription: string;
  viewsCount: number;
  publicVisibility: boolean;
  version: number;
  changeSummary?: string;
}

export interface NewsAnnouncement {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category:
    | "Research Breakthrough"
    | "Grant Award"
    | "MoU Signing"
    | "Patent Granted"
    | "Student Achievement"
    | "Announcement";
  publishedDate: string;
  author: string;
  isPinned: boolean;
  publicVisibility: boolean;
  tags: string[];
  coverImage?: string;
  relatedDomainId?: string;
  relatedProjectId?: string;
}

// ==========================================
// 22. COMPLIANCE RECORDS & STATUTORY AUDIT
// ==========================================

export interface ComplianceRecord {
  id: string;
  title: string;
  regulatoryBody:
    | "DSIR"
    | "AICTE"
    | "NBA"
    | "NAAC"
    | "NIRF"
    | "Pollution Control Board"
    | "Atomic Energy Regulatory Board (AERB)";
  certificateNumber: string;
  validFrom: string;
  validUntil: string;
  complianceOfficer: string;
  status: "Active" | "Renewal Pending" | "Under Audit" | "Expired";
  documentUrl?: string;
  remarks?: string;
}

// ==========================================
// 23. PROJECT GOVERNANCE & FORMAL REPORTS
// ==========================================

export interface ProjectReport {
  id: string;
  projectId: string;
  projectTitle: string;
  reportType:
    | "Quarterly Milestone"
    | "Annual Progress Report (APR)"
    | "Mid-term Technical Review"
    | "Final Project Completion & Closure Report";
  submissionDate: string;
  dueDate: string;
  periodCovered: string;
  status: "Draft" | "Submitted" | "Under Agency Review" | "Accepted & Cleared";
  reviewerName?: string;
  approverComments?: string;
  signedUcUrl?: string;
  verifiedBy?: string;
  timestamp?: string;
}

