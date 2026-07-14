/**
 * Code.gs — único punto de entrada del Web App.
 *
 * Contrato: POST body JSON = { token, resource, action, payload }
 * Respuesta: siempre { ok: true, data } o { ok: false, error }.
 *
 * doGet solo sirve como health-check; deliberadamente NO se usa para datos
 * reales (evita que el token termine en query strings / logs / historial).
 */

function doGet(e) {
  return jsonResponse_({ ok: true, service: "sazon-parrillero-api" });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, error: "BODY_VACIO" });
    }

    var body = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty("TOKEN");
    if (!expected || body.token !== expected) {
      return jsonResponse_({ ok: false, error: "UNAUTHORIZED" });
    }

    var resource = body.resource;
    var action = body.action;
    var payload = body.payload || {};

    var router = getRouter_();
    if (!router[resource] || typeof router[resource][action] !== "function") {
      return jsonResponse_({ ok: false, error: "RECURSO_O_ACCION_DESCONOCIDA" });
    }

    var data = router[resource][action](payload);
    return jsonResponse_({ ok: true, data: data });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getRouter_() {
  return {
    usuarios: {
      list: Usuarios_list,
      get: Usuarios_get,
      create: Usuarios_create,
      update: Usuarios_update,
      delete: Usuarios_delete,
    },
    inventario: {
      list: Inventario_list,
      get: Inventario_get,
      create: Inventario_create,
      update: Inventario_update,
      delete: Inventario_delete,
      movimiento: Inventario_registrarMovimiento,
      movimientos: Inventario_listMovimientos,
    },
    ventas: {
      list: Ventas_list,
      get: Ventas_get,
      create: Ventas_create,
      delete: Ventas_delete,
    },
    proveedores: {
      list: Proveedores_list,
      get: Proveedores_get,
      create: Proveedores_create,
      update: Proveedores_update,
      delete: Proveedores_delete,
    },
    solicitudes: {
      list: Solicitudes_list,
      get: Solicitudes_get,
      create: Solicitudes_create,
      update: Solicitudes_update,
      delete: Solicitudes_delete,
    },
    gastos: {
      list: Gastos_list,
      get: Gastos_get,
      create: Gastos_create,
      update: Gastos_update,
      delete: Gastos_delete,
    },
    reportes: {
      resumen: Reportes_resumen,
    },
  };
}
