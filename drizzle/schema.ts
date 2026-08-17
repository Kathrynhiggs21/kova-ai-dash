import {
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing the Manus OAuth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User-owned connection records. The slug is stable across UI releases while
 * the rest of the record can be edited or synchronized over time.
 */
export const integrationRecords = mysqlTable(
  "integration_records",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 96 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    category: varchar("category", { length: 96 }).notNull(),
    iconUrl: varchar("iconUrl", { length: 512 }),
    status: mysqlEnum("status", [
      "connected",
      "needs_action",
      "error",
      "not_accessible",
      "warning",
    ])
      .default("connected")
      .notNull(),
    description: text("description"),
    actionLabel: varchar("actionLabel", { length: 160 }),
    actionUrl: varchar("actionUrl", { length: 1024 }),
    note: text("note"),
    sortOrder: int("sortOrder").default(0).notNull(),
    metadata: json("metadata"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userSlug: uniqueIndex("integration_records_user_slug_idx").on(table.userId, table.slug),
    userCategory: index("integration_records_user_category_idx").on(table.userId, table.category),
  }),
);

export type IntegrationRecord = typeof integrationRecords.$inferSelect;
export type InsertIntegrationRecord = typeof integrationRecords.$inferInsert;

/**
 * Metadata for objects stored in the platform's S3-compatible file storage.
 * The database stores references and ownership; file bytes stay in storage.
 */
export const storedFiles = mysqlTable(
  "stored_files",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    integrationId: int("integrationId").references(() => integrationRecords.id, {
      onDelete: "set null",
    }),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileKey: varchar("fileKey", { length: 512 }).notNull().unique(),
    fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
    contentType: varchar("contentType", { length: 160 }).notNull(),
    sizeBytes: int("sizeBytes").default(0).notNull(),
    metadata: json("metadata"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userCreated: index("stored_files_user_created_idx").on(table.userId, table.createdAt),
    integration: index("stored_files_integration_idx").on(table.integrationId),
  }),
);

export type StoredFile = typeof storedFiles.$inferSelect;
export type InsertStoredFile = typeof storedFiles.$inferInsert;
