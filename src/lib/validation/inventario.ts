import { z } from "zod";

export const inventarioCreateSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  categoria: z.string().min(1, "Categoría requerida"),
  unidad: z.string().min(1, "Unidad requerida"),
  stockActual: z.coerce.number().min(0).default(0),
  stockMinimo: z.coerce.number().min(0).default(0),
  costoUnitario: z.coerce.number().min(0).default(0),
});

export const inventarioUpdateSchema = inventarioCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const movimientoInventarioSchema = z.object({
  inventarioId: z.string().min(1),
  tipo: z.enum(["entrada", "salida", "ajuste"]),
  cantidad: z.coerce.number(),
  motivo: z.string().optional().default(""),
  referencia: z.string().optional().default(""),
});
