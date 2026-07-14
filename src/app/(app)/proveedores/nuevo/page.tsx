import { requireSection } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProveedorForm } from "@/components/forms/ProveedorForm";

export default async function NuevoProveedorPage() {
  await requireSection("proveedores");

  return (
    <div>
      <PageHeader title="Nuevo proveedor" />
      <ProveedorForm />
    </div>
  );
}
