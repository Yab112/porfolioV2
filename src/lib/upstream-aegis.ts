/** Same origin as the Aegis Agent HTTP API (chat, blog, etc.). */

export const DEFAULT_AEGIS_API_BASE = "https://aegis-agent-5omj.onrender.com";

export function getAegisApiBase(): string {
  const raw = process.env.AEGIS_AGENT_API_URL?.trim() || DEFAULT_AEGIS_API_BASE;
  return raw.replace(/\/$/, "");
}
