function Gastos_list(payload) {
  return listObjects_("Gastos", buildFilter_(payload));
}

function Gastos_get(payload) {
  var sheet = getSheet_("Gastos");
  var found = findRowById_(sheet, payload.id);
  if (!found) throw new Error("Gasto no encontrado: " + payload.id);
  return found;
}

function Gastos_create(payload) {
  return withLock_(function () {
    var folio = nextFolioRaw_("GASTOS_FOLIO_SEQ");
    var obj = Object.assign({}, payload, {
      id: newId_(),
      folio: folio,
      fecha: toDateOrNow_(payload.fecha),
    });
    return appendObjectRaw_("Gastos", obj);
  });
}

function Gastos_update(payload) {
  return withLock_(function () {
    var patch = Object.assign({}, payload);
    delete patch.id;
    delete patch.folio; // el folio nunca se reasigna
    return updateObjectByIdRaw_("Gastos", payload.id, patch);
  });
}

function Gastos_delete(payload) {
  return withLock_(function () {
    return deleteObjectByIdRaw_("Gastos", payload.id);
  });
}
