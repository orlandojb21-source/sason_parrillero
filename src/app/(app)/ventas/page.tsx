import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { eliminarVentaAction } from "@/lib/actions/ventas";
import { formatMoney, formatDateTime } from "@/lib/format";
import type { Venta } from "@/lib/types";

export default async function VentasPage() {
  const session = await requireSection("ventas");
  const ventas = await callAppsScript<Venta[]>("ventas", "list");
  const puedeEliminar = session.user.rol !== "cajero";

  const columns: Column<Venta>[] = [
    { header: "Folio", render: (v) => `#${v.folio}` },
    { header: "Fecha", render: (v) => formatDateTime(v.fecha) },
    { header: "Método de pago", render: (v) => v.metodoPago },
    { header: "Total", render: (v) => formatMoney(v.total) },
    { header: "Registrado por", render: (v) => v.usuarioEmail },
  ];

  if (puedeEliminar) {
    columns.push({ header: "", render: (v) => <DeleteButton action={eliminarVentaAction.bind(null, v.id)} /> });
  }

  return (
    <div>
      <PageHeader title="Ventas" action={<LinkButton href="/ventas/nueva">+ Nueva venta</LinkButton>} />
      <DataTable rows={ventas} columns={columns} emptyMessage="Todavía no hay ventas registradas." />
    </div>
  );
}
