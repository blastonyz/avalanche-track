import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORIES } from "../data";
import { ROLES } from "../guide";

export const ROLE_IDS: string[] = ROLES.map((r) => r.id);
export const CATEGORY_IDS: string[] = CATEGORIES.map((c) => c.id);

/** Modelo mínimo. Base: builders · colección: users. */
const schema = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, default: "", maxlength: 120 },
    picture: { type: String, default: "" },

    team: { type: String, default: "", maxlength: 60 },
    role: { type: String, enum: [...ROLE_IDS, ""], default: "" },
    category: { type: String, enum: [...CATEGORY_IDS, ""], default: "" },
    skills: { type: [String], default: [] },
    github: { type: String, default: "", match: /^[A-Za-z0-9-]{0,39}$/ },
    wallet: { type: String, default: "", match: /^(0x[a-fA-F0-9]{40})?$/ },
    bio: { type: String, default: "", maxlength: 500 },

    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof schema>;
export const UserModel: Model<UserDoc> =
  (models.User as Model<UserDoc> | undefined) ?? model<UserDoc>("User", schema);
