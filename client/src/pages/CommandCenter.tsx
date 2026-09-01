/*
 * KOVA OS COMMAND CENTER
 *
 * Privacy boundary: this client module contains provider-level launch links
 * only. User-specific folders, page IDs, site IDs, family data, and private
 * project mappings must come from an authenticated server procedure rather
 * than being embedded in the browser bundle.
 */

import { useMemo } from "react";
import {
  Activity,
  ExternalLink,
  FolderOpen,
  Github,
  LayoutDashboard,
  LockKeyhole,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

type RecordedStatus =
  | "connected"
  | "needs_action"
  | "error"
  | "not_accessible"
  | "warning";

const SAFE_LAUNCHERS = [
  {
    name: "Google Drive",
    description: "Open your Drive home",
    url: "https://drive.google.com",
    icon: "📁",
  },
  {
    name: "Gmail",
    description: "Open your inbox",
    url: "https://mail.google.com",
    icon: "✉️",
  },
  {
    name: "Google Calendar",
    description: "Open your calendar",
    url: "https://calendar.google.com",
    icon: "📅",
  },
  {
    name: "Notion",
    description: "Open your Notion workspace",
    url: "https://www.notion.so",
    icon: "◼️",
  },
  {
    name: "Asana",
    description: "Open your task workspace",
    url: "https://app.asana.com",
    icon: "✅",
  },
  {
    name: "Slack",
    description: "Open your Slack workspace",
    url: "https://app.slack.com",
    icon: "💬",
  },
  {
    name: "GitHub",
    description: "Open GitHub",
    url: "https://github.com",
    icon: "🐙",
  },
  {
    name: "Wix",
    description: "Open your sites dashboard",
    url: "https://manage.wix.com",
    icon: "🌐",
  },
  {
    name: "ChatGPT",
    description: "Open ChatGPT",
    url: "https://chatgpt.com",
    icon: "✨",
  },
  {
    name: "Claude",
    description: "Open Claude",
    url: "https://claude.ai",
    icon: "🧬",
  },
  {
    name: "Gemini",
    description: "Open Gemini",
    url: "https://gemini.google.com",
    icon: "💎",
  },
  {
    name: "Manus",
    description: "Open Manus",
    url: "https://manus.im",
    icon: "🤖",
  },
] as const;

const STATUS_STYLES: Record<RecordedStatus, string> = {
  connected: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  needs_action: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  error: "border-rose-500/25 bg-rose-500/10 text-rose-300",
  not_accessible: "border-zinc-500/25 bg-zinc-500/10 text-zinc-400",
};

const STATUS_LABELS: Record<RecordedStatus, string> = {
  connected: "Recorded connected",
  needs_action: "Recorded action needed",
  warning: "Recorded warning",
  error: "Recorded error",
  not_accessible: "Recorded unavailable",
};

export default function CommandCenter() {
  const integrationsQuery = trpc.integration.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const groupedIntegrations = useMemo(() => {
    const groups = new Map<
      string,
      NonNullable<typeof integrationsQuery.data>
    >();
    for (const integration of integrationsQuery.data ?? []) {
      const current = groups.get(integration.category) ?? [];
      current.push(integration);
      groups.set(integration.category, current);
    }
    return Array.from(groups.entries());
  }, [integrationsQuery.data]);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <header className="border-b border-white/8 bg-gradient-to-b from-violet-950/30 to-transparent px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15">
              <LayoutDashboard className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold">
                  Kova OS Command Center
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  <LockKeyhole className="h-2.5 w-2.5" /> Private
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                A secure launchpad for Kova services and recorded integration
                state.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-300" />
            <p className="text-xs leading-relaxed text-zinc-400">
              Personalized folder, page, site, and family mappings are
              intentionally excluded from the public browser bundle. Provider
              launchers below open each service at its authenticated home page.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-8">
        <section>
          <div className="mb-4 flex items-center gap-3">
            <FolderOpen className="h-4 w-4 text-cyan-300" />
            <h2 className="font-display text-lg font-bold">
              Service Launchers
            </h2>
            <span className="ml-auto text-xs text-zinc-600">
              Provider-level links only
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SAFE_LAUNCHERS.map(launcher => (
              <a
                key={launcher.name}
                href={launcher.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 p-4 transition hover:border-white/15 hover:bg-white/7"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/6 text-lg">
                  {launcher.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-semibold text-white">
                    {launcher.name}
                  </span>
                  <span className="block truncate text-xs text-zinc-500">
                    {launcher.description}
                  </span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-600 transition group-hover:text-zinc-300" />
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-4 w-4 text-violet-300" />
            <h2 className="font-display text-lg font-bold">
              Integration Registry
            </h2>
            <button
              type="button"
              onClick={() => integrationsQuery.refetch()}
              disabled={integrationsQuery.isFetching}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3 w-3 ${integrationsQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
            <Server className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
            <p className="text-xs leading-relaxed text-zinc-400">
              These are authenticated, persisted records—not live connector
              probes. A status should only be treated as verified after Kova
              adds evidence-backed health checks and a last-checked timestamp.
            </p>
          </div>

          {integrationsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-xl border border-white/8 bg-white/4"
                />
              ))}
            </div>
          ) : integrationsQuery.isError ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 text-sm text-rose-200">
              The integration registry could not be loaded. Refresh the page or
              verify the authenticated database connection.
            </div>
          ) : groupedIntegrations.length === 0 ? (
            <div className="rounded-xl border border-white/8 bg-white/4 p-8 text-center">
              <Zap className="mx-auto mb-3 h-6 w-6 text-zinc-600" />
              <p className="text-sm font-medium text-zinc-300">
                No integration records are configured.
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Add records through the protected Kova integration workflow.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedIntegrations.map(([category, integrations]) => (
                <div key={category}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {integrations.map(integration => (
                      <article
                        key={integration.id}
                        className="rounded-xl border border-white/8 bg-white/4 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/8 bg-white/5">
                            {integration.icon ? (
                              <img
                                src={integration.icon}
                                alt=""
                                className="h-5 w-5 object-contain"
                              />
                            ) : (
                              <Zap className="h-4 w-4 text-zinc-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate font-display text-sm font-semibold text-white">
                              {integration.name}
                            </h4>
                            <span
                              className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] ${STATUS_STYLES[integration.status as RecordedStatus]}`}
                            >
                              {
                                STATUS_LABELS[
                                  integration.status as RecordedStatus
                                ]
                              }
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                          {integration.description ||
                            "No description recorded."}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-white/8 bg-white/4 p-5">
          <div className="flex items-start gap-3">
            <Github className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
            <div>
              <h2 className="font-display text-sm font-semibold">
                Private project links
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                Deep links can return later through a protected server-side
                configuration endpoint. They should never be hard-coded into
                client source or shipped in a public JavaScript bundle.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
