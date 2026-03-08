/*
 * KOVA OS INTEGRATION HUB — Home Page
 * Design: Premium SaaS Dark Dashboard — Liquid Orb Edition
 * All integrations with one-click connect/configure links
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Lock,
  ExternalLink,
  Settings,
  Zap,
  RefreshCw,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const ORB_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309818529/KywZHjdnZoy9ZJkeuXSWsQ/kova-hero-orb-b7b4wYvkEusLkjqB2BHk4K.webp";

type Status = "connected" | "needs_action" | "error" | "not_accessible";

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: Status;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  steps?: string[];
  note?: string;
}

const INTEGRATIONS: Integration[] = [
  // Google
  {
    id: "google-drive",
    name: "Google Drive",
    category: "Google",
    icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png",
    status: "connected",
    description: "Full file & folder management across all 15 Kova worlds.",
    note: "Connected via native gws CLI — no action needed.",
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Google",
    icon: "https://ssl.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png",
    status: "connected",
    description: "Search, read, send, and manage labels across your inbox.",
    note: "Connected via MCP — fully operational.",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Google",
    icon: "https://ssl.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png",
    status: "connected",
    description: "Create, update, search, and delete calendar events.",
    note: "Connected via MCP — fully operational.",
  },
  // Microsoft
  {
    id: "outlook-mail",
    name: "Outlook Mail",
    category: "Microsoft",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/48px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png",
    status: "connected",
    description: "Search, read, and send messages via Outlook.",
    note: "Connected via MCP — fully operational.",
  },
  {
    id: "outlook-calendar",
    name: "Outlook Calendar",
    category: "Microsoft",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/48px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png",
    status: "connected",
    description: "Create, update, search, and delete Outlook calendar events.",
    note: "Connected via MCP — fully operational.",
  },
  // Productivity
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    status: "connected",
    description: "Create and update pages, manage databases, build your Kova OS dashboard.",
    note: "Connected via MCP — Kova OS Master Dashboard is live.",
  },
  {
    id: "asana",
    name: "Asana",
    category: "Productivity",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Asana_logo.svg/48px-Asana_logo.svg.png",
    status: "connected",
    description: "Manage goals, tasks, projects, and portfolios.",
    note: "Connected via MCP — fully operational.",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Productivity",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/48px-Slack_icon_2019.svg.png",
    status: "connected",
    description: "Send messages, search channels, read threads, create canvases.",
    note: "Connected via MCP — fully operational.",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Productivity",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HubSpot_Logo.svg/48px-HubSpot_Logo.svg.png",
    status: "connected",
    description: "CRM contacts, companies, deals, and associations.",
    note: "Connected via MCP — fully operational.",
  },
  // Automation
  {
    id: "zapier",
    name: "Zapier",
    category: "Automation",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zapier_logo.svg/48px-Zapier_logo.svg.png",
    status: "needs_action",
    description: "Automate workflows between apps. Connected but needs actions configured.",
    actionLabel: "Configure Zapier Actions",
    actionUrl: "https://mcp.zapier.com/mcp/servers/e8c7456b-6c58-4026-9c3a-1cbec58f4f10/config",
    steps: [
      "Click 'Configure Zapier Actions' to open your Zapier MCP settings.",
      "Log in to Zapier if prompted.",
      "Click 'Add Action' and choose any app you want Manus to control (e.g., Gmail, Sheets, Airtable).",
      "Configure the action (e.g., 'Create a new row in Google Sheets').",
      "Save and return — Manus will now be able to trigger that action on demand.",
    ],
    note: "Server is connected. You just need to add at least one action to unlock automation.",
  },
  {
    id: "make",
    name: "Make",
    category: "Automation",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Make_%28software%29_logo.svg/48px-Make_%28software%29_logo.svg.png",
    status: "error",
    description: "Visual automation platform. OAuth authentication failed.",
    actionLabel: "Reconnect Make",
    actionUrl: "https://manus.im/settings/integrations",
    steps: [
      "Go to Manus Settings → Integrations.",
      "Find 'Make' in the list and click 'Disconnect'.",
      "Click 'Connect' and follow the OAuth flow to re-authenticate.",
      "Once connected, create an 'On Demand' scenario in Make to enable it here.",
    ],
    note: "OAuth 404 error — token likely expired. Re-authentication required.",
  },
  // Web / CMS
  {
    id: "wix",
    name: "Wix",
    category: "Web",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Wix.com_website_logo.svg/48px-Wix.com_website_logo.svg.png",
    status: "connected",
    description: "Manage all your Wix sites: Scribbles by Marcy, Hope 4 Anxiety, katyandblake, Fite Club, and more.",
    note: "Reconnected Mar 6 2026 — 14 sites detected.",
  },
  {
    id: "canva",
    name: "Canva",
    category: "Web",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Canva_Logo.svg/48px-Canva_Logo.svg.png",
    status: "error",
    description: "Design, export, and manage Canva projects.",
    actionLabel: "Reconnect Canva",
    actionUrl: "https://manus.im/settings/integrations",
    steps: [
      "Go to Manus Settings → Integrations.",
      "Find 'Canva' and click 'Disconnect', then 'Connect'.",
      "Log in to Canva and authorize the integration.",
      "Return here — status will update to Connected.",
    ],
    note: "Connection timeout — likely needs re-authentication.",
  },
  // Database
  {
    id: "supabase",
    name: "Supabase",
    category: "Database",
    icon: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png",
    status: "connected",
    description: "Manage Supabase database projects, run queries, handle migrations.",
    note: "Connected via MCP — fully operational.",
  },
  {
    id: "neon",
    name: "Neon",
    category: "Database",
    icon: "https://neon.tech/favicon/favicon-32x32.png",
    status: "error",
    description: "Serverless Postgres database management.",
    actionLabel: "Reconnect Neon",
    actionUrl: "https://manus.im/settings/integrations",
    steps: [
      "Go to Manus Settings → Integrations.",
      "Find 'Neon' and click 'Disconnect', then 'Connect'.",
      "Authorize with your Neon account.",
      "Return here — status will update to Connected.",
    ],
    note: "Connection timeout — re-authentication required.",
  },
  // Meetings
  {
    id: "tldv",
    name: "tl;dv",
    category: "Meetings",
    icon: "https://tldv.io/favicon.ico",
    status: "error",
    description: "Meeting recording, transcription, and AI-generated highlights.",
    actionLabel: "Reconnect tl;dv",
    actionUrl: "https://manus.im/settings/integrations",
    steps: [
      "Go to Manus Settings → Integrations.",
      "Find 'tl;dv' and click 'Disconnect', then 'Connect'.",
      "Log in with your tl;dv Business or Enterprise account.",
      "Authorize the integration and return here.",
    ],
    note: "Connection timeout — requires Business or Enterprise account.",
  },
  // Device
  {
    id: "android",
    name: "Android Device",
    category: "Device",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Android_logo_2019_%28stacked%29.svg/48px-Android_logo_2019_%28stacked%29.svg.png",
    status: "needs_action",
    description: "Access SMS, contacts, files, and notifications from your Android phone.",
    actionLabel: "Set Up Android",
    actionUrl: "https://play.google.com/store/apps/details?id=com.llamalab.automate",
    steps: [
      "Install the free 'Automate' app from Google Play Store.",
      "Open Automate and create a new Flow.",
      "Add a 'Cloud Message Receive' block — this gives you a webhook URL.",
      "Add action blocks (e.g., 'SMS List', 'Contact List') to handle requests.",
      "Add a 'Cloud Message Send' block to return results.",
      "Give Manus your webhook URL and it will be able to read your SMS, contacts, and more.",
    ],
    note: "Skill installed. Requires Automate app setup on your Android device.",
  },
  // Browser
  {
    id: "chrome",
    name: "Chrome / Browser History",
    category: "Browser",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/48px-Google_Chrome_icon_%28February_2022%29.svg.png",
    status: "not_accessible",
    description: "Local browser history cannot be accessed for privacy/security reasons.",
    note: "Use the Web Capture skill to save any page to Kova OS manually.",
  },
];

const CATEGORIES = ["All", "Google", "Microsoft", "Productivity", "Automation", "Web", "Database", "Meetings", "Device", "Browser"];

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ReactNode; glowClass: string; dotColor: string }> = {
  connected: {
    label: "Connected",
    color: "text-emerald-400",
    icon: <CheckCircle2 className="w-4 h-4" />,
    glowClass: "glow-connected",
    dotColor: "bg-emerald-400",
  },
  needs_action: {
    label: "Needs Setup",
    color: "text-amber-400",
    icon: <AlertCircle className="w-4 h-4" />,
    glowClass: "glow-action",
    dotColor: "bg-amber-400",
  },
  error: {
    label: "Reconnect",
    color: "text-red-400",
    icon: <XCircle className="w-4 h-4" />,
    glowClass: "glow-error",
    dotColor: "bg-red-400",
  },
  not_accessible: {
    label: "Not Accessible",
    color: "text-zinc-500",
    icon: <Lock className="w-4 h-4" />,
    glowClass: "glow-muted",
    dotColor: "bg-zinc-600",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
      <span
        className={`w-2 h-2 rounded-full ${cfg.dotColor} ${status === "needs_action" || status === "error" ? "animate-status-pulse" : ""}`}
      />
      {cfg.label}
    </span>
  );
}

function IntegrationCard({
  integration,
  delay,
  onSelect,
}: {
  integration: Integration;
  delay: number;
  onSelect: (i: Integration) => void;
}) {
  const cfg = STATUS_CONFIG[integration.status];
  const isActionable = integration.status !== "connected" && integration.status !== "not_accessible";

  return (
    <div
      className={`glass-card ${cfg.glowClass} p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={integration.icon}
              alt={integration.name}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-white leading-tight">
              {integration.name}
            </h3>
            <span className="text-xs text-zinc-500">{integration.category}</span>
          </div>
        </div>
        <StatusBadge status={integration.status} />
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{integration.description}</p>

      {isActionable && (
        <Button
          size="sm"
          variant="outline"
          className="mt-auto text-xs h-8 border-white/10 bg-white/5 hover:bg-white/10 text-white"
          onClick={() => onSelect(integration)}
        >
          {integration.status === "error" ? (
            <RefreshCw className="w-3 h-3 mr-1.5" />
          ) : (
            <Settings className="w-3 h-3 mr-1.5" />
          )}
          {integration.actionLabel || "Configure"}
        </Button>
      )}
      {integration.status === "connected" && (
        <div className="mt-auto text-xs text-emerald-400/70 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{integration.note?.split("—")[0]?.trim() || "Operational"}</span>
        </div>
      )}
    </div>
  );
}

function ActionDrawer({
  integration,
  onClose,
}: {
  integration: Integration | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!integration) return null;

  const handleCopy = () => {
    if (integration.actionUrl) {
      navigator.clipboard.writeText(integration.actionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <Sheet open={!!integration} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[oklch(0.11_0.009_260)] border-white/10 text-white"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              <img
                src={integration.icon}
                alt={integration.name}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <SheetTitle className="text-white font-display text-lg">
                {integration.name}
              </SheetTitle>
              <SheetDescription className="text-zinc-400 text-sm">
                {integration.category}
              </SheetDescription>
            </div>
          </div>
          <StatusBadge status={integration.status} />
        </SheetHeader>

        <div className="space-y-6">
          {integration.note && (
            <div className="rounded-lg bg-white/5 border border-white/8 p-4">
              <p className="text-sm text-zinc-300 leading-relaxed">{integration.note}</p>
            </div>
          )}

          {integration.steps && (
            <div>
              <h4 className="text-sm font-display font-semibold text-white mb-3">
                Setup Steps
              </h4>
              <ol className="space-y-3">
                {integration.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-mono font-medium text-white">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {integration.actionUrl && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/8 p-3">
                <Globe className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="text-xs font-mono text-zinc-400 truncate flex-1">
                  {integration.actionUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 text-zinc-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0 font-display font-semibold"
                onClick={() => window.open(integration.actionUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {integration.actionLabel || "Open Configuration"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<"all" | "connected" | "action">("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const filtered = INTEGRATIONS.filter((i) => {
    const catMatch = activeCategory === "All" || i.category === activeCategory;
    const statusMatch =
      activeFilter === "all" ||
      (activeFilter === "connected" && i.status === "connected") ||
      (activeFilter === "action" && (i.status === "needs_action" || i.status === "error"));
    return catMatch && statusMatch;
  });

  const connectedCount = INTEGRATIONS.filter((i) => i.status === "connected").length;
  const actionCount = INTEGRATIONS.filter(
    (i) => i.status === "needs_action" || i.status === "error"
  ).length;
  const total = INTEGRATIONS.length;
  const healthPct = Math.round((connectedCount / total) * 100);

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Orb background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-orb-pulse"
            style={{
              background: "radial-gradient(circle, oklch(0.65 0.28 320) 0%, oklch(0.72 0.20 195) 50%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative container py-16 flex flex-col items-center text-center gap-6">
          {/* Orb image */}
          <div className="animate-orb-float">
            <img
              src={ORB_IMAGE}
              alt="Kova OS Orb"
              className="w-36 h-36 object-cover rounded-full"
              style={{
                boxShadow: "0 0 60px oklch(0.65 0.28 320 / 40%), 0 0 120px oklch(0.72 0.20 195 / 20%)",
              }}
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-4 font-mono">
              <Zap className="w-3 h-3 text-cyan-400" />
              KOVA OS v2.1 — Integration Hub
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
              Your Connected Universe
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
              Every service, every account, every world — managed from one place.
            </p>
          </div>

          {/* Health bar */}
          <div className="w-full max-w-sm glass-card p-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-zinc-400 font-mono">
              <span>System Health</span>
              <span className="text-white font-semibold">{connectedCount}/{total} Connected</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${healthPct}%` }}
              />
            </div>
            <div className="flex gap-4 text-xs">
              <span className="text-emerald-400">{connectedCount} connected</span>
              <span className="text-amber-400">{actionCount} need attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-white/8">
        <div className="container py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Status filter */}
          <div className="flex gap-2">
            {(["all", "connected", "action"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === f
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f === "all" ? "All" : f === "connected" ? "✓ Connected" : "⚠ Action Required"}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  activeCategory === cat
                    ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="container py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No integrations match this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((integration, idx) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                delay={idx * 50}
                onSelect={setSelectedIntegration}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="container pb-12 text-center">
        <p className="text-xs text-zinc-600 font-mono">
          Kova OS Integration Hub · Built by Manus AI · March 2026
        </p>
      </div>

      {/* Action Drawer */}
      <ActionDrawer
        integration={selectedIntegration}
        onClose={() => setSelectedIntegration(null)}
      />
    </div>
  );
}
