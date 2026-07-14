import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccess } from "@/lib/roles";
import { callAppsScript, AppsScriptError } from "@/lib/appsScript";
import type { ReporteResumen } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.revocado) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (!canAccess(session.user.rol, "reportes")) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const desde = request.nextUrl.searchParams.get("desde") ?? undefined;
  const hasta = request.nextUrl.searchParams.get("hasta") ?? undefined;

  try {
    const data = await callAppsScript<ReporteResumen>("reportes", "resumen", { desde, hasta });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const message = err instanceof AppsScriptError ? err.message : "Error inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
