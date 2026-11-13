/**
 * How each project works, as data. Rendered by <ArchitectureDiagram />.
 * Only describes what is already public on this site: no client data,
 * credentials, internal hostnames or business figures.
 */
export type NodeKind = "person" | "surface" | "service" | "agent" | "data" | "external";

export interface ArchNode {
  id: string;
  label: string;
  kind: NodeKind;
  /** Grid position (column, row), zero-based. */
  at: [number, number];
  detail: string;
}

export interface ArchFlow {
  name: string;
  /** Each step lights a node; consecutive steps light the edge between them. */
  steps: { at: string; note: string }[];
}

export interface Architecture {
  summary: string;
  nodes: ArchNode[];
  edges: [from: string, to: string][];
  flows: ArchFlow[];
}

export const ARCHITECTURES: Record<string, Architecture> = {
  "aegis-agent": {
    summary:
      "The assistant on this site. One FastAPI service routes every message to retrieval, calendar booking or a human handoff, and the same process runs the blog automation on its own schedule.",
    nodes: [
      { id: "visitor", label: "Visitor or AI agent", kind: "person", at: [0, 1], detail: "A person in the chat widget, or an AI agent calling on someone's behalf. The service classifies which one it is from the user-agent and the wording, and answers each differently." },
      { id: "site", label: "Next.js site", kind: "surface", at: [1, 1], detail: "This portfolio. The chat widget posts to a server route that proxies to the API, so the backend address never ships to the browser." },
      { id: "api", label: "FastAPI /chat", kind: "service", at: [2, 1], detail: "Rate-limits per IP, restores the conversation from the session store, runs the agent graph and persists the new turn." },
      { id: "router", label: "Intent router", kind: "agent", at: [3, 1], detail: "Decides what the message needs: a factual answer, a meeting, or the owner. Only the router can trigger a handoff; weak retrieval alone never does." },
      { id: "rag", label: "RAG retrieval", kind: "agent", at: [4, 0], detail: "Embeds the question, searches the knowledge base in pgvector and returns the best chunks with a confidence score. Below the threshold the agent says it does not know instead of guessing." },
      { id: "calendar", label: "Calendar tool", kind: "agent", at: [4, 1], detail: "Reads real availability, offers slots, and once the visitor gives an email creates the event with a Google Meet link." },
      { id: "handoff", label: "Handoff", kind: "agent", at: [4, 2], detail: "Scores the lead, names the category, lists what to do next and sends the briefing to Telegram with action buttons. Deterministic, so it works even when the model is down." },
      { id: "respond", label: "Respond", kind: "agent", at: [3, 2], detail: "Writes the reply. Booking and handoff replies are templates; knowledge answers are generated only from the retrieved context." },
      { id: "supabase", label: "Supabase", kind: "data", at: [5, 0], detail: "Postgres with pgvector: knowledge-base embeddings, chat sessions, leads, blog posts and the scheduler's own state." },
      { id: "google", label: "Google Calendar", kind: "external", at: [5, 1], detail: "Calendar and Meet through a service account, plus Gmail for replies to visitors." },
      { id: "telegram", label: "Telegram", kind: "external", at: [5, 2], detail: "Where handoffs land. Replying to an alert emails the visitor; buttons post a draft reply or mark the lead handled." },
      { id: "owner", label: "Yabibal", kind: "person", at: [5, 3], detail: "The human in the loop. Pricing, contracts and hiring always reach a person." },
      { id: "gemini", label: "Gemini", kind: "external", at: [3, 3], detail: "The language model. It only ever sees retrieved context plus the conversation, never the whole database." },
      { id: "scheduler", label: "Scheduler", kind: "service", at: [2, 3], detail: "Built from scratch inside the API: finds blog ideas, writes and publishes posts, and re-embeds the knowledge base when a deploy changes it. State lives in Postgres, so a missed run is caught up after a restart." },
    ],
    edges: [
      ["visitor", "site"], ["site", "api"], ["api", "router"],
      ["router", "rag"], ["router", "calendar"], ["router", "handoff"],
      ["rag", "supabase"], ["calendar", "google"], ["handoff", "telegram"], ["telegram", "owner"],
      ["rag", "respond"], ["calendar", "respond"], ["handoff", "respond"],
      ["respond", "gemini"], ["respond", "api"], ["scheduler", "gemini"],
    ],
    flows: [
      {
        name: "A visitor asks about a project",
        steps: [
          { at: "visitor", note: "“What did he build for Pest Leads Pro?”" },
          { at: "site", note: "The widget posts to the site's own server route." },
          { at: "api", note: "Rate limit checked, earlier turns loaded." },
          { at: "router", note: "Classified as a factual question." },
          { at: "rag", note: "Question embedded, knowledge base searched." },
          { at: "supabase", note: "Top chunks come back with a confidence score." },
          { at: "rag", note: "Confidence is high enough to answer." },
          { at: "respond", note: "Reply drafted from those chunks only." },
          { at: "gemini", note: "Model writes the answer from the supplied context." },
          { at: "respond", note: "Sources attached." },
          { at: "api", note: "Turn saved, answer returned." },
        ],
      },
      {
        name: "Someone books a call",
        steps: [
          { at: "visitor", note: "“Can we talk Thursday?”" },
          { at: "site", note: "Forwarded to the API." },
          { at: "api", note: "Session restored." },
          { at: "router", note: "Classified as a meeting request." },
          { at: "calendar", note: "Asks Google for free slots on that day." },
          { at: "google", note: "Returns real availability; later creates the Meet event." },
          { at: "calendar", note: "Slots offered; an email is needed to confirm." },
          { at: "respond", note: "A fixed template, no model call needed." },
          { at: "api", note: "Visitor gets the Meet link." },
        ],
      },
      {
        name: "A hiring question reaches a human",
        steps: [
          { at: "visitor", note: "“We're hiring. What salary do you expect?”" },
          { at: "site", note: "Forwarded to the API." },
          { at: "api", note: "Session restored." },
          { at: "router", note: "Sensitive topic: this is for the owner, not the model." },
          { at: "handoff", note: "Lead scored, category set, next steps written." },
          { at: "telegram", note: "Briefing arrives with action buttons." },
          { at: "owner", note: "Replies in Telegram; the reply is emailed to the visitor." },
          { at: "handoff", note: "Meanwhile the chat continues." },
          { at: "respond", note: "Visitor is told who will answer, and asked for an email if missing." },
          { at: "api", note: "Reply returned." },
        ],
      },
    ],
  },

  "pest-leads-pro": {
    summary:
      "A lead-generation platform where agents do the dispatching: one routes every inbound lead to the right vendor, one runs digital PR, and background agents keep the system healthy.",
    nodes: [
      { id: "homeowner", label: "Homeowner", kind: "person", at: [0, 1], detail: "Arrives from search or a campaign with a pest problem and a location." },
      { id: "pages", label: "Landing pages + chat", kind: "surface", at: [1, 1], detail: "SEO landing pages and a conversational intake that collects what a vendor needs to quote." },
      { id: "router", label: "Router agent", kind: "agent", at: [2, 1], detail: "An n8n agent that scores each lead for quality, matches it to vendors by capacity and geography, and manages vendor credits." },
      { id: "db", label: "PostgreSQL", kind: "data", at: [3, 1], detail: "The system of record: leads, vendors, credits and outcomes. Workflows can change in n8n without touching this data model." },
      { id: "portal", label: "Vendor portal", kind: "surface", at: [4, 0], detail: "Where vendors see routed jobs and their credit balance." },
      { id: "outreach", label: "Outreach", kind: "service", at: [4, 1], detail: "Automated multi-channel follow-up so a matched lead is contacted quickly." },
      { id: "vendor", label: "Vendor", kind: "person", at: [5, 0], detail: "A pest-control operator who needs predictable lead flow that fits their area." },
      { id: "pr", label: "Digital PR agent", kind: "agent", at: [2, 3], detail: "Detects spikes in pest activity, generates a press page, runs outreach and publishes embeddable trend charts." },
      { id: "press", label: "Press pages", kind: "surface", at: [1, 3], detail: "Generated pages and charts that journalists can cite, which bring in new search traffic." },
      { id: "bg", label: "Background agents", kind: "agent", at: [3, 3], detail: "Gardener SEO, Performance Manager, Auditor and Reporter run continuously with no human dispatch." },
      { id: "llm", label: "OpenAI", kind: "external", at: [2, 0], detail: "Language model used for scoring, intake and generated copy." },
    ],
    edges: [
      ["homeowner", "pages"], ["pages", "router"], ["router", "db"], ["router", "llm"],
      ["db", "portal"], ["db", "outreach"], ["portal", "vendor"], ["outreach", "vendor"],
      ["pr", "press"], ["press", "homeowner"], ["bg", "db"], ["pr", "bg"],
    ],
    flows: [
      {
        name: "A lead becomes a job",
        steps: [
          { at: "homeowner", note: "Lands on a page for their problem and area." },
          { at: "pages", note: "Chat intake collects the details." },
          { at: "router", note: "Lead scored and matched to vendors with capacity nearby." },
          { at: "db", note: "Lead stored, vendor credit deducted." },
          { at: "outreach", note: "Vendor contacted on more than one channel." },
          { at: "vendor", note: "Vendor takes the job." },
        ],
      },
      {
        name: "A news spike becomes traffic",
        steps: [
          { at: "pr", note: "Spots a spike in pest activity." },
          { at: "press", note: "Publishes a press page with a trend chart." },
          { at: "homeowner", note: "Coverage and search bring new visitors." },
          { at: "pages", note: "They enter the same intake funnel." },
        ],
      },
    ],
  },

  "dual-agent-architecture-ai": {
    summary:
      "Two agents with separate jobs and separate context: a Planner breaks a goal into steps, a Worker executes one step at a time, and a structured handoff keeps failures visible.",
    nodes: [
      { id: "user", label: "User", kind: "person", at: [0, 1], detail: "States a goal in plain language." },
      { id: "ui", label: "Next.js demo", kind: "surface", at: [1, 1], detail: "Shows the plan and each step's output as it happens." },
      { id: "planner", label: "Planner agent", kind: "agent", at: [2, 1], detail: "Decomposes the goal into structured subtasks. It never executes anything itself." },
      { id: "handoff", label: "Handoff protocol", kind: "service", at: [3, 1], detail: "A typed contract between the agents: one subtask, its inputs and what done looks like." },
      { id: "worker", label: "Worker agent", kind: "agent", at: [4, 1], detail: "Executes one subtask with isolated context, so an earlier step cannot contaminate a later one." },
      { id: "out", label: "Step output", kind: "data", at: [5, 1], detail: "Observable, step-by-step results. A failure surfaces at the step that caused it." },
      { id: "llm", label: "OpenAI", kind: "external", at: [3, 0], detail: "Both agents call the model, with different instructions and different context." },
    ],
    edges: [
      ["user", "ui"], ["ui", "planner"], ["planner", "handoff"], ["handoff", "worker"], ["worker", "out"],
      ["planner", "llm"], ["worker", "llm"], ["out", "ui"],
    ],
    flows: [
      {
        name: "A goal is planned, then executed",
        steps: [
          { at: "user", note: "Describes what they want done." },
          { at: "ui", note: "Goal sent to the Planner." },
          { at: "planner", note: "Goal split into ordered subtasks." },
          { at: "handoff", note: "First subtask packaged with only what it needs." },
          { at: "worker", note: "Subtask executed in a clean context." },
          { at: "out", note: "Result recorded for that step." },
          { at: "ui", note: "User watches each step land." },
        ],
      },
    ],
  },

};
