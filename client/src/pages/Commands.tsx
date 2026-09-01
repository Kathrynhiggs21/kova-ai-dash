/**
 * Kova OS — Voice Commands Reference Page
 * Design: Dark premium SaaS — all Kova commands organized by world/category
 * Every command is copyable and searchable
 */

import { useState, useMemo } from "react";
import { Search, Copy, Check, Mic } from "lucide-react";
import { toast } from "sonner";

interface Command {
  phrase: string;
  description: string;
  category: string;
  world: string;
}

const COMMANDS: Command[] = [
  // Daily Briefing
  { phrase: "Kova, give me my morning briefing", description: "Full daily summary: calendar, Gmail, Asana, Slack", category: "Daily Briefing", world: "All Worlds" },
  { phrase: "Kova, what's on my calendar today", description: "List today's Google Calendar events", category: "Daily Briefing", world: "All Worlds" },
  { phrase: "Kova, any urgent emails", description: "Scan Gmail for unread high-priority messages", category: "Daily Briefing", world: "All Worlds" },
  { phrase: "Kova, what tasks are due today", description: "Pull Asana tasks due today", category: "Daily Briefing", world: "All Worlds" },
  { phrase: "Kova, check my Slack messages", description: "Show recent unread Slack messages across channels", category: "Daily Briefing", world: "All Worlds" },

  // Google Drive / Files
  { phrase: "Kova, save this to my [World] folder", description: "Save current content to the specified Kova world in Drive", category: "Files & Drive", world: "All Worlds" },
  { phrase: "Kova, find [file name] in Drive", description: "Search Google Drive for a specific file", category: "Files & Drive", world: "All Worlds" },
  { phrase: "Kova, capture [URL] and save to [World]", description: "Web capture and save to a Kova world folder", category: "Files & Drive", world: "All Worlds" },
  { phrase: "Kova, organize my Drive root", description: "Run Drive organizer to sort files into Kova worlds", category: "Files & Drive", world: "All Worlds" },
  { phrase: "Kova, upload this to Documentation", description: "Upload current file to Kova OS Documentation folder", category: "Files & Drive", world: "All Worlds" },

  // Gmail
  { phrase: "Kova, send an email to [name]", description: "Compose and send a Gmail message", category: "Gmail", world: "All Worlds" },
  { phrase: "Kova, search my email for [topic]", description: "Search Gmail for messages about a topic", category: "Gmail", world: "All Worlds" },
  { phrase: "Kova, summarize my inbox", description: "Get a summary of recent unread emails", category: "Gmail", world: "All Worlds" },
  { phrase: "Kova, reply to [sender]", description: "Draft and send a reply to a specific email", category: "Gmail", world: "All Worlds" },

  // Calendar
  { phrase: "Kova, add [event] to my calendar", description: "Create a new Google Calendar event", category: "Calendar", world: "All Worlds" },
  { phrase: "Kova, what's on my calendar this week", description: "List all events for the current week", category: "Calendar", world: "All Worlds" },
  { phrase: "Kova, schedule a meeting with [name]", description: "Create a calendar event with a contact", category: "Calendar", world: "All Worlds" },
  { phrase: "Kova, cancel [event name]", description: "Delete or decline a calendar event", category: "Calendar", world: "All Worlds" },

  // Slack
  { phrase: "Kova, send a message to #kova-os", description: "Post a message to the Kova OS Slack channel", category: "Slack", world: "All Worlds" },
  { phrase: "Kova, post my briefing to Slack", description: "Share morning briefing summary to Slack", category: "Slack", world: "All Worlds" },
  { phrase: "Kova, search Slack for [topic]", description: "Search across all Slack channels for a topic", category: "Slack", world: "All Worlds" },

  // Notion
  { phrase: "Kova, create a Notion page about [topic]", description: "Create a new page in Kova OS Notion workspace", category: "Notion", world: "All Worlds" },
  { phrase: "Kova, update my Kova OS dashboard", description: "Refresh the Kova OS Master Dashboard in Notion", category: "Notion", world: "All Worlds" },
  { phrase: "Kova, add a task to Notion", description: "Create a new task entry in Notion", category: "Notion", world: "All Worlds" },
  { phrase: "Kova, open my Notion dashboard", description: "Get the direct link to Kova OS Notion dashboard", category: "Notion", world: "All Worlds" },

  // Asana
  { phrase: "Kova, create a task in Asana", description: "Add a new task to your Asana workspace", category: "Asana", world: "All Worlds" },
  { phrase: "Kova, what are my Asana tasks", description: "List all open tasks assigned to you", category: "Asana", world: "All Worlds" },
  { phrase: "Kova, mark [task] complete in Asana", description: "Complete a specific Asana task", category: "Asana", world: "All Worlds" },

  // Android / Device
  { phrase: "Kova, connect to my phone", description: "Initiate the configured Android automation connection", category: "Android", world: "All Worlds" },
  { phrase: "Kova, what's using storage on my phone", description: "Run storage analysis on Android device", category: "Android", world: "All Worlds" },
  { phrase: "Kova, read my SMS messages", description: "Pull recent SMS via Android integration", category: "Android", world: "All Worlds" },
  { phrase: "Kova, send a text to [name]", description: "Send an SMS via Android device integration", category: "Android", world: "All Worlds" },

  // Finance
  { phrase: "Kova, create a monthly expense report", description: "Generate a financial summary from Drive data", category: "Finance", world: "Finance" },
  { phrase: "Kova, scan this receipt", description: "Use financial scanner skill to log a receipt", category: "Finance", world: "Finance" },
  { phrase: "Kova, check my Wix payments", description: "Pull Wix Payments dashboard summary", category: "Finance", world: "Finance" },

  // GitHub
  { phrase: "Kova, list my GitHub repos", description: "Show all repositories in your GitHub account", category: "GitHub", world: "All Worlds" },
  { phrase: "Kova, check open issues on [repo]", description: "List open GitHub issues for a specific repo", category: "GitHub", world: "All Worlds" },
  { phrase: "Kova, create a GitHub repo for [project]", description: "Create a new private GitHub repository", category: "GitHub", world: "All Worlds" },

  // System / Kova OS
  { phrase: "Kova, run a system audit", description: "Check all integration connection statuses", category: "Kova OS", world: "All Worlds" },
  { phrase: "Kova, sync Kova OS", description: "Full sync: Drive, Notion, web hub, skills", category: "Kova OS", world: "All Worlds" },
  { phrase: "Kova, open the Integration Hub", description: "Get the link to kovaintegrate-kywzhjdn.manus.space", category: "Kova OS", world: "All Worlds" },
  { phrase: "Kova, create a new skill", description: "Build a new reusable Kova OS skill", category: "Kova OS", world: "All Worlds" },
  { phrase: "Kova, what skills do you have", description: "List all installed Kova OS skills", category: "Kova OS", world: "All Worlds" },
  { phrase: "Kova, update my assistant preferences", description: "Update the authenticated Kova OS preference profile", category: "Kova OS", world: "All Worlds" },
];

const CATEGORIES = ["All", "Daily Briefing", "Files & Drive", "Gmail", "Calendar", "Slack", "Notion", "Asana", "Android", "Finance", "GitHub", "Kova OS"];

export default function Commands() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return COMMANDS.filter(cmd => {
      const matchesSearch = !search || cmd.phrase.toLowerCase().includes(search.toLowerCase()) || cmd.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || cmd.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filtered.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filtered]);

  const handleCopy = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopied(phrase);
    toast.success("Command copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#080810]/95 backdrop-blur-md border-b border-white/6 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg leading-none">Kova Voice Commands</h1>
              <p className="text-[10px] text-zinc-500 mt-0.5">{COMMANDS.length} commands across {CATEGORIES.length - 1} categories</p>
            </div>
          </div>
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search commands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/6 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-violet-600 text-white"
                    : "bg-white/6 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {Object.entries(grouped).length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <Mic className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No commands match your search.</p>
          </div>
        )}
        {Object.entries(grouped).map(([category, cmds]) => (
          <section key={category}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display font-bold text-white text-base">{category}</h2>
              <span className="text-[10px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">{cmds.length} commands</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {cmds.map(cmd => (
                <div
                  key={cmd.phrase}
                  className="group flex items-start gap-3 p-3.5 rounded-xl bg-white/4 border border-white/6 hover:bg-white/7 hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-violet-300 font-medium leading-snug">{cmd.phrase}</div>
                    <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{cmd.description}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(cmd.phrase)}
                    className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/6 hover:bg-violet-500/20 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy command"
                  >
                    {copied === cmd.phrase
                      ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                      : <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
