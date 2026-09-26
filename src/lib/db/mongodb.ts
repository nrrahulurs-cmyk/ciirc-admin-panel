import { MongoClient, Db, MongoClientOptions } from "mongodb";
import {
  researchersList,
  projectsList,
  publicationsList,
  patentsList,
  eventsList,
  auditLogsList,
  workflowApprovalQueue,
  formSubmissionsList,
  mediaAssetsList,
} from "@/data/mockData";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || "";
const DB_NAME = process.env.MONGODB_DB_NAME || "ciirc_admin_os";

const options: MongoClientOptions = {
  maxPoolSize: 20,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 4000,
  connectTimeoutMS: 5000,
};

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

/**
 * Returns the MongoDB Database instance if MONGODB_URI is configured
 */
export async function getMongoDb(): Promise<Db | null> {
  if (!clientPromise) {
    return null;
  }
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.warn("MongoDB connection failed, falling back to canonical repository:", error);
    return null;
  }
}

/**
 * Ensures optimal production indexes across all institutional collections
 */
export async function ensureMongoIndexes(db: Db): Promise<{ indexed: string[]; errors: string[] }> {
  const indexed: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Researchers
    await db.collection("researchers").createIndex({ email: 1 }, { unique: true, sparse: true });
    await db.collection("researchers").createIndex({ department: 1, status: 1 });
    await db.collection("researchers").createIndex({ name: "text", department: "text" });
    indexed.push("researchers");

    // 2. Projects
    await db.collection("projects").createIndex({ code: 1 }, { unique: true, sparse: true });
    await db.collection("projects").createIndex({ status: 1, pi: 1 });
    indexed.push("projects");

    // 3. Publications
    await db.collection("publications").createIndex({ doi: 1 }, { sparse: true });
    await db.collection("publications").createIndex({ year: -1, status: 1 });
    indexed.push("publications");

    // 4. Patents
    await db.collection("patents").createIndex({ applicationNo: 1 }, { sparse: true });
    await db.collection("patents").createIndex({ status: 1 });
    indexed.push("patents");

    // 5. Events
    await db.collection("events").createIndex({ date: 1, status: 1 });
    indexed.push("events");

    // 6. Audit Logs
    await db.collection("audit_logs").createIndex({ timestamp: -1 });
    await db.collection("audit_logs").createIndex({ userId: 1, entityType: 1 });
    indexed.push("audit_logs");

    // 7. Workflow Queue
    await db.collection("workflow_queue").createIndex({ status: 1, submittedAt: -1 });
    indexed.push("workflow_queue");

    // 8. Form Submissions
    await db.collection("form_submissions").createIndex({ status: 1, submittedAt: -1 });
    indexed.push("form_submissions");

    // 9. Media Assets
    await db.collection("media_assets").createIndex({ id: 1 }, { unique: true });
    await db.collection("media_assets").createIndex({ folder: 1, type: 1 });
    indexed.push("media_assets");
  } catch (err: any) {
    errors.push(err.message || String(err));
  }

  return { indexed, errors };
}

/**
 * Seeds initial canonical records into MongoDB collections if currently empty
 */
export async function seedMongoIfEmpty(db: Db): Promise<{ seeded: string[] }> {
  const seeded: string[] = [];

  const checkAndSeed = async (collName: string, items: any[]) => {
    const count = await db.collection(collName).countDocuments();
    if (count === 0 && items.length > 0) {
      await db.collection(collName).insertMany(items.map((it) => ({ ...it, _syncedAt: new Date() })));
      seeded.push(`${collName} (${items.length} records)`);
    }
  };

  await checkAndSeed("researchers", researchersList);
  await checkAndSeed("projects", projectsList);
  await checkAndSeed("publications", publicationsList);
  await checkAndSeed("patents", patentsList);
  await checkAndSeed("events", eventsList);
  await checkAndSeed("audit_logs", auditLogsList);
  await checkAndSeed("workflow_queue", workflowApprovalQueue);
  await checkAndSeed("form_submissions", formSubmissionsList);
  await checkAndSeed("media_assets", mediaAssetsList);

  return { seeded };
}

/**
 * Diagnostic health check verifying MongoDB connection and latency
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  type: "mongodb" | "canonical-in-memory";
  latencyMs?: number;
  database?: string;
  error?: string;
}> {
  if (!uri) {
    return {
      connected: true,
      type: "canonical-in-memory",
      database: "ciirc-canonical-relational-memory",
    };
  }

  const start = Date.now();
  try {
    const db = await getMongoDb();
    if (!db) {
      return {
        connected: false,
        type: "canonical-in-memory",
        error: "Failed to initialize MongoDB client.",
      };
    }
    await db.command({ ping: 1 });
    const latencyMs = Date.now() - start;

    return {
      connected: true,
      type: "mongodb",
      latencyMs,
      database: DB_NAME,
    };
  } catch (err: any) {
    return {
      connected: false,
      type: "canonical-in-memory",
      error: err.message || "Ping command failed",
    };
  }
}
