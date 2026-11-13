import type { CaseStudySection } from "@/types/work";

/**
 * Extra copy for flagship case studies. Keys match `slug` on each project in `resume.tsx`.
 * Other slugs get sensible defaults from `buildDefaultCaseStudySections` in `lib/case-studies.ts`.
 */
export const CASE_STUDY_OVERRIDES: Partial<Record<string, CaseStudySection[]>> = {
  "pest-leads-pro": [
    {
      id: "context",
      heading: "Context",
      content:
        "Pest Leads Pro is a lead-generation SaaS aimed at pest-control operators: inbound traffic from SEO, backlinks, paid acquisition, and digital PR, with a guided Lead Wizard and an AI-assisted chat (Pest Advisor). Behind the scenes, leads pass through normalization, quality scoring, pricing, and routing to vendors—with credit handling and notifications orchestrated through n8n.",
    },
    {
      id: "problem",
      heading: "What we were solving",
      content:
        "Operators need predictable lead flow and trust that routed jobs match their capacity and geography. The product had to combine marketing surfaces (landing pages, PR-led spikes), a conversational intake, and automation that doesn’t drop edge cases—while staying observable and changeable without redeploying the core app for every workflow tweak.",
    },
    {
      id: "approach",
      heading: "Approach",
      content:
        "Next.js on the front for fast marketing and app surfaces; PostgreSQL as the system of record; n8n for Router Agent behavior, credits, notifications, and background agents (SEO content, performance, audits). Digital PR automation watches for incident spikes, generates press-ready pages with embeddable trend charts, and plugs into outreach (e.g. Hunter.io) for earned links. Vendor portal, SMS/email, and hardened UI components (FAQ, geo widgets, embed API, email templates) sit in the same product mindset: production first.",
    },
    {
      id: "role",
      heading: "My role",
      content:
        "End-to-end product engineering across frontend surfaces, integration points with automation, and operational hardening—so marketing, intake, and routing stay coherent as the product evolves.",
    },
    {
      id: "outcomes",
      heading: "Outcomes & notes",
      content:
        "The stack is built for iteration: workflows can move in n8n while the core domain stays in PostgreSQL and typed APIs. That split keeps ship cadence high for growth experiments without sacrificing data integrity.",
    },
  ],
  "aegis-agent": [
    {
      id: "context",
      heading: "Context",
      content:
        "Aegis Agent is the backend behind the conversational assistant on this portfolio: it answers questions about experience and projects, retrieves grounded context, and can escalate to human follow-up—including Google Calendar booking when it makes sense.",
    },
    {
      id: "architecture",
      heading: "Architecture",
      content:
        "FastAPI service with agentic RAG over Supabase pgvector, intent routing, and confidence-gated replies so the UI never invents facts about private timelines. Session memory and lead logging keep conversations auditable. Orchestration follows LangGraph-style patterns suitable for extending with more tools later.",
    },
    {
      id: "reliability",
      heading: "Safety & handoff",
      content:
        "Human-in-the-loop paths are first-class: when a request is sensitive or low-confidence, the design favors clear handoff over a clever but wrong answer. That bias matters for any assistant that sits on a hiring lead or a serious inquiry.",
    },
    {
      id: "stack",
      heading: "Stack",
      content:
        "Python, FastAPI, LangGraph-oriented flows, RAG with pgvector on Supabase, Gemini for model calls, Google Calendar API for booking—not a toy demo, but a structure you can extend with evals and monitoring as traffic grows.",
    },
  ],
  "compliance-navigator": [
    {
      id: "context",
      heading: "Context",
      content:
        "Starting or running a business in Ethiopia means working out which licences, registrations and public-service steps apply to you, in what order, and at which office. Compliance Navigator is a graph-based decision-support platform that maps those requirements into step-by-step roadmaps.",
    },
    {
      id: "approach",
      heading: "Approach",
      content:
        "A Neo4j knowledge graph holds the structured relationships between regulatory and public-service requirements, and PostgreSQL with pgvector handles retrieval.",
    },
    {
      id: "assistant",
      heading: "The assistant",
      content:
        "An AI assistant answers in English or Amharic. It retrieves from legal and service-catalog sources and returns references to the supporting material.",
    },
    {
      id: "status",
      heading: "Status",
      content:
        "In progress. The stack is FastAPI, Next.js, PostgreSQL with pgvector, and Neo4j.",
    },
  ],
  billshare: [
    {
      id: "context",
      heading: "Context",
      content:
        "Splitting shared costs gets messy as soon as a purchase has several items and not everyone shares every item. BillShare is an expense-sharing platform for groups that need that level of detail: itemized purchases, custom splits, and a clear answer to who owes whom.",
    },
    {
      id: "design",
      heading: "Design",
      content:
        "Balances are derived live. From them the app recommends settlements and lets members send payment requests. It also has spending analytics and real-time room chat.",
    },
    {
      id: "assistant",
      heading: "The assistant",
      content:
        "The in-app assistant answers questions about a group's money by retrieving from verified balances and expense history.",
    },
    {
      id: "quality",
      heading: "Testing",
      content:
        "The core purchase, balance, ledger and insights logic is covered by 26 unit tests. Built with Flutter, FastAPI and Supabase. Work is ongoing.",
    },
  ],
  "rag-evaluation-framework": [
    {
      id: "context",
      heading: "Context",
      content:
        "An evaluation workflow for retrieval-augmented generation applications, so that a change to a RAG app is judged by measured results.",
    },
    {
      id: "how",
      heading: "How it works",
      content:
        "It combines automated test generation, golden datasets, multi-dimensional scoring and hallucination checks, and ends in a deterministic pass/fail evaluation.",
    },
    {
      id: "tracking",
      heading: "Regression tracking",
      content:
        "Runs are tracked as MLflow experiments, with regression tracking across versions.",
    },
    {
      id: "stack",
      heading: "Stack",
      content: "Python and MLflow.",
    },
  ],
};
