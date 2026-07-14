function Solicitudes_list(payload) {
  return listObjects_("Solicitudes", buildFilter_(payload));
}

function Solicitudes_get(payload) {
  var sheet = getSheet_("Solicitudes");
  var solicitud = findRowById_(sheet, payload.id);
  if (!solicitud) throw new Error("Solicitud no encontrada: " + payload.id);
  var detalle = listObjects_("SolicitudesDetalle", function (d) {
    return String(d.solicitudId) === String(payload.id);
  });
  return { solicitud: solicitud, detalle: detalle };
}

/**
 * payload: { proveedorId, fecha, usuarioEmail, notas,
 *            items: [{ inventarioId?, descripcion, cantidad, unidad, precioEstimado }] }
 * No hay proveedor fijo: proveedorId puede apuntar a un registro de la hoja
 * Proveedores o quedar vacío si aún no se ha decidido a quién comprarle.
 */
function Solicitudes_create(payload) {
  return withLock_(function () {
    var folio = nextFolioRaw_("SOLICITUDES_FOLIO_SEQ");
    var solicitudId = newId_();
    var solicitud = {
      id: solicitudId,
      folio: folio,
      proveedorId: payload.proveedorId || "",
      fecha: toDateOrNow_(payload.fecha),
      estado: "pendiente",
      usuarioEmail: payload.usuarioEmail || "",
      notas: payload.notas || "",
    };
    appendObjectRaw_("Solicitudes", solicitud);

    var items = payload.items || [];
    var detalleRows = items.map(function (it) {
      var row = {
        id: newId_(),
        solicitudId: solicitudId,
        inventarioId: it.inventarioId || "",
        descripcion: it.descripcion || "",
        cantidad: it.cantidad,
        unidad: it.unidad || "",
        precioEstimado: it.precioEstimado || "",
      };
      appendObjectRaw_("SolicitudesDetalle", row);
      return row;
    });

    return { solicitud: solicitud, detalle: detalleRows };
  });
}

/** Uso típico: cambiar `estado` (pendiente/enviada/recibida/cancelada) o `notas`. */
function Solicitudes_update(payload) {
  return withLock_(function () {
    var patch = Object.assign({}, payload);
    delete patch.id;
    delete patch.folio;
    return updateObjectByIdRaw_("Solicitudes", payload.id, patch);
  });
}

function Solicitudes_delete(payload) {
  return withLock_(function () {
    return deleteObjectByIdRaw_("Solicitudes", payload.id);
  });
}
