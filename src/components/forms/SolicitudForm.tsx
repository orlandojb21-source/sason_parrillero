"use client";

import { useActionState, useState } from "react";
import { crearSolicitudAction } from "@/lib/actions/solicitudes";
import { TextareaField } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/Button";
import type { ItemInventario, Proveedor } from "@/lib/types";

interface FilaSolicitud {
  inventarioId: string;
  descripcion: string;
  cantidad: string;
  unidad: string;
  precioEstimado: string;
}

const filaVacia = (): FilaSolicitud => ({
  inventarioId: "",
  descripcion: "",
  cantidad: "1",
  unidad: "",
  precioEstimado: "",
});

export function SolicitudForm({ productos, proveedores }: { productos: ItemInventario[]; proveedores: Proveedor[] }) {
  const [state, formAction] = useActionState(crearSolicitudAction, { error: null });
  const [filas, setFilas] = useState<FilaSolicitud[]>([filaVacia()]);

  function actualizarFila(idx: number, patch: Partial<FilaSolicitud>) {
    setFilas((prev) => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }

  function seleccionarProducto(idx: number, inventarioId: string) {
    const producto = productos.find((p) => p.id === inventarioId);
    actualizarFila(idx, {
      inventarioId,
      descripcion: producto ? producto.nombre : filas[idx].descripcion,
      unidad: producto ? producto.unidad : filas[idx].unidad,
    });
  }

  const itemsJson = JSON.stringify(
    filas
      .filter((f) => f.descripcion.trim() !== "")
      .map((f) => ({
        inventarioId: f.inventarioId || undefined,
        descripcion: f.descripcion,
        cantidad: Number(f.cantidad) || 0,
        unidad: f.unidad,
        precioEstimado: f.precioEstimado ? Number(f.precioEstimado) : undefined,
      }))
  );

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-4">
      <FormError message={state.error} />
      <input type="hidden" name="itemsJson" value={itemsJson} />

      <label className="flex max-w-sm flex-col gap-1 text-sm">
        <span className="text-brasa-cream/80">Proveedor (opcional, no hay uno fijo)</span>
        <select
          name="proveedorId"
          defaultValue=""
          className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
        >
          <option value="">Aún sin decidir</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-3">
        {filas.map((fila, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-2 rounded-md border border-white/10 p-3 sm:grid-cols-12 sm:items-end"
          >
            <label className="flex flex-col gap-1 text-sm sm:col-span-3">
              <span className="text-brasa-cream/80">Producto</span>
              <select
                value={fila.inventarioId}
                onChange={(e) => seleccionarProducto(idx, e.target.value)}
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
              >
                <option value="">Otro / no vinculado a inventario</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-3">
              <span className="text-brasa-cream/80">Descripción</span>
              <input
                value={fila.descripcion}
                onChange={(e) => actualizarFila(idx, { descripcion: e.target.value })}
                required
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-brasa-cream/80">Cantidad</span>
              <input
                type="number"
                step="0.01"
                value={fila.cantidad}
                onChange={(e) => actualizarFila(idx, { cantidad: e.target.value })}
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-brasa-cream/80">Unidad</span>
              <input
                value={fila.unidad}
                onChange={(e) => actualizarFila(idx, { unidad: e.target.value })}
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-1">
              <span className="text-brasa-cream/80">Precio est.</span>
              <input
                type="number"
                step="0.01"
                value={fila.precioEstimado}
                onChange={(e) => actualizarFila(idx, { precioEstimado: e.target.value })}
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
              />
            </label>

            <div className="flex items-center justify-end sm:col-span-1">
              {filas.length > 1 && (
                <button
                  type="button"
                  onClick={() => setFilas((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-xs text-brasa-ember hover:underline"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFilas((prev) => [...prev, filaVacia()])}
        className="self-start rounded-md border border-white/15 px-3 py-1.5 text-sm text-brasa-cream/80 transition hover:bg-white/5"
      >
        + Agregar producto
      </button>

      <TextareaField label="Notas" name="notas" />

      <SubmitButton>Crear solicitud</SubmitButton>
    </form>
  );
}
