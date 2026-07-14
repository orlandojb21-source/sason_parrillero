"use client";

import { useActionState } from "react";
import { crearProveedorAction } from "@/lib/actions/proveedores";
import { Field, TextareaField } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/Button";

export function ProveedorForm() {
  const [state, formAction] = useActionState(crearProveedorAction, { error: null });

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <FormError message={state.error} />
      <Field label="Nombre" name="nombre" required />
      <Field label="Persona de contacto" name="contacto" />
      <Field label="Teléfono" name="telefono" />
      <Field label="Email" name="email" type="email" />
      <Field label="Dirección" name="direccion" />
      <TextareaField label="Notas" name="notas" />
      <SubmitButton>Guardar proveedor</SubmitButton>
    </form>
  );
}
