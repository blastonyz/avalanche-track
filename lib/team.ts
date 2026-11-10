import { randomBytes } from "node:crypto";
import { Types } from "mongoose";
import { AppError } from "./api";
import { MAX_TEAM } from "./rules";
import { ProjectModel } from "./models/Project";
import { TeamModel } from "./models/Team";
import { UserModel } from "./models/User";

type U = { _id: unknown; email: string; name?: string | null };
const oid = (v: unknown) => new Types.ObjectId(String(v));

/**
 * Candado "un builder, un equipo": solo pasa si es builder y haveTeam sigue en false.
 * Es una sola operación atómica, así dos pedidos simultáneos no pueden meterlo en dos equipos.
 */
async function claim(userId: unknown, teamId: Types.ObjectId) {
  const r = await UserModel.updateOne(
    { _id: oid(userId), access: "user", haveTeam: false },
    { $set: { haveTeam: true, team: teamId } },
  );
  if (!r.modifiedCount) throw new AppError("ya-tenes-equipo", 409);
}

const release = (userId: unknown) =>
  UserModel.updateOne({ _id: oid(userId) }, { $set: { haveTeam: false, team: null } });

const newCode = () => randomBytes(5).toString("base64url").toUpperCase().replace(/[-_]/g, "X");

export async function createTeam(user: U, name: string) {
  const teamId = new Types.ObjectId();
  await claim(user._id, teamId);
  try {
    return await TeamModel.create({
      _id: teamId,
      name,
      code: newCode(),
      owner: oid(user._id),
      members: [{ user: oid(user._id), email: user.email, name: user.name ?? "" }],
    });
  } catch (e) {
    await release(user._id);
    throw e;
  }
}

/** Unirse cierra el flujo: haveTeam pasa a true y ya no puede crear ni unirse a otro. */
export async function joinTeam(user: U, rawCode: string) {
  const code = rawCode.trim().toUpperCase();
  const team = code ? await TeamModel.findOne({ code }).select("_id") : null;
  if (!team) throw new AppError("codigo-invalido", 404);

  await claim(user._id, team._id);
  const added = await TeamModel.findOneAndUpdate(
    {
      _id: team._id,
      "members.user": { $ne: oid(user._id) },
      [`members.${MAX_TEAM - 1}`]: { $exists: false }, // todavía hay lugar
    },
    { $push: { members: { user: oid(user._id), email: user.email, name: user.name ?? "" } } },
    { returnDocument: "after" },
  );
  if (!added) {
    await release(user._id);
    throw new AppError("equipo-lleno", 409);
  }
  return added;
}

/** Salir reabre los flujos. Si queda vacío se borra el equipo y su entrega; si se va el dueño, pasa al siguiente. */
export async function leaveTeam(userId: unknown) {
  const left = await TeamModel.findOneAndUpdate(
    { "members.user": oid(userId) },
    { $pull: { members: { user: oid(userId) } } },
    { returnDocument: "after" },
  );
  await release(userId);
  if (!left) return;
  if (left.members.length === 0) {
    await ProjectModel.deleteOne({ team: left._id });
    await TeamModel.deleteOne({ _id: left._id });
  } else if (String(left.owner) === String(userId)) {
    await TeamModel.updateOne({ _id: left._id }, { $set: { owner: left.members[0].user } });
  }
}

/** Equipo del usuario, validado contra haveTeam (nunca confiar solo en uno de los dos). */
export async function myTeam(user: { _id: unknown; haveTeam?: boolean | null }) {
  if (!user.haveTeam) return null;
  const team = await TeamModel.findOne({ "members.user": oid(user._id) });
  if (!team) await release(user._id); // estado inconsistente: lo reparamos
  return team;
}

export async function requireTeam(user: { _id: unknown; haveTeam?: boolean | null }) {
  const t = await myTeam(user);
  if (!t) throw new AppError("sin-equipo", 409);
  return t;
}
