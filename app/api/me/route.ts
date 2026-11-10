import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { UserModel, CATEGORY_IDS, ROLE_IDS, type UserDoc } from "@/lib/models/User";
import { cookieBase, readSession, SESSION_COOKIE } from "@/lib/session";
import { SKILLS } from "@/lib/guide";
import type { User } from "@/lib/types";

export const dynamic = "force-dynamic";

const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "cache-control": "no-store" } });

async function current(req: NextRequest) {
  const id = await readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!id || !Types.ObjectId.isValid(id)) return null;
  await connect();
  return UserModel.findById(id);
}

/** Defensa extra contra CSRF: los métodos que escriben solo aceptan el mismo origen. */
const sameOrigin = (req: NextRequest) => {
  const o = req.headers.get("origin");
  return !!o && o === req.nextUrl.origin;
};

function serialize(u: UserDoc & { _id: unknown; createdAt?: Date }): User {
  return {
    id: String(u._id),
    name: u.name ?? "",
    email: u.email,
    picture: u.picture || undefined,
    createdAt: (u.createdAt ?? new Date()).toISOString(),
    profile: {
      team: u.team ?? "",
      role: (u.role ?? "") as User["profile"]["role"],
      category: (u.category ?? "") as User["profile"]["category"],
      skills: u.skills ?? [],
      github: u.github ?? "",
      wallet: u.wallet ?? "",
      bio: u.bio ?? "",
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const u = await current(req);
    return u ? json(serialize(u)) : json({ error: "no-session" }, 401);
  } catch (err) {
    console.error("[me] GET:", err);
    return json({ error: "server" }, 503);
  }
}

export async function PATCH(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    const u = await current(req);
    if (!u) return json({ error: "no-session" }, 401);

    const b = (await req.json()) as Record<string, unknown>;
    const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

    if ("team" in b) u.team = str(b.team, 60);
    if ("bio" in b) u.bio = str(b.bio, 500);
    if ("github" in b) {
      const v = str(b.github, 39);
      if (!/^[A-Za-z0-9-]*$/.test(v)) return json({ error: "github" }, 400);
      u.github = v;
    }
    if ("wallet" in b) {
      const v = str(b.wallet, 42);
      if (!/^(0x[a-fA-F0-9]{40})?$/.test(v)) return json({ error: "wallet" }, 400);
      u.wallet = v;
    }
    if ("role" in b) {
      const v = str(b.role, 20);
      if (v && !ROLE_IDS.includes(v)) return json({ error: "role" }, 400);
      u.role = v;
    }
    if ("category" in b) {
      const v = str(b.category, 20);
      if (v && !CATEGORY_IDS.includes(v)) return json({ error: "category" }, 400);
      u.category = v;
    }
    if ("skills" in b && Array.isArray(b.skills)) {
      u.skills = [...new Set(b.skills.filter((s): s is string => typeof s === "string" && SKILLS.includes(s)))].slice(0, 8);
    }

    await u.save();
    return json(serialize(u));
  } catch (err) {
    console.error("[me] PATCH:", err);
    return json({ error: "server" }, 503);
  }
}

/** Borra la cuenta y sus datos. */
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    const u = await current(req);
    if (!u) return json({ error: "no-session" }, 401);
    await u.deleteOne();
    const res = json({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", { ...cookieBase, path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error("[me] DELETE:", err);
    return json({ error: "server" }, 503);
  }
}
