import Link from "next/link";
import { SECTION_ACCESS } from "@/lib/roles";
import type { Rol } from "@/lib/types";
import { NAV } from "./nav";

export function Sidebar({ rol }: { rol: Rol | null }) {
  const items = NAV.filter((item) => rol && SECTION_ACCESS[item.seccion].includes(rol));

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 bg-black/40 p-4 sm:flex">
      <div className="mb-6 flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Sazón Parrillero" className="h-10 w-10 rounded-full object-cover" />
        <span className="text-sm font-semibold leading-tight">Sazón Parrillero</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.seccion}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-brasa-cream/80 transition hover:bg-white/5 hover:text-brasa-cream"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
