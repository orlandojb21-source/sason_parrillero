"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { proveedorCreateSchema, proveedorUpdateSchema } from "@/lib/validation/proveedores";
import type { ActionState } from "@/lib/actions/types";

export async function crearProveedorAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("proveedores");
  const parsed = proveedorCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await callAppsScript("proveedores", "create", parsed.data);
  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function actualizarProveedorAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("proveedores");
  const parsed = proveedorUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await callAppsScript("proveedores", "update", parsed.data);
  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function eliminarProveedorAction(id: string, _formData: FormData) {
  await requireSection("proveedores");
  await callAppsScript("proveedores", "delete", { id });
  revalidatePath("/proveedores");
}
