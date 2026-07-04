/*
 * KOVA OS COMMAND CENTER
 * Design: Premium SaaS Dark Dashboard — Liquid Orb Edition
 * Full cross-linked control panel: Worlds, Services, Katy AI, GitHub, Wix Sites
 */

import { useState, useMemo } from "react";
import { ExternalLink, Github, Globe, Lock, Cpu, FolderOpen, Bot, Zap, ChevronRight, Search, X, BookOpen, Database } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

// ─── SEARCH INDEX ────────────────────────────────────────────────────────────
// All searchable items across the hub
type SearchItem = { label: string; sub: string; url: string; category: string; emoji?: string };

const KOVA_WORLDS = [
  { name: "Kova OS", emoji: "🖥️", color: "from-violet-600 to-cyan-600", driveId: "1w-e10-QcWBglQRm4N1L5Lh09w4ZPvwFp", description: "Core OS — tech, AI, business, dev", tags: ["Manus", "GitHub", "Drive"] },
  { name: "AI World", emoji: "🤖", color: "from-cyan-600 to-blue-600", driveId: "1YPv6ysA9rGstmh39tYrJM7igI1o4Sb-o", description: "All AI platforms & interactions", tags: ["Manus", "ChatGPT", "Claude"] },
  { name: "The Anxiety Center", emoji: "🧠", color: "from-teal-600 to-emerald-600", driveId: "1G2xWiTvftR1FxjDK85x2jxZuGPA3SzV7", description: "Coaching projects & resources", tags: ["Wix", "Drive", "Notion"] },
  { name: "Scribbles by Marcy", emoji: "✏️", color: "from-pink-600 to-rose-600", driveId: "1xSWCf_FT2fIwM_21WC-0QT1WPVe1w0ND", description: "Book & website project", tags: ["Wix", "Drive"] },
  { name: "Reagan", emoji: "👧", color: "from-orange-500 to-amber-500", driveId: "16rshT309izimpnv_gEO9BMwaXosO7Nmu", description: "Everything Reagan (non-coaching)", tags: ["Drive", "GitHub"] },
  { name: "Katy", emoji: "🌸", color: "from-fuchsia-600 to-pink-600", driveId: "1rScei7lzBExaYdVz2GQd9-f171pERj-B", description: "Personal health, identity & growth", tags: ["Wix", "Drive"] },
  { name: "Dojo", emoji: "🏠", color: "from-stone-600 to-zinc-600", driveId: "1t19H1tMYlylO3L6yqnnlepTiOqTm9JTX", description: "House, property & home base", tags: ["Drive"] },
  { name: "Pets", emoji: "🐾", color: "from-yellow-600 to-orange-500", driveId: "1EbfbPA50h0W0T-IMP5f2Nz2f5Y1gLbX8", description: "All animal companions", tags: ["Drive"] },
  { name: "Travel", emoji: "✈️", color: "from-sky-600 to-blue-600", driveId: "1ZQLZsVp9pzD0puv8YqkYozyabBZJ63hn", description: "Adventures & trip planning", tags: ["Drive", "Calendar"] },
  { name: "Photos", emoji: "📸", color: "from-indigo-600 to-violet-600", driveId: "1drTNF68XAT1QPrM5uBFL-CjMuQO-zV8W", description: "Organized photo library", tags: ["Drive"] },
  { name: "Soccer (Turpin)", emoji: "⚽", color: "from-green-600 to-emerald-600", driveId: "1Vz5HEq9OMEZYR0JucI-4ClQ9EKNHiN8V", description: "Coaching world", tags: ["Drive", "Asana"] },
  { name: "Household Collective", emoji: "🏘️", color: "from-amber-600 to-yellow-500", driveId: "1sTsahy7Mx9K8gXl8migE6kC2NJuMLy3Z", description: "Household projects", tags: ["Drive"] },
  { name: "Apps", emoji: "📱", color: "from-blue-600 to-indigo-600", driveId: "1TyIfbpw6eVVJLJRo7Nh_tdo4V15FPRDT", description: "App content & integrations", tags: ["Slack", "Notion", "Zapier"] },
  { name: "Vault", emoji: "🔐", color: "from-zinc-700 to-zinc-600", driveId: "1FU7YTFCqO81URaGj5ufj097BaNjHpItf", description: "Sensitive & important info", tags: ["Drive"] },
  { name: "Inbox", emoji: "📥", color: "from-slate-600 to-zinc-600", driveId: "1MWnLkOlpxk88k4IxkEwDmVMpM2PJ7rEr", description: "Catch-all before filing", tags: ["Gmail", "Outlook"] },
];

const SERVICES = [
  { name: "Gmail", icon: "https://ssl.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png", url: "https://mail.google.com", category: "Google", color: "text-red-400" },
  { name: "Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png", url: "https://drive.google.com", category: "Google", color: "text-yellow-400" },
  { name: "Google Calendar", icon: "https://ssl.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png", url: "https://calendar.google.com", category: "Google", color: "text-blue-400" },
  { name: "Outlook Mail", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/48px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png", url: "https://outlook.live.com/mail", category: "Microsoft", color: "text-blue-400" },
  { name: "Outlook Calendar", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/48px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png", url: "https://outlook.live.com/calendar", category: "Microsoft", color: "text-blue-400" },
  { name: "Notion", icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", url: "https://www.notion.so/31bab88660a5819db8b5d822aec837f6", category: "Productivity", color: "text-white" },
  { name: "Asana", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Asana_logo.svg/48px-Asana_logo.svg.png", url: "https://app.asana.com", category: "Productivity", color: "text-pink-400" },
  { name: "Slack", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/48px-Slack_icon_2019.svg.png", url: "https://slack.com", category: "Productivity", color: "text-purple-400" },
  { name: "HubSpot", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HubSpot_Logo.svg/48px-HubSpot_Logo.svg.png", url: "https://app.hubspot.com", category: "Productivity", color: "text-orange-400" },
  { name: "Supabase", icon: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png", url: "https://app.supabase.com", category: "Database", color: "text-emerald-400" },
  { name: "Zapier", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zapier_logo.svg/48px-Zapier_logo.svg.png", url: "https://mcp.zapier.com/mcp/servers/e8c7456b-6c58-4026-9c3a-1cbec58f4f10/config", category: "Automation", color: "text-orange-400" },
  { name: "Manus AI", icon: "https://manus.im/favicon.ico", url: "https://manus.im", category: "AI", color: "text-cyan-400" },
  { name: "ChatGPT", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/48px-ChatGPT_logo.svg.png", url: "https://chat.openai.com", category: "AI", color: "text-emerald-400" },
  { name: "Claude", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/48px-Claude_AI_logo.svg.png", url: "https://claude.ai", category: "AI", color: "text-amber-400" },
  { name: "Gemini", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/48px-Google_Gemini_logo.svg.png", url: "https://gemini.google.com", category: "AI", color: "text-blue-400" },
];

const WIX_SITES = [
  { name: "Scribbles by Marcy", id: "db4a6aef-9fa8-4569-a5d0-c43b9a491eb4", world: "Scribbles by Marcy", url: "https://manage.wix.com/dashboard/db4a6aef-9fa8-4569-a5d0-c43b9a491eb4/home" },
  { name: "Hope 4 Anxiety", id: "534d831d-8dc0-46be-bc50-7ed84eff34ea", world: "The Anxiety Center", url: "https://manage.wix.com/dashboard/534d831d-8dc0-46be-bc50-7ed84eff34ea/home" },
  { name: "Hope For Anxiety", id: "07574d93-4327-44c0-96ca-56ead8415edd", world: "The Anxiety Center", url: "https://manage.wix.com/dashboard/07574d93-4327-44c0-96ca-56ead8415edd/home" },
  { name: "katyandblake", id: "ed17432b-e2a7-4e83-a52a-0816c901f012", world: "Katy", url: "https://manage.wix.com/dashboard/ed17432b-e2a7-4e83-a52a-0816c901f012/home" },
  { name: "Fite Club", id: "f1c2265c-0841-4c7f-b85c-68ba7b70c80d", world: "Apps", url: "https://manage.wix.com/dashboard/f1c2265c-0841-4c7f-b85c-68ba7b70c80d/home" },
  { name: "My Site 1", id: "43441871-c511-4dc0-b967-0dbb3dfc6e24", world: "Inbox", url: "https://manage.wix.com/dashboard/43441871-c511-4dc0-b967-0dbb3dfc6e24/home" },
  { name: "My Site 10", id: "40068e30-0ad5-4f12-b651-7a4b3d5af14d", world: "Inbox", url: "https://manage.wix.com/dashboard/40068e30-0ad5-4f12-b651-7a4b3d5af14d/home" },
  { name: "My Site 13", id: "8f2eafa2-25c9-424e-9511-49dc7339b856", world: "Inbox", url: "https://manage.wix.com/dashboard/8f2eafa2-25c9-424e-9511-49dc7339b856/home" },
  { name: "Mysite", id: "661d62ba-f5b3-4b24-b590-3652de1e16e5", world: "Inbox", url: "https://manage.wix.com/dashboard/661d62ba-f5b3-4b24-b590-3652de1e16e5/home" },
];

const GITHUB_REPOS = [
  { name: "kovaos-site", url: "https://github.com/Kathrynhiggs21/kovaos-site", desc: "Your personal operations system", private: true, updated: "2026-01-27", kova: true },
  { name: "Kova-ai-SYSTEM", url: "https://github.com/Kathrynhiggs21/Kova-ai-SYSTEM", desc: "Kova AI System", private: false, updated: "2025-12-18", kova: true },
  { name: "kova-ai", url: "https://github.com/Kathrynhiggs21/kova-ai", desc: "Kova AI", private: false, updated: "2025-10-20", kova: true },
  { name: "kova-ai-mem0", url: "https://github.com/Kathrynhiggs21/kova-ai-mem0", desc: "KOVA Life OS Memory Sync Service", private: false, updated: "2025-10-20", kova: true },
  { name: "kova-ai-site", url: "https://github.com/Kathrynhiggs21/kova-ai-site", desc: "Kova AI site", private: false, updated: "2025-08-26", kova: true },
  { name: "Kova-os-docengine", url: "https://github.com/Kathrynhiggs21/Kova-os-docengine", desc: "Kova OS doc engine", private: false, updated: "2025-12-09", kova: true },
  { name: "mem0", url: "https://github.com/Kathrynhiggs21/mem0", desc: "KOVA Life OS Memory Sync", private: true, updated: "2025-08-27", kova: true },
  { name: "TheCenterApp", url: "https://github.com/Kathrynhiggs21/TheCenterApp", desc: "The Center App", private: true, updated: "2025-04-22", kova: false },
  { name: "theCenter-App", url: "https://github.com/Kathrynhiggs21/theCenter-App", desc: "The Center App", private: false, updated: "2025-04-08", kova: false },
  { name: "theCenter", url: "https://github.com/Kathrynhiggs21/theCenter", desc: "The Center", private: true, updated: "2025-04-08", kova: false },
  { name: "TheCenter-7d530", url: "https://github.com/Kathrynhiggs21/TheCenter-7d530", desc: "The Center (Netlify)", private: false, updated: "2025-06-01", kova: false },
  { name: "netlify-thecenter", url: "https://github.com/Kathrynhiggs21/netlify-thecenter", desc: "Netlify The Center", private: false, updated: "2025-04-22", kova: false },
  { name: "Reagan-App-", url: "https://github.com/Kathrynhiggs21/Reagan-App-", desc: "Reagan App", private: false, updated: "2025-10-20", kova: false },
  { name: "wix-commerce-ticketing-nextjs-template", url: "https://github.com/Kathrynhiggs21/wix-commerce-ticketing-nextjs-template", desc: "Wix commerce template", private: true, updated: "2025-08-20", kova: false },
  { name: "headless-templates", url: "https://github.com/Kathrynhiggs21/headless-templates", desc: "Headless templates", private: false, updated: "2025-04-01", kova: false },
  { name: "platforms-starter-kit", url: "https://github.com/Kathrynhiggs21/platforms-starter-kit", desc: "Platforms starter kit", private: true, updated: "2025-10-06", kova: false },
  { name: "Kova-AI-Scribbles", url: "https://github.com/Kathrynhiggs21/Kova-AI-Scribbles", desc: "Kova AI Scribbles", private: false, updated: "2025-10-20", kova: true },
];

const KATY_AI_LINKS = [
  { name: "Manus AI", desc: "Your primary AI — fully connected to Kova OS", url: "https://manus.im", icon: "🤖", status: "active" },
  { name: "Kova OS Master Dashboard (Notion)", desc: "Live dashboard with all worlds, integrations & skills", url: "https://www.notion.so/31bab88660a5819db8b5d822aec837f6", icon: "📊", status: "active" },
  { name: "Skills Registry (Notion)", desc: "All 36 Manus skills installed for Kova OS", url: "https://app.notion.com/p/38eab88660a581b79ce4f1da4ade23d3", icon: "🛠️", status: "active" },
  { name: "GitHub Index (Notion)", desc: "All 30 repos indexed and linked", url: "https://app.notion.com/p/38eab88660a5815089f3d6332ec04f9e", icon: "🐙", status: "active" },
  { name: "Integration Status (Notion)", desc: "Live connection status for all services", url: "https://app.notion.com/p/38eab88660a581158fd3d08fa6cf7506", icon: "🔌", status: "active" },
  { name: "ChatGPT", desc: "OpenAI assistant — history not synced to Kova", url: "https://chat.openai.com", icon: "💬", status: "partial" },
  { name: "Claude (Anthropic)", desc: "Anthropic assistant — history not synced to Kova", url: "https://claude.ai", icon: "🧬", status: "partial" },
  { name: "Google Gemini", desc: "Google AI assistant", url: "https://gemini.google.com", icon: "✨", status: "partial" },
  { name: "kova-ai-mem0 (GitHub)", desc: "KOVA Life OS Memory Sync Service — connects data sources to mem0", url: "https://github.com/Kathrynhiggs21/kova-ai-mem0", icon: "🧠", status: "dev" },
  { name: "Kova-ai-SYSTEM (GitHub)", desc: "Core Kova AI system repository", url: "https://github.com/Kathrynhiggs21/Kova-ai-SYSTEM", icon: "⚙️", status: "dev" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-zinc-300">
        {icon}
      </div>
      <h2 className="font-display font-bold text-white text-lg">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-xs font-mono text-zinc-500">{count} items</span>
      )}
    </div>
  );
}

function LinkCard({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass-card p-4 flex items-start gap-3 transition-all duration-200 hover:scale-[1.02] hover:brightness-110 hover:border-white/20 group cursor-pointer ${className}`}
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-0.5 transition-colors" />
    </a>
  );
}

function WorldCard({ world }: { world: typeof KOVA_WORLDS[0] }) {
  const driveUrl = `https://drive.google.com/drive/folders/${world.driveId}`;
  return (
    <LinkCard href={driveUrl}>
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${world.color} flex items-center justify-center text-lg flex-shrink-0`}>
        {world.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-sm text-white truncate">{world.name}</div>
        <div className="text-xs text-zinc-500 truncate mt-0.5">{world.description}</div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {world.tags.map(t => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/6 text-zinc-500 font-mono">{t}</span>
          ))}
        </div>
      </div>
    </LinkCard>
  );
}

function ServiceCard({ svc }: { svc: typeof SERVICES[0] }) {
  return (
    <LinkCard href={svc.url}>
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={svc.icon} alt={svc.name} className="w-5 h-5 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-sm text-white truncate">{svc.name}</div>
        <div className="text-[10px] text-zinc-600 font-mono">{svc.category}</div>
      </div>
    </LinkCard>
  );
}

function WixCard({ site }: { site: typeof WIX_SITES[0] }) {
  return (
    <LinkCard href={site.url}>
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <Globe className="w-4 h-4 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-sm text-white truncate">{site.name}</div>
        <div className="text-[10px] text-zinc-600 font-mono truncate">{site.world}</div>
      </div>
    </LinkCard>
  );
}

function GitHubCard({ repo }: { repo: typeof GITHUB_REPOS[0] }) {
  return (
    <LinkCard href={repo.url} className={repo.kova ? "glow-connected" : ""}>
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        {repo.private ? <Lock className="w-4 h-4 text-amber-400" /> : <Github className="w-4 h-4 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-white truncate">{repo.name}</span>
          {repo.kova && <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono flex-shrink-0">KOVA</span>}
        </div>
        <div className="text-[10px] text-zinc-500 truncate mt-0.5">{repo.desc}</div>
        <div className="text-[10px] text-zinc-700 font-mono mt-0.5">Updated {repo.updated}</div>
      </div>
    </LinkCard>
  );
}

function KatyAICard({ item }: { item: typeof KATY_AI_LINKS[0] }) {
  const statusColor = item.status === "active" ? "text-emerald-400" : item.status === "partial" ? "text-amber-400" : "text-blue-400";
  const statusLabel = item.status === "active" ? "Active" : item.status === "partial" ? "Partial" : "In Dev";
  return (
    <LinkCard href={item.url}>
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-white truncate">{item.name}</span>
          <span className={`text-[10px] font-mono ${statusColor} flex-shrink-0`}>{statusLabel}</span>
        </div>
        <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</div>
      </div>
    </LinkCard>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const NOTION_WORLD_PAGES = [
  { name: "🖥️ Kova OS World", url: "https://app.notion.com/p/38eab88660a5811e91c5fb4d21daf249" },
  { name: "🤖 AI World", url: "https://app.notion.com/p/38eab88660a5816fb223f098fa873630" },
  { name: "🧠 The Anxiety Center", url: "https://app.notion.com/p/38eab88660a581e3932de81f20e7bbbf" },
  { name: "✏️ Scribbles by Marcy", url: "https://app.notion.com/p/38eab88660a58127a210f01947ea7bf1" },
  { name: "👧 Reagan", url: "https://app.notion.com/p/38eab88660a581ba847cd5e6bfff0809" },
  { name: "🌸 Katy", url: "https://app.notion.com/p/38eab88660a581a080abcb094a533c94" },
  { name: "🏠 Dojo", url: "https://app.notion.com/p/38eab88660a581808b61ec2a2eacb88e" },
  { name: "🐾 Pets", url: "https://app.notion.com/p/38eab88660a581529129f9e24816d970" },
  { name: "✈️ Travel", url: "https://app.notion.com/p/38eab88660a581238724df96cbafbb57" },
  { name: "📸 Photos", url: "https://app.notion.com/p/38eab88660a58169adc9cf8075744c7b" },
  { name: "⚽ Soccer (Turpin)", url: "https://app.notion.com/p/38eab88660a581bfa5d9e65c6c0a7dcd" },
  { name: "🏘️ Household Collective", url: "https://app.notion.com/p/38eab88660a581bfa600e68a4434617e" },
  { name: "📱 Apps", url: "https://app.notion.com/p/38eab88660a5816499ccde9fa68a5c0b" },
  { name: "🔐 Vault", url: "https://app.notion.com/p/38eab88660a58125b1f2ec6f95fc4e8c" },
  { name: "📥 Inbox", url: "https://app.notion.com/p/38eab88660a5816c924ef10125a3ddae" },
];

const SERVICE_CATEGORIES = ["All", "Google", "Microsoft", "Productivity", "AI", "Automation", "Database"];

export default function CommandCenter() {
  const [svcFilter, setSvcFilter] = useState("All");
  const [repoFilter, setRepoFilter] = useState<"all" | "kova">("kova");
  const [searchQuery, setSearchQuery] = useState("");

  // Build unified search index
  const searchIndex = useMemo((): SearchItem[] => [
    ...KOVA_WORLDS.map(w => ({ label: w.name, sub: w.description, url: `https://drive.google.com/drive/folders/${w.driveId}`, category: "World", emoji: w.emoji })),
    ...SERVICES.map(s => ({ label: s.name, sub: s.category, url: s.url, category: "Service" })),
    ...WIX_SITES.map(s => ({ label: s.name, sub: `Wix · ${s.world}`, url: s.url, category: "Wix" })),
    ...GITHUB_REPOS.map(r => ({ label: r.name, sub: r.desc, url: r.url, category: "GitHub" })),
    ...KATY_AI_LINKS.map(a => ({ label: a.name, sub: a.desc, url: a.url, category: "AI", emoji: a.icon })),
    ...NOTION_WORLD_PAGES.map(n => ({ label: n.name, sub: "Notion page", url: n.url, category: "Notion" })),
  ], []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchIndex.filter(item =>
      item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [searchQuery, searchIndex]);

  const filteredServices = SERVICES.filter(s => svcFilter === "All" || s.category === svcFilter);
  const filteredRepos = GITHUB_REPOS.filter(r => repoFilter === "all" || r.kova);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Global Search Bar */}
      <div className="sticky top-[57px] z-40 bg-background/95 backdrop-blur border-b border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search worlds, services, repos, Wix sites..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="max-w-2xl mx-auto mt-2 glass-card rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {searchResults.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 transition-colors border-b border-white/5 last:border-0 group">
                <span className="text-sm w-5 text-center flex-shrink-0">{item.emoji || "→"}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{item.label}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{item.sub}</div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/6 text-zinc-500 font-mono flex-shrink-0">{item.category}</span>
                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0" />
              </a>
            ))}
          </div>
        )}
        {searchQuery && searchResults.length === 0 && (
          <div className="max-w-2xl mx-auto mt-2 text-center text-xs text-zinc-600 py-3">No results for "{searchQuery}"</div>
        )}
      </div>

      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.65 0.28 320) 0%, oklch(0.72 0.20 195) 60%, transparent 100%)" }} />
        </div>
        <div className="container py-10 relative">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            KOVA OS v2.1 — Command Center
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
            Everything, Linked.
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl">
            Every world, every service, every tool — one click away. Your complete Kova OS control panel.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {KOVA_WORLDS.length} Worlds
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {SERVICES.length} Services
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {GITHUB_REPOS.length} GitHub Repos
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {WIX_SITES.length} Wix Sites
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-12">

        {/* ── KOVA WORLDS ── */}
        <section>
          <SectionHeader icon={<FolderOpen className="w-4 h-4" />} title="Kova OS Worlds" count={KOVA_WORLDS.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {KOVA_WORLDS.map((w, i) => (
              <div key={w.name} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms`, opacity: 0, animationFillMode: "forwards" }}>
                <WorldCard world={w} />
              </div>
            ))}
          </div>
        </section>

        {/* ── KATY AI ASSISTANT ── */}
        <section>
          <SectionHeader icon={<Bot className="w-4 h-4" />} title="Katy AI Assistant" count={KATY_AI_LINKS.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {KATY_AI_LINKS.map((item, i) => (
              <div key={item.name} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms`, opacity: 0, animationFillMode: "forwards" }}>
                <KatyAICard item={item} />
              </div>
            ))}
          </div>
          <div className="mt-4 glass-card p-4 border-cyan-500/20 glow-connected">
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white font-display font-semibold mb-1">Katy AI is powered by Manus</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Manus is your primary AI and is fully connected to all Kova worlds, Google Drive, Gmail, Calendar, Slack, Notion, Asana, HubSpot, Wix, GitHub, and more. ChatGPT and Claude operate independently — their history is not currently synced into Kova OS.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONNECTED SERVICES ── */}
        <section>
          <SectionHeader icon={<Globe className="w-4 h-4" />} title="Connected Services" count={filteredServices.length} />
          <div className="flex gap-2 mb-4 flex-wrap">
            {SERVICE_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSvcFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${svcFilter === cat ? "bg-white/10 text-white border border-white/20" : "text-zinc-500 hover:text-zinc-300"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredServices.map((svc, i) => (
              <div key={svc.name} className="animate-fade-up" style={{ animationDelay: `${i * 30}ms`, opacity: 0, animationFillMode: "forwards" }}>
                <ServiceCard svc={svc} />
              </div>
            ))}
          </div>
        </section>

        {/* ── WIX SITES ── */}
        <section>
          <SectionHeader icon={<Globe className="w-4 h-4" />} title="Wix Sites" count={WIX_SITES.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WIX_SITES.map((site, i) => (
              <div key={site.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms`, opacity: 0, animationFillMode: "forwards" }}>
                <WixCard site={site} />
              </div>
            ))}
          </div>
        </section>

        {/* ── GITHUB ── */}
        <section>
          <SectionHeader icon={<Github className="w-4 h-4" />} title="GitHub Repositories" count={filteredRepos.length} />
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-2">
              {(["kova", "all"] as const).map(f => (
                <button key={f} onClick={() => setRepoFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${repoFilter === f ? "bg-white/10 text-white border border-white/20" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {f === "kova" ? "⚡ Kova Repos" : "All Repos"}
                </button>
              ))}
            </div>
            <a href="https://github.com/Kathrynhiggs21" target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
              <Github className="w-3.5 h-3.5" />
              View all on GitHub
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRepos.map((repo, i) => (
              <div key={repo.name} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms`, opacity: 0, animationFillMode: "forwards" }}>
                <GitHubCard repo={repo} />
              </div>
            ))}
          </div>
        </section>

        {/* ── NOTION WORLD PAGES ── */}
        <section>
          <SectionHeader icon={<BookOpen className="w-4 h-4" />} title="Notion World Pages" count={NOTION_WORLD_PAGES.length} />
          <p className="text-xs text-zinc-500 mb-4">Each world has a dedicated Notion page with Drive links, connected services, and GitHub repos.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {NOTION_WORLD_PAGES.map((page, i) => (
              <a key={page.name} href={page.url} target="_blank" rel="noopener noreferrer"
                className="glass-card p-3 flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-all hover:scale-[1.02] animate-fade-up group"
                style={{ animationDelay: `${i * 30}ms`, opacity: 0, animationFillMode: "forwards" }}>
                <span className="text-base flex-shrink-0">{page.name.split(" ")[0]}</span>
                <span className="truncate">{page.name.split(" ").slice(1).join(" ")}</span>
                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 ml-auto flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* ── ANDROID & SMART HOME ── */}
        <section>
          <SectionHeader icon={<Cpu className="w-4 h-4" />} title="Android & Smart Home" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* DroidMind */}
            <div className="glass-card p-5 border-amber-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-lg">📱</div>
                <div>
                  <div className="font-display font-bold text-white text-sm">DroidMind (Primary)</div>
                  <div className="text-[10px] text-amber-400 font-mono">⚠️ Needs Setup — Most Powerful</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">Connects Manus directly to your Samsung Galaxy S24 Ultra via ADB. Enables screenshots, file management, app control, storage optimization, and UI automation.</p>
              <div className="space-y-1.5 mb-4">
                {["Enable USB Debugging on S24 Ultra", "Install Python 3.13 + uv + ADB on computer", "Add DroidMind as Custom MCP in Manus Settings"].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="w-4 h-4 rounded-full bg-white/8 flex items-center justify-center text-[9px] font-mono text-zinc-500 flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
              <a href="https://github.com/hyperb1iss/droidmind" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                <Github className="w-3.5 h-3.5" /> DroidMind on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {/* Automate + Smart Home */}
            <div className="space-y-3">
              <div className="glass-card p-4 border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <div className="font-display font-semibold text-white text-sm">Automate App (Wireless)</div>
                    <div className="text-[10px] text-amber-400 font-mono">⚠️ Needs Setup</div>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mb-2">No cable needed. Install Automate, create a webhook flow for SMS/notifications, paste the URL in Manus.</p>
                <a href="https://play.google.com/store/apps/details?id=com.llamalab.automate" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Install Automate on Google Play <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="glass-card p-4 border-emerald-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">🏠</span>
                  <div>
                    <div className="font-display font-semibold text-white text-sm">Smart Home</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Via Google Assistant</div>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mb-2">Dyson, smart lights, and all Google Home devices via Google Assistant routines. Say: "Kova, turn up my Dyson."</p>
                <a href="https://home.google.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  Open Google Home <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">💾</span>
                  <div className="font-display font-semibold text-white text-sm">Storage Optimization</div>
                </div>
                <p className="text-xs text-zinc-400">Once DroidMind is connected: list apps by storage, find large files, move photos to Drive, clear caches in bulk.</p>
              </div>
            </div>
          </div>
          <div className="mt-3 glass-card p-3 border-violet-500/20">
            <a href="https://app.notion.com/p/393ab88660a581c0b34bded1d49c5120" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              <BookOpen className="w-3.5 h-3.5" /> Full Android Integration Guide in Notion <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>

        {/* ── QUICK ACTIONS ── */}
        <section>
          <SectionHeader icon={<Zap className="w-4 h-4" />} title="Quick Actions" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Configure Zapier Actions", desc: "Add automation actions to unlock Zapier", url: "https://mcp.zapier.com/mcp/servers/e8c7456b-6c58-4026-9c3a-1cbec58f4f10/config", urgent: true },
              { label: "Reconnect Make", desc: "Fix OAuth error in Manus settings", url: "https://manus.im/settings/integrations", urgent: true },
              { label: "Reconnect Canva", desc: "Fix connection timeout in Manus settings", url: "https://manus.im/settings/integrations", urgent: true },
              { label: "Set Up DroidMind", desc: "Connect S24 Ultra to Manus via ADB", url: "https://github.com/hyperb1iss/droidmind", urgent: false },
              { label: "Kova OS Notion Dashboard", desc: "Open your live master dashboard", url: "https://www.notion.so/31bab88660a5819db8b5d822aec837f6", urgent: false },
              { label: "GitHub Profile", desc: "View all your repositories", url: "https://github.com/Kathrynhiggs21", urgent: false },
            ].map((action, i) => (
              <a key={action.label} href={action.url} target="_blank" rel="noopener noreferrer"
                className={`glass-card p-4 flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] hover:brightness-110 group cursor-pointer animate-fade-up ${action.urgent ? "glow-action border-amber-500/20" : ""}`}
                style={{ animationDelay: `${i * 40}ms`, opacity: 0, animationFillMode: "forwards" }}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${action.urgent ? "bg-amber-400 animate-status-pulse" : "bg-emerald-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-sm text-white truncate">{action.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{action.desc}</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
