import { NextRequest } from "next/server";
import { json, run } from "@/lib/api";
import { requireBuilder } from "@/lib/auth";
import { TeamModel } from "@/lib/models/Team";
import { serializeTeam } from "@/lib/serialize";
import { createTeam, myTeam, requireTeam } from "@/lib/team";

export const dynamic = "force-dynamic";

const nameOf = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 60) : "");

export const GET = (req: NextRequest) =>
  run(req, false, async () => {
    const t = await myTeam(await requireBuilder());
    return json(t ? serializeTeam(t, true) : null);
  });

/** Crear equipo (el nombre es opcional). Falla con 409 si ya tenés uno. */
export const POST = (req: NextRequest) =>
  run(req, true, async () => {
    const u = await requireBuilder();
    const b = (await req.json().catch(() => ({}))) as { name?: unknown };
    return json(serializeTeam(await createTeam(u, nameOf(b.name)), true), 201);
  });

/** Cualquier integrante puede cambiar el nombre. */
export const PATCH = (req: NextRequest) =>
  run(req, true, async () => {
    const t = await requireTeam(await requireBuilder());
    const b = (await req.json()) as { name?: unknown };
    const updated = await TeamModel.findByIdAndUpdate(t._id, { $set: { name: nameOf(b.name) } }, { returnDocument: "after" });
    return json(serializeTeam(updated!, true));
  });
