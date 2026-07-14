import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { SolicitudForm } from "@/components/forms/SolicitudForm";
import type { ItemInventario, Proveedor } from "@/lib/types";

export default async function NuevaSolicitudPage() {
  await requireSection("solicitudes");
  const [productos, proveedores] = await Promise.all([
    callAppsScript<ItemInventario[]>("inventario", "list"),
    callAppsScript<Proveedor[]>("proveedores", "list"),
  ]);

  return (
    <div>
      <PageHeader title="Nueva solicitud a proveedor" />
      <SolicitudForm productos={productos} proveedores={proveedores} />
    </div>
  );
}
