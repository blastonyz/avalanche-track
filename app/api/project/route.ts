import { NextRequest } from "next/server";
import { AppError, json, run } from "@/lib/api";
import { requireBuilder } from "@/lib/auth";
import { ProjectModel } from "@/lib/models/Project";
import { serializeProject } from "@/lib/serialize";
import { requireTeam } from "@/lib/team";
import { cleanUrl } from "@/lib/validate";

export const dynamic = "force-dynamic";

const FIELDS = ["pitchUrl", "videoUrl", "demoUrl", "codeUrl"] as const;

export const GET = (req: NextRequest) =>
  run(req, false, async () => {
    const t = await requireTeam(await requireBuilder());
    return json(serializeProject(await ProjectModel.findOne({ team: t._id })));
  });

/** Guarda la entrega del equipo (la crea la primera vez). `completed` exige los 4 links. */
export const PUT = (req: NextRequest) =>
  run(req, true, async () => {
    const t = await requireTeam(await requireBuilder());
    const b = (await req.json()) as Record<string, unknown>;

    const data: Record<string, string | boolean> = {};
    for (const f of FIELDS) {
      const v = cleanUrl(b[f]);
      if (v === null) throw new AppError(`url-invalida:${f}`);
      data[f] = v;
    }
    data.completed = b.completed === true;
    if (data.completed && FIELDS.some((f) => !data[f])) throw new AppError("faltan-links");

    const p = await ProjectModel.findOneAndUpdate(
      { team: t._id },
      { $set: data, $setOnInsert: { team: t._id } },
      { upsert: true, returnDocument: "after", runValidators: true },
    );
    return json(serializeProject(p));
  });
