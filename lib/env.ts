/** Variables de entorno del servidor. Nada de esto lleva NEXT_PUBLIC_: no debe llegar al navegador. */
export function env() {
  const e = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.CALLBACK_URL,
    mongoUri: process.env.MONGO_URI,
    mongoDb: process.env.MONGO_DB || "builders",
    sessionSecret: process.env.SESSION_SECRET,
  };
  const names: [string, string | undefined][] = [
    ["GOOGLE_CLIENT_ID", e.clientId],
    ["GOOGLE_CLIENT_SECRET", e.clientSecret],
    ["CALLBACK_URL", e.callbackUrl],
    ["MONGO_URI", e.mongoUri],
    ["SESSION_SECRET", e.sessionSecret],
  ];
  const missing = names.filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);
  if ((e.sessionSecret as string).length < 32) {
    throw new Error("SESSION_SECRET tiene que tener al menos 32 caracteres");
  }
  return e as {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    mongoUri: string;
    mongoDb: string;
    sessionSecret: string;
  };
}
