import { redirect } from "next/navigation";
import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { MovimientoForm } from "@/components/forms/MovimientoForm";
import type { ItemInventario } from "@/lib/types";

export default async function MovimientoInventarioPage() {
  const session = await requireSection("inventario");
  if (session.user.rol === "cajero") redirect("/inventario");

  const items = await callAppsScript<ItemInventario[]>("inventario", "list");

  return (
    <div>
      <PageHeader title="Registrar movimiento de inventario" />
      <MovimientoForm items={items} />
    </div>
  );
}
