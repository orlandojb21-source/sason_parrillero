import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { GastoForm } from "@/components/forms/GastoForm";
import type { Proveedor } from "@/lib/types";

export default async function NuevoGastoPage() {
  await requireSection("gastos");
  const proveedores = await callAppsScript<Proveedor[]>("proveedores", "list");

  return (
    <div>
      <PageHeader title="Nuevo gasto" />
      <GastoForm proveedores={proveedores} />
    </div>
  );
}
