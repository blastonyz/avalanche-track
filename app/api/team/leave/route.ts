import { NextRequest } from "next/server";
import { json, run } from "@/lib/api";
import { requireBuilder } from "@/lib/auth";
import { leaveTeam } from "@/lib/team";

export const dynamic = "force-dynamic";

export const POST = (req: NextRequest) =>
  run(req, true, async () => {
    await leaveTeam((await requireBuilder())._id);
    return json({ ok: true });
  });
