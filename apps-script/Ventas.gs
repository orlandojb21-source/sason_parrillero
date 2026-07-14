function Ventas_list(payload) {
  return listObjects_("Ventas", buildFilter_(payload));
}

function Ventas_get(payload) {
  var sheet = getSheet_("Ventas");
  var venta = findRowById_(sheet, payload.id);
  if (!venta) throw new Error("Venta no encontrada: " + payload.id);
  var detalle = listObjects_("VentasDetalle", function (d) {
    return String(d.ventaId) === String(payload.id);
  });
  return { venta: venta, detalle: detalle };
}

/**
 * payload: { fecha, usuarioEmail, metodoPago, notas,
 *            items: [{ inventarioId?, descripcion, cantidad, precioUnitario }] }
 * El total se calcula en el servidor a partir de los items. Si un item trae
 * inventarioId, se descuenta ese stock y se registra el movimiento asociado.
 */
function Ventas_create(payload) {
  return withLock_(function () {
    var items = payload.items || [];
    var total = items.reduce(function (sum, it) {
      return sum + (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0);
    }, 0);

    var folio = nextFolioRaw_("VENTAS_FOLIO_SEQ");
    var ventaId = newId_();
    var venta = {
      id: ventaId,
      folio: folio,
      fecha: toDateOrNow_(payload.fecha),
      usuarioEmail: payload.usuarioEmail || "",
      metodoPago: payload.metodoPago || "",
      total: total,
      notas: payload.notas || "",
    };
    appendObjectRaw_("Ventas", venta);

    var invSheet = getSheet_("Inventario");
    var invHeaders = getHeaders_(invSheet);

    var detalleRows = items.map(function (it) {
      var subtotal = (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0);
      var row = {
        id: newId_(),
        ventaId: ventaId,
        inventarioId: it.inventarioId || "",
        descripcion: it.descripcion || "",
        cantidad: it.cantidad,
        precioUnitario: it.precioUnitario,
        subtotal: subtotal,
      };
      appendObjectRaw_("VentasDetalle", row);

      if (it.inventarioId) {
        var invItem = findRowById_(invSheet, it.inventarioId);
        if (invItem) {
          var merged = {};
          invHeaders.forEach(function (h) {
            merged[h] = invItem[h];
          });
          merged.stockActual = (Number(invItem.stockActual) || 0) - (Number(it.cantidad) || 0);
          merged.actualizadoEn = nowDate_();
          invSheet.getRange(invItem._row, 1, 1, invHeaders.length).setValues([objectToRow_(invHeaders, merged)]);

          appendObjectRaw_("MovimientosInventario", {
            id: newId_(),
            inventarioId: it.inventarioId,
            tipo: "salida",
            cantidad: it.cantidad,
            motivo: "Venta",
            referencia: ventaId,
            usuarioEmail: payload.usuarioEmail || "",
            fecha: nowDate_(),
          });
        }
      }
      return row;
    });

    return { venta: venta, detalle: detalleRows };
  });
}

/**
 * Elimina solo el encabezado de la venta. El detalle y los movimientos de
 * inventario ya generados se conservan como registro histórico (el stock no
 * se revierte automáticamente).
 */
function Ventas_delete(payload) {
  return withLock_(function () {
    return deleteObjectByIdRaw_("Ventas", payload.id);
  });
}
