import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertIntegrationRecord,
  InsertStoredFile,
  InsertUser,
  integrationRecords,
  storedFiles,
  users,
} from "../drizzle/schema";
import { DEFAULT_INTEGRATIONS } from "../shared/defaultIntegrations";
import { ENV } from "./_core/env";

type Database = ReturnType<typeof drizzle>;

let _db: Database | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getIntegrationRecordsForDb(db: Database, userId: number) {
  return db
    .select()
    .from(integrationRecords)
    .where(eq(integrationRecords.userId, userId))
    .orderBy(asc(integrationRecords.sortOrder), asc(integrationRecords.name));
}

export async function getIntegrationRecords(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return getIntegrationRecordsForDb(db, userId);
}

export async function ensureDefaultIntegrationsForDb(db: Database, userId: number) {
  const existing = await db
    .select({ slug: integrationRecords.slug })
    .from(integrationRecords)
    .where(eq(integrationRecords.userId, userId));
  const existingSlugs = new Set(existing.map(record => record.slug));
  const missing: InsertIntegrationRecord[] = DEFAULT_INTEGRATIONS.filter(
    integration => !existingSlugs.has(integration.id),
  ).map((integration, index) => ({
    userId,
    slug: integration.id,
    name: integration.name,
    category: integration.category,
    iconUrl: integration.icon,
    status: integration.status,
    description: integration.description,
    actionLabel: integration.actionLabel,
    actionUrl: integration.actionUrl,
    note: integration.note,
    sortOrder: index,
    metadata: integration.steps ? { steps: integration.steps } : null,
  }));

  if (missing.length > 0) await db.insert(integrationRecords).values(missing);
  return getIntegrationRecordsForDb(db, userId);
}

export async function ensureDefaultIntegrations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return ensureDefaultIntegrationsForDb(db, userId);
}

export async function updateIntegrationRecord(
  userId: number,
  slug: string,
  values: Partial<Pick<InsertIntegrationRecord, "status" | "note" | "description" | "actionUrl">>,
) {
  const db = await getDb();
  if (!db) return undefined;
  await db
    .update(integrationRecords)
    .set(values)
    .where(and(eq(integrationRecords.userId, userId), eq(integrationRecords.slug, slug)));
  const result = await db
    .select()
    .from(integrationRecords)
    .where(and(eq(integrationRecords.userId, userId), eq(integrationRecords.slug, slug)))
    .limit(1);
  return result[0];
}

export async function getIntegrationRecord(userId: number, slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(integrationRecords)
    .where(and(eq(integrationRecords.userId, userId), eq(integrationRecords.slug, slug)))
    .limit(1);
  return result[0];
}

export async function listStoredFiles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: storedFiles.id,
      fileName: storedFiles.fileName,
      fileKey: storedFiles.fileKey,
      fileUrl: storedFiles.fileUrl,
      contentType: storedFiles.contentType,
      sizeBytes: storedFiles.sizeBytes,
      integrationId: storedFiles.integrationId,
      createdAt: storedFiles.createdAt,
    })
    .from(storedFiles)
    .where(eq(storedFiles.userId, userId))
    .orderBy(desc(storedFiles.createdAt));
}

export async function createStoredFileForDb(db: Database, record: InsertStoredFile) {
  const result = await db.insert(storedFiles).values(record);
  const id = Number(result[0].insertId);
  const created = await db.select().from(storedFiles).where(eq(storedFiles.id, id)).limit(1);
  return created[0];
}

export async function createStoredFile(record: InsertStoredFile) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return createStoredFileForDb(db, record);
}

export async function getStoredFileById(userId: number, id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(storedFiles)
    .where(and(eq(storedFiles.id, id), eq(storedFiles.userId, userId)))
    .limit(1);
  return result[0];
}
