/** Solo https. Evita javascript:, data: y similares porque el admin los abre como links. */
export function cleanUrl(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return "";
  if (s.length > 500) return null;
  try {
    const u = new URL(s);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export const isHttps = (s: string) => s.startsWith("https://");
