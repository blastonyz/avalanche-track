export type CategoryId = "geoespacial" | "rwa" | "agentes" | "libre";
export type RoleId = "frontend" | "ui" | "contratos" | "pitch" | "mercado";

export type Access = "user" | "admin";

export type Profile = {
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
  access: Access;
  haveTeam: boolean;
  createdAt: string;
  profile: Profile;
};

export const EMPTY_PROFILE: Profile = {
  role: "",
  category: "",
  skills: [],
  github: "",
  wallet: "",
  bio: "",
};

export type TeamMember = { id: string; email: string; name: string };

/** `code` solo se envía a miembros del equipo. */
export type Team = {
  id: string;
  name: string;
  code?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
};

export type Project = {
  pitchUrl: string;
  videoUrl: string;
  demoUrl: string;
  codeUrl: string;
  completed: boolean;
  updatedAt: string;
};

export const EMPTY_PROJECT: Project = {
  pitchUrl: "",
  videoUrl: "",
  demoUrl: "",
  codeUrl: "",
  completed: false,
  updatedAt: "",
};
