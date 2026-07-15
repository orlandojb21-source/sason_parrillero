import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccess, type Seccion } from "@/lib/roles";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user || session.user.revocado) {
    redirect("/login");
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
