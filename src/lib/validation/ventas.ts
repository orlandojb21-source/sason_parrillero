import { z } from "zod";

export const itemVentaSchema = z.object({
  inventarioId: z.string().optional().default(""),
  descripcion: z.string().min(1, "Descripción requerida"),
  cantidad: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  precioUnitario: z.coerce.number().min(0),
});

export const ventaCreateSchema = z.object({
  fecha: z.string().optional(),
  metodoPago: z.string().min(1, "Método de pago requerido"),
  notas: z.string().optional().default(""),
  items: z.array(itemVentaSchema).min(1, "Agrega al menos un producto"),
});
