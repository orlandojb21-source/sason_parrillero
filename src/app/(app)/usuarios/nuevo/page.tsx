import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { UsuarioForm } from "@/components/forms/UsuarioForm";

export default async function NuevoUsuarioPage() {
  await requireRole(["admin", "soporte"]);

  return (
    <div>
      <PageHeader title="Nuevo usuario" />
      <UsuarioForm />
    </div>
  );
}
