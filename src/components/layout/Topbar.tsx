import { SignOutButton } from "@/components/layout/SignOutButton";
import { ROL_LABEL } from "@/lib/roles";
import type { Rol } from "@/lib/types";

export function Topbar({ nombre, rol }: { nombre?: string | null; rol: Rol | null }) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-3">
      <div>
        <p className="text-sm font-medium">{nombre ?? "Usuario"}</p>
        <p className="text-xs text-brasa-cream/60">{rol ? ROL_LABEL[rol] : ""}</p>
      </div>
      <SignOutButton />
    </header>
  );
}
