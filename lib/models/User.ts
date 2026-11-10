import { Schema, model, models, type InferSchemaType, type Model, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { ROLES } from "../guide";

export const ROLE_IDS: string[] = ROLES.map((r) => r.id);
export const ACCESS = ["user", "admin"] as const;

/** Base: builders · colección: users. */
const schema = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, default: "", maxlength: 120 },
    picture: { type: String, default: "" },

    // Rol: "user" por defecto. Se cambia a "admin" a mano desde la base; ninguna ruta lo modifica.
    access: { type: String, enum: ACCESS, default: "user", index: true },

    // Un builder, un solo equipo. haveTeam se mueve siempre junto con `team` (ver lib/team.ts).
    haveTeam: { type: Boolean, default: false, index: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", default: null },

    role: { type: String, enum: [...ROLE_IDS, ""], default: "" },
    skills: { type: [String], default: [] },
    github: { type: String, default: "", match: /^[A-Za-z0-9-]{0,39}$/ },
    wallet: { type: String, default: "", match: /^(0x[a-fA-F0-9]{40})?$/ },
    bio: { type: String, default: "", maxlength: 500 },

    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);
schema.plugin(paginate);

export type UserDoc = InferSchemaType<typeof schema>;
export const UserModel: PaginateModel<UserDoc> =
  (models.User as PaginateModel<UserDoc> | undefined) ??
  (model<UserDoc>("User", schema) as unknown as PaginateModel<UserDoc>);
export type UserModelT = Model<UserDoc>;
