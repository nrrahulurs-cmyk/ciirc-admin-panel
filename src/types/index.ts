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
  publicationType: "Journal" | "Conference" | "Book Chapter" | "Patent Spec" | "Technical Report";
  journalOrConference: string;
  year: number;
  status: "Published" | "In Press" | "Under Review" | "Draft";
  workflowStage?: PublicationWorkflowStage;
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
  budgetINR: number;
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
