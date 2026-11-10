"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OPEN_AUTH_EVT, useUser } from "@/lib/user";

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

const ERRORS: Record<string, string> = {
  error: "No pudimos iniciar sesión. Probá de nuevo.",
  config: "El login todavía no está configurado en el servidor.",
};

function Modal({ onClose, error }: { onClose: () => void; error: string }) {
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

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-t">
        <button className="modal-x" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <span className="eyebrow">Registro</span>
        <h2 id="auth-t">Creá tu perfil</h2>
        <p>Guardá tu equipo, rol y categoría. Gratis, con tu cuenta de Google.</p>
        {/* Navegación completa: el flujo OAuth sale a Google y vuelve a /callback */}
        <a className="g-btn" href="/api/auth/google">
          <GoogleG />
          Continuar con Google
        </a>
        {error && (
          <p className="modal-err" role="alert">
            {error}
          </p>
        )}
        <p className="modal-note">Solo pedimos tu nombre, email y foto.</p>
      </div>
    </div>
  );
}

export default function AuthButton() {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(OPEN_AUTH_EVT, on);
    const q = new URLSearchParams(window.location.search).get("auth");
    if (q && ERRORS[q]) {
      setError(ERRORS[q]);
      setOpen(true);
      history.replaceState(null, "", window.location.pathname);
    }
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
      {open && <Modal error={error} onClose={() => setOpen(false)} />}
    </>
  );
}
