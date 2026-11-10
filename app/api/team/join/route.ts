import { NextRequest } from "next/server";
import { json, run } from "@/lib/api";
import { requireBuilder } from "@/lib/auth";
import { serializeTeam } from "@/lib/serialize";
import { joinTeam } from "@/lib/team";

export const dynamic = "force-dynamic";

export const POST = (req: NextRequest) =>
  run(req, true, async () => {
    const u = await requireBuilder();
    const b = (await req.json().catch(() => ({}))) as { code?: unknown };
    const team = await joinTeam(u, typeof b.code === "string" ? b.code.slice(0, 20) : "");
    return json(serializeTeam(team, true));
  });
