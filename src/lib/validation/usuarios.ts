import { z } from "zod";

export const usuarioCreateSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  rol: z.enum(["admin", "gerente", "cajero"]),
});

export const usuarioUpdateSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1).optional(),
  rol: z.enum(["admin", "gerente", "cajero"]).optional(),
  activo: z.coerce.boolean().optional(),
});
