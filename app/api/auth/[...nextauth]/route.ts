import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const handler = NextAuth(authOptions);

type Ctx = { params: Promise<{ nextauth: string[] }> };

// Next 15/16: params es una promesa; next-auth v4 espera el objeto resuelto.
const noStore = (res: Response) => {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
};

export async function GET(req: Request, ctx: Ctx) {
  return noStore(await handler(req, { params: await ctx.params }));
}
export async function POST(req: Request, ctx: Ctx) {
  return noStore(await handler(req, { params: await ctx.params }));
}
