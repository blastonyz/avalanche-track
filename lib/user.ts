"use client";

import { useSyncExternalStore } from "react";
import type { Profile, User } from "./types";

export type { Profile, User } from "./types";
export { EMPTY_PROFILE } from "./types";
export const OPEN_AUTH_EVT = "avax-track:open-auth";

/** Estado del usuario. undefined = cargando, null = sin sesión. La sesión vive en una cookie httpOnly. */
let state: User | null | undefined = undefined;
let inflight = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export async function refreshUser() {
  try {
    const r = await fetch("/api/me", { cache: "no-store" });
    state = r.ok ? ((await r.json()) as User) : null;
  } catch {
    state = null;
  }
  inflight = false;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (state === undefined && !inflight) {
    inflight = true;
    void refreshUser();
  }
  return () => {
    listeners.delete(cb);
  };
}

export function useUser(): User | null | undefined {
  return useSyncExternalStore(subscribe, () => state, () => undefined);
}

export async function saveProfile(p: Partial<Profile>): Promise<boolean> {
  const r = await fetch("/api/me", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!r.ok) return false;
  state = (await r.json()) as User;
  emit();
  return true;
}

/** Registra la wallet conectada si el perfil la tiene vacía. No pisa una existente. */
export async function registerWallet(address: string) {
  const r = await fetch("/api/me/wallet", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ address }),
  });
  if (!r.ok) return;
  const { wallet, registered } = (await r.json()) as { wallet: string; registered: boolean };
  if (registered && state) {
    state = { ...state, profile: { ...state.profile, wallet } };
    emit();
  }
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  state = null;
  emit();
}

export async function deleteAccount() {
  const r = await fetch("/api/me", { method: "DELETE" });
  if (r.ok) {
    state = null;
    emit();
  }
  return r.ok;
}
