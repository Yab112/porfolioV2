import { Icons } from "@/components/icons";
import { BookOpen, Briefcase, HomeIcon } from "lucide-react";

export const DATA = {
  name: "Yabibal Eshetie Molla",
  initials: "YE",
  url: "https://yabibal.site",
  location: "Addis Ababa, Ethiopia",
  locationLink: "https://www.google.com/maps/place/addis+ababa",
  description:
    "Full-stack and AI engineer building LLM applications, multi-agent automation and multi-tenant SaaS that keep working after launch day.",
  /** Open Graph / Twitter / social preview (`public/SEO.png`) */
  ogImage: "/SEO.png",
  ogImageAlt:
    "Yabibal Eshetie Molla - Fullstack engineer, AI security, automation, Addis Ababa",
  summary:
    "I build AI systems that keep working after launch day. I'm a full-stack and AI engineer with three years of production experience shipping LLM applications, multi-agent automation, and multi-tenant SaaS for international clients.\n\nHow I work: I measure before I claim. I build evaluation harnesses with golden datasets and regression tracking, so an AI feature that passes on day one still passes in month six. Alongside client work I design machine learning benchmark challenges and evaluate model behaviour, and I am strengthening my foundations in mathematics, statistics and machine learning, with deep learning next.\n\nOpen to remote AI engineering and full-stack roles. Based in Addis Ababa (EAT), with working hours that overlap Europe and US mornings.",
  /** One line, in my own words, for the home page. */
  statement: "I build AI systems that keep working after launch day.",
  availability: "Open to remote AI and full-stack roles",
  headline: "Full-stack and AI engineer",
  aboutFocusAreas: [
    {
      title: "Full-Stack Engineering",
      whatIBring: "React and Next.js on the front, Node.js and Python (FastAPI) on the back — I own the full stack and ship features that stay shipped.",
      whyGood: "I’ve delivered across wildly different domains: digital signatures (Go + Preact), pregnancy health (React + Django), payroll SaaS (Next.js 15 + 194 Playwright tests), and a seven-agent lead-gen platform. I treat DX and performance as requirements, not nice-to-haves — because future me is the one on-call.",
    },
    {
      title: "AI Engineering",
      whatIBring: "LangGraph agents, RAG pipelines with hallucination detection, and human-in-the-loop validation so your AI system is as reliable in month six as it was on launch day.",
      whyGood: "At Orizon I designed self-healing LLM deployments with automated monitoring and recovery. I also built a SWE-bench-style RAG evaluation framework — golden datasets, MLflow tracking, deterministic pass/fail harness — so regressions get caught before users do. Evaluation is part of the build, not an afterthought.",
    },
    {
      title: "Production Automation",
      whatIBring: "Certified n8n Ambassador. I build multi-agent automation that runs 24/7 — not demo workflows, but production systems with retries, observability, and owned databases.",
      whyGood: "Pest Leads Pro runs a Router Agent, a Digital PR agent, and four background agents (Gardener SEO, Performance Manager, Auditor, Reporter) continuously in production — no human dispatch required. I’ve shipped automation on n8n, Make, and custom event-driven engines; the common thread is that they keep running when I’m not watching.",
    },
    {
      title: "Systems Architecture",
      whatIBring: "Multi-tenant design, per-tenant cache tagging, Row-Level Security, and CI/CD that makes deployments boring — in the best way.",
      whyGood: "At LohnPulse I implemented Next.js 15 Partial Pre-rendering with static shells served from the edge in <50ms, JWT verification at the middleware layer, and granular CDN purges per tenant. 194+ Playwright tests (E2E, API, UI) back it up. I design for production from day one because retrofitting observability and failure handling is always more expensive.",
    },
  ],
  avatarUrl: "/me.png",
  skills: [
    "Python",
    "JavaScript",
    "TypeScript",
    "FastAPI",
    "Node.js",
    "React",
    "Next.js",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "AWS",
    "OpenAI",
    "LangChain",
  ],
  techStack: [
    {
      label: "Languages & Frameworks",
      description: "I build backends and frontends with Python, JavaScript, and TypeScript. Backend: FastAPI, Node.js, Express. Frontend: React, Next.js. This stack powers most of my production apps and APIs.",
      items: ["Python", "JavaScript", "TypeScript", "FastAPI", "Node.js", "Express", "React", "Next.js"],
    },
    {
      label: "Data & Storage",
      description: "PostgreSQL for relational data and complex queries, MongoDB for flexible document storage, Redis for caching and real-time features. I design schemas and indexes for scale and performance.",
      items: ["PostgreSQL", "MongoDB", "Redis"],
    },
    {
      label: "AI & Automation",
      description: "I build LLM-based apps with OpenAI and LangChain, implement RAG systems, and develop agents and evaluation pipelines. I also use n8n and Make for workflow automation and custom automation platforms.",
      items: ["OpenAI", "LangChain", "HuggingFace", "RAG", "LLM Agents", "n8n", "Make"],
    },
    {
      label: "Architecture & DevOps",
      description: "I deploy and run systems on AWS, use Docker and Kubernetes for containers and orchestration, and set up CI/CD for reliable releases. I design microservices and event-driven architectures and practice TDD for critical paths.",
      items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Microservices", "Event-driven", "TDD"],
    },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/work", icon: Briefcase, label: "Work" },
    { href: "/blog", icon: BookOpen, label: "Blog" },
  ],
  contact: {
    email: "eshetieyabibal@gmail.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Yab112",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/yabibal-eshetie/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/YabibalE",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#contact",
        icon: Icons.email,
        navbar: false,
      },
    },
    /** PDF in /public (download link in Connect strip) */
    resumePdfUrl: "/Yabibal-Eshetie-Molla-CV.pdf",
    upworkUrl: "https://www.upwork.com/freelancers/~01d3355c4ac6227baf",
    /** Short intro shown between Hobbies and Contact (links on the right) */
    connectIntro:
      "Hiring, collaborating, or just curious? Grab my CV, peek at code on GitHub, or connect on LinkedIn, then scroll down to send a message if email works best for you.",
    /** Shown above the contact form */
    contactFormIntro:
      "Tell me a bit about what you need (project scope, timeline, or how I can help). I read every message and usually reply within a few days.",
    contactFormUpworkNote:
      "If you prefer hiring or messaging through a marketplace, I’m also on Upwork; that can be easier for contracts and milestones.",
  },
  work: [
    {
      company: "LohnPulse",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Senior Full-stack Developer",
      logoUrl: "",
      start: "Oct 2026",
      end: "Present",
      description:
        "Production SaaS managing complex payroll workflows and tax advisor data with strict RBAC and Row-Level Security. Implemented Next.js 15 Partial Pre-rendering: static shell served from the edge in <50ms with user-specific data streamed via React Server Components. Dynamic per-tenant cache tagging for granular CDN purges, JWT verification, and tenant context injection at the middleware edge layer. Maintained 194+ Playwright tests (E2E, API, UI) ensuring zero-regression production deployments.",
    },
    {
      company: "Shipd",
      href: "#",
      badges: [],
      location: "Remote",
      title: "AI Benchmark & ML Challenge Developer",
      logoUrl: "",
      start: "Oct 2026",
      end: "Present",
      description:
        "Design, validate and publish competitive machine learning benchmark challenges, with prompt-hardening evaluation rules and dataset verification pipelines. Engineer end-to-end solutions for prize-pool benchmark challenges, optimising data processing, model scoring and accuracy. Build containerised Docker and Python execution environments that enforce precise model evaluation and keep every benchmark solvable.",
    },
    {
      company: "Revelo",
      href: "#",
      badges: [],
      location: "Remote",
      title: "AI / ML Evaluation & Full-Stack Engineer",
      logoUrl: "",
      start: "Oct 2025",
      end: "Present",
      description:
        "Designed competitive machine learning challenges, prompt-hardening evaluation rules and multi-stage dataset verification pipelines for LLM capability testing. Developed solution pipelines for competitive ML benchmark pools, focused on complex dataset processing and model output verification. Evaluated LLM performance, alignment and security across diverse domain tasks, both qualitatively and quantitatively. Built full-stack features and REST and GraphQL APIs while enforcing security audits, input sanitisation and access control.",
    },
    {
      company: "Orizon Technology",
      href: "#",
      badges: [],
      location: "Addis Ababa, Ethiopia · Hybrid",
      title: "Senior Lead, AI Engineering → Software Developer",
      logoUrl: "",
      start: "Aug 2025",
      end: "Present",
      description:
        "Led architecture, development, and deployment of ML-driven intelligent applications for enterprise clients. Partnered with cross-functional teams to translate business requirements into scalable AI solutions; mentored junior developers and set engineering standards. Designed human-in-the-loop validation pipelines, automated monitoring, and self-healing recovery for production LLM deployments. Drove responsible AI practices: ethical use frameworks, bias audits, and model evaluation protocols.",
    },
    {
      company: "Turing",
      href: "#",
      badges: [],
      location: "Remote",
      title: "RLHF, Benchmarking & Python Development",
      logoUrl: "",
      start: "",
      end: "",
      description:
        "Worked on tasks involving reinforcement learning from human feedback (RLHF), AI benchmarking and Python development.",
    },
    {
      company: "Deccan AI",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Benchmark Engineer",
      logoUrl: "",
      start: "",
      end: "",
      description: "Contributed to AI benchmarking work focused on evaluating model performance.",
    },
    {
      company: "Pest Leads Pro",
      href: "https://pestleadspro.com",
      badges: [],
      location: "Washington DC, United States · Remote",
      title: "Fullstack Engineer & Automation Expert",
      logoUrl: "",
      start: "Mar 2025",
      end: "Aug 2025",
      description:
        "Architected end-to-end lead generation platform v2.5: SEO landing pages, paid acquisition funnels, AI chat widget, and gatekeeper quality-scoring pipeline. Built an n8n-based Router Agent for intelligent vendor matching, credit management, and multi-channel outreach automation. Engineered Digital PR automation (spike detection, GPT-generated press pages, Hunter.io outreach, embeddable trend charts) and deployed background agents for SEO, performance, and auditing on top of PostgreSQL.",
    },
    {
      company: "DOT Ethiopia",
      href: "#",
      badges: [],
      location: "Addis Ababa, Ethiopia",
      title: "MERN Developer & Backend Development Lead",
      logoUrl: "",
      start: "Aug 2024",
      end: "Apr 2025",
      description:
        "Led backend architecture for three MERN applications using TypeScript and Node.js: secure, scalable services with clean architecture and DTOs for type safety. Set up GitHub CI/CD with ESLint/Prettier, implemented JWT cookies and XSS/CSRF protections, and applied Redis caching to reduce database load. Delivered modular, maintainable systems across MongoDB, React, and Git.",
    },
    {
      company: "Hubstaff",
      href: "https://hubstaff.com",
      badges: [],
      location: "Remote · Freelance",
      title: "MERN Stack Developer",
      logoUrl: "",
      start: "Jun 2024",
      end: "Mar 2025",
      description:
        "Built a real-estate platform (chrisFitApp) with a MongoDB, Express, and Node.js (TypeScript) backend and a React + Next.js frontend with Tailwind CSS for SEO-friendly, server-rendered UI. Implemented JWT authentication, ESLint/Prettier code standards, and clean Git workflows for fast, reliable delivery.",
    },
    {
      company: "TapToSign",
      href: "https://taptosign.com/",
      badges: [],
      location: "Remote",
      title: "Full Stack Developer",
      logoUrl: "",
      start: "Sep 2024",
      end: "Jan 2025",
      description:
        "Delivered end-to-end solutions for two international clients on the TapToSign digital-signature platform: high-performance REST APIs with Go (Gin/net/http), PostgreSQL, and Redis for low-latency backend services. Developed a responsive Preact + TypeScript SPA with Tailwind CSS, containerized services with Docker, and set up CI/CD pipelines via GitHub Actions.",
    },
    {
      company: "Aladia",
      href: "#",
      badges: [],
      location: "Remote",
      title: "NuxtJS Front-End & QA Developer",
      logoUrl: "",
      start: "Oct 2024",
      end: "Oct 2024",
      description:
        "Designed comprehensive end-to-end test suites with Cypress and integrated automated testing into the CI/CD pipeline. Applied component-driven development and TDD best practices; rapidly onboarded to both Storybook and Cypress workflows on a NuxtJS codebase.",
    },
  ],
  hobbies: {
    intro:
      "Away from shipping code: football, competitive practice on LeetCode & Codeforces, and reading that keeps me grounded.",
    bookTitle: "The Subtle Art of Not Giving a F*ck",
    bookAuthor: "Mark Manson",
    bookAmazonUrl:
      "https://www.amazon.com/Subtle-Art-Not-Giving-Counterintuitive/dp/0062457713",
    authorUrl: "https://x.com/Markmanson?lang=en",
    bookImage: "/reserve.png",
    bookNote:
      "The idea isn’t to care about nothing; it’s to care on purpose. I try to reserve my focus for work and relationships that actually deserve it, and to say a polite ‘not now’ to noise, vanity metrics, and drama. Same insight as the loud title, just how I’d explain it at the dinner table.",
    leetcodeUrl: "https://leetcode.com/u/yab21-herrii/",
    codeforcesUrl: "https://codeforces.com/profile/eshetieyabibal",
  },
  education: [
    {
      school: "Addis Ababa University",
      href: "https://www.aau.edu.et/",
      degree:
        "B.Sc. Information Science · passed the national exit exam",
      description:
        "Studied at Ethiopia’s flagship university, with coursework spanning algorithms, software engineering, databases, and systems design through an information science lens. Built a strong foundation in problem-solving, research, and building reliable software, skills I still lean on when designing fullstack systems, AI workflows, and production automation today.",
      logoUrl: "/addis%20ababa.png",
      start: "2020",
      end: "2025",
    },
    {
      school: "A2SV (Africa to Silicon Valley)",
      href: "https://a2sv.org/",
      degree: "Data Structures & Algorithms program",
      description:
        "A 16-month intensive program in data structures and algorithms: dynamic programming, graphs, trees, sorting and algorithmic problem-solving in Python and C++.",
      logoUrl: "",
      start: "2024",
      end: "2025",
    },
  ],
  achievements: [
    {
      title: "n8n Ambassador",
      organization: "n8n",
      year: "2026",
      description: "Recognized as an official n8n Ambassador for contributions to workflow automation and production-grade n8n implementations.",
      url: "https://n8n.io/",
    },
    {
      title: "Top Rated, 100% Job Success",
      organization: "Upwork",
      year: "",
      description: "Top Rated freelancer with a 100% Job Success score, delivering software and automation projects for international clients.",
      url: "https://www.upwork.com/freelancers/~01d3355c4ac6227baf",
    },
  ],
  projects: [
    {
      title: "Pest Leads Pro",
      slug: "pest-leads-pro",
      href: "https://pestleadspro.com",
      dates: "Mar 2025 – Aug 2025",
      active: true,
      client: true,
      description:
        "Multi-agent automation platform powering a pest-control lead generation SaaS. Core design: an n8n Router Agent that scores inbound leads, routes them to matched vendors, and manages credits autonomously — no human dispatch required. A separate Digital PR agent monitors incident spikes, generates AI press pages, and fires Hunter.io outreach to earn backlinks at scale. Four background agents (Gardener SEO, Performance Manager, Auditor, Reporter) run on schedule and write results back to PostgreSQL. The frontend surfaces embed APIs, geo/FAQ widgets, and an A/B-configurable AI chat widget built on top of the same data layer.",
      technologies: [
        "Next.js",
        "PostgreSQL",
        "n8n",
        "OpenAI",
        "TypeScript",
        "SEO",
      ],
      links: [
        { type: "Website", href: "https://pestleadspro.com", icon: <Icons.globe className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/pest-leads-pro/800/400",
      video: "",
    },
    {
      title: "Aegis Agent",
      slug: "aegis-agent",
      href: "https://github.com/Yab112/aegis-agent",
      dates: "2026",
      active: true,
      description:
        "Autonomous portfolio concierge backend: agentic RAG over Supabase pgvector, intent routing, confidence-gated answers, Google Calendar and Meet booking, and human-in-the-loop handoff for sensitive leads. FastAPI service with LangGraph-style orchestration, session memory, and lead logging. Powers the live chat agent on this portfolio.",
      technologies: [
        "Python",
        "FastAPI",
        "LangGraph",
        "RAG",
        "Supabase",
        "pgvector",
        "Gemini",
        "Google Calendar",
      ],
      links: [
        { type: "GitHub", href: "https://github.com/Yab112/aegis-agent", icon: <Icons.github className="size-3" /> },
      ],
      image: "/Gemini_Generated_Image_2cd2bj2cd2bj2cd2.png",
      video: "",
    },
    {
      title: "Dual-Agent Architecture AI",
      slug: "dual-agent-architecture-ai",
      href: "https://dual-agent-architecture-ai.vercel.app",
      dates: "2026",
      active: true,
      client: true,
      description:
        "A deliberation tool for architecture decisions. You describe a design problem; two AI advisors, one on Claude and one on OpenAI, argue it over several rounds, and an arbiter returns a recommendation with a confidence score. The result includes where the advisors agreed and disagreed, the key risks, implementation notes, a scorecard across eight engineering principles, generated system and sequence diagrams, and the token count and cost of every round. The debate runs as an n8n workflow; the React app starts it and follows its progress through Supabase.",
      technologies: ["React", "TypeScript", "Vite", "n8n", "Claude", "OpenAI", "Supabase", "Mermaid"],
      links: [
        { type: "Live", href: "https://dual-agent-architecture-ai.vercel.app", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/Dual-Agent-Architecture-AI", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/dual-agent-ai/800/400",
      video: "",
    },
    {
      title: "Eset Coffee",
      slug: "eset-coffee",
      href: "https://www.esetcoffee.com/",
      dates: "",
      active: true,
      client: true,
      description:
        "A three-app system for an Ethiopian specialty coffee brand, in one repository. A public website in four languages (English, Arabic, Chinese, Amharic) presents coffees, origins, quality, export and a journal, and takes buyer enquiries and newsletter sign-ups. A staff admin manages all of that content, email campaigns, roles and permissions with an approval flow and an audit log. Guests in the cafes scan a QR code to answer a feedback questionnaire, which staff review by location. One Fastify API owns the database, email and uploads; the website and admin reach it server to server.",
      technologies: ["Next.js 16", "Fastify 5", "TypeORM", "PostgreSQL", "Tailwind CSS v4", "Zod", "pnpm workspaces"],
      links: [
        { type: "Website", href: "https://www.esetcoffee.com/", icon: <Icons.globe className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/eset-coffee/800/400",
      video: "",
    },
    {
      title: "Arthopia",
      slug: "arthopia",
      href: "https://www.arthopia.com.et/",
      dates: "2025",
      active: true,
      client: true,
      description:
        "An online art marketplace: a storefront where collectors browse artworks, follow artists, save favourites and collections, and buy through a cart and checkout; and a NestJS backend that handles orders, payments, delivery confirmation, disputes between buyers and sellers, and seller withdrawals. Accounts support email and password, Google sign-in and two-factor authentication.",
      technologies: ["React", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "WebSockets", "S3"],
      links: [
        { type: "Website", href: "https://www.arthopia.com.et/", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/art-gallery", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/arthopia/800/400",
      video: "",
    },
    {
      title: "Personalized Arthopia",
      slug: "personalized-arthopia",
      href: "https://personlized.arthopia.com.et/",
      dates: "2025",
      active: true,
      client: true,
      description:
        "AI-powered artist portfolio discovery — personalized recommendations that surface Ethiopian art and artists matching each visitor's taste. Built on top of the Arthopia platform with a recommendation layer.",
      technologies: ["TypeScript", "React", "Next.js", "AI"],
      links: [
        { type: "Website", href: "https://personlized.arthopia.com.et/", icon: <Icons.globe className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/personalized-arthopia/800/400",
      video: "",
    },
    {
      title: "Lumen Tech",
      slug: "lumen-tech",
      href: "https://lumen-tech-navy.vercel.app",
      dates: "",
      active: true,
      client: true,
      description:
        "Marketing and product site for Lumen Lab, the tech studio where I serve as CTO. Built with Next.js for performance, clean component architecture, and strong Core Web Vitals — deployed on Vercel with preview environments per branch.",
      technologies: ["TypeScript", "React", "Next.js"],
      links: [
        { type: "Live", href: "https://lumen-tech-navy.vercel.app", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/lumenTech", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/lumen-tech/800/400",
      video: "",
    },
    {
      title: "Octopus",
      slug: "octopus",
      href: "https://octopus-jet.vercel.app",
      dates: "",
      active: true,
      description:
        "Fullstack application with a clean API/client split: Node.js REST backend and React frontend deployed independently. Demonstrates a scalable repository architecture suited to team-based development, with typed API contracts shared across both layers.",
      technologies: ["TypeScript", "Node.js", "React"],
      links: [
        { type: "Live", href: "https://octopus-jet.vercel.app", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/octopus", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/octopus/800/400",
      video: "",
    },
    {
      title: "GitHub ReadMe Generator",
      slug: "github-readme-generator",
      href: "https://github.com/Yab112",
      dates: "2024",
      active: true,
      description:
        "Web app that uses the GitHub Public API to fetch repository details and file contents, then generates customized README.md files using LLaMA 3. Next.js frontend for a seamless UI, Node.js backend for API handling. Automates documentation by sending GitHub data to LLaMA 3 for markdown creation.",
      technologies: ["Next.js", "Node.js", "GitHub API", "LLaMA 3", "TypeScript"],
      links: [
        { type: "GitHub", href: "https://github.com/Yab112", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/github-readme-gen/800/400",
      video: "",
    },
    {
      title: "Local Context Orchestrator",
      slug: "local-context-orchestrator",
      href: "https://github.com/Yab112/Context-Orchestrator",
      dates: "2024",
      active: true,
      description:
        "A local MCP server that sends an AI coding assistant small, relevant slices of code instead of whole files, to cut API cost and context drift. It indexes a project locally using syntax-tree parsing, language-server understanding and a dependency graph, caches context, and exposes six tools to MCP clients such as Cursor. A CLI sets up a project in one command, rebuilds the index, reports token and cache metrics and benchmarks the token savings.",
      technologies: ["Python", "MCP", "AST", "LSP", "uv"],
      links: [
        { type: "GitHub", href: "https://github.com/Yab112", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/local-context-mcp/800/400",
      video: "",
    },
    {
      title: "RAG Evaluation Framework",
      slug: "rag-evaluation-framework",
      href: "https://github.com/Yab112",
      dates: "",
      active: true,
      description:
        "An evaluation workflow for retrieval-augmented generation apps: automated test generation, multi-dimensional scoring, hallucination checks, golden datasets and regression tracking. Deterministic pass/fail evaluation with MLflow experiment tracking, so a RAG feature that passes today is proven to still pass after the next change.",
      technologies: ["Python", "MLflow", "RAG", "LLM evaluation"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Compliance Navigator",
      slug: "compliance-navigator",
      href: "https://github.com/Yab112/Compliance-Navigator-Api",
      dates: "In progress",
      active: true,
      description:
        "Graph-based decision support for Ethiopian business compliance. It maps regulatory requirements as a dependency graph and produces a step-by-step roadmap to a goal such as a passport, a TIN or a trade licence, per sub-city. Each step shows the office, the fee, the documents, the legal basis and whether it can be done at a MESOB one-stop centre. It mirrors the MESOB service catalogue (24 institutions, about 470 services in English and Amharic, 19 centres), runs a registry of licensed errand agents, and has an English and Amharic assistant with voice that builds roadmaps and cites its sources.",
      technologies: ["FastAPI", "Neo4j", "PostgreSQL", "pgvector", "Next.js", "TanStack Query", "Zustand", "Ollama", "Claude"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "BillShare",
      slug: "billshare",
      href: "https://github.com/Yab112",
      dates: "2026 – Present",
      active: true,
      description:
        "A house bill-splitting app. Housemates share a room with chat, split each purchase item by item, and see balances that are never stored: they are recomputed from purchases and payments every time. Anyone can settle at any time by paying through Telebirr and uploading the screenshot, which the backend verifies. It also has spending insights, an assistant that answers from the room's real balances and history, and an admin app.",
      technologies: ["Flutter", "FastAPI", "Supabase", "PostgreSQL", "Telebirr"],
      links: [],
      image: "",
      video: "",
    },
  ],
} as const;
