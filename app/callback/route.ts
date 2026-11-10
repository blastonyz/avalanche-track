import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { env } from "@/lib/env";
import { TeamModel } from "@/lib/models/Team";
import { UserModel } from "@/lib/models/User";
import { cookieBase, createSession, SESSION_COOKIE, SESSION_DAYS } from "@/lib/session";

export const dynamic = "force-dynamic";

const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

/** Paso 2: Google vuelve acá con ?code=…&state=… */
export async function GET(req: NextRequest) {
  const fail = (why: string) => {
    console.error("[auth] callback:", why);
    const res = NextResponse.redirect(new URL("/?auth=error", req.url));
    res.cookies.set("oauth_tx", "", { ...cookieBase, path: "/callback", maxAge: 0 });
    return res;
  };

  try {
    const e = env();
    const q = req.nextUrl.searchParams;
    if (q.get("error")) return fail(`google: ${q.get("error")}`);

    const code = q.get("code");
    const state = q.get("state");
    const tx = req.cookies.get("oauth_tx")?.value?.split(".");
    if (!code || !state || !tx || tx.length !== 3) return fail("faltan code, state o cookie");
    const [savedState, verifier, nonce] = tx;
    if (state !== savedState) return fail("state inválido");

    // Código -> tokens (el client secret nunca sale del servidor)
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: e.clientId,
        client_secret: e.clientSecret,
        redirect_uri: e.callbackUrl,
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
    });
    if (!tokenRes.ok) return fail(`token endpoint ${tokenRes.status}`);
    const { id_token } = (await tokenRes.json()) as { id_token?: string };
    if (!id_token) return fail("sin id_token");

    // Verificación de firma, emisor, audiencia y vencimiento
    const { payload } = await jwtVerify(id_token, JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: e.clientId,
    });
    if (payload.nonce !== nonce) return fail("nonce inválido");
    if (payload.email_verified !== true) return fail("email sin verificar");
    const sub = String(payload.sub ?? "");
    const email = String(payload.email ?? "");
    if (!sub || !email) return fail("token sin sub o email");

    await connect();
    const user = await UserModel.findOneAndUpdate(
      { googleId: sub },
      {
        $set: {
          email,
          name: String(payload.name ?? email).slice(0, 120),
          picture: String(payload.picture ?? ""),
          lastLoginAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    await TeamModel.updateOne(
      { "members.user": user._id },
      { $set: { "members.$.name": user.name, "members.$.email": user.email } },
    );

    const res = NextResponse.redirect(new URL(user.access === "admin" ? "/panel" : "/perfil", req.url), 303);
    res.cookies.set(SESSION_COOKIE, await createSession(String(user._id)), {
      ...cookieBase,
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    res.cookies.set("oauth_tx", "", { ...cookieBase, path: "/callback", maxAge: 0 });
    return res;
  } catch (err) {
    return fail(err instanceof Error ? err.message : "error desconocido");
  }
}
