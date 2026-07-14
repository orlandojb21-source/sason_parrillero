"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import {
  inventarioCreateSchema,
  inventarioUpdateSchema,
  movimientoInventarioSchema,
} from "@/lib/validation/inventario";
import type { ActionState } from "@/lib/actions/types";

export async function crearInventarioAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSection("inventario");
  if (session.user.rol === "cajero") {
    return { error: "No tienes permiso para crear productos de inventario." };
  }

  const parsed = inventarioCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await callAppsScript("inventario", "create", parsed.data);
  revalidatePath("/inventario");
  redirect("/inventario");
}

export async function actualizarInventarioAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSection("inventario");
  if (session.user.rol === "cajero") {
    return { error: "No tienes permiso para editar productos de inventario." };
  }

  const parsed = inventarioUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await callAppsScript("inventario", "update", parsed.data);
  revalidatePath("/inventario");
  redirect("/inventario");
}

export async function eliminarInventarioAction(id: string, _formData: FormData) {
  const session = await requireSection("inventario");
  if (session.user.rol === "cajero") return;
  await callAppsScript("inventario", "delete", { id });
  revalidatePath("/inventario");
}

export async function registrarMovimientoAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSection("inventario");
  if (session.user.rol === "cajero") {
    return { error: "No tienes permiso para registrar movimientos de inventario." };
  }

  const parsed = movimientoInventarioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await callAppsScript("inventario", "movimiento", { ...parsed.data, usuarioEmail: session.user.email });
  revalidatePath("/inventario");
  redirect("/inventario");
}
