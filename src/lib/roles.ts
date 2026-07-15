import type { Rol } from "@/lib/types";

export const ROLES: Rol[] = ["admin", "gerente", "cajero", "soporte"];

export const ROL_LABEL: Record<Rol, string> = {
  admin: "Administrador",
  gerente: "Gerente",
  cajero: "Cajero",
  soporte: "Soporte",
};

/** Secciones de navegación, usadas tanto por el proxy (gating) como por el nav. */
export type Seccion =
  | "dashboard"
  | "inventario"
  | "ventas"
  | "proveedores"
  | "solicitudes"
  | "gastos"
  | "reportes"
  | "usuarios";

export const SECTION_ACCESS: Record<Seccion, Rol[]> = {
  dashboard: ["admin", "gerente", "cajero", "soporte"],
  inventario: ["admin", "gerente", "cajero", "soporte"], // cajero: solo lectura (se aplica en la UI/acciones)
  ventas: ["admin", "gerente", "cajero", "soporte"],
  proveedores: ["admin", "gerente", "soporte"],
  solicitudes: ["admin", "gerente", "soporte"],
  gastos: ["admin", "gerente", "soporte"],
  reportes: ["admin", "gerente", "soporte"],
  usuarios: ["admin", "soporte"],
};

export function canAccess(rol: Rol | null | undefined, seccion: Seccion): boolean {
  if (!rol) return false;
  return SECTION_ACCESS[seccion].includes(rol);
}

/** Deriva la sección a partir de un pathname como "/inventario/nuevo" -> "inventario". */
export function seccionFromPathname(pathname: string): Seccion | null {
  const primerSegmento = pathname.split("/").filter(Boolean)[0];
  if (!primerSegmento) return "dashboard";
  if ((SECTION_ACCESS as Record<string, Rol[]>)[primerSegmento]) {
    return primerSegmento as Seccion;
  }
  return null;
}
