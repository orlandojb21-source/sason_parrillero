import { requireSection } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { UsuarioForm } from "@/components/forms/UsuarioForm";

export default async function NuevoUsuarioPage() {
  await requireSection("usuarios");

  return (
    <div>
      <PageHeader title="Nuevo usuario" />
      <UsuarioForm />
    </div>
  );
}
