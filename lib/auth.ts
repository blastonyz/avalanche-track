import { cache } from "react";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { AppError } from "./api";
import { connect } from "./db";
import { UserModel } from "./models/User";
import { readSession, SESSION_COOKIE } from "./session";

/** Usuario de la sesión (una consulta por request). null si no hay sesión o algo falla. */
export const getUser = cache(async () => {
  try {
    const id = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
    if (!id || !Types.ObjectId.isValid(id)) return null;
    await connect();
    return await UserModel.findById(id);
  } catch (e) {
    console.error("[auth] getUser:", e);
    return null;
  }
});

export async function requireUser() {
  const u = await getUser();
  if (!u) throw new AppError("no-session", 401);
  return u;
}

/** Rol válido o null: un valor raro puesto a mano en la base no da acceso a nada. */
export const roleOf = (u: { access?: string | null }) =>
  u.access === "admin" ? "admin" : u.access === "user" ? "user" : null;

export async function requireBuilder() {
  const u = await requireUser();
  if (roleOf(u) !== "user") throw new AppError("solo-builders", 403);
  return u;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (roleOf(u) !== "admin") throw new AppError("solo-admin", 403);
  return u;
}
