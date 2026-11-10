import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authSecret } from "./env";
import { connect } from "./db";
import { TeamModel } from "./models/Team";
import { UserModel } from "./models/User";

type GoogleProfile = { sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string };

/**
 * Google ya tiene registrado CALLBACK_URL (…/callback). next-auth usa por defecto /api/auth/callback/google,
 * así que mandamos nuestro redirect_uri en los dos pasos (autorizar y canjear el código) y
 * app/callback/route.ts reenvía la vuelta de Google al handler de next-auth.
 */
const REDIRECT_URI =
  process.env.CALLBACK_URL ?? `${(process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "")}/callback`;

/**
 * Sesión JWT (cookie httpOnly cifrada por next-auth), sin adapter: el usuario vive en nuestro modelo de Mongoose.
 * El rol NO va en el token: se lee de Mongo en cada request (ver lib/auth.ts), así cambiarlo en Atlas surte efecto al instante.
 */
export const authOptions: NextAuthOptions = {
  secret: authSecret(),
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: { params: { prompt: "select_account", redirect_uri: REDIRECT_URI } },
      token: {
        async request({ client, params, checks }) {
          const tokens = await client.callback(REDIRECT_URI, params, checks);
          return { tokens };
        },
      },
    }),
  ],
  pages: { signIn: "/", error: "/" }, // los errores vuelven al inicio con ?error=…
  callbacks: {
    async signIn({ account, profile }) {
      const p = profile as GoogleProfile | undefined;
      return account?.provider === "google" && !!p?.email && p.email_verified === true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Primer paso tras Google: crear/actualizar el usuario y guardar su _id en el token.
        const p = profile as GoogleProfile;
        const email = String(p.email).toLowerCase();
        await connect();
        const user = await UserModel.findOneAndUpdate(
          { googleId: account.providerAccountId },
          {
            $set: {
              email,
              name: String(p.name ?? email).slice(0, 120),
              picture: String(p.picture ?? ""),
              lastLoginAt: new Date(),
            },
          },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
        );
        await TeamModel.updateOne(
          { "members.user": user._id },
          { $set: { "members.$.name": user.name, "members.$.email": user.email } },
        );
        token.uid = String(user._id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) session.user.id = token.uid;
      return session;
    },
  },
};
