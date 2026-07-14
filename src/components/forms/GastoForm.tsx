"use client";

import { useActionState } from "react";
import { crearGastoAction } from "@/lib/actions/gastos";
import { Field, SelectField, TextareaField } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/Button";
import type { Proveedor } from "@/lib/types";

export function GastoForm({ proveedores }: { proveedores: Proveedor[] }) {
  const [state, formAction] = useActionState(crearGastoAction, { error: null });
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <FormError message={state.error} />
      <Field label="Fecha" name="fecha" type="date" defaultValue={hoy} required />
      <Field label="Categoría" name="categoria" required placeholder="Servicios, nómina, insumos…" />
      <Field label="Descripción" name="descripcion" required />
      <Field label="Monto" name="monto" type="number" step="0.01" required />
      <Field label="Método de pago" name="metodoPago" placeholder="Efectivo, transferencia…" />
      <SelectField
        label="Proveedor (opcional)"
        name="proveedorId"
        options={[{ value: "", label: "Sin proveedor" }, ...proveedores.map((p) => ({ value: p.id, label: p.nombre }))]}
      />
      <TextareaField label="Notas" name="notas" />
      <SubmitButton>Guardar gasto</SubmitButton>
    </form>
  );
}
