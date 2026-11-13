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
      "Dynamic SEO feeding a lead marketplace. A page exists for every country, city and pest, so a local search lands on one. The enquiry is sold to a vendor, charged to their wallet, and re-routed if they do not make contact.",
    nodes: [
      { id: "gen", label: "Content agent", kind: "agent", at: [0, 0], detail: "An n8n agent that generates the data for every possible combination of country, city and pest product." },
      { id: "val", label: "Validator agent", kind: "agent", at: [1, 0], detail: "A second n8n agent that checks what the content agent produced before it is used on a page." },
      { id: "db", label: "Database", kind: "data", at: [2, 0], detail: "Holds the validated data for each combination. Every page pulls its content from here." },
      { id: "searcher", label: "Person searching", kind: "person", at: [0, 1], detail: "Someone searching Google for pest control or a pesticide around their city." },
      { id: "page", label: "City + pest page", kind: "surface", at: [1, 1], detail: "One generic page template. Each country, city and product combination becomes its own marketing page by filling the template with that combination's data." },
      { id: "form", label: "Reach-out form", kind: "surface", at: [2, 1], detail: "The visitor fills in a form to ask for help. That enquiry is the lead." },
      { id: "edge", label: "Supabase Edge Functions", kind: "service", at: [3, 1], detail: "Server-side functions on Supabase that sit behind the pages and the form." },
      { id: "router", label: "Lead routing", kind: "agent", at: [4, 1], detail: "n8n automation that sells the lead to a vendor, redirects the visitor to them and sends the vendor a notification so they make contact." },
      { id: "wallet", label: "Vendor wallet", kind: "data", at: [4, 0], detail: "Each vendor holds a balance. The price of a lead is taken from it automatically, and refunded if the lead turns out not to be good." },
      { id: "vendor", label: "Vendor", kind: "person", at: [5, 1], detail: "A pest-control business that buys leads and is expected to contact the person." },
      { id: "check", label: "Contact check", kind: "service", at: [4, 2], detail: "Checks whether the vendor actually contacted the person. If they did not, the lead is redirected to another vendor." },
      { id: "vendor2", label: "Next vendor", kind: "person", at: [5, 2], detail: "Receives the lead when the first vendor does not follow up." },
    ],
    edges: [
      ["gen", "val"], ["val", "db"], ["db", "page"], ["searcher", "page"], ["page", "form"], ["form", "edge"],
      ["edge", "db"], ["edge", "router"], ["router", "wallet"], ["router", "vendor"], ["router", "check"], ["check", "vendor2"],
    ],
    flows: [
      {
        name: "A page is made for one city and one pest",
        steps: [
          { at: "gen", note: "Generates the data for this country, city and product." },
          { at: "val", note: "A second agent validates it." },
          { at: "db", note: "The validated data is stored." },
          { at: "page", note: "The generic template renders it as that city's page." },
        ],
      },
      {
        name: "A search becomes a paid lead",
        steps: [
          { at: "searcher", note: "Searches Google for pest control around their city." },
          { at: "page", note: "The page for that city and pest is in the results." },
          { at: "form", note: "They fill in the reach-out form." },
          { at: "edge", note: "The enquiry reaches the backend." },
          { at: "router", note: "The lead is sold to a vendor." },
          { at: "wallet", note: "The price is taken from the vendor's wallet automatically." },
          { at: "router", note: "The visitor is redirected to the vendor." },
          { at: "vendor", note: "The vendor is notified and contacts them." },
        ],
      },
      {
        name: "The vendor does not follow up",
        steps: [
          { at: "vendor", note: "Receives the lead but does not make contact." },
          { at: "router", note: "The lead is still open." },
          { at: "check", note: "The check finds no contact was made." },
          { at: "vendor2", note: "The lead is redirected to another vendor." },
        ],
      },
      {
        name: "A bad lead is refunded",
        steps: [
          { at: "vendor", note: "Reports that the lead is not good." },
          { at: "router", note: "The lead is reviewed." },
          { at: "wallet", note: "The charge goes back to the vendor's wallet." },
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
