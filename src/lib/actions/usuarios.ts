"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { usuarioCreateSchema, usuarioUpdateSchema } from "@/lib/validation/usuarios";
import type { ActionState } from "@/lib/actions/types";

export async function crearUsuarioAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["admin", "soporte"]);
  const parsed = usuarioCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await callAppsScript("usuarios", "create", parsed.data);
  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function actualizarUsuarioAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["admin", "soporte"]);
  const parsed = usuarioUpdateSchema.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre") || undefined,
    rol: formData.get("rol") || undefined,
    activo: formData.get("activo") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await callAppsScript("usuarios", "update", parsed.data);
  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function eliminarUsuarioAction(id: string, _formData: FormData) {
  await requireRole(["admin", "soporte"]);
  await callAppsScript("usuarios", "delete", { id });
  revalidatePath("/usuarios");
}
