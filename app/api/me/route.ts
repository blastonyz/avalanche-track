import { NextRequest } from "next/server";
import { AppError, json, run } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { SKILLS } from "@/lib/guide";
import { ROLE_IDS, UserModel } from "@/lib/models/User";
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

    const set: Record<string, unknown> = {};
    if ("bio" in b) set.bio = str(b.bio, 500);
    if ("github" in b) {
      const v = str(b.github, 39);
      if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*)$/.test(v)) throw new AppError("github"); // obligatorio
      set.github = v;
    }
    if ("wallet" in b) {
      const v = str(b.wallet, 42);
      if (!/^(0x[a-fA-F0-9]{40})?$/.test(v)) throw new AppError("wallet");
      set.wallet = v;
    }
    if ("role" in b) {
      const v = str(b.role, 20);
      if (v && !ROLE_IDS.includes(v)) throw new AppError("role");
      set.role = v;
    }
    if ("skills" in b && Array.isArray(b.skills)) {
      set.skills = [...new Set(b.skills.filter((s): s is string => typeof s === "string" && SKILLS.includes(s)))].slice(0, 8);
    }

    // $set puntual: no revalida el documento entero, así un campo viejo no bloquea el guardado.
    const updated = await UserModel.findByIdAndUpdate(u._id, { $set: set }, { returnDocument: "after", runValidators: true });
    return json(serialize(updated ?? u));
  });

/** Borra la cuenta: primero sale del equipo para no dejar equipos huérfanos. */
export const DELETE = (req: NextRequest) =>
  run(req, true, async () => {
    const u = await requireUser();
    await leaveTeam(u._id);
    await u.deleteOne();
    return json({ ok: true }); // el cliente cierra la sesión de next-auth después
  });
