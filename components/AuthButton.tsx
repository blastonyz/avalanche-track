"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { decodeJwt, newUser, OPEN_AUTH_EVT, saveUser, useUser } from "@/lib/user";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type GoogleId = {
  initialize: (o: { client_id: string; callback: (r: { credential: string }) => void }) => void;
  renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
};

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function Modal({ onClose }: { onClose: () => void }) {
  const gRef = useRef<HTMLDivElement>(null);
  const [demo, setDemo] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Con Client ID configurado se usa el botón oficial de Google Identity Services
  useEffect(() => {
    if (!CLIENT_ID) return;
    const init = () => {
      const g = (window as unknown as { google?: { accounts: { id: GoogleId } } }).google;
      if (!g || !gRef.current) return;
      g.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: ({ credential }) => {
          const p = decodeJwt(credential);
          if (!p?.email) return setErr("Google no devolvió un email válido.");
          saveUser(
            newUser({
              provider: "google",
              sub: p.sub,
              name: p.name ?? p.email,
              email: p.email,
              picture: p.picture,
            }),
          );
          onClose();
        },
      });
      g.accounts.id.renderButton(gRef.current, {
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 320,
      });
    };
    if ((window as unknown as { google?: unknown }).google) return init();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = init;
    s.onerror = () => setErr("No se pudo cargar Google. Revisá tu conexión.");
    document.head.appendChild(s);
  }, [onClose]);

  function submitDemo(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setErr("Poné un nombre y un email válido.");
    saveUser(newUser({ provider: "demo", name: name.trim(), email: email.trim() }));
    onClose();
  }

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-t">
        <button className="modal-x" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <span className="eyebrow">Registro</span>
        <h2 id="auth-t">Creá tu perfil</h2>
        <p>Guardá tu equipo, rol y categoría para armar el track. Es gratis y tarda 10 segundos.</p>

        {CLIENT_ID ? (
          <div ref={gRef} className="g-slot" />
        ) : (
          <button className="g-btn" onClick={() => setDemo(true)}>
            <GoogleG />
            Continuar con Google
          </button>
        )}

        {!CLIENT_ID && (
          <p className="modal-note">
            Google todavía no está configurado (falta <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>).
            Mientras tanto podés entrar en modo demo: los datos se guardan solo en este navegador.
          </p>
        )}

        {!CLIENT_ID && demo && (
          <form className="modal-form" onSubmit={submitDemo}>
            <label>
              Nombre
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoFocus />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <button className="btn" type="submit">
              Entrar en modo demo
            </button>
          </form>
        )}

        {err && <p className="modal-err" role="alert">{err}</p>}
      </div>
    </div>
  );
}

export default function AuthButton() {
  const user = useUser();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(OPEN_AUTH_EVT, on);
    return () => window.removeEventListener(OPEN_AUTH_EVT, on);
  }, []);

  if (user) {
    return (
      <Link href="/perfil" className="user-chip" title="Tu perfil">
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.picture} alt="" width={26} height={26} referrerPolicy="no-referrer" />
        ) : (
          <span aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
        )}
        <b>{user.name.split(" ")[0]}</b>
      </Link>
    );
  }

  return (
    <>
      <button className="reg-btn" onClick={() => setOpen(true)}>
        Registrarse
      </button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </>
  );
}
