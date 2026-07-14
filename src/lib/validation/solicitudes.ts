import { z } from "zod";

export const itemSolicitudSchema = z.object({
  inventarioId: z.string().optional().default(""),
  descripcion: z.string().min(1, "Descripción requerida"),
  cantidad: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  unidad: z.string().optional().default(""),
  precioEstimado: z.coerce.number().min(0).optional(),
});

export const solicitudCreateSchema = z.object({
  proveedorId: z.string().optional().default(""),
  fecha: z.string().optional(),
  notas: z.string().optional().default(""),
  items: z.array(itemSolicitudSchema).min(1, "Agrega al menos un producto"),
});

export const solicitudEstadoSchema = z.object({
  id: z.string().min(1),
  estado: z.enum(["pendiente", "enviada", "recibida", "cancelada"]),
});
