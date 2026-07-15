"use client";

import { useState } from "react";
import Link from "next/link";
import { SECTION_ACCESS } from "@/lib/roles";
import type { Rol } from "@/lib/types";
import { NAV } from "./nav";

export function MobileNav({ rol }: { rol: Rol | null }) {
  const [open, setOpen] = useState(false);
  const items = NAV.filter((item) => rol && SECTION_ACCESS[item.seccion].includes(rol));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-brasa-cream sm:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-64 flex-col bg-brasa-black p-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Sazón Parrillero" className="h-10 w-10 rounded-full object-cover" />
                <span className="text-sm font-semibold leading-tight">Sazón Parrillero</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-8 w-8 items-center justify-center rounded-md text-brasa-cream/70 hover:text-brasa-cream"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.seccion}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-brasa-cream/80 transition hover:bg-white/5 hover:text-brasa-cream"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
