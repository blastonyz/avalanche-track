import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Google vuelve acá (la URI registrada). Se reenvía tal cual al handler de next-auth, que valida state y PKCE. */
export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL(`/api/auth/callback/google${req.nextUrl.search}`, req.url), 307);
}
