import type { Rol } from "@/lib/types";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name?: string | null;
      image?: string | null;
      rol: Rol | null;
      revocado: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rol?: Rol | null;
    rolConsultadoEn?: number;
    revocado?: boolean;
  }
}
