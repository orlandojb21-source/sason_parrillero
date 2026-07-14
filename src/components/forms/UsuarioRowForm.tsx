"use client";

import { useActionState } from "react";
import { actualizarUsuarioAction } from "@/lib/actions/usuarios";
import { ROLES, ROL_LABEL } from "@/lib/roles";
import type { Usuario } from "@/lib/types";

export function UsuarioRowForm({ usuario }: { usuario: Usuario }) {
  const [state, formAction] = useActionState(actualizarUsuarioAction, { error: null });

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={usuario.id} />
      <select
        name="rol"
        defaultValue={usuario.rol}
        className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-xs text-brasa-cream outline-none focus:border-brasa-flame"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROL_LABEL[r]}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-1 text-xs text-brasa-cream/80">
        <input type="checkbox" name="activo" defaultChecked={usuario.activo} className="accent-brasa-flame" />
        Activo
      </label>
      <button type="submit" className="rounded-md border border-white/15 px-2 py-1 text-xs transition hover:bg-white/5">
        Guardar
      </button>
      {state.error && <span className="text-xs text-brasa-ember">{state.error}</span>}
    </form>
  );
}
