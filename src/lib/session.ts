import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccess, type Seccion } from "@/lib/roles";
import type { Rol } from "@/lib/types";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user || session.user.revocado) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(roles: Rol[]) {
  const session = await requireAuth();
  if (!session.user.rol || !roles.includes(session.user.rol)) {
    redirect("/unauthorized");
  }
  return session;
}

export async function requireSection(seccion: Seccion) {
  const session = await requireAuth();
  if (!canAccess(session.user.rol, seccion)) {
    redirect("/unauthorized");
  }
  return session;
}
