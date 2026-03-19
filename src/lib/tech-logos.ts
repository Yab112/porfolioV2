/**
 * Simple Icons CDN: https://cdn.simpleicons.org/{slug}
 * @see https://simpleicons.org/
 */
const SLUG_BY_LABEL: Record<string, string> = {
  Python: "python",
  JavaScript: "javascript",
  TypeScript: "typescript",
  FastAPI: "fastapi",
  "Node.js": "nodedotjs",
  Express: "express",
  React: "react",
  "Next.js": "nextdotjs",
  PostgreSQL: "postgresql",
  MongoDB: "mongodb",
  Redis: "redis",
  OpenAI: "openai",
  LangChain: "langchain",
  HuggingFace: "huggingface",
  n8n: "n8n",
  Make: "make",
  AWS: "amazonaws",
  Docker: "docker",
  Kubernetes: "kubernetes",
  "CI/CD": "githubactions",
  TDD: "jest",
};

export function getTechLogoUrl(item: string): string | null {
  const slug = SLUG_BY_LABEL[item];
  if (!slug) return null;
  return `https://cdn.simpleicons.org/${slug}`;
}
