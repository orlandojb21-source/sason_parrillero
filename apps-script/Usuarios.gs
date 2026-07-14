var UsuariosCrud = makeCrud_("Usuarios");

function Usuarios_list(payload) {
  return UsuariosCrud.list(payload);
}

/** Usada por el login: si payload.email viene, busca por email (case-insensitive). */
function Usuarios_get(payload) {
  if (payload && payload.email) {
    var email = String(payload.email).toLowerCase();
    var found = listObjects_("Usuarios").filter(function (u) {
      return String(u.email).toLowerCase() === email;
    })[0];
    if (!found) throw new Error("Usuario no encontrado: " + payload.email);
    return found;
  }
  return UsuariosCrud.get(payload);
}

function Usuarios_create(payload) {
  var withDefaults = Object.assign({ activo: true, creadoEn: nowDate_() }, payload);
  return UsuariosCrud.create(withDefaults);
}

function Usuarios_update(payload) {
  return UsuariosCrud.update(payload);
}

function Usuarios_delete(payload) {
  return UsuariosCrud.delete(payload);
}
