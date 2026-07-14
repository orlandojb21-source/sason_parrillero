"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { ventaCreateSchema } from "@/lib/validation/ventas";
import type { ActionState } from "@/lib/actions/types";

export async function crearVentaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSection("ventas");

  let items: unknown = [];
  try {
    items = JSON.parse(String(formData.get("itemsJson") || "[]"));
  } catch {
    return { error: "Los productos de la venta no son válidos." };
  }

  const parsed = ventaCreateSchema.safeParse({
    metodoPago: formData.get("metodoPago"),
    notas: formData.get("notas"),
    items,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await callAppsScript("ventas", "create", { ...parsed.data, usuarioEmail: session.user.email });
  revalidatePath("/ventas");
  revalidatePath("/inventario");
  redirect("/ventas");
}

export async function eliminarVentaAction(id: string, _formData: FormData) {
  const session = await requireSection("ventas");
  if (session.user.rol === "cajero") return;
  await callAppsScript("ventas", "delete", { id });
  revalidatePath("/ventas");
}
