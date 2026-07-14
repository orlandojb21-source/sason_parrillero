import { requireSection } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { eliminarSolicitudAction } from "@/lib/actions/solicitudes";
import { EstadoSolicitudForm } from "@/components/forms/EstadoSolicitudForm";
import { formatDate } from "@/lib/format";
import type { Solicitud, Proveedor } from "@/lib/types";

export default async function SolicitudesPage() {
  await requireSection("solicitudes");
  const [solicitudes, proveedores] = await Promise.all([
    callAppsScript<Solicitud[]>("solicitudes", "list"),
    callAppsScript<Proveedor[]>("proveedores", "list"),
  ]);

  const nombreProveedor = (id: string) => proveedores.find((p) => p.id === id)?.nombre || "—";

  const columns: Column<Solicitud>[] = [
    { header: "Folio", render: (s) => `#${s.folio}` },
    { header: "Fecha", render: (s) => formatDate(s.fecha) },
    { header: "Proveedor", render: (s) => nombreProveedor(s.proveedorId) },
    {
      header: "Estado",
      render: (s) => <EstadoSolicitudForm id={s.id} estado={s.estado} />,
    },
    { header: "Registrado por", render: (s) => s.usuarioEmail },
    { header: "", render: (s) => <DeleteButton action={eliminarSolicitudAction.bind(null, s.id)} /> },
  ];

  return (
    <div>
      <PageHeader title="Solicitudes a proveedor" action={<LinkButton href="/solicitudes/nueva">+ Nueva solicitud</LinkButton>} />
      <DataTable
        rows={solicitudes}
        columns={columns}
        emptyMessage="Todavía no hay solicitudes. No hay proveedor fijo: elige uno de la lista o crea uno nuevo antes de solicitar."
      />
    </div>
  );
}
