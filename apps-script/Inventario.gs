var InventarioCrud = makeCrud_("Inventario");

function Inventario_list(payload) {
  return InventarioCrud.list(payload);
}

function Inventario_get(payload) {
  return InventarioCrud.get(payload);
}

function Inventario_create(payload) {
  var withDefaults = Object.assign(
    {
      stockActual: 0,
      stockMinimo: 0,
      creadoEn: nowDate_(),
      actualizadoEn: nowDate_(),
    },
    payload
  );
  return InventarioCrud.create(withDefaults);
}

function Inventario_update(payload) {
  var patch = Object.assign({}, payload, { actualizadoEn: nowDate_() });
  return InventarioCrud.update(patch);
}

function Inventario_delete(payload) {
  return InventarioCrud.delete(payload);
}

/**
 * payload: { inventarioId, tipo: 'entrada'|'salida'|'ajuste', cantidad, motivo, referencia, usuarioEmail }
 * 'entrada'/'salida' suman/restan cantidad al stock actual; 'ajuste' fija el valor absoluto.
 */
function Inventario_registrarMovimiento(payload) {
  return withLock_(function () {
    var invSheet = getSheet_("Inventario");
    var item = findRowById_(invSheet, payload.inventarioId);
    if (!item) throw new Error("Producto de inventario no encontrado: " + payload.inventarioId);

    var delta = Number(payload.cantidad) || 0;
    var current = Number(item.stockActual) || 0;
    var nextStock;
    if (payload.tipo === "entrada") nextStock = current + delta;
    else if (payload.tipo === "salida") nextStock = current - delta;
    else if (payload.tipo === "ajuste") nextStock = delta;
    else throw new Error("Tipo de movimiento inválido: " + payload.tipo);

    var invHeaders = getHeaders_(invSheet);
    var merged = {};
    invHeaders.forEach(function (h) {
      merged[h] = item[h];
    });
    merged.stockActual = nextStock;
    merged.actualizadoEn = nowDate_();
    invSheet.getRange(item._row, 1, 1, invHeaders.length).setValues([objectToRow_(invHeaders, merged)]);

    var movObj = {
      id: newId_(),
      inventarioId: payload.inventarioId,
      tipo: payload.tipo,
      cantidad: delta,
      motivo: payload.motivo || "",
      referencia: payload.referencia || "",
      usuarioEmail: payload.usuarioEmail || "",
      fecha: nowDate_(),
    };
    appendObjectRaw_("MovimientosInventario", movObj);

    return { item: merged, movimiento: movObj };
  });
}

function Inventario_listMovimientos(payload) {
  return listObjects_("MovimientosInventario", buildFilter_(payload));
}
