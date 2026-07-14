/**
 * Ejecutar UNA VEZ manualmente desde el editor de Apps Script (seleccionar
 * la función `crearHojas` en el desplegable de arriba y pulsar "Ejecutar").
 * Crea (o corrige encabezados de) las 9 pestañas que espera el API.
 * Ver SETUP.md paso 2.
 */
function crearHojas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var esquema = {
    Usuarios: ["id", "nombre", "email", "rol", "activo", "creadoEn"],
    Inventario: [
      "id",
      "nombre",
      "categoria",
      "unidad",
      "stockActual",
      "stockMinimo",
      "costoUnitario",
      "creadoEn",
      "actualizadoEn",
    ],
    MovimientosInventario: ["id", "inventarioId", "tipo", "cantidad", "motivo", "referencia", "usuarioEmail", "fecha"],
    Ventas: ["id", "folio", "fecha", "usuarioEmail", "metodoPago", "total", "notas"],
    VentasDetalle: ["id", "ventaId", "inventarioId", "descripcion", "cantidad", "precioUnitario", "subtotal"],
    Proveedores: ["id", "nombre", "contacto", "telefono", "email", "direccion", "notas", "activo", "creadoEn"],
    Solicitudes: ["id", "folio", "proveedorId", "fecha", "estado", "usuarioEmail", "notas"],
    SolicitudesDetalle: ["id", "solicitudId", "inventarioId", "descripcion", "cantidad", "unidad", "precioEstimado"],
    Gastos: ["id", "folio", "fecha", "categoria", "descripcion", "monto", "proveedorId", "usuarioEmail", "metodoPago", "notas"],
  };

  Object.keys(esquema).forEach(function (nombre) {
    var headers = esquema[nombre];
    var sheet = ss.getSheetByName(nombre);
    if (!sheet) {
      sheet = ss.insertSheet(nombre);
    }
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  });

  var hojaDefault = ss.getSheetByName("Hoja 1") || ss.getSheetByName("Sheet1");
  if (hojaDefault && ss.getSheets().length > 1) {
    ss.deleteSheet(hojaDefault);
  }

  SpreadsheetApp.flush();
  Logger.log("Hojas creadas/actualizadas: " + Object.keys(esquema).join(", "));
}

/**
 * Ejecutar UNA VEZ, después de `crearHojas`, para sembrar el primer usuario
 * admin. Edita EMAIL_ADMIN antes de correrla. Ver SETUP.md paso 5.
 */
function sembrarAdmin() {
  var EMAIL_ADMIN = "cambia-esto@tu-correo.com";
  var NOMBRE_ADMIN = "Administrador";

  if (EMAIL_ADMIN.indexOf("cambia-esto") !== -1) {
    throw new Error("Edita EMAIL_ADMIN en Setup.gs antes de ejecutar sembrarAdmin().");
  }

  var sheet = getSheet_("Usuarios");
  var existentes = rowsToObjects_(sheet);
  var yaExiste = existentes.some(function (u) {
    return String(u.email).toLowerCase() === EMAIL_ADMIN.toLowerCase();
  });
  if (yaExiste) {
    Logger.log("Ese email ya existe en Usuarios, no se duplicó.");
    return;
  }

  appendObjectRaw_("Usuarios", {
    id: newId_(),
    nombre: NOMBRE_ADMIN,
    email: EMAIL_ADMIN,
    rol: "admin",
    activo: true,
    creadoEn: nowDate_(),
  });
  Logger.log("Admin sembrado: " + EMAIL_ADMIN);
}
