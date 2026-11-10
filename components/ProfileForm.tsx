"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ROLES, SKILLS } from "@/lib/guide";
import { getEth } from "@/lib/wallet";
import {
  deleteAccount,
  EMPTY_PROFILE,
  logout,
  OPEN_AUTH_EVT,
  saveProfile,
  useUser,
} from "@/lib/user";
import type { Profile, RoleId } from "@/lib/types";

export default function ProfileForm() {
  const user = useUser();
  const [p, setP] = useState<Profile>(EMPTY_PROFILE);
  const [saved, setSaved] = useState<"" | "ok" | "error">("");
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
    setSaved("");
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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved((await saveProfile(p)) ? "ok" : "error");
  }

  async function remove() {
    if (window.confirm("¿Borrar tu cuenta y tus datos? No se puede deshacer.")) {
      await deleteAccount();
    }
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
        <span className="chip">Google</span>
        <small>Miembro desde {new Date(user.createdAt).toLocaleDateString("es-AR")}</small>
        <button type="button" className="btn btn--ghost btn--small" onClick={logout}>
          Cerrar sesión
        </button>
        <Link href="/panel" className="btn btn--small">
          {user.access === "admin" ? "Panel admin" : "Mi equipo y entrega"}
        </Link>
        <button type="button" className="link-danger" onClick={remove}>
          Borrar mi cuenta
        </button>
      </aside>

      <div className="profile-fields">
        <div>
          <label>
            Tu rol
            <select value={p.role} onChange={(e) => set("role", e.target.value as RoleId | "")}>
              <option value="">Sin definir</option>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
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
            GitHub *
            <input
              value={p.github}
              onChange={(e) => set("github", e.target.value)}
              placeholder="usuario"
              required
              maxLength={39}
              pattern="[A-Za-z0-9][A-Za-z0-9\-]*"
              title="Solo letras, números y guiones"
            />
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
          <span role="status" className="saved">
            {saved === "ok" ? "Guardado" : saved === "error" ? "No se pudo guardar. Revisá GitHub (obligatorio) y wallet; si sigue, volvé a iniciar sesión." : ""}
          </span>
        </div>

      </div>
    </form>
  );
}
