"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { refreshUser } from "@/lib/user";
import { MAX_TEAM } from "@/lib/rules";
import type { Project, Team } from "@/lib/types";
import { EMPTY_PROJECT } from "@/lib/types";

const ERR: Record<string, string> = {
  "ya-tenes-equipo": "Ya estás en un equipo. Salí primero para cambiar.",
  "codigo-invalido": "Ese código no existe.",
  "equipo-lleno": `El equipo ya tiene ${MAX_TEAM} integrantes.`,
  "faltan-links": "Para marcarlo completo hacen falta los 4 links.",
  "sin-equipo": "Primero armá o unite a un equipo.",
  "solo-builders": "Esta sección es para builders.",
  "no-session": "Tu sesión venció. Volvé a entrar.",
};
const msg = (code?: string) =>
  code?.startsWith("url-invalida") ? "Los links tienen que ser https:// válidos." : (code && ERR[code]) || "No se pudo. Probá de nuevo.";

async function call(url: string, method: string, body?: unknown) {
  const r = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, data: data as { error?: string } };
}

function NoTeam({ done }: { done: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  async function go(url: string, body: unknown) {
    setErr("");
    const r = await call(url, "POST", body);
    if (r.ok) done();
    else setErr(msg(r.data.error));
  }

  return (
    <div className="panel-grid">
      <form className="panel-box" onSubmit={(e) => { e.preventDefault(); void go("/api/team", { name }); }}>
        <h2>Crear equipo</h2>
        <label>
          Nombre (opcional)
          <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Ej: Orbital Salta" />
        </label>
        <button className="btn" type="submit">Crear</button>
      </form>
      <form className="panel-box" onSubmit={(e) => { e.preventDefault(); void go("/api/team/join", { code }); }}>
        <h2>Unirme con código</h2>
        <label>
          Código de invitación
          <input value={code} maxLength={20} onChange={(e) => setCode(e.target.value)} placeholder="ABC123XYZ" autoCapitalize="characters" />
        </label>
        <button className="btn" type="submit" disabled={!code.trim()}>Unirme</button>
      </form>
      {err && <p className="modal-err" role="alert">{err}</p>}
    </div>
  );
}

function TeamBox({ team, meId, done }: { team: Team; meId: string; done: () => void }) {
  const [name, setName] = useState(team.name);
  const [state, setState] = useState("");
  const [copied, setCopied] = useState(false);

  async function rename(e: React.FormEvent) {
    e.preventDefault();
    const r = await call("/api/team", "PATCH", { name });
    setState(r.ok ? "Guardado" : msg(r.data.error));
    if (r.ok) done();
  }
  async function leave() {
    const extra = team.members.length === 1 ? " Sos el último: se borra el equipo y su entrega." : "";
    if (!window.confirm(`¿Salir del equipo?${extra}`)) return;
    const r = await call("/api/team/leave", "POST");
    if (r.ok) done();
    else setState(msg(r.data.error));
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(team.code ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* sin permiso de portapapeles */
    }
  }

  return (
    <section className="panel-box">
      <h2>Equipo</h2>
      <form onSubmit={rename} className="inline">
        <label>
          Nombre
          <input value={name} maxLength={60} onChange={(e) => { setName(e.target.value); setState(""); }} placeholder="Sin nombre" />
        </label>
        <button className="btn btn--small" type="submit">Guardar</button>
        <span role="status" className="saved">{state}</span>
      </form>

      <p className="muted">Código para invitar ({team.members.length}/{MAX_TEAM})</p>
      <p>
        <code className="code">{team.code}</code>{" "}
        <button type="button" className="btn btn--ghost btn--small" onClick={copy}>{copied ? "Copiado" : "Copiar"}</button>
      </p>

      <ul className="members">
        {team.members.map((m) => (
          <li key={m.id}>
            <b>{m.name || "—"}</b> <span>{m.email}</span> {m.id === meId && <em>(vos)</em>}
          </li>
        ))}
      </ul>
      <button type="button" className="link-danger" onClick={leave}>Salir del equipo</button>
    </section>
  );
}

const LINKS: [keyof Project, string, string][] = [
  ["pitchUrl", "Pitch", "Deck o PDF"],
  ["videoUrl", "Video", "YouTube, Loom, Drive…"],
  ["demoUrl", "Demo", "App desplegada"],
  ["codeUrl", "Código", "Repo o carpeta de Drive con el zip"],
];

function ProjectBox({ initial }: { initial: Project | null }) {
  const [p, setP] = useState<Project>(initial ?? EMPTY_PROJECT);
  const [state, setState] = useState("");
  const missing = LINKS.filter(([k]) => !p[k]).length;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const r = await call("/api/project", "PUT", p);
    setState(r.ok ? "Guardado" : msg(r.data.error));
  }

  return (
    <form className="panel-box" onSubmit={save}>
      <h2>Entrega</h2>
      {LINKS.map(([k, label, hint]) => (
        <label key={k}>
          {label}
          <input
            type="url"
            inputMode="url"
            value={p[k] as string}
            placeholder={`https://… (${hint})`}
            maxLength={500}
            onChange={(e) => { setP({ ...p, [k]: e.target.value }); setState(""); }}
          />
        </label>
      ))}
      <label className="check">
        <input
          type="checkbox"
          checked={p.completed}
          disabled={missing > 0}
          onChange={(e) => { setP({ ...p, completed: e.target.checked }); setState(""); }}
        />
        Entrega completa {missing > 0 && <span className="muted">(faltan {missing} links)</span>}
      </label>
      <button className="btn" type="submit">Guardar entrega</button>
      <span role="status" className="saved">{state}</span>
    </form>
  );
}

export default function BuilderPanel({ team, project, meId }: { team: Team | null; project: Project | null; meId: string }) {
  const router = useRouter();
  const done = () => {
    void refreshUser(); // actualiza haveTeam en la barra
    router.refresh();
  };

  if (!team) return <NoTeam done={done} />;
  return (
    <div className="panel-grid">
      <TeamBox key={team.id + team.name} team={team} meId={meId} done={done} />
      <ProjectBox key={team.id} initial={project} />
    </div>
  );
}
