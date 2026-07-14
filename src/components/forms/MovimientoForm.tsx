"use client";

import { useActionState } from "react";
import { registrarMovimientoAction } from "@/lib/actions/inventario";
import { SelectField, Field, TextareaField } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/Button";
import type { ItemInventario } from "@/lib/types";

export function MovimientoForm({ items }: { items: ItemInventario[] }) {
  const [state, formAction] = useActionState(registrarMovimientoAction, { error: null });

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <FormError message={state.error} />
      <SelectField
        label="Producto"
        name="inventarioId"
        required
        options={items.map((i) => ({ value: i.id, label: `${i.nombre} (stock: ${i.stockActual} ${i.unidad})` }))}
      />
      <SelectField
        label="Tipo de movimiento"
        name="tipo"
        required
        options={[
          { value: "entrada", label: "Entrada (suma al stock)" },
          { value: "salida", label: "Salida (resta del stock)" },
          { value: "ajuste", label: "Ajuste (fija el stock exacto)" },
        ]}
      />
      <Field label="Cantidad" name="cantidad" type="number" step="0.01" required />
      <TextareaField label="Motivo" name="motivo" />
      <SubmitButton>Registrar movimiento</SubmitButton>
    </form>
  );
}
