"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="rounded-full bg-brasa-flame px-6 py-3 text-sm font-semibold text-brasa-black transition hover:bg-brasa-gold"
    >
      Iniciar sesión con Google
    </button>
  );
}
