export type IntegrationStatus =
  | "connected"
  | "needs_action"
  | "error"
  | "not_accessible"
  | "warning";

export type DefaultIntegration = {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: IntegrationStatus;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  steps?: string[];
  note?: string;
};

export const DEFAULT_INTEGRATIONS: DefaultIntegration[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    category: "Google",
    icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png",
    status: "connected",
    description:
      "Recorded Google Drive file and folder management configuration.",
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
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    status: "connected",
    description:
      "Create and update pages, manage databases, build your Kova OS dashboard.",
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
    description:
      "Send messages, search channels, read threads, create canvases.",
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
  {
    id: "zapier",
    name: "Zapier",
    category: "Automation",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zapier_logo.svg/48px-Zapier_logo.svg.png",
    status: "needs_action",
    description:
      "Automate workflows between apps. Connected but needs actions configured.",
    actionLabel: "Configure Zapier Actions",
    actionUrl: "https://mcp.zapier.com",
    steps: [
      "Open Zapier MCP and select the server you want to configure.",
      "Log in to Zapier if prompted.",
      "Click 'Add Action' and choose any app you want Manus to control.",
      "Configure the action and save it.",
    ],
    note: "Server is connected. Add at least one action to unlock automation.",
  },
  {
    id: "make",
    name: "Make",
    category: "Automation",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Make_%28software%29_logo.svg/48px-Make_%28software%29_logo.svg.png",
    status: "warning",
    description:
      "Visual automation platform. Create an On Demand scenario to activate.",
    actionLabel: "Open Make Dashboard",
    actionUrl: "https://www.make.com/en/login?source=google",
    steps: [
      "Log in to Make via Google.",
      "Create a new scenario.",
      "Set the trigger to On Demand.",
      "Save and activate the scenario.",
    ],
    note: "Connected via Google. Create an On Demand scenario to unlock automation.",
  },
  {
    id: "wix",
    name: "Wix",
    category: "Web",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Wix.com_website_logo.svg/48px-Wix.com_website_logo.svg.png",
    status: "connected",
    description: "Manage all your Wix sites and publishing projects.",
    note: "Saved Wix configuration record; live site access is not verified.",
  },
  {
    id: "canva",
    name: "Canva",
    category: "Web",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Canva_Logo.svg/48px-Canva_Logo.svg.png",
    status: "warning",
    description: "Design, export, and manage Canva projects.",
    actionLabel: "Open Canva",
    actionUrl: "https://www.canva.com/login?authMethod=google",
    steps: [
      "Log in to Canva via Google.",
      "In Manus, ask Kova to create a design in Canva.",
      "Re-authorize Canva in Manus Settings if prompted.",
    ],
    note: "Connected via Google. Re-authorize Canva if access times out.",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Database",
    icon: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png",
    status: "connected",
    description: "Manage Supabase database projects, queries, and migrations.",
    note: "Connected via MCP — fully operational.",
  },
  {
    id: "neon",
    name: "Neon",
    category: "Database",
    icon: "https://neon.tech/favicon/favicon-32x32.png",
    status: "warning",
    description: "Serverless Postgres database management.",
    actionLabel: "Open Neon Console",
    actionUrl: "https://console.neon.tech/login?provider=google",
    steps: [
      "Log in to Neon via Google.",
      "Ask Kova to list your Neon projects to verify access.",
      "Re-authorize Neon in Manus Settings if timeouts continue.",
    ],
    note: "Connected via Google. Re-authorize if timeout persists.",
  },
  {
    id: "tldv",
    name: "tl;dv",
    category: "Meetings",
    icon: "https://tldv.io/favicon.ico",
    status: "warning",
    description:
      "Meeting recording, transcription, and AI-generated highlights.",
    actionLabel: "Open tl;dv",
    actionUrl: "https://tldv.io/login?provider=google",
    steps: [
      "Log in to tl;dv via Google.",
      "Ensure a Business or Enterprise account is active.",
      "Ask Kova to list your tl;dv meetings to verify access.",
      "Re-authorize tl;dv in Manus Settings if access times out.",
    ],
    note: "Connected via Google. Business or Enterprise access is required.",
  },
  {
    id: "android",
    name: "Android Device",
    category: "Device",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Android_logo_2019_%28stacked%29.svg/48px-Android_logo_2019_%28stacked%29.svg.png",
    status: "needs_action",
    description:
      "Access SMS, contacts, files, and notifications from your Android phone.",
    actionLabel: "Set Up Android",
    actionUrl:
      "https://play.google.com/store/apps/details?id=com.llamalab.automate",
    steps: [
      "Install Automate from Google Play.",
      "Create a new Flow.",
      "Add a Cloud Message Receive block.",
      "Add action blocks and return results with Cloud Message Send.",
    ],
    note: "Requires Automate setup on the Android device.",
  },
  {
    id: "chrome",
    name: "Chrome / Browser History",
    category: "Browser",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/48px-Google_Chrome_icon_%28February_2022%29.svg.png",
    status: "not_accessible",
    description:
      "Local browser history cannot be accessed for privacy and security reasons.",
    note: "Use the Web Capture skill to save pages to Kova OS manually.",
  },
];
