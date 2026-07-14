import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { eliminarProveedorAction } from "@/lib/actions/proveedores";
import type { Proveedor } from "@/lib/types";

export default async function ProveedoresPage() {
  await requireSection("proveedores");
  const proveedores = await callAppsScript<Proveedor[]>("proveedores", "list");

  const columns: Column<Proveedor>[] = [
    { header: "Nombre", render: (p) => p.nombre },
    { header: "Contacto", render: (p) => p.contacto },
    { header: "Teléfono", render: (p) => p.telefono },
    { header: "Email", render: (p) => p.email },
    { header: "Activo", render: (p) => (p.activo ? "Sí" : "No") },
    { header: "", render: (p) => <DeleteButton action={eliminarProveedorAction.bind(null, p.id)} /> },
  ];

  return (
    <div>
      <PageHeader title="Proveedores" action={<LinkButton href="/proveedores/nuevo">+ Nuevo proveedor</LinkButton>} />
      <DataTable
        rows={proveedores}
        columns={columns}
        emptyMessage="Todavía no hay proveedores registrados. No hay proveedor fijo: agrega cada uno según lo necesites."
      />
    </div>
  );
}
