"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";

type Variant = "primary" | "secondary" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brasa-flame text-brasa-black hover:bg-brasa-gold",
  secondary: "border border-white/15 text-brasa-cream hover:bg-white/5",
  danger: "bg-brasa-ember text-brasa-cream hover:bg-brasa-ember/80",
};

export function SubmitButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-md px-4 py-2 text-sm font-semibold transition ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </Link>
  );
}
