import { Schema, model, models, type InferSchemaType, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { MAX_TEAM } from "../rules";

/** Solo guarda quién es (mail y nombre) y cómo se llama el equipo. Nada de esto es obligatorio salvo la referencia. */
const member = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, default: "", maxlength: 120 },
  },
  { _id: false },
);

const schema = new Schema(
  {
    name: { type: String, default: "", trim: true, maxlength: 60 },
    code: { type: String, required: true, unique: true }, // código de invitación
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: {
      type: [member],
      default: [],
      validate: { validator: (v: unknown[]) => v.length <= MAX_TEAM, message: "equipo-lleno" },
    },
  },
  { timestamps: true },
);

// Red de seguridad: un usuario no puede figurar en dos equipos.
schema.index(
  { "members.user": 1 },
  { unique: true, partialFilterExpression: { "members.user": { $exists: true } } },
);
schema.plugin(paginate);

export type TeamDoc = InferSchemaType<typeof schema>;
export const TeamModel: PaginateModel<TeamDoc> =
  (models.Team as PaginateModel<TeamDoc> | undefined) ??
  (model<TeamDoc>("Team", schema) as unknown as PaginateModel<TeamDoc>);
