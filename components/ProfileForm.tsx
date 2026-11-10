"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/data";
import { ROLES } from "@/lib/guide";
import { getEth } from "@/lib/wallet";
import {
  clearUser,
  EMPTY_PROFILE,
  OPEN_AUTH_EVT,
  saveUser,
  useUser,
  type CategoryId,
  type Profile,
  type RoleId,
} from "@/lib/user";

const SKILLS = ["Solidity", "Frontend", "UI y diseño", "Datos y APIs", "Pitch", "Investigación", "DevOps", "IA"];

export default function ProfileForm() {
  const user = useUser();
  const [p, setP] = useState<Profile>(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    if (user && loaded !== user.id) {
      setP(user.profile);
      setLoaded(user.id);
    }
  }, [user, loaded]);

  if (user === undefined) return <p className="lead">Cargando…</p>;

  if (!user) {
    return (
      <div className="empty-box">
        <h2>Todavía no tenés perfil</h2>
        <p>Registrate para guardar tu equipo, rol y categoría.</p>
        <button className="btn" onClick={() => window.dispatchEvent(new Event(OPEN_AUTH_EVT))}>
          Registrarse
        </button>
      </div>
    );
  }

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => {
    setP((x) => ({ ...x, [k]: v }));
    setSaved(false);
  };
  const toggle = (s: string) =>
    set("skills", p.skills.includes(s) ? p.skills.filter((x) => x !== s) : [...p.skills, s]);

  async function useWallet() {
    const eth = getEth();
    if (!eth) return;
    try {
      const a = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      if (a[0]) set("wallet", a[0]);
    } catch {
      /* rechazado */
    }
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    saveUser({ ...user, profile: p });
    setSaved(true);
  }

  function exportJson() {
    if (!user) return;
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "perfil-avax-track.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <form className="profile" onSubmit={save}>
      <aside className="profile-card">
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.picture} alt="" width={84} height={84} referrerPolicy="no-referrer" />
        ) : (
          <span className="avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
        )}
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <span className="chip">{user.provider === "google" ? "Google" : "Modo demo"}</span>
        <small>Miembro desde {new Date(user.createdAt).toLocaleDateString("es-AR")}</small>
        <button type="button" className="btn btn--ghost btn--small" onClick={clearUser}>
          Cerrar sesión
        </button>
      </aside>

      <div className="profile-fields">
        <label>
          Nombre del equipo
          <input value={p.team} onChange={(e) => set("team", e.target.value)} placeholder="Ej: Orbital Salta" />
        </label>

        <div className="two">
          <label>
            Tu rol
            <select value={p.role} onChange={(e) => set("role", e.target.value as RoleId | "")}>
              <option value="">Sin definir</option>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </label>
          <label>
            Categoría
            <select value={p.category} onChange={(e) => set("category", e.target.value as CategoryId | "")}>
              <option value="">Sin definir</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        <fieldset>
          <legend>Habilidades</legend>
          <div className="chips-row">
            {SKILLS.map((s) => (
              <button
                type="button"
                key={s}
                className="chip chip--toggle"
                aria-pressed={p.skills.includes(s)}
                onClick={() => toggle(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="two">
          <label>
            GitHub
            <input value={p.github} onChange={(e) => set("github", e.target.value)} placeholder="usuario" />
          </label>
          <label>
            Wallet (Fuji)
            <span className="with-btn">
              <input value={p.wallet} onChange={(e) => set("wallet", e.target.value)} placeholder="0x…" />
              <button type="button" className="btn btn--ghost btn--small" onClick={useWallet}>
                Usar la mía
              </button>
            </span>
          </label>
        </div>

        <label>
          Sobre vos
          <textarea rows={4} value={p.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Qué sabés hacer y qué querés construir." />
        </label>

        <div className="profile-actions">
          <button className="btn" type="submit">Guardar</button>
          <button type="button" className="btn btn--ghost" onClick={exportJson}>Exportar JSON</button>
          <span role="status" className="saved">{saved ? "Guardado" : ""}</span>
        </div>
        <p className="fineprint">
          Por ahora los datos viven solo en este navegador. Cuando esté la base de datos se van a
          sincronizar con tu cuenta.
        </p>
      </div>
    </form>
  );
}
