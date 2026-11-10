import { Schema, model, models, type InferSchemaType, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { isHttps } from "../validate";

const url = {
  type: String,
  default: "",
  maxlength: 500,
  validate: { validator: (v: string) => !v || isHttps(v), message: "url-https" },
};

/** Una entrega por equipo. */
const schema = new Schema(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true, unique: true },
    pitchUrl: url, // deck / pitch
    videoUrl: url, // video
    demoUrl: url, // demo
    codeUrl: url, // repo o carpeta de Drive con el zip
    completed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

// "Completa" solo si están las cuatro entregas.
schema.pre("validate", function () {
  if (this.completed && !(this.pitchUrl && this.videoUrl && this.demoUrl && this.codeUrl)) {
    this.invalidate("completed", "faltan-links");
  }
});
schema.plugin(paginate);

export type ProjectDoc = InferSchemaType<typeof schema>;
export const ProjectModel: PaginateModel<ProjectDoc> =
  (models.Project as PaginateModel<ProjectDoc> | undefined) ??
  (model<ProjectDoc>("Project", schema) as unknown as PaginateModel<ProjectDoc>);
