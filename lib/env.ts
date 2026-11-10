/** Variables de servidor. Ninguna lleva NEXT_PUBLIC_: no deben llegar al navegador. */
export function env() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("Falta la variable de entorno MONGO_URI");
  return { mongoUri, mongoDb: process.env.MONGO_DB || "builders" };
}

/** Secreto que firma/cifra la sesión de next-auth. Acepta SESSION_SECRET por compatibilidad. */
export const authSecret = () =>
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? process.env.SESSION_SECRET;
