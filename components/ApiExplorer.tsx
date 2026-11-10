"use client";

import { useMemo, useState } from "react";
import { ACCESS_LABEL, APIS, type Access, type Api } from "@/lib/data";
import CopyButton from "./CopyButton";

type Result =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ok"; text: string; ms: number }
  | { state: "err"; msg: string };

const ACCESS_CHIP: Record<Access, string> = {
  "sin-registro": "chip--gray",
  "key-gratis": "chip--orange",
  avanzado: "chip--blue",
  argentina: "chip--red",
};

function ApiCard({ api }: { api: Api }) {
  const [res, setRes] = useState<Result>({ state: "idle" });

  async function probe() {
    setRes({ state: "loading" });
    const t0 = performance.now();
    try {
      const r = await fetch(api.url);
      if (!r.ok) {
        setRes({
          state: "err",
          msg:
            r.status === 429
              ? "Límite de pedidos alcanzado (429). Esperá un rato o usá la respuesta guardada en sample-data/."
              : `La API respondió con error ${r.status}.`,
        });
        return;
      }
      const raw = await r.text();
      let pretty = raw;
      try {
        pretty = JSON.stringify(JSON.parse(raw), null, 2);
      } catch {
        /* no era JSON: se muestra tal cual */
      }
      const clipped =
        pretty.length > 2500
          ? pretty.slice(0, 2500) + "\n… (recortado; guardá la respuesta completa en sample-data/)"
          : pretty;
      setRes({ state: "ok", text: clipped, ms: Math.round(performance.now() - t0) });
    } catch {
      setRes({
        state: "err",
        msg: "No se pudo traer el dato desde el navegador (red caída o la API no permite pedidos desde una web). Abrila en otra pestaña o probala desde un script.",
      });
    }
  }

  return (
    <article className="api">
      <header>
        <div>
          <h3>{api.name}</h3>
          <div className="prov">{api.provider}</div>
        </div>
        <span className={`chip ${ACCESS_CHIP[api.access]}`}>{ACCESS_LABEL[api.access]}</span>
      </header>

      <p>{api.gives}</p>

      <div className="tags">
        {api.topics.map((t) => (
          <span className="chip" key={t}>
            {t}
          </span>
        ))}
      </div>

      <code>{api.url}</code>

      {(api.limit || api.note) && (
        <p className="meta">
          {api.limit && (
            <>
              <b>Límite:</b> {api.limit}.{" "}
            </>
          )}
          {api.note}
        </p>
      )}

      <div className="actions">
        {api.live && (
          <button
            type="button"
            className="btn btn--small"
            onClick={probe}
            disabled={res.state === "loading"}
          >
            {res.state === "loading" ? "Consultando…" : "Probar ahora"}
          </button>
        )}
        <CopyButton text={api.url} label="Copiar URL" />
        <a className="btn btn--ghost btn--small" href={api.url} target="_blank" rel="noopener noreferrer">
          Abrir
        </a>
      </div>

      {res.state === "err" && <p className="status err">{res.msg}</p>}
      {res.state === "ok" && (
        <>
          <p className="status ok">Respondió en {res.ms} ms. Datos reales, sin guardar.</p>
          <pre>{res.text}</pre>
          <div className="actions">
            <CopyButton text={res.text} label="Copiar respuesta" />
          </div>
        </>
      )}
    </article>
  );
}

const ACCESS_ORDER: Access[] = ["sin-registro", "key-gratis", "avanzado", "argentina"];

export default function ApiExplorer() {
  const [access, setAccess] = useState<Access | "all">("all");
  const [topic, setTopic] = useState<string | "all">("all");
  const [q, setQ] = useState("");

  const topics = useMemo(() => {
    const s = new Set<string>();
    APIS.forEach((a) => a.topics.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b, "es"));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return APIS.filter((a) => {
      if (access !== "all" && a.access !== access) return false;
      if (topic !== "all" && !a.topics.includes(topic)) return false;
      if (!needle) return true;
      return (
        a.name.toLowerCase().includes(needle) ||
        a.provider.toLowerCase().includes(needle) ||
        a.gives.toLowerCase().includes(needle) ||
        a.topics.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [access, topic, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: APIS.length };
    ACCESS_ORDER.forEach((k) => (c[k] = APIS.filter((a) => a.access === k).length));
    return c;
  }, []);

  return (
    <div>
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Buscar: incendios, sismos, clima, Sentinel…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar API"
        />
        <div className="filters" role="group" aria-label="Filtrar por acceso">
          <span className="label">Acceso</span>
          <button className="chip" aria-pressed={access === "all"} onClick={() => setAccess("all")}>
            Todas ({counts.all})
          </button>
          {ACCESS_ORDER.map((k) => (
            <button
              key={k}
              className="chip"
              aria-pressed={access === k}
              onClick={() => setAccess(k)}
            >
              {ACCESS_LABEL[k]} ({counts[k]})
            </button>
          ))}
        </div>
        <div className="filters" role="group" aria-label="Filtrar por tema">
          <span className="label">Tema</span>
          <button className="chip" aria-pressed={topic === "all"} onClick={() => setTopic("all")}>
            Todos
          </button>
          {topics.map((t) => (
            <button key={t} className="chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          No hay APIs con ese filtro.{" "}
          <button
            className="chip"
            onClick={() => {
              setAccess("all");
              setTopic("all");
              setQ("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="api-list">
          {filtered.map((a) => (
            <ApiCard key={a.id} api={a} />
          ))}
        </div>
      )}
    </div>
  );
}
