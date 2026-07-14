import { z } from "zod";

export const gastoCreateSchema = z.object({
  fecha: z.string().min(1, "Fecha requerida"),
  categoria: z.string().min(1, "Categoría requerida"),
  descripcion: z.string().min(1, "Descripción requerida"),
  monto: z.coerce.number().positive("El monto debe ser mayor a 0"),
  proveedorId: z.string().optional().default(""),
  metodoPago: z.string().optional().default(""),
  notas: z.string().optional().default(""),
});

export const gastoUpdateSchema = gastoCreateSchema.partial().extend({
  id: z.string().min(1),
});
