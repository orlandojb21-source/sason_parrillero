import { requireSection } from "@/lib/session";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { InventarioForm } from "@/components/forms/InventarioForm";

export default async function NuevoInventarioPage() {
  const session = await requireSection("inventario");
  if (session.user.rol === "cajero") redirect("/inventario");

  return (
    <div>
      <PageHeader title="Nuevo producto de inventario" />
      <InventarioForm />
    </div>
  );
}
