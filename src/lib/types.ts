export type Rol = "admin" | "gerente" | "cajero";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  creadoEn: string;
}

export interface ItemInventario {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  costoUnitario: number;
  creadoEn: string;
  actualizadoEn: string;
}

export type TipoMovimiento = "entrada" | "salida" | "ajuste";

export interface MovimientoInventario {
  id: string;
  inventarioId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
  referencia: string;
  usuarioEmail: string;
  fecha: string;
}

export interface VentaDetalleItem {
  id?: string;
  ventaId?: string;
  inventarioId?: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Venta {
  id: string;
  folio: number;
  fecha: string;
  usuarioEmail: string;
  metodoPago: string;
  total: number;
  notas: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  notas: string;
  activo: boolean;
  creadoEn: string;
}

export type EstadoSolicitud = "pendiente" | "enviada" | "recibida" | "cancelada";

export interface SolicitudDetalleItem {
  id?: string;
  solicitudId?: string;
  inventarioId?: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioEstimado?: number;
}

export interface Solicitud {
  id: string;
  folio: number;
  proveedorId: string;
  fecha: string;
  estado: EstadoSolicitud;
  usuarioEmail: string;
  notas: string;
}

export interface Gasto {
  id: string;
  folio: number;
  fecha: string;
  categoria: string;
  descripcion: string;
  monto: number;
  proveedorId?: string;
  usuarioEmail: string;
  metodoPago: string;
  notas: string;
}

export interface ReporteResumen {
  ingresos: number;
  egresos: number;
  neto: number;
  serie: { fecha: string; ingresos: number; egresos: number }[];
}
