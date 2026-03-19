/**
 * Technical terms → Wikipedia URLs. Used site-wide so visitors can look up terms.
 * Longest phrases first so "production automation" matches before "production".
 */
export const WIKI_LINKS: ReadonlyArray<{ phrase: string; url: string }> = [
  { phrase: "production-grade automation systems", url: "https://en.wikipedia.org/wiki/Automation" },
  { phrase: "multi-tenant architecture", url: "https://en.wikipedia.org/wiki/Multitenancy" },
  { phrase: "test-driven development", url: "https://en.wikipedia.org/wiki/Test-driven_development" },
  { phrase: "retrieval-augmented generation", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" },
  { phrase: "Fullstack Engineer", url: "https://en.wikipedia.org/wiki/Full-stack_developer" },
  { phrase: "fullstack engineer", url: "https://en.wikipedia.org/wiki/Full-stack_developer" },
  { phrase: "human-in-the-loop", url: "https://en.wikipedia.org/wiki/Human-in-the-loop" },
  { phrase: "production automation", url: "https://en.wikipedia.org/wiki/Automation" },
  { phrase: "AI security", url: "https://en.wikipedia.org/wiki/AI_safety" },
  { phrase: "self-healing", url: "https://en.wikipedia.org/wiki/Self-management_(computer_science)" },
  { phrase: "RAG system", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" },
  { phrase: "LLM agent", url: "https://en.wikipedia.org/wiki/Large_language_model" },
  { phrase: "multi-tenant", url: "https://en.wikipedia.org/wiki/Multitenancy" },
  { phrase: "Microservices", url: "https://en.wikipedia.org/wiki/Microservices" },
  { phrase: "Event-driven", url: "https://en.wikipedia.org/wiki/Event-driven_architecture" },
  { phrase: "Kubernetes", url: "https://en.wikipedia.org/wiki/Kubernetes" },
  { phrase: "PostgreSQL", url: "https://en.wikipedia.org/wiki/PostgreSQL" },
  { phrase: "TypeScript", url: "https://en.wikipedia.org/wiki/TypeScript" },
  { phrase: "JavaScript", url: "https://en.wikipedia.org/wiki/JavaScript" },
  { phrase: "Next.js", url: "https://en.wikipedia.org/wiki/Next.js" },
  { phrase: "LangChain", url: "https://en.wikipedia.org/wiki/LangChain" },
  { phrase: "MongoDB", url: "https://en.wikipedia.org/wiki/MongoDB" },
  { phrase: "FastAPI", url: "https://en.wikipedia.org/wiki/FastAPI" },
  { phrase: "Node.js", url: "https://en.wikipedia.org/wiki/Node.js" },
  { phrase: "Django", url: "https://en.wikipedia.org/wiki/Django_(web_framework)" },
  { phrase: "Docker", url: "https://en.wikipedia.org/wiki/Docker_(software)" },
  { phrase: "React", url: "https://en.wikipedia.org/wiki/React_(web_framework)" },
  { phrase: "Python", url: "https://en.wikipedia.org/wiki/Python_(programming_language)" },
  { phrase: "Redis", url: "https://en.wikipedia.org/wiki/Redis" },
  { phrase: "Express", url: "https://en.wikipedia.org/wiki/Express.js" },
  { phrase: "OpenAI", url: "https://en.wikipedia.org/wiki/OpenAI" },
  { phrase: "RAG", url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" },
  { phrase: "AWS", url: "https://en.wikipedia.org/wiki/Amazon_Web_Services" },
  { phrase: "CI/CD", url: "https://en.wikipedia.org/wiki/CI/CD" },
  { phrase: "TDD", url: "https://en.wikipedia.org/wiki/Test-driven_development" },
  { phrase: "Tailwind CSS", url: "https://en.wikipedia.org/wiki/Tailwind_CSS" },
  { phrase: "webhook", url: "https://en.wikipedia.org/wiki/Webhook" },
  { phrase: "API", url: "https://en.wikipedia.org/wiki/API" },
  { phrase: "n8n", url: "https://en.wikipedia.org/wiki/N8n" },
  { phrase: "React Query", url: "https://en.wikipedia.org/wiki/React_Query" },
  { phrase: "MLflow", url: "https://en.wikipedia.org/wiki/MLflow" },
];

const SORTED = [...WIKI_LINKS].sort((a, b) => b.phrase.length - a.phrase.length);

export type WikiSegment = { type: "text"; content: string } | { type: "link"; content: string; url: string };

export function getWikiSegments(text: string): WikiSegment[] {
  const segments: WikiSegment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let found: { phrase: string; url: string; index: number } | null = null;
    for (const { phrase, url } of SORTED) {
      const i = remaining.toLowerCase().indexOf(phrase.toLowerCase());
      if (i !== -1 && (found === null || i < found.index)) {
        found = { phrase, url, index: i };
      }
    }
    if (found === null) {
      segments.push({ type: "text", content: remaining });
      break;
    }
    if (found.index > 0) {
      segments.push({ type: "text", content: remaining.slice(0, found.index) });
    }
    segments.push({
      type: "link",
      content: remaining.slice(found.index, found.index + found.phrase.length),
      url: found.url,
    });
    remaining = remaining.slice(found.index + found.phrase.length);
  }
  return segments;
}

export function getWikiUrl(term: string): string | undefined {
  const lower = term.toLowerCase();
  return WIKI_LINKS.find(({ phrase }) => phrase.toLowerCase() === lower)?.url;
}
