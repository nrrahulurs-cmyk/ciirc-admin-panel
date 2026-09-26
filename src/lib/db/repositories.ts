import { getMongoDb } from "./mongodb";
import { sanitizeNoSqlPayload } from "./nosqlSanitizer";
import {
  researchersList,
  projectsList,
  publicationsList,
  patentsList,
  eventsList,
  workflowApprovalQueue,
  formSubmissionsList,
  mediaAssetsList,
} from "@/data/mockData";
import { logAuditEntry, getAuditLogs } from "../auditLogger";
import {
  Researcher,
  Project,
  Publication,
  Patent,
  InstitutionalEvent,
  WorkflowApprovalItem,
  FormSubmission,
  MediaAsset,
  AuditLogItem,
} from "@/types";

// In-memory working copies for zero-downtime fallback
let inMemoryResearchers = [...researchersList];
let inMemoryProjects = [...projectsList];
let inMemoryPublications = [...publicationsList];
let inMemoryPatents = [...patentsList];
let inMemoryEvents = [...eventsList];
let inMemoryWorkflow = [...workflowApprovalQueue];
let inMemoryForms = [...formSubmissionsList];
let inMemoryMedia = [...mediaAssetsList];

export const researchersRepo = {
  async getAll(): Promise<Researcher[]> {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection<Researcher>("researchers").find({}).toArray();
      if (docs.length > 0) return docs;
    }
    return inMemoryResearchers;
  },

  async getById(id: string): Promise<Researcher | null> {
    const cleanId = String(id);
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection<Researcher>("researchers").findOne({ id: cleanId });
      if (doc) return doc;
    }
    return inMemoryResearchers.find((r) => r.id === cleanId) || null;
  },

  async create(data: Omit<Researcher, "id">, actorName = "Admin"): Promise<Researcher> {
    const cleanData = sanitizeNoSqlPayload(data);
    const id = `res-${Date.now()}`;
    const newRecord: Researcher = { ...(cleanData as any), id };

    const db = await getMongoDb();
    if (db) {
      await db.collection("researchers").insertOne(newRecord);
    }
    inMemoryResearchers.unshift(newRecord);

    logAuditEntry({
      userId: "usr-admin",
      userName: actorName,
      userRole: "Administrator",
      action: `Created researcher profile: ${newRecord.name}`,
      entityType: "Researcher",
      entityId: id,
      newValue: newRecord,
      status: "Success",
    });

    return newRecord;
  },

  async update(id: string, updates: Partial<Researcher>, actorName = "Admin"): Promise<Researcher | null> {
    const cleanId = String(id);
    const cleanUpdates = sanitizeNoSqlPayload(updates);

    const db = await getMongoDb();
    if (db) {
      await db.collection("researchers").updateOne({ id: cleanId }, { $set: cleanUpdates });
    }

    const idx = inMemoryResearchers.findIndex((r) => r.id === cleanId);
    if (idx !== -1) {
      inMemoryResearchers[idx] = { ...inMemoryResearchers[idx], ...cleanUpdates };
      logAuditEntry({
        userId: "usr-admin",
        userName: actorName,
        userRole: "Administrator",
        action: `Updated researcher profile: ${inMemoryResearchers[idx].name}`,
        entityType: "Researcher",
        entityId: cleanId,
        newValue: cleanUpdates,
        status: "Success",
      });
      return inMemoryResearchers[idx];
    }
    return null;
  },

  async delete(id: string, actorName = "Super Admin"): Promise<boolean> {
    const cleanId = String(id);
    const db = await getMongoDb();
    if (db) {
      await db.collection("researchers").deleteOne({ id: cleanId });
    }

    const before = inMemoryResearchers.length;
    inMemoryResearchers = inMemoryResearchers.filter((r) => r.id !== cleanId);
    const deleted = inMemoryResearchers.length < before;

    if (deleted) {
      logAuditEntry({
        userId: "usr-superadmin",
        userName: actorName,
        userRole: "Super Admin",
        action: `Deleted researcher profile [${cleanId}]`,
        entityType: "Researcher",
        entityId: cleanId,
        status: "Success",
      });
    }

    return deleted;
  },

  async count(filter?: { status?: string }): Promise<number> {
    const db = await getMongoDb();
    if (db) {
      const cleanFilter = sanitizeNoSqlPayload(filter || {});
      const c = await db.collection("researchers").countDocuments(cleanFilter);
      if (c > 0) return c;
    }
    if (filter?.status) {
      return inMemoryResearchers.filter((r) => r.status === filter.status).length;
    }
    return inMemoryResearchers.length;
  },
};

export const workflowRepo = {
  async getQueue(): Promise<WorkflowApprovalItem[]> {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection<WorkflowApprovalItem>("workflow_queue").find({}).toArray();
      if (docs.length > 0) return docs;
    }
    return inMemoryWorkflow;
  },

  async updateStatus(id: string, status: "Approved" | "Rejected" | "Changes Requested", remarks = "", actorName = "Admin"): Promise<WorkflowApprovalItem | null> {
    const cleanId = String(id);
    const db = await getMongoDb();
    if (db) {
      await db.collection("workflow_queue").updateOne({ id: cleanId }, { $set: { status, remarks, lastUpdated: new Date().toISOString() } });
    }

    const idx = inMemoryWorkflow.findIndex((w) => w.id === cleanId);
    if (idx !== -1) {
      inMemoryWorkflow[idx] = { ...inMemoryWorkflow[idx], status, lastUpdated: new Date().toISOString() };
      logAuditEntry({
        userId: "usr-admin",
        userName: actorName,
        userRole: "Super Admin",
        action: `Workflow submission [${cleanId}] transitioned to ${status}`,
        entityType: "WorkflowApproval",
        entityId: cleanId,
        newValue: { status, remarks },
        status: "Success",
      });
      return inMemoryWorkflow[idx];
    }
    return null;
  },

  async countPending(): Promise<number> {
    const db = await getMongoDb();
    if (db) {
      const c = await db.collection("workflow_queue").countDocuments({ status: "Pending" });
      if (c > 0) return c;
    }
    return inMemoryWorkflow.filter((w) => w.status === "Pending").length;
  },
};

export const formSubmissionsRepo = {
  async getAll(): Promise<FormSubmission[]> {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection<FormSubmission>("form_submissions").find({}).toArray();
      if (docs.length > 0) return docs;
    }
    return inMemoryForms;
  },

  async updateStatus(id: string, status: FormSubmission["status"], actorName = "Admin"): Promise<FormSubmission | null> {
    const cleanId = String(id);
    const db = await getMongoDb();
    if (db) {
      await db.collection("form_submissions").updateOne({ id: cleanId }, { $set: { status } });
    }

    const idx = inMemoryForms.findIndex((f) => f.id === cleanId);
    if (idx !== -1) {
      inMemoryForms[idx] = { ...inMemoryForms[idx], status };
      logAuditEntry({
        userId: "usr-admin",
        userName: actorName,
        userRole: "Administrator",
        action: `Updated enquiry status [${cleanId}] to ${status}`,
        entityType: "FormSubmission",
        entityId: cleanId,
        newValue: { status },
        status: "Success",
      });
      return inMemoryForms[idx];
    }
    return null;
  },

  async countNew(): Promise<number> {
    const db = await getMongoDb();
    if (db) {
      const c = await db.collection("form_submissions").countDocuments({ status: "New" });
      if (c > 0) return c;
    }
    return inMemoryForms.filter((f) => f.status === "New").length;
  },
};

export const eventsRepo = {
  async getAll(): Promise<InstitutionalEvent[]> {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection<InstitutionalEvent>("events").find({}).toArray();
      if (docs.length > 0) return docs;
    }
    return inMemoryEvents;
  },

  async create(data: Omit<InstitutionalEvent, "id">, actorName = "Admin"): Promise<InstitutionalEvent> {
    const cleanData = sanitizeNoSqlPayload(data);
    const id = `ev-${Date.now()}`;
    const newRecord: InstitutionalEvent = { ...(cleanData as any), id };

    const db = await getMongoDb();
    if (db) {
      await db.collection("events").insertOne(newRecord);
    }
    inMemoryEvents.unshift(newRecord);

    logAuditEntry({
      userId: "usr-admin",
      userName: actorName,
      userRole: "Event Manager",
      action: `Scheduled event: ${newRecord.title}`,
      entityType: "InstitutionalEvent",
      entityId: id,
      newValue: newRecord,
      status: "Success",
    });

    return newRecord;
  },

  async countUpcoming(): Promise<number> {
    const db = await getMongoDb();
    if (db) {
      const c = await db.collection("events").countDocuments({ status: "Upcoming" });
      if (c > 0) return c;
    }
    return inMemoryEvents.filter((e) => e.status === "Upcoming").length;
  },
};

export const mediaRepo = {
  async getAll(): Promise<MediaAsset[]> {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection<MediaAsset>("media_assets").find({}).toArray();
      if (docs.length > 0) return docs;
    }
    return inMemoryMedia;
  },

  async create(asset: MediaAsset, actorName = "Admin"): Promise<MediaAsset> {
    const cleanAsset = sanitizeNoSqlPayload(asset);
    const db = await getMongoDb();
    if (db) {
      await db.collection("media_assets").insertOne(cleanAsset);
    }
    inMemoryMedia.unshift(cleanAsset);

    logAuditEntry({
      userId: "usr-admin",
      userName: actorName,
      userRole: "Content Manager",
      action: `Uploaded asset: ${asset.name}`,
      entityType: "MediaAsset",
      entityId: asset.id,
      status: "Success",
    });

    return cleanAsset;
  },

  async delete(id: string, actorName = "Admin"): Promise<boolean> {
    const cleanId = String(id);
    const db = await getMongoDb();
    if (db) {
      await db.collection("media_assets").deleteOne({ id: cleanId });
    }

    const before = inMemoryMedia.length;
    inMemoryMedia = inMemoryMedia.filter((m) => m.id !== cleanId);
    const deleted = inMemoryMedia.length < before;

    if (deleted) {
      logAuditEntry({
        userId: "usr-admin",
        userName: actorName,
        userRole: "Content Manager",
        action: `Deleted asset [${cleanId}]`,
        entityType: "MediaAsset",
        entityId: cleanId,
        status: "Success",
      });
    }

    return deleted;
  },
};
