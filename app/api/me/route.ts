import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AppError, json, run } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { SKILLS } from "@/lib/guide";
import { CATEGORY_IDS, ROLE_IDS } from "@/lib/models/User";
import { cookieBase, SESSION_COOKIE } from "@/lib/session";
import { leaveTeam } from "@/lib/team";
import type { User } from "@/lib/types";

export const dynamic = "force-dynamic";

type Doc = Awaited<ReturnType<typeof requireUser>>;

function serialize(u: Doc): User {
  return {
    id: String(u._id),
    name: u.name ?? "",
    email: u.email,
    picture: u.picture || undefined,
    access: u.access === "admin" ? "admin" : "user",
    haveTeam: !!u.haveTeam,
    createdAt: (u.createdAt ?? new Date()).toISOString(),
    profile: {
      role: (u.role ?? "") as User["profile"]["role"],
      category: (u.category ?? "") as User["profile"]["category"],
      skills: u.skills ?? [],
      github: u.github ?? "",
      wallet: u.wallet ?? "",
      bio: u.bio ?? "",
    },
  };
}

export const GET = (req: NextRequest) => run(req, false, async () => json(serialize(await requireUser())));

export const PATCH = (req: NextRequest) =>
  run(req, true, async () => {
    const u = await requireUser();
    const b = (await req.json()) as Record<string, unknown>;
    const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

    if ("bio" in b) u.bio = str(b.bio, 500);
    if ("github" in b) {
      const v = str(b.github, 39);
      if (!/^[A-Za-z0-9-]*$/.test(v)) throw new AppError("github");
      u.github = v;
    }
    if ("wallet" in b) {
      const v = str(b.wallet, 42);
      if (!/^(0x[a-fA-F0-9]{40})?$/.test(v)) throw new AppError("wallet");
      u.wallet = v;
    }
    if ("role" in b) {
      const v = str(b.role, 20);
      if (v && !ROLE_IDS.includes(v)) throw new AppError("role");
      u.role = v;
    }
    if ("category" in b) {
      const v = str(b.category, 20);
      if (v && !CATEGORY_IDS.includes(v)) throw new AppError("category");
      u.category = v;
    }
    if ("skills" in b && Array.isArray(b.skills)) {
      u.skills = [...new Set(b.skills.filter((s): s is string => typeof s === "string" && SKILLS.includes(s)))].slice(0, 8);
    }

    await u.save();
    return json(serialize(u));
  });

/** Borra la cuenta: primero sale del equipo para no dejar equipos huérfanos. */
export const DELETE = (req: NextRequest) =>
  run(req, true, async () => {
    const u = await requireUser();
    await leaveTeam(u._id);
    await u.deleteOne();
    const res = json({ ok: true });
    (await cookies()).set(SESSION_COOKIE, "", { ...cookieBase, path: "/", maxAge: 0 });
    return res;
  });
