import { requireRole } from "@/lib/session";
import { callAppsScript } from "@/lib/appsScript";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { UsuarioRowForm } from "@/components/forms/UsuarioRowForm";
import { eliminarUsuarioAction } from "@/lib/actions/usuarios";
import { formatDate } from "@/lib/format";
import type { Usuario } from "@/lib/types";

export default async function UsuariosPage() {
  await requireRole(["admin"]);
  const usuarios = await callAppsScript<Usuario[]>("usuarios", "list");

  const columns: Column<Usuario>[] = [
    { header: "Nombre", render: (u) => u.nombre },
    { header: "Email", render: (u) => u.email },
    { header: "Rol y estado", render: (u) => <UsuarioRowForm usuario={u} /> },
    { header: "Desde", render: (u) => formatDate(u.creadoEn) },
    { header: "", render: (u) => <DeleteButton action={eliminarUsuarioAction.bind(null, u.id)} /> },
  ];

  return (
    <div>
      <PageHeader title="Usuarios" action={<LinkButton href="/usuarios/nuevo">+ Nuevo usuario</LinkButton>} />
      <p className="mb-4 max-w-2xl text-sm text-brasa-cream/60">
        Solo las personas que aparecen aquí, con su cuenta de Google activa, pueden entrar al panel. El rol
        controla qué secciones ven.
      </p>
      <DataTable rows={usuarios} columns={columns} emptyMessage="Todavía no hay usuarios registrados." />
    </div>
  );
}
