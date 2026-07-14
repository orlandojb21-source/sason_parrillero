import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div>
      <h1 className="text-xl font-semibold">Hola, {session.user.name ?? session.user.email}</h1>
      <p className="mt-1 text-sm text-brasa-cream/70">Bienvenido al panel de Sazón Parrillero.</p>
    </div>
  );
}
