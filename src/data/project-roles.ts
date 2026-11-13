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
};
