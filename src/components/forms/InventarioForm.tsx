"use client";

import { useActionState } from "react";
import { crearInventarioAction } from "@/lib/actions/inventario";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/Button";

export function InventarioForm() {
  const [state, formAction] = useActionState(crearInventarioAction, { error: null });

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <FormError message={state.error} />
      <Field label="Nombre" name="nombre" required />
      <Field label="Categoría" name="categoria" required placeholder="Carnes, bebidas, insumos…" />
      <Field label="Unidad" name="unidad" required placeholder="kg, lb, unidad, paquete…" />
      <Field label="Stock actual" name="stockActual" type="number" step="0.01" defaultValue={0} />
      <Field label="Stock mínimo" name="stockMinimo" type="number" step="0.01" defaultValue={0} />
      <Field label="Costo unitario" name="costoUnitario" type="number" step="0.01" defaultValue={0} />
      <SubmitButton>Guardar producto</SubmitButton>
    </form>
  );
}
