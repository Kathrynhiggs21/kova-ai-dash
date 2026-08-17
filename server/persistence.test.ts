import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { integrationRecords, storedFiles } from "../drizzle/schema";

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    ensureDefaultIntegrations: vi.fn(),
    updateIntegrationRecord: vi.fn(),
    listStoredFiles: vi.fn(),
    getIntegrationRecord: vi.fn(),
    createStoredFile: vi.fn(),
  };
});

vi.mock("./storage", () => ({
  storagePut: vi.fn(),
}));

import { appRouter } from "./routers";
import {
  createStoredFile,
  createStoredFileForDb,
  ensureDefaultIntegrations,
  ensureDefaultIntegrationsForDb,
  getIntegrationRecord,
  listStoredFiles,
  updateIntegrationRecord,
} from "./db";
import { storagePut } from "./storage";
import { normalizeUploadFileName } from "./fileValidation";

const integrationRecord = {
  id: 14,
  userId: 7,
  slug: "gmail",
  name: "Gmail",
  category: "Google",
  iconUrl: "https://example.com/gmail.png",
  status: "connected" as const,
  description: "Inbox access",
  actionLabel: null,
  actionUrl: null,
  note: "Operational",
  sortOrder: 1,
  metadata: { steps: ["Connect Gmail"] },
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};

function createAuthenticatedContext(): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "sample-user",
      email: "sample@example.com",
      name: "Sample User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createControlledDatabase() {
  const insertedIntegrations: unknown[] = [];
  const insertedFiles: unknown[] = [];
  const existingRows: Array<{ slug: string }> = [];
  const seededRows = [integrationRecord];
  let configuredSelection: unknown;

  const db = {
    select(selection?: unknown) {
      configuredSelection = selection;
      const builder: Record<string, (...args: unknown[]) => unknown> = {};
      builder.from = () => builder;
      builder.where = () => builder;
      builder.orderBy = () => Promise.resolve(seededRows);
      builder.limit = () => Promise.resolve([{
        ...integrationRecord,
        id: 42,
        fileName: "brief.pdf",
        fileKey: "7-files/brief.pdf",
        fileUrl: "/manus-storage/7-files/brief.pdf",
        contentType: "application/pdf",
        sizeBytes: 12,
        integrationId: 14,
      }]);
      builder.then = (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
        Promise.resolve(configuredSelection ? existingRows : seededRows).then(resolve, reject);
      return builder;
    },
    insert(table: unknown) {
      return {
        values(values: unknown) {
          if (table === integrationRecords) insertedIntegrations.push(values);
          if (table === storedFiles) insertedFiles.push(values);
          return Promise.resolve([{ insertId: 42 }]);
        },
      };
    },
  };

  return {
    db: db as unknown as Parameters<typeof ensureDefaultIntegrationsForDb>[0],
    insertedIntegrations,
    insertedFiles,
  };
}

describe("file validation", () => {
  it("removes path traversal characters while preserving a usable extension", () => {
    expect(normalizeUploadFileName("../../My Report (Final).pdf")).toBe("My-Report-Final.pdf");
  });

  it("falls back to a safe filename when the input has no usable characters", () => {
    expect(normalizeUploadFileName("../../")).toBe("upload.bin");
  });
});

describe("database helpers", () => {
  it("seeds missing default integrations through the real helper", async () => {
    const controlled = createControlledDatabase();
    const result = await ensureDefaultIntegrationsForDb(controlled.db, 7);
    expect(controlled.insertedIntegrations).toHaveLength(1);
    expect((controlled.insertedIntegrations[0] as Array<{ slug: string }>).some(item => item.slug === "gmail")).toBe(true);
    expect(result[0]).toMatchObject({ slug: "gmail", userId: 7 });
  });

  it("persists and returns stored-file metadata through the real helper", async () => {
    const controlled = createControlledDatabase();
    const result = await createStoredFileForDb(controlled.db, {
      userId: 7,
      integrationId: 14,
      fileName: "brief.pdf",
      fileKey: "7-files/brief.pdf",
      fileUrl: "/manus-storage/7-files/brief.pdf",
      contentType: "application/pdf",
      sizeBytes: 12,
      metadata: null,
    });
    expect(controlled.insertedFiles).toHaveLength(1);
    expect(result).toMatchObject({ id: 42, fileName: "brief.pdf", fileKey: "7-files/brief.pdf" });
  });
});

describe("protected persistence routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ensureDefaultIntegrations).mockResolvedValue([integrationRecord]);
    vi.mocked(updateIntegrationRecord).mockResolvedValue(integrationRecord);
    vi.mocked(listStoredFiles).mockResolvedValue([]);
    vi.mocked(getIntegrationRecord).mockResolvedValue(integrationRecord);
    vi.mocked(storagePut).mockResolvedValue({ key: "7-files/report-final.pdf", url: "/manus-storage/7-files/report-final.pdf" });
    vi.mocked(createStoredFile).mockImplementation(async record => ({
      id: 99,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...record,
    }));
  });

  it("requires authentication to list integrations", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    await expect(caller.integration.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("lists persisted integrations through the typed route", async () => {
    const caller = appRouter.createCaller(createAuthenticatedContext());
    const result = await caller.integration.list();
    expect(result[0]).toMatchObject({ id: "gmail", name: "Gmail", steps: ["Connect Gmail"] });
    expect(ensureDefaultIntegrations).toHaveBeenCalledWith(7);
  });

  it("updates a persisted integration record", async () => {
    const caller = appRouter.createCaller(createAuthenticatedContext());
    const result = await caller.integration.update({ slug: "gmail", status: "warning", note: "Review access" });
    expect(result).toMatchObject({ id: "gmail", name: "Gmail" });
    expect(updateIntegrationRecord).toHaveBeenCalledWith(7, "gmail", expect.objectContaining({ status: "warning", note: "Review access" }));
  });

  it("requires authentication to list stored files", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    await expect(caller.files.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("lists persisted file metadata", async () => {
    vi.mocked(listStoredFiles).mockResolvedValue([
      {
        id: 99,
        fileName: "brief.pdf",
        fileKey: "7-files/brief.pdf",
        fileUrl: "/manus-storage/7-files/brief.pdf",
        contentType: "application/pdf",
        sizeBytes: 12,
        integrationId: 14,
        createdAt: new Date(),
      },
    ]);
    const caller = appRouter.createCaller(createAuthenticatedContext());
    const result = await caller.files.list();
    expect(result[0]).toMatchObject({ fileName: "brief.pdf", integrationId: 14 });
  });

  it("uploads bytes to storage and persists its metadata", async () => {
    const caller = appRouter.createCaller(createAuthenticatedContext());
    const data = Buffer.from("hello Kova").toString("base64");
    const result = await caller.files.upload({
      fileName: "../../report final.pdf",
      contentType: "application/pdf",
      data: `data:application/pdf;base64,${data}`,
      integrationSlug: "gmail",
    });

    expect(storagePut).toHaveBeenCalledWith(
      expect.stringContaining("7-files/"),
      expect.any(Buffer),
      "application/pdf",
    );
    expect(createStoredFile).toHaveBeenCalledWith(expect.objectContaining({
      userId: 7,
      integrationId: 14,
      fileName: "report-final.pdf",
      sizeBytes: 10,
    }));
    expect(result).toMatchObject({ id: 99, fileName: "report-final.pdf" });
  });

  it("surfaces storage failures instead of writing incomplete metadata", async () => {
    vi.mocked(storagePut).mockRejectedValueOnce(new Error("storage unavailable"));
    const caller = appRouter.createCaller(createAuthenticatedContext());
    const data = Buffer.from("hello").toString("base64");
    await expect(caller.files.upload({
      fileName: "brief.txt",
      contentType: "text/plain",
      data,
    })).rejects.toThrow("storage unavailable");
    expect(createStoredFile).not.toHaveBeenCalled();
  });
});
