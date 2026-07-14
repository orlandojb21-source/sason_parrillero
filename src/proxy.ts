import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccess, seccionFromPathname } from "@/lib/roles";

const RUTAS_PUBLICAS = ["/login", "/unauthorized", "/offline"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (RUTAS_PUBLICAS.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const session = req.auth;
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  if (session.user.revocado) {
    return NextResponse.redirect(new URL("/login?error=AccessDenied", req.nextUrl.origin));
  }

  // Defensa en profundidad solamente: cada página/Server Action vuelve a
  // validar el rol por su cuenta (ver src/lib/session.ts) porque las Server
  // Actions no pasan necesariamente por este matcher.
  const seccion = seccionFromPathname(pathname);
  if (seccion && !canAccess(session.user.rol, seccion)) {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|logo\\.png|sw\\.js|favicon\\.ico|manifest\\.webmanifest).*)"],
};
