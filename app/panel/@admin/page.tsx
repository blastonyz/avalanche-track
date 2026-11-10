import Link from "next/link";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import { getUser, roleOf } from "@/lib/auth";
import { connect } from "@/lib/db";
import { ProjectModel } from "@/lib/models/Project";
import { TeamModel } from "@/lib/models/Team";
import { UserModel } from "@/lib/models/User";
import { PAGE_SIZE } from "@/lib/rules";
import { isHttps } from "@/lib/validate";

type SP = { tab?: string; page?: string; f?: string };
const TABS = [
  ["builders", "Builders"],
  ["equipos", "Equipos"],
  ["proyectos", "Proyectos"],
] as const;
const FILTERS: Record<string, [string, string][]> = {
  builders: [["", "Todos"], ["sin-equipo", "Sin equipo"], ["con-equipo", "Con equipo"]],
  equipos: [],
  proyectos: [["", "Todos"], ["completos", "Completos"], ["incompletos", "Incompletos"]],
};

const href = (tab: string, page = 1, f = "") =>
  `/panel?tab=${tab}${f ? `&f=${f}` : ""}${page > 1 ? `&page=${page}` : ""}`;

function Link_({ url }: { url: string }) {
  return url && isHttps(url) ? (
    <a href={url} target="_blank" rel="noopener noreferrer">ver</a>
  ) : (
    <span className="muted">—</span>
  );
}

function Pager({ tab, f, page, pages }: { tab: string; f: string; page: number; pages: number }) {
  if (pages <= 1) return null; // paginación condicional: solo si hace falta
  return (
    <nav className="pager" aria-label="Paginación">
      {page > 1 ? <Link href={href(tab, page - 1, f)}>← Anterior</Link> : <span />}
      <span>
        {page} / {pages}
      </span>
      {page < pages ? <Link href={href(tab, page + 1, f)}>Siguiente →</Link> : <span />}
    </nav>
  );
}

export default async function AdminSlot({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await getUser();
  if (!user || roleOf(user) !== "admin") notFound();
  await connect();

  const sp = await searchParams;
  const tab = TABS.some(([t]) => t === sp.tab) ? (sp.tab as string) : "builders";
  const f = FILTERS[tab].some(([k]) => k === sp.f) ? (sp.f as string) : "";
  const page = Math.max(1, Math.min(10000, parseInt(sp.page ?? "1", 10) || 1));
  const opts = { page, limit: PAGE_SIZE, lean: true };

  const [nBuilders, nWithTeam, nTeams, nDone] = await Promise.all([
    UserModel.countDocuments({ access: "user" }),
    UserModel.countDocuments({ access: "user", haveTeam: true }),
    TeamModel.countDocuments(),
    ProjectModel.countDocuments({ completed: true }),
  ]);

  let body: React.ReactNode;
  let meta: { page?: number; totalPages?: number; totalDocs: number } = { totalDocs: 0 };

  if (tab === "builders") {
    const q = { access: "user", ...(f === "sin-equipo" ? { haveTeam: false } : f === "con-equipo" ? { haveTeam: true } : {}) };
    const r = await UserModel.paginate(q, { ...opts, sort: { createdAt: -1 }, populate: { path: "team", select: "name" } });
    meta = r;
    body = (
      <table>
        <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Categoría</th><th>Equipo</th></tr></thead>
        <tbody>
          {r.docs.map((u) => (
            <tr key={String(u._id)}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role || "—"}</td>
              <td>{u.category || "—"}</td>
              <td>{u.haveTeam ? ((u.team as unknown as { name?: string } | null)?.name || "(sin nombre)") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (tab === "equipos") {
    const r = await TeamModel.paginate({}, { ...opts, sort: { createdAt: -1 } });
    meta = r;
    const done = new Set((await ProjectModel.find({ team: { $in: r.docs.map((t) => t._id) }, completed: true }).select("team").lean()).map((p) => String(p.team)));
    body = (
      <table>
        <thead><tr><th>Equipo</th><th>Integrantes</th><th>Entrega</th></tr></thead>
        <tbody>
          {r.docs.map((t) => (
            <tr key={String(t._id)}>
              <td>{t.name || "(sin nombre)"}</td>
              <td>{t.members.map((m) => `${m.name || "—"} <${m.email}>`).join(" · ")}</td>
              <td>{done.has(String(t._id)) ? "Completa" : "Pendiente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    const q = f === "completos" ? { completed: true } : f === "incompletos" ? { completed: false } : {};
    const r = await ProjectModel.paginate(q, { ...opts, sort: { updatedAt: -1 }, populate: { path: "team", select: "name members.email" } });
    meta = r;
    body = (
      <table>
        <thead><tr><th>Equipo</th><th>Pitch</th><th>Video</th><th>Demo</th><th>Código</th><th>Estado</th></tr></thead>
        <tbody>
          {r.docs.map((p) => {
            const t = p.team as unknown as { name?: string } | null;
            return (
              <tr key={String(p._id)}>
                <td>{t?.name || "(sin nombre)"}</td>
                <td><Link_ url={p.pitchUrl} /></td>
                <td><Link_ url={p.videoUrl} /></td>
                <td><Link_ url={p.demoUrl} /></td>
                <td><Link_ url={p.codeUrl} /></td>
                <td>{p.completed ? "Completo" : "Incompleto"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <PageHead eyebrow="Admin" title="Panel de organización" lead="Builders, equipos y entregas." />
      <div className="shell section--tight admin">
        <dl className="stats">
          <div><dt>Builders</dt><dd>{nBuilders}</dd></div>
          <div><dt>Con equipo</dt><dd>{nWithTeam}</dd></div>
          <div><dt>Equipos</dt><dd>{nTeams}</dd></div>
          <div><dt>Entregas completas</dt><dd>{nDone}</dd></div>
        </dl>

        <div className="tabs" role="tablist">
          {TABS.map(([t, label]) => (
            <Link key={t} href={href(t)} role="tab" aria-selected={t === tab}>{label}</Link>
          ))}
        </div>
        {FILTERS[tab].length > 0 && (
          <div className="chips-row">
            {FILTERS[tab].map(([k, label]) => (
              <Link key={k} href={href(tab, 1, k)} className="chip chip--toggle" aria-pressed={k === f}>{label}</Link>
            ))}
          </div>
        )}

        {meta.totalDocs === 0 ? <p className="lead">No hay resultados.</p> : <div className="table-wrap">{body}</div>}
        <Pager tab={tab} f={f} page={meta.page ?? 1} pages={meta.totalPages ?? 1} />
      </div>
    </>
  );
}
