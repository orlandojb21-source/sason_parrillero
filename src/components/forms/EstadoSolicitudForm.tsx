"use client";

import { actualizarEstadoSolicitudAction } from "@/lib/actions/solicitudes";
import type { EstadoSolicitud } from "@/lib/types";

const ESTADOS: EstadoSolicitud[] = ["pendiente", "enviada", "recibida", "cancelada"];

export function EstadoSolicitudForm({ id, estado }: { id: string; estado: EstadoSolicitud }) {
  return (
    <form action={actualizarEstadoSolicitudAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="estado"
        defaultValue={estado}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-xs text-brasa-cream outline-none focus:border-brasa-flame"
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
    </form>
  );
}
