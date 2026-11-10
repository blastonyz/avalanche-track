import type { Project, Team } from "./types";
import type { ProjectDoc } from "./models/Project";
import type { TeamDoc } from "./models/Team";

type WithMeta = { createdAt?: Date; updatedAt?: Date };

export function serializeTeam(t: TeamDoc & { _id: unknown } & WithMeta, withCode: boolean): Team {
  return {
    id: String(t._id),
    name: t.name ?? "",
    ...(withCode ? { code: t.code } : {}),
    ownerId: String(t.owner),
    members: t.members.map((m) => ({ id: String(m.user), email: m.email, name: m.name ?? "" })),
    createdAt: (t.createdAt ?? new Date()).toISOString(),
  };
}

export function serializeProject(p: (ProjectDoc & WithMeta) | null): Project | null {
  if (!p) return null;
  return {
    pitchUrl: p.pitchUrl ?? "",
    videoUrl: p.videoUrl ?? "",
    demoUrl: p.demoUrl ?? "",
    codeUrl: p.codeUrl ?? "",
    completed: !!p.completed,
    updatedAt: (p.updatedAt ?? new Date()).toISOString(),
  };
}
