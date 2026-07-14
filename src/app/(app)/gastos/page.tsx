import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { eliminarGastoAction } from "@/lib/actions/gastos";
import { formatMoney, formatDate } from "@/lib/format";
import type { Gasto } from "@/lib/types";

export default async function GastosPage() {
  await requireSection("gastos");
  const gastos = await callAppsScript<Gasto[]>("gastos", "list");

  const columns: Column<Gasto>[] = [
    { header: "Folio", render: (g) => `#${g.folio}` },
    { header: "Fecha", render: (g) => formatDate(g.fecha) },
    { header: "Categoría", render: (g) => g.categoria },
    { header: "Descripción", render: (g) => g.descripcion },
    { header: "Monto", render: (g) => formatMoney(g.monto) },
    { header: "Método de pago", render: (g) => g.metodoPago },
    { header: "", render: (g) => <DeleteButton action={eliminarGastoAction.bind(null, g.id)} /> },
  ];

  return (
    <div>
      <PageHeader title="Gastos" action={<LinkButton href="/gastos/nuevo">+ Nuevo gasto</LinkButton>} />
      <DataTable rows={gastos} columns={columns} emptyMessage="Todavía no hay gastos registrados." />
    </div>
  );
}
