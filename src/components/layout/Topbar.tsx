import { SignOutButton } from "@/components/layout/SignOutButton";
import { MobileNav } from "@/components/layout/MobileNav";
import { ROL_LABEL } from "@/lib/roles";
import type { Rol } from "@/lib/types";

export function Topbar({
  nombre,
  rol,
  imagen,
}: {
  nombre?: string | null;
  rol: Rol | null;
  imagen?: string | null;
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
      <div>
        <MobileNav rol={rol} />
      </div>
      <div className="flex items-center gap-3">
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagen}
            alt=""
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : null}
        <div className="text-right">
          <p className="text-sm font-medium">{nombre ?? "Usuario"}</p>
          <p className="text-xs text-brasa-cream/60">{rol ? ROL_LABEL[rol] : ""}</p>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
