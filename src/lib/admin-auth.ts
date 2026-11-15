/**
 * Admin sign-in for /admin: one owner, one password, a signed session cookie.
 *
 * Server env (Vercel → Settings → Environment Variables):
 *   ADMIN_PASSWORD         what you type on /admin/login (use a long passphrase)
 *   ADMIN_SESSION_SECRET   random string used to sign the cookie
 *   AEGIS_ADMIN_API_KEY    the backend's API_SECRET_KEY; never sent to the browser
 *
 * Uses Web Crypto only, so the same code runs in middleware (edge) and route handlers.
 */
export const ADMIN_COOKIE = "admin_session";
export const ADMIN_SESSION_DAYS = 7;

const enc = new TextEncoder();

function hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

/** Compare without leaking where two strings first differ. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim() && process.env.ADMIN_SESSION_SECRET?.trim());
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!expected || !secret || !candidate) return false;
  // Hash both sides so the comparison is over equal-length strings.
  return safeEqual(await hmac(secret, `pw:${candidate}`), await hmac(secret, `pw:${expected}`));
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET!.trim();
  const expires = Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${expires}.${await hmac(secret, `session:${expires}`)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || !token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return safeEqual(sig, await hmac(secret, `session:${expires}`));
}
