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

/** Lo que devuelve /api/me (nunca incluye googleId ni datos internos). */
export type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  createdAt: string;
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
