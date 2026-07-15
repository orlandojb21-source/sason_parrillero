"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { solicitudCreateSchema, solicitudEstadoSchema } from "@/lib/validation/solicitudes";
import type { ActionState } from "@/lib/actions/types";

export async function crearSolicitudAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSection("solicitudes");

  let items: unknown = [];
  try {
    items = JSON.parse(String(formData.get("itemsJson") || "[]"));
  } catch {
    return { error: "Los productos de la solicitud no son válidos." };
  }

  let proveedorId = formData.get("proveedorId");
  const proveedorNuevoNombre = String(formData.get("proveedorNuevoNombre") || "").trim();
  if (proveedorNuevoNombre) {
    const proveedor = await callAppsScript<{ id: string }>("proveedores", "create", {
      nombre: proveedorNuevoNombre,
    });
    proveedorId = proveedor.id;
  }

  const parsed = solicitudCreateSchema.safeParse({
    proveedorId,
    notas: formData.get("notas"),
    items,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await callAppsScript("solicitudes", "create", { ...parsed.data, usuarioEmail: session.user.email });
  revalidatePath("/solicitudes");
  if (proveedorNuevoNombre) revalidatePath("/proveedores");
  redirect("/solicitudes");
}

/** Usada como <form action> directo en la fila de la lista, sin useActionState. */
export async function actualizarEstadoSolicitudAction(formData: FormData) {
  await requireSection("solicitudes");
  const parsed = solicitudEstadoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await callAppsScript("solicitudes", "update", parsed.data);
  revalidatePath("/solicitudes");
}

export async function eliminarSolicitudAction(id: string, _formData: FormData) {
  await requireSection("solicitudes");
  await callAppsScript("solicitudes", "delete", { id });
  revalidatePath("/solicitudes");
}
