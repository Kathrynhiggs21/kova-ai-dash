import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { IntegrationRecord } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createStoredFile,
  ensureDefaultIntegrations,
  getIntegrationRecord,
  listStoredFiles,
  updateIntegrationRecord,
} from "./db";
import { storagePut } from "./storage";
import { normalizeUploadFileName } from "./fileValidation";

const integrationStatus = z.enum([
  "connected",
  "needs_action",
  "error",
  "not_accessible",
  "warning",
]);

function serializeIntegration(record: IntegrationRecord) {
  const metadata = record.metadata as { steps?: unknown } | null;
  return {
    id: record.slug,
    databaseId: record.id,
    name: record.name,
    category: record.category,
    icon: record.iconUrl ?? "",
    status: record.status,
    description: record.description ?? "",
    actionLabel: record.actionLabel ?? undefined,
    actionUrl: record.actionUrl ?? undefined,
    note: record.note ?? undefined,
    steps: Array.isArray(metadata?.steps)
      ? metadata.steps.filter((step): step is string => typeof step === "string")
      : undefined,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  integration: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const records = await ensureDefaultIntegrations(ctx.user.id);
      return records.map(serializeIntegration);
    }),

    update: protectedProcedure
      .input(
        z.object({
          slug: z.string().min(1).max(96),
          status: integrationStatus.optional(),
          note: z.string().max(5000).nullable().optional(),
          description: z.string().max(5000).nullable().optional(),
          actionUrl: z.string().url().max(1024).nullable().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const record = await updateIntegrationRecord(ctx.user.id, input.slug, {
          status: input.status,
          note: input.note,
          description: input.description,
          actionUrl: input.actionUrl,
        });
        if (!record) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Integration record not found" });
        }
        return serializeIntegration(record);
      }),
  }),

  files: router({
    list: protectedProcedure.query(({ ctx }) => listStoredFiles(ctx.user.id)),

    upload: protectedProcedure
      .input(
        z.object({
          fileName: z.string().min(1).max(255),
          contentType: z.string().min(1).max(160),
          data: z.string().min(1),
          integrationSlug: z.string().max(96).optional(),
          metadata: z.record(z.string(), z.string()).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const integration = input.integrationSlug
          ? await getIntegrationRecord(ctx.user.id, input.integrationSlug)
          : undefined;
        if (input.integrationSlug && !integration) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Integration record not found" });
        }

        const encoded = input.data.includes(",") ? input.data.slice(input.data.indexOf(",") + 1) : input.data;
        const buffer = Buffer.from(encoded, "base64");
        const maxBytes = 25 * 1024 * 1024;
        if (buffer.byteLength > maxBytes) {
          throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Files must be 25 MB or smaller" });
        }

        const safeName = normalizeUploadFileName(input.fileName);
        const { key, url } = await storagePut(
          `${ctx.user.id}-files/${Date.now()}-${safeName}`,
          buffer,
          input.contentType,
        );
        const file = await createStoredFile({
          userId: ctx.user.id,
          integrationId: integration?.id ?? null,
          fileName: safeName,
          fileKey: key,
          fileUrl: url,
          contentType: input.contentType,
          sizeBytes: buffer.byteLength,
          metadata: input.metadata ?? null,
        });
        return file;
      }),
  }),
});

export type AppRouter = typeof appRouter;
