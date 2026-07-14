"use client";

import { useActionState, useState } from "react";
import { crearVentaAction } from "@/lib/actions/ventas";
import { Field, TextareaField } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import type { ItemInventario } from "@/lib/types";

interface FilaVenta {
  inventarioId: string;
  descripcion: string;
  cantidad: string;
  precioUnitario: string;
}

const filaVacia = (): FilaVenta => ({ inventarioId: "", descripcion: "", cantidad: "1", precioUnitario: "0" });

export function VentaForm({ productos }: { productos: ItemInventario[] }) {
  const [state, formAction] = useActionState(crearVentaAction, { error: null });
  const [filas, setFilas] = useState<FilaVenta[]>([filaVacia()]);

  function actualizarFila(idx: number, patch: Partial<FilaVenta>) {
    setFilas((prev) => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }

  function seleccionarProducto(idx: number, inventarioId: string) {
    const producto = productos.find((p) => p.id === inventarioId);
    actualizarFila(idx, {
      inventarioId,
      descripcion: producto ? producto.nombre : filas[idx].descripcion,
      precioUnitario: producto ? String(producto.costoUnitario) : filas[idx].precioUnitario,
    });
  }

  const total = filas.reduce((sum, f) => sum + (Number(f.cantidad) || 0) * (Number(f.precioUnitario) || 0), 0);

  const itemsJson = JSON.stringify(
    filas
      .filter((f) => f.descripcion.trim() !== "")
      .map((f) => ({
        inventarioId: f.inventarioId || undefined,
        descripcion: f.descripcion,
        cantidad: Number(f.cantidad) || 0,
        precioUnitario: Number(f.precioUnitario) || 0,
      }))
  );

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-4">
      <FormError message={state.error} />
      <input type="hidden" name="itemsJson" value={itemsJson} />

      <div className="flex flex-col gap-3">
        {filas.map((fila, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-2 rounded-md border border-white/10 p-3 sm:grid-cols-12 sm:items-end"
          >
            <label className="flex flex-col gap-1 text-sm sm:col-span-4">
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
              <span className="text-brasa-cream/80">Precio unitario</span>
              <input
                type="number"
                step="0.01"
                value={fila.precioUnitario}
                onChange={(e) => actualizarFila(idx, { precioUnitario: e.target.value })}
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

      <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <Field label="Método de pago" name="metodoPago" placeholder="Efectivo, tarjeta…" required />
        <p className="text-lg font-semibold">Total: {formatMoney(total)}</p>
      </div>

      <TextareaField label="Notas" name="notas" />

      <SubmitButton>Registrar venta</SubmitButton>
    </form>
  );
}
