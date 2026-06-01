export const CATEGORY_COLORS: Record<string, string> = {
  Starters: "text-green-600",
  Sales: "text-orange-500",
  Operations: "text-green-500",
  Marketing: "text-amber-500",
  Strategy: "text-blue-500",
  GTM: "text-purple-500",
  Research: "text-indigo-500",
}

export const CATEGORY_DOT_COLORS: Record<string, string> = {
  Starters: "bg-green-500",
  Sales: "bg-orange-500",
  Operations: "bg-green-500",
  Marketing: "bg-amber-500",
  Strategy: "bg-blue-500",
  GTM: "bg-purple-500",
  Research: "bg-indigo-500",
}

export interface Template {
  id: string
  title: string
  description: string
  categories: string[]
  columns: string[]
  sampleRows: Record<string, string>[]
}

export const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: "learn-gridmind",
    title: "Learn GridMind",
    description:
      "Starter project showcasing possible types of automated column enrichment. Use AI to enrich basic data, scrape websites, or look up company info.",
    categories: ["Starters"],
    columns: ["Company", "Website", "Industry", "Description", "Founded", "Team Size"],
    sampleRows: [
      { Company: "Stripe", Website: "https://stripe.com", Industry: "Fintech", Description: "Global payments infrastructure", Founded: "2010", "Team Size": "7,000+" },
      { Company: "Notion", Website: "https://notion.so", Industry: "Productivity", Description: "All-in-one workspace for teams", Founded: "2016", "Team Size": "500+" },
      { Company: "Vercel", Website: "https://vercel.com", Industry: "Developer Tools", Description: "Frontend cloud deployment platform", Founded: "2015", "Team Size": "400+" },
      { Company: "Figma", Website: "https://figma.com", Industry: "Design", Description: "Collaborative design & prototyping", Founded: "2012", "Team Size": "1,000+" },
      { Company: "Linear", Website: "https://linear.app", Industry: "Project Management", Description: "Issue tracking for modern teams", Founded: "2019", "Team Size": "100+" },
    ],
  },
  {
    id: "find-linkedin-profiles",
    title: "Find LinkedIn Profiles",
    description:
      "Upload your existing list and find LinkedIn profile URLs based on the available data, without using Sales Navigator.",
    categories: ["Sales"],
    columns: ["Email", "Name", "Title", "Organization", "Website URL", "LinkedIn Profile"],
    sampleRows: [
      { Email: "r****@wordware.ai", Name: "Robert Chandler", Title: "CTO", Organization: "Wordware", "Website URL": "https://www.wordware.ai", "LinkedIn Profile": "https://www.linkedin.com/in/rc" },
      { Email: "d****@helpkit.com", Name: "Dominik Sobe", Title: "Founder", Organization: "Helpkit", "Website URL": "https://www.helpkit.so", "LinkedIn Profile": "https://www.linkedin.com/in/ds" },
      { Email: "t****@tidio.com", Name: "Tytus Golas", Title: "Founder", Organization: "Tidio", "Website URL": "https://tidio.com", "LinkedIn Profile": "https://pl.linkedin.com/in/tg" },
      { Email: "m*****@elevenlabs.io", Name: "Mati Staniszewski", Title: "Founder", Organization: "Eleven Labs", "Website URL": "https://elevenlabs.io/", "LinkedIn Profile": "https://uk.linkedin.com/in/ms" },
      { Email: "r****@acclaro.com", Name: "Russell Haworth", Title: "CEO", Organization: "Acclaro", "Website URL": "https://www.acclaro.com", "LinkedIn Profile": "https://uk.linkedin.com/in/rh" },
    ],
  },
  {
    id: "research-new-signups",
    title: "Research New Signups",
    description:
      "Send new signups through a webhook, find LinkedIn profiles and score them based on fit.",
    categories: ["Operations"],
    columns: ["Email", "Name", "Company", "Signup Date", "LinkedIn Profile", "Score"],
    sampleRows: [
      { Email: "alex@growthco.io", Name: "Alex Rivera", Company: "GrowthCo", "Signup Date": "2024-01-15", "LinkedIn Profile": "https://linkedin.com/in/alexrivera", Score: "87" },
      { Email: "sam@techstartup.com", Name: "Sam Chen", Company: "TechStartup Inc", "Signup Date": "2024-01-16", "LinkedIn Profile": "https://linkedin.com/in/samchen", Score: "92" },
      { Email: "jordan@saasly.com", Name: "Jordan Park", Company: "Saasly", "Signup Date": "2024-01-17", "LinkedIn Profile": "https://linkedin.com/in/jordanpark", Score: "78" },
      { Email: "maya@devtools.io", Name: "Maya Thompson", Company: "DevTools", "Signup Date": "2024-01-18", "LinkedIn Profile": "https://linkedin.com/in/mayathompson", Score: "85" },
      { Email: "kai@cloudops.com", Name: "Kai Nakamura", Company: "CloudOps", "Signup Date": "2024-01-19", "LinkedIn Profile": "https://linkedin.com/in/kainakamura", Score: "91" },
    ],
  },
  {
    id: "enrich-companies",
    title: "Enrich Companies Information",
    description:
      "Conduct a company research by simply adding a company name, get founders, funding and more.",
    categories: ["Strategy", "Sales"],
    columns: ["Company Name", "Website", "Founders", "Funding", "Stage", "LinkedIn", "Description"],
    sampleRows: [
      { "Company Name": "Linear", Website: "https://linear.app", Founders: "Karri Saarinen", Funding: "$52M", Stage: "Series B", LinkedIn: "https://linkedin.com/company/linear", Description: "Issue tracking for software teams" },
      { "Company Name": "Loom", Website: "https://loom.com", Founders: "Vinay Hiremath", Funding: "$203M", Stage: "Series C", LinkedIn: "https://linkedin.com/company/loom", Description: "Async video messaging tool" },
      { "Company Name": "Figma", Website: "https://figma.com", Founders: "Dylan Field", Funding: "$333M", Stage: "Late stage", LinkedIn: "https://linkedin.com/company/figma", Description: "Collaborative design & prototyping" },
      { "Company Name": "Retool", Website: "https://retool.com", Founders: "David Hsu", Funding: "$145M", Stage: "Series C", LinkedIn: "https://linkedin.com/company/retool", Description: "Internal tool builder for developers" },
    ],
  },
  {
    id: "marketing-research",
    title: "Marketing Research",
    description:
      "Scrape your competitor's website to conduct a marketing oriented research about the company.",
    categories: ["Marketing"],
    columns: ["Company", "Website", "Target Audience", "Key Messages", "Channels", "Competitors"],
    sampleRows: [
      { Company: "HubSpot", Website: "https://hubspot.com", "Target Audience": "SMB marketers", "Key Messages": "All-in-one CRM platform", Channels: "Blog, YouTube, Events", Competitors: "Salesforce, Marketo" },
      { Company: "Notion", Website: "https://notion.so", "Target Audience": "Knowledge workers", "Key Messages": "Flexible connected workspace", Channels: "Twitter, Reddit, YouTube", Competitors: "Coda, Confluence" },
      { Company: "Intercom", Website: "https://intercom.com", "Target Audience": "SaaS companies", "Key Messages": "AI-first customer messaging", Channels: "Content marketing, Events", Competitors: "Zendesk, Freshdesk" },
    ],
  },
  {
    id: "detailed-lead-discovery",
    title: "Detailed Lead Discovery",
    description:
      "Research and verify specific characteristics of your leads, assigning a score based on the relevant factors.",
    categories: ["GTM"],
    columns: ["Name", "Company", "Title", "LinkedIn", "Email", "Score", "Notes"],
    sampleRows: [
      { Name: "Sarah Johnson", Company: "CloudBase", Title: "VP of Sales", LinkedIn: "https://linkedin.com/in/sarahjohnson", Email: "s****@cloudbase.io", Score: "94", Notes: "Series A, 50 employees" },
      { Name: "Marcus Wei", Company: "DataFlow", Title: "Head of Growth", LinkedIn: "https://linkedin.com/in/marcuswei", Email: "m****@dataflow.ai", Score: "88", Notes: "YC-backed, actively hiring" },
      { Name: "Priya Shah", Company: "Nexus AI", Title: "CEO", LinkedIn: "https://linkedin.com/in/priyashah", Email: "p****@nexus.ai", Score: "91", Notes: "Raised $5M seed round" },
      { Name: "Tom Bradley", Company: "SyncHQ", Title: "CTO", LinkedIn: "https://linkedin.com/in/tombradley", Email: "t****@synchq.com", Score: "82", Notes: "Bootstrap, 30 employees" },
    ],
  },
  {
    id: "competitor-analysis",
    title: "Competitor Analysis",
    description:
      "Build a complete competitive landscape by researching competitor websites, pricing, and positioning.",
    categories: ["Strategy"],
    columns: ["Company", "Website", "Pricing", "Key Features", "Strengths", "Weaknesses"],
    sampleRows: [
      { Company: "Airtable", Website: "https://airtable.com", Pricing: "$20/user/mo", "Key Features": "Database, Views, Automations", Strengths: "Flexible, widely adopted", Weaknesses: "Expensive at scale" },
      { Company: "Notion", Website: "https://notion.so", Pricing: "$16/user/mo", "Key Features": "Docs, Databases, AI", Strengths: "All-in-one workspace", Weaknesses: "Performance at scale" },
      { Company: "Coda", Website: "https://coda.io", Pricing: "$10/user/mo", "Key Features": "Docs, Tables, Packs", Strengths: "Powerful formula engine", Weaknesses: "Steep learning curve" },
      { Company: "Smartsheet", Website: "https://smartsheet.com", Pricing: "$25/user/mo", "Key Features": "Project mgmt, Automations", Strengths: "Enterprise-ready", Weaknesses: "Outdated interface" },
    ],
  },
]

export const ALL_CATEGORIES = ["All", "Sales", "Operations", "Marketing", "Strategy", "GTM", "Starters"]
