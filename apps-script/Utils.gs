/**
 * Utils.gs — helpers genéricos sobre el Spreadsheet contenedor.
 *
 * Regla de oro para evitar deadlocks: LockService.getScriptLock() NO es
 * reentrante de forma segura. Cada acción de escritura expuesta al router
 * (en Code.gs) debe llamar a withLock_ EXACTAMENTE UNA VEZ, y dentro de ese
 * callback usar solo las primitivas "Raw" (sin lock propio). Nunca anides
 * withLock_ dentro de otro withLock_.
 */

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error("Hoja no encontrada: " + name);
  return sheet;
}

function getHeaders_(sheet) {
  var lastCol = sheet.getLastColumn();
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

function rowsToObjects_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var headers = getHeaders_(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values.map(function (row, idx) {
    var obj = {};
    headers.forEach(function (h, i) {
      obj[h] = row[i];
    });
    obj._row = idx + 2; // fila real en la hoja (1-based), útil para update/delete
    return obj;
  });
}

function objectToRow_(headers, obj) {
  return headers.map(function (h) {
    return obj[h] !== undefined && obj[h] !== null ? obj[h] : "";
  });
}

function findRowById_(sheet, id) {
  var objs = rowsToObjects_(sheet);
  for (var i = 0; i < objs.length; i++) {
    if (String(objs[i].id) === String(id)) return objs[i];
  }
  return null;
}

function newId_() {
  return Utilities.getUuid();
}

function nowDate_() {
  return new Date();
}

function toDateOrNow_(value) {
  return value ? new Date(value) : new Date();
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

// --- Primitivas SIN lock propio: solo usarlas dentro de un withLock_ ---

function appendObjectRaw_(sheetName, obj) {
  var sheet = getSheet_(sheetName);
  var headers = getHeaders_(sheet);
  sheet.appendRow(objectToRow_(headers, obj));
  return obj;
}

function updateObjectByIdRaw_(sheetName, id, patch) {
  var sheet = getSheet_(sheetName);
  var headers = getHeaders_(sheet);
  var existing = findRowById_(sheet, id);
  if (!existing) throw new Error("No encontrado en " + sheetName + ": " + id);
  var merged = {};
  headers.forEach(function (h) {
    merged[h] = existing[h];
  });
  Object.keys(patch).forEach(function (k) {
    merged[k] = patch[k];
  });
  sheet.getRange(existing._row, 1, 1, headers.length).setValues([objectToRow_(headers, merged)]);
  return merged;
}

function deleteObjectByIdRaw_(sheetName, id) {
  var sheet = getSheet_(sheetName);
  var existing = findRowById_(sheet, id);
  if (!existing) throw new Error("No encontrado en " + sheetName + ": " + id);
  sheet.deleteRow(existing._row);
  return { id: id };
}

function nextFolioRaw_(counterKey) {
  var props = PropertiesService.getScriptProperties();
  var current = parseInt(props.getProperty(counterKey) || "0", 10);
  var next = current + 1;
  props.setProperty(counterKey, String(next));
  return next;
}

function listObjects_(sheetName, filterFn) {
  var sheet = getSheet_(sheetName);
  var objs = rowsToObjects_(sheet);
  return filterFn ? objs.filter(filterFn) : objs;
}

function buildFilter_(payload) {
  if (!payload) return null;
  var keys = Object.keys(payload).filter(function (k) {
    return k !== "desde" && k !== "hasta";
  });
  if (keys.length === 0) return null;
  return function (obj) {
    return keys.every(function (k) {
      return String(obj[k]) === String(payload[k]);
    });
  };
}

/**
 * CRUD genérico para entidades de una sola hoja (Proveedores, Usuarios, ...).
 * Cada método de escritura toma el lock exactamente una vez.
 */
function makeCrud_(sheetName) {
  return {
    list: function (payload) {
      return listObjects_(sheetName, buildFilter_(payload));
    },
    get: function (payload) {
      var sheet = getSheet_(sheetName);
      var found = findRowById_(sheet, payload.id);
      if (!found) throw new Error("No encontrado en " + sheetName + ": " + payload.id);
      return found;
    },
    create: function (payload) {
      return withLock_(function () {
        var obj = Object.assign({ id: newId_() }, payload);
        return appendObjectRaw_(sheetName, obj);
      });
    },
    update: function (payload) {
      return withLock_(function () {
        var patch = Object.assign({}, payload);
        delete patch.id;
        return updateObjectByIdRaw_(sheetName, payload.id, patch);
      });
    },
    delete: function (payload) {
      return withLock_(function () {
        return deleteObjectByIdRaw_(sheetName, payload.id);
      });
    },
  };
}
