import { z } from "zod";

export const proveedorCreateSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  contacto: z.string().optional().default(""),
  telefono: z.string().optional().default(""),
  email: z.union([z.string().email(), z.literal("")]).optional().default(""),
  direccion: z.string().optional().default(""),
  notas: z.string().optional().default(""),
});

export const proveedorUpdateSchema = proveedorCreateSchema.partial().extend({
  id: z.string().min(1),
});
