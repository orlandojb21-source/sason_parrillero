import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { eliminarInventarioAction } from "@/lib/actions/inventario";
import { formatMoney } from "@/lib/format";
import type { ItemInventario } from "@/lib/types";

export default async function InventarioPage() {
  const session = await requireSection("inventario");
  const items = await callAppsScript<ItemInventario[]>("inventario", "list");
  const puedeEditar = session.user.rol !== "cajero";

  const columns: Column<ItemInventario>[] = [
    { header: "Nombre", render: (i) => i.nombre },
    { header: "Categoría", render: (i) => i.categoria },
    { header: "Unidad", render: (i) => i.unidad },
    {
      header: "Stock",
      render: (i) => (
        <span className={Number(i.stockActual) <= Number(i.stockMinimo) ? "font-semibold text-brasa-ember" : ""}>
          {i.stockActual} (mín. {i.stockMinimo})
        </span>
      ),
    },
    { header: "Costo unitario", render: (i) => formatMoney(i.costoUnitario) },
  ];

  if (puedeEditar) {
    columns.push({
      header: "",
      render: (i) => <DeleteButton action={eliminarInventarioAction.bind(null, i.id)} />,
    });
  }

  return (
    <div>
      <PageHeader
        title="Inventario"
        action={
          puedeEditar ? (
            <div className="flex gap-2">
              <LinkButton href="/inventario/movimiento" variant="secondary">
                Registrar movimiento
              </LinkButton>
              <LinkButton href="/inventario/nuevo">+ Nuevo producto</LinkButton>
            </div>
          ) : undefined
        }
      />
      <DataTable rows={items} columns={columns} emptyMessage="Todavía no hay productos en el inventario." />
    </div>
  );
}
