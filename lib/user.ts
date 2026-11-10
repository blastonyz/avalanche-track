"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Modelo de usuario simple. Hoy vive en localStorage del navegador.
 * Cuando haya DB y API: reemplazar loadRaw/saveUser/clearUser por llamadas al backend
 * y verificar el token de Google en el servidor (acá solo se decodifica, no se verifica).
 */

export type Provider = "google" | "demo";
export type CategoryId = "geoespacial" | "rwa" | "agentes" | "libre";
export type RoleId = "frontend" | "ui" | "contratos" | "pitch" | "mercado";

export type Profile = {
  team: string;
  role: RoleId | "";
  category: CategoryId | "";
  skills: string[];
  github: string;
  wallet: string;
  bio: string;
};

export type User = {
  id: string; // "google:<sub>" o "demo:<uuid>"
  provider: Provider;
  name: string;
  email: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
};

export const EMPTY_PROFILE: Profile = {
  team: "",
  role: "",
  category: "",
  skills: [],
  github: "",
  wallet: "",
  bio: "",
};

const KEY = "avax-track:user";
const EVT = "avax-track:user-changed";
export const OPEN_AUTH_EVT = "avax-track:open-auth";

function loadRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function emit() {
  window.dispatchEvent(new Event(EVT));
}

export function saveUser(u: User) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...u, updatedAt: new Date().toISOString() }));
  } catch {
    /* sin storage: la sesión dura hasta recargar */
  }
  emit();
}

export function clearUser() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nada */
  }
  emit();
}

export function newUser(base: Pick<User, "provider" | "name" | "email" | "picture"> & { sub?: string }): User {
  const now = new Date().toISOString();
  const id =
    base.provider === "google" && base.sub
      ? `google:${base.sub}`
      : `demo:${crypto.randomUUID()}`;
  return {
    id,
    provider: base.provider,
    name: base.name,
    email: base.email,
    picture: base.picture,
    createdAt: now,
    updatedAt: now,
    profile: { ...EMPTY_PROFILE },
  };
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** undefined = todavía no se leyó (SSR); null = sin sesión */
export function useUser(): User | null | undefined {
  const raw = useSyncExternalStore(subscribe, loadRaw, () => undefined);
  return useMemo(() => {
    if (raw === undefined) return undefined;
    if (!raw) return null;
    try {
      const u = JSON.parse(raw) as User;
      return { ...u, profile: { ...EMPTY_PROFILE, ...u.profile } };
    } catch {
      return null;
    }
  }, [raw]);
}

/** Decodifica el payload de un ID token de Google. NO verifica la firma. */
export function decodeJwt(token: string): Record<string, string> | null {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(part)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
