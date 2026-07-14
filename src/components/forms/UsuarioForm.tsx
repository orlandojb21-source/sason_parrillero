"use client";

import { useActionState } from "react";
import { crearUsuarioAction } from "@/lib/actions/usuarios";
import { Field, SelectField } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/Button";
import { ROLES, ROL_LABEL } from "@/lib/roles";

export function UsuarioForm() {
  const [state, formAction] = useActionState(crearUsuarioAction, { error: null });

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <FormError message={state.error} />
      <Field label="Nombre" name="nombre" required />
      <Field label="Email de Google" name="email" type="email" required />
      <SelectField
        label="Rol"
        name="rol"
        required
        defaultValue="cajero"
        options={ROLES.map((r) => ({ value: r, label: ROL_LABEL[r] }))}
      />
      <SubmitButton>Agregar usuario</SubmitButton>
    </form>
  );
}
