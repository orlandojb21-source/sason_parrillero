import "server-only";

type AppsScriptResponse<T> = { ok: true; data: T } | { ok: false; error: string };

export class AppsScriptError extends Error {}

/**
 * Único punto de contacto con el backend en Google Apps Script. Server-only:
 * nunca se importa desde un Client Component, así la URL y el token del Web
 * App no llegan jamás al navegador.
 */
export async function callAppsScript<T = unknown>(
  resource: string,
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const url = process.env.APPS_SCRIPT_URL;
  const token = process.env.APPS_SCRIPT_TOKEN;
  if (!url || !token) {
    throw new AppsScriptError("APPS_SCRIPT_URL / APPS_SCRIPT_TOKEN no configurados en el entorno");
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, resource, action, payload }),
      cache: "no-store",
    });
  } catch {
    throw new AppsScriptError("No se pudo contactar a Apps Script (red o URL inválida)");
  }

  if (!res.ok) {
    throw new AppsScriptError(`Apps Script respondió HTTP ${res.status}`);
  }

  const json = (await res.json()) as AppsScriptResponse<T>;
  if (!json.ok) {
    throw new AppsScriptError(json.error);
  }
  return json.data;
}
