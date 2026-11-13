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
      { id: "db", label: "PostgreSQL", kind: "data", at: [2, 0], detail: "Holds the validated data for each combination. Every page pulls its content from here." },
      { id: "searcher", label: "Person searching", kind: "person", at: [0, 1], detail: "Someone searching Google for pest control or a pesticide around their city." },
      { id: "page", label: "City + pest page", kind: "surface", at: [1, 1], detail: "One generic page template. Each country, city and product combination becomes its own marketing page by filling the template with that combination's data." },
      { id: "form", label: "Reach-out form", kind: "surface", at: [2, 1], detail: "The visitor fills in a form to ask for help. That enquiry is the lead." },
      { id: "edge", label: "Edge Functions", kind: "service", at: [3, 1], detail: "Server-side functions on Supabase that sit behind the pages and the form." },
      { id: "router", label: "Lead routing", kind: "agent", at: [4, 1], detail: "n8n automation that sells the lead to a vendor, redirects the visitor to them and sends the vendor a notification so they make contact." },
      { id: "wallet", label: "Vendor wallet", kind: "data", at: [4, 0], detail: "Each vendor holds a balance. The price of a lead is taken from it automatically, and refunded if the lead turns out not to be good." },
      { id: "vendor", label: "Vendor", kind: "person", at: [5, 1], detail: "A pest-control business that buys leads and is expected to contact the person." },
      { id: "check", label: "Contact check", kind: "service", at: [4, 2], detail: "Checks whether the vendor actually contacted the person. If they did not, the lead is redirected to another vendor." },
      { id: "vendor2", label: "Next vendor", kind: "person", at: [5, 2], detail: "Receives the lead when the first vendor does not follow up." },
      { id: "sched", label: "Scheduled agents", kind: "agent", at: [3, 0], detail: "Four background agents that run on a schedule and write to the database: SEO, performance, audit and reporting." },
      { id: "portal", label: "Vendor portal", kind: "surface", at: [5, 0], detail: "Where vendors work with the platform." },
      { id: "pr", label: "Digital PR agent", kind: "agent", at: [0, 2], detail: "Detects spikes in pest incidents, generates a press page with GPT, runs outreach through Hunter.io and publishes embeddable trend charts." },
      { id: "press", label: "Press pages", kind: "surface", at: [1, 2], detail: "Generated press pages and embeddable trend charts that other sites can cite and link to." },
    ],
    edges: [
      ["gen", "val"], ["val", "db"], ["db", "page"], ["searcher", "page"], ["page", "form"], ["form", "edge"],
      ["edge", "db"], ["edge", "router"], ["router", "wallet"], ["router", "vendor"], ["router", "check"], ["check", "vendor2"],
      ["sched", "db"], ["wallet", "portal"], ["portal", "vendor"], ["pr", "press"],
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
        name: "A pest spike becomes press",
        steps: [
          { at: "pr", note: "Detects a spike in pest incidents." },
          { at: "press", note: "A press page is generated, with a trend chart others can embed." },
          { at: "pr", note: "Outreach goes out through Hunter.io." },
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
      "Two advisors on different models argue a design question over several rounds; an arbiter decides and explains why. The debate runs as an n8n workflow, and the app follows it live.",
    nodes: [
      { id: "user", label: "Engineer", kind: "person", at: [0, 1], detail: "Brings a design or architecture question they want a second and third opinion on." },
      { id: "app", label: "React app", kind: "surface", at: [1, 1], detail: "Starts a deliberation and shows the verdict: recommendation, confidence, agreement and disagreement, risks, scorecard, diagrams and cost." },
      { id: "wf", label: "n8n workflow", kind: "service", at: [2, 1], detail: "Runs the rounds. It is started by a webhook and reports an execution id the app can follow." },
      { id: "a", label: "Advisor A · Claude", kind: "agent", at: [3, 0], detail: "Argues its position each round. Its raw answer, parsed answer and token use are kept in the transcript." },
      { id: "b", label: "Advisor B · OpenAI", kind: "agent", at: [3, 2], detail: "A different model, so the two advisors do not share the same blind spots." },
      { id: "align", label: "Agreement check", kind: "service", at: [3, 1], detail: "After each round, records where the two advisors align and where they still differ." },
      { id: "arb", label: "Arbiter", kind: "agent", at: [4, 1], detail: "Reads the debate and returns a recommendation, a confidence score, the winning advisor and its reasoning, scored across eight engineering principles." },
      { id: "result", label: "Verdict", kind: "data", at: [5, 1], detail: "Consensus and dissenting points, key risks, implementation notes, a system-architecture diagram, a sequence diagram, and the cost of each round." },
      { id: "status", label: "Run status", kind: "data", at: [2, 2], detail: "A Supabase table the workflow writes progress to and the app reads from until the run is finished." },
    ],
    edges: [
      ["user", "app"], ["app", "wf"], ["wf", "a"], ["wf", "b"], ["a", "align"], ["b", "align"],
      ["align", "arb"], ["arb", "result"], ["wf", "status"], ["app", "status"],
    ],
    flows: [
      {
        name: "A design question is argued",
        steps: [
          { at: "user", note: "Describes the design problem." },
          { at: "app", note: "Calls the workflow's webhook and gets an execution id." },
          { at: "wf", note: "Round one begins." },
          { at: "a", note: "Claude gives its position." },
          { at: "align", note: "Agreement between the two is measured." },
          { at: "b", note: "OpenAI gives its position; further rounds repeat." },
          { at: "align", note: "Remaining disagreements are recorded." },
          { at: "arb", note: "The arbiter picks a recommendation and scores eight principles." },
          { at: "result", note: "Verdict, risks, diagrams and per-round cost are assembled." },
        ],
      },
      {
        name: "The app follows the run",
        steps: [
          { at: "wf", note: "Writes its progress as it goes." },
          { at: "status", note: "Progress is stored against the execution id." },
          { at: "app", note: "Reads the status until the result is ready, then renders it." },
        ],
      },
    ],
  },

  "eset-coffee": {
    summary:
      "Three apps and one API. Only the API can touch the database, email and uploads; the website and the admin talk to it server to server, so nothing sensitive reaches a browser.",
    nodes: [
      { id: "buyer", label: "Buyer or reader", kind: "person", at: [0, 0], detail: "Reads about the coffees and origins, in English, Arabic, Chinese or Amharic, and can send an enquiry or join the newsletter." },
      { id: "web", label: "Website", kind: "surface", at: [1, 0], detail: "Coffees, origins, quality, export, journal, contact and meeting pages. Pages are cached and refreshed only when their content changes. It contains no admin code at all." },
      { id: "guest", label: "Cafe guest", kind: "person", at: [0, 1], detail: "Scans a QR code on the table. The feedback pages are not linked from the website and are hidden from search engines." },
      { id: "form", label: "Feedback form", kind: "surface", at: [1, 1], detail: "A questionnaire reached only through QR codes that staff print from the admin, one per location." },
      { id: "staff", label: "Staff", kind: "person", at: [0, 2], detail: "Invited by an owner and given a role." },
      { id: "admin", label: "Staff admin", kind: "surface", at: [1, 2], detail: "Coffees, categories, page text, photos, journal, menu, enquiries, email campaigns, subscribers, feedback insights, locations and QR codes, roles and staff. Deployed separately from the website." },
      { id: "api", label: "Fastify API", kind: "service", at: [2, 1], detail: "The only holder of database, email and upload credentials. Every operation is listed in one registry and marked public or staff-only; nothing else is reachable." },
      { id: "access", label: "Permissions + audit", kind: "service", at: [3, 2], detail: "On every staff call the API checks the session and the permission, routes sensitive changes through approvals, and writes the audit log." },
      { id: "db", label: "PostgreSQL", kind: "data", at: [3, 1], detail: "Content, menu, locations, feedback, enquiries, email and staff, through TypeORM." },
      { id: "mail", label: "Email", kind: "external", at: [3, 0], detail: "Newsletter confirmation and unsubscribe links, and campaigns sent from a queue." },
      { id: "media", label: "Image storage", kind: "external", at: [2, 0], detail: "Uploaded photos for coffees, pages and the journal." },
    ],
    edges: [
      ["buyer", "web"], ["guest", "form"], ["staff", "admin"], ["web", "api"], ["form", "api"], ["admin", "api"],
      ["api", "db"], ["api", "access"], ["api", "mail"], ["api", "media"],
    ],
    flows: [
      {
        name: "Staff change a coffee and the site updates",
        steps: [
          { at: "staff", note: "Edits a coffee in the admin." },
          { at: "admin", note: "Sends the change to the API with the staff session." },
          { at: "api", note: "Finds the operation in the registry: staff-only." },
          { at: "access", note: "Session and permission checked; the change is written to the audit log." },
          { at: "api", note: "Saves, then tells the website exactly which content changed." },
          { at: "db", note: "The new content is stored." },
          { at: "api", note: "The website drops only that cached content." },
          { at: "web", note: "The next visitor sees the update; everything else stays cached." },
        ],
      },
      {
        name: "A buyer sends an enquiry",
        steps: [
          { at: "buyer", note: "Fills in the enquiry form on the export page." },
          { at: "web", note: "A server action forwards it, with the visitor's address for spam limits." },
          { at: "api", note: "Validated and rate-limited; this operation is public." },
          { at: "db", note: "Stored for staff." },
          { at: "api", note: "It appears in the admin's enquiries." },
          { at: "admin", note: "Staff open and answer it." },
        ],
      },
      {
        name: "A guest leaves feedback",
        steps: [
          { at: "guest", note: "Scans the QR code for that cafe." },
          { at: "form", note: "Answers the questionnaire." },
          { at: "api", note: "The answers arrive tagged with the location." },
          { at: "db", note: "Stored." },
          { at: "api", note: "Aggregated for the insights view." },
          { at: "admin", note: "Staff see feedback by location." },
        ],
      },
    ],
  },

  billshare: {
    summary:
      "The ledger of purchases and payments is the only record of money. Balances are derived from it on demand and never stored, so they cannot drift.",
    nodes: [
      { id: "member", label: "Housemate", kind: "person", at: [0, 1], detail: "Shares a room with the people they split bills with." },
      { id: "app", label: "Flutter app", kind: "surface", at: [1, 1], detail: "Rooms, purchases, balances, insights, an assistant and chat. Mobile first; the same code can target the web." },
      { id: "api", label: "FastAPI", kind: "service", at: [2, 1], detail: "Owns balance derivation, the Telebirr integration and the cycle-close job." },
      { id: "ledger", label: "Purchases + payments", kind: "data", at: [3, 1], detail: "Every purchase with its per-item splits, and every payment. There is no balance column anywhere." },
      { id: "bal", label: "Balance derivation", kind: "service", at: [4, 0], detail: "Recomputes who owes whom from the ledger each time it is asked." },
      { id: "assistant", label: "Assistant", kind: "agent", at: [4, 1], detail: "Answers questions about the room's money from its real balances and expense history." },
      { id: "tele", label: "Telebirr check", kind: "service", at: [3, 2], detail: "A member pays through Telebirr and uploads the screenshot; the backend verifies it before recording the payment." },
      { id: "cycle", label: "Cycle close", kind: "service", at: [4, 2], detail: "A job that closes a billing cycle." },
      { id: "chat", label: "Room chat", kind: "surface", at: [1, 2], detail: "Real-time chat in each room." },
      { id: "supa", label: "Supabase", kind: "external", at: [2, 2], detail: "Postgres, auth, realtime and file storage." },
      { id: "admin", label: "Admin app", kind: "surface", at: [2, 0], detail: "Operations, roles and permissions, and insights for the team running the product." },
    ],
    edges: [
      ["member", "app"], ["app", "api"], ["api", "ledger"], ["ledger", "bal"], ["ledger", "assistant"],
      ["api", "tele"], ["tele", "ledger"], ["cycle", "ledger"], ["app", "chat"], ["chat", "supa"], ["admin", "api"],
    ],
    flows: [
      {
        name: "A receipt is split item by item",
        steps: [
          { at: "member", note: "Adds a purchase with several items." },
          { at: "app", note: "Chooses who shares each item." },
          { at: "api", note: "Validates the split." },
          { at: "ledger", note: "The purchase is recorded once." },
          { at: "bal", note: "Balances are recomputed from the ledger, not updated in place." },
        ],
      },
      {
        name: "Settling up with Telebirr",
        steps: [
          { at: "member", note: "Pays a housemate in Telebirr and takes a screenshot." },
          { at: "app", note: "Uploads the screenshot." },
          { at: "api", note: "Receives the payment claim." },
          { at: "tele", note: "The screenshot is verified." },
          { at: "ledger", note: "Only then is the payment recorded." },
          { at: "bal", note: "The next balance reflects it." },
        ],
      },
    ],
  },

  "compliance-navigator": {
    summary:
      "Requirements live in a graph, so a goal can be turned into ordered steps. A catalogue sync keeps the graph and the search index current, and the assistant answers only from those sources.",
    nodes: [
      { id: "person", label: "Citizen or business", kind: "person", at: [0, 1], detail: "Wants a passport, a TIN, a trade licence or another service, and needs to know the steps in their sub-city." },
      { id: "web", label: "Public site", kind: "surface", at: [1, 1], detail: "Roadmaps, a searchable service catalogue, the errand-agent directory and the assistant." },
      { id: "api", label: "FastAPI", kind: "service", at: [2, 1], detail: "One backend for the public site and the staff app." },
      { id: "road", label: "Roadmap engine", kind: "service", at: [3, 0], detail: "Walks the dependency graph from a goal and a sub-city to ordered steps. Each step carries the office, the fee, the documents, the legal basis and whether MESOB offers it." },
      { id: "neo", label: "Neo4j graph", kind: "data", at: [4, 0], detail: "Requirements and services as nodes, dependencies as edges. Staff can view and edit it, and query it read-only." },
      { id: "asst", label: "Assistant", kind: "agent", at: [3, 1], detail: "Chat in English or Amharic, with voice. It extracts the goal, the sub-city and the documents the person already has, builds a roadmap and cites its references." },
      { id: "pg", label: "PostgreSQL + pgvector", kind: "data", at: [4, 1], detail: "Embedded catalogue entries and legal text for retrieval, plus accounts, conversations, feedback and the agent registry." },
      { id: "llm", label: "Model provider", kind: "external", at: [4, 2], detail: "Ollama, Claude, or an offline keyword mode. Staff switch between them from the dashboard." },
      { id: "sync", label: "Catalogue sync", kind: "service", at: [5, 1], detail: "Scrapes the public MESOB catalogue, mirrors it into the graph and embeds it for the assistant. Each run is recorded for staff." },
      { id: "mesob", label: "MESOB catalogue", kind: "external", at: [5, 0], detail: "The government one-stop service catalogue: 24 institutions, about 470 services in English and Amharic, 19 centres." },
      { id: "agents", label: "Guday Geday", kind: "service", at: [2, 2], detail: "A registry of licensed errand agents: self-registration with ID upload, staff review, a public directory, client requests and ratings." },
      { id: "staff", label: "Staff", kind: "person", at: [0, 2], detail: "Review agents, watch data-source runs and maintain the graph." },
      { id: "admin", label: "Staff app", kind: "surface", at: [1, 2], detail: "Metrics, data-source runs, catalogue, graph viewer and editor, AI status and testing, agent management, feedback queue, users and roles." },
    ],
    edges: [
      ["person", "web"], ["web", "api"], ["api", "road"], ["road", "neo"], ["api", "asst"], ["asst", "road"],
      ["asst", "pg"], ["asst", "llm"], ["mesob", "sync"], ["sync", "neo"], ["sync", "pg"], ["api", "agents"],
      ["staff", "admin"], ["admin", "api"],
    ],
    flows: [
      {
        name: "A goal becomes a roadmap",
        steps: [
          { at: "person", note: "Picks a goal and their sub-city." },
          { at: "web", note: "Asks the API for a roadmap." },
          { at: "api", note: "Hands the goal to the roadmap engine." },
          { at: "road", note: "Finds everything the goal depends on." },
          { at: "neo", note: "Dependencies give the order." },
          { at: "road", note: "Returns steps with office, fee, documents and legal basis." },
        ],
      },
      {
        name: "A question asked in Amharic",
        steps: [
          { at: "person", note: "Asks by text or voice, in Amharic." },
          { at: "web", note: "Sent to the API." },
          { at: "api", note: "Routed to the assistant." },
          { at: "asst", note: "Extracts the goal, sub-city and documents on hand." },
          { at: "pg", note: "Retrieves matching catalogue and legal passages." },
          { at: "asst", note: "Builds the roadmap through the engine." },
          { at: "road", note: "Ordered steps come back." },
          { at: "asst", note: "Answers in Amharic and cites its references." },
        ],
      },
      {
        name: "The catalogue stays current",
        steps: [
          { at: "mesob", note: "The public catalogue changes." },
          { at: "sync", note: "A sync run scrapes it." },
          { at: "neo", note: "Services are mirrored into the graph." },
          { at: "sync", note: "The same entries are embedded." },
          { at: "pg", note: "The assistant can now retrieve them." },
        ],
      },
    ],
  },

  "local-context-orchestrator": {
    summary:
      "It sits between an AI coding assistant and your code. Instead of pasting whole files into the model, the assistant asks this server, which answers with the few slices that matter.",
    nodes: [
      { id: "dev", label: "Developer", kind: "person", at: [0, 1], detail: "Works in an editor with an AI assistant." },
      { id: "editor", label: "MCP client", kind: "external", at: [1, 1], detail: "Cursor or any client that speaks the Model Context Protocol. It starts the server automatically." },
      { id: "model", label: "AI model", kind: "external", at: [1, 0], detail: "Receives less text, so each request costs less and stays on topic." },
      { id: "server", label: "MCP server", kind: "service", at: [2, 1], detail: "Runs locally over stdio and exposes six tools for finding and returning code context." },
      { id: "cache", label: "Context cache", kind: "data", at: [2, 2], detail: "Remembers context already assembled, and feeds the token and cache metrics." },
      { id: "index", label: "Code index", kind: "data", at: [3, 1], detail: "Built and stored inside the project, on the developer's machine." },
      { id: "parse", label: "AST · LSP · deps", kind: "service", at: [4, 1], detail: "Understands structure rather than matching text: syntax trees, language-server lookups and a dependency graph." },
      { id: "files", label: "Project files", kind: "data", at: [5, 1], detail: "Read locally. Nothing is uploaded to build the index." },
      { id: "cli", label: "CLI", kind: "surface", at: [3, 2], detail: "One command sets up a project and writes the editor's MCP configuration. Others rebuild the index, check the install, show metrics and benchmark token savings." },
    ],
    edges: [
      ["dev", "editor"], ["editor", "model"], ["editor", "server"], ["server", "cache"], ["server", "index"],
      ["index", "parse"], ["parse", "files"], ["cli", "index"],
    ],
    flows: [
      {
        name: "The assistant needs context",
        steps: [
          { at: "dev", note: "Asks the assistant to change something." },
          { at: "editor", note: "The assistant calls one of the server's tools." },
          { at: "server", note: "Checks whether this context was assembled before." },
          { at: "cache", note: "Not cached yet." },
          { at: "server", note: "Queries the index." },
          { at: "index", note: "Finds the relevant symbols." },
          { at: "parse", note: "Follows definitions and dependencies to the exact slices." },
          { at: "index", note: "Slices returned." },
          { at: "server", note: "Sends back a few slices, not whole files." },
          { at: "editor", note: "Passes them to the model." },
          { at: "model", note: "Answers from a small, relevant context." },
        ],
      },
      {
        name: "Setting up a project",
        steps: [
          { at: "cli", note: "One setup command in the project folder." },
          { at: "index", note: "The index is created inside the project." },
          { at: "parse", note: "Every source file is parsed." },
          { at: "files", note: "Read locally." },
        ],
      },
    ],
  },
};
