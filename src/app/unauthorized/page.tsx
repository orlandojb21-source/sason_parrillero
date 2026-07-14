export default function UnauthorizedPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-brasa-black px-6 text-center text-brasa-cream">
      <h1 className="text-xl font-semibold">Acceso no permitido</h1>
      <p className="max-w-sm text-sm text-brasa-cream/70">
        Tu rol no tiene acceso a esta sección. Si crees que es un error, contacta a un administrador.
      </p>
    </main>
  );
}
