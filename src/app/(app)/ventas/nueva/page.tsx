import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { VentaForm } from "@/components/forms/VentaForm";
import type { ItemInventario } from "@/lib/types";

export default async function NuevaVentaPage() {
  await requireSection("ventas");
  const productos = await callAppsScript<ItemInventario[]>("inventario", "list");

  return (
    <div>
      <PageHeader title="Nueva venta" />
      <VentaForm productos={productos} />
    </div>
  );
}
