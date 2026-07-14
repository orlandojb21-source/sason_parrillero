"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-brasa-cream/80 transition hover:bg-white/5"
    >
      Cerrar sesión
    </button>
  );
}
