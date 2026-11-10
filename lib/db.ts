import mongoose from "mongoose";
import { env } from "./env";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = (g._mongoose ??= { conn: null, promise: null });

/** Conexión reutilizada entre invocaciones (importante en Vercel/serverless). */
export async function connect() {
  if (cache.conn) return cache.conn;
  const { mongoUri, mongoDb } = env();
  cache.promise ??= mongoose.connect(mongoUri, {
    dbName: mongoDb,
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
  });
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
