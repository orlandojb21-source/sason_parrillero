"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { gastoCreateSchema, gastoUpdateSchema } from "@/lib/validation/gastos";
import type { ActionState } from "@/lib/actions/types";

export async function crearGastoAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSection("gastos");
  const parsed = gastoCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await callAppsScript("gastos", "create", { ...parsed.data, usuarioEmail: session.user.email });
  revalidatePath("/gastos");
  redirect("/gastos");
}

export async function actualizarGastoAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("gastos");
  const parsed = gastoUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await callAppsScript("gastos", "update", parsed.data);
  revalidatePath("/gastos");
  redirect("/gastos");
}

export async function eliminarGastoAction(id: string, _formData: FormData) {
  await requireSection("gastos");
  await callAppsScript("gastos", "delete", { id });
  revalidatePath("/gastos");
}
