import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccess, type Seccion } from "@/lib/roles";
import { callAppsScript, AppsScriptError } from "@/lib/appsScript";

const RECURSOS_VALIDOS: Seccion[] = ["inventario", "ventas", "proveedores", "solicitudes", "gastos", "usuarios"];

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;

  const session = await auth();
  if (!session?.user || session.user.revocado) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (!RECURSOS_VALIDOS.includes(resource as Seccion) || !canAccess(session.user.rol, resource as Seccion)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const filtros = Object.fromEntries(request.nextUrl.searchParams.entries());

  try {
    const data = await callAppsScript(resource, "list", filtros);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const message = err instanceof AppsScriptError ? err.message : "Error inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
