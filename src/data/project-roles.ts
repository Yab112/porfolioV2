/**
 * What a client wants to know first about each project: who it was for, what
 * my role was, what I personally did, and what came of it.
 * Only filled where I have the facts. `results` stays empty until there is a
 * number or outcome I am allowed to publish.
 */
export interface ProjectRole {
  role: string;
  forWhom: string;
  period?: string;
  /** What I personally designed or built. */
  did: string[];
  /** Measured outcomes. Leave out rather than estimate. */
  results?: string[];
}

export const PROJECT_ROLES: Record<string, ProjectRole> = {
  "pest-leads-pro": {
    role: "Full-stack engineer and automation lead",
    forWhom: "A US lead-generation company serving pest-control vendors",
    period: "Mar 2025 – Aug 2025",
    did: [
      "Built v2.5 of the platform: SEO landing pages, paid acquisition funnels, an A/B-configurable AI chat widget and lead quality scoring.",
      "Built the dynamic SEO system: one page template that becomes a marketing page for every country, city and pest, filled from the database.",
      "Built the n8n agents that generate the data for each combination and validate it before it goes live.",
      "Built the n8n router that sells each lead to a vendor, redirects the visitor, notifies the vendor and manages credits with no human dispatch.",
      "Built the vendor wallet flow: automatic charge per lead, refund when a lead is not good, and re-routing when a vendor does not make contact.",
      "Automated digital PR: incident-spike detection, GPT-generated press pages, Hunter.io outreach and embeddable trend charts.",
      "Deployed the scheduled background agents (SEO, performance, audit, reporting) writing to PostgreSQL, plus the vendor portal.",
    ],
  },
  "aegis-agent": {
    role: "Designer and sole engineer",
    forWhom: "My own product: the assistant on this site",
    period: "2026",
    did: [
      "Designed the agent graph: an intent router that sends each message to retrieval, calendar booking or a human handoff.",
      "Built retrieval on BGE-small embeddings and Supabase pgvector; the agent abstains when retrieval confidence is below a configured threshold.",
      "Built calendar booking against real availability, with a Google Meet link on confirmation.",
      "Built the human handoff: a scored lead briefing to Telegram with next steps and action buttons, and replies that are emailed back to the visitor.",
      "Wrote the scheduler from scratch inside the API: blog ideas, writing and publishing, and knowledge-base sync, with state in Postgres.",
      "Made the agent tell people from AI agents and answer each accordingly.",
    ],
  },
  "eset-coffee": {
    role: "Full-stack engineer",
    forWhom: "Eset Coffee, an Ethiopian specialty coffee brand",
    did: [
      "Built the public website in four languages (English, Arabic, Chinese, Amharic): coffees, origins, quality, export, journal, contact and meeting pages.",
      "Built the staff admin: coffees and categories, page text and photos, journal, menu, buyer enquiries, email campaigns and subscribers.",
      "Built access control: staff, roles and a permission list, an approval queue, and an audit log written by the API on every change.",
      "Built guest feedback: a questionnaire reached from QR codes printed in the admin, per cafe location, with an insights view for staff.",
      "Built one Fastify API that alone holds the database, email and upload credentials; the website and admin call it server to server, and every operation is registered as public or staff-only.",
      "Made the website fast and current at once: pages are cached, and when staff save, the API tells the website exactly which content to refresh.",
      "Shared types, the permission list, translations, validation and UI primitives across the three apps as workspace packages.",
    ],
  },
  "dual-agent-architecture-ai": {
    role: "Designer and engineer",
    forWhom: "My own project",
    period: "2026",
    did: [
      "Designed the deliberation: two advisors on different models (Claude and OpenAI) argue a design question over several rounds, and an arbiter decides.",
      "Built the n8n workflow that runs the rounds, checks how far the advisors agree, and assembles the verdict.",
      "Defined the output contract: recommendation, confidence, consensus and dissent, key risks, implementation notes, and a scorecard over eight engineering principles.",
      "Had the workflow produce system-architecture and sequence diagrams, and made the app repair and render them even when a model returns invalid diagram code.",
      "Tracked tokens and cost for every round so a deliberation has a visible price.",
      "Built the React app that starts a run and follows its progress through Supabase until the result is ready.",
    ],
  },
  billshare: {
    role: "Designer and engineer",
    forWhom: "My own product, for shared households in Ethiopia",
    period: "2026 – Present",
    did: [
      "Designed the ledger so that no balance is ever stored: every balance is recomputed from purchases and payments.",
      "Built per-item splitting, so a single receipt can be shared differently item by item.",
      "Built pay-anytime settlement with Telebirr: a member pays, uploads the screenshot, and the backend verifies it.",
      "Built the FastAPI backend that owns balance derivation, the Telebirr integration and the job that closes a billing cycle.",
      "Built the Flutter app: rooms with real-time chat, purchases, balances, insights and an assistant that answers from the room's own data.",
      "Built the admin app for operations, roles and permissions, and insights.",
    ],
  },
  "compliance-navigator": {
    role: "Designer and engineer",
    forWhom: "My own project, for people and businesses dealing with Ethiopian public services",
    period: "In progress",
    did: [
      "Modelled requirements as a dependency graph in Neo4j, and built the roadmap engine that turns a goal and a sub-city into ordered steps with office, fee, documents and legal basis.",
      "Built the pipeline that mirrors the MESOB service catalogue (24 institutions, about 470 services in English and Amharic, 19 centres) into the graph and embeds it for retrieval.",
      "Built the assistant: English and Amharic, with voice, it extracts the goal, sub-city and documents, builds a roadmap and cites MESOB and legal references. The model provider can be switched between Ollama, Claude and an offline keyword mode.",
      "Built Guday Geday, a registry of licensed errand agents: self-registration with ID upload, staff review, a public directory, client requests and ratings.",
      "Built the staff app: metrics, data-source runs, a knowledge-graph viewer and editor with a read-only query console, AI status and testing, a feedback queue, users and roles.",
      "Structured it as one workspace: a public site, a staff app and shared packages for the API client, types and UI, on a FastAPI backend.",
    ],
  },
  "local-context-orchestrator": {
    role: "Designer and engineer",
    forWhom: "My own open-source tool, for developers using AI coding assistants",
    did: [
      "Built a local MCP server that answers an assistant's request for context with small, relevant code slices instead of whole files.",
      "Built the index: syntax-tree parsing, language-server lookups and a dependency graph, all kept on the developer's machine.",
      "Added a context cache and metrics so token use and cache hits can be measured.",
      "Built the CLI: one command sets up a project and writes the editor's MCP configuration; others rebuild the index, check the install and benchmark token savings.",
    ],
  },
  arthopia: {
    role: "Full-stack engineer",
    forWhom: "Arthopia, an online art marketplace",
    did: [
      "Built the marketplace backend in NestJS with Prisma: artworks, artists, categories, collections, favourites, follows and a feed.",
      "Built the purchase path: cart, checkout, orders, payments, delivery confirmation and transactions.",
      "Built what happens when a sale goes wrong or completes: disputes for buyers and sellers, and seller withdrawals.",
      "Built authentication with email and password, Google sign-in and two-factor codes.",
      "Built the storefront that collectors and artists use.",
    ],
  },
};
