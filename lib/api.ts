import { NextRequest, NextResponse } from "next/server";

export class AppError extends Error {
  constructor(public code: string, public status = 400) {
    super(code);
  }
}

export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "cache-control": "no-store" } });

/** Defensa extra contra CSRF: los métodos que escriben solo aceptan el mismo origen. */
export const sameOrigin = (req: NextRequest) => req.headers.get("origin") === req.nextUrl.origin;

export async function run(req: NextRequest, write: boolean, fn: () => Promise<NextResponse>) {
  if (write && !sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    return await fn();
  } catch (e) {
    if (e instanceof AppError) return json({ error: e.code }, e.status);
    console.error("[api]", req.method, req.nextUrl.pathname, e);
    return json({ error: "server" }, 503);
  }
}
