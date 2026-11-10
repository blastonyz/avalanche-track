import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { connect } from "@/lib/db";
import { streamItems } from "@/lib/export";
import { ProjectModel } from "@/lib/models/Project";
import { TeamModel } from "@/lib/models/Team";
import { UserModel } from "@/lib/models/User";

export const dynamic = "force-dynamic";

type Row = {
  _id: unknown;
  pitchUrl?: string;
  videoUrl?: string;
  demoUrl?: string;
  codeUrl?: string;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  team?: { _id: unknown; name?: string; members?: { user: unknown }[] } | null;
  users?: { _id: unknown; name?: string; email?: string; github?: string; wallet?: string; role?: string; skills?: string[] }[];
};

/**
 * Solo admin. Exporta TODOS los proyectos (no pagina) leyendo con un cursor y enviando en streaming.
 *   ?format=json (default) | ndjson     ?f=completos | incompletos
 * No incluye el código de invitación de los equipos.
 */
export const GET = (req: NextRequest) =>
  run(req, false, async () => {
    await requireAdmin();
    await connect();

    const q = req.nextUrl.searchParams;
    const format = q.get("format") === "ndjson" ? "ndjson" : "json";
    const f = q.get("f");
    const match = f === "completos" ? { completed: true } : f === "incompletos" ? { completed: false } : {};

    const cursor = ProjectModel.aggregate<Row>([
      { $match: match },
      { $sort: { updatedAt: -1 } },
      { $lookup: { from: TeamModel.collection.name, localField: "team", foreignField: "_id", as: "team" } },
      { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "team.members.user",
          foreignField: "_id",
          as: "users",
          pipeline: [{ $project: { name: 1, email: 1, github: 1, wallet: 1, role: 1, skills: 1 } }],
        },
      },
    ]).cursor();

    async function* rows() {
      for await (const p of cursor as AsyncIterable<Row>) {
        yield {
          id: String(p._id),
          team: { id: p.team ? String(p.team._id) : null, name: p.team?.name ?? "" },
          members: (p.users ?? []).map((u) => ({
            name: u.name ?? "",
            email: u.email ?? "",
            github: u.github ?? "",
            wallet: u.wallet ?? "",
            role: u.role ?? "",
            skills: u.skills ?? [],
          })),
          pitchUrl: p.pitchUrl ?? "",
          videoUrl: p.videoUrl ?? "",
          demoUrl: p.demoUrl ?? "",
          codeUrl: p.codeUrl ?? "",
          completed: !!p.completed,
          createdAt: p.createdAt?.toISOString() ?? null,
          updatedAt: p.updatedAt?.toISOString() ?? null,
        };
      }
    }

    const day = new Date().toISOString().slice(0, 10);
    const ext = format === "ndjson" ? "ndjson" : "json";
    return new NextResponse(streamItems(rows(), format), {
      headers: {
        "content-type": format === "ndjson" ? "application/x-ndjson; charset=utf-8" : "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="proyectos-${f ?? "todos"}-${day}.${ext}"`,
        "cache-control": "no-store",
      },
    });
  });
