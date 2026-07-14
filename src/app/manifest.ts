import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sazón Parrillero",
    short_name: "Sazón",
    description: "Gestión interna de Sazón Parrillero: inventario, ventas, proveedores, gastos y reportes.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0d0a08",
    theme_color: "#0d0a08",
    lang: "es",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
