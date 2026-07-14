import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { callAppsScript, AppsScriptError } from "@/lib/appsScript";
import type { Usuario } from "@/lib/types";

const REVALIDAR_MS = 45 * 60 * 1000; // 45 minutos: cada cuánto se vuelve a consultar el rol en la hoja Usuarios

async function buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
  try {
    return await callAppsScript<Usuario>("usuarios", "get", { email });
  } catch (err) {
    if (err instanceof AppsScriptError) return null;
    throw err;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const usuario = await buscarUsuarioPorEmail(user.email);
      return Boolean(usuario && usuario.activo);
    },
    async jwt({ token, user }) {
      const esPrimerLogin = Boolean(user);
      const desactualizado =
        !token.rolConsultadoEn || Date.now() - token.rolConsultadoEn > REVALIDAR_MS;

      if (esPrimerLogin || desactualizado) {
        const email = (user?.email ?? token.email) as string | undefined;
        const usuario = email ? await buscarUsuarioPorEmail(email) : null;
        token.rol = usuario && usuario.activo ? usuario.rol : null;
        token.revocado = !usuario || !usuario.activo;
        token.rolConsultadoEn = Date.now();
        if (usuario?.nombre) token.name = usuario.nombre;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.rol = token.rol ?? null;
      session.user.revocado = Boolean(token.revocado);
      return session;
    },
  },
});
