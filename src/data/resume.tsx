import { Icons } from "@/components/icons";
import { BookOpen, Briefcase, HomeIcon } from "lucide-react";

export const DATA = {
  name: "Yabibal Eshetie Molla",
  initials: "YE",
  url: "https://yabibal.site",
  location: "Addis Ababa, Ethiopia",
  locationLink: "https://www.google.com/maps/place/addis+ababa",
  description:
    "Fullstack Engineer specializing in AI security, self-healing automation, and production-grade multi-tenant systems.",
  /** Open Graph / Twitter / social preview (`public/SEO.png`) */
  ogImage: "/SEO.png",
  ogImageAlt:
    "Yabibal Eshetie Molla - Fullstack engineer, AI security, automation, Addis Ababa",
  summary:
    "I'm a fullstack engineer specializing in AI security and production-grade automation systems. I design and implement end-to-end solutions that prioritize reliability, security, and maintainability. My work focuses on building intelligent systems that can operate autonomously while maintaining human oversight and control.\n\nCurrent focus: AI security patterns (human-in-the-loop, self-healing), production automation with AWS, multi-tenant architecture, test-driven development for AI workflows, LLM agent development, and RAG system implementation.",
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
    resumePdfUrl: "/yabibal-Eshetie-FlowCV-Resume-20250418.pdf",
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
      start: "2026",
      end: "Present",
      description:
        "Production SaaS managing complex payroll workflows and tax advisor data with strict RBAC and Row-Level Security. Implemented Next.js 15 Partial Pre-rendering: static shell served from the edge in <50ms with user-specific data streamed via React Server Components. Dynamic per-tenant cache tagging for granular CDN purges, JWT verification, and tenant context injection at the middleware edge layer. Maintained 194+ Playwright tests (E2E, API, UI) ensuring zero-regression production deployments.",
    },
    {
      company: "Orizon Technology",
      href: "#",
      badges: [],
      location: "Addis Ababa, Ethiopia · Hybrid",
      title: "Senior Lead, AI Engineering",
      logoUrl: "",
      start: "Aug 2025",
      end: "May 2026",
      description:
        "Led architecture, development, and deployment of ML-driven intelligent applications for enterprise clients. Partnered with cross-functional teams to translate business requirements into scalable AI solutions; mentored junior developers and set engineering standards. Designed human-in-the-loop validation pipelines, automated monitoring, and self-healing recovery for production LLM deployments. Drove responsible AI practices: ethical use frameworks, bias audits, and model evaluation protocols.",
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
      company: "Aldia",
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
        "B.Sc. Information Science",
      description:
        "Studied at Ethiopia’s flagship university, with coursework spanning algorithms, software engineering, databases, and systems design through an information science lens. Built a strong foundation in problem-solving, research, and building reliable software, skills I still lean on when designing fullstack systems, AI workflows, and production automation today.",
      logoUrl: "/addis%20ababa.png",
      start: "2015",
      end: "2019",
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
  ],
  projects: [
    {
      title: "Pest Leads Pro",
      slug: "pest-leads-pro",
      href: "https://pestleadspro.com",
      dates: "v2.5 · 2025",
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
        "Production-ready dual-agent system where a Planner agent decomposes user goals into structured subtasks and a Worker agent executes them with isolated context. Implements structured handoff protocols, error recovery, and observable step-by-step output so failures surface at the right layer. Deployed as an interactive Next.js demo; the patterns map directly to production LLM workflows.",
      technologies: ["TypeScript", "Next.js", "OpenAI", "AI"],
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
      dates: "Recent",
      active: true,
      client: true,
      description:
        "Full marketing and e-commerce web presence for Eset Coffee, an Ethiopian specialty coffee brand. Covers product storytelling, origin traceability pages, and ordering touchpoints — built with Next.js and TypeScript for fast load times and strong SEO.",
      technologies: ["Next.js", "TypeScript", "React"],
      links: [
        { type: "Website", href: "https://www.esetcoffee.com/", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/essetcoffee", icon: <Icons.github className="size-3" /> },
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
        "Ethiopian art discovery platform — curated galleries, artist portfolio pages, and category-based browsing. Built with Next.js and TypeScript for fast SEO-friendly artwork discovery.",
      technologies: ["TypeScript", "React", "Next.js"],
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
        { type: "GitHub", href: "https://github.com/Yab112/Personalized-Portfolio-artists", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/personalized-arthopia/800/400",
      video: "",
    },
    {
      title: "Lumen Tech",
      slug: "lumen-tech",
      href: "https://lumen-tech-navy.vercel.app",
      dates: "Recent",
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
      dates: "Recent",
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
      href: "https://github.com/Yab112",
      dates: "2024",
      active: true,
      description:
        "MCP Server with a superadmin dashboard for managing admin behaviors, CRUD operations, and KPI tracking. Next.js frontend for a responsive interface and Node.js backend for secure data handling, enabling seamless control over admin actions and data management.",
      technologies: ["Next.js", "Node.js", "TypeScript", "MCP"],
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
      dates: "2025",
      active: true,
      description:
        "Automated test generation, multi-dimensional scoring, and hallucination detection for retrieval-augmented generation apps. Deterministic pass/fail harness with golden datasets and regression tracking (SWE-bench-style AI evaluation architecture). Continuous evaluation pipeline with MLflow experiment tracking and performance regression alerting.",
      technologies: ["Python", "RAG", "MLflow", "LLM", "Evaluation", "FastAPI"],
      links: [
        { type: "GitHub", href: "https://github.com/Yab112", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/rag-eval-framework/800/400",
      video: "",
    },
    {
      title: "Compliance Navigator",
      slug: "compliance-navigator",
      href: "https://github.com/Yab112",
      dates: "2025",
      active: true,
      description:
        "Maps regulatory frameworks (SOC 2, GDPR, HIPAA) to operational business processes with automated violation detection and actionable remediation guidance. Pluggable rule engine with custom compliance rules, weighted severity scoring (Critical → Info), and allow/deny decision trees. Tamper-proof audit trail using cryptographic hash chaining for immutable, verifiable compliance decision history.",
      technologies: ["TypeScript", "Node.js", "PostgreSQL", "Compliance", "Rule Engine"],
      links: [
        { type: "GitHub", href: "https://github.com/Yab112", icon: <Icons.github className="size-3" /> },
      ],
      image: "https://picsum.photos/seed/compliance-nav/800/400",
      video: "",
    },
  ],
} as const;
