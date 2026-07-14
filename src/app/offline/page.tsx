export default function OfflinePage() {
  return (
    <main className="min-h-full flex flex-col items-center justify-center gap-4 bg-brasa-black px-6 text-center text-brasa-cream">
      {/* <img> a propósito: esta página la sirve el service worker sin red,
          y next/image pediría /_next/image (requiere red) para optimizarla. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Sazón Parrillero" className="h-32 w-32 rounded-full" />
      <h1 className="text-xl font-semibold">Sin conexión</h1>
      <p className="max-w-sm text-sm text-brasa-cream/70">
        No se pudo cargar esta página. Revisa tu conexión a internet e intenta de nuevo.
      </p>
    </main>
  );
}
