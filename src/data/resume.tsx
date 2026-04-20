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
      title: "Fullstack",
      whatIBring: "End-to-end ownership from UI to database and deployment. I ship production-ready features with clear APIs, consistent patterns, and tests.",
      whyGood: "I’ve built and maintained fullstack products across health, education, and automation. I care about DX, performance, and maintainability so teams can move fast without tech debt.",
    },
    {
      title: "AI Security & Reliability",
      whatIBring: "Human-in-the-loop flows, guardrails, and self-healing patterns so AI systems stay safe and reliable in production.",
      whyGood: "I focus on where AI can fail or be misused, and design controls and monitoring so you get the upside without the risk. TDD and evaluation pipelines are part of my default workflow.",
    },
    {
      title: "Production Automation",
      whatIBring: "Automation that scales: workflow design, custom engines, and AWS-backed infra so processes run reliably and are easy to change.",
      whyGood: "I’ve built automation platforms with owned databases and deployed them on AWS. I care about observability, retries, and making it easy to extend workflows without rewriting systems.",
    },
    {
      title: "Architecture & DevOps",
      whatIBring: "Systems that scale and ship: multi-tenant design, clear service boundaries, CI/CD, and infra that’s reproducible and observable.",
      whyGood: "I design for production from day one: logging, metrics, and failure modes. I’ve worked with Docker, Kubernetes, and AWS and prefer iterative design over big-bang rewrites.",
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
      company: "Orizon Technology",
      href: "#",
      badges: [],
      location: "Addis Ababa, Ethiopia · Hybrid",
      title: "Software Developer · Senior Lead (AI)",
      logoUrl: "",
      start: "Nov 2025",
      end: "Present",
      description:
        "Senior lead developer on AI: design, development, and deployment of machine learning-driven intelligent applications. Partner with cross-functional teams to turn business requirements into scalable AI solutions; mentor junior developers; set code-quality standards; and prioritize ethical AI use. Stay current with ML/AI research to ship impactful, responsible features.",
    },
    {
      company: "Pest Leads Pro",
      href: "https://pestleadspro.com",
      badges: [],
      location: "Remote",
      title: "Fullstack Engineer & Automation Expert",
      logoUrl: "",
      start: "2024",
      end: "Present",
      description:
        "End-to-end lead generation platform v2.5: SEO landing pages, paid acquisition, lead wizard + AI chat widget, gatekeeper/quality scoring, and n8n-based Router Agent for vendor matching and credits. Built Digital PR automation (spike detection, GPT press pages, Hunter outreach, embeddable trend charts for backlinks), background agents (Gardener SEO, Performance Manager, Auditor), vendor portal, and PostgreSQL ops. Owned frontend components (FAQ/geo widgets, email templates, embed API), chat A/B config, and production deployment.",
    },
    {
      company: "DOT Ethiopia",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Project Lead Developer",
      logoUrl: "",
      start: "Aug 2024",
      end: "Apr 2025",
      description:
        "Led backend architecture for three MERN applications using TypeScript and Node.js: secure, scalable services with clean architecture, DTOs for type safety, GitHub CI/CD with ESLint/Prettier, JWT cookies and XSS/CSRF protections. Redis caching to cut database load; modular design with MongoDB, React, and Git.",
    },
    {
      company: "Hubstaff",
      href: "https://hubstaff.com",
      badges: [],
      location: "Freelance",
      title: "Developer (chrisFitApp)",
      logoUrl: "",
      start: "Jun 2024",
      end: "Mar 2025",
      description:
        "MERN-stack work on a real-estate platform: MongoDB, Express, Node.js (TypeScript) backend; React and Next.js with Tailwind for SEO-friendly UI. JWT auth, ESLint/Prettier, Git workflows, and fast-paced delivery with SSR experience across MongoDB, React, Next.js, and TypeScript.",
    },
    {
      company: "Upwork · Tap to Sign",
      href: "https://taptosign.com/",
      badges: [],
      location: "Remote",
      title: "Full Stack Engineer",
      logoUrl: "",
      start: "Sep 2024",
      end: "Jan 2025",
      description:
        "End-to-end work for international clients on TapToSign: high-performance REST APIs with Go (Gin), PostgreSQL, and Redis; responsive Preact + TypeScript SPA with Tailwind; Dockerized services and GitHub Actions CI/CD. Learned concurrency, lightweight frontends, and DevOps automation (Go, Preact, PostgreSQL, Redis, Docker).",
    },
    {
      company: "Upwork · Tap Top Sign",
      href: "https://www.upwork.com/",
      badges: [],
      location: "United Kingdom · Remote",
      title: "Full Stack Developer",
      logoUrl: "",
      start: "Sep 2024",
      end: "Nov 2024",
      description:
        "Tap Top Sign: digitizing manual signing with fullstack ownership for seamless UX and reliable backend/frontend delivery. Stack included PHP, React, Next.js, NestJS, Node.js, TypeScript, Python, Tailwind, Git/GitHub.",
    },
    {
      company: "Contract",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Quality Assurance Developer",
      logoUrl: "",
      start: "Oct 2024",
      end: "Oct 2024",
      description:
        "End-to-end Cypress test suites; automated testing in CI/CD; component-driven development and TDD; Storybook + Cypress workflows.",
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
  projects: [
    {
      title: "Pest Leads Pro",
      slug: "pest-leads-pro",
      href: "https://pestleadspro.com",
      dates: "v2.5 · 2024",
      active: true,
      description:
        "End-to-end lead generation SaaS: traffic from SEO pages, backlinks, paid ads, and digital PR; Lead Wizard + AI Pest Advisor chat widget; gatekeeper pipeline (normalization, quality score, pricing); n8n Router Agent for vendor match, credits, and notifications. Digital PR automation detects incident spikes, generates press pages with embeddable trend charts, and runs outreach (Hunter.io) for earned backlinks. Background n8n agents for SEO content, performance, audits, and reporting. Stack includes PostgreSQL, vendor portal, SMS/email, and production-hardened frontend (FAQ/geo widgets, embed API, email templates).",
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
      image: "",
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
      description:
        "Exploration of dual-agent AI architecture with a deployed demo. TypeScript stack; focuses on agent coordination patterns you can extend for production LLM workflows.",
      technologies: ["TypeScript", "Next.js", "OpenAI", "AI"],
      links: [
        { type: "Live", href: "https://dual-agent-architecture-ai.vercel.app", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/Dual-Agent-Architecture-AI", icon: <Icons.github className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Yeabrak",
      slug: "yeabrak",
      href: "https://app.yeabrak.com/",
      dates: "Ongoing",
      active: true,
      description:
        "Pregnancy companion app: personalized health guidance and resources for expectant mothers. Fullstack product with a focus on usable, trustworthy health UX.",
      technologies: ["React", "Django", "PostgreSQL"],
      links: [
        { type: "Website", href: "https://app.yeabrak.com/", icon: <Icons.globe className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Addis Astemari",
      slug: "addis-astemari",
      href: "https://www.addisastemari.com/",
      dates: "Ongoing",
      active: true,
      description:
        "Platform for schools and educators to build teaching sites and sell online courses, with education-focused tooling in the Ethiopian market.",
      technologies: ["Next.js", "Mantine UI", "Tailwind CSS"],
      links: [
        { type: "Website", href: "https://www.addisastemari.com/", icon: <Icons.globe className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Eset Coffee",
      slug: "eset-coffee",
      href: "https://www.esetcoffee.com/",
      dates: "Recent",
      active: true,
      description:
        "Commercial coffee brand web presence: product storytelling, ordering touchpoints, and a polished front-end experience for a real business.",
      technologies: ["Next.js", "TypeScript", "React"],
      links: [
        { type: "Website", href: "https://www.esetcoffee.com/", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/essetcoffee", icon: <Icons.github className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Art Gallery",
      slug: "art-gallery",
      href: "https://art-gallery-rouge-gamma.vercel.app",
      dates: "Recent",
      active: true,
      description:
        "Gallery-style web app for browsing and showcasing artwork: responsive UI and deployment on Vercel.",
      technologies: ["TypeScript", "React", "Next.js"],
      links: [
        { type: "Live", href: "https://art-gallery-rouge-gamma.vercel.app", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/art-gallery", icon: <Icons.github className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Lumen Tech",
      slug: "lumen-tech",
      href: "https://lumen-tech-navy.vercel.app",
      dates: "Recent",
      active: true,
      description:
        "Product/marketing site demo deployed on Vercel with modern layout and performance-oriented front-end patterns.",
      technologies: ["TypeScript", "React", "Next.js"],
      links: [
        { type: "Live", href: "https://lumen-tech-navy.vercel.app", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/lumenTech", icon: <Icons.github className="size-3" /> },
      ],
      image: "",
      video: "",
    },
    {
      title: "Octopus",
      slug: "octopus",
      href: "https://octopus-jet.vercel.app",
      dates: "Recent",
      active: true,
      description:
        "Fullstack-style app deployed on Vercel with a dedicated backend repo pattern (API + client split for clarity).",
      technologies: ["TypeScript", "Node.js", "React"],
      links: [
        { type: "Live", href: "https://octopus-jet.vercel.app", icon: <Icons.globe className="size-3" /> },
        { type: "GitHub", href: "https://github.com/Yab112/octopus", icon: <Icons.github className="size-3" /> },
      ],
      image: "",
      video: "",
    },
  ],
} as const;
