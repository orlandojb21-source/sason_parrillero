import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginButton } from "@/components/LoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user && !session.user.revocado) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-brasa-black px-6 py-16 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Sazón Parrillero" className="h-40 w-40 rounded-full object-cover" />
      <div>
        <h1 className="text-2xl font-semibold text-brasa-cream">Sazón Parrillero</h1>
        <p className="text-sm text-brasa-cream/70">Panel interno de gestión</p>
      </div>
      {error && (
        <p className="max-w-sm rounded-md border border-brasa-ember/60 bg-brasa-ember/10 px-4 py-2 text-sm text-brasa-cream">
          Tu cuenta de Google no está autorizada. Pide a un administrador que te agregue en la hoja Usuarios.
        </p>
      )}
      <LoginButton />
    </main>
  );
}
