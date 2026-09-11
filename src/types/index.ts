export type ModuleId =
  | "dashboard"
  // Content
  | "pages"
  | "news"
  | "banners"
  | "faqs"
  // Research
  | "researchers"
  | "research-areas"
  | "projects"
  | "publications"
  | "patents"
  | "labs"
  // People
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
  // Media
  | "media-library"
  // Workflow
  | "workflow-approvals"
  // Analytics
  | "analytics"
  // Admin
  | "users-rbac"
  | "audit-logs"
  | "system-settings";

export interface Researcher {
  id: string;
  name: string;
  title: string;
  role: string;
  department: string;
  researchAreas: string[];
  avatar: string;
  email: string;
  phone: string;
  office: string;
  hIndex: number;
  citations: number;
  projectsCount: number;
  publicationsCount: number;
  patentsCount: number;
  status: "Active" | "On Leave" | "Emeritus" | "Incomplete";
  lastUpdated: string;
  biography: string;
  awards: { year: string; title: string; issuer: string }[];
  collaborations: { institution: string; country: string; project: string }[];
  recentActivities: { date: string; action: string; title: string }[];
}

export interface Project {
  id: string;
  title: string;
  code: string;
  pi: string;
  coPis: string[];
  department: string;
  researchArea: string;
  fundingAgency: string;
  fundingAmount: number;
  startDate: string;
  endDate: string;
  status: "Active" | "In Review" | "Completed" | "Pending Approval";
  progress: number;
  milestones: { name: string; date: string; completed: boolean }[];
  publicationsCount: number;
  lab: string;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  researchArea: string;
  publicationType: "Journal" | "Conference" | "Book Chapter" | "Patent Spec";
  journalOrConference: string;
  year: number;
  status: "Published" | "In Press" | "Under Review" | "Draft";
  doi: string;
  citations: number;
  documents: string[];
  abstract: string;
}

export interface Patent {
  id: string;
  title: string;
  applicationNo: string;
  jurisdiction: "Indian Patent Office" | "USPTO" | "PCT / WIPO" | "EPO";
  status: "Granted" | "Under Examination" | "Filed" | "Published";
  inventors: string[];
  filingDate: string;
  grantDate?: string;
  commercialStatus: "Licensed" | "Commercialized" | "Available" | "Internal Use";
}

export interface InstitutionalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "Conference" | "Workshop" | "Symposium" | "Distinguished Lecture" | "Hackathon";
  speakers: string[];
  description: string;
  registeredCount: number;
  capacity: number;
  attendanceRate: number;
  status: "Upcoming" | "Live" | "Completed" | "Pending Approval";
}

export interface FormSubmission {
  id: string;
  formType: "Contact Enquiry" | "Internship Application" | "Job Application" | "Collaboration Request";
  applicantName: string;
  email: string;
  organization: string;
  submittedAt: string;
  status: "New" | "Under Review" | "Shortlisted" | "Approved" | "Archived";
  priority: "High" | "Medium" | "Low";
  data: Record<string, string>;
}

export interface WorkflowApprovalItem {
  id: string;
  title: string;
  entityType: "Publication" | "Research Project" | "News Article" | "Event" | "Researcher Profile";
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
  role: "Super Admin" | "Administrator" | "Content Manager" | "Research Manager" | "Event Manager" | "Editor" | "Reviewer" | "Analyst";
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
