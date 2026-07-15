import type { Seccion } from "@/lib/roles";

export const NAV: { seccion: Seccion; href: string; label: string }[] = [
  { seccion: "dashboard", href: "/dashboard", label: "Inicio" },
  { seccion: "inventario", href: "/inventario", label: "Inventario" },
  { seccion: "ventas", href: "/ventas", label: "Ventas" },
  { seccion: "proveedores", href: "/proveedores", label: "Proveedores" },
  { seccion: "solicitudes", href: "/solicitudes", label: "Solicitudes" },
  { seccion: "gastos", href: "/gastos", label: "Gastos" },
  { seccion: "reportes", href: "/reportes", label: "Reportes" },
  { seccion: "usuarios", href: "/usuarios", label: "Usuarios" },
];
