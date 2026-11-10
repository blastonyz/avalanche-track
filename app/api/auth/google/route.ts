import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { cookieBase } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Paso 1: manda al usuario a Google (código de autorización + PKCE + state + nonce). */
export async function GET(req: NextRequest) {
  let e: ReturnType<typeof env>;
  try {
    e = env();
  } catch (err) {
    console.error("[auth] config:", err);
    return NextResponse.redirect(new URL("/?auth=config", req.url));
  }

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const nonce = randomBytes(16).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: e.clientId,
    redirect_uri: e.callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  const res = NextResponse.redirect(url);
  res.cookies.set("oauth_tx", `${state}.${verifier}.${nonce}`, {
    ...cookieBase,
    path: "/callback",
    maxAge: 600,
  });
  return res;
}
