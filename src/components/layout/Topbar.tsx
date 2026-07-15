import { SignOutButton } from "@/components/layout/SignOutButton";
import { MobileNav } from "@/components/layout/MobileNav";
import { ROL_LABEL } from "@/lib/roles";
import type { Rol } from "@/lib/types";

export function Topbar({ nombre, rol }: { nombre?: string | null; rol: Rol | null }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav rol={rol} />
        <div>
          <p className="text-sm font-medium">{nombre ?? "Usuario"}</p>
          <p className="text-xs text-brasa-cream/60">{rol ? ROL_LABEL[rol] : ""}</p>
        </div>
      </div>
      <SignOutButton />
    </header>
  );
}
