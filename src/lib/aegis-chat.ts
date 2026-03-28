/** Types aligned with Aegis Agent API (see chatbot.md). */

export type ChatIntent = "general_qa" | "book_meeting" | "handoff" | null;

export interface ChatResponseBody {
  response: string;
  session_id: string;
  sources: string[];
  intent: ChatIntent;
  confidence: number | null;
}

export const AEGIS_SESSION_STORAGE_KEY = "aegis-agent-session-id";

export function formatChatErrorDetail(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => JSON.stringify(e)).join("; ");
  try {
    return JSON.stringify(detail ?? "Request failed");
  } catch {
    return "Request failed";
  }
}

export function intentLabel(intent: ChatIntent): string | null {
  if (!intent) return null;
  const map: Record<string, string> = {
    general_qa: "Portfolio Q&A",
    book_meeting: "Scheduling",
    handoff: "Talk to Yabibal",
  };
  return map[intent] ?? intent;
}

export function sourceDisplayName(raw: string): string {
  return raw.replace(/_/g, " ");
}
