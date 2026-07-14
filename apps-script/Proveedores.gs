var ProveedoresCrud = makeCrud_("Proveedores");

function Proveedores_list(payload) {
  return ProveedoresCrud.list(payload);
}

function Proveedores_get(payload) {
  return ProveedoresCrud.get(payload);
}

function Proveedores_create(payload) {
  var withDefaults = Object.assign({ activo: true, creadoEn: nowDate_() }, payload);
  return ProveedoresCrud.create(withDefaults);
}

function Proveedores_update(payload) {
  return ProveedoresCrud.update(payload);
}

function Proveedores_delete(payload) {
  return ProveedoresCrud.delete(payload);
}
